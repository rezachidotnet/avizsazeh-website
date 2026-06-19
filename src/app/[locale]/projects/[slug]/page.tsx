import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { routing, Link } from '@/i18n/routing';
import {
  buildMetadata,
  breadcrumbJsonLd,
  creativeWorkJsonLd,
} from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SystemCard } from '@/components/system/SystemCard';
import { JsonLd } from '@/components/shared/JsonLd';
import {
  projects,
  getProject,
  hasCaseStudy,
  projectName,
  projectSector,
  type Project,
} from '@/lib/content/projects';
import { systems } from '@/lib/content/systems';
import { applications } from '@/lib/content/applications';
import { localized } from '@/lib/site';

export const dynamicParams = false;

/** Only projects that carry real content get a static case-study page. */
const caseStudies = projects.filter(hasCaseStudy);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    caseStudies.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const project = getProject(params.slug);
  if (!project || !hasCaseStudy(project)) return {};
  const cs = project.caseStudy;
  return buildMetadata({
    locale: params.locale,
    path: `/projects/${project.slug}`,
    title: cs ? localized(cs.seo.title, params.locale) : projectName(project, params.locale),
    description: cs
      ? localized(cs.seo.description, params.locale)
      : project.challengeFa ?? project.solutionFa ?? projectName(project, params.locale),
    images: project.images && project.images.length > 0 ? [project.images[0]] : undefined,
    titleAbsolute: Boolean(cs),
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const project = getProject(params.slug);
  if (!project || !hasCaseStudy(project)) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('projectDetail');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const name = projectName(project, locale);
  const cs = project.caseStudy;
  const sector = projectSector(project, locale);

  // Build the metadata grid from known fields only — never render a null.
  const meta: { label: string; value: string }[] = [];
  const push = (label: string, value: Project[keyof Project] | undefined | null) => {
    if (value && typeof value === 'string') meta.push({ label, value });
  };
  push(t('labels.sector'), sector);
  push(t('labels.location'), project.locationFa);
  push(t('labels.year'), project.year);
  push(t('labels.system'), project.systemTypeFa);
  push(t('labels.area'), project.areaM2);
  push(t('labels.height'), project.executionHeightM);

  const images = project.images ?? [];
  const relatedSystems = (cs?.relatedSystems ?? [])
    .map((slug) => systems.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedApplications = (cs?.relatedApplications ?? [])
    .map((slug) => applications.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: tNav('projects'), path: '/projects' },
    { name, path: `/projects/${project.slug}`, current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={cs ? localized(cs.projectType, locale) : t('eyebrow')}
        title={name}
        intro={cs ? localized(cs.lead, locale) : sector ?? undefined}
        breadcrumbs={crumbs}
      />

      {meta.length > 0 ? (
        <Section dark>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {meta.map((m) => (
              <div key={m.label} className="bg-ink-900 p-6">
                <dt className="text-caption uppercase tracking-[0.12em] text-ink-400">{m.label}</dt>
                <dd className="mt-2 text-body font-medium text-white">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {cs ? (
        <>
          <Section>
            <SectionHeader title={t('challengeTitle')} description={localized(cs.challenge, locale)} />
          </Section>
          <Section ivory>
            <SectionHeader title={t('systemLogicTitle')} description={localized(cs.systemLogic, locale)} />
          </Section>
          <Section>
            <SectionHeader title={t('constraintsTitle')} description={localized(cs.constraints, locale)} />
          </Section>
          <Section ivory>
            <SectionHeader title={t('roleTitle')} description={localized(cs.role, locale)} />
          </Section>
        </>
      ) : (
        <>
          {project.challengeFa ? (
            <Section>
              <SectionHeader title={t('challengeTitle')} description={project.challengeFa} />
            </Section>
          ) : null}
          {project.solutionFa ? (
            <Section ivory>
              <SectionHeader title={t('solutionTitle')} description={project.solutionFa} />
            </Section>
          ) : null}
        </>
      )}

      {/* Execution photos when verified; otherwise the visual checklist (no fake imagery). */}
      {images.length > 0 ? (
        <Section dark>
          <SectionHeader title={t('galleryTitle')} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-ink-900"
              >
                <Image src={src} alt={`${name} — ${sector ?? ''}`.trim()} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Section>
      ) : cs ? (
        <Section dark>
          <SectionHeader title={t('pendingVisualsTitle')} description={localized(cs.dataNote, locale)} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cs.visualPlaceholders[locale].map((v) => (
              <li
                key={v}
                className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-body-s text-ink-500"
              >
                {v}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* related systems — internal links */}
      {relatedSystems.length > 0 ? (
        <Section>
          <h2 className="font-display text-h2 font-semibold text-white">{t('relatedSystemsTitle')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {relatedSystems.map((s, i) => (
              <SystemCard key={s.slug} system={s} locale={locale} index={i} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* related applications — internal links */}
      {relatedApplications.length > 0 ? (
        <Section ivory>
          <h2 className="font-display text-h2 font-semibold text-white">{t('relatedApplicationsTitle')}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {relatedApplications.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/applications/${a.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-5 transition-colors hover:border-gold/40"
                >
                  <span className="font-display text-h4 font-semibold text-white">{localized(a.keyword, locale)}</span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gold transition-transform duration-fast group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* conversion */}
      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <h2 className="max-w-xl font-display text-h2 font-semibold text-white">{tc('requestSimilarReview')}</h2>
          <Button href="/rfq" variant="gold" size="lg" className="shrink-0">
            {tc('requestAnalysis')}
          </Button>
        </div>
      </Section>

      <JsonLd
        data={[
          creativeWorkJsonLd({
            locale,
            name,
            description: cs ? localized(cs.lead, locale) : project.challengeFa ?? name,
            path: `/projects/${project.slug}`,
            images,
          }),
          breadcrumbJsonLd(
            crumbs.map((c) => ({ name: c.name, path: c.path })),
            locale,
          ),
        ]}
      />
    </>
  );
}
