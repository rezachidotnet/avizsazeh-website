import { SystemIcon } from '@/components/icons/SystemIcon';
import type { Locale } from '@/i18n/routing';
import type { ApplicationFit } from '@/lib/content/systems';
import { localized } from '@/lib/site';

/**
 * Section 4 — applications. Two-column cards (application type + why it fits),
 * followed by an explicit "not recommended when…" block.
 */
export function ApplicationFitGrid({
  locale,
  applications,
  notRecommended,
  notRecommendedTitle,
}: {
  locale: Locale;
  applications: ApplicationFit[];
  notRecommended: string[];
  notRecommendedTitle: string;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {applications.map((a) => (
          <div
            key={a.type.en}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors duration-fast hover:border-gold/30"
          >
            <h3 className="flex items-center gap-3 text-body-l font-semibold text-white">
              <SystemIcon name="architecture" className="h-5 w-5 shrink-0 text-gold" />
              {localized(a.type, locale)}
            </h3>
            <p className="mt-3 text-body-s leading-relaxed text-ink-700">
              {localized(a.why, locale)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-6">
        <h3 className="flex items-center gap-3 text-body-l font-semibold text-ink-300">
          <SystemIcon name="control" className="h-5 w-5 shrink-0 text-ink-500" />
          {notRecommendedTitle}
        </h3>
        <ul className="mt-4 space-y-2.5">
          {notRecommended.map((n) => (
            <li key={n} className="flex gap-3 text-body-s text-ink-500">
              <span className="mt-2 h-px w-4 shrink-0 bg-ink-500" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
