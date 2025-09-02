import { Settings, Home, Download, FileText } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface HeaderProps {
  onNavigate?: (view: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const { currentView } = useAppStore();

  const controlItems = [
    { id: 'home' as const, icon: Home, tooltip: 'Home' },
    { id: 'logs' as const, icon: Download, tooltip: 'Logs' },
    { id: 'notes' as const, icon: FileText, tooltip: 'Notes' },
    { id: 'settings' as const, icon: Settings, tooltip: 'Settings' },
  ];

  return (
    <header className="h-8 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-b border-gray-400 dark:border-gray-600 flex items-center justify-center shadow-sm">
      <div className="flex items-center gap-1 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 border border-gray-400 dark:border-gray-500 rounded px-2 py-0.5 shadow-inner">
        {controlItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate ? onNavigate(item.id) : undefined}
              className={cn(
                "h-6 w-6 p-0 rounded border transition-all hover:bg-gray-50 dark:hover:bg-gray-600",
                currentView === item.id 
                  ? "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-500 dark:to-gray-600 border-gray-500 dark:border-gray-400 shadow-inner" 
                  : "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 border-gray-400 dark:border-gray-500 shadow-sm"
              )}
              title={item.tooltip}
            >
              <Icon className="h-3 w-3" />
            </Button>
          );
        })}
      </div>
    </header>
  );
};