# Avizsazeh GTM Container Setup Runbook

Container: `GTM-KKXLZFLG`  
GA4 measurement ID: `G-QD70DM5MEJ`  
Scope: manual GTM Preview setup only. Do not publish until Preview QA passes.

## 1. Guardrails

- Do not paste a second GTM installation snippet into the app.
- Do not hard-code `GTM-KKXLZFLG` or `G-QD70DM5MEJ` into runtime source.
- Do not publish the container during this setup.
- Do not assume the container is empty.
- First export the current container version before editing anything.
- Pause or remove duplicate GA4 tags before enabling new ones.
- Keep Production and Preview separate.

## 2. Preflight

1. Open the current container and export the latest version.
2. Inspect all existing tags, triggers, variables, folders, and consent settings.
3. Confirm whether the container already has:
   - a Google tag
   - GA4 page-view tags
   - GA4 conversion tags
   - Ads tags
   - Meta/Clarity/Plausible tags
4. Pause duplicates before creating new tags.
5. Verify the Preview environment variable will be used first:
   - `NEXT_PUBLIC_GTM_ID=GTM-KKXLZFLG`
6. Confirm Production remains unchanged until a later approved rollout.

## 3. Required Folders

Create these folders exactly:

- `00 - Consent`
- `10 - Core Analytics`
- `20 - Conversions`
- `30 - Engagement`
- `40 - Advertising`
- `50 - UX Tools`
- `90 - Utilities`
- `99 - Deprecated`

Suggested usage:

- `00 - Consent`: Consent Mode defaults and updates
- `10 - Core Analytics`: Google tag, page_view, base analytics plumbing
- `20 - Conversions`: RFQ and lead conversions
- `30 - Engagement`: scroll, download, CTA, navigation, contact events
- `40 - Advertising`: reserved, empty until business-approved
- `50 - UX Tools`: reserved for future UX/session tools
- `90 - Utilities`: variables, helpers, debug tags
- `99 - Deprecated`: paused or retired tags

## 4. Required Variables

Create these variables exactly:

| Variable name | Type | Purpose |
|---|---|---|
| `VAR - Constant - GA4 Measurement ID` | Constant | `G-QD70DM5MEJ` |
| `VAR - DLV - event_id` | Data Layer Variable | Deduplication ID |
| `VAR - DLV - page_path` | Data Layer Variable | Pathname only |
| `VAR - DLV - page_location` | Data Layer Variable | Sanitized full location |
| `VAR - DLV - page_referrer` | Data Layer Variable | Sanitized referrer |
| `VAR - DLV - page_title` | Data Layer Variable | Document title |
| `VAR - DLV - page_language` | Data Layer Variable | `fa`, `en`, `ar`, `ru` |
| `VAR - DLV - component_name` | Data Layer Variable | Component context |
| `VAR - DLV - section_name` | Data Layer Variable | Section context |
| `VAR - DLV - cta_id` | Data Layer Variable | CTA identifier |
| `VAR - DLV - form_name` | Data Layer Variable | Form identifier |
| `VAR - DLV - submission_status` | Data Layer Variable | `success` / `error` / etc. |
| `VAR - DLV - project_type` | Data Layer Variable | Normalized project type |
| `VAR - DLV - ceiling_system` | Data Layer Variable | Selected ceiling system |
| `VAR - DLV - area_range` | Data Layer Variable | Sanitized area bucket |
| `VAR - DLV - buyer_role` | Data Layer Variable | Normalized buyer role |
| `VAR - DLV - project_stage` | Data Layer Variable | Normalized project stage |

Do not create variables for name, phone, email, message, file name, address, or other PII.

## 5. Required Triggers

Use these Custom Event triggers:

- `TRG - CE - page_view`
- `TRG - CE - rfq_start`
- `TRG - CE - rfq_step_complete`
- `TRG - CE - rfq_submit`
- `TRG - CE - rfq_submit_error`
- `TRG - CE - phone_click`
- `TRG - CE - whatsapp_click`
- `TRG - CE - email_click`
- `TRG - CE - cta_click`
- `TRG - CE - system_page_view`

Rules:

- Do not add a History Change trigger for page views.
- Do not add a generic All Elements click trigger for events already emitted by the app.
- Prefer app-emitted custom events over brittle DOM selectors when structured context is needed.

## 6. Google Tag

Create one tag:

- `TAG - Google - Base`

Configuration:

- Measurement ID: `G-QD70DM5MEJ`
- `send_page_view: false`
- Consent requirement: `analytics_storage`

Reason:

- The application already emits explicit SPA `page_view` events.
- Automatic pageviews would duplicate the app-emitted page views.

## 7. Explicit Page-View Tag

Create one tag:

- `TAG - GA4 - page_view`

Trigger:

- `TRG - CE - page_view`

Map:

- `page_path`
- `page_location`
- `page_referrer`
- `page_title`
- `page_language`

Important:

- Do not add a second SPA page-view source.
- In the GA4 web stream, inspect Enhanced Measurement.
- If “Page changes based on browser history events” is enabled, verify it does not create a second page-view source.
- Keep only one canonical SPA page-view mechanism.

## 8. RFQ Conversion Tag

Create one tag:

- `TAG - GA4 - generate_lead`

Trigger:

- `TRG - CE - rfq_submit`

GA4 event name:

- `generate_lead`

Map safe parameters only:

- `event_id`
- `form_name`
- `submission_status`
- `project_type`
- `ceiling_system`
- `area_range`
- `buyer_role`
- `project_stage`
- `page_path`
- `page_language`
- `component_name`

Do not map:

- name
- phone
- email
- company
- message
- notes
- file_name
- address

Key-event guidance:

- Mark only `generate_lead` as the primary RFQ key event unless the business intentionally defines a different conversion.
- Do not create a second GA4 `rfq_submit` conversion in parallel.

## 9. Other Event Tags

Recommended approach:

- Use individual GA4 event tags for the critical conversion events.
- Use controlled generic mapping only for lower-risk engagement events when the allowlist is explicit.

Examples:

- `phone_click`
- `whatsapp_click`
- `email_click`
- `cta_click`
- `system_page_view`

Do not forward arbitrary variables.

## 10. Consent Configuration in GTM

The app is responsible for consent collection and persistence.

In GTM Preview, verify that the container receives the consent state before analytics tags fire:

- `analytics_storage`
- `ad_storage`
- `ad_user_data`
- `ad_personalization`

Until future marketing consent exists and marketing tags are approved:

- do not create Advertising-folder tags
- do not create Google Ads tags
- do not create remarketing tags
- do not create Meta tags

## 11. Preview QA Checklist

1. Set Preview-only env var:
   - `NEXT_PUBLIC_GTM_ID=GTM-KKXLZFLG`
2. Verify GTM loads once in Preview only.
3. Verify direct `gtag.js?id=G-QD70DM5MEJ` does not load from the app when GTM is selected.
4. Verify app-emitted events appear in `dataLayer`.
5. Verify GTM Preview shows consent state before tags fire.
6. Verify no duplicate page views.
7. Verify `rfq_submit` maps to `generate_lead` only once.
8. Verify no marketing tags fire.
9. Verify no blocked CSP sources remain for the chosen tags.
10. Verify mobile, locale, and navigation flows.

## 12. Publish Criteria

Do not publish until all of these are true:

- Preview shows one canonical page-view path.
- RFQ success produces one conversion path only.
- Consent state is correct and stable.
- No duplicate GA4 tags remain active.
- No Advertising tags are present.
- No CSP violations block the chosen tags.

