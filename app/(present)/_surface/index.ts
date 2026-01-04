/**
 * CATALYST - Presentation Components
 *
 * Self-contained presentation mode components.
 * To remove presentation functionality: delete app/(present)/
 * 
 * CLASSES (defined in present.css):
 * - .layout-present — root layout container
 * - .layout-present__slides — slide container
 * - .present-slide — individual slide
 * - .present-slide__inner — scrollable inner wrapper
 * - .present-slide__content — main content (use with my-auto for centering)
 * - .present-slide__background — decorative backgrounds
 * - .present-nav-inline — inline navigation (dots)
 */

export { SlidesShell } from "./slides-shell"
export { PresentHeader } from "./header"
export { PresentNav, PresentNavList } from "./nav"
export { Slide, SlideContainer } from "./slide"
export { SlideDots } from "./dots"
export { ScrollHint } from "./scroll-hint"

// Hook for slide navigation (URL hash, keyboard, scroll tracking)
export { usePresentationSlides } from "./use-presentation-slides"
