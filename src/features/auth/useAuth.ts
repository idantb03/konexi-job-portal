import { useState } from 'react';
import { SignInFormData, SignUpFormData } from './types';
import { supabase } from '@/infrastructure/supabase/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          action: 'signIn',
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign in');
      }

      // Set the session in Supabase client
      if (result.user?.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.user.session.access_token,
          refresh_token: result.user.session.refresh_token,
        });

        if (sessionError) {
          throw new Error('Failed to set session');
        }
      }
      
      return result.user;
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          action: 'signUp',
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Check if this is an existing user error
        if (result.error && (
          result.error.includes('User with this email already exists') ||
          result.error.includes('already registered')
        )) {
          throw new Error('User with this email already exists');
        }
        throw new Error(result.error || 'Failed to sign up');
      }
      
      return result.user;
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First clear the Supabase session
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;

      // Then call our API endpoint to clear any server-side session
      const response = await fetch('/api/auth', {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign out');
      }

      // Clear any local storage items if needed
      localStorage.removeItem('supabase.auth.token');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
  };
};
