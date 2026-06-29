import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { routing, Link } from '@/i18n/routing';
import {
  buildMetadata,
  breadcrumbJsonLd,
  systemJsonLd,
  faqJsonLd,
} from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { SystemCard } from '@/components/system/SystemCard';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { EngineeringLogic } from '@/components/system/EngineeringLogic';
import { SystemSpecTable } from '@/components/system/SystemSpecTable';
import { DatasheetCta } from '@/components/system/DatasheetCta';
import { ApplicationFitGrid } from '@/components/system/ApplicationFitGrid';
import { DesignVariants } from '@/components/system/DesignVariants';
import { SystemSelectionGuidance } from '@/components/system/SystemSelectionGuidance';
import { VisualDocumentation } from '@/components/system/VisualDocumentation';
import { SystemFAQ } from '@/components/system/SystemFAQ';
import { TrackView } from '@/components/analytics/TrackView';
import { systems, getSystem } from '@/lib/content/systems';
import { applications } from '@/lib/content/applications';
import { projects, hasCaseStudy, projectName } from '@/lib/content/projects';
import { localized } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    systems.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const system = getSystem(params.slug);
  if (!system) return {};
  return buildMetadata({
    locale: params.locale,
    path: `/systems/${system.slug}`,
    title: localized(system.seo.title, params.locale),
    description: localized(system.seo.description, params.locale),
    images: [system.cover],
    titleAbsolute: true,
  });
}

export default async function SystemDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const system = getSystem(params.slug);
  if (!system) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('systemDetail');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const name = localized(system.name, locale);
  const h1 = localized(system.h1, locale);
  const related = systems.filter((s) => s.slug !== system.slug);
  const schemaName =
    system.slug === 'linear-ceiling' && locale === 'fa' ? 'سقف خطی فلزی' : name;
  const schemaServiceType =
    system.slug === 'linear-ceiling'
      ? locale === 'fa'
        ? 'طراحی، تولید و اجرای سقف کاذب فلزی خطی'
        : 'Design, manufacturing and installation of linear metal suspended ceilings'
      : locale === 'fa'
        ? `طراحی، تولید و اجرای ${name}`
        : `${name} design, manufacturing and installation`;

  const heroAlt =
    locale === 'fa'
      ? `${name} — سقف کاذب فلزی مهندسی‌شده آویزسازه`
      : `${name} — engineered metal suspended ceiling by AvizSazeh`;

  // Topic-cluster links: applications + case studies that reference this system.
  const relatedApplications = applications.filter((a) =>
    a.suitableSystems.includes(system.slug),
  );
  const relatedCaseStudies = projects.filter(
    (p) => hasCaseStudy(p) && p.caseStudy?.relatedSystems.includes(system.slug),
  );

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: tNav('systems'), path: '/systems' },
    { name, path: `/systems/${system.slug}`, current: true },
  ];

  return (
    <>
      <TrackView event="system_page_view" params={{ ceiling_system: system.slug }} />
      {/* SECTION 1 — System hero */}
      <PageHero
        eyebrow={localized(system.category, locale)}
        title={h1}
        intro={localized(system.lead, locale)}
        breadcrumbs={crumbs}
      />

      {/* hero visual */}
      <Section className="!pb-0">
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-white/10 bg-ink-100">
          <Image
            src={system.cover}
            alt={heroAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </Section>

      {/* SECTION 2 — Engineering logic + anatomy */}
      <Section>
        <EngineeringLogic
          locale={locale}
          title={t('logicTitle')}
          bullets={system.logic[locale]}
          anatomy={system.anatomy[locale]}
        />
      </Section>

      {/* SECTION 3 — Technical specifications */}
      <Section ivory>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-h2 font-semibold text-white">{t('specs')}</h2>
            <p className="mt-4 max-w-prose text-body-l text-ink-300">{t('specsCaption')}</p>
            <div className="mt-8">
              <DatasheetCta locale={locale} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <SystemSpecTable locale={locale} rows={system.specs} title={t('specs')} />
          </div>
        </div>
      </Section>

      {/* SECTION 4 — Applications */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">
          {t('applicationsTitle')}
        </h2>
        <div className="mt-8">
          <ApplicationFitGrid
            locale={locale}
            applications={system.applications}
            notRecommended={system.notRecommended[locale]}
            notRecommendedTitle={t('notRecommendedTitle')}
          />
        </div>
      </Section>

      {/* SECTION 5 — Execution gallery */}
      <Section ivory>
        <h2 className="font-display text-h2 font-semibold text-white">{t('gallery')}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {system.gallery.map((item, i) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-lg border border-white/10 bg-ink-100"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={item.src}
                  alt={localized(item.caption, locale)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={i < 2 ? undefined : 'lazy'}
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-white/10 px-5 py-4 text-body-s text-ink-700">
                {localized(item.caption, locale)}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* SECTION 6 — Design variants & customisation */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">{t('variantsTitle')}</h2>
        <div className="mt-8">
          <DesignVariants locale={locale} variants={system.variants} />
        </div>
      </Section>

      {/* Specialised technical subsections (e.g. CBI Europe, acoustic / curved baffle) */}
      {system.subsections?.length ? (
        <Section ivory className="!pt-0 lg:!pt-0">
          <span className="eyebrow">{t('deepDive')}</span>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {system.subsections.map((sub) => (
              <div
                key={sub.title.en}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="font-display text-h3 font-semibold text-white">
                  {localized(sub.title, locale)}
                </h3>
                <p className="mt-4 text-body-s leading-relaxed text-ink-700">
                  {localized(sub.body, locale)}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* SECTION 7 — System selection guidance */}
      <Section>
        <h2 className="font-display text-h2 font-semibold text-white">{t('selectionTitle')}</h2>
        <div className="mt-8">
          <SystemSelectionGuidance
            locale={locale}
            criteria={system.selection[locale]}
            compareLabel={t('compareCta')}
          />
        </div>
      </Section>

      {/* Visual documentation checklist (placeholders until real assets exist) */}
      <Section ivory>
        <VisualDocumentation
          locale={locale}
          title={t('visualsTitle')}
          items={system.requiredVisuals[locale]}
        />
      </Section>

      {/* System FAQ */}
      <Section>
        <SystemFAQ locale={locale} title={t('faqTitle')} items={system.faq} />
      </Section>

      {/* Topic-cluster links — category hub, applications, case studies */}
      <Section ivory>
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="font-display text-h3 font-semibold text-white">
              {locale === 'fa' ? 'مرجع سقف کاذب فلزی' : 'Metal suspended ceiling hub'}
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/metal-suspended-ceiling" className="group flex items-center gap-2 text-body-s text-gold transition-colors hover:text-gold-300">
                  {locale === 'fa' ? 'سقف کاذب فلزی' : 'Metal suspended ceiling'}
                </Link>
              </li>
              <li>
                <Link href="/systems/compare" className="text-body-s text-ink-300 transition-colors hover:text-white">
                  {t('compareCta')}
                </Link>
              </li>
            </ul>
          </div>

          {relatedApplications.length > 0 ? (
            <div>
              <h2 className="font-display text-h3 font-semibold text-white">
                {locale === 'fa' ? 'کاربردهای مرتبط' : 'Related applications'}
              </h2>
              <ul className="mt-5 space-y-3">
                {relatedApplications.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/applications/${a.slug}`} className="text-body-s text-ink-300 transition-colors hover:text-white">
                      {localized(a.keyword, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {relatedCaseStudies.length > 0 ? (
            <div>
              <h2 className="font-display text-h3 font-semibold text-white">
                {locale === 'fa' ? 'پروژه‌های مرتبط' : 'Related projects'}
              </h2>
              <ul className="mt-5 space-y-3">
                {relatedCaseStudies.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="text-body-s text-ink-300 transition-colors hover:text-white">
                      {projectName(p, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {/* SECTION 8 — Conversion CTA */}
      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-h2 font-semibold text-white">{t('ctaTitle')}</h2>
            <p className="mt-3 text-body-l text-ink-300">{localized(system.systemCta, locale)}</p>
            <p className="mt-4 text-body-s text-ink-500">{t('ctaTrust')}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href={`/rfq?system=${system.slug}`} variant="gold" size="lg">
              {tc('submitProject')}
            </Button>
            <Button href="/systems/compare" variant="outline" size="lg">
              {t('compareCta')}
            </Button>
          </div>
        </div>
      </Section>

      {/* SECTION 9 — Related systems with comparison hints */}
      <Section>
        <span className="eyebrow">{t('related')}</span>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((s, i) => (
            <div key={s.slug} className="flex flex-col gap-3">
              <SystemCard system={s} locale={locale} index={i} />
              <p className="px-1 text-body-s text-ink-500">
                {localized(s.comparisonHint, locale)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <JsonLd
        data={[
          systemJsonLd({
            locale,
            name: schemaName,
            description: localized(system.definition, locale),
            slug: system.slug,
            serviceType: schemaServiceType,
          }),
          faqJsonLd(
            system.faq.map((f) => ({
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
