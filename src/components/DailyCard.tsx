import { useNavigate } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import MealCarousel from './MealCarousel';
import type { Log } from '../types';
import { getWorkoutStyle } from '../utils/workoutCategory';
import toast from 'react-hot-toast';

type Props = {
  log: Log;
};

// 日付差（日数）を取るユーティリティ
const dayDiff = (d1: string, d2: string) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// BMIラベル
const getBmiLabel = (bmi: number) => {
  if (bmi < 18.5) return 'UW';
  if (bmi < 25) return 'N';
  if (bmi < 30) return 'P1';
  if (bmi < 35) return 'O1';
  if (bmi < 40) return 'O2';
  return 'O3';
};

const DailyCard = ({ log }: Props) => {
  const navigate = useNavigate();
  const deleteLog = useLogs((s) => s.deleteLog);
  const logs = useLogs((s) => s.logs);

  // 先週比計算
  const sorted = [...logs].sort((a, b) => (a.date > b.date ? 1 : -1));
  const currentIndex = sorted.findIndex((l) => l.id === log.id);

  const targetDate = log.date;
  const oneWeekBefore = new Date(targetDate);
  oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

  let weeklyBase: Log | null = null;
  let minDiff = Infinity;

  sorted.forEach((l) => {
    const diff = Math.abs(dayDiff(targetDate, l.date));
    if (diff <= 2) {
      // ±2日以内で最も近い日
      if (Math.abs(dayDiff(oneWeekBefore.toISOString().slice(0, 10), l.date)) < minDiff) {
        minDiff = Math.abs(dayDiff(oneWeekBefore.toISOString().slice(0, 10), l.date));
        weeklyBase = l;
      }
    }
  });

  // "先週比ログ" が見つからない場合 → 前回ログ
  const prevLog = weeklyBase ?? (currentIndex > 0 ? sorted[currentIndex - 1] : null);

  const diff =
    typeof log.weight === 'number' && typeof prevLog?.weight === 'number'
      ? log.weight - prevLog.weight
      : null;

  const diffDisplay = diff !== null ? `${diff > 0 ? '+' : ''}${diff.toFixed(1)}kg` : '--';

  const isLoss = diff !== null && diff < 0;

  const badgeColor = isLoss ? 'bg-emerald-500' : 'bg-orange-500';
  const badgeIcon = isLoss ? '↘︎' : '↗︎';

  const badgeLabel = weeklyBase ? '先' : '前';

  // BMI計算
  const heightM = 1.72;
  const bmi =
    typeof log.weight === 'number'
      ? parseFloat((log.weight / (heightM * heightM)).toFixed(1))
      : null;
  const bmiLabel = bmi !== null ? getBmiLabel(bmi) : '--';

  const handleDelete = async () => {
    if (!confirm('この1日のログを削除しますか？')) return;

    try {
      await deleteLog(log.id);
      toast.success('ログを削除しました');
    } catch (error) {
      console.error(error);
      toast.error('削除に失敗しました');
    }
  };

  return (
    <div className="w-full max-w-full sm:max-w-[48%] md:max-w-[280px] bg-white rounded-2xl border border-b border-slate-300 shadow-lg p-4 flex flex-col gap-4">
      {/* 進捗バッジ */}
      <div className="flex flex-row flex-wrap gap-2 sm:gap-3 items-baseline mb-1">
        {/* 体重変化 */}
        {diff !== null && (
          <span
            className={`flex w-fit items-center text-white text-xs px-3 py-1 rounded-full shadow ${badgeColor}`}
          >
            {badgeIcon} <b className="ml-0.5">{diffDisplay}</b> ({badgeLabel})
          </span>
        )}
        {/* BMI */}
        <span
          className={`flex w-fit items-center text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-md`}
        >
          BMI <b className="mx-1">{bmi}</b> ({bmiLabel})
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1 border-b pb-1">
        <p className="text-lg font-semibold text-gray-700 tracking-wide">{log.date}</p>

        <div className="flex items-baseline gap-4">
          <div className="flex items-baseline whitespace-nowrap">
            <span className="text-[9px] text-gray-400 tracking-wide mr-1 uppercase">weight</span>
            <span className="text-2xl font-bold text-gray-900">{log.weight}kg</span>
          </div>
          {typeof log.body_fat === 'number' && (
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-[9px] text-gray-400 tracking-wide mr-1 uppercase">fat</span>
              <span className="text-xl font-semibold text-sky-800">
                {log.body_fat ? `${log.body_fat}%` : '--'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Workout */}
      {log.workout_tags && log.workout_tags.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1 tracking-wide">WORKOUT</p>
          <div className="flex flex-wrap gap-1.5">
            {log.workout_tags.map((item, i) => {
              const { color, icon } = getWorkoutStyle(item);
              return (
                <span
                  key={i}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-white/90 ${color} whitespace-nowrap drop-shadow-md leading-tight`}
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
        <MealCarousel meals={log.meals || {}} logId={log.id} />
      </div>

      {/* Comment */}
      {log.memo && (
        <div className="border-t pt-1">
          <p className="text-xs font-semibold text-gray-700 mb-0.5 tracking-wide">COMMENT</p>
          <p className="text-xs text-gray-600 leading-5">{log.memo}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            void navigate(`/edit/${log.id}`);
          }}
          className="px-3 py-1 text-xs rounded-md bg-primary text-white font-medium"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="px-3 py-1 text-xs rounded-md bg-red-500 text-white font-medium"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default DailyCard;
