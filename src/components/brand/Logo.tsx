import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Brand lockup — the approved AVIZSAZEH mark on its dark plate
 * (`standard-logo-black`), used unmodified on the dark chrome.
 * `imgClassName` overrides the rendered height (header is scaled up 1.2x).
 */
export function Logo({
  className,
  imgClassName,
  priority = false,
  label = 'AvizSazeh',
  /** retained for API compatibility */
  plate: _plate,
}: {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  plate?: boolean;
  label?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/brand/standard-logo-black.webp"
        alt={label}
        width={692}
        height={273}
        priority={priority}
        sizes="200px"
        className={cn('h-12 w-auto md:h-14', imgClassName)}
      />
    </Link>
  );
}

export default Logo;
