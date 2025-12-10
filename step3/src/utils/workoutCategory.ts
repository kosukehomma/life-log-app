// ------------------------------------
// 運動カテゴリのマスターデータ（共通辞書）
// ------------------------------------
export const workoutCategories: Record<
  string,
  { category: 'aerobic' | 'muscle' | 'boxing' | 'stretch' | 'default'; icon: string }
> = {
  // 有酸素運動
  ランニング: { category: 'aerobic', icon: '🏃‍♂️' },
  ジョギング: { category: 'aerobic', icon: '🏃‍♂️' },
  縄跳び: { category: 'aerobic', icon: '🏃‍♂️' },
  ロープワーク: { category: 'aerobic', icon: '🏃‍♂️' },
  ウォーキング: { category: 'aerobic', icon: '🏃‍♂️' },
  泳ぎ: { category: 'aerobic', icon: '🏃‍♂️' },
  スイミング: { category: 'aerobic', icon: '🏃‍♂️' },

  // 筋トレ類
  筋トレ: { category: 'muscle', icon: '💪' },
  腹筋: { category: 'muscle', icon: '💪' },
  プランク: { category: 'muscle', icon: '💪' },
  腕立て: { category: 'muscle', icon: '💪' },
  スクワット: { category: 'muscle', icon: '💪' },
  ダンベル: { category: 'muscle', icon: '💪' },
  ベンチプレス: { category: 'muscle', icon: '💪' },
  デッドリフト: { category: 'muscle', icon: '💪' },
  ラットプル: { category: 'muscle', icon: '💪' },

  // boxing
  シャドウ: { category: 'boxing', icon: '🥊' },
  シャドー: { category: 'boxing', icon: '🥊' },
  サンドバッグ: { category: 'boxing', icon: '🥊' },
  ミット: { category: 'boxing', icon: '🥊' },

  // stretch
  ストレッチ: { category: 'stretch', icon: '✨' },
};

// ------------------------------------------------------
// 指定テキストをカテゴリ判定
// ------------------------------------------------------
export const getWorkoutCategory = (text: string) => {
  const key = Object.keys(workoutCategories).find((k) => text.includes(k));

  if (!key) return 'default';
  return workoutCategories[key]?.category ?? 'default';
};

// ------------------------------------------------------
// 指定テキストからアイコンを取得
// ------------------------------------------------------
export const getWorkoutIcon = (text: string) => {
  const key = Object.keys(workoutCategories).find((k) => text.includes(k));

  if (!key) return '🏋️‍♀️';
  return workoutCategories[key]?.icon ?? '🏋️‍♀️';
};

// DailyCard 用のスタイルまとめ
export const getWorkoutStyle = (text: string) => {
  const category = getWorkoutCategory(text);
  const icon = getWorkoutIcon(text);

  const color =
    category === 'aerobic'
      ? 'bg-green-500'
      : category === 'muscle'
      ? 'bg-orange-500'
      : category === 'boxing'
      ? 'bg-blue-400'
      : category === 'stretch'
      ? 'bg-purple-400'
      : 'bg-gray-400';

  return { color, icon };
};
