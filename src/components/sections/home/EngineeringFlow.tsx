import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';
import { Button } from '@/components/ui/Button';

const STEP_ICONS: IconKey[] = ['architecture', 'engineering', 'system', 'execution'];

type Step = { title: string; text: string };

/** Design → Engineering → Manufacturing → Execution — a visual engineering flow. */
export function EngineeringFlow() {
  const t = useTranslations('home.engineering');
  const tc = useTranslations('cta');
  const steps = t.raw('steps') as Step[];

  return (
    <Section dark>
      <SectionHeader
        dark
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <div className="relative mt-16">
        {/* desktop connector line behind the nodes */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[12.5%] top-7 hidden h-px bg-gradient-to-r from-gold/10 via-gold/45 to-gold/10 md:block"
        />
        <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
            >
              {/* mobile vertical connector */}
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-10 start-[1.75rem] top-14 w-px bg-white/10 md:hidden"
                />
              ) : null}

              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink-900 text-gold">
                <SystemIcon name={STEP_ICONS[i]} node={i === steps.length - 1} className="h-6 w-6" />
              </span>

              <div className="md:mt-6">
                <span className="font-latin text-caption font-bold tabular-nums text-gold/70">
                  0{i + 1}
                </span>
                <h3 className="mt-1 text-h4 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-body-s leading-relaxed text-ink-300 md:mx-auto md:max-w-[24ch]">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button href="/rfq" variant="gold" size="lg">
          {tc('startProjectDefinition')}
        </Button>
        <Button href="/engineering" variant="outline" size="lg">
          {tc('seeEngineeringProcess')}
        </Button>
      </div>
    </Section>
  );
}
