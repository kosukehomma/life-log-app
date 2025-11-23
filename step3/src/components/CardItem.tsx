import type { Log } from '../types';
import MealCarousel from './MealCarousel';
import FormWorkTag from './FormWorkTag';

type Props = {
  log: Log;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const CardItem = ({ log, onEdit, onDelete }: Props) => {
  const isEmptyComment =
    !log.comment || log.comment.trim() === '' || log.comment === 'コメント未入力';

  return (
    <li
      className="
      card-list__item
      max-w-[calc(25% - 12px)]
      min-w-[193px]
      border-2 border-primary
      rounded-[20px]
      p-[14px_8px]
      bg-[#f4f7fa]
      flex flex-col
      relative
      min-h-[482px]
      h-full
    "
    >
      {/* 日付 */}
      <p className="font-bold text-[16px] mb-[10px]">{log.date}</p>

      {/* 体重 */}
      <span className="font-bold text-[28px] absolute top-[12px] right-[16px]">{log.weight}kg</span>

      {/* 運動内容 */}
      <p className="font-bold text-[12px] mb-[2px]">運動内容：</p>
      <div className="text-[12px] leading-[1.2] min-h-[100px] mb-[8px]">
        <FormWorkTag />
      </div>

      {/* 食事 */}
      <p className="font-bold text-[12px] mb-[2px]">食事：</p>
      <div className="w-full my-[2px]">
        <MealCarousel meals={log.meals} />
      </div>

      {/* コメント */}
      <div
        className={`item-comment text-[12px] leading-[1.3] mt-[8px] pb-[6px] ${
          isEmptyComment ? 'text-gray-500 italic' : 'text-gray-800'
        }`}
      >
        {isEmptyComment ? 'コメント未入力' : log.comment}
      </div>

      {/* 編集・削除ボタン */}
      <div
        className="
        card-actions
        flex justify-end gap-[10px]
        mt-auto pt-[6px]
        border-t border-[rgba(0,0,0,0.1)]
      "
      >
        <button
          className="bg-blue-600 text-white text-[13px] font-medium p-[4px_8px] rounded-[8px] hover:underline"
          onClick={() => onEdit(log.id)}
        >
          編集
        </button>
        <button
          className="bg-red-600 text-white text-[13px] font-medium p-[4px_8px] rounded-[8px] hover:underline"
          onClick={() => onDelete(log.id)}
        >
          削除
        </button>
      </div>
    </li>
  );
};

export default CardItem;
