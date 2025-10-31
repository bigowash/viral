'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const toggleOptions = ['Brands', 'Creators'] as const;

export function HeroSection() {
  const router = useRouter();
  const [activeOption, setActiveOption] =
    useState<(typeof toggleOptions)[number]>('Brands');

  const indicatorTransform = useMemo(
    () => ({
      transform: `translateX(${activeOption === 'Brands' ? 0 : 100}%)`
    }),
    [activeOption]
  );

  function handleToggle(option: (typeof toggleOptions)[number]) {
    if (option === activeOption) {
      return;
    }

    setActiveOption(option);
    if (option === 'Creators') {
      router.push('/creators');
    }
  }

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-20 sm:pt-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(224,245,255,0.55)_40%,rgba(255,255,255,0.85)_100%)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#C4E7FF_0%,rgba(196,231,255,0)_70%)] blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] shadow-sm backdrop-blur">
              <span className="inline-flex size-2 rounded-full bg-emerald-400" />
              New in 2025
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative inline-flex max-w-max items-center gap-2 rounded-full border border-white/60 bg-[var(--color-bg-light)] p-1 text-base font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                <span
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_14px_30px_-18px_rgba(16,24,40,0.45)] transition-transform duration-300 ease-out"
                  aria-hidden
                  style={indicatorTransform}
                />
                {toggleOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleToggle(option)}
                    aria-pressed={activeOption === option}
                    className={`relative z-10 inline-flex min-w-[120px] items-center justify-center px-5 py-2 transition-colors ${
                      activeOption === option
                        ? 'text-[var(--color-text-dark)]'
                        : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <h1 className="text-4xl font-bold leading-tight text-[var(--color-text-dark)] sm:text-5xl lg:text-6xl xl:text-7xl">
                The Growth Engine for Creators
              </h1>
            </div>
            <p className="max-w-xl text-lg text-[var(--color-text-muted)] sm:text-xl">
              Work with the top creators at scale, while SideShift handles
              vetting, contracts, and payouts for you. Launch campaigns in days—not months.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="sideshift"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/sign-up">Join as a Brand</Link>
            </Button>
            <Button
              variant="sideshiftLight"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/case-studies">Case Studies</Link>
            </Button>
          </div>
          <dl className="grid max-w-lg grid-cols-2 gap-6 pt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:grid-cols-4">
            <div>
              <dt className="text-[11px]">Creators</dt>
              <dd className="mt-1 text-lg text-[var(--color-text-dark)]">
                500,000+
              </dd>
            </div>
            <div>
              <dt className="text-[11px]">Brands</dt>
              <dd className="mt-1 text-lg text-[var(--color-text-dark)]">
                1,000+
              </dd>
            </div>
            <div>
              <dt className="text-[11px]">Views</dt>
              <dd className="mt-1 text-lg text-[var(--color-text-dark)]">
                5B+
              </dd>
            </div>
            <div>
              <dt className="text-[11px]">Paid Out</dt>
              <dd className="mt-1 text-lg text-[var(--color-text-dark)]">
                $100M+
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-2xl">
          <div className="relative isolate aspect-[5/4] w-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(135deg,#FFFFFF,rgba(240,250,255,0.8))] shadow-[0_40px_80px_-40px_rgba(41,103,151,0.5)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(224,245,255,0.9),rgba(240,250,255,0.4)_55%,rgba(224,245,255,0))]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,#8ED0FF,rgba(142,208,255,0))] blur-2xl" />
            <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,#9E8CFF,rgba(158,140,255,0))] blur-2xl" />

            <div className="relative z-10 flex h-full flex-col justify-between px-10 pb-12 pt-12">
              <div className="inline-flex w-max items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)] shadow-sm backdrop-blur">
                <span className="size-2 rounded-full bg-emerald-400" />
                Live Creator Brief
              </div>

              <div className="grid gap-6">
                <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.45)] backdrop-blur">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
                    Campaign Overview
                  </span>
                  <p className="mt-3 text-lg font-semibold text-[var(--color-text-dark)]">
                    “Launch a 4-video series showing the behind-the-scenes of
                    your creative process in 72 hours.”
                  </p>
                </div>
                <div className="grid gap-4 rounded-2xl border border-white/50 bg-white/60 p-5 shadow-[0_24px_44px_-30px_rgba(0,0,0,0.35)] backdrop-blur">
                  <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-text-muted)]">
                    <span>Creators selected</span>
                    <span className="text-[var(--color-text-dark)]">38/40</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/70">
                    <div className="h-2 w-[95%] rounded-full bg-[linear-gradient(90deg,#515151,#202020)]" />
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-text-muted)]">
                    <span>Projected reach</span>
                    <span className="text-[var(--color-text-dark)]">
                      57.4M views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-12 left-1/2 z-0 hidden h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#E0F5FF,rgba(224,245,255,0))] blur-3xl sm:block" />
        </div>
      </div>
    </section>
  );
}
