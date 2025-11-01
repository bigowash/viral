'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
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
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { landingContent } from '@/lib/content/landing';
import { theme } from '@/lib/theme';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const fetcher = async (url: string): Promise<User | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    // Ensure we return a proper object or null, never undefined
    // Also ensure data is not an array or other non-object type
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as User;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

const { brand } = landingContent || { brand: { toggle: [], secondaryLinks: [] } };
const { palette } = theme;

const navFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

interface HeaderTranslations {
  signIn: string;
  signUp: string;
  dashboard: string;
  signOut: string;
  pricing: string;
  brands: string;
  creators: string;
}

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale() || 'en';
  const router = useRouter();
  const t = useComponentTranslations<HeaderTranslations>('Header');
  
  // SWR key should be consistent across locale changes - user data is locale-independent
  // Use a stable key that doesn't change with locale
  const swrKey = '/api/user';
  const { data: user, error, isLoading } = useSWR<User | null>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
      fallbackData: null,
      shouldRetryOnError: false,
      dedupingInterval: 5000,
    }
  );

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push(`/${locale}`);
  }

  if (!t) return null;

  // During language switch, isLoading might be true, but we should show UI anyway
  // user will be null if not logged in, or a User object if logged in
  // Don't check for undefined explicitly - treat null as "not logged in"
  
  if (!user || error) {
    return (
      <>
        <Link
          href={`/${locale}/sign-in`}
          className={`${navFont.className} text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-75`}
          style={{ color: palette.textSecondary }}
        >
          {t.signIn}
        </Link>
        <Button
          asChild
          className={`${navFont.className} rounded-full px-5 text-sm uppercase tracking-[0.18em]`}
        >
          <Link href={`/${locale}/sign-up`}>{t.signUp}</Link>
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
              ? user.email
                  .split(' ')
                  .map((n) => n?.[0] || '')
                  .filter(Boolean)
                  .join('') || user.email[0]?.toUpperCase() || 'U'
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className={`${navFont.className} cursor-pointer`}>
          <Link
            href={`/${locale}/dashboard`}
            className="flex w-full items-center gap-2 text-sm uppercase tracking-[0.12em]"
            style={{ color: palette.textSecondary }}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>{t.dashboard}</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem
              className={`${navFont.className} w-full flex-1 cursor-pointer gap-2 text-sm uppercase tracking-[0.12em]`}
              style={{ color: palette.textSecondary }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t.signOut}</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = useLocale() || 'en';
  const view = searchParams.get('view') || 'brand';
  const isCreatorView = view === 'creator';
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const t = useComponentTranslations<HeaderTranslations>('Header');

  const pricingLink = brand?.secondaryLinks?.find(
    (link) => link.label.toLowerCase() === 'pricing'
  );

  if (!t) return null;
  
  // Ensure brand.toggle exists before rendering
  if (!brand?.toggle) return null;

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
              href={`/${locale}`}
              className="text-2xl uppercase tracking-[0.24em]"
              style={{ color: palette.textPrimary }}
            >
              8x
            </Link>
          </div>
          {isHomePage && (
            <div className="flex flex-1 justify-center">
              <div
                className="flex items-center gap-1 rounded-full border px-1 py-1"
                style={{
                  borderColor: palette.border,
                  backgroundColor: palette.surfaceMuted
                }}
              >
                {brand.toggle.map((option) => {
                  const isActive = (option.href.includes('view=creator') && isCreatorView) ||
                                   (option.href.includes('view=brand') && !isCreatorView);
                  return (
                    <Link
                      key={option.label}
                      href={`/${locale}${option.href.replace(/^\//, '')}`}
                      className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.18em] transition-all"
                      style={{
                        color: isActive ? palette.textOnAccent : palette.textSecondary,
                        backgroundColor: isActive ? palette.accent : 'transparent'
                      }}
                    >
                      {option.label === 'Brands' ? t.brands : option.label === 'Creators' ? t.creators : option.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {!isHomePage && <div className="flex flex-1 justify-center" />}
          <div className="flex min-w-[204px] flex-1 items-center justify-end gap-4">
            {pricingLink ? (
              <Link
                href={`/${locale}/pricing`}
                className="text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                style={{ color: palette.textSecondary }}
              >
                {t.pricing}
              </Link>
            ) : null}
            <LanguageSwitcher />
            <Suspense fallback={<div className="h-9" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

export function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 border-b" style={{ borderColor: theme.palette.border, backgroundColor: theme.palette.surface }} />}>
        <Header />
      </Suspense>
      {children}
    </section>
  );
}
