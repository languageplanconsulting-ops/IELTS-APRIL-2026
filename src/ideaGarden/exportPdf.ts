import { paletteFor } from './palette'
import { signFile } from './api'
import type { Block, DiagramData } from './types'

// Builds a clean, print-ready A4 document from a page's blocks (not a
// screenshot), opens it in a new tab and triggers "Save as PDF". Text stays
// real text, blocks never split across pages, sub-pages become sections.

const GLYPHS: Record<string, string> = { dot: '•', flower: '✿', heart: '♥', star: '✦', arrow: '➛' }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Keep the user's own inline formatting (bold, highlight) but drop anything active.
const safeHtml = (h?: string) =>
  String(h || '')
    .replace(/<\s*(script|style|iframe|object|embed)[\s\S]*?<\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
const isBlankHtml = (h?: string) => !String(h || '').replace(/<br\s*\/?>|&nbsp;|<[^>]+>/gi, '').trim()

type Ctx = {
  urls: Record<string, string>
  getPageBlocks: (id: string) => Block[]
  pageTitle: (id: string) => string
  seen: Set<string>
  depth: number
}

function walkFiles(blocks: Block[], out: Set<string>, getPageBlocks: (id: string) => Block[], seen: Set<string>) {
  for (const b of blocks) {
    if ((b.type === 'image' || b.type === 'file') && b.filePath) out.add(b.filePath)
    if (b.children) walkFiles(b.children, out, getPageBlocks, seen)
    if (b.cols) for (const c of b.cols) walkFiles(c, out, getPageBlocks, seen)
    if (b.cells) for (const r of b.cells) for (const c of r) walkFiles(c, out, getPageBlocks, seen)
    if (b.type === 'subpage' && b.pageId && !seen.has(b.pageId)) { seen.add(b.pageId); walkFiles(getPageBlocks(b.pageId), out, getPageBlocks, seen) }
  }
}

// --- diagram → crisp SVG (bubbles, arrows, labels) ---
function wrapWords(text: string, max: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 5)
}
function diagramSvg(d: DiagramData) {
  if (!d.nodes.length) return ''
  const boxes = d.nodes.map((n) => {
    const lines = wrapWords(n.label || '', 22)
    const longest = Math.max(4, ...lines.map((l) => l.length))
    const round = n.shape === 'circle'
    let w = Math.min(260, Math.max(96, longest * 8 + 36))
    let h = Math.max(44, lines.length * 18 + 22)
    if (round) { const m = Math.max(w, h); w = m; h = m }
    return { n, lines, x: n.position.x, y: n.position.y, w, h }
  })
  const byId = new Map(boxes.map((b) => [b.n.id, b]))
  const minX = Math.min(...boxes.map((b) => b.x)) - 24, minY = Math.min(...boxes.map((b) => b.y)) - 24
  const maxX = Math.max(...boxes.map((b) => b.x + b.w)) + 24, maxY = Math.max(...boxes.map((b) => b.y + b.h)) + 24
  const edge = (a: typeof boxes[number], b: typeof boxes[number]) => {
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2, bx = b.x + b.w / 2, by = b.y + b.h / 2
    const clip = (cx: number, cy: number, w: number, h: number, dx: number, dy: number) => {
      const s = Math.min(dx ? Math.abs((w / 2) / dx) : Infinity, dy ? Math.abs((h / 2) / dy) : Infinity)
      return { x: cx + dx * s, y: cy + dy * s }
    }
    const p1 = clip(ax, ay, a.w, a.h, bx - ax, by - ay)
    const p2 = clip(bx, by, b.w + 10, b.h + 10, ax - bx, ay - by)
    return `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="#bba7b3" stroke-width="2" marker-end="url(#arr)"/>`
  }
  const shapeEl = (b: typeof boxes[number]) => {
    const p = paletteFor(b.n.color)
    const common = `fill="${p.fill}" stroke="${p.border}" stroke-width="1.5"`
    switch (b.n.shape) {
      case 'circle': return `<ellipse cx="${b.x + b.w / 2}" cy="${b.y + b.h / 2}" rx="${b.w / 2}" ry="${b.h / 2}" ${common}/>`
      case 'pill': return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${b.h / 2}" ${common}/>`
      case 'note': return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="3" ${common}/>`
      case 'blob': return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${Math.min(b.h / 2, 26)}" ${common}/>`
      case 'petal': return `<path d="M${b.x + 22},${b.y} H${b.x + b.w - 6} Q${b.x + b.w},${b.y} ${b.x + b.w},${b.y + 6} V${b.y + b.h - 22} Q${b.x + b.w},${b.y + b.h} ${b.x + b.w - 22},${b.y + b.h} H${b.x + 6} Q${b.x},${b.y + b.h} ${b.x},${b.y + b.h - 6} V${b.y + 22} Q${b.x},${b.y} ${b.x + 22},${b.y} Z" ${common}/>`
      default: return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="14" ${common}/>`
    }
  }
  const text = (b: typeof boxes[number]) => {
    const p = paletteFor(b.n.color)
    const top = b.y + b.h / 2 - ((b.lines.length - 1) * 18) / 2 + 5
    return b.lines.map((l, i) => `<text x="${b.x + b.w / 2}" y="${(top + i * 18).toFixed(1)}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${p.ink}">${esc(l)}</text>`).join('')
  }
  const edges = d.edges.map((e) => { const a = byId.get(e.source), b = byId.get(e.target); return a && b ? edge(a, b) : '' }).join('')
  return `<svg class="diagram" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#bba7b3"/></marker></defs>
    ${edges}${boxes.map((b) => shapeEl(b) + text(b)).join('')}
  </svg>`
}

function render(blocks: Block[], ctx: Ctx): string {
  let out = ''
  for (const b of blocks) {
    const pad = b.indent ? ` style="margin-left:${b.indent * 22}px"` : ''
    switch (b.type) {
      case 'h1': if (!isBlankHtml(b.text)) out += `<h2${pad}>${safeHtml(b.text)}</h2>`; break
      case 'h2': if (!isBlankHtml(b.text)) out += `<h3${pad}>${safeHtml(b.text)}</h3>`; break
      case 'bullet': out += `<div class="li"${pad}><span class="mk">${GLYPHS[b.bullet || 'dot'] || '•'}</span><div>${safeHtml(b.text)}</div></div>`; break
      case 'todo': out += `<div class="li todo ${b.checked ? 'done' : ''}"${pad}><span class="mk">${b.checked ? '☑' : '☐'}</span><div>${safeHtml(b.text)}</div></div>`; break
      case 'callout': out += `<div class="callout"${pad}><span>💡</span><div>${safeHtml(b.text)}</div></div>`; break
      case 'divider': out += '<hr/>'; break
      case 'status': if (b.status) out += `<div class="status"${pad}>● ${esc(b.status)}</div>`; break
      case 'youtube': if (b.url) out += `<div class="link"${pad}>▶ Video: <a href="${esc(b.url)}">${esc(b.url)}</a></div>`; break
      case 'image': case 'file': {
        const url = b.filePath ? ctx.urls[b.filePath] : ''
        const isImg = b.type === 'image' || (b.fileType || '').startsWith('image/')
        if (isImg && url) out += `<figure${pad}><img src="${esc(url)}" style="${b.width ? `width:${b.width}px;` : ''}max-width:100%"/></figure>`
        else out += `<div class="link"${pad}>📎 ${url ? `<a href="${esc(url)}">${esc(b.fileName || 'attachment')}</a>` : esc(b.fileName || 'attachment')}</div>`
        break
      }
      case 'toggle':
        out += `<div class="toggle"${pad}><div class="tt">▾ ${safeHtml(b.text) || 'Dropdown'}</div><div class="tb">${render(b.children || [], ctx)}</div></div>`
        break
      case 'columns': {
        const cols = b.cols || []
        out += `<div class="cols" style="grid-template-columns:repeat(${cols.length || 1},minmax(0,1fr))">${cols.map((c) => `<div class="col">${render(c, ctx)}</div>`).join('')}</div>`
        break
      }
      case 'table': {
        const cells = b.cells || (b.rows || []).map((r) => r.map((t) => [{ id: '', type: 'text' as const, text: esc(t) }]))
        if (!cells.length) break
        const widths = b.colWidths && b.colWidths.length ? b.colWidths : null
        const total = widths ? widths.reduce((a, w) => a + w, 0) : 0
        out += `<table>${widths ? `<colgroup>${widths.map((w) => `<col style="width:${((w / total) * 100).toFixed(2)}%"/>`).join('')}</colgroup>` : ''}<tbody>${cells.map((row, ri) => `<tr>${row.map((cell) => `<${ri === 0 ? 'th' : 'td'}>${render(cell, ctx)}</${ri === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</tbody></table>`
        break
      }
      case 'diagram': if (b.diagram) out += `<figure class="dg">${diagramSvg(b.diagram)}</figure>`; break
      case 'subpage': {
        const id = b.pageId
        if (!id) break
        const title = ctx.pageTitle(id)
        if (ctx.seen.has(id) || ctx.depth >= 3) { out += `<div class="link">📄 ${esc(title)}</div>`; break }
        ctx.seen.add(id)
        ctx.depth += 1
        out += `<section class="sub"><h3 class="subh">📄 ${esc(title)}</h3>${render(ctx.getPageBlocks(id), ctx)}</section>`
        ctx.depth -= 1
        break
      }
      case 'pagelink': break
      default: if (!isBlankHtml(b.text)) out += `<p${pad}>${safeHtml(b.text)}</p>`
    }
  }
  return out
}

export async function exportPagePdf(opts: {
  title: string
  blocks: Block[]
  fontFamily: string
  token: string
  getPageBlocks: (id: string) => Block[]
  pageTitle: (id: string) => string
}) {
  // Open the tab straight away (inside the click) so pop-up blockers allow it.
  const w = window.open('', '_blank')
  if (!w) { alert('Please allow pop-ups for this site to export the PDF.'); return }
  w.document.write('<p style="font-family:system-ui;padding:40px;color:#8a8178">Preparing your PDF…</p>')

  const files = new Set<string>()
  walkFiles(opts.blocks, files, opts.getPageBlocks, new Set())
  const urls: Record<string, string> = {}
  await Promise.all([...files].map(async (p) => { try { urls[p] = await signFile(opts.token, p) } catch { /* skip */ } }))

  const body = render(opts.blocks, { urls, getPageBlocks: opts.getPageBlocks, pageTitle: opts.pageTitle, seen: new Set(), depth: 0 })
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(opts.title || 'Idea Garden page')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Quicksand:wght@400..700&family=Caveat:wght@400..700&family=Patrick+Hand&family=Gochi+Hand&family=Shantell+Sans:wght@400..700&family=Lora:wght@400..700&family=Merriweather:wght@400;700&family=Roboto+Slab:wght@400..700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 16mm 15mm 18mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; background: #fff; }
  body { font-family: ${opts.fontFamily}; font-size: 11pt; line-height: 1.55; color: #2f2a33; }
  main { max-width: 180mm; margin: 0 auto; padding: 0; }
  header.doc { border-bottom: 2px solid #ffd6e8; margin-bottom: 14px; padding-bottom: 8px; }
  header.doc h1 { font-family: 'Baloo 2', ${opts.fontFamily}; font-size: 22pt; line-height: 1.15; margin: 0; }
  header.doc .meta { color: #9a8f86; font-size: 9pt; margin-top: 3px; }
  h2 { font-size: 15pt; margin: 16px 0 6px; line-height: 1.25; break-after: avoid; }
  h3 { font-size: 12.5pt; margin: 12px 0 4px; line-height: 1.3; break-after: avoid; }
  p { margin: 0 0 7px; }
  p, .li, .callout, figure, table, .toggle, .status, .link, .cols, svg { break-inside: avoid; }
  .li { display: flex; gap: 8px; margin: 0 0 4px; }
  .li .mk { color: #e85f95; flex: none; width: 14px; text-align: center; }
  .li.todo .mk { color: #9a8f86; }
  .li.todo.done > div { text-decoration: line-through; color: #9a8f86; }
  .callout { display: flex; gap: 10px; background: #fdf6e3; border: 1px solid #f2e4b8; border-radius: 10px; padding: 9px 12px; margin: 6px 0 10px; }
  hr { border: none; border-top: 1px solid #e7e3dc; margin: 12px 0; }
  .status { display: inline-block; background: #f3efe9; border-radius: 999px; padding: 2px 10px; font-size: 9.5pt; font-weight: 700; margin: 2px 0 8px; }
  .link { font-size: 10pt; margin: 3px 0 7px; word-break: break-all; }
  a { color: #c2447a; }
  figure { margin: 8px 0 12px; }
  figure img { display: block; border-radius: 8px; height: auto; }
  figure.dg { border: 1px solid #eee6de; border-radius: 10px; padding: 8px; }
  svg.diagram { width: 100%; height: auto; max-height: 240mm; display: block; font-family: ${opts.fontFamily}; }
  .toggle { border-left: 3px solid #ffd6e8; padding: 2px 0 2px 12px; margin: 6px 0 10px; }
  .toggle .tt { font-weight: 700; margin-bottom: 4px; }
  .cols { display: grid; gap: 16px; margin: 6px 0 10px; }
  .col { min-width: 0; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 8px 0 12px; font-size: 10pt; }
  th, td { border: 1px solid #e3ddd5; padding: 6px 8px; vertical-align: top; text-align: left; word-wrap: break-word; }
  th { background: #faf6f1; font-weight: 700; }
  th p, td p, th .li, td .li { margin-bottom: 2px; }
  section.sub { margin-top: 16px; padding-top: 8px; border-top: 1px dashed #e7e3dc; }
  .bar { position: sticky; top: 0; display: flex; gap: 10px; align-items: center; justify-content: center; padding: 12px; background: #fff6fb; border-bottom: 1px solid #ffe1ef; font-family: system-ui; }
  .bar button { background: #ff8fb8; color: #fff; border: none; border-radius: 10px; padding: 9px 18px; font-weight: 700; font-size: 14px; cursor: pointer; }
  .bar span { color: #8a8178; font-size: 13px; }
  @media screen { main { padding: 24px 0 60px; } body { background: #f6f5f2; } main { background: #fff; padding: 18mm 15mm; margin: 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,.08); width: 210mm; max-width: 100%; min-height: 297mm; } }
  @media print { .bar { display: none; } }
</style></head><body>
<div class="bar"><button onclick="print()">⤓ Save as PDF</button><span>In the print window choose “Save as PDF” · A4</span></div>
<main><header class="doc"><h1>${esc(opts.title || 'Untitled')}</h1><div class="meta">${esc(date)}</div></header>${body || '<p style="color:#9a8f86">This page is empty.</p>'}</main>
<script>
  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), ...Array.from(document.images).map(function (i) { return i.complete ? 0 : new Promise(function (r) { i.onload = i.onerror = r }) })])
    .then(function () { setTimeout(function () { window.print() }, 350) })
</script>
</body></html>`
  w.document.open()
  w.document.write(html)
  w.document.close()
}
