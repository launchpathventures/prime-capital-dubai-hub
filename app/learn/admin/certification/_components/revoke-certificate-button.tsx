/**
 * CATALYST - Revoke Certificate Button
 *
 * Admin-only client component for revoking a completion certificate.
 * Requires confirmation before revoking.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { XCircleIcon, Loader2Icon } from "lucide-react"
import { revokeCertificate } from "@/lib/actions/certificate"

interface RevokeCertificateButtonProps {
  certificateId: string
}

export function RevokeCertificateButton({ certificateId }: RevokeCertificateButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")
  const router = useRouter()

  async function handleRevoke() {
    if (!reason.trim()) return

    setLoading(true)
    const result = await revokeCertificate(certificateId, reason)

    if (result.success) {
      router.refresh()
    }

    setLoading(false)
    setConfirming(false)
    setReason("")
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Reason for revocation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="text-xs px-2 py-1 border rounded"
          autoFocus
        />
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRevoke}
            disabled={loading || !reason.trim()}
          >
            {loading ? <Loader2Icon className="h-3 w-3 animate-spin" /> : "Confirm"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setConfirming(false); setReason("") }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={() => setConfirming(true)}
    >
      <XCircleIcon className="h-3.5 w-3.5 mr-1" />
      Revoke
    </Button>
  )
}
