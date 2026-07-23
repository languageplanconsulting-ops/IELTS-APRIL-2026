// Model essays for IELTS Writing Task 2, organised by question type. Each essay follows the
// user's own dictated sentence-by-sentence pattern for that type EXACTLY (see memory:
// writing-task2-essay-patterns). 260-300 words, B2 vocabulary, grammar ceiling of one
// subordinating-conjunction / non-defining-which / gerund-participle device per sentence.

import { GENERAL_TRAINING_TASK2_PROMPTS } from './writingGeneralTask2Data'

export type WritingTask2TypeId =
  | 'to-what-extent'
  | 'double-question'
  | 'discuss-both-views'
  | 'advantages-disadvantages'

export type WritingTask2Track = 'academic' | 'general-training'

export type WritingTask2Role = 'intro' | 'body1' | 'body2' | 'body3' | 'conclusion'

export type WritingTask2Paragraph = {
  role: WritingTask2Role
  text: string
  /** Literal Thai translation of `text`, shown behind a "ดูคำแปลภาษาไทย" toggle. */
  thai?: string
}

export type WritingTask2VocabItem = {
  word: string
  thaiMeaning: string
  example?: string
}

export type WritingTask2Prompt = {
  id: string
  number: number
  typeId: WritingTask2TypeId
  track?: WritingTask2Track
  title: string
  questionText: string
  meta: string
  paragraphs: WritingTask2Paragraph[]
  vocab: WritingTask2VocabItem[]
}

export const ACADEMIC_WRITING_TASK2_PROMPTS: WritingTask2Prompt[] = [
  // ── To What Extent ──────────────────────────────────────────────────
  {
    id: 't2-twe-1',
    number: 1,
    typeId: 'to-what-extent',
    title: 'Preserving Old Buildings',
    questionText:
      'Some people think old buildings should be preserved, while others believe they should be pulled down to make way for modern developments. To what extent do you agree or disagree?',
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while some old constructions may appear outdated, maintaining them is essential for preserving a country's history and cultural identity. Others argue that pulling down these structures and replacing them with modern buildings would better meet the practical needs of a growing population. I personally believe that historic buildings should be preserved, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ว่าอาคารเก่าบางแห่งอาจดูล้าสมัย แต่การรักษาอาคารเหล่านี้ไว้ก็มีความสำคัญต่อการอนุรักษ์ประวัติศาสตร์และอัตลักษณ์ทางวัฒนธรรมของประเทศ ในขณะที่บางคนโต้แย้งว่าการรื้อถอนโครงสร้างเหล่านี้และแทนที่ด้วยอาคารสมัยใหม่จะตอบสนองความต้องการเชิงปฏิบัติของประชากรที่เพิ่มขึ้นได้ดีกว่า ส่วนตัวผมเชื่อว่าอาคารประวัติศาสตร์ควรได้รับการอนุรักษ์ไว้ และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that old buildings should be pulled down to make way for modern infrastructure. To explain it simply, this is possibly because older structures often fail to meet current safety and space requirements; therefore, replacing them allows cities to meet the needs of a growing population more efficiently. For example, many rapidly developing cities have pulled down old buildings to construct high-rise apartments and offices. From this perspective, it is understandable why some would believe that modern buildings serve society's needs more effectively than old ones.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าอาคารเก่าควรถูกรื้อถอนเพื่อเปิดทางให้แก่โครงสร้างพื้นฐานสมัยใหม่ พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าโครงสร้างเก่ามักไม่ตอบสนองข้อกำหนดด้านความปลอดภัยและพื้นที่ในปัจจุบัน ดังนั้น การแทนที่อาคารเหล่านี้จึงช่วยให้เมืองต่างๆ สามารถตอบสนองความต้องการของประชากรที่เพิ่มขึ้นได้อย่างมีประสิทธิภาพมากขึ้น ตัวอย่างเช่น เมืองที่กำลังพัฒนาอย่างรวดเร็วหลายแห่งได้รื้อถอนอาคารเก่าเพื่อสร้างอพาร์ตเมนต์และสำนักงานสูง จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าอาคารสมัยใหม่ตอบสนองความต้องการของสังคมได้อย่างมีประสิทธิภาพมากกว่าอาคารเก่า'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that old buildings should be carefully preserved. To put it simply, this is due to the fact that these structures represent a nation's history and cultural heritage, which cannot be recreated once destroyed. For instance, cities such as Rome and Kyoto attract millions of tourists every year largely because of their well-preserved historic buildings. In this respect, it is evident that maintaining old buildings brings both cultural and economic value to a country.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่าอาคารเก่าควรได้รับการอนุรักษ์ไว้อย่างระมัดระวัง พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าโครงสร้างเหล่านี้เป็นตัวแทนของประวัติศาสตร์และมรดกทางวัฒนธรรมของชาติ ซึ่งไม่สามารถสร้างขึ้นใหม่ได้เมื่อถูกทำลายไปแล้ว ตัวอย่างเช่น เมืองต่างๆ อย่างโรมและเกียวโตดึงดูดนักท่องเที่ยวหลายล้านคนทุกปี ส่วนใหญ่เนื่องมาจากอาคารประวัติศาสตร์ที่ได้รับการอนุรักษ์ไว้เป็นอย่างดี ในแง่นี้ เห็นได้ชัดว่าการรักษาอาคารเก่าไว้นำมาซึ่งคุณค่าทั้งทางวัฒนธรรมและเศรษฐกิจแก่ประเทศ'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that building modern structures can help cities meet growing practical needs, I am of the opinion that preserving old buildings is more important, as they protect a nation's history for future generations.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าการสร้างโครงสร้างสมัยใหม่สามารถช่วยให้เมืองต่างๆ ตอบสนองความต้องการเชิงปฏิบัติที่เพิ่มขึ้นได้ ผมมีความเห็นว่าการอนุรักษ์อาคารเก่ามีความสำคัญมากกว่า เนื่องจากอาคารเหล่านี้ปกป้องประวัติศาสตร์ของชาติไว้ให้แก่คนรุ่นต่อไป'
      }
    ],
    vocab: [
      { word: "cultural identity", thaiMeaning: "อัตลักษณ์ทางวัฒนธรรม" },
      { word: "cultural heritage", thaiMeaning: "มรดกทางวัฒนธรรม" },
      { word: "economic value", thaiMeaning: "คุณค่าทางเศรษฐกิจ" },
      { word: "well-preserved historic buildings", thaiMeaning: "อาคารประวัติศาสตร์ที่อนุรักษ์ไว้ดี" },
      { word: "safety and space requirements", thaiMeaning: "ข้อกำหนดด้านความปลอดภัยและพื้นที่" },
      { word: "rapidly developing cities", thaiMeaning: "เมืองที่กำลังพัฒนาอย่างรวดเร็ว" },
      { word: "modern infrastructure", thaiMeaning: "โครงสร้างพื้นฐานสมัยใหม่" },
      { word: "high-rise apartments", thaiMeaning: "อาคารอพาร์ตเมนต์สูง" },
      { word: "growing population", thaiMeaning: "ประชากรที่เพิ่มขึ้น" },
      { word: "future generations", thaiMeaning: "คนรุ่นหลัง" },
      { word: "old constructions", thaiMeaning: "สิ่งก่อสร้างเก่า" },
      { word: "carefully preserved", thaiMeaning: "ได้รับการอนุรักษ์อย่างระมัดระวัง" },
      { word: "practical needs", thaiMeaning: "ความต้องการในเชิงปฏิบัติ" },
      { word: "modern buildings", thaiMeaning: "อาคารสมัยใหม่" },
      { word: "nation's history", thaiMeaning: "ประวัติศาสตร์ของชาติ" },
      { word: "millions of tourists", thaiMeaning: "นักท่องเที่ยวหลายล้านคน" },
      { word: "pulling down", thaiMeaning: "การรื้อถอน" },
      { word: "make way for", thaiMeaning: "เปิดทางให้" },
      { word: "outdated", thaiMeaning: "ล้าสมัย" },
      { word: "preserving a country's history", thaiMeaning: "การอนุรักษ์ประวัติศาสตร์ของประเทศ" },
      { word: "maintaining them is essential", thaiMeaning: "การดูแลรักษามีความจำเป็น" },
      { word: "historic buildings should be preserved", thaiMeaning: "ควรอนุรักษ์อาคารประวัติศาสตร์" },
      { word: "serve society's needs more effectively", thaiMeaning: "ตอบสนองความต้องการของสังคมได้ดีกว่า" },
      { word: "cannot be recreated once destroyed", thaiMeaning: "สร้างขึ้นใหม่ไม่ได้เมื่อถูกทำลาย" },
      { word: "building modern structures", thaiMeaning: "การสร้างโครงสร้างสมัยใหม่" },
      { word: "older structures often fail", thaiMeaning: "โครงสร้างเก่ามักไม่ผ่านเกณฑ์" },
      { word: "cities such as Rome and Kyoto", thaiMeaning: "เมืองอย่างโรมและเกียวโต" },
      { word: "preserving old buildings is more important", thaiMeaning: "การอนุรักษ์อาคารเก่าสำคัญกว่า" },
      { word: "pulled down old buildings", thaiMeaning: "รื้อถอนอาคารเก่า" },
      { word: "replacing them allows cities", thaiMeaning: "การทดแทนช่วยให้เมือง" },
      { word: "old buildings should be pulled down", thaiMeaning: "ควรรื้อถอนอาคารเก่า" },
      { word: "maintaining old buildings", thaiMeaning: "การดูแลรักษาอาคารเก่า" }
    ]
  },
  {
    id: 't2-twe-2',
    number: 2,
    typeId: 'to-what-extent',
    title: 'The Value of Studying History',
    questionText:
      'Some people think that studying history is a waste of time, while others believe that learning about the past helps us understand the present. To what extent do you agree or disagree?',
    meta: 'India · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while the past cannot be changed, understanding it has little practical relevance to people living in the present. Others argue that studying history remains essential for understanding and improving present-day society. I personally believe that learning about the past is highly valuable, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ว่าอดีตจะไม่สามารถเปลี่ยนแปลงได้ แต่การทำความเข้าใจอดีตนั้นมีความเกี่ยวข้องเชิงปฏิบัติเพียงเล็กน้อยต่อผู้คนที่อาศัยอยู่ในปัจจุบัน ในขณะที่บางคนโต้แย้งว่าการศึกษาประวัติศาสตร์ยังคงมีความสำคัญต่อการทำความเข้าใจและปรับปรุงสังคมในปัจจุบัน ส่วนตัวผมเชื่อว่าการเรียนรู้เกี่ยวกับอดีตมีคุณค่าอย่างยิ่ง และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that studying history serves little practical purpose in modern life. To explain it simply, this is possibly because historical events cannot be altered and have no direct bearing on today's technology or economy; therefore, some believe time would be better spent learning practical skills instead. For example, many students today choose to study coding or business rather than history, believing these subjects offer more immediate career benefits. From this perspective, it is understandable why some would believe that focusing on the present is more useful than studying the past.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าการศึกษาประวัติศาสตร์มีประโยชน์เชิงปฏิบัติเพียงเล็กน้อยในชีวิตสมัยใหม่ พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าเหตุการณ์ทางประวัติศาสตร์ไม่สามารถเปลี่ยนแปลงได้และไม่มีผลโดยตรงต่อเทคโนโลยีหรือเศรษฐกิจในปัจจุบัน ดังนั้น บางคนจึงเชื่อว่าควรใช้เวลาไปกับการเรียนรู้ทักษะเชิงปฏิบัติแทนจะดีกว่า ตัวอย่างเช่น นักเรียนจำนวนมากในปัจจุบันเลือกเรียนการเขียนโปรแกรมหรือธุรกิจมากกว่าประวัติศาสตร์ เพราะเชื่อว่าวิชาเหล่านี้ให้ประโยชน์ด้านอาชีพที่รวดเร็วกว่า จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการมุ่งเน้นปัจจุบันมีประโยชน์มากกว่าการศึกษาอดีต'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that learning about the past is essential. To put it simply, this is due to the fact that history allows societies to understand the causes of present problems and avoid repeating past mistakes, which can be extremely costly. For instance, many countries continue to study the causes of the 2008 financial crisis in order to prevent similar economic collapses in the future. In this respect, it is evident that studying history provides valuable lessons that directly benefit the present.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่าการเรียนรู้เกี่ยวกับอดีตมีความจำเป็นอย่างยิ่ง พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าประวัติศาสตร์ช่วยให้สังคมเข้าใจสาเหตุของปัญหาในปัจจุบันและหลีกเลี่ยงการทำผิดพลาดซ้ำรอยเดิม ซึ่งอาจสร้างความเสียหายอย่างมหาศาล ตัวอย่างเช่น หลายประเทศยังคงศึกษาสาเหตุของวิกฤตการเงินปี 2008 เพื่อป้องกันการล่มสลายทางเศรษฐกิจที่คล้ายคลึงกันในอนาคต ในแง่นี้ เห็นได้ชัดว่าการศึกษาประวัติศาสตร์ให้บทเรียนอันมีค่าที่เป็นประโยชน์โดยตรงต่อปัจจุบัน'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that historical events themselves cannot be changed, I am of the opinion that learning about the past is highly valuable, as it helps societies avoid repeating the same mistakes.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าเหตุการณ์ทางประวัติศาสตร์เองไม่สามารถเปลี่ยนแปลงได้ ผมมีความเห็นว่าการเรียนรู้เกี่ยวกับอดีตมีคุณค่าอย่างยิ่ง เนื่องจากช่วยให้สังคมหลีกเลี่ยงการทำผิดพลาดซ้ำรอยเดิม'
      }
    ],
    vocab: [
      { word: "financial crisis", thaiMeaning: "วิกฤตการเงิน" },
      { word: "economic collapse", thaiMeaning: "การล่มสลายทางเศรษฐกิจ" },
      { word: "career benefits", thaiMeaning: "ผลประโยชน์ด้านอาชีพ" },
      { word: "historical events", thaiMeaning: "เหตุการณ์ทางประวัติศาสตร์" },
      { word: "improving present-day society", thaiMeaning: "การพัฒนาสังคมปัจจุบัน" },
      { word: "causes of present problems", thaiMeaning: "สาเหตุของปัญหาในปัจจุบัน" },
      { word: "learning about the past", thaiMeaning: "การเรียนรู้เกี่ยวกับอดีต" },
      { word: "practical relevance", thaiMeaning: "ความเกี่ยวข้องในเชิงปฏิบัติ" },
      { word: "practical purpose", thaiMeaning: "จุดประสงค์เชิงปฏิบัติ" },
      { word: "practical skills", thaiMeaning: "ทักษะเชิงปฏิบัติ" },
      { word: "valuable lessons", thaiMeaning: "บทเรียนที่มีค่า" },
      { word: "studying history", thaiMeaning: "การศึกษาประวัติศาสตร์" },
      { word: "direct bearing", thaiMeaning: "ผลกระทบโดยตรง" },
      { word: "past mistakes", thaiMeaning: "ความผิดพลาดในอดีต" },
      { word: "highly valuable", thaiMeaning: "มีคุณค่าสูง" },
      { word: "extremely costly", thaiMeaning: "มีต้นทุนสูงมาก" },
      { word: "modern life", thaiMeaning: "ชีวิตสมัยใหม่" },
      { word: "cannot be altered", thaiMeaning: "ไม่สามารถเปลี่ยนแปลงได้" },
      { word: "directly benefit", thaiMeaning: "เป็นประโยชน์โดยตรง" },
      { word: "focusing on the present", thaiMeaning: "การมุ่งเน้นปัจจุบัน" },
      { word: "people living in the present", thaiMeaning: "ผู้คนที่อยู่ในปัจจุบัน" },
      { word: "today's technology or economy", thaiMeaning: "เทคโนโลยีหรือเศรษฐกิจในปัจจุบัน" },
      { word: "study coding or business", thaiMeaning: "เรียนเขียนโค้ดหรือธุรกิจ" },
      { word: "repeating the same mistakes", thaiMeaning: "การทำผิดพลาดซ้ำเดิม" },
      { word: "time would be better spent", thaiMeaning: "เวลาควรใช้ไปกับสิ่งที่ดีกว่า" },
      { word: "events themselves cannot be changed", thaiMeaning: "เหตุการณ์เองเปลี่ยนแปลงไม่ได้" },
      { word: "many countries continue to study", thaiMeaning: "หลายประเทศยังคงศึกษา" },
      { word: "more useful than studying the past", thaiMeaning: "มีประโยชน์กว่าการศึกษาอดีต" },
      { word: "the past cannot be changed", thaiMeaning: "อดีตเปลี่ยนแปลงไม่ได้" },
      { word: "remains essential for understanding", thaiMeaning: "ยังจำเป็นต่อการทำความเข้าใจ" },
      { word: "believing these subjects offer", thaiMeaning: "เชื่อว่าวิชาเหล่านี้มอบ" },
      { word: "in order to prevent similar", thaiMeaning: "เพื่อป้องกันสิ่งที่คล้ายกัน" }
    ]
  },
  {
    id: 't2-twe-3',
    number: 3,
    typeId: 'to-what-extent',
    title: 'Government vs. Private Science Funding',
    questionText:
      'Some people believe that scientific research should be funded and controlled by the government, while others think private companies should be responsible for it. To what extent do you agree or disagree?',
    meta: 'Spain · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while private companies can drive rapid technological innovation, scientific research should ultimately remain under government control. Others argue that private companies are better positioned to fund and accelerate scientific progress. I personally believe that governments should retain primary control over scientific research, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ว่าบริษัทเอกชนสามารถขับเคลื่อนนวัตกรรมทางเทคโนโลยีได้อย่างรวดเร็ว แต่การวิจัยทางวิทยาศาสตร์ในท้ายที่สุดควรอยู่ภายใต้การควบคุมของรัฐบาล ในขณะที่บางคนโต้แย้งว่าบริษัทเอกชนอยู่ในตำแหน่งที่ดีกว่าในการให้ทุนและเร่งความก้าวหน้าทางวิทยาศาสตร์ ส่วนตัวผมเชื่อว่ารัฐบาลควรคงไว้ซึ่งการควบคุมหลักเหนือการวิจัยทางวิทยาศาสตร์ และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that private companies are better suited to lead scientific research. To explain it simply, this is possibly because private firms often have greater funding and stronger commercial incentives to innovate quickly; therefore, breakthroughs can reach the public faster than through government-led projects. For example, private pharmaceutical companies developed COVID-19 vaccines within less than a year of the pandemic beginning. From this perspective, it is understandable why some would believe that private companies drive scientific progress more effectively than governments.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าบริษัทเอกชนเหมาะสมกว่าในการนำการวิจัยทางวิทยาศาสตร์ พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าบริษัทเอกชนมักมีเงินทุนมากกว่าและมีแรงจูงใจเชิงพาณิชย์ที่แข็งแกร่งกว่าในการสร้างนวัตกรรมอย่างรวดเร็ว ดังนั้น ความก้าวหน้าจึงสามารถเข้าถึงสาธารณชนได้เร็วกว่าโครงการที่นำโดยรัฐบาล ตัวอย่างเช่น บริษัทยาเอกชนพัฒนาวัคซีนโควิด-19 ได้ภายในเวลาไม่ถึงหนึ่งปีนับตั้งแต่การระบาดเริ่มต้น จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าบริษัทเอกชนขับเคลื่อนความก้าวหน้าทางวิทยาศาสตร์ได้อย่างมีประสิทธิภาพมากกว่ารัฐบาล'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that governments should retain control over scientific research. To put it simply, this is due to the fact that government funding ensures research prioritizes public benefit rather than profit, which private companies cannot always guarantee. For instance, publicly funded institutions such as NASA have made major scientific discoveries that were shared freely with the world instead of being sold for profit. In this respect, it is evident that government-controlled research better serves the interests of society as a whole.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่ารัฐบาลควรคงไว้ซึ่งการควบคุมการวิจัยทางวิทยาศาสตร์ พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าเงินทุนจากรัฐบาลช่วยให้การวิจัยให้ความสำคัญกับประโยชน์สาธารณะมากกว่าผลกำไร ซึ่งบริษัทเอกชนไม่สามารถรับประกันได้เสมอไป ตัวอย่างเช่น สถาบันที่ได้รับทุนจากภาครัฐอย่างนาซาได้สร้างการค้นพบทางวิทยาศาสตร์ที่สำคัญและแบ่งปันให้กับโลกโดยไม่คิดค่าใช้จ่าย แทนที่จะนำไปขายเพื่อผลกำไร ในแง่นี้ เห็นได้ชัดว่าการวิจัยที่ควบคุมโดยรัฐบาลตอบสนองผลประโยชน์ของสังคมโดยรวมได้ดีกว่า'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that private companies can accelerate certain scientific breakthroughs, I am of the opinion that governments should remain in control of scientific research, as this best protects the public interest.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าบริษัทเอกชนสามารถเร่งความก้าวหน้าทางวิทยาศาสตร์บางอย่างได้ ผมมีความเห็นว่ารัฐบาลควรคงไว้ซึ่งการควบคุมการวิจัยทางวิทยาศาสตร์ เนื่องจากจะปกป้องผลประโยชน์สาธารณะได้ดีที่สุด'
      }
    ],
    vocab: [
      { word: "commercial incentives", thaiMeaning: "แรงจูงใจเชิงพาณิชย์" },
      { word: "public benefit", thaiMeaning: "ประโยชน์สาธารณะ" },
      { word: "scientific breakthroughs", thaiMeaning: "ความก้าวหน้าทางวิทยาศาสตร์ครั้งสำคัญ" },
      { word: "public interest", thaiMeaning: "ผลประโยชน์สาธารณะ" },
      { word: "government-controlled research", thaiMeaning: "งานวิจัยที่รัฐบาลควบคุม" },
      { word: "rapid technological innovation", thaiMeaning: "นวัตกรรมเทคโนโลยีอย่างรวดเร็ว" },
      { word: "publicly funded institutions", thaiMeaning: "สถาบันที่ได้รับทุนสาธารณะ" },
      { word: "pharmaceutical companies", thaiMeaning: "บริษัทเภสัชกรรม" },
      { word: "government-led projects", thaiMeaning: "โครงการที่รัฐบาลนำ" },
      { word: "scientific discoveries", thaiMeaning: "การค้นพบทางวิทยาศาสตร์" },
      { word: "scientific research", thaiMeaning: "งานวิจัยทางวิทยาศาสตร์" },
      { word: "scientific progress", thaiMeaning: "ความก้าวหน้าทางวิทยาศาสตร์" },
      { word: "government funding", thaiMeaning: "เงินทุนจากรัฐบาล" },
      { word: "government control", thaiMeaning: "การควบคุมโดยรัฐบาล" },
      { word: "private companies", thaiMeaning: "บริษัทเอกชน" },
      { word: "interests of society", thaiMeaning: "ผลประโยชน์ของสังคม" },
      { word: "primary control", thaiMeaning: "การควบคุมหลัก" },
      { word: "sold for profit", thaiMeaning: "ขายเพื่อหากำไร" },
      { word: "innovate quickly", thaiMeaning: "สร้างนวัตกรรมอย่างรวดเร็ว" },
      { word: "shared freely", thaiMeaning: "แบ่งปันอย่างเสรี" },
      { word: "COVID-19 vaccines", thaiMeaning: "วัคซีนโควิด-19" },
      { word: "better positioned to fund and accelerate", thaiMeaning: "อยู่ในตำแหน่งที่ดีกว่าในการระดมทุนและเร่ง" },
      { word: "breakthroughs can reach the public faster", thaiMeaning: "ความก้าวหน้าไปถึงสาธารณะได้เร็วกว่า" },
      { word: "pandemic beginning", thaiMeaning: "จุดเริ่มต้นของโรคระบาด" },
      { word: "rather than profit", thaiMeaning: "มากกว่ากำไร" },
      { word: "cannot always guarantee", thaiMeaning: "ไม่สามารถรับประกันได้เสมอ" },
      { word: "society as a whole", thaiMeaning: "สังคมโดยรวม" },
      { word: "private firms often have greater funding", thaiMeaning: "บริษัทเอกชนมักมีเงินทุนมากกว่า" },
      { word: "within less than a year", thaiMeaning: "ภายในเวลาไม่ถึงหนึ่งปี" },
      { word: "institutions such as NASA", thaiMeaning: "สถาบันอย่างนาซา" },
      { word: "governments should retain control", thaiMeaning: "รัฐบาลควรคงการควบคุมไว้" },
      { word: "ensures research prioritizes", thaiMeaning: "รับประกันว่างานวิจัยให้ความสำคัญ" }
    ]
  },
  {
    id: 't2-twe-4',
    number: 4,
    typeId: 'to-what-extent',
    title: 'Should Universities Teach Arts Subjects?',
    questionText:
      'Some people believe universities should stop offering arts subjects such as philosophy and history, and focus only on courses that prepare students for employment. To what extent do you agree or disagree?',
    meta: 'France · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while rising tuition fees make practical courses more appealing, universities should stop teaching arts subjects such as philosophy and history in favor of purely practical courses. Others argue that focusing solely on employment-focused courses would better prepare graduates for the job market. I personally believe that universities should continue offering arts subjects, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ว่าค่าเล่าเรียนที่เพิ่มสูงขึ้นจะทำให้หลักสูตรเชิงปฏิบัติน่าสนใจมากขึ้น มหาวิทยาลัยควรหยุดสอนวิชาศิลปศาสตร์ เช่น ปรัชญาและประวัติศาสตร์ และหันไปเน้นหลักสูตรเชิงปฏิบัติล้วนๆ ในขณะที่บางคนโต้แย้งว่าการมุ่งเน้นเฉพาะหลักสูตรที่เน้นการจ้างงานจะเตรียมบัณฑิตให้พร้อมสำหรับตลาดแรงงานได้ดีกว่า ส่วนตัวผมเชื่อว่ามหาวิทยาลัยควรเปิดสอนวิชาศิลปศาสตร์ต่อไป และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that universities should focus only on practical courses. To explain it simply, this is possibly because graduates with technical skills often find employment more quickly after graduation; therefore, replacing arts subjects with practical training could reduce graduate unemployment. For example, engineering and computer science graduates in many countries report considerably higher starting salaries than graduates of arts programs. From this perspective, it is understandable why some would believe that practical courses better prepare students for the job market.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่ามหาวิทยาลัยควรมุ่งเน้นเฉพาะหลักสูตรเชิงปฏิบัติเท่านั้น พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าบัณฑิตที่มีทักษะทางเทคนิคมักหางานได้เร็วกว่าหลังจบการศึกษา ดังนั้น การแทนที่วิชาศิลปศาสตร์ด้วยการฝึกอบรมเชิงปฏิบัติอาจช่วยลดอัตราการว่างงานของบัณฑิตได้ ตัวอย่างเช่น บัณฑิตสาขาวิศวกรรมและวิทยาการคอมพิวเตอร์ในหลายประเทศรายงานเงินเดือนเริ่มต้นที่สูงกว่าบัณฑิตสาขาศิลปศาสตร์อย่างมาก จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าหลักสูตรเชิงปฏิบัติเตรียมนักศึกษาให้พร้อมสำหรับตลาดแรงงานได้ดีกว่า'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that universities should continue teaching arts subjects. To put it simply, this is due to the fact that subjects such as philosophy and history develop critical thinking and communication skills, which employers in every industry continue to value. For instance, many successful business leaders, including several well-known technology founders, credit their humanities education with shaping their creative and analytical abilities. In this respect, it is evident that arts subjects provide skills that remain valuable regardless of a graduate's chosen career.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่ามหาวิทยาลัยควรเปิดสอนวิชาศิลปศาสตร์ต่อไป พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าวิชาต่างๆ เช่น ปรัชญาและประวัติศาสตร์พัฒนาทักษะการคิดวิเคราะห์และการสื่อสาร ซึ่งนายจ้างในทุกอุตสาหกรรมยังคงให้ความสำคัญ ตัวอย่างเช่น ผู้นำธุรกิจที่ประสบความสำเร็จหลายคน รวมถึงผู้ก่อตั้งบริษัทเทคโนโลยีที่มีชื่อเสียงหลายราย ให้เครดิตแก่การศึกษาด้านมนุษยศาสตร์ในการหล่อหลอมความสามารถเชิงสร้างสรรค์และเชิงวิเคราะห์ของพวกเขา ในแง่นี้ เห็นได้ชัดว่าวิชาศิลปศาสตร์ให้ทักษะที่ยังคงมีคุณค่าไม่ว่าบัณฑิตจะเลือกอาชีพใดก็ตาม'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that practical courses can improve graduates' short-term job prospects, I am of the opinion that universities should continue offering arts subjects, as they build skills that benefit graduates throughout their careers.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าหลักสูตรเชิงปฏิบัติสามารถปรับปรุงโอกาสการทำงานระยะสั้นของบัณฑิตได้ ผมมีความเห็นว่ามหาวิทยาลัยควรเปิดสอนวิชาศิลปศาสตร์ต่อไป เนื่องจากช่วยสร้างทักษะที่เป็นประโยชน์ต่อบัณฑิตตลอดอาชีพการงาน'
      }
    ],
    vocab: [
      { word: "critical thinking", thaiMeaning: "การคิดวิเคราะห์" },
      { word: "starting salaries", thaiMeaning: "เงินเดือนเริ่มต้น" },
      { word: "humanities education", thaiMeaning: "การศึกษาด้านมนุษยศาสตร์" },
      { word: "job prospects", thaiMeaning: "โอกาสในการทำงาน" },
      { word: "employment-focused courses", thaiMeaning: "หลักสูตรที่มุ่งเน้นการจ้างงาน" },
      { word: "computer science graduates", thaiMeaning: "บัณฑิตวิทยาการคอมพิวเตอร์" },
      { word: "purely practical courses", thaiMeaning: "หลักสูตรเชิงปฏิบัติล้วน" },
      { word: "throughout their careers", thaiMeaning: "ตลอดอาชีพการงาน" },
      { word: "graduate unemployment", thaiMeaning: "การว่างงานของบัณฑิต" },
      { word: "communication skills", thaiMeaning: "ทักษะการสื่อสาร" },
      { word: "analytical abilities", thaiMeaning: "ความสามารถเชิงวิเคราะห์" },
      { word: "technology founders", thaiMeaning: "ผู้ก่อตั้งบริษัทเทคโนโลยี" },
      { word: "practical training", thaiMeaning: "การฝึกอบรมเชิงปฏิบัติ" },
      { word: "technical skills", thaiMeaning: "ทักษะทางเทคนิค" },
      { word: "business leaders", thaiMeaning: "ผู้นำทางธุรกิจ" },
      { word: "tuition fees", thaiMeaning: "ค่าเล่าเรียน" },
      { word: "job market", thaiMeaning: "ตลาดแรงงาน" },
      { word: "arts subjects", thaiMeaning: "วิชาสายศิลป์" },
      { word: "find employment", thaiMeaning: "หางานทำ" },
      { word: "chosen career", thaiMeaning: "อาชีพที่เลือก" },
      { word: "make practical courses more appealing", thaiMeaning: "ทำให้หลักสูตรเชิงปฏิบัติดึงดูดกว่า" },
      { word: "philosophy and history", thaiMeaning: "ปรัชญาและประวัติศาสตร์" },
      { word: "focus only on practical courses", thaiMeaning: "มุ่งเน้นเฉพาะหลักสูตรเชิงปฏิบัติ" },
      { word: "more quickly after graduation", thaiMeaning: "ได้งานเร็วขึ้นหลังจบการศึกษา" },
      { word: "graduates of arts programs", thaiMeaning: "บัณฑิตจากหลักสูตรสายศิลป์" },
      { word: "employers in every industry", thaiMeaning: "นายจ้างในทุกอุตสาหกรรม" },
      { word: "continue to value", thaiMeaning: "ยังคงให้ความสำคัญ" },
      { word: "remain valuable regardless", thaiMeaning: "ยังมีค่าไม่ว่าจะอย่างไร" },
      { word: "build skills that benefit graduates", thaiMeaning: "สร้างทักษะที่เป็นประโยชน์ต่อบัณฑิต" },
      { word: "report considerably higher", thaiMeaning: "รายงานว่าสูงกว่าอย่างชัดเจน" },
      { word: "including several well-known", thaiMeaning: "รวมถึงหลายรายที่มีชื่อเสียง" },
      { word: "better prepare graduates", thaiMeaning: "เตรียมบัณฑิตได้ดีกว่า" }
    ]
  },
  {
    id: 't2-twe-5',
    number: 5,
    typeId: 'to-what-extent',
    title: 'Is Responsible Tourism Possible?',
    questionText:
      'Some people believe it is impossible for tourists to be responsible towards the environment and local culture. To what extent do you agree or disagree?',
    meta: 'Vietnam · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while tourism inevitably affects the places visited, it is impossible for any tourist to be truly responsible toward both culture and environment. Others argue that with careful planning, tourists can genuinely reduce their negative impact. I personally believe that being a responsible tourist is possible, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การท่องเที่ยวจะส่งผลกระทบต่อสถานที่ที่ไปเยือนอย่างหลีกเลี่ยงไม่ได้ แต่ก็เป็นไปไม่ได้ที่นักท่องเที่ยวคนใดจะมีความรับผิดชอบอย่างแท้จริงทั้งต่อวัฒนธรรมและสิ่งแวดล้อม ในขณะที่บางคนโต้แย้งว่าด้วยการวางแผนอย่างรอบคอบ นักท่องเที่ยวสามารถลดผลกระทบเชิงลบได้อย่างแท้จริง ส่วนตัวผมเชื่อว่าการเป็นนักท่องเที่ยวที่มีความรับผิดชอบนั้นเป็นไปได้ และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that responsible tourism is impossible to achieve. To explain it simply, this is possibly because even eco-friendly travel requires transportation that produces carbon emissions; therefore, every visit inevitably damages the environment to some degree. For example, flights to popular island destinations such as the Maldives contribute significantly to global carbon emissions regardless of a tourist's intentions. From this perspective, it is understandable why some would believe that no tourist can be entirely responsible.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าการท่องเที่ยวอย่างมีความรับผิดชอบเป็นสิ่งที่เป็นไปไม่ได้ พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าแม้แต่การเดินทางที่เป็นมิตรต่อสิ่งแวดล้อมก็ยังต้องใช้การขนส่งที่ก่อให้เกิดการปล่อยก๊าซคาร์บอน ดังนั้น การมาเยือนทุกครั้งจึงสร้างความเสียหายต่อสิ่งแวดล้อมไม่มากก็น้อยอย่างหลีกเลี่ยงไม่ได้ ตัวอย่างเช่น เที่ยวบินไปยังจุดหมายปลายทางเกาะยอดนิยม เช่น มัลดีฟส์ มีส่วนสำคัญต่อการปล่อยก๊าซคาร์บอนทั่วโลก ไม่ว่าเจตนาของนักท่องเที่ยวจะเป็นอย่างไร จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าไม่มีนักท่องเที่ยวคนใดจะมีความรับผิดชอบอย่างสมบูรณ์ได้'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that responsible tourism is achievable. To put it simply, this is due to the fact that tourists can make deliberate choices, such as supporting local businesses and respecting local customs, which significantly reduce their overall impact. For instance, many visitors to Bhutan follow strict government guidelines designed to protect both the environment and traditional culture. In this respect, it is evident that responsible tourism, while not perfect, is a realistic and achievable goal.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่าการท่องเที่ยวอย่างมีความรับผิดชอบนั้นสามารถบรรลุได้ พูดง่ายๆ ก็คือ นี่เป็นเพราะว่านักท่องเที่ยวสามารถเลือกทำสิ่งต่างๆ อย่างตั้งใจ เช่น สนับสนุนธุรกิจท้องถิ่นและเคารพขนบธรรมเนียมท้องถิ่น ซึ่งช่วยลดผลกระทบโดยรวมได้อย่างมีนัยสำคัญ ตัวอย่างเช่น นักท่องเที่ยวจำนวนมากที่ไปภูฏานปฏิบัติตามแนวทางของรัฐบาลที่เข้มงวดซึ่งออกแบบมาเพื่อปกป้องทั้งสิ่งแวดล้อมและวัฒนธรรมดั้งเดิม ในแง่นี้ เห็นได้ชัดว่าการท่องเที่ยวอย่างมีความรับผิดชอบ แม้จะไม่สมบูรณ์แบบ แต่ก็เป็นเป้าหมายที่เป็นจริงและบรรลุได้'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that all tourism carries some environmental cost, I am of the opinion that being a responsible tourist is possible, as thoughtful choices can greatly reduce this impact.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าการท่องเที่ยวทุกรูปแบบมีต้นทุนด้านสิ่งแวดล้อมอยู่บ้าง ผมมีความเห็นว่าการเป็นนักท่องเที่ยวที่มีความรับผิดชอบนั้นเป็นไปได้ เนื่องจากการเลือกอย่างรอบคอบสามารถลดผลกระทบนี้ได้อย่างมาก'
      }
    ],
    vocab: [
      { word: "carbon emissions", thaiMeaning: "การปล่อยก๊าซคาร์บอน" },
      { word: "local customs", thaiMeaning: "ขนบธรรมเนียมท้องถิ่น" },
      { word: "government guidelines", thaiMeaning: "แนวทางของรัฐบาล" },
      { word: "responsible tourism", thaiMeaning: "การท่องเที่ยวอย่างรับผิดชอบ" },
      { word: "eco-friendly travel", thaiMeaning: "การเดินทางที่เป็นมิตรต่อสิ่งแวดล้อม" },
      { word: "popular island destinations", thaiMeaning: "จุดหมายปลายทางเกาะยอดนิยม" },
      { word: "environmental cost", thaiMeaning: "ต้นทุนด้านสิ่งแวดล้อม" },
      { word: "traditional culture", thaiMeaning: "วัฒนธรรมดั้งเดิม" },
      { word: "responsible tourist", thaiMeaning: "นักท่องเที่ยวที่รับผิดชอบ" },
      { word: "deliberate choices", thaiMeaning: "ทางเลือกโดยตั้งใจ" },
      { word: "thoughtful choices", thaiMeaning: "การเลือกอย่างรอบคอบ" },
      { word: "local businesses", thaiMeaning: "ธุรกิจท้องถิ่น" },
      { word: "careful planning", thaiMeaning: "การวางแผนอย่างรอบคอบ" },
      { word: "negative impact", thaiMeaning: "ผลกระทบด้านลบ" },
      { word: "overall impact", thaiMeaning: "ผลกระทบโดยรวม" },
      { word: "achievable goal", thaiMeaning: "เป้าหมายที่บรรลุได้" },
      { word: "entirely responsible", thaiMeaning: "รับผิดชอบอย่างสมบูรณ์" },
      { word: "genuinely reduce", thaiMeaning: "ลดลงอย่างแท้จริง" },
      { word: "damages the environment", thaiMeaning: "ทำลายสิ่งแวดล้อม" },
      { word: "realistic and achievable", thaiMeaning: "สมจริงและบรรลุได้" },
      { word: "greatly reduce this impact", thaiMeaning: "ลดผลกระทบนี้ได้อย่างมาก" },
      { word: "impossible to achieve", thaiMeaning: "เป็นไปไม่ได้ที่จะบรรลุ" },
      { word: "to some degree", thaiMeaning: "ในระดับหนึ่ง" },
      { word: "tourist's intentions", thaiMeaning: "เจตนาของนักท่องเที่ยว" },
      { word: "visitors to Bhutan", thaiMeaning: "ผู้เยี่ยมชมภูฏาน" },
      { word: "protect both the environment", thaiMeaning: "ปกป้องทั้งสิ่งแวดล้อม" },
      { word: "while not perfect", thaiMeaning: "แม้ไม่สมบูรณ์แบบ" },
      { word: "all tourism carries some", thaiMeaning: "การท่องเที่ยวทั้งหมดก่อให้เกิดบางส่วน" },
      { word: "requires transportation that produces", thaiMeaning: "ต้องอาศัยการขนส่งที่ก่อให้เกิด" },
      { word: "such as the Maldives", thaiMeaning: "อย่างเช่นมัลดีฟส์" },
      { word: "contribute significantly", thaiMeaning: "มีส่วนอย่างมาก" },
      { word: "truly responsible toward both culture and environment", thaiMeaning: "รับผิดชอบต่อวัฒนธรรมและสิ่งแวดล้อมอย่างแท้จริง" }
    ]
  },
  {
    id: 't2-twe-6',
    number: 6,
    typeId: 'to-what-extent',
    title: 'Should Extinction Be Prevented?',
    questionText:
      'It is a natural process when animal species become extinct, as dinosaurs died out in the past. There is no reason for people to prevent this from happening. To what extent do you agree or disagree?',
    meta: 'Australia · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while extinction has occurred naturally throughout Earth's history, humans have no obligation to prevent animal species from dying out today. Others argue that people have a responsibility to protect endangered species from disappearing completely. I personally believe that humans should actively work to prevent extinction, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การสูญพันธุ์จะเกิดขึ้นตามธรรมชาติตลอดประวัติศาสตร์ของโลก แต่มนุษย์ไม่มีพันธะที่จะต้องป้องกันไม่ให้สัตว์สายพันธุ์ต่างๆ สูญพันธุ์ไปในปัจจุบัน ในขณะที่บางคนโต้แย้งว่าผู้คนมีความรับผิดชอบในการปกป้องสัตว์ใกล้สูญพันธุ์ไม่ให้หายไปโดยสิ้นเชิง ส่วนตัวผมเชื่อว่ามนุษย์ควรดำเนินการอย่างจริงจังเพื่อป้องกันการสูญพันธุ์ และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that extinction is simply a natural process that should not be interfered with. To explain it simply, this is possibly because countless species, including dinosaurs, vanished long before humans existed; therefore, some believe modern extinctions are merely part of the same natural cycle. For example, several land mammal species disappeared during past ice ages without any human involvement whatsoever. From this perspective, it is understandable why some would believe that current extinctions require no special human intervention.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าการสูญพันธุ์เป็นเพียงกระบวนการทางธรรมชาติที่ไม่ควรเข้าไปแทรกแซง พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าสิ่งมีชีวิตนับไม่ถ้วน รวมถึงไดโนเสาร์ ได้สูญหายไปนานก่อนที่มนุษย์จะถือกำเนิดขึ้น ดังนั้น บางคนจึงเชื่อว่าการสูญพันธุ์ในยุคปัจจุบันเป็นเพียงส่วนหนึ่งของวัฏจักรธรรมชาติเดียวกัน ตัวอย่างเช่น สัตว์เลี้ยงลูกด้วยนมบนบกหลายสายพันธุ์สูญหายไปในช่วงยุคน้ำแข็งในอดีตโดยไม่มีการเข้ามาเกี่ยวข้องของมนุษย์เลย จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการสูญพันธุ์ในปัจจุบันไม่จำเป็นต้องมีการแทรกแซงพิเศษจากมนุษย์'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that humans should take active steps to prevent extinction. To put it simply, this is due to the fact that most extinctions today are caused directly by human activity rather than natural processes, which makes them our responsibility to address. For instance, a 2019 United Nations report found that around one million species now face extinction largely because of habitat destruction and pollution. In this respect, it is evident that human-driven extinction differs fundamentally from the natural extinctions of the distant past.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่ามนุษย์ควรดำเนินขั้นตอนอย่างจริงจังเพื่อป้องกันการสูญพันธุ์ พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าการสูญพันธุ์ส่วนใหญ่ในปัจจุบันเกิดจากกิจกรรมของมนุษย์โดยตรงมากกว่ากระบวนการทางธรรมชาติ ซึ่งทำให้เป็นความรับผิดชอบของเราที่จะต้องจัดการ ตัวอย่างเช่น รายงานของสหประชาชาติในปี 2019 พบว่าปัจจุบันมีสัตว์ประมาณหนึ่งล้านสายพันธุ์กำลังเผชิญกับการสูญพันธุ์ ส่วนใหญ่เนื่องมาจากการทำลายถิ่นที่อยู่อาศัยและมลพิษ ในแง่นี้ เห็นได้ชัดว่าการสูญพันธุ์ที่เกิดจากมนุษย์นั้นแตกต่างโดยพื้นฐานจากการสูญพันธุ์ตามธรรมชาติในอดีตอันไกลโพ้น'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that extinction has always occurred naturally, I am of the opinion that humans should work to prevent it, as most modern cases result directly from human actions.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าการสูญพันธุ์เกิดขึ้นตามธรรมชาติเสมอมา ผมมีความเห็นว่ามนุษย์ควรทำงานเพื่อป้องกันการสูญพันธุ์ เนื่องจากกรณีส่วนใหญ่ในปัจจุบันเป็นผลโดยตรงจากการกระทำของมนุษย์'
      }
    ],
    vocab: [
      { word: "endangered species", thaiMeaning: "สัตว์ใกล้สูญพันธุ์" },
      { word: "natural cycle", thaiMeaning: "วัฏจักรตามธรรมชาติ" },
      { word: "habitat destruction", thaiMeaning: "การทำลายถิ่นที่อยู่อาศัย" },
      { word: "human activity", thaiMeaning: "กิจกรรมของมนุษย์" },
      { word: "human-driven extinction", thaiMeaning: "การสูญพันธุ์ที่มนุษย์ก่อให้เกิด" },
      { word: "United Nations report", thaiMeaning: "รายงานของสหประชาชาติ" },
      { word: "land mammal species", thaiMeaning: "ชนิดพันธุ์สัตว์เลี้ยงลูกด้วยนมบนบก" },
      { word: "disappearing completely", thaiMeaning: "หายไปอย่างสมบูรณ์" },
      { word: "natural extinctions", thaiMeaning: "การสูญพันธุ์ตามธรรมชาติ" },
      { word: "human intervention", thaiMeaning: "การแทรกแซงของมนุษย์" },
      { word: "prevent extinction", thaiMeaning: "ป้องกันการสูญพันธุ์" },
      { word: "modern extinctions", thaiMeaning: "การสูญพันธุ์ในยุคปัจจุบัน" },
      { word: "human involvement", thaiMeaning: "การมีส่วนร่วมของมนุษย์" },
      { word: "countless species", thaiMeaning: "ชนิดพันธุ์นับไม่ถ้วน" },
      { word: "natural process", thaiMeaning: "กระบวนการตามธรรมชาติ" },
      { word: "animal species", thaiMeaning: "ชนิดพันธุ์สัตว์" },
      { word: "distant past", thaiMeaning: "อดีตอันไกล" },
      { word: "active steps", thaiMeaning: "มาตรการเชิงรุก" },
      { word: "no obligation", thaiMeaning: "ไม่มีข้อผูกมัด" },
      { word: "human actions", thaiMeaning: "การกระทำของมนุษย์" },
      { word: "dying out today", thaiMeaning: "สูญพันธุ์ในปัจจุบัน" },
      { word: "should not be interfered with", thaiMeaning: "ไม่ควรเข้าไปแทรกแซง" },
      { word: "vanished long before humans existed", thaiMeaning: "หายไปนานก่อนที่มนุษย์จะมีอยู่" },
      { word: "past ice ages", thaiMeaning: "ยุคน้ำแข็งในอดีต" },
      { word: "most extinctions today", thaiMeaning: "การสูญพันธุ์ส่วนใหญ่ในปัจจุบัน" },
      { word: "makes them our responsibility to address", thaiMeaning: "ทำให้เป็นความรับผิดชอบของเราที่ต้องแก้ไข" },
      { word: "around one million species", thaiMeaning: "ชนิดพันธุ์ราวหนึ่งล้าน" },
      { word: "now face extinction", thaiMeaning: "กำลังเผชิญการสูญพันธุ์" },
      { word: "differs fundamentally", thaiMeaning: "แตกต่างโดยพื้นฐาน" },
      { word: "always occurred naturally", thaiMeaning: "เกิดขึ้นตามธรรมชาติอยู่เสมอ" },
      { word: "Earth's history", thaiMeaning: "ประวัติศาสตร์ของโลก" },
      { word: "including dinosaurs", thaiMeaning: "รวมถึงไดโนเสาร์" }
    ]
  },
  {
    id: 't2-twe-7',
    number: 7,
    typeId: 'to-what-extent',
    title: 'Preventing Illness vs. Treating the Sick',
    questionText:
      'Some people think it is more important to spend public money on promoting healthy lifestyles to prevent disease than to treat people who are already sick. Do you agree or disagree with this statement?',
    meta: 'UK · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while treating illness remains necessary, governments should prioritize public spending on promoting healthy lifestyles over treating people who are already sick. Others argue that treatment should remain the top funding priority, since sick people need immediate medical care. I personally believe that prevention deserves greater public investment, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การรักษาผู้ป่วยจะยังคงมีความจำเป็น แต่รัฐบาลควรให้ความสำคัญกับการใช้จ่ายสาธารณะในการส่งเสริมวิถีชีวิตที่มีสุขภาพดีมากกว่าการรักษาผู้ที่ป่วยอยู่แล้ว ในขณะที่บางคนโต้แย้งว่าการรักษาควรยังคงเป็นลำดับความสำคัญด้านเงินทุนอันดับต้น เนื่องจากผู้ป่วยต้องการการดูแลทางการแพทย์อย่างเร่งด่วน ส่วนตัวผมเชื่อว่าการป้องกันสมควรได้รับการลงทุนสาธารณะมากกว่า และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that treating existing illness should remain the government's main priority. To explain it simply, this is possibly because sick patients require urgent medical attention that cannot be delayed; therefore, reducing treatment funding could put vulnerable lives at serious risk. For example, cancer patients and accident victims often need immediate hospital care regardless of how much money is spent on prevention. From this perspective, it is understandable why some would believe that treating the sick should take precedence over prevention campaigns.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าการรักษาโรคที่มีอยู่แล้วควรยังคงเป็นลำดับความสำคัญหลักของรัฐบาล พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าผู้ป่วยต้องการการดูแลทางการแพทย์อย่างเร่งด่วนที่ไม่สามารถล่าช้าได้ ดังนั้น การลดเงินทุนด้านการรักษาอาจทำให้ชีวิตของกลุ่มเปราะบางตกอยู่ในความเสี่ยงร้ายแรง ตัวอย่างเช่น ผู้ป่วยมะเร็งและผู้ประสบอุบัติเหตุมักต้องการการดูแลในโรงพยาบาลอย่างเร่งด่วน ไม่ว่าจะใช้เงินไปกับการป้องกันมากเพียงใดก็ตาม จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการรักษาผู้ป่วยควรมีความสำคัญเหนือกว่าแคมเปญการป้องกัน'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that promoting healthy lifestyles deserves greater public investment. To put it simply, this is due to the fact that preventing illness before it develops reduces long-term healthcare costs, which ultimately benefits the entire population. For instance, a 2020 World Health Organization study found that every dollar spent on obesity-prevention programs saved several dollars in future treatment costs. In this respect, it is evident that prevention spending produces greater long-term benefits for public health systems.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่าการส่งเสริมวิถีชีวิตที่มีสุขภาพดีสมควรได้รับการลงทุนสาธารณะมากกว่า พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าการป้องกันโรคก่อนที่จะเกิดขึ้นช่วยลดต้นทุนการดูแลสุขภาพในระยะยาว ซึ่งท้ายที่สุดเป็นประโยชน์ต่อประชากรทั้งหมด ตัวอย่างเช่น การศึกษาขององค์การอนามัยโลกในปี 2020 พบว่าทุกๆ หนึ่งดอลลาร์ที่ใช้จ่ายไปกับโครงการป้องกันโรคอ้วนช่วยประหยัดค่าใช้จ่ายในการรักษาในอนาคตได้หลายดอลลาร์ ในแง่นี้ เห็นได้ชัดว่าการใช้จ่ายด้านการป้องกันก่อให้เกิดประโยชน์ระยะยาวที่มากกว่าต่อระบบสาธารณสุข'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that treating sick patients remains an urgent necessity, I am of the opinion that promoting healthy lifestyles should receive greater public funding, as prevention reduces future healthcare burdens significantly.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าการรักษาผู้ป่วยยังคงเป็นความจำเป็นเร่งด่วน ผมมีความเห็นว่าการส่งเสริมวิถีชีวิตที่มีสุขภาพดีควรได้รับเงินทุนสาธารณะมากกว่า เนื่องจากการป้องกันช่วยลดภาระด้านการดูแลสุขภาพในอนาคตได้อย่างมาก'
      }
    ],
    vocab: [
      { word: "healthy lifestyles", thaiMeaning: "วิถีชีวิตที่ดีต่อสุขภาพ" },
      { word: "medical attention", thaiMeaning: "การดูแลรักษาทางการแพทย์" },
      { word: "healthcare costs", thaiMeaning: "ค่าใช้จ่ายด้านสุขภาพ" },
      { word: "public health systems", thaiMeaning: "ระบบสาธารณสุข" },
      { word: "obesity-prevention programs", thaiMeaning: "โปรแกรมป้องกันโรคอ้วน" },
      { word: "immediate medical care", thaiMeaning: "การรักษาพยาบาลทันที" },
      { word: "prevention campaigns", thaiMeaning: "แคมเปญการป้องกัน" },
      { word: "long-term benefits", thaiMeaning: "ประโยชน์ระยะยาว" },
      { word: "healthcare burdens", thaiMeaning: "ภาระด้านสาธารณสุข" },
      { word: "public investment", thaiMeaning: "การลงทุนภาครัฐ" },
      { word: "funding priority", thaiMeaning: "ลำดับความสำคัญด้านงบประมาณ" },
      { word: "existing illness", thaiMeaning: "อาการเจ็บป่วยที่มีอยู่แล้ว" },
      { word: "accident victims", thaiMeaning: "ผู้ประสบอุบัติเหตุ" },
      { word: "cancer patients", thaiMeaning: "ผู้ป่วยโรคมะเร็ง" },
      { word: "vulnerable lives", thaiMeaning: "ชีวิตที่เปราะบาง" },
      { word: "urgent necessity", thaiMeaning: "ความจำเป็นเร่งด่วน" },
      { word: "public spending", thaiMeaning: "การใช้จ่ายภาครัฐ" },
      { word: "treatment costs", thaiMeaning: "ค่าใช้จ่ายในการรักษา" },
      { word: "take precedence", thaiMeaning: "มีความสำคัญเหนือกว่า" },
      { word: "entire population", thaiMeaning: "ประชากรทั้งหมด" },
      { word: "already sick", thaiMeaning: "เจ็บป่วยอยู่แล้ว" },
      { word: "prevention deserves greater", thaiMeaning: "การป้องกันสมควรได้รับมากกว่า" },
      { word: "government's main priority", thaiMeaning: "ลำดับความสำคัญหลักของรัฐบาล" },
      { word: "cannot be delayed", thaiMeaning: "ไม่สามารถเลื่อนได้" },
      { word: "reducing treatment funding", thaiMeaning: "การลดงบประมาณการรักษา" },
      { word: "at serious risk", thaiMeaning: "มีความเสี่ยงร้ายแรง" },
      { word: "often need immediate hospital care", thaiMeaning: "มักต้องการการรักษาในโรงพยาบาลทันที" },
      { word: "regardless of how much money", thaiMeaning: "ไม่ว่าจะใช้งบประมาณเท่าใด" },
      { word: "spent on prevention", thaiMeaning: "ใช้ไปกับการป้องกัน" },
      { word: "preventing illness before it develops", thaiMeaning: "ป้องกันอาการเจ็บป่วยก่อนเกิด" },
      { word: "World Health Organization study", thaiMeaning: "การศึกษาขององค์การอนามัยโลก" },
      { word: "should receive greater public funding", thaiMeaning: "ควรได้รับงบประมาณภาครัฐมากขึ้น" }
    ]
  },
  {
    id: 't2-twe-8',
    number: 8,
    typeId: 'to-what-extent',
    title: 'Raising the Minimum Driving Age',
    questionText:
      'Some people believe that the best way to improve road safety is to raise the minimum age for driving cars and motorcycles. To what extent do you agree or disagree?',
    meta: 'Vietnam · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while young drivers gain independence early, raising the minimum age for driving cars and motorcycles is the best way to improve road safety. Others argue that stricter testing and driver education would be more effective than simply raising the age limit. I personally believe that raising the minimum driving age is the most effective solution, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ผู้ขับขี่วัยหนุ่มสาวจะได้รับความเป็นอิสระตั้งแต่เนิ่นๆ แต่การเพิ่มอายุขั้นต่ำสำหรับการขับรถยนต์และรถจักรยานยนต์เป็นวิธีที่ดีที่สุดในการปรับปรุงความปลอดภัยทางถนน ในขณะที่บางคนโต้แย้งว่าการทดสอบที่เข้มงวดขึ้นและการศึกษาผู้ขับขี่จะมีประสิทธิภาพมากกว่าการเพิ่มขีดจำกัดอายุเพียงอย่างเดียว ส่วนตัวผมเชื่อว่าการเพิ่มอายุขั้นต่ำในการขับรถเป็นวิธีแก้ปัญหาที่มีประสิทธิภาพที่สุด และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that better training programs would improve road safety more effectively than age restrictions. To explain it simply, this is possibly because skill and experience matter more than age when operating a vehicle safely; therefore, some believe intensive driving courses could reduce accidents without delaying independence. For example, several countries already require additional lessons for newly licensed drivers before allowing them to drive unsupervised. From this perspective, it is understandable why some would believe that improved training addresses the root cause of dangerous driving.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าโปรแกรมการฝึกอบรมที่ดีขึ้นจะช่วยปรับปรุงความปลอดภัยทางถนนได้อย่างมีประสิทธิภาพมากกว่าการจำกัดอายุ พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าทักษะและประสบการณ์มีความสำคัญมากกว่าอายุเมื่อขับขี่ยานพาหนะอย่างปลอดภัย ดังนั้น บางคนจึงเชื่อว่าหลักสูตรการขับขี่แบบเข้มข้นสามารถลดอุบัติเหตุได้โดยไม่ต้องเลื่อนความเป็นอิสระออกไป ตัวอย่างเช่น หลายประเทศกำหนดให้ผู้ขับขี่ที่เพิ่งได้รับใบอนุญาตต้องเรียนบทเรียนเพิ่มเติมก่อนที่จะได้รับอนุญาตให้ขับขี่โดยไม่มีผู้ควบคุมดูแล จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการฝึกอบรมที่ดีขึ้นแก้ไขที่ต้นตอของการขับขี่ที่เป็นอันตราย'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that raising the minimum driving age is the most effective measure. To put it simply, this is due to the fact that younger drivers' brains are still developing the judgment needed for quick decision-making, which extra training cannot fully replace. For instance, a 2021 study by the World Health Organization found that drivers aged sixteen to nineteen are nearly three times more likely to crash than drivers over twenty-five. In this respect, it is evident that raising the minimum age directly targets the drivers most at risk of causing accidents.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่าการเพิ่มอายุขั้นต่ำในการขับรถเป็นมาตรการที่มีประสิทธิภาพที่สุด พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าสมองของผู้ขับขี่ที่อายุน้อยกว่ายังคงอยู่ในระหว่างการพัฒนาความสามารถในการตัดสินใจที่จำเป็นสำหรับการตัดสินใจอย่างรวดเร็ว ซึ่งการฝึกอบรมเพิ่มเติมไม่สามารถทดแทนได้อย่างสมบูรณ์ ตัวอย่างเช่น การศึกษาขององค์การอนามัยโลกในปี 2021 พบว่าผู้ขับขี่อายุสิบหกถึงสิบเก้าปีมีโอกาสเกิดอุบัติเหตุมากกว่าผู้ขับขี่ที่อายุมากกว่ายี่สิบห้าปีเกือบสามเท่า ในแง่นี้ เห็นได้ชัดว่าการเพิ่มอายุขั้นต่ำมุ่งเป้าไปที่ผู้ขับขี่ที่มีความเสี่ยงสูงสุดในการก่อให้เกิดอุบัติเหตุโดยตรง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that better training could reduce some accidents, I am of the opinion that raising the minimum driving age remains the most effective way to improve road safety.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าการฝึกอบรมที่ดีขึ้นสามารถลดอุบัติเหตุบางส่วนได้ ผมมีความเห็นว่าการเพิ่มอายุขั้นต่ำในการขับรถยังคงเป็นวิธีที่มีประสิทธิภาพที่สุดในการปรับปรุงความปลอดภัยทางถนน'
      }
    ],
    vocab: [
      { word: "road safety", thaiMeaning: "ความปลอดภัยบนท้องถนน" },
      { word: "driver education", thaiMeaning: "การอบรมผู้ขับขี่" },
      { word: "decision-making", thaiMeaning: "การตัดสินใจ" },
      { word: "age restrictions", thaiMeaning: "ข้อจำกัดด้านอายุ" },
      { word: "minimum driving age", thaiMeaning: "อายุขั้นต่ำในการขับขี่" },
      { word: "intensive driving courses", thaiMeaning: "หลักสูตรขับรถเข้มข้น" },
      { word: "newly licensed drivers", thaiMeaning: "ผู้ขับขี่ที่เพิ่งได้รับใบอนุญาต" },
      { word: "World Health Organization", thaiMeaning: "องค์การอนามัยโลก" },
      { word: "operating a vehicle", thaiMeaning: "การขับรถยนต์" },
      { word: "skill and experience", thaiMeaning: "ทักษะและประสบการณ์" },
      { word: "delaying independence", thaiMeaning: "การเลื่อนความเป็นอิสระ" },
      { word: "dangerous driving", thaiMeaning: "การขับขี่อันตราย" },
      { word: "training programs", thaiMeaning: "โปรแกรมการฝึกอบรม" },
      { word: "drive unsupervised", thaiMeaning: "ขับรถโดยไม่มีผู้ควบคุม" },
      { word: "stricter testing", thaiMeaning: "การทดสอบที่เข้มงวดขึ้น" },
      { word: "effective measure", thaiMeaning: "มาตรการที่มีประสิทธิภาพ" },
      { word: "younger drivers", thaiMeaning: "ผู้ขับขี่ที่อายุน้อย" },
      { word: "additional lessons", thaiMeaning: "บทเรียนเพิ่มเติม" },
      { word: "gain independence", thaiMeaning: "ได้รับอิสรภาพ" },
      { word: "root cause", thaiMeaning: "สาเหตุรากเหง้า" },
      { word: "raising the age limit", thaiMeaning: "การเพิ่มขีดจำกัดอายุ" },
      { word: "most effective solution", thaiMeaning: "ทางออกที่มีประสิทธิภาพที่สุด" },
      { word: "extra training cannot fully replace", thaiMeaning: "การฝึกเพิ่มเติมทดแทนได้ไม่เต็มที่" },
      { word: "drivers aged sixteen to nineteen", thaiMeaning: "ผู้ขับขี่อายุสิบหกถึงสิบเก้าปี" },
      { word: "nearly three times more likely to crash", thaiMeaning: "มีโอกาสชนเกือบสามเท่า" },
      { word: "drivers over twenty-five", thaiMeaning: "ผู้ขับขี่อายุเกินยี่สิบห้าปี" },
      { word: "directly targets the drivers most at risk", thaiMeaning: "มุ่งเป้าไปที่ผู้ขับขี่ที่เสี่ยงที่สุด" },
      { word: "better training could reduce some accidents", thaiMeaning: "การฝึกที่ดีกว่าอาจลดอุบัติเหตุบางส่วน" },
      { word: "minimum age for driving cars and motorcycles", thaiMeaning: "อายุขั้นต่ำสำหรับขับรถยนต์และมอเตอร์ไซค์" },
      { word: "matter more than age", thaiMeaning: "สำคัญกว่าอายุ" },
      { word: "brains are still developing", thaiMeaning: "สมองยังอยู่ในช่วงพัฒนา" },
      { word: "judgment needed for quick", thaiMeaning: "วิจารณญาณที่จำเป็นสำหรับการตัดสินใจเร็ว" }
    ]
  },
  {
    id: 't2-twe-9',
    number: 9,
    typeId: 'to-what-extent',
    title: 'Unpaid Community Work for Teenagers',
    questionText:
      'Some people think that teenagers should do some unpaid work in the local community. Some people believe that it benefits both young people and society as a whole. To what extent do you agree or disagree?',
    meta: 'France · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while schoolwork already demands considerable time, teenagers should be required to do unpaid work in their local community, since this benefits both young people and society as a whole. Others argue that teenagers should focus entirely on their studies instead of taking on additional unpaid responsibilities. I personally believe that community work brings valuable benefits to teenagers, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้งานในโรงเรียนจะเรียกร้องเวลาอย่างมากอยู่แล้ว แต่วัยรุ่นควรถูกกำหนดให้ทำงานอาสาสมัครในชุมชนท้องถิ่นโดยไม่ได้รับค่าตอบแทน เนื่องจากสิ่งนี้เป็นประโยชน์ต่อทั้งเยาวชนและสังคมโดยรวม ในขณะที่บางคนโต้แย้งว่าวัยรุ่นควรมุ่งเน้นการเรียนของตนอย่างเต็มที่แทนที่จะรับผิดชอบเพิ่มเติมโดยไม่ได้รับค่าตอบแทน ส่วนตัวผมเชื่อว่างานชุมชนนำมาซึ่งประโยชน์อันมีค่าแก่วัยรุ่น และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that teenagers should not be required to do unpaid community work. To explain it simply, this is possibly because academic performance already places enormous pressure on students; therefore, some believe additional responsibilities could harm their exam results. For example, many students already spend several hours each evening completing homework and preparing for important examinations. From this perspective, it is understandable why some would believe that community work would place an unfair burden on busy teenagers.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าวัยรุ่นไม่ควรถูกกำหนดให้ทำงานอาสาสมัครในชุมชนโดยไม่ได้รับค่าตอบแทน พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าผลการเรียนสร้างแรงกดดันมหาศาลให้กับนักเรียนอยู่แล้ว ดังนั้น บางคนจึงเชื่อว่าความรับผิดชอบเพิ่มเติมอาจส่งผลเสียต่อผลการสอบของพวกเขา ตัวอย่างเช่น นักเรียนจำนวนมากใช้เวลาหลายชั่วโมงในแต่ละเย็นเพื่อทำการบ้านและเตรียมตัวสำหรับการสอบที่สำคัญอยู่แล้ว จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่างานชุมชนจะสร้างภาระที่ไม่เป็นธรรมแก่วัยรุ่นที่ยุ่งอยู่แล้ว'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that unpaid community work benefits both teenagers and wider society. To put it simply, this is due to the fact that volunteering teaches practical skills and responsibility, which cannot easily be learned through classroom study alone. For instance, a 2022 survey by the National Youth Agency in the UK found that teenagers who volunteered regularly reported significantly higher confidence and stronger communication skills. In this respect, it is evident that community work develops abilities that benefit young people well beyond school.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่างานชุมชนโดยไม่ได้รับค่าตอบแทนเป็นประโยชน์ต่อทั้งวัยรุ่นและสังคมในวงกว้าง พูดง่ายๆ ก็คือ นี่เป็นเพราะว่าการทำงานอาสาสมัครสอนทักษะเชิงปฏิบัติและความรับผิดชอบ ซึ่งไม่สามารถเรียนรู้ได้ง่ายผ่านการเรียนในห้องเรียนเพียงอย่างเดียว ตัวอย่างเช่น การสำรวจในปี 2022 โดยหน่วยงานเยาวชนแห่งชาติในสหราชอาณาจักรพบว่าวัยรุ่นที่ทำงานอาสาสมัครอย่างสม่ำเสมอรายงานความมั่นใจที่สูงขึ้นอย่างมีนัยสำคัญและทักษะการสื่อสารที่แข็งแกร่งขึ้น ในแง่นี้ เห็นได้ชัดว่างานชุมชนพัฒนาความสามารถที่เป็นประโยชน์ต่อคนหนุ่มสาวไปไกลกว่าโรงเรียน'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that academic study remains a priority for teenagers, I am of the opinion that unpaid community work should be encouraged, as it builds valuable life skills alongside classroom learning.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าการเรียนยังคงเป็นสิ่งสำคัญลำดับต้นสำหรับวัยรุ่น ผมมีความเห็นว่าควรส่งเสริมงานชุมชนโดยไม่ได้รับค่าตอบแทน เนื่องจากช่วยสร้างทักษะชีวิตอันมีค่าควบคู่ไปกับการเรียนในห้องเรียน'
      }
    ],
    vocab: [
      { word: "academic performance", thaiMeaning: "ผลการเรียน" },
      { word: "practical skills", thaiMeaning: "ทักษะเชิงปฏิบัติ" },
      { word: "communication skills", thaiMeaning: "ทักษะการสื่อสาร" },
      { word: "life skills", thaiMeaning: "ทักษะชีวิต" },
      { word: "unpaid community work", thaiMeaning: "งานชุมชนแบบไม่มีค่าจ้าง" },
      { word: "National Youth Agency", thaiMeaning: "หน่วยงานเยาวชนแห่งชาติ" },
      { word: "additional responsibilities", thaiMeaning: "ความรับผิดชอบเพิ่มเติม" },
      { word: "unpaid responsibilities", thaiMeaning: "ความรับผิดชอบที่ไม่มีค่าจ้าง" },
      { word: "important examinations", thaiMeaning: "การสอบที่สำคัญ" },
      { word: "volunteered regularly", thaiMeaning: "อาสาสมัครอย่างสม่ำเสมอ" },
      { word: "classroom learning", thaiMeaning: "การเรียนรู้ในห้องเรียน" },
      { word: "classroom study", thaiMeaning: "การเรียนในชั้นเรียน" },
      { word: "enormous pressure", thaiMeaning: "แรงกดดันมหาศาล" },
      { word: "local community", thaiMeaning: "ชุมชนท้องถิ่น" },
      { word: "valuable benefits", thaiMeaning: "ประโยชน์อันมีค่า" },
      { word: "unfair burden", thaiMeaning: "ภาระที่ไม่เป็นธรรม" },
      { word: "exam results", thaiMeaning: "ผลการสอบ" },
      { word: "higher confidence", thaiMeaning: "ความมั่นใจที่สูงขึ้น" },
      { word: "wider society", thaiMeaning: "สังคมโดยรวม" },
      { word: "considerable time", thaiMeaning: "เวลาค่อนข้างมาก" },
      { word: "focus entirely on their studies", thaiMeaning: "มุ่งเรียนอย่างเต็มที่" },
      { word: "busy teenagers", thaiMeaning: "วัยรุ่นที่ยุ่ง" },
      { word: "develops abilities that benefit young people well beyond school", thaiMeaning: "พัฒนาความสามารถที่เป็นประโยชน์ต่อเยาวชนไกลกว่าโรงเรียน" },
      { word: "academic study remains a priority", thaiMeaning: "การเรียนยังคงเป็นลำดับความสำคัญ" },
      { word: "should be encouraged", thaiMeaning: "ควรได้รับการส่งเสริม" },
      { word: "schoolwork already demands", thaiMeaning: "งานโรงเรียนเรียกร้องอยู่แล้ว" },
      { word: "several hours each evening", thaiMeaning: "หลายชั่วโมงทุกเย็น" },
      { word: "completing homework", thaiMeaning: "การทำการบ้าน" },
      { word: "volunteering teaches", thaiMeaning: "การอาสาสมัครสอนให้" },
      { word: "cannot easily be learned", thaiMeaning: "เรียนรู้ได้ไม่ง่าย" },
      { word: "both young people and society", thaiMeaning: "ทั้งเยาวชนและสังคม" },
      { word: "in the UK found", thaiMeaning: "ในสหราชอาณาจักรพบว่า" }
    ]
  },
  {
    id: 't2-twe-10',
    number: 10,
    typeId: 'to-what-extent',
    title: "The Internet: Humanity's Greatest Invention?",
    questionText:
      'There have been many inventions in human history, such as the wheel. Some people think that the most important invention is the internet. To what extent do you agree or disagree with this opinion?',
    meta: 'Canada · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while human history includes many transformative inventions such as the wheel, the internet is the single most important invention ever created. Others argue that older inventions laid the essential foundation on which modern technology, including the internet, could later be built. I personally believe that the internet is indeed the most important invention, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ประวัติศาสตร์มนุษยชาติจะมีสิ่งประดิษฐ์ที่เปลี่ยนแปลงโลกมากมาย เช่น ล้อ แต่อินเทอร์เน็ตเป็นสิ่งประดิษฐ์ที่สำคัญที่สุดเพียงหนึ่งเดียวที่เคยถูกสร้างขึ้น ในขณะที่บางคนโต้แย้งว่าสิ่งประดิษฐ์ในอดีตวางรากฐานที่จำเป็นซึ่งเทคโนโลยีสมัยใหม่ รวมถึงอินเทอร์เน็ต สามารถสร้างขึ้นในภายหลังได้ ส่วนตัวผมเชื่อว่าอินเทอร์เน็ตเป็นสิ่งประดิษฐ์ที่สำคัญที่สุดจริงๆ และเหตุผลของผมจะได้รับการอธิบายอย่างละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that earlier inventions such as the wheel deserve greater recognition than the internet. To explain it simply, this is possibly because the wheel enabled transportation and trade thousands of years before modern technology existed; therefore, some believe it created the foundation for all later human progress. For example, ancient civilizations used wheeled carts to build cities, transport goods, and expand agriculture across vast distances. From this perspective, it is understandable why some would believe that foundational inventions like the wheel matter more than the internet.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะกล่าวอ้างว่าสิ่งประดิษฐ์ก่อนหน้านี้ เช่น ล้อ สมควรได้รับการยอมรับมากกว่าอินเทอร์เน็ต พูดง่ายๆ ก็คือ นี่อาจเป็นเพราะว่าล้อทำให้เกิดการขนส่งและการค้าหลายพันปีก่อนที่เทคโนโลยีสมัยใหม่จะมีอยู่ ดังนั้น บางคนจึงเชื่อว่าล้อได้สร้างรากฐานสำหรับความก้าวหน้าของมนุษย์ในเวลาต่อมาทั้งหมด ตัวอย่างเช่น อารยธรรมโบราณใช้เกวียนที่มีล้อในการสร้างเมือง ขนส่งสินค้า และขยายการเกษตรไปทั่วระยะทางอันไกล จากมุมมองนี้ ก็เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าสิ่งประดิษฐ์พื้นฐานอย่างล้อมีความสำคัญมากกว่าอินเทอร์เน็ต'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that the internet is the most significant invention in human history. To put it simply, this is due to the fact that it connects billions of people instantly, which has transformed communication, education, and business on an unprecedented global scale. For instance, the International Telecommunication Union reported in 2023 that over five billion people worldwide now use the internet regularly. In this respect, it is evident that no other invention has reshaped daily life as rapidly or as widely as the internet.",
        thai: 'อย่างไรก็ตาม ส่วนตัวผมขอสนับสนุนแนวคิดที่ว่าอินเทอร์เน็ตเป็นสิ่งประดิษฐ์ที่สำคัญที่สุดในประวัติศาสตร์มนุษยชาติ พูดง่ายๆ ก็คือ นี่เป็นเพราะว่ามันเชื่อมโยงผู้คนหลายพันล้านคนได้ในทันที ซึ่งได้เปลี่ยนแปลงการสื่อสาร การศึกษา และธุรกิจในระดับโลกอย่างที่ไม่เคยมีมาก่อน ตัวอย่างเช่น สหภาพโทรคมนาคมระหว่างประเทศรายงานในปี 2023 ว่าผู้คนมากกว่าห้าพันล้านคนทั่วโลกใช้อินเทอร์เน็ตเป็นประจำในปัจจุบัน ในแง่นี้ เห็นได้ชัดว่าไม่มีสิ่งประดิษฐ์อื่นใดที่ได้เปลี่ยนแปลงชีวิตประจำวันได้อย่างรวดเร็วหรือกว้างขวางเท่ากับอินเทอร์เน็ต'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that earlier inventions such as the wheel shaped human civilization, I am of the opinion that the internet remains the most important invention, given its unmatched global impact.",
        thai: 'โดยสรุป แม้ว่าปฏิเสธไม่ได้ว่าสิ่งประดิษฐ์ก่อนหน้านี้ เช่น ล้อ ได้หล่อหลอมอารยธรรมมนุษย์ ผมมีความเห็นว่าอินเทอร์เน็ตยังคงเป็นสิ่งประดิษฐ์ที่สำคัญที่สุด เนื่องจากมีผลกระทบระดับโลกที่ไม่มีใครเทียบได้'
      }
    ],
    vocab: [
      { word: "transportation and trade", thaiMeaning: "การคมนาคมขนส่งและการค้า" },
      { word: "human progress", thaiMeaning: "ความก้าวหน้าของมนุษยชาติ" },
      { word: "global scale", thaiMeaning: "ระดับโลก" },
      { word: "daily life", thaiMeaning: "ชีวิตประจำวัน" },
      { word: "International Telecommunication Union", thaiMeaning: "สหภาพโทรคมนาคมระหว่างประเทศ" },
      { word: "transformative inventions", thaiMeaning: "สิ่งประดิษฐ์ที่เปลี่ยนโฉม" },
      { word: "most important invention", thaiMeaning: "สิ่งประดิษฐ์ที่สำคัญที่สุด" },
      { word: "foundational inventions", thaiMeaning: "สิ่งประดิษฐ์ที่เป็นรากฐาน" },
      { word: "unmatched global impact", thaiMeaning: "ผลกระทบระดับโลกที่ไม่มีใครเทียบ" },
      { word: "ancient civilizations", thaiMeaning: "อารยธรรมโบราณ" },
      { word: "essential foundation", thaiMeaning: "รากฐานที่สำคัญ" },
      { word: "significant invention", thaiMeaning: "สิ่งประดิษฐ์ที่สำคัญ" },
      { word: "greater recognition", thaiMeaning: "การยอมรับที่มากขึ้น" },
      { word: "human civilization", thaiMeaning: "อารยธรรมของมนุษย์" },
      { word: "earlier inventions", thaiMeaning: "สิ่งประดิษฐ์ก่อนหน้า" },
      { word: "modern technology", thaiMeaning: "เทคโนโลยีสมัยใหม่" },
      { word: "expand agriculture", thaiMeaning: "ขยายการเกษตร" },
      { word: "billions of people", thaiMeaning: "ผู้คนนับพันล้าน" },
      { word: "wheeled carts", thaiMeaning: "เกวียนล้อ" },
      { word: "vast distances", thaiMeaning: "ระยะทางอันไกลโพ้น" },
      { word: "such as the wheel", thaiMeaning: "อย่างเช่นล้อ" },
      { word: "could later be built", thaiMeaning: "สามารถสร้างขึ้นในภายหลัง" },
      { word: "matter more than the internet", thaiMeaning: "สำคัญกว่าอินเทอร์เน็ต" },
      { word: "transformed communication, education, and business", thaiMeaning: "เปลี่ยนการสื่อสาร การศึกษา และธุรกิจ" },
      { word: "over five billion people worldwide", thaiMeaning: "ผู้คนกว่าห้าพันล้านทั่วโลก" },
      { word: "now use the internet regularly", thaiMeaning: "ใช้อินเทอร์เน็ตเป็นประจำในปัจจุบัน" },
      { word: "as rapidly or as widely", thaiMeaning: "อย่างรวดเร็วหรือกว้างขวางเท่านี้" },
      { word: "thousands of years before", thaiMeaning: "หลายพันปีก่อน" },
      { word: "transport goods", thaiMeaning: "ขนส่งสินค้า" },
      { word: "build cities", thaiMeaning: "สร้างเมือง" },
      { word: "including the internet", thaiMeaning: "รวมถึงอินเทอร์เน็ต" },
      { word: "reported in 2023", thaiMeaning: "รายงานในปี 2023" }
    ]
  },
  {
    id: 't2-twe-11',
    number: 11,
    typeId: 'to-what-extent',
    title: 'Financial Aid to Poor Countries',
    questionText:
      'Rich countries often give money to poorer countries, but this does not solve the problem of poverty. Therefore, developed countries should provide other types of assistance to poor countries, rather than financial assistance. To what extent do you agree or disagree?',
    meta: 'France · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while financial aid provides immediate relief, giving money to poorer countries does not solve the underlying problem of poverty. Others argue that direct financial assistance remains essential, since developing countries urgently need funds for basic needs. I personally believe that developed countries should provide other forms of assistance instead of money alone, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้ว่าความช่วยเหลือทางการเงินจะให้การบรรเทาทุกข์ในทันที แต่การให้เงินแก่ประเทศที่ยากจนกว่านั้นไม่ได้แก้ปัญหาความยากจนที่เป็นรากฐานที่แท้จริง คนอื่น ๆ โต้แย้งว่าความช่วยเหลือทางการเงินโดยตรงยังคงมีความสำคัญ เพราะว่าประเทศกำลังพัฒนาต้องการเงินทุนอย่างเร่งด่วนสำหรับความจำเป็นพื้นฐาน ส่วนตัวข้าพเจ้าเชื่อว่าประเทศพัฒนาแล้วควรให้ความช่วยเหลือในรูปแบบอื่นแทนที่จะเป็นเงินเพียงอย่างเดียว และเหตุผลของข้าพเจ้าจะได้รับการอธิบายโดยละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that financial aid remains the most important form of assistance for poorer countries. To explain it simply, this is possibly because money can be used immediately to buy food, medicine, and other urgent necessities; therefore, some believe cutting financial support would worsen suffering in the short term. For example, emergency cash transfers have helped many communities survive immediately after natural disasters such as floods and earthquakes. From this perspective, it is understandable why some would believe that financial aid remains indispensable for struggling nations.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าความช่วยเหลือทางการเงินยังคงเป็นรูปแบบความช่วยเหลือที่สำคัญที่สุดสำหรับประเทศที่ยากจนกว่า พูดให้เข้าใจง่าย ๆ นี่อาจเป็นเพราะว่าเงินสามารถนำไปใช้ซื้ออาหาร ยา และสิ่งจำเป็นเร่งด่วนอื่น ๆ ได้ทันที ดังนั้นบางคนจึงเชื่อว่าการตัดความช่วยเหลือทางการเงินจะทำให้ความทุกข์ยากเลวร้ายลงในระยะสั้น ตัวอย่างเช่น การโอนเงินสดฉุกเฉินได้ช่วยให้หลายชุมชนอยู่รอดได้ทันทีหลังจากภัยพิบัติทางธรรมชาติ เช่น น้ำท่วมและแผ่นดินไหว จากมุมมองนี้ เป็นที่เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าความช่วยเหลือทางการเงินยังคงขาดไม่ได้สำหรับประเทศที่กำลังประสบปัญหา'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that developed countries should offer alternative forms of assistance rather than money alone. To put it simply, this is due to the fact that direct cash aid often fails to build lasting infrastructure or institutions, which are necessary for genuine long-term development. For instance, a World Bank report published in 2021 found that countries receiving technical training and infrastructure support showed stronger economic growth than those receiving cash alone. In this respect, it is evident that practical assistance produces more sustainable results than financial aid by itself.",
        thai: 'อย่างไรก็ตาม ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าประเทศพัฒนาแล้วควรเสนอความช่วยเหลือในรูปแบบอื่นแทนที่จะเป็นเงินเพียงอย่างเดียว พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าความช่วยเหลือเป็นเงินสดโดยตรงมักไม่สามารถสร้างโครงสร้างพื้นฐานหรือสถาบันที่ยั่งยืนได้ ซึ่งสิ่งเหล่านี้จำเป็นต่อการพัฒนาระยะยาวที่แท้จริง ตัวอย่างเช่น รายงานของธนาคารโลกที่เผยแพร่ในปี 2021 พบว่าประเทศที่ได้รับการฝึกอบรมด้านเทคนิคและการสนับสนุนโครงสร้างพื้นฐานแสดงให้เห็นการเติบโตทางเศรษฐกิจที่แข็งแกร่งกว่าประเทศที่ได้รับเพียงเงินสด ในแง่นี้ เป็นที่ประจักษ์ชัดว่าความช่วยเหลือในเชิงปฏิบัติให้ผลลัพธ์ที่ยั่งยืนกว่าความช่วยเหลือทางการเงินเพียงอย่างเดียว'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that financial aid offers valuable short-term relief, I am of the opinion that developed nations should prioritize other forms of assistance, as these create lasting solutions to poverty.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าความช่วยเหลือทางการเงินให้การบรรเทาทุกข์ระยะสั้นที่มีคุณค่า ข้าพเจ้ามีความเห็นว่าประเทศพัฒนาแล้วควรให้ความสำคัญกับความช่วยเหลือในรูปแบบอื่น เนื่องจากสิ่งเหล่านี้สร้างทางแก้ปัญหาความยากจนที่ยั่งยืนกว่า'
      }
    ],
    vocab: [
      { word: "financial assistance", thaiMeaning: "ความช่วยเหลือทางการเงิน" },
      { word: "emergency cash transfers", thaiMeaning: "การโอนเงินช่วยเหลือฉุกเฉิน" },
      { word: "infrastructure support", thaiMeaning: "การสนับสนุนด้านโครงสร้างพื้นฐาน" },
      { word: "economic growth", thaiMeaning: "การเติบโตทางเศรษฐกิจ" },
      { word: "immediate relief", thaiMeaning: "การบรรเทาทุกข์ทันที" },
      { word: "underlying problem of poverty", thaiMeaning: "ปัญหาความยากจนที่แท้จริง" },
      { word: "basic needs", thaiMeaning: "ความต้องการพื้นฐาน" },
      { word: "developed countries", thaiMeaning: "ประเทศพัฒนาแล้ว" },
      { word: "poorer countries", thaiMeaning: "ประเทศที่ยากจนกว่า" },
      { word: "urgent necessities", thaiMeaning: "สิ่งจำเป็นเร่งด่วน" },
      { word: "natural disasters", thaiMeaning: "ภัยธรรมชาติ" },
      { word: "lasting infrastructure", thaiMeaning: "โครงสร้างพื้นฐานที่ยั่งยืน" },
      { word: "genuine long-term development", thaiMeaning: "การพัฒนาในระยะยาวอย่างแท้จริง" },
      { word: "technical training", thaiMeaning: "การฝึกอบรมด้านเทคนิค" },
      { word: "sustainable results", thaiMeaning: "ผลลัพธ์ที่ยั่งยืน" },
      { word: "short-term relief", thaiMeaning: "การบรรเทาทุกข์ระยะสั้น" },
      { word: "lasting solutions to poverty", thaiMeaning: "วิธีแก้ความยากจนที่ยั่งยืน" },
      { word: "developing countries", thaiMeaning: "ประเทศกำลังพัฒนา" },
      { word: "practical assistance", thaiMeaning: "ความช่วยเหลือเชิงปฏิบัติ" },
      { word: "struggling nations", thaiMeaning: "ประเทศที่กำลังเดือดร้อน" },
      { word: "financial aid", thaiMeaning: "เงินช่วยเหลือ" },
      { word: "urgently need funds", thaiMeaning: "ต้องการเงินทุนอย่างเร่งด่วน" },
      { word: "cutting financial support", thaiMeaning: "การตัดการสนับสนุนทางการเงิน" },
      { word: "worsen suffering", thaiMeaning: "ทำให้ความทุกข์ทรมานแย่ลง" },
      { word: "floods and earthquakes", thaiMeaning: "น้ำท่วมและแผ่นดินไหว" },
      { word: "alternative forms of assistance", thaiMeaning: "รูปแบบความช่วยเหลือทางเลือก" },
      { word: "direct cash aid", thaiMeaning: "ความช่วยเหลือเงินสดโดยตรง" },
      { word: "World Bank report", thaiMeaning: "รายงานของธนาคารโลก" },
      { word: "receiving cash alone", thaiMeaning: "การได้รับเงินสดเพียงอย่างเดียว" },
      { word: "developed nations", thaiMeaning: "ประเทศที่พัฒนาแล้ว" },
      { word: "money alone", thaiMeaning: "เงินเพียงอย่างเดียว" },
      { word: "other forms of assistance", thaiMeaning: "ความช่วยเหลือในรูปแบบอื่น" }
    ]
  },
  {
    id: 't2-twe-12',
    number: 12,
    typeId: 'to-what-extent',
    title: "Digital Devices and Young People's Literacy",
    questionText:
      "Some people believe that the increasing use of computers and mobile phones for communication is having a negative impact on the reading and writing skills of young people. Do you agree or disagree?",
    meta: 'Ghana · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while digital communication offers great convenience, the increasing use of computers and mobile phones is damaging young people's reading and writing skills. Others argue that digital devices actually strengthen literacy, since young people read and write constantly through messaging and social media. I personally believe that heavy reliance on digital devices is harming literacy skills, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้ว่าการสื่อสารดิจิทัลจะให้ความสะดวกสบายอย่างมาก แต่การใช้คอมพิวเตอร์และโทรศัพท์มือถือที่เพิ่มขึ้นกำลังทำลายทักษะการอ่านและการเขียนของคนหนุ่มสาว คนอื่น ๆ โต้แย้งว่าอุปกรณ์ดิจิทัลกลับเสริมสร้างทักษะการรู้หนังสือ เพราะว่าคนหนุ่มสาวอ่านและเขียนอยู่ตลอดเวลาผ่านการส่งข้อความและโซเชียลมีเดีย ส่วนตัวข้าพเจ้าเชื่อว่าการพึ่งพาอุปกรณ์ดิจิทัลอย่างหนักกำลังทำลายทักษะการรู้หนังสือ และเหตุผลของข้าพเจ้าจะได้รับการอธิบายโดยละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that digital communication improves reading and writing among young people. To explain it simply, this is possibly because texting and social media require constant reading and typing throughout the day; therefore, some believe this frequent practice naturally strengthens literacy skills. For example, many teenagers exchange dozens of text messages daily, engaging with written language far more often than previous generations did. From this perspective, it is understandable why some would believe that digital communication supports rather than damages literacy development.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าการสื่อสารดิจิทัลช่วยพัฒนาการอ่านและการเขียนในหมู่คนหนุ่มสาว พูดให้เข้าใจง่าย ๆ นี่อาจเป็นเพราะว่าการส่งข้อความและโซเชียลมีเดียต้องการการอ่านและการพิมพ์อย่างต่อเนื่องตลอดทั้งวัน ดังนั้นบางคนจึงเชื่อว่าการฝึกฝนบ่อยครั้งเช่นนี้ย่อมเสริมสร้างทักษะการรู้หนังสือโดยธรรมชาติ ตัวอย่างเช่น วัยรุ่นจำนวนมากส่งข้อความหลายสิบข้อความต่อวัน ทำให้พวกเขาปฏิสัมพันธ์กับภาษาเขียนบ่อยกว่าคนรุ่นก่อนมาก จากมุมมองนี้ เป็นที่เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการสื่อสารดิจิทัลสนับสนุนมากกว่าที่จะทำลายพัฒนาการด้านการรู้หนังสือ'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that heavy use of digital devices is weakening young people's core literacy skills. To put it simply, this is due to the fact that informal messaging relies on abbreviations and simplified grammar, which fails to develop proper writing structure and vocabulary. For instance, a 2021 study by the National Literacy Trust in the UK found that teenagers who spent excessive time messaging showed noticeably weaker formal writing abilities than peers who read printed books regularly. In this respect, it is evident that digital habits often replace rather than reinforce genuine literacy development.",
        thai: 'อย่างไรก็ตาม ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าการใช้อุปกรณ์ดิจิทัลอย่างหนักกำลังทำให้ทักษะการรู้หนังสือขั้นพื้นฐานของคนหนุ่มสาวอ่อนแอลง พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าการส่งข้อความแบบไม่เป็นทางการอาศัยคำย่อและไวยากรณ์ที่ทำให้ง่ายขึ้น ซึ่งไม่สามารถพัฒนาโครงสร้างการเขียนและคำศัพท์ที่ถูกต้องได้ ตัวอย่างเช่น การศึกษาในปี 2021 โดย National Literacy Trust ในสหราชอาณาจักรพบว่าวัยรุ่นที่ใช้เวลาส่งข้อความมากเกินไปแสดงความสามารถในการเขียนเชิงทางการที่อ่อนแอกว่าอย่างเห็นได้ชัด เมื่อเทียบกับเพื่อนที่อ่านหนังสือที่พิมพ์เป็นเล่มอย่างสม่ำเสมอ ในแง่นี้ เป็นที่ประจักษ์ชัดว่านิสัยดิจิทัลมักจะเข้ามาแทนที่มากกว่าที่จะเสริมสร้างพัฒนาการด้านการรู้หนังสือที่แท้จริง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that digital devices encourage frequent reading and writing, I am of the opinion that heavy reliance on them is weakening young people's literacy skills overall.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าอุปกรณ์ดิจิทัลส่งเสริมการอ่านและการเขียนบ่อยครั้ง ข้าพเจ้ามีความเห็นว่าการพึ่งพาอุปกรณ์เหล่านี้อย่างหนักกำลังทำให้ทักษะการรู้หนังสือของคนหนุ่มสาวอ่อนแอลงโดยรวม'
      }
    ],
    vocab: [
      { word: "digital communication", thaiMeaning: "การสื่อสารดิจิทัล" },
      { word: "written language", thaiMeaning: "ภาษาเขียน" },
      { word: "writing structure", thaiMeaning: "โครงสร้างการเขียน" },
      { word: "literacy development", thaiMeaning: "พัฒนาการด้านการอ่านออกเขียนได้" },
      { word: "reading and writing skills", thaiMeaning: "ทักษะการอ่านและการเขียน" },
      { word: "digital devices", thaiMeaning: "อุปกรณ์ดิจิทัล" },
      { word: "heavy reliance", thaiMeaning: "การพึ่งพามากเกินไป" },
      { word: "text messages", thaiMeaning: "ข้อความตัวอักษร" },
      { word: "previous generations", thaiMeaning: "คนรุ่นก่อน" },
      { word: "informal messaging", thaiMeaning: "การส่งข้อความแบบไม่เป็นทางการ" },
      { word: "simplified grammar", thaiMeaning: "ไวยากรณ์แบบง่าย" },
      { word: "formal writing abilities", thaiMeaning: "ความสามารถในการเขียนแบบเป็นทางการ" },
      { word: "printed books", thaiMeaning: "หนังสือสิ่งพิมพ์" },
      { word: "National Literacy Trust", thaiMeaning: "องค์กรส่งเสริมการรู้หนังสือแห่งชาติ" },
      { word: "frequent practice", thaiMeaning: "การฝึกฝนอย่างสม่ำเสมอ" },
      { word: "core literacy skills", thaiMeaning: "ทักษะการรู้หนังสือพื้นฐาน" },
      { word: "texting and social media", thaiMeaning: "การส่งข้อความและโซเชียลมีเดีย" },
      { word: "digital habits", thaiMeaning: "นิสัยการใช้ดิจิทัล" },
      { word: "abbreviations", thaiMeaning: "คำย่อ" },
      { word: "constant reading and typing", thaiMeaning: "การอ่านและการพิมพ์อย่างต่อเนื่อง" },
      { word: "great convenience", thaiMeaning: "ความสะดวกอย่างมาก" },
      { word: "computers and mobile phones", thaiMeaning: "คอมพิวเตอร์และโทรศัพท์มือถือ" },
      { word: "strengthen literacy", thaiMeaning: "เสริมทักษะการรู้หนังสือ" },
      { word: "messaging and social media", thaiMeaning: "การส่งข้อความและสื่อสังคมออนไลน์" },
      { word: "harming literacy skills", thaiMeaning: "ทำลายทักษะการรู้หนังสือ" },
      { word: "excessive time messaging", thaiMeaning: "การใช้เวลาส่งข้อความมากเกินไป" },
      { word: "encourage frequent reading and writing", thaiMeaning: "ส่งเสริมการอ่านและการเขียนบ่อยครั้ง" },
      { word: "young people's literacy skills", thaiMeaning: "ทักษะการรู้หนังสือของคนหนุ่มสาว" },
      { word: "supports rather than damages", thaiMeaning: "สนับสนุนมากกว่าทำลาย" },
      { word: "fails to develop", thaiMeaning: "ล้มเหลวในการพัฒนา" },
      { word: "noticeably weaker", thaiMeaning: "อ่อนแอกว่าอย่างเห็นได้ชัด" },
      { word: "replace rather than reinforce", thaiMeaning: "แทนที่มากกว่าเสริมสร้าง" }
    ]
  },
  {
    id: 't2-twe-13',
    number: 13,
    typeId: 'to-what-extent',
    title: 'Are Women Better Leaders Than Men?',
    questionText:
      'Some people believe women are better leaders than men. To what extent do you agree or disagree with this statement?',
    meta: 'Turkey · May 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while leadership ability varies between individuals, women make better leaders than men in most professional settings. Others argue that leadership skill depends entirely on personal qualities rather than gender, meaning neither group is inherently superior. I personally believe that leadership ability is not determined by gender, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้ว่าความสามารถในการเป็นผู้นำจะแตกต่างกันไปในแต่ละบุคคล แต่ผู้หญิงเป็นผู้นำที่ดีกว่าผู้ชายในสถานที่ทำงานส่วนใหญ่ คนอื่น ๆ โต้แย้งว่าทักษะความเป็นผู้นำขึ้นอยู่กับคุณสมบัติส่วนบุคคลทั้งหมด ไม่ใช่ขึ้นอยู่กับเพศ ซึ่งหมายความว่าไม่มีกลุ่มใดเหนือกว่าอีกกลุ่มโดยธรรมชาติ ส่วนตัวข้าพเจ้าเชื่อว่าความสามารถในการเป็นผู้นำไม่ได้ถูกกำหนดโดยเพศ และเหตุผลของข้าพเจ้าจะได้รับการอธิบายโดยละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that women generally make better leaders than men. To explain it simply, this is possibly because women are often perceived as more collaborative and empathetic communicators; therefore, some believe teams led by women experience stronger morale and cooperation. For example, several well-known female chief executives, including the former leader of PepsiCo, are frequently praised for their inclusive management style. From this perspective, it is understandable why some would believe that women possess natural advantages in leadership roles.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าโดยทั่วไปแล้วผู้หญิงเป็นผู้นำที่ดีกว่าผู้ชาย พูดให้เข้าใจง่าย ๆ นี่อาจเป็นเพราะว่าผู้หญิงมักถูกมองว่าเป็นผู้สื่อสารที่ร่วมมือและเข้าอกเข้าใจผู้อื่นมากกว่า ดังนั้นบางคนจึงเชื่อว่าทีมที่นำโดยผู้หญิงมีขวัญกำลังใจและความร่วมมือที่แข็งแกร่งกว่า ตัวอย่างเช่น ผู้บริหารระดับสูงหญิงที่มีชื่อเสียงหลายคน รวมถึงอดีตผู้นำของ PepsiCo มักได้รับการยกย่องในเรื่องรูปแบบการบริหารที่ครอบคลุมทุกฝ่าย จากมุมมองนี้ เป็นที่เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าผู้หญิงมีข้อได้เปรียบตามธรรมชาติในบทบาทผู้นำ'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that leadership quality depends on individual traits rather than gender. To put it simply, this is due to the fact that effective leadership relies on skills such as decisiveness and vision, which men and women develop equally through experience and training. For instance, a 2019 Harvard Business Review analysis of thousands of managers found no significant difference in overall leadership effectiveness between men and women. In this respect, it is evident that gender alone cannot reliably predict who will become a successful leader.",
        thai: 'อย่างไรก็ตาม ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าคุณภาพของความเป็นผู้นำขึ้นอยู่กับลักษณะเฉพาะของแต่ละบุคคลมากกว่าเพศ พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าความเป็นผู้นำที่มีประสิทธิภาพอาศัยทักษะ เช่น ความเด็ดขาดและวิสัยทัศน์ ซึ่งทั้งผู้ชายและผู้หญิงพัฒนาได้เท่าเทียมกันผ่านประสบการณ์และการฝึกอบรม ตัวอย่างเช่น การวิเคราะห์ของ Harvard Business Review ในปี 2019 ที่ศึกษาผู้จัดการหลายพันคนพบว่าไม่มีความแตกต่างอย่างมีนัยสำคัญในประสิทธิภาพความเป็นผู้นำโดยรวมระหว่างผู้ชายและผู้หญิง ในแง่นี้ เป็นที่ประจักษ์ชัดว่าเพศเพียงอย่างเดียวไม่สามารถทำนายได้อย่างน่าเชื่อถือว่าใครจะกลายเป็นผู้นำที่ประสบความสำเร็จ'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that certain leadership styles are sometimes associated with one gender, I am of the opinion that individual ability, rather than gender, ultimately determines leadership success.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่ารูปแบบความเป็นผู้นำบางอย่างบางครั้งถูกเชื่อมโยงกับเพศใดเพศหนึ่ง ข้าพเจ้ามีความเห็นว่าความสามารถส่วนบุคคล ไม่ใช่เพศ เป็นตัวกำหนดความสำเร็จของความเป็นผู้นำในท้ายที่สุด'
      }
    ],
    vocab: [
      { word: "leadership ability", thaiMeaning: "ความสามารถในการเป็นผู้นำ" },
      { word: "management style", thaiMeaning: "รูปแบบการบริหารจัดการ" },
      { word: "individual traits", thaiMeaning: "คุณลักษณะเฉพาะบุคคล" },
      { word: "leadership effectiveness", thaiMeaning: "ประสิทธิผลของการเป็นผู้นำ" },
      { word: "professional settings", thaiMeaning: "บริบทการทำงาน" },
      { word: "personal qualities", thaiMeaning: "คุณสมบัติส่วนบุคคล" },
      { word: "collaborative and empathetic communicators", thaiMeaning: "ผู้สื่อสารที่ร่วมมือและเข้าใจผู้อื่น" },
      { word: "stronger morale and cooperation", thaiMeaning: "ขวัญกำลังใจและความร่วมมือที่แข็งแกร่งขึ้น" },
      { word: "female chief executives", thaiMeaning: "ผู้บริหารหญิงระดับสูง" },
      { word: "leadership roles", thaiMeaning: "บทบาทผู้นำ" },
      { word: "effective leadership", thaiMeaning: "ภาวะผู้นำที่มีประสิทธิภาพ" },
      { word: "decisiveness and vision", thaiMeaning: "ความเด็ดขาดและวิสัยทัศน์" },
      { word: "experience and training", thaiMeaning: "ประสบการณ์และการฝึกฝน" },
      { word: "Harvard Business Review", thaiMeaning: "วารสาร Harvard Business Review" },
      { word: "successful leader", thaiMeaning: "ผู้นำที่ประสบความสำเร็จ" },
      { word: "leadership styles", thaiMeaning: "รูปแบบภาวะผู้นำ" },
      { word: "leadership success", thaiMeaning: "ความสำเร็จในการเป็นผู้นำ" },
      { word: "leadership quality", thaiMeaning: "คุณภาพของภาวะผู้นำ" },
      { word: "leadership skill", thaiMeaning: "ทักษะภาวะผู้นำ" },
      { word: "inherently superior", thaiMeaning: "เหนือกว่าโดยธรรมชาติ" },
      { word: "determined by gender", thaiMeaning: "ถูกกำหนดโดยเพศ" },
      { word: "better leaders than men", thaiMeaning: "เป็นผู้นำได้ดีกว่าผู้ชาย" },
      { word: "natural advantages", thaiMeaning: "ข้อได้เปรียบโดยธรรมชาติ" },
      { word: "no significant difference", thaiMeaning: "ไม่มีความแตกต่างที่มีนัยสำคัญ" },
      { word: "reliably predict", thaiMeaning: "คาดการณ์ได้อย่างน่าเชื่อถือ" },
      { word: "associated with one gender", thaiMeaning: "เกี่ยวข้องกับเพศใดเพศหนึ่ง" },
      { word: "individual ability", thaiMeaning: "ความสามารถเฉพาะบุคคล" },
      { word: "varies between individuals", thaiMeaning: "แตกต่างไปตามแต่ละบุคคล" },
      { word: "teams led by women", thaiMeaning: "ทีมที่นำโดยผู้หญิง" },
      { word: "frequently praised", thaiMeaning: "ได้รับการยกย่องบ่อยครั้ง" },
      { word: "thousands of managers", thaiMeaning: "ผู้จัดการหลายพันคน" },
      { word: "rather than gender", thaiMeaning: "มิใช่เพศ" }
    ]
  },
  {
    id: 't2-twe-14',
    number: 14,
    typeId: 'to-what-extent',
    title: 'Should Sugary Products Cost More?',
    questionText:
      'Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Sugary products should be made more expensive to encourage people to consume less sugar. Do you agree or disagree?',
    meta: 'South Africa · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while sugary food and drinks remain popular consumer choices, making these products more expensive would encourage people to consume less sugar. Others argue that raising prices unfairly punishes consumers instead of addressing the root causes of unhealthy eating habits. I personally believe that increasing the price of sugary products is an effective health measure, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้ว่าอาหารและเครื่องดื่มที่มีน้ำตาลสูงจะยังคงเป็นทางเลือกยอดนิยมของผู้บริโภค แต่การทำให้ผลิตภัณฑ์เหล่านี้มีราคาแพงขึ้นจะกระตุ้นให้ผู้คนบริโภคน้ำตาลน้อยลง คนอื่น ๆ โต้แย้งว่าการขึ้นราคาเป็นการลงโทษผู้บริโภคอย่างไม่เป็นธรรม แทนที่จะแก้ไขสาเหตุที่แท้จริงของพฤติกรรมการกินที่ไม่ดีต่อสุขภาพ ส่วนตัวข้าพเจ้าเชื่อว่าการเพิ่มราคาผลิตภัณฑ์ที่มีน้ำตาลสูงเป็นมาตรการด้านสุขภาพที่มีประสิทธิภาพ และเหตุผลของข้าพเจ้าจะได้รับการอธิบายโดยละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that raising prices on sugary products is an unfair and ineffective solution. To explain it simply, this is possibly because higher prices affect low-income families far more severely than wealthier ones. For example, families on tight budgets might struggle financially if the price of everyday snacks and soft drinks suddenly increases. From this perspective, it is understandable why some would believe that price increases unfairly burden certain groups in society.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าการขึ้นราคาผลิตภัณฑ์ที่มีน้ำตาลสูงเป็นแนวทางแก้ไขที่ไม่เป็นธรรมและไม่มีประสิทธิภาพ พูดให้เข้าใจง่าย ๆ นี่อาจเป็นเพราะว่าราคาที่สูงขึ้นส่งผลกระทบต่อครอบครัวรายได้น้อยรุนแรงกว่าครอบครัวที่ร่ำรวยกว่ามาก ตัวอย่างเช่น ครอบครัวที่มีงบประมาณจำกัดอาจประสบปัญหาทางการเงินหากราคาของขนมและเครื่องดื่มอัดลมประจำวันเพิ่มขึ้นอย่างกะทันหัน จากมุมมองนี้ เป็นที่เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการขึ้นราคาเป็นภาระที่ไม่เป็นธรรมต่อกลุ่มคนบางกลุ่มในสังคม'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that raising the price of sugary products effectively reduces consumption. To put it simply, this is due to the fact that higher prices directly discourage purchasing, which research consistently shows changes consumer behavior. For instance, after Mexico introduced a sugar tax in 2014, a study published in the British Medical Journal found that purchases of sugary drinks fell by more than seven percent within two years. In this respect, it is evident that pricing policies can meaningfully reduce excessive sugar consumption nationwide.",
        thai: 'อย่างไรก็ตาม ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าการขึ้นราคาผลิตภัณฑ์ที่มีน้ำตาลสูงช่วยลดการบริโภคได้อย่างมีประสิทธิภาพ พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าราคาที่สูงขึ้นทำให้ผู้คนไม่อยากซื้อโดยตรง ซึ่งงานวิจัยแสดงให้เห็นอย่างสม่ำเสมอว่าสิ่งนี้เปลี่ยนแปลงพฤติกรรมผู้บริโภค ตัวอย่างเช่น หลังจากที่เม็กซิโกนำภาษีน้ำตาลมาใช้ในปี 2014 การศึกษาที่ตีพิมพ์ใน British Medical Journal พบว่าการซื้อเครื่องดื่มที่มีน้ำตาลสูงลดลงมากกว่าร้อยละเจ็ดภายในสองปี ในแง่นี้ เป็นที่ประจักษ์ชัดว่านโยบายด้านราคาสามารถลดการบริโภคน้ำตาลที่มากเกินไปได้อย่างมีนัยสำคัญทั่วประเทศ'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that higher prices may place some financial pressure on consumers, I am of the opinion that making sugary products more expensive remains an effective way to improve public health.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าราคาที่สูงขึ้นอาจสร้างแรงกดดันทางการเงินบางส่วนต่อผู้บริโภค ข้าพเจ้ามีความเห็นว่าการทำให้ผลิตภัณฑ์ที่มีน้ำตาลสูงมีราคาแพงขึ้นยังคงเป็นวิธีที่มีประสิทธิภาพในการพัฒนาสุขภาพของประชาชน'
      }
    ],
    vocab: [
      { word: "unhealthy eating habits", thaiMeaning: "พฤติกรรมการกินที่ไม่ดีต่อสุขภาพ" },
      { word: "low-income families", thaiMeaning: "ครอบครัวรายได้น้อย" },
      { word: "consumer behavior", thaiMeaning: "พฤติกรรมผู้บริโภค" },
      { word: "pricing policies", thaiMeaning: "นโยบายด้านราคา" },
      { word: "sugary products", thaiMeaning: "ผลิตภัณฑ์ที่มีน้ำตาล" },
      { word: "consumer choices", thaiMeaning: "ตัวเลือกของผู้บริโภค" },
      { word: "root causes", thaiMeaning: "สาเหตุรากเหง้า" },
      { word: "effective health measure", thaiMeaning: "มาตรการสุขภาพที่มีประสิทธิผล" },
      { word: "higher prices", thaiMeaning: "ราคาที่สูงขึ้น" },
      { word: "tight budgets", thaiMeaning: "งบประมาณที่ตึงตัว" },
      { word: "soft drinks", thaiMeaning: "เครื่องดื่มน้ำอัดลม" },
      { word: "price increases", thaiMeaning: "การขึ้นราคา" },
      { word: "sugar tax", thaiMeaning: "ภาษีน้ำตาล" },
      { word: "British Medical Journal", thaiMeaning: "วารสารการแพทย์อังกฤษ" },
      { word: "sugary drinks", thaiMeaning: "เครื่องดื่มที่มีน้ำตาล" },
      { word: "excessive sugar consumption", thaiMeaning: "การบริโภคน้ำตาลมากเกินไป" },
      { word: "financial pressure", thaiMeaning: "แรงกดดันทางการเงิน" },
      { word: "public health", thaiMeaning: "สาธารณสุข" },
      { word: "everyday snacks", thaiMeaning: "ของว่างในชีวิตประจำวัน" },
      { word: "sugary food and drinks", thaiMeaning: "อาหารและเครื่องดื่มที่มีน้ำตาล" },
      { word: "consume less sugar", thaiMeaning: "บริโภคน้ำตาลน้อยลง" },
      { word: "unfairly punishes consumers", thaiMeaning: "ลงโทษผู้บริโภคอย่างไม่เป็นธรรม" },
      { word: "unfair and ineffective solution", thaiMeaning: "ทางแก้ที่ไม่เป็นธรรมและไร้ประสิทธิผล" },
      { word: "far more severely", thaiMeaning: "รุนแรงกว่ามาก" },
      { word: "struggle financially", thaiMeaning: "เดือดร้อนทางการเงิน" },
      { word: "unfairly burden", thaiMeaning: "เป็นภาระอย่างไม่เป็นธรรม" },
      { word: "certain groups in society", thaiMeaning: "กลุ่มบางกลุ่มในสังคม" },
      { word: "effectively reduces consumption", thaiMeaning: "ลดการบริโภคได้อย่างมีประสิทธิผล" },
      { word: "directly discourage purchasing", thaiMeaning: "ยับยั้งการซื้อโดยตรง" },
      { word: "research consistently shows", thaiMeaning: "งานวิจัยแสดงอย่างสม่ำเสมอ" },
      { word: "more than seven percent", thaiMeaning: "มากกว่าเจ็ดเปอร์เซ็นต์" },
      { word: "meaningfully reduce", thaiMeaning: "ลดลงอย่างมีความหมาย" }
    ]
  },
  {
    id: 't2-twe-15',
    number: 15,
    typeId: 'to-what-extent',
    title: 'Space Research Funding',
    questionText:
      'Space research costs billions of dollars. Some people believe that the money should be invested on more practical projects here on Earth. To what extent do you agree or disagree with this opinion?',
    meta: 'Hong Kong · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while space exploration captures public imagination, the billions spent on space research should instead be invested in more practical projects on Earth. Others argue that space research itself produces practical benefits that justify its enormous cost. I personally believe that space research funding is justified despite its high cost, and my reasons will be elaborated on in the following paragraphs.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้ว่าการสำรวจอวกาศจะดึงดูดจินตนาการของสาธารณชน แต่เงินหลายพันล้านที่ใช้ไปกับการวิจัยอวกาศควรถูกนำไปลงทุนในโครงการที่เป็นประโยชน์ในทางปฏิบัติมากกว่าบนโลกนี้แทน คนอื่น ๆ โต้แย้งว่าการวิจัยอวกาศเองก็สร้างประโยชน์ในทางปฏิบัติที่คุ้มค่ากับต้นทุนมหาศาลของมัน ส่วนตัวข้าพเจ้าเชื่อว่าเงินทุนสำหรับการวิจัยอวกาศมีความชอบธรรมแม้จะมีต้นทุนสูง และเหตุผลของข้าพเจ้าจะได้รับการอธิบายโดยละเอียดในย่อหน้าต่อไปนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that space research funding should be redirected toward more urgent problems on Earth. To explain it simply, this is possibly because issues such as poverty and disease affect billions of people directly; therefore, some believe this money could save more lives if spent elsewhere. For example, critics often point out that the cost of a single space mission could fund hospitals or schools in developing countries for years. From this perspective, it is understandable why some would believe that space spending should be reduced in favor of practical earthly needs.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าเงินทุนสำหรับการวิจัยอวกาศควรถูกนำไปใช้กับปัญหาที่เร่งด่วนกว่าบนโลกนี้ พูดให้เข้าใจง่าย ๆ นี่อาจเป็นเพราะว่าปัญหาต่าง ๆ เช่น ความยากจนและโรคภัยส่งผลกระทบโดยตรงต่อผู้คนหลายพันล้านคน ดังนั้นบางคนจึงเชื่อว่าเงินจำนวนนี้สามารถช่วยชีวิตคนได้มากกว่าหากนำไปใช้ที่อื่น ตัวอย่างเช่น นักวิจารณ์มักชี้ให้เห็นว่าค่าใช้จ่ายของภารกิจอวกาศเพียงครั้งเดียวสามารถให้ทุนแก่โรงพยาบาลหรือโรงเรียนในประเทศกำลังพัฒนาได้นานหลายปี จากมุมมองนี้ เป็นที่เข้าใจได้ว่าเหตุใดบางคนจึงเชื่อว่าการใช้จ่ายด้านอวกาศควรลดลงเพื่อสนับสนุนความต้องการที่เป็นประโยชน์บนโลกนี้'
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that space research funding remains a worthwhile investment. To put it simply, this is due to the fact that many everyday technologies, including satellite navigation and weather forecasting, originally developed from space research, which has benefited society enormously. For instance, NASA estimates that its research has contributed to the development of over two thousand commercial products, including improvements in medical imaging technology. In this respect, it is evident that space research delivers practical benefits that extend far beyond exploration itself.",
        thai: 'อย่างไรก็ตาม ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าเงินทุนสำหรับการวิจัยอวกาศยังคงเป็นการลงทุนที่คุ้มค่า พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าเทคโนโลยีในชีวิตประจำวันหลายอย่าง รวมถึงระบบนำทางผ่านดาวเทียมและการพยากรณ์อากาศ เดิมทีพัฒนามาจากการวิจัยอวกาศ ซึ่งได้เป็นประโยชน์อย่างมหาศาลต่อสังคม ตัวอย่างเช่น NASA ประมาณการว่างานวิจัยขององค์กรมีส่วนช่วยในการพัฒนาผลิตภัณฑ์เชิงพาณิชย์มากกว่าสองพันรายการ รวมถึงการพัฒนาเทคโนโลยีการถ่ายภาพทางการแพทย์ ในแง่นี้ เป็นที่ประจักษ์ชัดว่าการวิจัยอวกาศให้ประโยชน์ในทางปฏิบัติที่ขยายออกไปไกลกว่าการสำรวจเพียงอย่างเดียว'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that pressing problems on Earth deserve significant funding, I am of the opinion that continued investment in space research is justified by its wide-ranging practical benefits.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าปัญหาเร่งด่วนบนโลกนี้สมควรได้รับเงินทุนอย่างมีนัยสำคัญ ข้าพเจ้ามีความเห็นว่าการลงทุนอย่างต่อเนื่องในงานวิจัยอวกาศมีความชอบธรรมด้วยประโยชน์ในทางปฏิบัติที่กว้างขวางของมัน'
      }
    ],
    vocab: [
      { word: "space exploration", thaiMeaning: "การสำรวจอวกาศ" },
      { word: "satellite navigation", thaiMeaning: "ระบบนำทางด้วยดาวเทียม" },
      { word: "medical imaging technology", thaiMeaning: "เทคโนโลยีการถ่ายภาพทางการแพทย์" },
      { word: "practical benefits", thaiMeaning: "ประโยชน์เชิงปฏิบัติ" },
      { word: "space research funding", thaiMeaning: "เงินทุนวิจัยอวกาศ" },
      { word: "public imagination", thaiMeaning: "จินตนาการของสาธารณชน" },
      { word: "practical projects", thaiMeaning: "โครงการเชิงปฏิบัติ" },
      { word: "enormous cost", thaiMeaning: "ต้นทุนมหาศาล" },
      { word: "urgent problems", thaiMeaning: "ปัญหาเร่งด่วน" },
      { word: "developing countries", thaiMeaning: "ประเทศกำลังพัฒนา" },
      { word: "space mission", thaiMeaning: "ภารกิจอวกาศ" },
      { word: "weather forecasting", thaiMeaning: "การพยากรณ์อากาศ" },
      { word: "everyday technologies", thaiMeaning: "เทคโนโลยีในชีวิตประจำวัน" },
      { word: "commercial products", thaiMeaning: "ผลิตภัณฑ์เชิงพาณิชย์" },
      { word: "pressing problems", thaiMeaning: "ปัญหาเร่งด่วนที่กดดัน" },
      { word: "significant funding", thaiMeaning: "เงินทุนจำนวนมาก" },
      { word: "space spending", thaiMeaning: "รายจ่ายด้านอวกาศ" },
      { word: "earthly needs", thaiMeaning: "ความต้องการบนโลก" },
      { word: "worthwhile investment", thaiMeaning: "การลงทุนที่คุ้มค่า" },
      { word: "benefited society enormously", thaiMeaning: "เป็นประโยชน์ต่อสังคมอย่างมาก" },
      { word: "billions spent on space research", thaiMeaning: "เงินหลายพันล้านที่ใช้ไปกับการวิจัยอวกาศ" },
      { word: "high cost", thaiMeaning: "ต้นทุนสูง" },
      { word: "poverty and disease", thaiMeaning: "ความยากจนและโรคภัย" },
      { word: "save more lives", thaiMeaning: "ช่วยชีวิตได้มากขึ้น" },
      { word: "fund hospitals or schools", thaiMeaning: "ให้ทุนโรงพยาบาลหรือโรงเรียน" },
      { word: "NASA estimates", thaiMeaning: "NASA ประมาณการว่า" },
      { word: "originally developed from space research", thaiMeaning: "พัฒนาขึ้นเดิมจากการวิจัยอวกาศ" },
      { word: "extend far beyond exploration", thaiMeaning: "ขยายไกลเกินกว่าการสำรวจ" },
      { word: "continued investment in space research", thaiMeaning: "การลงทุนต่อเนื่องในการวิจัยอวกาศ" },
      { word: "redirected toward", thaiMeaning: "ถูกเบนไปยัง" },
      { word: "spent elsewhere", thaiMeaning: "ใช้ไปที่อื่น" },
      { word: "space research itself", thaiMeaning: "การวิจัยอวกาศเอง" }
    ]
  },

  // ── Discuss Both Views ──────────────────────────────────────────────
  {
    id: 't2-dbv-1',
    number: 1,
    typeId: 'discuss-both-views',
    title: 'Subways vs. Wider Roads',
    questionText:
      'Some people believe that governments should invest more in public transport such as subways and trains to reduce traffic congestion. Others think that building more and wider roads is a better solution. Discuss both views and give your own opinion.',
    meta: 'Thailand · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that governments should invest in subway and train networks to ease traffic congestion, others claim that building wider roads is a more effective solution. Both points of view will be elaborated on before elaborating on the reasons why I believe that investing in public transport is the better approach.",
        thai: 'แม้ว่าบางคนจะโต้แย้งว่ารัฐบาลควรลงทุนในระบบรถไฟใต้ดินและเครือข่ายรถไฟเพื่อบรรเทาปัญหาการจราจรติดขัด แต่คนอื่น ๆ อ้างว่าการสร้างถนนที่กว้างขึ้นเป็นทางแก้ที่มีประสิทธิภาพกว่า มุมมองทั้งสองด้านจะได้รับการอธิบายโดยละเอียด ก่อนที่จะอธิบายเหตุผลว่าเหตุใดข้าพเจ้าจึงเชื่อว่าการลงทุนในระบบขนส่งสาธารณะเป็นแนวทางที่ดีกว่า'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that expanding subway and train networks is the most effective way to reduce congestion. To explain this simply, this is because a well-developed rail system can transport many passengers away from private vehicles, cutting the number of cars on the road. For example, Singapore's Mass Rapid Transit network carries more than three million passengers daily, easing congestion across its road network.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าการขยายเครือข่ายรถไฟใต้ดินและรถไฟเป็นวิธีที่มีประสิทธิภาพที่สุดในการลดปัญหาการจราจรติดขัด พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะว่าระบบรางที่พัฒนาอย่างดีสามารถขนส่งผู้โดยสารจำนวนมากให้เลิกใช้รถยนต์ส่วนตัว ซึ่งช่วยลดจำนวนรถบนท้องถนน ตัวอย่างเช่น เครือข่ายรถไฟฟ้าขนส่งมวลชนของสิงคโปร์ขนส่งผู้โดยสารมากกว่าสามล้านคนต่อวัน ช่วยบรรเทาปัญหาการจราจรติดขัดทั่วเครือข่ายถนนของประเทศ'
      },
      {
        role: 'body2',
        text: "However, some might argue that building more and wider roads is a more practical solution. To put it simply, this is due to the fact that road expansion allows a greater volume of vehicles to travel at once, reducing bottlenecks during peak hours. For instance, a 2018 study by the Texas Transportation Institute found that widening key highways in Houston cut average commute times by nearly 10%.",
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าการสร้างถนนให้มากขึ้นและกว้างขึ้นเป็นทางแก้ที่ใช้ได้จริงมากกว่า พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าการขยายถนนช่วยให้ยานพาหนะจำนวนมากขึ้นสามารถเดินทางพร้อมกันได้ ซึ่งช่วยลดปัญหาคอขวดในช่วงเวลาเร่งด่วน ตัวอย่างเช่น การศึกษาในปี 2018 โดย Texas Transportation Institute พบว่าการขยายทางหลวงสายหลักในเมืองฮูสตันช่วยลดเวลาเดินทางเฉลี่ยลงเกือบร้อยละ 10'
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that investing in subway and train lines brings more sustainable, long-term benefits. My reasoning is that, unlike roads, rail networks encourage a lasting shift away from private car use, preventing congestion from returning as cities grow. To illustrate, London's Underground has allowed the city to keep up with steady population growth for over a century without expanding its road capacity.",
        thai: 'ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าการลงทุนในสายรถไฟใต้ดินและรถไฟนำมาซึ่งประโยชน์ระยะยาวที่ยั่งยืนกว่า เหตุผลของข้าพเจ้าคือ แตกต่างจากถนน เครือข่ายรถไฟกระตุ้นให้เกิดการเปลี่ยนแปลงถาวรจากการใช้รถยนต์ส่วนตัว ซึ่งป้องกันไม่ให้ปัญหาการจราจรติดขัดกลับมาอีกเมื่อเมืองขยายตัว ตัวอย่างเช่น รถไฟใต้ดินลอนดอนช่วยให้เมืองสามารถรองรับการเติบโตของประชากรอย่างต่อเนื่องมานานกว่าศตวรรษโดยไม่ต้องขยายขีดความสามารถของถนน'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that expanding road networks can offer a quicker, short-term reduction in congestion, I am of the opinion that investing in subway and train lines is the wiser long-term solution.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการขยายเครือข่ายถนนสามารถลดปัญหาการจราจรติดขัดได้เร็วกว่าในระยะสั้น ข้าพเจ้ามีความเห็นว่าการลงทุนในสายรถไฟใต้ดินและรถไฟเป็นทางแก้ที่ชาญฉลาดกว่าในระยะยาว'
      }
    ],
    vocab: [
      { word: "traffic congestion", thaiMeaning: "ปัญหาการจราจรติดขัด" },
      { word: "commute times", thaiMeaning: "เวลาเดินทางไป-กลับ" },
      { word: "population growth", thaiMeaning: "การเติบโตของประชากร" },
      { word: "road capacity", thaiMeaning: "ความจุของถนน" },
      { word: "subway and train networks", thaiMeaning: "เครือข่ายรถไฟใต้ดินและรถไฟ" },
      { word: "public transport", thaiMeaning: "ขนส่งสาธารณะ" },
      { word: "rail system", thaiMeaning: "ระบบราง" },
      { word: "private vehicles", thaiMeaning: "ยานพาหนะส่วนบุคคล" },
      { word: "Mass Rapid Transit", thaiMeaning: "ระบบขนส่งมวลชนรวดเร็ว" },
      { word: "road network", thaiMeaning: "เครือข่ายถนน" },
      { word: "wider roads", thaiMeaning: "ถนนที่กว้างขึ้น" },
      { word: "road expansion", thaiMeaning: "การขยายถนน" },
      { word: "peak hours", thaiMeaning: "ชั่วโมงเร่งด่วน" },
      { word: "Texas Transportation Institute", thaiMeaning: "สถาบันการขนส่งเท็กซัส" },
      { word: "long-term benefits", thaiMeaning: "ประโยชน์ระยะยาว" },
      { word: "private car use", thaiMeaning: "การใช้งานรถยนต์ส่วนบุคคล" },
      { word: "subway and train lines", thaiMeaning: "สายรถไฟใต้ดินและรถไฟ" },
      { word: "short-term reduction", thaiMeaning: "การลดลงในระยะสั้น" },
      { word: "lasting shift", thaiMeaning: "การเปลี่ยนแปลงที่ยั่งยืน" },
      { word: "bottlenecks", thaiMeaning: "จุดคอขวดการจราจร" },
      { word: "more effective solution", thaiMeaning: "ทางแก้ที่มีประสิทธิผลมากกว่า" },
      { word: "reduce congestion", thaiMeaning: "ลดปัญหาการจราจรติดขัด" },
      { word: "transport many passengers", thaiMeaning: "ขนส่งผู้โดยสารจำนวนมาก" },
      { word: "cutting the number of cars", thaiMeaning: "ลดจำนวนรถยนต์" },
      { word: "three million passengers daily", thaiMeaning: "ผู้โดยสารสามล้านคนต่อวัน" },
      { word: "greater volume of vehicles", thaiMeaning: "ปริมาณยานพาหนะที่มากขึ้น" },
      { word: "widening key highways", thaiMeaning: "การขยายทางหลวงสายสำคัญ" },
      { word: "congestion from returning", thaiMeaning: "การกลับมาของปัญหาการจราจรติดขัด" },
      { word: "London's Underground", thaiMeaning: "รถไฟใต้ดินลอนดอน" },
      { word: "cars on the road", thaiMeaning: "รถยนต์บนท้องถนน" },
      { word: "wiser long-term solution", thaiMeaning: "ทางแก้ระยะยาวที่ฉลาดกว่า" },
      { word: "better approach", thaiMeaning: "แนวทางที่ดีกว่า" }
    ]
  },
  {
    id: 't2-dbv-2',
    number: 2,
    typeId: 'discuss-both-views',
    title: 'Who Should Reduce Packaging?',
    questionText:
      'Some people think that supermarkets and manufacturers are responsible for reducing the amount of packaging on the products they sell. Others believe that it is the responsibility of consumers to avoid buying over-packaged products. Discuss both views and give your own opinion.',
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that supermarkets and manufacturers have a duty to reduce the packaging of the products they sell, others claim that consumers themselves must take responsibility by avoiding heavily packaged products. Both points of view will be elaborated on before elaborating on the reasons why I believe that manufacturers bear the greater responsibility.",
        thai: 'แม้ว่าบางคนจะโต้แย้งว่าซูเปอร์มาร์เก็ตและผู้ผลิตมีหน้าที่ลดบรรจุภัณฑ์ของผลิตภัณฑ์ที่พวกเขาขาย แต่คนอื่น ๆ อ้างว่าผู้บริโภคเองต้องรับผิดชอบด้วยการหลีกเลี่ยงผลิตภัณฑ์ที่มีบรรจุภัณฑ์หนาแน่น มุมมองทั้งสองด้านจะได้รับการอธิบายโดยละเอียด ก่อนที่จะอธิบายเหตุผลว่าเหตุใดข้าพเจ้าจึงเชื่อว่าผู้ผลิตต้องรับผิดชอบมากกว่า'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that manufacturers should take primary responsibility for reducing packaging. To explain this simply, this is because companies control product design and could switch to more sustainable materials at the source. For example, several major supermarket chains in the UK have removed plastic packaging from fresh produce, cutting plastic waste by thousands of tonnes annually.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าผู้ผลิตควรรับผิดชอบหลักในการลดบรรจุภัณฑ์ พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะว่าบริษัทเป็นผู้ควบคุมการออกแบบผลิตภัณฑ์และสามารถเปลี่ยนไปใช้วัสดุที่ยั่งยืนกว่าได้ตั้งแต่ต้นทาง ตัวอย่างเช่น เครือซูเปอร์มาร์เก็ตรายใหญ่หลายแห่งในสหราชอาณาจักรได้ถอดบรรจุภัณฑ์พลาสติกออกจากผลผลิตสด ซึ่งช่วยลดขยะพลาสติกลงหลายพันตันต่อปี'
      },
      {
        role: 'body2',
        text: "However, some might argue that consumers hold greater responsibility for this issue. To put it simply, this is due to the fact that consumer demand ultimately drives what products companies choose to package and sell. For instance, a growing number of shoppers now choose loose fruit and vegetables over pre-packaged alternatives, encouraging retailers to offer more unpackaged options.",
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าผู้บริโภคมีความรับผิดชอบมากกว่าในเรื่องนี้ พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าความต้องการของผู้บริโภคเป็นตัวกำหนดว่าบริษัทจะเลือกบรรจุและขายผลิตภัณฑ์แบบใดในท้ายที่สุด ตัวอย่างเช่น ผู้ซื้อจำนวนมากขึ้นเรื่อย ๆ เลือกซื้อผักและผลไม้แบบไม่มีบรรจุภัณฑ์แทนทางเลือกที่บรรจุมาแล้ว ซึ่งกระตุ้นให้ผู้ค้าปลีกเสนอทางเลือกที่ไม่มีบรรจุภัณฑ์มากขึ้น'
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that manufacturers should bear the greater share of responsibility. My reasoning is that ordinary consumers often have limited alternatives, since most products are still sold in fixed packaging regardless of individual preference. To illustrate, shoppers in many countries cannot buy household staples such as rice or shampoo without some form of plastic packaging, no matter how environmentally conscious they are.",
        thai: 'ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าผู้ผลิตควรรับผิดชอบส่วนใหญ่ในเรื่องนี้ เหตุผลของข้าพเจ้าคือ ผู้บริโภคทั่วไปมักมีทางเลือกที่จำกัด เพราะว่าผลิตภัณฑ์ส่วนใหญ่ยังคงถูกขายในบรรจุภัณฑ์ที่ตายตัวโดยไม่คำนึงถึงความต้องการส่วนบุคคล ตัวอย่างเช่น ผู้ซื้อในหลายประเทศไม่สามารถซื้อสินค้าจำเป็นในครัวเรือน เช่น ข้าวหรือแชมพู โดยไม่มีบรรจุภัณฑ์พลาสติกในรูปแบบใดรูปแบบหนึ่งได้ ไม่ว่าพวกเขาจะใส่ใจสิ่งแวดล้อมเพียงใดก็ตาม'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that consumer choices can influence packaging habits to some extent, I am of the opinion that manufacturers hold the greater responsibility, as they ultimately control how products are packaged.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าทางเลือกของผู้บริโภคสามารถส่งผลต่อพฤติกรรมการใช้บรรจุภัณฑ์ได้ในระดับหนึ่ง ข้าพเจ้ามีความเห็นว่าผู้ผลิตต้องรับผิดชอบมากกว่า เนื่องจากพวกเขาเป็นผู้ควบคุมวิธีการบรรจุผลิตภัณฑ์ในท้ายที่สุด'
      }
    ],
    vocab: [
      { word: "plastic waste", thaiMeaning: "ขยะพลาสติก" },
      { word: "consumer demand", thaiMeaning: "ความต้องการของผู้บริโภค" },
      { word: "household staples", thaiMeaning: "ของใช้จำเป็นในครัวเรือน" },
      { word: "product design", thaiMeaning: "การออกแบบผลิตภัณฑ์" },
      { word: "heavily packaged products", thaiMeaning: "สินค้าที่บรรจุหีบห่อหนาแน่น" },
      { word: "sustainable materials", thaiMeaning: "วัสดุที่ยั่งยืน" },
      { word: "supermarket chains", thaiMeaning: "เครือข่ายซูเปอร์มาร์เก็ต" },
      { word: "fresh produce", thaiMeaning: "ผักผลไม้สด" },
      { word: "plastic packaging", thaiMeaning: "บรรจุภัณฑ์พลาสติก" },
      { word: "pre-packaged alternatives", thaiMeaning: "ทางเลือกที่บรรจุหีบห่อไว้ล่วงหน้า" },
      { word: "unpackaged options", thaiMeaning: "ตัวเลือกที่ไม่มีบรรจุภัณฑ์" },
      { word: "fixed packaging", thaiMeaning: "บรรจุภัณฑ์ตายตัว" },
      { word: "environmentally conscious", thaiMeaning: "ใส่ใจสิ่งแวดล้อม" },
      { word: "packaging habits", thaiMeaning: "พฤติกรรมการบรรจุหีบห่อ" },
      { word: "greater responsibility", thaiMeaning: "ความรับผิดชอบที่มากกว่า" },
      { word: "loose fruit and vegetables", thaiMeaning: "ผลไม้และผักแบบไม่มีหีบห่อ" },
      { word: "primary responsibility", thaiMeaning: "ความรับผิดชอบหลัก" },
      { word: "ordinary consumers", thaiMeaning: "ผู้บริโภคทั่วไป" },
      { word: "individual preference", thaiMeaning: "ความชอบส่วนบุคคล" },
      { word: "reducing packaging", thaiMeaning: "การลดบรรจุภัณฑ์" },
      { word: "supermarkets and manufacturers", thaiMeaning: "ซูเปอร์มาร์เก็ตและผู้ผลิต" },
      { word: "reduce the packaging", thaiMeaning: "ลดบรรจุภัณฑ์" },
      { word: "take responsibility", thaiMeaning: "รับผิดชอบ" },
      { word: "thousands of tonnes annually", thaiMeaning: "หลายพันตันต่อปี" },
      { word: "ultimately drives", thaiMeaning: "เป็นตัวขับเคลื่อนในที่สุด" },
      { word: "growing number of shoppers", thaiMeaning: "จำนวนผู้ซื้อที่เพิ่มขึ้น" },
      { word: "encouraging retailers", thaiMeaning: "ส่งเสริมผู้ค้าปลีก" },
      { word: "limited alternatives", thaiMeaning: "ทางเลือกที่จำกัด" },
      { word: "rice or shampoo", thaiMeaning: "ข้าวหรือแชมพู" },
      { word: "ultimately control", thaiMeaning: "ควบคุมในที่สุด" },
      { word: "how products are packaged", thaiMeaning: "วิธีที่สินค้าถูกบรรจุหีบห่อ" },
      { word: "bear the greater share of responsibility", thaiMeaning: "รับผิดชอบส่วนที่มากกว่า" }
    ]
  },
  {
    id: 't2-dbv-3',
    number: 3,
    typeId: 'discuss-both-views',
    title: 'Genetic Engineering: Benefit or Threat?',
    questionText:
      'Some people believe that genetic engineering will greatly benefit humanity, while others think it poses a serious danger to life on Earth. Discuss both views and give your own opinion.',
    meta: 'Turkey · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that genetic engineering will greatly improve human lives, others claim that it poses a serious threat to life on earth. Both points of view will be elaborated on before elaborating on the reasons why I believe that genetic engineering brings more benefits than risks.",
        thai: 'แม้ว่าบางคนจะโต้แย้งว่าวิศวกรรมพันธุกรรมจะพัฒนาชีวิตมนุษย์ให้ดีขึ้นอย่างมาก แต่คนอื่น ๆ อ้างว่ามันเป็นภัยคุกคามร้ายแรงต่อชีวิตบนโลก มุมมองทั้งสองด้านจะได้รับการอธิบายโดยละเอียด ก่อนที่จะอธิบายเหตุผลว่าเหตุใดข้าพเจ้าจึงเชื่อว่าวิศวกรรมพันธุกรรมนำมาซึ่งประโยชน์มากกว่าความเสี่ยง'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that genetic engineering offers significant benefits to humanity. To explain this simply, this is because scientists can now modify genes to prevent inherited diseases before they even develop. For example, gene therapy has already been used to successfully treat patients with sickle cell disease in several clinical trials.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าวิศวกรรมพันธุกรรมให้ประโยชน์อย่างมากต่อมนุษยชาติ พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะว่าปัจจุบันนักวิทยาศาสตร์สามารถปรับเปลี่ยนยีนเพื่อป้องกันโรคทางพันธุกรรมก่อนที่มันจะพัฒนาขึ้นได้ ตัวอย่างเช่น การบำบัดด้วยยีนถูกนำมาใช้รักษาผู้ป่วยโรคเม็ดเลือดแดงรูปเคียวได้สำเร็จแล้วในการทดลองทางคลินิกหลายครั้ง'
      },
      {
        role: 'body2',
        text: "However, some might argue that genetic engineering poses serious dangers to life on earth. To put it simply, this is due to the fact that altering genes could produce unpredictable and irreversible effects on ecosystems and future generations. For instance, genetically modified crops have been linked to reduced biodiversity in some farming regions where they have been widely planted.",
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าวิศวกรรมพันธุกรรมก่อให้เกิดอันตรายร้ายแรงต่อชีวิตบนโลก พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าการเปลี่ยนแปลงยีนอาจก่อให้เกิดผลกระทบที่ไม่สามารถคาดการณ์ได้และไม่สามารถย้อนกลับได้ต่อระบบนิเวศและคนรุ่นต่อไป ตัวอย่างเช่น พืชดัดแปลงพันธุกรรมมีความเชื่อมโยงกับความหลากหลายทางชีวภาพที่ลดลงในบางพื้นที่เกษตรกรรมที่มีการปลูกอย่างแพร่หลาย'
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that the benefits of genetic engineering outweigh its risks. My reasoning is that, with strict international regulation, the technology's dangers can be managed while its life-saving potential is preserved. To illustrate, countries such as the UK now require rigorous ethical approval before any gene-editing research can proceed, significantly reducing the likelihood of harmful outcomes.",
        thai: 'ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าประโยชน์ของวิศวกรรมพันธุกรรมมีมากกว่าความเสี่ยงของมัน เหตุผลของข้าพเจ้าคือ ด้วยกฎระเบียบระหว่างประเทศที่เข้มงวด อันตรายของเทคโนโลยีนี้สามารถถูกจัดการได้ในขณะที่ศักยภาพในการช่วยชีวิตของมันยังคงถูกรักษาไว้ ตัวอย่างเช่น ประเทศต่าง ๆ เช่น สหราชอาณาจักร ปัจจุบันกำหนดให้ต้องได้รับการอนุมัติด้านจริยธรรมอย่างเข้มงวดก่อนที่งานวิจัยด้านการตัดต่อยีนจะดำเนินต่อไปได้ ซึ่งช่วยลดโอกาสของผลลัพธ์ที่เป็นอันตรายลงอย่างมีนัยสำคัญ'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that genetic engineering carries certain risks, I am of the opinion that its potential to improve human health makes it a worthwhile technology to pursue.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าวิศวกรรมพันธุกรรมมีความเสี่ยงบางประการ ข้าพเจ้ามีความเห็นว่าศักยภาพของมันในการพัฒนาสุขภาพของมนุษย์ทำให้มันเป็นเทคโนโลยีที่คุ้มค่าแก่การดำเนินต่อไป'
      }
    ],
    vocab: [
      { word: "inherited diseases", thaiMeaning: "โรคทางพันธุกรรม" },
      { word: "gene therapy", thaiMeaning: "การบำบัดด้วยยีน" },
      { word: "ethical approval", thaiMeaning: "การอนุมัติด้านจริยธรรม" },
      { word: "biodiversity", thaiMeaning: "ความหลากหลายทางชีวภาพ" },
      { word: "genetic engineering", thaiMeaning: "วิศวกรรมพันธุกรรม" },
      { word: "serious threat", thaiMeaning: "ภัยคุกคามร้ายแรง" },
      { word: "modify genes", thaiMeaning: "ดัดแปลงยีน" },
      { word: "sickle cell disease", thaiMeaning: "โรคโลหิตจางเม็ดเลือดรูปเคียว" },
      { word: "clinical trials", thaiMeaning: "การทดลองทางคลินิก" },
      { word: "unpredictable and irreversible effects", thaiMeaning: "ผลกระทบที่คาดเดาไม่ได้และย้อนกลับไม่ได้" },
      { word: "future generations", thaiMeaning: "คนรุ่นหลัง" },
      { word: "genetically modified crops", thaiMeaning: "พืชดัดแปลงพันธุกรรม" },
      { word: "farming regions", thaiMeaning: "พื้นที่เกษตรกรรม" },
      { word: "international regulation", thaiMeaning: "กฎระเบียบระหว่างประเทศ" },
      { word: "life-saving potential", thaiMeaning: "ศักยภาพในการช่วยชีวิต" },
      { word: "gene-editing research", thaiMeaning: "งานวิจัยตัดต่อยีน" },
      { word: "harmful outcomes", thaiMeaning: "ผลลัพธ์ที่เป็นอันตราย" },
      { word: "human health", thaiMeaning: "สุขภาพของมนุษย์" },
      { word: "worthwhile technology", thaiMeaning: "เทคโนโลยีที่คุ้มค่า" },
      { word: "serious dangers", thaiMeaning: "อันตรายร้ายแรง" },
      { word: "greatly improve human lives", thaiMeaning: "ปรับปรุงชีวิตมนุษย์อย่างมาก" },
      { word: "life on earth", thaiMeaning: "สิ่งมีชีวิตบนโลก" },
      { word: "significant benefits to humanity", thaiMeaning: "ประโยชน์สำคัญต่อมนุษยชาติ" },
      { word: "successfully treat patients", thaiMeaning: "รักษาผู้ป่วยได้สำเร็จ" },
      { word: "altering genes", thaiMeaning: "การดัดแปลงยีน" },
      { word: "outweigh its risks", thaiMeaning: "มีน้ำหนักมากกว่าความเสี่ยง" },
      { word: "technology's dangers", thaiMeaning: "อันตรายของเทคโนโลยี" },
      { word: "carries certain risks", thaiMeaning: "มีความเสี่ยงบางประการ" },
      { word: "widely planted", thaiMeaning: "ปลูกอย่างแพร่หลาย" },
      { word: "before they even develop", thaiMeaning: "ก่อนที่จะพัฒนาขึ้นเลย" },
      { word: "brings more benefits than risks", thaiMeaning: "นำมาซึ่งประโยชน์มากกว่าความเสี่ยง" },
      { word: "effects on ecosystems", thaiMeaning: "ผลกระทบต่อระบบนิเวศ" }
    ]
  },
  {
    id: 't2-dbv-4',
    number: 4,
    typeId: 'discuss-both-views',
    title: 'Who Should Teach Money Management?',
    questionText:
      'Some people think that money management should be taught in schools as a compulsory subject. Others believe that teaching children about finances is the responsibility of parents. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that money management should be taught as a mandatory school subject, others claim that teaching children about finances is solely the responsibility of parents. Both points of view will be elaborated on before elaborating on the reasons why I believe that schools should take on this responsibility.",
        thai: 'แม้ว่าบางคนจะโต้แย้งว่าการบริหารจัดการเงินควรถูกสอนเป็นวิชาบังคับในโรงเรียน แต่คนอื่น ๆ อ้างว่าการสอนเรื่องการเงินแก่เด็กเป็นความรับผิดชอบของผู้ปกครองเพียงฝ่ายเดียว มุมมองทั้งสองด้านจะได้รับการอธิบายโดยละเอียด ก่อนที่จะอธิบายเหตุผลว่าเหตุใดข้าพเจ้าจึงเชื่อว่าโรงเรียนควรรับผิดชอบในเรื่องนี้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that schools are best placed to teach money management. To explain this simply, this is because teachers can deliver consistent, structured financial education to every student regardless of family background. For example, the UK has included compulsory financial literacy classes in its national curriculum since 2014.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าโรงเรียนอยู่ในตำแหน่งที่ดีที่สุดในการสอนการบริหารจัดการเงิน พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะว่าครูสามารถให้การศึกษาด้านการเงินที่สม่ำเสมอและมีโครงสร้างแก่นักเรียนทุกคน โดยไม่คำนึงถึงภูมิหลังครอบครัว ตัวอย่างเช่น สหราชอาณาจักรได้บรรจุวิชาความรู้ทางการเงินภาคบังคับไว้ในหลักสูตรแห่งชาติตั้งแต่ปี 2014'
      },
      {
        role: 'body2',
        text: "However, some might argue that teaching children about money is a parental responsibility. To put it simply, this is due to the fact that parents are better placed to demonstrate real financial habits, such as budgeting and saving, within the context of daily family life. For instance, many financially successful adults credit lessons learned from watching their parents manage household budgets.",
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าการสอนเรื่องเงินแก่เด็กเป็นความรับผิดชอบของผู้ปกครอง พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าผู้ปกครองอยู่ในตำแหน่งที่ดีกว่าในการสาธิตนิสัยทางการเงินที่แท้จริง เช่น การทำงบประมาณและการออม ภายในบริบทของชีวิตครอบครัวประจำวัน ตัวอย่างเช่น ผู้ใหญ่ที่ประสบความสำเร็จทางการเงินหลายคนให้เครดิตกับบทเรียนที่ได้เรียนรู้จากการเฝ้าดูผู้ปกครองบริหารงบประมาณครัวเรือน'
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that money management should be a mandatory school subject. My reasoning is that not every parent possesses the financial knowledge or confidence needed to teach these skills effectively. To illustrate, a 2019 survey by a UK financial charity found that nearly a third of parents felt unqualified to teach their children about money.",
        thai: 'ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าการบริหารจัดการเงินควรเป็นวิชาบังคับในโรงเรียน เหตุผลของข้าพเจ้าคือ ไม่ใช่ผู้ปกครองทุกคนที่มีความรู้หรือความมั่นใจทางการเงินที่จำเป็นในการสอนทักษะเหล่านี้อย่างมีประสิทธิภาพ ตัวอย่างเช่น การสำรวจในปี 2019 โดยองค์กรการกุศลด้านการเงินแห่งสหราชอาณาจักรพบว่าเกือบหนึ่งในสามของผู้ปกครองรู้สึกว่าตนเองไม่มีคุณสมบัติเพียงพอที่จะสอนบุตรหลานเรื่องเงิน'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that parents play an important role in shaping children's financial habits, I am of the opinion that schools should take primary responsibility, as this ensures every child receives this essential education.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าผู้ปกครองมีบทบาทสำคัญในการหล่อหลอมนิสัยทางการเงินของเด็ก ข้าพเจ้ามีความเห็นว่าโรงเรียนควรรับผิดชอบหลัก เนื่องจากสิ่งนี้ช่วยให้มั่นใจว่าเด็กทุกคนได้รับการศึกษาที่จำเป็นนี้'
      }
    ],
    vocab: [
      { word: "financial literacy", thaiMeaning: "ความรู้ทางการเงิน" },
      { word: "household budgets", thaiMeaning: "งบประมาณครัวเรือน" },
      { word: "national curriculum", thaiMeaning: "หลักสูตรแห่งชาติ" },
      { word: "financial habits", thaiMeaning: "นิสัยทางการเงิน" },
      { word: "money management", thaiMeaning: "การจัดการเงิน" },
      { word: "mandatory school subject", thaiMeaning: "วิชาบังคับในโรงเรียน" },
      { word: "regardless of family background", thaiMeaning: "โดยไม่คำนึงถึงพื้นฐานครอบครัว" },
      { word: "parental responsibility", thaiMeaning: "ความรับผิดชอบของพ่อแม่" },
      { word: "budgeting and saving", thaiMeaning: "การจัดงบและการออม" },
      { word: "daily family life", thaiMeaning: "ชีวิตครอบครัวประจำวัน" },
      { word: "financially successful adults", thaiMeaning: "ผู้ใหญ่ที่ประสบความสำเร็จทางการเงิน" },
      { word: "financial knowledge", thaiMeaning: "ความรู้ด้านการเงิน" },
      { word: "financial charity", thaiMeaning: "องค์กรการกุศลด้านการเงิน" },
      { word: "essential education", thaiMeaning: "การศึกษาที่จำเป็น" },
      { word: "primary responsibility", thaiMeaning: "ความรับผิดชอบหลัก" },
      { word: "felt unqualified", thaiMeaning: "รู้สึกว่าไม่มีความรู้พอ" },
      { word: "consistent, structured financial education", thaiMeaning: "การศึกษาด้านการเงินที่สม่ำเสมอและมีโครงสร้าง" },
      { word: "solely the responsibility of parents", thaiMeaning: "เป็นความรับผิดชอบของพ่อแม่เพียงอย่างเดียว" },
      { word: "take on this responsibility", thaiMeaning: "รับผิดชอบเรื่องนี้" },
      { word: "watching their parents", thaiMeaning: "การสังเกตพ่อแม่" },
      { word: "teaching children about finances", thaiMeaning: "การสอนเด็กเกี่ยวกับการเงิน" },
      { word: "best placed to teach", thaiMeaning: "เหมาะสมที่สุดที่จะสอน" },
      { word: "better placed to demonstrate", thaiMeaning: "เหมาะสมกว่าที่จะเป็นแบบอย่าง" },
      { word: "credit lessons learned", thaiMeaning: "ยกเครดิตให้บทเรียนที่ได้เรียนรู้" },
      { word: "not every parent possesses", thaiMeaning: "พ่อแม่ไม่ใช่ทุกคนมี" },
      { word: "teach these skills effectively", thaiMeaning: "สอนทักษะเหล่านี้ได้อย่างมีประสิทธิภาพ" },
      { word: "nearly a third of parents", thaiMeaning: "พ่อแม่เกือบหนึ่งในสาม" },
      { word: "teaching children about money", thaiMeaning: "การสอนเด็กเกี่ยวกับเงิน" },
      { word: "confidence needed", thaiMeaning: "ความมั่นใจที่จำเป็น" },
      { word: "play an important role", thaiMeaning: "มีบทบาทสำคัญ" },
      { word: "ensures every child receives", thaiMeaning: "รับประกันว่าเด็กทุกคนได้รับ" },
      { word: "schools are best placed", thaiMeaning: "โรงเรียนเหมาะสมที่สุด" }
    ]
  },
  {
    id: 't2-dbv-5',
    number: 5,
    typeId: 'discuss-both-views',
    title: 'Who Should Set School Rules?',
    questionText:
      'Some people believe that students should be involved in making the rules of their school. Others think that this responsibility should remain with teachers. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that schoolchildren should be allowed to make decisions about school rules, others claim that teachers should remain responsible for setting these rules. Both points of view will be elaborated on before elaborating on the reasons why I believe that teachers should retain this responsibility.",
        thai: 'แม้ว่าบางคนจะโต้แย้งว่านักเรียนควรได้รับอนุญาตให้มีส่วนร่วมในการตัดสินใจเกี่ยวกับกฎระเบียบของโรงเรียน แต่คนอื่น ๆ อ้างว่าครูควรยังคงรับผิดชอบในการกำหนดกฎเหล่านี้ มุมมองทั้งสองด้านจะได้รับการอธิบายโดยละเอียด ก่อนที่จะอธิบายเหตุผลว่าเหตุใดข้าพเจ้าจึงเชื่อว่าครูควรรักษาความรับผิดชอบนี้ไว้'
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that students should have a say in creating school rules. To explain this simply, this is because pupils who help design the rules may feel more motivated to follow them. For example, some schools in Finland allow student councils to propose changes to rules on matters such as school uniforms.",
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่านักเรียนควรมีสิทธิ์ออกความเห็นในการสร้างกฎระเบียบของโรงเรียน พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะว่านักเรียนที่ช่วยออกแบบกฎอาจรู้สึกมีแรงจูงใจมากขึ้นที่จะปฏิบัติตามกฎเหล่านั้น ตัวอย่างเช่น โรงเรียนบางแห่งในฟินแลนด์อนุญาตให้สภานักเรียนเสนอการเปลี่ยนแปลงกฎในเรื่องต่าง ๆ เช่น เครื่องแบบนักเรียน'
      },
      {
        role: 'body2',
        text: "However, some might argue that teachers should remain solely responsible for setting school rules. To put it simply, this is due to the fact that teachers have the experience and training needed to judge which rules genuinely support learning and safety. For instance, decisions such as classroom discipline policies require an understanding of child development that most students do not yet have.",
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าครูควรเป็นผู้รับผิดชอบเพียงฝ่ายเดียวในการกำหนดกฎระเบียบของโรงเรียน พูดให้เข้าใจง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าครูมีประสบการณ์และการฝึกอบรมที่จำเป็นในการตัดสินว่ากฎใดที่สนับสนุนการเรียนรู้และความปลอดภัยอย่างแท้จริง ตัวอย่างเช่น การตัดสินใจต่าง ๆ เช่น นโยบายวินัยในห้องเรียนต้องอาศัยความเข้าใจเกี่ยวกับพัฒนาการของเด็กซึ่งนักเรียนส่วนใหญ่ยังไม่มี'
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that teachers should retain primary responsibility for school rules. My reasoning is that children often lack the long-term perspective needed to judge the consequences of the rules they might propose. To illustrate, a rule allowing unlimited phone use during lessons might seem appealing to students but could seriously damage their academic performance.",
        thai: 'ส่วนตัวข้าพเจ้าจะโต้แย้งสนับสนุนแนวคิดที่ว่าครูควรรักษาความรับผิดชอบหลักในการกำหนดกฎระเบียบของโรงเรียน เหตุผลของข้าพเจ้าคือ เด็ก ๆ มักขาดมุมมองระยะยาวที่จำเป็นในการตัดสินผลที่ตามมาของกฎที่พวกเขาอาจเสนอ ตัวอย่างเช่น กฎที่อนุญาตให้ใช้โทรศัพท์ได้ไม่จำกัดในระหว่างบทเรียนอาจดูน่าดึงดูดสำหรับนักเรียน แต่สามารถทำลายผลการเรียนของพวกเขาได้อย่างร้ายแรง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that involving students can improve their sense of ownership over school life, I am of the opinion that teachers should retain responsibility for setting rules, as they are better placed to protect students' long-term interests.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการให้นักเรียนมีส่วนร่วมสามารถเพิ่มความรู้สึกเป็นเจ้าของในชีวิตโรงเรียนของพวกเขาได้ ข้าพเจ้ามีความเห็นว่าครูควรรักษาความรับผิดชอบในการกำหนดกฎไว้ เนื่องจากพวกเขาอยู่ในตำแหน่งที่ดีกว่าในการปกป้องผลประโยชน์ระยะยาวของนักเรียน'
      }
    ],
    vocab: [
      { word: "student councils", thaiMeaning: "สภานักเรียน" },
      { word: "classroom discipline", thaiMeaning: "ระเบียบวินัยในห้องเรียน" },
      { word: "academic performance", thaiMeaning: "ผลการเรียน" },
      { word: "long-term perspective", thaiMeaning: "มุมมองระยะยาว" },
      { word: "school rules", thaiMeaning: "กฎของโรงเรียน" },
      { word: "school uniforms", thaiMeaning: "เครื่องแบบนักเรียน" },
      { word: "child development", thaiMeaning: "พัฒนาการเด็ก" },
      { word: "unlimited phone use", thaiMeaning: "การใช้โทรศัพท์อย่างไม่จำกัด" },
      { word: "sense of ownership", thaiMeaning: "ความรู้สึกเป็นเจ้าของ" },
      { word: "students' long-term interests", thaiMeaning: "ผลประโยชน์ระยะยาวของนักเรียน" },
      { word: "learning and safety", thaiMeaning: "การเรียนรู้และความปลอดภัย" },
      { word: "primary responsibility", thaiMeaning: "ความรับผิดชอบหลัก" },
      { word: "school life", thaiMeaning: "ชีวิตในโรงเรียน" },
      { word: "experience and training", thaiMeaning: "ประสบการณ์และการอบรม" },
      { word: "genuinely support learning", thaiMeaning: "สนับสนุนการเรียนรู้อย่างแท้จริง" },
      { word: "setting these rules", thaiMeaning: "การกำหนดกฎเหล่านี้" },
      { word: "help design the rules", thaiMeaning: "ช่วยออกแบบกฎ" },
      { word: "remain solely responsible", thaiMeaning: "รับผิดชอบเพียงฝ่ายเดียว" },
      { word: "retain this responsibility", thaiMeaning: "คงความรับผิดชอบนี้ไว้" },
      { word: "involving students", thaiMeaning: "การให้นักเรียนมีส่วนร่วม" },
      { word: "feel more motivated to follow them", thaiMeaning: "รู้สึกมีแรงจูงใจมากขึ้นที่จะปฏิบัติตาม" },
      { word: "propose changes to rules", thaiMeaning: "เสนอการเปลี่ยนแปลงกฎ" },
      { word: "judge the consequences", thaiMeaning: "ตัดสินผลที่ตามมา" },
      { word: "better placed to protect", thaiMeaning: "เหมาะสมกว่าที่จะปกป้อง" },
      { word: "have a say", thaiMeaning: "มีส่วนร่วมแสดงความเห็น" },
      { word: "appealing to students", thaiMeaning: "น่าสนใจสำหรับนักเรียน" },
      { word: "during lessons", thaiMeaning: "ระหว่างคาบเรียน" },
      { word: "schoolchildren should be allowed", thaiMeaning: "เด็กนักเรียนควรได้รับอนุญาต" },
      { word: "most students do not yet have", thaiMeaning: "นักเรียนส่วนใหญ่ยังไม่มี" },
      { word: "children often lack", thaiMeaning: "เด็กมักขาด" },
      { word: "might seem appealing", thaiMeaning: "อาจดูน่าสนใจ" },
      { word: "needed to judge", thaiMeaning: "จำเป็นต่อการตัดสิน" }
    ]
  },
  {
    id: 't2-dbv-6',
    number: 6,
    typeId: 'discuss-both-views',
    title: 'Old Buildings: Preserve or Replace?',
    questionText:
      "Some people think it is important to keep and maintain old buildings rather than replacing them with modern buildings. Discuss both views and give your own opinion.",
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that old buildings should be preserved rather than replaced, others claim that constructing modern buildings better serves a city's practical needs. Both points of view will be elaborated on before elaborating on the reasons why I believe that preservation should generally be prioritized.", thai: 'ในขณะที่บางคนโต้แย้งว่าอาคารเก่าควรได้รับการอนุรักษ์ไว้แทนที่จะถูกแทนที่ด้วยอาคารใหม่ คนอื่น ๆ กลับอ้างว่าการสร้างอาคารสมัยใหม่ตอบสนองความต้องการเชิงปฏิบัติของเมืองได้ดีกว่า มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าการอนุรักษ์ควรได้รับความสำคัญเป็นอันดับแรกโดยทั่วไป' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that old buildings should be preserved rather than replaced. To explain this simply, this is because these structures hold historical and cultural value that cannot be recreated once demolished. For example, cities such as Kyoto attract millions of visitors annually largely because of their carefully preserved traditional buildings.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าอาคารเก่าควรได้รับการอนุรักษ์ไว้แทนที่จะถูกแทนที่ เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าโครงสร้างเหล่านี้มีคุณค่าทางประวัติศาสตร์และวัฒนธรรมที่ไม่สามารถสร้างขึ้นใหม่ได้อีกเมื่อถูกรื้อถอนไปแล้ว ยกตัวอย่างเช่น เมืองอย่างเกียวโตดึงดูดนักท่องเที่ยวหลายล้านคนทุกปี ส่วนใหญ่เป็นเพราะอาคารดั้งเดิมที่ได้รับการอนุรักษ์อย่างพิถีพิถัน' },
      { role: 'body2', text: "However, some might argue that replacing old buildings with modern ones is the more sensible option. To put it simply, this is due to the fact that new buildings can be designed to meet current safety standards and housing demand far more efficiently. For instance, a 2020 report by the Mori Memorial Foundation found that redeveloped districts in Tokyo increased usable housing space by over 40%.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าการแทนที่อาคารเก่าด้วยอาคารสมัยใหม่เป็นทางเลือกที่สมเหตุสมผลกว่า พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าอาคารใหม่สามารถออกแบบให้ตรงตามมาตรฐานความปลอดภัยในปัจจุบันและความต้องการที่อยู่อาศัยได้อย่างมีประสิทธิภาพมากกว่ามาก ยกตัวอย่างเช่น รายงานปี 2020 โดยมูลนิธิ Mori Memorial พบว่าย่านที่ได้รับการพัฒนาใหม่ในโตเกียวเพิ่มพื้นที่อยู่อาศัยที่ใช้ได้จริงขึ้นมากกว่า 40%' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that preservation should generally take priority over redevelopment. My reasoning is that historic buildings, once lost, can never be restored to their original form or authenticity. To illustrate, the reconstruction efforts following the 2019 Notre-Dame fire in Paris cost hundreds of millions of euros yet still could not fully replicate certain original features.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าการอนุรักษ์ควรได้รับความสำคัญมากกว่าการพัฒนาใหม่โดยทั่วไป เหตุผลของผมคือ อาคารประวัติศาสตร์เมื่อสูญเสียไปแล้วไม่สามารถบูรณะให้กลับคืนสู่รูปแบบหรือความแท้จริงดั้งเดิมได้อีก ยกตัวอย่างเพื่อประกอบ ความพยายามในการบูรณะภายหลังเหตุการณ์ไฟไหม้มหาวิหารนอเทรอดามในปี 2019 ที่กรุงปารีส มีค่าใช้จ่ายหลายร้อยล้านยูโร แต่ก็ยังไม่สามารถจำลองลักษณะดั้งเดิมบางอย่างได้อย่างสมบูรณ์' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that new developments can address urgent housing and safety needs, I am of the opinion that preserving old buildings should remain the priority, given their irreplaceable cultural value.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการพัฒนาใหม่สามารถตอบสนองความต้องการด้านที่อยู่อาศัยและความปลอดภัยที่เร่งด่วนได้ ผมมีความเห็นว่าการอนุรักษ์อาคารเก่าควรยังคงเป็นสิ่งสำคัญอันดับแรก เนื่องจากคุณค่าทางวัฒนธรรมที่ไม่สามารถทดแทนได้' }
    ],
    vocab: [
      { word: "cultural value", thaiMeaning: "คุณค่าทางวัฒนธรรม" },
      { word: "housing demand", thaiMeaning: "ความต้องการที่อยู่อาศัย" },
      { word: "reconstruction efforts", thaiMeaning: "ความพยายามในการบูรณะ" },
      { word: "original features", thaiMeaning: "ลักษณะดั้งเดิม" },
      { word: "carefully preserved traditional buildings", thaiMeaning: "อาคารดั้งเดิมที่อนุรักษ์อย่างดี" },
      { word: "current safety standards", thaiMeaning: "มาตรฐานความปลอดภัยในปัจจุบัน" },
      { word: "usable housing space", thaiMeaning: "พื้นที่อยู่อาศัยที่ใช้ได้" },
      { word: "redeveloped districts", thaiMeaning: "ย่านที่ได้รับการพัฒนาใหม่" },
      { word: "historic buildings", thaiMeaning: "อาคารประวัติศาสตร์" },
      { word: "practical needs", thaiMeaning: "ความต้องการในทางปฏิบัติ" },
      { word: "urgent housing and safety needs", thaiMeaning: "ความต้องการด้านที่อยู่อาศัยและความปลอดภัยเร่งด่วน" },
      { word: "take priority", thaiMeaning: "ให้ความสำคัญก่อน" },
      { word: "original form", thaiMeaning: "รูปแบบดั้งเดิม" },
      { word: "modern buildings", thaiMeaning: "อาคารสมัยใหม่" },
      { word: "once demolished", thaiMeaning: "เมื่อถูกรื้อถอนแล้ว" },
      { word: "millions of visitors", thaiMeaning: "ผู้เยี่ยมชมหลายล้านคน" },
      { word: "authenticity", thaiMeaning: "ความแท้จริง" },
      { word: "redevelopment", thaiMeaning: "การพัฒนาใหม่" },
      { word: "old buildings", thaiMeaning: "อาคารเก่า" },
      { word: "cannot be recreated", thaiMeaning: "ไม่สามารถสร้างขึ้นใหม่ได้" },
      { word: "preserved rather than replaced", thaiMeaning: "อนุรักษ์ไว้แทนการรื้อสร้างใหม่" },
      { word: "generally be prioritized", thaiMeaning: "ควรให้ความสำคัญก่อนโดยทั่วไป" },
      { word: "more sensible option", thaiMeaning: "ทางเลือกที่สมเหตุสมผลกว่า" },
      { word: "far more efficiently", thaiMeaning: "อย่างมีประสิทธิภาพมากกว่ามาก" },
      { word: "can never be restored", thaiMeaning: "ไม่สามารถบูรณะคืนได้" },
      { word: "hundreds of millions of euros", thaiMeaning: "หลายร้อยล้านยูโร" },
      { word: "fully replicate", thaiMeaning: "จำลองได้อย่างครบถ้วน" },
      { word: "new developments", thaiMeaning: "การพัฒนาใหม่" },
      { word: "remain the priority", thaiMeaning: "ยังคงเป็นสิ่งสำคัญอันดับแรก" },
      { word: "Notre-Dame fire", thaiMeaning: "ไฟไหม้โนเทรอดาม" },
      { word: "once lost", thaiMeaning: "เมื่อสูญเสียไปแล้ว" },
      { word: "Mori Memorial Foundation", thaiMeaning: "มูลนิธิโมริเมโมเรียล" }
    ]
  },
  {
    id: 't2-dbv-7',
    number: 7,
    typeId: 'discuss-both-views',
    title: 'International Contacts vs. National Identity',
    questionText:
      'Some people believe that increasing business and cultural contacts between countries is a positive development. Others think that many countries will lose their national identity as a result. Discuss both views and give your own opinion.',
    meta: 'Hong Kong · Jul 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that growing business and cultural contact between countries is a positive development, others claim that many nations risk losing their national identity as a result. Both points of view will be elaborated on before elaborating on the reasons why I believe that the benefits of this trend outweigh the risks.", thai: 'ในขณะที่บางคนโต้แย้งว่าการติดต่อทางธุรกิจและวัฒนธรรมระหว่างประเทศที่เพิ่มขึ้นเป็นพัฒนาการเชิงบวก คนอื่น ๆ กลับอ้างว่าหลายประเทศมีความเสี่ยงที่จะสูญเสียอัตลักษณ์ประจำชาติอันเป็นผลจากสิ่งนี้ มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าประโยชน์ของแนวโน้มนี้มีมากกว่าความเสี่ยง' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that increasing international contact is a positive development. To explain this simply, this is because closer business and cultural ties allow countries to share knowledge, technology, and economic opportunities more freely. For example, trade between European Union member states has grown substantially since border restrictions were reduced.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าการติดต่อระหว่างประเทศที่เพิ่มขึ้นเป็นพัฒนาการเชิงบวก เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าความสัมพันธ์ทางธุรกิจและวัฒนธรรมที่ใกล้ชิดกันมากขึ้นทำให้ประเทศต่าง ๆ สามารถแบ่งปันความรู้ เทคโนโลยี และโอกาสทางเศรษฐกิจได้อย่างเสรีมากขึ้น ยกตัวอย่างเช่น การค้าระหว่างประเทศสมาชิกสหภาพยุโรปเติบโตอย่างมากนับตั้งแต่ข้อจำกัดเรื่องพรมแดนถูกลดลง' },
      { role: 'body2', text: "However, some might argue that this trend threatens the survival of national identity. To put it simply, this is due to the fact that constant exposure to foreign culture can gradually weaken traditional customs, languages, and values. For instance, a 2017 UNESCO report warned that hundreds of minority languages worldwide face extinction due to the dominance of globally spoken languages.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าแนวโน้มนี้คุกคามการดำรงอยู่ของอัตลักษณ์ประจำชาติ พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าการรับสัมผัสวัฒนธรรมต่างชาติอย่างต่อเนื่องสามารถค่อย ๆ ทำให้ขนบธรรมเนียม ภาษา และค่านิยมดั้งเดิมอ่อนแอลง ยกตัวอย่างเช่น รายงานของยูเนสโกปี 2017 เตือนว่าภาษาชนกลุ่มน้อยหลายร้อยภาษาทั่วโลกกำลังเสี่ยงต่อการสูญพันธุ์ เนื่องจากการครอบงำของภาษาที่ใช้พูดกันทั่วโลก' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that the benefits of international contact outweigh the risks to national identity. My reasoning is that most countries continue to actively protect their traditions through education and cultural policy despite growing global exchange. To illustrate, South Korea has combined rapid international business expansion with strong government support for traditional arts, which remain widely practiced today.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าประโยชน์ของการติดต่อระหว่างประเทศมีมากกว่าความเสี่ยงต่ออัตลักษณ์ประจำชาติ เหตุผลของผมคือ ประเทศส่วนใหญ่ยังคงปกป้องประเพณีของตนอย่างจริงจังผ่านการศึกษาและนโยบายทางวัฒนธรรม แม้จะมีการแลกเปลี่ยนระดับโลกที่เพิ่มขึ้น ยกตัวอย่างเพื่อประกอบ เกาหลีใต้ได้ผสมผสานการขยายตัวทางธุรกิจระหว่างประเทศอย่างรวดเร็วเข้ากับการสนับสนุนที่แข็งแกร่งจากรัฐบาลต่อศิลปะดั้งเดิม ซึ่งยังคงได้รับการปฏิบัติกันอย่างแพร่หลายในปัจจุบัน' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some erosion of local culture may occur, I am of the opinion that the economic and social benefits of international contact make it a positive development overall.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าอาจเกิดการกัดกร่อนวัฒนธรรมท้องถิ่นบางส่วน ผมมีความเห็นว่าประโยชน์ทางเศรษฐกิจและสังคมของการติดต่อระหว่างประเทศทำให้มันเป็นพัฒนาการเชิงบวกโดยรวม' }
    ],
    vocab: [
      { word: "national identity", thaiMeaning: "อัตลักษณ์ของชาติ" },
      { word: "traditional customs", thaiMeaning: "ขนบธรรมเนียมดั้งเดิม" },
      { word: "cultural policy", thaiMeaning: "นโยบายด้านวัฒนธรรม" },
      { word: "global exchange", thaiMeaning: "การแลกเปลี่ยนระดับโลก" },
      { word: "international contact", thaiMeaning: "การติดต่อระหว่างประเทศ" },
      { word: "economic opportunities", thaiMeaning: "โอกาสทางเศรษฐกิจ" },
      { word: "border restrictions", thaiMeaning: "ข้อจำกัดด้านพรมแดน" },
      { word: "minority languages", thaiMeaning: "ภาษาชนกลุ่มน้อย" },
      { word: "globally spoken languages", thaiMeaning: "ภาษาที่ใช้พูดทั่วโลก" },
      { word: "business expansion", thaiMeaning: "การขยายธุรกิจ" },
      { word: "traditional arts", thaiMeaning: "ศิลปะดั้งเดิม" },
      { word: "local culture", thaiMeaning: "วัฒนธรรมท้องถิ่น" },
      { word: "cultural contact", thaiMeaning: "การติดต่อทางวัฒนธรรม" },
      { word: "foreign culture", thaiMeaning: "วัฒนธรรมต่างชาติ" },
      { word: "share knowledge", thaiMeaning: "แบ่งปันความรู้" },
      { word: "positive development", thaiMeaning: "การพัฒนาในทางบวก" },
      { word: "economic and social benefits", thaiMeaning: "ประโยชน์ทางเศรษฐกิจและสังคม" },
      { word: "government support", thaiMeaning: "การสนับสนุนจากรัฐบาล" },
      { word: "face extinction", thaiMeaning: "เผชิญภาวะใกล้สูญพันธุ์" },
      { word: "constant exposure", thaiMeaning: "การสัมผัสอย่างต่อเนื่อง" },
      { word: "the benefits of this trend outweigh the risks", thaiMeaning: "ประโยชน์ของแนวโน้มนี้มีมากกว่าความเสี่ยง" },
      { word: "closer business and cultural ties allow countries", thaiMeaning: "ความสัมพันธ์ทางธุรกิจและวัฒนธรรมที่ใกล้ชิดขึ้นเอื้อให้ประเทศต่าง ๆ" },
      { word: "trade between European Union member states has grown substantially", thaiMeaning: "การค้าระหว่างรัฐสมาชิกสหภาพยุโรปเติบโตอย่างมาก" },
      { word: "threatens the survival", thaiMeaning: "คุกคามการดำรงอยู่" },
      { word: "gradually weaken", thaiMeaning: "ค่อย ๆ อ่อนแอลง" },
      { word: "continue to actively protect their traditions through education", thaiMeaning: "ยังคงปกป้องประเพณีอย่างจริงจังผ่านการศึกษา" },
      { word: "remain widely practiced today", thaiMeaning: "ยังคงมีการปฏิบัติอย่างแพร่หลายในปัจจุบัน" },
      { word: "2017 UNESCO report", thaiMeaning: "รายงานของยูเนสโกปี 2017" },
      { word: "many nations risk losing", thaiMeaning: "หลายชาติเสี่ยงต่อการสูญเสีย" },
      { word: "South Korea has combined", thaiMeaning: "เกาหลีใต้ได้ผสมผสาน" },
      { word: "allow countries to share", thaiMeaning: "เปิดโอกาสให้ประเทศต่าง ๆ แบ่งปัน" },
      { word: "the dominance of", thaiMeaning: "การครอบงำของ" }
    ]
  },
  {
    id: 't2-dbv-8',
    number: 8,
    typeId: 'discuss-both-views',
    title: 'Hotels vs. Holiday Homes',
    questionText:
      'Some people prefer staying in hotels when they travel, while others prefer renting holiday homes for a short period of time. Discuss both views and give your own opinion.',
    meta: 'UAE · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that staying in hotels is the best option when travelling, others claim that renting holiday homes offers a better experience. Both points of view will be elaborated on before elaborating on the reasons why I believe that holiday homes are generally the wiser choice.", thai: 'ในขณะที่บางคนโต้แย้งว่าการพักในโรงแรมเป็นทางเลือกที่ดีที่สุดเมื่อเดินทาง คนอื่น ๆ กลับอ้างว่าการเช่าบ้านพักตากอากาศให้ประสบการณ์ที่ดีกว่า มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าบ้านพักตากอากาศเป็นทางเลือกที่ฉลาดกว่าโดยทั่วไป' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that hotels are the more convenient option for travellers. To explain this simply, this is because hotels typically provide professional staff, daily cleaning, and on-site facilities such as restaurants and gyms. For example, major hotel chains like Marriott offer round-the-clock guest services that many independent holiday rentals simply cannot match.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าโรงแรมเป็นทางเลือกที่สะดวกกว่าสำหรับนักเดินทาง เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าโรงแรมมักมีพนักงานมืออาชีพ การทำความสะอาดทุกวัน และสิ่งอำนวยความสะดวกภายในสถานที่ เช่น ร้านอาหารและฟิตเนส ยกตัวอย่างเช่น เครือโรงแรมใหญ่อย่างแมริออทให้บริการแขกตลอด 24 ชั่วโมง ซึ่งที่พักตากอากาศแบบอิสระหลายแห่งไม่สามารถเทียบได้' },
      { role: 'body2', text: "However, some might argue that renting a holiday home provides a more rewarding travel experience. To put it simply, this is due to the fact that holiday homes usually offer more space, privacy, and the chance to live like a local resident. For instance, a 2021 survey by Airbnb found that over 60% of guests chose holiday rentals specifically to experience neighbourhoods that typical hotels do not reach.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าการเช่าบ้านพักตากอากาศให้ประสบการณ์การเดินทางที่คุ้มค่ากว่า พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าบ้านพักตากอากาศมักมีพื้นที่มากกว่า ความเป็นส่วนตัวมากกว่า และโอกาสที่จะใช้ชีวิตเหมือนคนในท้องถิ่น ยกตัวอย่างเช่น การสำรวจของ Airbnb ในปี 2021 พบว่าแขกกว่า 60% เลือกที่พักตากอากาศโดยเฉพาะเพื่อสัมผัสย่านต่าง ๆ ที่โรงแรมทั่วไปเข้าไม่ถึง' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that holiday homes are generally the better accommodation choice. My reasoning is that they allow travellers, particularly families, to save money on meals by using a kitchen while enjoying considerably more living space. To illustrate, a family of four renting an apartment in Barcelona can often pay less than the cost of two separate hotel rooms while gaining a full kitchen and living area.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าบ้านพักตากอากาศเป็นทางเลือกที่พักที่ดีกว่าโดยทั่วไป เหตุผลของผมคือ มันช่วยให้นักเดินทาง โดยเฉพาะครอบครัว ประหยัดเงินค่าอาหารได้ด้วยการใช้ครัว ในขณะที่ได้พื้นที่อยู่อาศัยที่กว้างขวางกว่ามาก ยกตัวอย่างเพื่อประกอบ ครอบครัวสี่คนที่เช่าอพาร์ตเมนต์ในบาร์เซโลนามักจะจ่ายน้อยกว่าค่าห้องพักโรงแรมสองห้องแยกกัน ในขณะที่ยังได้ครัวและพื้นที่นั่งเล่นเต็มรูปแบบ' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that hotels offer valuable convenience and professional service, I am of the opinion that holiday homes provide better overall value for most travellers.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าโรงแรมให้ความสะดวกสบายและบริการมืออาชีพที่มีคุณค่า ผมมีความเห็นว่าบ้านพักตากอากาศให้คุณค่าโดยรวมที่ดีกว่าสำหรับนักเดินทางส่วนใหญ่' }
    ],
    vocab: [
      { word: "guest services", thaiMeaning: "บริการสำหรับผู้เข้าพัก" },
      { word: "local resident", thaiMeaning: "ผู้อยู่อาศัยในท้องถิ่น" },
      { word: "holiday rentals", thaiMeaning: "ที่พักให้เช่าสำหรับวันหยุด" },
      { word: "living area", thaiMeaning: "พื้นที่นั่งเล่น" },
      { word: "holiday homes", thaiMeaning: "บ้านพักตากอากาศ" },
      { word: "professional staff", thaiMeaning: "พนักงานมืออาชีพ" },
      { word: "daily cleaning", thaiMeaning: "บริการทำความสะอาดรายวัน" },
      { word: "on-site facilities", thaiMeaning: "สิ่งอำนวยความสะดวกในสถานที่" },
      { word: "round-the-clock", thaiMeaning: "ตลอด 24 ชั่วโมง" },
      { word: "travel experience", thaiMeaning: "ประสบการณ์การเดินทาง" },
      { word: "accommodation choice", thaiMeaning: "ตัวเลือกที่พัก" },
      { word: "save money on meals", thaiMeaning: "ประหยัดค่าอาหาร" },
      { word: "full kitchen", thaiMeaning: "ครัวครบครัน" },
      { word: "overall value", thaiMeaning: "คุ้มค่าโดยรวม" },
      { word: "professional service", thaiMeaning: "บริการระดับมืออาชีพ" },
      { word: "hotel chains", thaiMeaning: "เครือโรงแรม" },
      { word: "living space", thaiMeaning: "พื้นที่ใช้สอย" },
      { word: "hotel rooms", thaiMeaning: "ห้องโรงแรม" },
      { word: "wiser choice", thaiMeaning: "ทางเลือกที่ฉลาดกว่า" },
      { word: "convenient option", thaiMeaning: "ทางเลือกที่สะดวก" },
      { word: "staying in hotels", thaiMeaning: "การพักในโรงแรม" },
      { word: "best option when travelling", thaiMeaning: "ทางเลือกที่ดีที่สุดเมื่อเดินทาง" },
      { word: "restaurants and gyms", thaiMeaning: "ร้านอาหารและฟิตเนส" },
      { word: "simply cannot match", thaiMeaning: "เทียบไม่ได้อย่างชัดเจน" },
      { word: "renting a holiday home", thaiMeaning: "การเช่าบ้านพักตากอากาศ" },
      { word: "more space, privacy", thaiMeaning: "พื้นที่และความเป็นส่วนตัวมากขึ้น" },
      { word: "neighbourhoods that typical hotels do not reach", thaiMeaning: "ย่านที่โรงแรมทั่วไปเข้าไม่ถึง" },
      { word: "particularly families", thaiMeaning: "โดยเฉพาะครอบครัว" },
      { word: "using a kitchen", thaiMeaning: "การใช้ครัว" },
      { word: "family of four", thaiMeaning: "ครอบครัวสี่คน" },
      { word: "renting an apartment in Barcelona", thaiMeaning: "การเช่าอพาร์ตเมนต์ในบาร์เซโลนา" },
      { word: "valuable convenience", thaiMeaning: "ความสะดวกที่มีค่า" }
    ]
  },
  {
    id: 't2-dbv-9',
    number: 9,
    typeId: 'discuss-both-views',
    title: 'Homework: Alone or With Parents?',
    questionText:
      "Some people believe that students should do their homework independently, while others think that parents should help their children with homework. Discuss both views and give your own opinion.",
    meta: 'Australia · Apr 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that students should complete homework independently, others claim that parents should actively help their children with it. Both points of view will be elaborated on before elaborating on the reasons why I believe that independent homework brings greater long-term benefits.", thai: 'ในขณะที่บางคนโต้แย้งว่านักเรียนควรทำการบ้านด้วยตนเองอย่างอิสระ คนอื่น ๆ กลับอ้างว่าพ่อแม่ควรช่วยเหลือลูก ๆ อย่างจริงจังในการทำการบ้าน มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าการทำการบ้านอย่างอิสระให้ประโยชน์ในระยะยาวมากกว่า' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that parents should help their children with homework. To explain this simply, this is because parental involvement can quickly clear up confusion and prevent children from developing frustration over difficult subjects. For example, many parents in Singapore regularly guide their children through mathematics homework to reinforce concepts taught earlier that day.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าพ่อแม่ควรช่วยลูก ๆ ทำการบ้าน เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าการมีส่วนร่วมของพ่อแม่สามารถคลี่คลายความสับสนได้อย่างรวดเร็ว และป้องกันไม่ให้เด็กเกิดความคับข้องใจกับวิชาที่ยาก ยกตัวอย่างเช่น พ่อแม่หลายคนในสิงคโปร์มักแนะนำลูก ๆ ทำการบ้านวิชาคณิตศาสตร์เป็นประจำ เพื่อทบทวนแนวคิดที่สอนไปในวันนั้น' },
      { role: 'body2', text: "However, some might argue that students should complete homework entirely on their own. To put it simply, this is due to the fact that working independently forces students to develop problem-solving skills and self-discipline that constant assistance cannot provide. For instance, a 2016 study published in the Journal of Educational Psychology found that students who completed homework unaided showed stronger long-term retention of material.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่านักเรียนควรทำการบ้านด้วยตนเองทั้งหมด พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าการทำงานอย่างอิสระบังคับให้นักเรียนพัฒนาทักษะการแก้ปัญหาและวินัยในตนเอง ซึ่งความช่วยเหลืออย่างต่อเนื่องไม่สามารถให้ได้ ยกตัวอย่างเช่น การศึกษาปี 2016 ที่ตีพิมพ์ในวารสาร Journal of Educational Psychology พบว่านักเรียนที่ทำการบ้านโดยไม่มีคนช่วยแสดงให้เห็นการจดจำเนื้อหาในระยะยาวที่แข็งแกร่งกว่า' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that independent homework offers the greater long-term benefit. My reasoning is that children who struggle through problems alone learn to manage setbacks, a skill essential for success far beyond the classroom. To illustrate, university students who received little parental help with homework as children often report adapting more easily to independent study without supervision.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าการทำการบ้านอย่างอิสระให้ประโยชน์ในระยะยาวมากกว่า เหตุผลของผมคือ เด็กที่ต่อสู้กับปัญหาด้วยตนเองจะเรียนรู้ที่จะจัดการกับอุปสรรค ซึ่งเป็นทักษะสำคัญสำหรับความสำเร็จที่ไกลเกินกว่าห้องเรียน ยกตัวอย่างเพื่อประกอบ นักศึกษามหาวิทยาลัยที่ได้รับความช่วยเหลือจากพ่อแม่น้อยในการทำการบ้านตอนเด็ก มักรายงานว่าปรับตัวเข้ากับการเรียนอย่างอิสระโดยไม่มีการดูแลได้ง่ายกว่า' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that parental support can ease short-term academic pressure, I am of the opinion that allowing children to complete homework independently builds more valuable lifelong skills.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการสนับสนุนจากพ่อแม่สามารถบรรเทาความกดดันทางวิชาการในระยะสั้นได้ ผมมีความเห็นว่าการปล่อยให้เด็กทำการบ้านอย่างอิสระสร้างทักษะที่มีคุณค่ามากกว่าตลอดชีวิต' }
    ],
    vocab: [
      { word: "parental involvement", thaiMeaning: "การมีส่วนร่วมของผู้ปกครอง" },
      { word: "problem-solving skills", thaiMeaning: "ทักษะการแก้ปัญหา" },
      { word: "self-discipline", thaiMeaning: "วินัยในตนเอง" },
      { word: "independent study", thaiMeaning: "การเรียนรู้ด้วยตนเอง" },
      { word: "complete homework independently", thaiMeaning: "ทำการบ้านด้วยตนเอง" },
      { word: "long-term benefits", thaiMeaning: "ประโยชน์ระยะยาว" },
      { word: "difficult subjects", thaiMeaning: "วิชาที่ยาก" },
      { word: "reinforce concepts", thaiMeaning: "ทบทวนแนวคิด" },
      { word: "working independently", thaiMeaning: "การทำงานอย่างอิสระ" },
      { word: "constant assistance", thaiMeaning: "ความช่วยเหลืออย่างต่อเนื่อง" },
      { word: "long-term retention", thaiMeaning: "การจดจำระยะยาว" },
      { word: "manage setbacks", thaiMeaning: "รับมือกับอุปสรรค" },
      { word: "without supervision", thaiMeaning: "โดยไม่มีผู้ควบคุม" },
      { word: "academic pressure", thaiMeaning: "ความกดดันด้านการเรียน" },
      { word: "lifelong skills", thaiMeaning: "ทักษะตลอดชีวิต" },
      { word: "parental support", thaiMeaning: "การสนับสนุนจากผู้ปกครอง" },
      { word: "parental help", thaiMeaning: "ความช่วยเหลือจากผู้ปกครอง" },
      { word: "independent homework", thaiMeaning: "การบ้านที่ทำด้วยตนเอง" },
      { word: "clear up confusion", thaiMeaning: "คลายความสับสน" },
      { word: "developing frustration", thaiMeaning: "เกิดความหงุดหงิด" },
      { word: "actively help their children", thaiMeaning: "ช่วยเหลือลูกอย่างจริงจัง" },
      { word: "entirely on their own", thaiMeaning: "ด้วยตนเองทั้งหมด" },
      { word: "completed homework unaided", thaiMeaning: "ทำการบ้านโดยไม่ได้รับความช่วยเหลือ" },
      { word: "struggle through problems alone", thaiMeaning: "ฝ่าฟันปัญหาด้วยตนเอง" },
      { word: "skill essential for success", thaiMeaning: "ทักษะสำคัญต่อความสำเร็จ" },
      { word: "success far beyond the classroom", thaiMeaning: "ความสำเร็จที่ไกลเกินห้องเรียน" },
      { word: "adapting more easily", thaiMeaning: "ปรับตัวได้ง่ายขึ้น" },
      { word: "greater long-term benefit", thaiMeaning: "ประโยชน์ระยะยาวที่มากกว่า" },
      { word: "many parents in Singapore regularly guide their children", thaiMeaning: "ผู้ปกครองจำนวนมากในสิงคโปร์แนะแนวทางให้ลูกเป็นประจำ" },
      { word: "mathematics homework", thaiMeaning: "การบ้านคณิตศาสตร์" },
      { word: "Journal of Educational Psychology", thaiMeaning: "วารสารจิตวิทยาการศึกษา" },
      { word: "taught earlier that day", thaiMeaning: "ที่สอนไปก่อนหน้าในวันนั้น" }
    ]
  },
  {
    id: 't2-dbv-10',
    number: 10,
    typeId: 'discuss-both-views',
    title: 'Salary vs. Positive Work Environment',
    questionText:
      'Some people believe that earning a high salary is the most important factor when choosing an employer, while others think that a positive working environment is more important. Discuss both views and give your own opinion.',
    meta: 'Australia · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that a high salary is the most important factor when choosing an employer, others claim that a positive working environment matters more. Both points of view will be elaborated on before elaborating on the reasons why I believe that a positive workplace ultimately matters most.", thai: 'ในขณะที่บางคนโต้แย้งว่าเงินเดือนสูงเป็นปัจจัยที่สำคัญที่สุดในการเลือกนายจ้าง คนอื่น ๆ กลับอ้างว่าสภาพแวดล้อมการทำงานที่ดีสำคัญกว่า มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าสถานที่ทำงานที่ดีสำคัญที่สุดในท้ายที่สุด' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that a high salary should be the deciding factor when choosing an employer. To explain this simply, this is because greater income allows employees to meet financial needs and achieve a more comfortable standard of living. For example, many graduates in finance accept demanding roles at investment banks specifically because of the exceptionally high starting salaries offered.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าเงินเดือนสูงควรเป็นปัจจัยตัดสินใจในการเลือกนายจ้าง เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่ารายได้ที่มากขึ้นทำให้พนักงานสามารถตอบสนองความต้องการทางการเงินและมีมาตรฐานความเป็นอยู่ที่สะดวกสบายมากขึ้น ยกตัวอย่างเช่น บัณฑิตจำนวนมากในสายการเงินยอมรับตำแหน่งงานที่หนักหน่วงในธนาคารเพื่อการลงทุน โดยเฉพาะเพราะเงินเดือนเริ่มต้นที่สูงเป็นพิเศษที่เสนอให้' },
      { role: 'body2', text: "However, some might argue that a positive working environment is more important than pay. To put it simply, this is due to the fact that supportive colleagues and manageable workloads directly affect an employee's happiness and long-term motivation. For instance, a 2019 Gallup workplace study found that employees who rated their workplace culture highly were far less likely to leave their jobs within a year.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าสภาพแวดล้อมการทำงานที่ดีสำคัญกว่าค่าจ้าง พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าเพื่อนร่วมงานที่คอยสนับสนุนและปริมาณงานที่จัดการได้ ส่งผลโดยตรงต่อความสุขและแรงจูงใจระยะยาวของพนักงาน ยกตัวอย่างเช่น การศึกษาที่ทำงานของ Gallup ปี 2019 พบว่าพนักงานที่ให้คะแนนวัฒนธรรมองค์กรของตนสูง มีแนวโน้มน้อยกว่ามากที่จะลาออกจากงานภายในหนึ่งปี' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that a positive working environment matters more than salary alone. My reasoning is that even a generous salary cannot compensate for constant stress, unclear expectations, or poor management over time. To illustrate, technology companies such as Google have long attracted top talent partly because of their supportive workplace culture rather than salary alone.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าสภาพแวดล้อมการทำงานที่ดีสำคัญกว่าเงินเดือนเพียงอย่างเดียว เหตุผลของผมคือ แม้แต่เงินเดือนที่ดีก็ไม่สามารถชดเชยความเครียดต่อเนื่อง ความคาดหวังที่ไม่ชัดเจน หรือการบริหารจัดการที่ไม่ดีเมื่อเวลาผ่านไป ยกตัวอย่างเพื่อประกอบ บริษัทเทคโนโลยีอย่างกูเกิลดึงดูดบุคลากรที่มีความสามารถระดับสูงมาอย่างยาวนาน ส่วนหนึ่งเพราะวัฒนธรรมการทำงานที่คอยสนับสนุน มากกว่าเพียงเงินเดือน' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that a high salary provides essential financial security, I am of the opinion that a positive working environment matters more for long-term job satisfaction.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าเงินเดือนสูงให้ความมั่นคงทางการเงินที่จำเป็น ผมมีความเห็นว่าสภาพแวดล้อมการทำงานที่ดีสำคัญกว่าสำหรับความพึงพอใจในงานในระยะยาว' }
    ],
    vocab: [
      { word: "standard of living", thaiMeaning: "มาตรฐานการครองชีพ" },
      { word: "workplace culture", thaiMeaning: "วัฒนธรรมองค์กร" },
      { word: "long-term motivation", thaiMeaning: "แรงจูงใจระยะยาว" },
      { word: "job satisfaction", thaiMeaning: "ความพึงพอใจในงาน" },
      { word: "high salary", thaiMeaning: "เงินเดือนสูง" },
      { word: "working environment", thaiMeaning: "สภาพแวดล้อมการทำงาน" },
      { word: "deciding factor", thaiMeaning: "ปัจจัยชี้ขาด" },
      { word: "financial needs", thaiMeaning: "ความต้องการทางการเงิน" },
      { word: "starting salaries", thaiMeaning: "เงินเดือนเริ่มต้น" },
      { word: "supportive colleagues", thaiMeaning: "เพื่อนร่วมงานที่ให้การสนับสนุน" },
      { word: "manageable workloads", thaiMeaning: "ปริมาณงานที่รับไหว" },
      { word: "financial security", thaiMeaning: "ความมั่นคงทางการเงิน" },
      { word: "unclear expectations", thaiMeaning: "ความคาดหวังที่ไม่ชัดเจน" },
      { word: "poor management", thaiMeaning: "การบริหารจัดการที่ย่ำแย่" },
      { word: "top talent", thaiMeaning: "บุคคลที่มีความสามารถสูง" },
      { word: "constant stress", thaiMeaning: "ความเครียดอย่างต่อเนื่อง" },
      { word: "investment banks", thaiMeaning: "ธนาคารเพื่อการลงทุน" },
      { word: "positive workplace", thaiMeaning: "สถานที่ทำงานที่ดี" },
      { word: "generous salary", thaiMeaning: "เงินเดือนที่สูงมาก" },
      { word: "demanding roles", thaiMeaning: "ตำแหน่งงานที่ท้าทาย" },
      { word: "choosing an employer", thaiMeaning: "การเลือกนายจ้าง" },
      { word: "more important than pay", thaiMeaning: "สำคัญกว่าค่าจ้าง" },
      { word: "greater income allows employees", thaiMeaning: "รายได้ที่มากกว่าช่วยให้พนักงาน" },
      { word: "many graduates in finance", thaiMeaning: "บัณฑิตจำนวนมากในสายการเงิน" },
      { word: "exceptionally high", thaiMeaning: "สูงเป็นพิเศษ" },
      { word: "far less likely to leave", thaiMeaning: "มีแนวโน้มลาออกน้อยกว่ามาก" },
      { word: "leave their jobs within a year", thaiMeaning: "ลาออกภายในหนึ่งปี" },
      { word: "cannot compensate for", thaiMeaning: "ไม่สามารถชดเชยได้" },
      { word: "technology companies such as Google", thaiMeaning: "บริษัทเทคโนโลยีอย่างกูเกิล" },
      { word: "rather than salary alone", thaiMeaning: "มากกว่าเงินเดือนเพียงอย่างเดียว" },
      { word: "most important factor", thaiMeaning: "ปัจจัยที่สำคัญที่สุด" },
      { word: "Gallup workplace study", thaiMeaning: "การศึกษาสถานที่ทำงานของ Gallup" }
    ]
  },
  {
    id: 't2-dbv-11',
    number: 11,
    typeId: 'discuss-both-views',
    title: "Children's Life: Past vs. Present",
    questionText:
      'Some people believe that children in the past had an easier life, while others think that life is easier for children today. Discuss both views and give your own opinion.',
    meta: 'Italy · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that children in the past had an easier life, others claim that children today actually enjoy greater advantages. Both points of view will be elaborated on before elaborating on the reasons why I believe that children today generally have it easier.", thai: 'ในขณะที่บางคนโต้แย้งว่าเด็กในอดีตมีชีวิตที่ง่ายกว่า คนอื่น ๆ กลับอ้างว่าเด็กในปัจจุบันมีข้อได้เปรียบมากกว่าจริง ๆ มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าเด็กในปัจจุบันโดยทั่วไปมีชีวิตที่ง่ายกว่า' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that children in the past experienced an easier life. To explain this simply, this is because past generations faced fewer academic pressures and enjoyed more unstructured outdoor play with neighbourhood friends. For example, many adults who grew up in the 1970s recall spending entire afternoons playing outside without any scheduled activities.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าเด็กในอดีตมีชีวิตที่ง่ายกว่า เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าคนรุ่นก่อนเผชิญกับแรงกดดันทางวิชาการน้อยกว่าและได้เล่นกลางแจ้งอย่างอิสระกับเพื่อนบ้านมากกว่า ยกตัวอย่างเช่น ผู้ใหญ่หลายคนที่เติบโตในทศวรรษ 1970 จำได้ว่าใช้เวลาทั้งบ่ายเล่นข้างนอกโดยไม่มีกิจกรรมที่กำหนดไว้เลย' },
      { role: 'body2', text: "However, some might argue that children today have an easier life than previous generations. To put it simply, this is due to the fact that modern children benefit from far greater access to healthcare, education, and technology than their parents or grandparents did. For instance, global child mortality rates have fallen by more than half since 1990, according to UNICEF data.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าเด็กในปัจจุบันมีชีวิตที่ง่ายกว่าคนรุ่นก่อน พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าเด็กในยุคปัจจุบันได้รับประโยชน์จากการเข้าถึงการรักษาพยาบาล การศึกษา และเทคโนโลยีที่มากกว่าพ่อแม่หรือปู่ย่าตายายของพวกเขามาก ยกตัวอย่างเช่น อัตราการเสียชีวิตของเด็กทั่วโลกลดลงมากกว่าครึ่งหนึ่งนับตั้งแต่ปี 1990 ตามข้อมูลของยูนิเซฟ' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that children today generally enjoy an easier life overall. My reasoning is that today's children can access vast educational resources instantly, something previous generations could only dream of. To illustrate, a student in a rural village can now use a smartphone to watch free university lectures from institutions such as MIT.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าเด็กในปัจจุบันโดยทั่วไปมีชีวิตที่ง่ายกว่าโดยรวม เหตุผลของผมคือ เด็กในปัจจุบันสามารถเข้าถึงแหล่งข้อมูลทางการศึกษาจำนวนมหาศาลได้ทันที ซึ่งเป็นสิ่งที่คนรุ่นก่อนได้แต่ฝันถึงเท่านั้น ยกตัวอย่างเพื่อประกอบ นักเรียนในหมู่บ้านชนบทตอนนี้สามารถใช้สมาร์ทโฟนดูการบรรยายของมหาวิทยาลัยฟรีจากสถาบันอย่าง MIT ได้' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that today's children face new pressures such as academic competition and social media, I am of the opinion that children today ultimately have an easier life thanks to modern healthcare and education.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าเด็กในปัจจุบันเผชิญกับแรงกดดันใหม่ ๆ เช่น การแข่งขันทางวิชาการและโซเชียลมีเดีย ผมมีความเห็นว่าเด็กในปัจจุบันมีชีวิตที่ง่ายกว่าในท้ายที่สุด เนื่องมาจากการรักษาพยาบาลและการศึกษาสมัยใหม่' }
    ],
    vocab: [
      { word: "academic pressures", thaiMeaning: "ความกดดันด้านการเรียน" },
      { word: "child mortality rates", thaiMeaning: "อัตราการเสียชีวิตของเด็ก" },
      { word: "educational resources", thaiMeaning: "ทรัพยากรทางการศึกษา" },
      { word: "academic competition", thaiMeaning: "การแข่งขันด้านการเรียน" },
      { word: "unstructured outdoor play", thaiMeaning: "การเล่นกลางแจ้งอย่างอิสระ" },
      { word: "neighbourhood friends", thaiMeaning: "เพื่อนในละแวกบ้าน" },
      { word: "scheduled activities", thaiMeaning: "กิจกรรมที่มีตารางกำหนด" },
      { word: "previous generations", thaiMeaning: "คนรุ่นก่อน" },
      { word: "access to healthcare", thaiMeaning: "การเข้าถึงบริการสุขภาพ" },
      { word: "free university lectures", thaiMeaning: "การบรรยายมหาวิทยาลัยฟรี" },
      { word: "rural village", thaiMeaning: "หมู่บ้านชนบท" },
      { word: "social media", thaiMeaning: "สื่อสังคมออนไลน์" },
      { word: "modern healthcare", thaiMeaning: "การดูแลสุขภาพสมัยใหม่" },
      { word: "greater advantages", thaiMeaning: "ข้อได้เปรียบที่มากขึ้น" },
      { word: "easier life", thaiMeaning: "ชีวิตที่ง่ายกว่า" },
      { word: "modern children", thaiMeaning: "เด็กในยุคปัจจุบัน" },
      { word: "entire afternoons", thaiMeaning: "ช่วงบ่ายทั้งวัน" },
      { word: "UNICEF data", thaiMeaning: "ข้อมูลของยูนิเซฟ" },
      { word: "new pressures", thaiMeaning: "ความกดดันใหม่" },
      { word: "playing outside", thaiMeaning: "การเล่นนอกบ้าน" },
      { word: "children in the past", thaiMeaning: "เด็กในอดีต" },
      { word: "children today generally have it easier", thaiMeaning: "เด็กในปัจจุบันโดยรวมแล้วมีชีวิตที่ง่ายกว่า" },
      { word: "past generations faced fewer", thaiMeaning: "คนรุ่นก่อนเผชิญน้อยกว่า" },
      { word: "many adults who grew up in the 1970s", thaiMeaning: "ผู้ใหญ่จำนวนมากที่เติบโตในทศวรรษ 1970" },
      { word: "healthcare, education, and technology than their parents or grandparents did", thaiMeaning: "ด้านสุขภาพ การศึกษา และเทคโนโลยี มากกว่าที่พ่อแม่หรือปู่ย่าตายายเคยได้" },
      { word: "fallen by more than half since 1990", thaiMeaning: "ลดลงมากกว่าครึ่งตั้งแต่ปี 1990" },
      { word: "could only dream of", thaiMeaning: "เพียงแค่ฝันถึงได้" },
      { word: "can now use a smartphone", thaiMeaning: "สามารถใช้สมาร์ตโฟนได้แล้ว" },
      { word: "institutions such as MIT", thaiMeaning: "สถาบันอย่างเอ็มไอที" },
      { word: "today's children", thaiMeaning: "เด็กในปัจจุบัน" },
      { word: "benefit from far greater access", thaiMeaning: "ได้รับประโยชน์จากการเข้าถึงที่มากกว่ามาก" },
      { word: "can access vast", thaiMeaning: "สามารถเข้าถึงได้อย่างมหาศาล" }
    ]
  },
  {
    id: 't2-dbv-12',
    number: 12,
    typeId: 'discuss-both-views',
    title: 'Free Public Libraries: Worth It?',
    questionText:
      'Some believe that the government should set up free libraries in every city, while others think it is a waste of money. Discuss both views and give your own opinion.',
    meta: 'Sweden · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that governments should establish free public libraries in every city, others claim that this would be a wasteful use of public funds. Both points of view will be elaborated on before elaborating on the reasons why I believe that funding free libraries remains a worthwhile investment.", thai: 'ในขณะที่บางคนโต้แย้งว่ารัฐบาลควรจัดตั้งห้องสมุดสาธารณะฟรีในทุกเมือง คนอื่น ๆ กลับอ้างว่านี่จะเป็นการใช้เงินภาษีอย่างสิ้นเปลือง มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าการให้เงินสนับสนุนห้องสมุดฟรียังคงเป็นการลงทุนที่คุ้มค่า' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that governments should provide free public libraries in every city. To explain this simply, this is because libraries give every resident, regardless of income, equal access to books, computers, and quiet study spaces. For example, public libraries across Finland offer free internet access and study rooms that are heavily used by students and job seekers alike.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่ารัฐบาลควรจัดให้มีห้องสมุดสาธารณะฟรีในทุกเมือง เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าห้องสมุดให้ผู้อยู่อาศัยทุกคน ไม่ว่าจะมีรายได้เท่าใด เข้าถึงหนังสือ คอมพิวเตอร์ และพื้นที่อ่านหนังสือที่เงียบสงบได้อย่างเท่าเทียมกัน ยกตัวอย่างเช่น ห้องสมุดสาธารณะทั่วฟินแลนด์ให้บริการอินเทอร์เน็ตฟรีและห้องอ่านหนังสือซึ่งถูกใช้งานอย่างหนักโดยนักเรียนและผู้หางานเช่นกัน' },
      { role: 'body2', text: "However, some might argue that building free libraries in every city wastes government money. To put it simply, this is due to the fact that most information is now freely available online, making costly physical library buildings increasingly unnecessary. For instance, a 2018 report noted that public library visits in several major American cities had declined by nearly 20% over the previous decade.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าการสร้างห้องสมุดฟรีในทุกเมืองเป็นการสิ้นเปลืองเงินของรัฐบาล พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าข้อมูลส่วนใหญ่ตอนนี้สามารถหาได้ฟรีทางออนไลน์ ทำให้อาคารห้องสมุดจริงที่มีค่าใช้จ่ายสูงกลายเป็นสิ่งที่ไม่จำเป็นมากขึ้นเรื่อย ๆ ยกตัวอย่างเช่น รายงานปี 2018 ระบุว่าจำนวนผู้เข้าชมห้องสมุดสาธารณะในหลายเมืองใหญ่ของอเมริกาลดลงเกือบ 20% ในช่วงทศวรรษที่ผ่านมา' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that free public libraries remain a worthwhile government investment. My reasoning is that libraries serve elderly residents and low-income families who often lack reliable internet access or personal devices at home. To illustrate, community libraries in rural areas of the UK continue to host free digital literacy classes for residents who cannot otherwise get online.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าห้องสมุดสาธารณะฟรียังคงเป็นการลงทุนที่คุ้มค่าของรัฐบาล เหตุผลของผมคือ ห้องสมุดให้บริการผู้สูงอายุและครอบครัวรายได้น้อยที่มักขาดการเข้าถึงอินเทอร์เน็ตที่เชื่อถือได้หรืออุปกรณ์ส่วนตัวที่บ้าน ยกตัวอย่างเพื่อประกอบ ห้องสมุดชุมชนในพื้นที่ชนบทของสหราชอาณาจักรยังคงจัดชั้นเรียนความรู้ด้านดิจิทัลฟรีสำหรับผู้อยู่อาศัยที่ไม่สามารถเข้าถึงอินเทอร์เน็ตได้ด้วยวิธีอื่น' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that online information has reduced some demand for physical libraries, I am of the opinion that governments should continue funding them to support disadvantaged communities.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าข้อมูลออนไลน์ได้ลดความต้องการห้องสมุดจริงลงบ้าง ผมมีความเห็นว่ารัฐบาลควรให้เงินสนับสนุนต่อไปเพื่อช่วยเหลือชุมชนที่ด้อยโอกาส' }
    ],
    vocab: [
      { word: "public funds", thaiMeaning: "เงินทุนสาธารณะ" },
      { word: "study spaces", thaiMeaning: "พื้นที่สำหรับอ่านหนังสือ" },
      { word: "digital literacy", thaiMeaning: "ความรู้ด้านดิจิทัล" },
      { word: "disadvantaged communities", thaiMeaning: "ชุมชนผู้ด้อยโอกาส" },
      { word: "free public libraries", thaiMeaning: "ห้องสมุดประชาชนฟรี" },
      { word: "worthwhile investment", thaiMeaning: "การลงทุนที่คุ้มค่า" },
      { word: "equal access", thaiMeaning: "การเข้าถึงอย่างเท่าเทียม" },
      { word: "free internet access", thaiMeaning: "การเข้าถึงอินเทอร์เน็ตฟรี" },
      { word: "job seekers", thaiMeaning: "ผู้หางาน" },
      { word: "library visits", thaiMeaning: "การเข้าใช้ห้องสมุด" },
      { word: "elderly residents", thaiMeaning: "ผู้อยู่อาศัยสูงอายุ" },
      { word: "low-income families", thaiMeaning: "ครอบครัวรายได้น้อย" },
      { word: "personal devices", thaiMeaning: "อุปกรณ์ส่วนบุคคล" },
      { word: "community libraries", thaiMeaning: "ห้องสมุดชุมชน" },
      { word: "online information", thaiMeaning: "ข้อมูลออนไลน์" },
      { word: "physical libraries", thaiMeaning: "ห้องสมุดทางกายภาพ" },
      { word: "regardless of income", thaiMeaning: "ไม่ว่าจะมีรายได้เท่าใด" },
      { word: "rural areas", thaiMeaning: "พื้นที่ชนบท" },
      { word: "wasteful use", thaiMeaning: "การใช้ที่สิ้นเปลือง" },
      { word: "government investment", thaiMeaning: "การลงทุนของรัฐบาล" },
      { word: "public libraries across Finland", thaiMeaning: "ห้องสมุดประชาชนทั่วฟินแลนด์" },
      { word: "wastes government money", thaiMeaning: "สิ้นเปลืองเงินของรัฐ" },
      { word: "freely available online", thaiMeaning: "หาได้ฟรีทางออนไลน์" },
      { word: "costly physical library buildings", thaiMeaning: "อาคารห้องสมุดที่มีค่าใช้จ่ายสูง" },
      { word: "increasingly unnecessary", thaiMeaning: "ยิ่งไม่จำเป็นมากขึ้น" },
      { word: "declined by nearly 20%", thaiMeaning: "ลดลงเกือบ 20%" },
      { word: "over the previous decade", thaiMeaning: "ตลอดทศวรรษที่ผ่านมา" },
      { word: "lack reliable internet access", thaiMeaning: "ขาดการเข้าถึงอินเทอร์เน็ตที่เสถียร" },
      { word: "cannot otherwise get online", thaiMeaning: "ไม่สามารถเชื่อมต่อออนไลน์ได้ด้วยวิธีอื่น" },
      { word: "funding free libraries", thaiMeaning: "การสนับสนุนเงินทุนห้องสมุดฟรี" },
      { word: "building free libraries in every city", thaiMeaning: "การสร้างห้องสมุดฟรีในทุกเมือง" },
      { word: "study rooms that are heavily used", thaiMeaning: "ห้องอ่านหนังสือที่มีผู้ใช้อย่างหนาแน่น" }
    ]
  },
  {
    id: 't2-dbv-13',
    number: 13,
    typeId: 'discuss-both-views',
    title: "Parents vs. TV and Friends",
    questionText:
      "Some people believe that parents have the most important role in a child's development. However, others argue that other things like television or friends have the most significant influence. Discuss both views and give your own opinion.",
    meta: 'Saudi Arabia · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that parents have the most important role in a child's development, others claim that outside influences such as television and friends matter more. Both points of view will be elaborated on before elaborating on the reasons why I believe that parents remain the most influential factor.", thai: 'ในขณะที่บางคนโต้แย้งว่าพ่อแม่มีบทบาทสำคัญที่สุดต่อพัฒนาการของเด็ก คนอื่น ๆ กลับอ้างว่าอิทธิพลภายนอก เช่น โทรทัศน์และเพื่อน สำคัญกว่า มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าพ่อแม่ยังคงเป็นปัจจัยที่มีอิทธิพลมากที่สุด' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that outside influences such as television and friends shape children more than parents do. To explain this simply, this is because children spend a considerable amount of time consuming media and interacting with peers outside parental supervision. For example, a 2020 Ofcom report found that children in the UK aged eight to eleven spend over 13 hours per week watching online video content.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าอิทธิพลภายนอก เช่น โทรทัศน์และเพื่อน หล่อหลอมเด็กมากกว่าพ่อแม่ เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่าเด็กใช้เวลาจำนวนมากในการเสพสื่อและมีปฏิสัมพันธ์กับเพื่อนวัยเดียวกันนอกเหนือการดูแลของพ่อแม่ ยกตัวอย่างเช่น รายงานของ Ofcom ปี 2020 พบว่าเด็กในสหราชอาณาจักรอายุแปดถึงสิบเอ็ดปีใช้เวลามากกว่า 13 ชั่วโมงต่อสัปดาห์ในการดูวิดีโอออนไลน์' },
      { role: 'body2', text: "However, some might argue that parents remain the most important influence on a child's development. To put it simply, this is due to the fact that parents shape a child's earliest values, habits, and emotional security long before outside influences take hold. For instance, children raised in emotionally supportive households consistently show stronger academic and social outcomes according to long-term developmental research.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าพ่อแม่ยังคงเป็นอิทธิพลที่สำคัญที่สุดต่อพัฒนาการของเด็ก พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าพ่อแม่หล่อหลอมค่านิยม นิสัย และความมั่นคงทางอารมณ์แรกเริ่มของเด็ก นานก่อนที่อิทธิพลภายนอกจะเข้ามามีบทบาท ยกตัวอย่างเช่น เด็กที่เติบโตในครอบครัวที่สนับสนุนทางอารมณ์แสดงผลลัพธ์ทางวิชาการและสังคมที่แข็งแกร่งกว่าอย่างสม่ำเสมอ ตามงานวิจัยด้านพัฒนาการระยะยาว' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that parents remain the most significant influence on child development. My reasoning is that parents largely control which friends, schools, and media their children are exposed to during formative years. To illustrate, parents who actively limit screen time and encourage reading often raise children with noticeably stronger language skills by primary school age.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าพ่อแม่ยังคงเป็นอิทธิพลที่สำคัญที่สุดต่อพัฒนาการของเด็ก เหตุผลของผมคือ พ่อแม่ควบคุมเป็นส่วนใหญ่ว่าลูก ๆ ของตนจะได้พบเพื่อน โรงเรียน และสื่อแบบใดในช่วงวัยที่กำลังก่อร่างสร้างตัว ยกตัวอย่างเพื่อประกอบ พ่อแม่ที่จำกัดเวลาหน้าจอและสนับสนุนการอ่านหนังสืออย่างจริงจัง มักเลี้ยงลูกที่มีทักษะทางภาษาแข็งแกร่งกว่าอย่างเห็นได้ชัดเมื่อถึงวัยประถมศึกษา' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that television and friends increasingly shape children's attitudes, I am of the opinion that parents remain the single most important influence on a child's development.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าโทรทัศน์และเพื่อนมีบทบาทในการหล่อหลอมทัศนคติของเด็กมากขึ้นเรื่อย ๆ ผมมีความเห็นว่าพ่อแม่ยังคงเป็นอิทธิพลที่สำคัญที่สุดเพียงหนึ่งเดียวต่อพัฒนาการของเด็ก' }
    ],
    vocab: [
      { word: "parental supervision", thaiMeaning: "การดูแลของผู้ปกครอง" },
      { word: "emotional security", thaiMeaning: "ความมั่นคงทางอารมณ์" },
      { word: "developmental research", thaiMeaning: "งานวิจัยด้านพัฒนาการ" },
      { word: "formative years", thaiMeaning: "ช่วงวัยที่หล่อหลอมบุคลิกภาพ" },
      { word: "outside influences", thaiMeaning: "อิทธิพลจากภายนอก" },
      { word: "child's development", thaiMeaning: "พัฒนาการของเด็ก" },
      { word: "consuming media", thaiMeaning: "การบริโภคสื่อ" },
      { word: "interacting with peers", thaiMeaning: "การปฏิสัมพันธ์กับเพื่อน" },
      { word: "online video content", thaiMeaning: "เนื้อหาวิดีโอออนไลน์" },
      { word: "earliest values", thaiMeaning: "ค่านิยมตั้งแต่แรกเริ่ม" },
      { word: "supportive households", thaiMeaning: "ครัวเรือนที่ให้การสนับสนุน" },
      { word: "social outcomes", thaiMeaning: "ผลลัพธ์ทางสังคม" },
      { word: "screen time", thaiMeaning: "เวลาหน้าจอ" },
      { word: "language skills", thaiMeaning: "ทักษะทางภาษา" },
      { word: "primary school age", thaiMeaning: "วัยประถมศึกษา" },
      { word: "influential factor", thaiMeaning: "ปัจจัยที่มีอิทธิพล" },
      { word: "encourage reading", thaiMeaning: "ส่งเสริมการอ่าน" },
      { word: "children's attitudes", thaiMeaning: "ทัศนคติของเด็ก" },
      { word: "considerable amount of time", thaiMeaning: "เวลาเป็นจำนวนมาก" },
      { word: "most significant influence", thaiMeaning: "อิทธิพลที่สำคัญที่สุด" },
      { word: "most important role", thaiMeaning: "บทบาทที่สำคัญที่สุด" },
      { word: "television and friends", thaiMeaning: "โทรทัศน์และเพื่อน" },
      { word: "children in the UK aged eight to eleven", thaiMeaning: "เด็กในสหราชอาณาจักรอายุแปดถึงสิบเอ็ดปี" },
      { word: "over 13 hours per week", thaiMeaning: "กว่า 13 ชั่วโมงต่อสัปดาห์" },
      { word: "take hold", thaiMeaning: "เริ่มฝังราก" },
      { word: "largely control which friends", thaiMeaning: "ควบคุมเป็นส่วนใหญ่ว่าเพื่อนคนใด" },
      { word: "friends, schools, and media their children are exposed to", thaiMeaning: "เพื่อน โรงเรียน และสื่อที่ลูกได้สัมผัส" },
      { word: "single most important influence", thaiMeaning: "อิทธิพลที่สำคัญที่สุดเพียงหนึ่งเดียว" },
      { word: "2020 Ofcom report", thaiMeaning: "รายงานของออฟคอมปี 2020" },
      { word: "remain the most important influence", thaiMeaning: "ยังคงเป็นอิทธิพลที่สำคัญที่สุด" },
      { word: "noticeably stronger", thaiMeaning: "แข็งแรงขึ้นอย่างเห็นได้ชัด" },
      { word: "shape children more than parents", thaiMeaning: "หล่อหลอมเด็กมากกว่าพ่อแม่" }
    ]
  },
  {
    id: 't2-dbv-14',
    number: 14,
    typeId: 'discuss-both-views',
    title: 'Dangerous Sports: Ban or Allow Choice?',
    questionText:
      'Some people think that dangerous sports should be banned. While others think that people should be free to choose their sport. Discuss both views and give your own opinion.',
    meta: 'Canada · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that dangerous sports should be banned, others claim that people should remain free to choose which sports they play. Both points of view will be elaborated on before elaborating on the reasons why I believe that personal freedom should ultimately be protected.", thai: 'ในขณะที่บางคนโต้แย้งว่ากีฬาอันตรายควรถูกห้าม คนอื่น ๆ กลับอ้างว่าผู้คนควรมีอิสระที่จะเลือกเล่นกีฬาชนิดใดก็ได้ มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าเสรีภาพส่วนบุคคลควรได้รับการปกป้องในท้ายที่สุด' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that dangerous sports should be banned altogether. To explain this simply, this is because high-risk activities such as base jumping or free solo climbing carry a genuine risk of severe injury or death. For example, mountain rescue teams in the Swiss Alps respond to hundreds of extreme sports accidents every year.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่ากีฬาอันตรายควรถูกห้ามโดยสิ้นเชิง เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่ากิจกรรมที่มีความเสี่ยงสูง เช่น การกระโดดร่มจากที่สูง (base jumping) หรือการปีนหน้าผาแบบไม่มีอุปกรณ์ป้องกัน มีความเสี่ยงที่แท้จริงต่อการบาดเจ็บสาหัสหรือเสียชีวิต ยกตัวอย่างเช่น ทีมกู้ภัยบนภูเขาในเทือกเขาแอลป์ของสวิตเซอร์แลนด์ตอบสนองต่ออุบัติเหตุจากกีฬาผาดโผนหลายร้อยครั้งทุกปี' },
      { role: 'body2', text: "However, some might argue that people should be free to choose whichever sports they wish to play. To put it simply, this is due to the fact that adults are capable of assessing personal risk and should not have that choice removed by the state. For instance, professional boxing remains legal in most countries despite its well-documented health risks, reflecting respect for individual choice.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าผู้คนควรมีอิสระที่จะเลือกเล่นกีฬาชนิดใดก็ได้ที่ตนต้องการ พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าผู้ใหญ่มีความสามารถในการประเมินความเสี่ยงส่วนบุคคล และไม่ควรถูกรัฐพรากทางเลือกนั้นไป ยกตัวอย่างเช่น มวยสากลอาชีพยังคงถูกกฎหมายในประเทศส่วนใหญ่ แม้จะมีความเสี่ยงต่อสุขภาพที่ได้รับการบันทึกไว้เป็นอย่างดี สะท้อนถึงการเคารพสิทธิ์ในการเลือกของแต่ละบุคคล' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that personal freedom to choose one's sport should be protected. My reasoning is that banning dangerous sports rarely eliminates the activity but instead pushes participants toward unregulated and less safe alternatives. To illustrate, countries that heavily restrict extreme sports often see enthusiasts travel abroad or practice informally without proper safety equipment or supervision.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าเสรีภาพส่วนบุคคลในการเลือกกีฬาของตนเองควรได้รับการปกป้อง เหตุผลของผมคือ การห้ามกีฬาอันตรายแทบไม่เคยขจัดกิจกรรมนั้นออกไป แต่กลับผลักดันให้ผู้เล่นหันไปหาทางเลือกที่ไม่ได้รับการควบคุมและปลอดภัยน้อยกว่า ยกตัวอย่างเพื่อประกอบ ประเทศที่จำกัดกีฬาผาดโผนอย่างเข้มงวดมักเห็นผู้ที่ชื่นชอบเดินทางไปต่างประเทศหรือฝึกฝนอย่างไม่เป็นทางการโดยไม่มีอุปกรณ์ความปลอดภัยหรือการดูแลที่เหมาะสม' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that dangerous sports carry serious risks, I am of the opinion that individuals should retain the freedom to choose which sports they participate in.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่ากีฬาอันตรายมีความเสี่ยงร้ายแรง ผมมีความเห็นว่าปัจเจกบุคคลควรคงไว้ซึ่งเสรีภาพในการเลือกว่าจะเล่นกีฬาชนิดใด' }
    ],
    vocab: [
      { word: "high-risk activities", thaiMeaning: "กิจกรรมที่มีความเสี่ยงสูง" },
      { word: "personal risk", thaiMeaning: "ความเสี่ยงส่วนบุคคล" },
      { word: "individual choice", thaiMeaning: "ทางเลือกส่วนบุคคล" },
      { word: "safety equipment", thaiMeaning: "อุปกรณ์ความปลอดภัย" },
      { word: "dangerous sports", thaiMeaning: "กีฬาอันตราย" },
      { word: "personal freedom", thaiMeaning: "เสรีภาพส่วนบุคคล" },
      { word: "severe injury", thaiMeaning: "การบาดเจ็บสาหัส" },
      { word: "extreme sports", thaiMeaning: "กีฬาสุดขั้ว" },
      { word: "mountain rescue teams", thaiMeaning: "ทีมกู้ภัยบนภูเขา" },
      { word: "health risks", thaiMeaning: "ความเสี่ยงต่อสุขภาพ" },
      { word: "less safe alternatives", thaiMeaning: "ทางเลือกที่ปลอดภัยน้อยกว่า" },
      { word: "serious risks", thaiMeaning: "ความเสี่ยงร้ายแรง" },
      { word: "base jumping", thaiMeaning: "เบสจัมพ์ปิ้ง" },
      { word: "free solo climbing", thaiMeaning: "การปีนเขาแบบไม่มีเชือก" },
      { word: "professional boxing", thaiMeaning: "มวยอาชีพ" },
      { word: "well-documented", thaiMeaning: "มีเอกสารหลักฐานชัดเจน" },
      { word: "practice informally", thaiMeaning: "ฝึกแบบไม่เป็นทางการ" },
      { word: "retain the freedom", thaiMeaning: "รักษาเสรีภาพไว้" },
      { word: "banned altogether", thaiMeaning: "ถูกห้ามโดยสิ้นเชิง" },
      { word: "genuine risk", thaiMeaning: "ความเสี่ยงที่แท้จริง" },
      { word: "people should remain free to choose which sports they play", thaiMeaning: "ผู้คนควรมีเสรีภาพในการเลือกกีฬาที่จะเล่น" },
      { word: "ultimately be protected", thaiMeaning: "ควรได้รับการคุ้มครองในท้ายที่สุด" },
      { word: "injury or death", thaiMeaning: "การบาดเจ็บหรือความตาย" },
      { word: "in the Swiss Alps", thaiMeaning: "ในเทือกเขาแอลป์สวิตเซอร์แลนด์" },
      { word: "sports accidents every year", thaiMeaning: "อุบัติเหตุจากกีฬาทุกปี" },
      { word: "free to choose whichever sports they wish to play", thaiMeaning: "มีเสรีภาพเลือกกีฬาใดก็ได้ที่ต้องการเล่น" },
      { word: "choice removed by the state", thaiMeaning: "ทางเลือกที่ถูกรัฐตัดไป" },
      { word: "rarely eliminates the activity", thaiMeaning: "แทบไม่สามารถกำจัดกิจกรรมนั้นได้" },
      { word: "pushes participants toward unregulated", thaiMeaning: "ผลักผู้เข้าร่วมไปสู่กิจกรรมที่ไม่มีกฎกำกับ" },
      { word: "enthusiasts travel abroad", thaiMeaning: "ผู้ชื่นชอบเดินทางไปต่างประเทศ" },
      { word: "which sports they participate in", thaiMeaning: "กีฬาใดที่พวกเขาเข้าร่วม" },
      { word: "remains legal in most countries", thaiMeaning: "ยังถูกกฎหมายในประเทศส่วนใหญ่" }
    ]
  },
  {
    id: 't2-dbv-15',
    number: 15,
    typeId: 'discuss-both-views',
    title: 'Routine vs. Embracing Change',
    questionText:
      'Some people prefer to spend their lives doing the same things and avoiding change. Others, however, think that change is always a good thing. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      { role: 'intro', text: "While it is argued by some that people should stick to familiar routines and avoid change, others claim that change is always beneficial. Both points of view will be elaborated on before elaborating on the reasons why I believe that embracing change generally leads to better outcomes.", thai: 'ในขณะที่บางคนโต้แย้งว่าผู้คนควรยึดติดกับกิจวัตรที่คุ้นเคยและหลีกเลี่ยงการเปลี่ยนแปลง คนอื่น ๆ กลับอ้างว่าการเปลี่ยนแปลงเป็นสิ่งที่ดีเสมอ มุมมองทั้งสองจะถูกอธิบายก่อนที่จะอธิบายเหตุผลว่าทำไมผมจึงเชื่อว่าการยอมรับการเปลี่ยนแปลงโดยทั่วไปนำไปสู่ผลลัพธ์ที่ดีกว่า' },
      { role: 'body1', text: "To begin with, it might seem sensible for some to claim that avoiding change and maintaining familiar routines is the wiser approach to life. To explain this simply, this is because stable routines reduce uncertainty and allow people to feel secure in their daily responsibilities. For example, many long-serving employees at companies such as Toyota remain in the same role for decades, valuing the stability this provides.", thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าการหลีกเลี่ยงการเปลี่ยนแปลงและรักษากิจวัตรที่คุ้นเคยเป็นแนวทางที่ฉลาดกว่าในการใช้ชีวิต เพื่ออธิบายอย่างง่าย ๆ นี่เป็นเพราะว่ากิจวัตรที่มั่นคงลดความไม่แน่นอนและทำให้ผู้คนรู้สึกมั่นคงในความรับผิดชอบประจำวันของตน ยกตัวอย่างเช่น พนักงานที่ทำงานมานานหลายคนในบริษัทอย่างโตโยต้ายังคงอยู่ในตำแหน่งเดิมมาหลายทศวรรษ โดยให้คุณค่ากับความมั่นคงที่สิ่งนี้มอบให้' },
      { role: 'body2', text: "However, some might argue that change is always a good thing. To put it simply, this is due to the fact that new experiences and challenges push individuals to develop skills they would never otherwise acquire. For instance, a 2015 Harvard Business Review study found that employees who regularly changed roles within a company showed measurably faster skill development than those who did not.", thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าการเปลี่ยนแปลงเป็นสิ่งที่ดีเสมอ พูดง่าย ๆ ก็คือ นี่เป็นเพราะว่าประสบการณ์และความท้าทายใหม่ ๆ ผลักดันให้บุคคลพัฒนาทักษะที่พวกเขาจะไม่มีวันได้รับมาด้วยวิธีอื่น ยกตัวอย่างเช่น การศึกษาของ Harvard Business Review ปี 2015 พบว่าพนักงานที่เปลี่ยนตำแหน่งภายในบริษัทอย่างสม่ำเสมอแสดงพัฒนาการทางทักษะที่รวดเร็วกว่าอย่างวัดผลได้ เมื่อเทียบกับผู้ที่ไม่ได้เปลี่ยน' },
      { role: 'body3', text: "Personally, I would argue in favor of the idea that embracing change generally produces better long-term outcomes. My reasoning is that industries and technologies evolve constantly, meaning individuals who resist change risk becoming professionally outdated. To illustrate, workers who retrained in digital skills during the rise of automation found new career opportunities that colleagues resistant to change often missed.", thai: 'สำหรับตัวผมเอง ผมขอสนับสนุนแนวคิดที่ว่าการยอมรับการเปลี่ยนแปลงโดยทั่วไปให้ผลลัพธ์ระยะยาวที่ดีกว่า เหตุผลของผมคือ อุตสาหกรรมและเทคโนโลยีมีการพัฒนาอยู่ตลอดเวลา ซึ่งหมายความว่าบุคคลที่ต่อต้านการเปลี่ยนแปลงมีความเสี่ยงที่จะล้าหลังทางวิชาชีพ ยกตัวอย่างเพื่อประกอบ คนงานที่ฝึกทักษะดิจิทัลใหม่ในช่วงที่ระบบอัตโนมัติเพิ่มขึ้น พบโอกาสอาชีพใหม่ ๆ ที่เพื่อนร่วมงานที่ต่อต้านการเปลี่ยนแปลงมักพลาดไป' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that stable routines offer valuable comfort and security, I am of the opinion that embracing change ultimately leads to greater personal and professional growth.", thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่ากิจวัตรที่มั่นคงมอบความสบายใจและความมั่นคงที่มีคุณค่า ผมมีความเห็นว่าการยอมรับการเปลี่ยนแปลงในท้ายที่สุดนำไปสู่การเติบโตส่วนบุคคลและทางวิชาชีพที่มากกว่า' }
    ],
    vocab: [
      { word: "familiar routines", thaiMeaning: "กิจวัตรที่คุ้นเคย" },
      { word: "skill development", thaiMeaning: "การพัฒนาทักษะ" },
      { word: "career opportunities", thaiMeaning: "โอกาสในหน้าที่การงาน" },
      { word: "professional growth", thaiMeaning: "ความก้าวหน้าในสายอาชีพ" },
      { word: "embracing change", thaiMeaning: "การเปิดรับการเปลี่ยนแปลง" },
      { word: "stable routines", thaiMeaning: "กิจวัตรที่มั่นคง" },
      { word: "daily responsibilities", thaiMeaning: "หน้าที่ประจำวัน" },
      { word: "long-serving employees", thaiMeaning: "พนักงานที่ทำงานมานาน" },
      { word: "new experiences", thaiMeaning: "ประสบการณ์ใหม่" },
      { word: "professionally outdated", thaiMeaning: "ล้าสมัยในสายอาชีพ" },
      { word: "digital skills", thaiMeaning: "ทักษะดิจิทัล" },
      { word: "rise of automation", thaiMeaning: "การเพิ่มขึ้นของระบบอัตโนมัติ" },
      { word: "better outcomes", thaiMeaning: "ผลลัพธ์ที่ดีกว่า" },
      { word: "reduce uncertainty", thaiMeaning: "ลดความไม่แน่นอน" },
      { word: "resist change", thaiMeaning: "ต่อต้านการเปลี่ยนแปลง" },
      { word: "valuable comfort", thaiMeaning: "ความสะดวกสบายที่มีค่า" },
      { word: "avoiding change", thaiMeaning: "การหลีกเลี่ยงการเปลี่ยนแปลง" },
      { word: "wiser approach", thaiMeaning: "แนวทางที่ฉลาดกว่า" },
      { word: "long-term outcomes", thaiMeaning: "ผลลัพธ์ระยะยาว" },
      { word: "evolve constantly", thaiMeaning: "พัฒนาอย่างต่อเนื่อง" },
      { word: "change is always beneficial", thaiMeaning: "การเปลี่ยนแปลงเป็นประโยชน์เสมอ" },
      { word: "companies such as Toyota", thaiMeaning: "บริษัทอย่างโตโยต้า" },
      { word: "allow people to feel secure", thaiMeaning: "ช่วยให้ผู้คนรู้สึกมั่นคง" },
      { word: "remain in the same role for decades", thaiMeaning: "อยู่ในตำแหน่งเดิมเป็นเวลาหลายทศวรรษ" },
      { word: "valuing the stability this provides", thaiMeaning: "ให้คุณค่ากับความมั่นคงที่ได้รับ" },
      { word: "change is always a good thing", thaiMeaning: "การเปลี่ยนแปลงเป็นสิ่งที่ดีเสมอ" },
      { word: "push individuals to develop skills", thaiMeaning: "ผลักดันให้บุคคลพัฒนาทักษะ" },
      { word: "would never otherwise acquire", thaiMeaning: "มิฉะนั้นจะไม่มีโอกาสได้มา" },
      { word: "regularly changed roles within a company", thaiMeaning: "เปลี่ยนบทบาทภายในบริษัทอย่างสม่ำเสมอ" },
      { word: "Harvard Business Review study", thaiMeaning: "การศึกษาของฮาร์วาร์ดบิซิเนสรีวิว" },
      { word: "industries and technologies", thaiMeaning: "อุตสาหกรรมและเทคโนโลยี" },
      { word: "colleagues resistant to change often missed", thaiMeaning: "เพื่อนร่วมงานที่ต่อต้านการเปลี่ยนแปลงมักพลาดไป" }
    ]
  },

  // ── Advantages & Disadvantages ──────────────────────────────────────
  {
    id: 't2-ad-1',
    number: 1,
    typeId: 'advantages-disadvantages',
    title: 'Hosting a Major Sporting Event',
    questionText:
      'Hosting major international sporting events, such as the Olympic Games, brings both benefits and drawbacks to the host country. Do the benefits outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while hosting a major international sporting event is both beneficial and detrimental for the host country, this essay argues that the benefits are far greater than the drawbacks.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การเป็นเจ้าภาพจัดงานกีฬานานาชาติครั้งใหญ่จะทั้งเป็นประโยชน์และเป็นโทษต่อประเทศเจ้าภาพ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with hosting a major sporting event. The first benefit is that it brings significant economic growth through tourism and infrastructure investment, creating thousands of new jobs in the process. For example, the 2012 London Olympics attracted more than 320,000 additional overseas visitors and generated billions of pounds in tourism revenue. Another advantage is that it raises the host country's international profile and national pride. For instance, South Korea's hosting of the 2018 Winter Olympics in Pyeongchang significantly boosted the nation's global recognition as a modern, capable host.",
        thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการเป็นเจ้าภาพจัดงานกีฬาครั้งใหญ่ ประโยชน์ประการแรกคือ งานดังกล่าวนำมาซึ่งการเติบโตทางเศรษฐกิจอย่างมีนัยสำคัญผ่านการท่องเที่ยวและการลงทุนด้านโครงสร้างพื้นฐาน ซึ่งสร้างงานใหม่นับพันตำแหน่งไปพร้อมกัน ตัวอย่างเช่น การแข่งขันกีฬาโอลิมปิกลอนดอนปี 2012 ดึงดูดนักท่องเที่ยวต่างชาติเพิ่มขึ้นกว่า 320,000 คน และสร้างรายได้จากการท่องเที่ยวหลายพันล้านปอนด์ ข้อดีอีกประการหนึ่งคือ งานดังกล่าวช่วยยกระดับภาพลักษณ์ในระดับนานาชาติและความภาคภูมิใจของชาติของประเทศเจ้าภาพ ยกตัวอย่างเช่น การที่เกาหลีใต้เป็นเจ้าภาพจัดการแข่งขันกีฬาโอลิมปิกฤดูหนาวปี 2018 ที่เมืองพยองชาง ได้ช่วยเพิ่มการยอมรับในระดับโลกของประเทศในฐานะเจ้าภาพที่ทันสมัยและมีศักยภาพอย่างมีนัยสำคัญ'
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the high cost of hosting such events. This is because building new stadiums and facilities often requires enormous public spending. To illustrate, Brazil spent an estimated 13 billion dollars preparing for the 2016 Rio Olympics, much of which came from public funds. However, this argument is simply invalid given that many host cities recover these costs through long-term tourism and improved infrastructure. For example, Barcelona's 1992 Olympic investment transformed the city into one of Europe's most visited tourist destinations for decades afterward.",
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับค่าใช้จ่ายที่สูงในการเป็นเจ้าภาพจัดงานดังกล่าว ทั้งนี้เพราะการก่อสร้างสนามกีฬาและสิ่งอำนวยความสะดวกใหม่มักต้องใช้เงินภาครัฐจำนวนมหาศาล ยกตัวอย่างเช่น บราซิลใช้จ่ายเงินประมาณ 13,000 ล้านดอลลาร์ในการเตรียมการสำหรับโอลิมปิกริโอปี 2016 ซึ่งส่วนใหญ่มาจากเงินภาครัฐ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากเมืองเจ้าภาพหลายแห่งสามารถดึงเงินลงทุนดังกล่าวกลับคืนมาได้ผ่านการท่องเที่ยวในระยะยาวและโครงสร้างพื้นฐานที่ดีขึ้น ตัวอย่างเช่น การลงทุนด้านโอลิมปิกของบาร์เซโลนาในปี 1992 ได้เปลี่ยนเมืองนี้ให้กลายเป็นหนึ่งในจุดหมายปลายทางท่องเที่ยวที่มีผู้เยี่ยมชมมากที่สุดแห่งหนึ่งของยุโรปต่อเนื่องเป็นเวลาหลายทศวรรษหลังจากนั้น'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial burden of hosting a major sporting event, I am of the opinion that the benefits, including economic growth and international recognition, are far greater than the drawbacks.",
        thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของภาระทางการเงินจากการเป็นเจ้าภาพจัดงานกีฬาครั้งใหญ่ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ต่างๆ ซึ่งรวมถึงการเติบโตทางเศรษฐกิจและการได้รับการยอมรับในระดับนานาชาติ มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "host country's international profile", thaiMeaning: "ภาพลักษณ์นานาชาติของประเทศเจ้าภาพ" },
      { word: "major international sporting event", thaiMeaning: "การแข่งขันกีฬานานาชาติครั้งใหญ่" },
      { word: "creating thousands of new jobs", thaiMeaning: "การสร้างงานใหม่นับพันตำแหน่ง" },
      { word: "additional overseas visitors", thaiMeaning: "นักท่องเที่ยวต่างชาติเพิ่มเติม" },
      { word: "new stadiums and facilities", thaiMeaning: "สนามกีฬาและสิ่งอำนวยความสะดวกใหม่" },
      { word: "significant economic growth", thaiMeaning: "การเติบโตทางเศรษฐกิจอย่างมีนัยสำคัญ" },
      { word: "infrastructure investment", thaiMeaning: "การลงทุนโครงสร้างพื้นฐาน" },
      { word: "international recognition", thaiMeaning: "การยอมรับในระดับนานาชาติ" },
      { word: "improved infrastructure", thaiMeaning: "โครงสร้างพื้นฐานที่ดีขึ้น" },
      { word: "high cost of hosting", thaiMeaning: "ต้นทุนสูงของการเป็นเจ้าภาพ" },
      { word: "tourist destinations", thaiMeaning: "แหล่งท่องเที่ยว" },
      { word: "billions of pounds", thaiMeaning: "เงินหลายพันล้านปอนด์" },
      { word: "global recognition", thaiMeaning: "การยอมรับระดับโลก" },
      { word: "Olympic investment", thaiMeaning: "การลงทุนในโอลิมปิก" },
      { word: "long-term tourism", thaiMeaning: "การท่องเที่ยวในระยะยาว" },
      { word: "financial burden", thaiMeaning: "ภาระทางการเงิน" },
      { word: "public spending", thaiMeaning: "การใช้จ่ายภาครัฐ" },
      { word: "tourism revenue", thaiMeaning: "รายได้จากการท่องเที่ยว" },
      { word: "national pride", thaiMeaning: "ความภาคภูมิใจของชาติ" },
      { word: "public funds", thaiMeaning: "เงินทุนภาครัฐ" },
      { word: "hosting a major sporting event", thaiMeaning: "การเป็นเจ้าภาพการแข่งขันกีฬาครั้งใหญ่" },
      { word: "2012 London Olympics", thaiMeaning: "โอลิมปิกลอนดอนปี 2012" },
      { word: "Winter Olympics in Pyeongchang", thaiMeaning: "โอลิมปิกฤดูหนาวที่พย็องชัง" },
      { word: "2016 Rio Olympics", thaiMeaning: "โอลิมปิกริโอปี 2016" },
      { word: "modern, capable host", thaiMeaning: "เจ้าภาพที่ทันสมัยและมีความสามารถ" },
      { word: "estimated 13 billion dollars", thaiMeaning: "ประมาณ 1.3 หมื่นล้านดอลลาร์" },
      { word: "recover these costs", thaiMeaning: "ชดเชยต้นทุนเหล่านี้" },
      { word: "host cities", thaiMeaning: "เมืองเจ้าภาพ" },
      { word: "transformed the city", thaiMeaning: "เปลี่ยนแปลงเมือง" },
      { word: "decades afterward", thaiMeaning: "หลายทศวรรษหลังจากนั้น" },
      { word: "Europe's most visited", thaiMeaning: "ที่มีผู้เยี่ยมชมมากที่สุดในยุโรป" },
      { word: "significantly boosted", thaiMeaning: "เพิ่มพูนอย่างมาก" }
    ]
  },
  {
    id: 't2-ad-2',
    number: 2,
    typeId: 'advantages-disadvantages',
    title: 'An Ageing Population',
    questionText:
      'In many countries, the population is ageing. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while an ageing population is both beneficial and detrimental for society, this essay argues that the benefits are far greater than the drawbacks.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้สังคมผู้สูงอายุจะทั้งเป็นประโยชน์และเป็นโทษต่อสังคม แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with an ageing population. The first benefit is that older citizens bring decades of valuable knowledge and experience to the workforce and community life, helping to train the next generation of workers. For example, many countries now rely on retirees to mentor younger employees, passing on skills that would otherwise be lost. Another advantage is that older generations often provide free childcare, allowing younger family members to remain in full-time employment. For instance, in countries such as Italy, grandparents frequently care for grandchildren while both parents work.",
        thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับสังคมผู้สูงอายุ ประโยชน์ประการแรกคือ ผู้สูงอายุนำความรู้และประสบการณ์อันมีค่าที่สั่งสมมาหลายทศวรรษมาสู่กำลังแรงงานและชีวิตในชุมชน ซึ่งช่วยฝึกฝนแรงงานรุ่นต่อไป ตัวอย่างเช่น หลายประเทศในปัจจุบันพึ่งพาผู้เกษียณอายุในการเป็นพี่เลี้ยงให้แก่พนักงานรุ่นใหม่ ถ่ายทอดทักษะที่มิเช่นนั้นแล้วอาจสูญหายไป ข้อดีอีกประการหนึ่งคือ คนรุ่นก่อนมักให้การดูแลเด็กโดยไม่คิดค่าใช้จ่าย ซึ่งช่วยให้สมาชิกในครอบครัวรุ่นเยาว์สามารถทำงานเต็มเวลาต่อไปได้ ยกตัวอย่างเช่น ในประเทศอย่างอิตาลี ปู่ย่าตายายมักดูแลหลานในขณะที่พ่อแม่ทั้งสองคนทำงาน'
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the financial burden that an ageing population places on public services. This is because pensions and healthcare for elderly citizens require significant government spending. To illustrate, Japan now spends more than a fifth of its national budget on social security for elderly citizens. However, this argument is simply invalid given that many governments can offset these costs by raising retirement ages and encouraging continued employment among older citizens. For example, several European countries have successfully reduced pension costs by gradually raising the retirement age to 67.",
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับภาระทางการเงินที่สังคมผู้สูงอายุสร้างให้แก่บริการสาธารณะ ทั้งนี้เพราะเงินบำนาญและการรักษาพยาบาลสำหรับผู้สูงอายุต้องใช้งบประมาณภาครัฐจำนวนมาก ยกตัวอย่างเช่น ปัจจุบันญี่ปุ่นใช้จ่ายงบประมาณแห่งชาติมากกว่าหนึ่งในห้าไปกับสวัสดิการสังคมสำหรับผู้สูงอายุ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากรัฐบาลหลายประเทศสามารถชดเชยค่าใช้จ่ายเหล่านี้ได้ด้วยการเพิ่มอายุเกษียณและส่งเสริมให้ผู้สูงอายุทำงานต่อไป ตัวอย่างเช่น หลายประเทศในยุโรปสามารถลดค่าใช้จ่ายด้านเงินบำนาญได้สำเร็จด้วยการค่อยๆ เพิ่มอายุเกษียณเป็น 67 ปี'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial cost of an ageing population, I am of the opinion that the benefits of an ageing population, including experience and family support, are far greater than the drawbacks.",
        thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของค่าใช้จ่ายทางการเงินจากสังคมผู้สูงอายุ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของสังคมผู้สูงอายุ ซึ่งรวมถึงประสบการณ์และการสนับสนุนครอบครัว มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "valuable knowledge and experience", thaiMeaning: "ความรู้และประสบการณ์อันมีค่า" },
      { word: "significant government spending", thaiMeaning: "การใช้จ่ายภาครัฐจำนวนมาก" },
      { word: "next generation of workers", thaiMeaning: "คนรุ่นถัดไปในกำลังแรงงาน" },
      { word: "mentor younger employees", thaiMeaning: "การให้คำปรึกษาพนักงานรุ่นใหม่" },
      { word: "continued employment", thaiMeaning: "การทำงานต่อเนื่อง" },
      { word: "full-time employment", thaiMeaning: "การจ้างงานเต็มเวลา" },
      { word: "ageing population", thaiMeaning: "ประชากรสูงวัย" },
      { word: "older generations", thaiMeaning: "คนรุ่นเก่า" },
      { word: "passing on skills", thaiMeaning: "การถ่ายทอดทักษะ" },
      { word: "elderly citizens", thaiMeaning: "ผู้สูงอายุ" },
      { word: "financial burden", thaiMeaning: "ภาระทางการเงิน" },
      { word: "national budget", thaiMeaning: "งบประมาณแห่งชาติ" },
      { word: "public services", thaiMeaning: "บริการสาธารณะ" },
      { word: "social security", thaiMeaning: "ประกันสังคม" },
      { word: "community life", thaiMeaning: "ชีวิตในชุมชน" },
      { word: "family support", thaiMeaning: "การสนับสนุนจากครอบครัว" },
      { word: "free childcare", thaiMeaning: "การเลี้ยงดูเด็กฟรี" },
      { word: "retirement age", thaiMeaning: "อายุเกษียณ" },
      { word: "pension costs", thaiMeaning: "ค่าใช้จ่ายด้านบำนาญ" },
      { word: "workforce", thaiMeaning: "กำลังแรงงาน" },
      { word: "older citizens", thaiMeaning: "พลเมืองสูงอายุ" },
      { word: "younger family members", thaiMeaning: "สมาชิกครอบครัวที่อายุน้อยกว่า" },
      { word: "offset these costs", thaiMeaning: "ชดเชยต้นทุนเหล่านี้" },
      { word: "gradually raising", thaiMeaning: "ค่อยๆ เพิ่ม" },
      { word: "European countries", thaiMeaning: "ประเทศในยุโรป" },
      { word: "financial cost", thaiMeaning: "ต้นทุนทางการเงิน" },
      { word: "pensions and healthcare", thaiMeaning: "บำนาญและการดูแลสุขภาพ" },
      { word: "otherwise be lost", thaiMeaning: "มิฉะนั้นจะสูญหายไป" },
      { word: "care for grandchildren", thaiMeaning: "ดูแลหลาน" },
      { word: "rely on retirees", thaiMeaning: "พึ่งพาผู้เกษียณอายุ" },
      { word: "both parents work", thaiMeaning: "พ่อแม่ทั้งสองทำงาน" },
      { word: "decades of valuable knowledge", thaiMeaning: "ความรู้อันมีค่าหลายทศวรรษ" }
    ]
  },
  {
    id: 't2-ad-3',
    number: 3,
    typeId: 'advantages-disadvantages',
    title: 'Parents Working Abroad',
    questionText:
      'Some parents choose to work abroad and take their families with them. Do the benefits of this outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while parents relocating abroad for work is both beneficial and detrimental for their families, this essay argues that the benefits are far greater than the drawbacks.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การที่พ่อแม่ย้ายไปทำงานต่างประเทศจะทั้งเป็นประโยชน์และเป็นโทษต่อครอบครัวของพวกเขา แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with parents working abroad and bringing their families with them. The first benefit is that children gain exposure to new languages and cultures from an early age. For example, children raised in international schools in cities such as Singapore often become fluent in two or more languages by adulthood. Another advantage is that higher overseas salaries can significantly improve a family's overall standard of living. For instance, many expatriate workers in the Gulf region earn several times what they would earn in their home countries.",
        thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่พ่อแม่ไปทำงานต่างประเทศและพาครอบครัวไปด้วย ประโยชน์ประการแรกคือ เด็กๆ ได้สัมผัสกับภาษาและวัฒนธรรมใหม่ๆ ตั้งแต่วัยเยาว์ ตัวอย่างเช่น เด็กที่เติบโตในโรงเรียนนานาชาติในเมืองอย่างสิงคโปร์มักพูดได้คล่องสองภาษาหรือมากกว่าเมื่อเป็นผู้ใหญ่ ข้อดีอีกประการหนึ่งคือ เงินเดือนที่สูงขึ้นจากการทำงานในต่างประเทศสามารถยกระดับมาตรฐานความเป็นอยู่โดยรวมของครอบครัวได้อย่างมีนัยสำคัญ ยกตัวอย่างเช่น แรงงานต่างชาติจำนวนมากในภูมิภาคอ่าวอาหรับมีรายได้มากกว่าที่พวกเขาจะได้รับในประเทศบ้านเกิดหลายเท่า'
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the disruption this move causes to children's education and social lives. This is because children must adapt to new schools and make new friends, often more than once during their childhood. To illustrate, families who relocate frequently for work may see their children change schools three or four times before finishing secondary education. However, this argument is simply invalid given that international schools are specifically designed to help children adapt quickly, offering strong pastoral support and globally recognised curricula. For example, the International Baccalaureate programme, taught in more than 150 countries, allows students to continue the same curriculum wherever their family relocates.",
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับความปั่นป่วนที่การย้ายถิ่นนี้ก่อให้เกิดต่อการศึกษาและชีวิตทางสังคมของเด็ก ทั้งนี้เพราะเด็กต้องปรับตัวเข้ากับโรงเรียนใหม่และหาเพื่อนใหม่ ซึ่งมักเกิดขึ้นมากกว่าหนึ่งครั้งในช่วงวัยเด็ก ยกตัวอย่างเช่น ครอบครัวที่ย้ายถิ่นบ่อยครั้งเพื่อการทำงานอาจทำให้บุตรหลานต้องเปลี่ยนโรงเรียนสามหรือสี่ครั้งก่อนจะเรียนจบมัธยมศึกษา อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากโรงเรียนนานาชาติถูกออกแบบมาโดยเฉพาะเพื่อช่วยให้เด็กปรับตัวได้อย่างรวดเร็ว โดยมีระบบดูแลนักเรียนที่เข้มแข็งและหลักสูตรที่ได้รับการยอมรับในระดับโลก ตัวอย่างเช่น หลักสูตรอินเตอร์เนชั่นแนลแบคคาลอเรียต (International Baccalaureate) ซึ่งสอนอยู่ในกว่า 150 ประเทศ ช่วยให้นักเรียนสามารถเรียนหลักสูตรเดียวกันต่อเนื่องได้ไม่ว่าครอบครัวจะย้ายไปที่ใด'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the disruption caused to children's education, I am of the opinion that the benefits of relocating abroad for work, including cultural exposure and financial improvement, are far greater than the drawbacks.",
        thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของความปั่นป่วนที่เกิดขึ้นต่อการศึกษาของเด็ก แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการย้ายไปทำงานต่างประเทศ ซึ่งรวมถึงการได้สัมผัสวัฒนธรรมและฐานะทางการเงินที่ดีขึ้น มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "International Baccalaureate programme", thaiMeaning: "หลักสูตร International Baccalaureate" },
      { word: "fluent in two or more languages", thaiMeaning: "พูดได้สองภาษาขึ้นไปอย่างคล่องแคล่ว" },
      { word: "globally recognised curricula", thaiMeaning: "หลักสูตรที่ได้รับการยอมรับทั่วโลก" },
      { word: "new languages and cultures", thaiMeaning: "ภาษาและวัฒนธรรมใหม่" },
      { word: "relocating abroad for work", thaiMeaning: "การย้ายไปทำงานต่างประเทศ" },
      { word: "parents working abroad", thaiMeaning: "ผู้ปกครองที่ไปทำงานต่างประเทศ" },
      { word: "financial improvement", thaiMeaning: "การพัฒนาทางการเงิน" },
      { word: "international schools", thaiMeaning: "โรงเรียนนานาชาติ" },
      { word: "children's education", thaiMeaning: "การศึกษาของเด็ก" },
      { word: "secondary education", thaiMeaning: "การศึกษาระดับมัธยม" },
      { word: "expatriate workers", thaiMeaning: "แรงงานชาวต่างชาติ" },
      { word: "standard of living", thaiMeaning: "มาตรฐานการครองชีพ" },
      { word: "cultural exposure", thaiMeaning: "การสัมผัสวัฒนธรรม" },
      { word: "from an early age", thaiMeaning: "ตั้งแต่อายุยังน้อย" },
      { word: "overseas salaries", thaiMeaning: "เงินเดือนต่างประเทศ" },
      { word: "pastoral support", thaiMeaning: "การดูแลด้านความเป็นอยู่ของนักเรียน" },
      { word: "same curriculum", thaiMeaning: "หลักสูตรเดียวกัน" },
      { word: "home countries", thaiMeaning: "ประเทศต้นทาง" },
      { word: "social lives", thaiMeaning: "ชีวิตทางสังคม" },
      { word: "Gulf region", thaiMeaning: "ภูมิภาคอ่าวอาหรับ" },
      { word: "gain exposure", thaiMeaning: "ได้รับการเปิดรับ" },
      { word: "children raised in", thaiMeaning: "เด็กที่เติบโตใน" },
      { word: "by adulthood", thaiMeaning: "เมื่อเข้าสู่วัยผู้ใหญ่" },
      { word: "adapt to new schools", thaiMeaning: "ปรับตัวเข้ากับโรงเรียนใหม่" },
      { word: "relocate frequently for work", thaiMeaning: "ย้ายที่อยู่บ่อยครั้งเพื่อทำงาน" },
      { word: "specifically designed", thaiMeaning: "ออกแบบมาโดยเฉพาะ" },
      { word: "adapt quickly", thaiMeaning: "ปรับตัวได้อย่างรวดเร็ว" },
      { word: "wherever their family relocates", thaiMeaning: "ไม่ว่าครอบครัวจะย้ายไปที่ใด" },
      { word: "disruption caused", thaiMeaning: "ความขัดข้องที่เกิดขึ้น" },
      { word: "bringing their families with them", thaiMeaning: "พาครอบครัวไปด้วย" },
      { word: "make new friends", thaiMeaning: "หาเพื่อนใหม่" },
      { word: "during their childhood", thaiMeaning: "ในช่วงวัยเด็ก" }
    ]
  },
  {
    id: 't2-ad-4',
    number: 4,
    typeId: 'advantages-disadvantages',
    title: 'International Tourism',
    questionText:
      'International tourism has brought many benefits, but it also has drawbacks for the places tourists visit. Do the benefits of international tourism outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while international tourism is both beneficial and detrimental to the places it affects, this essay argues that the benefits are far greater than the drawbacks.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การท่องเที่ยวระหว่างประเทศจะทั้งเป็นประโยชน์และเป็นโทษต่อสถานที่ที่ได้รับผลกระทบ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with international tourism. The first benefit is that tourism generates substantial income and employment for local communities. For example, tourism accounts for more than 20% of Thailand's total employment, supporting millions of local jobs. Another advantage is that tourism encourages the preservation of local culture and historic sites, as governments invest in maintaining the attractions that draw visitors, creating a cycle of sustained cultural investment. For instance, revenue from tourist entry fees has funded major restoration projects at Cambodia's Angkor Wat temple complex.",
        thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการท่องเที่ยวระหว่างประเทศ ประโยชน์ประการแรกคือ การท่องเที่ยวสร้างรายได้และการจ้างงานจำนวนมากให้แก่ชุมชนท้องถิ่น ตัวอย่างเช่น การท่องเที่ยวคิดเป็นสัดส่วนมากกว่า 20% ของการจ้างงานทั้งหมดในประเทศไทย ซึ่งสนับสนุนงานในท้องถิ่นหลายล้านตำแหน่ง ข้อดีอีกประการหนึ่งคือ การท่องเที่ยวส่งเสริมการอนุรักษ์วัฒนธรรมท้องถิ่นและสถานที่ทางประวัติศาสตร์ เนื่องจากรัฐบาลลงทุนในการดูแลรักษาสถานที่ท่องเที่ยวที่ดึงดูดนักท่องเที่ยว ก่อให้เกิดวงจรการลงทุนด้านวัฒนธรรมอย่างต่อเนื่อง ยกตัวอย่างเช่น รายได้จากค่าเข้าชมของนักท่องเที่ยวได้เป็นทุนสนับสนุนโครงการบูรณะครั้งใหญ่ที่กลุ่มปราสาทนครวัดของกัมพูชา'
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the environmental damage caused by large numbers of tourists. This is because popular destinations often experience pollution, overcrowding, and strain on local infrastructure, particularly during peak holiday seasons. To illustrate, some beaches in Thailand have been forced to close temporarily due to coral reef damage from excessive tourist activity. However, this argument is simply invalid given that responsible tourism management, such as visitor limits and eco-certification schemes, can significantly reduce this damage. For example, Bhutan strictly limits tourist numbers and charges a daily fee that directly funds environmental conservation projects.",
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับความเสียหายต่อสิ่งแวดล้อมที่เกิดจากนักท่องเที่ยวจำนวนมาก ทั้งนี้เพราะสถานที่ท่องเที่ยวยอดนิยมมักประสบปัญหามลพิษ ความแออัด และแรงกดดันต่อโครงสร้างพื้นฐานในท้องถิ่น โดยเฉพาะอย่างยิ่งในช่วงฤดูท่องเที่ยวสูงสุด ยกตัวอย่างเช่น ชายหาดบางแห่งในประเทศไทยถูกบังคับให้ปิดชั่วคราวเนื่องจากความเสียหายของแนวปะการังจากกิจกรรมท่องเที่ยวที่มากเกินไป อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากการบริหารจัดการการท่องเที่ยวอย่างมีความรับผิดชอบ เช่น การจำกัดจำนวนนักท่องเที่ยวและมาตรการรับรองด้านสิ่งแวดล้อม สามารถลดความเสียหายดังกล่าวได้อย่างมีนัยสำคัญ ตัวอย่างเช่น ภูฏานจำกัดจำนวนนักท่องเที่ยวอย่างเข้มงวดและเรียกเก็บค่าธรรมเนียมรายวันซึ่งนำไปใช้สนับสนุนโครงการอนุรักษ์สิ่งแวดล้อมโดยตรง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the environmental impact of tourism, I am of the opinion that the benefits of international tourism, including income and cultural preservation, are far greater than the drawbacks.",
        thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของผลกระทบต่อสิ่งแวดล้อมจากการท่องเที่ยว แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการท่องเที่ยวระหว่างประเทศ ซึ่งรวมถึงรายได้และการอนุรักษ์วัฒนธรรม มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "environmental conservation projects", thaiMeaning: "โครงการอนุรักษ์สิ่งแวดล้อม" },
      { word: "substantial income and employment", thaiMeaning: "รายได้และการจ้างงานจำนวนมาก" },
      { word: "responsible tourism management", thaiMeaning: "การจัดการท่องเที่ยวอย่างรับผิดชอบ" },
      { word: "eco-certification schemes", thaiMeaning: "โครงการรับรองมาตรฐานเชิงนิเวศ" },
      { word: "cultural preservation", thaiMeaning: "การอนุรักษ์วัฒนธรรม" },
      { word: "international tourism", thaiMeaning: "การท่องเที่ยวนานาชาติ" },
      { word: "environmental damage", thaiMeaning: "ความเสียหายต่อสิ่งแวดล้อม" },
      { word: "environmental impact", thaiMeaning: "ผลกระทบต่อสิ่งแวดล้อม" },
      { word: "local infrastructure", thaiMeaning: "โครงสร้างพื้นฐานในท้องถิ่น" },
      { word: "peak holiday seasons", thaiMeaning: "ช่วงฤดูท่องเที่ยวสูงสุด" },
      { word: "restoration projects", thaiMeaning: "โครงการบูรณะ" },
      { word: "cultural investment", thaiMeaning: "การลงทุนทางวัฒนธรรม" },
      { word: "tourist entry fees", thaiMeaning: "ค่าเข้าชมสถานที่ท่องเที่ยว" },
      { word: "coral reef damage", thaiMeaning: "ความเสียหายต่อแนวปะการัง" },
      { word: "local communities", thaiMeaning: "ชุมชนท้องถิ่น" },
      { word: "total employment", thaiMeaning: "การจ้างงานทั้งหมด" },
      { word: "historic sites", thaiMeaning: "สถานที่ทางประวัติศาสตร์" },
      { word: "visitor limits", thaiMeaning: "การจำกัดจำนวนนักท่องเที่ยว" },
      { word: "local culture", thaiMeaning: "วัฒนธรรมท้องถิ่น" },
      { word: "overcrowding", thaiMeaning: "ความแออัด" },
      { word: "supporting millions of local jobs", thaiMeaning: "สนับสนุนงานท้องถิ่นนับล้านตำแหน่ง" },
      { word: "Angkor Wat temple complex", thaiMeaning: "กลุ่มโบราณสถานนครวัด" },
      { word: "large numbers of tourists", thaiMeaning: "นักท่องเที่ยวจำนวนมาก" },
      { word: "popular destinations", thaiMeaning: "แหล่งท่องเที่ยวยอดนิยม" },
      { word: "excessive tourist activity", thaiMeaning: "กิจกรรมนักท่องเที่ยวที่มากเกินไป" },
      { word: "forced to close temporarily", thaiMeaning: "ถูกบังคับให้ปิดชั่วคราว" },
      { word: "strictly limits tourist numbers", thaiMeaning: "จำกัดจำนวนนักท่องเที่ยวอย่างเข้มงวด" },
      { word: "charges a daily fee", thaiMeaning: "เก็บค่าธรรมเนียมรายวัน" },
      { word: "significantly reduce this damage", thaiMeaning: "ลดความเสียหายนี้ได้อย่างมาก" },
      { word: "draw visitors", thaiMeaning: "ดึงดูดนักท่องเที่ยว" },
      { word: "maintaining the attractions", thaiMeaning: "การดูแลรักษาสถานที่ท่องเที่ยว" },
      { word: "directly funds", thaiMeaning: "ให้ทุนโดยตรง" }
    ]
  },
  {
    id: 't2-ad-5',
    number: 5,
    typeId: 'advantages-disadvantages',
    title: 'E-books vs. Paper Books',
    questionText:
      'Nowadays, many people prefer to read e-books rather than paper books. Do the benefits of this outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while reading e-books instead of paper books is both beneficial and detrimental, this essay argues that the benefits are far greater than the drawbacks.",
        thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การอ่านหนังสืออิเล็กทรอนิกส์แทนหนังสือกระดาษจะทั้งเป็นประโยชน์และเป็นโทษ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with reading e-books. The first benefit is that e-readers can store thousands of titles in a single lightweight device, making them extremely convenient for travel. For example, a single e-reader weighing under 200 grams can hold an entire personal library of several thousand books. Another advantage is that e-books are typically cheaper than paper books, as they avoid printing and distribution costs. For instance, digital editions of new releases are often priced around 30% lower than their hardcover equivalents, making reading a much cheaper hobby overall.",
        thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการอ่านหนังสืออิเล็กทรอนิกส์ ประโยชน์ประการแรกคือ เครื่องอ่านอีบุ๊กสามารถจัดเก็บหนังสือได้หลายพันเล่มในอุปกรณ์ชิ้นเดียวที่มีน้ำหนักเบา ทำให้สะดวกอย่างยิ่งสำหรับการเดินทาง ตัวอย่างเช่น เครื่องอ่านอีบุ๊กเพียงเครื่องเดียวที่มีน้ำหนักไม่ถึง 200 กรัม สามารถบรรจุห้องสมุดส่วนตัวทั้งหมดที่มีหนังสือหลายพันเล่มได้ ข้อดีอีกประการหนึ่งคือ หนังสืออิเล็กทรอนิกส์มักมีราคาถูกกว่าหนังสือกระดาษ เนื่องจากไม่มีค่าใช้จ่ายด้านการพิมพ์และการจัดจำหน่าย ยกตัวอย่างเช่น หนังสือฉบับดิจิทัลที่วางจำหน่ายใหม่มักมีราคาต่ำกว่าฉบับปกแข็งประมาณ 30% ทำให้การอ่านหนังสือเป็นงานอดิเรกที่มีค่าใช้จ่ายถูกลงมากโดยรวม'
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the loss of the traditional reading experience that paper books provide. This is because many readers associate physical books with better focus and fewer digital distractions, particularly among younger readers. To illustrate, some studies suggest that readers retain information less effectively when reading from a screen. However, this argument is simply invalid given that modern e-readers now use paper-like display technology specifically designed to reduce eye strain and distraction. For example, devices such as the Kindle Paperwhite lack internet browsers entirely, allowing readers to focus solely on their book.",
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับการสูญเสียประสบการณ์การอ่านแบบดั้งเดิมที่หนังสือกระดาษมอบให้ ทั้งนี้เพราะผู้อ่านจำนวนมากเชื่อมโยงหนังสือที่จับต้องได้กับสมาธิที่ดีกว่าและการรบกวนจากสิ่งดิจิทัลที่น้อยกว่า โดยเฉพาะอย่างยิ่งในกลุ่มผู้อ่านที่อายุน้อย ยกตัวอย่างเช่น งานวิจัยบางชิ้นชี้ให้เห็นว่าผู้อ่านจดจำข้อมูลได้อย่างมีประสิทธิภาพน้อยลงเมื่ออ่านจากหน้าจอ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากเครื่องอ่านอีบุ๊กสมัยใหม่ในปัจจุบันใช้เทคโนโลยีจอแสดงผลที่เลียนแบบกระดาษ ซึ่งออกแบบมาโดยเฉพาะเพื่อลดอาการเมื่อยล้าของดวงตาและการรบกวนสมาธิ ตัวอย่างเช่น อุปกรณ์อย่าง Kindle Paperwhite ไม่มีเว็บเบราว์เซอร์เลย ทำให้ผู้อ่านสามารถจดจ่อกับหนังสือของตนได้เพียงอย่างเดียว'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the reading experience offered by paper books, I am of the opinion that the benefits of e-books, including convenience and affordability, are far greater than the drawbacks.",
        thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของประสบการณ์การอ่านที่หนังสือกระดาษมอบให้ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของหนังสืออิเล็กทรอนิกส์ ซึ่งรวมถึงความสะดวกสบายและราคาที่เอื้อมถึงได้ มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "printing and distribution costs", thaiMeaning: "ต้นทุนการพิมพ์และจัดจำหน่าย" },
      { word: "convenience and affordability", thaiMeaning: "ความสะดวกและราคาที่เอื้อมถึง" },
      { word: "paper-like display technology", thaiMeaning: "เทคโนโลยีหน้าจอคล้ายกระดาษ" },
      { word: "focus solely on their book", thaiMeaning: "โฟกัสเฉพาะหนังสือของตน" },
      { word: "single lightweight device", thaiMeaning: "อุปกรณ์น้ำหนักเบาเครื่องเดียว" },
      { word: "hardcover equivalents", thaiMeaning: "หนังสือปกแข็งที่เทียบเท่า" },
      { word: "digital distractions", thaiMeaning: "สิ่งรบกวนทางดิจิทัล" },
      { word: "thousands of titles", thaiMeaning: "หนังสือหลายพันเล่ม" },
      { word: "reading experience", thaiMeaning: "ประสบการณ์การอ่าน" },
      { word: "retain information", thaiMeaning: "จดจำข้อมูล" },
      { word: "internet browsers", thaiMeaning: "เบราว์เซอร์อินเทอร์เน็ต" },
      { word: "digital editions", thaiMeaning: "ฉบับดิจิทัล" },
      { word: "personal library", thaiMeaning: "คลังหนังสือส่วนตัว" },
      { word: "younger readers", thaiMeaning: "นักอ่านวัยเยาว์" },
      { word: "physical books", thaiMeaning: "หนังสือเล่มจริง" },
      { word: "cheaper hobby", thaiMeaning: "งานอดิเรกที่ถูกกว่า" },
      { word: "better focus", thaiMeaning: "สมาธิที่ดีกว่า" },
      { word: "new releases", thaiMeaning: "หนังสือออกใหม่" },
      { word: "paper books", thaiMeaning: "หนังสือกระดาษ" },
      { word: "eye strain", thaiMeaning: "อาการปวดล้าตา" },
      { word: "reading e-books", thaiMeaning: "การอ่านอีบุ๊ก" },
      { word: "extremely convenient for travel", thaiMeaning: "สะดวกอย่างยิ่งสำหรับการเดินทาง" },
      { word: "weighing under 200 grams", thaiMeaning: "น้ำหนักต่ำกว่า 200 กรัม" },
      { word: "several thousand books", thaiMeaning: "หนังสือหลายพันเล่ม" },
      { word: "typically cheaper", thaiMeaning: "โดยทั่วไปถูกกว่า" },
      { word: "reading from a screen", thaiMeaning: "การอ่านจากหน้าจอ" },
      { word: "Kindle Paperwhite", thaiMeaning: "คินเดิล Paperwhite" },
      { word: "modern e-readers", thaiMeaning: "เครื่องอ่านอีบุ๊กรุ่นใหม่" },
      { word: "less effectively", thaiMeaning: "ได้อย่างมีประสิทธิภาพน้อยกว่า" },
      { word: "priced around 30% lower", thaiMeaning: "ราคาถูกกว่าประมาณ 30%" },
      { word: "specifically designed to reduce", thaiMeaning: "ออกแบบมาโดยเฉพาะเพื่อลด" },
      { word: "single e-reader", thaiMeaning: "เครื่องอ่านอีบุ๊กเครื่องเดียว" }
    ]
  },
  {
    id: 't2-ad-6',
    number: 6,
    typeId: 'advantages-disadvantages',
    title: 'Police Officers Carrying Weapons',
    questionText:
      'In some countries, police officers do not carry weapons. Do the benefits of police officers carrying weapons outweigh the drawbacks?',
    meta: 'Saudi Arabia · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while police officers carrying weapons is both beneficial and detrimental to public safety, this essay argues that the benefits are far greater than the drawbacks.", thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การที่เจ้าหน้าที่ตำรวจพกอาวุธจะทั้งเป็นประโยชน์และเป็นโทษต่อความปลอดภัยสาธารณะ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with police officers carrying weapons. The first benefit is that armed officers can respond immediately to violent or life-threatening situations. For example, a 2023 UK Home Office report found that armed response units reduced fatal outcomes in hostage situations by acting within minutes of arrival. Another advantage is that visible weapons act as a strong deterrent against attacks on law enforcement personnel. For instance, countries such as the United States report far fewer assaults on officers in districts where armed patrols are standard practice.", thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่เจ้าหน้าที่ตำรวจพกอาวุธ ประโยชน์ประการแรกคือ เจ้าหน้าที่ที่มีอาวุธสามารถตอบสนองต่อสถานการณ์ที่รุนแรงหรือเป็นอันตรายถึงชีวิตได้ในทันที ตัวอย่างเช่น รายงานของกระทรวงมหาดไทยสหราชอาณาจักรปี 2023 พบว่าหน่วยตอบโต้ที่มีอาวุธสามารถลดจำนวนผู้เสียชีวิตในสถานการณ์จับตัวประกันได้ ด้วยการเข้าปฏิบัติการภายในไม่กี่นาทีหลังมาถึง ข้อดีอีกประการหนึ่งคือ อาวุธที่มองเห็นได้ทำหน้าที่เป็นตัวยับยั้งที่แข็งแกร่งต่อการโจมตีเจ้าหน้าที่บังคับใช้กฎหมาย ยกตัวอย่างเช่น ประเทศอย่างสหรัฐอเมริการายงานว่ามีการทำร้ายเจ้าหน้าที่น้อยลงอย่างมากในเขตพื้นที่ที่การลาดตระเวนพร้อมอาวุธเป็นแนวปฏิบัติมาตรฐาน' },
      { role: 'body2', text: "However, some might be concerned regarding the risk of accidental shootings or excessive use of force. This is because officers under pressure may make split-second errors that lead to tragic outcomes. To illustrate, several widely reported cases in American cities have involved unarmed civilians being mistakenly shot during routine stops. However, this argument is simply invalid given that rigorous training and strict accountability procedures can dramatically reduce such errors. For example, Norway's police force carries weapons only in specific circumstances, combining this restraint with extensive de-escalation training that keeps shooting rates among the lowest in Europe.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับความเสี่ยงของการยิงโดยไม่ได้ตั้งใจหรือการใช้กำลังเกินกว่าเหตุ ทั้งนี้เพราะเจ้าหน้าที่ที่อยู่ภายใต้ความกดดันอาจตัดสินใจผิดพลาดในเสี้ยววินาที ซึ่งนำไปสู่ผลลัพธ์อันน่าเศร้า ยกตัวอย่างเช่น มีหลายกรณีที่ได้รับการรายงานอย่างกว้างขวางในเมืองต่างๆ ของสหรัฐอเมริกาที่พลเรือนผู้ไม่มีอาวุธถูกยิงโดยความเข้าใจผิดระหว่างการตรวจค้นตามปกติ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากการฝึกอบรมอย่างเข้มงวดและมาตรการความรับผิดชอบที่เคร่งครัดสามารถลดความผิดพลาดดังกล่าวได้อย่างมาก ตัวอย่างเช่น กองกำลังตำรวจของนอร์เวย์พกอาวุธเฉพาะในสถานการณ์เฉพาะเจาะจงเท่านั้น โดยผสมผสานความยับยั้งชั่งใจนี้เข้ากับการฝึกอบรมด้านการลดความรุนแรงของสถานการณ์อย่างกว้างขวาง ซึ่งทำให้อัตราการยิงอยู่ในระดับต่ำที่สุดแห่งหนึ่งในยุโรป' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the risk of misuse of force, I am of the opinion that the benefits of police officers carrying weapons, including rapid emergency response and deterrence against attacks, are far greater than the drawbacks.", thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของความเสี่ยงของการใช้กำลังในทางที่ผิด แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการที่เจ้าหน้าที่ตำรวจพกอาวุธ ซึ่งรวมถึงการตอบสนองต่อเหตุฉุกเฉินอย่างรวดเร็วและการยับยั้งการโจมตี มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "life-threatening situations", thaiMeaning: "สถานการณ์ที่คุกคามชีวิต" },
      { word: "accountability procedures", thaiMeaning: "กระบวนการตรวจสอบความรับผิดชอบ" },
      { word: "law enforcement personnel", thaiMeaning: "บุคลากรด้านบังคับใช้กฎหมาย" },
      { word: "rapid emergency response", thaiMeaning: "การตอบสนองเหตุฉุกเฉินอย่างรวดเร็ว" },
      { word: "de-escalation training", thaiMeaning: "การฝึกลดระดับความรุนแรงของสถานการณ์" },
      { word: "excessive use of force", thaiMeaning: "การใช้กำลังเกินกว่าเหตุ" },
      { word: "accidental shootings", thaiMeaning: "การยิงโดยอุบัติเหตุ" },
      { word: "armed response units", thaiMeaning: "หน่วยตอบโต้เหตุด่วนที่มีอาวุธ" },
      { word: "split-second errors", thaiMeaning: "ความผิดพลาดในเสี้ยววินาที" },
      { word: "hostage situations", thaiMeaning: "สถานการณ์ตัวประกัน" },
      { word: "rigorous training", thaiMeaning: "การฝึกอบรมอย่างเข้มงวด" },
      { word: "standard practice", thaiMeaning: "แนวปฏิบัติมาตรฐาน" },
      { word: "unarmed civilians", thaiMeaning: "พลเรือนที่ไม่มีอาวุธ" },
      { word: "tragic outcomes", thaiMeaning: "ผลลัพธ์ที่น่าเศร้า" },
      { word: "armed officers", thaiMeaning: "เจ้าหน้าที่ติดอาวุธ" },
      { word: "fatal outcomes", thaiMeaning: "ผลลัพธ์ถึงแก่ชีวิต" },
      { word: "shooting rates", thaiMeaning: "อัตราการใช้อาวุธยิง" },
      { word: "armed patrols", thaiMeaning: "การลาดตระเวนติดอาวุธ" },
      { word: "public safety", thaiMeaning: "ความปลอดภัยสาธารณะ" },
      { word: "deterrent", thaiMeaning: "สิ่งยับยั้ง/ป้องปราม" },
      { word: "police officers carrying weapons", thaiMeaning: "ตำรวจพกพาอาวุธ" },
      { word: "respond immediately", thaiMeaning: "ตอบสนองทันที" },
      { word: "UK Home Office report", thaiMeaning: "รายงานกระทรวงมหาดไทยสหราชอาณาจักร" },
      { word: "assaults on officers", thaiMeaning: "การทำร้ายเจ้าหน้าที่" },
      { word: "officers under pressure", thaiMeaning: "เจ้าหน้าที่ที่อยู่ภายใต้ความกดดัน" },
      { word: "mistakenly shot", thaiMeaning: "ถูกยิงโดยเข้าใจผิด" },
      { word: "routine stops", thaiMeaning: "การตรวจค้นตามปกติ" },
      { word: "specific circumstances", thaiMeaning: "สถานการณ์เฉพาะ" },
      { word: "misuse of force", thaiMeaning: "การใช้กำลังในทางที่ผิด" },
      { word: "deterrence against attacks", thaiMeaning: "การป้องปรามการโจมตี" },
      { word: "dramatically reduce such errors", thaiMeaning: "ลดข้อผิดพลาดดังกล่าวอย่างมาก" },
      { word: "visible weapons", thaiMeaning: "อาวุธที่มองเห็นได้" }
    ]
  },
  {
    id: 't2-ad-7',
    number: 7,
    typeId: 'advantages-disadvantages',
    title: 'Economic Development and the Loss of Social Values',
    questionText:
      'Nowadays, most countries are improving their standard of living through economic development, but as a result, some social values are lost. Do you think the advantages of this phenomenon outweigh the disadvantages?',
    meta: 'Egypt · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while rapid economic development is both beneficial and detrimental to traditional social values, this essay argues that the benefits are far greater than the drawbacks.", thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การพัฒนาเศรษฐกิจอย่างรวดเร็วจะทั้งเป็นประโยชน์และเป็นโทษต่อคุณค่าทางสังคมแบบดั้งเดิม แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with rapid economic development. The first benefit is that it lifts millions of people out of poverty by creating new employment opportunities. For example, a 2022 World Bank study found that China's economic growth since 1990 helped lift more than 800 million citizens out of extreme poverty. Another advantage is that development brings improved healthcare and education systems to ordinary citizens. For instance, Vietnam's rising national income has funded a nationwide expansion of rural hospitals and public schools over the past two decades.", thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการพัฒนาเศรษฐกิจอย่างรวดเร็ว ประโยชน์ประการแรกคือ การพัฒนาดังกล่าวช่วยยกระดับผู้คนหลายล้านคนให้พ้นจากความยากจนด้วยการสร้างโอกาสในการจ้างงานใหม่ๆ ตัวอย่างเช่น งานวิจัยของธนาคารโลกปี 2022 พบว่าการเติบโตทางเศรษฐกิจของจีนตั้งแต่ปี 1990 ช่วยยกระดับประชาชนกว่า 800 ล้านคนให้พ้นจากความยากจนขั้นรุนแรง ข้อดีอีกประการหนึ่งคือ การพัฒนานำมาซึ่งระบบสาธารณสุขและการศึกษาที่ดีขึ้นสำหรับประชาชนทั่วไป ยกตัวอย่างเช่น รายได้ประชาชาติที่เพิ่มขึ้นของเวียดนามได้เป็นทุนสนับสนุนการขยายโรงพยาบาลในชนบทและโรงเรียนของรัฐทั่วประเทศตลอดสองทศวรรษที่ผ่านมา' },
      { role: 'body2', text: "However, some might be concerned regarding the erosion of traditional customs and family structures. This is because rapid urbanisation often draws young people away from rural communities toward busy city jobs. To illustrate, many villages across Thailand now report shrinking populations, as younger generations move to Bangkok in search of higher wages. However, this argument is simply invalid given that governments can actively preserve cultural heritage while pursuing economic growth. For example, South Korea has combined rapid industrialisation with generous state funding for traditional festivals and heritage sites, ensuring old customs remain visible to younger citizens.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับการเสื่อมถอยของขนบธรรมเนียมดั้งเดิมและโครงสร้างครอบครัว ทั้งนี้เพราะการขยายตัวของเมืองอย่างรวดเร็วมักดึงคนหนุ่มสาวออกจากชุมชนชนบทไปสู่งานในเมืองที่วุ่นวาย ยกตัวอย่างเช่น หมู่บ้านหลายแห่งทั่วประเทศไทยในปัจจุบันรายงานว่าประชากรลดลง เนื่องจากคนรุ่นใหม่ย้ายเข้ากรุงเทพฯ เพื่อหาค่าจ้างที่สูงกว่า อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากรัฐบาลสามารถอนุรักษ์มรดกทางวัฒนธรรมได้อย่างจริงจังควบคู่ไปกับการพัฒนาเศรษฐกิจ ตัวอย่างเช่น เกาหลีใต้ได้ผสมผสานการพัฒนาอุตสาหกรรมอย่างรวดเร็วเข้ากับการสนับสนุนงบประมาณจากรัฐอย่างเอื้อเฟื้อสำหรับเทศกาลดั้งเดิมและแหล่งมรดกทางวัฒนธรรม เพื่อให้แน่ใจว่าขนบธรรมเนียมเก่าแก่ยังคงปรากฏให้เห็นแก่ประชาชนรุ่นใหม่' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the loss of traditional social values, I am of the opinion that the benefits of economic development, including poverty reduction and improved public services, are far greater than the drawbacks.", thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของการสูญเสียคุณค่าทางสังคมแบบดั้งเดิม แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการพัฒนาเศรษฐกิจ ซึ่งรวมถึงการลดความยากจนและการปรับปรุงบริการสาธารณะ มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "healthcare and education systems", thaiMeaning: "ระบบสาธารณสุขและการศึกษา" },
      { word: "rapid economic development", thaiMeaning: "การพัฒนาทางเศรษฐกิจอย่างรวดเร็ว" },
      { word: "traditional social values", thaiMeaning: "ค่านิยมทางสังคมแบบดั้งเดิม" },
      { word: "employment opportunities", thaiMeaning: "โอกาสในการจ้างงาน" },
      { word: "rapid industrialisation", thaiMeaning: "การพัฒนาอุตสาหกรรมอย่างรวดเร็ว" },
      { word: "shrinking populations", thaiMeaning: "ประชากรที่ลดลง" },
      { word: "traditional customs", thaiMeaning: "ประเพณีดั้งเดิม" },
      { word: "cultural heritage", thaiMeaning: "มรดกทางวัฒนธรรม" },
      { word: "family structures", thaiMeaning: "โครงสร้างครอบครัว" },
      { word: "ordinary citizens", thaiMeaning: "ประชาชนทั่วไป" },
      { word: "poverty reduction", thaiMeaning: "การลดความยากจน" },
      { word: "rural communities", thaiMeaning: "ชุมชนในชนบท" },
      { word: "economic growth", thaiMeaning: "การเติบโตทางเศรษฐกิจ" },
      { word: "extreme poverty", thaiMeaning: "ความยากจนขั้นรุนแรง" },
      { word: "national income", thaiMeaning: "รายได้ประชาชาติ" },
      { word: "rural hospitals", thaiMeaning: "โรงพยาบาลในชนบท" },
      { word: "heritage sites", thaiMeaning: "แหล่งมรดก" },
      { word: "public schools", thaiMeaning: "โรงเรียนของรัฐ" },
      { word: "higher wages", thaiMeaning: "ค่าจ้างที่สูงกว่า" },
      { word: "urbanisation", thaiMeaning: "การกลายเป็นเมือง" },
      { word: "lifts millions of people out of poverty", thaiMeaning: "ยกระดับผู้คนนับล้านให้พ้นความยากจน" },
      { word: "World Bank study", thaiMeaning: "การศึกษาของธนาคารโลก" },
      { word: "nationwide expansion", thaiMeaning: "การขยายตัวทั่วประเทศ" },
      { word: "busy city jobs", thaiMeaning: "งานในเมืองที่เร่งรีบ" },
      { word: "younger generations", thaiMeaning: "คนรุ่นใหม่" },
      { word: "generous state funding", thaiMeaning: "เงินอุดหนุนจากรัฐอย่างเพียงพอ" },
      { word: "traditional festivals", thaiMeaning: "เทศกาลดั้งเดิม" },
      { word: "improved public services", thaiMeaning: "บริการสาธารณะที่ดีขึ้น" },
      { word: "draws young people away", thaiMeaning: "ดึงคนหนุ่มสาวให้ออกไป" },
      { word: "old customs remain visible", thaiMeaning: "ประเพณีเก่ายังคงปรากฏให้เห็น" },
      { word: "past two decades", thaiMeaning: "สองทศวรรษที่ผ่านมา" },
      { word: "actively preserve", thaiMeaning: "อนุรักษ์อย่างจริงจัง" }
    ]
  },
  {
    id: 't2-ad-8',
    number: 8,
    typeId: 'advantages-disadvantages',
    title: 'Genetically Modified Food Crops',
    questionText:
      'Nowadays genetically modified food products are widespread throughout the world. While proponents ensure that these foods are safe and help increase food supplies, others argue that their health effects have not been studied long enough. Do the advantages of genetically modified crops outweigh the disadvantages?',
    meta: 'UK · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while growing genetically modified food crops is both beneficial and detrimental to public health, this essay argues that the benefits are far greater than the drawbacks.", thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การปลูกพืชอาหารดัดแปลงพันธุกรรมจะทั้งเป็นประโยชน์และเป็นโทษต่อสุขภาพของประชาชน แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with genetically modified food crops. The first benefit is that they can dramatically increase crop yields, helping to feed growing populations. For example, a 2021 study by the International Food Policy Research Institute found that genetically modified maize increased yields by up to 25% in several African nations. Another advantage is that these crops can be engineered to resist pests and drought, reducing reliance on chemical pesticides. For instance, Bt cotton varieties grown widely in India have cut pesticide use by nearly half since their introduction.", thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับพืชอาหารดัดแปลงพันธุกรรม ประโยชน์ประการแรกคือ พืชเหล่านี้สามารถเพิ่มผลผลิตทางการเกษตรได้อย่างมาก ซึ่งช่วยเลี้ยงดูประชากรที่เพิ่มขึ้น ตัวอย่างเช่น งานวิจัยของสถาบันวิจัยนโยบายอาหารระหว่างประเทศปี 2021 พบว่าข้าวโพดดัดแปลงพันธุกรรมเพิ่มผลผลิตได้สูงถึง 25% ในหลายประเทศแอฟริกา ข้อดีอีกประการหนึ่งคือ พืชเหล่านี้สามารถถูกดัดแปลงให้ต้านทานศัตรูพืชและความแห้งแล้งได้ ซึ่งช่วยลดการพึ่งพาสารกำจัดศัตรูพืชทางเคมี ยกตัวอย่างเช่น ฝ้ายพันธุ์บีที (Bt cotton) ที่ปลูกอย่างแพร่หลายในอินเดียได้ลดการใช้สารกำจัดศัตรูพืชลงเกือบครึ่งหนึ่งนับตั้งแต่มีการนำมาใช้' },
      { role: 'body2', text: "However, some might be concerned regarding the unknown long-term health effects of consuming modified foods. This is because these crops have only been widely cultivated for a few decades. To illustrate, several consumer groups in the European Union have campaigned for stricter labelling, citing these unresolved health concerns. However, this argument is simply invalid given that major scientific bodies have repeatedly confirmed the safety of approved genetically modified foods. For example, the World Health Organization has reviewed decades of evidence and found no verified case of harm from genetically modified crops currently on the market.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับผลกระทบต่อสุขภาพในระยะยาวที่ยังไม่เป็นที่ทราบแน่ชัดจากการบริโภคอาหารดัดแปลงพันธุกรรม ทั้งนี้เพราะพืชเหล่านี้เพิ่งถูกเพาะปลูกอย่างแพร่หลายมาเพียงไม่กี่ทศวรรษเท่านั้น ยกตัวอย่างเช่น กลุ่มผู้บริโภคหลายกลุ่มในสหภาพยุโรปได้รณรงค์ให้มีการติดฉลากที่เข้มงวดยิ่งขึ้น โดยอ้างถึงข้อกังวลด้านสุขภาพที่ยังไม่ได้รับการแก้ไขเหล่านี้ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากหน่วยงานทางวิทยาศาสตร์หลักได้ยืนยันความปลอดภัยของอาหารดัดแปลงพันธุกรรมที่ได้รับการรับรองซ้ำแล้วซ้ำเล่า ตัวอย่างเช่น องค์การอนามัยโลกได้ทบทวนหลักฐานตลอดหลายทศวรรษและไม่พบกรณีที่ได้รับการยืนยันว่าเป็นอันตรายจากพืชดัดแปลงพันธุกรรมที่วางจำหน่ายในปัจจุบัน' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the long-term health effects of modified foods, I am of the opinion that the benefits of genetically modified crops, including higher yields and pest resistance, are far greater than the drawbacks.", thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของผลกระทบต่อสุขภาพในระยะยาวจากอาหารดัดแปลงพันธุกรรม แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของพืชดัดแปลงพันธุกรรม ซึ่งรวมถึงผลผลิตที่สูงขึ้นและการต้านทานศัตรูพืช มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "approved genetically modified foods", thaiMeaning: "อาหารดัดแปลงพันธุกรรมที่ได้รับอนุมัติ" },
      { word: "genetically modified food crops", thaiMeaning: "พืชอาหารดัดแปลงพันธุกรรม" },
      { word: "genetically modified maize", thaiMeaning: "ข้าวโพดดัดแปลงพันธุกรรม" },
      { word: "unresolved health concerns", thaiMeaning: "ความกังวลด้านสุขภาพที่ยังไม่คลี่คลาย" },
      { word: "long-term health effects", thaiMeaning: "ผลกระทบต่อสุขภาพระยะยาว" },
      { word: "resist pests and drought", thaiMeaning: "ต้านทานศัตรูพืชและภัยแล้ง" },
      { word: "verified case of harm", thaiMeaning: "กรณีอันตรายที่ยืนยันได้" },
      { word: "Bt cotton varieties", thaiMeaning: "สายพันธุ์ฝ้าย Bt" },
      { word: "chemical pesticides", thaiMeaning: "ยาฆ่าแมลงเคมี" },
      { word: "decades of evidence", thaiMeaning: "หลักฐานหลายทศวรรษ" },
      { word: "growing populations", thaiMeaning: "ประชากรที่เพิ่มขึ้น" },
      { word: "stricter labelling", thaiMeaning: "การติดฉลากที่เข้มงวดขึ้น" },
      { word: "scientific bodies", thaiMeaning: "องค์กรทางวิทยาศาสตร์" },
      { word: "widely cultivated", thaiMeaning: "เพาะปลูกอย่างแพร่หลาย" },
      { word: "consumer groups", thaiMeaning: "กลุ่มผู้บริโภค" },
      { word: "pest resistance", thaiMeaning: "ความต้านทานต่อศัตรูพืช" },
      { word: "higher yields", thaiMeaning: "ผลผลิตที่สูงขึ้น" },
      { word: "pesticide use", thaiMeaning: "การใช้ยาฆ่าแมลง" },
      { word: "public health", thaiMeaning: "สาธารณสุข" },
      { word: "crop yields", thaiMeaning: "ผลผลิตทางการเกษตร" },
      { word: "International Food Policy Research Institute", thaiMeaning: "สถาบันวิจัยนโยบายอาหารระหว่างประเทศ" },
      { word: "consuming modified foods", thaiMeaning: "การบริโภคอาหารดัดแปลง" },
      { word: "European Union", thaiMeaning: "สหภาพยุโรป" },
      { word: "World Health Organization", thaiMeaning: "องค์การอนามัยโลก" },
      { word: "genetically modified crops", thaiMeaning: "พืชดัดแปลงพันธุกรรม" },
      { word: "currently on the market", thaiMeaning: "ที่มีจำหน่ายอยู่ในปัจจุบัน" },
      { word: "increased yields by up to 25%", thaiMeaning: "เพิ่มผลผลิตได้ถึง 25%" },
      { word: "grown widely in India", thaiMeaning: "ปลูกอย่างแพร่หลายในอินเดีย" },
      { word: "since their introduction", thaiMeaning: "นับตั้งแต่เริ่มนำมาใช้" },
      { word: "a few decades", thaiMeaning: "สองสามทศวรรษ" },
      { word: "repeatedly confirmed the safety", thaiMeaning: "ยืนยันความปลอดภัยซ้ำแล้วซ้ำเล่า" },
      { word: "African nations", thaiMeaning: "ประเทศในแอฟริกา" }
    ]
  },
  {
    id: 't2-ad-9',
    number: 9,
    typeId: 'advantages-disadvantages',
    title: 'Storing Information Online Instead of in Books',
    questionText:
      'Nowadays, most of the information is available on the Internet, whereas in the past, knowledge was stored in books and on paper. Do you think the advantages of this situation outweigh its disadvantages?',
    meta: 'Spain · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while storing information on the internet rather than in books is both beneficial and detrimental to learning, this essay argues that the benefits are far greater than the drawbacks.", thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้การจัดเก็บข้อมูลบนอินเทอร์เน็ตแทนที่จะเป็นในหนังสือจะทั้งเป็นประโยชน์และเป็นโทษต่อการเรียนรู้ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with storing information on the internet. The first benefit is that it allows instant access to knowledge from anywhere in the world. For example, students in remote areas of Kenya now use smartphones to access free online libraries that would otherwise be hours away by road. Another advantage is that online information can be updated constantly, keeping facts far more current than printed material. For instance, digital encyclopedias such as Wikipedia are revised within minutes of major world events, unlike printed reference books.", thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับการจัดเก็บข้อมูลบนอินเทอร์เน็ต ประโยชน์ประการแรกคือ อินเทอร์เน็ตช่วยให้เข้าถึงความรู้ได้ทันทีจากทุกที่ในโลก ตัวอย่างเช่น นักเรียนในพื้นที่ห่างไกลของเคนยาในปัจจุบันใช้สมาร์ตโฟนเพื่อเข้าถึงห้องสมุดออนไลน์ฟรี ซึ่งมิเช่นนั้นแล้วต้องเดินทางไกลหลายชั่วโมงโดยรถยนต์ ข้อดีอีกประการหนึ่งคือ ข้อมูลออนไลน์สามารถได้รับการอัปเดตอยู่ตลอดเวลา ทำให้ข้อมูลนั้นทันสมัยกว่าสื่อสิ่งพิมพ์มาก ยกตัวอย่างเช่น สารานุกรมดิจิทัลอย่างวิกิพีเดียได้รับการปรับปรุงภายในไม่กี่นาทีหลังเหตุการณ์สำคัญของโลก ซึ่งแตกต่างจากหนังสืออ้างอิงที่พิมพ์ออกมา' },
      { role: 'body2', text: "However, some might be concerned regarding the unreliable and unverified nature of much online content. This is because anyone can publish information on the internet without any form of expert review. To illustrate, a 2020 Stanford University study found that most teenagers struggled to distinguish reliable news sources from misleading ones online. However, this argument is simply invalid given that reputable digital platforms now apply strict fact-checking and verification standards. For example, academic databases such as JSTOR only publish peer-reviewed material, offering the same reliability as traditional printed journals.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับลักษณะที่ไม่น่าเชื่อถือและไม่ผ่านการตรวจสอบของเนื้อหาออนไลน์จำนวนมาก ทั้งนี้เพราะใครก็ตามสามารถเผยแพร่ข้อมูลบนอินเทอร์เน็ตได้โดยไม่ผ่านการตรวจสอบจากผู้เชี่ยวชาญในรูปแบบใดๆ ยกตัวอย่างเช่น งานวิจัยของมหาวิทยาลัยสแตนฟอร์ดปี 2020 พบว่าวัยรุ่นส่วนใหญ่มีปัญหาในการแยกแยะแหล่งข่าวที่น่าเชื่อถือออกจากแหล่งข่าวที่ทำให้เข้าใจผิดบนโลกออนไลน์ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากแพลตฟอร์มดิจิทัลที่น่าเชื่อถือในปัจจุบันได้นำมาตรฐานการตรวจสอบข้อเท็จจริงและการยืนยันที่เข้มงวดมาใช้ ตัวอย่างเช่น ฐานข้อมูลทางวิชาการอย่าง JSTOR เผยแพร่เฉพาะเนื้อหาที่ผ่านการตรวจสอบโดยผู้เชี่ยวชาญเท่านั้น ซึ่งให้ความน่าเชื่อถือเทียบเท่ากับวารสารสิ่งพิมพ์แบบดั้งเดิม' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the reliability of online information, I am of the opinion that the benefits of storing information on the internet, including instant access and constant updates, are far greater than the drawbacks.", thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของความน่าเชื่อถือของข้อมูลออนไลน์ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการจัดเก็บข้อมูลบนอินเทอร์เน็ต ซึ่งรวมถึงการเข้าถึงได้ทันทีและการอัปเดตอย่างต่อเนื่อง มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "storing information on the internet", thaiMeaning: "การเก็บข้อมูลบนอินเทอร์เน็ต" },
      { word: "reputable digital platforms", thaiMeaning: "แพลตฟอร์มดิจิทัลที่น่าเชื่อถือ" },
      { word: "printed reference books", thaiMeaning: "หนังสืออ้างอิงฉบับพิมพ์" },
      { word: "peer-reviewed material", thaiMeaning: "เอกสารที่ผ่านการตรวจสอบโดยผู้เชี่ยวชาญ" },
      { word: "verification standards", thaiMeaning: "มาตรฐานการตรวจสอบ" },
      { word: "digital encyclopedias", thaiMeaning: "สารานุกรมดิจิทัล" },
      { word: "reliable news sources", thaiMeaning: "แหล่งข่าวที่เชื่อถือได้" },
      { word: "academic databases", thaiMeaning: "ฐานข้อมูลทางวิชาการ" },
      { word: "major world events", thaiMeaning: "เหตุการณ์สำคัญของโลก" },
      { word: "online information", thaiMeaning: "ข้อมูลออนไลน์" },
      { word: "constant updates", thaiMeaning: "การอัปเดตอย่างต่อเนื่อง" },
      { word: "online libraries", thaiMeaning: "ห้องสมุดออนไลน์" },
      { word: "printed journals", thaiMeaning: "วารสารฉบับพิมพ์" },
      { word: "printed material", thaiMeaning: "สื่อสิ่งพิมพ์" },
      { word: "misleading ones", thaiMeaning: "แหล่งข้อมูลที่ทำให้เข้าใจผิด" },
      { word: "instant access", thaiMeaning: "การเข้าถึงได้ทันที" },
      { word: "online content", thaiMeaning: "เนื้อหาออนไลน์" },
      { word: "expert review", thaiMeaning: "การตรวจสอบโดยผู้เชี่ยวชาญ" },
      { word: "fact-checking", thaiMeaning: "การตรวจสอบความถูกต้องของข้อมูล" },
      { word: "remote areas", thaiMeaning: "พื้นที่ห่างไกล" },
      { word: "anywhere in the world", thaiMeaning: "จากที่ใดก็ได้ในโลก" },
      { word: "updated constantly", thaiMeaning: "ได้รับการอัปเดตอย่างต่อเนื่อง" },
      { word: "far more current", thaiMeaning: "ทันสมัยกว่ามาก" },
      { word: "unreliable and unverified nature", thaiMeaning: "ลักษณะที่เชื่อถือไม่ได้และไม่ผ่านการตรวจสอบ" },
      { word: "Stanford University study", thaiMeaning: "การศึกษาของมหาวิทยาลัยสแตนฟอร์ด" },
      { word: "same reliability", thaiMeaning: "ความน่าเชื่อถือเท่ากัน" },
      { word: "publish information", thaiMeaning: "เผยแพร่ข้อมูล" },
      { word: "hours away by road", thaiMeaning: "ห่างหลายชั่วโมงทางถนน" },
      { word: "within minutes of", thaiMeaning: "ภายในไม่กี่นาทีหลัง" },
      { word: "use smartphones", thaiMeaning: "ใช้สมาร์ทโฟน" },
      { word: "keeping facts", thaiMeaning: "รักษาข้อเท็จจริงให้" },
      { word: "most teenagers struggled", thaiMeaning: "วัยรุ่นส่วนใหญ่มีปัญหา" }
    ]
  },
  {
    id: 't2-ad-10',
    number: 10,
    typeId: 'advantages-disadvantages',
    title: 'Distance-Learning Programs',
    questionText:
      'Nowadays, distance-learning programs have gained popularity, allowing students to study online instead of attending college or university in person. Do the advantages of distance-learning programs outweigh the disadvantages?',
    meta: 'Australia · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while distance-learning programs are both beneficial and detrimental to students compared with in-person study, this essay argues that the benefits are far greater than the drawbacks.", thai: 'เป็นที่ถกเถียงกันอย่างกว้างขวางว่า แม้หลักสูตรการเรียนทางไกลจะทั้งเป็นประโยชน์และเป็นโทษต่อนักเรียนเมื่อเทียบกับการเรียนแบบพบปะกันโดยตรง แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with distance-learning programs. The first benefit is that they allow students to study from any location without relocating for university. For example, the Open University in the United Kingdom enrols more than 130,000 students annually who study entirely online alongside full-time jobs. Another advantage is that online courses are typically far cheaper than traditional degrees, eliminating accommodation and campus costs altogether. For instance, several accredited online bachelor's degrees in the United States cost less than half the price of comparable on-campus programs, saving students thousands of dollars overall.", thai: 'ก่อนอื่น มีประโยชน์หลายประการที่เกี่ยวข้องกับหลักสูตรการเรียนทางไกล ประโยชน์ประการแรกคือ หลักสูตรเหล่านี้ช่วยให้นักเรียนสามารถเรียนได้จากทุกสถานที่โดยไม่ต้องย้ายถิ่นฐานเพื่อเข้ามหาวิทยาลัย ตัวอย่างเช่น มหาวิทยาลัยเปิด (Open University) ในสหราชอาณาจักรรับนักศึกษามากกว่า 130,000 คนต่อปีที่เรียนออนไลน์ทั้งหมดควบคู่ไปกับการทำงานเต็มเวลา ข้อดีอีกประการหนึ่งคือ หลักสูตรออนไลน์มักมีค่าใช้จ่ายที่ถูกกว่าปริญญาแบบดั้งเดิมมาก เนื่องจากตัดค่าที่พักและค่าใช้จ่ายในมหาวิทยาลัยออกไปทั้งหมด ยกตัวอย่างเช่น ปริญญาตรีออนไลน์ที่ได้รับการรับรองหลายหลักสูตรในสหรัฐอเมริกามีค่าใช้จ่ายน้อยกว่าครึ่งหนึ่งของหลักสูตรในมหาวิทยาลัยที่เทียบเคียงกันได้ ซึ่งช่วยประหยัดเงินให้นักศึกษาได้หลายพันดอลลาร์โดยรวม' },
      { role: 'body2', text: "However, some might be concerned regarding the lack of face-to-face interaction with instructors and classmates. This is because online students often miss out on spontaneous discussions and networking opportunities found on campus. To illustrate, a 2021 survey by Coursera found that nearly 40% of online learners reported feeling isolated during their studies. However, this argument is simply invalid given that modern platforms now offer live seminars and collaborative group projects. For example, universities such as Arizona State University run weekly video tutorials, allowing online students to interact directly with professors and peers.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับการขาดปฏิสัมพันธ์แบบพบปะกันโดยตรงกับอาจารย์ผู้สอนและเพื่อนร่วมชั้น ทั้งนี้เพราะนักเรียนออนไลน์มักพลาดโอกาสในการพูดคุยแลกเปลี่ยนความคิดเห็นอย่างเป็นธรรมชาติและโอกาสในการสร้างเครือข่ายที่พบได้ในมหาวิทยาลัย ยกตัวอย่างเช่น การสำรวจของ Coursera ปี 2021 พบว่าผู้เรียนออนไลน์เกือบ 40% รายงานว่ารู้สึกโดดเดี่ยวระหว่างการเรียน อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากแพลตฟอร์มสมัยใหม่ในปัจจุบันมีการสัมมนาสด (live seminar) และโครงการกลุ่มที่ต้องร่วมมือกัน ตัวอย่างเช่น มหาวิทยาลัยอย่างมหาวิทยาลัยแอริโซนาสเตต (Arizona State University) จัดวิดีโอติวเตอร์เรียลรายสัปดาห์ ซึ่งช่วยให้นักเรียนออนไลน์สามารถมีปฏิสัมพันธ์โดยตรงกับอาจารย์และเพื่อนร่วมชั้นได้' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the lack of face-to-face interaction, I am of the opinion that the benefits of distance-learning programs, including flexibility and lower cost, are far greater than the drawbacks.", thai: 'โดยสรุป แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของการขาดปฏิสัมพันธ์แบบพบปะกันโดยตรง แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของหลักสูตรการเรียนทางไกล ซึ่งรวมถึงความยืดหยุ่นและค่าใช้จ่ายที่ต่ำกว่า มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "accredited online bachelor's degrees", thaiMeaning: "ปริญญาตรีออนไลน์ที่ได้รับการรับรอง" },
      { word: "collaborative group projects", thaiMeaning: "โครงการกลุ่มแบบร่วมมือ" },
      { word: "distance-learning programs", thaiMeaning: "หลักสูตรการเรียนทางไกล" },
      { word: "relocating for university", thaiMeaning: "การย้ายที่อยู่เพื่อเข้ามหาวิทยาลัย" },
      { word: "face-to-face interaction", thaiMeaning: "การปฏิสัมพันธ์แบบพบหน้า" },
      { word: "networking opportunities", thaiMeaning: "โอกาสในการสร้างเครือข่าย" },
      { word: "spontaneous discussions", thaiMeaning: "การอภิปรายแบบเกิดขึ้นเอง" },
      { word: "study entirely online", thaiMeaning: "เรียนออนไลน์ทั้งหมด" },
      { word: "traditional degrees", thaiMeaning: "ปริญญาแบบดั้งเดิม" },
      { word: "on-campus programs", thaiMeaning: "หลักสูตรในมหาวิทยาลัย" },
      { word: "feeling isolated", thaiMeaning: "รู้สึกโดดเดี่ยว" },
      { word: "modern platforms", thaiMeaning: "แพลตฟอร์มสมัยใหม่" },
      { word: "in-person study", thaiMeaning: "การเรียนแบบพบหน้า" },
      { word: "online learners", thaiMeaning: "ผู้เรียนออนไลน์" },
      { word: "video tutorials", thaiMeaning: "วิดีโอสอนบทเรียน" },
      { word: "full-time jobs", thaiMeaning: "งานเต็มเวลา" },
      { word: "online courses", thaiMeaning: "หลักสูตรออนไลน์" },
      { word: "live seminars", thaiMeaning: "สัมมนาสด" },
      { word: "campus costs", thaiMeaning: "ค่าใช้จ่ายในมหาวิทยาลัย" },
      { word: "lower cost", thaiMeaning: "ต้นทุนที่ต่ำกว่า" },
      { word: "study from any location", thaiMeaning: "เรียนจากที่ใดก็ได้" },
      { word: "Open University", thaiMeaning: "มหาวิทยาลัยเปิด" },
      { word: "eliminating accommodation", thaiMeaning: "ตัดค่าที่พักออกไป" },
      { word: "instructors and classmates", thaiMeaning: "อาจารย์และเพื่อนร่วมชั้น" },
      { word: "online students", thaiMeaning: "นักศึกษาออนไลน์" },
      { word: "miss out on", thaiMeaning: "พลาดโอกาส" },
      { word: "Arizona State University", thaiMeaning: "มหาวิทยาลัยแอริโซนาสเตต" },
      { word: "interact directly with professors", thaiMeaning: "โต้ตอบโดยตรงกับอาจารย์" },
      { word: "far cheaper", thaiMeaning: "ถูกกว่ามาก" },
      { word: "saving students thousands of dollars", thaiMeaning: "ประหยัดให้นักศึกษานับพันดอลลาร์" },
      { word: "found on campus", thaiMeaning: "ที่พบในวิทยาเขต" },
      { word: "professors and peers", thaiMeaning: "อาจารย์และเพื่อนร่วมเรียน" }
    ]
  },
  {
    id: 't2-ad-11',
    number: 11,
    typeId: 'advantages-disadvantages',
    title: 'University Students Studying Abroad',
    questionText:
      'University students are increasingly studying abroad as part of their studies. Do the advantages of studying abroad outweigh the disadvantages?',
    meta: 'Uzbekistan · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while university students studying abroad is both beneficial and detrimental to their academic careers, this essay argues that the benefits are far greater than the drawbacks.", thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การที่นักศึกษามหาวิทยาลัยไปเรียนต่างประเทศจะทั้งเป็นประโยชน์และเป็นโทษต่อเส้นทางการศึกษาของพวกเขา แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with university students studying abroad. The first benefit is that it exposes students to different teaching methods and academic perspectives. For example, students who complete an Erasmus exchange programme in Europe report significantly stronger critical thinking skills upon returning to their home universities. Another advantage is that international study experience greatly improves future job prospects. For instance, a 2022 survey by the British Council found that 87% of employers preferred graduates with overseas study experience over those without any at all.", thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่นักศึกษามหาวิทยาลัยไปเรียนต่างประเทศ ประโยชน์ประการแรกคือ การไปเรียนต่างประเทศทำให้นักศึกษาได้สัมผัสกับวิธีการสอนและมุมมองทางวิชาการที่แตกต่างออกไป ตัวอย่างเช่น นักศึกษาที่เข้าร่วมโครงการแลกเปลี่ยน Erasmus ในยุโรปรายงานว่ามีทักษะการคิดวิเคราะห์ที่แข็งแกร่งขึ้นอย่างมีนัยสำคัญเมื่อกลับมายังมหาวิทยาลัยในประเทศบ้านเกิด ข้อดีอีกประการหนึ่งคือ ประสบการณ์การเรียนในต่างประเทศช่วยเพิ่มโอกาสในการทำงานในอนาคตอย่างมาก ยกตัวอย่างเช่น ผลสำรวจของ British Council ในปี 2022 พบว่านายจ้างร้อยละ 87 ชอบบัณฑิตที่มีประสบการณ์เรียนต่างประเทศมากกว่าผู้ที่ไม่มีประสบการณ์ดังกล่าวเลย' },
      { role: 'body2', text: "However, some might be concerned regarding the high financial cost of studying overseas. This is because tuition fees, flights, and accommodation abroad often far exceed the cost of domestic study. To illustrate, international tuition fees at Australian universities can reach 45,000 dollars per year, excluding living expenses entirely. However, this argument is simply invalid given that numerous scholarships and grants are specifically designed to cover these costs. For example, the Chevening Scholarship programme fully funds tuition and living costs for hundreds of international students in the United Kingdom every single year.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับค่าใช้จ่ายทางการเงินที่สูงในการไปเรียนต่างประเทศ ทั้งนี้เพราะค่าเล่าเรียน ค่าตั๋วเครื่องบิน และค่าที่พักในต่างประเทศมักจะสูงเกินกว่าค่าใช้จ่ายในการเรียนภายในประเทศมาก ยกตัวอย่างเช่น ค่าเล่าเรียนสำหรับนักศึกษาต่างชาติในมหาวิทยาลัยของออสเตรเลียอาจสูงถึง 45,000 ดอลลาร์ต่อปี ซึ่งยังไม่รวมค่าครองชีพเลย อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากมีทุนการศึกษาและเงินช่วยเหลือจำนวนมากที่ออกแบบมาโดยเฉพาะเพื่อครอบคลุมค่าใช้จ่ายเหล่านี้ ตัวอย่างเช่น โครงการทุน Chevening ให้ทุนเต็มจำนวนทั้งค่าเล่าเรียนและค่าครองชีพแก่นักศึกษาต่างชาติหลายร้อยคนในสหราชอาณาจักรทุกปี' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial cost of studying abroad, I am of the opinion that the benefits of university students studying abroad, including academic exposure and improved job prospects, are far greater than the drawbacks.", thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลเรื่องค่าใช้จ่ายทางการเงินในการไปเรียนต่างประเทศ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการที่นักศึกษามหาวิทยาลัยไปเรียนต่างประเทศ ซึ่งรวมถึงการได้สัมผัสประสบการณ์ทางวิชาการและโอกาสในการทำงานที่ดีขึ้น มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "critical thinking skills", thaiMeaning: "ทักษะการคิดวิเคราะห์" },
      { word: "job prospects", thaiMeaning: "โอกาสความก้าวหน้าในอาชีพ" },
      { word: "tuition fees", thaiMeaning: "ค่าเล่าเรียน" },
      { word: "scholarships", thaiMeaning: "ทุนการศึกษา" },
      { word: "Erasmus exchange programme", thaiMeaning: "โครงการแลกเปลี่ยนเอราสมุส" },
      { word: "academic perspectives", thaiMeaning: "มุมมองทางวิชาการ" },
      { word: "teaching methods", thaiMeaning: "วิธีการสอน" },
      { word: "overseas study experience", thaiMeaning: "ประสบการณ์เรียนต่างประเทศ" },
      { word: "living expenses", thaiMeaning: "ค่าครองชีพ" },
      { word: "Chevening Scholarship programme", thaiMeaning: "โครงการทุน Chevening" },
      { word: "academic exposure", thaiMeaning: "การเปิดรับความรู้ทางวิชาการ" },
      { word: "studying overseas", thaiMeaning: "การไปเรียนต่างประเทศ" },
      { word: "financial cost", thaiMeaning: "ต้นทุนทางการเงิน" },
      { word: "home universities", thaiMeaning: "มหาวิทยาลัยต้นสังกัด" },
      { word: "British Council", thaiMeaning: "บริติชเคานซิล" },
      { word: "Australian universities", thaiMeaning: "มหาวิทยาลัยในออสเตรเลีย" },
      { word: "domestic study", thaiMeaning: "การเรียนในประเทศ" },
      { word: "international students", thaiMeaning: "นักศึกษาต่างชาติ" },
      { word: "academic careers", thaiMeaning: "เส้นทางอาชีพทางวิชาการ" },
      { word: "significantly stronger", thaiMeaning: "แข็งแกร่งขึ้นอย่างมาก" },
      { word: "university students studying abroad", thaiMeaning: "นักศึกษาที่ไปเรียนต่างประเทศ" },
      { word: "international study experience", thaiMeaning: "ประสบการณ์เรียนในต่างประเทศ" },
      { word: "far greater than the drawbacks", thaiMeaning: "มากกว่าข้อเสียมาก" },
      { word: "accommodation abroad", thaiMeaning: "ที่พักในต่างประเทศ" },
      { word: "this argument is simply invalid", thaiMeaning: "ข้อโต้แย้งนี้ใช้ไม่ได้เลย" },
      { word: "I am of the opinion", thaiMeaning: "ข้าพเจ้าเห็นว่า" },
      { word: "beneficial and detrimental", thaiMeaning: "มีทั้งประโยชน์และโทษ" },
      { word: "specifically designed to cover", thaiMeaning: "ออกแบบมาโดยเฉพาะเพื่อครอบคลุม" },
      { word: "fully funds tuition", thaiMeaning: "ให้ทุนค่าเล่าเรียนเต็มจำนวน" },
      { word: "87% of employers", thaiMeaning: "นายจ้างร้อยละ 87" },
      { word: "upon returning", thaiMeaning: "เมื่อกลับมา" },
      { word: "living costs", thaiMeaning: "ค่าใช้จ่ายในการดำรงชีวิต" }
    ]
  },
  {
    id: 't2-ad-12',
    number: 12,
    typeId: 'advantages-disadvantages',
    title: 'Credit Cards for Young People',
    questionText:
      'Nowadays, it is easier for young people to have a credit card compared to the past. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while young people having easier access to credit cards is both beneficial and detrimental to their financial wellbeing, this essay argues that the benefits are far greater than the drawbacks.", thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การที่คนหนุ่มสาวสามารถเข้าถึงบัตรเครดิตได้ง่ายขึ้นจะทั้งเป็นประโยชน์และเป็นโทษต่อความมั่นคงทางการเงินของพวกเขา แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with young people having access to credit cards. The first benefit is that credit cards allow young people to build a strong credit history early in life. For example, banks in the United States report that customers who open a credit card by age 21 typically qualify for lower mortgage rates a decade later. Another advantage is that credit cards provide a convenient financial buffer during genuine emergencies. For instance, many students use credit cards to cover unexpected medical bills or urgent travel costs while studying overseas.", thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่คนหนุ่มสาวสามารถเข้าถึงบัตรเครดิตได้ ประโยชน์ประการแรกคือ บัตรเครดิตช่วยให้คนหนุ่มสาวสร้างประวัติเครดิตที่ดีได้ตั้งแต่อายุยังน้อย ตัวอย่างเช่น ธนาคารในสหรัฐอเมริการายงานว่าลูกค้าที่เปิดบัตรเครดิตตั้งแต่อายุ 21 ปี มักมีคุณสมบัติได้รับอัตราดอกเบี้ยจำนองที่ต่ำกว่าในอีกสิบปีต่อมา ข้อดีอีกประการหนึ่งคือ บัตรเครดิตเป็นเสมือนเงินสำรองทางการเงินที่สะดวกในยามฉุกเฉินจริง ๆ ยกตัวอย่างเช่น นักศึกษาจำนวนมากใช้บัตรเครดิตเพื่อจ่ายค่ารักษาพยาบาลที่ไม่คาดคิดหรือค่าใช้จ่ายในการเดินทางเร่งด่วนขณะเรียนอยู่ต่างประเทศ' },
      { role: 'body2', text: "However, some might be concerned regarding the risk of young people accumulating unmanageable debt. This is because many young cardholders lack experience in budgeting and may overspend on non-essential items. To illustrate, a 2022 report by the Federal Reserve found that credit card debt among under-25s in America had risen by nearly 15% in a single year. However, this argument is simply invalid given that most banks now require compulsory financial literacy modules before issuing cards to young applicants. For example, several major UK banks now offer built-in spending alerts, helping young customers track and control their spending closely.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับความเสี่ยงที่คนหนุ่มสาวจะสะสมหนี้จนเกินความสามารถในการชำระ ทั้งนี้เพราะผู้ถือบัตรที่ยังอายุน้อยจำนวนมากขาดประสบการณ์ในการจัดการงบประมาณและอาจใช้จ่ายเกินตัวไปกับสิ่งของที่ไม่จำเป็น ยกตัวอย่างเช่น รายงานของธนาคารกลางสหรัฐ (Federal Reserve) ในปี 2022 พบว่าหนี้บัตรเครดิตของกลุ่มอายุต่ำกว่า 25 ปีในอเมริกาเพิ่มขึ้นเกือบร้อยละ 15 ภายในปีเดียว อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากปัจจุบันธนาคารส่วนใหญ่กำหนดให้ต้องผ่านหลักสูตรความรู้ทางการเงินภาคบังคับก่อนออกบัตรให้กับผู้สมัครที่อายุยังน้อย ตัวอย่างเช่น ธนาคารใหญ่หลายแห่งในสหราชอาณาจักรปัจจุบันมีระบบแจ้งเตือนการใช้จ่ายในตัว ซึ่งช่วยให้ลูกค้าวัยหนุ่มสาวติดตามและควบคุมการใช้จ่ายของตนได้อย่างใกล้ชิด' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the risk of accumulating debt, I am of the opinion that the benefits of credit cards for young people, including building credit history and providing financial security, are far greater than the drawbacks.", thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลเรื่องความเสี่ยงในการสะสมหนี้ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของบัตรเครดิตสำหรับคนหนุ่มสาว ซึ่งรวมถึงการสร้างประวัติเครดิตและการสร้างความมั่นคงทางการเงิน มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "credit history", thaiMeaning: "ประวัติเครดิต" },
      { word: "financial buffer", thaiMeaning: "เงินสำรองทางการเงิน" },
      { word: "budgeting", thaiMeaning: "การทำงบประมาณ" },
      { word: "spending alerts", thaiMeaning: "การแจ้งเตือนการใช้จ่าย" },
      { word: "mortgage rates", thaiMeaning: "อัตราดอกเบี้ยสินเชื่อบ้าน" },
      { word: "genuine emergencies", thaiMeaning: "เหตุฉุกเฉินจริงๆ" },
      { word: "unmanageable debt", thaiMeaning: "หนี้ที่จัดการไม่ได้" },
      { word: "non-essential items", thaiMeaning: "สิ่งของที่ไม่จำเป็น" },
      { word: "financial literacy modules", thaiMeaning: "หลักสูตรความรู้ทางการเงิน" },
      { word: "credit card debt", thaiMeaning: "หนี้บัตรเครดิต" },
      { word: "medical bills", thaiMeaning: "ค่าแพทย์" },
      { word: "urgent travel costs", thaiMeaning: "ค่าเดินทางเร่งด่วน" },
      { word: "financial wellbeing", thaiMeaning: "สุขภาวะทางการเงิน" },
      { word: "young applicants", thaiMeaning: "ผู้สมัครหนุ่มสาว" },
      { word: "Federal Reserve", thaiMeaning: "ธนาคารกลางสหรัฐ" },
      { word: "financial security", thaiMeaning: "ความมั่นคงทางการเงิน" },
      { word: "studying overseas", thaiMeaning: "การไปเรียนต่างประเทศ" },
      { word: "track and control", thaiMeaning: "ติดตามและควบคุมการใช้จ่าย" },
      { word: "open a credit card", thaiMeaning: "เปิดบัตรเครดิต" },
      { word: "young cardholders", thaiMeaning: "ผู้ถือบัตรหนุ่มสาว" },
      { word: "easier access to credit cards", thaiMeaning: "เข้าถึงบัตรเครดิตได้ง่ายขึ้น" },
      { word: "far greater than the drawbacks", thaiMeaning: "มากกว่าข้อเสียมาก" },
      { word: "this argument is simply invalid", thaiMeaning: "ข้อโต้แย้งนี้ใช้ไม่ได้เลย" },
      { word: "I am of the opinion", thaiMeaning: "ข้าพเจ้าเห็นว่า" },
      { word: "beneficial and detrimental", thaiMeaning: "มีทั้งประโยชน์และโทษ" },
      { word: "credit cards for young people", thaiMeaning: "บัตรเครดิตสำหรับคนหนุ่มสาว" },
      { word: "major UK banks", thaiMeaning: "ธนาคารใหญ่ในสหราชอาณาจักร" },
      { word: "young customers", thaiMeaning: "ลูกค้าวัยหนุ่มสาว" },
      { word: "risk of accumulating debt", thaiMeaning: "ความเสี่ยงในการก่อหนี้สะสม" },
      { word: "a decade later", thaiMeaning: "ทศวรรษต่อมา" },
      { word: "under-25s in America", thaiMeaning: "คนอายุต่ำกว่า 25 ปีในอเมริกา" },
      { word: "early in life", thaiMeaning: "ตั้งแต่ยังอายุน้อย" }
    ]
  },
  {
    id: 't2-ad-13',
    number: 13,
    typeId: 'advantages-disadvantages',
    title: 'Shifting from Fossil Fuels to Alternative Energy',
    questionText:
      'Fossil fuels are the main source of energy around the world. However, people are encouraged to use alternative energy sources such as wind and solar energy. Do the advantages of this shift outweigh the disadvantages?',
    meta: 'UAE · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while shifting from fossil fuels to alternative energy sources is both beneficial and detrimental to national economies, this essay argues that the benefits are far greater than the drawbacks.", thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การเปลี่ยนจากเชื้อเพลิงฟอสซิลไปสู่แหล่งพลังงานทางเลือกจะทั้งเป็นประโยชน์และเป็นโทษต่อเศรษฐกิจของประเทศ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with shifting to alternative energy sources. The first benefit is that renewable energy significantly reduces harmful carbon emissions that contribute to climate change. For example, Denmark now generates more than 50% of its electricity from wind power, cutting national carbon emissions dramatically since 2010. Another advantage is that renewable energy sources are increasingly cheaper to produce than fossil fuels. For instance, a 2021 report by the International Renewable Energy Agency found that solar power costs had fallen by 85% over the previous decade.", thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการเปลี่ยนไปใช้แหล่งพลังงานทางเลือก ประโยชน์ประการแรกคือ พลังงานหมุนเวียนช่วยลดการปล่อยก๊าซคาร์บอนที่เป็นอันตรายซึ่งก่อให้เกิดการเปลี่ยนแปลงสภาพภูมิอากาศได้อย่างมีนัยสำคัญ ตัวอย่างเช่น เดนมาร์กปัจจุบันผลิตไฟฟ้ามากกว่าร้อยละ 50 จากพลังงานลม ซึ่งช่วยลดการปล่อยคาร์บอนของประเทศลงอย่างมากตั้งแต่ปี 2010 ข้อดีอีกประการหนึ่งคือ แหล่งพลังงานหมุนเวียนมีต้นทุนการผลิตที่ถูกลงเรื่อย ๆ เมื่อเทียบกับเชื้อเพลิงฟอสซิล ยกตัวอย่างเช่น รายงานของ International Renewable Energy Agency ในปี 2021 พบว่าต้นทุนพลังงานแสงอาทิตย์ลดลงถึงร้อยละ 85 ในช่วงทศวรรษที่ผ่านมา' },
      { role: 'body2', text: "However, some might be concerned regarding the unreliable and inconsistent supply of renewable energy. This is because solar and wind power depend heavily on weather conditions rather than constant availability. To illustrate, several European countries experienced electricity shortages in 2021 when unusually low winds reduced wind farm output. However, this argument is simply invalid given that modern battery storage technology can now store surplus renewable energy for later use. For example, Tesla's large-scale battery installation in South Australia has stored enough energy to power thousands of homes during periods of low wind generation.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับความไม่น่าเชื่อถือและไม่สม่ำเสมอของอุปทานพลังงานหมุนเวียน ทั้งนี้เพราะพลังงานแสงอาทิตย์และพลังงานลมขึ้นอยู่กับสภาพอากาศเป็นอย่างมาก มากกว่าจะมีความพร้อมใช้งานอย่างต่อเนื่อง ยกตัวอย่างเช่น หลายประเทศในยุโรปประสบปัญหาไฟฟ้าขาดแคลนในปี 2021 เมื่อลมที่พัดเบากว่าปกติทำให้กังหันลมผลิตไฟฟ้าได้น้อยลง อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากเทคโนโลยีแบตเตอรี่กักเก็บพลังงานสมัยใหม่สามารถกักเก็บพลังงานหมุนเวียนส่วนเกินไว้ใช้ในภายหลังได้แล้ว ตัวอย่างเช่น ระบบแบตเตอรี่ขนาดใหญ่ของบริษัท Tesla ในออสเตรเลียใต้ได้กักเก็บพลังงานไว้มากพอที่จะจ่ายไฟให้บ้านเรือนหลายพันหลังในช่วงที่พลังงานลมผลิตได้น้อย' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of the inconsistent supply of renewable energy, I am of the opinion that the benefits of shifting to alternative energy, including reduced emissions and falling costs, are far greater than the drawbacks.", thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลเรื่องอุปทานพลังงานหมุนเวียนที่ไม่สม่ำเสมอ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการเปลี่ยนไปใช้พลังงานทางเลือก ซึ่งรวมถึงการลดการปล่อยมลพิษและต้นทุนที่ลดลง มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "carbon emissions", thaiMeaning: "การปล่อยก๊าซคาร์บอน" },
      { word: "renewable energy", thaiMeaning: "พลังงานหมุนเวียน" },
      { word: "wind farm output", thaiMeaning: "ผลผลิตจากฟาร์มกังหันลม" },
      { word: "battery storage", thaiMeaning: "ระบบกักเก็บพลังงานแบตเตอรี่" },
      { word: "fossil fuels", thaiMeaning: "เชื้อเพลิงฟอสซิล" },
      { word: "alternative energy sources", thaiMeaning: "แหล่งพลังงานทางเลือก" },
      { word: "climate change", thaiMeaning: "การเปลี่ยนแปลงสภาพภูมิอากาศ" },
      { word: "wind power", thaiMeaning: "พลังงานลม" },
      { word: "solar power costs", thaiMeaning: "ต้นทุนพลังงานแสงอาทิตย์" },
      { word: "weather conditions", thaiMeaning: "สภาพอากาศ" },
      { word: "electricity shortages", thaiMeaning: "การขาดแคลนไฟฟ้า" },
      { word: "national economies", thaiMeaning: "เศรษฐกิจของชาติ" },
      { word: "constant availability", thaiMeaning: "ความพร้อมใช้อย่างต่อเนื่อง" },
      { word: "large-scale battery installation", thaiMeaning: "การติดตั้งแบตเตอรี่ขนาดใหญ่" },
      { word: "falling costs", thaiMeaning: "ต้นทุนที่ลดลง" },
      { word: "low wind generation", thaiMeaning: "การผลิตไฟจากลมต่ำ" },
      { word: "reduced emissions", thaiMeaning: "การปล่อยมลพิษที่ลดลง" },
      { word: "previous decade", thaiMeaning: "ทศวรรษก่อนหน้า" },
      { word: "store surplus", thaiMeaning: "เก็บส่วนเกินไว้" },
      { word: "depend heavily", thaiMeaning: "พึ่งพาอย่างมาก" },
      { word: "International Renewable Energy Agency", thaiMeaning: "หน่วยงานพลังงานหมุนเวียนระหว่างประเทศ" },
      { word: "unreliable and inconsistent supply", thaiMeaning: "อุปทานที่ไม่เสถียรและไม่สม่ำเสมอ" },
      { word: "increasingly cheaper to produce", thaiMeaning: "ผลิตได้ถูกลงเรื่อยๆ" },
      { word: "power thousands of homes", thaiMeaning: "จ่ายไฟให้บ้านเรือนหลายพันหลัง" },
      { word: "South Australia", thaiMeaning: "เซาท์ออสเตรเลีย" },
      { word: "far greater than the drawbacks", thaiMeaning: "มากกว่าข้อเสียมาก" },
      { word: "this argument is simply invalid", thaiMeaning: "ข้อโต้แย้งนี้ใช้ไม่ได้เลย" },
      { word: "I am of the opinion", thaiMeaning: "ข้าพเจ้าเห็นว่า" },
      { word: "beneficial and detrimental", thaiMeaning: "มีทั้งประโยชน์และโทษ" },
      { word: "shifting to alternative energy", thaiMeaning: "การเปลี่ยนไปใช้พลังงานทางเลือก" },
      { word: "unusually low winds", thaiMeaning: "ลมที่อ่อนผิดปกติ" },
      { word: "European countries", thaiMeaning: "ประเทศในยุโรป" }
    ]
  },
  {
    id: 't2-ad-14',
    number: 14,
    typeId: 'advantages-disadvantages',
    title: 'Artificial Intelligence Performing Human Tasks',
    questionText:
      'In many countries, people are now using artificial intelligence to perform tasks previously done by humans. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while using artificial intelligence to perform tasks once done by humans is both beneficial and detrimental to the workforce, this essay argues that the benefits are far greater than the drawbacks.", thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การใช้ปัญญาประดิษฐ์ (AI) ทำงานที่เคยทำโดยมนุษย์จะทั้งเป็นประโยชน์และเป็นโทษต่อกำลังแรงงาน แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with using artificial intelligence in the workplace. The first benefit is that AI can complete repetitive tasks far more quickly and accurately than humans. For example, Amazon's warehouse robots now process customer orders roughly four times faster than manual sorting teams did previously. Another advantage is that AI frees employees from tedious duties, allowing them to focus on more creative and strategic work. For instance, marketing teams at companies such as Coca-Cola now use AI tools to handle data analysis, leaving staff more time for campaign design.", thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการใช้ปัญญาประดิษฐ์ในสถานที่ทำงาน ประโยชน์ประการแรกคือ AI สามารถทำงานที่ต้องทำซ้ำ ๆ ได้รวดเร็วและแม่นยำกว่ามนุษย์มาก ตัวอย่างเช่น หุ่นยนต์ในคลังสินค้าของ Amazon ปัจจุบันประมวลผลคำสั่งซื้อของลูกค้าได้เร็วกว่าทีมคัดแยกด้วยมือเมื่อก่อนถึงประมาณสี่เท่า ข้อดีอีกประการหนึ่งคือ AI ช่วยปลดปล่อยพนักงานจากงานที่น่าเบื่อหน่าย ทำให้พวกเขาสามารถมุ่งเน้นไปที่งานที่สร้างสรรค์และมีความสำคัญเชิงกลยุทธ์มากขึ้น ยกตัวอย่างเช่น ทีมการตลาดของบริษัทอย่าง Coca-Cola ปัจจุบันใช้เครื่องมือ AI ในการวิเคราะห์ข้อมูล ทำให้พนักงานมีเวลามากขึ้นสำหรับการออกแบบแคมเปญ' },
      { role: 'body2', text: "However, some might be concerned regarding the widespread job losses that automation may cause. This is because machines can increasingly replace roles in manufacturing, customer service, and even basic administration. To illustrate, a 2023 McKinsey report estimated that automation could displace up to 30% of current jobs worldwide by 2030. However, this argument is simply invalid given that new technologies typically create fresh employment opportunities in emerging industries. For example, the rise of AI has generated entirely new careers in data labelling and machine-learning engineering, roles that barely existed a decade ago.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับการสูญเสียตำแหน่งงานในวงกว้างที่ระบบอัตโนมัติอาจก่อให้เกิดขึ้น ทั้งนี้เพราะเครื่องจักรสามารถเข้ามาแทนที่ตำแหน่งงานในภาคการผลิต งานบริการลูกค้า และแม้แต่งานธุรการพื้นฐานได้มากขึ้นเรื่อย ๆ ยกตัวอย่างเช่น รายงานของ McKinsey ในปี 2023 ประเมินว่าระบบอัตโนมัติอาจทำให้ตำแหน่งงานปัจจุบันทั่วโลกหายไปมากถึงร้อยละ 30 ภายในปี 2030 อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากเทคโนโลยีใหม่ ๆ มักสร้างโอกาสการจ้างงานใหม่ในอุตสาหกรรมที่กำลังเติบโต ตัวอย่างเช่น การเติบโตของ AI ได้สร้างอาชีพใหม่ทั้งหมดในด้านการติดป้ายกำกับข้อมูล (data labelling) และวิศวกรรมการเรียนรู้ของเครื่อง (machine-learning engineering) ซึ่งเป็นตำแหน่งงานที่แทบไม่มีอยู่เลยเมื่อสิบปีก่อน' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of job losses caused by automation, I am of the opinion that the benefits of artificial intelligence in the workplace, including efficiency and new job creation, are far greater than the drawbacks.", thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลเรื่องการสูญเสียตำแหน่งงานที่เกิดจากระบบอัตโนมัติ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของปัญญาประดิษฐ์ในสถานที่ทำงาน ซึ่งรวมถึงประสิทธิภาพและการสร้างงานใหม่ มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "repetitive tasks", thaiMeaning: "งานที่ทำซ้ำๆ" },
      { word: "data analysis", thaiMeaning: "การวิเคราะห์ข้อมูล" },
      { word: "job losses", thaiMeaning: "การสูญเสียตำแหน่งงาน" },
      { word: "machine-learning engineering", thaiMeaning: "วิศวกรรมการเรียนรู้ของเครื่อง" },
      { word: "artificial intelligence", thaiMeaning: "ปัญญาประดิษฐ์" },
      { word: "tedious duties", thaiMeaning: "หน้าที่งานที่น่าเบื่อ" },
      { word: "campaign design", thaiMeaning: "การออกแบบแคมเปญ" },
      { word: "customer service", thaiMeaning: "บริการลูกค้า" },
      { word: "basic administration", thaiMeaning: "งานธุรการพื้นฐาน" },
      { word: "emerging industries", thaiMeaning: "อุตสาหกรรมเกิดใหม่" },
      { word: "data labelling", thaiMeaning: "การติดป้ายข้อมูล" },
      { word: "manual sorting teams", thaiMeaning: "ทีมคัดแยกด้วยมือ" },
      { word: "warehouse robots", thaiMeaning: "หุ่นยนต์คลังสินค้า" },
      { word: "customer orders", thaiMeaning: "คำสั่งซื้อของลูกค้า" },
      { word: "new job creation", thaiMeaning: "การสร้างงานใหม่" },
      { word: "creative and strategic work", thaiMeaning: "งานสร้างสรรค์และเชิงกลยุทธ์" },
      { word: "fresh employment opportunities", thaiMeaning: "โอกาสจ้างงานใหม่" },
      { word: "current jobs", thaiMeaning: "งานในปัจจุบัน" },
      { word: "frees employees", thaiMeaning: "ช่วยให้พนักงานมีอิสระจาก" },
      { word: "barely existed", thaiMeaning: "แทบไม่มีมาก่อน" },
      { word: "in the workplace", thaiMeaning: "ในที่ทำงาน" },
      { word: "four times faster", thaiMeaning: "เร็วกว่าถึงสี่เท่า" },
      { word: "marketing teams", thaiMeaning: "ทีมการตลาด" },
      { word: "McKinsey report", thaiMeaning: "รายงานของแมคคินซีย์" },
      { word: "displace up to 30%", thaiMeaning: "แทนที่ได้สูงสุดถึง 30%" },
      { word: "far greater than the drawbacks", thaiMeaning: "มากกว่าข้อเสียมาก" },
      { word: "this argument is simply invalid", thaiMeaning: "ข้อโต้แย้งนี้ใช้ไม่ได้เลย" },
      { word: "I am of the opinion", thaiMeaning: "ข้าพเจ้าเห็นว่า" },
      { word: "beneficial and detrimental", thaiMeaning: "มีทั้งประโยชน์และโทษ" },
      { word: "quickly and accurately", thaiMeaning: "อย่างรวดเร็วและแม่นยำ" },
      { word: "entirely new careers", thaiMeaning: "อาชีพใหม่ทั้งหมด" },
      { word: "a decade ago", thaiMeaning: "เมื่อทศวรรษที่แล้ว" }
    ]
  },
  {
    id: 't2-ad-15',
    number: 15,
    typeId: 'advantages-disadvantages',
    title: 'Robots in Society',
    questionText:
      'Some people believe that robots are very important for the future of human development, while others believe that they are dangerous and have a negative impact on society. Do the benefits of using robots in society outweigh the drawbacks?',
    meta: 'South Africa · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      { role: 'intro', text: "It has been widely argued that while the growing use of robots in society is both beneficial and detrimental to human development, this essay argues that the benefits are far greater than the drawbacks.", thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การใช้หุ่นยนต์ในสังคมที่เพิ่มมากขึ้นจะทั้งเป็นประโยชน์และเป็นโทษต่อการพัฒนาของมนุษย์ แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก' },
      { role: 'body1', text: "To begin with, there are a number of benefits associated with the growing use of robots in society. The first benefit is that robots can perform dangerous tasks that would otherwise put human workers at serious risk. For example, robots are now routinely used to defuse explosives and inspect damaged nuclear reactors, including at the Fukushima plant in Japan. Another advantage is that robots dramatically improve precision and efficiency in fields such as medicine. For instance, surgeons using robotic-assisted systems at Johns Hopkins Hospital have reported significantly fewer complications during complex operations in recent years.", thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการใช้หุ่นยนต์ในสังคมที่เพิ่มมากขึ้น ประโยชน์ประการแรกคือ หุ่นยนต์สามารถทำงานที่เป็นอันตรายซึ่งมิฉะนั้นจะทำให้แรงงานมนุษย์ตกอยู่ในความเสี่ยงร้ายแรงได้ ตัวอย่างเช่น ปัจจุบันหุ่นยนต์ถูกใช้เป็นประจำในการเก็บกู้วัตถุระเบิดและตรวจสอบเครื่องปฏิกรณ์นิวเคลียร์ที่เสียหาย รวมถึงที่โรงไฟฟ้าฟุกุชิมะในญี่ปุ่น ข้อดีอีกประการหนึ่งคือ หุ่นยนต์ช่วยเพิ่มความแม่นยำและประสิทธิภาพอย่างมากในสาขาต่าง ๆ เช่น การแพทย์ ยกตัวอย่างเช่น ศัลยแพทย์ที่ใช้ระบบผ่าตัดด้วยหุ่นยนต์ช่วยที่โรงพยาบาล Johns Hopkins รายงานว่ามีภาวะแทรกซ้อนลดลงอย่างมีนัยสำคัญในระหว่างการผ่าตัดที่ซับซ้อนในช่วงไม่กี่ปีที่ผ่านมา' },
      { role: 'body2', text: "However, some might be concerned regarding the potential for robots to replace human workers and reduce social interaction. This is because increasing automation may leave many low-skilled workers permanently unemployed. To illustrate, several manufacturing towns in the American Midwest have experienced sharp job losses since factories introduced robotic assembly lines. However, this argument is simply invalid given that displaced workers can be retrained for newly created technical and supervisory roles. For example, Germany's government-funded retraining schemes have successfully transitioned thousands of former factory workers into robot maintenance and programming careers nationwide.", thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับความเป็นไปได้ที่หุ่นยนต์จะเข้ามาแทนที่แรงงานมนุษย์และลดปฏิสัมพันธ์ทางสังคม ทั้งนี้เพราะระบบอัตโนมัติที่เพิ่มขึ้นอาจทำให้แรงงานทักษะต่ำจำนวนมากตกงานอย่างถาวร ยกตัวอย่างเช่น เมืองอุตสาหกรรมหลายแห่งในแถบมิดเวสต์ของสหรัฐอเมริกาประสบกับการสูญเสียตำแหน่งงานอย่างรุนแรงนับตั้งแต่โรงงานนำสายการประกอบด้วยหุ่นยนต์มาใช้ อย่างไรก็ตาม ข้อโต้แย้งนี้ไม่ถูกต้องเลย เนื่องจากแรงงานที่ถูกแทนที่สามารถได้รับการฝึกอบรมใหม่สำหรับตำแหน่งงานด้านเทคนิคและงานควบคุมดูแลที่สร้างขึ้นใหม่ ตัวอย่างเช่น โครงการฝึกอบรมใหม่ที่ได้รับทุนจากรัฐบาลเยอรมนีประสบความสำเร็จในการเปลี่ยนผ่านอดีตพนักงานโรงงานหลายพันคนไปสู่อาชีพซ่อมบำรุงและเขียนโปรแกรมหุ่นยนต์ทั่วประเทศ' },
      { role: 'conclusion', text: "In conclusion, although it is undeniable that some might be concerned in terms of job losses caused by robots, I am of the opinion that the benefits of using robots in society, including safety and improved precision, are far greater than the drawbacks.", thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าบางคนอาจกังวลเรื่องการสูญเสียตำแหน่งงานที่เกิดจากหุ่นยนต์ แต่ข้าพเจ้ามีความเห็นว่าประโยชน์ของการใช้หุ่นยนต์ในสังคม ซึ่งรวมถึงความปลอดภัยและความแม่นยำที่ดีขึ้น มีมากกว่าข้อเสียอย่างมาก' }
    ],
    vocab: [
      { word: "nuclear reactors", thaiMeaning: "เตาปฏิกรณ์นิวเคลียร์" },
      { word: "robotic-assisted systems", thaiMeaning: "ระบบหุ่นยนต์ช่วยปฏิบัติงาน" },
      { word: "assembly lines", thaiMeaning: "สายการประกอบ" },
      { word: "retraining schemes", thaiMeaning: "โครงการฝึกอบรมทักษะใหม่" },
      { word: "dangerous tasks", thaiMeaning: "งานอันตราย" },
      { word: "human workers", thaiMeaning: "แรงงานมนุษย์" },
      { word: "defuse explosives", thaiMeaning: "กู้ระเบิด" },
      { word: "social interaction", thaiMeaning: "ปฏิสัมพันธ์ทางสังคม" },
      { word: "low-skilled workers", thaiMeaning: "แรงงานทักษะต่ำ" },
      { word: "displaced workers", thaiMeaning: "แรงงานที่ถูกแทนที่" },
      { word: "supervisory roles", thaiMeaning: "ตำแหน่งงานกำกับดูแล" },
      { word: "robot maintenance", thaiMeaning: "การบำรุงรักษาหุ่นยนต์" },
      { word: "programming careers", thaiMeaning: "อาชีพด้านการเขียนโปรแกรม" },
      { word: "improved precision", thaiMeaning: "ความแม่นยำที่ดีขึ้น" },
      { word: "complex operations", thaiMeaning: "การผ่าตัดที่ซับซ้อน" },
      { word: "permanently unemployed", thaiMeaning: "ว่างงานอย่างถาวร" },
      { word: "human development", thaiMeaning: "การพัฒนาของมนุษย์" },
      { word: "fewer complications", thaiMeaning: "ภาวะแทรกซ้อนน้อยลง" },
      { word: "sharp job losses", thaiMeaning: "การสูญเสียงานอย่างรวดเร็ว" },
      { word: "serious risk", thaiMeaning: "ความเสี่ยงร้ายแรง" },
      { word: "growing use of robots", thaiMeaning: "การใช้หุ่นยนต์ที่เพิ่มขึ้น" },
      { word: "Fukushima plant", thaiMeaning: "โรงไฟฟ้านิวเคลียร์ฟุกุชิมะ" },
      { word: "precision and efficiency", thaiMeaning: "ความแม่นยำและประสิทธิภาพ" },
      { word: "American Midwest", thaiMeaning: "มิดเวสต์ของสหรัฐฯ" },
      { word: "former factory workers", thaiMeaning: "อดีตคนงานโรงงาน" },
      { word: "far greater than the drawbacks", thaiMeaning: "มากกว่าข้อเสียมาก" },
      { word: "this argument is simply invalid", thaiMeaning: "ข้อโต้แย้งนี้ใช้ไม่ได้เลย" },
      { word: "I am of the opinion", thaiMeaning: "ข้าพเจ้าเห็นว่า" },
      { word: "beneficial and detrimental", thaiMeaning: "มีทั้งประโยชน์และโทษ" },
      { word: "increasing automation", thaiMeaning: "ระบบอัตโนมัติที่เพิ่มขึ้น" },
      { word: "Johns Hopkins Hospital", thaiMeaning: "โรงพยาบาลจอห์นส์ ฮอปกินส์" },
      { word: "manufacturing towns", thaiMeaning: "เมืองอุตสาหกรรม" }
    ]
  },

  // ── Double Question ──────────────────────────────────────────────────
  {
    id: 't2-dq-1',
    number: 1,
    typeId: 'double-question',
    title: 'Living Longer, Fewer Babies',
    questionText:
      'In many countries, people are living longer and birth rates are falling. What problems does this cause? What measures could be taken to solve them?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that increasing life expectancy, combined with falling birth rates, is placing considerable pressure on governments around the world. This essay will elaborate on the problems this trend causes before suggesting some measures to solve them.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า อายุขัยที่เพิ่มขึ้นประกอบกับอัตราการเกิดที่ลดลงกำลังสร้างแรงกดดันอย่างมากต่อรัฐบาลทั่วโลก เรียงความนี้จะอธิบายถึงปัญหาที่แนวโน้มนี้ก่อให้เกิดขึ้น ก่อนจะเสนอมาตรการบางประการเพื่อแก้ไขปัญหาดังกล่าว'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of challenges associated with an ageing population. The first challenge is that healthcare systems face growing pressure as elderly citizens require more frequent medical treatment. For example, Japan, where more than 29% of the population is now over 65, has seen its national healthcare spending rise sharply over the past decade. Another challenge is that a shrinking workforce must support a growing number of retirees. For instance, countries such as Italy now have far fewer working-age taxpayers for every pensioner than they did in 1990.",
        thai: 'เริ่มต้นด้วย มีความท้าทายหลายประการที่เกี่ยวข้องกับสังคมผู้สูงอายุ ความท้าทายประการแรกคือ ระบบสาธารณสุขต้องเผชิญกับแรงกดดันที่เพิ่มขึ้น เนื่องจากผู้สูงอายุต้องการการรักษาพยาบาลบ่อยครั้งมากขึ้น ตัวอย่างเช่น ญี่ปุ่นซึ่งปัจจุบันมีประชากรอายุมากกว่า 65 ปีมากกว่าร้อยละ 29 มีค่าใช้จ่ายด้านสาธารณสุขของประเทศเพิ่มขึ้นอย่างมากในช่วงทศวรรษที่ผ่านมา ความท้าทายอีกประการหนึ่งคือ กำลังแรงงานที่หดตัวลงต้องแบกรับภาระดูแลผู้เกษียณอายุที่มีจำนวนเพิ่มขึ้น ยกตัวอย่างเช่น ประเทศอย่างอิตาลีปัจจุบันมีผู้เสียภาษีในวัยทำงานต่อผู้รับบำนาญหนึ่งคนน้อยกว่าที่เคยมีในปี 1990 มาก'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that governments could adopt. The first is that raising the retirement age would allow older citizens to remain economically active for longer. For example, Germany has gradually raised its retirement age to 67 in order to ease pressure on its pension system. Another measure is that encouraging higher birth rates through financial incentives could help rebalance the population over time. For instance, France offers generous childcare subsidies, which have helped it maintain one of the highest birth rates in Europe.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่รัฐบาลสามารถนำมาใช้ได้ มาตรการแรกคือ การเลื่อนอายุเกษียณให้สูงขึ้นจะช่วยให้ประชาชนสูงอายุยังคงมีบทบาททางเศรษฐกิจได้นานขึ้น ตัวอย่างเช่น เยอรมนีได้ค่อย ๆ เลื่อนอายุเกษียณเป็น 67 ปี เพื่อลดแรงกดดันต่อระบบบำนาญของประเทศ มาตรการอีกประการหนึ่งคือ การส่งเสริมให้อัตราการเกิดสูงขึ้นผ่านสิ่งจูงใจทางการเงินอาจช่วยปรับสมดุลของประชากรได้ในระยะยาว ยกตัวอย่างเช่น ฝรั่งเศสให้เงินอุดหนุนค่าเลี้ยงดูบุตรอย่างเอื้อเฟื้อ ซึ่งช่วยให้ประเทศนี้ยังคงมีอัตราการเกิดสูงที่สุดแห่งหนึ่งในยุโรป'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that an ageing population creates serious challenges for governments, I am of the opinion that a combination of workforce reform and family support policies can help societies adapt successfully over the coming decades.",
        thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าสังคมผู้สูงอายุก่อให้เกิดความท้าทายอย่างร้ายแรงต่อรัฐบาล แต่ข้าพเจ้ามีความเห็นว่าการผสมผสานระหว่างการปฏิรูปกำลังแรงงานและนโยบายสนับสนุนครอบครัวสามารถช่วยให้สังคมปรับตัวได้สำเร็จในทศวรรษต่อ ๆ ไป'
      }
    ],
    vocab: [
      { word: "healthcare spending", thaiMeaning: "ค่าใช้จ่ายด้านสุขภาพ" },
      { word: "working-age taxpayers", thaiMeaning: "ผู้เสียภาษีวัยทำงาน" },
      { word: "childcare subsidies", thaiMeaning: "เงินอุดหนุนค่าเลี้ยงดูเด็ก" },
      { word: "birth rates", thaiMeaning: "อัตราการเกิด" },
      { word: "life expectancy", thaiMeaning: "อายุขัยเฉลี่ย" },
      { word: "ageing population", thaiMeaning: "สังคมสูงวัย" },
      { word: "healthcare systems", thaiMeaning: "ระบบสาธารณสุข" },
      { word: "elderly citizens", thaiMeaning: "ผู้สูงอายุ" },
      { word: "medical treatment", thaiMeaning: "การรักษาพยาบาล" },
      { word: "shrinking workforce", thaiMeaning: "กำลังแรงงานที่หดตัว" },
      { word: "retirement age", thaiMeaning: "อายุเกษียณ" },
      { word: "economically active", thaiMeaning: "มีกิจกรรมทางเศรษฐกิจ" },
      { word: "pension system", thaiMeaning: "ระบบบำนาญ" },
      { word: "financial incentives", thaiMeaning: "สิ่งจูงใจทางการเงิน" },
      { word: "family support policies", thaiMeaning: "นโยบายสนับสนุนครอบครัว" },
      { word: "workforce reform", thaiMeaning: "การปฏิรูปกำลังแรงงาน" },
      { word: "considerable pressure", thaiMeaning: "แรงกดดันอย่างมาก" },
      { word: "growing number of retirees", thaiMeaning: "จำนวนผู้เกษียณที่เพิ่มขึ้น" },
      { word: "ease pressure", thaiMeaning: "บรรเทาแรงกดดัน" },
      { word: "rebalance the population", thaiMeaning: "ปรับสมดุลประชากร" },
      { word: "governments around the world", thaiMeaning: "รัฐบาลทั่วโลก" },
      { word: "growing pressure", thaiMeaning: "แรงกดดันที่เพิ่มขึ้น" },
      { word: "rise sharply", thaiMeaning: "เพิ่มขึ้นอย่างรวดเร็ว" },
      { word: "over the past decade", thaiMeaning: "ในช่วงทศวรรษที่ผ่านมา" },
      { word: "for every pensioner", thaiMeaning: "ต่อผู้รับบำนาญหนึ่งคน" },
      { word: "serious challenges", thaiMeaning: "ความท้าทายที่ร้ายแรง" },
      { word: "coming decades", thaiMeaning: "ทศวรรษที่จะมาถึง" },
      { word: "societies adapt successfully", thaiMeaning: "สังคมปรับตัวได้สำเร็จ" },
      { word: "older citizens", thaiMeaning: "พลเมืองสูงอายุ" },
      { word: "elaborate on the problems", thaiMeaning: "อธิบายปัญหาอย่างละเอียด" },
      { word: "Turning to possible solutions", thaiMeaning: "เมื่อหันไปดูทางออกที่เป็นไปได้" },
      { word: "measures that governments could adopt", thaiMeaning: "มาตรการที่รัฐบาลอาจนำมาใช้" }
    ]
  },
  {
    id: 't2-dq-2',
    number: 2,
    typeId: 'double-question',
    title: 'Older People and Technology',
    questionText:
      'Some older people find it difficult to use modern technology such as smartphones and the Internet. What benefits could older people gain from using technology more? What could be done to encourage them to use it?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while advanced technology has brought many beneficial changes to the world, many older people today struggle to make use of devices such as smartphones and the Internet. This essay will elaborate on the benefits older people could gain from using technology more before suggesting some measures to encourage them to do so.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้เทคโนโลยีขั้นสูงจะนำมาซึ่งการเปลี่ยนแปลงที่เป็นประโยชน์มากมายต่อโลก แต่ผู้สูงอายุจำนวนมากในปัจจุบันกลับประสบปัญหาในการใช้อุปกรณ์ต่าง ๆ เช่น สมาร์ตโฟนและอินเทอร์เน็ต เรียงความนี้จะอธิบายถึงประโยชน์ที่ผู้สูงอายุจะได้รับจากการใช้เทคโนโลยีมากขึ้น ก่อนจะเสนอมาตรการบางประการเพื่อส่งเสริมให้พวกเขาทำเช่นนั้น'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits older people could gain from advanced technology. The first benefit is that video-calling applications allow elderly people to stay in regular contact with family members who live far away. For example, many grandparents now use video calls to see their grandchildren grow up despite living in different countries. Another benefit is that health-monitoring devices can alert both elderly users and their doctors to medical problems at an early stage. For instance, wearable devices that track heart rate can warn users of irregular patterns before a serious health issue develops.",
        thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่ผู้สูงอายุจะได้รับจากเทคโนโลยีขั้นสูง ประโยชน์ประการแรกคือ แอปพลิเคชันวิดีโอคอลช่วยให้ผู้สูงอายุติดต่อกับสมาชิกครอบครัวที่อาศัยอยู่ไกลกันได้อย่างสม่ำเสมอ ตัวอย่างเช่น ปู่ย่าตายายจำนวนมากในปัจจุบันใช้วิดีโอคอลเพื่อดูหลานเติบโตขึ้น แม้จะอาศัยอยู่คนละประเทศ ประโยชน์อีกประการหนึ่งคือ อุปกรณ์ตรวจสุขภาพสามารถแจ้งเตือนทั้งผู้สูงอายุที่ใช้งานและแพทย์ของพวกเขาเกี่ยวกับปัญหาสุขภาพได้ตั้งแต่ระยะแรก ยกตัวอย่างเช่น อุปกรณ์สวมใส่ที่ติดตามอัตราการเต้นของหัวใจสามารถเตือนผู้ใช้ถึงรูปแบบที่ผิดปกติได้ก่อนที่ปัญหาสุขภาพร้ายแรงจะเกิดขึ้น'
      },
      {
        role: 'body2',
        text: "Turning to possible measures, there are several ways older people could be encouraged to use consumer electronics more often. The first is that community centres could offer free, beginner-friendly technology classes designed specifically for older residents. For example, local libraries in several UK cities now run weekly digital skills workshops for elderly visitors. Another measure is that manufacturers could design devices with simpler interfaces and larger text specifically for older users. For instance, some smartphone models now include an \"easy mode\" that displays larger icons and fewer menu options.",
        thai: 'เมื่อพิจารณาถึงมาตรการที่เป็นไปได้ มีหลายวิธีที่จะส่งเสริมให้ผู้สูงอายุใช้อุปกรณ์อิเล็กทรอนิกส์บ่อยขึ้น วิธีแรกคือ ศูนย์ชุมชนสามารถเปิดสอนชั้นเรียนเทคโนโลยีสำหรับผู้เริ่มต้นแบบไม่มีค่าใช้จ่าย ซึ่งออกแบบมาโดยเฉพาะสำหรับผู้อยู่อาศัยสูงวัย ตัวอย่างเช่น ห้องสมุดท้องถิ่นในหลายเมืองของสหราชอาณาจักรปัจจุบันจัดเวิร์กช็อปทักษะดิจิทัลรายสัปดาห์สำหรับผู้มาเยือนสูงวัย มาตรการอีกประการหนึ่งคือ ผู้ผลิตสามารถออกแบบอุปกรณ์ที่มีอินเทอร์เฟซที่เรียบง่ายขึ้นและตัวอักษรที่ใหญ่ขึ้นโดยเฉพาะสำหรับผู้ใช้สูงวัย ยกตัวอย่างเช่น สมาร์ตโฟนบางรุ่นปัจจุบันมี "โหมดใช้งานง่าย" ที่แสดงไอคอนขนาดใหญ่ขึ้นและมีตัวเลือกเมนูน้อยลง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that many older people currently struggle with modern technology, I am of the opinion that accessible training and better device design can help them enjoy its full benefits.",
        thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าผู้สูงอายุจำนวนมากในปัจจุบันประสบปัญหากับเทคโนโลยีสมัยใหม่ แต่ข้าพเจ้ามีความเห็นว่าการฝึกอบรมที่เข้าถึงได้และการออกแบบอุปกรณ์ที่ดีขึ้นสามารถช่วยให้พวกเขาได้รับประโยชน์อย่างเต็มที่จากเทคโนโลยี'
      }
    ],
    vocab: [
      { word: "digital skills", thaiMeaning: "ทักษะดิจิทัล" },
      { word: "wearable devices", thaiMeaning: "อุปกรณ์สวมใส่" },
      { word: "simpler interfaces", thaiMeaning: "หน้าจอใช้งานง่ายขึ้น" },
      { word: "video-calling applications", thaiMeaning: "แอปพลิเคชันวิดีโอคอล" },
      { word: "health-monitoring devices", thaiMeaning: "อุปกรณ์ติดตามสุขภาพ" },
      { word: "irregular patterns", thaiMeaning: "รูปแบบที่ผิดปกติ" },
      { word: "consumer electronics", thaiMeaning: "อุปกรณ์อิเล็กทรอนิกส์ผู้บริโภค" },
      { word: "community centres", thaiMeaning: "ศูนย์ชุมชน" },
      { word: "beginner-friendly technology classes", thaiMeaning: "คลาสเทคโนโลยีสำหรับผู้เริ่มต้น" },
      { word: "larger text", thaiMeaning: "ตัวอักษรขนาดใหญ่" },
      { word: "easy mode", thaiMeaning: "โหมดใช้งานง่าย" },
      { word: "menu options", thaiMeaning: "ตัวเลือกเมนู" },
      { word: "advanced technology", thaiMeaning: "เทคโนโลยีขั้นสูง" },
      { word: "regular contact", thaiMeaning: "การติดต่อเป็นประจำ" },
      { word: "medical problems", thaiMeaning: "ปัญหาสุขภาพ" },
      { word: "heart rate", thaiMeaning: "อัตราการเต้นของหัวใจ" },
      { word: "device design", thaiMeaning: "การออกแบบอุปกรณ์" },
      { word: "accessible training", thaiMeaning: "การฝึกอบรมที่เข้าถึงได้" },
      { word: "modern technology", thaiMeaning: "เทคโนโลยีสมัยใหม่" },
      { word: "serious health issue", thaiMeaning: "ปัญหาสุขภาพร้ายแรง" },
      { word: "family members who live far away", thaiMeaning: "สมาชิกครอบครัวที่อยู่ห่างไกล" },
      { word: "early stage", thaiMeaning: "ระยะเริ่มต้น" },
      { word: "larger icons", thaiMeaning: "ไอคอนขนาดใหญ่" },
      { word: "enjoy its full benefits", thaiMeaning: "ได้รับประโยชน์อย่างเต็มที่" },
      { word: "elderly people", thaiMeaning: "ผู้สูงอายุ" },
      { word: "grandchildren grow up", thaiMeaning: "หลานเติบโตขึ้น" },
      { word: "smartphone models", thaiMeaning: "รุ่นสมาร์ทโฟน" },
      { word: "local libraries", thaiMeaning: "ห้องสมุดท้องถิ่น" },
      { word: "UK cities", thaiMeaning: "เมืองในสหราชอาณาจักร" },
      { word: "older residents", thaiMeaning: "ผู้อยู่อาศัยสูงอายุ" },
      { word: "elderly visitors", thaiMeaning: "ผู้เยี่ยมชมสูงอายุ" },
      { word: "video calls", thaiMeaning: "การโทรแบบวิดีโอ" }
    ]
  },
  {
    id: 't2-dq-3',
    number: 3,
    typeId: 'double-question',
    title: 'The Fresh Water Shortage',
    questionText:
      'Access to fresh water has become a problem in many parts of the world. What are the reasons for this? What measures could be taken to solve this problem?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that access to fresh water has become a growing global problem in recent years. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า การเข้าถึงน้ำจืดได้กลายเป็นปัญหาระดับโลกที่เพิ่มมากขึ้นในช่วงไม่กี่ปีที่ผ่านมา เรียงความนี้จะอธิบายถึงสาเหตุของปัญหานี้ ก่อนจะเสนอแนวทางแก้ไขบางประการเพื่อจัดการกับปัญหานี้'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why fresh water has become scarce in many regions. The first reason is that rising global temperatures are causing rivers, lakes, and glaciers to shrink at unprecedented rates. For example, the Colorado River in the United States now regularly runs dry before reaching the sea due to prolonged drought. Another reason is that rapid population growth has significantly increased overall water demand for agriculture and industry, particularly in rapidly urbanising regions. For instance, countries such as India now use groundwater faster than natural rainfall can replenish it.",
        thai: 'เริ่มต้นด้วย มีเหตุผลหลายประการที่ทำให้น้ำจืดกลายเป็นสิ่งขาดแคลนในหลายภูมิภาค เหตุผลประการแรกคือ อุณหภูมิโลกที่สูงขึ้นทำให้แม่น้ำ ทะเลสาบ และธารน้ำแข็งหดตัวลงในอัตราที่ไม่เคยเกิดขึ้นมาก่อน ตัวอย่างเช่น แม่น้ำโคโลราโดในสหรัฐอเมริกาปัจจุบันมักจะแห้งขอดก่อนที่จะไหลถึงทะเล เนื่องจากภาวะแล้งที่ยืดเยื้อ เหตุผลอีกประการหนึ่งคือ การเติบโตอย่างรวดเร็วของประชากรทำให้ความต้องการน้ำโดยรวมเพิ่มขึ้นอย่างมากสำหรับภาคเกษตรกรรมและอุตสาหกรรม โดยเฉพาะในภูมิภาคที่กำลังกลายเป็นเมืองอย่างรวดเร็ว ยกตัวอย่างเช่น ประเทศอย่างอินเดียปัจจุบันใช้น้ำใต้ดินเร็วกว่าที่น้ำฝนตามธรรมชาติจะเติมเต็มได้'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest in modern irrigation systems that use significantly less water than traditional methods. For example, Israel has become a world leader in drip irrigation technology, cutting agricultural water use dramatically. Another measure is that individuals could reduce personal water waste through simple daily habits, such as taking shorter showers and fixing leaking taps. For instance, a single dripping tap can waste more than 20 litres of water every single day.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ได้ มาตรการแรกคือ รัฐบาลสามารถลงทุนในระบบชลประทานสมัยใหม่ที่ใช้น้ำน้อยกว่าวิธีดั้งเดิมอย่างมาก ตัวอย่างเช่น อิสราเอลได้กลายเป็นผู้นำระดับโลกด้านเทคโนโลยีการให้น้ำแบบหยด ซึ่งช่วยลดการใช้น้ำในภาคเกษตรกรรมลงอย่างมาก มาตรการอีกประการหนึ่งคือ ประชาชนแต่ละคนสามารถลดการสิ้นเปลืองน้ำส่วนบุคคลผ่านนิสัยประจำวันง่าย ๆ เช่น การอาบน้ำให้สั้นลงและซ่อมก๊อกน้ำที่รั่ว ยกตัวอย่างเช่น ก๊อกน้ำที่หยดเพียงจุดเดียวสามารถสิ้นเปลืองน้ำได้มากกว่า 20 ลิตรทุกวัน'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that fresh water scarcity is a complex global issue, I am of the opinion that a combination of government investment and individual responsibility can significantly ease this problem.",
        thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าการขาดแคลนน้ำจืดเป็นปัญหาระดับโลกที่ซับซ้อน แต่ข้าพเจ้ามีความเห็นว่าการผสมผสานระหว่างการลงทุนของรัฐบาลและความรับผิดชอบส่วนบุคคลสามารถบรรเทาปัญหานี้ได้อย่างมาก'
      }
    ],
    vocab: [
      { word: "drip irrigation", thaiMeaning: "การให้น้ำแบบหยด" },
      { word: "groundwater", thaiMeaning: "น้ำใต้ดิน" },
      { word: "agricultural water use", thaiMeaning: "การใช้น้ำเพื่อการเกษตร" },
      { word: "prolonged drought", thaiMeaning: "ภัยแล้งที่ยืดเยื้อ" },
      { word: "fresh water scarcity", thaiMeaning: "ภาวะขาดแคลนน้ำจืด" },
      { word: "global temperatures", thaiMeaning: "อุณหภูมิโลก" },
      { word: "unprecedented rates", thaiMeaning: "อัตราที่ไม่เคยเกิดขึ้นมาก่อน" },
      { word: "population growth", thaiMeaning: "การเติบโตของประชากร" },
      { word: "water demand", thaiMeaning: "ความต้องการใช้น้ำ" },
      { word: "urbanising regions", thaiMeaning: "ภูมิภาคที่กำลังกลายเป็นเมือง" },
      { word: "irrigation systems", thaiMeaning: "ระบบชลประทาน" },
      { word: "water waste", thaiMeaning: "การใช้น้ำอย่างสิ้นเปลือง" },
      { word: "leaking taps", thaiMeaning: "ก๊อกน้ำที่รั่ว" },
      { word: "individual responsibility", thaiMeaning: "ความรับผิดชอบส่วนบุคคล" },
      { word: "government investment", thaiMeaning: "การลงทุนของรัฐ" },
      { word: "natural rainfall", thaiMeaning: "น้ำฝนตามธรรมชาติ" },
      { word: "traditional methods", thaiMeaning: "วิธีดั้งเดิม" },
      { word: "shorter showers", thaiMeaning: "การอาบน้ำที่สั้นลง" },
      { word: "runs dry", thaiMeaning: "แห้งเหือด" },
      { word: "replenish it", thaiMeaning: "เติมกลับคืนได้" },
      { word: "access to fresh water", thaiMeaning: "การเข้าถึงน้ำจืด" },
      { word: "growing global problem", thaiMeaning: "ปัญหาโลกระดับที่ทวีความรุนแรง" },
      { word: "Colorado River", thaiMeaning: "แม่น้ำโคโลราโด" },
      { word: "simple daily habits", thaiMeaning: "นิสัยประจำวันง่ายๆ" },
      { word: "dripping tap", thaiMeaning: "ก๊อกน้ำที่หยด" },
      { word: "complex global issue", thaiMeaning: "ประเด็นโลกระดับที่ซับซ้อน" },
      { word: "significantly ease this problem", thaiMeaning: "บรรเทาปัญหานี้ได้อย่างมาก" },
      { word: "world leader", thaiMeaning: "ผู้นำระดับโลก" },
      { word: "agriculture and industry", thaiMeaning: "เกษตรกรรมและอุตสาหกรรม" },
      { word: "reaching the sea", thaiMeaning: "ไหลถึงทะเล" },
      { word: "litres of water", thaiMeaning: "ลิตรของน้ำ" },
      { word: "rivers, lakes, and glaciers", thaiMeaning: "แม่น้ำ ทะเลสาบ และธารน้ำแข็ง" }
    ]
  },
  {
    id: 't2-dq-4',
    number: 4,
    typeId: 'double-question',
    title: 'Why Drivers Break Road Safety Laws',
    questionText:
      'Although laws exist to make roads safer, many drivers still break them by speeding or using mobile phones. Why do drivers continue to break these laws? What measures could be taken to address this problem?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that although driving laws exist in every country to ensure road safety, many drivers continue to break them by speeding or using mobile phones while driving. This essay will elaborate on the reasons behind this behaviour before suggesting some measures to tackle this issue.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้ทุกประเทศจะมีกฎหมายจราจรเพื่อความปลอดภัยบนท้องถนน แต่ผู้ขับขี่จำนวนมากยังคงฝ่าฝืนกฎหมายเหล่านั้นด้วยการขับรถเร็วเกินกำหนดหรือใช้โทรศัพท์มือถือขณะขับรถ เรียงความนี้จะอธิบายถึงเหตุผลเบื้องหลังพฤติกรรมนี้ ก่อนจะเสนอมาตรการบางประการเพื่อจัดการกับปัญหานี้'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why drivers continue to break road safety laws. The first reason is that many drivers underestimate the risks involved, believing that breaking minor rules will not lead to an accident. For example, surveys of drivers who use their phones at the wheel often reveal that most believe they can do so safely just this once. Another reason is that penalties for these offences are often too weak to act as an effective deterrent. For instance, fines for using a mobile phone while driving remain relatively low in several countries compared to the potential harm caused.",
        thai: 'เริ่มต้นด้วย มีเหตุผลหลายประการที่ทำให้ผู้ขับขี่ยังคงฝ่าฝืนกฎหมายความปลอดภัยบนท้องถนน เหตุผลประการแรกคือ ผู้ขับขี่จำนวนมากประเมินความเสี่ยงที่เกี่ยวข้องต่ำเกินไป โดยเชื่อว่าการฝ่าฝืนกฎเล็ก ๆ น้อย ๆ จะไม่นำไปสู่อุบัติเหตุ ตัวอย่างเช่น แบบสำรวจผู้ขับขี่ที่ใช้โทรศัพท์ขณะขับรถมักเผยว่าส่วนใหญ่เชื่อว่าตนสามารถทำเช่นนั้นได้อย่างปลอดภัยเพียงครั้งนี้ครั้งเดียว เหตุผลอีกประการหนึ่งคือ บทลงโทษสำหรับความผิดเหล่านี้มักอ่อนเกินไปจนไม่สามารถยับยั้งได้อย่างมีประสิทธิภาพ ยกตัวอย่างเช่น ค่าปรับสำหรับการใช้โทรศัพท์มือถือขณะขับรถยังคงต่ำค่อนข้างมากในหลายประเทศ เมื่อเทียบกับอันตรายที่อาจเกิดขึ้น'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help solve this problem. The first is that governments could introduce stricter penalties, such as higher fines and automatic licence suspensions for repeat offenders. For example, some countries have successfully reduced phone-related accidents after introducing points-based licence systems. Another measure is that technology companies could design devices that automatically restrict phone use whenever a vehicle is moving. For instance, several smartphone models now include a driving mode that silences notifications once the car reaches a certain speed.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ได้ มาตรการแรกคือ รัฐบาลสามารถออกบทลงโทษที่เข้มงวดขึ้น เช่น ค่าปรับที่สูงขึ้นและการเพิกถอนใบขับขี่โดยอัตโนมัติสำหรับผู้กระทำผิดซ้ำ ตัวอย่างเช่น บางประเทศสามารถลดอุบัติเหตุที่เกี่ยวข้องกับการใช้โทรศัพท์ได้สำเร็จหลังจากนำระบบสะสมแต้มใบขับขี่มาใช้ มาตรการอีกประการหนึ่งคือ บริษัทเทคโนโลยีสามารถออกแบบอุปกรณ์ที่จำกัดการใช้โทรศัพท์โดยอัตโนมัติเมื่อใดก็ตามที่รถกำลังเคลื่อนที่ ยกตัวอย่างเช่น สมาร์ตโฟนหลายรุ่นปัจจุบันมีโหมดขับขี่ที่ปิดเสียงการแจ้งเตือนเมื่อรถวิ่งถึงความเร็วระดับหนึ่ง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that changing driver behaviour takes time, I am of the opinion that stricter penalties combined with smarter technology can significantly improve road safety.",
        thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าการเปลี่ยนพฤติกรรมผู้ขับขี่ต้องใช้เวลา แต่ข้าพเจ้ามีความเห็นว่าบทลงโทษที่เข้มงวดขึ้นประกอบกับเทคโนโลยีที่ชาญฉลาดขึ้นสามารถช่วยปรับปรุงความปลอดภัยบนท้องถนนได้อย่างมาก'
      }
    ],
    vocab: [
      { word: "licence suspensions", thaiMeaning: "การพักใช้ใบขับขี่" },
      { word: "repeat offenders", thaiMeaning: "ผู้กระทำผิดซ้ำ" },
      { word: "points-based licence systems", thaiMeaning: "ระบบใบขับขี่แบบสะสมแต้ม" },
      { word: "road safety", thaiMeaning: "ความปลอดภัยบนท้องถนน" },
      { word: "mobile phones", thaiMeaning: "โทรศัพท์มือถือ" },
      { word: "effective deterrent", thaiMeaning: "มาตรการป้องปรามที่มีผล" },
      { word: "stricter penalties", thaiMeaning: "บทลงโทษที่เข้มงวดขึ้น" },
      { word: "higher fines", thaiMeaning: "ค่าปรับที่สูงขึ้น" },
      { word: "phone-related accidents", thaiMeaning: "อุบัติเหตุจากโทรศัพท์" },
      { word: "driving mode", thaiMeaning: "โหมดขับรถ" },
      { word: "driver behaviour", thaiMeaning: "พฤติกรรมของผู้ขับขี่" },
      { word: "smarter technology", thaiMeaning: "เทคโนโลยีที่ฉลาดขึ้น" },
      { word: "at the wheel", thaiMeaning: "ขณะขับรถ" },
      { word: "potential harm", thaiMeaning: "อันตรายที่อาจเกิด" },
      { word: "silences notifications", thaiMeaning: "ปิดการแจ้งเตือน" },
      { word: "restrict phone use", thaiMeaning: "จำกัดการใช้โทรศัพท์" },
      { word: "driving laws", thaiMeaning: "กฎหมายการขับรถ" },
      { word: "minor rules", thaiMeaning: "กฎเล็กน้อย" },
      { word: "certain speed", thaiMeaning: "ความเร็วระดับหนึ่ง" },
      { word: "while driving", thaiMeaning: "ขณะขับรถ" },
      { word: "underestimate the risks involved", thaiMeaning: "ประเมินความเสี่ยงที่เกี่ยวข้องต่ำไป" },
      { word: "lead to an accident", thaiMeaning: "นำไปสู่อุบัติเหตุ" },
      { word: "just this once", thaiMeaning: "เพียงครั้งนี้ครั้งเดียว" },
      { word: "penalties for these offences", thaiMeaning: "บทลงโทษสำหรับความผิดเหล่านี้" },
      { word: "remain relatively low", thaiMeaning: "ยังค่อนข้างต่ำ" },
      { word: "whenever a vehicle is moving", thaiMeaning: "เมื่อใดก็ตามที่ยานพาหนะกำลังเคลื่อนที่" },
      { word: "technology companies", thaiMeaning: "บริษัทเทคโนโลยี" },
      { word: "smartphone models", thaiMeaning: "รุ่นสมาร์ทโฟน" },
      { word: "reasons behind this behaviour", thaiMeaning: "เหตุผลเบื้องหลังพฤติกรรมนี้" },
      { word: "help solve this problem", thaiMeaning: "ช่วยแก้ปัญหานี้" },
      { word: "break them by speeding", thaiMeaning: "ฝ่าฝืนด้วยการขับรถเร็วเกินกำหนด" },
      { word: "surveys of drivers", thaiMeaning: "แบบสำรวจผู้ขับขี่" }
    ]
  },
  {
    id: 't2-dq-5',
    number: 5,
    typeId: 'double-question',
    title: 'Giving Children Everything They Want',
    questionText:
      'Some parents give their children everything they want and allow them complete freedom. Does this benefit children? What are the consequences when these children grow up?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that some parents give their children everything they ask for or allow them complete freedom to do as they wish. This essay will elaborate on why this parenting style is not beneficial for children before discussing the consequences they may face once they grow up.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า พ่อแม่บางคนให้ทุกสิ่งที่ลูกร้องขอ หรืออนุญาตให้ลูกมีอิสระอย่างเต็มที่ในการทำสิ่งที่ต้องการ เรียงความนี้จะอธิบายว่าเหตุใดรูปแบบการเลี้ยงดูนี้จึงไม่เป็นประโยชน์ต่อเด็ก ก่อนจะอภิปรายถึงผลกระทบที่พวกเขาอาจเผชิญเมื่อเติบโตขึ้น'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why this parenting style is not beneficial for children. The first reason is that children who receive everything they want rarely learn the value of patience or hard work. For example, children given expensive gifts without any effort attached often show little appreciation for what they receive. Another reason is that children allowed complete freedom rarely learn to respect boundaries or authority. For instance, teachers frequently report that children raised without firm rules at home struggle to follow classroom guidelines.",
        thai: 'เริ่มต้นด้วย มีเหตุผลหลายประการที่ทำให้รูปแบบการเลี้ยงดูนี้ไม่เป็นประโยชน์ต่อเด็ก เหตุผลประการแรกคือ เด็กที่ได้รับทุกสิ่งที่ต้องการมักไม่ค่อยได้เรียนรู้คุณค่าของความอดทนหรือความขยันหมั่นเพียร ตัวอย่างเช่น เด็กที่ได้รับของขวัญราคาแพงโดยไม่ต้องพยายามใด ๆ มักแสดงความซาบซึ้งต่อสิ่งที่ได้รับน้อยมาก เหตุผลอีกประการหนึ่งคือ เด็กที่ได้รับอิสระอย่างเต็มที่มักไม่ค่อยได้เรียนรู้ที่จะเคารพขอบเขตหรือผู้มีอำนาจ ยกตัวอย่างเช่น ครูมักรายงานว่าเด็กที่เติบโตมาโดยไม่มีกฎเกณฑ์ที่ชัดเจนที่บ้านมีปัญหาในการปฏิบัติตามกฎระเบียบในห้องเรียน'
      },
      {
        role: 'body2',
        text: "Turning to the possible consequences, there are several ways this upbringing could affect these children later in life. The first is that they may struggle with discipline and responsibility once they enter the workplace. For example, employers often note that young employees who lacked structure as children find it harder to meet deadlines and follow instructions. Another consequence is that they may develop unrealistic expectations about how the wider world treats them. For instance, adults who were rarely told \"no\" as children often struggle to cope with rejection or failure later in life.",
        thai: 'เมื่อพิจารณาถึงผลกระทบที่เป็นไปได้ มีหลายวิธีที่การเลี้ยงดูแบบนี้อาจส่งผลต่อเด็กเหล่านี้ในภายหลัง วิธีแรกคือ พวกเขาอาจมีปัญหาเรื่องระเบียบวินัยและความรับผิดชอบเมื่อเข้าสู่ที่ทำงาน ตัวอย่างเช่น นายจ้างมักสังเกตว่าพนักงานอายุน้อยที่ขาดโครงสร้างในวัยเด็กมีปัญหาในการทำงานให้ทันกำหนดเวลาและปฏิบัติตามคำสั่ง ผลกระทบอีกประการหนึ่งคือ พวกเขาอาจพัฒนาความคาดหวังที่ไม่สมจริงเกี่ยวกับวิธีที่โลกภายนอกปฏิบัติต่อพวกเขา ยกตัวอย่างเช่น ผู้ใหญ่ที่แทบไม่เคยถูกปฏิเสธในวัยเด็กมักมีปัญหาในการรับมือกับการถูกปฏิเสธหรือความล้มเหลวในภายหลัง'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that parents want their children to be happy, I am of the opinion that giving children everything they want ultimately causes more harm than good.",
        thai: 'สรุปแล้ว แม้จะปฏิเสธไม่ได้ว่าพ่อแม่ต้องการให้ลูกมีความสุข แต่ข้าพเจ้ามีความเห็นว่าการให้ทุกสิ่งที่ลูกต้องการนั้น ท้ายที่สุดแล้วก่อให้เกิดผลเสียมากกว่าผลดี'
      }
    ],
    vocab: [
      { word: "firm rules", thaiMeaning: "กฎเกณฑ์ที่เข้มงวด" },
      { word: "unrealistic expectations", thaiMeaning: "ความคาดหวังที่ไม่สมจริง" },
      { word: "rejection or failure", thaiMeaning: "การถูกปฏิเสธหรือความล้มเหลว" },
      { word: "parenting style", thaiMeaning: "รูปแบบการเลี้ยงดู" },
      { word: "complete freedom", thaiMeaning: "เสรีภาพอย่างสมบูรณ์" },
      { word: "hard work", thaiMeaning: "การทำงานหนัก" },
      { word: "expensive gifts", thaiMeaning: "ของขวัญราคาแพง" },
      { word: "meet deadlines", thaiMeaning: "ส่งงานให้ทันกำหนด" },
      { word: "follow instructions", thaiMeaning: "ปฏิบัติตามคำสั่ง" },
      { word: "wider world", thaiMeaning: "โลกภายนอก" },
      { word: "discipline and responsibility", thaiMeaning: "วินัยและความรับผิดชอบ" },
      { word: "respect boundaries", thaiMeaning: "เคารพขอบเขต" },
      { word: "little appreciation", thaiMeaning: "ความซาบซึ้งเพียงน้อยนิด" },
      { word: "young employees", thaiMeaning: "พนักงานรุ่นใหม่" },
      { word: "lacked structure", thaiMeaning: "ขาดโครงสร้าง" },
      { word: "enter the workplace", thaiMeaning: "เข้าสู่โลกการทำงาน" },
      { word: "value of patience", thaiMeaning: "คุณค่าของความอดทน" },
      { word: "classroom guidelines", thaiMeaning: "แนวปฏิบัติในห้องเรียน" },
      { word: "more harm than good", thaiMeaning: "โทษมากกว่าประโยชน์" },
      { word: "effort attached", thaiMeaning: "ที่ต้องลงแรง" },
      { word: "give their children everything", thaiMeaning: "ให้ลูกทุกอย่างที่ขอ" },
      { word: "not beneficial for children", thaiMeaning: "ไม่เป็นประโยชน์ต่อเด็ก" },
      { word: "once they grow up", thaiMeaning: "เมื่อพวกเขาเติบโตขึ้น" },
      { word: "this upbringing", thaiMeaning: "การเลี้ยงดูแบบนี้" },
      { word: "later in life", thaiMeaning: "ในภายหลังของชีวิต" },
      { word: "rarely told \"no\"", thaiMeaning: "แทบไม่เคยถูกปฏิเสธ" },
      { word: "teachers frequently report", thaiMeaning: "ครูรายงานบ่อยครั้ง" },
      { word: "employers often note", thaiMeaning: "นายจ้างมักสังเกต" },
      { word: "parents want their children to be happy", thaiMeaning: "พ่อแม่ต้องการให้ลูกมีความสุข" },
      { word: "receive everything they want", thaiMeaning: "ได้รับทุกอย่างที่ต้องการ" },
      { word: "discussing the consequences", thaiMeaning: "การอภิปรายผลที่ตามมา" },
      { word: "affect these children", thaiMeaning: "ส่งผลต่อเด็กเหล่านี้" }
    ]
  },
  {
    id: 't2-dq-6',
    number: 6,
    typeId: 'double-question',
    title: 'The Rise of Personal Fitness Trainers',
    questionText:
      'In some countries, more and more people are hiring a personal fitness trainer, rather than playing sport or doing exercise classes. What are the reasons for this? Is this a positive or a negative development?',
    meta: 'Saudi Arabia · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that increasing numbers of people are now choosing to hire a personal fitness trainer instead of playing sport or attending exercise classes. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าปัจจุบันมีคนจำนวนมากขึ้นเรื่อยๆ ที่เลือกจ้างเทรนเนอร์ฟิตเนสส่วนตัว แทนที่จะเล่นกีฬาหรือเข้าคลาสออกกำลังกาย เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะอภิปรายว่านี่เป็นพัฒนาการในทางบวกหรือทางลบ'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with the growing popularity of personal training. The first reason is that busy professionals often prefer a flexible schedule that fits around demanding work commitments. For example, a 2023 survey by the International Health, Racquet and Sportsclub Association found that over 60% of new gym members in the United States booked sessions with a trainer to save time. Another reason is that this is because many people lack the confidence to exercise correctly on their own. For instance, first-time gym users frequently report feeling intimidated by group classes filled with more experienced participants.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับความนิยมที่เพิ่มขึ้นของการฝึกสอนส่วนตัว เหตุผลแรกคือคนทำงานที่ยุ่งมักชอบตารางเวลาที่ยืดหยุ่นซึ่งเข้ากับภาระงานที่หนักหน่วงได้ ตัวอย่างเช่น ผลสำรวจในปี 2023 โดย International Health, Racquet and Sportsclub Association พบว่าสมาชิกยิมใหม่ในสหรัฐอเมริกากว่า 60% จองเซสชันกับเทรนเนอร์เพื่อประหยัดเวลา อีกเหตุผลหนึ่งคือเป็นเพราะหลายคนขาดความมั่นใจที่จะออกกำลังกายอย่างถูกต้องด้วยตัวเอง ยกตัวอย่างเช่น ผู้ใช้ยิมมือใหม่มักรายงานว่ารู้สึกหวาดกลัวเมื่อต้องอยู่ในคลาสกลุ่มที่เต็มไปด้วยผู้เข้าร่วมที่มีประสบการณ์มากกว่า'
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a positive development. To explain it simply, this is because a qualified trainer can design a safe, personalised programme that reduces the risk of injury compared with unsupervised exercise. To illustrate, physiotherapy clinics in the UK have reported fewer gym-related injuries among clients who train under professional supervision. In this sense, it is evident that personal training offers genuine health benefits that extend well beyond simple convenience.",
        thai: 'สำหรับความคิดเห็นของฉัน ฉันขอโต้แย้งว่านี่เป็นพัฒนาการในทางบวก อธิบายง่ายๆ ก็คือ เพราะเทรนเนอร์ที่มีคุณสมบัติสามารถออกแบบโปรแกรมที่ปลอดภัยและเฉพาะบุคคล ซึ่งลดความเสี่ยงของการบาดเจ็บเมื่อเทียบกับการออกกำลังกายโดยไม่มีผู้ดูแล เพื่อยกตัวอย่างให้เห็นภาพ คลินิกกายภาพบำบัดในสหราชอาณาจักรได้รายงานว่าการบาดเจ็บจากยิมลดลงในกลุ่มลูกค้าที่ฝึกภายใต้การดูแลของมืออาชีพ ในแง่นี้ เป็นที่ประจักษ์ชัดว่าการฝึกสอนส่วนตัวให้ประโยชน์ด้านสุขภาพที่แท้จริง ซึ่งเกินไปกว่าเพียงความสะดวกสบาย'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that hiring a personal trainer can be expensive for many households, I am of the opinion that the safety and motivation it provides make this a beneficial trend overall.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการจ้างเทรนเนอร์ส่วนตัวอาจมีค่าใช้จ่ายสูงสำหรับหลายครัวเรือน แต่ฉันมีความเห็นว่าความปลอดภัยและแรงจูงใจที่มันมอบให้ทำให้นี่เป็นแนวโน้มที่เป็นประโยชน์โดยรวม'
      }
    ],
    vocab: [
      { word: "personal training", thaiMeaning: "การฝึกส่วนตัว" },
      { word: "flexible schedule", thaiMeaning: "ตารางเวลาที่ยืดหยุ่น" },
      { word: "personalised programme", thaiMeaning: "โปรแกรมที่ออกแบบเฉพาะบุคคล" },
      { word: "gym-related injuries", thaiMeaning: "การบาดเจ็บที่เกี่ยวกับการออกกำลังกาย" },
      { word: "personal fitness trainer", thaiMeaning: "เทรนเนอร์ออกกำลังกายส่วนตัว" },
      { word: "demanding work commitments", thaiMeaning: "ภาระงานที่หนัก" },
      { word: "growing popularity", thaiMeaning: "ความนิยมที่เพิ่มขึ้น" },
      { word: "busy professionals", thaiMeaning: "มืออาชีพที่งานยุ่ง" },
      { word: "qualified trainer", thaiMeaning: "เทรนเนอร์ที่มีคุณสมบัติ" },
      { word: "unsupervised exercise", thaiMeaning: "การออกกำลังกายโดยไม่มีผู้ดูแล" },
      { word: "professional supervision", thaiMeaning: "การดูแลโดยมืออาชีพ" },
      { word: "genuine health benefits", thaiMeaning: "ประโยชน์ด้านสุขภาพอย่างแท้จริง" },
      { word: "physiotherapy clinics", thaiMeaning: "คลินิกกายภาพบำบัด" },
      { word: "beneficial trend", thaiMeaning: "แนวโน้มที่เป็นประโยชน์" },
      { word: "risk of injury", thaiMeaning: "ความเสี่ยงต่อการบาดเจ็บ" },
      { word: "exercise classes", thaiMeaning: "คลาสออกกำลังกาย" },
      { word: "feeling intimidated", thaiMeaning: "รู้สึกขาดความมั่นใจ" },
      { word: "experienced participants", thaiMeaning: "ผู้เข้าร่วมที่มีประสบการณ์" },
      { word: "first-time gym users", thaiMeaning: "ผู้ใช้ยิมครั้งแรก" },
      { word: "positive development", thaiMeaning: "พัฒนาการในทางบวก" },
      { word: "lack the confidence", thaiMeaning: "ขาดความมั่นใจ" },
      { word: "exercise correctly", thaiMeaning: "ออกกำลังกายอย่างถูกต้อง" },
      { word: "group classes", thaiMeaning: "คลาสแบบกลุ่ม" },
      { word: "new gym members", thaiMeaning: "สมาชิกยิมใหม่" },
      { word: "simple convenience", thaiMeaning: "ความสะดวกทั่วไป" },
      { word: "many households", thaiMeaning: "หลายครัวเรือน" },
      { word: "safety and motivation", thaiMeaning: "ความปลอดภัยและแรงจูงใจ" },
      { word: "increasing numbers of people", thaiMeaning: "จำนวนคนที่เพิ่มขึ้น" },
      { word: "playing sport", thaiMeaning: "การเล่นกีฬา" },
      { word: "booked sessions", thaiMeaning: "จองเซสชัน" },
      { word: "extend well beyond", thaiMeaning: "ขยายไปไกลกว่า" },
      { word: "hiring a personal trainer", thaiMeaning: "การจ้างเทรนเนอร์ส่วนตัว" }
    ]
  },
  {
    id: 't2-dq-7',
    number: 7,
    typeId: 'double-question',
    title: 'Money as a Gift',
    questionText:
      'In more and more countries, people choose to give money on special occasions rather than giving gifts chosen personally. Why might this be the case? Is it a positive or a negative development?',
    meta: 'India · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that more and more people now choose to give money on special occasions rather than gifts chosen personally. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าปัจจุบันมีคนมากขึ้นเรื่อยๆ ที่เลือกให้เงินในโอกาสพิเศษ แทนที่จะเป็นของขวัญที่เลือกด้วยตัวเอง เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะอภิปรายว่านี่เป็นพัฒนาการในทางบวกหรือทางลบ'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with this shift towards monetary gifts. The first reason is that busy modern lifestyles leave people with very little free time to search for a suitable present. For example, a 2022 survey by Deloitte found that nearly half of consumers in the United States preferred giving cash during the holiday season because it required considerably less effort. Another reason is that this is because many givers worry about choosing something the recipient will not actually like or use. For instance, unwanted gifts are frequently returned to shops or left unused in cupboards for several years afterwards.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับการเปลี่ยนแปลงไปสู่การให้ของขวัญเป็นเงินนี้ เหตุผลแรกคือวิถีชีวิตสมัยใหม่ที่ยุ่งวุ่นวายทำให้ผู้คนมีเวลาว่างน้อยมากในการหาของขวัญที่เหมาะสม ตัวอย่างเช่น ผลสำรวจในปี 2022 โดย Deloitte พบว่าผู้บริโภคในสหรัฐอเมริกาเกือบครึ่งหนึ่งชอบให้เงินสดในช่วงเทศกาลวันหยุด เพราะต้องใช้ความพยายามน้อยกว่ามาก อีกเหตุผลหนึ่งคือเป็นเพราะผู้ให้จำนวนมากกังวลว่าจะเลือกสิ่งที่ผู้รับจะไม่ชอบหรือไม่ได้ใช้จริง ยกตัวอย่างเช่น ของขวัญที่ไม่ต้องการมักถูกนำไปคืนที่ร้านค้า หรือถูกทิ้งไว้โดยไม่ได้ใช้ในตู้เป็นเวลาหลายปีหลังจากนั้น'
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a positive development. To explain it simply, money allows the recipient to choose exactly what they need or want, reducing unnecessary waste considerably. To illustrate, several charities in India have reported that unwanted physical gifts often end up discarded, whereas cash donations are rarely wasted in this way. In this sense, it is evident that monetary gifts can be a more practical and considerate choice than many people assume.",
        thai: 'สำหรับความคิดเห็นของฉัน ฉันขอโต้แย้งว่านี่เป็นพัฒนาการในทางบวก อธิบายง่ายๆ ก็คือ เงินช่วยให้ผู้รับสามารถเลือกสิ่งที่ตนต้องการหรืออยากได้ได้อย่างแท้จริง ซึ่งลดความสูญเปล่าที่ไม่จำเป็นลงได้อย่างมาก เพื่อยกตัวอย่างให้เห็นภาพ องค์กรการกุศลหลายแห่งในอินเดียได้รายงานว่าของขวัญที่จับต้องได้ที่ไม่ต้องการมักถูกทิ้ง ในขณะที่การบริจาคเงินสดแทบไม่เคยถูกใช้อย่างสูญเปล่าในลักษณะนี้ ในแง่นี้ เป็นที่ประจักษ์ชัดว่าของขวัญที่เป็นเงินอาจเป็นทางเลือกที่ปฏิบัติได้จริงและรอบคอบมากกว่าที่หลายคนคิด'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that a personally chosen gift can feel more thoughtful and meaningful, I am of the opinion that giving money instead is ultimately a sensible and welcome trend.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าของขวัญที่เลือกด้วยตัวเองอาจรู้สึกใส่ใจและมีความหมายมากกว่า แต่ฉันมีความเห็นว่าการให้เงินแทนนั้นในท้ายที่สุดแล้วเป็นแนวโน้มที่สมเหตุสมผลและน่ายินดี'
      }
    ],
    vocab: [
      { word: "monetary gifts", thaiMeaning: "ของขวัญที่เป็นเงิน" },
      { word: "holiday season", thaiMeaning: "ช่วงเทศกาลวันหยุด" },
      { word: "unnecessary waste", thaiMeaning: "ความสิ้นเปลืองที่ไม่จำเป็น" },
      { word: "cash donations", thaiMeaning: "การบริจาคเป็นเงินสด" },
      { word: "busy modern lifestyles", thaiMeaning: "วิถีชีวิตสมัยใหม่ที่เร่งรีบ" },
      { word: "suitable present", thaiMeaning: "ของขวัญที่เหมาะสม" },
      { word: "considerably less effort", thaiMeaning: "ความพยายามน้อยกว่ามาก" },
      { word: "unwanted gifts", thaiMeaning: "ของขวัญที่ไม่ต้องการ" },
      { word: "physical gifts", thaiMeaning: "ของขวัญที่เป็นวัตถุ" },
      { word: "personally chosen gift", thaiMeaning: "ของขวัญที่เลือกเองอย่างตั้งใจ" },
      { word: "practical and considerate choice", thaiMeaning: "ทางเลือกที่ปฏิบัติได้และใส่ใจ" },
      { word: "sensible and welcome trend", thaiMeaning: "แนวโน้มที่สมเหตุสมผลและน่ายินดี" },
      { word: "special occasions", thaiMeaning: "โอกาสพิเศษ" },
      { word: "thoughtful and meaningful", thaiMeaning: "ใส่ใจและมีความหมาย" },
      { word: "returned to shops", thaiMeaning: "ถูกคืนไปที่ร้าน" },
      { word: "free time", thaiMeaning: "เวลาว่าง" },
      { word: "positive development", thaiMeaning: "พัฒนาการในทางบวก" },
      { word: "rarely wasted", thaiMeaning: "ไม่ค่อยถูกเปลืองเปล่า" },
      { word: "preferred giving cash", thaiMeaning: "ชอบให้เป็นเงินสด" },
      { word: "left unused", thaiMeaning: "ถูกทิ้งไว้โดยไม่ได้ใช้" },
      { word: "gifts chosen personally", thaiMeaning: "ของขวัญที่เลือกเอง" },
      { word: "nearly half of consumers", thaiMeaning: "ผู้บริโภคเกือบครึ่ง" },
      { word: "end up discarded", thaiMeaning: "ถูกทิ้งในที่สุด" },
      { word: "choose exactly what they need", thaiMeaning: "เลือกสิ่งที่ต้องการได้อย่างตรงจุด" },
      { word: "giving money instead", thaiMeaning: "ให้เงินแทน" },
      { word: "shift towards", thaiMeaning: "การเปลี่ยนไปสู่" },
      { word: "several years afterwards", thaiMeaning: "หลายปีหลังจากนั้น" },
      { word: "more and more people", thaiMeaning: "ผู้คนมากขึ้นเรื่อย ๆ" },
      { word: "negative development", thaiMeaning: "พัฒนาการในทางลบ" },
      { word: "cupboards for several years", thaiMeaning: "ถูกทิ้งในตู้หลายปี" },
      { word: "actually like or use", thaiMeaning: "ชอบหรือใช้งานจริง" },
      { word: "many people assume", thaiMeaning: "หลายคนสันนิษฐาน" }
    ]
  },
  {
    id: 't2-dq-8',
    number: 8,
    typeId: 'double-question',
    title: 'Declining Art Gallery Visitors',
    questionText:
      'In some countries, the number of people who visit art galleries is declining. What are the reasons for this? How can we solve this problem?',
    meta: 'India · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that the number of people visiting art galleries is declining in many countries. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าจำนวนผู้เข้าชมหอศิลป์กำลังลดลงในหลายประเทศ เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะเสนอมาตรการบางประการเพื่อแก้ไขปัญหานี้'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with falling gallery attendance. The first reason is that free digital images of famous artworks are now widely available online, which reduces the need to visit a gallery in person. For example, the Google Arts and Culture platform allows users to view thousands of high-resolution paintings from major museums without leaving home. Another reason is that this is because many young people simply find traditional galleries unappealing compared with more interactive forms of entertainment. For instance, a 2021 study by the UK's Department for Digital, Culture, Media and Sport found that visitors under 25 made up the smallest share of gallery attendance.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับจำนวนผู้เข้าชมหอศิลป์ที่ลดลง เหตุผลแรกคือภาพงานศิลปะดิจิทัลที่ไม่มีค่าใช้จ่ายของผลงานที่มีชื่อเสียงนั้นมีให้ดูอย่างแพร่หลายทางออนไลน์แล้วในปัจจุบัน ซึ่งลดความจำเป็นในการไปเยี่ยมชมหอศิลป์ด้วยตัวเอง ตัวอย่างเช่น แพลตฟอร์ม Google Arts and Culture ช่วยให้ผู้ใช้สามารถชมภาพวาดความละเอียดสูงหลายพันภาพจากพิพิธภัณฑ์สำคัญๆ ได้โดยไม่ต้องออกจากบ้าน อีกเหตุผลหนึ่งคือเป็นเพราะคนหนุ่มสาวจำนวนมากรู้สึกว่าหอศิลป์แบบดั้งเดิมไม่น่าสนใจ เมื่อเทียบกับความบันเทิงรูปแบบอื่นที่มีการโต้ตอบมากกว่า ยกตัวอย่างเช่น การศึกษาในปี 2021 โดยกระทรวงดิจิทัล วัฒนธรรม สื่อ และกีฬาแห่งสหราชอาณาจักร พบว่าผู้เข้าชมที่มีอายุต่ำกว่า 25 ปีคิดเป็นสัดส่วนที่น้อยที่สุดของผู้เข้าชมหอศิลป์'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that galleries could introduce interactive exhibits, such as touchscreens and augmented reality displays, to attract younger visitors. For example, the Louvre in Paris now offers a virtual reality tour of the Mona Lisa that has drawn considerable public interest. Another measure is that galleries could reduce or waive entry fees for students, which would make visits more affordable and accessible. For instance, several major museums in New York already offer free admission on selected evenings each month.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ ประการแรกคือหอศิลป์สามารถนำนิทรรศการเชิงโต้ตอบมาใช้ เช่น หน้าจอสัมผัสและการแสดงผลด้วยเทคโนโลยีความเป็นจริงเสริม เพื่อดึงดูดผู้เข้าชมที่อายุน้อยกว่า ตัวอย่างเช่น พิพิธภัณฑ์ลูฟร์ในปารีสปัจจุบันมีทัวร์เสมือนจริงของภาพโมนาลิซาซึ่งได้รับความสนใจจากสาธารณชนอย่างมาก มาตรการอีกประการหนึ่งคือหอศิลป์สามารถลดหรือยกเว้นค่าธรรมเนียมเข้าชมสำหรับนักเรียนนักศึกษา ซึ่งจะทำให้การเยี่ยมชมมีราคาที่เข้าถึงได้และย่อมเยาขึ้น ยกตัวอย่างเช่น พิพิธภัณฑ์ใหญ่หลายแห่งในนิวยอร์กเปิดให้เข้าชมฟรีในบางเย็นของแต่ละเดือนอยู่แล้ว'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that changing habits have drawn people away from traditional galleries, I am of the opinion that innovative exhibits and affordable pricing can help reverse this decline.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าพฤติกรรมที่เปลี่ยนไปได้ดึงผู้คนออกห่างจากหอศิลป์แบบดั้งเดิม แต่ฉันมีความเห็นว่านิทรรศการที่สร้างสรรค์และราคาที่เข้าถึงได้สามารถช่วยพลิกกลับการลดลงนี้ได้'
      }
    ],
    vocab: [
      { word: "gallery attendance", thaiMeaning: "จำนวนผู้เข้าชมหอศิลป์" },
      { word: "digital images", thaiMeaning: "ภาพดิจิทัล" },
      { word: "interactive exhibits", thaiMeaning: "นิทรรศการเชิงโต้ตอบ" },
      { word: "entry fees", thaiMeaning: "ค่าธรรมเนียมเข้าชม" },
      { word: "high-resolution paintings", thaiMeaning: "ภาพวาดความละเอียดสูง" },
      { word: "traditional galleries", thaiMeaning: "หอศิลป์แบบดั้งเดิม" },
      { word: "augmented reality displays", thaiMeaning: "จอแสดงผลความเป็นจริงเสริม" },
      { word: "virtual reality tour", thaiMeaning: "ทัวร์เสมือนจริง" },
      { word: "free admission", thaiMeaning: "เข้าชมฟรี" },
      { word: "innovative exhibits", thaiMeaning: "นิทรรศการที่แปลกใหม่" },
      { word: "affordable pricing", thaiMeaning: "ราคาที่เอื้อมถึง" },
      { word: "reverse this decline", thaiMeaning: "พลิกกลับแนวโน้มที่ลดลงนี้" },
      { word: "changing habits", thaiMeaning: "พฤติกรรมที่เปลี่ยนไป" },
      { word: "famous artworks", thaiMeaning: "ผลงานศิลปะที่มีชื่อเสียง" },
      { word: "younger visitors", thaiMeaning: "ผู้เข้าชมที่อายุน้อยกว่า" },
      { word: "interactive forms of entertainment", thaiMeaning: "รูปแบบความบันเทิงเชิงโต้ตอบ" },
      { word: "public interest", thaiMeaning: "ความสนใจของสาธารณชน" },
      { word: "major museums", thaiMeaning: "พิพิธภัณฑ์ชั้นนำ" },
      { word: "art galleries", thaiMeaning: "หอศิลป์" },
      { word: "affordable and accessible", thaiMeaning: "ราคาเอื้อมถึงและเข้าถึงได้" },
      { word: "widely available online", thaiMeaning: "หาได้ทั่วไปทางออนไลน์" },
      { word: "visit a gallery in person", thaiMeaning: "ไปหอศิลป์ด้วยตนเอง" },
      { word: "without leaving home", thaiMeaning: "โดยไม่ต้องออกจากบ้าน" },
      { word: "smallest share", thaiMeaning: "สัดส่วนที่น้อยที่สุด" },
      { word: "touchscreens", thaiMeaning: "หน้าจอสัมผัส" },
      { word: "selected evenings", thaiMeaning: "เย็นบางวันที่กำหนด" },
      { word: "drawn people away", thaiMeaning: "ดึงผู้คนออกไป" },
      { word: "tackle this issue", thaiMeaning: "จัดการปัญหานี้" },
      { word: "visitors under 25", thaiMeaning: "ผู้เข้าชมที่อายุต่ำกว่า 25" },
      { word: "address this problem", thaiMeaning: "แก้ไขปัญหานี้" },
      { word: "make visits more affordable", thaiMeaning: "ทำให้การเข้าชมเอื้อมถึงมากขึ้น" },
      { word: "Google Arts and Culture", thaiMeaning: "แพลตฟอร์ม Google Arts and Culture" }
    ]
  },
  {
    id: 't2-dq-9',
    number: 9,
    typeId: 'double-question',
    title: 'Valuing Celebrities Over Professionals',
    questionText:
      'In some societies, sports and entertainment figures are more valued than professionals such as doctors and teachers. Why is this the case? Do you consider it a positive or negative trend?',
    meta: 'India · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that sports and entertainment figures are often valued far more highly in society than professionals such as doctors and teachers. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าบุคคลในวงการกีฬาและบันเทิงมักได้รับการยกย่องในสังคมสูงกว่าผู้เชี่ยวชาญเช่นแพทย์และครูอย่างมาก เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะอภิปรายว่านี่เป็นพัฒนาการในทางบวกหรือทางลบ'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with this imbalance in public recognition. The first reason is that mass media and social platforms give celebrities constant exposure, which keeps them firmly in the public eye at all times. For example, top footballers such as Cristiano Ronaldo have amassed hundreds of millions of followers on Instagram, far more than any doctor or teacher could realistically reach. Another reason is that this is because entertainment naturally generates strong emotional excitement that everyday professional work rarely produces. For instance, a single championship match can draw a global television audience of well over a billion viewers.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับความไม่สมดุลในการยอมรับของสาธารณชนนี้ เหตุผลแรกคือสื่อมวลชนและแพลตฟอร์มโซเชียลให้การนำเสนอผู้มีชื่อเสียงอย่างต่อเนื่อง ซึ่งทำให้พวกเขาอยู่ในสายตาของสาธารณชนตลอดเวลา ตัวอย่างเช่น นักฟุตบอลชั้นนำอย่าง Cristiano Ronaldo มีผู้ติดตามบน Instagram หลายร้อยล้านคน มากกว่าที่แพทย์หรือครูคนใดจะเข้าถึงได้จริงมาก อีกเหตุผลหนึ่งคือเป็นเพราะความบันเทิงก่อให้เกิดความตื่นเต้นทางอารมณ์อย่างรุนแรงตามธรรมชาติ ซึ่งงานอาชีพในชีวิตประจำวันแทบไม่เคยสร้างได้ ยกตัวอย่างเช่น การแข่งขันชิงแชมป์เพียงนัดเดียวสามารถดึงดูดผู้ชมโทรทัศน์ทั่วโลกได้มากกว่าหนึ่งพันล้านคน'
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a negative development. To explain it simply, this is because undervaluing essential professionals may discourage talented young people from pursuing genuinely vital careers such as medicine or teaching. To illustrate, a 2020 OECD report found that several member countries were struggling to fill teacher training places due to comparatively low salaries and social status. In this sense, it is evident that society's current priorities could ultimately weaken essential public services over time.",
        thai: 'สำหรับความคิดเห็นของฉัน ฉันขอโต้แย้งว่านี่เป็นพัฒนาการในทางลบ อธิบายง่ายๆ ก็คือ เพราะการให้คุณค่าน้อยเกินไปแก่ผู้เชี่ยวชาญที่จำเป็นอาจกีดกันคนหนุ่มสาวที่มีความสามารถจากการประกอบอาชีพที่สำคัญอย่างแท้จริง เช่นการแพทย์หรือการสอน เพื่อยกตัวอย่างให้เห็นภาพ รายงานของ OECD ในปี 2020 พบว่าหลายประเทศสมาชิกกำลังประสบปัญหาในการเติมเต็มตำแหน่งฝึกอบรมครู เนื่องจากเงินเดือนและสถานะทางสังคมที่ค่อนข้างต่ำ ในแง่นี้ เป็นที่ประจักษ์ชัดว่าลำดับความสำคัญในปัจจุบันของสังคมอาจบั่นทอนบริการสาธารณะที่จำเป็นในระยะยาว'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that entertainment provides genuine enjoyment and welcome inspiration, I am of the opinion that this imbalance in recognition is ultimately harmful to society as a whole.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าความบันเทิงมอบความเพลิดเพลินที่แท้จริงและแรงบันดาลใจที่น่ายินดี แต่ฉันมีความเห็นว่าความไม่สมดุลในการยอมรับนี้ในท้ายที่สุดแล้วเป็นอันตรายต่อสังคมโดยรวม'
      }
    ],
    vocab: [
      { word: "public recognition", thaiMeaning: "การยอมรับจากสังคม" },
      { word: "mass media", thaiMeaning: "สื่อมวลชน" },
      { word: "social status", thaiMeaning: "สถานะทางสังคม" },
      { word: "public services", thaiMeaning: "บริการสาธารณะ" },
      { word: "constant exposure", thaiMeaning: "การปรากฏตัวต่อเนื่อง" },
      { word: "public eye", thaiMeaning: "สายตาของสาธารณชน" },
      { word: "emotional excitement", thaiMeaning: "ความตื่นเต้นทางอารมณ์" },
      { word: "global television audience", thaiMeaning: "ผู้ชมโทรทัศน์ทั่วโลก" },
      { word: "essential professionals", thaiMeaning: "มืออาชีพที่จำเป็น" },
      { word: "vital careers", thaiMeaning: "อาชีพสำคัญ" },
      { word: "teacher training places", thaiMeaning: "ที่นั่งเรียนฝึกอาชีพครู" },
      { word: "comparatively low salaries", thaiMeaning: "เงินเดือนที่ค่อนข้างต่ำ" },
      { word: "welcome inspiration", thaiMeaning: "แรงบันดาลใจที่เป็นประโยชน์" },
      { word: "social platforms", thaiMeaning: "แพลตฟอร์มโซเชียล" },
      { word: "entertainment figures", thaiMeaning: "บุคคลในวงการบันเทิง" },
      { word: "championship match", thaiMeaning: "การแข่งขันชิงแชมป์" },
      { word: "talented young people", thaiMeaning: "เยาวชนที่มีพรสวรรค์" },
      { word: "genuine enjoyment", thaiMeaning: "ความเพลิดเพลินอย่างแท้จริง" },
      { word: "imbalance in recognition", thaiMeaning: "ความไม่สมดุลในการยอมรับ" },
      { word: "negative development", thaiMeaning: "พัฒนาการในทางลบ" },
      { word: "valued far more highly", thaiMeaning: "ได้รับการให้คุณค่าสูงกว่ามาก" },
      { word: "hundreds of millions of followers", thaiMeaning: "ผู้ติดตามหลายร้อยล้าน" },
      { word: "realistically reach", thaiMeaning: "เข้าถึงได้อย่างสมจริง" },
      { word: "everyday professional work", thaiMeaning: "งานวิชาชีพในชีวิตประจำวัน" },
      { word: "billion viewers", thaiMeaning: "ผู้ชมพันล้านคน" },
      { word: "medicine or teaching", thaiMeaning: "แพทย์หรือการสอน" },
      { word: "member countries", thaiMeaning: "ประเทศสมาชิก" },
      { word: "struggling to fill", thaiMeaning: "ประสบปัญหาการหาคนมาเติม" },
      { word: "society as a whole", thaiMeaning: "สังคมโดยรวม" },
      { word: "current priorities", thaiMeaning: "ลำดับความสำคัญในปัจจุบัน" },
      { word: "ultimately harmful", thaiMeaning: "เป็นอันตรายในท้ายที่สุด" },
      { word: "doctors and teachers", thaiMeaning: "แพทย์และครู" }
    ]
  },
  {
    id: 't2-dq-10',
    number: 10,
    typeId: 'double-question',
    title: 'The Decline of Biodiversity',
    questionText:
      'In recent years, there has been a significant decline in the diversity of plant and animal species across numerous countries. What are the potential causes of this issue? How can we mitigate it?',
    meta: 'Oman · Feb 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that there has been a significant decline in the diversity of plant and animal species across numerous countries in recent years. This essay will elaborate on the potential causes of this issue before suggesting some measures to mitigate it.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าเกิดการลดลงอย่างมีนัยสำคัญของความหลากหลายของพืชและสัตว์ในหลายประเทศในช่วงไม่กี่ปีที่ผ่านมา เรียงความนี้จะอธิบายสาเหตุที่เป็นไปได้ของปัญหานี้ ก่อนที่จะเสนอมาตรการบางประการเพื่อบรรเทาปัญหา'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with the loss of biodiversity worldwide. The first reason is that expanding agriculture and urban development are steadily destroying the natural habitats that countless species depend on. For example, the World Wildlife Fund reported in 2022 that global wildlife populations had fallen by an average of 69% since 1970, largely due to habitat loss. Another reason is that this is because rising global temperatures are altering ecosystems faster than many species can adapt. For instance, coral reefs in Australia's Great Barrier Reef have suffered repeated mass bleaching events linked directly to warming ocean waters.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับการสูญเสียความหลากหลายทางชีวภาพทั่วโลก เหตุผลแรกคือการขยายตัวของภาคเกษตรกรรมและการพัฒนาเมืองกำลังทำลายถิ่นที่อยู่อาศัยตามธรรมชาติที่สิ่งมีชีวิตนับไม่ถ้วนต้องพึ่งพาอย่างต่อเนื่อง ตัวอย่างเช่น กองทุนสัตว์ป่าโลก (WWF) รายงานในปี 2022 ว่าประชากรสัตว์ป่าทั่วโลกลดลงโดยเฉลี่ย 69% นับตั้งแต่ปี 1970 ซึ่งส่วนใหญ่เป็นผลมาจากการสูญเสียถิ่นที่อยู่อาศัย อีกเหตุผลหนึ่งคือเป็นเพราะอุณหภูมิโลกที่สูงขึ้นกำลังเปลี่ยนแปลงระบบนิเวศเร็วกว่าที่สิ่งมีชีวิตหลายชนิดจะปรับตัวได้ทัน ยกตัวอย่างเช่น แนวปะการังในเกรตแบร์ริเออร์รีฟของออสเตรเลียประสบเหตุการณ์ปะการังฟอกขาวครั้งใหญ่ซ้ำแล้วซ้ำเล่า ซึ่งเชื่อมโยงโดยตรงกับน้ำทะเลที่อุ่นขึ้น'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could expand protected nature reserves, which would give threatened species a safer environment in which to recover. For example, Costa Rica has doubled its forest cover since the 1980s through a national programme of protected reserves. Another measure is that international agreements could restrict trade in endangered species and the products made from them. For instance, the Convention on International Trade in Endangered Species has helped reduce illegal ivory trafficking in several African nations.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ ประการแรกคือรัฐบาลสามารถขยายพื้นที่อนุรักษ์ธรรมชาติที่ได้รับการคุ้มครอง ซึ่งจะให้สภาพแวดล้อมที่ปลอดภัยกว่าแก่สิ่งมีชีวิตที่ถูกคุกคามในการฟื้นตัว ตัวอย่างเช่น คอสตาริกาได้เพิ่มพื้นที่ป่าไม้เป็นสองเท่านับตั้งแต่ทศวรรษ 1980 ผ่านโครงการระดับชาติของพื้นที่คุ้มครอง มาตรการอีกประการหนึ่งคือข้อตกลงระหว่างประเทศสามารถจำกัดการค้าสัตว์ใกล้สูญพันธุ์และผลิตภัณฑ์ที่ทำจากสัตว์เหล่านั้น ยกตัวอย่างเช่น อนุสัญญาว่าด้วยการค้าระหว่างประเทศซึ่งชนิดสัตว์ป่าและพืชป่าที่ใกล้สูญพันธุ์ (CITES) ได้ช่วยลดการลักลอบค้างาช้างผิดกฎหมายในหลายประเทศแอฟริกา'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that biodiversity loss stems from complex global pressures, I am of the opinion that stronger conservation policies can meaningfully slow this decline.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการสูญเสียความหลากหลายทางชีวภาพเกิดจากแรงกดดันระดับโลกที่ซับซ้อน แต่ฉันมีความเห็นว่านโยบายการอนุรักษ์ที่เข้มแข็งขึ้นสามารถชะลอการลดลงนี้ได้อย่างมีนัยสำคัญ'
      }
    ],
    vocab: [
      { word: "biodiversity loss", thaiMeaning: "การสูญเสียความหลากหลายทางชีวภาพ" },
      { word: "natural habitats", thaiMeaning: "ถิ่นที่อยู่อาศัยตามธรรมชาติ" },
      { word: "protected nature reserves", thaiMeaning: "เขตอนุรักษ์ธรรมชาติ" },
      { word: "endangered species", thaiMeaning: "สัตว์ใกล้สูญพันธุ์" },
      { word: "expanding agriculture", thaiMeaning: "การขยายพื้นที่เกษตรกรรม" },
      { word: "urban development", thaiMeaning: "การพัฒนาเมือง" },
      { word: "habitat loss", thaiMeaning: "การสูญเสียถิ่นที่อยู่อาศัย" },
      { word: "rising global temperatures", thaiMeaning: "อุณหภูมิโลกที่สูงขึ้น" },
      { word: "mass bleaching events", thaiMeaning: "เหตุการณ์ปะการังฟอกขาวครั้งใหญ่" },
      { word: "warming ocean waters", thaiMeaning: "น้ำทะเลที่อุ่นขึ้น" },
      { word: "threatened species", thaiMeaning: "ชนิดพันธุ์ที่ถูกคุกคาม" },
      { word: "forest cover", thaiMeaning: "พื้นที่ป่าไม้" },
      { word: "illegal ivory trafficking", thaiMeaning: "การค้างาช้างผิดกฎหมาย" },
      { word: "conservation policies", thaiMeaning: "นโยบายอนุรักษ์" },
      { word: "complex global pressures", thaiMeaning: "แรงกดดันระดับโลกที่ซับซ้อน" },
      { word: "wildlife populations", thaiMeaning: "ประชากรสัตว์ป่า" },
      { word: "coral reefs", thaiMeaning: "แนวปะการัง" },
      { word: "safer environment", thaiMeaning: "สภาพแวดล้อมที่ปลอดภัยกว่า" },
      { word: "international agreements", thaiMeaning: "ข้อตกลงระหว่างประเทศ" },
      { word: "plant and animal species", thaiMeaning: "ชนิดพันธุ์พืชและสัตว์" },
      { word: "significant decline", thaiMeaning: "การลดลงอย่างมาก" },
      { word: "loss of biodiversity worldwide", thaiMeaning: "การสูญเสียความหลากหลายทางชีวภาพทั่วโลก" },
      { word: "steadily destroying", thaiMeaning: "ทำลายอย่างต่อเนื่อง" },
      { word: "countless species depend on", thaiMeaning: "ชนิดพันธุ์นับไม่ถ้วนพึ่งพา" },
      { word: "altering ecosystems", thaiMeaning: "การเปลี่ยนแปลงระบบนิเวศ" },
      { word: "many species can adapt", thaiMeaning: "หลายชนิดพันธุ์สามารถปรับตัวได้" },
      { word: "Great Barrier Reef", thaiMeaning: "แนวปะการังเกรตแบร์ริเออร์รีฟ" },
      { word: "linked directly to", thaiMeaning: "เชื่อมโยงโดยตรงกับ" },
      { word: "national programme of protected reserves", thaiMeaning: "โครงการระดับชาติของเขตอนุรักษ์" },
      { word: "products made from them", thaiMeaning: "ผลิตภัณฑ์ที่ทำจากพวกมัน" },
      { word: "meaningfully slow this decline", thaiMeaning: "ชะลอการลดลงนี้อย่างมีความหมาย" },
      { word: "World Wildlife Fund", thaiMeaning: "กองทุนสัตว์ป่าโลก" }
    ]
  },
  {
    id: 't2-dq-11',
    number: 11,
    typeId: 'double-question',
    title: 'Spending Money to Look Younger',
    questionText:
      "In today's world, people spend a lot of money on their appearance because they want to look younger. Why is this happening? Do you think this is a positive or negative development?",
    meta: 'New Zealand · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that people today spend a considerable amount of money on their appearance because they want to look younger. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าปัจจุบันผู้คนใช้จ่ายเงินจำนวนมากไปกับรูปลักษณ์ภายนอกของตน เพราะต้องการดูอ่อนกว่าวัย เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะอภิปรายว่านี่เป็นพัฒนาการในทางบวกหรือทางลบ'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with this growing focus on youthful appearance. The first reason is that social media platforms constantly expose users to filtered, flawless images, which creates strong pressure to match unrealistic beauty standards. For example, a 2019 study by the Royal Society for Public Health found that Instagram was closely linked to increased body image concerns among young adults. Another reason is that this is because many workplaces still associate a youthful appearance with energy and professional competence. For instance, several surveys of hiring managers have shown a subtle bias in favour of younger-looking candidates during job interviews.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับการให้ความสำคัญที่เพิ่มขึ้นกับรูปลักษณ์ที่ดูอ่อนเยาว์นี้ เหตุผลแรกคือแพลตฟอร์มโซเชียลมีเดียเปิดเผยภาพที่ผ่านการปรับแต่งและสมบูรณ์แบบให้ผู้ใช้เห็นอยู่ตลอดเวลา ซึ่งสร้างแรงกดดันอย่างมากให้ต้องเทียบเท่ามาตรฐานความงามที่ไม่สมจริง ตัวอย่างเช่น การศึกษาในปี 2019 โดย Royal Society for Public Health พบว่า Instagram มีความเชื่อมโยงอย่างใกล้ชิดกับความกังวลด้านภาพลักษณ์ร่างกายที่เพิ่มขึ้นในหมู่ผู้ใหญ่วัยหนุ่มสาว อีกเหตุผลหนึ่งคือเป็นเพราะสถานที่ทำงานหลายแห่งยังคงเชื่อมโยงรูปลักษณ์ที่อ่อนเยาว์กับพลังงานและความสามารถทางวิชาชีพ ยกตัวอย่างเช่น การสำรวจผู้จัดการฝ่ายจ้างงานหลายครั้งแสดงให้เห็นถึงอคติที่ละเอียดอ่อนที่เอนเอียงไปทางผู้สมัครที่ดูอายุน้อยกว่าในระหว่างการสัมภาษณ์งาน'
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a negative development. To explain it simply, this is because excessive spending on cosmetic treatments can create unhealthy financial pressure and considerable anxiety about natural ageing. To illustrate, the global anti-ageing industry was valued at over 60 billion dollars in 2023, reflecting how deeply this pressure has spread worldwide. In this sense, it is evident that this obsession with appearance can distract people from more meaningful sources of self-worth.",
        thai: 'สำหรับความคิดเห็นของฉัน ฉันขอโต้แย้งว่านี่เป็นพัฒนาการในทางลบ อธิบายง่ายๆ ก็คือ เพราะการใช้จ่ายมากเกินไปกับการรักษาความงามสามารถสร้างแรงกดดันทางการเงินที่ไม่ดีต่อสุขภาพและความวิตกกังวลอย่างมากเกี่ยวกับการแก่ตัวลงตามธรรมชาติ เพื่อยกตัวอย่างให้เห็นภาพ อุตสาหกรรมต่อต้านความชราทั่วโลกมีมูลค่ากว่า 6 หมื่นล้านดอลลาร์ในปี 2023 ซึ่งสะท้อนให้เห็นว่าแรงกดดันนี้แพร่กระจายไปทั่วโลกอย่างลึกซึ้งเพียงใด ในแง่นี้ เป็นที่ประจักษ์ชัดว่าความหมกมุ่นกับรูปลักษณ์ภายนอกนี้สามารถเบี่ยงเบนความสนใจของผู้คนออกจากแหล่งที่มาของคุณค่าในตัวเองที่มีความหมายมากกว่า'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that taking care of one's appearance can genuinely boost confidence, I am of the opinion that this widespread preoccupation with looking younger is ultimately unhealthy.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการดูแลรูปลักษณ์ภายนอกของตนสามารถเพิ่มความมั่นใจได้อย่างแท้จริง แต่ฉันมีความเห็นว่าความหมกมุ่นที่แพร่หลายนี้กับการดูอ่อนกว่าวัยในท้ายที่สุดแล้วไม่ดีต่อสุขภาพ'
      }
    ],
    vocab: [
      { word: "youthful appearance", thaiMeaning: "รูปลักษณ์ที่ดูอ่อนเยาว์" },
      { word: "body image", thaiMeaning: "ภาพลักษณ์ของร่างกาย" },
      { word: "cosmetic treatments", thaiMeaning: "การรักษาด้านความงาม" },
      { word: "natural ageing", thaiMeaning: "การแก่ตัวตามธรรมชาติ" },
      { word: "unrealistic beauty standards", thaiMeaning: "มาตรฐานความงามที่ไม่สมจริง" },
      { word: "professional competence", thaiMeaning: "ความสามารถอย่างมืออาชีพ" },
      { word: "hiring managers", thaiMeaning: "ผู้จัดการฝ่ายสรรหา" },
      { word: "younger-looking candidates", thaiMeaning: "ผู้สมัครที่ดูอ่อนเยาว์กว่า" },
      { word: "job interviews", thaiMeaning: "การสัมภาษณ์งาน" },
      { word: "financial pressure", thaiMeaning: "แรงกดดันทางการเงิน" },
      { word: "anti-ageing industry", thaiMeaning: "อุตสาหกรรมต่อต้านริ้วรอย" },
      { word: "social media platforms", thaiMeaning: "แพลตฟอร์มโซเชียลมีเดีย" },
      { word: "boost confidence", thaiMeaning: "เพิ่มความมั่นใจ" },
      { word: "widespread preoccupation", thaiMeaning: "ความหมกมุ่นที่แพร่หลาย" },
      { word: "excessive spending", thaiMeaning: "การใช้จ่ายมากเกินไป" },
      { word: "considerable anxiety", thaiMeaning: "ความวิตกกังวลอย่างมาก" },
      { word: "flawless images", thaiMeaning: "ภาพที่ไร้ที่ติ" },
      { word: "sources of self-worth", thaiMeaning: "แหล่งของคุณค่าในตัวเอง" },
      { word: "looking younger", thaiMeaning: "การดูอ่อนเยาว์กว่า" },
      { word: "negative development", thaiMeaning: "พัฒนาการในทางลบ" },
      { word: "considerable amount of money", thaiMeaning: "เงินจำนวนมาก" },
      { word: "strong pressure", thaiMeaning: "แรงกดดันอย่างมาก" },
      { word: "young adults", thaiMeaning: "ผู้ใหญ่หนุ่มสาว" },
      { word: "subtle bias", thaiMeaning: "อคติอย่างแยบยล" },
      { word: "in favour of", thaiMeaning: "ในทางที่เอื้อต่อ" },
      { word: "spread worldwide", thaiMeaning: "แพร่ไปทั่วโลก" },
      { word: "obsession with appearance", thaiMeaning: "ความหมกมุ่นกับรูปลักษณ์" },
      { word: "distract people from", thaiMeaning: "เบี่ยงเบนความสนใจของผู้คนจาก" },
      { word: "Royal Society for Public Health", thaiMeaning: "ราชสมาคมด้านสาธารณสุข" },
      { word: "valued at over 60 billion dollars", thaiMeaning: "มีมูลค่ากว่า 6 หมื่นล้านดอลลาร์" },
      { word: "taking care of one's appearance", thaiMeaning: "การดูแลรูปลักษณ์ของตน" },
      { word: "constantly expose users", thaiMeaning: "เปิดเผยผู้ใช้อย่างต่อเนื่อง" }
    ]
  },
  {
    id: 't2-dq-12',
    number: 12,
    typeId: 'double-question',
    title: 'Shopping as a Hobby',
    questionText:
      'Nowadays shopping has replaced many other activities that people choose as their hobby in their free time. What are the reasons for this? Is this a positive or negative development?',
    meta: 'UAE · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that shopping has replaced many other activities that people once chose as hobbies in their free time. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าการช้อปปิ้งได้เข้ามาแทนที่กิจกรรมอื่นๆ อีกหลายอย่างที่ผู้คนเคยเลือกเป็นงานอดิเรกในเวลาว่าง เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะอภิปรายว่านี่เป็นพัฒนาการในทางบวกหรือทางลบ'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with the rise of shopping as a leisure activity. The first reason is that online retailers now make browsing and buying products effortless at any hour of the day. For example, Amazon reported that its mobile app usage in the United States increased by more than 30% between 2019 and 2023, reflecting this shift towards constant browsing. Another reason is that this is because shopping malls have transformed into entertainment destinations offering cinemas, restaurants, and events alongside stores. For instance, the Dubai Mall attracts millions of visitors each year who come primarily for entertainment rather than necessary purchases.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับการเพิ่มขึ้นของการช้อปปิ้งในฐานะกิจกรรมยามว่าง เหตุผลแรกคือผู้ค้าปลีกออนไลน์ในปัจจุบันทำให้การเลือกดูและซื้อสินค้าเป็นเรื่องง่ายดายได้ทุกชั่วโมงของวัน ตัวอย่างเช่น Amazon รายงานว่าการใช้งานแอปมือถือในสหรัฐอเมริกาเพิ่มขึ้นมากกว่า 30% ระหว่างปี 2019 ถึง 2023 ซึ่งสะท้อนถึงการเปลี่ยนแปลงไปสู่การเลือกดูสินค้าอย่างต่อเนื่องนี้ อีกเหตุผลหนึ่งคือเป็นเพราะห้างสรรพสินค้าได้เปลี่ยนแปลงตัวเองให้กลายเป็นจุดหมายปลายทางด้านความบันเทิง ที่มีทั้งโรงภาพยนตร์ ร้านอาหาร และกิจกรรมต่างๆ ควบคู่ไปกับร้านค้า ยกตัวอย่างเช่น ดูไบมอลล์ดึงดูดผู้เข้าชมหลายล้านคนในแต่ละปี ซึ่งมาเป็นหลักเพื่อความบันเทิงมากกว่าการซื้อสิ่งของที่จำเป็น'
      },
      {
        role: 'body2',
        text: "With regard to my opinion, I would argue that this is a negative development. To explain it simply, treating shopping as a hobby encourages unnecessary consumption, placing growing strain on both personal finances and the environment. To illustrate, a 2021 report by the Ellen MacArthur Foundation found that fast fashion purchases driven by casual browsing were a major contributor to textile waste. In this sense, it is evident that this trend carries consequences well beyond simple personal enjoyment.",
        thai: 'สำหรับความคิดเห็นของฉัน ฉันขอโต้แย้งว่านี่เป็นพัฒนาการในทางลบ อธิบายง่ายๆ ก็คือ การถือว่าการช้อปปิ้งเป็นงานอดิเรกส่งเสริมการบริโภคที่ไม่จำเป็น ซึ่งสร้างภาระที่เพิ่มขึ้นทั้งต่อการเงินส่วนบุคคลและสิ่งแวดล้อม เพื่อยกตัวอย่างให้เห็นภาพ รายงานในปี 2021 โดย Ellen MacArthur Foundation พบว่าการซื้อเสื้อผ้าแฟชั่นด่วนที่เกิดจากการเลือกดูสินค้าแบบสบายๆ เป็นสาเหตุสำคัญของขยะสิ่งทอ ในแง่นี้ เป็นที่ประจักษ์ชัดว่าแนวโน้มนี้มีผลกระทบที่เกินไปกว่าเพียงความเพลิดเพลินส่วนตัว'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that shopping can provide genuine relaxation and social enjoyment, I am of the opinion that relying on it as a primary hobby is ultimately an unhealthy trend.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการช้อปปิ้งสามารถให้ความผ่อนคลายและความเพลิดเพลินทางสังคมที่แท้จริง แต่ฉันมีความเห็นว่าการพึ่งพามันเป็นงานอดิเรกหลักในท้ายที่สุดแล้วเป็นแนวโน้มที่ไม่ดีต่อสุขภาพ'
      }
    ],
    vocab: [
      { word: "leisure activity", thaiMeaning: "กิจกรรมยามว่าง" },
      { word: "online retailers", thaiMeaning: "ผู้ค้าปลีกออนไลน์" },
      { word: "unnecessary consumption", thaiMeaning: "การบริโภคที่ไม่จำเป็น" },
      { word: "textile waste", thaiMeaning: "ขยะสิ่งทอ" },
      { word: "entertainment destinations", thaiMeaning: "แหล่งความบันเทิง" },
      { word: "necessary purchases", thaiMeaning: "การซื้อที่จำเป็น" },
      { word: "personal finances", thaiMeaning: "การเงินส่วนตัว" },
      { word: "fast fashion purchases", thaiMeaning: "การซื้อแฟชั่นราคาถูก" },
      { word: "casual browsing", thaiMeaning: "การเลือกดูสินค้าแบบสบาย ๆ" },
      { word: "constant browsing", thaiMeaning: "การเลือกดูสินค้าอย่างต่อเนื่อง" },
      { word: "genuine relaxation", thaiMeaning: "การผ่อนคลายอย่างแท้จริง" },
      { word: "social enjoyment", thaiMeaning: "ความสนุกทางสังคม" },
      { word: "primary hobby", thaiMeaning: "งานอดิเรกหลัก" },
      { word: "shopping malls", thaiMeaning: "ห้างสรรพสินค้า" },
      { word: "mobile app usage", thaiMeaning: "การใช้แอปมือถือ" },
      { word: "growing strain", thaiMeaning: "ภาระที่เพิ่มขึ้น" },
      { word: "free time", thaiMeaning: "เวลาว่าง" },
      { word: "unhealthy trend", thaiMeaning: "แนวโน้มที่ไม่ดีต่อสุขภาพ" },
      { word: "personal enjoyment", thaiMeaning: "ความเพลิดเพลินส่วนตัว" },
      { word: "browsing and buying", thaiMeaning: "การเลือกดูและซื้อสินค้า" },
      { word: "replaced many other activities", thaiMeaning: "แทนที่กิจกรรมอื่น ๆ หลายอย่าง" },
      { word: "come primarily for entertainment", thaiMeaning: "มาเพื่อความบันเทิงเป็นหลัก" },
      { word: "treating shopping as a hobby", thaiMeaning: "การซื้อของให้เป็นงานอดิเรก" },
      { word: "carries consequences well beyond", thaiMeaning: "ส่งผลไปไกลกว่า" },
      { word: "millions of visitors each year", thaiMeaning: "ผู้เข้าชมหลายล้านคนต่อปี" },
      { word: "Ellen MacArthur Foundation", thaiMeaning: "มูลนิธิ Ellen MacArthur" },
      { word: "once chose as hobbies", thaiMeaning: "เคยเลือกเป็นงานอดิเรก" },
      { word: "alongside stores", thaiMeaning: "ควบคู่ไปกับร้านค้า" },
      { word: "any hour of the day", thaiMeaning: "ทุกชั่วโมงของวัน" },
      { word: "increased by more than 30%", thaiMeaning: "เพิ่มขึ้นมากกว่า 30%" },
      { word: "reflecting this shift", thaiMeaning: "สะท้อนการเปลี่ยนแปลงนี้" },
      { word: "cinemas, restaurants, and events", thaiMeaning: "โรงภาพยนตร์ ร้านอาหาร และงานอีเวนต์" }
    ]
  },
  {
    id: 't2-dq-13',
    number: 13,
    typeId: 'double-question',
    title: 'The Problem of Youth Unemployment',
    questionText:
      'In many countries, more and more young people are dropping out of school but unable to find work. What problems do you think youth unemployment causes for individuals and society? What measures need to be taken to reduce youth unemployment?',
    meta: 'France · Mar 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that in many countries, growing numbers of young people are dropping out of school yet are still unable to find work. This essay will elaborate on the problems this trend causes before suggesting some measures to reduce youth unemployment.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าในหลายประเทศ คนหนุ่มสาวจำนวนมากขึ้นเรื่อยๆ ออกจากโรงเรียนกลางคัน แต่ก็ยังไม่สามารถหางานทำได้ เรียงความนี้จะอธิบายปัญหาที่แนวโน้มนี้ก่อให้เกิดขึ้น ก่อนที่จะเสนอมาตรการบางประการเพื่อลดปัญหาการว่างงานของเยาวชน'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of problems associated with rising youth unemployment. The first problem is that unemployed young people often experience declining mental health, as prolonged joblessness can damage self-esteem and future motivation. For example, a 2022 report by the International Labour Organization found that unemployed youth reported significantly higher rates of anxiety than their employed peers. Another problem is that this is because economies lose valuable productive potential when large numbers of young workers remain idle for extended periods. For instance, Spain's youth unemployment rate exceeded 30% in 2023, representing a substantial loss of national economic output.",
        thai: 'ก่อนอื่นเลย มีปัญหาหลายประการที่เกี่ยวข้องกับการว่างงานของเยาวชนที่เพิ่มขึ้น ปัญหาแรกคือคนหนุ่มสาวที่ว่างงานมักประสบกับสุขภาพจิตที่เสื่อมถอยลง เนื่องจากการว่างงานเป็นเวลานานสามารถทำลายความภาคภูมิใจในตนเองและแรงจูงใจในอนาคต ตัวอย่างเช่น รายงานในปี 2022 โดยองค์การแรงงานระหว่างประเทศ (ILO) พบว่าเยาวชนที่ว่างงานรายงานอัตราความวิตกกังวลที่สูงกว่าเพื่อนที่มีงานทำอย่างมีนัยสำคัญ ปัญหาอีกประการหนึ่งคือเป็นเพราะเศรษฐกิจสูญเสียศักยภาพในการผลิตที่มีค่า เมื่อแรงงานหนุ่มสาวจำนวนมากยังคงว่างงานเป็นเวลานาน ยกตัวอย่างเช่น อัตราการว่างงานของเยาวชนในสเปนเกิน 30% ในปี 2023 ซึ่งแสดงถึงการสูญเสียผลผลิตทางเศรษฐกิจของประเทศอย่างมาก'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could expand vocational training programmes that equip school leavers with practical, employable skills. For example, Germany's dual education system combines classroom study with paid apprenticeships, helping keep youth unemployment consistently low. Another measure is that companies could be offered tax incentives to hire and train inexperienced young workers. For instance, France introduced hiring subsidies in 2020 specifically aimed at encouraging businesses to employ workers under the age of 26.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ ประการแรกคือรัฐบาลสามารถขยายโครงการฝึกอบรมสายอาชีพที่ติดอาวุธผู้ที่จบการศึกษาด้วยทักษะที่ใช้งานได้จริงและเป็นที่ต้องการของตลาดแรงงาน ตัวอย่างเช่น ระบบการศึกษาคู่ขนานของเยอรมนีผสมผสานการเรียนในห้องเรียนเข้ากับการฝึกงานแบบมีค่าตอบแทน ซึ่งช่วยรักษาระดับการว่างงานของเยาวชนให้อยู่ในระดับต่ำอย่างสม่ำเสมอ มาตรการอีกประการหนึ่งคือบริษัทต่างๆ อาจได้รับสิ่งจูงใจทางภาษีเพื่อจ้างและฝึกอบรมแรงงานหนุ่มสาวที่ยังไม่มีประสบการณ์ ยกตัวอย่างเช่น ฝรั่งเศสได้นำเงินอุดหนุนการจ้างงานมาใช้ในปี 2020 โดยมุ่งเป้าไปที่การส่งเสริมให้ธุรกิจต่างๆ จ้างแรงงานที่มีอายุต่ำกว่า 26 ปีโดยเฉพาะ'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that youth unemployment stems from complex economic pressures, I am of the opinion that vocational training and hiring incentives can significantly reduce this problem.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าการว่างงานของเยาวชนเกิดจากแรงกดดันทางเศรษฐกิจที่ซับซ้อน แต่ฉันมีความเห็นว่าการฝึกอบรมสายอาชีพและสิ่งจูงใจในการจ้างงานสามารถลดปัญหานี้ได้อย่างมีนัยสำคัญ'
      }
    ],
    vocab: [
      { word: "youth unemployment", thaiMeaning: "การว่างงานของเยาวชน" },
      { word: "mental health", thaiMeaning: "สุขภาพจิต" },
      { word: "vocational training", thaiMeaning: "การฝึกอบรมสายอาชีพ" },
      { word: "hiring subsidies", thaiMeaning: "เงินอุดหนุนการจ้างงาน" },
      { word: "prolonged joblessness", thaiMeaning: "การว่างงานที่ยืดเยื้อ" },
      { word: "productive potential", thaiMeaning: "ศักยภาพในการผลิต" },
      { word: "economic output", thaiMeaning: "ผลผลิตทางเศรษฐกิจ" },
      { word: "employable skills", thaiMeaning: "ทักษะที่พร้อมทำงาน" },
      { word: "school leavers", thaiMeaning: "ผู้ที่จบหรือออกจากโรงเรียน" },
      { word: "paid apprenticeships", thaiMeaning: "การฝึกงานที่มีค่าจ้าง" },
      { word: "dual education system", thaiMeaning: "ระบบการศึกษาแบบทวิภาคี" },
      { word: "tax incentives", thaiMeaning: "สิ่งจูงใจทางภาษี" },
      { word: "inexperienced young workers", thaiMeaning: "แรงงานหนุ่มสาวที่ยังขาดประสบการณ์" },
      { word: "hiring incentives", thaiMeaning: "สิ่งจูงใจในการจ้างงาน" },
      { word: "complex economic pressures", thaiMeaning: "แรงกดดันทางเศรษฐกิจที่ซับซ้อน" },
      { word: "dropping out of school", thaiMeaning: "การออกจากโรงเรียนกลางคัน" },
      { word: "self-esteem", thaiMeaning: "ความนับถือตนเอง" },
      { word: "future motivation", thaiMeaning: "แรงจูงใจในอนาคต" },
      { word: "employed peers", thaiMeaning: "เพื่อนวัยเดียวกันที่มีงานทำ" },
      { word: "extended periods", thaiMeaning: "ช่วงเวลายาวนาน" },
      { word: "unable to find work", thaiMeaning: "ไม่สามารถหางานได้" },
      { word: "unemployed young people", thaiMeaning: "เยาวชนที่ว่างงาน" },
      { word: "significantly higher rates of anxiety", thaiMeaning: "อัตราความวิตกกังวลที่สูงกว่ามาก" },
      { word: "young workers remain idle", thaiMeaning: "แรงงานหนุ่มสาวยังคงว่างงาน" },
      { word: "classroom study", thaiMeaning: "การเรียนในชั้นเรียน" },
      { word: "encouraging businesses to employ", thaiMeaning: "จูงใจธุรกิจให้จ้างงาน" },
      { word: "workers under the age of 26", thaiMeaning: "แรงงานอายุต่ำกว่า 26 ปี" },
      { word: "significantly reduce this problem", thaiMeaning: "ลดปัญหานี้ได้อย่างมาก" },
      { word: "International Labour Organization", thaiMeaning: "องค์การแรงงานระหว่างประเทศ" },
      { word: "growing numbers of young people", thaiMeaning: "จำนวนเยาวชนที่เพิ่มขึ้น" },
      { word: "substantial loss", thaiMeaning: "ความสูญเสียอย่างมาก" },
      { word: "large numbers of young workers", thaiMeaning: "แรงงานหนุ่มสาวจำนวนมาก" }
    ]
  },
  {
    id: 't2-dq-14',
    number: 14,
    typeId: 'double-question',
    title: 'Traffic Congestion in Cities',
    questionText:
      'Traffic congestion in major cities has become considerably worse in recent years. What are the reasons for this? What solutions could be taken to tackle this issue?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that traffic congestion in major cities has become considerably worse in recent years. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าปัญหาการจราจรติดขัดในเมืองใหญ่ได้เลวร้ายลงอย่างมากในช่วงไม่กี่ปีที่ผ่านมา เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะเสนอมาตรการบางประการเพื่อแก้ไขปัญหานี้'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with worsening urban traffic congestion. The first reason is that rapid population growth in cities has led to a sharp rise in the total number of vehicles on the road. For example, Bangkok's Office of Transport and Traffic Policy reported in 2022 that private car registrations had risen by nearly 15% over the previous five years. Another reason is that public transport systems in many cities remain limited or unreliable, pushing many commuters towards private vehicles instead. For instance, several rapidly growing cities in Southeast Asia still lack an extensive metro network capable of serving outer suburbs.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับปัญหาการจราจรติดขัดในเมืองที่เลวร้ายลง เหตุผลแรกคือการเติบโตอย่างรวดเร็วของประชากรในเมืองได้นำไปสู่การเพิ่มขึ้นอย่างชัดเจนของจำนวนยานพาหนะบนท้องถนน ตัวอย่างเช่น สำนักงานนโยบายและแผนการขนส่งและจราจรของกรุงเทพฯ รายงานในปี 2022 ว่าการจดทะเบียนรถยนต์ส่วนบุคคลเพิ่มขึ้นเกือบ 15% ในช่วงห้าปีก่อนหน้านั้น อีกเหตุผลหนึ่งคือระบบขนส่งสาธารณะในหลายเมืองยังคงมีจำกัดหรือไม่น่าเชื่อถือ ซึ่งผลักดันให้ผู้โดยสารจำนวนมากหันไปใช้ยานพาหนะส่วนตัวแทน ยกตัวอย่างเช่น เมืองที่กำลังเติบโตอย่างรวดเร็วหลายแห่งในเอเชียตะวันออกเฉียงใต้ยังคงขาดเครือข่ายรถไฟใต้ดินที่ครอบคลุมสามารถให้บริการชานเมืองรอบนอกได้'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest heavily in expanding affordable and efficient public transport networks. For example, Singapore's continued investment in its Mass Rapid Transit system has helped keep private car ownership relatively low compared with neighbouring cities. Another measure is that authorities could introduce congestion charges for vehicles entering busy city centres during peak hours. For instance, London's congestion charge has been credited with reducing central traffic volumes since it was introduced in 2003.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ ประการแรกคือรัฐบาลสามารถลงทุนอย่างหนักในการขยายเครือข่ายขนส่งสาธารณะที่มีราคาย่อมเยาและมีประสิทธิภาพ ตัวอย่างเช่น การลงทุนอย่างต่อเนื่องของสิงคโปร์ในระบบรถไฟฟ้าขนส่งมวลชน (MRT) ได้ช่วยรักษาระดับการเป็นเจ้าของรถยนต์ส่วนตัวให้อยู่ในระดับค่อนข้างต่ำ เมื่อเทียบกับเมืองใกล้เคียง มาตรการอีกประการหนึ่งคือหน่วยงานต่างๆ สามารถนำค่าธรรมเนียมการจราจรติดขัดมาใช้สำหรับยานพาหนะที่เข้าสู่ใจกลางเมืองที่พลุกพล่านในช่วงเวลาเร่งด่วน ยกตัวอย่างเช่น ค่าธรรมเนียมการจราจรติดขัดของลอนดอนได้รับการยกย่องว่าช่วยลดปริมาณการจราจรในใจกลางเมืองนับตั้งแต่มีการนำมาใช้ในปี 2003'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that traffic congestion results from complex urban pressures, I am of the opinion that better public transport and congestion pricing can substantially ease this problem.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าปัญหาการจราจรติดขัดเกิดจากแรงกดดันของเมืองที่ซับซ้อน แต่ฉันมีความเห็นว่าระบบขนส่งสาธารณะที่ดีขึ้นและการเก็บค่าธรรมเนียมการจราจรติดขัดสามารถบรรเทาปัญหานี้ได้อย่างมาก'
      }
    ],
    vocab: [
      { word: "traffic congestion", thaiMeaning: "การจราจรติดขัด" },
      { word: "population growth", thaiMeaning: "การเติบโตของประชากร" },
      { word: "public transport networks", thaiMeaning: "เครือข่ายขนส่งสาธารณะ" },
      { word: "congestion charges", thaiMeaning: "ค่าธรรมเนียมความแออัด" },
      { word: "private car registrations", thaiMeaning: "การจดทะเบียนรถยนต์ส่วนบุคคล" },
      { word: "public transport systems", thaiMeaning: "ระบบขนส่งสาธารณะ" },
      { word: "private vehicles", thaiMeaning: "ยานพาหนะส่วนบุคคล" },
      { word: "extensive metro network", thaiMeaning: "เครือข่ายรถไฟใต้ดินที่ครอบคลุม" },
      { word: "outer suburbs", thaiMeaning: "ชานเมืองชั้นนอก" },
      { word: "congestion pricing", thaiMeaning: "การกำหนดราคาตามความแออัด" },
      { word: "central traffic volumes", thaiMeaning: "ปริมาณรถในใจกลางเมือง" },
      { word: "peak hours", thaiMeaning: "ชั่วโมงเร่งด่วน" },
      { word: "busy city centres", thaiMeaning: "ใจกลางเมืองที่แออัด" },
      { word: "private car ownership", thaiMeaning: "การเป็นเจ้าของรถยนต์ส่วนบุคคล" },
      { word: "neighbouring cities", thaiMeaning: "เมืองข้างเคียง" },
      { word: "Mass Rapid Transit", thaiMeaning: "ระบบรถไฟฟ้าขนส่งมวลชน" },
      { word: "complex urban pressures", thaiMeaning: "แรงกดดันเมืองที่ซับซ้อน" },
      { word: "major cities", thaiMeaning: "เมืองใหญ่" },
      { word: "sharp rise", thaiMeaning: "การเพิ่มขึ้นอย่างรวดเร็ว" },
      { word: "rapidly growing cities", thaiMeaning: "เมืองที่เติบโตอย่างรวดเร็ว" },
      { word: "considerably worse", thaiMeaning: "แย่ลงอย่างมาก" },
      { word: "total number of vehicles on the road", thaiMeaning: "จำนวนยานพาหนะบนท้องถนนทั้งหมด" },
      { word: "risen by nearly 15%", thaiMeaning: "เพิ่มขึ้นเกือบ 15%" },
      { word: "previous five years", thaiMeaning: "ห้าปีที่ผ่านมา" },
      { word: "limited or unreliable", thaiMeaning: "จำกัดหรือไม่น่าเชื่อถือ" },
      { word: "pushing many commuters", thaiMeaning: "ผลักดันผู้โดยสารจำนวนมาก" },
      { word: "invest heavily", thaiMeaning: "ลงทุนอย่างหนัก" },
      { word: "continued investment", thaiMeaning: "การลงทุนอย่างต่อเนื่อง" },
      { word: "relatively low compared with", thaiMeaning: "ค่อนข้างต่ำเมื่อเทียบกับ" },
      { word: "substantially ease this problem", thaiMeaning: "บรรเทาปัญหานี้ได้อย่างมาก" },
      { word: "Southeast Asia", thaiMeaning: "เอเชียตะวันออกเฉียงใต้" },
      { word: "Office of Transport and Traffic Policy", thaiMeaning: "สำนักงานนโยบายขนส่งและการจราจร" }
    ]
  },
  {
    id: 't2-dq-15',
    number: 15,
    typeId: 'double-question',
    title: 'Young People and Lack of Sleep',
    questionText:
      'Many young people today are getting considerably less sleep than previous generations. What are the reasons for this? What measures could be taken to solve this problem?',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that many young people today are getting considerably less sleep than previous generations. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.",
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าคนหนุ่มสาวจำนวนมากในปัจจุบันได้รับการนอนหลับน้อยกว่าคนรุ่นก่อนอย่างมาก เรียงความนี้จะอธิบายเหตุผลของเรื่องนี้ ก่อนที่จะเสนอมาตรการบางประการเพื่อแก้ไขปัญหานี้'
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons associated with declining sleep among young people. The first reason is that smartphones and social media keep teenagers engaged late into the night, which delays their natural bedtime. For example, a 2021 study by the Sleep Foundation found that teenagers who used their phones after 10pm slept, on average, over an hour less than those who did not. Another reason is that this is because heavy academic workloads and extracurricular commitments leave students with little time to rest before school assignments are due. For instance, students in several East Asian countries frequently report studying or completing homework past midnight.",
        thai: 'ก่อนอื่นเลย มีเหตุผลหลายประการที่เกี่ยวข้องกับการนอนหลับที่ลดลงในหมู่คนหนุ่มสาว เหตุผลแรกคือสมาร์ทโฟนและโซเชียลมีเดียทำให้วัยรุ่นมีส่วนร่วมจนดึกดื่น ซึ่งทำให้เวลาเข้านอนตามธรรมชาติของพวกเขาล่าช้าออกไป ตัวอย่างเช่น การศึกษาในปี 2021 โดย Sleep Foundation พบว่าวัยรุ่นที่ใช้โทรศัพท์หลัง 4 ทุ่มนอนหลับน้อยกว่าผู้ที่ไม่ใช้โดยเฉลี่ยกว่าหนึ่งชั่วโมง อีกเหตุผลหนึ่งคือเป็นเพราะภาระงานทางวิชาการที่หนักหน่วงและกิจกรรมนอกหลักสูตรทำให้นักเรียนมีเวลาพักผ่อนน้อยมากก่อนถึงกำหนดส่งงาน ยกตัวอย่างเช่น นักเรียนในหลายประเทศแถบเอเชียตะวันออกมักรายงานว่าต้องอ่านหนังสือหรือทำการบ้านจนเลยเที่ยงคืน'
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that schools could start lessons later in the morning to better match teenagers' natural sleep cycles. For example, several school districts in the United States delayed their start times after 2014 research from the American Academy of Pediatrics linked early starts to chronic sleep deprivation. Another measure is that parents could establish clear household rules limiting screen use during the hour before bedtime. For instance, some families now use automatic app timers that disable social media access each evening.",
        thai: 'เมื่อพิจารณาถึงแนวทางแก้ไขที่เป็นไปได้ มีมาตรการหลายประการที่อาจช่วยแก้ไขปัญหานี้ ประการแรกคือโรงเรียนสามารถเริ่มการเรียนการสอนในตอนเช้าให้ช้าลง เพื่อให้เข้ากับวงจรการนอนหลับตามธรรมชาติของวัยรุ่นได้ดีขึ้น ตัวอย่างเช่น เขตการศึกษาหลายแห่งในสหรัฐอเมริกาเลื่อนเวลาเริ่มเรียนออกไป หลังจากงานวิจัยในปี 2014 จาก American Academy of Pediatrics เชื่อมโยงการเริ่มเรียนเช้าเกินไปกับการอดนอนเรื้อรัง มาตรการอีกประการหนึ่งคือผู้ปกครองสามารถกำหนดกฎเกณฑ์ในบ้านที่ชัดเจนเพื่อจำกัดการใช้หน้าจอในชั่วโมงก่อนเข้านอน ยกตัวอย่างเช่น บางครอบครัวในปัจจุบันใช้ตัวตั้งเวลาแอปอัตโนมัติที่ปิดการใช้งานโซเชียลมีเดียในทุกเย็น'
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that modern lifestyles make sufficient sleep difficult to achieve, I am of the opinion that later school start times and screen limits can meaningfully improve this problem.",
        thai: 'โดยสรุป แม้ว่าจะปฏิเสธไม่ได้ว่าวิถีชีวิตสมัยใหม่ทำให้การนอนหลับที่เพียงพอเป็นเรื่องยากที่จะบรรลุได้ แต่ฉันมีความเห็นว่าการเริ่มเรียนที่ช้าลงและการจำกัดการใช้หน้าจอสามารถปรับปรุงปัญหานี้ได้อย่างมีนัยสำคัญ'
      }
    ],
    vocab: [
      { word: "academic workloads", thaiMeaning: "ภาระงานด้านการเรียน" },
      { word: "sleep cycles", thaiMeaning: "วงจรการนอนหลับ" },
      { word: "screen use", thaiMeaning: "การใช้หน้าจอ" },
      { word: "sleep deprivation", thaiMeaning: "การอดนอน" },
      { word: "natural bedtime", thaiMeaning: "เวลานอนตามธรรมชาติ" },
      { word: "extracurricular commitments", thaiMeaning: "ภารกิจกิจกรรมนอกหลักสูตร" },
      { word: "school assignments", thaiMeaning: "งานที่ได้รับมอบหมายจากโรงเรียน" },
      { word: "household rules", thaiMeaning: "กฎในบ้าน" },
      { word: "screen limits", thaiMeaning: "การจำกัดการใช้หน้าจอ" },
      { word: "school start times", thaiMeaning: "เวลาเริ่มเรียน" },
      { word: "sufficient sleep", thaiMeaning: "การนอนหลับที่เพียงพอ" },
      { word: "automatic app timers", thaiMeaning: "ตัวจับเวลาแอปอัตโนมัติ" },
      { word: "previous generations", thaiMeaning: "คนรุ่นก่อน" },
      { word: "modern lifestyles", thaiMeaning: "วิถีชีวิตสมัยใหม่" },
      { word: "declining sleep", thaiMeaning: "การนอนที่ลดลง" },
      { word: "social media access", thaiMeaning: "การเข้าถึงโซเชียลมีเดีย" },
      { word: "past midnight", thaiMeaning: "หลังเที่ยงคืน" },
      { word: "smartphones and social media", thaiMeaning: "สมาร์ทโฟนและโซเชียลมีเดีย" },
      { word: "completing homework", thaiMeaning: "การทำการบ้าน" },
      { word: "East Asian countries", thaiMeaning: "ประเทศในเอเชียตะวันออก" },
      { word: "considerably less sleep", thaiMeaning: "นอนน้อยลงอย่างมาก" },
      { word: "keep teenagers engaged", thaiMeaning: "ดึงดูดวัยรุ่นให้อยู่กับ" },
      { word: "late into the night", thaiMeaning: "จนดึก" },
      { word: "used their phones after 10pm", thaiMeaning: "ใช้โทรศัพท์หลังห้าทุ่ม" },
      { word: "little time to rest", thaiMeaning: "มีเวลาน้อยที่จะพักผ่อน" },
      { word: "start lessons later", thaiMeaning: "เริ่มเรียนทีหลัง" },
      { word: "delayed their start times", thaiMeaning: "เลื่อนเวลาเริ่มเรียน" },
      { word: "hour before bedtime", thaiMeaning: "หนึ่งชั่วโมงก่อนนอน" },
      { word: "meaningfully improve this problem", thaiMeaning: "ปรับปรุงปัญหานี้อย่างมีความหมาย" },
      { word: "Sleep Foundation", thaiMeaning: "มูลนิธิการนอนหลับ" },
      { word: "American Academy of Pediatrics", thaiMeaning: "สถาบันกุมารเวชศาสตร์อเมริกัน" },
      { word: "school districts", thaiMeaning: "เขตการศึกษา" }
    ]
  }
]

export const WRITING_TASK2_PROMPTS: WritingTask2Prompt[] = [
  ...ACADEMIC_WRITING_TASK2_PROMPTS,
  ...GENERAL_TRAINING_TASK2_PROMPTS
]

export const getWritingTask2Prompts = (
  typeId: WritingTask2TypeId,
  track: WritingTask2Track = 'academic'
) =>
  WRITING_TASK2_PROMPTS.filter(
    (prompt) => prompt.typeId === typeId && (prompt.track || 'academic') === track
  )
