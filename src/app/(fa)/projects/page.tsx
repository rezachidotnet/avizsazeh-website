import ProjectsPage, {
  generateMetadata as generateLocalizedMetadata,
} from '../../[locale]/projects/page';

const params = { locale: 'fa' as const };

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return <ProjectsPage params={params} />;
}
