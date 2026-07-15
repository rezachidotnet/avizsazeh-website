import { useLocale, useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ClientWall } from '@/components/sections/ClientWall';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/routing';
import { featuredProjects, hasCaseStudy, projectName, projectSector, type ProofStatus } from '@/lib/content/projects';

export function ProofClients() {
  const t = useTranslations('home.proof');
  const tp = useTranslations('projectsPage');
  const tc = useTranslations('cta');
  const locale = useLocale() as Locale;

  const badgeFor = (status: ProofStatus) =>
    status === 'documented'
      ? tp('badgeFile')
      : status === 'partial'
        ? tp('badgeReference')
        : tp('badgeNeedsPhoto');

  // The strongest three records — the "we have built this" proof module.
  const cards = featuredProjects.slice(0, 3);

  return (
    <Section dark>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((p) => (
          <ProjectCard
            key={p.slug}
            name={projectName(p, locale)}
            sector={projectSector(p, locale)}
            logo={p.logo}
            image={p.images && p.images.length > 0 ? p.images[0] : undefined}
            badge={badgeFor(p.proofStatus)}
            href={hasCaseStudy(p) ? `/projects/${p.slug}` : undefined}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/projects" variant="gold">
          {tc('viewProjectsProof')}
        </Button>
      </div>

      {/* secondary, supporting logo strip */}
      <div className="mt-16 border-t border-white/10 pt-10">
        <ClientWall locale={locale} limit={8} />
      </div>
    </Section>
  );
}
