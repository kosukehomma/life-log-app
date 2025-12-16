import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const navigate = useNavigate();

  // 初回だけ user を取得
  useEffect(() => {
    if (user === undefined) {
      void fetchUser();
    }
  }, [user, fetchUser]);

  // user が「確定して null」のときだけログイン画面へ
  useEffect(() => {
    if (user === null) {
      // fetchUser 実行後も user が null → 未ログイン
      void navigate('/login');
    }
  }, [user, navigate]);

  if (user === undefined) {
    return null; // ローディング中
  }

  // 未ログイン
  if (user === null) {
    return null;
  }

  return children;
};

export default AuthGuard;
