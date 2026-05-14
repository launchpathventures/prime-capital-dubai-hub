/**
 * CATALYST - Tahir Hero Portrait
 *
 * Portrait sidecar for the hero. Uses next/image against the existing
 * /images/team/tahir-majithia.jpg (1200x1600, 3:4) with a soft warm
 * frame and the brand's asymmetric corner radius.
 */

import Image from "next/image"

interface TahirHeroPortraitProps {
  src?: string
  alt?: string
  caption?: string
  priority?: boolean
}

export function TahirHeroPortrait({
  src = "/images/team/tahir-majithia.jpg",
  alt = "Tahir Majithia",
  caption,
  priority = true,
}: TahirHeroPortraitProps) {
  return (
    <figure className="tahir-hero-portrait">
      <div className="tahir-hero-portrait__frame">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 960px) 480px, 100vw"
          priority={priority}
          className="tahir-hero-portrait__img"
        />
      </div>
      {caption ? (
        <figcaption className="tahir-hero-portrait__caption">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
