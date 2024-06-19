'use client';

import { useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { toastify } from '@/app/constants';
import { type SettingsForm } from '@/app/types/form';
import useSettingsStore, { defaultSettings, locales } from '@/app/stores/settings';
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
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import MDPopover from '@/app/components/md-popover';
import { icons } from "@/app/components/icons";
import { misc } from '@/app/functions';

const schema = yup
  .object()
  .shape({
    saveTo: yup.string().optional(),
    logsFontSize: yup.number().required(),
    notifications: yup.boolean().required(),
    language: yup.string().required(),
  })
  .required();

export default function Settings() {
  const [clickable, setClickable] = useState(true);
  const toastId = useRef<unknown>(null);
  const {
    downloadLocation,
    setDownloadLocation,
    resetDownloadLocation,
    logsFontSize,
    setLogsFontSize,
    resetLogsFontSize,
    notifications,
    setNotifications,
    locale,
    setLocale,
    resetLocale,
    resetSettings,
  } = useSettingsStore();

  const form = useForm<SettingsForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      notifications: notifications,
      language: locale,
    },
  });
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
  } = form;

  async function browse() {
    const open = await (await import('@tauri-apps/api/dialog')).open;
    const selectedDir = await open({
      directory: true,
      multiple: false,
      defaultPath: await (await import('@tauri-apps/api/path')).homeDir(),
    });

    selectedDir && misc.replaceWithTilde(selectedDir as string).then(selectedDirTilde => {
      form.setValue('saveTo', selectedDirTilde);
    });
  }

  const onSubmit: SubmitHandler<SettingsForm> = async (data: SettingsForm) => {
    setClickable(false);

    try {
      setDownloadLocation(data.saveTo ?? '');
      setLogsFontSize(data.logsFontSize);
      setNotifications(data.notifications);
      setLocale(data.language);
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
                <Label htmlFor="logsFontSize">Logs Font Size</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logsFontSize"
                    {...register('logsFontSize', {
                      value: logsFontSize,
                    })}
                    placeholder={logsFontSize.toString()}
                    type="number"
                  />
                  <MDPopover
                    buttonText="Reset"
                    buttonClasses=""
                    handleClick={() => {
                      resetLogsFontSize();
                      form.setValue('logsFontSize', defaultSettings.logsFontSize);
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="locale">Language</Label>
                <div className="flex items-center gap-2">
                  <Select
                    {...register('language', {
                      value: locale,
                    })}
                  >
                    <SelectTrigger id="locale" className="items-start [&_[data-description]]:hidden">
                      <SelectValue placeholder="blablabla" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        Object.entries(locales).map((value, index) => (
                          <SelectItem key={value[0] + '-' + index} value={value[0]}>
                            <div className="flex items-start gap-3 font-medium text-foreground">
                              <div className="grid gap-0.5">
                                <p>
                                  {value[1].name}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <MDPopover
                    buttonText="Reset"
                    buttonClasses=""
                    handleClick={() => {
                      resetLocale();
                      form.setValue('language', defaultSettings.locale);
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
