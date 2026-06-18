import { useLocale, useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ClientWall } from '@/components/sections/ClientWall';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/routing';

export function ProofClients() {
  const t = useTranslations('home.proof');
  const tc = useTranslations('cta');
  const locale = useLocale() as Locale;

  return (
    <Section>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        <Button href="/projects" variant="outline" className="shrink-0">
          {tc('viewProof')}
        </Button>
      </div>
      <div className="mt-12">
        <ClientWall locale={locale} />
      </div>
    </Section>
  );
}
