import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    set({ user, loading: false });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
