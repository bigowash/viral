'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Terminal } from '@/app/[locale]/(dashboard)/terminal';
import { theme } from '@/lib/theme';
import { withLocale } from '@/lib/i18n/locale-link';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { landingContent } from '@/lib/content/landing';

const { palette, gradients } = theme;

interface LandingPageTranslations {
  hero: {
    brand: {
      eyebrow: string;
      headline: {
        leading: string;
        accent: string;
        trailing: string;
      };
      description: string;
      primaryCta: string;
      secondaryCta: string;
      stats: {
        creatorsOnboarded: string;
        brandsHiring: string;
        organicViews: string;
        paidOut: string;
      };
    };
    creator: {
      eyebrow: string;
      headline: {
        leading: string;
        accent: string;
        trailing: string;
      };
      description: string;
      primaryCta: string;
      secondaryCta: string;
      stats: {
        activeCreators: string;
        paidToCreators: string;
        viewsGenerated: string;
        newCampaigns: string;
      };
    };
  };
  platform: {
    brand: {
      eyebrow: string;
      title: string;
      description: string;
      features: {
        sourceCreators: { title: string; description: string };
        trackPerformance: { title: string; description: string };
        automatePayments: { title: string; description: string };
        manageCreators: { title: string; description: string };
      };
    };
    creator: {
      eyebrow: string;
      title: string;
      description: string;
      features: {
        findCampaigns: { title: string; description: string };
        postVideos: { title: string; description: string };
        getPaidFast: { title: string; description: string };
        trackEarnings: { title: string; description: string };
      };
    };
  };
  workflow: {
    brand: {
      eyebrow: string;
      title: string;
      description: string;
      steps: {
        step1: { label: string; title: string; description: string };
        step2: { label: string; title: string; description: string };
        step3: { label: string; title: string; description: string };
      };
      supportingCta: string;
    };
    creator: {
      eyebrow: string;
      title: string;
      description: string;
      steps: {
        step1: { label: string; title: string; description: string };
        step2: { label: string; title: string; description: string };
        step3: { label: string; title: string; description: string };
      };
      supportingCta: string;
    };
  };
  testimonials: {
    brand: {
      eyebrow: string;
      title: string;
      quotes: {
        quote1: { quote: string; name: string; role: string };
        quote2: { quote: string; name: string; role: string };
        quote3: { quote: string; name: string; role: string };
      };
    };
    creator: {
      eyebrow: string;
      title: string;
      quotes: {
        quote1: { quote: string; name: string; role: string };
        quote2: { quote: string; name: string; role: string };
        quote3: { quote: string; name: string; role: string };
      };
    };
  };
  backers: {
    title: string;
  };
  callToAction: {
    brand: {
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
    creator: {
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
  terminal: {
    label: string;
    steps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
    };
  };
}

export function LandingPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const view = searchParams.get('view') || 'brand';
  const isCreatorView = view === 'creator';
  const t = useComponentTranslations<LandingPageTranslations>('LandingPage');

  if (!t) return null;

  const hero = isCreatorView ? t.hero.creator : t.hero.brand;
  const platform = isCreatorView ? t.platform.creator : t.platform.brand;
  const workflow = isCreatorView ? t.workflow.creator : t.workflow.brand;
  const testimonials = isCreatorView ? t.testimonials.creator : t.testimonials.brand;
  const callToAction = isCreatorView ? t.callToAction.creator : t.callToAction.brand;
  const { backers, terminal } = landingContent;

  // Map stats for brand view
  const brandStats = [
    { value: '500,000+', label: t.hero.brand.stats.creatorsOnboarded },
    { value: '1,000+', label: t.hero.brand.stats.brandsHiring },
    { value: '5B+', label: t.hero.brand.stats.organicViews },
    { value: '$100M+', label: t.hero.brand.stats.paidOut }
  ];

  // Map stats for creator view
  const creatorStats = [
    { value: '500,000+', label: t.hero.creator.stats.activeCreators },
    { value: '$100M+', label: t.hero.creator.stats.paidToCreators },
    { value: '5B+', label: t.hero.creator.stats.viewsGenerated },
    { value: '100+', label: t.hero.creator.stats.newCampaigns }
  ];

  const stats = isCreatorView ? creatorStats : brandStats;

  // Map platform features
  const platformFeatures = isCreatorView
    ? [
        t.platform.creator.features.findCampaigns,
        t.platform.creator.features.postVideos,
        t.platform.creator.features.getPaidFast,
        t.platform.creator.features.trackEarnings
      ]
    : [
        t.platform.brand.features.sourceCreators,
        t.platform.brand.features.trackPerformance,
        t.platform.brand.features.automatePayments,
        t.platform.brand.features.manageCreators
      ];

  // Map workflow steps
  const workflowSteps = [
    workflow.steps.step1,
    workflow.steps.step2,
    workflow.steps.step3
  ];

  // Map testimonials quotes
  const quotes = [
    testimonials.quotes.quote1,
    testimonials.quotes.quote2,
    testimonials.quotes.quote3
  ];

  // Map terminal steps
  const terminalSteps = [
    t.terminal.steps.step1,
    t.terminal.steps.step2,
    t.terminal.steps.step3,
    t.terminal.steps.step4,
    t.terminal.steps.step5,
    t.terminal.steps.step6
  ];

  return (
    <main
      style={{
        backgroundColor: palette.background,
        color: palette.textPrimary
      }}
    >
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ background: gradients.soft }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
          <div className="flex flex-col items-center gap-12 text-center">
            <p
              className="text-xs font-heading uppercase tracking-[0.32em]"
              style={{ color: palette.textSecondary }}
            >
              {hero.eyebrow}
            </p>
            <h1 className="max-w-3xl text-[2.75rem] font-heading leading-[1.05] sm:text-[3.25rem] md:text-[3.75rem]">
              {hero.headline.leading}{' '}
              <span
                className="font-accent italic"
                style={{ color: palette.accent }}
              >
                {hero.headline.accent}
              </span>
              <span className="block mt-4 text-[1.25rem] font-normal not-italic leading-[1.6] sm:text-[1.35rem]">
                {hero.headline.trailing}
              </span>
            </h1>
            <p
              className="max-w-2xl text-lg sm:text-xl"
              style={{ color: palette.textSecondary }}
            >
              {hero.description}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 py-3 text-sm font-heading font-semibold uppercase tracking-[0.2em]"
              >
                <Link href={withLocale(isCreatorView ? '/sign-up?type=creator' : '/sign-up?type=brand', locale as any)}>
                  {hero.primaryCta}
                </Link>
              </Button>
              <Link
                href={withLocale('/case-studies', locale as any)}
                className="flex items-center gap-2 text-sm font-heading uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
                style={{ color: palette.textPrimary }}
              >
                {hero.secondaryCta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul
              id="metrics"
              className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <li
                  key={index}
                  className="rounded-[28px] border px-6 py-6 text-left shadow-sm"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: palette.surface
                  }}
                >
                  <p
                    className="text-2xl font-heading"
                    style={{ color: palette.textPrimary }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-3 text-xs font-heading uppercase tracking-[0.18em]"
                    style={{ color: palette.textSecondary }}
                  >
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-24 h-48"
          style={{
            background: gradients.accent,
            opacity: 0.25
          }}
        />
      </section>

      <section
        id="platform"
        className="py-24"
        style={{ backgroundColor: palette.background }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <p
              className="text-xs font-heading uppercase tracking-[0.32em]"
              style={{ color: palette.textSecondary }}
            >
              {platform.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-heading sm:text-4xl">
              {platform.title}
            </h2>
            <p
              className="mt-4 text-base sm:text-lg"
              style={{ color: palette.textSecondary }}
            >
              {platform.description}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {platformFeatures.map((feature, index) => (
              <article
                key={index}
                className="flex h-full flex-col justify-between rounded-[32px] border px-6 py-8 shadow-sm transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  boxShadow: palette.shadow
                }}
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-heading" style={{ color: palette.textPrimary }}>
                    {feature.title}
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: palette.textSecondary }}
                  >
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="py-24"
        style={{ backgroundColor: palette.surface }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="space-y-6">
            <p
              className="text-xs font-heading uppercase tracking-[0.32em]"
              style={{ color: palette.textSecondary }}
            >
              {workflow.eyebrow}
            </p>
            <h2 className="text-3xl font-heading sm:text-4xl">
              {workflow.title}
            </h2>
            <p
              className="text-base sm:text-lg"
              style={{ color: palette.textSecondary }}
            >
              {workflow.description}
            </p>
            {workflow.supportingCta && (
              <Link
                href={withLocale(isCreatorView ? '/campaigns' : '/contact', locale as any)}
                className="inline-flex items-center gap-2 text-sm font-heading uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
                style={{ color: palette.textPrimary }}
              >
                {workflow.supportingCta}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-5 rounded-[28px] border px-6 py-6"
                style={{
                  backgroundColor: palette.surfaceMuted,
                  borderColor: palette.border
                }}
              >
                <span
                  className="mt-1 text-sm font-heading uppercase tracking-[0.25em]"
                  style={{ color: palette.textSecondary }}
                >
                  {step.label}
                </span>
                <div className="space-y-2 text-left">
                  <h3
                    className="text-lg font-heading"
                    style={{ color: palette.textPrimary }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: palette.textSecondary }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: palette.background }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="relative">
            <div
              className="absolute inset-0 -translate-x-10 translate-y-10 rounded-[48px] blur-3xl"
              style={{
                background: gradients.accent,
                opacity: 0.4
              }}
            />
            <Terminal label={t.terminal.label} steps={terminalSteps} />
          </div>
          <div className="space-y-6">
            <p
              className="text-xs font-heading uppercase tracking-[0.32em]"
              style={{ color: palette.textSecondary }}
            >
              {testimonials.eyebrow}
            </p>
            <h2 className="text-3xl font-heading sm:text-4xl">
              {testimonials.title}
            </h2>
            <div className="space-y-6">
              {quotes.map((quote, index) => (
                <figure
                  key={index}
                  className="rounded-[28px] border px-6 py-6 shadow-sm"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: palette.surface
                  }}
                >
                  <blockquote
                    className="text-base leading-relaxed"
                    style={{ color: palette.textPrimary }}
                  >
                    "{quote.quote}"
                  </blockquote>
                  <figcaption
                    className="mt-4 text-xs font-heading uppercase tracking-[0.2em]"
                    style={{ color: palette.textSecondary }}
                  >
                    {quote.name} · {quote.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="backers"
        className="py-24"
        style={{ backgroundColor: palette.background }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-heading sm:text-3xl">
              {t.backers.title}
            </h2>
            <div className="mt-12 flex flex-nowrap items-center justify-between">
              {backers.logos.length > 0 ? (
                backers.logos.map((logo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center opacity-100 transition-opacity hover:opacity-60"
                  >
                    {typeof logo === 'string' ? (
                      <Image
                        src={logo}
                        alt={`Backer logo ${index + 1}`}
                        width={180}
                        height={60}
                        className="h-16 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm" style={{ color: palette.textSecondary }}>
                        Logo {index + 1}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: palette.textSecondary }}>
                  Logos will be displayed here
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="py-24"
        style={{ backgroundColor: palette.background }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[40px] px-6 py-12 text-center sm:px-10 md:px-16 md:py-16"
            style={{
              background: gradients.accent,
              border: `1px solid ${palette.border}`
            }}
          >
            <h2 className="text-3xl font-heading sm:text-4xl">
              {callToAction.title}
            </h2>
            <p
              className="mt-6 text-base sm:text-lg"
              style={{ color: palette.textSecondary }}
            >
              {callToAction.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-3 text-sm font-heading font-semibold uppercase tracking-[0.2em]"
              >
                <Link href={withLocale(isCreatorView ? '/sign-up?type=creator' : '/sign-up?type=brand', locale as any)}>
                  {callToAction.primaryCta}
                </Link>
              </Button>
              <Link
                href={withLocale(isCreatorView ? '/how-it-works' : '/sign-up?type=creator', locale as any)}
                className="flex items-center gap-2 text-sm font-heading uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
                style={{ color: palette.textPrimary }}
              >
                {callToAction.secondaryCta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
