import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

const VIEWPORT_MARGIN = 12
const ANCHOR_GAP = 8

type Placement = {
  left: number
  top: number
  origin: string
  maxHeight: number | null
}

/**
 * Click-to-reveal vocab card. Rendered into document.body so it can never be
 * clipped by the scrolling passage panel, then positioned against the clicked
 * word: below when there is room, flipped above when there is not, and always
 * clamped inside the viewport.
 */
export function VocabPopover({
  anchorRef,
  leaving,
  onAnimationEnd,
  children
}: {
  anchorRef: RefObject<HTMLElement | null>
  leaving?: boolean
  onAnimationEnd?: () => void
  children: ReactNode
}) {
  const popoverRef = useRef<HTMLSpanElement | null>(null)
  const [placement, setPlacement] = useState<Placement | null>(null)

  useLayoutEffect(() => {
    const node = popoverRef.current
    const anchor = anchorRef.current
    if (!node || !anchor) return

    const rects = anchor.getClientRects()
    const fallback = anchor.getBoundingClientRect()
    const first = rects[0] || fallback
    const last = rects[rects.length - 1] || fallback

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth
    const viewportHeight = window.innerHeight
    const width = node.offsetWidth
    const height = node.offsetHeight
    const roomLimit = viewportHeight - VIEWPORT_MARGIN * 2

    let left = first.left
    if (left + width > viewportWidth - VIEWPORT_MARGIN) left = viewportWidth - VIEWPORT_MARGIN - width
    if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN

    const below = last.bottom + ANCHOR_GAP
    const above = first.top - ANCHOR_GAP - height
    let top = below
    let origin = 'top left'
    if (below + height > viewportHeight - VIEWPORT_MARGIN && above >= VIEWPORT_MARGIN) {
      top = above
      origin = 'bottom left'
    } else if (top + height > viewportHeight - VIEWPORT_MARGIN) {
      top = Math.max(VIEWPORT_MARGIN, viewportHeight - VIEWPORT_MARGIN - height)
    }

    setPlacement({ left, top, origin, maxHeight: height > roomLimit ? roomLimit : null })
  }, [anchorRef])

  return createPortal(
    <span
      ref={popoverRef}
      className={`vocabHiPopover ${leaving ? 'is-leaving' : ''}`.trim()}
      role="dialog"
      style={{
        left: placement ? `${placement.left}px` : '0px',
        top: placement ? `${placement.top}px` : '0px',
        transformOrigin: placement ? placement.origin : 'top left',
        maxHeight: placement?.maxHeight ? `${placement.maxHeight}px` : undefined,
        overflowY: placement?.maxHeight ? 'auto' : undefined,
        visibility: placement ? 'visible' : 'hidden'
      }}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </span>,
    document.body
  )
}
