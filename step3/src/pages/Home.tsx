import { useLogs } from '../store/useLogs';
import DailyCard from '../components/DailyCard';
import AddButton from '../components/AddButton';

const Home = () => {
  const logs = useLogs((state) => state.logs);

  const latest7 = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="px-4 py-24 sm:py-24 md:py-4 md:px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">最新の7日間</h2>

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
