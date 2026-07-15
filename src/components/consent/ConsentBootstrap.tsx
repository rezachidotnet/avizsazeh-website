import {
  CONSENT_SCHEMA_VERSION,
  toGoogleConsentState,
  type ConsentChoice,
} from '@/lib/consent';

function serializeConsent(choice: ConsentChoice | null): string {
  return JSON.stringify(choice);
}

export function ConsentBootstrap({
  initialConsent,
}: {
  initialConsent: ConsentChoice | null;
}) {
  const initialGoogleConsent = toGoogleConsentState(initialConsent);
  const payload = serializeConsent(initialConsent);

  return (
    <script
      id="avizsazeh-consent-bootstrap"
      dangerouslySetInnerHTML={{
        __html: `
        (function () {
          var initialConsent = ${payload};
          var defaultConsent = ${JSON.stringify({
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            security_storage: 'granted',
          })};
          var initialGoogleConsent = ${JSON.stringify(initialGoogleConsent)};
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
          window.__avzConsentSnapshot = initialConsent;
          window.__avzConsentRevision = 0;
          window.gtag('consent', 'default', defaultConsent);
          if (initialConsent && initialConsent.version === ${CONSENT_SCHEMA_VERSION}) {
            window.gtag('consent', 'update', initialGoogleConsent);
          }
        })();
      `,
      }}
    />
  );
}
