import { useEffect, useMemo, useState } from 'react'

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
  const segments = useMemo(() => buildVocabHighlightSegments(text, vocab), [text, vocab])

  useEffect(() => {
    if (!openKey) return undefined
    const closeIfOutside = (event: Event) => {
      const target = event.target
      if (target instanceof Element && target.closest('.vocabHiWrap')) return
      setOpenKey(null)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenKey(null)
    }
    window.addEventListener('mousedown', closeIfOutside)
    window.addEventListener('scroll', closeIfOutside, true)
    window.addEventListener('resize', closeIfOutside)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', closeIfOutside)
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
        const saved = savedWords?.has(segment.item.word)
        return (
          <span key={key} className="vocabHiWrap">
            <mark
              className={`vocabHiMark ${isOpen ? 'is-open' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setOpenKey((current) => (current === key ? null : key))}
            >
              {segment.text}
            </mark>
            {isOpen ? (
              <span className="vocabHiPopover" role="dialog">
                <span className="vocabHiPopoverWord">{segment.item.word}</span>
                <span className="vocabHiPopoverTh">{segment.item.thaiMeaning}</span>
                {segment.item.example ? <span className="vocabHiPopoverEx">{segment.item.example}</span> : null}
                {onSave ? (
                  <button
                    type="button"
                    className="vocabHiPopoverSave"
                    disabled={saved}
                    onClick={() => onSave(segment.item)}
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
