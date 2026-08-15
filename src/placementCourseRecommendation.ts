/**
 * Turning a placement result into a course recommendation.
 *
 * The report ends by telling the student what to buy, which is only worth
 * anything if the choice is defensible. So each recommendation names the exact
 * skills that fell short, what the student cannot do yet at that band, and the
 * lesson in the recommended course that covers it. The pick is derived from the
 * gaps, never from price.
 *
 * Course names, prices, thumbnails and lesson titles are taken from
 * language-plan.com. If the site changes, change this file — a wrong price or an
 * invented lesson name in a report is worse than saying nothing.
 */
import type { PlacementBandKey } from './placementTestData'

const SITE = 'https://www.language-plan.com'
/**
 * Thumbnails are served from our own /public rather than hotlinked from
 * Thinkific: the course platform can rename or move an asset at any time, and a
 * broken image in the one card meant to sell the course is the worst place for
 * it. Source files are the same 740x420 artwork used on the course pages.
 */
const THUMB = '/course-thumbnails'

export type SkillKey = 'reading' | 'listening' | 'writing' | 'speaking'

export type CourseOffer = {
  title: string
  priceThb: string
  url: string
  imageUrl: string
  reasonThai: string
}

/** What the student cannot do yet, and where in the course it is taught. */
export type SkillGap = {
  skillThai: string
  bandThai: string
  missingThai: string
  lessonThai: string
  courseThai: string
}

export type Recommendation = {
  headlineThai: string
  primary: CourseOffer
  gaps: SkillGap[]
  bundleUrl: string
}

const COURSES = {
  writing: {
    title: 'IELTS Academic Writing — Intensive',
    priceThb: '฿4,990',
    url: `${SITE}/courses/ielts-writing-5`,
    imageUrl: `${THUMB}/writing-intensive.png`
  },
  reading: {
    title: 'Intensive Academic Reading for IELTS',
    priceThb: '฿3,990',
    url: `${SITE}/courses/intensive-academic-reading-for-ielts`,
    imageUrl: `${THUMB}/reading-intensive.png`
  },
  listening: {
    title: 'Listening for Band 7',
    priceThb: '฿1,990',
    url: `${SITE}/courses/listening-for-band-7`,
    imageUrl: `${THUMB}/listening-band7.png`
  },
  speaking: {
    title: 'Speaking Intensive for IELTS',
    priceThb: '฿2,990',
    url: `${SITE}/courses/0-day-speaking-challenge-for-ielts`,
    imageUrl: `${THUMB}/speaking-intensive.png`
  }
} as const

/**
 * Bundles reuse a course thumbnail rather than inventing a graphic. The 6-month
 * options already include the grammar work, which is why no separate foundation
 * course is ever recommended alongside them.
 */
const BUNDLES = {
  allSkills: {
    title: 'All Skills Package — ครบทั้ง 4 ทักษะ',
    priceThb: '฿7,990 (3 เดือน) / ฿8,990 (6 เดือน)',
    url: `${SITE}/pages/ielts-all-skills`,
    imageUrl: `${THUMB}/writing-intensive.png`
  },
  threeSkills: {
    title: '3 Skills Package',
    priceThb: '฿7,590 (3 เดือน) / ฿8,590 (6 เดือน)',
    url: `${SITE}/pages/ielts-all-skills`,
    imageUrl: `${THUMB}/reading-intensive.png`
  },
  writingPlusOne: {
    title: 'Writing + Reading หรือ Speaking',
    priceThb: '฿5,990 (3 เดือน) / ฿6,990 (6 เดือน)',
    url: `${SITE}/pages/ielts-all-skills`,
    imageUrl: `${THUMB}/writing-intensive.png`
  },
  twoSkillsNoWriting: {
    title: '2 Skills (ไม่รวม Writing)',
    priceThb: '฿4,990 (3 เดือน) / ฿5,590 (6 เดือน)',
    url: `${SITE}/pages/ielts-all-skills`,
    imageUrl: `${THUMB}/listening-band7.png`
  }
} as const

const SKILL_THAI: Record<SkillKey, string> = {
  reading: 'การอ่าน',
  listening: 'การฟัง',
  writing: 'การเขียน',
  speaking: 'การพูด'
}

const COURSE_THAI: Record<SkillKey, string> = {
  reading: 'คอร์ส Intensive Academic Reading',
  listening: 'คอร์ส Listening for Band 7',
  writing: 'คอร์ส Academic Writing Intensive',
  speaking: 'คอร์ส Speaking Intensive'
}

/**
 * Three rungs per skill: the floor, the middle, and what separates 6.5 from 7.
 * Reading's rungs are the teacher's own wording; the others follow the same
 * shape, taken from what each gate in the test actually measures.
 */
type Rung = { missingThai: string; lessonThai: string }

const LADDER: Record<SkillKey, { low: Rung; mid: Rung; high: Rung }> = {
  reading: {
    low: {
      missingThai: 'พื้นฐานการอ่านและคำศัพท์ยังไม่แน่น ทำให้ตีความประโยคที่ให้มาตรง ๆ ยังพลาดครับ',
      lessonThai: 'บท “รูปแบบ paraphrase & synonyms ที่จะเจอในข้อสอบ” และ “Technique การทำ True, false, not given”'
    },
    mid: {
      missingThai: 'ยังจับใจความหลัก (main idea) และตีความโครงสร้างงานเขียนวิชาการไม่ได้ จึงโดนตัวเลือกที่มีคำซ้ำหลอกครับ',
      lessonThai: 'บท “Technique ทำ matching heading” และ “Technique การทำ matching information”'
    },
    high: {
      missingThai: 'ยังตีความสิ่งที่อยู่เหนือคำศัพท์ตรงตัวไม่ได้ ซึ่งเป็นเส้นแบ่งระหว่าง 6.5 กับ 7.0 ครับ',
      lessonThai: 'บท “Ultimate Tips & Tricks + Patterns” และเฉลย Cambridge 20 ละเอียดทั้งเล่ม'
    }
  },
  listening: {
    low: {
      missingThai: 'ยังจับข้อมูลตรง ๆ อย่างชื่อ ตัวสะกด และตัวเลขใน Section 1 ได้ไม่ครบครับ',
      lessonThai: 'บท “Section 1 — Practical Listening” และ Hotel Reservation Practice'
    },
    mid: {
      missingThai: 'ยังโดนตัวหลอก (distractors) และการ paraphrase ในบทสนทนา Section 2 ดึงออกจากคำตอบครับ',
      lessonThai: 'บท “Section 2 — Everyday Context” ที่เน้น Match info, Multiple choice และการรับมือ distractors'
    },
    high: {
      missingThai: 'ยังตามเลกเชอร์วิชาการยาว ๆ ใน Section 4 ไม่ทัน ซึ่งเป็นด่านของ Band 7 ครับ',
      lessonThai: 'บท “Section 4 — Monologue & Lecture” (The Monologue Strategy)'
    }
  },
  writing: {
    low: {
      missingThai: 'ยังใช้ past tense และเครื่องหมายวรรคตอนจบประโยคผิด ซึ่งเป็นจุดที่กรรมการหักคะแนนก่อนเลยครับ',
      lessonThai: 'บท “สูตรลัดเรื่อง Tense for Band 7” และ “การใช้ Article (a/an/the) ไม่ให้โดนหักคะแนน”'
    },
    mid: {
      missingThai: 'ยังวางลูกน้ำคั่นส่วนขยายและอนุประโยคไม่ถูก ทำให้ประโยคยาว ๆ เสียคะแนนครับ',
      lessonThai: 'บท “Writing Basics” และ “เทคนิค Complex Structures for Band 7”'
    },
    high: {
      missingThai: 'ไวยากรณ์สะอาดแล้ว แต่ flow คลังคำศัพท์ และไวยากรณ์ระดับสูงในงานเขียนของตัวเองยังไม่ถึง 7.0 ครับ',
      lessonThai: 'บท “สรุป Transitional words สำหรับ Band 7” พร้อมส่งงานเขียนให้พี่ดอยตรวจเองได้ 12 ฉบับ'
    }
  },
  speaking: {
    low: {
      missingThai: 'ยังมี tense และ article ผิดระหว่างพูด ซึ่งเป็นตัวกดคะแนนไว้ที่ 5.5–6.0 ครับ',
      lessonThai: 'Day 1 “เพิ่ม fluency ด้วย past tense” และ Day 7 “Focus on using past tenses in speaking”'
    },
    mid: {
      missingThai: 'พูดถูกแล้ว แต่ยังไม่ได้ใช้ past tense และยังเรียบเรียงไอเดียไม่เป็นลำดับครับ',
      lessonThai: 'Day 2 “เรียบเรียง Idea ให้มี Logic” และ “การใช้ discourse markers เพื่อเพิ่ม fluency”'
    },
    high: {
      missingThai: 'ตอบสั้นและใช้คำศัพท์พื้นฐานเป็นหลัก ยังไม่มี collocation ระดับ B2–C1 มากพอสำหรับ 7.0 ครับ',
      lessonThai: 'Day 4–6 “How to speak for 2 minutes” และคลัง Vocabulary สำหรับ Part 2'
    }
  }
}

const BAND_THAI: Record<PlacementBandKey, string> = {
  'below5.5': 'ต่ำกว่า 5.5',
  '5.5-6': '5.5–6.0',
  '6': '6.0',
  '6-6.5': '6.0–6.5',
  '6.5': '6.5',
  '6.5-7': '6.5–7.0',
  '7plus': '7.0 ขึ้นไป'
}

const rungFor = (band: PlacementBandKey): 'low' | 'mid' | 'high' | null => {
  if (band === 'below5.5' || band === '5.5-6') return 'low'
  if (band === '6' || band === '6-6.5') return 'mid'
  if (band === '6.5' || band === '6.5-7') return 'high'
  return null
}

/** At or below 6.0 the skill still needs work before the exam. */
const NEEDS_WORK: PlacementBandKey[] = ['below5.5', '5.5-6', '6']

const gapFor = (skill: SkillKey, band: PlacementBandKey): SkillGap | null => {
  const rung = rungFor(band)
  if (!rung) return null
  return {
    skillThai: SKILL_THAI[skill],
    bandThai: BAND_THAI[band],
    missingThai: LADDER[skill][rung].missingThai,
    lessonThai: LADDER[skill][rung].lessonThai,
    courseThai: COURSE_THAI[skill]
  }
}

export const recommendCourses = (
  bands: Partial<Record<SkillKey, PlacementBandKey | null>>
): Recommendation => {
  const entries = (Object.keys(SKILL_THAI) as SkillKey[])
    .map((skill) => ({ skill, band: bands[skill] || null }))
    .filter((entry) => entry.band !== null) as Array<{ skill: SkillKey; band: PlacementBandKey }>

  const weak = entries.filter((entry) => NEEDS_WORK.includes(entry.band))
  const weakSkills = weak.map((entry) => entry.skill)
  const names = weakSkills.map((skill) => SKILL_THAI[skill]).join(' ')
  const gapsFrom = (list: typeof entries) =>
    list.map((entry) => gapFor(entry.skill, entry.band)).filter(Boolean) as SkillGap[]

  if (weak.length >= 4) {
    return {
      headlineThai: 'ทั้ง 4 ทักษะยังต้องเก็บ แนะนำเรียนรวดเดียวจะคุ้มกว่าแยกซื้อครับ',
      primary: { ...BUNDLES.allSkills, reasonThai: 'ครอบคลุมทั้ง 4 ทักษะในราคาถูกกว่าซื้อแยกเกือบครึ่ง แบบ 6 เดือนมีปูพื้นแกรมม่าให้ในตัวแล้วครับ' },
      gaps: gapsFrom(weak),
      bundleUrl: BUNDLES.allSkills.url
    }
  }

  if (weak.length === 3) {
    return {
      headlineThai: `ทักษะที่ต้องเก็บคือ ${names} ครับ`,
      primary: { ...BUNDLES.threeSkills, reasonThai: 'เลือกได้ 3 ทักษะที่ยังไม่ถึงเป้า ถูกกว่าซื้อแยกทีละคอร์ส และแบบ 6 เดือนมีปูพื้นแกรมม่าให้ด้วยครับ' },
      gaps: gapsFrom(weak),
      bundleUrl: BUNDLES.threeSkills.url
    }
  }

  if (weak.length === 2) {
    const includesWriting = weakSkills.includes('writing')
    const bundle = includesWriting ? BUNDLES.writingPlusOne : BUNDLES.twoSkillsNoWriting
    return {
      headlineThai: `ทักษะที่ต้องเก็บคือ ${names} ครับ`,
      primary: {
        ...bundle,
        reasonThai: includesWriting
          ? 'รวม Writing ซึ่งเป็นทักษะที่ต้องมีคนตรวจให้ เข้ากับอีกทักษะที่คุณยังไม่ถึงเป้าครับ'
          : 'จับคู่สองทักษะที่ยังไม่ถึงเป้า ในราคาที่ถูกกว่าซื้อแยกครับ'
      },
      gaps: gapsFrom(weak),
      bundleUrl: bundle.url
    }
  }

  if (weak.length === 1) {
    const skill = weakSkills[0]
    return {
      headlineThai: `เหลือแค่${SKILL_THAI[skill]}ที่ยังไม่ถึงเป้าครับ`,
      primary: { ...COURSES[skill], reasonThai: LADDER[skill].mid.lessonThai ? `เจาะเฉพาะ${SKILL_THAI[skill]}โดยตรง ไม่ต้องจ่ายเผื่อทักษะที่คุณผ่านแล้วครับ` : '' },
      gaps: gapsFrom(weak),
      bundleUrl: `${SITE}/collections/ielts`
    }
  }

  // Everything is 6.5 or above: push the weakest of them across 7.0.
  const order: PlacementBandKey[] = ['6.5', '6.5-7', '7plus']
  const lowest = entries
    .slice()
    .sort((a, b) => order.indexOf(a.band) - order.indexOf(b.band))
    .find((entry) => rungFor(entry.band) === 'high')

  const target = lowest?.skill || 'writing'
  return {
    headlineThai: 'พื้นฐานคุณแน่นแล้ว เหลือแค่ดันให้ข้าม 7.0 ครับ',
    primary: { ...COURSES[target], reasonThai: `จุดที่กั้นคุณจาก 7.0 อยู่ที่${SKILL_THAI[target]} คอร์สนี้เจาะตรงนั้นโดยเฉพาะครับ` },
    gaps: lowest ? gapsFrom([lowest]) : [],
    bundleUrl: `${SITE}/pages/ielts-all-skills`
  }
}
