import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is under /admin
  if (pathname.startsWith('/admin')) {
    // Get auth token from cookies
    const authToken = request.cookies.get('admin_auth')?.value;
    
    // If not authenticated and not on login page, redirect to login
    if (!authToken && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // If authenticated and trying to access login page, redirect to dashboard
    if (authToken && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
