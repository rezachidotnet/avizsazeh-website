import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import {
  SystemComparisonMatrix,
  FitLegend,
} from '@/components/system/SystemComparisonMatrix';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'systemCompare' });
  return buildMetadata({
    locale: params.locale,
    path: '/systems/compare',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function SystemComparePage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('systemCompare');
  const tNav = await getTranslations('nav');

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: tNav('systems'), path: '/systems' },
    { name: t('eyebrow'), path: '/systems/compare', current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-h2 font-semibold text-white">{t('matrixTitle')}</h2>
          <FitLegend locale={locale} />
        </div>

        <div className="mt-8">
          <SystemComparisonMatrix locale={locale} criterionLabel={t('criterion')} />
        </div>

        <p className="mt-6 max-w-prose text-body-s text-ink-500">{t('note')}</p>
      </Section>

      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-h2 font-semibold text-white">{t('ctaTitle')}</h2>
            <p className="mt-3 text-body-l text-ink-300">{t('ctaText')}</p>
          </div>
          <Button href="/rfq" variant="gold" size="lg" className="shrink-0">
            {t('cta')}
          </Button>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, path: c.path })),
          locale,
        )}
      />
    </>
  );
}
