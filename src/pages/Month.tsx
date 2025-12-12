import { useParams } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import WeightMiniGraph from '../components/WeightMiniGraph';
import DailyCard from '../components/DailyCard';
import AddButton from '../components/AddButton';

const Month = () => {
  const { year, month } = useParams();
  const logs = useLogs((state) => state.logs);

  // 年月一致ログのみ抽出
  const filteredLogs = logs.filter((log) => {
    const [logYear, logMonth] = log.date.includes('/') ? log.date.split('/') : log.date.split('-');
    return logYear === year && logMonth === month;
  });

  return (
    <div className="px-4 py-24 sm:py-24 md:py-4 md:px-4">
      <div className="flex-1">
        {/* タイトル */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          {year}年 {Number(month)}月 一覧
        </h2>

        {/* 月別のログの見渡す */}
        <section className="max-w-5xl px-1 sm:px-3 mx-auto mb-7 sm:mb-14">
          <WeightMiniGraph targetLogs={filteredLogs} />
        </section>

        {/* カード一覧 */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredLogs.map((log) => (
            <DailyCard key={log.id} log={log} />
          ))}
        </div>

        {/* ログがないときのメッセージ */}
        {filteredLogs.length === 0 && (
          <p className="text-center mt-10 text-gray-500">この月の記録はありません</p>
        )}

        <AddButton />
      </div>
    </div>
  );
};

export default Month;
