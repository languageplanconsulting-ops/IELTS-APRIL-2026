// Little spreadsheet brain for tables: a cell that starts with "=" is a sum.
// Columns are letters (A, B, C…), rows are numbers starting at 1, so the very
// first cell is A1 — the same as Excel or Google Sheets.

export type Grid = string[][] // plain text of every cell, [row][col]

const COL_RE = /^[A-Z]+$/

export const colLetter = (i: number) => {
  let n = i, out = ''
  do { out = String.fromCharCode(65 + (n % 26)) + out; n = Math.floor(n / 26) - 1 } while (n >= 0)
  return out
}
const colIndex = (letters: string) =>
  letters.toUpperCase().split('').reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0) - 1

// "1,200", "฿450", "80%", "  12 " → numbers. Anything else → not a number.
export const cellNumber = (raw: string): number | null => {
  const t = String(raw || '').replace(/[\s,]/g, '').replace(/[^0-9.+%-]/g, '')
  if (!t || t === '-' || t === '+') return null
  const pct = t.endsWith('%')
  const n = Number(pct ? t.slice(0, -1) : t)
  return Number.isFinite(n) ? n : null
}

export const isFormula = (text: string) => String(text || '').trim().startsWith('=')

class Parser {
  private s: string
  private i = 0
  private grid: Grid
  constructor(src: string, grid: Grid) { this.s = src; this.grid = grid }

  private ws() { while (this.i < this.s.length && /\s/.test(this.s[this.i])) this.i += 1 }
  private eat(ch: string) { this.ws(); if (this.s[this.i] === ch) { this.i += 1; return true } return false }
  private peek() { this.ws(); return this.s[this.i] }

  parse(): number {
    const v = this.expr()
    this.ws()
    if (this.i < this.s.length) throw new Error(`Don't understand "${this.s.slice(this.i)}"`)
    return v
  }

  private expr(): number {
    let v = this.term()
    for (;;) {
      if (this.eat('+')) v += this.term()
      else if (this.eat('-')) v -= this.term()
      else return v
    }
  }
  private term(): number {
    let v = this.factor()
    for (;;) {
      if (this.eat('*')) v *= this.factor()
      else if (this.eat('/')) {
        const d = this.factor()
        if (!d) throw new Error('Dividing by zero')
        v /= d
      } else return v
    }
  }
  private factor(): number {
    if (this.eat('-')) return -this.factor()
    if (this.eat('+')) return this.factor()
    return this.primary()
  }

  private primary(): number {
    this.ws()
    if (this.eat('(')) { const v = this.expr(); if (!this.eat(')')) throw new Error('Missing )'); return v }
    const rest = this.s.slice(this.i)

    // FUNC( … )
    const fn = rest.match(/^([A-Za-z]+)\s*\(/)
    if (fn) {
      const name = fn[1].toUpperCase()
      this.i += fn[0].length
      const args = this.args()
      if (!this.eat(')')) throw new Error(`Missing ) after ${name}`)
      return this.callFn(name, args)
    }

    // A1  (a single cell)
    const ref = rest.match(/^([A-Za-z]+)([0-9]+)/)
    if (ref && COL_RE.test(ref[1].toUpperCase())) {
      this.i += ref[0].length
      return cellNumber(this.cellAt(ref[1], ref[2])) ?? 0
    }

    // a plain number, with % meaning "out of a hundred"
    const num = rest.match(/^[0-9]*\.?[0-9]+%?/)
    if (num) {
      this.i += num[0].length
      return num[0].endsWith('%') ? Number(num[0].slice(0, -1)) / 100 : Number(num[0])
    }
    throw new Error(`Don't understand "${rest.slice(0, 12)}"`)
  }

  // Arguments are numbers, ranges (A1:A9) or quoted words ("Done").
  private args(): Array<number[] | string> {
    const out: Array<number[] | string> = []
    this.ws()
    if (this.peek() === ')') return out
    for (;;) {
      this.ws()
      const rest = this.s.slice(this.i)
      const quoted = rest.match(/^"([^"]*)"/) || rest.match(/^'([^']*)'/)
      const range = rest.match(/^([A-Za-z]+)([0-9]+)\s*:\s*([A-Za-z]+)([0-9]+)/)
      if (quoted) { this.i += quoted[0].length; out.push(quoted[1]) }
      else if (range) { this.i += range[0].length; out.push(this.rangeValues(range[1], range[2], range[3], range[4])) }
      else out.push([this.expr()])
      if (!this.eat(',')) return out
    }
  }

  private cellAt(colL: string, rowN: string) {
    const r = Number(rowN) - 1
    const c = colIndex(colL)
    return this.grid[r]?.[c] ?? ''
  }
  // A range keeps the raw text too, so COUNTIF can match words like "Done".
  private rangeRaw(c1: string, r1: string, c2: string, r2: string): string[] {
    const rA = Math.min(Number(r1), Number(r2)) - 1
    const rB = Math.max(Number(r1), Number(r2)) - 1
    const cA = Math.min(colIndex(c1), colIndex(c2))
    const cB = Math.max(colIndex(c1), colIndex(c2))
    const out: string[] = []
    for (let r = rA; r <= rB; r += 1) for (let c = cA; c <= cB; c += 1) out.push(this.grid[r]?.[c] ?? '')
    return out
  }
  private rangeValues(c1: string, r1: string, c2: string, r2: string): number[] {
    const raw = this.rangeRaw(c1, r1, c2, r2)
    const nums = raw.map(cellNumber).filter((n): n is number => n !== null)
    // Carry the raw cells along for COUNTA / COUNTIF.
    ;(nums as number[] & { raw?: string[] }).raw = raw
    return nums
  }

  private callFn(name: string, args: Array<number[] | string>): number {
    const nums = args.flatMap((a) => (typeof a === 'string' ? [] : a))
    const raws = args.flatMap((a) => (typeof a === 'string' ? [] : ((a as number[] & { raw?: string[] }).raw || a.map(String))))
    const words = args.filter((a): a is string => typeof a === 'string')
    switch (name) {
      case 'SUM': return nums.reduce((a, b) => a + b, 0)
      case 'AVG':
      case 'AVERAGE': return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
      case 'MIN': return nums.length ? Math.min(...nums) : 0
      case 'MAX': return nums.length ? Math.max(...nums) : 0
      case 'COUNT': return nums.length
      case 'COUNTA': return raws.filter((t) => String(t).trim() !== '').length
      case 'COUNTIF': {
        const want = (words[0] ?? '').trim().toLowerCase()
        return raws.filter((t) => String(t).trim().toLowerCase() === want).length
      }
      case 'PRODUCT': return nums.reduce((a, b) => a * b, 1)
      case 'ROUND': {
        const places = Math.round(nums[1] ?? 0)
        const f = 10 ** places
        return Math.round((nums[0] ?? 0) * f) / f
      }
      case 'ABS': return Math.abs(nums[0] ?? 0)
      case 'PERCENT': {
        const [part, whole] = nums
        return whole ? (part / whole) * 100 : 0
      }
      default: throw new Error(`No function called ${name}`)
    }
  }
}

const prettyNumber = (n: number) => {
  if (!Number.isFinite(n)) return '⚠︎'
  const rounded = Math.round(n * 1e6) / 1e6
  return Number.isInteger(rounded) ? String(rounded) : String(Number(rounded.toFixed(4)))
}

// Returns what the cell should show, plus an error message when the sum
// doesn't make sense (shown as a tooltip, never as a crash).
// Keyboards (and autocorrect) hand us ×, ÷, − and curly quotes. Treat them as
// the plain maths signs rather than refusing the sum.
const normalizeSigns = (s: string) => s
  .replace(/[\u00d7\u2715\u2716\uff0a]/g, '*')
  .replace(/[\u00f7\uff0f]/g, '/')
  .replace(/[\u2212\u2013\u2014\uff0d]/g, '-')
  .replace(/[\uff0b]/g, '+')
  .replace(/[\uff08]/g, '(').replace(/[\uff09]/g, ')')
  .replace(/[\uff0c\u3001]/g, ',')
  .replace(/[\u201c\u201d\u2018\u2019]/g, '"')
  .replace(/[\u00a0\u3000]/g, ' ')

export function evaluateFormula(text: string, grid: Grid): { value: string; error?: string } {
  const src = normalizeSigns(String(text || '').trim()).replace(/^=/, '')
  if (!src.trim()) return { value: '' }
  try {
    return { value: prettyNumber(new Parser(src, grid).parse()) }
  } catch (e) {
    return { value: '⚠︎', error: e instanceof Error ? e.message : 'Could not work that out' }
  }
}

export const FORMULA_HELP = [
  '=SUM(A2:A9) — adds a column up',
  '=AVERAGE(B2:B9) — the average',
  '=MIN / =MAX(B2:B9) — smallest / biggest',
  '=COUNT(B2:B9) — how many numbers',
  '=COUNTA(A2:A9) — how many cells are filled',
  '=COUNTIF(C2:C9,"Done") — how many say Done',
  '=PERCENT(C2,C3) — one number as a % of another',
  '=ROUND(A1*1.07, 2) — maths with cells'
]
