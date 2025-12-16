import { create } from 'zustand';
import type { Log } from '../types';
import { insertLog, fetchLogs } from '../lib/api/logs';

export type LogsState = {
  logs: Log[];
  isLoading: boolean;
  loadLogs: () => Promise<void>;
  addLog: (newLog: Omit<Log, 'id'>) => Promise<void>;
};

export const useLogs = create<LogsState>((set) => ({
  logs: [],
  isLoading: false,

  loadLogs: async () => {
    set({ isLoading: true });
    try {
      const logs = await fetchLogs();
      set({ logs });
    } finally {
      set({ isLoading: false });
    }
  },

  addLog: async (newLog) => {
    await insertLog(newLog);
    const logs = await fetchLogs();
    set({ logs });
  },
}));
