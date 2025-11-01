import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
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

  // Create Supabase client for middleware
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Handle locale routing (rewrite URLs without locale prefix)
  if (!pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    supabaseResponse = NextResponse.rewrite(newUrl);
  }

  // Auth logic - check for protected routes
  const pathnameWithoutLocale = pathnameHasLocale 
    ? pathname.replace(/^\/[^\/]+/, '') 
    : pathname;
  const isProtectedRoute = pathnameWithoutLocale.startsWith(protectedRoutes);

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.search = request.nextUrl.search;
    return NextResponse.redirect(signInUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|monitoring).*)',
  ],
  runtime: 'nodejs'
};
