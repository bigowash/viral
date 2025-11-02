import { cache } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';

/**
 * Creates a new QueryClient with optimized defaults for Next.js SSR.
 * Follows TanStack Query best practices for server-side rendering.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we want to set a default staleTime above 0
        // to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute (per TanStack Query docs)
        // Disable refetching on window focus to prevent issues during locale changes
        refetchOnWindowFocus: false,
        // Disable refetching on reconnect
        refetchOnReconnect: false,
        // Disable refetching on mount (data is already prefetched)
        refetchOnMount: false,
        // Retry configuration
        retry: false,
      },
    },
  });
}

/**
 * Gets a request-scoped QueryClient for server-side data fetching.
 * Uses React's cache() to ensure each request gets its own client instance,
 * preventing data leaks between requests.
 * 
 * This is the idiomatic way to handle server-side QueryClients in Next.js App Router.
 */
export const getQueryClient = cache(() => makeQueryClient());

/**
 * Prefetchs query data on the server and returns dehydrated state.
 * 
 * Usage:
 * ```ts
 * const queryClient = getQueryClient();
 * await queryClient.prefetchQuery({ queryKey: ['/api/user'], queryFn: fetchUser });
 * const dehydratedState = dehydrate(queryClient);
 * ```
 * 
 * Then pass dehydratedState to QueryProvider in your layout.
 */
export { dehydrate };

