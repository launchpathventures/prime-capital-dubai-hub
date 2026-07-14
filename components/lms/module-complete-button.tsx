/**
 * CATALYST - Module Complete Button
 *
 * Explicit "Mark as complete" control for a learning module. Completion is
 * quiz-independent by design: passing a module's quiz still auto-completes it,
 * but every module can also be finished directly here so progress toward the
 * completion certificate never depends on a quiz existing or its link resolving.
 *
 * On the final module, marking complete auto-issues the certificate
 * (markModuleComplete -> issueCertificateForUser) and we surface it inline.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stack, Row, Text } from "@/components/core"
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  Loader2Icon,
  AwardIcon,
} from "lucide-react"
import { markModuleComplete } from "@/lib/actions/learning"

interface ModuleCompleteButtonProps {
  moduleId: string
  initialCompleted: boolean
}

export function ModuleCompleteButton({
  moduleId,
  initialCompleted,
}: ModuleCompleteButtonProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [certificateId, setCertificateId] = useState<string | null>(null)

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    const result = await markModuleComplete(moduleId)

    if (result.success) {
      setCompleted(true)
      setCertificateId(result.data.certificateId ?? null)
      // Refresh so the header badge, sidebar, and progress counts update.
      router.refresh()
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  if (completed) {
    return (
      <div className="module-complete module-complete--done">
        <Row gap="md" align="center">
          <div className="module-complete__icon module-complete__icon--done">
            <CheckCircle2Icon className="h-6 w-6" />
          </div>
          <Stack gap="xs">
            <Text weight="semibold" className="text-foreground">
              Module complete
            </Text>
            <Text size="sm" className="text-muted-foreground">
              Nice work — this module counts toward your completion certificate.
            </Text>
          </Stack>
        </Row>

        {certificateId && (
          <div className="module-complete__cert">
            <Row gap="md" align="center">
              <div className="module-complete__icon module-complete__icon--cert">
                <AwardIcon className="h-6 w-6" />
              </div>
              <Stack gap="xs">
                <Text weight="semibold" className="text-foreground">
                  You&apos;ve finished the programme — certificate issued!
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  Your completion certificate is ready.
                </Text>
              </Stack>
            </Row>
            <Button render={<Link href="/learn/certification" />}>
              View certificate
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="module-complete">
      <Row gap="md" align="center" className="module-complete__lead">
        <div className="module-complete__icon">
          <CircleDashedIcon className="h-6 w-6" />
        </div>
        <Stack gap="xs">
          <Text weight="semibold" className="text-foreground">
            Finished this module?
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Mark it complete to track your progress toward your certificate.
          </Text>
        </Stack>
      </Row>

      <Stack gap="sm" className="module-complete__action">
        <Button size="lg" className="gap-2" onClick={handleComplete} disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2Icon className="h-4 w-4" />
              Mark as complete
            </>
          )}
        </Button>
        {error && (
          <Text size="sm" className="text-red-600 dark:text-red-400">
            {error}
          </Text>
        )}
      </Stack>
    </div>
  )
}
