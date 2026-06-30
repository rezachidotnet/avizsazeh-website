import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import {
  buildMetadata,
  breadcrumbJsonLd,
  serviceJsonLd,
  faqJsonLd,
} from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SystemCard } from '@/components/system/SystemCard';
import { SystemFAQ } from '@/components/system/SystemFAQ';
import {
  SystemComparisonMatrix,
  FitLegend,
} from '@/components/system/SystemComparisonMatrix';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { hub } from '@/lib/content/hub';
import { systems } from '@/lib/content/systems';
import { localized, localizedList } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    path: '/metal-suspended-ceiling',
    title: localized(hub.seo.title, params.locale),
    description: localized(hub.seo.description, params.locale),
    titleAbsolute: true,
  });
}

export default async function MetalSuspendedCeilingHub({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('systemCompare');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const hubName = locale === 'fa' ? 'سقف کاذب فلزی' : 'Metal suspended ceiling';
  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: hubName, path: '/metal-suspended-ceiling', current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={localized(hub.eyebrow, locale)}
        title={localized(hub.h1, locale)}
        intro={localized(hub.lead, locale)}
        breadcrumbs={crumbs}
      />

      {/* hero visual */}
      <Section className="!pb-0">
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-white/10 bg-ink-100">
          <Image
            src={hub.cover}
            alt={localized(hub.coverAlt, locale)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </Section>

      {/* what is + why engineering */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.whatIs.title, locale)}</h2>
            <p className="mt-4 text-body-l leading-relaxed text-ink-300">{localized(hub.whatIs.body, locale)}</p>
          </div>
          <div>
            <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.whyEngineering.title, locale)}</h2>
            <p className="mt-4 text-body-l leading-relaxed text-ink-300">{localized(hub.whyEngineering.body, locale)}</p>
            <ul className="mt-6 space-y-3">
              {localizedList(hub.whyEngineering.bullets, locale).map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <SystemIcon name="engineering" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span className="text-body-s text-ink-200">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* types — links to the four systems */}
      <Section ivory>
        <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.typesTitle, locale)}</h2>
        <p className="mt-4 max-w-prose text-body-l text-ink-300">{localized(hub.typesIntro, locale)}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {systems.map((s, i) => (
            <SystemCard
              key={s.slug}
              system={s}
              locale={locale}
              index={i}
              context={localized(s.context, locale)}
              cta={tc('viewThisSystem')}
            />
          ))}
        </div>
      </Section>

      {/* comparison matrix */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.comparisonTitle, locale)}</h2>
        <div className="mt-8">
          <SystemComparisonMatrix locale={locale} criterionLabel={t('criterion')} />
        </div>
        <div className="mt-6">
          <FitLegend locale={locale} />
        </div>
        <p className="mt-4 text-body-s text-ink-500">{t('note')}</p>
      </Section>

      {/* applications — links to the application landing pages */}
      <Section ivory>
        <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.applicationsTitle, locale)}</h2>
        <p className="mt-4 max-w-prose text-body-l text-ink-300">{localized(hub.applicationsIntro, locale)}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hub.applications.map((a, i) => {
            const label = localized(a.label, locale);
            const content = (
              <span className="flex items-center gap-3">
                <SystemIcon name="architecture" className="h-5 w-5 shrink-0 text-gold" />
                <span className="text-body-s font-medium text-ink-200">{label}</span>
              </span>
            );
            return (
              <li key={`${a.label.en}-${i}`}>
                {a.href ? (
                  <Link
                    href={a.href}
                    className="group flex items-center justify-between gap-3 rounded-sm border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-gold/40"
                  >
                    {content}
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold transition-transform duration-fast group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.03] px-5 py-4">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      {/* engineering & execution process */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.processTitle, locale)}</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {hub.process.map((step, i) => (
            <li key={step.title.en} className="rounded-lg border border-white/10 bg-white/[0.03] p-7">
              <span className="font-display text-h2 font-bold text-gold">0{i + 1}</span>
              <h3 className="mt-4 text-h4 font-semibold text-white">{localized(step.title, locale)}</h3>
              <p className="mt-3 text-body-s text-ink-500">{localized(step.body, locale)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* common mistakes */}
      <Section ivory>
        <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.mistakesTitle, locale)}</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 md:grid-cols-2">
          {localizedList(hub.mistakes, locale).map((m, i) => (
            <li key={i} className="flex items-start gap-4 bg-ink-900 p-6">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-body text-ink-200">{m}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <Section>
        <SystemFAQ locale={locale} title={localized(hub.faqTitle, locale)} items={hub.faq} />
      </Section>

      {/* conversion */}
      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-h2 font-semibold text-white">{localized(hub.ctaTitle, locale)}</h2>
            <p className="mt-3 text-body-l text-ink-300">{localized(hub.ctaText, locale)}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/rfq" variant="gold" size="lg">
              {tc('requestAnalysis')}
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              {tc('contactEngineering')}
            </Button>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          serviceJsonLd({
            locale,
            name: hubName,
            description: localized(hub.seo.description, locale),
            path: '/metal-suspended-ceiling',
          }),
          faqJsonLd(
            hub.faq.map((f) => ({
              question: localized(f.q, locale),
              answer: localized(f.a, locale),
            })),
          ),
          breadcrumbJsonLd(
            crumbs.map((c) => ({ name: c.name, path: c.path })),
            locale,
          ),
        ]}
      />
    </>
  );
}
