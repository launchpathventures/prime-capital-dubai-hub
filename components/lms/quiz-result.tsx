/**
 * CATALYST - Quiz Result
 */

import { Stack, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizResultProps {
  score: number
  total: number
  passingScore: number
  quizTitle: string
  quizDescription?: string
}

export function QuizResult({ 
  score, 
  total, 
  passingScore, 
  quizTitle,
  quizDescription 
}: QuizResultProps) {
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= passingScore
  
  return (
    <Stack gap="lg" className="text-center">
      {/* Success/Fail Icon */}
      <div className="mx-auto">
        {passed ? (
          <CheckCircle2Icon className="h-16 w-16 text-green-500" />
        ) : (
          <XCircleIcon className="h-16 w-16 text-red-500" />
        )}
      </div>
      
      {/* Header */}
      <Stack gap="xs">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          Knowledge Check Complete
        </Text>
        <Title size="h2">{quizTitle}</Title>
        {quizDescription && (
          <Text className="text-muted-foreground">{quizDescription}</Text>
        )}
      </Stack>
      
      {/* Score Card */}
      <Card className="border">
        <CardContent className="p-6">
          <Stack gap="md">
            <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
              Your Score
            </Text>
            
            <Stack gap="xs">
              <Text className="text-5xl font-bold">
                {score}/{total}
              </Text>
              <Text size="lg" className="text-muted-foreground">
                {percentage}%
              </Text>
              <div className={cn(
                "inline-block px-3 py-1 rounded-full text-sm font-medium mx-auto",
                passed 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                {passed ? "PASSED" : "NOT PASSED"}
              </div>
            </Stack>
            
            <Progress 
              value={percentage} 
              className="h-3"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
