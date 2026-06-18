import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/brand/Logo';
import { systems } from '@/lib/content/systems';
import { company, localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

const companyLinks = [
  { key: 'engineering', href: '/engineering' },
  { key: 'projects', href: '/projects' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-grid py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo variant="dark" />
            <p className="mt-5 max-w-xs text-body-s text-ink-400">
              {t('footer.tagline')}
            </p>
            <p className="mt-4 text-caption text-ink-500">{t('footer.parentNote')}</p>
          </div>

          <nav className="md:col-span-3" aria-label={t('footer.systemsTitle')}>
            <h2 className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-500">
              {t('footer.systemsTitle')}
            </h2>
            <ul className="mt-4 space-y-3">
              {systems.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/systems/${s.slug}`}
                    className="text-body-s text-ink-300 transition-colors duration-fast hover:text-white"
                  >
                    {localized(s.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label={t('footer.companyTitle')}>
            <h2 className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-500">
              {t('footer.companyTitle')}
            </h2>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    className="text-body-s text-ink-300 transition-colors duration-fast hover:text-white"
                  >
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-500">
              {t('footer.contactTitle')}
            </h2>
            <ul className="mt-4 space-y-3 text-body-s">
              <li>
                <a href={`tel:${company.phoneConsult}`} className="hover:text-white">
                  <span className="nums">{company.phoneConsultDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${company.mobile}`} className="hover:text-white">
                  <span className="nums">{company.mobileDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-white">
                  {company.email}
                </a>
              </li>
              <li className="text-ink-400">{localized(company.address, locale)}</li>
              <li>
                <a
                  href={company.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  @{company.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ink-800 pt-6 text-caption text-ink-500 sm:flex-row sm:items-center">
          <p>
            © <span className="nums">{company.founded}</span>–
            <span className="nums">2026</span> · {t('footer.rights')}
          </p>
          <p className="font-latin tracking-wide text-ink-600">
            Engineering Architecture Into Reality
          </p>
        </div>
      </div>
    </footer>
  );
}
