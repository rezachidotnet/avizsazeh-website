import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Locale routing. Persian (fa) is the default and serves unprefixed at `/`.
 * English (en) serves at `/en`. Additional locales (ar, ru) are reserved
 * in the SEO strategy and can be added here without structural changes.
 */
export const routing = defineRouting({
  locales: ['fa', 'en'],
  defaultLocale: 'fa',
  localePrefix: 'as-needed',
  // Persian is the primary commercial SEO language: the root path must always
  // resolve to Persian and never auto-redirect to /en based on the visitor's
  // Accept-Language header. Visitors switch to English explicitly via the UI.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
