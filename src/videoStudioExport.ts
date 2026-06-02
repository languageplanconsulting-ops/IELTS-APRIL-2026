// In-browser MP4 (or WebM) render for the admin Video Studio.
// Plays the source video into a hidden <video>, draws each frame onto a
// canvas with subtitle overlays + zoom transforms, and pipes the result
// through MediaRecorder. No server, no Supabase — output is a Blob you can
// save locally.

import {
  VIDEO_STUDIO_STYLE_MAP,
  VIDEO_STUDIO_ZOOM_SCALES,
  type VideoStudioStyleDefinition
} from './videoStudioStyles'
import type {
  VideoStudioProject,
  VideoStudioSubtitleCue,
  VideoStudioWordTimestamp,
  VideoStudioZoomMarker
} from './AdminVideoStudio'

export type VideoStudioExportFormat = 'mp4' | 'webm'

export type VideoStudioExportOptions = {
  project: VideoStudioProject
  sourceBlob: Blob
  format: VideoStudioExportFormat
  onProgress?: (pct: number) => void
  signal?: AbortSignal
}

const VIDEO_BITS_PER_SECOND = 5_000_000
const AUDIO_BITS_PER_SECOND = 192_000
const FRAME_RATE = 30

const MP4_MIME_CANDIDATES = ['video/mp4;codecs=h264,aac', 'video/mp4']
const WEBM_MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm'
]

const pickSupportedMime = (format: VideoStudioExportFormat) => {
  const candidates = format === 'mp4' ? MP4_MIME_CANDIDATES : WEBM_MIME_CANDIDATES
  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || ''
}

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, metadata: { mediaTime: number }) => void) => number
  cancelVideoFrameCallback?: (id: number) => void
}

const waitForVideoEvent = (video: HTMLVideoElement, type: string) =>
  new Promise<void>((resolve, reject) => {
    const onSettle = () => {
      video.removeEventListener(type, onSettle)
      video.removeEventListener('error', onFail)
      resolve()
    }
    const onFail = () => {
      video.removeEventListener(type, onSettle)
      video.removeEventListener('error', onFail)
      reject(new Error(`Video failed during '${type}'`))
    }
    video.addEventListener(type, onSettle, { once: true })
    video.addEventListener('error', onFail, { once: true })
  })

// ---- Subtitle drawing ----------------------------------------------------

const drawRoundedBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

const parseTransformRotateDeg = (transform?: string): number => {
  if (!transform) return 0
  const match = /rotate\((-?\d+(?:\.\d+)?)deg\)/.exec(transform)
  return match ? Number(match[1]) : 0
}

const parsePadding = (padding: string): { padY: number; padX: number } => {
  const parts = padding
    .replace(/px/g, '')
    .split(/\s+/)
    .map((value) => Number(value) || 0)
  if (parts.length === 1) return { padY: parts[0], padX: parts[0] }
  if (parts.length === 2) return { padY: parts[0], padX: parts[1] }
  return { padY: parts[0], padX: parts[1] }
}

const parseFontSizeRem = (sizeRem: number, canvasHeight: number) => {
  // 1 rem ≈ 16px at default. Scale up with canvas height so 1080p reads bigger.
  // Tune so a 1.4rem renderHint reads ~36px on a 1080-tall canvas.
  return Math.round(sizeRem * 16 * (canvasHeight / 720))
}

const wrapTextLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const tokens = String(text || '').split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  const lines: string[] = []
  let current = tokens[0] || ''
  for (let i = 1; i < tokens.length; i += 1) {
    const candidate = `${current} ${tokens[i]}`
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current)
      current = tokens[i] || ''
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

const findActiveWord = (
  words: VideoStudioWordTimestamp[] | undefined,
  ms: number
): number => {
  if (!words || !words.length) return -1
  return words.findIndex((word) => ms >= word.startMs && ms < word.endMs)
}

const stripVocabBrackets = (text: string) => text.replace(/\[\[(.+?)\]\]/g, '$1')

// Draw one subtitle on the canvas. Supports background pill, padding,
// alignment, tilt, and the three special-case styles (vocab-callout,
// bilingual-stack, word-highlight-4).
const drawCueOverlay = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  cue: VideoStudioSubtitleCue,
  style: VideoStudioStyleDefinition,
  currentTimeMs: number
) => {
  const fontSizePx = parseFontSizeRem(style.renderHint.sizeRem, canvasHeight)
  const fontFamily = style.preview.fontFamily
  const fontWeight = style.preview.fontWeight
  ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`
  ctx.textBaseline = 'middle'

  const maxWidth = canvasWidth * 0.78
  const cleanText = stripVocabBrackets(cue.text || '')
  const lines: Array<{ text: string; words?: Array<{ word: string; isActive: boolean }> }> = []

  if (style.id === 'word-highlight-4' && cue.words?.length) {
    const activeIndex = findActiveWord(cue.words, currentTimeMs)
    const center = activeIndex >= 0 ? activeIndex : 0
    const windowStart = Math.max(0, Math.min(cue.words.length - 4, center - 1))
    const windowEnd = Math.min(cue.words.length, windowStart + 4)
    const visible = cue.words.slice(windowStart, windowEnd)
    lines.push({
      text: visible.map((w) => w.word).join(' '),
      words: visible.map((w, i) => ({
        word: w.word,
        isActive: windowStart + i === activeIndex
      }))
    })
  } else if (style.id === 'bilingual-stack') {
    for (const line of wrapTextLines(ctx, cleanText, maxWidth)) lines.push({ text: line })
    if (cue.translation) {
      const smallFontPx = Math.round(fontSizePx * 0.78)
      ctx.font = `${fontWeight} ${smallFontPx}px ${fontFamily}`
      for (const line of wrapTextLines(ctx, cue.translation, maxWidth)) {
        lines.push({ text: line })
      }
      ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`
    }
  } else {
    for (const line of wrapTextLines(ctx, cleanText, maxWidth)) lines.push({ text: line })
  }

  if (!lines.length) return

  const lineHeight = Math.round(fontSizePx * 1.25)
  const widestLine = Math.max(...lines.map((line) => ctx.measureText(line.text).width))

  const { padY, padX } = parsePadding(style.preview.padding)
  const boxWidth = widestLine + padX * 2
  const boxHeight = lines.length * lineHeight + padY * 2

  // Anchor position on the canvas.
  const anchorX = (style.anchor.xPercent / 100) * canvasWidth
  const anchorY = (style.anchor.yPercent / 100) * canvasHeight
  const align = style.anchor.align
  const boxX = align === 'left' ? anchorX : align === 'right' ? anchorX - boxWidth : anchorX - boxWidth / 2
  const boxY = anchorY - boxHeight / 2

  const tiltDeg = parseTransformRotateDeg(style.preview.transform) || style.renderHint.tiltDeg || 0

  ctx.save()
  if (tiltDeg) {
    ctx.translate(boxX + boxWidth / 2, boxY + boxHeight / 2)
    ctx.rotate((tiltDeg * Math.PI) / 180)
    ctx.translate(-(boxX + boxWidth / 2), -(boxY + boxHeight / 2))
  }

  // Background (if not transparent).
  const bg = style.preview.background
  const radius = Number(String(style.preview.borderRadius).replace(/px/g, '')) || 0
  if (bg && bg !== 'transparent') {
    if (bg.startsWith('linear-gradient')) {
      const gradient = ctx.createLinearGradient(boxX, boxY, boxX + boxWidth, boxY)
      // Naive 2-stop parse for "linear-gradient(90deg, #a 0%, #b 100%)".
      const colorMatches: string[] = bg.match(/#[0-9a-f]{3,8}|rgba?\([^)]+\)/gi) || []
      const c0 = colorMatches[0] || '#000'
      const c1 = colorMatches[1] || colorMatches[0] || '#000'
      gradient.addColorStop(0, c0)
      gradient.addColorStop(1, c1)
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = bg
    }
    drawRoundedBox(ctx, boxX, boxY, boxWidth, boxHeight, radius)
    ctx.fill()
  }

  // Border.
  const borderMatch = /(\d+(?:\.\d+)?)px\s+\w+\s+(#[0-9a-f]{3,8}|rgba?\([^)]+\))/i.exec(
    style.preview.border || ''
  )
  if (borderMatch) {
    ctx.lineWidth = Number(borderMatch[1])
    ctx.strokeStyle = borderMatch[2]
    drawRoundedBox(ctx, boxX, boxY, boxWidth, boxHeight, radius)
    ctx.stroke()
  }

  // Text shadow → use canvas shadow when present.
  if (style.preview.textShadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.85)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2
  }

  ctx.fillStyle = style.preview.color
  ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center'

  lines.forEach((line, lineIndex) => {
    const lineY = boxY + padY + lineIndex * lineHeight + lineHeight / 2
    if (line.words) {
      // Word-highlight-4 path — draw each word with optional yellow box.
      let cursorX =
        align === 'left'
          ? boxX + padX
          : align === 'right'
            ? boxX + boxWidth - padX
            : boxX + boxWidth / 2 - widestLine / 2
      const gapPx = ctx.measureText(' ').width
      line.words.forEach((wordInfo, i) => {
        const wordWidth = ctx.measureText(wordInfo.word).width
        if (wordInfo.isActive) {
          const padHorizontal = 6
          ctx.save()
          ctx.fillStyle = '#facc15'
          drawRoundedBox(
            ctx,
            cursorX - padHorizontal,
            lineY - lineHeight / 2 + 2,
            wordWidth + padHorizontal * 2,
            lineHeight - 4,
            4
          )
          ctx.fill()
          ctx.restore()
          ctx.fillStyle = '#111827'
        } else {
          ctx.fillStyle = style.preview.color
        }
        ctx.textAlign = 'left'
        ctx.fillText(wordInfo.word, cursorX, lineY)
        cursorX += wordWidth + (i < line.words!.length - 1 ? gapPx : 0)
      })
    } else if (style.id === 'vocab-callout') {
      // Highlight the [[bracketed]] word in yellow.
      const bracketMatch = /\[\[(.+?)\]\]/.exec(cue.text)
      const highlight = bracketMatch?.[1]
      if (!highlight) {
        ctx.fillText(line.text, boxX + boxWidth / 2, lineY)
      } else {
        const [before, after] = cue.text.split(bracketMatch[0])
        const beforeWidth = ctx.measureText(before).width
        const highlightWidth = ctx.measureText(highlight).width
        const afterWidth = ctx.measureText(after).width
        const totalWidth = beforeWidth + highlightWidth + afterWidth
        let cursorX = boxX + boxWidth / 2 - totalWidth / 2
        ctx.fillStyle = '#94a3b8'
        ctx.textAlign = 'left'
        ctx.fillText(before, cursorX, lineY)
        cursorX += beforeWidth
        ctx.fillStyle = '#facc15'
        drawRoundedBox(ctx, cursorX - 4, lineY - lineHeight / 2 + 2, highlightWidth + 8, lineHeight - 4, 4)
        ctx.fill()
        ctx.fillStyle = '#111827'
        ctx.fillText(highlight, cursorX, lineY)
        cursorX += highlightWidth
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(after, cursorX, lineY)
      }
    } else {
      ctx.fillText(line.text, boxX + boxWidth / 2, lineY)
    }
  })

  ctx.restore()
}

// ---- Zoom transform per frame --------------------------------------------

const ACTIVE_ZOOM_WINDOW_MS = 4000 // how long after a zoom marker the effect stays

const computeZoomFactor = (zooms: VideoStudioZoomMarker[], currentTimeMs: number): number => {
  if (!zooms.length) return 1
  let factor = 1
  for (const zoom of zooms) {
    if (zoom.atMs > currentTimeMs) break
    const elapsed = currentTimeMs - zoom.atMs
    if (elapsed > ACTIVE_ZOOM_WINDOW_MS) continue
    const target = zoom.kind === 'in' ? VIDEO_STUDIO_ZOOM_SCALES[zoom.level] : 1
    const t = Math.min(1, elapsed / Math.max(1, zoom.durationMs))
    // Ease-out cubic.
    const eased = 1 - Math.pow(1 - t, 3)
    factor = 1 + (target - 1) * eased
  }
  return Math.max(0.5, Math.min(4, factor))
}

// ---- Main entry point ----------------------------------------------------

export async function exportVideoStudioVideo(options: VideoStudioExportOptions): Promise<Blob> {
  const { project, sourceBlob, format, onProgress, signal } = options

  if (typeof MediaRecorder === 'undefined') {
    throw new Error('This browser cannot record video. Try Chrome, Edge, or Safari.')
  }
  const mimeType = pickSupportedMime(format)
  if (!mimeType) {
    throw new Error(
      format === 'mp4'
        ? 'MP4 export is not supported in this browser. Try Safari, or export WebM instead.'
        : 'WebM export is not supported in this browser.'
    )
  }

  const sortedZooms = [...project.zooms].sort((a, b) => a.atMs - b.atMs)
  const sortedCues = [...project.subtitles]
    .filter((cue) => cue.endMs > cue.startMs && cue.text.trim())
    .sort((a, b) => a.startMs - b.startMs)

  const canvas = document.createElement('canvas')
  const canvasCaptureStream = canvas.captureStream?.bind(canvas)
  if (!canvasCaptureStream) {
    throw new Error('This browser cannot render video to canvas.')
  }

  const sourceUrl = URL.createObjectURL(sourceBlob)
  const video = document.createElement('video') as VideoWithFrameCallback
  const captureSourceStream =
    (video as HTMLVideoElement & {
      captureStream?: () => MediaStream
      mozCaptureStream?: () => MediaStream
    }).captureStream ||
    (video as HTMLVideoElement & {
      captureStream?: () => MediaStream
      mozCaptureStream?: () => MediaStream
    }).mozCaptureStream

  if (!captureSourceStream) {
    URL.revokeObjectURL(sourceUrl)
    throw new Error('This browser cannot keep the audio track while exporting. Try Chrome or Safari.')
  }

  let animationFrameId = 0
  let videoFrameCallbackId = 0
  let sourceStream: MediaStream | null = null
  let recorder: MediaRecorder | null = null
  let abortHandler: (() => void) | null = null

  const cleanup = () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (videoFrameCallbackId && video.cancelVideoFrameCallback) {
      video.cancelVideoFrameCallback(videoFrameCallbackId)
    }
    if (abortHandler && signal) signal.removeEventListener('abort', abortHandler)
    if (recorder && recorder.state !== 'inactive') recorder.stop()
    sourceStream?.getTracks().forEach((track) => track.stop())
    video.pause()
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(sourceUrl)
  }

  const throwIfAborted = () => {
    if (signal?.aborted) throw new DOMException('Export cancelled.', 'AbortError')
  }

  try {
    throwIfAborted()
    video.src = sourceUrl
    video.playsInline = true
    video.preload = 'auto'
    video.muted = false
    video.volume = 0
    await waitForVideoEvent(video, 'loadedmetadata')
    throwIfAborted()

    const sourceWidth = Math.max(2, video.videoWidth || 720)
    const sourceHeight = Math.max(2, video.videoHeight || 1280)
    canvas.width = sourceWidth
    canvas.height = sourceHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not prepare the export canvas.')

    const totalDurationSeconds =
      project.source?.durationMs && project.source.durationMs > 0
        ? project.source.durationMs / 1000
        : video.duration || 0

    sourceStream = captureSourceStream.call(video)
    const processedStream = canvasCaptureStream(FRAME_RATE)
    sourceStream.getAudioTracks().forEach((track) => processedStream.addTrack(track))

    recorder = new MediaRecorder(processedStream, {
      mimeType,
      videoBitsPerSecond: VIDEO_BITS_PER_SECOND,
      audioBitsPerSecond: AUDIO_BITS_PER_SECOND
    })
    const chunks: Blob[] = []
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }

    if (signal) {
      abortHandler = () => {
        if (recorder && recorder.state !== 'inactive') recorder.stop()
        video.pause()
      }
      signal.addEventListener('abort', abortHandler)
    }

    const drawFrameAtTime = (mediaTime?: number) => {
      throwIfAborted()
      const currentTime = Number.isFinite(Number(mediaTime)) ? Number(mediaTime) : video.currentTime
      const currentTimeMs = currentTime * 1000

      ctx.clearRect(0, 0, sourceWidth, sourceHeight)

      // Apply zoom transform (centred).
      const zoomFactor = computeZoomFactor(sortedZooms, currentTimeMs)
      if (zoomFactor !== 1) {
        ctx.save()
        ctx.translate(sourceWidth / 2, sourceHeight / 2)
        ctx.scale(zoomFactor, zoomFactor)
        ctx.translate(-sourceWidth / 2, -sourceHeight / 2)
      }
      ctx.drawImage(video, 0, 0, sourceWidth, sourceHeight)
      if (zoomFactor !== 1) ctx.restore()

      // Draw active subtitle (if any). We pick the first cue whose range
      // contains current time — overlapping cues are not supported in this
      // renderer; if you need stacked overlays, sequence them.
      const activeCue = sortedCues.find(
        (cue) => currentTimeMs >= cue.startMs && currentTimeMs < cue.endMs
      )
      if (activeCue) {
        const style = VIDEO_STUDIO_STYLE_MAP[activeCue.styleId] || VIDEO_STUDIO_STYLE_MAP.normal
        drawCueOverlay(ctx, sourceWidth, sourceHeight, activeCue, style, currentTimeMs)
      }

      const pct = totalDurationSeconds > 0 ? (currentTime / totalDurationSeconds) * 100 : 0
      onProgress?.(Math.min(99, Math.max(0, pct)))

      if (video.ended || (totalDurationSeconds > 0 && currentTime >= totalDurationSeconds - 0.02)) {
        video.pause()
        if (recorder && recorder.state !== 'inactive') recorder.stop()
        return false
      }
      return true
    }

    const scheduleDrawFrame = () => {
      if (video.requestVideoFrameCallback) {
        videoFrameCallbackId = video.requestVideoFrameCallback((_now, metadata) => {
          videoFrameCallbackId = 0
          if (drawFrameAtTime(metadata.mediaTime)) scheduleDrawFrame()
        })
        return
      }
      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = 0
        if (drawFrameAtTime()) scheduleDrawFrame()
      })
    }

    const exportBlob = await new Promise<Blob>((resolve, reject) => {
      if (!recorder) {
        reject(new Error('Could not start the recorder.'))
        return
      }
      const fail = (error: Error) => {
        if (recorder && recorder.state !== 'inactive') recorder.stop()
        reject(error)
      }
      recorder.onerror = () => fail(new Error('Video export failed while encoding.'))
      recorder.onstop = () => {
        if (signal?.aborted) {
          reject(new DOMException('Export cancelled.', 'AbortError'))
          return
        }
        resolve(new Blob(chunks, { type: recorder?.mimeType || mimeType }))
      }

      video.currentTime = 0
      void waitForVideoEvent(video, 'seeked')
        .then(() => {
          throwIfAborted()
          drawFrameAtTime(0)
          return video.play()
        })
        .then(() => {
          throwIfAborted()
          recorder?.start(1000)
          drawFrameAtTime(video.currentTime)
          scheduleDrawFrame()
        })
        .catch((error) => {
          fail(error instanceof Error ? error : new Error('Could not start playback for export.'))
        })
    })

    throwIfAborted()
    if (!exportBlob.size) throw new Error('Export produced an empty file.')
    onProgress?.(100)
    return exportBlob
  } finally {
    cleanup()
  }
}
