import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';
import { Reveal } from '@/components/ui/Reveal';

const FLOW_ICONS: IconKey[] = ['architecture', 'engineering', 'system', 'execution'];
const CAP_ICONS: IconKey[] = ['office', 'team', 'control', 'quality'];

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'engineeringPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/engineering',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function EngineeringPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('engineeringPage');
  const tFlow = await getTranslations('home.engineering');
  const tExec = await getTranslations('home.execution');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const flow = tFlow.raw('steps') as { title: string; text: string }[];
  const process = t.raw('process') as { title: string; text: string }[];
  const capabilities = tExec.raw('capabilities') as { title: string; text: string }[];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('engineering'), path: '/engineering', current: true },
        ]}
      />

      {/* engineering flow */}
      <Section dark>
        <SectionHeader dark eyebrow={tFlow('eyebrow')} title={t('flowTitle')} />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 md:grid-cols-2 xl:grid-cols-4">
          {flow.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 70}>
              <div className="h-full bg-ink-900 p-7">
                <div className="flex items-center justify-between">
                  <SystemIcon
                    name={FLOW_ICONS[i]}
                    node={i === flow.length - 1}
                    className="h-7 w-7 text-gold-300"
                  />
                  <span className="font-latin text-h3 font-bold tabular-nums text-white/10">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-h4 font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-body-s text-ink-300">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 3-step process */}
      <Section>
        <SectionHeader eyebrow={t('eyebrow')} title={t('processTitle')} />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {process.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80}>
              <div className="h-full rounded-lg border border-ink-200 bg-white p-7">
                <span className="font-display text-h2 font-bold text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-h4 font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-body-s text-ink-600">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* capabilities */}
      <Section ivory>
        <SectionHeader eyebrow={tExec('eyebrow')} title={t('capabilitiesTitle')} />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <div className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-ink-200 bg-white text-ink">
                  <SystemIcon name={CAP_ICONS[i]} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-h4 font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 max-w-sm text-body-s text-ink-600">{c.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
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
            { name: tNav('engineering'), path: '/engineering' },
          ],
          locale,
        )}
      />
    </>
  );
}
