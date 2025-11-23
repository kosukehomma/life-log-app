import type { Log } from '../types';
import CardItem from './CardItem';

type Props = {
  logs: Log[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const CardList = ({ logs, onEdit, onDelete }: Props) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">まだ記録がありません</p>
      </div>
    );
  }

  return (
    <ul
      className="
        card-list
        flex flex-wrap
        gap-4
        justify-start
        w-full
      "
    >
      {logs.map((log) => (
        <CardItem key={log.id} log={log} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default CardList;
