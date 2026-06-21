// V2 "synonym table" explanation content for Passage 3 · Band 7 reading questions.
//
// The built-in passage-3 explanations only carry mechanical keyword soup
// (e.g. "refers visitors illustrate = explores desire discover new-found = A"),
// which has no clean phrases and no Thai meaning. This lookup supplies the
// hand-written bilingual content the V2 report card renders: a question-phrase
// ↔ passage-phrase pair with a Thai gloss for each, plus the single key
// vocabulary word the question hinges on.
//
// Keyed by `${answerGroup}#${questionNumber}` — answerGroup is stable per
// passage (e.g. "Cambridge 15 Test 1 Passage 3"). Lookup happens at render time
// in the reading report card; absence of an entry falls back to the legacy
// paraphrase-equation rendering.

export type ReadingVocabBridgePhrase = {
  /** English phrase as it appears (question side or passage side). */
  en: string
  /** Thai gloss / plain-language meaning of that phrase. */
  th: string
}

export type ReadingVocabBridgeKeyVocab = {
  /** The single English word the question turns on. */
  word: string
  /** Thai meaning of that word. */
  th: string
  /** Optional contrast pair (e.g. engineer VS artist) when the word encodes an opposition. */
  contrastA?: string
  contrastB?: string
  /** Optional one-line Thai explanation tying the vocab to the answer. */
  note?: string
}

export type ReadingVocabBridge = {
  questionPhrase: ReadingVocabBridgePhrase
  passagePhrase: ReadingVocabBridgePhrase
  keyVocab?: ReadingVocabBridgeKeyVocab
}

const KEY_SEPARATOR = '#'

export const buildReadingVocabBridgeKey = (answerGroup: string, questionNumber: number) =>
  `${String(answerGroup || '').trim()}${KEY_SEPARATOR}${questionNumber}`

// ─────────────────────────────────────────────────────────────────────────────
// Cambridge 15 Test 1 Passage 3 — "What is exploration?"
// ─────────────────────────────────────────────────────────────────────────────
const CAMBRIDGE_15_TEST_1_PASSAGE_3: Record<number, ReadingVocabBridge> = {
  27: {
    questionPhrase: { en: 'illustrate the point that', th: 'ยกตัวอย่างเพื่อชี้ให้เห็นว่า' },
    passagePhrase: {
      en: 'part of what makes us human',
      th: 'เป็นส่วนหนึ่งของความเป็นมนุษย์'
    },
    keyVocab: {
      word: 'intrinsic',
      th: 'ที่เป็นเนื้อแท้ / ติดตัวมาแต่เกิด',
      note: 'การสำรวจเป็นสิ่งที่ "ติดตัว" มนุษย์ = intrinsic element of being human จึงตอบ A'
    }
  },
  28: {
    questionPhrase: { en: "the writer's view of explorers", th: 'มุมมองของผู้เขียนต่อนักสำรวจ' },
    passagePhrase: {
      en: 'we all have this enquiring instinct',
      th: 'เราทุกคนมีสัญชาตญาณอยากรู้อยากเห็นนี้'
    },
    keyVocab: {
      word: 'instinct',
      th: 'สัญชาตญาณ',
      contrastA: 'explorers · นักสำรวจ',
      contrastB: 'everyone · คนทั่วไป',
      note: 'ผู้เขียนบอกว่าสัญชาตญาณนี้มีใน "ทุกคน" ไม่ใช่แค่นักสำรวจ จึงตอบ C'
    }
  },
  29: {
    questionPhrase: { en: 'refers to a description of Egdon Heath to suggest that', th: 'อ้างถึงการบรรยาย Egdon Heath เพื่อสื่อว่า' },
    passagePhrase: {
      en: 'to suggest the desires and fears of his characters',
      th: 'เพื่อสื่อถึงความปรารถนาและความกลัวของตัวละคร'
    },
    keyVocab: {
      word: 'desires and fears',
      th: 'ความปรารถนาและความกลัว (= สภาวะอารมณ์)',
      note: 'desires and fears = emotional states จึงตอบ C (สำรวจ "จิตใจ" ของคน)'
    }
  },
  30: {
    questionPhrase: { en: "refers to 'a golden age' to suggest that", th: "อ้างถึง 'ยุคทอง' เพื่อสื่อว่า" },
    passagePhrase: {
      en: 'the truth is that we have named only one and a half million of this planet’s species',
      th: 'ความจริงคือเราเพิ่งตั้งชื่อสิ่งมีชีวิตได้แค่ 1.5 ล้านชนิด (ยังเหลืออีกมาก)'
    },
    keyVocab: {
      word: 'on the decline',
      th: 'กำลังถดถอย / ลดน้อยลง',
      note: 'ผู้เขียนแย้งว่าการสำรวจ "ไม่ได้" หมดความจำเป็น — ยังมีให้ค้นอีกมาก จึงตอบ D'
    }
  },
  31: {
    questionPhrase: { en: 'the writer argues that', th: 'ผู้เขียนโต้แย้งว่า' },
    passagePhrase: {
      en: 'tends to reflect the field of endeavour of each pioneer',
      th: 'มักสะท้อนสาขาอาชีพของผู้บุกเบิกแต่ละคน'
    },
    keyVocab: {
      word: 'field of endeavour',
      th: 'สาขา/แวดวงอาชีพที่ทุ่มเท',
      note: 'แต่ละคนนิยามการสำรวจตาม "อาชีพของตัวเอง" = relate to their own professional interests จึงตอบ A'
    }
  },
  32: {
    questionPhrase: { en: 'the writer explains that he is interested in', th: 'ผู้เขียนบอกว่าเขาสนใจเรื่อง' },
    passagePhrase: {
      en: 'how a fresh interpretation, even of a well-travelled route, can give its readers new insights',
      th: 'การตีความใหม่ แม้กับเส้นทางที่คนไปบ่อย ก็ให้มุมมองใหม่แก่ผู้อ่านได้'
    },
    keyVocab: {
      word: 'fresh interpretation',
      th: 'การตีความใหม่ / มุมมองใหม่',
      note: 'fresh interpretation of a well-travelled route = cast new light on familiar places จึงตอบ B'
    }
  },
  33: {
    questionPhrase: { en: 'referred to the relevance of the form of transport used', th: 'พูดถึงความสำคัญของรูปแบบการเดินทางที่ใช้' },
    passagePhrase: {
      en: 'If I’d gone across by camel when I could have gone by car, it would have been a stunt',
      th: 'ถ้าข้ามด้วยอูฐทั้งที่ไปด้วยรถได้ มันก็แค่การโชว์'
    },
    keyVocab: {
      word: 'stunt',
      th: 'การแสดงเรียกร้องความสนใจ (ไม่ใช่การสำรวจจริง)',
      contrastA: 'camel · อูฐ',
      contrastB: 'car · รถยนต์',
      note: 'พูดถึง "วิธีเดินทาง" (อูฐ vs รถ) ตรงกับ Thesiger จึงตอบ E'
    }
  },
  34: {
    questionPhrase: { en: 'described feelings on coming back home after a long journey', th: 'บรรยายความรู้สึกตอนกลับบ้านหลังเดินทางไกล' },
    passagePhrase: {
      en: 'the moment when the explorer returns to the existence he has left behind',
      th: 'ช่วงเวลาที่นักสำรวจกลับสู่ชีวิตที่เขาทิ้งไว้'
    },
    keyVocab: {
      word: 'returns',
      th: 'กลับคืน (สู่บ้าน/ชีวิตเดิม)',
      note: 'returns to the existence he left behind = coming back home ตรงกับ Peter Fleming จึงตอบ A'
    }
  },
  35: {
    questionPhrase: { en: 'worked for the benefit of specific groups of people', th: 'ทำงานเพื่อประโยชน์ของคนกลุ่มเฉพาะ' },
    passagePhrase: {
      en: 'a campaigner on behalf of remote so-called ‘tribal’ peoples',
      th: 'นักรณรงค์เพื่อชนเผ่าห่างไกล'
    },
    keyVocab: {
      word: 'campaigner',
      th: 'นักรณรงค์ / ผู้เรียกร้องเพื่อผู้อื่น',
      note: 'campaigner on behalf of tribal peoples = worked for specific groups ตรงกับ Hanbury-Tenison จึงตอบ D'
    }
  },
  36: {
    questionPhrase: { en: 'did not consider learning about oneself an essential part of exploration', th: 'ไม่ถือว่าการเรียนรู้เกี่ยวกับตัวเองเป็นส่วนสำคัญของการสำรวจ' },
    passagePhrase: {
      en: 'bringing back information from a remote place regardless of any great self-discovery',
      th: 'นำข้อมูลกลับมาจากที่ห่างไกล โดยไม่สนใจการค้นพบตัวเอง'
    },
    keyVocab: {
      word: 'regardless of',
      th: 'โดยไม่คำนึงถึง / ไม่สนใจ',
      note: 'regardless of self-discovery = ไม่ถือว่าการรู้จักตัวเองสำคัญ ตรงกับ Thesiger จึงตอบ E'
    }
  },
  37: {
    questionPhrase: { en: 'defined exploration as being both unique and of value to others', th: 'นิยามการสำรวจว่าต้องทั้งแปลกใหม่และมีคุณค่าต่อผู้อื่น' },
    passagePhrase: {
      en: 'done something that no human has done before – and also done something scientifically useful',
      th: 'ทำสิ่งที่ไม่เคยมีใครทำมาก่อน และเป็นประโยชน์เชิงวิทยาศาสตร์ด้วย'
    },
    keyVocab: {
      word: 'scientifically useful',
      th: 'มีประโยชน์เชิงวิทยาศาสตร์ (= มีคุณค่าต่อผู้อื่น)',
      note: 'no human has done before (unique) + scientifically useful (value) ตรงกับ Ran Fiennes จึงตอบ B'
    }
  },
  38: {
    questionPhrase: { en: 'experience of a large number of …', th: 'มีประสบการณ์เกี่ยวกับ … จำนวนมาก' },
    passagePhrase: {
      en: 'I’ve done a great many expeditions and each one was unique',
      th: 'ผมทำการเดินทางสำรวจมามากมาย และแต่ละครั้งไม่ซ้ำกัน'
    },
    keyVocab: {
      word: 'expeditions',
      th: 'การเดินทางสำรวจ (คำตอบ: unique expeditions)',
      note: 'a great many expeditions = a large number of expeditions'
    }
  },
  39: {
    questionPhrase: { en: 'the first stranger that certain previously … people had encountered', th: 'คนแปลกหน้าคนแรกที่กลุ่มคนซึ่ง … เคยพบ' },
    passagePhrase: {
      en: 'isolated groups of people … even two ‘uncontacted tribes’',
      th: 'กลุ่มคนที่อยู่โดดเดี่ยว … แม้แต่ชนเผ่าที่ไม่เคยติดต่อใคร'
    },
    keyVocab: {
      word: 'uncontacted',
      th: 'ที่ไม่เคยติดต่อโลกภายนอก (คำตอบ)',
      note: '‘uncontacted tribes’ = previously uncontacted people'
    }
  },
  40: {
    questionPhrase: { en: 'no need for further exploration of Earth’s …', th: 'ไม่จำเป็นต้องสำรวจ … ของโลกเพิ่ม' },
    passagePhrase: {
      en: 'We know how the land surface of our planet lies',
      th: 'เรารู้แล้วว่าพื้นผิวดินของโลกเป็นอย่างไร'
    },
    keyVocab: {
      word: 'land surface',
      th: 'พื้นผิวดิน (คำตอบ)',
      note: 'land surface … is now down to the details = ไม่ต้องสำรวจพื้นผิวเพิ่ม'
    }
  }
}


// Registry: answerGroup -> { questionNumber -> bridge }
const READING_VOCAB_BRIDGE_BY_GROUP: Record<string, Record<number, ReadingVocabBridge>> = {
  'Cambridge 15 Test 1 Passage 3': CAMBRIDGE_15_TEST_1_PASSAGE_3,
  "Cambridge 10 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "the importance of belief in a shared goal", th: "ความสำคัญของการเชื่อในเป้าหมายร่วมกัน" },
        passagePhrase: { en: "understood Phillips's ambition and believed in it; Orbison wasn't inspired by the goal", th: "เข้าใจและเชื่อในเป้าหมายของฟิลลิปส์ ส่วนออร์บิสันไม่ได้รับแรงบันดาลใจจากเป้าหมายนั้น" },
        keyVocab: { word: "believed in it / wasn't inspired by the goal", th: "เชื่อในมัน / ไม่ได้ถูกจุดประกายจากเป้าหมาย", note: "เพราะคนที่เชื่อในเป้าหมายร่วมสำเร็จ แต่ออร์บิสันที่ไม่เชื่อกลับล้มเหลว ตัวอย่างนี้จึงเน้นเรื่องการมีค่านิยม/เป้าหมายร่วม จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "they recognised their own limitations", th: "พวกเขายอมรับข้อจำกัดของตัวเอง" },
        passagePhrase: { en: "they were aware that they weren't the most intelligent of the scientists", th: "พวกเขารู้ตัวว่าไม่ใช่นักวิทยาศาสตร์ที่ฉลาดที่สุด" },
        keyVocab: { word: "weren't the most intelligent", th: "ไม่ใช่คนที่ฉลาดที่สุด", note: "การ 'รู้ว่าตัวเองไม่ใช่คนเก่งที่สุด' คือการยอมรับขีดจำกัดของตน จึงทำให้ขอความเห็นผู้อื่น นำไปสู่ความสำเร็จ ตอบ A" }
    },
    29: {
        questionPhrase: { en: "make people commit to an idea", th: "ทำให้คนผูกพันหรือยึดมั่นกับความคิด" },
        passagePhrase: { en: "the very act of writing makes us more likely to believe it", th: "แค่การลงมือเขียนก็ทำให้เราเชื่อสิ่งนั้นมากขึ้น" },
        keyVocab: { word: "writing makes us more likely to believe", th: "การเขียนทำให้เรามีแนวโน้มจะเชื่อมากขึ้น", note: "การเขียนเพิ่มความผูกพัน/ความเชื่อมั่นต่อความคิด ตรงกับตัวเลือกเรื่องทำให้คนเชื่อมั่นในไอเดีย จึงตอบ D" }
    },
    30: {
        questionPhrase: { en: "feel their contributions are valued", th: "รู้สึกว่าความคิดเห็นของตนมีคุณค่า" },
        passagePhrase: { en: "every recommendation is important and will be given full attention", th: "ทุกข้อเสนอแนะมีความสำคัญและจะได้รับการพิจารณาอย่างเต็มที่" },
        keyVocab: { word: "every recommendation is important", th: "ทุกข้อเสนอแนะสำคัญ", note: "ผู้นำควรทำให้พนักงานมั่นใจว่าทุกข้อเสนอมีค่า = พนักงานต้องรู้สึกว่าความคิดของตนถูกให้คุณค่า จึงตอบ B" }
    },
    31: {
        questionPhrase: { en: "at times of change, people tend to play safe", th: "ยามมีการเปลี่ยนแปลง คนมักเลือกทางที่ปลอดภัยไว้ก่อน" },
        passagePhrase: { en: "when things change, we are hard-wired to play it safe", th: "เมื่อมีการเปลี่ยนแปลง เราถูกตั้งโปรแกรมมาให้เล่นแบบปลอดภัย" },
        keyVocab: { word: "hard-wired to play it safe", th: "ถูกฝังมาในธรรมชาติให้เลือกทางปลอดภัย", note: "'play it safe' (เล่นปลอดภัย/หลีกเลี่ยงความเสี่ยง) คือคำตอบที่เติมช่อง 31 ตรงตัวเลือก G" }
    },
    32: {
        questionPhrase: { en: "if aware of potential loss, people will take risks", th: "ถ้ารู้ว่าอาจสูญเสีย คนจะยอมเสี่ยงมากขึ้น" },
        passagePhrase: { en: "we take more gambles when threatened with a loss", th: "เราเสี่ยงมากขึ้นเมื่อถูกคุกคามด้วยการสูญเสีย" },
        keyVocab: { word: "take more gambles", th: "ยอมเสี่ยง/เดิมพันมากขึ้น", contrastA: "loss . การสูญเสีย", contrastB: "reward . รางวัล", note: "เมื่อกลัวสูญเสีย คนจะ 'เสี่ยง' มากกว่าตอนได้รางวัล 'gamble' = เสี่ยง จึงตอบ E (เสี่ยงมากขึ้น)" }
    },
    33: {
        questionPhrase: { en: "people working under threat", th: "คนที่ทำงานภายใต้ภาวะถูกคุกคาม/กดดัน" },
        passagePhrase: { en: "we take more gambles when threatened with a loss", th: "เราเสี่ยงมากขึ้นเมื่อถูกคุกคามด้วยการสูญเสีย" },
        keyVocab: { word: "threatened with a loss", th: "ถูกคุกคามด้วยการสูญเสีย", note: "คนที่ทำงานภายใต้ 'การถูกคุกคาม' จะยอมเสี่ยงมากขึ้น คำว่า threatened เชื่อมโจทย์กับคำตอบ A" }
    },
    34: {
        questionPhrase: { en: "employees in organisations with few rules", th: "พนักงานในองค์กรที่มีกฎเกณฑ์น้อย" },
        passagePhrase: { en: "the only rule was that there were no rules; free interchange of ideas", th: "กฎเดียวคือไม่มีกฎ ทำให้แลกเปลี่ยนความคิดได้อย่างอิสระ" },
        keyVocab: { word: "no rules / free interchange of ideas", th: "ไม่มีกฎ / แลกเปลี่ยนความคิดอย่างอิสระ", note: "องค์กร 'กฎน้อย' = Memphis ที่ 'ไม่มีกฎ' ทำให้คนแบ่งปันไอเดียได้เสรี จึงสร้างสรรค์มากขึ้น ตอบ F" }
    },
    35: {
        questionPhrase: { en: "an environment that encourages exchange of ideas", th: "สภาพแวดล้อมที่ส่งเสริมการแลกเปลี่ยนความคิด" },
        passagePhrase: { en: "this environment encouraged a free interchange of ideas", th: "สภาพแวดล้อมนี้ส่งเสริมการแลกเปลี่ยนความคิดอย่างอิสระ" },
        keyVocab: { word: "free interchange of ideas", th: "การแลกเปลี่ยนความคิดอย่างเสรี", note: "การไม่มีกฎทำให้เกิดการแลกเปลี่ยนไอเดียอย่างอิสระ นำไปสู่ความคิดสร้างสรรค์ จึงตอบ B" }
    },
    36: {
        questionPhrase: { en: "physical surroundings affect how creative people feel", th: "สภาพแวดล้อมทางกายภาพส่งผลต่อความรู้สึกสร้างสรรค์" },
        passagePhrase: { en: "luxurious centres... don't make them feel creative; some without space innovate successfully", th: "ศูนย์หรูหรากลับไม่ทำให้รู้สึกสร้างสรรค์ ส่วนคนไม่มีพื้นที่กลับสร้างสรรค์ได้สำเร็จ" },
        keyVocab: { word: "don't make them feel at all creative", th: "ไม่ได้ทำให้รู้สึกสร้างสรรค์เลย", note: "ผู้เขียนบอกว่าสภาพแวดล้อมหรูหราไม่ได้รับประกันความคิดสร้างสรรค์ ซึ่งขัดกับข้อความในโจทย์ จึงตอบ NO" }
    },
    37: {
        questionPhrase: { en: "most people have the potential to be creative", th: "คนส่วนใหญ่มีศักยภาพที่จะสร้างสรรค์ได้" },
        passagePhrase: { en: "almost every individual can be creative in the right circumstances", th: "เกือบทุกคนสามารถสร้างสรรค์ได้ในสภาวะที่เหมาะสม" },
        keyVocab: { word: "almost every individual can be creative", th: "เกือบทุกคนสามารถสร้างสรรค์ได้", note: "'almost every individual' = 'most people' และ 'can be creative' = 'potential to be creative' ตรงกัน จึงตอบ YES" }
    },
    38: {
        questionPhrase: { en: "teams work best with equally matched intelligence", th: "ทีมทำงานได้ดีที่สุดเมื่อสมาชิกฉลาดเท่ากัน" },
        passagePhrase: { en: "three people will be better than one... even if that one is the smartest", th: "สามคนดีกว่าหนึ่งคน แม้คนเดียวนั้นจะฉลาดที่สุดก็ตาม" },
        keyVocab: { word: "three people better than one", th: "สามคนดีกว่าหนึ่งคน", note: "บทความพูดถึงจำนวนคน ไม่ได้พูดถึงระดับความฉลาดที่ 'เท่ากัน' จึงไม่มีข้อมูลยืนยัน ตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "smaller companies find it easier to innovate", th: "บริษัทเล็กสร้างนวัตกรรมได้ง่ายกว่า" },
        passagePhrase: { en: "easy for a company to be pulled in conflicting directions", th: "บริษัทอาจถูกดึงไปคนละทิศทางได้ง่าย" },
        keyVocab: { word: "conflicting directions", th: "ทิศทางที่ขัดแย้งกัน", note: "บทความไม่เคยเปรียบเทียบขนาดบริษัทเล็กกับใหญ่ในการสร้างนวัตกรรม จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "a manager's approval is more persuasive than a peer's", th: "การเห็นชอบของผู้จัดการโน้มน้าวได้มากกว่าเพื่อนร่วมงาน" },
        passagePhrase: { en: "peer power... is much more powerful than any boss's speech", th: "พลังของเพื่อนร่วมงานมีพลังมากกว่าคำพูดของเจ้านาย" },
        keyVocab: { word: "peer power more powerful than boss's speech", th: "พลังเพื่อนร่วมงานมากกว่าคำพูดเจ้านาย", contrastA: "boss / manager . เจ้านาย/ผู้จัดการ", contrastB: "peer . เพื่อนร่วมงานระดับเดียวกัน", note: "ผู้เขียนบอกตรงข้าม คือเพื่อนร่วมงานโน้มน้าวได้มากกว่าเจ้านาย จึงขัดกับโจทย์ ตอบ NO" }
    },
  },
  "Cambridge 10 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "the novel has been around for so long", th: "นวนิยายมีมานานแล้ว" },
        passagePhrase: { en: "the novel has evolved because of technological developments to print huge numbers of texts", th: "นวนิยายพัฒนาขึ้นเพราะเทคโนโลยีที่พิมพ์ข้อความได้จำนวนมาก" },
        keyVocab: { word: "print out huge numbers of texts", th: "พิมพ์ข้อความออกมาเป็นจำนวนมาก", note: "คำว่า reproduction/printing ในตัวเลือก B โยงกับ 'print out huge numbers' ในเนื้อเรื่อง ทำให้ตอบ B" }
    },
    28: {
        questionPhrase: { en: "with novels, the ___ are the most important thing", th: "กับนวนิยาย สิ่งที่สำคัญที่สุดคือ ___" },
        passagePhrase: { en: "the reader attends mainly to the meaning of words", th: "ผู้อ่านสนใจความหมายของคำเป็นหลัก" },
        keyVocab: { word: "meaning of words", th: "ความหมายของคำ", note: "ตัวเลือก H = 'meanings/words' โยงกับ 'meaning of words' ในเนื้อเรื่องโดยตรง จึงตอบ H" }
    },
    29: {
        questionPhrase: { en: "artists instructed others to produce copies of their work", th: "ศิลปินสั่งให้คนอื่นทำสำเนางานของตน" },
        passagePhrase: { en: "assign the reproduction of their creations to their workshop apprentices", th: "มอบหมายให้ลูกมือในเวิร์กช็อปทำสำเนาผลงาน" },
        keyVocab: { word: "workshop apprentices", th: "ลูกมือ/เด็กฝึกงานในเวิร์กช็อป", note: "'instruct ___ to produce copies' โยงกับ 'assign reproduction to apprentices' คำตอบ L คือ apprentices" }
    },
    30: {
        questionPhrase: { en: "reproduction replicates surface relief, colour and ___", th: "การทำสำเนาเลียนแบบผิวนูน สี และ ___" },
        passagePhrase: { en: "high-quality prints made exactly to the original scale", th: "ภาพพิมพ์คุณภาพสูงที่ทำตามขนาดต้นฉบับเป๊ะ" },
        keyVocab: { word: "to the original scale", th: "ตามขนาดต้นฉบับ", note: "ช่องว่างต้องการคุณสมบัติที่ถูกเลียนแบบ; 'original scale' = 'size/scale' จึงตอบ G" }
    },
    31: {
        questionPhrase: { en: "promoting originals is not in the interests of the ___", th: "การเชิดชูงานต้นฉบับไม่เป็นประโยชน์ต่อ ___" },
        passagePhrase: { en: "severe limitations on the kind of experience offered to visitors", th: "ข้อจำกัดรุนแรงต่อประสบการณ์ที่มอบให้ผู้เข้าชม" },
        keyVocab: { word: "visitors", th: "ผู้เข้าชม/ผู้ชม", note: "'interests of the ___' โยงกับ 'experience offered to visitors' จึงตอบ D = public/visitors" }
    },
    32: {
        questionPhrase: { en: "why visitors feel of low value in museums", th: "ทำไมผู้ชมรู้สึกว่าตนเองด้อยค่าในพิพิธภัณฑ์" },
        passagePhrase: { en: "difficult not to be impressed by one's own relative 'worthlessness'", th: "ยากที่จะไม่รู้สึกถึงความ 'ไร้ค่า' ของตนเอง" },
        keyVocab: { word: "worthlessness", th: "ความไร้ค่า/ความด้อยค่า", note: "National Gallery ยกมาเพื่อแสดงว่าผู้ชมรู้สึกด้อยค่าเมื่อเทียบกับมูลค่างาน จึงตอบ C" }
    },
    33: {
        questionPhrase: { en: "viewers unwilling to criticise the work", th: "ผู้ชมไม่กล้าวิจารณ์ผลงาน" },
        passagePhrase: { en: "nothing the viewer thinks is going to alter that value", th: "สิ่งที่ผู้ชมคิดไม่อาจเปลี่ยนมูลค่านั้นได้" },
        keyVocab: { word: "alter that value", th: "เปลี่ยนแปลงมูลค่านั้น", note: "'unwilling to criticise' โยงกับ 'deterred from reading'; เพราะความเห็นเปลี่ยนมูลค่าไม่ได้ จึงตอบ D" }
    },
    34: {
        questionPhrase: { en: "cause of the 'displacement effect'", th: "สาเหตุของ 'displacement effect'" },
        passagePhrase: { en: "an environment for which they were not originally created", th: "สภาพแวดล้อมที่ไม่ได้ถูกสร้างมาเพื่องานเหล่านั้นแต่แรก" },
        keyVocab: { word: "not originally created for", th: "ไม่ได้ถูกสร้างมาเพื่อ (สภาพแวดล้อมนั้น) แต่แรก", note: "displacement effect เกิดเพราะงานถูกนำมาอยู่ในที่ที่ไม่ได้สร้างมาเพื่อมัน จึงตอบ A" }
    },
    35: {
        questionPhrase: { en: "unlike other art forms, a painting has no set viewing time", th: "ต่างจากศิลปะแขนงอื่น ภาพวาดไม่มีเวลาชมที่กำหนดไว้" },
        passagePhrase: { en: "there is no prescribed time over which a painting is viewed", th: "ไม่มีเวลาที่กำหนดไว้สำหรับการชมภาพวาด" },
        keyVocab: { word: "no prescribed time", th: "ไม่มีเวลาที่ถูกกำหนดไว้", note: "'unlike other forms' โยงกับ 'fundamental difference'; ภาพวาดไม่มีเวลาชมตายตัว จึงตอบ D" }
    },
    36: {
        questionPhrase: { en: "art history should find meaning using a specific method", th: "ประวัติศาสตร์ศิลป์ควรหาความหมายด้วยวิธีเฉพาะอย่าง" },
        passagePhrase: { en: "discovering the meaning of art within the cultural context of its time", th: "ค้นหาความหมายของศิลปะภายในบริบททางวัฒนธรรมของยุคนั้น" },
        keyVocab: { word: "should focus on", th: "ควรมุ่งเน้นไปที่", note: "เนื้อเรื่องบอกว่านักประวัติศาสตร์ศิลป์ 'ทำ' อะไร แต่ไม่ได้บอกว่า 'ควร' ทำ จึงเป็น NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "art historians' approach conflicts with museums", th: "แนวทางของนักประวัติศาสตร์ศิลป์ขัดแย้งกับพิพิธภัณฑ์" },
        passagePhrase: { en: "this is in perfect harmony with the museum's function", th: "สิ่งนี้สอดคล้องกลมกลืนกับหน้าที่ของพิพิธภัณฑ์อย่างสมบูรณ์" },
        keyVocab: { word: "perfect harmony", th: "สอดคล้องกลมกลืนอย่างสมบูรณ์", contrastA: "conflicts . ขัดแย้ง", contrastB: "harmony . สอดคล้องกัน", note: "คำถามว่า 'conflicts' แต่เนื้อเรื่องว่า 'perfect harmony' ตรงข้ามกัน จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "people should be encouraged to express opinions openly", th: "ควรสนับสนุนให้คนแสดงความเห็นอย่างเปิดเผย" },
        passagePhrase: { en: "a warning of what emerges when spontaneous criticism is suppressed", th: "คำเตือนถึงสิ่งที่เกิดขึ้นเมื่อการวิจารณ์ตามธรรมชาติถูกกดทับ" },
        keyVocab: { word: "spontaneous criticism is suppressed", th: "การวิจารณ์ตามธรรมชาติถูกกดทับ", note: "ผู้เขียนเตือนถึงผลร้ายเมื่อ 'กด' การวิจารณ์ จึงสื่อว่าควรส่งเสริมให้แสดงความเห็น ตอบ YES" }
    },
    39: {
        questionPhrase: { en: "reproductions should only be sold if high quality", th: "ควรขายงานทำสำเนาเฉพาะเมื่อมีคุณภาพสูง" },
        passagePhrase: { en: "rendered accessible by means of high-fidelity reproductions", th: "ทำให้เข้าถึงได้ด้วยงานทำสำเนาความเที่ยงตรงสูง" },
        keyVocab: { word: "high-fidelity reproductions", th: "งานทำสำเนาความเที่ยงตรงสูง", note: "เนื้อเรื่องพูดถึงการเข้าถึง ไม่ได้พูดเรื่อง 'ขาย' หรือเงื่อนไขการขาย จึงเป็น NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "powerful people will encourage more people to enjoy art", th: "ผู้มีอำนาจจะส่งเสริมให้คนชื่นชมศิลปะมากขึ้น" },
        passagePhrase: { en: "too much to ask from those who seek to maintain and control the art establishment", th: "เป็นการขอที่มากเกินไปจากผู้ที่ต้องการรักษาและควบคุมวงการศิลปะ" },
        keyVocab: { word: "too much to ask", th: "เป็นการขอที่มากเกินไป (คงไม่เกิดขึ้น)", contrastA: "encourage . ส่งเสริม", contrastB: "maintain and control . รักษาและควบคุม", note: "ผู้เขียนว่าผู้มีอำนาจอยากควบคุม คงไม่ส่งเสริม ('too much to ask') จึงตอบ NO" }
    },
  },
  "Cambridge 10 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "the cemetery, which is the oldest in the Pacific", th: "สุสานซึ่งเก่าแก่ที่สุดในแปซิฟิก" },
        passagePhrase: { en: "the oldest cemetery ever found in the Pacific islands", th: "สุสานที่เก่าแก่ที่สุดเท่าที่เคยพบในหมู่เกาะแปซิฟิก" },
        keyVocab: { word: "oldest cemetery ever found", th: "สุสานที่เก่าแก่ที่สุดเท่าที่เคยพบ", note: "ข้อความบอกตรง ๆ ว่าเป็นสุสานที่เก่าแก่ที่สุด จึงเลือกตัวเลือกที่ระบุว่าเก่าแก่ที่สุด (B)" }
    },
    28: {
        questionPhrase: { en: "uncovered accidentally by an agricultural worker", th: "ถูกค้นพบโดยบังเอิญโดยคนงานเกษตร" },
        passagePhrase: { en: "The site came to light only by chance", th: "แหล่งโบราณคดีถูกพบโดยบังเอิญเท่านั้น" },
        keyVocab: { word: "by chance", th: "โดยบังเอิญ", note: "'by chance' ในเรื่อง = 'accidentally' ในคำถาม ยืนยันว่าการค้นพบเกิดขึ้นโดยบังเอิญ (F)" }
    },
    29: {
        questionPhrase: { en: "things they took on voyages, including animals and tools", th: "สิ่งที่พวกเขานำติดตัวไป รวมถึงสัตว์เลี้ยงและเครื่องมือ" },
        passagePhrase: { en: "carried with them their livestock, taro seedlings and stone tools", th: "นำปศุสัตว์ ต้นกล้าเผือก และเครื่องมือหินติดตัวไปด้วย" },
        keyVocab: { word: "livestock", th: "ปศุสัตว์ / สัตว์เลี้ยง", note: "'livestock' (ปศุสัตว์) คือสิ่งที่นำไปด้วยนอกเหนือจากเครื่องมือ จึงเลือกตัวเลือกที่หมายถึงสัตว์ (i)" }
    },
    30: {
        questionPhrase: { en: "an item found at the site that is very important", th: "สิ่งของที่พบในแหล่งซึ่งสำคัญมาก" },
        passagePhrase: { en: "a Lapita burial urn with modeled birds arranged on the rim", th: "โกศบรรจุศพชาวลาปิตาที่มีรูปนกปั้นเรียงบนขอบ" },
        keyVocab: { word: "burial urn", th: "โกศบรรจุศพ", note: "'burial urn' (โกศ) คือสิ่งสำคัญที่พบในแหล่ง จึงเลือกตัวเลือกที่หมายถึงภาชนะ/โกศ (G)" }
    },
    31: {
        questionPhrase: { en: "what is found inside are Lapita", th: "สิ่งที่อยู่ข้างในเป็นของชาวลาปิตา" },
        passagePhrase: { en: "the human remains sealed inside", th: "ซากศพมนุษย์ที่ถูกปิดผนึกอยู่ข้างใน" },
        keyVocab: { word: "human remains", th: "ซากศพมนุษย์", note: "สิ่งที่อยู่ข้างในโกศคือ 'human remains' (ซากศพ) ซึ่งได้รับการยืนยันว่าเป็นชาวลาปิตา จึงเลือก (D)" }
    },
    32: {
        questionPhrase: { en: "difficulties explaining how the Lapita made their journeys", th: "ความยากในการอธิบายว่าชาวลาปิตาเดินทางได้อย่างไร" },
        passagePhrase: { en: "No-one has found one of their canoes or any rigging", th: "ไม่มีใครเคยพบเรือแคนูหรืออุปกรณ์เดินเรือของพวกเขาเลย" },
        keyVocab: { word: "no-one has found", th: "ไม่มีใครเคยพบ", note: "ไม่พบหลักฐานเรือหรืออุปกรณ์ จึงไม่มีข้อมูลบอกวิธีเดินเรือ ตัวเลือกที่ว่าไม่มีหลักฐานหลงเหลือจึงถูก (C)" }
    },
    33: {
        questionPhrase: { en: "what was extraordinary about the Lapita", th: "อะไรคือสิ่งที่ไม่ธรรมดาเกี่ยวกับชาวลาปิตา" },
        passagePhrase: { en: "sailed out of sight of land, with empty horizons on every side", th: "แล่นเรือออกไปจนมองไม่เห็นแผ่นดิน ขอบฟ้าว่างเปล่ารอบด้าน" },
        keyVocab: { word: "out of sight of land", th: "พ้นสายตาจากแผ่นดิน", note: "สิ่งที่ไม่ธรรมดาคือพวกเขากล้าแล่นเรือพ้นสายตาจากแผ่นดิน ต่างจากบรรพบุรุษ จึงเลือก (A)" }
    },
    34: {
        questionPhrase: { en: "what 'This' refers to in paragraph seven", th: "คำว่า 'This' หมายถึงอะไรในย่อหน้าเจ็ด" },
        passagePhrase: { en: "they could turn about and catch a swift ride back on the trade winds", th: "พวกเขาหันเรือกลับและอาศัยลมค้ากลับมาได้อย่างรวดเร็ว" },
        keyVocab: { word: "catch a ride back on the trade winds", th: "อาศัยลมค้าเดินทางกลับ", note: "'This' ชี้ถึงความสามารถหันเรือกลับโดยอาศัยลมค้า จึงเลือกตัวเลือกที่กล่าวถึงการกลับบ้านได้ปลอดภัย (D)" }
    },
    35: {
        questionPhrase: { en: "how the geography of the region was significant", th: "ภูมิศาสตร์ของภูมิภาคสำคัญอย่างไร" },
        passagePhrase: { en: "the geography of their own archipelagoes would have provided a safety net", th: "ภูมิศาสตร์ของหมู่เกาะของพวกเขาเองทำหน้าที่เป็นตาข่ายนิรภัย" },
        keyVocab: { word: "safety net", th: "ตาข่ายนิรภัย / ที่รองรับความปลอดภัย", note: "'safety net' หมายถึงภูมิศาสตร์ช่วยให้นักเดินเรือกลับบ้านได้ปลอดภัยแม้พลาด จึงเลือก (C)" }
    },
    36: {
        questionPhrase: { en: "it is now clear the Lapita could sail against the wind", th: "ตอนนี้ชัดเจนแล้วว่าชาวลาปิตาแล่นเรือทวนลมได้" },
        passagePhrase: { en: "there's no proof they could do any such thing", th: "ไม่มีหลักฐานว่าพวกเขาทำเช่นนั้นได้" },
        keyVocab: { word: "no proof", th: "ไม่มีหลักฐาน", contrastA: "no proof . maimi laksaan", contrastB: "it is now clear . tonni chatchen laeo", note: "ผู้เขียนอ้างคำของแอนเดอร์สันว่า 'ไม่มีหลักฐาน' จึงขัดแย้งกับคำกล่าวอ้าง ตอบ NO" }
    },
    37: {
        questionPhrase: { en: "extreme climate conditions may have played a part", th: "สภาพภูมิอากาศที่รุนแรงอาจมีส่วนเกี่ยวข้อง" },
        passagePhrase: { en: "El Nino may have helped scatter the Lapita", th: "เอลนีโญอาจช่วยทำให้ชาวลาปิตากระจัดกระจายไป" },
        keyVocab: { word: "may have helped scatter", th: "อาจช่วยทำให้กระจัดกระจาย", note: "เอลนีโญ (สภาพภูมิอากาศรุนแรง) อาจมีบทบาทช่วยให้พวกเขากระจายตัว สอดคล้องกับคำกล่าวอ้าง ตอบ YES" }
    },
    38: {
        questionPhrase: { en: "the Lapita learnt to predict the duration of El Ninos", th: "ชาวลาปิตาเรียนรู้ที่จะทำนายระยะเวลาของเอลนีโญ" },
        passagePhrase: { en: "these super El Ninos might have taken the Lapita on long unplanned voyages", th: "ซูเปอร์เอลนีโญอาจพาชาวลาปิตาออกเดินทางไกลโดยไม่ได้วางแผน" },
        keyVocab: { word: "unplanned voyages", th: "การเดินทางที่ไม่ได้วางแผน", note: "เรื่องบอกว่าเป็นการเดินทาง 'ไม่ได้วางแผน' ไม่มีที่ใดกล่าวว่าพวกเขาทำนายระยะเวลาเอลนีโญได้ ตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "unclear why the Lapita halted their expansion", th: "ไม่ชัดเจนว่าทำไมชาวลาปิตาจึงหยุดการขยายตัว" },
        passagePhrase: { en: "called it quits for reasons known only to them", th: "ยุติการเดินทางด้วยเหตุผลที่มีเพียงพวกเขาเท่านั้นที่รู้" },
        keyVocab: { word: "for reasons known only to them", th: "ด้วยเหตุผลที่มีเพียงพวกเขาเท่านั้นที่รู้", note: "'reasons known only to them' = ไม่มีใครรู้เหตุผล จึงตรงกับ 'unclear why' ตอบ YES" }
    },
    40: {
        questionPhrase: { en: "the majority of Lapita settled on Fiji", th: "ชาวลาปิตาส่วนใหญ่ตั้งถิ่นฐานบนเกาะฟิจิ" },
        passagePhrase: { en: "they encountered hundreds of islands – more than 300 in Fiji alone", th: "พวกเขาพบเกาะหลายร้อยเกาะ มากกว่า 300 เกาะในฟิจิเพียงแห่งเดียว" },
        keyVocab: { word: "encountered hundreds of islands", th: "พบเกาะหลายร้อยเกาะ", note: "เรื่องพูดถึงจำนวนเกาะที่พบในฟิจิ แต่ไม่ได้บอกว่าชาวลาปิตาส่วนใหญ่ตั้งถิ่นฐานที่นั่น ตอบ NOT GIVEN" }
    },
  },
  "Cambridge 10 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "later biologists revised the theory in terms of probability", th: "นักชีววิทยารุ่นหลังปรับทฤษฎีให้พูดในเชิงความน่าจะเป็น" },
        passagePhrase: { en: "they qualified it in terms of probability... it is just very unlikely", th: "พวกเขาขยายความในเชิงความน่าจะเป็น... มันแค่เกิดได้ยากมาก" },
        keyVocab: { word: "qualified (in terms of probability)", th: "ปรับ/ขยายความให้รัดกุมขึ้น (ในเชิงความน่าจะเป็น)", note: "คำว่า 'qualified ... in terms of probability' หมายความว่านักวิทยาศาสตร์รุ่นหลังไม่ได้ปฏิเสธทฤษฎีของ Dollo แต่ผ่อนปรนให้พูดเป็น 'แทบจะเป็นไปไม่ได้' จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "it was used as evidence of a throwback", th: "มันถูกใช้เป็นหลักฐานของการย้อนกลับทางวิวัฒนาการ" },
        passagePhrase: { en: "the whale must be a throwback to a land-living ancestor", th: "วาฬตัวนี้ต้องเป็นการย้อนกลับไปหาบรรพบุรุษที่อยู่บนบก" },
        keyVocab: { word: "throwback to a land-living ancestor", th: "การย้อนกลับไปสู่บรรพบุรุษที่เคยอาศัยบนบก", note: "วาฬมีขาแบบสัตว์บก = หลักฐานของ 'atavism/throwback' ที่นักสำรวจยกขึ้นมาอ้าง จึงตอบ D" }
    },
    29: {
        questionPhrase: { en: "they can be switched back on to restore old traits", th: "พวกมันสามารถถูกเปิดกลับมาทำงานเพื่อฟื้นลักษณะเก่า" },
        passagePhrase: { en: "if these silent genes are somehow switched back on... long-lost traits could reappear", th: "ถ้ายีนเงียบเหล่านี้ถูกเปิดกลับมา... ลักษณะที่หายไปนานอาจปรากฏอีกครั้ง" },
        keyVocab: { word: "switched back on", th: "ถูกเปิดให้ทำงานอีกครั้ง", note: "'silent genes' ไม่ได้หายไป แต่ถูกปิดอยู่ และถ้า 'switched back on' ลักษณะเก่าก็กลับมาได้ จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "it illustrates a trait reappearing within the time frame", th: "มันเป็นตัวอย่างของลักษณะที่กลับมาภายในกรอบเวลาที่คำนวณไว้" },
        passagePhrase: { en: "the team pointed to the mole salamanders... fits with Raff's 10-million-year time frame", th: "ทีมยกตัวอย่างซาลาแมนเดอร์โมล... ซึ่งสอดคล้องกับกรอบ 10 ล้านปีของ Raff" },
        keyVocab: { word: "As a possible example", th: "เป็นตัวอย่างที่เป็นไปได้", note: "ซาลาแมนเดอร์ถูกยกเป็น 'example' ที่สนับสนุนทฤษฎียีนเงียบของ Raff ในกรอบเวลา 10 ล้านปี จึงตอบ B" }
    },
    31: {
        questionPhrase: { en: "toed lizards re-evolved toes from toeless ancestors", th: "กิ้งก่ามีนิ้ววิวัฒน์นิ้วขึ้นใหม่จากบรรพบุรุษที่ไม่มีนิ้ว" },
        passagePhrase: { en: "the toed species re-evolved toes from toeless ancestors", th: "สายพันธุ์ที่มีนิ้ววิวัฒน์นิ้วขึ้นใหม่จากบรรพบุรุษที่ไม่มีนิ้ว" },
        keyVocab: { word: "re-evolved toes from toeless ancestors", th: "วิวัฒน์นิ้วขึ้นมาใหม่จากบรรพบุรุษที่ไร้นิ้ว", note: "Wagner อ้างว่านิ้ว 'หายไปแล้วกลับมาใหม่' หลายครั้ง ไม่ใช่ไม่เคยหาย จึงตอบ A" }
    },
    32: {
        questionPhrase: { en: "biologists reluctant to accept backward evolution", th: "นักชีววิทยาที่ลังเลจะยอมรับวิวัฒนาการย้อนกลับ" },
        passagePhrase: { en: "most biologists have been reluctant... 'evolution cannot run backwards'", th: "นักชีววิทยาส่วนใหญ่ลังเล... 'วิวัฒนาการย้อนกลับไม่ได้'" },
        keyVocab: { word: "reluctant", th: "ลังเล / ไม่เต็มใจ", note: "ฝ่ายที่ 'reluctant' เชื่อว่าวิวัฒนาการย้อนกลับไม่ได้ เป็นมุมมองหนึ่งของสองฝ่ายที่ขัดแย้งกัน จึงจับคู่กับตัวเลือก F" }
    },
    33: {
        questionPhrase: { en: "scientists reaching an opposite conclusion", th: "นักวิทยาศาสตร์ที่ได้ข้อสรุปตรงกันข้าม" },
        passagePhrase: { en: "Louis Dollo was studying fossil records and coming to the opposite conclusion", th: "Louis Dollo ศึกษาซากดึกดำบรรพ์และได้ข้อสรุปตรงกันข้าม" },
        keyVocab: { word: "the opposite conclusion", th: "ข้อสรุปตรงกันข้าม", note: "ตัวอย่าง throwback ทำให้เกิดข้อถกเถียง โดย Dollo ได้ 'opposite conclusion' ว่าวิวัฒนาการย้อนกลับไม่ได้ จึงจับคู่กับตัวเลือก G" }
    },
    34: {
        questionPhrase: { en: "similar structures arising independently in unrelated species", th: "โครงสร้างคล้ายกันเกิดขึ้นเองในสปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        passagePhrase: { en: "similar structures can independently arise in unrelated species", th: "โครงสร้างที่คล้ายกันเกิดขึ้นเองได้ในสปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        keyVocab: { word: "independently arise in unrelated species", th: "เกิดขึ้นเองในสปีชีส์ที่ไม่เกี่ยวข้องกัน", note: "ครีบของฉลามกับวาฬเพชฌฆาตเป็นตัวอย่างของลักษณะคล้ายกันที่เกิดขึ้นเอง ไม่ได้สืบทอดมา จึงจับคู่กับตัวเลือก A" }
    },
    35: {
        questionPhrase: { en: "traits lost then independently reappearing", th: "ลักษณะที่หายไปแล้วปรากฏขึ้นใหม่เองโดยอิสระ" },
        passagePhrase: { en: "similar structures can independently arise in unrelated species", th: "โครงสร้างคล้ายกันเกิดขึ้นเองได้ในสปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        keyVocab: { word: "independently arise", th: "เกิดขึ้นเองโดยอิสระ", note: "คำอธิบายหนึ่งของผล Wagner คือนิ้วหายแล้ว 'เกิดขึ้นใหม่เอง' แบบเดียวกับครีบฉลาม/วาฬ ไม่ใช่ยีนเก่ารอด จึงตอบ B" }
    },
    36: {
        questionPhrase: { en: "old genetic information survived and was reactivated", th: "ข้อมูลพันธุกรรมเก่ารอดอยู่และถูกกระตุ้นให้ทำงานใหม่" },
        passagePhrase: { en: "the genetic information needed to make toes somehow survived... and was reactivated", th: "ข้อมูลพันธุกรรมที่ใช้สร้างนิ้วรอดอยู่... และถูกกระตุ้นกลับมา" },
        keyVocab: { word: "reactivated", th: "ถูกกระตุ้นให้ทำงานอีกครั้ง", note: "คำตอบเติมสรุปคือข้อมูลพันธุกรรม 'survived' นานมากแล้ว 'reactivated' จึงตอบ D" }
    },
    37: {
        questionPhrase: { en: "Wagner was first to study these lizards", th: "Wagner เป็นคนแรกที่ศึกษากิ้งก่าเหล่านี้" },
        passagePhrase: { en: "Wagner... reported some work on the evolutionary history of... Bachia", th: "Wagner... รายงานงานบางส่วนเกี่ยวกับประวัติวิวัฒนาการของ Bachia" },
        keyVocab: { word: "the first person", th: "คนแรก", note: "เนื้อเรื่องบอกแค่ว่า Wagner รายงานงานวิจัย แต่ไม่เคยบอกว่าเขาเป็น 'คนแรก' จึงตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "toed Bachia lizards had toeless ancestors", th: "กิ้งก่า Bachia ที่มีนิ้วมีบรรพบุรุษที่ไม่มีนิ้ว" },
        passagePhrase: { en: "the toed species re-evolved toes from toeless ancestors", th: "สายพันธุ์ที่มีนิ้ววิวัฒน์นิ้วขึ้นใหม่จากบรรพบุรุษที่ไม่มีนิ้ว" },
        keyVocab: { word: "from toeless ancestors", th: "จากบรรพบุรุษที่ไม่มีนิ้ว", note: "เนื้อเรื่องระบุชัดว่ากิ้งก่ามีนิ้วสืบจาก 'toeless ancestors' ตรงกับข้อความ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "long-lost traits in embryos is rare", th: "ลักษณะที่หายไปนานปรากฏในตัวอ่อนเป็นเรื่องหายาก" },
        passagePhrase: { en: "Early embryos of many species develop ancestral features", th: "ตัวอ่อนระยะแรกของสปีชีส์จำนวนมากพัฒนาลักษณะของบรรพบุรุษ" },
        keyVocab: { word: "many species", th: "หลายสปีชีส์ / จำนวนมาก", contrastA: "many species . หลายสปีชีส์ (พบบ่อย)", contrastB: "rare . หายาก", note: "ข้อความบอกว่าตัวอ่อนของ 'many species' มีลักษณะบรรพบุรุษ = พบบ่อย ขัดกับคำว่า 'rare' จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "throwbacks caused by developmental problems in the womb", th: "การย้อนกลับเกิดจากความผิดปกติของพัฒนาการในครรภ์" },
        passagePhrase: { en: "if for any reason this does not happen... leading to an atavism", th: "ถ้าด้วยเหตุใดสิ่งนี้ไม่เกิดขึ้น... นำไปสู่ atavism" },
        keyVocab: { word: "if... this does not happen", th: "ถ้าสิ่งนี้ (โปรแกรมกำจัดลักษณะเก่า) ไม่ทำงาน", note: "เมื่อโปรแกรมพัฒนาการในครรภ์ไม่ทำงานตามปกติ ลักษณะบรรพบุรุษจะค้างอยู่กลายเป็น atavism = ความผิดปกติของพัฒนาการในครรภ์ จึงตอบ YES" }
    },
  },
  "Cambridge 11 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "based on an earlier natural phenomenon", th: "อ้างอิงจากปรากฏการณ์ธรรมชาติในอดีต" },
        passagePhrase: { en: "modelled on historic volcanic explosions, such as Mount Pinatubo in 1991", th: "จำลองจากการระเบิดของภูเขาไฟในอดีต เช่น ภูเขาไฟปินาตูโบปี 1991" },
        keyVocab: { word: "modelled on historic volcanic explosions", th: "ออกแบบโดยอ้างอิงจากการระเบิดของภูเขาไฟในอดีต", note: "คำว่า 'earlier natural phenomenon' ในโจทย์ตรงกับ 'historic volcanic explosions' (ปรากฏการณ์ภูเขาไฟในอดีต) ซึ่งอยู่ในย่อหน้า D คำตอบจึงเป็น D" }
    },
    28: {
        questionPhrase: { en: "an example of a successful use of geo-engineering", th: "ตัวอย่างการใช้ geo-engineering ที่ประสบความสำเร็จ" },
        passagePhrase: { en: "Geo-engineering has been shown to work, at least on a small localised scale", th: "geo-engineering ได้รับการพิสูจน์ว่าได้ผล อย่างน้อยในระดับเล็กเฉพาะพื้นที่" },
        keyVocab: { word: "has been shown to work", th: "ได้รับการพิสูจน์ว่าใช้ได้ผล", note: "'successful use' ในโจทย์คือการพูดถึง 'has been shown to work' (พิสูจน์แล้วว่าได้ผล) ในย่อหน้า B คำตอบจึงเป็น B" }
    },
    29: {
        questionPhrase: { en: "a common definition of geo-engineering", th: "นิยามทั่วไปของ geo-engineering" },
        passagePhrase: { en: "a term which generally refers to the intentional large-scale manipulation of the environment", th: "คำที่โดยทั่วไปหมายถึงการจัดการสิ่งแวดล้อมขนาดใหญ่อย่างจงใจ" },
        keyVocab: { word: "generally refers to", th: "โดยทั่วไปหมายถึง", note: "'common definition' ในโจทย์ตรงกับวลี 'generally refers to' (โดยทั่วไปหมายถึง) ซึ่งเป็นการให้นิยามในย่อหน้า A คำตอบจึงเป็น A" }
    },
    30: {
        questionPhrase: { en: "a ... that would reduce the amount of light reaching Earth", th: "สิ่งที่จะลดปริมาณแสงที่ส่องมาถึงโลก" },
        passagePhrase: { en: "to form a transparent, sunlight-refracting sunshade in an orbit above the Earth", th: "เพื่อสร้างม่านบังแดดโปร่งใสที่หักเหแสงในวงโคจรเหนือโลก" },
        keyVocab: { word: "sunshade", th: "ม่านบังแดด / ที่บังแสงอาทิตย์", note: "ช่องว่างต้องการสิ่งที่ลดแสงที่ส่องถึงโลก พาสเสจระบุว่ายานสร้าง 'sunshade' ที่หักเหแสงอาทิตย์ คำตอบคือ sunshade" }
    },
    31: {
        questionPhrase: { en: "place ... in the sea to encourage", th: "นำ ... ใส่ในทะเลเพื่อกระตุ้น" },
        passagePhrase: { en: "depositing iron in the ocean to stimulate the growth of algae", th: "การปล่อยเหล็กลงในมหาสมุทรเพื่อกระตุ้นการเติบโตของสาหร่าย" },
        keyVocab: { word: "iron", th: "เหล็ก (ธาตุเหล็ก)", note: "'place in the sea' = 'depositing in the ocean' สิ่งที่ใส่ลงไปคือ iron (เหล็ก) คำตอบคือ iron" }
    },
    32: {
        questionPhrase: { en: "to encourage ... to form", th: "เพื่อกระตุ้นให้ ... ก่อตัวขึ้น" },
        passagePhrase: { en: "to stimulate the growth of algae", th: "เพื่อกระตุ้นการเติบโตของสาหร่าย" },
        keyVocab: { word: "algae", th: "สาหร่าย", note: "'encourage to form' = 'stimulate the growth of' สิ่งที่ถูกกระตุ้นให้เติบโตคือ algae คำตอบคือ algae" }
    },
    33: {
        questionPhrase: { en: "to create ... that would reduce the light reaching Earth", th: "เพื่อสร้าง ... ที่จะลดแสงที่ส่องถึงโลก" },
        passagePhrase: { en: "sulphur dioxide would form clouds, which would lead to a global dimming", th: "ซัลเฟอร์ไดออกไซด์จะก่อตัวเป็นเมฆ ซึ่งทำให้โลกมืดลง" },
        keyVocab: { word: "clouds", th: "เมฆ", note: "การพ่นละอองทำให้เกิด 'clouds' ที่นำไปสู่ global dimming (โลกมืดลง = ลดแสง) คำตอบคือ clouds" }
    },
    34: {
        questionPhrase: { en: "fix strong ... to Greenland ice sheets", th: "ติดตั้ง ... ที่แข็งแรงกับแผ่นน้ำแข็งกรีนแลนด์" },
        passagePhrase: { en: "preserve the ice sheets of Greenland with reinforced high-tension cables", th: "รักษาแผ่นน้ำแข็งกรีนแลนด์ด้วยสายเคเบิลแรงดึงสูงที่เสริมความแข็งแรง" },
        keyVocab: { word: "cables", th: "สายเคเบิล / สายเคเบิลแรงดึงสูง", note: "'strong' ในโจทย์ตรงกับ 'reinforced high-tension' สิ่งที่ติดกับน้ำแข็งคือ cables คำตอบคือ cables" }
    },
    35: {
        questionPhrase: { en: "to allow the ... to reflect radiation", th: "เพื่อให้ ... สะท้อนรังสีกลับ" },
        passagePhrase: { en: "enabling radiation to be reflected by the snow", th: "ทำให้รังสีถูกสะท้อนกลับโดยหิมะ" },
        keyVocab: { word: "snow", th: "หิมะ", note: "'reflect radiation' = 'radiation to be reflected' สิ่งที่สะท้อนรังสีคือ snow (หิมะ) เมื่อต้นเบิร์ชผลัดใบ คำตอบคือ snow" }
    },
    36: {
        questionPhrase: { en: "change the direction of ... to bring more cold water", th: "เปลี่ยนทิศทางของ ... เพื่อนำน้ำเย็นมามากขึ้น" },
        passagePhrase: { en: "Re-routing Russian rivers to increase cold water flow to ice-forming areas", th: "การเปลี่ยนเส้นทางแม่น้ำรัสเซียเพื่อเพิ่มการไหลของน้ำเย็นไปยังพื้นที่เกิดน้ำแข็ง" },
        keyVocab: { word: "rivers", th: "แม่น้ำ", note: "'change the direction of' = 'Re-routing' สิ่งที่ถูกเปลี่ยนทิศทางคือ rivers (แม่น้ำ) คำตอบคือ rivers" }
    },
    37: {
        questionPhrase: { en: "effects may not be long-lasting", th: "ผลกระทบอาจอยู่ได้ไม่นาน" },
        passagePhrase: { en: "the planet would return to its pre-engineered condition very rapidly", th: "โลกจะกลับสู่สภาพก่อนถูกปรับแต่งอย่างรวดเร็ว" },
        keyVocab: { word: "return very rapidly", th: "กลับคืนสภาพอย่างรวดเร็ว", note: "'not long-lasting' = หากหยุดทำแล้วโลก 'return very rapidly' ภายใน 10-20 ปี นี่คือคำพูดของ Phil Rasch คำตอบจึงเป็น B" }
    },
    38: {
        questionPhrase: { en: "a topic worth exploring", th: "เป็นหัวข้อที่ควรค่าแก่การศึกษา" },
        passagePhrase: { en: "we shouldn't exclude thinking thoroughly about this topic and its possibilities", th: "เราไม่ควรปฏิเสธที่จะคิดอย่างถี่ถ้วนเกี่ยวกับหัวข้อนี้และความเป็นไปได้" },
        keyVocab: { word: "shouldn't exclude thinking thoroughly about this topic", th: "ไม่ควรปฏิเสธที่จะคิดอย่างจริงจังเกี่ยวกับหัวข้อนี้", note: "'worth exploring' = 'shouldn't exclude thinking thoroughly about' นี่คือคำพูดของ Martin Sommerkorn คำตอบจึงเป็น D" }
    },
    39: {
        questionPhrase: { en: "necessary to limit the effectiveness of projects", th: "อาจจำเป็นต้องจำกัดประสิทธิภาพของโครงการ" },
        passagePhrase: { en: "Angel's project would have to operate at half strength", th: "โครงการของแองเจิลจะต้องทำงานที่ครึ่งกำลัง" },
        keyVocab: { word: "operate at half strength", th: "ทำงานที่ครึ่งกำลัง", note: "'limit the effectiveness' = 'operate at half strength' (ทำงานครึ่งกำลัง) นี่คือความเห็นของ Dan Lunt คำตอบจึงเป็น C" }
    },
    40: {
        questionPhrase: { en: "research into non-fossil fuels cannot be replaced", th: "การวิจัยพลังงานที่ไม่ใช่ฟอสซิลไม่สามารถถูกแทนที่ได้" },
        passagePhrase: { en: "no substitute for developing renewable energy: the only permanent solution", th: "ไม่ใช่สิ่งทดแทนการพัฒนาพลังงานหมุนเวียน ซึ่งเป็นทางออกถาวรเพียงทางเดียว" },
        keyVocab: { word: "no substitute for developing renewable energy", th: "ไม่ใช่สิ่งทดแทนการพัฒนาพลังงานหมุนเวียน", note: "'cannot be replaced' = 'no substitute for' และ 'non-fossil-based fuels' = 'renewable energy' นี่คือคำพูดของ Roger Angel คำตอบจึงเป็น A" }
    },
  },
  "Cambridge 11 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "our tendency to be influenced by others' opinions", th: "แนวโน้มที่เราจะถูกความคิดเห็นของคนอื่นชักจูง" },
        passagePhrase: { en: "people often choose a wrong answer if they see others doing the same", th: "คนมักเลือกคำตอบที่ผิดถ้าเห็นคนอื่นทำแบบนั้น" },
        keyVocab: { word: "if they see others doing the same", th: "ถ้าเห็นคนอื่นทำเหมือนกัน", note: "การ 'เลือกตามคนอื่น' ในการทดสอบจับคู่รูปทรง คือภาพประกอบของแนวโน้มถูกชักจูงโดยคนหมู่มาก จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "ability to perceive the intention behind works of art", th: "ความสามารถรับรู้เจตนาที่ซ่อนอยู่เบื้องหลังงานศิลปะ" },
        passagePhrase: { en: "the viewer can sense the artist's vision in paintings", th: "ผู้ชมสามารถรับรู้วิสัยทัศน์ของศิลปินในภาพวาด" },
        keyVocab: { word: "sense the artist's vision", th: "สัมผัสได้ถึงวิสัยทัศน์ของศิลปิน", note: "'sense the artist's vision' = perceive the intention คนรับรู้เจตนาของศิลปินได้แม้อธิบายไม่ถูก จึงตอบ D" }
    },
    29: {
        questionPhrase: { en: "find it satisfying to work out what a painting represents", th: "รู้สึกพอใจเมื่อได้ไขว่าภาพวาดสื่อถึงอะไร" },
        passagePhrase: { en: "the harder it is to decipher the meaning, the more rewarding the recognition", th: "ยิ่งถอดความหมายยากเท่าไร ช่วงที่เข้าใจก็ยิ่งคุ้มค่า" },
        keyVocab: { word: "rewarding moment of recognition", th: "ช่วงเวลาแห่งการเข้าใจที่คุ้มค่า", note: "'rewarding' = satisfying และ 'decipher the meaning' = work out what it represents จึงตอบ B" }
    },
    30: {
        questionPhrase: { en: "more carefully put together than they appear", th: "ถูกจัดวางอย่างพิถีพิถันกว่าที่ตาเห็น" },
        passagePhrase: { en: "deceptively simple, but meticulously composed", th: "ดูเรียบง่ายอย่างหลอกตา แต่จัดองค์ประกอบอย่างประณีต" },
        keyVocab: { word: "deceptively simple, meticulously composed", th: "ดูง่ายอย่างลวงตา แต่ประกอบอย่างประณีต", note: "'meticulously composed' = carefully put together และ 'deceptively' บอกว่าซับซ้อนกว่าที่เห็น จึงตอบ A" }
    },
    31: {
        questionPhrase: { en: "the impact Impressionist paintings have on our ___", th: "ผลกระทบที่ภาพวาดอิมเพรสชันนิสต์มีต่อ ___ ของเรา" },
        passagePhrase: { en: "the amygdala plays a crucial role in our feelings", th: "อะมิกดาลามีบทบาทสำคัญต่อความรู้สึกของเรา" },
        keyVocab: { word: "feelings", th: "ความรู้สึก / อารมณ์", note: "'feelings' ในเนื้อเรื่อง = emotions ในตัวเลือก ภาพอิมเพรสชันนิสต์กระตุ้นอารมณ์ จึงตอบ C (emotions)" }
    },
    32: {
        questionPhrase: { en: "the precise degree of ___ that appeals to the brain", th: "ระดับ ___ ที่พอดีซึ่งถูกใจสมอง" },
        passagePhrase: { en: "analysed the visual intricacy ... a key level of detail to please the brain", th: "วิเคราะห์ความซับซ้อนทางสายตา ... ระดับรายละเอียดที่พอดีเพื่อให้สมองพอใจ" },
        keyVocab: { word: "visual intricacy / level of detail", th: "ความซับซ้อนทางสายตา / ระดับรายละเอียด", note: "'intricacy' และ 'level of detail' = complexity จึงตอบ B (complexity)" }
    },
    33: {
        questionPhrase: { en: "certain repeated ___ occurring in the natural world", th: "___ ที่เกิดซ้ำ ๆ ซึ่งพบบ่อยในธรรมชาติ" },
        passagePhrase: { en: "'fractals' – repeated motifs recurring in different scales", th: "'แฟร็กทัล' – ลวดลายที่เกิดซ้ำในขนาดต่าง ๆ" },
        keyVocab: { word: "repeated motifs recurring in nature", th: "ลวดลายที่เกิดซ้ำในธรรมชาติ", note: "'motifs' = images ในรายการคำ ลวดลาย/ภาพที่เกิดซ้ำพบทั่วในธรรมชาติ จึงตอบ H (images)" }
    },
    34: {
        questionPhrase: { en: "Forsythe's findings contradicted previous beliefs on fractals", th: "ผลของฟอร์ไซธ์ขัดแย้งกับความเชื่อเดิมเรื่องแฟร็กทัล" },
        passagePhrase: { en: "appealing pieces show signs of 'fractals' ... common throughout nature", th: "งานที่ดึงดูดใจมีร่องรอยของ 'แฟร็กทัล' ... พบทั่วในธรรมชาติ" },
        keyVocab: { word: "no mention of previous beliefs", th: "ไม่มีการพูดถึงความเชื่อเดิม", note: "เนื้อเรื่องไม่เคยกล่าวถึง 'ความเชื่อเดิม' ที่ฟอร์ไซธ์ไปขัดแย้ง จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "mirror-neuron ideas require further verification", th: "แนวคิดเรื่องเซลล์กระจกต้องการการพิสูจน์เพิ่มเติม" },
        passagePhrase: { en: "The hypothesis will need to be thoroughly tested, however", th: "อย่างไรก็ตาม สมมติฐานนี้จำเป็นต้องถูกทดสอบอย่างละเอียด" },
        keyVocab: { word: "will need to be thoroughly tested", th: "จำเป็นต้องถูกทดสอบอย่างละเอียด", note: "'thoroughly tested' = require further verification ตรงกับความเห็นผู้เขียน จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "taste in paintings depends entirely on current trends", th: "รสนิยมในภาพวาดขึ้นกับเทรนด์ปัจจุบันทั้งหมด" },
        passagePhrase: { en: "works best adapted to our visual system may be the most likely to linger", th: "งานที่เข้ากับระบบการมองของเราที่สุด มีแนวโน้มอยู่ยืนนานที่สุด" },
        keyVocab: { word: "entirely", th: "ทั้งหมด / โดยสิ้นเชิง", contrastA: "entirely . ทั้งหมด", contrastB: "might shape what is popular . อาจมีอิทธิพลบ้าง", note: "ผู้เขียนบอกเทรนด์ 'อาจ' มีผลแค่บางส่วน แต่ระบบการมองก็สำคัญ ขัดกับคำว่า 'entirely' จึงตอบ NO" }
    },
    37: {
        questionPhrase: { en: "scientists should define precise rules for reactions to art", th: "นักวิทยาศาสตร์ควรกำหนดกฎที่แน่นอนเรื่องปฏิกิริยาต่อศิลปะ" },
        passagePhrase: { en: "it would be foolish to reduce art appreciation to a set of scientific laws", th: "เป็นเรื่องโง่เขลาที่จะลดทอนการชื่นชมศิลปะให้เหลือเพียงกฎวิทยาศาสตร์" },
        keyVocab: { word: "foolish to reduce ... to scientific laws", th: "โง่เขลาที่จะลดทอนให้เหลือกฎวิทยาศาสตร์", note: "'scientific laws' = precise rules แต่ผู้เขียนบอกว่า 'foolish' จึงไม่เห็นด้วย ตอบ NO" }
    },
    38: {
        questionPhrase: { en: "should consider the cultural context an artist worked in", th: "ควรคำนึงถึงบริบททางวัฒนธรรมที่ศิลปินทำงานอยู่" },
        passagePhrase: { en: "shouldn't underestimate ... their place in history and the artistic environment of their time", th: "ไม่ควรมองข้าม ... ตำแหน่งในประวัติศาสตร์และสภาพแวดล้อมทางศิลปะของยุคนั้น" },
        keyVocab: { word: "place in history and artistic environment", th: "ตำแหน่งในประวัติศาสตร์และสภาพแวดล้อมทางศิลปะ", note: "'place in history / artistic environment' = cultural context และ 'shouldn't underestimate' = ควรคำนึงถึง จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "easier to find meaning in science than in art", th: "หาความหมายในวิทยาศาสตร์ง่ายกว่าในศิลปะ" },
        passagePhrase: { en: "it's not so different to science, where we are ... decoding meaning", th: "ไม่ต่างจากวิทยาศาสตร์ ที่เรา ... ถอดรหัสความหมาย" },
        keyVocab: { word: "not so different to science", th: "ไม่ต่างจากวิทยาศาสตร์", note: "ผู้เขียนบอกศิลปะกับวิทยาศาสตร์ 'คล้ายกัน' แต่ไม่เคยเทียบว่าอันไหนหาความหมายง่ายกว่า จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "scientific insights into how the brain responds to abstract art", th: "ข้อค้นพบทางวิทยาศาสตร์ว่าสมองตอบสนองต่อศิลปะนามธรรมอย่างไร" },
        passagePhrase: { en: "Could the same approach shed light on abstract twentieth-century pieces", th: "วิธีเดียวกันนี้จะช่วยให้เข้าใจงานนามธรรมศตวรรษที่ 20 ได้ไหม" },
        keyVocab: { word: "shed light on abstract ... pieces", th: "ทำให้กระจ่างเกี่ยวกับงานนามธรรม", note: "ทั้งบทความใช้การวิจัยสมอง (scientific) มาอธิบายการตอบสนองต่อศิลปะนามธรรม จึงเหมาะกับ subtitle A" }
    },
  },
  "Cambridge 11 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "books that assume a lack of mathematical knowledge", th: "หนังสือที่ตั้งสมมติฐานว่าผู้อ่านไม่มีความรู้คณิตศาสตร์" },
        passagePhrase: { en: "books to explain their fields to non-scientists", th: "หนังสือที่อธิบายสาขาของตนให้คนที่ไม่ใช่นักวิทยาศาสตร์" },
        keyVocab: { word: "non-scientists", th: "คนที่ไม่ใช่นักวิทยาศาสตร์ (ผู้ขาดความรู้)", note: "คำว่า non-scientists สื่อว่าผู้อ่านไม่มีพื้นความรู้ ตรงกับ 'lack of mathematical knowledge' จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "this is not a typical book about mathematics", th: "หนังสือเล่มนี้ไม่ใช่หนังสือคณิตศาสตร์แบบทั่วไป" },
        passagePhrase: { en: "this book differs from most books on mathematics", th: "หนังสือเล่มนี้แตกต่างจากหนังสือคณิตศาสตร์ส่วนใหญ่" },
        keyVocab: { word: "differs from", th: "แตกต่างจาก", note: "differs from most books = ไม่ typical ความหมายตรงกัน จึงตอบ B" }
    },
    29: {
        questionPhrase: { en: "personal examples of being helped by mathematics", th: "ตัวอย่างส่วนตัวของคนที่ได้รับประโยชน์จากคณิตศาสตร์" },
        passagePhrase: { en: "studied mathematics can master the legal principles", th: "ผู้ที่เรียนคณิตศาสตร์เชี่ยวชาญหลักกฎหมายได้ดีกว่า" },
        keyVocab: { word: "master ... in a way that most others cannot", th: "เชี่ยวชาญได้แบบที่คนอื่นทำไม่ได้", note: "คำให้การส่วนตัวของหมอและทนายที่คณิตศาสตร์ช่วยพวกเขา = personal examples of being helped จึงตอบ G" }
    },
    30: {
        questionPhrase: { en: "people with abilities that seemed incompatible", th: "คนที่มีความสามารถซึ่งดูเหมือนจะเข้ากันไม่ได้" },
        passagePhrase: { en: "a structural engineer who is an artist", th: "วิศวกรโครงสร้างที่เป็นศิลปินด้วย" },
        keyVocab: { word: "structural engineer who is an artist", th: "วิศวกรที่เป็นศิลปิน (สองด้านที่ดูขัดกัน)", contrastA: "engineer . wisawakon (วิเคราะห์/ตัวเลข)", contrastB: "artist . sinlapin (สร้างสรรค์/ศิลปะ)", note: "วิศวกร+ศิลปิน เป็นความสามารถที่ดู incompatible แต่อยู่ในคนเดียว จึงตอบ C" }
    },
    31: {
        questionPhrase: { en: "different focuses of books about mathematics", th: "จุดเน้นที่ต่างกันของหนังสือคณิตศาสตร์" },
        passagePhrase: { en: "Some present lives; Others describe applications; Yet others procedures", th: "บางเล่มเล่าชีวิต บางเล่มอธิบายการประยุกต์ บางเล่มเล่าวิธีการ" },
        keyVocab: { word: "Some ... Others ... Yet others", th: "บางเล่ม...บางเล่ม...บางเล่มอื่น", note: "การไล่ Some/Others/Yet others แสดง 'different focuses' ของหนังสือ จึงตอบ B" }
    },
    32: {
        questionPhrase: { en: "contrast between this book and other publications", th: "การเปรียบเทียบระหว่างหนังสือเล่มนี้กับสิ่งพิมพ์อื่น" },
        passagePhrase: { en: "turn these pages much more slowly than reading a novel or newspaper", th: "พลิกหน้าหนังสือนี้ช้ากว่าตอนอ่านนิยายหรือหนังสือพิมพ์มาก" },
        keyVocab: { word: "more slowly than reading a novel or a newspaper", th: "ช้ากว่าการอ่านนิยายหรือหนังสือพิมพ์", note: "เปรียบเทียบการอ่านเล่มนี้กับ novel/newspaper = contrast กับ publications อื่น จึงตอบ E" }
    },
    33: {
        questionPhrase: { en: "the whole book is accessible to everybody", th: "ทั้งเล่มเข้าใจได้สำหรับทุกคน" },
        passagePhrase: { en: "Anyone can understand every step in the reasoning", th: "ใครก็ตามเข้าใจทุกขั้นตอนของการให้เหตุผลได้" },
        keyVocab: { word: "Anyone ... every step", th: "ใครก็ได้...ทุกขั้นตอน", note: "Anyone=everybody และ every step=the whole book จึงเป็นข้ออ้างว่าทุกคนเข้าถึงได้ ตอบ A" }
    },
    34: {
        questionPhrase: { en: "different categories of intended readers", th: "ประเภทผู้อ่านที่ตั้งใจให้อ่านซึ่งแตกต่างกัน" },
        passagePhrase: { en: "I kept in mind two types of readers", th: "ผมนึกถึงผู้อ่านสองประเภทไว้ในใจ" },
        keyVocab: { word: "two types of readers", th: "ผู้อ่านสองประเภท", note: "two types of readers = different categories of intended readers จึงตอบ F" }
    },
    35: {
        questionPhrase: { en: "suitable for someone who is a", th: "เหมาะกับคนที่เป็น (มือใหม่)" },
        passagePhrase: { en: "parts so simple a beginner could play them", th: "ส่วนที่ง่ายจนมือใหม่ก็เล่นได้" },
        keyVocab: { word: "beginner", th: "มือใหม่ ผู้เริ่มต้น", note: "ทั้งดนตรีและคณิตศาสตร์มีส่วนง่ายที่ beginner ทำได้ คำตอบคือ beginner" }
    },
    36: {
        questionPhrase: { en: "understand advanced mathematics using no more than", th: "เข้าใจคณิตขั้นสูงโดยใช้ไม่เกิน (เลขคณิตเล็กน้อย)" },
        passagePhrase: { en: "they may involve, at most, a little arithmetic", th: "อาจใช้แค่เลขคณิตเพียงเล็กน้อยเป็นอย่างมาก" },
        keyVocab: { word: "arithmetic", th: "เลขคณิต (บวกลบคูณหารพื้นฐาน)", note: "'no more than a limited knowledge' ตรงกับ 'at most a little arithmetic' คำตอบคือ arithmetic" }
    },
    37: {
        questionPhrase: { en: "mathematics requires ... thinking as well as analytical", th: "คณิตศาสตร์ต้องใช้การคิดแบบ (สัญชาตญาณ) ควบคู่การวิเคราะห์" },
        passagePhrase: { en: "its logical, yet intuitive, style of thinking", th: "รูปแบบการคิดที่เป็นตรรกะแต่ก็ใช้สัญชาตญาณ" },
        keyVocab: { word: "intuitive", th: "ใช้สัญชาตญาณ หยั่งรู้", contrastA: "intuitive . sanchatayan (หยั่งรู้)", contrastB: "analytical . wikhro (วิเคราะห์/ตัวเลข)", note: "ข้อต่อ 'as well as analytical' ชี้ว่าต้องการคู่ตรงข้ามของ analytical คือ intuitive" }
    },
    38: {
        questionPhrase: { en: "Some books written by ... have had to leave out the mathematics", th: "หนังสือที่เขียนโดย (นักวิทยาศาสตร์) ต้องตัดคณิตศาสตร์ออก" },
        passagePhrase: { en: "Other scientists have written books ... to omit the mathematics", th: "นักวิทยาศาสตร์คนอื่นเขียนหนังสือ...ต้องละคณิตศาสตร์ไว้" },
        keyVocab: { word: "scientists", th: "นักวิทยาศาสตร์", note: "'leave out' = omit และผู้เขียนคือ scientists คำตอบคือ scientists" }
    },
    39: {
        questionPhrase: { en: "advises readers to perform ... while reading", th: "แนะให้ผู้อ่านทำ (การทดลอง) ขณะอ่าน" },
        passagePhrase: { en: "ready to check claims and carry out experiments", th: "เตรียมพร้อมตรวจสอบข้ออ้างและทำการทดลอง" },
        keyVocab: { word: "experiments", th: "การทดลอง", note: "'perform' ตรงกับ 'carry out' และสิ่งที่ทำคือ experiments คำตอบคือ experiments" }
    },
    40: {
        questionPhrase: { en: "studying ... helped even more than other areas of mathematics", th: "การเรียน (ทฤษฎีบท) ช่วยได้มากกว่าคณิตศาสตร์ด้านอื่น" },
        passagePhrase: { en: "through the study of mathematics, and, in particular, theorems", th: "ผ่านการเรียนคณิตศาสตร์ โดยเฉพาะอย่างยิ่งทฤษฎีบท" },
        keyVocab: { word: "theorems", th: "ทฤษฎีบท", note: "'in particular' เน้นว่าทฤษฎีบทช่วยมากกว่าด้านอื่น คำตอบคือ theorems" }
    },
  },
  "Cambridge 11 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "the most important invention of all", th: "สิ่งประดิษฐ์ที่สำคัญที่สุดในบรรดาทั้งหมด" },
        passagePhrase: { en: "all other inventions pale in significance", th: "สิ่งประดิษฐ์อื่นทั้งหมดดูด้อยความสำคัญลงไป" },
        keyVocab: { word: "pale in significance", th: "ดูด้อยความสำคัญเมื่อเทียบกัน", note: "วลีนี้บอกว่าภาษาเหนือกว่าสิ่งประดิษฐ์อื่นทั้งหมด จึงตรงกับหัวข้อ vi ว่าภาษาสำคัญที่สุด" }
    },
    28: {
        questionPhrase: { en: "of language", th: "ของภาษา (หัวข้อที่ถูกเซ็นเซอร์บางส่วน)" },
        passagePhrase: { en: "a tool of extraordinary sophistication, yet ingenious simplicity", th: "เครื่องมือที่ซับซ้อนอย่างยิ่ง แต่ตั้งอยู่บนความเรียบง่ายอันชาญฉลาด" },
        keyVocab: { word: "sophistication / simplicity", th: "ความซับซ้อน / ความเรียบง่าย", contrastA: "sophistication . ความซับซ้อน", contrastB: "simplicity . ความเรียบง่าย", note: "ย่อหน้า B พูดถึงความขัดแย้งระหว่างความซับซ้อนกับความเรียบง่ายของภาษา จึงเข้ากับหัวข้อ iv" }
    },
    29: {
        questionPhrase: { en: "few sounds organised to convey huge range of meaning", th: "เสียงไม่กี่เสียงถูกจัดเรียงเพื่อสื่อความหมายมากมาย" },
        passagePhrase: { en: "arrange them in special orders... nothing these sounds cannot do", th: "จัดเรียงเสียงในลำดับพิเศษ จนไม่มีสิ่งใดที่เสียงเหล่านี้ทำไม่ได้" },
        keyVocab: { word: "arrange them in some very special orders", th: "จัดเรียงเสียงในลำดับที่พิเศษมาก", note: "การ 'จัดเรียง' เสียงไม่กี่เสียงให้สื่อความหมายไม่จำกัด ตรงกับหัวข้อ ii" }
    },
    30: {
        questionPhrase: { en: "the universal ability to use language", th: "ความสามารถใช้ภาษาที่มีอยู่ในทุกคน" },
        passagePhrase: { en: "one doesn't have to be a genius to set its wheels in motion", th: "ไม่ต้องเป็นอัจฉริยะก็ใช้ภาษาได้" },
        keyVocab: { word: "doesn't have to be a genius", th: "ไม่จำเป็นต้องเป็นอัจฉริยะ", note: "การที่ทุกคนใช้ภาษาได้โดยไม่ต้องเก่งพิเศษ คือ 'universal ability' จึงตรงกับหัวข้อ vii" }
    },
    31: {
        questionPhrase: { en: "differences between languages highlight their impressiveness", th: "ความต่างระหว่างภาษาทำให้เห็นความน่าทึ่งของภาษา" },
        passagePhrase: { en: "estrangement of foreign tongues... brings home the wonder", th: "ความแปลกของภาษาต่างถิ่นทำให้เห็นความมหัศจรรย์ของภาษา" },
        keyVocab: { word: "brings home the wonder", th: "ทำให้ตระหนักถึงความน่าทึ่ง", note: "ภาษาต่างถิ่นที่แปลกพิเศษทำให้เห็นความน่าประทับใจของภาษา ตรงกับหัวข้อ i" }
    },
    32: {
        questionPhrase: { en: "even silence can be meaningful", th: "แม้แต่ความเงียบก็มีความหมายได้" },
        passagePhrase: { en: "even a non-sound... has been invested with a specific function", th: "แม้แต่การไม่มีเสียงก็ถูกกำหนดให้มีหน้าที่เฉพาะ" },
        keyVocab: { word: "non-sound", th: "การไม่มีเสียง / ความเงียบ", note: "'non-sound' คือคำพ้องของ silence เมื่อมันมีหน้าที่ ก็ตรงกับหัวข้อ v" }
    },
    33: {
        questionPhrase: { en: "major impact on ___ aspects of life", th: "ส่งผลกระทบใหญ่ต่อ ___ ด้านของชีวิต" },
        passagePhrase: { en: "transformed our material existence", th: "เปลี่ยนแปลงชีวิตด้านวัตถุของเรา" },
        keyVocab: { word: "material", th: "เกี่ยวกับวัตถุ / ด้านวัตถุ", note: "'aspects of life' ที่ล้อ wheel คือ material existence ในเนื้อเรื่อง คำตอบจึงเป็น E (material)" }
    },
    34: {
        questionPhrase: { en: "no impact has been as ___ as language", th: "ไม่มีผลกระทบใดสำคัญพื้นฐานเท่าภาษา" },
        passagePhrase: { en: "everything we have ever achieved depends on language and originates from it", th: "ทุกสิ่งที่เราทำสำเร็จล้วนพึ่งพาและเกิดจากภาษา" },
        keyVocab: { word: "originates from it", th: "มีต้นกำเนิดมาจากมัน", note: "ภาษาเป็นรากฐานที่ทุกอย่างเกิดขึ้นมา จึงเป็น 'fundamental' คำตอบคือ G" }
    },
    35: {
        questionPhrase: { en: "language is very ___, yet just a small number of sounds", th: "ภาษา ___ มาก แต่ใช้เสียงเพียงไม่กี่เสียง" },
        passagePhrase: { en: "extraordinary sophistication... twenty-five or thirty sounds", th: "ความซับซ้อนอันยิ่งใหญ่ จากเสียงเพียงยี่สิบห้าถึงสามสิบเสียง" },
        keyVocab: { word: "sophistication", th: "ความซับซ้อน", note: "sophistication เป็นคำพ้องของ complex ตัดกับ 'small number of sounds' คำตอบคือ B (complex)" }
    },
    36: {
        questionPhrase: { en: "language appears to be ___ to use", th: "ภาษาดูเหมือนใช้ได้ ___" },
        passagePhrase: { en: "without the slightest exertion... this deceptive ease", th: "โดยแทบไม่ต้องออกแรงเลย ความง่ายที่ลวงตา" },
        keyVocab: { word: "deceptive ease", th: "ความง่ายที่ลวงตา", note: "'ease' และ 'without exertion' หมายถึงง่าย คำตอบคือ F (easy)" }
    },
    37: {
        questionPhrase: { en: "could have achieved present position without language", th: "อาจไปถึงสถานะปัจจุบันได้แม้ไม่มีภาษา" },
        passagePhrase: { en: "Without language, we could never have embarked on our ascent", th: "หากไม่มีภาษา เราคงไม่มีทางเริ่มก้าวขึ้นสู่อำนาจได้เลย" },
        keyVocab: { word: "could never have", th: "คงไม่มีทางจะ...ได้เลย", contrastA: "could never . ไม่มีทางเป็นไปได้", contrastB: "might have . อาจจะเป็นไปได้", note: "ผู้เขียนบอก 'could never' แต่คำถามบอก 'might have' จึงขัดแย้งกัน คำตอบคือ NO" }
    },
    38: {
        questionPhrase: { en: "Port-Royal grammarians did justice to language", th: "นักไวยากรณ์ Port-Royal อธิบายภาษาได้สมคุณค่า" },
        passagePhrase: { en: "no one since has celebrated more eloquently the magnitude of its achievement", th: "ไม่มีใครหลังจากนั้นยกย่องความยิ่งใหญ่ของภาษาได้ไพเราะกว่า" },
        keyVocab: { word: "celebrated more eloquently", th: "ยกย่องได้อย่างไพเราะที่สุด", note: "'did justice to' = อธิบายได้สมคุณค่า ตรงกับการยกย่องอย่างไพเราะที่สุด คำตอบคือ YES" }
    },
    39: {
        questionPhrase: { en: "complex idea clearer in a sentence than one word", th: "ความคิดซับซ้อนอธิบายชัดกว่าด้วยประโยคมากกว่าคำเดียว" },
        passagePhrase: { en: "express in one word what English takes a whole sentence to say", th: "สื่อในคำเดียวสิ่งที่ภาษาอังกฤษต้องใช้ทั้งประโยค" },
        keyVocab: { word: "clearer (ความชัดเจน)", th: "ชัดเจนกว่า", note: "เนื้อเรื่องเทียบความยาว (คำเดียว vs ทั้งประโยค) แต่ไม่พูดว่าอย่างไหน 'ชัดกว่า' จึงเป็น NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "Sumerians started the recording of events", th: "ชาวสุเมเรียนเป็นผู้เริ่มการบันทึกเหตุการณ์" },
        passagePhrase: { en: "invented writing and thus enabled the documentation of history", th: "ประดิษฐ์การเขียนและทำให้บันทึกประวัติศาสตร์ได้" },
        keyVocab: { word: "documentation of history", th: "การบันทึกประวัติศาสตร์", note: "'documentation of history' = recording of events ชาวสุเมเรียนทำให้สิ่งนี้เกิดขึ้น คำตอบคือ YES" }
    },
  },
  "Cambridge 12 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "A surprising course title", th: "ชื่อวิชาที่ชวนตกใจ/น่าประหลาดใจ" },
        passagePhrase: { en: "a course called 'Arson for Profit'", th: "วิชาที่ชื่อว่า 'วางเพลิงเพื่อกำไร'" },
        keyVocab: { word: "surprising", th: "น่าประหลาดใจ", note: "หัวเรื่อง vi 'surprising course title' ตรงกับย่อหน้า A ที่ผู้เขียนตกใจกับชื่อวิชา 'Arson for Profit' จึงเลือกข้อ vi" }
    },
    28: {
        questionPhrase: { en: "attracting the wrong kind of student", th: "ดึงดูดนักเรียนผิดประเภทเข้ามา" },
        passagePhrase: { en: "the perfect course for prospective arsonists to sign up for", th: "วิชาที่เหมาะมากสำหรับว่าที่คนวางเพลิงจะมาลงเรียน" },
        keyVocab: { word: "prospective arsonists", th: "ว่าที่คนวางเพลิง", note: "'wrong kind of student' = ว่าที่คนวางเพลิง (arsonists) ที่อาจมาเรียนเพื่อใช้ในทางร้าย จึงตรงกับหัวเรื่อง viii" }
    },
    29: {
        questionPhrase: { en: "A course title with two meanings", th: "ชื่อวิชาที่มีสองความหมาย" },
        passagePhrase: { en: "'principles of marketing' in an unprincipled way", th: "ใช้ 'หลักการตลาด' แบบไร้หลักจริยธรรม" },
        keyVocab: { word: "principled", th: "มีหลักจริยธรรม / มีหลักการ", contrastA: "principles . กฎเกณฑ์ที่ถูกบัญญัติไว้", contrastB: "principled . มีจริยธรรม", note: "ย่อหน้า C เล่นกับคำว่า 'principles' (มีกฎ) กับ 'principled' (มีจริยธรรม) คือชื่อ/คำที่มีสองความหมาย จึงตรงกับหัวเรื่อง ii" }
    },
    30: {
        questionPhrase: { en: "Applying a theory in an unexpected context", th: "นำทฤษฎีมาใช้ในบริบทที่ไม่คาดคิด" },
        passagePhrase: { en: "the philosopher Immanuel Kant, who argued that any body of knowledge consists of an end and a means", th: "นักปรัชญาคานท์ที่ว่าความรู้ทุกแขนงประกอบด้วยจุดมุ่งหมายและวิธีการ" },
        keyVocab: { word: "theory (Kant's idea)", th: "ทฤษฎี (แนวคิดของคานท์)", note: "ผู้เขียนเอาทฤษฎีปรัชญาของคานท์มาใช้กับเรื่องการตลาด (บริบทที่ไม่คาดคิด) จึงตรงกับหัวเรื่อง iv" }
    },
    31: {
        questionPhrase: { en: "The equal importance of two key issues", th: "ความสำคัญเท่าเทียมกันของสองประเด็นหลัก" },
        passagePhrase: { en: "defined by both the means and the end; hence both deserve scrutiny", th: "นิยามด้วยทั้งวิธีการและจุดมุ่งหมาย ทั้งสองจึงต้องถูกพิจารณา" },
        keyVocab: { word: "both deserve scrutiny", th: "ทั้งสองสมควรได้รับการพิจารณา", note: "'two key issues' = means กับ end ที่สำคัญเท่ากัน ('both') จึงตรงกับหัวเรื่อง iii" }
    },
    32: {
        questionPhrase: { en: "Different names for different outcomes", th: "ชื่อเรียกต่างกันสำหรับผลลัพธ์ที่ต่างกัน" },
        passagePhrase: { en: "one is practicing medicine, the other, murder", th: "คนหนึ่งเรียกว่าการแพทย์ อีกคนเรียกว่าการฆาตกรรม" },
        keyVocab: { word: "different names", th: "ชื่อเรียกที่ต่างกัน", contrastA: "medicine . การแพทย์", contrastB: "murder . การฆาตกรรม", note: "ความรู้เดียวกันแต่จุดมุ่งหมายต่างกันได้ชื่อต่างกัน (firefighting/arson, marketing/fraud, medicine/murder) จึงตรงกับหัวเรื่อง vii" }
    },
    33: {
        questionPhrase: { en: "undergraduates who are studying", th: "นักศึกษาปริญญาตรีที่กำลังเรียนวิชา..." },
        passagePhrase: { en: "sign up for the course in our program in 'fire science'", th: "ลงเรียนวิชาในหลักสูตร 'วิทยาศาสตร์ดับเพลิง'" },
        keyVocab: { word: "fire science", th: "วิทยาศาสตร์ดับเพลิง", note: "ช่องว่างถามว่านักศึกษาเรียนสาขาอะไร คำตอบคือ 'fire science' ตามที่ระบุในย่อหน้า A" }
    },
    34: {
        questionPhrase: { en: "they will become … specialising in arson", th: "พวกเขาจะกลายเป็น...ที่เชี่ยวชาญด้านการวางเพลิง" },
        passagePhrase: { en: "the course is intended for prospective arson investigators", th: "วิชานี้มุ่งสำหรับว่าที่นักสืบสวนการวางเพลิง" },
        keyVocab: { word: "investigators", th: "นักสืบสวน/ผู้สอบสวน", note: "'prospective arson investigators' ในข้อความตรงกับช่องว่าง คำตอบจึงเป็น investigators" }
    },
    35: {
        questionPhrase: { en: "find … of criminal intent", th: "หา...ของเจตนาก่ออาชญากรรม" },
        passagePhrase: { en: "establishing a chain of evidence", th: "สร้างห่วงโซ่หลักฐาน" },
        keyVocab: { word: "evidence", th: "หลักฐาน", note: "'find … of criminal intent' พาราเฟรสจาก 'chain of evidence' ในข้อความ คำตอบจึงเป็น evidence" }
    },
    36: {
        questionPhrase: { en: "leading to successful … in the courts", th: "นำไปสู่...ที่สำเร็จในชั้นศาล" },
        passagePhrase: { en: "effective prosecution in a court of law", th: "การฟ้องดำเนินคดีที่ได้ผลในศาล" },
        keyVocab: { word: "prosecution", th: "การฟ้องดำเนินคดี", note: "'successful … in the courts' = 'effective prosecution in a court of law' คำตอบจึงเป็น prosecution" }
    },
    37: {
        questionPhrase: { en: "hard to attract students to non-career courses", th: "ยากที่จะดึงนักเรียนเข้าวิชาที่ไม่เน้นอาชีพ" },
        passagePhrase: { en: "can prepare for a career in resort management, engineering, accounting", th: "เตรียมตัวสู่อาชีพ เช่น การจัดการรีสอร์ต วิศวกรรม การบัญชี" },
        keyVocab: { word: "difficult to attract (not mentioned)", th: "ยากที่จะดึงดูด (ไม่ถูกกล่าวถึง)", note: "ข้อความพูดถึงเฉพาะวิชาที่เน้นอาชีพ แต่ไม่เคยบอกว่าวิชาที่ไม่เน้นอาชีพดึงนักเรียนยาก จึงเป็น NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "useful for people intending to set fire to buildings", th: "มีประโยชน์ต่อคนที่ตั้งใจจะวางเพลิงอาคาร" },
        passagePhrase: { en: "use the very same knowledge of means to achieve a much less noble end", th: "ใช้ความรู้ด้านวิธีการเดียวกันเพื่อจุดมุ่งหมายที่ไม่ดี" },
        keyVocab: { word: "the very same knowledge", th: "ความรู้ชุดเดียวกันนั้นเอง", contrastA: "firefighter . นักดับเพลิง", contrastB: "arsonist . คนวางเพลิง", note: "ผู้เขียนยอมรับว่าความรู้เดียวกันใช้ก่อเหตุวางเพลิง (set fire) ได้ จึงตรงกับคำกล่าว ตอบ YES" }
    },
    39: {
        questionPhrase: { en: "too academic to help people firefight well", th: "เป็นวิชาการเกินไปจนช่วยให้ดับเพลิงเก่งไม่ได้" },
        passagePhrase: { en: "highly welcome as part of the increasing professionalization", th: "เป็นที่ต้อนรับอย่างยิ่งในฐานะการยกระดับวิชาชีพ" },
        keyVocab: { word: "professionalization", th: "การยกระดับสู่ความเป็นมืออาชีพ", note: "ผู้เขียนชื่นชมว่าวิชาช่วยพัฒนาวิชาชีพ ไม่ได้บอกว่าวิชาการเกินไป ขัดกับคำกล่าว ตอบ NO" }
    },
    40: {
        questionPhrase: { en: "provided a detailed definition of their purpose", th: "ให้คำนิยามจุดมุ่งหมายอย่างละเอียด" },
        passagePhrase: { en: "they eventually generalize to something like, 'The safety and welfare of society'", th: "สุดท้ายก็สรุปกว้าง ๆ ว่า 'ความปลอดภัยและสวัสดิภาพของสังคม'" },
        keyVocab: { word: "generalize", th: "สรุปแบบกว้าง ๆ", contrastA: "generalize . พูดรวม ๆ คลุมเครือ", contrastB: "detailed . ละเอียด", note: "นักศึกษาตอบแบบกว้าง ๆ (generalize) ตรงข้ามกับคำว่า 'detailed' ในคำกล่าว จึงตอบ NO" }
    },
  },
  "Cambridge 12 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "observing the … of bilingual people", th: "การสังเกต … ของคนสองภาษา" },
        passagePhrase: { en: "evidence comes from studying eye movements", th: "หลักฐานมาจากการศึกษาการเคลื่อนไหวของดวงตา" },
        keyVocab: { word: "eye movements", th: "การเคลื่อนไหวของดวงตา", note: "คำถามใช้ 'observing' ซึ่งหมายถึง 'studying' ในบทความ สิ่งที่ถูกศึกษา/สังเกตคือ eye movements จึงเป็นคำตอบ" }
    },
    28: {
        questionPhrase: { en: "mechanism known as …", th: "กลไกที่เรียกว่า …" },
        passagePhrase: { en: "this phenomenon, called 'language co-activation'", th: "ปรากฏการณ์นี้ ที่เรียกว่า 'การกระตุ้นภาษาพร้อมกัน'" },
        keyVocab: { word: "language co-activation", th: "การกระตุ้นสองภาษาพร้อมกัน", note: "'known as' ในคำถามตรงกับ 'called' ในบทความ ชื่อกลไกที่ตามมาคือ language co-activation จึงเป็นคำตอบ" }
    },
    29: {
        questionPhrase: { en: "a test called the …, focusing on naming colours", th: "การทดสอบที่เรียกว่า … เน้นการบอกชื่อสี" },
        passagePhrase: { en: "the classic Stroop Task … name the colour of the word's font", th: "Stroop Task ที่ให้บอกสีของตัวอักษร" },
        keyVocab: { word: "Stroop Task", th: "การทดสอบสตรูป", note: "'naming colours' ในคำถามตรงกับ 'name the colour of the word's font' ชื่อการทดสอบคือ Stroop Task จึงเป็นคำตอบ" }
    },
    30: {
        questionPhrase: { en: "more able to handle …", th: "สามารถจัดการกับ … ได้ดีกว่า" },
        passagePhrase: { en: "perform better on tasks that require conflict management", th: "ทำได้ดีกว่าในงานที่ต้องจัดการความขัดแย้ง" },
        keyVocab: { word: "conflict management", th: "การจัดการความขัดแย้ง", note: "'handle' ในคำถามคือคำพ้องของ 'manage' สิ่งที่จัดการคือ conflict จึงได้คำตอบ conflict management" }
    },
    31: {
        questionPhrase: { en: "have superior …", th: "มี … ที่เหนือกว่า" },
        passagePhrase: { en: "reflecting better cognitive control", th: "สะท้อนการควบคุมทางปัญญาที่ดีกว่า" },
        keyVocab: { word: "cognitive control", th: "การควบคุมทางปัญญา", note: "'superior' ในคำถามตรงกับ 'better' ในบทความ สิ่งที่ดีกว่าคือ cognitive control จึงเป็นคำตอบ" }
    },
    32: {
        questionPhrase: { en: "attitudes towards bilingualism have changed", th: "ทัศนคติต่อการพูดสองภาษาเปลี่ยนไป" },
        passagePhrase: { en: "in the past, such children were considered to be at a disadvantage", th: "ในอดีต เด็กเหล่านี้ถูกมองว่าเสียเปรียบ" },
        keyVocab: { word: "in the past … considered a disadvantage", th: "ในอดีตถูกมองว่าเสียเปรียบ", note: "บทความบอกอดีตมองว่าเสียเปรียบ แต่ปัจจุบันพบประโยชน์ ('benefits') ความต่างนี้แสดงว่าทัศนคติเปลี่ยนจริง คำตอบจึงเป็น YES" }
    },
    33: {
        questionPhrase: { en: "bilinguals better at guessing words before finished", th: "คนสองภาษาเดาคำก่อนจบได้เก่งกว่า" },
        passagePhrase: { en: "the brain's language system begins to guess what that word might be", th: "ระบบภาษาในสมองเริ่มเดาว่าคำนั้นคืออะไร" },
        keyVocab: { word: "no comparison of guessing skill", th: "ไม่มีการเปรียบเทียบความสามารถในการเดา", note: "บทความพูดถึงการเดาคำในสมองทุกคน แต่ไม่เคยบอกว่าคนสองภาษาเดา 'เก่งกว่า' คนภาษาเดียว ไม่มีข้อมูลเปรียบเทียบ คำตอบจึงเป็น NOT GIVEN" }
    },
    34: {
        questionPhrase: { en: "bilinguals consistently name images faster", th: "คนสองภาษาบอกชื่อภาพได้เร็วกว่าเสมอ" },
        passagePhrase: { en: "can cause speakers to name pictures more slowly", th: "อาจทำให้บอกชื่อภาพได้ช้าลง" },
        keyVocab: { word: "more slowly", th: "ช้าลง", contrastA: "faster . reo-kwa", contrastB: "more slowly . cha-long", note: "คำถามอ้างว่า 'faster' แต่บทความบอกว่า 'more slowly' ตรงข้ามกัน คำตอบจึงเป็น NO" }
    },
    35: {
        questionPhrase: { en: "process single sounds more efficiently in all situations", th: "ประมวลเสียงเดี่ยวได้ดีกว่าในทุกสถานการณ์" },
        passagePhrase: { en: "in the presence of background noise … neural response is considerably larger", th: "เมื่อมีเสียงรบกวน การตอบสนองของสมองจะมากกว่าอย่างชัดเจน" },
        keyVocab: { word: "in the presence of background noise", th: "เมื่อมีเสียงรบกวนเป็นพื้นหลัง", contrastA: "in all situations . nai-thuk-sathanakan", contrastB: "only with background noise . chapho-meua-mee-siang-robkuan", note: "ข้อได้เปรียบเกิด 'เฉพาะ' ตอนมีเสียงรบกวน ไม่ใช่ 'ทุกสถานการณ์' (ตอนเงียบสมองสองกลุ่มตอบสนองเหมือนกัน) คำตอบจึงเป็น NO" }
    },
    36: {
        questionPhrase: { en: "fewer bilinguals suffer brain disease in old age", th: "คนสองภาษาป่วยเป็นโรคสมองในวัยชราน้อยกว่า" },
        passagePhrase: { en: "bilingual patients reported showing initial symptoms … five years later", th: "ผู้ป่วยสองภาษาแสดงอาการเริ่มต้นช้ากว่าราว 5 ปี" },
        keyVocab: { word: "symptoms later, not fewer cases", th: "อาการมาช้ากว่า ไม่ใช่จำนวนผู้ป่วยน้อยกว่า", note: "บทความบอกอาการ 'มาช้ากว่า' แต่ไม่เคยบอกว่า 'จำนวน' คนป่วยน้อยกว่า ไม่มีข้อมูลเรื่องจำนวน คำตอบจึงเป็น NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "brains responding differently to non-verbal auditory input", th: "สมองตอบสนองต่างกันต่อเสียงที่ไม่ใช่คำพูด" },
        passagePhrase: { en: "listen to simple speech sounds … the same sound … neural response considerably larger", th: "ฟังเสียง และการตอบสนองของสมองต่างกันเมื่อมีเสียงรบกวน" },
        keyVocab: { word: "brain stem responses to sound", th: "การตอบสนองของก้านสมองต่อเสียง", note: "ย่อหน้า D พูดถึงสมองตอบสนองต่างกันต่อ 'sound' (auditory input) เมื่อมีเสียงรบกวน ตรงกับคำถาม คำตอบจึงเป็น D" }
    },
    38: {
        questionPhrase: { en: "bilingual upbringing benefits before we learn to speak", th: "การเลี้ยงดูสองภาษาให้ประโยชน์ก่อนเราพูดได้" },
        passagePhrase: { en: "seven-month-old babies … only the bilingual babies learned the new rule", th: "ทารกเจ็ดเดือน เฉพาะทารกสองภาษาเรียนกฎใหม่ได้" },
        keyVocab: { word: "seven-month-old babies", th: "ทารกอายุเจ็ดเดือน", note: "'before we learn to speak' หมายถึงวัยทารก ย่อหน้า G พูดถึงทารกเจ็ดเดือนที่ยังพูดไม่ได้ ได้ประโยชน์แล้ว คำตอบจึงเป็น G" }
    },
    39: {
        questionPhrase: { en: "process by which people identify words they hear", th: "กระบวนการที่คนระบุคำที่ได้ยิน" },
        passagePhrase: { en: "the sounds arrive in sequential order … brain begins to guess what that word might be", th: "เสียงมาทีละลำดับ สมองเริ่มเดาว่าคำนั้นคืออะไร" },
        keyVocab: { word: "word recognition", th: "การจดจำ/ระบุคำ", note: "'identify words they hear' ตรงกับการอธิบายเรื่อง word recognition และ language co-activation ในย่อหน้า B คำตอบจึงเป็น B" }
    },
    40: {
        questionPhrase: { en: "negative consequences of being bilingual", th: "ผลเสียของการเป็นคนสองภาษา" },
        passagePhrase: { en: "this persistent linguistic competition can result in difficulties", th: "การแข่งขันทางภาษาที่ต่อเนื่องอาจก่อให้เกิดปัญหา" },
        keyVocab: { word: "difficulties", th: "ปัญหา/ความยากลำบาก", contrastA: "negative consequences . phon-sia", contrastB: "difficulties . panha", note: "'negative consequences' ในคำถามตรงกับ 'difficulties' ในย่อหน้า C (พูดช้าลง, นึกคำไม่ออก) คำตอบจึงเป็น C" }
    },
  },
  "Cambridge 12 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "music stimulated the neurons to release a substance", th: "ดนตรีกระตุ้นเซลล์ประสาทให้หลั่งสารชนิดหนึ่ง" },
        passagePhrase: { en: "music triggers the production of dopamine by the neurons", th: "ดนตรีกระตุ้นให้เซลล์ประสาทผลิตโดพามีน" },
        keyVocab: { word: "dopamine", th: "โดพามีน (สารเคมีในสมองที่ควบคุมอารมณ์)", note: "คำว่า release a substance = triggers the production of สารที่ถูกผลิตคือ dopamine จึงเป็นคำตอบช่อง 27" }
    },
    28: {
        questionPhrase: { en: "parts of the brain associated with feeling", th: "ส่วนของสมองที่เชื่อมโยงกับความรู้สึก" },
        passagePhrase: { en: "long been linked with the experience of pleasure", th: "เชื่อมโยงกับประสบการณ์ความสุขมานาน" },
        keyVocab: { word: "pleasure", th: "ความสุข/ความเพลิดเพลิน", note: "associated with = linked with ดังนั้นความรู้สึกที่สมองสองส่วนนี้เกี่ยวข้องคือ pleasure คำตอบช่อง 28" }
    },
    29: {
        questionPhrase: { en: "the area of the brain called the …", th: "บริเวณของสมองที่เรียกว่า…" },
        passagePhrase: { en: "the dopamine neurons in the caudate", th: "เซลล์ประสาทโดพามีนในส่วนคอเดต" },
        keyVocab: { word: "caudate", th: "คอเดต (ส่วนของสมอง)", note: "the area of the brain = a region of the brain ชื่อบริเวณที่ active ก่อนช่วงโปรดคือ caudate คำตอบช่อง 29" }
    },
    30: {
        questionPhrase: { en: "the period known as the …", th: "ช่วงเวลาที่รู้จักกันในชื่อ…" },
        passagePhrase: { en: "researchers call this the 'anticipatory phase'", th: "นักวิจัยเรียกช่วงนี้ว่า 'ระยะคาดการณ์'" },
        keyVocab: { word: "anticipatory phase", th: "ระยะคาดการณ์ (ช่วงก่อนถึงจุดโปรด)", note: "known as = call this ชื่อที่ใช้เรียกช่วงก่อนถึงจุดโปรดคือ anticipatory phase คำตอบช่อง 30" }
    },
    31: {
        questionPhrase: { en: "expectation of 'reward' stimuli such as …", th: "การคาดหวังสิ่งเร้าแบบ 'รางวัล' เช่น…" },
        passagePhrase: { en: "anticipating food and other 'reward' stimuli", th: "การคาดหวังอาหารและสิ่งเร้ารางวัลอื่นๆ" },
        keyVocab: { word: "food", th: "อาหาร", note: "expectation = anticipating ตัวอย่างสิ่งเร้ารางวัลที่ระบุชัดคือ food คำตอบช่อง 31" }
    },
    32: {
        questionPhrase: { en: "how intense our physical responses to music can be", th: "การตอบสนองทางร่างกายต่อดนตรีรุนแรงเพียงใด" },
        passagePhrase: { en: "our body betrays all the symptoms of emotional arousal", th: "ร่างกายเราเผยอาการของการเร้าอารมณ์ทั้งหมด" },
        keyVocab: { word: "emotional arousal", th: "การถูกเร้าทางอารมณ์ (รูม่านตาขยาย ชีพจรเต้นแรง)", note: "อาการทางกายที่บรรยาย (pupils dilate, pulse rise) = intense physical responses จึงเลือกตอบ B" }
    },
    33: {
        questionPhrase: { en: "it produced some remarkably precise data", th: "มันให้ข้อมูลที่แม่นยำอย่างน่าทึ่ง" },
        passagePhrase: { en: "impressively exact and detailed portrait of music in the brain", th: "ภาพดนตรีในสมองที่แม่นยำและละเอียดอย่างน่าประทับใจ" },
        keyVocab: { word: "exact and detailed", th: "แม่นยำและละเอียด", note: "remarkably precise = impressively exact and detailed ผู้เขียนชมว่าได้ข้อมูลแม่นยำ จึงตอบ C" }
    },
    34: {
        questionPhrase: { en: "the timing of participants' neural responses", th: "จังหวะเวลาของการตอบสนองของเซลล์ประสาท" },
        passagePhrase: { en: "most active around 15 seconds before the participants' favourite moments", th: "ทำงานสูงสุดราว 15 วินาทีก่อนช่วงโปรด" },
        keyVocab: { word: "15 seconds before", th: "15 วินาทีก่อนหน้า", note: "timing = ช่วงเวลา '15 seconds before' สิ่งที่ผู้เขียนสนใจคือจังหวะเวลาของการตอบสนอง จึงตอบ A" }
    },
    35: {
        questionPhrase: { en: "to offer support for the Montreal study findings", th: "เพื่อสนับสนุนผลการศึกษาของมอนทรีออล" },
        passagePhrase: { en: "this uncertainty triggers the surge of dopamine in the caudate", th: "ความไม่แน่นอนนี้กระตุ้นการพุ่งของโดพามีนในคอเดต" },
        keyVocab: { word: "support", th: "สนับสนุน/ยืนยัน", note: "ทฤษฎี Meyer (ความไม่แน่นอนกระตุ้นโดพามีนในคอเดต) ตรงกับผลมอนทรีออล จึงเป็นการสนับสนุน ตอบ B" }
    },
    36: {
        questionPhrase: { en: "the internal structure of the musical composition", th: "โครงสร้างภายในของบทเพลง" },
        passagePhrase: { en: "emotions in music come from the unfolding events of the music itself", th: "อารมณ์ในดนตรีมาจากการคลี่คลายของตัวดนตรีเอง" },
        keyVocab: { word: "the music itself", th: "ตัวดนตรีเอง (ไม่ใช่ภาพภายนอก)", contrastA: "embodied meaning . ความหมายในตัวดนตรี", contrastB: "connotative meaning . ความหมายอ้างถึงโลกภายนอก", note: "Meyer บอกว่าอารมณ์มาจาก 'the music itself' = internal structure ไม่ใช่ภาพภายนอก จึงตอบ D" }
    },
    37: {
        questionPhrase: { en: "neuron activity increases prior to key points", th: "เซลล์ประสาททำงานมากขึ้นก่อนจุดสำคัญ" },
        passagePhrase: { en: "dopamine neurons most active around 15 seconds before favourite moments", th: "เซลล์ประสาทโดพามีนทำงานสูงสุดราว 15 วินาทีก่อนช่วงโปรด" },
        keyVocab: { word: "most active before", th: "ทำงานสูงสุดก่อนหน้า", note: "prior to key points = before favourite moments เซลล์ active ก่อนจุดโปรด จึงจับคู่กับ F" }
    },
    38: {
        questionPhrase: { en: "neuron activity decreases if outcomes become predictable", th: "เซลล์ประสาททำงานลดลงถ้าผลคาดเดาได้" },
        passagePhrase: { en: "dopamine neurons quickly adapt to predictable rewards", th: "เซลล์ประสาทโดพามีนปรับตัวต่อรางวัลที่คาดเดาได้อย่างรวดเร็ว" },
        keyVocab: { word: "adapt to predictable", th: "ปรับตัวต่อสิ่งที่คาดเดาได้ (จึงตื่นเต้นน้อยลง)", note: "adapt to predictable rewards = activity decreases when predictable ข้อความถัดมา 'we don't get excited' ยืนยัน จึงจับคู่กับ B" }
    },
    39: {
        questionPhrase: { en: "emotive music delays giving listeners what they expect", th: "ดนตรีเร้าอารมณ์หน่วงการให้สิ่งที่ผู้ฟังคาดหวัง" },
        passagePhrase: { en: "carefully holds off repeating it", th: "จงใจชะลอการเล่นซ้ำรูปแบบนั้น" },
        keyVocab: { word: "holds off", th: "ชะลอ/หน่วงเอาไว้", note: "delays giving = holds off repeating Beethoven หน่วงคอร์ดที่คาดหวังไว้จนจบ จึงจับคู่กับ E" }
    },
    40: {
        questionPhrase: { en: "emotive music can bring to mind actual pictures and events", th: "ดนตรีเร้าอารมณ์ทำให้นึกถึงภาพและเหตุการณ์จริง" },
        passagePhrase: { en: "a sound can refer to the real world of images and experiences", th: "เสียงสามารถอ้างถึงโลกจริงของภาพและประสบการณ์" },
        keyVocab: { word: "refer to the real world", th: "อ้างถึงโลกความจริง (ความหมายแบบ connotative)", note: "bring to mind actual pictures = refer to the real world of images ทฤษฎีก่อนหน้ามองแบบนี้ จึงจับคู่กับ C" }
    },
  },
  "Cambridge 12 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "Many external bodies being held responsible for problems", th: "หน่วยงานภายนอกหลายแห่งถูกโยนความผิดให้รับผิดชอบ" },
        passagePhrase: { en: "blame has been spread far and wide; governments, regulators, central banks and auditors", th: "ความผิดถูกโยนไปทั่วทุกทิศ ทั้งรัฐบาล ผู้กำกับดูแล ธนาคารกลาง และผู้ตรวจสอบบัญชี" },
        keyVocab: { word: "blame spread far and wide", th: "โยนความผิดกระจายไปทั่ว", note: "วลี 'blame spread far and wide' ในย่อหน้า A คือ 'held responsible' กับ 'many external bodies' ในหัวข้อ ทำให้คำตอบคือ iv" }
    },
    28: {
        questionPhrase: { en: "impact on companies of being subjected to close examination", th: "ผลกระทบต่อบริษัทจากการถูกตรวจสอบอย่างใกล้ชิด" },
        passagePhrase: { en: "knock-on effect of this scrutiny... increased the pressures on directors", th: "ผลกระทบต่อเนื่องจากการถูกจับตา ทำให้แรงกดดันต่อกรรมการเพิ่มขึ้น" },
        keyVocab: { word: "scrutiny", th: "การตรวจสอบ/จับตาอย่างเข้มงวด", note: "'scrutiny' = 'close examination' และ 'knock-on effect' = 'impact' ทำให้หัวข้อที่ถูกคือ ii" }
    },
    29: {
        questionPhrase: { en: "not all directors take part in solving major problems", th: "ไม่ใช่กรรมการทุกคนที่มีส่วนร่วมแก้ปัญหาสำคัญ" },
        passagePhrase: { en: "the board as a whole is less involved in fully addressing some of the most important issues", th: "บอร์ดทั้งคณะมีส่วนร่วมน้อยลงในการจัดการประเด็นสำคัญที่สุด" },
        keyVocab: { word: "board as a whole is less involved", th: "บอร์ดทั้งคณะมีส่วนร่วมน้อยลง", note: "'less involved in addressing important issues' = 'not all directors take part in solving major problems' ทำให้คำตอบคือ vi" }
    },
    30: {
        questionPhrase: { en: "A proposal to change the way the board operates", th: "ข้อเสนอให้เปลี่ยนวิธีการทำงานของบอร์ด" },
        passagePhrase: { en: "A radical solution... is the professional board, whose members would work up to three or four days a week", th: "ทางออกแบบสุดขั้วคือบอร์ดมืออาชีพที่ทำงานสัปดาห์ละสามถึงสี่วัน" },
        keyVocab: { word: "radical solution", th: "ทางออกแบบสุดขั้ว/ปฏิรูป", note: "'radical solution' (ตั้งบอร์ดมืออาชีพ) = 'a proposal to change the way the board operates' ทำให้คำตอบคือ viii" }
    },
    31: {
        questionPhrase: { en: "Boards not looking far enough ahead", th: "บอร์ดมองการณ์ไม่ไกลพอ" },
        passagePhrase: { en: "do not focus sufficiently on longer-term matters... concentrate too much on short-term financial metrics", th: "ไม่ให้ความสำคัญกับเรื่องระยะยาว แต่หมกมุ่นกับตัวเลขการเงินระยะสั้น" },
        keyVocab: { word: "longer-term matters", th: "เรื่องในระยะยาว", contrastA: "longer-term . ระยะยาว", contrastB: "short-term . ระยะสั้น", note: "'not focus on longer-term... concentrate on short-term' = 'not looking far enough ahead' ทำให้คำตอบคือ vii" }
    },
    32: {
        questionPhrase: { en: "Disputes over financial arrangements regarding senior managers", th: "ข้อพิพาทเรื่องค่าตอบแทนของผู้บริหารระดับสูง" },
        passagePhrase: { en: "Compensation for chief executives has become a combat zone where pitched battles... are fought", th: "ค่าตอบแทนของซีอีโอกลายเป็นสมรภูมิที่มีการต่อสู้กันอย่างดุเดือด" },
        keyVocab: { word: "combat zone / pitched battles", th: "สมรภูมิ/การต่อสู้กันดุเดือด", note: "'compensation for chief executives' = 'financial arrangements regarding senior managers' และ 'pitched battles' = 'disputes' ทำให้คำตอบคือ i" }
    },
    33: {
        questionPhrase: { en: "possible need for fundamental change in every area", th: "ความจำเป็นที่อาจต้องเปลี่ยนแปลงพื้นฐานในทุกด้าน" },
        passagePhrase: { en: "Boards of companies in all sectors will need to widen their perspective... realignment of corporate goals", th: "บอร์ดในทุกภาคส่วนต้องขยายมุมมองและปรับเป้าหมายองค์กรใหม่" },
        keyVocab: { word: "all sectors / realignment of corporate goals", th: "ทุกภาคส่วน / การปรับเป้าหมายองค์กรใหม่", note: "'all sectors' = 'every area of business' และ 'realignment of goals' = 'fundamental change' ทำให้คำตอบคือ iii" }
    },
    34: {
        questionPhrase: { en: "Close scrutiny of boards has increased since the downturn", th: "การจับตาบอร์ดอย่างใกล้ชิดเพิ่มขึ้นนับตั้งแต่ภาวะเศรษฐกิจตกต่ำ" },
        passagePhrase: { en: "knock-on effect of this scrutiny... significantly increased the pressures on directors", th: "ผลพวงจากการจับตาทำให้แรงกดดันต่อกรรมการเพิ่มขึ้นอย่างมาก" },
        keyVocab: { word: "increased scrutiny", th: "การจับตาที่เพิ่มขึ้น", note: "ข้อความยืนยันว่าการจับตา (scrutiny) หลังวิกฤตปี 2008 เพิ่มขึ้นจริง ตรงกับคำกล่าว จึงตอบ YES" }
    },
    35: {
        questionPhrase: { en: "Banks mismanaged more than other businesses", th: "ธนาคารถูกบริหารผิดพลาดมากกว่าธุรกิจอื่น" },
        passagePhrase: { en: "role of bank directors... failures have been extensively picked over and examined", th: "ความล้มเหลวของกรรมการธนาคารถูกหยิบมาวิเคราะห์อย่างละเอียด" },
        keyVocab: { word: "no comparison given", th: "ไม่มีการเปรียบเทียบ", note: "ข้อความพูดถึงความล้มเหลวของธนาคารแต่ไม่ได้เทียบว่าแย่กว่าธุรกิจอื่นหรือไม่ จึงตอบ NOT GIVEN" }
    },
    36: {
        questionPhrase: { en: "Board meetings continue as long as necessary for full debate", th: "การประชุมบอร์ดดำเนินไปนานพอจนถกกันครบทุกประเด็น" },
        passagePhrase: { en: "time for constructive debate must necessarily be restricted in favour of getting through the business", th: "เวลาสำหรับถกอย่างสร้างสรรค์ถูกจำกัด เพื่อเร่งทำงานให้เสร็จ" },
        keyVocab: { word: "debate must be restricted", th: "การถกเถียงถูกจำกัด", contrastA: "restricted . ถูกจำกัด", contrastB: "as long as necessary . นานเท่าที่จำเป็น", note: "ข้อความบอกว่าเวลาถกเถียง 'ถูกจำกัด' ซึ่งขัดกับคำกล่าวว่าประชุมนานพอ จึงตอบ NO" }
    },
    37: {
        questionPhrase: { en: "committee structure ensures board members fully informed", th: "โครงสร้างคณะกรรมการย่อยทำให้บอร์ดได้รับข้อมูลครบถ้วน" },
        passagePhrase: { en: "board as a whole is less involved in fully addressing some of the most important issues", th: "บอร์ดทั้งคณะมีส่วนร่วมน้อยลงในการจัดการประเด็นสำคัญที่สุด" },
        keyVocab: { word: "less involved", th: "มีส่วนร่วมน้อยลง", contrastA: "less involved . มีส่วนร่วมน้อยลง", contrastB: "fully informed . ได้รับข้อมูลครบถ้วน", note: "การโยนงานให้คณะกรรมการย่อยทำให้บอร์ด 'มีส่วนร่วมน้อยลง' ซึ่งตรงข้ามกับ 'fully informed' จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "non-executive directors at a disadvantage from lack of …", th: "กรรมการที่ไม่ใช่ผู้บริหารเสียเปรียบเพราะขาด …" },
        passagePhrase: { en: "executives had access to information that part-time non-executive directors lacked", th: "ผู้บริหารเข้าถึงข้อมูลที่กรรมการไม่ใช่ผู้บริหารแบบพาร์ทไทม์ไม่มี" },
        keyVocab: { word: "information", th: "ข้อมูล (คำตอบ)", note: "'lacked' ในข้อความ = 'lack of' ในโจทย์ คำที่ขาดคือ 'information' จึงเป็นคำตอบช่องว่าง" }
    },
    39: {
        questionPhrase: { en: "too much emphasis on … short-term considerations", th: "ให้น้ำหนักมากเกินไปกับเรื่อง … ระยะสั้น" },
        passagePhrase: { en: "concentrate too much on short-term financial metrics", th: "หมกมุ่นกับตัวชี้วัดทางการเงินระยะสั้นมากเกินไป" },
        keyVocab: { word: "financial", th: "ทางการเงิน (คำตอบ)", note: "'concentrate too much on short-term financial' = 'too much emphasis on financial short-term' คำที่เติมคือ 'financial'" }
    },
    40: {
        questionPhrase: { en: "the board may have to accept the views of …", th: "บอร์ดอาจต้องยอมรับความเห็นของ …" },
        passagePhrase: { en: "shareholders use their muscle in the area of pay to pressure boards", th: "ผู้ถือหุ้นใช้อำนาจกดดันบอร์ดในเรื่องค่าตอบแทน" },
        keyVocab: { word: "shareholders", th: "ผู้ถือหุ้น (คำตอบ)", note: "'shareholders use their muscle to pressure boards' = บอร์ดต้องยอมรับความเห็นของผู้ถือหุ้น คำตอบคือ 'shareholders'" }
    },
  },
  "Cambridge 13 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "A great deal of progress has been attained", th: "มีความก้าวหน้าเกิดขึ้นมากแล้วในวงการนี้" },
        passagePhrase: { en: "a growing number of computer programs which possess creative talents", th: "โปรแกรมคอมพิวเตอร์ที่มีพรสวรรค์เชิงสร้างสรรค์ซึ่งมีจำนวนเพิ่มขึ้นเรื่อย ๆ" },
        keyVocab: { word: "a growing number", th: "จำนวนที่เพิ่มมากขึ้นเรื่อย ๆ", note: "วลี 'a growing number' บวกกับตัวอย่างความสำเร็จ (ขายได้, ถูกแขวนในหอศิลป์) สื่อว่าวงการนี้ก้าวหน้าไปมากแล้ว จึงตอบ B" }
    },
    28: {
        questionPhrase: { en: "It undermines a fundamental human quality", th: "มันบั่นทอนคุณสมบัติพื้นฐานของความเป็นมนุษย์" },
        passagePhrase: { en: "where does that leave human creativity? a question at the core of humanity", th: "แล้วความคิดสร้างสรรค์ของมนุษย์จะอยู่ตรงไหน คำถามที่แก่นของความเป็นมนุษย์" },
        keyVocab: { word: "core of humanity", th: "แก่นแท้ของความเป็นมนุษย์", note: "'core of humanity' / taking something special away = คุณสมบัติพื้นฐานของมนุษย์ถูกบั่นทอน ตรงกับ undermines a fundamental human quality จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "the source of its subject matter", th: "ที่มาของเนื้อหา/หัวข้อที่นำมาวาด" },
        passagePhrase: { en: "can come up with its own concepts by going online for material", th: "คิดแนวคิดของตัวเองได้โดยเข้าไปหาวัตถุดิบทางออนไลน์" },
        keyVocab: { word: "going online for material", th: "เข้าไปหาวัตถุดิบทางออนไลน์", note: "'material / its own concepts' = source of subject matter ความต่างหลักคือ Painting Fool หาหัวข้อเองออนไลน์ ส่วน Aaron เป็นแค่เครื่องมือ จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "judge computer and human art by different criteria", th: "ตัดสินงานคอมพิวเตอร์กับงานมนุษย์ด้วยมาตรฐานคนละแบบ" },
        passagePhrase: { en: "people's double standards towards software-produced and human-produced art", th: "มาตรฐานสองชั้นของคนต่องานจากซอฟต์แวร์กับงานจากมนุษย์" },
        keyVocab: { word: "double standards", th: "มาตรฐานสองชั้น (ใช้สองมาตรฐาน)", note: "'double standards' = ใช้เกณฑ์ตัดสินคนละแบบ (different criteria) จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "achieves a particularly striking effect", th: "ให้ผลลัพธ์ที่สะดุดตา/น่าทึ่งเป็นพิเศษ" },
        passagePhrase: { en: "came out in black and white gives the work an eerie, ghostlike quality", th: "ออกมาเป็นขาวดำ ทำให้งานมีความน่าขนลุกเหมือนผี" },
        keyVocab: { word: "eerie, ghostlike quality", th: "ลักษณะน่าขนลุกราวกับผี", note: "'eerie, ghostlike quality' คือผลทางอารมณ์ที่สะดุดตา = striking effect แม้เกิดจากบั๊ก จึงตอบ A ไม่ใช่ข้อจำกัดทางเทคนิค" }
    },
    32: {
        questionPhrase: { en: "consider the long-term view", th: "ควรมองภาพระยะยาว" },
        passagePhrase: { en: "humans who have had millennia to develop our skills", th: "มนุษย์ที่ใช้เวลานับพันปีในการพัฒนาทักษะ" },
        keyVocab: { word: "comparing achievements of humans and computers", th: "เปรียบเทียบความสำเร็จของมนุษย์กับคอมพิวเตอร์", note: "'measure machine creativity to that of humans' = comparing humans and computers และ 'millennia' = มุมมองระยะยาว จึงตอบ D" }
    },
    33: {
        questionPhrase: { en: "work virtually indistinguishable from that of humans", th: "งานที่แทบแยกไม่ออกจากงานของมนุษย์" },
        passagePhrase: { en: "fooled classical music experts into thinking they were hearing genuine Bach", th: "หลอกผู้เชี่ยวชาญดนตรีให้คิดว่ากำลังฟังบาคของจริง" },
        keyVocab: { word: "fooled experts into thinking", th: "หลอกผู้เชี่ยวชาญให้เชื่อว่า", note: "'fooled experts into thinking genuine Bach' = แทบแยกไม่ออกจากงานมนุษย์ (indistinguishable) จึงตอบ A" }
    },
    34: {
        questionPhrase: { en: "not revealing the technical details", th: "ไม่เปิดเผยรายละเอียดทางเทคนิค" },
        passagePhrase: { en: "condemned him for his deliberately vague explanation of how the software worked", th: "ตำหนิเขาที่จงใจอธิบายการทำงานของซอฟต์แวร์อย่างคลุมเครือ" },
        keyVocab: { word: "deliberately vague explanation", th: "คำอธิบายที่จงใจคลุมเครือ", note: "'vague explanation of how the software worked' = ไม่เปิดเผยรายละเอียดทางเทคนิค (technical details) จึงตอบ E" }
    },
    35: {
        questionPhrase: { en: "work entirely dependent on its creator's imagination", th: "งานที่ต้องพึ่งจินตนาการของผู้สร้างทั้งหมด" },
        passagePhrase: { en: "replicas which still rely completely on the original artist's creative impulses", th: "สำเนาที่ยังพึ่งพาแรงสร้างสรรค์ของศิลปินต้นฉบับโดยสิ้นเชิง" },
        keyVocab: { word: "rely completely on the original artist", th: "พึ่งพาศิลปินต้นฉบับอย่างสิ้นเชิง", note: "'rely completely on the original artist's creative impulses' = dependent on the imagination of its creator จึงตอบ C" }
    },
    36: {
        questionPhrase: { en: "after discovering it was made by a computer", th: "หลังพบว่ามันเป็นผลงานของคอมพิวเตอร์" },
        passagePhrase: { en: "tricked them into believing a human was behind the score", th: "หลอกพวกเขาให้เชื่อว่ามีมนุษย์อยู่เบื้องหลังบทเพลง" },
        keyVocab: { word: "found out the truth / discovering", th: "ค้นพบความจริงว่าเป็นคอมพิวเตอร์", note: "ผู้ฟังเคยถูกหลอกว่าเป็นมนุษย์ พอ 'found out the truth' ว่าเป็นโปรแกรมคอมพิวเตอร์จึงโกรธ ตรงกับ G" }
    },
    37: {
        questionPhrase: { en: "assess music without knowing the composer", th: "ประเมินดนตรีโดยไม่รู้ว่าใครแต่ง" },
        passagePhrase: { en: "weren't told beforehand whether the tunes were composed by humans or computers", th: "ไม่ถูกบอกล่วงหน้าว่าเพลงแต่งโดยมนุษย์หรือคอมพิวเตอร์" },
        keyVocab: { word: "weren't told whether humans or computers", th: "ไม่ถูกบอกว่าเป็นมนุษย์หรือคอมพิวเตอร์", note: "'weren't told whether humans or computers' = without knowing whether it was humans or software จึงตอบ B" }
    },
    38: {
        questionPhrase: { en: "Moffat's research may help explain reactions to EMI", th: "งานวิจัยของม็อฟแฟตอาจช่วยอธิบายปฏิกิริยาต่อ EMI" },
        passagePhrase: { en: "A study by David Moffat provides a clue", th: "งานศึกษาของเดวิด ม็อฟแฟตให้เบาะแส" },
        keyVocab: { word: "provides a clue", th: "ให้เบาะแส (ช่วยอธิบาย)", note: "'provides a clue' ต่อคำถามว่าทำไมคนถอยหนีเมื่อรู้ที่มา = ช่วยอธิบายปฏิกิริยาต่อ EMI ผู้เขียนเห็นด้วย จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "non-experts all responded in a predictable way", th: "ผู้ที่ไม่ใช่ผู้เชี่ยวชาญตอบสนองในแบบที่คาดเดาได้ทุกคน" },
        passagePhrase: { en: "even among the experts, who might have been expected to be more objective", th: "แม้แต่ในกลุ่มผู้เชี่ยวชาญ ที่น่าจะวิเคราะห์อย่างเป็นกลางกว่า" },
        keyVocab: { word: "all (every non-expert)", th: "ทั้งหมด/ทุกคน", note: "บทอ้างถึงแนวโน้มภาพรวมและพูดถึงผู้เชี่ยวชาญ แต่ไม่ได้ระบุว่าผู้ที่ไม่ใช่ผู้เชี่ยวชาญตอบ 'ทุกคน' แบบเดียวกัน จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "Kruger's findings cast doubt on Bloom's theory", th: "ผลของครูเกอร์ทำให้ทฤษฎีของบลูมน่าสงสัย" },
        passagePhrase: { en: "Similarly, experiments by Justin Kruger have shown people's enjoyment increases", th: "ในทำนองเดียวกัน การทดลองของครูเกอร์แสดงว่าความชื่นชอบเพิ่มขึ้น" },
        keyVocab: { word: "Similarly", th: "ในทำนองเดียวกัน (สอดคล้องกัน)", note: "คำว่า 'Similarly' บอกว่าผลของครูเกอร์ 'สนับสนุน' ทฤษฎีของบลูม ไม่ใช่ทำให้น่าสงสัย จึงขัดแย้งกับโจทย์ ตอบ NO" }
    },
  },
  "Cambridge 13 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "unaware of the significant impact that trends have", th: "ไม่รู้ตัวว่าเทรนด์มีผลกระทบสำคัญมากแค่ไหน" },
        passagePhrase: { en: "fail to recognize the less obvious but profound ways these trends are influencing consumers", th: "มองไม่เห็นวิธีที่ลึกซึ้งแต่ไม่ชัดเจนที่เทรนด์ส่งผลต่อผู้บริโภค" },
        keyVocab: { word: "profound (ways)", th: "ลึกซึ้ง / รุนแรงมาก", note: "'profound' = 'significant impact' และ 'fail to recognize' = 'unaware' จึงตอบ D ผู้จัดการไม่รู้ถึงผลกระทบสำคัญของเทรนด์ที่มีต่อชีวิตผู้บริโภค" }
    },
    28: {
        questionPhrase: { en: "anxious to safeguard its reputation as a luxury manufacturer", th: "กังวลที่จะปกป้องชื่อเสียงในฐานะแบรนด์หรู" },
        passagePhrase: { en: "lowering prices would have risked cheapening the brand's image", th: "การลดราคาอาจทำให้ภาพลักษณ์แบรนด์ดูถูกลง" },
        keyVocab: { word: "cheapening the brand's image", th: "ทำให้ภาพลักษณ์แบรนด์ดูด้อยค่า", note: "'avoid cheapening the image' = 'safeguard reputation as luxury goods' จึงตอบ C โค้ชกังวลเรื่องการรักษาภาพลักษณ์ความหรูหรา" }
    },
    29: {
        questionPhrase: { en: "did not require Tesco to modify its core business", th: "ไม่ต้องเปลี่ยนแปลงธุรกิจหลักของเทสโก้" },
        passagePhrase: { en: "has not abandoned its traditional retail offering but augmented its business", th: "ไม่ได้ทิ้งธุรกิจค้าปลีกเดิม แต่เสริมเพิ่มเข้าไป" },
        keyVocab: { word: "augmented (not abandoned)", th: "เสริมเพิ่มเข้าไป (ไม่ได้ทิ้ง)", note: "'not abandoned... but augmented' = 'did not require to modify core business' จึงตอบ A โครงการนี้ไม่ได้แตะธุรกิจหลักเดิม" }
    },
    30: {
        questionPhrase: { en: "strategy with few obvious benefits", th: "กลยุทธ์ที่ดูเหมือนแทบไม่มีประโยชน์ชัดเจน" },
        passagePhrase: { en: "sounds like it's hardly worthwhile to incorporate a seemingly irrelevant trend", th: "ฟังดูแทบไม่คุ้มที่จะเอาเทรนด์ที่ดูไม่เกี่ยวข้องมาใช้" },
        keyVocab: { word: "hardly worthwhile", th: "แทบไม่คุ้มค่า", note: "'hardly worthwhile / seemingly irrelevant' = 'few obvious benefits' จึงตอบ D กลยุทธ์ของไนกี้ดูเผินๆ เหมือนไม่ได้ประโยชน์อะไร" }
    },
    31: {
        questionPhrase: { en: "addressed people's concerns about unhealthy lifestyles", th: "ตอบโจทย์ความกังวลเรื่องวิถีชีวิตที่ไม่ดีต่อสุขภาพ" },
        passagePhrase: { en: "incorporated the traditional physical component, awarding points for physical activity", th: "ใส่องค์ประกอบการเล่นทางกายแบบดั้งเดิม ให้คะแนนจากการออกกำลังกาย" },
        keyVocab: { word: "physical activity", th: "การเคลื่อนไหวออกกำลังกาย", note: "'physical activity component' แก้ปัญหา 'lack of exercise and obesity' = 'concerns about unhealthy lifestyles' จึงตอบ D" }
    },
    32: {
        questionPhrase: { en: "turned harmful-effects notion to its own advantage", th: "พลิกข้อเสียที่ว่าสินค้าทำร้ายสุขภาพให้เป็นจุดขาย" },
        passagePhrase: { en: "the ME2 counteracted the negative impacts of digital gaming devices", th: "ME2 ตอบโต้ผลเสียของอุปกรณ์เกมดิจิทัล" },
        keyVocab: { word: "counteracted (negative impacts)", th: "ตอบโต้/แก้ผลเสีย", note: "ME2 สร้างโดย iToys พลิกข้อเสีย (ทำร้ายสุขภาพ) มาเป็นจุดขาย จึงตอบ D iToys" }
    },
    33: {
        questionPhrase: { en: "extended its offering by collaborating with another manufacturer", th: "ขยายสินค้าด้วยการร่วมมือกับผู้ผลิตอีกราย" },
        passagePhrase: { en: "they teamed up with technology company Apple to launch Nike+", th: "ไนกี้จับมือกับบริษัทเทคโนโลยี Apple เปิดตัว Nike+" },
        keyVocab: { word: "teamed up with", th: "จับมือ/ร่วมมือกับ", note: "'teamed up with Apple' = 'collaborating with another manufacturer' จึงตอบ C Nike" }
    },
    34: {
        questionPhrase: { en: "incentive scheme showing corporate social responsibility", th: "โครงการให้รางวัลที่แสดงความรับผิดชอบต่อสังคม" },
        passagePhrase: { en: "Greener Living program demonstrates commitment to protecting the environment, green points redeemed for cash", th: "โครงการ Greener Living แสดงความมุ่งมั่นรักษาสิ่งแวดล้อม สะสมแต้มแลกเงินได้" },
        keyVocab: { word: "green points redeemed (commitment to environment)", th: "แต้มสีเขียวแลกได้ (ความมุ่งมั่นด้านสิ่งแวดล้อม)", note: "ระบบสะสมแต้ม = 'incentive scheme' และปกป้องสิ่งแวดล้อม = 'corporate social responsibility' จึงตอบ B Tesco" }
    },
    35: {
        questionPhrase: { en: "customers had positive attitude toward difficult circumstances", th: "ลูกค้ามีทัศนคติเชิงบวกต่อการรับมือช่วงเวลายาก" },
        passagePhrase: { en: "customers were eager to lift themselves and the country out of tough times", th: "ลูกค้ากระตือรือร้นที่จะพาตัวเองและประเทศพ้นช่วงเวลายากลำบาก" },
        keyVocab: { word: "eager to lift out of tough times", th: "กระตือรือร้นที่จะก้าวพ้นช่วงยากลำบาก", note: "'eager to lift out of tough times' = 'positive attitude towards dealing with difficult circumstances' พบจากวิจัยของโค้ช จึงตอบ A Coach" }
    },
    36: {
        questionPhrase: { en: "responded to a lifestyle trend in an unrelated sector", th: "ตอบสนองเทรนด์ไลฟ์สไตล์ในกลุ่มสินค้าที่ไม่เกี่ยวกัน" },
        passagePhrase: { en: "integrate the digital revolution into its reputation for athletic footwear", th: "ผสานการปฏิวัติดิจิทัลเข้ากับชื่อเสียงด้านรองเท้ากีฬา" },
        keyVocab: { word: "seemingly irrelevant trend", th: "เทรนด์ที่ดูไม่เกี่ยวข้อง", note: "เทรนด์ดิจิทัลไม่เกี่ยวกับรองเท้ากีฬา = 'unrelated product sector' จึงตอบ C Nike" }
    },
    37: {
        questionPhrase: { en: "avoided having to charge customers less", th: "เลี่ยงไม่ต้องลดราคาให้ลูกค้า" },
        passagePhrase: { en: "creating the sub-brand allowed Coach to avert an across-the-board price cut", th: "การสร้างซับแบรนด์ช่วยให้โค้ชเลี่ยงการลดราคาทั้งกระดาน" },
        keyVocab: { word: "avert an across-the-board price cut", th: "เลี่ยงการลดราคาทั้งหมด", note: "'avert an across-the-board price cut' = 'avoided having to charge customers less' จึงตอบ A Coach" }
    },
    38: {
        questionPhrase: { en: "identify the most appropriate innovation strategy", th: "เลือกกลยุทธ์นวัตกรรมที่เหมาะสมที่สุด" },
        passagePhrase: { en: "you can determine which of our three innovation strategies to pursue", th: "คุณจะตัดสินใจได้ว่าจะใช้กลยุทธ์นวัตกรรมข้อใดในสามข้อ" },
        keyVocab: { word: "determine which strategy to pursue", th: "ตัดสินใจว่าจะเลือกใช้กลยุทธ์ใด", note: "'determine which of three strategies' = 'identify the most appropriate innovation strategy' จึงตอบ B" }
    },
    39: {
        questionPhrase: { en: "trend highlights a negative aspect of your category", th: "เทรนด์ชี้ให้เห็นด้านลบของกลุ่มสินค้าคุณ" },
        passagePhrase: { en: "counteract those changes by reaffirming the core values of your category", th: "ตอบโต้การเปลี่ยนแปลงด้วยการยืนยันคุณค่าหลักของกลุ่มสินค้า" },
        keyVocab: { word: "reaffirming the core values", th: "ยืนยันคุณค่าหลักอีกครั้ง", note: "'counteract... by reaffirming core values' = ตัวเลือก 'counteract-and-affirm strategy' จึงตอบ C" }
    },
    40: {
        questionPhrase: { en: "new focus has increasing lack of connection with offering", th: "ความสนใจใหม่ของลูกค้าห่างจากสินค้าคุณมากขึ้น" },
        passagePhrase: { en: "increasing disparity between your category and consumers' new focus, innovations need to transcend", th: "ช่องว่างที่กว้างขึ้นระหว่างกลุ่มสินค้ากับความสนใจใหม่ ต้องก้าวข้ามกลุ่มเดิม" },
        keyVocab: { word: "disparity (transcend the category)", th: "ช่องว่าง/ความต่าง (ก้าวข้ามกลุ่มสินค้า)", note: "'increasing disparity' = 'increasing lack of connection' และต้อง 'transcend to integrate the two worlds' จึงตอบ D combine-and-transcend" }
    },
  },
  "Cambridge 13 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "proposed explanations for the decline", th: "ข้อสันนิษฐานต่าง ๆ ที่อธิบายการล่มสลาย" },
        passagePhrase: { en: "Some have claimed that major glacier-fed rivers changed their course", th: "บางคนอ้างว่าแม่น้ำสายใหญ่ที่หล่อเลี้ยงด้วยธารน้ำแข็งเปลี่ยนเส้นทาง" },
        keyVocab: { word: "Some have claimed / decline", th: "บางคนได้อ้างว่า / การเสื่อมถอย", note: "ย่อหน้า C ไล่เรียงหลายสาเหตุที่ 'มีคนอ้าง' ว่าทำให้อารยธรรมเสื่อม จึงตรงกับ proposed explanations คำตอบคือ C" }
    },
    28: {
        questionPhrase: { en: "a present-day application of research findings", th: "การนำผลการวิจัยมาใช้กับปัญหาในปัจจุบัน" },
        passagePhrase: { en: "learn from the past to be more proactive in issues such as management of water supply", th: "เรียนรู้จากอดีตเพื่อจัดการเรื่องน้ำในปัจจุบันเชิงรุกมากขึ้น" },
        keyVocab: { word: "present-day application", th: "การประยุกต์ใช้ในปัจจุบัน", note: "ย่อหน้า H พูดถึงการเอาบทเรียนจากอดีตมาใช้กับการบริหารน้ำและเมืองในอนาคต ตรงกับ present-day application คำตอบคือ H (exactPortion ที่ให้มาคลาดเคลื่อน เนื้อหาจริงอยู่ย่อหน้า H)" }
    },
    29: {
        questionPhrase: { en: "a difference from another culture of the same period", th: "ความแตกต่างจากอีกวัฒนธรรมในยุคเดียวกัน" },
        passagePhrase: { en: "at a time when the Egyptians were carving representations of themselves", th: "ในยุคที่ชาวอียิปต์กำลังสลักภาพตนเอง" },
        keyVocab: { word: "another culture", th: "อีกวัฒนธรรมหนึ่ง", contrastA: "Harappan . ฮารัปปาแทบไม่มีภาพของตนเอง", contrastB: "Egyptians . อียิปต์สลักภาพตนเองไปทั่ว", note: "ย่อหน้า A เทียบฮารัปปาที่ไม่ทำภาพตนเองกับอียิปต์ในยุคเดียวกันที่ทำมากมาย จึงเป็น difference between two cultures คำตอบคือ A" }
    },
    30: {
        questionPhrase: { en: "features of Harappan urban design", th: "ลักษณะการวางผังเมืองของฮารัปปา" },
        passagePhrase: { en: "Houses arranged in blocks, with wide main streets and narrow alleyways", th: "บ้านจัดเป็นบล็อก มีถนนสายหลักกว้างและตรอกแคบ" },
        keyVocab: { word: "urban design", th: "การออกแบบผังเมือง", note: "ย่อหน้า B บรรยายถนน ตรอก บ่อน้ำ และระบบระบายน้ำ ซึ่งเป็นรายละเอียดการวางผังเมือง คำตอบคือ B" }
    },
    31: {
        questionPhrase: { en: "discovery of errors made by previous archaeologists", th: "การพบข้อผิดพลาดของนักโบราณคดีรุ่นก่อน" },
        passagePhrase: { en: "found inaccuracies in the published geographic locations of ancient settlements", th: "พบความคลาดเคลื่อนของตำแหน่งที่ตั้งโบราณสถานที่เคยตีพิมพ์ไว้" },
        keyVocab: { word: "inaccuracies = errors", th: "ความคลาดเคลื่อน = ข้อผิดพลาด", note: "ย่อหน้า D บอกว่าทีมวิจัยพบว่าตำแหน่งโบราณสถานที่บันทึกไว้ผิดพลาด คือ errors of previous work คำตอบคือ D" }
    },
    32: {
        questionPhrase: { en: "collecting the ___ of snails", th: "เก็บ ___ ของหอยทาก" },
        passagePhrase: { en: "gathered shells of Melanoides tuberculate snails", th: "เก็บเปลือกของหอยทาก Melanoides tuberculate" },
        keyVocab: { word: "shells", th: "เปลือกหอย", note: "summary ใช้ collecting ส่วน passage ใช้ gathered สิ่งที่เก็บคือ shells คำตอบคือ shells" }
    },
    33: {
        questionPhrase: { en: "a change in water levels in a ___", th: "การเปลี่ยนแปลงระดับน้ำใน ___" },
        passagePhrase: { en: "from the sediments of an ancient lake", th: "จากตะกอนของทะเลสาบโบราณ" },
        keyVocab: { word: "lake", th: "ทะเลสาบ", note: "แหล่งน้ำที่นักวิจัยศึกษาระดับน้ำคือ ancient lake คำตอบคือ lake" }
    },
    34: {
        questionPhrase: { en: "when there was less ___ than evaporation", th: "เมื่อมี ___ น้อยกว่าการระเหย" },
        passagePhrase: { en: "the amount of evaporation exceeded the rainfall", th: "ปริมาณการระเหยมากกว่าปริมาณน้ำฝน" },
        keyVocab: { word: "rainfall", th: "ปริมาณน้ำฝน", contrastA: "evaporation exceeded rainfall . ระเหยมากกว่าฝน", contrastB: "less rainfall than evaporation . ฝนน้อยกว่าระเหย", note: "passage บอกว่า evaporation 'exceeded' rainfall เท่ากับว่า rainfall 'น้อยกว่า' evaporation จึงเติม rainfall คำตอบคือ rainfall" }
    },
    35: {
        questionPhrase: { en: "examining the ___ grown in the region", th: "ศึกษา ___ ที่ปลูกในพื้นที่" },
        passagePhrase: { en: "They are analysing grains cultivated at the time", th: "พวกเขากำลังวิเคราะห์ธัญพืชที่ปลูกในยุคนั้น" },
        keyVocab: { word: "grains", th: "ธัญพืช / เมล็ดพืช", note: "summary ใช้ grown/agricultural ส่วน passage ใช้ grains cultivated สิ่งที่ปลูกคือ grains คำตอบคือ grains" }
    },
    36: {
        questionPhrase: { en: "the types of ___ used", th: "ชนิดของ ___ ที่ใช้" },
        passagePhrase: { en: "the types of pottery used, and other aspects of their material culture", th: "ชนิดของเครื่องปั้นดินเผาที่ใช้ และวัฒนธรรมทางวัตถุอื่น ๆ" },
        keyVocab: { word: "pottery", th: "เครื่องปั้นดินเผา", note: "summary และ passage ใช้วลีเดียวกันคือ types of ... used วัตถุที่ใช้บ่งบอกเครือข่ายคือ pottery คำตอบคือ pottery" }
    },
    37: {
        questionPhrase: { en: "more environmental information is vital", th: "การหาข้อมูลสภาพแวดล้อมเพิ่มเป็นเรื่องจำเป็นยิ่ง" },
        passagePhrase: { en: "it is essential that we obtain more climate data", th: "จำเป็นอย่างยิ่งที่เราต้องได้ข้อมูลภูมิอากาศเพิ่ม" },
        keyVocab: { word: "essential = vital", th: "จำเป็นอย่างยิ่ง = สำคัญมาก", note: "คำพูดของ Singh ว่า essential ... obtain more climate data ตรงกับ vital ... environmental information คำตอบคือ B (Singh)" }
    },
    38: {
        questionPhrase: { en: "examining the past may have long-term benefits", th: "การศึกษาอดีตอาจให้ประโยชน์ระยะยาว" },
        passagePhrase: { en: "we can learn from the past to be more proactive in the future", th: "เราเรียนรู้จากอดีตเพื่อทำงานเชิงรุกในอนาคต" },
        keyVocab: { word: "learn from the past = examining previous patterns", th: "เรียนรู้จากอดีต = ศึกษาแบบแผนในอดีต", note: "Petrie พูดว่าศึกษาอดีตเพื่อประโยชน์ในอนาคต (long-term benefits) คำตอบคือ A (Petrie) (exactPortion ที่ให้มาคลาดเคลื่อน คำพูดจริงอยู่ย่อหน้า H ของ Petrie)" }
    },
    39: {
        questionPhrase: { en: "rough calculations indicate length of water shortage", th: "การคำนวณคร่าว ๆ บ่งบอกความยาวของช่วงขาดน้ำ" },
        passagePhrase: { en: "We estimate that the weakening of the monsoon lasted about 200 years", th: "เราประมาณว่ามรสุมที่อ่อนกำลังกินเวลาราว 200 ปี" },
        keyVocab: { word: "estimate = rough calculations", th: "ประมาณการ = การคำนวณคร่าว ๆ", note: "Hodell พูดว่า 'We estimate ... lasted about 200 years' ตรงกับ rough calculations ของช่วงแล้ง คำตอบคือ D (Hodell)" }
    },
    40: {
        questionPhrase: { en: "information about the decline has been lacking", th: "ข้อมูลเรื่องการล่มสลายมีอยู่น้อย" },
        passagePhrase: { en: "plenty of evidence about its rise, but relatively little about its fall", th: "หลักฐานการรุ่งเรืองมีมาก แต่เรื่องการล่มสลายมีน้อยมาก" },
        keyVocab: { word: "relatively little = lacking", th: "มีค่อนข้างน้อย = ขาดแคลน", contrastA: "rise . การรุ่งเรือง (หลักฐานเยอะ)", contrastB: "fall/decline . การล่มสลาย (หลักฐานน้อย)", note: "Petrie บอกว่ามีหลักฐานเรื่อง rise มากแต่เรื่อง fall น้อย ตรงกับ information about the decline lacking คำตอบคือ A (Petrie)" }
    },
  },
  "Cambridge 13 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "ignorant about ideas they should consider", th: "ไม่รู้เรื่องแนวคิดที่ควรจะศึกษา" },
        passagePhrase: { en: "oblivious to the vast philosophical literature", th: "ไม่รับรู้ถึงงานเขียนทางปรัชญาจำนวนมหาศาล" },
        keyVocab: { word: "oblivious", th: "ไม่รับรู้ / ไม่ตระหนัก", note: "oblivious = ignorant ผู้เขียนบอกว่านักจิตวิทยาเชิงบวกไม่รู้เรื่องวรรณกรรมปรัชญาที่ควรศึกษา จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "happiness may be more than pleasure and absence of pain", th: "ความสุขอาจเป็นมากกว่าแค่ความเพลิดเพลินและการไร้ความเจ็บปวด" },
        passagePhrase: { en: "Aristotle identified happiness with self-realisation", th: "อริสโตเติลมองว่าความสุขคือการบรรลุศักยภาพของตน" },
        keyVocab: { word: "self-realisation", th: "การบรรลุศักยภาพ/การเข้าใจตัวเอง", contrastA: "pleasure . ความเพลิดเพลิน", contrastB: "self-realisation . การบรรลุศักยภาพ", note: "อริสโตเติลเสนอความสุขแบบ self-realisation ซึ่งต่างจากนิยามของ Bentham ที่ว่าเป็นแค่ pleasure กับการไร้ความเจ็บปวด จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "connection between work and psychology", th: "การเชื่อมโยงระหว่างการทำงานกับจิตวิทยา" },
        passagePhrase: { en: "entangling of psychological research and capitalism", th: "การผูกโยงงานวิจัยจิตวิทยาเข้ากับระบบทุนนิยม" },
        keyVocab: { word: "entangling", th: "การผูกโยง/พัวพันเข้าด้วยกัน", note: "การที่ Bentham ผูกเงินเข้ากับประสบการณ์ภายในทำให้จิตวิทยาพัวพันกับทุนนิยมและการทำธุรกิจ จึงตอบ B (เชื่อมงานกับจิตวิทยา)" }
    },
    30: {
        questionPhrase: { en: "technology to improve … for government departments", th: "เทคโนโลยีเพื่อปรับปรุง … ให้แก่หน่วยงานรัฐ" },
        passagePhrase: { en: "departments of government be linked together through 'conversation tubes'", th: "ให้หน่วยงานรัฐเชื่อมต่อกันผ่าน 'ท่อสนทนา'" },
        keyVocab: { word: "communication", th: "การสื่อสาร", note: "'conversation tubes' ที่เชื่อมหน่วยงานเข้าด้วยกัน = การสื่อสาร จึงเติมคำตอบ F (communication)" }
    },
    31: {
        questionPhrase: { en: "printing banknotes to increase …", th: "การพิมพ์ธนบัตรเพื่อเพิ่ม …" },
        passagePhrase: { en: "a printing device that could produce unforgeable banknotes", th: "เครื่องพิมพ์ที่ผลิตธนบัตรปลอมแปลงไม่ได้" },
        keyVocab: { word: "unforgeable", th: "ปลอมแปลงไม่ได้", note: "ธนบัตรที่ปลอมแปลงไม่ได้ = ความปลอดภัย/ความมั่นคง จึงเติมคำตอบ B (security)" }
    },
    32: {
        questionPhrase: { en: "designed a device to keep food fresh", th: "ออกแบบอุปกรณ์ที่เก็บอาหารให้สดใหม่" },
        passagePhrase: { en: "a 'frigidarium' to keep provisions … fresh", th: "'frigidarium' เพื่อเก็บเสบียงให้สดใหม่" },
        keyVocab: { word: "keep … fresh", th: "เก็บรักษาให้สดใหม่", note: "การเก็บเนื้อ ปลา ผลไม้ ผักให้สด = การถนอม/ถนอมรักษา จึงเติมคำตอบ G (preservation)" }
    },
    33: {
        questionPhrase: { en: "prison design allowed the … of prisoners", th: "การออกแบบคุกทำให้สามารถ … นักโทษได้" },
        passagePhrase: { en: "visible at all times to the guards", th: "มองเห็นได้ตลอดเวลาโดยผู้คุม" },
        keyVocab: { word: "visible at all times", th: "มองเห็นได้ตลอดเวลา", note: "นักโทษถูกมองเห็นตลอดเวลา = การเฝ้าสังเกต จึงเติมคำตอบ E (observation)" }
    },
    34: {
        questionPhrase: { en: "pulse rate or money as a standard", th: "อัตราชีพจรหรือเงินเป็นมาตรฐานวัด" },
        passagePhrase: { en: "If happiness is to be regarded as a science, it has to be measured", th: "ถ้าจะถือว่าความสุขเป็นศาสตร์ ก็ต้องวัดได้" },
        keyVocab: { word: "measured / quantified", th: "วัด/หาปริมาณ", note: "Bentham เสนอวิธีวัดความสุข (ชีพจร/เงิน) = การวัดค่า จึงเติมคำตอบ A (measurement)" }
    },
    35: {
        questionPhrase: { en: "discussion of psychology and economics relationship", th: "การพูดถึงความสัมพันธ์ระหว่างจิตวิทยากับเศรษฐศาสตร์" },
        passagePhrase: { en: "science of happiness has become integral to capitalism", th: "ศาสตร์แห่งความสุขกลายเป็นส่วนสำคัญของทุนนิยม" },
        keyVocab: { word: "integral to capitalism", th: "เป็นส่วนสำคัญของทุนนิยม", note: "หนังสืออธิบายว่าจิตวิทยา (science of happiness) ผูกกับเศรษฐกิจ (capitalism) อย่างไร ตรงกับข้อความ จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "some emotions are harder to measure than others", th: "อารมณ์บางอย่างวัดยากกว่าอย่างอื่น" },
        passagePhrase: { en: "allows their happiness to be measured", th: "ทำให้ความสุขของพวกเขาถูกวัดได้" },
        keyVocab: { word: "more difficult to measure", th: "วัดได้ยากกว่า", note: "บทความพูดถึงการวัดความสุขแต่ไม่เคยเปรียบเทียบว่าอารมณ์ใดวัดยากกว่ากัน ไม่มีข้อมูล จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "supported by research on humans before 1915", th: "มีงานวิจัยกับมนุษย์รองรับก่อนปี 1915" },
        passagePhrase: { en: "had never even studied a single human being … experiments on white rats", th: "ไม่เคยศึกษามนุษย์เลยแม้แต่คนเดียว … ทดลองกับหนูขาว" },
        keyVocab: { word: "never … a single human being", th: "ไม่เคยศึกษามนุษย์เลยแม้แต่คนเดียว", contrastA: "research on humans . วิจัยกับมนุษย์", contrastB: "experiments on white rats . ทดลองกับหนูขาว", note: "Watson ไม่เคยศึกษามนุษย์เลย มีแต่ทดลองหนูขาว ขัดแย้งกับข้อความที่ว่ามีวิจัยมนุษย์รองรับ จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "most influential on governments outside America", th: "มีอิทธิพลมากที่สุดต่อรัฐบาลนอกอเมริกา" },
        passagePhrase: { en: "in Britain, a 'Behaviour Insights Team' has been established", th: "ในอังกฤษมีการตั้ง 'ทีมข้อมูลเชิงพฤติกรรม'" },
        keyVocab: { word: "most influential", th: "มีอิทธิพลมากที่สุด", note: "บทความบอกว่าอังกฤษนำไปใช้ แต่ไม่เคยเปรียบเทียบว่ามีอิทธิพล 'มากที่สุด' นอกอเมริกา ไม่มีข้อมูลเทียบ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "need for happiness is linked to industrialisation", th: "ความต้องการความสุขเชื่อมโยงกับการพัฒนาอุตสาหกรรม" },
        passagePhrase: { en: "Modern industrial societies appear to need … ever-increasing happiness", th: "สังคมอุตสาหกรรมสมัยใหม่ดูเหมือนต้องการความสุขที่เพิ่มขึ้นเรื่อยๆ" },
        keyVocab: { word: "industrial societies", th: "สังคมอุตสาหกรรม", note: "ผู้เขียนบอกว่าสังคมอุตสาหกรรม (industrialisation) ต้องการความสุขมากระตุ้นการทำงาน ตรงกับข้อความ จึงตอบ YES" }
    },
    40: {
        questionPhrase: { en: "government should aim to increase happiness", th: "รัฐบาลควรมีเป้าหมายเพิ่มความสุขให้ประชาชน" },
        passagePhrase: { en: "the idea that governments should be responsible for promoting happiness is always a threat to human freedom", th: "แนวคิดที่ว่ารัฐบาลควรส่งเสริมความสุขเป็นภัยต่อเสรีภาพเสมอ" },
        keyVocab: { word: "threat to human freedom", th: "ภัยต่อเสรีภาพของมนุษย์", note: "ผู้เขียนเห็นว่าการให้รัฐส่งเสริมความสุขเป็นภัยต่อเสรีภาพ จึงไม่เห็นด้วยกับข้อความ ตอบ NO" }
    },
  },
  "Cambridge 14 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "know what would encourage good staff to remain", th: "รู้ว่าอะไรจะทำให้พนักงานเก่งอยู่ต่อ" },
        passagePhrase: { en: "understand what practices are most favorable to increase employee retention", th: "เข้าใจว่าแนวปฏิบัติใดดีที่สุดในการเพิ่มการรักษาพนักงานไว้" },
        keyVocab: { word: "retention", th: "การรักษา (พนักงาน) ให้อยู่ต่อ", note: "คำว่า remain (อยู่ต่อ) ในโจทย์ตรงกับ retention ในประโยคของ Enz and Siguaw ทำให้คำตอบคือ E" }
    },
    28: {
        questionPhrase: { en: "make staff feel they shouldn't move to a different employer", th: "ทำให้พนักงานรู้สึกว่าไม่ควรย้ายไปอยู่ที่อื่น" },
        passagePhrase: { en: "employees feel more obligated to stay with the company", th: "พนักงานรู้สึกผูกพันที่จะอยู่กับบริษัทมากขึ้น" },
        keyVocab: { word: "feel more obligated to stay", th: "รู้สึกผูกพันที่จะอยู่ต่อ", note: "shouldn't move (ไม่ควรย้าย) คือการพูดอีกแบบของ obligated to stay ซึ่งเป็นคำของ Ng and Sorensen คำตอบจึงเป็น D" }
    },
    29: {
        questionPhrase: { en: "little is done to help workers improve their skills", th: "แทบไม่มีการช่วยให้พนักงานพัฒนาทักษะ" },
        passagePhrase: { en: "dominated by underdeveloped HR practices", th: "ถูกครอบงำด้วยแนวปฏิบัติ HR ที่ด้อยพัฒนา" },
        keyVocab: { word: "underdeveloped HR practices", th: "แนวปฏิบัติด้านบุคลากรที่ด้อยพัฒนา", note: "little is done to improve skills สื่อความเดียวกับ underdeveloped HR practices ซึ่งเป็นข้อสังเกตของ Lucas คำตอบคือ B" }
    },
    30: {
        questionPhrase: { en: "less likely to change jobs if cooperation is encouraged", th: "ย้ายงานน้อยลงหากส่งเสริมการร่วมมือกัน" },
        passagePhrase: { en: "motivate employees to work together ... feel more obligated to stay", th: "กระตุ้นให้พนักงานทำงานร่วมกัน ... รู้สึกผูกพันที่จะอยู่ต่อ" },
        keyVocab: { word: "work together", th: "ทำงานร่วมกัน", note: "cooperation (การร่วมมือ) ตรงกับ work together และ change jobs less ตรงกับ obligated to stay ของ Ng and Sorensen คำตอบคือ D" }
    },
    31: {
        questionPhrase: { en: "pay is not the only reason workers change jobs", th: "ค่าจ้างไม่ใช่เหตุผลเดียวที่พนักงานย้ายงาน" },
        passagePhrase: { en: "many cited reasons are low compensation, inadequate benefits, poor working conditions", th: "เหตุผลที่ถูกอ้างมีหลายอย่าง เช่น ค่าตอบแทนต่ำ สวัสดิการไม่พอ สภาพการทำงานแย่" },
        keyVocab: { word: "many cited reasons", th: "เหตุผลที่ถูกอ้างถึงหลายอย่าง", note: "not the only reason สื่อว่ามีหลายสาเหตุ ตรงกับ many reasons นอกเหนือจาก compensation ที่ Maroudas et al. ระบุไว้ คำตอบคือ C" }
    },
    32: {
        questionPhrase: { en: "high staff turnover ... is poor morale", th: "อัตราการลาออกสูงมีสาเหตุจากขวัญกำลังใจที่ตกต่ำ" },
        passagePhrase: { en: "compromised employee morale and attitudes", th: "ขวัญกำลังใจและทัศนคติของพนักงานที่เสื่อมลง" },
        keyVocab: { word: "compromised morale", th: "ขวัญกำลังใจที่เสื่อม/ลดลง", note: "poor morale ในโจทย์ตรงกับ compromised morale ที่ระบุเป็นเหตุของ turnover ข้อความจึงตรงกับผู้เขียน ตอบ YES" }
    },
    33: {
        questionPhrase: { en: "staff have a tendency to dislike their workplace", th: "พนักงานมีแนวโน้มจะไม่ชอบที่ทำงานของตน" },
        passagePhrase: { en: "many people will find something to complain about ... workplace", th: "หลายคนจะหาเรื่องบ่นเกี่ยวกับที่ทำงานของตน" },
        keyVocab: { word: "find something to complain about", th: "หาเรื่องบ่น/ตำหนิ", contrastA: "complain . บ่นเป็นครั้งคราว", contrastB: "dislike . ไม่ชอบเป็นนิสัย", note: "ผู้เขียนบอกว่าคนหาเรื่องบ่นได้ ไม่ได้บอกว่าพนักงาน dislike (เกลียด) ที่ทำงานจริง บ่นไม่เท่ากับไม่ชอบ จึงตอบ NO" }
    },
    34: {
        questionPhrase: { en: "better working conditions and job security makes staff satisfied", th: "สภาพการทำงานและความมั่นคงที่ดีขึ้นทำให้พนักงานพึงพอใจ" },
        passagePhrase: { en: "does not result in satisfaction, but only in the reduction of dissatisfaction", th: "ไม่ก่อให้เกิดความพึงพอใจ แต่เพียงลดความไม่พอใจเท่านั้น" },
        keyVocab: { word: "reduction of dissatisfaction", th: "การลดความไม่พอใจ", contrastA: "satisfaction . ความพึงพอใจ", contrastB: "reduction of dissatisfaction . แค่ลดความไม่พอใจ", note: "ผู้เขียนบอกว่าปัจจัยเหล่านี้แค่ลด dissatisfaction ไม่ได้สร้าง satisfaction จึงขัดกับโจทย์ที่ว่าทำให้ satisfied ตอบ NO" }
    },
    35: {
        questionPhrase: { en: "staff should choose when they take breaks", th: "พนักงานควรได้เลือกเวลาพักเอง" },
        passagePhrase: { en: "allowing adequate breaks during the working day", th: "ให้มีช่วงพักที่เพียงพอระหว่างวันทำงาน" },
        keyVocab: { word: "adequate breaks", th: "ช่วงพักที่เพียงพอ", note: "ผู้เขียนพูดถึง 'มีเวลาพักเพียงพอ' แต่ไม่ได้บอกว่าพนักงานควรเลือกเวลาพักเอง จึงไม่มีข้อมูลเรื่องการเลือก ตอบ NOT GIVEN" }
    },
    36: {
        questionPhrase: { en: "research on staff in an American chain of ___", th: "วิจัยพนักงานในเครือ ___ ของอเมริกา" },
        passagePhrase: { en: "a chain of themed restaurants in the United States", th: "เครือร้านอาหารธีมต่าง ๆ ในสหรัฐอเมริกา" },
        keyVocab: { word: "restaurants", th: "ร้านอาหาร", note: "ช่องว่างหลัง 'chain of' ต้องเป็นสถานที่ที่ศึกษา ในบทคือ themed restaurants คำตอบคือ restaurants" }
    },
    37: {
        questionPhrase: { en: "fun activities improved their ___", th: "กิจกรรมสนุก ๆ ช่วยพัฒนา ___ ของพวกเขา" },
        passagePhrase: { en: "fun activities had a favorable impact on performance", th: "กิจกรรมสนุกส่งผลดีต่อผลการปฏิบัติงาน" },
        keyVocab: { word: "performance", th: "ผลการปฏิบัติงาน", note: "improved (ทำให้ดีขึ้น) ตรงกับ favorable impact on performance ในบท คำตอบคือ performance" }
    },
    38: {
        questionPhrase: { en: "management involvement led to lower staff ___", th: "การมีส่วนร่วมของฝ่ายบริหารทำให้ ___ ของพนักงานลดลง" },
        passagePhrase: { en: "manager support for fun had a favorable impact in reducing turnover", th: "การสนับสนุนของผู้จัดการช่วยลดอัตราการลาออก" },
        keyVocab: { word: "turnover", th: "อัตราการลาออก/เปลี่ยนงาน", note: "lower staff ___ ตรงกับ reducing turnover และ management involvement ตรงกับ manager support คำตอบคือ turnover" }
    },
    39: {
        questionPhrase: { en: "activities needed to fit with the company's ___", th: "กิจกรรมต้องสอดคล้องกับ ___ ของบริษัท" },
        passagePhrase: { en: "aligned with both organizational goals", th: "สอดคล้องกับเป้าหมายขององค์กร" },
        keyVocab: { word: "goals", th: "เป้าหมาย", note: "fit with (สอดคล้อง) ตรงกับ aligned with และ company's ตรงกับ organizational คำตอบคือ goals" }
    },
    40: {
        questionPhrase: { en: "fit with ... the ___ of the staff", th: "สอดคล้องกับ ___ ของพนักงาน" },
        passagePhrase: { en: "aligned with ... employee characteristics", th: "สอดคล้องกับคุณลักษณะของพนักงาน" },
        keyVocab: { word: "characteristics", th: "คุณลักษณะ/ลักษณะเฉพาะ", note: "the ___ of the staff ตรงกับ employee characteristics ในบท คำตอบคือ characteristics" }
    },
  },
  "Cambridge 14 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "What people are increasingly expected to do", th: "สิ่งที่ผู้คนถูกคาดหวังให้ทำมากขึ้นเรื่อยๆ" },
        passagePhrase: { en: "We are told that we ought to organise our company, our home life", th: "เราถูกบอกว่าควรจัดระเบียบบริษัทและชีวิตในบ้านของเรา" },
        keyVocab: { word: "ought to organise", th: "ควรจะจัดระเบียบ", note: "วลี 'are told that we ought to' = สิ่งที่คนถูกคาดหวังให้ทำ ตรงกับหัวข้อ vi จึงตอบ vi" }
    },
    28: {
        questionPhrase: { en: "Complaints about the impact of a certain approach", th: "เสียงบ่นต่อผลกระทบของแนวทางหนึ่ง" },
        passagePhrase: { en: "workers claim to be dissatisfied with the way their work is structured", th: "พนักงานบอกว่าไม่พอใจกับวิธีจัดโครงสร้างงานของตน" },
        keyVocab: { word: "dissatisfied", th: "ไม่พอใจ", note: "'dissatisfied / claim' = การร้องเรียน (complaints) ต่อผลของการจัดระเบียบ จึงตอบ i" }
    },
    29: {
        questionPhrase: { en: "Early recommendations concerning business activities", th: "ข้อแนะนำยุคแรกเกี่ยวกับการดำเนินธุรกิจ" },
        passagePhrase: { en: "he designed a number of principles to improve the efficiency of the work process", th: "เขาออกแบบหลักการหลายข้อเพื่อเพิ่มประสิทธิภาพของกระบวนการทำงาน" },
        keyVocab: { word: "principles", th: "หลักการ / ข้อแนะนำ", note: "Taylor เขียนในต้นศตวรรษที่ 20 (early) และ 'principles' = recommendations จึงตอบ iii" }
    },
    30: {
        questionPhrase: { en: "Fundamental beliefs that are in fact incorrect", th: "ความเชื่อพื้นฐานที่จริงๆ แล้วผิด" },
        passagePhrase: { en: "the assumption that order is a necessary condition for productivity", th: "ข้อสมมติว่าความเป็นระเบียบเป็นเงื่อนไขจำเป็นต่อผลิตภาพ" },
        keyVocab: { word: "assumption", th: "ข้อสมมติ / ความเชื่อพื้นฐาน", note: "'assumption' = fundamental belief และ 'misguided' = incorrect จึงตอบ ii" }
    },
    31: {
        questionPhrase: { en: "Approach can have more disadvantages than advantages", th: "แนวทางที่อาจมีข้อเสียมากกว่าข้อดี" },
        passagePhrase: { en: "order actually has diminishing returns", th: "ความเป็นระเบียบให้ผลตอบแทนที่ลดน้อยถอยลง" },
        keyVocab: { word: "diminishing returns", th: "ผลตอบแทนที่ลดลง", note: "'diminishing returns / further increase reduces productivity' = ข้อเสียเริ่มมากกว่าข้อดี จึงตอบ ix" }
    },
    32: {
        questionPhrase: { en: "How to achieve outcomes that are currently impossible", th: "วิธีบรรลุผลลัพธ์ที่ปัจจุบันเป็นไปไม่ได้" },
        passagePhrase: { en: "new solutions that under conventionally structured environments would never be reached", th: "ทางออกใหม่ที่สภาพแวดล้อมแบบมีโครงสร้างปกติไม่มีวันไปถึง" },
        keyVocab: { word: "would never be reached", th: "ไม่มีวันบรรลุถึง", note: "'never be reached' ในระบบเดิม = currently impossible แต่ทำได้ด้วยแนวทางใหม่ จึงตอบ vii" }
    },
    33: {
        questionPhrase: { en: "Organisations that put a new approach into practice", th: "องค์กรที่นำแนวทางใหม่ไปใช้จริง" },
        passagePhrase: { en: "Oticon used what it called a 'spaghetti' structure to reduce rigid hierarchies", th: "Oticon ใช้โครงสร้างแบบ 'สปาเก็ตตี' เพื่อลดลำดับชั้นที่แข็งทื่อ" },
        keyVocab: { word: "Oticon / spaghetti structure", th: "บริษัท Oticon / โครงสร้างสปาเก็ตตี", note: "ตัวอย่างบริษัทจริง (Oticon, GE, Google) ที่ใช้แนวทางไร้ระเบียบ = organisations in practice จึงตอบ iv" }
    },
    34: {
        questionPhrase: { en: "Neither approach guarantees continuous improvement", th: "ทั้งสองแนวทางไม่รับประกันการพัฒนาต่อเนื่อง" },
        passagePhrase: { en: "disorder, much like order, also seems to have diminishing utility", th: "ความไร้ระเบียบก็เหมือนความเป็นระเบียบ คือมีประโยชน์ที่ลดน้อยลง" },
        keyVocab: { word: "much like order", th: "เหมือนกับความเป็นระเบียบ", note: "ทั้ง order และ disorder ต่างมี diminishing utility = ไม่มีฝ่ายใดประกันการพัฒนาตลอด จึงตอบ viii" }
    },
    35: {
        questionPhrase: { en: "people who feel they are not ... enough", th: "คนที่รู้สึกว่าตนเองยังไม่... มากพอ" },
        passagePhrase: { en: "all as a means to becoming more productive", th: "ทั้งหมดเป็นวิธีเพื่อให้มีผลิตภาพมากขึ้น" },
        keyVocab: { word: "productive", th: "มีผลิตภาพ / ทำงานได้ผลดี", note: "training sessions มุ่งช่วยคนให้ 'more productive' ช่องว่างเติม productive" }
    },
    36: {
        questionPhrase: { en: "people who regard themselves as ...", th: "คนที่มองตัวเองว่าเป็น..." },
        passagePhrase: { en: "much to the delight of self-proclaimed perfectionists", th: "ทำให้พวกที่ประกาศตนเป็นนักนิยมความสมบูรณ์แบบยินดี" },
        keyVocab: { word: "perfectionists", th: "นักนิยมความสมบูรณ์แบบ", note: "'self-proclaimed' = regard themselves as ช่องว่างเติม perfectionists" }
    },
    37: {
        questionPhrase: { en: "Many people feel ... with aspects of their work", th: "หลายคนรู้สึก...กับบางด้านของงานตน" },
        passagePhrase: { en: "workers claim to be dissatisfied with the way their work is structured", th: "พนักงานบอกว่าไม่พอใจกับวิธีจัดโครงสร้างงาน" },
        keyVocab: { word: "dissatisfied", th: "ไม่พอใจ", note: "ข้อความตรงตัว 'dissatisfied with' ช่องว่างเติม dissatisfied" }
    },
    38: {
        questionPhrase: { en: "aim at order without really considering its value", th: "มุ่งความเป็นระเบียบโดยไม่ได้พิจารณาคุณค่าของมันจริงๆ" },
        passagePhrase: { en: "organising for the sake of organising, rather than looking at the usefulness", th: "จัดระเบียบเพื่อจัดระเบียบ มากกว่าจะดูประโยชน์ของมัน" },
        keyVocab: { word: "for the sake of organising", th: "เพื่อจัดระเบียบเอง (ไม่ได้มองประโยชน์)", note: "'for the sake of... rather than looking at usefulness' = ไม่พิจารณาคุณค่า ตรงกับข้อความ จึงตอบ TRUE" }
    },
    39: {
        questionPhrase: { en: "innovation best if people have distinct roles", th: "นวัตกรรมดีที่สุดถ้าคนมีบทบาทแยกชัดเจน" },
        passagePhrase: { en: "best approach is an environment devoid of structure and hierarchy", th: "แนวทางที่ดีที่สุดคือสภาพแวดล้อมที่ปราศจากโครงสร้างและลำดับชั้น" },
        keyVocab: { word: "devoid of structure and hierarchy", th: "ปราศจากโครงสร้างและลำดับชั้น", contrastA: "distinct roles . บทบาทแยกชัดเจน", contrastB: "devoid of hierarchy . ไร้ลำดับชั้น", note: "'distinct roles' ขัดกับ 'devoid of structure/hierarchy' โดยตรง จึงตอบ FALSE" }
    },
    40: {
        questionPhrase: { en: "Google inspired by the success of General Electric", th: "Google ได้แรงบันดาลใจจากความสำเร็จของ General Electric" },
        passagePhrase: { en: "Google and other tech companies have embraced these flexible structures", th: "Google และบริษัทเทคอื่นๆ ได้นำโครงสร้างยืดหยุ่นเหล่านี้มาใช้" },
        keyVocab: { word: "embraced (no cause stated)", th: "นำมาใช้ (ไม่ได้ระบุสาเหตุ)", note: "บทความบอกว่า Google ใช้โครงสร้างยืดหยุ่น แต่ไม่เคยบอกว่าได้แรงบันดาลใจจาก GE จึงตอบ NOT GIVEN" }
    },
  },
  "Cambridge 14 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "divided into a number of separate categories", th: "ถูกแบ่งออกเป็นหมวดหมู่ที่แยกจากกันหลายประเภท" },
        passagePhrase: { en: "discrete descriptions of various types of play", th: "คำอธิบายที่แยกชัดเจนของการเล่นประเภทต่าง ๆ" },
        keyVocab: { word: "discrete / various types", th: "แยกออกจากกัน / ประเภทต่าง ๆ", note: "คำว่า 'discrete...various types of play' คือ paraphrase ของ 'separate categories' ซึ่งอ้างถึง Miller & Almon จึงตอบ B" }
    },
    28: {
        questionPhrase: { en: "intended goals affect how they play with children", th: "เป้าหมายที่ตั้งใจไว้ส่งผลต่อวิธีที่ผู้ใหญ่เล่นกับเด็ก" },
        passagePhrase: { en: "adult's role in play varies as a function of their educational goals", th: "บทบาทของผู้ใหญ่ในการเล่นเปลี่ยนไปตามเป้าหมายทางการศึกษาของเขา" },
        keyVocab: { word: "varies as a function of goals", th: "เปลี่ยนแปลงตามเป้าหมาย", note: "'varies as a function of educational goals' = 'goals affect how they play' อ้างถึง Hirsch-Pasek et al. จึงตอบ G" }
    },
    29: {
        questionPhrase: { en: "combining work with play may be best for learning", th: "การผสมงานเข้ากับการเล่นอาจเป็นวิธีเรียนรู้ที่ดีที่สุด" },
        passagePhrase: { en: "hybrid forms of work and play provide optimal contexts for learning", th: "รูปแบบผสมของงานกับการเล่นให้บริบทที่ดีที่สุดสำหรับการเรียนรู้" },
        keyVocab: { word: "hybrid forms / optimal contexts", th: "รูปแบบผสม / บริบทที่ดีที่สุด", note: "'hybrid forms of work and play' = 'combining work with play' และ 'optimal' = 'best' อ้างถึง Joan Goodman จึงตอบ F" }
    },
    30: {
        questionPhrase: { en: "certain elements of play are more significant", th: "องค์ประกอบบางอย่างของการเล่นสำคัญกว่าอย่างอื่น" },
        passagePhrase: { en: "did not assign greater weight to any one dimension", th: "ไม่ได้ให้น้ำหนักมากกว่ากับมิติใดมิติหนึ่ง" },
        keyVocab: { word: "greater weight to a dimension", th: "ให้น้ำหนักมากกว่ากับมิติหนึ่ง", contrastA: "Rubin . ไม่ให้น้ำหนักต่างกัน", contrastB: "others/Pellegrini . บางองค์ประกอบสำคัญกว่า", note: "ข้อความบอกว่า Rubin 'ไม่' ให้น้ำหนักต่างกัน แต่ 'other researchers' เห็นว่าบางมิติสำคัญที่สุด คือ Pellegrini จึงตอบ E ไม่ใช่ C" }
    },
    31: {
        questionPhrase: { en: "classified on a scale of playfulness", th: "จัดประเภทตามระดับความเป็นการเล่น" },
        passagePhrase: { en: "playful behaviors can range in degree from 0% to 100%", th: "พฤติกรรมการเล่นมีระดับได้ตั้งแต่ 0% ถึง 100%" },
        keyVocab: { word: "range in degree / scale", th: "มีระดับต่างกัน / มาตราส่วน", note: "'range in degree from 0% to 100%' = 'a scale of playfulness' มุมมองของ Rubin and colleagues จึงตอบ C" }
    },
    32: {
        questionPhrase: { en: "children need toys in order to play", th: "เด็กต้องมีของเล่นจึงจะเล่นได้" },
        passagePhrase: { en: "children will play in any circumstances, even with no real toys", th: "เด็กจะเล่นในทุกสถานการณ์ แม้ไม่มีของเล่นจริง" },
        keyVocab: { word: "no real toys", th: "ไม่มีของเล่นจริง", note: "ข้อความบอกเด็กเล่นได้แม้ 'no real toys' ขัดกับคำกล่าวที่ว่าต้องมีของเล่น จึงตอบ NO" }
    },
    33: {
        questionPhrase: { en: "mistake to treat play and learning as separate", th: "เป็นความผิดพลาดที่แยกการเล่นกับการเรียนรู้ออกจากกัน" },
        passagePhrase: { en: "society has created a false dichotomy between play and learning", th: "สังคมสร้างการแบ่งแยกที่ผิดระหว่างการเล่นกับการเรียนรู้" },
        keyVocab: { word: "false dichotomy", th: "การแบ่งแยกที่ผิด", note: "'false dichotomy' = การแยกสองสิ่งนี้เป็นความผิดพลาด ตรงกับคำกล่าว จึงตอบ YES" }
    },
    34: {
        questionPhrase: { en: "play helps children develop artistic talents", th: "การเล่นช่วยให้เด็กพัฒนาพรสวรรค์ทางศิลปะ" },
        passagePhrase: { en: "learn science, mathematics, social relationships, creative problem-solving", th: "เรียนวิทยาศาสตร์ คณิตศาสตร์ ความสัมพันธ์ทางสังคม การแก้ปัญหาเชิงสร้างสรรค์" },
        keyVocab: { word: "artistic talents", th: "พรสวรรค์ทางศิลปะ", note: "ข้อความระบุประโยชน์หลายด้านแต่ไม่เคยพูดถึง 'artistic talents' (พรสวรรค์ทางศิลปะ) จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "researchers have agreed on a definition of play", th: "นักวิจัยเห็นพ้องกันเรื่องนิยามของการเล่น" },
        passagePhrase: { en: "full consensus on a formal definition continues to elude researchers", th: "ฉันทามติเต็มรูปแบบเรื่องนิยามยังคงเลี่ยงหนีนักวิจัย" },
        keyVocab: { word: "consensus...continues to elude", th: "ฉันทามติยังหาไม่ได้ / ยังตกลงกันไม่ได้", note: "'consensus continues to elude' = ยังตกลงกันไม่ได้ ขัดกับคำกล่าวว่า 'agreed' จึงตอบ NO" }
    },
    36: {
        questionPhrase: { en: "work and play differ in whether they have a target", th: "งานกับการเล่นต่างกันตรงที่มีเป้าหมายหรือไม่" },
        passagePhrase: { en: "unlike play, work is extrinsically motivated (i.e. goal oriented)", th: "ต่างจากการเล่น งานถูกขับด้วยแรงจูงใจภายนอก คือมุ่งเป้าหมาย" },
        keyVocab: { word: "goal oriented", th: "มุ่งเป้าหมาย", contrastA: "work . มีเป้าหมาย (goal oriented)", contrastB: "play . ไม่มีเป้าหมายภายนอก", note: "'goal oriented' = 'have a target' และ 'unlike play' ชี้ว่าทั้งสองต่างกันที่จุดนี้ จึงตอบ YES" }
    },
    37: {
        questionPhrase: { en: "by ___ the child to investigate different aspects", th: "โดยการ ___ ให้เด็กสำรวจแง่มุมต่าง ๆ" },
        passagePhrase: { en: "encouraging further exploration or new facets to the child's activity", th: "การกระตุ้นให้สำรวจเพิ่มเติมหรือแง่มุมใหม่ของกิจกรรมเด็ก" },
        keyVocab: { word: "encouraging", th: "การกระตุ้น/สนับสนุน", note: "'investigate different aspects' = 'further exploration or new facets' คำที่เติมช่องคือ 'encouraging' จึงตอบ encouraging" }
    },
    38: {
        questionPhrase: { en: "it should still be based on the child's ___", th: "ควรยังคงตั้งอยู่บน ___ ของเด็กที่จะเล่น" },
        passagePhrase: { en: "play should stem from the child's own desire", th: "การเล่นควรเกิดจากความปรารถนาของเด็กเอง" },
        keyVocab: { word: "desire", th: "ความปรารถนา/ความต้องการ", note: "'based on the child's ___ to play' = 'stem from the child's own desire' คำเดียวจากข้อความคือ 'desire' จึงตอบ desire" }
    },
    39: {
        questionPhrase: { en: "play without adults gives children real ___", th: "การเล่นโดยไม่มีผู้ใหญ่ให้ ___ จริงแก่เด็ก" },
        passagePhrase: { en: "free play provides the child with true autonomy", th: "การเล่นอิสระให้ความเป็นอิสระที่แท้จริงแก่เด็ก" },
        keyVocab: { word: "autonomy", th: "ความเป็นอิสระ/การปกครองตนเอง", note: "'without the intervention of adults' = 'free play' และ 'real' = 'true' คำที่เติมคือ 'autonomy' จึงตอบ autonomy" }
    },
    40: {
        questionPhrase: { en: "with adults, play can be ___ at particular goals", th: "เมื่อมีผู้ใหญ่ การเล่นสามารถ ___ ไปที่เป้าหมายเฉพาะได้" },
        passagePhrase: { en: "guided play...provide more targeted learning experiences", th: "การเล่นแบบชี้นำให้ประสบการณ์เรียนรู้ที่มุ่งเป้ามากขึ้น" },
        keyVocab: { word: "targeted", th: "มุ่งเป้า/เจาะจง", note: "'at particular goals' = 'targeted learning experiences' คำเดียวจากข้อความคือ 'targeted' จึงตอบ targeted" }
    },
  },
  "Cambridge 14 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "were the first people to research marine debris", th: "เป็นคนกลุ่มแรกที่ศึกษาปัญหาขยะในทะเล" },
        passagePhrase: { en: "Plenty of studies have sounded alarm bells about marine debris", th: "มีงานวิจัยจำนวนมากที่ส่งสัญญาณเตือนเรื่องขยะทะเลมาแล้ว" },
        keyVocab: { word: "plenty of studies (already existed)", th: "มีงานวิจัยอยู่ก่อนแล้วมากมาย", note: "เพราะมีงานวิจัยมากมายอยู่ก่อนแล้ว Rochman จึงไม่ใช่คนแรก ตอบ FALSE" }
    },
    28: {
        questionPhrase: { en: "creatures most in danger are certain seabirds", th: "สัตว์ที่เสี่ยงที่สุดคือนกทะเลบางชนิด" },
        passagePhrase: { en: "certain seabirds eat plastic bags... whole bird populations at risk", th: "นกทะเลบางชนิดกินถุงพลาสติก... ประชากรนกอาจสูญพันธุ์" },
        keyVocab: { word: "most in danger (ranking claim)", th: "เสี่ยงที่สุด (การจัดอันดับ)", note: "ข้อความยกนกเป็นเพียงตัวอย่าง ไม่ได้บอกว่าเสี่ยง 'ที่สุด' จึงตอบ NOT GIVEN" }
    },
    29: {
        questionPhrase: { en: "already proved bird populations will become extinct", th: "พิสูจน์แล้วว่าประชากรนกบางชนิดจะสูญพันธุ์" },
        passagePhrase: { en: "nobody had yet tested those perceived threats", th: "ยังไม่มีใครทดสอบภัยคุกคามที่คาดการณ์เหล่านั้น" },
        keyVocab: { word: "perceived threats (not yet tested)", th: "ภัยที่แค่คาดการณ์ ยังไม่ได้พิสูจน์", contrastA: "proved . พิสูจน์แล้ว", contrastB: "perceived / not yet tested . แค่คาดการณ์ ยังไม่ทดสอบ", note: "'proved' ในคำถามขัดกับ 'nobody had yet tested' จึงตอบ FALSE" }
    },
    30: {
        questionPhrase: { en: "analysed papers on different kinds of danger", th: "วิเคราะห์งานวิจัยเรื่องอันตรายชนิดต่าง ๆ" },
        passagePhrase: { en: "examined more than a hundred papers on the impacts of marine debris", th: "ตรวจสอบงานวิจัยกว่าร้อยชิ้นเรื่องผลกระทบของขยะทะเล" },
        keyVocab: { word: "examined papers = analysed papers", th: "ตรวจสอบงานวิจัย = วิเคราะห์งานวิจัย", note: "'impacts/threats' คือ 'kinds of danger' การ examine คือการ analyse จึงตอบ TRUE" }
    },
    31: {
        questionPhrase: { en: "most of the research was badly designed", th: "งานวิจัยส่วนใหญ่ออกแบบมาไม่ดี" },
        passagePhrase: { en: "In 83 percent of cases... proven true; remaining cases had weaknesses in design", th: "83% พิสูจน์ว่าจริง ส่วนที่เหลือมีจุดอ่อนด้านการออกแบบ" },
        keyVocab: { word: "83 percent proven true", th: "83% พิสูจน์ว่าจริง (เป็นส่วนใหญ่)", contrastA: "most . ส่วนใหญ่", contrastB: "remaining 17% . ส่วนที่เหลือเพียงเล็กน้อย", note: "ออกแบบไม่ดีมีแค่ส่วนน้อย (ไม่ถึง 17%) ไม่ใช่ส่วนใหญ่ จึงตอบ FALSE" }
    },
    32: {
        questionPhrase: { en: "expecting to find mussels were harmed by plastic", th: "คาดว่าจะพบว่าหอยแมลงภู่ถูกพลาสติกทำร้าย" },
        passagePhrase: { en: "study failed to find the effect it was looking for... didn't seem to stress out the shellfish", th: "งานวิจัยไม่พบผลที่กำลังมองหา... ดูเหมือนไม่ทำให้หอยเครียด" },
        keyVocab: { word: "the effect it was looking for", th: "ผลกระทบที่นักวิจัยกำลังมองหา (คือความเสียหาย)", note: "นักวิจัย 'มองหา' ผลกระทบแต่ไม่พบ แปลว่าคาดว่าจะพบอันตราย จึงตอบ TRUE" }
    },
    33: {
        questionPhrase: { en: "mussels choose plastic over their natural diet", th: "หอยแมลงภู่เลือกกินพลาสติกแทนอาหารตามธรรมชาติ" },
        passagePhrase: { en: "mussels may be fine eating trash", th: "หอยแมลงภู่อาจไม่เป็นไรกับการกินขยะ" },
        keyVocab: { word: "choose ... in preference to (preference)", th: "เลือก...มากกว่า (ความชอบ)", note: "ข้อความบอกแค่ว่า 'กินแล้วไม่เป็นไร' ไม่ได้บอกว่า 'เลือก' พลาสติกแทนอาหารปกติ จึงตอบ NOT GIVEN" }
    },
    34: {
        questionPhrase: { en: "bits of debris that were ___ (harmful to animals)", th: "ชิ้นขยะที่มีขนาด ___ (เป็นอันตรายต่อสัตว์)" },
        passagePhrase: { en: "Most of the dangers also involved large pieces of debris", th: "อันตรายส่วนใหญ่เกี่ยวข้องกับเศษขยะชิ้นใหญ่" },
        keyVocab: { word: "large = คำตอบ", th: "large = ขนาดใหญ่", contrastA: "large pieces . ชิ้นใหญ่", contrastB: "microplastic / tiny bits . ชิ้นเล็กจิ๋ว", note: "อันตรายส่วนใหญ่มาจากเศษ 'large' ตรงกับช่องว่าง คำตอบคือ large" }
    },
    35: {
        questionPhrase: { en: "little research into ___ from synthetic fibres", th: "งานวิจัยน้อยเรื่อง ___ จากเส้นใยสังเคราะห์" },
        passagePhrase: { en: "little research on these tiny bits... open questions still for microplastic", th: "งานวิจัยน้อยเรื่องชิ้นจิ๋ว... ยังมีคำถามค้างเรื่องไมโครพลาสติก" },
        keyVocab: { word: "microplastic = คำตอบ", th: "microplastic = พลาสติกขนาดเล็กจิ๋ว", note: "เส้นใยสังเคราะห์เป็นแหล่งหนึ่งของ 'microplastic' ซึ่งมีงานวิจัยน้อย คำตอบคือ microplastic" }
    },
    36: {
        questionPhrase: { en: "focused on individual animals, not entire ___", th: "เน้นสัตว์รายตัว ไม่ใช่ ___ ทั้งหมด" },
        passagePhrase: { en: "how plastic affects an individual animal... rather than whole populations", th: "พลาสติกกระทบสัตว์รายตัว... มากกว่ากระทบประชากรทั้งหมด" },
        keyVocab: { word: "populations = คำตอบ", th: "populations = ประชากร (สัตว์ทั้งกลุ่ม)", contrastA: "individual animal . สัตว์รายตัว", contrastB: "whole populations . ประชากรทั้งหมด", note: "'entire' = 'whole' คำที่ตรงข้ามกับ individual คือ populations จึงเป็นคำตอบ" }
    },
    37: {
        questionPhrase: { en: "the ___ of plastic used in the lab", th: "___ ของพลาสติกที่ใช้ในห้องทดลอง" },
        passagePhrase: { en: "scientists often use higher concentrations of plastic than in the ocean", th: "นักวิทยาศาสตร์มักใช้ความเข้มข้นของพลาสติกสูงกว่าในทะเลจริง" },
        keyVocab: { word: "concentrations = คำตอบ", th: "concentrations = ความเข้มข้น/ปริมาณความหนาแน่น", note: "ห้องแล็บใช้ 'concentrations' ที่ไม่ตรงกับในทะเล ตรงช่องว่างพอดี คำตอบคือ concentrations" }
    },
    38: {
        questionPhrase: { en: "impact of a reduction in numbers on the ___", th: "ผลของจำนวนที่ลดลงต่อ ___ ของสายพันธุ์นั้น" },
        passagePhrase: { en: "how deaths in one species could affect that animal's predators", th: "การตายของสายพันธุ์หนึ่งอาจกระทบผู้ล่าของสัตว์นั้น" },
        keyVocab: { word: "predators = คำตอบ", th: "predators = ผู้ล่า/นักล่า", note: "จำนวนที่ลดลง (deaths) กระทบต่อ 'predators' ของสายพันธุ์นั้น คำตอบคือ predators" }
    },
    39: {
        questionPhrase: { en: "future ___ (e.g. involving oil)", th: "___ ในอนาคต (เช่น เกี่ยวกับน้ำมัน)" },
        passagePhrase: { en: "disasters such as a tanker spilling its cargo of oil", th: "ภัยพิบัติ เช่น เรือบรรทุกทำน้ำมันรั่วไหล" },
        keyVocab: { word: "disasters = คำตอบ", th: "disasters = ภัยพิบัติ", note: "ตัวอย่าง 'น้ำมันรั่ว' คือ 'disasters' ตรงกับช่องว่าง คำตอบคือ disasters" }
    },
    40: {
        questionPhrase: { en: "best title: Assessing the threat of marine debris", th: "ชื่อเรื่องที่ดีที่สุด: การประเมินภัยจากขยะทะเล" },
        passagePhrase: { en: "clearing up misperceptions... which problems really need addressing", th: "ขจัดความเข้าใจผิด... ปัญหาใดที่ต้องแก้ไขจริง ๆ" },
        keyVocab: { word: "assessing the threat", th: "การประเมินภัยคุกคาม (ว่าจริงหรือเกินจริง)", note: "ทั้งบทพูดถึงการตรวจสอบว่าภัยจากขยะทะเลจริงแค่ไหน = assessing the threat จึงตอบ A" }
    },
  },
  "Cambridge 15 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "its value to scientific research", th: "คุณค่าของเสียงหัวเราะต่องานวิจัยทางวิทยาศาสตร์" },
        passagePhrase: { en: "provide psychological scientists with rich resources for studying human psychology", th: "ให้แหล่งข้อมูลอันมีค่าแก่นักวิทยาศาสตร์ในการศึกษาจิตวิทยามนุษย์" },
        keyVocab: { word: "rich resources for studying", th: "แหล่งข้อมูลอันมีค่าสำหรับการศึกษาวิจัย", note: "วลี 'rich resources for studying' คือการพาราเฟรสของ 'value to scientific research' ผู้เขียนเน้นว่าเสียงหัวเราะมีประโยชน์ต่องานวิจัย จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "importance of enjoying humour in a group setting", th: "ความสำคัญของการเสพอารมณ์ขันร่วมกันเป็นกลุ่ม" },
        passagePhrase: { en: "help people at home feel like they were in a social situation", th: "ช่วยให้คนที่บ้านรู้สึกเหมือนอยู่ในสถานการณ์ทางสังคม" },
        keyVocab: { word: "social situation / crowded theatre", th: "สถานการณ์ทางสังคม / โรงละครที่มีคนเยอะ", note: "'social situation, such as a crowded theatre' สื่อว่า Douglass รู้ว่าเสียงหัวเราะสนุกกว่าเมื่ออยู่ในกลุ่ม จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "similar results across a wide range of cultures", th: "ผลที่คล้ายกันจากหลากหลายวัฒนธรรม" },
        passagePhrase: { en: "the results were remarkably consistent: worldwide", th: "ผลลัพธ์สอดคล้องกันอย่างน่าทึ่งทั่วโลก" },
        keyVocab: { word: "remarkably consistent worldwide", th: "สอดคล้องกันอย่างน่าทึ่งทั่วโลก", note: "'remarkably consistent... worldwide' = 'similar results... wide range of cultures' ความสำคัญอยู่ที่ผลตรงกันแม้คนละวัฒนธรรม จึงตอบ B" }
    },
    30: {
        questionPhrase: { en: "participants exchanged roles", th: "ผู้เข้าร่วมสลับบทบาทกัน" },
        passagePhrase: { en: "each student took a turn at being teased by the others", th: "นักศึกษาแต่ละคนผลัดกันถูกคนอื่นล้อ" },
        keyVocab: { word: "took a turn", th: "ผลัดกัน / สลับกันทำ", note: "'took a turn at being teased' หมายถึงผลัดกันเป็นคนล้อและคนถูกล้อ ตรงกับ 'exchanged roles' จึงตอบ B" }
    },
    31: {
        questionPhrase: { en: "high-status people always identifiable by their laugh", th: "คนสถานะสูงถูกระบุได้เสมอจากเสียงหัวเราะ" },
        passagePhrase: { en: "high-status individuals were rated as high-status whether... dominant... or submissive", th: "คนสถานะสูงถูกมองว่าสูงไม่ว่าหัวเราะแบบครอบงำหรือยอม" },
        keyVocab: { word: "whether... or...", th: "ไม่ว่าจะ...หรือ...", note: "'rated as high-status whether dominant or submissive' แปลว่าคนสถานะสูงถูกจับได้เสมอ จึงตอบ D" }
    },
    32: {
        questionPhrase: { en: "generate a different kind of emotion", th: "กระตุ้นให้เกิดอารมณ์คนละแบบ" },
        passagePhrase: { en: "eliciting either humour, contentment, or neutral feelings", th: "กระตุ้นอารมณ์ขัน ความพึงพอใจ หรือความรู้สึกเป็นกลาง" },
        keyVocab: { word: "feelings / eliciting", th: "ความรู้สึก / กระตุ้นให้เกิด", note: "วิดีโอแต่ละคลิปกระตุ้น 'feelings' ต่างกัน คำที่ครอบคลุมคือ emotion จึงเติม F" }
    },
    33: {
        questionPhrase: { en: "those who watched the amusing video persisted longer", th: "คนที่ดูวิดีโอตลกพยายามทำงานนานกว่า" },
        passagePhrase: { en: "watched the Mr. Bean video ended up spending significantly more time", th: "คนที่ดูคลิป Mr. Bean ใช้เวลาทำงานนานขึ้นมาก" },
        keyVocab: { word: "Mr. Bean (comedy) = amusing", th: "Mr. Bean (คอเมดี) = ตลก/น่าขบขัน", note: "คลิป Mr. Bean เป็นวิดีโอตลก ('amusing' = humorous) ซึ่งทำให้พยายามนานขึ้น จึงเติม H" }
    },
    34: {
        questionPhrase: { en: "perform a particularly boring task", th: "ทำงานที่น่าเบื่อเป็นพิเศษ" },
        passagePhrase: { en: "more time working on this tedious task", th: "ใช้เวลามากขึ้นกับงานที่น่าเบื่อ" },
        keyVocab: { word: "tedious", th: "น่าเบื่อ ซ้ำซาก", note: "'tedious' เป็นคำพ้องของ 'boring' งานคูณเลขยาวๆ คือ tedious/boring จึงเติม C" }
    },
    35: {
        questionPhrase: { en: "humour reduces anxiety and builds social connections", th: "อารมณ์ขันลดความวิตกกังวลและสร้างความสัมพันธ์" },
        passagePhrase: { en: "help relieve stress and facilitate social relationships", th: "ช่วยคลายความเครียดและส่งเสริมความสัมพันธ์ทางสังคม" },
        keyVocab: { word: "relieve stress", th: "คลายความเครียด", note: "'relieve stress' = 'reduces anxiety' stress พ้องกับ anxiety (ความวิตกกังวล/ความเครียด) จึงเติม D" }
    },
    36: {
        questionPhrase: { en: "may also have a stimulating effect", th: "อาจมีผลในการกระตุ้น/ปลุกพลัง" },
        passagePhrase: { en: "humour is not only enjoyable but more importantly, energising", th: "อารมณ์ขันไม่เพียงสนุก แต่สำคัญกว่านั้นคือให้พลัง" },
        keyVocab: { word: "energising", th: "ให้พลัง ปลุกเร้า", note: "'energising' = 'stimulating' ทั้งคู่หมายถึงเพิ่มพลัง/กระตุ้น จึงเติม E" }
    },
    37: {
        questionPhrase: { en: "more accurate at identifying friends than strangers", th: "ระบุเสียงหัวเราะของเพื่อนได้แม่นกว่าคนแปลกหน้า" },
        passagePhrase: { en: "people's guesses were correct approximately 60% of the time", th: "การเดายถูกราว 60% ของเวลาทั้งหมด" },
        keyVocab: { word: "60% of the time (overall)", th: "ราว 60% โดยรวม (ไม่แยกเพื่อน/คนแปลกหน้า)", note: "บทความบอกแค่ความแม่นรวม 60% ไม่ได้เทียบเพื่อนกับคนแปลกหน้า จึงตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "researchers were correct in their predictions", th: "นักวิจัยทำนายพฤติกรรมได้ถูกต้อง" },
        passagePhrase: { en: "as expected, high-status individuals produced more dominant laughs", th: "ตามที่คาดไว้ คนสถานะสูงหัวเราะแบบครอบงำมากกว่า" },
        keyVocab: { word: "as expected", th: "ตามที่คาดไว้", note: "'as expected' ยืนยันว่าผลตรงกับที่นักวิจัยทำนายไว้ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "given a fixed amount of time to complete", th: "ถูกกำหนดเวลาตายตัวให้ทำงานเสร็จ" },
        passagePhrase: { en: "Participants were allowed to quit the task at any point", th: "ผู้เข้าร่วมได้รับอนุญาตให้เลิกทำเมื่อไรก็ได้" },
        keyVocab: { word: "quit at any point", th: "เลิกได้ทุกเมื่อ", contrastA: "any point . ทุกเมื่อ (ยืดหยุ่น)", contrastB: "fixed amount of time . เวลาตายตัว", note: "'quit at any point' ขัดแย้งกับ 'fixed amount of time' เวลาไม่ได้ถูกกำหนดตายตัว จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "conclusions were in line with established notions", th: "ข้อสรุปสอดคล้องกับแนวคิดดั้งเดิม" },
        passagePhrase: { en: "traditional views... individuals should avoid... humour... we suggest humour is... energising", th: "มุมมองดั้งเดิมว่าควรเลี่ยงอารมณ์ขัน แต่เขาเสนอว่าอารมณ์ขันให้พลัง" },
        keyVocab: { word: "traditional views vs we suggest", th: "มุมมองดั้งเดิม ปะทะ ข้อเสนอของเขา", contrastA: "traditional views . ควรเลี่ยงอารมณ์ขัน", contrastB: "Cheng and Wang . อารมณ์ขันให้พลัง", note: "ข้อสรุปของเขาขัด ('We suggest') กับ 'traditional views' จึงไม่สอดคล้องกับแนวคิดดั้งเดิม ตอบ NO" }
    },
  },
  "Cambridge 15 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "show considerable global variation", th: "มีความแตกต่างหลากหลายไปทั่วโลก" },
        passagePhrase: { en: "in some versions the wolf swallows... in others it locks her in a cupboard", th: "บางเวอร์ชันหมาป่ากลืนยาย บางเวอร์ชันขังยายไว้ในตู้" },
        keyVocab: { word: "in some versions / in others", th: "ในบางเวอร์ชัน / ในเวอร์ชันอื่น", note: "การที่รายละเอียดเนื้อเรื่องแตกต่างกันไป 'บางเวอร์ชัน...บางเวอร์ชัน' คือความหมายเดียวกับ global variation ทำให้ตอบ C" }
    },
    28: {
        questionPhrase: { en: "useful lessons for life are the reason for survival", th: "บทเรียนสอนใจเป็นเหตุผลที่นิทานอยู่รอด" },
        passagePhrase: { en: "survival-relevant information... but his research suggests otherwise", th: "ข้อมูลที่ช่วยให้รอดชีวิต แต่งานวิจัยเขาบอกตรงกันข้าม" },
        keyVocab: { word: "suggests otherwise", th: "ชี้ว่าไม่ใช่อย่างนั้น / ตรงกันข้าม", note: "Tehrani 'rejects' ความคิดที่ว่าบทเรียนสอนใจคือเหตุผลที่นิทานอยู่รอด คำว่า suggests otherwise คือการปฏิเสธทฤษฎี B (are the reason for their survival)" }
    },
    29: {
        questionPhrase: { en: "theories about social significance of fairy tales", th: "ทฤษฎีต่างๆ เกี่ยวกับความสำคัญทางสังคมของนิทาน" },
        passagePhrase: { en: "academics devising theories to explain the importance of fairy tales", th: "นักวิชาการคิดทฤษฎีขึ้นมาอธิบายความสำคัญของนิทาน" },
        keyVocab: { word: "devising theories", th: "คิด/สร้างทฤษฎีขึ้นมา", note: "ทฤษฎีถูก 'คิดขึ้นมา' โดยไม่มีหลักฐานพิสูจน์ (Tehrani เพิ่งหาวิธีทดสอบได้ภายหลัง) ตรงกับ F (developed without factual basis)" }
    },
    30: {
        questionPhrase: { en: "insights into the development of fairy tales", th: "ความเข้าใจเกี่ยวกับพัฒนาการของนิทาน" },
        passagePhrase: { en: "used the same approach... borrowing a technique from evolutionary biologists", th: "ใช้วิธีเดียวกัน โดยยืมเทคนิคจากนักชีววิทยาวิวัฒนาการ" },
        keyVocab: { word: "technique from evolutionary biologists", th: "เทคนิคจากนักชีววิทยาวิวัฒนาการ", note: "วิธีที่ใช้เข้าใจพัฒนาการนิทานยืมมาจากงานวิจัยทางชีววิทยา ตรงกับ A (methods used in biological research)" }
    },
    31: {
        questionPhrase: { en: "all the fairy tales analysed by Tehrani", th: "นิทานทั้งหมดที่ Tehrani วิเคราะห์" },
        passagePhrase: { en: "58 stories recorded from oral traditions", th: "นิทาน 58 เรื่องที่บันทึกจากการเล่าปากต่อปาก" },
        keyVocab: { word: "oral traditions", th: "ประเพณีการเล่าด้วยปาก (เล่าปากต่อปาก)", contrastA: "spoken . phût (เล่าด้วยปาก)", contrastB: "written . khiian (เขียน)", note: "oral = เล่าด้วยปาก ตรงข้ามกับเขียน จึงตรงกับ E (originally spoken rather than written)" }
    },
    32: {
        questionPhrase: { en: "find out if links existed among 58 stories", th: "หาว่ามีความเชื่อมโยงกันระหว่างนิทาน 58 เรื่องหรือไม่" },
        passagePhrase: { en: "his analysis had established that they were indeed related", th: "การวิเคราะห์ยืนยันว่านิทานเหล่านั้นมีความสัมพันธ์กันจริง" },
        keyVocab: { word: "related", th: "มีความสัมพันธ์/เชื่อมโยงกัน", note: "related = links (ความเชื่อมโยง) เขาต้องการรู้ว่านิทานเกี่ยวข้องกันไหม คำตอบคือ D (links)" }
    },
    33: {
        questionPhrase: { en: "which aspects of stories had fewest variations", th: "ส่วนใดของเรื่องเปลี่ยนแปลงน้อยที่สุด" },
        passagePhrase: { en: "explore how they have developed and altered over time", th: "สำรวจว่านิทานพัฒนาและเปลี่ยนแปลงไปอย่างไรตามเวลา" },
        keyVocab: { word: "altered over time", th: "เปลี่ยนแปลงไปตามกาลเวลา", note: "altered = variations (การเปลี่ยนแปลง) ส่วนที่ 'เปลี่ยนน้อยที่สุด' คือมี variations น้อยที่สุด คำตอบ F (variations)" }
    },
    34: {
        questionPhrase: { en: "some events tended to change over time", th: "เหตุการณ์บางอย่างมักเปลี่ยนแปลงไปตามเวลา" },
        passagePhrase: { en: "lots of other details that can evolve quite freely", th: "รายละเอียดอื่นๆ จำนวนมากที่เปลี่ยนแปลงได้อย่างอิสระ" },
        keyVocab: { word: "episodes / details that evolve", th: "เหตุการณ์/รายละเอียดในเรื่องที่เปลี่ยนไป", note: "episodes ในเรื่องที่ 'evolve freely' คือ events ที่เปลี่ยนแปลงตามเวลา ตรงกับ B (events)" }
    },
    35: {
        questionPhrase: { en: "parts that seemed to provide some sort of warning", th: "ส่วนที่ดูเหมือนจะให้คำเตือนบางอย่าง" },
        passagePhrase: { en: "such elements were just as flexible as seemingly trivial details", th: "องค์ประกอบเหล่านั้นเปลี่ยนแปลงง่ายพอๆ กับรายละเอียดที่ดูไม่สำคัญ" },
        keyVocab: { word: "cautionary elements", th: "องค์ประกอบที่เป็นคำเตือน/สอนใจ", note: "ก่อนหน้าระบุ 'cautionary elements' (คำเตือนเรื่องอันตราย) ที่ยืดหยุ่นเปลี่ยนง่าย warning = cautionary จึงตอบ C (warning)" }
    },
    36: {
        questionPhrase: { en: "the aspect most important in a story's survival", th: "ส่วนที่สำคัญที่สุดต่อการอยู่รอดของนิทาน" },
        passagePhrase: { en: "fear – blood-thirsty and gruesome aspects... best preserved of all", th: "ความกลัว ความโหดเหี้ยมน่าขนลุก ถูกเก็บรักษาไว้ดีที่สุด" },
        keyVocab: { word: "blood-thirsty and gruesome", th: "กระหายเลือดและน่าสยดสยอง", note: "fear/gruesome (ความน่าสยดสยอง) คือสิ่งที่อยู่รอดดีที่สุด horror = ความสยองขวัญ ตอบ G (horror)" }
    },
    37: {
        questionPhrase: { en: "looked at many forms of the same basic story", th: "ดูนิทานเรื่องเดียวกันในหลายๆ รูปแบบ" },
        passagePhrase: { en: "Little Red Riding Hood in its many forms", th: "หนูน้อยหมวกแดงในรูปแบบต่างๆ มากมาย" },
        keyVocab: { word: "in its many forms", th: "ในหลากหลายรูปแบบ", note: "เขาวิเคราะห์นิทานเรื่องเดียว (LRRH) ใน 'many forms' = many different forms of the same basic story ตอบ B" }
    },
    38: {
        questionPhrase: { en: "features survive only if they have deeper significance", th: "องค์ประกอบจะอยู่รอดก็ต่อเมื่อมีความหมายลึกซึ้ง" },
        passagePhrase: { en: "they won't stick unless they matter", th: "มันจะไม่ติดทนถ้ามันไม่สำคัญจริงๆ" },
        keyVocab: { word: "won't stick unless they matter", th: "จะไม่ติดทนถ้าไม่มีความสำคัญ", contrastA: "matter . samkhan (มีความสำคัญ/นัยลึกซึ้ง)", contrastB: "stick / survive . yu-rot (อยู่รอด/ติดทน)", note: "stick = survive และ matter = deeper significance Zipes บอกต้อง 'สำคัญ' ถึงจะอยู่รอด ตอบ D" }
    },
    39: {
        questionPhrase: { en: "to indicate Jack Zipes' theory is incorrect", th: "เพื่อชี้ว่าทฤษฎีของ Jack Zipes ไม่ถูกต้อง" },
        passagePhrase: { en: "it is not always true elsewhere... the villain is a woman... the victim is a boy", th: "ไม่จริงเสมอไปที่อื่น ผู้ร้ายเป็นผู้หญิง เหยื่อเป็นเด็กผู้ชาย" },
        keyVocab: { word: "not always true elsewhere", th: "ไม่ได้เป็นจริงเสมอไปในที่อื่น", note: "Zipes อ้างผู้หญิงเป็นเหยื่อเสมอ แต่ Tehrani ยกตัวอย่างจีน/ญี่ปุ่นที่เหยื่อเป็นเด็กชาย เพื่อหักล้างทฤษฎีของ Zipes ตอบ A" }
    },
    40: {
        questionPhrase: { en: "a safe way of learning to deal with fear", th: "วิธีที่ปลอดภัยในการเรียนรู้รับมือกับความกลัว" },
        passagePhrase: { en: "feel afraid without having to experience real danger", th: "รู้สึกกลัวได้โดยไม่ต้องเจออันตรายจริง" },
        keyVocab: { word: "without having to experience real danger", th: "โดยไม่ต้องเผชิญอันตรายจริง", contrastA: "safe . plotphai (ปลอดภัย)", contrastB: "real danger . antaraai-jing (อันตรายจริง)", note: "การกลัวโดยไม่เจออันตรายจริง = วิธีปลอดภัยในการเรียนรู้รับมือความกลัว ตอบ A" }
    },
  },
  "Cambridge 15 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "they appear to have no moral standards", th: "ดูเหมือนพวกเขาไม่มีหลักศีลธรรมเลย" },
        passagePhrase: { en: "maximise money by damaging the environment and hurting people", th: "หากำไรสูงสุดด้วยการทำลายสิ่งแวดล้อมและทำร้ายผู้คน" },
        keyVocab: { word: "moral standards", th: "มาตรฐาน/หลักศีลธรรม", note: "ธุรกิจยอมทำร้ายผู้คนและสิ่งแวดล้อมเพื่อเงิน = ไม่มีหลักศีลธรรม จึงตอบ D (moral standards)" }
    },
    28: {
        questionPhrase: { en: "Lack of control by governments", th: "การขาดการควบคุมโดยรัฐบาล" },
        passagePhrase: { en: "if government regulation is ineffective", th: "ถ้าการกำกับดูแลของรัฐบาลไม่ได้ผล" },
        keyVocab: { word: "regulation", th: "การกำกับดูแล/ควบคุม", note: "regulation ที่ไม่ได้ผล = การขาดการควบคุม (control) จึงตอบ E" }
    },
    29: {
        questionPhrase: { en: "lack of public involvement", th: "การขาดการมีส่วนร่วมของประชาชน" },
        passagePhrase: { en: "if the public doesn't care", th: "ถ้าประชาชนไม่ใส่ใจ" },
        keyVocab: { word: "doesn't care", th: "ไม่ใส่ใจ/ไม่สนใจ", note: "ประชาชนไม่ใส่ใจ = ขาดการมีส่วนร่วม (involvement) จึงตอบ F" }
    },
    30: {
        questionPhrase: { en: "environmental problems such as overfishing", th: "ปัญหาสิ่งแวดล้อม เช่น การจับปลามากเกินไป" },
        passagePhrase: { en: "fishermen in an unmanaged fishery without quotas", th: "ชาวประมงในแหล่งประมงที่ไม่มีการจัดการและไม่มีโควตา" },
        keyVocab: { word: "fishery without quotas", th: "การประมงที่ไม่มีโควตาจำกัด", note: "ประมงไร้โควตาไร้การจัดการ = จับปลาเกินขนาด (overfishing) จึงตอบ H" }
    },
    31: {
        questionPhrase: { en: "the destruction of trees", th: "การทำลายต้นไม้" },
        passagePhrase: { en: "logging companies with leases on tropical rainforest land", th: "บริษัทตัดไม้ที่เช่าพื้นที่ป่าฝนเขตร้อน" },
        keyVocab: { word: "logging / rainforest", th: "การตัดไม้/ป่าฝน", note: "บริษัทตัดไม้ทำลายป่าฝน = การทำลายต้นไม้ (trees) จึงตอบ B" }
    },
    32: {
        questionPhrase: { en: "could be prevented by the action of ordinary people", th: "ป้องกันได้ด้วยการกระทำของคนธรรมดา" },
        passagePhrase: { en: "it is the public that has the power to make destructive policies unprofitable", th: "ประชาชนคือผู้มีอำนาจทำให้นโยบายทำลายล้างไม่ทำกำไร" },
        keyVocab: { word: "the public has the power", th: "ประชาชนมีอำนาจ", note: "ย่อหน้าเน้นว่าประชาชน (ordinary people) มีอำนาจหยุดปัญหา จึงตอบ C" }
    },
    33: {
        questionPhrase: { en: "influence the environmental policies of businesses and governments", th: "มีอิทธิพลต่อนโยบายสิ่งแวดล้อมของธุรกิจและรัฐบาล" },
        passagePhrase: { en: "preferring their governments to award contracts to businesses with good environmental track record", th: "เลือกให้รัฐบาลมอบสัญญาแก่ธุรกิจที่มีประวัติด้านสิ่งแวดล้อมดี" },
        keyVocab: { word: "preferring / pressing their governments", th: "การกดดัน/ผลักดันรัฐบาลและธุรกิจ", note: "ตัวอย่างทั้งย่อหน้าคือการกดดันทั้งธุรกิจและรัฐบาล (influence both) จึงตอบ D ไม่ใช่แค่ลดผลกระทบตนเอง" }
    },
    34: {
        questionPhrase: { en: "fast-food company forced suppliers to follow the law", th: "บริษัทฟาสต์ฟู้ดบังคับซัพพลายเออร์ให้ทำตามกฎหมาย" },
        passagePhrase: { en: "when a fast-food company made the demands, the meat industry complied within weeks", th: "เมื่อบริษัทฟาสต์ฟู้ดเรียกร้อง อุตสาหกรรมเนื้อก็ยอมทำตามในไม่กี่สัปดาห์" },
        keyVocab: { word: "complied", th: "ยอมทำตาม/ปฏิบัติตาม", note: "meat industry ยอมทำตามคำสั่งฟาสต์ฟู้ด (ที่ตรงกับกฎ FDA) = ถูกบังคับให้ทำตามกฎหมาย จึงตอบ B" }
    },
    35: {
        questionPhrase: { en: "public should pay more to encourage good practices", th: "ประชาชนควรจ่ายแพงขึ้นเพื่อหนุนแนวปฏิบัติที่ดี" },
        passagePhrase: { en: "the public must accept higher prices to cover costs of sound environmental practices", th: "ประชาชนต้องยอมรับราคาที่สูงขึ้นเพื่อครอบคลุมต้นทุนของแนวปฏิบัติที่ดี" },
        keyVocab: { word: "must accept higher prices", th: "ต้องยอมรับราคาที่สูงขึ้น", note: "ผู้เขียนเชื่อว่าประชาชนต้องยอมจ่ายแพงขึ้น ตรงกับข้อความ จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "contrast between moral principles of different businesses", th: "ความแตกต่างของหลักศีลธรรมระหว่างธุรกิจต่าง ๆ" },
        passagePhrase: { en: "businesses should act in accordance with moral principles", th: "ธุรกิจควรกระทำตามหลักศีลธรรม" },
        keyVocab: { word: "different businesses", th: "ธุรกิจที่ต่างกัน", note: "ผู้เขียนพูดถึงศีลธรรมของธุรกิจโดยรวม ไม่เคยเปรียบเทียบศีลธรรมระหว่างธุรกิจต่าง ๆ จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "important to distinguish acceptable and unacceptable behaviour", th: "สำคัญที่จะแยกพฤติกรรมที่ยอมรับได้กับยอมรับไม่ได้" },
        passagePhrase: { en: "my conclusion is not a moralistic one about who is right or wrong", th: "ข้อสรุปของฉันไม่ได้เป็นเรื่องศีลธรรมว่าใครถูกใครผิด" },
        keyVocab: { word: "not a moralistic one", th: "ไม่ใช่เรื่องตัดสินศีลธรรม", contrastA: "right or wrong . ถูกหรือผิด", contrastB: "not moralistic . ไม่ตัดสินศีลธรรม", note: "ผู้เขียนปฏิเสธว่าข้อสรุปไม่ใช่การตัดสินถูก-ผิด ขัดกับโจทย์ จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "public have successfully influenced businesses in the past", th: "ประชาชนเคยมีอิทธิพลต่อธุรกิจสำเร็จในอดีต" },
        passagePhrase: { en: "in the past, businesses have changed when the public came to expect different behaviour", th: "ในอดีตธุรกิจเปลี่ยนเมื่อประชาชนเริ่มคาดหวังพฤติกรรมที่ต่างออกไป" },
        keyVocab: { word: "businesses have changed", th: "ธุรกิจได้เปลี่ยนแปลงไปแล้ว", note: "ผู้เขียนยืนยันว่าในอดีตธุรกิจเปลี่ยนเพราะประชาชน = มีอิทธิพลสำเร็จ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "businesses will show more concern for the environment", th: "ธุรกิจจะใส่ใจสิ่งแวดล้อมมากขึ้น" },
        passagePhrase: { en: "changes in public attitudes will be essential for changes in businesses' practices", th: "การเปลี่ยนทัศนคติของประชาชนจำเป็นต่อการเปลี่ยนแนวปฏิบัติของธุรกิจ" },
        keyVocab: { word: "changes in public attitudes", th: "การเปลี่ยนทัศนคติของประชาชน", note: "ผู้เขียนทำนายว่าธุรกิจจะเปลี่ยนก็ต่อเมื่อประชาชนเปลี่ยน ไม่ได้บอกว่าธุรกิจจะใส่ใจมากขึ้นเอง จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "how public opinion can change businesses' environmental policies", th: "ความเห็นสาธารณะเปลี่ยนนโยบายสิ่งแวดล้อมของธุรกิจได้อย่างไร" },
        passagePhrase: { en: "the public can do that by suing businesses and buying sustainably harvested products", th: "ประชาชนทำได้ด้วยการฟ้องธุรกิจและซื้อสินค้าที่ผลิตอย่างยั่งยืน" },
        keyVocab: { word: "the public can do that", th: "ประชาชนสามารถทำสิ่งนั้นได้", note: "ทั้งบทเน้นวิธีที่ประชาชน (public opinion) กดดันให้ธุรกิจเปลี่ยนนโยบาย จึงตอบ B" }
    },
  },
  "Cambridge 16 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "the extent to which AI will alter the nature of work", th: "AI จะเปลี่ยนลักษณะของงานมากแค่ไหน" },
        passagePhrase: { en: "all workers will need to adapt as their occupations evolve", th: "คนทำงานทุกคนต้องปรับตัวเมื่ออาชีพของตนเปลี่ยนไป" },
        keyVocab: { word: "evolve / adapt", th: "วิวัฒน์ / ปรับตัวเปลี่ยนแปลง", note: "ย่อหน้าแรกเน้นว่างานจะ 'เปลี่ยนลักษณะ' (evolve, adapt) ไม่ใช่บอกชนิดงานหรือสัดส่วน จึงตอบ B" }
    },
    28: {
        questionPhrase: { en: "a key factor driving current developments in the workplace", th: "ปัจจัยสำคัญที่ขับเคลื่อนความเปลี่ยนแปลงในที่ทำงานตอนนี้" },
        passagePhrase: { en: "some of the most fundamental changes are happening as a result", th: "ความเปลี่ยนแปลงพื้นฐานที่สุดบางอย่างกำลังเกิดขึ้นเพราะสิ่งนี้" },
        keyVocab: { word: "fundamental changes", th: "ความเปลี่ยนแปลงพื้นฐานสำคัญ", note: "'fundamental changes' = 'key factor driving developments' จึงตอบ D ว่าเศรษฐกิจความรู้เป็นปัจจัยหลักขับเคลื่อนการเปลี่ยนแปลง" }
    },
    29: {
        questionPhrase: { en: "staff making sure AI produces the results they want", th: "พนักงานทำให้ AI ได้ผลลัพธ์ตามที่ตัวเองต้องการ" },
        passagePhrase: { en: "workers feed the algorithm with false data to reach their targets", th: "คนงานป้อนข้อมูลเท็จให้อัลกอริทึมเพื่อให้ถึงเป้า" },
        keyVocab: { word: "feed false data to reach targets", th: "ป้อนข้อมูลปลอมเพื่อให้ได้เป้าหมาย", note: "การ 'ป้อนข้อมูลเท็จเพื่อถึงเป้า' คือการบังคับให้ AI ออกผลตามที่ต้องการ จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "how changes in the job market can be successfully handled", th: "วิธีรับมือกับความเปลี่ยนแปลงในตลาดงานให้สำเร็จ" },
        passagePhrase: { en: "governments seizing the opportunity to improve policy to enforce good job security", th: "รัฐบาลคว้าโอกาสปรับนโยบายเพื่อสร้างความมั่นคงในงาน" },
        keyVocab: { word: "improve policy / new policies", th: "ปรับปรุงนโยบาย / นโยบายใหม่", note: "McGaughey เสนอให้รัฐใช้นโยบายที่ดีรับมือการเปลี่ยนแปลง = วิธีจัดการตลาดงานให้สำเร็จ จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "jobs which rely not on production but on ___", th: "งานที่ไม่ได้พึ่งการผลิต แต่พึ่งสิ่งนี้" },
        passagePhrase: { en: "jobs that are dependent on data rather than on production", th: "งานที่ขึ้นกับข้อมูลมากกว่าการผลิต" },
        keyVocab: { word: "data = information", th: "ข้อมูล", note: "passage บอก 'dependent on data' ตรงกับตัวเลือก G information จึงเติม G" }
    },
    32: {
        questionPhrase: { en: "a growing ___ on the recommendations made by AI", th: "การพึ่งพา AI ที่เพิ่มขึ้นตามคำแนะนำของมัน" },
        passagePhrase: { en: "become dependent on its instructions", th: "เริ่มพึ่งพาคำสั่งของอัลกอริทึม" },
        keyVocab: { word: "dependent = reliance", th: "การพึ่งพา", note: "'become dependent' = คำนาม reliance จึงเติม E reliance" }
    },
    33: {
        questionPhrase: { en: "staff deterred from experimenting and using their own ___", th: "พนักงานถูกห้ามไม่ให้ทดลองและใช้สิ่งนี้ของตนเอง" },
        passagePhrase: { en: "experimentation and human instinct lead to progress and new ideas", th: "การทดลองและสัญชาตญาณของมนุษย์นำไปสู่ความก้าวหน้าและไอเดียใหม่" },
        keyVocab: { word: "human instinct = intuition", th: "สัญชาตญาณ / ลางสังหรณ์ของมนุษย์", note: "'human instinct' เป็นคำพ้องของ intuition จึงเติม C intuition" }
    },
    34: {
        questionPhrase: { en: "increase users' ___ with regard to the technology", th: "เพิ่มสิ่งนี้ของผู้ใช้ที่มีต่อเทคโนโลยี" },
        passagePhrase: { en: "make AI technologies more trustworthy and transparent", th: "ทำให้เทคโนโลยี AI น่าเชื่อถือและโปร่งใสขึ้น" },
        keyVocab: { word: "trustworthy = confidence", th: "น่าเชื่อถือ / ความเชื่อมั่น", note: "ทำให้ AI 'trustworthy' = เพิ่ม confidence ของผู้ใช้ จึงเติม F confidence" }
    },
    35: {
        questionPhrase: { en: "more automation will not result in lower employment", th: "การใช้เครื่องจักรมากขึ้นจะไม่ทำให้การจ้างงานลดลง" },
        passagePhrase: { en: "that doesn't mean we are left with just 50 jobs for humans", th: "ไม่ได้แปลว่าจะเหลืองานให้มนุษย์แค่ 50 ตำแหน่ง" },
        keyVocab: { word: "the number of jobs is fixed (a fallacy)", th: "ความเชื่อผิดๆ ว่าจำนวนงานตายตัว", note: "Low บอกความคิดว่างานหายเพราะหุ่นยนต์เป็น 'fallacy' = หุ่นยนต์มากขึ้นไม่ทำให้งานน้อยลง จึงตอบ B (Hamish Low)" }
    },
    36: {
        questionPhrase: { en: "several reasons why AI is appealing to businesses", th: "หลายเหตุผลที่ทำให้ AI น่าดึงดูดสำหรับธุรกิจ" },
        passagePhrase: { en: "In many cases, they can outperform humans", th: "ในหลายกรณี อัลกอริทึมทำได้ดีกว่ามนุษย์" },
        keyVocab: { word: "outperform humans", th: "ทำได้ดีกว่ามนุษย์", note: "Pachidi ชี้ข้อดีหลายอย่างของ AI (เก่งกว่าคน ทำงานที่เคยต้องใช้คน) = เหตุผลที่ธุรกิจอยากใช้ จึงตอบ A (Pachidi)" }
    },
    37: {
        questionPhrase: { en: "AI's potential parallels major cultural shifts of previous eras", th: "ศักยภาพของ AI เทียบได้กับการเปลี่ยนแปลงครั้งใหญ่ในยุคก่อน" },
        passagePhrase: { en: "Just as the industrial revolution... a third revolution has been pronounced", th: "เช่นเดียวกับการปฏิวัติอุตสาหกรรม การปฏิวัติครั้งที่สามได้ถูกประกาศแล้ว" },
        keyVocab: { word: "revolution (industrial / corporate / third)", th: "การปฏิวัติ (อุตสาหกรรม / องค์กร / ครั้งที่สาม)", note: "McGaughey เทียบ AI กับการปฏิวัติอุตสาหกรรมในอดีต = การเปลี่ยนแปลงทางวัฒนธรรมครั้งใหญ่ จึงตอบ C (McGaughey)" }
    },
    38: {
        questionPhrase: { en: "be aware of the range of problems that AI causes", th: "ตระหนักถึงปัญหาหลายด้านที่ AI ก่อขึ้น" },
        passagePhrase: { en: "these enhancements are not without consequences... Another issue is", th: "ข้อดีเหล่านี้ไม่ใช่ว่าไม่มีผลตามมา... อีกประเด็นหนึ่งคือ" },
        keyVocab: { word: "consequences / another issue", th: "ผลตามมา / อีกประเด็นปัญหา", note: "Pachidi ชี้ปัญหาหลายอย่างของ AI (consequences, another issue) = ต้องตระหนักถึงปัญหาหลายด้าน จึงตอบ A (Pachidi)" }
    },
    39: {
        questionPhrase: { en: "follow a less conventional career path than in the past", th: "เดินเส้นทางอาชีพที่ไม่เป็นแบบเดิมเหมือนในอดีต" },
        passagePhrase: { en: "The traditional trajectory... is a thing of the past", th: "เส้นทางอาชีพแบบดั้งเดิม... เป็นเรื่องของอดีตไปแล้ว" },
        keyVocab: { word: "traditional trajectory is a thing of the past", th: "เส้นทางอาชีพแบบดั้งเดิมหมดยุคแล้ว", contrastA: "traditional . แบบดั้งเดิม", contrastB: "multistage / by choice . หลายช่วงตามที่เลือกเอง", note: "Low บอกเส้นทาง 'traditional' หมดยุค แทนด้วยอาชีพหลายช่วง = career path ที่ less conventional จึงตอบ B (Hamish Low)" }
    },
    40: {
        questionPhrase: { en: "authorities should ensure adequately paid work for everyone", th: "ผู้มีอำนาจควรทำให้ทุกคนมีงานที่ได้ค่าจ้างพอเพียง" },
        passagePhrase: { en: "leaders... with bold new policies that guarantee full employment, fair incomes", th: "ผู้นำ... ด้วยนโยบายใหม่ที่กล้าหาญซึ่งรับประกันการจ้างงานเต็มที่และรายได้ที่เป็นธรรม" },
        keyVocab: { word: "guarantee full employment, fair incomes", th: "รับประกันการจ้างงานเต็มที่และรายได้ที่เป็นธรรม", note: "McGaughey เรียกร้องให้ผู้นำ/รัฐออกนโยบายรับประกันงานและรายได้เป็นธรรม = งานที่ได้ค่าจ้างพอเพียงสำหรับทุกคน จึงตอบ C (McGaughey)" }
    },
  },
  "Cambridge 16 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "a basic assumption about wisdom may be wrong", th: "ความเชื่อพื้นฐานเกี่ยวกับปัญญาอาจผิด" },
        passagePhrase: { en: "it isn't an exceptional trait possessed by a small handful of philosophers", th: "มันไม่ใช่คุณสมบัติพิเศษที่มีแค่นักปรัชญาไม่กี่คน" },
        keyVocab: { word: "isn't an exceptional trait after all", th: "ที่จริงแล้วไม่ใช่คุณสมบัติพิเศษเฉพาะคน", note: "ผู้เขียนลบล้างสมมติฐานเดิมที่ว่าปัญญาเป็นของคนพิเศษไม่กี่คน จึงตอบ B (สมมติฐานพื้นฐานอาจผิด)" }
    },
    28: {
        questionPhrase: { en: "importance of certain influences was underestimated", th: "ความสำคัญของบางปัจจัยถูกประเมินต่ำเกินไป" },
        passagePhrase: { en: "even more powerful in shaping wisdom than previously imagined", th: "ทรงพลังต่อการสร้างปัญญามากกว่าที่เคยคิดไว้" },
        keyVocab: { word: "than previously imagined", th: "มากกว่าที่เคยคิด/จินตนาการไว้", note: "วลี 'more powerful than previously imagined' = อิทธิพลถูกประเมินต่ำไปก่อนหน้านี้ จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "will be different in different circumstances", th: "จะต่างกันไปตามสถานการณ์ที่ต่างกัน" },
        passagePhrase: { en: "ability to reason wisely varies dramatically across situational contexts", th: "ความสามารถในการคิดอย่างมีปัญญาผันแปรมากตามบริบทของสถานการณ์" },
        keyVocab: { word: "varies dramatically across contexts", th: "ผันแปรอย่างมากตามบริบท", note: "'varies across contexts' = ต่างกันในแต่ละสถานการณ์ ตรงกับ B" }
    },
    30: {
        questionPhrase: { en: "a recommended strategy to help reason wisely", th: "กลยุทธ์ที่แนะนำเพื่อช่วยให้คิดอย่างมีปัญญา" },
        passagePhrase: { en: "one of the most reliable ways to support wisdom", th: "หนึ่งในวิธีที่เชื่อถือได้ที่สุดในการเสริมปัญญา" },
        keyVocab: { word: "most reliable ways to support wisdom", th: "วิธีที่เชื่อถือได้ที่สุดในการเสริมปัญญา", note: "'most reliable way to support wisdom' = กลยุทธ์ที่แนะนำ (recommended strategy) จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "a certain degree of ... regarding the extent of our knowledge", th: "ความ...ในระดับหนึ่งเกี่ยวกับขอบเขตความรู้ของเรา" },
        passagePhrase: { en: "intellectual humility or recognition of the limits of our own knowledge", th: "ความถ่อมตนทางปัญญา คือการยอมรับขีดจำกัดความรู้ของตน" },
        keyVocab: { word: "humility = modesty", th: "ความถ่อมตน/ความเจียมตน", note: "'intellectual humility' ตรงกับตัวเลือก D modesty (ความเจียมตน) จึงตอบ D" }
    },
    32: {
        questionPhrase: { en: "take into account ... which may not be the same as our own", th: "คำนึงถึง...ที่อาจไม่เหมือนของเราเอง" },
        passagePhrase: { en: "appreciation of perspectives wider than the issue at hand", th: "การเห็นคุณค่าของมุมมองที่กว้างกว่าประเด็นตรงหน้า" },
        keyVocab: { word: "perspectives = opinions", th: "มุมมอง/ความคิดเห็น", note: "ช่องว่างนี้ต้องการสิ่งที่ 'may not be the same as our own' = ความคิดเห็นของคนอื่น (opinions) จึงตอบ A" }
    },
    33: {
        questionPhrase: { en: "able to take a broad ... of any situation", th: "สามารถมอง...ที่กว้างของทุกสถานการณ์" },
        passagePhrase: { en: "appreciation of perspectives wider than the issue at hand", th: "การเห็นคุณค่าของมุมมองที่กว้างกว่าประเด็นตรงหน้า" },
        keyVocab: { word: "perspectives wider = broad view", th: "มุมมองที่กว้าง", note: "'broad ... of any situation' + 'wider perspectives' = มุมมองกว้าง (view) จึงตอบ C" }
    },
    34: {
        questionPhrase: { en: "better to regard scenarios with ...", th: "ควรพิจารณาสถานการณ์ด้วย..." },
        passagePhrase: { en: "look at scenarios from a third-party perspective", th: "มองสถานการณ์จากมุมมองของบุคคลที่สาม" },
        keyVocab: { word: "third-party perspective = objectivity", th: "มุมมองคนนอก = ความเป็นกลาง/วัตถุวิสัย", note: "การมองแบบบุคคลที่สาม (third-party) คือการมองอย่างเป็นกลาง จึงตอบ F objectivity" }
    },
    35: {
        questionPhrase: { en: "we focus more on ... and on other moral ideals", th: "เรามุ่งความสนใจไปที่...และอุดมคติทางศีลธรรมอื่น ๆ" },
        passagePhrase: { en: "moral ideals such as justice and impartiality", th: "อุดมคติทางศีลธรรม เช่น ความยุติธรรมและความเที่ยงธรรม" },
        keyVocab: { word: "justice = fairness", th: "ความยุติธรรม/ความเป็นธรรม", note: "'justice' ในเนื้อเรื่องตรงกับ fairness และ 'other moral ideals' ในสรุปบอกว่าช่องนี้คืออุดมคติหนึ่ง จึงตอบ G fairness" }
    },
    36: {
        questionPhrase: { en: "students could choose one of two perspectives", th: "นักศึกษาเลือกมุมมองหนึ่งจากสองแบบได้เอง" },
        passagePhrase: { en: "group assigned to the 'distant observer' role", th: "กลุ่มที่ถูกกำหนดให้รับบท 'ผู้สังเกตการณ์จากระยะไกล'" },
        keyVocab: { word: "assigned", th: "ถูกมอบหมาย/กำหนดให้", contrastA: "assigned . thuk-kamnod-hai (ถูกกำหนดให้)", contrastB: "choose . lueak-eng (เลือกเอง)", note: "นักศึกษา 'ถูกกำหนด' (assigned) ให้รับบท ไม่ได้เลือกเอง จึงขัดกับโจทย์ ตอบ FALSE" }
    },
    37: {
        questionPhrase: { en: "participants knew they were in a wise-reasoning study", th: "ผู้ร่วมการทดลองรู้ว่าตนอยู่ในงานวิจัยเรื่องการคิดอย่างมีปัญญา" },
        passagePhrase: { en: "couples were instructed to visualize an unresolved relationship conflict", th: "คู่รักถูกสั่งให้นึกภาพความขัดแย้งที่ยังไม่คลี่คลาย" },
        keyVocab: { word: "aware of the study's purpose", th: "รู้วัตถุประสงค์ของงานวิจัย", note: "เนื้อเรื่องไม่ได้บอกว่าผู้ร่วมทดลองรู้หรือไม่รู้ว่ากำลังศึกษาเรื่องอะไร จึงตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "length of the couples' relationships affected the results", th: "ระยะเวลาความสัมพันธ์ของคู่รักมีผลต่อผลลัพธ์" },
        passagePhrase: { en: "couples in the 'other's eyes' condition were more likely to rely on wise reasoning", th: "คู่ในเงื่อนไข 'มองด้วยตาคนอื่น' มีแนวโน้มใช้การคิดอย่างมีปัญญามากกว่า" },
        keyVocab: { word: "length of relationship had an impact", th: "ระยะเวลาความสัมพันธ์มีผล", note: "เนื้อเรื่องบอกแค่ว่าเป็น 'long-term' แต่ไม่ได้เปรียบเทียบว่าความยาวสั้นต่างมีผลต่อผลลัพธ์ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "detached viewpoint led to wiser decisions", th: "มุมมองที่ห่าง/เป็นกลางนำไปสู่การตัดสินใจที่มีปัญญากว่า" },
        passagePhrase: { en: "Ego-decentering promotes greater focus on others ... recognition of ... change", th: "การถอยออกจากตัวตนส่งเสริมให้สนใจผู้อื่นและตระหนักถึงการเปลี่ยนแปลง" },
        keyVocab: { word: "ego-decentering = detached viewpoint", th: "การถอยออกจากตัวตน = มุมมองที่ห่าง", note: "ทั้งสองการทดลองยืนยันว่ามุมมองแบบ distant observer / ego-decentering ให้การคิดที่มีปัญญากว่า จึงตอบ TRUE" }
    },
    40: {
        questionPhrase: { en: "intelligence determines wisdom only to a limited extent", th: "สติปัญญากำหนดความมีปัญญาได้เพียงเล็กน้อยเท่านั้น" },
        passagePhrase: { en: "only a small positive relationship between wise thinking and crystallized intelligence", th: "มีความสัมพันธ์เชิงบวกเพียงเล็กน้อยระหว่างการคิดมีปัญญากับสติปัญญา" },
        keyVocab: { word: "only a small relationship", th: "ความสัมพันธ์เพียงเล็กน้อย", note: "'only a small positive relationship' = สติปัญญามีผลจำกัด ตรงกับโจทย์ จึงตอบ TRUE" }
    },
  },
  "Cambridge 16 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "discovery caused surprise among other scientists", th: "การค้นพบสร้างความประหลาดใจในหมู่นักวิทยาศาสตร์คนอื่น" },
        passagePhrase: { en: "discovered that the 'thermometer' molecule enables them to develop", th: "ค้นพบว่าโมเลกุล 'เทอร์โมมิเตอร์' ช่วยให้พืชพัฒนาได้" },
        keyVocab: { word: "surprise", th: "ความประหลาดใจ", note: "บทความเล่าแค่ว่ามีการค้นพบ แต่ไม่เคยพูดถึงปฏิกิริยา 'ประหลาดใจ' ของนักวิทยาศาสตร์คนอื่นเลย จึงตอบ NOT GIVEN" }
    },
    28: {
        questionPhrase: { en: "target for agricultural production could be missed", th: "เป้าหมายผลผลิตทางการเกษตรอาจทำไม่สำเร็จ" },
        passagePhrase: { en: "yields will need to double by 2050, but climate change is a major threat", th: "ผลผลิตต้องเพิ่มเป็นสองเท่าภายในปี 2050 แต่การเปลี่ยนแปลงสภาพอากาศเป็นภัยคุกคามใหญ่" },
        keyVocab: { word: "major threat to achieving", th: "ภัยคุกคามใหญ่ต่อการทำให้สำเร็จ", note: "'major threat to achieving this' = เป้าหมายอาจไม่สำเร็จ ตรงกับ 'could be missed' จึงตอบ TRUE" }
    },
    29: {
        questionPhrase: { en: "wheat and rice suffer from a rise in temperatures", th: "ข้าวสาลีและข้าวได้รับผลกระทบจากอุณหภูมิที่สูงขึ้น" },
        passagePhrase: { en: "wheat and rice are sensitive to high temperatures", th: "ข้าวสาลีและข้าวอ่อนไหวต่ออุณหภูมิสูง" },
        keyVocab: { word: "sensitive to high temperatures", th: "อ่อนไหว/ไวต่ออุณหภูมิสูง", note: "'sensitive to high temperatures' + ผลผลิตลดลงเมื่ออุณหภูมิเพิ่ม = 'suffer from a rise in temperatures' จึงตอบ TRUE" }
    },
    30: {
        questionPhrase: { en: "develop crops that require less water", th: "พัฒนาพืชที่ต้องการน้ำน้อยลง" },
        passagePhrase: { en: "could help us breed tougher crops", th: "อาจช่วยเราปรับปรุงพันธุ์พืชที่ทนทานยิ่งขึ้น" },
        keyVocab: { word: "tougher crops", th: "พืชที่ทนทานยิ่งขึ้น", note: "บทความพูดถึงพืช 'ทนทาน' ต่อความร้อน แต่ไม่เคยพูดเรื่อง 'ใช้น้ำน้อยลง' เลย จึงตอบ NOT GIVEN" }
    },
    31: {
        questionPhrase: { en: "plants grow faster in sunlight than in shade", th: "พืชเติบโตเร็วในแสงแดดมากกว่าในที่ร่ม" },
        passagePhrase: { en: "sunlight slowing down growth; in shade enabling it to grow faster", th: "แสงแดดทำให้โตช้าลง ส่วนในที่ร่มทำให้โตเร็วขึ้น" },
        keyVocab: { word: "slowing down growth", th: "ทำให้การเติบโตช้าลง", contrastA: "sunlight . saeng-daet ทำให้โตช้า", contrastB: "shade . thi-rom ทำให้โตเร็ว", note: "ในแสงแดดพืชโต 'ช้าลง' แต่ในที่ร่มโต 'เร็วขึ้น' กลับด้านกับคำถาม จึงตอบ FALSE" }
    },
    32: {
        questionPhrase: { en: "change state at the same speed day and night", th: "เปลี่ยนสถานะด้วยความเร็วเท่ากันทั้งกลางวันและกลางคืน" },
        passagePhrase: { en: "At night it's a different story; molecules gradually change", th: "ตอนกลางคืนเป็นคนละเรื่อง โมเลกุลค่อยๆ เปลี่ยนสถานะ" },
        keyVocab: { word: "a different story", th: "เป็นคนละเรื่อง/ต่างออกไป", contrastA: "day . klang-wan เปลี่ยนเร็วมาก", contrastB: "night . klang-khuen ค่อยๆ เปลี่ยน", note: "กลางวันเปลี่ยน 'เร็วมาก' แต่กลางคืน 'ค่อยๆ' เปลี่ยน ความเร็วไม่เท่ากัน จึงตอบ FALSE" }
    },
    33: {
        questionPhrase: { en: "specialists who can make use of the findings", th: "ผู้เชี่ยวชาญที่นำผลการวิจัยไปใช้ประโยชน์ได้" },
        passagePhrase: { en: "collaborators who work on more applied aspects of plant biology", th: "ผู้ร่วมงานที่ทำงานด้านการประยุกต์ของชีววิทยาพืช" },
        keyVocab: { word: "outstanding collaborators", th: "ผู้ร่วมงานที่ยอดเยี่ยม", note: "'collaborators who work on applied aspects' = ผู้เชี่ยวชาญที่นำงานไปใช้ ทำให้ section H เป็นคำตอบ" }
    },
    34: {
        questionPhrase: { en: "a potential benefit of the research findings", th: "ประโยชน์ที่อาจเกิดขึ้นจากผลการวิจัย" },
        passagePhrase: { en: "has the potential to accelerate the breeding of resilient crops", th: "มีศักยภาพที่จะเร่งการปรับปรุงพันธุ์พืชที่ทนทาน" },
        keyVocab: { word: "potential to accelerate", th: "มีศักยภาพที่จะเร่ง/ผลักดัน", note: "'potential to accelerate breeding' = ประโยชน์ที่อาจเกิดขึ้น ตรงกับ section D" }
    },
    35: {
        questionPhrase: { en: "scientific support for a traditional saying", th: "หลักฐานทางวิทยาศาสตร์ที่รองรับคำพังเพยโบราณ" },
        passagePhrase: { en: "provides the science behind a well-known rhyme", th: "ให้คำอธิบายทางวิทยาศาสตร์เบื้องหลังกลอนที่รู้จักกันดี" },
        keyVocab: { word: "science behind a well-known rhyme", th: "วิทยาศาสตร์เบื้องหลังบทกลอนที่รู้จักกันดี", note: "'rhyme' = traditional saying และ 'science behind' = scientific support ทำให้ section G เป็นคำตอบ" }
    },
    36: {
        questionPhrase: { en: "people traditionally making plans based on plant behaviour", th: "ผู้คนสมัยก่อนวางแผนโดยอาศัยพฤติกรรมของพืช" },
        passagePhrase: { en: "humans have long used to predict weather and harvest times", th: "มนุษย์ใช้มานานเพื่อทำนายอากาศและเวลาเก็บเกี่ยว" },
        keyVocab: { word: "predict harvest times", th: "ทำนายเวลาเก็บเกี่ยว", note: "'predict harvest times' = การวางแผนล่วงหน้า และต้นไม้ผลิดอก = plant behaviour ทำให้ section C เป็นคำตอบ" }
    },
    37: {
        questionPhrase: { en: "where the research has been reported", th: "ที่ที่งานวิจัยได้รับการเผยแพร่" },
        passagePhrase: { en: "the new findings, published in the journal Science", th: "ผลการค้นพบใหม่ ตีพิมพ์ในวารสาร Science" },
        keyVocab: { word: "published in the journal Science", th: "ตีพิมพ์ในวารสาร Science", note: "'published in the journal' = ที่ที่งานวิจัยถูกรายงาน ทำให้ section A เป็นคำตอบ" }
    },
    38: {
        questionPhrase: { en: "daffodils flower early in response to ___ weather", th: "ดอกแดฟโฟดิลออกดอกเร็วเพราะอากาศแบบ ___" },
        passagePhrase: { en: "can flower months in advance during a warm winter", th: "ออกดอกล่วงหน้าหลายเดือนในช่วงฤดูหนาวที่อบอุ่น" },
        keyVocab: { word: "warm winter", th: "ฤดูหนาวที่อบอุ่น", note: "'flower months in advance' = ออกดอกเร็ว เกิดขึ้นช่วง 'warm winter' จึงเติมช่องว่างว่า warm (winter)" }
    },
    39: {
        questionPhrase: { en: "ash before oak, weather in ___ will be wet", th: "ถ้าแอชผลิใบก่อนโอ๊ก อากาศใน ___ จะมีฝน" },
        passagePhrase: { en: "a colder summer is likely to be a rain-soaked one", th: "ฤดูร้อนที่หนาวเย็นกว่ามักจะมีฝนชุก" },
        keyVocab: { word: "rain-soaked summer", th: "ฤดูร้อนที่ฝนชุก", note: "'rain-soaked' = wet และเกิดในช่วง 'summer' จึงเติมคำตอบว่า summer" }
    },
    40: {
        questionPhrase: { en: "research carried out using a particular species of ___", th: "งานวิจัยทำโดยใช้พืชสายพันธุ์ ___" },
        passagePhrase: { en: "using a mustard plant called Arabidopsis", th: "ใช้พืชตระกูลมัสตาร์ดที่ชื่อ Arabidopsis" },
        keyVocab: { word: "mustard plant", th: "พืชตระกูลมัสตาร์ด", note: "'using a mustard plant called Arabidopsis' ระบุชนิดพืชที่ใช้วิจัย จึงตอบ mustard plant(s)" }
    },
  },
  "Cambridge 16 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "superiority of AI projections over those by humans", th: "การพยากรณ์ของ AI เหนือกว่าที่มนุษย์ทำได้" },
        passagePhrase: { en: "AI is almost always better at forecasting than we are", th: "AI พยากรณ์ได้ดีกว่าเราเกือบทุกครั้ง" },
        keyVocab: { word: "better at forecasting", th: "พยากรณ์ได้ดีกว่า", note: "คำว่า 'better at forecasting' ในเนื้อเรื่อง = 'superiority of AI projections' ในหัวข้อ iii จึงตอบ iii" }
    },
    28: {
        questionPhrase: { en: "widespread distrust of an AI innovation", th: "ความไม่ไว้ใจอย่างกว้างขวางต่อนวัตกรรม AI ตัวหนึ่ง" },
        passagePhrase: { en: "caused even more suspicion and disbelief, doctors ignore AI", th: "ทำให้เกิดความสงสัยและไม่เชื่อมากขึ้น หมอจึงเมินคำแนะนำ AI" },
        keyVocab: { word: "suspicion and disbelief", th: "ความสงสัยและความไม่เชื่อ", note: "Section B เล่าเรื่อง Watson ที่หมอ 'suspicion and disbelief' = 'distrust' ของ AI innovation จึงตอบ vi" }
    },
    29: {
        questionPhrase: { en: "why we trust human judgement more than AI", th: "ทำไมเราเชื่อการตัดสินของมนุษย์มากกว่า AI" },
        passagePhrase: { en: "Trust in other people based on understanding how others think", th: "ความไว้ใจคนอื่นมาจากการเข้าใจวิธีคิดของเขา" },
        keyVocab: { word: "trust in other people", th: "ความไว้ใจในตัวคนอื่น", contrastA: "human . มนุษย์", contrastB: "AI . ปัญญาประดิษฐ์", note: "Section C เทียบความไว้ใจ 'other people' กับ AI ที่ยังใหม่ ตรงกับ 'faith in human judgement than in AI' จึงตอบ ii" }
    },
    30: {
        questionPhrase: { en: "an increasing divergence of attitudes towards AI", th: "ทัศนคติต่อ AI ที่แตกต่างกันมากขึ้นเรื่อยๆ" },
        passagePhrase: { en: "a society split between those who benefit and those who reject", th: "สังคมแบ่งเป็นพวกได้ประโยชน์กับพวกปฏิเสธ AI" },
        keyVocab: { word: "society split", th: "สังคมที่แตกแยก", note: "'split between those who benefit and reject' = 'divergence of attitudes' ที่เพิ่มขึ้น จึงตอบ i" }
    },
    31: {
        questionPhrase: { en: "encouraging openness about how AI functions", th: "ส่งเสริมความโปร่งใสเรื่องการทำงานของ AI" },
        passagePhrase: { en: "reveal more about the algorithms which AI uses", th: "เปิดเผยข้อมูลอัลกอริทึมที่ AI ใช้มากขึ้น" },
        keyVocab: { word: "reveal more about the algorithms", th: "เปิดเผยอัลกอริทึมมากขึ้น", note: "'reveal more about the algorithms' = 'openness about how AI functions' จึงตอบ vii" }
    },
    32: {
        questionPhrase: { en: "advantages of involving users in AI processes", th: "ข้อดีของการให้ผู้ใช้มีส่วนร่วมในกระบวนการ AI" },
        passagePhrase: { en: "allowing people some control over AI decision-making", th: "ให้คนมีอำนาจควบคุมการตัดสินใจของ AI บ้าง" },
        keyVocab: { word: "control over AI decision-making", th: "การควบคุมการตัดสินใจของ AI", note: "'allowing people control' = 'involving users' และ 'improve trust' = 'advantages' จึงตอบ v" }
    },
    33: {
        questionPhrase: { en: "highlighting the existence of a problem", th: "ชี้ให้เห็นว่ามีปัญหาอยู่" },
        passagePhrase: { en: "we still seem to deeply lack confidence in AI predictions", th: "เรายังขาดความเชื่อมั่นในการพยากรณ์ของ AI อย่างลึกซึ้ง" },
        keyVocab: { word: "lack confidence", th: "ขาดความเชื่อมั่น", note: "ผู้เขียนชี้ว่า 'lack confidence in AI' คือปัญหาที่มีอยู่ ยังไม่เสนอทางแก้ จึงตอบ C (highlighting a problem)" }
    },
    34: {
        questionPhrase: { en: "complexity makes them feel at a disadvantage", th: "ความซับซ้อนทำให้รู้สึกเสียเปรียบ/ควบคุมไม่ได้" },
        passagePhrase: { en: "interacting with something we don't understand causes anxiety, losing control", th: "การมีปฏิสัมพันธ์กับสิ่งที่ไม่เข้าใจทำให้กังวลและรู้สึกสูญเสียการควบคุม" },
        keyVocab: { word: "losing control", th: "สูญเสียการควบคุม", note: "AI ที่ 'too difficult to comprehend' ทำให้รู้สึก 'losing control' = 'at a disadvantage' จึงตอบ B" }
    },
    35: {
        questionPhrase: { en: "media devotes excessive attention to AI", th: "สื่อให้ความสนใจ AI มากเกินไป" },
        passagePhrase: { en: "AI failures receive a disproportionate amount of media attention", th: "ความล้มเหลวของ AI ได้รับความสนใจจากสื่อมากเกินสัดส่วน" },
        keyVocab: { word: "disproportionate amount of media attention", th: "ความสนใจจากสื่อที่มากเกินสัดส่วน", note: "'disproportionate amount of attention' = 'excessive amount of attention' จึงตอบ B" }
    },
    36: {
        questionPhrase: { en: "sci-fi films make people change their opinions", th: "หนัง sci-fi ทำให้คนเปลี่ยนความคิดเห็น" },
        passagePhrase: { en: "optimists became more extreme, sceptics became even more guarded", th: "คนมองโลกในแง่ดียิ่งคลั่งไคล้ คนกังขายิ่งระแวง" },
        keyVocab: { word: "more extreme / more guarded", th: "สุดโต่งขึ้น / ระวังตัวมากขึ้น", note: "หนังทำให้ทัศนคติเดิม 'polarised' (เข้มข้นขึ้น) ไม่ใช่ 'change' (เปลี่ยน) จึงขัดแย้ง ตอบ NO" }
    },
    37: {
        questionPhrase: { en: "portrayals of AI likely to become more positive", th: "ภาพลักษณ์ AI ในสื่อจะเป็นบวกมากขึ้น" },
        passagePhrase: { en: "AI is represented more and more in media and entertainment", th: "AI ถูกนำเสนอในสื่อและความบันเทิงมากขึ้นเรื่อยๆ" },
        keyVocab: { word: "represented more and more", th: "ถูกนำเสนอมากขึ้นเรื่อยๆ", note: "เนื้อเรื่องบอกแค่ปริมาณ 'more and more' ไม่พูดว่า 'more positive' จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "rejecting AI may negatively affect many lives", th: "การปฏิเสธ AI อาจส่งผลเสียต่อชีวิตคนจำนวนมาก" },
        passagePhrase: { en: "refusing AI could place a large group at a serious disadvantage", th: "การปฏิเสธ AI อาจทำให้คนกลุ่มใหญ่เสียเปรียบอย่างหนัก" },
        keyVocab: { word: "serious disadvantage", th: "เสียเปรียบอย่างร้ายแรง", note: "'refusing AI...serious disadvantage' = 'rejection...negative effect' ตรงกัน จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "familiarity with AI has little impact on attitudes", th: "ความคุ้นเคยกับ AI แทบไม่มีผลต่อทัศนคติ" },
        passagePhrase: { en: "previous experience with AI can significantly improve opinions", th: "ประสบการณ์กับ AI ช่วยปรับความคิดเห็นได้อย่างมีนัยสำคัญ" },
        keyVocab: { word: "significantly improve", th: "ปรับปรุงอย่างมีนัยสำคัญ", contrastA: "significant impact . มีผลมาก", contrastB: "very little impact . แทบไม่มีผล", note: "เนื้อเรื่องบอก 'significantly improve' ขัดกับ 'very little impact' จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "modifiable AI more likely to gain consumer approval", th: "AI ที่ผู้ใช้แก้ไขได้มีแนวโน้มได้รับการยอมรับมากกว่า" },
        passagePhrase: { en: "allowed to modify an algorithm, felt more satisfied, more likely to use", th: "เมื่อให้แก้อัลกอริทึมได้ คนพอใจมากขึ้นและอยากใช้มากขึ้น" },
        keyVocab: { word: "freedom to slightly modify", th: "อิสระที่จะปรับแก้เล็กน้อย", note: "'modify...more satisfied...more likely to use' = 'modifiable...gain approval' ตรงกัน จึงตอบ YES" }
    },
  },
  "Cambridge 17 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "formed a ... with the Scots", th: "ตกลงร่วมมือกับฝ่ายสกอต" },
        passagePhrase: { en: "did a deal with the Scots", th: "ทำข้อตกลงกับฝ่ายสกอต" },
        keyVocab: { word: "strategic alliance", th: "การเป็นพันธมิตรเชิงยุทธศาสตร์", note: "\"did a deal with the Scots\" คือการจับมือเป็นพันธมิตรกัน จึงตรงกับตัวเลือก H strategic alliance" }
    },
    28: {
        questionPhrase: { en: "abandoned an important ... held by his father", th: "ละทิ้งสิ่งสำคัญที่พ่อยึดถือ" },
        passagePhrase: { en: "sacrificed one of the very principles his father had died for", th: "ยอมสละหลักการที่พ่อยอมตายเพื่อมัน" },
        keyVocab: { word: "religious conviction", th: "ความเชื่อทางศาสนาที่ยึดมั่น", note: "การยอมรับ Presbyterianism เป็นศาสนาประจำชาติคือการทิ้งหลักความเชื่อทางศาสนาของพ่อ จึงตอบ J religious conviction" }
    },
    29: {
        questionPhrase: { en: "battle led to a ... for the Parliamentarians", th: "การรบจบลงด้วยผลดีต่อฝ่ายรัฐสภา" },
        passagePhrase: { en: "his resounding defeat at the Battle of Worcester", th: "ความพ่ายแพ้อย่างยับเยินของชาร์ลส์ที่วูสเตอร์" },
        keyVocab: { word: "decisive victory", th: "ชัยชนะเด็ดขาด", contrastA: "defeat . ความพ่ายแพ้ (มุมของชาร์ลส์)", contrastB: "victory . ชัยชนะ (มุมของฝ่ายรัฐสภา)", note: "ความพ่ายแพ้ยับเยินของชาร์ลส์ = ชัยชนะเด็ดขาดของฝ่ายรัฐสภา จึงตอบ F decisive victory" }
    },
    30: {
        questionPhrase: { en: "A ... was offered for Charles's capture", th: "มีสิ่งตอบแทนสำหรับการจับตัวชาร์ลส์" },
        passagePhrase: { en: "a huge sum offered for his capture", th: "มีเงินก้อนโตตั้งไว้เป็นรางวัลนำจับ" },
        keyVocab: { word: "large reward", th: "รางวัลก้อนใหญ่", note: "\"a huge sum offered for his capture\" คือเงินรางวัลนำจับจำนวนมาก จึงตอบ B large reward" }
    },
    31: {
        questionPhrase: { en: "reach the ... of continental Europe", th: "ไปถึงที่ปลอดภัยในยุโรปภาคพื้นทวีป" },
        passagePhrase: { en: "seeking refuge in France", th: "ไปลี้ภัยในฝรั่งเศส" },
        keyVocab: { word: "relative safety", th: "ความปลอดภัยพอสมควร", note: "การ \"seeking refuge\" (ลี้ภัย) ในฝรั่งเศสคือการหนีไปยังที่ปลอดภัย จึงตอบ D relative safety" }
    },
    32: {
        questionPhrase: { en: "chose Pepys because he considered him trustworthy", th: "เลือกเพพีสเพราะคิดว่าเขาน่าไว้ใจ" },
        passagePhrase: { en: "requested a meeting with the writer and diarist Samuel Pepys", th: "ขอพบนักเขียนและผู้บันทึกประจำวันซามูเอล เพพีส" },
        keyVocab: { word: "trustworthy", th: "น่าเชื่อถือ ไว้ใจได้", note: "ผู้เขียนเล่าเพียงว่าชาร์ลส์ขอให้เพพีสจดเรื่องไว้ แต่ไม่ได้ระบุ 'เหตุผล' ว่าเพราะไว้ใจ จึงตอบ NOT GIVEN" }
    },
    33: {
        questionPhrase: { en: "recollection of the escape lacked sufficient detail", th: "ความทรงจำการหนีของเขาขาดรายละเอียด" },
        passagePhrase: { en: "related to him in great detail his personal recollections", th: "เล่าความทรงจำของตนอย่างละเอียดยิบ" },
        keyVocab: { word: "in great detail", th: "อย่างละเอียดมาก", contrastA: "great detail . ละเอียดมาก (ในเรื่อง)", contrastB: "lacked detail . ขาดรายละเอียด (คำถาม)", note: "เรื่องบอกว่าเล่า \"in great detail\" ซึ่งตรงข้ามกับคำถามที่ว่าขาดรายละเอียด จึงตอบ NO" }
    },
    34: {
        questionPhrase: { en: "planned his escape before the battle", th: "วางแผนหนีไว้ก่อนการรบ" },
        passagePhrase: { en: "After the battle was so absolutely lost ... I began to think of the best way of saving myself", th: "หลังแพ้ราบคาบแล้ว ผมจึงเริ่มคิดหาทางเอาตัวรอด" },
        keyVocab: { word: "After the battle ... I began to think", th: "หลังการรบ ผมจึงเริ่มคิด", contrastA: "after the battle . หลังการรบ (ในเรื่อง)", contrastB: "before the battle . ก่อนการรบ (คำถาม)", note: "ชาร์ลส์เริ่มคิดหาทางรอด 'หลัง' แพ้ ไม่ใช่วางแผนไว้ก่อน จึงขัดกับคำถาม ตอบ NO" }
    },
    35: {
        questionPhrase: { en: "inclusion of Charles's account is a positive aspect", th: "การใส่คำเล่าของชาร์ลส์เป็นข้อดีของหนังสือ" },
        passagePhrase: { en: "One of the joys ... its use of Charles II's own narrative", th: "หนึ่งในความน่าอ่านคือการใช้คำเล่าของชาร์ลส์เอง" },
        keyVocab: { word: "one of the joys", th: "หนึ่งในจุดที่น่าชื่นชม", note: "ผู้เขียนชมว่าการใช้คำเล่าของชาร์ลส์เป็น \"one of the joys\" ซึ่งเป็นแง่บวก จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "circumstances leading to Charles II's escape", th: "เหตุการณ์ที่นำไปสู่การหลบหนีของชาร์ลส์" },
        passagePhrase: { en: "the story of the hunt for King Charles II ... after his ... defeat", th: "เรื่องการตามล่าชาร์ลส์หลังความพ่ายแพ้" },
        keyVocab: { word: "account of the circumstances", th: "การเล่าเหตุการณ์แวดล้อม", note: "ย่อหน้าแรกปูภูมิหลังการพ่ายแพ้และการถูกตามล่าก่อนหนี จึงตอบ B (เล่าเหตุการณ์ที่นำไปสู่การหนี)" }
    },
    37: {
        questionPhrase: { en: "how the events of the six weeks are brought to life", th: "เหตุการณ์หกสัปดาห์ถูกเล่าให้เห็นภาพมีชีวิต" },
        passagePhrase: { en: "provides delicious details ... how close the reader gets to the action", th: "ให้รายละเอียดน่าติดตาม ทำให้ผู้อ่านใกล้ชิดเหตุการณ์" },
        keyVocab: { word: "brought to life", th: "ทำให้มีชีวิตชีวา เห็นภาพ", note: "ตัวอย่างพฤติกรรม (ตัดผม ย้อมผิว ซ่อนบนต้นโอ๊ก) ใช้แสดงว่าเรื่องถูกเล่าให้เห็นภาพ จึงตอบ C" }
    },
    38: {
        questionPhrase: { en: "chose to celebrate what was essentially a defeat", th: "เลือกเฉลิมฉลองสิ่งที่จริงๆแล้วคือความพ่ายแพ้" },
        passagePhrase: { en: "marking the lowest point in their life so enthusiastically", th: "เฉลิมฉลองช่วงตกต่ำที่สุดของชีวิตอย่างกระตือรือร้น" },
        keyVocab: { word: "lowest point ... enthusiastically", th: "จุดตกต่ำที่สุดอย่างกระตือรือร้น", contrastA: "lowest point/defeat . จุดตกต่ำ ความพ่ายแพ้", contrastB: "memorialise/celebrate . รำลึกเฉลิมฉลอง", note: "ชาร์ลส์รักเรื่องนี้และสร้างอนุสรณ์เฉลิมฉลองทั้งที่มันคือความพ่ายแพ้ จึงตอบ A" }
    },
    39: {
        questionPhrase: { en: "takes an unbiased approach to the subject", th: "วางตัวเป็นกลางต่อเรื่องที่เขียน" },
        passagePhrase: { en: "even-handed sympathy for both the fugitive king and the ... regime", th: "เห็นใจอย่างเป็นธรรมทั้งฝ่ายกษัตริย์และฝ่ายตามล่า" },
        keyVocab: { word: "even-handed", th: "ยุติธรรม เป็นกลาง ไม่เอนเอียง", note: "\"even-handed sympathy for both\" = วางตัวเป็นกลางไม่ลำเอียง ตรงกับ unbiased จึงตอบ B" }
    },
    40: {
        questionPhrase: { en: "whether his experiences had a lasting influence", th: "ประสบการณ์นั้นส่งผลต่อเขาในระยะยาวหรือไม่" },
        passagePhrase: { en: "Would Charles II have been a different king had these six weeks never happened?", th: "ถ้าหกสัปดาห์นี้ไม่เกิด ชาร์ลส์จะเป็นกษัตริย์ที่ต่างไปไหม" },
        keyVocab: { word: "have affected him in some way", th: "คงส่งผลต่อเขาในทางใดทางหนึ่ง", note: "จุดที่หนังสือ \"ไม่เข้าเป้า\" คือไม่ได้วิเคราะห์ว่าประสบการณ์หนีส่งผลถาวรต่อตัวชาร์ลส์ไหม จึงตอบ D" }
    },
  },
  "Cambridge 17 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "outline a common assumption", th: "อธิบายความเชื่อทั่วไปที่คนส่วนใหญ่ยึดถือ" },
        passagePhrase: { en: "is popularly believed to result from the sheer genius", th: "เป็นที่เชื่อกันโดยทั่วไปว่าเกิดจากอัจฉริยภาพล้วน ๆ" },
        keyVocab: { word: "popularly believed", th: "เป็นที่เชื่อกันโดยทั่วไป", note: "วลี 'popularly believed' = 'common assumption' (ความเชื่อทั่วไป) ย่อหน้าแรกเพียงวางความเชื่อนี้ไว้ ยังไม่โต้แย้ง จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "criticising an opinion", th: "วิจารณ์/โต้แย้งความคิดเห็นหนึ่ง" },
        passagePhrase: { en: "it largely misrepresents the real nature of scientific discovery", th: "มันบิดเบือนธรรมชาติที่แท้จริงของการค้นพบทางวิทยาศาสตร์เป็นส่วนใหญ่" },
        keyVocab: { word: "misrepresents", th: "บิดเบือน/นำเสนอผิด", note: "'misrepresents' บวก 'However, we believe' แสดงการคัดค้านความเชื่อเรื่อง insight จึงเป็นการ criticising an opinion ตอบ A" }
    },
    29: {
        questionPhrase: { en: "an exception to a general rule", th: "ข้อยกเว้นจากกฎทั่วไป" },
        passagePhrase: { en: "Setting aside such greats as Darwin and Einstein", th: "เว้น/ยกออกไปเฉพาะคนยิ่งใหญ่อย่างดาร์วินและไอน์สไตน์" },
        keyVocab: { word: "setting aside", th: "ยกเว้น/กันออกไปต่างหาก", note: "'setting aside' ดาร์วินกับไอน์สไตน์ออกจากกฎ trial-and-error แสดงว่าทั้งสองเป็นข้อยกเว้นของกฎทั่วไป จึงตอบ A" }
    },
    30: {
        questionPhrase: { en: "laid the foundations for someone else's breakthrough", th: "ปูทางให้เกิดความก้าวหน้าครั้งใหญ่ของคนอื่น" },
        passagePhrase: { en: "Bohr jumped off from this interesting idea to conceive his now-famous model", th: "บอร์ต่อยอดจากแนวคิดนี้จนสร้างแบบจำลองอะตอมที่โด่งดัง" },
        keyVocab: { word: "jumped off from", th: "ต่อยอด/เริ่มต่อจาก", note: "ไอเดียของนิโคลสันถูกบอร์ 'jumped off from' = ปูทาง (laid the foundations) ให้บอร์ค้นพบครั้งใหญ่ จึงตอบ C" }
    },
    31: {
        questionPhrase: { en: "the simple reason why it was invented", th: "เหตุผลง่าย ๆ ว่าทำไมมันจึงถูกคิดค้น" },
        passagePhrase: { en: "a leg injury... left him unable to fully bend his left knee", th: "อาการบาดเจ็บที่ขาทำให้เขางอเข่าซ้ายได้ไม่เต็มที่" },
        keyVocab: { word: "happened to coincide", th: "บังเอิญพอดีกับ", note: "ท่านี้เกิดเพราะบาดเจ็บแล้ว 'just happened to coincide' กับการเลี้ยวที่ดีขึ้น เหตุผลที่เกิดจึงเรียบง่ายไม่ได้วางแผน ตอบ A" }
    },
    32: {
        questionPhrase: { en: "calling them geniuses helps explain how minds create", th: "การเรียกพวกเขาว่าอัจฉริยะช่วยอธิบายว่าจิตใจสร้างไอเดียอย่างไร" },
        passagePhrase: { en: "These notions merely label rather than explain", th: "แนวคิดเหล่านี้เพียงแค่ติดป้าย ไม่ได้อธิบาย" },
        keyVocab: { word: "label rather than explain", th: "ติดป้ายเฉย ๆ ไม่ได้อธิบาย", contrastA: "label . ติดป้าย", contrastB: "explain . อธิบาย", note: "ผู้เขียนบอกว่าคำว่าอัจฉริยะ 'label rather than explain' ขัดกับข้อความที่ว่ามันช่วยเข้าใจกระบวนการ จึงตอบ NO" }
    },
    33: {
        questionPhrase: { en: "psychologists were seeking a scientific reason for creativity then", th: "นักจิตวิทยากำลังหาเหตุผลทางวิทยาศาสตร์ของความคิดสร้างสรรค์ในตอนนั้น" },
        passagePhrase: { en: "The Law of Effect was advanced by Edward Thorndike in 1898", th: "กฎแห่งผลถูกเสนอโดยเอ็ดเวิร์ด ธอร์นไดก์ในปี 1898" },
        keyVocab: { word: "no mention of motive", th: "ไม่มีการกล่าวถึงแรงจูงใจ", note: "เนื้อเรื่องบอกแค่ปีและตัวกฎ แต่ไม่เคยบอกว่านักจิตวิทยา 'กำลังหา' เหตุผลของความสร้างสรรค์ ข้อมูลนี้ไม่มี จึงตอบ NOT GIVEN" }
    },
    34: {
        questionPhrase: { en: "no planning is involved in organisms' behaviour", th: "ไม่มีการวางแผนในพฤติกรรมของสิ่งมีชีวิต" },
        passagePhrase: { en: "an entirely mechanical process of variation and selection, without any end objective", th: "กระบวนการเชิงกลล้วน ๆ ของการแปรผันและการคัดเลือก โดยไม่มีเป้าหมายปลายทาง" },
        keyVocab: { word: "without any end objective", th: "ไม่มีเป้าหมายปลายทาง", note: "'without any end objective in sight' = ไม่มีการวางแผน (no planning) ตรงกับข้อความ จึงตอบ YES" }
    },
    35: {
        questionPhrase: { en: "sets out clear explanations about sources of new ideas", th: "ให้คำอธิบายชัดเจนถึงที่มาของไอเดียใหม่" },
        passagePhrase: { en: "the provenance of the raw material... is not as clearly known", th: "ที่มาของวัตถุดิบที่กฎนี้ทำงานด้วยยังไม่เป็นที่รู้ชัด" },
        keyVocab: { word: "not as clearly known", th: "ยังไม่เป็นที่รู้ชัด", contrastA: "clear explanations . อธิบายชัดเจน", contrastB: "not clearly known . ไม่เป็นที่รู้ชัด", note: "ผู้เขียนบอกที่มาของไอเดีย 'not as clearly known' ขัดกับ 'clear explanations' ในโจทย์ จึงตอบ NO" }
    },
    36: {
        questionPhrase: { en: "many scientists are now turning away from genius", th: "นักวิทยาศาสตร์จำนวนมากกำลังเลิกเชื่อแนวคิดอัจฉริยะ" },
        passagePhrase: { en: "The time seems right for abandoning the naive notions", th: "ดูเหมือนถึงเวลาที่ควรละทิ้งแนวคิดไร้เดียงสาเหล่านี้" },
        keyVocab: { word: "The time seems right for abandoning", th: "ดูเหมือนถึงเวลาที่ควรละทิ้ง", note: "ผู้เขียนพูดแค่ว่า 'ควรถึงเวลา' ละทิ้ง ไม่ได้บอกว่านักวิทยาศาสตร์จำนวนมาก 'กำลัง' ละทิ้งอยู่จริง ข้อมูลนี้ไม่มี จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "a single great mind has sudden inspiration", th: "จิตใจอัจฉริยะเดี่ยวเกิดแรงบันดาลใจขึ้นมาทันที" },
        passagePhrase: { en: "as if ideas spontaneously pop into someone's head - fully formed", th: "ราวกับไอเดียผุดขึ้นในหัวเองทันที สมบูรณ์พร้อม" },
        keyVocab: { word: "inspiration", th: "แรงบันดาลใจ", note: "'sudden 37' ในสรุป = ความเชื่อเรื่อง insight ที่ไอเดีย 'pop into head' ทันที ตรงกับคำว่า inspiration จึงตอบ F" }
    },
    38: {
        questionPhrase: { en: "the process involves mistakes, like Nicholson's theory", th: "กระบวนการนี้เกี่ยวข้องกับความผิดพลาด เช่นทฤษฎีของนิโคลสัน" },
        passagePhrase: { en: "innovation is more a process of trial and error", th: "นวัตกรรมคือกระบวนการลองผิดลองถูกมากกว่า" },
        keyVocab: { word: "trial and error", th: "การลองผิดลองถูก", note: "'trial and error' โยงกับ error = mistakes และนิโคลสันก็คิดผิดเรื่อง proto-elements จึงตอบ D (mistakes)" }
    },
    39: {
        questionPhrase: { en: "an element of luck, like the Post-It coincidence", th: "องค์ประกอบของโชค เช่นความบังเอิญของโพสต์อิท" },
        passagePhrase: { en: "fresh advances can arise from... pure serendipity - a happy accident", th: "ความก้าวหน้าใหม่อาจเกิดจากความบังเอิญล้วน ๆ อุบัติเหตุที่น่ายินดี" },
        keyVocab: { word: "serendipity / happy accident", th: "ความบังเอิญที่นำมาซึ่งสิ่งดี", note: "'serendipity - a happy accident' กับ 'coincidence' ของโพสต์อิท = คำว่า luck (โชค) จึงตอบ E" }
    },
    40: {
        questionPhrase: { en: "there may be no clear goal involved", th: "อาจไม่มีเป้าหมายชัดเจนเข้ามาเกี่ยวข้อง" },
        passagePhrase: { en: "a mechanical process of variation and selection, without any end objective", th: "กระบวนการเชิงกลของการแปรผันและคัดเลือก โดยปราศจากเป้าหมายปลายทาง" },
        keyVocab: { word: "without any end objective", th: "ปราศจากเป้าหมายปลายทาง", note: "'no clear 40' ในสรุปสะท้อน 'without any end objective' = ไม่มี goals จึงตอบ B (goals)" }
    },
  },
  "Cambridge 17 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "covers a range of factors affecting New York", th: "ครอบคลุมปัจจัยหลายอย่างที่ส่งผลต่อการพัฒนานิวยอร์ก" },
        passagePhrase: { en: "combines geology, history, economics, and a lot of data", th: "ผสมผสานธรณีวิทยา ประวัติศาสตร์ เศรษฐศาสตร์ และข้อมูลจำนวนมาก" },
        keyVocab: { word: "combines (geology, history, economics...)", th: "ผสมผสาน/รวมหลายศาสตร์เข้าด้วยกัน", note: "การบอกว่าหนังสือ 'combines' หลายสาขา = 'a range of factors' จึงตอบ D ไม่ใช่ B (research papers พูดถึงเฉพาะ part สอง)" }
    },
    28: {
        questionPhrase: { en: "indicates a potential problem with Barr's analysis", th: "ชี้ให้เห็นปัญหาที่อาจมีในการวิเคราะห์ของบาร์" },
        passagePhrase: { en: "it is not obvious why slum clearance would be limiting", th: "ไม่ชัดเจนว่าทำไมการรื้อสลัมถึงเป็นข้อจำกัด" },
        keyVocab: { word: "not obvious why", th: "ไม่ชัดเจนว่าทำไม (แสดงความข้องใจ)", note: "ผู้เขียนตั้งข้อสงสัยกับเหตุผลของบาร์ = ชี้ปัญหาในการวิเคราะห์ จึงตอบ B" }
    },
    29: {
        questionPhrase: { en: "too specialised for most readers", th: "เฉพาะทางเกินไปสำหรับผู้อ่านทั่วไป" },
        passagePhrase: { en: "more technical than would be preferred by a general audience", th: "เชิงเทคนิคมากกว่าที่ผู้อ่านทั่วไปจะชอบ" },
        keyVocab: { word: "more technical than... a general audience", th: "เชิงเทคนิคเกินกว่าผู้อ่านทั่วไป", note: "'technical for a general audience' = 'too specialised for most readers' จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "some parts have limited appeal to certain people", th: "บางส่วนน่าสนใจสำหรับคนบางกลุ่มเท่านั้น" },
        passagePhrase: { en: "may serve as a distraction to readers primarily interested in New York", th: "อาจรบกวนผู้อ่านที่สนใจเรื่องนิวยอร์กเป็นหลัก" },
        keyVocab: { word: "a distraction to readers primarily interested in New York", th: "สิ่งที่ทำให้ผู้อ่านบางกลุ่มเขว/ไม่อิน", note: "ทฤษฎีเศรษฐศาสตร์เมือง 'รบกวน' ผู้อ่านบางกลุ่มแต่ 'well-suited for undergraduates' = ดึงดูดเฉพาะบางคน จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "the nature of the research into the topic", th: "ลักษณะของงานวิจัยในหัวข้อนั้น" },
        passagePhrase: { en: "The data work that went into these estimations is particularly impressive", th: "งานด้านข้อมูลที่ใช้ในการประมาณการนั้นน่าประทับใจเป็นพิเศษ" },
        keyVocab: { word: "data work... particularly impressive", th: "งานวิเคราะห์ข้อมูลที่น่าประทับใจ", note: "'data work' = 'the nature of the research' สิ่งที่ประทับใจคือตัวงานวิจัย/ข้อมูล จึงตอบ C ไม่ใช่ช่วงเวลาหรือคำแนะนำ" }
    },
    32: {
        questionPhrase: { en: "view of New York from the air lacks interest", th: "ภาพนิวยอร์กจากมุมสูงนั้นน่าเบื่อ ไม่น่าสนใจ" },
        passagePhrase: { en: "a fascinating account of how the New York landscape in 1609 might have looked", th: "เรื่องเล่าที่น่าทึ่งว่าภูมิทัศน์นิวยอร์กปี 1609 อาจเป็นอย่างไร" },
        keyVocab: { word: "fascinating", th: "น่าทึ่ง/น่าหลงใหล", contrastA: "fascinating . น่าทึ่ง", contrastB: "lacks interest . น่าเบื่อ", note: "ข้อความบอก 'fascinating' ตรงข้ามกับ 'lacks interest' จึงตอบ NO" }
    },
    33: {
        questionPhrase: { en: "prepare the reader well for material yet to come", th: "ปูพื้นให้ผู้อ่านพร้อมสำหรับเนื้อหาที่จะตามมา" },
        passagePhrase: { en: "set the stage for the economic analysis that comes later", th: "ปูทางสำหรับการวิเคราะห์เศรษฐศาสตร์ที่มาในภายหลัง" },
        keyVocab: { word: "set the stage for... comes later", th: "ปูพื้น/เตรียมความพร้อมสำหรับเนื้อหาที่มาทีหลัง", note: "'set the stage for... later' = 'prepare the reader for material yet to come' จึงตอบ YES" }
    },
    34: {
        questionPhrase: { en: "biggest problem was a lack of amenities", th: "ปัญหาใหญ่ที่สุดคือการขาดสิ่งอำนวยความสะดวก" },
        passagePhrase: { en: "analyzes their locations in terms of the amenities available in the area", th: "วิเคราะห์ทำเลของย่านเหล่านั้นจากสิ่งอำนวยความสะดวกที่มีในพื้นที่" },
        keyVocab: { word: "amenities available", th: "สิ่งอำนวยความสะดวกที่มีอยู่", note: "ข้อความพูดถึง 'amenities' แค่เป็นเกณฑ์วิเคราะห์ทำเล ไม่ได้บอกว่ามันคือ 'ปัญหาใหญ่ที่สุด' จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "neighbourhoods concentrated around the harbour", th: "ย่านผู้อพยพกระจุกตัวอยู่รอบท่าเรือ" },
        passagePhrase: { en: "between the industries located on the waterfront and the wealthy neighborhoods", th: "อยู่ระหว่างอุตสาหกรรมริมน้ำกับย่านคนรวย" },
        keyVocab: { word: "between the industries on the waterfront and the wealthy neighborhoods", th: "อยู่ระหว่างเขตอุตสาหกรรมริมน้ำกับย่านคนรวย", contrastA: "around the harbour . รอบท่าเรือ", contrastB: "between waterfront and wealthy area . อยู่ตรงกลางระหว่างริมน้ำกับย่านคนรวย", note: "ย่านอยู่ 'ตรงกลาง' บนที่ดินด้อยค่า ไม่ได้กระจุกที่ท่าเรือ จึงตอบ NO" }
    },
    36: {
        questionPhrase: { en: "skyscrapers are absent from", th: "ตึกระฟ้าไม่ถูกสร้างในพื้นที่ใด" },
        passagePhrase: { en: "skyscrapers not being built between the two urban centers", th: "ตึกระฟ้าไม่ถูกสร้างระหว่างศูนย์กลางเมืองสองแห่ง" },
        keyVocab: { word: "between the two urban centers (Downtown and Midtown)", th: "ระหว่างศูนย์กลางเมืองสองแห่ง = พื้นที่เฉพาะ", note: "ช่องว่างต้องการ 'พื้นที่เฉพาะ' = specific areas (H) ตรงกับ 'between Downtown and Midtown' จึงตอบ H" }
    },
    37: {
        questionPhrase: { en: "this cannot be regarded as", th: "สิ่งนี้ไม่อาจถือว่าเป็น" },
        passagePhrase: { en: "these costs were neither prohibitively high", th: "ต้นทุนเหล่านี้ไม่ได้สูงจนแบกไม่ไหว" },
        keyVocab: { word: "prohibitively high", th: "แพงสูงจนทำไม่ได้", note: "'prohibitively high' = 'excessive expense' (D) ค่าฐานรากไม่ได้แพงเกินไป จึงตอบ D" }
    },
    38: {
        questionPhrase: { en: "how ___ are made possible by caissons", th: "สิ่งใดทำได้เพราะใช้ caisson" },
        passagePhrase: { en: "caissons, which enable workers to dig down for considerable distances", th: "caisson ซึ่งช่วยให้คนงานขุดลึกลงไปได้ในระยะมาก" },
        keyVocab: { word: "dig down for considerable distances", th: "ขุดลึกลงไปในระยะที่มาก", note: "'dig down considerable distances' = 'deep excavations' (B) คือสิ่งที่ caisson ทำให้เป็นไปได้ จึงตอบ B" }
    },
    39: {
        questionPhrase: { en: "he also discusses their ___", th: "เขายังพูดถึง ___ ของมันด้วย" },
        passagePhrase: { en: "discusses not only how caissons work, but also the dangers involved", th: "พูดถึงไม่เพียงวิธีทำงานของ caisson แต่ยังรวมถึงอันตรายที่เกี่ยวข้อง" },
        keyVocab: { word: "the dangers involved", th: "อันตรายที่เกี่ยวข้อง", note: "'dangers involved' = 'associated risks' (F) จึงตอบ F" }
    },
    40: {
        questionPhrase: { en: "discusses their associated risks", th: "พูดถึงความเสี่ยงที่เกี่ยวข้องกับมัน" },
        passagePhrase: { en: "discusses... also the dangers involved", th: "พูดถึง...อันตรายที่เกี่ยวข้องด้วย" },
        keyVocab: { word: "dangers involved", th: "อันตราย/ความเสี่ยงที่เกี่ยวข้อง", note: "ช่อง 39 (their ___) เติมด้วย 'associated risks' (F) เพราะข้อความระบุ 'the dangers involved' จึงตอบ F" }
    },
  },
  "Cambridge 17 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "earlier examples of blindfold chess", th: "ตัวอย่างหมากรุกปิดตาในอดีต" },
        passagePhrase: { en: "displays of the feat go back centuries", th: "การแสดงความสามารถนี้มีมาหลายศตวรรษ" },
        keyVocab: { word: "go back centuries", th: "ย้อนไปหลายร้อยปี / มีมานานแล้ว", note: "วลี 'go back centuries' และตัวอย่างปี 1947, ศตวรรษที่ 13 คือ 'earlier examples' ในอดีต จึงตอบย่อหน้า D" }
    },
    28: {
        questionPhrase: { en: "what blindfold chess involves", th: "การเล่นหมากรุกปิดตาเกี่ยวข้องกับอะไร" },
        passagePhrase: { en: "the nature of the game is to run through possible moves in the mind", th: "ธรรมชาติของเกมคือการไล่ดูการเดินที่เป็นไปได้ในใจ" },
        keyVocab: { word: "the nature of the game", th: "ลักษณะ/ธรรมชาติของเกม", note: "'the nature of the game' = คำอธิบายว่าการเล่นปิดตา 'involves' อะไร จึงตอบย่อหน้า E" }
    },
    29: {
        questionPhrase: { en: "his skill is limited to chess", th: "ความสามารถพิเศษของเขาจำกัดอยู่แค่หมากรุก" },
        passagePhrase: { en: "nothing other than playing chess he seems to be supremely gifted at", th: "ไม่มีอะไรนอกจากหมากรุกที่เขาเก่งเป็นพิเศษ" },
        keyVocab: { word: "nothing other than playing chess", th: "ไม่มีอะไรนอกจากหมากรุก", note: "'nothing other than chess' = ความเก่ง 'limited to chess' พอดี (อยู่ในย่อหน้า F ตอน Rissman พูด) จึงตอบ F" }
    },
    30: {
        questionPhrase: { en: "why scientists are interested in his skill", th: "ทำไมนักวิทยาศาสตร์สนใจความสามารถของเขา" },
        passagePhrase: { en: "his prowess has drawn interest from beyond the chess-playing community", th: "ความสามารถของเขาดึงดูดความสนใจจากนอกวงการหมากรุก" },
        keyVocab: { word: "drawn interest", th: "ดึงดูดความสนใจ", note: "'drawn interest from beyond the chess community' = นักวิทยาศาสตร์สนใจ (interest of scientists) จึงตอบย่อหน้า B" }
    },
    31: {
        questionPhrase: { en: "an outline of Gareyev's priorities", th: "สิ่งที่ Gareyev ให้ความสำคัญที่สุด" },
        passagePhrase: { en: "the most important part for me is the one thing I can fully dedicate myself to", th: "สิ่งสำคัญที่สุดสำหรับเขาคือสิ่งเดียวที่เขาทุ่มเทได้เต็มที่" },
        keyVocab: { word: "the most important part", th: "ส่วนที่สำคัญที่สุด", note: "'most important... dedicate myself to' = 'priorities' (สิ่งที่ให้ความสำคัญ) อยู่ในย่อหน้า H จึงตอบ H" }
    },
    32: {
        questionPhrase: { en: "why the last part of a game may be difficult", th: "ทำไมช่วงท้ายเกมจึงยาก" },
        passagePhrase: { en: "the ends of games are taxing too, as exhaustion sets in", th: "ช่วงจบเกมก็หนักเช่นกัน เพราะความเหนื่อยล้าเริ่มเข้ามา" },
        keyVocab: { word: "exhaustion sets in", th: "ความเหนื่อยล้าเริ่มเกิดขึ้น", note: "'ends of games are taxing... exhaustion' = 'last part difficult' (ช่วงท้ายยากเพราะล้า) อยู่ในย่อหน้า E จึงตอบ E" }
    },
    33: {
        questionPhrase: { en: "all the participants will be blindfolded", th: "ผู้เข้าร่วมทุกคนจะถูกปิดตา" },
        passagePhrase: { en: "his challengers will play as normal, Gareyev himself will be blindfolded", th: "คู่แข่งเล่นตามปกติ มีแต่ Gareyev เท่านั้นที่ถูกปิดตา" },
        keyVocab: { word: "Gareyev himself will be blindfolded", th: "มีแต่ Gareyev เองที่ถูกปิดตา", contrastA: "all . ทุกคน", contrastB: "himself only . เพียงตัวเขาเอง", note: "ข้อความบอกว่าเฉพาะ Gareyev ถูกปิดตา ส่วนคู่แข่งเล่นปกติ ขัดกับคำว่า 'all' จึงตอบ FALSE" }
    },
    34: {
        questionPhrase: { en: "has won competitions in BASE jumping", th: "เคยชนะการแข่งขัน BASE jumping" },
        passagePhrase: { en: "he gets his kicks from the adventure sport of BASE jumping", th: "เขาได้ความตื่นเต้นจากกีฬาผาดโผน BASE jumping" },
        keyVocab: { word: "gets his kicks from", th: "ได้ความสนุก/ความตื่นเต้นจาก", note: "ข้อความบอกแค่ว่าเขาชอบเล่น BASE jumping ไม่มีคำว่าชนะการแข่งขัน (won competitions) จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "UCLA is the first university to research this", th: "UCLA เป็นมหาวิทยาลัยแรกที่วิจัยเรื่องนี้" },
        passagePhrase: { en: "researchers at UCLA called him in for tests", th: "นักวิจัยที่ UCLA เรียกเขามาทดสอบ" },
        keyVocab: { word: "first", th: "เป็นแห่งแรก", note: "ข้อความบอกว่า UCLA ทำการทดสอบ แต่ไม่เคยบอกว่าเป็น 'first' (แห่งแรก) จึงตอบ NOT GIVEN" }
    },
    36: {
        questionPhrase: { en: "good players likely able to play blindfold", th: "ผู้เล่นเก่งน่าจะเล่นปิดตาได้" },
        passagePhrase: { en: "not a far reach for most accomplished players", th: "ไม่ใช่เรื่องยากเกินไปสำหรับผู้เล่นฝีมือดีส่วนใหญ่" },
        keyVocab: { word: "not a far reach", th: "ไม่ใช่เรื่องไกลเกินเอื้อม / ทำได้ไม่ยาก", note: "'not a far reach for accomplished players' = ผู้เล่นเก่ง (good players) ทำได้ไม่ยาก ตรงกับ statement จึงตอบ TRUE" }
    },
    37: {
        questionPhrase: { en: "started by testing Gareyev's ___", th: "เริ่มจากทดสอบ ___ ของ Gareyev" },
        passagePhrase: { en: "Jesse Rissman, who runs a memory lab at UCLA", th: "Jesse Rissman ผู้ดูแลห้องแล็บความจำที่ UCLA" },
        keyVocab: { word: "memory", th: "ความจำ", note: "การทดสอบเป็น 'standard memory tests' (ทดสอบความจำ) จึงเติมคำตอบ memory" }
    },
    38: {
        questionPhrase: { en: "recall a string of ___ forwards and backwards", th: "ท่องจำชุด ___ ทั้งไปข้างหน้าและถอยหลัง" },
        passagePhrase: { en: "how many numbers a person can repeat, forwards and backwards", th: "คนหนึ่งท่องตัวเลขซ้ำได้กี่ตัว ทั้งไปและถอยหลัง" },
        keyVocab: { word: "numbers", th: "ตัวเลข", note: "'a string of ___ in order and reverse order' ตรงกับ 'repeat numbers forwards and backwards' จึงเติม numbers" }
    },
    39: {
        questionPhrase: { en: "an unusual amount of ___ within brain areas", th: "ปริมาณ ___ ที่ผิดปกติในสมอง" },
        passagePhrase: { en: "greater than average communication between parts of his brain", th: "การสื่อสารระหว่างส่วนต่าง ๆ ของสมองมากกว่าค่าเฉลี่ย" },
        keyVocab: { word: "communication", th: "การสื่อสาร (ระหว่างส่วนของสมอง)", note: "'unusual amount of ___' = 'greater than average communication' ในสมอง จึงเติม communication" }
    },
    40: {
        questionPhrase: { en: "brain parts that deal with ___ input", th: "ส่วนสมองที่จัดการข้อมูลแบบ ___" },
        passagePhrase: { en: "Gareyev's visual network is more highly connected", th: "เครือข่ายการมองเห็นของ Gareyev เชื่อมต่อกันมากกว่าปกติ" },
        keyVocab: { word: "visual", th: "เกี่ยวกับการมองเห็น", note: "'___ input' = ข้อมูลภาพ ตรงกับ 'visual network' ที่ประมวลผลภาพ จึงเติม visual" }
    },
  },
  "Cambridge 18 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "cooperation to try and minimise risk", th: "ความร่วมมือเพื่อลดความเสี่ยง" },
        passagePhrase: { en: "players in space are collaborating to avoid a shared threat", th: "ฝ่ายต่าง ๆ ในอวกาศกำลังร่วมมือกันเพื่อเลี่ยงภัยคุกคามร่วม" },
        keyVocab: { word: "collaborating", th: "ร่วมมือกัน", note: "cooperation = collaborating และ minimise risk = avoid a shared threat จึงตอบ section C" }
    },
    28: {
        questionPhrase: { en: "an explanation of a person's aims", th: "การอธิบายเป้าหมายของบุคคล" },
        passagePhrase: { en: "I want to make space a place that is safe to operate", th: "ผมอยากทำให้อวกาศเป็นที่ที่ปฏิบัติงานได้อย่างปลอดภัย" },
        keyVocab: { word: "aims", th: "เป้าหมาย", note: "aims คือ 'I want to...' ที่ Jah บอกความตั้งใจของตัวเอง จึงตอบ section F" }
    },
    29: {
        questionPhrase: { en: "a major collision that occurred in space", th: "การชนกันครั้งใหญ่ที่เกิดขึ้นในอวกาศ" },
        passagePhrase: { en: "an Iridium satellite smashed into an inactive Russian satellite", th: "ดาวเทียม Iridium พุ่งชนดาวเทียมรัสเซียที่หยุดทำงาน" },
        keyVocab: { word: "collision", th: "การชนกัน", note: "collision = smashed into การชนของดาวเทียมสองดวงอยู่ใน section A" }
    },
    30: {
        questionPhrase: { en: "comparison with the efficiency of a transportation system", th: "การเปรียบเทียบกับประสิทธิภาพของระบบขนส่ง" },
        passagePhrase: { en: "Think about a busy day at an airport...planes line up in the sky", th: "ลองนึกถึงวันที่สนามบินยุ่ง เครื่องบินเรียงแถวบนฟ้า" },
        keyVocab: { word: "transportation system", th: "ระบบขนส่ง", note: "transportation system = airport/planes การเทียบกับสนามบินอยู่ใน section E" }
    },
    31: {
        questionPhrase: { en: "efforts to classify space junk", th: "ความพยายามจัดหมวดหมู่ขยะอวกาศ" },
        passagePhrase: { en: "developing taxonomies of space", th: "พัฒนาการจัดประเภทของอวกาศ" },
        keyVocab: { word: "classify", th: "จัดหมวดหมู่", note: "classify = developing taxonomies การจัดประเภทวัตถุอยู่ใน section B" }
    },
    32: {
        questionPhrase: { en: "how the ___ of space can be achieved", th: "ทำอย่างไรให้บรรลุ ___ ของอวกาศ" },
        passagePhrase: { en: "developed guidelines on space sustainability", th: "จัดทำแนวทางว่าด้วยความยั่งยืนของอวกาศ" },
        keyVocab: { word: "sustainability", th: "ความยั่งยืน", note: "คำเดียวจาก passage ที่เติมช่องคือ sustainability ตรงกับ 'guidelines on space sustainability'" }
    },
    33: {
        questionPhrase: { en: "any unused ___ or pressurised material", th: "เชื้อเพลิงที่ยังไม่ได้ใช้ หรือวัสดุแรงดันสูง" },
        passagePhrase: { en: "venting pressurised materials or leftover fuel", th: "ปล่อยวัสดุแรงดันสูงหรือเชื้อเพลิงที่เหลือ" },
        keyVocab: { word: "fuel", th: "เชื้อเพลิง", note: "unused = leftover คำที่คู่กับ pressurised material คือ fuel จึงตอบ fuel" }
    },
    34: {
        questionPhrase: { en: "that could cause ___", th: "ที่อาจก่อให้เกิด ___" },
        passagePhrase: { en: "leftover fuel that might lead to explosions", th: "เชื้อเพลิงที่เหลืออาจนำไปสู่การระเบิด" },
        keyVocab: { word: "explosions", th: "การระเบิด", note: "could cause = might lead to สิ่งที่ตามมาคือ explosions จึงตอบ explosions" }
    },
    35: {
        questionPhrase: { en: "the operators that become ___", th: "ผู้ให้บริการที่กลายเป็น ___" },
        passagePhrase: { en: "What happens to those that fail or go bankrupt?", th: "จะเกิดอะไรกับรายที่ล้มเหลวหรือล้มละลาย" },
        keyVocab: { word: "bankrupt", th: "ล้มละลาย", note: "operators ที่ไม่ยอมจ่ายเงินเก็บกวาดดาวเทียมคือผู้ที่ go bankrupt จึงตอบ bankrupt" }
    },
    36: {
        questionPhrase: { en: "knowing exact location would prevent danger", th: "การรู้ตำแหน่งที่แน่นอนจะช่วยป้องกันอันตราย" },
        passagePhrase: { en: "If you knew precisely where everything was, you would almost never have a problem", th: "ถ้ารู้แน่ชัดว่าทุกอย่างอยู่ที่ไหน แทบไม่มีปัญหาเลย" },
        keyVocab: { word: "precisely", th: "อย่างแม่นยำ", note: "exact location = precisely where everything was คำพูดนี้เป็นของ Marlon Sorge จึงตอบ C" }
    },
    37: {
        questionPhrase: { en: "space available to everyone, preserved for the future", th: "อวกาศที่ทุกคนเข้าถึงได้และรักษาไว้เพื่ออนาคต" },
        passagePhrase: { en: "free and useful for generations to come", th: "เปิดกว้างและมีประโยชน์ต่อคนรุ่นต่อไป" },
        keyVocab: { word: "generations to come", th: "คนรุ่นต่อ ๆ ไป", note: "preserved for the future = for generations to come คำพูดนี้เป็นของ Moriba Jah จึงตอบ D" }
    },
    38: {
        questionPhrase: { en: "a recommendation is widely ignored", th: "ข้อแนะนำถูกเพิกเฉยอย่างกว้างขวาง" },
        passagePhrase: { en: "only about half of all missions have abided by this 25-year goal", th: "มีเพียงราวครึ่งของภารกิจที่ทำตามเป้าหมาย 25 ปีนี้" },
        keyVocab: { word: "abided by", th: "ปฏิบัติตาม", contrastA: "ignored . เพิกเฉย", contrastB: "abided by . ปฏิบัติตาม", note: "widely ignored = only half abided by (อีกครึ่งไม่ทำตาม) Holger Krag เป็นผู้พูด จึงตอบ B" }
    },
    39: {
        questionPhrase: { en: "conflicting information about satellite locations", th: "ข้อมูลตำแหน่งดาวเทียมที่ขัดแย้งกัน" },
        passagePhrase: { en: "US and Russian sources contain two completely different orbits", th: "แหล่งข้อมูลสหรัฐและรัสเซียให้วงโคจรที่ต่างกันสิ้นเชิง" },
        keyVocab: { word: "conflicting", th: "ขัดแย้งกัน", note: "conflicting information = two completely different orbits ตัวอย่างนี้มาจาก Jah จึงตอบ D" }
    },
    40: {
        questionPhrase: { en: "risk we cannot undo the damage in space", th: "ความเสี่ยงที่จะแก้ความเสียหายในอวกาศไม่ได้" },
        passagePhrase: { en: "If we go on like this, we will reach a point of no return", th: "ถ้าเป็นแบบนี้ต่อไป เราจะถึงจุดที่ย้อนกลับไม่ได้" },
        keyVocab: { word: "point of no return", th: "จุดที่ย้อนกลับไม่ได้", note: "cannot undo the damage = a point of no return คำพูดนี้เป็นของ Carolin Frueh จึงตอบ A" }
    },
  },
  "Cambridge 18 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "first referred to him as a genius 500 years ago", th: "เริ่มเรียกเขาว่าอัจฉริยะเมื่อ 500 ปีก่อน" },
        passagePhrase: { en: "the word 'genius' is universally associated with his name", th: "คำว่าอัจฉริยะถูกเชื่อมโยงกับชื่อของเขาอย่างกว้างขวาง" },
        keyVocab: { word: "first referred to ... 500 years ago", th: "เริ่มเรียกครั้งแรกเมื่อ 500 ปีก่อน", note: "เนื้อเรื่องบอกแค่ว่าเขาถูกเรียกว่าอัจฉริยะ และผ่านมา 500 ปีตั้งแต่เขาเสียชีวิต แต่ไม่เคยบอกว่า 'เริ่มเรียกครั้งแรก' เมื่อใด จึงตอบ NOT GIVEN" }
    },
    28: {
        questionPhrase: { en: "climate crisis predicted to cause more deaths than the plague", th: "วิกฤตสภาพอากาศคาดว่าจะทำให้ตายมากกว่าโรคระบาด" },
        passagePhrase: { en: "plague caused 200 million deaths; climate crisis predicted to cause death", th: "โรคระบาดทำให้ตาย 200 ล้านคน วิกฤตสภาพอากาศคาดว่าจะทำให้เกิดความตาย" },
        keyVocab: { word: "more deaths than", th: "ตายมากกว่า", note: "เนื้อเรื่องให้ตัวเลขโรคระบาด 200 ล้าน แต่ไม่เคยให้ตัวเลขหรือเปรียบเทียบว่าวิกฤตสภาพอากาศจะตายมากกว่า จึงตอบ NOT GIVEN" }
    },
    29: {
        questionPhrase: { en: "challenges today can be compared to those of earlier times", th: "ปัญหาในปัจจุบันเทียบได้กับปัญหาในอดีต" },
        passagePhrase: { en: "Then, as now, radical solutions were called for to safeguard humanity", th: "ทั้งในอดีตและปัจจุบัน ต้องการทางออกที่รุนแรงเพื่อปกป้องมนุษยชาติ" },
        keyVocab: { word: "Then, as now", th: "ทั้งในอดีตและปัจจุบัน", note: "วลี 'Then, as now' สื่อว่าสถานการณ์ในอดีตและปัจจุบันคล้ายกัน ตรงกับ 'compared to earlier times' จึงตอบ TRUE" }
    },
    30: {
        questionPhrase: { en: "'ideal city' was constructed in the 15th century", th: "เมืองในอุดมคติถูกสร้างขึ้นในศตวรรษที่ 15" },
        passagePhrase: { en: "the 'ideal city' project would remain unfulfilled", th: "โครงการเมืองในอุดมคติยังไม่เคยถูกทำให้สำเร็จ" },
        keyVocab: { word: "remain unfulfilled", th: "ไม่เคยสำเร็จ / ไม่ได้สร้างจริง", contrastA: "constructed . สร้างขึ้น", contrastB: "unfulfilled . ไม่ได้ทำให้สำเร็จ", note: "'unfulfilled' (ไม่สำเร็จ) ขัดแย้งกับ 'constructed' (สร้างแล้ว) โดยตรง เมืองนี้ไม่เคยถูกสร้าง จึงตอบ FALSE" }
    },
    31: {
        questionPhrase: { en: "poor town planning is a major contributor to climate change", th: "การวางผังเมืองที่แย่เป็นตัวการสำคัญของการเปลี่ยนแปลงสภาพอากาศ" },
        passagePhrase: { en: "unsustainable urban models are a key cause of global climate change", th: "รูปแบบเมืองที่ไม่ยั่งยืนเป็นสาเหตุสำคัญของการเปลี่ยนแปลงสภาพอากาศ" },
        keyVocab: { word: "unsustainable urban models = poor town planning", th: "รูปแบบเมืองที่ไม่ยั่งยืน = การวางผังเมืองที่แย่", note: "'unsustainable urban models' พาราเฟรสเป็น 'poor town planning' และ 'key cause' = 'major contributor' จึงตอบ TRUE" }
    },
    32: {
        questionPhrase: { en: "local people fought against the changes to Pienza and Ferrara", th: "ชาวบ้านต่อต้านการเปลี่ยนแปลงเมือง Pienza และ Ferrara" },
        passagePhrase: { en: "Renaissance men pushed forward urban projects: reconfiguration of Pienza, expansion of Ferrara", th: "คนยุคเรอเนสซองส์ผลักดันโครงการเมือง ปรับ Pienza และขยาย Ferrara" },
        keyVocab: { word: "fought against / local people's reaction", th: "ต่อต้าน / ปฏิกิริยาของชาวบ้าน", note: "เนื้อเรื่องเล่าแค่ว่ามีการปรับและขยายสองเมืองนี้ แต่ไม่เคยพูดถึงว่าชาวบ้านต่อต้านหรือไม่ จึงตอบ NOT GIVEN" }
    },
    33: {
        questionPhrase: { en: "kept a neat, organised record of his designs", th: "เก็บบันทึกงานออกแบบอย่างเป็นระเบียบ" },
        passagePhrase: { en: "his disordered way of working with notes and sketches", th: "วิธีการทำงานกับโน้ตและภาพร่างที่ไม่เป็นระเบียบของเขา" },
        keyVocab: { word: "disordered", th: "ไม่เป็นระเบียบ / ยุ่งเหยิง", contrastA: "neat, organised . เป็นระเบียบ", contrastB: "disordered . ไม่เป็นระเบียบ", note: "'disordered' ตรงข้ามกับ 'neat, organised' โดยตรง เขาทำงานแบบไม่เป็นระเบียบ จึงตอบ FALSE" }
    },
    34: {
        questionPhrase: { en: "provide better _____ for trade", th: "ให้การ _____ ที่ดีขึ้นสำหรับการค้า" },
        passagePhrase: { en: "designed the city for the easy transport of goods", th: "ออกแบบเมืองเพื่อการขนส่งสินค้าที่สะดวก" },
        keyVocab: { word: "transport", th: "การขนส่ง", note: "'trade' ในโจทย์ = 'goods' ในเนื้อเรื่อง และคำที่คู่กับการเคลื่อนย้ายสินค้าคือ 'transport' จึงเป็นคำตอบ" }
    },
    35: {
        questionPhrase: { en: "tower blocks today, such as _____ on the exterior", th: "ตึกสูงปัจจุบัน เช่น _____ ที่ด้านนอกอาคาร" },
        passagePhrase: { en: "built on several levels, linked with vertical outdoor staircases", th: "สร้างหลายชั้น เชื่อมด้วยบันไดกลางแจ้งแนวตั้ง" },
        keyVocab: { word: "staircases", th: "บันได", note: "'on the exterior' = 'outdoor' และ 'tower blocks' = 'high-rise buildings' สิ่งที่อยู่ภายนอกอาคารคือ 'staircases' จึงเป็นคำตอบ" }
    },
    36: {
        questionPhrase: { en: "his expertise in _____ shown in plans for artificial canals", th: "ความเชี่ยวชาญด้าน _____ ปรากฏในแผนคลองเทียม" },
        passagePhrase: { en: "fusion of architecture and engineering ... created artificial canals", th: "การหลอมรวมสถาปัตยกรรมและวิศวกรรม ... สร้างคลองเทียม" },
        keyVocab: { word: "engineering", th: "วิศวกรรม", contrastA: "architecture . สถาปัตยกรรม", contrastB: "engineering . วิศวกรรม", note: "โจทย์บอก 'wasn't only an architect' จึงเป็นอีกด้านคือ 'engineering' ซึ่งคู่กับงานคลองและไฮดรอลิก จึงเป็นคำตอบ" }
    },
    37: {
        questionPhrase: { en: "cities in Italy today follows this _____", th: "เมืองในอิตาลีปัจจุบันยึดตาม _____ นี้" },
        passagePhrase: { en: "a rule still followed in many contemporary cities across Italy", th: "กฎที่ยังถูกใช้ในหลายเมืองในอิตาลีปัจจุบัน" },
        keyVocab: { word: "rule", th: "กฎ / หลักเกณฑ์", note: "'follows this ___' จับคู่ตรงกับ 'a rule still followed' คำตอบคือ 'rule'" }
    },
    38: {
        questionPhrase: { en: "some cities from _____ times", th: "เมืองบางเมืองจากยุค _____" },
        passagePhrase: { en: "some of these features existed in Roman cities", th: "ลักษณะบางอย่างเหล่านี้มีอยู่ในเมืองโรมัน" },
        keyVocab: { word: "Roman", th: "โรมัน", note: "'cities from ___ times' ตรงกับ 'Roman cities' คำตอบคือ 'Roman'" }
    },
    39: {
        questionPhrase: { en: "_____ is a city redesigned in the 19th century", th: "_____ คือเมืองที่ถูกออกแบบใหม่ในศตวรรษที่ 19" },
        passagePhrase: { en: "Haussmann's renovation of Paris ... between 1853 and 1870", th: "การปรับปรุงปารีสของโอสมานน์ ... ระหว่างปี 1853 ถึง 1870" },
        keyVocab: { word: "Paris", th: "ปารีส", note: "'redesigned in the 19th century' = 'renovation ... 1853 and 1870' เมืองที่ถูกปรับคือ 'Paris' จึงเป็นคำตอบ" }
    },
    40: {
        questionPhrase: { en: "building _____ no longer the best approach", th: "การสร้างเมืองแบบ _____ ไม่ใช่แนวทางที่ดีที่สุดอีกต่อไป" },
        passagePhrase: { en: "the compact city, built upwards instead of outwards", th: "เมืองกระชับที่สร้างขึ้นสูงแทนการขยายออกด้านข้าง" },
        keyVocab: { word: "outwards", th: "ออกด้านข้าง / แผ่ขยาย", contrastA: "upwards . ขึ้นสูง", contrastB: "outwards . ออกด้านข้าง", note: "เนื้อเรื่องชอบสร้าง 'upwards instead of outwards' ดังนั้นแบบที่ 'ไม่ดีอีกต่อไป' คือ 'outwards' จึงเป็นคำตอบ" }
    },
  },
  "Cambridge 18 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "how a teacher handles a range of learning needs", th: "ครูรับมือกับความต้องการในการเรียนที่หลากหลายอย่างไร" },
        passagePhrase: { en: "asks the No Fear group to identify key characters; most of the class about character development", th: "ให้กลุ่มอ่อนระบุตัวละครหลัก ส่วนคนเก่งวิเคราะห์พัฒนาการตัวละคร" },
        keyVocab: { word: "range of learning needs", th: "ความต้องการในการเรียนที่ต่างระดับกัน", note: "ฉากนี้แสดงว่าครูคนเดียวมอบงานต่างระดับให้นักเรียนแต่ละกลุ่ม จึงเป็นการ 'รับมือกับความต้องการที่หลากหลาย' ตอบ B" }
    },
    28: {
        questionPhrase: { en: "It has a very broad appeal", th: "มันดึงดูดใจคนวงกว้างมาก" },
        passagePhrase: { en: "intuitively appealing to almost every stakeholder", th: "ดูน่าสนใจโดยสัญชาตญาณสำหรับผู้มีส่วนได้ส่วนเสียแทบทุกคน" },
        keyVocab: { word: "almost every stakeholder", th: "ผู้เกี่ยวข้องแทบทุกฝ่าย", note: "'almost every stakeholder' = 'broad appeal' (ดึงดูดคนวงกว้าง) จึงตอบ A ไม่ใช่ว่าเอื้อเด็กเก่ง" }
    },
    29: {
        questionPhrase: { en: "students not achieving their full potential", th: "นักเรียนไปไม่ถึงศักยภาพสูงสุดของตน" },
        passagePhrase: { en: "The brightest ones will never summit Mount Qomolangma", th: "เด็กที่เก่งที่สุดจะไม่มีวันได้พิชิตยอดเขาเอเวอเรสต์" },
        keyVocab: { word: "never summit", th: "ไม่มีวันถึงยอด", note: "'never summit Mount Qomolangma' เปรียบว่าเด็กเก่งไปไม่ถึงจุดสูงสุด = ไม่ได้ใช้ศักยภาพเต็มที่ ตอบ C" }
    },
    30: {
        questionPhrase: { en: "assistance given to a student in their initial stages of learning", th: "ความช่วยเหลือที่ให้นักเรียนในช่วงเริ่มต้นของการเรียน" },
        passagePhrase: { en: "provide and then gradually remove this 'scaffolding' until they are autonomous", th: "ให้แล้วค่อย ๆ ถอด 'นั่งร้าน' นี้ออกจนนักเรียนเรียนเองได้" },
        keyVocab: { word: "scaffolding", th: "นั่งร้าน (การช่วยเหลือชั่วคราว)", note: "'scaffolding' คือการช่วยที่ให้ก่อนแล้วถอดออกเมื่อนักเรียนทำเองได้ = ความช่วยเหลือช่วงแรก ตอบ C" }
    },
    31: {
        questionPhrase: { en: "streaming leads to higher achievements", th: "การแบ่งสายตามระดับนำไปสู่ผลสัมฤทธิ์ที่สูงขึ้น" },
        passagePhrase: { en: "tracking has minimal effects on learning outcomes", th: "การแบ่งสายมีผลต่อผลการเรียนน้อยมาก" },
        keyVocab: { word: "minimal effects on learning outcomes", th: "แทบไม่มีผลต่อผลการเรียน", note: "ถ้าผลต่อการเรียน 'น้อยมาก' แสดงว่าไม่มีหลักฐานว่าเกิดผลสัมฤทธิ์สูงขึ้น ช่องว่างจึงเติม H (higher achievements)" }
    },
    32: {
        questionPhrase: { en: "students placed in the bottom sets", th: "นักเรียนที่ถูกจัดอยู่ในสายล่างสุด" },
        passagePhrase: { en: "students assigned to the lowest sets", th: "นักเรียนที่ถูกจัดให้อยู่ในชุดต่ำที่สุด" },
        keyVocab: { word: "lowest sets", th: "ชุด/สายต่ำที่สุด", note: "'lowest sets' = 'bottom sets' ตรงกันโดยตรง ช่องว่างเติม D" }
    },
    33: {
        questionPhrase: { en: "a large proportion have disadvantaged backgrounds", th: "ส่วนใหญ่มาจากภูมิหลังที่ด้อยโอกาส" },
        passagePhrase: { en: "higher representation of low socioeconomic class", th: "มีสัดส่วนของชนชั้นเศรษฐกิจสังคมต่ำสูงกว่า" },
        keyVocab: { word: "low socioeconomic class", th: "ชนชั้นเศรษฐกิจสังคมต่ำ", note: "'low socioeconomic class' = 'disadvantaged backgrounds' (ภูมิหลังด้อยโอกาส) ช่องว่างเติม F" }
    },
    34: {
        questionPhrase: { en: "for the brightest pupils, only minimal advantage", th: "สำหรับเด็กเก่งสุด ได้ประโยชน์เพียงเล็กน้อย" },
        passagePhrase: { en: "the small benefit for those lucky clever students in the higher sets", th: "ประโยชน์เล็กน้อยสำหรับเด็กฉลาดโชคดีในสายสูง" },
        keyVocab: { word: "clever students in the higher sets", th: "เด็กฉลาดในสายสูง", note: "'clever students in the higher sets' = 'brightest pupils' ส่วนคำว่า small benefit = minimal advantage ช่องว่างเติม E" }
    },
    35: {
        questionPhrase: { en: "teachers tend to have lower expectations", th: "ครูมักมีความคาดหวังต่ำกว่าเดิม" },
        passagePhrase: { en: "limits what the teacher feels the student is capable of", th: "จำกัดสิ่งที่ครูรู้สึกว่านักเรียนทำได้" },
        keyVocab: { word: "limits what the teacher feels the student is capable of", th: "จำกัดมุมมองครูว่านักเรียนทำได้แค่ไหน", note: "ถ้าครู 'จำกัด' ว่านักเรียนทำได้แค่ไหน ก็คือคาดหวังต่ำลง ช่องว่างเติม B (lower expectations)" }
    },
    36: {
        questionPhrase: { en: "Vygotsky model supports the mixed-ability class", th: "ทฤษฎีไวก็อตสกีสนับสนุนห้องเรียนคละความสามารถ" },
        passagePhrase: { en: "streaming students with similar ZPDs would be an efficient and effective solution", th: "การแบ่งนักเรียนที่มี ZPD ใกล้เคียงกันคือทางออกที่ได้ผล" },
        keyVocab: { word: "streaming ... efficient and effective", th: "การแบ่งสาย...มีประสิทธิภาพ", contrastA: "streaming . การแบ่งสายตามระดับ", contrastB: "mixed-ability . คละความสามารถ", note: "ผู้เขียนบอกว่าโมเดลของไวก็อตสกีกลับสนับสนุน 'การแบ่งสาย' ไม่ใช่ห้องคละ จึงขัดกับข้อความ ตอบ NO" }
    },
    37: {
        questionPhrase: { en: "teachers uncertain about students taking MKO roles", th: "ครูบางคนไม่แน่ใจที่จะให้นักเรียนทำหน้าที่ MKO" },
        passagePhrase: { en: "the value of knowledgeable student peers must not go unrecognised", th: "คุณค่าของเพื่อนนักเรียนที่มีความรู้ต้องไม่ถูกมองข้าม" },
        keyVocab: { word: "must not go unrecognised", th: "ต้องไม่ถูกมองข้าม", note: "ข้อความพูดถึงคุณค่าของเพื่อน MKO แต่ไม่ได้บอกว่าครู 'ไม่แน่ใจ' หรือลังเล จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "rewarding to teach knowledge recently acquired", th: "การสอนความรู้ที่เพิ่งได้มาเป็นเรื่องน่าพอใจ" },
        passagePhrase: { en: "something exciting about passing on skills ... you yourself have just mastered", th: "มีความน่าตื่นเต้นในการถ่ายทอดทักษะที่เพิ่งเชี่ยวชาญ" },
        keyVocab: { word: "exciting about passing on skills just mastered", th: "น่าตื่นเต้นที่ได้ถ่ายทอดสิ่งที่เพิ่งเชี่ยวชาญ", note: "'exciting' / 'pride and zeal' = rewarding และ 'just mastered' = recently acquired จึงตรงกับผู้เขียน ตอบ YES" }
    },
    39: {
        questionPhrase: { en: "priority is highest-achieving students attain their goals", th: "ควรให้ความสำคัญกับเด็กเก่งสุดให้บรรลุเป้าหมาย" },
        passagePhrase: { en: "the many to flourish – not suffer at the expense of a few bright stars", th: "ให้คนส่วนใหญ่เติบโต ไม่ใช่เสียสละเพื่อดาวเด่นไม่กี่คน" },
        keyVocab: { word: "the many ... not a few bright stars", th: "คนส่วนใหญ่ ไม่ใช่ดาวเด่นไม่กี่คน", contrastA: "the many . คนส่วนใหญ่", contrastB: "a few bright stars . เด็กเก่งไม่กี่คน", note: "ผู้เขียนให้ความสำคัญกับคนส่วนใหญ่ ไม่ใช่เด็กเก่งไม่กี่คน จึงขัดกับข้อความ ตอบ NO" }
    },
    40: {
        questionPhrase: { en: "outdoor activities with teachers improve classroom outcomes", th: "กิจกรรมกลางแจ้งกับครูช่วยพัฒนาผลการเรียนในห้อง" },
        passagePhrase: { en: "I go on a hike with my class ... We make it – together", th: "ฉันไปเดินป่ากับนักเรียน...เราทำสำเร็จด้วยกัน" },
        keyVocab: { word: "hike ... We make it together", th: "เดินป่า...เราทำสำเร็จด้วยกัน", note: "ผู้เขียนเล่าเรื่องเดินป่ากับนักเรียน แต่ไม่ได้บอกว่ามันช่วย 'ผลการเรียนในห้องเรียน' จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
  },
  "Cambridge 18 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "widely disputed while he was alive", th: "ถูกโต้แย้งอย่างกว้างขวางตอนที่เขายังมีชีวิตอยู่" },
        passagePhrase: { en: "the focus of an international controversy in his lifetime", th: "เป็นศูนย์กลางของข้อโต้แย้งระดับนานาชาติในช่วงชีวิตของเขา" },
        keyVocab: { word: "controversy", th: "ข้อโต้เถียง / ความขัดแย้งทางความคิด", note: "คำว่า controversy ในเนื้อเรื่องตรงกับ widely disputed ในคำถาม และ in his lifetime = while he was alive จึงตอบ YES" }
    },
    28: {
        questionPhrase: { en: "fixed-continent idea defended in several published works", th: "แนวคิดที่ว่าทวีปอยู่กับที่ถูกปกป้องในงานพิมพ์หลายชิ้น" },
        passagePhrase: { en: "supposing that they remained fixed in place", th: "สมมติว่าทวีปยังคงอยู่กับที่ไม่เคลื่อน" },
        keyVocab: { word: "remained fixed in place", th: "ยังคงอยู่กับที่", note: "เนื้อเรื่องพูดถึงแค่แนวคิดว่าทวีปอยู่กับที่ แต่ไม่เคยบอกว่ามีใคร 'ปกป้อง' แนวคิดนี้ในงานพิมพ์หลายชิ้น ข้อมูลส่วน defended ไม่มี จึงตอบ NOT GIVEN" }
    },
    29: {
        questionPhrase: { en: "relied on evidence from just one area of science", th: "อาศัยหลักฐานจากวิทยาศาสตร์เพียงสาขาเดียว" },
        passagePhrase: { en: "evidence from a large number of sciences including geology, geophysics", th: "หลักฐานจากวิทยาศาสตร์จำนวนมากหลายสาขา" },
        keyVocab: { word: "a large number of sciences", th: "วิทยาศาสตร์หลายสาขา", contrastA: "many . หลายสาขา", contrastB: "just one . เพียงสาขาเดียว", note: "เนื้อเรื่องระบุชัดว่าใช้หลักฐานจากหลายสาขา ซึ่งขัดกับคำถามที่บอกว่าใช้เพียงสาขาเดียว จึงตอบ NO" }
    },
    30: {
        questionPhrase: { en: "similarities are enormous", th: "ความเหมือนระหว่างทฤษฎีทั้งสองมีมากมายมหาศาล" },
        passagePhrase: { en: "Plate tectonics is in many respects quite different from Wegener's proposal", th: "ทฤษฎีแผ่นเปลือกโลกต่างจากแนวคิดของเวเกเนอร์อยู่มากในหลายแง่" },
        keyVocab: { word: "quite different", th: "แตกต่างกันค่อนข้างมาก", contrastA: "different . แตกต่าง", contrastB: "similarities enormous . ความเหมือนมหาศาล", note: "เนื้อเรื่องเน้นว่าทฤษฎีทั้งสอง 'very different' ซึ่งตรงข้ามกับคำถามที่อ้างว่าความเหมือนมีมหาศาล จึงตอบ NO" }
    },
    31: {
        questionPhrase: { en: "interesting aspect of Greene's background research", th: "แง่มุมที่น่าสนใจจากการค้นคว้าของกรีน" },
        passagePhrase: { en: "When I started writing about Wegener's life and work", th: "ตอนที่ฉันเริ่มเขียนเกี่ยวกับชีวิตและงานของเวเกเนอร์" },
        keyVocab: { word: "biographer's perspective", th: "มุมมองของผู้เขียนชีวประวัติ", note: "ผู้เขียน (I) เล่าสิ่งที่น่าสนใจที่เขาพบขณะค้นคว้าเขียนชีวประวัติ จึงโยงกับตัวเลือก I biographer's perspective" }
    },
    32: {
        questionPhrase: { en: "Wegener's interests (spanned several fields)", th: "ความสนใจของเวเกเนอร์ครอบคลุมหลายสาขา" },
        passagePhrase: { en: "trained as an astronomer and pursued a career in atmospheric physics", th: "เรียนมาเป็นนักดาราศาสตร์และทำงานด้านฟิสิกส์บรรยากาศ" },
        keyVocab: { word: "professional interests", th: "ความสนใจเชิงอาชีพ/วิชาชีพ", note: "เวเกเนอร์ทำงานข้ามหลายสาขา (ดาราศาสตร์ ฟิสิกส์บรรยากาศ ธรณีวิทยา) สะท้อนความสนใจเชิงวิชาชีพที่หลากหลาย จึงตอบ F professional interests" }
    },
    33: {
        questionPhrase: { en: "Wegener already had (a degree of fame)", th: "เวเกเนอร์มีชื่อเสียงอยู่ก่อนแล้วในระดับหนึ่ง" },
        passagePhrase: { en: "However, he was not an 'unknown'", th: "อย่างไรก็ตาม เขาไม่ใช่คนไร้ชื่อเสียง" },
        keyVocab: { word: "not an 'unknown'", th: "ไม่ใช่คนที่ไม่มีใครรู้จัก", contrastA: "not unknown . มีคนรู้จักอยู่บ้าง", contrastB: "modest fame . ชื่อเสียงพอประมาณ", note: "วลี not an 'unknown' = มีชื่อเสียงในระดับหนึ่ง ตรงกับตัวเลือก A modest fame" }
    },
    34: {
        questionPhrase: { en: "staying airborne for a period (that broke a record)", th: "อยู่บนอากาศนานจนทำสถิติ" },
        passagePhrase: { en: "set a world record for time aloft in a hot-air balloon: 52 hours", th: "ทำสถิติโลกด้านเวลาลอยอยู่บนบอลลูนลมร้อน 52 ชั่วโมง" },
        keyVocab: { word: "set a world record", th: "ทำสถิติโลก", note: "time aloft 52 hours คือความสำเร็จที่ทำลายสถิติ ตรงกับตัวเลือก C record-breaking achievement" }
    },
    35: {
        questionPhrase: { en: "involvement that gained recognition from scientists", th: "การมีส่วนร่วมที่ทำให้ได้รับการยอมรับจากนักวิทยาศาสตร์" },
        passagePhrase: { en: "a highly publicized and extremely dangerous expedition to Greenland", th: "การสำรวจกรีนแลนด์ที่อันตรายอย่างยิ่งและเป็นข่าวโด่งดัง" },
        keyVocab: { word: "extremely dangerous expedition", th: "การสำรวจที่อันตรายอย่างยิ่ง", contrastA: "dangerous . อันตราย", contrastB: "hazardous . เสี่ยงภัย", note: "dangerous expedition เป็นคำพ้องความหมายกับ hazardous exploration จึงตอบ H" }
    },
    36: {
        questionPhrase: { en: "textbook made him known to a (small group)", th: "ตำราทำให้เขาเป็นที่รู้จักในกลุ่มเล็กๆ" },
        passagePhrase: { en: "made a name for himself amongst a small circle of meteorologists", th: "ทำให้เป็นที่รู้จักในแวดวงเล็กๆ ของนักอุตุนิยมวิทยา" },
        keyVocab: { word: "a small circle", th: "แวดวงเล็กๆ / กลุ่มเล็กๆ", contrastA: "small circle . กลุ่มเล็ก", contrastB: "select group . กลุ่มจำเพาะ", note: "a small circle of meteorologists = select group กลุ่มเล็กเฉพาะทาง จึงตอบ E" }
    },
    37: {
        questionPhrase: { en: "what Greene is doing in the fifth paragraph", th: "กรีนกำลังทำอะไรในย่อหน้าที่ห้า" },
        passagePhrase: { en: "I urge readers to try to experience Wegener's life as he lived it", th: "ฉันขอชวนผู้อ่านให้ลองสัมผัสชีวิตของเวเกเนอร์อย่างที่เขาใช้ชีวิตจริง" },
        keyVocab: { word: "I urge readers", th: "ฉันเชิญชวน/กระตุ้นผู้อ่าน", note: "ผู้เขียนกำลังแนะนำวิธีอ่านหนังสือเล่มนี้ให้แก่ผู้อ่าน (advising/recommending an approach) จึงตอบตัวเลือก B" }
    },
    38: {
        questionPhrase: { en: "what is said about Wegener in the sixth paragraph", th: "มีการกล่าวถึงเวเกเนอร์อย่างไรในย่อหน้าที่หก" },
        passagePhrase: { en: "did not seek to find influence or advance his ideas through professional contacts and politics", th: "ไม่ได้พยายามหาอิทธิพลหรือผลักดันความคิดผ่านสายสัมพันธ์และการเมืองในวงวิชาการ" },
        keyVocab: { word: "did not seek to advance his ideas through contacts", th: "ไม่ได้ใช้เส้นสายผลักดันความคิดของตน", note: "เวเกเนอร์ไม่สนใจสร้างเครือข่ายหรือเล่นการเมืองวิชาการเพื่อดันแนวคิด สะท้อนว่าเขาไม่กระตือรือร้นในด้านนี้ จึงตอบ A" }
    },
    39: {
        questionPhrase: { en: "what Greene says about other famous scientists", th: "กรีนพูดถึงนักวิทยาศาสตร์ดังคนอื่นๆ ว่าอย่างไร" },
        passagePhrase: { en: "The more such material a scientist leaves behind, the better chance a biographer has", th: "ยิ่งนักวิทยาศาสตร์ทิ้งบันทึกไว้มาก ผู้เขียนชีวประวัติยิ่งมีโอกาสเข้าใจได้ดีขึ้น" },
        keyVocab: { word: "the more material ... the better chance a biographer has", th: "ยิ่งมีเอกสารมาก ยิ่งช่วยผู้เขียนชีวประวัติได้มาก", note: "กรีนชี้ว่าบันทึก/จดหมายจำนวนมากของนักวิทยาศาสตร์ดัง ช่วยให้เข้าใจวิธีที่ความคิดของพวกเขาก่อตัว สอดคล้องกับตัวเลือก D research methods (ผ่านการศึกษาบันทึกของพวกเขา)" }
    },
    40: {
        questionPhrase: { en: "Greene's main point in the final paragraph", th: "ใจความหลักของกรีนในย่อหน้าสุดท้าย" },
        passagePhrase: { en: "most of the time our lives 'happen to us'", th: "ส่วนใหญ่ชีวิตของเรา 'เกิดขึ้นกับเรา' มากกว่าที่เราจะกำหนดเอง" },
        keyVocab: { word: "our lives 'happen to us'", th: "ชีวิตเกิดขึ้นกับเราโดยที่เราควบคุมไม่ได้เต็มที่", contrastA: "happen to us . เกิดขึ้นกับเรา (นอกแผน)", contrastB: "planned and intended . วางแผนไว้", note: "ประเด็นหลักคือชีวิตมักไม่เป็นไปตามที่วางแผน เราเพียงเล่าย้อนหลังให้ดูเป็นเรื่องที่ตั้งใจ จึงตอบ C" }
    },
  },
  "Cambridge 19 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "a number of reasons for the spread of misinformation", th: "มีหลายสาเหตุที่ทำให้ข้อมูลผิดแพร่กระจาย" },
        passagePhrase: { en: "both deliberately promoted and accidentally shared", th: "ทั้งจงใจปล่อยออกมาและบังเอิญแชร์ต่อ" },
        keyVocab: { word: "deliberately ... accidentally", th: "อย่างจงใจ ... อย่างบังเอิญ", note: "ผู้เขียนบอกว่าข้อมูลผิดเกิดได้ทั้งแบบจงใจและแบบบังเอิญ และยังยกเหตุผลของการโกหก (เพื่อได้เปรียบ จูงใจคนอื่น ปกป้องความสัมพันธ์) แสดงว่ามีหลายสาเหตุ จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "technology may provide a solution to misinformation", th: "เทคโนโลยีอาจให้ทางแก้ปัญหาข้อมูลผิดได้" },
        passagePhrase: { en: "the means to correct misinformation might be found in those same patterns", th: "วิธีแก้ข้อมูลผิดอาจพบในรูปแบบการสื่อสารแบบเดียวกันนั้น" },
        keyVocab: { word: "means to correct", th: "วิธี/เครื่องมือในการแก้ไข", note: "ผู้เขียนบอกว่า 'the means to correct misinformation' อาจพบในระบบสื่อสารมวลชนเดียวกันที่ทำให้ข้อมูลผิดแพร่ ซึ่งคือ solution จากเทคโนโลยี จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "outlining which issues are significant today", th: "ชี้ให้เห็นประเด็นสำคัญในปัจจุบัน" },
        passagePhrase: { en: "three observations ... warrant the attention of researchers, policy makers", th: "ข้อสังเกตสามข้อที่ควรได้รับความสนใจจากนักวิจัยและผู้กำหนดนโยบาย" },
        keyVocab: { word: "warrant the attention", th: "สมควรได้รับความสนใจ (= สำคัญ)", note: "ย่อหน้าสี่ผู้เขียนวางกรอบข้อสังเกตสามข้อที่ 'warrant the attention' = ประเด็นที่สำคัญในยุคปัจจุบัน จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "regulation fails to prevent misinformation in the media", th: "การกำกับดูแลไม่สามารถกันข้อมูลผิดออกจากสื่อได้" },
        passagePhrase: { en: "do not keep false advertising off the airwaves", th: "ไม่สามารถกันโฆษณาเท็จออกจากการออกอากาศได้" },
        keyVocab: { word: "do not keep ... off", th: "กันออกไปไม่ได้ (= ล้มเหลวในการป้องกัน)", contrastA: "preemptive censoring . การเซ็นเซอร์ก่อนเผยแพร่", contrastB: "post hoc detection . การตรวจจับหลังออกอากาศแล้ว", note: "หน่วยงานอย่าง FDA เน้น 'post hoc detection' ไม่ใช่การกันก่อน และ 'do not keep false advertising off the airwaves' = การกำกับล้มเหลวในการป้องกัน จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "people have frequent exposure to misinformation", th: "ผู้คนพบเจอข้อมูลผิดบ่อยครั้ง" },
        passagePhrase: { en: "it is fairly routine for individuals to come across information that is false", th: "เป็นเรื่องปกติที่คนจะเจอข้อมูลเท็จอยู่เรื่อย ๆ" },
        keyVocab: { word: "fairly routine to come across", th: "เป็นเรื่องปกติที่จะพบเจอ", note: "'fairly routine to come across false information' = พบเจอบ่อย ตรงกับ G frequent exposure จึงตอบ G" }
    },
    32: {
        questionPhrase: { en: "Descartes and Spinoza had different ideas", th: "เดการ์ตและสปิโนซามีความคิดที่แตกต่างกัน" },
        passagePhrase: { en: "conflicting predictions ... how Descartes and Spinoza described human information engagement", th: "คำทำนายที่ขัดแย้งกันว่าเดการ์ตและสปิโนซาอธิบายการรับข้อมูลของมนุษย์อย่างไร" },
        keyVocab: { word: "conflicting predictions", th: "คำทำนายที่ขัดแย้งกัน", note: "'conflicting predictions' ของสองนักปรัชญา = พวกเขามีความคิดต่างกัน ตรงกับ J different ideas จึงตอบ J" }
    },
    33: {
        questionPhrase: { en: "a distinct mental operation is involved", th: "มีกระบวนการทางความคิดที่แยกออกมาเข้ามาเกี่ยวข้อง" },
        passagePhrase: { en: "verify or reject it through a separate cognitive process", th: "ตรวจสอบหรือปฏิเสธมันผ่านกระบวนการคิดที่แยกต่างหาก" },
        keyVocab: { word: "separate cognitive process", th: "กระบวนการรู้คิดที่แยกต่างหาก", note: "'separate cognitive process' = กระบวนการทางสมอง/ความคิดที่แยกออกมา ตรงกับ H mental operation จึงตอบ H" }
    },
    34: {
        questionPhrase: { en: "recent research has provided additional evidence", th: "งานวิจัยล่าสุดได้ให้หลักฐานเพิ่มเติม" },
        passagePhrase: { en: "empirical evidence ... has supported Spinoza's account", th: "หลักฐานเชิงประจักษ์ได้สนับสนุนแนวคิดของสปิโนซา" },
        keyVocab: { word: "empirical evidence ... supported", th: "หลักฐานเชิงประจักษ์ ... สนับสนุน", note: "'empirical evidence supported Spinoza' = หลักฐาน/ข้อพิสูจน์เพิ่มเติมที่หนุนทฤษฎีของเขา ตรงกับ B additional evidence จึงตอบ B" }
    },
    35: {
        questionPhrase: { en: "true even if for an extremely short period", th: "เชื่อว่าจริงแม้เพียงช่วงเวลาสั้นมาก" },
        passagePhrase: { en: "encode all new information as if it were true, even if only momentarily", th: "เข้ารหัสข้อมูลใหม่ทั้งหมดเหมือนว่ามันจริง แม้เพียงชั่วขณะ" },
        keyVocab: { word: "momentarily", th: "เพียงชั่วขณะ/แวบเดียว", note: "'even if only momentarily' = เพียงช่วงเวลาสั้นมาก ตรงกับ E short period จึงตอบ E" }
    },
    36: {
        questionPhrase: { en: "scepticism and encoding are in different locations in the brain", th: "ส่วนความสงสัยและส่วนเข้ารหัสอยู่คนละตำแหน่งในสมอง" },
        passagePhrase: { en: "reside in a different part of the brain than the resources used in perceiving and encoding", th: "อยู่คนละส่วนของสมองกับทรัพยากรที่ใช้รับรู้และเข้ารหัส" },
        keyVocab: { word: "a different part of the brain", th: "ส่วนต่างกันของสมอง", note: "'a different part of the brain' = คนละตำแหน่งในสมอง ตรงกับ C different locations จึงตอบ C" }
    },
    37: {
        questionPhrase: { en: "campaigns fail if people cannot understand them", th: "แคมเปญจะล้มเหลวถ้าคนไม่เข้าใจมัน" },
        passagePhrase: { en: "audiences need to be able to comprehend them ... to be persuasive", th: "ผู้รับสารต้องเข้าใจมันได้จึงจะโน้มน้าวสำเร็จ" },
        keyVocab: { word: "need to comprehend ... to be persuasive", th: "ต้องเข้าใจ ... จึงจะโน้มน้าวได้", note: "ผู้เขียนบอกว่าแคมเปญจะ 'persuasive' ได้ก็ต่อเมื่อผู้ฟัง 'comprehend' มันได้ = ถ้าไม่เข้าใจก็ล้มเหลว ตรงกับข้อความ จึงตอบ YES" }
    },
    38: {
        questionPhrase: { en: "teaching school students about misinformation has been opposed", th: "การสอนนักเรียนเรื่องข้อมูลผิดถูกคัดค้าน" },
        passagePhrase: { en: "the utility of media literacy efforts as early as elementary school", th: "ประโยชน์ของการสอนรู้เท่าทันสื่อตั้งแต่ชั้นประถม" },
        keyVocab: { word: "opposed", th: "ถูกคัดค้าน/ต่อต้าน", note: "ผู้เขียนแค่แนะว่าการสอนรู้เท่าทันสื่อตั้งแต่ประถมมีประโยชน์ แต่ไม่ได้พูดถึงการที่มันถูก 'opposed' เลย ข้อมูลไม่ปรากฏ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "overcome misinformation in a relatively short period", th: "แก้ปัญหาข้อมูลผิดได้ในช่วงเวลาสั้น ๆ" },
        passagePhrase: { en: "coordinated efforts over time, rather than any singular one-time panacea", th: "ต้องอาศัยความร่วมมือต่อเนื่องยาวนาน ไม่ใช่ยาวิเศษครั้งเดียวจบ" },
        keyVocab: { word: "over time ... not a one-time panacea", th: "ใช้เวลานาน ... ไม่ใช่ยาครั้งเดียวหาย", contrastA: "short period . ช่วงเวลาสั้น", contrastB: "long and arduous ... over time . ยาวนานและยากลำบาก", note: "ผู้เขียนบอกว่าต้องใช้ความพยายามต่อเนื่อง 'over time' ไม่ใช่ทางลัดครั้งเดียว ขัดกับ 'short period' ในโจทย์ จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "the need to keep up with new information is exaggerated", th: "ความจำเป็นที่ต้องตามข้อมูลใหม่ถูกพูดเกินจริง" },
        passagePhrase: { en: "audiences need to be able to comprehend them ... educate and sensitize audiences", th: "ผู้รับสารต้องเข้าใจ ... ให้ความรู้และกระตุ้นการรับรู้แก่ผู้ฟัง" },
        keyVocab: { word: "keep up with new information", th: "ตามทันข้อมูลใหม่", note: "ผู้เขียนไม่เคยกล่าวว่าความจำเป็นในการตามข้อมูลใหม่ถูก 'exaggerated' (พูดเกินจริง) เลย ไม่มีข้อมูลในเนื้อเรื่อง จึงตอบ NOT GIVEN" }
    },
  },
  "Cambridge 19 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "regarded as the only female holder", th: "ถูกมองว่าเป็นผู้หญิงคนเดียวที่ได้รับรางวัลนี้" },
        passagePhrase: { en: "the only woman to win the Fields Medal", th: "ผู้หญิงคนเดียวที่ชนะรางวัลฟิลด์ส" },
        keyVocab: { word: "unique", th: "หนึ่งเดียว / ไม่มีใครเหมือน", note: "ข้อความบอกว่าเธอเป็น 'the only woman' = หนึ่งเดียว จึงตรงกับตัวเลือก H 'unique' (ไม่ใช่ J 'innovative')" }
    },
    28: {
        questionPhrase: { en: "maths held little appeal for her", th: "คณิตศาสตร์แทบไม่ดึงดูดเธอเลย" },
        passagePhrase: { en: "maths wasn't her interest - reading was", th: "คณิตไม่ใช่ความสนใจของเธอ การอ่านต่างหากที่ใช่" },
        keyVocab: { word: "appeal", th: "เสน่ห์ / สิ่งดึงดูดใจ", note: "'wasn't her interest' = ไม่มีแรงดึงดูด จึงเติม 'appeal' (ความน่าสนใจ) ลงในช่อง ตอบ A" }
    },
    29: {
        questionPhrase: { en: "until she was intrigued by a puzzle", th: "จนกระทั่งเธอถูกกระตุ้นความสนใจด้วยโจทย์ปริศนา" },
        passagePhrase: { en: "a famous maths problem ... fascinated her and she was hooked", th: "โจทย์คณิตชื่อดังที่ทำให้เธอหลงใหลและติดงอมแงม" },
        keyVocab: { word: "intrigued", th: "ถูกกระตุ้นให้อยากรู้อยากเห็น", note: "'fascinated her / was hooked' = ถูกทำให้สนใจอย่างมาก ตรงกับ 'intrigued' ตอบ C" }
    },
    30: {
        questionPhrase: { en: "determined when things did not go smoothly", th: "มุ่งมั่นแม้ตอนที่อะไรๆ ไม่ราบรื่น" },
        passagePhrase: { en: "resolute in the face of setbacks", th: "หนักแน่นเด็ดเดี่ยวเมื่อเจออุปสรรค" },
        keyVocab: { word: "determined", th: "มุ่งมั่น / เด็ดเดี่ยว", note: "'resolute in the face of setbacks' = ไม่ยอมแพ้เมื่อเจอปัญหา ตรงกับ 'determined' ตอบ B" }
    },
    31: {
        questionPhrase: { en: "got the greatest satisfaction from discoveries", th: "ได้รับความพึงพอใจสูงสุดจากการค้นพบ" },
        passagePhrase: { en: "the most rewarding part is the 'Aha' moment", th: "ช่วงที่คุ้มค่าที่สุดคือวินาที 'อ๋อ เข้าใจแล้ว'" },
        keyVocab: { word: "satisfaction", th: "ความพึงพอใจ / ความอิ่มใจ", note: "'most rewarding part / enjoyment of understanding' = ความอิ่มใจสูงสุด ตรงกับ 'satisfaction' ตอบ J" }
    },
    32: {
        questionPhrase: { en: "some extremely innovative mathematical studies", th: "งานวิจัยคณิตที่ล้ำสมัยบุกเบิกอย่างยิ่ง" },
        passagePhrase: { en: "the heights of original research into mathematics", th: "งานวิจัยคณิตเชิงริเริ่มในระดับสูงสุด" },
        keyVocab: { word: "innovative", th: "ริเริ่มใหม่ / บุกเบิก", note: "'original research / ground-breaking discoveries' = บุกเบิกสิ่งใหม่ ตรงกับ 'innovative' ตอบ I" }
    },
    33: {
        questionPhrase: { en: "prizewinners only reached average standard when young", th: "ผู้ชนะรางวัลตอนเด็กเก่งแค่ระดับธรรมดา" },
        passagePhrase: { en: "Most Nobel prize winners were unexceptional in childhood", th: "ผู้ชนะรางวัลโนเบลส่วนใหญ่ตอนเด็กไม่ได้โดดเด่น" },
        keyVocab: { word: "unexceptional", th: "ธรรมดา / ไม่โดดเด่น", note: "'unexceptional in childhood' = ระดับธรรมดาตอนเด็ก ตรงกับคำกล่าวอ้าง จึงตอบ YES" }
    },
    34: {
        questionPhrase: { en: "Einstein's failures due to lack of confidence", th: "ความล้มเหลวของไอน์สไตน์เกิดจากขาดความมั่นใจ" },
        passagePhrase: { en: "He struggled at work initially, but he kept plugging away", th: "ตอนแรกเขาทำงานลำบาก แต่เขาก็พยายามไม่หยุด" },
        keyVocab: { word: "confidence", th: "ความมั่นใจ", note: "บทความพูดถึงความล้มเหลวของเขา แต่ไม่เคยระบุ 'สาเหตุ' ว่ามาจากขาดความมั่นใจ จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "hard to agree whether children are born gifted", th: "ยากที่จะตกลงกันว่าเด็กเกิดมามีพรสวรรค์หรือไม่" },
        passagePhrase: { en: "the jury is out on giftedness being innate", th: "ยังหาข้อสรุปไม่ได้ว่าพรสวรรค์เป็นสิ่งติดตัวมาแต่กำเนิด" },
        keyVocab: { word: "the jury is out", th: "ยังไม่มีข้อสรุป / ยังถกเถียงกันอยู่", note: "'the jury is out' = ยังตกลงกันไม่ได้ ตรงกับ 'difficult to reach agreement' จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "Einstein upset by public's view of his work", th: "ไอน์สไตน์ไม่พอใจกับมุมมองของสาธารณชนต่อผลงานเขา" },
        passagePhrase: { en: "It's not that I'm so smart, it's just that I stay with problems longer", th: "ไม่ใช่ว่าผมฉลาดมาก แค่ผมอยู่กับปัญหานานกว่า" },
        keyVocab: { word: "upset", th: "ไม่พอใจ / เสียใจ", note: "บทความไม่กล่าวถึงอารมณ์ของเขาต่อ 'มุมมองของสาธารณชน' เลย จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "success down to the speed of solving questions", th: "ความสำเร็จเกิดจากความเร็วในการแก้ปัญหา" },
        passagePhrase: { en: "it's just that I stay with problems longer", th: "แค่ผมอยู่กับปัญหานานกว่าคนอื่น" },
        keyVocab: { word: "longer", th: "นานกว่า", contrastA: "speed . ความเร็ว", contrastB: "stay longer . อยู่กับมันนานกว่า", note: "คำถามบอก 'speed' (เร็ว) แต่ข้อความบอก 'stay longer' (ใช้เวลานานกว่า) ขัดแย้งกันชัด จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "spirit of inquiry towards their studies", th: "จิตใจใฝ่สงสัยอยากรู้ต่อการเรียน" },
        passagePhrase: { en: "the attributes of high performers - curiosity, persistence", th: "คุณสมบัติของผู้ทำได้ดี เช่น ความอยากรู้และความเพียร" },
        keyVocab: { word: "curiosity", th: "ความอยากรู้อยากเห็น", note: "'curiosity' = จิตใจใฝ่สงสัย ตรงกับ 'spirit of inquiry' ในตัวเลือก C จึงตอบ C" }
    },
    39: {
        questionPhrase: { en: "innate gift is not the key to expertise", th: "พรสวรรค์ติดตัวไม่ใช่ปัจจัยหลักของความเชี่ยวชาญ" },
        passagePhrase: { en: "he doesn't think unique and innate talents are at the heart of performance", th: "เขาไม่คิดว่าพรสวรรค์ติดตัวคือหัวใจของความสามารถ" },
        keyVocab: { word: "innate", th: "ติดตัวมาแต่กำเนิด", contrastA: "innate talent . พรสวรรค์ติดตัว", contrastB: "deliberate practice . การฝึกฝนอย่างตั้งใจ", note: "Ericsson บอกว่าพรสวรรค์ติดตัวไม่ใช่หัวใจ การฝึกฝนต่างหากที่สำคัญ ตรงกับตัวเลือก B" }
    },
    40: {
        questionPhrase: { en: "guidance of someone who values learning", th: "การชี้นำจากผู้ที่เห็นคุณค่าของการเรียนรู้" },
        passagePhrase: { en: "an adult ... who valued and supported education", th: "ผู้ใหญ่ที่เห็นคุณค่าและสนับสนุนการศึกษา" },
        keyVocab: { word: "valued and supported education", th: "เห็นคุณค่าและสนับสนุนการศึกษา", note: "'an adult who valued and supported education' = ผู้ที่เห็นประโยชน์ของการเรียน ตรงกับตัวเลือก D" }
    },
  },
  "Cambridge 19 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "Aspects of the conversation are challenging for both", th: "บางแง่มุมของบทสนทนาเป็นเรื่องยากสำหรับทั้งสองฝ่าย" },
        passagePhrase: { en: "I'm struggling to follow him on a scratchy line", th: "ผมฟังเขาได้ลำบากเพราะสายโทรศัพท์มีสัญญาณรบกวน" },
        keyVocab: { word: "challenging", th: "ที่ท้าทาย / เป็นเรื่องยาก", note: "ผู้เขียนพูดถึงเสียงรบกวนและระยะทาง 10,000 กม. ที่ทำให้การสนทนายากสำหรับทั้งคู่ ไม่ใช่เรื่องภาษาหรือหัวข้อ จึงตอบ D ที่ว่า 'หลายแง่มุมท้าทาย'" }
    },
    28: {
        questionPhrase: { en: "What assists the electronic translator during lectures", th: "อะไรช่วยให้เครื่องแปลอิเล็กทรอนิกส์ทำงานได้ดีขึ้นในการบรรยาย" },
        passagePhrase: { en: "lecturers say much the same thing each year", th: "ผู้บรรยายพูดเนื้อหาเหมือนเดิมแทบทุกปี" },
        keyVocab: { word: "say much the same thing each year", th: "พูดเนื้อหาซ้ำเดิมทุกปี", note: "วลี 'say much the same thing each year' คือการพูดถึงเนื้อหาที่ซ้ำเดิม ตรงกับตัวเลือก A 'the repeated content' จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "artificial speech translation was not a surprising development", th: "การแปลเสียงพูดอัตโนมัติไม่ใช่สิ่งที่น่าประหลาดใจ" },
        passagePhrase: { en: "a device technology enthusiasts dream of long before realizable", th: "อุปกรณ์ที่คนรักเทคโนโลยีฝันถึงมานานก่อนจะทำได้จริง" },
        keyVocab: { word: "dream of long before they become practically realizable", th: "ฝันถึงมานานก่อนจะทำได้จริง", note: "ผู้เขียนบอกว่าคนจินตนาการถึงอุปกรณ์แบบนี้มานานแล้ว เหมือนทีวีจอแบน การมาถึงจริงจึงไม่น่าแปลกใจ ตรงกับ C 'not a surprising development'" }
    },
    30: {
        questionPhrase: { en: "The reluctance to share earpieces is understandable", th: "การไม่อยากแบ่งหูฟังกันเป็นเรื่องที่เข้าใจได้" },
        passagePhrase: { en: "there's a barrier with sharing one of the earphones with a stranger", th: "มีอุปสรรคในการแบ่งหูฟังให้คนแปลกหน้า" },
        keyVocab: { word: "barrier", th: "อุปสรรค / กำแพงใจ", note: "คำว่า 'barrier with sharing with a stranger' แสดงว่าผู้เขียนยอมรับว่าความลังเลนี้มีเหตุผล ตรงกับ B 'reluctance is understandable'" }
    },
    31: {
        questionPhrase: { en: "Speech translation methods are developing fast in Japan", th: "วิธีแปลเสียงพูดกำลังพัฒนาอย่างรวดเร็วในญี่ปุ่น" },
        passagePhrase: { en: "voice translation has really taken off in countries such as Japan", th: "การแปลด้วยเสียงเติบโตอย่างมากในประเทศอย่างญี่ปุ่น" },
        keyVocab: { word: "but they are far from perfect", th: "แต่ก็ยังห่างไกลจากความสมบูรณ์แบบ", contrastA: "taken off . เติบโตรวดเร็ว", contrastB: "far from perfect . ยังไม่สมบูรณ์", note: "แม้แปลด้วยเสียงจะเติบโตในญี่ปุ่น แต่ยังต้องทำงานแบบเรียลไทม์ ออฟไลน์ และรับมือเสียงรบกวน คือยังไม่สมบูรณ์ จึงเติมด้วย C 'far from perfect'" }
    },
    32: {
        questionPhrase: { en: "TV interviews using translation voiceover are successful", th: "การสัมภาษณ์ทีวีที่ใช้เสียงแปลทับประสบความสำเร็จ" },
        passagePhrase: { en: "simultaneous, like the translator's voice speaking over the foreign politician", th: "แปลพร้อมกันทันที เหมือนเสียงล่ามพูดทับนักการเมืองต่างชาติ" },
        keyVocab: { word: "simultaneous", th: "พร้อมกัน / ทันที", contrastA: "simultaneous . แปลทันที", contrastB: "pause after every few remarks . หยุดรอเป็นช่วง ๆ", note: "ระบบที่ดีต้องแปล 'simultaneous' คือทันที ไม่ใช่หยุดรอเป็นช่วง ตรงกับ E 'because translation is immediate'" }
    },
    33: {
        questionPhrase: { en: "Future translation systems should address people appropriately", th: "ระบบแปลในอนาคตควรพูดกับผู้คนอย่างเหมาะสม" },
        passagePhrase: { en: "socially aware by addressing people in the right way", th: "ตระหนักทางสังคมด้วยการพูดกับผู้คนอย่างถูกต้องเหมาะสม" },
        keyVocab: { word: "addressing people in the right way", th: "พูดกับผู้คนอย่างถูกต้องเหมาะสม", note: "การ 'address people in the right way' หมายถึงการมีมารยาทที่ดี ตรงกับ F 'have an awareness of good manners'" }
    },
    34: {
        questionPhrase: { en: "Users may be able to maintain their local customs", th: "ผู้ใช้อาจรักษาประเพณีท้องถิ่นของตนไว้ได้" },
        passagePhrase: { en: "help to preserve local customs, slowing the spread of international English habits", th: "ช่วยรักษาประเพณีท้องถิ่น ชะลอการแพร่ของนิสัยแบบภาษาอังกฤษสากล" },
        keyVocab: { word: "preserve local customs", th: "รักษาประเพณีท้องถิ่น", contrastA: "local customs . ประเพณีท้องถิ่น", contrastB: "standard practices / international English . แนวปฏิบัติมาตรฐานสากล", note: "ระบบช่วยรักษาประเพณีท้องถิ่นแทนที่จะตามแบบสากล เช่น การเรียกชื่อต้น จึงเติมด้วย B 'do not need to conform to standard practices'" }
    },
    35: {
        questionPhrase: { en: "translation seen as very useful throughout academic and professional worlds", th: "ระบบแปลจะถูกมองว่ามีประโยชน์มากทั่ววงการวิชาการและวิชาชีพ" },
        passagePhrase: { en: "they seem to be regarded as eye-catching novelties rather than steps", th: "มันถูกมองว่าเป็นของแปลกใหม่สะดุดตา มากกว่าก้าวสำคัญ" },
        keyVocab: { word: "novelties", th: "ของแปลกใหม่ / สิ่งแปลกตา", contrastA: "very useful . มีประโยชน์มาก", contrastB: "eye-catching novelties . ของแปลกใหม่สะดุดตา", note: "ผู้เขียนบอกว่าอุปกรณ์ถูกมองเป็นของแปลกใหม่ ไม่ใช่ของมีประโยชน์จริงจัง จึงขัดกับข้อความ ตอบ NO" }
    },
    36: {
        questionPhrase: { en: "value of automated translation to family life is yet to be shown", th: "คุณค่าของการแปลอัตโนมัติต่อชีวิตครอบครัวยังพิสูจน์ไม่ได้" },
        passagePhrase: { en: "Whether it will help family lives or relationships is open to question", th: "มันจะช่วยชีวิตครอบครัวหรือความสัมพันธ์ได้หรือไม่ยังเป็นคำถาม" },
        keyVocab: { word: "open to question", th: "ยังเป็นที่น่าสงสัย / ยังไม่แน่ชัด", note: "'open to question' = ยังพิสูจน์ไม่ได้ ตรงกับ 'yet to be shown' ผู้เขียนเห็นด้วย จึงตอบ YES" }
    },
    37: {
        questionPhrase: { en: "automated translation could make life harder for immigrant families", th: "การแปลอัตโนมัติอาจทำให้ครอบครัวผู้อพยพลำบากขึ้น" },
        passagePhrase: { en: "could overcome the language barriers between generations after migration", th: "อาจช่วยข้ามอุปสรรคทางภาษาระหว่างรุ่นหลังการอพยพ" },
        keyVocab: { word: "overcome the language barriers", th: "เอาชนะ / ข้ามอุปสรรคทางภาษา", contrastA: "make life more difficult . ทำให้ลำบากขึ้น", contrastB: "overcome barriers . ช่วยข้ามอุปสรรค", note: "ผู้เขียนบอกว่ามันช่วย 'overcome' อุปสรรคภาษาในครอบครัวผู้อพยพ ซึ่งตรงข้ามกับ 'ทำให้ลำบากขึ้น' จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "visual aspects of translation are being considered by scientists", th: "นักวิทยาศาสตร์กำลังพิจารณาแง่มุมด้านภาพของการแปล" },
        passagePhrase: { en: "lip movements won't match, like a dubbed movie", th: "การขยับริมฝีปากจะไม่ตรงกัน เหมือนหนังพากย์เสียง" },
        keyVocab: { word: "lip movements won't match", th: "การขยับริมฝีปากจะไม่ตรงกัน", note: "ผู้เขียนพูดถึงปัญหาริมฝีปากไม่ตรง แต่ไม่ได้บอกว่านักวิทยาศาสตร์กำลังศึกษาแง่มุมด้านภาพนี้ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "English easier to translate into other languages than Latin", th: "ภาษาอังกฤษแปลเป็นภาษาอื่นได้ง่ายกว่าภาษาละติน" },
        passagePhrase: { en: "international scientists use English as a lingua franca, predecessors used Latin", th: "นักวิทยาศาสตร์นานาชาติใช้อังกฤษเป็นภาษากลาง รุ่นก่อนใช้ละติน" },
        keyVocab: { word: "lingua franca", th: "ภาษากลางที่ใช้สื่อสารร่วมกัน", note: "ข้อความเพียงบอกว่าอังกฤษเป็นภาษากลางแทนละติน ไม่ได้เปรียบเทียบว่าแปลง่ายกว่ากัน จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "difference between people's social and practical needs", th: "ความแตกต่างระหว่างความต้องการทางสังคมและทางปฏิบัติของผู้คน" },
        passagePhrase: { en: "practical need will diminish, the social value will persist", th: "ความจำเป็นทางปฏิบัติจะลดลง แต่คุณค่าทางสังคมจะยังคงอยู่" },
        keyVocab: { word: "practical need will diminish, social value will persist", th: "ความจำเป็นทางปฏิบัติลดลง แต่คุณค่าทางสังคมยังคงอยู่", contrastA: "practical need . ความจำเป็นทางปฏิบัติ", contrastB: "social value . คุณค่าทางสังคม", note: "ผู้เขียนแยกชัดระหว่างความจำเป็นทางปฏิบัติ (ลดลง) กับคุณค่าทางสังคม (คงอยู่) แสดงว่ามีความแตกต่างจริง จึงตอบ YES" }
    },
  },
  "Cambridge 19 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "a commonly held belief about people's behaviour", th: "ความเชื่อที่คนทั่วไปมีเกี่ยวกับพฤติกรรมมนุษย์" },
        passagePhrase: { en: "There has long been a general assumption that human beings are essentially selfish", th: "มีสมมติฐานทั่วไปมานานว่ามนุษย์โดยเนื้อแท้แล้วเห็นแก่ตัว" },
        keyVocab: { word: "general assumption", th: "สมมติฐาน/ความเชื่อทั่วไป", note: "วลี 'a general assumption' ตรงกับ 'a commonly held belief' ผู้เขียนแค่บรรยายความเชื่อที่คนส่วนใหญ่มี จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "a view in line with the attitudes of its time", th: "มุมมองที่สอดคล้องกับทัศนคติของยุคนั้น" },
        passagePhrase: { en: "it fitted so well with the competitive and individualistic ethos that was so prevalent", th: "มันเข้ากันได้ดีกับค่านิยมแข่งขันและปัจเจกนิยมที่แพร่หลายในยุคนั้น" },
        keyVocab: { word: "fitted so well with", th: "เข้ากันได้ดีกับ/สอดคล้องกับ", note: "'fitted so well with the ethos that was so prevalent' = 'in line with the attitudes of its time' หนังสือดังเพราะตรงกับค่านิยมยุคนั้น จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "natural resources were probably relatively plentiful", th: "ทรัพยากรธรรมชาติน่าจะมีค่อนข้างเหลือเฟือ" },
        passagePhrase: { en: "the world was very sparsely populated", th: "โลกในยุคนั้นมีประชากรเบาบางมาก" },
        keyVocab: { word: "sparsely populated", th: "มีประชากรเบาบาง", note: "ประชากรน้อยมาก (sparsely populated) แปลว่าไม่ต้องแย่งทรัพยากร ทรัพยากรจึงค่อนข้างเหลือเฟือ จึงตอบ B" }
    },
    30: {
        questionPhrase: { en: "people can live in an unselfish manner", th: "ผู้คนสามารถใช้ชีวิตแบบไม่เห็นแก่ตัวได้" },
        passagePhrase: { en: "hunter-gatherers are characterized by extreme political and sexual egalitarianism", th: "กลุ่มล่าสัตว์-เก็บของป่ามีลักษณะเด่นคือความเสมอภาคสูงมาก" },
        keyVocab: { word: "egalitarianism", th: "ความเสมอภาค/ความเท่าเทียม", contrastA: "selfish . henkaetua (เห็นแก่ตัว)", contrastB: "egalitarian/unselfish . semophak (เสมอภาค/ไม่เห็นแก่ตัว)", note: "Knauft ชี้ว่ากลุ่มล่าสัตว์มี egalitarianism และแบ่งปันทุกอย่าง สนับสนุนว่าคนใช้ชีวิตแบบไม่เห็นแก่ตัวได้ จึงตอบ A" }
    },
    31: {
        questionPhrase: { en: "a high level of ___ in all areas of life", th: "ระดับสูงของ ___ ในทุกด้านของชีวิต" },
        passagePhrase: { en: "characterized by extreme political and sexual egalitarianism", th: "มีลักษณะคือความเสมอภาคทางการเมืองและเพศอย่างสูงมาก" },
        keyVocab: { word: "egalitarianism", th: "ความเสมอภาค/ความเท่าเทียม", note: "'all areas of life' ถอดความจาก 'political and sexual' (ทุกด้าน) คำที่เติมคือ egalitarianism" }
    },
    32: {
        questionPhrase: { en: "prevent differences in ___ occurring", th: "ป้องกันไม่ให้เกิดความแตกต่างด้าน ___" },
        passagePhrase: { en: "ensuring that disparities of status don't arise", th: "ทำให้แน่ใจว่าความเหลื่อมล้ำด้านสถานะจะไม่เกิดขึ้น" },
        keyVocab: { word: "status", th: "สถานะ/ฐานะทางสังคม", note: "'differences' ถอดความจาก 'disparities' และ 'prevent...occurring' = 'don't arise' คำที่เติมคือ status" }
    },
    33: {
        questionPhrase: { en: "credit for one person's success at ___", th: "เครดิตจากความสำเร็จของคนหนึ่งในการ ___" },
        passagePhrase: { en: "people who lived by hunting wild animals", th: "ผู้คนที่ดำรงชีวิตด้วยการล่าสัตว์ป่า" },
        keyVocab: { word: "hunting", th: "การล่าสัตว์", note: "บริบท !Kung แลกลูกศรก่อน 'going hunting' และยกย่องเจ้าของลูกศร เครดิตความสำเร็จคือการ hunting" }
    },
    34: {
        questionPhrase: { en: "individuals who behave in a ___ manner are excluded", th: "คนที่ประพฤติตัวแบบ ___ จะถูกขับออกจากกลุ่ม" },
        passagePhrase: { en: "if a person becomes too domineering, the other members ostracise them", th: "ถ้าใครเริ่มชอบครอบงำผู้อื่นเกินไป สมาชิกคนอื่นจะขับไล่เขา" },
        keyVocab: { word: "domineering", th: "ชอบครอบงำ/ชอบใช้อำนาจเหนือผู้อื่น", note: "'punished by being excluded' = 'ostracise/exiling' คนที่ถูกขับคือคนที่ domineering จึงเติมคำนี้" }
    },
    35: {
        questionPhrase: { en: "women have considerable ___ in choices about work and marriage", th: "ผู้หญิงมี ___ มากในการเลือกเรื่องงานและการแต่งงาน" },
        passagePhrase: { en: "benefit from a high level of autonomy, being able to select their own marriage partners", th: "ได้รับประโยชน์จากความเป็นอิสระระดับสูง สามารถเลือกคู่ครองได้เอง" },
        keyVocab: { word: "autonomy", th: "ความเป็นอิสระ/อิสระในการตัดสินใจเอง", note: "'choices regarding work and marriage' ตรงกับ 'select marriage partners, decide what work' คำที่เติมคือ autonomy" }
    },
    36: {
        questionPhrase: { en: "anthropologists are mistaken about when !Kung societies declined", th: "นักมานุษยวิทยาเข้าใจผิดเรื่องช่วงเวลาที่สังคม !Kung เริ่มลดลง" },
        passagePhrase: { en: "Many anthropologists believe that societies such as the !Kung were normal until a few thousand years ago", th: "นักมานุษยวิทยาหลายคนเชื่อว่าสังคมแบบ !Kung เป็นเรื่องปกติจนกระทั่งเมื่อไม่กี่พันปีก่อน" },
        keyVocab: { word: "mistaken", th: "เข้าใจผิด", note: "ผู้เขียนรายงานความเชื่อของนักมานุษยวิทยาแต่ไม่เคยบอกว่าพวกเขา 'เข้าใจผิด' เรื่องช่วงเวลา จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "warlike traits would give an advantage", th: "ลักษณะนิยมสงครามจะทำให้ได้เปรียบ" },
        passagePhrase: { en: "traits such as racism, warfare...would have been of little benefit in the prehistoric era", th: "ลักษณะอย่างการเหยียดเชื้อชาติและสงครามแทบไม่มีประโยชน์ในยุคก่อนประวัติศาสตร์" },
        keyVocab: { word: "little benefit", th: "แทบไม่มีประโยชน์", contrastA: "advantage . daipriap (ได้เปรียบ)", contrastB: "little benefit/less likely to survive . raipraojot (ไม่มีประโยชน์)", note: "ผู้เขียนบอกว่านิสัยสงครามมีประโยชน์น้อยและทำให้รอดยากกว่า ขัดกับคำว่า 'advantage' จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "being peaceful and cooperative is natural for people", th: "การรักสงบและร่วมมือกันเป็นธรรมชาติของมนุษย์" },
        passagePhrase: { en: "cooperation...altruism and peacefulness as innate characteristics of human beings", th: "ความร่วมมือ ความเสียสละ และความรักสงบเป็นลักษณะที่ติดตัวมนุษย์มาแต่กำเนิด" },
        keyVocab: { word: "innate", th: "ติดตัวมาแต่กำเนิด/เป็นธรรมชาติ", note: "'natural way to behave' = 'innate characteristics' ผู้เขียนเห็นด้วยว่าความรักสงบและร่วมมือเป็นธรรมชาติ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "negative traits more apparent in some cultures than others", th: "ลักษณะด้านลบเด่นชัดในบางวัฒนธรรมมากกว่าวัฒนธรรมอื่น" },
        passagePhrase: { en: "these negative traits should be seen as a later development", th: "ลักษณะด้านลบเหล่านี้ควรมองว่าเป็นพัฒนาการที่เกิดขึ้นทีหลัง" },
        keyVocab: { word: "later development", th: "พัฒนาการที่เกิดขึ้นทีหลัง", note: "ผู้เขียนพูดถึงด้านลบในแง่ 'เกิดทีหลัง' แต่ไม่เคยเปรียบเทียบว่าบางวัฒนธรรมมีมากกว่าวัฒนธรรมอื่น จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "animal research failed to link environment change and aggression", th: "งานวิจัยสัตว์ไม่พบความเชื่อมโยงระหว่างสภาพแวดล้อมกับความก้าวร้าว" },
        passagePhrase: { en: "when the natural habitats of primates...are disrupted, they tend to become more violent", th: "เมื่อถิ่นที่อยู่ของลิงถูกรบกวน พวกมันมักจะก้าวร้าวขึ้น" },
        keyVocab: { word: "disrupted...more violent", th: "ถูกรบกวน...ก้าวร้าวขึ้น", contrastA: "failed to reveal a link . maiphobkhwamchueamyong (ไม่พบความเชื่อมโยง)", contrastB: "shown repeatedly...more violent . phob (วิจัยแสดงให้เห็นซ้ำๆ)", note: "งานวิจัยแสดง 'ซ้ำๆ' ว่าสภาพแวดล้อมที่ถูกรบกวนทำให้ก้าวร้าวขึ้น ขัดกับคำว่า 'failed to reveal' จึงตอบ NO" }
    },
  },
}

// Flattened lookup by `${answerGroup}#${number}` for O(1) access at render time.
const READING_VOCAB_BRIDGE_LOOKUP: Record<string, ReadingVocabBridge> = Object.entries(
  READING_VOCAB_BRIDGE_BY_GROUP
).reduce((acc, [group, byNumber]) => {
  for (const [number, bridge] of Object.entries(byNumber)) {
    acc[buildReadingVocabBridgeKey(group, Number(number))] = bridge
  }
  return acc
}, {} as Record<string, ReadingVocabBridge>)

export const lookupReadingVocabBridge = (
  answerGroup: string | undefined | null,
  questionNumber: number | undefined | null
): ReadingVocabBridge | null => {
  if (!answerGroup || !questionNumber) return null
  return READING_VOCAB_BRIDGE_LOOKUP[buildReadingVocabBridgeKey(answerGroup, questionNumber)] || null
}
