/**
 * CATALYST - Quiz Loading Skeleton
 */

import { Stack } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"

export function QuizSkeleton() {
  return (
    <div className="learn-content">
      <Stack gap="lg">
        {/* Back link */}
        <Skeleton className="h-5 w-32" />
        
        {/* Header */}
        <Stack gap="sm">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-5 w-12" />
          </div>
        </Stack>
        
        {/* Question */}
        <Skeleton className="h-8 w-full max-w-lg" />
        
        {/* Options */}
        <Stack gap="sm">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </Stack>
        
        {/* Submit */}
        <Skeleton className="h-12 w-full max-w-sm" />
      </Stack>
    </div>
  )
}
