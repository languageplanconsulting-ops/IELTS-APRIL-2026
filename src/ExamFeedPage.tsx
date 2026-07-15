import './ExamFeedPage.css'
import type { ReactElement } from 'react'
import { WRITING_RECALL as writingRecall, WRITING_PREDICT as predictWriting, type ExamItem } from './writingExamRecalls'
import {
  LAST_UPDATED,
  CURRENT_MONTH,
  MONTHS,
  SPEAKING_RECALL as speakingRecall,
  SPEAKING_PREDICT as predictSpeaking
} from './examRecallData'

/**
 * Public SEO landing page: "ข้อสอบ IELTS ล่าสุด".
 * Shows recent forum-reported Speaking/Writing recalls + monthly predictions.
 * Data is curated from real test-taker reports (recalls), NOT official exams.
 * Speaking data lives in examRecallData.ts, Writing in writingExamRecalls.ts —
 * both are also consumed by scripts/build-seo-pages.mjs to keep the static
 * /th/ielts-exam-recall/ SEO page in sync with this in-app view.
 */

const BRAZIL_FISHING_POINTS: [number, number][] = [
  [10, 48.5],
  [40, 40.25],
  [70, 30.6],
  [100, 18.25]
]

function BrazilPieFishingExample() {
  return (
    <div className="efChartExample">
      <span className="efChartExampleTag">ตัวอย่างข้อมูล — ไม่ใช่ตัวเลขจากข้อสอบจริง (ผู้สอบจำได้แค่หัวข้อ ไม่ใช่ตัวเลขในกราฟ)</span>
      <div className="efChartExampleRow">
        <svg viewBox="0 0 110 110" className="efChartSvg" role="img" aria-label="ตัวอย่างพายชาร์ตรายได้บราซิลตามภาคเศรษฐกิจ ปี 2005">
          <path d="M55,55 L55,5 A50,50 0 0,1 79.09,11.19 Z" fill="var(--ef-yellow)" />
          <path d="M55,55 L79.09,11.19 A50,50 0 0,1 81.79,97.22 Z" fill="var(--ef-blue-bright)" />
          <path d="M55,55 L81.79,97.22 A50,50 0 1,1 55,5 Z" fill="var(--ef-blue)" />
        </svg>
        <div className="efChartLegend">
          <span><i style={{ background: 'var(--ef-blue)' }} />Services 59%</span>
          <span><i style={{ background: 'var(--ef-blue-bright)' }} />Industry 33%</span>
          <span><i style={{ background: 'var(--ef-yellow)' }} />Agriculture 8%</span>
        </div>
        <svg viewBox="0 0 110 75" className="efChartSvg efChartLine" role="img" aria-label="ตัวอย่างแนวโน้มรายได้ภาคประมงของบราซิล 1990 ถึง 2005">
          <polyline
            points={BRAZIL_FISHING_POINTS.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="var(--ef-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {BRAZIL_FISHING_POINTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill="var(--ef-blue)" />
          ))}
          <text x="6" y="72" fontSize="7" fill="var(--ef-muted)">1990</text>
          <text x="82" y="72" fontSize="7" fill="var(--ef-muted)">2005</text>
        </svg>
      </div>
      <span className="efChartCaption">รายได้ตามภาคเศรษฐกิจ ปี 2005 (ซ้าย) + แนวโน้มรายได้ภาคประมง 1990–2005 (ขวา)</span>
    </div>
  )
}

const EXAM_ITEM_CHARTS: Record<string, () => ReactElement> = {
  'brazil-pie-fishing': BrazilPieFishingExample
}

const renderItems = (items: ExamItem[], skill: 'sp' | 'wr') =>
  items.map((item, index) => {
    const ChartExample = item.chart ? EXAM_ITEM_CHARTS[item.chart] : undefined
    return (
    <div className="efItem" key={`${skill}-${index}`}>
      <span className="efItemTitle">
        {item.title}
        {item.isNew && <span className="efNewTag">ใหม่</span>}
      </span>
      {ChartExample && <ChartExample />}
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
    )
  })

export default function ExamFeedPage({ onOpenCourse }: { onOpenCourse: () => void }) {
  return (
    <section className="examFeed">
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
