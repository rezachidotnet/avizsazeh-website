import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';

const FLOW_ICONS: IconKey[] = ['architecture', 'engineering', 'system', 'execution'];

/** Hero — system entry point. Structural geometry only, no lifestyle imagery. */
export function Hero() {
  const t = useTranslations('home.hero');
  const tc = useTranslations('cta');
  const flow = t.raw('flow') as string[];

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* structural grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:40px_40px] opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="container-grid relative py-24 lg:py-36">
        <div className="max-w-3xl">
          <span className="eyebrow text-ink-300">{t('eyebrow')}</span>
          <h1 className="mt-6 font-display text-h1 font-bold leading-[1.05] text-white">
            {t('headline')}
          </h1>
          <p className="mt-6 text-body-l text-gold-300">{t('subheadline')}</p>
          <p className="mt-5 max-w-xl text-body-l text-ink-300">{t('description')}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/rfq" variant="gold" size="lg">
              {tc('requestAnalysis')}
            </Button>
            <Button
              href="/systems"
              size="lg"
              className="border border-white/25 bg-transparent text-white hover:bg-white/10"
            >
              {tc('exploreSystems')}
            </Button>
          </div>
        </div>

        {/* engineering flow rail */}
        <ol className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] sm:grid-cols-4">
          {flow.map((label, i) => (
            <li
              key={label}
              className="relative flex items-center gap-3 bg-ink-950/40 px-5 py-5"
            >
              <SystemIcon
                name={FLOW_ICONS[i]}
                node={i === flow.length - 1}
                className="h-6 w-6 shrink-0 text-ink-300"
              />
              <span className="flex flex-col">
                <span className="font-latin text-caption tabular-nums text-ink-500">
                  0{i + 1}
                </span>
                <span className="text-body-s font-medium text-white">{label}</span>
              </span>
              {i < flow.length - 1 ? (
                <span className="absolute end-0 top-1/2 hidden h-4 w-px -translate-y-1/2 bg-white/15 sm:block" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
