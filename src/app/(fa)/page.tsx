import HomePage, {
  generateMetadata as generateLocalizedMetadata,
} from '../[locale]/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <HomePage params={params} />;
}
