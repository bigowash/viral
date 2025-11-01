export const locales = ['en', 'fr', 'sl'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const domainLocales: Record<string, Locale> = {
  'example.com': 'en',
  'example.fr': 'fr',
  'example.si': 'sl',
  'localhost:3000': 'en',
};

export const localeToMainDomain: Record<Locale, string> = {
  'en': 'example.com',
  'fr': 'example.fr',
  'sl': 'example.si',
};

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'fr': 'Français',
  'sl': 'Slovenščina',
};
