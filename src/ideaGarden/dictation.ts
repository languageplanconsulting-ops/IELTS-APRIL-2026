// Speak instead of type. Uses the browser's own speech recognition (the same
// engine the rest of the app uses), so nothing is uploaded by us and it works
// in Thai as well as English.
import { useCallback, useEffect, useRef, useState } from 'react'

export const DICTATION_LANGS = [
  { code: 'th-TH', label: 'ไทย' },
  { code: 'en-US', label: 'EN' }
] as const

export type DictationLang = (typeof DICTATION_LANGS)[number]['code']

type RecognitionResult = { 0: { transcript: string }; isFinal: boolean; length: number }
type RecognitionEvent = { resultIndex: number; results: { length: number; [i: number]: RecognitionResult } }
type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: { error?: string }) => void) | null
  onend: (() => void) | null
}
type SpeechWindow = Window & {
  webkitSpeechRecognition?: new () => Recognition
  SpeechRecognition?: new () => Recognition
}

const getEngine = () => {
  const w = window as SpeechWindow
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export const dictationSupported = () => !!getEngine()

// Where the words go: the line that had the cursor when dictation started.
type Target = { el: HTMLElement; blockId: string }

export function useDictation(onText: (blockId: string, html: string) => void) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<DictationLang>(() => {
    try { return (localStorage.getItem('ideaGarden.dictationLang') as DictationLang) || 'th-TH' } catch { return 'th-TH' }
  })
  const recRef = useRef<Recognition | null>(null)
  const targetRef = useRef<Target | null>(null)
  const wantRef = useRef(false) // keep going until the user stops

  useEffect(() => { try { localStorage.setItem('ideaGarden.dictationLang', lang) } catch { /* ignore */ } }, [lang])

  const insert = useCallback((text: string) => {
    const t = targetRef.current
    if (!t || !text) return
    const el = t.el
    if (!document.body.contains(el)) { targetRef.current = null; return }
    const sel = window.getSelection()
    const inside = sel && sel.rangeCount && el.contains(sel.anchorNode)
    const range = inside ? sel!.getRangeAt(0) : (() => { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); return r })()
    range.deleteContents()
    const node = document.createTextNode(text)
    range.insertNode(node)
    range.setStartAfter(node); range.collapse(true)
    sel?.removeAllRanges(); sel?.addRange(range)
    onText(t.blockId, el.innerHTML)
  }, [onText])

  const stop = useCallback(() => {
    wantRef.current = false
    setListening(false)
    setInterim('')
    try { recRef.current?.stop() } catch { /* ignore */ }
    recRef.current = null
  }, [])

  const start = useCallback(() => {
    const Engine = getEngine()
    if (!Engine) { setError('This browser can’t listen. Try Chrome or Edge.'); return }
    // Remember the line the cursor is on — focus moves to the button on click.
    const active = document.activeElement as HTMLElement | null
    const el = active && active.isContentEditable ? active : null
    const row = el?.closest('.block-row') as HTMLElement | null
    if (!el || !row?.dataset.blockId) { setError('Click into the line you want to dictate first.'); return }
    targetRef.current = { el, blockId: row.dataset.blockId }

    const rec = new Engine()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      let pending = ''
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i]
        const said = r[0]?.transcript || ''
        if (r.isFinal) insert(said.trim() ? `${said.trim()} ` : '')
        else pending += said
      }
      setInterim(pending)
    }
    rec.onerror = (e) => {
      const code = e?.error || ''
      if (code === 'not-allowed' || code === 'service-not-allowed') { setError('Microphone blocked — allow it for this site.'); stop() }
      else if (code === 'no-speech') { /* keep waiting */ }
      else if (code !== 'aborted') setError('Dictation stopped. Tap the mic to try again.')
    }
    rec.onend = () => {
      // Browsers cut the session off every so often; restart while the user
      // still wants to dictate.
      if (!wantRef.current) { setListening(false); return }
      try { rec.start() } catch { setListening(false) }
    }
    setError(null)
    wantRef.current = true
    try { rec.start(); recRef.current = rec; setListening(true) } catch { setError('Could not start listening.'); wantRef.current = false }
  }, [lang, insert, stop])

  // Switching language mid-flight restarts with the new one.
  useEffect(() => {
    if (!listening) return
    const rec = recRef.current
    if (rec && rec.lang !== lang) { rec.lang = lang; try { rec.stop() } catch { /* restarts in onend */ } }
  }, [lang, listening])

  useEffect(() => () => { wantRef.current = false; try { recRef.current?.abort() } catch { /* ignore */ } }, [])

  return { listening, interim, error, lang, setLang, start, stop, clearError: () => setError(null), toggle: () => (listening ? stop() : start()) }
}
