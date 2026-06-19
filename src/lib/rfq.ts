import { systemSlugs } from './content/systems';

export type ComplexityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RfqInput = {
  // Project identity
  projectType: string;
  buildingType?: string; // building use
  projectCountry?: string;
  projectCity?: string;
  projectName?: string;
  // Ceiling system
  systemPreference: string; // a system slug, 'auto' (not sure / need recommendation)
  applicationZone?: string;
  // Technical parameters
  /** Approximate area in m². `undefined`/NaN means "unknown" (allowed). */
  area_m2?: number;
  ceilingHeight?: string;
  projectStage?: string;
  deadline?: string; // timeline
  acousticRequirement?: string;
  fireRequirement?: string;
  finishRequirement?: string;
  supplyScope?: string;
  notes?: string;
  // Buyer identity
  contactName?: string;
  company?: string;
  buyerRole?: string;
  phone?: string; // phone or WhatsApp
  email?: string;
  preferredContact?: string;
  preferredLanguage?: string;
  consent?: boolean;
  // Context (analytics / CRM)
  sourcePage?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type RfqResult = {
  projectId: string;
  status: 'received';
  assignedSystem: string; // slug
  complexity: ComplexityLevel;
  engineeringScore: number; // 0–100
  nextStep: 'Engineering Review';
  /** CRM delivery status (Odoo). Absent when no transport is configured. */
  lead?: { delivered: boolean; leadId?: number; error?: string };
};

const KEYWORD_MAP: { match: RegExp; slug: string }[] = [
  { match: /airport|terminal|corridor|hall|فرودگاه|پایانه|راهرو|سالن/i, slug: 'linear-ceiling' },
  { match: /mall|retail|commercial|transport|مال|تجاری|فروشگاه/i, slug: 'open-cell' },
  { match: /hospital|clean|sterile|bank|office|بیمارستان|اداری|بانک|استریل/i, slug: 'metal-tile' },
  { match: /acoustic|school|library|آکوستیک|مدرسه|کتابخانه/i, slug: 'baffle' },
];

/** Deterministic system classification (no fabricated output). */
export function classifySystem(input: RfqInput): string {
  // An explicit, known system slug always wins. 'auto' / '' / 'not-sure' fall
  // through to keyword + scale heuristics ("need engineering recommendation").
  if (input.systemPreference && systemSlugs.includes(input.systemPreference)) {
    return input.systemPreference;
  }
  const haystack = `${input.projectType} ${input.buildingType ?? ''} ${
    input.applicationZone ?? ''
  } ${input.notes ?? ''}`;
  for (const { match, slug } of KEYWORD_MAP) {
    if (match.test(haystack)) return slug;
  }
  // default by scale: small/medium → grid, large → linear
  return (input.area_m2 ?? 0) > 3000 ? 'linear-ceiling' : 'open-cell';
}

export function scoreComplexity(input: RfqInput): {
  complexity: ComplexityLevel;
  engineeringScore: number;
} {
  const a = input.area_m2 ?? 0;
  let score = 20;
  if (a > 500) score += 15;
  if (a > 2000) score += 20;
  if (a > 8000) score += 20;

  const reqText = [
    input.notes,
    input.acousticRequirement,
    input.fireRequirement,
    input.finishRequirement,
  ]
    .filter(Boolean)
    .join(' ');
  const reqLen = reqText.trim().length;
  if (reqLen > 80) score += 10;
  if (input.acousticRequirement || input.fireRequirement) score += 5;
  if (/seismic|load|height|50|آکوستیک|زلزله|ارتفاع|بار/i.test(reqText)) {
    score += 15;
  }
  score = Math.min(100, score);

  const complexity: ComplexityLevel =
    score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  return { complexity, engineeringScore: score };
}

/** Project ID: AVZ-YYYY-XXXX. Timestamp is injected (scripts can't use Date.now in workflows; API can). */
export function makeProjectId(now: number, salt: number): string {
  const year = new Date(now).getUTCFullYear();
  const seq = (Math.floor(now / 1000) % 100000) + (salt % 1000);
  return `AVZ-${year}-${String(seq % 10000).padStart(4, '0')}`;
}

/** Upper bounds for free-text fields — reject oversized payloads server-side. */
export const RFQ_LIMITS = {
  short: 200, // single-line fields (name, company, phone, location, …)
  long: 4000, // multi-line fields (requirements, challenge)
  area: 1_000_000, // m² — generous physical ceiling on building scale
} as const;

/**
 * Server-side validation. Authoritative regardless of the client: required
 * fields must be present, the area must be a sane positive number, and every
 * field is length-capped so a malicious client cannot post unbounded text.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRfq(input: Partial<RfqInput>): {
  ok: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // ── Required: project identity ──
  if (!input.projectType?.trim()) errors.projectType = 'required';
  if (!input.buildingType?.trim()) errors.buildingType = 'required';
  if (!input.projectCountry?.trim()) errors.projectCountry = 'required';
  if (!input.projectCity?.trim()) errors.projectCity = 'required';

  // ── Required: ceiling system (a slug or 'auto' = need recommendation) ──
  if (!input.systemPreference?.trim()) errors.systemPreference = 'required';

  // ── Required: project stage ──
  if (!input.projectStage?.trim()) errors.projectStage = 'required';

  // ── Area: required only when known (undefined = "unknown", allowed) ──
  if (input.area_m2 !== undefined) {
    if (
      Number.isNaN(input.area_m2) ||
      !Number.isFinite(input.area_m2) ||
      input.area_m2 <= 0 ||
      input.area_m2 > RFQ_LIMITS.area
    ) {
      errors.area_m2 = 'area';
    }
  }

  // ── Required: buyer identity & contact ──
  if (!input.contactName?.trim()) errors.contactName = 'required';
  if (!input.company?.trim()) errors.company = 'required';
  if (!input.buyerRole?.trim()) errors.buyerRole = 'required';
  if (!input.phone?.trim()) errors.phone = 'required';
  if (!input.preferredContact?.trim()) errors.preferredContact = 'required';
  if (!input.consent) errors.consent = 'required';

  // ── Email: optional, but must be valid if provided ──
  if (input.email?.trim() && !EMAIL_RE.test(input.email.trim())) {
    errors.email = 'email';
  }

  const shortFields: (keyof RfqInput)[] = [
    'projectType',
    'buildingType',
    'projectCountry',
    'projectCity',
    'projectName',
    'systemPreference',
    'applicationZone',
    'ceilingHeight',
    'deadline',
    'projectStage',
    'acousticRequirement',
    'fireRequirement',
    'finishRequirement',
    'supplyScope',
    'contactName',
    'company',
    'buyerRole',
    'phone',
    'email',
    'preferredContact',
    'preferredLanguage',
  ];
  for (const key of shortFields) {
    const value = input[key];
    if (typeof value === 'string' && value.length > RFQ_LIMITS.short) {
      errors[key] = 'too_long';
    }
  }

  const value = input.notes;
  if (typeof value === 'string' && value.length > RFQ_LIMITS.long) {
    errors.notes = 'too_long';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
