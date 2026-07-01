/**
 * CATALYST - Claim Certificate Button
 *
 * Client component that triggers certificate issuance via server action.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AwardIcon, Loader2Icon, RotateCcwIcon } from "lucide-react"
import { issueCertificate } from "@/lib/actions/certificate"

export function ClaimCertificate() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const hasRequested = useRef(false)

  const handleIssue = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await issueCertificate()

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    if (hasRequested.current) return
    hasRequested.current = true
    queueMicrotask(() => {
      void handleIssue()
    })
  }, [handleIssue])

  return (
    <div className="cert-claim">
      <div className="cert-claim__icon">
        <AwardIcon className="h-10 w-10" />
      </div>
      <h2 className="cert-claim__title">You&apos;re Ready!</h2>
      <p className="cert-claim__description">
        You&apos;ve completed all LMS modules.
        Your certificate is being issued automatically.
      </p>
      {error && (
        <p className="cert-claim__error">{error}</p>
      )}
      <Button
        size="lg"
        onClick={handleIssue}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Issuing Certificate...
          </>
        ) : (
          <>
            <RotateCcwIcon className="h-4 w-4 mr-2" />
            Try Again
          </>
        )}
      </Button>
    </div>
  )
}
