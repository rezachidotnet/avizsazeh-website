#!/usr/bin/env node
/**
 * Quality gate for /content/articles. Run before every commit of a new article:
 *   npm run articles:validate
 * Exits non-zero on any error so an automated writer cannot publish a broken,
 * thin or off-brand article.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadArticles, systemSlugs, norm } from './lib.mjs';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Brand communication rules (brand-guid/json/16-Communication Rules.json): no superlatives / hype.
const BANNED = ['بهترین', 'ارزان‌ترین', 'ارزانترین', 'بی‌نظیر', 'بی‌رقیب', 'شماره یک', 'بی‌نقص', 'معجزه', 'تضمین قیمت', 'the best', 'cheapest', 'unbeatable', 'world class'];
// Never publish prices that the company has not confirmed.
const PRICE_RE = /\d[\d,٬.]*\s*(?:هزار\s*)?(?:میلیون\s*)?تومان|\d[\d,٬.]*\s*ریال/;
const MIN_WORDS = { fa: 900, en: 800, ar: 800 };

const known = new Set(systemSlugs());
const articles = loadArticles();
const errors = [];
const warnings = [];
const seenSlugs = new Map();
const seenKeywords = new Map();
const onlyFile = process.argv[2];

for (const { file, data, body } of articles) {
  const err = (m) => errors.push(`${file}: ${m}`);
  const warn = (m) => warnings.push(`${file}: ${m}`);
  const d = data;

  // identity
  if (!SLUG_RE.test(d.slug)) err('slug must be lowercase latin kebab-case');
  if (`${d.slug}.md` !== file) err(`file name must be "${d.slug}.md"`);
  if (seenSlugs.has(d.slug)) err(`duplicate slug (also in ${seenSlugs.get(d.slug)})`);
  seenSlugs.set(d.slug, file);
  if (!['fa', 'en', 'ar'].includes(d.locale)) err('locale must be fa | en | ar');

  // dates
  if (!DATE_RE.test(d.publishedAt)) err('publishedAt must be YYYY-MM-DD');
  if (d.updatedAt && !DATE_RE.test(d.updatedAt)) err('updatedAt must be YYYY-MM-DD');
  if (d.updatedAt && d.updatedAt < d.publishedAt) err('updatedAt is before publishedAt');

  // SEO fields
  const title = String(d.title ?? '');
  const desc = String(d.description ?? '');
  if (title.length < 25 || title.length > 75) err(`title length ${title.length} (want 25–75 chars)`);
  if (desc.length < 110 || desc.length > 175) err(`description length ${desc.length} (want 110–175 chars)`);
  if (!d.targetKeyword) err('targetKeyword is required');
  const kw = norm(d.targetKeyword);
  if (kw) {
    if (seenKeywords.has(kw)) err(`targetKeyword "${d.targetKeyword}" already used by ${seenKeywords.get(kw)} — pick a new keyword or update that article instead`);
    seenKeywords.set(kw, file);
    if (!norm(title).includes(kw)) warn('targetKeyword does not appear verbatim in the title');
    const intro = norm(body.split(/\n##\s/)[0]);
    if (!intro.includes(kw)) err('targetKeyword must appear in the introduction (before the first ## heading)');
  }
  if (!Array.isArray(d.keywords) || d.keywords.length < 3) err('keywords: list at least 3 secondary keywords');
  if (!d.category) err('category is required');

  // systems
  const rel = Array.isArray(d.relatedSystems) ? d.relatedSystems : [];
  if (!rel.length) err('relatedSystems must list at least one system slug');
  for (const s of rel) if (!known.has(s)) err(`unknown system slug "${s}"`);

  // cover
  if (!d.cover) err('cover is required');
  else if (!d.cover.startsWith('/')) err('cover must be a site-relative path in /public');
  else if (!fs.existsSync(path.join(ROOT, 'public', d.cover))) err(`cover not found: public${d.cover}`);
  if (!d.coverAlt) err('coverAlt is required');

  // faq + sources
  const faq = Array.isArray(d.faq) ? d.faq : [];
  if (faq.length < 3) err('faq: at least 3 question/answer pairs');
  for (const f of faq) if (!f?.q || !f?.a) err('faq entries need both q and a');
  const sources = Array.isArray(d.sources) ? d.sources : [];
  if (!sources.length) err('sources: cite at least one external source');
  for (const s of sources) if (!s?.title || !/^https:\/\//.test(s?.url ?? '')) err('sources need title + https url');

  // body
  const words = body.split(/\s+/).filter(Boolean).length;
  const min = MIN_WORDS[d.locale] ?? 800;
  if (words < min) err(`body has ${words} words (minimum ${min})`);
  const h2 = (body.match(/^##\s+/gm) ?? []).length;
  if (h2 < 4) err(`body needs at least 4 "##" sections (has ${h2})`);
  if (/^#\s+/m.test(body)) err('do not use a level-1 "#" heading in the body — the page renders the title as H1');
  const internalSystems = new Set([...body.matchAll(/\]\((?:https:\/\/www\.avizsazeh\.com)?\/systems\/([a-z-]+)/g)].map((m) => m[1]).filter((s) => s !== 'compare'));
  if (internalSystems.size < 2) err('link to at least 2 different /systems/<slug> pages');
  for (const s of internalSystems) if (!known.has(s)) err(`broken internal link /systems/${s}`);
  if (!/\]\((?:https:\/\/www\.avizsazeh\.com)?\/rfq/.test(body)) err('include a link to /rfq');
  const lower = body.toLowerCase();
  for (const b of BANNED) if (lower.includes(b.toLowerCase()) || title.includes(b)) err(`banned hype phrase "${b}" (brand communication rules)`);
  if (PRICE_RE.test(body)) err('contains a price in Toman/Rial — prices must not be published without company confirmation');
  if (/TODO|lorem ipsum|\[citation needed\]/i.test(body)) err('contains placeholder text');
}

// cadence
const dates = articles.map((a) => a.data.publishedAt).filter(Boolean).sort();
for (let i = 1; i < dates.length; i++) if (dates[i] === dates[i - 1]) warnings.push(`two articles share publishedAt ${dates[i]}`);

const scope = (list) => (onlyFile ? list.filter((m) => m.startsWith(onlyFile)) : list);
for (const w of scope(warnings)) console.warn(`warn  ${w}`);
for (const e of scope(errors)) console.error(`error ${e}`);
const count = scope(errors).length;
console.log(`\n${articles.length} article(s) checked — ${count} error(s), ${scope(warnings).length} warning(s).`);
process.exit(count ? 1 : 0);
