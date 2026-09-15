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
  targetId?: string
  indent?: number
}

export type GardenDoc = {
  version: number
  nodes: BubbleNodeModel[]
  edges: EdgeModel[]
  docs: Record<string, Block[]>
  colorIndex: number
  updatedAt?: string
}
