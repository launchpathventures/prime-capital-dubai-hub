/**
 * CATALYST - App Surface Documentation
 *
 * Comprehensive docs for the (app) authenticated surface.
 * Tab order follows the user journey:
 * 1. Overview — What is this surface for?
 * 2. Design — What does content look like?
 * 3. Extending — How do I use it / add to it?
 * 4. Shell — Technical details about layout composition
 * 5. Removing — How to cleanly remove (last, least common)
 */

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHashState } from "@/lib/hooks"
import { AppSurfaceOverviewTab } from "./_tabs/overview-tab"
import { DesignTab } from "./_tabs/design-tab"
import { DevelopTab } from "./_tabs/extending-tab"
import { LayoutTab } from "./_tabs/shell-tab"
import { RemovalTab } from "./_tabs/removing-tab"

export default function AppSurfacePage() {
  const [tab, setTab] = useHashState("_default", "overview")

  return (
    <article className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header */}
      {/* ------------------------------------------------------------------ */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">App Surface</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          The authenticated product experience — dashboards, settings, and
          operational tools with persistent sidebar navigation.
        </p>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs */}
      {/* ------------------------------------------------------------------ */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="develop">Develop</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="removal">Removal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <AppSurfaceOverviewTab />
        </TabsContent>
        <TabsContent value="design" className="pt-6">
          <DesignTab />
        </TabsContent>
        <TabsContent value="develop" className="pt-6">
          <DevelopTab />
        </TabsContent>
        <TabsContent value="layout" className="pt-6">
          <LayoutTab />
        </TabsContent>
        <TabsContent value="removal" className="pt-6">
          <RemovalTab />
        </TabsContent>
      </Tabs>
    </article>
  )
}
