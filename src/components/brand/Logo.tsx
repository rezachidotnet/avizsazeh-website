import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Brand logo — the single approved asset `standard-logo`.
 * Used unmodified everywhere (header, footer, OG). No alternative logos,
 * no recolouring, no distortion. On dark surfaces it is placed on a light
 * plate (a container choice — the logo itself is never altered).
 */
export function Logo({
  className,
  priority = false,
  plate = false,
  label = 'AvizSazeh',
}: {
  className?: string;
  priority?: boolean;
  /** render on a light plate for dark surfaces */
  plate?: boolean;
  label?: string;
}) {
  const img = (
    <Image
      src="/brand/standard-logo.png"
      alt={label}
      width={1386}
      height={682}
      priority={priority}
      sizes="180px"
      className="h-9 w-auto md:h-10"
    />
  );

  return (
    <Link
      href="/"
      aria-label={label}
      className={cn('inline-flex items-center', plate && 'rounded bg-white px-3 py-2', className)}
    >
      {img}
    </Link>
  );
}

export default Logo;
