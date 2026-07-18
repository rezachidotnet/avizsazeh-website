'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { updateConsent } from '@/lib/consent';
import { useConsentSnapshot, useConsentUi } from './ConsentProvider';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

function focusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(','),
    ),
  ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

export function ConsentPreferences() {
  const t = useTranslations('consent');
  const { isPreferencesOpen, closePreferences } = useConsentUi();
  const snapshot = useConsentSnapshot();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [analytics, setAnalytics] = useState(snapshot.analyticsGranted);
  const [marketing, setMarketing] = useState(snapshot.marketingGranted);

  useEffect(() => {
    if (!isPreferencesOpen) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setAnalytics(snapshot.analyticsGranted);
    setMarketing(snapshot.marketingGranted);
    const items = focusableElements(dialogRef.current);
    items[0]?.focus();
  }, [isPreferencesOpen, snapshot.analyticsGranted, snapshot.marketingGranted]);

  useEffect(() => {
    if (!isPreferencesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePreferences();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusableElements(dialogRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closePreferences, isPreferencesOpen]);

  useEffect(() => {
    if (isPreferencesOpen) return;
    previouslyFocusedRef.current?.focus?.();
  }, [isPreferencesOpen]);

  const open = isPreferencesOpen;
  const statusLabel = useMemo(
    () => (snapshot.status === 'unknown' ? t('statusUnknown') : t(`status.${snapshot.status}`)),
    [snapshot.status, t],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/70 p-3 sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-preferences-title"
        aria-describedby="consent-preferences-description"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-sm border border-white/10 bg-ink-950 shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="shrink-0 border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-caption font-semibold uppercase tracking-[0.16em] text-gold">
                {t('preferencesEyebrow')}
              </p>
              <h2 id="consent-preferences-title" className="mt-2 text-h4 font-semibold text-white">
                {t('preferencesTitle')}
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/10 text-white transition-colors hover:bg-white/[0.06]"
              aria-label={t('close')}
              onClick={closePreferences}
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                ×
              </span>
            </button>
          </div>
          <p id="consent-preferences-description" className="mt-3 max-w-prose text-body-s leading-relaxed text-ink-300">
            {t('preferencesDescription')}
          </p>
          <p className="mt-3 text-caption text-ink-500">{statusLabel}</p>
        </div>

        <div className="grid overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-5">
            <label className="flex items-start gap-4 rounded-sm border border-white/10 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-gold accent-gold"
              />
              <span className="flex flex-col">
                <span className="font-medium text-white">{t('necessaryLabel')}</span>
                <span className="mt-1 text-body-s text-ink-400">{t('necessaryDescription')}</span>
              </span>
            </label>

            <label className="flex items-start gap-4 rounded-sm border border-white/10 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-gold accent-gold"
              />
              <span className="flex flex-col">
                <span className="font-medium text-white">{t('analyticsLabel')}</span>
                <span className="mt-1 text-body-s text-ink-400">{t('analyticsDescription')}</span>
              </span>
            </label>

            <label className="flex items-start gap-4 rounded-sm border border-white/10 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-gold accent-gold"
              />
              <span className="flex flex-col">
                <span className="font-medium text-white">{t('marketingLabel')}</span>
                <span className="mt-1 text-body-s text-ink-400">{t('marketingDescription')}</span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              updateConsent({ analytics: false, marketing: false });
              closePreferences();
            }}
          >
            {t('rejectNonEssential')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              updateConsent({ analytics: true, marketing: false });
              closePreferences();
            }}
          >
            {t('acceptAnalytics')}
          </Button>
          <Button
            type="button"
            variant="gold"
            size="sm"
            className={cn('w-full sm:w-auto')}
            onClick={() => {
              updateConsent({ analytics, marketing });
              closePreferences();
            }}
          >
            {t('savePreferences')}
          </Button>
        </div>
      </div>
    </div>
  );
}
