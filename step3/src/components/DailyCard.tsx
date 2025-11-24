import { useState } from 'react';
import type { Log } from '../types';

type Props = {
  log: Log;
};

const tabs = ['morning', 'lunch', 'dinner', 'snack'] as const;

const tabLabels: Record<(typeof tabs)[number], string> = {
  morning: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '＋間食',
};

const DailyCard = ({ log }: Props) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('morning');

  const meal = log.meals[activeTab];

  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-1">
        <p className="text-lg font-medium text-gray-700">{log.date}</p>
        <p className="text-2xl font-semibold text-gray-900">{log.weight}kg</p>
      </div>

      {/* Workout tags */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Workout</p>
        <div className="flex flex-wrap gap-2">
          {log.workout.map((item, i) => (
            <span key={i} className="px-2 py-1 text-xs bg-slate-200 text-gray-700 rounded-lg">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Meal section */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Meal</p>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 text-sm font-medium transition relative ${
                activeTab === tab
                  ? "bg-[#e6eef9] text-primary font-semibold after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[3px] after:bg-primary after:rounded-full"
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Image placeholder */}
        <div className="w-full aspect-[16/9] rounded-lg border border-slate-300 flex items-center justify-center text-slate-400">
          {meal?.imageUrl ? (
            <img
              src={meal.imageUrl}
              alt="meal-img"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-xs">No Image</span>
          )}
        </div>

        {/* Memo */}
        <p className="mt-1 text-xs text-gray-600 italic">{meal?.memo || 'メモ無し'}</p>
      </div>

      {/* Comment */}
      <div className="border-t pt-2">
        <p className="text-sm font-semibold text-gray-800 mb-1">Comment</p>
        <p className="text-xs text-gray-700">{log.comment}</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-1">
        <button className="px-3 py-1 text-xs rounded-md bg-primary text-white font-medium">
          編集
        </button>
        <button className="px-3 py-1 text-xs rounded-md bg-red-500 text-white font-medium">
          削除
        </button>
      </div>
    </div>
  );
};

export default DailyCard;
