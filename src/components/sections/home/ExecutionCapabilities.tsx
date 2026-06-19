import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { SystemIcon, type IconKey } from '@/components/icons/SystemIcon';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

const ICONS: IconKey[] = ['office', 'team', 'control', 'quality'];

type Capability = { title: string; text: string };

/** Execution system — proof-oriented engineering capabilities. */
export function ExecutionCapabilities() {
  const t = useTranslations('home.execution');
  const tc = useTranslations('cta');
  const items = t.raw('capabilities') as Capability[];

  return (
    <Section ivory>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} description={t('summary')} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((c, i) => (
          <Reveal key={c.title} delay={i * 70}>
            <div className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.02] p-7 transition-colors duration-medium ease-aecs hover:border-gold/40 hover:bg-white/[0.04]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-gold transition-colors duration-fast group-hover:border-gold/40">
                <SystemIcon name={ICONS[i]} className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-h4 font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-body-s leading-relaxed text-ink-600">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12">
        <Button href="/contact" variant="outline" size="lg">
          {tc('talkToEngineering')}
        </Button>
      </div>
    </Section>
  );
}
