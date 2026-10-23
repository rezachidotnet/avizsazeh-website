import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
export const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');
export const KEYWORD_BANK = path.join(ROOT, 'content', 'seo', 'keyword-bank.json');

export function systemSlugs() {
  const src = fs.readFileSync(path.join(ROOT, 'src/lib/content/system-slugs.ts'), 'utf8');
  const block = src.match(/CEILING_SYSTEM_SLUGS = \[([\s\S]*?)\]/)[1];
  return [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const str = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === 'string' ? v.trim() : '');

export function loadArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        file,
        data: {
          ...data,
          slug: str(data.slug),
          locale: str(data.locale) || 'fa',
          publishedAt: str(data.publishedAt),
          updatedAt: str(data.updatedAt),
          targetKeyword: str(data.targetKeyword),
        },
        body: content,
      };
    });
}

/** Normalise Persian/Arabic letter variants and spacing so keyword matching is robust. */
export function norm(text) {
  return String(text ?? '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[‌‏‎]/g, ' ')
    .replace(/[ً-ْ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
