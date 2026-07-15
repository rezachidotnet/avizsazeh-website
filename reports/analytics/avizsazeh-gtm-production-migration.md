# AvizSazeh GTM Production Migration

## 1. Summary
Direct GA4 loading has been removed from runtime code. The app now uses one analytics transport only: GTM when `NEXT_PUBLIC_GTM_ID` is valid, otherwise disabled. Consent gating remains in place and application events still flow through the centralized analytics module.
The production issue reported by Tag Assistant was that the GTM container was not being detected after analytics consent. The loader now inserts the GTM bootstrap directly into `document.head` when consent changes to granted, which removes the late-`next/script` mount ambiguity.

## 2. Previous State
- Direct GA4 loader and direct `window.gtag("event", ...)` dispatch existed in `src/components/analytics/Analytics.tsx` and `src/lib/analytics.ts`.
- `NEXT_PUBLIC_GA4_ID` was present in Vercel Production before migration.

## 3. Final State
- Runtime transport: `gtm | disabled`.
- Direct GA4 runtime code: removed.
- Public GTM ID is configured through `NEXT_PUBLIC_GTM_ID`.
- Consent bootstrap still applies Google consent defaults before analytics can load.

## 4. Source Files Changed
- [src/lib/analytics-config.ts](../../src/lib/analytics-config.ts:1)
- [src/lib/analytics.ts](../../src/lib/analytics.ts:1)
- [src/components/analytics/Analytics.tsx](../../src/components/analytics/Analytics.tsx:1)
- [src/components/consent/ConsentBootstrap.tsx](../../src/components/consent/ConsentBootstrap.tsx:1)
- [src/lib/consent.ts](../../src/lib/consent.ts:1)
- [.env.example](../../.env.example:34)

## 5. Removed Direct GA4 Code
- Removed `direct_ga4` transport selection and GA4 fallback logic from `src/lib/analytics-config.ts`.
- Removed direct GA4 event mapping, queueing, readiness events, and `window.gtag("event", ...)` dispatch from `src/lib/analytics.ts`.
- Removed the `gtag.js?id=...` loader and `ga4-init` script from `src/components/analytics/Analytics.tsx`.
- Removed `NEXT_PUBLIC_GA4_ID` from `.env.example`.

## 6. GTM Loader Implementation
- GTM loads only when analytics consent is granted and `NEXT_PUBLIC_GTM_ID` is valid.
- Loader source: `src/components/analytics/Analytics.tsx:19-36`.
- Noscript iframe remains conditional in the locale layout and uses the validated GTM ID.
- The loader is a single DOM-inserted bootstrap; there is no second GTM snippet.
- The root cause of the Tag Assistant miss was the previous consent-gated `next/script` mount path. The current implementation inserts the bootstrap directly into `document.head` once consent is granted, which is the safer path for late activation.

## 7. Consent Behavior
- Consent bootstrap still sets Google consent defaults and updates consent state via `window.gtag("consent", ...)`.
- `window.gtag` is retained only for consent commands.
- `trackEvent()` now returns early unless analytics consent is granted and the transport is GTM.

## 8. Page-View Behavior
- `PageViewTracker` remains the only application page-view source.
- It emits explicit `page_view` events with `page_path`, `page_language`, `page_title`, `page_location`, and `page_referrer`.
- Route deduplication is module-scoped and keyed by `history.state.idx + pathname`.

## 9. RFQ Event Behavior
- Canonical success event remains `rfq_submit`.
- `rfq_submit_success` and direct GA4 `generate_lead` dispatch were removed from runtime.
- `rfq_submit_error`, `rfq_start`, `rfq_step_complete`, `rfq_field_error`, `rfq_file_upload_started`, and `rfq_file_upload_completed` still use the centralized transport.

## 10. Vercel Variables Removed
- `NEXT_PUBLIC_GA4_ID` was removed from Production.
- It was not present in Preview or Development during verification.

## 11. Vercel Variables Added
- `NEXT_PUBLIC_GTM_ID=GTM-KKXLZFLG` was added to Production, Preview, and Development.
- The variable is public browser configuration, not a secret.

## 12. Vercel Environments Changed
- Team: `rezachidotnets-projects`
- Project: `avizsazeh-website`
- Production deployment was aliased to `https://www.avizsazeh.ir` after redeploy.

## 13. Deployment Performed
- Deployment succeeded on the second attempt.
- Production deployment URL: `https://avizsazeh-website-kpq3u3y4m-rezachidotnets-projects.vercel.app`
- Alias updated to `https://www.avizsazeh.ir`
- The production deployment was built after `NEXT_PUBLIC_GTM_ID` was present in all three Vercel environments.

## 14. Production HTML Verification
- Initial HTML without consent contains the consent bootstrap only and does not include direct `gtag.js`.
- With the consent cookie set, the HTML includes the GTM noscript iframe and still does not include direct `gtag.js`.

## 15. Production Network / Bundle Verification
- Browser automation was not available in this environment, so live request capture from a rendered browser could not be completed.
- Deployed JS chunk scan showed:
  - `window.gtag` and `dataLayer.push` only in the centralized consent/analytics chunk.
  - `document.createElement("script")` / `document.head.appendChild(script)` GTM bootstrap code in the shipped loader chunk.
  - `googletagmanager.com/gtm.js` only in the GTM loader chunk.
  - No `googletagmanager.com/gtag/js`, `direct_ga4`, `ga4-init`, or `rfq_submit_success` in shipping runtime chunks.
  - Current live chunk: `/_next/static/chunks/8359-aee34af895cce8bb.js`.

## 16. GTM Container Verification Status
- GTM container contents were not independently inspected from this repository.
- The app is prepared to load GTM, but GA4 collection through GTM still depends on container configuration and publish state.

## 17. GA4-through-GTM Verification Status
- Not independently verified here.
- App runtime no longer loads GA4 directly, so collection depends entirely on the GTM container.
- After consent, the published bundle contains the GTM bootstrap code that should issue exactly one `gtm.js` request per page load.
- Tag Assistant connection itself was not browser-verified in this environment; if it still reports `GTM-KKXLZFLG not found`, the remaining issue is likely in that browser session, preview state, or blocker state rather than in the application code path.

## 18. Risks
- If the GTM container is not configured with GA4 tags, analytics collection will not occur even though the app now loads GTM.
- Live browser-network capture and Tag Assistant reconnection were not available in this run, so the remaining runtime assertion is based on source and bundle evidence rather than a fresh browser session.

## 19. Rollback Procedure
1. Restore the previous source revision.
2. Re-add `NEXT_PUBLIC_GA4_ID` in Vercel.
3. Remove or disable `NEXT_PUBLIC_GTM_ID`.
4. Redeploy.
5. Verify direct `gtag.js` and direct GA4 page views return.
