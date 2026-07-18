import { useMemo, useRef, useState } from 'react'
import type { WritingTask2Prompt, WritingTask2VocabItem } from './writingTask2Data'
import { buildVocabQuiz, type VocabQuizKind, type VocabQuizQuestion } from './writingTask2VocabQuiz'
import { COUNTABILITY_LABEL_TH, getCountability, type Countability } from './nounCountability'
import './VocabUsageQuiz.css'

const KIND_LABEL: Record<VocabQuizKind, string> = {
  collocation: 'COLLOCATION',
  'word-form': 'WORD FORM',
  'spot-usage': 'SPOT THE CORRECT USE',
  spell: 'SPELL IT OUT'
}

const KIND_HINT: Record<VocabQuizKind, string> = {
  collocation: 'คำไหน “เข้าคู่” กับคำอื่นได้ถูกต้อง',
  'word-form': 'เลือกรูปคำ (noun / adj / adverb) ให้ตรงหน้าที่',
  'spot-usage': 'ประโยคไหนใช้คำได้ถูกและเป็นธรรมชาติ',
  spell: 'พิมพ์เติมตัวอักษรที่หายไปให้ครบจากบริบท'
}

function LetterBoxes({
  prefix,
  missing,
  value,
  disabled,
  state,
  onChange,
  onSubmit
}: {
  prefix: string
  missing: number
  value: string
  disabled: boolean
  state: '' | 'is-correct' | 'is-wrong'
  onChange: (next: string) => void
  onSubmit: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  // One clean line: bold prefix + the letters typed directly onto the underscores.
  return (
    <span className="vqSpell" onClick={() => inputRef.current?.focus()}>
      <span className="vqSpellPrefix">{prefix}</span>
      <span className="vqSpellField">
        <span className="vqSpellGhost" aria-hidden="true">{'_'.repeat(Math.max(0, missing))}</span>
        <input
          ref={inputRef}
          className={`vqSpellReal ${state}`}
          value={value}
          disabled={disabled}
          maxLength={missing}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="เติมตัวอักษรที่หายไป"
          onChange={(event) => onChange(event.target.value.replace(/[^A-Za-z]/g, ''))}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && value.length === missing) onSubmit()
          }}
        />
      </span>
    </span>
  )
}

const renderCU = (countability: Countability | null) =>
  countability ? (
    <span
      className={`vqCU vqCU-${countability === 'C/U' ? 'both' : countability}`}
      title={COUNTABILITY_LABEL_TH[countability]}
    >
      {countability}
    </span>
  ) : null

type Props = {
  prompt: WritingTask2Prompt
  onSaveVocab?: (vocab: WritingTask2VocabItem, prompt: WritingTask2Prompt) => void
}

export function WritingTask2VocabQuiz({ prompt, onSaveVocab }: Props) {
  const questions = useMemo(() => buildVocabQuiz(prompt, 40), [prompt])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [typed, setTyped] = useState<Record<string, string>>({})
  const [spellChecked, setSpellChecked] = useState<Set<string>>(() => new Set())
  const [thaiHints, setThaiHints] = useState<Set<string>>(() => new Set())
  const [enHints, setEnHints] = useState<Set<string>>(() => new Set())
  const [savedWords, setSavedWords] = useState<Set<string>>(() => new Set())

  const isQuestionAnswered = (item: VocabQuizQuestion) =>
    item.kind === 'spell' ? spellChecked.has(item.id) : answers[item.id] !== undefined

  const isQuestionCorrect = (item: VocabQuizQuestion) => {
    if (item.kind === 'spell') {
      if (!spellChecked.has(item.id)) return false
      return (item.prefix ?? '') + (typed[item.id] ?? '') === (item.answer ?? '')
        ? true
        : ((item.prefix ?? '') + (typed[item.id] ?? '')).toLowerCase() === (item.answer ?? '').toLowerCase()
    }
    const picked = answers[item.id]
    return picked !== undefined && !!item.choices[picked]?.correct
  }

  const total = questions.length
  const question: VocabQuizQuestion | undefined = questions[index]
  const answeredCount = questions.filter(isQuestionAnswered).length
  const correctCount = questions.filter(isQuestionCorrect).length
  const finished = answeredCount === total && total > 0

  if (!question) {
    return (
      <div className="vqShell">
        <p className="vqEmpty">ยังไม่มีคำศัพท์สำหรับสร้างแบบทดสอบในข้อนี้</p>
      </div>
    )
  }

  const isSpell = question.kind === 'spell'
  const picked = answers[question.id]
  const isAnswered = isQuestionAnswered(question)
  const isCorrect = isQuestionCorrect(question)
  const isCloze = question.before !== undefined && !isSpell
  const wordSaved = savedWords.has(question.word)
  const spellValue = typed[question.id] ?? ''
  const spellMissing = (question.answer?.length ?? 0) - (question.prefix?.length ?? 0)

  const choose = (choiceIndex: number) => {
    if (isAnswered) return
    setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))
  }

  const submitSpell = () => {
    if (spellChecked.has(question.id) || spellValue.length !== spellMissing) return
    setSpellChecked((current) => new Set(current).add(question.id))
  }

  const saveWord = () => {
    if (!onSaveVocab || wordSaved) return
    const item = prompt.vocab.find((v) => v.word === question.word)
    if (!item) return
    onSaveVocab(item, prompt)
    setSavedWords((current) => new Set(current).add(question.word))
  }

  const go = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)))

  const wrongList = questions
    .map((item, order) => ({ item, order }))
    .filter(({ item }) => isQuestionAnswered(item) && !isQuestionCorrect(item))

  return (
    <div className="vqShell">
      <header className="vqHeader">
        <div className="vqHeaderText">
          <p className="vqEyebrow">ทดสอบการใช้คำศัพท์ · ข้อ {prompt.number}</p>
          <h3>{prompt.title}</h3>
          <p className="vqSub">
            {total} คำถามที่บังคับให้คิดว่าจะ “ใช้” คำอย่างไร ไม่ใช่แค่จำความหมาย —
            collocation · รูปคำ · เลือกประโยคที่ถูก · สะกดคำจากบริบท
          </p>
        </div>
        <div className="vqScore">
          <span className="vqScoreNum">{correctCount}</span>
          <span className="vqScoreDen">/ {total}</span>
          <span className="vqScoreLabel">ถูก</span>
        </div>
      </header>

      <div className="vqProgressTrack" aria-hidden="true">
        <div className="vqProgressFill" style={{ width: `${(answeredCount / total) * 100}%` }} />
      </div>

      <article className="vqCard">
        <div className="vqCardTop">
          <span className={`vqKind vqKind-${question.kind}`}>{KIND_LABEL[question.kind]}</span>
          <span className="vqCounter">
            {index + 1} / {total}
          </span>
        </div>

        {isSpell ? (
          <div className="vqWordRow vqWordRow-spell">
            <div className="vqHintCluster">
              <button
                type="button"
                className="vqHintBtn"
                disabled={thaiHints.has(question.id)}
                onClick={() => setThaiHints((c) => new Set(c).add(question.id))}
              >
                💡 ดูความหมาย (ไทย)
              </button>
              {thaiHints.has(question.id) ? (
                <span className="vqWordTh">{question.thaiMeaning}</span>
              ) : null}
              <button
                type="button"
                className="vqHintBtn"
                disabled={enHints.has(question.id)}
                onClick={() => setEnHints((c) => new Set(c).add(question.id))}
              >
                🔤 ดูคำอังกฤษ (รูปเดี่ยว)
              </button>
              {enHints.has(question.id) ? (
                <span className="vqHintWord">
                  {(question.baseForm ?? '').toUpperCase()}
                  {renderCU(question.countability ?? null)}
                </span>
              ) : null}
            </div>
            {onSaveVocab ? (
              <button type="button" className="vqSaveWord" disabled={wordSaved} onClick={saveWord}>
                {wordSaved ? '✓ บันทึกแล้ว' : '＋ บันทึกวลีนี้'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="vqWordRow">
            <span className="vqWord">{question.word}</span>
            {renderCU(getCountability(question.word))}
            <span className="vqWordTh">{question.thaiMeaning}</span>
            {onSaveVocab ? (
              <button type="button" className="vqSaveWord" disabled={wordSaved} onClick={saveWord}>
                {wordSaved ? '✓ บันทึกแล้ว' : '＋ บันทึกคำนี้'}
              </button>
            ) : null}
          </div>
        )}

        <p className="vqKindHint">{KIND_HINT[question.kind]}</p>
        <p className="vqInstruction">{question.instruction}</p>

        {isSpell ? (
          <>
            <p className="vqSentence">
              <span>{question.before}</span>
              <LetterBoxes
                prefix={question.prefix ?? ''}
                missing={spellMissing}
                value={spellValue}
                disabled={isAnswered}
                state={isAnswered ? (isCorrect ? 'is-correct' : 'is-wrong') : ''}
                onChange={(next) =>
                  setTyped((current) => ({ ...current, [question.id]: next.slice(0, spellMissing) }))
                }
                onSubmit={submitSpell}
              />
              <span>{question.after}</span>
            </p>
            {!isAnswered ? (
              <button
                type="button"
                className="vqNavBtn vqNavBtn-primary vqSpellCheck"
                disabled={spellValue.length !== spellMissing}
                onClick={submitSpell}
              >
                ตรวจคำตอบ
              </button>
            ) : null}
          </>
        ) : null}

        {isCloze ? (
          <p className="vqSentence">
            <span>{question.before}</span>
            <span className={`vqGap ${isAnswered ? 'is-filled' : ''}`}>
              {isAnswered ? question.choices[picked]?.text : '_____'}
            </span>
            <span>{question.after}</span>
          </p>
        ) : null}

        {!isSpell ? (
          <div className={`vqChoices ${isCloze ? 'is-inline' : 'is-block'}`}>
            {question.choices.map((choice, choiceIndex) => {
              const state = !isAnswered
                ? ''
                : choice.correct
                  ? 'is-correct'
                  : choiceIndex === picked
                    ? 'is-wrong'
                    : 'is-dim'
              return (
                <button
                  key={choiceIndex}
                  type="button"
                  className={`vqChoice ${state}`}
                  disabled={isAnswered}
                  onClick={() => choose(choiceIndex)}
                >
                  {isAnswered ? (
                    <span className="vqChoiceMark" aria-hidden="true">
                      {choice.correct ? '✓' : choiceIndex === picked ? '✕' : ''}
                    </span>
                  ) : null}
                  <span className="vqChoiceText">{choice.text}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {isAnswered ? (
          <div className={`vqExplain ${isCorrect ? 'is-correct' : 'is-wrong'}`} role="status">
            <strong>{isCorrect ? 'ถูกต้อง!' : 'ยังไม่ถูก'}</strong>
            {isSpell && !isCorrect ? (
              <span className="vqReveal">คำที่ถูกคือ “{question.answer}”</span>
            ) : null}
            <span>{question.explain}</span>
          </div>
        ) : null}

        <div className="vqNav">
          <button type="button" className="vqNavBtn" disabled={index === 0} onClick={() => go(index - 1)}>
            ← ก่อนหน้า
          </button>
          <button
            type="button"
            className="vqNavBtn vqNavBtn-primary"
            disabled={index === total - 1}
            onClick={() => go(index + 1)}
          >
            ถัดไป →
          </button>
        </div>
      </article>

      {finished ? (
        <div className="vqFinish">
          <p className="vqFinishTitle">
            ทำครบ {total} ข้อแล้ว — ตอบถูก {correctCount}/{total} ({Math.round((correctCount / total) * 100)}%)
          </p>
          {wrongList.length ? (
            <div className="vqWrongReview">
              <p className="vqWrongHead">ทบทวนข้อที่ยังพลาด ({wrongList.length} ข้อ)</p>
              <ul>
                {wrongList.map(({ item, order }) => (
                  <li key={item.id}>
                    <button type="button" className="vqWrongJump" onClick={() => go(order)}>
                      ข้อ {order + 1} · {item.word} — {item.explain}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="vqPerfect">เยี่ยมมาก! ใช้คำได้ถูกทุกข้อ 🎉</p>
          )}
          <button
            type="button"
            className="vqNavBtn vqNavBtn-primary"
            onClick={() => {
              setAnswers({})
              setTyped({})
              setSpellChecked(new Set())
              setThaiHints(new Set())
              setEnHints(new Set())
              setIndex(0)
            }}
          >
            เริ่มทำใหม่
          </button>
        </div>
      ) : null}
    </div>
  )
}
