/**
 * Free, in-browser speech-to-text for admin speaking sample videos.
 * Uses Whisper via @xenova/transformers — no Deepgram/Gemini API calls.
 */

import { env, pipeline } from '@xenova/transformers'

export type LocalTimedWord = {
  word: string
  start: number
  end: number
  confidence: number
}

export type LocalSubtitleCue = {
  id: string
  startSeconds: number
  endSeconds: number
  text: string
  confidence?: number
}

export type LocalTranscriptionResult = {
  transcript: string
  words: LocalTimedWord[]
  subtitles: LocalSubtitleCue[]
}

const roundSeconds = (seconds: number) =>
  Number((Number.isFinite(Number(seconds)) ? Number(seconds) : 0).toFixed(3))

let transcriberPromise: ReturnType<typeof pipeline> | null = null

const ensureTranscriber = async (onProgress?: (message: string) => void) => {
  if (!transcriberPromise) {
    onProgress?.('Loading free speech model (first use downloads ~40 MB, then cached in your browser)…')
    env.allowLocalModels = false
    transcriberPromise = pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
      quantized: true,
      progress_callback: (progress: { status?: string; progress?: number; file?: string }) => {
        if (progress.status === 'progress' && typeof progress.progress === 'number') {
          onProgress?.(`Downloading speech model… ${Math.round(progress.progress)}%`)
        }
      }
    } as Record<string, unknown>)
  }
  return transcriberPromise
}

const mapWhisperWords = (output: unknown): LocalTimedWord[] => {
  const payload = output as {
    text?: string
    chunks?: Array<{ text?: string; timestamp?: [number, number | null] }>
  }
  const chunks = Array.isArray(payload?.chunks) ? payload.chunks : []
  const words: LocalTimedWord[] = []

  for (const chunk of chunks) {
    const text = String(chunk?.text || '').trim()
    if (!text) continue
    const timestamp = chunk.timestamp
    const start = Array.isArray(timestamp) ? Math.max(0, Number(timestamp[0] || 0)) : 0
    const end = Array.isArray(timestamp)
      ? Math.max(start + 0.08, Number(timestamp[1] ?? start + 0.25))
      : start + 0.25
    words.push({
      word: text,
      start,
      end,
      confidence: 0.82
    })
  }

  return words
}

export const buildLocalSubtitlesFromWords = ({
  words = [],
  transcript = '',
  trimStartSeconds = 0,
  trimEndSeconds = 0
}: {
  words?: LocalTimedWord[]
  transcript?: string
  trimStartSeconds?: number
  trimEndSeconds?: number
}): LocalSubtitleCue[] => {
  const hasTrimRange = trimEndSeconds > trimStartSeconds
  const usableWords = words
    .filter((item) => item.word)
    .filter((item) => !hasTrimRange || (item.end >= trimStartSeconds && item.start <= trimEndSeconds))
    .map((item) => ({
      ...item,
      start: hasTrimRange ? Math.max(trimStartSeconds, item.start) : item.start,
      end: hasTrimRange ? Math.min(trimEndSeconds, Math.max(item.end, item.start)) : item.end
    }))
    .filter((item) => item.end > item.start)

  if (!usableWords.length) {
    const rawWords = String(transcript || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const duration = Math.max(
      6,
      (trimEndSeconds > trimStartSeconds ? trimEndSeconds - trimStartSeconds : rawWords.length / 2.4) || 6
    )
    const chunks: string[] = []
    for (let index = 0; index < rawWords.length; index += 4) {
      chunks.push(rawWords.slice(index, index + 4).join(' '))
    }
    const cueDuration = duration / Math.max(1, chunks.length)
    return chunks.map((text, index) => ({
      id: `cue-${index + 1}`,
      startSeconds: roundSeconds(trimStartSeconds + index * cueDuration),
      endSeconds: roundSeconds(trimStartSeconds + Math.min(duration, (index + 1) * cueDuration)),
      text,
      confidence: 0.6
    }))
  }

  const cues: LocalSubtitleCue[] = []
  let currentWords: string[] = []
  let currentStart = usableWords[0].start

  usableWords.forEach((word, index) => {
    const previous = usableWords[index - 1]
    const gap = previous ? word.start - previous.end : 0
    const currentDuration = Math.max(0, (previous?.end || word.end) - currentStart)
    const textIfAdded = [...currentWords, word.word].join(' ')
    const shouldBreak =
      currentWords.length >= 3 ||
      currentDuration >= 1.25 ||
      gap > 0.38 ||
      /[.!?]$/.test(previous?.word || '') ||
      textIfAdded.length > 26

    if (currentWords.length && shouldBreak) {
      const cueWords = usableWords.slice(index - currentWords.length, index)
      const confidence =
        cueWords.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, cueWords.length)
      const cueEnd = Math.max(currentStart + 0.16, previous?.end || word.start)
      cues.push({
        id: `cue-${cues.length + 1}`,
        startSeconds: roundSeconds(Math.max(0, currentStart - 0.035)),
        endSeconds: roundSeconds(cueEnd + 0.045),
        text: currentWords.join(' '),
        confidence: Number(confidence.toFixed(2))
      })
      currentWords = []
      currentStart = word.start
    }
    currentWords.push(word.word)
  })

  if (currentWords.length) {
    const cueWords = usableWords.slice(-currentWords.length)
    const confidence =
      cueWords.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, cueWords.length)
    const cueEnd = Math.max(currentStart + 0.16, cueWords[cueWords.length - 1]?.end || currentStart + 0.45)
    cues.push({
      id: `cue-${cues.length + 1}`,
      startSeconds: roundSeconds(Math.max(0, currentStart - 0.035)),
      endSeconds: roundSeconds(cueEnd + 0.045),
      text: currentWords.join(' '),
      confidence: Number(confidence.toFixed(2))
    })
  }

  const boundedTrimEnd = Number(trimEndSeconds || 0)
  return cues.map((cue) => ({
    ...cue,
    endSeconds: roundSeconds(
      boundedTrimEnd > 0
        ? Math.min(boundedTrimEnd, Math.max(cue.startSeconds + 0.12, cue.endSeconds))
        : cue.endSeconds
    )
  }))
}

export const transcribeRecordingLocally = async (
  videoBlob: Blob,
  options?: {
    trimStartSeconds?: number
    trimEndSeconds?: number
    onProgress?: (message: string) => void
  }
): Promise<LocalTranscriptionResult> => {
  const onProgress = options?.onProgress
  const trimStartSeconds = Math.max(0, Number(options?.trimStartSeconds || 0) || 0)
  const trimEndSeconds = Math.max(trimStartSeconds, Number(options?.trimEndSeconds || 0) || 0)

  onProgress?.('Preparing your recording for free local transcription…')
  const transcriber = await ensureTranscriber(onProgress)
  const audioUrl = URL.createObjectURL(videoBlob)

  try {
    onProgress?.('Matching subtitles to your voice (runs on your device, no API cost)…')
    const runTranscriber = transcriber as (
      input: string,
      options?: Record<string, unknown>
    ) => Promise<{ text?: string; chunks?: Array<{ text?: string; timestamp?: [number, number | null] }> }>
    const output = await runTranscriber(audioUrl, {
      return_timestamps: 'word',
      chunk_length_s: 28,
      stride_length_s: 4,
      language: 'english',
      task: 'transcribe'
    })

    const transcript = String((output as { text?: string })?.text || '').trim()
    const words = mapWhisperWords(output)
    if (!transcript) {
      throw new Error('Local transcription could not detect any speech. Try speaking closer to the mic and sync again.')
    }

    const subtitles = buildLocalSubtitlesFromWords({
      words,
      transcript,
      trimStartSeconds,
      trimEndSeconds
    })

    if (!subtitles.length) {
      throw new Error('Local transcription finished but no subtitle lines were created.')
    }

    return { transcript, words, subtitles }
  } finally {
    URL.revokeObjectURL(audioUrl)
  }
}
