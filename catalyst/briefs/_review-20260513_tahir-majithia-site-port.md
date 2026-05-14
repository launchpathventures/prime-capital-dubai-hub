---
title: "Port tahirmajithia.com as multi-brand sub-site"
stage: mvp
tags: [web, multi-brand, dns, content-migration]
---

# Port tahirmajithia.com → Prime Capital multi-brand sub-site

## Goal

Rebuild tahirmajithia.com inside this Next.js codebase so:

- The personal-brand site keeps its identity and (optionally) its domain
- Lead capture, Calendly, strategy kit, and team data are shared with Prime Capital
- The team maintains one codebase, one deployment, one Supabase backend

## Context (what we found)

- Tahir is already `Founding Partner` in `data/team.json` (slug `tahir-majithia`)
- `lib/config.ts` already points consultation Calendly to `calendly.com/tahirmajithia/30min`
- `lib/config.ts` already links the same Gamma Strategy Kit URL used on tahirmajithia.com
- `app/(web)/sell/page.tsx` already quotes him as Managing Director with the same portrait
- Service categories, property types, FAQs, testimonials are essentially the same content presented as a personal brand vs. a firm brand
- **Current proxy.ts is single-brand.** Multi-brand is not yet implemented in this repo
- `/Users/thg/code/process-os/proxy.ts` + `lib/brand.ts` implement the exact pattern needed: hostname → brand resolution → silent rewrite to a brand-scoped route group. Port from there

## Architecture decision: hostname-based multi-brand

Recommended over a subpath (`/tahir/*`) because:

- User mentioned "domain redirects" — implies keeping `tahirmajithia.com` reachable
- Personal brand justifies its own visual identity and URL structure
- Single Vercel project, single Supabase, single deploy pipeline — leads converge naturally
- Pattern is proven in `process-os` and documented

**Mechanics:**

- `lib/brand.ts` defines `primecapital` (default) and `tahir` brands
- `proxy.ts` reads hostname → sets `x-brand` header + `brand` cookie → rewrites `tahirmajithia.com/about` to internal `/tahir/about`
- `app/(web-tahir)/tahir/*` holds all Tahir pages
- Visitor sees clean URLs; Next.js routes internally
- Dev override: `NEXT_PUBLIC_BRAND_OVERRIDE=tahir` to preview at `localhost:3000`

## Confirmed decisions

1. **Domain**: Full cutover — `tahirmajithia.com` DNS moves to Vercel
2. **Phone**: Keep Tahir's `+971 50 296 7861` on the Tahir-branded site
3. **Lead pipeline**: Use existing `LeadForm` component with `source="website_tahir"` so submissions land in the shared `leads` table tagged for Tahir's brand
4. **Past events**: Skipped — no event content carried across. Event URLs redirect to `/`
5. **Footer attribution**: "Founder, Prime Capital Dubai" — co-branded footer
6. **Squarespace export**: Pull any PDFs (strategy kits, downloads) before cutover

## Design system

A full Tahir design system has been synthesised at `.context/tahir-design-system.md`. Summary:
- Keeps Tahir's existing orange `#FD6E0C`, Archivo Black + Montserrat type, and asymmetric `0 6.4 6.4 6.4` button radius as identity
- Applies quiet-luxury principles: warm cream `#FAF7F0` background (not white), warm near-black `#1F130E` body (not black), orange budget ≤10% per viewport, outlined secondary CTAs, no shadows or carousels
- Defines token set, type scale, component specs (hero, services, testimonials, FAQ, CTA strip, forms, footer), and the `app/(web-tahir)/` surface skeleton

## Phases

### Phase 1 — Multi-brand foundation (~1 day)

- Port `lib/brand.ts` from process-os; configure `primecapital` (default) + `tahir`
- Extend `proxy.ts`:
  - Resolve brand from hostname (`tahirmajithia.com` + `www.tahirmajithia.com` → `tahir`)
  - Set `x-brand` header + `brand` cookie on every response
  - Rewrite root paths to `/tahir/*` when brand is `tahir` (preserve `/auth/*`, `/api/*`, `/admin/*`, etc.)
- Create `app/(web-tahir)/` surface skeleton:
  - `layout.tsx` (uses `TahirShell`)
  - `tahir.css` (brand tokens: Tahir's palette, typography, accent)
  - `_surface/tahir-shell.tsx`, `tahir-nav.tsx`, `tahir-footer.tsx`
  - `tahir/page.tsx` placeholder
- Add `lib/brand-config.ts` (or extend `config.ts`) so contact details/social/Calendly URL vary per brand
- CSP `img-src` updates if any new image hosts are needed
- Add `NEXT_PUBLIC_BRAND_OVERRIDE` to `.env.example`

### Phase 2 — Shared content components (~0.5 day)

Reuse existing Core primitives (`Stack`, `Row`, `Grid`, `Text`, `Title`, `Container`, `Section`) plus UI components. Build small Tahir-themed wrappers:

- `TahirHero` (portrait + dual CTAs "Connect With Tahir" / "Invest With Tahir")
- `ServicesGrid` (5 services + 3 property types)
- `TestimonialGrid` (12 quotes, masonry — no stars, no carousel)
- `FAQAccordion` (~15 Q&As, grouped, dark section, one-at-a-time)
- `CTAStrip` (single primary CTA closing block)
- `ContactCard` (phone + location + socials)

All forms reuse the existing `LeadForm` component with `source="website_tahir"` to route leads into the shared Supabase `leads` table tagged for Tahir's brand.

### Phase 3 — Content data (~0.5 day)

- `data/tahir/testimonials.json` — 12 quotes from sitemap scrape
- `data/tahir/faqs.json` — 15 Q&As, grouped: General, Investment & Financials, Selling, Residency & Legal
- `data/tahir/services.json` — 5 services + 3 property types
- `data/tahir/profile.json` — phone (`+971 50 296 7861`), location, socials (Facebook, Instagram, Twitter, LinkedIn, TikTok, Linktree, YouTube)
- `public/tahir/downloads/` — PDFs exported from Squarespace (strategy kits, etc.)

### Phase 4 — Pages (~1.5 days)

| New route | Was (Squarespace) | Notes |
|---|---|---|
| `/` | `/home` | Hero, services, testimonials, FAQs, CTA |
| `/about` | `/about` | Personal positioning, credibility |
| `/services` | `/property-services` | Services + property types |
| `/testimonials` | `/testimonials` | Full grid |
| `/faqs` | `/faqs` | Accordion, grouped |
| `/contact` | `/contact`, `/connect`, `/feedback`, `/checkin` | Single contact page with `LeadForm` |
| `/strategy-kit` | `/strategy-kit` | Reskin existing PC page with Tahir brand |
| `/strategy-kit/thank-you` | `/strategy-kit-thank-you` | New |
| `/consultation` | `/consultation` | Qualifying form → lead |
| `/consultation/thank-you` | `/consultation-thank-you` | New |
| `/roi-calculator` | `/roi-calculator` | Interactive: purchase price, expected rent, service charges → yield, ROI |
| `/investment-plan` | `/investment-plan` | Qualifier form → lead |
| `/property-requirements` | `/property-requirements` | Form: budget, area, type → lead |

### Phase 5 — Redirects (~0.5 day)

Add hostname-scoped redirects to `next.config.ts` via `redirects()` with `has: [{ type: 'host', value: 'tahirmajithia.com' }]`:

| From | To | Code |
|---|---|---|
| `/home` | `/` | 301 |
| `/property-services` | `/services` | 301 |
| `/connect` | `/contact` | 301 |
| `/feedback` | `/contact` | 301 |
| `/checkin` | `/contact` | 301 |
| `/glasgow-checkin` | `/` | 301 |
| `/strategy-kit-thank-you` | `/strategy-kit/thank-you` | 301 |
| `/consultation-thank-you` | `/consultation/thank-you` | 301 |
| `/glasgow-event-april-2025` | `/` | 301 |
| `/1-to-1-glasgow-event-april-2025` | `/` | 301 |
| `/1-to-1-london-event-april-2025` | `/` | 301 |
| `/dubai-property-market-live-qa-with-tahir-majithia` | `/` | 301 |

### Phase 6 — Assets (~0.5 day)

- Tahir portrait: already at `public/images/team/tahir-majithia.jpg` — reuse
- Squarespace CDN images: skip rehost (mostly generic stock) — replace with curated Unsplash or PC library
- Build `app/(web-tahir)/sitemap.ts` scoped to Tahir routes
- Update `robots.ts` to advertise both brand sitemaps (one per host)

### Phase 7 — Domain & DNS cutover (~0.5 day)

- Vercel: add `tahirmajithia.com` + `www.tahirmajithia.com` to project domains, verify SSL
- Squarespace → Vercel DNS cutover (apex A record + www CNAME)
- Smoke-test: all 21 old URLs hit the right new page (200 or 301)
- Smoke-test: all forms POST to the API and create leads
- Post-cutover: monitor 404s in Sentry for ~1 week, fix any missed redirects

## Total estimate

~5 working days of focused build + content QA, plus a separate cutover window.

## Open risks

- **Legal/copy ownership** — testimonial quotes and images from Squarespace are presumed Tahir's; confirm before cutover
- **Email sender domain** — if forms send confirmation emails, `tahirmajithia.com` must be verified in Resend (or accept that all confirmations come from `primecapitaldubai.com`)
- **SEO transition** — sitemap + 301s must be in place at cutover; expect 4-8 weeks for Google to reflect the new structure
- **Squarespace export** — confirm we have everything (any blog posts, drafts, PDFs) before flipping DNS

## Out of scope (for now)

- Migrating CRM contacts that may live in Squarespace's customer database
- Email marketing list migration (separate task)
- Multi-language support
- E-commerce/cart (Squarespace cart icon was empty; assume not in use)
