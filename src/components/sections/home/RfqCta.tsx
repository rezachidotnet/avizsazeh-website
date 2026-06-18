import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { cn, displayFont } from '@/lib/utils';

/** Conversion trigger — engineering action, not a sales prompt. */
export function RfqCta() {
  const t = useTranslations('home.rfqCta');
  const display = displayFont(useLocale());

  return (
    <section className="bg-ink-950 text-white">
      <div className="container-grid py-20 lg:py-28">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-10 lg:p-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:32px_32px] opacity-50" />
          <div className="relative max-w-2xl">
            <SystemIcon name="execution" node className="h-9 w-9 text-gold-300" />
            <h2 className={cn(display, 'mt-6 text-h2 font-bold text-white')}>
              {t('title')}
            </h2>
            <p className="mt-4 max-w-xl text-body-l text-ink-300">{t('description')}</p>
            <div className="mt-9">
              <Button href="/rfq" variant="gold" size="lg">
                {t('button')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
