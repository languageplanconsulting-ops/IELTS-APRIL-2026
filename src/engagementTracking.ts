import { useEffect, useMemo, useRef } from 'react'

export const ENGAGEMENT_IDLE_MS = 2 * 60 * 1000
export const ENGAGEMENT_HEARTBEAT_MS = 30 * 1000
export const ENGAGEMENT_TICK_MS = 5 * 1000

export type EngagementContext = {
  page: string
  feature: string
  activityType?: string
  activityId?: string
  label?: string
  metadata?: Record<string, string | number | boolean | null | undefined>
}

type EngagementAuth = {
  accessToken: string
  userId: string
  role: string
}

type ActiveSegment = {
  id: string
  sessionId: string
  contextKey: string
  context: EngagementContext
  startedAt: string
  lastSeenAt: string
  activeMs: number
  lastTickAt: number
  lastSentAt: number
}

const randomId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

const getSessionId = () => {
  if (typeof window === 'undefined') return randomId()
  const key = 'english-plan-engagement-session'
  const existing = window.sessionStorage.getItem(key)
  if (existing) return existing
  const created = randomId()
  window.sessionStorage.setItem(key, created)
  return created
}

export const buildEngagementContextKey = (context: EngagementContext) =>
  [context.page, context.feature, context.activityType || '', context.activityId || ''].join('|')

export const shouldCountEngagement = ({
  visible,
  now,
  lastInteractionAt
}: {
  visible: boolean
  now: number
  lastInteractionAt: number
}) => visible && now - lastInteractionAt <= ENGAGEMENT_IDLE_MS

export const formatEngagementDuration = (seconds: number) => {
  const safe = Math.max(0, Math.round(Number(seconds) || 0))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m`
  return `${safe}s`
}

const sanitizeMetadata = (metadata: EngagementContext['metadata']) =>
  Object.fromEntries(
    Object.entries(metadata || {})
      .filter(([, value]) => value !== undefined)
      .slice(0, 20)
  )

export function useEngagementTracker({
  auth,
  context
}: {
  auth: EngagementAuth | null
  context: EngagementContext | null
}) {
  const authRef = useRef(auth)
  const contextRef = useRef(context)
  const segmentRef = useRef<ActiveSegment | null>(null)
  const lastInteractionRef = useRef(0)
  const wasIdleRef = useRef(false)
  const sessionIdRef = useRef<string>('')

  const contextKey = useMemo(() => (context ? buildEngagementContextKey(context) : ''), [context])

  useEffect(() => {
    authRef.current = auth
  }, [auth])

  useEffect(() => {
    contextRef.current = context
  }, [context])

  useEffect(() => {
    sessionIdRef.current = getSessionId()
  }, [])

  useEffect(() => {
    const flush = (keepalive = false) => {
      const segment = segmentRef.current
      const currentAuth = authRef.current
      if (!segment || !currentAuth?.accessToken || segment.activeMs < 1000) return
      segment.lastSeenAt = new Date().toISOString()
      segment.lastSentAt = performance.now()
      void fetch('/api/engagement/segment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentAuth.accessToken}`
        },
        body: JSON.stringify({
          segmentId: segment.id,
          sessionId: segment.sessionId,
          page: segment.context.page,
          feature: segment.context.feature,
          activityType: segment.context.activityType || '',
          activityId: segment.context.activityId || '',
          label: segment.context.label || '',
          startedAt: segment.startedAt,
          lastSeenAt: segment.lastSeenAt,
          activeSeconds: Math.floor(segment.activeMs / 1000),
          metadata: sanitizeMetadata(segment.context.metadata)
        }),
        keepalive
      }).catch(() => {})
    }

    const startSegment = (nextContext: EngagementContext) => {
      const now = performance.now()
      const isoNow = new Date().toISOString()
      segmentRef.current = {
        id: randomId(),
        sessionId: sessionIdRef.current || getSessionId(),
        contextKey: buildEngagementContextKey(nextContext),
        context: nextContext,
        startedAt: isoNow,
        lastSeenAt: isoNow,
        activeMs: 0,
        lastTickAt: now,
        lastSentAt: now
      }
    }

    const stopSegment = (keepalive = false) => {
      flush(keepalive)
      segmentRef.current = null
    }

    const tick = () => {
      const now = performance.now()
      const currentAuth = authRef.current
      const currentContext = contextRef.current
      const isVisible = document.visibilityState === 'visible'
      const isActive = shouldCountEngagement({
        visible: isVisible,
        now,
        lastInteractionAt: lastInteractionRef.current
      })

      if (!currentAuth?.accessToken || !currentContext) {
        stopSegment()
        return
      }

      const nextKey = buildEngagementContextKey(currentContext)
      if (segmentRef.current && segmentRef.current.contextKey !== nextKey) {
        stopSegment()
      }

      if (!isActive) {
        if (!wasIdleRef.current) stopSegment()
        wasIdleRef.current = true
        return
      }

      if (!segmentRef.current) startSegment(currentContext)
      const segment = segmentRef.current
      if (!segment) return

      const elapsed = Math.min(Math.max(0, now - segment.lastTickAt), ENGAGEMENT_TICK_MS * 1.5)
      segment.activeMs += elapsed
      segment.lastTickAt = now
      segment.lastSeenAt = new Date().toISOString()
      wasIdleRef.current = false

      if (now - segment.lastSentAt >= ENGAGEMENT_HEARTBEAT_MS) flush()
    }

    const noteInteraction = () => {
      const now = performance.now()
      const wasIdle = now - lastInteractionRef.current > ENGAGEMENT_IDLE_MS
      lastInteractionRef.current = now
      if (wasIdle) {
        stopSegment()
        const currentContext = contextRef.current
        if (authRef.current?.accessToken && currentContext && document.visibilityState === 'visible') {
          startSegment(currentContext)
        }
      }
      wasIdleRef.current = false
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        stopSegment(true)
      } else {
        lastInteractionRef.current = performance.now()
      }
    }

    const handlePageHide = () => stopSegment(true)
    const interactionEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    interactionEvents.forEach((eventName) =>
      window.addEventListener(eventName, noteInteraction, { passive: true })
    )
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', handlePageHide)

    lastInteractionRef.current = performance.now()
    const intervalId = window.setInterval(tick, ENGAGEMENT_TICK_MS)
    tick()

    return () => {
      window.clearInterval(intervalId)
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, noteInteraction))
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', handlePageHide)
      stopSegment(true)
    }
  }, [])

  useEffect(() => {
    const segment = segmentRef.current
    if (segment && segment.contextKey !== contextKey) {
      // The tracker loop flushes and rotates immediately on its next short tick.
      segment.lastTickAt = Math.min(segment.lastTickAt, performance.now() - ENGAGEMENT_TICK_MS)
    }
  }, [contextKey])
}
