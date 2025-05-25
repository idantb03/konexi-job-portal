import { User } from '@supabase/supabase-js';

export interface AuthResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export interface IAuthService {
  signUp(email: string, password: string): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  signOut(): Promise<AuthResponse>;
  getCurrentUser(): Promise<AuthResponse<User>>;
  getUserFromToken(token: string): Promise<AuthResponse<User>>;
  resetPassword(email: string): Promise<AuthResponse>;
  updatePassword(newPassword: string): Promise<AuthResponse>;
  onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void): { data: { subscription: { unsubscribe: () => void } } };
}
