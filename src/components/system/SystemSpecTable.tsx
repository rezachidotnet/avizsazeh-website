import type { Locale } from '@/i18n/routing';
import type { SpecRow } from '@/lib/content/systems';
import { localized } from '@/lib/site';

/**
 * Data-driven technical specification table. Renders a long parameter list as a
 * definition list; unverified values already carry the explicit
 * "TBD by engineering" placeholder from the data layer.
 */
export function SystemSpecTable({
  locale,
  rows,
  title,
  caption,
}: {
  locale: Locale;
  rows: SpecRow[];
  title: string;
  caption?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-white/[0.03] px-6 py-4">
        <span className="eyebrow">{title}</span>
        {caption ? <p className="mt-2 text-caption text-ink-500">{caption}</p> : null}
      </div>
      <dl className="divide-y divide-white/10">
        {rows.map((row) => (
          <div
            key={row.label.en}
            className="grid grid-cols-1 gap-1 px-6 py-3.5 sm:grid-cols-12 sm:items-baseline sm:gap-4"
          >
            <dt className="text-body-s text-ink-500 sm:col-span-5">
              {localized(row.label, locale)}
            </dt>
            <dd className="text-body-s font-medium text-ink-700 sm:col-span-7">
              {localized(row.value, locale)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
