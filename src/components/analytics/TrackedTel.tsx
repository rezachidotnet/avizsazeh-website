'use client';

import { trackContactClick } from '@/lib/analytics';

/**
 * A `tel:` link that fires a `phone_click` event on click. Lets server
 * components (Footer, contact page) keep tracked phone numbers without becoming
 * client components themselves. Safe no-op when no analytics provider is set.
 */
export function TrackedTel({
  phone,
  location,
  className,
  ariaLabel,
  children,
}: {
  /** Raw phone number (without the tel: scheme). */
  phone: string;
  /** Where on the site the click happened (cta_location). */
  location: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`tel:${phone}`}
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackContactClick('phone', { cta_location: location })}
    >
      {children}
    </a>
  );
}
