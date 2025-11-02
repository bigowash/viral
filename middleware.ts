import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';
import { locales, defaultLocale } from './i18n';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env';

const protectedRoutes = '/dashboard';

// Create next-intl middleware for locale routing
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Let next-intl handle locale routing first
  const response = intlMiddleware(request);
  
  // Use the response from next-intl (or create a new one if needed)
  const finalResponse = response || NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Extract locale from pathname (next-intl ensures it's present with localePrefix: 'always')
  // If redirect happened, check the Location header; otherwise parse from pathname
  let locale = defaultLocale;
  const pathname = request.nextUrl.pathname;
  const pathnameSegments = pathname.split('/').filter(Boolean);
  
  // Check if pathname has a locale (next-intl with localePrefix: 'always' ensures it does)
  if (pathnameSegments.length > 0 && locales.includes(pathnameSegments[0] as any)) {
    locale = pathnameSegments[0] as any;
  } else if (response?.headers.get('location')) {
    // If next-intl redirected, extract locale from redirect location
    const location = response.headers.get('location') || '';
    const locationSegments = new URL(location, request.url).pathname.split('/').filter(Boolean);
    if (locationSegments.length > 0 && locales.includes(locationSegments[0] as any)) {
      locale = locationSegments[0] as any;
    }
  }

  // Create Supabase client - use finalResponse for cookie handling
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Only set cookies on the response, not on request (which is a no-op in newer Next versions)
          cookiesToSet.forEach(({ name, value, options }) =>
            finalResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Auth logic - check for protected routes
  // Pathname already has locale prefix, so check from second segment
  const pathnameWithoutLocale = pathnameSegments.length > 1
    ? '/' + pathnameSegments.slice(1).join('/')
    : '/';
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

  return finalResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|monitoring).*)',
  ],
  runtime: 'nodejs'
};
