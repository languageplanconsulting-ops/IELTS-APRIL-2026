import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5 } from './intensiveJourneyFillBlankStages1to5.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_6 } from './intensiveJourneyFillBlankStage6.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_7_9 } from './intensiveJourneyFillBlankStages7to9.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_10 } from './intensiveJourneyFillBlankStage10.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_11_15 } from './intensiveJourneyFillBlankStages11to15.ts'

/** Hand-crafted fill-blank UI for Quest Log ด่าน 1–15 (intensive journey passages). */
export const INTENSIVE_JOURNEY_FILL_BLANK_SETS: NewFillBlankSet[] = [
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_6,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_7_9,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_10,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_11_15
]
