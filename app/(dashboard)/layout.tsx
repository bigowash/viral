'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { landingContent } from '@/lib/content/landing';
import { theme } from '@/lib/theme';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const { brand } = landingContent;
const { palette } = theme;

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href={brand.ctas.secondary.href}
          className="text-sm font-heading uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
          style={{ color: palette.textSecondary }}
        >
          {brand.ctas.secondary.label}
        </Link>
        <Button
          asChild
          className="rounded-full px-5 text-sm font-heading uppercase tracking-[0.18em]"
        >
          <Link href={brand.ctas.primary.href}>{brand.ctas.primary.label}</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header
      className="border-b"
      style={{ borderColor: palette.border, backgroundColor: palette.surface }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-accent italic" style={{ color: palette.textPrimary }}>
            {brand.name}
          </span>
          <span
            className="hidden text-xs uppercase tracking-[0.24em] text-gray-500 sm:inline-block"
            style={{ color: palette.textSecondary }}
          >
            {brand.tagline}
          </span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
          {brand.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-heading tracking-tight transition-opacity hover:opacity-70"
              style={{ color: palette.textSecondary }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 md:justify-end md:flex-1">
          <div
            className="hidden items-center gap-4 text-sm md:flex"
            style={{ color: palette.textSecondary }}
          >
            {brand.secondaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-heading tracking-tight transition-opacity hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div
            className="flex items-center gap-1 rounded-full border px-1 py-1"
            style={{
              borderColor: palette.border,
              backgroundColor: palette.surfaceMuted
            }}
          >
            {brand.toggle.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                className="rounded-full px-4 py-1 text-xs font-heading uppercase tracking-[0.18em] transition-all"
                style={{
                  color: option.active ? palette.textOnAccent : palette.textSecondary,
                  backgroundColor: option.active ? palette.accent : 'transparent'
                }}
              >
                {option.label}
              </Link>
            ))}
          </div>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
