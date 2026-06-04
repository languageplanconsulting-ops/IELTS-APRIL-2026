export type IntensiveQuestionSolution = {
  passageKeyword: string
  questionKeyword: string
  thaiMeaning: string
}

/** Local question numbers before journey remap. Stages 1–10: P1 1–14, P2 1–13. */
import { INTENSIVE_SOLUTIONS_STAGE_1_5 } from './intensiveJourneyQuestionSolutions1to5.ts'
import { INTENSIVE_SOLUTIONS_STAGE_6 } from './intensiveJourneyQuestionSolutions6.ts'
import { INTENSIVE_SOLUTIONS_STAGE_7_9 } from './intensiveJourneyQuestionSolutions7to9.ts'
import { INTENSIVE_SOLUTIONS_STAGE_10 } from './intensiveJourneyQuestionSolutions10.ts'
import { INTENSIVE_SOLUTIONS_STAGE_11 } from './intensiveJourneyQuestionSolutions11.ts'
import { INTENSIVE_SOLUTIONS_STAGE_12 } from './intensiveJourneyQuestionSolutions12.ts'
import { INTENSIVE_SOLUTIONS_STAGE_13 } from './intensiveJourneyQuestionSolutions13.ts'
import { INTENSIVE_SOLUTIONS_STAGE_14 } from './intensiveJourneyQuestionSolutions14.ts'
import { INTENSIVE_SOLUTIONS_STAGE_15 } from './intensiveJourneyQuestionSolutions15.ts'

const mergeStageSolutions = (
  base: Record<number, Record<1 | 2, Record<number, IntensiveQuestionSolution>>>,
  extra: Record<number, Record<1 | 2, Record<number, IntensiveQuestionSolution>>>
) => {
  const merged = { ...base }
  for (const [stageKey, slots] of Object.entries(extra)) {
    const stage = Number(stageKey)
    merged[stage] = {
      ...(merged[stage] || {}),
      1: { ...(merged[stage]?.[1] || {}), ...(slots[1] || {}) },
      2: { ...(merged[stage]?.[2] || {}), ...(slots[2] || {}) }
    }
  }
  return merged
}

export const INTENSIVE_SOLUTIONS_BY_STAGE = mergeStageSolutions(
  mergeStageSolutions(
    mergeStageSolutions(
      mergeStageSolutions(
        mergeStageSolutions(INTENSIVE_SOLUTIONS_STAGE_1_5, INTENSIVE_SOLUTIONS_STAGE_6),
        INTENSIVE_SOLUTIONS_STAGE_7_9
      ),
      INTENSIVE_SOLUTIONS_STAGE_10
    ),
    INTENSIVE_SOLUTIONS_STAGE_11
  ),
  mergeStageSolutions(
    mergeStageSolutions(INTENSIVE_SOLUTIONS_STAGE_12, INTENSIVE_SOLUTIONS_STAGE_13),
    mergeStageSolutions(INTENSIVE_SOLUTIONS_STAGE_14, INTENSIVE_SOLUTIONS_STAGE_15)
  )
)

export const applyIntensiveQuestionSolutions = (
  passage: { questions: Array<{ number: number; paraphrasedVocabulary: string; explanationThai: string }> },
  solutions: Record<number, IntensiveQuestionSolution> | undefined
) => {
  if (!solutions) return
  for (const question of passage.questions) {
    const solution = solutions[question.number]
    if (!solution) continue
    question.paraphrasedVocabulary = `${solution.passageKeyword} = ${solution.questionKeyword}`
    question.explanationThai = `${solution.passageKeyword} = ${solution.questionKeyword} = ${solution.thaiMeaning}`
  }
}
