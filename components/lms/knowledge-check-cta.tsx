/**
 * CATALYST - Knowledge Check CTA
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

interface KnowledgeCheckCTAProps {
  quizId: string
}

export function KnowledgeCheckCTA({ quizId }: KnowledgeCheckCTAProps) {
  return (
    <div className="pt-6 border-t">
      <Button asChild size="lg" className="w-full gap-2">
        <Link href={`/learn/quiz/${quizId}`}>
          Continue to Knowledge Check
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
