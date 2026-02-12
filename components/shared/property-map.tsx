/**
 * CATALYST - Property location map
 *
 * Static Mapbox thumbnail in sidebar → click to open full interactive
 * Mapbox GL JS map in a modal showing the property area in context of Dubai.
 * Style: light-v11 (clean, muted, luxury-friendly).
 */

"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { MaximizeIcon } from "lucide-react"

/* ─── Location coordinates for Dubai areas ────────────────────────── */
const DUBAI_COORDINATES: Record<string, [number, number]> = {
  "palm jumeirah": [25.1124, 55.1390],
  "downtown dubai": [25.1972, 55.2744],
  "dubai hills estate": [25.1275, 55.2453],
  "dubai hills": [25.1275, 55.2453],
  "dubai marina": [25.0805, 55.1403],
  "business bay": [25.1851, 55.2717],
  "jumeirah beach residence": [25.0762, 55.1332],
  "jbr": [25.0762, 55.1332],
  "dubai creek harbour": [25.1938, 55.3425],
  "emaar beachfront": [25.0781, 55.1339],
  "city walk": [25.2074, 55.2623],
  "dubai islands": [25.2850, 55.3340],
  "deira islands": [25.2850, 55.3340],
  "jumeirah village circle": [25.0657, 55.2094],
  "jvc": [25.0657, 55.2094],
  "arabian ranches": [25.0601, 55.2437],
  "al barari": [25.0785, 55.2735],
  "dubai south": [24.8960, 55.1713],
  "sobha hartland": [25.1785, 55.3110],
  "mohammed bin rashid city": [25.1600, 55.3100],
  "mbr city": [25.1600, 55.3100],
  "dubai land": [25.0654, 55.2839],
  "meydan": [25.1665, 55.3041],
  "al sufouh": [25.1041, 55.1634],
  "umm suqeim": [25.1285, 55.2003],
  "dubai": [25.2048, 55.2708],
}

const DEFAULT_COORDS: [number, number] = [25.2048, 55.2708]

function getCoordinates(location: string): [number, number] {
  const normalised = location.toLowerCase().replace(/, dubai$/i, "").replace(/, uae$/i, "").trim()

  if (DUBAI_COORDINATES[normalised]) return DUBAI_COORDINATES[normalised]

  for (const [key, coords] of Object.entries(DUBAI_COORDINATES)) {
    if (normalised.includes(key) || key.includes(normalised)) return coords
  }

  return DEFAULT_COORDS
}

/* ─── Constants ───────────────────────────────────────────────────── */
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const MAPBOX_STYLE = "light-v11"
const THUMB_ZOOM = 11
const MODAL_ZOOM = 11
const THUMB_W = 600
const THUMB_H = 340

/* ─── Interactive Map (loaded inside modal) ───────────────────────── */
function InteractiveMap({ location }: { location: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [lat, lng] = getCoordinates(location)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamic import — mapbox-gl is heavy, only load when modal opens
    import("mapbox-gl").then((mapboxgl) => {
      if (!containerRef.current || !MAPBOX_TOKEN) return

      // Inject Mapbox CSS if not already present
      if (!document.querySelector('link[href*="mapbox-gl"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css"
        document.head.appendChild(link)
      }

      const map = new mapboxgl.default.Map({
        container: containerRef.current,
        style: `mapbox://styles/mapbox/${MAPBOX_STYLE}`,
        center: [lng, lat],
        zoom: MODAL_ZOOM,
        accessToken: MAPBOX_TOKEN,
        attributionControl: false,
        logoPosition: "bottom-left",
      })

      // Add navigation controls
      map.addControl(new mapboxgl.default.NavigationControl({ showCompass: false }), "bottom-right")

      // Minimal attribution
      map.addControl(new mapboxgl.default.AttributionControl({ compact: true }), "bottom-left")

      // Add a subtle area highlight — pulsing circle to indicate approximate area
      map.on("load", () => {
        // Area label
        const el = document.createElement("div")
        el.className = "property-map-area-label"
        el.innerHTML = `<span>${location}</span>`
        new mapboxgl.default.Marker({ element: el, anchor: "center" })
          .setLngLat([lng, lat])
          .addTo(map)
      })

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [location, lat, lng])

  return (
    <>
      <style>{`
        .property-map-area-label {
          pointer-events: none;
        }
        .property-map-area-label span {
          display: block;
          background: rgba(87, 108, 117, 0.9);
          color: #F2EFEA;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 2px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .mapboxgl-ctrl-attrib {
          font-size: 9px !important;
          background: rgba(242, 239, 234, 0.8) !important;
          border-radius: 2px !important;
        }
        .mapboxgl-ctrl-group {
          border-radius: 2px !important;
          box-shadow: 0 1px 6px rgba(0,0,0,0.1) !important;
          border: none !important;
        }
        .mapboxgl-ctrl-group button {
          border: none !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", minHeight: 400, borderRadius: 2 }}
      />
    </>
  )
}

/* ─── Main Component ──────────────────────────────────────────────── */
interface PropertyMapProps {
  location: string
  className?: string
}

export function PropertyMap({ location, className }: PropertyMapProps) {
  const [open, setOpen] = useState(false)
  const [lat, lng] = getCoordinates(location)

  const staticSrc = `https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/static/${lng},${lat},${THUMB_ZOOM},0/${THUMB_W}x${THUMB_H}@2x?access_token=${MAPBOX_TOKEN}&logo=false&attribution=false`

  const handleOpen = useCallback(() => setOpen(true), [])

  return (
    <>
      {/* Static thumbnail — click to expand */}
      <button
        type="button"
        onClick={handleOpen}
        className={`group ${className || ""}`}
        style={{ position: "relative", width: "100%", aspectRatio: `${THUMB_W}/${THUMB_H}`, borderRadius: 2, overflow: "hidden", cursor: "pointer", border: "none", padding: 0, display: "block" }}
        aria-label={`View interactive map of ${location}`}
      >
        <Image
          src={staticSrc}
          alt={`Map of ${location}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 400px"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-[2px] px-3 py-2 flex items-center gap-2 text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] font-medium shadow-sm">
            <MaximizeIcon className="h-3.5 w-3.5" />
            Explore Area
          </div>
        </div>
      </button>

      {/* Interactive map modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="!max-w-4xl !w-[calc(100%-2rem)] !h-[70vh] !p-0 !gap-0 overflow-hidden"
          showCloseButton
        >
          <DialogTitle className="sr-only">Map — {location}</DialogTitle>
          <div className="w-full h-full">
            {open && <InteractiveMap location={location} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
