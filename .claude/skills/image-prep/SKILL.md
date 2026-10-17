---
name: image-prep
description: Resize, compress and name a new or replacement site image (testimonial, portfolio piece, banner, section photo) as the required mobile + desktop pair under public/images/, within size budgets. Use whenever an image is added or replaced, or when an audit flags heavy images.
---

# image-prep

`next.config.js` sets `images.unoptimized: true`, so every file in `public/images/` ships to visitors exactly as committed. A Lighthouse run on 2026-10-17 showed ~6.6 MB of images on mobile and a 10 s LCP, almost all from photo-like PNGs. Every image goes through this skill.

## Script

```bash
.claude/skills/image-prep/scripts/prep.sh <input> public/images/<name>.jpg <width> [quality=80]
```

Uses macOS `sips` (no installs). Never upscales. Output `.jpg` for photos and screenshots of designs (typically 70–80 % smaller than PNG); `.png` only for logos/graphics that need transparency. `sips` cannot write WebP.

## Naming

`<section>-<camelCaseName>-<mobile|desktop>.<jpg|png>` — lowercase `mobile`/`desktop` (a past bug: `-Mobile`), camelCase name, no spaces or accents. Examples: `comentarios-lauraPerez-mobile.jpg`, `portfolio-moda-desktop.jpg`.

## Presets (match current layouts)

| Section | Mobile (width × height) | Desktop (width × height) | Used in |
|---|---|---|---|
| Hero banner (`banner-slide*`) | 1200 × 600 | 1920 × 918 | `BannerCarousel.tsx` |
| Testimonials (`comentarios-*`) | 900 × 900 | 1374 × 266 | `ClientsCarousel.tsx` |
| Portfolio (`portfolio-*`) | 1200 × 600 | 768 × 1426 (2× the 384 × 713 tile) | `PortfolioCarousel.tsx` / `page.tsx` grid |
| Section photos (`banner-nosotras-*`, `banner-redesSociales-*`) | 1080 × 466 | 746 × 1080 | `page.tsx` |

The script only sets width; if the source aspect ratio differs from the preset, crop it first (ask the requester for a correctly framed image rather than guessing a crop on faces or text).

## Budgets

| Variant | Target | Hard limit |
|---|---|---|
| mobile | ≤ 200 KB | 300 KB |
| desktop | ≤ 350 KB | 500 KB |

If over budget, retry with quality 70, then 60; if still over, report it instead of degrading further.

## Steps

1. Get both variants from the requester (or one high-res source that can be framed for both).
2. Run the script once per variant with the preset width.
3. If replacing an existing image whose extension changes (`.png` → `.jpg`), update every reference (`grep -rn "<old-name>" src/`) and delete the old file.
4. Report each output file with dimensions and size.
