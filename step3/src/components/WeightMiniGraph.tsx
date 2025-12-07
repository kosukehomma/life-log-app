import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLogs } from '../store/useLogs';

type Props = {
  targetLogs?: ReturnType<typeof useLogs>['logs'];
};

const WeightMiniGraph = ({ targetLogs }: Props) => {
  const allLogs = useLogs((state) => state.logs);

  // データは Home/Monthで与えられたもの優先
  const logs = targetLogs ?? [...allLogs].sort((a, b) => (a.date > b.date ? 1 : -1));

  // 直近7件
  const slicedLogs = logs.slice(-7);

  const data = slicedLogs.map((l) => ({
    date: l.date.slice(5), // MM-DD 表記
    weight: l.weight,
    fat: l.fat,
  }));

  return (
    <div className="w-full h-48 px-4 pt-2 pb-8 bg-secondary/10 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-2 text-center">体重推移（直近7件）</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip
            formatter={(value: any, name: any) =>
              name === 'weight' ? [`${value}kg`, '体重'] : [`${value}%`, '体脂肪率']
            }
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
