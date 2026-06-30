import SystemsPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/systems/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <SystemsPage params={params} />;
}
