import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  if (posthogClient) {
    return posthogClient;
  }

  const posthogKey = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!posthogKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog key not found. Server-side analytics will be disabled.');
    }
    return null;
  }

  posthogClient = new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 20,
    flushInterval: 10000,
  });

  return posthogClient;
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  const client = getPostHogClient();
  if (client) {
    client.identify({
      distinctId: userId,
      properties,
    });
  }
}

export function trackEvent(
  distinctId: string,
  eventName: string,
  properties?: Record<string, unknown>
) {
  const client = getPostHogClient();
  if (client) {
    client.capture({
      distinctId,
      event: eventName,
      properties,
    });
  }
}

export async function shutdown() {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}

