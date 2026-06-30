import type { Locale } from '@/i18n/routing';

/**
 * Canonical origin. Keep metadata, sitemap, robots, JSON-LD and redirects on
 * the public www host even when preview/local requests use another host.
 */
export const SITE_URL = 'https://www.avizsazeh.ir';

/**
 * Real company identity (source: avizsazeh.ir + brand-guid).
 * No fabricated data — every field is sourced from existing company records.
 */
export const company = {
  legalName: {
    fa: 'شرکت آویزسازه نقش جهان',
    en: 'Avizsazeh Naghsh Jahan Co.',
    ar: 'شركة آویزسازه نقش جهان',
  },
  shortName: {
    fa: 'آویزسازه',
    en: 'AvizSazeh',
    ar: 'آویزسازه',
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
  /** International (E.164-style) forms for WhatsApp / cross-border contact. */
  mobileIntl: '989120656528',
  mobileIntlDisplay: '+98 912 065 6528',
  whatsappUrl: 'https://wa.me/989120656528',
  email: 'info@avizsazeh.ir',
  emailAlt: 'info@avizsazeh.com',
  instagram: 'Avizsazeh',
  instagramUrl: 'https://instagram.com/avizsazeh',
  address: {
    fa: 'اصفهان، خیابان هزارجریب، ابتدای خیابان خسروپور، کوی آزادگان، پلاک ۶',
    en: 'Isfahan, Hezar Jarib St., beginning of Khosropour St., Kooy-e Azadegan, No. 6',
    ar: 'أصفهان، شارع هزار جريب، بداية شارع خسروبور، حي آزادگان، رقم 6',
  },
  city: { fa: 'اصفهان', en: 'Isfahan', ar: 'أصفهان' },
  country: { fa: 'ایران', en: 'Iran', ar: 'إيران' },
  countryCode: 'IR',
  postalRegion: 'Isfahan',
  hours: {
    fa: 'شنبه تا چهارشنبه ۸ تا ۱۶ — پنجشنبه ۸ تا ۱۲',
    en: 'Sat–Wed 08:00–16:00 · Thu 08:00–12:00',
    ar: 'السبت إلى الأربعاء 08:00–16:00 · الخميس 08:00–12:00',
  },
  geo: { lat: 32.6125, lng: 51.6675 }, // Isfahan (city-level)
  regions: ['IR', 'IQ', 'OM'],
} as const;

export type LocalizedString = {
  fa: string;
  en?: string;
  ar?: string;
  ru?: string;
};

export type LocalizedList = {
  fa: string[];
  en?: string[];
  ar?: string[];
  ru?: string[];
};

export function localized<T extends LocalizedString>(
  field: T,
  locale: Locale,
): string {
  return field[locale] ?? field.fa;
}

export function localizedList<T extends LocalizedList>(
  field: T,
  locale: Locale,
): string[] {
  return field[locale] ?? field.fa;
}
