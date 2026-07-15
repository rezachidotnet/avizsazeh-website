import { analyticsConfig } from './analytics-config';
import {
  getConsentSnapshot,
  type AnalyticsDataLayerItem,
} from './consent';

export type AnalyticsParamValue = string | number | boolean | undefined | null;
export type EventParams = Record<string, AnalyticsParamValue>;
type CleanEventParams = Record<string, string | number | boolean>;

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const UTM_STORAGE_KEY = 'aecs_utm';
const MAX_UTM_LENGTH = 120;

declare global {
  interface Window {
    dataLayer?: AnalyticsDataLayerItem[];
  }
}

const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';

/** Drop null/undefined/empty values so events stay clean. */
function clean(params: EventParams): CleanEventParams {
  const out: CleanEventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    out[key] = value;
  }
  return out;
}

/**
 * Capture UTM params from the current URL into sessionStorage on first landing,
 * so they can be attached to later events (e.g. an RFQ submitted several pages
 * after the campaign click). Call once on mount.
 */
export function captureUtm(): void {
  if (typeof window === 'undefined') return;
  try {
    const search = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = search.get(key);
      if (value) found[key] = value.slice(0, MAX_UTM_LENGTH);
    }
    if (Object.keys(found).length > 0) {
      const existing = getUtm();
      window.sessionStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify({ ...existing, ...found }),
      );
    }
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Read stored UTM params (empty object if none / storage unavailable). */
export function getUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = parsed[key];
      if (typeof value === 'string' && value) {
        out[key] = value.slice(0, MAX_UTM_LENGTH);
      }
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Core event dispatcher. Exactly one transport path runs per event so the
 * direct-GA4-to-GTM migration cannot double-count the same interaction.
 */
export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  if (!getConsentSnapshot().analyticsGranted) return;

  const payload = clean({
    page_language: document.documentElement.lang || undefined,
    page_path: window.location.pathname,
    ...getUtm(),
    ...params,
  });

  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload);
  }

  try {
    if (analyticsConfig.transport !== 'gtm') return;
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: name, ...payload });
  } catch {
    /* never let analytics throw into the UI */
  }
}

export function trackPageView(params: {
  page_path: string;
  page_language: string;
  page_title: string;
  page_location?: string;
  page_referrer?: string;
}): void {
  trackEvent('page_view', params);
}

/** RFQ funnel step completion. */
export function trackRfqStep(
  stepNumber: number,
  stepName: string,
  params: EventParams = {},
): void {
  trackEvent('rfq_step_complete', {
    step_number: stepNumber,
    step_name: stepName,
    ...params,
  });
}

/** A primary CTA click (location = where on the site, label = button text/intent). */
export function trackCtaClick(location: string, label: string): void {
  trackEvent('cta_click', {
    component_name: 'cta',
    section_name: location,
    cta_id: label,
  });
}

/** A contact-channel click → whatsapp_click / phone_click / email_click. */
export function trackContactClick(
  type: 'whatsapp' | 'phone' | 'email',
  params: EventParams = {},
): void {
  trackEvent(`${type}_click`, {
    contact_type: type,
    destination_type: type,
    ...params,
  });
}
