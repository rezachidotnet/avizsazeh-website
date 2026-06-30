import ApplicationPage, {
  dynamicParams,
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/applications/[slug]/page';
import { applicationSlugs } from '@/lib/content/applications';

export { dynamicParams };

export function generateStaticParams() {
  return applicationSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return generateLocalizedMetadata({ params: { locale: 'fa', slug: params.slug } });
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ApplicationPage params={{ locale: 'fa', slug: params.slug }} />;
}
