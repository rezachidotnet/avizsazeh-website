import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Official AECS logo asset. Used unmodified per logo-governance rules
 * (no distortion, recolouring, or reconstruction). Light asset on light
 * surfaces, dark asset on engineering-charcoal surfaces.
 */
export function Logo({
  variant = 'light',
  className,
  priority = false,
  label = 'AvizSazeh',
}: {
  variant?: 'light' | 'dark';
  className?: string;
  priority?: boolean;
  label?: string;
}) {
  const src = variant === 'dark' ? '/logo-on-dark.png' : '/logo.png';
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src={src}
        alt={label}
        width={1386}
        height={682}
        priority={priority}
        sizes="180px"
        className="h-9 w-auto md:h-10"
      />
    </Link>
  );
}
