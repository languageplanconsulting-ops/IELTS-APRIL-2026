import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ielts-listening-evidence-tutorial-v1'

const TUTORIAL_STEPS = [
  {
    badge: 'Evidence Mode',
    title: 'ยินดีต้อนรับสู่โหมด Evidence',
    detail:
      'โหมดนี้ฝึกให้คุณหาหลักฐานจาก audioscript แล้วตอบคำถามให้ถูก — เหมือนสอบ IELTS จริง แต่มี feedback ช่วยให้เข้าใจว่าทำไมคำตอบนั้นถูก',
    icon: '◈'
  },
  {
    badge: 'Step 1',
    title: 'เลือกข้อคำถาม',
    detail: 'คลิกข้อที่ต้องการทางด้านขวา จากนั้นฟังเสียงหรืออ่านสคริปต์ทางซ้ายเพื่อหาคำตอบ',
    icon: '①'
  },
  {
    badge: 'Step 2',
    title: 'ไฮไลต์หลักฐานในสคริปต์',
    detail:
      'ลากเมาส์เลือกประโยคในสคริปต์ที่พิสูจน์คำตอบ ข้อความจะถูก highlight อัตโนมัติ — นี่คือ evidence ที่คุณต้องหา',
    icon: '②'
  },
  {
    badge: 'Step 3',
    title: 'เลือกคำตอบที่ถูกต้อง',
    detail: 'กดตัวเลือก A/B/C (หรือกรอกคำตอบ) ทางด้านขวา ทำครบทุกข้อให้มีทั้งคำตอบและ evidence',
    icon: '③'
  },
  {
    badge: 'Step 4',
    title: 'ส่งเมื่อครบทุกข้อ',
    detail:
      'กด Submit all answers เมื่อตอบครบ — ต้องถูกทั้งคำตอบและหลักฐานถึงจะผ่าน ถ้า evidence ผิด คลิกขวาที่ highlight แล้วลบออกเพื่อเลือกใหม่',
    icon: '✓'
  }
] as const

export type ListeningEvidenceTutorialProps = {
  open: boolean
  onClose: () => void
  onStepChange?: (step: number) => void
}

export function hasSeenListeningEvidenceTutorial() {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

export function markListeningEvidenceTutorialSeen() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // ignore storage failures
  }
}

export function ListeningEvidenceTutorial({ open, onClose, onStepChange }: ListeningEvidenceTutorialProps) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return undefined
    }

    setStep(0)
    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    onStepChange?.(step)
  }, [onStepChange, step])

  if (!open) return null

  const current = TUTORIAL_STEPS[step]
  const isLast = step === TUTORIAL_STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      markListeningEvidenceTutorialSeen()
      setVisible(false)
      window.setTimeout(onClose, 320)
      return
    }
    setStep((value) => value + 1)
  }

  const handleSkip = () => {
    markListeningEvidenceTutorialSeen()
    setVisible(false)
    window.setTimeout(onClose, 320)
  }

  return (
    <div
      className={`listeningEvidenceTutorialOverlay ${visible ? 'is-visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="listening-evidence-tutorial-title"
    >
      <button type="button" className="listeningEvidenceTutorialBackdrop" aria-label="ปิดคำแนะนำ" onClick={handleSkip} />

      <article className={`listeningEvidenceTutorialCard ${visible ? 'is-visible' : ''}`}>
        <div className="listeningEvidenceTutorialGlow" aria-hidden />
        <div className="listeningEvidenceTutorialScanline" aria-hidden />

        <header className="listeningEvidenceTutorialHeader">
          <span className="listeningEvidenceTutorialBadge">{current.badge}</span>
          <button type="button" className="listeningEvidenceTutorialSkip" onClick={handleSkip}>
            ข้าม
          </button>
        </header>

        <div className="listeningEvidenceTutorialBody" key={step}>
          <span className="listeningEvidenceTutorialIcon" aria-hidden>
            {current.icon}
          </span>
          <h2 id="listening-evidence-tutorial-title">{current.title}</h2>
          <p>{current.detail}</p>
        </div>

        <div className="listeningEvidenceTutorialSteps" aria-label="ขั้นตอนคำแนะนำ">
          {TUTORIAL_STEPS.map((item, index) => (
            <span
              key={item.badge}
              className={`listeningEvidenceTutorialDot ${index === step ? 'is-active' : ''} ${
                index < step ? 'is-done' : ''
              }`}
            />
          ))}
        </div>

        <footer className="listeningEvidenceTutorialFooter">
          <span>
            {step + 1}/{TUTORIAL_STEPS.length}
          </span>
          <button type="button" className="listeningEvidenceTutorialNext" onClick={handleNext}>
            {isLast ? 'เริ่มฝึกเลย →' : 'ถัดไป →'}
          </button>
        </footer>
      </article>
    </div>
  )
}
