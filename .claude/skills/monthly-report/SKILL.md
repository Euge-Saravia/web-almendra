---
name: monthly-report
description: Produce the monthly website performance report for Almendra (in Spanish) — visits, leads by channel (WhatsApp, Instagram, contact form), search performance, page speed and what changed on the site — with clear next steps. Use at the start of each month or when the owners ask "¿cómo le fue a la web?".
---

# monthly-report

A one-page report in Spanish, written for the studio owners (not developers), in the voice from the `brand-voice` skill. It doubles as a showcase of the studio's own results.

## Period

Default: the previous calendar month, compared with the month before. State the exact dates.

## Data sources — collect what's available, say what isn't

| Section | Source | How |
|---|---|---|
| Visitas | Vercel Web Analytics | Vercel MCP (`aggregate_pageviews` / `count_pageviews` for the `web-almendra` project) or the Vercel dashboard. Visitors, page views, top referrers, countries, devices. |
| Consultas (leads) | Conversion events | Vercel MCP `count_events` / `aggregate_events` for `contact_whatsapp_click`, `contact_instagram_click`, `generate_lead`, split by `location`. If events aren't set up yet, say so and point to `conversion-analyst`. Optionally GA4 if the owners share access. |
| Búsquedas en Google | Search Console export | `search-console-insights` skill on that month's `Queries.csv`. If no export was provided, list it as pending. |
| Velocidad | PageSpeed | `node .claude/skills/pagespeed/scripts/pagespeed.mjs https://www.estudioalmendra.com` — mobile and desktop scores, LCP. |
| Salud SEO | Checklist | `node .claude/skills/seo-checklist/scripts/check.mjs https://www.estudioalmendra.com` — passed/total. |
| Cambios en la web | Git | `git log --merges --since=<start> --until=<end> --pretty='%s' main` plus PR titles via `gh pr list --state merged --search "merged:<start>..<end>"`. |

Never invent or estimate numbers. Missing data is reported as "sin datos" with the reason.

## Structure

```markdown
# Informe web — <mes año>
<fechas> · comparado con <mes anterior>

## Resumen
3 bullets: the most important number, the biggest change, the main recommendation.

## Visitas
## Consultas
Table: canal | este mes | mes anterior | variación. Conversion rate = consultas / visitantes.
## Google
Top búsquedas, oportunidades.
## Velocidad y salud técnica
## Qué cambiamos este mes
## Próximos pasos
3–5 concrete actions, each with owner agent (content-author, ui-dev, seo-auditor, conversion-analyst, maintainer).
```

## Delivery

Ask where the owners want it (Claude Doc, Markdown file, or message text). Don't commit reports to the repo unless asked. With small numbers, prefer absolute values over percentages ("de 3 a 7 consultas", not "+133 %").
