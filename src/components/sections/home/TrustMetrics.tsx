import { useTranslations } from 'next-intl';

type Metric = { value: string; label: string };

/** Engineering credibility bar — factual, system-based metrics. */
export function TrustMetrics() {
  const t = useTranslations('home.trust');
  const metrics = t.raw('metrics') as Metric[];

  return (
    <section aria-label={t('title')} className="border-y border-ink-200 bg-white">
      <div className="container-grid">
        <dl className="grid grid-cols-2 divide-ink-200 lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 px-2 py-8 text-center lg:px-8 lg:text-start"
            >
              <dt className="order-2 text-caption uppercase tracking-[0.12em] text-ink-500">
                {m.label}
              </dt>
              <dd className="order-1 text-h3 font-bold text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
