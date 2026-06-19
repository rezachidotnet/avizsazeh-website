import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { projects, getProject, hasCaseStudy, projectName, type Project } from '@/lib/content/projects';

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
  return buildMetadata({
    locale: params.locale,
    path: `/projects/${project.slug}`,
    title: projectName(project, params.locale),
    description: project.challengeFa ?? project.solutionFa ?? projectName(project, params.locale),
    images: project.images && project.images.length > 0 ? [project.images[0]] : undefined,
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

  // Build the metadata grid from known fields only — never render a null.
  const meta: { label: string; value: string }[] = [];
  const push = (label: string, value: Project[keyof Project] | undefined | null) => {
    if (value) meta.push({ label, value: String(value) });
  };
  push(t('labels.sector'), project.sectorFa);
  push(t('labels.location'), project.locationFa);
  push(t('labels.year'), project.year);
  push(t('labels.system'), project.systemTypeFa);
  push(t('labels.area'), project.areaM2);
  push(t('labels.height'), project.executionHeightM);

  const images = project.images ?? [];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={name}
        intro={project.sectorFa ?? undefined}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('projects'), path: '/projects' },
          { name, path: `/projects/${project.slug}`, current: true },
        ]}
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

      {images.length > 0 ? (
        <Section dark>
          <SectionHeader title={t('galleryTitle')} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-ink-900"
              >
                <Image src={src} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
            ))}
          </div>
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
        data={breadcrumbJsonLd(
          [
            { name: tNav('home'), path: '/' },
            { name: tNav('projects'), path: '/projects' },
            { name, path: `/projects/${project.slug}` },
          ],
          locale,
        )}
      />
    </>
  );
}
