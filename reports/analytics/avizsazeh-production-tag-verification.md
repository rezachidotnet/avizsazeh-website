# Avizsazeh Production Tag Verification

Verification date: 2026-07-11  
Project: `avizsazeh.ir`  
Task: Phase 0 production activation verification only. No migration was implemented.

## Summary Verdict

Decision B - Direct GA4 is active but GTM is not active.

Production evidence shows:

- Direct GA4 is active with public measurement ID `G-QD70DM5MEJ`.
- GTM code exists in the repository but no production GTM container was observed.
- Plausible and Microsoft Clarity code exists in the repository but neither was observed active in production.
- Google Ads, Meta Pixel, LinkedIn Insight, Hotjar, and similar advertising/session tools were not observed.
- Clean initial page loads produced exactly one GA4 `page_view` in sampled routes.
- SPA navigation page views are inconsistent: some App Router transitions produced no GA4 `page_view`.
- No production RFQ was submitted. Source code still indicates one successful RFQ would send both `rfq_submit_success` and `generate_lead` to active direct GA4.

## Baseline Read

The repository audit at `reports/analytics/avizsazeh-gtm-migration-audit.md` and inventory JSON were read first. The audit correctly identified that analytics integrations are conditional in code and must not be treated as production-active without deployment evidence.

## Local Environment Activation Matrix

Local env inspection checked shell environment and local env files. Only `.env.example` exists locally; no real `.env` or `.env.local` file was found.

| Variable | Referenced in code | Declared in example | Present locally | Non-empty | Public identifier type | Likely active locally |
|---|---:|---:|---:|---:|---|---:|
| `NEXT_PUBLIC_GTM_ID` | Yes | Yes | No | No | `GTM-*` if set | No |
| `NEXT_PUBLIC_GA4_ID` | Yes | Yes | No | No | `G-*` if set | No |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Yes | Yes | No | No | Domain if set | No |
| `NEXT_PUBLIC_CLARITY_ID` | Yes | Yes | No | No | Clarity project id if set | No |
| `NEXT_PUBLIC_SITE_URL` | No current runtime reference found | Yes | No | No | Public URL | No |

Evidence:

- Code references: `src/components/analytics/Analytics.tsx:19-22`, `src/app/[locale]/layout.tsx:124-127`.
- Example declarations: `.env.example:34-42`.
- Local env files: `.env.example` only.

## Vercel Environment Inspection

Vercel environment activation could not be verified from the local repository.

`vercel env ls` reported that the codebase is not linked to a Vercel project. I did not run `vercel link`, did not pull env values, and did not print secrets.

| Variable | Production | Preview | Development | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Unverified | Unverified | Unverified | Vercel project not linked locally. |
| `NEXT_PUBLIC_GA4_ID` | Unverified | Unverified | Unverified | Production behavior confirms a GA4 ID is deployed, but Vercel env source was not verified. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Unverified | Unverified | Unverified | Not observed active in production. |
| `NEXT_PUBLIC_CLARITY_ID` | Unverified | Unverified | Unverified | Not observed active in production. |
| `NEXT_PUBLIC_SITE_URL` | Unverified | Unverified | Unverified | Not relevant to active tag loading. |

## Production HTML Verification

Routes were requested from `https://avizsazeh.ir` and followed through redirects to the canonical `https://www.avizsazeh.ir` host.

| Route | Final URL | GTM present | GTM ID count | Direct GA4 present | GA4 IDs | Plausible | Clarity | Duplicate suspicion |
|---|---|---:|---:|---:|---|---:|---:|---|
| `/` | `https://www.avizsazeh.ir/` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |
| `/fa` | `https://www.avizsazeh.ir/` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | `/fa` redirects to root. |
| `/en` | `https://www.avizsazeh.ir/en` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |
| `/ar` | `https://www.avizsazeh.ir/ar` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |
| `/ru` | `https://www.avizsazeh.ir/ru` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |
| `/fa/rfq` | `https://www.avizsazeh.ir/rfq` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | `/fa/rfq` redirects to `/rfq`. |
| `/en/rfq` | `https://www.avizsazeh.ir/en/rfq` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |
| `/fa/contact` | `https://www.avizsazeh.ir/contact` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | `/fa/contact` redirects to `/contact`. |
| `/en/contact` | `https://www.avizsazeh.ir/en/contact` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |
| `/fa/systems` | `https://www.avizsazeh.ir/systems` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | `/fa/systems` redirects to `/systems`. |
| `/en/systems` | `https://www.avizsazeh.ir/en/systems` | No | 0 | Yes | `G-QD70DM5MEJ` | No | No | No HTML duplicate. |

Confirmed production HTML contained direct `gtag.js`, but no `gtm.js`, no GTM noscript iframe, no Plausible script, and no Clarity script.

## Production Network Verification

Chrome was launched with a temporary profile and extensions disabled. Network evidence was collected through Chrome DevTools Protocol and query strings were redacted.

| Vendor | Request host/path | Trigger time | Initial page load | Client navigation | Consent required | Evidence |
|---|---|---|---:|---:|---|---|
| GA4 direct Google tag | `www.googletagmanager.com/gtag/js?[redacted]` | Initial load | Yes | No reload on normal SPA transitions | Analytics consent recommended; no gate observed | Seen on `/`, `/contact`, `/en`. |
| GA4 collection | `region1.google-analytics.com/g/collect?[redacted]` | Initial load | Yes | Yes on some transitions | Analytics consent recommended; no gate observed | `en=page_view`, `tid=G-QD70DM5MEJ`. |
| GA4 custom event | `region1.google-analytics.com/g/collect?[redacted]` | System detail transition | No | Yes | Analytics consent recommended; no gate observed | `system_page_view` observed. |

Not observed in network:

- `googletagmanager.com/gtm.js`
- `plausible.io`
- `clarity.ms`
- `googleadservices.com`
- `doubleclick.net`
- `facebook.com/tr`
- `connect.facebook.net`
- `snap.licdn.com`
- `bat.bing.com`

## Client-Side Navigation Test

| Navigation | Full reload? | GA4 page_view count | GTM history event | Duplicate | Missing page view |
|---|---:|---:|---:|---:|---:|
| Homepage -> systems | No | 0 | Yes, `gtm.historyChange-v2` in `dataLayer` | No | Yes |
| Systems -> system detail | No | 1 | Yes | No | No |
| System detail -> contact | No | 1 | Yes | No | No |
| Contact -> RFQ | No | 0 | Yes | No | Yes |
| Persian route -> English equivalent | Inconclusive | 0 in capture window | Not retained after reload/navigation | No | Inconclusive |

Important nuance: `gtm.historyChange-v2` appears in `window.dataLayer`, but no GTM container was loaded. In this production setup, these entries come from the direct Google tag/dataLayer behavior and are not evidence that GTM is active.

## Initial Page-View Duplicate Test

Clean browser sessions produced one direct GA4 page view per sampled initial load:

| Route | Page-view requests | Direct GA4 source | GTM source | Result |
|---|---:|---:|---:|---|
| `/` | 1 | Yes | No | Exactly one page view |
| `/contact` | 1 | Yes | No | Exactly one page view |
| `/en` | 1 | Yes | No | Exactly one page view |

No initial duplicate page-view problem was observed in the sampled clean-load tests. The active issue is missing SPA page views on some client transitions.

## RFQ Conversion Verification

No production RFQ was submitted. No fake CRM lead was created.

Source-code evidence shows one successful RFQ currently sends both `rfq_submit_success` and `generate_lead` through `trackEvent()`. Since direct GA4 is active in production, those events would be sent to direct GA4 if a real successful RFQ occurs.

| Event | Current source | dataLayer | Direct GA4 | GTM | Key event risk | Duplicate risk |
|---|---|---|---|---|---|---|
| `rfq_submit_success` | `src/components/rfq/RfqEngine.tsx:192` | Yes if `dataLayer` exists | Yes if `gtag` exists | No active GTM observed | Unknown GA4 property config | High if also counted with `generate_lead` |
| `generate_lead` | `src/components/rfq/RfqEngine.tsx:195-199` | Yes if `dataLayer` exists | Yes if `gtag` exists | No active GTM observed | Likely key-event candidate | High if `rfq_submit_success` is also counted |
| `rfq_submit` | Not implemented as exact event | No | No | No | None now | None now |
| Google Ads conversion | Not detected | No | No | No | None now | None now |
| Meta conversion | Not detected | No | No | No | None now | None now |

## dataLayer Inspection

Findings from production browser evaluation:

- `window.dataLayer` exists after direct GA4 initializes.
- Initial entries include `js`, `config`, `gtm.dom`, and `gtm.load`.
- SPA transitions add `gtm.historyChange-v2`.
- `system_page_view` was observed on system detail navigation.
- No PII was observed in sampled dataLayer entries.
- Route/language context is not consistently present as structured custom parameters on page-view entries.

Observed sampled dataLayer shape:

```text
["js", Date]
["config", "G-QD70DM5MEJ", { anonymize_ip: true }]
{ event: "gtm.dom" }
{ event: "gtm.load" }
{ event: "gtm.historyChange-v2" }
{ event: "system_page_view", ... }
```

## Consent Verification

| Check | Result |
|---|---|
| Cookie/privacy consent UI | Not detected |
| Consent persistence | Not detected |
| `gtag('consent', 'default', ...)` | Not detected |
| `gtag('consent', 'update', ...)` | Not detected |
| GTM Consent Initialization | Not applicable; GTM not active |
| `analytics_storage` | Not detected |
| `ad_storage` | Not detected |
| `ad_user_data` | Not detected |
| `ad_personalization` | Not detected |
| Consent withdrawal mechanism | Not detected |
| GA4 before consent | Yes, direct GA4 loads and sends page_view on initial load |
| Plausible before consent | Not observed active |
| Clarity before consent | Not observed active |

This is a technical behavior finding only, not a legal conclusion.

## GTM Container Visibility

No active production GTM container was observed in HTML or network requests. GTM Preview or container admin access was not available. Repository and network inspection cannot reveal an inactive or unpublished GTM container configuration.

## CSP Verification

Production response headers include:

```text
Content-Security-Policy-Report-Only:
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; manifest-src 'self'
```

Browser console findings:

- Loading `https://www.googletagmanager.com/gtag/js?id=G-QD70DM5MEJ` violates current `script-src` in report-only mode.
- Connecting to `https://region1.google-analytics.com/g/collect?...` violates current `connect-src` in report-only mode.

If the current policy were enforced as-is, active direct GA4 would break.

## Production Activation Verdict

| Integration | Status |
|---|---|
| Google Tag Manager | `present_in_code_but_not_observed_in_production` |
| Direct GA4 | `confirmed_active_in_production` |
| GA4 through GTM | `present_in_code_but_not_observed_in_production` |
| Plausible | `present_in_code_but_not_observed_in_production` |
| Microsoft Clarity | `present_in_code_but_not_observed_in_production` |
| Google Ads | `not_configured` |
| Meta Pixel | `not_configured` |
| LinkedIn Insight | `not_configured` |
| Other detected integrations | `not_configured` for tested marketing/ad/session-recording vendors |

## Final Migration Decision

Decision B - Direct GA4 is active but GTM is not active.

Safe next direction:

1. Do not enable GTM GA4 page views while direct GA4 is still sending page views, unless GTM is isolated to a test environment.
2. Fix the measurement plan for SPA page views because current direct GA4 page_view behavior is inconsistent.
3. Decide whether direct GA4 remains temporarily during GTM foundation work or is disabled only after GTM has equivalent verified coverage.
4. Standardize RFQ success before marking conversions: one canonical application event should fan out to GA4/Ads later, not both `rfq_submit_success` and `generate_lead` as separate conversions.
5. Add consent architecture before adding GTM-managed advertising or session-recording tags.

## Verification Notes

Commands/tools used:

- Read existing audit and JSON inventory.
- Local env-name inspection without printing secret values.
- `vercel env ls` attempted read-only; unavailable because repo is not linked.
- Production HTML route scan via Node `fetch`.
- Headless Chrome with temporary profile and Chrome DevTools Protocol for network, dataLayer, and console checks.
- No package installation.
- No source-code modification.
- No production RFQ submission.

