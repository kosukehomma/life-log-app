import type { Log } from '../types';
import LogItem from './LogItem';

type Props = {
  logs: Log[];
  onUpdate: (id: number, updated: Partial<Log>) => void;
  onDelete: (id: number) => void;
};

const LogList = ({ logs, onUpdate, onDelete }: Props) => {
  if (logs.length === 0) {
    return <p className="text-center text-gray-500 italic">記録がありません。</p>;
  }

  return (
    <ul className="space-y-5">
      {logs.map((log) => (
        <LogItem key={log.id} log={log} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default LogList;
