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
  addEdge
} from '@xyflow/react'
import type { NodeProps, EdgeProps, Connection, NodeChange, EdgeChange } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './IdeaGarden.css'
import { paletteFor, nextColor } from './palette'
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

  const style = {
    ['--b-fill' as string]: pal.fill,
    ['--b-border' as string]: pal.border,
    ['--b-ink' as string]: pal.ink,
    ['--b-glow' as string]: pal.glow
  } as React.CSSProperties

  return (
    <div className={`bubble ${central ? 'central' : ''} ${selected ? 'selected' : ''}`} style={style}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

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

      <button className="add-child nodrag" onClick={() => addChild(id)}>+ sub-bubble</button>
    </div>
  )
}

function SquiggleEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.4 })
  return (
    <BaseEdge
      id={id}
      path={path}
      style={{ stroke: '#ffb3d4', strokeWidth: 3.5, strokeLinecap: 'round', strokeDasharray: '1 10' }}
    />
  )
}

const nodeTypes = { bubble: BubbleNode }
const edgeTypes = { squiggle: SquiggleEdge }

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
  { key: 'page', group: 'Connect', ico: '🫧', label: 'New page', hint: 'Spawn a sub-bubble' },
  { key: 'youtube', group: 'Embed', ico: '▶️', label: 'YouTube', hint: 'Paste a video link' },
  { key: 'file', group: 'Embed', ico: '📎', label: 'PDF / file', hint: 'Upload from device' },
  { key: 'image', group: 'Embed', ico: '🖼️', label: 'Image', hint: 'Upload a picture' }
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

type BlockProps = {
  token: string
  block: Block
  autoFocus: boolean
  onChange: (id: string, patch: Partial<Block>) => void
  onEnter: (id: string) => void
  onBackspaceEmpty: (id: string) => void
  onSlash: (id: string, query: string | null, pos?: { x: number; y: number }) => void
  onToggle: (id: string) => void
}

function BlockView({ token, block, autoFocus, onChange, onEnter, onBackspaceEmpty, onSlash, onToggle }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && isTextual(block.type)) ref.current.innerText = block.text || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.type])

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
    const text = e.currentTarget.innerText
    if (text.startsWith('/')) {
      const rect = e.currentTarget.getBoundingClientRect()
      onSlash(block.id, text.slice(1), { x: rect.left, y: rect.bottom + 6 })
    } else {
      onSlash(block.id, null)
      onChange(block.id, { text })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = ref.current
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter(block.id) }
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

function Editor({
  token, node, blocks, setBlocks, onClose, updateNodeData, addChild, openNode
}: {
  token: string
  node: BubbleNodeModel
  blocks: Block[]
  setBlocks: (updater: (bs: Block[]) => Block[]) => void
  onClose: () => void
  updateNodeData: (id: string, patch: Partial<BubbleData>) => void
  addChild: (parentId: string) => string
  openNode: (id: string) => void
}) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const [slash, setSlash] = useState<SlashState | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFileType = useRef<BlockType>('file')
  const pal = paletteFor(node.data.color)

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

  const onEnter = (id: string) => addAfter(id, newBlock('text'))
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
      const childId = addChild(node.id)
      patchBlock(id, { type: 'pagelink', targetId: childId, text: '' })
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
            <span className="chip" style={{ background: pal.fill, color: pal.ink }}>
              {node.data.kind === 'central' ? '🌸 central idea' : '💭 thought bubble'}
            </span>
            <button className="close-x" onClick={onClose}>×</button>
          </div>
          <input
            className="doc-title"
            value={node.data.label}
            placeholder="Untitled thought"
            onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
          />
          <div className="doc-dates">
            🗓️ from
            <input type="date" value={node.data.start || ''} onChange={(e) => updateNodeData(node.id, { start: e.target.value })} />
            to
            <input type="date" value={node.data.end || ''} onChange={(e) => updateNodeData(node.id, { end: e.target.value })} />
          </div>
        </div>

        <div className="doc-body">
          {blocks.map((b) =>
            b.type === 'pagelink' ? (
              <div className="block" key={b.id}>
                <span className="grip">⠿</span>
                <div className="content">
                  <button className="pagelink" onClick={() => b.targetId && openNode(b.targetId)}>🫧 Open linked bubble →</button>
                </div>
              </div>
            ) : (
              <BlockView
                key={b.id}
                token={token}
                block={b}
                autoFocus={focusId === b.id}
                onChange={patchBlock}
                onEnter={onEnter}
                onBackspaceEmpty={onBackspaceEmpty}
                onSlash={onSlash}
                onToggle={(id) => patchBlock(id, { checked: !b.checked })}
              />
            )
          )}
        </div>

        <input ref={fileInputRef} type="file" hidden onChange={onFileChosen} />
      </aside>

      {slash && (
        <SlashMenu pos={slash.pos} query={slash.query} index={slash.index} onPick={pickSlash} />
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

export default function IdeaGarden({ accessToken }: { accessToken?: string }) {
  const token = accessToken || ''
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes] = useState<BubbleNodeModel[]>([])
  const [edges, setEdges] = useState<EdgeModel[]>([])
  const [docs, setDocs] = useState<Record<string, Block[]>>({})
  const colorIndexRef = useRef(1)
  const [openId, setOpenId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const hydratedRef = useRef(false)

  // --- initial load ---
  useEffect(() => {
    let ok = true
    async function boot() {
      let doc: GardenDoc | null = null
      try {
        if (token) doc = await loadGarden(token)
      } catch {
        doc = null
      }
      if (!doc) {
        try { doc = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null') } catch { doc = null }
      }
      if (!doc || !Array.isArray(doc.nodes) || doc.nodes.length === 0) doc = seedDoc()
      if (!ok) return
      setNodes(doc.nodes)
      setEdges(doc.edges || [])
      setDocs(doc.docs || {})
      colorIndexRef.current = doc.colorIndex || 1
      setLoading(false)
      hydratedRef.current = true
    }
    boot()
    return () => { ok = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // --- debounced persistence ---
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!hydratedRef.current) return
    const doc: GardenDoc = { version: 1, nodes, edges, docs, colorIndex: colorIndexRef.current }
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(doc)) } catch { /* ignore */ }
    if (!token) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveState('saving')
    saveTimer.current = setTimeout(async () => {
      try { await saveGarden(token, doc); setSaveState('saved') } catch { setSaveState('idle') }
    }, 800)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [nodes, edges, docs, token])

  // --- React Flow plumbing ---
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns as never) as unknown as BubbleNodeModel[])
  }, [])
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es as never) as unknown as EdgeModel[])
  }, [])
  const onConnect = useCallback((c: Connection) => {
    setEdges((es) => addEdge({ ...c, type: 'squiggle' }, es as never) as unknown as EdgeModel[])
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
    openNode: (id) => setOpenId(id)
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

  const setBlocksFor = (nodeId: string) => (updater: (bs: Block[]) => Block[]) =>
    setDocs((d) => ({ ...d, [nodeId]: updater(d[nodeId] && d[nodeId].length ? d[nodeId] : [newBlock()]) }))

  const openNodeModel = openId ? nodes.find((n) => n.id === openId) || null : null
  const miniColor = useMemo(() => (n: { data?: { color?: string } }) => paletteFor(n.data?.color).border, [])

  return (
    <div className="ideaGarden">
      <div className="ig-topbar">
        <span className="ig-brand">🌷 Idea Garden</span>
        <span className="ig-hint">scroll to zoom · double-click a bubble</span>
        <button className="ig-pill primary" onClick={addFloating}>+ new bubble</button>
        <span className={`ig-save ${saveState === 'saving' ? 'saving' : ''}`}>
          {saveState === 'saving' ? 'saving…' : saveState === 'saved' ? 'saved ✓' : token ? '' : 'local only'}
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
          onNodeDoubleClick={(_, n) => setOpenId(n.id)}
          zoomOnDoubleClick={false}
          fitView
          fitViewOptions={{ padding: 0.6, maxZoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={26} size={2.4} color="#ffcfe6" />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable nodeColor={miniColor as never} maskColor="rgba(255,214,234,0.35)" style={{ borderRadius: 14, border: '2px solid #ffe1ef' }} />
        </ReactFlow>
      </Ctx.Provider>

      <div className="ig-help">
        Double-click a bubble to open its <b>page</b>. Hover for <b>+ sub-bubble</b>. Inside a page, type <b>/</b> for to-dos, files, YouTube & more.
      </div>

      {openNodeModel && (
        <Editor
          token={token}
          node={openNodeModel}
          blocks={docs[openNodeModel.id] && docs[openNodeModel.id].length ? docs[openNodeModel.id] : [newBlock()]}
          setBlocks={setBlocksFor(openNodeModel.id)}
          onClose={() => setOpenId(null)}
          updateNodeData={ctx.updateNodeData}
          addChild={ctx.addChild}
          openNode={(id) => setOpenId(id)}
        />
      )}
    </div>
  )
}
