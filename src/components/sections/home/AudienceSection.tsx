import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Reveal } from '@/components/ui/Reveal';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';

type Card = { title: string; text: string };

const ICONS: IconKey[] = ['architecture', 'quality', 'team'];

/** Audience qualification — distinct value for architects, owners, contractors. */
export function AudienceSection() {
  const t = useTranslations('home.audiences');
  const cards = t.raw('cards') as Card[];

  return (
    <section className="bg-ivory py-section lg:py-section-lg">
      <div className="container-grid">
        <div className="max-w-2xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="mt-4 font-display text-h2 font-semibold text-white">{t('title')}</h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal as="div" key={card.title} delay={i * 70}>
              <div className="flex h-full flex-col bg-ink-950 p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-gold">
                  <SystemIcon name={ICONS[i % ICONS.length]} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-h4 font-semibold text-white">{card.title}</h3>
                <p className="mt-3 flex-1 text-body-s leading-relaxed text-ink-400">{card.text}</p>
                <Link
                  href="/rfq"
                  className="group mt-6 inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.08em] text-gold transition-colors hover:text-gold-300"
                >
                  {t('link')}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  >
                    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
