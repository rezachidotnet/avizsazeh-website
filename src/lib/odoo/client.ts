/**
 * Odoo CRM integration layer.
 * No hardcoded secrets — base URL and token come from the environment only.
 * Endpoint + auth + payload schema are defined by the AvizSazeh Odoo instance
 * (https://odoo.sipanel.ir): POST {ODOO_BASE_URL}/api/crm/leads with a Bearer token.
 */

export type OdooLeadPayload = {
  name: string;
  phone?: string;
  company?: string;
  project_type?: string;
  area?: number | string;
  message?: string;
  country?: string;
};

export type OdooLeadResult = unknown;

/** True when the Odoo transport is configured (base URL present). */
export function isOdooConfigured(): boolean {
  return Boolean(process.env.ODOO_BASE_URL);
}

export async function sendLeadToOdoo(
  payload: OdooLeadPayload,
): Promise<OdooLeadResult> {
  const baseUrl = process.env.ODOO_BASE_URL;
  if (!baseUrl) {
    throw new Error('ODOO_BASE_URL is not defined');
  }

  const token = process.env.ODOO_API_TOKEN ?? '';

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/crm/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    // CRM submission must never hang the request thread indefinitely.
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Odoo API Error ${response.status}: ${text}`);
  }

  return response.json().catch(() => ({}));
}
