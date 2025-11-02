import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n';
import './globals.css';
import '@/lib/localStorage-polyfill';
import type { Metadata, Viewport } from 'next';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { QueryProvider } from '@/lib/query-provider';
import { getQueryClient, dehydrate } from '@/lib/query-provider-server';
import { PostHogProvider } from '@/lib/analytics/posthog-provider';
import { fontTheme } from '@/lib/theme/fonts';

const { heading, body, accent } = fontTheme;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
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

  // Use request-scoped QueryClient for server-side prefetching
  const queryClient = getQueryClient();

  // Prefetch user and team data with proper query keys
  const userData = await getUser().catch(() => null);
  const teamData = await (userData ? getTeamForUser(userData.id) : Promise.resolve(null)).catch(() => null);

  // Prefetch queries using the proper query keys that match client-side usage
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['/api/user'],
      queryFn: async () => userData ?? null,
    }),
    queryClient.prefetchQuery({
      queryKey: ['/api/team'],
      queryFn: async () => teamData ?? null,
    }),
  ]);

  // Dehydrate the query client to get the state for rehydration
  const dehydratedState = dehydrate(queryClient);

  return (
    <PostHogProvider>
      <NextIntlClientProvider locale={locale} messages={{}}>
        <QueryProvider dehydratedState={dehydratedState}>
          {children}
        </QueryProvider>
      </NextIntlClientProvider>
    </PostHogProvider>
  );
}
