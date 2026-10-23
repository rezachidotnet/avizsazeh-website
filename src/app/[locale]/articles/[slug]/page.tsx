import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { routing, Link } from '@/i18n/routing';
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  articleJsonLd,
  localeUrl,
} from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemFAQ } from '@/components/system/SystemFAQ';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { ArticleCard } from '@/components/articles/ArticleCard';
import {
  getArticles,
  getArticle,
  getRelatedArticles,
  formatArticleDate,
} from '@/lib/articles';
import { articlesCopy } from '@/lib/articles-ui';
import { systems } from '@/lib/content/systems';
import { localized } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getArticles(locale).map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const article = getArticle(params.locale, params.slug);
  if (!article) return {};
  const path = `/articles/${article.slug}`;
  const meta = buildMetadata({
    locale: params.locale,
    path,
    title: article.title,
    description: article.description,
    images: [article.cover],
    type: 'article',
  });
  // Articles exist in one language only — never advertise hreflang
  // alternates that would 404.
  const self = localeUrl(params.locale, path);
  return {
    ...meta,
    keywords: [article.targetKeyword, ...article.keywords],
    alternates: {
      canonical: self,
      languages: { [params.locale]: self, 'x-default': self },
    },
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      alternateLocale: undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const article = getArticle(locale, params.slug);
  if (!article) notFound();

  const t = articlesCopy(locale);
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const relatedSystems = article.relatedSystems
    .map((slug) => systems.find((s) => s.slug === slug))
    .filter((s): s is (typeof systems)[number] => Boolean(s));
  const related = getRelatedArticles(article);
  const rfqSystem = relatedSystems[0]?.slug;

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: tNav('articles'), path: '/articles' },
    { name: article.title, path: `/articles/${article.slug}`, current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={article.category || t.eyebrow}
        title={article.title}
        intro={article.description}
        breadcrumbs={crumbs}
      />

      <Section className="!pt-10 lg:!pt-14">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-ink-500">
          <span>
            {t.published}:{' '}
            <time dateTime={article.publishedAt} className="nums">
              {formatArticleDate(article.publishedAt, locale)}
            </time>
          </span>
          {article.updatedAt !== article.publishedAt ? (
            <span>
              {t.updated}:{' '}
              <time dateTime={article.updatedAt} className="nums">
                {formatArticleDate(article.updatedAt, locale)}
              </time>
            </span>
          ) : null}
          <span className="nums">
            {article.readingMinutes} {t.minutes}
          </span>
        </div>

        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-lg border border-ink/10 bg-ink-100">
          <Image
            src={article.cover}
            alt={article.coverAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-8">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />

            {article.sources.length ? (
              <div className="mt-14 border-t border-ink/10 pt-8">
                <h2 className="font-display text-h3 font-semibold text-ink">{t.sources}</h2>
                <ol className="mt-4 list-decimal space-y-2 ps-5 text-body-s text-ink-400">
                  {article.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener nofollow" className="underline-offset-4 hover:text-ink hover:underline">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-32">
              {article.toc.length > 2 ? (
                <nav aria-label={t.toc} className="rounded-lg border border-ink/10 bg-ink/[0.03] p-6">
                  <p className="text-label-lg font-semibold text-ink">{t.toc}</p>
                  <ol className="mt-4 space-y-2.5 text-body-s">
                    {article.toc.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="text-ink-400 transition-colors hover:text-gold">
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {relatedSystems.length ? (
                <div className="rounded-lg border border-ink/10 p-6">
                  <p className="text-label-lg font-semibold text-ink">{t.relatedSystems}</p>
                  <ul className="mt-4 space-y-3">
                    {relatedSystems.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/systems/${s.slug}`} className="group flex items-center gap-3 text-body-s text-ink-300 transition-colors hover:text-ink">
                          <SystemIcon name={s.iconKey} className="h-5 w-5 shrink-0 text-ink-500 group-hover:text-gold" />
                          {localized(s.name, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-lg bg-ink-950 p-6 text-white">
                <p className="font-display text-h3 font-semibold">{t.ctaTitle}</p>
                <p className="mt-3 text-body-s text-white/60">{t.ctaText}</p>
                <Button
                  href={rfqSystem ? `/rfq?system=${rfqSystem}` : '/rfq'}
                  variant="gold"
                  size="md"
                  className="mt-5 w-full justify-center"
                >
                  {tc('requestAnalysis')}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {article.faq.length ? (
        <Section ivory>
          <SystemFAQ
            locale={locale}
            title={t.faq}
            category={`article-${article.slug}`}
            items={article.faq.map((f, i) => ({
              id: `${article.slug}-faq-${i + 1}`,
              q: { fa: f.q, [locale]: f.q },
              a: { fa: f.a, [locale]: f.a },
            }))}
          />
        </Section>
      ) : null}

      {related.length ? (
        <Section>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-h2 font-semibold text-ink">{t.relatedArticles}</h2>
            <Link href="/articles" className="shrink-0 text-body-s text-gold hover:text-gold-300">
              {t.allArticles}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}

      <JsonLd
        data={[
          articleJsonLd({
            locale,
            slug: article.slug,
            title: article.title,
            description: article.description,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            image: article.cover,
            keywords: [article.targetKeyword, ...article.keywords],
            aboutSystems: relatedSystems.map((s) => ({ name: localized(s.name, locale), slug: s.slug })),
          }),
          ...(article.faq.length
            ? [faqJsonLd(article.faq.map((f) => ({ question: f.q, answer: f.a })))]
            : []),
          breadcrumbJsonLd(
            crumbs.map((c) => ({ name: c.name, path: c.path })),
            locale,
          ),
        ]}
      />
    </>
  );
}
