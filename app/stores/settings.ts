import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsStore {
  downloadLocation: string
  setDownloadLocation: (arg0: string) => void
  resetDownloadLocation: () => void
  logsFontSize: number
  setLogsFontSize: (arg0: number) => void
  resetLogsFontSize: () => void
  notifications: boolean
  setNotifications: (arg0: boolean) => void
  resetSettings: () => void
}

export const defaultSettings = {
  downloadLocation: '~/Downloads',
  logsFontSize: 16,
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
        setLogsFontSize: (newSize: number) => {
          set({ logsFontSize: newSize })
        },
        resetLogsFontSize: () => {
          set({ logsFontSize: defaultSettings.logsFontSize });
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
