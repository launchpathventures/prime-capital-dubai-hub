/**
 * CATALYST - Hub Configuration
 *
 * Configuration for the client engagement hub.
 * Built as a reusable pattern for future Launch Path Ventures projects.
 */

export interface HubConfig {
  /** Client name for display */
  clientName: string
  /** Feature toggles */
  features: {
    /** Enable voice recording for question responses */
    voiceRecording: boolean
    /** Enable task assignment to users */
    taskAssignment: boolean
    /** Show activity feed on dashboard */
    activityFeed: boolean
  }
  /** Customizable labels for hub sections */
  labels: {
    projects: string
    tasks: string
    questions: string
  }
}

/** Default hub configuration */
export const defaultHubConfig: HubConfig = {
  clientName: "Client",
  features: {
    voiceRecording: true,
    taskAssignment: true,
    activityFeed: true,
  },
  labels: {
    projects: "Projects",
    tasks: "Tasks",
    questions: "Questions",
  },
}

/** 
 * Hub configuration for Prime Capital deployment.
 * Override defaults as needed per client.
 */
export const hubConfig: HubConfig = {
  ...defaultHubConfig,
  clientName: "Prime Capital",
}
