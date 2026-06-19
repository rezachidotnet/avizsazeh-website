import { SystemIcon } from '@/components/icons/SystemIcon';
import { SystemAnatomy } from '@/components/system/SystemAnatomy';
import type { Locale } from '@/i18n/routing';

/**
 * Section 2 — engineering logic. Specific engineering reasoning bullets beside
 * the system-anatomy diagram placeholder.
 */
export function EngineeringLogic({
  locale,
  title,
  bullets,
  anatomy,
}: {
  locale: Locale;
  title: string;
  bullets: string[];
  anatomy: string[];
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <h2 className="font-display text-h2 font-semibold text-white">{title}</h2>
        <ul className="mt-8 space-y-4">
          {bullets.map((item) => (
            <li key={item} className="flex gap-4">
              <SystemIcon name="engineering" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span className="text-body-l text-ink-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-5">
        <SystemAnatomy locale={locale} labels={anatomy} />
      </div>
    </div>
  );
}
