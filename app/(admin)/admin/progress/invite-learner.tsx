/**
 * CATALYST - Invite Learner Dialog
 *
 * Admin dialog to create a new learner and generate a magic login link.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlusIcon, CopyIcon, CheckIcon, Loader2Icon } from "lucide-react"
import { toast } from "@/components/ui/toast"

export function InviteLearnerButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [magicLink, setMagicLink] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      // Reset state when closing
      setMagicLink(null)
      setCopied(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Learner created successfully")
        if (result.magicLink) {
          setMagicLink(result.magicLink)
        } else {
          setOpen(false)
          router.refresh()
        }
      }
    } catch {
      toast.error("Failed to create learner")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!magicLink) return
    await navigator.clipboard.writeText(magicLink)
    setCopied(true)
    toast.success("Magic link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDone() {
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon className="h-4 w-4 mr-2" />
        Add Learner
      </DialogTrigger>
      <DialogContent>
        {magicLink ? (
          <>
            <DialogHeader>
              <DialogTitle>Learner Created</DialogTitle>
              <DialogDescription>
                Share this magic link with the learner — they can use it to log in without a password.
              </DialogDescription>
            </DialogHeader>
            <Stack gap="sm">
              <div className="relative">
                <Input
                  readOnly
                  value={magicLink}
                  className="pr-10 font-mono text-xs"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Text size="xs" variant="muted">
                This link expires after use. Generate a new one from the learner&apos;s detail page if needed.
              </Text>
            </Stack>
            <DialogFooter>
              <Button onClick={handleDone}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Learner</DialogTitle>
              <DialogDescription>
                Create a learner account. A magic login link will be generated for you to share.
              </DialogDescription>
            </DialogHeader>
            <Stack gap="md" className="py-4">
              <Stack gap="xs">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="learner@primecapitaldubai.com"
                />
              </Stack>
              <Stack gap="xs">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter full name"
                />
              </Stack>
              <input type="hidden" name="role" value="learner" />
            </Stack>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                Create & Generate Link
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
