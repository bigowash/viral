'use client';

import { SWRConfig, type SWRConfiguration } from 'swr';
import { useMemo } from 'react';

// Create a singleton cache that's safe for both SSR and client
let cache: Map<string, any> | undefined;

// Create a cache provider that never uses localStorage
// This prevents SSR errors when localStorage is not available
const getCacheProvider = () => {
  // Always return a Map-based cache, never localStorage
  if (!cache) {
    cache = new Map();
  }
  return cache;
};

export function SWRProvider({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: Record<string, any>;
}) {
  const config = useMemo<SWRConfiguration>(
    () => ({
      fallback,
      provider: getCacheProvider,
      // Explicitly disable revalidation on mount to avoid any localStorage checks
      revalidateOnMount: false,
      // Disable focus revalidation which might trigger localStorage access
      revalidateOnFocus: false
    }),
    [fallback]
  );

  return <SWRConfig value={config}>{children}</SWRConfig>;
}

