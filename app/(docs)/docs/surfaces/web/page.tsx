/**
 * CATALYST - Web Surface Documentation
 */

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHashState } from "@/lib/hooks"
import { OverviewTab } from "./_tabs/overview-tab"
import { DesignTab } from "./_tabs/design-tab"
import { DevelopTab } from "./_tabs/extending-tab"
import { LayoutTab } from "./_tabs/shell-tab"
import { RemovalTab } from "./_tabs/removing-tab"

export default function WebSurfacePage() {
  const [tab, setTab] = useHashState("_default", "overview")

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Web Surface</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Your public website — marketing pages, content, or a full site.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="develop">Develop</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="removal">Removal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <OverviewTab />
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
