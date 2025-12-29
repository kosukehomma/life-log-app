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
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      set({ user: null });
      return;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error(error);
      set({ user: null });
      return;
    }

    set({ user: data.user });
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    set({ user: null });
  },
}));
