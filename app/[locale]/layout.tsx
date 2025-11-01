import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n';
import './globals.css';
import '@/lib/localStorage-polyfill';
import type { Metadata, Viewport } from 'next';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { QueryProvider } from '@/lib/query-provider';
import { fontTheme } from '@/lib/theme/fonts';

const { heading, body, accent } = fontTheme;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'Jack & Jill AI — The AI Recruiters',
    fr: 'Jack & Jill AI — Les Recruteurs IA',
    sl: 'Jack & Jill AI — Umetna Inteligenca za Zaposlovanje'
  };

  const descriptions: Record<string, string> = {
    en: 'Meet Jack & Jill AI, the recruiting duo that scouts, nurtures, and closes exceptional talent with personalised conversations.',
    fr: 'Découvrez Jack & Jill AI, le duo de recrutement qui repère, cultive et recrute des talents exceptionnels avec des conversations personnalisées.',
    sl: 'Spoznajte Jack & Jill AI, recruterski par, ki išče, vzgaja in zaposluje izjemne talente s personaliziranimi pogovori.'
  };

  const localeToDomain: Record<string, string> = {
    en: 'https://example.com',
    fr: 'https://example.fr',
    sl: 'https://example.si'
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: localeToDomain[locale] || localeToDomain.en,
      languages: {
        'en': localeToDomain.en,
        'fr': localeToDomain.fr,
        'sl': localeToDomain.sl,
      }
    }
  };
}

export const viewport: Viewport = {
  maximumScale: 1
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Await promises for React Query initial data
  // Ensure values are never undefined - use null instead
  const [userData, teamData] = await Promise.all([
    getUser().catch(() => null),
    getTeamForUser().catch(() => null)
  ]);

  // Ensure initial data values are explicitly defined (never undefined)
  const initialData = {
    '/api/user': userData ?? null,
    '/api/team': teamData ?? null
  };

  return (
    <NextIntlClientProvider locale={locale} messages={{}}>
      <QueryProvider initialData={initialData}>
        {children}
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
