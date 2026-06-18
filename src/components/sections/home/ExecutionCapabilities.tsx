import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';
import { Reveal } from '@/components/ui/Reveal';

const ICONS: IconKey[] = ['office', 'team', 'control', 'quality'];

type Capability = { title: string; text: string };

/** Execution system — real engineering capabilities (technical office, field team…). */
export function ExecutionCapabilities() {
  const t = useTranslations('home.execution');
  const items = t.raw('capabilities') as Capability[];

  return (
    <Section ivory>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} />
      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {items.map((c, i) => (
          <Reveal key={c.title} delay={i * 70}>
            <div className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-gold">
                <SystemIcon name={ICONS[i]} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-h4 font-semibold text-white">{c.title}</h3>
                <p className="mt-2 max-w-sm text-body-s text-ink-600">{c.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
