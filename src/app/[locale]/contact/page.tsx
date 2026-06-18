import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';
import { company, localized } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contactPage' });
  return buildMetadata({
    locale: params.locale,
    path: '/contact',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('contactPage');
  const tNav = await getTranslations('nav');
  const tc = await getTranslations('cta');

  const mapsUrl = `https://www.google.com/maps?q=${company.geo.lat},${company.geo.lng}`;

  const rows: { icon: IconKey; label: string; value: string; href?: string; mono?: boolean }[] = [
    { icon: 'control', label: t('phone'), value: company.phoneConsultDisplay, href: `tel:${company.phoneConsult}`, mono: true },
    { icon: 'team', label: t('mobile'), value: company.mobileDisplay, href: `tel:${company.mobile}`, mono: true },
    { icon: 'office', label: t('email'), value: company.email, href: `mailto:${company.email}` },
    { icon: 'system', label: t('instagram'), value: `@${company.instagram}`, href: company.instagramUrl },
    { icon: 'architecture', label: t('address'), value: localized(company.address, locale) },
    { icon: 'quality', label: t('hours'), value: localized(company.hours, locale) },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        breadcrumbs={[
          { name: tNav('home'), path: '/' },
          { name: tNav('contact'), path: '/contact', current: true },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <ul className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              {rows.map((row) => {
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/[0.04] text-gold">
                      <SystemIcon name={row.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-caption uppercase tracking-wide text-ink-500">
                        {row.label}
                      </span>
                      <span className={row.mono ? 'nums mt-1 text-body font-medium text-white' : 'mt-1 text-body font-medium text-white'}>
                        {row.value}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={row.label} className="bg-ink-900">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex h-full items-start gap-4 px-5 py-6 transition-colors hover:bg-white/[0.03]"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex h-full items-start gap-4 px-5 py-6">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <Button href="/rfq" variant="gold" size="lg">
                {tc('requestAnalysis')}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-ink-200 bg-ink-100"
              aria-label={t('mapAlt')}
            >
              <Image
                src="/brand/map.webp"
                alt={t('mapAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-slow group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-ink-950/70 px-5 py-3 text-body-s text-white backdrop-blur-sm">
                <SystemIcon name="architecture" className="h-4 w-4 text-gold-300" />
                {localized(company.city, locale)} — {localized(company.address, locale)}
              </span>
            </a>
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tNav('home'), path: '/' },
            { name: tNav('contact'), path: '/contact' },
          ],
          locale,
        )}
      />
    </>
  );
}
