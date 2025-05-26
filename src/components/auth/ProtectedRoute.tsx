'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../../providers/AuthProvider';
import Loading from '../Loading';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isSessionStable } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && isSessionStable) {
      if (!user && pathname !== '/auth/login') {
        router.push('/auth/login');
      }
    }
  }, [user, isLoading, router, isSessionStable, pathname]);

  if (isLoading || !isSessionStable) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 