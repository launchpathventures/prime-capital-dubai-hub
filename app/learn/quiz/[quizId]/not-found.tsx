/**
 * CATALYST - Quiz Not Found
 */

import Link from "next/link"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { GraduationCapIcon, SearchXIcon } from "lucide-react"

export default function QuizNotFound() {
  return (
    <div className="learn-shell">
      <header className="learn-header">
        <div className="learn-header__inner">
          <Link href="/learn" className="learn-header__logo">
            <span className="learn-header__logo-icon">
              <GraduationCapIcon className="h-3.5 w-3.5" />
            </span>
            Prime Capital Learning
          </Link>
        </div>
      </header>
      
      <main className="learn-main learn-main--centered">
        <Stack gap="lg" align="center" className="max-w-md mx-auto text-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <SearchXIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <Stack gap="sm">
            <Title size="h2">Quiz Not Found</Title>
            <Text className="text-muted-foreground">
              This quiz doesn&apos;t exist or has no questions yet.
            </Text>
          </Stack>
          
          <Button 
            size="lg"
            render={<Link href="/learn" />}
          >
            Back to Learning Dashboard
          </Button>
        </Stack>
      </main>
    </div>
  )
}
