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

const WHISPER_SAMPLE_RATE = 16000
const WHISPER_BASE_OPTIONS = {
  chunk_length_s: 28,
  stride_length_s: 4,
  language: 'english',
  task: 'transcribe',
  sampling_rate: WHISPER_SAMPLE_RATE
} as const

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

const measureAudioRms = (samples: Float32Array) => {
  if (!samples.length) return 0
  let sum = 0
  for (let index = 0; index < samples.length; index += 1) {
    sum += samples[index] * samples[index]
  }
  return Math.sqrt(sum / samples.length)
}

const mixToMono = (buffer: AudioBuffer): Float32Array => {
  if (buffer.numberOfChannels <= 1) {
    return new Float32Array(buffer.getChannelData(0))
  }
  const left = buffer.getChannelData(0)
  const right = buffer.getChannelData(1)
  const mono = new Float32Array(left.length)
  const scale = Math.sqrt(2)
  for (let index = 0; index < left.length; index += 1) {
    mono[index] = (scale * (left[index] + right[index])) / 2
  }
  return mono
}

const resampleTo16k = (samples: Float32Array, inputRate: number) => {
  if (!samples.length || inputRate === WHISPER_SAMPLE_RATE) return samples
  const outputLength = Math.max(1, Math.ceil(samples.length * (WHISPER_SAMPLE_RATE / inputRate)))
  const output = new Float32Array(outputLength)
  const ratio = inputRate / WHISPER_SAMPLE_RATE
  for (let index = 0; index < outputLength; index += 1) {
    const position = index * ratio
    const baseIndex = Math.floor(position)
    const fraction = position - baseIndex
    const current = samples[baseIndex] || 0
    const next = samples[baseIndex + 1] ?? current
    output[index] = current + (next - current) * fraction
  }
  return output
}

const trimAudioSamples = (samples: Float32Array, trimStartSeconds: number, trimEndSeconds: number) => {
  const startIndex = Math.max(0, Math.floor(trimStartSeconds * WHISPER_SAMPLE_RATE))
  const endIndex =
    trimEndSeconds > trimStartSeconds
      ? Math.min(samples.length, Math.ceil(trimEndSeconds * WHISPER_SAMPLE_RATE))
      : samples.length
  if (startIndex <= 0 && endIndex >= samples.length) return samples
  return samples.slice(startIndex, Math.max(startIndex + 1, endIndex))
}

const normalizeAudioForWhisper = (samples: Float32Array, targetRms = 0.08) => {
  const rms = measureAudioRms(samples)
  if (rms <= 0) return samples
  const gain = Math.min(24, targetRms / rms)
  if (gain <= 1.05) return samples
  const normalized = new Float32Array(samples.length)
  for (let index = 0; index < samples.length; index += 1) {
    normalized[index] = Math.max(-1, Math.min(1, samples[index] * gain))
  }
  return normalized
}

const waitForVideoMetadata = (video: HTMLVideoElement) =>
  new Promise<void>((resolve, reject) => {
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      resolve()
      return
    }
    video.onloadedmetadata = () => resolve()
    video.onerror = () =>
      reject(new Error('Could not load your recording. Reload the video or record again, then sync subtitles.'))
  })

const waitForVideoSeek = (video: HTMLVideoElement) =>
  new Promise<void>((resolve) => {
    video.onseeked = () => resolve()
  })

/**
 * WebM/MP4 recordings from MediaRecorder are video containers. decodeAudioData()
 * often fails or returns silence on those files, so we render the audio track
 * through a hidden video element instead.
 */
const extractMonoAudioFromVideoBlob = async (
  blob: Blob,
  trimStartSeconds: number,
  trimEndSeconds: number
): Promise<Float32Array> => {
  const video = document.createElement('video')
  video.preload = 'auto'
  video.playsInline = true
  video.muted = false
  video.crossOrigin = 'anonymous'
  const objectUrl = URL.createObjectURL(blob)
  video.src = objectUrl

  try {
    await waitForVideoMetadata(video)
    const totalDuration = Number.isFinite(video.duration) ? video.duration : 0
    if (totalDuration <= 0) {
      throw new Error('Your recording has no playable duration. Re-record the clip and sync again.')
    }

    const trimStart = Math.min(Math.max(0, trimStartSeconds), Math.max(0, totalDuration - 0.05))
    const trimEnd =
      trimEndSeconds > trimStart ? Math.min(trimEndSeconds, totalDuration) : totalDuration
    const segmentDuration = Math.max(0.05, trimEnd - trimStart)
    const frameCount = Math.max(1, Math.ceil(segmentDuration * WHISPER_SAMPLE_RATE))

    video.currentTime = trimStart
    await waitForVideoSeek(video)

    const offline = new OfflineAudioContext(1, frameCount, WHISPER_SAMPLE_RATE)
    const source = (offline as unknown as AudioContext).createMediaElementSource(video)
    source.connect(offline.destination)

    const renderedPromise = offline.startRendering()
    await video.play()
    const rendered = await renderedPromise
    video.pause()

    return mixToMono(rendered)
  } finally {
    video.pause()
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(objectUrl)
  }
}

const decodeAudioBlobDirect = async (blob: Blob): Promise<Float32Array | null> => {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextConstructor) return null

  const context = new AudioContextConstructor()
  try {
    const decoded = await context.decodeAudioData((await blob.arrayBuffer()).slice(0))
    const mono = mixToMono(decoded)
    return resampleTo16k(mono, decoded.sampleRate)
  } catch {
    return null
  } finally {
    await context.close().catch(() => undefined)
  }
}

const prepareWhisperAudio = async (
  videoBlob: Blob,
  trimStartSeconds: number,
  trimEndSeconds: number,
  onProgress?: (message: string) => void
): Promise<Float32Array> => {
  onProgress?.('Extracting audio from your recording…')

  const isLikelyVideo = /^video\//i.test(videoBlob.type) || videoBlob.type.includes('webm')
  let samples: Float32Array | null = null

  if (isLikelyVideo) {
    try {
      samples = await extractMonoAudioFromVideoBlob(videoBlob, trimStartSeconds, trimEndSeconds)
    } catch (error) {
      const fallback = await decodeAudioBlobDirect(videoBlob)
      if (fallback?.length) {
        samples = trimAudioSamples(fallback, trimStartSeconds, trimEndSeconds)
      } else {
        throw error
      }
    }
  } else {
    samples = await decodeAudioBlobDirect(videoBlob)
    if (samples?.length) {
      samples = trimAudioSamples(samples, trimStartSeconds, trimEndSeconds)
    }
  }

  if (!samples?.length) {
    throw new Error(
      'Could not read audio from this recording. Check that your microphone is selected in Setup, record again, then sync subtitles.'
    )
  }

  const rms = measureAudioRms(samples)
  if (rms < 0.00035) {
    throw new Error(
      'This recording has no usable audio track. Select the correct microphone in Setup before recording, then try Auto-sync again.'
    )
  }

  if (rms < 0.02) {
    onProgress?.('Boosting quiet audio before transcription…')
    samples = normalizeAudioForWhisper(samples)
  }

  return samples
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
  const absoluteWords = words.map((item) => ({
    ...item,
    start: item.start + trimStartSeconds,
    end: item.end + trimStartSeconds
  }))
  const usableWords = absoluteWords
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
  const audioSamples = await prepareWhisperAudio(videoBlob, trimStartSeconds, trimEndSeconds, onProgress)

  try {
    onProgress?.('Matching subtitles to your voice (runs on your device, no API cost)…')
    const runTranscriber = transcriber as (
      input: Float32Array,
      options?: Record<string, unknown>
    ) => Promise<{ text?: string; chunks?: Array<{ text?: string; timestamp?: [number, number | null] }> }>
    let output = await runTranscriber(audioSamples, {
      ...WHISPER_BASE_OPTIONS,
      return_timestamps: 'word'
    })

    let transcript = String((output as { text?: string })?.text || '').trim()
    let words = mapWhisperWords(output)
    if (!transcript) {
      onProgress?.('Retrying local transcription with a simpler Whisper pass…')
      output = await runTranscriber(audioSamples, WHISPER_BASE_OPTIONS)
      transcript = String((output as { text?: string })?.text || '').trim()
      words = mapWhisperWords(output)
    }
    if (!transcript) {
      throw new Error(
        'Speech was found in the recording, but the browser speech model could not decode it clearly.'
      )
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
  } catch (error) {
    if (error instanceof Error && /speech was found/i.test(error.message)) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Local subtitle sync failed.'
    throw new Error(message)
  }
}
