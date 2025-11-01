import './globals.css';
import '@/lib/localStorage-polyfill';
import type { Metadata, Viewport } from 'next';
import { fontTheme } from '@/lib/theme/fonts';

const { heading, body, accent } = fontTheme;

export const metadata: Metadata = {
  title: 'Jack & Jill AI — The AI Recruiters',
  description:
    'Meet Jack & Jill AI, the recruiting duo that scouts, nurtures, and closes exceptional talent with personalised conversations.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${accent.variable} bg-white dark:bg-gray-950 text-black dark:text-white`}
    >
      <body className={`min-h-[100dvh] bg-background ${body.className}`}>
        {children}
      </body>
    </html>
  );
}
