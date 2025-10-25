import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@app/supabase/client';
import toast from 'react-hot-toast';

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
      supabase.auth.onAuthStateChange(async (event, session) => {

        
        set({ 
          session,
          user: session?.user ?? null,
          loading: false
        });

        // Manejar errores específicos de autenticación
        if (event === 'SIGNED_IN' && !session) {
          // Esto puede ocurrir cuando el trigger de la DB bloquea la creación del usuario
          toast.error('Email no autorizado. Póngase en contacto con el administrador.');
        }
        
        // Manejar eventos de error específicos
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Posible error en la validación del usuario
          toast.error('Sesión expirada o usuario no autorizado.');
        }
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
          redirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        
        // Verificar si es un error específico del trigger de allowed_emails
        if (error.message && error.message.includes('Email no autorizado')) {
          toast.error('Email no autorizado. Póngase en contacto con el administrador.');
        } else {
          toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
        }
        set({ loading: false });
      }
      
      // No necesitamos manejar el loading aquí porque el auth state change lo manejará
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      
      // Verificar si es un error específico del trigger de allowed_emails
      if (error instanceof Error && error.message && error.message.includes('Email no autorizado')) {
        toast.error('Email no autorizado. Póngase en contacto con el administrador.');
      } else {
        toast.error('Error inesperado. Por favor, inténtalo de nuevo.');
      }
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