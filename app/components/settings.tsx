'use client';

import { useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { toastify } from '@/app/constants';
import { type SettingsForm } from '@/app/types/form';
import useSettingsStore from '@/app/stores/settings';
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Form } from "@/app/components/ui/form";
import Placeholder from '@/app/components/placeholder';

const schema = yup
  .object()
  .shape({
    saveTo: yup.string().optional(),
    terminalFontSize: yup.number().required(),
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
  } = useSettingsStore();

  const form = useForm<SettingsForm>({
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<SettingsForm> = async (data: SettingsForm) => {
    setClickable(false);

    try {
      setDownloadLocation(data.saveTo ?? '');
      setTerminalFontSize(data.terminalFontSize);
      toast.success('Settings saved', toastify.optionSet2);
      setClickable(true);
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
              <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
              <div className="grid gap-3">
                <Label htmlFor="saveTo">Save to</Label>
                <Input
                  id="saveTo"
                  className="form-text-input"
                  {...register('saveTo', {
                    value: downloadLocation,
                  })}
                  type="text"
                  placeholder="Defaults to binary path"
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
            </fieldset>
            <Button
              className={`mt-5 ${!clickable && "bg-gray-600 hover:cursor-not-allowed"}`}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
      <Placeholder />
    </>
  )
}
