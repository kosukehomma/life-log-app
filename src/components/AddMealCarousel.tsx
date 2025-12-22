import { useRef, useState, useEffect } from 'react';
import type { MealType, Meal } from '../types';
import { deleteMealImage } from '../lib/api/storage';

const tabs: MealType[] = ['morning', 'lunch', 'dinner', 'snack'];
const labels = {
  morning: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '+間食',
};

type Props = {
  meals: Record<MealType, Meal | undefined>;
  onChange: (type: MealType, meal: Meal) => void;
  onImageSelect?: (file: File, type: MealType) => Promise<void>;
  initialType?: MealType;
};

const AddMealCarousel = ({ meals, onChange, initialType, onImageSelect }: Props) => {
  const [current, setCurrent] = useState(initialType ? tabs.indexOf(initialType) : 0);

  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = e.changedTouches[0].clientX - startX.current;

    if (diff > 50) setCurrent((prev) => Math.max(prev - 1, 0));
    if (diff < -50) setCurrent((prev) => Math.min(prev + 1, tabs.length - 1));

    startX.current = null;
  };

  useEffect(() => {
    if (!initialType) return;
    if (!tabs.includes(initialType)) return;
    setCurrent(tabs.indexOf(initialType));
  }, [initialType]);

  const currentType = tabs[current];
  const meal = meals[currentType];

  const updateMeal = (data: Partial<Meal>) => {
    onChange(currentType, {
      id: `${Date.now()}-${currentType}`,
      type: currentType,
      image_url: meal?.image_url ?? null,
      description: meal?.description ?? '',
      created_at: meal?.created_at ?? new Date().toISOString(),
      ...data,
    });
  };

  const handleDeleteImage = async () => {
    if (!meal?.image_url) return;

    await deleteMealImage(meal.image_url);
    updateMeal({ image_url: null });
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b mb-2">
        {tabs.map((t, i) => (
          <button
            type="button"
            key={t}
            onClick={() => setCurrent(i)}
            className={`py-1 px-2 text-sm font-medium transition relative ${
              current === i
                ? "text-primary font-semibold after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-primary"
                : 'text-gray-500 bg-gray-100 hover:bg-gray-300'
            }`}
          >
            {labels[t]}
          </button>
        ))}
      </div>

      {/* image */}
      <label
        htmlFor={`meal-image-${currentType}`}
        className="block relative border rounded-xl aspect-[14/9] bg-gray-100 current-pointer overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {meal?.image_url ? (
          <div className="relative w-full h-full">
            <img src={meal.image_url} className="w-full h-full object-cover" />

            <button
              type="button"
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
              onClick={() => void handleDeleteImage()}
            >
              削除
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 px-2 text-center">
            <strong>{labels[currentType]}</strong>の画像を追加
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`meal-image-${currentType}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            void onImageSelect?.(file, currentType);
          }}
        />
      </label>

      {/* memo */}
      <textarea
        className="w-full border p-2 rounded-lg text-sm"
        placeholder={`${labels[currentType]}のメモ（64文字以内）`}
        value={meal?.description ?? ''}
        maxLength={64}
        onChange={(e) => updateMeal({ description: e.target.value })}
      />
      <div
        className={`text-xs text-right mt-1 ${
          (meal?.description?.length ?? 0) >= 64 ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        {meal?.description?.length ?? 0}/64
      </div>
    </div>
  );
};

export default AddMealCarousel;
