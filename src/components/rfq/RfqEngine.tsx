'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRfqStore } from './store';
import { Button } from '@/components/ui/Button';
import { SystemIcon } from '@/components/icons/SystemIcon';
import { cn } from '@/lib/utils';
import { company } from '@/lib/site';
import {
  trackEvent,
  trackRfqStep,
  trackContactClick,
  getUtm,
} from '@/lib/analytics';
import type { RfqResult } from '@/lib/rfq';

type SystemOption = { slug: string; name: string };

// Canonical (CRM-stable) option VALUES; labels come from translations by index.
const BUYER_ROLES = [
  'architect', 'consultant', 'contractor', 'epc', 'developer', 'owner', 'project_manager', 'other',
] as const;
const PROJECT_STAGES = [
  'concept', 'design_development', 'tender', 'under_construction', 'renovation',
] as const;
const APPLICATION_ZONES = [
  'lobby', 'corridor', 'terminal', 'mall', 'office', 'hotel', 'airport', 'commercial_hall', 'other',
] as const;
const CONTACT_METHODS = ['phone', 'whatsapp', 'email'] as const;
const SUPPLY_SCOPES = ['supply_only', 'supply_install', 'not_sure'] as const;
const REQ_OPTIONS = ['required', 'not_required', 'not_sure'] as const;

const ACCEPTED_FILES = '.pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.doc,.docx,.xls,.xlsx';

/** Map a URL ?system= param (slug or short alias) to a known system slug. */
function normalizeSystemParam(param: string, options: SystemOption[]): string | null {
  const p = param.trim().toLowerCase();
  if (!p) return null;
  const exact = options.find((o) => o.slug === p);
  if (exact) return exact.slug;
  if (p === 'grilliom' || p === 'opencell') return 'open-cell';
  if (p === 'tile') return 'metal-tile';
  const partial = options.find((o) => o.slug.includes(p));
  return partial ? partial.slug : null;
}

function areaRange(area?: number): string {
  if (!area || Number.isNaN(area)) return 'unknown';
  if (area < 500) return '<500';
  if (area < 2000) return '500-2000';
  if (area < 8000) return '2000-8000';
  return '8000+';
}

export function RfqEngine({
  systemOptions,
  locale,
}: {
  systemOptions: SystemOption[];
  locale: string;
}) {
  const t = useTranslations('rfq');
  const tComplexity = useTranslations('common.complexity');
  const tCommon = useTranslations('common');
  const { step, draft, setField, next, back, reset } = useRfqStore();
  const steps = t.raw('steps') as string[];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RfqResult | null>(null);
  const [serverError, setServerError] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const startedRef = useRef(false);

  // Preselect the ceiling system from the URL (e.g. /rfq?system=linear-ceiling).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('system');
    if (param && !draft.systemPreference) {
      const slug = normalizeSystemParam(param, systemOptions);
      if (slug) setField('systemPreference', slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default preferred language to the active locale.
  useEffect(() => {
    if (!draft.preferredLanguage) setField('preferredLanguage', locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function eventParams() {
    return {
      ceiling_system: draft.systemPreference || undefined,
      project_type: draft.projectType || undefined,
      building_use: draft.buildingType || undefined,
      country: draft.projectCountry || undefined,
      area_range: areaRange(draft.areaUnknown ? undefined : Number(draft.area_m2)),
      buyer_role: draft.buyerRole || undefined,
      project_stage: draft.projectStage || undefined,
    };
  }

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent('rfq_start', eventParams());
  }

  function validateStep(current: number): boolean {
    const e: Record<string, string> = {};
    if (current === 0) {
      if (!draft.projectType.trim()) e.projectType = t('errorRequired');
      if (!draft.buildingType.trim()) e.buildingType = t('errorRequired');
      if (!draft.projectCountry.trim()) e.projectCountry = t('errorRequired');
      if (!draft.projectCity.trim()) e.projectCity = t('errorRequired');
    }
    if (current === 1) {
      if (!draft.systemPreference.trim()) e.systemPreference = t('errorRequired');
    }
    if (current === 2) {
      if (!draft.areaUnknown) {
        const area = Number(draft.area_m2);
        if (!draft.area_m2 || Number.isNaN(area) || area <= 0) e.area_m2 = t('errorArea');
      }
      if (!draft.projectStage.trim()) e.projectStage = t('errorRequired');
    }
    if (current === 3) {
      if (!draft.contactName.trim()) e.contactName = t('errorRequired');
      if (!draft.company.trim()) e.company = t('errorRequired');
      if (!draft.buyerRole.trim()) e.buyerRole = t('errorRequired');
      if (!draft.phone.trim()) e.phone = t('errorRequired');
      if (!draft.preferredContact.trim()) e.preferredContact = t('errorRequired');
      if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
        e.email = t('errorEmail');
      }
      if (!draft.consent) e.consent = t('errorConsent');
    }
    setErrors(e);
    if (Object.keys(e).length > 0) {
      trackEvent('rfq_field_error', {
        step_number: current + 1,
        fields: Object.keys(e).join(','),
      });
      return false;
    }
    return true;
  }

  function handleNext() {
    markStarted();
    if (validateStep(step)) {
      trackRfqStep(step + 1, steps[step] ?? `step-${step + 1}`, eventParams());
      next();
    }
  }

  function handleFiles(selected: FileList | null) {
    if (!selected || selected.length === 0) return;
    trackEvent('rfq_file_upload_started', { file_count: selected.length });
    setFiles(Array.from(selected).slice(0, 5));
    trackEvent('rfq_file_upload_completed', { file_count: Math.min(selected.length, 5) });
  }

  async function handleSubmit() {
    markStarted();
    if (!validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    setSubmitting(true);
    setServerError(false);

    const utm = getUtm();
    const payload = {
      ...draft,
      area_m2: draft.areaUnknown ? '' : draft.area_m2,
      consent: draft.consent,
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
      locale,
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
    };

    const form = new FormData();
    form.append('data', JSON.stringify(payload));
    for (const file of files) form.append('files', file);

    try {
      const res = await fetch('/api/rfq/submit', { method: 'POST', body: form });
      if (!res.ok) throw new Error('submit failed');
      const data = (await res.json()) as RfqResult;
      setResult(data);
      trackEvent('rfq_submit_success', { ...eventParams(), project_id: data.projectId });
      // GA4-recommended conversion event mirroring the successful RFQ. Carries
      // only safe metadata (no PII) so it can be marked a Key Event in GA4.
      trackEvent('generate_lead', {
        ...eventParams(),
        project_id: data.projectId,
        lead_source: 'rfq',
      });
      if (data.lead) {
        trackEvent(data.lead.delivered ? 'odoo_sync_success' : 'odoo_sync_failed', {
          project_id: data.projectId,
        });
      }
    } catch {
      setServerError(true);
      trackEvent('rfq_submit_error', eventParams());
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (result) {
    const systemName =
      systemOptions.find((s) => s.slug === result.assignedSystem)?.name ?? result.assignedSystem;
    const place = [draft.projectCity, draft.projectCountry].filter(Boolean).join(', ');
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 lg:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <SystemIcon name="quality" className="h-6 w-6 text-success" />
          </span>
          <h2 className="font-display text-h3 font-semibold text-white">{t('successTitle')}</h2>
        </div>
        <p className="mt-4 max-w-prose whitespace-pre-line text-body text-ink-600">
          {t('successText')}
        </p>

        <dl className="mt-8 grid gap-px overflow-hidden rounded border border-white/10 bg-white/10 sm:grid-cols-2">
          <ResultRow label={t('projectId')} value={result.projectId} mono />
          <ResultRow label={t('assignedSystem')} value={systemName} />
          <ResultRow label={t('fields.projectType')} value={draft.projectType || '—'} />
          {place ? <ResultRow label={t('fields.location')} value={place} /> : null}
          {draft.company ? <ResultRow label={t('fields.company')} value={draft.company} /> : null}
          <ResultRow label={t('complexity')} value={tComplexity(result.complexity)} />
        </dl>

        {/* Urgent coordination */}
        <div className="mt-8 rounded border border-gold/30 bg-gold/[0.06] p-5">
          <p className="text-body-s font-semibold uppercase tracking-[0.12em] text-gold">
            {t('successUrgentTitle')}
          </p>
          <div className="mt-3 flex flex-col gap-1 text-body-s text-ink-300">
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nums font-medium text-white hover:text-gold"
              onClick={() => trackContactClick('whatsapp', { cta_location: 'rfq_success' })}
            >
              {tCommon('whatsapp')} / {tCommon('call')}: {company.mobileIntlDisplay}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="font-medium text-white hover:text-gold"
              onClick={() => trackContactClick('email', { cta_location: 'rfq_success' })}
            >
              {t('fields.email')}: {company.email}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="gold"
            onClick={() => {
              reset();
              setResult(null);
              setErrors({});
              setFiles([]);
              startedRef.current = false;
            }}
          >
            {t('newRequest')}
          </Button>
          <Button variant="outline" href="/contact">
            {t('successContact')}
          </Button>
          <Button
            variant="ghost"
            href={company.whatsappUrl}
            external
          >
            {t('successWhatsapp')}
          </Button>
        </div>
      </div>
    );
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
      {/* Honeypot — hidden from humans, ignored by assistive tech. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={draft.website}
            onChange={(e) => setField('website', e.target.value)}
          />
        </label>
      </div>

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
            <span className={cn('text-caption', i === step ? 'font-medium text-ink' : 'text-ink-400')}>
              <span className="nums">0{i + 1}</span> {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 min-h-[260px]">
        {/* ── Step 1 — Project identity ── */}
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.projectType')} error={errors.projectType} required className="sm:col-span-2">
              <input className="aecs-input" value={draft.projectType}
                onChange={(e) => setField('projectType', e.target.value)}
                placeholder={t('fields.projectTypePlaceholder')} />
            </Field>
            <Field label={t('fields.buildingType')} error={errors.buildingType} required>
              <input className="aecs-input" value={draft.buildingType}
                onChange={(e) => setField('buildingType', e.target.value)}
                placeholder={t('fields.buildingTypePlaceholder')} />
            </Field>
            <Field label={t('fields.projectName')}>
              <input className="aecs-input" value={draft.projectName}
                onChange={(e) => setField('projectName', e.target.value)}
                placeholder={t('fields.projectNamePlaceholder')} />
            </Field>
            <Field label={t('fields.projectCountry')} error={errors.projectCountry} required>
              <input className="aecs-input" value={draft.projectCountry}
                onChange={(e) => setField('projectCountry', e.target.value)}
                placeholder={t('fields.projectCountryPlaceholder')} autoComplete="country-name" />
            </Field>
            <Field label={t('fields.projectCity')} error={errors.projectCity} required>
              <input className="aecs-input" value={draft.projectCity}
                onChange={(e) => setField('projectCity', e.target.value)}
                placeholder={t('fields.projectCityPlaceholder')} />
            </Field>
            <p className="text-body-s text-ink-500 sm:col-span-2">{t('internationalNote')}</p>
          </div>
        )}

        {/* ── Step 2 — Ceiling system ── */}
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.systemPreference')} error={errors.systemPreference} required className="sm:col-span-2">
              <select className="aecs-input" value={draft.systemPreference}
                onChange={(e) => setField('systemPreference', e.target.value)}>
                <option value="">{t('fields.selectPlaceholder')}</option>
                {systemOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
                <option value="auto">{t('fields.systemAuto')}</option>
              </select>
            </Field>
            <EnumSelect
              label={t('fields.applicationZone')}
              placeholder={t('fields.selectPlaceholder')}
              values={APPLICATION_ZONES}
              labels={t.raw('fields.applicationZoneOptions') as string[]}
              value={draft.applicationZone}
              onChange={(v) => setField('applicationZone', v)}
              className="sm:col-span-2"
            />
          </div>
        )}

        {/* ── Step 3 — Technical parameters ── */}
        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.area')} error={errors.area_m2} required={!draft.areaUnknown}>
              <input type="number" inputMode="numeric" min={1} className="aecs-input nums"
                value={draft.area_m2} disabled={draft.areaUnknown}
                onChange={(e) => setField('area_m2', e.target.value)}
                placeholder={t('fields.areaPlaceholder')} />
              <label className="mt-2 flex items-center gap-2 text-body-s text-ink-400">
                <input type="checkbox" className="h-4 w-4 accent-gold" checked={draft.areaUnknown}
                  onChange={(e) => { setField('areaUnknown', e.target.checked); if (e.target.checked) setField('area_m2', ''); }} />
                {t('fields.areaUnknown')}
              </label>
            </Field>
            <Field label={t('fields.ceilingHeight')}>
              <input className="aecs-input nums" value={draft.ceilingHeight}
                onChange={(e) => setField('ceilingHeight', e.target.value)}
                placeholder={t('fields.ceilingHeightPlaceholder')} />
            </Field>
            <EnumSelect
              label={t('fields.projectStage')} required error={errors.projectStage}
              placeholder={t('fields.selectPlaceholder')}
              values={PROJECT_STAGES}
              labels={t.raw('fields.projectStageOptions') as string[]}
              value={draft.projectStage} onChange={(v) => setField('projectStage', v)}
            />
            <Field label={t('fields.deadline')}>
              <input className="aecs-input" value={draft.deadline}
                onChange={(e) => setField('deadline', e.target.value)}
                placeholder={t('fields.deadlinePlaceholder')} />
            </Field>
            <EnumSelect
              label={t('fields.supplyScope')} placeholder={t('fields.selectPlaceholder')}
              values={SUPPLY_SCOPES}
              labels={t.raw('fields.supplyScopeOptions') as string[]}
              value={draft.supplyScope} onChange={(v) => setField('supplyScope', v)}
            />
            <EnumSelect
              label={t('fields.acousticRequirement')} placeholder={t('fields.selectPlaceholder')}
              values={REQ_OPTIONS}
              labels={t.raw('fields.requirementOptions') as string[]}
              value={draft.acousticRequirement} onChange={(v) => setField('acousticRequirement', v)}
            />
            <EnumSelect
              label={t('fields.fireRequirement')} placeholder={t('fields.selectPlaceholder')}
              values={REQ_OPTIONS}
              labels={t.raw('fields.requirementOptions') as string[]}
              value={draft.fireRequirement} onChange={(v) => setField('fireRequirement', v)}
            />
            <Field label={t('fields.finishRequirement')} className="sm:col-span-2">
              <input className="aecs-input" value={draft.finishRequirement}
                onChange={(e) => setField('finishRequirement', e.target.value)}
                placeholder={t('fields.finishRequirementPlaceholder')} />
            </Field>
            <Field label={t('fields.notes')} className="sm:col-span-2">
              <textarea rows={3} className="aecs-input resize-y" value={draft.notes}
                onChange={(e) => setField('notes', e.target.value)}
                placeholder={t('fields.notesPlaceholder')} />
            </Field>
          </div>
        )}

        {/* ── Step 4 — Buyer identity & submission ── */}
        {step === 3 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('fields.name')} error={errors.contactName} required>
              <input className="aecs-input" value={draft.contactName}
                onChange={(e) => setField('contactName', e.target.value)}
                placeholder={t('fields.namePlaceholder')} autoComplete="name" />
            </Field>
            <Field label={t('fields.company')} error={errors.company} required>
              <input className="aecs-input" value={draft.company}
                onChange={(e) => setField('company', e.target.value)}
                placeholder={t('fields.companyPlaceholder')} autoComplete="organization" />
            </Field>
            <EnumSelect
              label={t('fields.buyerRole')} required error={errors.buyerRole}
              placeholder={t('fields.selectPlaceholder')}
              values={BUYER_ROLES}
              labels={t.raw('fields.buyerRoleOptions') as string[]}
              value={draft.buyerRole} onChange={(v) => setField('buyerRole', v)}
            />
            <EnumSelect
              label={t('fields.preferredContact')} required error={errors.preferredContact}
              placeholder={t('fields.selectPlaceholder')}
              values={CONTACT_METHODS}
              labels={t.raw('fields.preferredContactOptions') as string[]}
              value={draft.preferredContact} onChange={(v) => setField('preferredContact', v)}
            />
            <Field label={t('fields.phone')} error={errors.phone} required>
              <input type="tel" className="aecs-input" value={draft.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder={t('fields.phonePlaceholder')} autoComplete="tel" dir="ltr" />
            </Field>
            <Field label={t('fields.email')} error={errors.email}>
              <input type="email" className="aecs-input" value={draft.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder={t('fields.emailPlaceholder')} autoComplete="email" dir="ltr" />
            </Field>
            <Field label={t('fields.fileUpload')} className="sm:col-span-2">
              <input type="file" multiple accept={ACCEPTED_FILES}
                onChange={(e) => handleFiles(e.target.files)}
                className="block w-full text-body-s text-ink-400 file:mr-4 file:rounded-sm file:border-0 file:bg-gold file:px-4 file:py-2 file:text-label file:font-semibold file:uppercase file:tracking-[0.08em] file:text-ink-950 hover:file:bg-gold-400" />
              <span className="text-caption text-ink-500">{t('fields.fileUploadHint')}</span>
              {files.length > 0 && (
                <span className="text-caption text-ink-300">
                  {files.map((f) => f.name).join(', ')}
                </span>
              )}
            </Field>
            <label className="flex items-start gap-3 sm:col-span-2">
              <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-gold"
                checked={draft.consent}
                onChange={(e) => setField('consent', e.target.checked)} />
              <span className="text-body-s text-ink-400">
                {t('consentText')}
                {errors.consent ? (
                  <span className="mt-1 block text-caption text-danger">{errors.consent}</span>
                ) : null}
              </span>
            </label>
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
          <Button variant="gold" onClick={handleNext}>{t('next')}</Button>
        ) : (
          <Button variant="gold" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t('submitting') : t('submit')}
          </Button>
        )}
      </div>

      {/* WhatsApp — secondary help, deliberately understated vs. the RFQ submit */}
      <p className="mt-6 text-center text-body-s text-ink-500">
        {t('whatsappHelp')}{' '}
        <a
          href={company.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="nums font-medium text-gold hover:text-gold-300"
          onClick={() => trackContactClick('whatsapp', { cta_location: 'rfq_form' })}
        >
          {company.mobileIntlDisplay}
        </a>
      </p>
    </div>
  );
}

function Field({
  label, error, required, className, children,
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

function EnumSelect({
  label, placeholder, values, labels, value, onChange, required, error, className,
}: {
  label: string;
  placeholder: string;
  values: readonly string[];
  labels: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <Field label={label} required={required} error={error} className={className}>
      <select className="aecs-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {values.map((v, i) => (
          <option key={v} value={v}>{labels[i] ?? v}</option>
        ))}
      </select>
    </Field>
  );
}

function ResultRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-ink-900 px-5 py-4">
      <dt className="text-caption uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className={cn('mt-1 text-body font-medium text-ink', mono && 'font-latin nums')}>{value}</dd>
    </div>
  );
}
