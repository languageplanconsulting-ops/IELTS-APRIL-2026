import assert from 'node:assert/strict'
import { DEFAULT_APP_URL, buildAccessGrantedEmail, formatThaiDate } from '../server/accessGrantedEmail.mjs'
import { SPEAKING_CREDIT_LOW_AT, formatStudentCreditChip, getSpeakingCreditState } from '../src/speakingCredits'

// ── access email ───────────────────────────────────────────────────────────────────────────
const learner = {
  email: 'student@example.com',
  full_name: 'Jeans Example',
  learner_access: {
    feedback_credits: 20,
    full_mock_credits: 10,
    expires_at: '2027-02-11T09:00:00Z',
    enabled_modules: ['speaking', 'reading', 'listening']
  }
}
const email = buildAccessGrantedEmail({ learner, appUrl: 'https://www.englishplan-ielts.com/' })

assert.match(email.subject, /English Plan/)
assert.ok(email.html.includes('href="https://www.englishplan-ielts.com"'), 'The button must link to the app (no trailing slash).')
assert.ok(email.html.includes('เข้าแอป English Plan'), 'The button label is in Thai.')
assert.ok(email.html.includes('student@example.com'), 'The login email is shown.')
assert.ok(email.html.includes('ลืมรหัสผ่าน?'), 'It names the real "ลืมรหัสผ่าน?" button for students with no password.')
assert.ok(email.html.includes('Speaking Part 1'), 'A Speaking student gets a Speaking first step.')
assert.ok(email.html.includes('ตรวจ Speaking ได้ 20 ครั้ง'), 'Credits are listed.')
assert.ok(email.html.includes('Full Mock ได้ 10 ครั้ง'))
assert.ok(email.html.includes('ใช้ได้ถึง 11 ก.พ. 2027'), 'The expiry date is in Thai, Bangkok time.')
assert.ok(email.html.includes('คุณJeans'), 'It greets by first name.')
assert.ok(!/ค่ะ/.test(email.html + email.text), 'Polite male register only (ครับ, never ค่ะ).')
assert.ok(email.text.includes('https://www.englishplan-ielts.com'), 'The plain-text version has the link too.')
assert.ok(!/\n\n\n/.test(email.text), 'No triple blank lines in the text version.')

// No name, no credits, no expiry, no Speaking module.
const bare = buildAccessGrantedEmail({
  learner: { email: 'x@example.com', full_name: 'x@example.com', learner_access: { enabled_modules: ['reading'] } },
  appUrl: ''
})
assert.ok(bare.html.includes(`href="${DEFAULT_APP_URL}"`), 'Falls back to the live app URL.')
assert.ok(bare.html.includes('สวัสดีครับ</p>'), 'An email address is never used as a first name.')
assert.ok(!bare.html.includes('สิทธิ์ของคุณ'), 'No empty credits line.')
assert.ok(!bare.html.includes('Speaking Part 1'), 'A Reading-only student is not told to do Speaking.')

// Names are escaped.
const nasty = buildAccessGrantedEmail({ learner: { email: 'a@b.co', full_name: '<script>alert(1)</script>' }, appUrl: '' })
assert.ok(!nasty.html.includes('<script>'), 'HTML in a name must be escaped.')

assert.equal(formatThaiDate('2026-12-31T20:00:00Z'), '1 ม.ค. 2027', 'Dates use Bangkok time (UTC+7).')
assert.equal(formatThaiDate('nonsense'), '')
assert.equal(formatThaiDate(null), '')

// ── speaking credits ───────────────────────────────────────────────────────────────────────
const state = (feedbackRemaining: number, fullMockRemaining = 10, testMode = 'part1', role: string | null = 'student') =>
  getSpeakingCreditState({ role, feedbackRemaining, fullMockRemaining, testMode })

assert.equal(state(20)?.kind, 'ok')
assert.match(state(20)!.messageTh, /เหลือ 20 ครั้ง/)
assert.equal(state(SPEAKING_CREDIT_LOW_AT + 1)?.kind, 'ok')
assert.equal(state(SPEAKING_CREDIT_LOW_AT)?.kind, 'low', '3 left is a warning.')
assert.equal(state(1)?.kind, 'low')
assert.equal(state(0)?.kind, 'out', '0 left blocks the start.')
assert.equal(state(-4)?.kind, 'out')
assert.equal(state(Number.NaN)?.kind, 'out')
assert.match(state(0)!.messageTh, /ยังเริ่มข้อสอบไม่ได้/)
assert.equal(state(5, 0, 'full')?.kind, 'out', 'A full mock needs a full-mock credit too.')
assert.equal(state(5, 2, 'full')?.remaining, 2, 'A full mock is limited by the smaller of the two.')
assert.match(state(5, 2, 'full')!.messageTh, /Full Mock/)
assert.equal(state(0, 10, 'part1', 'admin'), null, 'Admins are never blocked.')
assert.equal(state(0, 10, 'full', 'trial'), null, 'The one-time trial keeps its own screen.')
assert.equal(state(0, 10, 'part1', null), null)

assert.equal(
  formatStudentCreditChip({ name: 'Jeans', feedbackRemaining: 5, fullMockRemaining: 10 }),
  'Jeans · สิทธิ์ตรวจ Speaking 5 ครั้ง · Full Mock 10 ครั้ง'
)
assert.equal(formatStudentCreditChip({ name: '', feedbackRemaining: 0, fullMockRemaining: 0 }), 'สิทธิ์ตรวจ Speaking 0 ครั้ง · Full Mock 0 ครั้ง')

console.log('Access email + speaking credit validation passed.')
