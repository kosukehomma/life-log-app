import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogs } from '../store/useLogs';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logs = useLogs((state) => state.logs);

  // ----- 年→月 の構造を生成する
  const archive = useMemo(() => {
    const grouped: Record<string, Set<string>> = {};

    logs.forEach((log) => {
      const [y, m] = log.date.split('/');
      if (!grouped[y]) {
        grouped[y] = new Set();
      }
      grouped[y].add(m);
    });

    // monthを降順にソート
    const sorted: Record<string, string[]> = {};
    Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .forEach((year) => {
        sorted[year] = Array.from(grouped[year]).sort((a, b) => Number(b) - Number(a));
      });

    return sorted;
  }, [logs]);

  // ---- 開閉状態の年リスト ----
  const [openYears, setOpenYears] = useState<string[]>([]);

  const toggleYear = (year: string) => {
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  // 現在のURLから active年月を判定
  const currentPath = location.pathname;
  const activeMatch = currentPath.match(/\/month\/(\d+)\/(\d+)/);
  const activeYear = activeMatch ? activeMatch[1] : null;
  const activeMonth = activeMatch ? activeMatch[2] : null;

  return (
    <aside
      className="
        fixed top-0 left-0
        h-screen
        max-w-56 w-full
        bg-primary text-white
        px-6
        overflow-y-auto
        pt-12 z-20
      "
    >
      <h1 className="font-bold text-4xl mb-8">
        <button onClick={() => navigate('/')} className="no-underline text-white hover:underline">
          LIFE LOG
        </button>
      </h1>

      {/* 年のリスト */}
      <ul className="log-list__year text-xl font-bold">
        {Object.keys(archive).map((year) => {
          const isOpen = openYears.includes(year);

          return (
            <li key={year} className="mt-3 first:mt-0">
              {/* 年 */}
              <button onClick={() => toggleYear(year)} className="w-full text-left hover:underline">
                {year}年
              </button>

              {/* 月のリスト */}
              <ul
                className={`
                  log-list__month ml-4 mt-2 overflow-hidden transition-all duration-300
                  ${isOpen ? 'max-h-[500px]' : 'max-h-0'}
                `}
              >
                {archive[year].map((month) => {
                  const isActive = activeYear === year && activeMonth === month;

                  return (
                    <li key={month} className="mt-2">
                      <button
                        onClick={() => navigate(`/month/${year}/${month}`)}
                        className={`
                          block text-white/80 hover:text-white transition
                          ${isActive ? 'font-bold text-[18px] text-[#55ebbb] underline' : ''}
                        `}
                      >
                        {Number(month)}月
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
