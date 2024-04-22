'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import useSettingsStore from '@/app/stores/settings';
import { useTerminalOutput } from '@/app/contexts/terminal-output';
import MDPopover from '@/app/components/md-popover';
import { misc } from '@/app/functions';

export default function TerminalDisplay() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const terminalInitRef = useRef(false);
  const { terminalFontSize, downloadLocation } = useSettingsStore();
  const { output } = useTerminalOutput();

  const resetTerminal = useCallback(() => {
    terminalInstance?.current?.reset();
    terminalInstance?.current?.write('Thank you for using \x1b[31mMedia Downloader\x1b[0m!\r\n');
    terminalInstance?.current?.write('\r\n');
    terminalInstance?.current?.write(`${downloadLocation ?  downloadLocation + ' ' : ''}$ `);
    misc.handleEscapePress();
  }, [downloadLocation]);

  useEffect(() => {
    if (terminalRef.current && !Boolean(terminalInitRef.current)) {
      terminalInstance.current = new Terminal({
        fontFamily: 'Inter, monospace',
        fontSize: terminalFontSize,
        scrollback: 9999999,
        cursorStyle: 'bar',
        cursorInactiveStyle: 'bar',
        cursorBlink: true,
      });
      const fitAddon = new FitAddon();
      terminalInstance.current.loadAddon(fitAddon);
      terminalInstance.current.open(terminalRef.current);
      fitAddon.fit();
      resetTerminal();
      terminalInitRef.current = true;
    }
  }, [terminalFontSize, downloadLocation, resetTerminal]);

  useEffect(() => {
    const fitAddon = new FitAddon();

    if (terminalInstance.current) {
      terminalInstance.current.loadAddon(fitAddon);
      const onResize = () => fitAddon.fit();
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
      }
    }
  }, []);

  useEffect(() => {
    if (terminalInstance.current && output) {
      terminalInstance.current.write(output);
    }
  }, [output]);

  return (
    <>
      <div className="rounded-xl bg-black p-4">
        <div ref={terminalRef} className="w-full h-[50%] xterm bg-black xterm-viewport"></div>
      </div>
      <div className="grid gap-8 p-4">
        <MDPopover
          buttonText="Clear"
          buttonClasses="mt-5 mb-2"
          handleClick={() => resetTerminal()}
        />
      </div>
    </>
  );
}
