import { useQuery } from '@tanstack/react-query';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['profiles']['Row'];

const USER_QUERY_KEY = ['/api/user'] as const;

/**
 * Fetcher function for user data.
 */
async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as User;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

/**
 * Hook to fetch and manage user data.
 * Uses React Query for caching and automatic refetching.
 */
export function useUser() {
  return useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

