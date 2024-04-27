import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AppInfo = {
  author: string
  version: string
  description: string
  title: string
  license: string
  repository: string
}

interface AppInfoStore {
  appInfo: AppInfo
  setAppInfo: (arg0: AppInfo) => void
}

const defaultAppInfo = {
  author: '',
  version: '',
  title: '',
  description: '',
  license: '',
  repository: '',
}

const useAppInfoStore = create<AppInfoStore>()(
  persist(
    devtools(
      (set) => ({
        appInfo: defaultAppInfo,
        setAppInfo: (appInfo: AppInfo) => {
          set({ appInfo });
        },
      }),
    ), {
      name: 'AppInfoStore',
    }
  )
);

export default useAppInfoStore;
