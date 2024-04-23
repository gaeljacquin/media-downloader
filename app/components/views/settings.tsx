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
import { misc } from '@/app/functions';

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
    terminalFontSize,
    setTerminalFontSize,
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
      misc.handleEscapePress();
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
                <Input
                  id="saveTo"
                  className="form-text-input"
                  {...register('saveTo', {
                    value: downloadLocation,
                  })}
                  type="text"
                  placeholder={`Defaults to ${defaultSettings.downloadLocation}`}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="terminalFontSize">Terminal Font Size</Label>
                <Input
                  id="terminalFontSize"
                  {...register('terminalFontSize', {
                    value: terminalFontSize,
                  })}
                  placeholder={terminalFontSize.toString()}
                  type="number"
                />
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
                buttonText="Reset settings"
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
