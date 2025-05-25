'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm } from '../../../components/auth/AuthForm';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuthContext();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setNotification('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <>
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-green-700 hover:text-green-900"
          >
            ×
          </button>
        </div>
      )}
      <AuthForm type="login" />
    </>
  );
}
