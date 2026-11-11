import type { WgbFocus, WgbStep } from './writingGuidedBuilder'
import type { Wgb2Focus } from './writingTask2Builder'
import type { WritingTask2Role } from './writingTask2Data'

/**
 * P'Doy's rule cards — the click-to-open "how to use it" dropdowns shown under the coach
 * bubble in both Writing builders.
 *
 * Each rule has a few plain steps plus 3 example sentences for Task 1 and/or 3 for Task 2.
 * A rule that only exists in one task (e.g. the Task 1 Overview) simply has no list for the
 * other one — we never invent a fake example.
 *
 * Task 1 examples follow the teacher's SOP in CLAUDE.md (checked by
 * scripts/validate-writing-coach-rules.ts): fixed openers, the closed list of transitions,
 * "Overall, it can be clearly observed that …", and a comma before "respectively".
 * Task 2 examples follow the dictated essay templates.
 */
export type CoachExample = {
  en: string
  /** Part of `en` to highlight so the learner sees exactly what the rule is about. */
  mark?: string
  /** One short Thai line saying what to notice. */
  noteTh?: string
  /** Optional sentence shown before it, for linking words that only make sense in context. */
  before?: string
}

export type CoachRule = {
  id: string
  icon: string
  titleTh: string
  oneLineTh: string
  stepsTh: string[]
  /** Label for `before` lines; defaults to "ประโยคก่อนหน้า". */
  beforeLabelTh?: string
  task1?: CoachExample[]
  task2?: CoachExample[]
  avoidTh?: string
}

export const WRITING_COACH_RULES: CoachRule[] = [
  {
    id: 'intro',
    icon: '🎯',
    titleTh: 'Introduction: เขียนแค่ 1 ประโยค',
    oneLineTh: 'บอกว่าเรื่องนี้เกี่ยวกับอะไร ด้วยคำของเราเอง แล้วหยุด',
    stepsTh: [
      'Task 1: เริ่มด้วยชนิดกราฟ + compares เช่น "The line graph compares …"',
      'เปลี่ยนคำจากโจทย์เป็นคำใหม่ที่ความหมายเท่าเดิม (synonym)',
      'Task 1: ปิดด้วยช่วงเวลา (between … and …) หรือหน่วย (measured in …) แล้วจบประโยค',
      'Task 2: บอกว่าคนมองเรื่องนี้ยังไง แล้ววางจุดยืนของเรา'
    ],
    avoidTh: 'Task 1 ห้ามมีประโยคที่ 2 และห้ามต่อท้ายด้วย presenting … / highlighting …',
    task1: [
      {
        en: 'The line graph compares the proportion of students using online learning platforms and in-person classes between 2014 and 2024 across the categories included in the data.',
        mark: 'between 2014 and 2024',
        noteTh: 'กราฟตามปี: ชนิดกราฟ + compares + เรื่อง + between ปี and ปี'
      },
      {
        en: 'The two pie charts compare the value of goods traded between the US and Vietnam, such as coffee and aircraft parts, measured in millions of dollars.',
        mark: 'measured in millions of dollars',
        noteTh: 'ภาพเดียวช่วงเวลาเดียว: … such as ตัวอย่าง, measured in หน่วย แล้วจบ'
      },
      {
        en: 'The maps compare the transformation of a town centre from 2005 to 2025.',
        mark: 'The maps compare',
        noteTh: 'แผนที่: The maps compare + สิ่งที่เปลี่ยน'
      }
    ],
    task2: [
      {
        en: 'It has been widely argued that while old buildings preserve a city’s history, they should be replaced to make room for modern housing.',
        mark: 'It has been widely argued that',
        noteTh: 'ประโยคแรกของ intro แบบ To what extent: เล่าที่คนถกเถียงกัน'
      },
      {
        en: 'While it is argued by some that building more subways is the best way to ease congestion, others claim that improving roads is a better investment.',
        mark: 'While it is argued by some that',
        noteTh: 'แบบ Discuss both views: วางสองมุมไว้ในประโยคเดียว'
      },
      {
        en: 'This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.',
        mark: 'elaborate on',
        noteTh: 'แบบ Double question: ประโยคที่ 2 ต้องตรงกับ 2 คำถามของโจทย์ทีละข้อ'
      }
    ]
  },
  {
    id: 'overview',
    icon: '🔭',
    titleTh: 'Overview: 1 ประโยค เปิดด้วย Overall',
    oneLineTh: 'บอกภาพรวมที่สำคัญที่สุด — ไม่ใส่ตัวเลข',
    stepsTh: [
      'เปิดด้วย "Overall, it can be clearly observed that" ทุกครั้ง',
      'ตามด้วยสิ่งที่ใหญ่ที่สุด หรือทิศทางหลักของกราฟ (ไม่ใส่ตัวเลข)',
      'มี 2 สิ่งให้เทียบกัน เชื่อมกลางประโยคด้วย ", while"',
      'จบที่ 1 ประโยคเท่านั้น'
    ],
    avoidTh: 'อย่าเขียน contrasting with หรือ leaving other sources — ใช้ ", while" แทน',
    task1: [
      {
        en: 'Overall, it can be clearly observed that online learning experienced an upward trend, while in-person classes showed a downward trend.',
        mark: 'while',
        noteTh: 'กราฟตามปี: บอกทิศทางของแต่ละเส้น แล้วเชื่อมด้วย while'
      },
      {
        en: 'Overall, it can be clearly observed that coffee was the largest share of Vietnam’s exports to the US, while aircraft parts were the largest share of US exports to Vietnam.',
        mark: 'the largest share',
        noteTh: 'สองภาพ: บอกสิ่งที่ใหญ่ที่สุดของแต่ละภาพ'
      },
      {
        en: 'Overall, it can be clearly observed that a number of transformations took place, including new housing and a civic centre and the demolition of the shopping mall.',
        mark: 'a number of transformations',
        noteTh: 'แผนที่: บอกการเปลี่ยนแปลงหลัก ๆ รวมกันในประโยคเดียว'
      }
    ]
  },
  {
    id: 'trend',
    icon: '📈',
    titleTh: 'Trend phrase: ทิศทางของเส้นกราฟ',
    oneLineTh: 'ใช้ในประโยค Overview ของกราฟตามปี',
    stepsTh: [
      'เส้นขึ้น → "experienced an upward trend" (ห้ามใช้ showed)',
      'เส้นลง → "showed a downward trend"',
      'ขึ้น ๆ ลง ๆ → "fluctuated"',
      'ไม่เปลี่ยนเลย → "remained unchanged" — และห้ามใส่ตัวเลขในประโยคนี้'
    ],
    task1: [
      {
        en: 'Overall, it can be clearly observed that remote working experienced an upward trend.',
        mark: 'experienced an upward trend',
        noteTh: 'ขึ้น → experienced an upward trend'
      },
      {
        en: 'Overall, it can be clearly observed that in-person classes showed a downward trend.',
        mark: 'showed a downward trend',
        noteTh: 'ลง → showed a downward trend'
      },
      {
        en: 'Overall, it can be clearly observed that the number of tourist arrivals fluctuated throughout the period.',
        mark: 'fluctuated',
        noteTh: 'ขึ้นลงสลับกัน → fluctuated'
      }
    ]
  },
  {
    id: 'opener',
    icon: '🚪',
    titleTh: 'ประโยคแรกของ Body: ใช้คำเปิดที่กำหนด',
    oneLineTh: 'ประโยคแรกเปิดด้วยคำของครู — ประโยคหลังจากนั้นใช้ linking word',
    stepsTh: [
      'Pie chart / Map: Body 1 = "Starting with …" · Body 2 = "In terms of …"',
      'Map: Body 1 พูดถึงฝั่ง northern หรือ western · Body 2 พูดถึงฝั่ง eastern หรือ southern',
      'กราฟตามปี: ใส่ปีจริงจากกราฟทุกครั้ง เช่น "Starting in 2014 at 18% …"',
      'ประโยคที่ 2 เป็นต้นไป ต้องขึ้นต้นด้วย linking word (ดูกฎถัดไป)'
    ],
    task1: [
      {
        en: 'Starting with Vietnam’s exports to the US, coffee was the most valuable category at $23 million.',
        mark: 'Starting with',
        noteTh: 'Pie chart Body 1 → Starting with'
      },
      {
        en: 'In terms of the southern section of the map, a market and an open space were replaced by a library and a park.',
        mark: 'In terms of the southern section',
        noteTh: 'Map Body 2 → In terms of + eastern/southern'
      },
      {
        en: 'Starting in 2014 at 18%, online learning rose steadily, climbing to 34% by 2018.',
        mark: 'Starting in 2014 at 18%',
        noteTh: 'กราฟตามปี Body 1 → ใส่ปีจริง + ตัวเลข'
      }
    ]
  },
  {
    id: 'link-contrast',
    icon: '↔️',
    titleTh: 'คำ "แต่": However / On the other hand / In contrast',
    oneLineTh: 'ใช้เมื่อประโยคนี้ตรงข้ามหรือต่างจากประโยคก่อนหน้า',
    stepsTh: [
      'ดูประโยคก่อนหน้า แล้วถามว่า "ประโยคนี้ตรงข้ามกันไหม?" (ตัวหนึ่งใหญ่ ตัวหนึ่งเล็ก)',
      'ถ้าตรงข้าม ให้ขึ้นต้นด้วย However / On the other hand / In contrast',
      'ใส่ comma หลังคำเชื่อม แล้วเขียนข้อมูลที่ตรงข้าม',
      'Task 2 ใช้ while / whereas กลางประโยคได้ด้วย'
    ],
    avoidTh: 'Task 1 ห้ามใช้ By contrast / Meanwhile — ใช้ได้เฉพาะคำในลิสต์ของครู',
    task1: [
      {
        before: 'Coffee was the most valuable category at $23 million.',
        en: 'However, seafood and rice accounted for markedly smaller shares, at $4.4 and $4.3 million, respectively.',
        mark: 'However,',
        noteTh: 'ก่อนหน้า = ใหญ่ · ประโยคนี้ = เล็ก → However'
      },
      {
        before: 'Online learning increased dramatically, reaching 74% in 2024.',
        en: 'On the other hand, in-person classes dropped sharply, reaching 26% in 2024.',
        mark: 'On the other hand,',
        noteTh: 'เส้นหนึ่งขึ้น อีกเส้นลง → On the other hand'
      },
      {
        before: 'Aircraft parts dominated the chart at $72 million.',
        en: 'In contrast, cars made up the smallest share at just $6 million.',
        mark: 'In contrast,',
        noteTh: 'ใหญ่สุด vs เล็กสุด → In contrast'
      }
    ],
    task2: [
      {
        en: 'However, some might argue that building more roads only encourages even more traffic.',
        mark: 'However,',
        noteTh: 'เปิด Body 2 ของ Discuss both views: มุมที่อีกฝั่งคิด'
      },
      {
        en: 'However, I would personally argue in favor of the idea that public transport deserves more funding.',
        mark: 'However,',
        noteTh: 'เปิดความเห็นของเรา หลังเล่ามุมตรงข้ามไปแล้ว'
      },
      {
        en: 'However, this argument is simply invalid given that cheaper tickets already attract many commuters.',
        mark: 'However,',
        noteTh: 'โต้แย้งข้อกังวลใน Advantages/Disadvantages'
      }
    ]
  },
  {
    id: 'link-same',
    icon: '🤝',
    titleTh: 'คำ "เหมือนกัน": Similarly / Likewise',
    oneLineTh: 'ใช้เมื่อประโยคนี้คล้ายกับประโยคก่อนหน้า',
    stepsTh: [
      'ดูประโยคก่อนหน้า แล้วถามว่า "ประโยคนี้ไปทางเดียวกันไหม?"',
      'ถ้าคล้ายกัน ให้ขึ้นต้นด้วย Similarly หรือ Likewise',
      'ใส่ comma แล้วเขียนข้อมูลใหม่ที่ไปทางเดียวกัน'
    ],
    task1: [
      {
        before: 'Chinese students accounted for the largest share at 32%.',
        en: 'Similarly, Japanese students made up a high share at 21%.',
        mark: 'Similarly,',
        noteTh: 'สองกลุ่มสูงทั้งคู่ → Similarly'
      },
      {
        before: 'Online learning climbed dramatically to 34% in 2018.',
        en: 'Likewise, remote working climbed sharply to 41% over the same period.',
        mark: 'Likewise,',
        noteTh: 'สองเส้นขึ้นเหมือนกัน → Likewise'
      },
      {
        before: 'The northern area gained a new housing estate.',
        en: 'Similarly, the western area was redeveloped into a shopping centre.',
        mark: 'Similarly,',
        noteTh: 'สองพื้นที่เปลี่ยนไปทางเดียวกัน → Similarly'
      }
    ],
    task2: [
      {
        before: 'Many students in Japan study at private tutoring schools.',
        en: 'Similarly, a large number of South Korean pupils attend after-school academies.',
        mark: 'Similarly,',
        noteTh: 'ตัวอย่างที่สองไปทางเดียวกับตัวอย่างแรก'
      },
      {
        before: 'Singapore has reduced congestion by charging drivers to enter the city centre.',
        en: 'Likewise, London has introduced a congestion charge to discourage car use.',
        mark: 'Likewise,',
        noteTh: 'อีกเมืองที่ทำเหมือนกัน → Likewise'
      },
      {
        before: 'Cycling has become part of daily life in the Netherlands.',
        en: 'Similarly, Denmark has built extensive bicycle lanes in its cities.',
        mark: 'Similarly,',
        noteTh: 'อีกประเทศที่ทำคล้ายกัน → Similarly'
      }
    ]
  },
  {
    id: 'link-notice',
    icon: '✨',
    titleTh: 'คำ "น่าสนใจ": Interestingly / Surprisingly',
    oneLineTh: 'ใช้เมื่อมีตัวเลขที่เด่น แปลก หรือคาดไม่ถึง',
    stepsTh: [
      'หาตัวเลขหรือข้อเท็จจริงที่เด่น หรือน่าแปลกใจ',
      'ขึ้นต้นด้วย Interestingly, หรือ Surprisingly, (ใช้ Surprisingly เมื่อมันคาดไม่ถึงจริง ๆ)',
      'หรือใช้ "It is interesting to note that" แล้วเขียนประโยคเต็มต่อเลย (ไม่ต้องมี comma)',
      'อย่าใช้ซ้ำทุกประโยค — ใช้พอเหมาะ'
    ],
    task1: [
      {
        before: 'Chinese students accounted for the largest share at 32%.',
        en: 'Interestingly, General English attracted the most students, at 420.',
        mark: 'Interestingly,',
        noteTh: 'ข้อเท็จจริงใหม่ที่น่าสนใจ → Interestingly'
      },
      {
        before: 'The shopping mall and the car park were replaced.',
        en: 'Surprisingly, the former commercial area has also been demolished and replaced by housing.',
        mark: 'Surprisingly,',
        noteTh: 'เรื่องที่คาดไม่ถึง → Surprisingly'
      },
      {
        before: 'The British Museum received 180,000 visitors per month.',
        en: 'It is interesting to note that this figure was almost twice that of the Science Museum.',
        mark: 'It is interesting to note that',
        noteTh: 'ตามด้วยประโยคเต็ม ไม่มี comma'
      }
    ]
  },
  {
    id: 'participle',
    icon: '🔗',
    titleTh: 'ต่อท้ายประโยค: reaching / followed by',
    oneLineTh: 'เติมวลี V-ing หรือ V3 ท้ายประโยค แทนการเริ่มประโยคใหม่',
    stepsTh: [
      'V-ing = บอกสิ่งที่เกิดต่อ เช่น reaching, climbing, peaking at',
      'V3 = ถูกจัดอันดับ/ถูกเทียบ เช่น followed by, compared with, broken down by',
      'ใส่ comma ก่อนวลีนั้น',
      'Task 2: V-ing หน้านาม = กำลังเกิด (growing population) · V3 หน้านาม = เสร็จแล้ว/ถูกทำ (preserved buildings)'
    ],
    task1: [
      {
        en: 'In terms of US exports to Vietnam, aircraft parts dominated the chart, reaching $72 million.',
        mark: 'reaching $72 million',
        noteTh: 'V-ing: บอกว่าไปถึงเท่าไร'
      },
      {
        en: 'Starting with Vietnam’s exports to the US, coffee was the most valuable category, followed by fruit and vegetables at $16 million.',
        mark: 'followed by',
        noteTh: 'V3: ต่อด้วยอันดับถัดไปโดยไม่ต้องเริ่มประโยคใหม่'
      },
      {
        en: 'Starting in 2014 at 18%, online learning rose steadily, peaking at 74% in 2024.',
        mark: 'peaking at 74% in 2024',
        noteTh: 'V-ing: บอกจุดสูงสุด'
      }
    ],
    task2: [
      {
        en: 'Cities should encourage a shift away from private cars, preventing congestion from returning.',
        mark: 'preventing congestion from returning',
        noteTh: 'ใช้ comma + V-ing บอกผลที่ตามมา'
      },
      {
        en: 'A growing population is putting pressure on public services.',
        mark: 'growing population',
        noteTh: 'V-ing หน้านาม = กำลังเพิ่มขึ้นอยู่'
      },
      {
        en: 'Preserved buildings attract tourists and strengthen a city’s identity.',
        mark: 'Preserved buildings',
        noteTh: 'V3 หน้านาม = ถูกอนุรักษ์ไว้แล้ว'
      }
    ]
  },
  {
    id: 'respectively',
    icon: '🔢',
    titleTh: 'respectively = ตามลำดับ',
    oneLineTh: 'จับคู่ชื่อกับตัวเลขตามลำดับ — ต้องมี comma นำหน้าเสมอ',
    stepsTh: [
      'เขียนชื่อสองอย่าง: A and B',
      'เขียนตัวเลขสองตัวตามลำดับเดียวกัน',
      'ปิดท้ายด้วย ", respectively" (comma ก่อนเสมอ)',
      'ชื่อแรกคู่กับตัวเลขแรก ชื่อที่สองคู่กับตัวเลขที่สอง'
    ],
    avoidTh: 'ห้ามลืม comma หน้า respectively',
    task1: [
      {
        en: 'In terms of US exports to Vietnam, fertiliser and cotton followed closely, at $16.5 and $12 million, respectively.',
        mark: ', respectively',
        noteTh: 'fertiliser = $16.5M · cotton = $12M'
      },
      {
        en: 'Starting with nationality, Japanese and Brazilian students made up 21% and 15% of learners, respectively.',
        mark: ', respectively',
        noteTh: 'Japanese = 21% · Brazilian = 15%'
      },
      {
        en: 'Starting with the museums, the British Museum and the Natural History Museum received 180,000 and 145,000 visitors per month, respectively.',
        mark: ', respectively',
        noteTh: 'British = 180,000 · Natural History = 145,000'
      }
    ]
  },
  {
    id: 'referencing',
    icon: '👈',
    titleTh: 'this figure / that of / those of',
    oneLineTh: 'ใช้แทนคำนามที่เพิ่งพูดไป จะได้ไม่ต้องพูดซ้ำ',
    stepsTh: [
      'อ้างถึงตัวเลขที่เพิ่งพูด → this figure / this number',
      'เทียบกับของอีกอย่าง (เอกพจน์) → that of + สิ่งที่เทียบ  (that of = the number/value of)',
      'ถ้าของที่อ้างถึงเป็นพหูพจน์ → those of',
      'Task 2: ใช้ this / that ชี้กลับเหตุผลที่เพิ่งพูด'
    ],
    task1: [
      {
        before: 'The British Museum received 180,000 visitors per month.',
        en: 'Interestingly, this figure was almost twice that of the Science Museum.',
        mark: 'that of',
        noteTh: 'that of = จำนวนผู้เข้าชมของ …'
      },
      {
        en: 'Whereas online learning stood at 18% in 2014, that of in-person classes began at 82%.',
        mark: 'that of',
        noteTh: 'that of = the figure of … ไม่ต้องพูดซ้ำ'
      },
      {
        en: 'In contrast, the shares of seafood and rice were far smaller than those of fruit and vegetables.',
        mark: 'those of',
        noteTh: 'shares เป็นพหูพจน์ → those of'
      }
    ],
    task2: [
      {
        before: 'Many young people move to big cities for better jobs.',
        en: 'This is the main reason why urban populations keep growing.',
        mark: 'This is the main reason',
        noteTh: 'This ชี้กลับประโยคก่อนหน้า'
      },
      {
        before: 'Students sit an exam at the end of every term.',
        en: 'That kind of pressure pushes many of them to study harder.',
        mark: 'That kind of pressure',
        noteTh: 'That + คำนามใหม่ สรุปสิ่งที่พูดไป'
      },
      {
        before: 'Public transport is cheaper and cleaner than driving.',
        en: 'In this respect, it is evident that governments should invest in it.',
        mark: 'In this respect',
        noteTh: 'In this respect = ในแง่นี้ (ใช้ปิด Body)'
      }
    ]
  },
  {
    id: 'degree-adverb',
    icon: '⚡',
    titleTh: 'Adverb บอกความเร็วของการเปลี่ยน',
    oneLineTh: 'วางหลัง verb เพื่อบอกว่าเปลี่ยนเร็วหรือช้า',
    stepsTh: [
      'เปลี่ยนแรง/เร็ว → dramatically, sharply',
      'เปลี่ยนสม่ำเสมอ → steadily',
      'เปลี่ยนช้า ๆ → gradually, slightly',
      'วางหลัง verb: rose steadily · fell gradually'
    ],
    task1: [
      {
        en: 'In contrast, remote working increased dramatically, reaching 41% in 2024.',
        mark: 'increased dramatically',
        noteTh: 'dramatically = เร็วและแรงมาก'
      },
      {
        en: 'Starting in 2014 at 18%, online learning rose steadily, climbing to 34% by 2018.',
        mark: 'rose steadily',
        noteTh: 'steadily = ขึ้นสม่ำเสมอ'
      },
      {
        en: 'On the other hand, the number of visitors fell gradually over the five years.',
        mark: 'fell gradually',
        noteTh: 'gradually = ค่อยเป็นค่อยไป'
      }
    ]
  },
  {
    id: 'verb-tense',
    icon: '⏱️',
    titleTh: 'ผันกริยาให้ถูก (tense / รูปกริยา)',
    oneLineTh: 'Task 1 = อดีตเสมอ · Task 2 = ดูโครงสร้างก่อนผัน',
    stepsTh: [
      'Task 1: ข้อมูลเกิดไปแล้ว → past simple (was, rose, dominated)',
      'เช็คประธาน: เอกพจน์ = was · พหูพจน์ = were',
      'Task 2 passive = be + V3 เช่น has been argued · should be given',
      'หลัง modal (should/could) ใช้ base form · หลัง by/for/on ใช้ V-ing'
    ],
    task1: [
      {
        en: 'Starting with Vietnam’s exports to the US, coffee was the most valuable category at $23 million.',
        mark: 'was',
        noteTh: 'ประธาน coffee เอกพจน์ + อดีต → was'
      },
      {
        en: 'However, in 2018, online learning rose dramatically to 34%.',
        mark: 'rose',
        noteTh: 'rise → rose (อดีตไม่ปกติ)'
      },
      {
        en: 'In terms of US exports to Vietnam, aircraft parts dominated the chart.',
        mark: 'dominated',
        noteTh: 'dominate + ed = dominated'
      }
    ],
    task2: [
      {
        en: 'It has been widely argued that technology is making students lazy.',
        mark: 'has been widely argued',
        noteTh: 'passive: has been + V3'
      },
      {
        en: 'Governments could reduce pollution by investing in public transport.',
        mark: 'could reduce',
        noteTh: 'หลัง could ใช้ base form · หลัง by ใช้ V-ing'
      },
      {
        en: 'More attention should be given to preventive healthcare.',
        mark: 'should be given',
        noteTh: 'passive หลัง modal: should be + V3'
      }
    ]
  },
  {
    id: 'article',
    icon: '📖',
    titleTh: 'a / an / the',
    oneLineTh: 'เจาะจง = the · ทั่วไปครั้งแรก = a/an · พหูพจน์/นับไม่ได้ทั่วไป = ไม่ใส่',
    stepsTh: [
      'ชี้เฉพาะ หรือมีอันเดียวในบริบท → the (the largest share)',
      'นามนับได้เอกพจน์ ที่พูดถึงครั้งแรก → a / an',
      'an ใช้หน้าเสียงสระ (an upward trend)',
      'นามพหูพจน์ทั่วไป หรือนามนับไม่ได้ทั่วไป → ไม่ใส่ (cities, education)'
    ],
    task1: [
      {
        en: 'Overall, it can be clearly observed that coffee was the largest share of Vietnam’s exports to the US.',
        mark: 'the largest share',
        noteTh: 'ที่สุดมีอันเดียว → the'
      },
      {
        en: 'Overall, it can be clearly observed that online learning experienced an upward trend.',
        mark: 'an upward trend',
        noteTh: 'upward ขึ้นต้นเสียงสระ → an'
      },
      {
        en: 'Starting with the northern part of the map, a library replaced the old market.',
        mark: 'a library',
        noteTh: 'ครั้งแรก = a · the northern part / the old market = ระบุเฉพาะ'
      }
    ],
    task2: [
      {
        en: 'Education plays a key role in reducing poverty.',
        mark: 'Education plays',
        noteTh: 'education นับไม่ได้ทั่วไป → ไม่ใส่ the'
      },
      {
        en: 'Cities often struggle with traffic congestion.',
        mark: 'Cities often',
        noteTh: 'cities พหูพจน์ทั่วไป → ไม่ใส่ the'
      },
      {
        en: 'The government should spend more on scientific research.',
        mark: 'The government',
        noteTh: 'รัฐบาลของประเทศนั้น ระบุเฉพาะ → the'
      }
    ]
  },
  {
    id: 'paraphrase',
    icon: '🔄',
    titleTh: 'Paraphrase = เรื่องเดิม คำใหม่',
    oneLineTh: 'เปลี่ยนคำโจทย์เป็น synonym หรือเปลี่ยนโครงสร้าง ความหมายต้องเท่าเดิม',
    stepsTh: [
      'หา synonym: shows → compares · number → proportion / value · changes → transformation',
      'หรือเปลี่ยนโครงสร้าง: from … to … → between … and …',
      'เช็คว่าความหมายไม่เพี้ยน (value = มูลค่า ไม่ใช่ weight = น้ำหนัก)'
    ],
    beforeLabelTh: 'โจทย์',
    task1: [
      {
        before: 'The table shows the percentage of students at each university.',
        en: 'The table compares the proportion of students enrolled at several universities.',
        mark: 'compares the proportion',
        noteTh: 'shows → compares · percentage → proportion'
      },
      {
        before: 'The graph shows changes in the number of people using the internet.',
        en: 'The line graph compares the proportion of internet users between 2010 and 2020.',
        mark: 'between 2010 and 2020',
        noteTh: 'เปลี่ยนโครงสร้าง + ใส่ช่วงเวลา'
      },
      {
        before: 'The maps show changes to a town centre.',
        en: 'The maps compare the transformation of a town centre.',
        mark: 'transformation',
        noteTh: 'changes → transformation'
      }
    ],
    task2: [
      {
        before: 'Some people think that museums are no longer necessary.',
        en: 'It has been widely argued that museums have lost their purpose in the digital age.',
        mark: 'lost their purpose',
        noteTh: 'no longer necessary → lost their purpose'
      },
      {
        before: 'Some believe that children should start school at a very early age.',
        en: 'It has been widely argued that formal education should begin at an early age.',
        mark: 'formal education should begin',
        noteTh: 'start school → formal education should begin'
      },
      {
        before: 'The number of people who live alone is increasing.',
        en: 'While it is argued by some that living alone is becoming more common, others see it as a sign of independence.',
        mark: 'becoming more common',
        noteTh: 'increasing → becoming more common'
      }
    ]
  },
  {
    id: 'word-choice',
    icon: '🧩',
    titleTh: 'เลือกคำให้ตรงความหมาย',
    oneLineTh: 'อ่านทั้งประโยคก่อน แล้วค่อยเลือกคำ',
    stepsTh: [
      'อ่านทั้งประโยค ไม่ใช่แค่คำรอบช่อง',
      'ตัดตัวเลือกที่ความหมายผิดออกก่อน (เช่น weight ใช้กับเงินไม่ได้)',
      'เช็คชนิดคำ: ช่องนี้ต้องเป็น noun, verb หรือ adjective?',
      'เช็คคำที่ชอบมาคู่กัน เช่น account for · followed by · play a role'
    ],
    task1: [
      {
        en: 'Starting with Vietnam’s exports to the US, coffee was the most valuable category at $23 million.',
        mark: 'valuable',
        noteTh: 'valuable = มีมูลค่า (valueless = ไร้ค่า ผิดความหมาย)'
      },
      {
        en: 'However, seafood and rice accounted for markedly smaller shares, at $4.4 and $4.3 million, respectively.',
        mark: 'accounted for',
        noteTh: 'account for = คิดเป็นสัดส่วน (คำคู่)'
      },
      {
        en: 'In contrast, cars made up the smallest share at just $6 million.',
        mark: 'made up',
        noteTh: 'make up = ประกอบเป็น (คำคู่)'
      }
    ],
    task2: [
      {
        en: 'Schools can play a key role in promoting healthy habits.',
        mark: 'play a key role',
        noteTh: 'play a role = มีบทบาท (ไม่ใช่ do / make)'
      },
      {
        en: 'Governments should take measures to reduce pollution.',
        mark: 'take measures',
        noteTh: 'take measures = ดำเนินมาตรการ'
      },
      {
        en: 'Campaigns can raise awareness of healthy eating.',
        mark: 'raise awareness',
        noteTh: 'raise awareness = สร้างความตระหนัก'
      }
    ]
  },
  {
    id: 'letter-hint',
    icon: '🔤',
    titleTh: 'ช่องใบ้ตัวอักษร',
    oneLineTh: 'เห็นตัวแรก ๆ แล้วเติมที่เหลือให้ครบทั้งคำ',
    stepsTh: [
      'อ่านทั้งประโยค แล้วเดาว่าช่องนี้ต้องการความหมายอะไร',
      'ดูตัวอักษรที่ให้มา และจำนวนขีดที่เหลือ (1 ขีด = 1 ตัวอักษร)',
      'สะกดทั้งคำ และผันรูปให้ตรงบริบท (-ed / -ing / -s)',
      'ไม่แน่ใจความหมาย กดปุ่มตัวช่วยดูคำแปลไทยได้'
    ],
    task1: [
      {
        en: 'However, online learning rose ste_ _ _ _ _ from 2014 to 2018.',
        mark: 'ste_ _ _ _ _',
        noteTh: '→ steadily'
      },
      {
        en: 'Starting with Vietnam’s exports to the US, coffee was the most val_ _ _ _ _ category.',
        mark: 'val_ _ _ _ _',
        noteTh: '→ valuable'
      },
      {
        en: 'In terms of the southern section of the map, the industrial zone was tran_ _ _ _ _ _ _ into a tech park.',
        mark: 'tran_ _ _ _ _ _ _',
        noteTh: '→ transformed'
      }
    ],
    task2: [
      {
        en: 'Regular exercise improves both physical and mental he_ _ _ _.',
        mark: 'he_ _ _ _',
        noteTh: '→ health'
      },
      {
        en: 'Governments must invest in sus_ _ _ _ _ _ _ _ energy.',
        mark: 'sus_ _ _ _ _ _ _ _',
        noteTh: '→ sustainable'
      },
      {
        en: 'A strong sense of mot_ _ _ _ _ _ _ helps learners succeed.',
        mark: 'mot_ _ _ _ _ _ _',
        noteTh: '→ motivation'
      }
    ]
  },
  {
    id: 'plural',
    icon: '🔢',
    titleTh: 'เอกพจน์ / พหูพจน์ (เติม -s ไหม?)',
    oneLineTh: 'ดูคำบอกจำนวนก่อน แล้วค่อยตัดสิน',
    stepsTh: [
      'many / these / several / their → พหูพจน์ (เติม -s)',
      'a / an / each / every / one → เอกพจน์',
      'นามนับไม่ได้ (information, research, evidence) ไม่เติม -s',
      '"the number of + พหูพจน์" ใช้กริยาเอกพจน์ (the number of visitors was)'
    ],
    task1: [
      {
        before: 'Chinese students made up 32% of learners.',
        en: 'However, each category recorded a different figure.',
        mark: 'each category',
        noteTh: 'each → เอกพจน์ → category'
      },
      {
        en: 'Interestingly, these figures were far higher than the national average.',
        mark: 'these figures were',
        noteTh: 'these → พหูพจน์ → figures + were'
      },
      {
        en: 'On the other hand, the number of visitors was lower in winter.',
        mark: 'the number of visitors was',
        noteTh: 'the number of … ใช้ was (เอกพจน์)'
      }
    ],
    task2: [
      {
        en: 'Many students struggle to balance study and part-time work.',
        mark: 'Many students',
        noteTh: 'many → พหูพจน์ → students'
      },
      {
        en: 'Each citizen has a responsibility to protect the environment.',
        mark: 'Each citizen has',
        noteTh: 'each → เอกพจน์ → citizen + has'
      },
      {
        en: 'Research shows that regular exercise improves concentration.',
        mark: 'Research shows',
        noteTh: 'research นับไม่ได้ → ไม่เติม -s และกริยา shows'
      }
    ]
  },
  {
    id: 'word-type',
    icon: '🏷️',
    titleTh: 'noun / adjective / adverb',
    oneLineTh: 'ดูตำแหน่งในประโยคว่าช่องนี้ต้องการคำชนิดไหน',
    stepsTh: [
      'หลัง a / the / adjective → ต้องเป็น noun (significant benefits)',
      'หน้า noun → adjective (cultural identity)',
      'ขยายกริยา → adverb ที่มักลงท้าย -ly (widely argued)',
      'หลัง is / was / remains → adjective (was steady)'
    ],
    task1: [
      {
        en: 'However, in-person classes dropped sharply, reaching 26% in 2024.',
        mark: 'dropped sharply',
        noteTh: 'sharply = adverb ขยาย dropped'
      },
      {
        en: 'Starting with Vietnam’s exports to the US, coffee was the most valuable category at $23 million.',
        mark: 'valuable category',
        noteTh: 'valuable = adjective หน้า noun category'
      },
      {
        en: 'In contrast, the decline in visitor numbers was steady.',
        mark: 'was steady',
        noteTh: 'หลัง was ใช้ adjective (steady)'
      }
    ],
    task2: [
      {
        en: 'It has been widely argued that old buildings should be preserved.',
        mark: 'widely argued',
        noteTh: 'widely = adverb ขยาย argued'
      },
      {
        en: 'Preserving cultural identity is a key reason for protecting old buildings.',
        mark: 'cultural identity',
        noteTh: 'cultural = adjective หน้า noun identity'
      },
      {
        en: 'Technology offers significant benefits to students.',
        mark: 'significant benefits',
        noteTh: 'benefits = noun หลัง adjective'
      }
    ]
  },
  {
    id: 'comma',
    icon: '✂️',
    titleTh: 'Comma ( , ) ใส่ตรงไหน',
    oneLineTh: 'comma = จังหวะหยุดสั้น ๆ',
    stepsTh: [
      'หลังคำเปิดประโยค: However, … / In contrast, …',
      'ก่อน which ที่เพิ่มข้อมูล: … museum, which received …',
      'ก่อน respectively เสมอ',
      'ห้ามใส่ comma คั่นระหว่างประธานกับกริยาตรง ๆ'
    ],
    task1: [
      {
        before: 'The British Museum received 180,000 visitors per month.',
        en: 'Interestingly, this figure was almost twice that of the Science Museum, which received 95,000 visitors.',
        mark: ', which',
        noteTh: 'comma ก่อน which ที่เพิ่มข้อมูล'
      },
      {
        en: 'However, seafood and rice accounted for markedly smaller shares, at $4.4 and $4.3 million, respectively.',
        mark: ', respectively',
        noteTh: 'comma ก่อน respectively เสมอ'
      },
      {
        en: 'Starting in 2014 at 18%, online learning rose steadily, climbing to 34% by 2018.',
        mark: '2018.',
        noteTh: 'comma หลังวลีเปิด และก่อนวลี V-ing'
      }
    ],
    task2: [
      {
        en: 'However, some might argue that more roads would reduce congestion.',
        mark: 'However,',
        noteTh: 'comma หลังคำเปิดประโยค'
      },
      {
        en: 'Old buildings, which often have great historical value, should be preserved.',
        mark: ', which',
        noteTh: 'comma ครอบ which ที่เพิ่มข้อมูล'
      },
      {
        en: 'In conclusion, although it is undeniable that technology helps learning, I am of the opinion that teachers remain essential.',
        mark: 'learning,',
        noteTh: 'comma หลังคำเปิด และหลัง although-clause'
      }
    ]
  },
  {
    id: 'punct',
    icon: '❗',
    titleTh: 'จุด . / จุลภาค , / อัฒภาค ;',
    oneLineTh: 'เลือกเครื่องหมายให้ตรงจังหวะความคิด',
    stepsTh: [
      '"." = จบความคิดที่สมบูรณ์แล้ว',
      '"," = คั่นส่วนขยายในประโยคเดียวกัน',
      '";" = เชื่อมสองประโยคที่เกี่ยวกันมาก (มักตามด้วย therefore,)',
      'ถ้าไม่ต้องใส่อะไรเลย ให้เลือกตัวเลือกว่าง'
    ],
    task2: [
      {
        en: 'To explain it simply, this is possibly because costs have risen; therefore, fewer families can afford private tuition.',
        mark: '; therefore,',
        noteTh: 'semicolon เชื่อมสองประโยค + comma หลัง therefore'
      },
      {
        en: 'Many people prefer cycling to work. It is cheap, healthy and fast.',
        mark: 'work. It',
        noteTh: 'จบความคิดแรกด้วยจุด แล้วเริ่มความคิดใหม่'
      },
      {
        en: 'Although some people prefer roads, others favour railways.',
        mark: 'roads,',
        noteTh: 'comma คั่นหลัง although-clause'
      }
    ]
  },
  {
    id: 't2-body-claim',
    icon: '🚪',
    titleTh: 'ประโยคแรกของ Body (Task 2)',
    oneLineTh: 'บอกตั้งแต่ประโยคแรกว่าย่อหน้านี้พูดถึงมุมไหน',
    stepsTh: [
      'มุมตรงข้าม → "To begin with, it might seem sensible for some to claim that …"',
      'อีกฝั่ง → "However, some might argue that …"',
      'ความเห็นของเรา → "Personally, I would argue in favor of the idea that …"',
      'แล้วตามด้วยเหตุผล และตัวอย่าง (กฎถัดไป)'
    ],
    task2: [
      {
        en: 'To begin with, it might seem sensible for some to claim that old buildings should be demolished to free up land.',
        mark: 'To begin with',
        noteTh: 'Body 1: มุมตรงข้ามกับเรา'
      },
      {
        en: 'However, some might argue that building more subways is a waste of public money.',
        mark: 'However, some might argue that',
        noteTh: 'Body 2 (Discuss both views): อีกมุมหนึ่ง'
      },
      {
        en: 'Personally, I would argue in favor of the idea that governments should invest in public transport.',
        mark: 'Personally, I would argue',
        noteTh: 'Body 3: ความเห็นของเรา'
      }
    ]
  },
  {
    id: 't2-reason',
    icon: '💡',
    titleTh: 'เหตุผล: To put it simply …',
    oneLineTh: 'ประโยคที่ 2 อธิบายว่า "ทำไม" ด้วยภาษาง่าย ๆ',
    stepsTh: [
      'ขึ้นต้นด้วย "To explain it simply," หรือ "To put it simply,"',
      'ตามด้วย "this is because …" หรือ "this is due to the fact that …"',
      'เหตุผลต้องตอบว่า "ทำไมถึงคิดแบบนั้น"'
    ],
    task2: [
      {
        en: 'To explain it simply, this is possibly because old buildings are expensive to maintain; therefore, some councils prefer to replace them.',
        mark: 'To explain it simply',
        noteTh: 'ใช้ semicolon + therefore, ต่อผลลัพธ์'
      },
      {
        en: 'To put it simply, this is due to the fact that public transport carries far more people than private cars.',
        mark: 'this is due to the fact that',
        noteTh: 'due to the fact that = เป็นเพราะว่า'
      },
      {
        en: 'My reasoning is that free education gives every child an equal start in life.',
        mark: 'My reasoning is that',
        noteTh: 'ใช้ใน Body ความเห็นของเรา'
      }
    ]
  },
  {
    id: 't2-example',
    icon: '📌',
    titleTh: 'ตัวอย่าง: For example / For instance',
    oneLineTh: 'ตัวอย่างต้องเจาะจง — มีชื่อเมือง/ประเทศ ปี หรือตัวเลข',
    stepsTh: [
      'ขึ้นต้นด้วย For example, / For instance, / To illustrate,',
      'ใส่ชื่อสถานที่ ปี หรือตัวเลขจริง ไม่ใช่คำกว้าง ๆ',
      'จบด้วยผลลัพธ์ที่โยงกลับไปที่เหตุผล'
    ],
    task2: [
      {
        en: 'For example, Tokyo’s rail network carries millions of passengers every day, which helps keep its roads relatively clear.',
        mark: 'Tokyo’s rail network',
        noteTh: 'มีชื่อเมืองเจาะจง + ผลลัพธ์'
      },
      {
        en: 'For instance, London introduced a congestion charge in 2003, and traffic in the city centre fell afterwards.',
        mark: 'in 2003',
        noteTh: 'มีเมือง + ปี + ผลลัพธ์'
      },
      {
        en: 'To illustrate, Singapore charges drivers to enter its city centre, which has helped to limit congestion.',
        mark: 'Singapore',
        noteTh: 'ชื่อประเทศ + นโยบาย + ผลที่ตามมา'
      }
    ]
  },
  {
    id: 't2-link-result',
    icon: '➡️',
    titleTh: 'คำ "ผลลัพธ์": Therefore / As a result',
    oneLineTh: 'ใช้เมื่อประโยคนี้เป็นผลที่เกิดจากประโยคก่อนหน้า',
    stepsTh: [
      'ถามว่า "เพราะประโยคก่อนหน้า จึงเกิดอะไรขึ้น?"',
      'ถ้าเป็นผลลัพธ์ ขึ้นต้นด้วย Therefore, หรือ As a result,',
      'ใส่ comma ตามหลัง',
      'ถ้าเป็นแค่ข้อมูลเสริม ไม่ใช่ผลลัพธ์ อย่าใช้คำนี้'
    ],
    task2: [
      {
        before: 'Public transport is cheap and frequent.',
        en: 'Therefore, more commuters leave their cars at home.',
        mark: 'Therefore,',
        noteTh: 'ถูกและบ่อย → จึงมีคนทิ้งรถ'
      },
      {
        before: 'The new tax made plastic bags more expensive.',
        en: 'As a result, supermarkets sold far fewer of them.',
        mark: 'As a result,',
        noteTh: 'แพงขึ้น → ผลคือขายน้อยลง'
      },
      {
        before: 'Many older buildings are costly to repair.',
        en: 'Therefore, councils sometimes find demolition cheaper.',
        mark: 'Therefore,',
        noteTh: 'ซ่อมแพง → จึงรื้อถูกกว่า'
      }
    ]
  },
  {
    id: 't2-conclusion',
    icon: '🏁',
    titleTh: 'Conclusion: 1 ประโยค',
    oneLineTh: 'สรุปจุดยืนของเราในประโยคเดียว',
    stepsTh: [
      'เริ่มด้วย "In conclusion,"',
      'ยอมรับอีกฝั่ง: "although it is undeniable that …,"',
      'บอกจุดยืน: "I am of the opinion that …"',
      'จบที่ 1 ประโยค'
    ],
    task2: [
      {
        en: 'In conclusion, although it is undeniable that old buildings hold historical value, I am of the opinion that safety and housing needs should come first.',
        mark: 'although it is undeniable that',
        noteTh: 'To what extent / Discuss both views'
      },
      {
        en: 'In conclusion, although it is undeniable that some might be concerned in terms of cost, I am of the opinion that the benefits of public transport, including cleaner air and fewer traffic jams, are far greater than the drawbacks.',
        mark: 'I am of the opinion that',
        noteTh: 'Advantages / Disadvantages: ระบุประโยชน์ที่ชนะ'
      },
      {
        en: 'In conclusion, although it is undeniable that urban growth causes traffic congestion, I am of the opinion that better public transport is the most effective solution.',
        mark: 'I am of the opinion that',
        noteTh: 'Double question: ผูกกับคำตอบของคำถามที่สอง'
      }
    ]
  }
]

export const WRITING_COACH_RULE_BY_ID: Record<string, CoachRule> = Object.fromEntries(
  WRITING_COACH_RULES.map((rule) => [rule.id, rule])
)

export type CoachRuleSelection = {
  /** Rules that match the blank the learner is on — shown first, with a "this blank" tag. */
  focusIds: string[]
  /** Every rule to list (focus rules first, then the rest of the step's rules). */
  ids: string[]
}

const merge = (focusIds: string[], stepIds: string[]): CoachRuleSelection => {
  const focus = [...new Set(focusIds)]
  return { focusIds: focus, ids: [...new Set([...focus, ...stepIds])] }
}

// ── Task 1 ────────────────────────────────────────────────────────────────────────────
const TASK1_BODY_RULES = [
  'opener',
  'link-contrast',
  'link-same',
  'link-notice',
  'participle',
  'respectively',
  'referencing',
  'degree-adverb',
  'verb-tense'
]

const TASK1_STEP_RULES: Record<WgbStep['role'], string[]> = {
  intro: ['intro', 'paraphrase', 'participle'],
  overview: ['overview', 'trend', 'verb-tense'],
  body1: TASK1_BODY_RULES,
  body2: TASK1_BODY_RULES
}

const TASK1_FOCUS_RULES: Record<Exclude<WgbFocus, 'transition'>, string[]> = {
  paraphrase: ['paraphrase'],
  'word-choice': ['word-choice'],
  referencing: ['referencing'],
  'trend-phrase': ['trend'],
  'verb-tense': ['verb-tense'],
  'ving-clause': ['participle'],
  'v3-clause': ['participle'],
  'degree-adverb': ['degree-adverb'],
  article: ['article'],
  'letter-hint': ['letter-hint']
}

export const getTask1CoachRules = (role: WgbStep['role'], focus: WgbFocus | null): CoachRuleSelection => {
  let focusIds: string[] = []
  if (focus === 'transition') {
    focusIds =
      role === 'overview'
        ? ['overview']
        : role === 'intro'
          ? ['intro']
          : ['opener', 'link-contrast', 'link-same', 'link-notice']
  } else if (focus) {
    focusIds = TASK1_FOCUS_RULES[focus] ?? []
  }
  return merge(focusIds, TASK1_STEP_RULES[role])
}

// ── Task 2 ────────────────────────────────────────────────────────────────────────────
const TASK2_BODY_RULES = [
  't2-body-claim',
  't2-reason',
  't2-example',
  'link-contrast',
  't2-link-result',
  'participle',
  'comma',
  'punct'
]

const TASK2_STEP_RULES: Record<WritingTask2Role, string[]> = {
  intro: ['intro', 'paraphrase', 'link-contrast', 'verb-tense', 'article', 'comma'],
  body1: TASK2_BODY_RULES,
  body2: TASK2_BODY_RULES,
  body3: TASK2_BODY_RULES,
  conclusion: ['t2-conclusion', 'comma', 'plural', 'article']
}

const TASK2_FOCUS_RULES: Record<Exclude<Wgb2Focus, 'transition'>, string[]> = {
  'verb-tense': ['verb-tense'],
  plural: ['plural'],
  noun: ['word-type'],
  adjective: ['word-type'],
  adverb: ['word-type'],
  article: ['article'],
  comma: ['comma'],
  participle: ['participle'],
  punct: ['punct'],
  'word-choice': ['word-choice'],
  'letter-hint': ['letter-hint']
}

export const getTask2CoachRules = (role: WritingTask2Role, focus: Wgb2Focus | null): CoachRuleSelection => {
  let focusIds: string[] = []
  if (focus === 'transition') {
    focusIds =
      role === 'intro'
        ? ['link-contrast']
        : role === 'conclusion'
          ? ['t2-conclusion']
          : ['link-contrast', 'link-same', 't2-link-result', 't2-example']
  } else if (focus) {
    focusIds = TASK2_FOCUS_RULES[focus] ?? []
  }
  return merge(focusIds, TASK2_STEP_RULES[role])
}
