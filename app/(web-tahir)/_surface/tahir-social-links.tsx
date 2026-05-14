/**
 * CATALYST - Tahir Social Links
 *
 * Reusable social profile row for the Tahir brand surface.
 */

import {
  Facebook,
  Instagram,
  Link as LinkIcon,
  Linkedin,
  Music2,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react"

import { brands } from "@/lib/brand"

const tahir = brands.tahir

type SocialKey = keyof typeof tahir.social
type SocialIcon = LucideIcon

const socialOrder: Array<{
  key: SocialKey
  label: string
  Icon: SocialIcon
}> = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "tiktok", label: "TikTok", Icon: Music2 },
  { key: "twitter", label: "X", Icon: Twitter },
  { key: "linktree", label: "Linktree", Icon: LinkIcon },
]

interface TahirSocialLinksProps {
  variant?: "light" | "dark" | "hero"
  showLabels?: boolean
}

export function TahirSocialLinks({
  variant = "light",
  showLabels = false,
}: TahirSocialLinksProps) {
  const socials = socialOrder
    .map(({ key, label, Icon }) => ({ key, label, Icon, href: tahir.social[key] }))
    .filter((s): s is { key: SocialKey; label: string; Icon: SocialIcon; href: string } =>
      Boolean(s.href)
    )

  if (!socials.length) return null

  return (
    <div className="tahir-social" data-variant={variant}>
      {socials.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="tahir-social__link"
          aria-label={label}
          title={label}
        >
          <Icon size={18} aria-hidden />
          {showLabels ? <span>{label}</span> : null}
        </a>
      ))}
    </div>
  )
}
