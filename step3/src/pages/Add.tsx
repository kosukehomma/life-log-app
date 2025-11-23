import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogs } from '../store/useLogs';
import type { Meal } from '../types';
import FormWorkTag from '../components/FormWorkTag';
import FormMealInput from '../components/FormMealInput';

const Add = () => {
  const navigate = useNavigate();
  const addLog = useLogs((state) => state.addLog);

  const [date, setDate] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [workTags, setWorkTags] = useState<string[]>([]);
  const [meals, setMeals] = useState<Meal[]>([
    { img: '', label: '朝食', name: '' },
    { img: '', label: '昼食', name: '' },
    { img: '', label: '夕食', name: '' },
  ]);
  const [comment, setComment] = useState('');

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  }, []);

  const memoSetWorkTags = useCallback((tags: string[]) => {
    setWorkTags(tags);
  }, []);

  const updateMeal = useCallback((index: number, updated: Meal) => {
    setMeals((prev) => prev.map((m, i) => (i === index ? updated : m)));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newLog = {
      id: Date.now(),
      date,
      weight: Number(weight),
      work: workTags.join(', '), // 文字列に変換して保存
      comment,
      meals,
    };

    addLog(newLog);
    navigate('/');
  };

  return (
    <div className="max-w-[720px] p-10">
      <h2 className="text-3xl font-bold mb-10">新規ログを追加</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 日付と体重*/}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">基本情報</h3>

          <div className="flex gap-6">
            <label className="flex flex-col flex-1 font-bold">
              日付
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded-md"
                required
              />
            </label>

            <label className="flex flex-col flex-1 font-bold">
              体重（kg）
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="border p-2 rounded-md"
                required
              />
            </label>
          </div>
        </section>

        {/* 運動 */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">運動</h3>
          <FormWorkTag value={workTags} onChange={memoSetWorkTags} />
        </section>

        {/* 食事 */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">食事</h3>
          <div className="flex gap-4 mt-2">
            {meals.map((meal, i) => (
              <FormMealInput key={i} meal={meal} onChange={(updated) => updateMeal(i, updated)} />
            ))}
          </div>
        </section>

        {/* コメント */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-l-4 border-primary pl-2">コメント</h3>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            maxLength={128}
            className="border p-3 rounded-md resize-none w-full h-[120px]"
            placeholder="コメントを入力（最大128文字）"
          />
          <div className="text-right text-sm mt-1">
            <span className={`${comment.length >= 128 ? 'text-red-600' : 'text-gray-600'}`}>
              {comment.length} / 128
            </span>
          </div>
        </section>

        {/* ボタン */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="py-2 px-8 bg-primary text-white font-bold rounded-md shadow-md hover:opacity-80 transition"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
