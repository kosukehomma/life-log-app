import { create } from 'zustand';
import type { Log } from '../types';

type LogsState = {
  logs: Log[];
  loadFromStorage: () => void;
};

export const useLogs = create<LogsState>((set) => ({
  logs: [],

  // --- ローカルストレージ読み込み
  loadFromStorage: () => {
    const dummyLogs: Log[] = [
      {
        id: 1,
        date: '2025-02-20',
        weight: 104.3,
        workout: ['ミット3R', 'サンドバッグ3R', '腹筋3種', 'ジョギング5km'],
        comment: '今日はかなり動けた、汗めっちゃ出た。',
        meals: {
          morning: { imageUrl: '/meal-sample04.png', memo: 'オートミール＋卵＋味噌汁' },
          lunch: { imageUrl: '/meal-sample05.png', memo: 'チキンサラダ' },
          dinner: { imageUrl: '/meal-sample06.png', memo: 'インドカレー' },
          snack: { imageUrl: '/meal-sample07.png', memo: 'プロテインバー' },
        },
      },
      {
        id: 2,
        date: '2025-02-19',
        weight: 104.8,
        workout: ['シャドー3R', 'ミット2R', 'サンドバッグ3R'],
        comment: '動きは悪くない。夜ちょい食べすぎ。',
        meals: {
          morning: { imageUrl: '/meal-sample05.png', memo: '' },
          lunch: { imageUrl: '/meal-sample07.png', memo: '' },
          dinner: { imageUrl: '/meal-sample04.png', memo: '' },
        },
      },
      {
        id: 3,
        date: '2025-02-18',
        weight: 105.2,
        workout: ['縄跳び2R', 'スクワット', 'レッグエクステ'],
        comment: '脚の張りが強め。明日は軽めに。昼ラーメン食べちゃった。',
        meals: {
          morning: { imageUrl: '/meal-sample06.png', memo: '' },
          lunch: { imageUrl: '/meal-sample04.png', memo: '' },
          dinner: { imageUrl: '/meal-sample05.png', memo: '' },
        },
      },
      {
        id: 4,
        date: '2025-02-17',
        weight: 105.6,
        workout: ['胸トレ(軽め)'],
        comment: '',
        meals: {},
      },
      {
        id: 5,
        date: '2025-02-16',
        weight: 106.2,
        workout: [],
        comment: '',
        meals: {},
      },
      {
        id: 6,
        date: '2025-02-15',
        weight: 106.7,
        workout: [],
        comment: '',
        meals: {},
      },
      {
        id: 7,
        date: '2025-02-14',
        weight: 107.0,
        workout: [],
        comment: '',
        meals: {},
      },
    ];

    set({ logs: dummyLogs });
  },
}));
