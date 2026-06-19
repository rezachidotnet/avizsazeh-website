import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';

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
    description: t('subtitle'),
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

  const pillars: { icon: IconKey; title: string; text: string }[] = [
    { icon: 'control', title: t('riskTitle'), text: t('riskText') },
    { icon: 'team', title: t('roleTitle'), text: t('roleText') },
    { icon: 'quality', title: t('responsibilityTitle'), text: t('responsibilityText') },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('subtitle')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('about'), path: '/about', current: true },
        ]}
      />

      {/* lead + experience/background */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-body-l font-medium text-white">{t('lead')}</p>
            <h2 className="mt-10 font-display text-h3 font-semibold text-white">
              {t('storyTitle')}
            </h2>
            <div className="mt-5 space-y-5">
              {story.map((p) => (
                <p key={p} className="text-body-l text-ink-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-ink-100">
              <Image
                src="/brand/about.webp"
                alt={t('title')}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
            </div>
          </div>
        </div>
      </Section>

      {/* what we believe */}
      <Section ivory>
        <SectionHeader eyebrow={t('eyebrow')} title={t('beliefsTitle')} />
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

      {/* risk · role · responsibility */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.03] p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-gold">
                <SystemIcon name={pillar.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-h4 font-semibold text-white">{pillar.title}</h3>
              <p className="mt-3 text-body-s leading-relaxed text-ink-600">{pillar.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* from concept to executable ceiling system + values */}
      <Section ivory>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <span className="eyebrow">{t('conceptTitle')}</span>
            <p className="mt-6 border-s-2 border-gold ps-6 font-display text-h3 font-semibold leading-snug text-white">
              {t('conceptText')}
            </p>
          </div>
          <div className="lg:col-span-6">
            <h3 className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-500">
              {t('valuesTitle')}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-3">
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
          </div>
        </div>
      </Section>

      {/* engineering team — ready for profiles */}
      <Section>
        <SectionHeader eyebrow={t('eyebrow')} title={t('teamTitle')} />
        <div className="mt-8 flex items-center gap-4 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-6 py-7">
          <SystemIcon name="team" className="h-6 w-6 shrink-0 text-gold/70" />
          <p className="text-body-s text-ink-500">{t('teamNote')}</p>
        </div>
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
