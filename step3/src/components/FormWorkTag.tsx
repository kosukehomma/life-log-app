import React, { useState, useCallback, useRef } from 'react';

type FormWorkTagProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

// カテゴリ判定
const categories: Record<string, string> = {
  ランニング: 'aerobic',
  ジョギング: 'aerobic',
  縄跳び: 'aerobic',
  ロープワーク: 'aerobic',
  ウォーキング: 'aerobic',
  筋トレ: 'muscle',
  腹筋: 'muscle',
  腕立て: 'muscle',
  スクワット: 'muscle',
  ダンベル: 'muscle',
  ベンチプレス: 'muscle',
  デッドリフト: 'muscle',
  ラットプル: 'muscle',
  シャドウ: 'boxing',
  シャドー: 'boxing',
  サンドバッグ: 'boxing',
  ミット: 'boxing',
  ストレッチ: 'stretch',
};

const FormWorkTag = ({ value, onChange }: FormWorkTagProps) => {
  const [input, setInput] = useState('');
  const isComposingRef = useRef(false);

  const addTag = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput('');
  }, [input, value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const getCategory = (text: string) => {
    const lower = text.toLowerCase();
    const entries = Object.entries(categories);

    for (const [keyword, cat] of entries) {
      if (lower.includes(keyword.toLowerCase())) {
        return cat;
      }
    }
    return 'default';
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
      {value.map((tag, i) => {
        const category = getCategory(tag);
        const color =
          category === 'aerobic'
            ? 'bg-green-500'
            : category === 'muscle'
            ? 'bg-orange-500'
            : category === 'boxing'
            ? 'bg-blue-500'
            : category === 'stretch'
            ? 'bg-purple-500'
            : 'bg-gray-500';
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
