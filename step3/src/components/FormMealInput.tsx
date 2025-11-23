import React, { useRef } from 'react';
import type { Meal } from '../types';

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
    <div className="flex flex-col gap-2 w-[200px]">
      <div className="border rounded-md p-1 cursor-pointer relative">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <img
          src={meal.img || '/no-image.png'}
          alt="meal preview"
          className="w-full h-[150px] object-cover rounded-mg"
          onClick={() => fileRef.current?.click()}
        />

        <button
          type="button"
          onClick={handleRemove}
          className="absolute bottom-1 right-1 bg-gray-400 text-white px-2 py-1 rounded-md text-xs"
        >
          削除
        </button>
      </div>

      <input
        type="text"
        value={meal.name ?? ''}
        placeholder={`${meal.label}の料理名`}
        onChange={(e) => onChange({ ...meal, name: e.target.value })}
        className="border p-1 rounded-md text-sm"
      />
    </div>
  );
};

export default FormMealInput;
