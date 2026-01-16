/**
 * CATALYST - Feedback Filters
 *
 * Filter controls for the admin feedback list.
 * Elegant bar design with status/type filters and export button.
 */

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

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
    <div className="feedback-filters">
      <div className="feedback-filters__group">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select value={status} onValueChange={(v) => v && updateFilter("status", v)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue>
              {status === "all" && "All Status"}
              {status === "new" && "New"}
              {status === "in_progress" && "In Progress"}
              {status === "complete" && "Complete"}
              {status === "archived" && "Archived"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={(v) => v && updateFilter("type", v)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue>
              {type === "all" && "All Types"}
              {type === "general" && "General"}
              {type === "module" && "Module"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="module">Module</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="feedback-filters__divider" />

      <div className="feedback-filters__export">
        <Button
          variant="outline"
          size="sm"
          render={<a href={exportUrl} download />}
        >
          <Download className="h-4 w-4" />
          Export Markdown
        </Button>
      </div>
    </div>
  )
}
