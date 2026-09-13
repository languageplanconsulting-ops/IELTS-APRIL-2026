// Cutesy pastel palette for Idea Garden bubbles.
export type PaletteKey =
  | 'bubblegum'
  | 'peach'
  | 'lemon'
  | 'matcha'
  | 'sky'
  | 'lavender'
  | 'mint'

export type Palette = {
  key: PaletteKey
  fill: string
  border: string
  ink: string
  glow: string
}

export const PALETTE: Palette[] = [
  { key: 'bubblegum', fill: '#ffe0ef', border: '#ff9ec4', ink: '#b03a6e', glow: '#ffc2dd' },
  { key: 'peach', fill: '#ffe8d6', border: '#ffb887', ink: '#b5622c', glow: '#ffd0af' },
  { key: 'lemon', fill: '#fff6cf', border: '#ffe07a', ink: '#9a7b17', glow: '#ffeea0' },
  { key: 'matcha', fill: '#d9f5e3', border: '#8fe0b0', ink: '#2f8a5c', glow: '#b6edcd' },
  { key: 'sky', fill: '#d8ecff', border: '#8ec6ff', ink: '#2f6fb0', glow: '#b6dbff' },
  { key: 'lavender', fill: '#e9dcff', border: '#bfa2ff', ink: '#6a49b8', glow: '#d3bfff' },
  { key: 'mint', fill: '#d5f6f2', border: '#84e2d8', ink: '#2b8a80', glow: '#aeeee7' }
]

export function paletteFor(key: string | undefined): Palette {
  return PALETTE.find((p) => p.key === key) || PALETTE[0]
}

export function nextColor(index: number): PaletteKey {
  return PALETTE[index % PALETTE.length].key
}
