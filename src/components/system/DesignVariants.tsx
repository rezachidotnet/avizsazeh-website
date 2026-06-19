import type { Locale } from '@/i18n/routing';
import type { SpecRow } from '@/lib/content/systems';
import { localized } from '@/lib/site';

/**
 * Section 6 — design variants & customisation. Compact card grid of the
 * customisable parameters (dimensions, spacing, colour, finish, acoustic,
 * curve options).
 */
export function DesignVariants({
  locale,
  variants,
}: {
  locale: Locale;
  variants: SpecRow[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {variants.map((v) => (
        <div key={v.label.en} className="bg-ink-950 p-6">
          <span className="eyebrow">{localized(v.label, locale)}</span>
          <p className="mt-3 text-body-s font-medium text-ink-700">
            {localized(v.value, locale)}
          </p>
        </div>
      ))}
    </div>
  );
}
