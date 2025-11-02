/**
 * @deprecated This file is kept for backwards compatibility.
 * Please import from domain-specific modules instead:
 * - lib/modules/auth/actions.ts
 * - lib/modules/team/actions.ts
 * - lib/modules/billing/actions.ts
 * - lib/actions/session.ts (for shared component usage)
 */

// Re-export from domain-specific modules for backwards compatibility
export { signIn, signUp, signOut, updatePassword, deleteAccount, updateAccount } from '@/lib/modules/auth/actions';
export { inviteTeamMember, removeTeamMember } from '@/lib/modules/team/actions';
