import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5 } from './intensiveJourneyFillBlankStages1to5.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17 } from './intensiveJourneyFillBlankStages6to17.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_18_20 } from './intensiveJourneyFillBlankStages18to20.ts'

/** Hand-crafted fill-blank UI for Quest Log ด่าน 1–20 (intensive + merged pool stages). */
export const INTENSIVE_JOURNEY_FILL_BLANK_SETS: NewFillBlankSet[] = [
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_18_20
]
