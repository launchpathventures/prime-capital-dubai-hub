/**
 * CATALYST - Magic Link Button
 *
 * Generates a magic login link for an existing learner.
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { LinkIcon, CheckIcon, Loader2Icon } from "lucide-react"
import { toast } from "@/components/ui/toast"

type MagicLinkButtonProps = {
  email: string
}

export function MagicLinkButton({ email }: MagicLinkButtonProps) {
  const [state, setState] = React.useState<"idle" | "loading" | "copied">("idle")

  async function handleClick() {
    setState("loading")
    try {
      const response = await fetch("/api/admin/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.error) {
        toast.error(result.error)
        setState("idle")
        return
      }

      if (result.magicLink) {
        await navigator.clipboard.writeText(result.magicLink)
        toast.success("Magic link copied to clipboard")
        setState("copied")
        setTimeout(() => setState("idle"), 2000)
      }
    } catch {
      toast.error("Failed to generate magic link")
      setState("idle")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      disabled={state === "loading"}
      title="Copy magic login link"
    >
      {state === "loading" ? (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      ) : state === "copied" ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
    </Button>
  )
}
