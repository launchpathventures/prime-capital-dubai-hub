/**
 * CATALYST - Knowledge Check CTA
 * Uses Prime Capital brand design tokens.
 */

import Link from "next/link"
import { Row, Stack, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, ClipboardCheckIcon } from "lucide-react"

interface KnowledgeCheckCTAProps {
  quizId: string
}

export function KnowledgeCheckCTA({ quizId }: KnowledgeCheckCTAProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-6 px-6">
        <Row align="center" justify="between" className="flex-col sm:flex-row gap-4">
          <Row gap="md" align="center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ClipboardCheckIcon className="h-6 w-6 text-primary" />
            </div>
            <Stack gap="xs">
              <Text weight="semibold" className="text-foreground">
                Ready to test your knowledge?
              </Text>
              <Text size="sm" className="text-muted-foreground">
                Complete a short quiz to reinforce what you&apos;ve learned.
              </Text>
            </Stack>
          </Row>
          <Button 
            size="lg" 
            className="gap-2 shrink-0" 
            nativeButton={false}
            render={<Link href={`/learn/quiz/${quizId}`} />}
          >
            Take Quiz
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </Row>
      </CardContent>
    </Card>
  )
}
