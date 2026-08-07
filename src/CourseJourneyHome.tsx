import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './CourseJourneyHome.css'
import {
  advanceWatched,
  buildEmbedUrl,
  formatClock,
  hasWatchedEnough,
  isResumable,
  minutesLeft,
  subscribeToPlaybackPosition,
  watchedPercent,
  type LessonResumeEntry,
  type ResumeMap
} from './lessonResume'
import {
  BUNDLES,
  COURSE_BY_ID,
  JOURNEY_COURSES,
  activeBundle,
  buildJourneyBlocks,
  buildJourneyCalendar,
  courseFinishDates,
  SESSION_TOLERANCE_MINUTES,
  courseLessons,
  courseProgress,
  observedSessionsPerWeek,
  orderCourses,
  paceDrift,
  pathOrder,
  PACE_DRIFT_TOLERANCE,
  PATH_REASON_TH,
  RECOMMENDED_PATH,
  type CoursePath,
  planCourseCount,
  planCourseLessonIds,
  planCourseLessons,
  formatHoursTh,
  isJourneyDayComplete,
  isJourneyDayLocked,
  type JourneyCourseId,
  type JourneyDay,
  type JourneyLesson
} from './courseJourney'
import {
  INTERVAL_OPTIONS,
  MINUTE_OPTIONS,
  WEEKDAYS_TH,
  WEEKDAY_PRESETS,
  addDays,
  defaultSchedule,
  describeSchedule,
  fromIso,
  parseSchedule,
  sessionsPerWeek,
  todayIso,
  toIso,
  type ScheduleMode,
  type StudySchedule
} from './studySchedule'
import { EXAM_HORIZONS, daysUntil, derivePlan, examVerdict } from './examPlan'
import {
  checkPraise,
  checkPrompt,
  dueForReview,
  isRecallSufficient,
  recallShortfall,
  type CheckAnswer,
  type CheckMap
} from './lessonCheck'
import { journeyStorageKey } from './courseStorageKeys'
import { PLANS, PLAN_BY_ID, SKIPPABLE_REASON_TH, type PlanId } from './bundlePlans'

type CourseJourneyHomeProps = {
  learnerEmail: string
  learnerName: string
  onBackHome: () => void
  /** Opens the hand-built Writing course shell (its own sidebar + day plan). */
  onOpenWritingCourse: () => void
  /**
   * Writing keeps its completion state in the course shell, which owns the
   * tier/track logic built on top of it. The journey borrows it rather than
   * keeping a second copy — two stores for one course is how a lesson ends up
   * ticked in one screen and untouched in the other.
   */
  writingCompletedIds: Set<string>
  onToggleWritingLesson: (lessonId: string) => void
}

type JourneyView = { kind: 'home' } | { kind: 'course'; courseId: JourneyCourseId } | { kind: 'lesson'; lessonId: string }

type StoredJourney = {
  schedule: StudySchedule | null
  planId: PlanId
  enrolled: JourneyCourseId[]
  completedIds: string[]
  /**
   * When each lesson was ticked, epoch ms.
   *
   * Separate from completedIds because Writing's completions are owned by the
   * course shell and arrive here as a bare set. 0 means "finished, but before we
   * started keeping time" — real progress, excluded from any pace maths.
   */
  completedAt: Record<string, number>
  /** Day keys — see JourneyDay.key. Older stores held positions; those are dropped. */
  unlockedDays: string[]
  resume: ResumeMap
  path: CoursePath
  /**
   * The exam date, ISO — the one fact the app can't derive and the only thing
   * setup asks for. Null means "no date yet", which is a real answer, not a gap.
   */
  examDateIso: string | null
  /** Retrieval answers, keyed by lesson. See lessonCheck. */
  checks: CheckMap
}

const parseChecks = (raw: unknown): CheckMap => {
  if (!raw || typeof raw !== 'object') return {}
  const out: CheckMap = {}
  for (const [lessonId, value] of Object.entries(raw as Record<string, Partial<CheckAnswer>>)) {
    if (typeof value?.text !== 'string' || !value.text.trim()) continue
    out[lessonId] = {
      text: value.text,
      at: typeof value.at === 'number' ? value.at : 0,
      ...(typeof value.reviewedAt === 'number' ? { reviewedAt: value.reviewedAt } : {})
    }
  }
  return out
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]
const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const THAI_WEEKDAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']

/** "27 / ก.ค." — split so the numeral can be set very large on its own line. */
const bigDateParts = (iso: string) => {
  const d = fromIso(iso)
  return { day: String(d.getDate()), month: THAI_MONTHS_SHORT[d.getMonth()], weekday: THAI_WEEKDAY_NAMES[d.getDay()] }
}

const formatDayMonth = (iso: string) => {
  const d = fromIso(iso)
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`
}


const COURSE_IDS = new Set(JOURNEY_COURSES.map((course) => course.id))

/** Everything is enrolled by default in the admin preview — enrolment moves to the
 *  purchase record later, and this file is the only place that assumption lives. */
const DEFAULT_ENROLLED: JourneyCourseId[] = ['writing', 'reading', 'listening', 'speaking']

/** What a brand-new student gets before they touch the picker. */
const DEFAULT_PLAN: PlanId = 'fast75'

const loadJourney = (email: string): StoredJourney => {
  const empty: StoredJourney = {
    schedule: null,
    planId: DEFAULT_PLAN,
    enrolled: DEFAULT_ENROLLED,
    completedIds: [],
    completedAt: {},
    unlockedDays: [],
    resume: {},
    path: RECOMMENDED_PATH,
    examDateIso: null,
    checks: {}
  }
  if (typeof window === 'undefined') return empty
  try {
    const raw = window.localStorage.getItem(journeyStorageKey(email))
    if (!raw) return empty
    const parsed = JSON.parse(raw)
    const enrolled = Array.isArray(parsed?.enrolled)
      ? parsed.enrolled.filter((id: unknown): id is JourneyCourseId => typeof id === 'string' && COURSE_IDS.has(id as JourneyCourseId))
      : DEFAULT_ENROLLED
    const resume: ResumeMap = {}
    if (parsed?.resume && typeof parsed.resume === 'object') {
      for (const [lessonId, value] of Object.entries(parsed.resume as Record<string, Partial<LessonResumeEntry>>)) {
        if (typeof value?.seconds !== 'number' || value.seconds < 0) continue
        resume[lessonId] = {
          seconds: Math.floor(value.seconds),
          duration: typeof value.duration === 'number' && value.duration > 0 ? Math.floor(value.duration) : 0,
          updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : 0
        }
      }
    }
    const completedIds = Array.isArray(parsed?.completedIds)
      ? parsed.completedIds.filter((id: unknown): id is string => typeof id === 'string')
      : []

    // Completions ticked before this field existed are kept, stamped 0 — they
    // are real progress, they just can't be dated, so the pace maths skips them
    // rather than pretending they all happened today.
    const completedAt: Record<string, number> = {}
    const storedAt = parsed?.completedAt
    for (const id of completedIds) {
      const stamp = storedAt && typeof storedAt === 'object' ? (storedAt as Record<string, unknown>)[id] : undefined
      completedAt[id] = typeof stamp === 'number' && stamp > 0 ? stamp : 0
    }

    const storedOrder = Array.isArray(parsed?.path?.order)
      ? parsed.path.order.filter((id: unknown): id is JourneyCourseId => typeof id === 'string' && COURSE_IDS.has(id as JourneyCourseId))
      : null

    return {
      schedule: parseSchedule(parsed?.schedule),
      // Plans saved before the picker existed scheduled every lesson, so the
      // full course is the reading that leaves their calendar untouched.
      planId: PLANS.some((plan) => plan.id === parsed?.planId) ? (parsed.planId as PlanId) : 'full75',
      enrolled,
      completedIds,
      completedAt,
      // Unlocks used to be stored as calendar positions, which stop meaning
      // anything once the student can reorder their courses. Old numeric entries
      // are dropped: re-tapping a day is one tap, unlocking the wrong lesson is
      // a bug the student can't see.
      unlockedDays: Array.isArray(parsed?.unlockedDays)
        ? parsed.unlockedDays.filter((key: unknown): key is string => typeof key === 'string')
        : [],
      resume,
      path: {
        order: storedOrder?.length ? storedOrder : null,
        keepWarm: parsed?.path?.keepWarm !== false
      },
      examDateIso: typeof parsed?.examDateIso === 'string' ? parsed.examDateIso : null,
      checks: parseChecks(parsed?.checks)
    }
  } catch {
    return empty
  }
}

export function CourseJourneyHome({
  learnerEmail,
  learnerName,
  onBackHome,
  onOpenWritingCourse,
  writingCompletedIds,
  onToggleWritingLesson
}: CourseJourneyHomeProps) {
  const initial = useMemo(() => loadJourney(learnerEmail), [learnerEmail])

  const [schedule, setSchedule] = useState<StudySchedule | null>(initial.schedule)
  const [enrolled, setEnrolled] = useState<JourneyCourseId[]>(initial.enrolled)
  const [planId, setPlanId] = useState<PlanId>(initial.planId)
  /** Non-Writing completions only — Writing's live in the course shell. */
  const [otherCompletedIds, setOtherCompletedIds] = useState<Set<string>>(() => new Set(initial.completedIds))
  /** When each lesson was ticked — the only record of how fast this student really moves. */
  const [completedAt, setCompletedAt] = useState<Record<string, number>>(initial.completedAt)
  const [unlockedDays, setUnlockedDays] = useState<Set<string>>(() => new Set(initial.unlockedDays))
  const [path, setPath] = useState<CoursePath>(initial.path)
  const [resume, setResume] = useState<ResumeMap>(initial.resume)
  const [view, setView] = useState<JourneyView>({ kind: 'home' })
  const [autoplayLessonId, setAutoplayLessonId] = useState<string | null>(null)
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null)
  /** When the exam is. Setup's only question; everything else is derived from it. */
  const [examDateIso, setExamDateIso] = useState<string | null>(initial.examDateIso)
  /** Retrieval answers — see lessonCheck. The record that progress is real. */
  const [checks, setChecks] = useState<CheckMap>(initial.checks)

  // The planner edits a draft, so a half-finished change never reshuffles the
  // calendar underneath the student while they are still choosing.
  const [draft, setDraft] = useState<StudySchedule>(() => initial.schedule ?? defaultSchedule())
  /**
   * The settings drawer.
   *
   * Closed by default and closed for first-timers too. Pace, plan depth, course
   * list and course order are all authoring surfaces: a student opens this page
   * to study, and every one of those questions has a defensible answer already.
   */
  const [planOpen, setPlanOpen] = useState(false)
  /** Which panel of the drawer is showing — one at a time, not a wall of four. */
  const [planTab, setPlanTab] = useState<'pace' | 'courses' | 'order' | 'calendar'>('pace')

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        journeyStorageKey(learnerEmail),
        JSON.stringify({
          schedule,
          planId,
          enrolled,
          completedIds: Array.from(otherCompletedIds),
          completedAt,
          unlockedDays: Array.from(unlockedDays),
          resume,
          path,
          examDateIso,
          checks
        })
      )
    } catch {
      // Storage full or blocked — the plan just won't survive a reload.
    }
  }, [learnerEmail, schedule, planId, enrolled, otherCompletedIds, completedAt, unlockedDays, resume, path, examDateIso, checks])

  /** What every screen below reads: both stores, merged, never written to directly. */
  const completedIds = useMemo(
    () => new Set([...otherCompletedIds, ...writingCompletedIds]),
    [otherCompletedIds, writingCompletedIds]
  )

  // Writing is ticked in its own course shell, so completions can appear here
  // without passing through this screen's own toggle. Stamping whatever turns up
  // unstamped is what keeps the pace reading honest across both stores.
  //
  // The first pass is the exception: anything already ticked when the screen
  // opens was finished at some unknown time in the past, and dating it "now"
  // would invent a study day that never happened. Those get 0 — real, undated,
  // ignored by the pace maths.
  const seenCompletions = useRef(false)
  useEffect(() => {
    const backfilling = !seenCompletions.current
    seenCompletions.current = true
    setCompletedAt((prev) => {
      let changed = false
      const next = { ...prev }
      for (const id of completedIds) {
        if (next[id] === undefined) {
          next[id] = backfilling ? 0 : Date.now()
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [completedIds])

  const today = todayIso()
  const effectiveSchedule = schedule ?? draft
  const calendar = useMemo(
    () => buildJourneyCalendar(enrolled, effectiveSchedule, planId, completedIds, today, path),
    [enrolled, effectiveSchedule, planId, completedIds, today, path]
  )
  const todayDay = useMemo(() => calendar.find((day) => !isJourneyDayComplete(day, completedIds)) ?? null, [calendar, completedIds])

  /**
   * The calendar the *draft* would produce, which is what the planner's estimate
   * has to report.
   *
   * The live calendar is built from the saved plan, so quoting it inside an open
   * planner froze "ครั้งทั้งหมด" and "คาดว่าจะจบ" at the old pace while the
   * per-week figures moved with every tap — the planner contradicted itself, and
   * the finish date, the one number a student is actually shopping for, was the
   * one that lied. Both now come from the same draft.
   */
  const draftCalendar = useMemo(
    () => buildJourneyCalendar(enrolled, draft, planId, completedIds, today),
    [enrolled, draft, planId, completedIds, today]
  )
  const draftFinishIso = draftCalendar.length ? draftCalendar[draftCalendar.length - 1].dateIso : null

  /** Rebuilds the calendar for a candidate order, so the path editor can price it. */
  const buildWith = useCallback(
    (candidate: CoursePath) => buildJourneyCalendar(enrolled, effectiveSchedule, planId, completedIds, today, candidate),
    [enrolled, effectiveSchedule, planId, completedIds, today]
  )

  const studyOrder = useMemo(() => pathOrder(path, enrolled), [path, enrolled])

  /**
   * Whether the plan's pace still describes this student.
   *
   * Only offered once the drift is big enough to move the finish date in a way
   * they'd notice — a plan nudged every week for noise is a plan nobody trusts.
   */
  const [paceDismissed, setPaceDismissed] = useState(false)
  const paceAdvice = useMemo(() => {
    if (paceDismissed || !schedule) return null
    const observed = observedSessionsPerWeek(completedAt, today)
    if (!observed) return null
    return paceDrift(sessionsPerWeek(schedule), observed.sessionsPerWeek) > PACE_DRIFT_TOLERANCE ? observed : null
  }, [paceDismissed, schedule, completedAt, today])

  const lessonById = useMemo(() => {
    const map = new Map<string, JourneyLesson>()
    JOURNEY_COURSES.forEach((course) => courseLessons(course.id).forEach((lesson) => map.set(lesson.id, lesson)))
    return map
  }, [])

  const enrolledSet = useMemo(() => new Set(enrolled), [enrolled])
  const bundle = useMemo(() => activeBundle(enrolledSet), [enrolledSet])

  const openLesson = (lessonId: string, options?: { autoplay?: boolean; restart?: boolean }) => {
    if (options?.restart) {
      setResume((prev) => {
        if (!prev[lessonId]) return prev
        const next = { ...prev }
        delete next[lessonId]
        return next
      })
    }
    setAutoplayLessonId(options?.autoplay ? lessonId : null)
    setView({ kind: 'lesson', lessonId })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const recordPosition = useCallback((lessonId: string, seconds: number, duration: number) => {
    setResume((prev) => {
      const previous = prev[lessonId]
      if (previous && previous.seconds === seconds && previous.duration === duration) return prev
      // advanceWatched, not a bare write: this is where "watched" stops being
      // the learner's word for it and becomes something the app measured.
      return { ...prev, [lessonId]: advanceWatched(previous, seconds, duration) }
    })
  }, [])

  const toggleComplete = (lessonId: string) => {
    const wasDone = completedIds.has(lessonId)
    setCompletedAt((prev) => {
      if (wasDone) {
        if (prev[lessonId] === undefined) return prev
        const next = { ...prev }
        delete next[lessonId]
        return next
      }
      return { ...prev, [lessonId]: Date.now() }
    })

    if (lessonById.get(lessonId)?.course === 'writing') {
      onToggleWritingLesson(lessonId)
      return
    }
    setOtherCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }

  /**
   * The only route to "done": the learner has watched it and just written down
   * what it was for, from memory.
   *
   * Keeping the recall and the tick in one call is deliberate — it means there
   * is no code path that marks a lesson complete without an answer behind it,
   * so every percentage on this page has something under it.
   */
  const completeWithRecall = (lessonId: string, text: string) => {
    setChecks((prev) => ({ ...prev, [lessonId]: { text: text.trim(), at: Date.now() } }))
    if (!completedIds.has(lessonId)) toggleComplete(lessonId)
  }

  /** A second (or third) pass at a lesson's recall, days later. */
  const recordReview = (lessonId: string, text: string) => {
    setChecks((prev) => {
      const previous = prev[lessonId]
      if (!previous) return prev
      return { ...prev, [lessonId]: { ...previous, text: text.trim(), reviewedAt: Date.now() } }
    })
  }

  /**
   * "Later" — pushed to the next interval, with the answer untouched.
   *
   * Deliberately not recordReview('') : an empty text is dropped on reload, so
   * skipping a review would quietly destroy what they wrote the first time.
   */
  const deferReview = (lessonId: string) => {
    setChecks((prev) => {
      const previous = prev[lessonId]
      if (!previous) return prev
      return { ...prev, [lessonId]: { ...previous, reviewedAt: Date.now() } }
    })
  }

  /** Un-ticking a lesson takes its recall with it, so the two never disagree. */
  const undoComplete = (lessonId: string) => {
    setChecks((prev) => {
      if (!prev[lessonId]) return prev
      const next = { ...prev }
      delete next[lessonId]
      return next
    })
    toggleComplete(lessonId)
  }

  /**
   * Setup's whole output.
   *
   * One answer in, a complete plan out — depth, session length, which days,
   * start date — so nobody has to visit four controls to begin.
   */
  const applyExamDate = (iso: string | null) => {
    const derived = derivePlan(enrolled, iso ? daysUntil(iso, today) : null, today)
    setExamDateIso(iso)
    setPlanId(derived.planId)
    setSchedule(derived.schedule)
    setDraft(derived.schedule)
  }

  const toggleEnrolled = (courseId: JourneyCourseId) => {
    setEnrolled((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const savePlan = () => {
    setSchedule(draft)
  }

  // ------------------------------------------------------------- lesson --
  if (view.kind === 'lesson') {
    const lesson = lessonById.get(view.lessonId)
    if (lesson) {
      return (
        <JourneyLessonView
          lesson={lesson}
          isDone={completedIds.has(lesson.id)}
          resumeEntry={resume[lesson.id]}
          autoplay={autoplayLessonId === lesson.id}
          completedIds={completedIds}
          resume={resume}
          planId={planId}
          enrolled={enrolled}
          bundleLabel={bundle?.label ?? null}
          savedRecall={checks[lesson.id]?.text ?? ''}
          onRecordPosition={(seconds, duration) => recordPosition(lesson.id, seconds, duration)}
          onCompleteWithRecall={(text) => completeWithRecall(lesson.id, text)}
          onUndoComplete={() => undoComplete(lesson.id)}
          onRevise={() => openLesson(lesson.id, { autoplay: true, restart: true })}
          onBack={() => setView({ kind: 'course', courseId: lesson.course })}
          onOpenCourse={(courseId) => setView({ kind: 'course', courseId })}
          onHome={() => setView({ kind: 'home' })}
          nextLesson={(() => {
            const list = courseLessons(lesson.course)
            const at = list.findIndex((l) => l.id === lesson.id)
            return at >= 0 && at < list.length - 1 ? list[at + 1] : null
          })()}
          onOpenLesson={openLesson}
        />
      )
    }
  }

  // ------------------------------------------------------- course detail --
  if (view.kind === 'course') {
    return (
      <CourseDetailView
        courseId={view.courseId}
        planId={planId}
        completedIds={completedIds}
        resume={resume}
        isEnrolled={enrolledSet.has(view.courseId)}
        isFirst={studyOrder[0] === view.courseId}
        onEnrol={() => toggleEnrolled(view.courseId)}
        onStudyFirst={() => {
          const courseId = view.courseId
          setPath((prev) => ({ ...prev, order: [courseId, ...studyOrder.filter((id) => id !== courseId)] }))
          // Straight back to the calendar: the answer to "what did that do?" is
          // the reshuffled plan, and it's better shown than described.
          setView({ kind: 'home' })
          if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onOpenLesson={openLesson}
        onBack={() => setView({ kind: 'home' })}
        onOpenWritingCourse={onOpenWritingCourse}
      />
    )
  }

  // --------------------------------------------------------------- home --

  /**
   * Opening a day that isn't due yet.
   *
   * This used to raise a modal asking whether the student was sure they wanted
   * to study. They are sure — they tapped a study day. The plan still shifts up
   * behind them, which is the only thing the dialog was really announcing, and
   * the day card says so in a line once they're there.
   */
  const openDay = (day: JourneyDay) => {
    if (isJourneyDayLocked(day, today, unlockedDays, completedIds)) {
      setUnlockedDays((prev) => new Set(prev).add(day.key))
    }
    setOpenDayIndex(day.index)
  }

  const finishIso = calendar.length ? calendar[calendar.length - 1].dateIso : null
  const verdict = examVerdict(finishIso, examDateIso)
  /** One lesson whose recall is due again — never a queue. See lessonCheck. */
  const reviewLessonId = useMemo(() => dueForReview(checks, Date.now()), [checks, today])
  const reviewLesson = reviewLessonId ? lessonById.get(reviewLessonId) ?? null : null

  // Setup is a gate, not a step. With no schedule there is nothing honest to
  // render below it — the old page built the whole calendar from an unsaved
  // draft and then offered a button called "create my calendar", so the primary
  // action of the page changed nothing the student could see.
  if (!schedule) {
    return (
      <div className="cjPage cjPage-setup">
        <header className="cjTopBar">
          <button type="button" className="cjBack" onClick={onBackHome}>
            ← กลับหน้าหลัก
          </button>
          <span className="cjTopBarLabel">คอร์สของฉัน</span>
        </header>
        <ExamSetup learnerName={learnerName} enrolled={enrolled} today={today} onChoose={applyExamDate} />
      </div>
    )
  }

  return (
    <div className="cjPage">
      <header className="cjTopBar">
        <button type="button" className="cjBack" onClick={onBackHome}>
          ← กลับหน้าหลัก
        </button>
        <span className="cjTopBarLabel">คอร์สของฉัน</span>
      </header>

      <div className="cjHead">
        <p className="cjKicker">สวัสดี {learnerName || 'นักเรียน'}</p>
        <h1>วันนี้เรียนอะไร</h1>
      </div>

      {/* The plan measuring itself against reality, before anything below it
          quotes a finish date built on a pace the student isn't keeping. */}
      {paceAdvice && (
        <PaceCheck
          schedule={effectiveSchedule}
          observed={paceAdvice}
          onAccept={() => {
            const next = scheduleFromObserved(effectiveSchedule, paceAdvice)
            setSchedule(next)
            setDraft(next)
            setPaceDismissed(true)
          }}
          onDismiss={() => setPaceDismissed(true)}
        />
      )}

      {/* The page. Not a section of it — everything below is either a
          consequence of this card or a setting that produced it. */}
      {calendar.length === 0 ? (
        <p className="cjEmpty">
          ยังไม่มีคอร์สในแผน — เปิด “แผนของฉัน” ด้านล่างแล้วเพิ่มคอร์ส ปฏิทินจะขึ้นให้เอง
        </p>
      ) : (
        <TodayCard
          day={openDayIndex !== null ? calendar[openDayIndex] ?? todayDay : todayDay}
          today={today}
          completedIds={completedIds}
          resume={resume}
          isPinned={openDayIndex !== null}
          onUnpin={() => setOpenDayIndex(null)}
          onOpenLesson={openLesson}
        />
      )}

      {/* Spaced retrieval: one lesson from days ago, recalled again before it
          decays. Placed under today's work rather than above it — the day's
          lesson is the commitment, this is the top-up. */}
      {reviewLesson && (
        <ReviewCard
          key={reviewLesson.id}
          lesson={reviewLesson}
          previous={checks[reviewLesson.id]}
          onSubmit={(text) => recordReview(reviewLesson.id, text)}
          onSkip={() => deferReview(reviewLesson.id)}
          onOpenLesson={() => openLesson(reviewLesson.id)}
        />
      )}

      {calendar.length > 0 && (
        <UpNext
          calendar={calendar}
          today={today}
          shownIndex={(openDayIndex !== null ? calendar[openDayIndex] : todayDay)?.index ?? -1}
          completedIds={completedIds}
          unlockedDays={unlockedDays}
          onOpenDay={openDay}
        />
      )}

      {/* Every authoring surface the page has, folded into one line and one
          disclosure. Pace, depth, which courses and what order all have a
          defensible answer already; none of them is a question a student should
          have to answer before they can press play. */}
      <PlanBar
        planId={planId}
        schedule={schedule}
        sessionCount={calendar.length}
        finishIso={finishIso}
        examDateIso={examDateIso}
        verdict={verdict}
        isOpen={planOpen}
        onToggle={() => setPlanOpen((v) => !v)}
      />

      {planOpen && (
        <div className="cjDrawer">
          <div className="cjDrawerTabs" role="tablist" aria-label="ส่วนของแผน">
            {(
              [
                { id: 'pace', label: 'เวลาเรียน' },
                { id: 'courses', label: 'คอร์สในแผน' },
                { id: 'order', label: 'ลำดับคอร์ส' },
                { id: 'calendar', label: 'ปฏิทินทั้งหมด' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`cjTab-${tab.id}`}
                aria-selected={planTab === tab.id}
                aria-controls="cjDrawerPanel"
                className={`cjDrawerTab ${planTab === tab.id ? 'is-on' : ''}`}
                onClick={() => setPlanTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="cjDrawerPanel" id="cjDrawerPanel" role="tabpanel" aria-labelledby={`cjTab-${planTab}`}>
            {planTab === 'pace' && (
              <PaceControls
                draft={draft}
                setDraft={setDraft}
                planId={planId}
                onPickPlan={setPlanId}
                saved={schedule}
                examDateIso={examDateIso}
                onSetExamDate={applyExamDate}
                onSave={savePlan}
                onCancel={() => setDraft(schedule ?? defaultSchedule())}
                sessionCount={draftCalendar.length}
                finishIso={draftFinishIso}
              />
            )}
            {planTab === 'courses' && (
              <CoursesSection
                enrolled={enrolled}
                order={studyOrder}
                planId={planId}
                bundleLabel={bundle?.label ?? null}
                bundleTagline={bundle?.tagline ?? null}
                completedIds={completedIds}
                onToggleEnrolled={toggleEnrolled}
                onOpenCourse={(courseId) => setView({ kind: 'course', courseId })}
              />
            )}
            {planTab === 'order' && (
              <PathSection
                enrolled={enrolled}
                path={path}
                completedIds={completedIds}
                buildWith={buildWith}
                onSave={setPath}
              />
            )}
            {planTab === 'calendar' && (
              <FullCalendar
                calendar={calendar}
                today={today}
                shownIndex={(openDayIndex !== null ? calendar[openDayIndex] : todayDay)?.index ?? -1}
                completedIds={completedIds}
                unlockedDays={unlockedDays}
                onOpenDay={(day) => {
                  openDay(day)
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================== setup =====

/**
 * The whole of onboarding.
 *
 * One question, because there is exactly one fact a new student has that the app
 * doesn't: when they sit the test. Target band, session length, study days and
 * start date are all derivable from it against the content they own (see
 * examPlan), and every one of them stays editable afterwards — this just means
 * nobody has to answer four questions to watch their first video.
 */
function ExamSetup({
  learnerName,
  enrolled,
  today,
  onChoose
}: {
  learnerName: string
  enrolled: JourneyCourseId[]
  today: string
  onChoose: (examIso: string | null) => void
}) {
  const [customIso, setCustomIso] = useState('')

  return (
    <section className="cjSetup">
      <p className="cjKicker">สวัสดี {learnerName || 'นักเรียน'}</p>
      <h1>สอบ IELTS เมื่อไหร่?</h1>
      <p className="cjLede">
        ตอบข้อเดียว แล้วเราจัดที่เหลือให้ — ว่าต้องเรียนบทไหน วันละกี่นาที สัปดาห์ละกี่วัน
        ปรับเองทีหลังได้ทุกอย่าง
      </p>

      <div className="cjSetupPick" role="group" aria-label="อีกนานแค่ไหนจะสอบ">
        {EXAM_HORIZONS.map((horizon) => {
          const iso = horizon.days === null ? null : addDays(today, horizon.days)
          const derived = derivePlan(enrolled, horizon.days, today)
          return (
            <button key={horizon.id} type="button" className="cjSetupCard" onClick={() => onChoose(iso)}>
              <b>{horizon.label}</b>
              <small>
                {PLAN_BY_ID[derived.planId].labelTh} · {describeSchedule(derived.schedule)}
              </small>
              {derived.tight && <span className="cjSetupTight">เวลาน้อย — จะจัดเฉพาะบทแกนให้ก่อน</span>}
            </button>
          )
        })}
      </div>

      <div className="cjSetupExact">
        <label htmlFor="cjExamDate">รู้วันสอบแน่นอนแล้ว</label>
        <input
          id="cjExamDate"
          type="date"
          className="cjDateInput"
          min={today}
          value={customIso}
          onChange={(event) => setCustomIso(event.target.value)}
        />
        <button
          type="button"
          className="cjBtn cjBtn-primary"
          disabled={!customIso}
          onClick={() => customIso && onChoose(customIso)}
        >
          ใช้วันนี้เป็นวันสอบ
        </button>
      </div>
    </section>
  )
}

// ======================================================== pace controls =====

function PaceControls({
  draft,
  setDraft,
  planId,
  onPickPlan,
  saved,
  examDateIso,
  onSetExamDate,
  onSave,
  onCancel,
  sessionCount,
  finishIso
}: {
  draft: StudySchedule
  setDraft: (next: StudySchedule) => void
  planId: PlanId
  onPickPlan: (next: PlanId) => void
  saved: StudySchedule
  examDateIso: string | null
  /** Re-derives the whole plan from a new exam date, the way setup did. */
  onSetExamDate: (iso: string | null) => void
  onSave: () => void
  onCancel: () => void
  sessionCount: number
  finishIso: string | null
}) {
  const setMode = (mode: ScheduleMode) => setDraft({ ...draft, mode })
  const toggleWeekday = (value: number) => {
    const has = draft.weekdays.includes(value)
    const next = has ? draft.weekdays.filter((d) => d !== value) : [...draft.weekdays, value]
    // Never allow zero days — a schedule with no days can't produce a calendar.
    setDraft({ ...draft, weekdays: next.length ? next : draft.weekdays })
  }

  const perWeek = sessionsPerWeek(draft)
  const minutesPerWeek = Math.round(perWeek * draft.minutesPerDay)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const verdict = examVerdict(finishIso, examDateIso)

  return (
    <div className="cjPlanner">
      {/* The exam date still comes first, because changing it re-derives
          everything below — the same single answer setup ran on. */}
      <div className="cjField cjField-first">
        <h3>
          วันสอบ
          <span className="cjHint">เปลี่ยนวันสอบแล้วเราจะจัดแผนใหม่ให้ทั้งชุด</span>
        </h3>
        <div className="cjChipRow">
          <input
            type="date"
            className="cjDateInput"
            aria-label="วันสอบ"
            value={examDateIso ?? ''}
            onChange={(event) => onSetExamDate(event.target.value || null)}
          />
          {examDateIso && (
            <button type="button" className="cjChip" onClick={() => onSetExamDate(null)}>
              ยังไม่กำหนดวันสอบ
            </button>
          )}
        </div>
      </div>

      {/* Target band: it decides WHICH lessons get scheduled, and every number
          below it — sessions, hours per week, finish date — is downstream of
          that choice. Asking for pace before purpose would be the wrong way
          round. */}
      <div className="cjField">
        <h3>
          ตั้งเป้าไว้ที่แบนด์ไหน?
          <span className="cjHint">ทุกแผนเปิดดูได้ครบทุกบท — แผนแค่ตัดสินว่าบทไหนถูกจัดลงปฏิทินให้</span>
        </h3>
        <div className="cjPlanPick">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`cjPlanCard ${planId === plan.id ? 'is-active' : ''}`}
              aria-pressed={planId === plan.id}
              onClick={() => onPickPlan(plan.id)}
            >
              <span className="cjPlanTop">
                <b>{plan.labelTh}</b>
                {planId === plan.id && <span className="cjPlanCheck" aria-hidden="true">✓</span>}
              </span>
              <span className="cjPlanTagline">{plan.tagline}</span>
              <ul className="cjPlanBullets">
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <div className="cjField">
        <h3>
          เรียนครั้งละกี่นาที?
          <span className="cjHint">
            คลิปแบ่งครึ่งไม่ได้ ระบบจะจัดให้ใกล้เคียงที่สุด บวกลบได้ไม่เกิน {SESSION_TOLERANCE_MINUTES} นาที
          </span>
        </h3>
        <div className="cjChipRow">
          {MINUTE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`cjChip ${draft.minutesPerDay === option.value ? 'is-active' : ''}`}
              aria-pressed={draft.minutesPerDay === option.value}
              onClick={() => setDraft({ ...draft, minutesPerDay: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cjField">
        <h3>เรียนวันไหนบ้าง?</h3>
        {/* A radiogroup, not a tablist: `role="tab"` promises a `tabpanel` and
            arrow-key navigation, neither of which was ever here. These are two
            mutually exclusive choices, which is exactly what `radio` means. */}
        <div className="cjModeRow" role="radiogroup" aria-label="รูปแบบการจัดวันเรียน">
          <button
            type="button"
            role="radio"
            aria-checked={draft.mode === 'interval'}
            className={`cjModeBtn ${draft.mode === 'interval' ? 'is-active' : ''}`}
            onClick={() => setMode('interval')}
          >
            <b>เรียนทุก ๆ กี่วัน</b>
            <small>ทุกวัน / วันเว้นวัน / ทุก 3 วัน</small>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={draft.mode === 'weekdays'}
            className={`cjModeBtn ${draft.mode === 'weekdays' ? 'is-active' : ''}`}
            onClick={() => setMode('weekdays')}
          >
            <b>เลือกวันเอง</b>
            <small>เช่น จันทร์ ศุกร์ เสาร์</small>
          </button>
        </div>

        {draft.mode === 'interval' ? (
          <div className="cjChipRow">
            {INTERVAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`cjChip ${draft.intervalDays === option.value ? 'is-active' : ''}`}
                aria-pressed={draft.intervalDays === option.value}
                onClick={() => setDraft({ ...draft, intervalDays: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="cjDayPick" role="group" aria-label="เลือกวันที่จะเรียน">
              {WEEKDAYS_TH.map((day) => {
                const on = draft.weekdays.includes(day.value)
                return (
                  <button
                    key={day.value}
                    type="button"
                    className={`cjDayBtn ${on ? 'is-active' : ''}`}
                    aria-pressed={on}
                    aria-label={`วัน${day.long}`}
                    onClick={() => toggleWeekday(day.value)}
                  >
                    {day.short}
                  </button>
                )
              })}
            </div>
            <div className="cjPresetRow">
              {WEEKDAY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="cjPreset"
                  onClick={() => setDraft({ ...draft, weekdays: preset.days })}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="cjField">
        <h3>เริ่มวันไหน?</h3>
        <div className="cjChipRow">
          {[
            { label: 'วันนี้', iso: todayIso() },
            { label: 'พรุ่งนี้', iso: addDays(todayIso(), 1) },
            { label: 'จันทร์หน้า', iso: nextMondayIso() }
          ].map((option) => (
            <button
              key={option.iso}
              type="button"
              className={`cjChip ${draft.startDateIso === option.iso ? 'is-active' : ''}`}
              aria-pressed={draft.startDateIso === option.iso}
              onClick={() => setDraft({ ...draft, startDateIso: option.iso })}
            >
              {option.label}
            </button>
          ))}
          <input
            type="date"
            className="cjDateInput"
            value={draft.startDateIso}
            aria-label="เลือกวันเริ่มเรียนเอง"
            onChange={(e) => e.target.value && setDraft({ ...draft, startDateIso: e.target.value })}
          />
        </div>
      </div>

      {/* The consequence, as one sentence.
          Four equal tiles gave "sessions per week" — a number the student had
          just chosen — the same weight as the finish date, which is the only one
          they are shopping for. And a finish date alone is a fact about the
          course; against the exam date it becomes a fact about them. */}
      <p className="cjOutcome">
        เรียนสัปดาห์ละ {perWeek % 1 === 0 ? perWeek : perWeek.toFixed(1)} ครั้ง ({formatHoursTh(minutesPerWeek)}) —
        รวม {sessionCount} ครั้ง
        {finishIso ? (
          <>
            {' '}
            เรียนจบประมาณ <b>{formatDayMonth(finishIso)}</b>
          </>
        ) : null}
      </p>
      {verdict.kind === 'clear' && (
        <p className="cjOutcomeGood">เหลือเวลาทบทวนก่อนสอบอีก {verdict.days} วัน</p>
      )}
      {verdict.kind === 'late' && (
        <p className="cjOutcomeBad">
          แผนนี้จบหลังวันสอบ {verdict.days} วัน — เพิ่มวันเรียน เพิ่มนาที หรือลดเป้าลงมาที่ Band 6
        </p>
      )}

      <div className="cjPlannerActions">
        <button type="button" className="cjBtn cjBtn-primary" onClick={onSave} disabled={!dirty}>
          {dirty ? 'ใช้แผนนี้' : 'บันทึกแล้ว'}
        </button>
        {dirty && (
          <button type="button" className="cjBtn cjBtn-quiet" onClick={onCancel}>
            ย้อนกลับ
          </button>
        )}
      </div>
    </div>
  )
}

const nextMondayIso = () => {
  const d = new Date()
  const delta = (8 - d.getDay()) % 7 || 7
  d.setDate(d.getDate() + delta)
  return toIso(d)
}

// ========================================================= pace check =====

/**
 * The plan checking itself against what the student actually does.
 *
 * A calendar set to five days a week and lived at two produces a finish date
 * that is simply wrong, and the finish date is the number every other decision
 * hangs off. So the app reads the completion stamps, and when the gap is big
 * enough to matter it says so once, in plain numbers, with the fix as one
 * button. It never edits the plan on its own — a plan that changes underneath
 * you is worse than one that is slightly out of date.
 */
function PaceCheck({
  schedule,
  observed,
  onAccept,
  onDismiss
}: {
  schedule: StudySchedule
  observed: { sessionsPerWeek: number; weekdays: number[]; days: number }
  onAccept: () => void
  onDismiss: () => void
}) {
  const planned = sessionsPerWeek(schedule)
  const round = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(1))
  const slower = observed.sessionsPerWeek < planned

  return (
    <div className="cjPaceCheck">
      <span className="cjPaceIcon" aria-hidden="true">
        {slower ? '🐢' : '🚀'}
      </span>
      <div className="cjPaceBody">
        <b>
          {slower
            ? `ช่วง 3 สัปดาห์ที่ผ่านมา คุณเรียนจริงสัปดาห์ละ ${round(observed.sessionsPerWeek)} ครั้ง`
            : `คุณเรียนเร็วกว่าแผน — สัปดาห์ละ ${round(observed.sessionsPerWeek)} ครั้ง`}
        </b>
        <p>
          แต่แผนตั้งไว้สัปดาห์ละ {round(planned)} ครั้ง วันจบที่เห็นอยู่เลย
          {slower ? 'เร็วเกินจริง' : 'ช้ากว่าความเป็นจริง'} — ปรับแผนให้ตรงกับที่เรียนจริงไหม?
        </p>
      </div>
      <div className="cjPaceActions">
        <button type="button" className="cjBtn cjBtn-primary" onClick={onAccept}>
          ปรับให้ตรงความจริง
        </button>
        <button type="button" className="cjBtn cjBtn-quiet" onClick={onDismiss}>
          ไม่เป็นไร ใช้แผนเดิม
        </button>
      </div>
    </div>
  )
}

/** The schedule that matches what the student is really doing. */
function scheduleFromObserved(
  schedule: StudySchedule,
  observed: { sessionsPerWeek: number; weekdays: number[] }
): StudySchedule {
  if (schedule.mode === 'weekdays' && observed.weekdays.length) {
    return { ...schedule, weekdays: observed.weekdays }
  }
  const interval = Math.min(7, Math.max(1, Math.round(7 / Math.max(0.5, observed.sessionsPerWeek))))
  return { ...schedule, mode: 'interval', intervalDays: interval }
}

// =============================================================== path =====

/** Whole weeks between two dates, signed: negative means earlier. */
const weeksBetween = (fromIsoDate: string, toIsoDate: string) =>
  Math.round((fromIso(toIsoDate).getTime() - fromIso(fromIsoDate).getTime()) / (7 * 24 * 3600 * 1000))

/** "เร็วขึ้น 11 สัปดาห์" — the price of a reorder, in the unit students think in. */
const describeShift = (beforeIso: string | undefined, afterIso: string | undefined): string | null => {
  if (!beforeIso || !afterIso || beforeIso === afterIso) return null
  const weeks = weeksBetween(beforeIso, afterIso)
  if (weeks === 0) return null
  return weeks < 0 ? `เร็วขึ้น ${Math.abs(weeks)} สัปดาห์` : `ช้าลง ${weeks} สัปดาห์`
}

/**
 * Section 3 — the order of the courses, which belongs to the student.
 *
 * The taught order is a recommendation with reasons attached, and it stays the
 * default because it is the right answer for most people. But a student with a
 * test in three weeks and a weak Speaking paper is not most people, and the old
 * calendar gave them one way out: unlock forty days one at a time. Here they
 * either keep the recommendation or drag their own order, and either way they
 * see what it costs before they commit.
 */
function PathSection({
  enrolled,
  path,
  completedIds,
  buildWith,
  onSave
}: {
  enrolled: JourneyCourseId[]
  path: CoursePath
  completedIds: Set<string>
  /** Builds the calendar a candidate path would produce, so the cost is real. */
  buildWith: (path: CoursePath) => JourneyDay[]
  onSave: (path: CoursePath) => void
}) {
  const [draft, setDraft] = useState<CoursePath>(path)
  useEffect(() => setDraft(path), [path])
  /**
   * Reordering with the arrow buttons moves a row the caret isn't on, so there
   * is nothing for a screen reader to announce. This says what happened.
   */
  const [announcement, setAnnouncement] = useState('')

  const liveOrder = useMemo(() => pathOrder(path, enrolled), [path, enrolled])
  // Memoised because it keys the preview below, which rebuilds two whole
  // calendars — a fresh array identity every render would rebuild them both on
  // every keystroke elsewhere on the page.
  const draftOrder = useMemo(() => pathOrder(draft, enrolled), [draft, enrolled])
  const isCustom = Boolean(draft.order?.length)

  // The consequence, computed from the same builder the real calendar uses —
  // never an estimate that could disagree with what they get.
  const finishes = useMemo(() => {
    const before = courseFinishDates(buildWith(path))
    const after = courseFinishDates(buildWith(draft))
    return draftOrder.map((courseId) => ({
      courseId,
      before: before.get(courseId),
      after: after.get(courseId),
      shift: describeShift(before.get(courseId), after.get(courseId))
    }))
  }, [buildWith, path, draft, draftOrder])

  const changed = JSON.stringify(draft) !== JSON.stringify(path)

  const move = (index: number, by: number) => {
    const next = [...draftOrder]
    const target = index + by
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setDraft({ ...draft, order: next })
    setAnnouncement(`${COURSE_BY_ID[next[target]].labelTh} อยู่ลำดับที่ ${target + 1} จาก ${next.length}`)
  }

  return (
    <div className="cjPath">
      <p className="cjPathLede">
        {path.order?.length
          ? 'นี่คือลำดับที่คุณจัดเอง ปฏิทินเรียงตามนี้'
          : PATH_REASON_TH[liveOrder[0]] ?? 'ลำดับนี้ออกแบบให้แต่ละคอร์สส่งต่อความรู้ให้คอร์สถัดไป'}
      </p>

      <span className="cjSrOnly" role="status" aria-live="polite">
        {announcement}
      </span>

      {/* A radiogroup, said properly. These are two mutually exclusive choices,
          which is what `radio` means; `aria-pressed` on a pair of buttons tells
          a screen reader they're independent toggles, which they aren't. */}
      <div className="cjPathModes" role="radiogroup" aria-label="วิธีจัดลำดับคอร์ส">
            <button
              type="button"
              role="radio"
              aria-checked={!isCustom}
              className={`cjPathMode ${!isCustom ? 'is-active' : ''}`}
              onClick={() => setDraft({ ...draft, order: null })}
            >
              <b>✨ ตามที่เราแนะนำ</b>
              <small>เรียงให้แต่ละคอร์สส่งต่อความรู้ให้คอร์สถัดไป — เหมาะกับคนส่วนใหญ่</small>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={isCustom}
              className={`cjPathMode ${isCustom ? 'is-active' : ''}`}
              onClick={() => setDraft({ ...draft, order: pathOrder(draft, enrolled) })}
            >
              <b>🎛️ จัดลำดับเอง</b>
              <small>อยากเน้นทักษะไหนก่อนก็เลื่อนขึ้นมา เช่น ใกล้สอบแล้วพูดยังไม่แข็ง</small>
            </button>
          </div>

          <ol className="cjPathList">
            {finishes.map((entry, index) => {
              const course = COURSE_BY_ID[entry.courseId]
              const progress = courseProgress(entry.courseId, completedIds)
              return (
                <li key={entry.courseId} style={{ ['--cjAccent' as string]: course.accent }}>
                  <span className="cjPathNum">{index + 1}</span>
                  <span className="cjPathName">
                    <b>
                      {course.emoji} {course.labelTh}
                    </b>
                    <small>
                      {progress.percent > 0 ? `เรียนแล้ว ${progress.percent}% · ` : ''}
                      จบ {entry.after ? formatDayMonth(entry.after) : '—'}
                      {entry.shift ? ` · ${entry.shift}` : ''}
                    </small>
                  </span>
                  {entry.shift && (
                    <span className={`cjPathShift ${entry.shift.startsWith('เร็ว') ? 'is-sooner' : 'is-later'}`}>
                      {entry.shift.startsWith('เร็ว') ? '▲' : '▼'}
                    </span>
                  )}
                  {isCustom && (
                    <span className="cjPathMove">
                      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="เลื่อนขึ้น">
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === finishes.length - 1}
                        aria-label="เลื่อนลง"
                      >
                        ▼
                      </button>
                    </span>
                  )}
                </li>
              )
            })}
          </ol>

          {/* The one option that decides whether a half-finished course ever gets
              finished, so it is a sentence rather than a switch labelled "warm". */}
          <label className="cjPathWarm">
            <input
              type="checkbox"
              checked={draft.keepWarm}
              onChange={(event) => setDraft({ ...draft, keepWarm: event.target.checked })}
            />
            <span>
              <b>ไม่ทิ้งคอร์สที่ค้างไว้</b>
              <small>
                คอร์สที่เรียนค้างอยู่จะแทรกมาสัปดาห์ละ 1 วัน แทนที่จะหยุดสนิท — กันลืมและกันเรียนไม่จบ
              </small>
            </span>
          </label>

          <div className="cjPathActions">
            <button type="button" className="cjBtn cjBtn-primary" onClick={() => onSave(draft)} disabled={!changed}>
              {changed ? 'ใช้ลำดับนี้' : 'ยังไม่มีการเปลี่ยน'}
            </button>
          </div>
          <p className="cjPathNote">
            ความคืบหน้าไม่หายไปไหน — คอร์สที่เรียนค้างไว้จะเริ่มต่อจากบทที่ค้างอยู่เสมอ
          </p>
    </div>
  )
}

// ============================================================ courses =====

function CoursesSection({
  enrolled,
  order,
  planId,
  bundleLabel,
  bundleTagline,
  completedIds,
  onToggleEnrolled,
  onOpenCourse
}: {
  enrolled: JourneyCourseId[]
  /** The student's study order — the card numbering has to agree with the calendar. */
  order: JourneyCourseId[]
  planId: PlanId
  bundleLabel: string | null
  bundleTagline: string | null
  completedIds: Set<string>
  onToggleEnrolled: (courseId: JourneyCourseId) => void
  onOpenCourse: (courseId: JourneyCourseId) => void
}) {
  const enrolledSet = new Set(enrolled)
  // Ordered the way they will actually be studied, and numbered — the card
  // order is the plan, so it must not be the order the catalogue happens to
  // list them in.
  const mine = order.map((id) => COURSE_BY_ID[id])
  const rest = JOURNEY_COURSES.filter((course) => !enrolledSet.has(course.id))

  return (
    <div className="cjCourses">
      {/* Derived, never asserted. This line used to hardcode
          "เขียน → อ่าน → พูด → ฟัง", which went stale the moment a student used
          the reorder control one panel across — and never mentioned Grammar at
          all, which sits first in the taught order. */}
      {mine.length > 0 && (
        <p className="cjCoursesLede">
          ปฏิทินจัดตามลำดับนี้: {mine.map((course) => course.labelTh).join(' → ')}
        </p>
      )}

      {mine.length > 0 && (
        <div className="cjMine">
          <div className="cjMineHead">
            <h3>คอร์สในแผน</h3>
            {bundleLabel && <span className="cjBundleTag">{bundleLabel}</span>}
          </div>
          {bundleTagline && <p className="cjBundleNote">{bundleTagline}</p>}

          <div className="cjBundleWrap">
            <div className="cjCourseGrid">
              {mine.map((course, index) => {
                const progress = courseProgress(course.id, completedIds)
                const inPlan = planCourseCount(course.id, planId)
                return (
                  <article
                    key={course.id}
                    className="cjCourseCard is-mine"
                    style={{ ['--cjAccent' as string]: course.accent }}
                  >
                    <button type="button" className="cjCourseOpen" onClick={() => onOpenCourse(course.id)}>
                      <span className="cjCourseOrder">
                        <span className="cjCourseEmoji" aria-hidden="true">{course.emoji}</span>
                        <span className="cjCourseSeq">ลำดับที่ {index + 1}</span>
                      </span>
                      <b>{course.label}</b>
                      <small>{course.tagline}</small>
                      <span className="cjCourseStats">
                        {inPlan.planned < inPlan.total ? (
                          <>
                            <b>{inPlan.planned}</b> จาก {inPlan.total} บทอยู่ในแผน · {formatHoursTh(inPlan.minutes)}
                          </>
                        ) : (
                          <>
                            {course.lessonCount} บท · {formatHoursTh(course.totalMinutes)}
                          </>
                        )}
                      </span>
                      <span className="cjBar" aria-hidden="true">
                        <i style={{ width: `${progress.percent}%` }} />
                      </span>
                      <span className="cjCourseProgressText">
                        {progress.completed}/{progress.total} บท · {progress.percent}%
                      </span>
                    </button>
                    <button
                      type="button"
                      className="cjCourseRemove"
                      onClick={() => onToggleEnrolled(course.id)}
                      aria-label={`เอา ${course.label} ออกจากแผน`}
                    >
                      เอาออกจากแผน
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="cjOther">
          <h3>คอร์สอื่นที่มีในระบบ</h3>
          <div className="cjCourseGrid">
            {rest.map((course) => (
              <article key={course.id} className="cjCourseCard" style={{ ['--cjAccent' as string]: course.accent }}>
                <button type="button" className="cjCourseOpen" onClick={() => onOpenCourse(course.id)}>
                  <span className="cjCourseEmoji" aria-hidden="true">{course.emoji}</span>
                  <b>{course.label}</b>
                  <small>{course.tagline}</small>
                  <span className="cjCourseStats">
                    {course.lessonCount} บท · {formatHoursTh(course.totalMinutes)}
                  </span>
                </button>
                <button type="button" className="cjCourseAdd" onClick={() => onToggleEnrolled(course.id)}>
                  + เพิ่มเข้าแผน
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      <p className="cjBundleFoot">
        แพ็กเกจที่มี: {BUNDLES.map((b) => b.label).join(' · ')}
      </p>
    </div>
  )
}

// ========================================================== plan bar =====

/**
 * The plan, as one line.
 *
 * It used to be three numbered sections occupying the first three screens of the
 * page — pace, courses, order — every one of them a question about how to study
 * rather than an answer to what to study. They are all still here, one tap away
 * and unchanged; they are just no longer standing between the student and the
 * play button.
 */
function PlanBar({
  planId,
  schedule,
  sessionCount,
  finishIso,
  examDateIso,
  verdict,
  isOpen,
  onToggle
}: {
  planId: PlanId
  schedule: StudySchedule
  sessionCount: number
  finishIso: string | null
  examDateIso: string | null
  verdict: ReturnType<typeof examVerdict>
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <section className={`cjPlanBar ${isOpen ? 'is-open' : ''}`}>
      <div className="cjPlanBarBody">
        <b>แผนของฉัน</b>
        <p>
          <span className="cjPlanTag">{PLAN_BY_ID[planId].labelTh}</span> {describeSchedule(schedule)}
        </p>
        <small>
          {sessionCount} ครั้ง
          {finishIso ? ` · เรียนจบประมาณ ${formatDayMonth(finishIso)}` : ''}
          {examDateIso ? ` · สอบ ${formatDayMonth(examDateIso)}` : ' · ยังไม่ได้กำหนดวันสอบ'}
        </small>
        {/* The plan's own bad news, surfaced where the plan is — not buried in a
            panel the student has no reason to open. */}
        {verdict.kind === 'late' && (
          <p className="cjOutcomeBad">แผนนี้จบหลังวันสอบ {verdict.days} วัน — กด “ปรับแผน” เพื่อแก้</p>
        )}
        {verdict.kind === 'clear' && verdict.days < 7 && (
          <p className="cjOutcomeBad">เหลือเวลาทบทวนก่อนสอบแค่ {verdict.days} วัน</p>
        )}
      </div>
      <button
        type="button"
        className="cjBtn cjBtn-ghost"
        aria-expanded={isOpen}
        aria-controls="cjDrawerPanel"
        onClick={onToggle}
      >
        {isOpen ? 'ปิด' : 'ปรับแผน'}
      </button>
    </section>
  )
}

// ========================================================= today card =====

/**
 * The page.
 *
 * One day, one play button. Everything the old four-section layout was for —
 * the pace, the plan depth, the course order — exists to decide what goes in
 * this card; none of it needs to be on screen while the student uses it.
 */
function TodayCard({
  day,
  today,
  completedIds,
  resume,
  isPinned,
  onUnpin,
  onOpenLesson
}: {
  day: JourneyDay | null
  today: string
  completedIds: Set<string>
  resume: ResumeMap
  /** True when the student is looking at a day other than the plan's own next one. */
  isPinned: boolean
  onUnpin: () => void
  onOpenLesson: (lessonId: string, options?: { autoplay?: boolean; restart?: boolean }) => void
}) {
  if (!day) return null

  const nextLesson = day.lessons.find((lesson) => !completedIds.has(lesson.id)) ?? null
  const resumeEntry = nextLesson ? resume[nextLesson.id] : undefined
  const dayDone = isJourneyDayComplete(day, completedIds)
  const ahead = day.dateIso > today

  return (
    <article
      className={`cjTodayCard ${dayDone ? 'is-done' : ''}`}
      style={{
        ['--cjAccent' as string]: COURSE_BY_ID[day.course].accent,
        ['--cjPastel' as string]: COURSE_BY_ID[day.course].pastel
      }}
    >
      {/* The date, at the size the day deserves. A study day is the unit the
          student lives in, so it gets the same treatment a calendar app gives
          an appointment: one huge numeral you can find without reading. */}
      <div className="cjTodayHero">
        <span className="cjDayPill">{day.dateIso === today ? 'วันนี้' : bigDateParts(day.dateIso).weekday}</span>
        <b className="cjBigDate">
          {bigDateParts(day.dateIso).day}
          <span>{bigDateParts(day.dateIso).month}</span>
        </b>
        <span className="cjTodayCourse">
          {COURSE_BY_ID[day.course].emoji} {COURSE_BY_ID[day.course].label}
        </span>
        <span className="cjTodayMinutes">
          {day.minutes} นาที · {day.lessons.length} บท
        </span>
      </div>

      {/* Behind schedule. Said as a fact with the fix attached, never as a
          scolding — the plan slipping is the normal case, and the only useful
          next move is the one lesson below this line. */}
      {day.dateIso < today && (
        <p className="cjOverdueNote">
          ค้างมาตั้งแต่ {formatDayMonth(day.dateIso)} — เริ่มจากตรงนี้ได้เลย ปฏิทินจะขยับตามให้เอง
        </p>
      )}

      {/* Studying ahead is no longer a dialog asking whether they meant it.
          They tapped a study day; they meant it. The one thing the dialog
          actually announced — that the rest of the plan moves up — is a line. */}
      {ahead && !dayDone && (
        <p className="cjAheadNote">
          เรียนล่วงหน้าอยู่ — วันที่เหลือจะเลื่อนขึ้นมาให้เอง วันจบก็เร็วขึ้นตาม
        </p>
      )}

      {nextLesson ? (
        <button type="button" className="cjPlayBtn" onClick={() => onOpenLesson(nextLesson.id, { autoplay: true })}>
          <span className="cjPlayIcon" aria-hidden="true">
            ▶
          </span>
          <span className="cjPlayBody">
            <small>{isResumable(resumeEntry) ? `เล่นต่อจาก ${formatClock(resumeEntry.seconds)}` : 'เริ่มเรียนบทนี้'}</small>
            <b>{nextLesson.title}</b>
          </span>
          <span className="cjPlayMin">
            {isResumable(resumeEntry) ? `เหลือ ${minutesLeft(resumeEntry)} นาที` : `${nextLesson.minutes} นาที`}
          </span>
        </button>
      ) : (
        <div className="cjDoneRow">
          <span className="cjDoneMark" aria-hidden="true">
            ✓
          </span>
          <div>
            <b>เรียนครบแล้วสำหรับวันนี้</b>
            <p>อยากทบทวนอีกรอบไหม? กดบทที่อยากดูซ้ำได้เลย</p>
          </div>
          <button
            type="button"
            className="cjBtn cjBtn-ghost"
            onClick={() => onOpenLesson(day.lessons[0].id, { autoplay: true, restart: true })}
          >
            ทบทวนอีกครั้ง
          </button>
        </div>
      )}

      {day.isLongSession && (
        <p className="cjLongNote">
          บทนี้ยาวกว่าที่ตั้งไว้ ({day.minutes} นาที) — เป็นคลิปเดียวจบ แบ่งดูสองรอบได้
        </p>
      )}

      <ul className="cjDayList">
        {day.lessons.map((lesson) => {
          const done = completedIds.has(lesson.id)
          return (
            <li key={lesson.id} className={done ? 'is-done' : ''}>
              <button type="button" className="cjDayItem" onClick={() => onOpenLesson(lesson.id)}>
                <span className={`cjCheck ${done ? 'is-done' : ''}`} aria-hidden="true">
                  {done ? '✓' : '▶'}
                </span>
                <span className="cjDayItemBody">
                  <b>{lesson.title}</b>
                  <small>
                    {lesson.chapterName}
                    {!lesson.bunnyVideoId ? ' · กำลังอัปโหลด' : ''}
                  </small>
                </span>
                <span className="cjTimePill">{lesson.minutes} นาที</span>
                {done && <span className="cjReviseTag">ทบทวน</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {isPinned && (
        <div className="cjTodayFoot">
          <button type="button" className="cjBtn cjBtn-quiet" onClick={onUnpin}>
            กลับไปงานวันนี้
          </button>
        </div>
      )}
    </article>
  )
}

// ======================================================== review card =====

/**
 * Spaced retrieval — the same question, days later.
 *
 * One lesson at a time and never a backlog: a review queue that grows is a debt,
 * and a debt is what people quit a course over. What comes back is the learner's
 * own words from the first attempt, revealed only after they've tried again —
 * seeing the answer first turns retrieval into recognition, which is the process
 * that doesn't produce the effect.
 */
function ReviewCard({
  lesson,
  previous,
  onSubmit,
  onSkip,
  onOpenLesson
}: {
  lesson: JourneyLesson
  previous: CheckAnswer | undefined
  onSubmit: (text: string) => void
  onSkip: () => void
  onOpenLesson: () => void
}) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const course = COURSE_BY_ID[lesson.course]
  const ok = isRecallSufficient(text)

  if (submitted) {
    return (
      <section className="cjReview is-done" style={{ ['--cjAccent' as string]: course.accent }}>
        <b>เทียบกับที่เคยเขียนไว้</b>
        <div className="cjReviewCompare">
          <div>
            <small>รอบนี้</small>
            <p>{text}</p>
          </div>
          <div>
            <small>ครั้งก่อน</small>
            <p>{previous?.text || '—'}</p>
          </div>
        </div>
        <p className="cjReviewNote">
          ตรงที่หายไปคือตรงที่ควรกลับไปดู —{' '}
          <button type="button" className="cjLinkBtn" onClick={onOpenLesson}>
            เปิดบทนี้อีกครั้ง
          </button>
        </p>
      </section>
    )
  }

  return (
    <section className="cjReview" style={{ ['--cjAccent' as string]: course.accent }}>
      <span className="cjReviewPill">
        {course.emoji} ทบทวนความจำ · {course.labelTh}
      </span>
      <b>{lesson.title}</b>
      <p className="cjReviewPrompt">{checkPrompt(lesson.course)}</p>
      <textarea
        className="cjRecallBox"
        rows={3}
        value={text}
        aria-label="สิ่งที่คุณจำได้จากบทนี้"
        placeholder="นึกให้ออกก่อนค่อยเปิดดู — ผิดได้ ไม่มีการให้คะแนน"
        onChange={(event) => setText(event.target.value)}
      />
      <div className="cjRecallFoot">
        <small>{ok ? 'พอแล้ว — ส่งได้เลย' : `อีก ${recallShortfall(text)} ตัวอักษร`}</small>
        <div className="cjRecallActions">
          <button type="button" className="cjBtn cjBtn-quiet" onClick={onSkip}>
            ไว้ทีหลัง
          </button>
          <button
            type="button"
            className="cjBtn cjBtn-primary"
            disabled={!ok}
            onClick={() => {
              onSubmit(text)
              setSubmitted(true)
            }}
          >
            ส่งคำตอบ
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================================ up next =====

/**
 * The next few sessions, and nothing else.
 *
 * This replaces a day/week/month segmented control — three code paths, three
 * empty states, three ways to render the same twelve facts, for a screen the
 * student opens once a day to answer one question. The long view still exists,
 * in the plan drawer, where a long view belongs.
 */
function UpNext({
  calendar,
  today,
  shownIndex,
  completedIds,
  unlockedDays,
  onOpenDay
}: {
  calendar: JourneyDay[]
  today: string
  shownIndex: number
  completedIds: Set<string>
  unlockedDays: Set<string>
  onOpenDay: (day: JourneyDay) => void
}) {
  const upcoming = useMemo(() => {
    const first = calendar.findIndex((day) => !isJourneyDayComplete(day, completedIds))
    if (first < 0) return []
    return calendar.slice(first + 1, first + 4)
  }, [calendar, completedIds])

  if (!upcoming.length) return null

  return (
    <section className="cjUpNext">
      <h2>ครั้งต่อไป</h2>
      <ul className="cjWeekList">
        {upcoming.map((day) => {
          const course = COURSE_BY_ID[day.course]
          const complete = isJourneyDayComplete(day, completedIds)
          const locked = isJourneyDayLocked(day, today, unlockedDays, completedIds)
          const parts = bigDateParts(day.dateIso)
          return (
            <li key={day.index}>
              <button
                type="button"
                className={`cjWeekRow ${complete ? 'is-done' : ''} ${day.index === shownIndex ? 'is-open' : ''}`}
                style={{ ['--cjAccent' as string]: course.accent, ['--cjPastel' as string]: course.pastel }}
                onClick={() => onOpenDay(day)}
              >
                <span className="cjWeekDate">
                  <b>{parts.day}</b>
                  <span>{parts.weekday.slice(0, 2)}</span>
                </span>
                <span className="cjWeekBar" aria-hidden="true" />
                <span className="cjWeekBody">
                  <b>{day.lessons[0]?.title}</b>
                  <small>
                    {course.emoji} {course.label.replace('IELTS ', '')}
                    {day.lessons.length > 1 ? ` · อีก ${day.lessons.length - 1} บท` : ''}
                    {complete ? ' · เรียนจบแล้ว' : locked ? ' · แตะเพื่อเรียนล่วงหน้า' : ''}
                  </small>
                </span>
                <span className="cjTimePill">{day.minutes} นาที</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ====================================================== full calendar =====

/** The long arc — one station per course block, in study order. */
function FullCalendar({
  calendar,
  today,
  shownIndex,
  completedIds,
  unlockedDays,
  onOpenDay
}: {
  calendar: JourneyDay[]
  today: string
  shownIndex: number
  completedIds: Set<string>
  unlockedDays: Set<string>
  onOpenDay: (day: JourneyDay) => void
}) {
  const blocks = useMemo(() => buildJourneyBlocks(calendar, completedIds), [calendar, completedIds])
  const currentBlockIndex = blocks.findIndex(
    (block) => shownIndex >= block.firstDayIndex && shownIndex <= block.lastDayIndex
  )
  const finishIso = calendar.length ? calendar[calendar.length - 1].dateIso : null

  if (!calendar.length) {
    return <p className="cjEmpty">ยังไม่มีคอร์สในแผน — เพิ่มคอร์สในแท็บ “คอร์สในแผน” ก่อน</p>
  }

  return (
    <div className="cjCalendar">
      <p className="cjRailCount">
        {calendar.length} ครั้ง · เรียนจบประมาณ {finishIso ? formatDayMonth(finishIso) : '—'}
      </p>
      <ol className="cjRail">
        {blocks.map((block, index) => {
          const course = COURSE_BY_ID[block.course]
          const isNow = index === currentBlockIndex
          const done = block.percent >= 100
          return (
            <li key={`${block.course}-${block.startIso}`} className={`cjStation ${isNow ? 'is-now' : ''} ${done ? 'is-done' : ''}`}>
              <span className="cjStationDot" aria-hidden="true" />
              <div className="cjStationCard" style={{ ['--cjPastel' as string]: course.pastel, ['--cjAccent' as string]: course.accent }}>
                <div className="cjStationTop">
                  {(isNow || done) && (
                    <span className="cjRing" style={{ ['--cjRingPct' as string]: `${block.percent}%` }}>
                      <span>{block.percent}%</span>
                    </span>
                  )}
                  <span className="cjStationHead">
                    <b>
                      {course.emoji} {course.label.replace('IELTS ', '')}
                    </b>
                    <span className="cjStationMeta">
                      {formatDayMonth(block.startIso)} – {formatDayMonth(block.endIso)} · {block.days} ครั้ง · {block.lessons} บท
                      {block.guestDays > 0 &&
                        ` · แทรก ${block.guestCourses.map((id) => COURSE_BY_ID[id].labelTh).join('/')} ${block.guestDays} ครั้ง`}
                    </span>
                  </span>
                  {isNow && <span className="cjStationPill is-now">กำลังเรียน</span>}
                  {done && !isNow && <span className="cjStationPill is-done">จบแล้ว</span>}
                </div>

                {/* Only the station you are in opens its days — four blocks of
                    chips at once is the density problem in a different shape. */}
                {isNow && (
                  <DayChips
                    days={block.days > 0 ? calendar.slice(block.firstDayIndex, block.lastDayIndex + 1) : []}
                    today={today}
                    completedIds={completedIds}
                    unlockedDays={unlockedDays}
                    shownIndex={shownIndex}
                    onOpenDay={onOpenDay}
                    windowed
                  />
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ---------------------------------------------------------- day chips ----

/**
 * A block's study days as compact chips.
 *
 * The old month grid tried to carry a lesson title in every cell, in 12px Thai,
 * 35 cells at a time — that was the whole density problem. A chip carries the
 * date and its state and nothing else; the title lives in the focus card, which
 * is the one place with room to read it.
 */
function DayChips({
  days,
  today,
  completedIds,
  unlockedDays,
  shownIndex,
  onOpenDay,
  windowed
}: {
  days: JourneyDay[]
  today: string
  completedIds: Set<string>
  unlockedDays: Set<string>
  shownIndex: number
  onOpenDay: (day: JourneyDay) => void
  /** Long blocks show a window around the current day until asked for the rest. */
  windowed?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const WINDOW = 14

  const anchor = Math.max(0, days.findIndex((day) => day.index === shownIndex))
  const visible =
    !windowed || expanded || days.length <= WINDOW
      ? days
      : days.slice(Math.max(0, anchor - 2), Math.max(0, anchor - 2) + WINDOW)
  const hidden = days.length - visible.length

  return (
    <>
      <div className="cjChips">
        {visible.map((day) => {
          const complete = isJourneyDayComplete(day, completedIds)
          const dayLocked = isJourneyDayLocked(day, today, unlockedDays, completedIds)
          const parts = bigDateParts(day.dateIso)
          return (
            <button
              key={day.index}
              type="button"
              className={`cjChipDay ${complete ? 'is-done' : ''} ${dayLocked ? 'is-locked' : ''} ${day.dateIso === today ? 'is-today' : ''} ${day.index === shownIndex ? 'is-open' : ''}`}
              title={`${formatDayMonth(day.dateIso)} · ${day.lessons[0]?.title ?? ''} · ${day.minutes} นาที`}
              onClick={() => onOpenDay(day)}
            >
              <b>{parts.day}</b>
              <span>{complete ? '✓' : parts.month}</span>
            </button>
          )
        })}
      </div>
      {hidden > 0 && (
        <button type="button" className="cjChipsMore" onClick={() => setExpanded(true)}>
          + อีก {hidden} ครั้งในช่วงนี้
        </button>
      )}
      {expanded && windowed && (
        <button type="button" className="cjChipsMore" onClick={() => setExpanded(false)}>
          ย่อกลับ
        </button>
      )}
    </>
  )
}

// ====================================================== course detail =====

function CourseDetailView({
  courseId,
  planId,
  completedIds,
  resume,
  isEnrolled,
  isFirst,
  onEnrol,
  onStudyFirst,
  onOpenLesson,
  onBack,
  onOpenWritingCourse
}: {
  courseId: JourneyCourseId
  planId: PlanId
  completedIds: Set<string>
  resume: ResumeMap
  isEnrolled: boolean
  /** Already at the front of the student's order — nothing to move. */
  isFirst: boolean
  onEnrol: () => void
  onStudyFirst: () => void
  onOpenLesson: (lessonId: string, options?: { autoplay?: boolean; restart?: boolean }) => void
  onBack: () => void
  onOpenWritingCourse: () => void
}) {
  const course = COURSE_BY_ID[courseId]
  const lessons = courseLessons(courseId)
  const progress = courseProgress(courseId, completedIds)
  // Nothing is hidden by a plan — a lesson outside it is simply marked
  // skippable, and the student decides.
  const planned = useMemo(() => planCourseLessonIds(courseId, planId), [courseId, planId])
  const plannedCount = planCourseLessons(courseId, planId).length

  const chapters = useMemo(() => {
    const map = new Map<number, { name: string; lessons: JourneyLesson[] }>()
    lessons.forEach((lesson) => {
      const entry = map.get(lesson.chapterIndex) ?? { name: lesson.chapterName, lessons: [] }
      entry.lessons.push(lesson)
      map.set(lesson.chapterIndex, entry)
    })
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  }, [lessons])

  return (
    <div className="cjPage cjCoursePage" style={{ ['--cjAccent' as string]: course.accent }}>
      <header className="cjTopBar">
        <button type="button" className="cjBack" onClick={onBack}>
          ← กลับหน้าคอร์สของฉัน
        </button>
      </header>

      <div className="cjCourseHero">
        <span className="cjCourseEmoji cjCourseEmoji-lg" aria-hidden="true">{course.emoji}</span>
        <div>
          <h1>{course.label}</h1>
          <p>{course.tagline}</p>
          <p className="cjCourseHeroStats">
            {course.lessonCount} บท · {formatHoursTh(course.totalMinutes)} · พร้อมดูแล้ว {course.readyCount} บท
          </p>
          {plannedCount < lessons.length && (
            <p className="cjPlanNote">
              แผน <b>{PLAN_BY_ID[planId].labelTh}</b> จัด {plannedCount} บทลงปฏิทินให้ —{' '}
              {SKIPPABLE_REASON_TH[planId] || 'บทที่เหลือเปิดดูได้ตามสบาย'}
            </p>
          )}
          <div className="cjCourseHeroActions">
            <button type="button" className={`cjBtn ${isEnrolled ? 'cjBtn-ghost' : 'cjBtn-primary'}`} onClick={onEnrol}>
              {isEnrolled ? 'เอาออกจากแผน' : '+ เพิ่มเข้าแผนของฉัน'}
            </button>
            {/* Where the urge actually strikes: the student is looking at the
                course they want, not at a settings screen. */}
            {isEnrolled && !isFirst && (
              <button type="button" className="cjBtn cjBtn-primary" onClick={onStudyFirst}>
                ⤴ เรียนคอร์สนี้ก่อน
              </button>
            )}
            {isEnrolled && isFirst && <span className="cjCourseNowTag">📌 คอร์สที่กำลังเรียนอยู่</span>}
            {courseId === 'writing' && (
              <button type="button" className="cjBtn cjBtn-ghost" onClick={onOpenWritingCourse}>
                เปิดห้องเรียน Writing แบบเต็ม →
              </button>
            )}
          </div>
          <div className="cjBar cjBar-lg" aria-hidden="true">
            <i style={{ width: `${progress.percent}%` }} />
          </div>
          <small>
            {progress.completed}/{progress.total} บท · {progress.percent}%
          </small>
        </div>
      </div>

      {chapters.map(([index, chapter]) => (
        <section key={index} className="cjChapter">
          <h2>{chapter.name}</h2>
          <ul className="cjChapterList">
            {chapter.lessons.map((lesson) => {
              const done = completedIds.has(lesson.id)
              const entry = resume[lesson.id]
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    className={`cjChapterItem ${done ? 'is-done' : ''} ${planned.has(lesson.id) ? '' : 'is-bonus'}`}
                    onClick={() => onOpenLesson(lesson.id)}
                  >
                    <span className={`cjCheck ${done ? 'is-done' : ''}`} aria-hidden="true">
                      {done ? '✓' : lesson.bunnyVideoId ? '▶' : '○'}
                    </span>
                    <span className="cjChapterItemBody">
                      <b>{lesson.title}</b>
                      <small>
                        {lesson.minutes} นาที
                        {!lesson.bunnyVideoId ? ' · กำลังอัปโหลด' : ''}
                        {isResumable(entry) && !done ? ` · ค้างไว้ที่ ${formatClock(entry.seconds)}` : ''}
                      </small>
                    </span>
                    {done ? (
                      <span className="cjReviseTag">ทบทวน</span>
                    ) : !planned.has(lesson.id) ? (
                      <span className="cjBonusTag">ข้ามได้</span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

// ============================================================= lesson =====

function JourneyPlayer({
  lesson,
  startSeconds,
  autoplay,
  onRecordPosition
}: {
  lesson: JourneyLesson
  startSeconds?: number
  autoplay?: boolean
  onRecordPosition: (seconds: number, duration: number) => void
}) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  // Resolved once per lesson — re-deriving it on each position update would
  // rewrite src mid-playback and restart the video.
  const [embedSrc] = useState(() =>
    buildEmbedUrl({ libraryId: lesson.libraryId, videoId: lesson.bunnyVideoId ?? '', startSeconds, autoplay })
  )

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    return subscribeToPlaybackPosition(frame, onRecordPosition)
  }, [lesson.id, onRecordPosition])

  return (
    <iframe
      key={lesson.id}
      ref={frameRef}
      src={embedSrc}
      loading="lazy"
      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
      allowFullScreen
      title={lesson.title}
    />
  )
}

function JourneyLessonView({
  lesson,
  isDone,
  resumeEntry,
  autoplay,
  nextLesson,
  completedIds,
  resume,
  planId,
  enrolled,
  bundleLabel,
  savedRecall,
  onRecordPosition,
  onCompleteWithRecall,
  onUndoComplete,
  onRevise,
  onOpenLesson,
  onOpenCourse,
  onBack,
  onHome
}: {
  lesson: JourneyLesson
  isDone: boolean
  resumeEntry?: LessonResumeEntry
  autoplay?: boolean
  nextLesson: JourneyLesson | null
  completedIds: Set<string>
  resume: ResumeMap
  planId: PlanId
  enrolled: JourneyCourseId[]
  bundleLabel: string | null
  /** What they wrote the first time, shown back once the lesson is done. */
  savedRecall: string
  onRecordPosition: (seconds: number, duration: number) => void
  onCompleteWithRecall: (text: string) => void
  onUndoComplete: () => void
  onRevise: () => void
  onOpenLesson: (lessonId: string, options?: { autoplay?: boolean; restart?: boolean }) => void
  onOpenCourse: (courseId: JourneyCourseId) => void
  onBack: () => void
  onHome: () => void
}) {
  const course = COURSE_BY_ID[lesson.course]

  /**
   * The check, and the gate in front of it.
   *
   * `✓ ดูจบแล้ว` used to be an unconditional button, and a second button marked
   * the lesson done *and* advanced in one tap — so the fastest route to 100% was
   * tapping through the course without playing anything. Now the tick needs the
   * video to have actually played (see lessonResume.advanceWatched, which
   * ignores seeking) and one retrieval answer. A lesson whose video hasn't
   * uploaded yet has nothing to gate on, so only the recall applies.
   */
  const [recall, setRecall] = useState('')
  const [checkOpen, setCheckOpen] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const gated = Boolean(lesson.bunnyVideoId)
  const watchedOk = !gated || hasWatchedEnough(resumeEntry)
  const percent = watchedPercent(resumeEntry)
  const recallOk = isRecallSufficient(recall)

  return (
    <div className="cjPage cjLessonPage" style={{ ['--cjAccent' as string]: course.accent }}>
      <header className="cjTopBar">
        <button type="button" className="cjBack" onClick={onBack}>
          ← {course.label}
        </button>
        <button type="button" className="cjBack" onClick={onHome}>
          ปฏิทินของฉัน
        </button>
      </header>

      <div className="cjLessonLayout">
        <LessonOutline
          lesson={lesson}
          completedIds={completedIds}
          resume={resume}
          planId={planId}
          enrolled={enrolled}
          bundleLabel={bundleLabel}
          onOpenLesson={onOpenLesson}
          onOpenCourse={onOpenCourse}
        />

        <div className="cjLessonMain">
          <p className="cjLessonCrumb">
            {course.emoji} {course.label} · {lesson.chapterName}
          </p>
          <h1 className="cjLessonTitle">{lesson.title}</h1>

          <div className="cjPlayer">
            {lesson.bunnyVideoId ? (
              <JourneyPlayer
                // Keyed on the lesson: the embed URL is initial state inside the
                // player, so without a remount the next lesson kept the previous
                // video — new title, same clip.
                key={lesson.id}
                lesson={lesson}
                startSeconds={resumeEntry?.seconds}
                autoplay={autoplay}
                onRecordPosition={onRecordPosition}
              />
            ) : (
              <div className="cjPlayerEmpty">
                <span aria-hidden="true">⏳</span>
                <b>วิดีโอบทนี้กำลังอัปโหลด</b>
                <p>บทอื่นในคอร์สเรียนต่อได้ตามปกติ</p>
              </div>
            )}
          </div>

          {isResumable(resumeEntry) && !isDone && (
            <p className="cjResumeNote">
              เล่นต่อจาก {formatClock(resumeEntry.seconds)}
              {resumeEntry.duration > 0 ? ` — เหลืออีก ${minutesLeft(resumeEntry)} นาที` : ''}
            </p>
          )}

          {isDone ? (
            <div className="cjLessonDone">
              <span className="cjDoneMark" aria-hidden="true">✓</span>
              <div>
                <b>{justFinished ? checkPraise : 'เรียนบทนี้จบแล้ว'}</b>
                {savedRecall ? (
                  <p className="cjRecallEcho">“{savedRecall}”</p>
                ) : (
                  <p>อยากทบทวนอีกครั้งไหม? กดดูซ้ำได้ ไม่กระทบความคืบหน้า</p>
                )}
              </div>
              <div className="cjLessonDoneActions">
                <button type="button" className="cjBtn cjBtn-ghost" onClick={onRevise}>
                  ▶ ทบทวนอีกครั้ง
                </button>
                <button type="button" className="cjBtn cjBtn-quiet" onClick={onUndoComplete}>
                  ยกเลิกเครื่องหมายว่าจบ
                </button>
              </div>
            </div>
          ) : checkOpen ? (
            /* The retrieval check. Ungraded on purpose — the benefit is in the
               attempt, and an answer key would limit this to the handful of
               lessons anyone got round to authoring one for. */
            <div className="cjCheck-panel">
              <b>ก่อนติ๊กว่าจบ — ลองนึกดูก่อน</b>
              <p className="cjReviewPrompt">{checkPrompt(lesson.course)}</p>
              <textarea
                className="cjRecallBox"
                rows={3}
                value={recall}
                autoFocus
                aria-label="สิ่งที่คุณจำได้จากบทนี้"
                placeholder="เขียนด้วยคำของคุณเอง — ไม่มีการให้คะแนน ผิดได้"
                onChange={(event) => setRecall(event.target.value)}
              />
              <div className="cjRecallFoot">
                <small>{recallOk ? 'พอแล้ว — ส่งได้เลย' : `อีก ${recallShortfall(recall)} ตัวอักษร`}</small>
                <div className="cjRecallActions">
                  <button type="button" className="cjBtn cjBtn-quiet" onClick={() => setCheckOpen(false)}>
                    ยังไม่พร้อม
                  </button>
                  <button
                    type="button"
                    className="cjBtn cjBtn-primary"
                    disabled={!recallOk}
                    onClick={() => {
                      onCompleteWithRecall(recall)
                      setJustFinished(true)
                      setCheckOpen(false)
                    }}
                  >
                    บันทึกและติ๊กว่าจบ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="cjLessonActions">
              <button
                type="button"
                className="cjBtn cjBtn-primary"
                disabled={!watchedOk}
                onClick={() => setCheckOpen(true)}
              >
                ✓ ดูจบแล้ว
              </button>
              {!watchedOk && (
                <p className="cjGateNote">
                  ดูไปแล้ว {percent}% — ติ๊กว่าจบได้เมื่อดูครบ 80%
                  {percent === 0 ? ' (กดเล่นวิดีโอด้านบนก่อน)' : ''}
                </p>
              )}
            </div>
          )}

          {/* Moving on without ticking is fine; ticking on the way past is not.
              This card no longer marks anything complete. */}
          {nextLesson && !checkOpen && (
            <button type="button" className="cjNextCard" onClick={() => onOpenLesson(nextLesson.id)}>
              <small>บทถัดไป →</small>
              <b>{nextLesson.title}</b>
              <span>{nextLesson.minutes} นาที</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------ lesson outline ----

/**
 * The syllabus rail beside the player: where this lesson sits in its chapter,
 * how much of the chapter, the course and the whole bundle is behind you.
 *
 * Everything here is derived — a chapter's minutes are its lessons' minutes, a
 * course's percentage is its ticked lessons — so the rail can never disagree
 * with the calendar or the course page. Only the chapter you are inside opens
 * by default: a five-course bundle is roughly two hundred rows, and a wall of
 * them is the density problem the calendar already had to solve once.
 */
function LessonOutline({
  lesson,
  completedIds,
  resume,
  planId,
  enrolled,
  bundleLabel,
  onOpenLesson,
  onOpenCourse
}: {
  lesson: JourneyLesson
  completedIds: Set<string>
  resume: ResumeMap
  planId: PlanId
  enrolled: JourneyCourseId[]
  bundleLabel: string | null
  onOpenLesson: (lessonId: string, options?: { autoplay?: boolean; restart?: boolean }) => void
  onOpenCourse: (courseId: JourneyCourseId) => void
}) {
  const course = COURSE_BY_ID[lesson.course]
  const lessons = courseLessons(lesson.course)
  const progress = courseProgress(lesson.course, completedIds)
  const planned = useMemo(() => planCourseLessonIds(lesson.course, planId), [lesson.course, planId])

  /** The courses the rail reports on: the student's own, plus this one if it's a peek. */
  const railCourses = useMemo(() => {
    const ids = enrolled.includes(lesson.course) ? enrolled : [...enrolled, lesson.course]
    return orderCourses(ids).map((id) => ({ meta: COURSE_BY_ID[id], progress: courseProgress(id, completedIds) }))
  }, [enrolled, lesson.course, completedIds])

  const bundle = useMemo(() => {
    const totals = railCourses.reduce(
      (sum, entry) => ({
        completed: sum.completed + entry.progress.completed,
        total: sum.total + entry.progress.total,
        minutesDone: sum.minutesDone + entry.progress.minutesDone,
        totalMinutes: sum.totalMinutes + entry.progress.totalMinutes
      }),
      { completed: 0, total: 0, minutesDone: 0, totalMinutes: 0 }
    )
    return { ...totals, percent: totals.total ? Math.round((totals.completed / totals.total) * 100) : 0 }
  }, [railCourses])

  const chapters = useMemo(() => {
    const map = new Map<number, { name: string; lessons: JourneyLesson[] }>()
    lessons.forEach((item) => {
      const entry = map.get(item.chapterIndex) ?? { name: item.chapterName, lessons: [] }
      entry.lessons.push(item)
      map.set(item.chapterIndex, entry)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([index, chapter]) => ({
        index,
        name: chapter.name,
        lessons: chapter.lessons,
        minutes: chapter.lessons.reduce((sum, item) => sum + item.minutes, 0),
        done: chapter.lessons.filter((item) => completedIds.has(item.id)).length,
        hasCurrent: chapter.lessons.some((item) => item.id === lesson.id)
      }))
  }, [lessons, completedIds, lesson.id])

  // Jumping into a lesson from the calendar can land eighty rows down a course;
  // the rail scrolls itself so "where am I" never costs a scroll.
  const currentRef = useRef<HTMLLIElement | null>(null)
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [lesson.id])

  /**
   * Which chapters are open.
   *
   * Held in state rather than left to `<details open>` because a native details
   * snaps — the list is simply there, at full height, with no motion to tell the
   * eye that it grew. Owning the state lets the panel expand, and lets a chapter
   * the student opened by hand stay open when they move to the next lesson.
   */
  const [openChapters, setOpenChapters] = useState<Set<number>>(() => new Set([lesson.chapterIndex]))
  useEffect(() => {
    setOpenChapters((prev) => (prev.has(lesson.chapterIndex) ? prev : new Set(prev).add(lesson.chapterIndex)))
  }, [lesson.chapterIndex])

  const toggleChapter = (index: number) =>
    setOpenChapters((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <aside className="cjLessonAside" aria-label="สารบัญคอร์ส">
      <section className="cjAsideBlock">
        <div className="cjAsideHead">
          <b>{bundleLabel ?? 'คอร์สของฉัน'}</b>
          <span className="cjAsidePct">{bundle.percent}%</span>
        </div>
        <div className="cjBar" aria-hidden="true">
          <i style={{ width: `${bundle.percent}%` }} />
        </div>
        <small className="cjAsideNote">
          {bundle.completed}/{bundle.total} บท · ดูแล้ว {formatHoursTh(bundle.minutesDone)} จาก{' '}
          {formatHoursTh(bundle.totalMinutes)}
        </small>

        <ul className="cjAsideCourses">
          {railCourses.map((entry) => (
            <li key={entry.meta.id}>
              <button
                type="button"
                className={`cjAsideCourse ${entry.meta.id === lesson.course ? 'is-current' : ''}`}
                style={{ ['--cjAccent' as string]: entry.meta.accent }}
                onClick={() => onOpenCourse(entry.meta.id)}
              >
                <span className="cjAsideCourseTop">
                  <b>
                    {entry.meta.emoji} {entry.meta.labelTh}
                  </b>
                  <span>{entry.progress.percent}%</span>
                </span>
                <span className="cjBar cjBar-thin" aria-hidden="true">
                  <i style={{ width: `${entry.progress.percent}%` }} />
                </span>
                <small>
                  {entry.progress.completed}/{entry.progress.total} บท · {formatHoursTh(entry.progress.totalMinutes)}
                </small>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="cjAsideBlock cjAsideChapters">
        <div className="cjAsideHead">
          <b>
            {course.emoji} {course.label.replace('IELTS ', '')}
          </b>
          <span className="cjAsidePct">{progress.percent}%</span>
        </div>
        <small className="cjAsideNote">
          {chapters.length} บทเรียนใหญ่ · {lessons.length} คลิป · {formatHoursTh(progress.totalMinutes)}
        </small>

        <ol className="cjAsideChapterList">
          {chapters.map((chapter) => {
            const complete = chapter.done === chapter.lessons.length
            const open = openChapters.has(chapter.index)
            const panelId = `cjChapter-${lesson.course}-${chapter.index}`
            return (
              <li key={chapter.index} className={open ? 'is-open' : ''}>
                <button
                  type="button"
                  className={`cjAsideChapter ${complete ? 'is-done' : ''}`}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggleChapter(chapter.index)}
                >
                  <span className="cjAsideCaret" aria-hidden="true">
                    ▸
                  </span>
                  <span className="cjAsideChapterName">
                    <b>{chapter.name}</b>
                    <small>
                      {chapter.done}/{chapter.lessons.length} บท · {formatHoursTh(chapter.minutes)}
                    </small>
                  </span>
                  <span className="cjAsideChapterPct">
                    {complete ? '✓' : `${Math.round((chapter.done / chapter.lessons.length) * 100)}%`}
                  </span>
                </button>

                {/* The 0fr → 1fr grid row is the one way to transition to a
                    height nobody measured — the list can be any length and the
                    open still eases instead of snapping. */}
                <div className={`cjAsidePanel ${open ? 'is-open' : ''}`} id={panelId} aria-hidden={!open}>
                  <ul className="cjAsideLessons">
                    {chapter.lessons.map((item) => {
                      const done = completedIds.has(item.id)
                      const current = item.id === lesson.id
                      const entry = resume[item.id]
                      return (
                        <li key={item.id} ref={current ? currentRef : undefined}>
                          <button
                            type="button"
                            className={`cjAsideLesson ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}
                            aria-current={current ? 'true' : undefined}
                            tabIndex={open ? undefined : -1}
                            onClick={() => onOpenLesson(item.id)}
                          >
                            <span className="cjAsideMark" aria-hidden="true">
                              {done ? '✓' : current ? '▶' : item.bunnyVideoId ? '○' : '⏳'}
                            </span>
                            <span className="cjAsideLessonBody">
                              <b>{item.title}</b>
                              <small>
                                {item.minutes} นาที
                                {!item.bunnyVideoId ? ' · กำลังอัปโหลด' : ''}
                                {isResumable(entry) && !done ? ` · ค้างไว้ ${formatClock(entry.seconds)}` : ''}
                                {!planned.has(item.id) ? ' · เสริม' : ''}
                              </small>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </aside>
  )
}
