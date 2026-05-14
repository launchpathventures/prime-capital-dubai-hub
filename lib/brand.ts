/**
 * CATALYST - Multi-Brand Configuration
 *
 * Brand detection and context for serving multiple domains from a single
 * Next.js deployment. Prime Capital Dubai is the default brand; Tahir
 * Majithia is the partner brand served on tahirmajithia.com.
 *
 * Brand is resolved via:
 *   1. NEXT_PUBLIC_BRAND_OVERRIDE env var (local dev)
 *   2. Hostname matching (production)
 *   3. DEFAULT_BRAND_ID fallback (primecapital)
 *
 * proxy.ts sets x-brand header + brand cookie on every response.
 * Server components read the header via getBrandFromHeaders().
 * Client components read the cookie via getBrandFromCookie().
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Brand = {
  /** Unique identifier (used in headers, cookies, route prefix) */
  id: string
  /** Display name */
  name: string
  /** Primary production domain */
  domain: string
  /** Additional hostnames that resolve to this brand (e.g. www.) */
  aliases?: string[]
  /** Web surface route group folder name (e.g. "(web)" or "(web-tahir)") */
  webSurface: string
  /** Page metadata */
  meta: {
    title: string
    tagline: string
    description: string
  }
  /** Public brand assets used for logo lockups and favicons */
  assets: {
    logo: string
    logoLight?: string
    favicon: string
  }
  /** Contact details surfaced in the brand's UI */
  contact: {
    phone: string
    phoneDisplay: string
    email: string
    address: string
  }
  /** Calendly URLs for the brand's consultation flows */
  calendly: {
    consultation: string
    seller: string
  }
  /** Public download links (PDFs, strategy kits) */
  links: {
    strategyKit: string
  }
  /** Social profiles — entries set to null are not rendered */
  social: {
    facebook: string | null
    instagram: string | null
    twitter: string | null
    linkedin: string | null
    tiktok: string | null
    youtube: string | null
    linktree: string | null
  }
  /** Public YouTube channel metadata for RSS-backed video feeds */
  youtube?: {
    channelId: string
    handle: string
    cachePrefix: string
  }
  /** Footer attribution shown beneath the brand wordmark */
  footerAttribution: string
}

// -----------------------------------------------------------------------------
// Brand Registry
// -----------------------------------------------------------------------------

export const brands: Record<string, Brand> = {
  primecapital: {
    id: "primecapital",
    name: "Prime Capital Dubai",
    domain: "primecapitaldubai.com",
    aliases: ["www.primecapitaldubai.com"],
    webSurface: "(web)",
    meta: {
      title: "Prime Capital Dubai",
      tagline: "We move complexity out of sight",
      description:
        "Boutique real estate advisory for discerning international investors seeking quality exposure to Dubai's premium property market.",
    },
    assets: {
      logo: "/logo.svg",
      logoLight: "/logo-light.svg",
      favicon: "/favicon.svg",
    },
    contact: {
      phone: "+971585414720",
      phoneDisplay: "+971 58 541 4720",
      email: "admin@primecapitaldubai.com",
      address:
        "API Business Suites, Office 101, Sheikh Zayed Rd, Al Barsha, Dubai",
    },
    calendly: {
      consultation: "https://calendly.com/tahirmajithia/30min",
      seller: "https://calendly.com/tahirmajithia/15min",
    },
    links: {
      strategyKit:
        "https://gamma.app/docs/The-Prime-Capital-2026-Investor-Strategy-Kit-nra1olekeesasny",
    },
    social: {
      facebook: null,
      instagram: "https://instagram.com/primecapitaldubai",
      twitter: null,
      linkedin: "https://linkedin.com/company/prime-capital-dubai",
      tiktok: null,
      youtube: null,
      linktree: null,
    },
    footerAttribution: "Prime Capital Dubai",
  },
  tahir: {
    id: "tahir",
    name: "Tahir Majithia",
    domain: "tahirmajithia.com",
    aliases: ["www.tahirmajithia.com"],
    webSurface: "(web-tahir)",
    meta: {
      title: "Tahir Majithia",
      tagline: "Dubai property, advised personally",
      description:
        "A founder-led advisory practice for serious investors entering Dubai's property market. Personal guidance, end-to-end.",
    },
    assets: {
      logo: "/images/tahir/brand/tahir-logo-nav.png",
      logoLight: "/images/tahir/brand/tahir-logo.webp",
      favicon: "/images/tahir/brand/tahir-favicon.webp",
    },
    contact: {
      phone: "+971502967861",
      phoneDisplay: "+971 50 296 7861",
      email: "tahir@primecapitaldubai.com",
      address:
        "API Business Suites, Office 101, Sheikh Zayed Rd, Al Barsha, Dubai",
    },
    calendly: {
      consultation: "https://calendly.com/tahirmajithia/30min",
      seller: "https://calendly.com/tahirmajithia/15min",
    },
    links: {
      strategyKit:
        "https://gamma.app/docs/The-Prime-Capital-2026-Investor-Strategy-Kit-nra1olekeesasny",
    },
    social: {
      facebook: "https://facebook.com/tahirmajithia",
      instagram: "https://instagram.com/tahirmajithia",
      twitter: "https://twitter.com/tahirmajithia",
      linkedin: "https://linkedin.com/in/tahirmajithia",
      tiktok: "https://tiktok.com/@tahirmajithia",
      youtube: "https://youtube.com/@tahirmajithia",
      linktree: "https://linktr.ee/tahirmajithia",
    },
    youtube: {
      channelId: "UCB9Vf5ceJ1uaqcWIjDMU6zA",
      handle: "tahirmajithia",
      cachePrefix: "tm",
    },
    footerAttribution: "Founder, Prime Capital Dubai",
  },
}

export const DEFAULT_BRAND_ID = "primecapital"
export const TAHIR_STRATEGY_KIT_PREFILL_KEY = "tm:strategy-kit:lead-prefill"

// -----------------------------------------------------------------------------
// Brand Resolution
// -----------------------------------------------------------------------------

/**
 * Resolve brand from hostname.
 * Honours NEXT_PUBLIC_BRAND_OVERRIDE first for local development.
 */
export function getBrand(hostname: string): Brand {
  const override = process.env.NEXT_PUBLIC_BRAND_OVERRIDE
  if (override && brands[override]) {
    return brands[override]
  }

  const host = hostname.split(":")[0].toLowerCase()

  for (const brand of Object.values(brands)) {
    if (host === brand.domain) return brand
    if (brand.aliases?.includes(host)) return brand
    if (host.endsWith(`.${brand.domain}`)) return brand
  }

  return brands[DEFAULT_BRAND_ID]
}

/**
 * Get the brand for a server component from the x-brand request header
 * (set by proxy.ts). Dynamic import keeps next/headers out of client bundles.
 */
export async function getBrandFromHeaders(): Promise<Brand> {
  const { headers } = await import("next/headers")
  const headerStore = await headers()
  const brandId = headerStore.get("x-brand")
  if (brandId && brands[brandId]) {
    return brands[brandId]
  }
  return brands[DEFAULT_BRAND_ID]
}

/**
 * Parse the brand cookie value (client-readable).
 */
export function getBrandFromCookie(cookieValue: string | undefined): Brand {
  if (cookieValue && brands[cookieValue]) {
    return brands[cookieValue]
  }
  return brands[DEFAULT_BRAND_ID]
}

/** Resolve a brand by its id; falls back to the default brand. */
export function getBrandById(id: string | null | undefined): Brand {
  if (id && brands[id]) return brands[id]
  return brands[DEFAULT_BRAND_ID]
}
