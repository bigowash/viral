'use server';

import { z } from 'zod';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/db/supabase';
import { ActivityType } from '@/lib/constants/activity';
import { redirect } from 'next/navigation';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getUserWithTeam } from '@/lib/modules/auth/queries';
import { logActivity } from '@/lib/modules/activity/queries';
import {
  validatedAction,
  validatedActionWithUser
} from '@/lib/auth/middleware';
import { identifyUser as identifyPostHogUser, trackEvent as trackPostHogEvent } from '@/lib/analytics/posthog-server';
import { Team } from '@/lib/db/types';

// Return types for server actions
// Note: These actions may redirect (never return) when successful
export type SignInResult = {
  error?: string;
  email?: string;
  password?: string;
  success?: never;
} | never;

export type SignUpResult = {
  error?: string;
  email?: string;
  password?: string;
  success?: never;
} | never;

export type UpdatePasswordResult = {
  error?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  success?: string;
};

export type DeleteAccountResult = {
  error?: string;
  password?: string;
  success?: never;
};

export type UpdateAccountResult = {
  error?: string;
  name?: string;
  success?: string;
};

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction<typeof signInSchema, SignInResult>(signInSchema, async (data, formData): Promise<SignInResult> => {
  const { email, password } = data;
  const supabase = await createServerSupabaseClient();

  // Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.error('Sign-in auth error:', authError);
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  // Get user's profile and team
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    return {
      error: 'Failed to load profile. Please try again.',
      email,
      password
    };
  }

  if (!profile) {
    return {
      error: 'Profile not found. Please contact support.',
      email,
      password
    };
  }

  // Get user's team (use maybeSingle to handle case where user has no team)
  const { data: membership, error: membershipError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', profile.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    console.error('Team membership fetch error:', membershipError);
    // Don't fail sign-in if we can't fetch membership, just log it
  }

  let team = null;
  if (membership?.team_id) {
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', membership.team_id)
      .maybeSingle();
    
    if (teamError) {
      console.error('Team fetch error:', teamError);
    } else {
      team = teamData;
    }
  }

  // Log activity (don't fail if this fails)
  try {
    await logActivity(membership?.team_id || null, profile.id, ActivityType.SIGN_IN);
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Continue anyway
  }

  // Track PostHog event (don't fail if this fails)
  try {
    identifyPostHogUser(profile.id, {
      email: profile.primary_email,
      name: profile.display_name,
      team_id: membership?.team_id || null,
    });
    trackPostHogEvent(profile.id, 'user_signed_in', {
      team_id: membership?.team_id || null,
      has_team: !!membership?.team_id,
    });
  } catch (error) {
    console.error('Failed to track PostHog event:', error);
    // Continue anyway
  }

  // Verify session is established before redirecting
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Session not established after sign-in:', sessionError);
    return {
      error: 'Failed to establish session. Please try again.',
      email,
      password
    };
  }

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    // createCheckoutSession redirects, so this never returns
    return createCheckoutSession({ team: team, priceId });
  }

  // Redirect - middleware will handle locale routing
  redirect('/dashboard');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional()
});

export const signUp = validatedAction<typeof signUpSchema, SignUpResult>(signUpSchema, async (data, formData): Promise<SignUpResult> => {
  const { email, password, inviteId } = data;
  const supabase = await createServerSupabaseClient();
  const serviceSupabase = createServiceRoleClient();

  // Check if user already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('primary_email', email)
    .single();

  if (existingProfile) {
    return {
      error: 'A user with this email already exists. Please sign in instead.',
      email,
      password
    };
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
    }
  });

  if (authError || !authData.user) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password
    };
  }

  // Create profile
  const { data: profile, error: profileError } = await serviceSupabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      primary_email: email,
      display_name: email.split('@')[0], // Use email prefix as default name
    })
    .select()
    .single();

  if (profileError || !profile) {
    // Clean up auth user if profile creation fails
    await serviceSupabase.auth.admin.deleteUser(authData.user.id);
    return {
      error: 'Failed to create profile. Please try again.',
      email,
      password
    };
  }

  let teamId: string;
  let userRole: string;
  let createdTeam: Team | null = null;

  if (inviteId) {
    // Check if there's a valid invitation
    const { data: invitation } = await serviceSupabase
      .from('invitations')
      .select('*')
      .eq('id', inviteId)
      .eq('invited_email', email)
      .eq('status', 'pending')
      .single();

    if (invitation) {
      teamId = invitation.team_id;
      userRole = invitation.role;

      await serviceSupabase
        .from('invitations')
        .update({ 
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      await logActivity(teamId, profile.id, ActivityType.ACCEPT_INVITATION);

      const { data: team } = await serviceSupabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      createdTeam = team;
    } else {
      // Clean up if invitation is invalid
      await serviceSupabase.auth.admin.deleteUser(authData.user.id);
      await serviceSupabase.from('profiles').delete().eq('id', profile.id);
      return { error: 'Invalid or expired invitation.', email, password };
    }
  } else {
    // Create a new team if there's no invitation
    const { data: team, error: teamError } = await serviceSupabase
      .from('teams')
      .insert({
        name: `${email}'s Team`,
        owner_profile_id: profile.id,
      })
      .select()
      .single();

    if (teamError || !team) {
      // Clean up if team creation fails
      await serviceSupabase.auth.admin.deleteUser(authData.user.id);
      await serviceSupabase.from('profiles').delete().eq('id', profile.id);
      return {
        error: 'Failed to create team. Please try again.',
        email,
        password
      };
    }

    createdTeam = team;
    teamId = team.id;
    userRole = 'owner';

    await logActivity(teamId, profile.id, ActivityType.CREATE_TEAM);
  }

  // Create team membership
  const { error: memberError } = await serviceSupabase
    .from('team_members')
    .insert({
      team_id: teamId,
      profile_id: profile.id,
      role: userRole,
    });

  if (memberError) {
    console.error('Failed to create team member:', memberError);
  }

  await logActivity(teamId, profile.id, ActivityType.SIGN_UP);

  // Track PostHog events (don't fail if this fails)
  try {
    identifyPostHogUser(profile.id, {
      email: profile.primary_email,
      name: profile.display_name,
      team_id: teamId,
      role: userRole,
    });
    trackPostHogEvent(profile.id, 'user_signed_up', {
      team_id: teamId,
      role: userRole,
      has_invitation: !!inviteId,
      created_team: !inviteId,
    });
    if (!inviteId) {
      trackPostHogEvent(profile.id, 'team_created', {
        team_id: teamId,
      });
    } else {
      trackPostHogEvent(profile.id, 'invitation_accepted', {
        team_id: teamId,
        role: userRole,
      });
    }
  } catch (error) {
    console.error('Failed to track PostHog event:', error);
    // Continue anyway
  }

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    // createCheckoutSession redirects, so this never returns
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect('/dashboard');
});

export async function signOut() {
  const user = await getUser();
  if (!user) {
    return;
  }

  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId || null, user.id, ActivityType.SIGN_OUT);

  // Track PostHog event (don't fail if this fails)
  try {
    trackPostHogEvent(user.id, 'user_signed_out', {
      team_id: userWithTeam?.teamId || null,
    });
  } catch (error) {
    console.error('Failed to track PostHog event:', error);
    // Continue anyway
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedActionWithUser<typeof updatePasswordSchema, UpdatePasswordResult>(
  updatePasswordSchema,
  async (data, _, user): Promise<UpdatePasswordResult> => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (currentPassword === newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password must be different from the current password.'
      };
    }

    if (confirmPassword !== newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password and confirmation password do not match.'
      };
    }

    const supabase = await createServerSupabaseClient();

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.primary_email,
      password: currentPassword,
    });

    if (verifyError) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'Current password is incorrect.'
      };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'Failed to update password. Please try again.'
      };
    }

    const userWithTeam = await getUserWithTeam(user.id);
    await logActivity(userWithTeam?.teamId || null, user.id, ActivityType.UPDATE_PASSWORD);

    return {
      success: 'Password updated successfully.'
    };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedActionWithUser<typeof deleteAccountSchema, DeleteAccountResult>(
  deleteAccountSchema,
  async (data, _, user): Promise<DeleteAccountResult> => {
    const { password } = data;
    const supabase = await createServerSupabaseClient();

    // Verify password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.primary_email,
      password,
    });

    if (verifyError) {
      return {
        password,
        error: 'Incorrect password. Account deletion failed.'
      };
    }

    const userWithTeam = await getUserWithTeam(user.id);
    await logActivity(userWithTeam?.teamId || null, user.id, ActivityType.DELETE_ACCOUNT);

    // Remove from teams
    if (userWithTeam?.teamId) {
      const serviceSupabase = createServiceRoleClient();
      await serviceSupabase
        .from('team_members')
        .delete()
        .eq('profile_id', user.id)
        .eq('team_id', userWithTeam.teamId);
    }

    // Delete auth user (this will cascade delete profile via FK constraint)
    const serviceSupabase = createServiceRoleClient();
    await serviceSupabase.auth.admin.deleteUser(user.id);

    await supabase.auth.signOut();
    redirect('/sign-in');
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export const updateAccount = validatedActionWithUser<typeof updateAccountSchema, UpdateAccountResult>(
  updateAccountSchema,
  async (data, _, user): Promise<UpdateAccountResult> => {
    const { name, email } = data;
    const supabase = await createServerSupabaseClient();

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        display_name: name,
        primary_email: email,
      })
      .eq('id', user.id);

    if (profileError) {
      return { error: 'Failed to update account. Please try again.' };
    }

    // Update auth email if it changed
    if (email !== user.primary_email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email
      });

      if (emailError) {
        return { error: 'Failed to update email. Please try again.' };
      }
    }

    const userWithTeam = await getUserWithTeam(user.id);
    await logActivity(userWithTeam?.teamId || null, user.id, ActivityType.UPDATE_ACCOUNT);

    return { name, success: 'Account updated successfully.' };
  }
);

