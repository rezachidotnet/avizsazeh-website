import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

/** Inner-page header band — consistent altitude for all sub-pages. */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  breadcrumbs?: { name: string; path: string; current?: boolean }[];
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-ivory">
      <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:48px_48px] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="container-grid relative py-16 lg:py-24">
        {breadcrumbs ? (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl font-display text-h1 font-semibold text-white">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-prose text-body-l text-ink-300">{intro}</p>
        ) : null}
      </div>
    </header>
  );
}
