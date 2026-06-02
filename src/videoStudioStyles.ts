// Premade subtitle styles for the admin Video Studio. Each style is a
// CSS preview spec + a render-instruction hint embedded in the export JSON
// so an external AI / editor can reproduce the look.

export type VideoStudioStyleId =
  | 'normal'
  | 'floating-label-blue'
  | 'floating-label-yellow'
  | 'bold-thai-display'
  | 'news-card-bottom'
  | 'news-card-overlay'
  | 'accent-stamp-red'
  | 'tilted-stamp'
  | 'caption-pill'
  | 'bilingual-stack'
  | 'vocab-callout'
  | 'gradient-bar'

export type VideoStudioStylePreview = {
  background: string
  color: string
  fontFamily: string
  fontWeight: number | string
  fontSize: string
  padding: string
  borderRadius: string
  border?: string
  boxShadow?: string
  textTransform?: 'none' | 'uppercase'
  letterSpacing?: string
  transform?: string
  textShadow?: string
}

export type VideoStudioStyleDefinition = {
  id: VideoStudioStyleId
  label: string
  description: string
  // Position on the video (percent of width/height). 0,0 = top-left.
  anchor: { xPercent: number; yPercent: number; align: 'left' | 'center' | 'right' }
  preview: VideoStudioStylePreview
  // Render hint exported in JSON for the external AI.
  renderHint: {
    family: string
    weight: number | string
    sizeRem: number
    fillHex: string
    strokeHex?: string
    backgroundHex?: string
    tiltDeg?: number
    animationIn?: 'fade' | 'pop' | 'slide-up' | 'typewriter' | 'stamp'
    animationOut?: 'fade' | 'pop' | 'slide-down'
    notes?: string
  }
}

export const VIDEO_STUDIO_STYLES: VideoStudioStyleDefinition[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Plain caption — clean white text with shadow.',
    anchor: { xPercent: 50, yPercent: 88, align: 'center' },
    preview: {
      background: 'transparent',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 700,
      fontSize: '1.1rem',
      padding: '6px 0',
      borderRadius: '0',
      textShadow: '0 2px 6px rgba(0,0,0,0.85)'
    },
    renderHint: {
      family: 'Inter / Noto Sans Thai',
      weight: 700,
      sizeRem: 1.5,
      fillHex: '#ffffff',
      strokeHex: '#000000',
      animationIn: 'fade',
      animationOut: 'fade'
    }
  },
  {
    id: 'floating-label-blue',
    label: 'Floating Blue Label',
    description: 'Rounded blue badge floating beside subject (e.g., นักปรัชญา).',
    anchor: { xPercent: 22, yPercent: 30, align: 'left' },
    preview: {
      background: '#1d4ed8',
      color: '#ffffff',
      fontFamily: 'Noto Sans Thai, Inter, sans-serif',
      fontWeight: 900,
      fontSize: '1.05rem',
      padding: '8px 16px',
      borderRadius: '999px',
      boxShadow: '0 6px 16px rgba(29,78,216,0.4)'
    },
    renderHint: {
      family: 'Noto Sans Thai Bold',
      weight: 900,
      sizeRem: 1.4,
      fillHex: '#ffffff',
      backgroundHex: '#1d4ed8',
      animationIn: 'pop',
      animationOut: 'fade',
      notes: 'Floating badge anchored near the subject, with mild bounce on entry.'
    }
  },
  {
    id: 'floating-label-yellow',
    label: 'Floating Yellow Label',
    description: 'Yellow highlight badge — great for callouts.',
    anchor: { xPercent: 76, yPercent: 28, align: 'right' },
    preview: {
      background: '#facc15',
      color: '#111827',
      fontFamily: 'Noto Sans Thai, Inter, sans-serif',
      fontWeight: 900,
      fontSize: '1.05rem',
      padding: '8px 16px',
      borderRadius: '12px',
      boxShadow: '0 6px 16px rgba(202,138,4,0.35)'
    },
    renderHint: {
      family: 'Noto Sans Thai Bold',
      weight: 900,
      sizeRem: 1.4,
      fillHex: '#111827',
      backgroundHex: '#facc15',
      animationIn: 'pop',
      animationOut: 'fade'
    }
  },
  {
    id: 'bold-thai-display',
    label: 'Bold Thai Display',
    description: 'Huge bold Thai display text, centered.',
    anchor: { xPercent: 50, yPercent: 18, align: 'center' },
    preview: {
      background: 'transparent',
      color: '#ffffff',
      fontFamily: 'Noto Sans Thai, Inter, sans-serif',
      fontWeight: 900,
      fontSize: '1.6rem',
      padding: '4px 8px',
      borderRadius: '0',
      letterSpacing: '0.01em',
      textShadow: '0 4px 12px rgba(0,0,0,0.7)'
    },
    renderHint: {
      family: 'Noto Sans Thai Black',
      weight: 900,
      sizeRem: 2.4,
      fillHex: '#ffffff',
      strokeHex: '#000000',
      animationIn: 'slide-up',
      animationOut: 'fade'
    }
  },
  {
    id: 'news-card-bottom',
    label: 'News Card (bottom)',
    description: 'Bottom white card with headline + subhead — news look.',
    anchor: { xPercent: 50, yPercent: 78, align: 'center' },
    preview: {
      background: '#ffffff',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 800,
      fontSize: '0.98rem',
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 6px 14px rgba(15,23,42,0.25)'
    },
    renderHint: {
      family: 'Inter Bold',
      weight: 800,
      sizeRem: 1.25,
      fillHex: '#0f172a',
      backgroundHex: '#ffffff',
      animationIn: 'slide-up',
      animationOut: 'slide-down'
    }
  },
  {
    id: 'news-card-overlay',
    label: 'News Card (overlay)',
    description: 'Big bold black text on light card, centered.',
    anchor: { xPercent: 50, yPercent: 50, align: 'center' },
    preview: {
      background: '#fefce8',
      color: '#111827',
      fontFamily: 'Noto Sans Thai, Inter, sans-serif',
      fontWeight: 900,
      fontSize: '1.3rem',
      padding: '14px 22px',
      borderRadius: '12px',
      border: '3px solid #111827',
      boxShadow: '6px 6px 0 #111827'
    },
    renderHint: {
      family: 'Noto Sans Thai Black',
      weight: 900,
      sizeRem: 2.0,
      fillHex: '#111827',
      backgroundHex: '#fefce8',
      strokeHex: '#111827',
      animationIn: 'stamp',
      animationOut: 'fade'
    }
  },
  {
    id: 'accent-stamp-red',
    label: 'Accent Stamp (red)',
    description: 'Bold red accent stamp, all-caps. Great for keywords.',
    anchor: { xPercent: 80, yPercent: 14, align: 'right' },
    preview: {
      background: '#dc2626',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 900,
      fontSize: '0.9rem',
      padding: '6px 10px',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      transform: 'rotate(-6deg)',
      boxShadow: '0 4px 10px rgba(127,29,29,0.5)'
    },
    renderHint: {
      family: 'Inter Black',
      weight: 900,
      sizeRem: 1.1,
      fillHex: '#ffffff',
      backgroundHex: '#dc2626',
      tiltDeg: -6,
      animationIn: 'stamp',
      animationOut: 'fade',
      notes: 'Letterspacing 0.1em, uppercase, tilted -6deg.'
    }
  },
  {
    id: 'tilted-stamp',
    label: 'Tilted Stamp',
    description: 'Tilted text stamp — e.g., "คือข่าวดี".',
    anchor: { xPercent: 70, yPercent: 40, align: 'center' },
    preview: {
      background: '#ffffff',
      color: '#dc2626',
      fontFamily: 'Noto Sans Thai, Inter, sans-serif',
      fontWeight: 900,
      fontSize: '1.4rem',
      padding: '8px 14px',
      borderRadius: '8px',
      transform: 'rotate(-8deg)',
      border: '3px solid #dc2626',
      boxShadow: '4px 4px 0 #7f1d1d'
    },
    renderHint: {
      family: 'Noto Sans Thai Black',
      weight: 900,
      sizeRem: 2.1,
      fillHex: '#dc2626',
      backgroundHex: '#ffffff',
      strokeHex: '#dc2626',
      tiltDeg: -8,
      animationIn: 'stamp',
      animationOut: 'pop'
    }
  },
  {
    id: 'caption-pill',
    label: 'Caption Pill',
    description: 'Pill caption pinned bottom-center.',
    anchor: { xPercent: 50, yPercent: 90, align: 'center' },
    preview: {
      background: 'rgba(15,23,42,0.85)',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
      padding: '8px 16px',
      borderRadius: '999px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
    },
    renderHint: {
      family: 'Inter SemiBold',
      weight: 700,
      sizeRem: 1.3,
      fillHex: '#ffffff',
      backgroundHex: '#0f172a',
      animationIn: 'fade',
      animationOut: 'fade'
    }
  },
  {
    id: 'bilingual-stack',
    label: 'Bilingual Stack',
    description: 'Thai on top, English translation below.',
    anchor: { xPercent: 50, yPercent: 82, align: 'center' },
    preview: {
      background: 'rgba(0,0,0,0.7)',
      color: '#ffffff',
      fontFamily: 'Noto Sans Thai, Inter, sans-serif',
      fontWeight: 800,
      fontSize: '1rem',
      padding: '10px 16px',
      borderRadius: '10px'
    },
    renderHint: {
      family: 'Noto Sans Thai / Inter',
      weight: 800,
      sizeRem: 1.3,
      fillHex: '#ffffff',
      backgroundHex: '#000000',
      animationIn: 'fade',
      animationOut: 'fade',
      notes: 'Two-line stack: Thai (top, larger) + English translation (below, 80% size).'
    }
  },
  {
    id: 'vocab-callout',
    label: 'Vocab Callout',
    description: 'Highlight one vocab word in a box, dim the rest.',
    anchor: { xPercent: 50, yPercent: 88, align: 'center' },
    preview: {
      background: 'transparent',
      color: '#94a3b8',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 700,
      fontSize: '1.05rem',
      padding: '6px 0',
      borderRadius: '0'
    },
    renderHint: {
      family: 'Inter Bold',
      weight: 700,
      sizeRem: 1.4,
      fillHex: '#94a3b8',
      animationIn: 'fade',
      animationOut: 'fade',
      notes: 'Use the first capitalized word OR the word inside [[brackets]] as the highlighted vocab — render it in yellow #facc15, larger, with the rest of the line dimmed.'
    }
  },
  {
    id: 'gradient-bar',
    label: 'Gradient Bar',
    description: 'Bottom gradient bar with white text.',
    anchor: { xPercent: 50, yPercent: 92, align: 'center' },
    preview: {
      background: 'linear-gradient(90deg, #4338ca 0%, #db2777 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 800,
      fontSize: '1.05rem',
      padding: '10px 18px',
      borderRadius: '0',
      boxShadow: '0 -4px 14px rgba(0,0,0,0.3)'
    },
    renderHint: {
      family: 'Inter Bold',
      weight: 800,
      sizeRem: 1.3,
      fillHex: '#ffffff',
      backgroundHex: 'linear-gradient(90deg,#4338ca,#db2777)',
      animationIn: 'slide-up',
      animationOut: 'slide-down'
    }
  }
]

export const VIDEO_STUDIO_STYLE_MAP: Record<VideoStudioStyleId, VideoStudioStyleDefinition> =
  VIDEO_STUDIO_STYLES.reduce((acc, style) => {
    acc[style.id] = style
    return acc
  }, {} as Record<VideoStudioStyleId, VideoStudioStyleDefinition>)

export const DEFAULT_VIDEO_STUDIO_STYLE: VideoStudioStyleId = 'normal'

// ---- Marker enums shared with the export JSON. ----

export type VideoStudioZoomLevel = 1 | 2 | 3 | 4
export const VIDEO_STUDIO_ZOOM_SCALES: Record<VideoStudioZoomLevel, number> = {
  1: 1.1,
  2: 1.25,
  3: 1.5,
  4: 2.0
}

export type VideoStudioTransitionKind = 'fade' | 'cut' | 'whip-pan' | 'book-flip'
export const VIDEO_STUDIO_TRANSITIONS: Array<{ id: VideoStudioTransitionKind; label: string; defaultDurationMs: number }> = [
  { id: 'fade', label: 'Fade', defaultDurationMs: 350 },
  { id: 'cut', label: 'Hard Cut', defaultDurationMs: 0 },
  { id: 'whip-pan', label: 'Whip Pan', defaultDurationMs: 280 },
  { id: 'book-flip', label: 'Book Flip', defaultDurationMs: 520 }
]

export type VideoStudioSfxKind = 'book-flip' | 'whoosh' | 'swoosh' | 'ding' | 'impact'
export const VIDEO_STUDIO_SFX: Array<{ id: VideoStudioSfxKind; label: string; pairsWithTransition?: VideoStudioTransitionKind }> = [
  { id: 'book-flip', label: 'Book Flip', pairsWithTransition: 'book-flip' },
  { id: 'whoosh', label: 'Whoosh', pairsWithTransition: 'whip-pan' },
  { id: 'swoosh', label: 'Swoosh' },
  { id: 'ding', label: 'Ding' },
  { id: 'impact', label: 'Impact' }
]

export type VideoStudioCameraPanKind = 'left' | 'right' | 'up' | 'down' | 'orbit-cw' | 'orbit-ccw'
export const VIDEO_STUDIO_CAMERA_PANS: Array<{ id: VideoStudioCameraPanKind; label: string }> = [
  { id: 'left', label: 'Pan Left' },
  { id: 'right', label: 'Pan Right' },
  { id: 'up', label: 'Pan Up' },
  { id: 'down', label: 'Pan Down' },
  { id: 'orbit-cw', label: 'Orbit (CW)' },
  { id: 'orbit-ccw', label: 'Orbit (CCW)' }
]

export type VideoStudioTextAnimation =
  | 'fade'
  | 'pop'
  | 'slide-up'
  | 'slide-down'
  | 'typewriter'
  | 'stamp'
  | 'bounce'
  | 'shake'
export const VIDEO_STUDIO_TEXT_ANIMATIONS: VideoStudioTextAnimation[] = [
  'fade',
  'pop',
  'slide-up',
  'slide-down',
  'typewriter',
  'stamp',
  'bounce',
  'shake'
]

export type VideoStudioExportQuality = '720p' | '1080p' | '4k'
