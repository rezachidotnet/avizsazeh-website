import { Button } from '@/components/ui/Button';
import { SystemIcon } from '@/components/icons/SystemIcon';
import type { Locale } from '@/i18n/routing';

/**
 * Section 7 — system-selection guidance. Decision criteria for choosing this
 * system, plus a link to the cross-system comparison page.
 */
export function SystemSelectionGuidance({
  locale,
  criteria,
  compareLabel,
}: {
  locale: Locale;
  criteria: string[];
  compareLabel: string;
}) {
  const lead =
    locale === 'fa'
      ? 'این سیستم را زمانی انتخاب کنید که:'
      : 'Choose this system when:';

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 lg:p-10">
      <p className="text-body-l text-ink-300">{lead}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {criteria.map((c) => (
          <li key={c} className="flex gap-3">
            <SystemIcon name="system" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-body-s text-ink-700">{c}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-white/10 pt-6">
        <Button href="/systems/compare" variant="outline" size="md">
          {compareLabel}
        </Button>
      </div>
    </div>
  );
}
