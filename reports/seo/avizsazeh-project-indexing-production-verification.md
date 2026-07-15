# Avizsazeh Project Indexing Production Verification

Audit date: 2026-07-15  
Production host: `https://www.avizsazeh.ir`  
Scope: read-only production verification after project-indexing remediation.

## 1. Production Deployment Status

The active Vercel Production deployment for `www.avizsazeh.ir` is current and contains the project-indexing remediation.

| Field | Evidence |
| --- | --- |
| Deployment ID | `dpl_HqZWbTTGqH5wWPb1iD2jPu9mS2St` |
| Deployment URL | `https://avizsazeh-website-jdds33o8z-rezachidotnets-projects.vercel.app` |
| Target | Production |
| Status | Ready |
| Created | 2026-07-15 23:30:15 Asia/Tehran |
| Build started | 2026-07-15T20:00:16Z |
| Git commit | `6d076f7` |
| Git branch | `main` |
| Production aliases | `https://www.avizsazeh.ir`, `https://avizsazeh.ir`, `https://avizsazeh-website-rezachidotnets-projects.vercel.app`, `https://avizsazeh-website-git-main-rezachidotnets-projects.vercel.app` |

Vercel build logs show:

```text
Cloning github.com/rezachidotnet/avizsazeh-website (Branch: main, Commit: 6d076f7)
Deployment completed
```

Result: `www.avizsazeh.ir` points to the updated deployment.

## 2. Project-Detail HTTP Matrix

All 8 localized Tier B project detail URLs were tested live with redirect handling disabled on canonical URLs.

| URL | Status | Robots | Canonical | Hreflang | X-Robots conflict | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `https://www.avizsazeh.ir/projects/bushehr-mall` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/en/projects/bushehr-mall` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/ar/projects/bushehr-mall` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/ru/projects/bushehr-mall` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/projects/imam-khomeini-airport` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/en/projects/imam-khomeini-airport` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/ar/projects/imam-khomeini-airport` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |
| `https://www.avizsazeh.ir/ru/projects/imam-khomeini-airport` | 200 | `noindex, follow` | self | `fa`, `en`, `ar`, `ru`, `x-default` | none | Pass |

Canonical URLs did not redirect. Persian canonical project URLs are unprefixed. The legacy `/fa/projects/bushehr-mall` path returns `308` to `/projects/bushehr-mall`, which matches the accepted locale routing strategy.

## 3. Robots Verification

Each project detail page exposes exactly one robots meta tag:

```html
<meta name="robots" content="noindex, follow">
```

No tested project detail route returned an `X-Robots-Tag` header. There is no conflict between header-level and HTML-level robots directives.

The 4 project listing pages expose no robots meta tag and no `X-Robots-Tag`, which means they remain indexable by default.

## 4. Canonical Verification

All project detail pages use a self-referential canonical matching the localized canonical route.

Examples:

| URL | Canonical |
| --- | --- |
| `https://www.avizsazeh.ir/en/projects/bushehr-mall` | `https://www.avizsazeh.ir/en/projects/bushehr-mall` |
| `https://www.avizsazeh.ir/projects/imam-khomeini-airport` | `https://www.avizsazeh.ir/projects/imam-khomeini-airport` |

All project listing pages also use self-referential localized canonicals:

| URL | Canonical |
| --- | --- |
| `https://www.avizsazeh.ir/projects` | `https://www.avizsazeh.ir/projects` |
| `https://www.avizsazeh.ir/en/projects` | `https://www.avizsazeh.ir/en/projects` |
| `https://www.avizsazeh.ir/ar/projects` | `https://www.avizsazeh.ir/ar/projects` |
| `https://www.avizsazeh.ir/ru/projects` | `https://www.avizsazeh.ir/ru/projects` |

## 5. Hreflang Verification

All tested project detail and project listing pages include 5 alternate links:

| Hreflang | Policy |
| --- | --- |
| `fa` | unprefixed Persian canonical |
| `en` | `/en/...` |
| `ar` | `/ar/...` |
| `ru` | `/ru/...` |
| `x-default` | unprefixed Persian canonical |

Example for Bushehr Mall:

```text
fa: https://www.avizsazeh.ir/projects/bushehr-mall
en: https://www.avizsazeh.ir/en/projects/bushehr-mall
ar: https://www.avizsazeh.ir/ar/projects/bushehr-mall
ru: https://www.avizsazeh.ir/ru/projects/bushehr-mall
x-default: https://www.avizsazeh.ir/projects/bushehr-mall
```

Result: no hreflang errors found.

## 6. Listing-Page Verification

| URL | Status | Robots | Canonical | Hreflang | Project cards | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `https://www.avizsazeh.ir/projects` | 200 | indexable by default | self | complete | present | Pass |
| `https://www.avizsazeh.ir/en/projects` | 200 | indexable by default | self | complete | present | Pass |
| `https://www.avizsazeh.ir/ar/projects` | 200 | indexable by default | self | complete | present | Pass |
| `https://www.avizsazeh.ir/ru/projects` | 200 | indexable by default | self | complete | present | Pass |

The listing pages did not inherit project-detail `noindex`. Project card links point to canonical localized project routes:

```text
/projects/imam-khomeini-airport
/projects/bushehr-mall
/en/projects/imam-khomeini-airport
/en/projects/bushehr-mall
/ar/projects/imam-khomeini-airport
/ar/projects/bushehr-mall
/ru/projects/imam-khomeini-airport
/ru/projects/bushehr-mall
```

All linked project detail targets were tested and return HTTP 200.

## 7. Sitemap Verification

Sitemap URL: `https://www.avizsazeh.ir/sitemap.xml`

| Check | Result |
| --- | --- |
| HTTP status | 200 |
| Content type | `application/xml` |
| Live sitemap URL count | 72 |
| Previous expected pre-filter count | 80, based on 8 localized project detail URLs before Tier B filtering |
| Tier B detail URLs included | no |
| `favicon.avif` included | no |
| `/fa` legacy URLs included | no |
| Static assets included | no |
| API routes included | no |
| Non-`www` URLs included | no |
| Project listing URLs included | yes, all 4 localized listing routes |
| Sitemap URL HTTP checks | all returned 200 |
| Sitemap URL redirect checks | no redirects found |

Explicit exclusions confirmed:

```text
/projects/bushehr-mall
/en/projects/bushehr-mall
/ar/projects/bushehr-mall
/ru/projects/bushehr-mall
/projects/imam-khomeini-airport
/en/projects/imam-khomeini-airport
/ar/projects/imam-khomeini-airport
/ru/projects/imam-khomeini-airport
/favicon.avif
```

## 8. Favicon Verification

URL: `https://www.avizsazeh.ir/favicon.avif`

| Check | Result |
| --- | --- |
| HTTP status | 200 |
| Content type | `image/avif` |
| `X-Robots-Tag` | absent |
| Included in sitemap | no |
| Unnecessary image noindex | no |

Rendered page metadata still references the favicon correctly:

```html
<link rel="icon" href="/favicon.avif" type="image/avif" sizes="143x142">
<link rel="icon" href="/favicon.webp" type="image/webp" sizes="143x142">
<link rel="icon" href="/icon.png" type="image/png" sizes="146x144">
<link rel="apple-touch-icon" href="/icon.png">
```

## 9. robots.txt Verification

URL: `https://www.avizsazeh.ir/robots.txt`

Live response:

```text
User-Agent: *
Allow: /
Disallow: /api/

Host: https://www.avizsazeh.ir
Sitemap: https://www.avizsazeh.ir/sitemap.xml
```

Result:

- Project detail routes are not disallowed.
- Google can crawl project detail pages and discover the `noindex, follow` directive.
- Sitemap URL is correct.
- There is no accidental global block.
- Static assets are not globally blocked.
- API routes are disallowed, as expected.

## 10. Rendered HTML Verification

Rendered production HTML was inspected for:

```text
https://www.avizsazeh.ir/en/projects/bushehr-mall
https://www.avizsazeh.ir/projects/imam-khomeini-airport
https://www.avizsazeh.ir/en/projects
```

| URL | Robots meta count | Canonical count | JSON-LD | Metadata placeholders | Result |
| --- | --- | --- | --- | --- | --- |
| `/en/projects/bushehr-mall` | 1 | 1 | `CreativeWork`, `BreadcrumbList`, `Organization`, `WebSite` | none found | Pass |
| `/projects/imam-khomeini-airport` | 1 | 1 | `CreativeWork`, `BreadcrumbList`, `Organization`, `WebSite` | none found | Pass |
| `/en/projects` | 0 | 1 | `BreadcrumbList`, `Organization`, `WebSite` | none found | Pass |

No contradictory indexing directive was found. Project detail JSON-LD did not contain pending, TBC, coming soon, under review, or visual-documentation placeholder fields.

## 11. Search Console Readiness

Sitemap readiness: `ready_to_resubmit_sitemap`

Reason:

- The live sitemap is valid XML.
- Tier B project detail URLs are excluded.
- Project listing and other indexable URLs remain included.
- No asset URLs are present.
- All included URLs tested as HTTP 200 without redirects.

Validation readiness: `ready_to_start_validation`

Reason:

- Updated pages are deployed to Production.
- Representative and complete project-detail set exposes `noindex, follow`.
- Sitemap is corrected.
- No incomplete project detail URL remains indexable.
- No conflicting robots directives were found.

Operational recommendation: wait until Google has recrawled representative project URLs and the refreshed sitemap before starting Validate Fix. The technical state is ready, but validation is more reliable after Google has seen the live directives.

## 12. Remaining Risks

- Search Console may continue showing historical `Crawled - currently not indexed` examples until Google recrawls the affected URLs.
- The project detail pages remain accessible and internally linked, so Google can discover them and process `noindex`; this is intentional.
- Project case studies cannot be moved to indexable Tier A until verified project evidence is added.
- A sitemap resubmission does not force immediate recrawl; URL Inspection may still show stale crawl data for some time.

## 13. Exact Manual Next Steps

1. In Google Search Console, submit or refresh `https://www.avizsazeh.ir/sitemap.xml`.
2. Use URL Inspection for:
   - `https://www.avizsazeh.ir/en/projects/bushehr-mall`
   - `https://www.avizsazeh.ir/projects/imam-khomeini-airport`
   - `https://www.avizsazeh.ir/en/projects`
3. Run Test Live URL for each representative URL.
4. Confirm project detail pages show `noindex` and listing pages remain indexable.
5. Do not request indexing for Tier B project detail URLs.
6. Request indexing only for indexable listing pages or future Tier A case studies.
7. Start Validate Fix only after representative live tests show the corrected state.

## Verification Commands

Production checks used live HTTP evidence from `https://www.avizsazeh.ir`, Vercel deployment inspection, sitemap URL traversal, favicon checks, robots.txt checks, and rendered HTML metadata extraction.

Local checks:

```text
npm run typecheck: pass
npm run lint: pass
npm run build: pass
git diff --check: pass
```

Final local status after verification report creation includes this new report plus unrelated pre-existing analytics/env changes.
