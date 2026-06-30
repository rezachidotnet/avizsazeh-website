import SystemDetailPage, {
  dynamicParams,
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/systems/[slug]/page';
import { systemSlugs } from '@/lib/content/systems';

export { dynamicParams };

export function generateStaticParams() {
  return systemSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return generateLocalizedMetadata({ params: { locale: 'fa', slug: params.slug } });
}

export default function Page({ params }: { params: { slug: string } }) {
  return <SystemDetailPage params={{ locale: 'fa', slug: params.slug }} />;
}
