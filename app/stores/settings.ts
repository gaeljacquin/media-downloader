import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsStore {
  downloadLocation: string
  setDownloadLocation: (arg0: string) => void
  terminalFontSize: number
  setTerminalFontSize: (arg0: number) => void
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
          set({ downloadLocation: newLocation })
        },
        setTerminalFontSize: (newSize: number) => {
          set({ terminalFontSize: newSize })
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
