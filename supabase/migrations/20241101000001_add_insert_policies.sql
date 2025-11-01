-- Migration: Add INSERT policies for RLS
-- This allows authenticated users to create records in tables they have access to

-- Profiles: users can insert their own profile (during sign-up)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Teams: team owners can create teams
CREATE POLICY "Owners can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = owner_profile_id);

-- Team members: team members can be inserted by authenticated users who are members of that team
-- (This is typically done server-side, but the policy allows it)
CREATE POLICY "Team members can add members to their teams"
  ON team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.profile_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Invitations: team members can create invitations for their teams
CREATE POLICY "Team members can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = invitations.team_id
      AND team_members.profile_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
    AND auth.uid() = invited_by
  );

-- Activity logs: authenticated users can insert activity logs for teams they belong to
CREATE POLICY "Team members can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = activity_logs.team_id
      AND team_members.profile_id = auth.uid()
    )
    AND auth.uid() = actor_profile_id
  );

