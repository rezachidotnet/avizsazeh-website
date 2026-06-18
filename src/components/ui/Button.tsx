import { forwardRef } from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-sm font-semibold uppercase leading-none tracking-[0.08em] transition-all duration-fast ease-aecs disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-gold';

const variants: Record<Variant, string> = {
  // Engineering layer — default system action (solid, high contrast)
  primary: 'bg-white text-ink-950 hover:bg-ink-300',
  // Authority accent — conversion / transformation actions
  gold: 'bg-gold text-ink-950 hover:bg-gold-400 hover:shadow-gold',
  // Gold hairline outline (header CTA, secondary conversions)
  outline: 'border border-gold/55 text-gold hover:border-gold hover:bg-gold/10',
  ghost: 'text-white hover:bg-white/[0.08]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.7rem]',
  md: 'h-11 px-5 text-[0.72rem]',
  lg: 'h-12 px-7 text-[0.8rem]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & {
  href: string;
  external?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, AsButton | AsLink>(
  function Button(props, ref) {
    const { variant = 'primary', size = 'md', className, children } = props;
    const classes = cn(base, variants[variant], sizes[size], className);

    if ('href' in props && props.href) {
      const { href, external } = props as AsLink;
      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as AsButton;
    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);
