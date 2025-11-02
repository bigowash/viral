import { useQuery } from '@tanstack/react-query';
import { TeamDataWithMembers } from '@/lib/auth/middleware';

const TEAM_QUERY_KEY = ['/api/team'] as const;

/**
 * Fetcher function for team data.
 */
async function fetchTeam(): Promise<TeamDataWithMembers | null> {
  try {
    const res = await fetch('/api/team');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as TeamDataWithMembers;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

/**
 * Hook to fetch and manage team data.
 * Uses React Query for caching and automatic refetching.
 */
export function useTeam() {
  return useQuery<TeamDataWithMembers | null>({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeam,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

