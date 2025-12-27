import { useState } from 'react';
import { logSchema } from '../schemas/logSchema';
import type { Meal, MealType } from '../types';
import type { LogFormInput } from '../types';
import FormWorkTag from './FormWorkTag';
import AddMealCarousel from './AddMealCarousel';
import { extractFieldErrors } from '../utils/zod';

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
  isSubmitting?: boolean;
};

type FieldErrors = Partial<Record<keyof LogFormInput, string[]>>;

const LogForm = ({ initialLog, onSubmit, onImageSelect, isSubmitting = false }: Props) => {
  const [date, setDate] = useState(initialLog.date);
  const [weight, setWeight] = useState<number | ''>(initialLog.weight);
  const [fat, setFat] = useState<number | ''>(initialLog.body_fat ?? '');
  const [workout, setWorkout] = useState<string[]>(initialLog.workout_tags);
  const [meals, setMeals] = useState<Record<MealType, Meal | undefined>>({
    ...emptyMeals,
    ...initialLog.meals,
  });
  const [memo, setMemo] = useState(initialLog.memo);
  const [errors, setErrors] = useState<FieldErrors>({});

  // AddMealCarousel用
  const handleMealChange = (type: MealType, meal: Meal) => {
    setMeals((prev) => ({
      ...prev,
      [type]: meal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: LogFormInput = {
      date,
      weight: Number(weight),
      body_fat: fat === '' ? null : Number(fat),
      workout_tags: workout,
      meals,
      memo,
    };

    const result = logSchema.safeParse(formData);

    if (!result.success) {
      console.log('validation error', result.error);
      setErrors(extractFieldErrors(result.error));

      document
        .querySelector('[data-error="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    setErrors({});
    document.getElementById('log-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    void onSubmit(result.data);
  };

  const handleImageSelect = async (file: File, type: MealType) => {
    if (isSubmitting) return;

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
    <form
      id="log-form"
      onSubmit={handleSubmit}
      className={`flex-1 p-4 space-y-8
        ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
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
            />
            {errors.date?.[0] && (
              <p className="text-red-600 text-xs" data-error="true">
                {errors.date[0]}
              </p>
            )}
          </label>

          <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
            体重（kg）
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              className="border p-2 rounded-md text-sm"
            />
            {errors.weight?.[0] && <p className="text-red-600 text-xs">{errors.weight[0]}</p>}
          </label>

          <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
            体脂肪率（%）
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
              className="border p-2 rounded-md text-sm"
            />
            {errors.body_fat?.[0] && <p className="text-red-600 text-xs">{errors.body_fat[0]}</p>}
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
        {errors.memo?.[0] && <p className="text-red-600 text-xs">{errors.memo[0]}</p>}
      </section>
    </form>
  );
};

export default LogForm;
