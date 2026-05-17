import { CAMBRIDGE_10_SECTION_2_EXAM_SET } from './listeningBuilderCambridge10Section2'
import { CAMBRIDGE_10_SECTION_4_EXAM_SET } from './listeningBuilderCambridge10Section4'
import type { ListeningFoundationSet } from './listeningFoundationData'
import type { ListeningBuilderExamSet } from './listeningBuilderCambridge18Section2'
import {
  CAM10_TEST1_SECTION3_SCRIPT,
  CAM10_TEST4_SECTION3_SCRIPT,
  CAM20_TEST1_SECTION2_POTTERY_SCRIPT
} from './listeningFoundationSectionScripts'

const joinScript = (paragraphs: string[]) => paragraphs.map((p) => p.trim()).filter(Boolean).join('\n\n')

const scriptFromBuilderTest = (examSet: ListeningBuilderExamSet, testNumber: number) => {
  const test = examSet.tests.find((item) => item.testNumber === testNumber)
  return test ? joinScript(test.scriptParagraphs) : ''
}

/** Minimum expected audioscript length by section (full IELTS sections are usually 1500+ chars). */
export const LISTENING_SECTION_MIN_SCRIPT_CHARS: Record<number, number> = {
  2: 1280,
  3: 1200,
  4: 1400
}

/** Condensed practice drills (not full Cambridge transcripts) — joined excerpt paragraphs only. */
/** Condensed drills without a full Cambridge section transcript in the repo. */
export const LISTENING_EXCERPT_DRILL_FOUNDATION_IDS = new Set([
  'foundation-advanced-cam20-test1-section3-loneliness-drill',
  'foundation-advanced-cam20-test1-section4-urban-rivers-drill',
  'foundation-essential-cam20-test2-section2-volunteering-drill',
  'foundation-advanced-cam20-test2-section3-human-geography-drill',
  'foundation-advanced-cam20-test2-section4-food-trends-drill'
])

const minCharsForSet = (set: ListeningFoundationSet) => {
  if (LISTENING_EXCERPT_DRILL_FOUNDATION_IDS.has(set.id)) return 800
  return LISTENING_SECTION_MIN_SCRIPT_CHARS[set.section] ?? 1200
}

const BUILDER_AUDIOSCRIPT_BY_FOUNDATION_ID: Record<string, string> = {
  'foundation-essential-cam10-test4-section2-port-drill': scriptFromBuilderTest(
    CAMBRIDGE_10_SECTION_2_EXAM_SET,
    4
  ),
  'foundation-advanced-cam10-test4-section3-work-placement-drill': CAM10_TEST4_SECTION3_SCRIPT,
  'foundation-advanced-cam10-test4-section4-nanotechnology-drill': scriptFromBuilderTest(
    CAMBRIDGE_10_SECTION_4_EXAM_SET,
    4
  ),
  'foundation-advanced-section-3-global-design': CAM10_TEST1_SECTION3_SCRIPT,
  'foundation-advanced-section-4-spirit-bear': scriptFromBuilderTest(CAMBRIDGE_10_SECTION_4_EXAM_SET, 1),
  'foundation-essential-cam20-test1-section2-pottery-drill': CAM20_TEST1_SECTION2_POTTERY_SCRIPT
}

const uniquePassages = (set: ListeningFoundationSet) =>
  [...new Set(set.questions.map((question) => question.passage.trim()).filter(Boolean))]

const longestPassage = (passages: string[]) =>
  passages.reduce((longest, passage) => (passage.length > longest.length ? passage : longest), '')

/**
 * Resolves the full section audioscript for the split-screen listening exam.
 * Prefer explicit set.audioscript, then Cambridge builder transcripts, then the longest
 * shared passage on questions, then all unique excerpt paragraphs joined.
 */
export const resolveListeningFoundationAudioscript = (set: ListeningFoundationSet): string => {
  if (set.audioscript?.trim()) return set.audioscript.trim()

  const builderScript = BUILDER_AUDIOSCRIPT_BY_FOUNDATION_ID[set.id]
  if (builderScript?.trim()) return builderScript.trim()

  const passages = uniquePassages(set)
  if (passages.length === 0) return ''

  if (passages.length === 1) return passages[0]

  const longest = longestPassage(passages)
  const minChars = minCharsForSet(set)
  if (longest.length >= minChars) return longest

  return passages.join('\n\n')
}

export const isListeningFoundationAudioscriptComplete = (
  set: ListeningFoundationSet,
  script = resolveListeningFoundationAudioscript(set)
) => script.trim().length >= minCharsForSet(set)

export const isListeningExcerptDrillSet = (set: ListeningFoundationSet) =>
  LISTENING_EXCERPT_DRILL_FOUNDATION_IDS.has(set.id)
