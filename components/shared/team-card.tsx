/**
 * CATALYST - Team Card Component
 *
 * Displays a team member in card format for the marketing website.
 * Used on the team page and homepage featured team section.
 */

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type TeamMember } from "@/lib/content"
import { LinkedinIcon, MailIcon } from "lucide-react"

interface TeamCardProps {
  member: TeamMember
  className?: string
  /** Whether to link to full profile page */
  linkToProfile?: boolean
}

export function TeamCard({ member, className, linkToProfile = true }: TeamCardProps) {
  const content = (
    <Card
      className={cn(
        "team-card overflow-hidden group transition-all",
        linkToProfile && "cursor-pointer hover:shadow-lg hover:border-primary/20",
        className
      )}
    >
      {/* Team Member Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <span className="text-4xl font-headline text-primary/40">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-headline text-lg font-medium leading-tight group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Contact Links */}
        <div className="flex items-center gap-3">
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <LinkedinIcon className="h-4 w-4" />
              <span className="sr-only">LinkedIn profile</span>
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MailIcon className="h-4 w-4" />
              <span className="sr-only">Email {member.name}</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (linkToProfile) {
    return (
      <Link href={`/team/${member.slug}`}>
        {content}
      </Link>
    )
  }

  return content
}
