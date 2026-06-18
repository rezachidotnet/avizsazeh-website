import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Brand lockup — recreated as a crisp inline SVG so the approved AVIZSAZEH
 * mark reads white/gold on the dark surface (the raster `standard-logo.png`
 * is dark-on-transparent and built for light backgrounds). The mark itself
 * is unchanged: ascending engineering bars + wordmark + tagline.
 */
export function Logo({
  className,
  label = 'AvizSazeh',
  /** retained for API compatibility — no plate needed on dark */
  plate: _plate,
  priority: _priority,
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
      className={cn(
        'group inline-flex flex-col gap-1.5 leading-none',
        className,
      )}
    >
      <svg
        viewBox="0 0 60 28"
        className="h-5 w-auto md:h-[22px]"
        aria-hidden="true"
        fill="none"
      >
        <rect x="2" y="18" width="9" height="10" className="fill-white/55" />
        <rect x="15" y="12" width="9" height="16" className="fill-white" />
        <rect x="28" y="6" width="9" height="22" fill="#D8B86E" />
        <rect x="41" y="0" width="9" height="28" fill="#C8A24A" />
      </svg>
      <span className="font-latin text-[0.95rem] font-semibold tracking-[0.34em] text-white md:text-[1.05rem]">
        AVIZSAZEH
      </span>
      <span className="font-latin text-[0.5rem] uppercase tracking-[0.3em] text-gold/80 md:text-[0.55rem]">
        Engineering Architecture Into Reality
      </span>
    </Link>
  );
}

export default Logo;
