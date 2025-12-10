import { useLogs } from '../store/useLogs';
import DailyCard from '../components/DailyCard';
import WeightMiniGraph from '../components/WeightMiniGraph';
import AddButton from '../components/AddButton';

const Home = () => {
  const logs = useLogs((state) => state.logs);

  // MyPageからプロフィール取得
  const nickname = localStorage.getItem('mypage_nickname') || '';
  const targetWeight = Number(localStorage.getItem('mypage_targetWeight') || 0);
  const height = Number(localStorage.getItem('mypage_height') || 0) / 100;

  // 最新ログを取得
  const latestLog = logs[0];
  const latestWeight = latestLog?.weight;

  // 差分計算
  let diffText = '';
  let diffBadgeClass = '';
  let diffIcon = '';

  if (latestWeight && targetWeight) {
    const diff = latestWeight - targetWeight;
    diffText = `${diff > 0 ? '+' : ''}${diff.toFixed(1)}kg`;

    if (diff > 0) {
      // 増えている：要注意
      diffBadgeClass = 'bg-orange-100 text-orange-700';
      diffIcon = '⚠️';
    } else {
      // 減っている：Good!!
      diffBadgeClass = 'bg-green-100 text-green-700';
      diffIcon = '🔥';
    }
  }

  // BMI計算
  let bmiText = '';
  let bmiLabel = '';
  let bmiBadgeClass = '';

  if (latestWeight && height > 0) {
    const bmi = latestWeight / (height * height);
    bmiText = `BMI ${bmi.toFixed(1)}`;

    if (bmi < 18.5) {
      bmiBadgeClass = 'bg-blue-100 text-blue-700';
      bmiLabel = 'UW';
    } else if (bmi < 25) {
      bmiBadgeClass = 'bg-green-100 text-green-700';
      bmiLabel = 'N';
    } else if (bmi < 30) {
      bmiBadgeClass = 'bg-yellow-100 text-yellow-700';
      bmiLabel = 'P1';
    } else if (bmi < 35) {
      bmiBadgeClass = 'bg-orange-100 text-orange-700';
      bmiLabel = 'O1';
    } else if (bmi < 40) {
      bmiBadgeClass = 'bg-red-100 text-red-600';
      bmiLabel = 'O2';
    } else {
      bmiBadgeClass = 'bg-red-200 text-red-800';
      bmiLabel = 'O3';
    }
  }

  const latest7 = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="px-4 py-24 sm:py-24 md:py-4 md:px-4">
      {/* 今日の進捗カード */}
      <section className="px-2 py-2 sm:px-5 sm:py-6 max-w-2xl rounded-2xl shadow-md mx-auto bg-primary/20 mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between mb-4 sm:mb-0">
          <h2 className="text-sm text-gray-500">
            {latestLog ? latestLog.date : '記録がまだありません'}
          </h2>
          <p className="text-lg font-semibold mt-1 sm:ml-2">
            {nickname ? `${nickname} さんの記録` : '今日の記録'}
          </p>
          {latestWeight && (
            <p className="text-sm text-gray-600 mt-1 sm:ml-auto">
              現在の体重：<span className="font-semibold">{latestWeight}kg</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 sm:justify-end">
          {/* 体重差分バッジ */}
          {diffText && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${diffBadgeClass}`}
            >
              <span>{diffIcon}</span>
              <span>{diffText}</span>
            </span>
          )}

          {/* BMIバッジ */}
          {bmiText && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${bmiBadgeClass}`}
            >
              <span>{bmiText}</span>
              {bmiLabel && <span> ({bmiLabel})</span>}
            </span>
          )}
        </div>
      </section>

      {/* 体重推移グラフ */}
      <section className="max-w-3xl px-1 sm:px-3 mx-auto mb-7 sm:mb-14">
        <WeightMiniGraph />
      </section>

      <h3 className="text-2xl font-bold mb-4 text-center">最新の7日間</h3>

      {/* DailyCardを並べる */}
      <div className="flex flex-wrap justify-center gap-4">
        {latest7.map((log) => (
          <DailyCard key={log.id} log={log} />
        ))}
      </div>

      <AddButton />
    </div>
  );
};

export default Home;
