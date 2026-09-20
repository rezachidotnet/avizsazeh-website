import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { systems } from '@/lib/content/systems';
import {
  compareColumns,
  compareRows,
  fitLabels,
  type FitLevel,
} from '@/lib/content/comparison';
import { localized } from '@/lib/site';

const fitStyle: Record<FitLevel, { dot: string; text: string }> = {
  excellent: { dot: 'bg-gold', text: 'text-gold' },
  suitable: { dot: 'bg-info', text: 'text-info' },
  review: { dot: 'bg-amber-500', text: 'text-amber-600' },
  no: { dot: 'bg-ink-400', text: 'text-ink-400' },
};

function FitBadge({ level, locale }: { level: FitLevel; locale: Locale }) {
  const s = fitStyle[level];
  return (
    <span className={`inline-flex items-center gap-2 text-body-s font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
      {localized(fitLabels[level], locale)}
    </span>
  );
}

/**
 * Cross-system decision matrix. Criteria rows × system columns, each cell an
 * honest fit level. Column headers link through to the system detail pages.
 */
export function SystemComparisonMatrix({
  locale,
  criterionLabel,
}: {
  locale: Locale;
  criterionLabel: string;
}) {
  const cols = compareColumns
    .map((slug) => systems.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      <table className="w-full min-w-[720px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky start-0 z-10 border-b border-ink/10 bg-surface px-4 py-4 text-start align-bottom">
              <span className="eyebrow">{criterionLabel}</span>
            </th>
            {cols.map((s) => (
              <th
                key={s.slug}
                className="border-b border-ink/10 px-4 py-4 text-start align-bottom"
              >
                <Link
                  href={`/systems/${s.slug}`}
                  className="text-body-s font-semibold text-ink transition-colors hover:text-gold"
                >
                  {localized(s.name, locale)}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row, i) => (
            <tr key={row.criterion.en} className={i % 2 ? 'bg-ink/[0.02]' : undefined}>
              <th
                scope="row"
                className={`sticky start-0 z-10 border-b border-ink/10 px-4 py-3.5 text-start text-body-s font-medium text-ink-700 ${
                  i % 2 ? 'bg-ivory' : 'bg-surface'
                }`}
              >
                {localized(row.criterion, locale)}
              </th>
              {cols.map((s) => (
                <td key={s.slug} className="border-b border-ink/10 px-4 py-3.5">
                  <FitBadge level={row.values[s.slug]} locale={locale} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Legend for the four fit levels. */
export function FitLegend({ locale }: { locale: Locale }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {(Object.keys(fitStyle) as FitLevel[]).map((level) => (
        <li key={level} className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${fitStyle[level].dot}`} />
          <span className="text-body-s text-ink-500">{localized(fitLabels[level], locale)}</span>
        </li>
      ))}
    </ul>
  );
}
