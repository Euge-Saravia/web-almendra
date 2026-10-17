---
name: brand-voice
description: Almendra · Estudio Digital's voice, vocabulary, palette and typography as used on the site. Load before writing or editing any copy, alt text, metadata or report text, and before any visual change, so wording and styling stay on-brand.
---

# brand-voice

Derived from the live site copy (`content/home.md`, `src/app/page.tsx`, `src/app/layout.tsx`). When the owners give new direction, update this file in the same PR.

## Who's speaking

Two founders, Julia and Eugenia, speaking as **"nosotras"** (feminine first-person plural) — a small, creative studio, not a faceless agency. The site positions Almendra as a *estudio de marketing y comunicación* that combines **estética, análisis y planificación**.

## Voice

- **Spanish (Argentina), voseo** always: *contanos, podés, necesitás, escribinos, hablemos*. Never *tú/puedes* or *usted*.
- **Warm and close, but professional.** Short sentences, direct address to the reader's brand (*tu marca, tu proyecto, tus cuentas*).
- **Confident about results, without hype.** Concrete verbs (*creamos, diseñamos, armamos, planificamos*) over superlatives. No "¡el mejor!", no stacked exclamation marks, no emoji in site copy.
- **Strategic vocabulary the site already uses**: estrategia, identidad, contenido, coherente, conectar, posicionamiento, fidelizar, a medida.
- Tagline: **"Llevamos tu marca al siguiente nivel"** — reuse as-is; don't paraphrase it.

## Naming

- Brand: **Almendra** in running text; **Almendra · Estudio Digital** in titles, footer and structured data (middle dot `·`).
- Services as listed in `content/home.md` (Branding, Contenido, Programación y diseño web, Tienda Nube, Planificación y Administración de redes, Meta Ads). Platform names keep their official spelling: Tienda Nube, Meta Ads, Google Ads, Instagram, WhatsApp.
- Section names: Servicios, Nosotras, Redes Sociales, Portfolio, Contacto.
- Correct accents always (*Planificación, Administración, diseño*).

## Alt text and metadata

- Alt text in Spanish, describing what's shown: *"Comentario de Marga"*, *"Portfolio identidad visual"*. Decorative images (palette strip, background) still need a short alt or `alt=""` with `aria-hidden` — decide case by case.
- Titles ≤ 60 characters, descriptions 70–160, both in the same voice; include the service and, once confirmed, the city.

## Visual identity

| Role | Value |
|---|---|
| Sage grey-green (service bands, Nosotras panel) | `#A8ADA7` |
| Brown (headings, icons, footer text) | `#6F553C` |
| Terracotta (portfolio hover, form labels) | `#BF8271` |
| Dusty rose (portfolio hover) | `#D0B4B7` |
| Sand / cream (footer, icon circles, dividers) | `#E2D3CC`, `#EADBD2`, `#E6D6CF` |
| Body text | Tailwind `almond-700` (`#654236`) |

- Typography: **Bliss Pro ExtraBold** for section titles (`.section-title`), **Bliss Pro Light** for body (`.body-copy`), **Branch** (script) for accent text — service names, testimonials title, contact title, portfolio labels, footer tagline. Don't introduce new typefaces.
- The **paleta-de-colores** strip sits next to every section title; keep that pattern for new sections.
- Generous white space, alternating color bands, soft rounded cards (`rounded-3xl`) with light shadows.

## Checklist before handing off copy

1. Voseo everywhere? 2. Sounds like *nosotras* talking to *tu marca*? 3. No hype words or emoji? 4. Service and platform names spelled exactly as above? 5. Accents correct?

If the `marketing:brand-review` skill is available, run it on longer copy (new sections, reports) against this file.
