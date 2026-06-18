import type { MetadataRoute } from 'next';
import { localeUrl } from '@/lib/seo';
import { systemSlugs } from '@/lib/content/systems';

const STATIC_PATHS = [
  '/',
  '/systems',
  '/engineering',
  '/projects',
  '/about',
  '/contact',
  '/rfq',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...systemSlugs.map((s) => `/systems/${s}`)];

  return paths.map((path) => ({
    url: localeUrl('fa', path),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/systems/') ? 0.8 : 0.7,
    alternates: {
      languages: {
        fa: localeUrl('fa', path),
        en: localeUrl('en', path),
      },
    },
  }));
}
