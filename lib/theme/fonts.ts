import { Montserrat, Figtree, Instrument_Serif } from 'next/font/google';

export const headingFont = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading'
});

export const bodyFont = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body'
});

export const accentFont = Instrument_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400'],
  variable: '--font-accent'
});

export const fontTheme = {
  heading: headingFont,
  body: bodyFont,
  accent: accentFont
} as const;
