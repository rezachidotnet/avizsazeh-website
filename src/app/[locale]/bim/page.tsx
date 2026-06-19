import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';

type BimSection = { title: string; text: string };

const ICONS: IconKey[] = ['system', 'office', 'control', 'execution', 'architecture'];

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'bimPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/bim',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function BimPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('bimPage');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const sections = t.raw('sections') as BimSection[];
  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: t('title'), path: '/bim', current: true },
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
        <h2 className="font-display text-h2 font-semibold text-white">{t('sectionsTitle')}</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((s, i) => (
            <div key={s.title} className="flex h-full flex-col bg-ink-900 p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-gold">
                <SystemIcon name={ICONS[i % ICONS.length]} className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-h4 font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-body-s leading-relaxed text-ink-600">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-h2 font-semibold text-white">{t('ctaTitle')}</h2>
            <p className="mt-3 text-body-l text-ink-300">{t('ctaText')}</p>
          </div>
          <Button href="/rfq" variant="gold" size="lg" className="shrink-0">
            {tc('requestAnalysis')}
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
