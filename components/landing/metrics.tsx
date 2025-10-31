const metrics = [
  {
    stat: '500,000+',
    label: 'Creators',
    description: 'Already onboarded'
  },
  {
    stat: '1,000+',
    label: 'Brands',
    description: 'Actively hiring'
  },
  {
    stat: '5B+',
    label: 'Views',
    description: 'Delivered last 90 days'
  },
  {
    stat: '$100M+',
    label: 'Paid Out',
    description: 'To creators seamlessly'
  }
];

export function MetricsSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#E0F5FF_0%,#FFFFFF_60%)] py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(224,245,255,0.75),rgba(255,255,255,0.8))]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
          Numbers that power every campaign
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.stat}
              className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_30px_70px_-45px_rgba(16,24,40,0.65)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_40px_90px_-40px_rgba(16,24,40,0.55)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(224,245,255,0.6),rgba(255,255,255,0))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-4xl font-bold text-[var(--color-text-dark)]">
                  {metric.stat}
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
                  {metric.label}
                </span>
                <p className="text-base text-[var(--color-text-muted)]">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
