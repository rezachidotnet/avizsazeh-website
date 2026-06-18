import { useLocale, useTranslations } from 'next-intl';
import { SystemCard } from '@/components/system/SystemCard';
import { Reveal } from '@/components/ui/Reveal';
import { systems } from '@/lib/content/systems';
import type { Locale } from '@/i18n/routing';

export function SystemsOverview() {
  const t = useTranslations('home.systems');
  const locale = useLocale() as Locale;

  return (
    <section id="systems" className="bg-ink-950 py-section lg:py-section-lg">
      <div className="container-grid">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow-center">{t('eyebrow')}</span>
          <h2 className="mt-5 font-display text-h2 font-semibold text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-body-l text-ink-300">{t('description')}</p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {systems.map((system, i) => (
            <Reveal key={system.slug} delay={i * 70}>
              <SystemCard system={system} locale={locale} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
