import { create } from 'zustand';
import type { Log, Meal, MealType } from '../types';

type LogsState = {
  logs: Log[];
  loadFromStorage: () => void;
  updateMeal: (logId: number, mealType: MealType, updatedMeal: Meal) => void;
  deleteMeal: (logId: number, mealType: MealType) => void;
};

export const useLogs = create<LogsState>((set) => ({
  logs: [],

  updateMeal: (logId, mealType, newMeal) =>
    set((state) => ({
      logs: state.logs.map((log) =>
        log.id === logId
          ? {
              ...log,
              meals: {
                ...log.meals,
                [mealType]: newMeal,
              },
            }
          : log
      ),
    })),

  deleteMeal: (logId, mealType) =>
    set((state) => ({
      logs: state.logs.map((log) =>
        log.id === logId
          ? {
              ...log,
              meals: {
                ...log.meals,
                [mealType]: undefined,
              },
            }
          : log
      ),
    })),

  // --- ローカルストレージ読み込み
  loadFromStorage: () => {
    const dummyLogs: Log[] = [
      {
        id: 1,
        date: '2025-02-20',
        weight: 104.3,
        workout: ['ミット3R', 'サンドバッグ3R', '腹筋3種', 'ジョギング5km'],
        comment:
          '今日はかなり動けた、汗めっちゃ出た。このまま続けられそうかな？少しペース落としてもいいかなぁなんて思ったり、',
        meals: {
          morning: {
            id: '1-morning',
            type: 'morning',
            imageUrl: '/meal-sample04.png',
            memo: 'オートミール＋卵＋味噌汁。画像にはないが、バナナと牛乳も取り入れた。朝はしっかり摂らないと',
          },
          lunch: {
            id: '1-lunch',
            type: 'lunch',
            imageUrl: '/meal-sample05.png',
            memo: 'チキンサラダ',
          },
          dinner: {
            id: '1-dinner',
            type: 'dinner',
            imageUrl: '/meal-sample06.png',
            memo: 'インドカレー',
          },
          snack: {
            id: '1-snack',
            type: 'snack',
            imageUrl: '/meal-sample07.png',
            memo: 'プロテインバー',
          },
        },
      },
      {
        id: 2,
        date: '2025-02-19',
        weight: 104.8,
        workout: ['シャドー3R', 'ミット2R', 'サンドバッグ3R'],
        comment: '動きは悪くない。夜ちょい食べすぎ。',
        meals: {
          morning: { id: '2-morning', type: 'morning', imageUrl: '/meal-sample05.png', memo: '' },
          lunch: { id: '2-lunch', type: 'lunch', imageUrl: '/meal-sample07.png', memo: '' },
          dinner: { id: '2-dinner', type: 'dinner', imageUrl: '/meal-sample04.png', memo: '' },
        },
      },
      {
        id: 3,
        date: '2025-02-18',
        weight: 105.2,
        workout: ['縄跳び2R', 'スクワット', 'レッグエクステ'],
        comment: '脚の張りが強め。明日は軽めに。昼ラーメン食べちゃった。',
        meals: {
          morning: { id: '3-morning', type: 'morning', imageUrl: '/meal-sample06.png', memo: '' },
          lunch: { id: '3-lunch', type: 'lunch', imageUrl: '/meal-sample04.png', memo: '' },
          dinner: { id: '', type: 'dinner', imageUrl: '/meal-sample05.png', memo: '' },
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
