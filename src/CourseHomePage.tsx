import { useEffect, useMemo, useState } from 'react'
import './CourseHomePage.css'
import {
  QUESTION_TYPE_BY_ID,
  WRITING_COURSE_CHAPTERS,
  WRITING_COURSE_CHAPTER_NAMES,
  WRITING_COURSE_LESSON_COUNT,
  WRITING_COURSE_LESSONS,
  WRITING_COURSE_TOTAL_MINUTES,
  WRITING_COURSE_VIDEO_READY_COUNT,
  formatMinutesAsHours,
  type CourseLesson
} from './writingCourseCurriculum'
import {
  ONBOARDING_INTERVAL_OPTIONS,
  ONBOARDING_MINUTE_OPTIONS,
  STUDY_TRACKS,
  THAI_WEEKDAYS_SHORT,
  TRACK_BY_ID,
  summarizeTrack,
  trackLessonIds,
  buildCalendar,
  buildMonthGrid,
  computeOverallProgress,
  computeQuestionTypeProgress,
  estimateFinishDateIso,
  findTodayPlan,
  formatThaiDayMonth,
  formatThaiMonthYear,
  fromIsoDate,
  isDayComplete,
  isDayLocked,
  todayIsoDate,
  type CalendarDay,
  type StudyTrack,
  type WritingCourseOnboarding
} from './writingCourseStudyPlan'

type CourseHomePageProps = {
  onBackHome: () => void
  learnerEmail: string
  learnerName: string
}

/**
 * 'hub' and 'onboarding' are full-bleed gate screens shown before a plan exists.
 * Everything after that lives inside the course shell (persistent curriculum
 * sidebar + main panel), the way Coursera/edX lay a course out — the curriculum
 * is never more than a glance away, and the video is the centre of the page.
 */
type View = 'hub' | 'onboarding' | 'day' | 'lesson' | 'calendar' | 'progress'

type SidebarFilter = 'plan' | 'core' | 'ready' | 'all'

type StoredState = {
  onboarding: WritingCourseOnboarding | null
  completedIds: string[]
  aheadUnlocked: number[]
}

const scopeKey = (email: string) => `writing-course-plan:${(email || 'admin-preview').trim().toLowerCase()}`

const loadStoredState = (email: string): StoredState => {
  if (typeof window === 'undefined') return { onboarding: null, completedIds: [], aheadUnlocked: [] }
  try {
    const raw = window.localStorage.getItem(scopeKey(email))
    if (!raw) return { onboarding: null, completedIds: [], aheadUnlocked: [] }
    const parsed = JSON.parse(raw)
    const onboarding: WritingCourseOnboarding | null =
      parsed?.onboarding &&
      typeof parsed.onboarding.intervalDays === 'number' &&
      typeof parsed.onboarding.minutesPerDay === 'number' &&
      typeof parsed.onboarding.startDateIso === 'string'
        ? {
            ...parsed.onboarding,
            // Plans saved before tracks existed scheduled every lesson, so
            // 'complete' is the reading that keeps their calendar identical.
            track: parsed.onboarding.track === 'essentials' ? 'essentials' : 'complete'
          }
        : null
    return {
      onboarding,
      completedIds: Array.isArray(parsed?.completedIds) ? parsed.completedIds.filter((id: unknown) => typeof id === 'string') : [],
      aheadUnlocked: Array.isArray(parsed?.aheadUnlocked) ? parsed.aheadUnlocked.filter((n: unknown) => typeof n === 'number') : []
    }
  } catch {
    return { onboarding: null, completedIds: [], aheadUnlocked: [] }
  }
}

const saveStoredState = (email: string, state: StoredState) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(scopeKey(email), JSON.stringify(state))
  } catch {
    // Storage full or blocked — plan just won't persist across reloads this session.
  }
}

const AREA_LABEL: Record<CourseLesson['area'], string> = {
  foundation: 'ไวยากรณ์พื้นฐาน',
  task1: 'Task 1',
  task2: 'Task 2',
  exam: 'ข้อสอบจำลอง'
}

/** Tier, said out loud. The academic wants to know what's a second example vs a
 *  topic-bank extra; the time-poor student wants to know what they can skip. */
const TIER_BADGE: Record<1 | 2 | 3, { label: string; className: string }> = {
  1: { label: 'แก่นสำคัญ', className: 'is-core' },
  2: { label: 'ตัวอย่างเพิ่ม', className: 'is-reinforce' },
  3: { label: 'ฝึกเสริม', className: 'is-extend' }
}

const COURSE_TITLE = 'IELTS Academic Writing — Intensive'

export function CourseHomePage({ onBackHome, learnerEmail, learnerName }: CourseHomePageProps) {
  // Read once via lazy initializers, not an effect — this is an admin-only
  // preview where `learnerEmail` doesn't change mid-session, so there's no
  // real "hydration" step: the first render already has the right state.
  const [onboarding, setOnboarding] = useState<WritingCourseOnboarding | null>(
    () => loadStoredState(learnerEmail).onboarding
  )
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set(loadStoredState(learnerEmail).completedIds))
  const [aheadUnlocked, setAheadUnlocked] = useState<Set<number>>(() => new Set(loadStoredState(learnerEmail).aheadUnlocked))
  const [view, setView] = useState<View>(() => (loadStoredState(learnerEmail).onboarding ? 'day' : 'hub'))
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  // Open on the chapter the student has actually reached, not always chapter 1 —
  // otherwise someone 40 lessons in lands on content they finished weeks ago.
  const [openChapters, setOpenChapters] = useState<Set<number>>(() => {
    const done = new Set(loadStoredState(learnerEmail).completedIds)
    const nextUp = WRITING_COURSE_LESSONS.find((lesson) => !done.has(lesson.id))
    return new Set([nextUp?.chapterIndex ?? 0])
  })
  const [confirmDayIndex, setConfirmDayIndex] = useState<number | null>(null)
  const [draftTrack, setDraftTrack] = useState<StudyTrack | null>(() => loadStoredState(learnerEmail).onboarding?.track ?? null)
  const [draftInterval, setDraftInterval] = useState(() => loadStoredState(learnerEmail).onboarding?.intervalDays ?? 1)
  const [draftMinutes, setDraftMinutes] = useState(() => loadStoredState(learnerEmail).onboarding?.minutesPerDay ?? 45)
  // Two-step wizard. Step 1 is a single tap that also picks sane defaults for
  // step 2, so the lowest-effort path through onboarding is tap → tap → done.
  const [onboardStep, setOnboardStep] = useState<'track' | 'pace'>('track')
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>('plan')
  const [sidebarQuery, setSidebarQuery] = useState('')
  // Desktop keeps the sidebar pinned; this only drives the mobile drawer.
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    saveStoredState(learnerEmail, {
      onboarding,
      completedIds: Array.from(completedIds),
      aheadUnlocked: Array.from(aheadUnlocked)
    })
  }, [learnerEmail, onboarding, completedIds, aheadUnlocked])

  const calendar = useMemo(() => (onboarding ? buildCalendar(onboarding, false) : []), [onboarding])
  const calendarByDate = useMemo(() => {
    const map = new Map<string, CalendarDay>()
    calendar.forEach((day) => map.set(day.dateIso, day))
    return map
  }, [calendar])
  const today = todayIsoDate()
  const activeTrack: StudyTrack = onboarding?.track ?? 'complete'
  const planIds = useMemo(() => trackLessonIds(activeTrack), [activeTrack])
  const todayPlan = useMemo(() => findTodayPlan(calendar, completedIds, aheadUnlocked), [calendar, completedIds, aheadUnlocked])
  const overall = useMemo(() => computeOverallProgress(completedIds, activeTrack), [completedIds, activeTrack])
  const typeProgress = useMemo(() => computeQuestionTypeProgress(completedIds, activeTrack), [completedIds, activeTrack])
  const finishDateIso = estimateFinishDateIso(calendar)

  // "Today" defaults to the plan's recommendation until the student explicitly
  // opens a different day (calendar click) — no effect needed, it's just a
  // fallback in the read, so it never desyncs after onboarding changes.
  const selectedDay = (selectedDayIndex !== null ? calendar[selectedDayIndex] : undefined) ?? todayPlan.day ?? null
  const selectedLessonIndex = selectedLessonId ? WRITING_COURSE_LESSONS.findIndex((l) => l.id === selectedLessonId) : -1
  const selectedLesson = selectedLessonIndex >= 0 ? WRITING_COURSE_LESSONS[selectedLessonIndex] : null
  const confirmDay = confirmDayIndex !== null ? calendar[confirmDayIndex] || null : null

  // Prev/next walk the whole course in Thinkific order, so a lesson is never a
  // dead end — even when it was reached from a single-lesson study day.
  const prevLesson = selectedLessonIndex > 0 ? WRITING_COURSE_LESSONS[selectedLessonIndex - 1] : null
  const nextLesson =
    selectedLessonIndex >= 0 && selectedLessonIndex < WRITING_COURSE_LESSONS.length - 1
      ? WRITING_COURSE_LESSONS[selectedLessonIndex + 1]
      : null

  /** The first lesson in course order that actually has a video — the honest answer
   *  to "where do I watch something right now?" while the migration is mid-flight. */
  const firstPlayable = useMemo(
    () => WRITING_COURSE_LESSONS.find((lesson) => lesson.bunnyVideoId && !completedIds.has(lesson.id)) ?? null,
    [completedIds]
  )

  const openLesson = (lessonId: string) => {
    const lesson = WRITING_COURSE_LESSONS.find((l) => l.id === lessonId)
    if (lesson) setOpenChapters((prev) => new Set(prev).add(lesson.chapterIndex))
    setSelectedLessonId(lessonId)
    setView('lesson')
    setSidebarOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleChapter = (chapterIndex: number) => {
    setOpenChapters((prev) => {
      const next = new Set(prev)
      if (next.has(chapterIndex)) next.delete(chapterIndex)
      else next.add(chapterIndex)
      return next
    })
  }

  const toggleComplete = (lessonId: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }

  const openDay = (day: CalendarDay) => {
    if (isDayLocked(day, today, aheadUnlocked, completedIds)) {
      setConfirmDayIndex(day.index)
      return
    }
    setSelectedDayIndex(day.index)
    setView('day')
  }

  const confirmStudyAhead = () => {
    if (confirmDayIndex === null) return
    setAheadUnlocked((prev) => new Set(prev).add(confirmDayIndex))
    setSelectedDayIndex(confirmDayIndex)
    setView('day')
    setConfirmDayIndex(null)
  }

  const startOnboarding = (step: 'track' | 'pace' = 'track') => {
    setDraftTrack(onboarding?.track ?? null)
    setDraftInterval(onboarding?.intervalDays ?? 1)
    setDraftMinutes(onboarding?.minutesPerDay ?? 45)
    setOnboardStep(onboarding ? step : 'track')
    setView('onboarding')
  }

  /** Picking a track is one tap: it also seeds the pace step and advances. */
  const pickTrack = (track: StudyTrack) => {
    const meta = TRACK_BY_ID[track]
    setDraftTrack(track)
    setDraftInterval(onboarding?.track === track ? onboarding.intervalDays : meta.defaultIntervalDays)
    setDraftMinutes(onboarding?.track === track ? onboarding.minutesPerDay : meta.defaultMinutesPerDay)
    setOnboardStep('pace')
  }

  const confirmOnboarding = () => {
    const track = draftTrack ?? 'complete'
    setOnboarding({
      track,
      intervalDays: draftInterval,
      minutesPerDay: draftMinutes,
      // Keep the original start date when only adjusting pace, so an existing
      // student's calendar shifts rather than restarting from scratch.
      startDateIso: onboarding?.startDateIso ?? todayIsoDate()
    })
    setSelectedDayIndex(null)
    setSidebarFilter('plan')
    setView('day')
  }

  const switchTrack = (track: StudyTrack) => {
    if (!onboarding) return
    setOnboarding({ ...onboarding, track })
    setSelectedDayIndex(null)
  }

  // Preview the plan the current draft would produce, so the pace step answers
  // "what does this actually cost me?" before committing.
  const draftPreview = useMemo(() => {
    const track = draftTrack ?? 'complete'
    const cal = buildCalendar(
      { track, intervalDays: draftInterval, minutesPerDay: draftMinutes, startDateIso: todayIsoDate() },
      track === 'complete'
    )
    return { days: cal.length, finishIso: estimateFinishDateIso(cal), summary: summarizeTrack(track) }
  }, [draftTrack, draftInterval, draftMinutes])

  // ------------------------------------------------------- gate screens --
  if (view === 'hub' || view === 'onboarding' || !onboarding) {
    return (
      <div className="courseWritingPage">
        <div className="cwTopBar">
          <button type="button" className="cwBack" onClick={onBackHome}>
            ← กลับหน้าหลัก
          </button>
          <span className="cwTopBarLabel">Course · Admin preview</span>
        </div>

        {view === 'onboarding' ? (
          <OnboardingView
            onboarding={onboarding}
            onboardStep={onboardStep}
            setOnboardStep={setOnboardStep}
            draftTrack={draftTrack}
            draftInterval={draftInterval}
            draftMinutes={draftMinutes}
            setDraftInterval={setDraftInterval}
            setDraftMinutes={setDraftMinutes}
            draftPreview={draftPreview}
            onPickTrack={pickTrack}
            onConfirm={confirmOnboarding}
            onExit={() => setView(onboarding ? 'day' : 'hub')}
          />
        ) : (
          <HubView
            hasPlan={Boolean(onboarding)}
            onStartPlanning={() => startOnboarding('track')}
            onResume={() => {
              setSelectedDayIndex(null)
              setView('day')
            }}
          />
        )}
      </div>
    )
  }

  // ------------------------------------------------------- course shell --
  const trackMeta = TRACK_BY_ID[activeTrack]

  return (
    <div className="courseWritingPage cwApp">
      <header className="cwAppBar">
        <button type="button" className="cwIconBtn cwSidebarToggle" onClick={() => setSidebarOpen((v) => !v)} aria-label="เปิดรายการบทเรียน">
          ☰
        </button>
        <button type="button" className="cwBack cwBack-bare" onClick={onBackHome}>
          ←
        </button>
        <div className="cwAppBarTitle">
          <b>{COURSE_TITLE}</b>
          <small>
            {trackMeta.emoji} {trackMeta.label} · {overall.completedLessons}/{overall.totalLessons} บท
          </small>
        </div>
        <div className="cwAppBarProgress" aria-label={`ความคืบหน้า ${overall.percent}%`}>
          <div className="cwAppBarTrack">
            <i style={{ width: `${overall.percent}%` }} />
          </div>
          <span>{overall.percent}%</span>
        </div>
        <button type="button" className="cwBtn cwBtn-ghost cwBtn-small cwAppBarPlan" onClick={() => startOnboarding('pace')}>
          แผนของฉัน
        </button>
      </header>

      <div className="cwAppBody">
        {sidebarOpen && <div className="cwSidebarScrim" onClick={() => setSidebarOpen(false)} />}

        <aside className={`cwSidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <CurriculumSidebar
            completedIds={completedIds}
            openChapters={openChapters}
            onToggleChapter={toggleChapter}
            onOpenLesson={openLesson}
            planIds={planIds}
            activeTrack={activeTrack}
            filter={sidebarFilter}
            onFilterChange={setSidebarFilter}
            query={sidebarQuery}
            onQueryChange={setSidebarQuery}
            selectedLessonId={selectedLessonId}
            onSwitchTrack={switchTrack}
          />
        </aside>

        <main className="cwMain">
          {view === 'lesson' && selectedLesson && (
            <LessonPanel
              lesson={selectedLesson}
              lessonNumber={selectedLessonIndex + 1}
              isDone={completedIds.has(selectedLesson.id)}
              inPlan={planIds.has(selectedLesson.id)}
              trackLabel={trackMeta.label}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onToggleComplete={() => toggleComplete(selectedLesson.id)}
              onOpenLesson={openLesson}
              onBackToPlan={() => setView('day')}
            />
          )}

          {view === 'day' && (
            <DayPanel
              learnerName={learnerName}
              selectedDay={selectedDay}
              today={today}
              todayPlan={todayPlan}
              overall={overall}
              finishDateIso={finishDateIso}
              completedIds={completedIds}
              firstPlayable={firstPlayable}
              onOpenLesson={openLesson}
              onStudyAhead={(index) => setConfirmDayIndex(index)}
              onOpenCalendar={() => setView('calendar')}
              onOpenProgress={() => setView('progress')}
            />
          )}

          {view === 'calendar' && (
            <CalendarView
              calendar={calendar}
              calendarByDate={calendarByDate}
              onboarding={onboarding}
              today={today}
              completedIds={completedIds}
              aheadUnlocked={aheadUnlocked}
              onBack={() => setView('day')}
              onOpenDay={openDay}
            />
          )}

          {view === 'progress' && (
            <ProgressPanel
              typeProgress={typeProgress}
              activeTrack={activeTrack}
              onSwitchTrack={switchTrack}
              onBack={() => setView('day')}
            />
          )}
        </main>
      </div>

      {confirmDay && (
        <div className="cwModalScrim" role="dialog" aria-modal="true">
          <div className="cwModal">
            <h3>วันนี้ยังไม่ถึงคิวตามแผน</h3>
            <p>
              บทเรียนนี้คิวไว้วันที่ <b>{formatThaiDayMonth(confirmDay.dateIso)}</b> อยากเรียนล่วงหน้าตอนนี้เลยไหม?
            </p>
            <ul className="cwModalPreview">
              {confirmDay.lessons.slice(0, 3).map((lesson) => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
              {confirmDay.lessons.length > 3 && <li>และอีก {confirmDay.lessons.length - 3} บท</li>}
            </ul>
            <div className="cwModalActions">
              <button type="button" className="cwBtn cwBtn-ghost" onClick={() => setConfirmDayIndex(null)}>
                ไว้ทีหลัง
              </button>
              <button type="button" className="cwBtn cwBtn-primary" onClick={confirmStudyAhead}>
                ใช่ เรียนเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================== hub ======

function HubView({
  hasPlan,
  onStartPlanning,
  onResume
}: {
  hasPlan: boolean
  onStartPlanning: () => void
  onResume: () => void
}) {
  const pending = WRITING_COURSE_LESSON_COUNT - WRITING_COURSE_VIDEO_READY_COUNT

  return (
    <section className="cwHub">
      <div className="cwHero">
        <div className="cwHeroText">
          <p className="cwKicker">คอร์สวิดีโอ + แผนเรียนส่วนตัว</p>
          <h1>{COURSE_TITLE}</h1>
          <p className="cwHeroLede">
            Task 1 ทุกชนิดกราฟ และ Task 2 ครบทั้ง 4 คำถาม ตั้งแต่ไวยากรณ์พื้นฐานไปจนถึงข้อสอบจำลอง
            ตอบแค่ 2 คำถามเรื่องเวลา แล้วระบบจัดปฏิทินรายวันให้ทั้งหมด
          </p>
          <div className="cwHeroStats">
            <div>
              <b>{WRITING_COURSE_LESSON_COUNT}</b>
              <span>บทเรียน</span>
            </div>
            <div>
              <b>{formatMinutesAsHours(WRITING_COURSE_TOTAL_MINUTES)}</b>
              <span>ชั่วโมง</span>
            </div>
            <div>
              <b>{WRITING_COURSE_CHAPTER_NAMES.length}</b>
              <span>บท</span>
            </div>
            <div>
              <b>10</b>
              <span>ชนิดโจทย์</span>
            </div>
          </div>
          <div className="cwHeroActions">
            {hasPlan ? (
              <>
                <button type="button" className="cwBtn cwBtn-primary cwBtn-lg" onClick={onResume}>
                  เรียนต่อ
                </button>
                <button type="button" className="cwBtn cwBtn-ghost cwBtn-lg" onClick={onStartPlanning}>
                  แก้ไขแผนการเรียน
                </button>
              </>
            ) : (
              <button type="button" className="cwBtn cwBtn-primary cwBtn-lg" onClick={onStartPlanning}>
                เริ่มวางแผนการเรียน →
              </button>
            )}
          </div>
          {pending > 0 && (
            <p className="cwHeroNote">
              พร้อมดูแล้ว {WRITING_COURSE_VIDEO_READY_COUNT} บท · กำลังอัปโหลดอีก {pending} บท
            </p>
          )}
        </div>

        <div className="cwHeroArt" aria-hidden="true">
          <div className="cwHeroArtCard">
            <span>📈</span>
            <b>Line Graph</b>
          </div>
          <div className="cwHeroArtCard">
            <span>🥧</span>
            <b>Pie Chart</b>
          </div>
          <div className="cwHeroArtCard">
            <span>🗺️</span>
            <b>Map</b>
          </div>
          <div className="cwHeroArtCard">
            <span>🗣️</span>
            <b>Discuss Both Views</b>
          </div>
        </div>
      </div>

      <h2 className="cwSectionTitle">เนื้อหาในคอร์ส</h2>
      <div className="cwChapterPreview">
        {WRITING_COURSE_CHAPTERS.map((chapter) => (
          <div key={chapter.index} className="cwChapterPreviewCard">
            <b>{chapter.name}</b>
            <small>
              {chapter.lessons.length} บทเรียน
              {chapter.minutes > 0 ? ` · ${formatMinutesAsHours(chapter.minutes)} ชม.` : ''}
            </small>
          </div>
        ))}
      </div>

      <div className="cwOtherCourse">
        <span className="cwPill">เร็ว ๆ นี้</span>
        <p>Speaking · Reading · Listening — จะย้ายมาใช้ระบบวางแผนเดียวกันในเฟสถัดไป</p>
      </div>
    </section>
  )
}

// ======================================================== onboarding =====

type OnboardingViewProps = {
  onboarding: WritingCourseOnboarding | null
  onboardStep: 'track' | 'pace'
  setOnboardStep: (step: 'track' | 'pace') => void
  draftTrack: StudyTrack | null
  draftInterval: number
  draftMinutes: number
  setDraftInterval: (n: number) => void
  setDraftMinutes: (n: number) => void
  draftPreview: { days: number; finishIso: string | null; summary: { lessonCount: number } }
  onPickTrack: (track: StudyTrack) => void
  onConfirm: () => void
  onExit: () => void
}

function OnboardingView({
  onboarding,
  onboardStep,
  setOnboardStep,
  draftTrack,
  draftInterval,
  draftMinutes,
  setDraftInterval,
  setDraftMinutes,
  draftPreview,
  onPickTrack,
  onConfirm,
  onExit
}: OnboardingViewProps) {
  return (
    <section className="cwOnboard">
      <button
        type="button"
        className="cwBack cwBack-inline"
        onClick={() => (onboardStep === 'pace' && !onboarding ? setOnboardStep('track') : onExit())}
      >
        ← ย้อนกลับ
      </button>

      <div className="cwSteps" aria-hidden="true">
        <i className="is-on" />
        <i className={onboardStep === 'pace' ? 'is-on' : ''} />
      </div>

      {onboardStep === 'track' ? (
        <>
          <p className="cwKicker">ขั้นที่ 1 จาก 2</p>
          <h1>อยากเรียนแบบไหน?</h1>
          <p className="cwLede">
            ไม่ต้องบอกจุดอ่อน — ทั้งสองแบบครอบคลุมครบทั้ง 10 ชนิดโจทย์ที่ออกสอบ ต่างกันแค่ความลึกและเวลาที่ต้องใช้ เปลี่ยนทีหลังได้ตลอด
          </p>

          <div className="cwTrackPick">
            {STUDY_TRACKS.map((track) => {
              const summary = summarizeTrack(track.id)
              const isCurrent = onboarding?.track === track.id
              return (
                <button
                  key={track.id}
                  type="button"
                  className={`cwTrackCard ${draftTrack === track.id ? 'is-active' : ''}`}
                  onClick={() => onPickTrack(track.id)}
                >
                  <span className="cwTrackTop">
                    <span className="cwTrackEmoji" aria-hidden="true">
                      {track.emoji}
                    </span>
                    {isCurrent && <span className="cwPill cwPill-onDark cwPill-small">แผนปัจจุบัน</span>}
                  </span>
                  <b className="cwTrackLabel">{track.label}</b>
                  <span className="cwTrackTagline">{track.tagline}</span>
                  <span className="cwTrackFacts">
                    <span>
                      <b>{summary.lessonCount}</b> บทเรียน
                    </span>
                    <span>
                      <b>{formatMinutesAsHours(summary.minutes)}</b> ชม.
                    </span>
                    <span>
                      <b>{summary.gradedTypesCovered}/10</b> ชนิดโจทย์
                    </span>
                  </span>
                  <ul className="cwTrackBullets">
                    {track.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <span className="cwTrackGo">เลือกแบบนี้ →</span>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <p className="cwKicker">ขั้นที่ 2 จาก 2</p>
          <h1>มีเวลาเรียนแค่ไหน?</h1>
          <p className="cwLede">เลือกไว้ให้แล้วตามแบบที่คุณเลือก — กด "สร้างปฏิทินของฉัน" ได้เลย หรือปรับก่อนก็ได้</p>

          <div className="cwQuestion">
            <h3>เรียนถี่แค่ไหน?</h3>
            <div className="cwChipRow">
              {ONBOARDING_INTERVAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cwChip ${draftInterval === opt.value ? 'is-active' : ''}`}
                  aria-pressed={draftInterval === opt.value}
                  onClick={() => setDraftInterval(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cwQuestion">
            <h3>เรียนได้กี่นาทีต่อครั้ง?</h3>
            <div className="cwChipRow">
              {ONBOARDING_MINUTE_OPTIONS.filter((opt) => opt.value <= TRACK_BY_ID[draftTrack ?? 'complete'].maxMinutesPerDay).map(
                (opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`cwChip ${draftMinutes === opt.value ? 'is-active' : ''}`}
                    aria-pressed={draftMinutes === opt.value}
                    onClick={() => setDraftMinutes(opt.value)}
                  >
                    {opt.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="cwEstimate">
            <b>{TRACK_BY_ID[draftTrack ?? 'complete'].label}</b> · {draftPreview.summary.lessonCount} บทเรียน — ที่จังหวะนี้จะใช้เวลา{' '}
            <b>{draftPreview.days}</b> ครั้ง เรียนจบประมาณวันที่{' '}
            <b>{draftPreview.finishIso ? formatThaiDayMonth(draftPreview.finishIso) : '—'}</b>
            <button type="button" className="cwEstimateSwap" onClick={() => setOnboardStep('track')}>
              เปลี่ยนแบบการเรียน
            </button>
          </div>

          <button type="button" className="cwBtn cwBtn-primary cwBtn-block cwBtn-lg" onClick={onConfirm}>
            สร้างปฏิทินของฉัน
          </button>
        </>
      )}
    </section>
  )
}

// =========================================================== sidebar =====

type CurriculumSidebarProps = {
  completedIds: Set<string>
  openChapters: Set<number>
  onToggleChapter: (chapterIndex: number) => void
  onOpenLesson: (lessonId: string) => void
  planIds: Set<string>
  activeTrack: StudyTrack
  filter: SidebarFilter
  onFilterChange: (filter: SidebarFilter) => void
  query: string
  onQueryChange: (query: string) => void
  selectedLessonId: string | null
  onSwitchTrack: (track: StudyTrack) => void
}

function CurriculumSidebar({
  completedIds,
  openChapters,
  onToggleChapter,
  onOpenLesson,
  planIds,
  activeTrack,
  filter,
  onFilterChange,
  query,
  onQueryChange,
  selectedLessonId,
  onSwitchTrack
}: CurriculumSidebarProps) {
  const trimmedQuery = query.trim().toLowerCase()

  // Searching means "find me that one lesson" — it has to reach the whole
  // catalogue regardless of which filter chip happens to be active.
  const matchesFilter = (lesson: CourseLesson) => {
    if (trimmedQuery) return lesson.title.toLowerCase().includes(trimmedQuery)
    if (filter === 'core') return lesson.tier === 1
    if (filter === 'plan') return planIds.has(lesson.id)
    if (filter === 'ready') return Boolean(lesson.bunnyVideoId)
    return true
  }

  const visibleChapters = WRITING_COURSE_CHAPTERS.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.filter(matchesFilter)
  })).filter((chapter) => chapter.lessons.length > 0)

  const visibleCount = visibleChapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)
  const coreCount = WRITING_COURSE_LESSONS.filter((l) => l.tier === 1).length

  const FILTERS: { id: SidebarFilter; label: string; count: number }[] = [
    { id: 'plan', label: 'แผนฉัน', count: planIds.size },
    { id: 'core', label: 'บทแก่น', count: coreCount },
    { id: 'ready', label: 'พร้อมดู', count: WRITING_COURSE_VIDEO_READY_COUNT },
    { id: 'all', label: 'ทั้งหมด', count: WRITING_COURSE_LESSON_COUNT }
  ]

  return (
    <div className="cwSidebarInner">
      <div className="cwSidebarHead">
        <h2>เนื้อหาคอร์ส</h2>
        <input
          type="search"
          className="cwSearch"
          value={query}
          placeholder="ค้นหาบทเรียน…"
          aria-label="ค้นหาบทเรียน"
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <div className="cwFilterRow" role="group" aria-label="กรองบทเรียน">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`cwChip cwChip-sm ${filter === f.id && !trimmedQuery ? 'is-active' : ''}`}
              aria-pressed={filter === f.id && !trimmedQuery}
              onClick={() => {
                onQueryChange('')
                onFilterChange(f.id)
              }}
            >
              {f.label} <span className="cwChipCount">{f.count}</span>
            </button>
          ))}
        </div>
        {trimmedQuery && <p className="cwSearchNote">{visibleCount > 0 ? `พบ ${visibleCount} บทเรียน` : 'ไม่พบบทเรียนที่ตรงกัน'}</p>}
        {!trimmedQuery && filter === 'plan' && activeTrack === 'essentials' && (
          <button type="button" className="cwSidebarUpgrade" onClick={() => onSwitchTrack('complete')}>
            + เพิ่มอีก {WRITING_COURSE_LESSON_COUNT - planIds.size} บทเข้าแผน
          </button>
        )}
      </div>

      <div className="cwSidebarScroll">
        {visibleChapters.map((chapter) => {
          // A search should show its hits rather than making the student expand
          // 13 chapters to find them.
          const isOpen = openChapters.has(chapter.index) || Boolean(trimmedQuery)
          const doneCount = chapter.lessons.filter((lesson) => completedIds.has(lesson.id)).length
          const allDone = doneCount === chapter.lessons.length

          return (
            <div
              key={chapter.index}
              className={`cwSideChapter ${isOpen ? 'is-open' : ''} ${allDone ? 'is-complete' : ''}`}
            >
              <button type="button" className="cwSideChapterHead" aria-expanded={isOpen} onClick={() => onToggleChapter(chapter.index)}>
                {/* The chapter's own number, not a caret — the block's top rule
                    already carries open/closed state. */}
                <span className="cwChapterCaret" aria-hidden="true">
                  {chapter.index + 1}
                </span>
                <span className="cwSideChapterTitle">
                  <b>{chapter.name}</b>
                  <small>
                    {doneCount}/{chapter.lessons.length} บท
                    {chapter.minutes > 0 ? ` · ${formatMinutesAsHours(chapter.minutes)} ชม.` : ''}
                  </small>
                </span>
                {allDone && <span className="cwSideChapterDone">✓</span>}
              </button>

              <ul className="cwSideLessons" hidden={!isOpen}>
                {chapter.lessons.map((lesson) => {
                  const done = completedIds.has(lesson.id)
                  const isActive = lesson.id === selectedLessonId
                  const inPlan = planIds.has(lesson.id)
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={`cwSideLesson ${done ? 'is-done' : ''} ${isActive ? 'is-active' : ''} ${!inPlan ? 'is-bonus' : ''}`}
                        onClick={() => onOpenLesson(lesson.id)}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <span className={`cwSideMark ${done ? 'is-done' : ''}`} aria-hidden="true">
                          {done ? '✓' : lesson.bunnyVideoId ? '▶' : '○'}
                        </span>
                        <span className="cwSideLessonBody">
                          <b>{lesson.title}</b>
                          <small>
                            {lesson.minutes > 0 ? `${lesson.minutes} นาที` : 'แบบฝึกหัด'}
                            {!lesson.bunnyVideoId ? ' · กำลังอัปโหลด' : ''}
                          </small>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================ lesson =====

type LessonPanelProps = {
  lesson: CourseLesson
  lessonNumber: number
  isDone: boolean
  inPlan: boolean
  trackLabel: string
  prevLesson: CourseLesson | null
  nextLesson: CourseLesson | null
  onToggleComplete: () => void
  onOpenLesson: (lessonId: string) => void
  onBackToPlan: () => void
}

function LessonPanel({
  lesson,
  lessonNumber,
  isDone,
  inPlan,
  trackLabel,
  prevLesson,
  nextLesson,
  onToggleComplete,
  onOpenLesson,
  onBackToPlan
}: LessonPanelProps) {
  const tier = TIER_BADGE[lesson.tier]

  return (
    <article className="cwLessonPanel">
      {/* Title above the player, not under it: OpenClassrooms leads every course
          page with the heading and treats the video as a course resource. */}
      <div className="cwLessonMeta2">
        <span className="cwLessonCrumb">
          {lesson.chapterName} · บทที่ {lessonNumber} จาก {WRITING_COURSE_LESSON_COUNT}
        </span>
        <h1>{lesson.title}</h1>
        <div className="cwLessonTags">
          <span className={`cwTier ${tier.className}`}>{tier.label}</span>
          <span className="cwMetaDot">{AREA_LABEL[lesson.area]}</span>
          <span className="cwMetaDot">{QUESTION_TYPE_BY_ID[lesson.questionType].label}</span>
          <span className="cwMetaDot">{lesson.minutes > 0 ? `${lesson.minutes} นาที` : 'แบบฝึกหัด'}</span>
          {lesson.band75Only && <span className="cwMetaDot">Band 7.5+</span>}
        </div>
      </div>

      <div className="cwPlayer">
        {lesson.bunnyVideoId ? (
          <iframe
            key={lesson.id}
            src={`https://iframe.mediadelivery.net/embed/712721/${lesson.bunnyVideoId}?autoplay=false`}
            loading="lazy"
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div className="cwPlayerEmpty">
            <span aria-hidden="true">⏳</span>
            <b>วิดีโอบทนี้กำลังอัปโหลด</b>
            <p>เนื้อหาบทอื่นเรียนต่อได้ตามปกติ — กรองด้วย "พร้อมดู" ในแถบซ้ายเพื่อดูบทที่ดูได้แล้ว</p>
          </div>
        )}
      </div>

      {!inPlan && (
        <p className="cwBonusNote">บทนี้เป็นบทเสริม ไม่ได้อยู่ในแผน{trackLabel}ของคุณ — ดูได้ตามสบาย ไม่กระทบความคืบหน้า</p>
      )}

      {lesson.documents && lesson.documents.length > 0 && (
        <div className="cwLessonDocs">
          <b>เอกสารประกอบบทเรียน</b>
          <ul>
            {lesson.documents.map((doc) => (
              <li key={doc.path}>
                <a href={doc.path} download target="_blank" rel="noreferrer">
                  📄 {doc.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="cwLessonActions">
        <button type="button" className={`cwBtn ${isDone ? 'cwBtn-ghost' : 'cwBtn-primary'}`} onClick={onToggleComplete}>
          {isDone ? '✓ ดูจบแล้ว — กดเพื่อยกเลิก' : 'ทำเครื่องหมายว่าดูจบแล้ว'}
        </button>
        {nextLesson && (
          <button
            type="button"
            className="cwBtn cwBtn-ghost"
            onClick={() => {
              if (!isDone) onToggleComplete()
              onOpenLesson(nextLesson.id)
            }}
          >
            เรียนจบแล้ว ไปบทถัดไป →
          </button>
        )}
        <button type="button" className="cwBtn cwBtn-quiet" onClick={onBackToPlan}>
          กลับไปงานวันนี้
        </button>
      </div>

      <nav className="cwLessonNav" aria-label="บทเรียนก่อนหน้า / ถัดไป">
        {prevLesson ? (
          <button type="button" className="cwLessonNavBtn" onClick={() => onOpenLesson(prevLesson.id)}>
            <small>← บทก่อนหน้า</small>
            <b>{prevLesson.title}</b>
          </button>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <button type="button" className="cwLessonNavBtn cwLessonNavBtn-next" onClick={() => onOpenLesson(nextLesson.id)}>
            <small>บทถัดไป →</small>
            <b>{nextLesson.title}</b>
          </button>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}

// =============================================================== day =====

type DayPanelProps = {
  learnerName: string
  selectedDay: CalendarDay | null
  today: string
  todayPlan: ReturnType<typeof findTodayPlan>
  overall: ReturnType<typeof computeOverallProgress>
  finishDateIso: string | null
  completedIds: Set<string>
  firstPlayable: CourseLesson | null
  onOpenLesson: (lessonId: string) => void
  onStudyAhead: (dayIndex: number) => void
  onOpenCalendar: () => void
  onOpenProgress: () => void
}

function DayPanel({
  learnerName,
  selectedDay,
  today,
  todayPlan,
  overall,
  finishDateIso,
  completedIds,
  firstPlayable,
  onOpenLesson,
  onStudyAhead,
  onOpenCalendar,
  onOpenProgress
}: DayPanelProps) {
  const nextUp = selectedDay?.lessons.find((lesson) => !completedIds.has(lesson.id)) ?? null

  return (
    <div className="cwDayPanel">
      <div className="cwDayHead">
        <p className="cwKicker">สวัสดี {learnerName || 'นักเรียน'}</p>
        <h1>
          {todayPlan.isCourseComplete
            ? 'เรียนครบทั้งคอร์สแล้ว 🎉'
            : selectedDay
              ? selectedDay.dateIso === today
                ? 'งานวันนี้'
                : `วันที่ ${formatThaiDayMonth(selectedDay.dateIso)}`
              : 'ยังไม่มีแผนเรียน'}
        </h1>
        <p className="cwDaySub">
          {overall.completedLessons}/{overall.totalLessons} บทในแผนของคุณ · {formatMinutesAsHours(overall.completedMinutes)} /{' '}
          {formatMinutesAsHours(overall.totalMinutes)} ชม.
          {finishDateIso && !todayPlan.isCourseComplete ? ` · คาดว่าจะจบวันที่ ${formatThaiDayMonth(finishDateIso)}` : ''}
          {overall.bonusCompleted > 0 ? ` · บทเสริมอีก ${overall.bonusCompleted} บท` : ''}
        </p>
      </div>

      {todayPlan.isCourseComplete ? (
        <article className="cwTodayCard cwTodayCard-done">
          <p>ครบทุกบทเรียนแล้ว — ถึงเวลาซ้อมข้อสอบเต็มชุดจับเวลาจริง</p>
        </article>
      ) : selectedDay && todayPlan.isLocked && selectedDay.index === todayPlan.day?.index ? (
        <article className="cwTodayCard cwTodayCard-ahead">
          <p>
            คุณเรียนไปไกลกว่าแผนที่ตั้งไว้แล้ว 🎉 บทถัดไปคิวไว้วันที่ <b>{formatThaiDayMonth(selectedDay.dateIso)}</b>
          </p>
          <button type="button" className="cwBtn cwBtn-primary" onClick={() => onStudyAhead(selectedDay.index)}>
            อยากเรียนล่วงหน้าตอนนี้เลย
          </button>
        </article>
      ) : selectedDay ? (
        <article className="cwTodayCard">
          <div className="cwTodayTop">
            <span className="cwPill cwPill-onDark">
              {selectedDay.dateIso === today ? 'งานวันนี้' : formatThaiDayMonth(selectedDay.dateIso)}
            </span>
            <span className="cwTodayMinutes">
              {selectedDay.minutes > 0 ? `${selectedDay.minutes} นาที` : 'แบบฝึกหัด'} · {selectedDay.lessons.length} บท
            </span>
          </div>

          {/* The single obvious action. Everything below it is optional detail —
              a student who only ever taps this button still finishes the course. */}
          {nextUp ? (
            <button type="button" className="cwStartBtn" onClick={() => onOpenLesson(nextUp.id)}>
              <span className="cwStartIcon" aria-hidden="true">
                ▶
              </span>
              <span className="cwStartBody">
                <small>เริ่มตรงนี้</small>
                <b>{nextUp.title}</b>
              </span>
              <span className="cwStartMin">{nextUp.minutes > 0 ? `${nextUp.minutes} นาที` : 'แบบฝึกหัด'}</span>
            </button>
          ) : (
            <p className="cwDayDone">✓ วันนี้เรียนครบแล้ว — พักได้เลย</p>
          )}

          {selectedDay.isLongSession && (
            <p className="cwLongNote">
              บทนี้ยาวกว่าที่ตั้งไว้ ({selectedDay.minutes} นาที) — เป็นคลิปเดียวจบ แบ่งดูสองรอบได้ ไม่ต้องจบในครั้งเดียว
            </p>
          )}

          {/* The migration is mid-flight, so today's lesson may have no video yet.
              Say so and offer the nearest thing that does play, rather than
              handing the student a dead placeholder. */}
          {nextUp && !nextUp.bunnyVideoId && firstPlayable && (
            <div className="cwPendingNote">
              <p>
                วิดีโอบทนี้ยังอัปโหลดไม่เสร็จ ({WRITING_COURSE_VIDEO_READY_COUNT} จาก {WRITING_COURSE_LESSON_COUNT} บทพร้อมแล้ว)
                — เริ่มจากบทที่ดูได้ก่อนก็ได้
              </p>
              <button type="button" className="cwBtn cwBtn-ghost cwBtn-small" onClick={() => onOpenLesson(firstPlayable.id)}>
                ▶ {firstPlayable.title}
              </button>
            </div>
          )}

          {selectedDay.lessons.length > 1 && (
            <ul className="cwTodayList">
              {selectedDay.lessons.map((lesson) => {
                const done = completedIds.has(lesson.id)
                return (
                  <li key={lesson.id} className={done ? 'is-done' : ''}>
                    <button type="button" className="cwTodayItem" onClick={() => onOpenLesson(lesson.id)}>
                      <span className="cwThumb">{QUESTION_TYPE_BY_ID[lesson.questionType].thumbnailEmoji}</span>
                      <span className={`cwCheck ${done ? 'is-done' : ''}`}>{done ? '✓' : ''}</span>
                      <span className="cwTodayItemBody">
                        <b>{lesson.title}</b>
                        <small>
                          {QUESTION_TYPE_BY_ID[lesson.questionType].label} ·{' '}
                          {lesson.minutes > 0 ? `${lesson.minutes} นาที` : 'แบบฝึกหัด'}
                        </small>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {selectedDay.writingPrompt && (
            <div className="cwWritingPrompt">
              <b>งานเขียนแนะนำ</b>
              <p>{selectedDay.writingPrompt}</p>
            </div>
          )}
        </article>
      ) : null}

      <div className="cwTodayNav">
        <button type="button" className="cwNavCard" onClick={onOpenCalendar}>
          <b>ปฏิทินการเรียน</b>
          <span>ดูทุกวันตั้งแต่ต้นจนจบ</span>
        </button>
        <button type="button" className="cwNavCard" onClick={onOpenProgress}>
          <b>จุดที่ทำสำเร็จแล้ว</b>
          <span>ความคืบหน้าแยกตามชนิดโจทย์</span>
        </button>
      </div>
    </div>
  )
}

// ========================================================== progress =====

function ProgressPanel({
  typeProgress,
  activeTrack,
  onSwitchTrack,
  onBack
}: {
  typeProgress: ReturnType<typeof computeQuestionTypeProgress>
  activeTrack: StudyTrack
  onSwitchTrack: (track: StudyTrack) => void
  onBack: () => void
}) {
  return (
    <div className="cwProgressPage">
      <button type="button" className="cwBack cwBack-inline" onClick={onBack}>
        ← กลับไปงานวันนี้
      </button>
      <h1>จุดที่ทำสำเร็จแล้ว</h1>
      <p className="cwLede">
        10 ชนิดโจทย์ที่ข้อสอบจริงออกได้ — ทุกชนิดถูกจัดให้อยู่ในแผนตั้งแต่ต้น ไม่ว่าจะเรียนถี่แค่ไหน นับตามแผน
        {TRACK_BY_ID[activeTrack].label}ของคุณ
      </p>

      <div className="cwTrackSwitch">
        {STUDY_TRACKS.map((track) => {
          const summary = summarizeTrack(track.id)
          return (
            <button
              key={track.id}
              type="button"
              className={`cwTrackSwitchBtn ${activeTrack === track.id ? 'is-active' : ''}`}
              aria-pressed={activeTrack === track.id}
              onClick={() => onSwitchTrack(track.id)}
            >
              <b>
                {track.emoji} {track.label}
              </b>
              <small>
                {summary.lessonCount} บท · {formatMinutesAsHours(summary.minutes)} ชม.
              </small>
            </button>
          )
        })}
      </div>

      {(['task1', 'task2'] as const).map((area) => (
        <div key={area} className="cwTypeGroup">
          <h2>{AREA_LABEL[area]}</h2>
          <div className="cwTypeGrid">
            {typeProgress
              .filter((t) => t.area === AREA_LABEL[area])
              .map((t) => (
                <div key={t.id} className={`cwTypeCard ${t.isMastered ? 'is-mastered' : ''}`}>
                  <div className="cwTypeCardTop">
                    <span className="cwThumb">{QUESTION_TYPE_BY_ID[t.id].thumbnailEmoji}</span>
                    <b>{t.label}</b>
                    {t.isMastered && <span className="cwCheck is-done">✓</span>}
                  </div>
                  <div className="cwTrack">
                    <i style={{ width: t.total ? `${(t.completed / t.total) * 100}%` : '0%' }} />
                  </div>
                  <span className="cwTypeCount">
                    {t.completed} / {t.total} บท
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ========================================================== calendar =====

type CalendarViewProps = {
  calendar: CalendarDay[]
  calendarByDate: Map<string, CalendarDay>
  onboarding: WritingCourseOnboarding
  today: string
  completedIds: Set<string>
  aheadUnlocked: Set<number>
  onBack: () => void
  onOpenDay: (day: CalendarDay) => void
}

function CalendarView({ calendar, calendarByDate, onboarding, today, completedIds, aheadUnlocked, onBack, onOpenDay }: CalendarViewProps) {
  if (!calendar.length) {
    return (
      <div className="cwCalendar">
        <button type="button" className="cwBack cwBack-inline" onClick={onBack}>
          ← กลับ
        </button>
        <h1>ปฏิทินการเรียน</h1>
        <p className="cwLede">ยังไม่มีแผนเรียน</p>
      </div>
    )
  }

  const start = fromIsoDate(calendar[0].dateIso)
  const end = fromIsoDate(calendar[calendar.length - 1].dateIso)
  const months: { year: number; monthIndex0: number }[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  while (cursor.getFullYear() < end.getFullYear() || (cursor.getFullYear() === end.getFullYear() && cursor.getMonth() <= end.getMonth())) {
    months.push({ year: cursor.getFullYear(), monthIndex0: cursor.getMonth() })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  const intervalLabel = ONBOARDING_INTERVAL_OPTIONS.find((o) => o.value === onboarding.intervalDays)?.label
  const minutesLabel = ONBOARDING_MINUTE_OPTIONS.find((o) => o.value === onboarding.minutesPerDay)?.label

  return (
    <div className="cwCalendar">
      <button type="button" className="cwBack cwBack-inline" onClick={onBack}>
        ← กลับไปงานวันนี้
      </button>
      <h1>ปฏิทินการเรียน</h1>
      <p className="cwLede">
        {calendar.length} วันเรียน · {intervalLabel} · {minutesLabel}/ครั้ง — ข้ามวันได้ ปฏิทินไม่เลื่อนหาย วันในอนาคตจะล็อกไว้จนกว่าจะถึงคิว
      </p>

      {months.map(({ year, monthIndex0 }) => {
        const weeks = buildMonthGrid(year, monthIndex0, calendarByDate)
        return (
          <div key={`${year}-${monthIndex0}`} className="cwMonth">
            <h2>{formatThaiMonthYear(year, monthIndex0)}</h2>
            <div className="cwMonthGrid">
              {THAI_WEEKDAYS_SHORT.map((w) => (
                <div key={w} className="cwWeekday">
                  {w}
                </div>
              ))}
              {weeks.flatMap((week, wi) =>
                week.map((cell, ci) => {
                  if (!cell.inMonth) return <div key={`${wi}-${ci}`} className="cwDateCell cwDateCell-out" />
                  if (!cell.day) {
                    return (
                      <div key={`${wi}-${ci}`} className="cwDateCell cwDateCell-rest">
                        <span className="cwDateNo">{fromIsoDate(cell.dateIso).getDate()}</span>
                      </div>
                    )
                  }
                  const day = cell.day
                  const complete = isDayComplete(day, completedIds)
                  const locked = isDayLocked(day, today, aheadUnlocked, completedIds)
                  const isToday = day.dateIso === today
                  return (
                    <button
                      key={`${wi}-${ci}`}
                      type="button"
                      className={`cwDateCell cwDateCell-lesson ${complete ? 'is-complete' : ''} ${locked ? 'is-locked' : ''} ${isToday ? 'is-today' : ''}`}
                      onClick={() => onOpenDay(day)}
                    >
                      <span className="cwCellTop">
                        <span className="cwDateNo">{fromIsoDate(cell.dateIso).getDate()}</span>
                        <span className="cwCellThumb">{day.thumbnailEmoji}</span>
                      </span>
                      <span className="cwCellTitle">
                        {day.lessons[0]?.title}
                        {day.lessons.length > 1 ? ` +${day.lessons.length - 1}` : ''}
                      </span>
                      <span className="cwCellMeta">{day.minutes} นาที</span>
                      {complete && (
                        <span className="cwCellBadge cwCellBadge-done" aria-label="เรียนจบแล้ว">
                          ✓
                        </span>
                      )}
                      {locked && (
                        <span className="cwCellBadge cwCellBadge-locked" aria-label="ยังไม่ถึงคิว">
                          🔒
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
