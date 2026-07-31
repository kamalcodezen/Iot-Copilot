import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings', '/projects', '/notifications', '/ai-debugger', '/learning-path', '/community', '/admin'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('better-auth.session_token')?.value || 
                        request.cookies.get('__Secure-better-auth.session_token')?.value;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  
  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/projects/:path*', '/notifications/:path*', '/ai-debugger/:path*', '/learning-path/:path*', '/community/:path*', '/admin/:path*', '/auth/login', '/auth/register'],
};
