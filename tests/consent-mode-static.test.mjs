import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const require = createRequire(import.meta.url);
const ts = require('typescript');

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

async function loadConsentModule() {
  const consent = await source('src/lib/consent.ts');
  const { outputText } = ts.transpileModule(consent, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const sandbox = {
    exports: {},
    module: { exports: {} },
    require,
    Set,
    Date,
    JSON,
    Number,
    decodeURIComponent,
    encodeURIComponent,
    CustomEvent: class CustomEvent {},
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(outputText, sandbox, { filename: 'consent.cjs' });
  return sandbox.module.exports;
}

function choice({ analytics, marketing }) {
  return {
    necessary: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Google consent defaults to denied for analytics and advertising storage without a saved choice', async () => {
  const { toGoogleConsentState } = await loadConsentModule();

  assert.deepEqual(plain(toGoogleConsentState(null)), {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted',
  });
});

test('Google consent maps analytics and marketing choices independently', async () => {
  const { toGoogleConsentState } = await loadConsentModule();

  assert.deepEqual(plain(toGoogleConsentState(choice({ analytics: true, marketing: false }))), {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted',
  });

  assert.deepEqual(plain(toGoogleConsentState(choice({ analytics: true, marketing: true }))), {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    security_storage: 'granted',
  });

  assert.deepEqual(plain(toGoogleConsentState(choice({ analytics: false, marketing: true }))), {
    analytics_storage: 'denied',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    security_storage: 'granted',
  });
});

test('Google advertising consent can transition both denied-to-granted and granted-to-denied', async () => {
  const { toGoogleConsentState } = await loadConsentModule();
  const marketingDenied = toGoogleConsentState(choice({ analytics: true, marketing: false }));
  const marketingGranted = toGoogleConsentState(choice({ analytics: true, marketing: true }));

  for (const signal of ['ad_storage', 'ad_user_data', 'ad_personalization']) {
    assert.equal(marketingDenied[signal], 'denied');
    assert.equal(marketingGranted[signal], 'granted');
  }

  const revoked = toGoogleConsentState(choice({ analytics: true, marketing: false }));
  for (const signal of ['ad_storage', 'ad_user_data', 'ad_personalization']) {
    assert.equal(revoked[signal], 'denied');
  }
});

test('Google consent state stays categorical and does not include PII-bearing fields', async () => {
  const { toGoogleConsentState } = await loadConsentModule();
  const googleConsent = toGoogleConsentState(choice({ analytics: true, marketing: true }));

  for (const key of Object.keys(googleConsent)) {
    assert.doesNotMatch(key, /phone|email|rfq|client|session|cookie|token|secret|credential/i);
  }
  for (const value of Object.values(googleConsent)) {
    assert.match(value, /^(granted|denied)$/);
  }
});

test('advertising consent signals are not permanently hardcoded to denied in the active mapper', async () => {
  const consent = await source('src/lib/consent.ts');
  const mapperStart = consent.indexOf('export function toGoogleConsentState');
  const mapperEnd = consent.indexOf('export function saveConsent');
  const mapper = consent.slice(mapperStart, mapperEnd);

  assert.match(mapper, /const marketingGranted = Boolean\(choice\?\.marketing\)/);
  assert.doesNotMatch(mapper, /ad_storage:\s*'denied'/);
  assert.doesNotMatch(mapper, /ad_user_data:\s*'denied'/);
  assert.doesNotMatch(mapper, /ad_personalization:\s*'denied'/);
  assert.match(mapper, /analytics_storage:\s*analyticsGranted \? 'granted' : 'denied'/);
});
