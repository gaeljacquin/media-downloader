'use client';

import Image from "next/image";

import { icons } from "@/app/components/icons";
import { Button } from "@/app/components/ui/button";
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "@/app/components/ui/tooltip";
import { View, useView } from '@/app/contexts/view';

export default function ActivityBar() {
  const { Settings2Icon, HomeIcon, EyeOffIcon, TerminalSquareIcon } = icons;
  const { view, switchView } = useView();

  const invokeHideSystemTray = async () => {
    const { invoke } = await import('@tauri-apps/api/tauri');
    await invoke('hide_system_tray');
  };

  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b border-transparent p-2">
        <Image
          src="/images/favicon.ico"
          alt="Media Downloader icon"
          className="w-10 h-auto"
          width={0}
          height={0}
          unoptimized
          priority
        />
      </div>
      <nav className="grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Main"
                className={`rounded-lg ${view === View.Home && 'bg-muted'}`}
                size="icon"
                variant="ghost"
                onClick={() => view !== View.Home ? switchView(View.Home) : null}
              >
                <HomeIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Home
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Logs"
                className={`rounded-lg ${view === View.Logs && 'bg-muted'}`}
                size="icon"
                variant="ghost"
                onClick={() => view !== View.Logs ? switchView(View.Logs) : null}
              >
                <TerminalSquareIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Logs
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Settings"
                className={`rounded-lg ${view === View.Settings && 'bg-muted'}`}
                size="icon"
                variant="ghost"
                onClick={() => view !== View.Settings ? switchView(View.Settings) : null}
              >
                <Settings2Icon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Hide in system tray" className="mt-auto rounded-lg" size="icon" variant="ghost" onClick={invokeHideSystemTray}>
                <EyeOffIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Hide in system tray
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
