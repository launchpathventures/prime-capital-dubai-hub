/**
 * CATALYST - Feedback Filters
 *
 * Filter controls for the admin feedback list.
 */

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Row } from "@/components/core"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function FeedbackFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const status = searchParams.get("status") || "all"
  const type = searchParams.get("type") || "all"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/learn/admin/feedback?${params.toString()}`)
  }

  // Build export URL with current filters
  const exportUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    if (type !== "all") params.set("type", type)
    const query = params.toString()
    return `/api/feedback/export${query ? `?${query}` : ""}`
  }, [status, type])

  return (
    <Row gap="md" className="flex-wrap">
      <Select value={status} onValueChange={(v) => updateFilter("status", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(v) => updateFilter("type", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="module">Module</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" asChild>
        <a href={exportUrl} download>
          <Download className="h-4 w-4 mr-2" />
          Export Markdown
        </a>
      </Button>
    </Row>
  )
}
