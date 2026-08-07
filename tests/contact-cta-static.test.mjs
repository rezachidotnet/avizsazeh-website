import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('contact event names remain the established click events', async () => {
  const analytics = await source('src/lib/analytics.ts');
  assert.match(analytics, /type:\s*'whatsapp'\s*\|\s*'phone'\s*\|\s*'email'/);
  assert.match(analytics, /trackEvent\(`\$\{type\}_click`/);
  assert.match(analytics, /contact_type:\s*type/);
  assert.match(analytics, /destination_type:\s*type/);
});

test('tracked email links use email_click without sending the raw destination', async () => {
  const mailto = await source('src/components/analytics/TrackedMailto.tsx');
  assert.match(mailto, /href=\{`mailto:\$\{email\}`\}/);
  assert.match(mailto, /trackContactClick\('email',\s*\{\s*cta_location:\s*location\s*\}\)/);
  assert.doesNotMatch(mailto, /trackContactClick\('email',\s*\{[^}]*email/);
});

test('footer email CTAs are tracked and phone tracking remains intact', async () => {
  const footer = await source('src/components/layout/Footer.tsx');
  assert.match(footer, /import \{ TrackedMailto \} from '@\/components\/analytics\/TrackedMailto'/);
  assert.match(footer, /<TrackedMailto[\s\S]*location="footer_contact"[\s\S]*>\s*<svg/);
  assert.match(footer, /<TrackedMailto[\s\S]*location="footer_social"[\s\S]*aria-label="Email"/);
  assert.match(footer, /<TrackedTel[\s\S]*location="footer_contact"/);
  assert.match(footer, /<TrackedTel[\s\S]*location="footer_social"/);
  assert.doesNotMatch(footer, /trackContactClick\('email'[\s\S]*(company\.email|mailto:)/);
});

test('contact page primary email row is tracked alongside existing phone rows', async () => {
  const contact = await source('src/app/[locale]/contact/page.tsx');
  assert.match(contact, /import \{ TrackedMailto \} from '@\/components\/analytics\/TrackedMailto'/);
  assert.match(contact, /email:\s*company\.email,\s*track:\s*'contact_page_email'/);
  assert.match(contact, /<TrackedMailto[\s\S]*email=\{row\.email\}[\s\S]*location=\{row\.track\}/);
  assert.match(contact, /track:\s*'contact_page_phone'/);
  assert.match(contact, /track:\s*'contact_page_mobile'/);
});

test('RFQ success secondary WhatsApp CTA tracks only on click', async () => {
  const engine = await source('src/components/rfq/RfqEngine.tsx');
  assert.match(
    engine,
    /href=\{company\.whatsappUrl\}[\s\S]*external[\s\S]*onClick=\{\(\) =>\s*trackContactClick\('whatsapp', \{ cta_location: 'rfq_success_secondary' \}\)\s*\}/,
  );
  assert.ok(
    engine.indexOf("cta_location: 'rfq_success_secondary'") > engine.indexOf("if (result)"),
    'secondary WhatsApp tracking belongs to the success-rendered CTA',
  );
  assert.ok(
    engine.indexOf("cta_location: 'rfq_success_secondary'") > engine.indexOf("{t('successContact')}"),
    'secondary WhatsApp tracking is on the CTA, not RFQ success handling',
  );
});

test('contact click handlers do not include raw phone, email, or WhatsApp destinations', async () => {
  const paths = [
    'src/components/analytics/TrackedMailto.tsx',
    'src/components/analytics/TrackedTel.tsx',
    'src/components/contact/ContactRouting.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/MobileActionBar.tsx',
    'src/components/rfq/RfqEngine.tsx',
    'src/app/[locale]/contact/page.tsx',
  ];

  for (const path of paths) {
    const file = await source(path);
    for (const match of file.matchAll(/trackContactClick\([^)]*\)/g)) {
      assert.doesNotMatch(match[0], /company\.(email|mobile|mobileIntl|phoneConsult|whatsappUrl)|mailto:|tel:|wa\.me/);
    }
  }
});
