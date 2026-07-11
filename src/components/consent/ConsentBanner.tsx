'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { updateConsent } from '@/lib/consent';
import { useConsentUi, useConsentSnapshot } from './ConsentProvider';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function ConsentBanner() {
  const t = useTranslations('consent');
  const snapshot = useConsentSnapshot();
  const { openPreferences } = useConsentUi();

  const visible = snapshot.status === 'unknown';
  const summary = useMemo(
    () =>
      snapshot.status === 'unknown'
        ? t('bannerTextUnknown')
        : t('bannerTextKnown'),
    [snapshot.status, t],
  );

  if (!visible) return null;

  return (
    <section
      aria-label={t('bannerTitle')}
      className="fixed inset-x-0 bottom-16 z-[70] border-t border-white/10 bg-ink-950/98 backdrop-blur-md lg:bottom-0"
    >
      <div className="container-grid py-4 sm:py-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-gold">
              {t('bannerTitle')}
            </p>
            <p className="mt-2 text-body-s leading-relaxed text-ink-300">{summary}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
            <Button
              type="button"
              variant="gold"
              size="sm"
              className={cn('w-full whitespace-normal text-center leading-tight')}
              onClick={() => updateConsent({ analytics: true, marketing: false })}
            >
              {t('acceptAnalytics')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn('w-full whitespace-normal text-center leading-tight')}
              onClick={() => updateConsent({ analytics: false, marketing: false })}
            >
              {t('rejectNonEssential')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn('w-full whitespace-normal text-center leading-tight border border-white/10')}
              onClick={openPreferences}
            >
              {t('managePreferences')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
