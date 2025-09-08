import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { invoke } from '@tauri-apps/api/core';
import { Command } from '@tauri-apps/plugin-shell';
import { open } from '@tauri-apps/plugin-dialog';
import { homeDir } from '@tauri-apps/api/path';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { type as osType } from '@tauri-apps/plugin-os';

import { useAppStore } from '../../stores/useAppStore';
import { DownloadOptions } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const schema = z.object({
  type: z.enum(['url', 'file']),
  url: z.string().url('Please enter a valid URL').optional(),
  file: z.string().optional(),
  audioOnly: z.boolean(),
  saveTo: z.string().optional(),
}).refine((data) => {
  if (data.type === 'url' && !data.url) {
    return false;
  }
  if (data.type === 'file' && !data.file) {
    return false;
  }
  return true;
}, {
  message: "Please fill in the required fields",
  path: ['url'],
});

function addYtDlpOptions(data: DownloadOptions): string[] {
  const res: string[] = [];

  if (data.audioOnly) {
    res.push('-x');
  }

  if (data.saveTo) {
    res.push('-P');
    res.push(data.saveTo);
  }

  if (data.type === 'file') {
    res.push('-a');
    res.push(data.file);
  } else if (data.type === 'url') {
    res.push(data.url);
  }

  return res;
}

export const HomeView = () => {
  const { downloadOptions, updateDownloadOptions, isDownloading, setIsDownloading, addLog, settings } = useAppStore();
  
  const form = useForm<DownloadOptions>({
    resolver: zodResolver(schema),
    defaultValues: downloadOptions,
  });

  const { watch, setValue } = form;
  const selectedType = watch('type');

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
  };

  const getKillProcessByOSType = async () => {
    const osTypeStr = await osType();
    let process: string, args: string[];

    switch (osTypeStr) {
      case 'windows':
        process = 'taskkill';
        args = ['/IM', 'yt-dlp*', '/F'];
        break;
      case 'linux':
      case 'macos':
        process = 'pkill';
        args = ['-9', 'yt-dlp'];
        break;
      default:
        process = '';
        args = [''];
        console.error('OS type not supported');
    }

    return { process, args };
  };

  const browse = async () => {
    const selectedFile = await open({
      multiple: false,
      filters: [{
        name: 'Text files',
        extensions: ['txt', 'md'],
      }],
      defaultPath: await homeDir(),
    });

    if (selectedFile) {
      setValue('file', selectedFile as string);
    }
  };

  const onSubmit: SubmitHandler<DownloadOptions> = async (data: DownloadOptions) => {
    let output: { code: number | null } | undefined;
    setIsDownloading(true);

    try {
      const isCmdInPath: boolean = await invoke('check_cmd_in_path');

      if (!isCmdInPath) {
        throw new Error('yt-dlp not found in PATH');
      }

      const params = addYtDlpOptions(data).filter(param => param !== undefined) as string[];
      addLog(`Starting download: yt-dlp ${params.join(' ')}`);
      const command = Command.create('yt-dlp', params);

      command.stdout.on('data', (line) => {
        addLog(`${line}`);
        console.log(`Stdout: ${line}`);
      });

      command.stderr.on('data', (line) => {
        addLog(`${line}`);
        console.log(`Stderr: ${line}`);
      });

      command.on('error', (error) => {
        addLog(`Command error: ${error}`);
        console.error('Command error:', error);
      });

      output = await command.execute();
      addLog(`Download completed with exit code: ${output.code}`);
      if (settings.enableNotifications && output) {
        notify(output.code);
      }
    } catch (error) {
      console.error('Error: ', error);
      addLog(`Error: ${(error as Error).message}\r\n`);
    } finally {
      if (typeof output?.code === "number") {
        setIsDownloading(false);
        addLog(`\r\n`);
      }
    }
  };

  const onCancel = async () => {
    setIsDownloading(false);

    const { process, args } = await getKillProcessByOSType();
    const command = Command.create(process, args);

    command.on('close', data => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`);
    });

    await command.execute();
  };

  useEffect(() => {
    const subscription = watch((value) =>
      updateDownloadOptions(value as DownloadOptions)
    );
    return () => subscription.unsubscribe();
  }, [updateDownloadOptions, watch]);

  useEffect(() => {
    setValue('saveTo', settings.savePath);
    setValue('type', downloadOptions.type);
  }, [setValue, settings.savePath, downloadOptions.type]);

  return (
    <div className="p-6 h-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="url" id="url" />
                          <Label htmlFor="url" className="font-normal">
                            URL (video or playlist)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="file" id="file" />
                          <Label htmlFor="file" className="font-normal">
                            File
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4">
                {selectedType === 'url' && (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter URL here..."
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === 'file' && (
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              placeholder="Select a file..."
                              className="h-12 bg-muted"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={browse}
                            className="h-12 w-12"
                          >
                            ...
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="audioOnly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Audio only
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="additionalFlags">Additional flags</Label>
                    <Input
                      id="additionalFlags"
                      placeholder="Additional command line flags (not implemented yet)"
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Additional command line flags to pass to the downloader (placeholder)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isDownloading}
                className="w-full h-12"
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>

              {isDownloading && (
                <div className="text-center space-y-2">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <div>
                    <p>Download in progress...</p>
                    <p className="text-sm text-muted-foreground">See logs for more details</p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onCancel}
                    className="mt-2"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Input
            {...form.register('saveTo')}
            type="hidden"
          />
        </form>
      </Form>
    </div>
  );
};