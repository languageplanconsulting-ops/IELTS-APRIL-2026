import { useEffect, useMemo, useState } from 'react'
import './CourseHomePage.css'
import {
  QUESTION_TYPE_BY_ID,
  WRITING_COURSE_CHAPTER_NAMES,
  WRITING_COURSE_LESSON_COUNT,
  WRITING_COURSE_LESSONS,
  WRITING_COURSE_TOTAL_MINUTES,
  formatMinutesAsHours,
  type CourseLesson
} from './writingCourseCurriculum'
import {
  ONBOARDING_INTERVAL_OPTIONS,
  ONBOARDING_MINUTE_OPTIONS,
  THAI_WEEKDAYS_SHORT,
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
  type WritingCourseOnboarding
} from './writingCourseStudyPlan'

type CourseHomePageProps = {
  onBackHome: () => void
  learnerEmail: string
  learnerName: string
}

type View = 'hub' | 'onboarding' | 'day' | 'lesson' | 'calendar' | 'progress'

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
    const onboarding =
      parsed?.onboarding &&
      typeof parsed.onboarding.intervalDays === 'number' &&
      typeof parsed.onboarding.minutesPerDay === 'number' &&
      typeof parsed.onboarding.startDateIso === 'string'
        ? parsed.onboarding
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
  const [confirmDayIndex, setConfirmDayIndex] = useState<number | null>(null)
  const [draftInterval, setDraftInterval] = useState(() => loadStoredState(learnerEmail).onboarding?.intervalDays ?? 2)
  const [draftMinutes, setDraftMinutes] = useState(() => loadStoredState(learnerEmail).onboarding?.minutesPerDay ?? 60)

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
  const todayPlan = useMemo(() => findTodayPlan(calendar, completedIds, aheadUnlocked), [calendar, completedIds, aheadUnlocked])
  const overall = useMemo(() => computeOverallProgress(completedIds), [completedIds])
  const typeProgress = useMemo(() => computeQuestionTypeProgress(completedIds), [completedIds])
  const finishDateIso = estimateFinishDateIso(calendar)

  // "Today" defaults to the plan's recommendation until the student explicitly
  // opens a different day (calendar click) — no effect needed, it's just a
  // fallback in the read, so it never desyncs after onboarding changes.
  const selectedDay = (selectedDayIndex !== null ? calendar[selectedDayIndex] : undefined) ?? todayPlan.day ?? null
  const selectedLesson = selectedLessonId ? WRITING_COURSE_LESSONS.find((l) => l.id === selectedLessonId) || null : null
  const confirmDay = confirmDayIndex !== null ? calendar[confirmDayIndex] || null : null

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

  const startOnboarding = () => {
    setDraftInterval(onboarding?.intervalDays ?? 2)
    setDraftMinutes(onboarding?.minutesPerDay ?? 60)
    setView('onboarding')
  }

  const confirmOnboarding = () => {
    setOnboarding({ intervalDays: draftInterval, minutesPerDay: draftMinutes, startDateIso: todayIsoDate() })
    setSelectedDayIndex(null)
    setView('day')
  }

  const draftPreviewFinish = onboarding
    ? null
    : estimateFinishDateIso(
        buildCalendar({ intervalDays: draftInterval, minutesPerDay: draftMinutes, startDateIso: todayIsoDate() }, false)
      )

  return (
    <div className="courseWritingPage">
      <div className="cwTopBar">
        <button type="button" className="cwBack" onClick={onBackHome}>
          ← กลับหน้าหลัก
        </button>
        <span className="cwTopBarLabel">Course · Admin preview</span>
      </div>

      {view === 'hub' && (
        <section className="cwHub">
          <p className="cwKicker">คอร์ส</p>
          <h1>English Plan Courses</h1>
          <p className="cwLede">
            คอร์สแบบวิดีโอ + แผนเรียนส่วนตัว นักเรียนตอบแค่ 2 คำถามเรื่องเวลา ระบบจัดปฏิทินรายวันให้ทั้งหมด
          </p>

          <article className="cwCourseCard">
            <div className="cwCourseThumb" aria-hidden="true">
              ✍️
            </div>
            <div className="cwCourseBody">
              <span className="cwPill cwPill-active">เปิดใช้งาน</span>
              <h2>IELTS Academic Writing — Intensive</h2>
              <p>Task 1 ทุกชนิดกราฟ + Task 2 ครบ 4 คำถาม ตั้งแต่พื้นฐานไปจนถึงข้อสอบจำลอง</p>
              <div className="cwCourseStats">
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
              </div>
              {onboarding ? (
                <div className="cwCourseActions">
                  <button
                    type="button"
                    className="cwBtn cwBtn-primary"
                    onClick={() => {
                      setSelectedDayIndex(null)
                      setView('day')
                    }}
                  >
                    ไปหน้าเรียนของฉัน
                  </button>
                  <button type="button" className="cwBtn cwBtn-ghost" onClick={startOnboarding}>
                    แก้ไขจังหวะการเรียน
                  </button>
                </div>
              ) : (
                <button type="button" className="cwBtn cwBtn-primary" onClick={startOnboarding}>
                  เริ่มวางแผนการเรียน
                </button>
              )}
            </div>
          </article>

          <div className="cwOtherCourse">
            <span className="cwPill">เร็ว ๆ นี้</span>
            <p>Speaking · Reading · Listening — จะย้ายมาใช้ระบบวางแผนเดียวกันในเฟสถัดไป</p>
          </div>
        </section>
      )}

      {view === 'onboarding' && (
        <section className="cwOnboard">
          <button type="button" className="cwBack cwBack-inline" onClick={() => setView(onboarding ? 'day' : 'hub')}>
            ← ย้อนกลับ
          </button>
          <p className="cwKicker">ตั้งค่าแผนเรียน</p>
          <h1>คุณเรียนได้บ่อยแค่ไหน?</h1>
          <p className="cwLede">
            ไม่ต้องบอกจุดอ่อน — ทุกชนิดโจทย์ถูกจัดไว้ให้ครบตั้งแต่วันแรกอยู่แล้ว แค่บอกเวลาที่มีจริง ปฏิทินจะเริ่มตั้งแต่วันนี้
          </p>

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
              {ONBOARDING_MINUTE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cwChip ${draftMinutes === opt.value ? 'is-active' : ''}`}
                  aria-pressed={draftMinutes === opt.value}
                  onClick={() => setDraftMinutes(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cwEstimate">
            เริ่มปฏิทินตั้งแต่วันนี้ ({formatThaiDayMonth(todayIsoDate())}) — ที่จังหวะนี้ คาดว่าจะเรียนจบทั้งคอร์สประมาณวันที่{' '}
            <b>{draftPreviewFinish ? formatThaiDayMonth(draftPreviewFinish) : '—'}</b> ปรับเปลี่ยนได้ทุกเมื่อ
          </div>

          <button type="button" className="cwBtn cwBtn-primary cwBtn-block" onClick={confirmOnboarding}>
            สร้างปฏิทินของฉัน
          </button>
        </section>
      )}

      {view === 'day' && (
        <section className="cwToday">
          <div className="cwTodayHead">
            <div>
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
            </div>
            <button type="button" className="cwBtn cwBtn-ghost cwBtn-small" onClick={startOnboarding}>
              แก้ไขจังหวะ
            </button>
          </div>

          <div className="cwProgressCard">
            <div className="cwProgressRing">
              <div className="cwProgressRingFill" style={{ '--pct': `${overall.percent}%` } as React.CSSProperties} />
              <span>{overall.percent}%</span>
            </div>
            <div>
              <b>
                เรียนไปแล้ว {overall.completedLessons} จาก {overall.totalLessons} บท
              </b>
              <p>
                {formatMinutesAsHours(overall.completedMinutes)} / {formatMinutesAsHours(overall.totalMinutes)} ชม.
                {finishDateIso && !todayPlan.isCourseComplete ? ` · คาดว่าจะจบวันที่ ${formatThaiDayMonth(finishDateIso)}` : ''}
              </p>
            </div>
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
              <button type="button" className="cwBtn cwBtn-primary" onClick={() => setConfirmDayIndex(selectedDay.index)}>
                อยากเรียนล่วงหน้าตอนนี้เลย
              </button>
            </article>
          ) : selectedDay ? (
            <article className="cwTodayCard">
              <span className="cwPill cwPill-onDark">{selectedDay.dateIso === today ? 'งานวันนี้' : formatThaiDayMonth(selectedDay.dateIso)}</span>
              <ul className="cwTodayList">
                {selectedDay.lessons.map((lesson) => {
                  const done = completedIds.has(lesson.id)
                  return (
                    <li key={lesson.id} className={done ? 'is-done' : ''}>
                      <button
                        type="button"
                        className="cwTodayItem"
                        onClick={() => {
                          setSelectedLessonId(lesson.id)
                          setView('lesson')
                        }}
                      >
                        <span className="cwThumb">{QUESTION_TYPE_BY_ID[lesson.questionType].thumbnailEmoji}</span>
                        <span className={`cwCheck ${done ? 'is-done' : ''}`}>{done ? '✓' : ''}</span>
                        <span className="cwTodayItemBody">
                          <b>{lesson.title}</b>
                          <small>
                            {QUESTION_TYPE_BY_ID[lesson.questionType].label} · {lesson.minutes > 0 ? `${lesson.minutes} นาที` : 'แบบฝึกหัด'}
                          </small>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              {selectedDay.writingPrompt && (
                <div className="cwWritingPrompt">
                  <b>งานเขียนแนะนำ</b>
                  <p>{selectedDay.writingPrompt}</p>
                </div>
              )}
            </article>
          ) : null}

          <div className="cwTodayNav">
            <button type="button" className="cwNavCard" onClick={() => setView('calendar')}>
              <b>ปฏิทินการเรียน</b>
              <span>ดูทุกวันตั้งแต่ต้นจนจบ</span>
            </button>
            <button type="button" className="cwNavCard" onClick={() => setView('progress')}>
              <b>จุดที่ทำสำเร็จแล้ว</b>
              <span>ความคืบหน้าแยกตามชนิดโจทย์</span>
            </button>
          </div>
        </section>
      )}

      {view === 'lesson' && selectedLesson && (
        <section className="cwLesson">
          <button type="button" className="cwBack cwBack-inline" onClick={() => setView('day')}>
            ← กลับ
          </button>
          <span className="cwPill">{selectedLesson.chapterName}</span>
          <h1>{selectedLesson.title}</h1>
          <p className="cwLessonMeta">
            {AREA_LABEL[selectedLesson.area]} · {QUESTION_TYPE_BY_ID[selectedLesson.questionType].label}
            {selectedLesson.minutes > 0 ? ` · ${selectedLesson.minutes} นาที` : ' · แบบฝึกหัด'}
          </p>

          {selectedLesson.bunnyVideoId ? (
            <div className="cwVideoFrame">
              <iframe
                src={`https://iframe.mediadelivery.net/embed/712721/${selectedLesson.bunnyVideoId}?autoplay=false`}
                loading="lazy"
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                allowFullScreen
                title={selectedLesson.title}
              />
            </div>
          ) : (
            <div className="cwVideoPlaceholder">
              <span>▶</span>
              <p>วิดีโอจะฝังที่นี่หลังย้ายไฟล์ออกจาก Thinkific</p>
            </div>
          )}

          <button
            type="button"
            className={`cwBtn cwBtn-block ${completedIds.has(selectedLesson.id) ? 'cwBtn-ghost' : 'cwBtn-primary'}`}
            onClick={() => toggleComplete(selectedLesson.id)}
          >
            {completedIds.has(selectedLesson.id) ? '✓ ดูจบแล้ว — กดเพื่อยกเลิก' : 'ทำเครื่องหมายว่าดูจบแล้ว'}
          </button>
        </section>
      )}

      {view === 'calendar' && onboarding && (
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
        <section className="cwProgressPage">
          <button type="button" className="cwBack cwBack-inline" onClick={() => setView('day')}>
            ← กลับ
          </button>
          <h1>จุดที่ทำสำเร็จแล้ว</h1>
          <p className="cwLede">10 ชนิดโจทย์ที่ข้อสอบจริงออกได้ — ทุกชนิดถูกจัดให้อยู่ในแผนตั้งแต่ต้น ไม่ว่าจะเรียนถี่แค่ไหน</p>

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
        </section>
      )}

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
      <section className="cwCalendar">
        <button type="button" className="cwBack cwBack-inline" onClick={onBack}>
          ← กลับ
        </button>
        <h1>ปฏิทินการเรียน</h1>
        <p className="cwLede">ยังไม่มีแผนเรียน</p>
      </section>
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
    <section className="cwCalendar">
      <button type="button" className="cwBack cwBack-inline" onClick={onBack}>
        ← กลับ
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
    </section>
  )
}
