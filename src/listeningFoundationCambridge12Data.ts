import { CAMBRIDGE_12_SECTION_2_EXAM_SET } from './listeningBuilderCambridge12Section2'
import { CAMBRIDGE_12_SECTION_4_EXAM_SET } from './listeningBuilderCambridge12Section4'
import { CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES } from './listeningBuilderAnswerOverrides'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'

export { CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES }

/** Section 2 = Essential bank (Tests 1–4). Section 4 lectures stay in Advanced. */
export const CAMBRIDGE_12_LISTENING_FOUNDATION_SETS = [
  ...builderExamSetToFoundationSets(CAMBRIDGE_12_SECTION_2_EXAM_SET, 'essential', CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES),
  ...builderExamSetToFoundationSets(CAMBRIDGE_12_SECTION_4_EXAM_SET, 'advanced', CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES)
]
