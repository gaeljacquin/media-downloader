import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsStore {
  downloadLocation: string
  setDownloadLocation: (arg0: string) => void
}

export const defaultSettingsState = {
  downloadLocation: '',
  setDownloadLocation: () => null,
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    devtools(
      (set) => ({
        ...defaultSettingsState,
        setDownloadLocation: (path: string) => {
          set({ downloadLocation: path })
        },
      }),
    ), {
      name: 'SettingsStore',
    }
  )
);

export default useSettingsStore;
