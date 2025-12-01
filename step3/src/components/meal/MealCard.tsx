import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Meal } from '../../types';

type Props = {
  meal: Meal;
};

export const MealCard = ({ meal }: Props) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/meal/edit/${meal.id}`);
  };

  return (
    <div className="min-w-[240px] max-w-[240px] bg-white rounded-xl shadow p-2 flex flex-col gap-2 relative">
      <div className="w-ful h-[140px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-500">画像なし</span>
        )}
      </div>

      <p className="text-sm text-gray-700 break-words min-h-[36px]">{meal.memo}</p>

      {/* 編集ボタン（仮） */}
      <button
        onClick={handleEdit}
        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow"
      >
        <Pencil size={16} />
      </button>
    </div>
  );
};
