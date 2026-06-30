import TermsPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/legal/terms/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <TermsPage params={params} />;
}
