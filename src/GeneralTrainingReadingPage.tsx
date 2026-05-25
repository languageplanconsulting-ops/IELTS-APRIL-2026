import type { CSSProperties } from 'react'
import './GeneralTrainingReadingPage.css'
import {
  GENERAL_TRAINING_FULL_TEST_DETAIL_TH,
  GENERAL_TRAINING_FULL_TEST_NUMBERS,
  GENERAL_TRAINING_READING_LABEL,
  GENERAL_TRAINING_READING_LEAD,
  GENERAL_TRAINING_READING_OVERVIEW_TH,
  GENERAL_TRAINING_SECTIONS,
  formatGeneralTrainingTestLabel,
  type GeneralTrainingReadingSection,
  type GeneralTrainingReadingView
} from './generalTrainingReadingData'

type GeneralTrainingExamSummary = {
  id: string
  title: string
  questionCount: number
  passageCount: number
  gtTestNumber?: number
  gtSection?: number
}

type GeneralTrainingReadingPageProps = {
  view: GeneralTrainingReadingView
  selectedSection: GeneralTrainingReadingSection | null
  sectionExams: GeneralTrainingExamSummary[]
  fullTestExams: GeneralTrainingExamSummary[]
  attemptByExamId: Record<string, { correctCount: number; totalQuestions: number; accuracy: number }>
  onBackToReadingCategories: () => void
  onOpenHub: () => void
  onOpenSection: (section: GeneralTrainingReadingSection) => void
  onOpenFullTests: () => void
  onStartExam: (examId: string) => void
  onOpenReport: (examId: string) => void
}

export function GeneralTrainingReadingPage({
  view,
  selectedSection,
  sectionExams,
  fullTestExams,
  attemptByExamId,
  onBackToReadingCategories,
  onOpenHub,
  onOpenSection,
  onOpenFullTests,
  onStartExam,
  onOpenReport
}: GeneralTrainingReadingPageProps) {
  const sectionMeta = GENERAL_TRAINING_SECTIONS.find((item) => item.section === selectedSection) || null
  const visibleSectionExams = selectedSection
    ? GENERAL_TRAINING_FULL_TEST_NUMBERS.map((testNumber) =>
        sectionExams.find((exam) => exam.gtSection === selectedSection && exam.gtTestNumber === testNumber)
      ).filter(Boolean) as GeneralTrainingExamSummary[]
    : []

  return (
    <div className="gtReadingPage">
      <div className="gtReadingAmbient" aria-hidden="true">
        <span className="gtReadingOrb gtReadingOrb-a" />
        <span className="gtReadingOrb gtReadingOrb-b" />
        <span className="gtReadingGridGlow" />
      </div>

      <header className="gtReadingHeader">
        <div>
          <p className="gtReadingEyebrow">{GENERAL_TRAINING_READING_LABEL}</p>
          <h2>
            {view === 'hub'
              ? 'General Training Reading'
              : view === 'full-test'
                ? 'Full Test · 40 Questions'
                : sectionMeta?.title || 'Section Practice'}
          </h2>
          <p className="gtReadingLead">
            {view === 'hub'
              ? GENERAL_TRAINING_READING_LEAD
              : view === 'full-test'
                ? GENERAL_TRAINING_FULL_TEST_DETAIL_TH
                : sectionMeta?.detailTh || GENERAL_TRAINING_READING_LEAD}
          </p>
        </div>
        <div className="gtReadingHeaderActions">
          {view === 'hub' ? (
            <button type="button" className="secondary" onClick={onBackToReadingCategories}>
              Back to Categories
            </button>
          ) : (
            <button type="button" className="secondary" onClick={onOpenHub}>
              Back to General Training
            </button>
          )}
        </div>
      </header>

      {view === 'hub' && (
        <>
          <section className="gtReadingOverview">
            <p className="gtReadingOverviewLabel">General Training คืออะไร?</p>
            <p>{GENERAL_TRAINING_READING_OVERVIEW_TH}</p>
          </section>

          <section className="gtReadingSectionGrid">
            {GENERAL_TRAINING_SECTIONS.map((section, index) => {
              const count = sectionExams.filter((exam) => exam.gtSection === section.section).length
              return (
                <button
                  key={section.section}
                  type="button"
                  className={`gtReadingSectionCard gtReadingSectionCard-${section.section}`}
                  style={{ '--motion-stagger': index } as CSSProperties}
                  onClick={() => onOpenSection(section.section)}
                >
                  <span className="gtReadingCardLabel">{section.subtitle}</span>
                  <strong>{section.title}</strong>
                  <p className="gtReadingCardFocus">{section.skillFocus}</p>
                  <small>{section.questionRange} · {count} practice sets</small>
                </button>
              )
            })}
            <button
              type="button"
              className="gtReadingSectionCard gtReadingSectionCard-full"
              style={{ '--motion-stagger': 3 } as CSSProperties}
              onClick={onOpenFullTests}
            >
              <span className="gtReadingCardLabel">Full Exam</span>
              <strong>Full Test</strong>
              <p className="gtReadingCardFocus">3 sections · 40 questions · 60 minutes</p>
              <small>{fullTestExams.length} complete exams</small>
            </button>
          </section>
        </>
      )}

      {view === 'section' && sectionMeta && (
        <>
          <section className="gtReadingOverview gtReadingOverview-section">
            <p className="gtReadingOverviewLabel">{sectionMeta.subtitle}</p>
            <p>{sectionMeta.detailTh}</p>
          </section>
          <div className="gtReadingExamGrid">
            {visibleSectionExams.map((exam, index) => {
              const attempt = attemptByExamId[exam.id]
              return (
                <article key={exam.id} className="gtReadingExamCard">
                  <p className="gtReadingExamEyebrow">
                    {formatGeneralTrainingTestLabel(exam.gtTestNumber || index + 1)}
                  </p>
                  <h3>{exam.title}</h3>
                  <p className="gtReadingExamMeta">
                    {exam.passageCount} texts · {exam.questionCount} questions
                  </p>
                  {attempt && (
                    <p className="gtReadingAttemptMeta">
                      Last attempt · {attempt.correctCount}/{attempt.totalQuestions} · {attempt.accuracy}%
                    </p>
                  )}
                  <div className="gtReadingExamActions">
                    <button type="button" onClick={() => onStartExam(exam.id)}>
                      {attempt ? 'Retry' : 'Open Exam'}
                    </button>
                    {attempt && (
                      <button type="button" className="secondary" onClick={() => onOpenReport(exam.id)}>
                        ดู report
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}

      {view === 'full-test' && (
        <>
          <section className="gtReadingOverview gtReadingOverview-full">
            <p className="gtReadingOverviewLabel">Full Test คืออะไร?</p>
            <p>{GENERAL_TRAINING_FULL_TEST_DETAIL_TH}</p>
          </section>
          <div className="gtReadingExamGrid">
            {GENERAL_TRAINING_FULL_TEST_NUMBERS.map((testNumber) => {
              const exam = fullTestExams.find((item) => item.gtTestNumber === testNumber)
              if (!exam) return null
              const attempt = attemptByExamId[exam.id]
              return (
                <article key={exam.id} className="gtReadingExamCard gtReadingExamCard-full">
                  <p className="gtReadingExamEyebrow">{formatGeneralTrainingTestLabel(testNumber)}</p>
                  <h3>{exam.title}</h3>
                  <p className="gtReadingExamMeta">3 sections · {exam.questionCount} questions · 60 min</p>
                  {attempt && (
                    <p className="gtReadingAttemptMeta">
                      Last attempt · {attempt.correctCount}/{attempt.totalQuestions} · {attempt.accuracy}%
                    </p>
                  )}
                  <div className="gtReadingExamActions">
                    <button type="button" onClick={() => onStartExam(exam.id)}>
                      {attempt ? 'Retry Full Test' : 'Open Full Test'}
                    </button>
                    {attempt && (
                      <button type="button" className="secondary" onClick={() => onOpenReport(exam.id)}>
                        ดู report
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
