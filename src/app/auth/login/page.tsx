'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AuthForm } from '../../../components/auth/AuthForm';
import { useEffect, useState, Suspense } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/Button';
import Loading from '@/components/Loading';

function LoginContent() {
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const registered = searchParams.get('registered');
    const message = searchParams.get('message');
    if (registered === 'true') {
      setNotification(message || 'Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  return (
    <>
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <span>{notification}</span>
          <Button
            onClick={() => setNotification(null)}
            variant="secondary"
            className="ml-2 !p-1 !text-green-700 hover:!text-green-900"
          >
            ×
          </Button>
        </div>
      )}
      <AuthForm type="login" />
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, isSessionStable } = useAuthContext();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [shouldShowContent, setShouldShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading && isSessionStable) {
      if (user) {
        setIsRedirecting(true);
        window.location.href = '/dashboard';
      } else {
        const showTimer = setTimeout(() => {
          setShouldShowContent(true);
        }, 100);
        return () => clearTimeout(showTimer);
      }
    }
  }, [user, isLoading, isSessionStable]);

  if (isLoading || !isSessionStable || isRedirecting || !shouldShowContent) {
    return (
      <Loading fullScreen={true} size="md" />
    );
  }

  if (user) {
    return null;
  }

  return (
    <Suspense fallback={
      <Loading fullScreen={true} size="md" />
    }>
      <LoginContent />
    </Suspense>
  );
}
