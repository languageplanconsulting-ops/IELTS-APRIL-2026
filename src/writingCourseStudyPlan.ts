// Pure planning logic for the Academic Writing course.
//
// Design: the student's weakness is deliberately NOT an input. Every plan
// walks the same ordered lesson list — tier 1 (core method videos, one per
// question type) always comes first, so full coverage of every question type
// is reached before anything else, no matter how little time the student has.
// Tier 2/3 lessons (second examples, topic-bank practice) extend the plan for
// as long as the student keeps studying. Nothing is ever permanently cut —
// pace only changes how far into tier 2/3 a student gets before exam day.
//
// Pace is set as a cadence ("study every N days") rather than "days per
// week" — it maps onto real calendar dates without a weekday picker, and it's
// literally how a student describes it ("เว้นวัน", "ทุก 2 วัน").
//
// A study day's calendar date is a *target*, not a gate against catching up:
// a day whose date has already arrived is unlocked even if earlier days were
// missed, so a break in study never breaks the plan. A day whose date hasn't
// arrived yet is locked — a student who wants to get ahead has to say so
// explicitly (the "เรียนล่วงหน้า" confirm), so getting ahead is a choice, not
// an accident of clicking around the calendar.

import {
  GRADED_QUESTION_TYPES,
  QUESTION_TYPE_BY_ID,
  WRITING_COURSE_LESSONS,
  WRITING_COURSE_TOTAL_MINUTES,
  type CourseLesson,
  type QuestionTypeId
} from './writingCourseCurriculum'

/**
 * Which lessons the student's plan schedules.
 *
 *   'essentials' — tier 1 only: the one core method video per question type.
 *                  Reaches full coverage of all 10 exam question types in the
 *                  fewest possible minutes. Built for a student with 45 minutes
 *                  and a limited attention budget.
 *   'complete'   — the whole course, tier 1 → 2 → 3, in the taught order.
 *
 * The track NEVER deletes content — an essentials student can still open any
 * lesson from the curriculum browser, and can fold the rest into their plan at
 * any time. It only decides what the calendar schedules and what "100%" means.
 */
export type StudyTrack = 'essentials' | 'complete'

export type WritingCourseOnboarding = {
  /** Study a new day every N calendar days. 1 = every day, 2 = เว้นวัน, 7 = once a week. */
  intervalDays: number
  minutesPerDay: number
  /** ISO yyyy-mm-dd. The date the plan's first study day is scheduled. */
  startDateIso: string
  track: StudyTrack
}

export type StudyTrackMeta = {
  id: StudyTrack
  emoji: string
  label: string
  tagline: string
  bullets: string[]
  defaultIntervalDays: number
  defaultMinutesPerDay: number
  /** Cap on a single session, so the "45 นาที" promise is never quietly broken. */
  maxMinutesPerDay: number
}

export const STUDY_TRACKS: StudyTrackMeta[] = [
  {
    id: 'essentials',
    emoji: '⚡',
    label: 'เอาเฉพาะที่จำเป็น',
    tagline: 'มีเวลาน้อย อยากได้ที่ใช้สอบจริง ๆ',
    bullets: [
      'เฉพาะบทแก่น — ครบทั้ง 10 ชนิดโจทย์ที่ออกสอบ',
      'ครั้งละไม่เกิน 45 นาที ไม่มีบทยาว ๆ',
      'บทเสริมยังเปิดดูได้ทุกเมื่อ ถ้าอยากลงลึกทีหลัง'
    ],
    defaultIntervalDays: 1,
    defaultMinutesPerDay: 45,
    maxMinutesPerDay: 45
  },
  {
    id: 'complete',
    emoji: '📚',
    label: 'เรียนให้ครบทุกบท',
    tagline: 'มีเวลา อยากเข้าใจลึกและเห็นตัวอย่างเยอะ ๆ',
    bullets: [
      'ครบทั้ง 93 บท ตามลำดับที่สอนจริง',
      'ตัวอย่างซ้ำหลายโจทย์ต่อ 1 ชนิด + คลังหัวข้อ',
      'รวมบท Band 7.5+ ไว้ในแผนตั้งแต่ต้น'
    ],
    defaultIntervalDays: 1,
    defaultMinutesPerDay: 90,
    maxMinutesPerDay: 120
  }
]

export const TRACK_BY_ID: Record<StudyTrack, StudyTrackMeta> = STUDY_TRACKS.reduce(
  (map, track) => {
    map[track.id] = track
    return map
  },
  {} as Record<StudyTrack, StudyTrackMeta>
)

export const ONBOARDING_INTERVAL_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'ทุกวัน' },
  { value: 2, label: 'เว้นวัน (ทุก 2 วัน)' },
  { value: 3, label: 'ทุก 3 วัน' },
  { value: 4, label: 'ทุก 4 วัน' },
  { value: 7, label: 'สัปดาห์ละครั้ง' }
]

export const ONBOARDING_MINUTE_OPTIONS: { value: number; label: string }[] = [
  { value: 20, label: '20 นาที' },
  { value: 30, label: '30 นาที' },
  { value: 45, label: '45 นาที' },
  { value: 60, label: '1 ชั่วโมง' },
  { value: 90, label: '1.5 ชั่วโมง' },
  { value: 120, label: '2 ชั่วโมง' }
]

/** Share of a study day's time spent on video (the rest is reserved for writing + review). */
const VIDEO_TIME_SHARE = 0.55

// ---------------------------------------------------------------- dates --
const pad2 = (n: number) => String(n).padStart(2, '0')
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
export const fromIsoDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}
export const addDaysIso = (iso: string, days: number) => {
  const d = fromIsoDate(iso)
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}
export const todayIsoDate = () => toIsoDate(new Date())

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]
export const THAI_WEEKDAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

export const formatThaiDayMonth = (iso: string) => {
  const d = fromIsoDate(iso)
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`
}
export const formatThaiMonthYear = (year: number, monthIndex0: number) => `${THAI_MONTHS[monthIndex0]} ${year}`

// -------------------------------------------------------------- ordering --
/** Tier 1 first (in curriculum order, so question-type coverage lands before anything else), then tier 2/3 by priority. Computed once at module load — the curriculum is static. */
export const ORDERED_LESSONS: CourseLesson[] = (() => {
  const core = WRITING_COURSE_LESSONS.filter((lesson) => lesson.tier === 1)
  const rest = WRITING_COURSE_LESSONS.filter((lesson) => lesson.tier !== 1).sort(
    (a, b) => a.priority - b.priority || a.chapterIndex - b.chapterIndex
  )
  return [...core, ...rest]
})()

/**
 * The lessons a given track actually schedules, in study order. Essentials keeps
 * tier 1 only — one method video per question type — which is what makes a
 * 45-minute-a-day plan finish in weeks instead of months.
 */
export const trackSequence = (track: StudyTrack): CourseLesson[] =>
  track === 'essentials' ? ORDERED_LESSONS.filter((lesson) => lesson.tier === 1) : ORDERED_LESSONS

/** Fast membership test for "is this lesson part of my plan?" — drives the ในแผน / เสริม badges. */
export const trackLessonIds = (track: StudyTrack): Set<string> => new Set(trackSequence(track).map((l) => l.id))

export type TrackSummary = {
  lessonCount: number
  minutes: number
  /** How many of the 10 graded exam question types this track covers. Essentials must still reach all 10. */
  gradedTypesCovered: number
}

export const summarizeTrack = (track: StudyTrack): TrackSummary => {
  const lessons = trackSequence(track)
  const covered = new Set(lessons.map((l) => l.questionType))
  return {
    lessonCount: lessons.length,
    minutes: lessons.reduce((sum, l) => sum + l.minutes, 0),
    gradedTypesCovered: GRADED_QUESTION_TYPES.filter((type) => covered.has(type.id)).length
  }
}

export type CalendarDay = {
  index: number
  dateIso: string
  lessons: CourseLesson[]
  minutes: number
  /** A short writing prompt suggested for this day, derived from the day's dominant question type. Not a full exercise-submission system — just a nudge. */
  writingPrompt: string | null
  /** Emoji of the day's dominant question type, for the calendar thumbnail. */
  thumbnailEmoji: string
  /**
   * True when this day runs past the session length the student asked for. It
   * only happens for a single video longer than the whole budget (some core
   * lessons are 50+ minutes), which we refuse to split across days. Surfaced in
   * the UI rather than hidden — an unannounced 53-minute video is exactly the
   * thing that makes a low-attention student quit.
   */
  isLongSession: boolean
}

const writingPromptFor = (lessons: CourseLesson[]): string | null => {
  const counts = new Map<QuestionTypeId, number>()
  lessons.forEach((lesson) => counts.set(lesson.questionType, (counts.get(lesson.questionType) || 0) + lesson.minutes))
  const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  if (!ranked.length) return null
  const [dominant] = ranked[0]
  const meta = QUESTION_TYPE_BY_ID[dominant]
  if (!meta.isGradedType) return null
  return meta.area === 'task1' ? `เขียน Task 1 โจทย์ ${meta.label} จับเวลา 20 นาที` : `เขียน Task 2 โจทย์ ${meta.label} จับเวลา 40 นาที`
}

const dominantThumbnail = (lessons: CourseLesson[]): string => {
  const counts = new Map<QuestionTypeId, number>()
  lessons.forEach((lesson) => counts.set(lesson.questionType, (counts.get(lesson.questionType) || 0) + (lesson.minutes || 1)))
  const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  return ranked.length ? QUESTION_TYPE_BY_ID[ranked[0][0]].thumbnailEmoji : '📘'
}

/**
 * Packs the ordered lesson list into rolling study-day buckets sized to
 * `minutesPerDay`, then stamps each bucket with a target calendar date
 * spaced `intervalDays` apart starting from `startDateIso`. `includeBand75`
 * decides whether Band-7.5+ lessons are folded into the normal sequence
 * (true) or pushed to the very end as a bonus tier (false) — never dropped,
 * only reordered.
 */
export function buildCalendar(
  onboarding: WritingCourseOnboarding,
  includeBand75: boolean
): CalendarDay[] {
  const { minutesPerDay, intervalDays, startDateIso } = onboarding
  const track = onboarding.track || 'complete'
  const videoBudget = Math.max(10, Math.round(minutesPerDay * VIDEO_TIME_SHARE))
  const ordered = trackSequence(track)
  const sequence = includeBand75
    ? ordered
    : [...ordered.filter((l) => !l.band75Only), ...ordered.filter((l) => l.band75Only)]

  const buckets: CourseLesson[][] = []
  let current: CourseLesson[] = []
  let currentMinutes = 0
  const flush = () => {
    if (!current.length) return
    buckets.push(current)
    current = []
    currentMinutes = 0
  }
  for (const lesson of sequence) {
    if (currentMinutes > 0 && currentMinutes + lesson.minutes > videoBudget) flush()
    current.push(lesson)
    currentMinutes += lesson.minutes
    // A lesson heavier than a full day's budget still gets its own day, alone —
    // never split a single video across two days.
    if (currentMinutes >= videoBudget) flush()
  }
  flush()

  return buckets.map((lessons, index) => {
    const minutes = lessons.reduce((sum, l) => sum + l.minutes, 0)
    return {
      index,
      dateIso: addDaysIso(startDateIso, index * Math.max(1, intervalDays)),
      lessons,
      minutes,
      writingPrompt: writingPromptFor(lessons),
      thumbnailEmoji: dominantThumbnail(lessons),
      isLongSession: minutes > minutesPerDay
    }
  })
}

export function isDayComplete(day: CalendarDay, completedIds: Set<string>): boolean {
  return day.lessons.every((lesson) => completedIds.has(lesson.id))
}

/** A day is locked only by the calendar — its scheduled date hasn't arrived — unless the student explicitly unlocked it ahead of time, or has already completed it (always reviewable). */
export function isDayLocked(day: CalendarDay, todayIso: string, aheadUnlocked: Set<number>, completedIds: Set<string>): boolean {
  if (day.dateIso <= todayIso) return false
  if (aheadUnlocked.has(day.index)) return false
  if (isDayComplete(day, completedIds)) return false
  return true
}

export type TodayPlan = {
  day: CalendarDay | null
  isLocked: boolean
  isCourseComplete: boolean
  daysRemaining: number
}

/**
 * The day "today" recommends: the earliest incomplete day. If that day's
 * date is still in the future (the student is ahead of their own pace),
 * `isLocked` is true and the UI should offer the same ahead-of-schedule
 * confirm as clicking it on the calendar would.
 */
export function findTodayPlan(calendar: CalendarDay[], completedIds: Set<string>, aheadUnlocked: Set<number>): TodayPlan {
  const day = calendar.find((d) => !isDayComplete(d, completedIds)) || null
  const isCourseComplete = !day && calendar.length > 0
  return {
    day,
    isLocked: day ? isDayLocked(day, todayIsoDate(), aheadUnlocked, completedIds) : false,
    isCourseComplete,
    daysRemaining: day ? calendar.length - day.index : 0
  }
}

export function estimateFinishDateIso(calendar: CalendarDay[]): string | null {
  return calendar.length ? calendar[calendar.length - 1].dateIso : null
}

// ------------------------------------------------------------ month grid --
export type MonthGridCell = { dateIso: string; inMonth: boolean; day: CalendarDay | null }

/** A 7-wide grid of weeks for one calendar month (Sunday-first), with study days attached where their scheduled date falls in that month. Leading/trailing cells outside the month are still real dates (for continuity) but flagged `inMonth: false`. */
export function buildMonthGrid(year: number, monthIndex0: number, calendarByDate: Map<string, CalendarDay>): MonthGridCell[][] {
  const firstOfMonth = new Date(year, monthIndex0, 1)
  const startOffset = firstOfMonth.getDay() // 0 = Sunday
  const gridStart = new Date(year, monthIndex0, 1 - startOffset)

  const cells: MonthGridCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    const iso = toIsoDate(d)
    cells.push({ dateIso: iso, inMonth: d.getMonth() === monthIndex0, day: calendarByDate.get(iso) || null })
  }
  // Trim the final week if it's entirely outside the month (keeps short months to 5 rows).
  const weeks: MonthGridCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  while (weeks.length > 4 && weeks[weeks.length - 1].every((c) => !c.inMonth)) weeks.pop()
  return weeks
}

export type OverallProgress = {
  completedLessons: number
  totalLessons: number
  completedMinutes: number
  totalMinutes: number
  percent: number
  /** Lessons finished that sit outside the current plan (an essentials student who wandered into a bonus lesson). Counted, but never inflates the plan percentage past 100. */
  bonusCompleted: number
}

/**
 * Progress against *the student's own plan*, not the whole catalogue. An
 * essentials student who has done 12 of their 41 lessons should read 29%, not
 * 13% of 93 — measuring them against material they deliberately opted out of is
 * demoralising and, for the plan they chose, simply wrong.
 */
export function computeOverallProgress(completedIds: Set<string>, track: StudyTrack = 'complete'): OverallProgress {
  const planLessons = trackSequence(track)
  const planIds = new Set(planLessons.map((l) => l.id))
  const completedInPlan = planLessons.filter((l) => completedIds.has(l.id))
  const completedMinutes = completedInPlan.reduce((sum, l) => sum + l.minutes, 0)
  const totalMinutes = track === 'complete' ? WRITING_COURSE_TOTAL_MINUTES : planLessons.reduce((sum, l) => sum + l.minutes, 0)
  const bonusCompleted = WRITING_COURSE_LESSONS.filter((l) => completedIds.has(l.id) && !planIds.has(l.id)).length
  return {
    completedLessons: completedInPlan.length,
    totalLessons: planLessons.length,
    completedMinutes,
    totalMinutes,
    percent: planLessons.length ? Math.round((completedInPlan.length / planLessons.length) * 100) : 0,
    bonusCompleted
  }
}

export type QuestionTypeProgress = {
  id: QuestionTypeId
  label: string
  area: string
  isGradedType: boolean
  completed: number
  total: number
  isMastered: boolean
}

const AREA_LABEL: Record<string, string> = {
  foundation: 'ไวยากรณ์พื้นฐาน',
  task1: 'Task 1',
  task2: 'Task 2',
  exam: 'ข้อสอบจำลอง'
}

/** The "จุดที่ทำสำเร็จแล้ว" board — one row per question type the real exam can ask, so a student can see at a glance which chart/essay types they've actually touched. */
export function computeQuestionTypeProgress(completedIds: Set<string>, track: StudyTrack = 'complete'): QuestionTypeProgress[] {
  const planIds = trackLessonIds(track)
  return GRADED_QUESTION_TYPES.map((type) => {
    // Mastery is judged against the plan too: for an essentials student, "done
    // with Pie Chart" means the core Pie Chart video, not all five of them.
    const lessons = WRITING_COURSE_LESSONS.filter((l) => l.questionType === type.id && planIds.has(l.id))
    const completed = lessons.filter((l) => completedIds.has(l.id)).length
    return {
      id: type.id,
      label: type.label,
      area: AREA_LABEL[type.area] || type.area,
      isGradedType: type.isGradedType,
      completed,
      total: lessons.length,
      isMastered: lessons.length > 0 && completed === lessons.length
    }
  })
}
