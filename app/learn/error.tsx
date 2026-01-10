"use client"

import { useEffect } from "react"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("LMS Error:", error)
  }, [error])

  return (
    <Stack gap="lg" align="center" className="py-16 text-center">
      <AlertTriangleIcon className="h-16 w-16 text-destructive" />
      
      <Stack gap="sm">
        <Title size="h2">Something went wrong</Title>
        <Text className="text-muted-foreground max-w-md">
          We encountered an error loading this page. Please try again or contact support if the problem persists.
        </Text>
      </Stack>
      
      <Button onClick={reset} className="gap-2">
        <RefreshCwIcon className="h-4 w-4" />
        Try Again
      </Button>
    </Stack>
  )
}
