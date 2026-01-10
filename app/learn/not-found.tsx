import Link from "next/link"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { SearchXIcon, ArrowLeftIcon } from "lucide-react"

export default function NotFound() {
  return (
    <Stack gap="lg" align="center" className="py-16 text-center">
      <SearchXIcon className="h-16 w-16 text-muted-foreground" />
      
      <Stack gap="sm">
        <Title size="h2">Content Not Found</Title>
        <Text className="text-muted-foreground max-w-md">
          The module or competency you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
      </Stack>
      
      <Button className="gap-2" render={<Link href="/learn" />}>
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </Stack>
  )
}
