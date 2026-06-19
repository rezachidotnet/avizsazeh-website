'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const labels: Record<Locale, string> = { fa: 'FA', en: 'EN' };

/** Compact locale control — shows the active locale; toggles to the other. */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const next: Locale = locale === 'en' ? 'fa' : 'en';

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch language to ${labels[next]}`}
      className={cn(
        'inline-flex h-11 items-center gap-1.5 rounded-sm px-2 text-label-lg font-medium tracking-wide text-ink-300 transition-colors duration-fast hover:text-white',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-ink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.4 2.4 3.6 5.6 3.6 9S14.4 18.6 12 21M12 3C9.6 5.4 8.4 8.6 8.4 12S9.6 18.6 12 21" />
      </svg>
      {labels[locale]}
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3 text-ink-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
