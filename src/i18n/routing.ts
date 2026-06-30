import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Locale routing. Persian is the default root locale; non-default locales use
 * prefixed URLs.
 */
export const routing = defineRouting({
  locales: ['fa', 'en', 'ar', 'ru'],
  defaultLocale: 'fa',
  localePrefix: 'as-needed',
  // Persian is the primary commercial SEO language: the root path must always
  // resolve to Persian and never auto-redirect to /en based on the visitor's
  // Accept-Language header. Visitors switch to English explicitly via the UI.
  localeDetection: false,
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr',
  ar: 'rtl',
  ru: 'ltr',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
