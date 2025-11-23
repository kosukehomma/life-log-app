import React, { useState } from 'react';

type FormWorkTagProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

const FormWorkTag = ({ value, onChange }: FormWorkTagProps) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      onChange([...value, input.trim()]);
      setInput('');
    }

    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, value.length - 1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        className="border p-2 rounded-md w-full"
        placeholder="運動を入力してEnter（例：シャドー3R）"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default FormWorkTag;
