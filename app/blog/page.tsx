import Link from 'next/link';

import {
  LandingFooter,
  LandingHeader
} from '@/components/landing';

const articles = [
  {
    title: 'How brands scale UGC in days, not months',
    excerpt:
      'A behind-the-scenes look at how growth teams use SideShift workflows to launch always-on creator programs.',
    href: '/case-studies'
  },
  {
    title: 'Creator briefs that actually convert',
    excerpt:
      'We break down the creative structure that delivers scroll-stopping videos for Brex, Replit, and more.',
    href: '/docs'
  },
  {
    title: 'From zero to global presence in two weeks',
    excerpt:
      'Inside ViralX’s blitz expansion to 50 countries with SideShift’s managed creator network.',
    href: '/case-studies'
  }
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader />
      <main className="flex-1 bg-white py-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
              Blog
            </span>
            <h1 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
              Field notes from SideShift
            </h1>
            <p className="text-base text-[var(--color-text-muted)] sm:text-lg">
              Playbooks, case studies, and product updates for growth and creator teams.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.title}
                className="flex h-full flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 text-left shadow-[0_24px_60px_-40px_rgba(16,24,40,0.6)] backdrop-blur"
              >
                <h2 className="text-xl font-semibold text-[var(--color-text-dark)]">
                  {article.title}
                </h2>
                <p className="flex-1 text-sm text-[var(--color-text-muted)]">
                  {article.excerpt}
                </p>
                <Link
                  href={article.href}
                  className="text-sm font-semibold text-[var(--color-text-dark)] underline-offset-4 hover:underline"
                >
                  Read more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

