import { useLocale, useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { SystemCard } from '@/components/system/SystemCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { systems } from '@/lib/content/systems';
import type { Locale } from '@/i18n/routing';

export function SystemsOverview() {
  const t = useTranslations('home.systems');
  const tc = useTranslations('cta');
  const locale = useLocale() as Locale;

  return (
    <Section id="systems">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        <Button href="/systems" variant="outline" className="shrink-0">
          {tc('compareSystems')}
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {systems.map((system, i) => (
          <Reveal key={system.slug} delay={i * 70}>
            <SystemCard system={system} locale={locale} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
