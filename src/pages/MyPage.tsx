import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Profile } from '../types';

const MyPage = () => {
  const user = useAuthStore((s) => s.user);

  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [startWeight, setStartWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  // ① profiles 読み込み
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nickname, height, start_weight, target_weight')
        .eq('id', user.id)
        .single<Profile>();

      if (error) {
        console.error(error);
        toast.error('プロフィールの取得に失敗しました');
        return;
      }

      setNickname(data.nickname ?? '');
      setHeight(data.height?.toString() ?? '');
      setStartWeight(data.start_weight?.toString() ?? '');
      setTargetWeight(data.target_weight?.toString() ?? '');
    };

    void fetchProfile();
  }, [user]);

  // ② 保存処理
  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      nickname: nickname || null,
      height: height ? Number(height) : null,
      start_weight: startWeight ? Number(startWeight) : null,
      target_weight: targetWeight ? Number(targetWeight) : null,
    });
    if (error) {
      console.error(error);
      toast.error('保存に失敗しました');
    } else {
      toast.success('プロフィールを保存しました');
    }

    setIsSaving(false);
  };

  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('ログアウトしました');
      void navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('ログアウトに失敗しました');
    }
  };

  return (
    <div className="p-6 md:ml-52 pt-20 md:pt-6">
      <h2 className="text-2xl font-bold text-primary mb-6">My Page</h2>

      <div className="space-y-6 max-w-sm">
        {/* ニックネーム */}
        <div>
          <label className="block font-semibold mb-1">ニックネーム</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* 身長 */}
        <div>
          <label className="block font-semibold mb-1">身長（cm）</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* 初期体重 */}
        <div>
          <label className="block font-semibold mb-1">初期体重（kg）</label>
          <input
            type="number"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* 目標体重 */}
        <div>
          <label className="block font-semibold mb-1">目標体重（kg）</label>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* 保存ボタン */}
        <button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className={`
            w-full text-white py-2 rounded font-bold transition
            ${isSaving ? 'bg-green-600' : 'bg-primary hover:opacity-90'}
          `}
        >
          {isSaving ? '保村中...' : '保存'}
        </button>

        {/* ログアウト */}
        <button
          onClick={() => void handleLogout()}
          className="w-full text-white py-2 rounded font-bold bg-red-500 mt-3"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default MyPage;
