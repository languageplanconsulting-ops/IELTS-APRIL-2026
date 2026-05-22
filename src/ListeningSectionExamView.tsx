import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  hasSeenListeningEvidenceTutorial,
  ListeningEvidenceTutorial
} from './ListeningEvidenceTutorial'
import { getListeningHighlightMatch } from './listeningHighlightMatch'
import { isListeningGapFillAnswerCorrect } from './listeningPart1AnswerCheck'
import type { Part1ExamForm, Part1FormLine } from './listeningPart1FormLayout'
import type {
  ListeningSectionExamConfig,
  ListeningSectionExamGroup,
  ListeningSectionExamQuestion
} from './listeningSectionExamModel'
import {
  getListeningSpeakerTone,
  listeningScriptHasDialogue,
  parseListeningScriptSegments,
  type ListeningScriptSegment
} from './listeningScriptReader'
import './ListeningSectionExamView.css'

type QuestionAttempt = {
  answer: string
  evidenceDraft: string
  answerStatus: 'idle' | 'wrong' | 'correct'
  evidenceStatus: 'idle' | 'wrong' | 'partial' | 'exact'
  wrongEvidence: string
  completed: boolean
  bridgeDismissed: boolean
  feedback: string
}

type FirstAttemptReview = {
  answer: string
  evidence: string
  answerOk: boolean
  evidenceOk: boolean
}

export type ListeningNotebookSavePayload = {
  criterion: string
  quote: string
  fix: string
  thaiMeaning: string
}

const defaultAttempt = (): QuestionAttempt => ({
  answer: '',
  evidenceDraft: '',
  answerStatus: 'idle',
  evidenceStatus: 'idle',
  wrongEvidence: '',
  completed: false,
  bridgeDismissed: false,
  feedback: ''
})

type ScriptDecoration = {
  start: number
  end: number
  kind: 'correct' | 'wrong' | 'draft'
  questionId: string
  questionNumber: number
}

type LatestEvidenceSelection = {
  questionId: string
  text: string
}

type HighlightMenuState = {
  questionId: string
  questionNumber: number
  x: number
  y: number
}

const formatListeningPlaybackTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

const buildPassageDecorations = (
  passage: string,
  questions: ListeningSectionExamQuestion[],
  attempts: Record<string, QuestionAttempt>
): ScriptDecoration[] => {
  const lowerPassage = passage.toLowerCase()
  const decorations: ScriptDecoration[] = []

  for (const question of questions) {
    const attempt = attempts[question.id] || defaultAttempt()
    const highlightText = attempt.completed
      ? attempt.evidenceDraft || question.evidence
      : attempt.evidenceStatus === 'wrong'
        ? attempt.wrongEvidence || attempt.evidenceDraft
        : attempt.evidenceDraft

    if (!highlightText.trim()) continue

    const start = lowerPassage.indexOf(highlightText.toLowerCase())
    if (start < 0) continue

    decorations.push({
      start,
      end: start + highlightText.length,
      questionId: question.id,
      kind: attempt.completed
        ? 'correct'
        : attempt.evidenceStatus === 'wrong'
          ? 'wrong'
          : 'draft',
      questionNumber: question.number
    })
  }

  return decorations
    .sort((a, b) => a.start - b.start)
    .filter((item, index, list) => {
      if (index === 0) return true
      const prev = list[index - 1]
      return item.start >= prev.end
    })
}

const renderDecoratedPassage = (
  passage: string,
  decorations: ScriptDecoration[],
  onHighlightContextMenu?: (event: MouseEvent<HTMLElement>, decoration: ScriptDecoration) => void
): ReactNode => {
  if (decorations.length === 0) return passage

  const parts: ReactNode[] = []
  let cursor = 0

  decorations.forEach((decoration, index) => {
    if (decoration.start > cursor) {
      parts.push(passage.slice(cursor, decoration.start))
    }
    const slice = passage.slice(decoration.start, decoration.end)
    parts.push(
      <mark
        key={`${decoration.questionNumber}-${index}`}
        className={`listeningSectionExamEvidenceMark is-${decoration.kind}`}
        onContextMenu={
          decoration.kind === 'correct' || !onHighlightContextMenu
            ? undefined
            : (event) => onHighlightContextMenu(event, decoration)
        }
      >
        {decoration.kind !== 'draft' ? (
          <span className="listeningSectionExamEvidenceBadge">
            Q{decoration.questionNumber} {decoration.kind === 'correct' ? 'correct evidence' : 'wrong evidence'}
          </span>
        ) : null}
        {slice}
      </mark>
    )
    cursor = decoration.end
  })

  if (cursor < passage.length) parts.push(passage.slice(cursor))
  return parts
}

const renderSegmentBody = (
  text: string,
  passage: string,
  decorations: ScriptDecoration[],
  onHighlightContextMenu?: (event: MouseEvent<HTMLElement>, decoration: ScriptDecoration) => void
) => {
  if (decorations.length === 0) return text

  const passageOffset = passage.toLowerCase().indexOf(text.toLowerCase())
  if (passageOffset < 0) return text

  const localDecorations = decorations
    .filter((item) => item.end > passageOffset && item.start < passageOffset + text.length)
    .map((item) => ({
      ...item,
      start: Math.max(0, item.start - passageOffset),
      end: Math.min(text.length, item.end - passageOffset)
    }))

  if (localDecorations.length === 0) return text
  return renderDecoratedPassage(text, localDecorations, onHighlightContextMenu)
}

export type ListeningSectionExamViewProps = {
  config: ListeningSectionExamConfig
  excerptDrill?: boolean
  playbackState: 'idle' | 'playing' | 'paused' | 'ended' | 'error'
  playbackPosition: number
  playbackDuration: number
  audioPlayed: boolean
  onTogglePlay: () => void
  onSeek: (seconds: number) => void
  onBack: () => void
  onSaveNotebook: (question: ListeningSectionExamQuestion, payload?: ListeningNotebookSavePayload) => void
  onQuestionComplete?: (questionId: string) => void
  onKnewIt?: () => void
  testTabs?: Array<{ id: string; label: string }>
  activeTestId?: string
  onTestChange?: (testId: string) => void
  continueAfterReportLabel?: string
  onContinueAfterReport?: () => void
}

export function ListeningSectionExamView({
  config,
  excerptDrill = false,
  playbackState,
  playbackPosition,
  playbackDuration,
  audioPlayed,
  onTogglePlay,
  onSeek,
  onBack,
  onSaveNotebook,
  onQuestionComplete,
  testTabs,
  activeTestId,
  onTestChange,
  continueAfterReportLabel,
  onContinueAfterReport
}: ListeningSectionExamViewProps) {
  const scriptBodyRef = useRef<HTMLDivElement | null>(null)
  const [activeQuestionId, setActiveQuestionId] = useState(config.questions[0]?.id || '')
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({})
  const [examStage, setExamStage] = useState<'answering' | 'correcting' | 'report'>('answering')
  const [firstAttemptReview, setFirstAttemptReview] = useState<Record<string, FirstAttemptReview>>({})
  const [examFeedback, setExamFeedback] = useState('')
  const [latestEvidenceSelection, setLatestEvidenceSelection] = useState<LatestEvidenceSelection | null>(null)
  const [highlightMenu, setHighlightMenu] = useState<HighlightMenuState | null>(null)
  const [scriptCollapsed, setScriptCollapsed] = useState(false)
  const [evidenceTutorialOpen, setEvidenceTutorialOpen] = useState(false)
  const [evidenceTutorialStep, setEvidenceTutorialStep] = useState(0)
  const answerOnlyMode = Boolean(config.answerOnlyMode)

  useEffect(() => {
    setActiveQuestionId(config.questions[0]?.id || '')
    setAttempts({})
    setExamStage('answering')
    setFirstAttemptReview({})
    setExamFeedback('')
    setLatestEvidenceSelection(null)
    setHighlightMenu(null)
    setEvidenceTutorialOpen(false)
    setEvidenceTutorialStep(0)
  }, [config.title, config.passage])

  useEffect(() => {
    if (answerOnlyMode || examStage !== 'answering') {
      setEvidenceTutorialOpen(false)
      return
    }
    if (hasSeenListeningEvidenceTutorial()) return
    const timer = window.setTimeout(() => setEvidenceTutorialOpen(true), 480)
    return () => window.clearTimeout(timer)
  }, [answerOnlyMode, examStage, config.title])

  useEffect(() => {
    if (!highlightMenu || typeof window === 'undefined') return undefined

    const closeMenu = () => setHighlightMenu(null)
    window.addEventListener('click', closeMenu)
    window.addEventListener('keydown', closeMenu)
    return () => {
      window.removeEventListener('click', closeMenu)
      window.removeEventListener('keydown', closeMenu)
    }
  }, [highlightMenu])

  const segments = useMemo(
    () => parseListeningScriptSegments(config.passage),
    [config.passage]
  )
  const hasDialogue = useMemo(() => listeningScriptHasDialogue(segments), [segments])

  const questionByNumber = useMemo(() => {
    const map = new Map<number, ListeningSectionExamQuestion>()
    config.questions.forEach((question) => map.set(question.number, question))
    return map
  }, [config.questions])

  const activeQuestion = config.questions.find((item) => item.id === activeQuestionId) || config.questions[0]
  const activeAttempt = attempts[activeQuestion?.id || ''] || defaultAttempt()

  const isQuestionAnswerCorrect = useCallback(
    (question: ListeningSectionExamQuestion, answer: string) => {
      if (question.layout === 'gap-fill') {
        return isListeningGapFillAnswerCorrect(answer, {
          correctAnswer: question.correctAnswer,
          acceptedAnswers: question.acceptedAnswers,
          options: question.options
        })
      }
      return answer.trim().toUpperCase() === question.correctAnswer.trim().toUpperCase()
    },
    []
  )

  const decorations = useMemo(
    () => buildPassageDecorations(config.passage, config.questions, attempts),
    [config.passage, config.questions, attempts]
  )

  const completedCount = config.questions.filter((item) => attempts[item.id]?.completed).length
  const answeredCount = config.questions.filter((item) => attempts[item.id]?.answer.trim()).length
  const evidenceCount = config.questions.filter((item) => attempts[item.id]?.evidenceDraft.trim()).length
  const isExamReadyToSubmit = answerOnlyMode
    ? answeredCount === config.questions.length
    : answeredCount === config.questions.length && evidenceCount === config.questions.length
  const needsCorrectionCount = config.questions.filter((item) => {
    const attempt = attempts[item.id] || defaultAttempt()
    if (answerOnlyMode) return attempt.answerStatus === 'wrong' && !attempt.completed
    return (attempt.answerStatus === 'wrong' || attempt.evidenceStatus === 'wrong') && !attempt.completed
  }).length

  const updateAttempt = useCallback((questionId: string, patch: Partial<QuestionAttempt>) => {
    setAttempts((current) => ({
      ...current,
      [questionId]: { ...(current[questionId] || defaultAttempt()), ...patch }
    }))
  }, [])

  const getChooseTwoSelection = (group: Extract<ListeningSectionExamGroup, { kind: 'choice-block' }>) =>
    group.questions
      .map((question) => attempts[question.id]?.answer || '')
      .filter((answer) => answer.trim())

  const getChooseTwoAssignedQuestion = (
    group: Extract<ListeningSectionExamGroup, { kind: 'choice-block' }>,
    optionKey: string
  ) => group.questions.find((question) => attempts[question.id]?.answer === optionKey)

  const buildChooseTwoAssignments = (
    group: Extract<ListeningSectionExamGroup, { kind: 'choice-block' }>,
    selectedKeys: string[]
  ) => {
    const assignments = new Map<string, string>()
    const usedKeys = new Set<string>()

    group.questions.forEach((question) => {
      assignments.set(question.id, '')
      const attempt = attempts[question.id] || defaultAttempt()
      if (attempt.completed && attempt.answer) {
        assignments.set(question.id, attempt.answer)
        usedKeys.add(attempt.answer)
      }
    })

    group.questions.forEach((question) => {
      if (assignments.get(question.id)) return
      const correctKey = selectedKeys.find(
        (key) => !usedKeys.has(key) && key.toUpperCase() === question.correctAnswer.toUpperCase()
      )
      if (!correctKey) return
      assignments.set(question.id, correctKey)
      usedKeys.add(correctKey)
    })

    group.questions.forEach((question) => {
      if (assignments.get(question.id)) return
      const nextKey = selectedKeys.find((key) => !usedKeys.has(key))
      if (!nextKey) return
      assignments.set(question.id, nextKey)
      usedKeys.add(nextKey)
    })

    return assignments
  }

  const handleChooseTwoToggle = (
    group: Extract<ListeningSectionExamGroup, { kind: 'choice-block' }>,
    optionKey: string
  ) => {
    const selectedKeys = getChooseTwoSelection(group)
    const assignedQuestion = getChooseTwoAssignedQuestion(group, optionKey)
    if (assignedQuestion && attempts[assignedQuestion.id]?.completed) return

    const isSelected = selectedKeys.includes(optionKey)
    if (!isSelected && selectedKeys.length >= group.pickCount) return

    const nextSelectedKeys = isSelected
      ? selectedKeys.filter((key) => key !== optionKey)
      : [...selectedKeys, optionKey]
    const assignments = buildChooseTwoAssignments(group, nextSelectedKeys)
    const targetQuestion =
      group.questions.find((question) => assignments.get(question.id) === optionKey) ||
      assignedQuestion ||
      group.questions.find((question) => !attempts[question.id]?.completed) ||
      group.questions[0]

    if (targetQuestion) activateQuestion(targetQuestion.id, true)

    group.questions.forEach((question) => {
      const attempt = attempts[question.id] || defaultAttempt()
      if (attempt.completed) return
      updateAttempt(question.id, {
        answer: assignments.get(question.id) || '',
        answerStatus: 'idle',
        feedback: ''
      })
    })
  }

  const claimLatestEvidenceForQuestion = useCallback((questionId: string) => {
    if (!latestEvidenceSelection?.text.trim()) return

    setAttempts((current) => {
      const targetAttempt = current[questionId] || defaultAttempt()
      if (targetAttempt.completed || targetAttempt.evidenceDraft.trim()) return current

      if (latestEvidenceSelection.questionId !== questionId) {
        const sourceAttempt = current[latestEvidenceSelection.questionId] || defaultAttempt()
        if (
          sourceAttempt.completed ||
          sourceAttempt.answer.trim() ||
          sourceAttempt.evidenceDraft !== latestEvidenceSelection.text
        ) {
          return current
        }
      }

      const next: Record<string, QuestionAttempt> = {
        ...current,
        [questionId]: {
          ...targetAttempt,
          evidenceDraft: latestEvidenceSelection.text,
          evidenceStatus: 'idle',
          wrongEvidence: '',
          feedback: ''
        }
      }

      Object.entries(current).forEach(([attemptQuestionId, attempt]) => {
        if (attemptQuestionId === questionId) return
        if (attempt.completed || attempt.answer.trim()) return
        if (attempt.evidenceDraft !== latestEvidenceSelection.text) return
        next[attemptQuestionId] = {
          ...attempt,
          evidenceDraft: '',
          evidenceStatus: 'idle',
          wrongEvidence: '',
          feedback: ''
        }
      })

      return next
    })
  }, [latestEvidenceSelection])

  const activateQuestion = useCallback((questionId: string, claimEvidence = false) => {
    setActiveQuestionId(questionId)
    if (claimEvidence) claimLatestEvidenceForQuestion(questionId)
  }, [claimLatestEvidenceForQuestion])

  const readScriptSelection = () => {
    const container = scriptBodyRef.current
    if (!container || typeof window === 'undefined') return ''
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return ''
    const range = selection.getRangeAt(0)
    if (!container.contains(range.commonAncestorContainer)) return ''
    return selection.toString().replace(/\s+/g, ' ').trim()
  }

  const handleScriptMouseUp = () => {
    if (answerOnlyMode) return
    if (!activeQuestion) return
    if (attempts[activeQuestion.id]?.completed) return

    window.requestAnimationFrame(() => {
      const selectedText = readScriptSelection()
      if (!selectedText) return
      updateAttempt(activeQuestion.id, {
        evidenceDraft: selectedText,
        evidenceStatus: 'idle',
        wrongEvidence: '',
        feedback: ''
      })
      setLatestEvidenceSelection({ questionId: activeQuestion.id, text: selectedText })
      setHighlightMenu(null)
      window.getSelection()?.removeAllRanges()
    })
  }

  const handleHighlightContextMenu = (event: MouseEvent<HTMLElement>, decoration: ScriptDecoration) => {
    event.preventDefault()
    event.stopPropagation()
    setHighlightMenu({
      questionId: decoration.questionId,
      questionNumber: decoration.questionNumber,
      x: event.clientX,
      y: event.clientY
    })
  }

  const removeListeningHighlight = (questionId: string) => {
    setAttempts((current) => {
      const attempt = current[questionId]
      if (!attempt || attempt.completed) return current
      return {
        ...current,
        [questionId]: {
          ...attempt,
          evidenceDraft: '',
          evidenceStatus: 'idle',
          wrongEvidence: '',
          feedback: ''
        }
      }
    })
    setLatestEvidenceSelection((current) => (current?.questionId === questionId ? null : current))
    setHighlightMenu(null)
  }

  const handleSubmitExamRound = () => {
    const missingQuestions = config.questions.filter((question) => {
      const attempt = attempts[question.id] || defaultAttempt()
      if (answerOnlyMode) return !attempt.answer.trim()
      return !attempt.answer.trim() || !attempt.evidenceDraft.trim()
    })

    if (missingQuestions.length > 0) {
      setExamFeedback(
        answerOnlyMode
          ? 'ตอบให้ครบทุกช่องก่อนส่งครับ'
          : 'ตอบคำถามและไฮไลต์หลักฐานให้ครบทุกข้อก่อนส่งครับ'
      )
      setAttempts((current) => {
        const next = { ...current }
        missingQuestions.forEach((question) => {
          const attempt = next[question.id] || defaultAttempt()
          next[question.id] = {
            ...attempt,
            feedback: answerOnlyMode
              ? 'กรอกคำตอบก่อนครับ'
              : !attempt.answer.trim()
                ? 'เลือกคำตอบก่อนครับ'
                : 'ไฮไลต์หลักฐานในสคริปต์ทางซ้ายก่อนครับ'
          }
        })
        return next
      })
      return
    }

    const firstRound = Object.keys(firstAttemptReview).length === 0
    const firstSnapshot: Record<string, FirstAttemptReview> = {}
    const newlyCompleted: string[] = []
    let allCorrect = true
    let roundCorrect = 0

    const nextAttempts: Record<string, QuestionAttempt> = { ...attempts }

    config.questions.forEach((question) => {
      const attempt = attempts[question.id] || defaultAttempt()
      const answerOk = isQuestionAnswerCorrect(question, attempt.answer)
      const matchKind = answerOnlyMode
        ? 'exact'
        : getListeningHighlightMatch(attempt.evidenceDraft, question.evidence, 0.4)
      const evidenceOk = answerOnlyMode ? true : matchKind !== 'none'

      if (firstRound) {
        firstSnapshot[question.id] = {
          answer: attempt.answer,
          evidence: attempt.evidenceDraft,
          answerOk,
          evidenceOk
        }
      }

      if (answerOk && evidenceOk) {
        roundCorrect += 1
        if (!attempt.completed) newlyCompleted.push(question.id)
        nextAttempts[question.id] = {
          ...attempt,
          answerStatus: 'correct',
          evidenceStatus: answerOnlyMode ? 'exact' : matchKind === 'exact' ? 'exact' : 'partial',
          wrongEvidence: '',
          completed: true,
          feedback: answerOnlyMode ? 'คำตอบถูกต้องครับ' : 'คำตอบและหลักฐานถูกต้องครับ'
        }
        return
      }

      allCorrect = false
      nextAttempts[question.id] = {
        ...attempt,
        answerStatus: answerOk ? 'correct' : 'wrong',
        evidenceStatus: answerOnlyMode
          ? 'idle'
          : evidenceOk
            ? matchKind === 'exact'
              ? 'exact'
              : 'partial'
            : 'wrong',
        wrongEvidence: answerOnlyMode || evidenceOk ? '' : attempt.evidenceDraft,
        completed: false,
        feedback: answerOnlyMode
          ? `คำตอบยังไม่ถูกครับ — ในสคริปต์: "${question.evidence.length > 90 ? `${question.evidence.slice(0, 87)}…` : question.evidence}"`
          : !answerOk && !evidenceOk
            ? 'คำตอบและหลักฐานยังไม่ถูกครับ แก้คำตอบ และลบ highlight นี้แล้วเลือกหลักฐานจริงใหม่'
            : !answerOk
              ? 'คำตอบยังไม่ถูกครับ เลือกคำตอบใหม่ แต่หลักฐานนี้ใช้ได้'
              : 'หลักฐานยังไม่ตรงครับ ลบ highlight นี้แล้วเลือกหลักฐานจริงใหม่'
      }
    })

    setAttempts(nextAttempts)

    if (firstRound) setFirstAttemptReview(firstSnapshot)
    newlyCompleted.forEach((questionId) => onQuestionComplete?.(questionId))

    if (allCorrect) {
      setExamStage('report')
      setExamFeedback(
        answerOnlyMode
          ? 'ครบ 100% แล้วครับ ดู report card พร้อมคำอธิบายภาษาไทยได้เลย'
          : 'ครบ 100% แล้วครับ ดู report card พร้อม keyword, paraphrase และ distractor ได้เลย'
      )
      return
    }

    setExamStage('correcting')
    setExamFeedback(
      answerOnlyMode
        ? `${roundCorrect}/${config.questions.length} ข้อถูกแล้ว แก้ข้อที่ยังผิด แล้วกด Submit corrections อีกครั้งครับ`
        : `${roundCorrect}/${config.questions.length} ข้อถูกครบทั้งคำตอบและหลักฐานแล้ว แก้ข้อที่ยังผิด แล้วกด Submit corrections อีกครั้งครับ`
    )
  }

  const renderScript = () => {
    if (segments.length === 0) {
      return (
        <p className="listeningSectionExamScriptPlain" onMouseUp={handleScriptMouseUp}>
          {renderDecoratedPassage(config.passage, decorations, handleHighlightContextMenu)}
        </p>
      )
    }

    return (
      <div className={`listeningSectionExamScriptTurns ${hasDialogue ? 'is-dialogue' : ''}`}>
        {segments.map((segment) => renderScriptTurn(segment))}
      </div>
    )
  }

  const renderScriptTurn = (segment: ListeningScriptSegment) => {
    const tone = getListeningSpeakerTone(segment.speaker)
    return (
      <article key={segment.id} className={`listeningSectionExamScriptTurn tone-${tone}`}>
        {segment.speaker ? <span className="listeningSectionExamScriptSpeaker">{segment.speaker}</span> : null}
        <p className="listeningSectionExamScriptBody" onMouseUp={handleScriptMouseUp}>
          {renderSegmentBody(segment.text, config.passage, decorations, handleHighlightContextMenu)}
        </p>
      </article>
    )
  }

  const getOptionLabel = (question: ListeningSectionExamQuestion, key: string) => {
    const option = question.options.find((item) => item.key.toUpperCase() === key.trim().toUpperCase())
    return option ? `${option.key}. ${option.text}` : key || 'No answer'
  }

  const renderExamControlPanel = () => (
    <article className={`listeningSectionExamSubmitPanel is-${examStage}`}>
      <div>
        <p className="listeningSectionExamSubmitEyebrow">
          {examStage === 'correcting' ? 'Correction round' : 'One-time section submit'}
        </p>
        <h3>
          {examStage === 'correcting'
            ? 'Fix the questions that are still not 100%'
            : answerOnlyMode
              ? 'Answer every question before you submit'
              : 'Answer every question and highlight every evidence first'}
        </h3>
        <p>
          {answerOnlyMode
            ? `${answeredCount}/${config.questions.length} answered`
            : `${answeredCount}/${config.questions.length} answered · ${evidenceCount}/${config.questions.length} evidence highlighted`}
        </p>
        {examFeedback ? <p className="listeningSectionExamSubmitFeedback">{examFeedback}</p> : null}
      </div>
      <div className="listeningSectionExamSubmitActions">
        {examStage === 'correcting' ? (
          <span>{needsCorrectionCount} need correction</span>
        ) : (
          <span>
            {answerOnlyMode
              ? `${config.questions.length - answeredCount} left`
              : `${config.questions.length - Math.min(answeredCount, evidenceCount)} left`}
          </span>
        )}
        <button
          type="button"
          className="listeningSectionExamSubmitAll"
          disabled={!isExamReadyToSubmit}
          onClick={handleSubmitExamRound}
        >
          {examStage === 'correcting' ? 'Submit corrections' : 'Submit all answers'}
        </button>
      </div>
    </article>
  )

  const renderFinalReportCard = () => {
    const firstAttemptCorrectCount = config.questions.filter((question) => {
      const first = firstAttemptReview[question.id]
      if (!first) return attempts[question.id]?.completed
      return answerOnlyMode ? first.answerOk : first.answerOk && first.evidenceOk
    }).length
    const correctedCount = config.questions.length - firstAttemptCorrectCount

    return (
      <article className="listeningSectionExamFinalReport">
        <header className="listeningSectionExamReportHero">
          <div>
            <p className="listeningSectionExamSubmitEyebrow">Report card</p>
            <h3>Listening section mastered</h3>
            <p>
              {answerOnlyMode
                ? 'ครบ 100% แล้วครับ ด้านล่างคือคำตอบที่ถูก คำอธิบายภาษาไทย และประโยคจาก audioscript'
                : 'ครบ 100% แล้วครับ ด้านล่างคือ keyword, passage response, Thai explanation และ distractor จากคำตอบรอบแรก'}
            </p>
          </div>
          <div className="listeningSectionExamReportScore">
            <strong>{config.questions.length}/{config.questions.length}</strong>
            <span>final score</span>
          </div>
        </header>

        <div className="listeningSectionExamReportSummary">
          <div>
            <span>First attempt</span>
            <strong>{firstAttemptCorrectCount}/{config.questions.length}</strong>
          </div>
          <div>
            <span>Corrected</span>
            <strong>{correctedCount}</strong>
          </div>
          {!answerOnlyMode ? (
            <div>
              <span>Evidence rule</span>
              <strong>40%</strong>
            </div>
          ) : null}
        </div>

        <div className="listeningSectionExamReportGrid">
          {config.questions.map((question) => {
            const first = firstAttemptReview[question.id] || {
              answer: attempts[question.id]?.answer || '',
              evidence: attempts[question.id]?.evidenceDraft || '',
              answerOk: attempts[question.id]?.answerStatus === 'correct',
              evidenceOk: attempts[question.id]?.evidenceStatus === 'exact' || attempts[question.id]?.evidenceStatus === 'partial'
            }
            const firstCorrect = answerOnlyMode ? first.answerOk : first.answerOk && first.evidenceOk
            const distractor =
              first.answer && !first.answerOk
                ? getOptionLabel(question, first.answer)
                : ''
            const notebookPayload: ListeningNotebookSavePayload = {
              criterion: 'Listening Report',
              quote: `Q${question.number}: ${question.stem || question.questionText}`,
              fix: [
                `Keyword in question: ${question.questionKeyword || question.stem}`,
                `Passage response: ${question.passageKeyword || question.evidence}`,
                `Evidence: ${question.evidence}`,
                `Distractor: ${distractor || 'ไม่มีจากคำตอบรอบแรก'}`
              ].join('\n'),
              thaiMeaning: question.explanationThai || question.thaiMeaning || ''
            }
            return (
              <section
                key={`listening-report-${question.id}`}
                className={`listeningSectionExamReportItem ${firstCorrect ? 'is-first-correct' : 'is-first-wrong'}`}
              >
                <div className="listeningSectionExamReportTop">
                  <span className="listeningSectionExamQNum">{question.number}</span>
                  <div>
                    <div className="listeningSectionExamReportTitleLine">
                      <h4>{question.stem || question.questionText}</h4>
                      <span className={`listeningSectionExamReportStatus ${firstCorrect ? 'is-clean' : 'is-corrected'}`}>
                        {firstCorrect ? 'First try' : 'Corrected'}
                      </span>
                    </div>
                    <p>{firstCorrect ? 'ตอบถูกตั้งแต่รอบแรก' : 'เคยพลาดในรอบแรก จึงเก็บเป็นจุดเรียนรู้'}</p>
                  </div>
                </div>

                <dl className={`listeningSectionExamReportTeachingGrid ${answerOnlyMode ? 'is-part1' : ''}`}>
                  {answerOnlyMode ? (
                    <>
                      <div>
                        <dt>Your first answer</dt>
                        <dd>{first.answer || '—'}</dd>
                      </div>
                      <div>
                        <dt>Correct answer</dt>
                        <dd>{question.correctAnswer}</dd>
                      </div>
                      <div className="is-wide">
                        <dt>Audioscript</dt>
                        <dd>{question.evidence}</dd>
                      </div>
                      <div className="is-wide">
                        <dt>Thai explanation</dt>
                        <dd>{question.explanationThai || question.thaiMeaning}</dd>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <dt>Keyword in question</dt>
                        <dd>{question.questionKeyword || question.stem}</dd>
                      </div>
                      <div>
                        <dt>Passage response</dt>
                        <dd>{question.passageKeyword || question.evidence}</dd>
                      </div>
                      <div className="is-wide">
                        <dt>Thai explanation</dt>
                        <dd>{question.explanationThai || question.thaiMeaning}</dd>
                      </div>
                      <div className="is-wide">
                        <dt>Distractor</dt>
                        <dd>{distractor || 'ไม่มีจากคำตอบรอบแรก'}</dd>
                      </div>
                    </>
                  )}
                </dl>

                {!answerOnlyMode ? (
                  <div className="listeningSectionExamReportEvidence">
                    <span>Evidence</span>
                    <p>{question.evidence}</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  className="listeningSectionExamReportSave"
                  onClick={() => onSaveNotebook(question, notebookPayload)}
                >
                  Save teaching note
                </button>
              </section>
            )
          })}
        </div>
        {continueAfterReportLabel && onContinueAfterReport ? (
          <div className="listeningSectionExamReportContinue">
            <button type="button" className="listeningSectionExamSubmitAll" onClick={onContinueAfterReport}>
              {continueAfterReportLabel}
            </button>
          </div>
        ) : null}
      </article>
    )
  }

  const playbackPercent = playbackDuration > 0 ? Math.min(100, (playbackPosition / playbackDuration) * 100) : 0
  const playbackStatus =
    playbackState === 'playing'
      ? 'Playing'
      : playbackState === 'paused'
        ? 'Paused'
        : playbackState === 'ended'
          ? 'Finished'
          : playbackState === 'error'
            ? 'Error'
            : audioPlayed
              ? 'Ready to replay'
              : 'Ready'
  const playbackButtonLabel =
    playbackState === 'playing'
      ? 'Pause'
      : playbackState === 'paused'
        ? 'Resume'
        : playbackState === 'ended'
          ? 'Replay'
          : 'Play'
  const playbackButtonIcon = playbackState === 'playing' ? 'Ⅱ' : '▶'

  return (
    <div className="listeningSectionExam" data-stage={examStage}>
      <header className="listeningSectionExamHeader">
        <div>
          <button type="button" className="listeningSectionExamBack" onClick={onBack}>
            ← Exam bank
          </button>
          <p className="listeningSectionExamEyebrow">Section {config.sectionNumber}</p>
          <h1>{config.title}</h1>
          <p className="listeningSectionExamSubtitle">{config.subtitle}</p>
        </div>
        <div className="listeningSectionExamProgress">
          {!answerOnlyMode ? (
            <button
              type="button"
              className="listeningSectionExamHelpBtn"
              aria-label="เปิดคำแนะนำ Evidence mode"
              title="วิธีใช้ Evidence mode"
              onClick={() => {
                setEvidenceTutorialStep(0)
                setEvidenceTutorialOpen(true)
              }}
            >
              ?
            </button>
          ) : null}
          <span>Completed</span>
          <strong>
            {completedCount}/{config.questions.length}
          </strong>
        </div>
      </header>

      <div className="listeningSectionExamLayout">
        <aside
          className={`listeningSectionExamScriptPane ${
            evidenceTutorialOpen && evidenceTutorialStep === 2 ? 'is-tutorial-highlight' : ''
          }`}
        >
          <div className="listeningSectionExamAudio">
            <div className="listeningSectionExamAudioMeta">
              <span>Part {config.sectionNumber}</span>
              <span>{playbackStatus}</span>
            </div>
            <div className="listeningSectionAudioPlayer">
              <button
                type="button"
                className="listeningSectionExamPlayBtn"
                aria-label={`${playbackButtonLabel} audio`}
                onClick={onTogglePlay}
              >
                <span aria-hidden>{playbackButtonIcon}</span>
                <span>{playbackButtonLabel}</span>
              </button>
              <div className="listeningSectionExamTimeline">
                <div
                  className="listeningSectionExamTimelineFill"
                  style={{ width: `${playbackPercent}%` }}
                  aria-hidden="true"
                />
                <input
                  type="range"
                  min="0"
                  max={Math.max(1, Math.floor(playbackDuration || 0))}
                  step="1"
                  value={Math.min(Math.floor(playbackPosition || 0), Math.max(1, Math.floor(playbackDuration || 0)))}
                  disabled={!playbackDuration}
                  aria-label="Audio progress"
                  onChange={(event) => onSeek(Number(event.target.value))}
                />
              </div>
              <span className="listeningSectionExamTime">
                {formatListeningPlaybackTime(playbackPosition)} / {formatListeningPlaybackTime(playbackDuration)}
              </span>
            </div>
          </div>

          <div className="listeningSectionExamScriptCard">
            <button
              type="button"
              className="listeningSectionExamScriptToggle"
              onClick={() => setScriptCollapsed((value) => !value)}
              aria-expanded={!scriptCollapsed}
            >
              <span>Audioscript</span>
              <span aria-hidden>{scriptCollapsed ? '▼' : '▲'}</span>
            </button>
            {!scriptCollapsed ? (
              <>
                <p className="listeningSectionExamScriptHint">
                  {excerptDrill
                    ? 'Practice script: all study excerpts for this drill are shown below (condensed format).'
                    : answerOnlyMode
                      ? 'Audioscript for reference while you listen. Fill each gap on the right — no highlighting needed.'
                      : activeQuestion
                        ? `Q${activeQuestion.number}: highlight evidence in the script, then answer on the right. Order does not matter.`
                        : 'Select a question on the right, then highlight evidence here.'}
                </p>
                <div
                  ref={scriptBodyRef}
                  className={`listeningSectionExamScriptBodyWrap script-scroll ${
                    activeAttempt.evidenceStatus === 'wrong' ? 'is-evidence-wrong' : ''
                  }`}
                >
                  {renderScript()}
                </div>
              </>
            ) : null}
          </div>
        </aside>

        <section
          className={`listeningSectionExamQuestionsPane ${
            evidenceTutorialOpen && (evidenceTutorialStep === 1 || evidenceTutorialStep === 3)
              ? 'is-tutorial-highlight'
              : ''
          }`}
        >
          {testTabs && testTabs.length > 1 ? (
            <div className="listeningSectionExamTestTabs">
              {testTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={tab.id === activeTestId ? 'is-active' : ''}
                  onClick={() => onTestChange?.(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}

          <div key={examStage} className="listeningSectionExamQuestionsScroll script-scroll listeningFlowSwap">
            {examStage === 'report' ? (
              renderFinalReportCard()
            ) : (
              <>
                {renderExamControlPanel()}
                {answerOnlyMode && config.part1Form
                  ? renderPart1Form(config.part1Form)
                  : config.groups.map((group) => renderGroup(group))}
              </>
            )}
          </div>
        </section>
      </div>

      {highlightMenu ? (
        <div
          className="listeningSectionExamHighlightMenu"
          style={{ left: highlightMenu.x, top: highlightMenu.y }}
          role="menu"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" role="menuitem" onClick={() => removeListeningHighlight(highlightMenu.questionId)}>
            Remove Q{highlightMenu.questionNumber} highlight
          </button>
        </div>
      ) : null}

      <ListeningEvidenceTutorial
        open={evidenceTutorialOpen}
        onClose={() => setEvidenceTutorialOpen(false)}
        onStepChange={setEvidenceTutorialStep}
      />
    </div>
  )

  function renderPart1Form(form: Part1ExamForm) {
    const renderLine = (line: Part1FormLine, index: number) => {
      if (line.kind === 'heading') {
        return (
          <p key={`part1-h-${index}`} className="listeningSectionExamPart1Heading">
            {line.text}
          </p>
        )
      }
      if (line.kind === 'static') {
        return (
          <p key={`part1-s-${index}`} className="listeningSectionExamPart1Static">
            {line.text}
          </p>
        )
      }
      const question = questionByNumber.get(line.questionNumber)
      if (!question) return null
      return renderPart1GapInput(question, line, index)
    }

    return (
      <article className="listeningSectionExamPart1Form">
        <header className="listeningSectionExamPart1FormHeader">
          <h3>{form.title}</h3>
          <p className="listeningSectionExamInstruction">{form.instruction}</p>
          <p className="listeningSectionExamInstruction is-word-limit">{form.wordLimit}</p>
        </header>
        <div className="listeningSectionExamPart1Body">{form.lines.map(renderLine)}</div>
      </article>
    )
  }

  function renderPart1GapInput(
    question: ListeningSectionExamQuestion,
    line: Extract<Part1FormLine, { kind: 'gap' }>,
    index: number
  ) {
    const attempt = attempts[question.id] || defaultAttempt()
    const isActive = question.id === activeQuestionId
    return (
      <div
        key={`part1-g-${index}`}
        className={`listeningSectionExamPart1GapRow ${isActive ? 'is-active' : ''} ${
          attempt.completed ? 'is-complete' : ''
        }`}
        onClick={() => activateQuestion(question.id, false)}
      >
        <span className="listeningSectionExamQNum">{question.number}</span>
        <label className="listeningSectionExamPart1GapLabel">
          {line.prefix ? <span>{line.prefix}</span> : null}
          <input
            type="text"
            value={attempt.answer}
            disabled={attempt.completed}
            placeholder={`Q${question.number}`}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            className={
              attempt.answerStatus === 'wrong'
                ? 'is-wrong'
                : attempt.answerStatus === 'correct'
                  ? 'is-correct'
                  : ''
            }
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              activateQuestion(question.id, false)
              updateAttempt(question.id, {
                answer: event.target.value.trimStart(),
                answerStatus: 'idle',
                feedback: ''
              })
            }}
          />
          {line.suffix ? <span>{line.suffix}</span> : null}
        </label>
        {renderQuestionFooter(question, attempt, true)}
      </div>
    )
  }

  function renderGroup(group: ListeningSectionExamGroup) {
    if (group.kind === 'matching-block') {
      return (
        <article key={group.id} className="listeningSectionExamGroup is-matching">
          <header>
            <h3>{group.title}</h3>
            {group.instruction ? <p className="listeningSectionExamInstruction">{group.instruction}</p> : null}
            {group.contextLines.map((line) => (
              <p key={`${group.id}-${line}`} className="listeningSectionExamContext">
                {line}
              </p>
            ))}
          </header>
          <div className="listeningSectionExamOptionPool">
            <strong>{group.poolTitle}</strong>
            <ul>
              {group.options.map((option) => (
                <li key={`${group.id}-${option.key}`}>
                  <b>{option.key}.</b> {option.text}
                </li>
              ))}
            </ul>
          </div>
          <ul className="listeningSectionExamMatchingRows">
            {group.questions.map((question) => renderMatchingRow(question))}
          </ul>
        </article>
      )
    }

    if (group.kind === 'gap-fill-block') {
      return (
        <article key={group.id} className="listeningSectionExamGroup is-gap-fill">
          <header>
            <h3>{group.title}</h3>
            {group.instruction ? <p className="listeningSectionExamInstruction">{group.instruction}</p> : null}
          </header>
          <ul className="listeningSectionExamGapList">
            {group.questions.map((question) => renderGapItem(question))}
          </ul>
        </article>
      )
    }

    if (group.kind !== 'choice-block') return null

    return (
      <article
        key={group.id}
        className={`listeningSectionExamGroup is-choice ${group.pickCount === 2 ? 'is-two-pick' : ''}`}
      >
        <header>
          <h3>{group.title}</h3>
          {group.instruction ? <p className="listeningSectionExamInstruction">{group.instruction}</p> : null}
          {group.contextLines.map((line) => (
            <p key={`${group.id}-${line}`} className="listeningSectionExamContext">
              {line}
            </p>
          ))}
        </header>
        {group.pickCount === 2 && group.questions.length > 1
          ? renderChooseTwoChecklist(group)
          : group.questions.map((question) => renderChoiceQuestion(question, group))}
      </article>
    )
  }

  function renderChooseTwoChecklist(group: Extract<ListeningSectionExamGroup, { kind: 'choice-block' }>) {
    const selectedKeys = getChooseTwoSelection(group)
    const completedSlots = group.questions.filter((question) => attempts[question.id]?.completed).length
    const isFull = selectedKeys.length >= group.pickCount
    const options = group.options.length > 0 ? group.options : group.questions.flatMap((question) => question.options)

    return (
      <div className="listeningSectionExamChooseTwo">
        <div className="listeningSectionExamChooseTwoSummary">
          <strong>Choose {group.pickCount} options</strong>
          <span>
            Selected {selectedKeys.length}/{group.pickCount}
          </span>
        </div>
        <ul className="listeningSectionExamChooseTwoOptions">
          {options.map((option) => {
            const assignedQuestion = getChooseTwoAssignedQuestion(group, option.key)
            const isSelected = selectedKeys.includes(option.key)
            const isLocked = Boolean(assignedQuestion && attempts[assignedQuestion.id]?.completed)
            const isDisabled = isLocked || (!isSelected && isFull)
            return (
              <li key={`${group.id}-${option.key}`}>
                <label
                  className={`listeningSectionExamChooseTwoOption ${isSelected ? 'is-selected' : ''} ${
                    isDisabled ? 'is-disabled' : ''
                  }`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => handleChooseTwoToggle(group, option.key)}
                  />
                  <span className="listeningSectionExamChooseTwoLetter">{option.key}</span>
                  <span>{option.text}</span>
                </label>
              </li>
            )
          })}
        </ul>
        {isFull ? null : (
          <p className="listeningSectionExamChooseTwoNote">
            Tick {group.pickCount - selectedKeys.length} more option{group.pickCount - selectedKeys.length === 1 ? '' : 's'}.
          </p>
        )}
        <div className="listeningSectionExamChooseTwoSlots" aria-label="Answer slots">
          {group.questions.map((question) => {
            const attempt = attempts[question.id] || defaultAttempt()
            const isActive = question.id === activeQuestionId
            const optionText = options.find((option) => option.key === attempt.answer)?.text
            return (
              <div
                key={question.id}
                className={`listeningSectionExamChooseTwoSlot ${isActive ? 'is-active' : ''} ${
                  attempt.completed ? 'is-complete' : ''
                }`}
                onClick={() => activateQuestion(question.id, true)}
              >
                <div className="listeningSectionExamChooseTwoSlotHead">
                  <span className="listeningSectionExamQNum">{question.number}</span>
                  <div>
                    <p>{question.stem || question.questionKeyword}</p>
                    <span className="listeningSectionExamChooseTwoSlotAnswer">
                      {attempt.answer ? `${attempt.answer}. ${optionText || ''}` : 'Choose from the checklist above'}
                    </span>
                  </div>
                </div>
                {renderQuestionFooter(question, attempt)}
              </div>
            )
          })}
        </div>
        {completedSlots > 0 && completedSlots < group.questions.length ? (
          <p className="listeningSectionExamChooseTwoNote">Completed answers stay locked while you finish the pair.</p>
        ) : null}
      </div>
    )
  }

  function renderChoiceQuestion(
    question: ListeningSectionExamQuestion,
    group: Extract<ListeningSectionExamGroup, { kind: 'choice-block' }>
  ) {
    const attempt = attempts[question.id] || defaultAttempt()
    const isActive = question.id === activeQuestionId
    const options = group.options.length > 0 ? group.options : question.options
    const showInlineOptions = group.questions.length === 1 || group.pickCount === 1

    return (
      <div
        key={question.id}
        className={`listeningSectionExamQuestionCard ${isActive ? 'is-active' : ''} ${
          attempt.completed ? 'is-complete' : ''
        }`}
        onClick={() => activateQuestion(question.id, true)}
      >
        <div className="listeningSectionExamQuestionHead">
          <span className="listeningSectionExamQNum">{question.number}</span>
          <p>{question.stem || question.questionKeyword}</p>
        </div>

        {showInlineOptions ? (
          <ul className="listeningSectionExamOptions">
            {options.map((option) => {
              const selected = attempt.answer === option.key
              const wrong = attempt.answerStatus === 'wrong' && selected
              const correct = attempt.answerStatus === 'correct' && selected
              return (
                <li key={`${question.id}-${option.key}`}>
                  <button
                    type="button"
                    className={`listeningSectionExamOption ${selected ? 'is-selected' : ''} ${
                      wrong ? 'is-wrong' : ''
                    } ${correct ? 'is-correct' : ''}`}
                    disabled={attempt.completed}
                    onClick={(event) => {
                      event.stopPropagation()
                      activateQuestion(question.id, true)
                      updateAttempt(question.id, {
                        answer: option.key,
                        answerStatus: 'idle',
                        feedback: ''
                      })
                    }}
                  >
                    <span>{option.key}</span>
                    <span>{option.text}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="listeningSectionExamMiniPick">
            <span>Your answer for Q{question.number}</span>
            <select
              value={attempt.answer}
              disabled={attempt.completed}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                activateQuestion(question.id, true)
                updateAttempt(question.id, {
                  answer: event.target.value,
                  answerStatus: 'idle',
                  feedback: ''
                })
              }}
            >
              <option value="">—</option>
              {options.map((option) => (
                <option key={`${question.id}-${option.key}`} value={option.key}>
                  {option.key}
                </option>
              ))}
            </select>
          </div>
        )}

        {renderQuestionFooter(question, attempt)}
      </div>
    )
  }

  function renderMatchingRow(question: ListeningSectionExamQuestion) {
    const attempt = attempts[question.id] || defaultAttempt()
    const isActive = question.id === activeQuestionId
    return (
      <li
        key={question.id}
        className={`listeningSectionExamMatchingRow ${isActive ? 'is-active' : ''} ${
          attempt.completed ? 'is-complete' : ''
        }`}
        onClick={() => activateQuestion(question.id, true)}
      >
        <div className="listeningSectionExamMatchingPrompt">
          <span className="listeningSectionExamQNum">{question.number}</span>
          <span className="listeningSectionExamMatchingLabel">{question.rowLabel || question.stem}</span>
        </div>
        <ul className="listeningSectionExamMatchingChoices">
          {question.options.map((option) => {
            const selected = attempt.answer === option.key
            const wrong = attempt.answerStatus === 'wrong' && selected
            const correct = attempt.answerStatus === 'correct' && selected
            return (
              <li key={`${question.id}-${option.key}`}>
                <button
                  type="button"
                  className={`listeningSectionExamMatchingChoice ${selected ? 'is-selected' : ''} ${
                    wrong ? 'is-wrong' : ''
                  } ${correct ? 'is-correct' : ''}`}
                  disabled={attempt.completed}
                  onClick={(event) => {
                    event.stopPropagation()
                    activateQuestion(question.id, true)
                    updateAttempt(question.id, {
                      answer: option.key,
                      answerStatus: 'idle',
                      feedback: ''
                    })
                  }}
                >
                  <span>{option.key}</span>
                  <span>{option.text}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {renderQuestionFooter(question, attempt, true)}
      </li>
    )
  }

  function formatGapFillStem(stem: string, number: number) {
    return String(stem || '')
      .replace(new RegExp(`^\\[?${number}\\]?\\s*`, 'i'), '')
      .replace(new RegExp(`\\b${number}\\s+(?=_{2,}|____)`, 'i'), '')
      .trim()
  }

  function renderGapItem(question: ListeningSectionExamQuestion) {
    const attempt = attempts[question.id] || defaultAttempt()
    const isActive = question.id === activeQuestionId
    const displayStem = formatGapFillStem(question.stem, question.number)
    return (
      <li
        key={question.id}
        className={`listeningSectionExamGapItem ${isActive ? 'is-active' : ''} ${
          attempt.completed ? 'is-complete' : ''
        }`}
        onClick={() => activateQuestion(question.id, !answerOnlyMode)}
      >
        <span className="listeningSectionExamQNum">{question.number}</span>
        <p>{displayStem}</p>
        <input
          type="text"
          value={attempt.answer}
          disabled={attempt.completed}
          placeholder={`Q${question.number}`}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          className={attempt.answerStatus === 'wrong' ? 'is-wrong' : attempt.answerStatus === 'correct' ? 'is-correct' : ''}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            activateQuestion(question.id, !answerOnlyMode)
            updateAttempt(question.id, {
              answer: event.target.value.trimStart(),
              answerStatus: 'idle',
              feedback: ''
            })
          }}
        />
        {renderQuestionFooter(question, attempt, true)}
      </li>
    )
  }

  function renderQuestionFooter(
    question: ListeningSectionExamQuestion,
    attempt: QuestionAttempt,
    compact = false
  ) {
    const answerDone = attempt.answerStatus === 'correct' || attempt.completed
    const evidenceDone =
      attempt.evidenceStatus === 'exact' || attempt.evidenceStatus === 'partial' || attempt.completed
    return (
      <footer className={`listeningSectionExamQuestionFooter ${compact ? 'is-compact' : ''}`}>
        <div className="listeningSectionExamStepPills">
          <span className={`${attempt.answer.trim() ? 'is-done' : ''} ${attempt.answerStatus === 'wrong' ? 'is-wrong' : ''}`}>
            {answerDone ? 'Answer correct' : attempt.answerStatus === 'wrong' ? 'Answer wrong' : 'Answer'}
          </span>
          {!answerOnlyMode ? (
            <span className={`${attempt.evidenceDraft.trim() ? 'is-done' : ''} ${attempt.evidenceStatus === 'wrong' ? 'is-wrong' : ''}`}>
              {evidenceDone ? 'Evidence correct' : attempt.evidenceStatus === 'wrong' ? 'Evidence wrong' : 'Evidence'}
            </span>
          ) : null}
        </div>
        {attempt.feedback ? (
          <p
            className={
              attempt.completed
                ? 'listeningSectionExamFeedback is-success'
                : attempt.answerStatus === 'wrong' || attempt.evidenceStatus === 'wrong'
                  ? 'listeningSectionExamFeedback is-error'
                  : 'listeningSectionExamFeedback'
            }
          >
            {attempt.feedback}
          </p>
        ) : null}
        {!answerOnlyMode && attempt.evidenceStatus === 'wrong' && !attempt.completed ? (
          <button
            type="button"
            className="listeningSectionExamRemoveEvidence"
            onClick={(event) => {
              event.stopPropagation()
              removeListeningHighlight(question.id)
            }}
          >
            ลบ evidence นี้ แล้วเลือกหลักฐานจริงใหม่
          </button>
        ) : null}
        {attempt.completed ? (
          <span className="listeningSectionExamDoneTag">✓ Complete</span>
        ) : null}
      </footer>
    )
  }
}
