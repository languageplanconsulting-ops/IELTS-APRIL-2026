import { useEffect, useRef, useState } from 'react'
import { buildLetterHintMask, isLetterHintBlank } from './writingLetterHint'
import './LetterHintBlank.css'

/** Shared letter-hint input: shows mot_ _ _ _ _ _ _ and asks for the full word.
 *  Optional TH button reveals Thai meaning with a genie card + notebook save. */
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
  const widthCh = Math.max(mask.answer.length + 2, mask.spacedMask.length + 1, 8)
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const leaveTimer = useRef<number | null>(null)
  const meaning = (thaiMeaning || '').trim()
  const canShowMeaning = meaning.length > 0

  const clearLeave = () => {
    if (leaveTimer.current != null) {
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
  }

  const dismiss = () => {
    if (!open) return
    setOpen(false)
    setLeaving(true)
    clearLeave()
    leaveTimer.current = window.setTimeout(() => {
      setLeaving(false)
      leaveTimer.current = null
    }, 260)
  }

  useEffect(() => () => clearLeave(), [])

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event: Event) => {
      const target = event.target
      if (target instanceof Element && target.closest('.wgbLetterHint')) return
      dismiss()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('pointerdown', onPointer, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span className={`wgbLetterHint ${open || leaving ? 'is-open' : ''}`}>
      <span className="wgbLetterHintTop">
        <span className="wgbLetterHintMask" aria-hidden="true">
          <span className="wgbLetterHintPrefix">{mask.prefix}</span>
          {mask.missingCount > 0 ? (
            <span className="wgbLetterHintSlots">
              {Array.from({ length: mask.missingCount }, (_, i) => (
                <span key={i} className="wgbLetterHintSlot">
                  _
                </span>
              ))}
            </span>
          ) : null}
        </span>
        {canShowMeaning ? (
          <button
            type="button"
            className={`wgbLetterHintThBtn ${open || leaving ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-label="ดูความหมายภาษาไทย"
            onClick={(event) => {
              event.stopPropagation()
              if (open) {
                dismiss()
                return
              }
              clearLeave()
              setLeaving(false)
              setOpen(true)
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            TH
          </button>
        ) : null}
      </span>
      <input
        type="text"
        className={`wgbInput wgbLetterHintInput ${stateClass} ${value ? 'is-filled' : ''}`}
        value={value}
        placeholder={mask.spacedMask}
        style={{ width: `${widthCh}ch` }}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoComplete="off"
        aria-label={`เติมคำที่ขึ้นต้นด้วย ${mask.prefix} มี ${mask.missingCount} ตัวอักษรที่หายไป`}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onEnter?.()
        }}
      />
      {open || leaving ? (
        <span
          className={`wgbLetterHintPopover ${leaving ? 'is-leaving' : ''}`}
          role="dialog"
          aria-label={`ความหมายของ ${mask.answer}`}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return
            if (leaving) setLeaving(false)
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <p className="wgbLetterHintPopoverKicker">
            <span className="wgbLetterHintPopoverJewel" aria-hidden="true" />
            Vocab meaning
          </p>
          <p className="wgbLetterHintPopoverWord">{mask.answer}</p>
          <p className="wgbLetterHintPopoverMask" aria-hidden="true">
            {mask.spacedMask}
          </p>
          <p className="wgbLetterHintPopoverTh">{meaning}</p>
          {onSaveToNotebook ? (
            <button
              type="button"
              className="wgbLetterHintPopoverSave"
              disabled={saved}
              onClick={(event) => {
                event.stopPropagation()
                onSaveToNotebook({ word: mask.answer, thaiMeaning: meaning })
              }}
            >
              {saved ? '✓ บันทึกแล้ว' : '＋ เพิ่มลง Notebook'}
            </button>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}

export { isLetterHintBlank, buildLetterHintMask }
