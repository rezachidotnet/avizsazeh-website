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
    // The brand logo is served as .svg (a base64-embedded raster, not a
    // script-bearing vector) — sandboxed via contentSecurityPolicy below.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    // Canonical host is the www host (www.avizsazeh.com). Permanently redirect
    // the bare apex so only one host is ever indexed — this matches the
    // canonical/sitemap/hreflang origin (SITE_URL) and the production DNS setup.
    // The old avizsazeh.ir public domain is migrated at the Cloudflare edge
    // (301 -> www.avizsazeh.com, path preserved) and is intentionally not
    // handled here.
    return [
      {
        source: '/ru',
        has: [{ type: 'host', value: 'avizsazeh.com' }],
        destination: 'https://www.avizsazeh.com/en',
        permanent: true,
      },
      {
        source: '/ru/:path*',
        has: [{ type: 'host', value: 'avizsazeh.com' }],
        destination: 'https://www.avizsazeh.com/en/:path*',
        permanent: true,
      },
      {
        source: '/ru',
        has: [{ type: 'host', value: '(?<subdomain>.*)\\.vercel\\.app' }],
        destination: 'https://www.avizsazeh.com/en',
        permanent: true,
      },
      {
        source: '/ru/:path*',
        has: [{ type: 'host', value: '(?<subdomain>.*)\\.vercel\\.app' }],
        destination: 'https://www.avizsazeh.com/en/:path*',
        permanent: true,
      },
      {
        source: '/ru',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/ru/:path*',
        destination: '/en/:path*',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'avizsazeh.com' }],
        destination: 'https://www.avizsazeh.com/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'avizsazeh.com' }],
        destination: 'https://www.avizsazeh.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<subdomain>.*)\\.vercel\\.app' }],
        destination: 'https://www.avizsazeh.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];
    // Content-Security-Policy — report-only first so we can observe violations
    // without breaking the active direct GA4 transport or a future GTM loader.
    // Additional vendors must get a separate CSP review before activation.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "frame-src https://www.googletagmanager.com",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.google-analytics.com https://region1.google-analytics.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
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
          { key: 'Content-Signal', value: 'search=yes, ai-input=yes, ai-train=no' },
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
