import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogs } from '../../store/useLogs';
import type { Log, Meal, MealType } from '../../types';

const MealEdit = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const { logs, updateMeal, deleteMeal } = useLogs();

  const [log, setLog] = useState<Log | null>(null);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [memoText, setMemoText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!mealId) return;

    const [logIdString, mealTypeStr] = mealId.split('-');
    const logId = Number(logIdString);
    const type = mealTypeStr as MealType;

    const foundLog = logs.find((l) => l.id === logId) ?? null;
    const foundMeal = foundLog?.meals[type] ?? null;

    setLog(foundLog);
    setMeal(foundMeal);
    setMemoText(foundMeal?.memo ?? '');
    setImageUrl(foundMeal?.imageUrl ?? null);
  }, [logs, mealId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newUrl = URL.createObjectURL(file);
    setImageUrl(newUrl);
  };

  const handleSave = () => {
    if (!log || !meal) return;

    updateMeal(log.id, meal.type, {
      ...meal,
      memo: memoText,
      imageUrl: imageUrl,
      created_at: meal?.created_at ?? '',
    });

    navigate(-1);
  };

  const handleDelete = () => {
    if (!log) return;
    if (!confirm('この食事を削除しますか？')) return;

    deleteMeal(log.id, meal?.type ?? 'morning');
    navigate(-1);
  };

  if (!log) return <p>ログがありません。</p>;
  if (!meal) return <p>食事データがありません。</p>;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="text-blue-500 underline">
        ← 戻る
      </button>

      <h2 className="text-xl font-bold">食事を編集</h2>

      {/* 画像プレビュー */}
      <div className="w-full h-[200px] bg-gray-200 rounded-lg overflow-hidden relative">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-hull object-cover object-center" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            画像なし
          </div>
        )}

        <label
          htmlFor="fileInput"
          className="absolute bottom-2 right-2 px-3 py-1 bg-black bg-opacity-70 text-white text-xs rounded cursor-pointer hover:bg-opacity-45"
        >
          画像変更
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* TODO：画像変更用のUI追加予定 */}

      {/* メモ編集 */}
      <textarea
        value={memoText}
        onChange={(e) => setMemoText(e.target.value)}
        className="w-full border rounded-lg p-2"
      />

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold"
      >
        保存する
      </button>

      {/* 削除ボタン */}
      <button
        onClick={handleDelete}
        className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold"
      >
        削除する
      </button>
    </div>
  );
};

export default MealEdit;
