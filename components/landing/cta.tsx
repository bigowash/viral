import Link from 'next/link';

import { Button } from '@/components/ui/button';

type CtaLink = {
  label: string;
  href: string;
  variant?: 'sideshift' | 'sideshiftLight' | 'default';
};

type MidCtaSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  highlightText?: string;
};

const defaultPrimaryCta: CtaLink = {
  label: 'Join as a Brand',
  href: '/sign-up',
  variant: 'sideshift'
};

const defaultSecondaryCta: CtaLink = {
  label: 'Talk to Sales',
  href: '#contact',
  variant: 'sideshiftLight'
};

export function MidCtaSection({
  id = 'pricing',
  title = 'Launch your UGC campaign today',
  description = 'Partner with creators who already love your brand. SideShift handles the heavy lifting so you can focus on creative strategy and growth.',
  primaryCta = defaultPrimaryCta,
  secondaryCta = defaultSecondaryCta,
  highlightText = 'Brief templates • Instant payouts • Hands-on onboarding'
}: MidCtaSectionProps = {}) {
  return (
    <section id={id} className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(circle_at_bottom,rgba(224,245,255,0.65),rgba(255,255,255,0))]" />
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="max-w-3xl text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg">
          {description}
        </p>
        <div className="flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            variant={primaryCta.variant ?? 'sideshift'}
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button
            variant={secondaryCta.variant ?? 'sideshiftLight'}
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
        <div className="relative mt-12 w-full max-w-3xl">
          <div className="relative h-40 w-full overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(135deg,rgba(240,250,255,0.9),rgba(224,245,255,0.65))] shadow-[0_30px_70px_-50px_rgba(16,24,40,0.55)]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27160%27 height=%27160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cdefs%3E%3Cpattern id=%27grid%27 width=%2720%27 height=%2720%27 patternUnits=%27userSpaceOnUse%27%3E%3Cpath d=%27M20 0 H0 V20%27 fill=%27none%27 stroke=%27rgba(255,255,255,0.4)%27 stroke-width=%270.5%27/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27url(%23grid)%27/%3E%3C/svg%3E')] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),rgba(224,245,255,0))]" />
            <div className="relative flex h-full items-center justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
                {highlightText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
