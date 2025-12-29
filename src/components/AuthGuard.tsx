import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type Props = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  // 初回だけ user を取得
  useEffect(() => {
    if (user === undefined) {
      void fetchUser();
    }
  }, [user, fetchUser]);

  // 取得中
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        認証情報を確認中...
      </div>
    );
  }

  // 未ログイン
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // ログイン済み
  return <>{children}</>;
};

export default AuthGuard;
