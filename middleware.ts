import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';
import { locales, defaultLocale, domainLocales } from './i18n';

const protectedRoutes = '/dashboard';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get locale from domain
  const hostname = request.headers.get('host') || '';
  const domain = hostname.split(':')[0];
  let locale = domainLocales[domain] || defaultLocale;
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (pathnameHasLocale) {
    const pathnameLocale = pathname.split('/')[1];
    if (locales.includes(pathnameLocale as any)) {
      locale = pathnameLocale as any;
    }
  }

  // Handle locale routing (rewrite URLs without locale prefix)
  let response: NextResponse;
  if (!pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    response = NextResponse.rewrite(newUrl);
  } else {
    response = NextResponse.next();
  }

  // Auth logic - check for protected routes
  const pathnameWithoutLocale = pathnameHasLocale 
    ? pathname.replace(/^\/[^\/]+/, '') 
    : pathname;
  const isProtectedRoute = pathnameWithoutLocale.startsWith(protectedRoutes);
  const sessionCookie = request.cookies.get('session');

  if (isProtectedRoute && !sessionCookie) {
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.search = request.nextUrl.search;
    return NextResponse.redirect(signInUrl);
  }

  // Refresh session token
  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      response.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch (error) {
      console.error('Error updating session:', error);
      response.cookies.delete('session');
      if (isProtectedRoute) {
        const signInUrl = new URL(`/${locale}/sign-in`, request.url);
        signInUrl.search = request.nextUrl.search;
        return NextResponse.redirect(signInUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|monitoring).*)',
  ],
  runtime: 'nodejs'
};
