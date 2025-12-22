import { useNavigate, useParams } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import LogForm from '../components/LogForm';
import type { Log } from '../types';

const EditLog = () => {
  const { logId } = useParams();
  const navigate = useNavigate();
  const { logs, updateLog, deleteLog } = useLogs();

  const target = logs.find((l) => l.id === logId);
  if (!target) return <p className="p-4">読み込み中...</p>;

  const handleSubmit = (log: Log): Promise<void> => {
    return submitAsync(log);
  };

  const submitAsync = async (log: Log) => {
    await updateLog(log);
    void navigate('/');
  };

  const handleDeleteLog = () => {
    if (!target) return;

    if (!confirm('この1日のログを削除しますか？')) return;

    void deleteAsync();
  };

  const deleteAsync = async () => {
    if (!target) return;

    await deleteLog(target.id);
    void navigate('/');
  };

  if (!logId) {
    return <p className="p-4">URLが不正です</p>;
  }

  if (!target) {
    return <p className="p-4">読み込み中...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          type="button"
          onClick={() => void navigate(-1)}
          className="text-primary font-semibold flex items-center gap-1"
        >
          <span className="text-lg">←</span>
          戻る
        </button>
        <h2 className="text-2xl font-bold text-center">ログを編集</h2>
        <div className="w-12" />
      </div>

      {/* 本体 */}
      <LogForm initialLog={target} onSubmit={handleSubmit} />

      {/* フッターボタン */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={handleDeleteLog}
          className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold"
        >
          このログを削除
        </button>
        <button
          type="submit"
          form="log-form"
          className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default EditLog;
