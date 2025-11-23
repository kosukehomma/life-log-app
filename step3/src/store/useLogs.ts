import { create } from 'zustand';
import type { Log } from '../types';

type LogsState = {
  logs: Log[];
  addLog: (log: Log) => void;
  updateLog: (id: number, updated: Partial<Log>) => void;
  deleteLog: (id: number) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
};

export const useLogs = create<LogsState>((set, get) => ({
  logs: [],

  // --- ローカルストレージ読み込み
  loadFromStorage: () => {
    const raw = localStorage.getItem('logs');
    if (raw) {
      try {
        const storedLogs = JSON.parse(raw);
        set({ logs: storedLogs });
      } catch (e) {
        console.error('localStorage read error:', e);
      }
    }

    // ダミーデータ（初回だけ）
    if (!raw) {
      const sample = [
        {
          id: 1,
          date: '2025-01-01',
          weight: 85,
          work: 'シャドウ3R, サンドバッグ3R, ミット2R',
          comment: 'テスト表示用のコメントです',
          meals: [
            { img: '/meal-sample04.png', label: '朝食' as const, name: '朝食オードブル' },
            { img: '/meal-sample05.png', label: '昼食' as const, name: 'トースト' },
            { img: '/meal-sample06.png', label: '夕食' as const, name: 'インドカレー' },
          ],
        },
      ];

      localStorage.setItem('logs', JSON.stringify(sample));
      set({ logs: sample });
    }
  },

  // --- ローカルストレージ保存
  saveToStorage: () => {
    const { logs } = get();
    localStorage.setItem('logs', JSON.stringify(logs));
  },

  // --- ログ追加
  addLog: (log) => {
    set((state) => {
      const newLogs = [...state.logs, log];
      localStorage.setItem('logs', JSON.stringify(newLogs));
      return { logs: newLogs };
    });
  },

  // --- ログ更新
  updateLog: (id, updated) => {
    set((state) => {
      const newLogs = state.logs.map((l) => (l.id === id ? { ...l, ...updated } : l));
      localStorage.setItem('logs', JSON.stringify(newLogs));
      return { logs: newLogs };
    });
  },

  // --- ログ削除
  deleteLog: (id) => {
    set((state) => {
      const newLogs = state.logs.filter((l) => l.id !== id);
      localStorage.setItem('logs', JSON.stringify(newLogs));
      return { logs: newLogs };
    });
  },
}));
