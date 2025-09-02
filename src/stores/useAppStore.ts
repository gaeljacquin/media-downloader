import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, DownloadOptions, Note, TempNote } from '../types';

interface AppState {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Download
  downloadOptions: DownloadOptions;
  updateDownloadOptions: (options: Partial<DownloadOptions>) => void;
  isDownloading: boolean;
  setIsDownloading: (downloading: boolean) => void;

  // Logs - simplified like in md-backup
  logs: string[];
  addLog: (message: string) => void;
  clearLogs: () => void;
  logCounter: number;

  // Navigation
  currentView: 'home' | 'logs' | 'settings' | 'notes';
  setCurrentView: (view: 'home' | 'logs' | 'settings' | 'notes') => void;

  // Notes
  notes: Note[];
  tempNotes: TempNote[];
  hasUnsavedChanges: boolean;
  setTempNotes: (notes: TempNote[]) => void;
  saveNotes: () => void;
  resetTempNotes: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

const defaultSettings: AppSettings = {
  savePath: '~/Downloads',
  logsFontSize: 16,
  enableNotifications: true,
  theme: 'light',
  colorScheme: 'default',
};

const defaultDownloadOptions: DownloadOptions = {
  type: 'url',
  url: '',
  file: '',
  audioOnly: false,
  saveTo: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),

      // Download
      downloadOptions: defaultDownloadOptions,
      updateDownloadOptions: (options) =>
        set((state) => ({
          downloadOptions: { ...state.downloadOptions, ...options },
        })),
      isDownloading: false,
      setIsDownloading: (downloading) => set({ isDownloading: downloading }),

      // Logs
      logs: [''],
      logCounter: 0,
      addLog: (message: string) => {
        set((state) => {
          const currentLogs = [...state.logs];
          const lastLogPos = currentLogs.length - 1;

          // Handle download progress messages like md-backup
          if ((currentLogs[lastLogPos]?.startsWith('[download]') && message.startsWith('[download]')) || currentLogs[0] === '') {
            currentLogs[lastLogPos] = message;
          } else if (message) {
            currentLogs.push(message);
          }

          return {
            logs: currentLogs,
            logCounter: state.logCounter + 1
          };
        });
      },
      clearLogs: () => set({ logs: [''], logCounter: 0 }),

      // Navigation
      currentView: 'home',
      setCurrentView: (view) => set({ currentView: view }),

      // Notes
      notes: [],
      tempNotes: [],
      hasUnsavedChanges: false,
      setTempNotes: (notes) => {
        set({ tempNotes: notes });
      },
      setHasUnsavedChanges: (hasChanges) => {
        set({ hasUnsavedChanges: hasChanges });
      },
      saveNotes: () => {
        const state = get();
        // Filter out empty rows or rows with only description
        const validNotes = state.tempNotes
          .filter(note => !note.isMarkedForDeletion && note.flags.trim() !== '')
          .map(({ ...note }) => note);
          // .map(({ isMarkedForDeletion, ...note }) => note);

        set({
          notes: validNotes,
          hasUnsavedChanges: false
        });
      },
      resetTempNotes: () => {
        const state = get();
        set({
          tempNotes: state.notes.map(note => ({ ...note })),
          hasUnsavedChanges: false
        });
      },
    }),
    {
      name: 'emdee-storage',
      partialize: (state) => ({
        settings: state.settings,
        logs: state.logs,
        notes: state.notes,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.notes) {
          // Initialize tempNotes with saved notes
          state.tempNotes = state.notes.map(note => ({ ...note }));
          state.hasUnsavedChanges = false;
        }
      },
    }
  )
);
