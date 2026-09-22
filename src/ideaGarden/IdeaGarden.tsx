import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  reconnectEdge,
  useInternalNode,
  NodeResizer,
  ConnectionMode,
  MarkerType
} from '@xyflow/react'
import type { NodeProps, EdgeProps, Connection, NodeChange, EdgeChange, Edge, InternalNode } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './IdeaGarden.css'
import { paletteFor, nextColor } from './palette'
import type { PaletteKey } from './palette'
import { FONTS, SHAPES, fontStack, DEFAULT_FONT, DEFAULT_SHAPE } from './fonts'
import type { BubbleData, BubbleNodeModel, EdgeModel, Block, BlockType, GardenDoc, TodoTask } from './types'
import { todosFor, progressOf, patchDeep, plainText, TodoDock, TodoRecap } from './todos'
import type { TodoItem } from './todos'
import { loadGarden, saveGarden, uploadFile, signFile } from './api'
import { DiagramBlock, diagramFromLines } from './diagram'
import { exportPagePdf } from './exportPdf'

const uid = () => crypto.randomUUID()

/* ------------------------------------------------------------------ */
/*  Shared handlers passed to custom nodes via context                 */
/* ------------------------------------------------------------------ */
type GardenCtx = {
  updateNodeData: (id: string, patch: Partial<BubbleData>) => void
  addChild: (parentId: string) => string
  deleteNode: (id: string) => void
  openNode: (id: string) => void
}
const Ctx = createContext<GardenCtx | null>(null)
// Per-bubble to-do progress (bubble id → done/total), for the bar on each bubble.
const ProgressCtx = createContext<Record<string, { done: number; total: number }>>({})
const useCtx = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Idea Garden context missing')
  return c
}

/* ------------------------------------------------------------------ */
/*  Bubble node                                                        */
/* ------------------------------------------------------------------ */
function BubbleNode({ id, data, selected }: NodeProps) {
  // Only a hand-set width counts (NodeProps.width is the measured size).
  const width = useInternalNode(id)?.width
  const d = data as unknown as BubbleData
  const pal = paletteFor(d.color)
  const { updateNodeData, addChild, deleteNode, openNode } = useCtx()
  const prog = useContext(ProgressCtx)[id]
  const pct = prog && prog.total ? Math.round((prog.done / prog.total) * 100) : 0
  const central = d.kind === 'central'

  // Stable per-bubble float pace (5.4s–7.3s) so bubbles don't drift in unison.
  const floatDur = 5.4 + (Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0) % 20) / 10
  const style = {
    ['--b-fill' as string]: pal.fill,
    ['--b-border' as string]: pal.border,
    ['--b-ink' as string]: pal.ink,
    ['--b-glow' as string]: pal.glow,
    ['--b-font' as string]: fontStack(d.font),
    ['--float-dur' as string]: `${floatDur}s`,
    // Hand-resized bubbles scale their text with their width.
    ['--b-scale' as string]: width ? Math.max(0.75, Math.min(3, width / (d.kind === 'central' ? 230 : 180))) : 1,
    fontFamily: fontStack(d.font)
  } as React.CSSProperties
  const shape = d.shape || DEFAULT_SHAPE
  const [editing, setEditing] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!selected) setEditing(false) }, [selected])

  return (
    <div className={`bubble shape-${shape} ${central ? 'central' : ''} ${selected ? 'selected' : ''} ${width ? 'sized' : ''}`} style={style}>
      {/* Select a bubble, then drag any edge or corner to resize it freely. */}
      <NodeResizer isVisible={!!selected} minWidth={110} minHeight={56} lineClassName="ig-resize-line" handleClassName="ig-resize-handle" />
      {/* Handles on every side — with loose connection mode, edges float to the
          nearest one and can be dragged out or reconnected from any side. */}
      <Handle className="ig-handle" type="source" position={Position.Top} id="t" />
      <Handle className="ig-handle" type="source" position={Position.Right} id="r" />
      <Handle className="ig-handle" type="source" position={Position.Bottom} id="b" />
      <Handle className="ig-handle" type="source" position={Position.Left} id="l" />

      <div className="toolbar nodrag">
        <button className="mini open" title="Open page" onClick={() => openNode(id)}>⤢</button>
        {!central && (
          <button className="mini del" title="Delete" onClick={() => deleteNode(id)}>×</button>
        )}
      </div>

      <div className="kicker">{central ? '🌸 central idea' : '💭 thought'}</div>

      {/* The whole bubble is grabbable. Click the title of an already-selected
          bubble to rename it (like renaming a file); Enter / click away to finish. */}
      <div
        ref={titleRef}
        className={`title ${editing ? 'nodrag editing' : ''}`}
        contentEditable={editing}
        suppressContentEditableWarning
        spellCheck={false}
        title={editing ? undefined : selected ? 'Click to rename' : undefined}
        onClick={() => {
          if (!selected || editing) return
          setEditing(true)
          requestAnimationFrame(() => {
            const el = titleRef.current
            if (!el) return
            el.focus()
            const r = document.createRange(); r.selectNodeContents(el); r.collapse(false)
            const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r)
          })
        }}
        onBlur={(e) => { updateNodeData(id, { label: e.currentTarget.textContent?.trim() || '' }); setEditing(false) }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); (e.currentTarget as HTMLElement).blur() }
        }}
      >
        {d.label}
      </div>

      {central && (
        <div className="dates nodrag" title="Timeframe">
          🗓️
          <input type="date" value={d.start || ''} onChange={(e) => updateNodeData(id, { start: e.target.value })} />
          →
          <input type="date" value={d.end || ''} onChange={(e) => updateNodeData(id, { end: e.target.value })} />
        </div>
      )}

      {prog && prog.total > 0 && (
        <div className={`bubble-progress ${pct === 100 ? 'full' : ''}`} title={`${prog.done} of ${prog.total} to-dos done · right-click for recap`}>
          <div className="track"><span style={{ width: `${pct}%` }} /></div>
          <b>{pct === 100 ? '🎉' : `${prog.done}/${prog.total}`}</b>
        </div>
      )}

      <button className="add-child nodrag" title="Add sub-bubble" onClick={() => addChild(id)}>+</button>
    </div>
  )
}

// --- Floating edge geometry: connect the nearest points of two node rects so
// the connector re-anchors itself as bubbles are dragged around. ---
function getNodeIntersection(intersectionNode: InternalNode, targetNode: InternalNode) {
  const w = (intersectionNode.measured.width ?? 0) / 2
  const h = (intersectionNode.measured.height ?? 0) / 2
  const ip = intersectionNode.internals.positionAbsolute
  const tp = targetNode.internals.positionAbsolute
  const x2 = ip.x + w
  const y2 = ip.y + h
  const x1 = tp.x + (targetNode.measured.width ?? 0) / 2
  const y1 = tp.y + (targetNode.measured.height ?? 0) / 2
  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1)
  const xx3 = a * xx1
  const yy3 = a * yy1
  return { x: w * (xx3 + yy3) + x2, y: h * (-xx3 + yy3) + y2 }
}

function getEdgePosition(node: InternalNode, point: { x: number; y: number }) {
  const nx = Math.round(node.internals.positionAbsolute.x)
  const ny = Math.round(node.internals.positionAbsolute.y)
  const px = Math.round(point.x)
  const py = Math.round(point.y)
  if (px <= nx + 1) return Position.Left
  if (px >= nx + (node.measured.width ?? 0) - 1) return Position.Right
  if (py <= ny + 1) return Position.Top
  return Position.Bottom
}

function getEdgeParams(source: InternalNode, target: InternalNode) {
  const sp = getNodeIntersection(source, target)
  const tp = getNodeIntersection(target, source)
  return { sx: sp.x, sy: sp.y, tx: tp.x, ty: tp.y, sourcePos: getEdgePosition(source, sp), targetPos: getEdgePosition(target, tp) }
}

function FloatingEdge({ id, source, target, markerEnd, style, selected }: EdgeProps) {
  const sourceNode = useInternalNode(source)
  const targetNode = useInternalNode(target)
  if (!sourceNode || !targetNode) return null
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode)
  const [path] = getBezierPath({ sourceX: sx, sourceY: sy, sourcePosition: sourcePos, targetPosition: targetPos, targetX: tx, targetY: ty, curvature: 0.28 })
  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={{ stroke: selected ? '#f4a0c4' : '#d9c7d0', strokeWidth: selected ? 2.6 : 2, ...style }}
    />
  )
}

const nodeTypes = { bubble: BubbleNode }
const edgeTypes = { squiggle: FloatingEdge }

/* ------------------------------------------------------------------ */
/*  Notion-style block editor                                          */
/* ------------------------------------------------------------------ */
const SLASH_ITEMS: Array<{ key: BlockType | 'page'; group: string; ico: string; label: string; hint: string }> = [
  { key: 'text', group: 'Basics', ico: '📝', label: 'Text', hint: 'Just start writing' },
  { key: 'h1', group: 'Basics', ico: '🅷', label: 'Heading', hint: 'Big section title' },
  { key: 'h2', group: 'Basics', ico: '🇭', label: 'Subheading', hint: 'Smaller title' },
  { key: 'todo', group: 'Basics', ico: '✅', label: 'To-do', hint: 'Track a task' },
  { key: 'bullet', group: 'Basics', ico: '✿', label: 'Bullet list', hint: 'Or just type "- "' },
  { key: 'toggle', group: 'Basics', ico: '▸', label: 'Dropdown', hint: 'A title that folds content away' },
  { key: 'columns', group: 'Basics', ico: '▥', label: 'Columns', hint: 'Put things side by side' },
  { key: 'diagram', group: 'Basics', ico: '◎', label: 'Diagram', hint: 'Bubbles + arrows on an A4 board' },
  { key: 'callout', group: 'Basics', ico: '💡', label: 'Callout', hint: 'Make it pop' },
  { key: 'divider', group: 'Basics', ico: '➖', label: 'Divider', hint: 'Split things up' },
  { key: 'table', group: 'Basics', ico: '▦', label: 'Table', hint: 'A little grid' },
  { key: 'status', group: 'Basics', ico: '🏷️', label: 'Status', hint: 'Done · In progress · …' },
  { key: 'page', group: 'Connect', ico: '📄', label: 'Page', hint: 'A separate page you click into' },
  { key: 'youtube', group: 'Embed', ico: '▶️', label: 'YouTube', hint: 'Paste a video link' },
  { key: 'file', group: 'Embed', ico: '📎', label: 'PDF / file', hint: 'Upload from device' },
  { key: 'image', group: 'Embed', ico: '🖼️', label: 'Image', hint: 'Upload a picture' }
]

// Default cute pastel statuses (fully editable/customizable per pill).
const DEFAULT_STATUS_OPTIONS: { label: string; color: string }[] = [
  { label: 'To do', color: '#e7e3dc' },
  { label: 'In progress', color: '#d8ecff' },
  { label: 'Done', color: '#d9f5e3' },
  { label: 'On hold', color: '#ffe8d6' }
]

// A block update: either a partial object, or a function of the latest block
// (used for nested content so rapid consecutive edits never overwrite each other).
type BlockPatch = Partial<Block> | ((b: Block) => Partial<Block>)
const applyPatch = (b: Block, patch: BlockPatch) => ({ ...b, ...(typeof patch === 'function' ? patch(b) : patch) })

const isTextual = (t: BlockType) => ['text', 'h1', 'h2', 'todo', 'callout', 'bullet', 'toggle'].includes(t)

// Line types offered in the right-click "Turn into" menu (text carries over).
const TURN_KINDS: { key: BlockType; ico: string; label: string }[] = [
  { key: 'text', ico: 'Aa', label: 'Text' },
  { key: 'h1', ico: 'H1', label: 'Heading' },
  { key: 'h2', ico: 'H2', label: 'Subheading' },
  { key: 'bullet', ico: '•', label: 'Bullet' },
  { key: 'todo', ico: '☐', label: 'To-do' },
  { key: 'callout', ico: '💡', label: 'Callout' }
]

// Five cute bullet styles; click a bullet to switch its style.
const BULLETS: { key: string; glyph: string; label: string }[] = [
  { key: 'dot', glyph: '•', label: 'Dot' },
  { key: 'flower', glyph: '✿', label: 'Flower' },
  { key: 'heart', glyph: '♥', label: 'Heart' },
  { key: 'star', glyph: '✦', label: 'Sparkle' },
  { key: 'arrow', glyph: '➛', label: 'Arrow' }
]
const bulletGlyph = (k?: string) => (BULLETS.find((b) => b.key === k) || BULLETS[0]).glyph

function BulletMarker({ value, onPick }: { value?: string; onPick: (k: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="ig-bullet-wrap">
      <button className={`ig-bullet b-${value || 'dot'}`} title="Change bullet style" onMouseDown={(e) => { e.preventDefault(); setOpen((v) => !v) }}>
        {bulletGlyph(value)}
      </button>
      {open && (
        <span className="ig-bullet-menu" onMouseLeave={() => setOpen(false)}>
          {BULLETS.map((b) => (
            <button
              key={b.key}
              className={`ig-bullet-opt b-${b.key} ${(value || 'dot') === b.key ? 'on' : ''}`}
              title={b.label}
              onMouseDown={(e) => { e.preventDefault(); onPick(b.key); setOpen(false) }}
            >{b.glyph}</button>
          ))}
        </span>
      )}
    </span>
  )
}
const filterItems = (q: string) => {
  const s = q.toLowerCase()
  return SLASH_ITEMS.filter((i) => i.label.toLowerCase().includes(s) || String(i.key).includes(s))
}
const newBlock = (type: BlockType = 'text', extra: Partial<Block> = {}): Block => ({ id: uid(), type, text: '', ...extra })
// Lines created by splitting (Enter mid-text) get the cursor at their start, not the end.
const caretAtStart = new Set<string>()

function ytEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1)
    else id = u.searchParams.get('v') || ''
    if (!id && u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1]
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch {
    return null
  }
}

function prettySize(n?: number) {
  if (!n) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

function FilePreview({ token, block }: { token: string; block: Block }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let ok = true
    if (block.filePath) signFile(token, block.filePath).then((u) => ok && setUrl(u)).catch(() => {})
    return () => { ok = false }
  }, [token, block.filePath])

  const isImage = block.type === 'image' || (block.fileType || '').startsWith('image/')
  const isPdf = block.fileType === 'application/pdf'

  if (isImage) {
    return (
      <a className="filecard" href={url || undefined} target="_blank" rel="noreferrer">
        {url ? <img className="thumb" src={url} alt={block.fileName || 'image'} /> : <span className="ico">⏳</span>}
      </a>
    )
  }
  return (
    <a className="filecard" href={url || undefined} target="_blank" rel="noreferrer">
      <span className="ico">{isPdf ? '📕' : '📄'}</span>
      <div className="meta">
        <b>{block.fileName || 'attachment'}</b>
        <span>{isPdf ? 'PDF · ' : ''}{prettySize(block.fileSize)} · click to open</span>
      </div>
    </a>
  )
}

// --- CellEditor: a compact block editor used inside each table cell. Supports
// the same "/" menu (text, to-do, image, PDF/file, video, link, page) and
// drag-and-drop file upload as the page. ---
function CellEditor({ token, blocks, setBlocks, pages, registerSubpage, openPage }: {
  token: string
  blocks: Block[]
  setBlocks: (u: (bs: Block[]) => Block[]) => void
} & CellCtx) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const [slash, setSlash] = useState<SlashState | null>(null)
  const [fileOver, setFileOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFileType = useRef<BlockType>('file')
  const patchBlock = (id: string, patch: BlockPatch) => setBlocks((bs) => bs.map((b) => (b.id === id ? applyPatch(b, patch) : b)))
  const addAfter = (id: string, block: Block) => { setBlocks((bs) => { const i = bs.findIndex((b) => b.id === id); const c = [...bs]; c.splice(i + 1, 0, block); return c }); setFocusId(block.id) }
  const onEnter = (id: string, isEmpty: boolean, tail?: string) => {
    const b = blocks.find((x) => x.id === id)
    if (tail !== undefined) {
      const nb = newBlock(b?.type === 'todo' || b?.type === 'bullet' ? b.type : 'text', { bullet: b?.bullet, text: tail })
      caretAtStart.add(nb.id); addAfter(id, nb); return
    }
    if (b?.type === 'todo' || b?.type === 'bullet') {
      if (isEmpty) { patchBlock(id, { type: 'text', checked: false, text: '' }); setFocusId(id) }
      else addAfter(id, newBlock(b.type, { bullet: b.bullet }))
      return
    }
    addAfter(id, newBlock('text'))
  }
  const onAutoBullet = (id: string, rest: string) => {
    const i = blocks.findIndex((x) => x.id === id)
    const prev = blocks.slice(0, i).reverse().find((x) => x.type === 'bullet')
    patchBlock(id, { type: 'bullet', text: rest, bullet: prev?.bullet || 'dot' })
    setFocusId(null)
    setTimeout(() => setFocusId(id), 0)
  }
  // Backspace at the start of a formatted line → plain text, cursor stays put.
  const onUnformat = (id: string) => {
    patchBlock(id, { type: 'text', checked: false })
    setFocusId(null)
    setTimeout(() => setFocusId(id), 0)
  }
  const onBackspaceEmpty = (id: string) => setBlocks((bs) => { if (bs.length === 1) return bs; const i = bs.findIndex((b) => b.id === id); const prevId = bs[i - 1]?.id; if (prevId) { setFocusId(null); setTimeout(() => setFocusId(prevId), 0) } return bs.filter((b) => b.id !== id) })
  function onSlash(blockId: string, query: string | null, pos?: { x: number; y: number }) {
    if (query === null) { setSlash((s) => (s && s.blockId === blockId ? null : s)); return }
    setSlash((s) => (s && s.blockId === blockId ? { ...s, query, pos: pos || s.pos } : { blockId, query, pos: pos!, index: 0 }))
  }
  useEffect(() => {
    if (!slash) return
    function onKey(e: KeyboardEvent) {
      const items = filterItems(slash!.query)
      if (e.key === 'Escape') { e.preventDefault(); setSlash(null) }
      else if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); setSlash((s) => (s ? { ...s, index: Math.min(s.index + 1, items.length - 1) } : s)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); setSlash((s) => (s ? { ...s, index: Math.max(s.index - 1, 0) } : s)) }
      else if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (items[slash!.index]) pickSlash(items[slash!.index].key) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slash])
  async function uploadInto(id: string, file: File) {
    const type: BlockType = file.type.startsWith('image/') ? 'image' : 'file'
    patchBlock(id, { type, fileName: file.name, fileType: file.type, fileSize: file.size })
    try { const up = await uploadFile(token, file); patchBlock(id, { type, filePath: up.path, fileName: up.name, fileType: up.type, fileSize: up.size, text: '' }); addAfter(id, newBlock()) }
    catch { patchBlock(id, { type: 'text', text: `⚠️ Upload failed: ${file.name}` }) }
  }
  function pickSlash(kind: BlockType | 'page') {
    const id = slash?.blockId
    const active = document.activeElement as HTMLElement | null
    if (active && active.isContentEditable) active.innerText = ''
    setSlash(null)
    if (!id) return
    if (kind === 'youtube') { const url = window.prompt('Paste a YouTube link 💛') || ''; patchBlock(id, url ? { type: 'youtube', url, text: '' } : { type: 'text', text: '' }); if (url) addAfter(id, newBlock()); return }
    if (kind === 'file' || kind === 'image') { pendingFileType.current = kind; if (fileInputRef.current) { fileInputRef.current.accept = kind === 'image' ? 'image/*' : '*/*'; fileInputRef.current.dataset.target = id; fileInputRef.current.click() } return }
    if (kind === 'page') { if (registerSubpage) { const pid = registerSubpage(); patchBlock(id, { type: 'subpage', pageId: pid, text: '' }); addAfter(id, newBlock()) } return }
    if (kind === 'toggle') { patchBlock(id, { type: 'toggle', text: '', open: true, children: [newBlock()] }); setFocusId(id); return }
    if (kind === 'columns') { patchBlock(id, { type: 'columns', text: '', cols: [[newBlock()], [newBlock()]] }); addAfter(id, newBlock()); return }
    if (kind === 'diagram') { patchBlock(id, { type: 'diagram', text: '', diagram: diagramFromLines([{ text: 'Main idea', indent: 0 }]) }); addAfter(id, newBlock()); return }
    if (kind === 'status') { patchBlock(id, { type: 'status', statusOptions: DEFAULT_STATUS_OPTIONS, status: '', text: '' }); addAfter(id, newBlock()); return }
    if (kind === 'divider') { patchBlock(id, { type: 'divider', text: '' }); addAfter(id, newBlock()); return }
    if (kind === 'table') { patchBlock(id, { type: 'text', text: '' }); return } // no nested tables
    patchBlock(id, { type: kind, text: '' }); setFocusId(id)
  }
  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; const targetId = e.target.dataset.target || ''; e.target.value = ''
    if (!file || !targetId) return
    await uploadInto(targetId, file)
  }
  async function pasteFiles(afterId: string, files: File[]) {
    let anchor = afterId
    for (const f of files) {
      const nb = newBlock()
      setBlocks((bs) => { const i = bs.findIndex((b) => b.id === anchor); const c = [...bs]; c.splice(i < 0 ? c.length : i + 1, 0, nb); return c })
      anchor = nb.id
      await uploadInto(nb.id, f)
    }
  }
  async function onDrop(e: React.DragEvent) {
    if (!e.dataTransfer.files?.length) return
    e.preventDefault(); e.stopPropagation(); setFileOver(false)
    let anchor = blocks[blocks.length - 1]?.id
    for (const f of [...e.dataTransfer.files]) {
      const nb = newBlock()
      setBlocks((bs) => { const i = anchor ? bs.findIndex((b) => b.id === anchor) : bs.length - 1; const c = [...bs]; c.splice(i + 1, 0, nb); return c })
      anchor = nb.id
      await uploadInto(nb.id, f)
    }
  }
  return (
    <div
      className={`ig-cell ${fileOver ? 'file-over' : ''}`}
      onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); e.stopPropagation(); setFileOver(true) } }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setFileOver(false) }}
      onDrop={onDrop}
    >
      {blocks.map((b) => (
        b.type === 'subpage' ? (
          <div className="block" key={b.id}><div className="content"><button className="pagelink" onClick={() => b.pageId && openPage && openPage(b.pageId)}>📄 {(b.pageId && pages?.[b.pageId]?.title) || 'Untitled page'} →</button></div></div>
        ) : (
          <BlockView key={b.id} token={token} block={b} autoFocus={focusId === b.id} pages={pages} registerSubpage={registerSubpage} openPage={openPage}
            onChange={patchBlock} onEnter={onEnter} onBackspaceEmpty={onBackspaceEmpty} onSlash={onSlash}
            onToggle={(id) => patchBlock(id, { checked: !b.checked })} onIndent={() => {}} onAutoBullet={onAutoBullet} onUnformat={onUnformat} onPasteFiles={pasteFiles} />
        )
      ))}
      <input ref={fileInputRef} type="file" hidden onChange={onFileChosen} />
      {slash && <SlashMenu pos={slash.pos} query={slash.query} index={slash.index} onPick={pickSlash} />}
    </div>
  )
}

// --- Table block: a grid whose cells are each a mini block-editor ---
function TableBlock({ block, onChange, token, pages, registerSubpage, openPage }: { block: Block; onChange: (id: string, patch: BlockPatch) => void; token: string } & CellCtx) {
  const cells = block.cells && block.cells.length ? block.cells : null
  const mkCell = (): Block[] => [newBlock()]
  // While dragging a border we resize locally (smooth), then save once on release.
  const [live, setLive] = useState<{ cols?: number[]; rows?: number[] } | null>(null)
  useEffect(() => {
    if (cells) return
    const init: Block[][][] = block.rows && block.rows.length
      ? block.rows.map((row) => row.map((s) => [newBlock('text', { text: s || '' })]))
      : [[mkCell(), mkCell(), mkCell()], [mkCell(), mkCell(), mkCell()]]
    onChange(block.id, { cells: init })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!cells) return <div className="ig-table-wrap"><div className="ig-td-loading">…</div></div>
  const setCell = (ri: number, ci: number, updater: (bs: Block[]) => Block[]) =>
    onChange(block.id, (b) => {
      const src = b.cells && b.cells.length ? b.cells : cells
      const c = src.map((r) => r.slice())
      c[ri] = c[ri].slice()
      c[ri][ci] = updater(c[ri][ci] && c[ri][ci].length ? c[ri][ci] : [newBlock()])
      return { cells: c }
    })
  const DEFAULT_COL = 200
  const nCols = cells[0].length
  const colW = live?.cols || Array.from({ length: nCols }, (_, i) => block.colWidths?.[i] || DEFAULT_COL)
  const rowH = live?.rows || cells.map((_, i) => block.rowHeights?.[i] || 0)
  const addRow = () => onChange(block.id, (b) => ({ cells: [...(b.cells || cells), (b.cells || cells)[0].map(() => mkCell())] }))
  const addCol = () => onChange(block.id, (b) => ({
    cells: (b.cells || cells).map((r) => [...r, mkCell()]),
    colWidths: b.colWidths ? [...b.colWidths, DEFAULT_COL] : undefined
  }))
  const delRow = () => cells.length > 1 && onChange(block.id, (b) => ({
    cells: (b.cells || cells).slice(0, -1),
    rowHeights: b.rowHeights ? b.rowHeights.slice(0, -1) : undefined
  }))
  const delCol = () => nCols > 1 && onChange(block.id, (b) => ({
    cells: (b.cells || cells).map((r) => r.slice(0, -1)),
    colWidths: b.colWidths ? b.colWidths.slice(0, -1) : undefined
  }))
  // Drag a column's right edge → that column's width. Drag a row's bottom edge → its height.
  function startDrag(kind: 'col' | 'row', idx: number, e: React.PointerEvent) {
    e.preventDefault(); e.stopPropagation()
    const startX = e.clientX, startY = e.clientY
    const cols = colW.slice(), rows = rowH.slice()
    const td = (e.currentTarget as HTMLElement).closest('td') as HTMLElement
    const startRowH = rows[idx] || (td?.parentElement?.getBoundingClientRect().height ?? 40)
    let latest = { cols, rows }
    const onMove = (ev: PointerEvent) => {
      if (kind === 'col') { const c = cols.slice(); c[idx] = Math.max(70, Math.round(cols[idx] + ev.clientX - startX)); latest = { cols: c, rows } }
      else { const r = rows.slice(); r[idx] = Math.max(34, Math.round(startRowH + ev.clientY - startY)); latest = { cols, rows: r } }
      setLive(latest)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp)
      document.body.style.cursor = ''; document.body.style.userSelect = ''
      onChange(block.id, { colWidths: latest.cols, rowHeights: latest.rows })
      setLive(null)
    }
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp)
    document.body.style.cursor = kind === 'col' ? 'col-resize' : 'row-resize'; document.body.style.userSelect = 'none'
  }
  const resetCol = (idx: number) => onChange(block.id, (b) => {
    const c = Array.from({ length: nCols }, (_, i) => b.colWidths?.[i] || DEFAULT_COL); c[idx] = DEFAULT_COL; return { colWidths: c }
  })
  const resetRow = (idx: number) => onChange(block.id, (b) => {
    const r = cells.map((_, i) => b.rowHeights?.[i] || 0); r[idx] = 0; return { rowHeights: r }
  })
  return (
    <div className="ig-table-wrap">
      <table className={`ig-table fixed ${live ? 'resizing' : ''}`} style={{ width: colW.reduce((a, w) => a + w, 0) }}>
        <colgroup>{colW.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
        <tbody>
          {cells.map((row, ri) => (
            <tr key={ri} style={rowH[ri] ? { height: rowH[ri] } : undefined}>
              {row.map((cell, ci) => (
                <td key={ci} className={ri === 0 ? 'h' : ''}>
                  <CellEditor token={token} blocks={cell && cell.length ? cell : [newBlock()]} setBlocks={(u) => setCell(ri, ci, u)} pages={pages} registerSubpage={registerSubpage} openPage={openPage} />
                  <span className="ig-col-resize" title="Drag to resize column · double-click to reset" onPointerDown={(e) => startDrag('col', ci, e)} onDoubleClick={() => resetCol(ci)} />
                  <span className="ig-row-resize" title="Drag to resize row · double-click to reset" onPointerDown={(e) => startDrag('row', ri, e)} onDoubleClick={() => resetRow(ri)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ig-table-actions">
        <button onClick={addRow} title="Add row">＋ row</button>
        <button onClick={addCol} title="Add column">＋ column</button>
        <button onClick={delRow} title="Remove last row">－ row</button>
        <button onClick={delCol} title="Remove last column">－ column</button>
        <span className="ig-table-hint">drag any cell edge to resize</span>
      </div>
    </div>
  )
}

// --- Status pill: a cute pastel dropdown, customizable options ---
function StatusBlock({ block, onChange }: { block: Block; onChange: (id: string, patch: BlockPatch) => void }) {
  const options = block.statusOptions && block.statusOptions.length ? block.statusOptions : DEFAULT_STATUS_OPTIONS
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.label === block.status) || null
  const pick = (label: string) => { onChange(block.id, { status: label, statusOptions: options }); setOpen(false) }
  const addCustom = () => {
    const label = (window.prompt('Name your new status') || '').trim()
    if (!label) return
    const swatches = ['#ffe0ef', '#fff6cf', '#e9dcff', '#d5f6f2', '#ffd6e8', '#d8ecff', '#ffe8d6']
    const next = [...options, { label, color: swatches[options.length % swatches.length] }]
    onChange(block.id, { statusOptions: next, status: label })
    setOpen(false)
  }
  return (
    <div className="ig-status">
      <button className="ig-status-pill" style={{ background: current ? current.color : '#efece7' }} onClick={() => setOpen((v) => !v)}>
        <span className="dot" style={{ background: current ? current.color : '#cfc8c0', border: '1px solid rgba(60,50,55,.25)' }} />
        {current ? current.label : 'Set status'} <span className="caret">▾</span>
      </button>
      {open && (
        <div className="ig-status-menu">
          {options.map((o) => (
            <button key={o.label} className="ig-status-opt" onClick={() => pick(o.label)}>
              <span className="dot" style={{ background: o.color, border: '1px solid rgba(60,50,55,.15)' }} />{o.label}
            </button>
          ))}
          <button className="ig-status-add" onClick={addCustom}>＋ new status</button>
        </div>
      )}
    </div>
  )
}

// --- Post Kit: gather everything on a page into a ready-to-publish bundle ---
function PostKitPanel({ token, pageId, title, blocks, onClose }: { token: string; pageId: string; title: string; blocks: Block[]; onClose: () => void }) {
  const strip = (s?: string) => String(s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').trim()
  const urls = (t?: string) => String(t || '').match(/https?:\/\/[^\s"'<>]+/g) || []
  const captionParts: string[] = []
  const todos: { text: string; done: boolean }[] = []
  const links = new Set<string>()
  const fileBlocks: Block[] = []
  let status: string | null = null
  const collect = (list: Block[]) => {
    for (const b of list) {
      if (['text', 'h1', 'h2', 'callout'].includes(b.type)) { const t = strip(b.text); if (t) { captionParts.push(t); urls(t).forEach((u) => links.add(u)) } }
      else if (b.type === 'todo') { const t = strip(b.text); if (t) { todos.push({ text: t, done: !!b.checked }); urls(t).forEach((u) => links.add(u)) } }
      else if (b.type === 'bullet') { const t = strip(b.text); if (t) { captionParts.push(`${bulletGlyph(b.bullet)} ${t}`); urls(t).forEach((u) => links.add(u)) } }
      else if (b.type === 'youtube') { if (b.url) links.add(b.url) }
      else if (b.type === 'image' || b.type === 'file') { if (b.filePath) fileBlocks.push(b) }
      else if (b.type === 'status') { if (b.status) status = b.status }
      else if (b.type === 'toggle') { const t = strip(b.text); if (t) captionParts.push(t); collect(b.children || []) }
      else if (b.type === 'table' && Array.isArray(b.cells)) { for (const row of b.cells) for (const cell of row) collect(cell) }
      else if (b.type === 'columns' && Array.isArray(b.cols)) { for (const col of b.cols) collect(col) }
    }
  }
  collect(blocks)
  const caption = captionParts.join('\n\n')
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({})
  useEffect(() => {
    let ok = true
    ;(async () => {
      const m: Record<string, string> = {}
      for (const b of fileBlocks) { try { m[b.id] = await signFile(token, b.filePath!) } catch { /* ignore */ } }
      if (ok) setMediaUrls(m)
    })()
    return () => { ok = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const apiUrl = `${location.origin}/api/admin/idea-garden/postkit?page=${pageId}`
  const [copied, setCopied] = useState('')
  const doCopy = (txt: string, label: string) => { try { navigator.clipboard?.writeText(txt) } catch { /* ignore */ } setCopied(label); setTimeout(() => setCopied(''), 1200) }
  return (
    <div className="ig-kit-scrim" onClick={onClose}>
      <div className="ig-kit-panel" onClick={(e) => e.stopPropagation()}>
        <div className="ig-kit-head"><b>📤 Post Kit — {title}</b><button className="close-x" onClick={onClose}>×</button></div>
        <div className="ig-kit-body">
          {status && <div className="ig-kit-section"><span className="ig-kit-label">Status</span> <span className="ig-kit-status">{status}</span></div>}
          <div className="ig-kit-section">
            <div className="ig-kit-label">Caption <button className="ig-kit-copy" onClick={() => doCopy(caption, 'caption')}>{copied === 'caption' ? 'copied ✓' : 'copy'}</button></div>
            <textarea className="ig-kit-caption" readOnly value={caption || '(no text yet)'} />
          </div>
          <div className="ig-kit-section">
            <div className="ig-kit-label">Media ({fileBlocks.length})</div>
            {fileBlocks.length === 0 && <div className="ig-kit-empty">No photos or videos uploaded on this page yet.</div>}
            {fileBlocks.map((b) => (
              <div className="ig-kit-media" key={b.id}>
                {b.type === 'image' && mediaUrls[b.id] && <img src={mediaUrls[b.id]} alt="" />}
                <span className="nm">{b.fileName || 'file'}</span>
                {mediaUrls[b.id]
                  ? <button className="ig-kit-copy" onClick={() => doCopy(mediaUrls[b.id], 'm' + b.id)}>{copied === 'm' + b.id ? 'copied ✓' : 'copy link'}</button>
                  : <span className="ig-kit-empty">…</span>}
              </div>
            ))}
          </div>
          {links.size > 0 && (
            <div className="ig-kit-section">
              <div className="ig-kit-label">Links</div>
              {[...links].map((u, i) => (<div className="ig-kit-link" key={i}><a href={u} target="_blank" rel="noreferrer">{u}</a></div>))}
            </div>
          )}
          {todos.length > 0 && (
            <div className="ig-kit-section">
              <div className="ig-kit-label">Checklist</div>
              {todos.map((t, i) => (<div className="ig-kit-todo" key={i}>{t.done ? '✅' : '⬜'} {t.text}</div>))}
            </div>
          )}
          <div className="ig-kit-section ig-kit-auto">
            <div className="ig-kit-label">Automation URL <button className="ig-kit-copy" onClick={() => doCopy(apiUrl, 'api')}>{copied === 'api' ? 'copied ✓' : 'copy'}</button></div>
            <code className="ig-kit-url">{apiUrl}</code>
            <p className="ig-kit-note">Point Make / Zapier / Buffer at this URL (with header <b>Authorization: Bearer &lt;your admin code&gt;</b>) to auto-publish. It returns the caption, media links and everything above as JSON.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Image that you can resize freely by dragging either side edge ---
function ResizableImage({ token, block, onChange }: { token: string; block: Block; onChange: (id: string, patch: BlockPatch) => void }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let ok = true
    if (block.filePath) signFile(token, block.filePath).then((u) => ok && setUrl(u)).catch(() => {})
    return () => { ok = false }
  }, [token, block.filePath])
  const boxRef = useRef<HTMLDivElement>(null)
  const [liveW, setLiveW] = useState<number | null>(null)
  const w = liveW ?? block.width ?? null
  function startResize(e: React.PointerEvent, dir: 1 | -1) {
    e.preventDefault(); e.stopPropagation()
    const box = boxRef.current
    if (!box) return
    const startX = e.clientX
    const startW = box.getBoundingClientRect().width
    const maxW = box.parentElement ? box.parentElement.getBoundingClientRect().width : 2000
    let latest = startW
    const onMove = (ev: PointerEvent) => {
      latest = Math.round(Math.max(60, Math.min(maxW, startW + dir * (ev.clientX - startX))))
      setLiveW(latest)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp)
      document.body.style.cursor = ''; document.body.style.userSelect = ''
      onChange(block.id, { width: latest })
      setLiveW(null)
    }
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp)
    document.body.style.cursor = 'ew-resize'; document.body.style.userSelect = 'none'
  }
  return (
    <div className={`ig-img ${liveW ? 'resizing' : ''}`} ref={boxRef} style={w ? { width: w } : undefined}>
      {url
        ? <img src={url} alt={block.fileName || 'image'} draggable={false} onDoubleClick={() => window.open(url, '_blank')} />
        : <div className="ig-img-loading">loading image…</div>}
      <span className="ig-img-handle l" title="Drag to resize · double-click to reset" onPointerDown={(e) => startResize(e, -1)} onDoubleClick={() => onChange(block.id, { width: undefined })} />
      <span className="ig-img-handle r" title="Drag to resize · double-click to reset" onPointerDown={(e) => startResize(e, 1)} onDoubleClick={() => onChange(block.id, { width: undefined })} />
      {liveW && <span className="ig-img-size">{liveW}px</span>}
    </div>
  )
}

type CellCtx = {
  pages?: Record<string, { title: string }>
  registerSubpage?: () => string
  openPage?: (id: string) => void
}

type BlockProps = CellCtx & {
  token: string
  block: Block
  autoFocus: boolean
  onChange: (id: string, patch: BlockPatch) => void
  onEnter: (id: string, isEmpty: boolean, tail?: string) => void
  onBackspaceEmpty: (id: string) => void
  onSlash: (id: string, query: string | null, pos?: { x: number; y: number }) => void
  onToggle: (id: string) => void
  onIndent: (id: string, delta: number) => void
  onAutoBullet?: (id: string, rest: string) => void
  onPasteFiles?: (id: string, files: File[]) => void
  onUnformat?: (id: string) => void
}

function BlockView({ token, block, autoFocus, onChange, onEnter, onBackspaceEmpty, onSlash, onToggle, onIndent, onAutoBullet, onUnformat, onPasteFiles, pages, registerSubpage, openPage }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Seed as HTML so pastel highlights (and any inline formatting) survive.
    if (ref.current && isTextual(block.type)) ref.current.innerHTML = block.text || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.type])

  // Ctrl+H — toggle a soft pastel highlight over the selected words.
  function toggleHighlight() {
    const el = ref.current
    const sel = window.getSelection()
    if (!el || !sel || sel.isCollapsed) return
    // Is the selection start already sitting on a highlighted span?
    let walk: HTMLElement | null =
      (sel.anchorNode && sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : (sel.anchorNode as HTMLElement | null))
    let already = false
    while (walk && walk !== el) {
      const bg = walk.style?.backgroundColor
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') { already = true; break }
      walk = walk.parentElement
    }
    try {
      document.execCommand('styleWithCSS', false, 'true')
      document.execCommand('hiliteColor', false, already ? 'transparent' : '#ffe9a3')
    } catch { /* execCommand unsupported */ }
    onChange(block.id, { text: el.innerHTML })
  }

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus()
      const r = document.createRange()
      r.selectNodeContents(ref.current)
      r.collapse(caretAtStart.has(block.id))
      const id = block.id
      setTimeout(() => caretAtStart.delete(id), 300) // (dev mode runs this effect twice)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(r)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus])

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const plain = el.innerText
    // Markdown-style shortcut: "- " or "* " at the start of a plain line → bullet.
    // Read raw textContent: innerText collapses the trailing space right after "-".
    const raw = (el.textContent || '').replace(/ /g, ' ')
    const bulletMatch = block.type === 'text' && onAutoBullet ? raw.match(/^[-*] ([\s\S]*)$/) : null
    if (bulletMatch) {
      onSlash(block.id, null)
      onAutoBullet!(block.id, bulletMatch[1])
      return
    }
    if (plain.startsWith('/')) {
      const rect = el.getBoundingClientRect()
      onSlash(block.id, plain.slice(1), { x: rect.left, y: rect.bottom + 6 })
    } else {
      onSlash(block.id, null)
      if (el.innerText.replace(/[\n\u00a0]/g, '').trim() === '' && el.innerHTML !== '') el.innerHTML = ''
      onChange(block.id, { text: el.innerHTML }) // store HTML so highlights persist
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = ref.current
    // Ctrl+H — pastel highlighter (Ctrl only, so Mac's Cmd+H still hides the app).
    if (e.ctrlKey && !e.metaKey && (e.key === 'h' || e.key === 'H')) {
      e.preventDefault()
      toggleHighlight()
      return
    }
    // Tab nests deeper; Shift+Tab pulls back out (Notion-style).
    if (e.key === 'Tab') {
      e.preventDefault()
      onIndent(block.id, e.shiftKey ? -1 : 1)
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Cursor in the middle of the text → split: everything after the cursor
      // moves to a new line right below (instead of jumping past the whole block).
      let tail: string | undefined
      const sel = window.getSelection()
      if (el && sel && sel.rangeCount && el.contains(sel.anchorNode)) {
        const r = sel.getRangeAt(0)
        r.deleteContents()
        const after = document.createRange()
        after.selectNodeContents(el)
        after.setStart(r.endContainer, r.endOffset)
        const frag = after.cloneContents()
        const box = document.createElement('div'); box.appendChild(frag)
        if ((box.textContent || '').replace(/\u00a0/g, ' ').trim() !== '' || box.querySelector('img')) {
          after.deleteContents()
          tail = box.innerHTML.replace(/^(<br\s*\/?>)+/i, '')
          onChange(block.id, { text: el.innerHTML })
        }
      }
      onEnter(block.id, !el || el.innerText.trim() === '', tail)
      return
    }
    // Backspace with the cursor at the very start of a bullet / to-do / heading /
    // callout removes that formatting (keeps the text) — Notion-style.
    if (e.key === 'Backspace' && el && onUnformat && ['bullet', 'todo', 'h1', 'h2', 'callout'].includes(block.type)) {
      const sel = window.getSelection()
      if (sel && sel.rangeCount && sel.isCollapsed) {
        const r = sel.getRangeAt(0)
        const pre = r.cloneRange()
        pre.selectNodeContents(el)
        pre.setEnd(r.startContainer, r.startOffset)
        if (pre.toString().length === 0) {
          e.preventDefault()
          onChange(block.id, { text: el.innerHTML })
          onUnformat(block.id)
          return
        }
      }
    }
    // A line that only holds a leftover <br> / whitespace counts as empty.
    if (e.key === 'Backspace' && el && el.innerText.replace(/[\n\u00a0]/g, '').trim() === '' && !el.querySelector('img')) {
      e.preventDefault(); onBackspaceEmpty(block.id)
    }
  }

  const editable = (placeholder = "Type '/' for blocks…") => (
    <div
      ref={ref}
      className="editable"
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={(e) => {
        // Pasting a picture → upload it as its own image block (not raw data in the text).
        const files = [...(e.clipboardData?.files || [])].filter((f) => f.type.startsWith('image/'))
        if (files.length && onPasteFiles) { e.preventDefault(); onPasteFiles(block.id, files) }
      }}
    />
  )

  if (block.type === 'divider')
    return <div className="block"><span className="grip">⠿</span><div className="content"><div className="divider-line" /></div></div>

  if (block.type === 'youtube') {
    const src = block.url ? ytEmbed(block.url) : null
    return (
      <div className="block">
        <span className="grip">⠿</span>
        <div className="content">
          {src ? <div className="embed"><iframe src={src} allowFullScreen title="yt" /></div>
            : <div className="filecard"><span className="ico">⚠️</span><div className="meta"><b>Couldn’t read that link</b><span>{block.url}</span></div></div>}
        </div>
      </div>
    )
  }

  if ((block.type === 'image' || (block.type === 'file' && (block.fileType || '').startsWith('image/'))) && block.filePath)
    return <div className="block"><span className="grip">⠿</span><div className="content"><ResizableImage token={token} block={block} onChange={onChange} /></div></div>

  if (block.type === 'file' || block.type === 'image')
    return <div className="block"><span className="grip">⠿</span><div className="content"><FilePreview token={token} block={block} /></div></div>

  if (block.type === 'table')
    return <div className="block"><span className="grip">⠿</span><div className="content"><TableBlock block={block} onChange={onChange} token={token} pages={pages} registerSubpage={registerSubpage} openPage={openPage} /></div></div>

  if (block.type === 'status')
    return <div className="block"><span className="grip">⠿</span><div className="content"><StatusBlock block={block} onChange={onChange} /></div></div>

  if (block.type === 'callout')
    return (
      <div className="block"><span className="grip">⠿</span>
        <div className="content"><div className="callout"><span className="emoji">💡</span>{editable('Something worth remembering…')}</div></div>
      </div>
    )

  if (block.type === 'diagram')
    return <div className="block"><span className="grip">⠿</span><div className="content"><DiagramBlock block={block} onChange={onChange} onRemove={() => { onChange(block.id, { type: 'text', text: '', diagram: undefined }); onBackspaceEmpty(block.id) }} /></div></div>

  if (block.type === 'columns') {
    const cols = block.cols && block.cols.length ? block.cols : [[newBlock()], [newBlock()]]
    const setCol = (ci: number, u: (bs: Block[]) => Block[]) =>
      onChange(block.id, (b) => {
        const c = (b.cols && b.cols.length ? b.cols : cols).slice()
        c[ci] = u(c[ci] && c[ci].length ? c[ci] : [newBlock()])
        return { cols: c }
      })
    const isBlank = (x: Block) => x.type === 'text' && !(x.text || '').replace(/<[^>]+>|&nbsp;/g, '').trim()
    // Removing a column keeps its content: it slides into the column on its left.
    const removeCol = (ci: number) =>
      onChange(block.id, (b) => {
        const c = (b.cols && b.cols.length ? b.cols : cols).slice()
        const [gone] = c.splice(ci, 1)
        const into = Math.max(0, ci - 1)
        const keep = (gone || []).filter((x) => !isBlank(x))
        if (keep.length) c[into] = [...c[into].filter((x) => !isBlank(x)), ...keep]
        return { cols: c }
      })
    return (
      <div className="block columns"><span className="grip">⠿</span>
        <div className="content">
          <div className="ig-cols" style={{ ['--ig-ncols' as string]: cols.length } as React.CSSProperties}>
            {cols.map((col, ci) => (
              <div className="ig-col" key={ci}>
                <CellEditor token={token} blocks={col && col.length ? col : [newBlock()]} setBlocks={(u) => setCol(ci, u)} pages={pages} registerSubpage={registerSubpage} openPage={openPage} />
                {cols.length > 1 && (
                  <button className="ig-col-x" title="Remove this column (its content moves next door)" onMouseDown={(e) => e.preventDefault()} onClick={() => removeCol(ci)}>×</button>
                )}
              </div>
            ))}
          </div>
          {cols.length < 4 && (
            <button className="ig-col-add" onMouseDown={(e) => e.preventDefault()} onClick={() => onChange(block.id, (b) => ({ cols: [...(b.cols && b.cols.length ? b.cols : cols), [newBlock()]] }))}>＋ column</button>
          )}
        </div>
      </div>
    )
  }

  if (block.type === 'toggle') {
    const kids = block.children && block.children.length ? block.children : null
    const open = block.open !== false
    return (
      <div className={`block toggle ${open ? 'open' : ''}`}><span className="grip">⠿</span>
        <div className="content">
          <div className="ig-toggle-head">
            <button className="ig-toggle-caret" title={open ? 'Fold' : 'Unfold'} onMouseDown={(e) => e.preventDefault()} onClick={() => onChange(block.id, { open: !open })}>▸</button>
            {editable('Dropdown title…')}
          </div>
          {open && (
            <div className="ig-toggle-body">
              <CellEditor
                token={token}
                blocks={kids || [newBlock()]}
                setBlocks={(u) => onChange(block.id, (b) => ({ children: u(b.children && b.children.length ? b.children : [newBlock()]) }))}
                pages={pages}
                registerSubpage={registerSubpage}
                openPage={openPage}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (block.type === 'bullet')
    return (
      <div className="block bullet"><span className="grip">⠿</span>
        <div className="content">
          <BulletMarker value={block.bullet} onPick={(k) => onChange(block.id, { bullet: k })} />
          {editable('List item…')}
        </div>
      </div>
    )

  if (block.type === 'todo')
    return (
      <div className={`block todo ${block.checked ? 'done' : ''}`}><span className="grip">⠿</span>
        <div className="content">
          <button className={`todo-box ${block.checked ? 'on' : ''}`} onClick={() => onToggle(block.id)}>{block.checked ? '✓' : ''}</button>
          {editable('To-do…')}
        </div>
      </div>
    )

  const cls = block.type === 'h1' ? 'h1' : block.type === 'h2' ? 'h2' : ''
  const ph = block.type === 'h1' ? 'Heading' : block.type === 'h2' ? 'Subheading' : "Type '/' for blocks…"
  return <div className={`block ${cls}`}><span className="grip">⠿</span><div className="content">{editable(ph)}</div></div>
}

type SlashState = { blockId: string; pos: { x: number; y: number }; query: string; index: number }

type PageRef = {
  id: string
  title: string
  isNode: boolean
  kind?: 'central' | 'sub'
  color: PaletteKey
  font?: string
  shape?: string
  start?: string
  end?: string
}

function Editor({
  token, page, blocks, setBlocks, pages, onClose, onBack, canBack,
  setTitle, updateNode, registerSubpage, openPage, createPageFrom, getPageBlocks,
  tasks, onAddTask, onToggleTask, onRemoveTask
}: {
  token: string
  page: PageRef
  blocks: Block[]
  setBlocks: (updater: (bs: Block[]) => Block[]) => void
  pages: Record<string, { title: string }>
  onClose: () => void
  onBack: () => void
  canBack: boolean
  setTitle: (title: string) => void
  updateNode: (patch: Partial<BubbleData>) => void
  registerSubpage: () => string
  openPage: (id: string) => void
  createPageFrom: (title: string, blocks: Block[]) => string
  getPageBlocks: (id: string) => Block[]
  tasks: TodoTask[]
  onAddTask: (text: string, blockId?: string) => void
  onToggleTask: (taskId: string) => void
  onRemoveTask: (taskId: string) => void
}) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const [slash, setSlash] = useState<SlashState | null>(null)
  const [showKit, setShowKit] = useState(false)
  // Header details (dates, font, shape) stay folded so the page gets the room.
  const [showDetails, setShowDetails] = useState<boolean>(() => {
    try { return localStorage.getItem('ideaGarden.showDetails') === '1' } catch { return false }
  })
  useEffect(() => { try { localStorage.setItem('ideaGarden.showDetails', showDetails ? '1' : '0') } catch { /* ignore */ } }, [showDetails])

  // --- resizable page: drag the left edge; the width is remembered ---
  const DEFAULT_W = 640
  const [drawerW, setDrawerW] = useState<number>(() => {
    try { return Number(localStorage.getItem('ideaGarden.drawerWidth')) || DEFAULT_W } catch { return DEFAULT_W }
  })
  const asideRef = useRef<HTMLElement>(null)
  useEffect(() => {
    try { localStorage.setItem('ideaGarden.drawerWidth', String(Math.round(drawerW))) } catch { /* ignore */ }
  }, [drawerW])
  const maxDrawerW = () => {
    const parent = asideRef.current?.parentElement
    return (parent ? parent.getBoundingClientRect().width : window.innerWidth) - 32
  }
  // Soft close: play the slide-out, then actually close.
  const [closing, setClosing] = useState(false)
  const [resizing, setResizing] = useState(false)
  const requestClose = () => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 460)
  }
  function startResize(e: React.PointerEvent) {
    e.preventDefault()
    setResizing(true)
    const parent = asideRef.current?.parentElement
    const right = parent ? parent.getBoundingClientRect().right : window.innerWidth
    const maxW = maxDrawerW()
    const onMove = (ev: PointerEvent) => setDrawerW(Math.max(380, Math.min(maxW, right - ev.clientX)))
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setResizing(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }
  // Double-click the edge to jump between normal and nearly full width.
  const toggleWide = () => setDrawerW((w) => (w > DEFAULT_W + 40 ? DEFAULT_W : maxDrawerW()))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFileType = useRef<BlockType>('file')
  const pal = paletteFor(page.color)

  const patchBlock = (id: string, patch: BlockPatch) => setBlocks((bs) => bs.map((b) => (b.id === id ? applyPatch(b, patch) : b)))

  function addAfter(id: string, block: Block) {
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id)
      const copy = [...bs]
      copy.splice(i + 1, 0, block)
      return copy
    })
    setFocusId(block.id)
  }

  const onIndent = (id: string, delta: number) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, indent: Math.max(0, Math.min(5, (b.indent || 0) + delta)) } : b)))

  const onEnter = (id: string, isEmpty: boolean, tail?: string) => {
    const b = blocks.find((x) => x.id === id)
    const indent = b?.indent || 0
    if (tail !== undefined) {
      // Split mid-text: the rest of the line becomes the next line (same kind of line).
      const keep = b?.type === 'todo' || b?.type === 'bullet' ? b.type : 'text'
      const nb = newBlock(keep, { indent, bullet: b?.bullet, text: tail })
      caretAtStart.add(nb.id); addAfter(id, nb); return
    }
    if (isEmpty && indent > 0) {
      // Enter on an empty nested line pulls it back out one level (Notion-style).
      patchBlock(id, { indent: indent - 1 })
      setFocusId(id)
      return
    }
    if (b?.type === 'todo' || b?.type === 'bullet') {
      if (isEmpty) {
        // Second Enter on an empty to-do/bullet ends the list → back to normal text.
        patchBlock(id, { type: 'text', checked: false, text: '' })
        setFocusId(id)
      } else {
        // Enter with content → next item at the same depth (bullets keep their style).
        addAfter(id, newBlock(b.type, { indent, bullet: b.bullet }))
      }
      return
    }
    addAfter(id, newBlock('text', { indent }))
  }

  // "- " typed at the start of a line → turn it into a bullet. New bullets reuse
  // the style of the nearest bullet above, so a list stays consistent.
  const onAutoBullet = (id: string, rest: string) => {
    const i = blocks.findIndex((x) => x.id === id)
    const prev = blocks.slice(0, i).reverse().find((x) => x.type === 'bullet')
    patchBlock(id, { type: 'bullet', text: rest, bullet: prev?.bullet || 'dot' })
    setFocusId(null)
    setTimeout(() => setFocusId(id), 0)
  }
  // Backspace at the start of a formatted line → plain text, cursor stays put.
  const onUnformat = (id: string) => {
    patchBlock(id, { type: 'text', checked: false })
    setFocusId(null)
    setTimeout(() => setFocusId(id), 0)
  }
  function onBackspaceEmpty(id: string) {
    setBlocks((bs) => {
      if (bs.length === 1) return bs
      const i = bs.findIndex((b) => b.id === id)
      const prevId = bs[i - 1]?.id
      if (prevId) { setFocusId(null); setTimeout(() => setFocusId(prevId), 0) }
      return bs.filter((b) => b.id !== id)
    })
  }

  // --- drag a line to reorder it anywhere ---
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropHint, setDropHint] = useState<{ id: string; pos: 'before' | 'after' | 'left' | 'right' } | null>(null)
  const [fileOver, setFileOver] = useState(false)
  function moveBlock(fromId: string, toId: string, pos: 'before' | 'after') {
    if (fromId === toId) return
    setBlocks((bs) => {
      const item = bs.find((b) => b.id === fromId)
      if (!item) return bs
      const rest = bs.filter((b) => b.id !== fromId)
      let to = rest.findIndex((b) => b.id === toId)
      if (to < 0) return bs
      if (pos === 'after') to += 1
      rest.splice(to, 0, item)
      return rest
    })
  }

  // --- drop local files anywhere in the page → upload as image/file blocks ---
  async function uploadFilesAfter(afterId: string | null, files: File[]) {
    let anchor = afterId
    for (const file of files) {
      const type: BlockType = file.type.startsWith('image/') ? 'image' : 'file'
      const nb = newBlock(type, { fileName: file.name, fileType: file.type, fileSize: file.size })
      setBlocks((bs) => {
        const i = anchor ? bs.findIndex((b) => b.id === anchor) : bs.length - 1
        const copy = [...bs]
        copy.splice(i + 1, 0, nb)
        return copy
      })
      anchor = nb.id
      try {
        const up = await uploadFile(token, file)
        patchBlock(nb.id, { type, filePath: up.path, fileName: up.name, fileType: up.type, fileSize: up.size })
      } catch {
        patchBlock(nb.id, { type: 'text', text: `⚠️ Upload failed: ${file.name}` })
      }
    }
  }
  // --- right-click a selection → turn those lines into a dropdown or a page ---
  // `single`: right-click on one plain line → also offer "Turn into" + the to-do list.
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; ids: string[]; text: string; single?: boolean } | null>(null)
  const [naming, setNaming] = useState<{ kind: 'toggle' | 'page'; ids: string[]; name: string } | null>(null)
  // --- select across lines: drag from one line into others → the whole lines
  // highlight (each line is its own text box, so the browser can't do it). ---
  const [picked, setPicked] = useState<string[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<string | null>(null)
  const rowIdAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    let r = el?.closest('.block-row') as HTMLElement | null
    while (r && r.parentElement !== bodyRef.current) r = r.parentElement?.closest('.block-row') as HTMLElement | null
    return r?.dataset.blockId || null
  }
  const rangeIds = (a: string, b: string) => {
    const ids = blocks.map((x) => x.id)
    const i = ids.indexOf(a), j = ids.indexOf(b)
    return i < 0 || j < 0 ? [] : ids.slice(Math.min(i, j), Math.max(i, j) + 1)
  }
  const plainOf = (b: Block): string => {
    const t = (b.text || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
    const kids = [...(b.children || []), ...(b.cols || []).flat(), ...(b.cells || []).flat(2)].map(plainOf).filter(Boolean)
    const lead = b.type === 'bullet' ? `${bulletGlyph(b.bullet)} ` : b.type === 'todo' ? (b.checked ? '☑ ' : '☐ ') : ''
    return [t ? lead + t : '', ...kids].filter(Boolean).join('\n')
  }
  const pickedText = (ids: string[]) => blocks.filter((b) => ids.includes(b.id)).map(plainOf).filter(Boolean).join('\n')
  function onBodyMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    const t = e.target as HTMLElement
    if (t.closest('.grip, button, input, select, a, .ig-col-resize, .ig-row-resize, .ig-img-handle, .ig-pick-bar, .dg-wrap')) return
    const startId = rowIdAt(e.clientX, e.clientY)
    if (e.shiftKey && startId && (anchorRef.current || picked.length)) {
      e.preventDefault()
      setPicked(rangeIds(anchorRef.current || picked[0], startId))
      window.getSelection()?.removeAllRanges()
      return
    }
    if (picked.length) setPicked([])
    if (!startId) return
    anchorRef.current = startId
    let multi = false
    const onMove = (ev: MouseEvent) => {
      const cur = rowIdAt(ev.clientX, ev.clientY)
      if (!cur) return
      if (!multi && cur !== startId) {
        multi = true
        ;(document.activeElement as HTMLElement | null)?.blur?.()
        document.body.style.userSelect = 'none'
      }
      if (multi) { window.getSelection()?.removeAllRanges(); setPicked(rangeIds(startId, cur)) }
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp)
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp)
  }
  function deletePicked(ids = picked) {
    const idSet = new Set(ids)
    setBlocks((bs) => { const rest = bs.filter((b) => !idSet.has(b.id)); return rest.length ? rest : [newBlock()] })
    setPicked([])
  }
  // Keys while lines are highlighted: Backspace/Delete, Copy/Cut, Tab/Shift+Tab, Esc.
  useEffect(() => {
    if (!picked.length) return
    function onKey(e: KeyboardEvent) {
      const a = document.activeElement as HTMLElement | null
      if (a && (a.isContentEditable || a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return
      const mod = e.metaKey || e.ctrlKey
      if (e.key === 'Escape') { setPicked([]); return }
      if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); deletePicked(); return }
      if (mod && (e.key === 'c' || e.key === 'x')) {
        e.preventDefault()
        try { navigator.clipboard?.writeText(pickedText(picked)) } catch { /* ignore */ }
        if (e.key === 'x') deletePicked()
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        const d = e.shiftKey ? -1 : 1
        const idSet = new Set(picked)
        setBlocks((bs) => bs.map((b) => (idSet.has(b.id) ? { ...b, indent: Math.max(0, Math.min(5, (b.indent || 0) + d)) } : b)))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, blocks])

  function onBodyContextMenu(e: React.MouseEvent) {
    if (picked.length) {
      e.preventDefault()
      setCtxMenu({ x: Math.min(e.clientX, window.innerWidth - 230), y: Math.min(e.clientY, window.innerHeight - 170), ids: picked, text: pickedText(picked) })
      return
    }
    const sel = window.getSelection()
    const x = Math.min(e.clientX, window.innerWidth - 250)
    const lineMenu = (id: string | null) => {
      const b = id ? blocks.find((bl) => bl.id === id) : null
      if (!b || !TURN_KINDS.some((k) => k.key === b.type)) return false
      e.preventDefault()
      setCtxMenu({ x, y: Math.min(e.clientY, window.innerHeight - 470), ids: [b.id], text: plainText(b.text), single: true })
      return true
    }
    // No selection → a menu for the line under the pointer (or the browser's own).
    if (!sel || sel.isCollapsed || !sel.rangeCount) { lineMenu(rowIdAt(e.clientX, e.clientY)); return }
    const range = sel.getRangeAt(0)
    const rows = [...(e.currentTarget as HTMLElement).querySelectorAll(':scope > .block-row')] as HTMLElement[]
    const hit = new Set(rows.filter((r) => range.intersectsNode(r)).map((r) => r.dataset.blockId || ''))
    const ids = blocks.map((b) => b.id).filter((id) => hit.has(id))
    if (!ids.length) return
    // A selection inside one line (e.g. macOS selects the word you right-click) → that line's menu.
    if (ids.length === 1 && lineMenu(ids[0])) return
    e.preventDefault()
    setCtxMenu({ x, y: Math.min(e.clientY, window.innerHeight - 170), ids, text: sel.toString() })
  }
  // --- this page's to-do list: tasks + To-do blocks ---
  const taskByBlock = new Map(tasks.filter((t) => t.blockId).map((t) => [t.blockId as string, t]))
  const todoItems = todosFor(blocks, tasks)
  const toggleTodoItem = (t: TodoItem) =>
    t.kind === 'task' ? onToggleTask(t.id) : setBlocks((bs) => patchDeep(bs, t.id, (b) => ({ ...b, checked: !b.checked })))

  function turnInto(kind: BlockType) {
    const id = ctxMenu?.ids[0]
    setCtxMenu(null)
    window.getSelection()?.removeAllRanges()
    if (!id) return
    const linked = taskByBlock.get(id)
    // Becoming a To-do block already puts it on the list → drop the duplicate task.
    if (kind === 'todo' && linked) onRemoveTask(linked.id)
    patchBlock(id, (b) => ({
      type: kind,
      checked: kind === 'todo' ? (linked ? linked.done : !!b.checked) : false,
      bullet: kind === 'bullet' ? b.bullet || 'dot' : b.bullet
    }))
    setFocusId(null)
    setTimeout(() => setFocusId(id), 0)
  }
  function toggleLineTask() {
    const id = ctxMenu?.ids[0]
    setCtxMenu(null)
    if (!id) return
    const linked = taskByBlock.get(id)
    if (linked) onRemoveTask(linked.id)
    else onAddTask(plainText(blocks.find((b) => b.id === id)?.text), id)
  }

  function beginNaming(kind: 'toggle' | 'page', idsIn?: string[]) {
    const ids = idsIn || ctxMenu?.ids
    if (!ids || !ids.length) return
    const first = blocks.find((b) => b.id === ids[0])
    const guess = (first?.text || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 60)
    setNaming({ kind, ids, name: guess })
    setCtxMenu(null)
  }
  // Selected lines become the left column; an empty column opens on the right.
  function moveSelectionToSide(idsIn?: string[]) {
    const ids = idsIn || ctxMenu?.ids
    if (!ids || !ids.length) return
    const idSet = new Set(ids)
    const picked = blocks.filter((b) => idSet.has(b.id)).map((b) => ({ ...b, indent: 0 }))
    const colsBlock = newBlock('columns', { cols: [picked.length ? picked : [newBlock()], [newBlock()]] })
    setBlocks((bs) => {
      const at = bs.findIndex((b) => idSet.has(b.id))
      const rest = bs.filter((b) => !idSet.has(b.id))
      rest.splice(at < 0 ? rest.length : Math.min(at, rest.length), 0, colsBlock)
      return rest
    })
    window.getSelection()?.removeAllRanges()
    setCtxMenu(null)
    setPicked([])
  }
  // Selected lines → an A4 diagram: each line a bubble, indented lines linked
  // to their parent with arrows.
  function makeDiagram(idsIn?: string[]) {
    const ids = idsIn || ctxMenu?.ids
    if (!ids || !ids.length) return
    // Only text-like lines become bubbles; diagrams, tables, images etc. that
    // happen to be in the selection stay where they are (never deleted).
    const convertible = (b: Block) => isTextual(b.type) || b.type === 'toggle' || b.type === 'columns'
    const idSet = new Set(ids.filter((id) => { const b = blocks.find((x) => x.id === id); return !!b && convertible(b) }))
    if (!idSet.size) { setCtxMenu(null); setPicked([]); return }
    const chosen = blocks.filter((b) => idSet.has(b.id))
    const lines: { text: string; indent: number }[] = []
    const add = (b: Block, extra: number) => {
      const t = (b.text || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
      if (t) lines.push({ text: t, indent: (b.indent || 0) + extra })
      for (const k of b.children || []) add(k, (b.indent || 0) + extra + 1)
      for (const col of b.cols || []) for (const k of col) add(k, (b.indent || 0) + extra)
    }
    chosen.forEach((b) => add(b, 0))
    const diagram = diagramFromLines(lines.length ? lines : [{ text: 'Main idea', indent: 0 }])
    const repl = newBlock('diagram', { diagram })
    setBlocks((bs) => {
      const at = bs.findIndex((b) => idSet.has(b.id))
      const rest = bs.filter((b) => !idSet.has(b.id))
      rest.splice(at < 0 ? rest.length : Math.min(at, rest.length), 0, repl)
      return rest.length ? rest : [newBlock()]
    })
    window.getSelection()?.removeAllRanges()
    setCtxMenu(null)
    setPicked([])
  }
  function convertSelection() {
    if (!naming) return
    const name = naming.name.trim() || (naming.kind === 'toggle' ? 'Dropdown' : 'Untitled page')
    const idSet = new Set(naming.ids)
    const picked = blocks.filter((b) => idSet.has(b.id)).map((b) => ({ ...b, indent: 0 }))
    const replacement: Block = naming.kind === 'toggle'
      ? newBlock('toggle', { text: name, open: true, children: picked.length ? picked : [newBlock()] })
      : newBlock('subpage', { pageId: createPageFrom(name, picked) })
    setBlocks((bs) => {
      const at = bs.findIndex((b) => idSet.has(b.id))
      const rest = bs.filter((b) => !idSet.has(b.id))
      const insertAt = at < 0 ? rest.length : Math.min(at, rest.length)
      rest.splice(insertAt, 0, replacement)
      return rest.length ? rest : [newBlock()]
    })
    window.getSelection()?.removeAllRanges()
    setNaming(null)
    setPicked([])
  }

  // Drop a line on the left/right edge of another → they sit side by side.
  function placeBeside(fromId: string, toId: string, side: 'left' | 'right') {
    if (fromId === toId) return
    setBlocks((bs) => {
      const item = bs.find((b) => b.id === fromId)
      const target = bs.find((b) => b.id === toId)
      if (!item || !target) return bs
      const moved = { ...item, indent: 0 }
      let replacement: Block
      if (target.type === 'columns' && (target.cols?.length || 0) < 4) {
        const cols = target.cols || []
        replacement = { ...target, cols: side === 'left' ? [[moved], ...cols] : [...cols, [moved]] }
      } else {
        const t = { ...target, indent: 0 }
        replacement = { id: `cols-${fromId}-${toId}`, type: 'columns', text: '', cols: side === 'left' ? [[moved], [t]] : [[t], [moved]] }
      }
      return bs.filter((b) => b.id !== fromId).map((b) => (b.id === toId ? replacement : b))
    })
  }
  function handleDrop(e: React.DragEvent, targetId: string | null, pos: 'before' | 'after' | 'left' | 'right') {
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      e.preventDefault(); e.stopPropagation(); setFileOver(false); setDropHint(null)
      uploadFilesAfter(targetId, [...e.dataTransfer.files])
      return
    }
    const from = e.dataTransfer.getData('text/ig-block')
    if (from && targetId) {
      e.preventDefault(); e.stopPropagation()
      if (pos === 'left' || pos === 'right') placeBeside(from, targetId, pos)
      else moveBlock(from, targetId, pos)
      setDropHint(null)
    }
  }

  function onSlash(blockId: string, query: string | null, pos?: { x: number; y: number }) {
    if (query === null) { setSlash((s) => (s && s.blockId === blockId ? null : s)); return }
    setSlash((s) => (s && s.blockId === blockId ? { ...s, query, pos: pos || s.pos } : { blockId, query, pos: pos!, index: 0 }))
  }

  useEffect(() => {
    if (!slash) return
    function onKey(e: KeyboardEvent) {
      const items = filterItems(slash!.query)
      if (e.key === 'Escape') { e.preventDefault(); setSlash(null) }
      else if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); setSlash((s) => (s ? { ...s, index: Math.min(s.index + 1, items.length - 1) } : s)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); setSlash((s) => (s ? { ...s, index: Math.max(s.index - 1, 0) } : s)) }
      else if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (items[slash!.index]) pickSlash(items[slash!.index].key) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slash])

  function pickSlash(kind: BlockType | 'page') {
    const id = slash?.blockId
    const active = document.activeElement as HTMLElement | null
    if (active && active.isContentEditable) active.innerText = ''
    setSlash(null)
    if (!id) return

    if (kind === 'youtube') {
      const url = window.prompt('Paste a YouTube link 💛') || ''
      patchBlock(id, url ? { type: 'youtube', url, text: '' } : { type: 'text', text: '' })
      if (url) addAfter(id, newBlock())
      return
    }
    if (kind === 'file' || kind === 'image') {
      pendingFileType.current = kind
      if (fileInputRef.current) {
        fileInputRef.current.accept = kind === 'image' ? 'image/*' : '*/*'
        fileInputRef.current.dataset.target = id
        fileInputRef.current.click()
      }
      return
    }
    if (kind === 'page') {
      const pid = registerSubpage()
      patchBlock(id, { type: 'subpage', pageId: pid, text: '' })
      addAfter(id, newBlock())
      return
    }
    if (kind === 'table') {
      patchBlock(id, { type: 'table', cells: [[[newBlock()], [newBlock()], [newBlock()]], [[newBlock()], [newBlock()], [newBlock()]]], text: '' })
      addAfter(id, newBlock())
      return
    }
    if (kind === 'toggle') {
      patchBlock(id, { type: 'toggle', text: '', open: true, children: [newBlock()] })
      setFocusId(id)
      return
    }
    if (kind === 'columns') {
      patchBlock(id, { type: 'columns', text: '', cols: [[newBlock()], [newBlock()]] })
      addAfter(id, newBlock())
      return
    }
    if (kind === 'diagram') {
      patchBlock(id, { type: 'diagram', text: '', diagram: diagramFromLines([{ text: 'Main idea', indent: 0 }]) })
      addAfter(id, newBlock())
      return
    }
    if (kind === 'status') {
      patchBlock(id, { type: 'status', statusOptions: DEFAULT_STATUS_OPTIONS, status: '', text: '' })
      addAfter(id, newBlock())
      return
    }
    if (kind === 'divider') { patchBlock(id, { type: 'divider', text: '' }); addAfter(id, newBlock()); return }
    patchBlock(id, { type: kind, text: '' })
    setFocusId(id)
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const targetId = e.target.dataset.target || ''
    e.target.value = ''
    if (!file || !targetId) return
    patchBlock(targetId, { type: pendingFileType.current, fileName: file.name, fileType: file.type, fileSize: file.size })
    try {
      const up = await uploadFile(token, file)
      patchBlock(targetId, {
        type: pendingFileType.current,
        filePath: up.path, fileName: up.name, fileType: up.type, fileSize: up.size, text: ''
      })
      addAfter(targetId, newBlock())
    } catch {
      patchBlock(targetId, { type: 'text', text: `⚠️ Upload failed: ${file.name}` })
    }
  }

  return (
    <>
      <div className={`ig-scrim ${closing ? 'closing' : ''}`} onClick={requestClose} />
      <aside ref={asideRef} className={`ig-drawer ${closing ? 'closing' : ''} ${resizing ? 'resizing' : ''}`} style={{ width: drawerW }}>
        <div
          className="ig-resize"
          onPointerDown={startResize}
          onDoubleClick={toggleWide}
          title="Drag to resize · double-click to expand"
        />
        <button className="ig-expand" onClick={toggleWide} title={drawerW > DEFAULT_W + 40 ? 'Shrink page' : 'Expand page'}>
          {drawerW > DEFAULT_W + 40 ? '⇥' : '⇤'}
        </button>
        <div className={`doc-head compact ${showDetails ? 'open' : ''}`}>
          <div className="row">
            {canBack && <button className="ig-back" onClick={onBack}>‹ Back</button>}
            <span className="chip" style={{ background: pal.fill, color: pal.ink }} title={page.isNode ? (page.kind === 'central' ? 'Central idea' : 'Thought bubble') : 'Page'}>
              {page.isNode ? (page.kind === 'central' ? '🌸' : '💭') : '📄'}
            </span>
            <input
              className="doc-title"
              value={page.title}
              placeholder={page.isNode ? 'Untitled thought' : 'Untitled page'}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className={`ig-details-btn ${showDetails ? 'on' : ''}`} onClick={() => setShowDetails((v) => !v)} title="Dates, font, bubble shape">
              <span className="caret">▾</span> details
            </button>
            <button
              className="ig-pdf-btn"
              title="Export this page as a clean A4 PDF"
              onClick={() => exportPagePdf({
                title: page.title,
                blocks,
                fontFamily: fontStack(page.font),
                token,
                getPageBlocks,
                pageTitle: (id) => pages[id]?.title || 'Untitled page'
              })}
            >⤓ PDF</button>
            <button className="ig-kit-btn" onClick={() => setShowKit(true)} title="Package this page for posting">📤 Post Kit</button>
            <button className="close-x" onClick={requestClose}>×</button>
          </div>
          {showDetails && (
            <div className="doc-details">
            {page.isNode && (
              <div className="doc-dates">
                🗓️ from
                <input type="date" value={page.start || ''} onChange={(e) => updateNode({ start: e.target.value })} />
                to
                <input type="date" value={page.end || ''} onChange={(e) => updateNode({ end: e.target.value })} />
              </div>
            )}
            <div className="doc-tools">
              {page.isNode && (
                <>
                  <label className="doc-font" title="Font">
                    <span className="aa">Aa</span>
                    <select value={page.font || DEFAULT_FONT} onChange={(e) => updateNode({ font: e.target.value })}>
                      {['Cute & handwritten', 'Formal'].map((g) => (
                        <optgroup key={g} label={g}>
                          {FONTS.filter((f) => f.group === g).map((f) => (
                            <option key={f.key} value={f.key}>{f.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                  <div className="doc-shapes" title="Bubble shape">
                    {SHAPES.map((s) => (
                      <button
                        key={s.key}
                        className={`shape-btn ${(page.shape || DEFAULT_SHAPE) === s.key ? 'active' : ''}`}
                        title={s.label}
                        onClick={() => updateNode({ shape: s.key })}
                      >
                        <span className={`shape-swatch shape-${s.key}`} />
                      </button>
                    ))}
                  </div>
                </>
              )}
              <span className="doc-hint">select text · <b>Ctrl+H</b> to highlight</span>
            </div>
            </div>
          )}
        </div>

        <div
          key={page.id}
          className={`doc-body ${fileOver ? 'file-over' : ''}`}
          style={{ ['--ig-font' as string]: fontStack(page.font), fontFamily: fontStack(page.font) } as React.CSSProperties}
          onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setFileOver(true) } }}
          onDragLeave={(e) => { if (e.currentTarget === e.target) setFileOver(false) }}
          onDrop={(e) => handleDrop(e, blocks.length ? blocks[blocks.length - 1].id : null, 'after')}
          onContextMenu={onBodyContextMenu}
          onMouseDown={onBodyMouseDown}
          ref={bodyRef}
        >
          {blocks.map((b) => (
            <div
              key={b.id}
              data-block-id={b.id}
              className={`block-row ${dropHint?.id === b.id ? 'drop-' + dropHint.pos : ''} ${picked.includes(b.id) ? 'blk-picked' : ''} ${taskByBlock.has(b.id) ? 'has-task' : ''}`}
              style={{ marginLeft: (b.indent || 0) * 24 }}
              draggable={dragId === b.id}
              onMouseDown={(e) => { if ((e.target as HTMLElement).closest('.grip')) setDragId(b.id) }}
              onDragStart={(e) => { e.dataTransfer.setData('text/ig-block', b.id); e.dataTransfer.effectAllowed = 'move' }}
              onDragEnd={() => { setDragId(null); setDropHint(null) }}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes('Files')) return // let body handle file drops
                if (!dragId || dragId === b.id) return
                e.preventDefault()
                const r = e.currentTarget.getBoundingClientRect()
                // Near the left/right edge → side by side; otherwise above/below.
                const edge = Math.min(90, r.width * 0.18)
                const pos = e.clientX < r.left + edge ? 'left' : e.clientX > r.right - edge ? 'right' : e.clientY < r.top + r.height / 2 ? 'before' : 'after'
                setDropHint({ id: b.id, pos })
              }}
              onDrop={(e) => { if (!e.dataTransfer.files?.length) handleDrop(e, b.id, dropHint?.pos || 'after') }}
            >
              {b.type === 'subpage' ? (
                <div className="block">
                  <span className="grip" title="Drag to move">⠿</span>
                  <div className="content">
                    <button className="pagelink" onClick={() => b.pageId && openPage(b.pageId)}>
                      📄 {(b.pageId && pages[b.pageId]?.title) || 'Untitled page'} →
                    </button>
                  </div>
                </div>
              ) : b.type === 'pagelink' ? (
                <div className="block">
                  <span className="grip" title="Drag to move">⠿</span>
                  <div className="content">
                    <button className="pagelink" onClick={() => b.targetId && openPage(b.targetId)}>🫧 Open linked bubble →</button>
                  </div>
                </div>
              ) : (
                <BlockView
                  // type in the key → a fresh DOM node per type, so no stale text is left behind
                  key={`${b.id}:${b.type}`}
                  token={token}
                  block={b}
                  autoFocus={focusId === b.id}
                  pages={pages}
                  registerSubpage={registerSubpage}
                  openPage={openPage}
                  onChange={patchBlock}
                  onEnter={onEnter}
                  onBackspaceEmpty={onBackspaceEmpty}
                  onSlash={onSlash}
                  onToggle={(id) => patchBlock(id, { checked: !b.checked })}
                  onIndent={onIndent}
                  onAutoBullet={onAutoBullet}
                  onUnformat={onUnformat}
                  onPasteFiles={(id, files) => uploadFilesAfter(id, files)}
                />
              )}
              {taskByBlock.has(b.id) && (() => {
                const t = taskByBlock.get(b.id)!
                return (
                  <button
                    className={`td-tag ${t.done ? 'on' : ''}`}
                    title={t.done ? 'Done! (click to undo)' : 'On the to-do list (click to tick)'}
                    onClick={() => onToggleTask(t.id)}
                  >
                    {t.done ? '✓ done' : '📝 to-do'}
                  </button>
                )
              })()}
            </div>
          ))}
        </div>

        {picked.length > 0 && (
          <div className="ig-pick-bar" onMouseDown={(e) => e.preventDefault()}>
            <span className="n">{picked.length} line{picked.length > 1 ? 's' : ''}</span>
            <button onClick={() => beginNaming('toggle', picked)}>▸ Dropdown</button>
            <button onClick={() => beginNaming('page', picked)}>📄 Page</button>
            <button onClick={() => moveSelectionToSide(picked)}>▥ Side</button>
            <button onClick={() => makeDiagram(picked)}>◎ Diagram</button>
            <button onClick={() => { try { navigator.clipboard?.writeText(pickedText(picked)) } catch { /* ignore */ } }}>⧉ Copy</button>
            <button className="danger" onClick={() => deletePicked()}>🗑 Delete</button>
            <button className="x" title="Clear selection (Esc)" onClick={() => setPicked([])}>✕</button>
          </div>
        )}

        <input ref={fileInputRef} type="file" hidden onChange={onFileChosen} />

        <TodoDock
          items={todoItems}
          onToggle={toggleTodoItem}
          onRemove={(t) => onRemoveTask(t.id)}
          onAdd={(text) => onAddTask(text)}
        />
      </aside>

      {slash && (
        <SlashMenu pos={slash.pos} query={slash.query} index={slash.index} onPick={pickSlash} />
      )}

      {ctxMenu && (
        <div className="ig-ctx-veil" onMouseDown={() => setCtxMenu(null)} onContextMenu={(e) => { e.preventDefault(); setCtxMenu(null) }}>
          <div className="ig-ctx" style={{ left: ctxMenu.x, top: ctxMenu.y }} onMouseDown={(e) => e.stopPropagation()}>
            {ctxMenu.single ? (() => {
              const cur = blocks.find((b) => b.id === ctxMenu.ids[0])
              const onList = taskByBlock.has(ctxMenu.ids[0])
              return (
                <>
                  <div className="ig-ctx-label">Turn into</div>
                  <div className="ig-ctx-turn">
                    {TURN_KINDS.map((k) => (
                      <button key={k.key} className={cur?.type === k.key ? 'on' : ''} onClick={() => turnInto(k.key)} title={k.label}>
                        <span className="ico">{k.ico}</span>{k.label}
                      </button>
                    ))}
                  </div>
                  {cur?.type !== 'todo' && (onList || plainText(cur?.text)) && (
                    <>
                      <div className="ig-ctx-sep" />
                      <button className="ig-ctx-item" onClick={toggleLineTask}>
                        <span className="ico">{onList ? '🧹' : '📝'}</span>{onList ? 'Remove from to-do list' : 'Add to to-do list'}
                      </button>
                    </>
                  )}
                  <div className="ig-ctx-sep" />
                </>
              )
            })() : (
              <div className="ig-ctx-label">{ctxMenu.ids.length} line{ctxMenu.ids.length > 1 ? 's' : ''} selected</div>
            )}
            <button className="ig-ctx-item" onClick={() => beginNaming('toggle')}><span className="ico">▸</span>Turn into dropdown</button>
            <button className="ig-ctx-item" onClick={() => beginNaming('page')}><span className="ico">📄</span>Turn into page</button>
            <button className="ig-ctx-item" onClick={() => moveSelectionToSide()}><span className="ico">▥</span>Move to the side</button>
            <button className="ig-ctx-item" onClick={() => makeDiagram()}><span className="ico">◎</span>Turn into diagram</button>
            <button className="ig-ctx-item" onClick={() => { try { navigator.clipboard?.writeText(ctxMenu.text) } catch { /* ignore */ } setCtxMenu(null) }}><span className="ico">⧉</span>Copy text</button>
          </div>
        </div>
      )}

      {naming && (
        <div className="ig-ctx-veil dim" onMouseDown={() => setNaming(null)}>
          <form
            className="ig-name-pop"
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); convertSelection() }}
          >
            <div className="ig-name-title">{naming.kind === 'toggle' ? '▸ Name your dropdown' : '📄 Name your page'}</div>
            <input
              autoFocus
              className="ig-name-input"
              value={naming.name}
              onChange={(e) => setNaming((n) => (n ? { ...n, name: e.target.value } : n))}
              onKeyDown={(e) => { if (e.key === 'Escape') setNaming(null) }}
              placeholder={naming.kind === 'toggle' ? 'e.g. Reading questions' : 'e.g. Practice set 1'}
            />
            <div className="ig-name-actions">
              <button type="button" className="ig-name-cancel" onClick={() => setNaming(null)}>Cancel</button>
              <button type="submit" className="ig-name-ok">{naming.kind === 'toggle' ? 'Create dropdown' : 'Create page'}</button>
            </div>
          </form>
        </div>
      )}

      {showKit && (
        <PostKitPanel token={token} pageId={page.id} title={page.title} blocks={blocks} onClose={() => setShowKit(false)} />
      )}
    </>
  )
}

function SlashMenu({ pos, query, index, onPick }: { pos: { x: number; y: number }; query: string; index: number; onPick: (k: BlockType | 'page') => void }) {
  const filtered = filterItems(query)
  const groups = [...new Set(filtered.map((i) => i.group))]
  let flat = -1
  return (
    <div className="slash" style={{ left: pos.x, top: pos.y }} onMouseDown={(e) => e.preventDefault()}>
      {filtered.length === 0 && <div className="grp">no matches 🙈</div>}
      {groups.map((g) => (
        <div key={g}>
          <div className="grp">{g}</div>
          {filtered.filter((i) => i.group === g).map((item) => {
            flat += 1
            const active = flat === index
            return (
              <button key={item.key} className={`item ${active ? 'active' : ''}`} onClick={() => onPick(item.key)}>
                <span className="ico">{item.ico}</span>
                <span className="txt"><b>{item.label}</b><span>{item.hint}</span></span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
const LOCAL_KEY = 'ideaGarden.fallback'

// How much real content a board holds: bubbles + note blocks. A fresh seed
// scores 1; anything the user has built scores higher. Used to make sure the
// richer version always wins over a blank one.
function docScore(d: GardenDoc | null | undefined): number {
  if (!d || !Array.isArray(d.nodes)) return -1
  const notes = Object.values(d.docs || {}).reduce((a, b) => a + (Array.isArray(b) ? b.length : 0), 0)
  return d.nodes.length + notes
}

function seedDoc(): GardenDoc {
  const centerId = uid()
  return {
    version: 1,
    nodes: [{
      id: centerId, type: 'bubble', position: { x: 0, y: 0 },
      data: { label: 'My big idea ✨', kind: 'central', color: 'bubblegum', start: '', end: '' }
    }],
    edges: [],
    docs: {},
    colorIndex: 1
  }
}

export default function IdeaGarden({ accessToken, onExit }: { accessToken?: string; onExit?: () => void }) {
  const token = accessToken || ''
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes] = useState<BubbleNodeModel[]>([])
  const [edges, setEdges] = useState<EdgeModel[]>([])
  const [docs, setDocs] = useState<Record<string, Block[]>>({})
  const [pages, setPages] = useState<Record<string, { title: string }>>({})
  const [tasks, setTasks] = useState<Record<string, TodoTask[]>>({})
  const colorIndexRef = useRef(1)
  // Navigation stack of open page ids (first is a bubble/node id, rest are sub-pages).
  const [openStack, setOpenStack] = useState<string[]>([])
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'offline'>('idle')
  const hydratedRef = useRef(false)
  // Saving to the server is gated until we have CONFIRMED the server's contents
  // at least once this session. This is the key data-safety rule: if the very
  // first load fails, we never push a blank/seed board on top of real data.
  const serverReadyRef = useRef(false)
  const latestDocRef = useRef<GardenDoc | null>(null)

  const readCache = (): GardenDoc | null => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null') } catch { return null }
  }
  const hydrate = (doc: GardenDoc) => {
    setNodes(doc.nodes)
    setEdges(doc.edges || [])
    setDocs(doc.docs || {})
    setPages(doc.pages || {})
    setTasks(doc.tasks || {})
    colorIndexRef.current = doc.colorIndex || 1
    hydratedRef.current = true
    setLoading(false)
  }

  // --- initial load, with retries; never clobber real data on a failed load ---
  useEffect(() => {
    let cancelled = false
    const cache = readCache()

    // No token (e.g. local preview): browser-only mode.
    if (!token) {
      hydrate(cache && cache.nodes?.length ? cache : seedDoc())
      setSaveState('offline')
      return
    }

    async function boot(attempt = 0): Promise<void> {
      try {
        const serverDoc = await loadGarden(token) // resolves = server reachable
        if (cancelled) return
        serverReadyRef.current = true
        if (!hydratedRef.current) {
          // Richer version wins, so a blank/seed board can never bury real notes:
          // score = bubbles + note-blocks. Cloud and this device's local backup
          // are compared; the fuller one is shown (and if local wins it gets
          // pushed up to the cloud by the save effect). A tie prefers the cloud.
          const sv = docScore(serverDoc)
          const cv = docScore(cache)
          let chosen: GardenDoc | null
          if (cv > sv) chosen = cache
          else if (sv >= 1 && serverDoc) chosen = serverDoc
          else if (cv >= 1) chosen = cache
          else chosen = seedDoc()
          hydrate(chosen && chosen.nodes?.length ? chosen : seedDoc())
        }
        setSaveState('saved')
      } catch {
        if (cancelled) return
        // Server unreachable: show last-known data read-only-safe, keep saving
        // DISABLED so we can't overwrite the server, and keep retrying.
        if (!hydratedRef.current) hydrate(cache && cache.nodes?.length ? cache : seedDoc())
        setSaveState('offline')
        if (attempt < 6) setTimeout(() => { if (!cancelled) boot(attempt + 1) }, 2500)
      }
    }
    boot()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // --- debounced persistence ---
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!hydratedRef.current) return
    const doc: GardenDoc = { version: 1, nodes, edges, docs, pages, tasks, colorIndex: colorIndexRef.current }
    latestDocRef.current = doc
    // Always keep a local backup so nothing is lost even while offline.
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(doc)) } catch { /* ignore */ }
    if (!token) return
    if (!serverReadyRef.current) { setSaveState('offline'); return }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveState('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        await saveGarden(token, doc)
        setSaveState('saved')
      } catch {
        // Lost the connection mid-session: stop pushing until it's back, then
        // the reconnect effect flushes the latest state up.
        serverReadyRef.current = false
        setSaveState('offline')
      }
    }, 800)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [nodes, edges, docs, pages, tasks, token])

  // --- reconnect: when we drop offline mid-session, keep trying and push the
  // latest state back up once the server answers again ---
  useEffect(() => {
    if (saveState !== 'offline' || !token) return
    const timer = setInterval(async () => {
      try {
        await loadGarden(token) // just a reachability probe
        serverReadyRef.current = true
        if (latestDocRef.current) await saveGarden(token, latestDocRef.current)
        setSaveState('saved')
      } catch { /* still offline, keep trying */ }
    }, 4000)
    return () => clearInterval(timer)
  }, [saveState, token])

  // --- final flush: if the tab closes with an unsaved change, push it out ---
  useEffect(() => {
    const onLeave = () => {
      if (token && serverReadyRef.current && latestDocRef.current) {
        try { void saveGarden(token, latestDocRef.current, true) } catch { /* best effort */ }
      }
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [token])

  // --- React Flow plumbing ---
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns as never) as unknown as BubbleNodeModel[])
  }, [])
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es as never) as unknown as EdgeModel[])
  }, [])
  const onConnect = useCallback((c: Connection) => {
    setEdges((es) => addEdge({ ...c, type: 'squiggle', id: uid() }, es as never) as unknown as EdgeModel[])
  }, [])

  // Drag an edge endpoint onto another bubble to re-anchor it; drop it on empty
  // canvas to remove the connection.
  const reconnectOk = useRef(true)
  const onReconnectStart = useCallback(() => { reconnectOk.current = false }, [])
  const onReconnect = useCallback((oldEdge: Edge, conn: Connection) => {
    reconnectOk.current = true
    setEdges((es) => reconnectEdge(oldEdge as never, conn, es as never) as unknown as EdgeModel[])
  }, [])
  const onReconnectEnd = useCallback((_: unknown, edge: Edge) => {
    if (!reconnectOk.current) setEdges((es) => es.filter((e) => e.id !== edge.id))
    reconnectOk.current = true
  }, [])

  const ctx = useMemo<GardenCtx>(() => ({
    updateNodeData: (id, patch) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))),
    addChild: (parentId) => {
      const id = uid()
      setNodes((ns) => {
        const parent = ns.find((n) => n.id === parentId)
        const angle = Math.random() * Math.PI * 2
        const dist = 240 + Math.random() * 80
        const px = parent ? parent.position.x : 0
        const py = parent ? parent.position.y : 0
        const child: BubbleNodeModel = {
          id, type: 'bubble',
          position: { x: px + Math.cos(angle) * dist, y: py + Math.sin(angle) * dist },
          data: { label: 'new thought', kind: 'sub', color: nextColor(colorIndexRef.current), start: '', end: '' }
        }
        colorIndexRef.current += 1
        return [...ns, child]
      })
      setEdges((es) => [...es, { id: uid(), source: parentId, target: id, type: 'squiggle' }])
      return id
    },
    deleteNode: (id) => {
      setNodes((ns) => ns.filter((n) => n.id !== id))
      setEdges((es) => es.filter((e) => e.source !== id && e.target !== id))
      setTasks((t) => { if (!t[id]) return t; const { [id]: _gone, ...rest } = t; return rest })
    },
    openNode: (id) => {
      setDocs((d) => (d[id] && d[id].length ? d : { ...d, [id]: [newBlock()] }))
      setOpenStack([id])
    }
  }), [])

  const addFloating = () => {
    const id = uid()
    setNodes((ns) => {
      const child: BubbleNodeModel = {
        id, type: 'bubble',
        position: { x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 },
        data: { label: 'stray spark', kind: 'sub', color: nextColor(colorIndexRef.current), start: '', end: '' }
      }
      colorIndexRef.current += 1
      return [...ns, child]
    })
  }

  const setBlocksFor = (pageId: string) => (updater: (bs: Block[]) => Block[]) =>
    setDocs((d) => ({ ...d, [pageId]: updater(d[pageId] && d[pageId].length ? d[pageId] : [newBlock()]) }))

  // Give a page a persistent first block the moment it opens, so its id is
  // stable and the very first edit (or a /table, /status insert) actually sticks.
  const ensureDoc = (id: string) =>
    setDocs((d) => (d[id] && d[id].length ? d : { ...d, [id]: [newBlock()] }))

  // Register a brand-new inline sub-page and seed it with an empty line.
  const registerSubpage = () => {
    const pid = uid()
    setPages((p) => ({ ...p, [pid]: { title: 'Untitled page' } }))
    setDocs((d) => ({ ...d, [pid]: [newBlock()] }))
    return pid
  }

  // Build the descriptor for whichever page is currently on top of the stack.
  const currentId = openStack.length ? openStack[openStack.length - 1] : null
  const currentNode = currentId ? nodes.find((n) => n.id === currentId) || null : null
  const rootNode = openStack.length ? nodes.find((n) => n.id === openStack[0]) || null : null
  let currentPage: PageRef | null = null
  if (currentId) {
    if (currentNode) {
      currentPage = {
        id: currentId, title: currentNode.data.label, isNode: true, kind: currentNode.data.kind,
        color: currentNode.data.color, font: currentNode.data.font, shape: currentNode.data.shape,
        start: currentNode.data.start, end: currentNode.data.end
      }
    } else if (pages[currentId]) {
      // A sub-page inherits the look of its root bubble.
      currentPage = {
        id: currentId, title: pages[currentId].title, isNode: false,
        color: rootNode?.data.color || 'bubblegum', font: rootNode?.data.font
      }
    }
  }
  // --- to-do lists (per page) ---
  const addTask = (pageId: string, text: string, blockId?: string) =>
    setTasks((t) => ({ ...t, [pageId]: [...(t[pageId] || []), { id: uid(), text, done: false, ...(blockId ? { blockId } : {}) }] }))
  const toggleTask = (pageId: string, taskId: string) =>
    setTasks((t) => ({ ...t, [pageId]: (t[pageId] || []).map((x) => (x.id === taskId ? { ...x, done: !x.done } : x)) }))
  const removeTask = (pageId: string, taskId: string) =>
    setTasks((t) => ({ ...t, [pageId]: (t[pageId] || []).filter((x) => x.id !== taskId) }))
  const toggleBlockTodo = (pageId: string, blockId: string) =>
    setDocs((d) => ({ ...d, [pageId]: patchDeep(d[pageId] || [], blockId, (b) => ({ ...b, checked: !b.checked })) }))

  const progress = useMemo(() => {
    const out: Record<string, { done: number; total: number }> = {}
    for (const n of nodes) {
      const p = progressOf(todosFor(docs[n.id], tasks[n.id]))
      if (p.total) out[n.id] = { done: p.done, total: p.total }
    }
    return out
  }, [nodes, docs, tasks])

  // Right-click a bubble → cute to-do recap card.
  const [recap, setRecap] = useState<{ nodeId: string; pos: { x: number; y: number } } | null>(null)
  const closeRecap = useCallback(() => setRecap(null), [])
  const recapNode = recap ? nodes.find((n) => n.id === recap.nodeId) : null

  const miniColor = useMemo(() => (n: { data?: { color?: string } }) => paletteFor(n.data?.color).border, [])

  return (
    <div className="ideaGarden">
      <div className="ig-topbar">
        {onExit && <button className="ig-pill ghost" onClick={onExit} title="Back to admin">← Back</button>}
        <span className="ig-brand">🌷 Idea Garden</span>
        <span className="ig-hint">scroll to zoom · double-click a bubble</span>
        <button className="ig-pill primary" onClick={addFloating}>+ new bubble</button>
        <span className={`ig-save ${saveState === 'saving' ? 'saving' : ''} ${saveState === 'offline' ? 'offline' : ''}`}>
          {saveState === 'saving'
            ? 'saving…'
            : saveState === 'saved'
              ? 'saved ✓'
              : saveState === 'offline'
                ? (token ? '⚠ reconnecting…' : 'local only')
                : ''}
        </span>
      </div>

      {loading && <div className="ig-loading">loading your garden… 🌱</div>}

      <Ctx.Provider value={ctx}>
        <ProgressCtx.Provider value={progress}>
        <ReactFlow
          nodes={nodes as never}
          edges={edges as never}
          nodeTypes={nodeTypes as never}
          edgeTypes={edgeTypes as never}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          connectionMode={ConnectionMode.Loose}
          connectionLineStyle={{ stroke: '#c9b6c1', strokeWidth: 2 }}
          defaultEdgeOptions={{ type: 'squiggle', markerEnd: { type: MarkerType.ArrowClosed, color: '#c9b6c1', width: 16, height: 16 } }}
          onNodeDoubleClick={(_, n) => { ensureDoc(n.id); setOpenStack([n.id]) }}
          onNodeContextMenu={(e, n) => { e.preventDefault(); setRecap({ nodeId: n.id, pos: { x: e.clientX + 8, y: e.clientY + 8 } }) }}
          zoomOnDoubleClick={false}
          deleteKeyCode={null}
          fitView
          fitViewOptions={{ padding: 0.6, maxZoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1.6} color="#dcd7d0" />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable nodeColor={miniColor as never} maskColor="rgba(120,110,105,0.12)" style={{ borderRadius: 12, border: '1px solid #e7e2db' }} />
        </ReactFlow>
        </ProgressCtx.Provider>
      </Ctx.Provider>

      <div className="ig-help">
        Double-click a bubble to open its <b>page</b>. Hover for <b>+ sub-bubble</b>. <b>Right-click</b> a bubble for its to-do recap. Inside a page, type <b>/</b> for to-dos, files, YouTube & more.
      </div>

      {currentPage && (
        <Editor
          token={token}
          page={currentPage}
          blocks={docs[currentPage.id] && docs[currentPage.id].length ? docs[currentPage.id] : [newBlock()]}
          setBlocks={setBlocksFor(currentPage.id)}
          pages={pages}
          onClose={() => setOpenStack([])}
          onBack={() => setOpenStack((s) => s.slice(0, -1))}
          canBack={openStack.length > 1}
          setTitle={(title) => {
            if (currentPage!.isNode) ctx.updateNodeData(currentPage!.id, { label: title })
            else setPages((p) => ({ ...p, [currentPage!.id]: { title } }))
          }}
          updateNode={(patch) => ctx.updateNodeData(currentPage!.id, patch)}
          registerSubpage={registerSubpage}
          openPage={(id) => { ensureDoc(id); setOpenStack((s) => [...s, id]) }}
          getPageBlocks={(id) => docs[id] || []}
          tasks={tasks[currentPage.id] || []}
          onAddTask={(text, blockId) => addTask(currentPage!.id, text, blockId)}
          onToggleTask={(taskId) => toggleTask(currentPage!.id, taskId)}
          onRemoveTask={(taskId) => removeTask(currentPage!.id, taskId)}
          createPageFrom={(title, blocks) => {
            const pid = uid()
            setPages((p) => ({ ...p, [pid]: { title } }))
            setDocs((d) => ({ ...d, [pid]: blocks.length ? blocks : [newBlock()] }))
            return pid
          }}
        />
      )}

      {recap && recapNode && (
        <TodoRecap
          title={recapNode.data.label}
          colors={paletteFor(recapNode.data.color)}
          items={todosFor(docs[recapNode.id], tasks[recapNode.id])}
          pos={recap.pos}
          onToggle={(t) => (t.kind === 'task' ? toggleTask(recapNode.id, t.id) : toggleBlockTodo(recapNode.id, t.id))}
          onOpen={() => { ensureDoc(recapNode.id); setOpenStack([recapNode.id]) }}
          onClose={closeRecap}
        />
      )}
    </div>
  )
}
