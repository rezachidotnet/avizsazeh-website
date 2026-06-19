import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/brand/Logo';
import { systems } from '@/lib/content/systems';
import { company, localized, SITE_URL } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

/** Gold directional arrow used on every footer link. */
function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-gold/70 transition-transform duration-fast group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  'aria-hidden': true,
  className: 'mt-0.5 h-4 w-4 shrink-0 text-gold',
} as const;

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-body-s text-ink-400 transition-colors duration-fast hover:text-white"
      >
        <span>{children}</span>
        <Arrow />
      </Link>
    </li>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-gold">
      {children}
    </h2>
  );
}

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('footer');
  const tc = await getTranslations('cta');
  const tNav = await getTranslations('nav');
  const host = SITE_URL.replace(/^https?:\/\//, '');

  // Real, distinct destinations only — no same-page sub-navigation.
  const navLinks = [
    { label: tNav('engineering'), href: '/engineering' },
    { label: t('bim'), href: '/bim' },
    { label: tNav('projects'), href: '/projects' },
    { label: tNav('about'), href: '/about' },
    { label: tNav('contact'), href: '/contact' },
  ];

  return (
    <footer className="border-t border-white/10 bg-ink-950 text-ink-400">
      {/* primary grid */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:48px_48px] opacity-[0.35]" />
        <div className="container-grid relative grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
          {/* brand */}
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-6 max-w-xs text-body-s leading-relaxed text-ink-400">
              {t('tagline')}
            </p>
            <p className="mt-4 text-caption text-ink-500">{t('parentNote')}</p>
          </div>

          {/* link columns — real destinations only */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-9">
            <nav aria-label={t('systemsTitle')}>
              <ColumnTitle>{t('systemsTitle')}</ColumnTitle>
              <ul className="mt-5 space-y-3">
                {systems.map((s) => (
                  <FooterLink key={s.slug} href={`/systems/${s.slug}`}>
                    {localized(s.name, locale)}
                  </FooterLink>
                ))}
                <FooterLink href="/systems/compare">{t('compareSystems')}</FooterLink>
                <FooterLink href="/systems">{t('allSystems')}</FooterLink>
              </ul>
            </nav>

            <nav aria-label={t('navTitle')}>
              <ColumnTitle>{t('navTitle')}</ColumnTitle>
              <ul className="mt-5 space-y-3">
                {navLinks.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ul>
            </nav>

            <div>
              <ColumnTitle>{t('contactTitle')}</ColumnTitle>
              <ul className="mt-5 space-y-4 text-body-s text-ink-400">
                <li className="flex gap-3">
                  <svg {...iconProps}>
                    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span>
                    {localized(company.city, locale)} · {localized(company.address, locale)}
                  </span>
                </li>
                {/* Primary phone = complete mobile number. TODO(client): confirm the full
                    landline (031-35134 appears to be a shortened/extension number) before
                    promoting it as a primary contact. */}
                <li>
                  <a
                    href={`tel:${company.mobile}`}
                    className="flex gap-3 transition-colors hover:text-white"
                  >
                    <svg {...iconProps}>
                      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
                    </svg>
                    <span className="nums">{company.mobileDisplay}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex gap-3 transition-colors hover:text-white"
                  >
                    <svg {...iconProps}>
                      <path d="M3 6h18v12H3zM3 7l9 6 9-6" strokeLinejoin="round" />
                    </svg>
                    <span>{company.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 transition-colors hover:text-white"
                  >
                    <svg {...iconProps}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21M12 3C9.5 5.4 8.2 8.6 8.2 12S9.5 18.6 12 21" />
                    </svg>
                    <span>{host}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* utility band */}
      <div className="border-y border-white/10 bg-white/[0.015]">
        <div className="container-grid flex flex-col items-center justify-between gap-5 py-5 text-center lg:flex-row lg:text-start">
          <div className="flex items-center gap-4">
            <span className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-500">
              {t('followUs')}
            </span>
            <a
              href={company.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-ink-400 transition-colors hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
              </svg>
            </a>
            <a
              href={`mailto:${company.email}`}
              aria-label="Email"
              className="text-ink-400 transition-colors hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path d="M3 6h18v12H3zM3 7l9 6 9-6" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={`tel:${company.mobile}`}
              aria-label="Phone"
              className="text-ink-400 transition-colors hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-ink-300">
            <span className="text-gold">◆</span>
            {t('motto')}
            <span className="text-gold">◆</span>
          </p>

          <Link
            href="/rfq"
            className="group inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold-300"
          >
            {tc('requestAnalysis')}
            <Arrow />
          </Link>
        </div>
      </div>

      {/* bottom bar */}
      <div className="container-grid flex flex-col items-center justify-between gap-3 py-6 text-caption text-ink-500 sm:flex-row">
        <p>
          © <span className="nums">2026</span> {t('rights')}
        </p>
        <div className="flex items-center gap-6">
          <Link href="/contact" className="transition-colors hover:text-white">
            {t('privacy')}
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            {t('terms')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
