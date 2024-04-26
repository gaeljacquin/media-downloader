'use client';

import { Fragment, useEffect, useRef } from 'react';

import MDPopover from '@/app/components/md-popover';
import useLogsStore from '@/app/stores/logs';
import useSettingsStore from '@/app/stores/settings';

export default function Logs() {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const { logs, resetLogs } = useLogsStore();
  const { logsFontSize } = useSettingsStore();
  const scrollToBottom = () => {
    if (logoContainerRef.current) {
      logoContainerRef.current.scrollTop = logoContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const formattedLogs = logs.split('\r\n').map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));

  return (
    <>
      <div className="relative flex-col items-start gap-8 flex">
        <div className="grid w-full items-start gap-8">
          <div
            className={`logs-container`}
            ref={logoContainerRef}
          >
            <p className={`text-[${logsFontSize}px]`}><>{formattedLogs}</></p>
          </div>
          <MDPopover
            buttonText="Clear"
            buttonClasses="mt-2"
            handleClick={() => resetLogs()}
          />
        </div>
      </div>
    </>
  )
}
