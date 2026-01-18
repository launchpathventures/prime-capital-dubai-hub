/**
 * CATALYST - Briefs Filters Component
 *
 * Client component for search and status filtering of briefs.
 * Uses URL search params for shareable filter state.
 */

"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Stack, Row, Text, Grid } from "@/components/core"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BriefCardDialog } from "../../_surface"

import type { Brief, BriefState } from "@/lib/briefs-types"
import { FileText, Search } from "lucide-react"

type StatusFilter = "in_play" | "all" | BriefState

const STATUS_ITEMS: Array<{ value: StatusFilter; label: string }> = [
  { value: "in_play", label: "In Play" },
  { value: "all", label: "All" },
  { value: "_blocked", label: "Blocked" },
  { value: "_review", label: "Review" },
  { value: "active", label: "Active" },
  { value: "approved", label: "Approved" },
  { value: "backlog", label: "Backlog" },
  { value: "complete", label: "Complete" },
  { value: "archive", label: "Archive" },
]

interface BriefsFiltersProps {
  briefs: Brief[]
}

export function BriefsFilters({ briefs }: BriefsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("q") ?? ""
  const currentStatus = (searchParams.get("status") as StatusFilter) ?? "in_play"

  const [searchValue, setSearchValue] = React.useState(currentSearch)

  React.useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const updateFilters = React.useCallback(
    (search: string, status: StatusFilter) => {
      const params = new URLSearchParams()
      const trimmed = search.trim()

      if (trimmed) params.set("q", trimmed)
      if (status !== "in_play") params.set("status", status)

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname]
  )

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateFilters(searchValue, currentStatus)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchValue, currentSearch, currentStatus, updateFilters])

  const filteredBriefs = React.useMemo(() => {
    const needle = currentSearch.trim().toLowerCase()

    return briefs.filter((brief) => {
      const matchesStatus = (() => {
        if (currentStatus === "all") return true
        if (currentStatus === "in_play") return brief.location === "main"
        return brief.state === currentStatus
      })()

      if (!matchesStatus) return false
      if (!needle) return true

      const hay = [
        brief.title,
        brief.filename,
        brief.slug,
        brief.assignee ?? "",
        ...(brief.tags ?? []),
      ]
        .join(" ")
        .toLowerCase()

      return hay.includes(needle)
    })
  }, [briefs, currentSearch, currentStatus])

  const handleClearSearch = () => {
    setSearchValue("")
    updateFilters("", currentStatus)
  }

  return (
    <Stack gap="md">
      <div className="rounded-2xl border bg-white/50 p-5 shadow-sm backdrop-blur dark:bg-white/5">
        <Row gap="md" wrap align="center">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <Input
              type="text"
              placeholder="Search briefs..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              startIcon={<Search />}
              clearable
              onClear={handleClearSearch}
            />
          </div>

          <Row gap="sm" align="center" wrap>
            <Select
              items={STATUS_ITEMS}
              value={currentStatus}
              onValueChange={(v) => updateFilters(searchValue, v as StatusFilter)}
            >
              <SelectTrigger className="h-10 w-full md:w-52">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={STATUS_ITEMS[0].value}>{STATUS_ITEMS[0].label}</SelectItem>
                <SelectItem value={STATUS_ITEMS[1].value}>{STATUS_ITEMS[1].label}</SelectItem>
                <SelectSeparator />
                {STATUS_ITEMS.slice(2).map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        </Row>
      </div>

      {filteredBriefs.length === 0 ? (
        <div className="py-12 text-center">
          <Stack gap="md" align="center">
            <div className="p-4 rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <Stack gap="xs" align="center">
              <Text weight="medium">No briefs found</Text>
              <Text size="sm" variant="muted" className="max-w-sm">
                Try adjusting your search or choosing a different status.
              </Text>
            </Stack>
          </Stack>
        </div>
      ) : (
        <Grid cols={2} gap="md" className="brief-cards-grid">
          {filteredBriefs.map((brief) => (
            <BriefCardDialog key={brief.filename} brief={brief} />
          ))}
        </Grid>
      )}
    </Stack>
  )
}
