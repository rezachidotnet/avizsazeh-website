/**
 * Odoo CRM integration — JSON-RPC.
 *
 * Mirrors the proven SIPANELCO implementation (lib/rfq/odoo.ts): authenticate via
 * `common.login`, then create a `crm.lead` via `object.execute_kw`. Targets the same
 * Odoo instance/DB so AvizSazeh leads land in the same CRM, tagged as AvizSazeh.
 *
 * No hardcoded secrets — all connection values come from the environment:
 *   ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD
 *   ODOO_CRM_TEAM_ID, ODOO_CRM_SOURCE_ID (optional)
 */

export type OdooLeadInput = {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  projectType?: string;
  area?: number | string;
  systemName?: string;
  complexity?: string;
  location?: string;
  country?: string;
  deadline?: string;
  requirements?: string;
  projectStage?: string;
  hasDrawings?: string;
  needsMep?: string;
  projectChallenge?: string;
  projectId: string;
};

export type OdooLeadResult = { configured: boolean; leadId?: number };

type OdooConfig = {
  url: string;
  db: string;
  username: string;
  password: string;
  teamId?: number;
  sourceId?: number;
};

type OdooJsonRpcResponse<T> = {
  result?: T;
  error?: { code: number; message: string; data?: unknown };
};

function numberFromEnv(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getOdooConfig(): OdooConfig | null {
  const url = process.env.ODOO_URL;
  const db = process.env.ODOO_DB;
  const username = process.env.ODOO_USERNAME;
  const password = process.env.ODOO_PASSWORD;

  if (!url || !db || !username || !password) return null;

  return {
    url: url.replace(/\/$/, ''),
    db,
    username,
    password,
    teamId: numberFromEnv(process.env.ODOO_CRM_TEAM_ID),
    sourceId: numberFromEnv(process.env.ODOO_CRM_SOURCE_ID),
  };
}

/** True when the Odoo JSON-RPC transport is fully configured. */
export function isOdooConfigured(): boolean {
  return getOdooConfig() !== null;
}

async function odooJsonRpc<T>(
  config: OdooConfig,
  service: string,
  method: string,
  args: unknown[],
): Promise<T> {
  const response = await fetch(`${config.url}/jsonrpc`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: { service, method, args },
      id: Date.now(),
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error('ODOO_HTTP_FAILED');
  }

  const payload = (await response.json()) as OdooJsonRpcResponse<T>;
  if (payload.error) {
    throw new Error('ODOO_RPC_FAILED');
  }

  return payload.result as T;
}

function formatLeadDescription(input: OdooLeadInput): string {
  const lines: string[] = [];
  lines.push('Source: avizsazeh.ir (AvizSazeh Website RFQ)');
  lines.push('Brand: AvizSazeh');
  lines.push(`Project ID: ${input.projectId}`);
  lines.push('');

  const project = [
    input.projectType && `Project type: ${input.projectType}`,
    input.systemName && `Assigned system: ${input.systemName}`,
    input.complexity && `Engineering complexity: ${input.complexity}`,
    input.area !== undefined && input.area !== '' && `Area: ${input.area} m²`,
    input.location && `Location: ${input.location}`,
    input.country && `Country: ${input.country}`,
    input.projectStage && `Project stage: ${input.projectStage}`,
    input.hasDrawings && `Architectural drawings: ${input.hasDrawings}`,
    input.needsMep && `Lighting/MEP coordination: ${input.needsMep}`,
    input.deadline && `Timeline: ${input.deadline}`,
  ].filter((l): l is string => Boolean(l));

  if (project.length) {
    lines.push('Project Details');
    lines.push(...project);
    lines.push('');
  }

  lines.push('Contact');
  lines.push(`Name: ${input.name}`);
  if (input.company) lines.push(`Company: ${input.company}`);
  if (input.phone) lines.push(`Phone: ${input.phone}`);
  if (input.email) lines.push(`Email: ${input.email}`);

  if (input.requirements) {
    lines.push('');
    lines.push('Technical requirements');
    lines.push(input.requirements);
  }

  if (input.projectChallenge) {
    lines.push('');
    lines.push('Project challenge');
    lines.push(input.projectChallenge);
  }

  return lines.join('\n');
}

/** Create a crm.lead in Odoo for an AvizSazeh RFQ. Throws ODOO_* on transport/auth failure. */
export async function sendLeadToOdoo(input: OdooLeadInput): Promise<OdooLeadResult> {
  const config = getOdooConfig();
  if (!config) return { configured: false };

  const uid = await odooJsonRpc<number>(config, 'common', 'login', [
    config.db,
    config.username,
    config.password,
  ]);
  if (!uid) throw new Error('ODOO_AUTH_FAILED');

  const leadValues: Record<string, unknown> = {
    name: `[AvizSazeh Website] ${input.projectType || 'RFQ'} - ${input.name}`,
    type: 'lead',
    contact_name: input.name,
    description: formatLeadDescription(input),
  };
  if (input.phone) leadValues.phone = input.phone;
  if (input.email) leadValues.email_from = input.email;
  if (input.company) leadValues.partner_name = input.company;
  if (config.teamId) leadValues.team_id = config.teamId;
  if (config.sourceId) leadValues.source_id = config.sourceId;

  const leadId = await odooJsonRpc<number>(config, 'object', 'execute_kw', [
    config.db,
    uid,
    config.password,
    'crm.lead',
    'create',
    [leadValues],
  ]);

  return { configured: true, leadId };
}
