/**
 * Thin service layer for session-related actions used by shared components.
 * This avoids pulling route-group internals into shared components like Header.
 */

export { signOut } from '@/lib/modules/auth/actions';
export { inviteTeamMember, removeTeamMember } from '@/lib/modules/team/actions';

