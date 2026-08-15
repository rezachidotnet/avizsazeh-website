import {
  isCeilingSystemSlug,
  type CeilingSystemSlug,
} from '@/lib/content/system-slugs';

const LOCALE_SEGMENTS = new Set(['fa', 'en', 'ar']);

export function ceilingSystemFromPath(pathname: string): CeilingSystemSlug | undefined {
  const [pathOnly = '/'] = pathname.split(/[?#]/);
  const segments = pathOnly.split('/').filter(Boolean);
  const offset = LOCALE_SEGMENTS.has(segments[0] ?? '') ? 1 : 0;

  if (segments[offset] !== 'systems') return undefined;
  if (segments.length !== offset + 2) return undefined;

  const slug = segments[offset + 1];
  return slug && isCeilingSystemSlug(slug) ? slug : undefined;
}
