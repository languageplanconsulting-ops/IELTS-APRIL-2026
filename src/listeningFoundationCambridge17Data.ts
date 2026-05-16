import { CAMBRIDGE_17_SECTION_2_EXAM_SET } from './listeningBuilderCambridge17Section2'
import { CAMBRIDGE_17_SECTION_4_EXAM_SET } from './listeningBuilderCambridge17Section4'
import { CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES } from './listeningBuilderAnswerOverrides'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'

export { CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES }

/** Section 2 = Essential (Tests 1–4). Section 4 lectures = Advanced. */
export const CAMBRIDGE_17_LISTENING_FOUNDATION_SETS = [
  ...builderExamSetToFoundationSets(
    CAMBRIDGE_17_SECTION_2_EXAM_SET,
    'essential',
    CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES
  ),
  ...builderExamSetToFoundationSets(
    CAMBRIDGE_17_SECTION_4_EXAM_SET,
    'advanced',
    CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES
  )
]
