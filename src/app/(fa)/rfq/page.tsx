import RfqPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/rfq/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <RfqPage params={params} />;
}
