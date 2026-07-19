import { buildLetterHintMask, isLetterHintBlank } from './writingLetterHint'
import { VocabMeaningButton } from './VocabMeaningButton'
import './LetterHintBlank.css'

/** Shared letter-hint input: one box holding a fixed prefix plus an input for the
 *  missing tail. The learner types only the tail; onChange still emits the full word.
 *  An optional TH button reveals the Thai meaning and offers a Notebook save. */
export function LetterHintBlankInput({
  answer,
  value,
  stateClass,
  onChange,
  onFocus,
  onBlur,
  onEnter,
  base,
  thaiMeaning,
  saved,
  onSaveToNotebook
}: {
  answer: string
  value: string
  stateClass: string
  base?: string
  thaiMeaning?: string
  saved?: boolean
  onSaveToNotebook?: (payload: { word: string; thaiMeaning: string }) => void
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onEnter?: () => void
}) {
  const mask = buildLetterHintMask(answer || base || '')
  const widthCh = Math.max(mask.missingCount + 2, 4)

  /** The learner only types the missing tail; `value` stays the full word for grading. */
  const suffix = value.toLowerCase().startsWith(mask.prefix.toLowerCase())
    ? value.slice(mask.prefix.length)
    : value

  return (
    <span className="wgbLetterHint">
      <span className="wgbLetterHintTop">
        <span className={`wgbLetterHintShell ${stateClass} ${value ? 'is-filled' : ''}`}>
          <span className="wgbLetterHintPrefix" aria-hidden="true">
            {mask.prefix}
          </span>
          <input
            type="text"
            className="wgbLetterHintInput"
            value={suffix}
            placeholder={'_'.repeat(mask.missingCount)}
            style={{ width: `${widthCh}ch` }}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            aria-label={`เติมส่วนที่เหลือของคำที่ขึ้นต้นด้วย ${mask.prefix} (อีก ${mask.missingCount} ตัวอักษร)`}
            onChange={(event) => onChange(mask.prefix + event.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onEnter?.()
            }}
          />
          <VocabMeaningButton
            word={mask.answer}
            thaiMeaning={thaiMeaning || ''}
            saved={saved}
            inset
            onSaveToNotebook={onSaveToNotebook}
          />
        </span>
      </span>
    </span>
  )
}

export { isLetterHintBlank, buildLetterHintMask }
