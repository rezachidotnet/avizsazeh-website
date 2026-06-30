import AboutPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/about/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <AboutPage params={params} />;
}
