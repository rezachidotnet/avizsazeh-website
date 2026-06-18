import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import {
  buildMetadata,
  breadcrumbJsonLd,
  systemJsonLd,
} from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { SystemCard } from '@/components/system/SystemCard';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { systems, getSystem } from '@/lib/content/systems';
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
    title: localized(system.name, params.locale),
    description: localized(system.definition, params.locale),
    images: [system.cover],
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
  const logic = system.logic[locale];
  const useCases = system.useCases[locale];
  const related = systems.filter((s) => s.slug !== system.slug);

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: tNav('systems'), path: '/systems' },
    { name, path: `/systems/${system.slug}`, current: true },
  ];

  return (
    <>
      <PageHero
        eyebrow={localized(system.category, locale)}
        title={name}
        intro={localized(system.definition, locale)}
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left: logic + use cases */}
          <div className="lg:col-span-7">
            <span className="eyebrow">{t('logic')}</span>
            <ul className="mt-6 space-y-4">
              {logic.map((item) => (
                <li key={item} className="flex gap-4">
                  <SystemIcon
                    name="engineering"
                    className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                  />
                  <span className="text-body-l text-ink-700">{item}</span>
                </li>
              ))}
            </ul>

            <span className="eyebrow mt-12">{t('useCases')}</span>
            <ul className="mt-6 flex flex-wrap gap-2">
              {useCases.map((u) => (
                <li
                  key={u}
                  className="rounded border border-ink-200 bg-white px-4 py-2 text-body-s text-ink-700"
                >
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* right: spec sheet */}
          <aside className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
              <div className="border-b border-ink-200 bg-ivory px-6 py-4">
                <span className="eyebrow">{t('specs')}</span>
              </div>
              <dl className="divide-y divide-ink-200">
                {system.specs.map((row) => (
                  <div
                    key={row.label.en}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <dt className="text-body-s text-ink-500">
                      {localized(row.label, locale)}
                    </dt>
                    <dd className="text-body-s font-medium text-ink">
                      {localized(row.value, locale)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      {/* gallery */}
      <Section ivory className="!pt-0 lg:!pt-0">
        <span className="eyebrow">{t('gallery')}</span>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {system.gallery.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[16/10] overflow-hidden rounded-lg border border-ink-200 bg-ink-100"
            >
              <Image
                src={src}
                alt={`${name} — ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* conversion */}
      <Section dark>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-h2 font-semibold text-white">{t('ctaTitle')}</h2>
            <p className="mt-3 text-body-l text-ink-300">{t('ctaText')}</p>
          </div>
          <Button href="/rfq" variant="gold" size="lg" className="shrink-0">
            {tc('submitProject')}
          </Button>
        </div>
      </Section>

      {/* related */}
      <Section>
        <span className="eyebrow">{t('related')}</span>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((s, i) => (
            <SystemCard key={s.slug} system={s} locale={locale} index={i} />
          ))}
        </div>
      </Section>

      <JsonLd
        data={[
          systemJsonLd({
            locale,
            name,
            description: localized(system.definition, locale),
            slug: system.slug,
            image: system.cover,
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
