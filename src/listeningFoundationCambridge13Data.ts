import { CAMBRIDGE_13_SECTION_2_EXAM_SET } from './listeningBuilderCambridge13Section2'
import { CAMBRIDGE_13_SECTION_4_EXAM_SET } from './listeningBuilderCambridge13Section4'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'

/** Official Cambridge IELTS 13 Academic Listening answers (Sections 2 & 4). */
const CAMBRIDGE_13_FOUNDATION_ANSWER_OVERRIDES: Record<string, string> = {
  // Test 1 Section 2 — Traffic Changes in Granford
  'cam13-s2-t1-q11': 'B',
  'cam13-s2-t1-q12': 'C',
  'cam13-s2-t1-q13': 'B',
  'cam13-s2-t1-q14': 'E',
  'cam13-s2-t1-q15': 'D',
  'cam13-s2-t1-q16': 'B',
  'cam13-s2-t1-q17': 'G',
  'cam13-s2-t1-q18': 'C',
  'cam13-s2-t1-q19': 'H',
  'cam13-s2-t1-q20': 'I',
  // Test 2 Section 2 — Company volunteering
  'cam13-s2-t2-q11': 'C',
  'cam13-s2-t2-q12': 'B',
  'cam13-s2-t2-q13': 'C',
  'cam13-s2-t2-q14': 'B',
  'cam13-s2-t2-q15': 'B',
  'cam13-s2-t2-q16': 'A',
  'cam13-s2-t2-q17': 'C',
  'cam13-s2-t2-q18': 'E',
  'cam13-s2-t2-q19': 'B',
  'cam13-s2-t2-q20': 'D',
  // Test 3 Section 2 — Physical activities
  'cam13-s2-t3-q11': 'F',
  'cam13-s2-t3-q12': 'D',
  'cam13-s2-t3-q13': 'A',
  'cam13-s2-t3-q14': 'B',
  'cam13-s2-t3-q15': 'C',
  'cam13-s2-t3-q16': 'G',
  'cam13-s2-t3-q17': 'B',
  'cam13-s2-t3-q18': 'C',
  'cam13-s2-t3-q19': 'B',
  'cam13-s2-t3-q20': 'D',
  // Test 4 Section 2 — The Snow Centre
  'cam13-s2-t4-q11': 'A',
  'cam13-s2-t4-q12': 'B',
  'cam13-s2-t4-q13': 'A',
  'cam13-s2-t4-q14': 'C',
  'cam13-s2-t4-q15': 'A',
  'cam13-s2-t4-q16': 'B',
  'cam13-s2-t4-q17': 'B',
  'cam13-s2-t4-q18': 'D',
  'cam13-s2-t4-q19': 'A',
  'cam13-s2-t4-q20': 'E',
  // Test 1 Section 4 — Urban animals
  'cam13-s4-t1-q31': 'crow',
  'cam13-s4-t1-q32': 'cliffs',
  'cam13-s4-t1-q33': 'speed',
  'cam13-s4-t1-q34': 'brains',
  'cam13-s4-t1-q35': 'food',
  'cam13-s4-t1-q36': 'behaviour',
  'cam13-s4-t1-q37': 'new',
  'cam13-s4-t1-q38': 'stress',
  'cam13-s4-t1-q39': 'tails',
  'cam13-s4-t1-q40': 'permanent',
  // Test 2 Section 4 — Episodic memory
  'cam13-s4-t2-q31': 'location',
  'cam13-s4-t2-q32': 'world',
  'cam13-s4-t2-q33': 'personal',
  'cam13-s4-t2-q34': 'attention',
  'cam13-s4-t2-q35': 'name',
  'cam13-s4-t2-q36': 'network',
  'cam13-s4-t2-q37': 'frequency',
  'cam13-s4-t2-q38': 'colour',
  'cam13-s4-t2-q39': 'brain',
  'cam13-s4-t2-q40': 'self',
  // Test 3 Section 4 — Sleepy lizard
  'cam13-s4-t3-q31': 'tongue',
  'cam13-s4-t3-q32': 'plants',
  'cam13-s4-t3-q33': 'snakes',
  'cam13-s4-t3-q34': 'sky',
  'cam13-s4-t3-q35': 'partner',
  'cam13-s4-t3-q36': 'contact',
  'cam13-s4-t3-q37': 'protection',
  'cam13-s4-t3-q38': 'tail',
  'cam13-s4-t3-q39': 'steps',
  'cam13-s4-t3-q40': 'injury',
  // Test 4 Section 4 — History of coffee
  'cam13-s4-t4-q31': 'destruction',
  'cam13-s4-t4-q32': 'universities',
  'cam13-s4-t4-q33': 'political',
  'cam13-s4-t4-q34': 'port',
  'cam13-s4-t4-q35': 'slaves',
  'cam13-s4-t4-q36': 'taxation',
  'cam13-s4-t4-q37': 'sugar',
  'cam13-s4-t4-q38': 'tea',
  'cam13-s4-t4-q39': 'transportation',
  'cam13-s4-t4-q40': 'night'
}

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
