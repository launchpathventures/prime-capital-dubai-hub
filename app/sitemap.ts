/**
 * CATALYST - Sitemap Configuration
 * 
 * Generates sitemap.xml for search engine indexing.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from "next"

import { config } from "@/lib/config"
import { getProperties, getTeamMembers } from "@/lib/content"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.app.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = []
  if (config.features.properties) {
    try {
      const properties = await getProperties()
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
      const team = await getTeamMembers()
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
