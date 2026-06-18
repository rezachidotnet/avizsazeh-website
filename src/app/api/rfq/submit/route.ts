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
import { isOdooConfigured, sendLeadToOdoo, type OdooLeadPayload } from '@/lib/odoo/client';

export const runtime = 'nodejs';

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
  let body: Partial<RfqInput>;
  try {
    body = (await request.json()) as Partial<RfqInput>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

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
  const message = [
    input.buildingType && `Building: ${input.buildingType}`,
    `Assigned system: ${systemName}`,
    `Complexity: ${complexity} (score ${engineeringScore})`,
    input.location && `Location: ${input.location}`,
    input.deadline && `Timeline: ${input.deadline}`,
    input.technicalRequirements && `Requirements: ${input.technicalRequirements}`,
    `Project ID: ${projectId}`,
  ]
    .filter(Boolean)
    .join('\n');

  const odooPayload: OdooLeadPayload = {
    name: input.contactName || `RFQ ${projectId}`,
    phone: input.phone,
    company: input.company,
    project_type: input.projectType,
    area: input.area_m2,
    message,
    country: deriveCountry(input.location),
  };

  if (isOdooConfigured()) {
    try {
      await sendLeadToOdoo(odooPayload);
      result.lead = { delivered: true };
      console.info(`[RFQ] ${projectId} · lead delivered to Odoo`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'unknown';
      result.lead = { delivered: false, error: msg };
      console.error(`[RFQ] ${projectId} · Odoo lead failed: ${msg}`, { odooPayload });
    }
  } else {
    console.info(`[RFQ] ${projectId} · Odoo not configured (log-only)`, { odooPayload });
  }

  console.info(
    `[RFQ] ${projectId} · system=${assignedSystem} · complexity=${complexity} · score=${engineeringScore}`,
  );

  return NextResponse.json(result, { status: 200 });
}
