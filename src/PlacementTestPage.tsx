/**
 * Public placement test — no login, no app shell.
 *
 * Mounted directly from main.tsx on /placement, because it shares nothing with
 * the logged-in app: no nav, no auth, no course state. Content and the band
 * ladders live in placementTestData.ts; the speaking ladder lives in
 * placementSpeakingBand.ts and is verified by npm run verify:placement-speaking.
 *
 * The test is adaptive: clear the easy set and it serves a harder one. Miss it
 * and the skill ends quietly at that band — the student is never told they
 * failed mid-test, only shown the result at the end.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './PlacementTestPage.css'
import { PlacementArt, PlacementChart } from './placementTestArt'
import {
  PLACEMENT_BAND_LABELS,
  PLACEMENT_BAND_MIDPOINTS,
  PLACEMENT_LISTENING_SECTION_1,
  PLACEMENT_LISTENING_SECTION_2,
  PLACEMENT_LISTENING_SECTION_4,
  PLACEMENT_READING_HEADINGS,
  PLACEMENT_READING_TFNG,
  PLACEMENT_SPEAKING_QUESTIONS,
  PLACEMENT_WRITING_ESSAY,
  PLACEMENT_WRITING_GATE_1,
  PLACEMENT_WRITING_GATE_2,
  PLACEMENT_WRITING_GATE_3,
  essayReachesBandSeven,
  matchesPlacementAnswer,
  scorePlacementListening,
  scorePlacementReading,
  scorePlacementWriting,
  type PlacementBandKey,
  type PlacementEssaySignals,
  type PlacementListeningClip,
  type PlacementWritingItem
} from './placementTestData'
import { scorePlacementSpeaking, type PlacementSpeakingSignals } from './placementSpeakingBand'
import { recommendCourses } from './placementCourseRecommendation'

type Screen =
  | 'warning' | 'intro' | 'cheer'
  | 'reading-intro' | 'reading-tfng' | 'reading-head'
  | 'listening-intro' | 'listening-q'
  | 'writing-intro' | 'writing-q' | 'writing-essay-intro' | 'writing-essay' | 'writing-essay-marking'
  | 'speaking-intro' | 'speaking-q' | 'speaking-sending'
  | 'report'

type Wrong = { skill: string; question: string; given: string; answer: string; why: string }
type Clip = { blob: Blob; url: string; seconds: number }

const MAX_PLAYS = 2
const SKILL_NAMES = ['การอ่าน', 'การฟัง', 'การเขียน', 'การพูด']
const SKILL_OF: Partial<Record<Screen, number>> = {
  'reading-intro': 0, 'reading-tfng': 0, 'reading-head': 0,
  'listening-intro': 1, 'listening-q': 1,
  'writing-intro': 2, 'writing-q': 2, 'writing-essay-intro': 2, 'writing-essay': 2, 'writing-essay-marking': 2,
  'speaking-intro': 3, 'speaking-q': 3, 'speaking-sending': 3,
  report: 4
}

const LISTENING_CLIPS: Record<'s1' | 's2' | 's4', PlacementListeningClip> = {
  s1: PLACEMENT_LISTENING_SECTION_1,
  s2: PLACEMENT_LISTENING_SECTION_2,
  s4: PLACEMENT_LISTENING_SECTION_4
}
const WRITING_GATES: Record<'g1' | 'g2' | 'g3', PlacementWritingItem[]> = {
  g1: PLACEMENT_WRITING_GATE_1,
  g2: [PLACEMENT_WRITING_GATE_2],
  g3: [PLACEMENT_WRITING_GATE_3]
}

/** Splits "before ~underlined~ after" into rendered parts. */
const underlineParts = (sentence: string, underlined: string) => {
  const at = sentence.indexOf(underlined)
  if (at < 0) return { before: sentence, mark: '', after: '' }
  return { before: sentence.slice(0, at), mark: underlined, after: sentence.slice(at + underlined.length) }
}

export default function PlacementTestPage() {
  const [screen, setScreen] = useState<Screen>('warning')
  const [qi, setQi] = useState(0)
  const [ready, setReady] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [cheerState, setCheerState] = useState<{ title: string; body: string; next: Screen } | null>(null)

  const [readingBand, setReadingBand] = useState<PlacementBandKey | null>(null)
  const [listeningBand, setListeningBand] = useState<PlacementBandKey | null>(null)
  const [writingBand, setWritingBand] = useState<PlacementBandKey | null>(null)
  const [speakingBand, setSpeakingBand] = useState<PlacementBandKey | null>(null)
  const [speakingReasons, setSpeakingReasons] = useState<string[]>([])
  const [speakingTranscripts, setSpeakingTranscripts] = useState<Array<{ question: string; response: string }>>([])
  const [speakingSignals, setSpeakingSignals] = useState<PlacementSpeakingSignals | null>(null)
  const [speakingPending, setSpeakingPending] = useState(true)
  const [wrong, setWrong] = useState<Wrong[]>([])

  const tfngCorrectRef = useRef<number | null>(null)
  const listenCorrectRef = useRef<{ s1: number | null; s2: number | null }>({ s1: null, s2: null })
  const writeCorrectRef = useRef<{ g1: number | null; g2: boolean | null; g3: boolean | null }>({ g1: null, g2: null, g3: null })
  const [essaySignals, setEssaySignals] = useState<PlacementEssaySignals | null>(null)

  const [listenPhase, setListenPhase] = useState<'s1' | 's2' | 's4'>('s1')
  const [writePhase, setWritePhase] = useState<'g1' | 'g2' | 'g3'>('g1')

  const [playsUsed, setPlaysUsed] = useState(0)
  const [playStatus, setPlayStatus] = useState('ยังไม่ได้เล่น')
  const [playProgress, setPlayProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [clips, setClips] = useState<Record<number, Clip>>({})
  const [recording, setRecording] = useState(false)
  const [recSeconds, setRecSeconds] = useState(0)
  const [micError, setMicError] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recTimerRef = useRef<number | null>(null)

  const goTo = useCallback((next: Screen, index = 0) => {
    setScreen(next)
    setQi(index)
  }, [])

  const celebrate = useCallback((title: string, body: string, next: Screen) => {
    setCheerState({ title, body, next })
    goTo('cheer')
  }, [goTo])

  const addWrong = useCallback((entry: Wrong) => setWrong((prev) => [...prev, entry]), [])

  /* A one-shot test must not be lost to a stray refresh. */
  useEffect(() => {
    const guarded: Screen[] = ['warning', 'intro', 'report']
    if (guarded.includes(screen)) return
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [screen])

  useEffect(() => () => {
    if (audioRef.current) audioRef.current.pause()
    if (recTimerRef.current) window.clearInterval(recTimerRef.current)
  }, [])

  /* ------------------------------------------------------------- listening */

  const clip = LISTENING_CLIPS[listenPhase]

  const playClip = useCallback(() => {
    if (playsUsed >= MAX_PLAYS || playing) return
    setPlaysUsed((n) => n + 1)
    setPlaying(true)
    setPlayStatus('กำลังโหลดเสียง…')
    const element = new Audio(clip.audioUrl)
    audioRef.current = element

    element.addEventListener('loadedmetadata', () => {
      // A moved or re-encoded file would silently play the wrong stretch of audio,
      // so refuse to clip unless the duration matches the measured one.
      if (Math.abs(element.duration - clip.expectedFileDuration) > 2) {
        setPlayStatus('⚠ ไฟล์เสียงไม่ตรงกับที่บันทึกไว้ — กรุณาแจ้งผู้สอนครับ')
        setPlaysUsed((n) => Math.max(0, n - 1))
        setPlaying(false)
        audioRef.current = null
        return
      }
      element.currentTime = clip.startSeconds
      void element.play()
      setPlayStatus('กำลังเล่น…')
    })
    element.addEventListener('timeupdate', () => {
      const span = clip.endSeconds - clip.startSeconds
      setPlayProgress(Math.min(100, Math.max(0, ((element.currentTime - clip.startSeconds) / span) * 100)))
      if (element.currentTime >= clip.endSeconds) {
        element.pause()
        setPlaying(false)
        setPlayStatus((prev) => (prev.startsWith('⚠') ? prev : 'เล่นจบแล้ว'))
      }
    })
    element.addEventListener('error', () => {
      setPlayStatus('⚠ โหลดเสียงไม่สำเร็จ — ตรวจอินเทอร์เน็ตหรือแจ้งผู้สอนครับ')
      setPlaysUsed((n) => Math.max(0, n - 1))
      setPlaying(false)
    })
  }, [clip, playsUsed, playing])

  const resetPlayer = useCallback(() => {
    if (audioRef.current) audioRef.current.pause()
    audioRef.current = null
    setPlaysUsed(0)
    setPlayProgress(0)
    setPlaying(false)
    setPlayStatus('ยังไม่ได้เล่น')
  }, [])

  const submitListening = () => {
    let correct = 0
    clip.questions.forEach((question) => {
      const given = (answers[question.id] || '').trim()
      if (given && matchesPlacementAnswer(given, question.acceptedAnswers)) correct += 1
      else {
        addWrong({
          skill: 'การฟัง', question: question.noteLine, given: given || '(ไม่ได้ตอบ)',
          answer: question.acceptedAnswers[0], why: question.explanationThai
        })
      }
    })
    resetPlayer()

    if (listenPhase === 's1') {
      listenCorrectRef.current.s1 = correct
      if (correct < clip.questions.length) {
        setListeningBand(scorePlacementListening(correct, null, null))
        goTo('writing-intro')
        return
      }
      setListenPhase('s2')
      celebrate('ฟังได้ครบทุกข้อ!', 'ไปต่อที่บทสนทนาที่ยากขึ้นกันครับ', 'listening-intro')
      return
    }
    if (listenPhase === 's2') {
      listenCorrectRef.current.s2 = correct
      if (correct < clip.questions.length) {
        setListeningBand(scorePlacementListening(listenCorrectRef.current.s1 ?? 0, correct, null))
        goTo('writing-intro')
        return
      }
      setListenPhase('s4')
      celebrate('ยอดเยี่ยมครับ!', 'ชุดสุดท้ายเป็นเลกเชอร์วิชาการ ระดับเดียวกับ Band 7 ครับ', 'listening-intro')
      return
    }
    setListeningBand(scorePlacementListening(listenCorrectRef.current.s1 ?? 0, listenCorrectRef.current.s2 ?? 0, correct))
    goTo('writing-intro')
  }

  /* --------------------------------------------------------------- reading */

  const submitTfng = () => {
    const question = PLACEMENT_READING_TFNG[qi]
    if (!answers[question.id]) return
    if (qi < PLACEMENT_READING_TFNG.length - 1) { goTo('reading-tfng', qi + 1); return }

    let correct = 0
    PLACEMENT_READING_TFNG.forEach((item) => {
      if (answers[item.id] === item.answer) correct += 1
      else {
        addWrong({
          skill: 'การอ่าน', question: item.statement, given: answers[item.id] || '(ไม่ได้ตอบ)',
          answer: item.answer, why: item.explanationThai
        })
      }
    })
    tfngCorrectRef.current = correct
    if (correct < PLACEMENT_READING_TFNG.length) {
      setReadingBand(scorePlacementReading(correct, null))
      goTo('listening-intro')
      return
    }
    celebrate('เก่งมากครับ!', 'ชุดแรกผ่านหมด ระบบจะป้อนข้อที่ยากขึ้นให้ เพื่อวัดระดับให้แม่นขึ้นครับ', 'reading-head')
  }

  const submitHeading = () => {
    const question = PLACEMENT_READING_HEADINGS[qi]
    if (!answers[question.id]) return
    if (qi < PLACEMENT_READING_HEADINGS.length - 1) { goTo('reading-head', qi + 1); return }

    let correct = 0
    PLACEMENT_READING_HEADINGS.forEach((item) => {
      if (answers[item.id] === item.answer) correct += 1
      else {
        addWrong({
          skill: 'การอ่าน', question: item.paragraphLabel, given: answers[item.id] || '(ไม่ได้ตอบ)',
          answer: item.answer, why: item.explanationThai
        })
      }
    })
    setReadingBand(scorePlacementReading(tfngCorrectRef.current ?? 0, correct))
    goTo('listening-intro')
  }

  /* --------------------------------------------------------------- writing */

  const checkWriting = (item: PlacementWritingItem) => {
    const given = (answers[item.id] || '').trim()
    const ok = matchesPlacementAnswer(given, item.acceptedAnswers)
    if (!ok) {
      addWrong({
        skill: 'การเขียน', question: item.promptThai, given: given || '(ไม่ได้ตอบ)',
        answer: item.acceptedAnswers[0], why: item.explanationThai
      })
    }
    return ok
  }

  const submitWriting = () => {
    const items = WRITING_GATES[writePhase]
    const item = items[qi]
    if (!(answers[item.id] || '').trim()) return
    if (qi < items.length - 1) { goTo('writing-q', qi + 1); return }

    if (writePhase === 'g1') {
      const correct = items.filter(checkWriting).length
      writeCorrectRef.current.g1 = correct
      if (correct < items.length) {
        setWritingBand(scorePlacementWriting(correct, null, null))
        goTo('speaking-intro')
        return
      }
      setWritePhase('g2')
      celebrate('ตรวจแก้ได้ถูกทั้งสองข้อ!', 'ไปต่อที่ประโยคที่ซับซ้อนขึ้นกันครับ', 'writing-q')
      return
    }
    if (writePhase === 'g2') {
      const ok = checkWriting(items[0])
      writeCorrectRef.current.g2 = ok
      if (!ok) {
        setWritingBand(scorePlacementWriting(writeCorrectRef.current.g1 ?? 0, false, null))
        goTo('speaking-intro')
        return
      }
      setWritePhase('g3')
      celebrate('แม่นมากครับ!', 'ข้อสุดท้ายเป็นระดับ Band 7 ครับ', 'writing-q')
      return
    }
    const ok = checkWriting(items[0])
    writeCorrectRef.current.g3 = ok
    if (!ok) {
      setWritingBand(scorePlacementWriting(writeCorrectRef.current.g1 ?? 0, writeCorrectRef.current.g2, false))
      goTo('speaking-intro')
      return
    }
    // Clean grammar is where Band 7 starts, not where it is earned — the
    // paragraph decides the rest.
    goTo('writing-essay-intro')
  }

  const submitEssay = useCallback(async () => {
    const paragraph = (answers[PLACEMENT_WRITING_ESSAY.id] || '').trim()
    try {
      const response = await fetch('/api/placement/writing-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraph, taskPrompt: PLACEMENT_WRITING_ESSAY.taskPrompt })
      })
      if (!response.ok) throw new Error('essay assess failed')
      const { signals } = (await response.json()) as { signals: PlacementEssaySignals }
      const reachedSeven = essayReachesBandSeven(signals)
      setEssaySignals(signals)
      setWritingBand(scorePlacementWriting(writeCorrectRef.current.g1 ?? 0, writeCorrectRef.current.g2, true, reachedSeven))
    } catch {
      // Marking is unavailable: hold the band at the level the correction items
      // proved rather than awarding or denying a 7 the paragraph never got.
      setEssaySignals(null)
      setWritingBand(scorePlacementWriting(writeCorrectRef.current.g1 ?? 0, writeCorrectRef.current.g2, true))
    }
    goTo('speaking-intro')
  }, [answers, goTo])

  useEffect(() => {
    if (screen !== 'writing-essay-marking') return
    void submitEssay()
  }, [screen, submitEssay])

  /* -------------------------------------------------------------- speaking */

  const startRecording = async () => {
    setMicError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data)
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        setClips((prev) => ({ ...prev, [qi]: { blob, url: URL.createObjectURL(blob), seconds: recSeconds } }))
        if (recTimerRef.current) window.clearInterval(recTimerRef.current)
        setRecording(false)
      }
      recorder.start()
      setRecording(true)
      setRecSeconds(0)
      recTimerRef.current = window.setInterval(() => setRecSeconds((n) => n + 1), 1000)
    } catch {
      setMicError('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตการใช้ไมค์ในเบราว์เซอร์ครับ')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const submitSpeaking = useCallback(async () => {
    try {
      const responses = []
      for (let index = 0; index < PLACEMENT_SPEAKING_QUESTIONS.length; index += 1) {
        const recorded = clips[index]
        if (!recorded) throw new Error('missing clip')
        const form = new FormData()
        form.append('audio', recorded.blob, `answer-${index}.webm`)
        const transcribed = await fetch('/api/transcribe', { method: 'POST', body: form })
        if (!transcribed.ok) throw new Error('transcribe failed')
        const payload = await transcribed.json()
        responses.push({
          part: PLACEMENT_SPEAKING_QUESTIONS[index].part,
          question: PLACEMENT_SPEAKING_QUESTIONS[index].question,
          response: payload.text as string
        })
      }
      const assessed = await fetch('/api/placement/speaking-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionResponses: responses })
      })
      if (!assessed.ok) throw new Error('assess failed')
      const { signals } = (await assessed.json()) as { signals: PlacementSpeakingSignals }
      const result = scorePlacementSpeaking(signals)
      setSpeakingTranscripts(responses.map((item) => ({ question: item.question, response: item.response })))
      setSpeakingSignals(signals)
      setSpeakingBand(result.bandKey)
      setSpeakingReasons(result.reasonsThai)
      setSpeakingPending(false)
    } catch {
      // Marking runs on the server; if it is unreachable the other three skills
      // still report and speaking is shown as awaiting marking rather than faked.
      setSpeakingPending(true)
    }
    goTo('report')
  }, [clips, goTo])

  useEffect(() => {
    if (screen !== 'speaking-sending') return
    void submitSpeaking()
  }, [screen, submitSpeaking])

  /* ---------------------------------------------------------------- report */

  const rows = useMemo(() => ([
    { skill: 'การอ่าน', band: readingBand },
    { skill: 'การฟัง', band: listeningBand },
    { skill: 'การเขียน', band: writingBand },
    { skill: 'การพูด', band: speakingBand }
  ]), [readingBand, listeningBand, writingBand, speakingBand])

  const scored = rows.filter((row) => row.band)
  const overall = scored.length
    ? (Math.round((scored.reduce((sum, row) => sum + PLACEMENT_BAND_MIDPOINTS[row.band!], 0) / scored.length) * 2) / 2).toFixed(1)
    : '—'
  const weakest = scored.slice().sort((a, b) => PLACEMENT_BAND_MIDPOINTS[a.band!] - PLACEMENT_BAND_MIDPOINTS[b.band!])[0]
  const dragging = scored.filter((row) => PLACEMENT_BAND_MIDPOINTS[row.band!] <= Number(overall) - 1)

  const recommendation = useMemo(() => recommendCourses({
    reading: readingBand, listening: listeningBand, writing: writingBand, speaking: speakingBand
  }), [readingBand, listeningBand, writingBand, speakingBand])

  /* The result is what the teacher follows up on, so save it once the report exists. */
  const savedRef = useRef(false)
  useEffect(() => {
    if (screen !== 'report' || savedRef.current) return
    savedRef.current = true
    void fetch('/api/placement/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, contact, overall,
        bands: {
          reading: readingBand, listening: listeningBand,
          writing: writingBand, speaking: speakingBand
        },
        speakingPending,
        // Everything an admin would want when this visitor eventually registers.
        answers,
        wrong,
        speakingTranscripts,
        speakingSignals,
        speakingReasons,
        essayParagraph: answers[PLACEMENT_WRITING_ESSAY.id] || '',
        essaySignals,
        gates: {
          readingTfng: tfngCorrectRef.current,
          listening: listenCorrectRef.current,
          writing: writeCorrectRef.current
        }
      })
    }).catch(() => {})
  }, [
    screen, name, contact, overall, readingBand, listeningBand, writingBand, speakingBand,
    speakingPending, answers, wrong, speakingTranscripts, speakingSignals, speakingReasons, essaySignals
  ])

  /* ----------------------------------------------------------------- views */

  const activeSkill = SKILL_OF[screen]
  const pill = (band: PlacementBandKey | null) => {
    if (!band) return <span className="plcPill isPending">รอผลตรวจ</span>
    const tone = band === 'below5.5' || band === '5.5-6' ? 'isLow' : band === '6.5-7' || band === '7plus' ? 'isHigh' : ''
    return <span className={`plcPill ${tone}`}>{PLACEMENT_BAND_LABELS[band]}</span>
  }

  const renderScreen = () => {
    switch (screen) {
      case 'warning':
        return (
          <div className="plcBox plcFade">
            {PlacementArt.clock}
            <div className="plcEyebrow plcCentre">โปรดอ่านก่อนเริ่ม</div>
            <h2 className="plcCentre">เตรียมตัวให้พร้อมก่อนกดเริ่มครับ</h2>
            <p className="plcLead plcCentre">แบบทดสอบนี้ทำได้ครั้งเดียว กรุณาอ่านทั้ง 3 ข้อนี้ให้ครบก่อนครับ</p>
            <div className="plcCaution"><strong>⏱ ต้องมีเวลาว่างต่อเนื่อง 15–20 นาที</strong><br />ระหว่างทำห้ามปิดหน้านี้หรือรีเฟรช เพราะคำตอบจะหายทั้งหมดครับ</div>
            <div className="plcCaution"><strong>🔒 ทำได้ครั้งเดียวเท่านั้น</strong><br />ผลที่ได้จะถูกใช้จัดระดับคอร์สของคุณจริง จึงไม่สามารถทำซ้ำเพื่อแก้คะแนนได้ครับ</div>
            <div className="plcCaution"><strong>🎙 ส่วนการพูดต้องใช้ไมโครโฟน</strong><br />เราตรวจการพูดด้วยฐานข้อมูลผลสอบจริงของนักเรียน English Plan กรุณาอยู่ในที่เงียบ พูดด้วยความสามารถของตัวเองจริง ๆ และอย่าใช้ AI หรือสคริปต์ช่วยตอบ เพราะผลที่ได้จะไม่ตรงกับระดับจริงของคุณครับ</div>
            <button type="button" className={`plcChoice ${ready ? 'isOn' : ''}`} onClick={() => setReady((v) => !v)}>
              <input type="checkbox" checked={ready} readOnly />
              <span>ฉันเข้าใจเงื่อนไขทั้งหมดแล้ว และตอนนี้พร้อมทำแบบทดสอบต่อเนื่องจนจบครับ</span>
            </button>
            <div className="plcActions">
              <button type="button" className="plcBtn" disabled={!ready} onClick={() => goTo('intro')}>พร้อมแล้ว เริ่มเลย</button>
              <span className="plcNote">ยังไม่พร้อม? ปิดหน้านี้แล้วกลับมาใหม่ได้ครับ</span>
            </div>
          </div>
        )

      case 'intro':
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">เริ่มต้น</div>
            <h2>แบบทดสอบวัดระดับ IELTS แบบสั้น</h2>
            <p className="plcLead">ใช้เวลาประมาณ 15–20 นาที ครอบคลุมทั้ง 4 ทักษะ ไม่ต้องสมัครสมาชิกครับ</p>
            <div className="plcInstruction">
              แบบทดสอบนี้เป็นแบบ <strong>adaptive</strong> — ถ้าตอบข้อง่ายถูก ระบบจะป้อนข้อที่ยากขึ้นให้ เพื่อให้ประเมินระดับของคุณได้แม่นยำที่สุดครับ
            </div>
            <div style={{ marginTop: 18 }}>
              <div className="plcTag">ชื่อ</div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อ-นามสกุล" style={{ marginTop: 8 }} />
            </div>
            <div style={{ marginTop: 18 }}>
              <div className="plcTag">LINE ID หรืออีเมล</div>
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="สำหรับส่งผลและคำแนะนำกลับไปครับ" style={{ marginTop: 8 }} />
            </div>
            <div className="plcActions">
              <button type="button" className="plcBtn" disabled={!name.trim()} onClick={() => goTo('reading-intro')}>เริ่มทำแบบทดสอบ</button>
            </div>
          </div>
        )

      case 'cheer':
        return (
          <div className="plcBox plcFade plcCentre">
            {PlacementArt.cheer}
            <h2>{cheerState?.title}</h2>
            <p className="plcLead">{cheerState?.body}</p>
            <div className="plcActions" style={{ justifyContent: 'center' }}>
              <button type="button" className="plcBtn isSun" onClick={() => goTo(cheerState!.next)}>ไปต่อ</button>
            </div>
          </div>
        )

      case 'reading-intro':
        return (
          <div className="plcBox plcFade">
            {PlacementArt.book}
            <div className="plcEyebrow plcCentre">ทักษะที่ 1 จาก 4</div>
            <h2 className="plcCentre">การอ่าน</h2>
            <p className="plcLead plcCentre">ข้อความที่เกี่ยวข้องถูกตัดมาให้แล้ว ไม่ต้องหาเอง — ส่วนนี้วัดการตีความ ไม่ได้วัดความเร็วครับ</p>
            <div className="plcInstruction">
              Do the following statements agree with the information in the passage?<br />
              <strong>TRUE</strong> — the statement agrees with the information<br />
              <strong>FALSE</strong> — the statement contradicts the information<br />
              <strong>NOT GIVEN</strong> — there is no information on this
            </div>
            <div className="plcActions"><button type="button" className="plcBtn" onClick={() => goTo('reading-tfng')}>เริ่มข้อแรก</button></div>
          </div>
        )

      case 'reading-tfng': {
        const question = PLACEMENT_READING_TFNG[qi]
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">การอ่าน · ข้อ {qi + 1} จาก {PLACEMENT_READING_TFNG.length}</div>
            <div className="plcPassage">{question.context}</div>
            <p className="plcQuestion">{question.statement}</p>
            <div className="plcChoices">
              {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((option) => (
                <button
                  key={option} type="button"
                  className={`plcChoice ${answers[question.id] === option ? 'isOn' : ''}`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                >
                  <span className="plcChoiceKey">{option}</span>
                </button>
              ))}
            </div>
            <div className="plcActions">
              <button type="button" className="plcBtn" disabled={!answers[question.id]} onClick={submitTfng}>
                {qi === PLACEMENT_READING_TFNG.length - 1 ? 'ส่งคำตอบ' : 'ข้อถัดไป'}
              </button>
            </div>
          </div>
        )
      }

      case 'reading-head': {
        const question = PLACEMENT_READING_HEADINGS[qi]
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">การอ่าน · ระดับยากขึ้น · ข้อ {qi + 1} จาก {PLACEMENT_READING_HEADINGS.length}</div>
            <div className="plcInstruction">Choose the correct heading for <strong>{question.paragraphLabel}</strong>.</div>
            <div className="plcPassage">{question.paragraph}</div>
            <div className="plcChoices">
              {question.options.map((option) => (
                <button
                  key={option.key} type="button"
                  className={`plcChoice ${answers[question.id] === option.key ? 'isOn' : ''}`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.key }))}
                >
                  <span className="plcChoiceKey">{option.key}</span><span>{option.text}</span>
                </button>
              ))}
            </div>
            <div className="plcActions">
              <button type="button" className="plcBtn" disabled={!answers[question.id]} onClick={submitHeading}>
                {qi === PLACEMENT_READING_HEADINGS.length - 1 ? 'ส่งคำตอบ' : 'ข้อถัดไป'}
              </button>
            </div>
          </div>
        )
      }

      case 'listening-intro': {
        const nth = { s1: 'ชุดที่ 1', s2: 'ระดับยากขึ้น', s4: 'ระดับยากที่สุด' }[listenPhase]
        return (
          <div className="plcBox plcFade">
            {PlacementArt.headphones}
            <div className="plcEyebrow plcCentre">ทักษะที่ 2 จาก 4 · {nth}</div>
            <h2 className="plcCentre">การฟัง — {clip.titleThai.replace(/^Section \d+ · /, '')}</h2>
            <div className="plcInstruction">{clip.noteHeading}</div>
            <div className="plcCaution">
              เสียงเล่นได้ <strong>2 ครั้ง</strong> — อ่านคำถามให้ครบก่อนกดเล่นครับ คำตอบจะเรียงตามลำดับที่ได้ยิน
            </div>
            <div className="plcActions"><button type="button" className="plcBtn" onClick={() => goTo('listening-q')}>ดูคำถามและเล่นเสียง</button></div>
          </div>
        )
      }

      case 'listening-q':
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">การฟัง · {clip.titleThai}</div>
            <div className="plcPlayer">
              <div className="plcPlayerRow">
                <button type="button" disabled={playing || playsUsed >= MAX_PLAYS} onClick={playClip}>▶ เล่นเสียง</button>
                <span className="plcPlayerMeta">
                  เหลือ {MAX_PLAYS - playsUsed} ครั้ง · ยาว {Math.round(clip.endSeconds - clip.startSeconds)} วินาที
                </span>
              </div>
              <div className="plcPlayerBar"><i style={{ width: `${playProgress}%` }} /></div>
              <div className="plcPlayerMeta">{playStatus}</div>
            </div>
            <div className="plcNotes">
              <h4>{clip.noteHeading}</h4>
              {clip.questions.map((question) => (
                question.options ? (
                  <div className="plcQGroup" key={question.id}>
                    <div className="plcTag">ข้อ {question.number}</div>
                    <p className="plcQuestion" style={{ fontSize: 17, margin: '6px 0 14px' }}>{question.noteLine}</p>
                    <div className="plcChoices">
                      {question.options.map((option) => (
                        <button
                          key={option.key} type="button"
                          className={`plcChoice ${answers[question.id] === option.key ? 'isOn' : ''}`}
                          onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.key }))}
                        >
                          <span className="plcChoiceKey">{option.key}</span><span>{option.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="plcNoteLine" key={question.id}>
                    <span>{question.number}.</span>
                    <span>{question.noteLine.split('______')[0]}</span>
                    <input
                      type="text" value={answers[question.id] || ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                    />
                    <span>{question.noteLine.split('______')[1] || ''}</span>
                  </div>
                )
              ))}
            </div>
            <div className="plcActions"><button type="button" className="plcBtn" onClick={submitListening}>ส่งคำตอบ</button></div>
          </div>
        )

      case 'writing-intro':
        return (
          <div className="plcBox plcFade">
            {PlacementArt.chart}
            <div className="plcEyebrow plcCentre">ทักษะที่ 3 จาก 4</div>
            <h2 className="plcCentre">การเขียน</h2>
            <p className="plcLead plcCentre">ประโยคต่อไปนี้มาจากบทความบรรยายกราฟด้านล่าง (Writing Task 1) หน้าที่ของคุณคือตรวจแก้ภาษา ไม่ต้องเขียนใหม่ทั้งย่อหน้าครับ</p>
            <figure className="plcChart" style={{ margin: '0 0 18px' }}>
              <PlacementChart />
              <figcaption>The graph below shows the percentage of households with internet access in four European countries between 2000 and 2010.</figcaption>
            </figure>
            <div className="plcActions"><button type="button" className="plcBtn" onClick={() => goTo('writing-q')}>เริ่มข้อแรก</button></div>
          </div>
        )

      case 'writing-q': {
        const items = WRITING_GATES[writePhase]
        const item = items[qi]
        const parts = underlineParts(item.sentence, item.underlined)
        const level = { g1: '', g2: ' · ระดับยากขึ้น', g3: ' · ระดับยากที่สุด' }[writePhase]
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">การเขียน{level} · ข้อ {qi + 1} จาก {items.length}</div>
            <figure className="plcChart"><PlacementChart /></figure>
            <div className="plcSentence">
              {parts.before}<u><strong>{parts.mark}</strong></u>{parts.after}
            </div>
            <p className="plcNote" style={{ marginBottom: 16 }}>{item.promptThai}</p>
            {item.kind === 'typed' ? (
              <>
                <input
                  type="text" value={answers[item.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  placeholder="พิมพ์คำที่ถูกต้องที่นี่"
                />
                <div className="plcActions" style={{ marginTop: 12 }}>
                  {/* Without this a student who believes the text is already correct
                      has nothing to type, which gives away that it is wrong. */}
                  <button
                    type="button" className="plcBtn isLine"
                    onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: 'NO CHANGE' }))}
                  >
                    ถูกต้องอยู่แล้ว ไม่ต้องแก้
                  </button>
                </div>
              </>
            ) : (
              <div className="plcChoices">
                {item.options?.map((option) => (
                  <button
                    key={option.key} type="button"
                    className={`plcChoice ${answers[item.id] === option.key ? 'isOn' : ''}`}
                    onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option.key }))}
                  >
                    <span className="plcChoiceKey">{option.key}</span><span>{option.text}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="plcActions">
              <button type="button" className="plcBtn" disabled={!(answers[item.id] || '').trim()} onClick={submitWriting}>
                {qi === items.length - 1 ? 'ส่งคำตอบ' : 'ข้อถัดไป'}
              </button>
            </div>
          </div>
        )
      }

      case 'writing-essay-intro':
        return (
          <div className="plcBox plcFade">
            {PlacementArt.cheer}
            <div className="plcEyebrow plcCentre">การเขียน · ด่านสุดท้าย</div>
            <h2 className="plcCentre">ไวยากรณ์คุณถึงเกณฑ์ Band 7 แล้วครับ</h2>
            <p className="plcLead plcCentre">{PLACEMENT_WRITING_ESSAY.introThai}</p>
            <div className="plcInstruction">{PLACEMENT_WRITING_ESSAY.instructionThai}</div>
            <div className="plcActions plcCentre" style={{ justifyContent: 'center' }}>
              <button type="button" className="plcBtn isSun" onClick={() => goTo('writing-essay')}>ดูคำถามและเริ่มเขียน</button>
            </div>
          </div>
        )

      case 'writing-essay': {
        const paragraph = answers[PLACEMENT_WRITING_ESSAY.id] || ''
        const words = paragraph.trim() ? paragraph.trim().split(/\s+/).length : 0
        const longEnough = words >= PLACEMENT_WRITING_ESSAY.minWords
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">การเขียน · Task 2</div>
            <div className="plcInstruction">
              Write <strong>one paragraph</strong> in response to the question below.
            </div>
            <p className="plcQuestion">{PLACEMENT_WRITING_ESSAY.taskPrompt}</p>
            <textarea
              className="plcTextarea"
              value={paragraph}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [PLACEMENT_WRITING_ESSAY.id]: e.target.value }))}
              placeholder="เขียนย่อหน้าของคุณที่นี่ครับ"
            />
            <div className="plcNote" style={{ marginTop: 10 }}>
              {words} คำ {longEnough ? '' : `· ต้องอย่างน้อย ${PLACEMENT_WRITING_ESSAY.minWords} คำ`}
            </div>
            <div className="plcActions">
              <button type="button" className="plcBtn" disabled={!longEnough} onClick={() => goTo('writing-essay-marking')}>
                ส่งย่อหน้า
              </button>
            </div>
          </div>
        )
      }

      case 'writing-essay-marking':
        return (
          <div className="plcBox plcFade plcCentre">
            {PlacementArt.done}
            <h2>กำลังตรวจย่อหน้าของคุณ…</h2>
            <p className="plcLead">ระบบกำลังดูการลำดับความคิด คำศัพท์ และไวยากรณ์ระดับสูงครับ</p>
          </div>
        )

      case 'speaking-intro':
        return (
          <div className="plcBox plcFade">
            {PlacementArt.mic}
            <div className="plcEyebrow plcCentre">ทักษะที่ 4 จาก 4</div>
            <h2 className="plcCentre">การพูด</h2>
            <p className="plcLead plcCentre">ตอบด้วยเสียงของตัวเองให้ได้อย่างน้อยข้อละ 4 ประโยค ระบบตรวจเฉพาะไวยากรณ์และคำศัพท์ ไม่ได้ตรวจสำเนียงครับ</p>
            <div className="plcInstruction">
              You will answer <strong>4 questions</strong> — 2 from Part 1 and 2 from Part 3.<br />
              Speak naturally. There is no time limit to prepare.
            </div>
            <div className="plcActions"><button type="button" className="plcBtn" onClick={() => goTo('speaking-q')}>เริ่มข้อแรก</button></div>
          </div>
        )

      case 'speaking-q': {
        const question = PLACEMENT_SPEAKING_QUESTIONS[qi]
        const recorded = clips[qi]
        return (
          <div className="plcBox plcFade">
            <div className="plcEyebrow">การพูด · {question.part} · ข้อ {qi + 1} จาก {PLACEMENT_SPEAKING_QUESTIONS.length}</div>
            <p className="plcQuestion" style={{ fontSize: 'clamp(19px,3vw,24px)' }}>{question.question}</p>
            <p className="plcNote">{question.hintThai}</p>
            <div className="plcRec">
              {recording ? (
                <>
                  <span className="plcDot" />
                  <span className="plcNote">กำลังอัด {recSeconds} วินาที</span>
                  <button type="button" className="plcBtn isLine" onClick={stopRecording}>■ หยุดอัด</button>
                </>
              ) : recorded ? (
                <>
                  <audio controls src={recorded.url} />
                  <button type="button" className="plcBtn isLine" onClick={() => void startRecording()}>อัดใหม่</button>
                </>
              ) : (
                <button type="button" className="plcBtn isLine" onClick={() => void startRecording()}>🎙 เริ่มอัดเสียง</button>
              )}
            </div>
            {micError ? <div className="plcFb isNo">{micError}</div> : null}
            <div className="plcActions">
              <button
                type="button" className="plcBtn" disabled={!recorded || recording}
                onClick={() => (qi < PLACEMENT_SPEAKING_QUESTIONS.length - 1 ? goTo('speaking-q', qi + 1) : goTo('speaking-sending'))}
              >
                {qi === PLACEMENT_SPEAKING_QUESTIONS.length - 1 ? 'ส่งคำตอบทั้งหมด' : 'ข้อถัดไป'}
              </button>
            </div>
          </div>
        )
      }

      case 'speaking-sending':
        return (
          <div className="plcBox plcFade plcCentre">
            {PlacementArt.done}
            <h2>กำลังตรวจคำตอบของคุณ…</h2>
            <p className="plcLead">ระบบกำลังถอดเสียงและตรวจไวยากรณ์กับคำศัพท์ อาจใช้เวลาสักครู่ครับ</p>
          </div>
        )

      case 'report':
        return (
          <div className="plcLetter plcFade">
            <div className="plcFrom">ผลประเมินระดับ · English Plan</div>
            <div className="plcVerdict">
              <div className="plcNote" style={{ marginBottom: 2 }}>ระดับโดยประมาณของ {name || 'คุณ'}</div>
              <div className="plcVerdictNum">{overall}</div>
            </div>
            {/* The headline is an average, so a single collapsed skill can hide
                inside it. Name it outright rather than let the big number imply
                the student is ready. */}
            {dragging.length ? (
              <div className="plcDrag">
                <strong>ตัวเลขนี้เป็นค่าเฉลี่ยครับ</strong>
                <span>
                  {dragging.map((row) => `${row.skill} อยู่ที่ ${PLACEMENT_BAND_LABELS[row.band!]}`).join(' และ ')}
                  {' '}ซึ่งต่ำกว่าคะแนนรวมมาก ถ้าไปสอบจริงตอนนี้ คะแนน overall จะถูกทักษะนี้ดึงลงครับ
                </span>
              </div>
            ) : null}
            <p style={{ fontSize: 16.5, margin: '0 0 18px' }}>
              คุณ{name} ครับ — จากคำตอบทั้งหมดที่ส่งมา ระดับโดยประมาณของคุณอยู่ที่ <strong>{overall}</strong>
              {weakest ? <> โดยทักษะที่ควรเริ่มซ่อมก่อนคือ<strong>{weakest.skill}</strong> เพราะเป็นตัวที่ดึงคะแนนรวมลงมากที่สุดครับ</> : null}
            </p>

            <h2 style={{ fontSize: 19, marginTop: 26 }}>ผลรายทักษะ</h2>
            {rows.map((row) => (
              <div className="plcBandRow" key={row.skill}>
                <span className="plcSkill">{row.skill}</span>
                {pill(row.band)}
              </div>
            ))}

            {speakingReasons.length ? (
              <div style={{ marginTop: 22 }}>
                <div className="plcTag">เหตุผลของคะแนนการพูด</div>
                <ul className="plcReasons">{speakingReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
              </div>
            ) : null}
            {speakingPending ? <div className="plcFb isInfo">คำตอบส่วนการพูดถูกบันทึกไว้แล้ว ผู้สอนจะตรวจและส่งผลกลับไปครับ</div> : null}

            {essaySignals ? (
              <>
                <h2 style={{ fontSize: 19, marginTop: 30 }}>ย่อหน้าที่คุณเขียน</h2>
                <div className="plcEssayQuote">{answers[PLACEMENT_WRITING_ESSAY.id]}</div>
                {essaySignals.reasonsThai.length ? (
                  <div className="plcEssayVerdict">
                    <div className="plcTag">ทำไมยังไม่ถึง Band 7.0</div>
                    <ul className="plcReasons">
                      {essaySignals.reasonsThai.map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>
                    <div className="plcEssayCounts">
                      <span>tense / conjugation ผิด {essaySignals.tenseErrorCount} จุด</span>
                      <span>คำศัพท์ไม่เป็นธรรมชาติ {essaySignals.vocabularyIssueCount} จุด</span>
                      <span>คำเชื่อมที่ใช้ {essaySignals.transitionsUsed.length} คำ</span>
                      <span>ตรรกะ {essaySignals.logicIsSound ? 'สมเหตุสมผล' : 'ยังไม่รัดกุม'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="plcFb isInfo">
                    ย่อหน้านี้ไม่มีข้อผิดพลาดที่กั้นคุณจาก Band 7.0 เลยครับ — ทั้งไวยากรณ์ คำศัพท์ คำเชื่อม และการลำดับเหตุผลผ่านหมด
                  </div>
                )}
              </>
            ) : null}

            {wrong.length ? (
              <>
                <h2 style={{ fontSize: 19, marginTop: 30 }}>จุดที่ควรซ่อม</h2>
                <p className="plcNote">ดูไว้เพื่อรู้ว่าต้องแก้ตรงไหน ไม่ต้องจำคำตอบครับ</p>
                {wrong.map((item, index) => (
                  <div className="plcWrongItem" key={`${item.skill}-${index}`}>
                    <div className="plcTag">{item.skill}</div>
                    <p style={{ fontWeight: 600, margin: '6px 0 10px' }}>{item.question}</p>
                    <div className="plcFb isNo">ตอบว่า <strong>{item.given}</strong> · คำตอบที่ถูกคือ <strong>{item.answer}</strong></div>
                    <p className="plcNote" style={{ marginTop: 10 }}>{item.why}</p>
                  </div>
                ))}
              </>
            ) : null}

            <h2 style={{ fontSize: 19, marginTop: 30 }}>คอร์สที่เหมาะกับคุณ</h2>
            <p className="plcNote">{recommendation.headlineThai}</p>

            {recommendation.gaps.length ? (
              <div className="plcGaps">
                {recommendation.gaps.map((gap) => (
                  <div className="plcGap" key={gap.skillThai}>
                    <div className="plcGapHead">
                      <span className="plcGapSkill">{gap.skillThai}</span>
                      <span className="plcGapBand">{gap.bandThai}</span>
                    </div>
                    <p className="plcGapMissing">{gap.missingThai}</p>
                    <p className="plcGapLesson">
                      <span className="plcGapLessonTag">เรียนที่</span> {gap.courseThai} — {gap.lessonThai}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <a className="plcOffer" href={recommendation.primary.url} target="_blank" rel="noreferrer">
              <img className="plcOfferThumb" src={recommendation.primary.imageUrl} alt={recommendation.primary.title} />
              <div className="plcOfferBody">
                <div className="plcOfferTag">แนะนำสำหรับคุณ</div>
                <div className="plcOfferTitle">{recommendation.primary.title}</div>
                <div className="plcOfferPrice">{recommendation.primary.priceThb}</div>
                <p className="plcOfferWhy">{recommendation.primary.reasonThai}</p>
                <span className="plcOfferCta">ดูรายละเอียดคอร์ส →</span>
              </div>
            </a>

            <p className="plcNote" style={{ marginTop: 14 }}>
              อยากเทียบแพ็กเกจอื่นก่อนตัดสินใจ? <a href={recommendation.bundleUrl} target="_blank" rel="noreferrer">ดูแพ็กเกจ IELTS ทั้งหมด</a>
            </p>

            <div className="plcSign">
              ผลนี้มาจากแบบทดสอบสั้น ประเมินเทียบกับสถิติผลสอบจริงของนักเรียน English Plan ที่ผ่านมา
              ไม่ใช่คะแนนสอบอย่างเป็นทางการครับ นักเรียนของเราได้ Band 7 ขึ้นไปเดือนละ 10 คนขึ้นไป
              และทุกคอร์สมี feedback เป็นภาษาไทยจากพี่ดอยโดยตรงครับ
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="plc">
      {activeSkill === undefined ? null : (
        <div className="plcTop">
          <div className="plcTopInner">
            <div className="plcSegs">
              {SKILL_NAMES.map((skill, index) => (
                <span key={skill} className={`plcSeg ${index < activeSkill || activeSkill === 4 ? 'isDone' : ''}`}>
                  <i style={{ width: index === activeSkill ? '50%' : undefined }} />
                </span>
              ))}
            </div>
            <span className="plcTopLabel">{activeSkill === 4 ? 'ผลลัพธ์' : SKILL_NAMES[activeSkill]}</span>
          </div>
        </div>
      )}
      <main className="plcMain">
        <div className="plcPanel" key={`${screen}-${qi}`}>{renderScreen()}</div>
      </main>
    </div>
  )
}
