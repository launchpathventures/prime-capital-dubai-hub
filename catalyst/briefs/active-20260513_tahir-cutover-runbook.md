---
title: "Tahir Majithia — DNS / Vercel Cutover Runbook"
stage: mvp
tags: [tahir, dns, cutover, ops]
---

# Tahir Majithia — Cutover Runbook

Operational steps to move tahirmajithia.com (currently Squarespace) onto
the Catalyst multi-brand Next.js deployment. Companion to
`_review-20260513_tahir-majithia-site-port.md` (the implementation
brief).

**Estimated total time:** 60–90 minutes of work, plus DNS propagation
(typically 5–60 minutes for the TTL Squarespace publishes).

**Scope:**
- Add `tahirmajithia.com` + `www.tahirmajithia.com` to the Vercel project.
- Update DNS at the registrar.
- Verify the Tahir surface, redirects, forms, sitemap.
- Notify Google Search Console.

**Out of scope:**
- Squarespace cancellation — only do that after a full week of clean
  Vercel traffic, in case rollback is needed.

---

## 0. Prerequisites

- [ ] Latest `master` has been deployed to Vercel production (verify in
      Vercel dashboard).
- [ ] You have admin access to:
  - [ ] Vercel project (Prime Capital Dubai)
  - [ ] DNS registrar for `tahirmajithia.com`
  - [ ] Squarespace (for emergency rollback only)
  - [ ] Google Search Console
- [ ] You can SSH-test the production URL with a `Host:` header (or curl
      with `--resolve`).

---

## 1. Pre-flight on production (no traffic switch yet)

Verify the Tahir surface renders correctly on production **before**
touching DNS. Vercel will serve the brand based on the `Host:` header,
so you can preview it via curl.

```bash
# Hit production with the Tahir hostname forced via curl.
# Replace <PROD-URL> with the Vercel production URL (e.g. quito.vercel.app).
PROD="https://quito-prime-capital-dubai-hub.vercel.app"

# 1. Root → Tahir homepage
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Host: tahirmajithia.com" "$PROD/"
# Expected: 200

# 2. About page
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Host: tahirmajithia.com" "$PROD/about"
# Expected: 200

# 3. Legacy redirect
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
  -H "Host: tahirmajithia.com" "$PROD/property-services"
# Expected: 301 -> /services

# 4. Sitemap is Tahir-flavoured
curl -s -H "Host: tahirmajithia.com" "$PROD/sitemap.xml" | head -40
# Expected: URLs under https://tahirmajithia.com/

# 5. Robots advertises the Tahir sitemap
curl -s -H "Host: tahirmajithia.com" "$PROD/robots.txt"
# Expected: Sitemap: https://tahirmajithia.com/sitemap.xml
```

If anything fails, stop here and fix on master before continuing.

---

## 2. Add the domains in Vercel

1. Vercel dashboard → the Prime Capital project → **Settings → Domains**.
2. Add `tahirmajithia.com`.
   - Vercel will show the required DNS records. Note these down — they
     are the values you'll set at the registrar (Step 3).
3. Add `www.tahirmajithia.com`.
   - Configure www as a redirect target if Vercel prompts; the proxy
     handles either, but standardising on the apex is cleaner. The
     brand registry already resolves both via the `aliases` list.

> Vercel will hold the domain in "Pending" until DNS resolves to its
> servers. SSL is provisioned automatically once DNS lines up.

---

## 3. Update DNS at the registrar

Two records are needed. Vercel will tell you exact values; the
canonical pattern is:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| `A`     | `@` (apex) | `76.76.21.21` | 300 |
| `CNAME` | `www`      | `cname.vercel-dns.com` | 300 |

Steps at the registrar:

1. **Lower TTLs first** (do this ahead of cutover day if possible — say
   24h before): set TTL on the existing Squarespace records to **300
   seconds**. This narrows the propagation window when you actually
   switch.
2. **Replace the records**:
   - Delete the existing `A` records pointing at Squarespace IPs.
   - Delete or update the existing `www` CNAME pointing at Squarespace.
   - Add the new `A` and `CNAME` records from the table above.
3. Save changes.

Optional but recommended:

- Add a `CAA` record to allow Let's Encrypt to issue certs:
  `0 issue "letsencrypt.org"`.
- If you previously had a Squarespace email forwarder set up via MX
  records, leave those alone — they aren't affected by this change.

---

## 4. Wait for DNS to propagate

```bash
# Check what the world sees.
dig +short tahirmajithia.com
dig +short www.tahirmajithia.com

# Or from a different resolver:
dig +short @1.1.1.1 tahirmajithia.com
dig +short @8.8.8.8 tahirmajithia.com
```

Propagation typically completes in 5–60 minutes once TTLs are at 300s.

When the records point at Vercel:

- Refresh **Settings → Domains** in Vercel. Both domains should flip to
  "Valid Configuration" and SSL should auto-issue.
- This is one-way visible from the public internet — your office Wi-Fi
  cache may still hit Squarespace for a few minutes after.

---

## 5. Verify the live site

Once both domains show green in Vercel:

```bash
# 1. Live home page
curl -s -o /dev/null -w "%{http_code}\n" https://tahirmajithia.com/
# Expected: 200

# 2. www → apex (or apex → www, whichever you configured)
curl -sI https://www.tahirmajithia.com/ | grep -iE "(http/|location)"

# 3. Tahir-only redirect (sample two)
curl -sI https://tahirmajithia.com/property-services | grep -iE "(http/|location)"
# Expected: 301 → /services
curl -sI https://tahirmajithia.com/strategy-kit-thank-you | grep -iE "(http/|location)"
# Expected: 301 → /strategy-kit/thank-you

# 4. SSL is real (not the Vercel placeholder)
echo | openssl s_client -servername tahirmajithia.com \
  -connect tahirmajithia.com:443 2>/dev/null | openssl x509 -noout -issuer -subject
# Expected: Let's Encrypt / valid Subject CN

# 5. Confirm Prime Capital is NOT affected
curl -sI https://primecapitaldubai.com/ | grep -iE "http/"
# Expected: 200 (unchanged)
```

Open the site in a normal browser and walk these flows:

- [ ] `/` — hero, services grid, testimonials, CTA strip all render.
- [ ] `/about` — story, stats, values, philosophy.
- [ ] `/services` — five advisory cards, three property routes, process
      steps.
- [ ] `/testimonials` — all twelve quotes.
- [ ] `/faqs` — accordion opens/closes; all four groups render.
- [ ] `/contact` — form submits; success message appears; lead lands in
      AgentCRM tagged `website-tahir`.
- [ ] `/strategy-kit` — download form submits; redirects to
      `/strategy-kit/thank-you`; the kit link opens the Gamma deck.
- [ ] `/consultation` — Calendly embed appears after form submit.
- [ ] `/roi-calculator` — typing in inputs updates the metrics.
- [ ] `/investment-plan` and `/property-requirements` — forms submit.
- [ ] Any legacy URL you remember from the old Squarespace site 301s to
      the right place.

---

## 6. Notify Google Search Console

1. Search Console → **Add property** → `tahirmajithia.com` (Domain
   property if your registrar supports DNS verification, otherwise URL
   property).
2. Verify ownership (DNS TXT record or HTML tag).
3. Submit the new sitemap: `https://tahirmajithia.com/sitemap.xml`.
4. Request indexing on the home page so the change-of-host is picked up
   quickly.
5. Bing Webmaster Tools — same routine if you maintain a property
   there.

If the Squarespace property has historic data you want to preserve, keep
it verified for a while; Search Console's change-of-address tool isn't
strictly necessary because the host is unchanged.

---

## 7. Roll back (only if needed)

If the live site is broken and a fix isn't imminent:

1. At the registrar, restore the original Squarespace `A` and `www`
   records (you snapshotted them in Step 3, right?).
2. Wait for DNS to revert (5–60 minutes with TTL=300).
3. Leave the Vercel domains attached — they'll go back to "Invalid
   Configuration" but the project keeps working for other brands.

Squarespace stays paid for a full week after cutover. Do not cancel
until the new site has been stable in production for 7 days.

---

## 8. Squarespace decommission (T+7 days)

After a clean week:

- [ ] Export any contact-form submissions still in Squarespace.
- [ ] Download the Squarespace site backup (Settings → Advanced → Import
      / Export).
- [ ] Cancel the Squarespace subscription.
- [ ] Move the domain registration to a sensible registrar if it's
      still at Squarespace (optional but reduces vendor lock-in).
- [ ] Update the implementation brief from `_review-` to `complete/`.

---

## Notes

- DNS records here are based on Vercel's current published values.
  Always trust what Vercel shows you in **Settings → Domains** over
  what's written here.
- The proxy at `proxy.ts` rewrites `tahirmajithia.com/X` to `/tahir/X`
  internally. Visitors never see `/tahir` in the URL bar.
- The lead-form `source` field is automatically set from `pageUrl`, so
  CRM segmentation can use either `source` (URL match) or `tag`
  (`website-tahir`) to attribute Tahir leads.
