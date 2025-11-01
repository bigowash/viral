'use client';

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';

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

// Browser singleton QueryClient - persists across locale changes
// This is important so we don't re-make a new client during React suspense
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Gets the appropriate QueryClient instance.
 * - Server: Always creates a new QueryClient for each request (prevents data leaks)
 * - Browser: Returns singleton to persist cache across locale changes
 * 
 * Follows TanStack Query best practices for Next.js App Router SSR.
 */
function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: always make a new query client for each request
    // This prevents sharing cache between different users/requests
    return makeQueryClient();
  } else {
    // Browser: use singleton to persist cache across locale changes
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * QueryProvider component for Next.js App Router.
 * 
 * Follows TanStack Query best practices:
 * - Creates new QueryClient on server for each request (prevents data leaks)
 * - Uses singleton QueryClient on browser (persists cache across locale changes)
 * - Sets initial data from server-side prefetching
 * 
 * NOTE: We avoid useState when initializing the query client because React
 * will throw away the client on the initial render if it suspends and there
 * is no boundary above it.
 */
export function QueryProvider({
  children,
  initialData
}: {
  children: React.ReactNode;
  initialData?: Record<string, any>;
}) {
  // Get QueryClient - new on server, singleton on browser
  // Using direct assignment instead of useState to follow TanStack Query best practices
  // This prevents React from throwing away the client during suspense
  const queryClient = useMemo(() => getQueryClient(), []);

  // Set initial data for queries if provided (from server-side prefetching)
  // React Query uses array keys, so we convert string keys to arrays
  useEffect(() => {
    if (initialData && typeof initialData === 'object' && !Array.isArray(initialData)) {
      Object.entries(initialData).forEach(([queryKey, data]) => {
        if (queryKey && typeof queryKey === 'string' && data !== undefined) {
          // Set query data in the cache using array key format
          // This makes the prefetched data immediately available to useQuery hooks
          queryClient.setQueryData([queryKey], data === null ? null : data);
        }
      });
    }
  }, [initialData, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

