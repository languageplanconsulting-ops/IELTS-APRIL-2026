import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { ListeningParaphraseBridgeModal } from './ListeningParaphraseBridgeModal'
import { getListeningHighlightMatch } from './listeningHighlightMatch'
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
      ? question.evidence
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
        {decoration.kind === 'correct' ? (
          <span className="listeningSectionExamEvidenceBadge">{decoration.questionNumber}</span>
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
  onSaveNotebook: (question: ListeningSectionExamQuestion) => void
  onQuestionComplete?: (questionId: string) => void
  onKnewIt?: () => void
  testTabs?: Array<{ id: string; label: string }>
  activeTestId?: string
  onTestChange?: (testId: string) => void
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
  onKnewIt,
  testTabs,
  activeTestId,
  onTestChange
}: ListeningSectionExamViewProps) {
  const scriptBodyRef = useRef<HTMLDivElement | null>(null)
  const [activeQuestionId, setActiveQuestionId] = useState(config.questions[0]?.id || '')
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({})
  const [latestEvidenceSelection, setLatestEvidenceSelection] = useState<LatestEvidenceSelection | null>(null)
  const [highlightMenu, setHighlightMenu] = useState<HighlightMenuState | null>(null)
  const [scriptCollapsed, setScriptCollapsed] = useState(false)

  useEffect(() => {
    setActiveQuestionId(config.questions[0]?.id || '')
    setAttempts({})
    setLatestEvidenceSelection(null)
    setHighlightMenu(null)
  }, [config.title, config.passage])

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

  const activeQuestion = config.questions.find((item) => item.id === activeQuestionId) || config.questions[0]
  const activeAttempt = attempts[activeQuestion?.id || ''] || defaultAttempt()

  const decorations = useMemo(
    () => buildPassageDecorations(config.passage, config.questions, attempts),
    [config.passage, config.questions, attempts]
  )

  const completedCount = config.questions.filter((item) => attempts[item.id]?.completed).length

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

  const handleSubmitQuestion = (question: ListeningSectionExamQuestion) => {
    const attempt = attempts[question.id] || defaultAttempt()
    if (!attempt.answer.trim()) {
      updateAttempt(question.id, {
        feedback: 'เลือกคำตอบในข้อนี้ก่อนกด Submit ครับ'
      })
      return
    }
    if (!attempt.evidenceDraft.trim()) {
      updateAttempt(question.id, {
        feedback: 'ไฮไลต์ประโยคหลักฐานในสคริปต์ทางซ้ายก่อนกด Submit ครับ'
      })
      return
    }

    const answerOk = attempt.answer.trim().toUpperCase() === question.correctAnswer.trim().toUpperCase()
    const matchKind = getListeningHighlightMatch(attempt.evidenceDraft, question.evidence)
    const evidenceOk = matchKind !== 'none'

    if (!answerOk && !evidenceOk) {
      updateAttempt(question.id, {
        answerStatus: 'wrong',
        evidenceStatus: 'wrong',
        wrongEvidence: attempt.evidenceDraft,
        feedback:
          'คำตอบและไฮไลต์ยังไม่ถูกครับ — ไฮไลต์ใหม่ในสคริปต์ (ส่วนที่ทับกับหลักฐานอย่างน้อย 50%) และเลือกคำตอบใหม่'
      })
      return
    }

    if (!evidenceOk) {
      updateAttempt(question.id, {
        answerStatus: answerOk ? 'correct' : attempt.answerStatus,
        evidenceStatus: 'wrong',
        wrongEvidence: attempt.evidenceDraft,
        feedback:
          'ไฮไลต์ยังไม่ตรงหลักฐานครับ — เลือกส่วนในสคริปต์ที่ paraphrase คำถาม (ต้องทับอย่างน้อย 50% ของหลักฐาน)'
      })
      return
    }

    if (!answerOk) {
      updateAttempt(question.id, {
        answerStatus: 'wrong',
        evidenceStatus: matchKind,
        wrongEvidence: '',
        feedback: 'คำตอบยังไม่ถูกครับ — เลือกตัวเลือกใหม่ทางขวา'
      })
      return
    }

    updateAttempt(question.id, {
      answerStatus: 'correct',
      evidenceStatus: matchKind === 'exact' ? 'exact' : 'partial',
      wrongEvidence: '',
      completed: true,
      feedback: 'ถูกต้องครบทั้งคำตอบและหลักฐาน!'
    })
    onQuestionComplete?.(question.id)
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

  const bridgeQuestion = config.questions.find(
    (item) => attempts[item.id]?.completed && !attempts[item.id]?.bridgeDismissed
  )
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
    <div className="listeningSectionExam">
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
          <span>Completed</span>
          <strong>
            {completedCount}/{config.questions.length}
          </strong>
        </div>
      </header>

      <div className="listeningSectionExamLayout">
        <aside className="listeningSectionExamScriptPane">
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

        <section className="listeningSectionExamQuestionsPane">
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

          <div className="listeningSectionExamQuestionsScroll script-scroll">
            {config.groups.map((group) => renderGroup(group))}
          </div>
        </section>
      </div>

      {bridgeQuestion ? (
        <ListeningParaphraseBridgeModal
          passageKeyword={bridgeQuestion.passageKeyword}
          questionKeyword={bridgeQuestion.questionKeyword}
          thaiMeaning={bridgeQuestion.thaiMeaning}
          explanationThai={bridgeQuestion.explanationThai}
          onKnewIt={() => {
            onKnewIt?.()
            updateAttempt(bridgeQuestion.id, { bridgeDismissed: true })
          }}
          onSaveToNotebook={() => {
            onSaveNotebook(bridgeQuestion)
            updateAttempt(bridgeQuestion.id, { bridgeDismissed: true })
          }}
          onClose={() => updateAttempt(bridgeQuestion.id, { bridgeDismissed: true })}
        />
      ) : null}

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
    </div>
  )

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
              const correct = attempt.completed && selected
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
            const correct = attempt.completed && selected
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

  function renderGapItem(question: ListeningSectionExamQuestion) {
    const attempt = attempts[question.id] || defaultAttempt()
    const isActive = question.id === activeQuestionId
    return (
      <li
        key={question.id}
        className={`listeningSectionExamGapItem ${isActive ? 'is-active' : ''} ${
          attempt.completed ? 'is-complete' : ''
        }`}
        onClick={() => activateQuestion(question.id, true)}
      >
        <span className="listeningSectionExamQNum">{question.number}</span>
        <p>{question.stem}</p>
        <input
          type="text"
          value={attempt.answer}
          disabled={attempt.completed}
          placeholder={`Q${question.number}`}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          className={attempt.answerStatus === 'wrong' ? 'is-wrong' : ''}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            activateQuestion(question.id, true)
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
    const canSubmit = Boolean(attempt.answer.trim() && attempt.evidenceDraft.trim() && !attempt.completed)
    return (
      <footer className={`listeningSectionExamQuestionFooter ${compact ? 'is-compact' : ''}`}>
        <div className="listeningSectionExamStepPills">
          <span className={attempt.answer.trim() ? 'is-done' : ''}>Answer</span>
          <span className={attempt.evidenceDraft.trim() ? 'is-done' : ''}>Evidence</span>
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
        {!attempt.completed ? (
          <button
            type="button"
            className="listeningSectionExamSubmit"
            disabled={!canSubmit}
            onClick={(event) => {
              event.stopPropagation()
              activateQuestion(question.id)
              handleSubmitQuestion(question)
            }}
          >
            Submit
          </button>
        ) : (
          <span className="listeningSectionExamDoneTag">✓ Complete</span>
        )}
      </footer>
    )
  }
}
