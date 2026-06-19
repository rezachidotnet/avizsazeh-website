import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { Vazirmatn, Inter, Source_Serif_4 } from 'next/font/google';
import { routing, localeDirection, type Locale } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { JsonLd } from '@/components/shared/JsonLd';
import { organizationJsonLd, websiteJsonLd, localeUrl } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0B0F14',
  colorScheme: 'dark',
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'brand' });
  const title = `${t('fullName')} — ${t('tagline')}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${t('name')}`,
    },
    description: t('tagline'),
    applicationName: t('name'),
    alternates: {
      canonical: localeUrl(locale, '/'),
      languages: {
        fa: localeUrl('fa', '/'),
        en: localeUrl('en', '/'),
        'x-default': localeUrl('fa', '/'),
      },
    },
    icons: {
      icon: [
        { url: '/favicon.avif', type: 'image/avif', sizes: '143x142' },
        { url: '/favicon.webp', type: 'image/webp', sizes: '143x142' },
        { url: '/icon.png', type: 'image/png', sizes: '146x144' },
      ],
      apple: [{ url: '/icon.png' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];
  const t = await getTranslations('common');

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${vazir.variable} ${inter.variable} ${sourceSerif.variable}`}
    >
      <body className="flex min-h-screen flex-col pb-16 lg:pb-0">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:font-medium focus:text-ink-950"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileActionBar />
        </NextIntlClientProvider>
        <JsonLd data={[organizationJsonLd(locale as Locale), websiteJsonLd(locale as Locale)]} />
      </body>
    </html>
  );
}
