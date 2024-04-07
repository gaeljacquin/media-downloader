'use client';

import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import useSettingsStore from '@/app/stores/settings';

export default function TerminalDisplay() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const terminalInitRef = useRef(false);
  const { terminalFontSize, downloadLocation } = useSettingsStore();

  useEffect(() => {
    if (terminalRef.current && !Boolean(terminalInitRef.current)) {
      terminalInstance.current = new Terminal({
        fontFamily: 'Inter, monospace',
        fontSize: terminalFontSize,
        scrollback: 0,
        cursorStyle: 'bar',
        cursorInactiveStyle: 'bar',
        cursorBlink: true,
      });
      const fitAddon = new FitAddon();
      terminalInstance.current.loadAddon(fitAddon);
      terminalInstance.current.open(terminalRef.current);
      fitAddon.fit();
      terminalInstance.current.write('Thank you for using \x1b[31myt-dlp GUI\x1b[0m!\r\n');
      terminalInstance.current.write('\r\n');
      terminalInstance.current.write(`${downloadLocation ?  downloadLocation + ' ' : ''}$ `);
      terminalInitRef.current = true;
    }
  }, [terminalFontSize, downloadLocation]);

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

  return (
    <div className="relative flex h-full flex-col rounded-xl bg-black p-4 lg:col-span-2">
      <div ref={terminalRef} className="w-full h-full xterm xterm-viewport"></div>
    </div>
  );
}
