# AvizSazeh — Architectural Engineering System (AECS)

Production website for **AvizSazeh Naghsh Jahan** — consulting, design, manufacturing
and installation of suspended metal ceiling systems, presented as an
**Architectural Engineering System (AECS)**, not a product catalogue.

> Engineering Architecture Into Reality.

## Stack

- **Next.js 14** (App Router) · **TypeScript** (strict)
- **Tailwind CSS** with AECS design tokens (`tailwind.config.ts`)
- **next-intl** — Persian (`fa`, RTL, default at `/`) + English (`en`, LTR, at `/en`)
- **Zustand** — RFQ engine state
- SSR/SSG, Edge OG image generation — Vercel-ready

## Brand system (AECS)

All UI follows the brand governance in [`brand-guid/`](./brand-guid):

| Layer | Token |
|---|---|
| Engineering (primary) | Charcoal `#1F2328` / neutrals `ink-*` |
| Architecture (surface) | Ivory `#ECE9E3`, Surface `#F5F3EF` |
| Authority accent | Gold `#B89A63` — **transformation points only** |
| Type — Persian/UI | Vazirmatn |
| Type — Latin/technical | Inter |
| Type — display (≤5%) | Montserrat |
| Grid | 12-col · 1440 max · 8px baseline |
| Motion | ≤800ms, functional only |

Tone: engineering authority — system over product, logic over emotion, no marketing hype.

## Structure

```
src/
├─ app/
│  ├─ [locale]/            # fa (/) + en (/en) — html/body root layout
│  │  ├─ page.tsx          # Homepage (system entry)
│  │  ├─ systems/          # overview + [slug] detail (4 real systems)
│  │  ├─ engineering/      # logic + execution process
│  │  ├─ projects/         # real client / proof wall
│  │  ├─ about/  contact/  rfq/
│  │  └─ not-found.tsx
│  ├─ api/rfq/submit/      # RFQ classification engine
│  ├─ og/                  # Edge OG image generator
│  ├─ sitemap.ts · robots.ts · manifest.ts
├─ components/  ui · layout · sections · system · rfq · icons · brand · shared
├─ i18n/        routing · request (next-intl)
├─ lib/         site · seo · rfq · content/{systems,clients}
messages/       fa.json · en.json
public/         logo, systems/, clients/, brand/, llms.txt
```

## Content & data

Every project/client and all four ceiling systems use **real data** sourced from
avizsazeh.ir — no fabricated case studies or metrics. Detailed `/projects/[slug]`
case studies are intentionally deferred until real technical data is supplied.

## SEO

Per-page metadata, canonical + `hreflang` (fa/en/x-default), JSON-LD
(`Organization`, `WebSite`, `Product`, `BreadcrumbList`), `sitemap.xml`,
`robots.txt`, `llms.txt`, semantic HTML, AVIF/WebP images, lazy loading.

## Development

```bash
npm install
npm run dev          # http://localhost:3100
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint
```

## Environment

Copy `.env.example` → `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://www.avizsazeh.ir
ODOO_URL=https://odoo.avizsazeh.ir
ODOO_DB=avizsazeh
ODOO_USERNAME=__set_in_env_only__
ODOO_PASSWORD=__set_in_env_only__ # or ODOO_API_KEY
RFQ_NOTIFICATION_EMAIL=info@avizsazeh.ir # optional fallback reference
```

## Deployment (Vercel)

1. Import the repo into Vercel (framework auto-detected as Next.js).
2. Set `NEXT_PUBLIC_SITE_URL`, the required Odoo CRM variables, and optional `RFQ_NOTIFICATION_EMAIL`.
3. Add domain `avizsazeh.ir`. Build: `next build` (default). Region: `fra1` (`vercel.json`).

The RFQ engine (`/api/rfq/submit`) classifies submissions and creates an Odoo `crm.lead`.
For real user submissions, missing Odoo configuration or failed CRM delivery returns a
non-2xx response so the UI cannot show a false CRM registration success.
