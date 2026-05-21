/**
 * CATALYST - Sitemap Configuration
 *
 * Generates sitemap.xml for search engine indexing. Brand-aware: the
 * request host decides whether to emit Prime Capital or Tahir URLs.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from "next"
import { headers } from "next/headers"

import { config } from "@/lib/config"
import { getBrand } from "@/lib/brand"
import { getWebTeamMembers } from "@/lib/content"
import { getCrmProperties } from "@/lib/crm/client"

async function primeCapitalSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date("2026-02-11"), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-02-11"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date("2026-02-11"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/properties`, lastModified: new Date("2026-02-11"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/team`, lastModified: new Date("2026-02-11"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-02-11"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/strategy-kit`, lastModified: new Date("2026-02-11"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/terms`, lastModified: new Date("2026-02-11"), changeFrequency: "yearly", priority: 0.3 },
  ]

  const propertyPages: MetadataRoute.Sitemap = []
  if (config.features.properties) {
    try {
      const { properties } = await getCrmProperties({
        limit: 50,
        promotionStatus: "top_property",
      })
      properties.forEach((property) => {
        propertyPages.push({
          url: `${baseUrl}/properties/${property.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      })
    } catch {
      // Properties not available, skip.
    }
  }

  const teamPages: MetadataRoute.Sitemap = []
  if (config.features.team) {
    try {
      const team = await getWebTeamMembers()
      team.forEach((member) => {
        teamPages.push({
          url: `${baseUrl}/team/${member.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      })
    } catch {
      // Team not available, skip.
    }
  }

  return [...staticPages, ...propertyPages, ...teamPages]
}

function tahirSitemap(baseUrl: string): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-13")
  const pages: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/about", priority: 0.85, freq: "monthly" },
    { path: "/services", priority: 0.85, freq: "monthly" },
    { path: "/videos", priority: 0.8, freq: "weekly" },
    { path: "/testimonials", priority: 0.75, freq: "monthly" },
    { path: "/faqs", priority: 0.75, freq: "monthly" },
    { path: "/contact", priority: 0.7, freq: "monthly" },
    { path: "/strategy-kit", priority: 0.9, freq: "monthly" },
    { path: "/consultation", priority: 0.9, freq: "monthly" },
    { path: "/roi-calculator", priority: 0.7, freq: "monthly" },
    { path: "/investment-plan", priority: 0.75, freq: "monthly" },
    { path: "/property-requirements", priority: 0.75, freq: "monthly" },
  ]
  return pages.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified,
    changeFrequency: p.freq,
    priority: p.priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headerStore = await headers()
  const host = headerStore.get("host") || ""
  const brand = getBrand(host)

  if (brand.id === "tahir") {
    return tahirSitemap(`https://${brand.domain}`)
  }

  return primeCapitalSitemap(config.app.url)
}
