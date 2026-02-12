/**
 * CATALYST - Team Card Component
 *
 * Team member card with social links.
 * Uses a full-card Link overlay for navigation with no client router logic.
 */

import Link from "next/link"
import Image from "next/image"
import { Text } from "@/components/core"
import { ArrowRightIcon, LinkedinIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react"

interface TeamMember {
  id: string
  slug: string
  name: string
  role: string
  photo?: string | null
  shortBio?: string | null
  email?: string | null
  phone?: string | null
  linkedin?: string | null
  isFounder?: boolean
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group block">
      <div className="card-lift relative bg-white rounded-[2px] overflow-hidden shadow-sm">
        <Link
          href={`/team/${member.slug}`}
          className="absolute inset-0 z-[1]"
          aria-label={`View profile for ${member.name}`}
        />

        {/* Image - square aspect ratio for compact cards */}
        <div className="relative aspect-square overflow-hidden bg-[var(--web-serenity)]/20">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="img-zoom object-cover object-top"
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
          <div className="text-[var(--web-spruce)] text-[14px] font-light mb-3">
            {member.role}
          </div>
          
          {member.shortBio && (
            <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed mb-4 line-clamp-2">
              {member.shortBio}
            </Text>
          )}

          {/* Social Links */}
          <div className="relative z-[2] flex items-center gap-2 pt-4 border-t border-[var(--web-serenity)]/20">
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/\s/g, "")}`}
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
                aria-label={`Call ${member.name}`}
              >
                <PhoneIcon className="h-4 w-4" />
              </a>
            )}
            {member.phone && (
              <a
                href={`https://wa.me/${member.phone.replace(/[\s+\-()]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
                aria-label={`WhatsApp ${member.name}`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
                aria-label={`Email ${member.name}`}
              >
                <MailIcon className="h-4 w-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
                aria-label={`${member.name} on LinkedIn`}
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
    </article>
  )
}
