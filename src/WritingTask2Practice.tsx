import { useMemo, useState } from 'react'
import {
  assembleTask2Essay,
  WGB2_NO_ARTICLE,
  WGB2_ROLE_LABEL_TH,
  WGB2_STEP_COACH_TH,
  WGB2_STEP_SHORT,
  WGB2_BLANK_COACH_TH,
  WGB2_PUNCT_SYMBOL,
  WGB2_PUNCT_LABEL_TH,
  type Wgb2Blank,
  type Wgb2CommaBlank,
  type Wgb2Exercise,
  type Wgb2Segment
} from './writingTask2Builder'
import type { WritingTask2Prompt, WritingTask2VocabItem } from './writingTask2Data'
import type { WritingTask2ReportParagraph } from './writingReportTypes'
import { VocabHighlightText } from './VocabHighlightText'

const wgb2Normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

function Wgb2CoachBubble({ coachKey, message, isBlankFocus }: { coachKey: string; message: string; isBlankFocus: boolean }) {
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

export function WritingTask2Practice({
  prompt,
  exercise,
  onSaveVocab,
  onSaveEssay
}: {
  prompt: WritingTask2Prompt
  exercise: Wgb2Exercise
  onSaveVocab?: (vocab: WritingTask2VocabItem, prompt: WritingTask2Prompt) => void
  onSaveEssay?: (data: { paragraphs: WritingTask2ReportParagraph[]; score: { correct: number; total: number } }) => void
}) {
  const steps = exercise.steps
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => new Set())
  const [checkedNow, setCheckedNow] = useState(false)
  const [showEssay, setShowEssay] = useState(false)
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null)
  const [savedWords, setSavedWords] = useState<Set<string>>(() => new Set())
  const [pickedChip, setPickedChip] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [droppedId, setDroppedId] = useState<string | null>(null)
  const [savedEssayNotice, setSavedEssayNotice] = useState(false)

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const isBlankCorrect = (blank: Wgb2Blank): boolean => {
    if (blank.kind === 'comma') return values[blank.id] === String(blank.correctGap)
    const value = values[blank.id]
    if (value == null || value.trim() === '') return false
    if (blank.kind === 'select') return value === blank.answer
    if (blank.kind === 'drag') return value === blank.answer
    if (blank.kind === 'punct') return value === blank.answer
    return blank.answers.some((answer) => wgb2Normalize(answer) === wgb2Normalize(value))
  }

  const stepBlanks = useMemo(
    () =>
      step.segments
        .filter((segment): segment is Extract<Wgb2Segment, { kind: 'blank' }> => segment.kind === 'blank')
        .map((segment) => segment.blank),
    [step]
  )
  const dragBlanks = useMemo(
    () => stepBlanks.filter((blank): blank is Extract<Wgb2Blank, { kind: 'drag' }> => blank.kind === 'drag'),
    [stepBlanks]
  )
  const stepScore = stepBlanks.filter(isBlankCorrect).length
  const stepDone = checkedSteps.has(step.id)
  const allDone = steps.every((item) => checkedSteps.has(item.id))

  const totalBlanks = useMemo(
    () => steps.reduce((sum, item) => sum + item.segments.filter((s) => s.kind === 'blank').length, 0),
    [steps]
  )
  const allBlanks = useMemo(
    () =>
      steps.flatMap((item) =>
        item.segments
          .filter((segment): segment is Extract<Wgb2Segment, { kind: 'blank' }> => segment.kind === 'blank')
          .map((segment) => segment.blank)
      ),
    [steps]
  )

  const setValue = (id: string, value: string) => {
    setCheckedNow(false)
    setValues((current) => ({ ...current, [id]: value }))
  }

  const wrongBlanks = checkedNow ? stepBlanks.filter((blank) => !isBlankCorrect(blank)) : []

  const blankCorrectAnswer = (blank: Wgb2Blank): string => {
    if (blank.kind === 'select') return blank.answer === WGB2_NO_ARTICLE ? 'ไม่ต้องใส่คำนำหน้า' : blank.answer
    if (blank.kind === 'type') return blank.answers[0]
    if (blank.kind === 'drag') return blank.answer
    if (blank.kind === 'punct') return WGB2_PUNCT_LABEL_TH[blank.answer]
    return `${blank.chunks[blank.correctGap]}, ${blank.chunks[blank.correctGap + 1]}`
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
    setSavedEssayNotice(false)
  }

  const model = useMemo(() => assembleTask2Essay(exercise), [exercise])

  const activeBlank = activeBlankId ? stepBlanks.find((blank) => blank.id === activeBlankId) ?? null : null
  const coachMessage = activeBlank ? WGB2_BLANK_COACH_TH[activeBlank.focus] : WGB2_STEP_COACH_TH[step.role]
  const coachKey = activeBlank ? activeBlank.id : `step-${step.id}`

  const handleSaveVocab = (item: WritingTask2VocabItem) => {
    if (!onSaveVocab) return
    onSaveVocab(item, prompt)
    setSavedWords((current) => new Set(current).add(item.word))
  }

  const handleSaveEssay = () => {
    if (!onSaveEssay) return
    const total = allBlanks.length
    const correct = allBlanks.filter(isBlankCorrect).length
    onSaveEssay({ paragraphs: model, score: { correct, total } })
    setSavedEssayNotice(true)
  }

  return (
    <div className="wgb2Shell">
      <div className="wgb2QuestionCard">
        <p className="wgb2QuestionEyebrow">โจทย์ข้อ {prompt.number}</p>
        <p className="wgb2QuestionText">{prompt.questionText}</p>
        <p className="wgb2QuestionInstruction">
          <b>วิธีทำ:</b> เรียงความนี้มีช่องฝึกหนาแน่น (~50 ช่องพิมพ์ผันคำ + ~70 dropdown เลือกคำ) ประมาณทุก 3–4 คำ
          — ทดสอบกริยา · คำนำหน้า · คำนาม/คุณศัพท์/กริยาวิเศษณ์ · คำเชื่อม · วรรคตอน เขียนทีละย่อหน้า แล้วกด{' '}
          <b>“ตรวจคำตอบ”</b> เพื่อดูเฉลยและคำอธิบายภาษาไทยใต้ช่องที่ผิด (เขียว = ถูก, ชมพู = ต้องแก้)
        </p>
      </div>

      <div className={`wgb2Layout ${dragBlanks.length ? 'has-sidebar' : ''}`}>
      <div className="wgbPanel wgb2Panel">
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
                  <span className="wgbRailLabel">{WGB2_STEP_SHORT[item.role]}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <Wgb2CoachBubble coachKey={coachKey} message={coachMessage} isBlankFocus={!!activeBlank} />

        <div key={step.id} className="wgbStepCard">
          <p className="wgbStepEyebrow">{WGB2_ROLE_LABEL_TH[step.role]}</p>
          {step.hintTh ? <p className="wgbStepHint">{step.hintTh}</p> : null}

          <p className="wgbSentence">
            {step.segments.map((segment, index) => {
              if (segment.kind === 'text') return <span key={index}>{segment.text}</span>
              const blank = segment.blank
              const correct = isBlankCorrect(blank)
              const stateClass = !checkedNow ? '' : correct ? 'is-correct' : 'is-incorrect'

              if (blank.kind === 'select') {
                const value = values[blank.id] ?? ''
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
                      <em className="wgbReveal">{blankCorrectAnswer(blank)}</em>
                    ) : null}
                  </span>
                )
              }

              if (blank.kind === 'type') {
                const value = values[blank.id] ?? ''
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
              }

              if (blank.kind === 'punct') {
                const selected = values[blank.id]
                return (
                  <span
                    key={blank.id}
                    className={`wgb2PunctGroup ${stateClass}`}
                    onFocus={() => setActiveBlankId(blank.id)}
                    onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                  >
                    {blank.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`wgb2PunctBtn ${selected === option ? 'is-selected' : ''}`}
                        onClick={() => setValue(blank.id, option)}
                      >
                        {WGB2_PUNCT_SYMBOL[option]}
                      </button>
                    ))}
                    {checkedNow && !correct ? <em className="wgbReveal">{blankCorrectAnswer(blank)}</em> : null}
                  </span>
                )
              }

              if (blank.kind === 'drag') {
                const value = values[blank.id] ?? ''
                const dragSlotNumber = dragBlanks.findIndex((item) => item.id === blank.id) + 1
                return (
                  <span key={blank.id} className="wgbBlankWrap wgbDragWrap">
                    <span
                      className={`wgbDropSlot ${stateClass} ${value ? 'is-filled' : ''} ${
                        dragOverId === blank.id ? 'is-dragover' : ''
                      } ${droppedId === blank.id ? 'is-dropped' : ''}`}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDragOverId(blank.id)
                      }}
                      onDragLeave={() => setDragOverId((current) => (current === blank.id ? null : current))}
                      onDrop={(event) => {
                        event.preventDefault()
                        const phrase = event.dataTransfer.getData('text/plain')
                        if (phrase) {
                          setValue(blank.id, phrase)
                          setDroppedId(blank.id)
                          window.setTimeout(() => setDroppedId((current) => (current === blank.id ? null : current)), 420)
                        }
                        setDragOverId(null)
                      }}
                      onClick={() => {
                        if (pickedChip) {
                          setValue(blank.id, pickedChip)
                          setDroppedId(blank.id)
                          window.setTimeout(() => setDroppedId((current) => (current === blank.id ? null : current)), 420)
                          setPickedChip(null)
                        }
                      }}
                    >
                      {value || (
                        <>
                          <span className="wgbDropSlotNum">{dragSlotNumber}</span> ลากคำเชื่อมมาวางตรงนี้
                        </>
                      )}
                    </span>
                    {checkedNow && !correct ? <em className="wgbReveal">{blank.answer}</em> : null}
                  </span>
                )
              }

              const commaBlank = blank as Wgb2CommaBlank
              const selected = values[commaBlank.id]
              return (
                <span
                  key={commaBlank.id}
                  className={`wgb2CommaGroup ${stateClass}`}
                  onFocus={() => setActiveBlankId(commaBlank.id)}
                  onBlur={() => setActiveBlankId((current) => (current === commaBlank.id ? null : current))}
                >
                  {commaBlank.chunks.map((chunk, chunkIndex) => (
                    <span key={chunkIndex} className="wgb2CommaPiece">
                      {chunk}
                      {chunkIndex < commaBlank.chunks.length - 1 ? (
                        <button
                          type="button"
                          className={`wgb2CommaGap ${selected === String(chunkIndex) ? 'is-selected' : ''}`}
                          onClick={() => setValue(commaBlank.id, String(chunkIndex))}
                          aria-label="แตะเพื่อวาง comma ตรงนี้"
                        >
                          {selected === String(chunkIndex) ? ',' : '·'}
                        </button>
                      ) : null}
                    </span>
                  ))}
                  {checkedNow && !correct ? <em className="wgbReveal">{blankCorrectAnswer(commaBlank)}</em> : null}
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
                    disabled={savedEssayNotice}
                  >
                    {savedEssayNotice ? '✓ บันทึกลง Notebook แล้ว' : '＋ บันทึกเรียงความลง Notebook'}
                  </button>
                ) : null}
                <button type="button" className="wlpBtn wlpBtn-secondary" onClick={resetAll}>
                  เริ่มใหม่
                </button>
              </div>
              {savedEssayNotice ? (
                <p className="wgbSavedHint">
                  บันทึกไว้ในหมวด <strong>WRITING ESSAY</strong> ของ Notebook แล้ว — เปิดดูเรียงความเต็มพร้อมคำศัพท์ได้ทุกเมื่อ 📓
                </p>
              ) : null}
            </div>
            {showEssay ? (
              <article className="wgbEssay">
                <p className="wgb2VocabHint">
                  คำที่<b>ขีดเส้นใต้</b>คือคำศัพท์/collocation สำคัญ — แตะเพื่อดูความหมายและตัวอย่างประโยค
                </p>
                {model.map((para) => (
                  <div key={para.role} className="wgbEssayPara">
                    <span className="wgbEssayLabel">{para.labelTh}</span>
                    <p>
                      <VocabHighlightText
                        text={para.text}
                        vocab={prompt.vocab}
                        savedWords={savedWords}
                        onSave={onSaveVocab ? handleSaveVocab : undefined}
                      />
                    </p>
                  </div>
                ))}
              </article>
            ) : null}

            <div className="wgb2VocabList">
              <p className="wgb2VocabListHead">คำศัพท์น่าเก็บจากเรียงความนี้ ({prompt.vocab.length} คำ) — กดบันทึกลง Notebook ทีละคำ</p>
              {prompt.vocab.map((item) => {
                const saved = savedWords.has(item.word)
                return (
                  <div key={item.word} className="wgb2VocabItem">
                    <div className="wgb2VocabText">
                      <span className="wgb2VocabWord">{item.word}</span>
                      <span className="wgb2VocabMeaning">{item.thaiMeaning}</span>
                      {item.example ? <span className="wgb2VocabExample">{item.example}</span> : null}
                    </div>
                    <button
                      type="button"
                      className="wlpBtn wlpBtn-save"
                      disabled={saved || !onSaveVocab}
                      onClick={() => handleSaveVocab(item)}
                    >
                      {saved ? '✓ บันทึกแล้ว' : '＋ บันทึก'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      {dragBlanks.length ? (
        <aside className="wgb2DragSidebar">
          <p className="wgb2DragSidebarHead">คำเชื่อมให้เลือก</p>
          {dragBlanks.map((blank, index) => {
            const value = values[blank.id] ?? ''
            return (
              <div key={blank.id} className="wgb2DragGroup">
                <p className="wgb2DragGroupLabel">ช่องที่ {index + 1}</p>
                <span className="wgbChipBank">
                  {blank.options.map((option) => (
                    <span
                      key={option}
                      draggable
                      role="button"
                      tabIndex={0}
                      className={`wgbChip ${pickedChip === option ? 'is-picked' : ''} ${
                        value === option ? 'is-used' : ''
                      }`}
                      onDragStart={(event) => event.dataTransfer.setData('text/plain', option)}
                      onClick={() => setPickedChip((current) => (current === option ? null : option))}
                    >
                      {option}
                    </span>
                  ))}
                </span>
              </div>
            )
          })}
        </aside>
      ) : null}
      </div>
    </div>
  )
}
