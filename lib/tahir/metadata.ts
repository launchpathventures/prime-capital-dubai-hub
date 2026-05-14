/**
 * CATALYST - Tahir Metadata Helpers
 *
 * Centralises canonical URLs, favicon assets, and social card metadata
 * for the tahirmajithia.com route group.
 */

import type { Metadata } from "next"

import { brands } from "@/lib/brand"

const tahir = brands.tahir

const tahirBaseUrl = `https://${tahir.domain}`
const defaultSocialImage =
  tahir.assets.socialImage ?? "/images/hero/home-hero.jpg"
const defaultSocialImageAlt =
  tahir.assets.socialImageAlt ?? tahir.name
const twitterHandle = "@tahirmajithia"

interface TahirPageMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  imageAlt?: string
  noIndex?: boolean
}

function normaliseTahirPath(path = "/") {
  if (!path || path === "/tahir") return "/"

  const externalPath = path.replace(/^\/?tahir\/?/, "/")
  return externalPath.startsWith("/") ? externalPath : `/${externalPath}`
}

function socialTitle(title: string) {
  return title === tahir.meta.title ? title : `${title} · ${tahir.meta.title}`
}

export function tahirRootMetadata(): Metadata {
  const description = tahir.meta.description

  return {
    metadataBase: new URL(tahirBaseUrl),
    applicationName: tahir.name,
    title: {
      default: tahir.meta.title,
      template: `%s · ${tahir.meta.title}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        {
          url: tahir.assets.favicon,
          type: "image/webp",
          sizes: "100x100",
        },
        {
          url: tahir.assets.faviconPng ?? tahir.assets.favicon,
          type: "image/png",
          sizes: "32x32",
        },
      ],
      shortcut: tahir.assets.faviconPng ?? tahir.assets.favicon,
      apple: [
        {
          url: tahir.assets.appleIcon ?? tahir.assets.favicon,
          type: "image/png",
          sizes: "180x180",
        },
      ],
    },
    openGraph: {
      title: tahir.meta.title,
      description,
      url: "/",
      siteName: tahir.name,
      type: "website",
      images: [
        {
          url: defaultSocialImage,
          width: 1200,
          height: 630,
          alt: defaultSocialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tahir.meta.title,
      description,
      images: [defaultSocialImage],
      creator: twitterHandle,
      site: twitterHandle,
    },
  }
}

export function tahirPageMetadata({
  title = tahir.meta.title,
  description = tahir.meta.description,
  path = "/",
  image = defaultSocialImage,
  imageAlt = defaultSocialImageAlt,
  noIndex = false,
}: TahirPageMetadataOptions): Metadata {
  const canonical = normaliseTahirPath(path)
  const fullTitle = socialTitle(title)
  const pageTitle: Metadata["title"] =
    title === tahir.meta.title ? { absolute: title } : title

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: tahir.name,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
