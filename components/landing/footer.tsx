import Link from 'next/link';

const footerNav = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '#testimonials' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Docs', href: '#faq' },
  { label: 'Contact', href: '#contact' }
];

const socials = [
  { label: 'Twitter / X', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' }
];

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' }
];

export function LandingFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#E0F5FF_0%,#FFFFFF_100%)] pt-20"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(224,245,255,0.8),rgba(255,255,255,0))]" />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-semibold uppercase tracking-[0.3em] text-[var(--color-text-dark)]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#202020,#515151)] text-white text-base font-semibold">
              SS
            </span>
            SideShift
          </Link>
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2025 SideShift. All rights reserved.
          </p>
        </div>
        <div className="grid gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-dark)]">
            Explore
          </h3>
          <div className="grid gap-3 text-sm text-[var(--color-text-muted)]">
            {footerNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-[var(--color-text-dark)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-dark)]">
            Connect
          </h3>
          <div className="grid gap-3 text-sm text-[var(--color-text-muted)]">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[var(--color-text-dark)]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-4 grid gap-3 text-sm text-[var(--color-text-muted)]">
            {legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-[var(--color-text-dark)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="h-16 w-full bg-[linear-gradient(90deg,rgba(224,245,255,0),rgba(224,245,255,0.8),rgba(224,245,255,0))]" />
    </footer>
  );
}
