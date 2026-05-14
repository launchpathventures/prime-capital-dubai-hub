/**
 * CATALYST - Robots.txt Configuration
 *
 * Controls search engine crawling behaviour. Brand-aware: the sitemap
 * URL emitted in /robots.txt matches the host of the request so each
 * brand's robots advertise their own sitemap.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from "next"
import { headers } from "next/headers"

import { config } from "@/lib/config"
import { getBrand } from "@/lib/brand"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerStore = await headers()
  const host = headerStore.get("host") || ""
  const brand = getBrand(host)

  const baseUrl =
    brand.id === "tahir" ? `https://${brand.domain}` : config.app.url

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
