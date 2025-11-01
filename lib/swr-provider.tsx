'use client';

import { SWRConfig, type SWRConfiguration } from 'swr';
import { useMemo } from 'react';

// Create a singleton cache that's safe for both SSR and client
// This cache persists across locale changes to prevent data loss
let cache: Map<string, any> | undefined;

// Create a cache provider that never uses localStorage
// This prevents SSR errors when localStorage is not available
const getCacheProvider = () => {
  // Always return a Map-based cache, never localStorage
  // Ensure cache is always initialized and never undefined
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
  // Normalize fallback to ensure all values are properly defined
  // This prevents SWR from trying to iterate over undefined values
  const normalizedFallback = useMemo(() => {
    if (!fallback || typeof fallback !== 'object' || Array.isArray(fallback)) {
      return {};
    }
    const normalized: Record<string, any> = {};
    try {
      for (const [key, value] of Object.entries(fallback)) {
        // Ensure keys are strings and values are never undefined
        if (key && typeof key === 'string') {
          normalized[key] = value === undefined ? null : value;
        }
      }
    } catch (error) {
      console.error('Error normalizing SWR fallback:', error);
      return {};
    }
    return normalized;
  }, [fallback]);

  const config = useMemo<SWRConfiguration>(
    () => {
      // Build config object with all required properties explicitly defined
      const swrConfig: SWRConfiguration = {
        fallback: normalizedFallback,
        provider: getCacheProvider,
        // Explicitly disable revalidation on mount to avoid any localStorage checks
        revalidateOnMount: false,
        // Disable focus revalidation which might trigger localStorage access
        revalidateOnFocus: false,
        // Disable revalidation on reconnect to prevent issues during locale changes
        revalidateOnReconnect: false,
        // Ensure fallback values are properly handled
        onError: (error) => {
          console.error('SWR error:', error);
        }
      };
      
      // Return the config object to ensure all properties are properly defined
      return swrConfig;
    },
    [normalizedFallback]
  );

  // Wrap in error boundary concept - ensure config is never undefined
  // SWRConfig requires a valid config object, so we always provide one
  if (!config || typeof config !== 'object') {
    console.error('SWR config is invalid, using default');
    return <>{children}</>;
  }

  return <SWRConfig value={config}>{children}</SWRConfig>;
}

