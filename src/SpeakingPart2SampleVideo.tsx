import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { SpeakingSampleKnowledgeOverlay } from './SpeakingSampleKnowledgeOverlay'
import {
  enrichSpeakingSampleSubtitlesWithNotes,
  getRevealedSpeakingSampleSubtitleNotes,
  isSpeakingSampleSubtitlePhraseRevealed,
  type SpeakingSampleSubtitleCue
} from './speakingSampleSubtitleNotes'
import {
  getSpeakingPart2SampleEmbedUrl,
  getSpeakingPart2SampleThumbUrl,
  type SpeakingPart2SampleSubtitleNote,
  type SpeakingPart2SampleVideo
} from './speakingPart2SampleVideos'
import './SpeakingPart2SampleVideo.css'

const DEFAULT_SAMPLE_SUBTITLE_STYLE = {
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  textColor: '#ffffff',
  backgroundColor: '#0f172a',
  fontSize: 22,
  boxWidthPercent: 78,
  verticalPositionPercent: 82,
  horizontalPositionPercent: 50,
  textAlign: 'center' as const
}

const normalizeSampleSubtitleNoteText = (value: string) => String(value || '').trim().replace(/\s+/g, ' ')

const normalizeSampleSubtitleNotes = (notes: SpeakingPart2SampleSubtitleNote[] | undefined) =>
  Array.isArray(notes)
    ? notes
        .map((note) => ({
          id: String(note.id || note.phrase || '').slice(0, 120),
          phrase: normalizeSampleSubtitleNoteText(note.phrase).slice(0, 160),
          detail: String(note.detail || '').trim().slice(0, 800),
          kind: note.kind,
          partOfSpeech: note.partOfSpeech,
          thaiMeaning: note.thaiMeaning,
          grammarRule: note.grammarRule,
          exampleSentence: note.exampleSentence
        }))
        .filter((note) => note.phrase && (note.detail || note.thaiMeaning || note.grammarRule))
    : []

const renderSampleSubtitleTextWithNotes = (
  text: string,
  notes: SpeakingPart2SampleSubtitleNote[] | undefined,
  cue?: Pick<SpeakingSampleSubtitleCue, 'startSeconds' | 'endSeconds' | 'text'>,
  videoTime = 0
) => {
  const subtitleText = String(text || '')
  const normalizedNotes = normalizeSampleSubtitleNotes(notes)
  if (!subtitleText || normalizedNotes.length === 0) return subtitleText

  const lowerText = subtitleText.toLowerCase()
  const matches = normalizedNotes
    .map((note) => {
      const phrase = normalizeSampleSubtitleNoteText(note.phrase)
      return {
        id: note.id,
        phrase,
        start: lowerText.indexOf(phrase.toLowerCase()),
        revealed: cue ? isSpeakingSampleSubtitlePhraseRevealed(cue, phrase, videoTime) : true
      }
    })
    .filter((match) => match.phrase && match.start >= 0 && match.revealed)
    .sort((a, b) => a.start - b.start || b.phrase.length - a.phrase.length)

  const pieces: ReactNode[] = []
  let cursor = 0
  matches.forEach((match) => {
    if (match.start < cursor) return
    if (match.start > cursor) pieces.push(subtitleText.slice(cursor, match.start))
    const end = match.start + match.phrase.length
    pieces.push(
      <mark key={`${match.id}-${match.start}`} className="speakingP2SampleSubtitleMark">
        {subtitleText.slice(match.start, end)}
      </mark>
    )
    cursor = end
  })
  if (cursor < subtitleText.length) pieces.push(subtitleText.slice(cursor))
  return pieces.length ? pieces : subtitleText
}

export function SpeakingPart2SampleBadge() {
  return (
    <div className="speakingP2SampleBadge" aria-label="พี่ดอย speaking sample available">
      <span className="speakingP2SampleBadgePlay" aria-hidden>
        ▶
      </span>
      <span>
        <strong>พี่ดอย sample</strong>
        <small>Model answer available</small>
      </span>
    </div>
  )
}

type SpeakingPart2SamplePanelProps = {
  sample: SpeakingPart2SampleVideo
}

export function SpeakingPart2SamplePanel({ sample }: SpeakingPart2SamplePanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const [videoTime, setVideoTime] = useState(0)
  const [videoError, setVideoError] = useState('')
  const uploadedVideoRef = useRef<HTMLVideoElement | null>(null)
  const uploadedVideoFrameRef = useRef<{ id: number; type: 'animation' | 'video' } | null>(null)
  const embedUrl = sample.driveFileId ? getSpeakingPart2SampleEmbedUrl(sample.driveFileId) : ''
  const thumbUrl = sample.driveFileId ? getSpeakingPart2SampleThumbUrl(sample.driveFileId) : ''
  const hasUploadedVideo = Boolean(sample.videoUrl)
  const isVideoFlipped = Boolean(sample.videoFlipHorizontal || sample.subtitleStyle?.videoFlipHorizontal)
  const uploadedSubtitles = useMemo(() => {
    const base = (sample.subtitles || [])
      .filter((cue) => cue.text && cue.endSeconds > cue.startSeconds)
      .sort((a, b) => a.startSeconds - b.startSeconds) as SpeakingSampleSubtitleCue[]
    return enrichSpeakingSampleSubtitlesWithNotes(base, sample.transcript || '')
  }, [sample.subtitles, sample.transcript])
  const trimStartSeconds = Math.max(0, Number(sample.trimStartSeconds || 0))
  const trimEndSeconds = Math.max(trimStartSeconds, Number(sample.trimEndSeconds || 0))
  const hasTrim = Boolean(hasUploadedVideo && trimEndSeconds > trimStartSeconds)
  const activeSubtitleCue = uploadedSubtitles.find(
    (cue) => videoTime >= cue.startSeconds && videoTime < cue.endSeconds
  )
  const visibleSubtitleNotes = useMemo(
    () => getRevealedSpeakingSampleSubtitleNotes(uploadedSubtitles, videoTime),
    [uploadedSubtitles, videoTime]
  )
  const subtitleStyle = {
    ...DEFAULT_SAMPLE_SUBTITLE_STYLE,
    ...(sample.subtitleStyle || {})
  }
  const subtitleOverlayStyle = {
    '--subtitle-font-family': subtitleStyle.fontFamily,
    '--subtitle-text-color': subtitleStyle.textColor,
    '--subtitle-background-color': subtitleStyle.backgroundColor,
    '--subtitle-font-size': `${subtitleStyle.fontSize}px`,
    '--subtitle-box-width': `${subtitleStyle.boxWidthPercent}%`,
    '--subtitle-y': `${subtitleStyle.verticalPositionPercent}%`,
    '--subtitle-x': `${subtitleStyle.horizontalPositionPercent}%`,
    '--subtitle-text-align': subtitleStyle.textAlign
  } as CSSProperties

  const roundVideoTime = (seconds: number) => Number((Number.isFinite(seconds) ? seconds : 0).toFixed(3))

  useEffect(() => {
    setVideoError('')
    setVideoTime(0)
  }, [sample.videoUrl])

  useEffect(() => {
    if (!hasUploadedVideo) return
    let canceled = false

    const cancelScheduledFrame = () => {
      const scheduled = uploadedVideoFrameRef.current
      const video = uploadedVideoRef.current as
        | (HTMLVideoElement & { cancelVideoFrameCallback?: (id: number) => void })
        | null
      if (!scheduled) return
      if (scheduled.type === 'video' && video?.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(scheduled.id)
      } else {
        window.cancelAnimationFrame(scheduled.id)
      }
      uploadedVideoFrameRef.current = null
    }

    const syncVideoClock = (mediaTime?: number) => {
      const video = uploadedVideoRef.current
      if (!video) return
      const currentTime = typeof mediaTime === 'number' ? mediaTime : video.currentTime
      if (hasTrim && currentTime >= trimEndSeconds) {
        video.pause()
        video.currentTime = trimEndSeconds
        setVideoTime(roundVideoTime(trimEndSeconds))
        return
      }
      setVideoTime((current) => {
        const roundedTime = roundVideoTime(currentTime)
        return Math.abs(current - roundedTime) >= 0.001 ? roundedTime : current
      })
    }

    const scheduleVideoClock = () => {
      if (canceled) return
      const video = uploadedVideoRef.current as
        | (HTMLVideoElement & {
            requestVideoFrameCallback?: (
              callback: (now: number, metadata: { mediaTime: number }) => void
            ) => number
          })
        | null
      if (video?.requestVideoFrameCallback && !video.paused && !video.ended) {
        const id = video.requestVideoFrameCallback((_now, metadata) => {
          uploadedVideoFrameRef.current = null
          syncVideoClock(metadata.mediaTime)
          scheduleVideoClock()
        })
        uploadedVideoFrameRef.current = { id, type: 'video' }
        return
      }
      const id = window.requestAnimationFrame(() => {
        uploadedVideoFrameRef.current = null
        syncVideoClock()
        scheduleVideoClock()
      })
      uploadedVideoFrameRef.current = { id, type: 'animation' }
    }

    scheduleVideoClock()
    return () => {
      canceled = true
      cancelScheduledFrame()
    }
  }, [hasUploadedVideo, hasTrim, trimEndSeconds])

  const syncUploadedVideoTrim = () => {
    const video = uploadedVideoRef.current
    if (!video || !hasTrim) return
    if (video.currentTime < trimStartSeconds || video.currentTime >= trimEndSeconds) {
      video.currentTime = trimStartSeconds
      setVideoTime(roundVideoTime(trimStartSeconds))
    }
  }

  const stopAtTrimEnd = () => {
    const video = uploadedVideoRef.current
    if (video) setVideoTime(roundVideoTime(video.currentTime))
    if (!video || !hasTrim) return
    if (video.currentTime >= trimEndSeconds) {
      video.pause()
      video.currentTime = trimEndSeconds
      setVideoTime(roundVideoTime(trimEndSeconds))
    }
  }

  return (
    <section
      className="speakingP2SamplePanel"
      aria-label={`พี่ดอย speaking sample: ${sample.shortLabel}`}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="speakingP2SamplePanelHeader">
        <span className="speakingP2SampleKicker">{sample.sourceLabel || 'พี่ดอย · P&apos;Doy'}</span>
        <span className="speakingP2SampleTopicPill">{sample.shortLabel}</span>
      </div>
      <h4 className="speakingP2SampleTitle">{sample.topicLabel}</h4>
      <p className="speakingP2SampleLead">
        Watch a model answer while you plan. Use it for ideas, structure, and natural linking — then speak in your own words.
      </p>

      <div className="speakingP2SampleFrame">
        {hasUploadedVideo ? (
          <>
            <video
              ref={uploadedVideoRef}
              className={`speakingP2SampleVideo ${isVideoFlipped ? 'is-flipped' : ''}`.trim()}
              src={sample.videoUrl}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload"
              onLoadedMetadata={() => {
                setVideoError('')
                syncUploadedVideoTrim()
              }}
              onPlay={syncUploadedVideoTrim}
              onTimeUpdate={stopAtTrimEnd}
              onSeeked={(event) => setVideoTime(roundVideoTime(event.currentTarget.currentTime))}
              onError={() => {
                setVideoError('This sample video could not be loaded. Refresh the page, then try again.')
              }}
              onContextMenu={(event) => event.preventDefault()}
            />
            {videoError ? (
              <div className="speakingP2SampleVideoError" role="alert">
                <strong>Video unavailable</strong>
                <span>{videoError}</span>
              </div>
            ) : null}
            {activeSubtitleCue?.text ? (
              <div className="speakingP2SampleSubtitleOverlay" style={subtitleOverlayStyle}>
                <span>
                  {renderSampleSubtitleTextWithNotes(
                    activeSubtitleCue.text,
                    activeSubtitleCue.notes,
                    activeSubtitleCue,
                    videoTime
                  )}
                </span>
              </div>
            ) : null}
            {visibleSubtitleNotes.length > 0 ? (
              <SpeakingSampleKnowledgeOverlay
                notes={visibleSubtitleNotes}
                className="speakingP2SampleKnowledgeStack"
                cardClassName="speakingP2SampleKnowledgeCard"
              />
            ) : null}
          </>
        ) : !isPlaying ? (
          <button
            type="button"
            className="speakingP2SampleLaunch"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play พี่ดอย speaking sample for ${sample.shortLabel}`}
          >
            {thumbFailed ? <span className="speakingP2SampleThumbFallback" aria-hidden /> : null}
            {!thumbFailed ? (
              <img
                className="speakingP2SampleThumb"
                src={thumbUrl}
                alt=""
                draggable={false}
                onError={() => setThumbFailed(true)}
              />
            ) : null}
            <span className="speakingP2SampleLaunchOverlay">
              <span className="speakingP2SamplePlayRing" aria-hidden>
                ▶
              </span>
              <span className="speakingP2SampleLaunchLabel">Play speaking sample</span>
              <span className="speakingP2SampleLaunchHint">Stream-only · study preview</span>
            </span>
          </button>
        ) : (
          <iframe
            className="speakingP2SampleIframe"
            src={embedUrl}
            title={`พี่ดอย speaking sample — ${sample.shortLabel}`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {isPlaying && !hasUploadedVideo ? (
        <div className="speakingP2SampleFooter">
          <button type="button" className="speakingP2SampleReplay" onClick={() => setIsPlaying(false)}>
            Close player
          </button>
        </div>
      ) : null}
    </section>
  )
}
