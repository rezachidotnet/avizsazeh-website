import { SystemIcon } from '@/components/icons/SystemIcon';
import type { Locale } from '@/i18n/routing';

/**
 * Technical-datasheet download CTA. No PDF assets exist yet, so the button is
 * rendered disabled (never a 404). When a real datasheet is added, pass `href`
 * and it becomes an active download link.
 *
 * TODO: wire `href` to the real per-system PDF datasheet once produced.
 */
export function DatasheetCta({ locale, href }: { locale: Locale; href?: string }) {
  const label = locale === 'fa' ? 'دانلود مشخصات فنی PDF' : 'Download technical datasheet (PDF)';
  const pending =
    locale === 'fa' ? 'دیتاشیت در حال آماده‌سازی' : 'Datasheet in preparation';

  const base =
    'group inline-flex items-center gap-2.5 rounded-sm border px-5 h-11 text-label font-semibold uppercase tracking-[0.08em] transition-colors duration-fast';

  if (href) {
    return (
      <a
        href={href}
        download
        className={`${base} border-gold/55 text-gold hover:border-gold hover:bg-gold/10`}
      >
        <SystemIcon name="quality" className="h-4 w-4" />
        {label}
      </a>
    );
  }

  return (
    <span
      className={`${base} cursor-not-allowed border-white/10 text-ink-500`}
      aria-disabled="true"
      title={pending}
    >
      <SystemIcon name="quality" className="h-4 w-4" />
      {label}
      <span className="ms-1 rounded-sm border border-white/10 px-1.5 py-0.5 text-micro tracking-normal text-ink-500">
        {pending}
      </span>
    </span>
  );
}
