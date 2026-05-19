import {
  buildListeningHighlightCandidates,
  getListeningEvidenceOverlapRatio,
  normalizeListeningHighlightText
} from './listeningHighlightMatch'

export type ListeningScriptSegment = {
  id: string
  speaker: string | null
  text: string
}

const SPEAKER_LINE = /^([A-Z][A-Z0-9\s]{0,22}):\s*(.*)$/

const splitLongTextIntoChunks = (text: string, maxChars = 220): ListeningScriptSegment[] => {
  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean)
  if (sentences.length <= 1) {
    return [{ id: 'seg-0', speaker: null, text }]
  }

  const segments: ListeningScriptSegment[] = []
  let buffer = ''

  for (const sentence of sentences) {
    const next = buffer ? `${buffer} ${sentence}` : sentence
    if (next.length > maxChars && buffer) {
      segments.push({
        id: `seg-${segments.length}`,
        speaker: null,
        text: buffer.trim()
      })
      buffer = sentence
    } else {
      buffer = next
    }
  }

  if (buffer.trim()) {
    segments.push({
      id: `seg-${segments.length}`,
      speaker: null,
      text: buffer.trim()
    })
  }

  return segments.length > 0 ? segments : [{ id: 'seg-0', speaker: null, text }]
}

export const parseListeningScriptSegments = (passage: string): ListeningScriptSegment[] => {
  const normalized = passage.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean)
  const segments: ListeningScriptSegment[] = []

  for (const line of lines) {
    const match = line.match(SPEAKER_LINE)
    if (match) {
      segments.push({
        id: `seg-${segments.length}`,
        speaker: match[1].trim(),
        text: match[2].trim()
      })
      continue
    }

    if (segments.length > 0) {
      const last = segments[segments.length - 1]
      last.text = `${last.text} ${line}`.trim()
    } else {
      segments.push({ id: 'seg-0', speaker: null, text: line })
    }
  }

  if (segments.length === 0) {
    return splitLongTextIntoChunks(normalized)
  }

  if (segments.length === 1 && segments[0].text.length > 320) {
    return splitLongTextIntoChunks(segments[0].text).map((segment, index) => ({
      ...segment,
      id: `seg-${index}`,
      speaker: segments[0].speaker
    }))
  }

  return segments.map((segment, index) =>
    segment.text.length > 360
      ? splitLongTextIntoChunks(segment.text).map((chunk, chunkIndex) => ({
          ...chunk,
          id: `seg-${index}-${chunkIndex}`,
          speaker: segment.speaker
        }))
      : [segment]
  ).flat()
}

export const findListeningScriptChunkForText = (
  segments: ListeningScriptSegment[],
  needle: string
): number => {
  if (!needle.trim() || segments.length === 0) return 0
  const lower = needle.toLowerCase()
  const index = segments.findIndex((segment) => segment.text.toLowerCase().includes(lower))
  return index >= 0 ? index : 0
}

export const getListeningSpeakerTone = (speaker: string | null): string => {
  if (!speaker) return 'neutral'
  const key = speaker.toLowerCase().replace(/\s+/g, '-')
  if (key.includes('interview') || key.includes('narrator') || key.includes('presenter')) return 'host'
  if (key.includes('alice') || key.includes('joy') || key.includes('mia') || key.includes('lily') || key.includes('maya')) return 'a'
  if (key.includes('rob') || key.includes('david') || key.includes('dexter') || key.includes('mike') || key.includes('leo')) return 'b'
  return 'neutral'
}

const splitTextIntoSentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?…])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

const buildEvidencePieces = (evidence: string): string[] =>
  evidence
    .split(/\s*(?:\.{2,}|…)\s*/)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length >= 3)

const buildCandidateWindows = (candidate: string): string[] => {
  const words = candidate.split(/\s+/).filter(Boolean)
  if (words.length < 4) return []

  const windows: string[] = []
  for (let size = Math.min(7, words.length); size >= 4; size -= 1) {
    for (let start = 0; start <= words.length - size; start += 1) {
      windows.push(words.slice(start, start + size).join(' '))
    }
  }
  return windows
}

const findEvidenceSentenceIndex = (sentences: string[], evidence: string): number => {
  const normalizedSentences = sentences.map((sentence) => normalizeListeningHighlightText(sentence))
  const candidates = buildListeningHighlightCandidates(evidence)
  const directCandidates = [
    ...candidates,
    ...buildEvidencePieces(evidence).flatMap((piece) => buildListeningHighlightCandidates(piece))
  ].filter(Boolean)

  for (const candidate of directCandidates) {
    const exactIndex = normalizedSentences.findIndex((sentence) => sentence.includes(candidate))
    if (exactIndex >= 0) return exactIndex
  }

  for (const candidate of directCandidates) {
    for (const window of buildCandidateWindows(candidate)) {
      const windowIndex = normalizedSentences.findIndex((sentence) => sentence.includes(window))
      if (windowIndex >= 0) return windowIndex
    }
  }

  let bestIndex = -1
  let bestRatio = 0
  sentences.forEach((sentence, index) => {
    const ratio = getListeningEvidenceOverlapRatio(sentence, evidence)
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestIndex = index
    }
  })

  return bestRatio >= 0.35 ? bestIndex : -1
}

/** Contextual passage excerpt: 2 sentences before evidence and 1 sentence after when possible. */
export const buildListeningPassageExcerpt = (
  passage: string,
  evidence: string,
  ratio = 0.5
): string => {
  const text = passage.replace(/\s+/g, ' ').trim()
  if (!text) return ''

  const needle = evidence.trim()
  if (needle) {
    const sentences = splitTextIntoSentences(text)
    const sentenceIndex = findEvidenceSentenceIndex(sentences, needle)
    if (sentenceIndex >= 0) {
      if (sentences.length > 1) {
        const startSentence = Math.max(0, sentenceIndex - 2)
        const endSentence = Math.min(sentences.length, sentenceIndex + 2)
        const excerpt = sentences.slice(startSentence, endSentence).join(' ')
        const prefix = startSentence > 0 ? '…' : ''
        const suffix = endSentence < sentences.length ? '…' : ''
        return `${prefix}${excerpt}${suffix}`
      }

      return text
    }

    const lower = text.toLowerCase()
    const idx = lower.indexOf(needle.toLowerCase())
    if (idx >= 0) {
      const targetLength = Math.max(480, Math.floor(text.length * ratio))
      const half = Math.floor(targetLength / 2)
      const start = Math.max(0, idx - half)
      const end = Math.min(text.length, start + targetLength)
      const adjustedStart = Math.max(0, end - targetLength)
      const slice = text.slice(adjustedStart, end).trim()
      const prefix = adjustedStart > 0 ? '…' : ''
      const suffix = end < text.length ? '…' : ''
      return `${prefix}${slice}${suffix}`
    }
  }

  const targetLength = Math.max(480, Math.floor(text.length * ratio))
  if (text.length <= targetLength) return text

  return `${text.slice(0, targetLength).trim()}…`
}

export const listeningScriptHasDialogue = (segments: ListeningScriptSegment[]): boolean =>
  segments.some((segment) => Boolean(segment.speaker?.trim()))
