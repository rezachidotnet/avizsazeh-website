'use client';

import { useEffect } from 'react';
import { trackEvent, type EventParams } from '@/lib/analytics';

/**
 * Fires a single tracking event when mounted. Use to record meaningful page
 * views (e.g. system_page_view) with structured params. Renders nothing.
 */
export function TrackView({
  event,
  params,
}: {
  event: string;
  params?: EventParams;
}) {
  useEffect(() => {
    trackEvent(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
