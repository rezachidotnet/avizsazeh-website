export type AnalyticsTransport = 'direct_ga4' | 'gtm' | 'disabled';

const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? '';
const rawGa4Id = process.env.NEXT_PUBLIC_GA4_ID?.trim() ?? '';

function validGtmId(value: string): string | undefined {
  return /^GTM-[A-Z0-9-]+$/i.test(value) ? value : undefined;
}

function validGa4Id(value: string): string | undefined {
  return /^G-[A-Z0-9]+$/i.test(value) ? value : undefined;
}

const validGtm = validGtmId(rawGtmId);
const validGa4 = validGa4Id(rawGa4Id);

const transport: AnalyticsTransport = validGtm
  ? 'gtm'
  : validGa4
    ? 'direct_ga4'
    : 'disabled';

export const analyticsConfig: {
  transport: AnalyticsTransport;
  gtmId?: string;
  ga4Id?: string;
  hasBothPublicIds: boolean;
} = {
  transport,
  gtmId: transport === 'gtm' ? validGtm : undefined,
  ga4Id: transport === 'direct_ga4' ? validGa4 : undefined,
  hasBothPublicIds: Boolean(validGtm && validGa4),
};
