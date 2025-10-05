import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // SECURITY: Only allow images from Supabase storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      // Add your Supabase project hostname if using custom domain
      // {
      //   protocol: 'https',
      //   hostname: 'your-project.supabase.co',
      // },
    ],
  },
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent DNS prefetching
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Enforce HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Control browser features and APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
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

