/**
 * CATALYST - Essentials View Component
 * 
 * Renders the AI-extracted essentials in LPAR format:
 * - TL;DR summary
 * - Key Facts (Learn)
 * - Scripts (Apply)
 * - Images & Audio (Reference)
 * - Practice Scenario (Practice)
 * - Linked Scenarios (Practice with AI)
 * - Reflection (Reflect)
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stack, Row, Text, Title } from "@/components/core"
import { 
  Copy, 
  Check, 
  Target, 
  FileText, 
  Image as ImageIcon, 
  Headphones, 
  MessageSquare, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Bot,
} from "lucide-react"
import type { EssentialsContent } from "@/lib/learning-types"

/** Minimal scenario data for linking */
interface ScenarioLink {
  slug: string
  title: string
  scenarioCount: number | null
}

interface EssentialsViewProps {
  essentials: EssentialsContent
  onSwitchMode: () => void
  linkedScenarios?: ScenarioLink[]
  /** Market data component to render after summary section */
  marketData?: React.ReactNode
}

export function EssentialsView({
  essentials,
  onSwitchMode,
  linkedScenarios = [],
  marketData,
}: EssentialsViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  const copyScript = async (script: string, index: number) => {
    await navigator.clipboard.writeText(script)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }
  
  const hasEssentialImages = essentials.images?.filter(img => img.essential).length > 0
  const hasAudio = essentials.audio?.length > 0
  
  // Track section numbers for consistent styling with deep dive
  let sectionNumber = 0
  
  return (
    <div className="lms-sections essentials-view">
      {/* Summary Section */}
      <section id="summary" className="lms-section-card lms-section-card--intro essentials-section--summary">
        <div className="lms-section-card__content">
          <Row gap="sm" className="essentials-section__header">
            <Sparkles className="essentials-section__icon essentials-section__icon--summary" />
            <Title as="h2" size="h5" className="essentials-section__title">Summary</Title>
          </Row>
          <Text className="essentials-tldr__text">
            {essentials.tldr}
          </Text>
        </div>
      </section>

      {/* Market Data - shown after summary for relevant modules */}
      {marketData && (
        <section id="market-data" className="lms-section-card">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            Market Data
          </h2>
          <div className="lms-section-card__content">
            {marketData}
          </div>
        </section>
      )}

      {/* Key Facts */}
      {essentials.keyFacts?.length > 0 && (
        <section id="key-facts" className="lms-section-card">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <Target className="essentials-section__icon" />
            Key Facts
          </h2>
          <div className="lms-section-card__content">
            <ul className="essentials-facts__list">
              {essentials.keyFacts.map((fact, i) => (
                <li key={i} className="essentials-facts__item">
                  <span className="essentials-facts__bullet">•</span>
                  <div className="essentials-facts__content">
                    <Text>{fact.fact}</Text>
                    {fact.context && (
                      <Text size="sm" className="essentials-facts__context">
                        {fact.context}
                      </Text>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      
      {/* Scripts */}
      {essentials.scripts?.length > 0 && (
        <section id="scripts" className="lms-section-card">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <FileText className="essentials-section__icon" />
            Scripts
          </h2>
          <div className="lms-section-card__content">
            <Stack gap="md" className="essentials-scripts__list">
              {essentials.scripts.map((script, i) => (
                <div key={i} className="essentials-script">
                  <Text weight="medium" className="essentials-script__scenario">
                    {script.scenario}
                  </Text>
                  <blockquote className="essentials-script__text">
                    "{script.script}"
                  </blockquote>
                  <Row gap="sm" className="essentials-script__actions">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyScript(script.script, i)}
                      className="essentials-script__copy"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Script
                        </>
                      )}
                    </Button>
                  </Row>
                </div>
              ))}
            </Stack>
          </div>
        </section>
      )}
      
      {/* Images */}
      {hasEssentialImages && (
        <section id="key-documents" className="lms-section-card">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <ImageIcon className="essentials-section__icon" />
            Key Documents
          </h2>
          <div className="lms-section-card__content">
            <div className="essentials-images__grid">
              {essentials.images
                .filter(img => img.essential)
                .map((img, i) => (
                  <figure key={i} className="essentials-image">
                    <div className="essentials-image__wrapper">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={600}
                        height={400}
                        className="essentials-image__img"
                      />
                    </div>
                    <figcaption className="essentials-image__caption">
                      <Text weight="medium">{img.caption}</Text>
                      {img.context && (
                        <Text size="sm" className="essentials-image__context">
                          {img.context}
                        </Text>
                      )}
                    </figcaption>
                  </figure>
                ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Audio */}
      {hasAudio && (
        <section id="coach-demo" className="lms-section-card">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <Headphones className="essentials-section__icon" />
            Coach Demo
            <Text size="sm" className="essentials-audio__duration">
              {essentials.audio[0].duration}
            </Text>
          </h2>
          <div className="lms-section-card__content">
            {essentials.audio.map((audio, i) => (
              <div key={i} className="essentials-audio__item">
                <Text className="essentials-audio__context">{audio.context}</Text>
                {/* TODO: Integrate AudioCoachPlayer when audio URLs are available */}
                <div className="essentials-audio__player">
                  <Text size="sm" className="text-muted-foreground">
                    Audio: {audio.title}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Practice Scenario */}
      {essentials.practice && (
        <section id="practice-scenario" className="lms-section-card essentials-section--practice">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <MessageSquare className="essentials-section__icon" />
            Practice Scenario
          </h2>
          <div className="lms-section-card__content">
            <div className="essentials-practice__situation">
              <Text weight="medium">{essentials.practice.situation}</Text>
            </div>
            
            <div className="essentials-practice__task">
              <Text size="sm" className="essentials-practice__label">Your task:</Text>
              <Text>{essentials.practice.task}</Text>
            </div>
            
            <div className="essentials-practice__success">
              <Text size="sm" className="essentials-practice__label">Success criteria:</Text>
              <Text size="sm" className="text-muted-foreground">
                {essentials.practice.success}
              </Text>
            </div>
          </div>
        </section>
      )}
      
      {/* Practice with AI - links to scenario bank */}
      {linkedScenarios.length > 0 && (
        <section id="practice-with-ai" className="lms-section-card essentials-section--ai-practice">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <Bot className="essentials-section__icon" />
            Practice with AI
          </h2>
          <div className="lms-section-card__content">
            <Text size="sm" className="essentials-ai-practice__intro">
              Ready to practice what you learned? Try these AI roleplay scenarios:
            </Text>
            <div className="essentials-ai-practice__grid">
              {linkedScenarios.map((scenario) => (
                <Link
                  key={scenario.slug}
                  href={`/learn/scenarios/${scenario.slug}`}
                  className="essentials-ai-practice__card"
                >
                  <div className="essentials-ai-practice__icon">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="essentials-ai-practice__content">
                    <span className="essentials-ai-practice__title">{scenario.title}</span>
                    {scenario.scenarioCount && (
                      <span className="essentials-ai-practice__count">
                        {scenario.scenarioCount} practice scenarios
                      </span>
                    )}
                  </div>
                  <ArrowRight className="essentials-ai-practice__arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Your Takeaway - reflection question */}
      {essentials.reflection && (
        <section id="your-takeaway" className="lms-section-card">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <HelpCircle className="essentials-section__icon" />
            Your Takeaway
          </h2>
          <div className="lms-section-card__content">
            <Text className="essentials-reflection__prompt">{essentials.reflection}</Text>
          </div>
        </section>
      )}
      
      {/* Deep Dive CTA */}
      <section id="deep-dive-cta" className="lms-section-card essentials-section--cta">
        <div className="lms-section-card__content essentials-cta__content">
          <Text className="essentials-cta__title">
            📖 Want the full details?
          </Text>
          <Text size="sm" className="essentials-cta__description">
            This essentials view covers the key points. Switch to Deep Dive for comprehensive content with full context and examples.
          </Text>
          <Button variant="outline" onClick={onSwitchMode} className="essentials-cta__button">
            Switch to Deep Dive
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
