import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // One year — optimized images are content-hashed, so a long TTL is safe
    // and maximises repeat-visit caching of the hero/system imagery.
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    // Canonical host is the non-www apex (avizsazeh.ir). Permanently redirect
    // the www host so only one host is ever indexed.
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.avizsazeh.ir' }],
        destination: 'https://avizsazeh.ir/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Long-term immutable caching for static public assets.
      { source: '/brand/:path*', headers: immutable },
      { source: '/systems/:path*', headers: immutable },
      { source: '/clients/:path*', headers: immutable },
      { source: '/icon.png', headers: immutable },
    ];
  },
};

export default withNextIntl(nextConfig);
