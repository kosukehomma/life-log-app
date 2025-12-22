import { useNavigate } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import LogForm from '../components/LogForm';
import type { Log } from '../types';
import { supabase } from '../lib/supabase';

const today = new Date().toISOString().split('T')[0];

const AddLog = () => {
  const navigate = useNavigate();
  const { addLog } = useLogs();

  const initialLog: Log = {
    id: crypto.randomUUID(),
    user_id: '',
    date: today,
    weight: 0,
    body_fat: null,
    workout_tags: [],
    meals: {},
    memo: '',
  };

  const handleSubmit = async (log: Log) => {
    await submitAsync(log);
  };

  const submitAsync = async (log: Log) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await addLog({
      ...log,
      user_id: user.id,
    });

    void navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          type="button"
          onClick={() => void navigate(-1)}
          className="text-primary font-semibold flex items-center gap-1"
        >
          <span className="text-lg">←</span>
          戻る
        </button>
        <h2 className="text-2xl font-bold text-center">新規ログ追加</h2>
        <div className="w-12" />
      </div>

      <LogForm initialLog={initialLog} onSubmit={handleSubmit} />

      {/* フッターボタn */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
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

export default AddLog;
