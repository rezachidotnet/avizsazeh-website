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
    if (!ALLOWED_EXT.has(extOf(file.name))) {
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
 * push lead + attachments to Odoo CRM (best-effort) → return engineering result.
 *
 * CRM delivery is non-blocking: a transient Odoo failure must not discard the
 * user's submission or break the success screen. The outcome is reported in
 * `result.lead`; on failure the full lead is logged as a recoverable backup.
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

  const result: RfqResult = {
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
    // Spam: skip CRM entirely, return a normal-looking result.
    console.warn(`[RFQ] ${projectId} · honeypot tripped (ip ${ip}) — lead suppressed`);
  } else if (isOdooConfigured()) {
    try {
      const lead = await sendLeadToOdoo(leadInput);
      result.lead = { delivered: true, leadId: lead.leadId };
      console.info(`[RFQ] ${projectId} · lead delivered to Odoo (id ${lead.leadId})`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'unknown';
      result.lead = { delivered: false, error: msg };
      console.error(`[RFQ] ${projectId} · Odoo lead failed: ${msg}`);
      // Recoverable backup: log the full lead so it is never silently lost.
      // A follow-up can wire RFQ_NOTIFICATION_EMAIL to an SMTP/webhook sender.
      logBackupLead(projectId, leadInput);
    }
  } else {
    console.info(`[RFQ] ${projectId} · Odoo not configured (log-only)`);
    logBackupLead(projectId, leadInput);
  }

  console.info(
    `[RFQ] ${projectId} · system=${assignedSystem} · complexity=${complexity} · score=${engineeringScore} · files=${attachments.length}`,
  );

  return NextResponse.json(result, { status: 200 });
}

/** Structured, recoverable log of a lead that could not be delivered to Odoo. */
function logBackupLead(projectId: string, lead: OdooLeadInput): void {
  const notify = process.env.RFQ_NOTIFICATION_EMAIL;
  // Strip file bytes from the backup log — keep filenames only.
  const { attachments, ...rest } = lead;
  const safe = {
    ...rest,
    attachmentNames: attachments?.map((a) => a.filename) ?? [],
  };
  console.warn(
    `[RFQ][BACKUP] ${projectId} · notify=${notify ?? 'unset'} · ${JSON.stringify(safe)}`,
  );
}
