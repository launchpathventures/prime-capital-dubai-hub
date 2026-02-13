/**
 * CATALYST - Contact Bar
 *
 * Compact inline contact links for the hero bottom bar.
 * Client component for clipboard copy on email.
 */

"use client"

import { config } from "@/lib/config"
import { toast } from "@/components/ui/toast"
import { PhoneIcon, MailIcon, MessageCircleIcon } from "lucide-react"

export function ContactBar() {
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.contact.email)
      toast.success("Email copied to clipboard")
    } catch {
      window.location.href = `mailto:${config.contact.email}`
    }
  }

  return (
    <div className="flex items-center justify-center gap-x-5 md:gap-x-6 py-3.5 text-[13px] tracking-wide">
      <a
        href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
        className="flex items-center gap-2 text-[var(--web-off-white)] hover:text-white transition-colors"
      >
        <PhoneIcon className="h-3.5 w-3.5 opacity-70" />
        <span>{config.contact.phone}</span>
      </a>

      <button
        onClick={handleCopyEmail}
        className="flex items-center gap-2 text-[var(--web-off-white)] hover:text-white transition-colors cursor-pointer"
        title={config.contact.email}
      >
        <MailIcon className="h-3.5 w-3.5 opacity-70" />
        <span>Email</span>
      </button>

      <a
        href={`https://wa.me/${config.contact.phone.replace(/\s/g, "").replace("+", "")}`}
        className="flex items-center gap-2 text-[var(--web-off-white)] hover:text-white transition-colors"
      >
        <MessageCircleIcon className="h-3.5 w-3.5 opacity-70" />
        <span>WhatsApp</span>
      </a>
    </div>
  )
}
