import { createServerSupabaseClient } from '@/lib/db/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

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

