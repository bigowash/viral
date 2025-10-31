import {
  CaseStudiesSection,
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

const brandTestimonials = [
  {
    name: 'Luis Ocampo',
    role: 'Founding Team @ Partiful',
    quote:
      "The applicants have been super high quality! Unlike any platform I've used in the past."
  },
  {
    name: 'Edward Tian',
    role: 'Founder @ GPTZero',
    quote:
      'We filled 100% of our creator hiring needs in just a few weeks through the platform.'
  },
  {
    name: 'Evan Dray',
    role: 'Co-Founder @ Astra',
    quote:
      'We had no luck with traditional platforms… SideShift became our go-to.'
  },
  {
    name: 'Jeremy Gross',
    role: 'Head of US Growth @ Amo',
    quote:
      'Geared toward Gen Z, SideShift delivers better response rates and quality than LinkedIn.'
  },
  {
    name: 'Horacio Lopez',
    role: 'Revenue Ops @ Replit',
    quote:
      'SideShift enabled organic content distribution that turned into real traction.'
  },
  {
    name: 'Henrique Dubugras',
    role: 'Founding CEO @ Brex',
    quote:
      'Their creator network unlocked growth that paid channels never could.'
  }
];

const brandFaqs = [
  {
    question: 'How do I get started?',
    answer:
      'Create a SideShift brand account, share your brief, and our team will surface the best creators for the campaign. You can launch on your own or partner with our managed team.'
  },
  {
    question: 'Does SideShift cost money?',
    answer:
      'Pricing is transparent: choose between self-serve software fees or a managed service plan. Only pay for the creators you activate.'
  },
  {
    question: 'Who is SideShift built for?',
    answer:
      'High-growth brands, agencies, and marketplaces that need repeatable UGC at scale. Whether you’re launching, growing, or expanding channels, SideShift fits your workflow.'
  },
  {
    question: 'What creators are on SideShift?',
    answer:
      'A vetted network of 500,000+ creators across every major vertical—TikTok, YouTube, Instagram, and more—with performance data, demographics, and past work.'
  },
  {
    question: 'UGC vs. Influencer Marketing — what’s the difference?',
    answer:
      'UGC focuses on creators producing content for your brand to use in ads, landing pages, and owned channels. Influencer marketing centers on creators posting to their own audiences. SideShift covers both.'
  },
  {
    question: 'What should I expect & how is success measured?',
    answer:
      'Every campaign includes creative briefs, content approvals, and performance dashboards so you can track views, conversions, and ROI in real time.'
  },
  {
    question: 'Self-serve vs. Managed Service — what’s the difference?',
    answer:
      'Self-serve gives your team the tools to run campaigns end-to-end. Managed adds a dedicated SideShift producer who handles sourcing, briefs, feedback, and delivery for you.'
  },
  {
    question: 'How fast can I hire creators?',
    answer:
      'Most brands receive shortlists within 48 hours and ship initial assets within a week. Managed campaigns can move even faster.'
  },
  {
    question: 'How are payments and contracts managed?',
    answer:
      'SideShift handles all contracts, tax forms, and payouts automatically—one invoice for your finance team, on-time payments for every creator.'
  },
  {
    question: 'How can I track creator performance?',
    answer:
      'Dashboards show the content in production, live performance, and attribution so you always know which creators drive the best results.'
  }
];

const footerNav = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '#testimonials' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Docs', href: '#faq' },
  { label: 'Contact', href: '#contact' }
];

const brandLogos = [
  'Brex',
  'Replit',
  'Amo',
  'Partiful',
  'GPTZero',
  'Astra',
  'Linear',
  'Ramp',
  'Canva',
  'Notion'
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader
        primaryCta={{ label: 'Join as a Brand', href: '/sign-up', variant: 'sideshift' }}
      />
      <main className="flex-1">
        <HeroSection />
        <LogoMarquee title="Trusted By Top Brands Worldwide" logos={brandLogos} />
        <CaseStudiesSection />
        <MetricsSection />
        <FeatureSection
          eyebrow="How SideShift Works for Brands"
          title="One Platform for All Your UGC Campaigns"
          description="Source creators, brief campaigns, approve content, and automate payouts from a single dashboard."
        />
        <TestimonialsSection
          testimonials={brandTestimonials}
          eyebrow="Testimonials"
          title="Brands growing faster with SideShift"
          description="Hear how leading teams unlock creator-led growth across every channel."
        />
        <MidCtaSection
          id="contact"
          title="Launch Your UGC Campaign Today"
          description="Join thousands of brands running always-on creator programs with SideShift."
          primaryCta={{
            label: 'Join as a Brand',
            href: '/sign-up',
            variant: 'sideshift'
          }}
          secondaryCta={{
            label: 'See Case Studies',
            href: '/case-studies',
            variant: 'sideshiftLight'
          }}
          highlightText="Creator sourcing • Brief templates • Instant payouts"
        />
        <FAQSection
          items={brandFaqs}
          eyebrow="Brand FAQs"
          title="Answers for growth and marketing teams"
        />
      </main>
      <LandingFooter navItems={footerNav} />
    </div>
  );
}
