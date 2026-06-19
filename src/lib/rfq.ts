import { systemSlugs } from './content/systems';

export type ComplexityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RfqInput = {
  projectType: string;
  buildingType?: string;
  area_m2: number;
  systemPreference: string; // a system slug or 'auto'
  location?: string;
  technicalRequirements?: string;
  deadline?: string;
  /** Optional engineering-context fields (free text, used for routing/CRM only). */
  projectStage?: string;
  hasDrawings?: string;
  needsMep?: string;
  projectChallenge?: string;
  contactName?: string;
  company?: string;
  phone?: string;
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
  if (input.systemPreference && systemSlugs.includes(input.systemPreference)) {
    return input.systemPreference;
  }
  const haystack = `${input.projectType} ${input.buildingType ?? ''} ${
    input.technicalRequirements ?? ''
  } ${input.projectChallenge ?? ''}`;
  for (const { match, slug } of KEYWORD_MAP) {
    if (match.test(haystack)) return slug;
  }
  // default by scale: small/medium → grid, large → linear
  return input.area_m2 > 3000 ? 'linear-ceiling' : 'open-cell';
}

export function scoreComplexity(input: RfqInput): {
  complexity: ComplexityLevel;
  engineeringScore: number;
} {
  const a = input.area_m2;
  let score = 20;
  if (a > 500) score += 15;
  if (a > 2000) score += 20;
  if (a > 8000) score += 20;

  const reqText = `${input.technicalRequirements ?? ''} ${input.projectChallenge ?? ''}`;
  const reqLen = reqText.trim().length;
  if (reqLen > 80) score += 10;
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
export function validateRfq(input: Partial<RfqInput>): {
  ok: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.projectType?.trim()) errors.projectType = 'required';
  if (!input.systemPreference?.trim()) errors.systemPreference = 'required';

  if (
    input.area_m2 === undefined ||
    Number.isNaN(input.area_m2) ||
    !Number.isFinite(input.area_m2) ||
    input.area_m2 <= 0 ||
    input.area_m2 > RFQ_LIMITS.area
  ) {
    errors.area_m2 = 'area';
  }

  const shortFields: (keyof RfqInput)[] = [
    'projectType',
    'buildingType',
    'systemPreference',
    'location',
    'deadline',
    'projectStage',
    'hasDrawings',
    'needsMep',
    'contactName',
    'company',
    'phone',
  ];
  for (const key of shortFields) {
    const value = input[key];
    if (typeof value === 'string' && value.length > RFQ_LIMITS.short) {
      errors[key] = 'too_long';
    }
  }

  const longFields: (keyof RfqInput)[] = ['technicalRequirements', 'projectChallenge'];
  for (const key of longFields) {
    const value = input[key];
    if (typeof value === 'string' && value.length > RFQ_LIMITS.long) {
      errors[key] = 'too_long';
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
