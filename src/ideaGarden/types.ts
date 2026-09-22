import type { PaletteKey } from './palette'

export type BubbleKind = 'central' | 'sub'

export type BubbleData = {
  label: string
  kind: BubbleKind
  color: PaletteKey
  start: string
  end: string
  font?: string
  shape?: string
}

export type BubbleNodeModel = {
  id: string
  type: 'bubble'
  position: { x: number; y: number }
  data: BubbleData
  width?: number // set once the bubble is resized by hand (drag its edges/corners)
  height?: number
}

export type EdgeModel = {
  id: string
  source: string
  target: string
  type?: string
}

export type BlockType =
  | 'text'
  | 'h1'
  | 'h2'
  | 'todo'
  | 'callout'
  | 'divider'
  | 'youtube'
  | 'file'
  | 'image'
  | 'pagelink'
  | 'subpage'
  | 'table'
  | 'status'
  | 'bullet'
  | 'toggle'
  | 'columns'
  | 'diagram'

export type StatusOption = { label: string; color: string }

export type DiagramNode = {
  id: string
  position: { x: number; y: number }
  label: string
  shape?: string
  color?: string
}
export type DiagramData = {
  orientation?: 'portrait' | 'landscape'
  nodes: DiagramNode[]
  edges: { id: string; source: string; target: string }[]
}

export type Block = {
  id: string
  type: BlockType
  text?: string
  checked?: boolean
  url?: string
  // file attachments live in Supabase; we keep the storage path + display meta
  filePath?: string
  fileName?: string
  fileType?: string
  fileSize?: number
  width?: number // image: display width in px (user-resizable)
  targetId?: string
  indent?: number
  pageId?: string // subpage: id of the child page (docs[pageId] holds its blocks)
  rows?: string[][] // table (legacy: plain-text cells)
  cells?: Block[][][] // table grid[row][col] = a cell's own list of blocks
  colWidths?: number[] // table: column widths in px (resizable)
  rowHeights?: number[] // table: minimum row heights in px (resizable)
  diagram?: DiagramData // diagram: an A4 board of bubbles + arrows
  cols?: Block[][] // columns: each column is its own list of blocks, side by side
  children?: Block[] // toggle (dropdown): the folded content
  open?: boolean // toggle: expanded?
  bullet?: string // bullet list item: style key (dot, flower, heart, star, arrow)
  status?: string // status pill: selected label
  statusOptions?: StatusOption[] // status pill: available options
}

// A task on a page's to-do list. `blockId` links it to a line on that page
// (added via right-click → "Add to to-do list"); its text then follows the line.
export type TodoTask = { id: string; text: string; done: boolean; blockId?: string }

export type GardenDoc = {
  version: number
  nodes: BubbleNodeModel[]
  edges: EdgeModel[]
  docs: Record<string, Block[]>
  pages?: Record<string, { title: string }> // titles of inline sub-pages
  tasks?: Record<string, TodoTask[]> // per-page to-do lists (page id = bubble id or sub-page id)
  colorIndex: number
  updatedAt?: string
}
