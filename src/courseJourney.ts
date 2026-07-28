// The multi-course layer: what courses exist, which ones the student is enrolled
// in, how they bundle together, and what a single cross-course calendar looks
// like once a pace has been chosen.
//
// Writing is the one course with a hand-authored curriculum (tiers, question
// types, worksheets); the other four come from the migrated Thinkific catalogue.
// Both are flattened to the same `JourneyLesson` shape here so the journey home
// never has to care which is which.

import COURSE_CATALOG from './courseCatalog.json'
import COURSE_CHAPTER_NAMES from './courseChapterNames.json'
import { resolvePlan } from './bundlePlanResolver'
import type { PlanId } from './bundlePlans'
import { WRITING_COURSE_LESSONS } from './writingCourseCurriculum'
import { fromIso, studyDates, toIso, type StudySchedule } from './studySchedule'

export type JourneyCourseId = 'writing' | 'reading' | 'speaking' | 'listening' | 'grammar'

export type JourneyLesson = {
  course: JourneyCourseId
  /** Stable across reloads — `${course}:${key}`, matching the catalogue's own ids. */
  id: string
  title: string
  minutes: number
  bunnyVideoId: string | null
  /** Bunny library the video lives in — differs per course. */
  libraryId: string
  chapterIndex: number
  chapterName: string
}

export type JourneyCourseMeta = {
  id: JourneyCourseId
  label: string
  labelTh: string
  emoji: string
  tagline: string
  /** Drives the card's accent colour, as a CSS custom property. */
  accent: string
  /** The same identity as a soft fill, for cards sitting on the dark calendar. */
  pastel: string
  libraryId: string
  lessonCount: number
  totalMinutes: number
  /** Lessons whose video has finished uploading. */
  readyCount: number
}

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
  bunnyLibrary: string
  lessonCount: number
  chapterCount: number
  totalMinutes: number
  migratedCount: number
  lessons: CatalogLesson[]
}

const CATALOG = COURSE_CATALOG as unknown as Record<string, CatalogCourse>

/**
 * Real chapter titles for the migrated courses.
 *
 * The migration manifests carry a lesson's title but never its chapter's — the
 * chapter survived only as the number inside the key (`c1-l3`). "บทที่ 2" told
 * the student nothing about what was in it, so the names are maintained by hand
 * in courseChapterNames.json and anything missing falls back to the number.
 */
const CHAPTER_NAMES = COURSE_CHAPTER_NAMES as unknown as Record<string, Record<string, string>>

const chapterNameFor = (courseId: JourneyCourseId, chapterIndex: number): string =>
  CHAPTER_NAMES[courseId]?.[String(chapterIndex)] ?? `บทที่ ${chapterIndex + 1}`

/** Bunny Stream library holding the Writing course videos. */
export const WRITING_LIBRARY_ID = '712721'

const catalogLessons = (courseId: Exclude<JourneyCourseId, 'writing'>): JourneyLesson[] => {
  const course = CATALOG[courseId]
  if (!course) return []
  return course.lessons.map((lesson, index) => ({
    course: courseId,
    id: lesson.id,
    // A handful of migrated rows lost their title in the export; a numbered
    // fallback is better than a blank row the student can't identify.
    title: lesson.title?.trim() || `บทเรียนที่ ${index + 1}`,
    minutes: lesson.minutes ?? Math.round((lesson.seconds ?? 0) / 60),
    bunnyVideoId: lesson.bunnyVideoId,
    libraryId: course.bunnyLibrary,
    chapterIndex: lesson.chapterIndex,
    chapterName: chapterNameFor(courseId, lesson.chapterIndex)
  }))
}

const writingLessons = (): JourneyLesson[] =>
  WRITING_COURSE_LESSONS.map((lesson) => ({
    course: 'writing' as const,
    id: lesson.id,
    title: lesson.title,
    minutes: lesson.minutes,
    bunnyVideoId: lesson.bunnyVideoId ?? null,
    libraryId: WRITING_LIBRARY_ID,
    chapterIndex: lesson.chapterIndex,
    chapterName: lesson.chapterName
  }))

/** Built once at module load — every course's lesson list is static data. */
const LESSONS_BY_COURSE: Record<JourneyCourseId, JourneyLesson[]> = {
  writing: writingLessons(),
  reading: catalogLessons('reading'),
  speaking: catalogLessons('speaking'),
  listening: catalogLessons('listening'),
  grammar: catalogLessons('grammar')
}

export const courseLessons = (courseId: JourneyCourseId): JourneyLesson[] => LESSONS_BY_COURSE[courseId] ?? []

const meta = (
  id: JourneyCourseId,
  label: string,
  labelTh: string,
  emoji: string,
  tagline: string,
  accent: string,
  pastel: string,
  libraryId: string
): JourneyCourseMeta => {
  const lessons = courseLessons(id)
  return {
    id,
    label,
    labelTh,
    emoji,
    tagline,
    accent,
    pastel,
    libraryId,
    lessonCount: lessons.length,
    totalMinutes: lessons.reduce((sum, lesson) => sum + lesson.minutes, 0),
    readyCount: lessons.filter((lesson) => lesson.bunnyVideoId).length
  }
}

export const JOURNEY_COURSES: JourneyCourseMeta[] = [
  // Two values per course: a saturated accent for text and bars on white, and a
  // pastel fill for the cards that sit on the dark calendar surface. Same
  // identity, two grounds — a course is recognisable in either.
  meta('writing', 'IELTS Writing', 'เขียน', '✍️', 'Task 1 ครบทุกกราฟ + Task 2 ครบ 4 คำถาม', '#2f6bff', '#c9d5ff', WRITING_LIBRARY_ID),
  meta('reading', 'IELTS Reading', 'อ่าน', '📖', 'เทคนิคครบทุกชนิดคำถาม + ชุดข้อสอบจริง', '#0f9d76', '#d9f2a5', CATALOG.reading?.bunnyLibrary ?? ''),
  meta('listening', 'IELTS Listening', 'ฟัง', '🎧', 'ทริคทีละ Section + ชุดข้อสอบเต็ม', '#d2721c', '#fbe3a8', CATALOG.listening?.bunnyLibrary ?? ''),
  meta('speaking', 'IELTS Speaking', 'พูด', '🗣️', 'Part 1–3 พร้อมคลังหัวข้อที่ออกบ่อย', '#8b48d0', '#edc9fb', CATALOG.speaking?.bunnyLibrary ?? ''),
  meta('grammar', 'English Grammar Foundation', 'แกรมม่า', '🧩', 'ปูพื้นไวยากรณ์ก่อนเริ่มติว IELTS', '#c0396b', '#fbd0e4', CATALOG.grammar?.bunnyLibrary ?? '')
]

export const COURSE_BY_ID: Record<JourneyCourseId, JourneyCourseMeta> = JOURNEY_COURSES.reduce(
  (map, course) => {
    map[course.id] = course
    return map
  },
  {} as Record<JourneyCourseId, JourneyCourseMeta>
)

export type BundleMeta = {
  id: string
  label: string
  tagline: string
  courseIds: JourneyCourseId[]
}

/**
 * Bundles are presentation, not access control: a bundle is simply a named set
 * of courses that were sold together, drawn tied to each other so the student
 * can see at a glance that they belong to one purchase.
 */
export const BUNDLES: BundleMeta[] = [
  {
    id: 'ielts-4skills',
    label: 'IELTS ครบ 4 ทักษะ',
    tagline: 'Writing · Reading · Listening · Speaking — เรียนต่อเนื่องในแผนเดียว',
    courseIds: ['writing', 'reading', 'listening', 'speaking']
  },
  {
    id: 'ielts-plus-grammar',
    label: 'IELTS 4 ทักษะ + ปูพื้นแกรมม่า',
    tagline: 'เพิ่มคอร์สไวยากรณ์พื้นฐานไว้ข้างหน้า สำหรับคนที่ยังไม่มั่นใจโครงสร้างประโยค',
    courseIds: ['writing', 'reading', 'listening', 'speaking', 'grammar']
  }
]

/** The largest bundle fully covered by what the student is enrolled in, if any. */
export function activeBundle(enrolled: Set<JourneyCourseId>): BundleMeta | null {
  const covered = BUNDLES.filter((bundle) => bundle.courseIds.every((id) => enrolled.has(id)))
  if (!covered.length) return null
  return covered.reduce((best, bundle) => (bundle.courseIds.length > best.courseIds.length ? bundle : best))
}

// ------------------------------------------------------------- calendar --

export type JourneyDay = {
  index: number
  /**
   * Identity that survives a reshuffle — the first lesson on the day.
   *
   * `index` is a position, and positions move the moment a student reorders
   * their courses. Anything that has to remember one particular day across a
   * rebuild (an unlocked day, most of all) has to hold onto this instead.
   */
  key: string
  dateIso: string
  /** Each study day draws from one course, so a sitting has one subject. */
  course: JourneyCourseId
  lessons: JourneyLesson[]
  minutes: number
  /** True when a single video is longer than the whole session budget. */
  isLongSession: boolean
}

/**
 * The order the student studies their courses in.
 *
 * `order: null` means the taught order — Writing → Reading → Speaking →
 * Listening — which is the teacher's recommendation and stays the default. But
 * a student three weeks from a test who knows Speaking is their weak paper is
 * right and the plan is wrong, so the order is theirs to rearrange. It is a
 * recommendation, not a gate.
 *
 * `keepWarm` is the difference between switching and abandoning: with it on,
 * the course they were part-way through keeps one session in every five instead
 * of stopping dead, which is the whole reason a half-finished course usually
 * never gets finished.
 */
export type CoursePath = {
  order: JourneyCourseId[] | null
  keepWarm: boolean
}

export const RECOMMENDED_PATH: CoursePath = { order: null, keepWarm: true }

/** Why the taught order is the taught order, in the student's language. */
export const PATH_REASON_TH: Record<JourneyCourseId, string> = {
  grammar: 'ปูพื้นไวยากรณ์ก่อน — ใช้ได้กับทุกพาร์ท',
  writing: 'เริ่มที่เขียน เพราะขยับช้าที่สุด และไวยากรณ์ที่ได้ไปช่วยทุกพาร์ท',
  reading: 'อ่านต่อ เพราะได้คลังคำศัพท์ไปใช้ตอนพูด',
  speaking: 'พูดหลังอ่าน จะมีคำศัพท์พร้อมใช้แล้ว',
  listening: 'ฟังไว้ท้าย เพราะช่วงนั้นคุณจะคุ้นสำเนียงจากคลิปที่ดูมาทั้งคอร์สแล้ว'
}

/**
 * Sessions of the focused course between each session of the warmed one.
 *
 * Four gives one warm session a week at the commonest pace (five a week), which
 * is about the least you can do and still call a course "in progress".
 */
const WARM_EVERY = 4

/**
 * The taught order of the skills, and the reason the calendar has blocks at all.
 *
 * Writing first because it is the slowest skill to move and the one whose
 * grammar work pays into every other paper; Reading next because it feeds the
 * vocabulary Speaking then has to produce; Listening last, being the skill that
 * improves most from exposure the student is getting anyway by then. Grammar
 * sits ahead of everything — it is sold as the pre-IELTS foundation course, so a
 * student who owns it should be through it before Writing starts.
 *
 * Whatever subset a student owns keeps this relative order: writing + listening
 * means Writing first, then Listening.
 */
export const COURSE_ORDER: JourneyCourseId[] = ['grammar', 'writing', 'reading', 'speaking', 'listening']

// ---------------------------------------------------------------- plans --

/**
 * Which lessons a band plan actually schedules, resolved once per plan.
 *
 * The plan definitions already exist (bundlePlans / bundlePlanResolver) and are
 * the considered version — Band 6 takes Task 1 breadth over depth, drops the
 * Task 2 topic bank, keeps the grammar work that carries the 6→7 accuracy gain.
 * The journey just consumes them; it does not get a second opinion.
 */
const PLAN_LESSON_IDS = new Map<PlanId, Set<string>>()

const planLessonIds = (planId: PlanId): Set<string> => {
  const cached = PLAN_LESSON_IDS.get(planId)
  if (cached) return cached
  const ids = new Set(
    resolvePlan(planId)
      .lessons.filter((lesson) => lesson.inPlan)
      .map((lesson) => lesson.id)
  )
  PLAN_LESSON_IDS.set(planId, ids)
  return ids
}

/**
 * The lessons of one course this plan schedules, in taught order.
 *
 * A course the plan says nothing about — Grammar, which is deliberately outside
 * every band plan because it is the separate pre-IELTS foundation course —
 * schedules in full rather than vanishing. A student who owns it bought it to
 * study it.
 */
export function planCourseLessons(courseId: JourneyCourseId, planId: PlanId): JourneyLesson[] {
  const all = courseLessons(courseId)
  const ids = planLessonIds(planId)
  const kept = all.filter((lesson) => ids.has(lesson.id))
  return kept.length ? kept : all
}

/** "47 จาก 93 บท" — what a plan costs in one course, for the course cards. */
export function planCourseCount(courseId: JourneyCourseId, planId: PlanId): { planned: number; total: number; minutes: number } {
  const kept = planCourseLessons(courseId, planId)
  return {
    planned: kept.length,
    total: courseLessons(courseId).length,
    minutes: kept.reduce((sum, lesson) => sum + lesson.minutes, 0)
  }
}

/** Membership set for one course, so a lesson list can badge every row in O(1). */
export const planCourseLessonIds = (courseId: JourneyCourseId, planId: PlanId): Set<string> =>
  new Set(planCourseLessons(courseId, planId).map((lesson) => lesson.id))

export const orderCourses = (courses: JourneyCourseId[]): JourneyCourseId[] =>
  [...courses].sort((a, b) => COURSE_ORDER.indexOf(a) - COURSE_ORDER.indexOf(b))

/**
 * How far a packed session may run over or under the length the student asked
 * for. Lessons are indivisible — a 16-minute video cannot be cut to fit an hour
 * exactly — so the choice is between honouring the number and honouring the
 * content. ±10 minutes keeps "1 ชั่วโมง" meaning roughly an hour (three or four
 * lessons) instead of a timid 48 minutes with a lesson left dangling.
 */
export const SESSION_TOLERANCE_MINUTES = 10

/**
 * One calendar across every enrolled course, scheduled as consecutive blocks in
 * taught order: all of Writing, then all of Reading, and so on.
 *
 * Blocks rather than a round-robin because a student can only really hold one
 * skill at a time, and because "you are in the WRITING block until 3 September"
 * is a thing they can picture. The cost — Listening starting months out — is
 * exactly what the block ribbon in the UI makes visible up front.
 */
export function buildJourneyCalendar(
  enrolled: JourneyCourseId[],
  schedule: StudySchedule,
  planId: PlanId = 'full75',
  /** Progress, so finished days stop consuming future slots. */
  completedIds?: Set<string>,
  /** Injected rather than read, so the same inputs always give the same plan. */
  todayIsoDate?: string,
  /** The student's own course order, when they've rearranged it. */
  path?: CoursePath | null
): JourneyDay[] {
  const queues = orderCourses(enrolled)
    .map((courseId) => ({ courseId, lessons: planCourseLessons(courseId, planId) }))
    .filter((queue) => queue.lessons.length > 0)
  if (!queues.length) return []

  const target = Math.max(10, schedule.minutesPerDay)
  const lower = Math.max(5, target - SESSION_TOLERANCE_MINUTES)
  const upper = target + SESSION_TOLERANCE_MINUTES
  const days: Omit<JourneyDay, 'dateIso' | 'index'>[] = []

  for (const queue of queues) {
    let cursor = 0
    while (cursor < queue.lessons.length) {
      const lessons: JourneyLesson[] = []
      let minutes = 0

      while (cursor < queue.lessons.length) {
        const lesson = queue.lessons[cursor]
        const next = minutes + lesson.minutes
        // Take the lesson if it fits inside the tolerance window. A single video
        // longer than the whole window still gets its own day, alone — never
        // split one video across two sittings.
        if (lessons.length && next > upper) break
        lessons.push(lesson)
        minutes = next
        cursor += 1
        // Close the day once we're inside the window; the next lesson would
        // push it past the upper bound anyway more often than not.
        if (minutes >= lower) break
      }
      if (!lessons.length) break

      days.push({
        key: lessons[0].id,
        course: queue.courseId,
        lessons,
        minutes,
        isLongSession: minutes > upper
      })
    }
  }

  const ordered = applyPath(days, completedIds, path).map((day, index) => ({ ...day, index }))
  return stampDates(ordered, schedule, completedIds, todayIsoDate)
}

/**
 * Re-sorts the remaining study days into the student's own course order.
 *
 * Only *open* days move. Days already finished are history — they happened in
 * the order they happened, and re-sorting them would rewrite the student's past
 * every time they changed their mind. So the finished stretch of Writing stays
 * exactly where it is, and the new order starts from tomorrow.
 *
 * Nothing is ever dropped: a course pushed to the back keeps every one of its
 * remaining days. It waits — or, with keepWarm, threads one day in five through
 * whatever the student put first.
 */
function applyPath(
  days: Omit<JourneyDay, 'dateIso' | 'index'>[],
  completedIds?: Set<string>,
  path?: CoursePath | null
): Omit<JourneyDay, 'dateIso' | 'index'>[] {
  const done = completedIds ?? new Set<string>()
  const isDone = (day: (typeof days)[number]) => day.lessons.every((lesson) => done.has(lesson.id))

  const history = days.filter(isDone)
  const open = days.filter((day) => !isDone(day))
  if (!open.length) return days

  // Where each course sits in the student's order. Anything they didn't place
  // keeps its taught position, after everything they did.
  const rank = new Map<JourneyCourseId, number>()
  if (path?.order?.length) {
    path.order.forEach((courseId, index) => rank.set(courseId, index))
  }
  const rankOf = (courseId: JourneyCourseId) =>
    rank.get(courseId) ?? rank.size + COURSE_ORDER.indexOf(courseId)

  // A stable sort keeps each course's own lessons in taught sequence — only the
  // courses move relative to each other.
  const sorted = path?.order?.length
    ? [...open].sort((a, b) => rankOf(a.course) - rankOf(b.course))
    : open

  const first = sorted[0].course
  const rest = sorted.filter((day) => day.course !== first)
  const firstDays = sorted.filter((day) => day.course === first)

  // The course worth keeping warm is the one the student is genuinely part-way
  // through — furthest along, but not finished, and not the one they just chose
  // to do first. Pausing that is how a 20%-done course becomes a 20%-done course
  // forever.
  const warmCourse = !path?.keepWarm
    ? null
    : (Object.entries(
        rest.reduce<Partial<Record<JourneyCourseId, number>>>((counts, day) => {
          counts[day.course] = (counts[day.course] ?? 0) + 1
          return counts
        }, {})
      )
        .map(([courseId]) => courseId as JourneyCourseId)
        .filter((courseId) => courseLessons(courseId).some((lesson) => done.has(lesson.id)))
        .sort((a, b) => COURSE_ORDER.indexOf(a) - COURSE_ORDER.indexOf(b))[0] ?? null)

  if (!warmCourse) return [...history, ...firstDays, ...rest]

  const warm = rest.filter((day) => day.course === warmCourse)
  const later = rest.filter((day) => day.course !== warmCourse)

  const mixed: typeof days = []
  let warmCursor = 0
  firstDays.forEach((day, index) => {
    mixed.push(day)
    if ((index + 1) % WARM_EVERY === 0 && warmCursor < warm.length) mixed.push(warm[warmCursor++])
  })

  return [...history, ...mixed, ...warm.slice(warmCursor), ...later]
}

/** The course order a path actually produces, for showing it back to the student. */
export function pathOrder(path: CoursePath | null, enrolled: JourneyCourseId[]): JourneyCourseId[] {
  const owned = new Set(enrolled)
  if (!path?.order?.length) return orderCourses(enrolled)
  const chosen = path.order.filter((courseId) => owned.has(courseId))
  const missing = orderCourses(enrolled.filter((courseId) => !chosen.includes(courseId)))
  return [...chosen, ...missing]
}

/**
 * When each course finishes under a given calendar — the numbers a student needs
 * to see *before* they agree to reorder anything.
 *
 * "Speaking moves 11 weeks earlier, Writing 2 weeks later" is a decision someone
 * can actually make. "Are you sure?" is not.
 */
export function courseFinishDates(calendar: JourneyDay[]): Map<JourneyCourseId, string> {
  const finishes = new Map<JourneyCourseId, string>()
  for (const day of calendar) {
    const current = finishes.get(day.course)
    if (!current || day.dateIso > current) finishes.set(day.course, day.dateIso)
  }
  return finishes
}

/**
 * Puts a date on every packed day — and this is where studying ahead actually
 * pays off.
 *
 * Finished days are dated backwards from the plan's start, so they read as
 * history. Everything still open is dated forward from today. A student who
 * binges four days in one sitting therefore sees the remaining plan slide
 * earlier and the finish date move in; one who skips a fortnight sees it move
 * out. A calendar whose end date never moves no matter what you do is a
 * calendar that is not describing your life.
 */
function stampDates(
  days: Omit<JourneyDay, 'dateIso'>[],
  schedule: StudySchedule,
  completedIds?: Set<string>,
  todayIsoDate?: string
): JourneyDay[] {
  if (!completedIds || completedIds.size === 0) {
    const dates = studyDates(schedule, days.length)
    return days.map((day, index) => ({
      ...day,
      dateIso: dates[index] ?? dates[dates.length - 1] ?? schedule.startDateIso
    }))
  }

  const isDone = (day: Omit<JourneyDay, 'dateIso'>) => day.lessons.every((lesson) => completedIds.has(lesson.id))
  const doneCount = days.filter(isDone).length
  const openCount = days.length - doneCount

  const historyDates = studyDates(schedule, doneCount)
  // Never date remaining work before today, and never before the plan starts —
  // a plan that begins next month should not be dragged into this one.
  const resumeFrom = todayIsoDate && todayIsoDate > schedule.startDateIso ? todayIsoDate : schedule.startDateIso
  const openDates = studyDates({ ...schedule, startDateIso: resumeFrom }, openCount)

  let historyCursor = 0
  let openCursor = 0
  return days.map((day) => {
    if (isDone(day)) {
      const dateIso = historyDates[historyCursor++] ?? schedule.startDateIso
      return { ...day, dateIso }
    }
    const dateIso = openDates[openCursor++] ?? openDates[openDates.length - 1] ?? resumeFrom
    return { ...day, dateIso }
  })
}

export const isJourneyDayComplete = (day: JourneyDay, completedIds: Set<string>) =>
  day.lessons.every((lesson) => completedIds.has(lesson.id))

/** One skill's stretch of the calendar — "27 ก.ค. – 3 ก.ย. · WRITING". */
export type JourneyBlock = {
  course: JourneyCourseId
  startIso: string
  endIso: string
  /** Index into the calendar, so a block can be opened at its first day. */
  firstDayIndex: number
  lastDayIndex: number
  days: number
  lessons: number
  minutes: number
  completedLessons: number
  percent: number
  /** Days inside this stretch belonging to a course being kept warm. */
  guestDays: number
  guestCourses: JourneyCourseId[]
}

/**
 * The calendar collapsed into skill blocks — the level the student actually
 * plans at. Days are already grouped by course, so this is a single pass.
 */
export function buildJourneyBlocks(calendar: JourneyDay[], completedIds: Set<string>): JourneyBlock[] {
  const blocks: JourneyBlock[] = []
  for (let i = 0; i < calendar.length; i++) {
    const day = calendar[i]
    const current = blocks[blocks.length - 1]
    const done = day.lessons.filter((lesson) => completedIds.has(lesson.id)).length

    // A single day of another course with the block's own course resuming right
    // after is a kept-warm session, not the start of a new phase. Closing the
    // block on it would shatter a ten-week Speaking stretch into fifteen
    // one-word stations — the rail would stop describing anything.
    if (current && current.course !== day.course && calendar[i + 1]?.course === current.course) {
      current.endIso = day.dateIso
      current.lastDayIndex = day.index
      current.guestDays += 1
      if (!current.guestCourses.includes(day.course)) current.guestCourses.push(day.course)
      continue
    }

    if (current && current.course === day.course) {
      current.endIso = day.dateIso
      current.lastDayIndex = day.index
      current.days += 1
      current.lessons += day.lessons.length
      current.minutes += day.minutes
      current.completedLessons += done
    } else {
      blocks.push({
        course: day.course,
        startIso: day.dateIso,
        endIso: day.dateIso,
        firstDayIndex: day.index,
        lastDayIndex: day.index,
        days: 1,
        lessons: day.lessons.length,
        minutes: day.minutes,
        completedLessons: done,
        percent: 0,
        guestDays: 0,
        guestCourses: []
      })
    }
  }
  return blocks.map((block) => ({
    ...block,
    percent: block.lessons ? Math.round((block.completedLessons / block.lessons) * 100) : 0
  }))
}

/**
 * Locked purely by date — the student may always unlock a future day on purpose.
 *
 * Unlocks are held by day *key*, not position: reordering the courses renumbers
 * every day, and an unlock stored as "day 34" would silently move to whatever
 * lesson happens to land at 34 afterwards.
 */
export const isJourneyDayLocked = (
  day: JourneyDay,
  todayIsoDate: string,
  unlocked: Set<string>,
  completedIds: Set<string>
) => day.dateIso > todayIsoDate && !unlocked.has(day.key) && !isJourneyDayComplete(day, completedIds)

// ------------------------------------------------------- observed pace ----

/**
 * How often the student is *actually* studying, from their completion stamps.
 *
 * A plan set to five days a week and lived at two is a plan whose finish date is
 * a lie, and the finish date is the number they make decisions on. Counting
 * distinct days rather than lessons is deliberate: three lessons in one sitting
 * is one study day, which is what the schedule is measured in.
 *
 * Returns null when there isn't enough signal to be worth acting on — a brand
 * new student has no pace yet, and guessing one would be worse than staying
 * quiet.
 */
export function observedSessionsPerWeek(
  completedAt: Record<string, number>,
  todayIsoDate: string,
  windowDays = 21
): { sessionsPerWeek: number; weekdays: number[]; days: number } | null {
  const cutoff = new Date(fromIso(todayIsoDate))
  cutoff.setDate(cutoff.getDate() - windowDays)
  const cutoffMs = cutoff.getTime()

  const dayStamps = new Map<string, number>()
  for (const stamp of Object.values(completedAt)) {
    // 0 marks a completion that predates timestamping — real, but undateable.
    if (!stamp || stamp < cutoffMs) continue
    const date = new Date(stamp)
    dayStamps.set(toIso(date), date.getDay())
  }

  if (dayStamps.size < 2) return null
  return {
    sessionsPerWeek: (dayStamps.size * 7) / windowDays,
    weekdays: Array.from(new Set(dayStamps.values())).sort((a, b) => a - b),
    days: dayStamps.size
  }
}

/** How far off the plan the student's real pace has drifted, as a fraction. */
export const paceDrift = (planned: number, observed: number) =>
  planned > 0 ? Math.abs(observed - planned) / planned : 0

/** Below this the plan is close enough to the truth to leave alone. */
export const PACE_DRIFT_TOLERANCE = 0.3

export type CourseProgress = {
  course: JourneyCourseId
  completed: number
  total: number
  percent: number
  minutesDone: number
  totalMinutes: number
}

export function courseProgress(courseId: JourneyCourseId, completedIds: Set<string>): CourseProgress {
  const lessons = courseLessons(courseId)
  const done = lessons.filter((lesson) => completedIds.has(lesson.id))
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)
  return {
    course: courseId,
    completed: done.length,
    total: lessons.length,
    percent: lessons.length ? Math.round((done.length / lessons.length) * 100) : 0,
    minutesDone: done.reduce((sum, lesson) => sum + lesson.minutes, 0),
    totalMinutes
  }
}

export const formatHoursTh = (minutes: number): string => {
  if (minutes < 60) return `${minutes} นาที`
  const hours = minutes / 60
  return `${hours >= 10 ? Math.round(hours) : hours.toFixed(1)} ชม.`
}
