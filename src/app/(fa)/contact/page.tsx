import ContactPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/contact/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <ContactPage params={params} />;
}
