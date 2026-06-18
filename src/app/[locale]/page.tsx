import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { Hero } from '@/components/sections/home/Hero';
import { TrustMetrics } from '@/components/sections/home/TrustMetrics';
import { SystemDefinition } from '@/components/sections/home/SystemDefinition';
import { SystemsOverview } from '@/components/sections/home/SystemsOverview';
import { EngineeringFlow } from '@/components/sections/home/EngineeringFlow';
import { ExecutionCapabilities } from '@/components/sections/home/ExecutionCapabilities';
import { ProofClients } from '@/components/sections/home/ProofClients';
import { RfqCta } from '@/components/sections/home/RfqCta';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'brand' });
  const th = await getTranslations({ locale: params.locale, namespace: 'home.hero' });
  return buildMetadata({
    locale: params.locale,
    path: '/',
    title: `${t('fullName')} — ${t('tagline')}`,
    description: th('description'),
  });
}

export default function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  return (
    <>
      <Hero />
      <TrustMetrics />
      <SystemDefinition />
      <SystemsOverview />
      <EngineeringFlow />
      <ExecutionCapabilities />
      <ProofClients />
      <RfqCta />
    </>
  );
}
