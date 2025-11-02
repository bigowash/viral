import { cache } from 'react';
import { createServerSupabaseClient } from '@/lib/db/supabase';
import { Profile } from '@/lib/db/types';

/**
 * Get the current authenticated user's profile.
 * Returns null if no valid session exists.
 * 
 * Uses react.cache() to ensure getUser() is only called once per request,
 * preventing duplicate Supabase auth calls.
 */
export const getUser = cache(async function getUser() {
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
});

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

