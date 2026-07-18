export const CONSENT_STORAGE_KEY = 'avizsazeh_consent_v1';
export const CONSENT_SCHEMA_VERSION = 1;
const MAX_CONSENT_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
};

export type ConsentUpdate = {
  analytics: boolean;
  marketing: boolean;
};

export type ConsentStatus =
  | 'unknown'
  | 'analytics_granted'
  | 'analytics_denied'
  | 'all_granted'
  | 'custom';

export type GoogleConsentState = {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  security_storage: 'granted';
};

export type AnalyticsDataLayerItem =
  | { event?: string; [key: string]: string | number | boolean | undefined }
  | IArguments
  | unknown[];

export type AnalyticsConsentCommand = [
  'consent',
  'default' | 'update',
  GoogleConsentState,
];

export type AnalyticsGtagCommand =
  AnalyticsConsentCommand;

export type ConsentSnapshot = {
  choice: ConsentChoice | null;
  status: ConsentStatus;
  analyticsGranted: boolean;
  marketingGranted: boolean;
  revision: number;
};

declare global {
  interface Window {
    __avzConsentSnapshot?: ConsentChoice | null;
    __avzConsentRevision?: number;
    dataLayer?: AnalyticsDataLayerItem[];
    gtag?: (...args: AnalyticsGtagCommand) => void;
  }
}

const listeners = new Set<() => void>();
let revision = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function toBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function cloneConsent(choice: ConsentChoice | null): ConsentChoice | null {
  return choice
    ? {
        necessary: true,
        analytics: choice.analytics,
        marketing: choice.marketing,
        updatedAt: choice.updatedAt,
        version: choice.version,
      }
    : null;
}

function isValidConsentChoice(value: unknown): value is ConsentChoice {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ConsentChoice>;
  if (candidate.necessary !== true) return false;
  if (!toBoolean(candidate.analytics) || !toBoolean(candidate.marketing)) return false;
  if (candidate.version !== CONSENT_SCHEMA_VERSION) return false;
  if (typeof candidate.updatedAt !== 'string') return false;
  const updatedAt = Date.parse(candidate.updatedAt);
  if (Number.isNaN(updatedAt)) return false;
  if (Date.now() - updatedAt > MAX_CONSENT_AGE_MS) return false;
  return true;
}

function parseConsentJson(raw: string | null | undefined): ConsentChoice | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isValidConsentChoice(parsed) ? cloneConsent(parsed) : null;
  } catch {
    return null;
  }
}

export function readStoredConsent(cookieSource?: string | null): ConsentChoice | null {
  if (!cookieSource) return null;
  const directValue = cookieSource.includes('=') ? getCookieValue(cookieSource, CONSENT_STORAGE_KEY) : cookieSource;
  return parseConsentJson(safeDecode(directValue));
}

function getCookieValue(cookieSource: string, key: string): string | null {
  const parts = cookieSource.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${key}=`)) continue;
    return trimmed.slice(key.length + 1);
  }
  return null;
}

function safeDecode(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeEncode(value: string): string {
  try {
    return encodeURIComponent(value);
  } catch {
    return value;
  }
}

function readBootstrapConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const bootstrap = window.__avzConsentSnapshot;
  return isValidConsentChoice(bootstrap) ? cloneConsent(bootstrap) : null;
}

function getCurrentChoice(): ConsentChoice | null {
  if (typeof window !== 'undefined' && window.__avzConsentSnapshot) {
    return isValidConsentChoice(window.__avzConsentSnapshot)
      ? cloneConsent(window.__avzConsentSnapshot)
      : null;
  }
  return cloneConsent(currentSnapshot.choice);
}

function deriveStatus(choice: ConsentChoice | null): ConsentStatus {
  if (!choice) return 'unknown';
  if (choice.analytics && choice.marketing) return 'all_granted';
  if (choice.analytics && !choice.marketing) return 'analytics_granted';
  if (!choice.analytics && !choice.marketing) return 'analytics_denied';
  return 'custom';
}

function buildSnapshot(choice: ConsentChoice | null): ConsentSnapshot {
  const normalized = cloneConsent(choice);
  return {
    choice: normalized,
    status: deriveStatus(normalized),
    analyticsGranted: Boolean(normalized?.analytics),
    marketingGranted: Boolean(normalized?.marketing),
    revision,
  };
}

function defaultBootstrapChoice(): ConsentChoice | null {
  return readBootstrapConsent();
}

let currentSnapshot: ConsentSnapshot = buildSnapshot(defaultBootstrapChoice());

function consentMatches(left: ConsentChoice | null, right: ConsentChoice | null): boolean {
  if (left === right) return true;
  if (!left || !right) return false;
  return (
    left.necessary === right.necessary &&
    left.analytics === right.analytics &&
    left.marketing === right.marketing &&
    left.updatedAt === right.updatedAt &&
    left.version === right.version
  );
}

function notify(): void {
  for (const listener of listeners) listener();
}

function writeCookie(choice: ConsentChoice | null): void {
  if (typeof document === 'undefined') return;
  try {
    if (!choice) {
      document.cookie = `${CONSENT_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
      return;
    }
    const payload = safeEncode(JSON.stringify(choice));
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_STORAGE_KEY}=${payload}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax${secure}`;
  } catch {
    /* keep in-memory consent state usable when cookie storage is unavailable */
  }
}

function syncBootstrap(choice: ConsentChoice | null): void {
  if (typeof window === 'undefined') return;
  window.__avzConsentSnapshot = cloneConsent(choice);
  window.__avzConsentRevision = revision;
}

function applyGoogleConsent(choice: ConsentChoice | null): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', toGoogleConsentState(choice));
}

function dispatchConsentChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('avizsazeh:consent-change', {
      detail: {
        analytics: currentSnapshot.analyticsGranted,
        marketing: currentSnapshot.marketingGranted,
        version: currentSnapshot.choice?.version ?? CONSENT_SCHEMA_VERSION,
        status: currentSnapshot.status,
        revision: currentSnapshot.revision,
      },
    }),
  );
}

function updateSnapshot(choice: ConsentChoice | null, persist = true): ConsentSnapshot {
  const nextChoice = cloneConsent(choice);
  currentSnapshot = buildSnapshot(nextChoice);
  revision += 1;
  currentSnapshot.revision = revision;
  syncBootstrap(nextChoice);
  applyGoogleConsent(nextChoice);
  if (persist) writeCookie(nextChoice);
  dispatchConsentChange();
  notify();
  return currentSnapshot;
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof document === 'undefined') return cloneConsent(currentSnapshot.choice);
  return readStoredConsent(document.cookie);
}

export function getConsentSnapshot(): ConsentSnapshot {
  if (typeof window !== 'undefined') {
    const bootstrap = window.__avzConsentSnapshot;
    const bootstrapRevision =
      typeof window.__avzConsentRevision === 'number' ? window.__avzConsentRevision : 0;
    if (
      isValidConsentChoice(bootstrap) &&
      (bootstrapRevision !== currentSnapshot.revision || !consentMatches(bootstrap, currentSnapshot.choice))
    ) {
      currentSnapshot = buildSnapshot(bootstrap);
      currentSnapshot.revision = bootstrapRevision;
      revision = currentSnapshot.revision;
    }
  }
  return currentSnapshot;
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toGoogleConsentState(choice: ConsentChoice | null): GoogleConsentState {
  const analyticsGranted = Boolean(choice?.analytics);
  return {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted',
  };
}

export function saveConsent(choice: ConsentChoice): ConsentChoice {
  if (!isValidConsentChoice(choice)) {
    throw new Error('Invalid consent choice');
  }
  updateSnapshot(choice);
  return cloneConsent(choice)!;
}

export function clearConsent(): void {
  updateSnapshot(null);
}

export function updateConsent(update: ConsentUpdate): ConsentChoice {
  const nextChoice: ConsentChoice = {
    necessary: true,
    analytics: update.analytics,
    marketing: update.marketing,
    updatedAt: nowIso(),
    version: CONSENT_SCHEMA_VERSION,
  };

  updateSnapshot(nextChoice);
  return cloneConsent(nextChoice)!;
}

export function hasAnalyticsConsent(): boolean {
  return getConsentSnapshot().analyticsGranted;
}

export function hasMarketingConsent(): boolean {
  return getConsentSnapshot().marketingGranted;
}
