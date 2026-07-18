// Shared types for the saved "Writing report" that a student can store in the notebook.
//
// A report captures one completed guided Task 1 essay: the original chart/infographic,
// plus the assembled essay with every answered blank highlighted (and whether the
// student got it right on the first check).

import type { WritingTask1PracticePrompt } from './writingGuideData'
import type { WgbStep } from './writingGuidedBuilder'
import type {
  WritingTask2Role,
  WritingTask2Track,
  WritingTask2VocabItem
} from './writingTask2Data'

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

// A completed guided Task 2 essay: the full assembled model essay text (no chart, since
// Task 2 has none) plus the vocab the student can bookmark from it.
export type WritingTask2ReportParagraph = {
  role: WritingTask2Role
  labelTh: string
  text: string
}

export type WritingTask2EssaySavePayload = {
  promptId: string
  track: WritingTask2Track
  typeTitle: string
  questionTitle: string
  questionNumber: number
  meta: string
  paragraphs: WritingTask2ReportParagraph[]
  vocab: WritingTask2VocabItem[]
  score: { correct: number; total: number }
}

export type WritingTask2ReportSnapshot = WritingTask2EssaySavePayload & {
  kind: 'writing-task2'
  savedAt: string
}
