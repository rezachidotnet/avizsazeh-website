import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { JsonLd } from '@/components/shared/JsonLd';
import { RfqEngine } from '@/components/rfq/RfqEngine';
import { systems } from '@/lib/content/systems';
import { localized } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'rfq' });
  return buildMetadata({
    locale: params.locale,
    path: '/rfq',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function RfqPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('rfq');
  const tNav = await getTranslations('nav');

  const systemOptions = systems.map((s) => ({
    slug: s.slug,
    name: localized(s.name, locale),
  }));

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('rfq'), path: '/rfq', current: true },
        ]}
      />

      <Section ivory>
        <div className="mx-auto max-w-3xl">
          <RfqEngine systemOptions={systemOptions} />
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tNav('home'), path: '/' },
            { name: tNav('rfq'), path: '/rfq' },
          ],
          locale,
        )}
      />
    </>
  );
}
