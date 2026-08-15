import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('FAQ data model has stable non-localized ids for every FAQ item', async () => {
  const files = [
    'src/lib/content/systems.ts',
    'src/lib/content/hub.ts',
    'src/lib/content/applications.ts',
  ];
  const seen = new Set();

  for (const file of files) {
    const text = await source(file);
    const questions = text.match(/\n\s*q:\s*\{/g) ?? [];
    const ids = [...text.matchAll(/\n\s*id:\s*'([^']+)'/g)].map((match) => match[1]);
    assert.equal(ids.length, questions.length, `${file} should give each FAQ question one id`);

    for (const id of ids) {
      assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${id} should be a semantic slug`);
      assert.ok(!/^\d+$/.test(id), `${id} must not be an array index`);
      assert.ok(!seen.has(id), `${id} should be globally unique`);
      seen.add(id);
    }
  }
});

test('FAQ expansion helper pushes only the required dataLayer payload', async () => {
  const analytics = await source('src/lib/analytics.ts');
  assert.match(analytics, /export type FaqExpandParams = \{[\s\S]*page_language: 'fa' \| 'en' \| 'ar';[\s\S]*\}/);
  assert.match(analytics, /event:\s*'faq_expand'/);
  assert.match(analytics, /faq_question:\s*params\.faq_question\.trim\(\)/);
  assert.match(analytics, /faq_position:\s*params\.faq_position/);
  assert.match(analytics, /window\.dataLayer = window\.dataLayer \|\| \[\];/);
  assert.match(analytics, /window\.dataLayer\.push\(payload\)/);
  assert.doesNotMatch(analytics, /gtag\(['"]event['"],\s*['"]faq_expand/);
});

test('FAQ tracking is tied to explicit FAQ interaction, not render state', async () => {
  const details = await source('src/components/system/TrackedFAQDetails.tsx');
  assert.doesNotMatch(details, /useEffect/);
  assert.doesNotMatch(details, /onToggle/);
  assert.match(details, /onClick=\{trackOpening\}/);
  assert.match(details, /onKeyDown=\{handleSummaryKeyDown\}/);
  assert.match(details, /ignoreNextClickRef/);
  assert.match(details, /if \(!details \|\| details\.open\) return;/);
  assert.match(details, /const shouldOpen = !details\.open;/);
  assert.match(details, /if \(shouldOpen\) \{\s*trackFaqExpand\(analytics\);/);
});

test('SystemFAQ supplies localized question, one-based position, locale and stable category', async () => {
  const systemFaq = await source('src/components/system/SystemFAQ.tsx');
  assert.match(systemFaq, /const question = localized\(item\.q, locale\)\.trim\(\);/);
  assert.match(systemFaq, /faq_id:\s*item\.id/);
  assert.match(systemFaq, /faq_question:\s*question/);
  assert.match(systemFaq, /faq_category:\s*category/);
  assert.match(systemFaq, /faq_position:\s*index \+ 1/);
  assert.match(systemFaq, /page_language:\s*locale/);

  const systemPage = await source('src/app/[locale]/systems/[slug]/page.tsx');
  const hubPage = await source('src/app/[locale]/metal-suspended-ceiling/page.tsx');
  const appPage = await source('src/app/[locale]/applications/[slug]/page.tsx');

  assert.match(systemPage, /category=\{system\.slug\}/);
  assert.match(hubPage, /category="metal-suspended-ceiling"/);
  assert.match(appPage, /category=\{app\.slug\}/);
});

test('default unprefixed routes keep Persian locale and FAQ tracking accepts supported locales', async () => {
  const faSystemPage = await source('src/app/(fa)/systems/[slug]/page.tsx');
  const faHubPage = await source('src/app/(fa)/metal-suspended-ceiling/page.tsx');
  const faAppPage = await source('src/app/(fa)/applications/[slug]/page.tsx');
  const routing = await source('src/i18n/routing.ts');

  assert.match(routing, /defaultLocale:\s*'fa'/);
  assert.match(faSystemPage, /locale:\s*'fa'/);
  assert.match(faHubPage, /locale:\s*'fa'/);
  assert.match(faAppPage, /locale:\s*'fa'/);
});

test('existing page_view and contact tracking paths remain separate from faq_expand', async () => {
  const analytics = await source('src/lib/analytics.ts');
  const pageView = await source('src/components/analytics/PageViewTracker.tsx');
  const trackedTel = await source('src/components/analytics/TrackedTel.tsx');
  const trackedMailto = await source('src/components/analytics/TrackedMailto.tsx');

  assert.match(analytics, /trackEvent\('page_view', params,/);
  assert.match(analytics, /trackEvent\(`\$\{type\}_click`,/);
  assert.match(pageView, /trackPageView\(\{/);
  assert.doesNotMatch(pageView, /faq_expand|trackFaqExpand/);
  assert.match(trackedTel, /trackContactClick\('phone'/);
  assert.match(trackedMailto, /trackContactClick\('email'/);
});

test('no non-FAQ accordion source is instrumented as faq_expand', async () => {
  const trackedFaqDetails = await source('src/components/system/TrackedFAQDetails.tsx');
  const systemFaq = await source('src/components/system/SystemFAQ.tsx');

  assert.match(trackedFaqDetails, /trackFaqExpand/);
  assert.match(systemFaq, /TrackedFAQDetails/);
});
