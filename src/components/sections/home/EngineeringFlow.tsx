import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';
import { Reveal } from '@/components/ui/Reveal';

const STEP_ICONS: IconKey[] = ['architecture', 'engineering', 'system', 'execution'];

type Step = { title: string; text: string };

/** Design → Engineering → Manufacturing → Execution flow. */
export function EngineeringFlow() {
  const t = useTranslations('home.engineering');
  const steps = t.raw('steps') as Step[];

  return (
    <Section dark>
      <SectionHeader
        dark
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 80}>
            <div className="relative h-full bg-ink-900 p-7">
              <div className="flex items-center justify-between">
                <SystemIcon
                  name={STEP_ICONS[i]}
                  node={i === steps.length - 1}
                  className="h-7 w-7 text-gold-300"
                />
                <span className="font-latin text-h3 font-bold tabular-nums text-white/10">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-h4 font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-body-s text-ink-300">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
