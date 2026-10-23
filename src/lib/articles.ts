import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked, type Tokens } from 'marked';
import type { Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

/**
 * Engineering articles ("مقالات") — Markdown files with YAML front matter in
 * /content/articles. Read at build time only (all article routes are static),
 * so a new article goes live on the next Vercel deploy after it is committed.
 *
 * The schema is validated by scripts/articles/validate.mjs (npm run
 * articles:validate) — keep the two in sync.
 */

export const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export type ArticleFaq = { q: string; a: string };
export type ArticleSource = { title: string; url: string };

export type ArticleMeta = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  publishedAt: string; // YYYY-MM-DD
  updatedAt: string; // YYYY-MM-DD
  targetKeyword: string;
  keywords: string[];
  relatedSystems: string[];
  category: string;
  cover: string;
  coverAlt: string;
  /** Why the topic is timely (trend / news hook). Internal note, not rendered. */
  trend?: string;
  faq: ArticleFaq[];
  sources: ArticleSource[];
  readingMinutes: number;
  draft: boolean;
};

export type Article = ArticleMeta & {
  html: string;
  toc: { id: string; text: string }[];
};

function asString(value: unknown, fallback = ''): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value.trim() : fallback;
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => asString(v)).filter(Boolean) : [];
}

function readingMinutes(body: string): number {
  const words = body.replace(/[#>*_`\-[\]()!|]/g, ' ').split(/\s+/).filter(Boolean).length;
  // Persian technical prose reads at roughly 180–200 words per minute.
  return Math.max(1, Math.round(words / 190));
}

function renderMarkdown(body: string) {
  const toc: { id: string; text: string }[] = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 2) {
          const id = `section-${toc.length + 1}`;
          toc.push({ id, text: inner.replace(/<[^>]+>/g, '') });
          return `<h2 id="${id}">${inner}</h2>\n`;
        }
        return `<h${depth}>${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const isExternal = /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
        const titleAttr = title ? ` title="${title}"` : '';
        return isExternal
          ? `<a href="${href}"${titleAttr} target="_blank" rel="noopener">${text}</a>`
          : `<a href="${href}"${titleAttr}>${text}</a>`;
      },
      table(token: Tokens.Table) {
        // Wrap tables so they scroll horizontally on phones instead of the page.
        const header = token.header
          .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
          .join('');
        const rows = token.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join('')}</tr>`,
          )
          .join('');
        return `<div class="article-table"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  const html = marked.parse(body, { async: false }) as string;
  return { html, toc };
}

function parseFile(file: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = asString(data.slug) || file.replace(/\.md$/, '');
  const publishedAt = asString(data.publishedAt);
  const { html, toc } = renderMarkdown(content);
  return {
    slug,
    locale: (asString(data.locale) || 'fa') as Locale,
    title: asString(data.title),
    description: asString(data.description),
    publishedAt,
    updatedAt: asString(data.updatedAt) || publishedAt,
    targetKeyword: asString(data.targetKeyword),
    keywords: asStringList(data.keywords),
    relatedSystems: asStringList(data.relatedSystems),
    category: asString(data.category),
    cover: asString(data.cover) || '/og',
    coverAlt: asString(data.coverAlt) || asString(data.title),
    trend: asString(data.trend) || undefined,
    faq: Array.isArray(data.faq)
      ? data.faq
          .map((f: Record<string, unknown>) => ({ q: asString(f?.q), a: asString(f?.a) }))
          .filter((f: ArticleFaq) => f.q && f.a)
      : [],
    sources: Array.isArray(data.sources)
      ? data.sources
          .map((s: Record<string, unknown>) => ({ title: asString(s?.title), url: asString(s?.url) }))
          .filter((s: ArticleSource) => s.title && /^https?:\/\//.test(s.url))
      : [],
    readingMinutes: readingMinutes(content),
    draft: data.draft === true,
    html,
    toc,
  };
}

let cache: Article[] | null = null;

/** All published articles (drafts and future-dated files excluded), newest first. */
export function getAllArticles(): Article[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const today = new Date().toISOString().slice(0, 10);
  cache = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map(parseFile)
    .filter((a) => !a.draft && a.publishedAt && a.publishedAt <= today)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0));
  return cache;
}

export function getArticles(locale: Locale): Article[] {
  return getAllArticles().filter((a) => a.locale === locale);
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getArticles(locale).find((a) => a.slug === slug);
}

/** Latest articles that reference a given ceiling system — for topic-cluster links. */
export function getArticlesForSystem(locale: Locale, systemSlug: string, limit = 3): Article[] {
  return getArticles(locale)
    .filter((a) => a.relatedSystems.includes(systemSlug))
    .slice(0, limit);
}

/** Related reading: shares a system first, then newest. */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const others = getArticles(article.locale).filter((a) => a.slug !== article.slug);
  const score = (a: Article) => a.relatedSystems.filter((s) => article.relatedSystems.includes(s)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Display date. Persian pages use the Solar Hijri calendar readers expect. */
export function formatArticleDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T12:00:00Z`);
  const tag = locale === 'fa' ? 'fa-IR-u-ca-persian' : locale === 'ar' ? 'ar' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}
