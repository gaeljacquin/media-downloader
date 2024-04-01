import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface FormStore {
  downloadLocation: string
  setDownloadLocation: (arg0: string) => void
}

export const defaultFormState = {
  downloadLocation: '',
  setDownloadLocation: null
}

const useFormStore = create<FormStore>()(
  persist(
    devtools(
      (set) => ({
        ...defaultFormState,
        setDownloadLocation: (path: string) => {
          set({ downloadLocation: path })
        }
      }),
    ), {
      name: 'FormStore',
    }
  )
);

export default useFormStore;
