import EngineeringPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/engineering/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <EngineeringPage params={params} />;
}
