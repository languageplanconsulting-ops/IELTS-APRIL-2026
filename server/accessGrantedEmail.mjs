// The email a student gets when their app access is switched on.
//
// The old one said only "Hi krub, Your access is granted for this app. Have a nice week!"
// with no link and no first step. On 18 Nov 2026, 33 of the 46 students with access had not
// opened the app once since 11 Aug. This version gives them one button, their login email,
// what to do if they have no password, and one tiny first task.
//
// Pure: no network, so scripts/validate-access-email.ts can check it.

export const DEFAULT_APP_URL = 'https://www.englishplan-ielts.com'

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

/** "12 ก.พ. 2027" in Bangkok time, or '' when there is no valid date. */
export const formatThaiDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'numeric', day: 'numeric' })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)])
  )
  return `${parts.day} ${THAI_MONTHS[parts.month - 1]} ${parts.year}`
}

const firstName = (learner) => {
  const name = String(learner?.full_name || '').trim()
  if (!name || name.includes('@')) return ''
  return name.split(/\s+/)[0]
}

export const buildAccessGrantedEmail = ({ learner, appUrl }) => {
  const url = String(appUrl || DEFAULT_APP_URL).trim().replace(/\/+$/, '') || DEFAULT_APP_URL
  const email = String(learner?.email || '').trim()
  const name = firstName(learner)
  const access = learner?.learner_access || {}
  const modules = Array.isArray(access.enabled_modules) ? access.enabled_modules : null
  const hasSpeaking = !modules || modules.includes('speaking')
  const speakingCredits = Math.max(0, Number(access.feedback_credits ?? 0) || 0)
  const mockCredits = Math.max(0, Number(access.full_mock_credits ?? 0) || 0)
  const expires = formatThaiDate(access.expires_at)

  const greeting = name ? `สวัสดีครับ คุณ${name}` : 'สวัสดีครับ'
  const subject = 'เข้าแอป English Plan ได้แล้วครับ — เริ่มฝึกได้เลยวันนี้'

  const firstStep = hasSpeaking
    ? 'ลองทำ Speaking Part 1 แค่ 1 หัวข้อ (ประมาณ 5 นาที) แล้วดูผลตรวจพร้อมจุดที่ควรแก้ได้ทันที'
    : 'เลือกบทเรียนแรกที่หน้าแรกของแอป แล้วลองทำ 1 ชุดก่อนครับ'

  const accessLines = []
  if (hasSpeaking && speakingCredits > 0) accessLines.push(`ตรวจ Speaking ได้ ${speakingCredits} ครั้ง`)
  if (hasSpeaking && mockCredits > 0) accessLines.push(`Full Mock ได้ ${mockCredits} ครั้ง`)
  if (expires) accessLines.push(`ใช้ได้ถึง ${expires}`)

  const button = (label) =>
    `<a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 26px;background:#004aad;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;">${escapeHtml(label)}</a>`

  const html = `
    <div style="font-family:Arial,'Noto Sans Thai',sans-serif;line-height:1.7;color:#172033;max-width:560px">
      <p style="font-size:16px;margin:0 0 12px;">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 18px;">บัญชีแอป <strong>English Plan</strong> ของคุณพร้อมใช้งานแล้วครับ</p>
      <p style="margin:0 0 22px;">${button('เข้าแอป English Plan')}</p>
      <div style="padding:14px 16px;border-radius:10px;background:#f4f7fc;margin:0 0 18px;">
        <p style="margin:0 0 6px;"><strong>เข้าสู่ระบบด้วยอีเมลนี้:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0;">ยังไม่มีรหัสผ่าน หรือจำไม่ได้? ที่หน้าเข้าสู่ระบบกด <strong>"ลืมรหัสผ่าน?"</strong> แล้วตั้งรหัสใหม่ได้เลยครับ</p>
      </div>
      <p style="margin:0 0 6px;"><strong>เริ่มตรงนี้ก่อน:</strong></p>
      <p style="margin:0 0 18px;">${escapeHtml(firstStep)}</p>
      ${
        accessLines.length
          ? `<p style="margin:0 0 18px;"><strong>สิทธิ์ของคุณ:</strong> ${escapeHtml(accessLines.join(' · '))}</p>`
          : ''
      }
      <p style="margin:0 0 18px;color:#52607a;">ใช้บนมือถือ: เปิดลิงก์ด้วย Safari หรือ Chrome แล้วกด "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen) ครั้งหน้าจะเปิดได้ในแตะเดียวครับ</p>
      <p style="margin:0;color:#52607a;">เข้าไม่ได้หรือมีปัญหา ทักแอดมินช่องทางเดียวกับที่สมัครคอร์สได้เลยครับ</p>
      <p style="margin:18px 0 0;color:#8a94a8;font-size:13px;">Your English Plan app access is ready: ${escapeHtml(url)}</p>
    </div>
  `

  const text = [
    greeting,
    '',
    'บัญชีแอป English Plan ของคุณพร้อมใช้งานแล้วครับ',
    `เข้าแอป: ${url}`,
    '',
    `เข้าสู่ระบบด้วยอีเมลนี้: ${email}`,
    'ยังไม่มีรหัสผ่าน หรือจำไม่ได้? ที่หน้าเข้าสู่ระบบกด "ลืมรหัสผ่าน?" แล้วตั้งรหัสใหม่ได้เลยครับ',
    '',
    `เริ่มตรงนี้ก่อน: ${firstStep}`,
    accessLines.length ? `สิทธิ์ของคุณ: ${accessLines.join(' · ')}` : '',
    '',
    'ใช้บนมือถือ: เปิดลิงก์ด้วย Safari หรือ Chrome แล้วกด "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)',
    'เข้าไม่ได้หรือมีปัญหา ทักแอดมินช่องทางเดียวกับที่สมัครคอร์สได้เลยครับ'
  ]
    .filter((line, index, lines) => line !== '' || lines[index - 1] !== '')
    .join('\n')
    .trim()

  return { subject, html, text }
}
