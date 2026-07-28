// Turns a plan definition into the concrete lesson list it schedules, and the
// honest hour count that follows from it.
//
// The hour count matters more than it looks. A student picking a plan is really
// asking "can I finish this before my exam?" — and the only useful answer comes
// from summing the actual lesson durations, which is why every number here is
// derived from the migrated course data rather than estimated.

import COURSE_CATALOG from './courseCatalog.json'
import {
  BAND6_WRITING_PER_TYPE_CAP,
  COURSES_BY_PLAN,
  LISTENING_KEYS_BY_PLAN,
  READING_TEST_CHAPTERS_BY_PLAN,
  READING_THEORY_CHAPTERS,
  SPEAKING_KEYS_BY_PLAN,
  WRITING_QUESTION_TYPES_BY_PLAN,
  WRITING_TIERS_BY_PLAN,
  type CourseId,
  type PlanId
} from './bundlePlans'
import { WRITING_COURSE_LESSONS, type CourseLesson } from './writingCourseCurriculum'

type CatalogLesson = {
  id: string
  key: string
  chapterIndex: number
  title: string
  seconds: number | null
  minutes: number | null
  bunnyVideoId: string | null
}

type CatalogCourse = {
  id: string
  label: string
  labelTh: string
  lessonCount: number
  totalMinutes: number
  lessons: CatalogLesson[]
}

const CATALOG = COURSE_CATALOG as unknown as Record<string, CatalogCourse>

export type PlannedLesson = {
  course: CourseId
  /** Stable id — `${course}:${key}` for migrated courses, lesson.id for Writing. */
  id: string
  key: string
  title: string
  minutes: number
  bunnyVideoId: string | null
  /** False when the lesson exists in the course but sits outside this plan. */
  inPlan: boolean
}

export type CourseBreakdown = {
  course: CourseId
  label: string
  plannedLessons: number
  totalLessons: number
  plannedMinutes: number
  totalMinutes: number
}

export type ResolvedPlan = {
  planId: PlanId
  lessons: PlannedLesson[]
  byCourse: CourseBreakdown[]
  totalMinutes: number
  totalLessons: number
}

/**
 * Writing selection.
 *
 * Band 6 wants breadth across Task 1 chart types but only a lesson or two of
 * each, so we take the first N of each question type in taught order — the
 * taught order already puts the method video before its extra examples.
 */
function resolveWriting(planId: PlanId): PlannedLesson[] {
  const tiers = WRITING_TIERS_BY_PLAN[planId]
  const allowedTypes = WRITING_QUESTION_TYPES_BY_PLAN[planId]
  const perTypeCap = planId === 'band6' ? BAND6_WRITING_PER_TYPE_CAP : Infinity

  const takenPerType = new Map<string, number>()

  return WRITING_COURSE_LESSONS.map((lesson: CourseLesson) => {
    const tierOk = tiers.includes(lesson.tier)
    const typeOk = allowedTypes === 'all' || allowedTypes.includes(lesson.questionType)

    let inPlan = tierOk && typeOk
    if (inPlan && perTypeCap !== Infinity) {
      const taken = takenPerType.get(lesson.questionType) ?? 0
      if (taken >= perTypeCap) inPlan = false
      else takenPerType.set(lesson.questionType, taken + 1)
    }

    return {
      course: 'writing' as const,
      id: lesson.id,
      key: lesson.id,
      title: lesson.title,
      minutes: lesson.minutes,
      bunnyVideoId: lesson.bunnyVideoId ?? null,
      inPlan
    }
  })
}

function resolveReading(planId: PlanId): PlannedLesson[] {
  const testChapters = READING_TEST_CHAPTERS_BY_PLAN[planId]
  const course = CATALOG.reading
  if (!course) return []

  return course.lessons.map((lesson) => ({
    course: 'reading' as const,
    id: lesson.id,
    key: lesson.key,
    title: lesson.title,
    minutes: lesson.minutes ?? 0,
    bunnyVideoId: lesson.bunnyVideoId,
    inPlan:
      READING_THEORY_CHAPTERS.includes(lesson.chapterIndex) ||
      testChapters.includes(lesson.chapterIndex)
  }))
}

function resolveByKeys(
  courseId: 'speaking' | 'listening',
  keys: string[] | 'all'
): PlannedLesson[] {
  const course = CATALOG[courseId]
  if (!course) return []
  const allowed = keys === 'all' ? null : new Set(keys)

  return course.lessons.map((lesson) => ({
    course: courseId,
    id: lesson.id,
    key: lesson.key,
    title: lesson.title,
    minutes: lesson.minutes ?? 0,
    bunnyVideoId: lesson.bunnyVideoId,
    inPlan: allowed ? allowed.has(lesson.key) : true
  }))
}

const COURSE_LABEL: Record<CourseId, string> = {
  writing: 'Writing',
  reading: 'Reading',
  speaking: 'Speaking',
  listening: 'Listening',
  grammar: 'Grammar'
}

export function resolvePlan(planId: PlanId): ResolvedPlan {
  const courses = COURSES_BY_PLAN[planId]
  const lessons: PlannedLesson[] = []

  if (courses.includes('writing')) lessons.push(...resolveWriting(planId))
  if (courses.includes('reading')) lessons.push(...resolveReading(planId))
  if (courses.includes('speaking')) lessons.push(...resolveByKeys('speaking', SPEAKING_KEYS_BY_PLAN[planId]))
  if (courses.includes('listening')) lessons.push(...resolveByKeys('listening', LISTENING_KEYS_BY_PLAN[planId]))

  const byCourse: CourseBreakdown[] = courses.map((courseId) => {
    const inCourse = lessons.filter((l) => l.course === courseId)
    const planned = inCourse.filter((l) => l.inPlan)
    return {
      course: courseId,
      label: COURSE_LABEL[courseId],
      plannedLessons: planned.length,
      totalLessons: inCourse.length,
      plannedMinutes: planned.reduce((sum, l) => sum + l.minutes, 0),
      totalMinutes: inCourse.reduce((sum, l) => sum + l.minutes, 0)
    }
  })

  const planned = lessons.filter((l) => l.inPlan)

  return {
    planId,
    lessons,
    byCourse,
    totalMinutes: planned.reduce((sum, l) => sum + l.minutes, 0),
    totalLessons: planned.length
  }
}

/**
 * Whether a deadline is actually survivable at a given daily budget.
 *
 * This exists to stop the planner promising something the content cannot
 * deliver. Telling a student "you'll finish in 14 days" when the maths says 41
 * is the fastest way to lose their trust — and the honest version ("this plan
 * needs 98 min/day; at 60 you'll reach about 61%") is far more useful.
 */
export type FeasibilityVerdict = {
  requiredMinutesPerDay: number
  isFeasible: boolean
  /** Fraction of the plan reachable at the chosen pace, 0–1. */
  reachableFraction: number
  daysNeededAtChosenPace: number
}

export function assessFeasibility(
  plan: ResolvedPlan,
  days: number,
  minutesPerDay: number
): FeasibilityVerdict {
  const safeDays = Math.max(1, days)
  const safeMinutes = Math.max(1, minutesPerDay)
  const requiredMinutesPerDay = Math.ceil(plan.totalMinutes / safeDays)
  const capacity = safeDays * safeMinutes

  return {
    requiredMinutesPerDay,
    isFeasible: capacity >= plan.totalMinutes,
    reachableFraction: Math.min(1, capacity / Math.max(1, plan.totalMinutes)),
    daysNeededAtChosenPace: Math.ceil(plan.totalMinutes / safeMinutes)
  }
}

export const formatHours = (minutes: number): string => `${(minutes / 60).toFixed(1)}h`
