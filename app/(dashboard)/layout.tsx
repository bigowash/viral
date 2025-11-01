'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const navFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

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
          href="/sign-in"
          className={`${navFont.className} text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-75`}
          style={{ color: palette.textSecondary }}
        >
          Sign in
        </Link>
        <Button
          asChild
          className={`${navFont.className} rounded-full px-5 text-sm uppercase tracking-[0.18em]`}
        >
          <Link href="/sign-up">Sign up</Link>
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
        <DropdownMenuItem className={`${navFont.className} cursor-pointer`}>
          <Link
            href="/dashboard"
            className="flex w-full items-center gap-2 text-sm uppercase tracking-[0.12em]"
            style={{ color: palette.textSecondary }}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem
              className={`${navFont.className} w-full flex-1 cursor-pointer gap-2 text-sm uppercase tracking-[0.12em]`}
              style={{ color: palette.textSecondary }}
            >
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
  const pricingLink = brand.secondaryLinks.find(
    (link) => link.label.toLowerCase() === 'pricing'
  );

  return (
    <header
      className="border-b"
      style={{ borderColor: palette.border, backgroundColor: palette.surface }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
        <div
          className={`${navFont.className} flex w-full flex-wrap items-center gap-4 md:flex-nowrap md:gap-6`}
        >
          <div className="flex min-w-[96px] flex-1 items-center justify-start">
            <Link
              href="/"
              className="text-2xl uppercase tracking-[0.24em]"
              style={{ color: palette.textPrimary }}
            >
              8x
            </Link>
          </div>
          <div className="flex flex-1 justify-center">
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
                  className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.18em] transition-all"
                  style={{
                    color: option.active ? palette.textOnAccent : palette.textSecondary,
                    backgroundColor: option.active ? palette.accent : 'transparent'
                  }}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex min-w-[204px] flex-1 items-center justify-end gap-4">
            {pricingLink ? (
              <Link
                href={pricingLink.href}
                className="text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                style={{ color: palette.textSecondary }}
              >
                {pricingLink.label}
              </Link>
            ) : null}
            <Suspense fallback={<div className="h-9" />}>
              <UserMenu />
            </Suspense>
          </div>
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
