# AvizSazeh Analytics Duplicate Audit

Audit date: 2026-07-15  
Production: https://www.avizsazeh.ir  
Expected GTM container: `GTM-KKXLZFLG`  
Expected GA4 measurement ID in GTM: `G-QD70DM5MEJ`

## 1. Executive Summary

The duplicate was reproduced in normal production, without Tag Assistant Preview.

Confirmed duplicate category:

`C - automatic Google Tag page view plus explicit page_view`

The application emits exactly one `dataLayer` `page_view` for the current page, but the published GTM container sends two GA4 `page_view` requests on initial consent-granted load:

1. The Google Tag fires on `gtm.init` and sends an automatic GA4 `page_view`.
2. The explicit GTM GA4 Event tag sends `page_view` from the application `dataLayer` event.

This is not a duplicate GTM container loader. Production loaded one `gtm.js` script, created one `gtm.start` entry, and made one `gtm.js` network request per document.

## 2. Expected Architecture Check

Intended final architecture:

`Application -> one GTM loader -> GTM-KKXLZFLG -> one Google Tag using G-QD70DM5MEJ -> explicit application page_view`

Confirmed from source:

| Requirement | Status | Evidence |
| --- | --- | --- |
| Runtime transport is `gtm | disabled` | confirmed | `src/lib/analytics-config.ts` only reads `NEXT_PUBLIC_GTM_ID` |
| Direct GA4 loader absent | confirmed | no runtime `googletagmanager.com/gtag/js` in source |
| App does not load `gtag/js?id=G-QD70DM5MEJ` | confirmed | source and server HTML have no direct loader |
| App events use centralized `dataLayer.push()` | confirmed | `src/lib/analytics.ts:90-123` |
| `PageViewTracker` is the only app page-view source | confirmed | `src/components/analytics/PageViewTracker.tsx:44-69` |
| RFQ success sends only `rfq_submit` | confirmed | `src/components/rfq/RfqEngine.tsx:200` |
| GTM maps `rfq_submit` to `generate_lead` | confirmed in published container | public `gtm.js` tag `tag_id:22`, trigger predicate `rfq_submit` |

## 3. Vercel Environment Variables

Verified with authenticated Vercel CLI using `vercel whoami` and `vercel env ls`. Only presence was inspected.

| Variable | Production | Preview | Development | Duplicate risk |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_GTM_ID` | present | present | present | low |
| `NEXT_PUBLIC_GA4_ID` | absent | absent | absent | none |

`NEXT_PUBLIC_GA4_ID` should not be restored.

## 4. Runtime Source Findings

Search terms included `GTM-`, `googletagmanager.com/gtm.js`, `googletagmanager.com/ns.html`, `googletagmanager.com/gtag/js`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `dataLayer.push`, `window.gtag`, `gtm.start`, `page_view`, `historyChange`, and `send_page_view`.

| Item | Count | Evidence |
| --- | ---: | --- |
| GTM JavaScript loader implementations | 1 | `src/components/analytics/Analytics.tsx:23-36` |
| GTM noscript iframe implementations | 1 | `src/app/[locale]/layout.tsx:134-144` |
| Code paths that can append `gtm.js` | 1 | `document.head.appendChild(script)` |
| Application page-view producers | 1 | `PageViewTracker` |
| Centralized event transport | 1 | `window.dataLayer.push({ event: name, ...payload })` |
| Direct GA4 loaders | 0 | no runtime `gtag/js` source |
| Runtime `NEXT_PUBLIC_GA4_ID` references | 0 | source search |

The RFQ success path emits `rfq_submit` only. No runtime `rfq_submit_success` or direct app-side `generate_lead` dispatch remains.

## 5. GTM DOM Insertion Logic

`src/components/analytics/Analytics.tsx` inserts the GTM bootstrap only when transport is `gtm`, a GTM ID is configured, and analytics consent is granted.

Guard coverage:

| Case | Protected? | Evidence |
| --- | --- | --- |
| Initial granted consent | yes | loader effect runs once and checks `#gtm-loader` |
| Consent denied -> granted | yes | first grant appends script |
| React Strict Mode effect re-execution | yes | existing element guard prevents second insertion |
| Component remount | yes | existing element guard is document-scoped |
| Locale navigation | yes | existing element remains in document |
| Route-group navigation | yes | existing element remains in document |
| Consent provider rerender | yes | dependency is `snapshot.analyticsGranted`; guard remains |
| Reopening/resaving same consent | yes | `updateConsent()` returns current choice if unchanged |
| Browser back/forward | yes | existing element remains in document |
| Existing GTM script already present | partially | checks `id="gtm-loader"` only |

Stable guards present:

- script element ID: `gtm-loader`

Stable guards absent:

- script `src` selector
- module-level loaded flag
- `window.google_tag_manager['GTM-KKXLZFLG']` container-state check

Live production evidence after first analytics grant:

| Metric | Count |
| --- | ---: |
| `script[src*="googletagmanager.com/gtm.js"]` | 1 |
| `performance` `gtm.js` resources | 1 |
| `dataLayer` `event === "gtm.js"` | 1 |
| `dataLayer` entries with `gtm.start` | 1 |

One consent update did not produce two `gtm.start` entries, two script elements, or two `gtm.js` requests.

## 6. PageViewTracker Duplication

`PageViewTracker` behavior:

| Aspect | Finding |
| --- | --- |
| Effect dependencies | `[consent.analyticsGranted, consent.revision, pathname]` |
| Route key | `${window.history.state.idx}:${pathname}` when `idx` is numeric; otherwise `initial:${pathname}` |
| Deduplication state | module-level `lastSentRouteKey` and `lastPageLocation` |
| Initial consent-grant behavior | sends one current-page `page_view` |
| Saved-consent initial load | sends one current-page `page_view` |
| Pathname change | sends one new `page_view` per route key |
| Locale change | sends one `page_view` for the new pathname |
| History back/forward | sends one `page_view` when route key changes |
| Consent withdrawn | resets dedupe state |
| Consent re-granted | can send one current-page `page_view` again by design |
| Strict Mode/remount | same route key is suppressed |

Observed production flow with consent granted:

| Flow | Expected app `dataLayer` `page_view` | Observed app `dataLayer` `page_view` | GA4 `page_view` request count | Duplicate? | Suspected source |
| --- | ---: | ---: | ---: | --- | --- |
| Initial load after saved consent | 1 | 1 | 2 | yes | Google Tag auto page view + explicit GA4 event tag |
| First consent grant | 1 | 1 | 2 | yes | Google Tag auto page view + explicit GA4 event tag |
| Homepage -> systems | 1 | 1 | 0 observed in capture window | no duplicate reproduced | GTM event tag did not emit a captured request in this sample |
| Systems -> system detail | 1 | 1 | 0 observed in capture window | no duplicate reproduced | no duplicate evidence |
| System detail -> contact | 1 | 1 | 0 observed in capture window | no duplicate reproduced | no duplicate evidence |
| Contact -> RFQ | 1 | 1 | 0 observed in capture window | no duplicate reproduced | no duplicate evidence |
| Persian -> English | 1 | 1 | not conclusively captured | not concluded | direct click target was not a clean locale-only switch in headless run |
| Browser back | 1 | 1 | 0 observed in capture window | no duplicate reproduced | no duplicate evidence |
| Browser forward | 1 | 1 | 0 observed in capture window | no duplicate reproduced | no duplicate evidence |

Conclusion: app-side `PageViewTracker` did not produce duplicate `dataLayer` page views in the tested flows.

## 7. Production HTML and Rendered DOM

Server-rendered HTML checks:

| Route | Consent cookie | Actual noscript iframe in HTML | `gtm.js` in HTML | `gtag/js` in HTML |
| --- | --- | ---: | ---: | ---: |
| `/` | absent | 0 | 0 | 0 |
| `/` | present | 1 | 0 | 0 |
| `/contact` | present | 1 | 0 | 0 |
| `/rfq` | present | 1 | 0 | 0 |
| `/en` | present | 1 | 0 | 0 |

Rendered JavaScript-enabled DOM:

| State | GTM script elements | GTM iframe elements | `performance` `gtm.js` resources | `gtm.start` entries |
| --- | ---: | ---: | ---: | ---: |
| Before consent | 0 | 0 | 0 | 0 |
| After analytics consent | 1 | 0 | 1 | 1 |

The noscript iframe is present in server HTML only when saved consent exists, but it is not a JavaScript analytics source when JavaScript is enabled. In a JS-enabled DOM, `noscript` iframe markup is inert and `document.querySelectorAll('iframe[src*="googletagmanager.com/ns.html"]')` returned `0`.

## 8. GA4 Network Duplication

Clean headless Chrome profile, extensions disabled, normal production, no GTM Preview.

After first analytics consent on `/`:

| Request | Host/path | `tid` | `en` | `dl` | `dt` | `ep.page_path` | `ep.page_language` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `www.google-analytics.com/g/collect` | `G-QD70DM5MEJ` | `page_view` | `https://www.avizsazeh.ir/` | homepage title | empty | empty |
| 2 | `www.google-analytics.com/g/collect` | `G-QD70DM5MEJ` | `page_view` | `https://www.avizsazeh.ir/` | homepage title | empty | `fa` |

The two requests used the same measurement ID, same page location, same title, and same timestamp window. The second request carried the application-provided `page_language`, which identifies it as the explicit GTM `page_view` event tag. The first request lacked the app event parameters, which identifies it as the Google Tag automatic page view.

Initial-load counts:

| Metric | Count |
| --- | ---: |
| Application `dataLayer` `page_view` objects | 1 |
| GA4 `page_view` requests | 2 |
| Duplicate count | 1 extra GA4 `page_view` |

The GTM-managed Google Tag also loaded `https://www.googletagmanager.com/gtag/js?id=G-QD70DM5MEJ`. This is a GTM container dependency, not a direct application GA4 loader.

## 9. Published GTM Container Configuration

Authenticated GTM workspace access was not used, and no edits were made. The published public `gtm.js` resource for `GTM-KKXLZFLG` was inspected read-only.

Published active tags visible in `gtm.js`:

| Tag | Type | Measurement ID | Trigger | `send_page_view` | Consent requirement | Duplicate risk |
| --- | --- | --- | --- | --- | --- | --- |
| `tag_id:3` | Google Tag (`__googtag`) | `G-QD70DM5MEJ` | `gtm.init` | not set to `false`; observed automatic page_view | Google consent mode applies | high |
| `tag_id:10` | GA4 Event (`__gaawe`) | `G-QD70DM5MEJ` | Custom Event `page_view` | n/a | Google consent mode applies | high when base tag auto page_view is enabled |
| `tag_id:22` | GA4 Event (`__gaawe`) | `G-QD70DM5MEJ` | Custom Event `rfq_submit` | n/a | Google consent mode applies | low; maps one app event to `generate_lead` |

Published trigger predicates visible:

- `gtm.init`
- `page_view`
- `rfq_submit`

No published History Change trigger was visible in the public container resource.

Active Google/GA4 page-view-capable tags in published GTM: `2`

- one Google Tag automatic initial page view
- one explicit GA4 Event tag for `page_view`

Paused tags, draft workspace changes, tag names, and full consent settings cannot be listed from public `gtm.js`; authenticated GTM UI/API access is required for that.

## 10. Google Tag `send_page_view`

`send_page_view=false` was not visible in the published Google Tag configuration.

Live network confirms the effective behavior: the Google Tag sends an automatic initial `page_view`. Therefore, even if a settings variable exists elsewhere, the published effective configuration is not suppressing the automatic initial page view.

This is the primary root cause.

## 11. GA4 Enhanced Measurement

GA4 Admin access was not available, so the Web Data Stream setting could not be directly inspected.

Production evidence did not identify Enhanced Measurement history-page-view duplication in the tested SPA navigation flow. The reproduced duplicate occurs on initial consent-granted load and is explained by the GTM Google Tag automatic page view plus the explicit GTM `page_view` tag.

Manual verification still recommended:

`Enhanced Measurement -> Page views -> Page changes based on browser history events`

If that setting is enabled, it can duplicate future SPA page views against the application `page_view` event.

## 12. Tag Assistant / Preview Effects

The duplicate was reproduced in normal production without GTM Preview or Tag Assistant connected.

| Mode | Result |
| --- | --- |
| Normal production | duplicate reproduced |
| GTM Preview / Tag Assistant | not required to reproduce; not inspected with authenticated Preview |
| Multiple Tag Assistant tabs | not tested |
| Refresh after stale Preview | not needed for root cause |

Preview injection or stale Tag Assistant sessions are not required for the observed duplicate.

## 13. Consent Lifecycle

Observed first grant sequence:

| Step | GTM script elements | GTM network requests | `gtm.start` entries | consent default commands | consent update commands | current-page app `page_view` events | GA4 `page_view` requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| default denied | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| update granted | 1 | 1 | 1 | 1 | 1 | 1 | 2 |

Saved-consent load:

| Step | GTM script elements | GTM network requests | `gtm.start` entries | current-page app `page_view` events | GA4 `page_view` requests |
| --- | ---: | ---: | ---: | ---: | ---: |
| initial granted consent | 1 | 1 | 1 | 1 | 2 |

Consent lifecycle is not appending GTM more than once. The duplicate happens after GTM is correctly loaded once.

## 14. Duplicate Category Assignment

| Category | Applies? | Evidence |
| --- | --- | --- |
| A - duplicate GTM container loader | no | one script element, one `gtm.js` request, one `gtm.start` |
| B - duplicate Google base tag | no evidence | one published Google Tag using `G-QD70DM5MEJ` |
| C - automatic Google Tag page view plus explicit `page_view` | yes | two GA4 `page_view` requests from one app `page_view` |
| D - Enhanced Measurement history page view plus app `page_view` | not confirmed | GA4 Admin unavailable; no history duplicate reproduced |
| E - two GTM `page_view` event tags | no | one published GA4 `page_view` event tag |
| F - generic GA4 event tag plus specific `page_view` tag | no | no generic all-event GA4 tag visible in published resource |
| G - PageViewTracker application duplicate | no | one `dataLayer` `page_view` per tested route |
| H - consent regrant/remount duplicate | no | one GTM loader; one app current-page `page_view` by design |
| I - Tag Assistant Preview/session-only duplicate | no | duplicate reproduced without Preview |
| J - duplicate warning not reproduced | no | duplicate reproduced |
| K - another identified source | no | root cause is category C |

## 15. Should `NEXT_PUBLIC_GA4_ID` Be Restored?

No. Keep `NEXT_PUBLIC_GA4_ID` removed.

Reason:

- application runtime is GTM-only
- GA4 measurement ID belongs inside GTM
- restoring the public GA4 environment variable can reintroduce a second measurement path if old code or a rollback path is restored
- it does not fix GTM container duplication
- it can make future diagnosis harder

`NEXT_PUBLIC_GTM_ID` remains present in Production, Preview, and Development.

## 16. Recommended Fix Order

1. In GTM, set the Google Tag for `G-QD70DM5MEJ` to suppress the automatic initial page view (`send_page_view=false` or the equivalent Google Tag setting path).
2. Keep the explicit `TAG - GA4 - page_view` event tag triggered by the application `page_view` event.
3. Republish GTM and retest first consent grant and saved-consent initial load.
4. Verify GA4 Enhanced Measurement history-based page views are disabled for this stream if the app remains the SPA page-view source.
5. Recheck Tag Assistant only after the normal production network count is one GA4 `page_view`.
6. Keep `NEXT_PUBLIC_GA4_ID` removed from Vercel.

## 17. Files Created

- `reports/analytics/avizsazeh-analytics-duplicate-audit.md`
- `reports/analytics/avizsazeh-analytics-duplicate-audit.json`

