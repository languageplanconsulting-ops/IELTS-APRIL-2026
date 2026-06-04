import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5 } from './intensiveJourneyFillBlankStages1to5.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_6 } from './intensiveJourneyFillBlankStage6.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_7_9 } from './intensiveJourneyFillBlankStages7to9.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_10 } from './intensiveJourneyFillBlankStage10.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_11 } from './intensiveJourneyFillBlankStage11.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_12 } from './intensiveJourneyFillBlankStage12.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_13 } from './intensiveJourneyFillBlankStage13.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_14 } from './intensiveJourneyFillBlankStage14.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGE_15 } from './intensiveJourneyFillBlankStage15.ts'

/** Hand-crafted fill-blank UI for Quest Log ด่าน 1–15 (intensive journey passages). */
export const INTENSIVE_JOURNEY_FILL_BLANK_SETS: NewFillBlankSet[] = [
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_6,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_7_9,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_10,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_11,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_12,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_13,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_14,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGE_15
]
