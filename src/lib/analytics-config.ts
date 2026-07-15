export type AnalyticsTransport = 'gtm' | 'disabled';

const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? '';

function validGtmId(value: string): string | undefined {
  return /^GTM-[A-Z0-9-]+$/i.test(value) ? value : undefined;
}

const validGtm = validGtmId(rawGtmId);
const transport: AnalyticsTransport = validGtm ? 'gtm' : 'disabled';

export const analyticsConfig: {
  transport: AnalyticsTransport;
  gtmId?: string;
  hasPublicGtmId: boolean;
} = {
  transport,
  gtmId: transport === 'gtm' ? validGtm : undefined,
  hasPublicGtmId: Boolean(validGtm),
};
