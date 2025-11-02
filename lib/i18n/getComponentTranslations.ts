import { locales, type Locale } from '@/i18n';

/**
 * Deep merge two objects, with the second object taking precedence for conflicts.
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge((result[key] || {}) as Record<string, any>, source[key] as Record<string, any>) as T[Extract<keyof T, string>];
    } else {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

/**
 * Load and merge shared translations with component-specific translations.
 * Shared translations are loaded first, then component-specific translations override them.
 * 
 * @param componentPath - Path to the component (e.g., "Dashboard", "Login")
 * @param locale - Locale code (e.g., "en", "fr", "sl")
 * @returns Merged translations object
 */
export async function getComponentTranslations<T = any>(
  componentPath: string,
  locale: string
): Promise<T> {
  // Load shared translations first
  let sharedTranslations = {};
  try {
    const sharedMessages = await import(
      `@/components/shared/translations/${locale}.json`
    );
    sharedTranslations = sharedMessages.default;
  } catch (error) {
    // Fallback to English if locale not found
    try {
      const sharedEn = await import(
        `@/components/shared/translations/en.json`
      );
      sharedTranslations = sharedEn.default;
    } catch {
      // If shared translations don't exist, continue without them
      console.warn('Shared translations not found, continuing without them');
    }
  }

  // Load component-specific translations
  let componentTranslations = {};
  try {
    const messages = await import(
      `@/components/${componentPath}/translations/${locale}.json`
    );
    componentTranslations = messages.default;
  } catch (error) {
    console.error(`Failed to load translations for ${componentPath}/${locale}`, error);
    // Fallback to English for component translations
    try {
      const fallback = await import(
        `@/components/${componentPath}/translations/en.json`
      );
      componentTranslations = fallback.default;
    } catch (fallbackError) {
      console.error('Failed to load fallback translations', fallbackError);
    }
  }

  // Merge: shared translations first, then component-specific (which override)
  return deepMerge(sharedTranslations, componentTranslations) as T;
}
