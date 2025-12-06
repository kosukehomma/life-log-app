import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLogs } from './store/useLogs';
import Layout from './components/Layout';

import Home from './pages/Home';
import Month from './pages/Month';
import AddLog from './pages/AddLog';
import EditLog from './pages/Edit';
import MyPage from './pages/MyPage';

const App = () => {
  // const logs = useLogs((state) => state.logs);
  // console.log('🔥 LOG DATA:', logs);

  useEffect(() => {
    useLogs.getState().loadFromStorage();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/month/:year/:month" element={<Month />} />
        <Route path="/add" element={<AddLog />} />
        <Route path="/edit/:logId" element={<EditLog />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
