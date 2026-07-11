# Avizsazeh Analytics Phase 2 Consent Foundation

Date: 2026-07-11  
Project: `avizsazeh.ir`  
Scope: first-party consent foundation, analytics gating, multilingual consent UI, and GTM Preview readiness. Production GTM activation was not performed.

## 1. Summary

Phase 2 adds a first-party consent layer that gates analytics loading and event transport before either GTM or direct GA4 can initialize.

Confirmed outcomes:

- Consent is stored in a first-party cookie: `avizsazeh_consent_v1`.
- Consent defaults to denied for analytics and marketing on first visit.
- Analytics and GTM remain mutually exclusive.
- No analytics scripts load before analytics consent.
- `page_view` now fires explicitly only after consent, and then on pathname changes.
- RFQ success remains canonical as `rfq_submit`.
- Direct GA4 still maps `rfq_submit` to `generate_lead`; GTM keeps `rfq_submit` for future mapping.
- Plausible and Clarity remain removed from runtime.

Current local transport state remains `disabled` because no valid public analytics env vars are present locally.

## 2. Confirmed Baseline

Phase 1 already established:

- `direct_ga4`, `gtm`, and `disabled` are the only analytics transports.
- GTM takes precedence when both public IDs exist.
- Direct GA4 and GTM are mutually exclusive.
- Direct GA4 uses `send_page_view:false`.
- App Router page views are emitted through `PageViewTracker`.
- `rfq_submit_success` was removed and `rfq_submit` became the canonical success event.
- Plausible and Clarity runtime loaders were removed.

Phase 2 keeps all of that intact and adds consent gating around the same transport selection rules.

## 3. Files Changed

Runtime and configuration:

- `.env.example:34-41`
- `src/lib/consent.ts:1-320`
- `src/lib/analytics.ts:1-197`
- `src/components/analytics/Analytics.tsx:1-71`
- `src/components/analytics/PageViewTracker.tsx:1-72`
- `src/app/[locale]/layout.tsx:1-168`
- `src/components/layout/Footer.tsx:1-279`
- `src/i18n/request.ts:1-19`
- `messages/en.json:660`
- `messages/fa.json:660`
- `messages/ar.json:672`
- `messages/ru.json:660`

New consent UI:

- `src/components/consent/ConsentBootstrap.tsx:1-52`
- `src/components/consent/ConsentProvider.tsx:1-38`
- `src/components/consent/ConsentBanner.tsx:1-72`
- `src/components/consent/ConsentPreferences.tsx:1-202`
- `src/components/consent/ConsentSettingsButton.tsx:1-19`

Documentation:

- `reports/analytics/avizsazeh-analytics-phase-2-consent.md`
- `reports/analytics/avizsazeh-gtm-container-setup.md`

The existing Phase 1 report was updated with a pointer to this report.

## 4. Consent Storage Design

Storage choice: first-party cookie.

Why this approach:

- It is readable before analytics initialization.
- It survives locale changes and full page loads.
- It can be read on the server during layout rendering.
- It keeps consent state outside the analytics payload.

Implementation details:

- Storage key: `avizsazeh_consent_v1`
- Schema version: `1`
- Expiry: 1 year
- Path: `/`
- SameSite: `Lax`
- Secure: set on HTTPS
- Invalid, expired, or malformed records are treated as no decision

Source:

- `src/lib/consent.ts:1-320`
- `src/app/[locale]/layout.tsx:123-163`

## 5. Consent Schema

Normalized consent object:

```ts
type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
};
```

Derived statuses:

- `unknown`
- `analytics_granted`
- `analytics_denied`
- `all_granted`
- `custom`

The derived status is computed from the normalized object. It is not stored as conflicting state.

Source:

- `src/lib/consent.ts:5-56`
- `src/lib/consent.ts:161-177`

## 6. Default Consent State

On a first visit with no saved decision, the bootstrap sets Google consent to:

- `analytics_storage: denied`
- `ad_storage: denied`
- `ad_user_data: denied`
- `ad_personalization: denied`
- `security_storage: granted`

The application does not load analytics scripts until analytics consent is granted.

Source:

- `src/components/consent/ConsentBootstrap.tsx:25-42`
- `src/lib/consent.ts:279-288`

## 7. Consent Update Behavior

Central update path:

- `updateConsent({ analytics, marketing })`
- `saveConsent(choice)`
- `clearConsent()`

Behavior:

- Consent is persisted to the cookie.
- Google consent is updated through `gtag('consent', 'update', ...)`.
- A custom internal app event is dispatched: `avizsazeh:consent-change`
- The event payload contains only normalized booleans, status, revision, and schema version.

Source:

- `src/lib/consent.ts:213-248`
- `src/lib/consent.ts:291-320`

## 8. Consent Withdrawal Behavior

Withdrawal is handled as a state change to denied analytics / denied marketing.

Effects:

- Future analytics events stop.
- Future page views stop.
- Google consent updates to denied.
- The site continues to function normally.
- No page reload is required for the current implementation.

Queued direct GA4 events are cleared if the GA4 loader becomes ready after consent has already been revoked.

Source:

- `src/lib/consent.ts:219-248`
- `src/lib/analytics.ts:142-152`
- `src/components/analytics/PageViewTracker.tsx:48-69`

## 9. Analytics-Loader Gating

Loader selection is still driven by the Phase 1 transport rules, but now gated by consent:

1. If analytics consent is not granted, load nothing.
2. If analytics consent is granted and `NEXT_PUBLIC_GTM_ID` is valid, load GTM only.
3. If analytics consent is granted and GTM is absent but `NEXT_PUBLIC_GA4_ID` is valid, load direct GA4 only.
4. If no valid public ID exists, remain disabled.

GTM and direct GA4 cannot load together.

Source:

- `src/components/analytics/Analytics.tsx:12-68`
- `src/app/[locale]/layout.tsx:131-163`
- `src/lib/analytics-config.ts`

## 10. Page-View Behavior After Consent

The page-view tracker now sends explicit page views only when analytics consent is granted.

Behavior:

- One page view on the current route after consent is granted.
- One page view on subsequent pathname changes.
- No replay of old queued interaction events.
- No page view for the consent modal itself.
- Query strings and hashes remain excluded.
- Sanitized `page_location`, `page_referrer`, `page_title`, and `page_language` are included.

Deduplication:

- The tracker keeps a module-scoped route key.
- The key is reset on consent withdrawal.
- React Strict Mode remounts do not duplicate the same route view.

Source:

- `src/components/analytics/PageViewTracker.tsx:8-69`
- `src/lib/analytics.ts:155-163`

## 11. Direct GA4 Behavior

Direct GA4 remains supported only as a fallback transport when consent is granted and no valid GTM ID exists.

Direct-mode specifics:

- `gtag('config', measurementId, { anonymize_ip: true, send_page_view: false })`
- Page views are explicit, not automatic.
- `rfq_submit` maps to `generate_lead` only in the direct transport.

Source:

- `src/components/analytics/Analytics.tsx:57-66`
- `src/lib/analytics.ts:23-25, 138-152`

## 12. GTM Behavior

GTM remains loader-only in the application.

Current phase behavior:

- GTM loads only after analytics consent.
- The noscript iframe is only emitted when analytics consent is already present.
- Application events remain canonical app events, not vendor-specific events.

Future GTM work is documented in the container setup runbook.

Source:

- `src/components/analytics/Analytics.tsx:49-55`
- `src/app/[locale]/layout.tsx:131-145`

## 13. Disabled Behavior

Disabled mode now means:

- No analytics scripts load.
- Event helpers return safely.
- Consent UI still works.
- Site functionality remains intact.

Source:

- `src/components/analytics/Analytics.tsx:42-48`
- `src/lib/analytics.ts:99-136`

## 14. Multilingual UI

Consent UI strings were added for:

- Persian: `messages/fa.json:660`
- English: `messages/en.json:660`
- Arabic: `messages/ar.json:672`
- Russian: `messages/ru.json:660`

The footer now contains a persistent settings trigger so the user can reopen consent preferences from any locale.

Source:

- `messages/*.json`
- `src/components/layout/Footer.tsx:262-275`
- `src/components/consent/ConsentSettingsButton.tsx:1-19`

## 15. Accessibility

Implemented accessibility behaviors:

- keyboard focus trap in the preferences dialog
- Escape-to-close
- focus restoration after close
- dialog semantics with `role="dialog"` and `aria-modal="true"`
- clear visible buttons for accept / reject / manage
- mobile-safe fixed banner placement above the sticky action bar

Source:

- `src/components/consent/ConsentPreferences.tsx:10-202`
- `src/components/consent/ConsentBanner.tsx:26-72`

## 16. CSP Review

The report-only CSP remains narrowly scoped and already allows the needed Google endpoints for the current direct GA4 transport and future GTM loader:

- `www.googletagmanager.com`
- `www.google-analytics.com`
- `region1.google-analytics.com`

No new vendor origins were added in this phase.

Source:

- `next.config.mjs:41-56`

## 17. Environment-Variable Behavior

`.env.example` now documents the transport choice clearly:

- use one transport only
- GTM takes precedence when both IDs exist
- do not paste a GTM snippet manually
- use Preview first, Production later

The file still exposes only public placeholders, not secret values.

Source:

- `.env.example:34-41`

## 18. Tests Performed

Automated checks:

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm run build` — passed
- `git diff --check` — passed

Runtime-source searches:

- no runtime `window.plausible`
- no runtime `window.clarity`
- no runtime `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- no runtime `NEXT_PUBLIC_CLARITY_ID`
- no runtime `rfq_submit_success`

Centralized runtime references remain in the approved analytics/consent modules only.

## 19. Preview-Environment Setup Instructions

To test GTM in Preview without touching Production:

1. Set `NEXT_PUBLIC_GTM_ID=GTM-KKXLZFLG` in the Vercel Preview environment only.
2. Leave Production environment variables unchanged.
3. Verify consent banner behavior in Preview.
4. Verify GTM Preview loads after consent.
5. Do not publish the container until QA passes.

The repository code is already structured so GTM can take precedence in Preview while direct GA4 stays off.

## 20. Remaining GTM Manual Configuration

Still required inside the GTM container:

- create the documented folders
- create the documented variables
- create custom-event triggers for page view and RFQ events
- add the Google tag with `send_page_view:false`
- add explicit page-view and conversion tags
- inspect the current container before making changes
- pause duplicate GA4 tags if the container already contains them
- verify consent state in Preview before publishing

## 21. Remaining Production Activation Steps

Production activation is intentionally out of scope for this phase.

When the business approves a later rollout:

- promote the Preview-tested GTM environment variable to Production
- verify no duplicate GA4 source remains
- confirm page-view and RFQ counts in Tag Assistant / GA4 DebugView
- publish the container only after Preview QA is clean

## 22. Risks and Rollback

Risks:

- Consent state depends on the bootstrap script running before analytics components hydrate.
- Direct GA4 script loading still depends on `window.gtag`, which is now provided by the consent bootstrap.
- If consent is granted and then revoked before the GA4 loader finishes, the queue is cleared but already-loaded third-party code is not unloaded.

Rollback:

1. Remove the consent UI components from the layout.
2. Restore the phase-1 analytics loader behavior.
3. Revert `src/lib/consent.ts` and related message files.
4. Leave Vercel Production environment unchanged unless a separate deployment task requires a later change.

