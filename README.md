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

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment.
3. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
4. `POSTGRES_URL`: Set this to your production database URL (until Supabase migration lands).
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.
6. `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (new stack; add once the Supabase project is ready).
7. `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key.
8. `NEXT_PUBLIC_POSTHOG_HOST`: Your PostHog host (defaults to `https://us.i.posthog.com`).
9. `POSTHOG_KEY`: Optional - for server-side tracking (can use `NEXT_PUBLIC_POSTHOG_KEY`).
10. `POSTHOG_HOST`: Optional - for server-side tracking (can use `NEXT_PUBLIC_POSTHOG_HOST`).

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
