import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { LegalArticle, buildLegalMetadata } from '@/components/legal/LegalArticle';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return buildLegalMetadata('privacy', params.locale);
}

export default function PrivacyPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  return <LegalArticle kind="privacy" />;
}
