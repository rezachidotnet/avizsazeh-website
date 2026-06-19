'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { clients } from '@/lib/content/clients';
import { localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Client / project logo wall — a single uniform row the visitor can scan with
 * the navigation arrows (the proof layer).
 */
export function ClientWall({
  locale,
  className,
  limit,
}: {
  locale: Locale;
  className?: string;
  /** when set, show a compact static grid of the first N logos (no carousel) */
  limit?: number;
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * (el.clientWidth * 0.8), behavior: 'smooth' });
  }

  // Compact homepage variant — a curated, scannable set without overload.
  if (limit) {
    return (
      <ul className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4', className)}>
        {clients.slice(0, limit).map((client) => (
          <li
            key={client.file}
            className="group flex h-24 items-center justify-center rounded-sm border border-white/10 bg-white px-5"
            title={localized(client.name, locale)}
          >
            <Image
              src={`/clients/${client.file}`}
              alt={localized(client.name, locale)}
              width={160}
              height={90}
              loading="lazy"
              sizes="(max-width: 640px) 40vw, 220px"
              className="max-h-12 w-auto object-contain opacity-70 grayscale transition-all duration-medium ease-aecs group-hover:opacity-100 group-hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <ul
        ref={trackRef}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-1 py-1"
      >
        {clients.map((client) => (
          <li
            key={client.file}
            className="group flex h-24 w-40 shrink-0 snap-start items-center justify-center rounded-sm border border-white/10 bg-white px-5 sm:h-28 sm:w-48"
            title={localized(client.name, locale)}
          >
            <Image
              src={`/clients/${client.file}`}
              alt={localized(client.name, locale)}
              width={160}
              height={90}
              loading="lazy"
              sizes="192px"
              className="max-h-14 w-auto object-contain opacity-70 grayscale transition-all duration-medium ease-aecs group-hover:opacity-100 group-hover:grayscale-0"
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous clients"
        className="absolute -start-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink-950/80 text-gold backdrop-blur-sm transition-colors hover:border-gold hover:bg-ink-900 sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="More clients"
        className="absolute -end-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink-950/80 text-gold backdrop-blur-sm transition-colors hover:border-gold hover:bg-ink-900 sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
