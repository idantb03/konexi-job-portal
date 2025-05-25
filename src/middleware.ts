import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from './infrastructure/supabase/auth/AuthService';

const authService = new AuthService();

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/api/auth') ||
      request.nextUrl.pathname.startsWith('/api/jobs/public')) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); 
  
  try {
    const { data: user, error } = await authService.getUserFromToken(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/:path*'],
}; 