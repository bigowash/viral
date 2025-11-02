'use client';

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  type DehydratedState,
} from '@tanstack/react-query';
import { useState } from 'react';

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
 * QueryProvider component for Next.js App Router.
 * 
 * Uses idiomatic TanStack Query rehydration pattern:
 * - Server: Uses request-scoped QueryClient (via cache() helper)
 * - Client: Uses useState singleton to persist cache across locale changes
 * - Uses HydrationBoundary with dehydratedState for proper rehydration
 * 
 * This ensures mutations behave predictably and preserves timestamps.
 */
export function QueryProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}) {
  // Client singleton QueryClient - useState ensures persistence across locale changes
  // while avoiding issues with React suspense boundaries
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {dehydratedState ? (
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      ) : (
        children
      )}
    </QueryClientProvider>
  );
}

