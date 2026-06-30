import BimPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/bim/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <BimPage params={params} />;
}
