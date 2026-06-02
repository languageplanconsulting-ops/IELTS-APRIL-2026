import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_VIDEO_STUDIO_STYLE,
  VIDEO_STUDIO_CAMERA_PANS,
  VIDEO_STUDIO_SFX,
  VIDEO_STUDIO_STYLES,
  VIDEO_STUDIO_STYLE_MAP,
  VIDEO_STUDIO_TEXT_ANIMATIONS,
  VIDEO_STUDIO_TRANSITIONS,
  VIDEO_STUDIO_ZOOM_SCALES,
  type VideoStudioCameraPanKind,
  type VideoStudioExportQuality,
  type VideoStudioSfxKind,
  type VideoStudioStyleId,
  type VideoStudioTextAnimation,
  type VideoStudioTransitionKind,
  type VideoStudioZoomLevel
} from './videoStudioStyles'

const STORAGE_KEY = 'admin-video-studio-project:v1'
const AUTOSAVE_DEBOUNCE_MS = 1500
const SCHEMA_VERSION = 'video-studio/1.0'

export type VideoStudioSubtitleCue = {
  id: string
  startMs: number
  endMs: number
  text: string
  translation?: string
  styleId: VideoStudioStyleId
  animationIn?: VideoStudioTextAnimation
  animationOut?: VideoStudioTextAnimation
}

export type VideoStudioZoomMarker = {
  id: string
  atMs: number
  level: VideoStudioZoomLevel
  kind: 'in' | 'out'
  durationMs: number
}

export type VideoStudioTransitionMarker = {
  id: string
  atMs: number
  kind: VideoStudioTransitionKind
  durationMs: number
}

export type VideoStudioSfxMarker = {
  id: string
  atMs: number
  kind: VideoStudioSfxKind
  volume: number
  pairedTransitionId?: string
}

export type VideoStudioCameraPanMarker = {
  id: string
  atMs: number
  kind: VideoStudioCameraPanKind
  durationMs: number
}

export type VideoStudioProject = {
  schemaVersion: typeof SCHEMA_VERSION
  id: string
  title: string
  spokenLanguage: 'th' | 'en'
  translationLanguage?: 'th' | 'en' | null
  source: {
    fileName: string
    sizeBytes: number
    durationMs: number
    aspectRatio: string
    mimeType: string
  } | null
  subtitles: VideoStudioSubtitleCue[]
  zooms: VideoStudioZoomMarker[]
  transitions: VideoStudioTransitionMarker[]
  soundEffects: VideoStudioSfxMarker[]
  cameraPans: VideoStudioCameraPanMarker[]
  exportQuality: VideoStudioExportQuality
  createdAt: string
  updatedAt: string
}

const newId = (prefix: string) =>
  `${prefix}_${Math.floor(performance.now() * 1000).toString(36)}_${Math.floor((performance.now() % 1) * 1e9).toString(36)}`

// ---- Export manifest builder ----------------------------------------------

const buildAiPrompt = (project: VideoStudioProject) => `You are rendering a short-form social video from this JSON edit deck.

Source video: ${project.source?.fileName || '(unknown)'}, ${project.source?.aspectRatio || '?'} aspect, ${project.source?.durationMs ?? 0} ms total. Keep the original audio track intact.

Apply every cue in 'subtitles' on screen between its startMs and endMs. The 'style' object on each cue is fully self-contained — it tells you the font family, weight, size hint (renderHint.sizeRem), fill color, optional stroke/background, tilt angle, anchor position (anchor.xPercent/yPercent — measured from top-left of the frame, with anchor.align controlling horizontal alignment about that point), and the entry/exit animations. Use the cue's own animationIn/animationOut when present; otherwise fall back to style.renderHint.animationIn / animationOut. For style 'bilingual-stack', stack the subtitle text on top and the 'translation' field below at ~80% size. For style 'vocab-callout', find a word wrapped in [[double brackets]] in the text — render that word highlighted (yellow #facc15 background, dark text, larger, bold) while the surrounding line is dimmed (#94a3b8). Strip the brackets before rendering.

Apply each 'zooms' marker at atMs: smoothly scale the video to the level's scaleFactor (kind='in') or back to 1× (kind='out') over durationMs, easing in-out. Centre on the most prominent face in frame at that moment unless otherwise instructed. The level→scale mapping: ${JSON.stringify(VIDEO_STUDIO_ZOOM_SCALES)}.

Apply each 'transitions' marker at atMs: cut/fade/whip-pan/book-flip with the given durationMs. 'cut' means an instant change; 'fade' is a crossfade; 'whip-pan' is a fast horizontal motion blur; 'book-flip' is a 3D page-turn.

Apply each 'soundEffects' marker at atMs: trigger the named SFX (kind = book-flip | whoosh | swoosh | ding | impact) at the given volume (0–1). When 'pairedTransitionId' is present, sync the SFX onset to the centre of that transition. Duck the underlying audio by ~6 dB during the SFX if renderHints.audio.duckUnderSfx is true.

Apply each 'cameraPans' marker at atMs: pan the framed crop left/right/up/down or orbit cw/ccw over durationMs while keeping the subject roughly centred.

Render the final at renderHints.exportQuality (720p / 1080p / 4k). Preserve the source aspect ratio. Do not add any captions, watermarks, or content not listed in this manifest.`

// SRT timestamp format: HH:MM:SS,mmm
const formatSrtTimestamp = (ms: number) => {
  const safe = Math.max(0, Math.round(ms))
  const totalSeconds = Math.floor(safe / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const millis = safe % 1000
  return (
    `${hours.toString().padStart(2, '0')}:` +
    `${minutes.toString().padStart(2, '0')}:` +
    `${seconds.toString().padStart(2, '0')},` +
    `${millis.toString().padStart(3, '0')}`
  )
}

// Strip [[brackets]] used by the vocab-callout style; SRT consumers don't
// know about that markup.
const stripVocabBrackets = (text: string) => text.replace(/\[\[(.+?)\]\]/g, '$1')

export const buildVideoStudioSrt = (project: VideoStudioProject) => {
  const cues = [...project.subtitles]
    .filter((cue) => cue.endMs > cue.startMs && cue.text.trim())
    .sort((a, b) => a.startMs - b.startMs)

  if (cues.length === 0) return ''

  return cues
    .map((cue, index) => {
      const cleanText = stripVocabBrackets(cue.text.trim())
      // Bilingual stack → put translation on a second line so SRT renders both.
      const lines = [cleanText]
      if (cue.styleId === 'bilingual-stack' && cue.translation?.trim()) {
        lines.push(cue.translation.trim())
      }
      return [
        String(index + 1),
        `${formatSrtTimestamp(cue.startMs)} --> ${formatSrtTimestamp(cue.endMs)}`,
        lines.join('\n'),
        ''
      ].join('\n')
    })
    .join('\n')
}

export const buildVideoStudioExportManifest = (project: VideoStudioProject) => {
  return {
    schemaVersion: project.schemaVersion,
    project: {
      id: project.id,
      title: project.title,
      spokenLanguage: project.spokenLanguage,
      translationLanguage: project.translationLanguage,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      source: project.source
    },
    aiPrompt: buildAiPrompt(project),
    renderHints: {
      exportQuality: project.exportQuality,
      audio: { duckUnderSfx: true }
    },
    subtitles: project.subtitles.map((cue) => {
      const style = VIDEO_STUDIO_STYLE_MAP[cue.styleId] || VIDEO_STUDIO_STYLE_MAP.normal
      return {
        id: cue.id,
        startMs: cue.startMs,
        endMs: cue.endMs,
        text: cue.text,
        translation: cue.translation || null,
        style: {
          id: style.id,
          label: style.label,
          anchor: style.anchor,
          renderHint: style.renderHint
        },
        animationIn: cue.animationIn || style.renderHint.animationIn || 'fade',
        animationOut: cue.animationOut || style.renderHint.animationOut || 'fade'
      }
    }),
    zooms: project.zooms.map((z) => ({
      ...z,
      scaleFactor: VIDEO_STUDIO_ZOOM_SCALES[z.level]
    })),
    transitions: project.transitions,
    soundEffects: project.soundEffects,
    cameraPans: project.cameraPans
  }
}

const makeEmptyProject = (): VideoStudioProject => ({
  schemaVersion: SCHEMA_VERSION,
  id: newId('proj'),
  title: 'Untitled video',
  spokenLanguage: 'th',
  translationLanguage: 'en',
  source: null,
  subtitles: [],
  zooms: [],
  transitions: [],
  soundEffects: [],
  cameraPans: [],
  exportQuality: '1080p',
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString()
})

const guessAspectRatio = (width: number, height: number): string => {
  if (!width || !height) return 'unknown'
  const ratio = width / height
  if (Math.abs(ratio - 16 / 9) < 0.05) return '16:9'
  if (Math.abs(ratio - 9 / 16) < 0.05) return '9:16'
  if (Math.abs(ratio - 1) < 0.05) return '1:1'
  if (Math.abs(ratio - 4 / 3) < 0.05) return '4:3'
  if (Math.abs(ratio - 4 / 5) < 0.05) return '4:5'
  return `${width}:${height}`
}

const formatMs = (ms: number) => {
  const safe = Math.max(0, Math.round(ms))
  const totalSeconds = Math.floor(safe / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const millis = safe % 1000
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

// Backend transcribe response shape (matches existing speaking-sample-videos
// pipeline). startSeconds / endSeconds are floats; text is the cue line.
type BackendSubtitleCue = {
  id?: string
  startSeconds: number
  endSeconds: number
  text: string
}

const cueFromBackend = (cue: BackendSubtitleCue): VideoStudioSubtitleCue => ({
  id: newId('s'),
  startMs: Math.round((cue.startSeconds ?? 0) * 1000),
  endMs: Math.round((cue.endSeconds ?? 0) * 1000),
  text: String(cue.text || '').trim(),
  styleId: DEFAULT_VIDEO_STUDIO_STYLE
})

const guessVideoFileExtension = (mimeType = '') => {
  if (mimeType.includes('mp4')) return 'mp4'
  if (mimeType.includes('webm')) return 'webm'
  if (mimeType.includes('quicktime') || mimeType.includes('mov')) return 'mov'
  return 'mp4'
}

const BACKEND_UPLOAD_SAFE_BYTES = 3.8 * 1024 * 1024

type Props = {
  isAdmin: boolean
  accessToken?: string
}

export const AdminVideoStudio = ({ isAdmin, accessToken }: Props) => {
  const [project, setProject] = useState<VideoStudioProject>(() => {
    if (typeof window === 'undefined') return makeEmptyProject()
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return makeEmptyProject()
      const parsed = JSON.parse(raw) as VideoStudioProject
      if (parsed?.schemaVersion === SCHEMA_VERSION) return parsed
    } catch {
      // ignore parse errors
    }
    return makeEmptyProject()
  })

  const [sourceBlob, setSourceBlob] = useState<Blob | null>(null)
  const [sourceUrl, setSourceUrl] = useState<string>('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribeStatus, setTranscribeStatus] = useState('')
  const [transcribeError, setTranscribeError] = useState('')
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [savedLabel, setSavedLabel] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const autosaveTimer = useRef<number | null>(null)

  // Autosave to localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    autosaveTimer.current = window.setTimeout(() => {
      try {
        const stamped: VideoStudioProject = {
          ...project,
          updatedAt: new Date().toISOString(),
          createdAt: project.createdAt === new Date(0).toISOString() ? new Date().toISOString() : project.createdAt
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped))
        const now = new Date()
        setSavedLabel(`Saved ${now.toLocaleTimeString()}`)
      } catch {
        // storage full or unavailable
      }
    }, AUTOSAVE_DEBOUNCE_MS)
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    }
  }, [project])

  // Revoke blob URL on unmount.
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    }
  }, [sourceUrl])

  const onFileChosen = useCallback(async (file: File) => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    const blobUrl = URL.createObjectURL(file)
    setSourceBlob(file)
    setSourceUrl(blobUrl)
    setTranscribeError('')

    // Probe metadata to capture duration + aspect.
    const probe = document.createElement('video')
    probe.preload = 'metadata'
    probe.src = blobUrl
    await new Promise<void>((resolve) => {
      probe.addEventListener('loadedmetadata', () => resolve(), { once: true })
      probe.addEventListener('error', () => resolve(), { once: true })
    })
    const durationMs = Number.isFinite(probe.duration) ? Math.round(probe.duration * 1000) : 0
    const aspectRatio = guessAspectRatio(probe.videoWidth, probe.videoHeight)

    setProject((prev) => ({
      ...prev,
      title: prev.title === 'Untitled video' ? file.name.replace(/\.[^.]+$/, '') : prev.title,
      source: {
        fileName: file.name,
        sizeBytes: file.size,
        durationMs,
        aspectRatio,
        mimeType: file.type || 'video/mp4'
      }
    }))
  }, [sourceUrl])

  const uploadToStorageViaSignedUrl = useCallback(
    async (
      blob: Blob,
      fileName: string,
      onProgress: (pct: number) => void
    ): Promise<string> => {
      if (!accessToken) throw new Error('No admin session.')
      // 1. Ask the server for a signed upload URL.
      const signRes = await fetch('/api/admin/video-studio/sign-upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          mimeType: blob.type || 'video/mp4',
          sizeBytes: blob.size
        })
      })
      const signPayload = await signRes.json().catch(() => ({}))
      if (!signRes.ok || !signPayload?.uploadUrl || !signPayload?.token) {
        throw new Error(signPayload?.error?.message || `Could not get upload URL (${signRes.status})`)
      }
      const { uploadUrl, token, objectPath } = signPayload as {
        uploadUrl: string
        token: string
        objectPath: string
      }
      // 2. PUT the blob directly to Supabase storage. Use XHR so we can show progress.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.setRequestHeader('Content-Type', blob.type || 'video/mp4')
        xhr.setRequestHeader('x-upsert', 'true')
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) onProgress(event.loaded / event.total)
        }
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText.slice(0, 200)}`))
        xhr.onerror = () => reject(new Error('Upload network error'))
        xhr.send(blob)
      })
      return objectPath
    },
    [accessToken]
  )

  const onTranscribe = useCallback(async () => {
    if (!sourceBlob) return
    if (!accessToken) {
      setTranscribeError('No admin session — sign in again before transcribing.')
      return
    }
    setIsTranscribing(true)
    setTranscribeError('')
    try {
      const durationSeconds = (project.source?.durationMs || 0) / 1000
      const fileName = `video-studio-source.${guessVideoFileExtension(sourceBlob.type)}`

      if (sourceBlob.size <= BACKEND_UPLOAD_SAFE_BYTES) {
        // Small file path — direct FormData (fast).
        setTranscribeStatus('Uploading to Deepgram / Gemini…')
        const formData = new FormData()
        formData.append('video', sourceBlob, fileName)
        formData.append('trimStartSeconds', '0')
        formData.append('trimEndSeconds', String(durationSeconds.toFixed(3)))
        formData.append('durationSeconds', String(durationSeconds.toFixed(3)))
        const response = await fetch('/api/admin/speaking-sample-videos/transcribe', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData
        })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(payload?.error?.message || `Backend transcription failed (${response.status})`)
        }
        return applyBackendTranscriptionResult(payload)
      }

      // Large file path — direct-to-Supabase, then transcribe by URL.
      setTranscribeStatus(`Uploading ${(sourceBlob.size / (1024 * 1024)).toFixed(0)} MB to storage…`)
      const objectPath = await uploadToStorageViaSignedUrl(sourceBlob, fileName, (pct) => {
        setTranscribeStatus(`Uploading… ${Math.round(pct * 100)}%`)
      })
      setTranscribeStatus('Transcribing via Deepgram (URL mode)…')
      const trRes = await fetch('/api/admin/video-studio/transcribe-url', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          objectPath,
          durationSeconds,
          trimStartSeconds: 0,
          trimEndSeconds: durationSeconds
        })
      })
      const trPayload = await trRes.json().catch(() => ({}))
      if (!trRes.ok) {
        throw new Error(trPayload?.error?.message || `URL transcription failed (${trRes.status})`)
      }
      applyBackendTranscriptionResult(trPayload)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transcription failed'
      setTranscribeError(message)
    } finally {
      setIsTranscribing(false)
    }

    function applyBackendTranscriptionResult(payload: unknown) {
      const data = (payload || {}) as {
        subtitles?: BackendSubtitleCue[]
        provider?: string
        words?: unknown[]
      }
      const backendCues: BackendSubtitleCue[] = Array.isArray(data.subtitles) ? data.subtitles : []
      if (!backendCues.length) {
        throw new Error('Backend returned no subtitles. Check the audio track has clear speech.')
      }
      const cues = backendCues.map(cueFromBackend).filter((c) => c.text && c.endMs > c.startMs)
      const provider = String(data.provider || 'transcription service')
      const wordTimestamps = Array.isArray(data.words) ? data.words.length : 0
      setProject((prev) => ({ ...prev, subtitles: cues }))
      setTranscribeStatus(
        wordTimestamps > 0
          ? `${cues.length} cues via ${provider} (${wordTimestamps} word timestamps).`
          : `${cues.length} cues via ${provider}. Timing may need manual nudges.`
      )
      window.setTimeout(() => setTranscribeStatus(''), 4000)
    }
  }, [sourceBlob, accessToken, project.source?.durationMs, uploadToStorageViaSignedUrl])

  const updateSubtitle = useCallback((id: string, patch: Partial<VideoStudioSubtitleCue>) => {
    setProject((prev) => ({
      ...prev,
      subtitles: prev.subtitles.map((cue) => (cue.id === id ? { ...cue, ...patch } : cue))
    }))
  }, [])

  const deleteSubtitle = useCallback((id: string) => {
    setProject((prev) => ({ ...prev, subtitles: prev.subtitles.filter((cue) => cue.id !== id) }))
  }, [])

  const addSubtitle = useCallback(() => {
    const atMs = Math.round(currentTimeMs)
    setProject((prev) => ({
      ...prev,
      subtitles: [
        ...prev.subtitles,
        {
          id: newId('s'),
          startMs: atMs,
          endMs: Math.min((prev.source?.durationMs || atMs + 2000), atMs + 2000),
          text: '',
          styleId: DEFAULT_VIDEO_STUDIO_STYLE
        }
      ].sort((a, b) => a.startMs - b.startMs)
    }))
  }, [currentTimeMs])

  const activeSubtitle = useMemo(
    () => project.subtitles.find((cue) => currentTimeMs >= cue.startMs && currentTimeMs < cue.endMs) || null,
    [project.subtitles, currentTimeMs]
  )

  const onTimeUpdate = useCallback(() => {
    if (!videoRef.current) return
    setCurrentTimeMs(Math.round(videoRef.current.currentTime * 1000))
  }, [])

  const seekTo = useCallback((ms: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, ms / 1000)
    setCurrentTimeMs(Math.round(ms))
  }, [])

  // ---- Marker add / update / delete ---------------------------------------

  const addZoom = useCallback(
    (level: VideoStudioZoomLevel = 2, kind: 'in' | 'out' = 'in') => {
      const atMs = Math.round(currentTimeMs)
      setProject((prev) => ({
        ...prev,
        zooms: [
          ...prev.zooms,
          { id: newId('z'), atMs, level, kind, durationMs: 400 }
        ].sort((a, b) => a.atMs - b.atMs)
      }))
    },
    [currentTimeMs]
  )

  const updateZoom = useCallback((id: string, patch: Partial<VideoStudioZoomMarker>) => {
    setProject((prev) => ({
      ...prev,
      zooms: prev.zooms.map((m) => (m.id === id ? { ...m, ...patch } : m))
    }))
  }, [])

  const deleteZoom = useCallback((id: string) => {
    setProject((prev) => ({ ...prev, zooms: prev.zooms.filter((m) => m.id !== id) }))
  }, [])

  const addTransition = useCallback(
    (kind: VideoStudioTransitionKind = 'fade') => {
      const atMs = Math.round(currentTimeMs)
      const preset = VIDEO_STUDIO_TRANSITIONS.find((t) => t.id === kind)
      setProject((prev) => ({
        ...prev,
        transitions: [
          ...prev.transitions,
          { id: newId('t'), atMs, kind, durationMs: preset?.defaultDurationMs ?? 350 }
        ].sort((a, b) => a.atMs - b.atMs)
      }))
    },
    [currentTimeMs]
  )

  const updateTransition = useCallback(
    (id: string, patch: Partial<VideoStudioTransitionMarker>) => {
      setProject((prev) => ({
        ...prev,
        transitions: prev.transitions.map((m) => (m.id === id ? { ...m, ...patch } : m))
      }))
    },
    []
  )

  const deleteTransition = useCallback((id: string) => {
    setProject((prev) => ({
      ...prev,
      transitions: prev.transitions.filter((m) => m.id !== id),
      // Detach any SFX paired to it.
      soundEffects: prev.soundEffects.map((sfx) =>
        sfx.pairedTransitionId === id ? { ...sfx, pairedTransitionId: undefined } : sfx
      )
    }))
  }, [])

  const addSfx = useCallback(
    (kind: VideoStudioSfxKind = 'whoosh') => {
      const atMs = Math.round(currentTimeMs)
      setProject((prev) => ({
        ...prev,
        soundEffects: [
          ...prev.soundEffects,
          { id: newId('sfx'), atMs, kind, volume: 0.8 }
        ].sort((a, b) => a.atMs - b.atMs)
      }))
    },
    [currentTimeMs]
  )

  const updateSfx = useCallback((id: string, patch: Partial<VideoStudioSfxMarker>) => {
    setProject((prev) => ({
      ...prev,
      soundEffects: prev.soundEffects.map((m) => (m.id === id ? { ...m, ...patch } : m))
    }))
  }, [])

  const deleteSfx = useCallback((id: string) => {
    setProject((prev) => ({ ...prev, soundEffects: prev.soundEffects.filter((m) => m.id !== id) }))
  }, [])

  const addPan = useCallback(
    (kind: VideoStudioCameraPanKind = 'right') => {
      const atMs = Math.round(currentTimeMs)
      setProject((prev) => ({
        ...prev,
        cameraPans: [
          ...prev.cameraPans,
          { id: newId('pan'), atMs, kind, durationMs: 600 }
        ].sort((a, b) => a.atMs - b.atMs)
      }))
    },
    [currentTimeMs]
  )

  const updatePan = useCallback((id: string, patch: Partial<VideoStudioCameraPanMarker>) => {
    setProject((prev) => ({
      ...prev,
      cameraPans: prev.cameraPans.map((m) => (m.id === id ? { ...m, ...patch } : m))
    }))
  }, [])

  const deletePan = useCallback((id: string) => {
    setProject((prev) => ({ ...prev, cameraPans: prev.cameraPans.filter((m) => m.id !== id) }))
  }, [])

  // ---- Export --------------------------------------------------------------

  const exportManifest = useMemo(() => buildVideoStudioExportManifest(project), [project])
  const exportJson = useMemo(() => JSON.stringify(exportManifest, null, 2), [exportManifest])
  const exportSrt = useMemo(() => buildVideoStudioSrt(project), [project])
  const [copyLabel, setCopyLabel] = useState('Copy JSON')
  const [copySrtLabel, setCopySrtLabel] = useState('Copy SRT')

  const safeProjectFileBase = useMemo(
    () => project.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 60) || 'video-studio',
    [project.title]
  )

  const onDownloadJson = useCallback(() => {
    const blob = new Blob([exportJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeProjectFileBase}.video-studio.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [exportJson, safeProjectFileBase])

  const onCopyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportJson)
      setCopyLabel('Copied!')
      window.setTimeout(() => setCopyLabel('Copy JSON'), 1800)
    } catch {
      setCopyLabel('Copy failed')
      window.setTimeout(() => setCopyLabel('Copy JSON'), 1800)
    }
  }, [exportJson])

  const onDownloadSrt = useCallback(() => {
    if (!exportSrt) return
    // BOM keeps Thai display correct in editors that auto-detect encoding poorly.
    const blob = new Blob(['﻿' + exportSrt], { type: 'text/srt;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeProjectFileBase}.srt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [exportSrt, safeProjectFileBase])

  const onCopySrt = useCallback(async () => {
    if (!exportSrt) return
    try {
      await navigator.clipboard.writeText(exportSrt)
      setCopySrtLabel('Copied!')
      window.setTimeout(() => setCopySrtLabel('Copy SRT'), 1800)
    } catch {
      setCopySrtLabel('Copy failed')
      window.setTimeout(() => setCopySrtLabel('Copy SRT'), 1800)
    }
  }, [exportSrt])

  const onResetProject = useCallback(() => {
    if (!window.confirm('Reset project? Unsaved work will be lost.')) return
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    setSourceBlob(null)
    setSourceUrl('')
    setProject(makeEmptyProject())
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [sourceUrl])

  if (!isAdmin) {
    return (
      <section className="adminPanelPage">
        <div className="emptyNotebook">
          <p>Admin only.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="adminVideoStudio2" data-admin-section="video-studio">
      <header className="adminVideoStudio2Header">
        <div>
          <p className="sectionLabel">Admin · Video Studio</p>
          <h2>{project.title}</h2>
          <p className="meta">
            {project.source
              ? `${project.source.aspectRatio} · ${formatMs(project.source.durationMs)} · ${project.source.fileName}`
              : 'No source video yet. Drop a file below.'}
            {savedLabel && <span className="readingAutosaveStamp">{savedLabel}</span>}
          </p>
        </div>
        <div className="controls">
          <button type="button" className="secondary" onClick={onResetProject}>
            Reset project
          </button>
        </div>
      </header>

      <div className="adminVideoStudio2Toolbar">
        <label className="adminVideoStudio2Field">
          <span>Project title</span>
          <input
            type="text"
            value={project.title}
            onChange={(event) => setProject((prev) => ({ ...prev, title: event.target.value }))}
          />
        </label>
        <label className="adminVideoStudio2Field">
          <span>Spoken language</span>
          <select
            value={project.spokenLanguage}
            onChange={(event) =>
              setProject((prev) => ({ ...prev, spokenLanguage: event.target.value as 'th' | 'en' }))
            }
          >
            <option value="th">Thai (ไทย)</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="adminVideoStudio2Field">
          <span>Translation</span>
          <select
            value={project.translationLanguage || ''}
            onChange={(event) =>
              setProject((prev) => ({
                ...prev,
                translationLanguage: (event.target.value || null) as 'th' | 'en' | null
              }))
            }
          >
            <option value="">None</option>
            <option value="en">English</option>
            <option value="th">Thai</option>
          </select>
        </label>
        <label className="adminVideoStudio2Field">
          <span>Export quality</span>
          <select
            value={project.exportQuality}
            onChange={(event) =>
              setProject((prev) => ({
                ...prev,
                exportQuality: event.target.value as VideoStudioExportQuality
              }))
            }
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4k">4K</option>
          </select>
        </label>
      </div>

      {!sourceUrl ? (
        <label className="adminVideoStudio2Drop">
          <input
            type="file"
            accept="video/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void onFileChosen(file)
            }}
          />
          <div>
            <strong>Drop a video or click to browse</strong>
            <p>MP4, MOV, WebM — any aspect ratio · up to 4 GB</p>
          </div>
        </label>
      ) : (
        <div className="adminVideoStudio2Stage">
          <video
            ref={videoRef}
            src={sourceUrl}
            controls
            onTimeUpdate={onTimeUpdate}
            className="adminVideoStudio2Video"
          />
          {activeSubtitle && (() => {
            const style = VIDEO_STUDIO_STYLE_MAP[activeSubtitle.styleId] || VIDEO_STUDIO_STYLE_MAP.normal
            const { anchor, preview } = style
            const text = activeSubtitle.text || '—'
            const translation = activeSubtitle.translation || ''
            const translatePct = anchor.align === 'left'
              ? '0'
              : anchor.align === 'right'
                ? '-100%'
                : '-50%'
            const wrapperStyle: React.CSSProperties = {
              position: 'absolute',
              top: `${anchor.yPercent}%`,
              left: `${anchor.xPercent}%`,
              transform: `translate(${translatePct}, -50%)`,
              pointerEvents: 'none',
              maxWidth: '78%'
            }
            // Vocab callout: highlight word in [[brackets]] OR first capitalized word.
            const renderVocabCallout = () => {
              const bracketMatch = /\[\[(.+?)\]\]/.exec(text)
              const highlight = bracketMatch?.[1]
              if (!highlight) {
                return <span style={{ color: preview.color }}>{text}</span>
              }
              const [before, after] = text.split(bracketMatch[0])
              return (
                <span style={{ color: preview.color }}>
                  {before}
                  <span style={{ background: '#facc15', color: '#111827', padding: '0 6px', borderRadius: 4, fontWeight: 900 }}>
                    {highlight}
                  </span>
                  {after}
                </span>
              )
            }
            return (
              <div style={wrapperStyle}>
                <div style={preview as React.CSSProperties}>
                  {style.id === 'vocab-callout' ? (
                    renderVocabCallout()
                  ) : style.id === 'bilingual-stack' ? (
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span>{text}</span>
                      {translation && (
                        <span style={{ fontSize: '0.78em', opacity: 0.85 }}>{translation}</span>
                      )}
                    </span>
                  ) : (
                    text
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Subtitles ({project.subtitles.length})</h3>
          <div className="controls">
            <button
              type="button"
              className="secondary"
              onClick={onTranscribe}
              disabled={!sourceBlob || isTranscribing}
            >
              {isTranscribing ? (transcribeStatus || 'Transcribing…') : 'Transcribe (Thai + EN)'}
            </button>
            <button type="button" onClick={addSubtitle} disabled={!sourceBlob}>
              Add subtitle at playhead
            </button>
          </div>
        </div>
        {transcribeError && <p className="adminVideoStudio2Error">{transcribeError}</p>}
        {!isTranscribing && transcribeStatus && (
          <p className="meta" style={{ color: '#86efac' }}>
            {transcribeStatus}
          </p>
        )}
        <p className="meta">
          Playhead: <strong>{formatMs(currentTimeMs)}</strong>
        </p>
        <ul className="adminVideoStudio2CueList">
          {project.subtitles.length === 0 && (
            <li className="adminVideoStudio2EmptyHint">
              No subtitles yet. Transcribe the video, or add them manually.
            </li>
          )}
          {project.subtitles.map((cue) => {
            const style = VIDEO_STUDIO_STYLE_MAP[cue.styleId] || VIDEO_STUDIO_STYLE_MAP.normal
            return (
              <li
                key={cue.id}
                className={`adminVideoStudio2CueRow ${activeSubtitle?.id === cue.id ? 'is-active' : ''}`.trim()}
              >
                <div className="adminVideoStudio2CueTime">
                  <button
                    type="button"
                    className="adminVideoStudio2MarkerSeek"
                    onClick={() => seekTo(cue.startMs)}
                    title="Seek to start"
                  >
                    {formatMs(cue.startMs)}
                  </button>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={cue.startMs}
                    onChange={(event) =>
                      updateSubtitle(cue.id, { startMs: Number(event.target.value) })
                    }
                  />
                  <span>→</span>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={cue.endMs}
                    onChange={(event) =>
                      updateSubtitle(cue.id, { endMs: Number(event.target.value) })
                    }
                  />
                </div>
                <input
                  type="text"
                  className="adminVideoStudio2CueText"
                  value={cue.text}
                  placeholder="Subtitle text — use [[brackets]] to mark a vocab word"
                  onChange={(event) => updateSubtitle(cue.id, { text: event.target.value })}
                />
                <select
                  className="adminVideoStudio2CueStyle"
                  value={cue.styleId}
                  onChange={(event) =>
                    updateSubtitle(cue.id, { styleId: event.target.value as VideoStudioStyleId })
                  }
                >
                  {VIDEO_STUDIO_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="adminVideoStudio2CueChipWrap">
                  <span
                    className="adminVideoStudio2CueChip"
                    style={{
                      ...(style.preview as React.CSSProperties),
                      transform: undefined,
                      fontSize: '0.72rem',
                      padding: '4px 8px'
                    }}
                    title={style.description}
                  >
                    {style.label}
                  </span>
                </div>
                <button type="button" className="secondary" onClick={() => deleteSubtitle(cue.id)}>
                  ✕
                </button>
                <details className="adminVideoStudio2CueAdvanced">
                  <summary>Advanced</summary>
                  <div className="adminVideoStudio2CueAdvancedGrid">
                    <label>
                      <span>Translation</span>
                      <input
                        type="text"
                        value={cue.translation || ''}
                        placeholder="Optional translation"
                        onChange={(event) => updateSubtitle(cue.id, { translation: event.target.value })}
                      />
                    </label>
                    <label>
                      <span>Animation in</span>
                      <select
                        value={cue.animationIn || style.renderHint.animationIn || 'fade'}
                        onChange={(event) =>
                          updateSubtitle(cue.id, {
                            animationIn: event.target.value as VideoStudioTextAnimation
                          })
                        }
                      >
                        {VIDEO_STUDIO_TEXT_ANIMATIONS.map((anim) => (
                          <option key={anim} value={anim}>
                            {anim}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Animation out</span>
                      <select
                        value={cue.animationOut || style.renderHint.animationOut || 'fade'}
                        onChange={(event) =>
                          updateSubtitle(cue.id, {
                            animationOut: event.target.value as VideoStudioTextAnimation
                          })
                        }
                      >
                        {VIDEO_STUDIO_TEXT_ANIMATIONS.map((anim) => (
                          <option key={anim} value={anim}>
                            {anim}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Style library</h3>
          <p className="meta">{VIDEO_STUDIO_STYLES.length} premade looks</p>
        </div>
        <div className="adminVideoStudio2StyleGrid">
          {VIDEO_STUDIO_STYLES.map((style) => (
            <article key={style.id} className="adminVideoStudio2StyleCard">
              <header>
                <strong>{style.label}</strong>
                <code>{style.id}</code>
              </header>
              <div className="adminVideoStudio2StylePreview" style={style.preview as React.CSSProperties}>
                {style.label}
              </div>
              <p className="meta">{style.description}</p>
            </article>
          ))}
        </div>
      </div>

      {/* ---- Timeline visualization ---- */}
      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Timeline</h3>
          <p className="meta">
            {project.source ? `0 → ${formatMs(project.source.durationMs)}` : 'Upload a video to enable the timeline.'}
          </p>
        </div>
        {project.source && project.source.durationMs > 0 ? (
          <div className="adminVideoStudio2Timeline">
            {[
              { id: 'subtitles', label: 'Subtitles', markers: project.subtitles.map((c) => ({ id: c.id, atMs: c.startMs, label: c.text })) },
              { id: 'zooms', label: 'Zooms', markers: project.zooms.map((z) => ({ id: z.id, atMs: z.atMs, label: `${z.kind === 'in' ? '+' : '-'}L${z.level}` })) },
              { id: 'transitions', label: 'Transitions', markers: project.transitions.map((t) => ({ id: t.id, atMs: t.atMs, label: t.kind })) },
              { id: 'sfx', label: 'SFX', markers: project.soundEffects.map((s) => ({ id: s.id, atMs: s.atMs, label: s.kind })) },
              { id: 'pans', label: 'Camera', markers: project.cameraPans.map((p) => ({ id: p.id, atMs: p.atMs, label: p.kind })) }
            ].map((track) => (
              <div key={track.id} className={`adminVideoStudio2TimelineRow row-${track.id}`}>
                <span className="adminVideoStudio2TimelineRowLabel">{track.label}</span>
                <div
                  className="adminVideoStudio2TimelineLane"
                  onClick={(event) => {
                    if (!project.source) return
                    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
                    const fraction = (event.clientX - rect.left) / rect.width
                    seekTo(Math.max(0, Math.min(project.source.durationMs, fraction * project.source.durationMs)))
                  }}
                >
                  {track.markers.map((marker) => {
                    const pct = Math.max(
                      0,
                      Math.min(100, (marker.atMs / (project.source?.durationMs || 1)) * 100)
                    )
                    return (
                      <span
                        key={marker.id}
                        className="adminVideoStudio2TimelineMarker"
                        style={{ left: `${pct}%` }}
                        title={`${formatMs(marker.atMs)} — ${marker.label}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          seekTo(marker.atMs)
                        }}
                      />
                    )
                  })}
                  <span
                    className="adminVideoStudio2TimelinePlayhead"
                    style={{
                      left: `${Math.min(100, (currentTimeMs / (project.source?.durationMs || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="meta">No source video.</p>
        )}
      </div>

      {/* ---- Zoom markers ---- */}
      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Zooms ({project.zooms.length})</h3>
          <div className="controls">
            <button type="button" className="secondary" onClick={() => addZoom(1, 'in')} disabled={!sourceBlob}>
              + Zoom in L1
            </button>
            <button type="button" className="secondary" onClick={() => addZoom(2, 'in')} disabled={!sourceBlob}>
              + L2
            </button>
            <button type="button" className="secondary" onClick={() => addZoom(3, 'in')} disabled={!sourceBlob}>
              + L3
            </button>
            <button type="button" className="secondary" onClick={() => addZoom(4, 'in')} disabled={!sourceBlob}>
              + L4
            </button>
            <button type="button" onClick={() => addZoom(2, 'out')} disabled={!sourceBlob}>
              + Zoom out
            </button>
          </div>
        </div>
        <ul className="adminVideoStudio2CueList">
          {project.zooms.length === 0 && <li className="adminVideoStudio2EmptyHint">No zoom markers yet.</li>}
          {project.zooms.map((zoom) => (
            <li key={zoom.id} className="adminVideoStudio2MarkerRow">
              <button
                type="button"
                className="adminVideoStudio2MarkerSeek"
                onClick={() => seekTo(zoom.atMs)}
              >
                {formatMs(zoom.atMs)}
              </button>
              <input
                type="number"
                value={zoom.atMs}
                step={50}
                onChange={(event) => updateZoom(zoom.id, { atMs: Number(event.target.value) })}
              />
              <select
                value={zoom.kind}
                onChange={(event) => updateZoom(zoom.id, { kind: event.target.value as 'in' | 'out' })}
              >
                <option value="in">Zoom in</option>
                <option value="out">Zoom out</option>
              </select>
              <select
                value={zoom.level}
                onChange={(event) =>
                  updateZoom(zoom.id, { level: Number(event.target.value) as VideoStudioZoomLevel })
                }
              >
                {(Object.keys(VIDEO_STUDIO_ZOOM_SCALES) as unknown as VideoStudioZoomLevel[]).map((level) => (
                  <option key={level} value={level}>
                    L{level} · {VIDEO_STUDIO_ZOOM_SCALES[level]}×
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={zoom.durationMs}
                step={50}
                onChange={(event) => updateZoom(zoom.id, { durationMs: Number(event.target.value) })}
                title="duration ms"
              />
              <button type="button" className="secondary" onClick={() => deleteZoom(zoom.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Transition markers ---- */}
      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Transitions ({project.transitions.length})</h3>
          <div className="controls">
            {VIDEO_STUDIO_TRANSITIONS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="secondary"
                onClick={() => addTransition(preset.id)}
                disabled={!sourceBlob}
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="adminVideoStudio2CueList">
          {project.transitions.length === 0 && (
            <li className="adminVideoStudio2EmptyHint">No transitions yet.</li>
          )}
          {project.transitions.map((tr) => (
            <li key={tr.id} className="adminVideoStudio2MarkerRow">
              <button
                type="button"
                className="adminVideoStudio2MarkerSeek"
                onClick={() => seekTo(tr.atMs)}
              >
                {formatMs(tr.atMs)}
              </button>
              <input
                type="number"
                value={tr.atMs}
                step={50}
                onChange={(event) => updateTransition(tr.id, { atMs: Number(event.target.value) })}
              />
              <select
                value={tr.kind}
                onChange={(event) =>
                  updateTransition(tr.id, { kind: event.target.value as VideoStudioTransitionKind })
                }
              >
                {VIDEO_STUDIO_TRANSITIONS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={tr.durationMs}
                step={50}
                onChange={(event) =>
                  updateTransition(tr.id, { durationMs: Number(event.target.value) })
                }
                title="duration ms"
              />
              <button type="button" className="secondary" onClick={() => deleteTransition(tr.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Sound effect markers ---- */}
      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Sound effects ({project.soundEffects.length})</h3>
          <div className="controls">
            {VIDEO_STUDIO_SFX.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="secondary"
                onClick={() => addSfx(preset.id)}
                disabled={!sourceBlob}
                title={
                  preset.pairsWithTransition
                    ? `Best paired with "${preset.pairsWithTransition}" transition`
                    : undefined
                }
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="adminVideoStudio2CueList">
          {project.soundEffects.length === 0 && (
            <li className="adminVideoStudio2EmptyHint">No sound effects yet.</li>
          )}
          {project.soundEffects.map((sfx) => (
            <li key={sfx.id} className="adminVideoStudio2MarkerRow">
              <button
                type="button"
                className="adminVideoStudio2MarkerSeek"
                onClick={() => seekTo(sfx.atMs)}
              >
                {formatMs(sfx.atMs)}
              </button>
              <input
                type="number"
                value={sfx.atMs}
                step={50}
                onChange={(event) => updateSfx(sfx.id, { atMs: Number(event.target.value) })}
              />
              <select
                value={sfx.kind}
                onChange={(event) => updateSfx(sfx.id, { kind: event.target.value as VideoStudioSfxKind })}
              >
                {VIDEO_STUDIO_SFX.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <label className="adminVideoStudio2MarkerInlineLabel">
                <span>vol</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={sfx.volume}
                  onChange={(event) => updateSfx(sfx.id, { volume: Number(event.target.value) })}
                />
              </label>
              <select
                value={sfx.pairedTransitionId || ''}
                onChange={(event) =>
                  updateSfx(sfx.id, { pairedTransitionId: event.target.value || undefined })
                }
              >
                <option value="">Unpaired</option>
                {project.transitions.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.kind} @ {formatMs(tr.atMs)}
                  </option>
                ))}
              </select>
              <button type="button" className="secondary" onClick={() => deleteSfx(sfx.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Camera pan markers ---- */}
      <div className="adminVideoStudio2Panel">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Camera pans ({project.cameraPans.length})</h3>
          <div className="controls">
            {VIDEO_STUDIO_CAMERA_PANS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="secondary"
                onClick={() => addPan(preset.id)}
                disabled={!sourceBlob}
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="adminVideoStudio2CueList">
          {project.cameraPans.length === 0 && (
            <li className="adminVideoStudio2EmptyHint">No camera pans yet.</li>
          )}
          {project.cameraPans.map((pan) => (
            <li key={pan.id} className="adminVideoStudio2MarkerRow">
              <button
                type="button"
                className="adminVideoStudio2MarkerSeek"
                onClick={() => seekTo(pan.atMs)}
              >
                {formatMs(pan.atMs)}
              </button>
              <input
                type="number"
                value={pan.atMs}
                step={50}
                onChange={(event) => updatePan(pan.id, { atMs: Number(event.target.value) })}
              />
              <select
                value={pan.kind}
                onChange={(event) => updatePan(pan.id, { kind: event.target.value as VideoStudioCameraPanKind })}
              >
                {VIDEO_STUDIO_CAMERA_PANS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={pan.durationMs}
                step={50}
                onChange={(event) => updatePan(pan.id, { durationMs: Number(event.target.value) })}
                title="duration ms"
              />
              <button type="button" className="secondary" onClick={() => deletePan(pan.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Export ---- */}
      <div className="adminVideoStudio2Panel adminVideoStudio2Panel-export">
        <div className="adminVideoStudio2PanelHeader">
          <h3>Export</h3>
          <div className="controls">
            <button type="button" className="secondary" onClick={onCopyJson}>
              {copyLabel}
            </button>
            <button type="button" onClick={onDownloadJson}>
              Download .json
            </button>
            <button
              type="button"
              className="secondary"
              onClick={onCopySrt}
              disabled={!exportSrt}
              title={!exportSrt ? 'Add at least one subtitle first' : ''}
            >
              {copySrtLabel}
            </button>
            <button
              type="button"
              onClick={onDownloadSrt}
              disabled={!exportSrt}
              title={!exportSrt ? 'Add at least one subtitle first' : ''}
            >
              Download .srt
            </button>
          </div>
        </div>
        <p className="meta">
          <strong>.json</strong> — self-contained manifest (styles, anchors, render hints, zoom scale
          factors, AI prompt) for Hyperframes / Remotion / custom AI renderers.
          <br />
          <strong>.srt</strong> — universal subtitle format for CapCut, Premiere, Final Cut, DaVinci, or
          burning in via ffmpeg. Bilingual-stack cues export with the translation on the second line;
          <code> [[brackets]] </code>are stripped.
          <br />
          {project.subtitles.length} subtitles · {project.zooms.length} zooms ·{' '}
          {project.transitions.length} transitions · {project.soundEffects.length} sfx ·{' '}
          {project.cameraPans.length} pans.
        </p>
        <details className="adminVideoStudio2ExportDetails">
          <summary>Preview JSON</summary>
          <pre className="adminVideoStudio2ExportPre">{exportJson}</pre>
        </details>
        {exportSrt && (
          <details className="adminVideoStudio2ExportDetails">
            <summary>Preview SRT</summary>
            <pre className="adminVideoStudio2ExportPre">{exportSrt}</pre>
          </details>
        )}
      </div>
    </section>
  )
}

export default AdminVideoStudio

// Lookup re-exports for the eventual export-builder in Phase 4.
export const VIDEO_STUDIO_STYLE_BY_ID = VIDEO_STUDIO_STYLE_MAP
