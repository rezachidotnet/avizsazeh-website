'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRfqStore } from './store';
import { Button } from '@/components/ui/Button';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { cn } from '@/lib/utils';
import type { RfqResult } from '@/lib/rfq';

type SystemOption = { slug: string; name: string };

export function RfqEngine({ systemOptions }: { systemOptions: SystemOption[] }) {
  const t = useTranslations('rfq');
  const tComplexity = useTranslations('common.complexity');
  const { step, draft, setField, next, back, reset } = useRfqStore();
  const steps = t.raw('steps') as string[];
  const stageOptions = t.raw('fields.projectStageOptions') as string[];
  const drawingsOptions = t.raw('fields.hasDrawingsOptions') as string[];
  const mepOptions = t.raw('fields.needsMepOptions') as string[];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RfqResult | null>(null);
  const [serverError, setServerError] = useState(false);

  function validateStep(current: number): boolean {
    const e: Record<string, string> = {};
    if (current === 0 && !draft.projectType.trim()) e.projectType = t('errorRequired');
    if (current === 1) {
      const area = Number(draft.area_m2);
      if (!draft.area_m2 || Number.isNaN(area) || area <= 0) e.area_m2 = t('errorArea');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) next();
  }

  async function handleSubmit() {
    if (!validateStep(0) || !validateStep(1)) return;
    setSubmitting(true);
    setServerError(false);
    try {
      const res = await fetch('/api/rfq/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: draft.projectType,
          buildingType: draft.buildingType,
          area_m2: Number(draft.area_m2),
          systemPreference: draft.systemPreference,
          location: draft.location,
          technicalRequirements: draft.technicalRequirements,
          deadline: draft.deadline,
          projectStage: draft.projectStage,
          hasDrawings: draft.hasDrawings,
          needsMep: draft.needsMep,
          projectChallenge: draft.projectChallenge,
          contactName: draft.contactName,
          company: draft.company,
          phone: draft.phone,
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      const data = (await res.json()) as RfqResult;
      setResult(data);
    } catch {
      setServerError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const systemName =
      systemOptions.find((s) => s.slug === result.assignedSystem)?.name ??
      result.assignedSystem;
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 lg:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <SystemIcon name="quality" className="h-6 w-6 text-success" />
          </span>
          <h2 className="font-display text-h3 font-semibold text-white">{t('successTitle')}</h2>
        </div>
        <p className="mt-4 max-w-prose text-body text-ink-600">{t('successText')}</p>

        <dl className="mt-8 grid gap-px overflow-hidden rounded border border-white/10 bg-white/10 sm:grid-cols-2">
          <ResultRow label={t('projectId')} value={result.projectId} mono />
          <ResultRow label={t('assignedSystem')} value={systemName} />
          <ResultRow
            label={t('complexity')}
            value={tComplexity(result.complexity)}
          />
          <ResultRow label={t('nextStep')} value={t('nextStepValue')} />
        </dl>

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setResult(null);
              setErrors({});
            }}
          >
            {t('newRequest')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
      {/* progress */}
      <ol className="flex items-center gap-2" aria-label="progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span
              className={cn(
                'h-1 rounded-full transition-colors duration-medium',
                i <= step ? 'bg-gold' : 'bg-white/10',
              )}
            />
            <span
              className={cn(
                'text-caption',
                i === step ? 'font-medium text-ink' : 'text-ink-400',
              )}
            >
              <span className="nums">0{i + 1}</span> {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 min-h-[260px]">
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.projectType')} error={errors.projectType} required className="sm:col-span-2">
              <input
                className="aecs-input"
                value={draft.projectType}
                onChange={(e) => setField('projectType', e.target.value)}
                placeholder={t('fields.projectTypePlaceholder')}
              />
            </Field>
            <Field label={t('fields.buildingType')}>
              <input
                className="aecs-input"
                value={draft.buildingType}
                onChange={(e) => setField('buildingType', e.target.value)}
                placeholder={t('fields.buildingTypePlaceholder')}
              />
            </Field>
            <Field label={t('fields.location')}>
              <input
                className="aecs-input"
                value={draft.location}
                onChange={(e) => setField('location', e.target.value)}
                placeholder={t('fields.locationPlaceholder')}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.systemPreference')} className="sm:col-span-2">
              <select
                className="aecs-input"
                value={draft.systemPreference}
                onChange={(e) => setField('systemPreference', e.target.value)}
              >
                <option value="auto">{t('fields.systemAuto')}</option>
                {systemOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('fields.area')} error={errors.area_m2} required>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                className="aecs-input nums"
                value={draft.area_m2}
                onChange={(e) => setField('area_m2', e.target.value)}
                placeholder={t('fields.areaPlaceholder')}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.deadline')}>
              <input
                className="aecs-input"
                value={draft.deadline}
                onChange={(e) => setField('deadline', e.target.value)}
                placeholder={t('fields.deadlinePlaceholder')}
              />
            </Field>
            <Field label={t('fields.projectStage')}>
              <select
                className="aecs-input"
                value={draft.projectStage}
                onChange={(e) => setField('projectStage', e.target.value)}
              >
                <option value="">{t('fields.selectPlaceholder')}</option>
                {stageOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('fields.hasDrawings')}>
              <select
                className="aecs-input"
                value={draft.hasDrawings}
                onChange={(e) => setField('hasDrawings', e.target.value)}
              >
                <option value="">{t('fields.selectPlaceholder')}</option>
                {drawingsOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('fields.needsMep')}>
              <select
                className="aecs-input"
                value={draft.needsMep}
                onChange={(e) => setField('needsMep', e.target.value)}
              >
                <option value="">{t('fields.selectPlaceholder')}</option>
                {mepOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('fields.requirements')} className="sm:col-span-2">
              <textarea
                rows={4}
                className="aecs-input resize-y"
                value={draft.technicalRequirements}
                onChange={(e) => setField('technicalRequirements', e.target.value)}
                placeholder={t('fields.requirementsPlaceholder')}
              />
            </Field>
            <Field label={t('fields.challenge')} className="sm:col-span-2">
              <textarea
                rows={3}
                className="aecs-input resize-y"
                value={draft.projectChallenge}
                onChange={(e) => setField('projectChallenge', e.target.value)}
                placeholder={t('fields.challengePlaceholder')}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.name')}>
              <input
                className="aecs-input"
                value={draft.contactName}
                onChange={(e) => setField('contactName', e.target.value)}
                placeholder={t('fields.namePlaceholder')}
                autoComplete="name"
              />
            </Field>
            <Field label={t('fields.company')}>
              <input
                className="aecs-input"
                value={draft.company}
                onChange={(e) => setField('company', e.target.value)}
                placeholder={t('fields.companyPlaceholder')}
                autoComplete="organization"
              />
            </Field>
            <Field label={t('fields.phone')} className="sm:col-span-2">
              <input
                type="tel"
                className="aecs-input"
                value={draft.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder={t('fields.phonePlaceholder')}
                autoComplete="tel"
                dir="ltr"
              />
            </Field>
            {serverError && (
              <p className="text-body-s text-danger sm:col-span-2">{t('errorGeneric')}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-200 pt-6">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          {t('back')}
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext}>{t('next')}</Button>
        ) : (
          <Button variant="gold" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t('submitting') : t('submit')}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-body-s font-medium text-ink-700">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      {children}
      {error ? <span className="text-caption text-danger">{error}</span> : null}
    </label>
  );
}

function ResultRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-ink-900 px-5 py-4">
      <dt className="text-caption uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className={cn('mt-1 text-body font-medium text-ink', mono && 'font-latin nums')}>
        {value}
      </dd>
    </div>
  );
}
