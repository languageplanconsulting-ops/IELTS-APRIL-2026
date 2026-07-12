import { useMemo, useState, type ReactNode } from 'react'
import type { ReadingExamRecord } from '../readingJourney'
import { getLandingReadingPassageTitle } from './landingReadingAcademicUtils'
import {
  buildReadingFillQuestionGroups,
  isReadingFillQuestion,
  isReadingFillStylePrompt,
  parseFillContextFromPrompt,
  type ReadingFillQuestionGroup
} from '../readingFillDisplay'

type ReadingQuestion = ReadingExamRecord['parsedPayload']['passages'][number]['questions'][number]

type ReadingReportItem = ReadingQuestion & {
  userAnswer: string
  isCorrect: boolean
}

type LandingReadingExamSessionProps = {
  exam: ReadingExamRecord
  onBack: () => void
}

type SessionStage = 'exam' | 'report'

const isJudgementQuestion = (question: ReadingQuestion) =>
  question.answerType === 'true-false-not-given' || question.answerType === 'yes-no-not-given'

const normalizeAnswer = (value: string) => String(value || '').trim().toUpperCase()

const isAnswerCorrect = (userAnswer: string, correctAnswer: string, acceptedAnswers?: string[]) => {
  const normalizedUser = normalizeAnswer(userAnswer)
  if (!normalizedUser) return false
  const accepted = (acceptedAnswers?.length ? acceptedAnswers : [correctAnswer]).map(normalizeAnswer)
  return accepted.includes(normalizedUser)
}

const scoreQuestions = (questions: ReadingQuestion[], answers: Record<number, string>): ReadingReportItem[] =>
  questions.map((question) => {
    const userAnswer = String(answers[question.number] || '').trim()
    return {
      ...question,
      userAnswer,
      isCorrect: isAnswerCorrect(userAnswer, question.correctAnswer, question.acceptedAnswers)
    }
  })

const noopMatchingCheck = () => false

const READING_ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i

const getDisplayPrompt = (question: ReadingQuestion) => {
  const prompt = String(question.prompt || '').replace(/\s+/g, ' ').trim()
  if (prompt && !/^Question\s+\d+$/i.test(prompt)) return prompt
  return `Question ${question.number}`
}

export function LandingReadingExamSession({ exam, onBack }: LandingReadingExamSessionProps) {
  const passages = exam.parsedPayload?.passages || []
  const passage = passages[0]
  const questions = passage?.questions || []
  const passageTitle = getLandingReadingPassageTitle(exam)
  const [stage, setStage] = useState<SessionStage>('exam')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [hintQuestionNumber, setHintQuestionNumber] = useState<number | null>(null)
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  const [reportItems, setReportItems] = useState<ReadingReportItem[]>([])

  const fillGroups = useMemo(
    () => buildReadingFillQuestionGroups(passage, questions, noopMatchingCheck, exam.id),
    [passage, questions, exam.id]
  )
  const fillGroupByNumber = useMemo(() => {
    const lookup = new Map<number, ReadingFillQuestionGroup>()
    fillGroups.forEach((group) => group.questions.forEach((question) => lookup.set(question.number, group)))
    return lookup
  }, [fillGroups])
  const fillGroupQuestionNumbers = useMemo(() => {
    const numbers = new Set<number>()
    fillGroups.forEach((group) => group.questions.forEach((question) => numbers.add(question.number)))
    return numbers
  }, [fillGroups])

  if (!passage) {
    return (
      <div className="readingExamWrap">
        <p className="meta">ไม่พบ passage ในชุดข้อสอบนี้</p>
        <button type="button" className="secondary" onClick={onBack}>
          กลับ
        </button>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="readingExamWrap">
        <p className="meta">ไม่พบคำถามในชุดข้อสอบนี้ — ลองรีเฟรชหรือติดต่อแอดมิน</p>
        <button type="button" className="secondary" onClick={onBack}>
          กลับ
        </button>
      </div>
    )
  }

  const answeredCount = questions.filter((question) => String(answers[question.number] || '').trim()).length
  const correctCount = reportItems.filter((item) => item.isCorrect).length
  const accuracy = reportItems.length ? Math.round((correctCount / reportItems.length) * 100) : 0
  const unansweredCount = reportItems.filter((item) => !String(item.userAnswer || '').trim()).length

  const setAnswer = (number: number, value: string) => {
    setAnswers((current) => ({ ...current, [number]: value }))
  }

  const submitExam = () => {
    setReportItems(scoreQuestions(questions, answers))
    setStage('report')
    setHintQuestionNumber(null)
  }

  const renderAnswerField = (question: ReadingQuestion) => {
    const value = answers[question.number] || ''
    if (question.answerType === 'true-false-not-given') {
      return (
        <select value={value} onChange={(event) => setAnswer(question.number, event.target.value)}>
          <option value="">Select answer</option>
          <option value="TRUE">TRUE</option>
          <option value="FALSE">FALSE</option>
          <option value="NOT GIVEN">NOT GIVEN</option>
        </select>
      )
    }
    if (question.answerType === 'yes-no-not-given') {
      return (
        <select value={value} onChange={(event) => setAnswer(question.number, event.target.value)}>
          <option value="">Select answer</option>
          <option value="YES">YES</option>
          <option value="NO">NO</option>
          <option value="NOT GIVEN">NOT GIVEN</option>
        </select>
      )
    }
    if (question.answerType === 'multiple-choice') {
      const isRomanHeading = READING_ROMAN_HEADING_PATTERN.test(String(question.correctAnswer || '').trim())
      const choices = isRomanHeading
        ? ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
        : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      return (
        <select value={value} onChange={(event) => setAnswer(question.number, event.target.value)}>
          <option value="">Select answer</option>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      )
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => setAnswer(question.number, event.target.value)}
        placeholder="Type your answer"
      />
    )
  }

  const renderFillBlank = (questionNumber: number, before: string, after: string) => (
    <span className="readingFillBlankSlot" id={`reading-question-${questionNumber}`}>
      {before && <span className="readingFillBlankPrefix">{before} </span>}
      <span className="readingFillBlankInputWrap">
        <span className="readingFillBlankNumber">{questionNumber}</span>
        <input
          type="text"
          value={answers[questionNumber] || ''}
          onChange={(event) => setAnswer(questionNumber, event.target.value)}
          placeholder="answer"
          className="readingFillBlankInput"
          aria-label={`Question ${questionNumber}`}
        />
      </span>
      {after && <span className="readingFillBlankSuffix">{after}</span>}
    </span>
  )

  const renderFillGroup = (group: ReadingFillQuestionGroup) => {
    const questionByNumber = new Map(group.questions.map((question) => [question.number, question]))
    return (
      <article key={group.id} className="readingQuestionCard readingFillQuestionGroup">
        <div className="readingFillGroupHeader">
          <p className="readingQuestionNumber">
            Questions {group.start}-{group.end}
          </p>
          {group.instruction && <pre className="readingFillInstruction">{group.instruction}</pre>}
        </div>
        <div className="readingFillOriginalBlock">
          {group.displayLines.map((line, lineIndex) => (
            <p key={`${group.id}-line-${lineIndex}`} className="readingFillLine">
              {line.segments.map((segment, segmentIndex) => {
                if (segment.kind === 'text') return <span key={segmentIndex}>{segment.text} </span>
                if (segment.kind === 'heading') {
                  return (
                    <strong key={segmentIndex} className="readingFillInlineHeading">
                      {segment.text}{' '}
                    </strong>
                  )
                }
                if (segment.kind !== 'blank') return null
                if (!questionByNumber.has(segment.questionNumber)) return null
                return renderFillBlank(segment.questionNumber, segment.before, segment.after)
              })}
            </p>
          ))}
        </div>
      </article>
    )
  }

  const renderFillFallback = (question: ReadingQuestion) => {
    const context = parseFillContextFromPrompt(question.prompt, question.number) || { before: '', after: '' }
    return (
      <article key={question.number} id={`reading-question-${question.number}`} className="readingQuestionCard">
        <p className="readingQuestionNumber">Question {question.number}</p>
        <p className="readingFillLine">{renderFillBlank(question.number, context.before, context.after)}</p>
      </article>
    )
  }

  const renderQuestionCard = (question: ReadingQuestion) => {
    const isHinting = hintQuestionNumber === question.number
    return (
      <article key={question.number} id={`reading-question-${question.number}`} className="readingQuestionCard">
        <div className="readingQuestionCardTop">
          <div>
            <p className="readingQuestionNumber">Question {question.number}</p>
            <p className="readingQuestionPrompt">{getDisplayPrompt(question)}</p>
          </div>
          <button
            type="button"
            className={`readingHintTrigger ${isHinting ? 'is-open' : ''}`.trim()}
            onClick={() => setHintQuestionNumber(isHinting ? null : question.number)}
          >
            {isHinting ? '🙈 ซ่อนคำใบ้' : '💡 ดูคำใบ้ · Hint'}
          </button>
        </div>
        {isHinting && !isJudgementQuestion(question) && (
          <div className="readingHintBox">
            <strong>Hint:</strong> evidence highlighted in the passage.
          </div>
        )}
        <div className="readingAnswerField">{renderAnswerField(question)}</div>
      </article>
    )
  }

  const hintExcerpt =
    hintQuestionNumber === null
      ? ''
      : String(questions.find((question) => question.number === hintQuestionNumber)?.exactPortion || '').trim()

  const renderPassageText = (text: string) => {
    if (!hintExcerpt) return text
    const index = text.toLowerCase().indexOf(hintExcerpt.toLowerCase())
    if (index === -1) return text
    return (
      <>
        {text.slice(0, index)}
        <mark className="readingPassageHighlight readingPassageHighlight-hint">{text.slice(index, index + hintExcerpt.length)}</mark>
        {text.slice(index + hintExcerpt.length)}
      </>
    )
  }

  if (stage === 'report') {
    return (
      <div className="readingReportWrap">
        <div className="readingAttemptToolbar">
          <div>
            <p className="sectionLabel">Monthly Reading</p>
            <h3>{passageTitle} Report</h3>
            <p className="meta">
              Score: {correctCount}/{reportItems.length}
            </p>
          </div>
          <div className="controls">
            <button type="button" className="secondary" onClick={onBack}>
              Back to months
            </button>
            <button
              type="button"
              onClick={() => {
                setStage('exam')
                setAnswers({})
                setReportItems([])
              }}
            >
              Retry Exam
            </button>
          </div>
        </div>

        <div className="readingSummaryStrip">
          <article className="readingSummaryCard">
            <p className="sectionLabel">Accuracy</p>
            <strong>{accuracy}%</strong>
            <span>{correctCount} correct answers</span>
          </article>
          <article className="readingSummaryCard">
            <p className="sectionLabel">Unanswered</p>
            <strong>{unansweredCount}</strong>
            <span>questions left blank</span>
          </article>
          <article className="readingSummaryCard">
            <p className="sectionLabel">Review Focus</p>
            <strong>{reportItems.find((item) => !item.isCorrect)?.number ? `Q${reportItems.find((item) => !item.isCorrect)?.number}` : 'Strong set'}</strong>
            <span>start with the first wrong answer</span>
          </article>
        </div>

        <div className="readingPassageBreakdown">
          <article className="readingPassageBreakdownCard">
            <p className="sectionLabel">Passage {passage.number}</p>
            <h4>{passageTitle}</h4>
            <p className="meta">
              {correctCount}/{reportItems.length} correct
            </p>
          </article>
        </div>

        <div className="readingReportList">
          {reportItems.map((item) => (
            <article
              key={`reading-report-${item.number}`}
              className={`readingReportCard ${item.isCorrect ? 'readingReportCard-correct' : 'readingReportCard-wrong'}`}
            >
              <div className="readingReportHeader">
                <div>
                  <p className="readingQuestionNumber">Question {item.number}</p>
                  <p className="readingQuestionPrompt">{getDisplayPrompt(item)}</p>
                </div>
                <span className={`readingAnswerStatus ${item.isCorrect ? 'readingAnswerStatus-correct' : 'readingAnswerStatus-wrong'}`}>
                  {item.isCorrect ? 'Correct' : 'Wrong'}
                </span>
              </div>
              <p className="meta">Your answer: {item.userAnswer || 'No answer'}</p>
              <p className="meta">Correct answer: {item.correctAnswer}</p>
              <div className="readingReportEvidence">
                <h4>Why?</h4>
                <p>{item.explanationThai}</p>
                {item.exactPortion && <blockquote>{item.exactPortion}</blockquote>}
              </div>
              {item.paraphrasedVocabulary && (
                <div className="readingParaphraseCard readingParaphraseCard-report">
                  <p className="sectionLabel">Important vocab / phrase</p>
                  <p>{item.paraphrasedVocabulary}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    )
  }

  const getQuestionSectionMeta = (question: ReadingQuestion): { typeKey: string; label: string } => {
    if (
      isReadingFillQuestion(passage, question, noopMatchingCheck) ||
      (question.answerType === 'text' && isReadingFillStylePrompt(question.prompt, question.number))
    ) {
      return { typeKey: 'completion', label: 'Sentence / Note Completion' }
    }
    switch (question.answerType) {
      case 'true-false-not-given':
        return { typeKey: 'tfng', label: 'True / False / Not Given' }
      case 'yes-no-not-given':
        return { typeKey: 'ynng', label: 'Yes / No / Not Given' }
      case 'multiple-choice':
        return { typeKey: 'mc', label: 'Multiple Choice' }
      default:
        return { typeKey: 'short', label: 'Short Answer' }
    }
  }

  type QuestionSection = { id: string; label: string; numbers: number[]; content: ReactNode[] }
  const questionSections: QuestionSection[] = []
  let sectionBuild: QuestionSection | null = null
  let sectionTypeKey: string | null = null
  const pushSectionNode = (typeKey: string, label: string, numbers: number[], node: ReactNode, forceNew: boolean) => {
    if (forceNew || !sectionBuild || sectionTypeKey !== typeKey) {
      sectionBuild = { id: `qsec-${questionSections.length}`, label, numbers: [], content: [] }
      questionSections.push(sectionBuild)
      sectionTypeKey = forceNew ? null : typeKey
    }
    sectionBuild.numbers.push(...numbers)
    sectionBuild.content.push(node)
  }

  questions.forEach((question) => {
    if (fillGroupQuestionNumbers.has(question.number)) {
      const fillGroup = fillGroupByNumber.get(question.number)
      if (fillGroup && fillGroup.questions[0]?.number === question.number) {
        pushSectionNode(
          `fill-${fillGroup.id}`,
          'Sentence / Note Completion',
          fillGroup.questions.map((item) => item.number),
          renderFillGroup(fillGroup),
          true
        )
      }
      return
    }
    if (
      isReadingFillQuestion(passage, question, noopMatchingCheck) ||
      (question.answerType === 'text' && isReadingFillStylePrompt(question.prompt, question.number))
    ) {
      const meta = getQuestionSectionMeta(question)
      pushSectionNode(meta.typeKey, meta.label, [question.number], renderFillFallback(question), false)
      return
    }
    const meta = getQuestionSectionMeta(question)
    pushSectionNode(meta.typeKey, meta.label, [question.number], renderQuestionCard(question), false)
  })

  const numberToSectionId = new Map<number, string>()
  questionSections.forEach((section) => section.numbers.forEach((n) => numberToSectionId.set(n, section.id)))
  const activeSectionId = openSectionId ?? questionSections[0]?.id ?? null

  return (
    <div className="readingExamWrap">
      <div className="readingAttemptToolbar">
        <div>
          <p className="sectionLabel">Monthly Reading</p>
          <h3>{passageTitle}</h3>
          <p className="meta">
            {answeredCount}/{questions.length} answered · Passage {passage.number}
          </p>
        </div>
        <div className="controls">
          <button type="button" className="secondary" onClick={onBack}>
            Back to months
          </button>
        </div>
      </div>

      <div className="readingSummaryStrip">
        <article className="readingSummaryCard">
          <p className="sectionLabel">Exam Progress</p>
          <strong>
            {answeredCount}/{questions.length}
          </strong>
          <span>questions answered</span>
        </article>
        <article className="readingSummaryCard">
          <p className="sectionLabel">Current Passage</p>
          <strong>{passageTitle}</strong>
          <span>{questions.length} questions in this passage</span>
        </article>
        <article className="readingSummaryCard">
          <p className="sectionLabel">Study Mode</p>
          <strong>Highlight + Hint</strong>
          <span>Mark evidence before you submit</span>
        </article>
      </div>

      <div className="readingExamLayout readingExamLayout-bank">
        <section className="readingPassagePanel readingPassagePanel-exam">
          <div className="readingPassageHeader">
            <div>
              <p className="sectionLabel">Passage {passage.number}</p>
              <h3>{passageTitle}</h3>
            </div>
            {hintExcerpt && (
              <div className="readingHintBox">
                <strong>Hint active:</strong> highlighted in the passage
              </div>
            )}
          </div>
          <div className="readingPassageBody">
            {passage.bodyParagraphs.length ? (
              passage.bodyParagraphs.map((paragraph, index) => (
                <p key={`landing-reading-p-${index}`}>{renderPassageText(paragraph)}</p>
              ))
            ) : (
              <p className="meta">Passage text is not available for this exam yet.</p>
            )}
          </div>
        </section>

        <section className="readingQuestionsPanel readingQuestionsPanel-exam">
          <div className="readingQuestionsHeader">
            <div>
              <p className="sectionLabel">Questions</p>
              <h3>Answer below — scroll this panel for more questions</h3>
            </div>
            <span className="bandPill">{questions.length} questions</span>
          </div>

          <div className="readingQuestionsScroll">
            <div className="readingQuestionNavigator">
              {questions.map((question) => {
                const hasAnswer = Boolean(String(answers[question.number] || '').trim())
                const isHinting = hintQuestionNumber === question.number
                return (
                  <button
                    key={`nav-${question.number}`}
                    type="button"
                    className={`${hasAnswer ? 'is-answered' : ''} ${isHinting ? 'is-active' : ''}`.trim()}
                    onClick={() => {
                      setHintQuestionNumber(question.number)
                      setOpenSectionId(numberToSectionId.get(question.number) ?? null)
                      window.setTimeout(() => {
                        document.getElementById(`reading-question-${question.number}`)?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }, 0)
                    }}
                  >
                    {question.number}
                  </button>
                )
              })}
            </div>

            {passage.questionSectionText && fillGroups.length === 0 && (
              <details className="readingQuestionReference">
                <summary>Show original question block</summary>
                <pre>{passage.questionSectionText}</pre>
              </details>
            )}

            <div className="readingQuestionSections">
              {questionSections.map((section) => {
                const isOpen = section.id === activeSectionId
                const rangeStart = Math.min(...section.numbers)
                const rangeEnd = Math.max(...section.numbers)
                const answeredInSection = section.numbers.filter((n) => String(answers[n] || '').trim()).length
                return (
                  <div key={section.id} className={`readingQuestionGroup ${isOpen ? 'is-open' : ''}`.trim()}>
                    <button
                      type="button"
                      className="readingQuestionGroupHeader"
                      aria-expanded={isOpen}
                      onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                    >
                      <span className="readingQuestionGroupChevron" aria-hidden>
                        ▶
                      </span>
                      <span className="readingQuestionGroupTitle">{section.label}</span>
                      <span className="readingQuestionGroupRange">
                        {rangeStart === rangeEnd ? `Q${rangeStart}` : `Q${rangeStart}–${rangeEnd}`}
                      </span>
                      <span className="readingQuestionGroupCount">
                        {answeredInSection}/{section.numbers.length} answered
                      </span>
                    </button>
                    <div className="readingQuestionGroupBody">
                      <div className="readingQuestionList">{section.content}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="readingExamSubmitBar">
            <button type="button" className="readingSubmitExamBtn readingSubmitExamBtn-end" onClick={submitExam}>
              Submit Reading Exam
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
