import { useState } from 'react'
import {
  getSpeakingPart2SampleEmbedUrl,
  getSpeakingPart2SampleThumbUrl,
  type SpeakingPart2SampleVideo
} from './speakingPart2SampleVideos'
import './SpeakingPart2SampleVideo.css'

export function SpeakingPart2SampleBadge() {
  return (
    <div className="speakingP2SampleBadge" aria-label="พี่โดย speaking sample available">
      <span className="speakingP2SampleBadgePlay" aria-hidden>
        ▶
      </span>
      <span>
        <strong>พี่โดย sample</strong>
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
  const embedUrl = getSpeakingPart2SampleEmbedUrl(sample.driveFileId)
  const thumbUrl = getSpeakingPart2SampleThumbUrl(sample.driveFileId)

  return (
    <section
      className="speakingP2SamplePanel"
      aria-label={`พี่โดย speaking sample: ${sample.shortLabel}`}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="speakingP2SamplePanelHeader">
        <span className="speakingP2SampleKicker">พี่โดย · P&apos;Doy</span>
        <span className="speakingP2SampleTopicPill">{sample.shortLabel}</span>
      </div>
      <h4 className="speakingP2SampleTitle">{sample.topicLabel}</h4>
      <p className="speakingP2SampleLead">
        Watch a model Part 2 answer while you plan. Use it for ideas, structure, and natural linking — then speak in your own words.
      </p>

      <div className="speakingP2SampleFrame">
        {!isPlaying ? (
          <button
            type="button"
            className="speakingP2SampleLaunch"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play พี่โดย speaking sample for ${sample.shortLabel}`}
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
            title={`พี่โดย speaking sample — ${sample.shortLabel}`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      <div className="speakingP2SampleFooter">
        <p className="speakingP2SampleNotice">
          For learning inside English Plan only. Streaming preview — not downloadable.
        </p>
        {isPlaying ? (
          <button type="button" className="speakingP2SampleReplay" onClick={() => setIsPlaying(false)}>
            Close player
          </button>
        ) : null}
      </div>
    </section>
  )
}
