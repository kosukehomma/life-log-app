import { useState } from 'react';
import type { Meal, MealType } from '../types';
import type { LogFormInput } from '../types';
import FormWorkTag from './FormWorkTag';
import AddMealCarousel from './AddMealCarousel';

const emptyMeals: Record<MealType, Meal | undefined> = {
  morning: undefined,
  lunch: undefined,
  dinner: undefined,
  snack: undefined,
};

type Props = {
  initialLog: LogFormInput;
  onSubmit: (log: LogFormInput) => Promise<void>;
  onImageSelect: (file: File, type: MealType) => Promise<string>;
};

const LogForm = ({ initialLog, onSubmit, onImageSelect }: Props) => {
  const [date, setDate] = useState(initialLog.date);
  const [weight, setWeight] = useState<number | ''>(initialLog.weight);
  const [fat, setFat] = useState<number | ''>(initialLog.body_fat ?? '');
  const [workout, setWorkout] = useState<string[]>(initialLog.workout_tags);
  const [meals, setMeals] = useState<Record<MealType, Meal | undefined>>({
    ...emptyMeals,
    ...initialLog.meals,
  });
  const [memo, setMemo] = useState(initialLog.memo);

  // AddMealCarousel用
  const handleMealChange = (type: MealType, meal: Meal) => {
    setMeals((prev) => ({
      ...prev,
      [type]: meal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    void onSubmit({
      date,
      weight: Number(weight),
      body_fat: fat === '' ? null : Number(fat),
      workout_tags: workout,
      meals,
      memo,
    });
  };

  const handleImageSelect = async (file: File, type: MealType) => {
    const imageUrl = await onImageSelect(file, type);

    setMeals((prev) => ({
      ...prev,
      [type]: {
        ...(prev[type] ?? { type }),
        image_url: imageUrl,
      },
    }));
  };

  return (
    <form id="log-form" onSubmit={handleSubmit} className="flex-1 p-4 space-y-8">
      {/* 基本情報 */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-l-4 border-primary pl-2">基本情報</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
            日付
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded-md text-sm"
              required
            />
          </label>

          <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
            体重（kg）
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              className="border p-2 rounded-md text-sm"
              required
            />
          </label>

          <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
            体脂肪率（%）
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
              className="border p-2 rounded-md text-sm"
            />
          </label>
        </div>
      </section>

      {/* Workout */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-l-4 border-primary pl-2">Workout</h3>
        <FormWorkTag value={workout} onChange={setWorkout} />
      </section>

      {/* Meal */}
      <section id="meal-section" className="space-y-4">
        <h3 className="text-lg font-bold border-l-4 border-primary pl-2">Meal</h3>
        <AddMealCarousel
          meals={meals}
          onChange={handleMealChange}
          onImageSelect={handleImageSelect}
        />
      </section>

      {/* コメント */}
      <section className="space-y-2">
        <h3 className="text-lg font-bold border-l-4 border-primary pl-2">コメント</h3>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={128}
          className="border p-3 rounded-md resize-none w-full h-[120px] text-sm"
          placeholder="コメントを入力（最大128文字）"
        />
        <div className="text-right text-xs mt-1">
          <span className={memo.length >= 128 ? 'text-red-600' : 'text-gray-600'}>
            {memo.length} / 128
          </span>
        </div>
      </section>
    </form>
  );
};

export default LogForm;
