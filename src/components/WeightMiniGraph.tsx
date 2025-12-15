import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLogs } from '../store/useLogs';
import { useNavigate } from 'react-router-dom';
import type { Log } from '../types';

type Props = {
  targetLogs?: Log[];
};

const WeightMiniGraph = ({ targetLogs }: Props) => {
  const navigate = useNavigate();
  const allLogs = useLogs((state) => state.logs);

  // データは Home/Monthで与えられたもの優先
  const logs = targetLogs ?? [...allLogs].sort((a, b) => (a.date > b.date ? 1 : -1));

  // 直近7件
  const slicedLogs = targetLogs ? logs : logs.slice(-7); // Homeは最大7件

  const data = slicedLogs.map((l: Log) => ({
    date: l.date,
    displayDate: l.date.slice(5), // MM-DD
    weight: l.weight,
    body_fat: l.body_fat,
  }));

  const tickInterval =
    data.length <= 7
      ? 0 // 全表示
      : data.length <= 14
      ? 1 // 半分
      : 2; // 1/3

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickPoint = (payload: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!payload?.activePayload?.length) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const clicked = payload.activePayload[0].payload;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    void navigate(`/month/${clicked.date.slice(0, 4)}/${clicked.date.slice(5, 7)}`);
    // 月画面に遷移後、該当カード位置にスクロールは後で追加
  };

  return (
    <div className="w-full h-48 px-4 pt-2 pb-8 bg-secondary/10 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-2 text-center">体重推移（直近7件）</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onClick={handleClickPoint} // データ点クリックで遷移
        >
          <XAxis dataKey="displayDate" interval={tickInterval} tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) =>
              name === 'weight' ? [`${value}kg`, '体重'] : [`${value}%`, '体脂肪率']
            }
            labelFormatter={(label: string) => `${label}`}
          />

          {/* 体重 → PrimaryColorで濃い線 */}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#5A89C8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* 体脂肪率 → グレー寄り青で線細、少し薄く */}
          <Line
            type="monotone"
            dataKey="fat"
            stroke="#8FA8C0"
            strokeWidth={2}
            dot={{ r: 3, fill: '#fff' }}
            strokeOpacity={0.7}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightMiniGraph;
