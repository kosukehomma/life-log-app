import { useState, useRef } from 'react';
import type { Meals } from '../types';

const tabs = ["morning", "lunch", "dinner", "snack"] as const;
const labels = { morning: "朝", lunch: "昼", dinner: "夕", snack: "間食" };

type Props = {
  meals: Meals[];
};

const MealCarousel = ({ meals }: Props) => {
  const [current, setCurrent] = useState(0);

  const startX = useRef<number | null>(null);
  
  // --スワイプ処理
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    if (startX.current === null) return;
    const diff = endX - startX.current;

    if (diff > 50) setCurrent((prev) => Math.max(prev - 1, 0));
    if (diff < -50) setCurrent((prev) => Math.min(prev + 1, tabs.length - 1));

    startX.current = null;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* タブ */}
      <div className="flex gap-2 mb-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={`px-3 py-1 text-sm rounded-full transition ${
              i === current ? "bg-black text-white" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(i)}
          >
            {labels[t]}
          </button>
        ))}
      </div>

      {/* 本体 */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tabs.map((t) => (
          <div key={t} className="min-w-full px-1">
            <div className="relative overflow-hidden rounded-xl border border-slate-300 aspect-video bg-gray-100 flex items-center justify-center">
              {meals[t]?.imageUrl ? (
                <img src={meals[t]!.imageUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  {/* カメラアイコン */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-70"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 7h18M3 7l1.664 11.65c.114.798.796 1.35 1.6 1.35h11.472c.804 0 1.486-.552 1.6-1.35L21 7M9 7V4h6v3" />
                  </svg>
                  <span className="text-sm">画像を追加</span>
                </div>
              )}
            </div>

            <p className="text-sm mt-2">{meals[t]?.memo ?? ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealCarousel;
