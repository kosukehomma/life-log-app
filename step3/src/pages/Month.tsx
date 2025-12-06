import DailyCard from '../components/DailyCard';
import AddButton from '../components/AddButton';
import { useLogs } from '../store/useLogs';

const Month = () => {
  const logs = useLogs((state) => state.logs);

  return (
    <div className="px-4 py-24 sm:py-24 md:py-4 md:px-4">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4 text-center">月一覧</h2>

        {/* カード一覧 */}
        <div className="flex flex-wrap justify-center gap-4">
          {logs.map((log) => (
            <DailyCard key={log.id} log={log} />
          ))}
        </div>

        <AddButton />
      </div>
    </div>
  );
};

export default Month;
