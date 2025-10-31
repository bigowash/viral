import {
  FAQSection,
  FeatureSection,
  HeroSection,
  LandingFooter,
  LandingHeader,
  LogoMarquee,
  MetricsSection,
  MidCtaSection,
  TestimonialsSection
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <LogoMarquee />
        <MetricsSection />
        <FeatureSection />
        <TestimonialsSection />
        <MidCtaSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
