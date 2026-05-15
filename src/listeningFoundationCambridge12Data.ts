import { CAMBRIDGE_12_SECTION_2_EXAM_SET } from './listeningBuilderCambridge12Section2'
import { CAMBRIDGE_12_SECTION_4_EXAM_SET } from './listeningBuilderCambridge12Section4'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'

/** Official / verified answers for fill-in and map items where MC letters are not in the prompt. */
const CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES: Record<string, string> = {
  'cam12-s2-t1-q11': 'A',
  'cam12-s2-t1-q12': 'A',
  'cam12-s2-t1-q13': 'C',
  'cam12-s2-t1-q14': 'C',
  'cam12-s2-t1-q15': 'A',
  'cam12-s2-t1-q16': 'E',
  'cam12-s2-t1-q17': 'F',
  'cam12-s2-t1-q18': 'C',
  'cam12-s2-t1-q19': 'D',
  'cam12-s2-t1-q20': 'B',
  'cam12-s2-t2-q11': 'B',
  'cam12-s2-t2-q12': 'C',
  'cam12-s2-t2-q13': 'A',
  'cam12-s2-t2-q14': 'B',
  'cam12-s2-t2-q15': 'C',
  'cam12-s2-t2-q16': 'F',
  'cam12-s2-t2-q17': 'B',
  'cam12-s2-t2-q18': 'E',
  'cam12-s2-t2-q19': 'G',
  'cam12-s2-t2-q20': 'C',
  'cam12-s2-t3-q11': 'D',
  'cam12-s2-t3-q12': 'E',
  'cam12-s2-t3-q13': 'C',
  'cam12-s2-t3-q14': 'A',
  'cam12-s2-t3-q15': 'C',
  'cam12-s2-t3-q16': 'B',
  'cam12-s2-t3-q17': 'A',
  'cam12-s2-t3-q18': 'stress',
  'cam12-s2-t3-q19': 'weight',
  'cam12-s2-t3-q20': 'families',
  'cam12-s2-t4-q11': 'A',
  'cam12-s2-t4-q12': 'C',
  'cam12-s2-t4-q13': 'B',
  'cam12-s2-t4-q14': 'B',
  'cam12-s2-t4-q15': 'G',
  'cam12-s2-t4-q16': 'C',
  'cam12-s2-t4-q17': 'D',
  'cam12-s2-t4-q18': 'B',
  'cam12-s2-t4-q19': 'A',
  'cam12-s2-t4-q20': 'F'
}

/** Section 2 = Essential bank (Tests 1–4). Section 4 lectures stay in Advanced. */
export const CAMBRIDGE_12_LISTENING_FOUNDATION_SETS = [
  ...builderExamSetToFoundationSets(CAMBRIDGE_12_SECTION_2_EXAM_SET, 'essential', CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES),
  ...builderExamSetToFoundationSets(CAMBRIDGE_12_SECTION_4_EXAM_SET, 'advanced', CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES)
]
