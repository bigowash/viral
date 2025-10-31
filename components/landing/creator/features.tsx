import {
  Compass,
  PackageCheck,
  TrendingUp,
  Wallet
} from 'lucide-react';

const creatorFeatures = [
  {
    icon: Compass,
    title: 'Centralised Opportunities',
    description: 'Find & apply to campaigns from top brands.'
  },
  {
    icon: Wallet,
    title: 'Payments Built-In',
    description: 'Track earnings and receive payouts automatically.'
  },
  {
    icon: TrendingUp,
    title: 'Track Performance',
    description: 'See views, clicks, and engagement from your content.'
  },
  {
    icon: PackageCheck,
    title: 'Easy Delivery',
    description: 'Manage briefs, approvals and payments in one platform.'
  }
];

export function CreatorFeatureSection() {
  return (
    <section
      id="features"
      className="bg-white py-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
            How it works
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
            Everything Creators Need in One Dashboard
          </h2>
          <p className="max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg">
            Your briefs, deliverables, and payouts live together, so you can spend
            more time creating and less time chasing admin.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {creatorFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_32px_70px_-48px_rgba(16,24,40,0.6)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_42px_90px_-40px_rgba(16,24,40,0.55)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(224,245,255,0.65),rgba(255,255,255,0.1))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#F0FAFF,#E0F5FF)] text-[var(--color-text-dark)] shadow-inner">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-dark)]">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[var(--color-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
