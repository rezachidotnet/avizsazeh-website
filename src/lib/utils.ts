import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Editorial serif display heading class — Latin locales only.
 * Source Serif 4 has no Persian glyphs, so `fa` headings render in the
 * sans / Vazirmatn face and must NOT carry `font-display`.
 */
export function displayFont(locale: string): string {
  return locale === 'fa' ? '' : 'font-display';
}
