#!/usr/bin/env node
/**
 * Shows which keywords are still unused and which systems are under-covered,
 * so the scheduled writer can pick the next article topic:
 *   npm run articles:next
 */
import fs from 'node:fs';
import { KEYWORD_BANK, loadArticles, systemSlugs, norm } from './lib.mjs';

const bank = JSON.parse(fs.readFileSync(KEYWORD_BANK, 'utf8'));
const articles = loadArticles().sort((a, b) => (a.data.publishedAt < b.data.publishedAt ? 1 : -1));
const used = new Set();
for (const a of articles) {
  used.add(norm(a.data.targetKeyword));
}

const coverage = Object.fromEntries(systemSlugs().map((s) => [s, 0]));
for (const a of articles) for (const s of a.data.relatedSystems ?? []) if (s in coverage) coverage[s] += 1;

const candidates = [];
for (const c of bank.clusters) {
  for (const k of c.keywords) {
    if (used.has(norm(k.kw))) continue;
    const sys = c.system;
    // Lower score = better: priority first, then search-console boost, then thin system coverage.
    const score = (k.priority ?? 3) * 10 - (c.id === 'search-console' ? 25 : 0) + (sys ? coverage[sys] ?? 0 : 1);
    candidates.push({ score, keyword: k.kw, cluster: c.id, system: sys ?? '—', intent: k.intent ?? '', note: k.note ?? '' });
  }
}
candidates.sort((a, b) => a.score - b.score);

console.log('\n## Recent articles');
for (const a of articles.slice(0, 10)) console.log(`- ${a.data.publishedAt}  ${a.data.slug}  [${a.data.targetKeyword}]`);
console.log('\n## Articles per system');
for (const [s, n] of Object.entries(coverage)) console.log(`- ${s}: ${n}`);
console.log('\n## Next keyword candidates (best first)');
for (const c of candidates.slice(0, 15)) console.log(`- ${c.keyword}  · cluster=${c.cluster} · system=${c.system} · ${c.intent}${c.note ? ` · NOTE: ${c.note}` : ''}`);
console.log(`\n${candidates.length} unused keyword(s) in the bank.`);
