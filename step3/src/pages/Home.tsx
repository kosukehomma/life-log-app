import { useEffect } from 'react';
import CardList from '../components/CardList';
import AddButton from '../components/AddButton';
import { useLogs } from '../store/useLogs';

const Home = () => {
  const { logs, loadFromStorage, deleteLog } = useLogs();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const latest7 = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  const handleEdit = (id: number) => {
    window.location.href = `/edit/${id}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">最新の7日間</h2>
      <CardList logs={latest7} onEdit={handleEdit} onDelete={deleteLog} />
      <AddButton />
    </div>
  );
};

export default Home;
