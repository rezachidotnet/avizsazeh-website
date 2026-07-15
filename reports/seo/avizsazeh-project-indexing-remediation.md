# AvizSazeh Project Indexing Remediation

Audit date: 2026-07-15  
Site: `https://www.avizsazeh.ir`

## 1. Executive Summary

Google Search Console reports `Crawled - currently not indexed` validation failure for project-related URLs, including:

- `https://www.avizsazeh.ir/en/projects/bushehr-mall`
- `https://www.avizsazeh.ir/favicon.avif`

The repository contains 28 project/client records. Only two records currently publish project detail routes:

- `imam-khomeini-airport`
- `bushehr-mall`

Both records are real references in the repository, but neither currently has enough verified standalone evidence for an indexable case study. They now remain accessible for users but use `noindex,follow` and are excluded from the XML sitemap.

No project facts, measurements, client details, dates, photos, or testimonials were invented.

## 2. Search Console Context

Search Console issue:

- Page indexing: `Crawled - currently not indexed`
- Validation: failed
- Started: 2026-06-20
- Failed: 2026-07-01
- Bushehr Mall crawled again: 2026-07-10

The likely quality issue is that project URLs were indexable and included in the sitemap while still containing incomplete evidence signals: no verified area, year, exact ceiling system, execution scope, project images, image captions, or specific project measurements.

## 3. Source Of Truth

Primary project source of truth:

- `src/lib/content/projects.ts`

Related project surfaces:

- Listing pages: `src/app/[locale]/projects/page.tsx`, `src/app/(fa)/projects/page.tsx`
- Detail routes: `src/app/[locale]/projects/[slug]/page.tsx`, `src/app/(fa)/projects/[slug]/page.tsx`
- Project cards: `src/components/projects/ProjectCard.tsx`
- Homepage proof links: `src/components/sections/home/ProofClients.tsx`
- System-to-project links: `src/app/[locale]/systems/[slug]/page.tsx`
- Application-to-project links: `src/app/[locale]/applications/[slug]/page.tsx`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- Canonical/hreflang helpers: `src/lib/seo.ts`
- Routing: `src/i18n/routing.ts`, `src/middleware.ts`

## 4. Project Inventory

Legend:

- `confirmed`: directly present in repository data
- `partially confirmed`: high-level context exists, but not project-specific execution proof
- `missing`: no repository evidence
- `placeholder`: a prior page/listing signal indicated incomplete evidence
- `duplicated`: repeated generic project copy

| Slug | Detail locales | Title | Type/context | Images | Related systems/applications | Internal links from | Tier | Indexing | Sitemap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `imam-khomeini-airport` | `fa,en,ar,ru` | confirmed | partially confirmed airport context | missing real project images | `linear-ceiling`, `open-cell`, `metal-tile`; `airport-ceiling` | projects, home, relevant systems/application | B | `noindex,follow` | excluded |
| `bushehr-mall` | `fa,en,ar,ru` | confirmed | partially confirmed commercial centre context | missing real project images | `open-cell`, `baffle`, `linear-ceiling`; `commercial-ceiling` | projects, home, relevant systems/application | B | `noindex,follow` | excluded |
| `arya-sasol` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `sairan` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `chadormalu` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `pamidco` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `nezam-mohandesi-qazvin` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `bushehr-heritage` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `shahrdari-parand` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `shahrdari-zarrinshahr` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `shahrdari-sejzi` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `shahrdari-lenjan` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `jahad-nasr-arak` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `armatur-pardis` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `aria-omran-pars` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `alphabet-qeshm` | none | confirmed | partially confirmed partner identity only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `anamis-sazan` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `esalat` | none | confirmed | partially confirmed partner identity only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `zagros-zarrin-pars` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `saman-andishan` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `armeh-sazeh-novin` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `anbouh-gostar-nasr` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `pars-gostar` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `meshkin-part-kish` | none | confirmed | partially confirmed partner identity only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `moghavem-kar` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `fazapooshan-kerman` | none | confirmed | partially confirmed sector only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `vodja` | none | confirmed | partially confirmed partner identity only | logo only | missing | projects listing/client wall | B | no detail route | excluded |
| `vira-tejarat` | none | confirmed | partially confirmed partner identity only | logo only | missing | projects listing/client wall | B | no detail route | excluded |

Common missing fields across project records:

- verified location
- verified project year
- verified client/operator beyond record name
- exact ceiling system installed
- AvizSazeh execution scope
- area
- height
- project-specific technical challenge
- project-specific engineering solution
- project result
- real project images, captions, and image alt text

## 5. Tier Classification

| Tier | Count by project record | Count by localized detail page | Slugs |
| --- | ---: | ---: | --- |
| A - Indexable case study | 0 | 0 | none |
| B - Published/incomplete or reference-only | 28 | 8 detail pages plus 26 listing-only records | all project records |
| C - Invalid/obsolete route | 0 | 0 | none |

No Tier C project was identified. Valid but incomplete projects were not removed or redirected.

## 6. Bushehr Mall Findings

Supported facts from repository evidence:

- slug: `bushehr-mall`
- title: `Bushehr Mall` / `بوشهر مال` / `بوشهر مول`
- category: commercial
- client/reference name: Bushehr Mall
- logo: `public/clients/bushehr-mall.jpeg`
- sector/context: commercial centre
- related application: `commercial-ceiling`
- related systems: `open-cell`, `baffle`, `linear-ceiling`
- application content confirms malls/commercial centres are relevant to open cell, baffle, linear and metal tile ceiling selection.

Unsupported/missing facts:

- exact project location beyond the name
- year
- installed ceiling system
- AvizSazeh execution scope
- area
- height
- verified site-specific engineering challenge
- verified solution
- result/outcome
- real execution photos
- captions and alt text for real project images

Final classification:

- Tier: B
- Indexing: `noindex,follow`
- Sitemap: excluded
- Canonical: self-consistent localized canonical remains
- Hreflang: `fa`, `en`, `ar`, `ru`, `x-default`

## 7. Placeholder-Content Findings

Project-page placeholder copy was reduced:

- removed listing labels such as execution photos pending / technical docs in progress
- removed the no-image visual checklist from project detail pages
- replaced incomplete-evidence language with an evidence-scope note
- left missing metrics unrendered rather than filling empty fields

The required placeholder search still reports unrelated system-specification placeholders. Those are outside the project-page remediation scope and were not changed.

## 8. Sitemap Findings

Before:

- sitemap included project detail URLs for records that had `hasCaseStudy(project)`.
- because `SEO_LOCALES` omitted `ru`, sitemap/hreflang coverage did not include Russian.

After:

- project detail URLs are included only when `isIndexableProject(project)` is true.
- current Tier B project detail URLs are excluded.
- `SEO_LOCALES` includes `fa`, `en`, `ar`, `ru`.
- Persian sitemap URLs remain unprefixed.
- `/fa` legacy URLs remain excluded.
- API routes are excluded.
- static assets are not emitted by `src/app/sitemap.ts`.

## 9. Favicon Finding

`favicon.avif` remains available in `public/` and in app icon metadata for browser/Google favicon use.

It is not emitted by the XML sitemap generator. No robots block was added for the favicon.

## 10. Metadata Findings

Tier B project detail pages now emit:

- `robots: noindex,follow`
- self-consistent canonical URL
- localized hreflang alternates for `fa`, `en`, `ar`, `ru`
- `x-default` to the Persian canonical route

No project metadata now claims missing area, year, photos, system specification, or execution details.

## 11. Canonical And Hreflang Findings

Confirmed routing strategy:

- Persian default routes are unprefixed.
- English uses `/en`.
- Arabic uses `/ar`.
- Russian uses `/ru`.
- `/fa` legacy routes redirect to the unprefixed Persian route via `src/middleware.ts`.

Change made:

- `SEO_LOCALES` now includes `ru`, so sitemap and metadata alternates cover every configured locale.

## 12. Structured Data Findings

Project pages use:

- `CreativeWork`
- `BreadcrumbList`

They do not use:

- `Product`
- `Review`
- `AggregateRating`
- `Offer`

No placeholder metrics were added to JSON-LD. The schema remains limited to visible page content.

## 13. Internal Linking Findings

Existing contextual internal links were preserved:

- project listing links to published detail routes.
- homepage proof cards link to published detail routes.
- relevant system pages link to project detail routes when the case-study relation names that system.
- relevant application pages link to project detail routes when the application relation names that project.
- project detail pages link back to related systems and applications.

Bushehr Mall contextual link relevance:

- `/en/projects`: relevant listing page.
- `/en/systems/open-cell`: relevant, because Bushehr Mall lists `open-cell`.
- `/en/systems/baffle`: relevant, because Bushehr Mall lists `baffle`.
- `/en/applications/commercial-ceiling`: relevant, because Bushehr Mall lists `commercial-ceiling`.
- `/en/systems/open-cell-ceiling` and `/en/systems/baffle-ceiling` are not valid repository routes; canonical slugs are `/en/systems/open-cell` and `/en/systems/baffle`.

## 14. Breadcrumb Findings

Project detail pages keep visible and structured breadcrumbs:

- Home
- Projects
- Current project

Breadcrumb links use localized routing and canonical path helpers.

## 15. Files Changed

- `src/lib/content/projects.ts`
- `src/lib/seo.ts`
- `src/app/sitemap.ts`
- `src/app/[locale]/projects/[slug]/page.tsx`
- `src/app/[locale]/projects/page.tsx`
- `src/components/sections/home/ProofClients.tsx`
- `messages/en.json`
- `messages/fa.json`
- `messages/ar.json`
- `messages/ru.json`
- `reports/seo/avizsazeh-project-indexing-remediation.md`
- `reports/seo/avizsazeh-project-indexing-inventory.json`

## 16. Routes Changed To Noindex

Localized Tier B detail pages:

- `/projects/imam-khomeini-airport`
- `/en/projects/imam-khomeini-airport`
- `/ar/projects/imam-khomeini-airport`
- `/ru/projects/imam-khomeini-airport`
- `/projects/bushehr-mall`
- `/en/projects/bushehr-mall`
- `/ar/projects/bushehr-mall`
- `/ru/projects/bushehr-mall`

## 17. Routes Kept Indexable

Project listing pages remain indexable:

- `/projects`
- `/en/projects`
- `/ar/projects`
- `/ru/projects`

No project detail route is currently Tier A.

## 18. Routes Excluded From Sitemap

All Tier B project detail routes are excluded from `sitemap.xml`.

The sitemap continues to include canonical static pages, system pages, application pages, and listing pages.

## 19. Tests Performed

Required commands to run after implementation:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`
- `git status --short`

Targeted searches performed during the audit:

- placeholder signals across `src`, `messages`, `public`
- sitemap/favicon/project route generation
- Bushehr Mall evidence across repository content and assets

## 20. Remaining Missing Project Evidence

To upgrade Bushehr Mall or Imam Khomeini Airport to Tier A, provide verified evidence for:

- exact location/project context
- year or delivery period
- AvizSazeh scope
- installed ceiling system
- area
- height
- technical challenge specific to that project
- engineering solution specific to that project
- project result
- real project photographs
- image captions and project-specific alt text

Do not request indexing for Tier B pages until this evidence exists and the page is switched back to indexable.

## 21. Manual Search Console Steps

After deployment:

1. Verify the live canonical URL returns 200.
2. Verify the live robots directive.
3. Verify the live canonical and hreflang.
4. Use URL Inspection for each upgraded Tier A page.
5. Run Test Live URL.
6. Request indexing for individual Tier A pages only.
7. Submit or refresh the sitemap.
8. Start Validate Fix only after representative pages are ready.

Do not use Validate Fix while multiple thin or placeholder project pages remain indexable.

## 22. Risks And Rollback

Risk:

- No project detail page is currently indexable. This is intentional because current project evidence is incomplete.
- Project detail pages can still be discovered through internal links but should not enter the index until upgraded.
- The sitemap URL count decreases for project details.

Rollback:

- Revert the changes in `src/lib/content/projects.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, project page templates, messages, and reports.
- Do not remove `noindex` until verified project evidence has been added.

