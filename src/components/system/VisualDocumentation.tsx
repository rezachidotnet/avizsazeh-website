import type { Locale } from '@/i18n/routing';

/**
 * Visual documentation checklist. Lists the photos/diagrams that should exist
 * for this system as designed placeholder cards — never broken images. Each
 * item is a TODO for the AvizSazeh team to supply real assets.
 *
 * TODO: as each real visual is produced, replace the matching placeholder with
 * the image in the execution gallery / anatomy diagram.
 */
export function VisualDocumentation({
  locale,
  title,
  items,
}: {
  locale: Locale;
  title: string;
  items: string[];
}) {
  const badge = locale === 'fa' ? 'در حال آماده‌سازی' : 'In preparation';
  const note =
    locale === 'fa'
      ? 'این بصری‌ها برای مستندسازی فنی کامل سیستم در حال تهیه هستند.'
      : 'These visuals are being prepared to complete the system’s technical documentation.';

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-h2 font-semibold text-white">{title}</h2>
        <p className="max-w-sm text-body-s text-ink-500">{note}</p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex aspect-[16/10] flex-col justify-between rounded-lg border border-dashed border-white/15 bg-grid-lines [background-size:28px_28px] p-5"
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-white/10 bg-ink-950/60 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
              {badge}
            </span>
            <span className="text-body-s font-medium text-ink-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
