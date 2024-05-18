import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { misc } from '@/app/functions';

interface LogsStore {
  logs: string
  setLogs: (arg0: string) => void
  resetLogs: () => void
}

const defaultLogs = '';

const useLogsStore = create<LogsStore>()(
  devtools(
    (set, get) => ({
      logs: defaultLogs,
      setLogs: async (newLogs: string) => {
        const currentLogs = get().logs;
        newLogs = await misc.replaceWithTilde(newLogs);
        set({ logs: currentLogs + newLogs + '\r\n' });
      },
      resetLogs: () => {
        set({ logs: defaultLogs });
      }
    }),
  )
);

export default useLogsStore;
