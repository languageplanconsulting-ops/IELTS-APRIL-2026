import { useState, type ReactNode } from 'react'
import './SpeakingHabitDrills.css'
import { normalizeDrillAnswer, type SpeakingHabit, type SpeakingHabitDrill } from './speakingHabitTypes'

// "Mistake habits" — grammar mistake types a student keeps making across speaking reports.
// The server (server/speakingHabits.mjs) attaches them to a new report as `habitDrills`; this
// panel shows them FIRST and keeps the score locked until the student has typed every fix.

const readDone = (key: string): string[] => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

const writeDone = (key: string, ids: string[]) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    // Private mode / full storage: the drills still work, they just won't be remembered.
  }
}

function DrillBox({
  drill,
  done,
  onDone
}: {
  drill: SpeakingHabitDrill
  done: boolean
  onDone: () => void
}) {
  const [value, setValue] = useState('')
  const [tries, setTries] = useState(0)
  const [wrong, setWrong] = useState(false)

  if (done) {
    return (
      <div className="habitDrill is-done">
        <p className="habitDrillLine">
          <span className="habitDrillTag is-bad">คุณพูดว่า</span>
          <s>{drill.originalText}</s>
        </p>
        <p className="habitDrillLine">
          <span className="habitDrillTag is-good">✓ แก้แล้ว</span>
          <strong>{drill.correctedText}</strong>
        </p>
      </div>
    )
  }

  const check = () => {
    if (normalizeDrillAnswer(value) && normalizeDrillAnswer(value) === normalizeDrillAnswer(drill.correctedText)) {
      setWrong(false)
      onDone()
      return
    }
    setTries((count) => count + 1)
    setWrong(true)
  }

  return (
    <div className="habitDrill">
      <p className="habitDrillLine">
        <span className="habitDrillTag is-bad">คุณพูดว่า</span>
        <s>{drill.originalText}</s>
      </p>
      <label className="habitDrillPrompt">
        พิมพ์ประโยคนี้ใหม่ให้ถูก
        <span className="habitDrillInputRow">
          <input
            type="text"
            value={value}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="พิมพ์ประโยคที่ถูกต้องตรงนี้"
            onChange={(event) => {
              setValue(event.target.value)
              setWrong(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                check()
              }
            }}
          />
          <button type="button" className="habitDrillCheck" onClick={check} disabled={!value.trim()}>
            ตรวจ
          </button>
        </span>
      </label>
      {wrong ? (
        <p className="habitDrillWrong" role="status">
          {tries >= 2 ? 'ยังไม่ถูก — ดูคำตอบด้านล่าง แล้วพิมพ์ตามให้ถูกเพื่อไปต่อ' : 'ยังไม่ถูก ลองอ่านกฎด้านบนอีกครั้ง แล้วแก้ใหม่'}
        </p>
      ) : null}
      {tries >= 2 ? (
        <div className="habitDrillAnswer">
          <p className="habitDrillLine">
            <span className="habitDrillTag is-good">คำตอบ</span>
            <strong>{drill.correctedText}</strong>
          </p>
          {drill.reasonThai ? <p className="habitDrillReason">{drill.reasonThai}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Shows the student's repeated mistakes first. Until every drill is typed correctly, the rest of
 * the report (`children`, which holds the band score) stays hidden. `bypass` (admins) always
 * shows the report.
 */
export function SpeakingHabitGate({
  habits,
  storageKey,
  bypass = false,
  children
}: {
  habits: SpeakingHabit[] | undefined
  storageKey: string
  bypass?: boolean
  children: ReactNode
}) {
  const valid = (Array.isArray(habits) ? habits : []).filter((habit) => Array.isArray(habit?.drills) && habit.drills.length)
  const [done, setDone] = useState<string[]>(() => readDone(storageKey))

  if (!valid.length) return <>{children}</>

  const drillIds = valid.flatMap((habit) => habit.drills.map((drill) => `${habit.type}:${drill.id}`))
  const doneCount = drillIds.filter((id) => done.includes(id)).length
  const allDone = doneCount === drillIds.length
  const unlocked = bypass || allDone

  const markDone = (id: string) => {
    setDone((current) => {
      if (current.includes(id)) return current
      const next = [...current, id]
      writeDone(storageKey, next)
      return next
    })
  }

  return (
    <>
      <section className={`habitGate ${allDone ? 'is-complete' : ''}`.trim()} aria-label="ข้อผิดพลาดที่ผิดซ้ำ">
        <header className="habitGateHead">
          <p className="habitGateEyebrow">🔁 ผิดซ้ำเป็นนิสัย</p>
          <h3>แก้ให้ครบ {drillIds.length} ข้อ เพื่อดูคะแนน</h3>
          <p className="habitGateLead">
            ข้อผิดพลาดเหล่านี้ขึ้นในรายงานของคุณหลายครั้งแล้ว การสอบซ้ำอย่างเดียวไม่ช่วยให้หาย — อ่านกฎ ดูตัวอย่าง
            แล้วพิมพ์ประโยคของคุณใหม่ให้ถูก
          </p>
          {bypass ? <p className="habitGateAdmin">แอดมินเห็นคะแนนได้เลย · นักเรียนต้องแก้ให้ครบก่อน</p> : null}
          <div className="habitGateProgress" aria-label={`แก้แล้ว ${doneCount} จาก ${drillIds.length}`}>
            <span style={{ width: `${Math.round((doneCount / drillIds.length) * 100)}%` }} />
          </div>
          <p className="habitGateCount">
            แก้แล้ว {doneCount} / {drillIds.length}
          </p>
        </header>

        <ol className="habitGateList">
          {valid.map((habit, index) => (
            <li key={habit.type} className="habitCard">
              <div className="habitCardHead">
                <span className="habitCardNum">{index + 1}</span>
                <div>
                  <p className="habitCardLabel">{habit.label}</p>
                  <p className="habitCardSeen">
                    ผิดซ้ำใน {habit.seenInReports} จาก {habit.outOfReports} รายงานล่าสุด
                  </p>
                </div>
              </div>
              <p className="habitCardRule">
                <strong>กฎ:</strong> {habit.ruleTh}
              </p>
              <div className="habitCardExample">
                <p>
                  <span className="habitDrillTag is-bad">✗</span> {habit.exampleWrong}
                </p>
                <p>
                  <span className="habitDrillTag is-good">✓</span> {habit.exampleRight}
                </p>
              </div>
              {habit.drills.map((drill) => {
                const id = `${habit.type}:${drill.id}`
                return <DrillBox key={id} drill={drill} done={done.includes(id)} onDone={() => markDone(id)} />
              })}
            </li>
          ))}
        </ol>

        {allDone ? (
          <p className="habitGateUnlocked" role="status">
            🎉 ปลดล็อกแล้ว! เลื่อนลงไปดูคะแนนและรายงานเต็มได้เลย
          </p>
        ) : (
          !bypass && (
            <p className="habitGateLocked">
              🔒 คะแนนและรายงานฉบับเต็มจะเปิดเมื่อแก้ครบ ({drillIds.length - doneCount} ข้อที่เหลือ)
            </p>
          )
        )}
      </section>
      {unlocked ? children : null}
    </>
  )
}
