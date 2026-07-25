import { useEffect, useMemo, useRef, useState } from 'react'

import { getCambridgeListeningKeyForUrl } from './listeningCambridgeAudioUrls'

/**
 * Timed subtitles for Cambridge listening audio.
 *
 * Cue text is the canonical Cambridge script; only the timings come from
 * whisper.cpp (see scripts/build-listening-captions.mjs). Files live in
 * public/listening-captions/, keyed `${book}-${test}-${part}`, and are fetched
 * lazily — there are 124 of them and none belongs in the bundle.
 *
 * Coverage is partial: books 10-14 have parts 2 and 4 only, book 18 part 2 only,
 * and book 21 none, because no script exists for the rest. Callers must treat an
 * absent file as normal and simply not offer subtitles.
 */
export type ListeningCaptionCue = {
  /** Start time in seconds. */
  s: number
  /** End time in seconds. */
  e: number
  speaker: string | null
  text: string
}

export type ListeningCaptionTrack = {
  key: string
  duration: number
  /** Share of script words matched to a real whisper timing; the rest interpolated. */
  coverage: number
  cues: ListeningCaptionCue[]
}

/** Resolved tracks and known-missing keys, so a 404 is never re-fetched. */
const trackCache = new Map<string, ListeningCaptionTrack | null>()
const inFlight = new Map<string, Promise<ListeningCaptionTrack | null>>()

const fetchTrack = (key: string): Promise<ListeningCaptionTrack | null> => {
  const cached = inFlight.get(key)
  if (cached) return cached
  const request = fetch(`/listening-captions/${key}.json`)
    .then((response) => (response.ok ? (response.json() as Promise<ListeningCaptionTrack>) : null))
    .catch(() => null)
    .then((track) => {
      trackCache.set(key, track)
      inFlight.delete(key)
      return track
    })
  inFlight.set(key, request)
  return request
}

/**
 * Loads the caption track for whichever audio URL is playing. Returns null while
 * loading and when no captions exist for that section.
 */
export const useListeningCaptions = (audioUrl: string | undefined): ListeningCaptionTrack | null => {
  const key = audioUrl ? getCambridgeListeningKeyForUrl(audioUrl) : ''
  const [track, setTrack] = useState<ListeningCaptionTrack | null>(() => trackCache.get(key) ?? null)

  useEffect(() => {
    if (!key) {
      setTrack(null)
      return
    }
    if (trackCache.has(key)) {
      setTrack(trackCache.get(key) ?? null)
      return
    }
    let active = true
    void fetchTrack(key).then((resolved) => {
      if (active) setTrack(resolved)
    })
    return () => {
      active = false
    }
  }, [key])

  return track
}

/**
 * Index of the cue covering `position`, or -1 in the gaps between cues (exam
 * intros, pauses, the closing announcement — none of which are in the script).
 *
 * Binary search rather than a scan: this runs on every timeupdate, ~4x a second,
 * against a few hundred cues.
 */
export const findActiveCueIndex = (cues: ListeningCaptionCue[], position: number): number => {
  let low = 0
  let high = cues.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    const cue = cues[mid]
    if (position < cue.s) high = mid - 1
    else if (position >= cue.e) low = mid + 1
    else return mid
  }
  return -1
}

/**
 * The cue to display, held through inter-cue gaps so a subtitle doesn't flicker
 * off during a natural pause. Cleared only when playback jumps backwards (a seek)
 * or leaves the captioned stretch entirely.
 */
export const useActiveCaptionCue = (
  track: ListeningCaptionTrack | null,
  position: number,
  enabled: boolean,
): ListeningCaptionCue | null => {
  const lastIndexRef = useRef(-1)
  const [, forceRender] = useState(0)

  const index = useMemo(() => {
    if (!track || !enabled) return -1
    const found = findActiveCueIndex(track.cues, position)
    if (found !== -1) {
      lastIndexRef.current = found
      return found
    }
    const previous = lastIndexRef.current
    if (previous === -1) return -1
    const cue = track.cues[previous]
    // Keep the previous line up across a short gap, but drop it on a seek away.
    if (position >= cue.e && position < cue.e + 2) return previous
    lastIndexRef.current = -1
    return -1
  }, [track, position, enabled])

  useEffect(() => {
    if (!enabled) {
      lastIndexRef.current = -1
      forceRender((value) => value + 1)
    }
  }, [enabled])

  return index === -1 || !track ? null : track.cues[index]
}
