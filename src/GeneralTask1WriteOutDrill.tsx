/**
 * "อยากลองเขียนเอง" — the write-it-out drill that follows the blank builder.
 *
 * Each sentence of the model letter is typed from scratch. Above the input sits
 * a hint line showing the first letters of every word (same prefix rule as the
 * letter-hint blanks) with one underscore per missing letter, so punctuation and
 * spacing stay visible. Proper nouns are shown in full — the learner is being
 * drilled on sentence construction, not on guessing a name.
 *
 * The model letter is hidden while the drill runs; it comes back once every
 * sentence is correct.
 */
import { useMemo, useState } from 'react'
import { letterHintPrefixLength } from './writingLetterHint'
import type { GeneralTask1Prompt } from './writingGeneralTask1Data'
import './GeneralTask1WriteOutDrill.css'

type DrillProps = {
  prompt: GeneralTask1Prompt
  /** Fired once every sentence is correct. */
  onComplete: () => void
}

/** Curly and straight apostrophes/quotes are the same character to a learner. */
const normalizeTyping = (value: string) =>
  value
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * A proper noun is a capitalised word that is not sentence-initial. "I" and
 * "I'm" are pronouns, not names, so they stay masked like any other word.
 */
const isProperNoun = (word: string, indexInSentence: number) => {
  const letters = word.replace(/[^A-Za-z’'-]/g, '')
  if (!letters || indexInSentence === 0) return false
  if (/^I(?:['’][a-z]+)?$/.test(letters)) return false
  return /^[A-Z]/.test(letters)
}

/** mask("studies") -> "st_____"; punctuation and spacing are preserved. */
const maskWord = (word: string) => {
  // Split off leading/trailing punctuation so it stays visible.
  const lead = word.match(/^[^A-Za-z0-9]*/)?.[0] ?? ''
  const trail = word.match(/[^A-Za-z0-9]*$/)?.[0] ?? ''
  const core = word.slice(lead.length, word.length - trail.length)
  if (!core) return word
  const letters = core.replace(/[^A-Za-z0-9]/g, '')
  // One-letter words ("I", "a") carry no spelling to practise, and a bare "_"
  // reads as a missing word rather than a hint — give them outright.
  if (letters.length <= 1) return word
  const prefixLen = Math.min(letterHintPrefixLength(letters), Math.max(letters.length - 1, 0))

  let seen = 0
  let out = ''
  for (const ch of core) {
    if (/[A-Za-z0-9]/.test(ch)) {
      out += seen < prefixLen ? ch : '_'
      seen += 1
    } else {
      // Internal punctuation (apostrophes, hyphens) is given, not guessed.
      out += ch
    }
  }
  return `${lead}${out}${trail}`
}

export const buildHintLine = (sentence: string): string =>
  sentence
    .split(' ')
    .map((word, index) => (isProperNoun(word, index) ? word : maskWord(word)))
    .join(' ')

export function GeneralTask1WriteOutDrill({ prompt, onComplete }: DrillProps) {
  const sentences = useMemo(
    () => prompt.paragraphs.flatMap((paragraph, pIndex) =>
      paragraph.sentences.map((sentence, sIndex) => ({
        key: `${pIndex}-${sIndex}`,
        paragraphLabel: paragraph.label,
        bulletIndex: paragraph.bulletIndex,
        text: sentence.text,
        thai: sentence.thai,
        hint: buildHintLine(sentence.text)
      }))
    ),
    [prompt]
  )

  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())

  const isCorrect = (key: string, text: string) =>
    normalizeTyping(drafts[key] || '') === normalizeTyping(text)

  const correctCount = sentences.filter((s) => isCorrect(s.key, s.text)).length
  const total = sentences.length
  const allCorrect = correctCount === total
  const percent = Math.round((correctCount / total) * 100)

  // Group by paragraph so the drill mirrors the three-bullet structure.
  const groups = prompt.paragraphs.map((paragraph, index) => ({
    label: paragraph.label,
    bulletIndex: index,
    items: sentences.filter((s) => s.key.startsWith(`${index}-`))
  }))

  return (
    <section className="gt1Drill" aria-label="เขียนจดหมายเองทีละประโยค">
      <header className="gt1DrillHead">
        <div>
          <span className="gt1DrillKicker">เขียนเอง</span>
          <h3>พิมพ์ทีละประโยคจากตัวช่วยด้านบนของแต่ละช่อง</h3>
          <p>
            ตัวอักษรแรกของแต่ละคำถูกใบ้ไว้ให้แล้ว ขีด _ หนึ่งขีดคือตัวอักษรที่หายไปหนึ่งตัว ·
            เครื่องหมายวรรคตอนและการเว้นวรรคต้องตรงทั้งหมด · ชื่อเฉพาะแสดงให้เต็มคำ
          </p>
        </div>
        <div className={`gt1DrillScore ${allCorrect ? 'is-done' : ''}`}>
          <strong>{percent}%</strong>
          <small>{correctCount}/{total} ประโยค</small>
        </div>
      </header>

      <div className="gt1DrillProgress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${percent}%` }} />
      </div>

      {groups.map((group) => (
        <div key={group.bulletIndex} className="gt1DrillGroup">
          <p className="gt1DrillGroupLabel">
            Bullet {group.bulletIndex + 1} · {group.label}
          </p>
          {group.items.map((item) => {
            const value = drafts[item.key] || ''
            const done = isCorrect(item.key, item.text)
            const touched = value.trim().length > 0
            const showAnswer = revealed.has(item.key)
            return (
              <div key={item.key} className={`gt1DrillRow ${done ? 'is-done' : touched ? 'is-typing' : ''}`}>
                <p className="gt1DrillHint" aria-label="ตัวช่วย">
                  {done ? item.text : item.hint}
                </p>
                <p className="gt1DrillThai">{item.thai}</p>
                <div className="gt1DrillInputWrap">
                  <textarea
                    value={value}
                    rows={2}
                    spellCheck={false}
                    disabled={done}
                    placeholder="พิมพ์ประโยคเต็มที่นี่…"
                    onChange={(event) =>
                      setDrafts((prev) => ({ ...prev, [item.key]: event.target.value }))
                    }
                  />
                  <span className="gt1DrillMark" aria-hidden="true">
                    {done ? '✓' : touched ? '…' : ''}
                  </span>
                </div>
                {!done && touched ? (
                  <p className="gt1DrillFeedback">ยังไม่ตรง — ตรวจตัวพิมพ์ใหญ่ จุด คอมมา และ apostrophe</p>
                ) : null}
                {!done ? (
                  <button
                    type="button"
                    className="gt1DrillReveal"
                    onClick={() =>
                      setRevealed((prev) => {
                        const next = new Set(prev)
                        next.add(item.key)
                        return next
                      })
                    }
                  >
                    {showAnswer ? 'ซ่อนเฉลย' : 'ดูเฉลยประโยคนี้'}
                  </button>
                ) : null}
                {showAnswer && !done ? <p className="gt1DrillAnswer">{item.text}</p> : null}
              </div>
            )
          })}
        </div>
      ))}

      {allCorrect ? (
        <div className="gt1DrillDone">
          <strong>ครบ 100% — เขียนได้ทั้งฉบับแล้ว</strong>
          <button type="button" className="gt1DrillFinish" onClick={onComplete}>
            ดู Model Letter อีกครั้ง →
          </button>
        </div>
      ) : null}
    </section>
  )
}
