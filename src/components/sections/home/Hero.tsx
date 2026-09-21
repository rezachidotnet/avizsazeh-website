import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';

const CATEGORY_SLUGS = ['linear-ceiling', 'open-cell', 'metal-tile', 'baffle'] as const;

/** Home hero — brand-positioning statement over full-bleed engineering imagery. */
export function Hero() {
  const t = useTranslations('home.hero');
  const tc = useTranslations('cta');
  const categories = t.raw('categories') as string[];

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* background imagery — design-system hero (rendered crisp, no blur) */}
      <Image
        src="/design-system/hero-home.png"
        alt={t('imageAlt')}
        fill
        priority
        fetchPriority="high"
        quality={65}
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
          <h1 className="max-w-3xl font-display text-h1 font-semibold leading-[1.08] text-white">
            {t('headline')}
          </h1>

          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {categories.map((category, i) => (
              <li key={category} className="flex items-center gap-5">
                {i > 0 && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />}
                <Link
                  href={`/systems/${CATEGORY_SLUGS[i]}`}
                  className="text-body-l text-white/70 transition-colors hover:text-gold"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>

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
            <p className="mt-4 text-body-s leading-relaxed text-white/60">
              {t('cardText')}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
