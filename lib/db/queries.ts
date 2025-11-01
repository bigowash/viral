import { createServerSupabaseClient } from './supabase';
import { Database } from '@/types/supabase';
import { ActivityType } from '@/lib/constants/activity';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];

/**
 * Get the current authenticated user's profile.
 * Returns null if no valid session exists.
 */
export async function getUser() {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile;
}

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
 * Update team subscription information.
 */
export async function updateTeamSubscription(
  teamId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId?: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('teams')
    .update({
      stripe_subscription_id: subscriptionData.stripeSubscriptionId,
      plan_name: subscriptionData.planName,
      subscription_status: subscriptionData.subscriptionStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', teamId);

  if (error) {
    throw new Error(`Failed to update team subscription: ${error.message}`);
  }
}

/**
 * Get user with their team information.
 */
export async function getUserWithTeam(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return null;
  }

  const { data: teamMember } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', userId)
    .limit(1)
    .single();

  return {
    user: profile,
    teamId: teamMember?.team_id || null,
  };
}

/**
 * Get activity logs for the current user.
 */
export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const supabase = await createServerSupabaseClient();

  // Get user's teams
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', user.id);

  if (!teamMembers || teamMembers.length === 0) {
    return [];
  }

  const teamIds = teamMembers.map((tm) => tm.team_id);

  // Get activity logs for user's teams
  const { data: logs, error } = await supabase
    .from('activity_logs')
    .select(
      `
      id,
      action,
      created_at,
      metadata,
      actor_profile_id,
      profiles!activity_logs_actor_profile_id_fkey (
        display_name,
        primary_email
      )
      `
    )
    .in('team_id', teamIds)
    .eq('actor_profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to fetch activity logs: ${error.message}`);
  }

  return (logs || []).map((log) => ({
    id: log.id,
    action: log.action,
    timestamp: log.created_at,
    metadata: log.metadata,
    ipAddress: log.metadata && typeof log.metadata === 'object' && 'ipAddress' in log.metadata
      ? String(log.metadata.ipAddress)
      : undefined,
    userName: 
      log.profiles && !Array.isArray(log.profiles)
        ? log.profiles.display_name || log.profiles.primary_email
        : null,
  }));
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

/**
 * Log an activity for a team.
 */
export async function logActivity(
  teamId: string | null | undefined,
  actorProfileId: string,
  action: ActivityType,
  metadata?: Record<string, any>
) {
  if (!teamId) {
    return;
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('activity_logs').insert({
    team_id: teamId,
    actor_profile_id: actorProfileId,
    action: action,
    metadata: metadata || null,
  });

  if (error) {
    console.error('Failed to log activity:', error);
  }
}
