'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { captureUtm } from '@/lib/analytics';

/**
 * Analytics loader. Injects whichever providers are configured via env vars and
 * captures UTM params on first paint. Renders nothing (and loads no scripts)
 * when no provider is set, so the site works identically with or without
 * analytics configured.
 *
 *   NEXT_PUBLIC_GA4_ID            — Google Analytics 4 (e.g. G-XXXXXXX)
 *   NEXT_PUBLIC_GTM_ID           — Google Tag Manager (e.g. GTM-XXXXXX)
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN — Plausible site domain (e.g. avizsazeh.ir)
 *   NEXT_PUBLIC_CLARITY_ID       — Microsoft Clarity project id
 */
export function Analytics() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    captureUtm();
  }, []);

  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {plausible && (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
          id="plausible"
        />
      )}

      {clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
    </>
  );
}
