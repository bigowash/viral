'use server';

import { z } from 'zod';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/db/supabase';
import { ActivityType } from '@/lib/constants/activity';
import { redirect } from 'next/navigation';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getUserWithTeam, logActivity, getTeamForUser } from '@/lib/db/queries';
import {
  validatedAction,
  validatedActionWithUser
} from '@/lib/auth/middleware';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
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

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
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
      emailRedirectTo: `${process.env.BASE_URL}/dashboard`
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
  let createdTeam: Database['public']['Tables']['teams']['Row'] | null = null;

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

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
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

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
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

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
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

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
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

const removeTeamMemberSchema = z.object({
  memberId: z.string()
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('team_id', userWithTeam.teamId);

    if (error) {
      return { error: 'Failed to remove team member.' };
    }

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: 'Team member removed successfully' };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'admin', 'owner'])
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const supabase = await createServerSupabaseClient();

    // Check if user already exists and is a team member
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('primary_email', email)
      .single();

    if (existingProfile) {
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', userWithTeam.teamId)
        .eq('profile_id', existingProfile.id)
        .single();

      if (existingMember) {
        return { error: 'User is already a member of this team' };
      }
    }

    // Check if there's an existing invitation
    const { data: existingInvitation } = await supabase
      .from('invitations')
      .select('id')
      .eq('invited_email', email)
      .eq('team_id', userWithTeam.teamId)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return { error: 'An invitation has already been sent to this email' };
    }

    // Create a new invitation
    const { error: inviteError } = await supabase
      .from('invitations')
      .insert({
        team_id: userWithTeam.teamId,
        invited_email: email,
        role,
        invited_by: user.id,
        status: 'pending'
      });

    if (inviteError) {
      return { error: 'Failed to create invitation. Please try again.' };
    }

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: 'Invitation sent successfully' };
  }
);
