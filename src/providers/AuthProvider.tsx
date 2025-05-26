'use client'
import { ReactNode, createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../infrastructure/supabase/client';
import { AuthContextType, AuthState } from '../features/auth/types';
import { useAuth } from '../features/auth/useAuth';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  isSessionStable: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut } = useAuth();
  const isStabilizing = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setState(prev => ({ ...prev, user, isLoading: false }));
      } catch (error: any) {
        setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setState(prev => ({
        ...prev,
        user: session?.user || null,
        isLoading: false,
        isSessionStable: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!state.isLoading && !isStabilizing.current) {
      isStabilizing.current = true;
      
      const stabilizeTimer = setTimeout(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const sessionUser = session?.user || null;
          
          setState(prev => ({ 
            ...prev, 
            user: sessionUser || prev.user,
            isSessionStable: true 
          }));
        } catch (error) {
          setState(prev => ({ ...prev, isSessionStable: true }));
        } finally {
          isStabilizing.current = false;
        }
      }, 300);
      
      return () => {
        clearTimeout(stabilizeTimer);
        isStabilizing.current = false;
      };
    }
  }, [state.isLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, isSessionStable: false }));
      const userData = await authSignIn({ email, password });
      setState(prev => ({ 
        ...prev, 
        user: userData?.user?.user || null,
        isLoading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, isSessionStable: false }));
      await authSignUp({ email, password, confirmPassword: password });
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, isSessionStable: false }));
      await authSignOut();
      setState({
        user: null,
        isLoading: false,
        error: null,
        isSessionStable: false
      });
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      throw error;
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 