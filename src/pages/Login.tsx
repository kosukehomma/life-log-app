import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { ALLOWED_EMAILS } from '../constants/allowedUsers';
import { GUEST_PROFILES } from '../constants/guestProfiles';

const Login = () => {
  const navigate = useNavigate();
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('メールアドレスとパスワードを入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      // ① ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ② user を store に反映
      await fetchUser();
      const user = useAuthStore.getState().user;

      // ③ 利用不可ユーザー
      if (!user || !ALLOWED_EMAILS.includes(user.email ?? '')) {
        await supabase.auth.signOut();
        toast.error('このアカウントは利用できません');
        return;
      }

      // ④ profiles を upsert（初回ログイン対策）
      const isAdmin = user.email === ALLOWED_EMAILS[0];
      const guestProfile = GUEST_PROFILES[user.email ?? ''];

      const baseProfile = isAdmin
        ? { id: user.id }
        : {
            id: user.id,
            ...(guestProfile ?? { nickname: 'ゲストユーザー' }),
          };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(baseProfile, { ignoreDuplicates: true });

      if (profileError) {
        console.error(profileError);
        toast.error('プロフィール初期化に失敗しました（後で再施行されます)');
      }

      // ⑤ 正式ログイン
      toast.success('ログインしました');
      void navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('ログインに失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={(e) => void handleLogin(e)}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg pb-6 space-y-6 animate-fadeInUp"
      >
        <div className="text-center space-y-1">
          <h1 className="mb-4 px-6 py-3 text-2xl font-bold text-white bg-primary rounded-t-2xl shadow tracking-wide">
            LIFE LOG
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            日々の体重・運動・食事を記録する
            <br />
            個人用ライフログアプリ
          </p>
        </div>

        <div className="space-y-4 px-4">
          <label className="block text-sm font-semibold">
            メールアドレス / ID
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                mt-1 w-full border rounded-md p-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/40
                transition
              "
              disabled={isSubmitting}
            />
          </label>

          <label className="block text-sm font-semibold">
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                mt-1 w-full border rounded-md p-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/40
                transition
              "
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div className="space-y-4 px-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-2 rounded-lg font-semibold text-white
              ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:opacity-90 hover:shadow-md'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ログイン中...
              </span>
            ) : (
              'ログイン'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">※ 利用は限定ユーザーのみ</p>
      </form>
    </div>
  );
};

export default Login;
