// Combined Normal-Reading word-level paraphrase pairs across all ด่าน ranges,
// keyed by stage -> slot (1|2) -> local question number (pre-journey-remap).
// Attached onto report questions by buildIntensiveJourneyExam via applyIntensiveVocabPairs.
import type { ReadingVocabBridgePair } from './readingPassage3VocabBridge.ts'
import { INTENSIVE_PAIRS_STAGE_1_5 } from './intensiveJourneyVocabPairs1to5.ts'
import { INTENSIVE_PAIRS_STAGE_6_15 } from './intensiveJourneyVocabPairs6to15.ts'
import { INTENSIVE_PAIRS_STAGE_16_20 } from './intensiveJourneyVocabPairs16to20.ts'

type SlotNumberPairs = Record<number, ReadingVocabBridgePair[]>
type StagePairs = Record<1 | 2, SlotNumberPairs>

export const INTENSIVE_VOCAB_PAIRS_BY_STAGE: Record<number, StagePairs> = {
  ...INTENSIVE_PAIRS_STAGE_1_5,
  ...INTENSIVE_PAIRS_STAGE_6_15,
  ...INTENSIVE_PAIRS_STAGE_16_20
}

/** Attach the word-level pairs (if any) for one passage slot onto its questions, by local number. */
export const sanitizeReadingVocabPairs = (
  pairs: ReadingVocabBridgePair[] | undefined
): ReadingVocabBridgePair[] => {
  if (!pairs?.length) return []
  const seen = new Set<string>()
  return pairs.filter((pair) => {
    const q = String(pair.q || '').trim()
    const p = String(pair.p || '').trim()
    if (!q || !p) return false
    // Drop identical / near-identical noise ("ventilation shafts = ventilation shafts").
    if (q.toLowerCase() === p.toLowerCase()) return false
    if (q.length < 3 || p.length < 3) return false
    const key = `${q.toLowerCase()}::${p.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const applyIntensiveVocabPairs = (
  passage: { questions: Array<{ number: number; pairs?: ReadingVocabBridgePair[] }> },
  slotPairs: SlotNumberPairs | undefined
) => {
  if (!slotPairs) return
  for (const question of passage.questions) {
    const pairs = sanitizeReadingVocabPairs(slotPairs[question.number])
    if (pairs.length) question.pairs = pairs
  }
}
