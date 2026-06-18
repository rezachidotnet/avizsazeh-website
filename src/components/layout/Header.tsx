'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV = [
  { key: 'systems', href: '/systems' },
  { key: 'engineering', href: '/engineering' },
  { key: 'projects', href: '/projects' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-medium',
        scrolled || open
          ? 'border-ink-200 bg-surface/90 backdrop-blur-md'
          : 'border-transparent bg-surface',
      )}
    >
      <div className="container-grid flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo priority />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'relative text-body-s font-medium transition-colors duration-fast hover:text-ink',
                isActive(item.href) ? 'text-ink' : 'text-ink-500',
              )}
            >
              {t(item.key)}
              {isActive(item.href) ? (
                <span className="absolute -bottom-1.5 start-0 h-px w-full bg-gold" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:inline-flex" />
          <Button href="/rfq" variant="gold" size="sm" className="hidden md:inline-flex">
            {t('rfq')}
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-ink-200 lg:hidden"
            aria-expanded={open}
            aria-label={open ? t('close') : t('menu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={cn(
                  'absolute inset-x-0 top-0 h-0.5 bg-ink transition-transform duration-fast',
                  open && 'top-1.5 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 top-1.5 h-0.5 bg-ink transition-opacity duration-fast',
                  open && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 top-3 h-0.5 bg-ink transition-transform duration-fast',
                  open && 'top-1.5 -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          'overflow-hidden border-t border-ink-200 bg-surface lg:hidden',
          open ? 'max-h-screen' : 'max-h-0 border-t-0',
          'transition-[max-height] duration-medium ease-aecs',
        )}
      >
        <nav className="container-grid flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'rounded px-3 py-3 text-body font-medium',
                isActive(item.href) ? 'bg-ink/[0.04] text-ink' : 'text-ink-600',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3">
            <LocaleSwitcher />
            <Button href="/rfq" variant="gold" size="sm" className="flex-1">
              {t('rfq')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
