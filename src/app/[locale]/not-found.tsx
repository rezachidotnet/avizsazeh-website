import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';

export default function LocaleNotFound() {
  const t = useTranslations('nav');
  return (
    <div className="container-grid flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="font-display text-[5rem] font-bold leading-none text-gold">404</span>
      <p className="mt-4 max-w-md text-body-l text-ink-600">
        {t('home')} · {t('systems')} · {t('engineering')}
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">{t('home')}</Button>
        <Link
          href="/systems"
          className="inline-flex h-11 items-center rounded border border-ink-300 px-5 text-body-s font-medium text-ink hover:border-ink"
        >
          {t('systems')}
        </Link>
      </div>
    </div>
  );
}
