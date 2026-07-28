// Admin-only persona preview.
//
// The course looks completely different depending on who is holding it: a
// student who hasn't planned yet sees an empty planner, a working adult sees
// three study days a week and a calendar full of gaps, someone who fell off two
// weeks ago sees a pile of overdue days. Those are the states worth designing
// against, and none of them can be reached from an admin account that has its
// own real progress.
//
// So a persona is simply a *storage scope*: a fake learner id with pre-seeded
// localStorage. Nothing here touches the admin's own data — switching back to
// "ตัวฉันเอง" restores the real scope untouched, because the real scope was
// never written to.

import { courseLessons, type JourneyCourseId } from './courseJourney'
import { journeyStorageKey, writingPlanStorageKey } from './courseStorageKeys'
import { addDays, todayIso, type ScheduleMode, type StudySchedule } from './studySchedule'
import type { StudyTrack } from './writingCourseStudyPlan'

export type PersonaId = 'self' | 'fresh' | 'busy' | 'daily' | 'stalled' | 'finisher'

export type Persona = {
  id: PersonaId
  emoji: string
  label: string
  /** What this persona is for — the state it puts the UI into. */
  blurb: string
}

type PersonaSeed = {
  mode: ScheduleMode
  intervalDays: number
  weekdays: number[]
  minutesPerDay: number
  /** Negative = started in the past, which is what creates overdue days. */
  startOffsetDays: number
  enrolled: JourneyCourseId[]
  writingTrack: StudyTrack
  /** Share of each course's lessons marked done, taken in taught order. */
  progress: Partial<Record<JourneyCourseId, number>>
  /** A lesson left part-way, so the "เล่นต่อจาก" path is visible. */
  resumeAt?: { course: JourneyCourseId; index: number; fraction: number }
}

export const PERSONAS: Persona[] = [
  { id: 'self', emoji: '👤', label: 'ตัวฉันเอง', blurb: 'ข้อมูลจริงของบัญชีแอดมิน' },
  { id: 'fresh', emoji: '🌱', label: 'นักเรียนใหม่', blurb: 'เพิ่งซื้อคอร์ส ยังไม่ได้วางแผน — เห็นหน้า planner เปล่า ๆ' },
  { id: 'busy', emoji: '💼', label: 'คนทำงาน', blurb: 'ว่างแค่ อ/พฤ/ส ครั้งละ 30 นาที — ปฏิทินห่าง ๆ' },
  { id: 'daily', emoji: '🔥', label: 'เรียนทุกวัน', blurb: 'ทุกวัน 90 นาที เรียนไปแล้วราวหนึ่งในสี่ + ค้างคลิปไว้กลางทาง' },
  { id: 'stalled', emoji: '🕳️', label: 'หายไปสองสัปดาห์', blurb: 'เริ่มไว้ 18 วันก่อนแล้วหยุด — เห็นสภาพ "ตามแผนไม่ทัน"' },
  { id: 'finisher', emoji: '🏁', label: 'ใกล้เรียนจบ', blurb: 'เหลืออีกไม่กี่บท — เห็นสถานะ ✓ เขียวและปุ่มทบทวน' }
]

export const PERSONA_BY_ID: Record<PersonaId, Persona> = PERSONAS.reduce(
  (map, persona) => {
    map[persona.id] = persona
    return map
  },
  {} as Record<PersonaId, Persona>
)

const SEEDS: Record<Exclude<PersonaId, 'self' | 'fresh'>, PersonaSeed> = {
  busy: {
    mode: 'weekdays',
    intervalDays: 1,
    weekdays: [2, 4, 6],
    minutesPerDay: 30,
    startOffsetDays: -6,
    enrolled: ['writing', 'reading', 'listening', 'speaking'],
    writingTrack: 'essentials',
    progress: { writing: 0.04, listening: 0.07, reading: 0.03, speaking: 0.05 }
  },
  daily: {
    mode: 'interval',
    intervalDays: 1,
    weekdays: [1, 3, 5],
    minutesPerDay: 90,
    startOffsetDays: -24,
    enrolled: ['writing', 'reading', 'listening', 'speaking'],
    writingTrack: 'complete',
    progress: { writing: 0.28, listening: 0.25, reading: 0.22, speaking: 0.24 },
    resumeAt: { course: 'listening', index: 7, fraction: 0.42 }
  },
  stalled: {
    mode: 'interval',
    intervalDays: 2,
    weekdays: [1, 3, 5],
    minutesPerDay: 45,
    startOffsetDays: -18,
    enrolled: ['writing', 'reading', 'listening', 'speaking'],
    writingTrack: 'essentials',
    progress: { writing: 0.05, listening: 0.04 },
    resumeAt: { course: 'writing', index: 3, fraction: 0.31 }
  },
  finisher: {
    mode: 'weekdays',
    intervalDays: 1,
    weekdays: [1, 2, 3, 4, 5],
    minutesPerDay: 60,
    startOffsetDays: -120,
    enrolled: ['writing', 'reading', 'listening', 'speaking', 'grammar'],
    writingTrack: 'essentials',
    progress: { writing: 0.96, listening: 0.96, reading: 0.94, speaking: 0.95, grammar: 0.9 }
  }
}

/** The fake learner id a persona's data is filed under. Never a real address. */
export const personaScope = (personaId: PersonaId, realEmail: string): string =>
  personaId === 'self' ? realEmail : `persona+${personaId}@preview.local`

const takeIds = (courseId: JourneyCourseId, fraction: number): string[] => {
  const lessons = courseLessons(courseId)
  return lessons.slice(0, Math.round(lessons.length * fraction)).map((lesson) => lesson.id)
}

const buildSchedule = (seed: PersonaSeed): StudySchedule => ({
  mode: seed.mode,
  intervalDays: seed.intervalDays,
  weekdays: seed.weekdays,
  minutesPerDay: seed.minutesPerDay,
  startDateIso: addDays(todayIso(), seed.startOffsetDays)
})

/**
 * Writes a persona's world into its own storage scope.
 *
 * Idempotent by default: an admin who has been clicking around inside a persona
 * keeps that state between visits, which is what makes "check the ทบทวน button
 * again" possible. `force` is the reset path.
 */
export function seedPersona(personaId: PersonaId, options?: { force?: boolean }): void {
  if (typeof window === 'undefined' || personaId === 'self') return
  const scope = personaScope(personaId, '')
  const journeyKey = journeyStorageKey(scope)
  const writingKey = writingPlanStorageKey(scope)

  if (!options?.force && window.localStorage.getItem(journeyKey)) return

  // The blank-slate persona is the absence of any seed, not a seed of its own.
  if (personaId === 'fresh') {
    window.localStorage.removeItem(journeyKey)
    window.localStorage.removeItem(writingKey)
    return
  }

  const seed = SEEDS[personaId]
  const schedule = buildSchedule(seed)

  const resume: Record<string, { seconds: number; duration: number; updatedAt: number }> = {}
  if (seed.resumeAt) {
    const lesson = courseLessons(seed.resumeAt.course)[seed.resumeAt.index]
    if (lesson) {
      const duration = Math.max(120, lesson.minutes * 60)
      resume[lesson.id] = {
        seconds: Math.floor(duration * seed.resumeAt.fraction),
        duration,
        updatedAt: Date.now() - 36e5
      }
    }
  }

  const writingDone = takeIds('writing', seed.progress.writing ?? 0)
  const otherDone = (Object.keys(seed.progress) as JourneyCourseId[])
    .filter((courseId) => courseId !== 'writing')
    .flatMap((courseId) => takeIds(courseId, seed.progress[courseId] ?? 0))

  window.localStorage.setItem(
    journeyKey,
    JSON.stringify({ schedule, enrolled: seed.enrolled, completedIds: otherDone, unlockedDays: [], resume })
  )

  // The Writing shell keeps its own plan; give the persona a matching one so
  // stepping into that course doesn't drop them back onto its onboarding.
  window.localStorage.setItem(
    writingKey,
    JSON.stringify({
      onboarding: {
        track: seed.writingTrack,
        intervalDays: seed.mode === 'interval' ? seed.intervalDays : 2,
        minutesPerDay: seed.minutesPerDay,
        startDateIso: schedule.startDateIso
      },
      completedIds: writingDone,
      aheadUnlocked: [],
      // Writing lesson ids are bare (`c3-l1`); every migrated course namespaces
      // its own (`listening:c3-l1`), so the split is just the colon.
      resume: Object.fromEntries(Object.entries(resume).filter(([id]) => !id.includes(':')))
    })
  )
}

/** Wipes a persona back to its seeded state. Only ever touches persona scopes. */
export function resetPersona(personaId: PersonaId): void {
  if (personaId === 'self') return
  seedPersona(personaId, { force: true })
}
