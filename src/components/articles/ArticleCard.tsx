import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import type { ArticleMeta } from '@/lib/articles';
import { formatArticleDate } from '@/lib/articles';
import { articlesCopy } from '@/lib/articles-ui';

/** Article teaser card — used on the articles index and related-reading rails. */
export function ArticleCard({
  article,
  locale,
  linkLocale,
  priority = false,
}: {
  article: ArticleMeta;
  /** locale used for UI copy */
  locale: Locale;
  /** locale the article lives in (may differ when listing Persian articles on /en) */
  linkLocale?: Locale;
  priority?: boolean;
}) {
  const t = articlesCopy(locale);
  const href = `/articles/${article.slug}`;
  const target = linkLocale ?? article.locale;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition-shadow duration-medium hover:shadow-lg">
      <Link href={href} locale={target} className="relative block aspect-[16/9] overflow-hidden bg-ink-100" tabIndex={-1} aria-hidden="true">
        <Image
          src={article.cover}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-slow group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6" dir={article.locale === 'en' ? 'ltr' : 'rtl'}>
        {article.category ? <span className="eyebrow">{article.category}</span> : null}
        <h3 className="mt-3 font-display text-h3 font-semibold leading-snug text-ink">
          <Link href={href} locale={target} className="transition-colors hover:text-gold">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-body-s leading-relaxed text-ink-300">
          {article.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-caption text-ink-500">
          <time dateTime={article.publishedAt} className="nums">
            {formatArticleDate(article.publishedAt, article.locale)}
          </time>
          <span className="nums">
            {article.readingMinutes} {t.minutes}
          </span>
        </div>
      </div>
    </article>
  );
}
