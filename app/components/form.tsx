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

const schema = yup
  .object()
  .shape({
    url: yup.string().url('Please enter a valid URL').required('URL required'),
    audio_only: yup.boolean().optional(),
    save_to: yup.string().optional(),
  })
  .required();

export default function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });
  const [clickable, setClickable] = useState(true);
  const { downloadLocation, setDownloadLocation } = useFormStore();
  const toastId = useRef<unknown>(null);

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
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
      >
        <div className="flex flex-wrap mt-5">
          <div className="w-full mb-3">
            <div className="relative w-full mb-5">
              <div className="flex space-x-2 mb-2 text-gray-100">
                <svg className="w-6 h-auto text-gray-100" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <label className="block text-gray-100 text-md font-bold mb-2" htmlFor="url">
                  URL
                </label>
              </div>
              <input
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
          </div>
          <div className="w-full mb-1">
            <div className="flex items-center font-black mb-7 space-x-2">
              <input
                id="audio_only"
                {...register('audio_only')}
                type="checkbox"
              />
              <label className="block text-gray-100 text-md font-bold" htmlFor="audio_only">
                Audio only
              </label>
            </div>
          </div>
          <div className="w-full mb-1">
            <div className="relative w-full mb-5">
               <div className="flex space-x-2 mb-2 text-gray-100">
                <svg className="w-6 h-auto" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                <label className="block text-md font-bold" htmlFor="save_to">
                  Save to
                </label>
              </div>
              <input
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
          </div>
        </div>
        <button className={`px-4 py-1.5 rounded-md shadow-lg font-medium text-gray-100 block transition duration-300 ${clickable ? "bg-yt-dlp-gray hover:shadow-animate" : "bg-gray-600 hover:cursor-not-allowed"} mt-5`} type="submit" disabled={!clickable}>
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-auto" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <span>Download</span>
          </div>
        </button>
      </form>
    </>
  );
}
