import { Children, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import './WritingGuidePage.css'
import {
  getWritingGuidedBuilder,
  assembleGuidedEssay,
  ROLE_LABEL_TH,
  STEP_COACH_TH,
  BLANK_COACH_TH,
  type WgbExercise,
  type WgbStep,
  type WgbBlank,
  type WgbSegment
} from './writingGuidedBuilder'
import {
  WRITING_TASK1_SECTIONS,
  WRITING_TASK2_TYPES,
  WRITING_TIMELINE_PRACTICE_PROMPTS,
  WRITING_BAND7_TASK1_SAMPLE,
  WRITING_BAND7_TASK2_SAMPLE,
  getWritingTask1ExamStem,
  IELTS_TASK1_SUMMARY_INSTRUCTION,
  IELTS_TASK1_WORD_LIMIT,
  type WritingGuideChipGroup,
  type WritingGuideStructure,
  type WritingTask1Section,
  type WritingTask1PracticePrompt,
  type WritingBand7Highlight,
  type WritingBand7Sample
} from './writingGuideData'
import { WRITING_RECALL, WRITING_PREDICT, type ExamItem } from './writingExamRecalls'
import { renderPromptChart } from './writingTask1Charts'
import type {
  WritingEssaySavePayload,
  WritingReportParagraph,
  WritingReportSegment,
  WritingTask2EssaySavePayload
} from './writingReportTypes'
import { WRITING_TASK2_PROMPTS, getWritingTask2Prompts, type WritingTask2TypeId } from './writingTask2Data'
import { getDenseWritingTask2Builder } from './writingTask2Dense'
import { WritingTask2Practice } from './WritingTask2Practice'

type WritingGuidePageProps = {
  onBackHome: () => void
  onSaveEssayToNotebook?: (payload: WritingEssaySavePayload) => void
  onSaveTask2EssayToNotebook?: (payload: WritingTask2EssaySavePayload) => void
  onSaveVocabToNotebook?: (payload: { word: string; thaiMeaning: string; questionTitle: string; questionNumber: number }) => void
}

type WritingFlow =
  | { step: 'hub' }
  | { step: 'latest'; filter: 'all' | 'task1' | 'task2' }
  | { step: 'task1-categories' }
  | { step: 'task1-questions'; categoryId: string }
  | { step: 'task1-drill'; categoryId: string; promptId: string }
  | { step: 'task1-guide'; categoryId: string }
  | { step: 'task2-types' }
  | { step: 'task2-questions'; typeId: WritingTask2TypeId }
  | { step: 'task2-drill'; typeId: WritingTask2TypeId; promptId: string }

// Chart / diagram renderers now live in ./writingTask1Charts (renderPromptChart).
// The old free-text "answer sheet" exam paper has been removed — clicking a question now
// goes straight into the guided, fill-in-the-blank builder (WritingGuidedBuilder).

const WGB_STEP_SHORT: Record<WgbStep['role'], string> = {
  intro: 'Intro',
  overview: 'Overview',
  body1: 'Body 1',
  body2: 'Body 2'
}

const wgbNormalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

function WgbCoachBubble({ coachKey, message, isBlankFocus }: { coachKey: string; message: string; isBlankFocus: boolean }) {
  return (
    <div key={coachKey} className={`wgbCoach ${isBlankFocus ? 'is-blank-focus' : ''}`}>
      <span className="wgbCoachAvatar" aria-hidden="true">
        {isBlankFocus ? '💭' : '🧑‍🏫'}
      </span>
      <div className="wgbCoachBody">
        <p className="wgbCoachLabel">P'Doy แนะนำ</p>
        <p className="wgbCoachMessage">{message}</p>
      </div>
    </div>
  )
}

function WritingGuidedBuilder({
  prompt,
  exercise,
  onSaveEssay
}: {
  prompt: WritingTask1PracticePrompt
  exercise: WgbExercise
  onSaveEssay?: (data: { paragraphs: WritingReportParagraph[]; score: { correct: number; total: number } }) => void
}) {
  const steps = exercise.steps
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => new Set())
  const [checkedNow, setCheckedNow] = useState(false)
  const [showEssay, setShowEssay] = useState(false)
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null)
  const [savedNotice, setSavedNotice] = useState(false)

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const isBlankCorrect = (blank: WgbBlank): boolean => {
    const value = values[blank.id]
    if (value == null || value.trim() === '') return false
    if (blank.kind === 'select') return value === blank.answer
    return blank.answers.some((answer) => wgbNormalize(answer) === wgbNormalize(value))
  }

  const stepBlanks = useMemo(
    () =>
      step.segments
        .filter((segment): segment is Extract<WgbSegment, { kind: 'blank' }> => segment.kind === 'blank')
        .map((segment) => segment.blank),
    [step]
  )
  const stepScore = stepBlanks.filter(isBlankCorrect).length
  const stepDone = checkedSteps.has(step.id)
  const allDone = steps.every((item) => checkedSteps.has(item.id))

  const totalBlanks = useMemo(
    () => steps.reduce((sum, item) => sum + item.segments.filter((s) => s.kind === 'blank').length, 0),
    [steps]
  )

  const setValue = (id: string, value: string) => {
    setCheckedNow(false)
    setSavedNotice(false)
    setValues((current) => ({ ...current, [id]: value }))
  }

  // Blanks in the current step that were wrong at the last check (for the explanation list).
  const wrongBlanks = checkedNow ? stepBlanks.filter((blank) => !isBlankCorrect(blank)) : []

  const blankCorrectAnswer = (blank: WgbBlank) => (blank.kind === 'select' ? blank.answer : blank.answers[0])

  const buildReportParagraphs = (): WritingReportParagraph[] =>
    steps.map((item) => {
      const segments: WritingReportSegment[] = item.segments.map((segment) => {
        if (segment.kind === 'text') return { kind: 'text', text: segment.text }
        const blank = segment.blank
        return {
          kind: 'blank',
          text: blankCorrectAnswer(blank),
          given: (values[blank.id] ?? '').trim(),
          correct: isBlankCorrect(blank),
          focus: blank.focus
        }
      })
      const plainText = segments
        .map((segment) => (segment.kind === 'text' ? segment.text : segment.text))
        .join('')
        .replace(/\s+([,.;:])/g, '$1')
        .trim()
      return { role: item.role, labelTh: item.labelTh, segments, plainText }
    })

  const handleSaveEssay = () => {
    if (!onSaveEssay) return
    const paragraphs = buildReportParagraphs()
    const total = paragraphs.reduce(
      (sum, para) => sum + para.segments.filter((segment) => segment.kind === 'blank').length,
      0
    )
    const correct = paragraphs.reduce(
      (sum, para) =>
        sum + para.segments.filter((segment) => segment.kind === 'blank' && segment.correct).length,
      0
    )
    onSaveEssay({ paragraphs, score: { correct, total } })
    setSavedNotice(true)
  }

  const checkStep = () => {
    setCheckedNow(true)
    if (stepBlanks.every(isBlankCorrect)) {
      setCheckedSteps((current) => {
        const next = new Set(current)
        next.add(step.id)
        return next
      })
    }
  }

  const goToStep = (index: number) => {
    const reachable = index === 0 || checkedSteps.has(steps[index - 1].id) || checkedSteps.has(steps[index].id)
    if (!reachable) return
    setStepIndex(index)
    setCheckedNow(false)
    setActiveBlankId(null)
  }

  const goNext = () => {
    if (!isLastStep) goToStep(stepIndex + 1)
  }

  const resetAll = () => {
    setStepIndex(0)
    setValues({})
    setCheckedSteps(new Set())
    setCheckedNow(false)
    setShowEssay(false)
    setActiveBlankId(null)
  }

  const model = useMemo(() => assembleGuidedEssay(exercise), [exercise])

  const activeBlank = activeBlankId ? stepBlanks.find((blank) => blank.id === activeBlankId) ?? null : null
  const coachMessage = activeBlank ? BLANK_COACH_TH[activeBlank.focus] : STEP_COACH_TH[step.role]
  const coachKey = activeBlank ? activeBlank.id : `step-${step.id}`

  return (
    <div className="wgbShell">
      <aside className="wgbVisualPane">
        <div className="wgbExamStem">
          <p className="writingIeltsPromptLine">{getWritingTask1ExamStem(prompt)}</p>
          <p className="writingIeltsPromptLine writingIeltsPromptLine-instruction">{IELTS_TASK1_SUMMARY_INSTRUCTION}</p>
          <p className="writingIeltsPromptLine writingIeltsPromptLine-limit">{IELTS_TASK1_WORD_LIMIT}</p>
        </div>
        <div className="wgbChart">{renderPromptChart(prompt)}</div>
      </aside>

      <div className="wgbPanel">
        <ol className="wgbRail">
          {steps.map((item, index) => {
            const done = checkedSteps.has(item.id)
            const reachable = index === 0 || checkedSteps.has(steps[index - 1].id) || done
            const current = index === stepIndex
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`wgbRailStep ${current ? 'is-current' : ''} ${done ? 'is-done' : ''} ${
                    reachable ? '' : 'is-locked'
                  }`}
                  onClick={() => goToStep(index)}
                  disabled={!reachable}
                >
                  <span className="wgbRailDot">{done ? '✓' : index + 1}</span>
                  <span className="wgbRailLabel">{WGB_STEP_SHORT[item.role]}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <WgbCoachBubble coachKey={coachKey} message={coachMessage} isBlankFocus={!!activeBlank} />

        <div key={step.id} className="wgbStepCard">
          <p className="wgbStepEyebrow">{ROLE_LABEL_TH[step.role]}</p>
          {step.hintTh ? <p className="wgbStepHint">{step.hintTh}</p> : null}

          <p className="wgbSentence">
            {step.segments.map((segment, index) => {
              if (segment.kind === 'text') return <span key={index}>{segment.text}</span>
              const blank = segment.blank
              const value = values[blank.id] ?? ''
              const correct = isBlankCorrect(blank)
              const stateClass = !checkedNow ? '' : correct ? 'is-correct' : 'is-incorrect'
              if (blank.kind === 'select') {
                return (
                  <span key={blank.id} className="wgbBlankWrap">
                    <select
                      className={`wgbSelect ${stateClass} ${value ? 'is-filled' : ''}`}
                      value={value}
                      onChange={(event) => setValue(blank.id, event.target.value)}
                      onFocus={() => setActiveBlankId(blank.id)}
                      onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                    >
                      <option value="">— เลือก —</option>
                      {blank.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {checkedNow && !correct ? (
                      <em className="wgbReveal">{blank.answer}</em>
                    ) : null}
                  </span>
                )
              }
              const widthCh = Math.max(blank.base.length + 3, ...blank.answers.map((a) => a.length + 1), 7)
              return (
                <span key={blank.id} className="wgbBlankWrap">
                  <input
                    type="text"
                    className={`wgbInput ${stateClass} ${value ? 'is-filled' : ''}`}
                    value={value}
                    placeholder={`(${blank.base})`}
                    style={{ width: `${widthCh}ch` }}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={(event) => setValue(blank.id, event.target.value)}
                    onFocus={() => setActiveBlankId(blank.id)}
                    onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') checkStep()
                    }}
                  />
                  {checkedNow && !correct ? <em className="wgbReveal">{blank.answers[0]}</em> : null}
                </span>
              )
            })}
          </p>

          <div className="wgbStepToolbar">
            <button type="button" className="wlpBtn wlpBtn-primary" onClick={checkStep}>
              ตรวจคำตอบ
            </button>
            <span className={`wgbStepScore ${checkedNow ? 'is-revealed' : ''}`}>
              {stepScore} / {stepBlanks.length}
            </span>
            {stepDone && !isLastStep ? (
              <button type="button" className="wlpBtn wlpBtn-primary wgbNextBtn" onClick={goNext}>
                ถัดไป →
              </button>
            ) : null}
          </div>

          {checkedNow ? (
            stepBlanks.every(isBlankCorrect) ? (
              <div className="wgbFeedback is-good" role="status">
                {isLastStep ? 'เยี่ยมมาก! เขียนครบทุกย่อหน้าแล้ว 🎉' : 'ถูกทุกช่อง! กด “ถัดไป” เพื่อเขียนย่อหน้าถัดไป ✅'}
              </div>
            ) : (
              <div className="wgbFeedback is-retry" role="status">
                ยังมีช่องที่ต้องแก้ — ดูคำเฉลยและคำอธิบายด้านล่างแล้วลองใหม่อีกครั้ง 🙂
              </div>
            )
          ) : null}

          {wrongBlanks.length ? (
            <div className="wgbExplainList" role="note">
              <p className="wgbExplainHead">ทำไมถึงเป็นคำนี้</p>
              {wrongBlanks.map((blank) => (
                <div key={blank.id} className="wgbExplainRow">
                  <span className="wgbExplainAnswer">{blankCorrectAnswer(blank)}</span>
                  <span className="wgbExplainWhy">
                    {blank.explain || 'ตรวจดูความหมายและไวยากรณ์ของช่องนี้อีกครั้ง'}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {allDone ? (
          <div className="wgbFinish">
            <div className="wgbFinishHead">
              <p className="wgbFinishTitle">จบแล้ว! คุณประกอบเรียงความครบ {totalBlanks} ช่อง 🎉</p>
              <div className="wgbFinishBtns">
                <button type="button" className="wlpBtn wlpBtn-primary" onClick={() => setShowEssay((v) => !v)}>
                  {showEssay ? 'ซ่อนเรียงความเต็ม' : 'ดูเรียงความเต็ม'}
                </button>
                {onSaveEssay ? (
                  <button
                    type="button"
                    className="wlpBtn wlpBtn-save"
                    onClick={handleSaveEssay}
                    disabled={savedNotice}
                  >
                    {savedNotice ? '✓ บันทึกลง Notebook แล้ว' : '＋ บันทึกเรียงความลง Notebook'}
                  </button>
                ) : null}
                <button type="button" className="wlpBtn wlpBtn-secondary" onClick={resetAll}>
                  เริ่มใหม่
                </button>
              </div>
              {savedNotice ? (
                <p className="wgbSavedHint">
                  บันทึกไว้ในหมวด <strong>Writing</strong> ของ Notebook แล้ว — เปิดดูเป็นรายงานพร้อมกราฟและคำตอบที่ไฮไลต์ได้ทุกเมื่อ 📓
                </p>
              ) : null}
            </div>
            {showEssay ? (
              <article className="wgbEssay">
                {model.map((para) => (
                  <div key={para.role} className="wgbEssayPara">
                    <span className="wgbEssayLabel">{para.labelTh}</span>
                    <p>{para.text}</p>
                  </div>
                ))}
              </article>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function WritingVocabularyHelper({
  chipGroups,
  structures
}: {
  chipGroups?: WritingGuideChipGroup[]
  structures?: WritingGuideStructure[]
}) {
  return (
    <div className="writingGuideHelperPanel">
      <p className="writingGuideHelperIntro">คำศัพท์และโครงสร้างแนะนำ — เปิดเมื่อต้องการตัวช่วยเท่านั้น</p>
      {chipGroups?.length ? (
        <div className="writingGuideChipGroups">
          {chipGroups.map((group) => (
            <article key={group.id} className="writingGuideChipGroup">
              <div className="writingGuideChipGroupHead">
                <h4>{group.label}</h4>
                {group.hint ? <p>{group.hint}</p> : null}
              </div>
              <div className="writingGuideChipRow">
                {group.chips.map((chip) => (
                  <span key={chip} className="writingGuideChip">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {structures?.length ? (
        <div className="writingGuideStructureBlock">
          <p className="writingGuideStructureEyebrow">Complex structures</p>
          <div className="writingGuideStructureGrid">
            {structures.map((item) => (
              <article key={item.id} className="writingGuideStructureCard">
                <span className="writingGuideStructureLabel">{item.label}</span>
                <code>{item.template}</code>
                {item.note ? <p>{item.note}</p> : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WritingFlowHead({
  eyebrow,
  title,
  subtitle,
  onBack,
  backLabel
}: {
  eyebrow: string
  title: string
  subtitle?: string
  onBack: () => void
  backLabel: string
}) {
  return (
    <div className="writingGuideFlowHead">
      <button type="button" className="writingGuideFlowBack" onClick={onBack}>
        ← {backLabel}
      </button>
      <div>
        <p className="writingGuideStructureEyebrow">{eyebrow}</p>
        <h3 className="writingGuideFlowTitle">{title}</h3>
        {subtitle ? <p className="writingGuideFlowSub">{subtitle}</p> : null}
      </div>
    </div>
  )
}

// ── Latest exam recall / prediction cards ────────────────────────────────

const matchesTaskFilter = (item: ExamItem, filter: 'all' | 'task1' | 'task2') => {
  if (filter === 'all') return true
  return item.tag.includes(filter === 'task1' ? 'Task 1' : 'Task 2')
}

/** Ticket rows on a numbered level path — used across the whole Writing journey */
function WgTicketPathList({
  children,
  ariaLabel,
  firstDone = true
}: {
  children: ReactNode
  ariaLabel?: string
  firstDone?: boolean
}) {
  const items = Children.toArray(children).filter(Boolean)
  return (
    <div className="wgTicketPathBoard" aria-label={ariaLabel}>
      <div className="wgTicketPath">
        {items.map((child, index) => (
          <div
            key={index}
            className={`wgTicketPathStep ${firstDone && index === 0 ? 'is-done' : ''}`.trim()}
            style={{ '--motion-stagger': index } as CSSProperties}
          >
            <span className="wgTicketPathNode" aria-hidden="true">
              {firstDone && index === 0 ? '✓' : index + 1}
            </span>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

function WritingLatestItem({ item }: { item: ExamItem }) {
  const stampTone = item.tag.includes('Task 2')
    ? 'lilac'
    : item.tag.includes('Task 1')
      ? 'peach'
      : 'yellow'
  const stampEmoji = item.tag.includes('Task 2') ? '✍️' : item.tag.includes('Task 1') ? '📈' : '📰'
  return (
    <article className={`wgTicket wgTicket-static`}>
      <span className={`wgTicketStamp wgTicketStamp-${stampTone}`} aria-hidden="true">
        {stampEmoji}
      </span>
      <span className="wgTicketBody">
        <span className="wgTicketTitleRow">
          <strong>
            {item.title}
            {item.isNew ? <span className="wgLatestNew">ใหม่</span> : null}
          </strong>
          <span className="wgTicketBadge">{item.tag}</span>
        </span>
        {item.bullets ? (
          <ul className="wgLatestBullets">
            {item.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        <span className="wgTicketSub">{item.meta}</span>
      </span>
    </article>
  )
}

function WritingLatestSection({
  filter,
  onPracticeTask1,
  onPracticeTask2
}: {
  filter: 'all' | 'task1' | 'task2'
  onPracticeTask1: () => void
  onPracticeTask2: () => void
}) {
  const recall = WRITING_RECALL.filter((item) => matchesTaskFilter(item, filter))
  const predict = WRITING_PREDICT.filter((item) => matchesTaskFilter(item, filter))

  return (
    <div className="wgLatestShell">
      <section className="wgLatestBlock">
        <h3 className="wgLatestBlockTitle">หัวข้อที่เพิ่งออกสอบ</h3>
        <p className="wgLatestBlockLead">รายงานจากผู้สอบจริง · ไม่ใช่ข้อสอบทางการ</p>
        {recall.length ? (
          <WgTicketPathList ariaLabel="หัวข้อที่เพิ่งออกสอบ">
            {recall.map((item, i) => (
              <WritingLatestItem key={i} item={item} />
            ))}
          </WgTicketPathList>
        ) : (
          <p className="wgLatestEmpty">ยังไม่มีข้อมูลในหมวดนี้</p>
        )}
      </section>

      <section className="wgLatestBlock wgLatestBlock-predict">
        <h3 className="wgLatestBlockTitle">เก็งข้อสอบเดือนนี้</h3>
        <p className="wgLatestBlockLead">แนวโน้มจากสถิติย้อนหลัง · เป็นการคาดการณ์ ไม่ใช่ข้อสอบจริง</p>
        {predict.length ? (
          <WgTicketPathList ariaLabel="เก็งข้อสอบเดือนนี้" firstDone={false}>
            {predict.map((item, i) => (
              <WritingLatestItem key={`p-${i}`} item={item} />
            ))}
          </WgTicketPathList>
        ) : (
          <p className="wgLatestEmpty">ยังไม่มีข้อมูลในหมวดนี้</p>
        )}
      </section>

      <div className="wgLatestCta">
        {filter !== 'task2' ? (
          <button type="button" className="wgTicketCta" onClick={onPracticeTask1}>
            ฝึกเขียน Task 1 ตอนนี้ →
          </button>
        ) : null}
        {filter !== 'task1' ? (
          <button type="button" className="wgTicketCta" onClick={onPracticeTask2}>
            ฝึกเขียน Task 2 ตอนนี้ →
          </button>
        ) : null}
      </div>
    </div>
  )
}

// ── Band 7 sample helper components ──────────────────────────────────────

function WlpHighlightInline({ text, highlights }: { text: string; highlights: WritingBand7Highlight[] }) {
  const [openPhrase, setOpenPhrase] = useState<string | null>(null)
  const parts: Array<{ type: 'text' | 'mark'; content: string; h?: WritingBand7Highlight }> = []
  let remaining = text
  const sorted = [...highlights].sort(
    (a, b) => text.indexOf(a.phrase) - text.indexOf(b.phrase)
  )
  for (const h of sorted) {
    const idx = remaining.indexOf(h.phrase)
    if (idx < 0) continue
    if (idx > 0) parts.push({ type: 'text', content: remaining.slice(0, idx) })
    parts.push({ type: 'mark', content: h.phrase, h })
    remaining = remaining.slice(idx + h.phrase.length)
  }
  if (remaining) parts.push({ type: 'text', content: remaining })

  return (
    <span className="wlpSegmentText">
      {parts.map((part, i) => {
        if (part.type === 'mark' && part.h) {
          const isOpen = openPhrase === part.content
          return (
            <span key={i} className="wlpInlineWrap">
              <mark
                className={`wlpMark wlpMark-${part.h.kind} ${isOpen ? 'is-open' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setOpenPhrase(isOpen ? null : part.content)}
                onKeyDown={(e) => e.key === 'Enter' && setOpenPhrase(isOpen ? null : part.content)}
              >
                {part.content}
              </mark>
              {isOpen && (
                <span className="wlpMarkPopover">
                  <strong>{part.h.labelTh}</strong>
                  <span>{part.h.descTh}</span>
                  {part.h.exampleTh && <em>ตัวอย่าง: {part.h.exampleTh}</em>}
                </span>
              )}
            </span>
          )
        }
        return <span key={i}>{part.content}</span>
      })}
    </span>
  )
}

function Band7SampleView({ sample }: { sample: WritingBand7Sample }) {
  return (
    <div className="wlpBand7Sample">
      <div className="wlpBand7Header">
        <div className="wlpBand7HeaderLeft">
          <span className="wlpBand7Badge">Band {sample.band} · {sample.questionTypeTh}</span>
          <p className="wlpBand7Meta">{sample.wordCount} คำ · {sample.timeNote}</p>
        </div>
        <div className="wlpBand7LegendRow">
          <span className="wlpBand7Legend wlpBand7Legend-vocab">คำศัพท์</span>
          <span className="wlpBand7Legend wlpBand7Legend-grammar">ไวยากรณ์</span>
          <span className="wlpBand7Legend wlpBand7Legend-structure">โครงสร้าง</span>
        </div>
      </div>

      <div className="wlpBand7Prompt">
        <p className="wlpBand7PromptLabel">โจทย์</p>
        <p className="wlpBand7PromptText">{sample.promptText}</p>
      </div>

      <div className="wlpBand7Segments">
        {sample.segments.map((seg) => (
          <div key={seg.id} className="wlpBand7Segment">
            <p className="wlpBand7SegLabel">{seg.labelTh}</p>
            <div className="wlpBand7SegText">
              <WlpHighlightInline text={seg.text} highlights={seg.highlights} />
            </div>
          </div>
        ))}
      </div>

      <div className="wlpBand7Tips">
        <p className="wlpBand7TipsLabel">สรุปเทคนิคที่ใช้</p>
        <ul className="wlpBand7TipsList">
          {sample.summaryPoints.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function WritingGuidePage({
  onBackHome,
  onSaveEssayToNotebook,
  onSaveTask2EssayToNotebook,
  onSaveVocabToNotebook
}: WritingGuidePageProps) {
  const [flow, setFlow] = useState<WritingFlow>({ step: 'hub' })
  const [showHelper, setShowHelper] = useState(false)

  const activeCategory = useMemo(() => {
    if (
      flow.step === 'hub' ||
      flow.step === 'latest' ||
      flow.step === 'task2-types' ||
      flow.step === 'task2-questions' ||
      flow.step === 'task2-drill' ||
      flow.step === 'task1-categories'
    ) {
      return null
    }
    return WRITING_TASK1_SECTIONS.find((section) => section.id === flow.categoryId) || null
  }, [flow])

  const activePrompt = useMemo(() => {
    if (flow.step !== 'task1-drill') return null
    const prompts = activeCategory?.practicePrompts || WRITING_TIMELINE_PRACTICE_PROMPTS
    return prompts.find((prompt) => prompt.id === flow.promptId) || null
  }, [flow, activeCategory])

  const activeTask2Prompts = useMemo(() => {
    if (flow.step !== 'task2-questions' && flow.step !== 'task2-drill') return []
    return getWritingTask2Prompts(flow.typeId)
  }, [flow])

  const activeTask2Prompt = useMemo(() => {
    if (flow.step !== 'task2-drill') return null
    return WRITING_TASK2_PROMPTS.find((prompt) => prompt.id === flow.promptId) || null
  }, [flow])

  const goBack = () => {
    setShowHelper(false)
    if (flow.step === 'hub') {
      onBackHome()
      return
    }
    if (flow.step === 'latest') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'task1-categories' || flow.step === 'task2-types') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'task1-questions' || flow.step === 'task1-guide') {
      setFlow({ step: 'task1-categories' })
      return
    }
    if (flow.step === 'task1-drill') {
      setFlow({ step: 'task1-questions', categoryId: flow.categoryId })
      return
    }
    if (flow.step === 'task2-questions') {
      setFlow({ step: 'task2-types' })
      return
    }
    if (flow.step === 'task2-drill') {
      setFlow({ step: 'task2-questions', typeId: flow.typeId })
    }
  }

  const openCategory = (section: WritingTask1Section) => {
    setShowHelper(false)
    if (section.practicePrompts?.length) {
      setFlow({ step: 'task1-questions', categoryId: section.id })
      return
    }
    setFlow({ step: 'task1-guide', categoryId: section.id })
  }

  return (
    <section className="writingGuidePage">
      <div className="writingGuideAmbient" aria-hidden="true">
        <span className="writingGuideOrb writingGuideOrb-a" />
        <span className="writingGuideOrb writingGuideOrb-b" />
        <span className="writingGuideGridGlow" />
      </div>

      {flow.step !== 'hub' ? (
        <header className="writingGuideHeader">
          <div>
            <p className="sectionLabel">English Plan Writing</p>
            <h2>IELTS Writing Practice</h2>
            <p className="writingGuideLead">เลือก Task → หมวด → ข้อสอบ ทีละขั้น</p>
          </div>
        </header>
      ) : null}

      <div className="writingGuideFlowStage">
        {flow.step === 'hub' ? (
          <div className="writingGuideHubShell">
            <div className="writingGuideHubIntro">
              <p className="wlpKicker">IELTS Academic Writing · English Plan Institute</p>
              <h1 className="writingGuideHubH1">เส้นทางฝึก Writing</h1>
              <p className="writingGuideHubLead">
                เริ่มจากข้อสอบล่าสุด หรือไต่ไปฝึก Task 1 / Task 2 ทีละขั้น — คลิกด่านที่อยากเข้า
              </p>
              <span className="wlpAccentRule" aria-hidden="true" />
            </div>
            <div className="wgTicketPathBoard" aria-label="ทางลัด Writing">
              <div className="wgTicketPath">
                <div className="wgTicketPathStep is-done" style={{ '--motion-stagger': 0 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">✓</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'latest', filter: 'all' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-yellow" aria-hidden="true">📰</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>ข้อสอบล่าสุด</strong>
                        <span className="wgTicketBadge">ใหม่</span>
                      </span>
                      <span className="wgTicketSub">โจทย์จริง Task 1 และ Task 2 จากผู้สอบ · อัปเดตทุกสัปดาห์</span>
                    </span>
                    <span className="wgTicketGo">เปิดคลัง →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 1 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">2</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'latest', filter: 'task1' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-peach" aria-hidden="true">📈</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>Task 1 ล่าสุด</strong>
                        <span className="wgTicketBadge">Task 1</span>
                      </span>
                      <span className="wgTicketSub">โจทย์ Task 1 ที่เพิ่งออกสอบจริง</span>
                    </span>
                    <span className="wgTicketGo">เปิดคลัง →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 2 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">3</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'latest', filter: 'task2' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-lilac" aria-hidden="true">✍️</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>Task 2 ล่าสุด</strong>
                        <span className="wgTicketBadge">Task 2</span>
                      </span>
                      <span className="wgTicketSub">โจทย์ Task 2 ที่เพิ่งออกสอบจริง</span>
                    </span>
                    <span className="wgTicketGo">เปิดคลัง →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 3 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">4</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'task1-categories' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-blue" aria-hidden="true">📊</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>แบบฝึกหัด Task 1</strong>
                        <span className="wgTicketBadge">Practice</span>
                      </span>
                      <span className="wgTicketSub">ฝึกเขียนทีละขั้นตอน ตามประเภทกราฟ</span>
                    </span>
                    <span className="wgTicketGo">เข้าฝึก →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 4 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">5</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'task2-types' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-ink" aria-hidden="true">🧠</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>แบบฝึกหัด Task 2</strong>
                        <span className="wgTicketBadge">Practice</span>
                      </span>
                      <span className="wgTicketSub">ประเภทเรียงความ + แนวทางแต่ละแบบ</span>
                    </span>
                    <span className="wgTicketGo">เข้าฝึก →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {flow.step === 'latest' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow={
                flow.filter === 'all' ? 'เส้นทาง · ล่าสุด' : flow.filter === 'task1' ? 'Task 1 · ล่าสุด' : 'Task 2 · ล่าสุด'
              }
              title={
                flow.filter === 'all'
                  ? 'ข้อสอบ Writing ล่าสุด'
                  : flow.filter === 'task1'
                  ? 'โจทย์ Task 1 ล่าสุด'
                  : 'โจทย์ Task 2 ล่าสุด'
              }
              subtitle="เดินตาม path · รวบรวมจากผู้สอบจริง · ไม่ใช่ข้อสอบทางการ"
              onBack={goBack}
              backLabel="Home"
            />
            <WritingLatestSection
              filter={flow.filter}
              onPracticeTask1={() => setFlow({ step: 'task1-categories' })}
              onPracticeTask2={() => setFlow({ step: 'task2-types' })}
            />
          </div>
        ) : null}


        {flow.step === 'task1-categories' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · เส้นทางฝึก"
              title="เลือกประเภทกราฟที่อยากฝึก"
              subtitle="เดินตาม path · เลือกหมวด แล้วฝึกเขียนทีละย่อหน้า"
              onBack={goBack}
              backLabel="กลับ"
            />
            <div className="wgBentoHead">
              <button
                type="button"
                className="wgBentoCta"
                onClick={() => setFlow({ step: 'latest', filter: 'task1' })}
              >
                ดูข้อสอบล่าสุด →
              </button>
            </div>
            <WgTicketPathList ariaLabel="ประเภทกราฟ Task 1">
              {(() => {
                const byId = Object.fromEntries(WRITING_TASK1_SECTIONS.map((s) => [s.id, s]))
                const stamps: Record<string, { emoji: string; tone: string }> = {
                  timeline: { emoji: '📈', tone: 'yellow' },
                  'no-timeline': { emoji: '🧩', tone: 'peach' },
                  map: { emoji: '🗺️', tone: 'blue' },
                  process: { emoji: '⚙️', tone: 'lilac' },
                  mixed: { emoji: '🔀', tone: 'ink' },
                  'all-types': { emoji: '📚', tone: 'yellow' }
                }
                const order = ['timeline', 'no-timeline', 'map', 'process', 'mixed', 'all-types'] as const
                return order.map((id) => {
                  const section = byId[id]
                  if (!section) return null
                  const stamp = stamps[id] || { emoji: '✍️', tone: 'yellow' }
                  const badge =
                    id === 'timeline'
                      ? 'Start'
                      : id === 'all-types'
                        ? 'Vocab'
                        : id === 'no-timeline'
                          ? 'No year'
                          : section.title.split('·')[0]?.trim() || 'Task 1'
                  return (
                    <button
                      key={section.id}
                      type="button"
                      className="wgTicket"
                      onClick={() => openCategory(section)}
                    >
                      <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                        {stamp.emoji}
                      </span>
                      <span className="wgTicketBody">
                        <span className="wgTicketTitleRow">
                          <strong>{section.title}</strong>
                          <span className="wgTicketBadge">{badge}</span>
                        </span>
                        <span className="wgTicketSub">
                          {id === 'timeline'
                            ? `${section.subtitle} — โจทย์ที่เจอบ่อยที่สุด`
                            : section.subtitle}
                        </span>
                      </span>
                      <span className="wgTicketGo">เข้าคลัง →</span>
                    </button>
                  )
                })
              })()}
            </WgTicketPathList>
            <div className="wlpBand7Tabs wlpBand7Tabs-single">
              <p className="wlpSectionKicker">ตัวอย่างคำตอบ · Band 7 Model Answer</p>
              <Band7SampleView sample={WRITING_BAND7_TASK1_SAMPLE} />
            </div>
          </div>
        ) : null}

        {flow.step === 'task1-questions' && activeCategory ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · เลือกข้อ"
              title={activeCategory.title}
              subtitle="เดินตาม path · เลือก 1 ข้อ แล้วเข้าฝึกเขียนทีละย่อหน้า"
              onBack={goBack}
              backLabel="ประเภทกราฟ"
            />
            <WgTicketPathList ariaLabel="รายการข้อสอบ Task 1">
              {(activeCategory.practicePrompts || []).map((prompt, index) => {
                const stamps = [
                  { emoji: '📝', tone: 'yellow' },
                  { emoji: '📊', tone: 'peach' },
                  { emoji: '📉', tone: 'blue' },
                  { emoji: '🗺', tone: 'lilac' },
                  { emoji: '⚙️', tone: 'ink' }
                ] as const
                const stamp = stamps[index % stamps.length]
                const meta =
                  prompt.kind === 'timeline'
                    ? `${prompt.chartTypeLabel} · ${prompt.years[0]}–${prompt.years[prompt.years.length - 1]}`
                    : prompt.chartTypeLabel
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className="wgTicket"
                    onClick={() => {
                      setShowHelper(false)
                      setFlow({ step: 'task1-drill', categoryId: activeCategory.id, promptId: prompt.id })
                    }}
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>{getWritingTask1ExamStem(prompt)}</strong>
                        <span className="wgTicketBadge">Q{prompt.number}</span>
                      </span>
                      <span className="wgTicketSub">{meta}</span>
                    </span>
                    <span className="wgTicketGo">ฝึกเขียน →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'task1-drill' && activeCategory && activePrompt ? (
          (() => {
            const exercise = getWritingGuidedBuilder(activePrompt.id)
            const prompt = activePrompt
            const category = activeCategory
            return (
              <div className="writingGuideExamShell">
                <div className="writingGuideExamToolbar">
                  <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                    ← กลับไปเลือกข้อ
                  </button>
                  <button
                    type="button"
                    className={`writingGuideHelperBtn ${showHelper ? 'is-open' : ''}`}
                    onClick={() => setShowHelper((open) => !open)}
                    aria-expanded={showHelper}
                  >
                    ตัวช่วย
                  </button>
                </div>
                {showHelper ? (
                  <WritingVocabularyHelper chipGroups={category.chipGroups} structures={category.structures} />
                ) : null}
                {exercise ? (
                  <WritingGuidedBuilder
                    key={exercise.id}
                    prompt={prompt}
                    exercise={exercise}
                    onSaveEssay={
                      onSaveEssayToNotebook
                        ? ({ paragraphs, score }) =>
                            onSaveEssayToNotebook({
                              promptId: prompt.id,
                              categoryTitle: category.title,
                              questionTitle: prompt.title,
                              questionNumber: prompt.number,
                              prompt,
                              paragraphs,
                              score
                            })
                        : undefined
                    }
                  />
                ) : (
                  <div className="writingGuideComingSoon">
                    <p>Guided writing practice for this question is not ready yet.</p>
                  </div>
                )}
              </div>
            )
          })()
        ) : null}

        {flow.step === 'task1-guide' && activeCategory ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · คำศัพท์"
              title={activeCategory.title}
              subtitle="แบบฝึกกำลังจะมาเพิ่ม — ระหว่างนี้กด “ตัวช่วย” เพื่อดูคำศัพท์และโครงสร้างได้เลย"
              onBack={goBack}
              backLabel="ประเภทกราฟ"
            />
            <div className="writingGuideExamToolbar writingGuideExamToolbar-inline">
              <button
                type="button"
                className={`writingGuideHelperBtn ${showHelper ? 'is-open' : ''}`}
                onClick={() => setShowHelper((open) => !open)}
                aria-expanded={showHelper}
              >
                ตัวช่วย
              </button>
            </div>
            {showHelper ? (
              <WritingVocabularyHelper
                chipGroups={activeCategory.chipGroups}
                structures={activeCategory.structures}
              />
            ) : (
              <div className="writingGuideComingSoon">
                <p>Exam questions for this category are not ready yet.</p>
                <p>Tap <strong>ตัวช่วย</strong> to view recommended vocabulary and structures.</p>
              </div>
            )}
          </div>
        ) : null}

        {flow.step === 'task2-types' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 2 · เส้นทางฝึก"
              title="เลือกประเภทเรียงความที่อยากฝึก"
              subtitle="เดินตาม path · ดูจุดเน้นของแต่ละแบบ แล้วเข้าฝึกเติมคำทีละย่อหน้า"
              onBack={goBack}
              backLabel="กลับ"
            />
            <WgTicketPathList ariaLabel="ประเภท Task 2">
              {WRITING_TASK2_TYPES.map((item, index) => {
                const stamps = [
                  { emoji: '💬', tone: 'yellow' },
                  { emoji: '⚖️', tone: 'peach' },
                  { emoji: '🔍', tone: 'blue' },
                  { emoji: '💡', tone: 'lilac' },
                  { emoji: '🧩', tone: 'ink' }
                ] as const
                const stamp = stamps[index % stamps.length]
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="wgTicket"
                    onClick={() => {
                      setShowHelper(false)
                      setFlow({ step: 'task2-questions', typeId: item.id as WritingTask2TypeId })
                    }}
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>{item.title}</strong>
                        <span className="wgTicketBadge">{index === 0 ? 'Start' : 'Task 2'}</span>
                      </span>
                      <span className="wgTicketSub">{item.subtitle}</span>
                    </span>
                    <span className="wgTicketGo">เข้าคลัง →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
            <div className="wlpBand7Tabs wlpBand7Tabs-single">
              <p className="wlpSectionKicker">ตัวอย่างคำตอบ · Band 7 Model Answer</p>
              <Band7SampleView sample={WRITING_BAND7_TASK2_SAMPLE} />
            </div>
          </div>
        ) : null}

        {flow.step === 'task2-questions' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 2 · เลือกข้อ"
              title={WRITING_TASK2_TYPES.find((item) => item.id === flow.typeId)?.title || 'Task 2'}
              subtitle="เดินตาม path · เลือก 1 ข้อ แล้วเข้าฝึกเขียนทีละย่อหน้า"
              onBack={goBack}
              backLabel="ประเภทเรียงความ"
            />
            <WgTicketPathList ariaLabel="รายการข้อสอบ Task 2">
              {activeTask2Prompts.map((prompt, index) => {
                const stamps = [
                  { emoji: '💬', tone: 'yellow' },
                  { emoji: '⚖️', tone: 'peach' },
                  { emoji: '🔍', tone: 'blue' },
                  { emoji: '💡', tone: 'lilac' },
                  { emoji: '🧩', tone: 'ink' }
                ] as const
                const stamp = stamps[index % stamps.length]
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className="wgTicket"
                    onClick={() => {
                      setShowHelper(false)
                      setFlow({ step: 'task2-drill', typeId: flow.typeId, promptId: prompt.id })
                    }}
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>{prompt.title}</strong>
                        <span className="wgTicketBadge">Q{prompt.number}</span>
                      </span>
                      <span className="wgTicketSub">{prompt.meta}</span>
                    </span>
                    <span className="wgTicketGo">ฝึกเขียน →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'task2-drill' && activeTask2Prompt ? (
          (() => {
            const exercise = getDenseWritingTask2Builder(activeTask2Prompt.id)
            const prompt = activeTask2Prompt
            const typeTitle = WRITING_TASK2_TYPES.find((item) => item.id === prompt.typeId)?.title || 'Task 2'
            return (
              <div className="writingGuideExamShell">
                <div className="writingGuideExamToolbar">
                  <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                    ← กลับไปเลือกข้อ
                  </button>
                </div>
                {exercise ? (
                  <WritingTask2Practice
                    key={exercise.id}
                    prompt={prompt}
                    exercise={exercise}
                    onSaveVocab={
                      onSaveVocabToNotebook
                        ? (vocab) =>
                            onSaveVocabToNotebook({
                              word: vocab.word,
                              thaiMeaning: vocab.thaiMeaning,
                              questionTitle: prompt.title,
                              questionNumber: prompt.number
                            })
                        : undefined
                    }
                    onSaveEssay={
                      onSaveTask2EssayToNotebook
                        ? ({ paragraphs, score }) =>
                            onSaveTask2EssayToNotebook({
                              promptId: prompt.id,
                              typeTitle,
                              questionTitle: prompt.questionText,
                              questionNumber: prompt.number,
                              meta: prompt.meta,
                              paragraphs,
                              vocab: prompt.vocab,
                              score
                            })
                        : undefined
                    }
                  />
                ) : (
                  <div className="writingGuideComingSoon">
                    <p>Guided writing practice for this question is not ready yet.</p>
                  </div>
                )}
              </div>
            )
          })()
        ) : null}
      </div>
    </section>
  )
}
