/**
 * CATALYST - Robots.txt Configuration
 * 
 * Controls search engine crawling behavior.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from "next"

import { config } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.app.url

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/app/",
          "/hub/",
          "/learn/admin/",
          "/docs/test",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
