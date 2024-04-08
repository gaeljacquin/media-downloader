'use client';

import { Command } from '@tauri-apps/api/shell';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ytdlp } from '@/app/functions';
import { HomeForm } from '@/app/types/form';
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/app/components/ui/form";
import useSettingsStore from '@/app/stores/settings';
import useHomeStore from '@/app/stores/home';
import { useTerminalOutput } from '@/app/contexts/terminal-output';

const DynamicTerminal = dynamic(() => import('@/app/components/terminal-display'), {
  ssr: false,
});

const schema = yup
  .object()
  .shape({
    url: yup.string().url('Please enter a valid URL').required('URL required'),
    audioOnly: yup.boolean().required(),
    saveTo: yup.string().optional(),
  })
  .required();

export default function Home() {
  const { downloadLocation } = useSettingsStore();
  const { formData, setFormData, clickable, setClickable } = useHomeStore();
  const { setOutput } = useTerminalOutput();
  const form = useForm<HomeForm>({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<HomeForm> = async (data: HomeForm) => {
    setClickable(false);
    setOutput('Starting download...\r\n');

    try {
      const params = ytdlp.addOptions(data);
      const command = Command.sidecar('binaries/yt-dlp', params);

      command.stdout.on('data', (line) => {
        console.log(`Stdout: ${line}`);
        setOutput(`\r\n${line}`);
      });

      command.stderr.on('data', (line) => {
        console.log(`Stderr: ${line}`);
        setOutput(`\r\n${line}`);
      });

      await command.execute().then(() =>{
        setOutput(`\r\n${downloadLocation ?  downloadLocation + ' ' : ''}$ `);
        setClickable(true);
      });
    } catch (error) {
      setOutput(`\r\n${error}`);
      setOutput(`\r\n${downloadLocation ?  downloadLocation + ' ' : ''}$ `);
      setClickable(true);
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    const subscription = watch((value) =>
      setFormData(value as HomeForm)
    )
    return () => subscription.unsubscribe()
  }, [setFormData, watch]);

  useEffect(() => {
    setValue('saveTo', downloadLocation);
  }, [setValue, downloadLocation]);

  return (
    <>
      <div className="relative flex-col items-start gap-8 flex" x-chunk="dashboard-03-chunk-0">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid w-full items-start gap-8"
          >
            <fieldset className="grid gap-8 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">Link</legend>
              <div className="grid gap-3">
                <Input
                  id="url"
                  aria-invalid={errors.url ? "true" : "false"}
                  className={`form-text-input`}
                  {...register('url')}
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                />
                {errors.url && <span role="alert" className="text-sm font-semibold p-2 rounded bg-white text-red-500">{errors.url.message}</span>}
              </div>
            </fieldset>
            <fieldset className="grid gap-8 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">Options</legend>
              <FormField
                name="audioOnly"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="audioOnly"
                        {...register('audioOnly')}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Audio only
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </fieldset>
            <Input
              id="saveTo"
              {...register('saveTo')}
              type="hidden"
            />
            <Button
              className={`mt-5 ${!clickable && "bg-gray-600 hover:cursor-not-allowed"}`}
              type="submit"
            >
              Download
            </Button>
          </form>
        </Form>
      </div>
      <DynamicTerminal />
    </>
  )
}