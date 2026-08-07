'use client';

import { trackContactClick } from '@/lib/analytics';

/**
 * A `mailto:` link that fires an `email_click` event on click. Lets server
 * components keep tracked email links without becoming client components.
 */
export function TrackedMailto({
  email,
  location,
  className,
  ariaLabel,
  children,
}: {
  /** Raw email address (without the mailto: scheme). */
  email: string;
  /** Where on the site the click happened (cta_location). */
  location: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackContactClick('email', { cta_location: location })}
    >
      {children}
    </a>
  );
}
