import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('active public locales are exactly fa, en, ar', async () => {
  const routing = await source('src/i18n/routing.ts');
  assert.match(routing, /RUSSIAN_LOCALE_ENABLED\s*=\s*false/);
  assert.match(routing, /publicLocales\s*=\s*\['fa', 'en', 'ar'\] as const/);
  assert.doesNotMatch(routing, /locales:\s*\[[^\]]*'ru'/);
  assert.doesNotMatch(routing, /localeDirection[\s\S]*ru:/);
});

test('SEO locale surfaces derive from public locales and exclude Russian', async () => {
  const seo = await source('src/lib/seo.ts');
  assert.match(seo, /SEO_LOCALES\s*=\s*publicLocales/);
  assert.match(seo, /alternates\['x-default'\]\s*=\s*localeUrl\('fa', path\)/);
  assert.doesNotMatch(seo, /ru_RU|['"]ru['"]/);
});

test('language switcher has no Russian option or label', async () => {
  const switcher = await source('src/components/layout/LocaleSwitcher.tsx');
  assert.match(switcher, /publicLocales/);
  assert.doesNotMatch(switcher, /RU|ru:/);
});

test('middleware permanently maps Russian paths to English and preserves search params', async () => {
  const middleware = await source('src/middleware.ts');
  assert.match(middleware, /pathname === '\/ru' \|\| pathname\.startsWith\('\/ru\/'\)/);
  assert.match(middleware, /pathname\.replace\(\/\^\\\/ru/);
  assert.match(middleware, /NextResponse\.redirect\(url, 308\)/);
  assert.doesNotMatch(middleware, /url\.search\s*=/);
});

test('RFQ reads the system query parameter and metadata uses clean /rfq path', async () => {
  const rfqPage = await source('src/app/[locale]/rfq/page.tsx');
  const rfqEngine = await source('src/components/rfq/RfqEngine.tsx');
  assert.match(rfqPage, /path:\s*'\/rfq'/);
  assert.match(rfqEngine, /new URLSearchParams\(window\.location\.search\)\.get\('system'\)/);
});
