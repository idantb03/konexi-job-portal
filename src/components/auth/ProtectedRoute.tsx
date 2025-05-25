'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../../providers/AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isSessionStable } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading && isSessionStable) {
      if (!user && pathname !== '/auth/login') {
        const redirectTimer = setTimeout(() => {
          router.push('/auth/login');
        }, 100);
        return () => clearTimeout(redirectTimer);
      } else if (user) {
        const showTimer = setTimeout(() => {
          setShouldRender(true);
        }, 100);
        return () => clearTimeout(showTimer);
      }
    }
  }, [user, isLoading, router, isSessionStable, pathname]);

  if (isLoading || !isSessionStable || !shouldRender) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 