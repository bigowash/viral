import {
  CreatorFeatureSection,
  CreatorHeroSection,
  FAQSection,
  LandingFooter,
  LandingHeader,
  LogoMarquee,
  MetricsSection,
  MidCtaSection,
  TestimonialsSection
} from '@/components/landing';

const creatorNavItems = [
  { label: 'For Brands', href: '/' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Docs', href: '/docs' },
  { label: 'Contact', href: '/contact' }
];

const creatorLogos = [
  'Airbnb',
  'Spotify',
  'Nike',
  'Canva',
  'Duolingo',
  'Adobe',
  'Figma',
  'Shopify',
  'Lululemon',
  'Hims & Hers'
];

const creatorTestimonials = [
  {
    name: 'Darah Emadi',
    role: 'Creator & Aspiring Marketer',
    quote:
      'SideShift has helped prep me for a career in marketing. For anybody that is interested in creating content, social media marketing, or growth roles in the future, I would highly recommend getting signed up on SideShift…'
  },
  {
    name: 'Timmy Koltermann',
    role: 'Creator, $7K+/month',
    quote:
      'Since starting 6 months ago I have been able to work with some incredible brands and grown to $7k+/month. These side hustles not only pay the bills, but give me the flexibility to pursue my dreams.'
  },
  {
    name: 'Lola Kamson',
    role: 'Lifestyle Creator',
    quote:
      'Wow, where do I start…the platform and team are really AMAZING! everyone’s super good at what they do … really appreciate the opportunities I’ve had…'
  },
  {
    name: 'Ayomide Somorin',
    role: 'Student & Creator',
    quote:
      'Working with SideShift has been a blessing… its flexibility lets me focus on school while earning a decent income. I love creating content and working with a kind, supportive team…'
  },
  {
    name: 'Lourdrick Valsote',
    role: 'University Creator',
    quote:
      'SideShift has been a real lifeline for me… I’m confident I wouldn’t have been able to support myself through university this semester without it…'
  },
  {
    name: 'Daniel Grospe',
    role: 'Creator & Student',
    quote:
      'The opportunities I’ve had as a college student have been incredible – from working with startups to billion-dollar companies, SideShift has given me endless chances to prove myself and connect with industry pros.'
  }
];

const creatorFaqs = [
  {
    question: 'How do I sign up as a creator?',
    answer:
      'Create a free SideShift account, complete your profile with your social handles, audience insights, and links to top-performing videos. You can also take the free UGC training course to earn a verified badge and stand out to brands.'
  },
  {
    question: 'Who can join?',
    answer:
      'SideShift is open to creators of every niche and size. Whether you’re just getting started or already working with brands, you can apply if you love producing video-led content and want to collaborate professionally.'
  },
  {
    question: 'What is UGC and how is it different from influencer marketing?',
    answer:
      'UGC (user-generated content) focuses on creating paid content for brands to use in their own channels, ads, and landing pages. You do not need a massive audience—brands care about your creative quality, not just your follower count.'
  },
  {
    question: 'How does SideShift work?',
    answer:
      'Once your profile is approved you’ll receive briefs that match your skills. Apply to the ones you like, deliver content through the SideShift dashboard, and the team handles feedback, contracts, and payouts on your behalf.'
  },
  {
    question: 'Can I work with multiple brands at once?',
    answer:
      'Yes. Many creators manage several briefs simultaneously. Campaign timelines are clearly outlined so you can plan deliverables without feeling overwhelmed.'
  },
  {
    question: 'How quickly can I land my first campaign?',
    answer:
      'Most creators who complete their profiles and upload sample videos see their first brief within days. Taking the free UGC course and earning the verified badge typically accelerates your first booking.'
  },
  {
    question: 'How do payments work?',
    answer:
      'Payments are automated. Once a deliverable is approved, your payout is initiated and sent directly to your preferred account. No invoices, no chasing down finance teams.'
  },
  {
    question: 'Are there platform fees for creators?',
    answer:
      'No. SideShift is free for creators. You keep what you earn—there are no hidden fees or subscription costs to access campaigns.'
  },
  {
    question: 'Do I need to create new social accounts for campaigns?',
    answer:
      'Not at all. Brands typically want content delivered as raw files or posted on your existing accounts. Every brief explains whether it needs to be published or just handed off.'
  },
  {
    question: 'Is it safe to work with brands through SideShift?',
    answer:
      'Yes. SideShift vets every brand, manages contracts, and holds funds until deliverables are approved. You get trusted collaborations without worrying about getting paid.'
  }
];

const creatorFooterNav = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Docs', href: '/docs' },
  { label: 'Contact', href: '/contact' }
];

export default function CreatorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader
        navItems={creatorNavItems}
        secondaryLink={{ label: 'Sign in', href: '/sign-in' }}
        primaryCta={{ label: 'Join as a Creator', href: '/sign-up', variant: 'sideshift' }}
      />
      <main className="flex-1">
        <CreatorHeroSection />
        <LogoMarquee
          id="brands"
          title="Brands you’ll create content for"
          logos={creatorLogos}
        />
        <MetricsSection
          id="stats"
          title="Scale with a community trusted by leading brands"
        />
        <CreatorFeatureSection />
        <TestimonialsSection
          id="testimonials"
          eyebrow="Creator Stories"
          title="Creators building their careers with SideShift"
          description="Hear directly from our community about the work, the payouts, and the support they receive."
          testimonials={creatorTestimonials}
        />
        <MidCtaSection
          id="join"
          title="Ready to create with leading brands?"
          description="Create a free SideShift profile, upload your best work, and start receiving briefs within days."
          primaryCta={{
            label: 'Join as a Creator',
            href: '/sign-up',
            variant: 'sideshift'
          }}
          secondaryCta={{
            label: 'Take the free UGC course',
            href: '#faq',
            variant: 'sideshiftLight'
          }}
          highlightText="Verified badges • Instant briefs • Flexible payouts"
        />
        <FAQSection
          id="faq"
          eyebrow="Creator FAQs"
          title="Everything you need to know"
          items={creatorFaqs}
        />
      </main>
      <LandingFooter navItems={creatorFooterNav} />
    </div>
  );
}
