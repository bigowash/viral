import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function CreatorHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-20 sm:pt-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(224,245,255,0.5)_45%,rgba(255,255,255,0.85)_100%)]" />
      <div className="absolute right-0 top-0 -z-10 h-[460px] w-[460px] translate-x-1/3 bg-[radial-gradient(circle,#B9E5FF_0%,rgba(185,229,255,0)_70%)] blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] shadow-sm backdrop-blur">
              <span className="inline-flex size-2 rounded-full bg-sky-500" />
              Free to join
            </div>
            <h1 className="text-4xl font-bold leading-tight text-[var(--color-text-dark)] sm:text-5xl lg:text-6xl">
              The UGC Platform for Creators
            </h1>
            <p className="max-w-xl text-lg text-[var(--color-text-muted)] sm:text-xl">
              SideShift connects you directly with leading brands, handles the
              contracts and payouts, and lets you focus on creating.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="sideshift" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/sign-up">Join as a Creator</Link>
            </Button>
            <Button
              variant="sideshiftLight"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="#features">Explore the dashboard</Link>
            </Button>
          </div>
          <div className="grid gap-4 text-sm text-[var(--color-text-muted)] sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_24px_56px_-40px_rgba(16,24,40,0.65)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.35em]">
                New briefs weekly
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-dark)]">
                300+ campaigns live
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_24px_56px_-40px_rgba(16,24,40,0.65)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.35em]">
                Creator community
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-dark)]">
                42 countries active
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_24px_56px_-40px_rgba(16,24,40,0.65)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.35em]">
                Fast payouts
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-dark)]">
                2-5 day turnaround
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-2xl">
          <div className="relative isolate aspect-[5/4] w-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(135deg,#FFFFFF,rgba(240,250,255,0.85))] shadow-[0_40px_80px_-40px_rgba(41,103,151,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,229,255,0.7),rgba(240,250,255,0.2)_65%,rgba(224,245,255,0))]" />
            <div className="absolute -right-16 top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,#FFD3A4,rgba(255,211,164,0))] blur-2xl" />
            <div className="absolute -bottom-20 left-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,#A4C2FF,rgba(164,194,255,0))] blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between px-10 pb-12 pt-12">
              <div className="inline-flex w-max items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)] shadow-sm backdrop-blur">
                <span className="size-2 rounded-full bg-emerald-400" />
                Creator dashboard
              </div>

              <div className="grid gap-5">
                <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.35)] backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
                    Upcoming deliverables
                  </p>
                  <ul className="mt-4 space-y-3 text-[var(--color-text-dark)]">
                    <li className="flex items-center justify-between text-sm font-medium">
                      <span>Matcha Energy TikTok</span>
                      <span className="rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                        Due Friday
                      </span>
                    </li>
                    <li className="flex items-center justify-between text-sm font-medium">
                      <span>Travel App UGC Reel</span>
                      <span className="rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                        Due in 4 days
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/50 bg-white/60 p-6 shadow-[0_24px_44px_-30px_rgba(0,0,0,0.3)] backdrop-blur">
                  <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-text-muted)]">
                    <span>Completed campaigns</span>
                    <span className="text-[var(--color-text-dark)]">18</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/70">
                    <div className="h-2 w-[82%] rounded-full bg-[linear-gradient(90deg,#515151,#202020)]" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[var(--color-text-muted)]">
                    <span>Pending payout</span>
                    <span className="text-[var(--color-text-dark)]">$1,240</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
