type CaseStudy = {
  company: string;
  headline: string;
  description: string;
  metric: string;
};

type CaseStudiesSectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  studies?: CaseStudy[];
};

const defaultStudies: CaseStudy[] = [
  {
    company: 'e-Matura',
    headline: 'Scaled to 11 countries with localized creator content',
    description:
      'SideShift matched e-Matura with education-focused creators in each new market, enabling translated briefs, rapid iteration, and compliant launch kits.',
    metric: '11 markets activated'
  },
  {
    company: 'ViralX',
    headline: 'Expanded its own brand presence to 50 countries in 2 weeks',
    description:
      'A curated roster of on-demand creators produced platform-native assets within days, powering ViralX launch funnels across every region.',
    metric: '50 countries launched'
  },
  {
    company: '&Friends',
    headline: 'Accelerated growth for the new social media startup',
    description:
      'Through SideShift’s managed service, &Friends briefed, approved, and scaled UGC ads that turned early adopters into loyal advocates.',
    metric: '4× faster adoption'
  }
];

export function CaseStudiesSection({
  id = 'case-studies',
  title = 'Case studies built with SideShift',
  subtitle = 'See how growth teams ship international campaigns and creator-led launches.',
  studies = defaultStudies
}: CaseStudiesSectionProps = {}) {
  return (
    <section id={id} className="bg-white py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
            Case Studies
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-3xl text-base text-[var(--color-text-muted)] sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {studies.map((study) => (
            <article
              key={study.company}
              className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-8 text-left shadow-[0_32px_70px_-48px_rgba(16,24,40,0.6)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_42px_90px_-40px_rgba(16,24,40,0.55)]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(224,245,255,0.6),rgba(255,255,255,0.1))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col gap-4">
                <span className="inline-flex w-max items-center rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
                  {study.company}
                </span>
                <h3 className="text-xl font-semibold text-[var(--color-text-dark)]">
                  {study.headline}
                </h3>
                <p className="flex-1 text-base text-[var(--color-text-muted)]">
                  {study.description}
                </p>
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-dark)]">
                  {study.metric}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
