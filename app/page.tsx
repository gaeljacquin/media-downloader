'use client';

import { invoke } from '@tauri-apps/api/tauri';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import UI from "@/app/components/ui";
import { ViewProvider } from '@/app/contexts/view';
import { TerminalOutputProvider } from '@/app/contexts/terminal-output';
import useAboutStore from '@/app/stores/about';

export default function Home() {
  const { fetchAppInfo } = useAboutStore();

  useEffect(() => {
    invoke('close_splashscreen');
    fetchAppInfo();
  }, [fetchAppInfo])

  return (
    <>
      <ViewProvider>
        <TerminalOutputProvider>
        <>
          <ToastContainer
            newestOnTop
          />
          <UI />
        </>
        </TerminalOutputProvider>
      </ViewProvider>
    </>
  )
}
