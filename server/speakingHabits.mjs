// "Mistake habits": a grammar mistake type that keeps coming back across a student's speaking
// reports. The Nov 2026 audit showed repeating tests alone does not fix them (articles in 25 of
// one student's 31 tests), so the next report puts those habits first, as type-the-fix drills
// the student must finish before the band score unlocks.
//
// Pure functions only (no Supabase / Express) — tested by scripts/validate-speaking-mistakes.ts.

import { SPEAKING_MISTAKE_TYPES, classifySpeakingMistake } from './speakingMistakeQuality.mjs'

export const HABIT_MAX_TYPES = 10
// One typed fix per habit keeps the unlock to at most 10 sentences.
export const HABIT_DRILLS_PER_TYPE = 1
/** A type is a habit when it is in this report AND in at least this many of the earlier reports. */
export const HABIT_MIN_PREVIOUS_REPORTS = 1
/** Look back over only the student's last 2 reports (the teacher's call: 2 is enough). */
export const HABIT_HISTORY_REPORTS = 2

/** Plain-Thai rule + one fixed example per type. "other" is never a habit (no single rule). */
export const SPEAKING_HABIT_RULES = {
  article: {
    ruleTh: 'ของชิ้นเดียวที่นับได้ ต้องมี a / an นำหน้า · ถ้าพูดถึงแบบทั่วไป หรือเป็นพหูพจน์ ไม่ต้องใส่ the (education, people, Generation Y)',
    exampleWrong: 'I want to work in international organization.',
    exampleRight: 'I want to work in an international organization.'
  },
  plural: {
    ruleTh: 'หลัง many / a lot of / one of my … ต้องเติม -s ที่คำนามเสมอ',
    exampleWrong: 'It is one of my favorite place.',
    exampleRight: 'It is one of my favorite places.'
  },
  preposition: {
    ruleTh: 'บางคำไม่ต้องมี preposition เลย: nowadays, online, home, abroad, last week · คำอื่นให้จำเป็นคู่ เช่น good at, interested in, on the weekend',
    exampleWrong: 'People in nowadays shop on online.',
    exampleRight: 'People nowadays shop online.'
  },
  'missing-word': {
    ruleTh: 'ทุกประโยคต้องมี ประธาน + กริยา · คำ -ing ต้องมี am / is / are นำหน้า · give, wear, like, buy ต้องมี it / them ตามหลัง',
    exampleWrong: 'When I taking a shower, I listen to music.',
    exampleRight: 'When I am taking a shower, I listen to music.'
  },
  tense: {
    ruleTh: 'เรื่องที่เกิดไปแล้ว (last time, yesterday, when I was young) ใช้ past tense · since / until now / for 5 years ใช้ have + V3',
    exampleWrong: 'Last time I have a campaign at work.',
    exampleRight: 'Last time I had a campaign at work.'
  },
  'subject-verb': {
    ruleTh: 'ประธานเป็นสิ่งเดียว (English, my mom, it) กริยาต้องเติม -s · ประธานหลายสิ่ง (routines, people) กริยาไม่เติม -s',
    exampleWrong: 'English help me a lot.',
    exampleRight: 'English helps me a lot.'
  },
  'verb-pattern': {
    ruleTh: 'หลัง with / by / about / especially ใช้ V-ing · หลัง prefer / want / plan / decide ใช้ to + กริยา',
    exampleWrong: 'I prefer go there by train.',
    exampleRight: 'I prefer to go there by train.'
  },
  'sentence-structure': {
    ruleTh: 'ของในลิสต์เดียวกันต้องหน้าตาเหมือนกัน (cleaning…, brushing…, drinking…) · ถ้าจะเพิ่มข้อมูลต่อท้าย ใช้ “, which …”',
    exampleWrong: 'I start my day with cleaning my face and brush my teeth.',
    exampleRight: 'I start my day with cleaning my face and brushing my teeth.'
  },
  'word-form': {
    ruleTh: 'จำคำเป็นครอบครัว: culture / cultural, recover / recovery, passion / passionate · หลัง to ใช้กริยา · หน้าคำนามใช้ adjective',
    exampleWrong: 'I sleep early in order to recovery.',
    exampleRight: 'I sleep early in order to recover.'
  },
  'word-order': {
    ruleTh: 'เรียงเป็น ประธาน + กริยา + กรรม ก่อน แล้วค่อยบอกเวลา / สถานที่ไว้ท้ายประโยค',
    exampleWrong: "I'm older than her 11 years.",
    exampleRight: "I'm 11 years older than her."
  },
  pronoun: {
    ruleTh: 'he / she / it / they ต้องตรงกับคนหรือสิ่งที่พูดถึง · his / her / their ต้องตรงกับเจ้าของ',
    exampleWrong: 'My sister loves his job.',
    exampleRight: 'My sister loves her job.'
  },
  'word-choice': {
    ruleTh: 'ใช้คำที่ชอบมาคู่กัน เช่น make a decision, play a role, take a photo — อย่าแปลตรงจากภาษาไทย',
    exampleWrong: 'I did a decision to study abroad.',
    exampleRight: 'I made a decision to study abroad.'
  }
}

const typeOf = (mistake) =>
  classifySpeakingMistake({
    errorType: mistake?.errorType,
    errorTypeThai: mistake?.errorTypeThai,
    originalText: mistake?.originalText,
    correctedText: mistake?.correctedText
  })

const isUsableDrill = (mistake) => {
  const original = String(mistake?.originalText || '').trim()
  const corrected = String(mistake?.correctedText || '').trim()
  return original.length >= 6 && original.length <= 160 && corrected.length >= 4 && corrected.length <= 180
}

/**
 * @param currentMistakes   grammarMistakes of the report being built
 * @param previousReports   grammarMistakes arrays of the student's earlier reports, newest first
 * @returns habit list, most repeated first; empty when there is no history or no repeat
 */
export const buildHabitDrills = ({ currentMistakes, previousReports }) => {
  const current = (Array.isArray(currentMistakes) ? currentMistakes : [])
    .map((mistake) => ({ mistake, type: typeOf(mistake) }))
    .filter((item) => item.type && SPEAKING_HABIT_RULES[item.type])
  const history = (Array.isArray(previousReports) ? previousReports : []).slice(0, HABIT_HISTORY_REPORTS)
  if (!current.length || history.length < HABIT_MIN_PREVIOUS_REPORTS) return []

  const reportsWithType = {}
  for (const mistakes of history) {
    const types = new Set((Array.isArray(mistakes) ? mistakes : []).map(typeOf).filter(Boolean))
    for (const type of types) reportsWithType[type] = (reportsWithType[type] || 0) + 1
  }

  const byType = new Map()
  for (const { mistake, type } of current) {
    if ((reportsWithType[type] || 0) < HABIT_MIN_PREVIOUS_REPORTS) continue
    const bucket = byType.get(type) || []
    bucket.push(mistake)
    byType.set(type, bucket)
  }

  return [...byType.entries()]
    .sort(
      ([leftType, left], [rightType, right]) =>
        reportsWithType[rightType] - reportsWithType[leftType] || right.length - left.length
    )
    .slice(0, HABIT_MAX_TYPES)
    .map(([type, mistakes]) => {
      const seen = new Set()
      const drills = mistakes
        .filter(isUsableDrill)
        .sort((left, right) => String(left.originalText).length - String(right.originalText).length)
        .filter((mistake) => {
          const key = String(mistake.originalText).toLowerCase().trim()
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .slice(0, HABIT_DRILLS_PER_TYPE)
        .map((mistake, index) => ({
          id: `${type}-${index + 1}`,
          originalText: String(mistake.originalText).trim(),
          correctedText: String(mistake.correctedText).trim(),
          reasonThai: String(mistake.reasonThai || '').trim()
        }))
      const rule = SPEAKING_HABIT_RULES[type]
      return {
        type,
        label: SPEAKING_MISTAKE_TYPES[type],
        ruleTh: rule.ruleTh,
        exampleWrong: rule.exampleWrong,
        exampleRight: rule.exampleRight,
        // How many of the student's reports (this one included) had this mistake type.
        seenInReports: reportsWithType[type] + 1,
        outOfReports: history.length + 1,
        drills
      }
    })
    .filter((habit) => habit.drills.length > 0)
}

/** Same comparison the student's drill box uses: case, punctuation and spacing don't matter. */
export const normalizeDrillAnswer = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
