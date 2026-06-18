import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Brand lockup — the approved AVIZSAZEH mark on its dark plate
 * (`standard-logo-blackbackground.png`), used unmodified on the dark chrome.
 */
export function Logo({
  className,
  priority = false,
  label = 'AvizSazeh',
  /** retained for API compatibility */
  plate: _plate,
}: {
  className?: string;
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
        src="/brand/standard-logo-blackbackground.png"
        alt={label}
        width={693}
        height={275}
        priority={priority}
        sizes="160px"
        className="h-12 w-auto md:h-14"
      />
    </Link>
  );
}

export default Logo;
