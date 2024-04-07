'use client';

import { Command } from '@tauri-apps/api/shell';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { toastify } from '@/app/constants';
import { ytdlp } from '@/app/functions';
import { HomeForm } from '@/app/types/form';
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/app/components/ui/form";
import useSettingsStore from '../stores/settings';

const DynamicTerminal = dynamic(() => import('@/app/components/terminal-display'), {
  ssr: false,
});

const schema = yup
  .object()
  .shape({
    url: yup.string().url('Please enter a valid URL').required('URL required'),
    audioOnly: yup.boolean().optional(),
    saveTo: yup.string().optional(),
  })
  .required();

export default function Home() {
  const [clickable, setClickable] = useState(true);
  const toastId = useRef<unknown>(null);
  const { downloadLocation } = useSettingsStore();
  const form = useForm<HomeForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      audioOnly: false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<HomeForm> = async (data: HomeForm) => {
    setClickable(false);
    toastId.current = toast.info('Starting download...', toastify.optionSet2);

    try {
      const params = ytdlp.addOptions(data);
      const command = Command.sidecar('binaries/yt-dlp', params);

      await command.execute().then(() => {
        toast.dismiss(toastId.current as Id);
        toast.success('Download complete', toastify.optionSet1);
        setClickable(true);
      });
    } catch (error) {
      toast.dismiss(toastId.current as Id);
      toast.error('Something went wrong', toastify.optionSet1);
      setClickable(true);
      console.error('Error: ', error);
    }
  };

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
              {...register('saveTo', {
                value: downloadLocation,
              })}
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
