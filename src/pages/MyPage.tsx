import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const MyPage = () => {
  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [startWeight, setStartWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNickname(localStorage.getItem('mypage_nickname') || '');
    setHeight(localStorage.getItem('mypage_height') || '');
    setStartWeight(localStorage.getItem('mypage_startWeight') || '');
    setTargetWeight(localStorage.getItem('mypage_targetWeight') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('mypage_nickname', nickname);
    localStorage.setItem('mypage_height', height);
    localStorage.setItem('mypage_startWeight', startWeight);
    localStorage.setItem('mypage_targetWeight', targetWeight);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          onClick={handleSave}
          className={`
            w-full text-white py-2 rounded font-bold transition
            ${saved ? 'bg-green-600' : 'bg-primary hover:opacity-90'}
          `}
          disabled={saved}
        >
          {saved ? '保村済み✔︎' : '保存'}
        </button>

        {/* Toast */}
        {saved && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary/70 text-white py-2 px-4 rounded shadow-lg backdrop-blur-sm animate-fade-in z-[999]">
            保存しました！✔︎
          </div>
        )}

        {/* ログアウト */}
        <button
          onClick={void useAuthStore.getState().logout}
          className="w-full text-white py-2 rounded font-bold bg-red-500 mt-3"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default MyPage;
