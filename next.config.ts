import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      // Legacy hash anchors to standalone pages
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'anchor',
            value: 'about',
          },
        ],
        permanent: true,
        destination: '/about',
      },
      // Hash-based routes to standalone pages
      {
        source: '/:path(about|donate|chapters)',
        has: [
          {
            type: 'header',
            key: 'referer',
            value: '.*#.*',
          },
        ],
        permanent: true,
        destination: '/:path',
      },
      // Programs redirect to chapters
      {
        source: '/programs',
        destination: '/chapters',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

