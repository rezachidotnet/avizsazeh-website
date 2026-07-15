'use client';

import { useEffect } from 'react';
import { captureUtm } from '@/lib/analytics';
import { analyticsConfig } from '@/lib/analytics-config';
import { useConsentSnapshot } from '@/components/consent/ConsentProvider';

/**
 * Analytics loader. Selects exactly one transport from public env vars and
 * waits for analytics consent before loading any transport. When consent is
 * absent or denied, it renders nothing and loads no scripts.
 *
 *   NEXT_PUBLIC_GTM_ID            — Google Tag Manager (e.g. GTM-XXXXXX)
 */
export function Analytics() {
  const snapshot = useConsentSnapshot();

  useEffect(() => {
    if (analyticsConfig.transport === 'disabled' || !snapshot.analyticsGranted) return;
    captureUtm();
  }, [snapshot.analyticsGranted]);

  useEffect(() => {
    if (analyticsConfig.transport !== 'gtm' || !analyticsConfig.gtmId || !snapshot.analyticsGranted) {
      return;
    }
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('gtm-loader');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'gtm-loader';
    script.async = true;
    script.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');`;
    document.head.appendChild(script);
  }, [snapshot.analyticsGranted]);

  if (analyticsConfig.transport === 'disabled' || !snapshot.analyticsGranted) return null;

  return null;
}
