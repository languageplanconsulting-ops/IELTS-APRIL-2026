export type AdminVideoExportFormat = 'mp4' | 'webm'

export type AdminVideoExportSubtitleCue = {
  id: string
  startSeconds: number
  endSeconds: number
  text: string
}

export type AdminVideoExportSubtitleStyle = {
  fontFamily: string
  textColor: string
  backgroundColor: string
  fontSize: number
  boxWidthPercent: number
  verticalPositionPercent: number
  horizontalPositionPercent: number
  textAlign: 'left' | 'center' | 'right'
  videoFlipHorizontal?: boolean
}

export type AdminVideoExportOptions = {
  sourceBlob: Blob
  trimStartSeconds: number
  trimEndSeconds: number
  cues?: AdminVideoExportSubtitleCue[]
  style?: AdminVideoExportSubtitleStyle
  includeSubtitles?: boolean
  format: AdminVideoExportFormat
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

const EXPORT_VIDEO_BITS_PER_SECOND = 2_500_000
const EXPORT_AUDIO_BITS_PER_SECOND = 128_000
const EXPORT_FRAME_RATE = 30

const MP4_MIME_CANDIDATES = ['video/mp4;codecs=h264,aac', 'video/mp4']
const WEBM_MIME_CANDIDATES = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']

const wrapCanvasTextLines = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return []
  const lines: string[] = []
  let line = words[0] || ''
  for (let index = 1; index < words.length; index += 1) {
    const candidate = `${line} ${words[index]}`
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = words[index] || ''
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

const drawRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  rectWidth: number,
  rectHeight: number,
  radius: number
) => {
  const safeRadius = Math.min(radius, rectWidth / 2, rectHeight / 2)
  context.beginPath()
  context.moveTo(x + safeRadius, y)
  context.lineTo(x + rectWidth - safeRadius, y)
  context.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + safeRadius)
  context.lineTo(x + rectWidth, y + rectHeight - safeRadius)
  context.quadraticCurveTo(x + rectWidth, y + rectHeight, x + rectWidth - safeRadius, y + rectHeight)
  context.lineTo(x + safeRadius, y + rectHeight)
  context.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - safeRadius)
  context.lineTo(x, y + safeRadius)
  context.quadraticCurveTo(x, y, x + safeRadius, y)
  context.closePath()
}

const isSubtitleCueVisibleAtTime = (cue: AdminVideoExportSubtitleCue, seconds: number) =>
  Boolean(cue.text.trim()) && seconds >= cue.startSeconds - 0.01 && seconds <= cue.endSeconds + 0.01

const getActiveSubtitleCueAtTime = (cues: AdminVideoExportSubtitleCue[], seconds: number) => {
  const candidates = cues.filter((cue) => isSubtitleCueVisibleAtTime(cue, seconds))
  return candidates.reduce<AdminVideoExportSubtitleCue | null>((bestCue, cue) => {
    if (!bestCue) return cue
    if (cue.startSeconds > bestCue.startSeconds) return cue
    if (cue.startSeconds === bestCue.startSeconds && cue.endSeconds < bestCue.endSeconds) return cue
    return bestCue
  }, null)
}

const drawSubtitleOverlay = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  cue: AdminVideoExportSubtitleCue,
  style: AdminVideoExportSubtitleStyle
) => {
  const centerX = (width * style.horizontalPositionPercent) / 100
  const centerY = (height * style.verticalPositionPercent) / 100
  const boxWidth = (width * style.boxWidthPercent) / 100
  const paddingX = 12
  const paddingY = 8
  const borderRadius = 10
  const fontSize = Math.max(12, style.fontSize)
  const lineHeight = fontSize * 1.25
  const innerWidth = Math.max(40, boxWidth - paddingX * 2)

  context.save()
  context.font = `800 ${fontSize}px ${style.fontFamily || 'Inter, Arial, sans-serif'}`
  const lines = wrapCanvasTextLines(context, cue.text, innerWidth)
  if (!lines.length) {
    context.restore()
    return
  }

  const textBlockHeight = lines.length * lineHeight
  const boxHeight = textBlockHeight + paddingY * 2
  const boxLeft = centerX - boxWidth / 2
  const boxTop = centerY - boxHeight / 2

  context.fillStyle = style.backgroundColor || 'rgba(15, 23, 42, 0.88)'
  drawRoundRect(context, boxLeft, boxTop, boxWidth, boxHeight, borderRadius)
  context.fill()

  context.fillStyle = style.textColor || '#ffffff'
  context.textBaseline = 'top'
  context.shadowColor = 'rgba(0, 0, 0, 0.42)'
  context.shadowBlur = 2
  context.shadowOffsetY = 1

  lines.forEach((line, index) => {
    const lineY = boxTop + paddingY + index * lineHeight
    let lineX = boxLeft + paddingX
    const lineWidth = context.measureText(line).width
    if (style.textAlign === 'center') {
      lineX = boxLeft + (boxWidth - lineWidth) / 2
    } else if (style.textAlign === 'right') {
      lineX = boxLeft + boxWidth - paddingX - lineWidth
    }
    context.fillText(line, lineX, lineY)
  })
  context.restore()
}

export const isAdminVideoExportFormatSupported = (format: AdminVideoExportFormat) =>
  Boolean(getAdminVideoExportMimeType(format))

export const getAdminVideoExportMimeType = (format: AdminVideoExportFormat) => {
  const candidates = format === 'mp4' ? MP4_MIME_CANDIDATES : WEBM_MIME_CANDIDATES
  return candidates.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || ''
}

export const getAdminVideoExportExtension = (format: AdminVideoExportFormat) => (format === 'mp4' ? 'mp4' : 'webm')

export const downloadAdminExportedVideo = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

const waitForVideoEvent = (video: HTMLVideoElement, eventName: keyof HTMLMediaElementEventMap) =>
  new Promise<void>((resolve, reject) => {
    const onSuccess = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(new Error('Could not read the source video for export.'))
    }
    const cleanup = () => {
      video.removeEventListener(eventName, onSuccess)
      video.removeEventListener('error', onError)
    }
    video.addEventListener(eventName, onSuccess, { once: true })
    video.addEventListener('error', onError, { once: true })
  })

type VideoFrameMetadata = {
  mediaTime?: number
}

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: DOMHighResTimeStamp, metadata: VideoFrameMetadata) => void
  ) => number
  cancelVideoFrameCallback?: (handle: number) => void
}

export async function exportEditedSpeakingVideo(options: AdminVideoExportOptions): Promise<Blob> {
  const {
    sourceBlob,
    trimStartSeconds,
    trimEndSeconds,
    cues = [],
    style,
    includeSubtitles = true,
    format,
    onProgress,
    signal
  } = options

  if (typeof MediaRecorder === 'undefined') {
    throw new Error('This browser cannot export video. Try Chrome, Edge, or Safari.')
  }

  const mimeType = getAdminVideoExportMimeType(format)
  if (!mimeType) {
    throw new Error(
      format === 'mp4'
        ? 'MP4 export is not supported in this browser. Try Safari or use WebM export instead.'
        : 'WebM export is not supported in this browser.'
    )
  }

  const trimStart = Math.max(0, Number(trimStartSeconds) || 0)
  const trimEnd = Math.max(trimStart, Number(trimEndSeconds) || 0)
  const exportDuration = trimEnd - trimStart
  if (exportDuration <= 0) {
    throw new Error('Set a valid trim segment before exporting.')
  }

  const subtitleStyle: AdminVideoExportSubtitleStyle = {
    fontFamily: 'Inter, Arial, sans-serif',
    textColor: '#ffffff',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    fontSize: 28,
    boxWidthPercent: 88,
    verticalPositionPercent: 88,
    horizontalPositionPercent: 50,
    textAlign: 'center',
    ...style
  }

  const canvas = document.createElement('canvas')
  const canvasCaptureStream = canvas.captureStream?.bind(canvas)
  if (!canvasCaptureStream) {
    throw new Error('This browser cannot render video for export.')
  }

  const sourceUrl = URL.createObjectURL(sourceBlob)
  const video = document.createElement('video')
  const captureSourceStream =
    (video as HTMLVideoElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream }).captureStream ||
    (video as HTMLVideoElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream })
      .mozCaptureStream

  if (!captureSourceStream) {
    URL.revokeObjectURL(sourceUrl)
    throw new Error('This browser cannot keep audio while exporting. Try Chrome, Edge, or Safari.')
  }

  let animationFrameId = 0
  let videoFrameCallbackId = 0
  let sourceStream: MediaStream | null = null
  let recorder: MediaRecorder | null = null
  let abortHandler: (() => void) | null = null

  const cleanup = () => {
    if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
    const frameVideo = video as VideoWithFrameCallback
    if (videoFrameCallbackId && frameVideo.cancelVideoFrameCallback) {
      frameVideo.cancelVideoFrameCallback(videoFrameCallbackId)
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
    if (signal?.aborted) throw new DOMException('Video export cancelled.', 'AbortError')
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

    const sourceWidth = Math.max(2, video.videoWidth || 640)
    const sourceHeight = Math.max(2, video.videoHeight || 360)
    canvas.width = sourceWidth
    canvas.height = sourceHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not prepare the export canvas.')

    sourceStream = captureSourceStream.call(video)
    const processedStream = canvasCaptureStream(EXPORT_FRAME_RATE)
    sourceStream.getAudioTracks().forEach((track) => processedStream.addTrack(track))

    recorder = new MediaRecorder(processedStream, {
      mimeType,
      videoBitsPerSecond: EXPORT_VIDEO_BITS_PER_SECOND,
      audioBitsPerSecond: EXPORT_AUDIO_BITS_PER_SECOND
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

    const shouldMirror = Boolean(subtitleStyle.videoFlipHorizontal)
    const frameVideo = video as VideoWithFrameCallback
    const drawFrameAtTime = (mediaTime?: number) => {
      throwIfAborted()
      const currentTime = Number.isFinite(Number(mediaTime)) ? Number(mediaTime) : video.currentTime
      context.clearRect(0, 0, sourceWidth, sourceHeight)
      context.save()
      if (shouldMirror) {
        context.translate(sourceWidth, 0)
        context.scale(-1, 1)
      }
      context.drawImage(video, 0, 0, sourceWidth, sourceHeight)
      context.restore()

      if (includeSubtitles && cues.length > 0) {
        const activeCue = getActiveSubtitleCueAtTime(cues, currentTime)
        if (activeCue) drawSubtitleOverlay(context, sourceWidth, sourceHeight, activeCue, subtitleStyle)
      }

      const progress = Math.min(100, Math.max(0, ((currentTime - trimStart) / exportDuration) * 100))
      onProgress?.(progress)

      if (currentTime >= trimEnd - 0.02 || video.ended) {
        video.pause()
        if (recorder && recorder.state !== 'inactive') recorder.stop()
        return false
      }
      return true
    }

    const scheduleDrawFrame = () => {
      if (frameVideo.requestVideoFrameCallback) {
        videoFrameCallbackId = frameVideo.requestVideoFrameCallback((_now, metadata) => {
          videoFrameCallbackId = 0
          if (drawFrameAtTime(metadata.mediaTime)) scheduleDrawFrame()
        })
        return
      }
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = 0
        if (drawFrameAtTime()) scheduleDrawFrame()
      })
    }

    const exportBlob = await new Promise<Blob>((resolve, reject) => {
      if (!recorder) {
        reject(new Error('Could not start video export.'))
        return
      }

      const fail = (error: Error) => {
        if (recorder && recorder.state !== 'inactive') recorder.stop()
        reject(error)
      }

      recorder.onerror = () => fail(new Error('Video export failed while encoding.'))
      recorder.onstop = () => {
        if (signal?.aborted) {
          reject(new DOMException('Video export cancelled.', 'AbortError'))
          return
        }
        const outputType = recorder?.mimeType || mimeType
        resolve(new Blob(chunks, { type: outputType }))
      }

      const maxDuration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : trimEnd
      video.currentTime = Math.min(trimStart, Math.max(0, maxDuration - 0.001))
      void waitForVideoEvent(video, 'seeked')
        .then(() => {
          throwIfAborted()
          drawFrameAtTime(video.currentTime)
          return video.play()
        })
        .then(() => {
          throwIfAborted()
          recorder?.start(1000)
          drawFrameAtTime(video.currentTime)
          scheduleDrawFrame()
        })
        .catch((error) => {
          fail(error instanceof Error ? error : new Error('Could not play the video while exporting.'))
        })
    })

    throwIfAborted()
    if (!exportBlob.size) throw new Error('Export created an empty video file.')
    onProgress?.(100)
    return exportBlob
  } finally {
    cleanup()
  }
}
