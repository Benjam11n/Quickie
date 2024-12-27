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

  const protectedRoutes = ['/profile', '/wishlists', '/collection', '/boards'];

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
    '/profile',
    '/profile/settings',
    '/wishlists/:path*',
    '/collection/:path*',
    '/boards/:path/edit',
    '/boards/new',
  ],
};
