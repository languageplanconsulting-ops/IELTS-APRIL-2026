import { useMemo, useState } from 'react'
import {
  LANDING_READING_BAND_GUIDE,
  READING_COURSE_URL
} from './landingReadingAcademicData'
import { LandingReadingExamSession } from './LandingReadingExamSession'
import {
  buildLandingReadingMonths,
  getLandingReadingExamMeta,
  getLandingReadingPassageTitle
} from './landingReadingAcademicUtils'
import type { ReadingExamRecord } from '../readingJourney'
import './LandingReadingAcademicPage.css'

type LandingReadingAcademicPageProps = {
  monthGroups: Array<{ title: string; displayTitle: string; exams: ReadingExamRecord[] }>
  onBack: () => void
}

function ReadingLockIcon() {
  return (
    <svg className="epReadingLockSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.25" fill="currentColor" />
    </svg>
  )
}

export function LandingReadingAcademicPage({ monthGroups, onBack }: LandingReadingAcademicPageProps) {
  const months = useMemo(() => buildLandingReadingMonths(monthGroups), [monthGroups])
  const defaultMonthId = months[months.length - 1]?.id || months[0]?.id || ''
  const [activeMonthId, setActiveMonthId] = useState(defaultMonthId)
  const [activeFreeExam, setActiveFreeExam] = useState<ReadingExamRecord | null>(null)
  const [lockModalOpen, setLockModalOpen] = useState(false)
  const [lockedExamTitle, setLockedExamTitle] = useState('')

  const activeMonth =
    months.find((month) => month.id === activeMonthId) || months[months.length - 1] || null

  const openLockedModal = (exam: ReadingExamRecord) => {
    setLockedExamTitle(exam.title)
    setLockModalOpen(true)
  }

  if (activeFreeExam) {
    return (
      <div className="epReadingPage epReadingPage-exam">
        <div className="epReadingExamHost">
          <LandingReadingExamSession exam={activeFreeExam} onBack={() => setActiveFreeExam(null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="epReadingPage">
      <header className="epReadingTopbar">
        <div className="epReadingShell epReadingTopbarInner">
          <button type="button" className="epReadingBackBtn" onClick={onBack}>
            ← กลับหน้า Platform
          </button>
          <div className="epReadingTopbarTitle">
            <span>IELTS Academic Reading</span>
            <strong>Monthly Exam Bank</strong>
          </div>
        </div>
      </header>

      <section className="epReadingZone epReadingZoneHero">
        <div className="epReadingShell epReadingHeroGrid">
          <div>
            <p className="epReadingKicker">English Plan · Academic Reading</p>
            <h1>ฝึก IELTS Reading Academic</h1>
            <p className="epReadingLead">
              ชุดข้อสอบอัปโหลดรายเดือน — ผู้ใช้ฟรีทำได้ 1 Passage ต่อเดือน (ชุดละเดือนไม่ซ้ำกัน) Passage อื่นสำหรับนักเรียนคอร์ส
            </p>
          </div>
          <div className="epReadingHeroStat" aria-hidden="true">
            <strong>1 ฟรี</strong>
            <span>Passage ต่อเดือน</span>
            <em>ชุดอื่นล็อกสำหรับนักเรียนคอร์ส</em>
          </div>
        </div>
      </section>

      <section className="epReadingZone epReadingZoneGuide">
        <div className="epReadingShell">
          <header className="epReadingSectionHead">
            <p className="epReadingZoneLabel">Focus guide</p>
            <h2>ควรฝึก Passage ไหน — ตามเป้า Band</h2>
            <p>เลือกโฟกัสให้ตรงเป้าหมาย ไม่ต้องทำทุกชุดแบบสุ่ม</p>
          </header>
          <div className="epReadingGuideGrid">
            {LANDING_READING_BAND_GUIDE.map((item, index) => (
              <article key={item.id} className={`epReadingGuideCard epReadingGuideCard--${index + 1}`}>
                <span className="epReadingGuideStep">{index + 1}</span>
                <p className="epReadingGuideBand">{item.bandTh}</p>
                <h3>{item.focus}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="epReadingZone epReadingZoneMonthly">
        <div className="epReadingShell">
          <header className="epReadingSectionHead">
            <p className="epReadingZoneLabel">Monthly upload</p>
            <h2>ชุดข้อสอบรายเดือน</h2>
            <p>เลือกเดือน — กด Passage ฟรีเพื่อเริ่มทำ (passage ซ้าย · คำถามขวา) ชุดที่ล็อกสำหรับนักเรียนคอร์ส</p>
          </header>

          {months.length === 0 ? (
            <div className="epReadingQuestionEmpty">
              ยังไม่มีชุด Monthly Reading ในระบบ — ชุดแรกจะเริ่ม January 2026
            </div>
          ) : (
            <>
              <div className="epReadingMonthTabs" role="tablist" aria-label="เลือกเดือน">
                {months.map((month) => (
                  <button
                    key={month.id}
                    type="button"
                    role="tab"
                    aria-selected={activeMonthId === month.id}
                    className={`epReadingMonthTab${activeMonthId === month.id ? ' is-active' : ''}`}
                    onClick={() => setActiveMonthId(month.id)}
                  >
                    {month.label}
                  </button>
                ))}
              </div>

              {activeMonth && (
                <div className="epReadingMonthPanel">
                  <div className="epReadingMonthPanelHead">
                    <div>
                      <h3>{activeMonth.label}</h3>
                      <p>{activeMonth.subtitle}</p>
                    </div>
                    <span className="epReadingMonthBadge">
                      1 ฟรี / {activeMonth.freeExam ? activeMonth.lockedExams.length + 1 : 0} ชุด
                    </span>
                  </div>

                  <div className="epReadingSetGrid">
                    {activeMonth.freeExam && (
                      <ExamCard
                        exam={activeMonth.freeExam}
                        locked={false}
                        onClick={() => setActiveFreeExam(activeMonth.freeExam!)}
                      />
                    )}
                    {activeMonth.lockedExams.map((exam) => (
                      <ExamCard key={exam.id} exam={exam} locked onClick={() => openLockedModal(exam)} />
                    ))}
                    {!activeMonth.freeExam && activeMonth.lockedExams.length === 0 && (
                      <p className="epReadingQuestionEmpty">ยังไม่มีชุดในเดือนนี้</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lockModalOpen && (
        <div className="epReadingModalBackdrop" role="presentation" onClick={() => setLockModalOpen(false)}>
          <div
            className="epReadingModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ep-reading-lock-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="epReadingModalClose" aria-label="ปิด" onClick={() => setLockModalOpen(false)}>
              ×
            </button>
            <span className="epReadingModalLockIcon" aria-hidden="true">
              <ReadingLockIcon />
            </span>
            <h3 id="ep-reading-lock-title">เนื้อหาสำหรับนักเรียน Reading ของ English Plan</h3>
            <p className="epReadingModalSet">{lockedExamTitle}</p>
            <p>ชุดนี้เปิดให้นักเรียนคอร์ส Reading เท่านั้น ผู้ใช้ฟรีทำได้ 1 Passage ต่อเดือน</p>
            <a className="epReadingBtn epReadingBtnPrimary epReadingBtnLarge" href={READING_COURSE_URL}>
              สนใจสมัครเรียน Reading
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function ExamCard({
  exam,
  locked,
  onClick
}: {
  exam: ReadingExamRecord
  locked: boolean
  onClick: () => void
}) {
  const meta = getLandingReadingExamMeta(exam)
  const passageTitle = getLandingReadingPassageTitle(exam)

  return (
    <article className={`epReadingSetCard${locked ? ' is-locked' : ' is-free'}`}>
      <button type="button" className="epReadingSetCardBtn" onClick={onClick}>
        <div className="epReadingSetCardMain">
          <span className="epReadingSetPassage">Passage {meta.passageNumber}</span>
          <h4>{passageTitle}</h4>
          <p>
            {meta.questionCount} ข้อ · {meta.duration} · {meta.questionTypes.join(' · ')}
          </p>
        </div>
        <div className="epReadingSetCardSide">
          {locked ? (
            <span className="epReadingLockBadge">
              <ReadingLockIcon />
              Locked
            </span>
          ) : (
            <span className="epReadingFreeBadge">ฟรี</span>
          )}
          {!locked && <span className="epReadingExpandHint">เริ่มทำ</span>}
        </div>
        {locked && (
          <div className="epReadingSetLockOverlay" aria-hidden="true">
            <div className="epReadingSetLockPlate">
              <ReadingLockIcon />
              <span>Members only</span>
            </div>
          </div>
        )}
      </button>
    </article>
  )
}
