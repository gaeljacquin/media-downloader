'use client';

import { ToastContainer } from 'react-toastify';

import UI from "@/app/components/ui";
import { ViewProvider } from '@/app/contexts/view';

export default function Home() {
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
