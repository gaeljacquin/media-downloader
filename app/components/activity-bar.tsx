'use client';

import { icons } from "@/app/components/icons";
import { Button } from "@/app/components/ui/button";
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "@/app/components/ui/tooltip";
import { View, useView } from '@/app/contexts/view';
import useAppInfoStore from '@/app/stores/app-info';

export default function ActivityBar() {
  const { view, switchView } = useView();
  const { setAppInfo } = useAppInfoStore();

  const invokeHideSystemTray = async () => {
    const { invoke } = await import('@tauri-apps/api/tauri');
    await invoke('hide_system_tray');
  };

  const fetchAppInfo = async () => {
    const { invoke } = await import('@tauri-apps/api/tauri');
    const appInfo = await invoke('get_app_info');
    const parsedAppInfo = JSON.parse(appInfo as string);
    setAppInfo(parsedAppInfo);
  };

  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
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
                <icons.HomeIcon className="h-5 w-5" />
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
                <icons.TerminalSquareIcon className="size-5" />
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
                <icons.Settings2Icon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="About"
                className={`rounded-lg ${view === View.About && 'bg-muted'}`}
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (view !== View.About) {
                    fetchAppInfo();
                    switchView(View.About);
                  }
                }}
              >
                <icons.InfoCircledIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              About
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Hide in system tray" className="mt-auto rounded-lg" size="icon" variant="ghost" onClick={invokeHideSystemTray}>
                <icons.EyeOffIcon className="size-5" />
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
