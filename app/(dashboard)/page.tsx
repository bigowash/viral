import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Terminal } from './terminal';
import { landingContent } from '@/lib/content/landing';
import { theme } from '@/lib/theme';

const { hero, features, workflow, callToAction, terminal } = landingContent;
const { palette, gradients } = theme;

export default function HomePage() {
  return (
    <main
      style={{
        backgroundColor: palette.background,
        color: palette.textPrimary
      }}
    >
      <section
        id="hero-chat"
        className="relative overflow-hidden"
        style={{ background: gradients.soft }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid items-start gap-16 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-10">
              <p
                className="text-xs font-heading uppercase tracking-[0.32em]"
                style={{ color: palette.textSecondary }}
              >
                {hero.eyebrow}
              </p>
              <h1 className="text-4xl font-heading leading-tight sm:text-5xl lg:text-6xl">
                {hero.headline.leading}{' '}
                <span
                  className="font-accent italic"
                  style={{ color: palette.accent }}
                >
                  {hero.headline.accent}
                </span>{' '}
                {hero.headline.trailing}
              </h1>
              <p
                className="text-lg sm:text-xl"
                style={{ color: palette.textSecondary }}
              >
                {hero.description}
              </p>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-3 text-sm font-heading font-semibold uppercase tracking-[0.2em]"
                >
                  <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
                </Button>
                <Link
                  href={hero.secondaryCta.href}
                  className="flex items-center gap-2 text-sm font-heading uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
                  style={{ color: palette.textPrimary }}
                >
                  {hero.secondaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <ul className="grid gap-6 sm:grid-cols-3">
                {hero.stats.map((stat) => (
                  <li
                    key={stat.label}
                    className="rounded-[32px] border p-6"
                    style={{
                      borderColor: palette.border,
                      backgroundColor: palette.surface
                    }}
                  >
                    <p
                      className="text-3xl font-heading"
                      style={{ color: palette.textPrimary }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="mt-3 text-xs font-heading uppercase tracking-[0.2em]"
                      style={{ color: palette.textSecondary }}
                    >
                      {stat.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 -translate-x-10 translate-y-10 rounded-[48px] blur-3xl"
                style={{
                  background: gradients.accent,
                  opacity: 0.55
                }}
              />
              <Terminal label={terminal.label} steps={terminal.steps} />
            </div>
          </div>
        </div>
      </section>

      <section
        id="feature-grid"
        className="py-20"
        style={{ backgroundColor: palette.background }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex h-full flex-col rounded-[32px] border p-8 shadow-sm transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  boxShadow: palette.shadow
                }}
              >
                <h3
                  className="text-2xl font-heading leading-snug"
                  style={{ color: palette.textPrimary }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-4 text-base"
                  style={{ color: palette.textSecondary }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="py-20"
        style={{ backgroundColor: palette.surface }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[40px] border px-6 py-10 sm:px-10 md:px-16 md:py-16"
            style={{
              backgroundColor: palette.surfaceMuted,
              borderColor: palette.border
            }}
          >
            <div className="max-w-2xl space-y-6">
              <p
                className="text-xs font-heading uppercase tracking-[0.32em]"
                style={{ color: palette.textSecondary }}
              >
                {workflow.title}
              </p>
              <h2 className="text-3xl font-heading sm:text-4xl">
                {workflow.description}
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {workflow.bullets.map((item) => (
                <li
                  key={item}
                  className="rounded-3xl border px-6 py-5 text-sm font-heading uppercase tracking-[0.18em]"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: palette.surface
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
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
            <p
              className="text-xs font-heading uppercase tracking-[0.32em]"
              style={{ color: palette.textSecondary }}
            >
              {callToAction.title}
            </p>
            <h2 className="mt-6 text-3xl font-heading sm:text-4xl">
              {callToAction.description}
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-3 text-sm font-heading font-semibold uppercase tracking-[0.2em]"
              >
                <Link href={callToAction.primaryCta.href}>
                  {callToAction.primaryCta.label}
                </Link>
              </Button>
              <Link
                href={callToAction.secondaryCta.href}
                className="flex items-center gap-2 text-sm font-heading uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
                style={{ color: palette.textPrimary }}
              >
                {callToAction.secondaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
