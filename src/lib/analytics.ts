/**
 * Analytics abstraction — provider-agnostic event tracking.
 *
 * Supports GA4 (gtag), Google Tag Manager (dataLayer), Plausible and Microsoft
 * Clarity. Every function is a safe no-op when no provider is configured and is
 * guarded for SSR (`typeof window`), so the site never breaks if analytics IDs
 * are missing. Providers are enabled purely through NEXT_PUBLIC_* env vars — see
 * the <Analytics /> component and .env.example.
 */

export type EventParams = Record<string, string | number | boolean | undefined | null>;

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const UTM_STORAGE_KEY = 'aecs_utm';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';

/** Drop null/undefined/empty values so events stay clean. */
function clean(params: EventParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
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
      if (value) found[key] = value;
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
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * Core event dispatcher. Sends the same event to every configured provider.
 * `locale` and `page_path` are added automatically; UTM params are merged in.
 */
export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;

  const payload = clean({
    locale: document.documentElement.lang || undefined,
    page_path: window.location.pathname,
    ...getUtm(),
    ...params,
  });

  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload);
  }

  try {
    // Google Tag Manager
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...payload });
    }
    // GA4 (gtag.js)
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, payload);
    }
    // Plausible (custom events with props)
    if (typeof window.plausible === 'function') {
      window.plausible(name, { props: payload });
    }
    // Microsoft Clarity custom event tags
    if (typeof window.clarity === 'function') {
      window.clarity('event', name);
    }
  } catch {
    /* never let analytics throw into the UI */
  }
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
  trackEvent('cta_click', { cta_location: location, cta_label: label });
}

/** A contact-channel click → whatsapp_click / phone_click / email_click. */
export function trackContactClick(
  type: 'whatsapp' | 'phone' | 'email',
  params: EventParams = {},
): void {
  trackEvent(`${type}_click`, { contact_type: type, ...params });
}
