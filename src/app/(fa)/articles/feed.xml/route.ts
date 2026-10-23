import { getArticles } from '@/lib/articles';
import { localeUrl } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { articlesCopy } from '@/lib/articles-ui';

export const dynamic = 'force-static';

function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** RSS 2.0 feed of Persian engineering articles — helps discovery by readers and crawlers. */
export function GET() {
  const t = articlesCopy('fa');
  const items = getArticles('fa')
    .slice(0, 30)
    .map((a) => {
      const url = localeUrl('fa', `/articles/${a.slug}`);
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${a.publishedAt}T06:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
      ${a.category ? `<category>${esc(a.category)}</category>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(t.title)} | آویزسازه</title>
    <link>${localeUrl('fa', '/articles')}</link>
    <description>${esc(t.metaDescription)}</description>
    <language>fa-IR</language>
    <atom:link href="${SITE_URL}/articles/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
