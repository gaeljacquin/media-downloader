import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';

export const useTheme = () => {
  const { settings, updateSettings } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color scheme
    root.className = root.className.replace(/theme-\w+/g, '');
    if (settings.colorScheme !== 'default') {
      root.classList.add(`theme-${settings.colorScheme}`);
    }
    
    // Apply dark/light mode
    const isDark = 
      settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
  }, [settings.theme, settings.colorScheme]);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: nextTheme });
  };

  return { toggleTheme };
};