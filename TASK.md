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

## Supabase MCP Integration
- [x] Link project to Supabase remote project via MCP (Project ID: xigkfywncesdbjivdpqi)
- [x] Apply all database migrations to remote Supabase project
- [x] Generate TypeScript types from remote database schema
- [x] Fix security advisor warnings (function search_path)

## Cleanup & Migration Complete
- [x] Remove all Drizzle code (schema.ts, drizzle.ts, drizzle.config.ts, migrations directory, seed.ts)
- [x] Remove Drizzle dependencies from package.json (drizzle-kit, drizzle-orm, postgres)
- [x] Clean up lib/auth/session.ts (deprecated functions - Supabase handles auth now)
- [x] Update lib/db/setup.ts to use Supabase instead of Postgres

## Testing & Quality Assurance
- [x] Add lint script (`next lint`) to package.json (2024-12-XX)
- [x] Add Vitest for unit testing with React Testing Library support (2024-12-XX)
- [x] Add Playwright for e2e testing with configuration (2024-12-XX)
- [x] Create test scripts (`test`, `test:unit`, `test:e2e`) in package.json (2024-12-XX)
- [x] Set up ESLint configuration for Next.js (2024-12-XX)
