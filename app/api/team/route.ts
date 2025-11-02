import { getTeamForUser } from '@/lib/db/queries';
import { TeamDataWithMembers } from '@/lib/auth/middleware';

export type TeamApiResponse = TeamDataWithMembers | null;

export async function GET(): Promise<Response> {
  const team = await getTeamForUser();
  return Response.json(team);
}
