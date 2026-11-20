import type { ReactNode } from 'react'

export type PastelPhrase = {
  text: string
  /** CSS class for the <mark>, e.g. "pp-q" (question words) or "pp-p" (passage words). */
  className: string
}

/**
 * Wrap the first occurrence of each phrase in `text` with a pastel <mark>.
 * Phrases may be joined with " ... " / "…" (two short spans) — each part is marked.
 * Overlapping matches are skipped so the sentence always reads cleanly.
 */
export const highlightPhrasesInText = (text: string, phrases: PastelPhrase[]): ReactNode => {
  const source = String(text || '')
  if (!source) return source
  const lower = source.toLowerCase()
  const ranges: Array<{ start: number; end: number; className: string }> = []
  for (const phrase of phrases) {
    const parts = String(phrase.text || '')
      .split(/\s*\.\.\.\s*|\s*…\s*/)
      .map((part) => part.trim().replace(/^["“'‘]+|["”'’]+$/g, ''))
      .filter((part) => part.length >= 2)
    for (const part of parts) {
      const start = lower.indexOf(part.toLowerCase())
      if (start === -1) continue
      const end = start + part.length
      if (ranges.some((range) => start < range.end && end > range.start)) continue
      ranges.push({ start, end, className: phrase.className })
    }
  }
  if (!ranges.length) return source
  ranges.sort((first, second) => first.start - second.start)
  const out: ReactNode[] = []
  let cursor = 0
  ranges.forEach((range, index) => {
    if (range.start > cursor) out.push(source.slice(cursor, range.start))
    out.push(
      <mark key={`pp-${index}-${range.start}`} className={`ppMark ${range.className}`}>
        {source.slice(range.start, range.end)}
      </mark>
    )
    cursor = range.end
  })
  if (cursor < source.length) out.push(source.slice(cursor))
  return out
}
