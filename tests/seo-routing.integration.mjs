import assert from 'node:assert/strict';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const SITE_URL = 'https://www.avizsazeh.ir';

const metadataPaths = [
  '/about',
  '/en/about',
  '/ar/about',
  '/engineering',
  '/en/engineering',
  '/ar/engineering',
  '/rfq',
  '/en/rfq',
  '/ar/rfq',
];

const russianRedirects = [
  ['/ru', '/en'],
  ['/ru/about', '/en/about'],
  ['/ru/engineering', '/en/engineering'],
  ['/ru/rfq?system=linear-ceiling', '/en/rfq?system=linear-ceiling'],
  ['/ru/legal/privacy', '/en/legal/privacy'],
  ['/ru/systems/linear-ceiling', '/en/systems/linear-ceiling'],
];

function localUrl(path) {
  return new URL(path, base).toString();
}

function canonicalFor(path) {
  const cleanPath = path.split('?')[0];
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath.replace(/\/$/, '')}`;
}

function pathWithoutLocale(path) {
  const cleanPath = path.split('?')[0];
  if (cleanPath === '/en' || cleanPath === '/ar') return '/';
  return cleanPath.replace(/^\/(en|ar)(?=\/)/, '') || '/';
}

function alternatesFor(path) {
  const routePath = pathWithoutLocale(path);
  const clean = routePath === '/' ? '' : routePath.replace(/\/$/, '');
  return {
    fa: `${SITE_URL}${clean}`,
    en: `${SITE_URL}/en${clean}`,
    ar: `${SITE_URL}/ar${clean}`,
    'x-default': `${SITE_URL}${clean}`,
  };
}

function links(html, rel) {
  const pattern = new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*>`, 'gi');
  return html.match(pattern) ?? [];
}

function attr(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))?.[1];
}

async function fetchText(path) {
  const response = await fetch(localUrl(path), { redirect: 'manual' });
  assert.equal(response.status, 200, `${path} should return 200`);
  return response.text();
}

async function assertMetadata(path) {
  const html = await fetchText(path);
  const canonicalLinks = links(html, 'canonical');
  assert.equal(canonicalLinks.length, 1, `${path} should emit exactly one canonical`);
  assert.equal(attr(canonicalLinks[0], 'href'), canonicalFor(path));
  assert.doesNotMatch(html, /hreflang=["']ru["']/i, `${path} must not emit Russian hreflang`);

  const alternateLinks = links(html, 'alternate');
  const found = Object.fromEntries(
    alternateLinks
      .map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')])
      .filter(([lang, href]) => lang && href),
  );
  assert.deepEqual(found, alternatesFor(path), `${path} alternates should be reciprocal`);
}

async function assertRedirect(source, destination) {
  const response = await fetch(localUrl(source), { redirect: 'manual' });
  assert.equal(response.status, 308, `${source} should permanently redirect`);
  const location = response.headers.get('location');
  assert.ok(location, `${source} should include Location`);
  assert.equal(new URL(location, base).pathname, destination.split('?')[0]);
  assert.equal(new URL(location, base).search, new URL(destination, base).search);

  const second = await fetch(new URL(location, base), { redirect: 'manual' });
  assert.notEqual(second.status, 308, `${source} should not create an app-level redirect chain`);
}

const sitemapResponse = await fetch(localUrl('/sitemap.xml'), { redirect: 'manual' });
assert.equal(sitemapResponse.status, 200, 'sitemap.xml should return 200');
const sitemapXml = await sitemapResponse.text();
assert.match(sitemapXml, /<urlset[\s\S]*<\/urlset>/, 'sitemap should be valid urlset XML');

const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(locs.length > 0, 'sitemap should contain URLs');
assert.equal(new Set(locs).size, locs.length, 'sitemap should not contain duplicate loc values');

for (const loc of locs) {
  assert.ok(loc.startsWith(SITE_URL), `${loc} should use canonical production host`);
  assert.ok(!loc.includes('/ru'), `${loc} should not contain Russian URLs`);
  assert.ok(!loc.includes('?'), `${loc} should not contain query strings`);
  const local = new URL(loc);
  const html = await fetchText(local.pathname);
  const canonicalLinks = links(html, 'canonical');
  assert.equal(canonicalLinks.length, 1, `${local.pathname} should emit one canonical`);
  assert.equal(attr(canonicalLinks[0], 'href'), loc, `${loc} should match page canonical`);
  assert.doesNotMatch(html, /noindex/i, `${loc} should not be noindex`);
}

for (const required of [
  `${SITE_URL}/about`,
  `${SITE_URL}/en/about`,
  `${SITE_URL}/ar/about`,
  `${SITE_URL}/engineering`,
  `${SITE_URL}/en/engineering`,
  `${SITE_URL}/ar/engineering`,
  `${SITE_URL}/rfq`,
  `${SITE_URL}/en/rfq`,
  `${SITE_URL}/ar/rfq`,
  `${SITE_URL}/en/legal/privacy`,
  `${SITE_URL}/en/legal/terms`,
]) {
  assert.ok(locs.includes(required), `sitemap should include ${required}`);
}

for (const path of metadataPaths) {
  await assertMetadata(path);
}

for (const path of ['/rfq?system=linear-ceiling', '/en/rfq?system=linear-ceiling', '/ar/rfq?system=linear-ceiling']) {
  const html = await fetchText(path);
  assert.equal(attr(links(html, 'canonical')[0], 'href'), canonicalFor(path));
  assert.ok(!locs.includes(canonicalFor(path) + '?system=linear-ceiling'), `${path} query URL must not be in sitemap`);
  assert.match(html, /linear-ceiling/, `${path} should expose the system slug to the RFQ form`);
}

for (const [source, destination] of russianRedirects) {
  await assertRedirect(source, destination);
}

console.log(`SEO routing integration checks passed against ${base}`);
