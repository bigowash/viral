# Task Backlog

## Immediate
- [x] Initialise Supabase project locally (`supabase init`, `supabase start`) and add secrets to `.env.local`.
- [x] Add Supabase CLI scripts to `package.json` (`supabase db push`, `supabase gen types`) and document workflow in README.
- [x] Create migration SQL to rebuild `teams`, `team_members`, `activity_logs`, `invitations`, and new `profiles` table with UUID keys.
- [x] Wire Supabase type generation to output `types/supabase.ts`; add script to CI/local dev flow.
- [x] Push migration to local Supabase instance
- [x] Create Supabase client setup (`lib/db/supabase.ts`)
- [x] Update all queries to use Supabase client instead of Drizzle
- [x] Remove Drizzle config and update package.json scripts

## Auth Migration
- [x] Replace custom auth helpers (`lib/auth/session.ts`, `middleware.ts`) with Supabase SSR clients for session checks.
- [x] Refactor server actions in `app/[locale]/(login)/actions.ts` to call Supabase Auth APIs.
- [x] Update API routes (`app/api/user`, `app/api/team`, `app/api/stripe/*`) to use Supabase clients/service role.
- [x] Update all UI components to use new Supabase Profile types

## Stripe & Analytics
- [x] Adjust Stripe checkout/webhook handlers to write/read Supabase UUID IDs and respect RLS.
- [x] Install and initialise PostHog in `app/[locale]/layout.tsx`; instrument sign-in, sign-up, checkout flows.
