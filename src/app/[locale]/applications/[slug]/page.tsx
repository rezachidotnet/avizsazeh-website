import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { routing, Link } from '@/i18n/routing';
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
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { applications, getApplication } from '@/lib/content/applications';
import { systems } from '@/lib/content/systems';
import { getProject, projectName } from '@/lib/content/projects';
import { localized } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    applications.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const app = getApplication(params.slug);
  if (!app) return {};
  return buildMetadata({
    locale: params.locale,
    path: `/applications/${app.slug}`,
    title: localized(app.seo.title, params.locale),
    description: localized(app.seo.description, params.locale),
    images: [app.cover],
    titleAbsolute: true,
  });
}

export default async function ApplicationPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const app = getApplication(params.slug);
  if (!app) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('applicationsPage');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const keyword = localized(app.keyword, locale);
  const suitable = app.suitableSystems
    .map((slug) => systems.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedProjects = app.relatedProjects
    .map((slug) => getProject(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: keyword, path: `/applications/${app.slug}`, current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={localized(app.eyebrow, locale)}
        title={localized(app.h1, locale)}
        intro={localized(app.lead, locale)}
        breadcrumbs={crumbs}
      />

      {/* hero visual */}
      <Section className="!pb-0">
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-white/10 bg-ink-100">
          <Image
            src={app.cover}
            alt={localized(app.coverAlt, locale)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </Section>

      {/* use cases */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">{t('useCasesTitle')}</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 sm:grid-cols-2">
          {app.useCases[locale].map((u) => (
            <li key={u} className="flex items-center gap-3 bg-ink-900 px-5 py-5">
              <SystemIcon name="architecture" className="h-5 w-5 shrink-0 text-gold" />
              <span className="text-body-s font-medium text-ink-200">{u}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* challenges */}
      <Section ivory>
        <h2 className="font-display text-h2 font-semibold text-white">{t('challengesTitle')}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {app.challenges.map((c) => (
            <div key={c.title.en} className="rounded-lg border border-white/10 bg-white/[0.03] p-7">
              <h3 className="font-display text-h4 font-semibold text-white">{localized(c.title, locale)}</h3>
              <p className="mt-3 text-body-s leading-relaxed text-ink-700">{localized(c.text, locale)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* engineering requirements */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">{t('requirementsTitle')}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {app.requirements[locale].map((r) => (
            <li key={r} className="flex items-start gap-3 rounded-sm border border-white/10 bg-white/[0.03] px-5 py-4">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-body-s text-ink-200">{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* suitable systems — internal links */}
      <Section ivory>
        <h2 className="font-display text-h2 font-semibold text-white">{t('systemsTitle')}</h2>
        <p className="mt-4 max-w-prose text-body-l text-ink-300">{t('systemsIntro')}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {suitable.map((s, i) => (
            <SystemCard key={s.slug} system={s} locale={locale} index={i} />
          ))}
        </div>
      </Section>

      {/* category-hub link */}
      <Section className="!pt-0 lg:!pt-0">
        <div className="flex flex-col items-start gap-4 rounded-lg border border-gold/25 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-h3 font-semibold text-white">{t('hubTitle')}</h2>
            <p className="mt-2 text-body-s text-ink-400">{t('hubText')}</p>
          </div>
          <Button href="/metal-suspended-ceiling" variant="outline" size="lg" className="shrink-0">
            {locale === 'fa' ? 'سقف کاذب فلزی' : 'Metal suspended ceiling'}
          </Button>
        </div>
      </Section>

      {/* project proof — internal links */}
      {relatedProjects.length > 0 ? (
        <Section ivory>
          <h2 className="font-display text-h2 font-semibold text-white">{t('projectsTitle')}</h2>
          <p className="mt-4 max-w-prose text-body-l text-ink-300">{t('projectsIntro')}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {relatedProjects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-5 transition-colors hover:border-gold/40"
                >
                  <span className="font-display text-h4 font-semibold text-white">{projectName(p, locale)}</span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gold transition-transform duration-fast group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* FAQ */}
      <Section>
        <SystemFAQ locale={locale} title={t('faqTitle')} items={app.faq} />
      </Section>

      {/* conversion */}
      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-h2 font-semibold text-white">{t('ctaTitle')}</h2>
            <p className="mt-3 text-body-l text-ink-300">{t('ctaText')}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/rfq" variant="gold" size="lg">
              {tc('submitProject')}
            </Button>
            <Button href="/systems/compare" variant="outline" size="lg">
              {tc('compareSystems')}
            </Button>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          serviceJsonLd({
            locale,
            name: keyword,
            description: localized(app.seo.description, locale),
            path: `/applications/${app.slug}`,
          }),
          faqJsonLd(
            app.faq.map((f) => ({
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
