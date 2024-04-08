'use client';

import { ToastContainer } from 'react-toastify';

import UI from "@/app/components/ui";
import { ViewProvider } from '@/app/contexts/view';
import { TerminalOutputProvider } from '@/app/contexts/terminal-output';

export default function Home() {
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
