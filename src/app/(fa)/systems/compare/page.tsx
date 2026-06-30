import SystemComparePage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/systems/compare/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <SystemComparePage params={params} />;
}
