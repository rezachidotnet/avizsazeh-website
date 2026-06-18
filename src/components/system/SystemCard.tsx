import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { SystemIcon } from '@/components/icons/SystemIcon';
import type { CeilingSystem } from '@/lib/content/systems';
import { localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

/**
 * SystemCard — represents a ceiling system as an engineering module.
 * Hover reveals system logic; the whole card links to the system detail.
 */
export function SystemCard({
  system,
  locale,
  index = 0,
}: {
  system: CeilingSystem;
  locale: Locale;
  index?: number;
}) {
  return (
    <Link
      href={`/systems/${system.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-ink-200 bg-white transition-all duration-medium ease-aecs hover:-translate-y-1 hover:border-ink-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <Image
          src={system.cover}
          alt={localized(system.name, locale)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-slow ease-aecs group-hover:scale-105"
          loading={index < 2 ? undefined : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-ink-950/10 to-transparent" />
        <span className="absolute start-4 top-4 flex h-10 w-10 items-center justify-center rounded border border-white/25 bg-ink-950/40 text-white backdrop-blur-sm">
          <SystemIcon name={system.iconKey} className="h-5 w-5" />
        </span>
        <span className="absolute bottom-3 end-4 font-latin text-caption tabular-nums text-white/70">
          {String(system.order).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{localized(system.category, locale)}</p>
        <h3 className="mt-3 text-h4 font-semibold text-ink">
          {localized(system.name, locale)}
        </h3>
        <p className="mt-2 line-clamp-3 text-body-s text-ink-600">
          {localized(system.definition, locale)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-body-s font-medium text-ink-500 transition-colors duration-fast group-hover:text-ink">
          <span className="h-px w-5 bg-gold transition-all duration-medium group-hover:w-8" />
          {localized(system.name, locale)}
        </span>
      </div>
    </Link>
  );
}
