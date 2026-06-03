/**
 * Hand-authored Normal Reading Journey passages (legacy format fallback).
 * Stages 1–10 use journeyIntensivePassages1to5.ts … journeyIntensivePassages10.ts.
 */

export type IntensivePassageInput = {
  title: string
  paragraphs: Array<[string, string]>
  fill: Array<{ prompt: string; answer: string; evidence: string; acceptedAnswers?: string[] }>
  judgement: Array<{ prompt: string; answer: 'TRUE' | 'FALSE' | 'NOT GIVEN'; evidence: string }>
  headings: {
    options: string[]
    questions: Array<{ prompt: string; answer: string; evidence: string }>
  }
}

/** Legacy hand-authored passages — none remain for stages 1–10. */
export const INTENSIVE_PASSAGES_BY_STAGE: Record<number, [IntensivePassageInput, IntensivePassageInput]> = {}
