import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useInternalNode,
  useReactFlow,
  useStoreApi,
  ConnectionMode,
  MarkerType
} from '@xyflow/react'
import type { NodeProps, EdgeProps, Connection, NodeChange, EdgeChange, InternalNode, Node, Edge } from '@xyflow/react'
import { PALETTE, paletteFor } from './palette'
import type { Block, DiagramData } from './types'

// Shapes a diagram bubble can take.
export const DIAGRAM_SHAPES: { key: string; label: string }[] = [
  { key: 'rounded', label: 'Rounded' },
  { key: 'pill', label: 'Pill' },
  { key: 'circle', label: 'Circle' },
  { key: 'blob', label: 'Blob' },
  { key: 'note', label: 'Sticky note' },
  { key: 'petal', label: 'Petal' }
]

type DgData = { label: string; shape?: string; color?: string }
const DgCtx = createContext<{ rename: (id: string, label: string) => void } | null>(null)

// --- a bubble on the board: double-click to edit its text ---
function DgNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as DgData
  const pal = paletteFor(d.color)
  const ctx = useContext(DgCtx)
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const startEdit = () => {
    setEditing(true)
    requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      el.focus()
      const r = document.createRange(); r.selectNodeContents(el)
      const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r)
    })
  }
  return (
    <div
      className={`dg-bub s-${d.shape || 'rounded'} ${selected ? 'sel' : ''}`}
      style={{ background: pal.fill, borderColor: pal.border, color: pal.ink }}
      onDoubleClick={(e) => { e.stopPropagation(); startEdit() }}
    >
      <Handle className="dg-h" type="source" position={Position.Top} id="t" />
      <Handle className="dg-h" type="source" position={Position.Right} id="r" />
      <Handle className="dg-h" type="source" position={Position.Bottom} id="b" />
      <Handle className="dg-h" type="source" position={Position.Left} id="l" />
      <div
        ref={ref}
        className={`dg-label ${editing ? 'nodrag editing' : ''}`}
        contentEditable={editing}
        suppressContentEditableWarning
        onBlur={(e) => { ctx?.rename(id, e.currentTarget.innerText.trim()); setEditing(false) }}
        onKeyDown={(e) => {
          e.stopPropagation()
          if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Escape') { e.preventDefault(); (e.currentTarget as HTMLElement).blur() }
        }}
      >
        {d.label}
      </div>
    </div>
  )
}

// --- arrows that attach to the nearest side of each bubble ---
function nodeIntersection(a: InternalNode, b: InternalNode) {
  const w = (a.measured.width ?? 0) / 2, h = (a.measured.height ?? 0) / 2
  const ap = a.internals.positionAbsolute, bp = b.internals.positionAbsolute
  const x2 = ap.x + w, y2 = ap.y + h
  const x1 = bp.x + (b.measured.width ?? 0) / 2, y1 = bp.y + (b.measured.height ?? 0) / 2
  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)
  const k = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1)
  return { x: w * (k * xx1 + k * yy1) + x2, y: h * (-k * xx1 + k * yy1) + y2 }
}
function sideOf(n: InternalNode, p: { x: number; y: number }) {
  const nx = n.internals.positionAbsolute.x, ny = n.internals.positionAbsolute.y
  if (p.x <= nx + 1) return Position.Left
  if (p.x >= nx + (n.measured.width ?? 0) - 1) return Position.Right
  if (p.y <= ny + 1) return Position.Top
  return Position.Bottom
}
function DgEdge({ id, source, target, markerEnd, selected }: EdgeProps) {
  const s = useInternalNode(source), t = useInternalNode(target)
  if (!s || !t) return null
  const sp = nodeIntersection(s, t), tp = nodeIntersection(t, s)
  const [path] = getBezierPath({ sourceX: sp.x, sourceY: sp.y, sourcePosition: sideOf(s, sp), targetX: tp.x, targetY: tp.y, targetPosition: sideOf(t, tp), curvature: 0.25 })
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ stroke: selected ? '#e85f95' : '#c9b6c1', strokeWidth: selected ? 2.6 : 2 }} />
}

const nodeTypes = { dg: DgNode }
const edgeTypes = { dgedge: DgEdge }
const ARROW = { type: MarkerType.ArrowClosed, color: '#c9b6c1', width: 16, height: 16 }
const uid = () => crypto.randomUUID()

const toNodes = (d: DiagramData | undefined): Node[] =>
  (d?.nodes || []).map((n) => ({ id: n.id, type: 'dg', position: n.position, data: { label: n.label, shape: n.shape, color: n.color } }))
const toEdges = (d: DiagramData | undefined): Edge[] =>
  (d?.edges || []).map((e) => ({ id: e.id, source: e.source, target: e.target, type: 'dgedge', markerEnd: ARROW }))

function Board({ block, onChange }: { block: Block; onChange: (id: string, patch: Partial<Block>) => void }) {
  const [nodes, setNodes] = useState<Node[]>(() => toNodes(block.diagram))
  const [edges, setEdges] = useState<Edge[]>(() => toEdges(block.diagram))
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(block.diagram?.orientation || 'portrait')
  const [shape, setShape] = useState('rounded')
  const [color, setColor] = useState('lavender')
  const wrapRef = useRef<HTMLDivElement>(null)
  const rf = useReactFlow()
  // Safety net: measure bubbles right after they appear (and whenever the count
  // changes) so the board never waits on the browser's resize watcher.
  const storeApi = useStoreApi()
  useEffect(() => {
    const measure = () => {
      const st = storeApi.getState()
      const updates = new Map<string, { id: string; nodeElement: HTMLDivElement; force: boolean }>()
      st.domNode?.querySelectorAll<HTMLDivElement>('.react-flow__node').forEach((el) => {
        const id = el.dataset.id
        if (id) updates.set(id, { id, nodeElement: el, force: true })
      })
      if (updates.size) st.updateNodeInternals(updates)
    }
    const t1 = setTimeout(measure, 40)
    const t2 = setTimeout(measure, 350)
    return () => { clearTimeout(t1); clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length])

  // Save to the page (debounced), but never mid-drag.
  const lastSaved = useRef('')
  useEffect(() => {
    if (nodes.some((n) => n.dragging)) return
    const data: DiagramData = {
      orientation,
      nodes: nodes.map((n) => {
        const d = n.data as unknown as DgData
        return { id: n.id, position: { x: Math.round(n.position.x), y: Math.round(n.position.y) }, label: d.label, shape: d.shape, color: d.color }
      }),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target }))
    }
    const json = JSON.stringify(data)
    if (json === lastSaved.current) return
    const t = setTimeout(() => { lastSaved.current = json; onChange(block.id, { diagram: data }) }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, orientation])
  useEffect(() => { lastSaved.current = JSON.stringify(block.diagram || '') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const ctx = useMemo(() => ({
    rename: (id: string, label: string) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: label || 'Bubble' } } : n)))
  }), [])

  const selectedIds = nodes.filter((n) => n.selected).map((n) => n.id)
  const restyle = (patch: Partial<DgData>) =>
    setNodes((ns) => ns.map((n) => (n.selected ? { ...n, data: { ...n.data, ...patch } } : n)))
  const addBubble = () => {
    const box = wrapRef.current?.getBoundingClientRect()
    const center = box ? rf.screenToFlowPosition({ x: box.left + box.width / 2, y: box.top + box.height / 2 }) : { x: 0, y: 0 }
    const id = uid()
    setNodes((ns) => [
      ...ns.map((n) => ({ ...n, selected: false })),
      { id, type: 'dg', position: { x: center.x - 60 + (Math.random() * 40 - 20), y: center.y - 20 + (Math.random() * 40 - 20) }, data: { label: 'New bubble', shape, color }, selected: true }
    ])
  }
  const removeSelected = () => {
    const gone = new Set(selectedIds)
    setNodes((ns) => ns.filter((n) => !gone.has(n.id)))
    setEdges((es) => es.filter((e) => !e.selected && !gone.has(e.source) && !gone.has(e.target)))
  }

  return (
    <DgCtx.Provider value={ctx}>
      <div className={`dg-wrap ${orientation}`} ref={wrapRef}>
        <div className="dg-bar nodrag">
          <button onClick={addBubble} title="Add a bubble">＋ Bubble</button>
          <span className="dg-sep" />
          {PALETTE.map((p) => (
            <button
              key={p.key}
              className={`dg-color ${color === p.key ? 'on' : ''}`}
              style={{ background: p.fill, borderColor: p.border }}
              title={`Color: ${p.key}`}
              onClick={() => { setColor(p.key); restyle({ color: p.key }) }}
            />
          ))}
          <span className="dg-sep" />
          {DIAGRAM_SHAPES.map((s) => (
            <button
              key={s.key}
              className={`dg-shape ${shape === s.key ? 'on' : ''}`}
              title={`Shape: ${s.label}`}
              onClick={() => { setShape(s.key); restyle({ shape: s.key }) }}
            ><span className={`dg-shape-sw s-${s.key}`} /></button>
          ))}
          <span className="dg-sep" />
          <button onClick={removeSelected} disabled={!selectedIds.length && !edges.some((e) => e.selected)} title="Delete selected">🗑</button>
          <button onClick={() => rf.fitView({ padding: 0.2, duration: 400 })} title="Fit everything in view">⤢ Fit</button>
          <button onClick={() => setOrientation((o) => (o === 'portrait' ? 'landscape' : 'portrait'))} title="Switch A4 portrait / landscape">
            {orientation === 'portrait' ? '▯ A4' : '▭ A4'}
          </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={(ch: NodeChange[]) => setNodes((ns) => applyNodeChanges(ch, ns))}
          onEdgesChange={(ch: EdgeChange[]) => setEdges((es) => applyEdgeChanges(ch, es))}
          onConnect={(c: Connection) => setEdges((es) => addEdge({ ...c, id: uid(), type: 'dgedge', markerEnd: ARROW }, es))}
          connectionMode={ConnectionMode.Loose}
          connectionLineStyle={{ stroke: '#c9b6c1', strokeWidth: 2 }}
          deleteKeyCode={['Backspace', 'Delete']}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          zoomOnPinch
          zoomOnDoubleClick={false}
          minZoom={0.25}
          maxZoom={2.5}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.3} color="#e3dcd4" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
        <div className="dg-hint">double-click a bubble to edit · drag from a dot to draw an arrow · pinch or ± to zoom</div>
      </div>
    </DgCtx.Provider>
  )
}

export function DiagramBlock(props: { block: Block; onChange: (id: string, patch: Partial<Block>) => void }) {
  return (
    <ReactFlowProvider>
      <Board {...props} />
    </ReactFlowProvider>
  )
}

// Build a diagram from outline lines: each line → a bubble; an indented line
// hangs off the nearest line above it with a smaller indent.
export function diagramFromLines(lines: { text: string; indent: number }[]): DiagramData {
  const colors = ['bubblegum', 'lavender', 'mint', 'lemon', 'sky', 'peach']
  const shapes = ['pill', 'rounded', 'note', 'rounded', 'blob', 'petal']
  const nodes: DiagramData['nodes'] = []
  const edges: DiagramData['edges'] = []
  const stack: { id: string; indent: number }[] = []
  let row = 0
  lines.forEach((l) => {
    const depth = Math.min(5, Math.max(0, l.indent))
    while (stack.length && stack[stack.length - 1].indent >= depth) stack.pop()
    const parent = stack[stack.length - 1]
    const id = uid()
    const y = row * 84
    nodes.push({ id, position: { x: depth * 250, y }, label: l.text.slice(0, 140), shape: shapes[depth % shapes.length], color: colors[depth % colors.length] })
    if (parent) edges.push({ id: uid(), source: parent.id, target: id })
    stack.push({ id, indent: depth })
    row += 1
  })
  return { orientation: 'landscape', nodes, edges }
}
