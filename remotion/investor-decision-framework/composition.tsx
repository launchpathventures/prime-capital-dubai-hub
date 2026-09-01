/**
 * CATALYST - Investor Decision Framework Remotion Composition
 */

import type { CSSProperties, ReactNode } from "react"
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import {
  FRAMEWORK_VIDEO_SCENES,
  type FrameworkVideoScene,
} from "./script"

const COLORS = {
  ash: "#3f4142",
  spruce: "#576c75",
  serenity: "#a6b5b0",
  paper: "#f2efea",
  white: "#ffffff",
}

const headlineFont = 'Georgia, "Times New Roman", serif'
const bodyFont = 'Arial, "Helvetica Neue", sans-serif'

const absoluteCenter: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

function fadeForScene(frame: number, durationInFrames: number) {
  return interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
}

function rise(frame: number, fps: number, delay = 0, distance = 34) {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, mass: 0.75, stiffness: 105 },
  })

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  }
}

function GridTexture({ opacity = 0.14 }: { opacity?: number }) {
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage:
          "linear-gradient(rgba(242,239,234,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,234,0.13) 1px, transparent 1px)",
        backgroundSize: "84px 84px",
      }}
    />
  )
}

function BrandChrome({ activeCheck }: { activeCheck?: number }) {
  return (
    <>
      <Img
        src={staticFile("logo-light.svg")}
        style={{
          position: "absolute",
          top: 54,
          left: 72,
          width: 210,
          height: 77,
          objectFit: "contain",
          objectPosition: "left center",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 68,
          right: 72,
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: "rgba(242,239,234,0.62)",
          fontFamily: bodyFont,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <span>Investor Decision Framework</span>
        <span style={{ width: 42, height: 1, background: COLORS.serenity }} />
        <span>90 sec</span>
      </div>
      {typeof activeCheck === "number" ? (
        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 72,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              style={{
                width: index === activeCheck ? 46 : 12,
                height: 4,
                background:
                  index <= activeCheck
                    ? COLORS.serenity
                    : "rgba(242,239,234,0.2)",
              }}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

function CaptionBar({
  captions,
  durationInFrames,
}: {
  captions: readonly string[]
  durationInFrames: number
}) {
  const frame = useCurrentFrame()
  const usableFrame = Math.max(0, frame - 12)
  const usableDuration = Math.max(1, durationInFrames - 24)
  const index = Math.min(
    captions.length - 1,
    Math.floor((usableFrame / usableDuration) * captions.length)
  )

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 72,
        maxWidth: 1100,
        padding: "15px 20px 16px",
        color: COLORS.white,
        borderLeft: `3px solid ${COLORS.serenity}`,
        background: "rgba(24,25,25,0.78)",
        fontFamily: bodyFont,
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 1.35,
      }}
    >
      {captions[index]}
    </div>
  )
}

function SceneShell({
  scene,
  children,
  activeCheck,
}: {
  scene: FrameworkVideoScene
  children: ReactNode
  activeCheck?: number
}) {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: COLORS.paper,
        background: COLORS.ash,
        opacity: fadeForScene(frame, scene.durationInFrames),
      }}
    >
      <GridTexture />
      {children}
      <BrandChrome activeCheck={activeCheck} />
      <CaptionBar
        captions={scene.captions}
        durationInFrames={scene.durationInFrames}
      />
    </AbsoluteFill>
  )
}

function HeroScene({ scene }: { scene: FrameworkVideoScene }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const scale = interpolate(frame, [0, scene.durationInFrames], [1.04, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <SceneShell scene={scene}>
      <Img
        src={staticFile("images/hero/properties.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 44%",
          filter: "saturate(0.68) contrast(1.03)",
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(63,65,66,0.98) 0%, rgba(63,65,66,0.87) 48%, rgba(63,65,66,0.44) 100%), linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.54))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 72,
          width: 980,
        }}
      >
        <div
          style={{
            ...rise(frame, fps, 6, 22),
            color: COLORS.serenity,
            fontFamily: bodyFont,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.17em",
            textTransform: "uppercase",
          }}
        >
          {scene.eyebrow}
        </div>
        <div
          style={{
            ...rise(frame, fps, 15, 44),
            maxWidth: 940,
            marginTop: 28,
            fontFamily: headlineFont,
            fontSize: 98,
            fontWeight: 400,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            ...rise(frame, fps, 29, 24),
            display: "flex",
            gap: 42,
            marginTop: 54,
            paddingTop: 24,
            borderTop: "1px solid rgba(242,239,234,0.24)",
            color: "rgba(242,239,234,0.72)",
            fontFamily: bodyFont,
            fontSize: 19,
            letterSpacing: "0.04em",
          }}
        >
          {scene.detailLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

function CheckScene({ scene }: { scene: FrameworkVideoScene }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const activeCheck = scene.checkIndex ?? 0

  return (
    <SceneShell scene={scene} activeCheck={activeCheck}>
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 72,
          width: 760,
        }}
      >
        <div
          style={{
            ...rise(frame, fps, 4, 20),
            color: COLORS.serenity,
            fontFamily: bodyFont,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.17em",
            textTransform: "uppercase",
          }}
        >
          {scene.eyebrow}
        </div>
        <div
          style={{
            ...rise(frame, fps, 12, 42),
            marginTop: 28,
            fontFamily: headlineFont,
            fontSize: 83,
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 1.01,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            ...rise(frame, fps, 23, 20),
            width: 320,
            height: 1,
            marginTop: 44,
            background: COLORS.serenity,
          }}
        />
      </div>

      <div
        style={{
          ...rise(frame, fps, 17, 54),
          position: "absolute",
          top: 178,
          right: 72,
          width: 830,
          minHeight: 610,
          padding: "62px 64px 54px",
          color: COLORS.ash,
          background: COLORS.paper,
          boxShadow: "0 34px 90px rgba(0,0,0,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -48,
            right: 28,
            color: "rgba(166,181,176,0.25)",
            fontFamily: headlineFont,
            fontSize: 210,
            letterSpacing: "-0.08em",
            lineHeight: 1,
          }}
        >
          {String(activeCheck + 1).padStart(2, "0")}
        </div>
        <div
          style={{
            color: COLORS.spruce,
            fontFamily: bodyFont,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Establish before you move on
        </div>
        <div style={{ marginTop: 54 }}>
          {scene.detailLines.map((line, index) => (
            <div
              key={line}
              style={{
                ...rise(frame, fps, 28 + index * 9, 24),
                display: "grid",
                gridTemplateColumns: "54px 1fr",
                alignItems: "center",
                minHeight: 92,
                borderTop: `1px solid ${index === 0 ? COLORS.ash : "rgba(87,108,117,0.28)"}`,
                fontFamily: bodyFont,
                fontSize: 25,
                lineHeight: 1.25,
              }}
            >
              <span
                style={{
                  color: COLORS.serenity,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: 48,
            left: 64,
            paddingTop: 22,
            borderTop: `1px solid ${COLORS.serenity}`,
            color: COLORS.spruce,
            fontFamily: bodyFont,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Record · {scene.record}
        </div>
      </div>
    </SceneShell>
  )
}

function CloseScene({ scene }: { scene: FrameworkVideoScene }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <SceneShell scene={scene}>
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 72,
          width: 670,
        }}
      >
        <div
          style={{
            ...rise(frame, fps, 5, 20),
            color: COLORS.serenity,
            fontFamily: bodyFont,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.17em",
            textTransform: "uppercase",
          }}
        >
          {scene.eyebrow}
        </div>
        <div
          style={{
            ...rise(frame, fps, 14, 42),
            marginTop: 28,
            fontFamily: headlineFont,
            fontSize: 94,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
          }}
        >
          {scene.title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 196,
          right: 72,
          width: 920,
          borderTop: `1px solid ${COLORS.serenity}`,
        }}
      >
        {scene.detailLines.map((line, index) => (
          <div
            key={line}
            style={{
              ...rise(frame, fps, 23 + index * 12, 28),
              display: "grid",
              gridTemplateColumns: "82px 1fr",
              alignItems: "center",
              minHeight: 154,
              borderBottom: "1px solid rgba(166,181,176,0.36)",
              fontFamily: headlineFont,
              fontSize: 42,
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                color: COLORS.serenity,
                fontFamily: bodyFont,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{line}</span>
          </div>
        ))}
        <div
          style={{
            ...rise(frame, fps, 62, 18),
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 30,
            color: "rgba(242,239,234,0.68)",
            fontFamily: bodyFont,
            fontSize: 18,
            letterSpacing: "0.05em",
          }}
        >
          <span style={{ width: 54, height: 1, background: COLORS.serenity }} />
          Educational content only. Keep the answers in your own notes.
        </div>
      </div>
    </SceneShell>
  )
}

function Scene({ scene }: { scene: FrameworkVideoScene }) {
  if (scene.treatment === "hero") return <HeroScene scene={scene} />
  if (scene.treatment === "close") return <CloseScene scene={scene} />
  return <CheckScene scene={scene} />
}

export function InvestorDecisionFrameworkVideo() {
  return (
    <AbsoluteFill style={{ ...absoluteCenter, background: COLORS.ash }}>
      {FRAMEWORK_VIDEO_SCENES.map((scene, sceneIndex) => {
        const sceneFrom = FRAMEWORK_VIDEO_SCENES.slice(0, sceneIndex).reduce(
          (total, previousScene) => total + previousScene.durationInFrames,
          0
        )

        return (
          <Sequence
            key={scene.id}
            from={sceneFrom}
            durationInFrames={scene.durationInFrames}
            premountFor={30}
          >
            <Scene scene={scene} />
            <Sequence from={10}>
              <Html5Audio
                src={staticFile(
                  `videos/framework-walkthrough/audio/${scene.id}.mp3`
                )}
              />
            </Sequence>
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}
