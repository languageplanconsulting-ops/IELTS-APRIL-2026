// One question, one plan.
//
// The planner used to ask four things — target band, session length, which days,
// start date — before it would show a student anything. Every one of those is a
// question about *means*, and a student who has just bought an IELTS course has
// exactly one fact in their head that the app doesn't: when they sit the test.
//
// So that is the only question asked. Everything else is arithmetic:
//
//   time available  =  weeks until the exam × sessions per week × minutes each
//   time required   =  the minutes of whichever plan's lessons we schedule
//
// and the plan is the richest one whose required time fits inside the available
// time at a load a person will actually keep. The four old controls still exist,
// behind "ปรับเอง" — this just means nobody has to touch them to start.

import { planCourseCount, type JourneyCourseId } from './courseJourney'
import { todayIso, type StudySchedule } from './studySchedule'
import type { PlanId } from './bundlePlans'

export type ExamHorizon = {
  id: string
  label: string
  /** Days from today to the exam, or null for "no date yet". */
  days: number | null
}

export const EXAM_HORIZONS: ExamHorizon[] = [
  { id: 'm1', label: 'ภายใน 1 เดือน', days: 30 },
  { id: 'm2', label: 'ประมาณ 2 เดือน', days: 60 },
  { id: 'm3', label: 'ประมาณ 3 เดือน', days: 90 },
  { id: 'm6', label: 'อีก 4 เดือนขึ้นไป', days: 180 },
  { id: 'open', label: 'ยังไม่กำหนดวันสอบ', days: null }
]

/**
 * Loads, in the order a person will actually keep them.
 *
 * The search takes the first tier that can hold a plan, so a student with six
 * months gets five relaxed sessions a week rather than the same content crammed
 * into seven long ones. Only a genuinely short runway pushes into tier 3.
 */
const LOAD_TIERS = [
  { maxSessions: 5, maxMinutes: 60 },
  { maxSessions: 6, maxMinutes: 90 },
  { maxSessions: 7, maxMinutes: 120 }
]

/** Richest first — a student with the time should be given the whole course. */
const PLANS_BY_DEPTH: PlanId[] = ['full75', 'fast75', 'band6']

const SESSION_CHOICES = [3, 4, 5, 6, 7]
const MINUTE_CHOICES = [15, 30, 45, 60, 90, 120]

/**
 * Slack on the fit test.
 *
 * A plan sized to exactly fill the runway leaves no room for the week someone
 * gets flu, and a finish date landing on the exam date itself leaves none for
 * revision — which is the difference between a plan and a dare. At 10% this
 * still handed a two-month student a plan finishing the morning of the exam;
 * 20% is roughly a fortnight's buffer on a three-month runway.
 */
const FIT_SLACK = 1.2

/** Study minutes the plan schedules across every course the student owns. */
export function planMinutes(enrolled: JourneyCourseId[], planId: PlanId): number {
  return enrolled.reduce((sum, courseId) => sum + planCourseCount(courseId, planId).minutes, 0)
}

/** Sessions per week → the schedule shape that produces them. */
function scheduleFor(sessions: number, minutesPerDay: number, startDateIso: string): StudySchedule {
  const base = { minutesPerDay, startDateIso }
  if (sessions >= 7) return { ...base, mode: 'interval', intervalDays: 1, weekdays: [1, 2, 3, 4, 5] }
  const weekdays =
    sessions >= 6 ? [1, 2, 3, 4, 5, 6] : sessions >= 5 ? [1, 2, 3, 4, 5] : sessions >= 4 ? [1, 2, 4, 6] : [1, 3, 5]
  return { ...base, mode: 'weekdays', intervalDays: 1, weekdays }
}

export type DerivedPlan = {
  planId: PlanId
  schedule: StudySchedule
  /** Minutes of lessons the chosen plan schedules. */
  minutes: number
  /**
   * True when even the leanest plan at the heaviest sane load doesn't fit the
   * runway. The plan is still built — it just has to say so rather than quote a
   * finish date it can't hit.
   */
  tight: boolean
}

/**
 * The plan a given exam date implies.
 *
 * `enrolled` matters: a student who owns one course needs a fraction of the time
 * one who owns four does, and the same date should therefore buy them a deeper
 * plan. Nothing here is remembered — pass the current enrolment and it re-derives.
 */
export function derivePlan(
  enrolled: JourneyCourseId[],
  daysUntilExam: number | null,
  startDateIso: string = todayIso()
): DerivedPlan {
  // No date is not a reason to guess a deadline. It means pace is a lifestyle
  // question rather than an arithmetic one, and weekday evenings at 45 minutes
  // is the answer that suits most working students.
  if (daysUntilExam === null) {
    return {
      planId: 'fast75',
      schedule: scheduleFor(5, 45, startDateIso),
      minutes: planMinutes(enrolled, 'fast75'),
      tight: false
    }
  }

  // Two weeks is the floor: below that the arithmetic is theatre.
  const weeks = Math.max(2, daysUntilExam) / 7

  for (const tier of LOAD_TIERS) {
    for (const planId of PLANS_BY_DEPTH) {
      const minutes = planMinutes(enrolled, planId)
      if (!minutes) continue
      for (const sessions of SESSION_CHOICES.filter((s) => s <= tier.maxSessions)) {
        for (const minutesPerDay of MINUTE_CHOICES.filter((m) => m <= tier.maxMinutes)) {
          if (weeks * sessions * minutesPerDay >= minutes * FIT_SLACK) {
            return { planId, schedule: scheduleFor(sessions, minutesPerDay, startDateIso), minutes, tight: false }
          }
        }
      }
    }
  }

  // Nothing fits. Say so, and schedule the core lessons at the heaviest load
  // rather than silently quoting a finish date after the exam.
  return {
    planId: 'band6',
    schedule: scheduleFor(7, 90, startDateIso),
    minutes: planMinutes(enrolled, 'band6'),
    tight: true
  }
}

/** Whole days from today to an ISO date; negative once it's past. */
export function daysUntil(iso: string, fromIsoDate: string = todayIso()): number {
  const from = new Date(fromIsoDate).getTime()
  const to = new Date(iso).getTime()
  return Math.round((to - from) / 86_400_000)
}

/**
 * The plan measured against the thing it exists for.
 *
 * The finish date on its own is a number about the course. Against the exam date
 * it becomes a number about the student: days of revision left, or days short.
 */
export function examVerdict(
  finishIso: string | null,
  examIso: string | null
): { kind: 'clear'; days: number } | { kind: 'late'; days: number } | { kind: 'unknown' } {
  if (!finishIso || !examIso) return { kind: 'unknown' }
  const gap = daysUntil(examIso, finishIso)
  return gap >= 0 ? { kind: 'clear', days: gap } : { kind: 'late', days: Math.abs(gap) }
}
