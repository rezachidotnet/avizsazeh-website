import { useTranslations } from 'next-intl';

type Metric = { value: string; label: string };

/** Gold monoline credibility icons, indexed to the four trust metrics. */
const ICONS = [
  // Executed projects — building
  <path
    key="b"
    d="M4 21V7l6-3v17M10 21V9l8-2v14M3 21h18M7 8v0M7 11v0M7 14v0M13 12v0M13 15v0M13 18v0"
    strokeLinecap="round"
  />,
  // Specialized experience — laurel
  <path
    key="l"
    d="M12 21V7M12 21c-3 0-5-2-5-5M12 16c-2.5 0-4-1.5-4-4M12 12c-2 0-3-1.2-3-3M12 21c3 0 5-2 5-5M12 16c2.5 0 4-1.5 4-4M12 12c2 0 3-1.2 3-3M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
  // Installation height — bracketed vertical span
  <path
    key="h"
    d="M5 4h3M5 20h3M16 4h3M16 20h3M5 4v16M19 4v16M12 7v10M12 7l-2 2.5M12 7l2 2.5M12 17l-2-2.5M12 17l2-2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
  // Regional markets — globe
  <path
    key="g"
    d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21M12 3C9.5 5.4 8.2 8.6 8.2 12S9.5 18.6 12 21"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
];

/** Engineering credibility bar — factual, system-based metrics (trust-bar reference). */
export function TrustMetrics() {
  const t = useTranslations('home.trust');
  const metrics = t.raw('metrics') as Metric[];

  return (
    <section aria-label={t('title')} className="bg-ink-950">
      <div className="container-grid py-16 lg:py-20">
        <dl className="flex flex-col divide-y divide-white/[0.07] rounded-xl border border-white/10 bg-white/[0.02] lg:flex-row lg:divide-x lg:divide-y-0 lg:divide-gold/20 rtl:lg:divide-x-reverse">
          {metrics.map((m, i) => (
            // A <dl> wrapper <div> may only contain a <dt>/<dd> pair, so the
            // decorative icon lives inside the <dd> (absolutely positioned to
            // keep the original icon-left, value-over-label layout exactly).
            <div
              key={i}
              className="relative flex flex-1 flex-col gap-1 py-7 pe-7 ps-[5.25rem] lg:pe-8 lg:ps-[5.5rem]"
            >
              <dd className="font-display text-[1.4rem] font-bold leading-none text-gold">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  aria-hidden="true"
                  className="absolute inset-y-0 my-auto h-9 w-9 text-gold start-7 lg:start-8"
                >
                  {ICONS[i]}
                </svg>
                {m.value}
              </dd>
              <dt className="text-caption uppercase tracking-[0.12em] text-ink-400">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
