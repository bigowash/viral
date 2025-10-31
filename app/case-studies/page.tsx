import {
  CaseStudiesSection,
  LandingFooter,
  LandingHeader,
  MidCtaSection
} from '@/components/landing';

export default function CaseStudiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader primaryCta={{ label: 'Join as a Brand', href: '/sign-up', variant: 'sideshift' }} />
      <main className="flex-1">
        <CaseStudiesSection
          title="Campaigns that scaled with SideShift"
          subtitle="From launch campaigns to international expansion, explore how growth teams ship creator-led stories."
        />
        <MidCtaSection
          id="cta"
          title="Launch your own SideShift case study"
          description="Spin up your first creator brief in minutes and see how quickly campaigns come together."
          primaryCta={{ label: 'Start your brief', href: '/sign-up', variant: 'sideshift' }}
          secondaryCta={{ label: 'Talk to Sales', href: '/contact', variant: 'sideshiftLight' }}
          highlightText="Brief templates • Global creators • Instant payouts"
        />
      </main>
      <LandingFooter />
    </div>
  );
}

