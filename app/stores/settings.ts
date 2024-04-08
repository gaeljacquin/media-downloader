import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsStore {
  downloadLocation: string
  setDownloadLocation: (arg0: string) => void
  terminalFontSize: number
  setTerminalFontSize: (arg0: number) => void
}

export const defaultSettings = {
  downloadLocation: '',
  setDownloadLocation: () => null,
  terminalFontSize: 16,
  setTerminalFontSize: () => null,
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    devtools(
      (set) => ({
        ...defaultSettings,
        setDownloadLocation: (newLocation: string) => {
          set({ downloadLocation: newLocation })
        },
        setTerminalFontSize: (newSize: number) => {
          set({ terminalFontSize: newSize })
        },
      }),
    ), {
      name: 'SettingsStore',
    }
  )
);

export default useSettingsStore;
