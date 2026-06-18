import { useLocale, useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { cn, displayFont } from '@/lib/utils';

/** "What is AECS?" — the central thesis: ceilings are engineered systems. */
export function SystemDefinition() {
  const t = useTranslations('home.definition');
  const display = displayFont(useLocale());
  return (
    <Section ivory>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className={cn(display, 'mt-4 text-h2 font-semibold text-white')}>{t('title')}</h2>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-prose text-body-l text-ink-600">{t('text')}</p>
          <div className="mt-8 border-s-2 border-gold ps-6">
            <p className={cn(display, 'text-h3 font-semibold leading-snug text-ink')}>
              “{t('title')}”
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
