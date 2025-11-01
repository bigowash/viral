export const landingContent = {
  brand: {
    name: 'Jack & Jill AI',
    tagline: 'The AI recruiters',
    nav: [
      { label: 'Product', href: '#feature-grid' },
      { label: 'Playbooks', href: '#workflow' },
      { label: 'Pricing', href: '/pricing' }
    ],
    ctas: {
      primary: { label: 'Book a session', href: '/sign-up' },
      secondary: { label: 'View pricing', href: '/pricing' }
    }
  },
  hero: {
    eyebrow: 'AI RECRUITERS ON DEMAND',
    headline: {
      leading: "Let Jack scout and Jill close",
      accent: 'unmissable talent',
      trailing: 'before your competition even replies.'
    },
    description:
      'Jack analyses every incoming profile, Jill nurtures the right people, and your team steps in only when a human touch is needed.',
    primaryCta: { label: 'Meet Jack & Jill', href: '/sign-up' },
    secondaryCta: { label: 'See how it works', href: '#feature-grid' },
    stats: [
      { value: '85%', label: 'faster time-to-shortlist' },
      { value: '3×', label: 'higher candidate engagement' },
      { value: '24/7', label: 'conversation coverage' }
    ]
  },
  features: [
    {
      title: 'Conversational screening that feels human',
      description:
        'Jack conducts structured, friendly interviews and captures role-ready scorecards while candidates feel like they are texting a teammate.'
    },
    {
      title: 'Deeply personalised outreach',
      description:
        'Jill writes outreach and follow-ups in your tone of voice, nudging both candidates and hiring managers forward automatically.'
    },
    {
      title: 'One shared recruiting cockpit',
      description:
        'Pipeline progress, transcripts, and insights live in a single workspace so you know exactly when to jump in and close the loop.'
    }
  ],
  workflow: {
    title: 'Talent ops superpowers',
    description:
      'Automate sourcing, screening, and scheduling while still delivering the high-touch candidate experience your brand is known for.',
    bullets: [
      'Syncs with your ATS and calendar in minutes',
      'Understands every job description you publish',
      'Keeps candidates warm with personalised nudges'
    ]
  },
  callToAction: {
    title: 'Ready to hire smarter?',
    description:
      'Bring Jack & Jill AI into your talent stack and watch your recruiting team stay lean, fast, and personal.',
    primaryCta: { label: 'Book a session', href: '/sign-up' },
    secondaryCta: { label: 'Chat with Jack', href: '#hero-chat' }
  },
  terminal: {
    label: 'Jack & Jill in action',
    steps: [
      'Jack · “Scanning inbound applications for growth engineering role…”',
      'Jack · “Shortlisted 14 profiles that match experience + compensation bands.”',
      'Jill · “Drafting personalised outreach for top 5 candidates.”',
      'Jill · “Coordinating availability and sending scheduling links.”',
      'Jack · “Summarising interviews into hiring manager digest.”',
      'Jill · “Nurturing silver medalists for the next opening.”'
    ]
  }
} as const;

export type LandingContent = typeof landingContent;
