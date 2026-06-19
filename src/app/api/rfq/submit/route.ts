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
import { isOdooConfigured, sendLeadToOdoo, type OdooLeadInput } from '@/lib/odoo/client';
import { rateLimit, clientIpFrom } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Basic spam throttle: max submissions per IP per window. Best-effort
// (per-instance) — see lib/rate-limit.ts.
const RFQ_RATE_LIMIT = 5;
const RFQ_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** Derive a best-effort country from a "city / country" location string. */
function deriveCountry(location?: string): string {
  if (!location) return 'unknown';
  const tail = location.split(/[,/|-]/).pop()?.trim();
  return tail || location.trim() || 'unknown';
}

/**
 * RFQ Engine — structured engineering project definition + CRM lead.
 * Pipeline: validate → classify system → score complexity → generate ID →
 * push lead to Odoo CRM (best-effort) → return engineering result.
 *
 * CRM delivery is non-blocking: a transient Odoo failure must not discard the
 * user's submission or break the success screen. The outcome is reported in
 * `result.lead` and logged for follow-up.
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

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const body = raw as Partial<RfqInput>;

  // ── Honeypot ─────────────────────────────────────────────────────────────
  // `website` is a hidden, off-screen field no human fills. If it carries a
  // value the request is almost certainly a bot: accept it silently (so the
  // bot sees a normal 200) but never create a CRM lead.
  const honeypotTripped =
    typeof raw.website === 'string' && raw.website.trim().length > 0;

  const input: RfqInput = {
    projectType: String(body.projectType ?? '').trim(),
    buildingType: body.buildingType ? String(body.buildingType).trim() : undefined,
    area_m2: Number(body.area_m2),
    systemPreference: String(body.systemPreference ?? 'auto').trim(),
    location: body.location ? String(body.location).trim() : undefined,
    technicalRequirements: body.technicalRequirements
      ? String(body.technicalRequirements).trim()
      : undefined,
    deadline: body.deadline ? String(body.deadline).trim() : undefined,
    projectStage: body.projectStage ? String(body.projectStage).trim() : undefined,
    hasDrawings: body.hasDrawings ? String(body.hasDrawings).trim() : undefined,
    needsMep: body.needsMep ? String(body.needsMep).trim() : undefined,
    projectChallenge: body.projectChallenge
      ? String(body.projectChallenge).trim()
      : undefined,
    contactName: body.contactName ? String(body.contactName).trim() : undefined,
    company: body.company ? String(body.company).trim() : undefined,
    phone: body.phone ? String(body.phone).trim() : undefined,
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
  const leadInput: OdooLeadInput = {
    name: input.contactName || `RFQ ${projectId}`,
    phone: input.phone,
    company: input.company,
    projectType: input.projectType,
    area: input.area_m2,
    systemName,
    complexity: `${complexity} (score ${engineeringScore})`,
    location: input.location,
    country: deriveCountry(input.location),
    deadline: input.deadline,
    requirements: input.technicalRequirements,
    projectStage: input.projectStage,
    hasDrawings: input.hasDrawings,
    needsMep: input.needsMep,
    projectChallenge: input.projectChallenge,
    projectId,
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
    }
  } else {
    console.info(`[RFQ] ${projectId} · Odoo not configured (log-only)`);
  }

  console.info(
    `[RFQ] ${projectId} · system=${assignedSystem} · complexity=${complexity} · score=${engineeringScore}`,
  );

  return NextResponse.json(result, { status: 200 });
}
