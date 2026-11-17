/**
 * Speaking credit warning shown before a student starts a test.
 *
 * Every graded test uses 1 feedback credit (a full mock also uses 1 full-mock credit), but the
 * app used to check only when the finished recording was submitted. A student at 0 recorded a
 * whole test and then saw an error. The 18 Nov 2026 audit found the heaviest user stopped at 0
 * credits after 31 tests. Now the warning sits on the screen every test passes through, and
 * a student at 0 can't start.
 */
export const SPEAKING_CREDIT_LOW_AT = 3

export type SpeakingCreditState = {
  kind: 'ok' | 'low' | 'out'
  remaining: number
  usesFullMock: boolean
  messageTh: string
}

export const getSpeakingCreditState = ({
  role,
  feedbackRemaining,
  fullMockRemaining,
  testMode
}: {
  role: string | undefined | null
  feedbackRemaining: number
  fullMockRemaining: number
  testMode: string
}): SpeakingCreditState | null => {
  // Admins have no limit, and the one-time trial has its own screen.
  if (role !== 'student') return null
  const usesFullMock = testMode === 'full'
  const feedback = Math.max(0, Math.floor(Number(feedbackRemaining) || 0))
  const mock = Math.max(0, Math.floor(Number(fullMockRemaining) || 0))
  const remaining = usesFullMock ? Math.min(feedback, mock) : feedback
  const what = usesFullMock ? 'สิทธิ์ Full Mock' : 'สิทธิ์ตรวจ Speaking'

  if (remaining <= 0) {
    return {
      kind: 'out',
      remaining: 0,
      usesFullMock,
      messageTh: `${what}ของคุณหมดแล้วครับ เลยยังเริ่มข้อสอบไม่ได้ (จะได้ไม่เสียเวลาพูดแล้วตรวจไม่ได้) ทักแอดมินเพื่อขอเติมสิทธิ์ก่อนนะครับ`
    }
  }
  if (remaining <= SPEAKING_CREDIT_LOW_AT) {
    return {
      kind: 'low',
      remaining,
      usesFullMock,
      messageTh: `เหลือ${what}อีก ${remaining} ครั้งเท่านั้นครับ ข้อสอบนี้ใช้ 1 ครั้ง ถ้าอยากฝึกต่อ ทักแอดมินเพื่อขอเติมได้เลย`
    }
  }
  return {
    kind: 'ok',
    remaining,
    usesFullMock,
    messageTh: `ข้อสอบนี้ใช้${what} 1 ครั้ง · เหลือ ${remaining} ครั้ง`
  }
}

/** Short credit line for the top bar, in plain Thai. */
export const formatStudentCreditChip = ({
  name,
  feedbackRemaining,
  fullMockRemaining
}: {
  name: string
  feedbackRemaining: number
  fullMockRemaining: number
}) => {
  const feedback = Math.max(0, Math.floor(Number(feedbackRemaining) || 0))
  const mock = Math.max(0, Math.floor(Number(fullMockRemaining) || 0))
  const who = String(name || '').trim()
  return `${who ? `${who} · ` : ''}สิทธิ์ตรวจ Speaking ${feedback} ครั้ง · Full Mock ${mock} ครั้ง`
}
