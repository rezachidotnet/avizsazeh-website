import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { SystemIcon } from '@/components/icons/SystemIcon';

/** Conversion trigger — engineering action, not a sales prompt. */
export function RfqCta() {
  const t = useTranslations('home.rfqCta');
  const tc = useTranslations('cta');

  return (
    <section className="bg-ink-950 text-white">
      <div className="container-grid py-20 lg:py-28">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-10 lg:p-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:32px_32px] opacity-50" />
          <div className="relative max-w-2xl">
            <SystemIcon name="execution" node className="h-9 w-9 text-gold-300" />
            <h2 className="mt-6 font-display text-h2 font-bold text-white">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-xl text-body-l text-ink-300">{t('description')}</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="/rfq" variant="gold" size="lg">
                {t('button')}
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                {tc('contactEngineering')}
              </Button>
            </div>
            <p className="mt-6 text-caption text-ink-500">{t('microcopy')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
