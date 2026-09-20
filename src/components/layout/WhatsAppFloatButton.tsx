'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { company } from '@/lib/site';
import { trackContactClick } from '@/lib/analytics';

/**
 * Sticky WhatsApp button pinned to the page edge on every route. Sits above
 * MobileActionBar's height on small screens so the two never overlap.
 */
export function WhatsAppFloatButton() {
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  if (pathname === '/rfq' || pathname.startsWith('/rfq/')) return null;

  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tCommon('whatsapp')}
      className="fixed bottom-20 end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-fast hover:scale-105 lg:bottom-8 lg:end-8"
      onClick={() => trackContactClick('whatsapp', { cta_location: 'sticky_button' })}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.5.3.1.3.1.6-.1 1.1Z" />
      </svg>
    </a>
  );
}
