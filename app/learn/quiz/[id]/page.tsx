/**
 * CATALYST - Quiz Page
 *
 * Knowledge check interface for learning modules.
 * Dynamic route: /learn/quiz/[id]
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Quiz Data (mock - would come from database)
// -----------------------------------------------------------------------------

const quizData: Record<string, {
  title: string
  moduleSlug: string
  competencySlug: string
  questions: Array<{
    id: string
    question: string
    options: Array<{ text: string; correct: boolean }>
    explanation: string
  }>
}> = {
  "market-intelligence-1": {
    title: "Dubai Real Estate Overview Quiz",
    moduleSlug: "dubai-real-estate-overview",
    competencySlug: "market-intelligence",
    questions: [
      {
        id: "q1",
        question: "When was freehold property ownership first extended to foreign nationals in Dubai?",
        options: [
          { text: "1997", correct: false },
          { text: "2002", correct: true },
          { text: "2008", correct: false },
          { text: "2010", correct: false },
        ],
        explanation: "Freehold ownership was extended to foreign nationals in designated areas in 2002, five years after it was introduced for UAE nationals in 1997.",
      },
      {
        id: "q2",
        question: "Which of the following is NOT a key characteristic of Dubai's current real estate market?",
        options: [
          { text: "Population growth driving housing demand", correct: false },
          { text: "Robust regulatory framework (RERA, DLD)", correct: false },
          { text: "Higher prices than London and New York", correct: true },
          { text: "Economic diversification supporting investment", correct: false },
        ],
        explanation: "Dubai remains competitively priced compared to global gateway cities like London, New York, and Singapore, which is one of its key attractions for international investors.",
      },
      {
        id: "q3",
        question: "What significant market event occurred between 2008-2010?",
        options: [
          { text: "First real estate boom", correct: false },
          { text: "Global financial crisis impact and market correction", correct: true },
          { text: "Introduction of freehold ownership", correct: false },
          { text: "Launch of Golden Visa program", correct: false },
        ],
        explanation: "The global financial crisis had a significant impact on Dubai's property market between 2008-2010, leading to a market correction before the recovery period began in 2011.",
      },
      {
        id: "q4",
        question: "Why is understanding Dubai's market context important for real estate consultants?",
        options: [
          { text: "To memorize statistics for client meetings", correct: false },
          { text: "To position Dubai credibly and address investor concerns with facts", correct: true },
          { text: "To compare prices with other markets", correct: false },
          { text: "To predict future market movements", correct: false },
        ],
        explanation: "Understanding market context enables consultants to position Dubai as a credible investment destination, address investor concerns with factual context, and demonstrate expertise that builds client trust.",
      },
      {
        id: "q5",
        question: "What has driven Dubai's remarkable real estate growth since 2021?",
        options: [
          { text: "Pandemic-driven transformation and market fundamentals", correct: true },
          { text: "Government subsidies for property purchases", correct: false },
          { text: "Removal of all foreign ownership restrictions", correct: false },
          { text: "Mandatory property investment requirements", correct: false },
        ],
        explanation: "The Dubai real estate market has demonstrated remarkable resilience and growth since 2021, driven by pandemic-driven transformation, strong market fundamentals, and continued economic diversification.",
      },
    ],
  },
  "market-intelligence-2": {
    title: "Regulatory Framework Quiz",
    moduleSlug: "regulatory-framework",
    competencySlug: "market-intelligence",
    questions: [
      {
        id: "q1",
        question: "What is the primary role of RERA in Dubai's real estate sector?",
        options: [
          { text: "Issuing title deeds", correct: false },
          { text: "Collecting registration fees", correct: false },
          { text: "Licensing professionals and regulating the market", correct: true },
          { text: "Providing mortgage financing", correct: false },
        ],
        explanation: "RERA (Real Estate Regulatory Agency) is responsible for licensing real estate professionals and companies, regulating property advertisements, managing escrow accounts, and handling disputes.",
      },
      {
        id: "q2",
        question: "What is the standard property registration fee collected by DLD?",
        options: [
          { text: "2% of property value", correct: false },
          { text: "4% of property value", correct: true },
          { text: "5% of property value", correct: false },
          { text: "10% of property value", correct: false },
        ],
        explanation: "The Dubai Land Department collects a registration fee of 4% of the property value for all property transactions.",
      },
      {
        id: "q3",
        question: "What is the purpose of escrow accounts for off-plan purchases?",
        options: [
          { text: "To hold the buyer's personal documents", correct: false },
          { text: "To provide tax benefits to developers", correct: false },
          { text: "To protect buyers by ensuring funds are used only for construction", correct: true },
          { text: "To speed up the transaction process", correct: false },
        ],
        explanation: "Escrow regulations require developers to open dedicated accounts where buyer payments can only be used for construction, protecting buyers from developer insolvency or fund misuse.",
      },
      {
        id: "q4",
        question: "Which document confirms that a developer has no outstanding payments from a property seller?",
        options: [
          { text: "MOU (Memorandum of Understanding)", correct: false },
          { text: "Title Deed", correct: false },
          { text: "NOC (No Objection Certificate)", correct: true },
          { text: "Oqood", correct: false },
        ],
        explanation: "The NOC (No Objection Certificate) is issued by the developer confirming there are no outstanding payments or issues before a property can be transferred to a new owner.",
      },
      {
        id: "q5",
        question: "What is an Oqood?",
        options: [
          { text: "A type of lease agreement", correct: false },
          { text: "A title deed for off-plan properties", correct: true },
          { text: "A mortgage document", correct: false },
          { text: "A developer registration certificate", correct: false },
        ],
        explanation: "Oqood is the title document issued for off-plan properties, while a Title Deed is issued for completed properties after full payment and handover.",
      },
    ],
  },
  "market-intelligence-3": {
    title: "Golden Visa & Residency Quiz",
    moduleSlug: "golden-visa",
    competencySlug: "market-intelligence",
    questions: [
      {
        id: "q1",
        question: "A client is considering a AED 1.9M apartment. What should you highlight before they proceed?",
        options: [
          { text: "The property is overpriced for the area", correct: false },
          { text: "They're AED 100K short of Golden Visa eligibility—consider going slightly higher", correct: true },
          { text: "They should wait for prices to drop", correct: false },
          { text: "The rental yield will be too low", correct: false },
        ],
        explanation: "At AED 1.9M, the client is just AED 100K short of the AED 2M Golden Visa threshold. A good consultant always flags this proximity so the client can make an informed decision about whether the visa benefits are worth the additional investment.",
      },
      {
        id: "q2",
        question: "A client asks: 'Can I get the Golden Visa if I buy with a mortgage?' What's the correct response?",
        options: [
          { text: "Yes, mortgages up to 50% LTV are allowed for visa purposes", correct: false },
          { text: "No, the property must be fully paid off—but you can buy with a mortgage and pay it down before applying", correct: true },
          { text: "Yes, but you need a UAE bank mortgage specifically", correct: false },
          { text: "No, and you can never apply once a mortgage has been on the property", correct: false },
        ],
        explanation: "The Golden Visa requires the property to be fully paid off (no mortgage). However, many investors purchase with a mortgage initially and pay it down or refinance before applying for the visa. This is a common strategy that should be explained clearly.",
      },
      {
        id: "q3",
        question: "Beyond residency, what is often the MOST practical benefit of the Golden Visa for international investors?",
        options: [
          { text: "Access to UAE healthcare", correct: false },
          { text: "UAE banking access for property management", correct: true },
          { text: "Ability to vote in UAE elections", correct: false },
          { text: "Free education for children", correct: false },
        ],
        explanation: "UAE bank accounts require residency. Without the Golden Visa, managing rental income, paying service charges, and handling property matters becomes complicated. The banking access is often more valuable than the residency itself for investors who don't plan to live in Dubai.",
      },
      {
        id: "q4",
        question: "How should you position the Golden Visa to a yield-focused UK investor comparing Dubai to London?",
        options: [
          { text: "Focus only on the residency benefits and lifestyle", correct: false },
          { text: "Explain that Dubai yields (6-7%) plus the visa is better value than UK investor visas (£2M+) with lower yields (3-4%)", correct: true },
          { text: "Tell them the Golden Visa isn't relevant if they want yield", correct: false },
          { text: "Recommend they buy in London instead for stability", correct: false },
        ],
        explanation: "For yield-focused investors, position the Golden Visa as a bonus on top of strong returns. In the UK, investor visas require £2M+ AND deliver only 3-4% yields. In Dubai, the same AED 2M (≈£430K) delivers 6-7% yield AND a 10-year visa. This comparison demonstrates clear value.",
      },
      {
        id: "q5",
        question: "A family client asks about sponsoring relatives. What can the Golden Visa holder sponsor?",
        options: [
          { text: "Spouse only", correct: false },
          { text: "Spouse and children under 18 only", correct: false },
          { text: "Spouse, children, and potentially parents", correct: true },
          { text: "Extended family including siblings", correct: false },
        ],
        explanation: "The Golden Visa allows holders to sponsor their spouse, children (regardless of age for sons with certain conditions, daughters until marriage), and in some cases parents. This makes it a complete family solution, which is a powerful selling point for family-oriented investors.",
      },
    ],
  },
  "client-discovery-5": {
    title: "Understanding Investment Goals Quiz",
    moduleSlug: "understanding-investment-goals",
    competencySlug: "client-discovery",
    questions: [
      {
        id: "q1",
        question: "What is the minimum property investment required for a 10-year Golden Visa?",
        options: [
          { text: "AED 750,000", correct: false },
          { text: "AED 1,000,000", correct: false },
          { text: "AED 2,000,000", correct: true },
          { text: "AED 5,000,000", correct: false },
        ],
        explanation: "The Golden Visa program requires a property investment of AED 2 million or more for a 10-year residency visa.",
      },
      {
        id: "q2",
        question: "Which investor type typically prefers off-plan purchases in emerging areas?",
        options: [
          { text: "Yield-focused investors", correct: false },
          { text: "Capital growth investors", correct: true },
          { text: "Lifestyle investors", correct: false },
          { text: "Short-term traders", correct: false },
        ],
        explanation: "Capital growth investors typically prefer off-plan purchases in emerging areas, accepting lower initial yields in exchange for appreciation potential over a longer time horizon.",
      },
      {
        id: "q3",
        question: "What is the first category of discovery questions in the framework?",
        options: [
          { text: "Investment objectives", correct: false },
          { text: "Property preferences", correct: false },
          { text: "Financial position", correct: true },
          { text: "Timeline requirements", correct: false },
        ],
        explanation: "The discovery questions framework starts with understanding the client's financial position (budget, financing preference, capital deployment timeline) before moving to investment objectives.",
      },
      {
        id: "q4",
        question: "Which type of property would you recommend to a yield-focused investor?",
        options: [
          { text: "Off-plan in Dubai South", correct: false },
          { text: "Ready, tenanted property in established area", correct: true },
          { text: "Premium villa on Palm Jumeirah", correct: false },
          { text: "Any property over AED 2M", correct: false },
        ],
        explanation: "Yield-focused investors prefer completed, tenanted properties in established areas with proven rental demand, as they need regular income from their investment.",
      },
      {
        id: "q5",
        question: "What question helps uncover a client's true concerns about Dubai investment?",
        options: [
          { text: "What is your budget?", correct: false },
          { text: "What concerns, if any, do you have about Dubai real estate?", correct: true },
          { text: "When do you want to complete the purchase?", correct: false },
          { text: "How many properties do you own?", correct: false },
        ],
        explanation: "Asking about concerns directly helps uncover the investor's specific worries and objections, which can then be addressed with relevant information and reassurance.",
      },
    ],
  },
  "client-discovery-1": {
    title: "Discovery: Investors Quiz",
    moduleSlug: "discovery-investors",
    competencySlug: "client-discovery",
    questions: [
      {
        id: "q1",
        question: "An investor says 'I want a good investment in Dubai.' What should you do next?",
        options: [
          { text: "Show them the highest-yielding properties available", correct: false },
          { text: "Ask what they mean by 'good'—yield, growth, safety, or something else", correct: true },
          { text: "Send them a list of current opportunities", correct: false },
          { text: "Explain Dubai market fundamentals", correct: false },
        ],
        explanation: "'Good investment' means different things to different people. Without qualifying what they mean—yield-focused, growth-focused, safety-focused, or tax-focused—you can't recommend appropriately.",
      },
      {
        id: "q2",
        question: "During investor discovery, you learn the client has spoken to two other agents. What's the best response?",
        options: [
          { text: "Ignore it and focus on your properties", correct: false },
          { text: "Ask what their experience was like and what worked or didn't work", correct: true },
          { text: "Offer to beat any deal the other agents showed them", correct: false },
          { text: "Explain why Prime Capital is better than competitors", correct: false },
        ],
        explanation: "Understanding the competitive situation helps you position effectively. Asking about their experience reveals what they're looking for and what hasn't worked.",
      },
      {
        id: "q3",
        question: "A client's stated goal is 'high rental yield.' Using the 'Goal Behind the Goal' technique, which question would best uncover their deeper motivation?",
        options: [
          { text: "What yield percentage are you targeting?", correct: false },
          { text: "What does that rental income actually mean for you?", correct: true },
          { text: "Have you considered areas with higher yields?", correct: false },
          { text: "Would you sacrifice yield for capital growth?", correct: false },
        ],
        explanation: "'What does that rental income actually mean for you?' uncovers the motivation behind the stated goal. They might reveal it's about early retirement, financial independence, or replacing job income.",
      },
      {
        id: "q4",
        question: "An Indian investor seems interested but keeps giving vague answers. What's the most appropriate approach?",
        options: [
          { text: "Push harder for specific information", correct: false },
          { text: "Assume they're not serious and deprioritize", correct: false },
          { text: "Offer specific options to choose from rather than open-ended questions", correct: true },
          { text: "End the call and follow up by email instead", correct: false },
        ],
        explanation: "Some clients don't respond well to open-ended questions. Offering specific options ('Are you more focused on yield or capital growth?') gives them something to react to and often generates more information.",
      },
      {
        id: "q5",
        question: "You've completed discovery with an investor. Before recommending properties, what should you always do?",
        options: [
          { text: "Send them listings immediately while interest is high", correct: false },
          { text: "Summarize what you've understood and confirm accuracy", correct: true },
          { text: "Ask if they want to see properties", correct: false },
          { text: "Check your inventory for matching options", correct: false },
        ],
        explanation: "Always confirm understanding before proceeding. Summarizing what you've heard catches misunderstandings early and shows the client you've listened carefully.",
      },
    ],
  },
  "client-discovery-2": {
    title: "BANT+ Qualification Quiz",
    moduleSlug: "qualification-framework",
    competencySlug: "client-discovery",
    questions: [
      {
        id: "q1",
        question: "A client says they have a budget of 'around two million dirhams.' What's the next essential qualification question?",
        options: [
          { text: "What areas are you interested in?", correct: false },
          { text: "Would that be cash or financing?", correct: true },
          { text: "When are you looking to buy?", correct: false },
          { text: "Have you looked at properties before?", correct: false },
        ],
        explanation: "Cash vs. financing fundamentally changes the process and timeline. A cash buyer can move faster; a financed buyer needs mortgage approval. This is essential qualifying information.",
      },
      {
        id: "q2",
        question: "In the BANT+ framework, what does the '+' represent?",
        options: [
          { text: "Plus other decision-makers", correct: false },
          { text: "The competitive situation", correct: true },
          { text: "Additional budget flexibility", correct: false },
          { text: "Extended timeline considerations", correct: false },
        ],
        explanation: "BANT covers Budget, Authority, Need, and Timeline. The '+' adds Competitive Situation—understanding what other agents, markets, or options the client is considering.",
      },
      {
        id: "q3",
        question: "A client mentions their wife will be involved in the decision. According to the Decision Map framework, what role does the wife likely play?",
        options: [
          { text: "She's definitely the blocker", correct: false },
          { text: "She could be any of the four roles—economic buyer, user, influencer, or blocker", correct: true },
          { text: "She's automatically the user", correct: false },
          { text: "She's a secondary contact to copy on emails", correct: false },
        ],
        explanation: "Without more information, the wife could play any role. You need to explore further to understand her specific role in the decision.",
      },
      {
        id: "q4",
        question: "A lead says 'I'm just looking' when asked about timeline. What's the best response?",
        options: [
          { text: "Deprioritize them as not serious", correct: false },
          { text: "Send them generic market information", correct: false },
          { text: "Probe to understand what sparked their interest and whether there's any timeline context", correct: true },
          { text: "Schedule a follow-up in six months", correct: false },
        ],
        explanation: "'Just looking' can mean genuinely exploratory or hiding hesitation. Probe further: 'What sparked your interest now?' This reveals whether they're truly early-stage or further along.",
      },
      {
        id: "q5",
        question: "Which combination of BANT+ signals indicates a HOT lead?",
        options: [
          { text: "Clear budget, unclear timeline, single decision-maker, no competition", correct: false },
          { text: "Vague budget, urgent timeline, multiple decision-makers, comparing markets", correct: false },
          { text: "Clear budget, deadline-driven timeline, accessible decision-maker, chose Dubai over alternatives", correct: true },
          { text: "Flexible budget, no timeline, sole decision-maker, first enquiry", correct: false },
        ],
        explanation: "Hot leads have: clear budget, deadline-driven timeline, accessible decision-maker, and have already chosen Dubai over alternatives.",
      },
    ],
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string
  const quiz = quizData[quizId]

  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null)
  const [isAnswered, setIsAnswered] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)

  if (!quiz) {
    return (
      <Container size="md" className="py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Stack gap="md" align="center">
              <XCircleIcon className="h-12 w-12 text-muted-foreground" />
              <Title size="h3">Quiz Not Found</Title>
              <Text variant="muted">
                The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
              </Text>
              <Button nativeButton={false} render={<Link href="/learn" />}>
                Back to Dashboard
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const passThreshold = config.learning.quizPassThreshold
  const passed = score / quiz.questions.length >= passThreshold

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    setIsAnswered(true)
    if (question.options[selectedAnswer].correct) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setIsComplete(false)
  }

  // Completion Screen
  if (isComplete) {
    return (
      <Container size="md" className="py-8">
        <Stack gap="xl">
          <Card>
            <CardContent className="py-12">
              <Stack gap="lg" align="center">
                {passed ? (
                  <CheckCircleIcon className="h-16 w-16 text-success" />
                ) : (
                  <XCircleIcon className="h-16 w-16 text-destructive" />
                )}
                <Stack gap="sm" align="center">
                  <Title size="h2">
                    {passed ? "Congratulations!" : "Keep Learning"}
                  </Title>
                  <Text variant="muted" align="center">
                    {passed
                      ? "You've successfully completed this knowledge check."
                      : `You need ${Math.round(passThreshold * 100)}% to pass. Review the module and try again.`}
                  </Text>
                </Stack>

                <Card className="w-full max-w-xs">
                  <CardContent className="pt-6">
                    <Stack gap="sm" align="center">
                      <Title size="h1">
                        {score}/{quiz.questions.length}
                      </Title>
                      <Text variant="muted">
                        {Math.round((score / quiz.questions.length) * 100)}% correct
                      </Text>
                      <Badge variant={passed ? "default" : "destructive"}>
                        {passed ? "Passed" : "Not Passed"}
                      </Badge>
                    </Stack>
                  </CardContent>
                </Card>

                <Row gap="md">
                  {!passed && (
                    <Button variant="outline" onClick={handleRetry}>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Retry Quiz
                    </Button>
                  )}
                  <Button
                    nativeButton={false}
                    render={<Link href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`} />}
                  >
                    {passed ? "Continue Learning" : "Review Module"}
                  </Button>
                </Row>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    )
  }

  // Quiz Screen
  return (
    <Container size="md" className="py-8">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="sm">
          <Row gap="sm" align="center">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`} />}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Module
            </Button>
          </Row>
          <Row gap="sm" align="center" justify="between">
            <Stack gap="xs">
              <Badge variant="outline">
                <ClipboardCheckIcon className="h-3 w-3 mr-1" />
                Knowledge Check
              </Badge>
              <Title size="h3">{quiz.title}</Title>
            </Stack>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </Row>
          <Progress value={progress} className="h-2" />
        </Stack>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = option.correct
                const showCorrect = isAnswered && isCorrect
                const showIncorrect = isAnswered && isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswered}
                    className={cn(
                      "quiz-option w-full text-left p-4 rounded-lg border-2 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      isSelected && !isAnswered && "border-primary bg-primary/5",
                      !isSelected && !isAnswered && "border-border hover:border-primary/50",
                      showCorrect && "border-success bg-success/10",
                      showIncorrect && "border-destructive bg-destructive/10",
                      isAnswered && !isSelected && !isCorrect && "opacity-50"
                    )}
                    data-selected={isSelected}
                    data-correct={showCorrect}
                    data-incorrect={showIncorrect}
                  >
                    <Row gap="sm" align="center">
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-medium",
                          isSelected && !isAnswered && "border-primary text-primary",
                          !isSelected && !isAnswered && "border-muted-foreground text-muted-foreground",
                          showCorrect && "border-success text-success",
                          showIncorrect && "border-destructive text-destructive"
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Text className="flex-1">{option.text}</Text>
                      {showCorrect && <CheckCircleIcon className="h-5 w-5 text-success" />}
                      {showIncorrect && <XCircleIcon className="h-5 w-5 text-destructive" />}
                    </Row>
                  </button>
                )
              })}
            </Stack>

            {/* Explanation */}
            {isAnswered && (
              <Card className="mt-4 border-primary/20 bg-primary/5">
                <CardContent className="pt-4">
                  <Stack gap="xs">
                    <Text size="sm" weight="medium">Explanation</Text>
                    <Text size="sm" variant="muted">
                      {question.explanation}
                    </Text>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Row gap="md" justify="end">
          {!isAnswered ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </Row>
      </Stack>
    </Container>
  )
}
