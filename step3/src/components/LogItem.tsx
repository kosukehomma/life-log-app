import { useState } from 'react';
import type { Log } from '../types';

type Props = {
  log: Log;
  onUpdate: (id: number, updated: Partial<Log>) => void;
  onDelete: (id: number) => void;
};

const LogItem = ({ log, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(log);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(log.id, editData);
    setIsEditing(false);
  };

  return (
    <li className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
      {isEditing ? (
        <div className="space-y-3">
          <input
            name="weight"
            value={editData.weight}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <textarea
            name="comment"
            value={editData.comment}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              保存
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-gray-700">{log.date}</p>
            <p className="text-blue-600 font-medium">{log.weight} kg</p>
          </div>
          <p className="text-sm text-gray-600">{log.work}</p>
          <p className="text-sm text-gray-600">朝: {log.breakfast}</p>
          <p className="text-sm text-gray-600">昼: {log.lunch}</p>
          <p className="text-sm text-gray-600">夜: {log.dinner}</p>
          {log.comment && (
            <p className="mt-2 text-gray-500 text-sm italic border-t pt-2">{log.comment}</p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(log.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default LogItem;
