import { Settings, Home, Terminal, Info, Minimize2 } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from './ui/menubar';
import { invoke } from '@tauri-apps/api/core';

interface HeaderProps {
  onNavigate?: (view: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const { currentView } = useAppStore();

  const handleMinimizeToTray = async () => {
    try {
      await invoke('minimize_to_tray');
    } catch (error) {
      console.error('Failed to minimize to tray:', error);
    }
  };

  return (
    <header className="h-8 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-b border-gray-400 dark:border-gray-600 flex items-center px-2 shadow-sm">
      <Menubar className="h-6 border-0 bg-transparent shadow-none p-0">
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-0 h-6 text-xs">View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem 
              onClick={() => onNavigate?.('home')}
              className={currentView === 'home' ? 'bg-accent' : ''}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </MenubarItem>
            <MenubarItem 
              onClick={() => onNavigate?.('logs')}
              className={currentView === 'logs' ? 'bg-accent' : ''}
            >
              <Terminal className="h-4 w-4 mr-2" />
              Logs
            </MenubarItem>
            <MenubarItem 
              onClick={() => onNavigate?.('about')}
              className={currentView === 'about' ? 'bg-accent' : ''}
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </MenubarItem>
            <MenubarItem 
              onClick={() => onNavigate?.('settings')}
              className={currentView === 'settings' ? 'bg-accent' : ''}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="px-2 py-0 h-6 text-xs">Window</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleMinimizeToTray}>
              <Minimize2 className="h-4 w-4 mr-2" />
              Minimize to Tray
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </header>
  );
};