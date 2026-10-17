---
name: search-console-insights
description: Analyze Google Search Console performance exports (Queries.csv / Pages.csv) to find what people actually search to reach the site — high-impression low-CTR queries, near-page-one rankings (positions 5–20), and branded vs non-branded split — and turn them into title, description and copy changes. Use when Search Console data is available or for the monthly report.
---

# search-console-insights

There is no Search Console connector here, so this works from exports.

## Getting the data (ask the owners)

Search Console → property for `estudioalmendra.com` → **Performance → Search results** → date range (last 3 months, or the month for `monthly-report`) → **Export → Download CSV**. The ZIP contains `Queries.csv` and `Pages.csv` (headers may be in Spanish: "Consultas principales", "Clics", "Impresiones", "CTR", "Posición"). Unzip it somewhere outside the repo and pass the paths; don't commit exports.

If the property doesn't exist yet, that's the first finding: verify the domain in Search Console (DNS TXT record in Vercel) and submit `https://www.estudioalmendra.com/sitemap.xml`.

## Script

```bash
node .claude/skills/search-console-insights/scripts/analyze.mjs <path/to/Queries.csv> [--brand almendra,almendra estudio]
```

Columns are read by position (query, clicks, impressions, CTR, position), so it works with English or Spanish exports. It prints totals, branded vs non-branded share, and three opportunity lists:

- **Low CTR**: ≥ 50 impressions and CTR below what the position usually earns → rewrite `title` / description in `src/app/layout.tsx` (`content-author`) to match that query's intent.
- **Striking distance**: average position 5–20 with ≥ 20 impressions → strengthen on-page copy for that topic in `content/home.md` (`content-author`), e.g. mention the service + city explicitly.
- **Top non-branded**: what new prospects search; use it to check the services list and headings.

Low-traffic sites have few rows; with < 100 total impressions, report the raw list instead of percentages and say the data is thin.

## Output

A short table per list with the suggested change and owner. Keep recommendations in Spanish when they are copy.
