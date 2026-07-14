// Shared types for the saved "Writing report" that a student can store in the notebook.
//
// A report captures one completed guided Task 1 essay: the original chart/infographic,
// plus the assembled essay with every answered blank highlighted (and whether the
// student got it right on the first check).

import type { WritingTask1PracticePrompt } from './writingGuideData'
import type { WgbStep } from './writingGuidedBuilder'

export type WritingReportSegment =
  | { kind: 'text'; text: string }
  | {
      kind: 'blank'
      // The correct answer that now sits in the essay.
      text: string
      // What the student typed / selected (may differ if they revealed the answer).
      given: string
      correct: boolean
      focus: string
    }

export type WritingReportParagraph = {
  role: WgbStep['role']
  labelTh: string
  segments: WritingReportSegment[]
  // Blank-free plain sentence, handy for copy / accessibility.
  plainText: string
}

export type WritingEssaySavePayload = {
  promptId: string
  categoryTitle: string
  questionTitle: string
  questionNumber: number
  prompt: WritingTask1PracticePrompt
  paragraphs: WritingReportParagraph[]
  score: { correct: number; total: number }
}

export type WritingReportSnapshot = WritingEssaySavePayload & {
  kind: 'writing'
  savedAt: string
}
