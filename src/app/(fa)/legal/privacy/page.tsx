import PrivacyPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/legal/privacy/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <PrivacyPage params={params} />;
}
