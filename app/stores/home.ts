import { create } from 'zustand';

import { HomeForm } from '@/app/types/form';

interface HomeStore {
  formData: HomeForm
  setFormData: (arg0: HomeForm) => void
  clickable: boolean
  setClickable: (arg0: boolean) => void
}

const defaultFormData = {
  url: '',
  audioOnly: false,
  saveTo: '',
}

const useHomeStore = create<HomeStore>(set => ({
  formData: defaultFormData,
  setFormData: (data: HomeForm) => set({ formData: data }),
  clickable: true,
  setClickable: (clickable: boolean) => set({ clickable }),
}));

export default useHomeStore;
