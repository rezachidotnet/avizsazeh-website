import { NextResponse } from 'next/server';
import {
  classifySystem,
  makeProjectId,
  scoreComplexity,
  validateRfq,
  type RfqInput,
  type RfqResult,
} from '@/lib/rfq';

export const runtime = 'nodejs';

/**
 * RFQ Engine — structured engineering project definition system.
 * Pipeline: validate → classify system → score complexity → generate ID → route.
 * In log-only mode (no notify transport configured) the submission is logged
 * and acknowledged; wiring an email/CRM transport is an env-driven add-on.
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
    contact: body.contact ? String(body.contact).trim() : undefined,
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

  // Routing to engineering workflow. Replace with email/CRM transport when configured.
  const notify = process.env.RFQ_NOTIFY_EMAIL;
  console.info(
    `[RFQ] ${projectId} · system=${assignedSystem} · complexity=${complexity} · score=${engineeringScore}` +
      (notify ? ` · notify=${notify}` : ' · log-only'),
    { input },
  );

  return NextResponse.json(result, { status: 200 });
}
