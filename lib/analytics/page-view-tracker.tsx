'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHogClient } from './posthog';
import { PostHogEvents } from './events';
import { locales } from '@/i18n';

/**
 * Tracks page views with route and locale information.
 * This complements PostHog's automatic pageview tracking with additional metadata.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHogClient();

  // Extract locale from pathname (e.g., /en/dashboard -> 'en')
  const locale = (() => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    const firstSegment = segments[0];
    return locales.includes(firstSegment as any) ? firstSegment : 'en';
  })();

  useEffect(() => {
    if (!posthog) return;

    const route = pathname || '/';
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${route}?${queryString}` : route;

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

    // Track page view with metadata
    posthog.capture(PostHogEvents.PAGE_VIEWED, {
      route,
      full_path: fullPath,
      locale,
      page_type: pageType,
      has_query_params: queryString.length > 0,
    });

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
  }, [pathname, searchParams, locale, posthog]);

  return null;
}

