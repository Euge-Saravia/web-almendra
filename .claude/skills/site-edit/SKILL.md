---
name: site-edit
description: Turn a plain-language change request for the Almendra landing page (often in Spanish, e.g. "cambiá el testimonio de Marga", "agregá Meta Ads a servicios", "el botón de WhatsApp tapa el formulario") into a reviewed pull request. Use when someone asks to change the site without specifying how, or invokes /site-edit.
---

# site-edit

Coordinates the project agents in `.claude/agents/` to take a change request from words to a PR with a Vercel preview, following the GitHub Flow in `CLAUDE.md`. Runs in the main conversation so it can delegate to subagents.

## 1. Understand the request

Restate the request in one or two lines (in the requester's language) and list what's needed from them. Ask only for what blocks the work, typically:
- new images (both a mobile and a desktop version),
- exact copy if they gave only an idea,
- which section, if ambiguous.

## 2. Classify and branch

| Request is about… | Agent |
|---|---|
| What the site says or shows (copy, services, testimonials, portfolio, links) | `content-author` |
| How it looks or behaves (layout, spacing, colors, fonts, animation, new section design) | `ui-dev` |
| Measuring leads / CTA performance | `conversion-analyst` |
| Build errors, dependencies, config | `maintainer` |
| "How are we doing on Google?" | `seo-auditor` (report only, no PR unless fixes are requested) |

Mixed requests: content first, then UI, on the same branch. Create the branch from an up-to-date `main`: `feature/<kebab-desc>` for new things, `fix/<kebab-desc>` for corrections.

## 3. Implement

Delegate to the chosen agent(s) with a self-contained brief: the request, exact copy/assets, files you expect to change. Review their diff yourself before continuing.

## 4. Verify

`npm run build` must pass. Push the branch, open a PR into `main`, wait for the Vercel preview URL, then run `visual-qa` against it (it also runs `seo-checklist` when metadata or copy changed). If it reports `needs fixes`, send the findings back to the responsible agent and re-run `visual-qa`.

## 5. Hand back

Reply to the requester in their language with: what changed, the Vercel preview link to check on their phone and desktop, and that merging (squash) publishes it. Do not merge without their approval.
