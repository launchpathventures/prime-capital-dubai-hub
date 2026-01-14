/**
 * CATALYST - Module Page Client Component
 * 
 * Client wrapper for EssentialsView to handle mode switching.
 */

"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { EssentialsView } from "@/components/lms"
import type { EssentialsContent } from "@/lib/learning-types"

interface ModulePageClientProps {
  essentials: EssentialsContent
  moduleSlug: string
  competencySlug: string
}

export function ModulePageClient({ 
  essentials, 
  moduleSlug, 
  competencySlug 
}: ModulePageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const handleSwitchMode = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("mode", "deepdive")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }
  
  return (
    <EssentialsView
      essentials={essentials}
      moduleSlug={moduleSlug}
      competencySlug={competencySlug}
      onSwitchMode={handleSwitchMode}
    />
  )
}
