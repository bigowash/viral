import { locales, type Locale } from '@/i18n';

export async function getComponentTranslations<T = any>(
  componentPath: string,
  locale: string
): Promise<T> {
  try {
    const messages = await import(
      `@/components/${componentPath}/translations/${locale}.json`
    );
    return messages.default;
  } catch (error) {
    console.error(`Failed to load translations for ${componentPath}/${locale}`, error);
    const fallback = await import(
      `@/components/${componentPath}/translations/en.json`
    );
    return fallback.default;
  }
}
