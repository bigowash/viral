import { useQuery } from '@tanstack/react-query';
import { TeamApiResponse } from '@/app/api/team/route';

const TEAM_QUERY_KEY = ['/api/team'] as const;

/**
 * Fetcher function for team data.
 * Uses the exported type from the API route to ensure type safety.
 */
async function fetchTeam(): Promise<TeamApiResponse> {
  try {
    const res = await fetch('/api/team');
    if (!res.ok) return null;
    const data: TeamApiResponse = await res.json();
    return data;
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
  return useQuery<TeamApiResponse>({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeam,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

