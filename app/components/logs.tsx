'use client';

import dynamic from 'next/dynamic';

import Placeholder from '@/app/components/placeholder';

const DynamicTerminal = dynamic(() => import('@/app/components/terminal-display'), {
  ssr: false,
});

export default function Logs() {
  return (
    <>
      <div x-chunk="dashboard-03-chunk-0">
        <DynamicTerminal />
      </div>
      <Placeholder />
    </>
  )
}
