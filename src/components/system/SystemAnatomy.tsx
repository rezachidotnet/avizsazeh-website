import type { Locale } from '@/i18n/routing';

/**
 * System-anatomy diagram. A designed placeholder block (NOT a broken image)
 * that names the layered structure — profile / carrier / hanger / plenum /
 * MEP access — until a real technical diagram is produced.
 *
 * TODO: replace the schematic with the real per-system technical diagram.
 */
export function SystemAnatomy({
  locale,
  labels,
}: {
  locale: Locale;
  /** ordered anatomy labels, top (visible element) → top (plenum/MEP) */
  labels: string[];
}) {
  const heading =
    locale === 'fa' ? 'آناتومی سیستم' : 'System anatomy';
  const pending =
    locale === 'fa' ? 'دیاگرام فنی سیستم — در حال آماده‌سازی' : 'Technical system diagram — in preparation';

  return (
    <figure className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <span className="eyebrow">{heading}</span>
        <span className="text-caption text-ink-500">{pending}</span>
      </figcaption>

      <div className="relative bg-grid-lines [background-size:32px_32px] p-5">
        <ol className="space-y-2.5">
          {labels.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-caption font-semibold text-gold">
                {i + 1}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent rtl:bg-gradient-to-l" />
              <span className="text-body-s font-medium text-ink-700">{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
