import ArticlePage, {
  dynamicParams,
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/articles/[slug]/page';
import { getArticles } from '@/lib/articles';

export { dynamicParams };

export function generateStaticParams() {
  return getArticles('fa').map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return generateLocalizedMetadata({ params: { locale: 'fa', slug: params.slug } });
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ArticlePage params={{ locale: 'fa', slug: params.slug }} />;
}
