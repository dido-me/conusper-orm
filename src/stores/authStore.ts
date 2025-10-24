import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      // Obtener sesión inicial
      const { data: { session } } = await supabase.auth.getSession();
      
      set({ 
        session,
        user: session?.user ?? null,
        initialized: true
      });

      // Escuchar cambios de autenticación
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ 
          session,
          user: session?.user ?? null,
          loading: false
        });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ initialized: true });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true });
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
      }
      
      // No necesitamos manejar el loading aquí porque el auth state change lo manejará
    } catch (error) {
      console.error('Error signing in with Google:', error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      set({ 
        user: null, 
        session: null, 
        loading: false 
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ loading: false });
    }
  },
}));