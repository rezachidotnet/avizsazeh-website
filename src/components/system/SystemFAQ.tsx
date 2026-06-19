import type { Locale } from '@/i18n/routing';
import type { Faq } from '@/lib/content/systems';
import { localized } from '@/lib/site';

/**
 * System FAQ. Server-rendered native <details> accordion so it works without
 * JavaScript and stays crawlable. Pair with FAQPage JSON-LD on the page.
 */
export function SystemFAQ({
  locale,
  title,
  items,
}: {
  locale: Locale;
  title: string;
  items: Faq[];
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className="font-display text-h2 font-semibold text-white">{title}</h2>
      </div>
      <div className="lg:col-span-8">
        <div className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
          {items.map((item) => (
            <details key={item.q.en} className="group bg-white/[0.03] px-6 py-5 open:bg-white/[0.05]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body-l font-medium text-white marker:hidden">
                {localized(item.q, locale)}
                <span className="shrink-0 text-gold transition-transform duration-fast group-open:rotate-45">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-body-s leading-relaxed text-ink-700">
                {localized(item.a, locale)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
