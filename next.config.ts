import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    // Disabled clientSegmentCache as it may cause localStorage issues during SSR
    // clientSegmentCache: true,
    nodeMiddleware: true
  }
};

export default withNextIntl(nextConfig);
