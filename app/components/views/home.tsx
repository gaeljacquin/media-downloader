'use client';

import { Command } from '@tauri-apps/api/shell';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
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

const schema = yup
  .object()
  .shape({
    url: yup.string().url('Please enter a valid URL').required('URL required'),
    audioOnly: yup.boolean().required(),
    saveTo: yup.string().optional(),
  })
  .required();

export default function Home() {
  const { downloadLocation, notifications } = useSettingsStore();
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

  const notify = async (outputCode: number | null) => {
    let notificationBody = '';

    if (outputCode === 0) {
      notificationBody = 'Download complete';
    } else {
      notificationBody = 'Download failed';
    }

    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    if (permissionGranted) {
      sendNotification({ title: 'Media Downloader', body: notificationBody });
    }
  }

  const onSubmit: SubmitHandler<HomeForm> = async (data: HomeForm) => {
    let output;
    setClickable(false);
    setOutput('Starting download...\r\n');

    try {
      const params = ytdlp.addOptions(data);
      const command = Command.sidecar('binaries/yt-dlp', params, { encoding: 'utf-8' });

      command.stdout.on('data', (line) => {
        console.log(`Stdout: ${line}`);
        setOutput(`\r\n${line}`);
      });

      command.stderr.on('data', (line) => {
        console.log(`Stderr: ${line}`);
        setOutput(`\r\n${line}`);
      });

      output = await command.execute();
      notifications && notify(output.code);
    } catch (error) {
      setOutput(`\r\n${error}`);
      console.error('Error: ', error);
    } finally {
      if (typeof output?.code === "number") {
        setClickable(true);
        setOutput(`\r\n${downloadLocation} $ `);
      }
    }
  }

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
              <div className="grid gap-3">
                <legend className="-ml-1 px-1 text-sm font-medium">URL</legend>
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
              <fieldset className="grid gap-8 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Options</legend>
                <FormField
                  name="audioOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
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
              {clickable ?
                <Button
                  className="mt-2 mb-20"
                  type="submit"
                >
                  Download
                </Button>
              :
                <>
                  <div className="sk-circle-fade sk-center mb-2">
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                    <div className="sk-circle-fade-dot"></div>
                  </div>
                  <div className="text-center">
                    <p>Download in progress...</p>
                    <p>See logs for more details</p>
                  </div>
                </>
              }
            </fieldset>
            <Input
              id="saveTo"
              {...register('saveTo')}
              type="hidden"
            />
          </form>
        </Form>
      </div>
    </>
  )
}
