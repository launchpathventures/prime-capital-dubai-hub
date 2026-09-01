/**
 * CATALYST - Prime Capital Remotion Compositions
 */

import { Composition } from "remotion"
import { InvestorDecisionFrameworkVideo } from "./investor-decision-framework/composition"
import {
  FRAMEWORK_VIDEO_FPS,
  FRAMEWORK_VIDEO_HEIGHT,
  FRAMEWORK_VIDEO_TOTAL_FRAMES,
  FRAMEWORK_VIDEO_WIDTH,
} from "./investor-decision-framework/script"

export function RemotionRoot() {
  return (
    <Composition
      id="InvestorDecisionFramework"
      component={InvestorDecisionFrameworkVideo}
      durationInFrames={FRAMEWORK_VIDEO_TOTAL_FRAMES}
      fps={FRAMEWORK_VIDEO_FPS}
      width={FRAMEWORK_VIDEO_WIDTH}
      height={FRAMEWORK_VIDEO_HEIGHT}
    />
  )
}
