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
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
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

const { brand } = landingContent;
const { palette } = theme;

function Header() {
  return (
    <header
      className="border-b"
      style={{ borderColor: palette.border, backgroundColor: palette.surface }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="size-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase tracking-[0.25em]"
            style={{
              backgroundImage: theme.gradients.accent,
              color: palette.textPrimary
            }}
          >
            JJ
          </span>
          <div className="flex flex-col">
            <span
              className="text-xl font-heading font-semibold"
              style={{ color: palette.textPrimary }}
            >
              {brand.name}
            </span>
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: palette.textSecondary }}
            >
              {brand.tagline}
            </span>
          </div>
        </Link>
        <nav className="flex flex-1 items-center justify-start gap-6 text-sm md:justify-center">
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
        <div className="flex items-center gap-3 md:justify-end md:flex-1">
          <Link
            href={brand.ctas.secondary.href}
            className="hidden text-sm font-heading uppercase tracking-[0.18em] md:inline-flex"
            style={{ color: palette.textSecondary }}
          >
            {brand.ctas.secondary.label}
          </Link>
          <Button
            asChild
            size="lg"
            className="rounded-full px-5 text-sm font-semibold uppercase tracking-[0.18em]"
          >
            <Link href={brand.ctas.primary.href}>
              {brand.ctas.primary.label}
            </Link>
          </Button>
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
