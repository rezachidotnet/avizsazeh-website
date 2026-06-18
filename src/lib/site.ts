import type { Locale } from '@/i18n/routing';

/** Canonical origin — overridable via env for preview/prod parity. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avizsazeh.ir'
).replace(/\/$/, '');

/**
 * Real company identity (source: avizsazeh.ir + brand-guid).
 * No fabricated data — every field is sourced from existing company records.
 */
export const company = {
  legalName: {
    fa: 'شرکت آویزسازه نقش جهان',
    en: 'Avizsazeh Naghsh Jahan Co.',
  },
  shortName: {
    fa: 'آویزسازه',
    en: 'AvizSazeh',
  },
  parent: {
    fa: 'شرکت فضاسازه نقش جهان',
    en: 'Fazasazeh Naghsh Jahan',
  },
  founded: 1997,
  phoneConsult: '03135134',
  phoneConsultDisplay: '031-35134',
  mobile: '09120656528',
  mobileDisplay: '0912-065-6528',
  email: 'info@avizsazeh.ir',
  emailAlt: 'info@avizsazeh.com',
  instagram: 'Avizsazeh',
  instagramUrl: 'https://instagram.com/avizsazeh',
  address: {
    fa: 'اصفهان، خیابان هزارجریب، ابتدای خیابان خسروپور، کوی آزادگان، پلاک ۶',
    en: 'Isfahan, Hezar Jarib St., beginning of Khosropour St., Kooy-e Azadegan, No. 6',
  },
  city: { fa: 'اصفهان', en: 'Isfahan' },
  country: { fa: 'ایران', en: 'Iran' },
  countryCode: 'IR',
  postalRegion: 'Isfahan',
  hours: {
    fa: 'شنبه تا چهارشنبه ۸ تا ۱۶ — پنجشنبه ۸ تا ۱۲',
    en: 'Sat–Wed 08:00–16:00 · Thu 08:00–12:00',
  },
  geo: { lat: 32.6125, lng: 51.6675 }, // Isfahan (city-level)
  regions: ['IR', 'IQ', 'OM', 'GCC'],
} as const;

export function localized<T extends Record<Locale, string>>(
  field: T,
  locale: Locale,
): string {
  return field[locale] ?? field.fa;
}
