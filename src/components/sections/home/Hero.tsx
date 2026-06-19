import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

/** Home hero — brand-positioning statement over full-bleed engineering imagery. */
export function Hero() {
  const t = useTranslations('home.hero');
  const tc = useTranslations('cta');

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* background imagery — design-system hero (rendered crisp, no blur) */}
      <Image
        src="/design-system/hero-home.png"
        alt={t('imageAlt')}
        fill
        priority
        quality={95}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* legibility scrims — directional only, so the ceiling stays clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container-grid relative grid min-h-[620px] items-center gap-12 py-24 lg:min-h-[760px] lg:grid-cols-12 lg:py-28">
        {/* left — system thesis */}
        <div className="lg:col-span-7 lg:self-end lg:pb-6">
          <span className="eyebrow text-gold">{t('eyebrow')}</span>
          <h1 className="mt-6 max-w-3xl font-display text-h1 font-semibold leading-[1.08] text-white">
            {t('headline')}
          </h1>
          <p className="mt-6 max-w-2xl text-body-l leading-relaxed text-ink-300">
            {t('subheadline')}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/rfq" variant="gold" size="lg">
              {tc('requestAnalysis')}
            </Button>
            <Button href="/engineering" variant="outline" size="lg">
              {tc('viewEngineeringLogic')}
            </Button>
          </div>
        </div>

        {/* right — AECS definition card */}
        <aside className="lg:col-span-5 lg:self-center lg:ps-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md lg:p-10">
            <p className="font-display text-[2.75rem] font-semibold leading-none tracking-tight text-white">
              AECS
            </p>
            <span className="mt-6 block h-px w-12 bg-gold" />
            <h2 className="mt-6 font-display text-h3 font-medium leading-snug text-white">
              {t('cardTitle')}
            </h2>
            <p className="mt-4 text-body-s leading-relaxed text-ink-400">
              {t('cardText')}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
