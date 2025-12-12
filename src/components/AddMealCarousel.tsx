import { useRef, useState, useEffect } from 'react';
import type { MealType, Meal } from '../types';

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
  initialType?: MealType;
};

const AddMealCarousel = ({ meals, onChange, initialType }: Props) => {
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
      imageUrl: meal?.imageUrl ?? null,
      memo: meal?.memo ?? '',
      created_at: meal?.created_at ?? new Date().toISOString(),
      ...data,
    });
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      updateMeal({
        imageUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
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
        className="block relative border rounded-xl aspect-[14/9] bg-gray-100 current-pointer overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {meal?.imageUrl ? (
          <img src={meal.imageUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 px-2 text-center">
            <strong>{labels[currentType]}</strong>の画像を追加
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageSelect(f);
          }}
        />
      </label>

      {/* memo */}
      <textarea
        className="w-full border p-2 rounded-lg text-sm"
        placeholder={`${labels[currentType]}のメモ（64文字以内）`}
        value={meal?.memo ?? ''}
        maxLength={64}
        onChange={(e) => updateMeal({ memo: e.target.value })}
      />
      <div
        className={`text-xs text-right mt-1 ${
          (meal?.memo?.length ?? 0) >= 64 ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        {meal?.memo?.length ?? 0}/64
      </div>
    </div>
  );
};

export default AddMealCarousel;
