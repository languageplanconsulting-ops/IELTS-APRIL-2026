export type ListeningScriptSegment = {
  id: string
  speaker: string | null
  text: string
}

const SPEAKER_LINE = /^([A-Z][A-Z0-9\s]{0,22}):\s*(.*)$/

const splitLongTextIntoChunks = (text: string, maxChars = 220): ListeningScriptSegment[] => {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
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
  if (key.includes('alice') || key.includes('joy') || key.includes('mia')) return 'a'
  if (key.includes('rob') || key.includes('david') || key.includes('dexter') || key.includes('mike')) return 'b'
  return 'neutral'
}
