import { useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  getSpeakingPart2SampleEmbedUrl,
  getSpeakingPart2SampleThumbUrl,
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
  const uploadedVideoRef = useRef<HTMLVideoElement | null>(null)
  const embedUrl = sample.driveFileId ? getSpeakingPart2SampleEmbedUrl(sample.driveFileId) : ''
  const thumbUrl = sample.driveFileId ? getSpeakingPart2SampleThumbUrl(sample.driveFileId) : ''
  const hasUploadedVideo = Boolean(sample.videoUrl)
  const uploadedSubtitles = useMemo(
    () =>
      (sample.subtitles || [])
        .filter((cue) => cue.text && cue.endSeconds > cue.startSeconds)
        .sort((a, b) => a.startSeconds - b.startSeconds),
    [sample.subtitles]
  )
  const trimStartSeconds = Math.max(0, Number(sample.trimStartSeconds || 0))
  const trimEndSeconds = Math.max(trimStartSeconds, Number(sample.trimEndSeconds || 0))
  const hasTrim = Boolean(hasUploadedVideo && trimEndSeconds > trimStartSeconds)
  const activeSubtitleCue = uploadedSubtitles.find(
    (cue) => videoTime >= cue.startSeconds && videoTime <= cue.endSeconds
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

  const syncUploadedVideoTrim = () => {
    const video = uploadedVideoRef.current
    if (!video || !hasTrim) return
    if (video.currentTime < trimStartSeconds || video.currentTime >= trimEndSeconds) {
      video.currentTime = trimStartSeconds
      setVideoTime(trimStartSeconds)
      if (video.currentTime >= trimEndSeconds) {
        video.pause()
      }
    }
  }

  const stopAtTrimEnd = () => {
    const video = uploadedVideoRef.current
    if (video) setVideoTime(video.currentTime)
    if (!video || !hasTrim) return
    if (video.currentTime >= trimEndSeconds) {
      video.pause()
      video.currentTime = trimStartSeconds
      setVideoTime(trimStartSeconds)
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
        Watch a model Part 2 answer while you plan. Use it for ideas, structure, and natural linking — then speak in your own words.
      </p>

      <div className="speakingP2SampleFrame">
        {hasUploadedVideo ? (
          <>
            <video
              ref={uploadedVideoRef}
              className="speakingP2SampleVideo"
              src={sample.videoUrl}
              controls
              preload="metadata"
              controlsList="nodownload"
              onLoadedMetadata={syncUploadedVideoTrim}
              onPlay={syncUploadedVideoTrim}
              onTimeUpdate={stopAtTrimEnd}
              onSeeked={(event) => setVideoTime(event.currentTarget.currentTime)}
              onContextMenu={(event) => event.preventDefault()}
            />
            {activeSubtitleCue?.text ? (
              <div className="speakingP2SampleSubtitleOverlay" style={subtitleOverlayStyle}>
                <span>{activeSubtitleCue.text}</span>
              </div>
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

      <div className="speakingP2SampleFooter">
        <p className="speakingP2SampleNotice">
          For learning inside English Plan only. Streaming preview — not downloadable.
          {sample.uploadedAt ? ` Uploaded ${new Date(sample.uploadedAt).toLocaleDateString()}.` : ''}
          {hasTrim ? ` Trimmed to ${Math.round(trimEndSeconds - trimStartSeconds)}s.` : ''}
        </p>
        {isPlaying && !hasUploadedVideo ? (
          <button type="button" className="speakingP2SampleReplay" onClick={() => setIsPlaying(false)}>
            Close player
          </button>
        ) : null}
      </div>
    </section>
  )
}
