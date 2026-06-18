import { forwardRef } from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded font-medium leading-none transition-all duration-fast ease-aecs disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-gold';

const variants: Record<Variant, string> = {
  // Engineering layer — default system action
  primary: 'bg-ink text-white hover:bg-ink-700 hover:shadow-md',
  // Authority accent — reserved for conversion / transformation actions only
  gold: 'bg-gold text-ink hover:bg-gold-600 hover:shadow-md',
  outline: 'border border-ink-300 text-ink hover:border-ink hover:bg-ink/[0.03]',
  ghost: 'text-ink hover:bg-ink/[0.05]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-body-s',
  md: 'h-11 px-5 text-body-s',
  lg: 'h-12 px-7 text-body',
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
