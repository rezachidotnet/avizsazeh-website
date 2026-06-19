import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { JsonLd } from '@/components/shared/JsonLd';

type LegalKind = 'privacy' | 'terms';

type LegalSection = { heading: string; body: string };

/** Shared metadata builder for the two legal pages (privacy / terms). */
export async function buildLegalMetadata(kind: LegalKind, locale: Locale) {
  const t = await getTranslations({ locale, namespace: `legal.${kind}` });
  return buildMetadata({
    locale,
    path: `/legal/${kind}`,
    title: t('title'),
    description: t('intro'),
  });
}

/**
 * Server-rendered legal document (privacy / terms). Content comes from the
 * localized `legal` message namespace, so both fa and en render from the same
 * template with no design divergence.
 */
export async function LegalArticle({ kind }: { kind: LegalKind }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations(`legal.${kind}`);
  const tLegal = await getTranslations('legal');
  const tNav = await getTranslations('nav');

  const sections = t.raw('sections') as LegalSection[];
  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: t('title'), path: `/legal/${kind}`, current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="mx-auto max-w-prose">
          <p className="text-caption uppercase tracking-[0.16em] text-ink-500">
            {tLegal('lastUpdatedLabel')}: {tLegal('lastUpdated')}
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-h3 font-semibold text-white">
                  {section.heading}
                </h2>
                <p className="mt-4 text-body leading-relaxed text-ink-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, path: c.path })),
          locale,
        )}
      />
    </>
  );
}
