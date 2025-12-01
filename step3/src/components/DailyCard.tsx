import MealCarousel from './MealCarousel';
import type { Log } from '../types';
import { getWorkoutStyle } from '../utils/workoutCategory';

type Props = {
  log: Log;
};

const DailyCard = ({ log }: Props) => {
  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-baseline border-b pb-1">
        <p className="text-lg font-medium text-gray-700">{log.date}</p>
        <p className="text-2xl font-semibold text-gray-900">{log.weight}kg</p>
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
                  className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg text-white ${color} whitespace-nowrap`}
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
    </div>
  );
};

export default DailyCard;
