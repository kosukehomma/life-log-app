import { useNavigate } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import MealCarousel from './MealCarousel';
import type { Log } from '../types';
import { getWorkoutStyle } from '../utils/workoutCategory';

type Props = {
  log: Log;
};

const DailyCard = ({ log }: Props) => {
  const navigate = useNavigate();
  const deleteLog = useLogs((s) => s.deleteLog);

  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl border border-b border-slate-300 shadow-lg p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b pb-1">
        <p className="text-lg font-semibold text-gray-700 tracking-wide">{log.date}</p>

        <div className="flex items-baseline gap-4">
          <div className="flex items-baseline whitespace-nowrap">
            <span className="text-[9px] text-gray-400 tracking-wide mr-1 uppercase">weight</span>
            <span className="text-2xl font-bold text-gray-900">{log.weight}kg</span>
          </div>
          {typeof log.fat === 'number' && (
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-[9px] text-gray-400 tracking-wide mr-1 uppercase">fat</span>
              <span className="text-xl font-semibold text-sky-800">
                {log.fat ? `${log.fat}%` : '--'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Workout */}
      {log.workout.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1 tracking-wide">WORKOUT</p>
          <div className="flex flex-wrap gap-1.5">
            {log.workout.map((item, i) => {
              const { color, icon } = getWorkoutStyle(item);
              return (
                <span
                  key={i}
                  className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg text-white ${color} whitespace-nowrap drop-shadow-md`}
                >
                  <span>{icon}</span>
                  {item}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* MealCarousel */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-1 tracking-wide">MEAL</p>
        <MealCarousel meals={log.meals} logId={log.id} />
      </div>

      {/* Comment */}
      {log.comment && (
        <div className="border-t pt-1">
          <p className="text-xs font-semibold text-gray-700 mb-0.5 tracking-wide">COMMENT</p>
          <p className="text-xs text-gray-600 leading-5">{log.comment}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => navigate(`/edit/${log.id}`)}
          className="px-3 py-1 text-xs rounded-md bg-primary text-white font-medium"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm('この1日のログを削除しますか？')) return;
            deleteLog(log.id);
          }}
          className="px-3 py-1 text-xs rounded-md bg-red-500 text-white font-medium"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default DailyCard;
