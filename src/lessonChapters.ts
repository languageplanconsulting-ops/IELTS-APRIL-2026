import { useEffect, useState } from 'react'

/**
 * Clickable chapter markers for the writing-course videos.
 *
 * Built by scripts/build-lesson-chapters.mjs: boundaries come from pauses in a
 * Deepgram nova-3 Thai transcript, headings from Claude reading each stretch.
 * Files live in public/lesson-chapters/, keyed by lesson id, and are fetched
 * lazily — there are 79 of them and none belongs in the bundle.
 *
 * Coverage is partial by design: lessons whose video hasn't been uploaded have
 * no file, and lessons under four minutes ship an empty `chapters` array
 * because a single marker is the same as none. Callers must treat both as
 * normal and simply not offer the chapter rail.
 */
export type LessonChapter = {
  /** Start time in seconds. */
  s: number
  /** End time in seconds. */
  e: number
  title: string
}

export type LessonChapterTrack = {
  id: string
  /** Video length in seconds, as Deepgram measured it. */
  duration: number
  /** Deepgram's overall transcript confidence, for spotting lessons to re-check. */
  confidence: number | null
  chapters: LessonChapter[]
}

/** Resolved tracks and known-missing ids, so a 404 is never re-fetched. */
const trackCache = new Map<string, LessonChapterTrack | null>()
const inFlight = new Map<string, Promise<LessonChapterTrack | null>>()

const fetchTrack = (lessonId: string): Promise<LessonChapterTrack | null> => {
  const pending = inFlight.get(lessonId)
  if (pending) return pending
  const request = fetch(`/lesson-chapters/${lessonId}.json`)
    .then((response) => (response.ok ? (response.json() as Promise<LessonChapterTrack>) : null))
    .catch(() => null)
    .then((track) => {
      trackCache.set(lessonId, track)
      inFlight.delete(lessonId)
      return track
    })
  inFlight.set(lessonId, request)
  return request
}

/**
 * Chapters for the lesson currently open. Returns null while loading and when
 * the lesson has no chapter file.
 */
export const useLessonChapters = (lessonId: string | undefined): LessonChapterTrack | null => {
  const key = lessonId ?? ''
  const [track, setTrack] = useState<LessonChapterTrack | null>(() => trackCache.get(key) ?? null)

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

/** Index of the chapter covering `position`, or -1 before the first one starts. */
export const findActiveChapterIndex = (chapters: LessonChapter[], position: number): number => {
  let low = 0
  let high = chapters.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    const chapter = chapters[mid]
    if (position < chapter.s) high = mid - 1
    else if (position >= chapter.e) low = mid + 1
    else return mid
  }
  return -1
}

/** `7:05` — the form the student sees next to each heading. */
export const formatChapterTime = (seconds: number): string => {
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  return `${minutes}:${String(total % 60).padStart(2, '0')}`
}

/**
 * Bunny's player takes a start offset on the embed URL, so jumping to a chapter
 * is a src change rather than a postMessage handshake.
 */
export const bunnyEmbedUrlAt = (bunnyVideoId: string, seconds: number): string =>
  `https://iframe.mediadelivery.net/embed/712721/${bunnyVideoId}?autoplay=true&t=${Math.round(seconds)}`
