import { useState, useRef } from 'react';
import type { Meal } from '../types';

type Props = {
  meals: Meal[];
};

const MealCarousel = ({ meals }: Props) => {
  const [current, setCurrent] = useState(0);

  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  // --スワイプ処理
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    endX.current = e.changedTouches[0].clientX;
    if (startX.current === null || endX.current === null) return;

    const diff = endX.current - startX.current;

    if (diff > 50) {
      // 右スワイプ
      setCurrent((prev) => Math.max(prev - 1, 0));
    } else if (diff < -50) {
      // 左スワイプ
      setCurrent((prev) => Math.min(prev + 1, meals.length - 1));
    }

    startX.current = null;
    endX.current = null;
  };

  // --- PC向けドラッグ処理
  const dragging = useRef(false);
  const dragStartX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    dragging.current = false;

    const diff = e.clientX - dragStartX.current;

    if (diff > 50) {
      setCurrent((prev) => Math.max(prev - 1, 0));
    } else if (diff < -50) {
      setCurrent((prev) => Math.min(prev + 1, meals.length - 1));
    }
  };

  const onMouseLeave = () => {
    dragging.current = false;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* スライド本体 */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {meals.map((meal, i) => (
          <div key={i} className="min-w-full px-1">
            <div className="relative w-full overflow-hidden rounded-lg border border-slate-300">
              {/* 画像 */}
              <img
                src={meal.img}
                alt={meal.label}
                className="w-full h-auto object-cover aspect-[14/9]"
              />
              {/* ラベル（朝/昼/夕） */}
              <span className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 rounded-br-md">
                {meal.label}
              </span>
            </div>

            {/* 料理名 */}
            {meal.name && <p className="mt-1 text-sm text-gray-700 font-medium">{meal.name}</p>}

            {/* メモ */}
            {meal.note && <p className="text-xs text-gray-500 mt-0.5 italic">{meal.note}</p>}
          </div>
        ))}
      </div>

      {/* インジケータ */}
      <div className="flex justify-center gap-2 mt-2">
        {meals.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition ${
              i === current ? 'bg-primary' : 'bg-slate-300'
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default MealCarousel;
