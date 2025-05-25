import { NextResponse } from 'next/server';
import { SignUpUseCase } from '../../../use-case/auth/SignUp';
import { SignInUseCase } from '../../../use-case/auth/SignIn';
import { AuthService } from '../../../infrastructure/supabase/auth/AuthService';

const authService = new AuthService();
const signUpUseCase = new SignUpUseCase(authService);
const signInUseCase = new SignInUseCase(authService);

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'signUp':
        try {
          const user = await signUpUseCase.execute(email, password);
          return NextResponse.json({ user });
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }

      case 'signIn':
        try {
          const user = await signInUseCase.execute(email, password);
          return NextResponse.json({ user });
        } catch (error: any) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await authService.signOut();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sign out' },
      { status: 500 }
    );
  }
}
