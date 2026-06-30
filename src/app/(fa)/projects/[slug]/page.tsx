import ProjectDetailPage, {
  dynamicParams,
  generateMetadata as generateLocalizedMetadata,
} from '../../../[locale]/projects/[slug]/page';
import { hasCaseStudy, projects } from '@/lib/content/projects';

export { dynamicParams };

export function generateStaticParams() {
  return projects.filter(hasCaseStudy).map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return generateLocalizedMetadata({ params: { locale: 'fa', slug: params.slug } });
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ProjectDetailPage params={{ locale: 'fa', slug: params.slug }} />;
}
