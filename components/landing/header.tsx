'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Blog', href: '#testimonials' },
  { label: 'Docs', href: '#faq' },
  { label: 'Contact', href: '#contact' }
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,250,255,0.9))] backdrop-blur-xl shadow-[0_10px_40px_-24px_rgba(16,24,40,0.6)]">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-[0.2em] text-[var(--color-text-dark)] uppercase"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#202020,#515151)] text-white text-base font-semibold">
            SS
          </span>
          SideShift
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-text-muted)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-[var(--color-text-dark)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/app"
            className="text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-dark)]"
          >
            Sign in
          </Link>
          <Button variant="sideshift" size="lg">
            Join Now
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/70 p-2 text-[var(--color-text-dark)] shadow-sm outline-none transition hover:bg-white lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={`lg:hidden ${open ? 'block' : 'hidden'}`}
        data-open={open}
      >
        <div className="flex flex-col gap-6 border-t border-white/60 bg-white/95 px-4 pb-6 pt-4 text-base font-semibold text-[var(--color-text-muted)] shadow-[0_18px_40px_-28px_rgba(16,24,40,0.6)]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-[var(--color-text-dark)]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 border-t border-white/80 pt-4">
            <Link
              href="/app"
              className="text-sm font-semibold text-[var(--color-text-dark)]"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Button
              variant="sideshift"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
