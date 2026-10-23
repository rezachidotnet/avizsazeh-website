import type { MetadataRoute } from 'next';
import { SEO_LOCALES, languageAlternates, localeUrl } from '@/lib/seo';
import { systemSlugs } from '@/lib/content/systems';
import { applicationSlugs } from '@/lib/content/applications';
import { projects, hasCaseStudy, isIndexableProject } from '@/lib/content/projects';
import { getArticles } from '@/lib/articles';

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
    .filter((project) => hasCaseStudy(project) && isIndexableProject(project))
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

  const shared = SEO_LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: localeUrl(locale, path),
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: priorityFor(path),
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  ) as MetadataRoute.Sitemap;

  // Articles are single-language: list the index only where the locale has
  // its own articles, and each article only under its own locale.
  const articleEntries: MetadataRoute.Sitemap = SEO_LOCALES.flatMap((locale) => {
    const list = getArticles(locale);
    if (!list.length) return [];
    return [
      {
        url: localeUrl(locale, '/articles'),
        lastModified: list[0].updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      ...list.map((a) => ({
        url: localeUrl(locale, `/articles/${a.slug}`),
        lastModified: a.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  });

  return [...shared, ...articleEntries];
}
