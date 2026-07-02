export type ActivityType =
  | 'lesson-card'
  | 'sign-to-picture'
  | 'drag-drop-match'
  | 'spelling'

export interface SignItem {
  id: string
  /** Primary display label (e.g. "A", "Hello") */
  label: string
  /** Filipino label if different from label */
  labelFil?: string
  /** Path relative to /public, e.g. "/videos/alphabet/a.mp4" */
  videoPath: string
  /** Optional image path relative to /public */
  imagePath?: string
  /**
   * All accepted correct answers for spelling activity.
   * Include English, Filipino, and common variants.
   * Matching is case-insensitive and trims whitespace.
   */
  acceptedAnswers: string[]
}

export interface SubModule {
  id: string
  moduleId: string
  /** Display title, e.g. "A to G" */
  title: string
  /** Short label for nav, e.g. "A–G" */
  shortTitle: string
  items: SignItem[]
  /**
   * Order of activity types in Activity Mode.
   * Quiz Mode uses the same types minus 'lesson-card'.
   */
  activitySequence: ActivityType[]
}

export interface Module {
  id: string
  order: number
  title: string
  description: string
  /** Emoji or icon name for the module card */
  icon: string
  subModules: SubModule[]
}
