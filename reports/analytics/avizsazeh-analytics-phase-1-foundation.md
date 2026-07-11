# Avizsazeh Analytics Phase 1 Foundation

Date: 2026-07-11  
Project: `avizsazeh.ir`  
Scope: Phase 1 - analytics transport foundation and measurement cleanup. GTM was not activated and no deployment environment variables were changed.

## 1. Summary

Phase 1 implemented a deterministic analytics transport layer with exactly three modes:

- `direct_ga4`
- `gtm`
- `disabled`

The application now selects one transport only. Direct GA4 and GTM cannot load together. Direct Plausible and Microsoft Clarity runtime loaders were removed because production verification found they are not active. App Router page views are now sent explicitly through one centralized tracker, and RFQ success now emits one canonical application event, `rfq_submit`.

## 2. Confirmed Baseline

The prior audits confirmed:

- Production currently uses direct GA4 with public measurement ID `G-QD70DM5MEJ`.
- GTM is not active in production.
- Plausible and Microsoft Clarity are not active in production.
- Initial page loads normally send one GA4 page view.
- Some App Router client-side transitions were missing GA4 page views.
- RFQ success sent both `rfq_submit_success` and `generate_lead`.
- No Consent Mode or analytics consent UI exists yet.
- Current CSP is report-only and would block GA4 if enforced without source updates.

## 3. Files Changed

Runtime/config files:

- `.env.example`
- `next.config.mjs`
- `src/app/[locale]/layout.tsx`
- `src/components/analytics/Analytics.tsx`
- `src/components/analytics/PageViewTracker.tsx`
- `src/components/rfq/RfqEngine.tsx`
- `src/lib/analytics-config.ts`
- `src/lib/analytics.ts`

Documentation:

- `reports/analytics/avizsazeh-analytics-phase-1-foundation.md`

## 4. Analytics Transport Architecture

The new config module is `src/lib/analytics-config.ts`.

It validates only public analytics env vars:

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GA4_ID`

It exposes:

```ts
type AnalyticsTransport = 'direct_ga4' | 'gtm' | 'disabled';
analyticsConfig.transport;
analyticsConfig.gtmId;
analyticsConfig.ga4Id;
```

Only the active ID is exposed to loaders. If GTM is selected, `ga4Id` is not exposed to the direct GA4 loader even if a GA4 env var also exists.

## 5. Transport Selection Rules

Implemented behavior:

| Env state | Selected mode | Script behavior |
|---|---|---|
| Valid `NEXT_PUBLIC_GTM_ID` | `gtm` | Load GTM only. |
| No valid GTM, valid `NEXT_PUBLIC_GA4_ID` | `direct_ga4` | Load direct GA4 only. |
| Neither valid ID | `disabled` | Load no analytics script. |
| Both valid IDs | `gtm` | GTM takes precedence; direct GA4 is hidden from loaders. |

In development, when both valid IDs exist, the client logs one warning explaining that GTM mode was selected and direct GA4 is disabled.

## 6. Direct GA4 Behavior

Direct GA4 mode loads:

- `https://www.googletagmanager.com/gtag/js?id=...`
- one `ga4-init` inline script

The direct GA4 config now uses:

```ts
send_page_view: false
```

All page views are sent explicitly by `PageViewTracker`, preventing automatic + manual duplicate initial page views. If a route event fires before `gtag` is ready, the central analytics helper queues it briefly and flushes it through `gtag()` after the GA4 init script signals readiness.

## 7. GTM Behavior

GTM mode loads:

- GTM bootstrap script
- GTM noscript iframe

GTM mode does not load direct `gtag.js`. Application events are pushed to `window.dataLayer` only:

```ts
window.dataLayer.push({ event, ...params });
```

GTM container configuration is intentionally not implemented in this phase.

## 8. Disabled Behavior

Disabled mode loads no analytics scripts. The event helper returns safely without throwing.

The current local environment selected mode is `disabled` because no valid local `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_ID` was present.

## 9. SPA Page-View Implementation

Added:

```text
src/components/analytics/PageViewTracker.tsx
```

It uses `usePathname()` and sends one `page_view` for:

- initial route
- client-side pathname changes
- locale route changes

Parameters:

```text
page_path
page_language
page_title
```

`page_path` is pathname only. Query strings, hashes, origins, and uncontrolled URL data are excluded.

Language detection:

- `/en` -> `en`
- `/ar` -> `ar`
- `/ru` -> `ru`
- all default/unprefixed Persian routes -> `fa`

## 10. Page-View Deduplication Method

The tracker uses a route key:

```text
history.state.idx + ":" + pathname
```

It stores only the last sent key at module scope. This suppresses duplicate Strict Mode remounts and rerenders for the same navigation, but still allows a later real navigation back to the same route to be measured because the previous sent key changes when the user navigates away.

No timer-only workaround is used.

## 11. RFQ Event Cleanup

`src/components/rfq/RfqEngine.tsx` now sends one canonical success event:

```text
rfq_submit
```

Removed application success events:

- `rfq_submit_success`
- direct application call to `generate_lead`

`rfq_submit` fires only after the RFQ API returns a successful application response. Validation, file upload behavior, Odoo submission logic, and CRM delivery code were not changed.

## 12. Direct GA4 Event Mapping

The application-facing event remains vendor-neutral:

```text
rfq_submit
```

In direct GA4 transport only, the centralized analytics helper maps:

```text
rfq_submit -> generate_lead
```

In GTM mode, the event remains:

```text
rfq_submit
```

This gives one application event, one direct GA4 conversion-style event, and a clean future GTM mapping point.

Each RFQ submission attempt creates one `event_id`. The same ID is used for the success or failure branch of that attempt.

## 13. Removed Vendor Integrations

Removed from runtime:

- direct Plausible loader
- direct Microsoft Clarity loader
- `window.plausible` dispatch
- `window.clarity` dispatch
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` from `.env.example`
- `NEXT_PUBLIC_CLARITY_ID` from `.env.example`

Plausible and Clarity were not added through GTM.

## 14. PII Prevention Rules

The analytics helper:

- uses allowlisted UTM keys only
- length-limits stored UTM values
- does not store full URLs
- adds pathname-only `page_path`
- adds `page_language`
- does not attach arbitrary query parameters

RFQ success parameters are non-PII and include fields such as:

- `event_id`
- `form_name`
- `submission_status`
- `component_name`
- `project_type`
- `ceiling_system`
- `area_range`
- `buyer_role`
- `project_stage`

The implementation does not send name, phone, email, company, message, notes, file names, file paths, file contents, exact addresses, or uploaded file names.

## 15. CSP Changes

`next.config.mjs` remains report-only. It now allows the currently active direct GA4 and future GTM loader endpoints:

- `script-src`: `https://www.googletagmanager.com`
- `connect-src`: `https://www.google-analytics.com`, `https://region1.google-analytics.com`, `https://www.googletagmanager.com`
- `frame-src`: `https://www.googletagmanager.com`
- `img-src`: `https://www.google-analytics.com`, `https://region1.google-analytics.com`

Additional vendors still require separate CSP review before activation.

## 16. Environment-Variable Behavior

No Vercel or deployment env vars were changed.

Production should remain direct GA4 while only `NEXT_PUBLIC_GA4_ID` is configured. If `NEXT_PUBLIC_GTM_ID` is later added, GTM mode takes precedence and direct GA4 will not load.

No public analytics ID was hard-coded into source.

## 17. Tests Performed

Commands run:

```bash
npm run typecheck
npm run lint
npm run build
git diff --check
git status --short
```

Results:

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- `git diff --check`: passed

Acceptance searches:

- Runtime source has no `window.plausible`
- Runtime source has no `window.clarity`
- Runtime source has no `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- Runtime source has no `NEXT_PUBLIC_CLARITY_ID`
- Runtime source has no `rfq_submit_success`
- `window.gtag` appears only in `src/lib/analytics.ts`
- `window.dataLayer.push` appears only in `src/lib/analytics.ts`
- raw loader `gtag()`/`dataLayer.push(arguments)` appears only in `src/components/analytics/Analytics.tsx`

Historical report references remain by design.

## 18. Remaining Work for Consent Phase

Not implemented in this phase:

- cookie banner
- consent persistence
- Google Consent Mode defaults/updates
- analytics/ad storage gating
- consent withdrawal UI

The transport is centralized so future consent gating can be added in the analytics module/loader instead of scattered through UI components.

## 19. Remaining Work for GTM Container Configuration

Still pending:

- GTM container activation in deployment env
- GTM Preview QA
- GA4 tag mapping from `page_view`
- GA4 event mapping from `rfq_submit`
- Google Ads conversion tags, if approved later
- consent-aware tag firing rules
- duplicate-event validation after GTM is introduced

## 20. Risks and Rollback Instructions

Risks:

- If production direct GA4 script loads but the explicit page-view tracker is blocked, page views may be undercounted because automatic page views are now disabled.
- Existing GA4 reports may show `rfq_submit` as `generate_lead` in direct mode, by design.
- GTM activation later must be tested carefully because it will supersede direct GA4.
- Consent compliance is not solved in this phase.

Rollback:

1. Revert the Phase 1 source changes.
2. Restore direct GA4 config without `send_page_view:false` only if explicit page views are rolled back.
3. Reintroduce Plausible/Clarity only if a separate business decision and consent/CSP plan exists.
4. Do not change Vercel env vars as rollback unless a separate deployment task explicitly requires it.

Phase 2 consent foundation and GTM preview readiness are documented separately in
`reports/analytics/avizsazeh-analytics-phase-2-consent.md`.
