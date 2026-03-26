/**
 * CATALYST - Claim Certificate Button
 *
 * Client component that triggers certificate issuance via server action.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AwardIcon, Loader2Icon } from "lucide-react"
import { issueCertificate } from "@/lib/actions/certificate"

export function ClaimCertificate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleClaim() {
    setLoading(true)
    setError(null)

    const result = await issueCertificate()

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="cert-claim">
      <div className="cert-claim__icon">
        <AwardIcon className="h-10 w-10" />
      </div>
      <h2 className="cert-claim__title">You&apos;re Ready!</h2>
      <p className="cert-claim__description">
        You&apos;ve completed all modules and passed all quizzes.
        Claim your certificate of completion.
      </p>
      {error && (
        <p className="cert-claim__error">{error}</p>
      )}
      <Button
        size="lg"
        onClick={handleClaim}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Issuing Certificate...
          </>
        ) : (
          <>
            <AwardIcon className="h-4 w-4 mr-2" />
            Claim Your Certificate
          </>
        )}
      </Button>
    </div>
  )
}
