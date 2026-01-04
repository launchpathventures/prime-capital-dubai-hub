/**
 * CATALYST - Core Components Index
 *
 * Catalyst's foundational building blocks for layout, typography, and visual elements.
 * These components form the base layer that everything else composes from.
 */

// Base — the foundation everything extends
export { Box, type BoxProps } from "./_base"
export type { PolymorphicProps, InlineProps, LayoutProps } from "./_base"
export {
  gapVariants,
  alignVariants,
  justifyVariants,
  wrapVariants,
  textAlignVariants,
  colorVariants,
} from "./_base"

// Layout
export { Stack, stackVariants, type StackProps } from "./stack"
export { Row, rowVariants, type RowProps } from "./row"
export { Grid, gridVariants, type GridProps } from "./grid"
export { Container, containerVariants, type ContainerProps } from "./container"
export { Section, sectionVariants, type SectionProps } from "./section"
export { Center, type CenterProps } from "./center"
export { Spacer, spacerVariants, type SpacerProps } from "./spacer"

// Typography
export { Text, textVariants, type TextProps } from "./text"
export { Title, titleVariants, type TitleProps } from "./title"
export { List, listVariants, type ListProps } from "./list"
export { Prose, proseVariants, type ProseProps } from "./prose"

// Visual
export { Dot, dotVariants, type DotProps } from "./dot"
export {
  Avatar,
  avatarVariants,
  avatarGradients,
  getAvatarGradient,
  getInitials,
  type AvatarProps,
  type AvatarGradient,
} from "./avatar"
export { Count, type CountProps } from "./count"
