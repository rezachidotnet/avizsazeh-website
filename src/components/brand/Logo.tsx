import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Logo variants. Both share the same 692×273 artwork dimensions so the
 * rendered aspect ratio is identical regardless of which is used.
 *
 * - `transparent` — white-text mark on a fully transparent background.
 *   Sits cleanly on dark / gold / gradient / photo backgrounds with no
 *   visible plate or box. Default, since all current chrome is dark.
 * - `light` — the full-colour mark with dark text, for light/plain plates.
 */
const VARIANTS = {
  transparent: '/brand/standard-logo-trans.webp',
  light: '/brand/standard-logo.png',
} as const;

export type LogoVariant = keyof typeof VARIANTS;

/**
 * Brand lockup. Renders the AVIZSAZEH mark, wrapped in a home link.
 * `imgClassName` overrides the rendered height (header is scaled up 1.2x).
 */
export function Logo({
  className,
  imgClassName,
  priority = false,
  label = 'AvizSazeh logo',
  variant = 'transparent',
  /** retained for API compatibility */
  plate: _plate,
}: {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  plate?: boolean;
  label?: string;
  variant?: LogoVariant;
}) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src={VARIANTS[variant]}
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
