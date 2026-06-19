import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SystemCard } from '@/components/system/SystemCard';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { systems } from '@/lib/content/systems';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'systemsPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/systems',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function SystemsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('systemsPage');
  const tNav = await getTranslations('nav');
  const tCompare = await getTranslations('systemCompare');

  const factors = t.raw('selectionFactors') as string[];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('systems'), path: '/systems', current: true },
        ]}
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {systems.map((system, i) => (
            <Reveal key={system.slug} delay={i * 70}>
              <SystemCard system={system} locale={locale} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-body-l text-ink-300">{tCompare('title')}</p>
          <Button href="/systems/compare" variant="outline" size="lg" className="shrink-0">
            {tCompare('matrixTitle')}
          </Button>
        </div>
      </Section>

      <Section ivory className="!pt-0 lg:!pt-0">
        <div className="grid gap-10 rounded-lg border border-white/10 bg-white/[0.03] p-8 lg:grid-cols-12 lg:p-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">{t('selectionTitle')}</span>
            <p className="mt-6 border-s-2 border-gold ps-6 font-display text-h3 font-semibold leading-snug text-white">
              {t('principle')}
            </p>
          </div>
          <ul className="grid gap-px self-start overflow-hidden rounded border border-white/10 bg-white/10 sm:grid-cols-2 lg:col-span-7">
            {factors.map((f) => (
              <li key={f} className="flex items-center gap-3 bg-ink-900 px-5 py-5">
                <SystemIcon name="engineering" className="h-5 w-5 text-gold" />
                <span className="text-body-s font-medium text-ink-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tNav('home'), path: '/' },
            { name: tNav('systems'), path: '/systems' },
          ],
          locale,
        )}
      />
    </>
  );
}
