'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { company } from '@/lib/site';
import { trackCtaClick, trackContactClick } from '@/lib/analytics';

/**
 * Mobile-only sticky conversion bar. Hidden on lg+ and on the RFQ route so it
 * never blocks form completion. Tap targets are 48px high.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const tc = useTranslations('cta');
  const tCommon = useTranslations('common');

  // Don't interfere with the RFQ wizard itself.
  if (pathname === '/rfq' || pathname.startsWith('/rfq/')) return null;

  const whatsapp = company.whatsappUrl;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-2 gap-2 p-2">
        <Link
          href="/rfq"
          className="flex h-12 items-center justify-center gap-2 rounded-sm bg-gold px-4 text-label-lg font-semibold uppercase tracking-[0.06em] text-ink-950"
          onClick={() => trackCtaClick('mobile_action_bar', 'request_analysis')}
        >
          {tc('requestAnalysisShort')}
        </Link>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-sm border border-white/20 px-4 text-label-lg font-semibold uppercase tracking-[0.06em] text-white"
          onClick={() => trackContactClick('whatsapp', { cta_location: 'mobile_action_bar' })}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.5.3.1.3.1.6-.1 1.1Z" />
          </svg>
          {tCommon('whatsapp')}
        </a>
      </div>
    </div>
  );
}
