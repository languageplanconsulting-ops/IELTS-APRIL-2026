import { useEffect, useRef, useState } from 'react'
import type { Block, TodoTask } from './types'

// A page's to-do list = tasks added via right-click ("Add to to-do list")
// + every To-do block written on the page (including inside dropdowns/columns/tables).
export type TodoItem = { key: string; kind: 'task' | 'block'; id: string; text: string; done: boolean }
export type Progress = { done: number; total: number; pct: number }

export const plainText = (html?: string) =>
  (html || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()

function eachBlock(blocks: Block[], fn: (b: Block) => void) {
  for (const b of blocks) {
    fn(b)
    if (b.children) eachBlock(b.children, fn)
    for (const col of b.cols || []) eachBlock(col, fn)
    for (const row of b.cells || []) for (const cell of row) eachBlock(cell, fn)
  }
}

// Update one block wherever it sits in the tree.
export function patchDeep(blocks: Block[], id: string, fn: (b: Block) => Block): Block[] {
  return blocks.map((b) => {
    if (b.id === id) return fn(b)
    let next = b
    if (b.children) next = { ...next, children: patchDeep(b.children, id, fn) }
    if (b.cols) next = { ...next, cols: b.cols.map((c) => patchDeep(c, id, fn)) }
    if (b.cells) next = { ...next, cells: b.cells.map((r) => r.map((c) => patchDeep(c, id, fn))) }
    return next
  })
}

export function todosFor(blocks: Block[] | undefined, tasks: TodoTask[] | undefined): TodoItem[] {
  const byId = new Map<string, Block>()
  const fromBlocks: TodoItem[] = []
  eachBlock(blocks || [], (b) => {
    byId.set(b.id, b)
    const t = plainText(b.text)
    if (b.type === 'todo' && t) fromBlocks.push({ key: `b:${b.id}`, kind: 'block', id: b.id, text: t, done: !!b.checked })
  })
  const fromTasks: TodoItem[] = (tasks || []).map((t) => ({
    key: `t:${t.id}`, kind: 'task', id: t.id,
    text: (t.blockId && plainText(byId.get(t.blockId)?.text)) || t.text,
    done: !!t.done
  }))
  return [...fromTasks, ...fromBlocks]
}

export function progressOf(items: TodoItem[]): Progress {
  const total = items.length
  const done = items.filter((t) => t.done).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

export function cheer(p: Progress) {
  if (!p.total) return 'no to-dos yet 🌱'
  if (p.pct === 100) return 'all done — you did it! 🎉'
  if (p.pct >= 75) return 'almost there, keep going 🌷'
  if (p.pct >= 50) return 'halfway bloomed 🌼'
  if (p.pct > 0) return 'nice start, little sprout 🌱'
  return 'ready when you are ✨'
}

export function ProgressBar({ done, total, pct }: Progress) {
  return (
    <div className="td-prog" title={`${done} of ${total} done`}>
      <div className="td-prog-track"><span className={`td-prog-fill ${pct === 100 ? 'full' : ''}`} style={{ width: `${pct}%` }} /></div>
      <b>{done}/{total}</b>
    </div>
  )
}

export function TodoList({ items, onToggle, onRemove }: { items: TodoItem[]; onToggle: (t: TodoItem) => void; onRemove?: (t: TodoItem) => void }) {
  return (
    <ul className="td-list">
      {items.map((t) => (
        <li key={t.key} className={t.done ? 'done' : ''}>
          <button className={`td-check ${t.done ? 'on' : ''}`} onClick={() => onToggle(t)} aria-label={t.done ? 'Mark not done' : 'Mark done'}>
            {t.done ? '✓' : ''}
          </button>
          <span className="td-text">{t.text || 'untitled task'}</span>
          {t.kind === 'task' && onRemove && <button className="td-remove" title="Remove from list" onClick={() => onRemove(t)}>×</button>}
        </li>
      ))}
    </ul>
  )
}

// Floating to-do panel inside a page. "–" shrinks it to a little pill; tap the pill to bring it back.
const DOCK_KEY = 'ideaGarden.todoDock'
export function TodoDock({ items, onToggle, onRemove, onAdd }: {
  items: TodoItem[]
  onToggle: (t: TodoItem) => void
  onRemove: (t: TodoItem) => void
  onAdd: (text: string) => void
}) {
  const [open, setOpen] = useState<boolean>(() => {
    try { return localStorage.getItem(DOCK_KEY) !== 'min' } catch { return true }
  })
  useEffect(() => { try { localStorage.setItem(DOCK_KEY, open ? 'open' : 'min') } catch { /* ignore */ } }, [open])
  const [draft, setDraft] = useState('')
  const p = progressOf(items)

  if (!open)
    return (
      <button className="td-pill" onClick={() => setOpen(true)} title="Show to-do list">
        <span className="ring" style={{ ['--pct' as string]: p.pct } as React.CSSProperties}><span>📝</span></span>
        <b>{p.total ? `${p.done}/${p.total}` : 'to-do'}</b>
      </button>
    )

  return (
    <div className="td-dock">
      <div className="td-dock-head">
        <span>📝 To-do list</span>
        <button className="td-min" onClick={() => setOpen(false)} title="Shrink">–</button>
      </div>
      {p.total > 0 && <ProgressBar {...p} />}
      {p.total === 0
        ? <p className="td-empty">Nothing yet 🌱<br />Right-click any line → <b>Add to to-do list</b>, or type one below.</p>
        : <TodoList items={items} onToggle={onToggle} onRemove={onRemove} />}
      <form className="td-add" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { onAdd(draft.trim()); setDraft('') } }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="+ add a task" />
      </form>
    </div>
  )
}

// Cute recap card shown when right-clicking a bubble on the canvas.
export function TodoRecap({ title, colors, items, pos, onToggle, onOpen, onClose }: {
  title: string
  colors: { fill: string; border: string; ink: string }
  items: TodoItem[]
  pos: { x: number; y: number }
  onToggle: (t: TodoItem) => void
  onOpen: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(pos)
  const p = progressOf(items)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    setAt({ x: Math.max(8, Math.min(pos.x, window.innerWidth - width - 8)), y: Math.max(8, Math.min(pos.y, window.innerHeight - height - 8)) })
  }, [pos, items.length])

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose() }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('mousedown', onDown, true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onClose, { passive: true })
    return () => {
      window.removeEventListener('mousedown', onDown, true)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onClose)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="td-recap"
      style={{ left: at.x, top: at.y, ['--b-fill' as string]: colors.fill, ['--b-border' as string]: colors.border, ['--b-ink' as string]: colors.ink } as React.CSSProperties}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="td-recap-head">
        <span className="kicker">to-do recap</span>
        <span className="title">{title || 'Untitled thought'}</span>
      </div>
      <div className="td-recap-big"><b>{p.pct}%</b><span>{cheer(p)}</span></div>
      {p.total > 0 && <ProgressBar {...p} />}
      {p.total > 0
        ? <TodoList items={items} onToggle={onToggle} />
        : <p className="td-empty">Open the page and right-click a line → <b>Add to to-do list</b>.</p>}
      <button className="td-recap-open" onClick={() => { onClose(); onOpen() }}>open page →</button>
    </div>
  )
}
