'use client';

import { Suspense } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { locales, localeNames, type Locale } from '@/i18n';
import { theme } from '@/lib/theme';
import { Inter } from 'next/font/google';
import { usePostHogClient } from '@/lib/analytics/posthog';
import { PostHogEvents } from '@/lib/analytics/events';

const navFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const { palette } = theme;

interface LanguageSwitcherTranslations {
  language: string;
  english: string;
  french: string;
  slovenian: string;
}

function LanguageSwitcherContent() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHogClient();
  const t = useComponentTranslations<LanguageSwitcherTranslations>('LanguageSwitcher');

  if (!t) return null;

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // Track language change
    posthog?.capture(PostHogEvents.LANGUAGE_CHANGED, {
      from_locale: locale,
      to_locale: newLocale,
      pathname,
    });
    
    // Remove current locale from pathname
    let pathnameWithoutLocale = pathname.replace(/^\/[^\/]+/, '');
    // Ensure we have a leading slash
    if (!pathnameWithoutLocale.startsWith('/')) {
      pathnameWithoutLocale = '/' + pathnameWithoutLocale;
    }
    // Handle root path
    if (pathnameWithoutLocale === '') {
      pathnameWithoutLocale = '/';
    }
    // Build new path with new locale
    const newPath = pathnameWithoutLocale === '/' 
      ? `/${newLocale}` 
      : `/${newLocale}${pathnameWithoutLocale}`;
    // Preserve query parameters
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    
    router.push(fullPath);
  };

  const getLanguageLabel = (loc: Locale): string => {
    switch (loc) {
      case 'en':
        return t.english;
      case 'fr':
        return t.french;
      case 'sl':
        return t.slovenian;
      default:
        return localeNames[loc];
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`${navFont.className} text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-75 flex items-center gap-2`}
          style={{ color: palette.textSecondary }}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`${navFont.className} cursor-pointer text-sm uppercase tracking-[0.12em] ${
              locale === loc ? 'font-semibold' : ''
            }`}
            style={{
              color: locale === loc ? palette.accent : palette.textSecondary
            }}
          >
            <span className="mr-2">{locale === loc ? '✓' : ''}</span>
            {getLanguageLabel(loc)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageSwitcher() {
  return (
    <Suspense fallback={<div className="h-9 w-9" />}>
      <LanguageSwitcherContent />
    </Suspense>
  );
}
