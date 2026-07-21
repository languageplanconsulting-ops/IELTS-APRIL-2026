import { useEffect, useState } from 'react'

export type NotebookCelebration = {
  /** New id each save so the animation restarts even on rapid repeat saves. */
  id: number
  /** Viewport coordinates the note flies FROM (the clicked button). */
  x: number
  y: number
  /** Optional custom headline; defaults to the "don't forget to revise" line. */
  message?: string
}

type Props = {
  celebration: NotebookCelebration | null
  onDone: () => void
}

const CONFETTI = ['#004aad', '#ffcc00', '#22c55e', '#f97316', '#e11d48', '#0ea5e9']

/**
 * A one-shot celebration: a sticky note lifts off from the save button, arcs up
 * into the Notebook (top-right), a confetti burst fires, and a reassuring Thai
 * line reminds the learner to come back and revise. Purely decorative and
 * self-dismissing — never blocks interaction.
 */
export function NotebookSaveCelebration({ celebration, onDone }: Props) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!celebration) return
    setTick((value) => value + 1)
    const timer = window.setTimeout(onDone, 2100)
    return () => window.clearTimeout(timer)
  }, [celebration, onDone])

  if (!celebration) return null

  // Fly toward the Notebook tab, which sits at the top-right of the app chrome.
  const targetX = window.innerWidth - 56
  const targetY = 64
  const flyStyle = {
    left: `${celebration.x}px`,
    top: `${celebration.y}px`,
    // Custom props consumed by the keyframes in App.css.
    ['--fly-dx' as string]: `${targetX - celebration.x}px`,
    ['--fly-dy' as string]: `${targetY - celebration.y}px`
  } as React.CSSProperties

  return (
    <div className="nbCelebrateLayer" aria-hidden="true" key={tick}>
      <div className="nbCelebrateNote" style={flyStyle}>
        <span className="nbCelebrateNoteIcon">📒</span>
      </div>

      <div className="nbCelebrateBurst" style={{ left: `${celebration.x}px`, top: `${celebration.y}px` }}>
        {CONFETTI.map((color, index) => (
          <span
            key={index}
            className="nbCelebrateConfetti"
            style={
              {
                background: color,
                ['--c-angle' as string]: `${(360 / CONFETTI.length) * index}deg`
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="nbCelebrateToast" role="status">
        <span className="nbCelebrateToastSpark">🎉</span>
        <div>
          <p className="nbCelebrateToastTitle">บันทึกลง Notebook แล้ว!</p>
          <p className="nbCelebrateToastText">{celebration.message || 'อย่าลืมกลับมาทบทวนทีหลังนะครับ 📚'}</p>
        </div>
      </div>
    </div>
  )
}
