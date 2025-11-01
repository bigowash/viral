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
      { label: 'Brands', href: '/?view=brand', active: true },
      { label: 'Creators', href: '/?view=creator', active: false }
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
    brand: {
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
    creator: {
      eyebrow: 'GET PAID FOR YOUR CONTENT',
      headline: {
        leading: 'Want to post videos',
        accent: 'and get paid?',
        trailing: 'Join thousands of creators earning money by creating authentic content for top brands.'
      },
      description:
        'Apply to campaigns that match your style, create videos you're proud of, and get paid quickly. SideShift connects you with brands who value your creativity.',
      primaryCta: { label: 'Join as a creator', href: '/sign-up?type=creator' },
      secondaryCta: { label: 'View creator stories', href: '/case-studies' },
      stats: [
        { value: '500,000+', label: 'active creators' },
        { value: '$100M+', label: 'paid to creators' },
        { value: '5B+', label: 'views generated' },
        { value: '100+', label: 'new campaigns weekly' }
      ]
    }
  },
  platform: {
    brand: {
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
    creator: {
      eyebrow: 'EVERYTHING YOU NEED TO SUCCEED',
      title: 'Your toolkit for creating content that gets paid',
      description:
        'From finding the right campaigns to getting paid fast, SideShift gives creators everything needed to turn content into income.',
      features: [
        {
          title: 'Find Campaigns',
          description:
            'Browse hundreds of campaigns from top brands looking for creators like you. Filter by niche, platform, and payout amount.'
        },
        {
          title: 'Post Videos',
          description:
            'Create and upload your videos directly on SideShift. Our platform makes it easy to submit your best work and get approved fast.'
        },
        {
          title: 'Get Paid Fast',
          description:
            'Receive payments quickly and securely. We handle all the paperwork so you can focus on creating great content.'
        },
        {
          title: 'Track Earnings',
          description:
            'Monitor your earnings, view campaign performance, and see which content types pay the most in your dashboard.'
        }
      ]
    }
  },
  workflow: {
    brand: {
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
    creator: {
      eyebrow: 'HOW IT WORKS',
      title: 'Start earning in three simple steps',
      description:
        'From applying to getting paid, SideShift makes it easy for creators to turn their passion into profit.',
      steps: [
        {
          label: '01',
          title: 'Apply to campaigns',
          description:
            'Browse available campaigns and apply to ones that match your style and niche. Show brands what makes your content special.'
        },
        {
          label: '02',
          title: 'Create & post videos',
          description:
            'Once approved, create authentic videos that showcase the brand. Upload your content directly through our platform and get feedback fast.'
        },
        {
          label: '03',
          title: 'Get paid',
          description:
            'After your content is approved and published, receive payments quickly and securely. Track all your earnings in one place.'
        }
      ],
      supportingCta: { label: 'View available campaigns', href: '/campaigns' }
    }
  },
  testimonials: {
    brand: {
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
    creator: {
      eyebrow: 'CREATORS LOVE SIDESHIFT',
      title: 'Join creators earning with their content',
      quotes: [
        {
          quote:
            'I've earned over $10k in my first month. The campaigns are legit and pay on time. This is the best platform for creators.',
          name: 'Sarah Chen',
          role: 'Lifestyle Creator, 250K followers'
        },
        {
          quote:
            'SideShift makes it so easy to find campaigns and post videos. I can focus on creating instead of chasing payments.',
          name: 'Marcus Johnson',
          role: 'Tech Creator, 180K followers'
        },
        {
          quote:
            'The variety of campaigns is amazing. I can pick projects that actually align with my brand and my audience loves.',
          name: 'Emma Rodriguez',
          role: 'Fashion Creator, 320K followers'
        }
      ]
    }
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
    brand: {
      title: 'Launch your UGC campaign today',
      description:
        'Create a free SideShift account, post your first opportunity, and start collaborating with top-tier creators within minutes.',
      primaryCta: { label: 'Join as a brand', href: '/sign-up?type=brand' },
      secondaryCta: {
        label: 'Join as a creator',
        href: '/sign-up?type=creator'
      }
    },
    creator: {
      title: 'Start earning with your content today',
      description:
        'Create a free creator account, browse available campaigns, and start posting videos that get paid. Join thousands of creators already earning.',
      primaryCta: { label: 'Join as a creator', href: '/sign-up?type=creator' },
      secondaryCta: {
        label: 'Learn more',
        href: '/how-it-works'
      }
    }
  },
  terminal: {
    label: 'Campaign control room',
    steps: [
      'Brand · "Brief published — inviting lifestyle creators with 5%+ CTR."',
      'SideShift Producer · "Screened 42 applicants and shortlisted 9 top fits."',
      'Creator · "Concept deck uploaded with hooks and draft scripts."',
      'SideShift Producer · "Edits approved, delivering final cuts + captions."',
      'Brand · "Publishing assets and routing to paid + organic channels."',
      'SideShift Producer · "Performance dashboard updated with ROAS lift."'
    ]
  }
} as const;

export type LandingContent = typeof landingContent;
