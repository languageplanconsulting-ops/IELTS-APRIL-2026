import { useEffect, useMemo, useRef, useState } from 'react'

export type VocabHighlightItem = {
  word: string
  thaiMeaning: string
  example?: string
}

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const buildVocabHighlightSegments = (text: string, vocab: VocabHighlightItem[]) => {
  const usable = vocab.filter((item) => item.word && text.toLowerCase().includes(item.word.toLowerCase()))
  if (!usable.length) return [{ type: 'text' as const, text }]

  const sorted = [...usable].sort((a, b) => b.word.length - a.word.length)
  const pattern = new RegExp(`(${sorted.map((item) => escapeForRegExp(item.word)).join('|')})`, 'gi')
  const byLowerWord = new Map(usable.map((item) => [item.word.toLowerCase(), item]))

  return text
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => {
      const item = byLowerWord.get(part.toLowerCase())
      return item ? { type: 'vocab' as const, text: part, item } : { type: 'text' as const, text: part }
    })
}

export function VocabHighlightText({
  text,
  vocab,
  savedWords,
  onSave
}: {
  text: string
  vocab: VocabHighlightItem[]
  savedWords?: Set<string>
  onSave?: (item: VocabHighlightItem) => void
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [closingKey, setClosingKey] = useState<string | null>(null)
  const closingTimerRef = useRef<number | null>(null)
  const segments = useMemo(() => buildVocabHighlightSegments(text, vocab), [text, vocab])

  const clearClosingTimer = () => {
    if (closingTimerRef.current != null) {
      window.clearTimeout(closingTimerRef.current)
      closingTimerRef.current = null
    }
  }

  const dismissOpen = () => {
    if (!openKey) return
    const key = openKey
    setOpenKey(null)
    setClosingKey(key)
    clearClosingTimer()
    closingTimerRef.current = window.setTimeout(() => {
      setClosingKey((current) => (current === key ? null : current))
      closingTimerRef.current = null
    }, 220)
  }

  const openOrToggle = (key: string) => {
    if (openKey === key) {
      dismissOpen()
      return
    }
    clearClosingTimer()
    setClosingKey(null)
    setOpenKey(key)
  }

  useEffect(() => () => clearClosingTimer(), [])

  useEffect(() => {
    if (!openKey) return undefined
    const closeIfOutside = (event: Event) => {
      const target = event.target
      if (target instanceof Element && target.closest('.vocabHiWrap')) return
      dismissOpen()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissOpen()
    }
    // Capture phase so any screen tap/click closes even if a child stops bubbling.
    window.addEventListener('pointerdown', closeIfOutside, true)
    window.addEventListener('scroll', closeIfOutside, true)
    window.addEventListener('resize', closeIfOutside)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', closeIfOutside, true)
      window.removeEventListener('scroll', closeIfOutside, true)
      window.removeEventListener('resize', closeIfOutside)
      window.removeEventListener('keydown', onKey)
    }
  }, [openKey])

  return (
    <span className="vocabHiText">
      {segments.map((segment, index) => {
        if (segment.type === 'text') return <span key={index}>{segment.text}</span>
        const key = `${index}-${segment.item.word}`
        const isOpen = openKey === key
        const isClosing = closingKey === key
        const saved = savedWords?.has(segment.item.word)
        return (
          <span key={key} className="vocabHiWrap">
            <mark
              className={`vocabHiMark ${isOpen || isClosing ? 'is-open' : ''}`}
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation()
                openOrToggle(key)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openOrToggle(key)
                }
              }}
            >
              {segment.text}
            </mark>
            {isOpen || isClosing ? (
              <span
                className={`vocabHiPopover ${isClosing ? 'is-leaving' : ''}`}
                role="dialog"
                onAnimationEnd={() => {
                  if (isClosing) setClosingKey((current) => (current === key ? null : current))
                }}
              >
                <span className="vocabHiPopoverWord">{segment.item.word}</span>
                <span className="vocabHiPopoverTh">{segment.item.thaiMeaning}</span>
                {segment.item.example ? <span className="vocabHiPopoverEx">{segment.item.example}</span> : null}
                {onSave ? (
                  <button
                    type="button"
                    className="vocabHiPopoverSave"
                    disabled={saved}
                    onClick={(event) => {
                      event.stopPropagation()
                      onSave(segment.item)
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    {saved ? '✓ บันทึกแล้ว' : '＋ เพิ่มลง Notebook'}
                  </button>
                ) : null}
              </span>
            ) : null}
          </span>
        )
      })}
    </span>
  )
}
