import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, localBusinessJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/shared/JsonLd';
import { Hero } from '@/components/sections/home/Hero';
import { TrustMetrics } from '@/components/sections/home/TrustMetrics';
import { DifferentiationTable } from '@/components/sections/home/DifferentiationTable';
import { SystemsOverview } from '@/components/sections/home/SystemsOverview';
import { EngineeringFlow } from '@/components/sections/home/EngineeringFlow';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const th = await getTranslations({ locale: params.locale, namespace: 'home.hero' });
  return buildMetadata({
    locale: params.locale,
    path: '/',
    title: th('metaTitle'),
    description: th('metaDescription'),
    titleAbsolute: true,
  });
}

export default function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  return (
    <>
      <JsonLd data={localBusinessJsonLd(params.locale)} />
      <Hero />
      <TrustMetrics />
      <SystemsOverview />
      <DifferentiationTable />
      <EngineeringFlow />
    </>
  );
}
