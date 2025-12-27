import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogForm from '../components/LogForm';
import type { LogFormInput } from '../types';
import type { MealType, Log } from '../types';
import { supabase } from '../lib/supabase';
import { uploadMealImage, deleteMealImage } from '../lib/api/storage';
import { fetchLogById, updateLog, deleteLog } from '../lib/api/logs';
import { useLogs } from '../store/useLogs';
import toast from 'react-hot-toast';

const convertLogToForm = (log: Log): LogFormInput => ({
  date: log.date,
  weight: log.weight ?? 0,
  body_fat: log.body_fat ?? null,
  workout_tags: log.workout_tags ?? [],
  meals: {
    morning: log.meals?.morning,
    lunch: log.meals?.lunch,
    dinner: log.meals?.dinner,
    snack: log.meals?.snack,
  },
  memo: log.memo ?? '',
});

const EditLog = () => {
  const { loadLogs } = useLogs();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [log, setLog] = useState<Log | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchLogById(id)
      .then((data) => {
        setLog(data);
      })
      .catch((e) => {
        console.error('EditLog fetch error', e);
      });
  }, [id]);

  if (!userId || !log) return <p className="p-4">Loading...</p>;

  /* ---- Image ---- */
  const handleImageSelect = async (file: File, type: MealType) => {
    const currentUrl = log.meals?.[type]?.image_url ?? null;

    const url = await uploadMealImage(file, userId);

    if (currentUrl) {
      await deleteMealImage(currentUrl);
    }

    return url;
  };

  /* ---- Submit ---- */
  const handleSubmit = async (form: LogFormInput) => {
    setIsSubmitting(true);
    try {
      await updateLog({
        id: log.id,
        ...form,
        user_id: userId,
      });

      await loadLogs();
      toast.success('ログを更新しました');
      void navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Delete ---- */
  const handleDelete = async () => {
    if (!confirm('このログを削除しますか？')) return;

    setIsSubmitting(true);
    try {
      await deleteLog(log.id);
      await loadLogs();
      toast.success('ログを削除しました');
      void navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('削除に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <LogForm
        initialLog={convertLogToForm(log)}
        onSubmit={handleSubmit}
        onImageSelect={handleImageSelect}
      />

      {/* フッターボタン */}
      <div
        className={`
          sticky bottom-0 bg-white border-t p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]
          ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        <button
          type="button"
          onClick={() => void handleDelete()}
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
