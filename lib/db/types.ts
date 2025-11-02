/**
 * Shared database entity type aliases.
 * These types are derived from the generated types/supabase.ts file.
 * 
 * All database entity types should be imported from here rather than
 * defining them locally in each module.
 */

import { Database } from '@/types/supabase';

/**
 * Profile entity from the profiles table.
 * Represents a user profile with display name, email, and other user-specific data.
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Team entity from the teams table.
 * Represents a team/organization with subscription and billing information.
 */
export type Team = Database['public']['Tables']['teams']['Row'];

/**
 * TeamMember entity from the team_members table.
 * Represents the relationship between a profile and a team, including role.
 */
export type TeamMember = Database['public']['Tables']['team_members']['Row'];

/**
 * Alias for Profile - commonly used as "User" in component contexts.
 * Use this when referring to the current user or a user in general UI contexts.
 */
export type User = Profile;

/**
 * ActivityLog entity from the activity_logs table.
 */
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];

/**
 * Invitation entity from the invitations table.
 */
export type Invitation = Database['public']['Tables']['invitations']['Row'];

