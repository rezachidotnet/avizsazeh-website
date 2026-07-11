# Avizsazeh GTM Migration Audit

Audit date: 2026-07-11  
Project: `avizsazeh.ir`  
Scope: repository source, config, public assets, scripts, environment-variable references, application tracking code, RFQ/contact/conversion flows. No production code was modified.

## 1. Executive Summary

Avizsazeh currently has a custom analytics layer, not a package-based analytics setup. Runtime vendor loaders are all optional and controlled by public environment variables in `src/components/analytics/Analytics.tsx`.

Confirmed installed or prepared systems:

| System | Status | Evidence | Recommendation |
|---|---:|---|---|
| Google Tag Manager | Optional loader present | `src/components/analytics/Analytics.tsx:19-33`, `src/app/[locale]/layout.tsx:123-134` | Keep one app-level loader if GTM is adopted. |
| GA4 direct `gtag.js` | Optional direct loader present | `src/components/analytics/Analytics.tsx:36-44` | Move fully to GTM and remove direct loader after QA. |
| Plausible | Optional direct loader present | `src/components/analytics/Analytics.tsx:48-55` | Move to GTM if retained, or choose one primary analytics source. |
| Microsoft Clarity | Optional direct loader present | `src/components/analytics/Analytics.tsx:58-61` | Move to GTM and gate by consent. |
| Odoo CRM | Server-side RFQ lead delivery | `src/app/api/rfq/submit/route.ts:191-255`, `src/lib/odoo/client.ts:90-160` | Keep in application. |
| WhatsApp links | Functional outbound links, not widget | `src/lib/site.ts:36`, multiple component references | Keep links; move click tracking to GTM or data attributes. |

Not detected in source: Google Ads conversion/remarketing, Meta Pixel, LinkedIn Insight Tag, Hotjar, Sentry, PostHog, Mixpanel, Segment, Amplitude, Matomo, Vercel Analytics, Vercel Speed Insights, reCAPTCHA, Cloudflare Turnstile, cookie consent platform, server-side conversion API, chat widget.

Highest risks:

1. Direct GA4 and GTM can both be enabled, causing duplicate page views/events.
2. `trackEvent()` sends to `dataLayer`, direct `gtag`, Plausible, and Clarity, so GTM-managed tags would duplicate direct vendor dispatch.
3. RFQ success sends both `rfq_submit_success` and `generate_lead` for one lead.
4. Analytics/UX scripts currently load without a consent-management layer.
5. Current CSP is report-only and does not allow external script origins if later enforced.

## 2. Project and Framework Overview

| Item | Finding | Evidence |
|---|---|---|
| Framework | Next.js `14.2.15` | `package.json:13-20` |
| React | React `18.3.1` | `package.json:17-18` |
| Router | App Router | `src/app/[locale]/layout.tsx`, `README.md:11-49` |
| Locale routing | `next-intl`, default Persian with `as-needed` prefixes | `src/i18n/routing.ts:9-15` |
| Root layout | Locale layout owns `html`, `body`, analytics, header/footer | `src/app/[locale]/layout.tsx:101-152` |
| Default Persian route | `(fa)` layout delegates to `[locale]` layout | `src/app/(fa)/layout.tsx:1-20` |
| React Strict Mode | Enabled | `next.config.mjs:6-8` |
| CSP | `Content-Security-Policy-Report-Only`; `script-src 'self' 'unsafe-inline'` | `next.config.mjs:41-61` |
| Deployment config | Vercel, Next.js, `fra1` region | `vercel.json:1-5` |

No `pages/`, `providers/`, or top-level `hooks/` directory was found. `src/middleware.ts` handles host/default-locale redirects only and contains no tracking code (`src/middleware.ts:5-29`).

## 3. Audit Methodology

Commands and inspections used:

- `rg --files` to enumerate source and config.
- Required pattern searches across `src`, `public`, `package.json`, `package-lock.json`, `next.config.mjs`, `vercel.json`, `.env.example`, and `README.md`.
- Targeted searches for `next/script`, raw scripts, iframes, `dangerouslySetInnerHTML`, tracking globals, external URLs, `tel:`, `mailto:`, WhatsApp, `download`, `data-*` tracking attributes, storage, cookies, and consent.
- Manual review of analytics utilities, layouts, RFQ, contact, footer, header, locale switcher, API route, Odoo client, SEO JSON-LD, and button/link components.
- Validation commands: `npm run typecheck`, `npm run lint`, and `git status --short`.

## 4. Current Analytics and Tag Inventory

### Google Tag Manager

| Field | Finding |
|---|---|
| Current status | Optional implementation exists; active only if `NEXT_PUBLIC_GTM_ID` is set. |
| Source | `src/components/analytics/Analytics.tsx:19-33`, `src/app/[locale]/layout.tsx:123-134`, `.env.example:37-40` |
| Loading method | Inline GTM bootstrap inside Next `Script`, `strategy="afterInteractive"`; noscript iframe in body. |
| Scope | Global, all locale routes, when env var exists. |
| Client/server | Client. |
| ID source | Environment variable `NEXT_PUBLIC_GTM_ID`; not hard-coded in source. |
| dataLayer initialization | GTM bootstrap initializes `window.dataLayer`. Direct GA4 init also initializes `window.dataLayer`. |
| Duplicates | No second GTM container found, but direct GA4 can coexist. |
| Transfer to GTM | The loader itself must remain in the app; vendor tags should move into GTM. |
| Migration risk | Medium: current CSP and duplicate GA4/vendor dispatch must be handled. |

Assessment: GTM is already scaffolded but not a complete best-practice implementation. The loader is in a client component rendered under body, and the noscript iframe is in the locale layout. It is injected once through `[locale]`; `(fa)` delegates to `[locale]`, so route-group duplication was not found.

### GA4 Direct

| Field | Finding |
|---|---|
| Current status | Optional direct GA4 loader exists. |
| Source | `src/components/analytics/Analytics.tsx:36-44` |
| Loading method | `https://www.googletagmanager.com/gtag/js?id=${ga4}` via `next/script`, plus inline config. |
| Scope | Global when `NEXT_PUBLIC_GA4_ID` exists. |
| Page views | `gtag('config', ga4, { anonymize_ip: true })` can send a default page view. No explicit SPA route-change page_view code found. |
| Events | `trackEvent()` calls `window.gtag('event', name, payload)` if available (`src/lib/analytics.ts:105-108`). |
| Move to GTM? | Yes, Category A. |
| Recommended? | Yes. Use GTM-managed Google tag/GA4 events, then remove direct GA4. |
| Duplicate risk | High if GTM GA4 is also configured. |

### Plausible

| Field | Finding |
|---|---|
| Current status | Optional direct loader exists. |
| Source | `src/components/analytics/Analytics.tsx:48-55` |
| Loading method | `https://plausible.io/js/script.js`, `defer`, `afterInteractive`. |
| Events | `trackEvent()` calls `window.plausible(name, { props })` (`src/lib/analytics.ts:109-112`). |
| Move to GTM? | Yes, Category A if retained. |
| Duplicate risk | Medium: overlaps with GA4 analytics. |

### Microsoft Clarity

| Field | Finding |
|---|---|
| Current status | Optional direct loader exists. |
| Source | `src/components/analytics/Analytics.tsx:58-61` |
| Loading method | Inline loader inserts `https://www.clarity.ms/tag/${id}` after interactive. |
| Events | `trackEvent()` calls `clarity('event', name)` without custom parameters (`src/lib/analytics.ts:113-116`). |
| Move to GTM? | Yes, Category A. |
| Recommended? | Yes, with consent gating. |
| Privacy/performance risk | Session/UX tool should not load before appropriate consent; global script cost on every page. |

### Custom Analytics Helper

| Field | Finding |
|---|---|
| Current status | Implemented. |
| Source | `src/lib/analytics.ts:1-145` |
| Method | Provider-agnostic `trackEvent()` adds locale, page path, UTM params, then dispatches to dataLayer, direct gtag, Plausible, and Clarity. |
| Storage | Captures UTM params in `sessionStorage` under `aecs_utm` (`src/lib/analytics.ts:13-79`). |
| Move to GTM? | Partially. Keep a lightweight dataLayer helper only; remove direct vendor calls later. |
| Classification | Category D for direct vendor dispatch; Category B for future dataLayer helper. |

## 5. Current Third-Party Script Inventory

| Script or iframe | Source | Current loading | Scope | GTM candidate | Notes |
|---|---|---|---|---:|---|
| GTM `gtm.js` | `src/components/analytics/Analytics.tsx:30-33` | `afterInteractive`, async inserted script | Global when env set | Loader stays in app | Required for GTM itself. |
| GTM `ns.html` iframe | `src/app/[locale]/layout.tsx:124-134` | `noscript` iframe | Global when env set | Loader stays in app | No duplicate noscript found. |
| GA4 `gtag/js` | `src/components/analytics/Analytics.tsx:36-44` | `afterInteractive` external script | Global when env set | Yes | Move to GTM. |
| Plausible | `src/components/analytics/Analytics.tsx:48-55` | `afterInteractive`, `defer` | Global when env set | Yes | Move if retained. |
| Clarity | `src/components/analytics/Analytics.tsx:58-61` | `afterInteractive`, async inserted | Global when env set | Yes | Move and gate by consent. |
| JSON-LD scripts | `src/components/shared/JsonLd.tsx:1-8` | Server-rendered raw `<script type="application/ld+json">` | Layout/pages | No | SEO functionality; keep in app. |

No other raw third-party script tags, `next/script` imports, dynamically injected scripts, marketing iframes, or chat widgets were found in executable source.

## 6. Existing GTM Implementation Assessment

| Check | Result |
|---|---|
| Container ID source | `NEXT_PUBLIC_GTM_ID`, env-based (`src/components/analytics/Analytics.tsx:20`). |
| Hard-coded ID | Not found. |
| GTM script injection | `Analytics` client component with inline `Script id="gtm"` (`src/components/analytics/Analytics.tsx:30-33`). |
| Noscript iframe | Present in `[locale]` layout (`src/app/[locale]/layout.tsx:124-134`). |
| Injected once or multiple | Once through locale layout. `(fa)` delegates to `[locale]` (`src/app/(fa)/layout.tsx:1-20`). |
| All locales | Yes, `[locale]` layout covers `fa`, `en`, `ar`, `ru`; `(fa)` default route delegates. |
| Client-side navigation | Loader persists under root layout. Need future QA for SPA page_view behavior. |
| dataLayer before GTM | GTM bootstrap initializes it; no separate pre-GTM app dataLayer initialization found. |
| Consent Mode | Not implemented. |
| Env separation | No local GTM environment-specific mapping found; only raw env var. |
| Direct GA4 outside GTM | Yes, optional direct GA4 exists. |

Implementation note: if CSP is later enforced, `script-src` and `frame-src` must allow GTM/Google and any vendor destinations. The current CSP is report-only (`next.config.mjs:41-70`).

## 7. Existing GA4 Implementation Assessment

Direct GA4 is present through `NEXT_PUBLIC_GA4_ID` and `gtag.js`. It is global and loaded `afterInteractive`. The inline config uses `anonymize_ip:true` (`src/components/analytics/Analytics.tsx:42-44`).

Risks:

- Default GA4 config can send an initial page view.
- No App Router history-change page_view implementation is present.
- If GTM also sends GA4 page views or events, duplication is likely.
- `trackEvent()` sends every event directly to `gtag` and also to `dataLayer` if GTM exists (`src/lib/analytics.ts:100-108`).

Recommendation: In the migration, GTM should become the only GA4 dispatcher. Keep application code only for contextual dataLayer events.

## 8. Event-Tracking Inventory

### Existing Events

| Event | Current status | Evidence | Actually fired? | Vendor target | Recommended method |
|---|---|---|---|---|---|
| `rfq_start` | Exists | `src/components/rfq/RfqEngine.tsx:104-108` | First next/submit attempt | dataLayer/gtag/Plausible/Clarity if globals exist | App `dataLayer.push()` |
| `rfq_step_complete` | Exists | `src/lib/analytics.ts:122-133`, `src/components/rfq/RfqEngine.tsx:150-155` | Valid step advance | Same | App `dataLayer.push()` |
| `rfq_field_error` | Exists | `src/components/rfq/RfqEngine.tsx:140-145` | Validation error | Same | App `dataLayer.push()` |
| `rfq_file_upload_started` | Exists | `src/components/rfq/RfqEngine.tsx:158-162` | File selected | Same | App `dataLayer.push()` |
| `rfq_file_upload_completed` | Exists | `src/components/rfq/RfqEngine.tsx:158-162` | Immediately after selected files are stored | Same | App `dataLayer.push()` |
| `rfq_submit_success` | Exists | `src/components/rfq/RfqEngine.tsx:187-199` | API success | Same | Replace with canonical `rfq_submit` |
| `generate_lead` | Exists | `src/components/rfq/RfqEngine.tsx:193-199` | Same API success | Same | Prefer GTM GA4 event generated from `rfq_submit` |
| `odoo_sync_success` | Exists | `src/components/rfq/RfqEngine.tsx:200-204` | If API response includes delivered lead | Same | App `dataLayer.push()` for ops/debug, not key event |
| `odoo_sync_failed` | Exists | `src/components/rfq/RfqEngine.tsx:200-204` | If API response includes failed lead | Same | App `dataLayer.push()` for ops/debug |
| `rfq_submit_error` | Exists | `src/components/rfq/RfqEngine.tsx:205-208` | API/fetch failure | Same | App `dataLayer.push()` |
| `phone_click` | Exists | `src/components/analytics/TrackedTel.tsx:25-31` | TrackedTel click | Same | GTM `tel:` trigger or data attributes |
| `whatsapp_click` | Exists | `src/components/contact/ContactRouting.tsx:39-54`, `src/components/layout/MobileActionBar.tsx:35-41`, `src/components/rfq/RfqEngine.tsx:248-253`, `src/components/rfq/RfqEngine.tsx:531-537` | Selected WhatsApp links | Same | GTM click trigger plus attributes |
| `email_click` | Exists partially | `src/components/contact/ContactRouting.tsx:64-77`, `src/components/rfq/RfqEngine.tsx:257-260` | Selected email links | Same | GTM `mailto:` trigger plus attributes |
| `cta_click` | Exists partially | `src/lib/analytics.ts:135-138`, `src/components/contact/ContactRouting.tsx:25-29`, `src/components/layout/MobileActionBar.tsx:28-32` | Selected CTAs only | Same | App/data attributes for contextual CTAs |
| `system_page_view` | Exists | `src/components/analytics/TrackView.tsx:17-20`, `src/app/[locale]/systems/[slug]/page.tsx:122-125`, `src/app/[locale]/systems/[slug]/page.tsx:407-410` | System detail pages | Same | App `dataLayer.push()` or GTM page metadata |

### Required Event Evaluation

| Requested event | Exists now? | Current implementation | Recommended event name | Method choice | GA4 key event | Ads conversion | Duplicate risk |
|---|---:|---|---|---|---:|---:|---|
| `rfq_start` | Yes | App state | `rfq_start` | App `dataLayer.push()` | No | No | Low |
| `rfq_step_complete` | Yes | App state | `rfq_step_complete` | App `dataLayer.push()` | No | No | Low |
| `rfq_submit` | No exact; `rfq_submit_success` exists | API success | `rfq_submit` | App `dataLayer.push()` with `event_id` | Yes | Yes, if business-approved | High if `generate_lead` also conversion |
| `rfq_submit_error` | Yes | API failure | `rfq_submit_error` | App `dataLayer.push()` | No | No | Low |
| `contact_form_start` | No contact form exists | N/A | Not recommended until form exists | Not recommended | No | No | N/A |
| `contact_form_submit` | No contact form exists | N/A | Not recommended until form exists | Not recommended | No | No | N/A |
| `contact_form_error` | No contact form exists | N/A | Not recommended until form exists | Not recommended | No | No | N/A |
| `phone_click` | Yes | React click | `phone_click` | GTM click trigger on `tel:` or data attribute | Yes | Optional | Medium during migration |
| `whatsapp_click` | Yes | React click | `whatsapp_click` | GTM click trigger on `wa.me` or data attribute | Yes | Optional | Medium |
| `email_click` | Partial | React click on selected mail links | `email_click` | GTM click trigger on `mailto:` | No | Optional | Low |
| `request_callback` | No | N/A | `request_callback` only if callback UI is added | Not recommended now | No | No | N/A |
| `engineering_review_request` | No exact | RFQ/request-analysis CTAs | `engineering_review_request` or CTA parameter | App/data attribute | No | No | Medium if duplicated with RFQ submit |
| `hero_primary_cta_click` | No | Button link only | `cta_click` with `cta_id=hero_primary` | `data-cta-id` or app push | No | No | Low |
| `hero_secondary_cta_click` | No | Button link only | `cta_click` with `cta_id=hero_secondary` | `data-cta-id` | No | No | Low |
| `header_cta_click` | No | Header button only | `cta_click` with `section_name=header` | `data-cta-id` | No | No | Low |
| `sticky_mobile_cta_click` | Yes as generic `cta_click` | Mobile action bar | `cta_click` with `section_name=mobile_action_bar` | App push or data attribute | No | No | Medium |
| `system_cta_click` | No | Button links | `cta_click` | `data-cta-id` | No | No | Low |
| `project_cta_click` | No | Button links | `cta_click` | `data-cta-id` | No | No | Low |
| `contact_cta_click` | Partial | ContactRouting | `cta_click` | App push/data attribute | No | No | Low |
| `footer_cta_click` | No | Footer RFQ link | `cta_click` | `data-cta-id` | No | No | Low |
| `project_view` | No | None | `project_view` | App `dataLayer.push()` on project pages | No | No | Low |
| `project_card_click` | No | Project cards are links | `project_card_click` | `data-*` or GTM link click | No | No | Low |
| `system_page_view` | Yes | TrackView | `system_page_view` | App `dataLayer.push()` | No | No | Dev Strict Mode only |
| `system_card_click` | No | System cards are links | `system_card_click` | `data-*` or GTM link click | No | No | Low |
| `technical_diagram_open` | No functional diagram | Placeholder only | Add when real modal exists | App `dataLayer.push()` | No | No | N/A |
| `technical_diagram_zoom` | No | N/A | Add when zoom exists | App `dataLayer.push()` | No | No | N/A |
| `technical_accordion_open` | No | Native details FAQ only | `technical_accordion_open` if added | App/data attribute | No | No | Low |
| `faq_expand` | No | Native `<details>` (`src/components/system/SystemFAQ.tsx:26`) | `faq_expand` | GTM click on `summary` with data attrs | No | No | Low |
| `resource_view` | No | Datasheets pending | `resource_view` | App/data attr when resources exist | No | No | N/A |
| `resource_download_start` | No | `DatasheetCta` supports future `download` | `resource_download_start` | GTM download trigger | No | No | Low |
| `resource_download_complete` | No | Browser downloads cannot reliably confirm complete | Avoid unless controlled endpoint added | Server-side tracking only if endpoint exists | No | No | Medium |
| `language_change` | No | LocaleSwitcher router replace | `language_change` | App `dataLayer.push()` | No | No | Low |
| `mobile_menu_open` | No | Header state | `mobile_menu_open` | App push from button | No | No | Low |
| `navigation_click` | No | Header/footer links | `navigation_click` | GTM click trigger/data attributes | No | No | Low |
| `outbound_link_click` | No | Instagram, maps, website self external | `outbound_link_click` | GTM native outbound trigger | No | No | Low |
| `file_download` | No active downloads | Future `DatasheetCta` | `file_download` | GTM download trigger | No | No | Low |
| `scroll_25/50/75/90` | No | None | GA4/GTM scroll depth | GTM scroll trigger | No | No | Medium if GA4 enhanced measurement also enabled |

## 9. Migration Classification

### Category A - Move Fully to GTM

- Direct GA4 configuration and page/event tags.
- Plausible loader if the business keeps Plausible.
- Microsoft Clarity loader.
- Future Google Ads remarketing/conversion tags.
- Future Meta Pixel, LinkedIn Insight, Hotjar, or similar simple marketing scripts if added.
- Generic phone, email, WhatsApp, outbound-link, download, and scroll tracking where URL-based or stable-attribute triggers are sufficient.

### Category B - Keep Lightweight dataLayer Code, Configure Analytics in GTM

- RFQ start, step completion, field errors, file selected, submit success, submit error.
- RFQ success deduplication using `event_id`.
- System page views with `ceiling_system`.
- Contextual CTA tracking where section/component context matters.
- Language change, mobile menu open, technical diagram/accordion interactions when implemented.
- Any event depending on API responses, application state, locale routing, or dynamic content.

### Category C - Keep in Application

- GTM loader itself.
- Odoo CRM delivery and private env usage.
- RFQ validation, spam controls, honeypot, file upload limits, classification, project ID generation.
- Functional `tel:`, `mailto:`, WhatsApp links.
- SEO metadata, canonical/hreflang, JSON-LD, sitemap, robots, middleware redirects.
- Consent banner UI and persistence if later implemented.

### Category D - Remove or Replace

- Direct GA4 loader after GTM GA4 is validated.
- Direct Plausible/Clarity loaders if GTM manages them.
- Direct multi-vendor dispatch inside `trackEvent()` after dataLayer migration.
- Dual RFQ success conversion pattern (`rfq_submit_success` plus `generate_lead`) as separate conversion sources.
- Any hard-coded or duplicate IDs if found in deployed env/GTM later; none found in source.

## 10. Detailed Migration Matrix

| ID | Current integration/code | File and location | Current purpose | Current loading method | Move to GTM? | Classification | Recommended GTM implementation | App change needed later | Duplicate risk | Privacy risk | Performance impact | Priority |
|---|---|---|---|---|---:|---|---|---:|---|---|---|---|
| A01 | Direct GA4 gtag.js | `Analytics.tsx:36-44` | GA4 page/event measurement | `next/script afterInteractive` | Yes | A | Google tag + GA4 event tags | Yes, remove direct loader | High | Medium | Removes direct app loader; network remains via GTM | Critical |
| A02 | Clarity loader | `Analytics.tsx:58-61` | UX/session analysis | Inline script inserts Clarity | Yes | A | Clarity tag gated by consent | Yes | Medium | High without consent | Can delay until consent | Medium |
| A03 | Plausible loader | `Analytics.tsx:48-55` | Analytics | External script | Yes | A | Plausible custom HTML/template if retained | Yes | Medium | Medium | Can conditionally load | Low |
| A04 | Phone clicks | `TrackedTel.tsx:25-31` | Contact conversion | React onClick | Yes | A | Click URL starts with `tel:` plus `cta_location` attr | Yes for attributes/removal | Medium | Low | Removes client tracking calls | High |
| A05 | Email clicks | `ContactRouting.tsx:64-77`, `RfqEngine.tsx:257-260`, footer links untracked | Contact engagement | Partial React onClick | Yes | A | Click URL starts with `mailto:` | Yes for context attributes | Low | Low | Minimal | Medium |
| A06 | WhatsApp clicks | `ContactRouting.tsx:39-54`, `MobileActionBar.tsx:35-41`, `RfqEngine.tsx:248-253`, `RfqEngine.tsx:531-537` | Contact conversion | React onClick | Yes | A | Click URL contains `wa.me` plus attributes | Yes | Medium | Low | Minimal | High |
| B01 | RFQ funnel events | `RfqEngine.tsx:104-208` | Conversion funnel | App state/API response | Partially | B | Custom event triggers from dataLayer | Yes, canonical event contract | High if DOM-tracked | Medium | Keeps only small app event push | Critical |
| B02 | System page view | `TrackView.tsx:17-20`, `systems/[slug]/page.tsx:122-125,407-410` | System engagement | Client mount | Partially | B | Custom event `system_page_view` | Maybe | Low prod, dev duplicate possible | Low | Minimal | Medium |
| B03 | CTA clicks | `ContactRouting.tsx:25-29`, `MobileActionBar.tsx:28-32`, many untracked buttons | CTA engagement | Partial React onClick | Partially | B | data attributes/custom events | Yes | Medium | Low | Minimal | High |
| B04 | Language switch | `LocaleSwitcher.tsx:18-22` | Locale engagement | No tracking | Partially | B | Custom event `language_change` | Yes | Low | Low | Minimal | Medium |
| C01 | GTM loader | `Analytics.tsx:30-33`, `layout.tsx:124-134` | Load GTM | App-level script/iframe | No | C | N/A | No | Multiple loader risk if duplicated | Medium | Required if GTM used | Critical |
| C02 | Odoo CRM | `api/rfq/submit/route.ts:191-255`, `odoo/client.ts:90-160` | Lead delivery | Server-side JSON-RPC | No | C | N/A | No | None with GTM | High sensitivity; keep server-side | Not marketing JS | Critical |
| C03 | RFQ validation/security | `route.ts:21-175`, `rfq.ts:117-210` | Business/security rules | Server-side | No | C | N/A | No | None | High if moved | N/A | Critical |
| C04 | JSON-LD | `JsonLd.tsx:1-8`, layout/page SEO | SEO structured data | Server-rendered script | No | C | N/A | No | None | Low | Keep for SEO | High |
| D01 | Multi-vendor event dispatch | `analytics.ts:100-116` | Fan out events | Runtime globals | Replace | D | dataLayer-only app helper | Yes | High | Medium | Reduces app coupling | Critical |
| D02 | Direct GA4 + GTM potential | `Analytics.tsx:30-44`, `analytics.ts:100-108` | Duplicate measurement path | Env-controlled | Remove duplicate | D | GTM-only GA4 | Yes | High | Medium | Cleaner loading | Critical |
| D03 | RFQ success naming split | `RfqEngine.tsx:192-199` | One lead sends two conversion-like events | App events | Replace | D | One `rfq_submit`, GTM fans out | Yes | High | Low/Medium | Cleaner reporting | High |

## 11. Items That Can Move Fully to GTM

1. GA4 Google tag and GA4 event tags.
2. Plausible script if retained.
3. Microsoft Clarity script.
4. Generic phone/email/WhatsApp click detection after adding stable context attributes or using URL triggers.
5. Outbound link clicks for Instagram and Google Maps.
6. File-download tracking when real datasheet links exist.
7. Scroll-depth tracking, only if GA4 enhanced measurement is not also duplicating it.

## 12. Items That Require Application dataLayer Events

Recommended app event contract examples:

```ts
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "rfq_submit",
  event_id: "generated_unique_id",
  page_path: "/fa/rfq",
  page_language: "fa",
  component_name: "rfq_form",
  form_name: "project_rfq",
  project_type: "metal_ceiling",
  ceiling_system: "linear_ceiling",
  area_range: "500-2000",
  buyer_role: "architect",
  project_stage: "design_development",
  submission_status: "success"
});
```

Use dataLayer for:

- RFQ start/step/submit/error events.
- RFQ API success and Odoo delivery status.
- System page detail views.
- Contextual CTA clicks where route, locale, component, or CTA intent matters.
- Language change.
- Future diagram/resource/accordion events.

Do not send PII: no name, phone, email, company, notes, message, uploaded file names, or raw detailed location values to GTM/GA4.

## 13. Items That Must Remain in the Application

- CRM/Odoo submission and all private env vars.
- RFQ validation, lead classification, rate limiting, honeypot, file limits.
- Actual form submission and UI rendering.
- Functional phone/email/WhatsApp links.
- SEO metadata, canonical URLs, hreflang, JSON-LD, sitemap, robots.
- Middleware redirects.
- Consent banner UI/persistence if added.

Important distinction: GTM should manage measurement and marketing tags. GTM should not submit RFQs, deliver CRM leads, validate forms, hold secrets, render UI, manage SEO, or process server-side business logic.

## 14. Items That Should Be Removed

After migration and validation only:

- Direct GA4 `gtag.js` loader and config.
- Direct Plausible loader if GTM manages Plausible.
- Direct Clarity loader if GTM manages Clarity.
- Direct vendor calls from `trackEvent()` to `gtag`, `plausible`, and `clarity`.
- One of `rfq_submit_success`/`generate_lead` as a conversion source. Prefer one canonical `rfq_submit` dataLayer event, with GTM sending GA4 `generate_lead` and Ads conversion tags.

## 15. Duplicate and Conflict Risks

| Risk | Evidence | Impact | Fix |
|---|---|---|---|
| Direct GA4 plus GTM GA4 | `Analytics.tsx:30-44` | Duplicate page_view and events | Final state: GTM-only GA4. |
| Direct vendor dispatch plus GTM | `analytics.ts:100-116` | Duplicate custom events | dataLayer-only helper. |
| RFQ double conversion | `RfqEngine.tsx:192-199` | Lead inflation | One `rfq_submit` event with `event_id`. |
| Dev duplicate mount events | `TrackView.tsx:17-20`, `reactStrictMode: true` | QA confusion | Test production build; dedupe with `event_id` if needed. |
| Scroll tracking overlap | No scroll currently; GA4/GTM future | Duplicate scroll events | Use either GA4 enhanced measurement or GTM scroll tags, not both. |
| Consent overwritten | No consent code currently | Invalid tag state | Implement Consent Initialization defaults before tags. |

## 16. Privacy and Consent Findings

Confirmed:

- No cookie banner or consent platform found.
- No Google Consent Mode v2 implementation found.
- No `document.cookie` usage found.
- UTM parameters are captured to `sessionStorage` (`src/lib/analytics.ts:49-79`).
- RFQ form requires a project/contact consent checkbox for submission (`src/components/rfq/RfqEngine.tsx:497-505`, `src/lib/rfq.ts:161-168`), but this is not analytics-cookie consent.
- Current analytics scripts load after interaction, not after consent (`src/components/analytics/Analytics.tsx:30-61`).
- RFQ analytics payload avoids obvious direct contact PII, but includes user-entered project fields such as `project_type`, `building_use`, `country`, `buyer_role`, and `project_stage` (`src/components/rfq/RfqEngine.tsx:92-101`).

Technical consent architecture recommendation:

1. Add a consent banner/UI in the application, not inside GTM.
2. Persist consent choices first-party.
3. Push consent updates to GTM.
4. In GTM, set default denied for `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` until consent is known.
5. Load Clarity/session tools only after analytics consent.
6. Load Ads/remarketing tags only after advertising consent.
7. Keep RFQ business consent separate from analytics/ad consent.
8. Prevent PII in dataLayer by contract and code review.

## 17. Performance Findings

Moving scripts to GTM does not automatically make the site faster.

What improves:

- Direct vendor-loader code can be removed from the app.
- Tags can be delayed until consent, interaction, route, or custom events.
- Heavy tools like Clarity can be prevented from loading on every route.

What does not disappear:

- GA4, GTM, Clarity, and Plausible network requests still exist if fired by GTM.
- GTM itself adds a container request.
- Poorly configured GTM can load more JavaScript than the current setup.

Script-by-script:

| Script | Current priority | Every route? | Delay possible? | Bundle/network note |
|---|---|---:|---:|---|
| GTM | `afterInteractive` | Yes when env set | Consent defaults can run before tags | Required if GTM used. |
| GA4 direct | `afterInteractive` | Yes when env set | Yes, via GTM/consent | Remove direct loader; network remains if GA4 fires. |
| Plausible | `afterInteractive defer` | Yes when env set | Yes | Move/condition if retained. |
| Clarity | `afterInteractive async` | Yes when env set | Yes, strongly recommended | Delay until consent; maybe sample/route limit. |

## 18. Recommended dataLayer Contract

Common parameters:

| Parameter | Type | Required | Notes |
|---|---|---:|---|
| `event` | string | Yes | Snake_case, vendor-neutral. |
| `event_id` | string | For conversions | Generate for dedupe. |
| `page_path` | string | Yes | Include locale path as rendered. |
| `page_language` | string | Yes | `fa`, `en`, `ar`, `ru`. |
| `page_title` | string | Optional | Avoid user-entered PII. |
| `environment` | string | Yes in GTM | `production`, `preview`, `development`. |
| `component_name` | string | For app events | Example: `rfq_form`, `header`, `footer`. |
| `section_name` | string | Optional | Example: `hero`, `mobile_action_bar`. |
| `cta_id` | string | For CTA | Stable ID, not translated text. |
| `cta_text` | string | Optional | Useful but avoid over-reliance due localization. |
| `form_name` | string | For forms | Example: `project_rfq`. |
| `submission_status` | string | For submit events | `success`, `error`, `validation_error`. |
| `project_type` | string | RFQ | Normalize to enum where possible. |
| `ceiling_system` | string | RFQ/system | Slug. |
| `area_range` | string | RFQ | Use buckets only. |
| `buyer_role` | string | RFQ | Enum value. |
| `project_stage` | string | RFQ | Enum value. |
| `lead_source` | string | Conversion | Example: `rfq`. |

Event-specific examples:

| Event | Parameters |
|---|---|
| `rfq_start` | `event_id`, `form_name`, `project_type`, `ceiling_system`, `page_language`, `page_path` |
| `rfq_step_complete` | `step_number`, `step_name`, `form_name`, `project_type`, `ceiling_system` |
| `rfq_submit` | `event_id`, `form_name`, `submission_status`, `project_id`, `lead_source`, `project_type`, `ceiling_system`, `area_range`, `buyer_role`, `project_stage` |
| `rfq_submit_error` | `event_id`, `form_name`, `submission_status`, `error_type` |
| `phone_click` | `component_name`, `section_name`, `cta_id`, `link_url_type=tel` |
| `whatsapp_click` | `component_name`, `section_name`, `cta_id`, `link_domain=wa.me` |
| `email_click` | `component_name`, `section_name`, `cta_id`, `link_url_type=mailto` |
| `cta_click` | `component_name`, `section_name`, `cta_id`, `cta_text`, `destination_path` |
| `language_change` | `from_language`, `to_language`, `page_path` |

## 19. Recommended GTM Container Structure

Folders:

- `00 - Consent`
- `10 - Core Analytics`
- `20 - Conversions`
- `30 - Engagement`
- `40 - Advertising`
- `50 - UX Tools`
- `90 - Utilities`
- `99 - Deprecated`

Variables:

- `Constant - GA4 Measurement ID`
- `Constant - Google Ads Conversion ID`
- `Lookup - Environment`
- `DLV - event_id`
- `DLV - page_language`
- `DLV - page_path`
- `DLV - component_name`
- `DLV - section_name`
- `DLV - cta_id`
- `DLV - cta_text`
- `DLV - form_name`
- `DLV - submission_status`
- `DLV - project_type`
- `DLV - ceiling_system`
- `DLV - area_range`
- `DLV - buyer_role`
- `DLV - project_stage`
- `DLV - consent_state`

Triggers:

- `Consent Initialization - All Pages`
- `Initialization - All Pages`
- `Page View - All Pages`
- `History Change - App Router`
- `Custom Event - rfq_start`
- `Custom Event - rfq_step_complete`
- `Custom Event - rfq_submit`
- `Custom Event - rfq_submit_error`
- `Custom Event - system_page_view`
- `Click - tel links`
- `Click - mailto links`
- `Click - WhatsApp links`
- `Click - file downloads`
- `Click - outbound links`
- `Scroll Depth - 25/50/75/90` only if not using GA4 enhanced scroll.

Tags:

- `Consent - Default`
- `Consent - Update`
- `Google Tag - GA4`
- `GA4 Event - dataLayer event`
- `GA4 Event - phone_click`
- `GA4 Event - whatsapp_click`
- `GA4 Event - email_click`
- `GA4 Event - file_download`
- `Google Ads - Conversion Linker`
- `Google Ads - RFQ Submit Conversion`
- `Microsoft Clarity - Loader` only if required and consented
- `Meta Pixel - Base` only if required later
- Avoid custom HTML unless no native/community template is appropriate.

Naming convention:

- Tags: `TAG - Vendor - Event/Purpose`, e.g. `TAG - GA4 - rfq_submit`.
- Triggers: `TRG - Type - Condition`, e.g. `TRG - CE - rfq_submit`.
- Variables: `VAR - Type - Name`, e.g. `VAR - DLV - project_type`.
- Events: snake_case, vendor-neutral, e.g. `rfq_submit`, not `GA4Lead`.

## 20. Recommended GA4 Event and Key-Event Structure

| GA4 event | Source event | Key event? | Notes |
|---|---|---:|---|
| `page_view` | GTM page/history | No | Ensure one per route. |
| `rfq_start` | dataLayer | No | Funnel start. |
| `rfq_step_complete` | dataLayer | No | Include step params. |
| `generate_lead` or `rfq_submit` | dataLayer `rfq_submit` | Yes | Choose one GA4 key event. If using GA4 recommended event, send `generate_lead` from GTM, not app plus GTM. |
| `rfq_submit_error` | dataLayer | No | Diagnostics. |
| `phone_click` | GTM click/dataLayer | Yes | High-intent contact. |
| `whatsapp_click` | GTM click/dataLayer | Yes | High-intent contact. |
| `email_click` | GTM click/dataLayer | Usually no | Mark key only if business treats email click as lead. |
| `cta_click` | data attributes/app | No | Engagement. |
| `system_page_view` | dataLayer | No | Content engagement. |
| `file_download` | GTM download | No or Yes per resource | Key only for high-value technical downloads. |

## 21. Recommended Google Ads Conversion Structure

Google Ads code is not currently implemented in source. If Google Ads is used later:

| Conversion | Trigger | Deduplication | Notes |
|---|---|---|---|
| RFQ submit | `rfq_submit` success only | `event_id` | Primary conversion. Do not trigger on form start or button click. |
| Phone click | `phone_click` | Optional event ID | Secondary conversion or observation. |
| WhatsApp click | `whatsapp_click` | Optional event ID | Secondary conversion or observation. |
| Email click | `email_click` | Optional | Usually secondary, not primary. |

Do not fire Ads conversions from both CTA click and RFQ success for the same business lead unless they are intentionally separate conversion actions.

## 22. Migration Phases

### Phase 0 - Measurement Inventory

- Confirm production IDs: GTM container, GA4 property, Google Ads account/conversion labels if any, Clarity/Plausible ownership.
- Confirm conversion definitions: RFQ success vs contact clicks vs CTA clicks.
- Export any existing GTM container before edits.
- Confirm privacy/consent requirements with stakeholders.

### Phase 1 - GTM Foundation

- Use one GTM container.
- Initialize `dataLayer` before GTM where needed.
- Configure GTM environments.
- Add Consent Mode defaults and update flow.
- Establish naming conventions and folders.

### Phase 2 - Core Analytics

- Move GA4 config/page_view into GTM.
- Validate App Router page views with history changes.
- Keep direct GA4 disabled during GTM test or isolate environments.
- Remove direct GA4 only after production validation.

### Phase 3 - Conversion Events

- Replace RFQ success with canonical `rfq_submit` dataLayer event.
- Add `event_id`.
- Configure GA4 key event and optional Google Ads conversion.
- Add phone, WhatsApp, email click triggers.
- Add stable CTA context attributes or app pushes.

### Phase 4 - Engagement Events

- Add system/project/resource/page interactions.
- Add language change.
- Add FAQ/details tracking.
- Add downloads when real assets exist.
- Add scroll tracking only once.

### Phase 5 - Third-Party Tools

- Move Clarity to GTM if still needed.
- Move Plausible to GTM if still needed.
- Add Meta/LinkedIn/Hotjar only if business explicitly requires them.
- Gate all UX/ad tools by consent.

### Phase 6 - Cleanup

- Remove direct duplicate scripts.
- Remove direct vendor dispatch from `trackEvent`.
- Remove obsolete analytics env vars if no longer used.
- Document the dataLayer contract.
- Update CSP if enforced.

### Phase 7 - QA

- GTM Preview.
- Google Tag Assistant.
- GA4 DebugView.
- Browser Network panel.
- Console inspection of `window.dataLayer`.
- Consent state tests.
- Persian, English, Arabic, Russian route tests.
- Mobile tests.
- Duplicate-event tests.
- RFQ success/failure tests.
- Odoo success/failure tests without exposing secrets.

## 23. QA and Validation Checklist

- One GTM container loads once per page.
- No direct GA4 request after migration unless intentionally enabled.
- One GA4 page_view per route.
- `rfq_submit` fires only after API success.
- `rfq_submit_error` fires only on failure.
- `event_id` present for conversions.
- No PII appears in `dataLayer`.
- Consent defaults fire before vendor tags.
- Clarity does not load before analytics consent.
- Ads tags do not load before ad consent.
- Phone, WhatsApp, email clicks fire once.
- Footer email links are tracked consistently.
- Locale switch emits correct `from_language`/`to_language`.
- CSP report-only console is checked for blocked/reportable sources.

## 24. Risks and Rollback Strategy

Risks:

- Conversion undercount if direct GA4 is removed before GTM events are validated.
- Conversion overcount if direct and GTM vendor tags overlap.
- Loss of RFQ context if RFQ events are replaced by generic DOM click triggers.
- Consent regressions if tags load before defaults.
- CSP breakage if report-only policy becomes enforced without external origins.

Rollback:

1. Keep direct analytics code until GTM Preview and production QA pass.
2. Use GTM environments and versioning.
3. Publish GTM in phases, not all tags at once.
4. Retain old GA4 property/event comparison temporarily, but do not mark both as production conversions.
5. Roll back by reverting GTM container version first; application code cleanup should happen last.

## 25. Final Prioritized Action List

1. Decide GTM as the single vendor-tag manager and prevent direct GA4 + GTM GA4 overlap.
2. Implement Consent Mode and app-side consent UI before adding advertising/session-recording tags.
3. Replace `trackEvent()` vendor fan-out with dataLayer-only behavior in a future migration.
4. Standardize RFQ success as one canonical `rfq_submit` event with `event_id`.
5. Add stable `data-analytics-event`, `data-cta-id`, `data-section`, and `data-component` attributes for contact/CTA/download tracking.
6. Move Clarity/Plausible loaders to GTM only if those tools remain business requirements.
7. Update CSP allowlists if CSP becomes enforced.
8. Validate all locales and App Router navigation in GTM Preview and GA4 DebugView.

## 26. Evidence Appendix

Key source references:

- `package.json:13-20`: Next/React dependencies.
- `package.json:6-12`: scripts for build/lint/typecheck.
- `.env.example:34-42`: optional analytics env vars.
- `.env.example:6-27`: Odoo env vars.
- `next.config.mjs:6-8`: React Strict Mode.
- `next.config.mjs:41-70`: report-only CSP and script/connect/frame policy.
- `vercel.json:1-5`: Vercel framework/region.
- `src/app/[locale]/layout.tsx:123-134`: Analytics component and GTM noscript.
- `src/app/(fa)/layout.tsx:1-20`: default Persian route delegates to locale layout.
- `src/components/analytics/Analytics.tsx:18-64`: GTM, GA4, Plausible, Clarity loaders.
- `src/lib/analytics.ts:49-79`: UTM capture/sessionStorage.
- `src/lib/analytics.ts:85-120`: multi-vendor event dispatcher.
- `src/lib/analytics.ts:122-145`: RFQ/CTA/contact helper events.
- `src/components/analytics/TrackView.tsx:17-20`: mount-time event.
- `src/components/analytics/TrackedTel.tsx:25-31`: phone click event.
- `src/components/rfq/RfqEngine.tsx:92-108`: RFQ event params and start.
- `src/components/rfq/RfqEngine.tsx:140-162`: validation/file events.
- `src/components/rfq/RfqEngine.tsx:187-208`: RFQ submit success/error and generate_lead.
- `src/components/rfq/RfqEngine.tsx:497-505`: RFQ consent checkbox.
- `src/app/api/rfq/submit/route.ts:21-87`: rate limit/file parsing.
- `src/app/api/rfq/submit/route.ts:98-175`: validation and request handling.
- `src/app/api/rfq/submit/route.ts:191-255`: Odoo lead delivery.
- `src/lib/odoo/client.ts:90-160`: private env and JSON-RPC request.
- `src/components/contact/ContactRouting.tsx:25-77`: tracked contact CTAs.
- `src/components/layout/MobileActionBar.tsx:28-41`: mobile CTA and WhatsApp events.
- `src/app/[locale]/contact/page.tsx:42-46`, `src/app/[locale]/contact/page.tsx:85-101`: contact tel/mail/social links.
- `src/components/layout/Footer.tsx:162-182`, `src/components/layout/Footer.tsx:211-242`: footer contact/social links.
- `src/components/layout/Header.tsx:31-40`: scroll/menu state, no tracking.
- `src/components/layout/Header.tsx:114-123`, `src/components/layout/Header.tsx:158-162`: header/mobile RFQ CTAs currently untracked.
- `src/components/layout/LocaleSwitcher.tsx:18-22`: language switch without tracking.
- `src/components/system/DatasheetCta.tsx:19-29`: future download link support.
- `src/components/shared/JsonLd.tsx:1-8`: server-rendered JSON-LD script.

Verification results:

- Initial `git status --short`: clean.
- `npm run typecheck`: passed.
- `npm run lint`: passed.

