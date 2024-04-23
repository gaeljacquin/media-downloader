import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { invoke } from '@tauri-apps/api/tauri';

interface AboutStore {
  author: string
  version: string
  description: string
  title: string
  fetchAppInfo: () => Promise<void>
}

const defaultAboutData = {
  author: '',
  version: '',
  title: '',
  description: '',
}

const useAboutStore = create<AboutStore>()(
  persist(
    devtools(
      (set) => ({
        ...defaultAboutData,
        fetchAppInfo: async () => {
          try {
            const appInfo = await invoke('get_app_info');
            const parsedAppInfo = JSON.parse(appInfo as string);
            set(parsedAppInfo);
          } catch (error) {
            console.error('Failed to fetch app info:', error);
          }
        },
      }),
    ), {
      name: 'AboutStore',
    }
  )
);

export default useAboutStore;
