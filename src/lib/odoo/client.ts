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
  /** Salesperson to own AvizSazeh-website leads — numeric res.users id. */
  salespersonId?: number;
  /** …or the salesperson login, resolved to an id at lead-creation time. */
  salespersonLogin?: string;
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
    salespersonId: numberFromEnv(process.env.ODOO_SALESPERSON_ID),
    salespersonLogin: process.env.ODOO_SALESPERSON_LOGIN?.trim() || undefined,
  };
}

/**
 * Resolve the configured salesperson to a res.users id. Prefers an explicit
 * numeric id; otherwise looks the login up (best-effort — returns undefined if
 * the user does not exist yet or the lookup fails, so lead creation never
 * breaks just because the salesperson hasn't been created in Odoo).
 */
async function resolveSalespersonId(
  config: OdooConfig,
  uid: number,
): Promise<number | undefined> {
  if (config.salespersonId) return config.salespersonId;
  if (!config.salespersonLogin) return undefined;
  try {
    const ids = await odooJsonRpc<number[]>(config, 'object', 'execute_kw', [
      config.db,
      uid,
      config.password,
      'res.users',
      'search',
      [[['login', '=', config.salespersonLogin]]],
      { limit: 1 },
    ]);
    return Array.isArray(ids) && ids.length ? ids[0] : undefined;
  } catch {
    return undefined;
  }
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

  // Assign the dedicated AvizSazeh-website salesperson AFTER creation, as a
  // best-effort follow-up write. The integration user can only create leads it
  // owns (or that are unassigned), so assigning ownership to another user can
  // raise AccessError — which must NOT discard an already-created lead. If the
  // write fails, the lead is still delivered (in its team) and assignment can
  // be handled Odoo-side (elevated rights on the integration user, or a team
  // automation rule). See ODOO_SALESPERSON_LOGIN in .env.example.
  const salespersonId = await resolveSalespersonId(config, uid);
  if (salespersonId) {
    try {
      await odooJsonRpc<boolean>(config, 'object', 'execute_kw', [
        config.db,
        uid,
        config.password,
        'crm.lead',
        'write',
        [[leadId], { user_id: salespersonId }],
      ]);
    } catch {
      // Lead already created & delivered; salesperson assignment deferred.
    }
  }

  return { configured: true, leadId };
}
