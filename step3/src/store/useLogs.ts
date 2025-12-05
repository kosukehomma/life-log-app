import { create } from 'zustand';
import type { Log, Meal, MealType } from '../types';

const STORAGE_KEY = 'life-log-logs';

const save = (logs: Log[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export type LogsState = {
  logs: Log[];
  loadFromStorage: () => void;
  addLog: (newLog: Log) => void;
  updateLog: (updatedLog: Log) => void;
  deleteLog: (logId: number) => void;
  updateMeal: (logId: number, mealType: MealType, updatedMeal: Meal) => void;
  deleteMeal: (logId: number, mealType: MealType) => void;
};

export const useLogs = create<LogsState>((set, get) => ({
  logs: [],

  // --- ローカルストレージ読み込み
  loadFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Log[];
      set({ logs: parsed });
    } catch (e) {
      console.error('failed to parse logs from localStorage', e);
    }
  },

  addLog: (newLog) => {
    const updated = [...get().logs, newLog];
    save(updated);
    set({ logs: updated });
  },

  updateLog: (updatedLog) => {
    const updated = get().logs.map((log) => (log.id === updatedLog.id ? updatedLog : log));
    save(updated);
    set({ logs: updated });
  },

  deleteLog: (logId) => {
    const updated = get().logs.filter((log) => log.id !== logId);
    save(updated);
    set({ logs: updated });
  },

  updateMeal: (logId, mealType, updatedMeal) => {
    const updated = get().logs.map((log) => {
      if (log.id !== logId) return log;
      return {
        ...log,
        meals: {
          ...log.meals,
          [mealType]: updatedMeal,
        },
      };
    });
    save(updated);
    set({ logs: updated });
  },

  deleteMeal: (logId, mealType) => {
    const updated = get().logs.map((log) => {
      if (log.id !== logId) return log;
      return {
        ...log,
        meals: {
          ...log.meals,
          [mealType]: undefined,
        },
      };
    });
    save(updated);
    set({ logs: updated });
  },
}));
