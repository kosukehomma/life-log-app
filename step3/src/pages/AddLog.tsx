import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import FormWorkTag from '../components/FormWorkTag';
import AddMealCarousel from '../components/AddMealCarousel';
import type { Meal, MealType } from '../types';

const today = new Date().toISOString().split('T')[0];

const emptyMeals: Record<MealType, Meal | undefined> = {
  morning: undefined,
  lunch: undefined,
  dinner: undefined,
  snack: undefined,
};

const AddLog = () => {
  const navigate = useNavigate();
  const addLog = useLogs((s) => s.addLog);

  const [date, setDate] = useState<string>(today);
  const [weight, setWeight] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [workout, setWorkout] = useState<string[]>([]);
  const [meals, setMeals] = useState<Record<MealType, Meal | undefined>>(emptyMeals);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog = {
      id: Date.now(),
      date,
      weight: Number(weight),
      fat: fat === '' ? null : Number(fat),
      workout,
      meals,
      comment,
    };

    addLog(newLog);
    navigate('/');
  };

  const updateMeal = (type: MealType, newMeal: Meal) => {
    setMeals((prev) => ({
      ...prev,
      [type]: newMeal,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
      <div className="flex items-center justify-center p-4 border-b">
        <h2 className="text-2xl font-bold text-center">新規ログ追加</h2>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-8">
        {/* 日付・体重・体脂肪率 */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">基本情報</h3>

          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
              日付
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </label>

            <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
              体重（kg）
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </label>

            <label className="flex flex-col flex-1 text-sm font-semibold gap-1">
              体脂肪率（%）
              <input
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                placeholder="入力しなくてもOK"
              />
            </label>
          </div>
        </section>

        {/* WORKOUT */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">Workout</h3>
          <FormWorkTag value={workout} onChange={setWorkout} />
        </section>

        {/* MEAL */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">Meal</h3>
          <AddMealCarousel meals={meals} onChange={updateMeal} />
        </section>

        {/* COMMENT */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">コメント</h3>
          <textarea
            value={comment}
            maxLength={128}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-md p-3 resize-none text-sm"
            placeholder="コメントを入力（最大128文字）"
          />
          <p
            className={`text-xs text-right ${
              comment.length >= 128 ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            {comment.length} / 128
          </p>
        </section>
      </form>

      {/* フッターボタn */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
        <button
          type="submit"
          formAction=""
          onClick={handleSubmit}
          className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default AddLog;
