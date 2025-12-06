import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogs } from '../store/useLogs';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logs = useLogs((state) => state.logs);

  // 現在の年月を取得
  const now = new Date();
  const currentYear = now.getFullYear();
  const limitYears = 5;

  // ----- 年月データ生成
  const archive = useMemo(() => {
    const grouped: Record<string, Set<string>> = {};

    logs.forEach((log) => {
      let y = '';
      let m = '';

      if (log.date.includes('/')) {
        [y, m] = log.date.split('/');
      } else if (log.date.includes('-')) {
        const [year, month] = log.date.split('-');
        y = year;
        m = month;
      }

      if (!y || !m) return;

      if (!grouped[y]) {
        grouped[y] = new Set();
      }
      grouped[y].add(m.padStart(2, '0'));
    });

    // 表示対象の年だけフィルタ
    return Object.keys(grouped)
      .filter((y) => currentYear - Number(y) < limitYears)
      .sort((a, b) => Number(b) - Number(a))
      .reduce((sorted, year) => {
        sorted[year] = Array.from(grouped[year]).sort((a, b) => Number(b) - Number(a));
        return sorted;
      }, {} as Record<string, string[]>);
  }, [logs, currentYear]);

  // ---- 開閉状態の年リスト ----
  const [openYears, setOpenYears] = useState<string[]>([]);
  const toggleYear = (year: string) => {
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  // SP Drawer 開閉
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((p) => !p);

  // 現在のURLから active年月を判定
  const activeMatch = location.pathname.match(/\/month\/(\d+)\/(\d+)/);
  const activeYear = activeMatch ? activeMatch[1] : null;
  const activeMonth = activeMatch ? activeMatch[2] : null;

  return (
    <>
      {/* ---- サイドバー ---- */}
      <aside
        className="
          hidden md:block
          fixed top-0 left-0
          h-screen
          w-50
          bg-primary text-white
          px-6 overflow-y-auto
          pt-12 z-20
          border-r border-white/10
       "
      >
        {/* Home */}
        <h1 className="font-bold text-4xl mb-6 text-center">
          <button onClick={() => navigate('/')} className="no-underline text-white hover:underline">
            LIFE LOG
          </button>
        </h1>

        {/* My Page */}
        <button
          onClick={() => navigate('/mypage')}
          className="block text-xl font-bold mb-6 ml-auto hover:underline"
        >
          My Page
        </button>

        {/* 年のリスト */}
        <ul className="log-list__year text-2xl font-bold">
          {Object.keys(archive).map((year) => {
            const isOpen = openYears.includes(year);

            return (
              <li key={year} className="mt-3 first:mt-0">
                {/* 年 */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full text-right pr-5 hover:underline"
                >
                  {year}年
                </button>

                {/* 月のリスト */}
                {isOpen && (
                  <ul className="log-list__month ml-4 mt-2 space-y-2 transition-all duration-300">
                    {archive[year].map((month) => {
                      const isActive = activeYear === year && activeMonth === month;
                      return (
                        <li key={month} className="mt-2">
                          <button
                            onClick={() => navigate(`/month/${year}/${month}`)}
                            className={`
                              block text-white/80 hover:text-white transition ml-auto
                              ${
                                isActive
                                  ? 'font-bold text-[#55ebbb] underline underline-offset-2'
                                  : ''
                              }
                            `}
                          >
                            {Number(month)}月
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* SP Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-primary text-white flex items-center justify-between px-4 z-30 shadow pt-[env(safe-area-inset-top)]">
        <button onClick={() => navigate('/')} className="font-bold">
          LIFE LOG
        </button>
        <button onClick={toggleMenu} className="text-3xl">
          {menuOpen ? '×' : '☰'}
        </button>
      </header>

      {/* SP Dropdown (ハンバーガー押下時) */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 right-0 bg-primary/90 text-white z-30 p-3 text-right max-w-[150px] w-full origin-top animate-slide-down">
          {/* My Page */}
          <button
            onClick={() => {
              navigate('/mypage');
              setMenuOpen(false);
            }}
            className="block text-lg font-semibold mb-4 ml-auto hover:underline"
          >
            My Page
          </button>

          {/* 年月リスト（SPドロップダウン） */}
          {Object.keys(archive).map((year) => {
            const isOpen = openYears.includes(year);

            return (
              <div key={year} className="mb-2">
                <button
                  onClick={() => toggleYear(year)}
                  className="flex items-center w-full justify-end font-semibold border-t pt-2"
                >
                  {year}年 ▼
                </button>

                {isOpen && (
                  <ul className="mt-2 space-y-2">
                    {archive[year].map((month) => {
                      const isActive = activeYear === year && activeMonth === month;
                      return (
                        <li key={month} className="border-t pt-2 border-dotted">
                          <button
                            onClick={() => {
                              navigate(`/month/${year}/${month}`);
                              setMenuOpen(false);
                            }}
                            className={`block text-white/80 ml-auto hover:text-white
                              ${isActive ? 'text-[#55ebbb] font-bold underline' : ''}
                            `}
                          >
                            {Number(month)}月
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Sidebar;
