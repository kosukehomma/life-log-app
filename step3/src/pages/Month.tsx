import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CardList from '../components/CardList';
import AddButton from '../components/AddButton';
import { useLogs } from '../store/useLogs';

const Month = () => {
  const { year, month } = useParams();
  const { logs, loadFromStorage, deleteLog } = useLogs();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const monthlyLogs = logs.filter((log) => {
    const [y, m] = log.date.split('/');
    return y === year && m === month;
  });

  const handleEdit = (id: number) => {
    window.location.href = `/edit/${id}`;
  };

  return (
    <div className="ml-56 p-6">
      <Sidebar logs={logs} />

      <h2 className="text-2xl font-bold mb-6">
        {year}年 {Number(month)}月の記録
      </h2>

      <CardList logs={monthlyLogs} onEdit={handleEdit} onDelete={deleteLog} />

      <AddButton />
    </div>
  );
};

export default Month;
