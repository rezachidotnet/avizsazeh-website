import LocaleLayout, {
  generateMetadata as generateLocalizedMetadata,
  viewport,
} from '../[locale]/layout';

const params = { locale: 'fa' as const };

export { viewport };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function RootPersianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LocaleLayout params={params}>{children}</LocaleLayout>;
}
