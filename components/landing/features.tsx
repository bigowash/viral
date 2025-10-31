import {
  BarChart3,
  Sparkles,
  Users2,
  Wallet2
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Source Creators',
    description: 'Reach thousands of creators instantly with precision filters.'
  },
  {
    icon: BarChart3,
    title: 'Track Performance',
    description:
      'See content, views, engagement, and conversions in real-time dashboards.'
  },
  {
    icon: Wallet2,
    title: 'Automate Payments',
    description:
      'Handle payouts, invoices, and tax paperwork without manual effort.'
  },
  {
    icon: Users2,
    title: 'Manage Creators',
    description:
      'Organize your roster, collaborate securely, and scale campaigns seamlessly.'
  }
];

export function FeatureSection() {
  return (
    <section
      id="case-studies"
      className="bg-white py-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
            One Platform
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
            One platform for all your UGC campaigns
          </h2>
          <p className="max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg">
            Every workflow in one place—source, brief, collaborate, approve, and
            pay creators without spreadsheets or backlog.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => {
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
