import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useLogs } from './store/useLogs';

import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';

import Home from './pages/Home';
import Month from './pages/Month';
import AddLog from './pages/AddLog';
import EditLog from './pages/EditLog';
import MyPage from './pages/MyPage';
import Login from './pages/Login';

const App = () => {
  useEffect(() => {
    void useLogs.getState().loadLogs();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* ログイン（Layoutなし） */}
        <Route path="/login" element={<Login />} />

        {/* 認証必須 + Layoutあり */}
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/month/:year/:month" element={<Month />} />
          <Route path="/add" element={<AddLog />} />
          <Route path="/edit/:id" element={<EditLog />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
