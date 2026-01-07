/**
 * CATALYST - Team Card Component (Client)
 *
 * Interactive team member card with social links.
 * Client component to support onClick handlers for stopping event propagation.
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import { Text } from "@/components/core"
import { ArrowRightIcon, LinkedinIcon, MailIcon, UserIcon } from "lucide-react"

interface TeamMember {
  id: string
  slug: string
  name: string
  role: string
  photo?: string | null
  shortBio?: string | null
  email?: string | null
  linkedin?: string | null
  isFounder?: boolean
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Link href={`/team/${member.slug}`} className="group block">
      <div className="card-lift bg-white rounded-[2px] overflow-hidden shadow-sm">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--web-serenity)]/20">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="img-zoom object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <UserIcon className="h-20 w-20 text-[var(--web-spruce)]/30" />
            </div>
          )}
          
          {/* Founder badge */}
          {member.isFounder && (
            <div className="absolute top-4 left-4 bg-[var(--web-ash)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider px-3 py-1 rounded-[2px]">
              Founder
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-headline text-[var(--web-ash)] text-xl font-normal mb-1 group-hover:text-[var(--web-spruce)] transition-colors">
            {member.name}
          </h3>
          <div className="text-[var(--web-spruce)] text-[13px] font-light mb-3">
            {member.role}
          </div>
          
          {member.shortBio && (
            <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed mb-4 line-clamp-2">
              {member.shortBio}
            </Text>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-4 border-t border-[var(--web-serenity)]/20">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
              >
                <MailIcon className="h-4 w-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}
            <span className="ml-auto text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] flex items-center gap-1">
              View Profile
              <ArrowRightIcon className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
