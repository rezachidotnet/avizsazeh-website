import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { ProjectCard } from '@/components/projects/ProjectCard';
import {
  featuredProjects,
  projectsByGroup,
  hasCaseStudy,
  projectName,
  projectSector,
  CLIENT_GROUP_ORDER,
  type Project,
  type ProofStatus,
} from '@/lib/content/projects';

type Stat = { value: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'projectsPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/projects',
    title: t('metaTitle'),
    description: t('metaDescription'),
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

  const badgeFor = (status: ProofStatus) =>
    status === 'documented' ? t('badgeFile') : status === 'partial' ? t('badgeTechPending') : t('badgeNeedsPhoto');

  const toCard = (p: Project) => ({
    name: projectName(p, locale),
    sector: projectSector(p, locale),
    logo: p.logo,
    image: p.images && p.images.length > 0 ? p.images[0] : undefined,
    badge: badgeFor(p.proofStatus),
    cardText: t('featuredCardText'),
    href: hasCaseStudy(p) ? `/projects/${p.slug}` : undefined,
  });

  const stats = t.raw('stats') as Stat[];
  const proves = t.raw('proves') as string[];
  const caseFields = t.raw('caseFields') as string[];
  const groups = projectsByGroup();

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

      {/* proof stats bar */}
      <section className="bg-ink-950">
        <div className="container-grid py-12 lg:py-16">
          <p className="max-w-prose text-body-l text-ink-300">{t('support')}</p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-ink-950 px-6 py-7">
                <dd className="font-display text-[1.3rem] font-bold leading-tight text-gold">{s.value}</dd>
                <dt className="mt-1 text-caption uppercase tracking-[0.12em] text-ink-400">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-body-s text-ink-500">{t('statsNote')}</p>
        </div>
      </section>

      {/* flagship project records */}
      <Section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow={t('eyebrow')} title={t('featuredTitle')} description={t('featuredIntro')} />
          <Button href="/rfq" variant="gold" className="shrink-0">
            {tc('requestSimilarReview')}
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} {...toCard(p)} />
          ))}
        </div>
      </Section>

      {/* categorised clients & partners */}
      <Section ivory>
        <SectionHeader title={t('clientsTitle')} description={t('clientsIntro')} />
        <div className="mt-12 space-y-12">
          {CLIENT_GROUP_ORDER.map((key) => {
            const list = groups[key];
            if (!list.length) return null;
            return (
              <div key={key}>
                <h3 className="flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-ink-400">
                  <span className="h-px w-6 bg-gold" />
                  {t(`groups.${key}`)}
                </h3>
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {list.map((p) => (
                    <li
                      key={p.slug}
                      className="group flex h-24 items-center justify-center rounded-sm border border-white/10 bg-white px-5"
                      title={projectName(p, locale)}
                    >
                      {p.logo ? (
                        <Image
                          src={`/clients/${p.logo}`}
                          alt={projectName(p, locale)}
                          width={160}
                          height={90}
                          loading="lazy"
                          sizes="(max-width: 640px) 40vw, 220px"
                          className="max-h-12 w-auto object-contain opacity-70 grayscale transition-all duration-medium ease-aecs group-hover:opacity-100 group-hover:grayscale-0"
                        />
                      ) : (
                        <span className="text-center text-body-s font-medium text-ink-950">
                          {projectName(p, locale)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* what a documented project proves */}
      <Section dark>
        <SectionHeader eyebrow={t('eyebrow')} title={t('provesTitle')} />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 md:grid-cols-2">
          {proves.map((item, i) => (
            <li key={i} className="flex items-start gap-4 bg-ink-900 p-6">
              <span className="mt-0.5 font-latin text-body-s font-bold tabular-nums text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-body text-ink-300">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* case-study structure */}
      <Section>
        <SectionHeader title={t('caseStructureTitle')} description={t('caseStructureIntro')} />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {caseFields.map((field, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.05] px-5 py-4"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-body-s text-ink-300">{field}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* final conversion */}
      <Section dark>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-h2 font-semibold text-white">{t('finalTitle')}</h2>
            <p className="mt-4 text-body-l text-ink-300">{t('finalText')}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/rfq" variant="gold" size="lg">
              {tc('requestAnalysis')}
            </Button>
            <Button href="/systems" variant="outline" size="lg">
              {tc('viewCeilingSystems')}
            </Button>
          </div>
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
