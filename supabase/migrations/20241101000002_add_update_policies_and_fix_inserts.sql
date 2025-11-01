-- Migration: Add UPDATE policies and fix INSERT policies for sign-up flow

-- Allow users to insert themselves as team members (during sign-up)
-- Drop the restrictive policy and create a more permissive one
DROP POLICY IF EXISTS "Team members can add members to their teams" ON team_members;

CREATE POLICY "Users can add themselves or admins can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    -- Allow if adding themselves
    auth.uid() = profile_id
    OR
    -- Allow if they're an admin/owner of the team
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.profile_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Invitations: allow updating invitation status
CREATE POLICY "Team members can update invitations"
  ON invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = invitations.team_id
      AND team_members.profile_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

-- Teams: allow team owners/admins to update team info
CREATE POLICY "Team owners can update teams"
  ON teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.profile_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

