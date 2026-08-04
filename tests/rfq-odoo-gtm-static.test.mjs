import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('Odoo integration uses explicit configured database for authentication and writes', async () => {
  const client = await source('src/lib/odoo/client.ts');
  assert.match(client, /const db = process\.env\.ODOO_DB/);
  assert.doesNotMatch(client, /sipanel|cyansteel|localhost|127\.0\.0\.1/i);
  assert.match(client, /common'[\s\S]*'login'[\s\S]*config\.db/);
  assert.match(client, /'crm\.lead'[\s\S]*'create'[\s\S]*config\.db/);
  assert.match(client, /'ir\.attachment'[\s\S]*'create'[\s\S]*config\.db/);
});

test('Odoo credential supports API key fallback without exposing credentials', async () => {
  const client = await source('src/lib/odoo/client.ts');
  assert.match(client, /process\.env\.ODOO_API_KEY \|\| process\.env\.ODOO_PASSWORD/);
  assert.doesNotMatch(client, /console\.(log|info|warn|error)[^\n]*(password|credential|api[_-]?key)/i);
});

test('optional Odoo origin-IP transport preserves HTTPS identity', async () => {
  const client = await source('src/lib/odoo/client.ts');
  assert.match(client, /process\.env\.ODOO_ORIGIN_IP/);
  assert.match(client, /servername:\s*url\.hostname/);
  assert.match(client, /host:\s*url\.host/);
  assert.match(client, /url\.protocol !== 'https:'/);
  assert.doesNotMatch(client, /rejectUnauthorized:\s*false|NODE_TLS_REJECT_UNAUTHORIZED/);
});

test('RFQ API fails closed when Odoo configuration or delivery fails', async () => {
  const route = await source('src/app/api/rfq/submit/route.ts');
  assert.match(route, /if \(!isOdooConfigured\(\)\)/);
  assert.match(route, /status:\s*503/);
  assert.match(route, /crm_delivery_failed/);
  assert.match(route, /status:\s*502/);
  assert.doesNotMatch(route, /Odoo not configured \(log-only\)/);
  assert.doesNotMatch(route, /logBackupLead/);
});

test('RFQ response contract distinguishes success from Odoo failure', async () => {
  const rfq = await source('src/lib/rfq.ts');
  const route = await source('src/app/api/rfq/submit/route.ts');
  assert.match(rfq, /ok:\s*true/);
  assert.match(rfq, /requestId:\s*string/);
  assert.match(rfq, /odoo\?:\s*RfqOdooStatus/);
  assert.match(route, /ok:\s*false[\s\S]*odoo:\s*\{\s*delivered:\s*false\s*\}/);
  assert.match(route, /result\.odoo = result\.lead/);
});

test('optional Odoo custom fields are discovered before crm.lead.create', async () => {
  const client = await source('src/lib/odoo/client.ts');
  assert.match(client, /supportedLeadCustomFields/);
  assert.match(client, /'fields_get'/);
  assert.match(client, /if \(supported\.has\(key\)\) leadValues\[key\] = value/);
});

test('attachment upload validates content signatures and preserves created lead on attachment failure', async () => {
  const route = await source('src/app/api/rfq/submit/route.ts');
  const client = await source('src/lib/odoo/client.ts');
  assert.match(route, /looksLikeAllowedFile/);
  assert.match(route, /%PDF-|ffd8ff|89504e470d0a1a0a|AC10/);
  assert.match(client, /attachmentFailures \+= 1/);
  assert.match(client, /Lead already created|lead is still delivered/i);
});

test('RFQ client prevents duplicate submit and does not track success on failed Odoo delivery', async () => {
  const engine = await source('src/components/rfq/RfqEngine.tsx');
  assert.match(engine, /const submittingRef = useRef\(false\)/);
  assert.match(engine, /if \(submittingRef\.current\) return/);
  assert.match(engine, /headers:\s*\{\s*'x-rfq-request-id': submissionEventId\s*\}/);
  assert.match(engine, /data\.odoo\?\.delivered === false/);
  assert.ok(engine.indexOf("trackEvent('rfq_submit'") > engine.indexOf('if (!res.ok'));
});

test('GTM is configured once in the shared locale layout and remains consent gated', async () => {
  const analyticsConfig = await source('src/lib/analytics-config.ts');
  const analytics = await source('src/components/analytics/Analytics.tsx');
  const layout = await source('src/app/[locale]/layout.tsx');
  const faLayout = await source('src/app/(fa)/layout.tsx');
  assert.match(analyticsConfig, /process\.env\.NEXT_PUBLIC_GTM_ID/);
  assert.match(analyticsConfig, /\^GTM-\[A-Z0-9-\]\+/);
  assert.match(analytics, /snapshot\.analyticsGranted/);
  assert.match(analytics, /document\.getElementById\('gtm-loader'\)/);
  assert.match(layout, /<Analytics \/>/);
  assert.match(layout, /googletagmanager\.com\/ns\.html\?id=\$\{analyticsConfig\.gtmId\}/);
  assert.match(faLayout, /return <LocaleLayout params=\{params\}>\{children\}<\/LocaleLayout>/);
});

test('analytics events use dataLayer only after analytics consent', async () => {
  const analytics = await source('src/lib/analytics.ts');
  const bootstrap = await source('src/components/consent/ConsentBootstrap.tsx');
  assert.match(analytics, /if \(!getConsentSnapshot\(\)\.analyticsGranted\) return/);
  assert.match(analytics, /window\.dataLayer = window\.dataLayer \?\? \[\]/);
  assert.match(analytics, /window\.dataLayer\.push\(\{ event: name, \.\.\.payload \}\)/);
  assert.match(bootstrap, /analytics_storage:\s*'denied'/);
  assert.match(bootstrap, /window\.gtag\('consent', 'default', defaultConsent\)/);
});
