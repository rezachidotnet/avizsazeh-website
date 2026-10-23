import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd, localeUrl } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { getArticles } from '@/lib/articles';
import { articlesCopy } from '@/lib/articles-ui';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = articlesCopy(params.locale);
  const hasArticles = getArticles(params.locale).length > 0;
  const meta = buildMetadata({
    locale: params.locale,
    path: '/articles',
    title: t.metaTitle,
    description: t.metaDescription,
    titleAbsolute: true,
    // A locale with no articles of its own only links to Persian ones — keep it out of the index.
    robots: hasArticles ? undefined : { index: false, follow: true },
  });
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      types: { 'application/rss+xml': `${SITE_URL}/articles/feed.xml` },
    },
  };
}

export default async function ArticlesIndexPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = articlesCopy(locale);
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const own = getArticles(locale);
  const fallback = own.length === 0 && locale !== 'fa' ? getArticles('fa') : [];
  const list = own.length ? own : fallback;

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: tNav('articles'), path: '/articles', current: true },
  ];

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro} breadcrumbs={crumbs} />

      <Section>
        {own.length === 0 ? (
          <p className="mb-10 max-w-prose text-body-l text-ink-300">{t.empty}</p>
        ) : null}

        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={locale}
                linkLocale={article.locale}
                priority={i < 3}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button href="/rfq" variant="gold" size="lg">
            {tc('requestAnalysis')}
          </Button>
          <Button href="/systems" variant="outline" size="lg">
            {tc('exploreAllSystems')}
          </Button>
          <a href="/articles/feed.xml" className="text-body-s text-ink-500 underline-offset-4 hover:text-ink hover:underline">
            {t.feed}
          </a>
        </div>
      </Section>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${localeUrl(locale, '/articles')}#blog`,
            url: localeUrl(locale, '/articles'),
            name: t.title,
            description: t.metaDescription,
            publisher: { '@id': `${SITE_URL}/#organization` },
            blogPost: own.slice(0, 20).map((a) => ({
              '@type': 'BlogPosting',
              headline: a.title,
              url: localeUrl(a.locale, `/articles/${a.slug}`),
              datePublished: a.publishedAt,
            })),
          },
          breadcrumbJsonLd(
            crumbs.map((c) => ({ name: c.name, path: c.path })),
            locale,
          ),
        ]}
      />
    </>
  );
}
