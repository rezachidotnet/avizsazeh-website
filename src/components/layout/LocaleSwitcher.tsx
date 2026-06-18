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
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-[0.78rem] font-medium tracking-wide text-ink-300 transition-colors duration-fast hover:text-white',
        className,
      )}
    >
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
