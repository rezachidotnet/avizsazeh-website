import { cn } from '@/lib/utils';

type SectionProps = {
  id?: string;
  as?: 'section' | 'div' | 'header' | 'footer';
  className?: string;
  /** dark engineering surface */
  dark?: boolean;
  /** ivory architectural surface */
  ivory?: boolean;
  children: React.ReactNode;
};

/** Full-width section block on the 96–128px spatial rhythm. */
export function Section({
  id,
  as: Tag = 'section',
  className,
  dark,
  ivory,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'py-section lg:py-section-lg',
        dark && 'bg-ink-950 text-white',
        ivory && 'bg-ivory',
        className,
      )}
    >
      <div className="container-grid">{children}</div>
    </Tag>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  dark?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'start',
  dark,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-prose',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2
        className={cn(
          'mt-4 text-h2 font-semibold',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn('mt-4 text-body-l', dark ? 'text-ink-300' : 'text-ink-600')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
