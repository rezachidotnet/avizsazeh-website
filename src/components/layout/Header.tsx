'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Button } from '@/components/ui/Button';
import { systems } from '@/lib/content/systems';
import { localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
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
  const locale = useLocale() as Locale;
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

  const navLinkClass = (href: string) =>
    cn(
      'relative py-1 text-label-lg font-medium tracking-wide transition-colors duration-fast hover:text-gold',
      isActive(href) ? 'text-white' : 'text-ink-400',
    );

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
        <Logo imgClassName="h-[3.6rem] md:h-[4.2rem]" />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.key === 'systems' ? (
              <div key={item.key} className="group relative">
                <Link href={item.href} className={cn(navLinkClass(item.href), 'inline-flex items-center gap-1')}>
                  {t(item.key)}
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink-500" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isActive(item.href) ? (
                    <span className="absolute -bottom-1 start-0 h-px w-full bg-gold" />
                  ) : null}
                </Link>
                {/* desktop systems dropdown — revealed on hover / keyboard focus */}
                <div className="invisible absolute start-0 top-full z-50 w-64 translate-y-1 pt-3 opacity-0 transition-all duration-fast group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ul className="overflow-hidden rounded-lg border border-white/10 bg-ink-900 p-2 shadow-lg">
                    {systems.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/systems/${s.slug}`}
                          className="block rounded-sm px-3 py-2.5 text-body-s text-ink-300 transition-colors duration-fast hover:bg-white/[0.05] hover:text-white"
                        >
                          {localized(s.name, locale)}
                        </Link>
                      </li>
                    ))}
                    <li className="mt-1 border-t border-white/10 pt-1">
                      <Link
                        href="/systems"
                        className="block rounded-sm px-3 py-2.5 text-body-s font-medium text-gold transition-colors duration-fast hover:bg-white/[0.05]"
                      >
                        {tc('exploreAllSystems')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={item.key} href={item.href} className={navLinkClass(item.href)}>
                {t(item.key)}
                {isActive(item.href) ? (
                  <span className="absolute -bottom-1 start-0 h-px w-full bg-gold" />
                ) : null}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher className="hidden sm:inline-flex" />
          <span className="hidden h-6 w-px bg-white/10 lg:block" />
          <Button href="/rfq" variant="gold" size="sm" className="hidden md:inline-flex">
            {tc('requestAnalysis')}
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('close') : t('menu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span className={cn('absolute inset-x-0 top-0 h-0.5 bg-white transition-transform duration-fast', open && 'top-1.5 rotate-45')} />
              <span className={cn('absolute inset-x-0 top-1.5 h-0.5 bg-white transition-opacity duration-fast', open && 'opacity-0')} />
              <span className={cn('absolute inset-x-0 top-3 h-0.5 bg-white transition-transform duration-fast', open && 'top-1.5 -rotate-45')} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        aria-hidden={!open}
        className={cn(
          'overflow-hidden border-white/10 bg-ink-950 lg:hidden',
          open ? 'max-h-screen border-t' : 'max-h-0',
          'transition-[max-height] duration-medium ease-aecs',
        )}
      >
        <nav className="container-grid flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              tabIndex={open ? undefined : -1}
              className={cn(
                'rounded-sm px-3 py-3 text-body font-medium',
                isActive(item.href) ? 'bg-white/[0.05] text-white' : 'text-ink-400',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3">
            <LocaleSwitcher />
            <Button href="/rfq" variant="gold" size="sm" className="flex-1" >
              {tc('requestAnalysis')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
