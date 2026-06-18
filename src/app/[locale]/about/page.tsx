import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon } from '@/components/icons/SystemIcon';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'aboutPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/about',
    title: t('title'),
    description: t('lead'),
    images: ['/brand/about.webp'],
  });
}

export default async function AboutPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('aboutPage');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const story = t.raw('story') as string[];
  const principles = t.raw('principles') as string[];
  const values = t.raw('values') as string[];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('about'), path: '/about', current: true },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-body-l font-medium text-white">{t('lead')}</p>
            <div className="mt-8 space-y-5">
              {story.map((p) => (
                <p key={p} className="text-body-l text-ink-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-ink-200 bg-ink-100">
              <Image
                src="/brand/about.webp"
                alt={t('title')}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
            </div>
          </div>
        </div>
      </Section>

      {/* principles */}
      <Section ivory>
        <SectionHeader eyebrow={t('eyebrow')} title={t('principlesTitle')} />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p} className="flex items-start gap-4 bg-ink-900 px-6 py-7">
              <span className="font-display text-h4 font-bold tabular-nums text-gold">
                0{i + 1}
              </span>
              <p className="text-body-l text-ink-700">{p}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* values */}
      <Section>
        <SectionHeader eyebrow={t('eyebrow')} title={t('valuesTitle')} />
        <ul className="mt-10 flex flex-wrap gap-3">
          {values.map((v) => (
            <li
              key={v}
              className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-body-s font-medium text-ink-700"
            >
              <SystemIcon name="system" className="h-4 w-4 text-gold" />
              {v}
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Button href="/rfq" variant="gold" size="lg">
            {tc('requestAnalysis')}
          </Button>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tNav('home'), path: '/' },
            { name: tNav('about'), path: '/about' },
          ],
          locale,
        )}
      />
    </>
  );
}
