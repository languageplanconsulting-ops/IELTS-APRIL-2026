import { useMemo, useState } from 'react'
import type { WritingTask2Prompt, WritingTask2VocabItem } from './writingTask2Data'
import { buildVocabQuiz, type VocabQuizKind, type VocabQuizQuestion } from './writingTask2VocabQuiz'
import './WritingTask2VocabQuiz.css'

const KIND_LABEL: Record<VocabQuizKind, string> = {
  collocation: 'COLLOCATION',
  'word-form': 'WORD FORM',
  'spot-usage': 'SPOT THE CORRECT USE'
}

const KIND_HINT: Record<VocabQuizKind, string> = {
  collocation: 'คำไหน “เข้าคู่” กับคำอื่นได้ถูกต้อง',
  'word-form': 'เลือกรูปคำ (noun / adj / adverb) ให้ตรงหน้าที่',
  'spot-usage': 'ประโยคไหนใช้คำได้ถูกและเป็นธรรมชาติ'
}

type Props = {
  prompt: WritingTask2Prompt
  onSaveVocab?: (vocab: WritingTask2VocabItem, prompt: WritingTask2Prompt) => void
}

export function WritingTask2VocabQuiz({ prompt, onSaveVocab }: Props) {
  const questions = useMemo(() => buildVocabQuiz(prompt, 40), [prompt])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [savedWords, setSavedWords] = useState<Set<string>>(() => new Set())

  const total = questions.length
  const question: VocabQuizQuestion | undefined = questions[index]
  const answeredCount = Object.keys(answers).length
  const correctCount = questions.filter((item) => {
    const picked = answers[item.id]
    return picked !== undefined && item.choices[picked]?.correct
  }).length
  const finished = answeredCount === total && total > 0

  if (!question) {
    return (
      <div className="vqShell">
        <p className="vqEmpty">ยังไม่มีคำศัพท์สำหรับสร้างแบบทดสอบในข้อนี้</p>
      </div>
    )
  }

  const picked = answers[question.id]
  const isAnswered = picked !== undefined
  const isCloze = question.before !== undefined
  const wordSaved = savedWords.has(question.word)

  const choose = (choiceIndex: number) => {
    if (isAnswered) return
    setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))
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
    .filter(({ item }) => {
      const p = answers[item.id]
      return p !== undefined && !item.choices[p]?.correct
    })

  return (
    <div className="vqShell">
      <header className="vqHeader">
        <div className="vqHeaderText">
          <p className="vqEyebrow">ทดสอบการใช้คำศัพท์ · ข้อ {prompt.number}</p>
          <h3>{prompt.title}</h3>
          <p className="vqSub">
            {total} คำถามที่บังคับให้คิดว่าจะ “ใช้” คำอย่างไร ไม่ใช่แค่จำความหมาย —
            collocation · รูปคำ · เลือกประโยคที่ถูก
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

        <div className="vqWordRow">
          <span className="vqWord">{question.word}</span>
          <span className="vqWordTh">{question.thaiMeaning}</span>
          {onSaveVocab ? (
            <button type="button" className="vqSaveWord" disabled={wordSaved} onClick={saveWord}>
              {wordSaved ? '✓ บันทึกแล้ว' : '＋ บันทึกคำนี้'}
            </button>
          ) : null}
        </div>

        <p className="vqKindHint">{KIND_HINT[question.kind]}</p>
        <p className="vqInstruction">{question.instruction}</p>

        {isCloze ? (
          <p className="vqSentence">
            <span>{question.before}</span>
            <span className={`vqGap ${isAnswered ? 'is-filled' : ''}`}>
              {isAnswered ? question.choices[picked]?.text : '_____'}
            </span>
            <span>{question.after}</span>
          </p>
        ) : null}

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

        {isAnswered ? (
          <div
            className={`vqExplain ${question.choices[picked]?.correct ? 'is-correct' : 'is-wrong'}`}
            role="status"
          >
            <strong>{question.choices[picked]?.correct ? 'ถูกต้อง!' : 'ยังไม่ถูก'}</strong>
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
