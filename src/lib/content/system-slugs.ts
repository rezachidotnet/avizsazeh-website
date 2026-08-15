const CEILING_SYSTEM_SLUGS = [
  'linear-ceiling',
  'open-cell',
  'metal-tile',
  'baffle',
] as const;

export type CeilingSystemSlug = (typeof CEILING_SYSTEM_SLUGS)[number];

export const systemSlugs: readonly string[] = CEILING_SYSTEM_SLUGS;

export function isCeilingSystemSlug(value: string): value is CeilingSystemSlug {
  return systemSlugs.includes(value);
}
