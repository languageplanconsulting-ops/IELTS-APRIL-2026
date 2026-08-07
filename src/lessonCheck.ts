// The retrieval check — what turns "watched" into "learned".
//
// Before this existed, the only way to complete a lesson was to press a button
// that said "watched it", and every percentage in the app was built on that
// press. A student could reach 100% without playing a single video, and the
// finish date, the progress rings and the pace advice were all measuring a
// signal with no information in it.
//
// The fix is the cheapest intervention with the strongest evidence behind it:
// make the learner retrieve. Testing-effect work (Roediger & Karpicke and the
// large literature after it) is consistent on two points — that trying to recall
// beats re-watching by a wide margin, and that the benefit survives even when
// nobody marks the answer. Self-explanation studies say the same for "put it in
// your own words".
//
// Which is why this is ungraded free recall rather than multiple choice. Nothing
// here needs an answer key, so it works on all ~200 lessons today instead of the
// handful anyone would get round to authoring; and a distractor list can be
// eliminated by recognition, which is the process the student needs to *not* be
// relying on. What the app records is that the attempt happened, and the words
// they used — which is also the artefact the spaced review below hands back.

import type { JourneyCourseId } from './courseJourney'

export type CheckAnswer = {
  /** What the learner wrote, verbatim. Never graded, only kept. */
  text: string
  /** Epoch ms of the first attempt. */
  at: number
  /** Epoch ms of the most recent spaced review, if it's been back. */
  reviewedAt?: number
}

export type CheckMap = Record<string, CheckAnswer>

/**
 * Enough writing to have required recall.
 *
 * Thai doesn't put spaces between words, so a word count would be wrong here;
 * length plus variety is what separates a real sentence from a held-down key.
 */
export const MIN_RECALL_CHARS = 30
const MIN_DISTINCT_CHARS = 10

export function isRecallSufficient(text: string): boolean {
  const trimmed = text.replace(/\s+/g, '')
  if (trimmed.length < MIN_RECALL_CHARS) return false
  return new Set(trimmed).size >= MIN_DISTINCT_CHARS
}

/** How much more they need to write, for a live counter under the box. */
export function recallShortfall(text: string): number {
  return Math.max(0, MIN_RECALL_CHARS - text.replace(/\s+/g, '').length)
}

/**
 * The prompt, per skill.
 *
 * Deliberately about *use*, not about content: "what did this teach" invites a
 * summary of the video, which can be produced by looking at it. "When would you
 * use this" can't be answered without having understood it.
 */
const PROMPT_TH: Record<JourneyCourseId, string> = {
  grammar: 'ปิดวิดีโอในใจก่อน — โครงสร้างนี้ใช้ตอนไหน? เขียนตัวอย่างประโยคของคุณเอง 1 ประโยค',
  writing: 'ไม่ต้องเปิดกลับไปดู — บทนี้ใช้ตอนไหนของ essay และเขียนยังไง? อธิบายด้วยคำของคุณเอง',
  reading: 'ไม่ต้องเปิดกลับไปดู — เทคนิคนี้ใช้กับคำถามแบบไหน และทำอะไรเป็นขั้นแรก?',
  speaking: 'ไม่ต้องเปิดกลับไปดู — จะเอาสิ่งที่เรียนไปใช้ตอบพาร์ทไหน? ลองเขียนประโยคที่จะพูดจริง 1 ประโยค',
  listening: 'ไม่ต้องเปิดกลับไปดู — เจอคำถามแบบไหนถึงใช้วิธีนี้ และต้องฟังหาอะไร?'
}

export const checkPrompt = (course: JourneyCourseId): string =>
  PROMPT_TH[course] ?? 'ไม่ต้องเปิดกลับไปดู — บทนี้สอนอะไร และใช้ตอนไหน? เขียนด้วยคำของคุณเอง'

/** Shown after they commit, so the answer is a thing they own rather than a toll. */
export const checkPraise = 'บันทึกแล้ว — ที่คุณเพิ่งนึกออกเองนี่แหละคือส่วนที่จะอยู่ยาว'

// ------------------------------------------------------------- spacing ----
//
// One retrieval fixes very little on its own; the curve does. These two numbers
// give a lesson a second attempt a few days later and a third about a fortnight
// after that — expanding intervals, which is the shape the spacing literature
// keeps landing on, at the coarsest resolution a video course can support.

const FIRST_REVIEW_DAYS = 3
const NEXT_REVIEW_DAYS = 12
const DAY_MS = 86_400_000

/**
 * The one lesson most worth recalling again today, or null.
 *
 * One, never a queue: a review stack is a debt, and a debt is the thing students
 * abandon a course over. The oldest due lesson wins, so nothing starves.
 */
export function dueForReview(checks: CheckMap, nowMs: number): string | null {
  let best: { lessonId: string; since: number } | null = null
  for (const [lessonId, answer] of Object.entries(checks)) {
    const last = answer.reviewedAt ?? answer.at
    if (!last) continue
    const waited = (nowMs - last) / DAY_MS
    const needed = answer.reviewedAt ? NEXT_REVIEW_DAYS : FIRST_REVIEW_DAYS
    if (waited < needed) continue
    if (!best || last < best.since) best = { lessonId, since: last }
  }
  return best?.lessonId ?? null
}
