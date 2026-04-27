/**
 * CATALYST - Sitemap Configuration
 * 
 * Generates sitemap.xml for search engine indexing.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from "next"

import { config } from "@/lib/config"
import { getWebTeamMembers } from "@/lib/content"
import { getCrmProperties } from "@/lib/crm/client"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.app.url

  // Static pages with fixed lastModified dates
  // These should be updated when the page content changes significantly
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/strategy-kit`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-02-11"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic property pages — sourced from the CRM. The list endpoint is
  // hard-gated to top-promoted properties; sold/off-market are intentionally
  // excluded from the sitemap (deep links still resolve via the detail API).
  const propertyPages: MetadataRoute.Sitemap = []
  if (config.features.properties) {
    try {
      const { properties } = await getCrmProperties({ limit: 50 })
      properties.forEach((property) => {
        propertyPages.push({
          url: `${baseUrl}/properties/${property.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      })
    } catch {
      // Properties not available, skip
    }
  }

  // Dynamic team member pages
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
      // Team not available, skip
    }
  }

  return [...staticPages, ...propertyPages, ...teamPages]
}
