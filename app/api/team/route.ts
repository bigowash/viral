import { getTeamForUser } from '@/lib/db/queries';
import { getUser } from '@/lib/db/queries';
import { TeamDataWithMembers } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export type TeamApiResponse = TeamDataWithMembers | null;

export async function GET(): Promise<Response> {
  const user = await getUser();
  const team = user ? await getTeamForUser(user.id) : null;
  return Response.json(team);
}
