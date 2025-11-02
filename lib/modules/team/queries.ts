import { createServerSupabaseClient } from '@/lib/db/supabase';
import { getUser } from '@/lib/modules/auth/queries';

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

  // Transform to match expected format
  return {
    ...team,
    teamMembers: (team.team_members || []).map((tm: any) => ({
      ...tm,
      user: tm.profiles && !Array.isArray(tm.profiles) ? {
        id: tm.profiles.id,
        name: tm.profiles.display_name,
        email: tm.profiles.primary_email,
      } : null,
    })),
  };
}

