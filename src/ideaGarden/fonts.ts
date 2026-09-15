// Font options for the Idea Garden — 4 formal + 6 cute/handwritten.
export type FontOption = { key: string; label: string; group: 'Cute & handwritten' | 'Formal'; stack: string }

export const FONTS: FontOption[] = [
  { key: 'quicksand', label: 'Quicksand', group: 'Cute & handwritten', stack: "'Quicksand', sans-serif" },
  { key: 'baloo', label: 'Baloo 2', group: 'Cute & handwritten', stack: "'Baloo 2', system-ui, sans-serif" },
  { key: 'caveat', label: 'Caveat', group: 'Cute & handwritten', stack: "'Caveat', cursive" },
  { key: 'patrick', label: 'Patrick Hand', group: 'Cute & handwritten', stack: "'Patrick Hand', cursive" },
  { key: 'gochi', label: 'Gochi Hand', group: 'Cute & handwritten', stack: "'Gochi Hand', cursive" },
  { key: 'shantell', label: 'Shantell Sans', group: 'Cute & handwritten', stack: "'Shantell Sans', cursive" },
  { key: 'inter', label: 'Inter', group: 'Formal', stack: "'Inter', system-ui, sans-serif" },
  { key: 'lora', label: 'Lora', group: 'Formal', stack: "'Lora', Georgia, serif" },
  { key: 'merriweather', label: 'Merriweather', group: 'Formal', stack: "'Merriweather', Georgia, serif" },
  { key: 'robotoslab', label: 'Roboto Slab', group: 'Formal', stack: "'Roboto Slab', Georgia, serif" }
]

export const DEFAULT_FONT = 'quicksand'

export function fontStack(key: string | undefined): string {
  return (FONTS.find((f) => f.key === key) || FONTS[0]).stack
}

// Bubble shapes — 5 forms for the mindmap cards.
export type ShapeOption = { key: string; label: string; emoji: string }

export const SHAPES: ShapeOption[] = [
  { key: 'rounded', label: 'Rounded', emoji: '▢' },
  { key: 'pill', label: 'Pill', emoji: '⬭' },
  { key: 'blob', label: 'Blob', emoji: '🫧' },
  { key: 'note', label: 'Sticky note', emoji: '🗒️' },
  { key: 'petal', label: 'Petal', emoji: '🌸' }
]

export const DEFAULT_SHAPE = 'rounded'
