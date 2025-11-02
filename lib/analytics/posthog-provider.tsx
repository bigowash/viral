'use client';

import { PostHogProvider as PostHogProviderOriginal } from 'posthog-js/react';
import { PageViewTracker } from './page-view-tracker';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // If no API key is provided, skip PostHog initialization
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PostHogProviderOriginal
      apiKey={posthogKey}
      options={{
        api_host: posthogHost,
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        loaded: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded');
          }
        },
      }}
    >
      <PageViewTracker />
      {children}
    </PostHogProviderOriginal>
  );
}

