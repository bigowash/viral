'use server';

import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/db/supabase';
import { ActivityType } from '@/lib/constants/activity';
import { getUserWithTeam, logActivity } from '@/lib/db/queries';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { trackEvent as trackPostHogEvent } from '@/lib/analytics/posthog-server';

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

    // Track PostHog event (don't fail if this fails)
    try {
      trackPostHogEvent(user.id, 'team_member_invited', {
        team_id: userWithTeam.teamId,
        invited_email: email,
        role: role,
      });
    } catch (error) {
      console.error('Failed to track PostHog event:', error);
      // Continue anyway
    }

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: 'Invitation sent successfully' };
  }
);

