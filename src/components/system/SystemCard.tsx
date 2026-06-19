import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { CeilingSystem } from '@/lib/content/systems';
import { localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

/**
 * SystemCard — a ceiling system as a full-bleed engineering tile with a
 * bordered label plate (gold node + name + directional arrow). When `context`
 * is provided (homepage) the plate also shows a practical application line and
 * an explicit "View This System" affordance.
 */
export function SystemCard({
  system,
  locale,
  index = 0,
  context,
  cta,
}: {
  system: CeilingSystem;
  locale: Locale;
  index?: number;
  /** practical application line shown inside the plate */
  context?: string;
  /** explicit "View This System" label */
  cta?: string;
}) {
  const name = localized(system.name, locale);

  return (
    <Link
      href={`/systems/${system.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-lg border border-white/10 transition-colors duration-medium ease-aecs hover:border-gold/40"
    >
      <Image
        src={system.cover}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-slow ease-aecs group-hover:scale-[1.04]"
        loading={index < 2 ? undefined : 'lazy'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/5" />

      <div className="absolute inset-x-3 bottom-3">
        <div className="rounded-sm border border-white/15 bg-ink-950/55 px-4 py-3 backdrop-blur-sm transition-colors duration-fast group-hover:border-gold/45 group-hover:bg-ink-950/70">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 shrink-0 text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              aria-hidden="true"
            >
              <path d="M8 1.5 14.5 8 8 14.5 1.5 8 8 1.5Z" />
              <circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-label font-semibold uppercase tracking-[0.1em] text-white">
              {name}
            </span>
          </div>

          {context ? (
            <p className="mt-2 text-caption leading-snug text-ink-300">{context}</p>
          ) : null}

          {context && cta ? (
            <span className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-caption font-medium text-gold">
              {cta}
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 transition-transform duration-fast group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                aria-hidden="true"
              >
                <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="absolute end-4 top-3 h-4 w-4 shrink-0 text-gold transition-transform duration-fast group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              aria-hidden="true"
            >
              <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </Link>
  );
}
