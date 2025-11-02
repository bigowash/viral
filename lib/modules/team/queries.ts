import { createServerSupabaseClient } from '@/lib/db/supabase';
import { getUser } from '@/lib/modules/auth/queries';
import { Database } from '@/types/supabase';
import { TeamDataWithMembers } from '@/lib/auth/middleware';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Type for Supabase query result with nested relations
type TeamWithMembersQuery = Team & {
  team_members: (TeamMember & {
    profiles: Pick<Profile, 'id' | 'display_name' | 'primary_email'> | null;
  })[];
};

/**
 * Get team by Stripe customer ID.
 */
export async function getTeamByStripeCustomerId(customerId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Get team for the current user with all members.
 */
export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  // Get user's team membership
  const { data: membership, error: membershipError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', user.id)
    .limit(1)
    .single();

  if (membershipError || !membership) {
    return null;
  }

  // Get team with all members
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select(
      `
      *,
      team_members (
        id,
        role,
        joined_at,
        profile_id,
        profiles!team_members_profile_id_fkey (
          id,
          display_name,
          primary_email
        )
      )
      `
    )
    .eq('id', membership.team_id)
    .single();

  if (teamError || !team) {
    return null;
  }

  // Type assertion for Supabase query result
  const teamWithMembers = team as unknown as TeamWithMembersQuery;

  // Transform to match expected format
  return {
    ...teamWithMembers,
    teamMembers: (teamWithMembers.team_members || []).map((tm) => ({
      ...tm,
      user: tm.profiles && !Array.isArray(tm.profiles) ? {
        id: tm.profiles.id,
        display_name: tm.profiles.display_name,
        primary_email: tm.profiles.primary_email,
      } : null,
    })),
  } as TeamDataWithMembers;
}

