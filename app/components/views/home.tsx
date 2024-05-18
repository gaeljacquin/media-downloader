'use client';

import { Command } from '@tauri-apps/api/shell';
import { useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { Id, toast } from 'react-toastify';
import * as yup from 'yup';

import { toastify } from '@/app/constants';
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
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import useSettingsStore from '@/app/stores/settings';
import useHomeStore from '@/app/stores/home';
import useLogsStore from '@/app/stores/logs';
import MDPopover from '@/app/components/md-popover';
import { misc } from '@/app/functions';
import { icons } from '@/app/components/icons';

const schema = yup
  .object()
  .shape({
    type: yup.string().required(),
    url: yup.string().when('type', {
      is: (val: string) => val === 'url',
      then: () => yup.string().url('Please enter a valid URL').required('URL required'),
      otherwise: () => yup.string().optional(),
    }),
    file: yup.string().when('type', {
      is: (val: string) => val === 'file',
      then: () => yup.string().required('File required'),
      otherwise: () => yup.string().optional(),
    }),
    audioOnly: yup.boolean().required(),
    saveTo: yup.string().optional(),
  })
  .required();

export default function Home() {
  const toastId = useRef<unknown>(null);
  const { downloadLocation, notifications } = useSettingsStore();
  const { formData, setFormData, clickable, setClickable } = useHomeStore();
  const { setLogs } = useLogsStore();
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
  const selectedType = watch('type');
  const types = [
    { "label": "URL (video or playlist)", "value": "url" },
    { "label": "File", "value": "file" },
  ]

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

  const getKillProcessByOSType = async () => {
    const { type } = await import('@tauri-apps/api/os');
    const osType = await type();
    let process, args;

    switch (osType) {
      case 'Windows_NT':
        process = 'win-kill-task';
        args = ['/IM', 'yt-dlp*', '/F'];
        break;
      case 'Linux':
      case 'Darwin':
        process = 'nix-task';
        args = ['-9', 'yt-dlp'];
      default:
        process = '';
        args = [''];
        console.error('OS type not supported');
    }

    return { process, args };
  }

  async function browse() {
    const open = await (await import('@tauri-apps/api/dialog')).open;
    const selectedFile = await open({
      multiple: false,
      filters: [{
        name: 'Text files',
        extensions: ['txt', 'md'],
      }],
      defaultPath: await (await import('@tauri-apps/api/path')).homeDir(),
    });

    selectedFile && misc.replaceWithTilde(selectedFile as string).then(selectedFileTilde => {
      form.setValue('file', selectedFileTilde);
      form.trigger('file');
    });
  }

  const onSubmit: SubmitHandler<HomeForm> = async (data: HomeForm) => {
    let output
    setClickable(false);

    try {
      const { invoke } = await import('@tauri-apps/api/tauri');
      const isCmdInPath: boolean = await invoke('check_cmd_in_path');

      if (!isCmdInPath) {
        throw ('yt-dlp not found in PATH');
      }

      const params = ytdlp.addOptions(data).filter(param => param !== undefined) as string[];
      const command = new Command('yt-dlp', params, { encoding: 'utf-8' });

      command.stdout.on('data', (line) => {
        setLogs(`${line}\r\n`);
        console.log(`Stdout: ${line}`);
      });

      command.stderr.on('data', (line) => {
        setLogs(`${line}\r\n`);
        console.log(`Stderr: ${line}`);
      });

      output = await command.execute();
      notifications && notify(output.code);
    } catch (error) {
      toast.dismiss(toastId.current as unknown as Id);
      toast.error((error as Error).message, toastify.optionSet1);
      console.error('Error: ', error);
    } finally {
      if (typeof output?.code === "number") {
        setClickable(true);
        setLogs(`\r\n`);
      }
    }
  }

  const onCancel = async () => {
    misc.handleEscapePress();
    setClickable(true);

    const command = await getKillProcessByOSType().then(({ process, args }: { process: string, args: string[] }) => new Command(process, args));

    command.on('close', data => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`);
    });

    await command.execute();
  }

  const spinner = () => {
    return (
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
    )
  }

  useEffect(() => {
    const subscription = watch((value) =>
      setFormData(value as HomeForm)
    )
    return () => subscription.unsubscribe()
  }, [setFormData, watch]);

  useEffect(() => {
    setValue('saveTo', downloadLocation);
    setValue('type', formData.type);
  }, [setValue, downloadLocation, formData.type]);

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
                <RadioGroup
                  defaultValue={formData.type}
                  {...register('type')}
                  className="flex flex-col space-y-1"
                >
                  {types.map((type, index) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      {...register('type')}
                      key={type.value + '-' + index}
                    >
                      <FormControl key={type.value + '-control'}>
                        <RadioGroupItem value={type.value} id={type.value + "-id"} key={type.value + '-radio'} />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor={type.value + "-id"} key={type.value + '-label'}>
                        {type.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
                <div className="mt-2">
                  {selectedType === 'url' && (
                    <>
                      <>
                        <Input
                          id="url"
                          aria-invalid={errors.url ? "true" : "false"}
                          className="form-text-input"
                          {...register('url')}
                          type="text"
                          placeholder=" "
                          autoComplete="off"
                        />
                      </>
                      {errors.url && (
                        <span role="alert" className="form-error-message">
                          <>{errors.url.message}</>
                        </span>
                      )}
                    </>
                  )}
                  {selectedType === 'file' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          className="form-text-input bg-gray-400"
                          {...register('file')}
                          type="label"
                          placeholder=" "
                          autoComplete="off"
                        />
                        <Button
                          aria-label="Browse"
                          className={`rounded border border-gray-300`}
                          size="icon"
                          variant="ghost"
                          type="button"
                          onClick={() => browse()}
                        >
                          <icons.EllipsisIcon className="h-5 w-5" />
                        </Button>
                      </div>
                      {errors.file && (
                        <span role="alert" className="form-error-message">
                          <>{errors.file.message}</>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <fieldset className="grid gap-8 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Options</legend>
                <FormField
                  name="audioOnly"
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-row items-start space-x-2 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="audioOnly"
                          {...register('audioOnly')}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="audioOnly">
                          Audio only
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </fieldset>
              <Button
                className={`mt-5 ${!clickable ? 'bg-gray-600 hover:cursor-not-allowed' : 'mb-64'}`}
                type="submit"
                disabled={!clickable}
              >
                Download
              </Button>
              {!clickable && (
                <>
                  {spinner()}
                  <div className="text-center">
                    <p>Download in progress...</p>
                    <p>See logs for more details</p>
                  </div>
                  <MDPopover
                    buttonText="Cancel"
                    buttonClasses="mt-2 mb-4"
                    handleClick={() => onCancel()}
                  />
                </>
              )}
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
