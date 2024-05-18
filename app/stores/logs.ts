import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { misc } from '@/app/functions';

interface LogsStore {
  logs: string[]
  setLogs: (arg0: string) => void
  resetLogs: () => void
  counter: number // dummy counter to trigger auto-scroll
}

const defaults = {
  logs: [''],
  counter: 0,
}

const useLogsStore = create<LogsStore>()(
  devtools(
    (set, get) => ({
      ...defaults,
      setLogs: async (newLog: string) => {
        const currentLogs = get().logs;
        const currentCounter = get().counter;
        const lastLogPos = currentLogs.length - 1;
        newLog = await misc.replaceWithTilde(newLog);

        if ((currentLogs[lastLogPos].startsWith('[download]') && newLog.startsWith('[download]')) || currentLogs[0] === '') {
          currentLogs[lastLogPos] = newLog;
        } else if (newLog) {
          currentLogs.push(newLog);
        }
        set({ logs: currentLogs, counter: currentCounter + 1 });
      },
      resetLogs: () => {
        set({ logs: [''], counter: defaults.counter });
      },
    }),
  )
);


export default useLogsStore;
