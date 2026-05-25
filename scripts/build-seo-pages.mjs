import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')

const siteUrl = 'https://www.englishplan-ielts.com'
const appUrl = `${siteUrl}/?trial=1`
const courseUrl = 'https://www.language-plan.com/courses/0-day-speaking-challenge-for-ielts'
const youtubeChannelUrl = 'https://www.youtube.com/@DoyLanguagePlan'
const organizationName = 'English Plan Learning Space'

const videos = {
  speakingApp: {
    id: '-qRSbZiDarw',
    title: 'Tutorial: การใช้ app เพื่อพัฒนา IELTS SPEAKING',
    uploadDate: '2026-05-01',
    description: 'วิธีใช้ English Plan app เพื่อฝึก IELTS Speaking, เก็บ note, ใช้ report ส่วนตัว และซ้อม full mock test'
  },
  readingNine: {
    id: 'P20v11Jina0',
    title: '3 สิ่งที่คนได้ Reading 9.0 ไม่ทำ',
    uploadDate: '2025-06-20',
    description: 'บทเรียน IELTS Reading สำหรับคนไทยที่ต้องการลดกับดัก keyword และอ่านด้วย evidence'
  },
  punctuation: {
    id: '6HiD4dANp0E',
    title: 'ใช้ punctuation ให้ได้ Writing Band 7',
    uploadDate: '2025-04-17',
    description: 'บทเรียน IELTS Writing Band 7 เรื่อง punctuation, run-on sentence และการใช้ conjunction'
  },
  vocabulary: {
    id: 'u706bgVIpHw',
    title: 'เรียนคำศัพท์ IELTS Speaking กับ Rosé',
    uploadDate: '2025-03-24',
    description: 'วิเคราะห์ lexical resource ตามเกณฑ์ IELTS Speaking เพื่อฝึกคำศัพท์และ collocation'
  },
  speakingBand: {
    id: 'WGQSYQeTQcM',
    title: 'JENNIE BLACKPINK จะได้ IELTS SPEAKING Band 7 ไหม??',
    uploadDate: '2025-03-18',
    description: 'ตัวอย่างการวิเคราะห์ IELTS Speaking Band 7 ผ่านเกณฑ์ fluency, vocabulary, grammar และ pronunciation'
  },
  writingSeven: {
    id: 'sV0Lou4OCLk',
    title: 'ทำยังไงให้ได้ IELTS Writing Academic Band 7',
    uploadDate: '2025-03-01',
    description: 'แนวทางฝึก IELTS Writing Academic Band 7 สำหรับผู้เรียนไทย'
  },
  generalTraining: {
    id: 'wX-247WVZKw',
    title: 'เทคนิคพิชิต IELTS General Reading / Writing',
    uploadDate: '2025-02-06',
    description: 'เทคนิค IELTS General Training Reading และ Writing สำหรับคนไทย'
  }
}

const sharedFaq = [
  {
    question: 'เว็บนี้เหมาะกับผู้เรียน IELTS ในไทยแบบไหน?',
    answer:
      'เหมาะกับผู้เรียนที่ต้องการฝึก IELTS ด้วยคำอธิบายภาษาไทย, mock test, Speaking feedback, Reading evidence และระบบบันทึกจุดอ่อนของตัวเอง'
  },
  {
    question: 'ใช้ฝึก Speaking ได้อย่างไร?',
    answer:
      'ผู้เรียนสามารถอัดคำตอบ Speaking, ซ้อม Part 1, Part 2 และ Part 3, ดู report ส่วนตัว และนำประโยคที่ควรแก้ไปเก็บใน notebook เพื่อฝึกซ้ำ'
  },
  {
    question: 'มีบทเรียนจาก YouTube ของครูพี่ดอยด้วยไหม?',
    answer:
      'มีการเชื่อมบทเรียน YouTube จากช่อง ENGLISH PLAN / @DoyLanguagePlan เข้ากับหน้าฝึก เพื่อให้ผู้เรียนดูตัวอย่างก่อนกลับมาซ้อมในแอป'
  }
]

const englishFaq = [
  {
    question: 'Who is this IELTS prep site for?',
    answer:
      'It is built for Thai learners who want IELTS practice with Thai explanations, mock tests, Speaking feedback, Reading evidence and a personal notebook.'
  },
  {
    question: 'How does the Speaking practice work?',
    answer:
      'Learners can record IELTS Speaking Part 1, Part 2 and Part 3 answers, review a personal report, and save useful corrections for repeat practice.'
  },
  {
    question: 'Does the site use Doy’s YouTube lessons?',
    answer:
      'Yes. Pages connect relevant ENGLISH PLAN / @DoyLanguagePlan YouTube lessons with the practice app so learners can watch a lesson and then train the same skill.'
  }
]

const thaiPages = [
  {
    slug: '/th/',
    title: 'ติว IELTS ออนไลน์สำหรับคนไทย | English Plan IELTS Prep',
    description:
      'ฝึก IELTS Speaking, Writing, Reading และ Listening พร้อม mock test, feedback ภาษาไทย, notebook และบทเรียนจากครูพี่ดอย ENGLISH PLAN',
    h1: 'ติว IELTS ออนไลน์สำหรับคนไทย',
    kicker: 'IELTS prep Thailand',
    lead:
      'แพลตฟอร์มฝึก IELTS ที่รวม Speaking mock, Writing guide, Reading evidence, Listening practice และบทเรียน YouTube ของครูพี่ดอยไว้ในที่เดียว',
    cta: 'ลองใช้ IELTS app',
    secondaryCta: 'ดูคอร์ส Speaking Band 7+',
    heroVideo: videos.speakingApp,
    clusters: [
      ['IELTS Speaking Practice', 'ซ้อมตอบ Part 1, Part 2, Part 3 พร้อมบันทึกเสียงและ report ส่วนตัว'],
      ['IELTS Reading Practice', 'ฝึกอ่านแบบหา evidence, keyword trap และเฉลยภาษาไทย'],
      ['IELTS Writing Band 7', 'เรียนโครงสร้างคำตอบ, punctuation และข้อผิดพลาดที่ทำให้คะแนนไม่ขึ้น'],
      ['IELTS Mock Test', 'ซ้อมเหมือนสอบจริงและเก็บประวัติคะแนนเพื่อวางแผนรอบต่อไป']
    ],
    videos: [videos.speakingApp, videos.readingNine, videos.punctuation, videos.vocabulary],
    faq: sharedFaq,
    focusKeywords: ['ติว IELTS', 'คอร์ส IELTS ออนไลน์', 'IELTS speaking practice', 'IELTS mock test']
  },
  {
    slug: '/th/ielts-speaking-practice/',
    title: 'IELTS Speaking Practice ออนไลน์ พร้อม Feedback ภาษาไทย',
    description:
      'ฝึก IELTS Speaking Part 1, Part 2, Part 3 ด้วยระบบอัดเสียง mock test, sample answer, notebook และบทเรียนวิดีโอจาก ENGLISH PLAN',
    h1: 'IELTS Speaking Practice พร้อม Feedback ภาษาไทย',
    kicker: 'Speaking Part 1-3',
    lead:
      'ซ้อมพูดแบบมีเป้าหมาย เห็นคำถามบนหน้าจอ อัดคำตอบ เก็บประโยคที่ควรแก้ และใช้บทเรียนวิดีโอของครูพี่ดอยเป็นตัวอย่างก่อนฝึกจริง',
    cta: 'ซ้อม Speaking ในแอป',
    secondaryCta: 'เรียน Speaking Band 7+',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Part 1', 'ตอบให้ชัด กระชับ และมี detail พอโดยไม่ท่องจำ'],
      ['Part 2', 'ฝึก cue card, 1-minute prep และเล่าให้ครบ 2 นาที'],
      ['Part 3', 'ขยายเหตุผล เปรียบเทียบ และตอบแบบ abstract มากขึ้น'],
      ['Personal notebook', 'บันทึก grammar, collocation และตัวอย่างคำตอบที่ควรฝึกซ้ำ']
    ],
    videos: [videos.speakingApp, videos.speakingBand, videos.vocabulary],
    faq: [
      ...sharedFaq,
      {
        question: 'ควรซ้อม IELTS Speaking วันละกี่นาที?',
        answer:
          'เริ่มจากวันละ 20-30 นาทีพอ โดยสลับระหว่างตอบคำถามจริง ฟังคำตอบตัวอย่าง และแก้จุดอ่อนจาก report ส่วนตัว'
      }
    ],
    focusKeywords: ['IELTS Speaking Practice', 'ฝึกพูด IELTS', 'IELTS Speaking Part 2', 'IELTS Speaking Band 7']
  },
  {
    slug: '/th/ielts-speaking-band-7/',
    title: 'IELTS Speaking Band 7 | วิธีฝึกสำหรับคนไทย',
    description:
      'แผนฝึก IELTS Speaking Band 7 สำหรับคนไทย ครอบคลุม fluency, vocabulary, grammar, pronunciation และตัวอย่างวิดีโอจากครูพี่ดอย',
    h1: 'IELTS Speaking Band 7 ต้องฝึกอะไรบ้าง',
    kicker: 'Band 7 roadmap',
    lead:
      'หน้าเริ่มต้นสำหรับคนที่อยากพูดให้เป็นธรรมชาติขึ้น ลดคำซ้ำ เพิ่มเหตุผล และเข้าใจว่าคะแนน Band 7 ไม่ได้มาจากคำยากอย่างเดียว',
    cta: 'เริ่ม mock Speaking',
    secondaryCta: 'สมัครคอร์ส Band 7+',
    heroVideo: videos.speakingBand,
    clusters: [
      ['Fluency', 'ตอบต่อเนื่องโดยไม่ pause นานและไม่วนคำเดิม'],
      ['Lexical resource', 'ใช้คำที่แม่นกับ topic และ collocation ที่เป็นธรรมชาติ'],
      ['Grammar range', 'ผสม simple, complex และ conditional sentence อย่างปลอดภัย'],
      ['Pronunciation', 'เน้น clarity, stress และ chunking มากกว่าการเลียน accent']
    ],
    videos: [videos.speakingBand, videos.vocabulary, videos.speakingApp],
    faq: sharedFaq,
    focusKeywords: ['IELTS Speaking Band 7', 'วิธีได้ Speaking 7', 'ติว IELTS Speaking']
  },
  {
    slug: '/th/ielts-speaking-part-1/',
    title: 'IELTS Speaking Part 1 Practice | คำถามและวิธีตอบ',
    description:
      'ฝึก IELTS Speaking Part 1 สำหรับคนไทย พร้อมแนวตอบสั้น กระชับ เป็นธรรมชาติ และระบบบันทึกคำตอบในแอป',
    h1: 'IELTS Speaking Part 1 ตอบยังไงให้ดูเป็นธรรมชาติ',
    kicker: 'Part 1 answers',
    lead:
      'ฝึกตอบคำถามเรื่องตัวเอง งาน เรียน บ้าน เมือง งานอดิเรก และ topic ใกล้ตัว โดยเพิ่มเหตุผลเล็กน้อยแทนการตอบสั้นเกินไป',
    cta: 'ฝึก Part 1',
    secondaryCta: 'ดูคอร์ส Speaking',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Direct answer', 'ตอบคำถามก่อนแล้วค่อยเสริมเหตุผล'],
      ['Tiny example', 'เพิ่มตัวอย่างเล็กๆ เพื่อให้คำตอบมีชีวิต'],
      ['Natural vocabulary', 'ใช้คำง่ายแต่แม่นและไม่แปลตรงจากไทย'],
      ['Recording loop', 'อัดเสียง ฟังซ้ำ และแก้ทีละจุด']
    ],
    videos: [videos.speakingApp, videos.vocabulary],
    faq: sharedFaq,
    focusKeywords: ['IELTS Speaking Part 1', 'คำถาม IELTS Speaking Part 1', 'ฝึกพูด IELTS Part 1']
  },
  {
    slug: '/th/ielts-speaking-part-2/',
    title: 'IELTS Speaking Part 2 Cue Card | ฝึกพูด 2 นาที',
    description:
      'ฝึก IELTS Speaking Part 2 cue card พร้อมวิธีวางคำตอบ 1 นาทีแรก, เล่าเรื่อง 2 นาที และเก็บ feedback ใน notebook',
    h1: 'IELTS Speaking Part 2 Cue Card แบบไม่หลุดประเด็น',
    kicker: 'Cue card training',
    lead:
      'Part 2 ต้องเล่าให้ครบ มีโครงเรื่อง และควบคุมเวลา หน้าเว็บนี้พาไปฝึกจาก cue card สู่คำตอบที่ยาวพอและไม่ท่องจำ',
    cta: 'ฝึก Part 2',
    secondaryCta: 'ดูบทเรียน YouTube',
    heroVideo: videos.speakingApp,
    clusters: [
      ['1-minute prep', 'จด keyword ที่ช่วยเล่าเรื่อง ไม่ใช่เขียนทั้งประโยค'],
      ['Story arc', 'เปิดเรื่อง ใส่ detail และปิดด้วย reflection'],
      ['Time control', 'ฝึกพูดให้ครบช่วง 1:40-2:00 นาที'],
      ['Upgrade language', 'เปลี่ยนคำซ้ำเป็น collocation ที่ใช้ได้จริง']
    ],
    videos: [videos.speakingApp, videos.speakingBand, videos.vocabulary],
    faq: sharedFaq,
    focusKeywords: ['IELTS Speaking Part 2', 'IELTS cue card', 'ฝึกพูด 2 นาที IELTS']
  },
  {
    slug: '/th/ielts-speaking-part-3/',
    title: 'IELTS Speaking Part 3 | วิธีตอบคำถามยากให้ได้คะแนน',
    description:
      'ฝึก IELTS Speaking Part 3 สำหรับคำถาม abstract, opinion, compare และ cause-effect พร้อมแนวคิดตอบให้เป็น Band 7',
    h1: 'IELTS Speaking Part 3 ตอบคำถามยากอย่างมีเหตุผล',
    kicker: 'Discussion answers',
    lead:
      'Part 3 วัดการขยายความและจัดความคิด หน้าเว็บนี้เชื่อมคำถามยากเข้ากับ framework ที่ช่วยให้ตอบเป็นระบบขึ้น',
    cta: 'ฝึก Part 3',
    secondaryCta: 'เรียน Speaking Band 7+',
    heroVideo: videos.speakingBand,
    clusters: [
      ['Opinion', 'ตอบจุดยืนพร้อมเหตุผลและตัวอย่าง'],
      ['Compare', 'เทียบอดีต-ปัจจุบัน, คนรุ่นใหม่-รุ่นเก่า, เมือง-ชนบท'],
      ['Cause and effect', 'อธิบายสาเหตุ ผลลัพธ์ และข้อยกเว้น'],
      ['Abstract vocabulary', 'เพิ่มคำเชื่อมและ noun phrase ที่เหมาะกับคำถามเชิงสังคม']
    ],
    videos: [videos.speakingBand, videos.vocabulary, videos.speakingApp],
    faq: sharedFaq,
    focusKeywords: ['IELTS Speaking Part 3', 'คำถาม IELTS Part 3', 'IELTS discussion answer']
  },
  {
    slug: '/th/ielts-writing-checker/',
    title: 'IELTS Writing Checker และคู่มือแก้ Essay สำหรับคนไทย',
    description:
      'ฝึก IELTS Writing ด้วย checklist, grammar focus, punctuation lesson และแนวทางแก้ Task 1 / Task 2 เพื่อไป Band 7',
    h1: 'IELTS Writing Checker ที่ช่วยให้รู้ว่าควรแก้อะไร',
    kicker: 'Writing feedback',
    lead:
      'Writing ไม่ควรแก้แค่คำศัพท์ หน้าเว็บนี้พาเช็ก task response, coherence, grammar, punctuation และข้อผิดพลาดที่ทำให้ essay อ่านไม่ลื่น',
    cta: 'เปิด Writing guide',
    secondaryCta: 'ดูคอร์ส Writing',
    heroVideo: videos.punctuation,
    clusters: [
      ['Task response', 'ตอบโจทย์ครบและไม่หลุดประเด็น'],
      ['Coherence', 'จัด paragraph และ linking ให้คนตรวจตามทัน'],
      ['Grammar control', 'ลด run-on sentence และ sentence fragment'],
      ['Band 7 polishing', 'เพิ่ม precision โดยไม่ทำให้ประโยคเสี่ยงเกินไป']
    ],
    videos: [videos.punctuation, videos.writingSeven],
    faq: sharedFaq,
    focusKeywords: ['IELTS Writing Checker', 'ตรวจ Writing IELTS', 'IELTS Writing Band 7']
  },
  {
    slug: '/th/ielts-writing-task-2/',
    title: 'IELTS Writing Task 2 | โครงสร้าง Essay Band 7',
    description:
      'เรียน IELTS Writing Task 2 สำหรับคนไทย ตั้งแต่โครงสร้าง essay, idea development, paragraph และ grammar ที่ปลอดภัยสำหรับ Band 7',
    h1: 'IELTS Writing Task 2 เขียนให้ชัดก่อนเขียนให้ยาก',
    kicker: 'Task 2 essay',
    lead:
      'Task 2 ต้องตอบคำถามให้ตรงและพัฒนาเหตุผลให้พอ ไม่ใช่แค่จำ template หน้าเว็บนี้ช่วยจัดแผนฝึกแบบค่อยเป็นค่อยไป',
    cta: 'ฝึก Writing',
    secondaryCta: 'ดูบทเรียน Writing',
    heroVideo: videos.writingSeven,
    clusters: [
      ['Question type', 'แยก opinion, discussion, problem-solution และ advantages-disadvantages'],
      ['Body paragraph', 'วาง topic sentence, explanation และ example'],
      ['Language upgrade', 'ใช้คำเชื่อมกับ clause ให้แม่น'],
      ['Error log', 'เก็บ pattern ที่ผิดบ่อยเพื่อแก้รอบต่อไป']
    ],
    videos: [videos.writingSeven, videos.punctuation],
    faq: sharedFaq,
    focusKeywords: ['IELTS Writing Task 2', 'IELTS essay Band 7', 'ติว Writing IELTS']
  },
  {
    slug: '/th/ielts-reading-practice/',
    title: 'IELTS Reading Practice พร้อมเฉลยภาษาไทย',
    description:
      'ฝึก IELTS Reading สำหรับคนไทยด้วยข้อสอบ, evidence, keyword trap, paraphrase และบทเรียน Reading 9.0 จาก ENGLISH PLAN',
    h1: 'IELTS Reading Practice ที่สอนให้หา Evidence',
    kicker: 'Reading evidence',
    lead:
      'Reading คะแนนขึ้นเมื่อรู้ว่าคำตอบอยู่ตรงไหนและ trap คืออะไร หน้าเว็บนี้พาเข้า bank ฝึก Reading พร้อมเฉลยไทยและบทเรียนจากครูพี่ดอย',
    cta: 'ฝึก Reading',
    secondaryCta: 'ดูบทเรียน Reading',
    heroVideo: videos.readingNine,
    clusters: [
      ['True / False / Not Given', 'แยก contradiction กับ not mentioned ให้ชัด'],
      ['Matching headings', 'อ่าน main idea ไม่ไล่คำเหมือน'],
      ['Fill in the blanks', 'ดู grammar slot และ paraphrase'],
      ['Monthly practice', 'ใช้ชุดฝึกรายเดือนเพื่อเก็บ progress']
    ],
    videos: [videos.readingNine],
    faq: sharedFaq,
    focusKeywords: ['IELTS Reading Practice', 'เฉลย IELTS Reading ภาษาไทย', 'IELTS Reading 9.0']
  },
  {
    slug: '/th/ielts-listening-practice/',
    title: 'IELTS Listening Practice ออนไลน์ พร้อม Dictation และเฉลย',
    description:
      'ฝึก IELTS Listening ด้วย section practice, spelling drill, dictation, transcript และระบบเก็บคะแนนสำหรับคนไทย',
    h1: 'IELTS Listening Practice ที่ไม่ใช่แค่กดฟังแล้วตรวจ',
    kicker: 'Listening drills',
    lead:
      'Listening ต้องแก้ทั้ง spelling, synonym, number, distractor และ note completion หน้าเว็บนี้รวมเส้นทางฝึกจากพื้นฐานถึง mock test',
    cta: 'ฝึก Listening',
    secondaryCta: 'เข้า IELTS app',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Spelling', 'ซ้อมคำที่สะกดผิดบ่อยใน Part 1'],
      ['Distractors', 'จับคำเปลี่ยนคำตอบในบทสนทนา'],
      ['Section practice', 'แยกฝึก Section 1-4 ตามจุดอ่อน'],
      ['Transcript review', 'ย้อนดูเหตุผลของคำตอบหลังทำเสร็จ']
    ],
    videos: [videos.speakingApp],
    faq: sharedFaq,
    focusKeywords: ['IELTS Listening Practice', 'ฝึก Listening IELTS', 'IELTS dictation']
  },
  {
    slug: '/th/ielts-mock-test/',
    title: 'IELTS Mock Test ออนไลน์ | ซ้อมสอบและเก็บ Progress',
    description:
      'ซ้อม IELTS mock test ออนไลน์สำหรับ Speaking, Reading, Listening และ Writing พร้อม report, notebook และแผนฝึกต่อ',
    h1: 'IELTS Mock Test ออนไลน์ที่บอกว่าต้องฝึกอะไรต่อ',
    kicker: 'Full mock workflow',
    lead:
      'Mock test ที่ดีไม่ควรจบแค่คะแนน หน้าเว็บนี้พาไปใช้ report, notebook และบทเรียนที่เกี่ยวข้องเพื่อเปลี่ยนผลสอบจำลองเป็นแผนฝึก',
    cta: 'เริ่ม Mock Test',
    secondaryCta: 'ดูวิธีใช้แอป',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Speaking mock', 'อัดคำตอบและดู feedback ราย criteria'],
      ['Reading mock', 'เก็บคำตอบพร้อม evidence review'],
      ['Listening mock', 'ตรวจ answer format และ distractor'],
      ['Study loop', 'ใช้ report เลือกบทเรียนที่ควรดูต่อ']
    ],
    videos: [videos.speakingApp, videos.readingNine, videos.punctuation],
    faq: sharedFaq,
    focusKeywords: ['IELTS Mock Test', 'สอบ IELTS ออนไลน์', 'IELTS full mock test']
  },
  {
    slug: '/th/pricing/',
    title: 'ราคาและแพ็กเกจ IELTS Prep | English Plan',
    description:
      'ดูทางเลือกการเริ่มฝึก IELTS กับ English Plan ทั้งทดลองใช้ IELTS app และคอร์ส Speaking Band 7+ สำหรับผู้เรียนไทย',
    h1: 'เริ่มฝึก IELTS ด้วยแพ็กเกจที่เหมาะกับเป้าหมาย',
    kicker: 'Pricing',
    lead:
      'เริ่มจาก trial เพื่อดู report ของตัวเอง หรือเรียนคอร์ส Speaking Band 7+ ถ้าต้องการโครงสร้างฝึกและคำแนะนำละเอียดกว่า',
    cta: 'ลองใช้แอป',
    secondaryCta: 'ดูคอร์ส',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Trial', 'ลองใช้เครื่องมือเพื่อดูว่าจุดอ่อนอยู่ตรงไหน'],
      ['Speaking course', 'เหมาะกับคนต้องการเป้า Band 7+ และ feedback ต่อเนื่อง'],
      ['Reading bank', 'เหมาะกับคนต้องการฝึก evidence และข้อสอบจำนวนมาก'],
      ['Mock workflow', 'เหมาะกับคนใกล้สอบและต้องการวัด progress']
    ],
    videos: [videos.speakingApp],
    faq: sharedFaq,
    focusKeywords: ['ราคา IELTS course', 'คอร์ส IELTS ออนไลน์', 'English Plan IELTS']
  },
  {
    slug: '/th/about-pdoy/',
    title: 'ครูพี่ดอย ENGLISH PLAN | IELTS Prep สำหรับคนไทย',
    description:
      'รู้จักครูพี่ดอยและ ENGLISH PLAN ผ่าน YouTube @DoyLanguagePlan, บทเรียน IELTS และระบบฝึก IELTS ออนไลน์สำหรับคนไทย',
    h1: 'ครูพี่ดอย ENGLISH PLAN',
    kicker: 'Teacher profile',
    lead:
      'บทเรียนในเว็บนี้เชื่อมกับแนวการสอนของครูพี่ดอยจาก YouTube ENGLISH PLAN เพื่อให้ผู้เรียนไทยเข้าใจเกณฑ์ IELTS แล้วกลับมาซ้อมในแอปได้ทันที',
    cta: 'ดู YouTube Channel',
    ctaUrl: youtubeChannelUrl,
    secondaryCta: 'ลองใช้ IELTS app',
    heroVideo: videos.vocabulary,
    clusters: [
      ['YouTube lessons', 'บทเรียนฟรีด้าน IELTS Speaking, Writing, Reading และ General Training'],
      ['Thai explanations', 'อธิบายเกณฑ์และข้อผิดพลาดด้วยภาษาไทยที่ใช้งานได้จริง'],
      ['Practice app', 'เปลี่ยนบทเรียนให้เป็นระบบฝึกและ report ส่วนตัว'],
      ['Course pathway', 'ต่อยอดจาก free lesson ไปสู่คอร์สและ mock test']
    ],
    videos: [videos.vocabulary, videos.speakingBand, videos.readingNine, videos.punctuation],
    faq: sharedFaq,
    focusKeywords: ['ครูพี่ดอย IELTS', 'Doy Language Plan', 'ENGLISH PLAN IELTS']
  }
]

const englishPages = [
  {
    slug: '/en/',
    title: 'IELTS Prep for Thai Learners | English Plan IELTS App',
    description:
      'IELTS Speaking, Writing, Reading and Listening practice for Thai learners with mock tests, Thai explanations, notebooks and lessons by Doy from ENGLISH PLAN.',
    h1: 'IELTS prep built for Thai learners',
    kicker: 'IELTS prep Thailand',
    lead:
      'Practice IELTS Speaking, Writing, Reading and Listening in one focused workspace, then use Thai explanations and Doy’s YouTube lessons to improve faster.',
    cta: 'Try the IELTS app',
    secondaryCta: 'View Speaking course',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Speaking practice', 'Record IELTS Part 1-3 answers and review your personal report'],
      ['Reading evidence', 'Train with answer evidence, paraphrase and trap explanations'],
      ['Writing guide', 'Improve structure, punctuation and Band 7 sentence control'],
      ['Mock workflow', 'Turn each mock score into a clear next practice step']
    ],
    videos: [videos.speakingApp, videos.readingNine, videos.punctuation],
    faq: englishFaq,
    focusKeywords: ['IELTS prep Thailand', 'IELTS Speaking practice', 'IELTS mock test']
  },
  {
    slug: '/en/ielts-speaking-practice/',
    title: 'IELTS Speaking Practice Online with Thai Feedback',
    description:
      'Practice IELTS Speaking Part 1, Part 2 and Part 3 online with recordings, sample videos, a personal notebook and Thai learner-focused feedback.',
    h1: 'IELTS Speaking practice with a real feedback loop',
    kicker: 'Speaking Part 1-3',
    lead:
      'Record answers, keep useful corrections, study Doy’s video lessons and build the habits needed for clearer IELTS Speaking responses.',
    cta: 'Practice Speaking',
    secondaryCta: 'Watch lesson',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Part 1', 'Short, natural answers with enough detail'],
      ['Part 2', 'Cue card structure and two-minute timing'],
      ['Part 3', 'Reasoning, comparison and abstract discussion'],
      ['Notebook', 'Save grammar fixes, collocations and model phrases']
    ],
    videos: [videos.speakingApp, videos.speakingBand, videos.vocabulary],
    faq: englishFaq,
    focusKeywords: ['IELTS Speaking practice', 'IELTS Speaking Part 2', 'IELTS Speaking Band 7']
  },
  {
    slug: '/en/ielts-reading-practice/',
    title: 'IELTS Reading Practice with Thai Explanations',
    description:
      'IELTS Reading practice for Thai learners with evidence, paraphrase, keyword traps and ENGLISH PLAN video lessons.',
    h1: 'IELTS Reading practice that trains evidence',
    kicker: 'Reading evidence',
    lead:
      'Improve by learning where each answer comes from, why traps work, and how to read for meaning instead of matching words.',
    cta: 'Practice Reading',
    secondaryCta: 'Watch Reading lesson',
    heroVideo: videos.readingNine,
    clusters: [
      ['Evidence first', 'Find the exact line before choosing'],
      ['Paraphrase', 'Recognize meaning shifts in questions'],
      ['Question types', 'Practice TFNG, headings, matching and fills'],
      ['Progress', 'Track attempts and repeat weak areas']
    ],
    videos: [videos.readingNine],
    faq: englishFaq,
    focusKeywords: ['IELTS Reading practice', 'IELTS Reading 9.0', 'Thai IELTS Reading']
  },
  {
    slug: '/en/ielts-writing-checker/',
    title: 'IELTS Writing Checker and Band 7 Study Guide',
    description:
      'IELTS Writing improvement path for Thai learners with punctuation, grammar control, essay structure and Band 7 writing lessons.',
    h1: 'IELTS Writing improvement beyond vocabulary',
    kicker: 'Writing feedback',
    lead:
      'Use a clearer checklist for task response, coherence, grammar, punctuation and sentence control before trying to sound advanced.',
    cta: 'Open Writing guide',
    secondaryCta: 'Watch Writing lesson',
    heroVideo: videos.punctuation,
    clusters: [
      ['Task response', 'Answer the actual question'],
      ['Coherence', 'Make paragraphs easy to follow'],
      ['Grammar control', 'Reduce run-ons and fragments'],
      ['Band 7 polish', 'Upgrade safely without overcomplicating']
    ],
    videos: [videos.punctuation, videos.writingSeven],
    faq: englishFaq,
    focusKeywords: ['IELTS Writing checker', 'IELTS Writing Band 7', 'IELTS essay feedback']
  },
  {
    slug: '/en/ielts-mock-test/',
    title: 'IELTS Mock Test Online for Thai Learners',
    description:
      'Take IELTS mock tests online and turn Speaking, Reading, Listening and Writing results into a focused study plan.',
    h1: 'IELTS mock tests that lead to the next practice step',
    kicker: 'Mock test',
    lead:
      'A mock test should not stop at a score. Use reports, notebooks and lessons to decide what to practice next.',
    cta: 'Start mock test',
    secondaryCta: 'See app tutorial',
    heroVideo: videos.speakingApp,
    clusters: [
      ['Speaking mock', 'Record and review answers'],
      ['Reading mock', 'Check evidence and traps'],
      ['Listening mock', 'Review spelling and distractors'],
      ['Study plan', 'Convert results into your next drill']
    ],
    videos: [videos.speakingApp, videos.readingNine, videos.punctuation],
    faq: englishFaq,
    focusKeywords: ['IELTS mock test', 'IELTS online test', 'IELTS prep app']
  },
  {
    slug: '/en/about-pdoy/',
    title: 'About Doy from ENGLISH PLAN | IELTS Teacher for Thai Learners',
    description:
      'Learn about Doy from ENGLISH PLAN, the @DoyLanguagePlan YouTube channel, and the IELTS preparation system for Thai learners.',
    h1: 'Doy from ENGLISH PLAN',
    kicker: 'Teacher profile',
    lead:
      'The site connects Doy’s public YouTube lessons with a practice app, so learners can watch a clear explanation and immediately train the same skill.',
    cta: 'Visit YouTube channel',
    ctaUrl: youtubeChannelUrl,
    secondaryCta: 'Try the IELTS app',
    heroVideo: videos.vocabulary,
    clusters: [
      ['YouTube lessons', 'Speaking, Writing, Reading and General Training lessons'],
      ['Thai-first teaching', 'Explanations designed around Thai learner errors'],
      ['Practice system', 'Reports, notebooks and mock tests'],
      ['Course path', 'Move from free lessons into structured preparation']
    ],
    videos: [videos.vocabulary, videos.speakingBand, videos.readingNine, videos.punctuation],
    faq: englishFaq,
    focusKeywords: ['Doy Language Plan', 'ENGLISH PLAN IELTS', 'IELTS teacher Thailand']
  }
]

const pages = [...thaiPages, ...englishPages]

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const stripTrailingSlash = (value) => value.replace(/\/$/, '')
const pageUrl = (slug) => `${siteUrl}${slug === '/' ? '/' : slug}`
const videoWatchUrl = (video) => `https://www.youtube.com/watch?v=${video.id}`
const videoThumbUrl = (video) => `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
const videoEmbedUrl = (video) => `https://www.youtube.com/embed/${video.id}`

const findAlternate = (page, locale) => {
  if (page.slug === '/th/' && locale === 'en') return '/en/'
  if (page.slug === '/en/' && locale === 'th') return '/th/'
  if (page.slug.startsWith('/th/')) {
    const candidate = page.slug.replace('/th/', '/en/')
    return pages.some((item) => item.slug === candidate) ? candidate : '/en/'
  }
  if (page.slug.startsWith('/en/')) {
    const candidate = page.slug.replace('/en/', '/th/')
    return pages.some((item) => item.slug === candidate) ? candidate : '/th/'
  }
  return locale === 'th' ? '/th/' : '/en/'
}

const buildJsonLd = (page) => {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: organizationName,
    url: siteUrl,
    sameAs: [
      youtubeChannelUrl,
      'https://www.youtube.com/channel/UChdxvszp3EMEQWfIh8fYZPg',
      'https://www.language-plan.com'
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Thailand'
    }
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: organizationName,
    url: siteUrl,
    inLanguage: page.slug.startsWith('/th/') ? 'th-TH' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: page.h1,
    description: page.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: organizationName,
      sameAs: youtubeChannelUrl
    },
    educationalLevel: 'IELTS preparation',
    inLanguage: page.slug.startsWith('/th/') ? 'th-TH' : 'en',
    areaServed: 'Thailand',
    url: pageUrl(page.slug)
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: page.slug.startsWith('/th/') ? 'หน้าแรก' : 'Home',
        item: pageUrl(page.slug.startsWith('/th/') ? '/th/' : '/en/')
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.h1,
        item: pageUrl(page.slug)
      }
    ]
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  const videoObjects = page.videos.map((video) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    uploadDate: video.uploadDate,
    thumbnailUrl: [videoThumbUrl(video)],
    embedUrl: videoEmbedUrl(video),
    contentUrl: videoWatchUrl(video),
    publisher: {
      '@type': 'Organization',
      name: 'ENGLISH PLAN',
      url: youtubeChannelUrl
    }
  }))

  return [organization, website, course, breadcrumb, faq, ...videoObjects]
    .map((entity) => `<script type="application/ld+json">${JSON.stringify(entity)}</script>`)
    .join('\n')
}

const renderPage = (page) => {
  const isThai = page.slug.startsWith('/th/')
  const lang = isThai ? 'th' : 'en'
  const alternateLang = isThai ? 'en' : 'th'
  const alternateSlug = findAlternate(page, alternateLang)
  const canonical = pageUrl(page.slug)
  const heroBackground = videoThumbUrl(page.heroVideo)
  const keywords = page.focusKeywords.join(', ')
  const homeSlug = isThai ? '/th/' : '/en/'
  const navLabels = isThai
    ? [
        ['Speaking', '/th/ielts-speaking-practice/'],
        ['Reading', '/th/ielts-reading-practice/'],
        ['Writing', '/th/ielts-writing-checker/'],
        ['Mock Test', '/th/ielts-mock-test/'],
        ['ครูพี่ดอย', '/th/about-pdoy/']
      ]
    : [
        ['Speaking', '/en/ielts-speaking-practice/'],
        ['Reading', '/en/ielts-reading-practice/'],
        ['Writing', '/en/ielts-writing-checker/'],
        ['Mock Test', '/en/ielts-mock-test/'],
        ['About Doy', '/en/about-pdoy/']
      ]

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="${isThai ? 'th-TH' : 'en'}" href="${canonical}" />
    <link rel="alternate" hreflang="${isThai ? 'en' : 'th-TH'}" href="${pageUrl(alternateSlug)}" />
    <link rel="alternate" hreflang="x-default" href="${pageUrl('/th/')}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${organizationName}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${heroBackground}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${heroBackground}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://www.youtube.com" />
    <link rel="preconnect" href="https://i.ytimg.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Prompt:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    ${buildJsonLd(page)}
    <style>
      :root {
        --ink: #101828;
        --muted: #526173;
        --line: #d8dee8;
        --navy: #13213c;
        --blue: #1f64d8;
        --green: #0c7a58;
        --amber: #f2b705;
        --paper: #f7f8fb;
        --white: #ffffff;
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        color: var(--ink);
        background: var(--paper);
        font-family: ${isThai ? "'Prompt', 'Inter'" : "'Inter', 'Prompt'"}, system-ui, sans-serif;
        line-height: 1.65;
      }
      a { color: inherit; text-decoration: none; }
      img { display: block; max-width: 100%; }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(255,255,255,.94);
        border-bottom: 1px solid var(--line);
        backdrop-filter: blur(14px);
      }
      .nav {
        width: min(1160px, calc(100% - 32px));
        min-height: 70px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }
      .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; }
      .mark {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        color: var(--white);
        background: var(--navy);
        border-radius: 8px;
      }
      .navlinks { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
      .navlinks a { padding: 8px 10px; color: var(--muted); font-size: .94rem; font-weight: 700; }
      .navlinks a:hover { color: var(--blue); }
      .hero {
        min-height: min(680px, 74vh);
        display: grid;
        align-items: end;
        background-image: linear-gradient(90deg, rgba(11,22,42,.88), rgba(11,22,42,.62), rgba(11,22,42,.22)), url("${heroBackground}");
        background-position: center;
        background-size: cover;
        color: var(--white);
      }
      .hero-inner {
        width: min(1160px, calc(100% - 32px));
        margin: 0 auto;
        padding: 86px 0 72px;
      }
      .eyebrow {
        color: #d9e7ff;
        text-transform: uppercase;
        letter-spacing: .12em;
        font-size: .78rem;
        font-weight: 800;
      }
      h1 {
        max-width: 850px;
        margin: 14px 0 18px;
        font-size: clamp(2.4rem, 7vw, 5.9rem);
        line-height: .98;
        letter-spacing: 0;
      }
      .lead { max-width: 760px; font-size: clamp(1.05rem, 2vw, 1.34rem); color: #eef4ff; }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
      .button {
        min-height: 50px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 18px;
        border-radius: 8px;
        font-weight: 800;
      }
      .primary { background: var(--amber); color: #172033; }
      .secondary { background: rgba(255,255,255,.12); color: var(--white); border: 1px solid rgba(255,255,255,.42); }
      main section {
        width: min(1160px, calc(100% - 32px));
        margin: 0 auto;
        padding: 64px 0;
      }
      h2 { margin: 0 0 14px; font-size: clamp(1.7rem, 3vw, 2.7rem); line-height: 1.12; }
      .section-lead { max-width: 760px; color: var(--muted); margin: 0 0 28px; }
      .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
      .card {
        min-height: 185px;
        padding: 20px;
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 8px;
      }
      .card strong { display: block; margin-bottom: 8px; font-size: 1.08rem; }
      .card p { margin: 0; color: var(--muted); }
      .feature-band {
        width: 100%;
        max-width: none;
        background: var(--white);
        border-block: 1px solid var(--line);
      }
      .feature-inner {
        width: min(1160px, calc(100% - 32px));
        margin: 0 auto;
        padding: 64px 0;
        display: grid;
        grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
        gap: 28px;
        align-items: center;
      }
      .video-frame {
        aspect-ratio: 16 / 9;
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid var(--line);
        background: #000;
      }
      iframe { width: 100%; height: 100%; border: 0; }
      .video-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
      .video-card {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 8px;
        overflow: hidden;
      }
      .video-card div { padding: 14px; }
      .video-card strong { display: block; line-height: 1.35; }
      .video-card span { color: var(--muted); font-size: .9rem; }
      .proof {
        display: grid;
        grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
        gap: 24px;
      }
      .proof aside {
        padding: 22px;
        background: var(--navy);
        color: var(--white);
        border-radius: 8px;
      }
      .proof ul { margin: 0; padding-left: 20px; color: var(--muted); }
      .faq { display: grid; gap: 12px; }
      details {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 16px 18px;
      }
      summary { cursor: pointer; font-weight: 800; }
      details p { color: var(--muted); margin-bottom: 0; }
      .final {
        width: 100%;
        max-width: none;
        background: var(--navy);
        color: var(--white);
        text-align: center;
      }
      .final-inner { width: min(900px, calc(100% - 32px)); margin: 0 auto; padding: 70px 0; }
      .final p { color: #dbe6f7; }
      footer {
        border-top: 1px solid var(--line);
        background: var(--white);
        color: var(--muted);
      }
      .footer-inner {
        width: min(1160px, calc(100% - 32px));
        margin: 0 auto;
        padding: 28px 0;
        display: flex;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      @media (max-width: 860px) {
        .nav { align-items: flex-start; flex-direction: column; padding: 14px 0; }
        .navlinks { justify-content: flex-start; }
        .hero { min-height: 680px; }
        .grid, .video-list, .proof, .feature-inner { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <header class="topbar">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="${homeSlug}">
          <span class="mark">EP</span>
          <span>English Plan IELTS</span>
        </a>
        <div class="navlinks">
          ${navLabels.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join('')}
          <a href="${pageUrl(alternateSlug)}">${isThai ? 'English' : 'ไทย'}</a>
        </div>
      </nav>
    </header>
    <section class="hero">
      <div class="hero-inner">
        <p class="eyebrow">${escapeHtml(page.kicker)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="lead">${escapeHtml(page.lead)}</p>
        <div class="actions">
          <a class="button primary" href="${page.ctaUrl || appUrl}">${escapeHtml(page.cta)}</a>
          <a class="button secondary" href="${page.secondaryCta.includes('YouTube') || page.secondaryCta.includes('lesson') || page.secondaryCta.includes('บทเรียน') ? videoWatchUrl(page.heroVideo) : courseUrl}">${escapeHtml(page.secondaryCta)}</a>
        </div>
      </div>
    </section>
    <main>
      <section aria-labelledby="practice-map-title">
        <h2 id="practice-map-title">${isThai ? 'สิ่งที่หน้านี้ช่วยให้ Google และผู้เรียนเข้าใจทันที' : 'What this page makes clear for learners and Google'}</h2>
        <p class="section-lead">${isThai ? 'แต่ละหน้าเจาะ search intent เฉพาะทาง และเชื่อมกลับไปยัง app, คอร์ส และวิดีโอที่เกี่ยวข้อง' : 'Each page targets a clear search intent, then connects learners to the app, course path and matching video lessons.'}</p>
        <div class="grid">
          ${page.clusters
            .map(
              ([title, body]) => `
          <article class="card">
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(body)}</p>
          </article>`
            )
            .join('')}
        </div>
      </section>
      <section class="feature-band" aria-labelledby="video-title">
        <div class="feature-inner">
          <div>
            <h2 id="video-title">${isThai ? 'บทเรียนจาก YouTube ของครูพี่ดอย' : 'A lesson from Doy’s YouTube channel'}</h2>
            <p class="section-lead">${escapeHtml(page.heroVideo.description)}</p>
            <a class="button primary" href="${videoWatchUrl(page.heroVideo)}">${isThai ? 'เปิดวิดีโอบน YouTube' : 'Open on YouTube'}</a>
          </div>
          <div class="video-frame">
            <iframe loading="lazy" src="${videoEmbedUrl(page.heroVideo)}" title="${escapeHtml(page.heroVideo.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </div>
      </section>
      <section aria-labelledby="video-library-title">
        <h2 id="video-library-title">${isThai ? 'วิดีโอที่เกี่ยวข้อง' : 'Related video lessons'}</h2>
        <p class="section-lead">${isThai ? 'ใช้วิดีโอเป็น proof และเป็นทางเข้าให้ผู้เรียนดูบทเรียนก่อนกลับมาฝึกในเว็บ' : 'These videos add first-party proof and give learners a lesson before they practice inside the app.'}</p>
        <div class="video-list">
          ${page.videos
            .map(
              (video) => `
          <a class="video-card" href="${videoWatchUrl(video)}">
            <img src="${videoThumbUrl(video)}" alt="${escapeHtml(video.title)}" loading="lazy" width="480" height="360" />
            <div>
              <strong>${escapeHtml(video.title)}</strong>
              <span>${escapeHtml(video.uploadDate)}</span>
            </div>
          </a>`
            )
            .join('')}
        </div>
      </section>
      <section class="proof" aria-labelledby="trust-title">
        <aside>
          <p class="eyebrow">${isThai ? 'First-party proof' : 'First-party proof'}</p>
          <h2 id="trust-title">${isThai ? 'เชื่อมเว็บกับตัวตนจริงของ ENGLISH PLAN' : 'Connect the site with ENGLISH PLAN’s real presence'}</h2>
          <p>${isThai ? 'ช่อง YouTube @DoyLanguagePlan เป็นแหล่งบทเรียนสาธารณะของแบรนด์ และช่วยเสริม E-E-A-T ให้หน้า IELTS ในไทย' : 'The @DoyLanguagePlan YouTube channel is a public lesson library for the brand and strengthens trust for IELTS searches in Thailand.'}</p>
        </aside>
        <div>
          <h2>${isThai ? 'Search intent ที่ครอบคลุม' : 'Search intent covered'}</h2>
          <ul>
            ${page.focusKeywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join('')}
          </ul>
        </div>
      </section>
      <section aria-labelledby="faq-title">
        <h2 id="faq-title">${isThai ? 'คำถามที่พบบ่อย' : 'Frequently asked questions'}</h2>
        <div class="faq">
          ${page.faq
            .map(
              (item) => `
          <details>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>`
            )
            .join('')}
        </div>
      </section>
      <section class="final" aria-labelledby="next-step-title">
        <div class="final-inner">
          <h2 id="next-step-title">${isThai ? 'พร้อมเปลี่ยนการดูบทเรียนให้เป็นการฝึกจริงหรือยัง' : 'Ready to turn lessons into practice?'}</h2>
          <p>${isThai ? 'เริ่มจาก trial, ดู report ของตัวเอง แล้วใช้บทเรียนที่เกี่ยวข้องเพื่อแก้จุดอ่อนแบบเป็นระบบ' : 'Start with a trial, review your own report, then use the matching lessons to fix weak points systematically.'}</p>
          <div class="actions" style="justify-content:center">
            <a class="button primary" href="${appUrl}">${isThai ? 'ลองใช้ IELTS app' : 'Try the IELTS app'}</a>
            <a class="button secondary" href="${youtubeChannelUrl}">${isThai ? 'ดู YouTube @DoyLanguagePlan' : 'Visit @DoyLanguagePlan'}</a>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <div class="footer-inner">
        <span>© ${new Date().getFullYear()} ${organizationName}</span>
        <span><a href="${youtubeChannelUrl}">YouTube</a> · <a href="${appUrl}">IELTS app</a> · <a href="${courseUrl}">Course</a></span>
      </div>
    </footer>
  </body>
</html>
`
}

const writeFile = (relativePath, content) => {
  const fullPath = path.join(publicDir, relativePath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content)
}

for (const page of pages) {
  writeFile(path.join(stripTrailingSlash(page.slug), 'index.html'), renderPage(page))
}

const now = new Date().toISOString()
const sitemapUrls = [
  { loc: siteUrl, priority: '1.0' },
  ...pages.map((page) => ({ loc: pageUrl(page.slug), priority: page.slug === '/th/' ? '1.0' : '0.8' }))
]

writeFile(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
)

writeFile(
  'robots.txt',
  `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
)

writeFile(
  'llms.txt',
  `# English Plan IELTS

English Plan IELTS is an IELTS preparation app and learning space for Thai learners.

Core pages:
- ${siteUrl}/th/ - Thai IELTS prep hub
- ${siteUrl}/th/ielts-speaking-practice/ - IELTS Speaking practice
- ${siteUrl}/th/ielts-reading-practice/ - IELTS Reading practice
- ${siteUrl}/th/ielts-writing-checker/ - IELTS Writing checker and guide
- ${siteUrl}/th/ielts-mock-test/ - IELTS mock test workflow

Official video channel: ${youtubeChannelUrl}
`
)

console.log(`Built ${pages.length} SEO pages plus sitemap, robots and llms.txt`)
