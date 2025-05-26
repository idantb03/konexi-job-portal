import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '../../providers/AuthProvider';
import { Input } from '../Input';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const { signIn, signUp, isLoading, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Clear error states when form type changes
  useEffect(() => {
    setFormError(null);
    setIsExistingUser(false);
  }, [type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsExistingUser(false);

    if (type === 'signup' && password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      if (type === 'login') {
        await signIn(email, password);
        router.push('/dashboard');
      } else {
        await signUp(email, password);
        router.push('/auth/login?registered=true&message=Please check your email to verify your account');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setFormError(errorMessage);
      
      // Check if the error is about an existing user
      if (errorMessage.toLowerCase().includes('user with this email already exists') || 
          errorMessage.toLowerCase().includes('already registered')) {
        setIsExistingUser(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {type === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {type === 'login' ? (
              <>
                Or{' '}
                <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  create a new account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete={type === 'login' ? 'current-password' : 'new-password'}
              required
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                type === 'signup' ? '' : 'rounded-b-md'
              } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {type === 'signup' && (
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
          </div>

          {(formError || error) && (
            <div className={`rounded-md ${isExistingUser ? 'bg-yellow-50' : 'bg-red-50'} p-4`}>
              <div className="flex">
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${isExistingUser ? 'text-yellow-800' : 'text-red-800'}`}>
                    {isExistingUser ? 'Account exists' : 'Error'}
                  </h3>
                  <div className={`mt-2 text-sm ${isExistingUser ? 'text-yellow-700' : 'text-red-700'}`}>
                    <p>{formError || error}</p>
                    {isExistingUser && (
                      <p className="mt-2">
                        <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Click here to sign in
                        </Link> instead.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {type === 'login' ? 'Sign in' : 'Sign up'}
            </button>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Return to Home
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
