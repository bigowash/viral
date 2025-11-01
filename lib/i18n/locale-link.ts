import { type Locale } from '@/i18n';

/**
 * Prepends locale to a path
 * @param path - Path to make locale-aware
 * @param locale - Current locale
 * @returns Locale-aware path
 */
export function withLocale(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Remove locale prefix if already present
  const pathWithoutLocale = cleanPath.replace(/^(en|fr|sl)\//, '');
  return `/${locale}/${pathWithoutLocale}`;
}
