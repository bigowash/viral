import { createServerSupabaseClient } from '@/lib/db/supabase';
import { getUser } from '@/lib/modules/auth/queries';
import { ActivityType } from '@/lib/constants/activity';

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

