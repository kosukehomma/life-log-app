import { useState } from 'react';
import type { Log } from '../types';

type Props = {
  onAdd: (log: Omit<Log, 'id'>) => void;
};

const LogForm = ({ onAdd }: Props) => {
  const [form, setForm] = useState<Omit<Log, 'id'>>({
    date: '',
    weight: '',
    work: '',
    comment: '',
    breakfast: '',
    lunch: '',
    dinner: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.weight) return alert('日付と体重は必須です');
    onAdd(form);
    setForm({
      date: '',
      weight: '',
      work: '',
      comment: '',
      breakfast: '',
      lunch: '',
      dinner: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">新しい記録を追加</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">日付</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">体重（kg）</label>
          <input
            name="weight"
            placeholder="例：72.5"
            value={form.weight}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">運動内容</label>
          <input
            name="work"
            placeholder="例：ウォーキング 45分"
            value={form.work}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">朝食</label>
          <input
            name="breakfast"
            placeholder="例：オートミール"
            value={form.breakfast}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">昼食</label>
          <input
            name="lunch"
            placeholder="例：鶏胸肉＋野菜スープ"
            value={form.lunch}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">夕食</label>
          <input
            name="dinner"
            placeholder="例：サラダチキン＋味噌汁"
            value={form.dinner}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">コメント</label>
        <textarea
          name="comment"
          placeholder="今日の気分やメモなど"
          value={form.comment}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full h-20 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        追加
      </button>
    </form>
  );
};

export default LogForm;
