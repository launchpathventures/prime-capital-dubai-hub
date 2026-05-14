/**
 * CATALYST - Tahir Share Actions
 *
 * Compact social sharing row for Tahir article/tool pages.
 */

"use client"

import * as React from "react"
import {
  Check,
  Copy,
  Facebook,
  Linkedin,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react"

interface TahirShareProps {
  title: string
  text?: string
  url?: string
  label?: string
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

export function TahirShare({
  title,
  text,
  url,
  label = "Share",
}: TahirShareProps) {
  const [copied, setCopied] = React.useState(false)
  const shareUrl = url || ""
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(text || title)

  React.useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleNativeShare = async () => {
    if (!shareUrl) return

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
        return
      } catch {
        // User cancelled or browser refused native share; copy fallback below.
      }
    }

    await copyToClipboard(shareUrl)
    setCopied(true)
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await copyToClipboard(shareUrl)
    setCopied(true)
  }

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: Facebook,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Twitter,
    },
  ]

  return (
    <div className="tahir-share" aria-label={label}>
      <span className="tahir-share__label">{label}</span>
      <button
        type="button"
        className="tahir-share__button"
        onClick={handleNativeShare}
        aria-label="Share this page"
        title="Share this page"
      >
        <Share2 size={17} aria-hidden />
      </button>
      <button
        type="button"
        className="tahir-share__button"
        onClick={handleCopy}
        aria-label="Copy page link"
        title="Copy page link"
      >
        {copied ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
      </button>
      {links.map(({ label: linkLabel, href, Icon }) => (
        <a
          key={linkLabel}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="tahir-share__button"
          aria-label={`Share on ${linkLabel}`}
          title={`Share on ${linkLabel}`}
        >
          <Icon size={17} aria-hidden />
        </a>
      ))}
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  )
}
