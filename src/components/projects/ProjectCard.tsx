import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export type ProjectCardData = {
  name: string;
  sector?: string | null;
  logo?: string;
  /** A real AvizSazeh project photo, if one genuinely exists in /public. */
  image?: string;
  badge: string;
  cardText?: string;
  /** Only set when the project has a real case-study page. */
  href?: string;
};

/**
 * Flagship project record card. Renders only known fields — never an empty
 * label or a fabricated placeholder. Links out only when a case study exists.
 */
export function ProjectCard({ name, sector, logo, image, badge, cardText, href }: ProjectCardData) {
  const inner = (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-colors duration-medium ease-aecs',
        href && 'hover:border-gold/40',
      )}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-white/10 bg-ink-900">
        {image ? (
          <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-grid-lines [background-size:32px_32px] opacity-30" />
            {logo ? (
              <div className="relative flex h-20 w-40 items-center justify-center rounded-sm bg-white/95 px-4">
                <Image
                  src={`/clients/${logo}`}
                  alt={name}
                  width={160}
                  height={80}
                  sizes="160px"
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ) : (
              <span className="relative px-6 text-center font-display text-h4 font-semibold text-white">
                {name}
              </span>
            )}
          </>
        )}
        <span className="absolute end-4 top-4 rounded-full border border-gold/40 bg-ink-950/80 px-3 py-1 text-micro font-semibold uppercase tracking-[0.1em] text-gold backdrop-blur-sm">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-h4 font-semibold text-white">{name}</h3>
        {sector ? (
          <p className="mt-2 text-caption uppercase tracking-[0.12em] text-gold/80">{sector}</p>
        ) : null}
        {cardText ? (
          <p className="mt-4 text-caption leading-relaxed text-ink-500">{cardText}</p>
        ) : null}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-gold">
        {inner}
      </Link>
    );
  }
  return inner;
}
