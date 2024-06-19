import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { en, fr } from "@/app/locales";

interface SettingsStore {
  downloadLocation: string;
  setDownloadLocation: (arg0: string) => void;
  resetDownloadLocation: () => void;
  logsFontSize: number;
  setLogsFontSize: (arg0: number) => void;
  resetLogsFontSize: () => void;
  notifications: boolean;
  setNotifications: (arg0: boolean) => void;
  locale: string;
  setLocale: (arg0: string) => void;
  resetLocale: () => void;
  resetSettings: () => void;
}

export const locales = {
  en: { data: en, name: "English" },
  fr: { data: fr, name: "Français" },
};

export const defaultSettings = {
  downloadLocation: "~/Downloads",
  logsFontSize: 16,
  notifications: true,
  locale: "en",
};

const useSettingsStore = create<SettingsStore>()(
  persist(
    devtools((set) => ({
      ...defaultSettings,
      setDownloadLocation: (newLocation: string) => {
        set({ downloadLocation: newLocation });
      },
      resetDownloadLocation: () => {
        set({ downloadLocation: defaultSettings.downloadLocation });
      },
      setLogsFontSize: (newSize: number) => {
        set({ logsFontSize: newSize });
      },
      resetLogsFontSize: () => {
        set({ logsFontSize: defaultSettings.logsFontSize });
      },
      setNotifications: (toggle: boolean) => {
        set({ notifications: toggle });
      },
      setLocale: (locale: string) => set({ locale }),
      resetLocale: () => {
        set({ locale: defaultSettings.locale });
      },
      resetSettings: () => {
        set({ ...defaultSettings });
      },
    })),
    {
      name: "SettingsStore",
    }
  )
);

export default useSettingsStore;
