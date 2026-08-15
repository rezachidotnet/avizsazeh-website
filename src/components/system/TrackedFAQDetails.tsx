'use client';

import { useRef, type KeyboardEvent } from 'react';
import type { FaqExpandParams } from '@/lib/analytics';
import { trackFaqExpand } from '@/lib/analytics';

type TrackedFAQDetailsProps = {
  analytics: FaqExpandParams;
  question: string;
  answer: string;
};

export function TrackedFAQDetails({
  analytics,
  question,
  answer,
}: TrackedFAQDetailsProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const ignoreNextClickRef = useRef(false);

  function trackOpening() {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }
    const details = detailsRef.current;
    if (!details || details.open) return;
    trackFaqExpand(analytics);
  }

  function handleSummaryKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const details = detailsRef.current;
    if (!details) return;

    event.preventDefault();
    ignoreNextClickRef.current = true;
    const shouldOpen = !details.open;
    details.open = shouldOpen;
    if (shouldOpen) {
      trackFaqExpand(analytics);
    }
  }

  return (
    <details
      ref={detailsRef}
      className="group bg-white/[0.03] px-6 py-5 open:bg-white/[0.05]"
    >
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-4 text-body-l font-medium text-white marker:hidden"
        onClick={trackOpening}
        onKeyDown={handleSummaryKeyDown}
      >
        {question}
        <span className="shrink-0 text-gold transition-transform duration-fast group-open:rotate-45">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <p className="mt-4 text-body-s leading-relaxed text-ink-700">{answer}</p>
    </details>
  );
}
