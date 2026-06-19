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
    // Canonical host is the www host (www.avizsazeh.ir). Permanently redirect
    // the bare apex so only one host is ever indexed — this matches the
    // canonical/sitemap/hreflang origin (SITE_URL) and the production DNS setup.
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'avizsazeh.ir' }],
        destination: 'https://www.avizsazeh.ir/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    // Content-Security-Policy — report-only first so we can observe violations
    // in the browser console without breaking images, fonts, RFQ submission or
    // hydration. All assets are first-party: next/font is self-hosted, images
    // are served by the same-origin Next optimizer, and the RFQ POST is
    // same-origin (/api/rfq/submit). Odoo traffic is server-side and not
    // subject to browser CSP. 'unsafe-inline' covers Next's inline hydration
    // scripts and Tailwind's inline styles (no nonce pipeline in use).
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "frame-src 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "manifest-src 'self'",
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
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
