'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { company } from '@/lib/site';
import { trackCtaClick, trackContactClick } from '@/lib/analytics';

/**
 * Commercial routing section for the contact page — turns passive contact info
 * into clear, tracked conversion paths (project inquiry / urgent coordination /
 * documents) plus the "what happens next" expectation.
 */
export function ContactRouting() {
  const t = useTranslations('contactPage');
  const tc = useTranslations('cta');
  const steps = t.raw('afterSteps') as string[];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* For project inquiries */}
      <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-display text-h4 font-semibold text-white">{t('inquiriesTitle')}</h3>
        <p className="mt-3 flex-1 text-body-s text-ink-400">{t('inquiriesText')}</p>
        <div className="mt-5">
          <Button
            href="/rfq"
            variant="gold"
            onClick={() => trackCtaClick('contact_inquiries', 'request_analysis')}
          >
            {tc('requestAnalysis')}
          </Button>
        </div>
      </div>

      {/* For urgent coordination */}
      <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-display text-h4 font-semibold text-white">{t('urgentTitle')}</h3>
        <p className="mt-3 flex-1 text-body-s text-ink-400">{t('urgentText')}</p>
        <a
          href={company.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="nums mt-4 block text-body font-medium text-white hover:text-gold"
          onClick={() => trackContactClick('whatsapp', { cta_location: 'contact_urgent' })}
        >
          {company.mobileIntlDisplay}
        </a>
        <div className="mt-3">
          <Button
            href={company.whatsappUrl}
            external
            variant="outline"
            onClick={() => trackContactClick('whatsapp', { cta_location: 'contact_urgent_btn' })}
          >
            {t('urgentCta')}
          </Button>
        </div>
      </div>

      {/* For drawings and tender documents */}
      <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-display text-h4 font-semibold text-white">{t('drawingsTitle')}</h3>
        <p className="mt-3 flex-1 text-body-s text-ink-400">{t('drawingsText')}</p>
        <a
          href={`mailto:${company.email}`}
          className="mt-4 block text-body font-medium text-white hover:text-gold"
          onClick={() => trackContactClick('email', { cta_location: 'contact_drawings' })}
        >
          {company.email}
        </a>
        <div className="mt-3">
          <Button
            href={`mailto:${company.email}`}
            external
            variant="outline"
            onClick={() => trackContactClick('email', { cta_location: 'contact_drawings_btn' })}
          >
            {t('drawingsCta')}
          </Button>
        </div>
      </div>

      {/* What happens after you contact us? */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
        <h3 className="font-display text-h4 font-semibold text-white">{t('afterTitle')}</h3>
        <ol className="mt-5 space-y-4">
          {steps.map((stepText, i) => (
            <li key={stepText} className="flex items-start gap-3 text-body-s text-ink-300">
              <span className="nums flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 text-caption font-semibold text-gold">
                {i + 1}
              </span>
              {stepText}
            </li>
          ))}
        </ol>
      </div>

      {/* Response expectation */}
      <div className="flex flex-col justify-center rounded-lg border border-gold/30 bg-gold/[0.06] p-6">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-gold">
          {t('responseTitle')}
        </p>
        <p className="mt-3 text-body-l font-medium text-white">{t('responseText')}</p>
      </div>
    </div>
  );
}
