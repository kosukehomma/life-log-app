import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = {
  user: User | null | undefined;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,

  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();
    set({ user: data.user ?? null });
    console.log(data.user?.id);
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
