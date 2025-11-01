# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

**Demo: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Stripe Checkout
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with Stripe Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: Postgres (migrating to Supabase-managed Postgres)
- **Data Access**: Currently Drizzle ORM (scheduled to be replaced by Supabase clients + SQL migrations)
- **Auth**: Transitioning from custom JWT cookies to Supabase Auth
- **Payments**: [Stripe](https://stripe.com/)
- **Analytics**: [PostHog](https://posthog.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Running Locally

[Install](https://docs.stripe.com/stripe-cli) and log in to your Stripe account:

```bash
stripe login
```

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can also create new users through the `/sign-up` route.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

You can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Supabase Workflow

If you're working with Supabase (see [Roadmap](#roadmap-supabase-first-stack) for migration status), use the following commands:

### Start Supabase locally

Ensure Supabase is running locally:

```bash
supabase start
```

This will start all Supabase services (Postgres, Auth, Storage, etc.) and print connection details.

### Push database migrations

After creating or modifying migration files in `supabase/migrations/`, push them to your local Supabase instance:

```bash
pnpm db:push
```

This applies pending migrations to the local database. For production/remote databases, use `supabase db push --linked` after linking your project with `supabase link --project-ref <project-ref>`.

### Generate TypeScript types

After schema changes, generate TypeScript types from your Supabase database:

```bash
pnpm types:generate
```

This creates/updates `types/supabase.ts` with type definitions for all tables, functions, and other database objects. The types are generated from your local Supabase instance by default.

**For production/remote types**, use:
```bash
supabase gen types typescript --project-id <project-id> > types/supabase.ts
```

### Development workflow

1. Start Supabase locally: `supabase start`
2. Create/edit migrations in `supabase/migrations/`
3. Push migrations: `pnpm db:push`
4. Generate types: `pnpm types:generate`
5. Restart your Next.js dev server to pick up type changes: `pnpm dev`

## Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

Follow the steps below to deploy the Supabase-powered stack to Vercel.

### 1. Provision Supabase

1. Create a new project in [Supabase](https://supabase.com/). Pick a region close to Vercel.
2. Copy your **Project Reference** (Settings → General) and API credentials (Settings → API).
3. Update the site's redirect settings in Supabase (Authentication → URL configuration) so `site_url` and `redirect_urls` include your production domain, e.g. `https://your-app.vercel.app`.

#### Link the CLI & push migrations

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push --linked          # Apply migrations in supabase/migrations
supabase gen types typescript \
  --project-id <project-ref> > types/supabase.ts
```

The last command keeps the generated types in sync with the production database. Commit any changes.

### 2. Configure Stripe

1. Switch to your live Stripe mode (top left toggle in the dashboard).
2. Create the products/prices that match the IDs used by the app.
3. Create a production webhook (Developers → Webhooks) pointing to `https://your-domain.com/api/stripe/webhook`.
4. Record the webhook signing secret and live secret key for environment variables.

### 3. Deploy to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com/import) and pick the root of this workspace.
3. Leave the default build command (`next build`) and output directory (`.next`).
4. Trigger the first deployment after you finish adding the environment variables below.

### 4. Add environment variables in Vercel

Add these keys in Vercel → Project → Settings → Environment Variables. Mark server-only values as **Encrypted**. Apply them to both Production and Preview environments so previews work the same way.

| Variable | Required | Value |
| --- | --- | --- |
| `BASE_URL` | ✅ | `https://your-domain.com` (used for Stripe redirects) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key from Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (never expose client-side) |
| `STRIPE_SECRET_KEY` | ✅ | Live Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Signing secret for the production webhook |
| `AUTH_SECRET` | ✅ | Random 32+ byte string (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | ✅ | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | ⚠️ | PostHog host (`https://us.i.posthog.com` or EU host) |
| `POSTHOG_KEY` | ⚠️ | Optional – set to the same value as `NEXT_PUBLIC_POSTHOG_KEY` for server events |
| `POSTHOG_HOST` | ⚠️ | Optional – match the host used above |

> Tip: if you keep a local `.env.local`, you can run `vercel env pull` to stay in sync.

### 5. Final checks

- Redeploy on Vercel after updating the variables.
- Verify Supabase Auth emails and redirects use the production domain.
- From the live site, run through sign-up → checkout to confirm Supabase, Stripe, and PostHog events are flowing.

## Roadmap: Supabase-First Stack

We are actively migrating from the starter stack to a Supabase-first architecture (see `PLANNING.md` for detailed tasks). High-level milestones:

1. **Bootstrapping Supabase**
   - Initialise Supabase locally/remote, configure env vars for local dev and Vercel.
   - Add CLI scripts (`supabase db push`, `supabase gen types`) and update docs.
2. **Schema & Type Sync**
   - Rebuild app tables (UUID PK/FK) in Supabase migrations and enable RLS.
   - Create a `profiles` table linked to `auth.users`, generate TypeScript types automatically.
3. **Auth & App Logic Migration**
   - Replace custom auth/session code with Supabase Auth in server actions, middleware, and data helpers.
   - Remove Drizzle once Supabase clients power all queries.
4. **Stripe & Integrations**
   - Update checkout/webhook handlers to use Supabase service clients and adapt to UUID IDs.
5. **Analytics**
   - ✅ PostHog installed and configured in `app/[locale]/layout.tsx` with event tracking for sign-in, sign-up, checkout, and team management.

Track progress and detailed checklists in `PLANNING.md`.

## Other Templates

While this template is intentionally minimal and to be used as a learning resource, there are other paid versions in the community which are more full-featured:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
