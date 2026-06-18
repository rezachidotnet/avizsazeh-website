import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { ClientWall } from '@/components/sections/ClientWall';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon } from '@/components/icons/SystemIcon';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'projectsPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/projects',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('projectsPage');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('projects'), path: '/projects', current: true },
        ]}
      />

      <Section>
        <ClientWall locale={locale} />

        <div className="mt-10 flex items-center gap-3 rounded border border-dashed border-ink-300 bg-ivory px-5 py-4 text-body-s text-ink-500">
          <SystemIcon name="control" className="h-5 w-5 shrink-0 text-ink-400" />
          <p>{t('note')}</p>
        </div>
      </Section>

      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <h2 className="max-w-xl text-h2 font-semibold text-white">{tc('viewProof')}</h2>
          <Button href="/rfq" variant="gold" size="lg" className="shrink-0">
            {tc('requestAnalysis')}
          </Button>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tNav('home'), path: '/' },
            { name: tNav('projects'), path: '/projects' },
          ],
          locale,
        )}
      />
    </>
  );
}
