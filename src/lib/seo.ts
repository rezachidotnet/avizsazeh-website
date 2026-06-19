import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import { SITE_URL, company } from './site';

const OG_IMAGE = '/og';

/** Build an absolute URL for a locale + in-app path. fa is unprefixed, en is /en. */
export function localeUrl(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  const prefix = locale === 'fa' ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}

type BuildMetaArgs = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  images?: string[];
  type?: 'website' | 'article';
  /**
   * When true the title is used verbatim (no parent " · AvizSazeh" template
   * suffix). Use for pages whose SEO title already carries the brand + the
   * commercial keyword and must match the audited string exactly.
   */
  titleAbsolute?: boolean;
};

/**
 * Per-page metadata with canonical + hreflang alternates, OpenGraph and Twitter cards.
 */
export function buildMetadata({
  locale,
  path = '/',
  title,
  description,
  images,
  type = 'website',
  titleAbsolute = false,
}: BuildMetaArgs): Metadata {
  const canonical = localeUrl(locale, path);
  const ogImages = (images ?? [OG_IMAGE]).map((src) =>
    src.startsWith('http') ? src : `${SITE_URL}${src}`,
  );

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: localeUrl('fa', path),
        en: localeUrl('en', path),
        'x-default': localeUrl('fa', path),
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: company.shortName[locale],
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      images: ogImages.map((url) => ({ url, width: 1200, height: 630, alt: title })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages,
    },
  };
}

/* ───────────────────────── JSON-LD structured data ───────────────────────── */

export function organizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: company.legalName[locale],
    alternateName: company.legalName[locale === 'fa' ? 'en' : 'fa'],
    url: SITE_URL,
    logo: `${SITE_URL}/brand/standard-logo.png`,
    image: `${SITE_URL}${OG_IMAGE}`,
    foundingDate: String(company.founded),
    description:
      locale === 'fa'
        ? 'مشاوره، طراحی، تولید و اجرای سیستم‌های سقف فلزی آویزان به‌صورت سیستم مهندسی معماری.'
        : 'Consulting, design, manufacturing and installation of suspended metal ceiling systems, delivered as architectural engineering systems.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address[locale],
      addressLocality: company.city[locale],
      addressRegion: company.postalRegion,
      addressCountry: company.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.geo.lat,
      longitude: company.geo.lng,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: `+98${company.phoneConsult.replace(/^0/, '')}`,
        contactType: 'sales',
        areaServed: company.regions,
        availableLanguage: ['fa', 'en'],
      },
    ],
    email: company.email,
    sameAs: [company.instagramUrl],
    areaServed: company.regions,
    knowsAbout: [
      'Suspended metal ceiling systems',
      'Architectural engineering',
      'Linear ceiling',
      'Open cell ceiling',
      'Metal tile ceiling',
      'Baffle ceiling',
    ],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: company.shortName[locale],
    inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: localeUrl(locale, item.path),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function systemJsonLd(args: {
  locale: Locale;
  name: string;
  description: string;
  slug: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: args.name,
    category: 'Architectural ceiling system',
    description: args.description,
    image: `${SITE_URL}${args.image}`,
    url: localeUrl(args.locale, `/systems/${args.slug}`),
    brand: { '@type': 'Brand', name: company.shortName[args.locale] },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * Service schema — frames a system / category / application page as an
 * engineering service offered by AvizSazeh (design, manufacturing, execution).
 */
export function serviceJsonLd(args: {
  locale: Locale;
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    serviceType:
      args.serviceType ??
      (args.locale === 'fa'
        ? 'طراحی، تولید و اجرای سقف کاذب فلزی'
        : 'Metal suspended ceiling design, manufacturing and installation'),
    description: args.description,
    url: localeUrl(args.locale, args.path),
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: company.regions,
    availableLanguage: ['fa', 'en'],
  };
}

/** LocalBusiness — for the contact/homepage layer (address, geo, hours, phone). */
export function localBusinessJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: company.legalName[locale],
    image: `${SITE_URL}${OG_IMAGE}`,
    url: SITE_URL,
    telephone: `+98${company.mobile.replace(/^0/, '')}`,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address[locale],
      addressLocality: company.city[locale],
      addressRegion: company.postalRegion,
      addressCountry: company.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.geo.lat,
      longitude: company.geo.lng,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+98${company.mobile.replace(/^0/, '')}`,
      contactType: 'sales',
      areaServed: company.regions,
      availableLanguage: ['fa', 'en'],
    },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    areaServed: company.regions,
  };
}

/** CreativeWork — used for project case-study pages (no fabricated ratings). */
export function creativeWorkJsonLd(args: {
  locale: Locale;
  name: string;
  description: string;
  path: string;
  images?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: args.name,
    description: args.description,
    url: localeUrl(args.locale, args.path),
    inLanguage: args.locale === 'fa' ? 'fa-IR' : 'en-US',
    creator: { '@id': `${SITE_URL}/#organization` },
    ...(args.images && args.images.length
      ? {
          image: args.images.map((src) => ({
            '@type': 'ImageObject',
            url: src.startsWith('http') ? src : `${SITE_URL}${src}`,
          })),
        }
      : {}),
  };
}
