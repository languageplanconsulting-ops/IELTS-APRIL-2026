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
  ConnectionMode,
  MarkerType
} from '@xyflow/react'
import type { NodeProps, EdgeProps, Connection, NodeChange, EdgeChange, Edge, InternalNode } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './IdeaGarden.css'
import { paletteFor, nextColor } from './palette'
import type { PaletteKey } from './palette'
import { FONTS, SHAPES, fontStack, DEFAULT_FONT, DEFAULT_SHAPE } from './fonts'
import type { BubbleData, BubbleNodeModel, EdgeModel, Block, BlockType, GardenDoc } from './types'
import { loadGarden, saveGarden, uploadFile, signFile } from './api'

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
const useCtx = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Idea Garden context missing')
  return c
}

/* ------------------------------------------------------------------ */
/*  Bubble node                                                        */
/* ------------------------------------------------------------------ */
function BubbleNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as BubbleData
  const pal = paletteFor(d.color)
  const { updateNodeData, addChild, deleteNode, openNode } = useCtx()
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
    fontFamily: fontStack(d.font)
  } as React.CSSProperties
  const shape = d.shape || DEFAULT_SHAPE

  return (
    <div className={`bubble shape-${shape} ${central ? 'central' : ''} ${selected ? 'selected' : ''}`} style={style}>
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

      <div
        className="title nodrag"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={(e) => updateNodeData(id, { label: e.currentTarget.textContent?.trim() || '' })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); (e.currentTarget as HTMLElement).blur() }
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

const isTextual = (t: BlockType) => ['text', 'h1', 'h2', 'todo', 'callout'].includes(t)
const filterItems = (q: string) => {
  const s = q.toLowerCase()
  return SLASH_ITEMS.filter((i) => i.label.toLowerCase().includes(s) || String(i.key).includes(s))
}
const newBlock = (type: BlockType = 'text', extra: Partial<Block> = {}): Block => ({ id: uid(), type, text: '', ...extra })

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

// --- Table block: a small editable grid with add/remove row & column ---
function TableCell({ value, header, onCommit }: { value: string; header: boolean; onCommit: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (ref.current) ref.current.innerText = value || '' }, []) // seed once
  return (
    <div
      ref={ref}
      className={`ig-td ${header ? 'h' : ''}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onCommit(e.currentTarget.innerText)}
    />
  )
}

function TableBlock({ block, onChange }: { block: Block; onChange: (id: string, patch: Partial<Block>) => void }) {
  const rows = block.rows && block.rows.length ? block.rows : [['', '', ''], ['', '', '']]
  const setRows = (r: string[][]) => onChange(block.id, { rows: r })
  const setCell = (ri: number, ci: number, val: string) => {
    const r = rows.map((row) => row.slice())
    r[ri][ci] = val
    setRows(r)
  }
  const addRow = () => setRows([...rows.map((x) => x.slice()), rows[0].map(() => '')])
  const addCol = () => setRows(rows.map((row) => [...row, '']))
  const delRow = () => rows.length > 1 && setRows(rows.slice(0, -1))
  const delCol = () => rows[0].length > 1 && setRows(rows.map((row) => row.slice(0, -1)))
  return (
    <div className="ig-table-wrap">
      <table className="ig-table"><tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={`${ri}-${ci}`}><TableCell value={cell} header={ri === 0} onCommit={(v) => setCell(ri, ci, v)} /></td>
            ))}
          </tr>
        ))}
      </tbody></table>
      <div className="ig-table-actions">
        <button onClick={addRow} title="Add row">＋ row</button>
        <button onClick={addCol} title="Add column">＋ column</button>
        <button onClick={delRow} title="Remove last row">－ row</button>
        <button onClick={delCol} title="Remove last column">－ column</button>
      </div>
    </div>
  )
}

// --- Status pill: a cute pastel dropdown, customizable options ---
function StatusBlock({ block, onChange }: { block: Block; onChange: (id: string, patch: Partial<Block>) => void }) {
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
  for (const b of blocks) {
    if (['text', 'h1', 'h2', 'callout'].includes(b.type)) { const t = strip(b.text); if (t) { captionParts.push(t); urls(t).forEach((u) => links.add(u)) } }
    else if (b.type === 'todo') { const t = strip(b.text); if (t) { todos.push({ text: t, done: !!b.checked }); urls(t).forEach((u) => links.add(u)) } }
    else if (b.type === 'youtube') { if (b.url) links.add(b.url) }
    else if (b.type === 'image' || b.type === 'file') { if (b.filePath) fileBlocks.push(b) }
    else if (b.type === 'status') { if (b.status) status = b.status }
  }
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

type BlockProps = {
  token: string
  block: Block
  autoFocus: boolean
  onChange: (id: string, patch: Partial<Block>) => void
  onEnter: (id: string, isEmpty: boolean) => void
  onBackspaceEmpty: (id: string) => void
  onSlash: (id: string, query: string | null, pos?: { x: number; y: number }) => void
  onToggle: (id: string) => void
  onIndent: (id: string, delta: number) => void
}

function BlockView({ token, block, autoFocus, onChange, onEnter, onBackspaceEmpty, onSlash, onToggle, onIndent }: BlockProps) {
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
      r.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(r)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus])

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const plain = el.innerText
    if (plain.startsWith('/')) {
      const rect = el.getBoundingClientRect()
      onSlash(block.id, plain.slice(1), { x: rect.left, y: rect.bottom + 6 })
    } else {
      onSlash(block.id, null)
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
      onEnter(block.id, !el || el.innerText.trim() === '')
      return
    }
    if (e.key === 'Backspace' && el && el.innerText === '') { e.preventDefault(); onBackspaceEmpty(block.id) }
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

  if (block.type === 'file' || block.type === 'image')
    return <div className="block"><span className="grip">⠿</span><div className="content"><FilePreview token={token} block={block} /></div></div>

  if (block.type === 'table')
    return <div className="block"><span className="grip">⠿</span><div className="content"><TableBlock block={block} onChange={onChange} /></div></div>

  if (block.type === 'status')
    return <div className="block"><span className="grip">⠿</span><div className="content"><StatusBlock block={block} onChange={onChange} /></div></div>

  if (block.type === 'callout')
    return (
      <div className="block"><span className="grip">⠿</span>
        <div className="content"><div className="callout"><span className="emoji">💡</span>{editable('Something worth remembering…')}</div></div>
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
  setTitle, updateNode, registerSubpage, openPage
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
}) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const [slash, setSlash] = useState<SlashState | null>(null)
  const [showKit, setShowKit] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFileType = useRef<BlockType>('file')
  const pal = paletteFor(page.color)

  const patchBlock = (id: string, patch: Partial<Block>) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)))

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

  const onEnter = (id: string, isEmpty: boolean) => {
    const b = blocks.find((x) => x.id === id)
    const indent = b?.indent || 0
    if (isEmpty && indent > 0) {
      // Enter on an empty nested line pulls it back out one level (Notion-style).
      patchBlock(id, { indent: indent - 1 })
      setFocusId(id)
      return
    }
    if (b?.type === 'todo') {
      if (isEmpty) {
        // Second Enter on an empty to-do ends the list → back to normal text.
        patchBlock(id, { type: 'text', checked: false, text: '' })
        setFocusId(id)
      } else {
        // Enter with content → start the next to-do at the same depth.
        addAfter(id, newBlock('todo', { indent }))
      }
      return
    }
    addAfter(id, newBlock('text', { indent }))
  }
  function onBackspaceEmpty(id: string) {
    setBlocks((bs) => {
      if (bs.length === 1) return bs
      const i = bs.findIndex((b) => b.id === id)
      if (bs[i - 1]) setFocusId(bs[i - 1].id)
      return bs.filter((b) => b.id !== id)
    })
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
      patchBlock(id, { type: 'table', rows: [['', '', ''], ['', '', '']], text: '' })
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
      <div className="ig-scrim" onClick={onClose} />
      <aside className="ig-drawer">
        <div className="doc-head">
          <div className="row">
            {canBack && <button className="ig-back" onClick={onBack}>‹ Back</button>}
            <span className="chip" style={{ background: pal.fill, color: pal.ink }}>
              {page.isNode ? (page.kind === 'central' ? '🌸 central idea' : '💭 thought bubble') : '📄 page'}
            </span>
            <button className="ig-kit-btn" onClick={() => setShowKit(true)} title="Package this page for posting">📤 Post Kit</button>
            <button className="close-x" onClick={onClose}>×</button>
          </div>
          <input
            className="doc-title"
            value={page.title}
            placeholder={page.isNode ? 'Untitled thought' : 'Untitled page'}
            onChange={(e) => setTitle(e.target.value)}
          />
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

        <div className="doc-body" style={{ ['--ig-font' as string]: fontStack(page.font), fontFamily: fontStack(page.font) } as React.CSSProperties}>
          {blocks.map((b) => (
            <div key={b.id} className="block-row" style={{ marginLeft: (b.indent || 0) * 24 }}>
              {b.type === 'subpage' ? (
                <div className="block">
                  <span className="grip">⠿</span>
                  <div className="content">
                    <button className="pagelink" onClick={() => b.pageId && openPage(b.pageId)}>
                      📄 {(b.pageId && pages[b.pageId]?.title) || 'Untitled page'} →
                    </button>
                  </div>
                </div>
              ) : b.type === 'pagelink' ? (
                <div className="block">
                  <span className="grip">⠿</span>
                  <div className="content">
                    <button className="pagelink" onClick={() => b.targetId && openPage(b.targetId)}>🫧 Open linked bubble →</button>
                  </div>
                </div>
              ) : (
                <BlockView
                  token={token}
                  block={b}
                  autoFocus={focusId === b.id}
                  onChange={patchBlock}
                  onEnter={onEnter}
                  onBackspaceEmpty={onBackspaceEmpty}
                  onSlash={onSlash}
                  onToggle={(id) => patchBlock(id, { checked: !b.checked })}
                  onIndent={onIndent}
                />
              )}
            </div>
          ))}
        </div>

        <input ref={fileInputRef} type="file" hidden onChange={onFileChosen} />
      </aside>

      {slash && (
        <SlashMenu pos={slash.pos} query={slash.query} index={slash.index} onPick={pickSlash} />
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
    const doc: GardenDoc = { version: 1, nodes, edges, docs, pages, colorIndex: colorIndexRef.current }
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
  }, [nodes, edges, docs, pages, token])

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
      </Ctx.Provider>

      <div className="ig-help">
        Double-click a bubble to open its <b>page</b>. Hover for <b>+ sub-bubble</b>. Inside a page, type <b>/</b> for to-dos, files, YouTube & more.
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
        />
      )}
    </div>
  )
}
