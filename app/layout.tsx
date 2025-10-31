import './globals.css';
import '@/lib/localStorage-polyfill';
import type { Metadata, Viewport } from 'next';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRProvider } from '@/lib/swr-provider';

export const metadata: Metadata = {
  title: 'SideShift — The Growth Engine for UGC Campaigns',
  description:
    'SideShift connects ambitious brands with top creators, handling vetting, contracts, and payouts so every campaign scales.',
  openGraph: {
    title: 'SideShift — The Growth Engine for UGC Campaigns',
    description:
      'Scale your creator collaborations with SideShift. Source talent, manage campaigns, and automate payouts in one platform.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SideShift — The Growth Engine for UGC Campaigns',
    description:
      'Source top creators, launch UGC campaigns faster, and let SideShift automate the busywork.'
  }
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
      className="bg-[var(--color-bg-light)] text-[var(--color-text-dark)] dark:bg-gray-950 dark:text-white"
    >
      <body className="min-h-[100dvh] antialiased">
        <SWRProvider
          fallback={{
            // We do NOT await here
            // Only components that read this data will suspend
            '/api/user': getUser(),
            '/api/team': getTeamForUser()
          }}
        >
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
