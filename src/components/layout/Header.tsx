'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV = [
  { key: 'home', href: '/' },
  { key: 'systems', href: '/systems' },
  { key: 'engineering', href: '/engineering' },
  { key: 'projects', href: '/projects' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const tc = useTranslations('cta');
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
          ? 'border-white/10 bg-ink-950/90 backdrop-blur-md'
          : 'border-white/[0.06] bg-ink-950',
      )}
    >
      <div className="container-grid flex h-20 items-center justify-between gap-6 md:h-24">
        <Logo priority />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'relative py-1 text-[0.82rem] font-medium tracking-wide transition-colors duration-fast hover:text-white',
                isActive(item.href) ? 'text-white' : 'text-ink-400',
              )}
            >
              {t(item.key)}
              {isActive(item.href) ? (
                <span className="absolute -bottom-1 start-0 h-px w-full bg-gold" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher className="hidden sm:inline-flex" />
          <span className="hidden h-6 w-px bg-white/10 lg:block" />
          <Button
            href="/rfq"
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            {tc('requestAnalysis')}
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-white lg:hidden"
            aria-expanded={open}
            aria-label={open ? t('close') : t('menu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={cn(
                  'absolute inset-x-0 top-0 h-0.5 bg-white transition-transform duration-fast',
                  open && 'top-1.5 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 top-1.5 h-0.5 bg-white transition-opacity duration-fast',
                  open && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 top-3 h-0.5 bg-white transition-transform duration-fast',
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
          'overflow-hidden border-t border-white/10 bg-ink-950 lg:hidden',
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
                'rounded-sm px-3 py-3 text-body font-medium',
                isActive(item.href)
                  ? 'bg-white/[0.05] text-white'
                  : 'text-ink-400',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3">
            <LocaleSwitcher />
            <Button href="/rfq" variant="gold" size="sm" className="flex-1">
              {tc('requestAnalysis')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
