import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  transcribeRecordingLocally,
  type LocalSubtitleCue,
  type LocalTranscriptionResult
} from './adminLocalSubtitleTranscriber'
import {
  DEFAULT_VIDEO_STUDIO_STYLE,
  VIDEO_STUDIO_CAMERA_PANS,
  VIDEO_STUDIO_SFX,
  VIDEO_STUDIO_STYLES,
  VIDEO_STUDIO_STYLE_MAP,
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

const cueFromLocal = (cue: LocalSubtitleCue): VideoStudioSubtitleCue => ({
  id: newId('s'),
  startMs: Math.round(cue.startSeconds * 1000),
  endMs: Math.round(cue.endSeconds * 1000),
  text: cue.text,
  styleId: DEFAULT_VIDEO_STUDIO_STYLE
})

type Props = {
  isAdmin: boolean
}

export const AdminVideoStudio = ({ isAdmin }: Props) => {
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

  const onTranscribe = useCallback(async () => {
    if (!sourceBlob) return
    setIsTranscribing(true)
    setTranscribeStatus('Starting…')
    setTranscribeError('')
    try {
      const result: LocalTranscriptionResult = await transcribeRecordingLocally(sourceBlob, {
        trimStartSeconds: 0,
        trimEndSeconds: (project.source?.durationMs || 0) / 1000,
        onProgress: (message) => setTranscribeStatus(message)
      })
      const cues = result.subtitles.map(cueFromLocal)
      setProject((prev) => ({ ...prev, subtitles: cues }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transcription failed'
      setTranscribeError(message)
    } finally {
      setIsTranscribing(false)
      setTranscribeStatus('')
    }
  }, [sourceBlob, project.source?.durationMs])

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
            <p>MP4, MOV, WebM — any aspect ratio</p>
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
          {activeSubtitle && (
            <div className="adminVideoStudio2SubtitlePreview" data-style={activeSubtitle.styleId}>
              {activeSubtitle.text || '—'}
            </div>
          )}
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
              {isTranscribing ? (transcribeStatus || 'Transcribing…') : 'Transcribe with Whisper'}
            </button>
            <button type="button" onClick={addSubtitle} disabled={!sourceBlob}>
              Add subtitle at playhead
            </button>
          </div>
        </div>
        {transcribeError && <p className="adminVideoStudio2Error">{transcribeError}</p>}
        <p className="meta">
          Playhead: <strong>{formatMs(currentTimeMs)}</strong>
        </p>
        <ul className="adminVideoStudio2CueList">
          {project.subtitles.length === 0 && (
            <li className="adminVideoStudio2EmptyHint">
              No subtitles yet. Transcribe the video, or add them manually.
            </li>
          )}
          {project.subtitles.map((cue) => (
            <li
              key={cue.id}
              className={`adminVideoStudio2CueRow ${activeSubtitle?.id === cue.id ? 'is-active' : ''}`.trim()}
            >
              <div className="adminVideoStudio2CueTime">
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
                <span>ms</span>
              </div>
              <input
                type="text"
                className="adminVideoStudio2CueText"
                value={cue.text}
                placeholder="Subtitle text"
                onChange={(event) => updateSubtitle(cue.id, { text: event.target.value })}
              />
              <select
                className="adminVideoStudio2CueStyle"
                value={cue.styleId}
                onChange={(event) =>
                  updateSubtitle(cue.id, { styleId: event.target.value as VideoStudioStyleId })
                }
              >
                {VIDEO_STUDIO_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
              <button type="button" className="secondary" onClick={() => deleteSubtitle(cue.id)}>
                ✕
              </button>
            </li>
          ))}
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
    </section>
  )
}

export default AdminVideoStudio

// Lookup re-exports for the eventual export-builder in Phase 4.
export const VIDEO_STUDIO_STYLE_BY_ID = VIDEO_STUDIO_STYLE_MAP
