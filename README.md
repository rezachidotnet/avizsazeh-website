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
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint
```

## Environment

Copy `.env.example` → `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://avizsazeh.ir   # canonical origin (metadata, sitemap, OG)
RFQ_NOTIFY_EMAIL=info@avizsazeh.ir          # optional; RFQ runs log-only if unset
```

## Deployment (Vercel)

1. Import the repo into Vercel (framework auto-detected as Next.js).
2. Set `NEXT_PUBLIC_SITE_URL=https://avizsazeh.ir` (and optional `RFQ_NOTIFY_EMAIL`).
3. Add domain `avizsazeh.ir`. Build: `next build` (default). Region: `fra1` (`vercel.json`).

The RFQ engine (`/api/rfq/submit`) currently classifies + acknowledges submissions in
log-only mode; wire an email/CRM transport where marked in the route to enable delivery.
