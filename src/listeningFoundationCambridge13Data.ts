import { CAMBRIDGE_13_SECTION_2_EXAM_SET } from './listeningBuilderCambridge13Section2'
import { CAMBRIDGE_13_SECTION_4_EXAM_SET } from './listeningBuilderCambridge13Section4'
import { CAMBRIDGE_13_FOUNDATION_ANSWER_OVERRIDES } from './listeningBuilderAnswerOverrides'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'

export { CAMBRIDGE_13_FOUNDATION_ANSWER_OVERRIDES }

/** Section 2 = Essential (Tests 1–4). Section 4 lectures = Advanced. */
export const CAMBRIDGE_13_LISTENING_FOUNDATION_SETS = [
  ...builderExamSetToFoundationSets(
    CAMBRIDGE_13_SECTION_2_EXAM_SET,
    'essential',
    CAMBRIDGE_13_FOUNDATION_ANSWER_OVERRIDES
  ),
  ...builderExamSetToFoundationSets(
    CAMBRIDGE_13_SECTION_4_EXAM_SET,
    'advanced',
    CAMBRIDGE_13_FOUNDATION_ANSWER_OVERRIDES
  )
]
