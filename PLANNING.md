# Supabase-First Migration Plan

## Context & Decisions
- **Hosting**: Vercel serves the Next.js frontend and serverless routes; Supabase owns Postgres, Auth, storage, and background automation; Stripe webhooks stay on Vercel.
- **Auth/Data**: Supabase Auth replaces custom JWT cookies and serial IDs. Application tables move to UUID primary keys managed by Supabase SQL migrations.
- **Analytics**: Introduce PostHog for product telemetry (client and optional server events).

## Workstreams
- ### Project & Tooling
  - [ ] Initialise Supabase locally (`supabase init`, `supabase start`) and configure env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) for local/Vercel.
  - [ ] Add Supabase CLI scripts to `package.json` (`db:push`, `types:generate`) and document the workflow in README.
  - [ ] Remove Drizzle config/dependencies after Supabase SQL migration pipeline is live.
- ### Schema & Types
  - [ ] Recreate app tables in Supabase migrations with UUID PK/FK (`teams`, `team_members`, `activity_logs`, `invitations`).
  - [ ] Add a `profiles` table keyed to `auth.users` for app-specific fields (name, role, locale).
  - [ ] Enable Row Level Security and author policies mirroring current team ownership/member access.
  - [ ] Automate type generation (`supabase gen types typescript`) into `types/supabase.ts` and wire it into CI/local tooling.
- ### Auth & Application Logic
  - [ ] Refactor server actions in `app/[locale]/(login)/actions.ts` to call Supabase Auth (`signUp`, `signInWithPassword`, `signOut`, admin deletes).
  - [ ] Replace middleware/session helpers with Supabase SSR clients (`createServerClient`) across middleware, API routes, and server components.
  - [ ] Rework data access helpers (today in `lib/db/queries.ts`) to rely on Supabase clients or RPC views; remove custom JWT/password hashing code.
- ### Stripe & Integrations
  - [ ] Update Stripe checkout/webhook handlers to read/write Supabase tables (UUID IDs) using service-role clients or RPC functions.
  - [ ] Validate subscription metadata flow (team linkage, plan fields) under new schema and RLS rules.
- ### Analytics & Observability
  - [ ] Add PostHog snippet in `app/layout.tsx` with env-driven config.
  - [ ] Instrument key auth/billing events (sign up, checkout, invite) with PostHog client calls.
  - [ ] Evaluate server-side event capture via PostHog Node SDK for API routes (optional).

## Milestones
- **M1**: Supabase project bootstrapped, schema migrated, types generated.
- **M2**: Auth + dashboard flows run on Supabase locally (manual QA + smoke tests).
- **M3**: Stripe integration works end-to-end with Supabase data and PostHog events emitting.
- **M4**: Deploy to Vercel/Supabase, update documentation, remove Drizzle artefacts.

Ensure dev and prod for everything (supa, ph)