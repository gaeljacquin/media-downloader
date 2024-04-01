'use client';

import { useEffect } from 'react';

export default function DisableContextMenu() {
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      return
    }

    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= 'F1' && e.key <= 'F12') {
        e.preventDefault();
      }

      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextmenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <></>;
}
