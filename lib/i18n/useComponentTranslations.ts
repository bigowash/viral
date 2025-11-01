'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export function useComponentTranslations<T = any>(componentPath: string): T | null {
  const locale = useLocale();
  const [translations, setTranslations] = useState<T | null>(null);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const messages = await import(
          `@/components/${componentPath}/translations/${locale}.json`
        );
        setTranslations(messages.default);
      } catch (error) {
        console.error(`Failed to load translations for ${componentPath}/${locale}`, error);
        try {
          const fallback = await import(
            `@/components/${componentPath}/translations/en.json`
          );
          setTranslations(fallback.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations', fallbackError);
        }
      }
    }

    loadTranslations();
  }, [locale, componentPath]);

  return translations;
}
