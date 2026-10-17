---
name: pagespeed
description: Measure page performance with Google PageSpeed Insights (Lighthouse lab data plus Chrome UX Report field data) on mobile and desktop — performance score, LCP, CLS, TBT, INP, heaviest resources and top savings. Use for SEO/performance audits, before and after image or layout changes, and in monthly reports.
---

# pagespeed

```bash
node .claude/skills/pagespeed/scripts/pagespeed.mjs https://www.estudioalmendra.com
```

Calls the PageSpeed Insights v5 API for both `mobile` and `desktop` and prints a summary. The keyless API quota is shared and often exhausted (HTTP 429); the script then falls back automatically to a local Lighthouse run (`npx lighthouse@12`, needs Chrome installed), which gives lab data only. For field data, set `PSI_API_KEY` (a Google Cloud API key with the PageSpeed Insights API enabled). `--local` forces Lighthouse; `--json` prints the summary as JSON (used by `monthly-report`). Each run takes 20–60 s.

Lab scores vary ±5 points between runs — run twice before concluding a change helped or hurt.

## Output

- **Score** (0–100) and lab metrics: LCP, CLS, TBT, FCP, Speed Index.
- **Field data** (real Chrome users, last 28 days) if the site has enough traffic: LCP, CLS, INP with good/needs-improvement/poor category. Google ranks on field data; low-traffic sites often have none, and then lab data is the proxy.
- **Heaviest resources** (from `total-byte-weight`).
- **Top opportunities** sorted by estimated savings.

## Known causes on this site

- `next.config.js` sets `images.unoptimized: true`, so `next/image` serves the original files. Many content images are 600 KB–1.3 MB PNGs of photos. Fix per image with the `image-prep` skill (`content-author`), or globally by removing `unoptimized` (`maintainer` — check the Vercel image optimization quota first).
- The LCP element is usually the first hero banner slide (`src/components/BannerCarousel.tsx`); it should have `priority` and an appropriately sized mobile source.
- Custom fonts are `.otf` files loaded via `@font-face` in `src/app/globals.css`; converting to `.woff2` and setting `font-display: swap` helps FCP.

Report the URL, date and both strategies' numbers, and assign each fix to an agent (`content-author`, `ui-dev`, `maintainer`).
