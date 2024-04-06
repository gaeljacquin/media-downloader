'use client';

import { Command } from '@tauri-apps/api/shell';
import { useEffect, useRef, useState } from 'react';
import { Id, toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { toastify } from '@/app/constants';
import { ytdlp } from '@/app/functions';
import { FormInput } from '@/app/types/form-input';
import useFormStore from '@/app/stores/form-store';
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/app/components/ui/form";

const schema = yup
  .object()
  .shape({
    url: yup.string().url('Please enter a valid URL').required('URL required'),
    audio_only: yup.boolean().optional(),
    save_to: yup.string().optional(),
  })
  .required();

export default function Main() {
  const [clickable, setClickable] = useState(true);
  const { downloadLocation, setDownloadLocation } = useFormStore();
  const toastId = useRef<unknown>(null);

  const form = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      audio_only: true,
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
    setClickable(false);
    toastId.current = toast.info('Starting download...', toastify.optionSet2);

    if (data.save_to) {
      setDownloadLocation(data.save_to);
    }

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

   useEffect(() => {
    setValue('save_to', downloadLocation);
  }, [downloadLocation, setValue]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full items-start gap-8"
      >
        <fieldset className="grid gap-8 rounded-lg border p-4">
          <div className="grid gap-3">
            <Label htmlFor="model">Link</Label>
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
          <div className="grid gap-3">
            <Label htmlFor="role">Save to</Label>
            <Input
              id="save_to"
              className="form-text-input"
              {...register('save_to', {
                value: downloadLocation,
              })}
              type="text"
              placeholder="Optional, defaults to install location"
              autoComplete="off"
            />
          </div>
          <FormField
            name="audio_only"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="audio_only"
                    {...register('audio_only')}
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
        <Button
          className={`mt-5 ${!clickable && "bg-gray-600 hover:cursor-not-allowed"}`}
          type="submit"
        >
          Download
        </Button>
      </form>
    </Form>
  )
}
