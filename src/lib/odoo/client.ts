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

export type OdooAttachment = {
  filename: string;
  /** base64-encoded file contents (no data: prefix). */
  dataBase64: string;
  mimetype?: string;
};

export type OdooLeadInput = {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  // Project identity
  projectType?: string;
  buildingUse?: string;
  projectName?: string;
  country?: string;
  city?: string;
  location?: string;
  // Ceiling system
  ceilingSystem?: string; // chosen value ('auto' = need recommendation)
  systemName?: string; // resolved/assigned system display name
  applicationZone?: string;
  // Technical
  area?: number | string;
  ceilingHeight?: string;
  complexity?: string;
  projectStage?: string;
  deadline?: string;
  acousticRequirement?: string;
  fireRequirement?: string;
  finishRequirement?: string;
  supplyScope?: string;
  notes?: string;
  // Buyer
  buyerRole?: string;
  preferredContact?: string;
  preferredLanguage?: string;
  // Context
  sourcePage?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  projectId: string;
  /** Optional uploaded files to attach to the lead (best-effort). */
  attachments?: OdooAttachment[];
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
  /** Write x_ custom fields (requires matching Studio fields in Odoo). */
  useCustomFields: boolean;
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
    // Only send x_ custom fields when explicitly enabled — they must exist in
    // Odoo (Studio) first, otherwise crm.lead.create raises and the lead is lost.
    useCustomFields: process.env.ODOO_USE_CUSTOM_FIELDS === 'true',
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

/** Human-readable lead title: "[Country] [City] — [Building Use] — [System] — [Area m²]". */
function formatLeadName(input: OdooLeadInput): string {
  const place = [input.country, input.city].filter(Boolean).join(' ');
  const area = input.area !== undefined && input.area !== '' ? `${input.area} m²` : undefined;
  const parts = [place || undefined, input.buildingUse, input.systemName, area].filter(Boolean);
  const summary = parts.length ? parts.join(' — ') : input.projectType || 'RFQ';
  return `[AvizSazeh Website] ${summary}`;
}

function formatLeadDescription(input: OdooLeadInput): string {
  const lines: string[] = [];
  lines.push('Source: avizsazeh.ir (AvizSazeh Website RFQ)');
  lines.push('Brand: AvizSazeh');
  lines.push(`Project ID: ${input.projectId}`);
  if (input.locale) lines.push(`Locale: ${input.locale}`);
  if (input.sourcePage) lines.push(`Source page: ${input.sourcePage}`);
  lines.push('');

  const project = [
    input.projectName && `Project name: ${input.projectName}`,
    input.projectType && `Project type: ${input.projectType}`,
    input.buildingUse && `Building use: ${input.buildingUse}`,
    input.country && `Country: ${input.country}`,
    input.city && `City: ${input.city}`,
    input.location && `Location: ${input.location}`,
    input.ceilingSystem && `Requested system: ${input.ceilingSystem}`,
    input.systemName && `Assigned system: ${input.systemName}`,
    input.applicationZone && `Application zone: ${input.applicationZone}`,
    input.complexity && `Engineering complexity: ${input.complexity}`,
    input.area !== undefined && input.area !== '' && `Area: ${input.area} m²`,
    input.ceilingHeight && `Ceiling height: ${input.ceilingHeight}`,
    input.projectStage && `Project stage: ${input.projectStage}`,
    input.deadline && `Timeline: ${input.deadline}`,
    input.supplyScope && `Scope: ${input.supplyScope}`,
    input.acousticRequirement && `Acoustic requirement: ${input.acousticRequirement}`,
    input.fireRequirement && `Fire requirement: ${input.fireRequirement}`,
    input.finishRequirement && `Finish / colour: ${input.finishRequirement}`,
  ].filter((l): l is string => Boolean(l));

  if (project.length) {
    lines.push('Project Details');
    lines.push(...project);
    lines.push('');
  }

  lines.push('Contact');
  lines.push(`Name: ${input.name}`);
  if (input.company) lines.push(`Company: ${input.company}`);
  if (input.buyerRole) lines.push(`Role: ${input.buyerRole}`);
  if (input.phone) lines.push(`Phone / WhatsApp: ${input.phone}`);
  if (input.email) lines.push(`Email: ${input.email}`);
  if (input.preferredContact) lines.push(`Preferred contact: ${input.preferredContact}`);
  if (input.preferredLanguage) lines.push(`Preferred language: ${input.preferredLanguage}`);

  if (input.notes) {
    lines.push('');
    lines.push('Notes');
    lines.push(input.notes);
  }

  const utm = [
    input.utmSource && `utm_source: ${input.utmSource}`,
    input.utmMedium && `utm_medium: ${input.utmMedium}`,
    input.utmCampaign && `utm_campaign: ${input.utmCampaign}`,
  ].filter((l): l is string => Boolean(l));
  if (utm.length) {
    lines.push('');
    lines.push('Attribution');
    lines.push(...utm);
  }

  if (input.attachments?.length) {
    lines.push('');
    lines.push(`Attachments: ${input.attachments.map((a) => a.filename).join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Odoo crm.lead custom-field mapping (x_*). Only sent when ODOO_USE_CUSTOM_FIELDS
 * is enabled AND the matching Studio fields exist — otherwise create() raises.
 */
function customFieldValues(input: OdooLeadInput): Record<string, unknown> {
  const v: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (value !== undefined && value !== '' && value !== null) v[key] = value;
  };
  set('x_buyer_role', input.buyerRole);
  set('x_project_type', input.projectType);
  set('x_building_use', input.buildingUse);
  set('x_project_country', input.country);
  set('x_project_city', input.city);
  set('x_ceiling_system', input.ceilingSystem);
  set('x_application_zone', input.applicationZone);
  set('x_area_m2', input.area);
  set('x_ceiling_height_m', input.ceilingHeight);
  set('x_project_stage', input.projectStage);
  set('x_timeline', input.deadline);
  set('x_acoustic_requirement', input.acousticRequirement);
  set('x_fire_requirement', input.fireRequirement);
  set('x_finish_requirement', input.finishRequirement);
  set('x_preferred_contact_method', input.preferredContact);
  set('x_source_page', input.sourcePage);
  set('x_locale', input.locale);
  set('x_utm_source', input.utmSource);
  set('x_utm_medium', input.utmMedium);
  set('x_utm_campaign', input.utmCampaign);
  return v;
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
    name: formatLeadName(input),
    type: 'lead',
    contact_name: input.name,
    description: formatLeadDescription(input),
  };
  if (input.phone) leadValues.phone = input.phone;
  if (input.email) leadValues.email_from = input.email;
  if (input.company) leadValues.partner_name = input.company;
  if (config.teamId) leadValues.team_id = config.teamId;
  if (config.sourceId) leadValues.source_id = config.sourceId;
  if (config.useCustomFields) Object.assign(leadValues, customFieldValues(input));

  const leadId = await odooJsonRpc<number>(config, 'object', 'execute_kw', [
    config.db,
    uid,
    config.password,
    'crm.lead',
    'create',
    [leadValues],
  ]);

  // ── Attach uploaded files (best-effort) ──────────────────────────────────
  // Failures here must not discard the already-created lead.
  if (input.attachments?.length) {
    for (const file of input.attachments) {
      try {
        await odooJsonRpc<number>(config, 'object', 'execute_kw', [
          config.db,
          uid,
          config.password,
          'ir.attachment',
          'create',
          [
            {
              name: file.filename,
              datas: file.dataBase64,
              res_model: 'crm.lead',
              res_id: leadId,
              ...(file.mimetype ? { mimetype: file.mimetype } : {}),
            },
          ],
        ]);
      } catch {
        // attachment skipped; lead is still delivered
      }
    }
  }

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
