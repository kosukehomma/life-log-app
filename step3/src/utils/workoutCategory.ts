export const workoutCategories: Record<string, { category: string; icon: string }> = {
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

export const getWorkoutStyle = (text: string) => {
  const key = Object.keys(workoutCategories).find((k) => text.includes(k));
  const item = key ? workoutCategories[key] : null;

  const color =
    item?.category === 'aerobic'
      ? 'bg-green-500'
      : item?.category === 'muscle'
      ? 'bg-orange-500'
      : item?.category === 'boxing'
      ? 'bg-blue-500'
      : item?.category === 'stretch'
      ? 'bg-purple-400'
      : 'bg-gray-400';

  const icon = item?.icon ?? '🏋️‍♀️';

  return { color, icon };
};
