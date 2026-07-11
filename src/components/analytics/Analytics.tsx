'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { captureUtm, markDirectGa4Ready } from '@/lib/analytics';
import { analyticsConfig } from '@/lib/analytics-config';
import { useConsentSnapshot } from '@/components/consent/ConsentProvider';

let warnedAboutDualIds = false;

/**
 * Analytics loader. Selects exactly one transport from public env vars and
 * waits for analytics consent before loading any transport. When consent is
 * absent or denied, it renders nothing and loads no scripts.
 *
 *   NEXT_PUBLIC_GA4_ID            — Google Analytics 4 (e.g. G-XXXXXXX)
 *   NEXT_PUBLIC_GTM_ID           — Google Tag Manager (e.g. GTM-XXXXXX)
 */
export function Analytics() {
  const snapshot = useConsentSnapshot();

  useEffect(() => {
    function onGa4Ready() {
      markDirectGa4Ready();
    }
    window.addEventListener('avz:ga4-ready', onGa4Ready);
    if (window.__avzGa4Ready) onGa4Ready();
    if (
      process.env.NODE_ENV === 'development' &&
      analyticsConfig.hasBothPublicIds &&
      !warnedAboutDualIds
    ) {
      warnedAboutDualIds = true;
      // eslint-disable-next-line no-console
      console.warn(
        '[analytics] Both NEXT_PUBLIC_GTM_ID and NEXT_PUBLIC_GA4_ID are set; GTM mode was selected and direct GA4 is disabled.',
      );
    }
    return () => window.removeEventListener('avz:ga4-ready', onGa4Ready);
  }, []);

  useEffect(() => {
    if (analyticsConfig.transport === 'disabled' || !snapshot.analyticsGranted) return;
    captureUtm();
  }, [snapshot.analyticsGranted]);

  if (analyticsConfig.transport === 'disabled' || !snapshot.analyticsGranted) return null;

  return (
    <>
      {analyticsConfig.transport === 'gtm' && analyticsConfig.gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');`}
        </Script>
      ) : null}

      {analyticsConfig.transport === 'direct_ga4' && analyticsConfig.ga4Id ? (
        <>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('js',new Date());gtag('config','${analyticsConfig.ga4Id}',{anonymize_ip:true,send_page_view:false});window.__avzGa4Ready=true;window.dispatchEvent(new Event('avz:ga4-ready'));`}
          </Script>
        </>
      ) : null}
    </>
  );
}
