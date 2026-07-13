import './ExamFeedPage.css'
import {
  WRITING_RECALL as writingRecall,
  WRITING_PREDICT as predictWriting,
  type ExamItem
} from './writingExamRecalls'

/**
 * Admin-only SEO landing page: "ข้อสอบ IELTS ล่าสุด".
 * Shows recent forum-reported Speaking/Writing recalls + monthly predictions.
 * Data is curated from real test-taker reports (recalls), NOT official exams.
 * Not yet visible to learners — gated behind activePage === 'examfeed' + admin role.
 * Writing recall/prediction data lives in writingExamRecalls.ts (shared with WritingGuidePage's "latest" hub screens).
 */

const LAST_UPDATED = '21 มิถุนายน 2026'
const CURRENT_MONTH = 'มิถุนายน 2026'

const MONTHS = ['มิถุนายน 2026', 'พฤษภาคม 2026', 'เมษายน 2026', 'มีนาคม 2026', 'กุมภาพันธ์ 2026']

const speakingRecall: ExamItem[] = [
  {
    tag: 'Part 2',
    title: 'Describe something you did in your study or work that made you feel confident.',
    bullets: ['When and where it happened', 'What you did', 'Why it made you feel confident'],
    meta: 'มิ.ย. 2026 · เยอรมนี',
    isNew: true
  },
  {
    tag: 'Part 2',
    title: 'Describe something you taught to a friend or relative.',
    bullets: ['What you taught', 'When it was', 'How long it was for', 'How you felt about it'],
    meta: 'มิ.ย. 2026 · นิวซีแลนด์',
    isNew: true
  },
  {
    tag: 'Part 2',
    title: 'Describe an indoor or outdoor place where it is easy for you to study.',
    bullets: ['Where it is', 'What it is like', 'When you go there', 'Why you like studying there'],
    meta: 'มิ.ย. 2026 · เวียดนาม'
  },
  {
    tag: 'Part 2',
    title: 'Describe a crowded place you have visited.',
    bullets: ['When you went there', 'Who you went with', 'How you felt about being there'],
    meta: 'มิ.ย. 2026 · สเปน'
  },
  {
    tag: 'Part 1',
    title: 'Weather & climate',
    bullets: [
      'What is the weather like where you live?',
      'Do you prefer cold or hot weather?',
      'Do you check the weather forecast? How often?',
      'What do you think are the effects of climate change recently?'
    ],
    meta: 'มิ.ย. 2026 · สวีเดน / เวียดนาม'
  },
  {
    tag: 'Part 3',
    title: 'Confidence (follow-up discussion)',
    bullets: [
      'Why do so many people lack confidence these days?',
      'Are children of confident parents also confident?',
      'What can teachers do to make studying more interesting?',
      'How can a person become more confident?'
    ],
    meta: 'มิ.ย. 2026 · เยอรมนี'
  }
]

const predictSpeaking: ExamItem[] = [
  {
    tag: 'Part 2',
    title: 'Describe an important old thing your family has kept for a long time.',
    meta: 'แนวโน้มสูง'
  },
  {
    tag: 'Part 2',
    title: 'Describe a book you read that you found useful.',
    meta: 'แนวโน้มสูง'
  },
  {
    tag: 'Part 2',
    title: 'Describe a person you know who enjoys working for a family business.',
    meta: 'ควรเตรียม'
  },
  {
    tag: 'Part 2',
    title: 'Describe something you can’t live without (not a phone or computer).',
    meta: 'พบบ่อย'
  }
]

const renderItems = (items: ExamItem[], skill: 'sp' | 'wr') =>
  items.map((item, index) => (
    <div className="efItem" key={`${skill}-${index}`}>
      <span className="efItemTitle">
        {item.title}
        {item.isNew && <span className="efNewTag">ใหม่</span>}
      </span>
      {item.bullets && (
        <ul className="efBullets">
          {item.bullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex}>{bullet}</li>
          ))}
        </ul>
      )}
      <span className="efItemMeta">
        <span className={`efTag efTag-${skill}`}>{item.tag}</span>
        {item.meta}
      </span>
    </div>
  ))

export default function ExamFeedPage({ onOpenCourse }: { onOpenCourse: () => void }) {
  return (
    <section className="examFeed">
      <div className="efAdminFlag">
        🔒 หน้านี้เห็นเฉพาะแอดมิน — ผู้เรียนยังไม่เห็น (กำลังจัดทำเนื้อหา)
      </div>

      {/* HERO */}
      <div className="efHero">
        <span className="efFreshness">
          <span className="efDot" /> อัปเดตล่าสุด {LAST_UPDATED} · อัปเดตทุกสัปดาห์
        </span>
        <span className="efEyebrow">แหล่งรวมข้อสอบ IELTS ที่คนไทยไว้ใจ</span>
        <h1 className="efTitleMain">
          ข้อสอบ IELTS ล่าสุด
          <br />
          <span className="efHl">Speaking &amp; Writing {CURRENT_MONTH}</span>
        </h1>
        <p className="efLead">
          รวมหัวข้อที่ผู้สอบจริงเจอในเดือนนี้ พร้อม “เก็งข้อสอบ” เดือนหน้า คัดกรองและอัปเดตทุกสัปดาห์โดยทีม
          English Plan เพื่อคนไทยทุกคน
        </p>
        <div className="efTrustRow">
          <span className="efTpill efTpill-g">✓ จากผู้สอบจริง</span>
          <span className="efTpill efTpill-y">✓ อัปเดตทุกสัปดาห์</span>
          <span className="efTpill efTpill-b">✓ ฟรี ไม่มีค่าใช้จ่าย</span>
        </div>
        <div className="efHeroCta">
          <a className="efBtn efBtn-primary" href="#ef-latest">
            ดูหัวข้อล่าสุด
          </a>
          <button className="efBtn efBtn-ghost" type="button" onClick={onOpenCourse}>
            ดูคอร์สเรียน
          </button>
        </div>
      </div>

      {/* MONTH NAV */}
      <div className="efMonthNav">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            type="button"
            className={`efMonthChip ${index === 0 ? 'on' : ''}`.trim()}
          >
            {month}
            {index === 0 && <span className="efMonthNew">ใหม่</span>}
          </button>
        ))}
        <button type="button" className="efMonthChip">
          ดูทุกเดือน →
        </button>
      </div>

      {/* RECALL */}
      <div className="efBlock" id="ef-latest">
        <h2 className="efSecTitle">หัวข้อที่เพิ่งออกสอบ — {CURRENT_MONTH}</h2>
        <p className="efSecLead">รายงานจากผู้สอบจริงในฟอรั่มและกลุ่มติว · ไม่ใช่ข้อสอบทางการ</p>
        <div className="efGrid">
          <div className="efCard">
            <div className="efCardTop">
              <span className="efBadge efBadge-sp">🗣️ Speaking</span>
              <span className="efBadge efBadge-date">Part 1 · 2 · 3</span>
            </div>
            <h3 className="efCardTitle">หัวข้อ IELTS Speaking ล่าสุด</h3>
            {renderItems(speakingRecall, 'sp')}
          </div>
          <div className="efCard">
            <div className="efCardTop">
              <span className="efBadge efBadge-wr">✍️ Writing</span>
              <span className="efBadge efBadge-date">Task 1 · 2</span>
            </div>
            <h3 className="efCardTitle">โจทย์ IELTS Writing ล่าสุด</h3>
            {renderItems(writingRecall, 'wr')}
          </div>
        </div>
      </div>

      {/* PREDICTION */}
      <div className="efBlock efPredict">
        <h2 className="efSecTitle">เก็งข้อสอบ IELTS เดือนนี้</h2>
        <p className="efSecLead">
          แนวโน้มหัวข้อที่มีโอกาสออกสอบ วิเคราะห์จากสถิติย้อนหลัง · เป็นการคาดการณ์ ไม่ใช่ข้อสอบจริง
        </p>
        <div className="efGrid">
          <div className="efCard">
            <div className="efCardTop">
              <span className="efBadge efBadge-sp">🗣️ Speaking</span>
              <span className="efBadge efBadge-date">เก็ง</span>
            </div>
            <h3 className="efCardTitle">แนวข้อสอบ Speaking ที่ควรเตรียม</h3>
            {renderItems(predictSpeaking, 'sp')}
          </div>
          <div className="efCard">
            <div className="efCardTop">
              <span className="efBadge efBadge-wr">✍️ Writing</span>
              <span className="efBadge efBadge-date">เก็ง</span>
            </div>
            <h3 className="efCardTitle">แนวข้อสอบ Writing ที่ควรเตรียม</h3>
            {renderItems(predictWriting, 'wr')}
          </div>
        </div>
      </div>

      {/* TRUST */}
      <div className="efTrust">
        <div className="efAva">EP</div>
        <div>
          <h3>ทำไมต้องเชื่อ English Plan?</h3>
          <p>
            เราเก็บข้อมูลหัวข้อจากผู้สอบจริงทั่วไทย ตรวจสอบและคัดกรองโดยทีมครู IELTS ที่สอนมากว่า 10 ปี
            และเข้าใจข้อสอบแนวใหม่ — ไม่ใช่ข้อมูลที่คัดลอกต่อ ๆ กันมา
          </p>
          <div className="efTrustNums">
            <div>
              <b>248+</b>
              <small>หัวข้อในคลัง</small>
            </div>
            <div>
              <b>ทุกสัปดาห์</b>
              <small>อัปเดตสม่ำเสมอ</small>
            </div>
            <div>
              <b>จากผู้สอบจริง</b>
              <small>ไม่ใช่ AI สุ่ม</small>
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL LEAD MAGNET */}
      <div className="efEmail">
        <h3>รับหัวข้อข้อสอบ IELTS ล่าสุดทางอีเมล — ฟรี</h3>
        <p>ส่งหัวข้อ Speaking &amp; Writing ที่เพิ่งออกสอบให้คุณทุกสัปดาห์ ก่อนใคร</p>
        <form
          className="efEmailForm"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <input type="email" placeholder="กรอกอีเมลของคุณ" aria-label="อีเมล" />
          <button className="efBtn efBtn-yellow" type="submit">
            รับฟรีทุกสัปดาห์
          </button>
        </form>
      </div>

      {/* COURSE CTA */}
      <div className="efCtaBand">
        <h3>อยากได้คำตอบ Band 7+ ของหัวข้อเหล่านี้?</h3>
        <p>เรียนกับ English Plan แล้วฝึกตอบข้อสอบแนวล่าสุดพร้อมเฉลยละเอียด เริ่มฟรีบทเรียนแรก</p>
        <button className="efBtn efBtn-yellow" type="button" onClick={onOpenCourse}>
          เริ่มเรียน IELTS วันนี้
        </button>
      </div>

      {/* FAQ */}
      <div className="efFaq">
        <h2 className="efSecTitle">คำถามที่พบบ่อย</h2>
        <div className="efFaqItem">
          <b>ข้อสอบ IELTS เดือนนี้ออกอะไรบ้าง?</b>
          <p>
            หัวข้อ Speaking และ Writing ที่ผู้สอบรายงานในเดือน {CURRENT_MONTH} ดูได้ในหัวข้อ “หัวข้อที่เพิ่งออกสอบ”
            ด้านบน อัปเดตทุกสัปดาห์
          </p>
        </div>
        <div className="efFaqItem">
          <b>หัวข้อเหล่านี้มาจากไหน เชื่อถือได้ไหม?</b>
          <p>
            มาจากผู้สอบจริงที่แชร์ประสบการณ์ในฟอรั่มและกลุ่มติว IELTS ทีมเราคัดกรองและรวบรวมให้ —
            ไม่ใช่ข้อสอบทางการจาก British Council หรือ IDP
          </p>
        </div>
        <div className="efFaqItem">
          <b>“เก็งข้อสอบ” แม่นแค่ไหน?</b>
          <p>
            เป็นการคาดการณ์จากสถิติและแนวโน้มย้อนหลัง ใช้เพื่อเตรียมตัวให้ครอบคลุม
            ไม่ได้รับประกันว่าจะออกตรงทุกข้อ
          </p>
        </div>
        <div className="efFaqItem">
          <b>อัปเดตบ่อยแค่ไหน?</b>
          <p>เราอัปเดตหัวข้อใหม่ทุกสัปดาห์ และสรุปภาพรวมรายเดือน สมัครรับทางอีเมลเพื่อไม่พลาด</p>
        </div>
      </div>

      <p className="efDisclaimer">
        📌 หมายเหตุ: หัวข้อทั้งหมดมาจากการรายงานของผู้สอบจริงในฟอรั่มและโซเชียล ไม่ใช่ข้อสอบทางการจาก British
        Council หรือ IDP — ใช้เพื่อการเตรียมตัวฝึกฝนเท่านั้น
      </p>
    </section>
  )
}
