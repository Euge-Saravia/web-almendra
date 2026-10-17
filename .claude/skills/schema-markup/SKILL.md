---
name: schema-markup
description: Add or update JSON-LD structured data (schema.org ProfessionalService / Organization + WebSite) for the Almendra landing page so Google understands the business — name, logo, services, location, contact and social profiles. Use when an audit reports missing structured data or business details change.
---

# schema-markup

The site currently has no JSON-LD. Structured data helps Google show the business correctly (knowledge panel, sitelinks, local results) and is required for rich results.

## Where it goes

Render it from `src/app/page.tsx` (Server Component), built from the same sources as the page so it never drifts:

- `getSiteConfig()` (`content/site.md`) → `whatsappNumber`, `instagramUrl`
- `getHomeContent()` (`content/home.md`) → `services`
- Base URL → `process.env.NEXT_PUBLIC_SITE_URL` (fallback `https://www.estudioalmendra.com`)

Put the builder in `src/lib/structured-data.ts` and render, per the Next.js JSON-LD guidance:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
/>
```

## Template

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "<base>/#business",
      "name": "Almendra · Estudio Digital",
      "alternateName": "Almendra",
      "url": "<base>/",
      "logo": "<base>/images/logo-almendra.png",
      "image": "<base>/images/banner-slide-1.jpeg",
      "description": "<meta description from layout.tsx>",
      "telephone": "<whatsappNumber>",
      "sameAs": ["<instagramUrl>"],
      "address": { "@type": "PostalAddress", "addressLocality": "<city>", "addressRegion": "<province>", "addressCountry": "AR" },
      "areaServed": "AR",
      "knowsLanguage": "es",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "<service>" } }
        ]
      },
      "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "telephone": "<whatsappNumber>", "availableLanguage": "es" }
    },
    {
      "@type": "WebSite",
      "@id": "<base>/#website",
      "url": "<base>/",
      "name": "Almendra · Estudio Digital",
      "inLanguage": "es-AR",
      "publisher": { "@id": "<base>/#business" }
    }
  ]
}
```

## Rules

- Only state facts that are on the site or confirmed by the owners. **Confirm the city/province** before filling `address` (the WhatsApp area code 341 suggests Rosario, Santa Fe, but that's an inference). Omit `streetAddress`, opening hours, prices and ratings unless provided — don't add `aggregateRating` from testimonials; Google treats self-serving review markup as spam.
- One `Offer` per entry in `services`, using the exact service names.

## Verify

1. `npm run build`.
2. On the Vercel preview: `node .claude/skills/seo-checklist/scripts/check.mjs <preview-url>` — the JSON-LD check must pass.
3. Paste the preview URL into https://validator.schema.org/ and https://search.google.com/test/rich-results and report any errors or warnings.
