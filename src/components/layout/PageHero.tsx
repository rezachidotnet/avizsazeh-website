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
    <header className="border-b border-ink-200 bg-ivory">
      <div className="container-grid py-14 lg:py-20">
        {breadcrumbs ? (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl text-h1 font-bold text-ink">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-prose text-body-l text-ink-600">{intro}</p>
        ) : null}
      </div>
    </header>
  );
}
