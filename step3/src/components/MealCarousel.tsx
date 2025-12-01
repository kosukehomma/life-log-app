import { useRef, useState } from 'react';
import type { Meals, MealType } from '../types';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs: MealType[] = ['morning', 'lunch', 'dinner', 'snack'];
const labels = {
  morning: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '+間食',
};

type Props = {
  meals: Meals;
  logId: number;
};

const MealCarousel = ({ meals, logId }: Props) => {
  const [current, setCurrent] = useState(0);
  const startX = useRef<number | null>(null);
  const navigate = useNavigate();

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

  return (
    <div className="w-full overflow-hidden">
      {/* Tab */}
      <div className="flex gap-3 mb-2">
        {tabs.map((type, index) => (
          <button
            key={type}
            onClick={() => setCurrent(index)}
            className={`relative pb-0.5 text-sm font-medium transition 
              ${
                current === index
                  ? "text-primary font-semibold after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[2px] after:h-[2px] after:bg-primary after:rounded-full"
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {labels[type]}
          </button>
        ))}
      </div>

      {/* スライド本体 */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tabs.map((type) => {
          const meal = meals[type];

          return (
            <div key={type} className="min-w-full px-1 relative">
              {/* Image */}
              <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm aspect-video flex items-center justify-center">
                {meal?.imageUrl ? (
                  <img
                    src={meal.imageUrl}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.3}
                        d="M3 7h18M3 7l1.7 11.6c.1.8.8 1.4 1.6 1.4h11.4c.8 0 1.5-.6 1.6-1.4L21 7M9 7V4h6v3"
                      />
                    </svg>
                    <span className="text-xs">画像を追加</span>
                  </div>
                )}
              </div>

              {/* Memo */}
              <p className="text-xs mt-1 text-gray-700 line-clamp-2">{meal?.memo || ''}</p>

              {/* 編集ボタン */}
              {meal && (
                <button
                  onClick={() => navigate(`/meal/edit/${logId}-${type}`)}
                  className="absolute top-2 right-3 bg-white/80 p-1.5 rounded-full shadow backdrop-blur-sm hover:bg-white transition"
                >
                  <Pencil size={16} className="text-gray-700" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealCarousel;
