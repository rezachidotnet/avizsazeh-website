'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const labels: Record<Locale, string> = { fa: 'فا', en: 'EN' };

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className={cn('inline-flex items-center rounded border border-ink-200', className)}
      role="group"
      aria-label="Language"
    >
      {(['fa', 'en'] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={cn(
            'px-3 py-1.5 text-caption font-medium transition-colors duration-fast first:rounded-s last:rounded-e',
            l === locale ? 'bg-ink text-white' : 'text-ink-500 hover:text-ink',
          )}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
