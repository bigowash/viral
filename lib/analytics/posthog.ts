'use client';

import { usePostHog } from 'posthog-js/react';
import posthog from 'posthog-js';

/**
 * Hook-based utilities for use within React components.
 * Use this hook when you have access to the PostHog context.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const posthog = usePostHogClient();
 *   posthog?.capture('button_clicked');
 * }
 * ```
 */
export function usePostHogClient() {
  const posthogClient = usePostHog();
  return posthogClient;
}

/**
 * Identify a user with PostHog.
 * PostHog queues events even before fully loaded, so these calls are safe.
 * 
 * @param userId - The unique identifier for the user
 * @param properties - Optional user properties to set
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  if (!posthog) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog instance not available');
    }
    return;
  }

  posthog.identify(userId, properties);
}

/**
 * Track an event with PostHog.
 * PostHog queues events even before fully loaded, so these calls are safe.
 * 
 * @param eventName - The name of the event to track
 * @param properties - Optional event properties
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  if (!posthog) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog instance not available');
    }
    return;
  }

  posthog.capture(eventName, properties);
}

/**
 * Reset PostHog (useful for logout flows).
 */
export function reset() {
  if (typeof window === 'undefined') return;
  
  if (posthog && typeof posthog.reset === 'function') {
    posthog.reset();
  }
}

