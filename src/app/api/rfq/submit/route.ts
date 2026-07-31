import { NextResponse } from 'next/server';
import {
  classifySystem,
  makeProjectId,
  scoreComplexity,
  validateRfq,
  type RfqInput,
  type RfqResult,
} from '@/lib/rfq';
import { getSystem } from '@/lib/content/systems';
import {
  isOdooConfigured,
  sendLeadToOdoo,
  type OdooAttachment,
  type OdooLeadInput,
} from '@/lib/odoo/client';
import { rateLimit, clientIpFrom } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Basic spam throttle: max submissions per IP per window. Best-effort
// (per-instance) — see lib/rate-limit.ts.
const RFQ_RATE_LIMIT = 5;
const RFQ_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// ── File upload limits ──────────────────────────────────────────────────────
const ALLOWED_EXT = new Set([
  'pdf', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'zip', 'doc', 'docx', 'xls', 'xlsx',
]);
const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per file
const MAX_TOTAL_BYTES = 15 * 1024 * 1024; // 15 MB total

function extOf(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

function looksLikeAllowedFile(ext: string, buffer: Buffer): boolean {
  if (buffer.length === 0) return false;
  const ascii = buffer.subarray(0, 64).toString('ascii');
  const hex = buffer.subarray(0, 8).toString('hex');
  if (ext === 'pdf') return ascii.startsWith('%PDF-');
  if (ext === 'jpg' || ext === 'jpeg') return hex.startsWith('ffd8ff');
  if (ext === 'png') return hex.startsWith('89504e470d0a1a0a');
  if (ext === 'zip' || ext === 'docx' || ext === 'xlsx') return ascii.startsWith('PK\u0003\u0004');
  if (ext === 'doc' || ext === 'xls') return hex.startsWith('d0cf11e0a1b11ae1');
  if (ext === 'dwg') return /^AC10\d{2}/.test(ascii);
  if (ext === 'dxf') return ascii.includes('SECTION') || ascii.includes('HEADER');
  return false;
}

/** Parse the request body — JSON, or multipart/form-data with a `data` field + files. */
async function parseBody(request: Request): Promise<{
  body: Partial<RfqInput> & { website?: string };
  attachments: OdooAttachment[];
  fileError?: string;
}> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as Partial<RfqInput> & { website?: string };
    return { body, attachments: [] };
  }

  // multipart/form-data
  const form = await request.formData();
  const dataRaw = form.get('data');
  const body = (
    typeof dataRaw === 'string' ? JSON.parse(dataRaw) : {}
  ) as Partial<RfqInput> & { website?: string };

  const attachments: OdooAttachment[] = [];
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  let total = 0;

  if (files.length > MAX_FILES) {
    return { body, attachments: [], fileError: 'too_many_files' };
  }

  for (const file of files) {
    if (file.size === 0) continue;
    const ext = extOf(file.name);
    if (!ALLOWED_EXT.has(ext)) {
      return { body, attachments: [], fileError: 'file_type' };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { body, attachments: [], fileError: 'file_too_large' };
    }
    total += file.size;
    if (total > MAX_TOTAL_BYTES) {
      return { body, attachments: [], fileError: 'files_too_large' };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!looksLikeAllowedFile(ext, buffer)) {
      return { body, attachments: [], fileError: 'file_type' };
    }
    attachments.push({
      filename: file.name,
      dataBase64: buffer.toString('base64'),
      mimetype: file.type || undefined,
    });
  }

  return { body, attachments };
}

/**
 * RFQ Engine — structured engineering project definition + CRM lead.
 * Pipeline: validate → classify system → score complexity → generate ID →
 * push lead + attachments to Odoo CRM → return engineering result.
 *
 * CRM delivery is part of acceptance for real submissions. If Odoo is missing
 * or fails before `crm.lead.create`, the API returns a non-2xx response so the
 * UI cannot present a false CRM registration success.
 */
export async function POST(request: Request) {
  // ── Rate limit by client IP (basic spam protection) ──────────────────────
  const ip = clientIpFrom(request.headers);
  const limit = rateLimit(`rfq:${ip}`, RFQ_RATE_LIMIT, RFQ_RATE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let body: Partial<RfqInput> & { website?: string };
  let attachments: OdooAttachment[];
  let fileError: string | undefined;
  try {
    ({ body, attachments, fileError } = await parseBody(request));
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (fileError) {
    return NextResponse.json({ error: fileError }, { status: 422 });
  }

  // ── Honeypot ─────────────────────────────────────────────────────────────
  // `website` is a hidden, off-screen field no human fills. If it carries a
  // value the request is almost certainly a bot: accept it silently (so the
  // bot sees a normal 200) but never create a CRM lead.
  const honeypotTripped =
    typeof body.website === 'string' && body.website.trim().length > 0;

  const str = (v: unknown): string | undefined => {
    const s = v === undefined || v === null ? '' : String(v).trim();
    return s.length ? s : undefined;
  };

  const areaRaw = body.area_m2;
  const area =
    areaRaw === undefined || areaRaw === null || String(areaRaw).trim() === ''
      ? undefined
      : Number(areaRaw);

  const input: RfqInput = {
    projectType: String(body.projectType ?? '').trim(),
    buildingType: str(body.buildingType),
    projectCountry: str(body.projectCountry),
    projectCity: str(body.projectCity),
    projectName: str(body.projectName),
    systemPreference: String(body.systemPreference ?? '').trim(),
    applicationZone: str(body.applicationZone),
    area_m2: area,
    ceilingHeight: str(body.ceilingHeight),
    projectStage: str(body.projectStage),
    deadline: str(body.deadline),
    acousticRequirement: str(body.acousticRequirement),
    fireRequirement: str(body.fireRequirement),
    finishRequirement: str(body.finishRequirement),
    supplyScope: str(body.supplyScope),
    notes: str(body.notes),
    contactName: str(body.contactName),
    company: str(body.company),
    buyerRole: str(body.buyerRole),
    phone: str(body.phone),
    email: str(body.email),
    preferredContact: str(body.preferredContact),
    preferredLanguage: str(body.preferredLanguage),
    consent: Boolean(body.consent),
    sourcePage: str(body.sourcePage),
    locale: str(body.locale),
    utmSource: str(body.utmSource),
    utmMedium: str(body.utmMedium),
    utmCampaign: str(body.utmCampaign),
  };

  const { ok, errors } = validateRfq(input);
  if (!ok) {
    return NextResponse.json({ error: 'validation_failed', errors }, { status: 422 });
  }

  const assignedSystem = classifySystem(input);
  const { complexity, engineeringScore } = scoreComplexity(input);
  const now = Date.now();
  const projectId = makeProjectId(now, Math.floor(now % 997));
  const requestId = request.headers.get('x-rfq-request-id')?.slice(0, 80) || projectId;

  const result: RfqResult = {
    ok: true,
    requestId,
    projectId,
    status: 'received',
    assignedSystem,
    complexity,
    engineeringScore,
    nextStep: 'Engineering Review',
  };

  // ── Push lead to Odoo CRM (best-effort) ──────────────────────────────────
  const systemName = getSystem(assignedSystem)?.name.en ?? assignedSystem;
  const location = [input.projectCity, input.projectCountry].filter(Boolean).join(', ');
  const leadInput: OdooLeadInput = {
    name: input.contactName || `RFQ ${projectId}`,
    phone: input.phone,
    email: input.email,
    company: input.company,
    projectType: input.projectType,
    buildingUse: input.buildingType,
    projectName: input.projectName,
    country: input.projectCountry,
    city: input.projectCity,
    location: location || undefined,
    ceilingSystem: input.systemPreference,
    systemName,
    applicationZone: input.applicationZone,
    area: input.area_m2,
    ceilingHeight: input.ceilingHeight,
    complexity: `${complexity} (score ${engineeringScore})`,
    projectStage: input.projectStage,
    deadline: input.deadline,
    acousticRequirement: input.acousticRequirement,
    fireRequirement: input.fireRequirement,
    finishRequirement: input.finishRequirement,
    supplyScope: input.supplyScope,
    notes: input.notes,
    buyerRole: input.buyerRole,
    preferredContact: input.preferredContact,
    preferredLanguage: input.preferredLanguage,
    sourcePage: input.sourcePage,
    locale: input.locale,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    projectId,
    attachments,
  };

  if (honeypotTripped) {
    console.warn(`[RFQ] project=${projectId} request=${requestId} stage=honeypot outcome=suppressed`);
    return NextResponse.json(result, { status: 200 });
  }

  if (!isOdooConfigured()) {
    console.error(`[RFQ] project=${projectId} request=${requestId} stage=config outcome=missing_odoo_config`);
    return NextResponse.json(
      {
        ok: false,
        requestId,
        error: 'crm_unavailable',
        message: 'RFQ submission is temporarily unavailable. Please try again or contact AvizSazeh directly.',
        odoo: { delivered: false },
      },
      { status: 503 },
    );
  }

  try {
    const lead = await sendLeadToOdoo(leadInput);
    result.lead = {
      delivered: true,
      leadId: lead.leadId,
      attachmentFailures: lead.attachmentFailures,
      salespersonAssigned: lead.salespersonAssigned,
    };
    result.odoo = result.lead;
    console.info(
      `[RFQ] project=${projectId} request=${requestId} stage=crm.lead.create outcome=delivered leadId=${lead.leadId} attachmentFailures=${lead.attachmentFailures ?? 0}`,
    );
  } catch (error) {
    const category = error instanceof Error ? error.message : 'unknown';
    console.error(
      `[RFQ] project=${projectId} request=${requestId} stage=crm.lead.create outcome=failed category=${category}`,
    );
    return NextResponse.json(
      {
        ok: false,
        requestId,
        error: 'crm_delivery_failed',
        message: 'RFQ submission could not be registered in CRM. Please try again or contact AvizSazeh directly.',
        odoo: { delivered: false },
      },
      { status: 502 },
    );
  }

  console.info(
    `[RFQ] ${projectId} · system=${assignedSystem} · complexity=${complexity} · score=${engineeringScore} · files=${attachments.length}`,
  );

  return NextResponse.json(result, { status: 200 });
}
