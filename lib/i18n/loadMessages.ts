import { type Locale } from '@/i18n';

/**
 * Loads all component messages for a given locale.
 * Uses static imports to ensure webpack can properly code-split per locale.
 * 
 * This function should only be used on the server (in getMessages()).
 * Client components should read messages from NextIntlClientProvider context.
 */
export async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  // Import shared translations for the locale
  const sharedTranslations = await import(
    `@/components/shared/translations/${locale}.json`
  ).catch(() => import(`@/components/shared/translations/en.json`));

  // Import all component translations for the locale
  // Using a mapping approach to ensure webpack can statically analyze these imports
  const componentTranslations: Record<string, Promise<{ default: unknown }>> = {
    Dashboard: import(
      `@/components/Dashboard/translations/${locale}.json`
    ).catch(() => import(`@/components/Dashboard/translations/en.json`)),
    Header: import(
      `@/components/Header/translations/${locale}.json`
    ).catch(() => import(`@/components/Header/translations/en.json`)),
    LandingPage: import(
      `@/components/LandingPage/translations/${locale}.json`
    ).catch(() => import(`@/components/LandingPage/translations/en.json`)),
    LanguageSwitcher: import(
      `@/components/LanguageSwitcher/translations/${locale}.json`
    ).catch(() => import(`@/components/LanguageSwitcher/translations/en.json`)),
    Login: import(
      `@/components/Login/translations/${locale}.json`
    ).catch(() => import(`@/components/Login/translations/en.json`)),
    Pricing: import(
      `@/components/Pricing/translations/${locale}.json`
    ).catch(() => import(`@/components/Pricing/translations/en.json`)),
  };

  // Load all component translations in parallel
  const componentResults = await Promise.allSettled(
    Object.values(componentTranslations)
  );

  // Get the full shared translations object
  const sharedTranslationsData = (await sharedTranslations).default;
  
  // Merge all translations
  // Start with shared translations as the base (includes common, etc.)
  const messages: Record<string, unknown> = {
    ...sharedTranslationsData, // This includes 'common' and any other shared keys
  };

  // Merge component translations, using component name as the key
  const componentNames = Object.keys(componentTranslations);
  componentResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const componentName = componentNames[index];
      // Merge component translations into messages object
      messages[componentName] = result.value.default || {};
    }
  });

  // Store full shared translations for hook access (for backwards compatibility)
  // The hook will merge shared (which contains 'common') with component-specific translations
  messages.shared = sharedTranslationsData;

  return messages;
}

