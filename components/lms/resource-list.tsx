/**
 * CATALYST - Resource List
 */

import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { FileTextIcon, VideoIcon, ExternalLinkIcon, ChevronRightIcon } from "lucide-react"

interface Resource {
  title: string
  type: string
  url?: string
}

interface ResourceListProps {
  resources: Resource[]
}

export function ResourceList({ resources }: ResourceListProps) {
  if (!resources || resources.length === 0) return null
  
  return (
    <Stack gap="md">
      <Title size="h3" className="flex items-center gap-2">
        📚 Resources
      </Title>
      
      <Stack gap="xs">
        {resources.map((resource, i) => (
          <Card key={i} className="border hover:border-foreground/20 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <Row align="center" justify="between">
                <Row gap="sm" align="center">
                  <ResourceIcon type={resource.type} />
                  <Text size="sm">{resource.title}</Text>
                </Row>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </Row>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

function ResourceIcon({ type }: { type: string }) {
  switch (type) {
    case "video":
      return <VideoIcon className="h-4 w-4 text-muted-foreground" />
    case "link":
      return <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
    default:
      return <FileTextIcon className="h-4 w-4 text-muted-foreground" />
  }
}
