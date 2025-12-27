import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogForm from '../components/LogForm';
import type { LogFormInput } from '../types';
import { supabase } from '../lib/supabase';
import { uploadMealImage } from '../lib/api/storage';
import { insertLog } from '../lib/api/logs';
import { useLogs } from '../store/useLogs';
import toast from 'react-hot-toast';

const emptyLog: LogFormInput = {
  date: new Date().toISOString().slice(0, 10),
  weight: 0,
  body_fat: null,
  workout_tags: [],
  meals: {
    morning: undefined,
    lunch: undefined,
    dinner: undefined,
    snack: undefined,
  },
  memo: '',
};

const AddLog = () => {
  const { loadLogs } = useLogs();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  /* ---- Image ----- */
  const handleImageSelect = async (file: File) => {
    if (!userId) throw new Error('not authenticated');

    const url = await uploadMealImage(file, userId);
    return url;
  };

  /* ---- Submit ----- */
  const handleSubmit = async (log: LogFormInput) => {
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await insertLog({
        ...log,
        user_id: userId,
      });

      await loadLogs();

      toast.success('ログを追加しました');
      void navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
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

      <LogForm initialLog={emptyLog} onSubmit={handleSubmit} onImageSelect={handleImageSelect} />

      {/* フッターボタn */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
        <button
          type="submit"
          form="log-form"
          disabled={isSubmitting}
          className={`flex-1 py-2 rounded-lg font-semibold
            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white'}
          `}
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
};

export default AddLog;
