# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing landing site for **Almendra · Estudio Digital** (a digital marketing studio). All user-facing copy is in Spanish (Argentina, voseo: "contanos", "podés"); keep new copy consistent with that. Deployed on Vercel (uses `@vercel/analytics`).

## Commands

```bash
npm install
npm run dev     # local dev server at http://localhost:3000
npm run build   # production build — the main correctness check (type-checks the app)
npm run start   # serve the production build
```

There is no test suite. `npm run lint` maps to `next lint`, which Next.js 16 removed, and the repo has no ESLint config file, so rely on `npm run build` to catch type errors.

## Architecture

Next.js 16 App Router, React 18, TypeScript (`@/*` → `src/*`), Tailwind CSS 3.

- **One page.** Everything renders from `src/app/page.tsx`, an async Server Component made of anchored sections (`#servicios`, `#nosotras`, `#redes-sociales`, `#portfolio`, `#contacto`). The header and footer nav link to these ids, so renaming an id means updating the links too.
- **Markdown-as-CMS.** `src/lib/content.ts` reads YAML front matter (via `gray-matter`) from `content/home.md` (section titles, services list, about/social body text) and `content/site.md` (WhatsApp number, Instagram URL) using `fs` at render time. Body fields are converted to HTML with `remark-html` and injected with `dangerouslySetInnerHTML`. To change copy, edit the markdown files rather than the TSX — but note that some copy (Portfolio, Contacto, footer tagline, testimonials title) is still hardcoded in `page.tsx`, and `heroTitle`/`heroSubtitle`/`servicesTitle` are parsed but not currently rendered.
- **Services rendering quirk.** `page.tsx` alternates band colors per service and special-cases the "Planificación y Administración de redes" string (exact match) to insert a mobile-only line break. Renaming that service in `home.md` silently drops the break.
- **Client components** live in `src/components/` and are the only `"use client"` code: the carousels (`BannerCarousel`, `PortfolioCarousel`, `ClientsCarousel`, with slide image lists hardcoded in each), `Header`, and `ContactForm`.
- **Contact form** posts directly from the browser to Web3Forms (`https://api.web3forms.com/submit`) using `NEXT_PUBLIC_WEB3FORMS_KEY`; there is no backend/API route. It has a hidden `botcheck` honeypot field.
- **SEO routes:** `src/app/sitemap.ts` (base URL from `NEXT_PUBLIC_SITE_URL` or `SITE_URL`) and `src/app/robots.txt/route.ts` (returns 404 outside production).

### Environment variables (`.env.local`, git-ignored)

- `NEXT_PUBLIC_WEB3FORMS_KEY` — contact form submissions
- `NEXT_PUBLIC_GA_ID` — Google Analytics; the gtag scripts in `layout.tsx` are only injected when set
- `NEXT_PUBLIC_SITE_URL` / `SITE_URL` — canonical base URL for the sitemap

## Styling conventions

- **Responsive by duplication.** Many sections render separate mobile and desktop markup (`md:hidden` / `hidden md:block`) with distinct `-mobile` / `-desktop` image assets in `public/images/`. When changing a section, update both variants.
- **Typography** uses custom fonts from `public/fonts/` declared via `@font-face` in `src/app/globals.css` and applied through semantic classes rather than Tailwind font utilities: `.section-title` (Bliss Pro ExtraBold), `.body-copy` (Bliss Pro Light), and Branch-font classes like `.services-item`, `.clients-title`, `.contact-title`, `.portfolio-label`, `.footer-title`. Google fonts (Playfair Display, Inter) from `next/font` are only fallbacks via `--font-serif` / `--font-sans`.
- **Colors:** the `almond-*` scale and `blush` are defined in `tailwind.config.ts`, but brand hex values (`#A8ADA7`, `#6F553C`, `#BF8271`, `#D0B4B7`, `#E2D3CC`, `#EADBD2`, `#E6D6CF`) are used inline as arbitrary Tailwind values or `style` props throughout `page.tsx`.
- Images use `next/image` with `images.unoptimized: true` (`next.config.js`), so assets are served as-is — size them appropriately before adding them.

## Git workflow

This repo uses **GitHub Flow**: `main` is always deployable and is what Vercel serves in production. Small team, one page, no releases to coordinate, so there is no long-lived integration branch.

1. Branch off an up-to-date `main` with a short-lived, single-purpose branch: `feature/<kebab-desc>` for new sections/content, `fix/<kebab-desc>` for bugs or layout tweaks, `chore/<kebab-desc>` for deps/config/docs (e.g. `feature/clientes-coments`, `fix/services-section`).
2. Keep each branch to one change the client could approve or reject on its own. Commit messages are imperative, sentence-case English ("Adjust mobile line break for services section text").
3. Run `npm run build` before pushing.
4. Open a PR into `main`. Vercel's Git integration builds a preview deployment for every PR. Review it on **both mobile and desktop widths** (see "Responsive by duplication" above) and share the preview URL with the client when the copy or visuals need sign-off.
5. Squash-merge so each PR becomes one commit on `main`, then delete the branch. A merge to `main` deploys to production.
6. To undo a bad deploy, use Vercel's instant rollback (or "Promote" an earlier deployment), then revert the commit on `main` with a PR.

Never push directly to `main`. Don't commit `.env.local` or real keys. Use Vercel project environment variables instead.

History note: earlier work went `feature/*` → `dev` → `main` (PRs #6–#20). Vercel PR previews already provide the staging step that `dev` was for, so `dev` has been deleted and all branches target `main`.

## Agents and skills

Project subagents live in `.claude/agents/`. Delegate to them instead of doing the work inline:

| Agent | Use for | Edits code | Model |
|---|---|---|---|
| `content-author` | Copy, services, testimonials, portfolio, banner and link changes (markdown + carousel arrays + hardcoded strings) | yes | sonnet |
| `ui-dev` | Layout, responsive behavior, typography, colors, effects, new sections | yes | opus |
| `maintainer` | Dependencies, Next.js upgrades, build/config, non-visual code | yes | sonnet |
| `conversion-analyst` | WhatsApp/Instagram/form conversion tracking and lead analysis | yes | sonnet |
| `visual-qa` | Mobile + desktop review of a preview before merging | no | sonnet |
| `seo-auditor` | SEO, metadata, structured data, performance and privacy audit | no | opus |

`.agents/agents` and `.agents/skills` are symlinks to `.claude/agents` and `.claude/skills` for tools that read the `.agents/` convention; edit the files under `.claude/`.

The `/site-edit` skill (`.claude/skills/site-edit/`) runs the whole flow for a plain-language request: classify → branch → delegate → build → PR → `visual-qa` on the Vercel preview.

`.claude/skills/` also symlinks the two Vercel-authored skills in `.cursor/skills/`: `vercel-react-best-practices` (React/Next.js performance rules, indexed in its `AGENTS.md`) and `web-design-guidelines` (UI/accessibility review against Vercel's Web Interface Guidelines).
