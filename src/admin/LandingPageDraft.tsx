import { useState } from 'react'
import { LandingReadingAcademicPage } from './LandingReadingAcademicPage'
import type { ReadingExamRecord } from '../readingJourney'
import './LandingPageDraft.css'

type ExamTrack = 'academic' | 'general'
type LandingDraftView = 'home' | 'reading-academic'

type LandingPageDraftProps = {
  readingMonthGroups?: Array<{ title: string; displayTitle: string; exams: ReadingExamRecord[] }>
  onStartReadingExam?: (exam: ReadingExamRecord) => void
}

type SkillItem = {
  id: string
  abbr: string
  title: string
  subtitle: string
  body: string
  cta: string
}

type LessonItem = {
  id: string
  tag: string
  title: string
  meta: string
  cta: string
}

const ACADEMIC_SKILLS: SkillItem[] = [
  {
    id: 'writing',
    abbr: 'W',
    title: 'IELTS Writing',
    subtitle: 'Academic Track · Band 7+ framework',
    body: 'วิเคราะห์ Task 1 และ Task 2 ด้วยโครงสร้างคำตอบที่ชัดเจน พร้อมคลังคำศัพท์เชิงวิชาการ',
    cta: 'สำรวจหลักสูตร Writing'
  },
  {
    id: 'reading',
    abbr: 'R',
    title: 'IELTS Reading',
    subtitle: 'Academic Track · Cambridge-style practice',
    body: 'ฝึกทำข้อสอบภายใต้เวลาจริง พร้อมเฉลยเชิงเหตุผลและคำอธิบายภาษาไทยแบบเป็นขั้นตอน',
    cta: 'สำรวจหลักสูตร Reading'
  },
  {
    id: 'speaking',
    abbr: 'S',
    title: 'IELTS Speaking',
    subtitle: 'Mock Interview + Guided feedback',
    body: 'ฝึกตอบ Part 1, 2, 3 พร้อมรายงานจุดแข็งและประเด็นที่ควรปรับเพื่อยกระดับคะแนน',
    cta: 'สำรวจหลักสูตร Speaking'
  },
  {
    id: 'band',
    abbr: 'B',
    title: 'Band Score Check',
    subtitle: 'Initial diagnostic in ~20 minutes',
    body: 'ประเมินระดับปัจจุบันและจัดลำดับความสำคัญของทักษะที่ควรพัฒนาก่อนเข้าสอบจริง',
    cta: 'เริ่มประเมินเบื้องต้น'
  }
]

const GENERAL_SKILLS: SkillItem[] = [
  {
    id: 'reading-gt',
    abbr: 'R',
    title: 'IELTS Reading (General Training)',
    subtitle: 'Section 1–3 · Timed practice',
    body: 'ฝึกโจทย์ตามรูปแบบ GT พร้อมคำอธิบายภาษาไทย เหมาะสำหรับสายย้ายถิ่นฐานและการทำงาน',
    cta: 'สำรวจหลักสูตร Reading GT'
  },
  {
    id: 'speaking',
    abbr: 'S',
    title: 'IELTS Speaking',
    subtitle: 'Part 1, 2, 3 · Mock + feedback',
    body: 'ซ้อมตอบในสถานการณ์เสมือนจริง พร้อม feedback ที่นำไปปรับใช้ได้ทันทีทั้ง Academic และ General',
    cta: 'สำรวจหลักสูตร Speaking'
  },
  {
    id: 'writing-gt',
    abbr: 'W',
    title: 'IELTS Writing (General Training)',
    subtitle: 'Task 1 Letter · Task 2 Essay',
    body: 'ฝึกเขียนจดหมายและ essay ด้วยโครงสร้างที่ชัดเจน พร้อมตัวอย่างงานเขียนระดับ Band 7+',
    cta: 'สำรวจหลักสูตร Writing GT'
  }
]

const ACADEMIC_LESSONS: LessonItem[] = [
  { id: 'a-tfng', tag: 'Reading', title: 'True / False / Not Given', meta: '12 นาที · ฟรี', cta: 'เริ่มบทเรียน' },
  { id: 'a-bar', tag: 'Writing Task 1', title: 'Bar Chart', meta: '18 นาที · ฟรี', cta: 'เริ่มบทเรียน' },
  { id: 'a-p3', tag: 'Speaking', title: 'Part 3 Discussion', meta: '15 นาที · ฟรี', cta: 'เริ่มบทเรียน' },
  { id: 'a-band', tag: 'Study guide', title: 'Band 6 → 7', meta: 'แนวทางปรับคะแนน · ฟรี', cta: 'อ่านคู่มือ' }
]

const GENERAL_LESSONS: LessonItem[] = [
  { id: 'g-tfng', tag: 'Reading', title: 'True / False / Not Given', meta: '12 นาที · ฟรี', cta: 'เริ่มบทเรียน' },
  { id: 'g-match', tag: 'Reading', title: 'Matching ข้อมูล', meta: '14 นาที · ฟรี', cta: 'เริ่มบทเรียน' },
  {
    id: 'g-letter',
    tag: 'Writing Task 1',
    title: 'ตัวอย่างการเขียนจดหมาย',
    meta: '16 นาที · ฟรี',
    cta: 'ดูตัวอย่าง'
  }
]

const BLOG_POSTS = [
  { id: '1', title: 'ทำไม Part 2 ถึงสั้นเกินไป — และแก้ยังไง', date: 'May 2026' },
  { id: '2', title: 'TFNG: แยก False กับ Not Given ให้ชัด', date: 'Apr 2026' },
  { id: '3', title: '5 linking words ที่ทำให้ Speaking ฟัง Band 7', date: 'Apr 2026' },
  { id: '4', title: 'Reading headings: อ่าน 2 ประโยคนี้ก่อนเสมอ', date: 'Mar 2026' },
  { id: '5', title: 'แผนฝึก IELTS 14 วัน สำหรับคนทำงาน', date: 'Mar 2026' }
] as const

const TRACK_META: Record<
  ExamTrack,
  { label: string; badge: string; skillsTitle: string; skillsLead: string; lessonsLead: string }
> = {
  academic: {
    label: 'IELTS Academic',
    badge: 'Academic',
    skillsTitle: 'Academic Track: Structured Skill Development',
    skillsLead: 'ออกแบบสำหรับผู้เรียนที่มุ่งเรียนต่อหรือเส้นทางงานเชิงวิชาการ',
    lessonsLead: 'บทเรียนตัวอย่างสำหรับ Academic Reading, Writing และ Speaking'
  },
  general: {
    label: 'IELTS General Training',
    badge: 'General Training',
    skillsTitle: 'General Training Track: Practical Exam Readiness',
    skillsLead: 'เหมาะสำหรับผู้สอบเพื่อย้ายถิ่นฐาน การทำงาน และการเรียนต่อสาย non-academic',
    lessonsLead: 'บทเรียนตัวอย่างที่จัดตามรูปแบบข้อสอบ General Training'
  }
}

export function LandingPageDraft({ readingMonthGroups = [], onStartReadingExam }: LandingPageDraftProps) {
  const [examTrack, setExamTrack] = useState<ExamTrack>('academic')
  const [draftView, setDraftView] = useState<LandingDraftView>('home')
  const track = TRACK_META[examTrack]
  const skills = examTrack === 'academic' ? ACADEMIC_SKILLS : GENERAL_SKILLS
  const lessons = examTrack === 'academic' ? ACADEMIC_LESSONS : GENERAL_LESSONS

  if (draftView === 'reading-academic') {
    return (
      <div className="epLandingDraftWrap">
        <LandingReadingAcademicPage
          monthGroups={readingMonthGroups}
          onBack={() => setDraftView('home')}
          onStartReadingExam={onStartReadingExam}
        />
      </div>
    )
  }

  return (
    <article className="epLanding" aria-label="ตัวอย่างหน้า Landing Page สำหรับแอดมิน">
      <header className="epLandingTopbar">
        <div className="epLandingShell epLandingTopbarInner">
          <a className="epLandingBrand" href="#ep-landing-hero">
            <span className="epLandingBrandMark" aria-hidden="true">
              EP
            </span>
            <div>
              <strong>English Plan IELTS</strong>
              <span>Official Learning Platform</span>
            </div>
          </a>
          <nav className="epLandingTopnav" aria-label="เมนูหลัก">
            <a href="#ep-landing-exam">Programs</a>
            <a href="#ep-landing-track">Methodology</a>
            <a href="#ep-landing-blog">Insights</a>
          </nav>
          <div className="epLandingTopActions">
            <button type="button" className="epLandingBtn epLandingBtnGhost">
              Sign in
            </button>
            <button type="button" className="epLandingBtn epLandingBtnPrimary">
              Request Access
            </button>
          </div>
        </div>
      </header>

      <section id="ep-landing-hero" className="epLandingZone epLandingZoneHero">
        <div className="epLandingShell epLandingHeroGrid">
          <div className="epLandingHeroCopy">
            <p className="epLandingKicker">English Plan IELTS Institute</p>
            <h1>เตรียม IELTS อย่างเป็นระบบ ด้วยมาตรฐานการสอนที่ชัดเจน</h1>
            <p className="epLandingLead">
              แพลตฟอร์มฝึก IELTS สำหรับผู้เรียนไทยที่เน้นผลลัพธ์จริง ผ่านการฝึกแบบมีโครงสร้าง
              การประเมินที่อธิบายได้ และ feedback ที่นำไปพัฒนาต่อได้ทันที
            </p>
            <ul className="epLandingHeroPoints">
              <li>หลักสูตรแยกชัดเจนสำหรับ Academic และ General Training</li>
              <li>คำอธิบายเชิงกลยุทธ์ภาษาไทยที่เชื่อมโยงกับเกณฑ์การให้คะแนน</li>
              <li>เส้นทางพัฒนาแบบ step-by-step ตามระดับของผู้เรียน</li>
            </ul>
            <div className="epLandingHeroActions">
              <button type="button" className="epLandingBtn epLandingBtnPrimary epLandingBtnLarge">
                Start Free Diagnostic
              </button>
              <button type="button" className="epLandingBtn epLandingBtnGhost epLandingBtnLarge">
                View Curriculum
              </button>
            </div>
          </div>
          <div className="epLandingHeroPanel" aria-label="ตัวอย่างผลประเมิน IELTS">
            <p className="epLandingPanelLabel">Diagnostic Snapshot</p>
            <strong>Current Band 6.5 · Target Band 7.0</strong>
            <p>Priority plan: extended Part 2 response, discourse markers, and tense consistency</p>
            <div className="epLandingMeterRow">
              <span>Speaking</span>
              <meter min="0" max="9" value={6.5} />
            </div>
            <div className="epLandingMeterRow">
              <span>Reading</span>
              <meter min="0" max="9" value={6} />
            </div>
            <div className="epLandingMeterRow">
              <span>Writing</span>
              <meter min="0" max="9" value={6} />
            </div>
          </div>
        </div>
      </section>

      <div className="epLandingZoneDivider" aria-hidden="true" />

      <section id="ep-landing-exam" className="epLandingZone epLandingZonePicker">
        <div className="epLandingShell">
          <div className="epLandingPickerCard">
            <header className="epLandingPickerHead">
              <p className="epLandingZoneLabel">ขั้นที่ 1</p>
              <h2>เลือกเส้นทางการสอบของคุณ</h2>
              <p>เนื้อหาทั้งหมดด้านล่างจะปรับตามประเภทสอบที่เลือก เพื่อให้ฝึกได้ตรงเป้าหมายมากขึ้น</p>
            </header>
            <div
              className="epLandingTrackToggle"
              role="tablist"
              aria-label="เลือกประเภท IELTS"
            >
              <button
                type="button"
                role="tab"
                aria-selected={examTrack === 'academic'}
                className={`epLandingTrackOption${examTrack === 'academic' ? ' is-active' : ''}`}
                onClick={() => setExamTrack('academic')}
              >
                <strong>Academic</strong>
                <span>สำหรับการเรียนต่อระดับมหาวิทยาลัย และสายงานวิชาการ</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={examTrack === 'general'}
                className={`epLandingTrackOption${examTrack === 'general' ? ' is-active' : ''}`}
                onClick={() => setExamTrack('general')}
              >
                <strong>General Training</strong>
                <span>สำหรับย้ายถิ่นฐาน การทำงาน และการเรียนต่อสาย non-academic</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="ep-landing-track"
        className={`epLandingZone epLandingZoneTrack epLandingZoneTrack--${examTrack}`}
        aria-live="polite"
      >
        <div className="epLandingShell">
          <div className="epLandingTrackShell">
            <header className="epLandingTrackHeader">
              <span className="epLandingTrackBadge">{track.badge}</span>
              <div>
                <p className="epLandingZoneLabel">ขั้นที่ 2</p>
                <h2>{track.skillsTitle}</h2>
                <p>{track.skillsLead}</p>
              </div>
            </header>

            {examTrack === 'academic' ? (
              <div className="epLandingSkillsGrid epLandingSkillsGrid--4">
                {skills.map((skill) => (
                  <article key={skill.id} className="epLandingSkillCard">
                    <span className="epLandingSkillAbbr" aria-hidden="true">
                      {skill.abbr}
                    </span>
                    <p className="epLandingCardTag">{skill.subtitle}</p>
                    <h3>{skill.title}</h3>
                    <p>{skill.body}</p>
                    <button
                      type="button"
                      className="epLandingTextLink"
                      onClick={() => {
                        if (skill.id === 'reading') setDraftView('reading-academic')
                      }}
                    >
                      {skill.cta} →
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="epLandingSkillsStack">
                {skills.map((skill, index) => (
                  <article key={skill.id} className="epLandingSkillRow">
                    <span className="epLandingSkillRowNum">{index + 1}</span>
                    <div className="epLandingSkillRowBody">
                      <p className="epLandingCardTag">{skill.subtitle}</p>
                      <h3>{skill.title}</h3>
                      <p>{skill.body}</p>
                    </div>
                    <button type="button" className="epLandingBtn epLandingBtnSecondary">
                      {skill.cta}
                    </button>
                  </article>
                ))}
              </div>
            )}

            <div className="epLandingSubsectionDivider" aria-hidden="true" />

            <header className="epLandingSubsectionHead">
              <p className="epLandingZoneLabel">Sample Lessons</p>
              <h3>ทดลองเรียนก่อนเริ่มโปรแกรมจริง</h3>
              <p>{track.lessonsLead}</p>
            </header>

            <div className={`epLandingLessonsGrid epLandingLessonsGrid--${lessons.length}`}>
              {lessons.map((lesson) => (
                <article key={lesson.id} className="epLandingLessonCard">
                  <div className="epLandingLessonMedia" aria-hidden="true">
                    <span>{lesson.tag}</span>
                  </div>
                  <div className="epLandingLessonBody">
                    <p className="epLandingCardTag">{lesson.tag}</p>
                    <h4>{lesson.title}</h4>
                    <p className="epLandingLessonMeta">{lesson.meta}</p>
                    <button type="button" className="epLandingTextLink">
                      {lesson.cta} →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="epLandingZone epLandingZoneLogin" aria-label="เข้าสู่ระบบผู้เรียน">
        <div className="epLandingShell epLandingLoginInner">
          <div className="epLandingLoginCopy">
            <p className="epLandingZoneLabel epLandingZoneLabelLight">For Enrolled Learners</p>
            <h2>Access Your Learning Dashboard</h2>
            <p>ผู้เรียนที่มีบัญชีอยู่แล้วสามารถเข้าสู่ระบบเพื่อเรียนต่อ ติดตามความคืบหน้า และทบทวน feedback ล่าสุด</p>
          </div>
          <button type="button" className="epLandingBtn epLandingBtnPrimary epLandingBtnLarge epLandingBtnOnDark">
            Sign in to Learning Space
          </button>
        </div>
      </section>

      <section id="ep-landing-blog" className="epLandingZone epLandingZoneBlog">
        <div className="epLandingShell">
          <header className="epLandingSectionHead epLandingSectionHeadRow">
            <div>
              <p className="epLandingZoneLabel">Insights</p>
              <h2>IELTS Research & Insights</h2>
              <p>บทความเชิงกลยุทธ์จากทีมผู้สอน English Plan สำหรับทั้ง Academic และ General Training</p>
            </div>
            <button type="button" className="epLandingTextLink">
              Browse all articles →
            </button>
          </header>
          <div className="epLandingBlogGrid">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="epLandingBlogCard">
                <button type="button" className="epLandingBlogLink">
                  <div className="epLandingBlogMedia" aria-hidden="true" />
                  <div className="epLandingBlogBody">
                    <time dateTime={post.date}>{post.date}</time>
                    <h3>{post.title}</h3>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="epLandingFooter">
        <div className="epLandingShell">
          <p>
            <strong>Internal draft</strong> — หน้านี้ใช้สำหรับรีวิวใน Admin และยังไม่เผยแพร่สู่ผู้ใช้ทั่วไป
          </p>
        </div>
      </footer>
    </article>
  )
}
