'use client';

import dynamic from 'next/dynamic';

const DynamicTerminalDisplay = dynamic(() => import('@/app/components/terminal-display'), {
  ssr: false,
});

export default function Logs() {
  return (
    <>
      <div x-chunk="dashboard-03-chunk-0">
        <DynamicTerminalDisplay />
      </div>
    </>
  )
}
