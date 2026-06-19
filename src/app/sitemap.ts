import type { MetadataRoute } from 'next';
import { localeUrl } from '@/lib/seo';
import { systemSlugs } from '@/lib/content/systems';
import { applicationSlugs } from '@/lib/content/applications';
import { projects, hasCaseStudy } from '@/lib/content/projects';

const STATIC_PATHS = [
  '/',
  '/metal-suspended-ceiling',
  '/systems',
  '/systems/compare',
  '/engineering',
  '/bim',
  '/projects',
  '/about',
  '/contact',
  '/rfq',
  '/legal/privacy',
  '/legal/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudyPaths = projects
    .filter(hasCaseStudy)
    .map((p) => `/projects/${p.slug}`);

  const paths = [
    ...STATIC_PATHS,
    ...systemSlugs.map((s) => `/systems/${s}`),
    ...applicationSlugs.map((a) => `/applications/${a}`),
    ...caseStudyPaths,
  ];

  const priorityFor = (path: string) => {
    if (path === '/') return 1;
    if (path === '/metal-suspended-ceiling') return 0.9;
    if (path.startsWith('/systems/')) return 0.8;
    if (path.startsWith('/applications/')) return 0.8;
    if (path.startsWith('/projects/')) return 0.7;
    if (path.startsWith('/legal/')) return 0.3;
    return 0.7;
  };

  return paths.map((path) => ({
    url: localeUrl('fa', path),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: priorityFor(path),
    alternates: {
      languages: {
        fa: localeUrl('fa', path),
        en: localeUrl('en', path),
      },
    },
  }));
}
