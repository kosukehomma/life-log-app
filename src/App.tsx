import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLogs } from './store/useLogs';
import Layout from './components/Layout';

import Home from './pages/Home';
import Month from './pages/Month';
import AddLog from './pages/AddLog';
import EditLog from './pages/EditLog';
import MyPage from './pages/MyPage';
import Login from './pages/Login';

import AuthGuard from './components/AuthGuard';

const App = () => {
  useEffect(() => {
    void useLogs.getState().loadLogs();
  }, []);

  return (
    <Layout>
      <Routes>
        {/* ログインページはガードなし */}
        <Route path="/login" element={<Login />} />

        {/* 以下、AuthGuard を適用 */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/month/:year/:month"
          element={
            <AuthGuard>
              <Month />
            </AuthGuard>
          }
        />
        <Route
          path="/add"
          element={
            <AuthGuard>
              <AddLog />
            </AuthGuard>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <AuthGuard>
              <EditLog />
            </AuthGuard>
          }
        />
        <Route
          path="/mypage"
          element={
            <AuthGuard>
              <MyPage />
            </AuthGuard>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
