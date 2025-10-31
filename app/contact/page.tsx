'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LandingFooter, LandingHeader } from '@/components/landing';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-light)]">
      <LandingHeader />
      <main className="flex-1 bg-white py-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
              Contact
            </span>
            <h1 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
              Let’s build your next creator campaign
            </h1>
            <p className="text-base text-[var(--color-text-muted)] sm:text-lg">
              Share a few details and our team will follow up with a tailored SideShift plan.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_32px_70px_-48px_rgba(16,24,40,0.6)] backdrop-blur"
          >
            <div className="grid gap-3">
              <label htmlFor="name" className="text-sm font-semibold text-[var(--color-text-dark)]">
                Name
              </label>
              <Input id="name" name="name" placeholder="Alex Rivera" required />
            </div>
            <div className="grid gap-3">
              <label htmlFor="email" className="text-sm font-semibold text-[var(--color-text-dark)]">
                Work email
              </label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>
            <div className="grid gap-3">
              <label htmlFor="company" className="text-sm font-semibold text-[var(--color-text-dark)]">
                Company
              </label>
              <Input id="company" name="company" placeholder="SideShift" />
            </div>
            <div className="grid gap-3">
              <label htmlFor="message" className="text-sm font-semibold text-[var(--color-text-dark)]">
                How can we help?
              </label>
              <textarea
                id="message"
                name="message"
                className="min-h-[140px] rounded-2xl border border-white/70 bg-white/60 p-4 text-sm text-[var(--color-text-dark)] shadow-inner outline-none focus-visible:border-[var(--color-text-dark)]"
                placeholder="Tell us about your goals, timelines, or campaign ideas."
              />
            </div>
            <Button variant="sideshift" size="lg" type="submit">
              {submitted ? 'Thanks — we’ll reach out' : 'Submit'}
            </Button>
          </form>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

