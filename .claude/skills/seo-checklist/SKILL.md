---
name: seo-checklist
description: Fast pass/fail technical SEO check of a deployed URL (production or a Vercel preview) — title, description, canonical, Open Graph/Twitter tags, lang, viewport, h1 count, image alt text, JSON-LD, robots.txt and sitemap.xml. Use before merging a PR that touches metadata or copy, or as the first step of an SEO audit.
---

# seo-checklist

Run from the repo root:

```bash
node .claude/skills/seo-checklist/scripts/check.mjs https://www.estudioalmendra.com
```

Pass a Vercel preview URL to check a PR before merge. The script needs no dependencies (Node 18+ `fetch`) and exits non-zero if any check fails.

## What it checks

| Check | Pass condition |
|---|---|
| HTTP status | 200 after redirects, served over https |
| `<title>` | present, 30–60 characters |
| meta description | present, 70–160 characters |
| canonical | `<link rel="canonical">` present and absolute |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url` present |
| Twitter | `twitter:card` present |
| `lang` | `<html lang>` set |
| viewport | `<meta name="viewport">` present |
| `h1` | exactly one in the HTML |
| alt text | every `<img>` has a non-empty `alt` |
| JSON-LD | at least one `application/ld+json` block that parses and has an `@type` |
| robots.txt | 200 and contains a `Sitemap:` line |
| sitemap.xml | 200, has `<loc>` entries, none pointing at `localhost` or a different host |

`warn` results (e.g. title slightly long) don't fail the run.

## Interpreting results for this site

- The page renders separate mobile and desktop headings, so an `h1` count of 0 or 2 means a section title should be promoted or one duplicate should become a non-heading — that's a `ui-dev` change.
- A `localhost` sitemap means `NEXT_PUBLIC_SITE_URL` isn't set for that Vercel environment (`maintainer`).
- Missing canonical / OG / Twitter tags are fixed in the `metadata` export of `src/app/layout.tsx` (set `metadataBase` once, then relative URLs work).
- Missing JSON-LD → use the `schema-markup` skill.
- On a Vercel preview, robots.txt returns 404 by design (`src/app/robots.txt/route.ts` only serves in production) — not a bug there.
