// Resume state for lesson videos.
//
// Why this exists: the single cheapest thing that helps a learner who gets
// interrupted is not having to find their place again. Suspended goals decay —
// what brings them back is a cue that reinstates exactly where they were
// (Altmann & Trafton's memory-for-goals work is the clean statement of this).
// So we persist the *exact second* the video reached, plus which lesson it was,
// and hand both back on return.
//
// Two deliberate choices:
//
// 1. Position is stored per lesson, not just "last lesson." A learner who
//    half-watches three lessons should get all three back where they were, not
//    only the most recent one.
//
// 2. We never resume within the last few seconds of a video. Landing a learner
//    at 14:58 of a 15:00 lesson is worse than starting it over — it reads as
//    broken. Past that threshold the lesson is treated as watched-through and
//    resume is cleared.

/** Seconds from the end within which we treat the lesson as finished, not paused. */
const END_TOLERANCE_SECONDS = 15

/** Don't bother resuming a few seconds in — the learner hasn't lost their place yet. */
const MIN_RESUME_SECONDS = 10

export type LessonResumeEntry = {
  /** Playback position in whole seconds. */
  seconds: number
  /** Video length in whole seconds, when the player reported it. */
  duration: number
  /** Epoch ms of the last update — used to pick the most recent lesson. */
  updatedAt: number
}

export type ResumeMap = Record<string, LessonResumeEntry>

/**
 * The lesson to offer as "continue" — the most recently watched one that is
 * genuinely mid-way through. Returns null when there's nothing worth resuming.
 */
export function pickResumeLesson(resume: ResumeMap): { lessonId: string; entry: LessonResumeEntry } | null {
  let best: { lessonId: string; entry: LessonResumeEntry } | null = null
  for (const [lessonId, entry] of Object.entries(resume)) {
    if (!isResumable(entry)) continue
    if (!best || entry.updatedAt > best.entry.updatedAt) best = { lessonId, entry }
  }
  return best
}

export function isResumable(entry: LessonResumeEntry | undefined): entry is LessonResumeEntry {
  if (!entry) return false
  if (entry.seconds < MIN_RESUME_SECONDS) return false
  if (entry.duration > 0 && entry.seconds >= entry.duration - END_TOLERANCE_SECONDS) return false
  return true
}

/** "7:34" / "1:02:09" — the position shown next to a resume prompt. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}

/** Whole minutes remaining, for "เหลืออีก N นาที". Always at least 1 when unfinished. */
export function minutesLeft(entry: LessonResumeEntry): number {
  if (!entry.duration) return 0
  return Math.max(1, Math.round((entry.duration - entry.seconds) / 60))
}

/**
 * Builds the Bunny embed URL.
 *
 * `t` is Bunny's start-offset parameter; `autoplay` is what makes "continue"
 * a single tap rather than a tap plus a play press. We only autoplay when we're
 * deliberately resuming or continuing — never on a plain lesson open, because
 * a video that starts talking on its own is exactly the kind of uncontrolled
 * event that makes an interface hostile to sensory-sensitive learners.
 */
export function buildEmbedUrl(opts: {
  libraryId: string
  videoId: string
  startSeconds?: number
  autoplay?: boolean
}): string {
  const params = new URLSearchParams()
  params.set('autoplay', opts.autoplay ? 'true' : 'false')
  if (opts.startSeconds && opts.startSeconds >= MIN_RESUME_SECONDS) {
    params.set('t', String(Math.floor(opts.startSeconds)))
  }
  return `https://iframe.mediadelivery.net/embed/${opts.libraryId}/${opts.videoId}?${params.toString()}`
}

/**
 * Subscribes to a Bunny iframe's playback position via the Player.js protocol
 * that Bunny's embed speaks.
 *
 * Bunny announces itself with a `ready` event; we then register for
 * `timeupdate` and get `{seconds, duration}` back a few times a second. We
 * throttle writes hard — persisting on every tick would hammer localStorage for
 * no benefit.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToPlaybackPosition(
  iframe: HTMLIFrameElement,
  onPosition: (seconds: number, duration: number) => void,
  options?: { throttleMs?: number }
): () => void {
  const throttleMs = options?.throttleMs ?? 5000
  let lastWrite = 0
  let disposed = false

  const post = (method: string, value?: unknown) => {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ context: 'player.js', version: '0.0.1', method, value }),
      '*'
    )
  }

  const handleMessage = (event: MessageEvent) => {
    if (disposed) return
    if (event.source !== iframe.contentWindow) return

    let data: { context?: string; event?: string; value?: { seconds?: number; duration?: number } }
    try {
      data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
    } catch {
      return
    }
    if (!data || data.context !== 'player.js') return

    if (data.event === 'ready') {
      post('addEventListener', 'timeupdate')
      post('addEventListener', 'pause')
      post('addEventListener', 'ended')
      return
    }

    const seconds = data.value?.seconds
    const duration = data.value?.duration
    if (typeof seconds !== 'number') return

    // Pause and end are the moments most worth capturing exactly, so they
    // bypass the throttle — that's precisely when someone walks away.
    const isBoundaryEvent = data.event === 'pause' || data.event === 'ended'
    const now = Date.now()
    if (!isBoundaryEvent && now - lastWrite < throttleMs) return
    lastWrite = now

    onPosition(Math.floor(seconds), Math.floor(duration ?? 0))
  }

  window.addEventListener('message', handleMessage)
  // Bunny may already be ready if the iframe loaded before we attached.
  post('addEventListener', 'timeupdate')

  return () => {
    disposed = true
    window.removeEventListener('message', handleMessage)
  }
}
