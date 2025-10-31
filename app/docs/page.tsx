import {
  FAQSection,
  LandingFooter,
  LandingHeader
} from '@/components/landing';

const docsFaq = [
  {
    question: 'Getting started with SideShift',
    answer:
      'Sign up for a brand or creator account, choose self-serve or managed service, and invite collaborators directly from your dashboard.'
  },
  {
    question: 'Integrations and exports',
    answer:
      'Export approved assets to your ad platforms or download source files. SideShift also connects with leading analytics tools via API.'
  },
  {
    question: 'Security and compliance',
    answer:
      'SOC 2-compliant infrastructure, GDPR-ready workflows, and built-in contract + tax document management for every creator engagement.'
  }
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader />
      <main className="flex-1">
        <section className="bg-white py-24">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
              Docs
            </span>
            <h1 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
              Everything you need to run creator programs
            </h1>
            <p className="text-base text-[var(--color-text-muted)] sm:text-lg">
              Browse implementation guides, integrations, and best practices for SideShift teams.
            </p>
          </div>
        </section>
        <FAQSection
          items={docsFaq}
          eyebrow="Documentation"
          title="Popular topics"
        />
      </main>
      <LandingFooter />
    </div>
  );
}

