/**
 * Placement-test speaking ladder — the teacher's own rules, not the full
 * speaking-journey rubric.
 *
 * The journey rubric weighs fluency, lexical and grammar across nine bands. The
 * placement test deliberately looks at far less: tense and article accuracy set
 * the floor, vocabulary errors pull it down, and length plus collocation range
 * set the ceiling. Everything else the examiner prompt reports is ignored here.
 *
 * Signals come from the journey pipeline (`/api/assess`), which punctuates the
 * ASR transcript under an explicit do-not-fix-grammar directive — so sentence
 * boundaries are countable without the learner's errors being repaired first.
 */

export type PlacementSpeakingSignals = {
  /** Present-simple and past-simple errors (missing -s, wrong/absent -ed, etc.). */
  tenseErrorCount: number
  /** Missing, extra or wrong articles. */
  articleErrorCount: number
  /** Did the learner attempt past tense anywhere? */
  usedPastTense: boolean
  /** Were those past-tense attempts correct? */
  pastTenseCorrect: boolean
  /** Clear wrong-word / wrong-collocation choices. */
  vocabularyErrorCount: number
  /** Linking words actually used, e.g. "because", "however", "for example". */
  transitionsUsed: string[]
  /** Does each answer hold together, or is it a list of disconnected clauses? */
  ideasOrganised: boolean
  /** B2–C1 collocations found, listed so the report can quote them back. */
  b2c1Collocations: string[]
  /** Sentence count for each of the four answers, in order. */
  sentenceCountsPerQuestion: number[]
}

export type PlacementSpeakingBandKey = 'below5.5' | '5.5-6' | '6' | '6-6.5' | '6.5' | '7plus'

export type PlacementSpeakingResult = {
  bandKey: PlacementSpeakingBandKey
  /** Range as shown to the student, e.g. "6.0–6.5". */
  bandLabel: string
  /** Thai one-liners explaining what decided the band. */
  reasonsThai: string[]
}

const BAND_LABELS: Record<PlacementSpeakingBandKey, string> = {
  'below5.5': 'ต่ำกว่า 5.5',
  '5.5-6': '5.5–6.0',
  '6': '6.0',
  '6-6.5': '6.0–6.5',
  '6.5': '6.5',
  '7plus': '7.0 ขึ้นไป'
}

/** Answers shorter than this cap the band at 6.5, however clean they are. */
const MIN_SENTENCES_PER_ANSWER = 4
/** Band 7+ needs every answer to go beyond that minimum. */
const BAND7_SENTENCES_PER_ANSWER = 5
/** Band 7+ also needs this many B2–C1 collocations across the whole test. */
const BAND7_MIN_COLLOCATIONS = 6
/** Four or more wrong word choices drops below the placement floor. */
const VOCAB_ERRORS_BELOW_FLOOR = 4

export const scorePlacementSpeaking = (signals: PlacementSpeakingSignals): PlacementSpeakingResult => {
  const reasonsThai: string[] = []
  const counts = signals.sentenceCountsPerQuestion
  const shortestAnswer = counts.length ? Math.min(...counts) : 0
  const collocationCount = signals.b2c1Collocations.length

  const result = (bandKey: PlacementSpeakingBandKey): PlacementSpeakingResult => ({
    bandKey,
    bandLabel: BAND_LABELS[bandKey],
    reasonsThai
  })

  // Floors first, lowest wins — a learner who trips two rules gets the lower band.
  if (signals.vocabularyErrorCount >= VOCAB_ERRORS_BELOW_FLOOR) {
    reasonsThai.push(`ใช้คำศัพท์ผิดบริบท ${signals.vocabularyErrorCount} จุด ทำให้ความหมายสะดุดบ่อยครับ`)
    return result('below5.5')
  }

  if (signals.tenseErrorCount > 0 || signals.articleErrorCount > 0) {
    if (signals.tenseErrorCount > 0) {
      reasonsThai.push(`ยังมี tense ผิด ${signals.tenseErrorCount} จุด (present simple / past simple) ครับ`)
    }
    if (signals.articleErrorCount > 0) {
      reasonsThai.push(`ยังมี article (a / an / the) ผิด ${signals.articleErrorCount} จุดครับ`)
    }
    return result('5.5-6')
  }

  if (signals.vocabularyErrorCount > 0) {
    reasonsThai.push(
      `ไวยากรณ์สะอาดแล้ว แต่ยังใช้คำศัพท์ผิดบริบท ${signals.vocabularyErrorCount} จุดครับ`
    )
    return result('6')
  }

  if (!signals.usedPastTense || !signals.pastTenseCorrect) {
    reasonsThai.push(
      signals.usedPastTense
        ? 'มีการใช้ past tense แต่ยังไม่ถูกต้อง เลยยังขยับขึ้นไม่ได้ครับ'
        : 'ไม่มีข้อผิดพลาด แต่ยังไม่ได้ใช้ past tense เลยครับ'
    )
    return result('6')
  }

  if (!signals.ideasOrganised || signals.transitionsUsed.length === 0) {
    reasonsThai.push(
      signals.transitionsUsed.length === 0
        ? 'ไวยากรณ์ถูกต้อง แต่ยังไม่มีคำเชื่อม (transition) เลย ทำให้ไอเดียยังไม่ต่อกันครับ'
        : 'ไวยากรณ์ถูกต้อง แต่การเรียบเรียงไอเดียยังไม่เป็นลำดับครับ'
    )
    return result('6-6.5')
  }

  // From here the answer is clean: tense, articles, vocabulary and organisation
  // are all in order. Length and collocation range decide 6.5 versus 7+.
  reasonsThai.push('ไม่มี article หรือ tense ผิด และใช้ past tense ได้ถูกต้องครับ')

  if (shortestAnswer < MIN_SENTENCES_PER_ANSWER) {
    reasonsThai.push('แต่คำตอบบางข้อสั้นเกินไป เลยหยุดไว้ที่ 6.5 ครับ')
    return result('6.5')
  }

  const longEnoughForBand7 = counts.length > 0 && counts.every((count) => count > BAND7_SENTENCES_PER_ANSWER - 1)
  if (longEnoughForBand7 && collocationCount >= BAND7_MIN_COLLOCATIONS) {
    reasonsThai.push(`ตอบยาวครบทุกข้อ และใช้ collocation ระดับ B2–C1 ${collocationCount} จุดครับ`)
    return result('7plus')
  }

  reasonsThai.push(
    collocationCount > 0
      ? `ใช้ collocation ระดับ B2–C1 ${collocationCount} จุด ซึ่งยังไม่พอสำหรับ 7.0 ครับ`
      : 'แต่คำศัพท์ยังเป็นระดับพื้นฐานเป็นส่วนใหญ่ครับ'
  )
  return result('6.5')
}

export const placementSpeakingBandLabel = (bandKey: PlacementSpeakingBandKey): string => BAND_LABELS[bandKey]
