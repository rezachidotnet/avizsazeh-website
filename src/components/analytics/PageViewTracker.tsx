'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { useConsentSnapshot } from '@/components/consent/ConsentProvider';

let lastSentRouteKey: string | null = null;
let lastPageLocation: string | null = null;

function languageFromPath(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment === 'en' || segment === 'ar' || segment === 'ru' ? segment : 'fa';
}

function routeKey(pathname: string): string {
  const historyIndex =
    typeof window !== 'undefined' && typeof window.history.state?.idx === 'number'
      ? window.history.state.idx
      : 'initial';
  return `${historyIndex}:${pathname}`;
}

function sanitizeLocation(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

function currentLocation(pathname: string): string {
  return `${window.location.origin}${pathname}`;
}

/**
 * Sends explicit page_view events for App Router path changes. The last route key
 * is module-scoped so React Strict Mode remounts do not duplicate the same
 * production-intent page view; navigating away and later back changes the last
 * key and can be measured again.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const consent = useConsentSnapshot();

  useEffect(() => {
    if (!consent.analyticsGranted) {
      lastSentRouteKey = null;
      lastPageLocation = null;
      return;
    }
    if (!pathname) return;
    const key = routeKey(pathname);
    if (key === lastSentRouteKey) return;
    lastSentRouteKey = key;
    const location = currentLocation(pathname);
    const referrer = lastPageLocation ?? sanitizeLocation(document.referrer);

    trackPageView({
      page_path: pathname,
      page_language: languageFromPath(pathname),
      page_title: document.title,
      page_location: location,
      page_referrer: referrer,
    });
    lastPageLocation = location;
  }, [consent.analyticsGranted, consent.revision, pathname]);

  return null;
}
