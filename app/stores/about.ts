import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AboutStore {
  author: string
  version: string
  description: string
  title: string
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
      () => ({
        ...defaultAboutData,
      }),
    ), {
      name: 'AboutStore',
    }
  )
);

export default useAboutStore;
