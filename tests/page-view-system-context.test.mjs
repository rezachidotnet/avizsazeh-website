import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('no active runtime source emits system_page_view', async () => {
  const pageViewTracker = await source('src/components/analytics/PageViewTracker.tsx');
  const systemPage = await source('src/app/[locale]/systems/[slug]/page.tsx');
  const analytics = await source('src/lib/analytics.ts');

  assert.doesNotMatch(pageViewTracker, /system_page_view/);
  assert.doesNotMatch(systemPage, /system_page_view|<TrackView|TrackView/);
  assert.doesNotMatch(analytics, /system_page_view/);
});

test('page_view includes ceiling_system and preserves undefined for non-system pages', async () => {
  const pageViewTracker = await source('src/components/analytics/PageViewTracker.tsx');
  const analytics = await source('src/lib/analytics.ts');

  assert.match(pageViewTracker, /ceiling_system:\s*ceilingSystemFromPath\(pathname\)/);
  assert.match(pageViewTracker, /page_path:\s*pagePath/);
  assert.match(pageViewTracker, /const pagePath = currentPagePath\(pathname\)/);
  assert.match(analytics, /preserveUndefinedKeys:\s*\['ceiling_system'\]/);
  assert.match(analytics, /if \(preserveUndefinedKeys\.has\(key\)\) out\[key\] = undefined;/);
  assert.match(analytics, /trackEvent\('page_view', params,/);
});

test('system route detection uses the authoritative ceiling-system slug allowlist', async () => {
  const slugs = await source('src/lib/content/system-slugs.ts');
  const helper = await source('src/lib/analytics-system-context.ts');
  const systems = await source('src/lib/content/systems.ts');

  for (const slug of ['linear-ceiling', 'open-cell', 'metal-tile', 'baffle']) {
    assert.match(slugs, new RegExp(`'${slug}'`));
  }
  const allowlist = [...slugs.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const contentSlugs = [...systems.matchAll(/\n\s*slug:\s*'([^']+)'/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(allowlist, contentSlugs);
  assert.match(slugs, /export const systemSlugs: readonly string\[\] = CEILING_SYSTEM_SLUGS/);
  assert.match(slugs, /export function isCeilingSystemSlug/);
  assert.match(systems, /export \{ systemSlugs \} from '\.\/system-slugs';/);
  assert.match(helper, /isCeilingSystemSlug\(slug\)/);
});

test('system route detection handles locales, trailing slashes, queries and unknown slugs', async () => {
  const helper = await source('src/lib/analytics-system-context.ts');

  assert.match(helper, /const LOCALE_SEGMENTS = new Set\(\['fa', 'en', 'ar'\]\)/);
  assert.match(helper, /pathname\.split\(\/\[\?#\]\/\)/);
  assert.match(helper, /segments\.length !== offset \+ 2/);
  assert.match(helper, /segments\[offset\] !== 'systems'/);
  assert.match(helper, /isCeilingSystemSlug\(slug\) \? slug : undefined/);
});

test('page_view route key, location, referrer, title and language behavior remains on the existing path', async () => {
  const pageViewTracker = await source('src/components/analytics/PageViewTracker.tsx');

  assert.match(pageViewTracker, /const key = routeKey\(pathname\)/);
  assert.match(pageViewTracker, /if \(key === lastSentRouteKey\) return;/);
  assert.match(pageViewTracker, /const location = currentLocation\(pathname\)/);
  assert.match(pageViewTracker, /const referrer = lastPageLocation \?\? sanitizeLocation\(document\.referrer\)/);
  assert.match(pageViewTracker, /page_title:\s*document\.title/);
  assert.match(pageViewTracker, /page_language:\s*languageFromPath\(pathname\)/);
  assert.match(pageViewTracker, /lastPageLocation = location/);
});

test('FAQ, lead and contact analytics remain on their existing event helpers', async () => {
  const analytics = await source('src/lib/analytics.ts');
  const faqDetails = await source('src/components/system/TrackedFAQDetails.tsx');
  const rfq = await source('src/components/rfq/RfqEngine.tsx');
  const contactTel = await source('src/components/analytics/TrackedTel.tsx');
  const contactMail = await source('src/components/analytics/TrackedMailto.tsx');

  assert.match(analytics, /event:\s*'faq_expand'/);
  assert.match(faqDetails, /trackFaqExpand\(analytics\)/);
  assert.match(rfq, /ceiling_system:\s*draft\.systemPreference \|\| undefined/);
  assert.match(rfq, /trackEvent\('rfq_submit'/);
  assert.match(contactTel, /trackContactClick\('phone'/);
  assert.match(contactMail, /trackContactClick\('email'/);
});
