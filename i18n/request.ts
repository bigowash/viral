import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '@/i18n';
import { loadMessages } from '@/lib/i18n/loadMessages';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  // Load all component messages for this locale on the server
  // This enables proper code-splitting per locale while avoiding client-side dynamic imports
  const messages = await loadMessages(locale as Locale);

  return {
    locale,
    messages
  };
});
