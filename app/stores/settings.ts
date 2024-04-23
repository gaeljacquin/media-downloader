import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsStore {
  downloadLocation: string
  setDownloadLocation: (arg0: string) => void
  resetDownloadLocation: () => void
  terminalFontSize: number
  setTerminalFontSize: (arg0: number) => void
  resetTerminalFontSize: () => void
  notifications: boolean
  setNotifications: (arg0: boolean) => void
  resetSettings: () => void
}

export const defaultSettings = {
  downloadLocation: '~/Downloads',
  terminalFontSize: 16,
  notifications: true,
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    devtools(
      (set) => ({
        ...defaultSettings,
        setDownloadLocation: (newLocation: string) => {
          set({ downloadLocation: newLocation });
        },
        resetDownloadLocation: () => {
          set({ downloadLocation: defaultSettings.downloadLocation });
        },
        setTerminalFontSize: (newSize: number) => {
          set({ terminalFontSize: newSize })
        },
        resetTerminalFontSize: () => {
          set({ terminalFontSize: defaultSettings.terminalFontSize });
        },
        setNotifications: (toggle: boolean) => {
          set({ notifications: toggle })
        },
        resetSettings: () => {
          set({ ...defaultSettings })
        },
      }),
    ), {
      name: 'SettingsStore',
    }
  )
);

export default useSettingsStore;
