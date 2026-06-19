import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

type Row = { seller: string; contractor: string; aviz: string };

function Mark({ type }: { type: 'cross' | 'check' }) {
  return type === 'check' ? (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function Column({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: 'muted' | 'aviz';
}) {
  const aviz = variant === 'aviz';
  return (
    <div
      className={
        aviz
          ? 'relative rounded-lg border border-gold/30 bg-white/[0.04] p-7 shadow-gold lg:p-8'
          : 'rounded-lg border border-white/10 bg-white/[0.015] p-7 lg:p-8'
      }
    >
      {aviz ? (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      ) : null}
      <h3
        className={
          aviz
            ? 'font-display text-h4 font-semibold text-gold'
            : 'text-body-l font-semibold text-ink-400'
        }
      >
        {title}
      </h3>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className={
              aviz
                ? 'flex gap-3 text-body-s text-white'
                : 'flex gap-3 text-body-s text-ink-500'
            }
          >
            <Mark type={aviz ? 'check' : 'cross'} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Three-way differentiation: material seller vs generic contractor vs AvizSazeh. */
export function DifferentiationTable() {
  const t = useTranslations('home.differentiation');
  const tc = useTranslations('cta');
  const rows = t.raw('rows') as Row[];

  return (
    <section className="bg-ink-950 py-section lg:py-section-lg">
      <div className="container-grid">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow-center">{t('eyebrow')}</span>
          <h2 className="mt-5 font-display text-h2 font-semibold text-white">{t('title')}</h2>
          <p className="mt-4 text-body-l text-ink-300">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Column title={t('sellerTitle')} items={rows.map((r) => r.seller)} variant="muted" />
          <Column title={t('contractorTitle')} items={rows.map((r) => r.contractor)} variant="muted" />
          <Column title={t('avizTitle')} items={rows.map((r) => r.aviz)} variant="aviz" />
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center font-display text-h4 font-medium leading-snug text-white">
          {t('closing')}
        </p>

        <div className="mt-10 flex justify-center">
          <Button href="/engineering" variant="outline" size="lg">
            {tc('compareApproach')}
          </Button>
        </div>
      </div>
    </section>
  );
}
