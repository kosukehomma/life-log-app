import React, { useRef } from 'react';
import type { Meal } from '../types';
import { Trash2, ImagePlus } from 'lucide-react';

type Props = {
  meal: Meal;
  onChange: (updated: Meal) => void;
};

const FormMealInput = ({ meal, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...meal, img: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange({ ...meal, img: '' });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="w-[220px] p-4 border rounded-xl shadow-sm bg-white flex flex-col gap-3 relative">
      {/* Header */}
      <h4 className="text-base font-semibold text-gray-700">{meal.label}</h4>

      {/* Image Preview */}
      <div
        className="w-full h-[140px] overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer relative"
        onClick={() => fileRef.current?.click()}
      >
        {meal.img ? (
          <img src={meal.img} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <ImagePlus size={28} />
            <span className="text-xs mt-1">画像を追加</span>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {meal.img && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-3 right-3 bg-white rounded-full shadow p-1 hover:bg-red-50"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Input */}
      <input
        type="text"
        value={meal.name ?? ''}
        placeholder={`${meal.label}の料理名`}
        onChange={(e) => onChange({ ...meal, name: e.target.value })}
        className="border p-2 rounded-md text-sm"
      />
    </div>
  );
};

export default FormMealInput;
