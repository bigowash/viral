'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHogClient } from './posthog';
import { PostHogEvents } from './events';
import { locales } from '@/i18n';

/**
 * Tracks page views with route and locale information.
 * This complements PostHog's automatic pageview tracking with additional metadata.
 */
function PageViewTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHogClient();

  // Extract locale from pathname (e.g., /en/dashboard -> 'en')
  const locale = (() => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    const firstSegment = segments[0];
    return locales.includes(firstSegment as any) ? firstSegment : 'en';
  })();

  // Derive search string to stabilize dependency
  const search = searchParams.toString();

  useEffect(() => {
    if (!posthog) return;

    const route = pathname || '/';

    // Extract page type from route
    let pageType = 'unknown';
    if (route.includes('/dashboard')) {
      pageType = 'dashboard';
      if (route.includes('/security')) {
        pageType = 'dashboard_security';
      } else if (route.includes('/activity')) {
        pageType = 'dashboard_activity';
      } else if (route.includes('/general')) {
        pageType = 'dashboard_general';
      }
    } else if (route.includes('/pricing')) {
      pageType = 'pricing';
    } else if (route.includes('/sign-in')) {
      pageType = 'sign_in';
    } else if (route.includes('/sign-up')) {
      pageType = 'sign_up';
    } else if (route === `/${locale}` || route === `/${locale}/` || route === '/') {
      pageType = 'landing';
    }

    // Note: We don't capture PAGE_VIEWED here to avoid double-counting with PostHog's
    // automatic pageview capture (enabled in posthog-provider.tsx).
    // Only track structured page-specific events below.

    // Track specific page types
    if (pageType === 'pricing') {
      posthog.capture(PostHogEvents.PRICING_PAGE_VIEWED, {
        locale,
        route,
      });
    } else if (pageType.startsWith('dashboard')) {
      posthog.capture(PostHogEvents.DASHBOARD_VIEWED, {
        section: pageType,
        locale,
        route,
      });
      
      if (pageType !== 'dashboard') {
        posthog.capture(PostHogEvents.DASHBOARD_SECTION_VIEWED, {
          section: pageType.replace('dashboard_', ''),
          locale,
          route,
        });
      }
    }
  }, [pathname, search, locale, posthog]);

  return null;
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerContent />
    </Suspense>
  );
}

