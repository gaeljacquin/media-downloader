'use client';

import { useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { toastify } from '@/app/constants';
import { type SettingsForm } from '@/app/types/form';
import useSettingsStore, { defaultSettings } from '@/app/stores/settings';
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/app/components/ui/form";
import MDPopover from '@/app/components/md-popover';
import { icons } from "@/app/components/icons";

const schema = yup
  .object()
  .shape({
    saveTo: yup.string().optional(),
    terminalFontSize: yup.number().required(),
    notifications: yup.boolean().required(),
  })
  .required();

export default function Settings() {
  const [clickable, setClickable] = useState(true);
  const toastId = useRef<unknown>(null);
  const {
    downloadLocation,
    setDownloadLocation,
    resetDownloadLocation,
    terminalFontSize,
    setTerminalFontSize,
    resetTerminalFontSize,
    notifications,
    setNotifications,
    resetSettings,
  } = useSettingsStore();

  const form = useForm<SettingsForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      notifications: notifications,
    },
  });
  const {
    register,
    handleSubmit,
    reset,
  } = form;

  async function replaceWithTilde(path: string) {
    const homeDir = await (await import('@tauri-apps/api/path')).homeDir(); // dynamically importing module to fix console error

    if (path.startsWith(homeDir)) {
      return path.replace(homeDir, '~/').replace('\\', '/');
    }

    return path;
  }

  async function browse() {
    const open = await (await import('@tauri-apps/api/dialog')).open;
    const selectedDir = await open({
      directory: true,
      multiple: false,
      defaultPath: await (await import('@tauri-apps/api/path')).homeDir(),
    });

    selectedDir && replaceWithTilde(selectedDir as string).then(selectedDirTilde => {
      form.setValue('saveTo', selectedDirTilde);
    });
  }

  const onSubmit: SubmitHandler<SettingsForm> = async (data: SettingsForm) => {
    setClickable(false);

    try {
      setDownloadLocation(data.saveTo ?? '');
      setTerminalFontSize(data.terminalFontSize);
      setNotifications(data.notifications);
      toast.success('Settings saved', toastify.optionSet2);
      setClickable(true);
    } catch (error) {
      toast.dismiss(toastId.current as Id);
      toast.error('Something went wrong', toastify.optionSet1);
      setClickable(true);
      console.error('Error: ', error);
    }
  };

  const onReset = () => {
    try {
      resetSettings();
      reset(defaultSettings);
      toast.success('Settings restored to their original defaults', toastify.optionSet2);
    } catch (error) {
      toast.dismiss(toastId.current as Id);
      toast.error('Something went wrong', toastify.optionSet1);
      console.error('Error: ', error);
    }
  }

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
                <Label htmlFor="saveTo">Save to</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="saveTo"
                    className="form-text-input bg-gray-400"
                    {...register('saveTo', {
                      value: downloadLocation,
                    })}
                    type="label"
                    autoComplete="off"
                    readOnly
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
                  <MDPopover
                    buttonText="Reset"
                    buttonClasses=""
                    handleClick={() => {
                      resetDownloadLocation();
                      form.setValue('saveTo', defaultSettings.downloadLocation);
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="terminalFontSize">Terminal Font Size</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="terminalFontSize"
                    {...register('terminalFontSize', {
                      value: terminalFontSize,
                    })}
                    placeholder={terminalFontSize.toString()}
                    type="number"
                  />
                  <MDPopover
                    buttonText="Reset"
                    buttonClasses=""
                    handleClick={() => {
                      resetTerminalFontSize();
                      form.setValue('terminalFontSize', defaultSettings.terminalFontSize);
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <FormField
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 ml-1 mb-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="notifications"
                          {...register('notifications')}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Enable system notifications (Does not affect in-app notifications)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className={`mt-2 ${!clickable && "bg-gray-600 hover:cursor-not-allowed"}`}
                type="submit"
              >
                Save
              </Button>
              <MDPopover
                buttonText="Reset all settings"
                buttonClasses="mb-2 -mt-2"
                handleClick={() => onReset()}
              />
            </fieldset>
          </form>
        </Form>
      </div>
    </>
  )
}
