import React, { useState, useCallback, useRef } from 'react';
import { getWorkoutCategory } from '../utils/workoutCategory';

type FormWorkTagProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

const FormWorkTag = ({ value, onChange }: FormWorkTagProps) => {
  const [input, setInput] = useState('');
  const isComposingRef = useRef(false);

  // 追加
  const addTag = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput('');
  }, [input, value, onChange]);

  // Enterでタグ追加
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // 削除
  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // カテゴリごとのバッジ色（共通定義に統一）
  const getColorByCategory = (tag: string) => {
    const cat = getWorkoutCategory(tag);

    return cat === 'aerobic'
      ? 'bg-green-500'
      : cat === 'muscle'
      ? 'bg-orange-500'
      : cat === 'boxing'
      ? 'bg-blue-400'
      : cat === 'stretch'
      ? 'bg-purple-400'
      : 'bg-gray-500';
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
      {value.map((tag, i) => {
        const color = getColorByCategory(tag);

        return (
          <span
            key={`${tag}-${i}`}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${color} text-white`}
          >
            {tag}
            <button onClick={() => removeTag(i)} className="text-white">
              ×
            </button>
          </span>
        );
      })}

      <input
        type="text"
        value={input}
        onCompositionStart={() => (isComposingRef.current = true)}
        onCompositionEnd={() => (isComposingRef.current = false)}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] border-none outline-none p-1"
        placeholder="入力してEnterで追加（例：スクワット30回）"
      />
    </div>
  );
};

export default FormWorkTag;
