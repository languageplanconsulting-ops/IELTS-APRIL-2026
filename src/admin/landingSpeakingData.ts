// ── IELTS Speaking Landing Page — static data ───────────────────────────────

export type SpeakingPartInfo = {
  id: string
  part: string
  duration: string
  titleTh: string
  descTh: string
  tipTh: string
}

export const SPEAKING_PART_INFO: SpeakingPartInfo[] = [
  {
    id: 'part1',
    part: 'Part 1',
    duration: '4–5 นาที',
    titleTh: 'Introduction & Interview',
    descTh:
      'กรรมการจะถามคำถามเกี่ยวกับตัวคุณ เช่น บ้าน งาน/การเรียน งานอดิเรก และหัวข้อที่คุ้นเคยในชีวิตประจำวัน ประมาณ 3 หัวข้อ หัวข้อละ 2–3 ข้อ',
    tipTh: 'พูดตรงๆ ไม่ต้องยาวเกิน 2–3 ประโยค ให้ฟังดู natural มากกว่า rehearsed'
  },
  {
    id: 'part2',
    part: 'Part 2',
    duration: '3–4 นาที',
    titleTh: 'Individual Long Turn (Cue Card)',
    descTh:
      'คุณจะได้รับ cue card ที่มีหัวข้อและ bullet points ที่ต้องพูดถึง มีเวลาเตรียม 1 นาที แล้วพูดอย่างน้อย 1–2 นาที กรรมการอาจถามคำถามสั้นๆ ต่อท้าย',
    tipTh: 'ใช้ 1 นาทีจดโครงสร้าง (intro → 2-3 body points → why it matters) อย่าพูดเร็วเกิน'
  },
  {
    id: 'part3',
    part: 'Part 3',
    duration: '4–5 นาที',
    titleTh: 'Two-way Discussion',
    descTh:
      'กรรมการถามคำถามเชิงนามธรรมที่เชื่อมโยงกับหัวข้อ Part 2 เน้นความคิดเห็น เปรียบเทียบ และวิเคราะห์มากกว่าการเล่าเรื่องส่วนตัว',
    tipTh: 'ให้ความเห็นและ justify เสมอ เช่น "I think… because…" หรือ "It depends on…"'
  }
]

export type SpeakingCriterion = {
  id: string
  label: string
  labelTh: string
  descTh: string
  weight: string
}

export const SPEAKING_CRITERIA: SpeakingCriterion[] = [
  {
    id: 'fc',
    label: 'Fluency & Coherence',
    labelTh: 'Fluency & Coherence',
    descTh: 'พูดต่อเนื่องโดยไม่หยุดนานเกินไป ความคิดเชื่อมโยงกันอย่างมีเหตุผล ไม่ต้องพูดเร็วมาก แต่ต้องไม่ติดขัด',
    weight: '25%'
  },
  {
    id: 'lr',
    label: 'Lexical Resource',
    labelTh: 'Lexical Resource',
    descTh: 'ใช้คำศัพท์ที่หลากหลายและตรงบริบท รู้จักเลือกคำที่แม่นยำ และสามารถอธิบายได้แม้ไม่รู้คำนั้น',
    weight: '25%'
  },
  {
    id: 'gr',
    label: 'Grammatical Range & Accuracy',
    labelTh: 'Grammatical Range & Accuracy',
    descTh: 'ใช้โครงสร้างประโยคที่หลากหลาย เช่น relative clause, conditionals, passive voice โดยไม่ทำให้ความหมายผิด',
    weight: '25%'
  },
  {
    id: 'p',
    label: 'Pronunciation',
    labelTh: 'Pronunciation',
    descTh: 'ออกเสียงชัดเจน ใช้ stress และ intonation ถูกต้อง ฟังเข้าใจได้โดยไม่ต้องออกเสียงเป็น native speaker',
    weight: '25%'
  }
]

// ── Monthly speaking questions 2026 ────────────────────────────────────────

export type SpeakingTopicSet = {
  id: string
  part2: string
  cues: string[]
  part3Sample: string
}

export type SpeakingMonthGroup = {
  month: string
  monthTh: string
  period: string
  sets: SpeakingTopicSet[]
}

export const SPEAKING_MONTHLY_QUESTIONS_2026: SpeakingMonthGroup[] = [
  {
    month: 'January 2026',
    monthTh: 'มกราคม 2569',
    period: 'Jan 2026',
    sets: [
      {
        id: 'jan-01',
        part2: 'Describe a time when you felt very proud of someone',
        cues: ['Who the person was', 'What they did', 'Why you felt proud', 'How this affected you'],
        part3Sample: "Why is it important to acknowledge other people's achievements?"
      },
      {
        id: 'jan-02',
        part2: 'Describe a skill you have recently learned',
        cues: ['What the skill is', 'Why you decided to learn it', 'How you learned it', 'How useful it has been'],
        part3Sample: 'Do you think online learning is as effective as face-to-face learning?'
      },
      {
        id: 'jan-03',
        part2: 'Describe a place in your city that you enjoy visiting',
        cues: ['Where it is', 'What it looks like', 'What you usually do there', 'Why you like it'],
        part3Sample: 'How do public spaces affect the well-being of city residents?'
      },
      {
        id: 'jan-04',
        part2: 'Describe an interesting piece of news you heard recently',
        cues: ['What the news was about', 'Where you heard it', 'Why it was interesting', 'How you felt about it'],
        part3Sample: 'How has social media changed the way people consume news?'
      },
      {
        id: 'jan-05',
        part2: 'Describe a person who has had a major influence on your life',
        cues: ['Who this person is', 'How you know them', 'What influence they have had', 'Why their influence has been important'],
        part3Sample: 'Should schools teach students about famous historical figures more?'
      }
    ]
  },
  {
    month: 'February 2026',
    monthTh: 'กุมภาพันธ์ 2569',
    period: 'Feb 2026',
    sets: [
      {
        id: 'feb-01',
        part2: 'Describe a time when you helped someone',
        cues: ['Who you helped', 'What the situation was', 'How you helped', 'How you felt afterwards'],
        part3Sample: 'Do people in modern society help strangers as often as they used to?'
      },
      {
        id: 'feb-02',
        part2: 'Describe a building or structure that you find particularly interesting',
        cues: ['What and where it is', 'What it looks like', 'What it is used for', 'Why you find it interesting'],
        part3Sample: 'How important is it to preserve historical buildings in a city?'
      },
      {
        id: 'feb-03',
        part2: 'Describe a sport or physical activity you enjoy doing',
        cues: ['What it is', 'Where and how often you do it', 'Who you do it with', 'Why you enjoy it'],
        part3Sample: 'Why do some people struggle to maintain a regular exercise routine?'
      },
      {
        id: 'feb-04',
        part2: 'Describe a book or film that made a strong impression on you',
        cues: ['What it was about', 'When you read or watched it', 'Why it impressed you', 'What you learned from it'],
        part3Sample: 'Do films and books have a responsibility to portray society accurately?'
      },
      {
        id: 'feb-05',
        part2: 'Describe a traditional festival or celebration in your country',
        cues: ['What the festival is', 'When it takes place', 'How people celebrate it', 'Why it is important'],
        part3Sample: 'How are traditional celebrations changing in modern society?'
      }
    ]
  },
  {
    month: 'March 2026',
    monthTh: 'มีนาคม 2569',
    period: 'Mar 2026',
    sets: [
      {
        id: 'mar-01',
        part2: 'Describe a time when you had to make a difficult decision',
        cues: ['What the decision was', 'Why it was difficult', 'How you made the decision', 'What happened as a result'],
        part3Sample: 'To what extent do young people make decisions independently today?'
      },
      {
        id: 'mar-02',
        part2: 'Describe something you own that is very important to you',
        cues: ['What it is', 'How long you have had it', 'Why it is important to you', 'What you would do if you lost it'],
        part3Sample: 'Do material possessions make people happier? Why or why not?'
      },
      {
        id: 'mar-03',
        part2: 'Describe a journey or trip that you remember well',
        cues: ['Where you went', 'Who you went with', 'What happened during the journey', 'Why it was memorable'],
        part3Sample: 'How has the way people travel changed over the past few decades?'
      },
      {
        id: 'mar-04',
        part2: 'Describe a person whose work you find admirable',
        cues: ['Who this person is', 'What their work involves', 'Why you find it admirable', 'What influence they have had'],
        part3Sample: "What qualities make someone a good role model in today's world?"
      },
      {
        id: 'mar-05',
        part2: 'Describe a time when technology helped you solve a problem',
        cues: ['What the problem was', 'What technology you used', 'How it helped', 'What you learned from the experience'],
        part3Sample: 'Are people becoming too dependent on technology in their daily lives?'
      }
    ]
  },
  {
    month: 'April 2026',
    monthTh: 'เมษายน 2569',
    period: 'Apr 2026',
    sets: [
      {
        id: 'apr-01',
        part2: 'Describe a time when you had to wait for a long time for something',
        cues: ['What you were waiting for', 'Where you were', 'How you felt while waiting', 'What happened in the end'],
        part3Sample: 'Why do some people find it harder to be patient than others?'
      },
      {
        id: 'apr-02',
        part2: 'Describe a place in nature that you find beautiful or relaxing',
        cues: ['Where it is', 'What it looks like', 'How often you go there', 'Why you like it'],
        part3Sample: 'How important is access to natural environments for people living in cities?'
      },
      {
        id: 'apr-03',
        part2: 'Describe an important conversation you had recently',
        cues: ['Who you had it with', 'What it was about', 'Where it took place', 'Why it was important'],
        part3Sample: 'How has communication between people changed with the rise of smartphones?'
      },
      {
        id: 'apr-04',
        part2: 'Describe a family tradition that is important to you',
        cues: ['What the tradition is', 'When and how it started', 'How your family celebrates it', 'Why it is important to you'],
        part3Sample: 'Why do you think some families maintain traditions while others let them die out?'
      },
      {
        id: 'apr-05',
        part2: 'Describe a time when you worked as part of a team',
        cues: ['What the project or task was', 'Who you worked with', 'What your role was', 'What the outcome was'],
        part3Sample: 'What are the advantages and disadvantages of working in a team versus working alone?'
      }
    ]
  },
  {
    month: 'May 2026',
    monthTh: 'พฤษภาคม 2569',
    period: 'May 2026',
    sets: [
      {
        id: 'may-01',
        part2: 'Describe an object that you consider to be beautiful',
        cues: ['What it is', 'Where you saw or found it', 'What it looks like', 'Why you find it beautiful'],
        part3Sample: "How do people's ideas of beauty differ across cultures?"
      },
      {
        id: 'may-02',
        part2: 'Describe a time when you had to overcome a significant challenge',
        cues: ['What the challenge was', 'How you dealt with it', 'Who helped you', 'What you learned from it'],
        part3Sample: 'Do you think people learn more from failure than from success? Why?'
      },
      {
        id: 'may-03',
        part2: 'Describe a city or country you would like to visit in the future',
        cues: ['Where it is', 'Why you want to go there', 'What you would do there', 'Who you would go with'],
        part3Sample: 'How does tourism benefit and harm local communities at the same time?'
      },
      {
        id: 'may-04',
        part2: 'Describe a piece of music or a song that is meaningful to you',
        cues: ['What it is', 'When you first heard it', 'Why it is meaningful', 'How it makes you feel'],
        part3Sample: 'In what ways can music bring people from different cultures together?'
      },
      {
        id: 'may-05',
        part2: 'Describe a time when you gave advice to someone',
        cues: ['Who you gave advice to', 'What the situation was', 'What advice you gave', 'Whether the advice was helpful'],
        part3Sample: 'To what extent should people seek advice from others before making important decisions?'
      }
    ]
  },
  {
    month: 'June 2026',
    monthTh: 'มิถุนายน 2569',
    period: 'Jun 2026',
    sets: [
      {
        id: 'jun-01',
        part2: 'Describe an interesting animal you know about',
        cues: ['What animal it is', 'Where you learned about it', 'What makes it interesting', 'Whether you have ever seen it in person'],
        part3Sample: 'What responsibilities do humans have towards endangered species?'
      },
      {
        id: 'jun-02',
        part2: 'Describe a time when you were pleasantly surprised by something',
        cues: ['What the situation was', 'When and where it happened', 'Why you were surprised', 'How it made you feel'],
        part3Sample: 'Do you think people today expect too much from life? Why or why not?'
      },
      {
        id: 'jun-03',
        part2: 'Describe a creative activity that you enjoy doing',
        cues: ['What the activity is', 'When you started doing it', 'How you do it', 'Why you enjoy it'],
        part3Sample: 'How important is creativity in the modern workplace?'
      },
      {
        id: 'jun-04',
        part2: 'Describe a language other than your own that you would like to learn',
        cues: ['What language it is', 'Why you want to learn it', 'How you might learn it', 'What challenges you might face'],
        part3Sample: 'How does learning a foreign language change the way a person thinks?'
      },
      {
        id: 'jun-05',
        part2: 'Describe a time when someone gave you feedback that was helpful',
        cues: ['Who gave you the feedback', 'What it was about', 'How you felt when you received it', 'How it helped you improve'],
        part3Sample: 'How should teachers provide feedback to students in a constructive way?'
      }
    ]
  }
]

// ── Featured sample answer — "Describe a building" ─────────────────────────

export type SampleAnswerSegment = {
  id: string
  text: string
  highlights: SampleAnswerHighlight[]
}

export type SampleAnswerHighlight = {
  phrase: string
  kind: 'vocabulary' | 'grammar'
  labelTh: string
  descTh: string
  exampleTh?: string
}

export const SPEAKING_SAMPLE_ANSWER: {
  topicLabel: string
  cueCard: string[]
  band: string
  durationLabel: string
  segments: SampleAnswerSegment[]
  vocabHighlights: SampleAnswerHighlight[]
  grammarHighlights: SampleAnswerHighlight[]
} = {
  topicLabel: 'Describe a building that you particularly like',
  cueCard: [
    'What and where it is',
    'What it looks like',
    'What it is used for',
    'Why you like it'
  ],
  band: 'Band 7+',
  durationLabel: '~2 นาที',
  segments: [
    {
      id: 'seg-1',
      text: "I'd like to talk about the Bangkok Art and Culture Centre — a building I find truly remarkable. It's located right in the heart of the city, just beside the National Stadium BTS station, so it's very accessible to everyone.",
      highlights: [
        {
          phrase: 'truly remarkable',
          kind: 'vocabulary',
          labelTh: 'truly remarkable (adj. phr.)',
          descTh: 'น่าทึ่ง / น่าประทับใจจริงๆ — ใช้ "truly" เพื่อ intensify คำคุณศัพท์ ฟังดู natural กว่า "very good"',
          exampleTh: 'The view from the rooftop was truly remarkable.'
        },
        {
          phrase: 'right in the heart of the city',
          kind: 'vocabulary',
          labelTh: 'right in the heart of (prep. phr.)',
          descTh: 'ตรงกลาง / ใจกลาง — "right" ในที่นี้ใช้เพื่อ emphasize ตำแหน่ง ไม่ใช่แปลว่า "ขวา"',
          exampleTh: 'Our office is right in the heart of the business district.'
        }
      ]
    },
    {
      id: 'seg-2',
      text: "What makes it stand out is the architecture — it has this distinctive circular, ring-like structure that's quite eye-catching compared to the modern skyscrapers surrounding it. The exterior is mostly white and grey, and the inside features an open-plan design with galleries wrapping around a central atrium.",
      highlights: [
        {
          phrase: 'stand out',
          kind: 'vocabulary',
          labelTh: 'stand out (v. phr.)',
          descTh: 'โดดเด่น / แตกต่างจากสิ่งอื่น — phrasal verb ที่ใช้บรรยายความโดดเด่น เหมาะกับ Band 7+',
          exampleTh: 'Her presentation really stood out among all the others.'
        },
        {
          phrase: 'eye-catching',
          kind: 'vocabulary',
          labelTh: 'eye-catching (adj.)',
          descTh: 'ดึงดูดสายตา — คำคุณศัพท์ที่ดูดีกว่า "interesting" หรือ "beautiful" เพราะเฉพาะเจาะจงกว่า',
          exampleTh: "The building's eye-catching facade attracts thousands of visitors every month."
        },
        {
          phrase: 'open-plan design',
          kind: 'vocabulary',
          labelTh: 'open-plan design (n. phr.)',
          descTh: 'การออกแบบแบบเปิดโล่ง — คำเฉพาะทางสถาปัตยกรรม แสดง Lexical Resource ที่ดี',
          exampleTh: 'Many modern offices prefer an open-plan design to encourage collaboration.'
        }
      ]
    },
    {
      id: 'seg-3',
      text: "The building serves as a cultural venue — it hosts art exhibitions, film screenings, and live performances throughout the year, which has made it a real landmark for Bangkok's creative community.",
      highlights: [
        {
          phrase: 'serves as',
          kind: 'grammar',
          labelTh: 'serves as (v. phr.) — การบรรยายหน้าที่/บทบาท',
          descTh: 'แปลว่า "ทำหน้าที่เป็น" ดีกว่า "is used as" เพราะฟังดู sophisticated กว่า',
          exampleTh: 'This area serves as a meeting point for local artists.'
        },
        {
          phrase: 'a real landmark',
          kind: 'vocabulary',
          labelTh: 'landmark (n.)',
          descTh: 'สถานที่สำคัญ / สัญลักษณ์ — ใช้แทน "famous place" ทำให้ฟังดู precise กว่า',
          exampleTh: 'The Eiffel Tower has become an iconic landmark in Paris.'
        }
      ]
    },
    {
      id: 'seg-4',
      text: "What I particularly appreciate is the atmosphere inside. Even though it's located in one of the busiest parts of the city, once you step inside, it feels surprisingly peaceful and airy — almost breathtaking. Every time I visit, I find something new to discover, whether it be a contemporary art installation, a photography exhibition, or just watching people going about their creative pursuits.",
      highlights: [
        {
          phrase: 'breathtaking',
          kind: 'vocabulary',
          labelTh: 'breathtaking (adj.)',
          descTh: 'งดงาม / ตระการตา — แรงกว่า "beautiful" หรือ "amazing" แสดง Lexical Resource ที่ high กว่า',
          exampleTh: 'The view from the mountain top was absolutely breathtaking.'
        },
        {
          phrase: 'whether it be',
          kind: 'grammar',
          labelTh: '"Whether it be…" — Concession structure สำหรับ listing',
          descTh: 'ใช้ list ตัวอย่างหลายอย่างพร้อมกัน ฟังดู sophisticated มาก เทียบเท่า "such as" แต่ elegant กว่า',
          exampleTh: 'I enjoy all kinds of music, whether it be classical, jazz, or rock.'
        },
        {
          phrase: 'going about their creative pursuits',
          kind: 'grammar',
          labelTh: '"going about + noun" — Gerund phrase',
          descTh: '"go about + noun/gerund" แปลว่า "ดำเนินกิจกรรม/งาน" — แสดง Grammar Range ที่ดีมาก',
          exampleTh: 'People were quietly going about their daily routines.'
        }
      ]
    },
    {
      id: 'seg-5',
      text: "I also appreciate the fact that it's free to enter, which is actually quite rare in Bangkok. I think that's what makes it truly special — it's a place that's accessible to everyone, regardless of their background. Overall, it manages to combine architecture, art, and community in a way that very few buildings do, and every visit leaves a lasting impression on me.",
      highlights: [
        {
          phrase: 'regardless of their background',
          kind: 'vocabulary',
          labelTh: 'regardless of (prep.)',
          descTh: 'โดยไม่คำนึงถึง / ไม่ว่าจะเป็น — connective ที่แสดง Fluency และ Coherence สูง',
          exampleTh: 'The program is open to all students, regardless of their academic level.'
        },
        {
          phrase: 'leaves a lasting impression',
          kind: 'vocabulary',
          labelTh: 'leave a lasting impression (v. phr.)',
          descTh: 'ฝากความประทับใจที่ยาวนาน — สำนวนที่ดูเป็น native speaker มาก ดีกว่า "I remember it well"',
          exampleTh: 'Her speech left a lasting impression on everyone in the room.'
        }
      ]
    }
  ],
  vocabHighlights: [
    { phrase: 'truly remarkable', kind: 'vocabulary', labelTh: 'truly remarkable', descTh: 'น่าทึ่ง / น่าประทับใจจริงๆ' },
    { phrase: 'eye-catching', kind: 'vocabulary', labelTh: 'eye-catching', descTh: 'ดึงดูดสายตา / โดดเด่น' },
    { phrase: 'open-plan design', kind: 'vocabulary', labelTh: 'open-plan design', descTh: 'การออกแบบแบบเปิดโล่ง' },
    { phrase: 'landmark', kind: 'vocabulary', labelTh: 'landmark', descTh: 'สถานที่สำคัญ / สัญลักษณ์ของเมือง' },
    { phrase: 'breathtaking', kind: 'vocabulary', labelTh: 'breathtaking', descTh: 'งดงาม / ตระการตา' },
    { phrase: 'leaves a lasting impression', kind: 'vocabulary', labelTh: 'leaves a lasting impression', descTh: 'ฝากความประทับใจที่ยาวนาน' }
  ],
  grammarHighlights: [
    { phrase: 'Whether it be', kind: 'grammar', labelTh: '"Whether it be…" — listing examples', descTh: 'ใช้ list ตัวอย่างหลายอย่างพร้อมกันได้อย่าง elegant ฟังดู Band 7+ ชัดเจน' },
    { phrase: 'serves as', kind: 'grammar', labelTh: '"serves as" — บรรยายหน้าที่', descTh: 'แทนที่ "is used as" ได้ดีกว่า — แสดง Grammar Range สูง' },
    { phrase: 'going about their creative pursuits', kind: 'grammar', labelTh: '"go about + noun" — Gerund phrase', descTh: 'แสดง Grammar Range ที่ดีมากสำหรับ Band 7+' }
  ]
}

// ── Locked sample teaser cards ──────────────────────────────────────────────

export type LockedSampleTeaser = {
  id: string
  topic: string
  bandLabel: string
  durationLabel: string
}

export const LOCKED_SAMPLE_TEASERS: LockedSampleTeaser[] = [
  { id: 'locked-1', topic: 'Describe an old person you admire', bandLabel: 'Band 7+', durationLabel: '~2 นาที' },
  { id: 'locked-2', topic: "Describe a time you visited someone's workplace", bandLabel: 'Band 7', durationLabel: '~2 นาที' },
  { id: 'locked-3', topic: 'Describe a memorable journey you went on', bandLabel: 'Band 7+', durationLabel: '~2 นาที' },
  { id: 'locked-4', topic: 'Describe a skill you would like to learn', bandLabel: 'Band 7', durationLabel: '~2 นาที' },
  { id: 'locked-5', topic: 'Describe a film that made you think deeply', bandLabel: 'Band 7.5', durationLabel: '~2 นาที' },
  { id: 'locked-6', topic: 'Describe a place in nature you love to visit', bandLabel: 'Band 7+', durationLabel: '~2 นาที' }
]
