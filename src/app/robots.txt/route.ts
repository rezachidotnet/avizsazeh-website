import { SITE_URL } from '@/lib/site';

const ROBOTS_CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no, use=reference';

export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    `Content-Signal: ${ROBOTS_CONTENT_SIGNAL}`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
