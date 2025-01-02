import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { ROUTES } from './constants/routes';

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  const isAuthenticated = !!token;
  const pathname = req.nextUrl.pathname;

  // Admin pages - redirect if not admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Auth pages - redirect to home if already logged in
  const authRoutes = ['/sign-in', '/sign-up'];
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = [
    '/profile',
    '/wishlists',
    '/collection',
    '/boards',
    '/admin',
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const url = new URL(ROUTES.SIGN_IN, req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/profile',
    '/profile/settings',
    '/wishlists/:path*',
    '/collection/:path*',
    '/boards/:path/edit',
    '/boards/new',
    '/admin/:path*',
    '/waitlist/:path*',
  ],
};
