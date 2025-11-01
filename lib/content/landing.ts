export const landingContent = {
  brand: {
    name: 'SideShift',
    tagline: 'The growth engine for creators & brands',
    nav: [
      { label: 'Overview', href: '#hero' },
      { label: 'Metrics', href: '#metrics' },
      { label: 'Platform', href: '#platform' },
      { label: 'Stories', href: '#testimonials' }
    ],
    ctas: {
      primary: { label: 'Join as a brand', href: '/sign-up?type=brand' },
      secondary: { label: 'Join as a creator', href: '/sign-up?type=creator' }
    },
    toggle: [
      { label: 'Brands', href: '/sign-up?type=brand', active: true },
      { label: 'Creators', href: '/sign-up?type=creator', active: false }
    ],
    secondaryLinks: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Case Studies', href: '/casestudies' },
      { label: 'Blog', href: '/blog' },
      { label: 'Docs', href: '/docs' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  hero: {
    eyebrow: 'UGC THAT PERFORMS',
    headline: {
      leading: 'The Growth Engine for',
      accent: 'Creators & Brands.',
      trailing: 'Work with top creators at scale while SideShift handles vetting, contracts, and payouts.'
    },
    description:
      'Join campaigns that actually convert. We source, manage, and pay creators so your team ships more authentic content without extra headcount.',
    primaryCta: { label: 'Join as a brand', href: '/sign-up?type=brand' },
    secondaryCta: { label: 'View case studies', href: '/case-studies' },
    stats: [
      { value: '500,000+', label: 'creators already onboarded' },
      { value: '1,000+', label: 'brands actively hiring' },
      { value: '5B+', label: 'organic views last 90 days' },
      { value: '$100M+', label: 'paid out to creators' }
    ]
  },
  platform: {
    eyebrow: 'ONE PLATFORM, ENDLESS CAMPAIGNS',
    title: 'One platform for every UGC campaign',
    description:
      'SideShift centralises the workflows that keep campaigns moving—from applications to approvals to performance reporting.',
    features: [
      {
        title: 'Source Creators',
        description:
          'Reach thousands of vetted, on-brief creators instantly with filters for niche, platform, and performance.'
      },
      {
        title: 'Track Performance',
        description:
          'Monitor content views, engagement, and conversions in real time so you know exactly what is resonating.'
      },
      {
        title: 'Automate Payments',
        description:
          'Handle payouts, contracts, and tax paperwork without spreadsheets or manual chasing.'
      },
      {
        title: 'Manage Creators',
        description:
          'Organise rosters, share briefs, and collaborate on deliverables inside one shared dashboard.'
      }
    ]
  },
  workflow: {
    eyebrow: 'HOW IT WORKS',
    title: 'Launch your next campaign in three moves',
    description:
      'SideShift keeps collaborations moving with structured briefs, on-call producers, and sharing tools built for short-form content.',
    steps: [
      {
        label: '01',
        title: 'Post a brief',
        description:
          'Create a SideShift opportunity and instantly reach Gen Z UGC creators who match your voice and budget.'
      },
      {
        label: '02',
        title: 'Review & approve',
        description:
          'Collaborate on concepts, shot lists, and drafts with SideShift producers guiding every step.'
      },
      {
        label: '03',
        title: 'Publish & scale',
        description:
          'Receive ready-to-post edits, push them live across channels, and capture performance insights automatically.'
      }
    ],
    supportingCta: { label: 'Talk to the team', href: '/contact' }
  },
  testimonials: {
    eyebrow: 'BRANDS LOVE SIDESHIFT',
    title: 'Trusted by teams shipping Gen Z content',
    quotes: [
      {
        quote:
          'The applicants have been super high quality—unlike any platform I have used in the past.',
        name: 'Luis Ocampo',
        role: 'Founding Team, Partiful'
      },
      {
        quote:
          'We were able to fill 100% of our creator hiring needs in just a few weeks. SideShift is a cemented go-to whenever we need creators.',
        name: 'Edward Tian',
        role: 'Founder, GPTZero'
      },
      {
        quote:
          'SideShift helped unlock a new layer of growth that traditional paid channels never could.',
        name: 'Henrique Dubugras',
        role: 'Founding CEO @ Brex'
      }
    ]
  },
  backers: {
    title: 'Backed by investors, scientists, and engineers from',
    logos: [
      '/assets/logo/cleo_logo.png',
      '/assets/logo/ef_logo.png',
      '/assets/logo/ematura_logo.png',
      '/assets/logo/imperial_logo.png',
      '/assets/logo/lbs_logo.png'
    ]
  },
  callToAction: {
    title: 'Launch your UGC campaign today',
    description:
      'Create a free SideShift account, post your first opportunity, and start collaborating with top-tier creators within minutes.',
    primaryCta: { label: 'Join as a brand', href: '/sign-up?type=brand' },
    secondaryCta: {
      label: 'Join as a creator',
      href: '/sign-up?type=creator'
    }
  },
  terminal: {
    label: 'Campaign control room',
    steps: [
      'Brand · “Brief published — inviting lifestyle creators with 5%+ CTR.”',
      'SideShift Producer · “Screened 42 applicants and shortlisted 9 top fits.”',
      'Creator · “Concept deck uploaded with hooks and draft scripts.”',
      'SideShift Producer · “Edits approved, delivering final cuts + captions.”',
      'Brand · “Publishing assets and routing to paid + organic channels.”',
      'SideShift Producer · “Performance dashboard updated with ROAS lift.”'
    ]
  }
} as const;

export type LandingContent = typeof landingContent;
