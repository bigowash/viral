# Task Backlog

## Immediate
- [x] Initialise Supabase project locally (`supabase init`, `supabase start`) and add secrets to `.env.local`.
- [x] Add Supabase CLI scripts to `package.json` (`supabase db push`, `supabase gen types`) and document workflow in README.
- [ ] Create migration SQL to rebuild `teams`, `team_members`, `activity_logs`, `invitations`, and new `profiles` table with UUID keys.
- [ ] Wire Supabase type generation to output `types/supabase.ts`; add script to CI/local dev flow.

## Auth Migration
- [ ] Replace custom auth helpers (`lib/auth/session.ts`, `middleware.ts`) with Supabase SSR clients for session checks.
- [ ] Refactor server actions in `app/[locale]/(login)/actions.ts` to call Supabase Auth APIs.
- [ ] Update API routes (`app/api/user`, `app/api/team`, `app/api/stripe/*`) to use Supabase clients/service role.

## Stripe & Analytics
- [ ] Adjust Stripe checkout/webhook handlers to write/read Supabase UUID IDs and respect RLS.
- [ ] Install and initialise PostHog in `app/layout.tsx`; instrument sign-in, sign-up, checkout flows.
