import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

/** Explains the RFQ as a project-definition start point, with a 3-step flow. */
export function RFQExplainer() {
  const t = useTranslations('home.rfqExplainer');
  const tc = useTranslations('cta');
  const steps = t.raw('steps') as string[];

  return (
    <section className="bg-ink-950 py-section lg:py-section-lg">
      <div className="container-grid">
        <div className="max-w-3xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="mt-4 font-display text-h2 font-semibold text-white">{t('title')}</h2>
          <p className="mt-5 text-body-l leading-relaxed text-ink-300">{t('text')}</p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="flex h-full items-start gap-4 bg-ink-900 p-7">
              <span className="font-display text-h3 font-bold tabular-nums text-gold/80">
                0{i + 1}
              </span>
              <p className="pt-1 text-body-s leading-relaxed text-ink-300">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button href="/rfq" variant="gold" size="lg">
            {tc('startRequest')}
          </Button>
        </div>
      </div>
    </section>
  );
}
