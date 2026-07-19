import { useEffect, useRef, useState } from 'react'
import './LetterHintBlank.css'

/** The yellow TH pill + genie card shown next to any vocabulary blank.
 *  Thai meaning first; the English word stays hidden behind a reveal button so
 *  opening the card never gives the answer away. Saving stores the ENG–THAI pair. */
export function VocabMeaningButton({
  word,
  thaiMeaning,
  saved,
  inset,
  onSaveToNotebook
}: {
  word: string
  thaiMeaning: string
  saved?: boolean
  /** Render as a chip inside the blank's own box rather than a pill beside it. */
  inset?: boolean
  onSaveToNotebook?: (payload: { word: string; thaiMeaning: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const leaveTimer = useRef<number | null>(null)
  const meaning = (thaiMeaning || '').trim()

  const clearLeave = () => {
    if (leaveTimer.current != null) {
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
  }

  const dismiss = () => {
    if (!open) return
    setOpen(false)
    setRevealed(false)
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
      if (target instanceof Element && target.closest('.wgbThWrap')) return
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

  if (!meaning) return null

  return (
    <span className={`wgbThWrap ${inset ? 'is-inset' : ''} ${open || leaving ? 'is-open' : ''}`}>
      <button
        type="button"
        className={`wgbLetterHintThBtn ${inset ? 'is-inset' : ''} ${open || leaving ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-label="ดูคำใบ้ความหมายภาษาไทย"
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
        คำใบ้
      </button>
      {open || leaving ? (
        <span
          className={`wgbLetterHintPopover ${leaving ? 'is-leaving' : ''}`}
          role="dialog"
          aria-label="ความหมายภาษาไทยของคำนี้"
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return
            if (leaving) setLeaving(false)
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span className="wgbLetterHintPopoverKicker">
            <span className="wgbLetterHintPopoverJewel" aria-hidden="true" />
            Vocab meaning
          </span>
          <span className="wgbLetterHintPopoverTh">{meaning}</span>
          {revealed ? (
            <span className="wgbLetterHintPopoverWord">{word}</span>
          ) : (
            <button
              type="button"
              className="wgbLetterHintPopoverReveal"
              onClick={(event) => {
                event.stopPropagation()
                setRevealed(true)
              }}
            >
              👁 แสดงคำภาษาอังกฤษ
            </button>
          )}
          {onSaveToNotebook ? (
            <button
              type="button"
              className="wgbLetterHintPopoverSave"
              disabled={saved}
              onClick={(event) => {
                event.stopPropagation()
                onSaveToNotebook({ word, thaiMeaning: meaning })
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
