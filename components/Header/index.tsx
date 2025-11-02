'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Inter } from 'next/font/google';
import { Home, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/lib/actions/session';
import { User } from '@/lib/db/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { landingContent, type LandingContent } from '@/lib/content/landing';
import { theme } from '@/lib/theme';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { usePostHogClient } from '@/lib/analytics/posthog';
import { PostHogEvents } from '@/lib/analytics/events';

// Fetcher removed - now defined inline in UserMenu to ensure stability

const brand: LandingContent['brand'] = landingContent.brand;
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
  const queryClient = useQueryClient();
  const posthog = usePostHogClient();
  const t = useComponentTranslations<HeaderTranslations>('Header');
  
  // Query key - constant string, locale-independent
  const QUERY_KEY = ['/api/user'] as const;
  
  // Stable fetcher function - memoized to prevent recreation
  // Uses cache: 'no-store' to ensure we get fresh session data per request
  const fetcher = useMemo(
    () => async (): Promise<User | null> => {
      try {
        const res = await fetch('/api/user', { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          return data as User;
        }
        return null;
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      }
    },
    []
  );
  
  // Use React Query - follows best practices for stable locale changes
  // Query options inherit from QueryClient defaults (staleTime: 60s)
  // Only override what's specific to this query
  const { data: user, error } = useQuery<User | null>({
    queryKey: QUERY_KEY,
    queryFn: fetcher,
    // Inherits staleTime from QueryClient default (60s)
    // This ensures data doesn't refetch immediately after SSR
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    // initialData is set by QueryProvider from server-side prefetching
  });

  async function handleSignOut() {
    await signOut();
    // Invalidate the query cache and wait for completion before redirecting
    // This ensures the landing page reads fresh session state
    await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
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
          onClick={() => {
            posthog?.capture(PostHogEvents.LINK_CLICKED, {
              link_destination: `/${locale}/sign-in`,
              link_text: t.signIn,
              link_location: 'header',
              locale,
            });
          }}
        >
          {t.signIn}
        </Link>
        <Button
          asChild
          className={`${navFont.className} rounded-full px-5 text-sm uppercase tracking-[0.18em]`}
          onClick={() => {
            posthog?.capture(PostHogEvents.BUTTON_CLICKED, {
              button_name: 'sign_up',
              button_location: 'header',
              button_text: t.signUp,
              locale,
            });
          }}
        >
          <Link 
            href={`/${locale}/sign-up`}
            onClick={() => {
              posthog?.capture(PostHogEvents.LINK_CLICKED, {
                link_destination: `/${locale}/sign-up`,
                link_text: t.signUp,
                link_location: 'header',
                locale,
              });
            }}
          >
            {t.signUp}
          </Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu 
      open={isMenuOpen} 
      onOpenChange={(open) => {
        setIsMenuOpen(open);
        if (open) {
          posthog?.capture(PostHogEvents.USER_MENU_OPENED, {
            locale,
          });
        }
      }}
    >
      <DropdownMenuTrigger
        onClick={() => {
          posthog?.capture(PostHogEvents.BUTTON_CLICKED, {
            button_name: 'user_menu_trigger',
            locale,
          });
        }}
      >
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.display_name || ''} />
          <AvatarFallback>
            {user.primary_email
              ? user.primary_email
                  .split('@')[0]
                  .split(/[._-]/)
                  .map((n) => n?.[0] || '')
                  .filter(Boolean)
                  .join('')
                  .toUpperCase() || user.primary_email[0]?.toUpperCase() || 'U'
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
            onClick={() => {
              posthog?.capture(PostHogEvents.USER_MENU_CLICKED, {
                menu_item: 'dashboard',
                locale,
              });
              posthog?.capture(PostHogEvents.LINK_CLICKED, {
                link_destination: `/${locale}/dashboard`,
                link_text: t.dashboard,
                link_location: 'user_menu',
                locale,
              });
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>{t.dashboard}</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button 
            type="submit" 
            className="flex w-full"
            onClick={() => {
              posthog?.capture(PostHogEvents.USER_MENU_CLICKED, {
                menu_item: 'sign_out',
                locale,
              });
              posthog?.capture(PostHogEvents.BUTTON_CLICKED, {
                button_name: 'sign_out',
                button_location: 'user_menu',
                locale,
              });
            }}
          >
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

function HeaderContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = useLocale() || 'en';
  const view = searchParams.get('view') || 'brand';
  const isCreatorView = view === 'creator';
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const t = useComponentTranslations<HeaderTranslations>('Header');
  const posthog = usePostHogClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const pricingLink = brand?.secondaryLinks?.find(
    (link) => link.label.toLowerCase() === 'pricing'
  );

  if (!t) return null;
  
  // Ensure brand.toggle exists before rendering
  if (!brand?.toggle) return null;

  const renderToggle = () => (
    <div
      className="flex items-center gap-1 rounded-full border px-1 py-1"
      style={{
        borderColor: palette.border,
        backgroundColor: palette.surfaceMuted
      }}
    >
      {brand.toggle.map((option: { label: string; href: string; active?: boolean }) => {
        const isActive =
          (option.href.includes('view=creator') && isCreatorView) ||
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
            onClick={() => {
              posthog?.capture(PostHogEvents.NAVIGATION_TOGGLE, {
                view: option.label.toLowerCase(),
                is_active: isActive,
                locale,
              });
              posthog?.capture(PostHogEvents.LINK_CLICKED, {
                link_destination: `/${locale}${option.href.replace(/^\//, '')}`,
                link_text: option.label === 'Brands' ? t.brands : option.label === 'Creators' ? t.creators : option.label,
                link_location: 'header_toggle',
                locale,
              });
            }}
          >
            {option.label === 'Brands'
              ? t.brands
              : option.label === 'Creators'
                ? t.creators
                : option.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header
      className="border-b"
      style={{ borderColor: palette.border, backgroundColor: palette.surface }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className={`${navFont.className} hidden w-full items-center gap-6 md:flex`}>
          <div className="flex min-w-[96px] flex-1 items-center justify-start">
            <Link
              href={`/${locale}`}
              onClick={() => {
                posthog?.capture(PostHogEvents.LINK_CLICKED, {
                  link_destination: `/${locale}`,
                  link_text: '8x',
                  link_location: 'header_logo',
                  locale,
                });
              }}
            >
              <Image
                src="/assets/brand/8x_logo.svg"
                alt="8x Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
          </div>
          {isHomePage ? (
            <div className="flex flex-1 justify-center">{renderToggle()}</div>
          ) : (
            <div className="flex flex-1 justify-center" />
          )}
          <div className="flex min-w-[204px] flex-1 items-center justify-end gap-4">
            {pricingLink ? (
              <Link
                href={`/${locale}/pricing`}
                className="text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
                style={{ color: palette.textSecondary }}
                onClick={() => {
                  posthog?.capture(PostHogEvents.LINK_CLICKED, {
                    link_destination: `/${locale}/pricing`,
                    link_text: t.pricing,
                    link_location: 'header',
                    locale,
                  });
                }}
              >
                {t.pricing}
              </Link>
            ) : null}
            <Suspense fallback={<div className="h-9" />}>
              <UserMenu />
            </Suspense>
            <LanguageSwitcher />
          </div>
        </div>

        <div className={`${navFont.className} flex w-full items-center gap-3 md:hidden`}>
          <Link
            href={`/${locale}`}
            onClick={() => {
              posthog?.capture(PostHogEvents.LINK_CLICKED, {
                link_destination: `/${locale}`,
                link_text: '8x',
                link_location: 'header_logo_mobile',
                locale,
              });
            }}
          >
            <Image
              src="/assets/brand/8x_logo.svg"
              alt="8x Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          {isHomePage ? (
            <div className="flex flex-1 justify-center">{renderToggle()}</div>
          ) : (
            <div className="flex flex-1 justify-center" />
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
              posthog?.capture(PostHogEvents.BUTTON_CLICKED, {
                button_name: 'mobile_menu_toggle',
                button_location: 'header',
                is_open: !isMobileMenuOpen,
                locale,
              });
            }}
          >
            <Menu className="size-5" />
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="mt-4 flex flex-col gap-4 rounded-lg border px-4 py-4 md:hidden"
            style={{ borderColor: palette.border, backgroundColor: palette.surfaceMuted }}
          >
            {pricingLink ? (
              <Link
                href={`/${locale}/pricing`}
                className="text-sm uppercase tracking-[0.18em]"
                style={{ color: palette.textSecondary }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.pricing}
              </Link>
            ) : null}
            <div className="flex flex-col gap-3">
              <Suspense fallback={<div className="h-9" />}>
                <UserMenu />
              </Suspense>
            </div>
            <div className="flex justify-start">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Header() {
  return (
    <Suspense fallback={<div className="h-16 border-b" style={{ borderColor: theme.palette.border, backgroundColor: theme.palette.surface }} />}>
      <HeaderContent />
    </Suspense>
  );
}

export function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
