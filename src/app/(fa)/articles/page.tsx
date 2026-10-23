import ArticlesIndexPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/articles/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <ArticlesIndexPage params={params} />;
}
