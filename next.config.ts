import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    // Disabled clientSegmentCache as it may cause localStorage issues during SSR
    // clientSegmentCache: true,
    nodeMiddleware: true
  }
};

export default nextConfig;
