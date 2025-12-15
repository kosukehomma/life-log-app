import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import type { Log, Meal, MealType } from '../types';
import FormWorkTag from '../components/FormWorkTag';
import AddMealCarousel from '../components/AddMealCarousel';

const emptyMeals: Record<MealType, Meal | undefined> = {
  morning: undefined,
  lunch: undefined,
  dinner: undefined,
  snack: undefined,
};

const EditLog = () => {
  const { logId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { logs, loadFromStorage, updateLog, deleteLog } = useLogs();

  const query = new URLSearchParams(location.search);
  const mealType = query.get('meal') as MealType | null;

  const [targetLog, setTargetLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [workout, setWorkout] = useState<string[]>([]);
  const [meals, setMeals] = useState<Record<MealType, Meal | undefined>>(emptyMeals);
  const [comment, setComment] = useState('');
  // Mealセクション用
  const mealRef = useRef<HTMLDivElement | null>(null);

  // ログ読み込み
  useEffect(() => {
    // ログが空なら storage から復元（念の為）
    if (logs.length === 0) {
      loadFromStorage();
      return;
    }

    if (!logId) return;

    const idNum = Number(logId);
    if (Number.isNaN(idNum)) return;

    const found = logs.find((l) => l.id === logId) ?? null;
    if (!found) return;

    setTargetLog(found);
    setDate(found.date);
    setWeight(found?.weight ?? '');
    setFat(found?.body_fat ?? '');
    setWorkout(found?.workout_tags ?? []);
    setMeals({
      ...emptyMeals,
      ...found.meals,
    });
    setComment(found?.memo ?? '');
    setLoading(false);
  }, [logs, logId, loadFromStorage]);

  // スクロール (画像タップ時のみ)
  useEffect(() => {
    if (!mealType) return;
    if (!mealRef.current) return;
    if (loading) return;

    const offset = 90;
    const y = mealRef.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, [mealType, loading]);

  // AddMealCarousel用
  const handleMealChange = (type: MealType, meal: Meal) => {
    setMeals((prev) => ({
      ...prev,
      [type]: meal,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLog) return;

    const updated: Log = {
      ...targetLog,
      date,
      weight: Number(weight),
      body_fat: fat === '' ? null : Number(fat),
      workout_tags: workout,
      meals,
      memo: comment,
    };

    updateLog(updated);
    void navigate('/');
  };

  const handleDeleteLog = () => {
    if (!targetLog) return;
    if (!confirm('この1日のログを削除しますか？')) return;

    deleteLog(targetLog.id);
    void navigate('/');
  };

  if (!logId) {
    return <p className="p-4">URLが不正です</p>;
  }

  if (loading || !targetLog) {
    return <p className="p-4">読み込み中...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          type="button"
          onClick={() => void navigate(-1)}
          className="text-primary font-semibold flex items-center gap-1"
        >
          <span className="text-lg">←</span>
          戻る
        </button>
        <h2 className="text-2xl font-bold text-center">ログを編集</h2>
        <div className="w-12" />
      </div>

      {/* 本体 */}
      <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-8">
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
        <section id="meal-section" className="space-y-4" ref={mealRef}>
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">Meal</h3>
          <AddMealCarousel
            meals={meals}
            onChange={handleMealChange}
            initialType={mealType ?? undefined}
          />
        </section>

        {/* コメント */}
        <section className="space-y-2">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">コメント</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={128}
            className="border p-3 rounded-md resize-none w-full h-[120px] text-sm"
            placeholder="コメントを入力（最大128文字）"
          />
          <div className="text-right text-xs mt-1">
            <span className={comment.length >= 128 ? 'text-red-600' : 'text-gray-600'}>
              {comment.length} / 128
            </span>
          </div>
        </section>
      </form>

      {/* フッターボタン */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={handleDeleteLog}
          className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold"
        >
          このログを削除
        </button>
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

export default EditLog;
