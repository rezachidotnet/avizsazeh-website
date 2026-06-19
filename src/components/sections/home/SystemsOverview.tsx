import { useLocale, useTranslations } from 'next-intl';
import { SystemCard } from '@/components/system/SystemCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { systems } from '@/lib/content/systems';
import { localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

export function SystemsOverview() {
  const t = useTranslations('home.systems');
  const tc = useTranslations('cta');
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
              <SystemCard
                system={system}
                locale={locale}
                index={i}
                context={localized(system.context, locale)}
                cta={tc('viewThisSystem')}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/systems" variant="outline" size="lg">
            {tc('exploreAllSystems')}
          </Button>
        </div>
      </div>
    </section>
  );
}
