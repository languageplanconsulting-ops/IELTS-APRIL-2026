// Shared types + helpers for the mistake-habit drills (component lives in SpeakingHabitDrills.tsx).
// The server side is server/speakingHabits.mjs; normalizeDrillAnswer must match it.

export type SpeakingHabitDrill = {
  id: string
  originalText: string
  correctedText: string
  reasonThai?: string
}

export type SpeakingHabit = {
  type: string
  label: string
  ruleTh: string
  exampleWrong: string
  exampleRight: string
  seenInReports: number
  outOfReports: number
  drills: SpeakingHabitDrill[]
}

/** Case, punctuation and spacing don't matter (same rule as the server). */
export const normalizeDrillAnswer = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const hashText = (text: string) => {
  let hash = 5381
  for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) + hash + text.charCodeAt(index)) | 0
  return (hash >>> 0).toString(36)
}

/** Stable per report: the same saved report always maps to the same "done" record. */
export const habitStorageKey = (habits: SpeakingHabit[], transcript: string) =>
  `english-plan-speaking-habits:${hashText(
    JSON.stringify(habits.map((habit) => [habit.type, habit.drills.map((drill) => drill.originalText)])) +
      '|' +
      String(transcript || '').slice(0, 200)
  )}`
