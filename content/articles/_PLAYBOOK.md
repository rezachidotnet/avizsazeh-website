# Article playbook — automated publishing every 3 days

This file is the brief for whoever (or whatever) writes the next article. The
scheduled Claude task follows it on every run. Files starting with `_` are
ignored by the site.

## Goal

Grow organic visits to www.avizsazeh.com with technically credible Persian
articles that answer what architects, contractors, developers and facility
managers actually search for — and route them to a system page and the RFQ.

## One run, step by step

1. **Sync** — `git pull` on `main`, `npm ci`.
2. **See what exists** — `npm run articles:next` lists recent articles,
   articles per system and the best unused keywords from
   `content/seo/keyword-bank.json`.
3. **Check trends (today)** — use web search (Persian first) for:
   - construction / building-regulation news in Iran from the last ~2 weeks
     (مقررات ملی ساختمان، نظام مهندسی، انرژی ساختمان، مسکن، پروژه‌های
     فرودگاه/مترو/بیمارستان/مدرسه/مال)
   - seasonal hooks (Mehr → school acoustics, autumn/winter → energy &
     heating, Nowruz → retail fit-out, summer → cooling / energy imbalance)
   - exhibitions and events (نمایشگاه صنعت ساختمان)
   - global ceiling / interior design trends, localised to Iran.
4. **Pick the topic** — the best article sits where an unused bank keyword
   meets a current trend. If no trend fits, take the top unused keyword.
   Never reuse a `targetKeyword` (the validator blocks it). Balance systems:
   prefer systems with fewer articles. If Search Console queries were added to
   the `search-console` cluster, they come first.
5. **Research** — 3–6 credible sources (official bodies, news agencies,
   manufacturers' technical pages, standards). Paraphrase; never copy.
   Quote at most one short phrase per source.
6. **Write** `content/articles/<slug>.md` (format below), 1,100–1,800 Persian
   words.
7. **Validate** — `npm run articles:validate` must pass with 0 errors. Then
   `npm run typecheck` and `npm run build`.
8. **Ship** — commit `content: article — <slug>` and push to `main`. Vercel
   deploys automatically; the sitemap and RSS feed update themselves.
9. If a keyword was inspired by a trend and isn't in the bank, add it to the
   matching cluster (and mark it used by writing the article).

## Voice and truthfulness (brand rules)

- Engineering authority, system over product, logic over emotion. Structure
  each article as: problem → engineering logic → system solution → execution.
- No hype: never "بهترین", "ارزان‌ترین", "بی‌نظیر", "شماره یک" (the validator
  rejects these).
- **No invented data.** No prices in Toman/Rial, no NRC/fire-class/weight
  values, no project names or client claims unless they already appear in
  `src/lib/content/*.ts`. Where a value depends on the project, say it is
  confirmed by the AvizSazeh engineering team.
- Facts from news (dates, regulation names, statements) must be cited in
  `sources`.
- Persian with correct half-spaces (نیم‌فاصله): «می‌شود»، «سقف‌ها»، «طراحی‌شده».

## File format

```markdown
---
slug: expanded-metal-ceiling-guide        # latin kebab-case = file name
locale: fa
title: "سقف اکسپندد متال چیست؟ ..."          # 25–75 chars, contains the target keyword
description: "..."                         # 110–175 chars, meta description
publishedAt: 2026-10-23
updatedAt: 2026-10-23
category: "راهنمای سیستم"                    # راهنمای سیستم | مقایسه و انتخاب | مقررات و انرژی | طراحی و اجرا | کاربردها
targetKeyword: "سقف اکسپندد متال"           # unique across all articles
keywords: ["توری منبسط", "سقف توری فلزی", "اکسپندد متال چیست"]
relatedSystems: [expanded-metal, open-cell] # from src/lib/content/system-slugs.ts
cover: /systems/expanded-metal-cover.webp   # existing image in /public
coverAlt: "..."
trend: "why this topic is timely now"      # internal note
faq:
  - q: "..."
    a: "..."
sources:
  - title: "..."
    url: https://...
---

Intro paragraph that contains the target keyword …

## First section
…
```

Body rules (enforced): ≥ 900 words, ≥ 4 `##` sections, no `#` H1, links to
≥ 2 different `/systems/<slug>` pages and to `/rfq`, ≥ 3 FAQ items, ≥ 1
source. Useful internal links: `/metal-suspended-ceiling`, `/systems/compare`,
`/applications/<slug>`, `/projects`, `/engineering`, other `/articles/<slug>`.

## Covers

Use an existing image in `/public/systems/` or `/public/design-system/` that
matches the main system. Don't hotlink external images.
