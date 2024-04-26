'use client';

import { invoke } from '@tauri-apps/api/tauri';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import UI from "@/app/components/ui";
import { ViewProvider } from '@/app/contexts/view';

export default function Home() {
  useEffect(() => {
    invoke('close_splashscreen');
  }, [])

  return (
    <>
      <ViewProvider>
        <>
          <ToastContainer
            newestOnTop
          />
          <UI />
        </>
      </ViewProvider>
    </>
  )
}
