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

/**
 * One exact word/phrase paraphrase pair. `q` is the exact substring as it
 * appears in the QUESTION (heading / statement), `p` is the exact substring it
 * paraphrases in the PASSAGE, and `th` is the shared Thai meaning. An optional
 * `note` clarifies that one pair (e.g. why it is the decisive match).
 */
export type ReadingVocabBridgePair = {
  q: string
  p: string
  th: string
  note?: string
}

export type ReadingVocabBridge = {
  questionPhrase: ReadingVocabBridgePhrase
  passagePhrase: ReadingVocabBridgePhrase
  /**
   * Word-level paraphrase breakdown: each exact term in the question matched to
   * the exact term it paraphrases in the passage. When present, the report card
   * renders this list instead of the single questionPhrase ↔ passagePhrase row.
   */
  pairs?: ReadingVocabBridgePair[]
  keyVocab?: ReadingVocabBridgeKeyVocab
}

const KEY_SEPARATOR = '#'

export const buildReadingVocabBridgeKey = (answerGroup: string, questionNumber: number) =>
  `${String(answerGroup || '').trim()}${KEY_SEPARATOR}${questionNumber}`

// ─────────────────────────────────────────────────────────────────────────────
// Cambridge 15 Test 1 Passage 3 — "What is exploration?"
// ─────────────────────────────────────────────────────────────────────────────
const READING_VOCAB_BRIDGE_BY_GROUP: Record<string, Record<number, ReadingVocabBridge>> = {
  "Cambridge 15 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "illustrate the point that", th: "ยกตัวอย่างเพื่อชี้ให้เห็นว่า" },
        passagePhrase: { en: "part of what makes us human", th: "เป็นส่วนหนึ่งของความเป็นมนุษย์" },
        pairs: [
          { q: "intrinsic element", p: "part of what makes us human", th: "เป็นส่วนหนึ่งที่ติดตัวมนุษย์มาแต่เกิด", note: "exploration เป็นสิ่งที่ทำให้เราเป็นมนุษย์ = intrinsic element of being human จึงตอบ A" },
          { q: "being human", p: "makes us human", th: "ความเป็นมนุษย์" },
          { q: "exploration", p: "desire to discover", th: "ความปรารถนาที่จะค้นพบ / การสำรวจ" },
        ],
        keyVocab: { word: "intrinsic", th: "ที่เป็นเนื้อแท้ / ติดตัวมาแต่เกิด", note: "การสำรวจเป็นสิ่งที่ \"ติดตัว\" มนุษย์ = intrinsic element of being human จึงตอบ A" }
    },
    28: {
        questionPhrase: { en: "the writer's view of explorers", th: "มุมมองของผู้เขียนต่อนักสำรวจ" },
        passagePhrase: { en: "we all have this enquiring instinct", th: "เราทุกคนมีสัญชาตญาณอยากรู้อยากเห็นนี้" },
        pairs: [
          { q: "an urge", p: "enquiring instinct", th: "แรงขับ / สัญชาตญาณอยากรู้อยากเห็น", note: "ผู้เขียนบอกว่าสัญชาตญาณนี้มีใน \"ทุกคน\" ไม่ใช่แค่นักสำรวจ จึงตอบ C" },
          { q: "common to everyone", p: "we all have", th: "มีร่วมกันในทุกคน" },
          { q: "explorers", p: "this enquiring instinct", th: "นักสำรวจ / ความอยากสำรวจ" },
        ],
        keyVocab: { word: "instinct", th: "สัญชาตญาณ", contrastA: "explorers · นักสำรวจ", contrastB: "everyone · คนทั่วไป", note: "ผู้เขียนบอกว่าสัญชาตญาณนี้มีใน \"ทุกคน\" ไม่ใช่แค่นักสำรวจ จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "refers to a description of Egdon Heath to suggest that", th: "อ้างถึงการบรรยาย Egdon Heath เพื่อสื่อว่า" },
        passagePhrase: { en: "to suggest the desires and fears of his characters", th: "เพื่อสื่อถึงความปรารถนาและความกลัวของตัวละคร" },
        pairs: [
          { q: "to investigate", p: "to suggest", th: "เพื่อสำรวจ/สื่อถึง", note: "desires and fears = emotional states จึงตอบ C ว่า Hardy มุ่งสำรวจจิตใจของคน" },
          { q: "emotional states", p: "the desires and fears", th: "สภาวะอารมณ์ (ความปรารถนาและความกลัว)" },
          { q: "people's", p: "his characters", th: "ของผู้คน / ตัวละคร" },
        ],
        keyVocab: { word: "desires and fears", th: "ความปรารถนาและความกลัว (= สภาวะอารมณ์)", note: "desires and fears = emotional states จึงตอบ C (สำรวจ \"จิตใจ\" ของคน)" }
    },
    30: {
        questionPhrase: { en: "refers to 'a golden age' to suggest that", th: "อ้างถึง 'ยุคทอง' เพื่อสื่อว่า" },
        passagePhrase: { en: "the truth is that we have named only one and a half million of this planet’s species", th: "ความจริงคือเราเพิ่งตั้งชื่อสิ่งมีชีวิตได้แค่ 1.5 ล้านชนิด (ยังเหลืออีกมาก)" },
        pairs: [
          { q: "no longer necessary", p: "the process of discovery is now on the decline", th: "ไม่จำเป็นอีกต่อไป / กำลังถดถอย", note: "ผู้เขียนแย้งความคิดที่ว่าการสำรวจหมดความจำเป็น — ยังเหลือให้ค้นอีกมาก จึงตอบ D" },
          { q: "we are wrong to think", p: "the truth is", th: "เราเข้าใจผิด / ความจริงคือ" },
          { q: "exploration", p: "discovery", th: "การสำรวจ / การค้นพบ" },
        ],
        keyVocab: { word: "on the decline", th: "กำลังถดถอย / ลดน้อยลง", note: "ผู้เขียนแย้งว่าการสำรวจ \"ไม่ได้\" หมดความจำเป็น — ยังมีให้ค้นอีกมาก จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "the writer argues that", th: "ผู้เขียนโต้แย้งว่า" },
        passagePhrase: { en: "tends to reflect the field of endeavour of each pioneer", th: "มักสะท้อนสาขาอาชีพของผู้บุกเบิกแต่ละคน" },
        pairs: [
          { q: "their own professional interests", p: "the field of endeavour of each pioneer", th: "สาขาอาชีพของตนเอง", note: "แต่ละคนนิยามการสำรวจตามอาชีพของตัวเอง = relate to their own professional interests จึงตอบ A" },
          { q: "relate exploration to", p: "tends to reflect", th: "เชื่อมโยง/สะท้อนการสำรวจกับ" },
          { q: "people", p: "each pioneer", th: "ผู้คน / ผู้บุกเบิกแต่ละคน" },
        ],
        keyVocab: { word: "field of endeavour", th: "สาขา/แวดวงอาชีพที่ทุ่มเท", note: "แต่ละคนนิยามการสำรวจตาม \"อาชีพของตัวเอง\" = relate to their own professional interests จึงตอบ A" }
    },
    32: {
        questionPhrase: { en: "the writer explains that he is interested in", th: "ผู้เขียนบอกว่าเขาสนใจเรื่อง" },
        passagePhrase: { en: "how a fresh interpretation, even of a well-travelled route, can give its readers new insights", th: "การตีความใหม่ แม้กับเส้นทางที่คนไปบ่อย ก็ให้มุมมองใหม่แก่ผู้อ่านได้" },
        pairs: [
          { q: "cast new light on", p: "a fresh interpretation", th: "ให้มุมมองใหม่ / การตีความใหม่", note: "fresh interpretation of a well-travelled route = cast new light on familiar places จึงตอบ B" },
          { q: "places that may be familiar", p: "a well-travelled route", th: "สถานที่ที่คุ้นเคย / เส้นทางที่คนไปบ่อย" },
          { q: "the human ability", p: "the role the human mind has", th: "ความสามารถของมนุษย์ / บทบาทของจิตใจมนุษย์" },
        ],
        keyVocab: { word: "fresh interpretation", th: "การตีความใหม่ / มุมมองใหม่", note: "fresh interpretation of a well-travelled route = cast new light on familiar places จึงตอบ B" }
    },
    33: {
        questionPhrase: { en: "referred to the relevance of the form of transport used", th: "พูดถึงความสำคัญของรูปแบบการเดินทางที่ใช้" },
        passagePhrase: { en: "If I’d gone across by camel when I could have gone by car, it would have been a stunt", th: "ถ้าข้ามด้วยอูฐทั้งที่ไปด้วยรถได้ มันก็แค่การโชว์" },
        pairs: [
          { q: "the form of transport used", p: "by camel when I could have gone by car", th: "รูปแบบการเดินทางที่ใช้ (อูฐ vs รถ)", note: "พูดถึงวิธีเดินทาง (อูฐแทนรถ) ตรงกับ Wilfred Thesiger จึงตอบ E" },
          { q: "the relevance of", p: "it would have been a stunt", th: "ความสำคัญ/ความเกี่ยวข้องของ (ไม่งั้นเป็นแค่การโชว์)" },
        ],
        keyVocab: { word: "stunt", th: "การแสดงเรียกร้องความสนใจ (ไม่ใช่การสำรวจจริง)", contrastA: "camel · อูฐ", contrastB: "car · รถยนต์", note: "พูดถึง \"วิธีเดินทาง\" (อูฐ vs รถ) ตรงกับ Thesiger จึงตอบ E" }
    },
    34: {
        questionPhrase: { en: "described feelings on coming back home after a long journey", th: "บรรยายความรู้สึกตอนกลับบ้านหลังเดินทางไกล" },
        passagePhrase: { en: "the moment when the explorer returns to the existence he has left behind", th: "ช่วงเวลาที่นักสำรวจกลับสู่ชีวิตที่เขาทิ้งไว้" },
        pairs: [
          { q: "coming back home", p: "the explorer returns to the existence he has left behind", th: "กลับบ้าน / กลับสู่ชีวิตเดิม", note: "returns to the existence he left behind = coming back home ตรงกับ Peter Fleming จึงตอบ A" },
          { q: "described feelings", p: "talks of the moment", th: "บรรยายความรู้สึก / ช่วงเวลานั้น" },
          { q: "after a long journey", p: "for weeks or months", th: "หลังเดินทางไกล / เป็นสัปดาห์เป็นเดือน" },
        ],
        keyVocab: { word: "returns", th: "กลับคืน (สู่บ้าน/ชีวิตเดิม)", note: "returns to the existence he left behind = coming back home ตรงกับ Peter Fleming จึงตอบ A" }
    },
    35: {
        questionPhrase: { en: "worked for the benefit of specific groups of people", th: "ทำงานเพื่อประโยชน์ของคนกลุ่มเฉพาะ" },
        passagePhrase: { en: "a campaigner on behalf of remote so-called ‘tribal’ peoples", th: "นักรณรงค์เพื่อชนเผ่าห่างไกล" },
        pairs: [
          { q: "worked for the benefit of", p: "a campaigner on behalf of", th: "ทำงานเพื่อประโยชน์ของ / รณรงค์เพื่อ", note: "campaigner on behalf of tribal peoples = worked for specific groups ตรงกับ Robin Hanbury-Tenison จึงตอบ D" },
          { q: "specific groups of people", p: "remote so-called ‘tribal’ peoples", th: "คนกลุ่มเฉพาะ / ชนเผ่าห่างไกล" },
        ],
        keyVocab: { word: "campaigner", th: "นักรณรงค์ / ผู้เรียกร้องเพื่อผู้อื่น", note: "campaigner on behalf of tribal peoples = worked for specific groups ตรงกับ Hanbury-Tenison จึงตอบ D" }
    },
    36: {
        questionPhrase: { en: "did not consider learning about oneself an essential part of exploration", th: "ไม่ถือว่าการเรียนรู้เกี่ยวกับตัวเองเป็นส่วนสำคัญของการสำรวจ" },
        passagePhrase: { en: "bringing back information from a remote place regardless of any great self-discovery", th: "นำข้อมูลกลับมาจากที่ห่างไกล โดยไม่สนใจการค้นพบตัวเอง" },
        pairs: [
          { q: "did not consider … essential", p: "regardless of", th: "ไม่ถือว่าเป็นสิ่งสำคัญ / ไม่คำนึงถึง", note: "regardless of self-discovery = ไม่ถือว่าการรู้จักตัวเองสำคัญ ตรงกับ Wilfred Thesiger จึงตอบ E" },
          { q: "learning about oneself", p: "self-discovery", th: "การเรียนรู้เกี่ยวกับตัวเอง" },
          { q: "exploration", p: "bringing back information from a remote place", th: "การสำรวจ = นำข้อมูลกลับมาจากที่ห่างไกล" },
        ],
        keyVocab: { word: "regardless of", th: "โดยไม่คำนึงถึง / ไม่สนใจ", note: "regardless of self-discovery = ไม่ถือว่าการรู้จักตัวเองสำคัญ ตรงกับ Thesiger จึงตอบ E" }
    },
    37: {
        questionPhrase: { en: "defined exploration as being both unique and of value to others", th: "นิยามการสำรวจว่าต้องทั้งแปลกใหม่และมีคุณค่าต่อผู้อื่น" },
        passagePhrase: { en: "done something that no human has done before – and also done something scientifically useful", th: "ทำสิ่งที่ไม่เคยมีใครทำมาก่อน และเป็นประโยชน์เชิงวิทยาศาสตร์ด้วย" },
        pairs: [
          { q: "unique", p: "no human has done before", th: "แปลกใหม่ / ไม่เคยมีใครทำมาก่อน", note: "no human has done before (unique) + scientifically useful (value) ตรงกับ Ran Fiennes จึงตอบ B" },
          { q: "of value to others", p: "scientifically useful", th: "มีคุณค่าต่อผู้อื่น / มีประโยชน์เชิงวิทยาศาสตร์" },
          { q: "defined exploration", p: "An explorer is someone who", th: "นิยามการสำรวจ / นักสำรวจคือ" },
        ],
        keyVocab: { word: "scientifically useful", th: "มีประโยชน์เชิงวิทยาศาสตร์ (= มีคุณค่าต่อผู้อื่น)", note: "no human has done before (unique) + scientifically useful (value) ตรงกับ Ran Fiennes จึงตอบ B" }
    },
    38: {
        questionPhrase: { en: "experience of a large number of …", th: "มีประสบการณ์เกี่ยวกับ … จำนวนมาก" },
        passagePhrase: { en: "I’ve done a great many expeditions and each one was unique", th: "ผมทำการเดินทางสำรวจมามากมาย และแต่ละครั้งไม่ซ้ำกัน" },
        pairs: [
          { q: "a large number of", p: "a great many", th: "จำนวนมาก", note: "a great many expeditions = a large number of expeditions คำตอบคือ expeditions" },
          { q: "experience of", p: "I’ve done", th: "มีประสบการณ์ / เคยทำ" },
        ],
        keyVocab: { word: "expeditions", th: "การเดินทางสำรวจ (คำตอบ: unique expeditions)", note: "a great many expeditions = a large number of expeditions" }
    },
    39: {
        questionPhrase: { en: "the first stranger that certain previously … people had encountered", th: "คนแปลกหน้าคนแรกที่กลุ่มคนซึ่ง … เคยพบ" },
        passagePhrase: { en: "isolated groups of people … even two ‘uncontacted tribes’", th: "กลุ่มคนที่อยู่โดดเดี่ยว … แม้แต่ชนเผ่าที่ไม่เคยติดต่อใคร" },
        pairs: [
          { q: "previously … people", p: "‘uncontacted tribes’", th: "กลุ่มคนที่ (ไม่เคยติดต่อใคร) มาก่อน", note: "‘uncontacted tribes’ = previously uncontacted people คำตอบคือ uncontacted" },
          { q: "the first stranger that … had encountered", p: "isolated groups of people", th: "คนแปลกหน้าคนแรกที่พบ / กลุ่มคนที่อยู่โดดเดี่ยว" },
        ],
        keyVocab: { word: "uncontacted", th: "ที่ไม่เคยติดต่อโลกภายนอก (คำตอบ)", note: "‘uncontacted tribes’ = previously uncontacted people" }
    },
    40: {
        questionPhrase: { en: "no need for further exploration of Earth’s …", th: "ไม่จำเป็นต้องสำรวจ … ของโลกเพิ่ม" },
        passagePhrase: { en: "We know how the land surface of our planet lies", th: "เรารู้แล้วว่าพื้นผิวดินของโลกเป็นอย่างไร" },
        pairs: [
          { q: "Earth’s", p: "the land surface of our planet", th: "พื้นผิวดินของโลก", note: "land surface … is now down to the details = ไม่ต้องสำรวจพื้นผิวเพิ่ม คำตอบคือ surface" },
          { q: "no need for further exploration", p: "exploration of it is now down to the details", th: "ไม่จำเป็นต้องสำรวจเพิ่ม เหลือแค่รายละเอียด" },
          { q: "how buffalo eat", p: "the grazing behaviour of buffalo", th: "พฤติกรรมการกินหญ้าของควาย" },
        ],
        keyVocab: { word: "land surface", th: "พื้นผิวดิน (คำตอบ)", note: "land surface … is now down to the details = ไม่ต้องสำรวจพื้นผิวเพิ่ม" }
    },
  },
  "Cambridge 10 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "the importance of belief in a shared goal", th: "ความสำคัญของการเชื่อในเป้าหมายร่วมกัน" },
        passagePhrase: { en: "understood Phillips's ambition and believed in it; Orbison wasn't inspired by the goal", th: "เข้าใจและเชื่อในเป้าหมายของฟิลลิปส์ ส่วนออร์บิสันไม่ได้รับแรงบันดาลใจจากเป้าหมายนั้น" },
        pairs: [
          { q: "belief in a shared goal", p: "believed in it", th: "เชื่อในเป้าหมายร่วมกัน", note: "คนที่ 'เชื่อในเป้าหมาย' ของฟิลลิปส์ประสบความสำเร็จ แต่ออร์บิสันที่ไม่เชื่อกลับล้มเหลว ตัวอย่างนี้จึงเน้นความสำคัญของการเชื่อในเป้าหมายร่วม ตอบ C" },
          { q: "shared goal", p: "Phillips's ambition", th: "เป้าหมาย/ความมุ่งหวังร่วมกัน" },
          { q: "belief", p: "instinctively understood", th: "เข้าใจและศรัทธาในเป้าหมาย" },
        ],
        keyVocab: { word: "believed in it / wasn't inspired by the goal", th: "เชื่อในมัน / ไม่ได้ถูกจุดประกายจากเป้าหมาย", note: "เพราะคนที่เชื่อในเป้าหมายร่วมสำเร็จ แต่ออร์บิสันที่ไม่เชื่อกลับล้มเหลว ตัวอย่างนี้จึงเน้นเรื่องการมีค่านิยม/เป้าหมายร่วม จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "they recognised their own limitations", th: "พวกเขายอมรับข้อจำกัดของตัวเอง" },
        passagePhrase: { en: "they were aware that they weren't the most intelligent of the scientists", th: "พวกเขารู้ตัวว่าไม่ใช่นักวิทยาศาสตร์ที่ฉลาดที่สุด" },
        pairs: [
          { q: "recognised their own limitations", p: "they weren't the most intelligent", th: "ยอมรับว่าตัวเองไม่ได้เก่งที่สุด", note: "การ 'รู้ตัวว่าไม่ใช่คนฉลาดที่สุด' คือการยอมรับขีดจำกัดของตน ตรงกับตัวเลือก A" },
          { q: "recognised", p: "aware", th: "ตระหนัก/รู้ตัว" },
          { q: "won the race to discover", p: "succeeded", th: "ประสบความสำเร็จในการค้นพบก่อนคู่แข่ง" },
        ],
        keyVocab: { word: "weren't the most intelligent", th: "ไม่ใช่คนที่ฉลาดที่สุด", note: "การ 'รู้ว่าตัวเองไม่ใช่คนเก่งที่สุด' คือการยอมรับขีดจำกัดของตน จึงทำให้ขอความเห็นผู้อื่น นำไปสู่ความสำเร็จ ตอบ A" }
    },
    29: {
        questionPhrase: { en: "make people commit to an idea", th: "ทำให้คนผูกพันหรือยึดมั่นกับความคิด" },
        passagePhrase: { en: "the very act of writing makes us more likely to believe it", th: "แค่การลงมือเขียนก็ทำให้เราเชื่อสิ่งนั้นมากขึ้น" },
        pairs: [
          { q: "make people commit to an idea", p: "makes us more likely to believe it", th: "ทำให้คนเชื่อมั่น/ผูกพันกับความคิด", note: "การเขียนทำให้เราเชื่อมั่นในความคิดมากขึ้น = ทำให้คนผูกพันกับไอเดีย ตอบ D" },
          { q: "competitions on breakfast cereal packets", p: "competitions on breakfast cereal packets", th: "การประกวดบนกล่องซีเรียลอาหารเช้า" },
          { q: "commit", p: "engagement", th: "ความผูกพัน/มีส่วนร่วม" },
        ],
        keyVocab: { word: "writing makes us more likely to believe", th: "การเขียนทำให้เรามีแนวโน้มจะเชื่อมากขึ้น", note: "การเขียนเพิ่มความผูกพัน/ความเชื่อมั่นต่อความคิด ตรงกับตัวเลือกเรื่องทำให้คนเชื่อมั่นในไอเดีย จึงตอบ D" }
    },
    30: {
        questionPhrase: { en: "feel their contributions are valued", th: "รู้สึกว่าความคิดเห็นของตนมีคุณค่า" },
        passagePhrase: { en: "every recommendation is important and will be given full attention", th: "ทุกข้อเสนอแนะมีความสำคัญและจะได้รับการพิจารณาอย่างเต็มที่" },
        pairs: [
          { q: "their contributions are valued", p: "every recommendation is important", th: "ความคิดเห็นของตนมีคุณค่า", note: "ผู้นำควรทำให้พนักงานมั่นใจว่าทุกข้อเสนอมีความสำคัญ = ความคิดของพวกเขาถูกให้คุณค่า ตอบ B" },
          { q: "contributions", p: "recommendation", th: "ข้อเสนอ/สิ่งที่นำมาช่วย" },
          { q: "valued", p: "given full attention", th: "ได้รับความใส่ใจ/ให้คุณค่า" },
        ],
        keyVocab: { word: "every recommendation is important", th: "ทุกข้อเสนอแนะสำคัญ", note: "ผู้นำควรทำให้พนักงานมั่นใจว่าทุกข้อเสนอมีค่า = พนักงานต้องรู้สึกว่าความคิดของตนถูกให้คุณค่า จึงตอบ B" }
    },
    31: {
        questionPhrase: { en: "at times of change, people tend to play safe", th: "ยามมีการเปลี่ยนแปลง คนมักเลือกทางที่ปลอดภัยไว้ก่อน" },
        passagePhrase: { en: "when things change, we are hard-wired to play it safe", th: "เมื่อมีการเปลี่ยนแปลง เราถูกตั้งโปรแกรมมาให้เล่นแบบปลอดภัย" },
        pairs: [
          { q: "At times of change", p: "When things change", th: "ในช่วงที่มีการเปลี่ยนแปลง" },
          { q: "tend to", p: "hard-wired to", th: "มักจะ/ถูกฝังมาให้ทำ", note: "เมื่อมีการเปลี่ยนแปลง คนถูกตั้งโปรแกรมมาให้ 'เล่นปลอดภัย' ซึ่งเป็นคำตอบที่เติมช่อง 31 ตอบ G" },
        ],
        keyVocab: { word: "hard-wired to play it safe", th: "ถูกฝังมาในธรรมชาติให้เลือกทางปลอดภัย", note: "'play it safe' (เล่นปลอดภัย/หลีกเลี่ยงความเสี่ยง) คือคำตอบที่เติมช่อง 31 ตรงตัวเลือก G" }
    },
    32: {
        questionPhrase: { en: "if aware of potential loss, people will take risks", th: "ถ้ารู้ว่าอาจสูญเสีย คนจะยอมเสี่ยงมากขึ้น" },
        passagePhrase: { en: "we take more gambles when threatened with a loss", th: "เราเสี่ยงมากขึ้นเมื่อถูกคุกคามด้วยการสูญเสีย" },
        pairs: [
          { q: "what they might lose", p: "threatened with a loss", th: "สิ่งที่อาจสูญเสีย", note: "เมื่อรู้ว่าอาจสูญเสีย คนจะ 'เสี่ยง/เดิมพัน' มากขึ้น ตอบ E" },
          { q: "aware of", p: "threatened with", th: "รับรู้/เผชิญกับ" },
          { q: "they will often", p: "we invariably", th: "พวกเขามักจะ" },
        ],
        keyVocab: { word: "take more gambles", th: "ยอมเสี่ยง/เดิมพันมากขึ้น", contrastA: "loss . การสูญเสีย", contrastB: "reward . รางวัล", note: "เมื่อกลัวสูญเสีย คนจะ 'เสี่ยง' มากกว่าตอนได้รางวัล 'gamble' = เสี่ยง จึงตอบ E (เสี่ยงมากขึ้น)" }
    },
    33: {
        questionPhrase: { en: "people working under threat", th: "คนที่ทำงานภายใต้ภาวะถูกคุกคาม/กดดัน" },
        passagePhrase: { en: "we take more gambles when threatened with a loss", th: "เราเสี่ยงมากขึ้นเมื่อถูกคุกคามด้วยการสูญเสีย" },
        pairs: [
          { q: "working under", p: "threatened with a loss", th: "ทำงานภายใต้ภาวะถูกคุกคาม/กดดัน", note: "คนที่ทำงานภายใต้ 'การถูกคุกคามด้วยการสูญเสีย' จะยอมเสี่ยงมากขึ้น คำว่า threatened เชื่อมโจทย์กับคำตอบ A" },
          { q: "People", p: "we", th: "ผู้คน/เรา" },
        ],
        keyVocab: { word: "threatened with a loss", th: "ถูกคุกคามด้วยการสูญเสีย", note: "คนที่ทำงานภายใต้ 'การถูกคุกคาม' จะยอมเสี่ยงมากขึ้น คำว่า threatened เชื่อมโจทย์กับคำตอบ A" }
    },
    34: {
        questionPhrase: { en: "employees in organisations with few rules", th: "พนักงานในองค์กรที่มีกฎเกณฑ์น้อย" },
        passagePhrase: { en: "the only rule was that there were no rules; free interchange of ideas", th: "กฎเดียวคือไม่มีกฎ ทำให้แลกเปลี่ยนความคิดได้อย่างอิสระ" },
        pairs: [
          { q: "organisations with few rules", p: "the only rule was that there were no rules", th: "องค์กรที่มีกฎเกณฑ์น้อย/ไม่มีกฎ", note: "องค์กร 'กฎน้อย' = กลุ่มเมมฟิสที่ 'ไม่มีกฎ' ทำให้คนแลกเปลี่ยนไอเดียอย่างอิสระและสร้างสรรค์มากขึ้น ตอบ F" },
          { q: "Employees", p: "young designers", th: "พนักงาน/ผู้คนในองค์กร" },
          { q: "more likely to", p: "encouraged", th: "มีแนวโน้มมากขึ้นที่จะ" },
        ],
        keyVocab: { word: "no rules / free interchange of ideas", th: "ไม่มีกฎ / แลกเปลี่ยนความคิดอย่างอิสระ", note: "องค์กร 'กฎน้อย' = Memphis ที่ 'ไม่มีกฎ' ทำให้คนแบ่งปันไอเดียได้เสรี จึงสร้างสรรค์มากขึ้น ตอบ F" }
    },
    35: {
        questionPhrase: { en: "an environment that encourages exchange of ideas", th: "สภาพแวดล้อมที่ส่งเสริมการแลกเปลี่ยนความคิด" },
        passagePhrase: { en: "this environment encouraged a free interchange of ideas", th: "สภาพแวดล้อมนี้ส่งเสริมการแลกเปลี่ยนความคิดอย่างอิสระ" },
        pairs: [
          { q: "encourages exchange of ideas", p: "encouraged a free interchange of ideas", th: "ส่งเสริมการแลกเปลี่ยนความคิด", note: "สภาพแวดล้อมที่ไม่มีกฎส่งเสริมการแลกเปลี่ยนไอเดียอย่างอิสระ นำไปสู่ความคิดสร้างสรรค์ ตอบ B" },
          { q: "environment", p: "This environment", th: "สภาพแวดล้อม" },
          { q: "exchange of ideas", p: "interchange of ideas", th: "การแลกเปลี่ยนความคิด" },
        ],
        keyVocab: { word: "free interchange of ideas", th: "การแลกเปลี่ยนความคิดอย่างเสรี", note: "การไม่มีกฎทำให้เกิดการแลกเปลี่ยนไอเดียอย่างอิสระ นำไปสู่ความคิดสร้างสรรค์ จึงตอบ B" }
    },
    36: {
        questionPhrase: { en: "physical surroundings affect how creative people feel", th: "สภาพแวดล้อมทางกายภาพส่งผลต่อความรู้สึกสร้างสรรค์" },
        passagePhrase: { en: "luxurious centres... don't make them feel creative; some without space innovate successfully", th: "ศูนย์หรูหรากลับไม่ทำให้รู้สึกสร้างสรรค์ ส่วนคนไม่มีพื้นที่กลับสร้างสรรค์ได้สำเร็จ" },
        pairs: [
          { q: "physical surroundings", p: "luxurious, state-of-the-art centres", th: "สภาพแวดล้อมทางกายภาพ", note: "ผู้เขียนชี้ว่าศูนย์หรูหรากลับไม่ทำให้รู้สึกสร้างสรรค์ ขณะที่คนไม่มีพื้นที่กลับสร้างสรรค์ได้ ขัดกับโจทย์ ตอบ NO" },
          { q: "creative", p: "feel at all creative", th: "สร้างสรรค์" },
        ],
        keyVocab: { word: "don't make them feel at all creative", th: "ไม่ได้ทำให้รู้สึกสร้างสรรค์เลย", note: "ผู้เขียนบอกว่าสภาพแวดล้อมหรูหราไม่ได้รับประกันความคิดสร้างสรรค์ ซึ่งขัดกับข้อความในโจทย์ จึงตอบ NO" }
    },
    37: {
        questionPhrase: { en: "most people have the potential to be creative", th: "คนส่วนใหญ่มีศักยภาพที่จะสร้างสรรค์ได้" },
        passagePhrase: { en: "almost every individual can be creative in the right circumstances", th: "เกือบทุกคนสามารถสร้างสรรค์ได้ในสภาวะที่เหมาะสม" },
        pairs: [
          { q: "Most people", p: "almost every individual", th: "คนส่วนใหญ่/เกือบทุกคน", note: "'almost every individual' = 'most people' และ 'can be creative' = 'potential to be creative' ตรงกัน ตอบ YES" },
          { q: "potential to be creative", p: "can be creative in the right circumstances", th: "มีศักยภาพที่จะสร้างสรรค์ได้" },
        ],
        keyVocab: { word: "almost every individual can be creative", th: "เกือบทุกคนสามารถสร้างสรรค์ได้", note: "'almost every individual' = 'most people' และ 'can be creative' = 'potential to be creative' ตรงกัน จึงตอบ YES" }
    },
    38: {
        questionPhrase: { en: "teams work best with equally matched intelligence", th: "ทีมทำงานได้ดีที่สุดเมื่อสมาชิกฉลาดเท่ากัน" },
        passagePhrase: { en: "three people will be better than one... even if that one is the smartest", th: "สามคนดีกว่าหนึ่งคน แม้คนเดียวนั้นจะฉลาดที่สุดก็ตาม" },
        pairs: [
          { q: "Teams work best", p: "three people will be better than one", th: "ทีมทำงานได้ดี/สามคนดีกว่าหนึ่งคน", note: "บทความพูดถึง 'จำนวนคน' (สามดีกว่าหนึ่ง) ไม่ได้พูดถึงระดับความฉลาดที่ 'เท่ากัน' จึงไม่มีข้อมูลยืนยัน ตอบ NOT GIVEN" },
          { q: "intelligence", p: "smartest person", th: "ความฉลาด/สติปัญญา" },
        ],
        keyVocab: { word: "three people better than one", th: "สามคนดีกว่าหนึ่งคน", note: "บทความพูดถึงจำนวนคน ไม่ได้พูดถึงระดับความฉลาดที่ 'เท่ากัน' จึงไม่มีข้อมูลยืนยัน ตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "smaller companies find it easier to innovate", th: "บริษัทเล็กสร้างนวัตกรรมได้ง่ายกว่า" },
        passagePhrase: { en: "easy for a company to be pulled in conflicting directions", th: "บริษัทอาจถูกดึงไปคนละทิศทางได้ง่าย" },
        pairs: [
          { q: "companies", p: "a company", th: "บริษัท", note: "บทความพูดถึงบริษัทถูกดึงไปคนละทิศ แต่ไม่เคยเปรียบเทียบขนาดบริษัทเล็กกับใหญ่ในการสร้างนวัตกรรม จึงไม่มีข้อมูล ตอบ NOT GIVEN" },
          { q: "innovative", p: "conflicting directions", th: "สร้างนวัตกรรม / (ในบทพูดถึงทิศทางขัดแย้ง ไม่ใช่ขนาดบริษัท)" },
        ],
        keyVocab: { word: "conflicting directions", th: "ทิศทางที่ขัดแย้งกัน", note: "บทความไม่เคยเปรียบเทียบขนาดบริษัทเล็กกับใหญ่ในการสร้างนวัตกรรม จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "a manager's approval is more persuasive than a peer's", th: "การเห็นชอบของผู้จัดการโน้มน้าวได้มากกว่าเพื่อนร่วมงาน" },
        passagePhrase: { en: "peer power... is much more powerful than any boss's speech", th: "พลังของเพื่อนร่วมงานมีพลังมากกว่าคำพูดของเจ้านาย" },
        pairs: [
          { q: "A manager's approval", p: "boss's speech", th: "การเห็นชอบ/คำพูดของผู้จัดการ", note: "ผู้เขียนบอกตรงข้าม คือ 'พลังเพื่อนร่วมงาน' โน้มน้าวได้มากกว่าคำพูดของเจ้านาย จึงขัดกับโจทย์ ตอบ NO" },
          { q: "more persuasive", p: "much more powerful", th: "โน้มน้าว/ทรงพลังมากกว่า" },
          { q: "than that of", p: "peer power", th: "มากกว่าของเพื่อนร่วมงาน" },
        ],
        keyVocab: { word: "peer power more powerful than boss's speech", th: "พลังเพื่อนร่วมงานมากกว่าคำพูดเจ้านาย", contrastA: "boss / manager . เจ้านาย/ผู้จัดการ", contrastB: "peer . เพื่อนร่วมงานระดับเดียวกัน", note: "ผู้เขียนบอกตรงข้าม คือเพื่อนร่วมงานโน้มน้าวได้มากกว่าเจ้านาย จึงขัดกับโจทย์ ตอบ NO" }
    },
  },
  "Cambridge 10 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "the novel has been around for so long", th: "นวนิยายมีมานานแล้ว" },
        passagePhrase: { en: "the novel has evolved because of technological developments to print huge numbers of texts", th: "นวนิยายพัฒนาขึ้นเพราะเทคโนโลยีที่พิมพ์ข้อความได้จำนวนมาก" },
        pairs: [
          { q: "the novel", p: "the novel", th: "นวนิยาย" },
          { q: "for so long", p: "has evolved precisely because of technological developments", th: "มีมานานเพราะพัฒนามาตามเทคโนโลยี" },
          { q: "with novels", p: "print out huge numbers of texts", th: "พิมพ์ข้อความออกมาเป็นจำนวนมาก", note: "ตัวเลือก B เรื่องการพิมพ์จำนวนมากโยงกับ 'print out huge numbers of texts' จึงตอบ B" },
        ],
        keyVocab: { word: "print out huge numbers of texts", th: "พิมพ์ข้อความออกมาเป็นจำนวนมาก", note: "คำว่า reproduction/printing ในตัวเลือก B โยงกับ 'print out huge numbers' ในเนื้อเรื่อง ทำให้ตอบ B" }
    },
    28: {
        questionPhrase: { en: "with novels, the ___ are the most important thing", th: "กับนวนิยาย สิ่งที่สำคัญที่สุดคือ ___" },
        passagePhrase: { en: "the reader attends mainly to the meaning of words", th: "ผู้อ่านสนใจความหมายของคำเป็นหลัก" },
        pairs: [
          { q: "the most important thing", p: "attends mainly to", th: "ให้ความสำคัญเป็นหลัก" },
          { q: "with novels", p: "With novels", th: "กับนวนิยาย" },
          { q: "the", p: "the meaning of words", th: "ความหมายของคำ", note: "ช่องว่างคือสิ่งที่สำคัญที่สุดของนวนิยาย = 'meaning of words' จึงตอบ H" },
        ],
        keyVocab: { word: "meaning of words", th: "ความหมายของคำ", note: "ตัวเลือก H = 'meanings/words' โยงกับ 'meaning of words' ในเนื้อเรื่องโดยตรง จึงตอบ H" }
    },
    29: {
        questionPhrase: { en: "artists instructed others to produce copies of their work", th: "ศิลปินสั่งให้คนอื่นทำสำเนางานของตน" },
        passagePhrase: { en: "assign the reproduction of their creations to their workshop apprentices", th: "มอบหมายให้ลูกมือในเวิร์กช็อปทำสำเนาผลงาน" },
        pairs: [
          { q: "artists such as Leonardo", p: "artists", th: "ศิลปิน" },
          { q: "instruct", p: "assign", th: "สั่ง/มอบหมาย" },
          { q: "to produce copies of their work", p: "the reproduction of their creations", th: "ทำสำเนาผลงานของตน" },
          { q: "to produce copies of their work and these days", p: "workshop apprentices", th: "ลูกมือ/เด็กฝึกในเวิร์กช็อป", note: "ผู้ที่ถูกสั่งให้ทำสำเนาคือ 'workshop apprentices' จึงเติมคำตอบ L = apprentices" },
        ],
        keyVocab: { word: "workshop apprentices", th: "ลูกมือ/เด็กฝึกงานในเวิร์กช็อป", note: "'instruct ___ to produce copies' โยงกับ 'assign reproduction to apprentices' คำตอบ L คือ apprentices" }
    },
    30: {
        questionPhrase: { en: "reproduction replicates surface relief, colour and ___", th: "การทำสำเนาเลียนแบบผิวนูน สี และ ___" },
        passagePhrase: { en: "high-quality prints made exactly to the original scale", th: "ภาพพิมพ์คุณภาพสูงที่ทำตามขนาดต้นฉบับเป๊ะ" },
        pairs: [
          { q: "new methods of reproduction", p: "reprographic techniques", th: "เทคนิคการทำสำเนา" },
          { q: "excellent replication", p: "high-quality prints", th: "การทำสำเนาที่ยอดเยี่ยม/คุณภาพสูง" },
          { q: "surface relief features", p: "surface relief", th: "ผิวนูนของภาพ" },
          { q: "colour and", p: "to the original scale", th: "ตามขนาดต้นฉบับ", note: "นอกจากสีและผิวนูน ยังเลียนแบบ 'original scale' ได้ จึงเติม G = size/scale" },
        ],
        keyVocab: { word: "to the original scale", th: "ตามขนาดต้นฉบับ", note: "ช่องว่างต้องการคุณสมบัติที่ถูกเลียนแบบ; 'original scale' = 'size/scale' จึงตอบ G" }
    },
    31: {
        questionPhrase: { en: "promoting originals is not in the interests of the ___", th: "การเชิดชูงานต้นฉบับไม่เป็นประโยชน์ต่อ ___" },
        passagePhrase: { en: "severe limitations on the kind of experience offered to visitors", th: "ข้อจำกัดรุนแรงต่อประสบการณ์ที่มอบให้ผู้เข้าชม" },
        pairs: [
          { q: "museums still promote the superiority of original works", p: "museums continue to promote the special status of original work", th: "พิพิธภัณฑ์ยังเชิดชูสถานะพิเศษของงานต้นฉบับ" },
          { q: "may not be in the interests of the", p: "place severe limitations on the kind of experience offered to visitors", th: "ไม่เป็นผลดีต่อ (ผู้เข้าชม)", note: "ผู้ที่เสียประโยชน์คือ 'visitors' จึงเติม D = public/visitors" },
        ],
        keyVocab: { word: "visitors", th: "ผู้เข้าชม/ผู้ชม", note: "'interests of the ___' โยงกับ 'experience offered to visitors' จึงตอบ D = public/visitors" }
    },
    32: {
        questionPhrase: { en: "why visitors feel of low value in museums", th: "ทำไมผู้ชมรู้สึกว่าตนเองด้อยค่าในพิพิธภัณฑ์" },
        passagePhrase: { en: "difficult not to be impressed by one's own relative 'worthlessness'", th: "ยากที่จะไม่รู้สึกถึงความ 'ไร้ค่า' ของตนเอง" },
        pairs: [
          { q: "London's National Gallery", p: "London's National Gallery", th: "หอศิลป์แห่งชาติลอนดอน" },
          { q: "to illustrate", p: "any one of which is likely to be worth more than all the average visitor possesses", th: "เพื่อแสดงให้เห็น (ว่างานมีมูลค่ามหาศาล)" },
          { q: "to illustrate", p: "one's own relative 'worthlessness'", th: "ความรู้สึกด้อยค่าของตนเอง", note: "ยกหอศิลป์มาเพื่อชี้ว่าผู้ชมรู้สึกด้อยค่าเมื่อเทียบกับมูลค่างาน จึงตอบ C" },
        ],
        keyVocab: { word: "worthlessness", th: "ความไร้ค่า/ความด้อยค่า", note: "National Gallery ยกมาเพื่อแสดงว่าผู้ชมรู้สึกด้อยค่าเมื่อเทียบกับมูลค่างาน จึงตอบ C" }
    },
    33: {
        questionPhrase: { en: "viewers unwilling to criticise the work", th: "ผู้ชมไม่กล้าวิจารณ์ผลงาน" },
        passagePhrase: { en: "nothing the viewer thinks is going to alter that value", th: "สิ่งที่ผู้ชมคิดไม่อาจเปลี่ยนมูลค่านั้นได้" },
        pairs: [
          { q: "unwilling to criticise", p: "deterred from trying to extend that spontaneous, immediate, self-reliant kind of reading", th: "ไม่กล้าวิจารณ์/ถูกขัดขวางจากการตีความเอง" },
          { q: "because", p: "nothing the viewer thinks about the work is going to alter that value", th: "เพราะความเห็นของผู้ชมเปลี่ยนมูลค่าไม่ได้", note: "ผู้ชมไม่กล้าวิจารณ์เพราะความคิดเปลี่ยน 'value' ไม่ได้ จึงตอบ D" },
        ],
        keyVocab: { word: "alter that value", th: "เปลี่ยนแปลงมูลค่านั้น", note: "'unwilling to criticise' โยงกับ 'deterred from reading'; เพราะความเห็นเปลี่ยนมูลค่าไม่ได้ จึงตอบ D" }
    },
    34: {
        questionPhrase: { en: "cause of the 'displacement effect'", th: "สาเหตุของ 'displacement effect'" },
        passagePhrase: { en: "an environment for which they were not originally created", th: "สภาพแวดล้อมที่ไม่ได้ถูกสร้างมาเพื่องานเหล่านั้นแต่แรก" },
        pairs: [
          { q: "the 'displacement effect'", p: "This 'displacement effect'", th: "ปรากฏการณ์งานหลุดที่หลุดทาง" },
          { q: "on the visitor", p: "The visitor may then be struck by the strangeness", th: "ที่ผู้ชมรู้สึก" },
          { q: "is caused by", p: "an environment for which they were not originally created", th: "เกิดจากการอยู่ในที่ที่ไม่ได้สร้างมาเพื่อมัน", note: "displacement effect เกิดเพราะงานถูกนำมาอยู่ในสภาพแวดล้อมที่ไม่ได้สร้างมาเพื่อมัน จึงตอบ A" },
        ],
        keyVocab: { word: "not originally created for", th: "ไม่ได้ถูกสร้างมาเพื่อ (สภาพแวดล้อมนั้น) แต่แรก", note: "displacement effect เกิดเพราะงานถูกนำมาอยู่ในที่ที่ไม่ได้สร้างมาเพื่อมัน จึงตอบ A" }
    },
    35: {
        questionPhrase: { en: "unlike other art forms, a painting has no set viewing time", th: "ต่างจากศิลปะแขนงอื่น ภาพวาดไม่มีเวลาชมที่กำหนดไว้" },
        passagePhrase: { en: "there is no prescribed time over which a painting is viewed", th: "ไม่มีเวลาที่กำหนดไว้สำหรับการชมภาพวาด" },
        pairs: [
          { q: "unlike other forms of art", p: "A fundamental difference between paintings and other art forms", th: "ต่างจากศิลปะแขนงอื่น" },
          { q: "unlike other forms of art", p: "there is no prescribed time over which a painting is viewed", th: "ภาพวาดไม่มีเวลาชมที่กำหนดไว้", note: "ความต่างคือภาพวาด 'no prescribed time' ในการชม จึงตอบ D" },
        ],
        keyVocab: { word: "no prescribed time", th: "ไม่มีเวลาที่ถูกกำหนดไว้", note: "'unlike other forms' โยงกับ 'fundamental difference'; ภาพวาดไม่มีเวลาชมตายตัว จึงตอบ D" }
    },
    36: {
        questionPhrase: { en: "art history should find meaning using a specific method", th: "ประวัติศาสตร์ศิลป์ควรหาความหมายด้วยวิธีเฉพาะอย่าง" },
        passagePhrase: { en: "discovering the meaning of art within the cultural context of its time", th: "ค้นหาความหมายของศิลปะภายในบริบททางวัฒนธรรมของยุคนั้น" },
        pairs: [
          { q: "discovering the meaning of art", p: "'discovering the meaning' of art", th: "ค้นหาความหมายของศิลปะ" },
          { q: "Art history", p: "the art historian", th: "ประวัติศาสตร์ศิลป์/นักประวัติศาสตร์ศิลป์" },
          { q: "should focus on", p: "the dominant critical approach becomes", th: "ควรมุ่งเน้น (แต่เนื้อเรื่องบอกแค่ว่าเป็นแนวที่ครอบงำ)", note: "เนื้อเรื่องบอกว่านัก ปวศ.ศิลป์ 'ทำ' อะไร ไม่ได้บอกว่า 'ควร' ทำ จึงเป็น NOT GIVEN" },
        ],
        keyVocab: { word: "should focus on", th: "ควรมุ่งเน้นไปที่", note: "เนื้อเรื่องบอกว่านักประวัติศาสตร์ศิลป์ 'ทำ' อะไร แต่ไม่ได้บอกว่า 'ควร' ทำ จึงเป็น NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "art historians' approach conflicts with museums", th: "แนวทางของนักประวัติศาสตร์ศิลป์ขัดแย้งกับพิพิธภัณฑ์" },
        passagePhrase: { en: "this is in perfect harmony with the museum's function", th: "สิ่งนี้สอดคล้องกลมกลืนกับหน้าที่ของพิพิธภัณฑ์อย่างสมบูรณ์" },
        pairs: [
          { q: "The approach of art historians", p: "the dominant critical approach becomes that of the art historian", th: "แนวทางของนักประวัติศาสตร์ศิลป์" },
          { q: "conflicts with that of art museums", p: "This is in perfect harmony with the museum's function", th: "สอดคล้องกับพิพิธภัณฑ์ (ไม่ใช่ขัดแย้ง)", note: "คำถามว่า 'conflicts' แต่เนื้อเรื่องว่า 'perfect harmony' ตรงข้ามกัน จึงตอบ NO" },
        ],
        keyVocab: { word: "perfect harmony", th: "สอดคล้องกลมกลืนอย่างสมบูรณ์", contrastA: "conflicts . ขัดแย้ง", contrastB: "harmony . สอดคล้องกัน", note: "คำถามว่า 'conflicts' แต่เนื้อเรื่องว่า 'perfect harmony' ตรงข้ามกัน จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "people should be encouraged to express opinions openly", th: "ควรสนับสนุนให้คนแสดงความเห็นอย่างเปิดเผย" },
        passagePhrase: { en: "a warning of what emerges when spontaneous criticism is suppressed", th: "คำเตือนถึงสิ่งที่เกิดขึ้นเมื่อการวิจารณ์ตามธรรมชาติถูกกดทับ" },
        pairs: [
          { q: "give their opinions openly", p: "express their views", th: "แสดงความคิดเห็นอย่างเปิดเผย" },
          { q: "People should be encouraged", p: "given the confidence", th: "ควรได้รับการส่งเสริม/ให้ความมั่นใจ" },
          { q: "works of art", p: "spontaneous criticism is suppressed", th: "การวิจารณ์ศิลปะตามธรรมชาติถูกกดทับ", note: "ผู้เขียนหนุนให้ผู้ชมแสดงความเห็นและเตือนผลร้ายเมื่อถูกกด จึงตอบ YES" },
        ],
        keyVocab: { word: "spontaneous criticism is suppressed", th: "การวิจารณ์ตามธรรมชาติถูกกดทับ", note: "ผู้เขียนเตือนถึงผลร้ายเมื่อ 'กด' การวิจารณ์ จึงสื่อว่าควรส่งเสริมให้แสดงความเห็น ตอบ YES" }
    },
    39: {
        questionPhrase: { en: "reproductions should only be sold if high quality", th: "ควรขายงานทำสำเนาเฉพาะเมื่อมีคุณภาพสูง" },
        passagePhrase: { en: "rendered accessible by means of high-fidelity reproductions", th: "ทำให้เข้าถึงได้ด้วยงานทำสำเนาความเที่ยงตรงสูง" },
        pairs: [
          { q: "Reproductions of fine art", p: "high-fidelity reproductions", th: "งานทำสำเนาศิลปะ" },
          { q: "if they are of high quality", p: "high-fidelity", th: "ความเที่ยงตรง/คุณภาพสูง" },
          { q: "sold to the public", p: "rendered permanently accessible to the public", th: "ทำให้สาธารณชนเข้าถึง (ไม่ใช่ 'ขาย')", note: "เนื้อเรื่องพูดถึงการเข้าถึง ไม่ได้พูดเรื่องเงื่อนไขการ 'ขาย' จึงเป็น NOT GIVEN" },
        ],
        keyVocab: { word: "high-fidelity reproductions", th: "งานทำสำเนาความเที่ยงตรงสูง", note: "เนื้อเรื่องพูดถึงการเข้าถึง ไม่ได้พูดเรื่อง 'ขาย' หรือเงื่อนไขการขาย จึงเป็น NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "powerful people will encourage more people to enjoy art", th: "ผู้มีอำนาจจะส่งเสริมให้คนชื่นชมศิลปะมากขึ้น" },
        passagePhrase: { en: "too much to ask from those who seek to maintain and control the art establishment", th: "เป็นการขอที่มากเกินไปจากผู้ที่ต้องการรักษาและควบคุมวงการศิลปะ" },
        pairs: [
          { q: "those with power", p: "those who seek to maintain and control the art establishment", th: "ผู้มีอำนาจ/ผู้ที่ควบคุมวงการศิลปะ" },
          { q: "encourage more people to enjoy art", p: "too much to ask", th: "ส่งเสริมให้คนชื่นชมศิลปะ (แต่คงไม่เกิด)", note: "ผู้เขียนว่าผู้มีอำนาจอยากควบคุม การหวังให้ส่งเสริมคือ 'too much to ask' จึงตอบ NO" },
        ],
        keyVocab: { word: "too much to ask", th: "เป็นการขอที่มากเกินไป (คงไม่เกิดขึ้น)", contrastA: "encourage . ส่งเสริม", contrastB: "maintain and control . รักษาและควบคุม", note: "ผู้เขียนว่าผู้มีอำนาจอยากควบคุม คงไม่ส่งเสริม ('too much to ask') จึงตอบ NO" }
    },
  },
  "Cambridge 10 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "the cemetery, which is the oldest in the Pacific", th: "สุสานซึ่งเก่าแก่ที่สุดในแปซิฟิก" },
        passagePhrase: { en: "the oldest cemetery ever found in the Pacific islands", th: "สุสานที่เก่าแก่ที่สุดเท่าที่เคยพบในหมู่เกาะแปซิฟิก" },
        pairs: [
          { q: "cemetery", p: "cemetery", th: "สุสาน" },
          { q: "oldest", p: "oldest", th: "เก่าแก่ที่สุด", note: "ข้อความบอกตรง ๆ ว่าเป็นสุสานที่เก่าแก่ที่สุดในแปซิฟิก จึงเลือกตัวเลือกที่ระบุว่าเก่าแก่ที่สุด (B)" },
          { q: "Pacific", p: "Pacific islands", th: "หมู่เกาะแปซิฟิก" },
        ],
        keyVocab: { word: "oldest cemetery ever found", th: "สุสานที่เก่าแก่ที่สุดเท่าที่เคยพบ", note: "ข้อความบอกตรง ๆ ว่าเป็นสุสานที่เก่าแก่ที่สุด จึงเลือกตัวเลือกที่ระบุว่าเก่าแก่ที่สุด (B)" }
    },
    28: {
        questionPhrase: { en: "uncovered accidentally by an agricultural worker", th: "ถูกค้นพบโดยบังเอิญโดยคนงานเกษตร" },
        passagePhrase: { en: "The site came to light only by chance", th: "แหล่งโบราณคดีถูกพบโดยบังเอิญเท่านั้น" },
        pairs: [
          { q: "uncovered accidentally", p: "came to light only by chance", th: "ถูกพบโดยบังเอิญ", note: "'by chance' ในเรื่อง = 'accidentally' ในคำถาม ยืนยันว่าค้นพบโดยบังเอิญ (F)" },
          { q: "agricultural worker", p: "An agricultural worker", th: "คนงานเกษตร" },
        ],
        keyVocab: { word: "by chance", th: "โดยบังเอิญ", note: "'by chance' ในเรื่อง = 'accidentally' ในคำถาม ยืนยันว่าการค้นพบเกิดขึ้นโดยบังเอิญ (F)" }
    },
    29: {
        questionPhrase: { en: "things they took on voyages, including animals and tools", th: "สิ่งที่พวกเขานำติดตัวไป รวมถึงสัตว์เลี้ยงและเครื่องมือ" },
        passagePhrase: { en: "carried with them their livestock, taro seedlings and stone tools", th: "นำปศุสัตว์ ต้นกล้าเผือก และเครื่องมือหินติดตัวไปด้วย" },
        pairs: [
          { q: "things they took", p: "carried with them", th: "สิ่งที่นำติดตัวไป" },
          { q: "animals", p: "livestock", th: "ปศุสัตว์ / สัตว์เลี้ยง", note: "'livestock' (ปศุสัตว์) คือสัตว์ที่นำไปด้วยนอกเหนือจากเครื่องมือ จึงเลือกตัวเลือกที่หมายถึงสัตว์ (i)" },
          { q: "tools", p: "stone tools", th: "เครื่องมือ" },
        ],
        keyVocab: { word: "livestock", th: "ปศุสัตว์ / สัตว์เลี้ยง", note: "'livestock' (ปศุสัตว์) คือสิ่งที่นำไปด้วยนอกเหนือจากเครื่องมือ จึงเลือกตัวเลือกที่หมายถึงสัตว์ (i)" }
    },
    30: {
        questionPhrase: { en: "an item found at the site that is very important", th: "สิ่งของที่พบในแหล่งซึ่งสำคัญมาก" },
        passagePhrase: { en: "a Lapita burial urn with modeled birds arranged on the rim", th: "โกศบรรจุศพชาวลาปิตาที่มีรูปนกปั้นเรียงบนขอบ" },
        pairs: [
          { q: "item found at the site", p: "Other items included a Lapita burial urn", th: "สิ่งของที่พบในแหล่ง" },
          { q: "very important", p: "an important discovery", th: "สำคัญมาก" },
          { q: "found inside", p: "sealed inside", th: "อยู่ข้างใน", note: "'burial urn' (โกศ) คือสิ่งสำคัญที่พบในแหล่ง จึงเลือกตัวเลือกที่หมายถึงภาชนะ/โกศ (G)" },
        ],
        keyVocab: { word: "burial urn", th: "โกศบรรจุศพ", note: "'burial urn' (โกศ) คือสิ่งสำคัญที่พบในแหล่ง จึงเลือกตัวเลือกที่หมายถึงภาชนะ/โกศ (G)" }
    },
    31: {
        questionPhrase: { en: "what is found inside are Lapita", th: "สิ่งที่อยู่ข้างในเป็นของชาวลาปิตา" },
        passagePhrase: { en: "the human remains sealed inside", th: "ซากศพมนุษย์ที่ถูกปิดผนึกอยู่ข้างใน" },
        pairs: [
          { q: "found inside", p: "sealed inside", th: "อยู่ข้างใน" },
          { q: "are Lapita", p: "identifies the remains as Lapita", th: "เป็นของชาวลาปิตา", note: "สิ่งที่อยู่ในโกศคือ 'human remains' (ซากศพ) ที่ยืนยันว่าเป็นชาวลาปิตา จึงเลือก (D)" },
        ],
        keyVocab: { word: "human remains", th: "ซากศพมนุษย์", note: "สิ่งที่อยู่ข้างในโกศคือ 'human remains' (ซากศพ) ซึ่งได้รับการยืนยันว่าเป็นชาวลาปิตา จึงเลือก (D)" }
    },
    32: {
        questionPhrase: { en: "difficulties explaining how the Lapita made their journeys", th: "ความยากในการอธิบายว่าชาวลาปิตาเดินทางได้อย่างไร" },
        passagePhrase: { en: "No-one has found one of their canoes or any rigging", th: "ไม่มีใครเคยพบเรือแคนูหรืออุปกรณ์เดินเรือของพวกเขาเลย" },
        pairs: [
          { q: "difficulties explaining how", p: "could reveal how the canoes were sailed", th: "ความยากในการอธิบายวิธีการ" },
          { q: "their journeys", p: "ocean voyages", th: "การเดินทางของพวกเขา" },
          { q: "because", p: "No-one has found one of their canoes or any rigging", th: "เพราะไม่มีหลักฐานหลงเหลือ", note: "ไม่พบเรือหรืออุปกรณ์ และตำนานก็ไม่ช่วย จึงไม่มีหลักฐานบอกวิธีเดินเรือ ตอบ (C)" },
        ],
        keyVocab: { word: "no-one has found", th: "ไม่มีใครเคยพบ", note: "ไม่พบหลักฐานเรือหรืออุปกรณ์ จึงไม่มีข้อมูลบอกวิธีเดินเรือ ตัวเลือกที่ว่าไม่มีหลักฐานหลงเหลือจึงถูก (C)" }
    },
    33: {
        questionPhrase: { en: "what was extraordinary about the Lapita", th: "อะไรคือสิ่งที่ไม่ธรรมดาเกี่ยวกับชาวลาปิตา" },
        passagePhrase: { en: "sailed out of sight of land, with empty horizons on every side", th: "แล่นเรือออกไปจนมองไม่เห็นแผ่นดิน ขอบฟ้าว่างเปล่ารอบด้าน" },
        pairs: [
          { q: "extraordinary", p: "The real adventure", th: "ไม่ธรรมดา / น่าทึ่ง" },
          { q: "the Lapita", p: "Lapita descendants", th: "ชาวลาปิตา" },
          { q: "what was extraordinary", p: "sailed out of sight of land, with empty horizons on every side", th: "แล่นเรือพ้นสายตาจากแผ่นดิน", note: "สิ่งไม่ธรรมดาคือกล้าแล่นเรือจนมองไม่เห็นแผ่นดิน ต่างจากบรรพบุรุษ จึงเลือก (A)" },
        ],
        keyVocab: { word: "out of sight of land", th: "พ้นสายตาจากแผ่นดิน", note: "สิ่งที่ไม่ธรรมดาคือพวกเขากล้าแล่นเรือพ้นสายตาจากแผ่นดิน ต่างจากบรรพบุรุษ จึงเลือก (A)" }
    },
    34: {
        questionPhrase: { en: "what 'This' refers to in paragraph seven", th: "คำว่า 'This' หมายถึงอะไรในย่อหน้าเจ็ด" },
        passagePhrase: { en: "they could turn about and catch a swift ride back on the trade winds", th: "พวกเขาหันเรือกลับและอาศัยลมค้ากลับมาได้อย่างรวดเร็ว" },
        pairs: [
          { q: "This", p: "turn about and catch a swift ride back on the trade winds", th: "การหันเรือกลับโดยอาศัยลมค้า", note: "'This' ชี้ถึงความสามารถหันเรือกลับโดยอาศัยลมค้ากลับบ้านได้ปลอดภัย จึงเลือก (D)" },
          { q: "made the whole thing work", p: "would have made the whole thing work", th: "ทำให้ทุกอย่างเป็นไปได้" },
        ],
        keyVocab: { word: "catch a ride back on the trade winds", th: "อาศัยลมค้าเดินทางกลับ", note: "'This' ชี้ถึงความสามารถหันเรือกลับโดยอาศัยลมค้า จึงเลือกตัวเลือกที่กล่าวถึงการกลับบ้านได้ปลอดภัย (D)" }
    },
    35: {
        questionPhrase: { en: "how the geography of the region was significant", th: "ภูมิศาสตร์ของภูมิภาคสำคัญอย่างไร" },
        passagePhrase: { en: "the geography of their own archipelagoes would have provided a safety net", th: "ภูมิศาสตร์ของหมู่เกาะของพวกเขาเองทำหน้าที่เป็นตาข่ายนิรภัย" },
        pairs: [
          { q: "geography of the region", p: "the geography of their own archipelagoes", th: "ภูมิศาสตร์ของภูมิภาค" },
          { q: "significant", p: "provided a safety net", th: "มีความสำคัญ / เป็นที่พึ่ง", note: "'safety net' หมายถึงภูมิศาสตร์ช่วยให้นักเดินเรือกลับบ้านได้ปลอดภัยแม้พลาด จึงเลือก (C)" },
        ],
        keyVocab: { word: "safety net", th: "ตาข่ายนิรภัย / ที่รองรับความปลอดภัย", note: "'safety net' หมายถึงภูมิศาสตร์ช่วยให้นักเดินเรือกลับบ้านได้ปลอดภัยแม้พลาด จึงเลือก (C)" }
    },
    36: {
        questionPhrase: { en: "it is now clear the Lapita could sail against the wind", th: "ตอนนี้ชัดเจนแล้วว่าชาวลาปิตาแล่นเรือทวนลมได้" },
        passagePhrase: { en: "there's no proof they could do any such thing", th: "ไม่มีหลักฐานว่าพวกเขาทำเช่นนั้นได้" },
        pairs: [
          { q: "sail into the wind", p: "sailing against the wind", th: "แล่นเรือทวนลม" },
          { q: "It is now clear", p: "there's no proof", th: "ตอนนี้ชัดเจนแล้ว ↔ ไม่มีหลักฐาน", note: "ผู้เขียนอ้างคำของแอนเดอร์สันว่า 'ไม่มีหลักฐาน' จึงขัดแย้งกับคำกล่าวอ้าง ตอบ NO" },
        ],
        keyVocab: { word: "no proof", th: "ไม่มีหลักฐาน", contrastA: "no proof . maimi laksaan", contrastB: "it is now clear . tonni chatchen laeo", note: "ผู้เขียนอ้างคำของแอนเดอร์สันว่า 'ไม่มีหลักฐาน' จึงขัดแย้งกับคำกล่าวอ้าง ตอบ NO" }
    },
    37: {
        questionPhrase: { en: "extreme climate conditions may have played a part", th: "สภาพภูมิอากาศที่รุนแรงอาจมีส่วนเกี่ยวข้อง" },
        passagePhrase: { en: "El Nino may have helped scatter the Lapita", th: "เอลนีโญอาจช่วยทำให้ชาวลาปิตากระจัดกระจายไป" },
        pairs: [
          { q: "Extreme climate conditions", p: "El Nino, the same climate disruption", th: "สภาพภูมิอากาศที่รุนแรง" },
          { q: "may have played a part", p: "may have helped scatter the Lapita", th: "อาจมีส่วนเกี่ยวข้อง", note: "เอลนีโญ (ภูมิอากาศรุนแรง) อาจมีบทบาทช่วยให้พวกเขากระจายตัว สอดคล้องกับคำกล่าวอ้าง ตอบ YES" },
        ],
        keyVocab: { word: "may have helped scatter", th: "อาจช่วยทำให้กระจัดกระจาย", note: "เอลนีโญ (สภาพภูมิอากาศรุนแรง) อาจมีบทบาทช่วยให้พวกเขากระจายตัว สอดคล้องกับคำกล่าวอ้าง ตอบ YES" }
    },
    38: {
        questionPhrase: { en: "the Lapita learnt to predict the duration of El Ninos", th: "ชาวลาปิตาเรียนรู้ที่จะทำนายระยะเวลาของเอลนีโญ" },
        passagePhrase: { en: "these super El Ninos might have taken the Lapita on long unplanned voyages", th: "ซูเปอร์เอลนีโญอาจพาชาวลาปิตาออกเดินทางไกลโดยไม่ได้วางแผน" },
        pairs: [
          { q: "El Ninos", p: "super El Ninos", th: "เอลนีโญ" },
          { q: "predict the duration", p: "long unplanned voyages", th: "ทำนายระยะเวลา", note: "เรื่องบอกว่าเป็นการเดินทาง 'ไม่ได้วางแผน' ไม่มีที่ใดกล่าวว่าทำนายระยะเวลาเอลนีโญได้ ตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "unplanned voyages", th: "การเดินทางที่ไม่ได้วางแผน", note: "เรื่องบอกว่าเป็นการเดินทาง 'ไม่ได้วางแผน' ไม่มีที่ใดกล่าวว่าพวกเขาทำนายระยะเวลาเอลนีโญได้ ตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "unclear why the Lapita halted their expansion", th: "ไม่ชัดเจนว่าทำไมชาวลาปิตาจึงหยุดการขยายตัว" },
        passagePhrase: { en: "called it quits for reasons known only to them", th: "ยุติการเดินทางด้วยเหตุผลที่มีเพียงพวกเขาเท่านั้นที่รู้" },
        pairs: [
          { q: "halted their expansion", p: "called it quits", th: "หยุดการขยายตัว" },
          { q: "It remains unclear why", p: "for reasons known only to them", th: "ไม่ชัดเจนว่าทำไม", note: "'reasons known only to them' = ไม่มีใครรู้เหตุผล จึงตรงกับ 'unclear why' ตอบ YES" },
        ],
        keyVocab: { word: "for reasons known only to them", th: "ด้วยเหตุผลที่มีเพียงพวกเขาเท่านั้นที่รู้", note: "'reasons known only to them' = ไม่มีใครรู้เหตุผล จึงตรงกับ 'unclear why' ตอบ YES" }
    },
    40: {
        questionPhrase: { en: "the majority of Lapita settled on Fiji", th: "ชาวลาปิตาส่วนใหญ่ตั้งถิ่นฐานบนเกาะฟิจิ" },
        passagePhrase: { en: "they encountered hundreds of islands – more than 300 in Fiji alone", th: "พวกเขาพบเกาะหลายร้อยเกาะ มากกว่า 300 เกาะในฟิจิเพียงแห่งเดียว" },
        pairs: [
          { q: "Fiji", p: "Fiji", th: "ฟิจิ" },
          { q: "the majority of Lapita settled", p: "encountered hundreds of islands", th: "ชาวลาปิตาส่วนใหญ่ตั้งถิ่นฐาน", note: "เรื่องพูดถึงจำนวนเกาะที่พบในฟิจิ แต่ไม่บอกว่าชาวลาปิตาส่วนใหญ่ตั้งถิ่นฐานที่นั่น ตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "encountered hundreds of islands", th: "พบเกาะหลายร้อยเกาะ", note: "เรื่องพูดถึงจำนวนเกาะที่พบในฟิจิ แต่ไม่ได้บอกว่าชาวลาปิตาส่วนใหญ่ตั้งถิ่นฐานที่นั่น ตอบ NOT GIVEN" }
    },
  },
  "Cambridge 10 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "later biologists revised the theory in terms of probability", th: "นักชีววิทยารุ่นหลังปรับทฤษฎีให้พูดในเชิงความน่าจะเป็น" },
        passagePhrase: { en: "they qualified it in terms of probability... it is just very unlikely", th: "พวกเขาขยายความในเชิงความน่าจะเป็น... มันแค่เกิดได้ยากมาก" },
        pairs: [
          { q: "later biologists", p: "Early 20th-century biologists", th: "นักชีววิทยารุ่นต่อมา" },
          { q: "revised the theory", p: "qualified it", th: "ปรับ/ขยายความทฤษฎีให้รัดกุมขึ้น", note: "นักชีววิทยารุ่นหลัง 'qualified' ทฤษฎี โดยพูดเป็นเชิงความน่าจะเป็นว่าแค่ 'very unlikely' จึงตอบ C" },
          { q: "in terms of probability", p: "in terms of probability", th: "ในเชิงความน่าจะเป็น" },
          { q: "very unlikely", p: "very unlikely", th: "เกิดได้ยากมาก" },
        ],
        keyVocab: { word: "qualified (in terms of probability)", th: "ปรับ/ขยายความให้รัดกุมขึ้น (ในเชิงความน่าจะเป็น)", note: "คำว่า 'qualified ... in terms of probability' หมายความว่านักวิทยาศาสตร์รุ่นหลังไม่ได้ปฏิเสธทฤษฎีของ Dollo แต่ผ่อนปรนให้พูดเป็น 'แทบจะเป็นไปไม่ได้' จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "it was used as evidence of a throwback", th: "มันถูกใช้เป็นหลักฐานของการย้อนกลับทางวิวัฒนาการ" },
        passagePhrase: { en: "the whale must be a throwback to a land-living ancestor", th: "วาฬตัวนี้ต้องเป็นการย้อนกลับไปหาบรรพบุรุษที่อยู่บนบก" },
        pairs: [
          { q: "humpback whale", p: "humpback whale", th: "วาฬหลังค่อม" },
          { q: "evidence", p: "I can see no other explanation", th: "หลักฐาน/ข้ออ้างยืนยัน", note: "วาฬถูกยกเป็นหลักฐานของ 'throwback' ไปสู่บรรพบุรุษบนบก จึงตอบ D" },
          { q: "a throwback", p: "throwback to a land-living ancestor", th: "การย้อนกลับทางวิวัฒนาการ" },
        ],
        keyVocab: { word: "throwback to a land-living ancestor", th: "การย้อนกลับไปสู่บรรพบุรุษที่เคยอาศัยบนบก", note: "วาฬมีขาแบบสัตว์บก = หลักฐานของ 'atavism/throwback' ที่นักสำรวจยกขึ้นมาอ้าง จึงตอบ D" }
    },
    29: {
        questionPhrase: { en: "they can be switched back on to restore old traits", th: "พวกมันสามารถถูกเปิดกลับมาทำงานเพื่อฟื้นลักษณะเก่า" },
        passagePhrase: { en: "if these silent genes are somehow switched back on... long-lost traits could reappear", th: "ถ้ายีนเงียบเหล่านี้ถูกเปิดกลับมา... ลักษณะที่หายไปนานอาจปรากฏอีกครั้ง" },
        pairs: [
          { q: "silent genes", p: "silent genes", th: "ยีนเงียบ (ยีนที่ถูกปิดไว้)" },
          { q: "switched back on", p: "switched back on", th: "ถูกเปิดให้ทำงานอีกครั้ง", note: "ถ้ายีนเงียบถูก 'switched back on' ลักษณะเก่าจะกลับมาได้ จึงตอบ C" },
          { q: "restore old traits", p: "long-lost traits could reappear", th: "ฟื้นลักษณะที่หายไปนานกลับมา" },
        ],
        keyVocab: { word: "switched back on", th: "ถูกเปิดให้ทำงานอีกครั้ง", note: "'silent genes' ไม่ได้หายไป แต่ถูกปิดอยู่ และถ้า 'switched back on' ลักษณะเก่าก็กลับมาได้ จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "it illustrates a trait reappearing within the time frame", th: "มันเป็นตัวอย่างของลักษณะที่กลับมาภายในกรอบเวลาที่คำนวณไว้" },
        passagePhrase: { en: "the team pointed to the mole salamanders... fits with Raff's 10-million-year time frame", th: "ทีมยกตัวอย่างซาลาแมนเดอร์โมล... ซึ่งสอดคล้องกับกรอบ 10 ล้านปีของ Raff" },
        pairs: [
          { q: "mole salamander", p: "mole salamanders", th: "ซาลาแมนเดอร์โมล" },
          { q: "illustrates", p: "As a possible example", th: "ใช้เป็นตัวอย่างประกอบ", note: "ซาลาแมนเดอร์ถูกยกเป็นตัวอย่างของลักษณะที่กลับมาในกรอบ 10 ล้านปีของ Raff จึงตอบ B" },
          { q: "within the time frame", p: "fits with Raff's 10million-year time frame", th: "อยู่ในกรอบเวลาที่คำนวณไว้" },
        ],
        keyVocab: { word: "As a possible example", th: "เป็นตัวอย่างที่เป็นไปได้", note: "ซาลาแมนเดอร์ถูกยกเป็น 'example' ที่สนับสนุนทฤษฎียีนเงียบของ Raff ในกรอบเวลา 10 ล้านปี จึงตอบ B" }
    },
    31: {
        questionPhrase: { en: "toed lizards re-evolved toes from toeless ancestors", th: "กิ้งก่ามีนิ้ววิวัฒน์นิ้วขึ้นใหม่จากบรรพบุรุษที่ไม่มีนิ้ว" },
        passagePhrase: { en: "the toed species re-evolved toes from toeless ancestors", th: "สายพันธุ์ที่มีนิ้ววิวัฒน์นิ้วขึ้นใหม่จากบรรพบุรุษที่ไม่มีนิ้ว" },
        pairs: [
          { q: "toed lizards", p: "the toed species", th: "กิ้งก่าที่มีนิ้ว" },
          { q: "re-evolved toes", p: "re-evolved toes", th: "วิวัฒน์นิ้วขึ้นมาใหม่", note: "Wagner อ้างว่านิ้วหายไปแล้ววิวัฒน์กลับมาใหม่จากบรรพบุรุษที่ไร้นิ้ว จึงตอบ A" },
          { q: "from toeless ancestors", p: "from toeless ancestors", th: "จากบรรพบุรุษที่ไม่มีนิ้ว" },
        ],
        keyVocab: { word: "re-evolved toes from toeless ancestors", th: "วิวัฒน์นิ้วขึ้นมาใหม่จากบรรพบุรุษที่ไร้นิ้ว", note: "Wagner อ้างว่านิ้ว 'หายไปแล้วกลับมาใหม่' หลายครั้ง ไม่ใช่ไม่เคยหาย จึงตอบ A" }
    },
    32: {
        questionPhrase: { en: "biologists reluctant to accept backward evolution", th: "นักชีววิทยาที่ลังเลจะยอมรับวิวัฒนาการย้อนกลับ" },
        passagePhrase: { en: "most biologists have been reluctant... 'evolution cannot run backwards'", th: "นักชีววิทยาส่วนใหญ่ลังเล... 'วิวัฒนาการย้อนกลับไม่ได้'" },
        pairs: [
          { q: "Opposing views", p: "the opposite conclusion", th: "มุมมองที่ขัดแย้งกัน" },
          { q: "reluctant to accept", p: "reluctant", th: "ลังเล/ไม่เต็มใจจะยอมรับ", note: "ฝ่ายที่ 'reluctant' เชื่อว่าวิวัฒนาการย้อนกลับไม่ได้ เป็นมุมมองหนึ่งของสองฝ่ายที่ขัดแย้ง จึงจับคู่กับตัวเลือก F" },
          { q: "backward evolution", p: "evolution cannot run backwards", th: "วิวัฒนาการย้อนกลับ" },
        ],
        keyVocab: { word: "reluctant", th: "ลังเล / ไม่เต็มใจ", note: "ฝ่ายที่ 'reluctant' เชื่อว่าวิวัฒนาการย้อนกลับไม่ได้ เป็นมุมมองหนึ่งของสองฝ่ายที่ขัดแย้งกัน จึงจับคู่กับตัวเลือก F" }
    },
    33: {
        questionPhrase: { en: "scientists reaching an opposite conclusion", th: "นักวิทยาศาสตร์ที่ได้ข้อสรุปตรงกันข้าม" },
        passagePhrase: { en: "Louis Dollo was studying fossil records and coming to the opposite conclusion", th: "Louis Dollo ศึกษาซากดึกดำบรรพ์และได้ข้อสรุปตรงกันข้าม" },
        pairs: [
          { q: "scientists", p: "a Belgian palaeontologist called Louis Dollo", th: "นักวิทยาศาสตร์" },
          { q: "an opposite conclusion", p: "coming to the opposite conclusion", th: "ข้อสรุปตรงกันข้าม", note: "ตัวอย่าง throwback นำไปสู่การที่ Dollo ได้ 'opposite conclusion' ว่าวิวัฒนาการย้อนกลับไม่ได้ จึงจับคู่กับตัวเลือก G" },
        ],
        keyVocab: { word: "the opposite conclusion", th: "ข้อสรุปตรงกันข้าม", note: "ตัวอย่าง throwback ทำให้เกิดข้อถกเถียง โดย Dollo ได้ 'opposite conclusion' ว่าวิวัฒนาการย้อนกลับไม่ได้ จึงจับคู่กับตัวเลือก G" }
    },
    34: {
        questionPhrase: { en: "similar structures arising independently in unrelated species", th: "โครงสร้างคล้ายกันเกิดขึ้นเองในสปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        passagePhrase: { en: "similar structures can independently arise in unrelated species", th: "โครงสร้างที่คล้ายกันเกิดขึ้นเองได้ในสปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        pairs: [
          { q: "shark and killer whale", p: "dorsal fins of sharks and killer whales", th: "ฉลามและวาฬเพชฌฆาต" },
          { q: "similar structures", p: "similar structures", th: "โครงสร้างที่คล้ายกัน" },
          { q: "arising independently", p: "independently arise", th: "เกิดขึ้นเองโดยอิสระ", note: "ครีบฉลามกับวาฬเป็นตัวอย่างของโครงสร้างคล้ายกันที่เกิดขึ้นเองในสปีชีส์ไม่เกี่ยวข้องกัน จึงจับคู่กับตัวเลือก A" },
          { q: "unrelated species", p: "unrelated species", th: "สปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        ],
        keyVocab: { word: "independently arise in unrelated species", th: "เกิดขึ้นเองในสปีชีส์ที่ไม่เกี่ยวข้องกัน", note: "ครีบของฉลามกับวาฬเพชฌฆาตเป็นตัวอย่างของลักษณะคล้ายกันที่เกิดขึ้นเอง ไม่ได้สืบทอดมา จึงจับคู่กับตัวเลือก A" }
    },
    35: {
        questionPhrase: { en: "traits lost then independently reappearing", th: "ลักษณะที่หายไปแล้วปรากฏขึ้นใหม่เองโดยอิสระ" },
        passagePhrase: { en: "similar structures can independently arise in unrelated species", th: "โครงสร้างคล้ายกันเกิดขึ้นเองได้ในสปีชีส์ที่ไม่เกี่ยวข้องกัน" },
        pairs: [
          { q: "traits lost then", p: "these traits are lost and then simply reappear", th: "ลักษณะที่หายไปแล้ว" },
          { q: "reappearing", p: "reappear", th: "ปรากฏขึ้นใหม่", note: "คำอธิบายหนึ่งคือ นิ้วหายไปแล้วเกิดขึ้นใหม่เองแบบเดียวกับครีบฉลาม/วาฬ ไม่ใช่ยีนเก่ารอด จึงตอบ B" },
          { q: "independently", p: "independently arise", th: "เกิดขึ้นเองโดยอิสระ" },
        ],
        keyVocab: { word: "independently arise", th: "เกิดขึ้นเองโดยอิสระ", note: "คำอธิบายหนึ่งของผล Wagner คือนิ้วหายแล้ว 'เกิดขึ้นใหม่เอง' แบบเดียวกับครีบฉลาม/วาฬ ไม่ใช่ยีนเก่ารอด จึงตอบ B" }
    },
    36: {
        questionPhrase: { en: "old genetic information survived and was reactivated", th: "ข้อมูลพันธุกรรมเก่ารอดอยู่และถูกกระตุ้นให้ทำงานใหม่" },
        passagePhrase: { en: "the genetic information needed to make toes somehow survived... and was reactivated", th: "ข้อมูลพันธุกรรมที่ใช้สร้างนิ้วรอดอยู่... และถูกกระตุ้นกลับมา" },
        pairs: [
          { q: "old genetic information", p: "the genetic information needed to make toes", th: "ข้อมูลพันธุกรรมเก่า" },
          { q: "survived", p: "somehow survived for tens or perhaps hundreds of millions of years", th: "รอดอยู่ได้นาน" },
          { q: "was reactivated", p: "was reactivated", th: "ถูกกระตุ้นให้ทำงานอีกครั้ง", note: "คำตอบเติมสรุปคือข้อมูลพันธุกรรมรอดอยู่นานมากแล้ว 'reactivated' จึงตอบ D" },
        ],
        keyVocab: { word: "reactivated", th: "ถูกกระตุ้นให้ทำงานอีกครั้ง", note: "คำตอบเติมสรุปคือข้อมูลพันธุกรรม 'survived' นานมากแล้ว 'reactivated' จึงตอบ D" }
    },
    37: {
        questionPhrase: { en: "Wagner was first to study these lizards", th: "Wagner เป็นคนแรกที่ศึกษากิ้งก่าเหล่านี้" },
        passagePhrase: { en: "Wagner... reported some work on the evolutionary history of... Bachia", th: "Wagner... รายงานงานบางส่วนเกี่ยวกับประวัติวิวัฒนาการของ Bachia" },
        pairs: [
          { q: "research on South American lizards", p: "the evolutionary history of a group of South American lizards", th: "งานวิจัยเกี่ยวกับกิ้งก่าอเมริกาใต้" },
          { q: "the first person", p: "reported some work", th: "คนแรกที่ทำ", note: "เนื้อเรื่องบอกแค่ว่า Wagner รายงานงานวิจัย แต่ไม่เคยบอกว่าเขาเป็น 'คนแรก' จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "the first person", th: "คนแรก", note: "เนื้อเรื่องบอกแค่ว่า Wagner รายงานงานวิจัย แต่ไม่เคยบอกว่าเขาเป็น 'คนแรก' จึงตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "toed Bachia lizards had toeless ancestors", th: "กิ้งก่า Bachia ที่มีนิ้วมีบรรพบุรุษที่ไม่มีนิ้ว" },
        passagePhrase: { en: "the toed species re-evolved toes from toeless ancestors", th: "สายพันธุ์ที่มีนิ้ววิวัฒน์นิ้วขึ้นใหม่จากบรรพบุรุษที่ไม่มีนิ้ว" },
        pairs: [
          { q: "Bachia lizards with toes", p: "the toed species", th: "กิ้งก่า Bachia ที่มีนิ้ว" },
          { q: "had toeless ancestors", p: "re-evolved toes from toeless ancestors", th: "มีบรรพบุรุษที่ไม่มีนิ้ว", note: "เนื้อเรื่องระบุชัดว่ากิ้งก่ามีนิ้วสืบจาก 'toeless ancestors' ตรงกับข้อความ จึงตอบ YES" },
        ],
        keyVocab: { word: "from toeless ancestors", th: "จากบรรพบุรุษที่ไม่มีนิ้ว", note: "เนื้อเรื่องระบุชัดว่ากิ้งก่ามีนิ้วสืบจาก 'toeless ancestors' ตรงกับข้อความ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "long-lost traits in embryos is rare", th: "ลักษณะที่หายไปนานปรากฏในตัวอ่อนเป็นเรื่องหายาก" },
        passagePhrase: { en: "Early embryos of many species develop ancestral features", th: "ตัวอ่อนระยะแรกของสปีชีส์จำนวนมากพัฒนาลักษณะของบรรพบุรุษ" },
        pairs: [
          { q: "long-lost traits in embryos", p: "Early embryos of many species develop ancestral features", th: "ลักษณะบรรพบุรุษที่หายไปนานปรากฏในตัวอ่อน" },
          { q: "is rare", p: "many species", th: "หายาก (เทียบกับ 'หลายสปีชีส์' = พบบ่อย)", note: "ข้อความบอกว่าตัวอ่อนของ 'many species' มีลักษณะบรรพบุรุษ = พบบ่อย ขัดกับคำว่า 'rare' จึงตอบ NO" },
        ],
        keyVocab: { word: "many species", th: "หลายสปีชีส์ / จำนวนมาก", contrastA: "many species . หลายสปีชีส์ (พบบ่อย)", contrastB: "rare . หายาก", note: "ข้อความบอกว่าตัวอ่อนของ 'many species' มีลักษณะบรรพบุรุษ = พบบ่อย ขัดกับคำว่า 'rare' จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "throwbacks caused by developmental problems in the womb", th: "การย้อนกลับเกิดจากความผิดปกติของพัฒนาการในครรภ์" },
        passagePhrase: { en: "if for any reason this does not happen... leading to an atavism", th: "ถ้าด้วยเหตุใดสิ่งนี้ไม่เกิดขึ้น... นำไปสู่ atavism" },
        pairs: [
          { q: "Evolutionary throwbacks", p: "an atavism", th: "การย้อนกลับทางวิวัฒนาการ" },
          { q: "developmental problems", p: "if for any reason this does not happen", th: "ความผิดปกติของพัฒนาการ", note: "เมื่อโปรแกรมพัฒนาการในครรภ์ไม่ทำงานตามปกติ ลักษณะบรรพบุรุษค้างอยู่กลายเป็น atavism จึงตอบ YES" },
          { q: "in the womb", p: "The answer may lie in the womb", th: "ในครรภ์" },
        ],
        keyVocab: { word: "if... this does not happen", th: "ถ้าสิ่งนี้ (โปรแกรมกำจัดลักษณะเก่า) ไม่ทำงาน", note: "เมื่อโปรแกรมพัฒนาการในครรภ์ไม่ทำงานตามปกติ ลักษณะบรรพบุรุษจะค้างอยู่กลายเป็น atavism = ความผิดปกติของพัฒนาการในครรภ์ จึงตอบ YES" }
    },
  },
  "Cambridge 11 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "based on an earlier natural phenomenon", th: "อ้างอิงจากปรากฏการณ์ธรรมชาติในอดีต" },
        passagePhrase: { en: "modelled on historic volcanic explosions, such as Mount Pinatubo in 1991", th: "จำลองจากการระเบิดของภูเขาไฟในอดีต เช่น ภูเขาไฟปินาตูโบปี 1991" },
        pairs: [
          { q: "based on", p: "modelled on", th: "อ้างอิงจาก / จำลองมาจาก", note: "'earlier natural phenomenon' ในโจทย์ตรงกับ 'historic volcanic explosions' ในย่อหน้า D คำตอบจึงเป็น D" },
          { q: "earlier natural phenomenon", p: "historic volcanic explosions", th: "ปรากฏการณ์ธรรมชาติในอดีต (การระเบิดของภูเขาไฟ)" },
          { q: "geo-engineering project", p: "releasing aerosol sprays into the stratosphere", th: "โครงการปรับแต่งสภาพภูมิอากาศ (การพ่นละอองสู่ชั้นบรรยากาศ)" },
        ],
        keyVocab: { word: "modelled on historic volcanic explosions", th: "ออกแบบโดยอ้างอิงจากการระเบิดของภูเขาไฟในอดีต", note: "คำว่า 'earlier natural phenomenon' ในโจทย์ตรงกับ 'historic volcanic explosions' (ปรากฏการณ์ภูเขาไฟในอดีต) ซึ่งอยู่ในย่อหน้า D คำตอบจึงเป็น D" }
    },
    28: {
        questionPhrase: { en: "an example of a successful use of geo-engineering", th: "ตัวอย่างการใช้ geo-engineering ที่ประสบความสำเร็จ" },
        passagePhrase: { en: "Geo-engineering has been shown to work, at least on a small localised scale", th: "geo-engineering ได้รับการพิสูจน์ว่าได้ผล อย่างน้อยในระดับเล็กเฉพาะพื้นที่" },
        pairs: [
          { q: "successful use", p: "has been shown to work", th: "การใช้ที่ได้ผล / พิสูจน์แล้วว่าใช้ได้", note: "'successful use' ตรงกับ 'has been shown to work' ในย่อหน้า B คำตอบจึงเป็น B" },
          { q: "an example", p: "on a small localised scale", th: "ตัวอย่าง (กรณีในระดับเล็กเฉพาะพื้นที่)" },
          { q: "geo-engineering", p: "Geo-engineering", th: "วิศวกรรมธรณี / การปรับแต่งสภาพภูมิอากาศ" },
        ],
        keyVocab: { word: "has been shown to work", th: "ได้รับการพิสูจน์ว่าใช้ได้ผล", note: "'successful use' ในโจทย์คือการพูดถึง 'has been shown to work' (พิสูจน์แล้วว่าได้ผล) ในย่อหน้า B คำตอบจึงเป็น B" }
    },
    29: {
        questionPhrase: { en: "a common definition of geo-engineering", th: "นิยามทั่วไปของ geo-engineering" },
        passagePhrase: { en: "a term which generally refers to the intentional large-scale manipulation of the environment", th: "คำที่โดยทั่วไปหมายถึงการจัดการสิ่งแวดล้อมขนาดใหญ่อย่างจงใจ" },
        pairs: [
          { q: "common definition", p: "generally refers to", th: "นิยามทั่วไป / โดยทั่วไปหมายถึง", note: "'common definition' ตรงกับ 'generally refers to' ที่ให้นิยาม geo-engineering ในย่อหน้า A คำตอบจึงเป็น A" },
          { q: "geo-engineering", p: "geo-engineering", th: "วิศวกรรมธรณี" },
          { q: "definition", p: "a term", th: "นิยาม / คำศัพท์ที่ถูกอธิบาย" },
        ],
        keyVocab: { word: "generally refers to", th: "โดยทั่วไปหมายถึง", note: "'common definition' ในโจทย์ตรงกับวลี 'generally refers to' (โดยทั่วไปหมายถึง) ซึ่งเป็นการให้นิยามในย่อหน้า A คำตอบจึงเป็น A" }
    },
    30: {
        questionPhrase: { en: "a ... that would reduce the amount of light reaching Earth", th: "สิ่งที่จะลดปริมาณแสงที่ส่องมาถึงโลก" },
        passagePhrase: { en: "to form a transparent, sunlight-refracting sunshade in an orbit above the Earth", th: "เพื่อสร้างม่านบังแดดโปร่งใสที่หักเหแสงในวงโคจรเหนือโลก" },
        pairs: [
          { q: "reduce the amount of light reaching Earth", p: "reduce the amount of light reaching the Earth", th: "ลดปริมาณแสงที่ส่องมาถึงโลก", note: "ช่องว่างต้องการสิ่งที่ลดแสง พาสเสจระบุยานสร้าง 'sunshade' ที่หักเหแสงอาทิตย์ คำตอบคือ sunshade" },
          { q: "tiny spacecraft", p: "minute spacecraft", th: "ยานอวกาศขนาดจิ๋ว" },
          { q: "orbit far above Earth", p: "an orbit 1.5 million km above the Earth", th: "วงโคจรที่อยู่สูงเหนือโลกมาก" },
        ],
        keyVocab: { word: "sunshade", th: "ม่านบังแดด / ที่บังแสงอาทิตย์", note: "ช่องว่างต้องการสิ่งที่ลดแสงที่ส่องถึงโลก พาสเสจระบุว่ายานสร้าง 'sunshade' ที่หักเหแสงอาทิตย์ คำตอบคือ sunshade" }
    },
    31: {
        questionPhrase: { en: "place ... in the sea to encourage", th: "นำ ... ใส่ในทะเลเพื่อกระตุ้น" },
        passagePhrase: { en: "depositing iron in the ocean to stimulate the growth of algae", th: "การปล่อยเหล็กลงในมหาสมุทรเพื่อกระตุ้นการเติบโตของสาหร่าย" },
        pairs: [
          { q: "place", p: "depositing", th: "นำไปวาง / ปล่อยลงไป", note: "'place in the sea' ตรงกับ 'depositing in the ocean' สิ่งที่ใส่ลงไปคือ iron คำตอบคือ iron" },
          { q: "in the sea", p: "in the ocean", th: "ในทะเล / ในมหาสมุทร" },
          { q: "encourage", p: "stimulate", th: "กระตุ้น / ส่งเสริม" },
        ],
        keyVocab: { word: "iron", th: "เหล็ก (ธาตุเหล็ก)", note: "'place in the sea' = 'depositing in the ocean' สิ่งที่ใส่ลงไปคือ iron (เหล็ก) คำตอบคือ iron" }
    },
    32: {
        questionPhrase: { en: "to encourage ... to form", th: "เพื่อกระตุ้นให้ ... ก่อตัวขึ้น" },
        passagePhrase: { en: "to stimulate the growth of algae", th: "เพื่อกระตุ้นการเติบโตของสาหร่าย" },
        pairs: [
          { q: "encourage", p: "stimulate", th: "กระตุ้น / ส่งเสริม" },
          { q: "to form", p: "the growth of", th: "ให้ก่อตัว / ให้เติบโต", note: "'encourage to form' ตรงกับ 'stimulate the growth of' สิ่งที่ถูกกระตุ้นให้โตคือ algae คำตอบคือ algae" },
        ],
        keyVocab: { word: "algae", th: "สาหร่าย", note: "'encourage to form' = 'stimulate the growth of' สิ่งที่ถูกกระตุ้นให้เติบโตคือ algae คำตอบคือ algae" }
    },
    33: {
        questionPhrase: { en: "to create ... that would reduce the light reaching Earth", th: "เพื่อสร้าง ... ที่จะลดแสงที่ส่องถึงโลก" },
        passagePhrase: { en: "sulphur dioxide would form clouds, which would lead to a global dimming", th: "ซัลเฟอร์ไดออกไซด์จะก่อตัวเป็นเมฆ ซึ่งทำให้โลกมืดลง" },
        pairs: [
          { q: "create", p: "form", th: "สร้าง / ก่อตัว", note: "การพ่นละอองทำให้เกิด 'clouds' ที่นำไปสู่ global dimming (ลดแสง) คำตอบคือ clouds" },
          { q: "reduce the amount of light reaching Earth", p: "global dimming", th: "ลดปริมาณแสงที่ถึงโลก / โลกมืดลง" },
          { q: "aerosol sprays", p: "aerosols", th: "ละอองลอย / สเปรย์ละออง" },
        ],
        keyVocab: { word: "clouds", th: "เมฆ", note: "การพ่นละอองทำให้เกิด 'clouds' ที่นำไปสู่ global dimming (โลกมืดลง = ลดแสง) คำตอบคือ clouds" }
    },
    34: {
        questionPhrase: { en: "fix strong ... to Greenland ice sheets", th: "ติดตั้ง ... ที่แข็งแรงกับแผ่นน้ำแข็งกรีนแลนด์" },
        passagePhrase: { en: "preserve the ice sheets of Greenland with reinforced high-tension cables", th: "รักษาแผ่นน้ำแข็งกรีนแลนด์ด้วยสายเคเบิลแรงดึงสูงที่เสริมความแข็งแรง" },
        pairs: [
          { q: "strong", p: "reinforced high-tension", th: "แข็งแรง / เสริมแรงดึงสูง", note: "'strong' ตรงกับ 'reinforced high-tension' สิ่งที่ติดกับน้ำแข็งคือ cables คำตอบคือ cables" },
          { q: "Greenland ice sheets", p: "the ice sheets of Greenland", th: "แผ่นน้ำแข็งกรีนแลนด์" },
          { q: "prevent icebergs moving into the sea", p: "preventing icebergs from moving into the sea", th: "ป้องกันภูเขาน้ำแข็งเคลื่อนลงทะเล" },
        ],
        keyVocab: { word: "cables", th: "สายเคเบิล / สายเคเบิลแรงดึงสูง", note: "'strong' ในโจทย์ตรงกับ 'reinforced high-tension' สิ่งที่ติดกับน้ำแข็งคือ cables คำตอบคือ cables" }
    },
    35: {
        questionPhrase: { en: "to allow the ... to reflect radiation", th: "เพื่อให้ ... สะท้อนรังสีกลับ" },
        passagePhrase: { en: "enabling radiation to be reflected by the snow", th: "ทำให้รังสีถูกสะท้อนกลับโดยหิมะ" },
        pairs: [
          { q: "reflect radiation", p: "radiation to be reflected", th: "สะท้อนรังสีกลับ", note: "สิ่งที่สะท้อนรังสีคือ 'snow' เมื่อต้นเบิร์ชผลัดใบในฤดูหนาว คำตอบคือ snow" },
          { q: "trees in Russian Arctic", p: "millions of birch trees", th: "ต้นไม้ในเขตอาร์กติกของรัสเซีย (ต้นเบิร์ช)" },
          { q: "lose their leaves in winter", p: "shed their leaves in winter", th: "ผลัดใบในฤดูหนาว" },
        ],
        keyVocab: { word: "snow", th: "หิมะ", note: "'reflect radiation' = 'radiation to be reflected' สิ่งที่สะท้อนรังสีคือ snow (หิมะ) เมื่อต้นเบิร์ชผลัดใบ คำตอบคือ snow" }
    },
    36: {
        questionPhrase: { en: "change the direction of ... to bring more cold water", th: "เปลี่ยนทิศทางของ ... เพื่อนำน้ำเย็นมามากขึ้น" },
        passagePhrase: { en: "Re-routing Russian rivers to increase cold water flow to ice-forming areas", th: "การเปลี่ยนเส้นทางแม่น้ำรัสเซียเพื่อเพิ่มการไหลของน้ำเย็นไปยังพื้นที่เกิดน้ำแข็ง" },
        pairs: [
          { q: "change the direction of", p: "Re-routing", th: "เปลี่ยนทิศทาง / เปลี่ยนเส้นทาง", note: "'change the direction of' ตรงกับ 'Re-routing' สิ่งที่ถูกเปลี่ยนเส้นทางคือ rivers คำตอบคือ rivers" },
          { q: "bring more cold water", p: "increase cold water flow", th: "นำน้ำเย็นมามากขึ้น" },
          { q: "ice-forming areas", p: "ice-forming areas", th: "พื้นที่ที่เกิดน้ำแข็ง" },
        ],
        keyVocab: { word: "rivers", th: "แม่น้ำ", note: "'change the direction of' = 'Re-routing' สิ่งที่ถูกเปลี่ยนทิศทางคือ rivers (แม่น้ำ) คำตอบคือ rivers" }
    },
    37: {
        questionPhrase: { en: "effects may not be long-lasting", th: "ผลกระทบอาจอยู่ได้ไม่นาน" },
        passagePhrase: { en: "the planet would return to its pre-engineered condition very rapidly", th: "โลกจะกลับสู่สภาพก่อนถูกปรับแต่งอย่างรวดเร็ว" },
        pairs: [
          { q: "may not be long-lasting", p: "return to its pre-engineered condition very rapidly", th: "อาจอยู่ได้ไม่นาน / กลับคืนสภาพเดิมอย่างรวดเร็ว", note: "'not long-lasting' = หากหยุดทำ โลกจะ 'return very rapidly' ภายใน 10-20 ปี เป็นคำพูดของ Phil Rasch คำตอบจึงเป็น B" },
          { q: "effects of geo-engineering", p: "if we were to end geo-engineering", th: "ผลของการปรับแต่งสภาพภูมิอากาศ" },
        ],
        keyVocab: { word: "return very rapidly", th: "กลับคืนสภาพอย่างรวดเร็ว", note: "'not long-lasting' = หากหยุดทำแล้วโลก 'return very rapidly' ภายใน 10-20 ปี นี่คือคำพูดของ Phil Rasch คำตอบจึงเป็น B" }
    },
    38: {
        questionPhrase: { en: "a topic worth exploring", th: "เป็นหัวข้อที่ควรค่าแก่การศึกษา" },
        passagePhrase: { en: "we shouldn't exclude thinking thoroughly about this topic and its possibilities", th: "เราไม่ควรปฏิเสธที่จะคิดอย่างถี่ถ้วนเกี่ยวกับหัวข้อนี้และความเป็นไปได้" },
        pairs: [
          { q: "worth exploring", p: "shouldn't exclude thinking thoroughly about this topic", th: "ควรค่าแก่การศึกษา / ไม่ควรปฏิเสธที่จะพิจารณา", note: "'worth exploring' ตรงกับ 'shouldn't exclude thinking thoroughly about' เป็นคำพูดของ Martin Sommerkorn คำตอบจึงเป็น D" },
          { q: "topic", p: "this topic and its possibilities", th: "หัวข้อ (และความเป็นไปได้ของมัน)" },
        ],
        keyVocab: { word: "shouldn't exclude thinking thoroughly about this topic", th: "ไม่ควรปฏิเสธที่จะคิดอย่างจริงจังเกี่ยวกับหัวข้อนี้", note: "'worth exploring' = 'shouldn't exclude thinking thoroughly about' นี่คือคำพูดของ Martin Sommerkorn คำตอบจึงเป็น D" }
    },
    39: {
        questionPhrase: { en: "necessary to limit the effectiveness of projects", th: "อาจจำเป็นต้องจำกัดประสิทธิภาพของโครงการ" },
        passagePhrase: { en: "Angel's project would have to operate at half strength", th: "โครงการของแองเจิลจะต้องทำงานที่ครึ่งกำลัง" },
        pairs: [
          { q: "limit the effectiveness", p: "operate at half strength", th: "จำกัดประสิทธิภาพ / ทำงานที่ครึ่งกำลัง", note: "'limit the effectiveness' ตรงกับ 'operate at half strength' เป็นความเห็นของ Dan Lunt คำตอบจึงเป็น C" },
          { q: "geo-engineering projects", p: "Angel's project", th: "โครงการปรับแต่งสภาพภูมิอากาศ" },
        ],
        keyVocab: { word: "operate at half strength", th: "ทำงานที่ครึ่งกำลัง", note: "'limit the effectiveness' = 'operate at half strength' (ทำงานครึ่งกำลัง) นี่คือความเห็นของ Dan Lunt คำตอบจึงเป็น C" }
    },
    40: {
        questionPhrase: { en: "research into non-fossil fuels cannot be replaced", th: "การวิจัยพลังงานที่ไม่ใช่ฟอสซิลไม่สามารถถูกแทนที่ได้" },
        passagePhrase: { en: "no substitute for developing renewable energy: the only permanent solution", th: "ไม่ใช่สิ่งทดแทนการพัฒนาพลังงานหมุนเวียน ซึ่งเป็นทางออกถาวรเพียงทางเดียว" },
        pairs: [
          { q: "cannot be replaced by", p: "no substitute for", th: "ไม่สามารถถูกแทนที่ / ไม่ใช่สิ่งทดแทน", note: "'cannot be replaced' ตรงกับ 'no substitute for' และ 'non-fossil-based fuels' = 'renewable energy' เป็นคำพูดของ Roger Angel คำตอบจึงเป็น A" },
          { q: "non-fossil-based fuels", p: "renewable energy", th: "พลังงานที่ไม่ใช่ฟอสซิล / พลังงานหมุนเวียน" },
          { q: "Research", p: "developing", th: "การวิจัย / การพัฒนา" },
        ],
        keyVocab: { word: "no substitute for developing renewable energy", th: "ไม่ใช่สิ่งทดแทนการพัฒนาพลังงานหมุนเวียน", note: "'cannot be replaced' = 'no substitute for' และ 'non-fossil-based fuels' = 'renewable energy' นี่คือคำพูดของ Roger Angel คำตอบจึงเป็น A" }
    },
  },
  "Cambridge 11 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "our tendency to be influenced by others' opinions", th: "แนวโน้มที่เราจะถูกความคิดเห็นของคนอื่นชักจูง" },
        passagePhrase: { en: "people often choose a wrong answer if they see others doing the same", th: "คนมักเลือกคำตอบที่ผิดถ้าเห็นคนอื่นทำแบบนั้น" },
        pairs: [
          { q: "our tendency to be influenced by the opinions of others", p: "if they see others doing the same", th: "การถูกชักจูงให้ทำตามคนอื่น", note: "การเลือกตามคนอื่นในการทดสอบจับคู่รูปทรง คือภาพประกอบของแนวโน้มถูกชักจูงโดยคนหมู่มาก จึงตอบ C" },
          { q: "shape-matching test", p: "matching a shape to its rotated image", th: "การจับคู่รูปทรงกับภาพที่หมุนของมัน" },
          { q: "influenced", p: "choose a definitively wrong answer", th: "ถูกชักจูงจนเลือกผิด" },
        ],
        keyVocab: { word: "if they see others doing the same", th: "ถ้าเห็นคนอื่นทำเหมือนกัน", note: "การ 'เลือกตามคนอื่น' ในการทดสอบจับคู่รูปทรง คือภาพประกอบของแนวโน้มถูกชักจูงโดยคนหมู่มาก จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "ability to perceive the intention behind works of art", th: "ความสามารถรับรู้เจตนาที่ซ่อนอยู่เบื้องหลังงานศิลปะ" },
        passagePhrase: { en: "the viewer can sense the artist's vision in paintings", th: "ผู้ชมสามารถรับรู้วิสัยทัศน์ของศิลปินในภาพวาด" },
        pairs: [
          { q: "perceive the intention behind works of art", p: "sense the artist's vision in paintings", th: "รับรู้เจตนา/วิสัยทัศน์ของศิลปินในภาพ", note: "'sense the artist's vision' = perceive the intention คนรับรู้เจตนาของศิลปินได้แม้อธิบายไม่ถูก จึงตอบ D" },
          { q: "have the ability to perceive", p: "the viewer can sense", th: "ผู้ชมสามารถรับรู้ได้" },
          { q: "intention", p: "vision", th: "เจตนา/วิสัยทัศน์" },
        ],
        keyVocab: { word: "sense the artist's vision", th: "สัมผัสได้ถึงวิสัยทัศน์ของศิลปิน", note: "'sense the artist's vision' = perceive the intention คนรับรู้เจตนาของศิลปินได้แม้อธิบายไม่ถูก จึงตอบ D" }
    },
    29: {
        questionPhrase: { en: "find it satisfying to work out what a painting represents", th: "รู้สึกพอใจเมื่อได้ไขว่าภาพวาดสื่อถึงอะไร" },
        passagePhrase: { en: "the harder it is to decipher the meaning, the more rewarding the recognition", th: "ยิ่งถอดความหมายยากเท่าไร ช่วงที่เข้าใจก็ยิ่งคุ้มค่า" },
        pairs: [
          { q: "find it satisfying", p: "the more rewarding", th: "รู้สึกพอใจ/คุ้มค่า", note: "'rewarding' = satisfying และ 'decipher the meaning' = work out what it represents จึงตอบ B" },
          { q: "work out what a painting represents", p: "to decipher the meaning", th: "ไขความหมายของภาพว่าสื่อถึงอะไร" },
          { q: "painting", p: "these images", th: "ภาพ/งานศิลปะ" },
        ],
        keyVocab: { word: "rewarding moment of recognition", th: "ช่วงเวลาแห่งการเข้าใจที่คุ้มค่า", note: "'rewarding' = satisfying และ 'decipher the meaning' = work out what it represents จึงตอบ B" }
    },
    30: {
        questionPhrase: { en: "more carefully put together than they appear", th: "ถูกจัดวางอย่างพิถีพิถันกว่าที่ตาเห็น" },
        passagePhrase: { en: "deceptively simple, but meticulously composed", th: "ดูเรียบง่ายอย่างหลอกตา แต่จัดองค์ประกอบอย่างประณีต" },
        pairs: [
          { q: "more carefully put together than they appear", p: "deceptively simple, but eye-tracking studies confirm that they are meticulously composed", th: "จัดวางอย่างพิถีพิถันกว่าที่ตาเห็น", note: "'meticulously composed' = carefully put together และ 'deceptively' บอกว่าซับซ้อนกว่าที่เห็น จึงตอบ A" },
          { q: "carefully put together", p: "meticulously composed", th: "จัดองค์ประกอบอย่างประณีต" },
          { q: "than they appear", p: "deceptively simple", th: "ดูเรียบง่ายอย่างหลอกตา" },
        ],
        keyVocab: { word: "deceptively simple, meticulously composed", th: "ดูง่ายอย่างลวงตา แต่ประกอบอย่างประณีต", note: "'meticulously composed' = carefully put together และ 'deceptively' บอกว่าซับซ้อนกว่าที่เห็น จึงตอบ A" }
    },
    31: {
        questionPhrase: { en: "the impact Impressionist paintings have on our ___", th: "ผลกระทบที่ภาพวาดอิมเพรสชันนิสต์มีต่อ ___ ของเรา" },
        passagePhrase: { en: "the amygdala plays a crucial role in our feelings", th: "อะมิกดาลามีบทบาทสำคัญต่อความรู้สึกของเรา" },
        pairs: [
          { q: "emotions", p: "our feelings", th: "อารมณ์/ความรู้สึก", note: "'feelings' ในเนื้อเรื่อง = emotions ในตัวเลือก ภาพอิมเพรสชันนิสต์กระตุ้นอารมณ์ จึงตอบ C (emotions)" },
          { q: "Impressionist paintings", p: "Impressionist paintings", th: "ภาพวาดอิมเพรสชันนิสต์" },
          { q: "the impact which Impressionist paintings have", p: "find these pieces so moving", th: "ผลกระทบทางอารมณ์ที่ภาพมีต่อเรา" },
        ],
        keyVocab: { word: "feelings", th: "ความรู้สึก / อารมณ์", note: "'feelings' ในเนื้อเรื่อง = emotions ในตัวเลือก ภาพอิมเพรสชันนิสต์กระตุ้นอารมณ์ จึงตอบ C (emotions)" }
    },
    32: {
        questionPhrase: { en: "the precise degree of ___ that appeals to the brain", th: "ระดับ ___ ที่พอดีซึ่งถูกใจสมอง" },
        passagePhrase: { en: "analysed the visual intricacy ... a key level of detail to please the brain", th: "วิเคราะห์ความซับซ้อนทางสายตา ... ระดับรายละเอียดที่พอดีเพื่อให้สมองพอใจ" },
        pairs: [
          { q: "the precise degree of", p: "a key level of detail", th: "ระดับที่พอดี/เหมาะเจาะ", note: "'intricacy' และ 'level of detail' = complexity จึงตอบ B (complexity)" },
          { q: "complexity", p: "visual intricacy", th: "ความซับซ้อนทางสายตา" },
          { q: "appeals to the viewer's brain", p: "to please the brain", th: "ทำให้สมองพอใจ/ถูกใจ" },
        ],
        keyVocab: { word: "visual intricacy / level of detail", th: "ความซับซ้อนทางสายตา / ระดับรายละเอียด", note: "'intricacy' และ 'level of detail' = complexity จึงตอบ B (complexity)" }
    },
    33: {
        questionPhrase: { en: "certain repeated ___ occurring in the natural world", th: "___ ที่เกิดซ้ำ ๆ ซึ่งพบบ่อยในธรรมชาติ" },
        passagePhrase: { en: "'fractals' – repeated motifs recurring in different scales", th: "'แฟร็กทัล' – ลวดลายที่เกิดซ้ำในขนาดต่าง ๆ" },
        pairs: [
          { q: "certain repeated", p: "repeated motifs recurring in different scales", th: "ลวดลายที่เกิดซ้ำ ๆ", note: "'motifs' = images ในรายการคำ ลวดลาย/ภาพที่เกิดซ้ำพบทั่วในธรรมชาติ จึงตอบ H (images)" },
          { q: "images", p: "motifs", th: "ภาพ/ลวดลาย" },
          { q: "occur frequently in the natural world", p: "common throughout nature", th: "พบบ่อยทั่วไปในธรรมชาติ" },
        ],
        keyVocab: { word: "repeated motifs recurring in nature", th: "ลวดลายที่เกิดซ้ำในธรรมชาติ", note: "'motifs' = images ในรายการคำ ลวดลาย/ภาพที่เกิดซ้ำพบทั่วในธรรมชาติ จึงตอบ H (images)" }
    },
    34: {
        questionPhrase: { en: "Forsythe's findings contradicted previous beliefs on fractals", th: "ผลของฟอร์ไซธ์ขัดแย้งกับความเชื่อเดิมเรื่องแฟร็กทัล" },
        passagePhrase: { en: "appealing pieces show signs of 'fractals' ... common throughout nature", th: "งานที่ดึงดูดใจมีร่องรอยของ 'แฟร็กทัล' ... พบทั่วในธรรมชาติ" },
        pairs: [
          { q: "'fractals' in art", p: "show signs of 'fractals'", th: "แฟร็กทัลในงานศิลปะ", note: "เนื้อเรื่องไม่เคยกล่าวถึง 'ความเชื่อเดิม' ที่ฟอร์ไซธ์ไปขัดแย้ง จึงไม่มีข้อมูล ตอบ NOT GIVEN" },
          { q: "Forsythe's findings", p: "Alex Forsythe", th: "ผลการศึกษาของฟอร์ไซธ์" },
          { q: "function of 'fractals'", p: "fractals are common throughout nature", th: "บทบาทของแฟร็กทัล" },
        ],
        keyVocab: { word: "no mention of previous beliefs", th: "ไม่มีการพูดถึงความเชื่อเดิม", note: "เนื้อเรื่องไม่เคยกล่าวถึง 'ความเชื่อเดิม' ที่ฟอร์ไซธ์ไปขัดแย้ง จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "mirror-neuron ideas require further verification", th: "แนวคิดเรื่องเซลล์กระจกต้องการการพิสูจน์เพิ่มเติม" },
        passagePhrase: { en: "The hypothesis will need to be thoroughly tested, however", th: "อย่างไรก็ตาม สมมติฐานนี้จำเป็นต้องถูกทดสอบอย่างละเอียด" },
        pairs: [
          { q: "require further verification", p: "will need to be thoroughly tested", th: "ต้องการการพิสูจน์/ทดสอบเพิ่มเติม", note: "'thoroughly tested' = require further verification ตรงกับความเห็นผู้เขียน จึงตอบ YES" },
          { q: "'mirror neurons'", p: "'mirror neurons'", th: "เซลล์ประสาทกระจก" },
          { q: "Certain ideas", p: "The hypothesis", th: "แนวคิด/สมมติฐาน" },
        ],
        keyVocab: { word: "will need to be thoroughly tested", th: "จำเป็นต้องถูกทดสอบอย่างละเอียด", note: "'thoroughly tested' = require further verification ตรงกับความเห็นผู้เขียน จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "taste in paintings depends entirely on current trends", th: "รสนิยมในภาพวาดขึ้นกับเทรนด์ปัจจุบันทั้งหมด" },
        passagePhrase: { en: "works best adapted to our visual system may be the most likely to linger", th: "งานที่เข้ากับระบบการมองของเราที่สุด มีแนวโน้มอยู่ยืนนานที่สุด" },
        pairs: [
          { q: "depends entirely on the current artistic trends", p: "the fashions of the time might shape what is currently popular", th: "ขึ้นกับเทรนด์ปัจจุบัน", note: "ผู้เขียนบอกเทรนด์ 'อาจ' มีผลแค่บางส่วน แต่ระบบการมองก็สำคัญ ขัดกับคำว่า 'entirely' จึงตอบ NO" },
          { q: "current artistic trends of the period", p: "the fashions of the time", th: "เทรนด์/แฟชั่นของยุคนั้น" },
          { q: "People's taste in paintings", p: "what is currently popular", th: "รสนิยมในภาพวาดของผู้คน" },
        ],
        keyVocab: { word: "entirely", th: "ทั้งหมด / โดยสิ้นเชิง", contrastA: "entirely . ทั้งหมด", contrastB: "might shape what is popular . อาจมีอิทธิพลบ้าง", note: "ผู้เขียนบอกเทรนด์ 'อาจ' มีผลแค่บางส่วน แต่ระบบการมองก็สำคัญ ขัดกับคำว่า 'entirely' จึงตอบ NO" }
    },
    37: {
        questionPhrase: { en: "scientists should define precise rules for reactions to art", th: "นักวิทยาศาสตร์ควรกำหนดกฎที่แน่นอนเรื่องปฏิกิริยาต่อศิลปะ" },
        passagePhrase: { en: "it would be foolish to reduce art appreciation to a set of scientific laws", th: "เป็นเรื่องโง่เขลาที่จะลดทอนการชื่นชมศิลปะให้เหลือเพียงกฎวิทยาศาสตร์" },
        pairs: [
          { q: "define the precise rules", p: "reduce art appreciation to a set of scientific laws", th: "กำหนดกฎที่ตายตัว", note: "'scientific laws' = precise rules แต่ผู้เขียนบอกว่า 'foolish' จึงไม่เห็นด้วย ตอบ NO" },
          { q: "precise rules", p: "scientific laws", th: "กฎที่แน่นอน" },
          { q: "people's reactions to works of art", p: "art appreciation", th: "การตอบสนอง/ชื่นชมงานศิลปะ" },
        ],
        keyVocab: { word: "foolish to reduce ... to scientific laws", th: "โง่เขลาที่จะลดทอนให้เหลือกฎวิทยาศาสตร์", note: "'scientific laws' = precise rules แต่ผู้เขียนบอกว่า 'foolish' จึงไม่เห็นด้วย ตอบ NO" }
    },
    38: {
        questionPhrase: { en: "should consider the cultural context an artist worked in", th: "ควรคำนึงถึงบริบททางวัฒนธรรมที่ศิลปินทำงานอยู่" },
        passagePhrase: { en: "shouldn't underestimate ... their place in history and the artistic environment of their time", th: "ไม่ควรมองข้าม ... ตำแหน่งในประวัติศาสตร์และสภาพแวดล้อมทางศิลปะของยุคนั้น" },
        pairs: [
          { q: "the cultural context in which an artist worked", p: "their place in history and the artistic environment of their time", th: "บริบททางวัฒนธรรมที่ศิลปินทำงานอยู่", note: "'place in history / artistic environment' = cultural context และ 'shouldn't underestimate' = ควรคำนึงถึง จึงตอบ YES" },
          { q: "should always involve taking into consideration", p: "We shouldn't underestimate the importance", th: "ควรให้ความสำคัญ/คำนึงถึง" },
          { q: "cultural context", p: "the artistic environment of their time", th: "สภาพแวดล้อมทางศิลปะของยุคนั้น" },
        ],
        keyVocab: { word: "place in history and artistic environment", th: "ตำแหน่งในประวัติศาสตร์และสภาพแวดล้อมทางศิลปะ", note: "'place in history / artistic environment' = cultural context และ 'shouldn't underestimate' = ควรคำนึงถึง จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "easier to find meaning in science than in art", th: "หาความหมายในวิทยาศาสตร์ง่ายกว่าในศิลปะ" },
        passagePhrase: { en: "it's not so different to science, where we are ... decoding meaning", th: "ไม่ต่างจากวิทยาศาสตร์ ที่เรา ... ถอดรหัสความหมาย" },
        pairs: [
          { q: "the field of science", p: "it's not so different to science", th: "แวดวงวิทยาศาสตร์", note: "ผู้เขียนบอกศิลปะกับวิทยาศาสตร์ 'คล้ายกัน' แต่ไม่เคยเทียบว่าอันไหนหาความหมายง่ายกว่า จึงตอบ NOT GIVEN" },
          { q: "find meaning", p: "decoding meaning", th: "ค้นหา/ถอดความหมาย" },
          { q: "that of art", p: "Abstract art", th: "ด้านศิลปะ" },
        ],
        keyVocab: { word: "not so different to science", th: "ไม่ต่างจากวิทยาศาสตร์", note: "ผู้เขียนบอกศิลปะกับวิทยาศาสตร์ 'คล้ายกัน' แต่ไม่เคยเทียบว่าอันไหนหาความหมายง่ายกว่า จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "scientific insights into how the brain responds to abstract art", th: "ข้อค้นพบทางวิทยาศาสตร์ว่าสมองตอบสนองต่อศิลปะนามธรรมอย่างไร" },
        passagePhrase: { en: "Could the same approach shed light on abstract twentieth-century pieces", th: "วิธีเดียวกันนี้จะช่วยให้เข้าใจงานนามธรรมศตวรรษที่ 20 ได้ไหม" },
        pairs: [
          { q: "abstract art", p: "abstract twentieth-century pieces", th: "ศิลปะนามธรรม", note: "ทั้งบทความใช้การวิจัยสมอง (scientific) มาอธิบายการตอบสนองต่อศิลปะนามธรรม จึงเหมาะกับ subtitle A" },
          { q: "scientific insights", p: "scientific objectivity to the study of art", th: "ข้อค้นพบทางวิทยาศาสตร์" },
          { q: "how the brain responds", p: "stimulate the brain's amygdala", th: "สมองตอบสนองอย่างไร" },
        ],
        keyVocab: { word: "shed light on abstract ... pieces", th: "ทำให้กระจ่างเกี่ยวกับงานนามธรรม", note: "ทั้งบทความใช้การวิจัยสมอง (scientific) มาอธิบายการตอบสนองต่อศิลปะนามธรรม จึงเหมาะกับ subtitle A" }
    },
  },
  "Cambridge 11 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "books that assume a lack of mathematical knowledge", th: "หนังสือที่ตั้งสมมติฐานว่าผู้อ่านไม่มีความรู้คณิตศาสตร์" },
        passagePhrase: { en: "books to explain their fields to non-scientists", th: "หนังสือที่อธิบายสาขาของตนให้คนที่ไม่ใช่นักวิทยาศาสตร์" },
        pairs: [
          { q: "books", p: "written books", th: "หนังสือที่ถูกเขียนขึ้น" },
          { q: "assume a lack of mathematical knowledge", p: "explain their fields to non-scientists", th: "ตั้งสมมติฐานว่าผู้อ่านไม่มีพื้นความรู้", note: "non-scientists สื่อว่าผู้อ่านขาดความรู้ ตรงกับ 'lack of mathematical knowledge' จึงตอบ D" },
          { q: "mathematical knowledge", p: "the mathematics", th: "ความรู้คณิตศาสตร์" },
        ],
        keyVocab: { word: "non-scientists", th: "คนที่ไม่ใช่นักวิทยาศาสตร์ (ผู้ขาดความรู้)", note: "คำว่า non-scientists สื่อว่าผู้อ่านไม่มีพื้นความรู้ ตรงกับ 'lack of mathematical knowledge' จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "this is not a typical book about mathematics", th: "หนังสือเล่มนี้ไม่ใช่หนังสือคณิตศาสตร์แบบทั่วไป" },
        passagePhrase: { en: "this book differs from most books on mathematics", th: "หนังสือเล่มนี้แตกต่างจากหนังสือคณิตศาสตร์ส่วนใหญ่" },
        pairs: [
          { q: "not a typical book about mathematics", p: "this book differs from most books on mathematics", th: "หนังสือเล่มนี้ต่างจากหนังสือคณิตทั่วไป", note: "differs from most books = ไม่ใช่แบบทั่วไป (not typical) จึงตอบ B" },
          { q: "typical", p: "most books", th: "แบบส่วนใหญ่/ทั่วไป" },
          { q: "this", p: "this book", th: "หนังสือเล่มนี้" },
        ],
        keyVocab: { word: "differs from", th: "แตกต่างจาก", note: "differs from most books = ไม่ typical ความหมายตรงกัน จึงตอบ B" }
    },
    29: {
        questionPhrase: { en: "personal examples of being helped by mathematics", th: "ตัวอย่างส่วนตัวของคนที่ได้รับประโยชน์จากคณิตศาสตร์" },
        passagePhrase: { en: "studied mathematics can master the legal principles", th: "ผู้ที่เรียนคณิตศาสตร์เชี่ยวชาญหลักกฎหมายได้ดีกว่า" },
        pairs: [
          { q: "personal examples", p: "A lawyer made the same point", th: "ตัวอย่างประสบการณ์ส่วนตัว" },
          { q: "being helped by mathematics", p: "studied mathematics can master the legal principles", th: "ได้รับประโยชน์จากการเรียนคณิตศาสตร์", note: "คำให้การส่วนตัวของทนาย/หมอที่คณิตช่วยพวกเขา = personal examples of being helped จึงตอบ G" },
        ],
        keyVocab: { word: "master ... in a way that most others cannot", th: "เชี่ยวชาญได้แบบที่คนอื่นทำไม่ได้", note: "คำให้การส่วนตัวของหมอและทนายที่คณิตศาสตร์ช่วยพวกเขา = personal examples of being helped จึงตอบ G" }
    },
    30: {
        questionPhrase: { en: "people with abilities that seemed incompatible", th: "คนที่มีความสามารถซึ่งดูเหมือนจะเข้ากันไม่ได้" },
        passagePhrase: { en: "a structural engineer who is an artist", th: "วิศวกรโครงสร้างที่เป็นศิลปินด้วย" },
        pairs: [
          { q: "abilities that seemed incompatible", p: "a structural engineer who is an artist", th: "ความสามารถสองด้านที่ดูเข้ากันไม่ได้", note: "วิศวกร+ศิลปินในคนเดียวคือความสามารถที่ดู incompatible จึงตอบ C" },
          { q: "examples of people", p: "I cite", th: "ยกตัวอย่างผู้คน" },
          { q: "each had abilities", p: "an electrical engineer who is an opera singer", th: "แต่ละคนมีความสามารถหลายด้าน" },
        ],
        keyVocab: { word: "structural engineer who is an artist", th: "วิศวกรที่เป็นศิลปิน (สองด้านที่ดูขัดกัน)", contrastA: "engineer . wisawakon (วิเคราะห์/ตัวเลข)", contrastB: "artist . sinlapin (สร้างสรรค์/ศิลปะ)", note: "วิศวกร+ศิลปิน เป็นความสามารถที่ดู incompatible แต่อยู่ในคนเดียว จึงตอบ C" }
    },
    31: {
        questionPhrase: { en: "different focuses of books about mathematics", th: "จุดเน้นที่ต่างกันของหนังสือคณิตศาสตร์" },
        passagePhrase: { en: "Some present lives; Others describe applications; Yet others procedures", th: "บางเล่มเล่าชีวิต บางเล่มอธิบายการประยุกต์ บางเล่มเล่าวิธีการ" },
        pairs: [
          { q: "different focuses", p: "Some present the lives of colorful mathematicians", th: "จุดเน้นที่ต่างกัน", note: "การไล่ Some/Others/Yet others แสดง different focuses ของหนังสือ จึงตอบ B" },
          { q: "different focuses", p: "Others describe important applications", th: "เน้นคนละเรื่องกัน" },
          { q: "books about mathematics", p: "books on mathematics written for the general public", th: "หนังสือเกี่ยวกับคณิตศาสตร์" },
        ],
        keyVocab: { word: "Some ... Others ... Yet others", th: "บางเล่ม...บางเล่ม...บางเล่มอื่น", note: "การไล่ Some/Others/Yet others แสดง 'different focuses' ของหนังสือ จึงตอบ B" }
    },
    32: {
        questionPhrase: { en: "contrast between this book and other publications", th: "การเปรียบเทียบระหว่างหนังสือเล่มนี้กับสิ่งพิมพ์อื่น" },
        passagePhrase: { en: "turn these pages much more slowly than reading a novel or newspaper", th: "พลิกหน้าหนังสือนี้ช้ากว่าตอนอ่านนิยายหรือหนังสือพิมพ์มาก" },
        pairs: [
          { q: "contrast", p: "much more slowly than", th: "การเปรียบเทียบความต่าง", note: "เทียบการอ่านเล่มนี้กับ novel/newspaper ว่าช้ากว่า = contrast กับสิ่งพิมพ์อื่น จึงตอบ E" },
          { q: "reading this book", p: "turn these pages", th: "การอ่านหนังสือเล่มนี้" },
          { q: "other kinds of publication", p: "a novel or a newspaper", th: "สิ่งพิมพ์ประเภทอื่น" },
        ],
        keyVocab: { word: "more slowly than reading a novel or a newspaper", th: "ช้ากว่าการอ่านนิยายหรือหนังสือพิมพ์", note: "เปรียบเทียบการอ่านเล่มนี้กับ novel/newspaper = contrast กับ publications อื่น จึงตอบ E" }
    },
    33: {
        questionPhrase: { en: "the whole book is accessible to everybody", th: "ทั้งเล่มเข้าใจได้สำหรับทุกคน" },
        passagePhrase: { en: "Anyone can understand every step in the reasoning", th: "ใครก็ตามเข้าใจทุกขั้นตอนของการให้เหตุผลได้" },
        pairs: [
          { q: "accessible to everybody", p: "Anyone can understand", th: "ทุกคนเข้าถึง/เข้าใจได้", note: "Anyone=everybody และ every step=ทั้งเล่ม จึงเป็นข้ออ้างว่าทุกคนเข้าถึงได้ ตอบ A" },
          { q: "the whole of the book", p: "every step in the reasoning", th: "ทั้งเล่ม/ทุกขั้นตอน" },
        ],
        keyVocab: { word: "Anyone ... every step", th: "ใครก็ได้...ทุกขั้นตอน", note: "Anyone=everybody และ every step=the whole book จึงเป็นข้ออ้างว่าทุกคนเข้าถึงได้ ตอบ A" }
    },
    34: {
        questionPhrase: { en: "different categories of intended readers", th: "ประเภทผู้อ่านที่ตั้งใจให้อ่านซึ่งแตกต่างกัน" },
        passagePhrase: { en: "I kept in mind two types of readers", th: "ผมนึกถึงผู้อ่านสองประเภทไว้ในใจ" },
        pairs: [
          { q: "different categories", p: "two types", th: "ประเภทที่แตกต่างกัน", note: "two types of readers = different categories of intended readers จึงตอบ F" },
          { q: "intended readers", p: "readers", th: "ผู้อ่านที่ตั้งใจให้อ่าน" },
          { q: "this book", p: "this book", th: "หนังสือเล่มนี้" },
        ],
        keyVocab: { word: "two types of readers", th: "ผู้อ่านสองประเภท", note: "two types of readers = different categories of intended readers จึงตอบ F" }
    },
    35: {
        questionPhrase: { en: "suitable for someone who is a", th: "เหมาะกับคนที่เป็น (มือใหม่)" },
        passagePhrase: { en: "parts so simple a beginner could play them", th: "ส่วนที่ง่ายจนมือใหม่ก็เล่นได้" },
        pairs: [
          { q: "both music and mathematics", p: "musical compositions", th: "ทั้งดนตรีและคณิตศาสตร์" },
          { q: "suitable for someone who is a", p: "so simple a beginner could play them", th: "เหมาะกับมือใหม่", note: "ส่วนที่ง่ายจนมือใหม่ทำได้ คำตอบคือ beginner" },
        ],
        keyVocab: { word: "beginner", th: "มือใหม่ ผู้เริ่มต้น", note: "ทั้งดนตรีและคณิตศาสตร์มีส่วนง่ายที่ beginner ทำได้ คำตอบคือ beginner" }
    },
    36: {
        questionPhrase: { en: "understand advanced mathematics using no more than", th: "เข้าใจคณิตขั้นสูงโดยใช้ไม่เกิน (เลขคณิตเล็กน้อย)" },
        passagePhrase: { en: "they may involve, at most, a little arithmetic", th: "อาจใช้แค่เลขคณิตเพียงเล็กน้อยเป็นอย่างมาก" },
        pairs: [
          { q: "advanced mathematics", p: "advanced mathematics", th: "คณิตศาสตร์ขั้นสูง" },
          { q: "using no more than", p: "at most, a little", th: "ใช้ไม่เกิน/อย่างมากก็แค่", note: "'no more than a limited knowledge' ตรงกับ 'at most a little arithmetic' คำตอบคือ arithmetic" },
        ],
        keyVocab: { word: "arithmetic", th: "เลขคณิต (บวกลบคูณหารพื้นฐาน)", note: "'no more than a limited knowledge' ตรงกับ 'at most a little arithmetic' คำตอบคือ arithmetic" }
    },
    37: {
        questionPhrase: { en: "mathematics requires ... thinking as well as analytical", th: "คณิตศาสตร์ต้องใช้การคิดแบบ (สัญชาตญาณ) ควบคู่การวิเคราะห์" },
        passagePhrase: { en: "its logical, yet intuitive, style of thinking", th: "รูปแบบการคิดที่เป็นตรรกะแต่ก็ใช้สัญชาตญาณ" },
        pairs: [
          { q: "thinking", p: "style of thinking", th: "การคิด/รูปแบบการคิด" },
          { q: "as well as analytical skills", p: "logical, yet intuitive", th: "ควบคู่กับการวิเคราะห์", note: "ข้อต่อ 'as well as analytical' ชี้คู่ตรงข้ามของ analytical คือ intuitive" },
        ],
        keyVocab: { word: "intuitive", th: "ใช้สัญชาตญาณ หยั่งรู้", contrastA: "intuitive . sanchatayan (หยั่งรู้)", contrastB: "analytical . wikhro (วิเคราะห์/ตัวเลข)", note: "ข้อต่อ 'as well as analytical' ชี้ว่าต้องการคู่ตรงข้ามของ analytical คือ intuitive" }
    },
    38: {
        questionPhrase: { en: "Some books written by ... have had to leave out the mathematics", th: "หนังสือที่เขียนโดย (นักวิทยาศาสตร์) ต้องตัดคณิตศาสตร์ออก" },
        passagePhrase: { en: "Other scientists have written books ... to omit the mathematics", th: "นักวิทยาศาสตร์คนอื่นเขียนหนังสือ...ต้องละคณิตศาสตร์ไว้" },
        pairs: [
          { q: "Some books written by", p: "Other scientists have written books", th: "หนังสือที่เขียนโดยนักวิทยาศาสตร์", note: "ผู้เขียนคือ scientists คำตอบคือ scientists" },
          { q: "leave out the mathematics", p: "omit the mathematics", th: "ตัด/ละคณิตศาสตร์ออก" },
          { q: "central to their theories", p: "the foundation of their theories", th: "เป็นแกนหลักของทฤษฎี" },
        ],
        keyVocab: { word: "scientists", th: "นักวิทยาศาสตร์", note: "'leave out' = omit และผู้เขียนคือ scientists คำตอบคือ scientists" }
    },
    39: {
        questionPhrase: { en: "advises readers to perform ... while reading", th: "แนะให้ผู้อ่านทำ (การทดลอง) ขณะอ่าน" },
        passagePhrase: { en: "ready to check claims and carry out experiments", th: "เตรียมพร้อมตรวจสอบข้ออ้างและทำการทดลอง" },
        pairs: [
          { q: "perform", p: "carry out", th: "ลงมือทำ" },
          { q: "while reading", p: "ready to check claims", th: "ขณะอ่าน (ตรวจสอบไปด้วย)" },
          { q: "perform …………………… while reading", p: "experiments", th: "ทำการทดลอง", note: "'perform' = 'carry out' สิ่งที่ทำคือ experiments คำตอบคือ experiments" },
        ],
        keyVocab: { word: "experiments", th: "การทดลอง", note: "'perform' ตรงกับ 'carry out' และสิ่งที่ทำคือ experiments คำตอบคือ experiments" }
    },
    40: {
        questionPhrase: { en: "studying ... helped even more than other areas of mathematics", th: "การเรียน (ทฤษฎีบท) ช่วยได้มากกว่าคณิตศาสตร์ด้านอื่น" },
        passagePhrase: { en: "through the study of mathematics, and, in particular, theorems", th: "ผ่านการเรียนคณิตศาสตร์ โดยเฉพาะอย่างยิ่งทฤษฎีบท" },
        pairs: [
          { q: "studying", p: "the study of mathematics", th: "การเรียน/การศึกษา" },
          { q: "helped even more than other areas of mathematics", p: "in particular, theorems", th: "ช่วยได้มากกว่าคณิตด้านอื่น", note: "'in particular' เน้นว่าทฤษฎีบทช่วยมากกว่าด้านอื่น คำตอบคือ theorems" },
        ],
        keyVocab: { word: "theorems", th: "ทฤษฎีบท", note: "'in particular' เน้นว่าทฤษฎีบทช่วยมากกว่าด้านอื่น คำตอบคือ theorems" }
    },
  },
  "Cambridge 11 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "the most important invention of all", th: "สิ่งประดิษฐ์ที่สำคัญที่สุดในบรรดาทั้งหมด" },
        passagePhrase: { en: "all other inventions pale in significance", th: "สิ่งประดิษฐ์อื่นทั้งหมดดูด้อยความสำคัญลงไป" },
        pairs: [
          { q: "most important invention of all", p: "all other inventions pale in significance", th: "สำคัญที่สุด สิ่งประดิษฐ์อื่นด้อยความสำคัญลงไป", note: "วลีนี้บอกว่าภาษาเหนือกว่าสิ่งประดิษฐ์อื่นทั้งหมด จึงตรงกับหัวข้อ vi" },
          { q: "invention", p: "creations", th: "สิ่งประดิษฐ์ / สิ่งที่สร้างขึ้น" },
          { q: "most important", p: "take pride of place", th: "สำคัญที่สุด อยู่ในตำแหน่งสูงสุด" },
        ],
        keyVocab: { word: "pale in significance", th: "ดูด้อยความสำคัญเมื่อเทียบกัน", note: "วลีนี้บอกว่าภาษาเหนือกว่าสิ่งประดิษฐ์อื่นทั้งหมด จึงตรงกับหัวข้อ vi ว่าภาษาสำคัญที่สุด" }
    },
    28: {
        questionPhrase: { en: "of language", th: "ของภาษา (หัวข้อที่ถูกเซ็นเซอร์บางส่วน)" },
        passagePhrase: { en: "a tool of extraordinary sophistication, yet ingenious simplicity", th: "เครื่องมือที่ซับซ้อนอย่างยิ่ง แต่ตั้งอยู่บนความเรียบง่ายอันชาญฉลาด" },
        pairs: [
          { q: "of language", p: "extraordinary sophistication", th: "ความซับซ้อนอันยิ่งใหญ่ของภาษา" },
          { q: "of language", p: "ingenious simplicity", th: "ความเรียบง่ายอันชาญฉลาด", note: "ย่อหน้า B พูดถึงความขัดแย้งระหว่างความซับซ้อนกับความเรียบง่ายของภาษา จึงเข้ากับหัวข้อ iv" },
          { q: "of language", p: "marvellous invention", th: "สิ่งประดิษฐ์อันน่าทึ่ง (คือภาษา)" },
        ],
        keyVocab: { word: "sophistication / simplicity", th: "ความซับซ้อน / ความเรียบง่าย", contrastA: "sophistication . ความซับซ้อน", contrastB: "simplicity . ความเรียบง่าย", note: "ย่อหน้า B พูดถึงความขัดแย้งระหว่างความซับซ้อนกับความเรียบง่ายของภาษา จึงเข้ากับหัวข้อ iv" }
    },
    29: {
        questionPhrase: { en: "few sounds organised to convey huge range of meaning", th: "เสียงไม่กี่เสียงถูกจัดเรียงเพื่อสื่อความหมายมากมาย" },
        passagePhrase: { en: "arrange them in special orders... nothing these sounds cannot do", th: "จัดเรียงเสียงในลำดับพิเศษ จนไม่มีสิ่งใดที่เสียงเหล่านี้ทำไม่ได้" },
        pairs: [
          { q: "a few sounds", p: "twenty-five or thirty sounds", th: "เสียงเพียงไม่กี่เสียง" },
          { q: "are organised", p: "arrange them in some very special orders", th: "ถูกจัดเรียงอย่างเป็นระบบ", note: "การ 'จัดเรียง' เสียงไม่กี่เสียงให้สื่อความหมายไม่จำกัด ตรงกับหัวข้อ ii" },
          { q: "convey a huge range of meaning", p: "infinite variety of subtle senses", th: "สื่อความหมายได้มากมายไม่จำกัด" },
        ],
        keyVocab: { word: "arrange them in some very special orders", th: "จัดเรียงเสียงในลำดับที่พิเศษมาก", note: "การ 'จัดเรียง' เสียงไม่กี่เสียงให้สื่อความหมายไม่จำกัด ตรงกับหัวข้อ ii" }
    },
    30: {
        questionPhrase: { en: "the universal ability to use language", th: "ความสามารถใช้ภาษาที่มีอยู่ในทุกคน" },
        passagePhrase: { en: "one doesn't have to be a genius to set its wheels in motion", th: "ไม่ต้องเป็นอัจฉริยะก็ใช้ภาษาได้" },
        pairs: [
          { q: "universal", p: "just about everybody", th: "ทุกคน / มีอยู่ในทุกคน" },
          { q: "ability to use language", p: "doesn't have to be a genius to set its wheels in motion", th: "ความสามารถใช้ภาษาได้โดยไม่ต้องเก่งพิเศษ", note: "การที่ทุกคนใช้ภาษาได้โดยไม่ต้องเป็นอัจฉริยะ คือ 'universal ability' จึงตรงกับหัวข้อ vii" },
        ],
        keyVocab: { word: "doesn't have to be a genius", th: "ไม่จำเป็นต้องเป็นอัจฉริยะ", note: "การที่ทุกคนใช้ภาษาได้โดยไม่ต้องเก่งพิเศษ คือ 'universal ability' จึงตรงกับหัวข้อ vii" }
    },
    31: {
        questionPhrase: { en: "differences between languages highlight their impressiveness", th: "ความต่างระหว่างภาษาทำให้เห็นความน่าทึ่งของภาษา" },
        passagePhrase: { en: "estrangement of foreign tongues... brings home the wonder", th: "ความแปลกของภาษาต่างถิ่นทำให้เห็นความมหัศจรรย์ของภาษา" },
        pairs: [
          { q: "differences between languages", p: "estrangement of foreign tongues", th: "ความแตกต่าง/แปลกตาของภาษาต่างถิ่น" },
          { q: "highlight", p: "brings home", th: "ทำให้เห็น/ตระหนักถึง", note: "ภาษาต่างถิ่นที่แปลกพิเศษทำให้เห็นความน่าประทับใจของภาษา ตรงกับหัวข้อ i" },
          { q: "impressiveness", p: "wonder", th: "ความน่าทึ่ง / น่าประทับใจ" },
        ],
        keyVocab: { word: "brings home the wonder", th: "ทำให้ตระหนักถึงความน่าทึ่ง", note: "ภาษาต่างถิ่นที่แปลกพิเศษทำให้เห็นความน่าประทับใจของภาษา ตรงกับหัวข้อ i" }
    },
    32: {
        questionPhrase: { en: "even silence can be meaningful", th: "แม้แต่ความเงียบก็มีความหมายได้" },
        passagePhrase: { en: "even a non-sound... has been invested with a specific function", th: "แม้แต่การไม่มีเสียงก็ถูกกำหนดให้มีหน้าที่เฉพาะ" },
        pairs: [
          { q: "silence", p: "non-sound", th: "ความเงียบ / การไม่มีเสียง", note: "'non-sound' คือคำพ้องของ silence เมื่อมันมีหน้าที่ ก็ตรงกับหัวข้อ v" },
          { q: "can be meaningful", p: "invested with a specific function", th: "มีความหมาย/มีหน้าที่เฉพาะได้" },
        ],
        keyVocab: { word: "non-sound", th: "การไม่มีเสียง / ความเงียบ", note: "'non-sound' คือคำพ้องของ silence เมื่อมันมีหน้าที่ ก็ตรงกับหัวข้อ v" }
    },
    33: {
        questionPhrase: { en: "major impact on ___ aspects of life", th: "ส่งผลกระทบใหญ่ต่อ ___ ด้านของชีวิต" },
        passagePhrase: { en: "transformed our material existence", th: "เปลี่ยนแปลงชีวิตด้านวัตถุของเรา" },
        pairs: [
          { q: "major impact", p: "transformed", th: "ส่งผลกระทบใหญ่ / เปลี่ยนแปลงอย่างมาก" },
          { q: "aspects of life", p: "material existence", th: "ด้านของชีวิต (ในเนื้อเรื่องคือด้านวัตถุ)", note: "'aspects of life' ที่ล้อ wheel คือ material existence ในเนื้อเรื่อง คำตอบจึงเป็น E (material)" },
        ],
        keyVocab: { word: "material", th: "เกี่ยวกับวัตถุ / ด้านวัตถุ", note: "'aspects of life' ที่ล้อ wheel คือ material existence ในเนื้อเรื่อง คำตอบจึงเป็น E (material)" }
    },
    34: {
        questionPhrase: { en: "no impact has been as ___ as language", th: "ไม่มีผลกระทบใดสำคัญพื้นฐานเท่าภาษา" },
        passagePhrase: { en: "everything we have ever achieved depends on language and originates from it", th: "ทุกสิ่งที่เราทำสำเร็จล้วนพึ่งพาและเกิดจากภาษา" },
        pairs: [
          { q: "no impact has been as ___ as", p: "everything we have ever achieved depends on language", th: "ไม่มีสิ่งใดสำคัญพื้นฐานเท่า ทุกอย่างพึ่งพาภาษา" },
          { q: "fundamental", p: "originates from it", th: "เป็นรากฐาน / มีต้นกำเนิดมาจากมัน", note: "ภาษาเป็นรากฐานที่ทุกอย่างเกิดขึ้นมา จึงเป็น 'fundamental' คำตอบคือ G" },
        ],
        keyVocab: { word: "originates from it", th: "มีต้นกำเนิดมาจากมัน", note: "ภาษาเป็นรากฐานที่ทุกอย่างเกิดขึ้นมา จึงเป็น 'fundamental' คำตอบคือ G" }
    },
    35: {
        questionPhrase: { en: "language is very ___, yet just a small number of sounds", th: "ภาษา ___ มาก แต่ใช้เสียงเพียงไม่กี่เสียง" },
        passagePhrase: { en: "extraordinary sophistication... twenty-five or thirty sounds", th: "ความซับซ้อนอันยิ่งใหญ่ จากเสียงเพียงยี่สิบห้าถึงสามสิบเสียง" },
        pairs: [
          { q: "complex", p: "extraordinary sophistication", th: "ซับซ้อนอย่างยิ่ง", note: "sophistication เป็นคำพ้องของ complex ตัดกับ 'small number of sounds' คำตอบคือ B (complex)" },
          { q: "a small number of sounds", p: "twenty-five or thirty sounds", th: "เสียงเพียงไม่กี่เสียง" },
        ],
        keyVocab: { word: "sophistication", th: "ความซับซ้อน", note: "sophistication เป็นคำพ้องของ complex ตัดกับ 'small number of sounds' คำตอบคือ B (complex)" }
    },
    36: {
        questionPhrase: { en: "language appears to be ___ to use", th: "ภาษาดูเหมือนใช้ได้ ___" },
        passagePhrase: { en: "without the slightest exertion... this deceptive ease", th: "โดยแทบไม่ต้องออกแรงเลย ความง่ายที่ลวงตา" },
        pairs: [
          { q: "easy to use", p: "without the slightest exertion", th: "ใช้ง่าย โดยแทบไม่ต้องออกแรง", note: "'ease' และ 'without exertion' หมายถึงง่าย คำตอบคือ F (easy)" },
          { q: "sophistication is often overlooked", p: "triumphs are usually taken for granted", th: "ความซับซ้อนมักถูกมองข้าม / ถือเป็นเรื่องธรรมดา" },
        ],
        keyVocab: { word: "deceptive ease", th: "ความง่ายที่ลวงตา", note: "'ease' และ 'without exertion' หมายถึงง่าย คำตอบคือ F (easy)" }
    },
    37: {
        questionPhrase: { en: "could have achieved present position without language", th: "อาจไปถึงสถานะปัจจุบันได้แม้ไม่มีภาษา" },
        passagePhrase: { en: "Without language, we could never have embarked on our ascent", th: "หากไม่มีภาษา เราคงไม่มีทางเริ่มก้าวขึ้นสู่อำนาจได้เลย" },
        pairs: [
          { q: "might have achieved", p: "could never have embarked", th: "อาจทำได้ vs ไม่มีทางทำได้เลย", note: "ผู้เขียนบอก 'could never' แต่คำถามบอก 'might have' จึงขัดแย้งกัน คำตอบคือ NO" },
          { q: "their present position", p: "unparalleled power over all other animals", th: "สถานะปัจจุบัน / อำนาจเหนือสิ่งอื่น" },
          { q: "without language", p: "Without language", th: "หากไม่มีภาษา" },
        ],
        keyVocab: { word: "could never have", th: "คงไม่มีทางจะ...ได้เลย", contrastA: "could never . ไม่มีทางเป็นไปได้", contrastB: "might have . อาจจะเป็นไปได้", note: "ผู้เขียนบอก 'could never' แต่คำถามบอก 'might have' จึงขัดแย้งกัน คำตอบคือ NO" }
    },
    38: {
        questionPhrase: { en: "Port-Royal grammarians did justice to language", th: "นักไวยากรณ์ Port-Royal อธิบายภาษาได้สมคุณค่า" },
        passagePhrase: { en: "no one since has celebrated more eloquently the magnitude of its achievement", th: "ไม่มีใครหลังจากนั้นยกย่องความยิ่งใหญ่ของภาษาได้ไพเราะกว่า" },
        pairs: [
          { q: "did justice to the nature of language", p: "distilled the essence of language", th: "อธิบายแก่นแท้ของภาษาได้สมคุณค่า" },
          { q: "did justice to", p: "celebrated more eloquently", th: "ยกย่อง/อธิบายได้อย่างไพเราะที่สุด", note: "'did justice to' = อธิบายได้สมคุณค่า ตรงกับการยกย่องอย่างไพเราะที่สุด คำตอบคือ YES" },
          { q: "The Port-Royal grammarians", p: "renowned French grammarians of the Port-Royal abbey", th: "นักไวยากรณ์ Port-Royal" },
        ],
        keyVocab: { word: "celebrated more eloquently", th: "ยกย่องได้อย่างไพเราะที่สุด", note: "'did justice to' = อธิบายได้สมคุณค่า ตรงกับการยกย่องอย่างไพเราะที่สุด คำตอบคือ YES" }
    },
    39: {
        questionPhrase: { en: "complex idea clearer in a sentence than one word", th: "ความคิดซับซ้อนอธิบายชัดกว่าด้วยประโยคมากกว่าคำเดียว" },
        passagePhrase: { en: "express in one word what English takes a whole sentence to say", th: "สื่อในคำเดียวสิ่งที่ภาษาอังกฤษต้องใช้ทั้งประโยค" },
        pairs: [
          { q: "in a single word", p: "in one word", th: "ด้วยคำเดียว" },
          { q: "in a sentence", p: "a whole sentence", th: "ด้วยทั้งประโยค" },
          { q: "more clearly", p: "express", th: "สื่อความ (แต่ไม่ได้บอกว่าชัดกว่า)", note: "เนื้อเรื่องเทียบความยาว แต่ไม่พูดว่าอย่างไหน 'ชัดกว่า' จึงเป็น NOT GIVEN" },
        ],
        keyVocab: { word: "clearer (ความชัดเจน)", th: "ชัดเจนกว่า", note: "เนื้อเรื่องเทียบความยาว (คำเดียว vs ทั้งประโยค) แต่ไม่พูดว่าอย่างไหน 'ชัดกว่า' จึงเป็น NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "Sumerians started the recording of events", th: "ชาวสุเมเรียนเป็นผู้เริ่มการบันทึกเหตุการณ์" },
        passagePhrase: { en: "invented writing and thus enabled the documentation of history", th: "ประดิษฐ์การเขียนและทำให้บันทึกประวัติศาสตร์ได้" },
        pairs: [
          { q: "The Sumerians", p: "Sumerian", th: "ชาวสุเมเรียน" },
          { q: "responsible for starting", p: "invented writing and thus enabled", th: "เป็นผู้ริเริ่ม / ทำให้เกิดขึ้นได้" },
          { q: "the recording of events", p: "documentation of history", th: "การบันทึกเหตุการณ์/ประวัติศาสตร์", note: "'documentation of history' = recording of events ชาวสุเมเรียนทำให้สิ่งนี้เกิดขึ้น คำตอบคือ YES" },
        ],
        keyVocab: { word: "documentation of history", th: "การบันทึกประวัติศาสตร์", note: "'documentation of history' = recording of events ชาวสุเมเรียนทำให้สิ่งนี้เกิดขึ้น คำตอบคือ YES" }
    },
  },
  "Cambridge 12 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "A surprising course title", th: "ชื่อวิชาที่ชวนตกใจ/น่าประหลาดใจ" },
        passagePhrase: { en: "a course called 'Arson for Profit'", th: "วิชาที่ชื่อว่า 'วางเพลิงเพื่อกำไร'" },
        pairs: [
          { q: "surprising", p: "I kid you not", th: "น่าประหลาดใจ จนต้องย้ำว่าไม่ได้ล้อเล่น", note: "หัวเรื่อง vi 'surprising course title' ตรงกับย่อหน้า A ที่ผู้เขียนตกใจกับชื่อวิชา 'Arson for Profit' จึงเลือก vi" },
          { q: "course title", p: "a course called 'Arson for Profit'", th: "ชื่อวิชา" },
          { q: "surprising", p: "what would the founders of these two institutions have thought", th: "ชวนให้ฉงน/คาดไม่ถึง" },
        ],
        keyVocab: { word: "surprising", th: "น่าประหลาดใจ", note: "หัวเรื่อง vi 'surprising course title' ตรงกับย่อหน้า A ที่ผู้เขียนตกใจกับชื่อวิชา 'Arson for Profit' จึงเลือกข้อ vi" }
    },
    28: {
        questionPhrase: { en: "attracting the wrong kind of student", th: "ดึงดูดนักเรียนผิดประเภทเข้ามา" },
        passagePhrase: { en: "the perfect course for prospective arsonists to sign up for", th: "วิชาที่เหมาะมากสำหรับว่าที่คนวางเพลิงจะมาลงเรียน" },
        pairs: [
          { q: "the wrong kind of student", p: "prospective arsonists", th: "นักเรียนผิดประเภท คือว่าที่คนวางเพลิง", note: "'wrong kind of student' = ว่าที่คนวางเพลิงที่อาจมาเรียนเพื่อใช้ในทางร้าย จึงตรงกับหัวเรื่อง viii" },
          { q: "attracting", p: "sign up for", th: "ดึงดูดให้มาลงเรียน" },
          { q: "the possibility", p: "wouldn't this also be", th: "ความเป็นไปได้ที่อาจเกิดขึ้น" },
        ],
        keyVocab: { word: "prospective arsonists", th: "ว่าที่คนวางเพลิง", note: "'wrong kind of student' = ว่าที่คนวางเพลิง (arsonists) ที่อาจมาเรียนเพื่อใช้ในทางร้าย จึงตรงกับหัวเรื่อง viii" }
    },
    29: {
        questionPhrase: { en: "A course title with two meanings", th: "ชื่อวิชาที่มีสองความหมาย" },
        passagePhrase: { en: "'principles of marketing' in an unprincipled way", th: "ใช้ 'หลักการตลาด' แบบไร้หลักจริยธรรม" },
        pairs: [
          { q: "two meanings", p: "without being principled", th: "สองความหมาย: 'มีกฎ' กับ 'มีจริยธรรม'", note: "ย่อหน้า C เล่นกับคำว่า principles (มีกฎ) กับ principled (มีจริยธรรม) คือคำเดียวกันที่มีสองความหมาย จึงตรงกับ ii" },
          { q: "course title", p: "'Principles of Marketing'", th: "ชื่อวิชา" },
          { q: "two meanings", p: "principles in the sense of being codified", th: "ความหมายหนึ่ง: มีกฎเกณฑ์ถูกบัญญัติไว้" },
        ],
        keyVocab: { word: "principled", th: "มีหลักจริยธรรม / มีหลักการ", contrastA: "principles . กฎเกณฑ์ที่ถูกบัญญัติไว้", contrastB: "principled . มีจริยธรรม", note: "ย่อหน้า C เล่นกับคำว่า 'principles' (มีกฎ) กับ 'principled' (มีจริยธรรม) คือชื่อ/คำที่มีสองความหมาย จึงตรงกับหัวเรื่อง ii" }
    },
    30: {
        questionPhrase: { en: "Applying a theory in an unexpected context", th: "นำทฤษฎีมาใช้ในบริบทที่ไม่คาดคิด" },
        passagePhrase: { en: "the philosopher Immanuel Kant, who argued that any body of knowledge consists of an end and a means", th: "นักปรัชญาคานท์ที่ว่าความรู้ทุกแขนงประกอบด้วยจุดมุ่งหมายและวิธีการ" },
        pairs: [
          { q: "a theory", p: "the philosopher Immanuel Kant, who argued", th: "ทฤษฎี (แนวคิดของคานท์)", note: "ผู้เขียนนำทฤษฎีปรัชญาของคานท์มาใช้กับเรื่องการตลาด (บริบทที่ไม่คาดคิด) จึงตรงกับ iv" },
          { q: "Applying", p: "apply both the terms 'means' and 'end' to marketing", th: "นำมาประยุกต์ใช้" },
          { q: "an unexpected context", p: "may sound downright crazy", th: "บริบทที่คาดไม่ถึง" },
        ],
        keyVocab: { word: "theory (Kant's idea)", th: "ทฤษฎี (แนวคิดของคานท์)", note: "ผู้เขียนเอาทฤษฎีปรัชญาของคานท์มาใช้กับเรื่องการตลาด (บริบทที่ไม่คาดคิด) จึงตรงกับหัวเรื่อง iv" }
    },
    31: {
        questionPhrase: { en: "The equal importance of two key issues", th: "ความสำคัญเท่าเทียมกันของสองประเด็นหลัก" },
        passagePhrase: { en: "defined by both the means and the end; hence both deserve scrutiny", th: "นิยามด้วยทั้งวิธีการและจุดมุ่งหมาย ทั้งสองจึงต้องถูกพิจารณา" },
        pairs: [
          { q: "two key issues", p: "both the means and the end", th: "สองประเด็นหลัก คือวิธีการและจุดมุ่งหมาย", note: "'two key issues' = means กับ end ที่สำคัญเท่ากัน ('both deserve scrutiny') จึงตรงกับหัวเรื่อง iii" },
          { q: "equal importance", p: "both deserve scrutiny", th: "สำคัญเท่ากัน ทั้งคู่ต้องถูกพิจารณา" },
          { q: "importance", p: "defined by both the means and the end", th: "ความสำคัญ/นิยามด้วยทั้งสองสิ่ง" },
        ],
        keyVocab: { word: "both deserve scrutiny", th: "ทั้งสองสมควรได้รับการพิจารณา", note: "'two key issues' = means กับ end ที่สำคัญเท่ากัน ('both') จึงตรงกับหัวเรื่อง iii" }
    },
    32: {
        questionPhrase: { en: "Different names for different outcomes", th: "ชื่อเรียกต่างกันสำหรับผลลัพธ์ที่ต่างกัน" },
        passagePhrase: { en: "one is practicing medicine, the other, murder", th: "คนหนึ่งเรียกว่าการแพทย์ อีกคนเรียกว่าการฆาตกรรม" },
        pairs: [
          { q: "Different names", p: "one is practicing medicine, the other, murder", th: "ชื่อเรียกที่ต่างกัน เช่น การแพทย์/การฆาตกรรม", note: "ความรู้เดียวกันแต่จุดมุ่งหมายต่างกันได้ชื่อต่างกัน (firefighting/arson, marketing/fraud, medicine/murder) จึงตรงกับ vii" },
          { q: "different outcomes", p: "to achieve their divergent ends", th: "ผลลัพธ์/จุดมุ่งหมายที่ต่างกัน" },
          { q: "Different names", p: "We have another term for it: fraud", th: "มีคำเรียกอีกคำ คือต่างชื่อกัน" },
        ],
        keyVocab: { word: "different names", th: "ชื่อเรียกที่ต่างกัน", contrastA: "medicine . การแพทย์", contrastB: "murder . การฆาตกรรม", note: "ความรู้เดียวกันแต่จุดมุ่งหมายต่างกันได้ชื่อต่างกัน (firefighting/arson, marketing/fraud, medicine/murder) จึงตรงกับหัวเรื่อง vii" }
    },
    33: {
        questionPhrase: { en: "undergraduates who are studying", th: "นักศึกษาปริญญาตรีที่กำลังเรียนวิชา..." },
        passagePhrase: { en: "sign up for the course in our program in 'fire science'", th: "ลงเรียนวิชาในหลักสูตร 'วิทยาศาสตร์ดับเพลิง'" },
        pairs: [
          { q: "undergraduates", p: "undergraduates", th: "นักศึกษาปริญญาตรี" },
          { q: "studying", p: "sign up for the course in our program", th: "กำลังเรียน/ลงเรียน", note: "ช่องว่างถามว่านักศึกษาเรียนสาขาอะไร คำตอบคือ 'fire science' ตามที่ระบุในย่อหน้า A" },
          { q: "course", p: "'fire science'", th: "วิชา/สาขาวิทยาศาสตร์ดับเพลิง" },
        ],
        keyVocab: { word: "fire science", th: "วิทยาศาสตร์ดับเพลิง", note: "ช่องว่างถามว่านักศึกษาเรียนสาขาอะไร คำตอบคือ 'fire science' ตามที่ระบุในย่อหน้า A" }
    },
    34: {
        questionPhrase: { en: "they will become … specialising in arson", th: "พวกเขาจะกลายเป็น...ที่เชี่ยวชาญด้านการวางเพลิง" },
        passagePhrase: { en: "the course is intended for prospective arson investigators", th: "วิชานี้มุ่งสำหรับว่าที่นักสืบสวนการวางเพลิง" },
        pairs: [
          { q: "they will become", p: "prospective", th: "ว่าที่/ผู้ที่จะกลายเป็น", note: "'prospective arson investigators' ในข้อความตรงกับช่องว่าง คำตอบจึงเป็น investigators" },
          { q: "specialising in arson", p: "arson investigators", th: "เชี่ยวชาญด้านการวางเพลิง" },
        ],
        keyVocab: { word: "investigators", th: "นักสืบสวน/ผู้สอบสวน", note: "'prospective arson investigators' ในข้อความตรงกับช่องว่าง คำตอบจึงเป็น investigators" }
    },
    35: {
        questionPhrase: { en: "find … of criminal intent", th: "หา...ของเจตนาก่ออาชญากรรม" },
        passagePhrase: { en: "establishing a chain of evidence", th: "สร้างห่วงโซ่หลักฐาน" },
        pairs: [
          { q: "find", p: "establishing", th: "หา/สร้างขึ้นมา", note: "'find … of criminal intent' พาราเฟรสจาก 'establishing a chain of evidence' คำตอบจึงเป็น evidence" },
          { q: "of criminal intent", p: "a chain of evidence", th: "หลักฐาน (ของเจตนาก่ออาชญากรรม)" },
        ],
        keyVocab: { word: "evidence", th: "หลักฐาน", note: "'find … of criminal intent' พาราเฟรสจาก 'chain of evidence' ในข้อความ คำตอบจึงเป็น evidence" }
    },
    36: {
        questionPhrase: { en: "leading to successful … in the courts", th: "นำไปสู่...ที่สำเร็จในชั้นศาล" },
        passagePhrase: { en: "effective prosecution in a court of law", th: "การฟ้องดำเนินคดีที่ได้ผลในศาล" },
        pairs: [
          { q: "successful", p: "effective", th: "ที่ได้ผล/สำเร็จ", note: "'successful … in the courts' = 'effective prosecution in a court of law' คำตอบจึงเป็น prosecution" },
          { q: "in the courts", p: "in a court of law", th: "ในชั้นศาล" },
          { q: "successful … in the courts", p: "prosecution", th: "การฟ้องดำเนินคดี" },
        ],
        keyVocab: { word: "prosecution", th: "การฟ้องดำเนินคดี", note: "'successful … in the courts' = 'effective prosecution in a court of law' คำตอบจึงเป็น prosecution" }
    },
    37: {
        questionPhrase: { en: "hard to attract students to non-career courses", th: "ยากที่จะดึงนักเรียนเข้าวิชาที่ไม่เน้นอาชีพ" },
        passagePhrase: { en: "can prepare for a career in resort management, engineering, accounting", th: "เตรียมตัวสู่อาชีพ เช่น การจัดการรีสอร์ต วิศวกรรม การบัญชี" },
        pairs: [
          { q: "courses that do not focus on a career", p: "prepare for a career in resort management, engineering", th: "วิชาที่ (ไม่) เน้นอาชีพ", note: "ข้อความพูดถึงเฉพาะวิชาที่เน้นอาชีพ แต่ไม่เคยบอกว่าวิชาที่ไม่เน้นอาชีพดึงนักเรียนยาก จึงเป็น NOT GIVEN" },
          { q: "students", p: "Any undergraduates", th: "นักเรียน/นักศึกษา" },
        ],
        keyVocab: { word: "difficult to attract (not mentioned)", th: "ยากที่จะดึงดูด (ไม่ถูกกล่าวถึง)", note: "ข้อความพูดถึงเฉพาะวิชาที่เน้นอาชีพ แต่ไม่เคยบอกว่าวิชาที่ไม่เน้นอาชีพดึงนักเรียนยาก จึงเป็น NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "useful for people intending to set fire to buildings", th: "มีประโยชน์ต่อคนที่ตั้งใจจะวางเพลิงอาคาร" },
        passagePhrase: { en: "use the very same knowledge of means to achieve a much less noble end", th: "ใช้ความรู้ด้านวิธีการเดียวกันเพื่อจุดมุ่งหมายที่ไม่ดี" },
        pairs: [
          { q: "people intending to set fire to buildings", p: "a firefighter to torch a building", th: "คนที่ตั้งใจจะวางเพลิงอาคาร", note: "ผู้เขียนยอมรับว่าความรู้ชุดเดียวกันใช้ก่อเหตุวางเพลิงได้ จึงตรงกับคำกล่าว ตอบ YES" },
          { q: "useful", p: "use the very same knowledge of means", th: "มีประโยชน์/ใช้ความรู้นั้นได้" },
          { q: "The 'Arson for Profit' course", p: "the perfect course for prospective arsonists", th: "วิชา 'วางเพลิงเพื่อกำไร'" },
        ],
        keyVocab: { word: "the very same knowledge", th: "ความรู้ชุดเดียวกันนั้นเอง", contrastA: "firefighter . นักดับเพลิง", contrastB: "arsonist . คนวางเพลิง", note: "ผู้เขียนยอมรับว่าความรู้เดียวกันใช้ก่อเหตุวางเพลิง (set fire) ได้ จึงตรงกับคำกล่าว ตอบ YES" }
    },
    39: {
        questionPhrase: { en: "too academic to help people firefight well", th: "เป็นวิชาการเกินไปจนช่วยให้ดับเพลิงเก่งไม่ได้" },
        passagePhrase: { en: "highly welcome as part of the increasing professionalization", th: "เป็นที่ต้อนรับอย่างยิ่งในฐานะการยกระดับวิชาชีพ" },
        pairs: [
          { q: "Fire science courses", p: "academic programs in fire science", th: "วิชา/หลักสูตรวิทยาศาสตร์ดับเพลิง" },
          { q: "too academic to help", p: "highly welcome as part of the increasing professionalization", th: "ไม่ได้เป็นวิชาการเกินไป แต่ช่วยยกระดับวิชาชีพ", note: "ผู้เขียนชื่นชมว่าวิชาช่วยพัฒนาวิชาชีพ ไม่ได้บอกว่าวิชาการเกินไป ขัดกับคำกล่าว จึงตอบ NO" },
        ],
        keyVocab: { word: "professionalization", th: "การยกระดับสู่ความเป็นมืออาชีพ", note: "ผู้เขียนชื่นชมว่าวิชาช่วยพัฒนาวิชาชีพ ไม่ได้บอกว่าวิชาการเกินไป ขัดกับคำกล่าว ตอบ NO" }
    },
    40: {
        questionPhrase: { en: "provided a detailed definition of their purpose", th: "ให้คำนิยามจุดมุ่งหมายอย่างละเอียด" },
        passagePhrase: { en: "they eventually generalize to something like, 'The safety and welfare of society'", th: "สุดท้ายก็สรุปกว้าง ๆ ว่า 'ความปลอดภัยและสวัสดิภาพของสังคม'" },
        pairs: [
          { q: "Fire science students", p: "fire science students", th: "นักศึกษาวิทยาศาสตร์ดับเพลิง" },
          { q: "definition of the purpose", p: "articulate the end, or purpose, of their field", th: "นิยามจุดมุ่งหมาย" },
          { q: "a detailed definition", p: "generalize to something like", th: "สรุปกว้าง ๆ ไม่ใช่ละเอียด", note: "นักศึกษาตอบแบบกว้าง ๆ (generalize) ตรงข้ามกับ 'detailed' ในคำกล่าว จึงตอบ NO" },
        ],
        keyVocab: { word: "generalize", th: "สรุปแบบกว้าง ๆ", contrastA: "generalize . พูดรวม ๆ คลุมเครือ", contrastB: "detailed . ละเอียด", note: "นักศึกษาตอบแบบกว้าง ๆ (generalize) ตรงข้ามกับคำว่า 'detailed' ในคำกล่าว จึงตอบ NO" }
    },
  },
  "Cambridge 12 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "observing the … of bilingual people", th: "การสังเกต … ของคนสองภาษา" },
        passagePhrase: { en: "evidence comes from studying eye movements", th: "หลักฐานมาจากการศึกษาการเคลื่อนไหวของดวงตา" },
        pairs: [
          { q: "Observing", p: "studying", th: "การสังเกต / การศึกษา", note: "'Observing' ในคำถามตรงกับ 'studying' ในบทความ สิ่งที่ถูกศึกษาคือ eye movements จึงเป็นคำตอบข้อ 27" },
          { q: "Russian-English bilingual people", p: "Russian-English bilingual", th: "คนสองภาษารัสเซีย-อังกฤษ" },
          { q: "select certain objects", p: "pick up a marker", th: "หยิบ/เลือกวัตถุ" },
        ],
        keyVocab: { word: "eye movements", th: "การเคลื่อนไหวของดวงตา", note: "คำถามใช้ 'observing' ซึ่งหมายถึง 'studying' ในบทความ สิ่งที่ถูกศึกษา/สังเกตคือ eye movements จึงเป็นคำตอบ" }
    },
    28: {
        questionPhrase: { en: "mechanism known as …", th: "กลไกที่เรียกว่า …" },
        passagePhrase: { en: "this phenomenon, called 'language co-activation'", th: "ปรากฏการณ์นี้ ที่เรียกว่า 'การกระตุ้นภาษาพร้อมกัน'" },
        pairs: [
          { q: "mechanism known as", p: "phenomenon, called", th: "กลไก/ปรากฏการณ์ที่เรียกว่า", note: "'known as' ในคำถามตรงกับ 'called' ในบทความ ชื่อที่ตามมาคือ language co-activation จึงเป็นคำตอบข้อ 28" },
          { q: "language co-activation", p: "language co-activation", th: "การกระตุ้นสองภาษาพร้อมกัน" },
        ],
        keyVocab: { word: "language co-activation", th: "การกระตุ้นสองภาษาพร้อมกัน", note: "'known as' ในคำถามตรงกับ 'called' ในบทความ ชื่อกลไกที่ตามมาคือ language co-activation จึงเป็นคำตอบ" }
    },
    29: {
        questionPhrase: { en: "a test called the …, focusing on naming colours", th: "การทดสอบที่เรียกว่า … เน้นการบอกชื่อสี" },
        passagePhrase: { en: "the classic Stroop Task … name the colour of the word's font", th: "Stroop Task ที่ให้บอกสีของตัวอักษร" },
        pairs: [
          { q: "A test called the", p: "the classic Stroop Task", th: "การทดสอบที่เรียกว่า", note: "'naming colours' ตรงกับ 'name the colour of the word's font' ชื่อการทดสอบคือ Stroop Task จึงเป็นคำตอบข้อ 29" },
          { q: "naming colours", p: "name the colour", th: "การบอกชื่อสี" },
        ],
        keyVocab: { word: "Stroop Task", th: "การทดสอบสตรูป", note: "'naming colours' ในคำถามตรงกับ 'name the colour of the word's font' ชื่อการทดสอบคือ Stroop Task จึงเป็นคำตอบ" }
    },
    30: {
        questionPhrase: { en: "more able to handle …", th: "สามารถจัดการกับ … ได้ดีกว่า" },
        passagePhrase: { en: "perform better on tasks that require conflict management", th: "ทำได้ดีกว่าในงานที่ต้องจัดการความขัดแย้ง" },
        pairs: [
          { q: "more able to handle", p: "perform better on tasks that require", th: "สามารถจัดการได้ดีกว่า", note: "'handle' ตรงกับ 'require/manage' ในบทความ สิ่งที่จัดการคือ conflict management จึงเป็นคำตอบข้อ 30" },
          { q: "conflict management", p: "conflict management", th: "การจัดการความขัดแย้ง" },
        ],
        keyVocab: { word: "conflict management", th: "การจัดการความขัดแย้ง", note: "'handle' ในคำถามคือคำพ้องของ 'manage' สิ่งที่จัดการคือ conflict จึงได้คำตอบ conflict management" }
    },
    31: {
        questionPhrase: { en: "have superior …", th: "มี … ที่เหนือกว่า" },
        passagePhrase: { en: "reflecting better cognitive control", th: "สะท้อนการควบคุมทางปัญญาที่ดีกว่า" },
        pairs: [
          { q: "superior", p: "better", th: "เหนือกว่า / ดีกว่า", note: "'superior' ในคำถามตรงกับ 'better' ในบทความ สิ่งที่ดีกว่าคือ cognitive control จึงเป็นคำตอบข้อ 31" },
          { q: "cognitive control", p: "cognitive control", th: "การควบคุมทางปัญญา" },
        ],
        keyVocab: { word: "cognitive control", th: "การควบคุมทางปัญญา", note: "'superior' ในคำถามตรงกับ 'better' ในบทความ สิ่งที่ดีกว่าคือ cognitive control จึงเป็นคำตอบ" }
    },
    32: {
        questionPhrase: { en: "attitudes towards bilingualism have changed", th: "ทัศนคติต่อการพูดสองภาษาเปลี่ยนไป" },
        passagePhrase: { en: "in the past, such children were considered to be at a disadvantage", th: "ในอดีต เด็กเหล่านี้ถูกมองว่าเสียเปรียบ" },
        pairs: [
          { q: "Attitudes towards bilingualism have changed", p: "In the past, such children were considered to be at a disadvantage", th: "ทัศนคติเปลี่ยนไป (อดีตมองว่าเสียเปรียบ)", note: "อดีตมองว่า 'disadvantage' แต่ปัจจุบันพบ 'benefits' ความต่างนี้แสดงว่าทัศนคติเปลี่ยนจริง คำตอบจึงเป็น YES" },
          { q: "in recent years", p: "Over the past few decades", th: "ในช่วงไม่กี่ปี/ทศวรรษที่ผ่านมา" },
          { q: "changed", p: "benefits of being bilingual", th: "เปลี่ยนเป็นมองว่ามีประโยชน์" },
        ],
        keyVocab: { word: "in the past … considered a disadvantage", th: "ในอดีตถูกมองว่าเสียเปรียบ", note: "บทความบอกอดีตมองว่าเสียเปรียบ แต่ปัจจุบันพบประโยชน์ ('benefits') ความต่างนี้แสดงว่าทัศนคติเปลี่ยนจริง คำตอบจึงเป็น YES" }
    },
    33: {
        questionPhrase: { en: "bilinguals better at guessing words before finished", th: "คนสองภาษาเดาคำก่อนจบได้เก่งกว่า" },
        passagePhrase: { en: "the brain's language system begins to guess what that word might be", th: "ระบบภาษาในสมองเริ่มเดาว่าคำนั้นคืออะไร" },
        pairs: [
          { q: "guessing words before they are finished", p: "Long before the word is finished, the brain’s language system begins to guess", th: "เดาคำก่อนที่คำจะจบ", note: "บทความบอกว่าสมองทุกคนเดาคำ แต่ไม่เคยบอกว่าคนสองภาษาเดา 'เก่งกว่า' ไม่มีข้อมูลเปรียบเทียบ คำตอบจึงเป็น NOT GIVEN" },
          { q: "Bilingual people are better at", p: "the brain’s language system", th: "ความสามารถของคนสองภาษา (ไม่มีการเปรียบเทียบ)" },
        ],
        keyVocab: { word: "no comparison of guessing skill", th: "ไม่มีการเปรียบเทียบความสามารถในการเดา", note: "บทความพูดถึงการเดาคำในสมองทุกคน แต่ไม่เคยบอกว่าคนสองภาษาเดา 'เก่งกว่า' คนภาษาเดียว ไม่มีข้อมูลเปรียบเทียบ คำตอบจึงเป็น NOT GIVEN" }
    },
    34: {
        questionPhrase: { en: "bilinguals consistently name images faster", th: "คนสองภาษาบอกชื่อภาพได้เร็วกว่าเสมอ" },
        passagePhrase: { en: "can cause speakers to name pictures more slowly", th: "อาจทำให้บอกชื่อภาพได้ช้าลง" },
        pairs: [
          { q: "name images faster", p: "name pictures more slowly", th: "บอกชื่อภาพ (เร็วกว่า vs ช้าลง)", note: "คำถามอ้างว่า 'faster' แต่บทความบอก 'more slowly' ตรงข้ามกัน คำตอบจึงเป็น NO" },
          { q: "images", p: "pictures", th: "ภาพ" },
        ],
        keyVocab: { word: "more slowly", th: "ช้าลง", contrastA: "faster . reo-kwa", contrastB: "more slowly . cha-long", note: "คำถามอ้างว่า 'faster' แต่บทความบอกว่า 'more slowly' ตรงข้ามกัน คำตอบจึงเป็น NO" }
    },
    35: {
        questionPhrase: { en: "process single sounds more efficiently in all situations", th: "ประมวลเสียงเดี่ยวได้ดีกว่าในทุกสถานการณ์" },
        passagePhrase: { en: "in the presence of background noise … neural response is considerably larger", th: "เมื่อมีเสียงรบกวน การตอบสนองของสมองจะมากกว่าอย่างชัดเจน" },
        pairs: [
          { q: "process single sounds more efficiently", p: "the bilingual listeners’ neural response is considerably larger", th: "ประมวลเสียงได้ดีกว่า", note: "ข้อได้เปรียบเกิด 'เฉพาะ' ตอนมีเสียงรบกวน ไม่ใช่ 'ทุกสถานการณ์' ตอนเงียบสมองสองกลุ่มตอบสนองเหมือนกัน คำตอบจึงเป็น NO" },
          { q: "in all situations", p: "in the presence of background noise", th: "ในทุกสถานการณ์ vs เฉพาะตอนมีเสียงรบกวน" },
        ],
        keyVocab: { word: "in the presence of background noise", th: "เมื่อมีเสียงรบกวนเป็นพื้นหลัง", contrastA: "in all situations . nai-thuk-sathanakan", contrastB: "only with background noise . chapho-meua-mee-siang-robkuan", note: "ข้อได้เปรียบเกิด 'เฉพาะ' ตอนมีเสียงรบกวน ไม่ใช่ 'ทุกสถานการณ์' (ตอนเงียบสมองสองกลุ่มตอบสนองเหมือนกัน) คำตอบจึงเป็น NO" }
    },
    36: {
        questionPhrase: { en: "fewer bilinguals suffer brain disease in old age", th: "คนสองภาษาป่วยเป็นโรคสมองในวัยชราน้อยกว่า" },
        passagePhrase: { en: "bilingual patients reported showing initial symptoms … five years later", th: "ผู้ป่วยสองภาษาแสดงอาการเริ่มต้นช้ากว่าราว 5 ปี" },
        pairs: [
          { q: "suffer from brain disease in old age", p: "patients with Alzheimer’s disease, a degenerative brain disease", th: "ป่วยเป็นโรคสมองในวัยชรา", note: "บทความบอกอาการ 'มาช้ากว่า' (five years later) แต่ไม่เคยบอกว่า 'จำนวน' คนป่วยน้อยกว่า ไม่มีข้อมูลเรื่องจำนวน คำตอบจึงเป็น NOT GIVEN" },
          { q: "Fewer bilingual people", p: "initial symptoms of the disease an average of five years later", th: "อาการมาช้ากว่า (ไม่ใช่จำนวนน้อยกว่า)" },
        ],
        keyVocab: { word: "symptoms later, not fewer cases", th: "อาการมาช้ากว่า ไม่ใช่จำนวนผู้ป่วยน้อยกว่า", note: "บทความบอกอาการ 'มาช้ากว่า' แต่ไม่เคยบอกว่า 'จำนวน' คนป่วยน้อยกว่า ไม่มีข้อมูลเรื่องจำนวน คำตอบจึงเป็น NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "brains responding differently to non-verbal auditory input", th: "สมองตอบสนองต่างกันต่อเสียงที่ไม่ใช่คำพูด" },
        passagePhrase: { en: "listen to simple speech sounds … the same sound … neural response considerably larger", th: "ฟังเสียง และการตอบสนองของสมองต่างกันเมื่อมีเสียงรบกวน" },
        pairs: [
          { q: "brains responding differently", p: "the bilingual listeners’ neural response is considerably larger", th: "สมองตอบสนองต่างกัน", note: "ย่อหน้า D พูดถึงสมองตอบสนองต่างกันต่อเสียง (sound) เมื่อมีเสียงรบกวน ตรงกับคำถาม คำตอบจึงเป็น D" },
          { q: "non-verbal auditory input", p: "simple speech sounds", th: "เสียงที่ป้อนเข้าหู (ไม่ใช่คำพูดที่มีความหมาย)" },
        ],
        keyVocab: { word: "brain stem responses to sound", th: "การตอบสนองของก้านสมองต่อเสียง", note: "ย่อหน้า D พูดถึงสมองตอบสนองต่างกันต่อ 'sound' (auditory input) เมื่อมีเสียงรบกวน ตรงกับคำถาม คำตอบจึงเป็น D" }
    },
    38: {
        questionPhrase: { en: "bilingual upbringing benefits before we learn to speak", th: "การเลี้ยงดูสองภาษาให้ประโยชน์ก่อนเราพูดได้" },
        passagePhrase: { en: "seven-month-old babies … only the bilingual babies learned the new rule", th: "ทารกเจ็ดเดือน เฉพาะทารกสองภาษาเรียนกฎใหม่ได้" },
        pairs: [
          { q: "bilingual upbringing", p: "babies growing up in monolingual or bilingual homes", th: "การเลี้ยงดูแบบสองภาษา", note: "'before we learn to speak' หมายถึงวัยทารก ย่อหน้า G พูดถึงทารกเจ็ดเดือนที่ยังพูดไม่ได้ได้ประโยชน์แล้ว คำตอบจึงเป็น G" },
          { q: "before we learn to speak", p: "seven-month-old babies", th: "ก่อนเราพูดได้ (วัยทารก)" },
          { q: "has benefits", p: "imparts advantages", th: "มีประโยชน์/ข้อได้เปรียบ" },
        ],
        keyVocab: { word: "seven-month-old babies", th: "ทารกอายุเจ็ดเดือน", note: "'before we learn to speak' หมายถึงวัยทารก ย่อหน้า G พูดถึงทารกเจ็ดเดือนที่ยังพูดไม่ได้ ได้ประโยชน์แล้ว คำตอบจึงเป็น G" }
    },
    39: {
        questionPhrase: { en: "process by which people identify words they hear", th: "กระบวนการที่คนระบุคำที่ได้ยิน" },
        passagePhrase: { en: "the sounds arrive in sequential order … brain begins to guess what that word might be", th: "เสียงมาทีละลำดับ สมองเริ่มเดาว่าคำนั้นคืออะไร" },
        pairs: [
          { q: "identify words that they hear", p: "the brain’s language system begins to guess what that word might be", th: "ระบุ/จดจำคำที่ได้ยิน", note: "'identify words they hear' ตรงกับการอธิบายเรื่อง word recognition ในย่อหน้า B คำตอบจึงเป็น B" },
          { q: "process by which people identify words", p: "word recognition", th: "กระบวนการจดจำคำ" },
          { q: "words that they hear", p: "When we hear a word", th: "คำที่เราได้ยิน" },
        ],
        keyVocab: { word: "word recognition", th: "การจดจำ/ระบุคำ", note: "'identify words they hear' ตรงกับการอธิบายเรื่อง word recognition และ language co-activation ในย่อหน้า B คำตอบจึงเป็น B" }
    },
    40: {
        questionPhrase: { en: "negative consequences of being bilingual", th: "ผลเสียของการเป็นคนสองภาษา" },
        passagePhrase: { en: "this persistent linguistic competition can result in difficulties", th: "การแข่งขันทางภาษาที่ต่อเนื่องอาจก่อให้เกิดปัญหา" },
        pairs: [
          { q: "negative consequences", p: "can result in difficulties", th: "ผลเสีย / ก่อให้เกิดปัญหา", note: "'negative consequences' ตรงกับ 'difficulties' ในย่อหน้า C (พูดช้าลง, นึกคำไม่ออก) คำตอบจึงเป็น C" },
          { q: "of being bilingual", p: "knowing more than one language", th: "ของการเป็นคนสองภาษา" },
        ],
        keyVocab: { word: "difficulties", th: "ปัญหา/ความยากลำบาก", contrastA: "negative consequences . phon-sia", contrastB: "difficulties . panha", note: "'negative consequences' ในคำถามตรงกับ 'difficulties' ในย่อหน้า C (พูดช้าลง, นึกคำไม่ออก) คำตอบจึงเป็น C" }
    },
  },
  "Cambridge 12 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "music stimulated the neurons to release a substance", th: "ดนตรีกระตุ้นเซลล์ประสาทให้หลั่งสารชนิดหนึ่ง" },
        passagePhrase: { en: "music triggers the production of dopamine by the neurons", th: "ดนตรีกระตุ้นให้เซลล์ประสาทผลิตโดพามีน" },
        pairs: [
          { q: "stimulated the brain's neurons to release", p: "music triggers the production of", th: "กระตุ้นให้เซลล์ประสาทผลิต/หลั่งออกมา" },
          { q: "a substance called", p: "dopamine – a chemical", th: "สารชนิดหนึ่ง (สารเคมี)", note: "release a substance = triggers the production of สารที่ถูกผลิตคือ dopamine จึงเป็นคำตอบช่อง 27" },
          { q: "two of the parts of the brain", p: "both the dorsal and ventral regions of the brain", th: "สองส่วนของสมอง" },
        ],
        keyVocab: { word: "dopamine", th: "โดพามีน (สารเคมีในสมองที่ควบคุมอารมณ์)", note: "คำว่า release a substance = triggers the production of สารที่ถูกผลิตคือ dopamine จึงเป็นคำตอบช่อง 27" }
    },
    28: {
        questionPhrase: { en: "parts of the brain associated with feeling", th: "ส่วนของสมองที่เชื่อมโยงกับความรู้สึก" },
        passagePhrase: { en: "long been linked with the experience of pleasure", th: "เชื่อมโยงกับประสบการณ์ความสุขมานาน" },
        pairs: [
          { q: "associated with", p: "linked with", th: "เชื่อมโยง/เกี่ยวข้องกับ" },
          { q: "feeling", p: "the experience of pleasure", th: "ความรู้สึก (ความสุข)", note: "associated with = linked with ความรู้สึกที่สมองสองส่วนนี้เกี่ยวข้องคือ pleasure คำตอบช่อง 28" },
        ],
        keyVocab: { word: "pleasure", th: "ความสุข/ความเพลิดเพลิน", note: "associated with = linked with ดังนั้นความรู้สึกที่สมองสองส่วนนี้เกี่ยวข้องคือ pleasure คำตอบช่อง 28" }
    },
    29: {
        questionPhrase: { en: "the area of the brain called the …", th: "บริเวณของสมองที่เรียกว่า…" },
        passagePhrase: { en: "the dopamine neurons in the caudate", th: "เซลล์ประสาทโดพามีนในส่วนคอเดต" },
        pairs: [
          { q: "the area of the brain", p: "a region of the brain", th: "บริเวณ/ส่วนของสมอง" },
          { q: "particularly active just before the participants' favourite moments", p: "at their most active around 15 seconds before the participants’ favourite moments", th: "ทำงานมากเป็นพิเศษก่อนช่วงโปรด" },
          { q: "called the", p: "the caudate", th: "ที่เรียกว่า (คอเดต)", note: "the area of the brain = a region of the brain ชื่อบริเวณที่ active ก่อนช่วงโปรดคือ caudate คำตอบช่อง 29" },
        ],
        keyVocab: { word: "caudate", th: "คอเดต (ส่วนของสมอง)", note: "the area of the brain = a region of the brain ชื่อบริเวณที่ active ก่อนช่วงโปรดคือ caudate คำตอบช่อง 29" }
    },
    30: {
        questionPhrase: { en: "the period known as the …", th: "ช่วงเวลาที่รู้จักกันในชื่อ…" },
        passagePhrase: { en: "researchers call this the 'anticipatory phase'", th: "นักวิจัยเรียกช่วงนี้ว่า 'ระยะคาดการณ์'" },
        pairs: [
          { q: "the period known as the", p: "The researchers call this the ‘anticipatory phase’", th: "ช่วงเวลาที่เรียกว่า (ระยะคาดการณ์)", note: "known as = call this ชื่อที่ใช้เรียกช่วงก่อนถึงจุดโปรดคือ anticipatory phase คำตอบช่อง 30" },
          { q: "just before the participants' favourite moments", p: "predict the arrival of our favourite part", th: "ก่อนถึงช่วงโปรด (คาดการณ์ล่วงหน้า)" },
        ],
        keyVocab: { word: "anticipatory phase", th: "ระยะคาดการณ์ (ช่วงก่อนถึงจุดโปรด)", note: "known as = call this ชื่อที่ใช้เรียกช่วงก่อนถึงจุดโปรดคือ anticipatory phase คำตอบช่อง 30" }
    },
    31: {
        questionPhrase: { en: "expectation of 'reward' stimuli such as …", th: "การคาดหวังสิ่งเร้าแบบ 'รางวัล' เช่น…" },
        passagePhrase: { en: "anticipating food and other 'reward' stimuli", th: "การคาดหวังอาหารและสิ่งเร้ารางวัลอื่นๆ" },
        pairs: [
          { q: "expectation of", p: "anticipating", th: "การคาดหวัง/คาดการณ์" },
          { q: "'reward' stimuli such as", p: "food and other ‘reward’ stimuli", th: "สิ่งเร้ารางวัล เช่น (อาหาร)", note: "expectation = anticipating ตัวอย่างสิ่งเร้ารางวัลที่ระบุชัดคือ food คำตอบช่อง 31" },
        ],
        keyVocab: { word: "food", th: "อาหาร", note: "expectation = anticipating ตัวอย่างสิ่งเร้ารางวัลที่ระบุชัดคือ food คำตอบช่อง 31" }
    },
    32: {
        questionPhrase: { en: "how intense our physical responses to music can be", th: "การตอบสนองทางร่างกายต่อดนตรีรุนแรงเพียงใด" },
        passagePhrase: { en: "our body betrays all the symptoms of emotional arousal", th: "ร่างกายเราเผยอาการของการเร้าอารมณ์ทั้งหมด" },
        pairs: [
          { q: "intense", p: "all the symptoms of emotional arousal", th: "รุนแรง/เข้มข้น (อาการเร้าอารมณ์เต็มที่)", note: "อาการทางกายที่บรรยาย (pupils dilate, pulse rise) = intense physical responses จึงเลือกตอบ B" },
          { q: "physical responses to music", p: "our body betrays", th: "การตอบสนองทางร่างกายต่อดนตรี" },
        ],
        keyVocab: { word: "emotional arousal", th: "การถูกเร้าทางอารมณ์ (รูม่านตาขยาย ชีพจรเต้นแรง)", note: "อาการทางกายที่บรรยาย (pupils dilate, pulse rise) = intense physical responses จึงเลือกตอบ B" }
    },
    33: {
        questionPhrase: { en: "it produced some remarkably precise data", th: "มันให้ข้อมูลที่แม่นยำอย่างน่าทึ่ง" },
        passagePhrase: { en: "impressively exact and detailed portrait of music in the brain", th: "ภาพดนตรีในสมองที่แม่นยำและละเอียดอย่างน่าประทับใจ" },
        pairs: [
          { q: "remarkably precise", p: "impressively exact", th: "แม่นยำอย่างน่าทึ่ง", note: "remarkably precise = impressively exact and detailed ผู้เขียนชมว่าได้ข้อมูลแม่นยำ จึงตอบ C" },
          { q: "data", p: "detailed portrait of music in the brain", th: "ข้อมูล (ภาพรายละเอียด)" },
        ],
        keyVocab: { word: "exact and detailed", th: "แม่นยำและละเอียด", note: "remarkably precise = impressively exact and detailed ผู้เขียนชมว่าได้ข้อมูลแม่นยำ จึงตอบ C" }
    },
    34: {
        questionPhrase: { en: "the timing of participants' neural responses", th: "จังหวะเวลาของการตอบสนองของเซลล์ประสาท" },
        passagePhrase: { en: "most active around 15 seconds before the participants' favourite moments", th: "ทำงานสูงสุดราว 15 วินาทีก่อนช่วงโปรด" },
        pairs: [
          { q: "timing", p: "around 15 seconds before", th: "จังหวะเวลา (15 วินาทีก่อนหน้า)", note: "timing = '15 seconds before' สิ่งที่ผู้เขียนสนใจคือจังหวะเวลาของการตอบสนอง จึงตอบ A" },
          { q: "neural responses to the music", p: "dopamine neurons in the caudate", th: "การตอบสนองของเซลล์ประสาทต่อดนตรี" },
        ],
        keyVocab: { word: "15 seconds before", th: "15 วินาทีก่อนหน้า", note: "timing = ช่วงเวลา '15 seconds before' สิ่งที่ผู้เขียนสนใจคือจังหวะเวลาของการตอบสนอง จึงตอบ A" }
    },
    35: {
        questionPhrase: { en: "to offer support for the Montreal study findings", th: "เพื่อสนับสนุนผลการศึกษาของมอนทรีออล" },
        passagePhrase: { en: "this uncertainty triggers the surge of dopamine in the caudate", th: "ความไม่แน่นอนนี้กระตุ้นการพุ่งของโดพามีนในคอเดต" },
        pairs: [
          { q: "offer support for the findings", p: "It is this uncertainty that triggers the surge of dopamine in the caudate", th: "สนับสนุนผลการศึกษา (ความไม่แน่นอนกระตุ้นโดพามีน)", note: "ทฤษฎี Meyer (ความไม่แน่นอนกระตุ้นโดพามีนในคอเดต) ตรงกับผลมอนทรีออล จึงเป็นการสนับสนุน ตอบ B" },
          { q: "the Montreal study", p: "the surge of dopamine in the caudate", th: "ผลการศึกษามอนทรีออล" },
        ],
        keyVocab: { word: "support", th: "สนับสนุน/ยืนยัน", note: "ทฤษฎี Meyer (ความไม่แน่นอนกระตุ้นโดพามีนในคอเดต) ตรงกับผลมอนทรีออล จึงเป็นการสนับสนุน ตอบ B" }
    },
    36: {
        questionPhrase: { en: "the internal structure of the musical composition", th: "โครงสร้างภายในของบทเพลง" },
        passagePhrase: { en: "emotions in music come from the unfolding events of the music itself", th: "อารมณ์ในดนตรีมาจากการคลี่คลายของตัวดนตรีเอง" },
        pairs: [
          { q: "the internal structure of the musical composition", p: "the unfolding events of the music itself", th: "โครงสร้างภายในของตัวบทเพลงเอง", note: "Meyer บอกว่าอารมณ์มาจาก 'the music itself' = internal structure ไม่ใช่ภาพภายนอก จึงตอบ D" },
          { q: "the listener's emotional response", p: "the emotions we find in music", th: "การตอบสนองทางอารมณ์ของผู้ฟัง" },
        ],
        keyVocab: { word: "the music itself", th: "ตัวดนตรีเอง (ไม่ใช่ภาพภายนอก)", contrastA: "embodied meaning . ความหมายในตัวดนตรี", contrastB: "connotative meaning . ความหมายอ้างถึงโลกภายนอก", note: "Meyer บอกว่าอารมณ์มาจาก 'the music itself' = internal structure ไม่ใช่ภาพภายนอก จึงตอบ D" }
    },
    37: {
        questionPhrase: { en: "neuron activity increases prior to key points", th: "เซลล์ประสาททำงานมากขึ้นก่อนจุดสำคัญ" },
        passagePhrase: { en: "dopamine neurons most active around 15 seconds before favourite moments", th: "เซลล์ประสาทโดพามีนทำงานสูงสุดราว 15 วินาทีก่อนช่วงโปรด" },
        pairs: [
          { q: "neuron activity increases", p: "at their most active", th: "เซลล์ประสาททำงานมากขึ้น/สูงสุด" },
          { q: "prior to key points in a musical piece", p: "before the participants’ favourite moments in the music", th: "ก่อนถึงจุดสำคัญในบทเพลง", note: "prior to key points = before favourite moments เซลล์ active ก่อนจุดโปรด จึงจับคู่กับ F" },
        ],
        keyVocab: { word: "most active before", th: "ทำงานสูงสุดก่อนหน้า", note: "prior to key points = before favourite moments เซลล์ active ก่อนจุดโปรด จึงจับคู่กับ F" }
    },
    38: {
        questionPhrase: { en: "neuron activity decreases if outcomes become predictable", th: "เซลล์ประสาททำงานลดลงถ้าผลคาดเดาได้" },
        passagePhrase: { en: "dopamine neurons quickly adapt to predictable rewards", th: "เซลล์ประสาทโดพามีนปรับตัวต่อรางวัลที่คาดเดาได้อย่างรวดเร็ว" },
        pairs: [
          { q: "neuron activity decreases", p: "we don’t get excited", th: "เซลล์ประสาททำงานลดลง (ไม่ตื่นเต้น)" },
          { q: "if outcomes become predictable", p: "adapt to predictable rewards", th: "ถ้าผลลัพธ์คาดเดาได้", note: "adapt to predictable rewards = activity decreases when predictable ข้อความ 'we don’t get excited' ยืนยัน จึงจับคู่กับ B" },
        ],
        keyVocab: { word: "adapt to predictable", th: "ปรับตัวต่อสิ่งที่คาดเดาได้ (จึงตื่นเต้นน้อยลง)", note: "adapt to predictable rewards = activity decreases when predictable ข้อความถัดมา 'we don't get excited' ยืนยัน จึงจับคู่กับ B" }
    },
    39: {
        questionPhrase: { en: "emotive music delays giving listeners what they expect", th: "ดนตรีเร้าอารมณ์หน่วงการให้สิ่งที่ผู้ฟังคาดหวัง" },
        passagePhrase: { en: "carefully holds off repeating it", th: "จงใจชะลอการเล่นซ้ำรูปแบบนั้น" },
        pairs: [
          { q: "delays giving listeners what they expect to hear", p: "carefully holds off repeating it", th: "หน่วง/ชะลอการให้สิ่งที่ผู้ฟังคาดหวัง", note: "delays giving = holds off repeating Beethoven หน่วงคอร์ดที่คาดหวังไว้จนจบ จึงจับคู่กับ E" },
          { q: "what they expect to hear", p: "a rhythmic and harmonic pattern", th: "สิ่งที่ผู้ฟังคาดว่าจะได้ยิน (รูปแบบที่วางไว้)" },
        ],
        keyVocab: { word: "holds off", th: "ชะลอ/หน่วงเอาไว้", note: "delays giving = holds off repeating Beethoven หน่วงคอร์ดที่คาดหวังไว้จนจบ จึงจับคู่กับ E" }
    },
    40: {
        questionPhrase: { en: "emotive music can bring to mind actual pictures and events", th: "ดนตรีเร้าอารมณ์ทำให้นึกถึงภาพและเหตุการณ์จริง" },
        passagePhrase: { en: "a sound can refer to the real world of images and experiences", th: "เสียงสามารถอ้างถึงโลกจริงของภาพและประสบการณ์" },
        pairs: [
          { q: "bring to mind actual pictures and events", p: "refer to the real world of images and experiences", th: "ทำให้นึกถึงภาพและเหตุการณ์จริง", note: "bring to mind actual pictures = refer to the real world of images ทฤษฎีก่อนหน้ามองแบบนี้ จึงจับคู่กับ C" },
          { q: "Earlier theories of music", p: "earlier theories of music", th: "ทฤษฎีดนตรียุคก่อน" },
        ],
        keyVocab: { word: "refer to the real world", th: "อ้างถึงโลกความจริง (ความหมายแบบ connotative)", note: "bring to mind actual pictures = refer to the real world of images ทฤษฎีก่อนหน้ามองแบบนี้ จึงจับคู่กับ C" }
    },
  },
  "Cambridge 12 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "Many external bodies being held responsible for problems", th: "หน่วยงานภายนอกหลายแห่งถูกโยนความผิดให้รับผิดชอบ" },
        passagePhrase: { en: "blame has been spread far and wide; governments, regulators, central banks and auditors", th: "ความผิดถูกโยนไปทั่วทุกทิศ ทั้งรัฐบาล ผู้กำกับดูแล ธนาคารกลาง และผู้ตรวจสอบบัญชี" },
        pairs: [
          { q: "Many external bodies", p: "Governments, regulators, central banks and auditors", th: "หน่วยงานภายนอกหลายแห่ง (รัฐบาล ผู้กำกับดูแล ธนาคารกลาง ผู้ตรวจสอบบัญชี)" },
          { q: "held responsible for problems", p: "blame has been spread far and wide", th: "ถูกโยนความผิดให้รับผิดชอบ", note: "'blame spread far and wide' ตรงกับ 'held responsible' และรายชื่อหน่วยงานคือ 'many external bodies' จึงตอบหัวข้อ iv" },
        ],
        keyVocab: { word: "blame spread far and wide", th: "โยนความผิดกระจายไปทั่ว", note: "วลี 'blame spread far and wide' ในย่อหน้า A คือ 'held responsible' กับ 'many external bodies' ในหัวข้อ ทำให้คำตอบคือ iv" }
    },
    28: {
        questionPhrase: { en: "impact on companies of being subjected to close examination", th: "ผลกระทบต่อบริษัทจากการถูกตรวจสอบอย่างใกล้ชิด" },
        passagePhrase: { en: "knock-on effect of this scrutiny... increased the pressures on directors", th: "ผลกระทบต่อเนื่องจากการถูกจับตา ทำให้แรงกดดันต่อกรรมการเพิ่มขึ้น" },
        pairs: [
          { q: "close examination", p: "scrutiny", th: "การตรวจสอบ/จับตาอย่างใกล้ชิด", note: "'scrutiny' = 'close examination' และ 'knock-on effect' = 'impact' จึงตอบหัวข้อ ii" },
          { q: "impact on companies", p: "knock-on effect", th: "ผลกระทบต่อบริษัท" },
          { q: "being subjected to", p: "increased the pressures on", th: "ถูกกระทำ/ถูกเพิ่มแรงกดดัน" },
        ],
        keyVocab: { word: "scrutiny", th: "การตรวจสอบ/จับตาอย่างเข้มงวด", note: "'scrutiny' = 'close examination' และ 'knock-on effect' = 'impact' ทำให้หัวข้อที่ถูกคือ ii" }
    },
    29: {
        questionPhrase: { en: "not all directors take part in solving major problems", th: "ไม่ใช่กรรมการทุกคนที่มีส่วนร่วมแก้ปัญหาสำคัญ" },
        passagePhrase: { en: "the board as a whole is less involved in fully addressing some of the most important issues", th: "บอร์ดทั้งคณะมีส่วนร่วมน้อยลงในการจัดการประเด็นสำคัญที่สุด" },
        pairs: [
          { q: "not all directors take part", p: "the board as a whole is less involved", th: "ไม่ใช่กรรมการทุกคนมีส่วนร่วม", note: "'board as a whole is less involved' = 'not all directors take part' จึงตอบหัวข้อ vi" },
          { q: "solving", p: "addressing", th: "การแก้ไข/จัดการ" },
          { q: "major problems", p: "the most important issues", th: "ปัญหาสำคัญ" },
        ],
        keyVocab: { word: "board as a whole is less involved", th: "บอร์ดทั้งคณะมีส่วนร่วมน้อยลง", note: "'less involved in addressing important issues' = 'not all directors take part in solving major problems' ทำให้คำตอบคือ vi" }
    },
    30: {
        questionPhrase: { en: "A proposal to change the way the board operates", th: "ข้อเสนอให้เปลี่ยนวิธีการทำงานของบอร์ด" },
        passagePhrase: { en: "A radical solution... is the professional board, whose members would work up to three or four days a week", th: "ทางออกแบบสุดขั้วคือบอร์ดมืออาชีพที่ทำงานสัปดาห์ละสามถึงสี่วัน" },
        pairs: [
          { q: "A proposal", p: "A radical solution", th: "ข้อเสนอ/ทางออก", note: "'radical solution' คือ 'professional board' ซึ่งเป็น 'proposal to change the way the board operates' จึงตอบหัวข้อ viii" },
          { q: "change the way the board operates", p: "the professional board, whose members would work up to three or four days a week", th: "เปลี่ยนวิธีการทำงานของบอร์ด" },
        ],
        keyVocab: { word: "radical solution", th: "ทางออกแบบสุดขั้ว/ปฏิรูป", note: "'radical solution' (ตั้งบอร์ดมืออาชีพ) = 'a proposal to change the way the board operates' ทำให้คำตอบคือ viii" }
    },
    31: {
        questionPhrase: { en: "Boards not looking far enough ahead", th: "บอร์ดมองการณ์ไม่ไกลพอ" },
        passagePhrase: { en: "do not focus sufficiently on longer-term matters... concentrate too much on short-term financial metrics", th: "ไม่ให้ความสำคัญกับเรื่องระยะยาว แต่หมกมุ่นกับตัวเลขการเงินระยะสั้น" },
        pairs: [
          { q: "not looking far enough ahead", p: "do not focus sufficiently on longer-term matters", th: "มองการณ์ไม่ไกลพอ", note: "'do not focus on longer-term... concentrate on short-term' = 'not looking far enough ahead' จึงตอบหัวข้อ vii" },
          { q: "Boards", p: "boards and their directors", th: "คณะกรรมการบริษัท" },
        ],
        keyVocab: { word: "longer-term matters", th: "เรื่องในระยะยาว", contrastA: "longer-term . ระยะยาว", contrastB: "short-term . ระยะสั้น", note: "'not focus on longer-term... concentrate on short-term' = 'not looking far enough ahead' ทำให้คำตอบคือ vii" }
    },
    32: {
        questionPhrase: { en: "Disputes over financial arrangements regarding senior managers", th: "ข้อพิพาทเรื่องค่าตอบแทนของผู้บริหารระดับสูง" },
        passagePhrase: { en: "Compensation for chief executives has become a combat zone where pitched battles... are fought", th: "ค่าตอบแทนของซีอีโอกลายเป็นสมรภูมิที่มีการต่อสู้กันอย่างดุเดือด" },
        pairs: [
          { q: "Disputes", p: "pitched battles", th: "ข้อพิพาท/การต่อสู้กัน", note: "'compensation for chief executives' = 'financial arrangements regarding senior managers' และ 'pitched battles' = 'disputes' จึงตอบหัวข้อ i" },
          { q: "financial arrangements", p: "Compensation", th: "ค่าตอบแทน/ข้อตกลงทางการเงิน" },
          { q: "senior managers", p: "chief executives", th: "ผู้บริหารระดับสูง" },
        ],
        keyVocab: { word: "combat zone / pitched battles", th: "สมรภูมิ/การต่อสู้กันดุเดือด", note: "'compensation for chief executives' = 'financial arrangements regarding senior managers' และ 'pitched battles' = 'disputes' ทำให้คำตอบคือ i" }
    },
    33: {
        questionPhrase: { en: "possible need for fundamental change in every area", th: "ความจำเป็นที่อาจต้องเปลี่ยนแปลงพื้นฐานในทุกด้าน" },
        passagePhrase: { en: "Boards of companies in all sectors will need to widen their perspective... realignment of corporate goals", th: "บอร์ดในทุกภาคส่วนต้องขยายมุมมองและปรับเป้าหมายองค์กรใหม่" },
        pairs: [
          { q: "every area of business", p: "companies in all sectors", th: "ทุกด้าน/ทุกภาคส่วนของธุรกิจ", note: "'all sectors' = 'every area of business' และ 'realignment of corporate goals' = 'fundamental change' จึงตอบหัวข้อ iii" },
          { q: "fundamental change", p: "realignment of corporate goals", th: "การเปลี่ยนแปลงพื้นฐาน" },
        ],
        keyVocab: { word: "all sectors / realignment of corporate goals", th: "ทุกภาคส่วน / การปรับเป้าหมายองค์กรใหม่", note: "'all sectors' = 'every area of business' และ 'realignment of goals' = 'fundamental change' ทำให้คำตอบคือ iii" }
    },
    34: {
        questionPhrase: { en: "Close scrutiny of boards has increased since the downturn", th: "การจับตาบอร์ดอย่างใกล้ชิดเพิ่มขึ้นนับตั้งแต่ภาวะเศรษฐกิจตกต่ำ" },
        passagePhrase: { en: "knock-on effect of this scrutiny... significantly increased the pressures on directors", th: "ผลพวงจากการจับตาทำให้แรงกดดันต่อกรรมการเพิ่มขึ้นอย่างมาก" },
        pairs: [
          { q: "Close scrutiny", p: "scrutiny", th: "การจับตา/ตรวจสอบอย่างใกล้ชิด" },
          { q: "has increased", p: "significantly increased the pressures", th: "เพิ่มขึ้น", note: "ข้อความยืนยันว่าการจับตาเพิ่มขึ้นจริงหลังวิกฤต ตรงกับคำกล่าว จึงตอบ YES" },
          { q: "since the economic downturn", p: "Following the 2008 financial meltdown", th: "นับตั้งแต่ภาวะเศรษฐกิจตกต่ำ" },
        ],
        keyVocab: { word: "increased scrutiny", th: "การจับตาที่เพิ่มขึ้น", note: "ข้อความยืนยันว่าการจับตา (scrutiny) หลังวิกฤตปี 2008 เพิ่มขึ้นจริง ตรงกับคำกล่าว จึงตอบ YES" }
    },
    35: {
        questionPhrase: { en: "Banks mismanaged more than other businesses", th: "ธนาคารถูกบริหารผิดพลาดมากกว่าธุรกิจอื่น" },
        passagePhrase: { en: "role of bank directors... failures have been extensively picked over and examined", th: "ความล้มเหลวของกรรมการธนาคารถูกหยิบมาวิเคราะห์อย่างละเอียด" },
        pairs: [
          { q: "Banks have been mismanaged", p: "their widely publicised failures", th: "ธนาคารถูกบริหารผิดพลาด", note: "ข้อความพูดถึงความล้มเหลวของธนาคาร แต่ไม่ได้เปรียบเทียบว่าแย่กว่าธุรกิจอื่น จึงตอบ NOT GIVEN" },
          { q: "other businesses", p: "bank directors and management", th: "ธุรกิจอื่น (ไม่มีการเทียบ)" },
        ],
        keyVocab: { word: "no comparison given", th: "ไม่มีการเปรียบเทียบ", note: "ข้อความพูดถึงความล้มเหลวของธนาคารแต่ไม่ได้เทียบว่าแย่กว่าธุรกิจอื่นหรือไม่ จึงตอบ NOT GIVEN" }
    },
    36: {
        questionPhrase: { en: "Board meetings continue as long as necessary for full debate", th: "การประชุมบอร์ดดำเนินไปนานพอจนถกกันครบทุกประเด็น" },
        passagePhrase: { en: "time for constructive debate must necessarily be restricted in favour of getting through the business", th: "เวลาสำหรับถกอย่างสร้างสรรค์ถูกจำกัด เพื่อเร่งทำงานให้เสร็จ" },
        pairs: [
          { q: "as long as necessary to debate in full", p: "time for constructive debate must necessarily be restricted", th: "นานพอที่จะถกครบทุกประเด็น", note: "ข้อความบอกว่าเวลาถกเถียง 'ถูกจำกัด' ขัดกับคำกล่าวว่าประชุมนานพอ จึงตอบ NO" },
          { q: "Board meetings", p: "Agendas can become overloaded", th: "การประชุมบอร์ด" },
        ],
        keyVocab: { word: "debate must be restricted", th: "การถกเถียงถูกจำกัด", contrastA: "restricted . ถูกจำกัด", contrastB: "as long as necessary . นานเท่าที่จำเป็น", note: "ข้อความบอกว่าเวลาถกเถียง 'ถูกจำกัด' ซึ่งขัดกับคำกล่าวว่าประชุมนานพอ จึงตอบ NO" }
    },
    37: {
        questionPhrase: { en: "committee structure ensures board members fully informed", th: "โครงสร้างคณะกรรมการย่อยทำให้บอร์ดได้รับข้อมูลครบถ้วน" },
        passagePhrase: { en: "board as a whole is less involved in fully addressing some of the most important issues", th: "บอร์ดทั้งคณะมีส่วนร่วมน้อยลงในการจัดการประเด็นสำคัญที่สุด" },
        pairs: [
          { q: "committee structure", p: "board business is devolved to committees", th: "โครงสร้างคณะกรรมการย่อย" },
          { q: "fully informed", p: "the board as a whole is less involved", th: "ได้รับข้อมูล/มีส่วนร่วมเต็มที่", note: "การโยนงานให้คณะกรรมการย่อยทำให้บอร์ด 'มีส่วนร่วมน้อยลง' ตรงข้ามกับ 'fully informed' จึงตอบ NO" },
        ],
        keyVocab: { word: "less involved", th: "มีส่วนร่วมน้อยลง", contrastA: "less involved . มีส่วนร่วมน้อยลง", contrastB: "fully informed . ได้รับข้อมูลครบถ้วน", note: "การโยนงานให้คณะกรรมการย่อยทำให้บอร์ด 'มีส่วนร่วมน้อยลง' ซึ่งตรงข้ามกับ 'fully informed' จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "non-executive directors at a disadvantage from lack of …", th: "กรรมการที่ไม่ใช่ผู้บริหารเสียเปรียบเพราะขาด …" },
        passagePhrase: { en: "executives had access to information that part-time non-executive directors lacked", th: "ผู้บริหารเข้าถึงข้อมูลที่กรรมการไม่ใช่ผู้บริหารแบบพาร์ทไทม์ไม่มี" },
        pairs: [
          { q: "non-executive directors", p: "part-time non-executive directors", th: "กรรมการที่ไม่ใช่ผู้บริหาร" },
          { q: "at a disadvantage because of lack of", p: "lacked", th: "เสียเปรียบเพราะขาด" },
          { q: "information", p: "information", th: "ข้อมูล (คำตอบ)", note: "'executives had access to information that... directors lacked' ทำให้คำที่ขาดคือ 'information'" },
        ],
        keyVocab: { word: "information", th: "ข้อมูล (คำตอบ)", note: "'lacked' ในข้อความ = 'lack of' ในโจทย์ คำที่ขาดคือ 'information' จึงเป็นคำตอบช่องว่าง" }
    },
    39: {
        questionPhrase: { en: "too much emphasis on … short-term considerations", th: "ให้น้ำหนักมากเกินไปกับเรื่อง … ระยะสั้น" },
        passagePhrase: { en: "concentrate too much on short-term financial metrics", th: "หมกมุ่นกับตัวชี้วัดทางการเงินระยะสั้นมากเกินไป" },
        pairs: [
          { q: "too much emphasis", p: "concentrate too much", th: "ให้น้ำหนักมากเกินไป" },
          { q: "short-term relevance", p: "short-term financial metrics", th: "เรื่องระยะสั้น" },
          { q: "financial", p: "financial", th: "ทางการเงิน (คำตอบ)", note: "'concentrate too much on short-term financial' ทำให้คำที่เติมคือ 'financial'" },
        ],
        keyVocab: { word: "financial", th: "ทางการเงิน (คำตอบ)", note: "'concentrate too much on short-term financial' = 'too much emphasis on financial short-term' คำที่เติมคือ 'financial'" }
    },
    40: {
        questionPhrase: { en: "the board may have to accept the views of …", th: "บอร์ดอาจต้องยอมรับความเห็นของ …" },
        passagePhrase: { en: "shareholders use their muscle in the area of pay to pressure boards", th: "ผู้ถือหุ้นใช้อำนาจกดดันบอร์ดในเรื่องค่าตอบแทน" },
        pairs: [
          { q: "the board may have to accept the views of", p: "use their muscle in the area of pay to pressure boards", th: "บอร์ดอาจต้องยอมรับความเห็นของ", note: "'shareholders use their muscle to pressure boards' หมายความว่าบอร์ดต้องยอมรับความเห็นผู้ถือหุ้น คำตอบคือ 'shareholders'" },
          { q: "shareholders", p: "shareholders", th: "ผู้ถือหุ้น (คำตอบ)" },
        ],
        keyVocab: { word: "shareholders", th: "ผู้ถือหุ้น (คำตอบ)", note: "'shareholders use their muscle to pressure boards' = บอร์ดต้องยอมรับความเห็นของผู้ถือหุ้น คำตอบคือ 'shareholders'" }
    },
  },
  "Cambridge 13 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "A great deal of progress has been attained", th: "มีความก้าวหน้าเกิดขึ้นมากแล้วในวงการนี้" },
        passagePhrase: { en: "a growing number of computer programs which possess creative talents", th: "โปรแกรมคอมพิวเตอร์ที่มีพรสวรรค์เชิงสร้างสรรค์ซึ่งมีจำนวนเพิ่มขึ้นเรื่อย ๆ" },
        pairs: [
          { q: "A great deal of progress has already been attained", p: "a growing number of computer programs", th: "มีจำนวนเพิ่มขึ้นเรื่อย ๆ = วงการนี้ก้าวหน้าไปมาก", note: "'a growing number' บวกตัวอย่างความสำเร็จ สื่อว่ามีความก้าวหน้ามากแล้ว จึงตอบ B" },
          { q: "computer-produced works", p: "computer programs which possess creative talents", th: "ผลงานที่สร้างโดยคอมพิวเตอร์" },
          { q: "in this field", p: "sold for thousands of dollars and been hung in prestigious galleries", th: "ความสำเร็จในวงการ (ขายได้ ถูกแขวนในหอศิลป์ดัง)" },
        ],
        keyVocab: { word: "a growing number", th: "จำนวนที่เพิ่มมากขึ้นเรื่อย ๆ", note: "วลี 'a growing number' บวกกับตัวอย่างความสำเร็จ (ขายได้, ถูกแขวนในหอศิลป์) สื่อว่าวงการนี้ก้าวหน้าไปมากแล้ว จึงตอบ B" }
    },
    28: {
        questionPhrase: { en: "It undermines a fundamental human quality", th: "มันบั่นทอนคุณสมบัติพื้นฐานของความเป็นมนุษย์" },
        passagePhrase: { en: "where does that leave human creativity? a question at the core of humanity", th: "แล้วความคิดสร้างสรรค์ของมนุษย์จะอยู่ตรงไหน คำถามที่แก่นของความเป็นมนุษย์" },
        pairs: [
          { q: "a fundamental human quality", p: "a question at the very core of humanity", th: "คุณสมบัติที่แก่นแท้ของความเป็นมนุษย์", note: "'core of humanity' / taking something special away = คุณสมบัติพื้นฐานของมนุษย์ จึงตอบ C" },
          { q: "It undermines", p: "taking something special away", th: "บั่นทอน/พรากบางสิ่งที่พิเศษไป" },
          { q: "worried", p: "worried", th: "กังวล/วิตก" },
        ],
        keyVocab: { word: "core of humanity", th: "แก่นแท้ของความเป็นมนุษย์", note: "'core of humanity' / taking something special away = คุณสมบัติพื้นฐานของมนุษย์ถูกบั่นทอน ตรงกับ undermines a fundamental human quality จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "the source of its subject matter", th: "ที่มาของเนื้อหา/หัวข้อที่นำมาวาด" },
        passagePhrase: { en: "can come up with its own concepts by going online for material", th: "คิดแนวคิดของตัวเองได้โดยเข้าไปหาวัตถุดิบทางออนไลน์" },
        pairs: [
          { q: "the source of its subject matter", p: "going online for material", th: "ที่มาของเนื้อหา/หัวข้อที่นำมาวาด", note: "Painting Fool หาวัตถุดิบเองออนไลน์ ส่วน Aaron เป็นแค่เครื่องมือ ความต่างคือที่มาของเนื้อหา จึงตอบ C" },
          { q: "the Painting Fool", p: "come up with its own concepts", th: "คิดแนวคิดของตัวเองได้" },
          { q: "Aaron", p: "little more than a tool", th: "แอรอนเป็นเพียงเครื่องมือ" },
        ],
        keyVocab: { word: "going online for material", th: "เข้าไปหาวัตถุดิบทางออนไลน์", note: "'material / its own concepts' = source of subject matter ความต่างหลักคือ Painting Fool หาหัวข้อเองออนไลน์ ส่วน Aaron เป็นแค่เครื่องมือ จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "judge computer and human art by different criteria", th: "ตัดสินงานคอมพิวเตอร์กับงานมนุษย์ด้วยมาตรฐานคนละแบบ" },
        passagePhrase: { en: "people's double standards towards software-produced and human-produced art", th: "มาตรฐานสองชั้นของคนต่องานจากซอฟต์แวร์กับงานจากมนุษย์" },
        pairs: [
          { q: "according to different criteria", p: "double standards", th: "ตัดสินด้วยมาตรฐานคนละแบบ", note: "'double standards' = ใช้เกณฑ์ตัดสินคนละแบบ (different criteria) จึงตอบ D" },
          { q: "computer art and human art", p: "software-produced and human-produced art", th: "งานจากคอมพิวเตอร์กับงานจากมนุษย์" },
          { q: "People tend to judge", p: "people's double standards towards", th: "ผู้คนมักตัดสิน" },
        ],
        keyVocab: { word: "double standards", th: "มาตรฐานสองชั้น (ใช้สองมาตรฐาน)", note: "'double standards' = ใช้เกณฑ์ตัดสินคนละแบบ (different criteria) จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "achieves a particularly striking effect", th: "ให้ผลลัพธ์ที่สะดุดตา/น่าทึ่งเป็นพิเศษ" },
        passagePhrase: { en: "came out in black and white gives the work an eerie, ghostlike quality", th: "ออกมาเป็นขาวดำ ทำให้งานมีความน่าขนลุกเหมือนผี" },
        pairs: [
          { q: "achieves a particularly striking effect", p: "an eerie, ghostlike quality", th: "ให้ผลลัพธ์ที่สะดุดตา/น่าทึ่ง (น่าขนลุกราวกับผี)", note: "'eerie, ghostlike quality' คือผลทางอารมณ์ที่สะดุดตา = striking effect แม้เกิดจากบั๊ก จึงตอบ A" },
          { q: "the paintings of a chair", p: "paintings of a chair", th: "ภาพวาดเก้าอี้" },
          { q: "computer art", p: "came out in black and white", th: "ออกมาเป็นภาพขาวดำ" },
        ],
        keyVocab: { word: "eerie, ghostlike quality", th: "ลักษณะน่าขนลุกราวกับผี", note: "'eerie, ghostlike quality' คือผลทางอารมณ์ที่สะดุดตา = striking effect แม้เกิดจากบั๊ก จึงตอบ A ไม่ใช่ข้อจำกัดทางเทคนิค" }
    },
    32: {
        questionPhrase: { en: "consider the long-term view", th: "ควรมองภาพระยะยาว" },
        passagePhrase: { en: "humans who have had millennia to develop our skills", th: "มนุษย์ที่ใช้เวลานับพันปีในการพัฒนาทักษะ" },
        pairs: [
          { q: "consider the long-term view", p: "have had millennia to develop our skills", th: "มองภาพระยะยาว (มนุษย์ใช้เวลานับพันปี)", note: "'measure machine creativity to that of humans' = เปรียบเทียบ และ 'millennia' = มุมมองระยะยาว จึงตอบ D" },
          { q: "comparing the artistic achievements of humans and computers", p: "measure machine creativity directly to that of humans", th: "เปรียบเทียบความสำเร็จของมนุษย์กับคอมพิวเตอร์" },
        ],
        keyVocab: { word: "comparing achievements of humans and computers", th: "เปรียบเทียบความสำเร็จของมนุษย์กับคอมพิวเตอร์", note: "'measure machine creativity to that of humans' = comparing humans and computers และ 'millennia' = มุมมองระยะยาว จึงตอบ D" }
    },
    33: {
        questionPhrase: { en: "work virtually indistinguishable from that of humans", th: "งานที่แทบแยกไม่ออกจากงานของมนุษย์" },
        passagePhrase: { en: "fooled classical music experts into thinking they were hearing genuine Bach", th: "หลอกผู้เชี่ยวชาญดนตรีให้คิดว่ากำลังฟังบาคของจริง" },
        pairs: [
          { q: "virtually indistinguishable from that of humans", p: "fooled classical music experts into thinking they were hearing genuine Bach", th: "แทบแยกไม่ออกจากงานของมนุษย์", note: "'fooled experts into thinking genuine Bach' = แทบแยกไม่ออกจากงานมนุษย์ จึงตอบ A" },
          { q: "surprised people", p: "moved to tears", th: "ทำให้คนประหลาดใจ/ซาบซึ้ง" },
          { q: "generating work", p: "create compositions", th: "สร้างผลงาน (บทเพลง)" },
        ],
        keyVocab: { word: "fooled experts into thinking", th: "หลอกผู้เชี่ยวชาญให้เชื่อว่า", note: "'fooled experts into thinking genuine Bach' = แทบแยกไม่ออกจากงานมนุษย์ (indistinguishable) จึงตอบ A" }
    },
    34: {
        questionPhrase: { en: "not revealing the technical details", th: "ไม่เปิดเผยรายละเอียดทางเทคนิค" },
        passagePhrase: { en: "condemned him for his deliberately vague explanation of how the software worked", th: "ตำหนิเขาที่จงใจอธิบายการทำงานของซอฟต์แวร์อย่างคลุมเครือ" },
        pairs: [
          { q: "revealing the technical details of his program", p: "vague explanation of how the software worked", th: "เปิดเผยรายละเอียดทางเทคนิคของโปรแกรม", note: "'deliberately vague explanation' = ไม่ยอมเปิดเผยรายละเอียดทางเทคนิค จึงตอบ E" },
          { q: "criticised", p: "condemned him", th: "วิจารณ์/ตำหนิ" },
          { q: "not", p: "deliberately vague", th: "จงใจคลุมเครือ (ไม่เปิดเผย)" },
        ],
        keyVocab: { word: "deliberately vague explanation", th: "คำอธิบายที่จงใจคลุมเครือ", note: "'vague explanation of how the software worked' = ไม่เปิดเผยรายละเอียดทางเทคนิค (technical details) จึงตอบ E" }
    },
    35: {
        questionPhrase: { en: "work entirely dependent on its creator's imagination", th: "งานที่ต้องพึ่งจินตนาการของผู้สร้างทั้งหมด" },
        passagePhrase: { en: "replicas which still rely completely on the original artist's creative impulses", th: "สำเนาที่ยังพึ่งพาแรงสร้างสรรค์ของศิลปินต้นฉบับโดยสิ้นเชิง" },
        pairs: [
          { q: "entirely dependent on the imagination of its creator", p: "rely completely on the original artist's creative impulses", th: "พึ่งพาจินตนาการของผู้สร้างทั้งหมด", note: "'rely completely on the original artist's creative impulses' = dependent on imagination of its creator จึงตอบ C" },
          { q: "EMI", p: "replicas", th: "สำเนา/งานเลียนแบบ" },
          { q: "imagination", p: "creative impulses", th: "จินตนาการ/แรงสร้างสรรค์" },
        ],
        keyVocab: { word: "rely completely on the original artist", th: "พึ่งพาศิลปินต้นฉบับอย่างสิ้นเชิง", note: "'rely completely on the original artist's creative impulses' = dependent on the imagination of its creator จึงตอบ C" }
    },
    36: {
        questionPhrase: { en: "after discovering it was made by a computer", th: "หลังพบว่ามันเป็นผลงานของคอมพิวเตอร์" },
        passagePhrase: { en: "tricked them into believing a human was behind the score", th: "หลอกพวกเขาให้เชื่อว่ามีมนุษย์อยู่เบื้องหลังบทเพลง" },
        pairs: [
          { q: "discovering that it was the product of a computer program", p: "tricked them into believing a human was behind the score", th: "พบว่าจริง ๆ แล้วเป็นผลงานของคอมพิวเตอร์ (เคยถูกหลอกว่าเป็นมนุษย์)", note: "เคยถูกหลอกว่ามีมนุษย์อยู่เบื้องหลัง พอรู้ความจริงว่าเป็นคอมพิวเตอร์จึงโกรธ ตรงกับ G" },
          { q: "became angry", p: "outraged", th: "โกรธ/ไม่พอใจ" },
          { q: "Audiences", p: "audiences", th: "ผู้ฟัง/ผู้ชม" },
        ],
        keyVocab: { word: "found out the truth / discovering", th: "ค้นพบความจริงว่าเป็นคอมพิวเตอร์", note: "ผู้ฟังเคยถูกหลอกว่าเป็นมนุษย์ พอ 'found out the truth' ว่าเป็นโปรแกรมคอมพิวเตอร์จึงโกรธ ตรงกับ G" }
    },
    37: {
        questionPhrase: { en: "assess music without knowing the composer", th: "ประเมินดนตรีโดยไม่รู้ว่าใครแต่ง" },
        passagePhrase: { en: "weren't told beforehand whether the tunes were composed by humans or computers", th: "ไม่ถูกบอกล่วงหน้าว่าเพลงแต่งโดยมนุษย์หรือคอมพิวเตอร์" },
        pairs: [
          { q: "without knowing whether it was the work of humans or software", p: "weren't told beforehand whether the tunes were composed by humans or computers", th: "โดยไม่รู้ว่าเป็นผลงานของมนุษย์หรือคอมพิวเตอร์", note: "'weren't told whether humans or computers' = without knowing humans or software จึงตอบ B" },
          { q: "assess music", p: "assess six compositions", th: "ประเมิน/ตัดสินบทเพลง" },
          { q: "participants", p: "participants", th: "ผู้เข้าร่วม" },
        ],
        keyVocab: { word: "weren't told whether humans or computers", th: "ไม่ถูกบอกว่าเป็นมนุษย์หรือคอมพิวเตอร์", note: "'weren't told whether humans or computers' = without knowing whether it was humans or software จึงตอบ B" }
    },
    38: {
        questionPhrase: { en: "Moffat's research may help explain reactions to EMI", th: "งานวิจัยของม็อฟแฟตอาจช่วยอธิบายปฏิกิริยาต่อ EMI" },
        passagePhrase: { en: "A study by David Moffat provides a clue", th: "งานศึกษาของเดวิด ม็อฟแฟตให้เบาะแส" },
        pairs: [
          { q: "may help explain people's reactions to EMI", p: "provides a clue", th: "อาจช่วยอธิบายปฏิกิริยาของคนต่อ EMI", note: "'provides a clue' ต่อคำถามว่าทำไมคนถอยหนีเมื่อรู้ที่มา = ช่วยอธิบายปฏิกิริยา ผู้เขียนเห็นด้วย จึงตอบ YES" },
          { q: "Moffat's research", p: "A study by computer scientist David Moffat", th: "งานวิจัย/งานศึกษาของม็อฟแฟต" },
        ],
        keyVocab: { word: "provides a clue", th: "ให้เบาะแส (ช่วยอธิบาย)", note: "'provides a clue' ต่อคำถามว่าทำไมคนถอยหนีเมื่อรู้ที่มา = ช่วยอธิบายปฏิกิริยาต่อ EMI ผู้เขียนเห็นด้วย จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "non-experts all responded in a predictable way", th: "ผู้ที่ไม่ใช่ผู้เชี่ยวชาญตอบสนองในแบบที่คาดเดาได้ทุกคน" },
        passagePhrase: { en: "even among the experts, who might have been expected to be more objective", th: "แม้แต่ในกลุ่มผู้เชี่ยวชาญ ที่น่าจะวิเคราะห์อย่างเป็นกลางกว่า" },
        pairs: [
          { q: "The non-experts", p: "both expert musicians and non-experts", th: "กลุ่มที่ไม่ใช่ผู้เชี่ยวชาญ", note: "บทพูดถึงแนวโน้มรวมและผู้เชี่ยวชาญ แต่ไม่ระบุว่าผู้ที่ไม่ใช่ผู้เชี่ยวชาญตอบ 'ทุกคน' เหมือนกัน จึงตอบ NOT GIVEN" },
          { q: "responded in a predictable way", p: "tended to dislike the piece more", th: "ตอบสนองในแบบที่คาดเดาได้ (มีแนวโน้มไม่ชอบมากกว่า)" },
        ],
        keyVocab: { word: "all (every non-expert)", th: "ทั้งหมด/ทุกคน", note: "บทอ้างถึงแนวโน้มภาพรวมและพูดถึงผู้เชี่ยวชาญ แต่ไม่ได้ระบุว่าผู้ที่ไม่ใช่ผู้เชี่ยวชาญตอบ 'ทุกคน' แบบเดียวกัน จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "Kruger's findings cast doubt on Bloom's theory", th: "ผลของครูเกอร์ทำให้ทฤษฎีของบลูมน่าสงสัย" },
        passagePhrase: { en: "Similarly, experiments by Justin Kruger have shown people's enjoyment increases", th: "ในทำนองเดียวกัน การทดลองของครูเกอร์แสดงว่าความชื่นชอบเพิ่มขึ้น" },
        pairs: [
          { q: "cast doubt on", p: "Similarly", th: "ทำให้น่าสงสัย (แต่ในบทใช้ 'Similarly' = สอดคล้องกัน)", note: "'Similarly' บอกว่าผลของครูเกอร์สนับสนุนทฤษฎีของบลูม ไม่ใช่ทำให้น่าสงสัย จึงขัดแย้งกับโจทย์ ตอบ NO" },
          { q: "Justin Kruger's findings", p: "experiments by Justin Kruger", th: "ผลการทดลองของครูเกอร์" },
          { q: "Paul Bloom's theory", p: "part of the pleasure we get from art stems from the creative process", th: "ทฤษฎีของบลูม (ความสุขจากศิลปะมาจากกระบวนการสร้างสรรค์)" },
        ],
        keyVocab: { word: "Similarly", th: "ในทำนองเดียวกัน (สอดคล้องกัน)", note: "คำว่า 'Similarly' บอกว่าผลของครูเกอร์ 'สนับสนุน' ทฤษฎีของบลูม ไม่ใช่ทำให้น่าสงสัย จึงขัดแย้งกับโจทย์ ตอบ NO" }
    },
  },
  "Cambridge 13 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "unaware of the significant impact that trends have", th: "ไม่รู้ตัวว่าเทรนด์มีผลกระทบสำคัญมากแค่ไหน" },
        passagePhrase: { en: "fail to recognize the less obvious but profound ways these trends are influencing consumers", th: "มองไม่เห็นวิธีที่ลึกซึ้งแต่ไม่ชัดเจนที่เทรนด์ส่งผลต่อผู้บริโภค" },
        pairs: [
          { q: "unaware of", p: "fail to recognize", th: "ไม่รู้ตัว / มองไม่เห็น", note: "'fail to recognize' = 'unaware of' และ 'profound' = 'significant impact' จึงตอบ D" },
          { q: "significant impact", p: "profound ways", th: "ผลกระทบที่ลึกซึ้งรุนแรง" },
          { q: "trends have on consumers' lives", p: "trends are influencing consumers' aspirations, attitudes, and behaviors", th: "เทรนด์ส่งผลต่อชีวิตผู้บริโภค" },
        ],
        keyVocab: { word: "profound (ways)", th: "ลึกซึ้ง / รุนแรงมาก", note: "'profound' = 'significant impact' และ 'fail to recognize' = 'unaware' จึงตอบ D ผู้จัดการไม่รู้ถึงผลกระทบสำคัญของเทรนด์ที่มีต่อชีวิตผู้บริโภค" }
    },
    28: {
        questionPhrase: { en: "anxious to safeguard its reputation as a luxury manufacturer", th: "กังวลที่จะปกป้องชื่อเสียงในฐานะแบรนด์หรู" },
        passagePhrase: { en: "lowering prices would have risked cheapening the brand's image", th: "การลดราคาอาจทำให้ภาพลักษณ์แบรนด์ดูถูกลง" },
        pairs: [
          { q: "safeguard its reputation", p: "risked cheapening the brand's image", th: "ปกป้องชื่อเสียง/ภาพลักษณ์", note: "เลี่ยง 'cheapening the brand's image' = 'safeguard reputation' จึงตอบ C" },
          { q: "manufacturer of luxury goods", p: "symbol of opulence and luxury", th: "แบรนด์สินค้าหรูหรา" },
        ],
        keyVocab: { word: "cheapening the brand's image", th: "ทำให้ภาพลักษณ์แบรนด์ดูด้อยค่า", note: "'avoid cheapening the image' = 'safeguard reputation as luxury goods' จึงตอบ C โค้ชกังวลเรื่องการรักษาภาพลักษณ์ความหรูหรา" }
    },
    29: {
        questionPhrase: { en: "did not require Tesco to modify its core business", th: "ไม่ต้องเปลี่ยนแปลงธุรกิจหลักของเทสโก้" },
        passagePhrase: { en: "has not abandoned its traditional retail offering but augmented its business", th: "ไม่ได้ทิ้งธุรกิจค้าปลีกเดิม แต่เสริมเพิ่มเข้าไป" },
        pairs: [
          { q: "did not require Tesco to modify", p: "has not abandoned its traditional retail offering", th: "ไม่ต้องเปลี่ยน/ไม่ได้ทิ้งของเดิม", note: "'not abandoned... but augmented' = 'did not require to modify core business' จึงตอบ A" },
          { q: "its core business activities", p: "its traditional retail offering", th: "ธุรกิจหลัก/ค้าปลีกเดิม" },
        ],
        keyVocab: { word: "augmented (not abandoned)", th: "เสริมเพิ่มเข้าไป (ไม่ได้ทิ้ง)", note: "'not abandoned... but augmented' = 'did not require to modify core business' จึงตอบ A โครงการนี้ไม่ได้แตะธุรกิจหลักเดิม" }
    },
    30: {
        questionPhrase: { en: "strategy with few obvious benefits", th: "กลยุทธ์ที่ดูเหมือนแทบไม่มีประโยชน์ชัดเจน" },
        passagePhrase: { en: "sounds like it's hardly worthwhile to incorporate a seemingly irrelevant trend", th: "ฟังดูแทบไม่คุ้มที่จะเอาเทรนด์ที่ดูไม่เกี่ยวข้องมาใช้" },
        pairs: [
          { q: "few obvious benefits", p: "hardly worthwhile", th: "แทบไม่มีประโยชน์/ไม่คุ้ม", note: "'sounds like it's hardly worthwhile' = 'few obvious benefits' จึงตอบ D" },
          { q: "Nike's strategy", p: "seemingly irrelevant trend into one's core offerings", th: "กลยุทธ์เอาเทรนด์ที่ดูไม่เกี่ยวมาใช้" },
        ],
        keyVocab: { word: "hardly worthwhile", th: "แทบไม่คุ้มค่า", note: "'hardly worthwhile / seemingly irrelevant' = 'few obvious benefits' จึงตอบ D กลยุทธ์ของไนกี้ดูเผินๆ เหมือนไม่ได้ประโยชน์อะไร" }
    },
    31: {
        questionPhrase: { en: "addressed people's concerns about unhealthy lifestyles", th: "ตอบโจทย์ความกังวลเรื่องวิถีชีวิตที่ไม่ดีต่อสุขภาพ" },
        passagePhrase: { en: "incorporated the traditional physical component, awarding points for physical activity", th: "ใส่องค์ประกอบการเล่นทางกายแบบดั้งเดิม ให้คะแนนจากการออกกำลังกาย" },
        pairs: [
          { q: "original about", p: "What set it apart", th: "จุดที่แตกต่าง/แปลกใหม่" },
          { q: "concerns about unhealthy lifestyles", p: "associations with lack of exercise and obesity", th: "ความกังวลเรื่องวิถีชีวิตไม่ดีต่อสุขภาพ", note: "'physical activity' แก้ 'lack of exercise and obesity' = 'concerns about unhealthy lifestyles' จึงตอบ D" },
          { q: "addressed people's concerns", p: "countering the negatives", th: "ตอบโจทย์/แก้ข้อกังวล" },
        ],
        keyVocab: { word: "physical activity", th: "การเคลื่อนไหวออกกำลังกาย", note: "'physical activity component' แก้ปัญหา 'lack of exercise and obesity' = 'concerns about unhealthy lifestyles' จึงตอบ D" }
    },
    32: {
        questionPhrase: { en: "turned harmful-effects notion to its own advantage", th: "พลิกข้อเสียที่ว่าสินค้าทำร้ายสุขภาพให้เป็นจุดขาย" },
        passagePhrase: { en: "the ME2 counteracted the negative impacts of digital gaming devices", th: "ME2 ตอบโต้ผลเสียของอุปกรณ์เกมดิจิทัล" },
        pairs: [
          { q: "turned the notion that its products could have harmful effects to its own advantage", p: "counteracted some of the widely perceived negative impacts", th: "พลิกข้อเสียให้เป็นจุดขาย", note: "ME2 สร้างโดย iToys พลิกข้อเสียมาเป็นจุดขาย จึงตอบ D iToys" },
          { q: "its products", p: "the ME2, a video game created by Canada's iToys", th: "สินค้าของบริษัท (ME2)" },
        ],
        keyVocab: { word: "counteracted (negative impacts)", th: "ตอบโต้/แก้ผลเสีย", note: "ME2 สร้างโดย iToys พลิกข้อเสีย (ทำร้ายสุขภาพ) มาเป็นจุดขาย จึงตอบ D iToys" }
    },
    33: {
        questionPhrase: { en: "extended its offering by collaborating with another manufacturer", th: "ขยายสินค้าด้วยการร่วมมือกับผู้ผลิตอีกราย" },
        passagePhrase: { en: "they teamed up with technology company Apple to launch Nike+", th: "ไนกี้จับมือกับบริษัทเทคโนโลยี Apple เปิดตัว Nike+" },
        pairs: [
          { q: "collaborating with another manufacturer", p: "teamed up with technology company Apple", th: "ร่วมมือกับผู้ผลิตอีกราย", note: "'teamed up with Apple' = 'collaborating with another manufacturer' จึงตอบ C Nike" },
          { q: "extended its offering", p: "to launch Nike+, a digital sports kit", th: "ขยายสินค้า/บริการ" },
        ],
        keyVocab: { word: "teamed up with", th: "จับมือ/ร่วมมือกับ", note: "'teamed up with Apple' = 'collaborating with another manufacturer' จึงตอบ C Nike" }
    },
    34: {
        questionPhrase: { en: "incentive scheme showing corporate social responsibility", th: "โครงการให้รางวัลที่แสดงความรับผิดชอบต่อสังคม" },
        passagePhrase: { en: "Greener Living program demonstrates commitment to protecting the environment, green points redeemed for cash", th: "โครงการ Greener Living แสดงความมุ่งมั่นรักษาสิ่งแวดล้อม สะสมแต้มแลกเงินได้" },
        pairs: [
          { q: "incentive scheme", p: "accumulate points", th: "ระบบสะสมแต้ม/ให้รางวัล", note: "ระบบสะสมแต้ม = 'incentive scheme' และรักษาสิ่งแวดล้อม = 'corporate social responsibility' จึงตอบ B Tesco" },
          { q: "corporate social responsibility", p: "commitment to protecting the environment", th: "ความรับผิดชอบต่อสังคม/สิ่งแวดล้อม" },
        ],
        keyVocab: { word: "green points redeemed (commitment to environment)", th: "แต้มสีเขียวแลกได้ (ความมุ่งมั่นด้านสิ่งแวดล้อม)", note: "ระบบสะสมแต้ม = 'incentive scheme' และปกป้องสิ่งแวดล้อม = 'corporate social responsibility' จึงตอบ B Tesco" }
    },
    35: {
        questionPhrase: { en: "customers had positive attitude toward difficult circumstances", th: "ลูกค้ามีทัศนคติเชิงบวกต่อการรับมือช่วงเวลายาก" },
        passagePhrase: { en: "customers were eager to lift themselves and the country out of tough times", th: "ลูกค้ากระตือรือร้นที่จะพาตัวเองและประเทศพ้นช่วงเวลายากลำบาก" },
        pairs: [
          { q: "positive attitude towards dealing with difficult circumstances", p: "eager to lift themselves and the country out of tough times", th: "ทัศนคติบวกต่อการรับมือช่วงยากลำบาก", note: "พบจากวิจัยของโค้ช จึงตอบ A Coach" },
          { q: "discovered", p: "revealed", th: "ค้นพบ/เผยให้เห็น" },
          { q: "difficult circumstances", p: "tough times", th: "ช่วงเวลายากลำบาก" },
        ],
        keyVocab: { word: "eager to lift out of tough times", th: "กระตือรือร้นที่จะก้าวพ้นช่วงยากลำบาก", note: "'eager to lift out of tough times' = 'positive attitude towards dealing with difficult circumstances' พบจากวิจัยของโค้ช จึงตอบ A Coach" }
    },
    36: {
        questionPhrase: { en: "responded to a lifestyle trend in an unrelated sector", th: "ตอบสนองเทรนด์ไลฟ์สไตล์ในกลุ่มสินค้าที่ไม่เกี่ยวกัน" },
        passagePhrase: { en: "integrate the digital revolution into its reputation for athletic footwear", th: "ผสานการปฏิวัติดิจิทัลเข้ากับชื่อเสียงด้านรองเท้ากีฬา" },
        pairs: [
          { q: "unrelated product sector", p: "seemingly irrelevant trend", th: "กลุ่มสินค้าที่ไม่เกี่ยวข้องกัน", note: "เทรนด์ดิจิทัลไม่เกี่ยวกับรองเท้ากีฬา = 'unrelated product sector' จึงตอบ C Nike" },
          { q: "responded to a growing lifestyle trend", p: "integrate the digital revolution", th: "ตอบสนองเทรนด์ที่กำลังเติบโต" },
        ],
        keyVocab: { word: "seemingly irrelevant trend", th: "เทรนด์ที่ดูไม่เกี่ยวข้อง", note: "เทรนด์ดิจิทัลไม่เกี่ยวกับรองเท้ากีฬา = 'unrelated product sector' จึงตอบ C Nike" }
    },
    37: {
        questionPhrase: { en: "avoided having to charge customers less", th: "เลี่ยงไม่ต้องลดราคาให้ลูกค้า" },
        passagePhrase: { en: "creating the sub-brand allowed Coach to avert an across-the-board price cut", th: "การสร้างซับแบรนด์ช่วยให้โค้ชเลี่ยงการลดราคาทั้งกระดาน" },
        pairs: [
          { q: "avoided having to charge its customers less", p: "avert an across-the-board price cut", th: "เลี่ยงการลดราคา", note: "'avert an across-the-board price cut' = 'avoided having to charge customers less' จึงตอบ A Coach" },
          { q: "its core products", p: "across-the-board", th: "สินค้าหลักทั้งหมด" },
        ],
        keyVocab: { word: "avert an across-the-board price cut", th: "เลี่ยงการลดราคาทั้งหมด", note: "'avert an across-the-board price cut' = 'avoided having to charge customers less' จึงตอบ A Coach" }
    },
    38: {
        questionPhrase: { en: "identify the most appropriate innovation strategy", th: "เลือกกลยุทธ์นวัตกรรมที่เหมาะสมที่สุด" },
        passagePhrase: { en: "you can determine which of our three innovation strategies to pursue", th: "คุณจะตัดสินใจได้ว่าจะใช้กลยุทธ์นวัตกรรมข้อใดในสามข้อ" },
        pairs: [
          { q: "identify the most appropriate innovation strategy", p: "determine which of our three innovation strategies to pursue", th: "เลือกกลยุทธ์นวัตกรรมที่เหมาะสม", note: "'determine which of three strategies' = 'identify the most appropriate innovation strategy' จึงตอบ B" },
          { q: "trend-related changes impacting on your category", p: "trend-related changes in consumer opinions and behaviors impact on your category", th: "การเปลี่ยนแปลงจากเทรนด์ที่กระทบกลุ่มสินค้า" },
        ],
        keyVocab: { word: "determine which strategy to pursue", th: "ตัดสินใจว่าจะเลือกใช้กลยุทธ์ใด", note: "'determine which of three strategies' = 'identify the most appropriate innovation strategy' จึงตอบ B" }
    },
    39: {
        questionPhrase: { en: "trend highlights a negative aspect of your category", th: "เทรนด์ชี้ให้เห็นด้านลบของกลุ่มสินค้าคุณ" },
        passagePhrase: { en: "counteract those changes by reaffirming the core values of your category", th: "ตอบโต้การเปลี่ยนแปลงด้วยการยืนยันคุณค่าหลักของกลุ่มสินค้า" },
        pairs: [
          { q: "trend highlights a negative aspect of your category", p: "aspects of the category clash with undesired outcomes of a trend", th: "เทรนด์ชี้ด้านลบของกลุ่มสินค้า", note: "'reaffirming the core values' = ตัวเลือก counteract-and-affirm จึงตอบ C" },
          { q: "emphasise your brand's traditional values", p: "reaffirming the core values of your category", th: "เน้นย้ำคุณค่าหลักดั้งเดิม" },
        ],
        keyVocab: { word: "reaffirming the core values", th: "ยืนยันคุณค่าหลักอีกครั้ง", note: "'counteract... by reaffirming core values' = ตัวเลือก 'counteract-and-affirm strategy' จึงตอบ C" }
    },
    40: {
        questionPhrase: { en: "new focus has increasing lack of connection with offering", th: "ความสนใจใหม่ของลูกค้าห่างจากสินค้าคุณมากขึ้น" },
        passagePhrase: { en: "increasing disparity between your category and consumers' new focus, innovations need to transcend", th: "ช่องว่างที่กว้างขึ้นระหว่างกลุ่มสินค้ากับความสนใจใหม่ ต้องก้าวข้ามกลุ่มเดิม" },
        pairs: [
          { q: "increasing lack of connection with your offering", p: "increasing disparity between your category and consumers' new focus", th: "ช่องว่างที่กว้างขึ้นระหว่างสินค้ากับความสนใจใหม่", note: "'increasing disparity' = 'increasing lack of connection' ต้อง 'transcend' จึงตอบ D" },
          { q: "integrate the two worlds", p: "transcend the category to integrate the two worlds", th: "ผสานสองโลกเข้าด้วยกัน" },
        ],
        keyVocab: { word: "disparity (transcend the category)", th: "ช่องว่าง/ความต่าง (ก้าวข้ามกลุ่มสินค้า)", note: "'increasing disparity' = 'increasing lack of connection' และต้อง 'transcend to integrate the two worlds' จึงตอบ D combine-and-transcend" }
    },
  },
  "Cambridge 13 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "proposed explanations for the decline", th: "ข้อสันนิษฐานต่าง ๆ ที่อธิบายการล่มสลาย" },
        passagePhrase: { en: "Some have claimed that major glacier-fed rivers changed their course", th: "บางคนอ้างว่าแม่น้ำสายใหญ่ที่หล่อเลี้ยงด้วยธารน้ำแข็งเปลี่ยนเส้นทาง" },
        pairs: [
          { q: "proposed explanations", p: "Some have claimed", th: "ข้อสันนิษฐาน/คำอธิบายที่มีคนเสนอ", note: "ย่อหน้า C ไล่เรียงหลายสาเหตุที่ 'มีคนอ้าง' ว่าทำให้อารยธรรมเสื่อม จึงตรงกับ proposed explanations คำตอบคือ C" },
          { q: "the decline", p: "the decline of the civilisation", th: "การเสื่อมถอย/ล่มสลาย" },
          { q: "the Harappan Civilisation", p: "glacier-fed rivers changed their course", th: "สาเหตุที่ถูกอ้างถึงการเสื่อมของฮารัปปา" },
        ],
        keyVocab: { word: "Some have claimed / decline", th: "บางคนได้อ้างว่า / การเสื่อมถอย", note: "ย่อหน้า C ไล่เรียงหลายสาเหตุที่ 'มีคนอ้าง' ว่าทำให้อารยธรรมเสื่อม จึงตรงกับ proposed explanations คำตอบคือ C" }
    },
    28: {
        questionPhrase: { en: "a present-day application of research findings", th: "การนำผลการวิจัยมาใช้กับปัญหาในปัจจุบัน" },
        passagePhrase: { en: "learn from the past to be more proactive in issues such as management of water supply", th: "เรียนรู้จากอดีตเพื่อจัดการเรื่องน้ำในปัจจุบันเชิงรุกมากขึ้น" },
        pairs: [
          { q: "present-day application", p: "learn from the past to engage with the public", th: "การนำมาใช้กับปัจจุบัน/อนาคต", note: "ย่อหน้า H พูดถึงการเอาบทเรียนจากอดีตมาใช้กับการบริหารน้ำและเมืองในอนาคต ตรงกับ present-day application คำตอบคือ H" },
          { q: "archaeological research findings", p: "archaeologists are in a unique position to investigate", th: "ผลการศึกษาทางโบราณคดี" },
          { q: "application", p: "the management and administration of water supply", th: "การประยุกต์ใช้จริง (บริหารน้ำ)" },
        ],
        keyVocab: { word: "present-day application", th: "การประยุกต์ใช้ในปัจจุบัน", note: "ย่อหน้า H พูดถึงการเอาบทเรียนจากอดีตมาใช้กับการบริหารน้ำและเมืองในอนาคต ตรงกับ present-day application คำตอบคือ H (exactPortion ที่ให้มาคลาดเคลื่อน เนื้อหาจริงอยู่ย่อหน้า H)" }
    },
    29: {
        questionPhrase: { en: "a difference from another culture of the same period", th: "ความแตกต่างจากอีกวัฒนธรรมในยุคเดียวกัน" },
        passagePhrase: { en: "at a time when the Egyptians were carving representations of themselves", th: "ในยุคที่ชาวอียิปต์กำลังสลักภาพตนเอง" },
        pairs: [
          { q: "another culture of the same period", p: "the Egyptians", th: "อีกวัฒนธรรมหนึ่งในยุคเดียวกัน", note: "ย่อหน้า A เทียบฮารัปปาที่ไม่ทำภาพตนเองกับอียิปต์ในยุคเดียวกันที่ทำมากมาย จึงเป็น difference between two cultures คำตอบคือ A" },
          { q: "a difference", p: "lack of self-imagery", th: "ความแตกต่าง (ฮารัปปาแทบไม่มีภาพตนเอง)" },
          { q: "of the same period", p: "at a time when", th: "ในช่วงเวลาเดียวกัน" },
        ],
        keyVocab: { word: "another culture", th: "อีกวัฒนธรรมหนึ่ง", contrastA: "Harappan . ฮารัปปาแทบไม่มีภาพของตนเอง", contrastB: "Egyptians . อียิปต์สลักภาพตนเองไปทั่ว", note: "ย่อหน้า A เทียบฮารัปปาที่ไม่ทำภาพตนเองกับอียิปต์ในยุคเดียวกันที่ทำมากมาย จึงเป็น difference between two cultures คำตอบคือ A" }
    },
    30: {
        questionPhrase: { en: "features of Harappan urban design", th: "ลักษณะการวางผังเมืองของฮารัปปา" },
        passagePhrase: { en: "Houses arranged in blocks, with wide main streets and narrow alleyways", th: "บ้านจัดเป็นบล็อก มีถนนสายหลักกว้างและตรอกแคบ" },
        pairs: [
          { q: "features of Harappan urban design", p: "Houses were arranged in blocks", th: "ลักษณะการวางผังเมือง", note: "ย่อหน้า B บรรยายถนน ตรอก บ่อน้ำ และระบบระบายน้ำ ซึ่งเป็นรายละเอียดการวางผังเมือง คำตอบคือ B" },
          { q: "urban design", p: "wide main streets and narrow alleyways", th: "การออกแบบผังเมือง (ถนนและตรอก)" },
          { q: "features", p: "their own wells and drainage systems", th: "ลักษณะเด่น (บ่อน้ำและระบบระบายน้ำ)" },
        ],
        keyVocab: { word: "urban design", th: "การออกแบบผังเมือง", note: "ย่อหน้า B บรรยายถนน ตรอก บ่อน้ำ และระบบระบายน้ำ ซึ่งเป็นรายละเอียดการวางผังเมือง คำตอบคือ B" }
    },
    31: {
        questionPhrase: { en: "discovery of errors made by previous archaeologists", th: "การพบข้อผิดพลาดของนักโบราณคดีรุ่นก่อน" },
        passagePhrase: { en: "found inaccuracies in the published geographic locations of ancient settlements", th: "พบความคลาดเคลื่อนของตำแหน่งที่ตั้งโบราณสถานที่เคยตีพิมพ์ไว้" },
        pairs: [
          { q: "errors", p: "inaccuracies", th: "ข้อผิดพลาด/ความคลาดเคลื่อน", note: "ย่อหน้า D บอกว่าทีมวิจัยพบว่าตำแหน่งโบราณสถานที่บันทึกไว้ผิดพลาด คือ errors of previous work คำตอบคือ D" },
          { q: "discovery", p: "found", th: "การค้นพบ" },
          { q: "previous archaeologists", p: "the published geographic locations of ancient settlements", th: "ข้อมูลที่นักวิจัยรุ่นก่อนตีพิมพ์ไว้" },
        ],
        keyVocab: { word: "inaccuracies = errors", th: "ความคลาดเคลื่อน = ข้อผิดพลาด", note: "ย่อหน้า D บอกว่าทีมวิจัยพบว่าตำแหน่งโบราณสถานที่บันทึกไว้ผิดพลาด คือ errors of previous work คำตอบคือ D" }
    },
    32: {
        questionPhrase: { en: "collecting the ___ of snails", th: "เก็บ ___ ของหอยทาก" },
        passagePhrase: { en: "gathered shells of Melanoides tuberculate snails", th: "เก็บเปลือกของหอยทาก Melanoides tuberculate" },
        pairs: [
          { q: "collecting", p: "gathered", th: "เก็บรวบรวม", note: "summary ใช้ collecting ส่วน passage ใช้ gathered สิ่งที่เก็บคือ shells คำตอบคือ shells" },
          { q: "the ___ of snails", p: "shells of Melanoides tuberculate snails", th: "เปลือกของหอยทาก" },
        ],
        keyVocab: { word: "shells", th: "เปลือกหอย", note: "summary ใช้ collecting ส่วน passage ใช้ gathered สิ่งที่เก็บคือ shells คำตอบคือ shells" }
    },
    33: {
        questionPhrase: { en: "a change in water levels in a ___", th: "การเปลี่ยนแปลงระดับน้ำใน ___" },
        passagePhrase: { en: "from the sediments of an ancient lake", th: "จากตะกอนของทะเลสาบโบราณ" },
        pairs: [
          { q: "water levels in a ___", p: "an ancient lake", th: "ระดับน้ำในทะเลสาบ", note: "แหล่งน้ำที่นักวิจัยศึกษาระดับน้ำคือ ancient lake คำตอบคือ lake" },
          { q: "in the region", p: "the sediments of an ancient lake", th: "ในพื้นที่ (ตะกอนทะเลสาบ)" },
        ],
        keyVocab: { word: "lake", th: "ทะเลสาบ", note: "แหล่งน้ำที่นักวิจัยศึกษาระดับน้ำคือ ancient lake คำตอบคือ lake" }
    },
    34: {
        questionPhrase: { en: "when there was less ___ than evaporation", th: "เมื่อมี ___ น้อยกว่าการระเหย" },
        passagePhrase: { en: "the amount of evaporation exceeded the rainfall", th: "ปริมาณการระเหยมากกว่าปริมาณน้ำฝน" },
        pairs: [
          { q: "less ___ than evaporation", p: "the amount of evaporation from the lake exceeded the rainfall", th: "น้ำฝนน้อยกว่าการระเหย", note: "passage บอกว่า evaporation 'exceeded' rainfall เท่ากับว่า rainfall 'น้อยกว่า' evaporation จึงเติม rainfall คำตอบคือ rainfall" },
          { q: "an extended period of drought", p: "indicative of a drought", th: "ช่วงภัยแล้งที่ยาวนาน" },
        ],
        keyVocab: { word: "rainfall", th: "ปริมาณน้ำฝน", contrastA: "evaporation exceeded rainfall . ระเหยมากกว่าฝน", contrastB: "less rainfall than evaporation . ฝนน้อยกว่าระเหย", note: "passage บอกว่า evaporation 'exceeded' rainfall เท่ากับว่า rainfall 'น้อยกว่า' evaporation จึงเติม rainfall คำตอบคือ rainfall" }
    },
    35: {
        questionPhrase: { en: "examining the ___ grown in the region", th: "ศึกษา ___ ที่ปลูกในพื้นที่" },
        passagePhrase: { en: "They are analysing grains cultivated at the time", th: "พวกเขากำลังวิเคราะห์ธัญพืชที่ปลูกในยุคนั้น" },
        pairs: [
          { q: "the ___ grown in the region", p: "grains cultivated at the time", th: "ธัญพืชที่ปลูกในยุคนั้น", note: "summary ใช้ grown/agricultural ส่วน passage ใช้ grains cultivated สิ่งที่ปลูกคือ grains คำตอบคือ grains" },
          { q: "adapted their agricultural methods", p: "adjusting the combinations of crops they were growing", th: "ปรับวิธีการเพาะปลูก" },
        ],
        keyVocab: { word: "grains", th: "ธัญพืช / เมล็ดพืช", note: "summary ใช้ grown/agricultural ส่วน passage ใช้ grains cultivated สิ่งที่ปลูกคือ grains คำตอบคือ grains" }
    },
    36: {
        questionPhrase: { en: "the types of ___ used", th: "ชนิดของ ___ ที่ใช้" },
        passagePhrase: { en: "the types of pottery used, and other aspects of their material culture", th: "ชนิดของเครื่องปั้นดินเผาที่ใช้ และวัฒนธรรมทางวัตถุอื่น ๆ" },
        pairs: [
          { q: "the types of ___ used", p: "the types of pottery used", th: "ชนิดของเครื่องปั้นดินเผาที่ใช้", note: "summary และ passage ใช้วลีเดียวกันคือ types of ... used วัตถุที่ใช้บ่งบอกเครือข่ายคือ pottery คำตอบคือ pottery" },
          { q: "links between inhabitants of different parts of the region", p: "distinctive to specific regions or were more similar across larger areas", th: "ความเชื่อมโยงระหว่างผู้คนต่างพื้นที่" },
        ],
        keyVocab: { word: "pottery", th: "เครื่องปั้นดินเผา", note: "summary และ passage ใช้วลีเดียวกันคือ types of ... used วัตถุที่ใช้บ่งบอกเครือข่ายคือ pottery คำตอบคือ pottery" }
    },
    37: {
        questionPhrase: { en: "more environmental information is vital", th: "การหาข้อมูลสภาพแวดล้อมเพิ่มเป็นเรื่องจำเป็นยิ่ง" },
        passagePhrase: { en: "it is essential that we obtain more climate data", th: "จำเป็นอย่างยิ่งที่เราต้องได้ข้อมูลภูมิอากาศเพิ่ม" },
        pairs: [
          { q: "is vital", p: "it is essential", th: "จำเป็นอย่างยิ่ง/สำคัญมาก", note: "คำพูดของ Singh ว่า essential ... obtain more climate data ตรงกับ vital ... environmental information คำตอบคือ B (Singh)" },
          { q: "Finding further information", p: "we obtain more climate data", th: "การหาข้อมูลเพิ่มเติม" },
          { q: "changes to environmental conditions", p: "variable weather systems", th: "การเปลี่ยนแปลงของสภาพแวดล้อม" },
        ],
        keyVocab: { word: "essential = vital", th: "จำเป็นอย่างยิ่ง = สำคัญมาก", note: "คำพูดของ Singh ว่า essential ... obtain more climate data ตรงกับ vital ... environmental information คำตอบคือ B (Singh)" }
    },
    38: {
        questionPhrase: { en: "examining the past may have long-term benefits", th: "การศึกษาอดีตอาจให้ประโยชน์ระยะยาว" },
        passagePhrase: { en: "we can learn from the past to be more proactive in the future", th: "เราเรียนรู้จากอดีตเพื่อทำงานเชิงรุกในอนาคต" },
        pairs: [
          { q: "Examining previous patterns of behaviour", p: "learn from the past", th: "การศึกษาแบบแผนในอดีต", note: "Petrie พูดว่าศึกษาอดีตเพื่อประโยชน์ในอนาคต (long-term benefits) คำตอบคือ A (Petrie)" },
          { q: "may have long-term benefits", p: "to be more proactive in issues such as the management and administration of water supply", th: "อาจให้ประโยชน์ระยะยาว" },
        ],
        keyVocab: { word: "learn from the past = examining previous patterns", th: "เรียนรู้จากอดีต = ศึกษาแบบแผนในอดีต", note: "Petrie พูดว่าศึกษาอดีตเพื่อประโยชน์ในอนาคต (long-term benefits) คำตอบคือ A (Petrie) (exactPortion ที่ให้มาคลาดเคลื่อน คำพูดจริงอยู่ย่อหน้า H ของ Petrie)" }
    },
    39: {
        questionPhrase: { en: "rough calculations indicate length of water shortage", th: "การคำนวณคร่าว ๆ บ่งบอกความยาวของช่วงขาดน้ำ" },
        passagePhrase: { en: "We estimate that the weakening of the monsoon lasted about 200 years", th: "เราประมาณว่ามรสุมที่อ่อนกำลังกินเวลาราว 200 ปี" },
        pairs: [
          { q: "Rough calculations", p: "We estimate", th: "การประมาณการคร่าว ๆ", note: "Hodell พูดว่า 'We estimate ... lasted about 200 years' ตรงกับ rough calculations ของช่วงแล้ง คำตอบคือ D (Hodell)" },
          { q: "the approximate length", p: "lasted about 200 years", th: "ความยาวโดยประมาณ (ราว 200 ปี)" },
          { q: "a period of water shortage", p: "the weakening of the Indian summer monsoon", th: "ช่วงเวลาที่ขาดน้ำ/แล้ง" },
        ],
        keyVocab: { word: "estimate = rough calculations", th: "ประมาณการ = การคำนวณคร่าว ๆ", note: "Hodell พูดว่า 'We estimate ... lasted about 200 years' ตรงกับ rough calculations ของช่วงแล้ง คำตอบคือ D (Hodell)" }
    },
    40: {
        questionPhrase: { en: "information about the decline has been lacking", th: "ข้อมูลเรื่องการล่มสลายมีอยู่น้อย" },
        passagePhrase: { en: "plenty of evidence about its rise, but relatively little about its fall", th: "หลักฐานการรุ่งเรืองมีมาก แต่เรื่องการล่มสลายมีน้อยมาก" },
        pairs: [
          { q: "has been lacking", p: "relatively little", th: "มีอยู่น้อย/ขาดแคลน", note: "Petrie บอกว่ามีหลักฐานเรื่อง rise มากแต่เรื่อง fall น้อย ตรงกับ information about the decline lacking คำตอบคือ A (Petrie)" },
          { q: "Information about the decline", p: "little about its fall", th: "ข้อมูลเกี่ยวกับการล่มสลาย" },
        ],
        keyVocab: { word: "relatively little = lacking", th: "มีค่อนข้างน้อย = ขาดแคลน", contrastA: "rise . การรุ่งเรือง (หลักฐานเยอะ)", contrastB: "fall/decline . การล่มสลาย (หลักฐานน้อย)", note: "Petrie บอกว่ามีหลักฐานเรื่อง rise มากแต่เรื่อง fall น้อย ตรงกับ information about the decline lacking คำตอบคือ A (Petrie)" }
    },
  },
  "Cambridge 13 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "ignorant about ideas they should consider", th: "ไม่รู้เรื่องแนวคิดที่ควรจะศึกษา" },
        passagePhrase: { en: "oblivious to the vast philosophical literature", th: "ไม่รับรู้ถึงงานเขียนทางปรัชญาจำนวนมหาศาล" },
        pairs: [
          { q: "ignorant about", p: "oblivious to", th: "ไม่รู้ / ไม่รับรู้", note: "oblivious = ignorant ผู้เขียนบอกว่านักจิตวิทยาเชิงบวกไม่รับรู้งานปรัชญาที่ควรศึกษา จึงตอบ D" },
          { q: "the ideas they should be considering", p: "the vast philosophical literature", th: "งานเขียนทางปรัชญาที่ควรพิจารณา" },
          { q: "advocates of positive psychology", p: "advocates of positive psychology", th: "ผู้สนับสนุนจิตวิทยาเชิงบวก" },
        ],
        keyVocab: { word: "oblivious", th: "ไม่รับรู้ / ไม่ตระหนัก", note: "oblivious = ignorant ผู้เขียนบอกว่านักจิตวิทยาเชิงบวกไม่รู้เรื่องวรรณกรรมปรัชญาที่ควรศึกษา จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "happiness may be more than pleasure and absence of pain", th: "ความสุขอาจเป็นมากกว่าแค่ความเพลิดเพลินและการไร้ความเจ็บปวด" },
        passagePhrase: { en: "Aristotle identified happiness with self-realisation", th: "อริสโตเติลมองว่าความสุขคือการบรรลุศักยภาพของตน" },
        pairs: [
          { q: "may not be just pleasure and the absence of pain", p: "the human good consists of pleasure and the absence of pain", th: "ไม่ใช่แค่ความเพลิดเพลินและการไร้ความเจ็บปวด", note: "อริสโตเติลมองความสุขเป็น self-realisation ซึ่งต่างจาก Bentham ที่ว่าเป็นแค่ pleasure กับการไร้ความเจ็บปวด จึงตอบ A" },
          { q: "happiness", p: "identified happiness with self-realisation", th: "ความสุข = การบรรลุศักยภาพของตน" },
          { q: "Aristotle", p: "The Greek philosopher Aristotle", th: "อริสโตเติล นักปรัชญากรีก" },
        ],
        keyVocab: { word: "self-realisation", th: "การบรรลุศักยภาพ/การเข้าใจตัวเอง", contrastA: "pleasure . ความเพลิดเพลิน", contrastB: "self-realisation . การบรรลุศักยภาพ", note: "อริสโตเติลเสนอความสุขแบบ self-realisation ซึ่งต่างจากนิยามของ Bentham ที่ว่าเป็นแค่ pleasure กับการไร้ความเจ็บปวด จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "connection between work and psychology", th: "การเชื่อมโยงระหว่างการทำงานกับจิตวิทยา" },
        passagePhrase: { en: "entangling of psychological research and capitalism", th: "การผูกโยงงานวิจัยจิตวิทยาเข้ากับระบบทุนนิยม" },
        pairs: [
          { q: "a connection between work and psychology", p: "entangling of psychological research and capitalism", th: "การผูกโยงจิตวิทยาเข้ากับเศรษฐกิจ/ธุรกิจ", note: "Bentham ผูกเงินเข้ากับประสบการณ์ภายใน ทำให้จิตวิทยาพัวพันกับทุนนิยมและธุรกิจ จึงตอบ B" },
          { q: "linking the price of goods to happiness", p: "associating money so closely to inner experience", th: "เชื่อมเงิน/ราคาเข้ากับความรู้สึกภายใน" },
          { q: "significant", p: "set the stage for", th: "สำคัญ / เป็นการปูทาง" },
        ],
        keyVocab: { word: "entangling", th: "การผูกโยง/พัวพันเข้าด้วยกัน", note: "การที่ Bentham ผูกเงินเข้ากับประสบการณ์ภายในทำให้จิตวิทยาพัวพันกับทุนนิยมและการทำธุรกิจ จึงตอบ B (เชื่อมงานกับจิตวิทยา)" }
    },
    30: {
        questionPhrase: { en: "technology to improve … for government departments", th: "เทคโนโลยีเพื่อปรับปรุง … ให้แก่หน่วยงานรัฐ" },
        passagePhrase: { en: "departments of government be linked together through 'conversation tubes'", th: "ให้หน่วยงานรัฐเชื่อมต่อกันผ่าน 'ท่อสนทนา'" },
        pairs: [
          { q: "communication", p: "linked together through a set of 'conversation tubes'", th: "การสื่อสาร (เชื่อมต่อกันผ่าน 'ท่อสนทนา')", note: "'conversation tubes' ที่เชื่อมหน่วยงานเข้าด้วยกัน = การสื่อสาร จึงเติม F (communication)" },
          { q: "technology to improve", p: "a set of 'conversation tubes'", th: "เทคโนโลยีเพื่อปรับปรุง" },
          { q: "government departments", p: "the departments of government", th: "หน่วยงานของรัฐ" },
        ],
        keyVocab: { word: "communication", th: "การสื่อสาร", note: "'conversation tubes' ที่เชื่อมหน่วยงานเข้าด้วยกัน = การสื่อสาร จึงเติมคำตอบ F (communication)" }
    },
    31: {
        questionPhrase: { en: "printing banknotes to increase …", th: "การพิมพ์ธนบัตรเพื่อเพิ่ม …" },
        passagePhrase: { en: "a printing device that could produce unforgeable banknotes", th: "เครื่องพิมพ์ที่ผลิตธนบัตรปลอมแปลงไม่ได้" },
        pairs: [
          { q: "security", p: "unforgeable", th: "ความปลอดภัย/มั่นคง (ปลอมแปลงไม่ได้)", note: "ธนบัตรที่ปลอมแปลงไม่ได้ = ความปลอดภัย จึงเติม B (security)" },
          { q: "printing banknotes", p: "a printing device that could produce unforgeable", th: "การพิมพ์ธนบัตร" },
        ],
        keyVocab: { word: "unforgeable", th: "ปลอมแปลงไม่ได้", note: "ธนบัตรที่ปลอมแปลงไม่ได้ = ความปลอดภัย/ความมั่นคง จึงเติมคำตอบ B (security)" }
    },
    32: {
        questionPhrase: { en: "designed a device to keep food fresh", th: "ออกแบบอุปกรณ์ที่เก็บอาหารให้สดใหม่" },
        passagePhrase: { en: "a 'frigidarium' to keep provisions … fresh", th: "'frigidarium' เพื่อเก็บเสบียงให้สดใหม่" },
        pairs: [
          { q: "preservation", p: "to keep provisions such as meat, fish, fruit and vegetables fresh", th: "การถนอม/เก็บรักษาให้สดใหม่", note: "การเก็บเนื้อ ปลา ผลไม้ ผักให้สด = การถนอมรักษา จึงเติม G (preservation)" },
          { q: "designed", p: "He drew up plans for a 'frigidarium'", th: "ออกแบบ / ร่างแบบ" },
        ],
        keyVocab: { word: "keep … fresh", th: "เก็บรักษาให้สดใหม่", note: "การเก็บเนื้อ ปลา ผลไม้ ผักให้สด = การถนอม/ถนอมรักษา จึงเติมคำตอบ G (preservation)" }
    },
    33: {
        questionPhrase: { en: "prison design allowed the … of prisoners", th: "การออกแบบคุกทำให้สามารถ … นักโทษได้" },
        passagePhrase: { en: "visible at all times to the guards", th: "มองเห็นได้ตลอดเวลาโดยผู้คุม" },
        pairs: [
          { q: "observation", p: "visible at all times to the guards", th: "การเฝ้าสังเกต (มองเห็นได้ตลอดเวลา)", note: "นักโทษถูกมองเห็นตลอดเวลา = การเฝ้าสังเกต จึงเติม E (observation)" },
          { q: "prison design", p: "design for a prison to be known as a 'Panopticon'", th: "การออกแบบคุก" },
          { q: "prisoners", p: "prisoners would be kept in solitary confinement", th: "นักโทษ" },
        ],
        keyVocab: { word: "visible at all times", th: "มองเห็นได้ตลอดเวลา", note: "นักโทษถูกมองเห็นตลอดเวลา = การเฝ้าสังเกต จึงเติมคำตอบ E (observation)" }
    },
    34: {
        questionPhrase: { en: "pulse rate or money as a standard", th: "อัตราชีพจรหรือเงินเป็นมาตรฐานวัด" },
        passagePhrase: { en: "If happiness is to be regarded as a science, it has to be measured", th: "ถ้าจะถือว่าความสุขเป็นศาสตร์ ก็ต้องวัดได้" },
        pairs: [
          { q: "measurement", p: "it has to be measured", th: "การวัดค่า / หาปริมาณ", note: "Bentham เสนอวิธีวัดความสุข (ชีพจร/เงิน) = การวัดค่า จึงเติม A (measurement)" },
          { q: "pulse rate", p: "measuring the human pulse rate", th: "อัตราชีพจร" },
          { q: "money as a standard", p: "money could be used as the standard for quantification", th: "ใช้เงินเป็นมาตรฐานวัด" },
        ],
        keyVocab: { word: "measured / quantified", th: "วัด/หาปริมาณ", note: "Bentham เสนอวิธีวัดความสุข (ชีพจร/เงิน) = การวัดค่า จึงเติมคำตอบ A (measurement)" }
    },
    35: {
        questionPhrase: { en: "discussion of psychology and economics relationship", th: "การพูดถึงความสัมพันธ์ระหว่างจิตวิทยากับเศรษฐศาสตร์" },
        passagePhrase: { en: "science of happiness has become integral to capitalism", th: "ศาสตร์แห่งความสุขกลายเป็นส่วนสำคัญของทุนนิยม" },
        pairs: [
          { q: "One strength", p: "One of the virtues", th: "จุดเด่น / ข้อดี", note: "หนังสืออธิบายว่าจิตวิทยา (science of happiness) ผูกกับเศรษฐกิจ (capitalism) อย่างไร ตรงกับข้อความ จึงตอบ YES" },
          { q: "the relationship between psychology and economics", p: "science of happiness has become integral to capitalism", th: "ความสัมพันธ์ระหว่างจิตวิทยากับเศรษฐศาสตร์" },
          { q: "discussion", p: "describes how", th: "การพูดถึง / อธิบาย" },
        ],
        keyVocab: { word: "integral to capitalism", th: "เป็นส่วนสำคัญของทุนนิยม", note: "หนังสืออธิบายว่าจิตวิทยา (science of happiness) ผูกกับเศรษฐกิจ (capitalism) อย่างไร ตรงกับข้อความ จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "some emotions are harder to measure than others", th: "อารมณ์บางอย่างวัดยากกว่าอย่างอื่น" },
        passagePhrase: { en: "allows their happiness to be measured", th: "ทำให้ความสุขของพวกเขาถูกวัดได้" },
        pairs: [
          { q: "measure", p: "allows their happiness to be measured", th: "วัด / วัดค่า", note: "บทความพูดถึงการวัดความสุข แต่ไม่เคยเปรียบเทียบว่าอารมณ์ใดวัดยากกว่ากัน ไม่มีข้อมูล จึงตอบ NOT GIVEN" },
          { q: "some emotions", p: "what makes people happy", th: "อารมณ์ / ความรู้สึก" },
        ],
        keyVocab: { word: "more difficult to measure", th: "วัดได้ยากกว่า", note: "บทความพูดถึงการวัดความสุขแต่ไม่เคยเปรียบเทียบว่าอารมณ์ใดวัดยากกว่ากัน ไม่มีข้อมูล จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "supported by research on humans before 1915", th: "มีงานวิจัยกับมนุษย์รองรับก่อนปี 1915" },
        passagePhrase: { en: "had never even studied a single human being … experiments on white rats", th: "ไม่เคยศึกษามนุษย์เลยแม้แต่คนเดียว … ทดลองกับหนูขาว" },
        pairs: [
          { q: "research on humans", p: "never even studied a single human being", th: "งานวิจัยกับมนุษย์", note: "Watson ไม่เคยศึกษามนุษย์เลย มีแต่ทดลองหนูขาว ขัดแย้งกับข้อความ จึงตอบ NO" },
          { q: "supported by research", p: "research had been confined to experiments on white rats", th: "มีงานวิจัยรองรับ (จริงๆ ทำแต่กับหนูขาว)" },
          { q: "before 1915", p: "When he became president of the American Psychological Association in 1915", th: "ก่อนปี 1915" },
        ],
        keyVocab: { word: "never … a single human being", th: "ไม่เคยศึกษามนุษย์เลยแม้แต่คนเดียว", contrastA: "research on humans . วิจัยกับมนุษย์", contrastB: "experiments on white rats . ทดลองกับหนูขาว", note: "Watson ไม่เคยศึกษามนุษย์เลย มีแต่ทดลองหนูขาว ขัดแย้งกับข้อความที่ว่ามีวิจัยมนุษย์รองรับ จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "most influential on governments outside America", th: "มีอิทธิพลมากที่สุดต่อรัฐบาลนอกอเมริกา" },
        passagePhrase: { en: "in Britain, a 'Behaviour Insights Team' has been established", th: "ในอังกฤษมีการตั้ง 'ทีมข้อมูลเชิงพฤติกรรม'" },
        pairs: [
          { q: "governments outside America", p: "in Britain, a 'Behaviour Insights Team' has been established by the government", th: "รัฐบาลนอกอเมริกา (อังกฤษ)", note: "บทความบอกว่าอังกฤษนำไปใช้ แต่ไม่เคยเปรียบเทียบว่ามีอิทธิพล 'มากที่สุด' นอกอเมริกา ไม่มีข้อมูลเทียบ จึงตอบ NOT GIVEN" },
          { q: "Watson’s ideas", p: "Watson's reductive model is now widely applied", th: "แนวคิดของวัตสัน" },
        ],
        keyVocab: { word: "most influential", th: "มีอิทธิพลมากที่สุด", note: "บทความบอกว่าอังกฤษนำไปใช้ แต่ไม่เคยเปรียบเทียบว่ามีอิทธิพล 'มากที่สุด' นอกอเมริกา ไม่มีข้อมูลเทียบ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "need for happiness is linked to industrialisation", th: "ความต้องการความสุขเชื่อมโยงกับการพัฒนาอุตสาหกรรม" },
        passagePhrase: { en: "Modern industrial societies appear to need … ever-increasing happiness", th: "สังคมอุตสาหกรรมสมัยใหม่ดูเหมือนต้องการความสุขที่เพิ่มขึ้นเรื่อยๆ" },
        pairs: [
          { q: "industrialisation", p: "Modern industrial societies", th: "การพัฒนาอุตสาหกรรม / สังคมอุตสาหกรรม", note: "ผู้เขียนบอกว่าสังคมอุตสาหกรรมต้องการความสุขมากระตุ้นการทำงาน ตรงกับข้อความ จึงตอบ YES" },
          { q: "The need for happiness", p: "need the possibility of ever-increasing happiness", th: "ความต้องการความสุข" },
        ],
        keyVocab: { word: "industrial societies", th: "สังคมอุตสาหกรรม", note: "ผู้เขียนบอกว่าสังคมอุตสาหกรรม (industrialisation) ต้องการความสุขมากระตุ้นการทำงาน ตรงกับข้อความ จึงตอบ YES" }
    },
    40: {
        questionPhrase: { en: "government should aim to increase happiness", th: "รัฐบาลควรมีเป้าหมายเพิ่มความสุขให้ประชาชน" },
        passagePhrase: { en: "the idea that governments should be responsible for promoting happiness is always a threat to human freedom", th: "แนวคิดที่ว่ารัฐบาลควรส่งเสริมความสุขเป็นภัยต่อเสรีภาพเสมอ" },
        pairs: [
          { q: "A main aim of government should be to increase the happiness", p: "governments should be responsible for promoting happiness is always a threat to human freedom", th: "รัฐบาลควรมีหน้าที่เพิ่ม/ส่งเสริมความสุข", note: "ผู้เขียนเห็นว่าการให้รัฐส่งเสริมความสุขเป็นภัยต่อเสรีภาพ จึงไม่เห็นด้วย ตอบ NO" },
          { q: "the happiness of the population", p: "promoting happiness", th: "ความสุขของประชาชน" },
        ],
        keyVocab: { word: "threat to human freedom", th: "ภัยต่อเสรีภาพของมนุษย์", note: "ผู้เขียนเห็นว่าการให้รัฐส่งเสริมความสุขเป็นภัยต่อเสรีภาพ จึงไม่เห็นด้วยกับข้อความ ตอบ NO" }
    },
  },
  "Cambridge 14 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "know what would encourage good staff to remain", th: "รู้ว่าอะไรจะทำให้พนักงานเก่งอยู่ต่อ" },
        passagePhrase: { en: "understand what practices are most favorable to increase employee retention", th: "เข้าใจว่าแนวปฏิบัติใดดีที่สุดในการเพิ่มการรักษาพนักงานไว้" },
        pairs: [
          { q: "Hotel managers", p: "hotel managers", th: "ผู้จัดการโรงแรม" },
          { q: "need to know", p: "beneficial for hotel managers to understand", th: "จำเป็นต้องเข้าใจ/รู้" },
          { q: "encourage good staff to remain", p: "increase employee satisfaction and retention", th: "ทำให้พนักงานเก่งอยู่ต่อ", note: "remain (อยู่ต่อ) ตรงกับ retention ในประโยคของ Enz and Siguaw คำตอบจึงเป็น E" },
        ],
        keyVocab: { word: "retention", th: "การรักษา (พนักงาน) ให้อยู่ต่อ", note: "คำว่า remain (อยู่ต่อ) ในโจทย์ตรงกับ retention ในประโยคของ Enz and Siguaw ทำให้คำตอบคือ E" }
    },
    28: {
        questionPhrase: { en: "make staff feel they shouldn't move to a different employer", th: "ทำให้พนักงานรู้สึกว่าไม่ควรย้ายไปอยู่ที่อื่น" },
        passagePhrase: { en: "employees feel more obligated to stay with the company", th: "พนักงานรู้สึกผูกพันที่จะอยู่กับบริษัทมากขึ้น" },
        pairs: [
          { q: "The actions of managers", p: "managers provide recognition to employees", th: "การกระทำของผู้จัดการ" },
          { q: "shouldn't move to a different employer", p: "feel more obligated to stay with the company", th: "ไม่ควรย้ายไปอยู่นายจ้างอื่น", note: "shouldn't move (ไม่ควรย้าย) คือการพูดอีกแบบของ obligated to stay ซึ่งเป็นคำของ Ng and Sorensen คำตอบคือ D" },
        ],
        keyVocab: { word: "feel more obligated to stay", th: "รู้สึกผูกพันที่จะอยู่ต่อ", note: "shouldn't move (ไม่ควรย้าย) คือการพูดอีกแบบของ obligated to stay ซึ่งเป็นคำของ Ng and Sorensen คำตอบจึงเป็น D" }
    },
    29: {
        questionPhrase: { en: "little is done to help workers improve their skills", th: "แทบไม่มีการช่วยให้พนักงานพัฒนาทักษะ" },
        passagePhrase: { en: "dominated by underdeveloped HR practices", th: "ถูกครอบงำด้วยแนวปฏิบัติ HR ที่ด้อยพัฒนา" },
        pairs: [
          { q: "Little is done", p: "underdeveloped HR practices", th: "แทบไม่มีการทำ/ด้อยพัฒนา", note: "little is done to improve skills สื่อความเดียวกับ underdeveloped HR practices ซึ่งเป็นข้อสังเกตของ Lucas คำตอบคือ B" },
          { q: "the hospitality industry", p: "the hospitality industry", th: "อุตสาหกรรมการบริการ/โรงแรม" },
          { q: "help workers improve their skills", p: "underdeveloped HR practices", th: "ช่วยพนักงานพัฒนาทักษะ" },
        ],
        keyVocab: { word: "underdeveloped HR practices", th: "แนวปฏิบัติด้านบุคลากรที่ด้อยพัฒนา", note: "little is done to improve skills สื่อความเดียวกับ underdeveloped HR practices ซึ่งเป็นข้อสังเกตของ Lucas คำตอบคือ B" }
    },
    30: {
        questionPhrase: { en: "less likely to change jobs if cooperation is encouraged", th: "ย้ายงานน้อยลงหากส่งเสริมการร่วมมือกัน" },
        passagePhrase: { en: "motivate employees to work together ... feel more obligated to stay", th: "กระตุ้นให้พนักงานทำงานร่วมกัน ... รู้สึกผูกพันที่จะอยู่ต่อ" },
        pairs: [
          { q: "less likely to change jobs", p: "feel more obligated to stay with the company", th: "ย้ายงานน้อยลง/อยู่ต่อ", note: "change jobs less ตรงกับ obligated to stay ของ Ng and Sorensen คำตอบคือ D" },
          { q: "cooperation is encouraged", p: "motivate employees to work together", th: "ส่งเสริมการร่วมมือกัน" },
        ],
        keyVocab: { word: "work together", th: "ทำงานร่วมกัน", note: "cooperation (การร่วมมือ) ตรงกับ work together และ change jobs less ตรงกับ obligated to stay ของ Ng and Sorensen คำตอบคือ D" }
    },
    31: {
        questionPhrase: { en: "pay is not the only reason workers change jobs", th: "ค่าจ้างไม่ใช่เหตุผลเดียวที่พนักงานย้ายงาน" },
        passagePhrase: { en: "many cited reasons are low compensation, inadequate benefits, poor working conditions", th: "เหตุผลที่ถูกอ้างมีหลายอย่าง เช่น ค่าตอบแทนต่ำ สวัสดิการไม่พอ สภาพการทำงานแย่" },
        pairs: [
          { q: "Dissatisfaction with pay", p: "low compensation", th: "ค่าจ้าง/ค่าตอบแทนต่ำ" },
          { q: "not the only reason", p: "Among the many cited reasons", th: "ไม่ใช่เหตุผลเดียว/มีหลายเหตุผล", note: "not the only reason สื่อว่ามีหลายสาเหตุ ตรงกับ many cited reasons ของ Maroudas et al. คำตอบคือ C" },
          { q: "hospitality workers change jobs", p: "poor working conditions", th: "พนักงานบริการย้ายงาน" },
        ],
        keyVocab: { word: "many cited reasons", th: "เหตุผลที่ถูกอ้างถึงหลายอย่าง", note: "not the only reason สื่อว่ามีหลายสาเหตุ ตรงกับ many reasons นอกเหนือจาก compensation ที่ Maroudas et al. ระบุไว้ คำตอบคือ C" }
    },
    32: {
        questionPhrase: { en: "high staff turnover ... is poor morale", th: "อัตราการลาออกสูงมีสาเหตุจากขวัญกำลังใจที่ตกต่ำ" },
        passagePhrase: { en: "compromised employee morale and attitudes", th: "ขวัญกำลังใจและทัศนคติของพนักงานที่เสื่อมลง" },
        pairs: [
          { q: "high staff turnover", p: "high employee turnover", th: "อัตราการลาออกสูง" },
          { q: "poor morale", p: "compromised employee morale", th: "ขวัญกำลังใจตกต่ำ", note: "poor morale ในโจทย์ตรงกับ compromised morale ที่ระบุเป็นเหตุของ turnover ข้อความจึงตรงกับผู้เขียน ตอบ YES" },
        ],
        keyVocab: { word: "compromised morale", th: "ขวัญกำลังใจที่เสื่อม/ลดลง", note: "poor morale ในโจทย์ตรงกับ compromised morale ที่ระบุเป็นเหตุของ turnover ข้อความจึงตรงกับผู้เขียน ตอบ YES" }
    },
    33: {
        questionPhrase: { en: "staff have a tendency to dislike their workplace", th: "พนักงานมีแนวโน้มจะไม่ชอบที่ทำงานของตน" },
        passagePhrase: { en: "many people will find something to complain about ... workplace", th: "หลายคนจะหาเรื่องบ่นเกี่ยวกับที่ทำงานของตน" },
        pairs: [
          { q: "dislike their workplace", p: "find something to complain about in relation to their workplace", th: "ไม่ชอบที่ทำงาน (vs แค่หาเรื่องบ่น)", note: "ผู้เขียนบอกว่าคนหาเรื่องบ่นได้ ไม่ได้บอกว่าพนักงาน dislike ที่ทำงานจริง บ่นไม่เท่ากับไม่ชอบ จึงตอบ NO" },
          { q: "their workplace", p: "their workplace", th: "ที่ทำงานของพวกเขา" },
        ],
        keyVocab: { word: "find something to complain about", th: "หาเรื่องบ่น/ตำหนิ", contrastA: "complain . บ่นเป็นครั้งคราว", contrastB: "dislike . ไม่ชอบเป็นนิสัย", note: "ผู้เขียนบอกว่าคนหาเรื่องบ่นได้ ไม่ได้บอกว่าพนักงาน dislike (เกลียด) ที่ทำงานจริง บ่นไม่เท่ากับไม่ชอบ จึงตอบ NO" }
    },
    34: {
        questionPhrase: { en: "better working conditions and job security makes staff satisfied", th: "สภาพการทำงานและความมั่นคงที่ดีขึ้นทำให้พนักงานพึงพอใจ" },
        passagePhrase: { en: "does not result in satisfaction, but only in the reduction of dissatisfaction", th: "ไม่ก่อให้เกิดความพึงพอใจ แต่เพียงลดความไม่พอใจเท่านั้น" },
        pairs: [
          { q: "working conditions and job security", p: "working conditions and job security", th: "สภาพการทำงานและความมั่นคงในงาน" },
          { q: "makes staff satisfied", p: "does not result in satisfaction, but only in the reduction of dissatisfaction", th: "ทำให้พนักงานพึงพอใจ (ขัดกับบท)", note: "ผู้เขียนบอกว่าปัจจัยเหล่านี้แค่ลด dissatisfaction ไม่ได้สร้าง satisfaction จึงขัดกับโจทย์ ตอบ NO" },
        ],
        keyVocab: { word: "reduction of dissatisfaction", th: "การลดความไม่พอใจ", contrastA: "satisfaction . ความพึงพอใจ", contrastB: "reduction of dissatisfaction . แค่ลดความไม่พอใจ", note: "ผู้เขียนบอกว่าปัจจัยเหล่านี้แค่ลด dissatisfaction ไม่ได้สร้าง satisfaction จึงขัดกับโจทย์ที่ว่าทำให้ satisfied ตอบ NO" }
    },
    35: {
        questionPhrase: { en: "staff should choose when they take breaks", th: "พนักงานควรได้เลือกเวลาพักเอง" },
        passagePhrase: { en: "allowing adequate breaks during the working day", th: "ให้มีช่วงพักที่เพียงพอระหว่างวันทำงาน" },
        pairs: [
          { q: "take breaks during the working day", p: "adequate breaks during the working day", th: "พักระหว่างวันทำงาน" },
          { q: "Staff should be allowed to choose when", p: "allowing adequate breaks during the working day", th: "พนักงานควรเลือกเวลาพักเอง (ไม่มีในบท)", note: "ผู้เขียนพูดถึง 'มีเวลาพักเพียงพอ' แต่ไม่ได้บอกว่าพนักงานควรเลือกเวลาพักเอง จึงไม่มีข้อมูลเรื่องการเลือก ตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "adequate breaks", th: "ช่วงพักที่เพียงพอ", note: "ผู้เขียนพูดถึง 'มีเวลาพักเพียงพอ' แต่ไม่ได้บอกว่าพนักงานควรเลือกเวลาพักเอง จึงไม่มีข้อมูลเรื่องการเลือก ตอบ NOT GIVEN" }
    },
    36: {
        questionPhrase: { en: "research on staff in an American chain of ___", th: "วิจัยพนักงานในเครือ ___ ของอเมริกา" },
        passagePhrase: { en: "a chain of themed restaurants in the United States", th: "เครือร้านอาหารธีมต่าง ๆ ในสหรัฐอเมริกา" },
        pairs: [
          { q: "research on staff", p: "conducted a study focusing on staff", th: "งานวิจัยเกี่ยวกับพนักงาน" },
          { q: "an American chain of", p: "a chain of themed restaurants in the United States", th: "เครือ ___ ของอเมริกา", note: "ช่องว่างหลัง 'chain of' ต้องเป็นสถานที่ที่ศึกษา ในบทคือ themed restaurants คำตอบคือ restaurants" },
        ],
        keyVocab: { word: "restaurants", th: "ร้านอาหาร", note: "ช่องว่างหลัง 'chain of' ต้องเป็นสถานที่ที่ศึกษา ในบทคือ themed restaurants คำตอบคือ restaurants" }
    },
    37: {
        questionPhrase: { en: "fun activities improved their ___", th: "กิจกรรมสนุก ๆ ช่วยพัฒนา ___ ของพวกเขา" },
        passagePhrase: { en: "fun activities had a favorable impact on performance", th: "กิจกรรมสนุกส่งผลดีต่อผลการปฏิบัติงาน" },
        pairs: [
          { q: "activities designed for staff to have fun", p: "fun activities", th: "กิจกรรมให้พนักงานสนุก" },
          { q: "improved their", p: "favorable impact on performance", th: "ช่วยพัฒนา ___ ให้ดีขึ้น", note: "improved (ทำให้ดีขึ้น) ตรงกับ favorable impact on performance คำตอบคือ performance" },
        ],
        keyVocab: { word: "performance", th: "ผลการปฏิบัติงาน", note: "improved (ทำให้ดีขึ้น) ตรงกับ favorable impact on performance ในบท คำตอบคือ performance" }
    },
    38: {
        questionPhrase: { en: "management involvement led to lower staff ___", th: "การมีส่วนร่วมของฝ่ายบริหารทำให้ ___ ของพนักงานลดลง" },
        passagePhrase: { en: "manager support for fun had a favorable impact in reducing turnover", th: "การสนับสนุนของผู้จัดการช่วยลดอัตราการลาออก" },
        pairs: [
          { q: "management involvement", p: "manager support for fun", th: "การมีส่วนร่วมของฝ่ายบริหาร" },
          { q: "led to lower staff", p: "favorable impact in reducing turnover", th: "ทำให้ ___ ของพนักงานลดลง", note: "lower staff ___ ตรงกับ reducing turnover คำตอบคือ turnover" },
        ],
        keyVocab: { word: "turnover", th: "อัตราการลาออก/เปลี่ยนงาน", note: "lower staff ___ ตรงกับ reducing turnover และ management involvement ตรงกับ manager support คำตอบคือ turnover" }
    },
    39: {
        questionPhrase: { en: "activities needed to fit with the company's ___", th: "กิจกรรมต้องสอดคล้องกับ ___ ของบริษัท" },
        passagePhrase: { en: "aligned with both organizational goals", th: "สอดคล้องกับเป้าหมายขององค์กร" },
        pairs: [
          { q: "fit with", p: "aligned with", th: "สอดคล้องกับ" },
          { q: "the company's", p: "organizational goals", th: "ของบริษัท/องค์กร", note: "fit with ตรงกับ aligned with และ company's ตรงกับ organizational คำตอบคือ goals" },
        ],
        keyVocab: { word: "goals", th: "เป้าหมาย", note: "fit with (สอดคล้อง) ตรงกับ aligned with และ company's ตรงกับ organizational คำตอบคือ goals" }
    },
    40: {
        questionPhrase: { en: "fit with ... the ___ of the staff", th: "สอดคล้องกับ ___ ของพนักงาน" },
        passagePhrase: { en: "aligned with ... employee characteristics", th: "สอดคล้องกับคุณลักษณะของพนักงาน" },
        pairs: [
          { q: "fit with", p: "aligned with", th: "สอดคล้องกับ" },
          { q: "of the staff", p: "employee characteristics", th: "ของพนักงาน", note: "the ___ of the staff ตรงกับ employee characteristics ในบท คำตอบคือ characteristics" },
        ],
        keyVocab: { word: "characteristics", th: "คุณลักษณะ/ลักษณะเฉพาะ", note: "the ___ of the staff ตรงกับ employee characteristics ในบท คำตอบคือ characteristics" }
    },
  },
  "Cambridge 14 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "What people are increasingly expected to do", th: "สิ่งที่ผู้คนถูกคาดหวังให้ทำมากขึ้นเรื่อยๆ" },
        passagePhrase: { en: "We are told that we ought to organise our company, our home life", th: "เราถูกบอกว่าควรจัดระเบียบบริษัทและชีวิตในบ้านของเรา" },
        pairs: [
          { q: "people are increasingly expected to do", p: "We are told that we ought to", th: "สิ่งที่คนถูกบอก/คาดหวังให้ทำ", note: "'are told that we ought to' = สิ่งที่ผู้คนถูกคาดหวังให้ทำ ตรงหัวข้อ vi" },
          { q: "What people", p: "organise our company, our home life", th: "จัดระเบียบบริษัทและชีวิตของผู้คน" },
        ],
        keyVocab: { word: "ought to organise", th: "ควรจะจัดระเบียบ", note: "วลี 'are told that we ought to' = สิ่งที่คนถูกคาดหวังให้ทำ ตรงกับหัวข้อ vi จึงตอบ vi" }
    },
    28: {
        questionPhrase: { en: "Complaints about the impact of a certain approach", th: "เสียงบ่นต่อผลกระทบของแนวทางหนึ่ง" },
        passagePhrase: { en: "workers claim to be dissatisfied with the way their work is structured", th: "พนักงานบอกว่าไม่พอใจกับวิธีจัดโครงสร้างงานของตน" },
        pairs: [
          { q: "Complaints", p: "dissatisfied", th: "เสียงบ่น / ความไม่พอใจ", note: "'dissatisfied' = การร้องเรียน (complaints) จึงตอบ i" },
          { q: "the impact of a certain approach", p: "the way their work is structured and the way they are managed", th: "ผลของแนวทางการจัดโครงสร้างและการบริหารงาน" },
        ],
        keyVocab: { word: "dissatisfied", th: "ไม่พอใจ", note: "'dissatisfied / claim' = การร้องเรียน (complaints) ต่อผลของการจัดระเบียบ จึงตอบ i" }
    },
    29: {
        questionPhrase: { en: "Early recommendations concerning business activities", th: "ข้อแนะนำยุคแรกเกี่ยวกับการดำเนินธุรกิจ" },
        passagePhrase: { en: "he designed a number of principles to improve the efficiency of the work process", th: "เขาออกแบบหลักการหลายข้อเพื่อเพิ่มประสิทธิภาพของกระบวนการทำงาน" },
        pairs: [
          { q: "Early recommendations", p: "principles", th: "ข้อแนะนำ / หลักการ", note: "Taylor เขียนในต้นศตวรรษที่ 20 และ 'principles' = recommendations จึงตอบ iii" },
          { q: "business activities", p: "the work process", th: "การดำเนินงาน / กระบวนการทำงาน" },
        ],
        keyVocab: { word: "principles", th: "หลักการ / ข้อแนะนำ", note: "Taylor เขียนในต้นศตวรรษที่ 20 (early) และ 'principles' = recommendations จึงตอบ iii" }
    },
    30: {
        questionPhrase: { en: "Fundamental beliefs that are in fact incorrect", th: "ความเชื่อพื้นฐานที่จริงๆ แล้วผิด" },
        passagePhrase: { en: "the assumption that order is a necessary condition for productivity", th: "ข้อสมมติว่าความเป็นระเบียบเป็นเงื่อนไขจำเป็นต่อผลิตภาพ" },
        pairs: [
          { q: "Fundamental beliefs", p: "assumptions", th: "ความเชื่อพื้นฐาน / ข้อสมมติ", note: "'assumptions' = fundamental beliefs และ 'misguided' = incorrect จึงตอบ ii" },
          { q: "in fact incorrect", p: "misguided", th: "ผิด / เข้าใจผิด" },
        ],
        keyVocab: { word: "assumption", th: "ข้อสมมติ / ความเชื่อพื้นฐาน", note: "'assumption' = fundamental belief และ 'misguided' = incorrect จึงตอบ ii" }
    },
    31: {
        questionPhrase: { en: "Approach can have more disadvantages than advantages", th: "แนวทางที่อาจมีข้อเสียมากกว่าข้อดี" },
        passagePhrase: { en: "order actually has diminishing returns", th: "ความเป็นระเบียบให้ผลตอบแทนที่ลดน้อยถอยลง" },
        pairs: [
          { q: "more disadvantages than advantages", p: "diminishing returns", th: "ผลตอบแทนที่ลดลง (ข้อเสียเริ่มมากกว่าข้อดี)", note: "'diminishing returns' และ 'further increase in order reduces productivity' = ข้อเสียมากกว่าข้อดี จึงตอบ ix" },
          { q: "a certain approach", p: "order", th: "แนวทางความเป็นระเบียบ" },
        ],
        keyVocab: { word: "diminishing returns", th: "ผลตอบแทนที่ลดลง", note: "'diminishing returns / further increase reduces productivity' = ข้อเสียเริ่มมากกว่าข้อดี จึงตอบ ix" }
    },
    32: {
        questionPhrase: { en: "How to achieve outcomes that are currently impossible", th: "วิธีบรรลุผลลัพธ์ที่ปัจจุบันเป็นไปไม่ได้" },
        passagePhrase: { en: "new solutions that under conventionally structured environments would never be reached", th: "ทางออกใหม่ที่สภาพแวดล้อมแบบมีโครงสร้างปกติไม่มีวันไปถึง" },
        pairs: [
          { q: "outcomes that are currently impossible", p: "would never be reached", th: "ผลลัพธ์ที่ปัจจุบันไปไม่ถึง", note: "'would never be reached' ในระบบเดิม = currently impossible แต่ทำได้ด้วยแนวทางใหม่ จึงตอบ vii" },
          { q: "How to achieve outcomes", p: "new solutions", th: "ทางออก / ผลลัพธ์ใหม่ที่บรรลุได้" },
        ],
        keyVocab: { word: "would never be reached", th: "ไม่มีวันบรรลุถึง", note: "'never be reached' ในระบบเดิม = currently impossible แต่ทำได้ด้วยแนวทางใหม่ จึงตอบ vii" }
    },
    33: {
        questionPhrase: { en: "Organisations that put a new approach into practice", th: "องค์กรที่นำแนวทางใหม่ไปใช้จริง" },
        passagePhrase: { en: "Oticon used what it called a 'spaghetti' structure to reduce rigid hierarchies", th: "Oticon ใช้โครงสร้างแบบ 'สปาเก็ตตี' เพื่อลดลำดับชั้นที่แข็งทื่อ" },
        pairs: [
          { q: "Organisations that put a new approach into practice", p: "Oticon, a large Danish manufacturer of hearing aids", th: "องค์กรจริงที่นำแนวทางใหม่ไปใช้", note: "ตัวอย่างบริษัทจริง (Oticon, GE, Google) ที่ใช้แนวทางไร้ระเบียบ = organisations in practice จึงตอบ iv" },
          { q: "a new approach", p: "‘spaghetti’ structure", th: "แนวทางใหม่ (โครงสร้างสปาเก็ตตี)" },
        ],
        keyVocab: { word: "Oticon / spaghetti structure", th: "บริษัท Oticon / โครงสร้างสปาเก็ตตี", note: "ตัวอย่างบริษัทจริง (Oticon, GE, Google) ที่ใช้แนวทางไร้ระเบียบ = organisations in practice จึงตอบ iv" }
    },
    34: {
        questionPhrase: { en: "Neither approach guarantees continuous improvement", th: "ทั้งสองแนวทางไม่รับประกันการพัฒนาต่อเนื่อง" },
        passagePhrase: { en: "disorder, much like order, also seems to have diminishing utility", th: "ความไร้ระเบียบก็เหมือนความเป็นระเบียบ คือมีประโยชน์ที่ลดน้อยลง" },
        pairs: [
          { q: "Neither approach", p: "disorder, much like order", th: "ทั้งสองแนวทาง (ความไร้ระเบียบเหมือนความเป็นระเบียบ)", note: "ทั้ง order และ disorder มี diminishing utility = ไม่มีฝ่ายใดประกันการพัฒนาตลอด จึงตอบ viii" },
          { q: "guarantees continuous improvement", p: "diminishing utility", th: "ประโยชน์ที่ลดลง (ไม่รับประกันการพัฒนาต่อเนื่อง)" },
        ],
        keyVocab: { word: "much like order", th: "เหมือนกับความเป็นระเบียบ", note: "ทั้ง order และ disorder ต่างมี diminishing utility = ไม่มีฝ่ายใดประกันการพัฒนาตลอด จึงตอบ viii" }
    },
    35: {
        questionPhrase: { en: "people who feel they are not ... enough", th: "คนที่รู้สึกว่าตนเองยังไม่... มากพอ" },
        passagePhrase: { en: "all as a means to becoming more productive", th: "ทั้งหมดเป็นวิธีเพื่อให้มีผลิตภาพมากขึ้น" },
        pairs: [
          { q: "people who feel they are not", p: "a paying public", th: "ผู้คนที่เป็นกลุ่มเป้าหมาย", note: "training มุ่งช่วยคนให้ 'more productive' ช่องว่างเติม productive" },
          { q: "Numerous training sessions", p: "countless seminars and workshops", th: "การอบรม / สัมมนาจำนวนมาก" },
          { q: "enough", p: "more productive", th: "ทำงานได้ผลดีมากพอ" },
        ],
        keyVocab: { word: "productive", th: "มีผลิตภาพ / ทำงานได้ผลดี", note: "training sessions มุ่งช่วยคนให้ 'more productive' ช่องว่างเติม productive" }
    },
    36: {
        questionPhrase: { en: "people who regard themselves as ...", th: "คนที่มองตัวเองว่าเป็น..." },
        passagePhrase: { en: "much to the delight of self-proclaimed perfectionists", th: "ทำให้พวกที่ประกาศตนเป็นนักนิยมความสมบูรณ์แบบยินดี" },
        pairs: [
          { q: "regard themselves as", p: "self-proclaimed", th: "มองตัวเองว่าเป็น / ประกาศตนเป็น", note: "'self-proclaimed' = regard themselves as ช่องว่างเติม perfectionists" },
          { q: "Being organised appeals to people", p: "much to the delight of", th: "สิ่งที่ทำให้คนเหล่านั้นพอใจ" },
        ],
        keyVocab: { word: "perfectionists", th: "นักนิยมความสมบูรณ์แบบ", note: "'self-proclaimed' = regard themselves as ช่องว่างเติม perfectionists" }
    },
    37: {
        questionPhrase: { en: "Many people feel ... with aspects of their work", th: "หลายคนรู้สึก...กับบางด้านของงานตน" },
        passagePhrase: { en: "workers claim to be dissatisfied with the way their work is structured", th: "พนักงานบอกว่าไม่พอใจกับวิธีจัดโครงสร้างงาน" },
        pairs: [
          { q: "feel", p: "claim to be", th: "รู้สึก / บอกว่า", note: "ข้อความตรงตัว 'dissatisfied with' ช่องว่างเติม dissatisfied" },
          { q: "with aspects of their work", p: "with the way their work is structured", th: "กับบางด้านของงานตน" },
        ],
        keyVocab: { word: "dissatisfied", th: "ไม่พอใจ", note: "ข้อความตรงตัว 'dissatisfied with' ช่องว่างเติม dissatisfied" }
    },
    38: {
        questionPhrase: { en: "aim at order without really considering its value", th: "มุ่งความเป็นระเบียบโดยไม่ได้พิจารณาคุณค่าของมันจริงๆ" },
        passagePhrase: { en: "organising for the sake of organising, rather than looking at the usefulness", th: "จัดระเบียบเพื่อจัดระเบียบ มากกว่าจะดูประโยชน์ของมัน" },
        pairs: [
          { q: "aim at order", p: "organising themselves for the sake of organising", th: "มุ่งจัดระเบียบเพื่อจัดระเบียบเอง", note: "'for the sake of organising, rather than looking at the usefulness' = ไม่พิจารณาคุณค่า จึงตอบ TRUE" },
          { q: "without really considering its value", p: "rather than actually looking at the end goal and usefulness", th: "โดยไม่ได้ดูประโยชน์/คุณค่าจริงๆ" },
        ],
        keyVocab: { word: "for the sake of organising", th: "เพื่อจัดระเบียบเอง (ไม่ได้มองประโยชน์)", note: "'for the sake of... rather than looking at usefulness' = ไม่พิจารณาคุณค่า ตรงกับข้อความ จึงตอบ TRUE" }
    },
    39: {
        questionPhrase: { en: "innovation best if people have distinct roles", th: "นวัตกรรมดีที่สุดถ้าคนมีบทบาทแยกชัดเจน" },
        passagePhrase: { en: "best approach is an environment devoid of structure and hierarchy", th: "แนวทางที่ดีที่สุดคือสภาพแวดล้อมที่ปราศจากโครงสร้างและลำดับชั้น" },
        pairs: [
          { q: "the people involved have distinct roles", p: "devoid of structure and hierarchy", th: "บทบาทแยกชัดเจน ขัดกับการไร้โครงสร้างและลำดับชั้น", note: "'distinct roles' ขัดกับ 'devoid of structure and hierarchy' โดยตรง จึงตอบ FALSE" },
          { q: "Innovation is most successful", p: "when innovating, the best approach", th: "นวัตกรรมที่ได้ผลดีที่สุด" },
        ],
        keyVocab: { word: "devoid of structure and hierarchy", th: "ปราศจากโครงสร้างและลำดับชั้น", contrastA: "distinct roles . บทบาทแยกชัดเจน", contrastB: "devoid of hierarchy . ไร้ลำดับชั้น", note: "'distinct roles' ขัดกับ 'devoid of structure/hierarchy' โดยตรง จึงตอบ FALSE" }
    },
    40: {
        questionPhrase: { en: "Google inspired by the success of General Electric", th: "Google ได้แรงบันดาลใจจากความสำเร็จของ General Electric" },
        passagePhrase: { en: "Google and other tech companies have embraced these flexible structures", th: "Google และบริษัทเทคอื่นๆ ได้นำโครงสร้างยืดหยุ่นเหล่านี้มาใช้" },
        pairs: [
          { q: "Google", p: "Google and a number of other tech companies", th: "Google และบริษัทเทคอื่นๆ", note: "บทความบอกว่า Google ใช้โครงสร้างยืดหยุ่น แต่ไม่เคยบอกว่าได้แรงบันดาลใจจาก GE จึงตอบ NOT GIVEN" },
          { q: "adopt flexibility", p: "embraced (at least in part) these kinds of flexible structures", th: "นำความยืดหยุ่นมาใช้" },
        ],
        keyVocab: { word: "embraced (no cause stated)", th: "นำมาใช้ (ไม่ได้ระบุสาเหตุ)", note: "บทความบอกว่า Google ใช้โครงสร้างยืดหยุ่น แต่ไม่เคยบอกว่าได้แรงบันดาลใจจาก GE จึงตอบ NOT GIVEN" }
    },
  },
  "Cambridge 14 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "divided into a number of separate categories", th: "ถูกแบ่งออกเป็นหมวดหมู่ที่แยกจากกันหลายประเภท" },
        passagePhrase: { en: "discrete descriptions of various types of play", th: "คำอธิบายที่แยกชัดเจนของการเล่นประเภทต่าง ๆ" },
        pairs: [
          { q: "divided into", p: "discrete descriptions", th: "แยกออกจากกัน" },
          { q: "a number of separate categories", p: "various types of play", th: "หลายประเภทที่แยกกัน", note: "'various types of play' ของ Miller & Almon คือ paraphrase ของ 'separate categories' จึงตอบ B" },
        ],
        keyVocab: { word: "discrete / various types", th: "แยกออกจากกัน / ประเภทต่าง ๆ", note: "คำว่า 'discrete...various types of play' คือ paraphrase ของ 'separate categories' ซึ่งอ้างถึง Miller & Almon จึงตอบ B" }
    },
    28: {
        questionPhrase: { en: "intended goals affect how they play with children", th: "เป้าหมายที่ตั้งใจไว้ส่งผลต่อวิธีที่ผู้ใหญ่เล่นกับเด็ก" },
        passagePhrase: { en: "adult's role in play varies as a function of their educational goals", th: "บทบาทของผู้ใหญ่ในการเล่นเปลี่ยนไปตามเป้าหมายทางการศึกษาของเขา" },
        pairs: [
          { q: "intended goals", p: "educational goals", th: "เป้าหมายที่ตั้งใจไว้" },
          { q: "affect how they play", p: "varies as a function of", th: "ส่งผลต่อวิธีการเล่น", note: "'varies as a function of their educational goals' ของ Hirsch-Pasek et al. = 'goals affect how they play' จึงตอบ G" },
          { q: "Adults", p: "adult's role", th: "ผู้ใหญ่" },
        ],
        keyVocab: { word: "varies as a function of goals", th: "เปลี่ยนแปลงตามเป้าหมาย", note: "'varies as a function of educational goals' = 'goals affect how they play' อ้างถึง Hirsch-Pasek et al. จึงตอบ G" }
    },
    29: {
        questionPhrase: { en: "combining work with play may be best for learning", th: "การผสมงานเข้ากับการเล่นอาจเป็นวิธีเรียนรู้ที่ดีที่สุด" },
        passagePhrase: { en: "hybrid forms of work and play provide optimal contexts for learning", th: "รูปแบบผสมของงานกับการเล่นให้บริบทที่ดีที่สุดสำหรับการเรียนรู้" },
        pairs: [
          { q: "Combining work with play", p: "hybrid forms of work and play", th: "การผสมงานเข้ากับการเล่น" },
          { q: "the best way", p: "optimal contexts", th: "วิธีที่ดีที่สุด", note: "'hybrid forms...provide optimal contexts for learning' ของ Joan Goodman = 'combining work with play is best for learning' จึงตอบ F" },
          { q: "for children to learn", p: "for learning", th: "เพื่อการเรียนรู้" },
        ],
        keyVocab: { word: "hybrid forms / optimal contexts", th: "รูปแบบผสม / บริบทที่ดีที่สุด", note: "'hybrid forms of work and play' = 'combining work with play' และ 'optimal' = 'best' อ้างถึง Joan Goodman จึงตอบ F" }
    },
    30: {
        questionPhrase: { en: "certain elements of play are more significant", th: "องค์ประกอบบางอย่างของการเล่นสำคัญกว่าอย่างอื่น" },
        passagePhrase: { en: "did not assign greater weight to any one dimension", th: "ไม่ได้ให้น้ำหนักมากกว่ากับมิติใดมิติหนึ่ง" },
        pairs: [
          { q: "Certain elements of play", p: "any one dimension", th: "องค์ประกอบบางอย่างของการเล่น" },
          { q: "more significant than others", p: "greater weight", th: "สำคัญกว่าอย่างอื่น", note: "Rubin 'did not assign greater weight' แต่ 'other researchers' (Pellegrini) เห็นว่าบางมิติสำคัญที่สุด จึงตอบ E ไม่ใช่ C" },
        ],
        keyVocab: { word: "greater weight to a dimension", th: "ให้น้ำหนักมากกว่ากับมิติหนึ่ง", contrastA: "Rubin . ไม่ให้น้ำหนักต่างกัน", contrastB: "others/Pellegrini . บางองค์ประกอบสำคัญกว่า", note: "ข้อความบอกว่า Rubin 'ไม่' ให้น้ำหนักต่างกัน แต่ 'other researchers' เห็นว่าบางมิติสำคัญที่สุด คือ Pellegrini จึงตอบ E ไม่ใช่ C" }
    },
    31: {
        questionPhrase: { en: "classified on a scale of playfulness", th: "จัดประเภทตามระดับความเป็นการเล่น" },
        passagePhrase: { en: "playful behaviors can range in degree from 0% to 100%", th: "พฤติกรรมการเล่นมีระดับได้ตั้งแต่ 0% ถึง 100%" },
        pairs: [
          { q: "classified on a scale", p: "range in degree from 0% to 100%", th: "จัดตามระดับมาตราส่วน", note: "'range in degree from 0% to 100% playful' (มุมมองของ Rubin and colleagues) = 'a scale of playfulness' จึงตอบ C" },
          { q: "playfulness", p: "playful", th: "ความเป็นการเล่น" },
        ],
        keyVocab: { word: "range in degree / scale", th: "มีระดับต่างกัน / มาตราส่วน", note: "'range in degree from 0% to 100%' = 'a scale of playfulness' มุมมองของ Rubin and colleagues จึงตอบ C" }
    },
    32: {
        questionPhrase: { en: "children need toys in order to play", th: "เด็กต้องมีของเล่นจึงจะเล่นได้" },
        passagePhrase: { en: "children will play in any circumstances, even with no real toys", th: "เด็กจะเล่นในทุกสถานการณ์ แม้ไม่มีของเล่นจริง" },
        pairs: [
          { q: "need toys in order to play", p: "no real toys", th: "ต้องมีของเล่นจึงจะเล่นได้", note: "ข้อความบอกเด็กเล่นได้แม้ 'no real toys' ขัดกับคำกล่าวว่าต้องมีของเล่น จึงตอบ NO" },
          { q: "to play", p: "play", th: "การเล่น" },
        ],
        keyVocab: { word: "no real toys", th: "ไม่มีของเล่นจริง", note: "ข้อความบอกเด็กเล่นได้แม้ 'no real toys' ขัดกับคำกล่าวที่ว่าต้องมีของเล่น จึงตอบ NO" }
    },
    33: {
        questionPhrase: { en: "mistake to treat play and learning as separate", th: "เป็นความผิดพลาดที่แยกการเล่นกับการเรียนรู้ออกจากกัน" },
        passagePhrase: { en: "society has created a false dichotomy between play and learning", th: "สังคมสร้างการแบ่งแยกที่ผิดระหว่างการเล่นกับการเรียนรู้" },
        pairs: [
          { q: "a mistake", p: "false", th: "ความผิดพลาด/ผิด", note: "'false dichotomy' = การแยกการเล่นกับการเรียนรู้เป็นความผิดพลาด ตรงกับคำกล่าว จึงตอบ YES" },
          { q: "treat play and learning as separate", p: "dichotomy between play and learning", th: "การแยกการเล่นกับการเรียนรู้ออกจากกัน" },
        ],
        keyVocab: { word: "false dichotomy", th: "การแบ่งแยกที่ผิด", note: "'false dichotomy' = การแยกสองสิ่งนี้เป็นความผิดพลาด ตรงกับคำกล่าว จึงตอบ YES" }
    },
    34: {
        questionPhrase: { en: "play helps children develop artistic talents", th: "การเล่นช่วยให้เด็กพัฒนาพรสวรรค์ทางศิลปะ" },
        passagePhrase: { en: "learn science, mathematics, social relationships, creative problem-solving", th: "เรียนวิทยาศาสตร์ คณิตศาสตร์ ความสัมพันธ์ทางสังคม การแก้ปัญหาเชิงสร้างสรรค์" },
        pairs: [
          { q: "develop their artistic talents", p: "creative problem-solving skills", th: "พัฒนาความสามารถเชิงสร้างสรรค์", note: "ข้อความพูดถึง 'creative problem-solving' แต่ไม่เคยพูดถึง 'artistic talents' (พรสวรรค์ทางศิลปะ) จึงตอบ NOT GIVEN" },
          { q: "Play helps children to develop", p: "Through play, children learn", th: "การเล่นช่วยให้เด็กพัฒนา" },
        ],
        keyVocab: { word: "artistic talents", th: "พรสวรรค์ทางศิลปะ", note: "ข้อความระบุประโยชน์หลายด้านแต่ไม่เคยพูดถึง 'artistic talents' (พรสวรรค์ทางศิลปะ) จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "researchers have agreed on a definition of play", th: "นักวิจัยเห็นพ้องกันเรื่องนิยามของการเล่น" },
        passagePhrase: { en: "full consensus on a formal definition continues to elude researchers", th: "ฉันทามติเต็มรูปแบบเรื่องนิยามยังคงเลี่ยงหนีนักวิจัย" },
        pairs: [
          { q: "agreed on", p: "Full consensus", th: "เห็นพ้องกัน/ฉันทามติ", note: "'consensus...continues to elude the researchers' = ยังตกลงกันไม่ได้ ขัดกับ 'agreed' จึงตอบ NO" },
          { q: "a definition of play", p: "a formal definition of play", th: "นิยามของการเล่น" },
          { q: "Researchers", p: "the researchers and theorists", th: "นักวิจัย" },
        ],
        keyVocab: { word: "consensus...continues to elude", th: "ฉันทามติยังหาไม่ได้ / ยังตกลงกันไม่ได้", note: "'consensus continues to elude' = ยังตกลงกันไม่ได้ ขัดกับคำกล่าวว่า 'agreed' จึงตอบ NO" }
    },
    36: {
        questionPhrase: { en: "work and play differ in whether they have a target", th: "งานกับการเล่นต่างกันตรงที่มีเป้าหมายหรือไม่" },
        passagePhrase: { en: "unlike play, work is extrinsically motivated (i.e. goal oriented)", th: "ต่างจากการเล่น งานถูกขับด้วยแรงจูงใจภายนอก คือมุ่งเป้าหมาย" },
        pairs: [
          { q: "whether or not they have a target", p: "goal oriented", th: "การมีเป้าหมายหรือไม่", note: "'unlike play, work...is goal oriented' ชี้ว่างานกับการเล่นต่างกันตรงการมีเป้าหมาย จึงตอบ YES" },
          { q: "Work and play differ", p: "Unlike play, work", th: "งานกับการเล่นต่างกัน" },
        ],
        keyVocab: { word: "goal oriented", th: "มุ่งเป้าหมาย", contrastA: "work . มีเป้าหมาย (goal oriented)", contrastB: "play . ไม่มีเป้าหมายภายนอก", note: "'goal oriented' = 'have a target' และ 'unlike play' ชี้ว่าทั้งสองต่างกันที่จุดนี้ จึงตอบ YES" }
    },
    37: {
        questionPhrase: { en: "by ___ the child to investigate different aspects", th: "โดยการ ___ ให้เด็กสำรวจแง่มุมต่าง ๆ" },
        passagePhrase: { en: "encouraging further exploration or new facets to the child's activity", th: "การกระตุ้นให้สำรวจเพิ่มเติมหรือแง่มุมใหม่ของกิจกรรมเด็ก" },
        pairs: [
          { q: "to investigate", p: "exploration", th: "สำรวจ/ค้นหา" },
          { q: "different aspects of their", p: "new facets to the child's activity", th: "แง่มุมต่าง ๆ ของกิจกรรม", note: "'encouraging further exploration or new facets' = '___ the child to investigate different aspects' คำที่เติมคือ encouraging" },
        ],
        keyVocab: { word: "encouraging", th: "การกระตุ้น/สนับสนุน", note: "'investigate different aspects' = 'further exploration or new facets' คำที่เติมช่องคือ 'encouraging' จึงตอบ encouraging" }
    },
    38: {
        questionPhrase: { en: "it should still be based on the child's ___", th: "ควรยังคงตั้งอยู่บน ___ ของเด็กที่จะเล่น" },
        passagePhrase: { en: "play should stem from the child's own desire", th: "การเล่นควรเกิดจากความปรารถนาของเด็กเอง" },
        pairs: [
          { q: "based on the child's", p: "stem from the child's own", th: "ตั้งอยู่บน/เกิดจากของเด็ก", note: "'play should stem from the child's own desire' = 'based on the child's ___ to play' คำเดียวคือ desire" },
        ],
        keyVocab: { word: "desire", th: "ความปรารถนา/ความต้องการ", note: "'based on the child's ___ to play' = 'stem from the child's own desire' คำเดียวจากข้อความคือ 'desire' จึงตอบ desire" }
    },
    39: {
        questionPhrase: { en: "play without adults gives children real ___", th: "การเล่นโดยไม่มีผู้ใหญ่ให้ ___ จริงแก่เด็ก" },
        passagePhrase: { en: "free play provides the child with true autonomy", th: "การเล่นอิสระให้ความเป็นอิสระที่แท้จริงแก่เด็ก" },
        pairs: [
          { q: "without the intervention of adults", p: "free play", th: "โดยไม่มีผู้ใหญ่เข้ามายุ่ง" },
          { q: "real", p: "true", th: "ที่แท้จริง", note: "'free play provides the child with true autonomy' = 'gives children real ___' คำเดียวคือ autonomy" },
        ],
        keyVocab: { word: "autonomy", th: "ความเป็นอิสระ/การปกครองตนเอง", note: "'without the intervention of adults' = 'free play' และ 'real' = 'true' คำที่เติมคือ 'autonomy' จึงตอบ autonomy" }
    },
    40: {
        questionPhrase: { en: "with adults, play can be ___ at particular goals", th: "เมื่อมีผู้ใหญ่ การเล่นสามารถ ___ ไปที่เป้าหมายเฉพาะได้" },
        passagePhrase: { en: "guided play...provide more targeted learning experiences", th: "การเล่นแบบชี้นำให้ประสบการณ์เรียนรู้ที่มุ่งเป้ามากขึ้น" },
        pairs: [
          { q: "at particular goals", p: "targeted learning experiences", th: "มุ่งไปที่เป้าหมายเฉพาะ", note: "'guided play...provide more targeted learning experiences' = 'play can be ___ at particular goals' คำเดียวคือ targeted" },
          { q: "with Adults", p: "guided play", th: "เมื่อมีผู้ใหญ่/การเล่นแบบชี้นำ" },
        ],
        keyVocab: { word: "targeted", th: "มุ่งเป้า/เจาะจง", note: "'at particular goals' = 'targeted learning experiences' คำเดียวจากข้อความคือ 'targeted' จึงตอบ targeted" }
    },
  },
  "Cambridge 14 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "were the first people to research marine debris", th: "เป็นคนกลุ่มแรกที่ศึกษาปัญหาขยะในทะเล" },
        passagePhrase: { en: "Plenty of studies have sounded alarm bells about marine debris", th: "มีงานวิจัยจำนวนมากที่ส่งสัญญาณเตือนเรื่องขยะทะเลมาแล้ว" },
        pairs: [
          { q: "the first people to research", p: "Plenty of studies", th: "มีงานวิจัยอยู่ก่อนแล้วมากมาย (ไม่ใช่คนแรก)", note: "เพราะมี 'Plenty of studies' อยู่ก่อนแล้ว Rochman จึงไม่ใช่คนแรก ตอบ FALSE" },
          { q: "the problem of marine debris", p: "the state of marine debris", th: "ปัญหา/สภาวะของขยะในทะเล" },
          { q: "research", p: "sounded alarm bells", th: "ศึกษา/ส่งสัญญาณเตือนเรื่องนี้มาแล้ว" },
        ],
        keyVocab: { word: "plenty of studies (already existed)", th: "มีงานวิจัยอยู่ก่อนแล้วมากมาย", note: "เพราะมีงานวิจัยมากมายอยู่ก่อนแล้ว Rochman จึงไม่ใช่คนแรก ตอบ FALSE" }
    },
    28: {
        questionPhrase: { en: "creatures most in danger are certain seabirds", th: "สัตว์ที่เสี่ยงที่สุดคือนกทะเลบางชนิด" },
        passagePhrase: { en: "certain seabirds eat plastic bags... whole bird populations at risk", th: "นกทะเลบางชนิดกินถุงพลาสติก... ประชากรนกอาจสูญพันธุ์" },
        pairs: [
          { q: "certain seabirds", p: "certain seabirds", th: "นกทะเลบางชนิด", note: "ข้อความยกนกเป็นแค่ตัวอย่าง ไม่ได้บอกว่าเสี่ยง 'ที่สุด' จึงตอบ NOT GIVEN" },
          { q: "in danger", p: "at risk of dying out", th: "ตกอยู่ในอันตราย/เสี่ยงตาย" },
          { q: "ocean trash", p: "eat plastic bags", th: "ขยะในทะเล (พลาสติก)" },
        ],
        keyVocab: { word: "most in danger (ranking claim)", th: "เสี่ยงที่สุด (การจัดอันดับ)", note: "ข้อความยกนกเป็นเพียงตัวอย่าง ไม่ได้บอกว่าเสี่ยง 'ที่สุด' จึงตอบ NOT GIVEN" }
    },
    29: {
        questionPhrase: { en: "already proved bird populations will become extinct", th: "พิสูจน์แล้วว่าประชากรนกบางชนิดจะสูญพันธุ์" },
        passagePhrase: { en: "nobody had yet tested those perceived threats", th: "ยังไม่มีใครทดสอบภัยคุกคามที่คาดการณ์เหล่านั้น" },
        pairs: [
          { q: "already proved", p: "nobody had yet tested", th: "พิสูจน์แล้ว vs ยังไม่มีใครทดสอบ", note: "'proved' ในคำถามขัดกับ 'nobody had yet tested' จึงตอบ FALSE" },
          { q: "populations of some birds will soon become extinct", p: "those perceived threats", th: "ภัยที่แค่คาดการณ์ ยังไม่ได้พิสูจน์" },
        ],
        keyVocab: { word: "perceived threats (not yet tested)", th: "ภัยที่แค่คาดการณ์ ยังไม่ได้พิสูจน์", contrastA: "proved . พิสูจน์แล้ว", contrastB: "perceived / not yet tested . แค่คาดการณ์ ยังไม่ทดสอบ", note: "'proved' ในคำถามขัดกับ 'nobody had yet tested' จึงตอบ FALSE" }
    },
    30: {
        questionPhrase: { en: "analysed papers on different kinds of danger", th: "วิเคราะห์งานวิจัยเรื่องอันตรายชนิดต่าง ๆ" },
        passagePhrase: { en: "examined more than a hundred papers on the impacts of marine debris", th: "ตรวจสอบงานวิจัยกว่าร้อยชิ้นเรื่องผลกระทบของขยะทะเล" },
        pairs: [
          { q: "analysed papers", p: "examined more than a hundred papers", th: "วิเคราะห์/ตรวจสอบงานวิจัย", note: "'examined papers' = 'analysed papers' และ 'impacts' คือ 'kinds of danger' จึงตอบ TRUE" },
          { q: "different kinds of danger", p: "the impacts of marine debris", th: "อันตราย/ผลกระทบชนิดต่าง ๆ" },
          { q: "ocean trash", p: "marine debris", th: "ขยะในทะเล" },
        ],
        keyVocab: { word: "examined papers = analysed papers", th: "ตรวจสอบงานวิจัย = วิเคราะห์งานวิจัย", note: "'impacts/threats' คือ 'kinds of danger' การ examine คือการ analyse จึงตอบ TRUE" }
    },
    31: {
        questionPhrase: { en: "most of the research was badly designed", th: "งานวิจัยส่วนใหญ่ออกแบบมาไม่ดี" },
        passagePhrase: { en: "In 83 percent of cases... proven true; remaining cases had weaknesses in design", th: "83% พิสูจน์ว่าจริง ส่วนที่เหลือมีจุดอ่อนด้านการออกแบบ" },
        pairs: [
          { q: "Most of the research", p: "In 83 percent of cases", th: "ส่วนใหญ่ (83%)", note: "งานวิจัยส่วนใหญ่ (83%) พิสูจน์ว่าจริง ที่ออกแบบไม่ดีมีแค่ส่วนน้อย จึงตอบ FALSE" },
          { q: "badly designed", p: "weaknesses in design", th: "ออกแบบมาไม่ดี/มีจุดอ่อนด้านการออกแบบ" },
          { q: "Most of the research", p: "the remaining cases", th: "ส่วนที่เหลือ (เพียงส่วนน้อย)" },
        ],
        keyVocab: { word: "83 percent proven true", th: "83% พิสูจน์ว่าจริง (เป็นส่วนใหญ่)", contrastA: "most . ส่วนใหญ่", contrastB: "remaining 17% . ส่วนที่เหลือเพียงเล็กน้อย", note: "ออกแบบไม่ดีมีแค่ส่วนน้อย (ไม่ถึง 17%) ไม่ใช่ส่วนใหญ่ จึงตอบ FALSE" }
    },
    32: {
        questionPhrase: { en: "expecting to find mussels were harmed by plastic", th: "คาดว่าจะพบว่าหอยแมลงภู่ถูกพลาสติกทำร้าย" },
        passagePhrase: { en: "study failed to find the effect it was looking for... didn't seem to stress out the shellfish", th: "งานวิจัยไม่พบผลที่กำลังมองหา... ดูเหมือนไม่ทำให้หอยเครียด" },
        pairs: [
          { q: "expecting to find", p: "the effect it was looking for", th: "คาดว่าจะพบ/ผลที่กำลังมองหา", note: "นักวิจัย 'looking for' ผลกระทบแต่ไม่พบ แปลว่าคาดว่าจะพบอันตราย จึงตอบ TRUE" },
          { q: "mussels", p: "mussels ingesting microscopic bits", th: "หอยแมลงภู่กินชิ้นพลาสติกจิ๋ว" },
          { q: "harmed by eating plastic", p: "didn't seem to stress out the shellfish", th: "ถูกพลาสติกทำร้าย (แต่ผลคือไม่ทำให้หอยเครียด)" },
        ],
        keyVocab: { word: "the effect it was looking for", th: "ผลกระทบที่นักวิจัยกำลังมองหา (คือความเสียหาย)", note: "นักวิจัย 'มองหา' ผลกระทบแต่ไม่พบ แปลว่าคาดว่าจะพบอันตราย จึงตอบ TRUE" }
    },
    33: {
        questionPhrase: { en: "mussels choose plastic over their natural diet", th: "หอยแมลงภู่เลือกกินพลาสติกแทนอาหารตามธรรมชาติ" },
        passagePhrase: { en: "mussels may be fine eating trash", th: "หอยแมลงภู่อาจไม่เป็นไรกับการกินขยะ" },
        pairs: [
          { q: "eat plastic", p: "eating trash", th: "กินพลาสติก/ขยะ" },
          { q: "in preference to their natural diet", p: "mussels may be fine", th: "เลือกกินแทนอาหารปกติ (ข้อความบอกแค่ว่า 'ไม่เป็นไร')", note: "ข้อความบอกแค่ 'กินแล้วไม่เป็นไร' ไม่ได้บอกว่า 'เลือก' พลาสติกแทนอาหารปกติ จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "choose ... in preference to (preference)", th: "เลือก...มากกว่า (ความชอบ)", note: "ข้อความบอกแค่ว่า 'กินแล้วไม่เป็นไร' ไม่ได้บอกว่า 'เลือก' พลาสติกแทนอาหารปกติ จึงตอบ NOT GIVEN" }
    },
    34: {
        questionPhrase: { en: "bits of debris that were ___ (harmful to animals)", th: "ชิ้นขยะที่มีขนาด ___ (เป็นอันตรายต่อสัตว์)" },
        passagePhrase: { en: "Most of the dangers also involved large pieces of debris", th: "อันตรายส่วนใหญ่เกี่ยวข้องกับเศษขยะชิ้นใหญ่" },
        pairs: [
          { q: "bits of debris", p: "pieces of debris", th: "ชิ้น/เศษขยะ" },
          { q: "harmful to animals", p: "Most of the dangers", th: "เป็นอันตรายต่อสัตว์" },
          { q: "bits of debris that were", p: "large", th: "ขนาดใหญ่ (คำตอบ)", note: "อันตรายส่วนใหญ่มาจากเศษ 'large' ตรงกับช่องว่าง คำตอบคือ large" },
        ],
        keyVocab: { word: "large = คำตอบ", th: "large = ขนาดใหญ่", contrastA: "large pieces . ชิ้นใหญ่", contrastB: "microplastic / tiny bits . ชิ้นเล็กจิ๋ว", note: "อันตรายส่วนใหญ่มาจากเศษ 'large' ตรงกับช่องว่าง คำตอบคือ large" }
    },
    35: {
        questionPhrase: { en: "little research into ___ from synthetic fibres", th: "งานวิจัยน้อยเรื่อง ___ จากเส้นใยสังเคราะห์" },
        passagePhrase: { en: "little research on these tiny bits... open questions still for microplastic", th: "งานวิจัยน้อยเรื่องชิ้นจิ๋ว... ยังมีคำถามค้างเรื่องไมโครพลาสติก" },
        pairs: [
          { q: "little research into", p: "little research", th: "งานวิจัยมีน้อย" },
          { q: "synthetic fibres", p: "tiny bits", th: "เส้นใยสังเคราะห์/ชิ้นเล็กจิ๋ว" },
          { q: "into", p: "microplastic", th: "ไมโครพลาสติก (คำตอบ)", note: "เส้นใยสังเคราะห์เป็นแหล่งของ 'microplastic' ซึ่งมีงานวิจัยน้อย คำตอบคือ microplastic" },
        ],
        keyVocab: { word: "microplastic = คำตอบ", th: "microplastic = พลาสติกขนาดเล็กจิ๋ว", note: "เส้นใยสังเคราะห์เป็นแหล่งหนึ่งของ 'microplastic' ซึ่งมีงานวิจัยน้อย คำตอบคือ microplastic" }
    },
    36: {
        questionPhrase: { en: "focused on individual animals, not entire ___", th: "เน้นสัตว์รายตัว ไม่ใช่ ___ ทั้งหมด" },
        passagePhrase: { en: "how plastic affects an individual animal... rather than whole populations", th: "พลาสติกกระทบสัตว์รายตัว... มากกว่ากระทบประชากรทั้งหมด" },
        pairs: [
          { q: "individual animals", p: "an individual animal", th: "สัตว์รายตัว" },
          { q: "not entire", p: "rather than whole", th: "ไม่ใช่ทั้งหมด" },
          { q: "entire", p: "populations", th: "ประชากร/กลุ่มทั้งหมด (คำตอบ)", note: "'entire' = 'whole' คำที่ตรงข้ามกับ individual คือ populations จึงเป็นคำตอบ" },
        ],
        keyVocab: { word: "populations = คำตอบ", th: "populations = ประชากร (สัตว์ทั้งกลุ่ม)", contrastA: "individual animal . สัตว์รายตัว", contrastB: "whole populations . ประชากรทั้งหมด", note: "'entire' = 'whole' คำที่ตรงข้ามกับ individual คือ populations จึงเป็นคำตอบ" }
    },
    37: {
        questionPhrase: { en: "the ___ of plastic used in the lab", th: "___ ของพลาสติกที่ใช้ในห้องทดลอง" },
        passagePhrase: { en: "scientists often use higher concentrations of plastic than in the ocean", th: "นักวิทยาศาสตร์มักใช้ความเข้มข้นของพลาสติกสูงกว่าในทะเลจริง" },
        pairs: [
          { q: "used in the lab", p: "in the lab, scientists often use", th: "ที่ใช้ในห้องทดลอง" },
          { q: "did not always reflect those in the ocean", p: "higher concentrations of plastic than what's really in the ocean", th: "ไม่ตรงกับในทะเลจริง" },
          { q: "the", p: "concentrations", th: "ความเข้มข้น (คำตอบ)", note: "ห้องแล็บใช้ 'concentrations' ที่ไม่ตรงกับในทะเล ตรงช่องว่างพอดี คำตอบคือ concentrations" },
        ],
        keyVocab: { word: "concentrations = คำตอบ", th: "concentrations = ความเข้มข้น/ปริมาณความหนาแน่น", note: "ห้องแล็บใช้ 'concentrations' ที่ไม่ตรงกับในทะเล ตรงช่องว่างพอดี คำตอบคือ concentrations" }
    },
    38: {
        questionPhrase: { en: "impact of a reduction in numbers on the ___", th: "ผลของจำนวนที่ลดลงต่อ ___ ของสายพันธุ์นั้น" },
        passagePhrase: { en: "how deaths in one species could affect that animal's predators", th: "การตายของสายพันธุ์หนึ่งอาจกระทบผู้ล่าของสัตว์นั้น" },
        pairs: [
          { q: "a reduction in numbers", p: "deaths in one species", th: "จำนวนที่ลดลง/การตาย" },
          { q: "the impact of", p: "predators", th: "ผู้ล่า (คำตอบ)", note: "จำนวนที่ลดลงกระทบต่อ 'predators' ของสายพันธุ์นั้น คำตอบคือ predators" },
        ],
        keyVocab: { word: "predators = คำตอบ", th: "predators = ผู้ล่า/นักล่า", note: "จำนวนที่ลดลง (deaths) กระทบต่อ 'predators' ของสายพันธุ์นั้น คำตอบคือ predators" }
    },
    39: {
        questionPhrase: { en: "future ___ (e.g. involving oil)", th: "___ ในอนาคต (เช่น เกี่ยวกับน้ำมัน)" },
        passagePhrase: { en: "disasters such as a tanker spilling its cargo of oil", th: "ภัยพิบัติ เช่น เรือบรรทุกทำน้ำมันรั่วไหล" },
        pairs: [
          { q: "involving oil", p: "spilling its whole cargo of oil", th: "เกี่ยวกับน้ำมัน/น้ำมันรั่ว" },
          { q: "future", p: "disasters", th: "ภัยพิบัติ (คำตอบ)", note: "ตัวอย่าง 'น้ำมันรั่ว' คือ 'disasters' ตรงกับช่องว่าง คำตอบคือ disasters" },
        ],
        keyVocab: { word: "disasters = คำตอบ", th: "disasters = ภัยพิบัติ", note: "ตัวอย่าง 'น้ำมันรั่ว' คือ 'disasters' ตรงกับช่องว่าง คำตอบคือ disasters" }
    },
    40: {
        questionPhrase: { en: "best title: Assessing the threat of marine debris", th: "ชื่อเรื่องที่ดีที่สุด: การประเมินภัยจากขยะทะเล" },
        passagePhrase: { en: "clearing up misperceptions... which problems really need addressing", th: "ขจัดความเข้าใจผิด... ปัญหาใดที่ต้องแก้ไขจริง ๆ" },
        pairs: [
          { q: "Assessing the threat", p: "which problems really need addressing", th: "การประเมิน/ตัดสินว่าภัยใดจริง", note: "ทั้งบทเน้นตรวจสอบว่าภัยจากขยะทะเลจริงแค่ไหน = assessing the threat จึงตอบ A" },
          { q: "marine debris", p: "plastic debris", th: "ขยะ/พลาสติกในทะเล" },
          { q: "threat", p: "misperceptions", th: "ภัยคุกคาม (กับความเข้าใจผิดเรื่องภัย)" },
        ],
        keyVocab: { word: "assessing the threat", th: "การประเมินภัยคุกคาม (ว่าจริงหรือเกินจริง)", note: "ทั้งบทพูดถึงการตรวจสอบว่าภัยจากขยะทะเลจริงแค่ไหน = assessing the threat จึงตอบ A" }
    },
  },
  "Cambridge 15 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "its value to scientific research", th: "คุณค่าของเสียงหัวเราะต่องานวิจัยทางวิทยาศาสตร์" },
        passagePhrase: { en: "provide psychological scientists with rich resources for studying human psychology", th: "ให้แหล่งข้อมูลอันมีค่าแก่นักวิทยาศาสตร์ในการศึกษาจิตวิทยามนุษย์" },
        pairs: [
          { q: "its value to scientific research", p: "rich resources for studying human psychology", th: "คุณค่า/ประโยชน์ต่อการศึกษาวิจัย", note: "'rich resources for studying' พาราเฟรสของ 'value to scientific research' ผู้เขียนเน้นประโยชน์ต่องานวิจัย จึงตอบ C" },
          { q: "scientific research", p: "psychological scientists", th: "นักวิทยาศาสตร์/งานวิจัยทางวิทยาศาสตร์" },
          { q: "the writer emphasises", p: "rich resources", th: "เน้นย้ำว่ามีคุณค่ามาก" },
        ],
        keyVocab: { word: "rich resources for studying", th: "แหล่งข้อมูลอันมีค่าสำหรับการศึกษาวิจัย", note: "วลี 'rich resources for studying' คือการพาราเฟรสของ 'value to scientific research' ผู้เขียนเน้นว่าเสียงหัวเราะมีประโยชน์ต่องานวิจัย จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "importance of enjoying humour in a group setting", th: "ความสำคัญของการเสพอารมณ์ขันร่วมกันเป็นกลุ่ม" },
        passagePhrase: { en: "help people at home feel like they were in a social situation", th: "ช่วยให้คนที่บ้านรู้สึกเหมือนอยู่ในสถานการณ์ทางสังคม" },
        pairs: [
          { q: "enjoying humour in a group setting", p: "feel like they were in a social situation", th: "การเสพอารมณ์ขันร่วมกันในกลุ่ม", note: "'social situation, such as a crowded theatre' สื่อว่า Douglass เข้าใจว่าหัวเราะร่วมกันเป็นกลุ่มสนุกกว่า จึงตอบ A" },
          { q: "in a group setting", p: "a crowded theatre", th: "ในสภาพแวดล้อมที่มีคนอยู่ร่วมกันเป็นกลุ่ม" },
          { q: "at home", p: "people at home", th: "คนที่ดูอยู่ที่บ้าน" },
        ],
        keyVocab: { word: "social situation / crowded theatre", th: "สถานการณ์ทางสังคม / โรงละครที่มีคนเยอะ", note: "'social situation, such as a crowded theatre' สื่อว่า Douglass รู้ว่าเสียงหัวเราะสนุกกว่าเมื่ออยู่ในกลุ่ม จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "similar results across a wide range of cultures", th: "ผลที่คล้ายกันจากหลากหลายวัฒนธรรม" },
        passagePhrase: { en: "the results were remarkably consistent: worldwide", th: "ผลลัพธ์สอดคล้องกันอย่างน่าทึ่งทั่วโลก" },
        pairs: [
          { q: "similar results", p: "remarkably consistent", th: "ผลลัพธ์ที่คล้าย/สอดคล้องกัน", note: "'remarkably consistent... worldwide' = 'similar results... wide range of cultures' จุดเด่นอยู่ที่ผลตรงกันแม้คนละวัฒนธรรม จึงตอบ B" },
          { q: "a wide range of cultures", p: "24 diverse societies", th: "หลากหลายวัฒนธรรม/สังคม" },
          { q: "produced by", p: "worldwide", th: "เกิดขึ้นทั่วทุกแห่ง" },
        ],
        keyVocab: { word: "remarkably consistent worldwide", th: "สอดคล้องกันอย่างน่าทึ่งทั่วโลก", note: "'remarkably consistent... worldwide' = 'similar results... wide range of cultures' ความสำคัญอยู่ที่ผลตรงกันแม้คนละวัฒนธรรม จึงตอบ B" }
    },
    30: {
        questionPhrase: { en: "participants exchanged roles", th: "ผู้เข้าร่วมสลับบทบาทกัน" },
        passagePhrase: { en: "each student took a turn at being teased by the others", th: "นักศึกษาแต่ละคนผลัดกันถูกคนอื่นล้อ" },
        pairs: [
          { q: "Participants exchanged roles", p: "took a turn at being teased by the others", th: "ผู้เข้าร่วมผลัด/สลับบทบาทกัน", note: "'took a turn at being teased' หมายถึงผลัดกันเป็นคนล้อและคนถูกล้อ ตรงกับ 'exchanged roles' จึงตอบ B" },
          { q: "Participants", p: "each student", th: "ผู้เข้าร่วม/นักศึกษาแต่ละคน" },
          { q: "exchanged", p: "took a turn", th: "ผลัดกัน/สลับกัน" },
        ],
        keyVocab: { word: "took a turn", th: "ผลัดกัน / สลับกันทำ", note: "'took a turn at being teased' หมายถึงผลัดกันเป็นคนล้อและคนถูกล้อ ตรงกับ 'exchanged roles' จึงตอบ B" }
    },
    31: {
        questionPhrase: { en: "high-status people always identifiable by their laugh", th: "คนสถานะสูงถูกระบุได้เสมอจากเสียงหัวเราะ" },
        passagePhrase: { en: "high-status individuals were rated as high-status whether... dominant... or submissive", th: "คนสถานะสูงถูกมองว่าสูงไม่ว่าหัวเราะแบบครอบงำหรือยอม" },
        pairs: [
          { q: "High-status individuals can always be identified by their way of laughing", p: "high-status individuals were rated as high-status whether they produced their natural dominant laugh or tried to do a submissive one", th: "คนสถานะสูงถูกระบุได้เสมอจากเสียงหัวเราะ", note: "'rated as high-status whether dominant or submissive' แปลว่าจับคนสถานะสูงได้เสมอไม่ว่าหัวเราะแบบไหน จึงตอบ D" },
          { q: "always", p: "whether they produced their natural dominant laugh or tried to do a submissive one", th: "เสมอ / ไม่ว่าจะแบบใดก็ตาม" },
          { q: "be identified", p: "rated as high-status", th: "ถูกระบุ/ถูกมองว่าเป็น" },
        ],
        keyVocab: { word: "whether... or...", th: "ไม่ว่าจะ...หรือ...", note: "'rated as high-status whether dominant or submissive' แปลว่าคนสถานะสูงถูกจับได้เสมอ จึงตอบ D" }
    },
    32: {
        questionPhrase: { en: "generate a different kind of emotion", th: "กระตุ้นให้เกิดอารมณ์คนละแบบ" },
        passagePhrase: { en: "eliciting either humour, contentment, or neutral feelings", th: "กระตุ้นอารมณ์ขัน ความพึงพอใจ หรือความรู้สึกเป็นกลาง" },
        pairs: [
          { q: "a different kind of", p: "either humour, contentment, or neutral feelings", th: "คนละแบบ/หลายชนิด", note: "วิดีโอแต่ละคลิปกระตุ้น 'feelings' ต่างกัน คำที่ครอบคลุมความรู้สึกคือ emotion จึงเติม F" },
          { q: "generate", p: "eliciting", th: "กระตุ้นให้เกิด" },
          { q: "shown one of three videos", p: "watch a video clip", th: "ได้ชมวิดีโอคลิป" },
        ],
        keyVocab: { word: "feelings / eliciting", th: "ความรู้สึก / กระตุ้นให้เกิด", note: "วิดีโอแต่ละคลิปกระตุ้น 'feelings' ต่างกัน คำที่ครอบคลุมคือ emotion จึงเติม F" }
    },
    33: {
        questionPhrase: { en: "those who watched the amusing video persisted longer", th: "คนที่ดูวิดีโอตลกพยายามทำงานนานกว่า" },
        passagePhrase: { en: "watched the Mr. Bean video ended up spending significantly more time", th: "คนที่ดูคลิป Mr. Bean ใช้เวลาทำงานนานขึ้นมาก" },
        pairs: [
          { q: "persisted with the task for longer", p: "spending significantly more time working on the task", th: "ทำงานต่อเนื่องนานกว่า", note: "คลิป Mr. Bean เป็นวิดีโอตลก ('amusing') ที่ทำให้พยายามนานขึ้น จึงเติม H" },
          { q: "tried harder to accomplish the task", p: "making twice as many predictions", th: "พยายามมากขึ้นเพื่อทำงานให้สำเร็จ" },
          { q: "than either of the other two groups", p: "than the other two groups", th: "มากกว่าอีกสองกลุ่ม" },
        ],
        keyVocab: { word: "Mr. Bean (comedy) = amusing", th: "Mr. Bean (คอเมดี) = ตลก/น่าขบขัน", note: "คลิป Mr. Bean เป็นวิดีโอตลก ('amusing' = humorous) ซึ่งทำให้พยายามนานขึ้น จึงเติม H" }
    },
    34: {
        questionPhrase: { en: "perform a particularly boring task", th: "ทำงานที่น่าเบื่อเป็นพิเศษ" },
        passagePhrase: { en: "more time working on this tedious task", th: "ใช้เวลามากขึ้นกับงานที่น่าเบื่อ" },
        pairs: [
          { q: "particularly", p: "tedious", th: "อย่างยิ่ง/น่าเบื่อเป็นพิเศษ", note: "'tedious' เป็นคำพ้องของ 'boring' งานคูณเลขยาวๆ คือ tedious/boring จึงเติม C" },
          { q: "task", p: "long multiplication questions by hand", th: "งานที่ต้องทำ (คูณเลขยาวๆ ด้วยมือ)" },
          { q: "produced similar results", p: "replicated these results", th: "ให้ผลลัพธ์คล้ายเดิม" },
        ],
        keyVocab: { word: "tedious", th: "น่าเบื่อ ซ้ำซาก", note: "'tedious' เป็นคำพ้องของ 'boring' งานคูณเลขยาวๆ คือ tedious/boring จึงเติม C" }
    },
    35: {
        questionPhrase: { en: "humour reduces anxiety and builds social connections", th: "อารมณ์ขันลดความวิตกกังวลและสร้างความสัมพันธ์" },
        passagePhrase: { en: "help relieve stress and facilitate social relationships", th: "ช่วยคลายความเครียดและส่งเสริมความสัมพันธ์ทางสังคม" },
        pairs: [
          { q: "reduces", p: "relieve", th: "ลด/ทำให้บรรเทา", note: "'relieve stress' = 'reduces anxiety' โดย stress พ้องกับ anxiety จึงเติม D" },
          { q: "helps build social connections", p: "facilitate social relationships", th: "ช่วยสร้างความสัมพันธ์ทางสังคม" },
          { q: "humour", p: "humour", th: "อารมณ์ขัน" },
        ],
        keyVocab: { word: "relieve stress", th: "คลายความเครียด", note: "'relieve stress' = 'reduces anxiety' stress พ้องกับ anxiety (ความวิตกกังวล/ความเครียด) จึงเติม D" }
    },
    36: {
        questionPhrase: { en: "may also have a stimulating effect", th: "อาจมีผลในการกระตุ้น/ปลุกพลัง" },
        passagePhrase: { en: "humour is not only enjoyable but more importantly, energising", th: "อารมณ์ขันไม่เพียงสนุก แต่สำคัญกว่านั้นคือให้พลัง" },
        pairs: [
          { q: "may also have a", p: "more importantly", th: "ยังอาจมีผลที่สำคัญอีกอย่าง", note: "'energising' = 'stimulating' ทั้งคู่หมายถึงให้พลัง/กระตุ้น จึงเติม E" },
          { q: "effect on the body and mind", p: "energising", th: "ผลที่กระตุ้น/ปลุกพลังต่อกายและใจ" },
        ],
        keyVocab: { word: "energising", th: "ให้พลัง ปลุกเร้า", note: "'energising' = 'stimulating' ทั้งคู่หมายถึงเพิ่มพลัง/กระตุ้น จึงเติม E" }
    },
    37: {
        questionPhrase: { en: "more accurate at identifying friends than strangers", th: "ระบุเสียงหัวเราะของเพื่อนได้แม่นกว่าคนแปลกหน้า" },
        passagePhrase: { en: "people's guesses were correct approximately 60% of the time", th: "การเดายถูกราว 60% ของเวลาทั้งหมด" },
        pairs: [
          { q: "identifying the laughs of friends than those of strangers", p: "whether they thought the people laughing were friends or strangers", th: "แยกเสียงหัวเราะของเพื่อนกับคนแปลกหน้า", note: "บทความบอกแค่ความแม่นรวม 60% ไม่ได้เทียบเพื่อนกับคนแปลกหน้า จึงตอบ NOT GIVEN" },
          { q: "more accurate", p: "correct approximately 60% of the time", th: "ความแม่นยำในการเดา" },
          { q: "Santa Cruz study", p: "University of California, Santa Cruz", th: "การศึกษาที่ซานตาครูซ" },
        ],
        keyVocab: { word: "60% of the time (overall)", th: "ราว 60% โดยรวม (ไม่แยกเพื่อน/คนแปลกหน้า)", note: "บทความบอกแค่ความแม่นรวม 60% ไม่ได้เทียบเพื่อนกับคนแปลกหน้า จึงตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "researchers were correct in their predictions", th: "นักวิจัยทำนายพฤติกรรมได้ถูกต้อง" },
        passagePhrase: { en: "as expected, high-status individuals produced more dominant laughs", th: "ตามที่คาดไว้ คนสถานะสูงหัวเราะแบบครอบงำมากกว่า" },
        pairs: [
          { q: "correct in their predictions", p: "as expected", th: "ทำนายได้ถูกต้องตามที่คาด", note: "'as expected' ยืนยันว่าผลตรงกับที่นักวิจัยทำนายไว้ จึงตอบ YES" },
          { q: "the behaviour of the high-status individuals", p: "high-status individuals produced more dominant laughs and fewer submissive laughs", th: "พฤติกรรมของคนสถานะสูง" },
          { q: "researchers in the San Diego study", p: "A team led by Christopher Oveis", th: "ทีมวิจัยที่ซานดิเอโก" },
        ],
        keyVocab: { word: "as expected", th: "ตามที่คาดไว้", note: "'as expected' ยืนยันว่าผลตรงกับที่นักวิจัยทำนายไว้ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "given a fixed amount of time to complete", th: "ถูกกำหนดเวลาตายตัวให้ทำงานเสร็จ" },
        passagePhrase: { en: "Participants were allowed to quit the task at any point", th: "ผู้เข้าร่วมได้รับอนุญาตให้เลิกทำเมื่อไรก็ได้" },
        pairs: [
          { q: "given a fixed amount of time", p: "allowed to quit the task at any point", th: "กำหนดเวลาตายตัว (ขัดกับเลิกได้ทุกเมื่อ)", note: "'quit at any point' ขัดแย้งกับ 'fixed amount of time' เวลาไม่ได้ถูกกำหนดตายตัว จึงตอบ NO" },
          { q: "the task focusing on employee profiles", p: "guess the potential performance of employees based on provided profiles", th: "งานประเมินจากโปรไฟล์พนักงาน" },
          { q: "Australian National University study", p: "Australian National University", th: "การศึกษาที่มหาวิทยาลัยแห่งชาติออสเตรเลีย" },
        ],
        keyVocab: { word: "quit at any point", th: "เลิกได้ทุกเมื่อ", contrastA: "any point . ทุกเมื่อ (ยืดหยุ่น)", contrastB: "fixed amount of time . เวลาตายตัว", note: "'quit at any point' ขัดแย้งกับ 'fixed amount of time' เวลาไม่ได้ถูกกำหนดตายตัว จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "conclusions were in line with established notions", th: "ข้อสรุปสอดคล้องกับแนวคิดดั้งเดิม" },
        passagePhrase: { en: "traditional views... individuals should avoid... humour... we suggest humour is... energising", th: "มุมมองดั้งเดิมว่าควรเลี่ยงอารมณ์ขัน แต่เขาเสนอว่าอารมณ์ขันให้พลัง" },
        pairs: [
          { q: "established notions regarding task performance", p: "traditional views of task performance", th: "แนวคิดดั้งเดิมเรื่องการทำงานให้สำเร็จ", note: "ข้อสรุป 'We suggest' ของเขาขัดกับ 'traditional views' จึงไม่สอดคล้องกับแนวคิดดั้งเดิม ตอบ NO" },
          { q: "in line with", p: "should avoid things such as humour", th: "สอดคล้องกับ (แต่จริงๆ ขัดแย้ง)" },
          { q: "Cheng and Wang's conclusions", p: "We suggest that humour is not only enjoyable but more importantly, energising", th: "ข้อสรุปของเฉิงและหวัง" },
        ],
        keyVocab: { word: "traditional views vs we suggest", th: "มุมมองดั้งเดิม ปะทะ ข้อเสนอของเขา", contrastA: "traditional views . ควรเลี่ยงอารมณ์ขัน", contrastB: "Cheng and Wang . อารมณ์ขันให้พลัง", note: "ข้อสรุปของเขาขัด ('We suggest') กับ 'traditional views' จึงไม่สอดคล้องกับแนวคิดดั้งเดิม ตอบ NO" }
    },
  },
  "Cambridge 15 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "show considerable global variation", th: "มีความแตกต่างหลากหลายไปทั่วโลก" },
        passagePhrase: { en: "in some versions the wolf swallows... in others it locks her in a cupboard", th: "บางเวอร์ชันหมาป่ากลืนยาย บางเวอร์ชันขังยายไว้ในตู้" },
        pairs: [
          { q: "details of the plot", p: "In some versions, the wolf swallows up the grandmother, while in others it locks her in a cupboard", th: "รายละเอียดของเนื้อเรื่อง" },
          { q: "global variation", p: "In some versions... while in others", th: "ความแตกต่างหลากหลายในแต่ละเวอร์ชัน", note: "รายละเอียดเนื้อเรื่องต่างกันไป 'บางเวอร์ชัน...บางเวอร์ชัน' ตรงกับ global variation ตอบ C" },
          { q: "show considerable", p: "a variety of forms in different parts of the world", th: "แสดงความหลากหลายอย่างมาก" },
        ],
        keyVocab: { word: "in some versions / in others", th: "ในบางเวอร์ชัน / ในเวอร์ชันอื่น", note: "การที่รายละเอียดเนื้อเรื่องแตกต่างกันไป 'บางเวอร์ชัน...บางเวอร์ชัน' คือความหมายเดียวกับ global variation ทำให้ตอบ C" }
    },
    28: {
        questionPhrase: { en: "useful lessons for life are the reason for survival", th: "บทเรียนสอนใจเป็นเหตุผลที่นิทานอยู่รอด" },
        passagePhrase: { en: "survival-relevant information... but his research suggests otherwise", th: "ข้อมูลที่ช่วยให้รอดชีวิต แต่งานวิจัยเขาบอกตรงกันข้าม" },
        pairs: [
          { q: "useful lessons for life", p: "survival-relevant information", th: "ข้อมูล/บทเรียนที่เป็นประโยชน์ต่อชีวิต" },
          { q: "the reason for their survival", p: "what we find interesting about this story", th: "เหตุผลที่นิทานอยู่รอด" },
          { q: "Tehrani rejects the idea", p: "But his research suggests otherwise", th: "Tehrani ปฏิเสธความคิดนั้น", note: "suggests otherwise = ปฏิเสธว่าบทเรียนสอนใจไม่ใช่เหตุผลที่นิทานอยู่รอด ทำให้ปฏิเสธ B" },
        ],
        keyVocab: { word: "suggests otherwise", th: "ชี้ว่าไม่ใช่อย่างนั้น / ตรงกันข้าม", note: "Tehrani 'rejects' ความคิดที่ว่าบทเรียนสอนใจคือเหตุผลที่นิทานอยู่รอด คำว่า suggests otherwise คือการปฏิเสธทฤษฎี B (are the reason for their survival)" }
    },
    29: {
        questionPhrase: { en: "theories about social significance of fairy tales", th: "ทฤษฎีต่างๆ เกี่ยวกับความสำคัญทางสังคมของนิทาน" },
        passagePhrase: { en: "academics devising theories to explain the importance of fairy tales", th: "นักวิชาการคิดทฤษฎีขึ้นมาอธิบายความสำคัญของนิทาน" },
        pairs: [
          { q: "Various theories", p: "devising theories", th: "ทฤษฎีต่างๆ" },
          { q: "social significance of fairy tales", p: "the importance of fairy tales in human society", th: "ความสำคัญทางสังคมของนิทาน" },
          { q: "developed without factual basis", p: "devising theories", th: "คิดขึ้นมาโดยไม่มีหลักฐานพิสูจน์", note: "ทฤษฎีถูก 'คิดขึ้นมา' โดยยังไม่มีวิธีทดสอบ ตรงกับ F (without factual basis)" },
        ],
        keyVocab: { word: "devising theories", th: "คิด/สร้างทฤษฎีขึ้นมา", note: "ทฤษฎีถูก 'คิดขึ้นมา' โดยไม่มีหลักฐานพิสูจน์ (Tehrani เพิ่งหาวิธีทดสอบได้ภายหลัง) ตรงกับ F (developed without factual basis)" }
    },
    30: {
        questionPhrase: { en: "insights into the development of fairy tales", th: "ความเข้าใจเกี่ยวกับพัฒนาการของนิทาน" },
        passagePhrase: { en: "used the same approach... borrowing a technique from evolutionary biologists", th: "ใช้วิธีเดียวกัน โดยยืมเทคนิคจากนักชีววิทยาวิวัฒนาการ" },
        pairs: [
          { q: "development of fairy tales", p: "how they have evolved", th: "พัฒนาการของนิทาน" },
          { q: "Insights", p: "discover", th: "ความเข้าใจ/การค้นพบ" },
          { q: "methods used in biological research", p: "the same approach", th: "วิธีที่ใช้ในงานวิจัยทางชีววิทยา", note: "วิธีศึกษาพัฒนาการนิทานยืมมาจาก phylogenetic analysis ของนักชีววิทยา ตอบ A" },
        ],
        keyVocab: { word: "technique from evolutionary biologists", th: "เทคนิคจากนักชีววิทยาวิวัฒนาการ", note: "วิธีที่ใช้เข้าใจพัฒนาการนิทานยืมมาจากงานวิจัยทางชีววิทยา ตรงกับ A (methods used in biological research)" }
    },
    31: {
        questionPhrase: { en: "all the fairy tales analysed by Tehrani", th: "นิทานทั้งหมดที่ Tehrani วิเคราะห์" },
        passagePhrase: { en: "58 stories recorded from oral traditions", th: "นิทาน 58 เรื่องที่บันทึกจากการเล่าปากต่อปาก" },
        pairs: [
          { q: "All the fairy tales analysed", p: "58 stories", th: "นิทานทั้งหมดที่วิเคราะห์" },
          { q: "originally spoken rather than written", p: "recorded from oral traditions", th: "เดิมเป็นการเล่าด้วยปาก ไม่ใช่เขียน", note: "oral traditions = spoken (เล่าด้วยปาก) ตรงข้ามกับ written ตอบ E" },
        ],
        keyVocab: { word: "oral traditions", th: "ประเพณีการเล่าด้วยปาก (เล่าปากต่อปาก)", contrastA: "spoken . phût (เล่าด้วยปาก)", contrastB: "written . khiian (เขียน)", note: "oral = เล่าด้วยปาก ตรงข้ามกับเขียน จึงตรงกับ E (originally spoken rather than written)" }
    },
    32: {
        questionPhrase: { en: "find out if links existed among 58 stories", th: "หาว่ามีความเชื่อมโยงกันระหว่างนิทาน 58 เรื่องหรือไม่" },
        passagePhrase: { en: "his analysis had established that they were indeed related", th: "การวิเคราะห์ยืนยันว่านิทานเหล่านั้นมีความสัมพันธ์กันจริง" },
        pairs: [
          { q: "links", p: "related", th: "ความเชื่อมโยง/ความสัมพันธ์" },
          { q: "existed among 58 stories", p: "phylogenetic analysis had established that they were indeed related", th: "มีอยู่ระหว่างนิทาน 58 เรื่อง", note: "related = links เขาต้องการรู้ว่านิทานเชื่อมโยงกันไหม ตอบ D (links)" },
        ],
        keyVocab: { word: "related", th: "มีความสัมพันธ์/เชื่อมโยงกัน", note: "related = links (ความเชื่อมโยง) เขาต้องการรู้ว่านิทานเกี่ยวข้องกันไหม คำตอบคือ D (links)" }
    },
    33: {
        questionPhrase: { en: "which aspects of stories had fewest variations", th: "ส่วนใดของเรื่องเปลี่ยนแปลงน้อยที่สุด" },
        passagePhrase: { en: "explore how they have developed and altered over time", th: "สำรวจว่านิทานพัฒนาและเปลี่ยนแปลงไปอย่างไรตามเวลา" },
        pairs: [
          { q: "fewest variations", p: "altered over time", th: "การเปลี่ยนแปลงน้อยที่สุด" },
          { q: "aspects of the stories", p: "how they have developed", th: "ส่วนต่างๆ ของเรื่อง", note: "altered = variations ส่วนที่เปลี่ยนน้อยสุดคือมี variations น้อยสุด ตอบ F (variations)" },
        ],
        keyVocab: { word: "altered over time", th: "เปลี่ยนแปลงไปตามกาลเวลา", note: "altered = variations (การเปลี่ยนแปลง) ส่วนที่ 'เปลี่ยนน้อยที่สุด' คือมี variations น้อยที่สุด คำตอบ F (variations)" }
    },
    34: {
        questionPhrase: { en: "some events tended to change over time", th: "เหตุการณ์บางอย่างมักเปลี่ยนแปลงไปตามเวลา" },
        passagePhrase: { en: "lots of other details that can evolve quite freely", th: "รายละเอียดอื่นๆ จำนวนมากที่เปลี่ยนแปลงได้อย่างอิสระ" },
        pairs: [
          { q: "events", p: "Certain episodes", th: "เหตุการณ์ในเรื่อง" },
          { q: "tended to change over time", p: "evolve quite freely", th: "มักเปลี่ยนแปลงไปตามเวลา", note: "episodes ที่ evolve freely = events ที่เปลี่ยนแปลง ตอบ B (events)" },
          { q: "included in a story", p: "details", th: "ที่อยู่ในเรื่อง" },
        ],
        keyVocab: { word: "episodes / details that evolve", th: "เหตุการณ์/รายละเอียดในเรื่องที่เปลี่ยนไป", note: "episodes ในเรื่องที่ 'evolve freely' คือ events ที่เปลี่ยนแปลงตามเวลา ตรงกับ B (events)" }
    },
    35: {
        questionPhrase: { en: "parts that seemed to provide some sort of warning", th: "ส่วนที่ดูเหมือนจะให้คำเตือนบางอย่าง" },
        passagePhrase: { en: "such elements were just as flexible as seemingly trivial details", th: "องค์ประกอบเหล่านั้นเปลี่ยนแปลงง่ายพอๆ กับรายละเอียดที่ดูไม่สำคัญ" },
        pairs: [
          { q: "some sort of warning", p: "cautionary elements", th: "คำเตือนบางอย่าง", note: "warning = cautionary elements ส่วนที่ให้คำเตือนกลับเปลี่ยนง่ายและไม่สำคัญ ตอบ C (warning)" },
          { q: "were unimportant", p: "just as flexible as seemingly trivial details", th: "ไม่สำคัญ/เปลี่ยนได้ง่าย" },
        ],
        keyVocab: { word: "cautionary elements", th: "องค์ประกอบที่เป็นคำเตือน/สอนใจ", note: "ก่อนหน้าระบุ 'cautionary elements' (คำเตือนเรื่องอันตราย) ที่ยืดหยุ่นเปลี่ยนง่าย warning = cautionary จึงตอบ C (warning)" }
    },
    36: {
        questionPhrase: { en: "the aspect most important in a story's survival", th: "ส่วนที่สำคัญที่สุดต่อการอยู่รอดของนิทาน" },
        passagePhrase: { en: "fear – blood-thirsty and gruesome aspects... best preserved of all", th: "ความกลัว ความโหดเหี้ยมน่าขนลุก ถูกเก็บรักษาไว้ดีที่สุด" },
        pairs: [
          { q: "most important in a story's survival", p: "the best preserved of all", th: "สำคัญที่สุดต่อการอยู่รอดของนิทาน" },
          { q: "horror", p: "blood-thirsty and gruesome aspects", th: "ความสยองขวัญ/น่าขนลุก", note: "horror = fear, blood-thirsty and gruesome ซึ่งถูกเก็บรักษาดีที่สุด ตอบ G (horror)" },
        ],
        keyVocab: { word: "blood-thirsty and gruesome", th: "กระหายเลือดและน่าสยดสยอง", note: "fear/gruesome (ความน่าสยดสยอง) คือสิ่งที่อยู่รอดดีที่สุด horror = ความสยองขวัญ ตอบ G (horror)" }
    },
    37: {
        questionPhrase: { en: "looked at many forms of the same basic story", th: "ดูนิทานเรื่องเดียวกันในหลายๆ รูปแบบ" },
        passagePhrase: { en: "Little Red Riding Hood in its many forms", th: "หนูน้อยหมวกแดงในรูปแบบต่างๆ มากมาย" },
        pairs: [
          { q: "many different forms of the same basic story", p: "Little Red Riding Hood in its many forms", th: "หลายรูปแบบของนิทานเรื่องเดียวกัน", note: "many forms ของ LRRH เรื่องเดียว = many forms of the same basic story ตอบ B" },
          { q: "method", p: "analysis", th: "วิธีการ" },
        ],
        keyVocab: { word: "in its many forms", th: "ในหลากหลายรูปแบบ", note: "เขาวิเคราะห์นิทานเรื่องเดียว (LRRH) ใน 'many forms' = many different forms of the same basic story ตอบ B" }
    },
    38: {
        questionPhrase: { en: "features survive only if they have deeper significance", th: "องค์ประกอบจะอยู่รอดก็ต่อเมื่อมีความหมายลึกซึ้ง" },
        passagePhrase: { en: "they won't stick unless they matter", th: "มันจะไม่ติดทนถ้ามันไม่สำคัญจริงๆ" },
        pairs: [
          { q: "features of stories only survive", p: "they won’t stick", th: "องค์ประกอบของเรื่องจะอยู่รอด/ติดทน" },
          { q: "if they have a deeper significance", p: "unless they matter", th: "ก็ต่อเมื่อมันมีความสำคัญลึกซึ้ง", note: "stick = survive, matter = deeper significance Zipes บอกต้องสำคัญถึงจะอยู่รอด ตอบ D" },
        ],
        keyVocab: { word: "won't stick unless they matter", th: "จะไม่ติดทนถ้าไม่มีความสำคัญ", contrastA: "matter . samkhan (มีความสำคัญ/นัยลึกซึ้ง)", contrastB: "stick / survive . yu-rot (อยู่รอด/ติดทน)", note: "stick = survive และ matter = deeper significance Zipes บอกต้อง 'สำคัญ' ถึงจะอยู่รอด ตอบ D" }
    },
    39: {
        questionPhrase: { en: "to indicate Jack Zipes' theory is incorrect", th: "เพื่อชี้ว่าทฤษฎีของ Jack Zipes ไม่ถูกต้อง" },
        passagePhrase: { en: "it is not always true elsewhere... the villain is a woman... the victim is a boy", th: "ไม่จริงเสมอไปที่อื่น ผู้ร้ายเป็นผู้หญิง เหยื่อเป็นเด็กผู้ชาย" },
        pairs: [
          { q: "Jack Zipes’ theory is incorrect", p: "it is not always true elsewhere", th: "ทฤษฎีของ Zipes ไม่ถูกต้อง", note: "Zipes อ้างหญิงเป็นเหยื่อเสมอ แต่ Tehrani ชี้ว่า 'ไม่จริงเสมอไป' เพื่อหักล้าง ตอบ A" },
          { q: "Chinese and Japanese fairy tales", p: "In Chinese and Japanese versions", th: "นิทานจีนและญี่ปุ่น" },
        ],
        keyVocab: { word: "not always true elsewhere", th: "ไม่ได้เป็นจริงเสมอไปในที่อื่น", note: "Zipes อ้างผู้หญิงเป็นเหยื่อเสมอ แต่ Tehrani ยกตัวอย่างจีน/ญี่ปุ่นที่เหยื่อเป็นเด็กชาย เพื่อหักล้างทฤษฎีของ Zipes ตอบ A" }
    },
    40: {
        questionPhrase: { en: "a safe way of learning to deal with fear", th: "วิธีที่ปลอดภัยในการเรียนรู้รับมือกับความกลัว" },
        passagePhrase: { en: "feel afraid without having to experience real danger", th: "รู้สึกกลัวได้โดยไม่ต้องเจออันตรายจริง" },
        pairs: [
          { q: "learning to deal with fear", p: "teach us what it feels like to be afraid", th: "เรียนรู้ที่จะรับมือกับความกลัว" },
          { q: "a safe way", p: "without having to experience real danger", th: "วิธีที่ปลอดภัย", note: "เรียนรู้ความกลัวโดยไม่ต้องเจออันตรายจริง = วิธีปลอดภัย ตอบ A" },
        ],
        keyVocab: { word: "without having to experience real danger", th: "โดยไม่ต้องเผชิญอันตรายจริง", contrastA: "safe . plotphai (ปลอดภัย)", contrastB: "real danger . antaraai-jing (อันตรายจริง)", note: "การกลัวโดยไม่เจออันตรายจริง = วิธีปลอดภัยในการเรียนรู้รับมือความกลัว ตอบ A" }
    },
  },
  "Cambridge 15 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "they appear to have no moral standards", th: "ดูเหมือนพวกเขาไม่มีหลักศีลธรรมเลย" },
        passagePhrase: { en: "maximise money by damaging the environment and hurting people", th: "หากำไรสูงสุดด้วยการทำลายสิ่งแวดล้อมและทำร้ายผู้คน" },
        pairs: [
          { q: "moral standards", p: "damaging the environment and hurting people", th: "ทำลายสิ่งแวดล้อมและทำร้ายผู้คน = ไร้หลักศีลธรรม", note: "ธุรกิจยอมทำร้ายผู้คนและสิ่งแวดล้อมเพื่อเงิน = ไม่มี moral standards จึงตอบ D" },
          { q: "make money", p: "maximise the amount of money it makes", th: "ทำเงิน/หากำไรสูงสุด" },
        ],
        keyVocab: { word: "moral standards", th: "มาตรฐาน/หลักศีลธรรม", note: "ธุรกิจยอมทำร้ายผู้คนและสิ่งแวดล้อมเพื่อเงิน = ไม่มีหลักศีลธรรม จึงตอบ D (moral standards)" }
    },
    28: {
        questionPhrase: { en: "Lack of control by governments", th: "การขาดการควบคุมโดยรัฐบาล" },
        passagePhrase: { en: "if government regulation is ineffective", th: "ถ้าการกำกับดูแลของรัฐบาลไม่ได้ผล" },
        pairs: [
          { q: "control", p: "government regulation", th: "การกำกับดูแล/ควบคุมโดยรัฐบาล", note: "regulation ที่ไม่ได้ผล = การขาดการควบคุม (control) จึงตอบ E" },
          { q: "Lack of", p: "ineffective", th: "ขาด/ไม่ได้ผล" },
        ],
        keyVocab: { word: "regulation", th: "การกำกับดูแล/ควบคุม", note: "regulation ที่ไม่ได้ผล = การขาดการควบคุม (control) จึงตอบ E" }
    },
    29: {
        questionPhrase: { en: "lack of public involvement", th: "การขาดการมีส่วนร่วมของประชาชน" },
        passagePhrase: { en: "if the public doesn't care", th: "ถ้าประชาชนไม่ใส่ใจ" },
        pairs: [
          { q: "involvement", p: "the public doesn’t care", th: "ประชาชนไม่ใส่ใจ = ขาดการมีส่วนร่วม", note: "ประชาชนไม่ใส่ใจ = ขาด involvement จึงตอบ F" },
          { q: "public", p: "the public", th: "ประชาชน/สาธารณะ" },
        ],
        keyVocab: { word: "doesn't care", th: "ไม่ใส่ใจ/ไม่สนใจ", note: "ประชาชนไม่ใส่ใจ = ขาดการมีส่วนร่วม (involvement) จึงตอบ F" }
    },
    30: {
        questionPhrase: { en: "environmental problems such as overfishing", th: "ปัญหาสิ่งแวดล้อม เช่น การจับปลามากเกินไป" },
        passagePhrase: { en: "fishermen in an unmanaged fishery without quotas", th: "ชาวประมงในแหล่งประมงที่ไม่มีการจัดการและไม่มีโควตา" },
        pairs: [
          { q: "overfishing", p: "fishermen in an unmanaged fishery without quotas", th: "ประมงไร้โควตาไร้การจัดการ = จับปลาเกินขนาด", note: "fishery ที่ไม่มีโควตาและไม่มีการจัดการ = overfishing จึงตอบ H" },
          { q: "environmental problems", p: "unmanaged fishery", th: "ปัญหาสิ่งแวดล้อม/การประมงที่ไร้การจัดการ" },
        ],
        keyVocab: { word: "fishery without quotas", th: "การประมงที่ไม่มีโควตาจำกัด", note: "ประมงไร้โควตาไร้การจัดการ = จับปลาเกินขนาด (overfishing) จึงตอบ H" }
    },
    31: {
        questionPhrase: { en: "the destruction of trees", th: "การทำลายต้นไม้" },
        passagePhrase: { en: "logging companies with leases on tropical rainforest land", th: "บริษัทตัดไม้ที่เช่าพื้นที่ป่าฝนเขตร้อน" },
        pairs: [
          { q: "trees", p: "tropical rainforest land", th: "พื้นที่ป่าฝนเขตร้อน = ต้นไม้", note: "บริษัทตัดไม้ทำลายป่าฝน = การทำลายต้นไม้ (trees) จึงตอบ B" },
          { q: "destruction", p: "logging companies", th: "การทำลาย/บริษัทตัดไม้" },
        ],
        keyVocab: { word: "logging / rainforest", th: "การตัดไม้/ป่าฝน", note: "บริษัทตัดไม้ทำลายป่าฝน = การทำลายต้นไม้ (trees) จึงตอบ B" }
    },
    32: {
        questionPhrase: { en: "could be prevented by the action of ordinary people", th: "ป้องกันได้ด้วยการกระทำของคนธรรมดา" },
        passagePhrase: { en: "it is the public that has the power to make destructive policies unprofitable", th: "ประชาชนคือผู้มีอำนาจทำให้นโยบายทำลายล้างไม่ทำกำไร" },
        pairs: [
          { q: "ordinary people", p: "the public", th: "คนธรรมดา/ประชาชนทั่วไป" },
          { q: "could be prevented", p: "the power to make such destructive policies unprofitable and illegal", th: "สามารถป้องกัน/หยุดได้", note: "ย่อหน้าเน้นว่าประชาชนมีอำนาจหยุดปัญหาสิ่งแวดล้อม จึงตอบ C" },
          { q: "the action of", p: "either directly or through its politicians", th: "ด้วยการกระทำ (ทางตรงหรือผ่านนักการเมือง)" },
        ],
        keyVocab: { word: "the public has the power", th: "ประชาชนมีอำนาจ", note: "ย่อหน้าเน้นว่าประชาชน (ordinary people) มีอำนาจหยุดปัญหา จึงตอบ C" }
    },
    33: {
        questionPhrase: { en: "influence the environmental policies of businesses and governments", th: "มีอิทธิพลต่อนโยบายสิ่งแวดล้อมของธุรกิจและรัฐบาล" },
        passagePhrase: { en: "preferring their governments to award contracts to businesses with good environmental track record", th: "เลือกให้รัฐบาลมอบสัญญาแก่ธุรกิจที่มีประวัติด้านสิ่งแวดล้อมดี" },
        pairs: [
          { q: "influence the environmental policies of businesses and governments", p: "preferring their governments to award valuable contracts to businesses with a good environmental track record", th: "ผลักดันให้รัฐบาลและธุรกิจมีนโยบายสิ่งแวดล้อมที่ดี", note: "ตัวอย่างทั้งย่อหน้าคือการกดดันทั้งธุรกิจและรัฐบาล (influence both) จึงตอบ D" },
          { q: "governments", p: "their governments", th: "รัฐบาล" },
          { q: "businesses", p: "businesses", th: "ธุรกิจ" },
        ],
        keyVocab: { word: "preferring / pressing their governments", th: "การกดดัน/ผลักดันรัฐบาลและธุรกิจ", note: "ตัวอย่างทั้งย่อหน้าคือการกดดันทั้งธุรกิจและรัฐบาล (influence both) จึงตอบ D ไม่ใช่แค่ลดผลกระทบตนเอง" }
    },
    34: {
        questionPhrase: { en: "fast-food company forced suppliers to follow the law", th: "บริษัทฟาสต์ฟู้ดบังคับซัพพลายเออร์ให้ทำตามกฎหมาย" },
        passagePhrase: { en: "when a fast-food company made the demands, the meat industry complied within weeks", th: "เมื่อบริษัทฟาสต์ฟู้ดเรียกร้อง อุตสาหกรรมเนื้อก็ยอมทำตามในไม่กี่สัปดาห์" },
        pairs: [
          { q: "fast-food company", p: "a major fast-food company", th: "บริษัทฟาสต์ฟู้ด" },
          { q: "forced their meat suppliers", p: "the meat industry complied", th: "บังคับซัพพลายเออร์เนื้อให้ทำตาม", note: "เมื่อฟาสต์ฟู้ดเรียกร้อง อุตสาหกรรมเนื้อก็ยอมทำตาม (ตามกฎ FDA) จึงตอบ B" },
          { q: "to follow the law", p: "made the same demands", th: "ให้ปฏิบัติตามกฎหมาย/ข้อเรียกร้องเดียวกัน" },
        ],
        keyVocab: { word: "complied", th: "ยอมทำตาม/ปฏิบัติตาม", note: "meat industry ยอมทำตามคำสั่งฟาสต์ฟู้ด (ที่ตรงกับกฎ FDA) = ถูกบังคับให้ทำตามกฎหมาย จึงตอบ B" }
    },
    35: {
        questionPhrase: { en: "public should pay more to encourage good practices", th: "ประชาชนควรจ่ายแพงขึ้นเพื่อหนุนแนวปฏิบัติที่ดี" },
        passagePhrase: { en: "the public must accept higher prices to cover costs of sound environmental practices", th: "ประชาชนต้องยอมรับราคาที่สูงขึ้นเพื่อครอบคลุมต้นทุนของแนวปฏิบัติที่ดี" },
        pairs: [
          { q: "pay more for products", p: "higher prices for products", th: "จ่ายแพงขึ้นสำหรับสินค้า" },
          { q: "good environmental practices", p: "sound environmental practices", th: "แนวปฏิบัติด้านสิ่งแวดล้อมที่ดี" },
          { q: "should be prepared to", p: "must accept the necessity", th: "ควรพร้อม/ต้องยอมรับ", note: "ผู้เขียนเชื่อว่าประชาชนต้องยอมจ่ายแพงขึ้น ตรงกับโจทย์ จึงตอบ YES" },
        ],
        keyVocab: { word: "must accept higher prices", th: "ต้องยอมรับราคาที่สูงขึ้น", note: "ผู้เขียนเชื่อว่าประชาชนต้องยอมจ่ายแพงขึ้น ตรงกับข้อความ จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "contrast between moral principles of different businesses", th: "ความแตกต่างของหลักศีลธรรมระหว่างธุรกิจต่าง ๆ" },
        passagePhrase: { en: "businesses should act in accordance with moral principles", th: "ธุรกิจควรกระทำตามหลักศีลธรรม" },
        pairs: [
          { q: "moral principles", p: "moral principles", th: "หลักศีลธรรม" },
          { q: "businesses", p: "businesses", th: "ธุรกิจ", note: "ผู้เขียนพูดถึงศีลธรรมของธุรกิจโดยรวม ไม่เคยเปรียบเทียบศีลธรรมระหว่างธุรกิจต่าง ๆ จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "different businesses", th: "ธุรกิจที่ต่างกัน", note: "ผู้เขียนพูดถึงศีลธรรมของธุรกิจโดยรวม ไม่เคยเปรียบเทียบศีลธรรมระหว่างธุรกิจต่าง ๆ จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "important to distinguish acceptable and unacceptable behaviour", th: "สำคัญที่จะแยกพฤติกรรมที่ยอมรับได้กับยอมรับไม่ได้" },
        passagePhrase: { en: "my conclusion is not a moralistic one about who is right or wrong", th: "ข้อสรุปของฉันไม่ได้เป็นเรื่องศีลธรรมว่าใครถูกใครผิด" },
        pairs: [
          { q: "acceptable and unacceptable behaviour", p: "right or wrong", th: "พฤติกรรมที่ยอมรับได้/ไม่ได้ = ถูกหรือผิด" },
          { q: "make a clear distinction", p: "not a moralistic one", th: "แยกแยะให้ชัด vs ไม่ตัดสินศีลธรรม", note: "ผู้เขียนปฏิเสธว่าข้อสรุปไม่ใช่การตัดสินถูก-ผิด ขัดกับโจทย์ จึงตอบ NO" },
        ],
        keyVocab: { word: "not a moralistic one", th: "ไม่ใช่เรื่องตัดสินศีลธรรม", contrastA: "right or wrong . ถูกหรือผิด", contrastB: "not moralistic . ไม่ตัดสินศีลธรรม", note: "ผู้เขียนปฏิเสธว่าข้อสรุปไม่ใช่การตัดสินถูก-ผิด ขัดกับโจทย์ จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "public have successfully influenced businesses in the past", th: "ประชาชนเคยมีอิทธิพลต่อธุรกิจสำเร็จในอดีต" },
        passagePhrase: { en: "in the past, businesses have changed when the public came to expect different behaviour", th: "ในอดีตธุรกิจเปลี่ยนเมื่อประชาชนเริ่มคาดหวังพฤติกรรมที่ต่างออกไป" },
        pairs: [
          { q: "in the past", p: "In the past", th: "ในอดีต" },
          { q: "influenced businesses' environmental practices", p: "businesses have changed when the public came to expect and require different behaviour", th: "ทำให้ธุรกิจเปลี่ยนแนวปฏิบัติ", note: "ผู้เขียนยืนยันว่าในอดีตธุรกิจเปลี่ยนเพราะประชาชน = มีอิทธิพลสำเร็จ จึงตอบ YES" },
          { q: "The public", p: "the public", th: "ประชาชน" },
        ],
        keyVocab: { word: "businesses have changed", th: "ธุรกิจได้เปลี่ยนแปลงไปแล้ว", note: "ผู้เขียนยืนยันว่าในอดีตธุรกิจเปลี่ยนเพราะประชาชน = มีอิทธิพลสำเร็จ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "businesses will show more concern for the environment", th: "ธุรกิจจะใส่ใจสิ่งแวดล้อมมากขึ้น" },
        passagePhrase: { en: "changes in public attitudes will be essential for changes in businesses' practices", th: "การเปลี่ยนทัศนคติของประชาชนจำเป็นต่อการเปลี่ยนแนวปฏิบัติของธุรกิจ" },
        pairs: [
          { q: "In the future", p: "in the future", th: "ในอนาคต" },
          { q: "businesses will show more concern", p: "changes in public attitudes will be essential for changes in businesses’ environmental practices", th: "ธุรกิจจะเปลี่ยนก็ต่อเมื่อทัศนคติประชาชนเปลี่ยน", note: "ผู้เขียนบอกว่าธุรกิจจะเปลี่ยนเพราะประชาชน ไม่ได้บอกว่าจะใส่ใจมากขึ้นเอง จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "changes in public attitudes", th: "การเปลี่ยนทัศนคติของประชาชน", note: "ผู้เขียนทำนายว่าธุรกิจจะเปลี่ยนก็ต่อเมื่อประชาชนเปลี่ยน ไม่ได้บอกว่าธุรกิจจะใส่ใจมากขึ้นเอง จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "how public opinion can change businesses' environmental policies", th: "ความเห็นสาธารณะเปลี่ยนนโยบายสิ่งแวดล้อมของธุรกิจได้อย่างไร" },
        passagePhrase: { en: "the public can do that by suing businesses and buying sustainably harvested products", th: "ประชาชนทำได้ด้วยการฟ้องธุรกิจและซื้อสินค้าที่ผลิตอย่างยั่งยืน" },
        pairs: [
          { q: "public opinion", p: "The public", th: "ความเห็น/แรงกดดันของประชาชน" },
          { q: "change the environmental policies of big businesses", p: "The public can do that by suing businesses for harming them", th: "เปลี่ยนนโยบายสิ่งแวดล้อมของธุรกิจใหญ่", note: "ทั้งบทเน้นวิธีที่ประชาชนกดดันให้ธุรกิจเปลี่ยนนโยบาย จึงตอบ B" },
          { q: "big businesses", p: "businesses", th: "ธุรกิจขนาดใหญ่" },
        ],
        keyVocab: { word: "the public can do that", th: "ประชาชนสามารถทำสิ่งนั้นได้", note: "ทั้งบทเน้นวิธีที่ประชาชน (public opinion) กดดันให้ธุรกิจเปลี่ยนนโยบาย จึงตอบ B" }
    },
  },
  "Cambridge 16 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "the extent to which AI will alter the nature of work", th: "AI จะเปลี่ยนลักษณะของงานมากแค่ไหน" },
        passagePhrase: { en: "all workers will need to adapt as their occupations evolve", th: "คนทำงานทุกคนต้องปรับตัวเมื่ออาชีพของตนเปลี่ยนไป" },
        pairs: [
          { q: "AI will alter the nature of the work", p: "their occupations evolve", th: "AI ทำให้ลักษณะงานเปลี่ยนไป", note: "ย่อหน้าแรกเน้นว่างานจะ 'เปลี่ยนลักษณะ' (evolve, adapt) ไม่ใช่ชนิดงานหรือสัดส่วน จึงตอบ B" },
          { q: "the work that people do", p: "all workers will need to adapt", th: "งานที่ผู้คนทำ" },
          { q: "the extent to which", p: "as their occupations evolve alongside increasingly capable machines", th: "มากน้อยเพียงใด" },
        ],
        keyVocab: { word: "evolve / adapt", th: "วิวัฒน์ / ปรับตัวเปลี่ยนแปลง", note: "ย่อหน้าแรกเน้นว่างานจะ 'เปลี่ยนลักษณะ' (evolve, adapt) ไม่ใช่บอกชนิดงานหรือสัดส่วน จึงตอบ B" }
    },
    28: {
        questionPhrase: { en: "a key factor driving current developments in the workplace", th: "ปัจจัยสำคัญที่ขับเคลื่อนความเปลี่ยนแปลงในที่ทำงานตอนนี้" },
        passagePhrase: { en: "some of the most fundamental changes are happening as a result", th: "ความเปลี่ยนแปลงพื้นฐานที่สุดบางอย่างกำลังเกิดขึ้นเพราะสิ่งนี้" },
        pairs: [
          { q: "a key factor driving current developments", p: "some of the most fundamental changes are happening as a result", th: "ปัจจัยสำคัญที่ขับเคลื่อนความเปลี่ยนแปลง", note: "'fundamental changes ... as a result' = ปัจจัยหลักขับเคลื่อน จึงตอบ D" },
          { q: "knowledge economy", p: "the so-called knowledge economy", th: "เศรษฐกิจฐานความรู้" },
          { q: "in the workplace", p: "jobs that are dependent on data rather than on production", th: "ในที่ทำงาน / ในงาน" },
        ],
        keyVocab: { word: "fundamental changes", th: "ความเปลี่ยนแปลงพื้นฐานสำคัญ", note: "'fundamental changes' = 'key factor driving developments' จึงตอบ D ว่าเศรษฐกิจความรู้เป็นปัจจัยหลักขับเคลื่อนการเปลี่ยนแปลง" }
    },
    29: {
        questionPhrase: { en: "staff making sure AI produces the results they want", th: "พนักงานทำให้ AI ได้ผลลัพธ์ตามที่ตัวเองต้องการ" },
        passagePhrase: { en: "workers feed the algorithm with false data to reach their targets", th: "คนงานป้อนข้อมูลเท็จให้อัลกอริทึมเพื่อให้ถึงเป้า" },
        pairs: [
          { q: "staff making sure that AI produces the results that they want", p: "feed the algorithm with false data to reach their targets", th: "พนักงานทำให้ AI ได้ผลลัพธ์ตามที่ตนต้องการ", note: "ป้อนข้อมูลเท็จเพื่อให้ถึงเป้า = บังคับให้ AI ออกผลตามต้องการ จึงตอบ C" },
          { q: "the results that they want", p: "to reach their targets", th: "ผลลัพธ์ที่ตนต้องการ / เป้าหมาย" },
          { q: "AI", p: "the algorithm", th: "อัลกอริทึม / AI" },
        ],
        keyVocab: { word: "feed false data to reach targets", th: "ป้อนข้อมูลปลอมเพื่อให้ได้เป้าหมาย", note: "การ 'ป้อนข้อมูลเท็จเพื่อถึงเป้า' คือการบังคับให้ AI ออกผลตามที่ต้องการ จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "how changes in the job market can be successfully handled", th: "วิธีรับมือกับความเปลี่ยนแปลงในตลาดงานให้สำเร็จ" },
        passagePhrase: { en: "governments seizing the opportunity to improve policy to enforce good job security", th: "รัฐบาลคว้าโอกาสปรับนโยบายเพื่อสร้างความมั่นคงในงาน" },
        pairs: [
          { q: "changes in the job market can be successfully handled", p: "improve policy to enforce good job security", th: "รับมือความเปลี่ยนแปลงในตลาดงานได้สำเร็จ", note: "เสนอให้รัฐปรับนโยบายรับมือความเปลี่ยนแปลง = จัดการตลาดงานได้สำเร็จ จึงตอบ D" },
          { q: "changes in the job market", p: "change to jobs as a result of AI and robotics", th: "ความเปลี่ยนแปลงในตลาดงาน" },
          { q: "successfully handled", p: "seizing the opportunity to improve policy", th: "จัดการได้สำเร็จ" },
        ],
        keyVocab: { word: "improve policy / new policies", th: "ปรับปรุงนโยบาย / นโยบายใหม่", note: "McGaughey เสนอให้รัฐใช้นโยบายที่ดีรับมือการเปลี่ยนแปลง = วิธีจัดการตลาดงานให้สำเร็จ จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "jobs which rely not on production but on ___", th: "งานที่ไม่ได้พึ่งการผลิต แต่พึ่งสิ่งนี้" },
        passagePhrase: { en: "jobs that are dependent on data rather than on production", th: "งานที่ขึ้นกับข้อมูลมากกว่าการผลิต" },
        pairs: [
          { q: "rely not on production but on", p: "dependent on data rather than on production", th: "ไม่ได้พึ่งการผลิต แต่พึ่งสิ่งนี้", note: "'dependent on data' ตรงกับตัวเลือก G information จึงเติม G" },
          { q: "information", p: "dependent on data", th: "ข้อมูล" },
        ],
        keyVocab: { word: "data = information", th: "ข้อมูล", note: "passage บอก 'dependent on data' ตรงกับตัวเลือก G information จึงเติม G" }
    },
    32: {
        questionPhrase: { en: "a growing ___ on the recommendations made by AI", th: "การพึ่งพา AI ที่เพิ่มขึ้นตามคำแนะนำของมัน" },
        passagePhrase: { en: "become dependent on its instructions", th: "เริ่มพึ่งพาคำสั่งของอัลกอริทึม" },
        pairs: [
          { q: "on the recommendations made by AI", p: "become dependent on its instructions", th: "ตามคำแนะนำที่ AI ให้", note: "'become dependent' = คำนาม reliance จึงเติม E reliance" },
          { q: "learn through the 'algorithm's eyes'", p: "learn through the ‘algorithm’s eyes’", th: "เรียนรู้ผ่านมุมมองของอัลกอริทึม" },
        ],
        keyVocab: { word: "dependent = reliance", th: "การพึ่งพา", note: "'become dependent' = คำนาม reliance จึงเติม E reliance" }
    },
    33: {
        questionPhrase: { en: "staff deterred from experimenting and using their own ___", th: "พนักงานถูกห้ามไม่ให้ทดลองและใช้สิ่งนี้ของตนเอง" },
        passagePhrase: { en: "experimentation and human instinct lead to progress and new ideas", th: "การทดลองและสัญชาตญาณของมนุษย์นำไปสู่ความก้าวหน้าและไอเดียใหม่" },
        pairs: [
          { q: "deterred from experimenting", p: "experimentation ... are effectively discouraged", th: "ถูกห้ามไม่ให้ทดลอง", note: "'human instinct' เป็นคำพ้องของ intuition จึงเติม C intuition" },
          { q: "using their own", p: "human instinct", th: "สัญชาตญาณของตนเอง" },
          { q: "prevented from achieving innovation", p: "lead to progress and new ideas", th: "ถูกขัดขวางไม่ให้เกิดนวัตกรรม" },
        ],
        keyVocab: { word: "human instinct = intuition", th: "สัญชาตญาณ / ลางสังหรณ์ของมนุษย์", note: "'human instinct' เป็นคำพ้องของ intuition จึงเติม C intuition" }
    },
    34: {
        questionPhrase: { en: "increase users' ___ with regard to the technology", th: "เพิ่มสิ่งนี้ของผู้ใช้ที่มีต่อเทคโนโลยี" },
        passagePhrase: { en: "make AI technologies more trustworthy and transparent", th: "ทำให้เทคโนโลยี AI น่าเชื่อถือและโปร่งใสขึ้น" },
        pairs: [
          { q: "decision-making process easier to comprehend", p: "understand how AI decisions are made", th: "เข้าใจวิธีที่ AI ตัดสินใจได้ง่ายขึ้น", note: "ทำให้ AI 'trustworthy' = เพิ่ม confidence ของผู้ใช้ จึงเติม F confidence" },
          { q: "users' confidence", p: "more trustworthy and transparent", th: "ความเชื่อมั่นของผู้ใช้" },
        ],
        keyVocab: { word: "trustworthy = confidence", th: "น่าเชื่อถือ / ความเชื่อมั่น", note: "ทำให้ AI 'trustworthy' = เพิ่ม confidence ของผู้ใช้ จึงเติม F confidence" }
    },
    35: {
        questionPhrase: { en: "more automation will not result in lower employment", th: "การใช้เครื่องจักรมากขึ้นจะไม่ทำให้การจ้างงานลดลง" },
        passagePhrase: { en: "that doesn't mean we are left with just 50 jobs for humans", th: "ไม่ได้แปลว่าจะเหลืองานให้มนุษย์แค่ 50 ตำแหน่ง" },
        pairs: [
          { q: "will not result in lower employment", p: "doesn’t mean we are left with just 50 jobs for humans", th: "จะไม่ทำให้การจ้างงานลดลง", note: "Low บอกความคิดว่างานหายเพราะหุ่นยนต์เป็น 'fallacy' จึงตอบ B (Hamish Low)" },
          { q: "Greater levels of automation", p: "half of 100 jobs are being carried out by robots", th: "การใช้เครื่องจักรอัตโนมัติมากขึ้น" },
          { q: "not result in", p: "founded on a fallacy", th: "ไม่ได้นำไปสู่ (เป็นความเชื่อผิด)" },
        ],
        keyVocab: { word: "the number of jobs is fixed (a fallacy)", th: "ความเชื่อผิดๆ ว่าจำนวนงานตายตัว", note: "Low บอกความคิดว่างานหายเพราะหุ่นยนต์เป็น 'fallacy' = หุ่นยนต์มากขึ้นไม่ทำให้งานน้อยลง จึงตอบ B (Hamish Low)" }
    },
    36: {
        questionPhrase: { en: "several reasons why AI is appealing to businesses", th: "หลายเหตุผลที่ทำให้ AI น่าดึงดูดสำหรับธุรกิจ" },
        passagePhrase: { en: "In many cases, they can outperform humans", th: "ในหลายกรณี อัลกอริทึมทำได้ดีกว่ามนุษย์" },
        pairs: [
          { q: "AI is appealing to businesses", p: "they can outperform humans", th: "AI น่าดึงดูดสำหรับธุรกิจ", note: "Pachidi ชี้ข้อดีหลายอย่างของ AI (เก่งกว่าคน) = เหตุผลที่ธุรกิจอยากใช้ จึงตอบ A (Pachidi)" },
          { q: "several reasons", p: "In many cases", th: "หลายเหตุผล / หลายกรณี" },
        ],
        keyVocab: { word: "outperform humans", th: "ทำได้ดีกว่ามนุษย์", note: "Pachidi ชี้ข้อดีหลายอย่างของ AI (เก่งกว่าคน ทำงานที่เคยต้องใช้คน) = เหตุผลที่ธุรกิจอยากใช้ จึงตอบ A (Pachidi)" }
    },
    37: {
        questionPhrase: { en: "AI's potential parallels major cultural shifts of previous eras", th: "ศักยภาพของ AI เทียบได้กับการเปลี่ยนแปลงครั้งใหญ่ในยุคก่อน" },
        passagePhrase: { en: "Just as the industrial revolution... a third revolution has been pronounced", th: "เช่นเดียวกับการปฏิวัติอุตสาหกรรม การปฏิวัติครั้งที่สามได้ถูกประกาศแล้ว" },
        pairs: [
          { q: "major cultural shifts which occurred in previous eras", p: "the industrial revolution ... the corporate revolution", th: "การเปลี่ยนแปลงครั้งใหญ่ในยุคก่อน", note: "McGaughey เทียบ AI กับการปฏิวัติในอดีต จึงตอบ C (McGaughey)" },
          { q: "AI's potential to transform people's lives", p: "a third revolution has been pronounced", th: "ศักยภาพของ AI ที่จะเปลี่ยนชีวิตผู้คน" },
          { q: "has parallels with", p: "Just as", th: "เทียบเคียงได้กับ" },
        ],
        keyVocab: { word: "revolution (industrial / corporate / third)", th: "การปฏิวัติ (อุตสาหกรรม / องค์กร / ครั้งที่สาม)", note: "McGaughey เทียบ AI กับการปฏิวัติอุตสาหกรรมในอดีต = การเปลี่ยนแปลงทางวัฒนธรรมครั้งใหญ่ จึงตอบ C (McGaughey)" }
    },
    38: {
        questionPhrase: { en: "be aware of the range of problems that AI causes", th: "ตระหนักถึงปัญหาหลายด้านที่ AI ก่อขึ้น" },
        passagePhrase: { en: "these enhancements are not without consequences... Another issue is", th: "ข้อดีเหล่านี้ไม่ใช่ว่าไม่มีผลตามมา... อีกประเด็นหนึ่งคือ" },
        pairs: [
          { q: "the range of problems that AI causes", p: "not without consequences", th: "ปัญหาหลายด้านที่ AI ก่อขึ้น", note: "Pachidi ชี้ปัญหาหลายอย่างของ AI (consequences, another issue) จึงตอบ A (Pachidi)" },
          { q: "important to be aware of", p: "Another issue is the extent to which the technology influences or even controls the workforce", th: "สำคัญที่ต้องตระหนัก" },
        ],
        keyVocab: { word: "consequences / another issue", th: "ผลตามมา / อีกประเด็นปัญหา", note: "Pachidi ชี้ปัญหาหลายอย่างของ AI (consequences, another issue) = ต้องตระหนักถึงปัญหาหลายด้าน จึงตอบ A (Pachidi)" }
    },
    39: {
        questionPhrase: { en: "follow a less conventional career path than in the past", th: "เดินเส้นทางอาชีพที่ไม่เป็นแบบเดิมเหมือนในอดีต" },
        passagePhrase: { en: "The traditional trajectory... is a thing of the past", th: "เส้นทางอาชีพแบบดั้งเดิม... เป็นเรื่องของอดีตไปแล้ว" },
        pairs: [
          { q: "a less conventional career path", p: "The traditional trajectory", th: "เส้นทางอาชีพที่ไม่เป็นแบบเดิม", note: "Low บอกเส้นทาง 'traditional' หมดยุค จึงตอบ B (Hamish Low)" },
          { q: "than in the past", p: "is a thing of the past", th: "เมื่อเทียบกับในอดีต" },
          { q: "going to follow", p: "major transitions across the whole life course", th: "กำลังจะเดินตาม / เปลี่ยนไป" },
        ],
        keyVocab: { word: "traditional trajectory is a thing of the past", th: "เส้นทางอาชีพแบบดั้งเดิมหมดยุคแล้ว", contrastA: "traditional . แบบดั้งเดิม", contrastB: "multistage / by choice . หลายช่วงตามที่เลือกเอง", note: "Low บอกเส้นทาง 'traditional' หมดยุค แทนด้วยอาชีพหลายช่วง = career path ที่ less conventional จึงตอบ B (Hamish Low)" }
    },
    40: {
        questionPhrase: { en: "authorities should ensure adequately paid work for everyone", th: "ผู้มีอำนาจควรทำให้ทุกคนมีงานที่ได้ค่าจ้างพอเพียง" },
        passagePhrase: { en: "leaders... with bold new policies that guarantee full employment, fair incomes", th: "ผู้นำ... ด้วยนโยบายใหม่ที่กล้าหาญซึ่งรับประกันการจ้างงานเต็มที่และรายได้ที่เป็นธรรม" },
        pairs: [
          { q: "adequately paid work for everyone", p: "guarantee full employment, fair incomes", th: "งานที่ได้ค่าจ้างพอเพียงสำหรับทุกคน", note: "McGaughey เรียกร้องให้ผู้นำออกนโยบายรับประกันงานและรายได้เป็นธรรม จึงตอบ C (McGaughey)" },
          { q: "Authorities should take measures", p: "leaders of organisations, governments and banks to pre-empt the coming changes with bold new policies", th: "ผู้มีอำนาจควรลงมือทำ" },
          { q: "ensure", p: "guarantee", th: "ทำให้แน่ใจ / รับประกัน" },
        ],
        keyVocab: { word: "guarantee full employment, fair incomes", th: "รับประกันการจ้างงานเต็มที่และรายได้ที่เป็นธรรม", note: "McGaughey เรียกร้องให้ผู้นำ/รัฐออกนโยบายรับประกันงานและรายได้เป็นธรรม = งานที่ได้ค่าจ้างพอเพียงสำหรับทุกคน จึงตอบ C (McGaughey)" }
    },
  },
  "Cambridge 16 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "a basic assumption about wisdom may be wrong", th: "ความเชื่อพื้นฐานเกี่ยวกับปัญญาอาจผิด" },
        passagePhrase: { en: "it isn't an exceptional trait possessed by a small handful of philosophers", th: "มันไม่ใช่คุณสมบัติพิเศษที่มีแค่นักปรัชญาไม่กี่คน" },
        pairs: [
          { q: "basic assumption", p: "exceptional trait possessed by a small handful of bearded philosophers", th: "ความเชื่อเดิมที่ว่าปัญญาเป็นของคนพิเศษไม่กี่คน" },
          { q: "may be wrong", p: "isn’t an exceptional trait possessed by a small handful of bearded philosophers after all", th: "ที่จริงแล้วไม่เป็นเช่นนั้น (ลบล้างสมมติฐาน)", note: "ผู้เขียนหักล้างความเชื่อเดิมที่ว่าปัญญามีเฉพาะคนพิเศษ จึงตอบ B (สมมติฐานพื้นฐานอาจผิด)" },
          { q: "wisdom", p: "most of us have the ability to make wise decisions", th: "คนส่วนใหญ่ก็มีปัญญาในการตัดสินใจได้" },
        ],
        keyVocab: { word: "isn't an exceptional trait after all", th: "ที่จริงแล้วไม่ใช่คุณสมบัติพิเศษเฉพาะคน", note: "ผู้เขียนลบล้างสมมติฐานเดิมที่ว่าปัญญาเป็นของคนพิเศษไม่กี่คน จึงตอบ B (สมมติฐานพื้นฐานอาจผิด)" }
    },
    28: {
        questionPhrase: { en: "importance of certain influences was underestimated", th: "ความสำคัญของบางปัจจัยถูกประเมินต่ำเกินไป" },
        passagePhrase: { en: "even more powerful in shaping wisdom than previously imagined", th: "ทรงพลังต่อการสร้างปัญญามากกว่าที่เคยคิดไว้" },
        pairs: [
          { q: "certain influences", p: "experiential, situational, and cultural factors", th: "ปัจจัยด้านประสบการณ์ สถานการณ์ และวัฒนธรรม" },
          { q: "importance", p: "even more powerful in shaping wisdom", th: "ความสำคัญ/พลังในการสร้างปัญญา" },
          { q: "underestimated", p: "than previously imagined", th: "มากกว่าที่เคยคิดไว้ (เคยประเมินต่ำไป)", note: "'more powerful than previously imagined' = อิทธิพลเหล่านี้เคยถูกประเมินต่ำไป จึงตอบ C" },
        ],
        keyVocab: { word: "than previously imagined", th: "มากกว่าที่เคยคิด/จินตนาการไว้", note: "วลี 'more powerful than previously imagined' = อิทธิพลถูกประเมินต่ำไปก่อนหน้านี้ จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "will be different in different circumstances", th: "จะต่างกันไปตามสถานการณ์ที่ต่างกัน" },
        passagePhrase: { en: "ability to reason wisely varies dramatically across situational contexts", th: "ความสามารถในการคิดอย่างมีปัญญาผันแปรมากตามบริบทของสถานการณ์" },
        pairs: [
          { q: "level of wisdom an individual shows", p: "ability to reason wisely", th: "ความสามารถในการคิดอย่างมีปัญญา" },
          { q: "will be different", p: "varies dramatically", th: "ผันแปร/แตกต่างกันอย่างมาก", note: "'varies dramatically across contexts' = ต่างกันในแต่ละสถานการณ์ จึงตอบ B" },
          { q: "in different circumstances", p: "across experiential and situational contexts", th: "ตามบริบทของสถานการณ์ที่ต่างกัน" },
        ],
        keyVocab: { word: "varies dramatically across contexts", th: "ผันแปรอย่างมากตามบริบท", note: "'varies across contexts' = ต่างกันในแต่ละสถานการณ์ ตรงกับ B" }
    },
    30: {
        questionPhrase: { en: "a recommended strategy to help reason wisely", th: "กลยุทธ์ที่แนะนำเพื่อช่วยให้คิดอย่างมีปัญญา" },
        passagePhrase: { en: "one of the most reliable ways to support wisdom", th: "หนึ่งในวิธีที่เชื่อถือได้ที่สุดในการเสริมปัญญา" },
        pairs: [
          { q: "recommended strategy", p: "one of the most reliable ways", th: "วิธีที่แนะนำ/เชื่อถือได้ที่สุด", note: "'most reliable way to support wisdom' = กลยุทธ์ที่แนะนำ จึงตอบ D" },
          { q: "help people to reason wisely", p: "to support wisdom in our own day-to-day decisions", th: "ช่วยให้ตัดสินใจอย่างมีปัญญา" },
          { q: "strategy", p: "look at scenarios from a third-party perspective", th: "มองสถานการณ์จากมุมมองบุคคลที่สาม" },
        ],
        keyVocab: { word: "most reliable ways to support wisdom", th: "วิธีที่เชื่อถือได้ที่สุดในการเสริมปัญญา", note: "'most reliable way to support wisdom' = กลยุทธ์ที่แนะนำ (recommended strategy) จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "a certain degree of ... regarding the extent of our knowledge", th: "ความ...ในระดับหนึ่งเกี่ยวกับขอบเขตความรู้ของเรา" },
        passagePhrase: { en: "intellectual humility or recognition of the limits of our own knowledge", th: "ความถ่อมตนทางปัญญา คือการยอมรับขีดจำกัดความรู้ของตน" },
        pairs: [
          { q: "a certain degree of modesty", p: "intellectual humility", th: "ความถ่อมตน/เจียมตนทางปัญญา", note: "'intellectual humility' = modesty (ความเจียมตน) จึงตอบ D" },
          { q: "regarding the extent of our knowledge", p: "recognition of the limits of our own knowledge", th: "การยอมรับขีดจำกัดความรู้ของตน" },
        ],
        keyVocab: { word: "humility = modesty", th: "ความถ่อมตน/ความเจียมตน", note: "'intellectual humility' ตรงกับตัวเลือก D modesty (ความเจียมตน) จึงตอบ D" }
    },
    32: {
        questionPhrase: { en: "take into account ... which may not be the same as our own", th: "คำนึงถึง...ที่อาจไม่เหมือนของเราเอง" },
        passagePhrase: { en: "appreciation of perspectives wider than the issue at hand", th: "การเห็นคุณค่าของมุมมองที่กว้างกว่าประเด็นตรงหน้า" },
        pairs: [
          { q: "take into account opinions", p: "appreciation of perspectives", th: "การให้คุณค่ากับมุมมอง/ความคิดเห็น", note: "ช่องนี้ต้องการสิ่งที่ 'may not be the same as our own' = ความคิดเห็นของผู้อื่น จึงตอบ A opinions" },
          { q: "which may not be the same as our own", p: "wider than the issue at hand", th: "ที่กว้างกว่าประเด็นตรงหน้า (ไม่จำกัดแค่ของเรา)" },
        ],
        keyVocab: { word: "perspectives = opinions", th: "มุมมอง/ความคิดเห็น", note: "ช่องว่างนี้ต้องการสิ่งที่ 'may not be the same as our own' = ความคิดเห็นของคนอื่น (opinions) จึงตอบ A" }
    },
    33: {
        questionPhrase: { en: "able to take a broad ... of any situation", th: "สามารถมอง...ที่กว้างของทุกสถานการณ์" },
        passagePhrase: { en: "appreciation of perspectives wider than the issue at hand", th: "การเห็นคุณค่าของมุมมองที่กว้างกว่าประเด็นตรงหน้า" },
        pairs: [
          { q: "broad view", p: "perspectives wider than the issue at hand", th: "มุมมองที่กว้างกว่าประเด็นตรงหน้า", note: "'broad ... of any situation' + 'wider perspectives' = มุมมองกว้าง (view) จึงตอบ C" },
          { q: "of any situation", p: "the issue at hand", th: "ประเด็น/สถานการณ์ตรงหน้า" },
        ],
        keyVocab: { word: "perspectives wider = broad view", th: "มุมมองที่กว้าง", note: "'broad ... of any situation' + 'wider perspectives' = มุมมองกว้าง (view) จึงตอบ C" }
    },
    34: {
        questionPhrase: { en: "better to regard scenarios with ...", th: "ควรพิจารณาสถานการณ์ด้วย..." },
        passagePhrase: { en: "look at scenarios from a third-party perspective", th: "มองสถานการณ์จากมุมมองของบุคคลที่สาม" },
        pairs: [
          { q: "objectivity", p: "third-party perspective", th: "มุมมองบุคคลที่สาม = ความเป็นกลาง/วัตถุวิสัย", note: "การมองแบบบุคคลที่สามคือการมองอย่างเป็นกลาง จึงตอบ F objectivity" },
          { q: "regard scenarios with", p: "look at scenarios", th: "พิจารณา/มองสถานการณ์" },
        ],
        keyVocab: { word: "third-party perspective = objectivity", th: "มุมมองคนนอก = ความเป็นกลาง/วัตถุวิสัย", note: "การมองแบบบุคคลที่สาม (third-party) คือการมองอย่างเป็นกลาง จึงตอบ F objectivity" }
    },
    35: {
        questionPhrase: { en: "we focus more on ... and on other moral ideals", th: "เรามุ่งความสนใจไปที่...และอุดมคติทางศีลธรรมอื่น ๆ" },
        passagePhrase: { en: "moral ideals such as justice and impartiality", th: "อุดมคติทางศีลธรรม เช่น ความยุติธรรมและความเที่ยงธรรม" },
        pairs: [
          { q: "other moral ideals", p: "moral ideals such as justice and impartiality", th: "อุดมคติทางศีลธรรม เช่น ความยุติธรรม" },
          { q: "fairness", p: "justice", th: "ความยุติธรรม/ความเป็นธรรม", note: "'justice' ในเนื้อเรื่องตรงกับ fairness และเป็นอุดมคติคู่กับ moral ideals จึงตอบ G" },
          { q: "avoiding the first-person perspective", p: "we adopt a third-person, ‘observer’ viewpoint", th: "ใช้มุมมองบุคคลที่สามแทนมุมมองตนเอง" },
        ],
        keyVocab: { word: "justice = fairness", th: "ความยุติธรรม/ความเป็นธรรม", note: "'justice' ในเนื้อเรื่องตรงกับ fairness และ 'other moral ideals' ในสรุปบอกว่าช่องนี้คืออุดมคติหนึ่ง จึงตอบ G fairness" }
    },
    36: {
        questionPhrase: { en: "students could choose one of two perspectives", th: "นักศึกษาเลือกมุมมองหนึ่งจากสองแบบได้เอง" },
        passagePhrase: { en: "group assigned to the 'distant observer' role", th: "กลุ่มที่ถูกกำหนดให้รับบท 'ผู้สังเกตการณ์จากระยะไกล'" },
        pairs: [
          { q: "could choose", p: "assigned to the ‘distant observer’ role", th: "ถูกกำหนด/มอบหมาย (ไม่ได้เลือกเอง)", note: "นักศึกษา 'ถูกกำหนด' (assigned) บทบาท ไม่ได้เลือกเอง ขัดกับโจทย์ จึงตอบ FALSE" },
          { q: "two perspectives", p: "‘distant observer’", th: "มุมมองผู้สังเกตการณ์จากระยะไกล" },
        ],
        keyVocab: { word: "assigned", th: "ถูกมอบหมาย/กำหนดให้", contrastA: "assigned . thuk-kamnod-hai (ถูกกำหนดให้)", contrastB: "choose . lueak-eng (เลือกเอง)", note: "นักศึกษา 'ถูกกำหนด' (assigned) ให้รับบท ไม่ได้เลือกเอง จึงขัดกับโจทย์ ตอบ FALSE" }
    },
    37: {
        questionPhrase: { en: "participants knew they were in a wise-reasoning study", th: "ผู้ร่วมการทดลองรู้ว่าตนอยู่ในงานวิจัยเรื่องการคิดอย่างมีปัญญา" },
        passagePhrase: { en: "couples were instructed to visualize an unresolved relationship conflict", th: "คู่รักถูกสั่งให้นึกภาพความขัดแย้งที่ยังไม่คลี่คลาย" },
        pairs: [
          { q: "couples experiment", p: "couples in long-term romantic relationships", th: "การทดลองกับคู่รัก" },
          { q: "taking part in a", p: "instructed to visualize an unresolved relationship conflict", th: "ถูกสั่งให้นึกภาพความขัดแย้ง (แต่ไม่บอกว่ารู้จุดประสงค์)", note: "เนื้อเรื่องไม่ระบุว่าผู้ร่วมทดลองรู้หรือไม่ว่ากำลังศึกษาการคิดมีปัญญา จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "aware of the study's purpose", th: "รู้วัตถุประสงค์ของงานวิจัย", note: "เนื้อเรื่องไม่ได้บอกว่าผู้ร่วมทดลองรู้หรือไม่รู้ว่ากำลังศึกษาเรื่องอะไร จึงตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "length of the couples' relationships affected the results", th: "ระยะเวลาความสัมพันธ์ของคู่รักมีผลต่อผลลัพธ์" },
        passagePhrase: { en: "couples in the 'other's eyes' condition were more likely to rely on wise reasoning", th: "คู่ในเงื่อนไข 'มองด้วยตาคนอื่น' มีแนวโน้มใช้การคิดอย่างมีปัญญามากกว่า" },
        pairs: [
          { q: "length of the couples’ relationships", p: "long-term romantic relationships", th: "ความสัมพันธ์ระยะยาว" },
          { q: "had an impact on the results", p: "more likely to rely on wise reasoning", th: "มีผลต่อผลลัพธ์ (แต่ไม่ได้เทียบความยาวสั้น)", note: "เนื้อเรื่องบอกแค่ว่าเป็นคู่ระยะยาว ไม่ได้เทียบว่าความยาวมีผลต่อผลลัพธ์ จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "length of relationship had an impact", th: "ระยะเวลาความสัมพันธ์มีผล", note: "เนื้อเรื่องบอกแค่ว่าเป็น 'long-term' แต่ไม่ได้เปรียบเทียบว่าความยาวสั้นต่างมีผลต่อผลลัพธ์ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "detached viewpoint led to wiser decisions", th: "มุมมองที่ห่าง/เป็นกลางนำไปสู่การตัดสินใจที่มีปัญญากว่า" },
        passagePhrase: { en: "Ego-decentering promotes greater focus on others ... recognition of ... change", th: "การถอยออกจากตัวตนส่งเสริมให้สนใจผู้อื่นและตระหนักถึงการเปลี่ยนแปลง" },
        pairs: [
          { q: "more detached viewpoint", p: "Ego-decentering", th: "การถอยออกจากตัวตน = มุมมองที่ห่าง", note: "ทั้งสองการทดลองยืนยันว่ามุมมองแบบห่าง/ถอยจากตัวตนให้การคิดที่มีปัญญากว่า จึงตอบ TRUE" },
          { q: "make wiser decisions", p: "rely on wise reasoning", th: "ใช้การคิดอย่างมีปัญญา" },
          { q: "in both experiments", p: "enables a bigger picture, conceptual view", th: "ช่วยให้มองภาพรวมกว้างขึ้น" },
        ],
        keyVocab: { word: "ego-decentering = detached viewpoint", th: "การถอยออกจากตัวตน = มุมมองที่ห่าง", note: "ทั้งสองการทดลองยืนยันว่ามุมมองแบบ distant observer / ego-decentering ให้การคิดที่มีปัญญากว่า จึงตอบ TRUE" }
    },
    40: {
        questionPhrase: { en: "intelligence determines wisdom only to a limited extent", th: "สติปัญญากำหนดความมีปัญญาได้เพียงเล็กน้อยเท่านั้น" },
        passagePhrase: { en: "only a small positive relationship between wise thinking and crystallized intelligence", th: "มีความสัมพันธ์เชิงบวกเพียงเล็กน้อยระหว่างการคิดมีปัญญากับสติปัญญา" },
        pairs: [
          { q: "intelligence", p: "crystallized intelligence", th: "สติปัญญา" },
          { q: "to only a very limited extent", p: "only a small positive relationship", th: "มีความสัมพันธ์เพียงเล็กน้อย", note: "'only a small positive relationship' = สติปัญญ ามีผลจำกัด ตรงกับโจทย์ จึงตอบ TRUE" },
          { q: "determined by", p: "relationship between wise thinking and crystallized intelligence", th: "ความเชื่อมโยงระหว่างปัญญากับสติปัญญา" },
        ],
        keyVocab: { word: "only a small relationship", th: "ความสัมพันธ์เพียงเล็กน้อย", note: "'only a small positive relationship' = สติปัญญามีผลจำกัด ตรงกับโจทย์ จึงตอบ TRUE" }
    },
  },
  "Cambridge 16 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "discovery caused surprise among other scientists", th: "การค้นพบสร้างความประหลาดใจในหมู่นักวิทยาศาสตร์คนอื่น" },
        passagePhrase: { en: "discovered that the 'thermometer' molecule enables them to develop", th: "ค้นพบว่าโมเลกุล 'เทอร์โมมิเตอร์' ช่วยให้พืชพัฒนาได้" },
        pairs: [
          { q: "discovery", p: "discovered", th: "การค้นพบ" },
          { q: "thermometer molecule", p: "‘thermometer’ molecule", th: "โมเลกุลที่ทำหน้าที่เป็นเทอร์โมมิเตอร์" },
          { q: "caused surprise among other scientists", p: "enables them to develop according to seasonal temperature changes", th: "บทความเล่าแค่หน้าที่ของโมเลกุล ไม่มีพูดถึงความประหลาดใจ", note: "บทความบอกแค่ว่าค้นพบหน้าที่ของโมเลกุล แต่ไม่เคยกล่าวถึงปฏิกิริยา 'ประหลาดใจ' ของนักวิทยาศาสตร์คนอื่น จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "surprise", th: "ความประหลาดใจ", note: "บทความเล่าแค่ว่ามีการค้นพบ แต่ไม่เคยพูดถึงปฏิกิริยา 'ประหลาดใจ' ของนักวิทยาศาสตร์คนอื่นเลย จึงตอบ NOT GIVEN" }
    },
    28: {
        questionPhrase: { en: "target for agricultural production could be missed", th: "เป้าหมายผลผลิตทางการเกษตรอาจทำไม่สำเร็จ" },
        passagePhrase: { en: "yields will need to double by 2050, but climate change is a major threat", th: "ผลผลิตต้องเพิ่มเป็นสองเท่าภายในปี 2050 แต่การเปลี่ยนแปลงสภาพอากาศเป็นภัยคุกคามใหญ่" },
        pairs: [
          { q: "target for agricultural production by 2050", p: "agricultural yields will need to double by 2050", th: "เป้าหมายผลผลิตทางการเกษตรภายในปี 2050" },
          { q: "could be missed", p: "major threat to achieving this", th: "อาจทำไม่สำเร็จ / ถูกคุกคาม", note: "'major threat to achieving this' หมายความว่าเป้าหมายอาจไม่สำเร็จ ตรงกับ 'could be missed' จึงตอบ TRUE" },
        ],
        keyVocab: { word: "major threat to achieving", th: "ภัยคุกคามใหญ่ต่อการทำให้สำเร็จ", note: "'major threat to achieving this' = เป้าหมายอาจไม่สำเร็จ ตรงกับ 'could be missed' จึงตอบ TRUE" }
    },
    29: {
        questionPhrase: { en: "wheat and rice suffer from a rise in temperatures", th: "ข้าวสาลีและข้าวได้รับผลกระทบจากอุณหภูมิที่สูงขึ้น" },
        passagePhrase: { en: "wheat and rice are sensitive to high temperatures", th: "ข้าวสาลีและข้าวอ่อนไหวต่ออุณหภูมิสูง" },
        pairs: [
          { q: "Wheat and rice", p: "wheat and rice", th: "ข้าวสาลีและข้าว" },
          { q: "suffer from", p: "sensitive to", th: "ได้รับผลกระทบ / อ่อนไหวต่อ", note: "'sensitive to high temperatures' พร้อมข้อมูลว่าผลผลิตลดลงเมื่ออุณหภูมิสูง = 'suffer from a rise in temperatures' จึงตอบ TRUE" },
          { q: "a rise in temperatures", p: "high temperatures", th: "อุณหภูมิที่สูงขึ้น" },
        ],
        keyVocab: { word: "sensitive to high temperatures", th: "อ่อนไหว/ไวต่ออุณหภูมิสูง", note: "'sensitive to high temperatures' + ผลผลิตลดลงเมื่ออุณหภูมิเพิ่ม = 'suffer from a rise in temperatures' จึงตอบ TRUE" }
    },
    30: {
        questionPhrase: { en: "develop crops that require less water", th: "พัฒนาพืชที่ต้องการน้ำน้อยลง" },
        passagePhrase: { en: "could help us breed tougher crops", th: "อาจช่วยเราปรับปรุงพันธุ์พืชที่ทนทานยิ่งขึ้น" },
        pairs: [
          { q: "develop crops", p: "breed tougher crops", th: "ปรับปรุงพันธุ์พืช" },
          { q: "require less water", p: "tougher crops", th: "บทความพูดถึงพืชที่ทนทาน ไม่ใช่ใช้น้ำน้อยลง", note: "บทความกล่าวถึงพืชที่ 'ทนทาน' ต่อความร้อน แต่ไม่เคยพูดเรื่อง 'ใช้น้ำน้อยลง' จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "tougher crops", th: "พืชที่ทนทานยิ่งขึ้น", note: "บทความพูดถึงพืช 'ทนทาน' ต่อความร้อน แต่ไม่เคยพูดเรื่อง 'ใช้น้ำน้อยลง' เลย จึงตอบ NOT GIVEN" }
    },
    31: {
        questionPhrase: { en: "plants grow faster in sunlight than in shade", th: "พืชเติบโตเร็วในแสงแดดมากกว่าในที่ร่ม" },
        passagePhrase: { en: "sunlight slowing down growth; in shade enabling it to grow faster", th: "แสงแดดทำให้โตช้าลง ส่วนในที่ร่มทำให้โตเร็วขึ้น" },
        pairs: [
          { q: "in sunlight", p: "sunlight activates the molecules, slowing down growth", th: "ในแสงแดดพืชโตช้าลง" },
          { q: "in shade", p: "in shade, phytochromes are quickly inactivated - enabling it to grow faster", th: "ในที่ร่มพืชโตเร็วขึ้น" },
          { q: "grow faster in sunlight than in shade", p: "slowing down growth", th: "คำถามกลับด้านกับบทความ", note: "บทความบอกว่าในแสงแดดโต 'ช้าลง' แต่ในที่ร่มโต 'เร็วขึ้น' ตรงข้ามกับคำถาม จึงตอบ FALSE" },
        ],
        keyVocab: { word: "slowing down growth", th: "ทำให้การเติบโตช้าลง", contrastA: "sunlight . saeng-daet ทำให้โตช้า", contrastB: "shade . thi-rom ทำให้โตเร็ว", note: "ในแสงแดดพืชโต 'ช้าลง' แต่ในที่ร่มโต 'เร็วขึ้น' กลับด้านกับคำถาม จึงตอบ FALSE" }
    },
    32: {
        questionPhrase: { en: "change state at the same speed day and night", th: "เปลี่ยนสถานะด้วยความเร็วเท่ากันทั้งกลางวันและกลางคืน" },
        passagePhrase: { en: "At night it's a different story; molecules gradually change", th: "ตอนกลางคืนเป็นคนละเรื่อง โมเลกุลค่อยๆ เปลี่ยนสถานะ" },
        pairs: [
          { q: "day and night", p: "At night, however, it’s a different story", th: "กลางวันกับกลางคืนต่างกัน" },
          { q: "the same speed", p: "gradually change", th: "ความเร็วในการเปลี่ยนสถานะ", note: "กลางวันเปลี่ยน 'เร็วมาก' แต่กลางคืน 'ค่อยๆ' เปลี่ยน ความเร็วไม่เท่ากัน จึงตอบ FALSE" },
          { q: "change their state", p: "change from their active to inactive state", th: "เปลี่ยนสถานะของโมเลกุล" },
        ],
        keyVocab: { word: "a different story", th: "เป็นคนละเรื่อง/ต่างออกไป", contrastA: "day . klang-wan เปลี่ยนเร็วมาก", contrastB: "night . klang-khuen ค่อยๆ เปลี่ยน", note: "กลางวันเปลี่ยน 'เร็วมาก' แต่กลางคืน 'ค่อยๆ' เปลี่ยน ความเร็วไม่เท่ากัน จึงตอบ FALSE" }
    },
    33: {
        questionPhrase: { en: "specialists who can make use of the findings", th: "ผู้เชี่ยวชาญที่นำผลการวิจัยไปใช้ประโยชน์ได้" },
        passagePhrase: { en: "collaborators who work on more applied aspects of plant biology", th: "ผู้ร่วมงานที่ทำงานด้านการประยุกต์ของชีววิทยาพืช" },
        pairs: [
          { q: "specialists", p: "collaborators", th: "ผู้เชี่ยวชาญ / ผู้ร่วมงาน" },
          { q: "make use of the research findings", p: "work on more applied aspects of plant biology", th: "นำผลการวิจัยไปใช้ประโยชน์", note: "'collaborators who work on applied aspects' = ผู้เชี่ยวชาญที่นำงานวิจัยไปใช้ จึงเป็น section H" },
        ],
        keyVocab: { word: "outstanding collaborators", th: "ผู้ร่วมงานที่ยอดเยี่ยม", note: "'collaborators who work on applied aspects' = ผู้เชี่ยวชาญที่นำงานไปใช้ ทำให้ section H เป็นคำตอบ" }
    },
    34: {
        questionPhrase: { en: "a potential benefit of the research findings", th: "ประโยชน์ที่อาจเกิดขึ้นจากผลการวิจัย" },
        passagePhrase: { en: "has the potential to accelerate the breeding of resilient crops", th: "มีศักยภาพที่จะเร่งการปรับปรุงพันธุ์พืชที่ทนทาน" },
        pairs: [
          { q: "potential benefit", p: "potential to accelerate", th: "ประโยชน์ที่อาจเกิดขึ้น", note: "'potential to accelerate the breeding' = ประโยชน์ที่อาจเกิดขึ้นจากงานวิจัย จึงเป็น section D" },
          { q: "research findings", p: "Discovering the molecules that allow plants to sense temperature", th: "ผลการค้นพบจากงานวิจัย" },
        ],
        keyVocab: { word: "potential to accelerate", th: "มีศักยภาพที่จะเร่ง/ผลักดัน", note: "'potential to accelerate breeding' = ประโยชน์ที่อาจเกิดขึ้น ตรงกับ section D" }
    },
    35: {
        questionPhrase: { en: "scientific support for a traditional saying", th: "หลักฐานทางวิทยาศาสตร์ที่รองรับคำพังเพยโบราณ" },
        passagePhrase: { en: "provides the science behind a well-known rhyme", th: "ให้คำอธิบายทางวิทยาศาสตร์เบื้องหลังกลอนที่รู้จักกันดี" },
        pairs: [
          { q: "scientific support", p: "provides the science behind", th: "หลักฐานทางวิทยาศาสตร์ที่รองรับ", note: "'science behind a well-known rhyme' = วิทยาศาสตร์รองรับคำพังเพย จึงเป็น section G" },
          { q: "traditional saying", p: "well-known rhyme", th: "คำพังเพย / บทกลอนโบราณ" },
        ],
        keyVocab: { word: "science behind a well-known rhyme", th: "วิทยาศาสตร์เบื้องหลังบทกลอนที่รู้จักกันดี", note: "'rhyme' = traditional saying และ 'science behind' = scientific support ทำให้ section G เป็นคำตอบ" }
    },
    36: {
        questionPhrase: { en: "people traditionally making plans based on plant behaviour", th: "ผู้คนสมัยก่อนวางแผนโดยอาศัยพฤติกรรมของพืช" },
        passagePhrase: { en: "humans have long used to predict weather and harvest times", th: "มนุษย์ใช้มานานเพื่อทำนายอากาศและเวลาเก็บเกี่ยว" },
        pairs: [
          { q: "people traditionally making plans", p: "humans have long used to predict weather and harvest times", th: "ผู้คนสมัยก่อนวางแผนล่วงหน้า", note: "'long used to predict harvest times' = การวางแผนตามพฤติกรรมพืช จึงเป็น section C" },
          { q: "plant behaviour", p: "trees and flowers to bud early", th: "พฤติกรรมของพืช (ผลิดอก)" },
        ],
        keyVocab: { word: "predict harvest times", th: "ทำนายเวลาเก็บเกี่ยว", note: "'predict harvest times' = การวางแผนล่วงหน้า และต้นไม้ผลิดอก = plant behaviour ทำให้ section C เป็นคำตอบ" }
    },
    37: {
        questionPhrase: { en: "where the research has been reported", th: "ที่ที่งานวิจัยได้รับการเผยแพร่" },
        passagePhrase: { en: "the new findings, published in the journal Science", th: "ผลการค้นพบใหม่ ตีพิมพ์ในวารสาร Science" },
        pairs: [
          { q: "where the research has been reported", p: "published in the journal Science", th: "ที่ที่งานวิจัยได้รับการเผยแพร่", note: "'published in the journal Science' = ที่ที่งานวิจัยถูกรายงาน จึงเป็น section A" },
          { q: "the research", p: "The new findings", th: "งานวิจัย / ผลการค้นพบ" },
        ],
        keyVocab: { word: "published in the journal Science", th: "ตีพิมพ์ในวารสาร Science", note: "'published in the journal' = ที่ที่งานวิจัยถูกรายงาน ทำให้ section A เป็นคำตอบ" }
    },
    38: {
        questionPhrase: { en: "daffodils flower early in response to ___ weather", th: "ดอกแดฟโฟดิลออกดอกเร็วเพราะอากาศแบบ ___" },
        passagePhrase: { en: "can flower months in advance during a warm winter", th: "ออกดอกล่วงหน้าหลายเดือนในช่วงฤดูหนาวที่อบอุ่น" },
        pairs: [
          { q: "flower early", p: "flower months in advance", th: "ออกดอกเร็ว / ล่วงหน้า" },
          { q: "weather", p: "warm winter", th: "สภาพอากาศ (ฤดูหนาวที่อบอุ่น)", note: "ช่องว่างเติมด้วย 'warm' เพราะแดฟโฟดิลออกดอกล่วงหน้าในช่วง 'warm winter'" },
        ],
        keyVocab: { word: "warm winter", th: "ฤดูหนาวที่อบอุ่น", note: "'flower months in advance' = ออกดอกเร็ว เกิดขึ้นช่วง 'warm winter' จึงเติมช่องว่างว่า warm (winter)" }
    },
    39: {
        questionPhrase: { en: "ash before oak, weather in ___ will be wet", th: "ถ้าแอชผลิใบก่อนโอ๊ก อากาศใน ___ จะมีฝน" },
        passagePhrase: { en: "a colder summer is likely to be a rain-soaked one", th: "ฤดูร้อนที่หนาวเย็นกว่ามักจะมีฝนชุก" },
        pairs: [
          { q: "wet", p: "rain-soaked", th: "เปียก / ฝนชุก" },
          { q: "weather in", p: "summer", th: "อากาศในฤดู (ร้อน)", note: "'rain-soaked' = wet เกิดในช่วง 'summer' จึงเติมคำตอบว่า summer" },
        ],
        keyVocab: { word: "rain-soaked summer", th: "ฤดูร้อนที่ฝนชุก", note: "'rain-soaked' = wet และเกิดในช่วง 'summer' จึงเติมคำตอบว่า summer" }
    },
    40: {
        questionPhrase: { en: "research carried out using a particular species of ___", th: "งานวิจัยทำโดยใช้พืชสายพันธุ์ ___" },
        passagePhrase: { en: "using a mustard plant called Arabidopsis", th: "ใช้พืชตระกูลมัสตาร์ดที่ชื่อ Arabidopsis" },
        pairs: [
          { q: "carried out", p: "The work was done", th: "ดำเนินการ / ทำการวิจัย" },
          { q: "a particular species", p: "mustard plant called Arabidopsis", th: "พืชสายพันธุ์หนึ่งโดยเฉพาะ", note: "'using a mustard plant called Arabidopsis' ระบุชนิดพืชที่ใช้วิจัย จึงตอบ mustard plant(s)" },
        ],
        keyVocab: { word: "mustard plant", th: "พืชตระกูลมัสตาร์ด", note: "'using a mustard plant called Arabidopsis' ระบุชนิดพืชที่ใช้วิจัย จึงตอบ mustard plant(s)" }
    },
  },
  "Cambridge 16 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "superiority of AI projections over those by humans", th: "การพยากรณ์ของ AI เหนือกว่าที่มนุษย์ทำได้" },
        passagePhrase: { en: "AI is almost always better at forecasting than we are", th: "AI พยากรณ์ได้ดีกว่าเราเกือบทุกครั้ง" },
        pairs: [
          { q: "superiority", p: "better at forecasting", th: "เหนือกว่า/ดีกว่า", note: "'better at forecasting' = 'superiority of AI projections' จึงตอบหัวข้อ iii" },
          { q: "AI projections", p: "AI is almost always better at forecasting", th: "การพยากรณ์ของ AI" },
          { q: "those made by humans", p: "than we are", th: "สิ่งที่มนุษย์ทำ" },
        ],
        keyVocab: { word: "better at forecasting", th: "พยากรณ์ได้ดีกว่า", note: "คำว่า 'better at forecasting' ในเนื้อเรื่อง = 'superiority of AI projections' ในหัวข้อ iii จึงตอบ iii" }
    },
    28: {
        questionPhrase: { en: "widespread distrust of an AI innovation", th: "ความไม่ไว้ใจอย่างกว้างขวางต่อนวัตกรรม AI ตัวหนึ่ง" },
        passagePhrase: { en: "caused even more suspicion and disbelief, doctors ignore AI", th: "ทำให้เกิดความสงสัยและไม่เชื่อมากขึ้น หมอจึงเมินคำแนะนำ AI" },
        pairs: [
          { q: "Widespread distrust", p: "even more suspicion and disbelief", th: "ความไม่ไว้ใจอย่างกว้างขวาง", note: "'suspicion and disbelief' = 'distrust' ของนวัตกรรม AI จึงตอบหัวข้อ vi" },
          { q: "AI innovation", p: "AI recommendations", th: "นวัตกรรม/สิ่งที่ AI เสนอ" },
          { q: "distrust", p: "ignore the seemingly outlandish AI recommendations", th: "ไม่เชื่อ/เมินไม่ยอมรับ" },
        ],
        keyVocab: { word: "suspicion and disbelief", th: "ความสงสัยและความไม่เชื่อ", note: "Section B เล่าเรื่อง Watson ที่หมอ 'suspicion and disbelief' = 'distrust' ของ AI innovation จึงตอบ vi" }
    },
    29: {
        questionPhrase: { en: "why we trust human judgement more than AI", th: "ทำไมเราเชื่อการตัดสินของมนุษย์มากกว่า AI" },
        passagePhrase: { en: "Trust in other people based on understanding how others think", th: "ความไว้ใจคนอื่นมาจากการเข้าใจวิธีคิดของเขา" },
        pairs: [
          { q: "faith in human judgement", p: "Trust in other people", th: "ความเชื่อมั่นในการตัดสินของมนุษย์", note: "เทียบ 'trust in other people' กับ AI ที่ยังใหม่ ตรงกับ 'faith in human judgement than in AI' จึงตอบหัวข้อ ii" },
          { q: "Reasons why", p: "based on our understanding of how others think", th: "เหตุผลที่ว่าทำไม" },
          { q: "than in AI", p: "AI, on the other hand, is still fairly new and unfamiliar", th: "มากกว่าใน AI" },
        ],
        keyVocab: { word: "trust in other people", th: "ความไว้ใจในตัวคนอื่น", contrastA: "human . มนุษย์", contrastB: "AI . ปัญญาประดิษฐ์", note: "Section C เทียบความไว้ใจ 'other people' กับ AI ที่ยังใหม่ ตรงกับ 'faith in human judgement than in AI' จึงตอบ ii" }
    },
    30: {
        questionPhrase: { en: "an increasing divergence of attitudes towards AI", th: "ทัศนคติต่อ AI ที่แตกต่างกันมากขึ้นเรื่อยๆ" },
        passagePhrase: { en: "a society split between those who benefit and those who reject", th: "สังคมแบ่งเป็นพวกได้ประโยชน์กับพวกปฏิเสธ AI" },
        pairs: [
          { q: "increasing divergence of attitudes", p: "a society split between those who benefit from AI and those who reject it", th: "ทัศนคติที่แตกต่างกันมากขึ้น", note: "'society split between those who benefit and reject' = 'divergence of attitudes' ที่เพิ่มขึ้น จึงตอบหัวข้อ i" },
          { q: "increasing", p: "represented more and more", th: "ที่เพิ่มขึ้นเรื่อยๆ" },
          { q: "towards AI", p: "attitudes", th: "ที่มีต่อ AI" },
        ],
        keyVocab: { word: "society split", th: "สังคมที่แตกแยก", note: "'split between those who benefit and reject' = 'divergence of attitudes' ที่เพิ่มขึ้น จึงตอบ i" }
    },
    31: {
        questionPhrase: { en: "encouraging openness about how AI functions", th: "ส่งเสริมความโปร่งใสเรื่องการทำงานของ AI" },
        passagePhrase: { en: "reveal more about the algorithms which AI uses", th: "เปิดเผยข้อมูลอัลกอริทึมที่ AI ใช้มากขึ้น" },
        pairs: [
          { q: "openness about how AI functions", p: "reveal more about the algorithms which AI uses", th: "ความโปร่งใสเรื่องการทำงานของ AI", note: "'reveal more about the algorithms' = 'openness about how AI functions' จึงตอบหัวข้อ vii" },
          { q: "Encouraging openness", p: "transparency reports", th: "ส่งเสริมความโปร่งใส" },
          { q: "how AI functions", p: "the way algorithmic decisions are made", th: "วิธีที่ AI ทำงาน" },
        ],
        keyVocab: { word: "reveal more about the algorithms", th: "เปิดเผยอัลกอริทึมมากขึ้น", note: "'reveal more about the algorithms' = 'openness about how AI functions' จึงตอบ vii" }
    },
    32: {
        questionPhrase: { en: "advantages of involving users in AI processes", th: "ข้อดีของการให้ผู้ใช้มีส่วนร่วมในกระบวนการ AI" },
        passagePhrase: { en: "allowing people some control over AI decision-making", th: "ให้คนมีอำนาจควบคุมการตัดสินใจของ AI บ้าง" },
        pairs: [
          { q: "involving users in AI processes", p: "allowing people some control over AI decision-making", th: "ให้ผู้ใช้มีส่วนร่วมในกระบวนการ AI", note: "'allowing people control' = 'involving users' และ 'improve trust' = 'advantages' จึงตอบหัวข้อ v" },
          { q: "advantages", p: "improve trust", th: "ข้อดี/ประโยชน์" },
          { q: "users", p: "people", th: "ผู้ใช้/ผู้คน" },
        ],
        keyVocab: { word: "control over AI decision-making", th: "การควบคุมการตัดสินใจของ AI", note: "'allowing people control' = 'involving users' และ 'improve trust' = 'advantages' จึงตอบ v" }
    },
    33: {
        questionPhrase: { en: "highlighting the existence of a problem", th: "ชี้ให้เห็นว่ามีปัญหาอยู่" },
        passagePhrase: { en: "we still seem to deeply lack confidence in AI predictions", th: "เรายังขาดความเชื่อมั่นในการพยากรณ์ของ AI อย่างลึกซึ้ง" },
        pairs: [
          { q: "highlighting the existence of a problem", p: "we still seem to deeply lack confidence in AI predictions", th: "ชี้ให้เห็นว่ามีปัญหาอยู่", note: "ผู้เขียนชี้ว่า 'lack confidence in AI' คือปัญหาที่มีอยู่ ยังไม่เสนอทางแก้ จึงตอบ C" },
          { q: "a problem", p: "reluctant to trust AI", th: "ปัญหา" },
        ],
        keyVocab: { word: "lack confidence", th: "ขาดความเชื่อมั่น", note: "ผู้เขียนชี้ว่า 'lack confidence in AI' คือปัญหาที่มีอยู่ ยังไม่เสนอทางแก้ จึงตอบ C (highlighting a problem)" }
    },
    34: {
        questionPhrase: { en: "complexity makes them feel at a disadvantage", th: "ความซับซ้อนทำให้รู้สึกเสียเปรียบ/ควบคุมไม่ได้" },
        passagePhrase: { en: "interacting with something we don't understand causes anxiety, losing control", th: "การมีปฏิสัมพันธ์กับสิ่งที่ไม่เข้าใจทำให้กังวลและรู้สึกสูญเสียการควบคุม" },
        pairs: [
          { q: "complexity", p: "too difficult for most people to comprehend", th: "ความซับซ้อน/เข้าใจยาก" },
          { q: "feel that they are at a disadvantage", p: "a sense that we’re losing control", th: "รู้สึกเสียเปรียบ/ควบคุมไม่ได้", note: "AI ที่เข้าใจยากทำให้รู้สึก 'losing control' = 'at a disadvantage' จึงตอบ B" },
          { q: "reluctant to accept AI", p: "interacting with something we don’t understand can cause anxiety", th: "ลังเลที่จะยอมรับ AI" },
        ],
        keyVocab: { word: "losing control", th: "สูญเสียการควบคุม", note: "AI ที่ 'too difficult to comprehend' ทำให้รู้สึก 'losing control' = 'at a disadvantage' จึงตอบ B" }
    },
    35: {
        questionPhrase: { en: "media devotes excessive attention to AI", th: "สื่อให้ความสนใจ AI มากเกินไป" },
        passagePhrase: { en: "AI failures receive a disproportionate amount of media attention", th: "ความล้มเหลวของ AI ได้รับความสนใจจากสื่อมากเกินสัดส่วน" },
        pairs: [
          { q: "excessive amount of attention", p: "disproportionate amount of media attention", th: "ความสนใจที่มากเกินไป", note: "'disproportionate amount of attention' = 'excessive amount of attention' จึงตอบ B" },
          { q: "the media", p: "media attention", th: "สื่อ" },
          { q: "to AI", p: "AI failures", th: "ต่อ AI" },
        ],
        keyVocab: { word: "disproportionate amount of media attention", th: "ความสนใจจากสื่อที่มากเกินสัดส่วน", note: "'disproportionate amount of attention' = 'excessive amount of attention' จึงตอบ B" }
    },
    36: {
        questionPhrase: { en: "sci-fi films make people change their opinions", th: "หนัง sci-fi ทำให้คนเปลี่ยนความคิดเห็น" },
        passagePhrase: { en: "optimists became more extreme, sceptics became even more guarded", th: "คนมองโลกในแง่ดียิ่งคลั่งไคล้ คนกังขายิ่งระแวง" },
        pairs: [
          { q: "sci-fi films", p: "sci-fi films about AI", th: "หนังไซไฟ" },
          { q: "change their opinions", p: "Optimists became more extreme in their enthusiasm for AI and sceptics became even more guarded", th: "เปลี่ยนความคิดเห็น", note: "หนังทำให้ทัศนคติเดิมเข้มข้นขึ้น (polarised) ไม่ใช่ 'change' จึงขัดแย้ง ตอบ NO" },
          { q: "Subjective depictions", p: "depicted AI in a positive or negative light", th: "การนำเสนอเชิงอัตวิสัย" },
        ],
        keyVocab: { word: "more extreme / more guarded", th: "สุดโต่งขึ้น / ระวังตัวมากขึ้น", note: "หนังทำให้ทัศนคติเดิม 'polarised' (เข้มข้นขึ้น) ไม่ใช่ 'change' (เปลี่ยน) จึงขัดแย้ง ตอบ NO" }
    },
    37: {
        questionPhrase: { en: "portrayals of AI likely to become more positive", th: "ภาพลักษณ์ AI ในสื่อจะเป็นบวกมากขึ้น" },
        passagePhrase: { en: "AI is represented more and more in media and entertainment", th: "AI ถูกนำเสนอในสื่อและความบันเทิงมากขึ้นเรื่อยๆ" },
        pairs: [
          { q: "Portrayals of AI in media and entertainment", p: "AI is represented more and more in media and entertainment", th: "ภาพลักษณ์ AI ในสื่อและความบันเทิง" },
          { q: "become more positive", p: "represented more and more", th: "เป็นบวกมากขึ้น", note: "เนื้อเรื่องบอกแค่ปริมาณ 'more and more' ไม่พูดว่าจะ 'more positive' จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "represented more and more", th: "ถูกนำเสนอมากขึ้นเรื่อยๆ", note: "เนื้อเรื่องบอกแค่ปริมาณ 'more and more' ไม่พูดว่า 'more positive' จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "rejecting AI may negatively affect many lives", th: "การปฏิเสธ AI อาจส่งผลเสียต่อชีวิตคนจำนวนมาก" },
        passagePhrase: { en: "refusing AI could place a large group at a serious disadvantage", th: "การปฏิเสธ AI อาจทำให้คนกลุ่มใหญ่เสียเปรียบอย่างหนัก" },
        pairs: [
          { q: "Rejection of the possibilities of AI", p: "refusing to accept the advantages offered by AI", th: "การปฏิเสธความเป็นไปได้ของ AI" },
          { q: "negative effect on many people’s", p: "place a large group of people at a serious disadvantage", th: "ผลเสียต่อคนจำนวนมาก", note: "'refusing AI...serious disadvantage' = 'rejection...negative effect' ตรงกัน จึงตอบ YES" },
        ],
        keyVocab: { word: "serious disadvantage", th: "เสียเปรียบอย่างร้ายแรง", note: "'refusing AI...serious disadvantage' = 'rejection...negative effect' ตรงกัน จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "familiarity with AI has little impact on attitudes", th: "ความคุ้นเคยกับ AI แทบไม่มีผลต่อทัศนคติ" },
        passagePhrase: { en: "previous experience with AI can significantly improve opinions", th: "ประสบการณ์กับ AI ช่วยปรับความคิดเห็นได้อย่างมีนัยสำคัญ" },
        pairs: [
          { q: "Familiarity with AI", p: "having previous experience with AI", th: "ความคุ้นเคยกับ AI" },
          { q: "very little impact", p: "can significantly improve people’s opinions", th: "แทบไม่มีผล", note: "เนื้อเรื่องบอก 'significantly improve' ขัดกับ 'very little impact' จึงตอบ NO" },
          { q: "attitudes to the technology", p: "opinions about the technology", th: "ทัศนคติต่อเทคโนโลยี" },
        ],
        keyVocab: { word: "significantly improve", th: "ปรับปรุงอย่างมีนัยสำคัญ", contrastA: "significant impact . มีผลมาก", contrastB: "very little impact . แทบไม่มีผล", note: "เนื้อเรื่องบอก 'significantly improve' ขัดกับ 'very little impact' จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "modifiable AI more likely to gain consumer approval", th: "AI ที่ผู้ใช้แก้ไขได้มีแนวโน้มได้รับการยอมรับมากกว่า" },
        passagePhrase: { en: "allowed to modify an algorithm, felt more satisfied, more likely to use", th: "เมื่อให้แก้อัลกอริทึมได้ คนพอใจมากขึ้นและอยากใช้มากขึ้น" },
        pairs: [
          { q: "users are able to modify", p: "allowed the freedom to slightly modify an algorithm", th: "ผู้ใช้สามารถปรับแก้ได้" },
          { q: "more likely to gain consumer approval", p: "more satisfied with its decisions, more likely to believe it was superior and more likely to use it", th: "มีแนวโน้มได้รับการยอมรับมากกว่า", note: "'modify...more satisfied...more likely to use' = 'modifiable...gain approval' ตรงกัน จึงตอบ YES" },
        ],
        keyVocab: { word: "freedom to slightly modify", th: "อิสระที่จะปรับแก้เล็กน้อย", note: "'modify...more satisfied...more likely to use' = 'modifiable...gain approval' ตรงกัน จึงตอบ YES" }
    },
  },
  "Cambridge 17 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "formed a ... with the Scots", th: "ตกลงร่วมมือกับฝ่ายสกอต" },
        passagePhrase: { en: "did a deal with the Scots", th: "ทำข้อตกลงกับฝ่ายสกอต" },
        pairs: [
          { q: "formed a", p: "did a deal", th: "จับมือร่วมมือ ทำข้อตกลง", note: "\"did a deal with the Scots\" คือการจับมือเป็นพันธมิตร จึงตรงกับตัวเลือก H strategic alliance" },
          { q: "with the Scots", p: "with the Scots", th: "กับฝ่ายสกอต" },
          { q: "in order to become King of", p: "in return for being crowned King of Scots", th: "เพื่อแลกกับการได้ขึ้นเป็นกษัตริย์" },
        ],
        keyVocab: { word: "strategic alliance", th: "การเป็นพันธมิตรเชิงยุทธศาสตร์", note: "\"did a deal with the Scots\" คือการจับมือเป็นพันธมิตรกัน จึงตรงกับตัวเลือก H strategic alliance" }
    },
    28: {
        questionPhrase: { en: "abandoned an important ... held by his father", th: "ละทิ้งสิ่งสำคัญที่พ่อยึดถือ" },
        passagePhrase: { en: "sacrificed one of the very principles his father had died for", th: "ยอมสละหลักการที่พ่อยอมตายเพื่อมัน" },
        pairs: [
          { q: "abandoned", p: "sacrificed", th: "ยอมสละ ละทิ้ง" },
          { q: "an important", p: "one of the very principles", th: "หลักการสำคัญ", note: "หลักการที่พ่อยอมตายเพื่อมันคือความเชื่อทางศาสนา (Presbyterianism) จึงตอบ J religious conviction" },
          { q: "held by his father", p: "his father had died for", th: "ที่พ่อยึดถือไว้" },
        ],
        keyVocab: { word: "religious conviction", th: "ความเชื่อทางศาสนาที่ยึดมั่น", note: "การยอมรับ Presbyterianism เป็นศาสนาประจำชาติคือการทิ้งหลักความเชื่อทางศาสนาของพ่อ จึงตอบ J religious conviction" }
    },
    29: {
        questionPhrase: { en: "battle led to a ... for the Parliamentarians", th: "การรบจบลงด้วยผลดีต่อฝ่ายรัฐสภา" },
        passagePhrase: { en: "his resounding defeat at the Battle of Worcester", th: "ความพ่ายแพ้อย่างยับเยินของชาร์ลส์ที่วูสเตอร์" },
        pairs: [
          { q: "The battle", p: "the Battle of Worcester", th: "การรบ" },
          { q: "led to a", p: "defeat", th: "นำไปสู่ผลลัพธ์", note: "ความพ่ายแพ้ยับเยินของชาร์ลส์ = ชัยชนะเด็ดขาดของฝ่ายรัฐสภา จึงตอบ F decisive victory" },
          { q: "for the Parliamentarians", p: "Parliamentarian army", th: "สำหรับฝ่ายรัฐสภา" },
        ],
        keyVocab: { word: "decisive victory", th: "ชัยชนะเด็ดขาด", contrastA: "defeat . ความพ่ายแพ้ (มุมของชาร์ลส์)", contrastB: "victory . ชัยชนะ (มุมของฝ่ายรัฐสภา)", note: "ความพ่ายแพ้ยับเยินของชาร์ลส์ = ชัยชนะเด็ดขาดของฝ่ายรัฐสภา จึงตอบ F decisive victory" }
    },
    30: {
        questionPhrase: { en: "A ... was offered for Charles's capture", th: "มีสิ่งตอบแทนสำหรับการจับตัวชาร์ลส์" },
        passagePhrase: { en: "a huge sum offered for his capture", th: "มีเงินก้อนโตตั้งไว้เป็นรางวัลนำจับ" },
        pairs: [
          { q: "A", p: "a huge sum", th: "เงินก้อนโต รางวัล", note: "\"a huge sum offered for his capture\" คือเงินรางวัลนำจับจำนวนมาก จึงตอบ B large reward" },
          { q: "was offered", p: "offered", th: "ถูกตั้งไว้ เสนอให้" },
          { q: "for Charles's capture", p: "for his capture", th: "สำหรับการจับตัว" },
        ],
        keyVocab: { word: "large reward", th: "รางวัลก้อนใหญ่", note: "\"a huge sum offered for his capture\" คือเงินรางวัลนำจับจำนวนมาก จึงตอบ B large reward" }
    },
    31: {
        questionPhrase: { en: "reach the ... of continental Europe", th: "ไปถึงที่ปลอดภัยในยุโรปภาคพื้นทวีป" },
        passagePhrase: { en: "seeking refuge in France", th: "ไปลี้ภัยในฝรั่งเศส" },
        pairs: [
          { q: "reach the", p: "seeking refuge", th: "ไปถึงที่ลี้ภัย", note: "การ \"seeking refuge\" (ลี้ภัย) ในฝรั่งเศสคือการไปยังที่ปลอดภัย จึงตอบ D relative safety" },
          { q: "of continental Europe", p: "in France", th: "ในยุโรปภาคพื้นทวีป" },
        ],
        keyVocab: { word: "relative safety", th: "ความปลอดภัยพอสมควร", note: "การ \"seeking refuge\" (ลี้ภัย) ในฝรั่งเศสคือการหนีไปยังที่ปลอดภัย จึงตอบ D relative safety" }
    },
    32: {
        questionPhrase: { en: "chose Pepys because he considered him trustworthy", th: "เลือกเพพีสเพราะคิดว่าเขาน่าไว้ใจ" },
        passagePhrase: { en: "requested a meeting with the writer and diarist Samuel Pepys", th: "ขอพบนักเขียนและผู้บันทึกประจำวันซามูเอล เพพีส" },
        pairs: [
          { q: "chose Pepys for the task", p: "requested a meeting with the writer and diarist Samuel Pepys", th: "เลือกเพพีสให้ทำหน้าที่นี้" },
          { q: "the task", p: "commit his story to paper", th: "งานบันทึกเรื่องราว" },
          { q: "considered him to be trustworthy", p: "Samuel Pepys", th: "คิดว่าเขาน่าไว้ใจ", note: "เรื่องเล่าเพียงว่าชาร์ลส์ขอให้เพพีสจดเรื่องไว้ แต่ไม่ได้ระบุเหตุผลว่าเพราะไว้ใจ จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "trustworthy", th: "น่าเชื่อถือ ไว้ใจได้", note: "ผู้เขียนเล่าเพียงว่าชาร์ลส์ขอให้เพพีสจดเรื่องไว้ แต่ไม่ได้ระบุ 'เหตุผล' ว่าเพราะไว้ใจ จึงตอบ NOT GIVEN" }
    },
    33: {
        questionPhrase: { en: "recollection of the escape lacked sufficient detail", th: "ความทรงจำการหนีของเขาขาดรายละเอียด" },
        passagePhrase: { en: "related to him in great detail his personal recollections", th: "เล่าความทรงจำของตนอย่างละเอียดยิบ" },
        pairs: [
          { q: "personal recollection", p: "personal recollections", th: "ความทรงจำส่วนตัว" },
          { q: "of the escape", p: "as a fugitive", th: "เรื่องการหลบหนี" },
          { q: "lacked sufficient detail", p: "in great detail", th: "(ตรงข้าม) ละเอียดมาก vs ขาดรายละเอียด", note: "เรื่องบอกว่าเล่า \"in great detail\" ซึ่งตรงข้ามกับคำถามที่ว่าขาดรายละเอียด จึงตอบ NO" },
        ],
        keyVocab: { word: "in great detail", th: "อย่างละเอียดมาก", contrastA: "great detail . ละเอียดมาก (ในเรื่อง)", contrastB: "lacked detail . ขาดรายละเอียด (คำถาม)", note: "เรื่องบอกว่าเล่า \"in great detail\" ซึ่งตรงข้ามกับคำถามที่ว่าขาดรายละเอียด จึงตอบ NO" }
    },
    34: {
        questionPhrase: { en: "planned his escape before the battle", th: "วางแผนหนีไว้ก่อนการรบ" },
        passagePhrase: { en: "After the battle was so absolutely lost ... I began to think of the best way of saving myself", th: "หลังแพ้ราบคาบแล้ว ผมจึงเริ่มคิดหาทางเอาตัวรอด" },
        pairs: [
          { q: "planned his escape", p: "the best way of saving myself", th: "หาทางเอาตัวรอด" },
          { q: "before the battle", p: "After the battle was so absolutely lost", th: "(ตรงข้าม) ก่อนการรบ vs หลังการรบ", note: "ชาร์ลส์เริ่มคิดหาทางรอด 'หลัง' แพ้ ไม่ใช่วางแผนไว้ก่อน จึงขัดกับคำถาม ตอบ NO" },
          { q: "indicated to Pepys", p: "I began to think", th: "บอกเล่าแก่เพพีส" },
        ],
        keyVocab: { word: "After the battle ... I began to think", th: "หลังการรบ ผมจึงเริ่มคิด", contrastA: "after the battle . หลังการรบ (ในเรื่อง)", contrastB: "before the battle . ก่อนการรบ (คำถาม)", note: "ชาร์ลส์เริ่มคิดหาทางรอด 'หลัง' แพ้ ไม่ใช่วางแผนไว้ก่อน จึงขัดกับคำถาม ตอบ NO" }
    },
    35: {
        questionPhrase: { en: "inclusion of Charles's account is a positive aspect", th: "การใส่คำเล่าของชาร์ลส์เป็นข้อดีของหนังสือ" },
        passagePhrase: { en: "One of the joys ... its use of Charles II's own narrative", th: "หนึ่งในความน่าอ่านคือการใช้คำเล่าของชาร์ลส์เอง" },
        pairs: [
          { q: "The inclusion of Charles's account", p: "its use of Charles II's own narrative", th: "การนำคำเล่าของชาร์ลส์มาใส่" },
          { q: "is a positive aspect", p: "One of the joys", th: "เป็นข้อดี จุดเด่น", note: "ผู้เขียนชมว่าการใช้คำเล่าของชาร์ลส์เป็น \"one of the joys\" ซึ่งเป็นแง่บวก จึงตอบ YES" },
        ],
        keyVocab: { word: "one of the joys", th: "หนึ่งในจุดที่น่าชื่นชม", note: "ผู้เขียนชมว่าการใช้คำเล่าของชาร์ลส์เป็น \"one of the joys\" ซึ่งเป็นแง่บวก จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "circumstances leading to Charles II's escape", th: "เหตุการณ์ที่นำไปสู่การหลบหนีของชาร์ลส์" },
        passagePhrase: { en: "the story of the hunt for King Charles II ... after his ... defeat", th: "เรื่องการตามล่าชาร์ลส์หลังความพ่ายแพ้" },
        pairs: [
          { q: "circumstances leading to Charles II's escape", p: "the hunt for King Charles II", th: "เหตุการณ์ที่นำไปสู่การหลบหนี" },
          { q: "leading to", p: "after his resounding defeat", th: "ที่นำไปสู่", note: "ย่อหน้าแรกปูภูมิหลังการพ่ายแพ้และการถูกตามล่าก่อนหนี จึงตอบ B" },
          { q: "an account", p: "tells us the story", th: "การเล่าเรื่องราว" },
        ],
        keyVocab: { word: "account of the circumstances", th: "การเล่าเหตุการณ์แวดล้อม", note: "ย่อหน้าแรกปูภูมิหลังการพ่ายแพ้และการถูกตามล่าก่อนหนี จึงตอบ B (เล่าเหตุการณ์ที่นำไปสู่การหนี)" }
    },
    37: {
        questionPhrase: { en: "how the events of the six weeks are brought to life", th: "เหตุการณ์หกสัปดาห์ถูกเล่าให้เห็นภาพมีชีวิต" },
        passagePhrase: { en: "provides delicious details ... how close the reader gets to the action", th: "ให้รายละเอียดน่าติดตาม ทำให้ผู้อ่านใกล้ชิดเหตุการณ์" },
        pairs: [
          { q: "examples of the fugitives' behaviour", p: "The day-by-day retelling of the fugitives' doings", th: "ตัวอย่างพฤติกรรมของผู้หลบหนี" },
          { q: "brought to life", p: "how close the reader gets to the action", th: "เล่าให้เห็นภาพมีชีวิตชีวา", note: "ตัวอย่างพฤติกรรม (ตัดผม ย้อมผิว ซ่อนบนต้นโอ๊ก) ใช้แสดงว่าเรื่องถูกเล่าให้เห็นภาพ จึงตอบ C" },
          { q: "the events of the six weeks", p: "delicious details", th: "รายละเอียดเหตุการณ์" },
        ],
        keyVocab: { word: "brought to life", th: "ทำให้มีชีวิตชีวา เห็นภาพ", note: "ตัวอย่างพฤติกรรม (ตัดผม ย้อมผิว ซ่อนบนต้นโอ๊ก) ใช้แสดงว่าเรื่องถูกเล่าให้เห็นภาพ จึงตอบ C" }
    },
    38: {
        questionPhrase: { en: "chose to celebrate what was essentially a defeat", th: "เลือกเฉลิมฉลองสิ่งที่จริงๆแล้วคือความพ่ายแพ้" },
        passagePhrase: { en: "marking the lowest point in their life so enthusiastically", th: "เฉลิมฉลองช่วงตกต่ำที่สุดของชีวิตอย่างกระตือรือร้น" },
        pairs: [
          { q: "celebrate", p: "marking the lowest point in their life so enthusiastically", th: "เฉลิมฉลอง รำลึกอย่างกระตือรือร้น", note: "ชาร์ลส์รักเรื่องนี้และสร้างอนุสรณ์เฉลิมฉลองทั้งที่มันคือความพ่ายแพ้ จึงตอบ A" },
          { q: "essentially a defeat", p: "the lowest point in their life", th: "ที่จริงคือความพ่ายแพ้ จุดตกต่ำ" },
          { q: "chose to", p: "set in train a series of initiatives to memorialise it", th: "เลือกที่จะ (จัดทำเพื่อรำลึก)" },
        ],
        keyVocab: { word: "lowest point ... enthusiastically", th: "จุดตกต่ำที่สุดอย่างกระตือรือร้น", contrastA: "lowest point/defeat . จุดตกต่ำ ความพ่ายแพ้", contrastB: "memorialise/celebrate . รำลึกเฉลิมฉลอง", note: "ชาร์ลส์รักเรื่องนี้และสร้างอนุสรณ์เฉลิมฉลองทั้งที่มันคือความพ่ายแพ้ จึงตอบ A" }
    },
    39: {
        questionPhrase: { en: "takes an unbiased approach to the subject", th: "วางตัวเป็นกลางต่อเรื่องที่เขียน" },
        passagePhrase: { en: "even-handed sympathy for both the fugitive king and the ... regime", th: "เห็นใจอย่างเป็นธรรมทั้งฝ่ายกษัตริย์และฝ่ายตามล่า" },
        pairs: [
          { q: "unbiased approach", p: "even-handed sympathy", th: "วางตัวเป็นกลาง ไม่ลำเอียง", note: "\"even-handed sympathy for both\" = วางตัวเป็นกลางไม่ลำเอียง ตรงกับ unbiased จึงตอบ B" },
          { q: "the subject matter", p: "both the fugitive king and the fierce republican regime", th: "เรื่องที่เขียน (ทั้งสองฝ่าย)" },
        ],
        keyVocab: { word: "even-handed", th: "ยุติธรรม เป็นกลาง ไม่เอนเอียง", note: "\"even-handed sympathy for both\" = วางตัวเป็นกลางไม่ลำเอียง ตรงกับ unbiased จึงตอบ B" }
    },
    40: {
        questionPhrase: { en: "whether his experiences had a lasting influence", th: "ประสบการณ์นั้นส่งผลต่อเขาในระยะยาวหรือไม่" },
        passagePhrase: { en: "Would Charles II have been a different king had these six weeks never happened?", th: "ถ้าหกสัปดาห์นี้ไม่เกิด ชาร์ลส์จะเป็นกษัตริย์ที่ต่างไปไหม" },
        pairs: [
          { q: "a lasting influence on him", p: "must have affected him in some way", th: "ส่งผลต่อเขาในระยะยาว", note: "จุดที่หนังสือ \"ไม่เข้าเป้า\" คือไม่ได้วิเคราะห์ว่าประสบการณ์หนีส่งผลถาวรต่อตัวชาร์ลส์ไหม จึงตอบ D" },
          { q: "his experiences", p: "The days and nights spent in hiding", th: "ประสบการณ์ของเขา" },
          { q: "fails to address", p: "the book doesn't quite hit the mark", th: "ไม่ได้กล่าวถึง ทำได้ไม่ถึงเป้า" },
        ],
        keyVocab: { word: "have affected him in some way", th: "คงส่งผลต่อเขาในทางใดทางหนึ่ง", note: "จุดที่หนังสือ \"ไม่เข้าเป้า\" คือไม่ได้วิเคราะห์ว่าประสบการณ์หนีส่งผลถาวรต่อตัวชาร์ลส์ไหม จึงตอบ D" }
    },
  },
  "Cambridge 17 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "outline a common assumption", th: "อธิบายความเชื่อทั่วไปที่คนส่วนใหญ่ยึดถือ" },
        passagePhrase: { en: "is popularly believed to result from the sheer genius", th: "เป็นที่เชื่อกันโดยทั่วไปว่าเกิดจากอัจฉริยภาพล้วน ๆ" },
        pairs: [
          { q: "common assumption", p: "popularly believed", th: "เป็นที่เชื่อกันโดยทั่วไป", note: "'popularly believed' = 'common assumption' ย่อหน้าแรกเพียงวางความเชื่อนี้ไว้ ยังไม่โต้แย้ง จึงตอบ D" },
          { q: "outline", p: "result from the sheer genius", th: "อธิบาย/วางความคิดว่าเกิดจากอัจฉริยภาพล้วน ๆ" },
          { q: "purpose of the first paragraph", p: "Scientific discovery", th: "หัวข้อย่อหน้าแรก: การค้นพบทางวิทยาศาสตร์" },
        ],
        keyVocab: { word: "popularly believed", th: "เป็นที่เชื่อกันโดยทั่วไป", note: "วลี 'popularly believed' = 'common assumption' (ความเชื่อทั่วไป) ย่อหน้าแรกเพียงวางความเชื่อนี้ไว้ ยังไม่โต้แย้ง จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "criticising an opinion", th: "วิจารณ์/โต้แย้งความคิดเห็นหนึ่ง" },
        passagePhrase: { en: "it largely misrepresents the real nature of scientific discovery", th: "มันบิดเบือนธรรมชาติที่แท้จริงของการค้นพบทางวิทยาศาสตร์เป็นส่วนใหญ่" },
        pairs: [
          { q: "criticising", p: "misrepresents", th: "บิดเบือน/นำเสนอผิด", note: "'misrepresents' บวก 'However, we believe' แสดงการคัดค้านความเชื่อเรื่อง insight จึงเป็นการ criticising an opinion ตอบ A" },
          { q: "an opinion", p: "Conventional wisdom", th: "ความเชื่อ/ความคิดเห็นที่ยึดถือกัน" },
          { q: "criticising", p: "However, we believe", th: "การโต้แย้ง/แสดงความเห็นค้าน" },
        ],
        keyVocab: { word: "misrepresents", th: "บิดเบือน/นำเสนอผิด", note: "'misrepresents' บวก 'However, we believe' แสดงการคัดค้านความเชื่อเรื่อง insight จึงเป็นการ criticising an opinion ตอบ A" }
    },
    29: {
        questionPhrase: { en: "an exception to a general rule", th: "ข้อยกเว้นจากกฎทั่วไป" },
        passagePhrase: { en: "Setting aside such greats as Darwin and Einstein", th: "เว้น/ยกออกไปเฉพาะคนยิ่งใหญ่อย่างดาร์วินและไอน์สไตน์" },
        pairs: [
          { q: "an exception", p: "Setting aside", th: "ยกเว้น/กันออกไปต่างหาก", note: "'Setting aside' ดาร์วินกับไอน์สไตน์ออกจากกฎ trial-and-error แสดงว่าทั้งสองเป็นข้อยกเว้นของกฎทั่วไป จึงตอบ A" },
          { q: "a general rule", p: "innovation is more a process of trial and error", th: "กฎทั่วไป: นวัตกรรมคือการลองผิดลองถูก" },
          { q: "Darwin and Einstein", p: "such greats as Darwin and Einstein", th: "คนยิ่งใหญ่อย่างดาร์วินและไอน์สไตน์" },
        ],
        keyVocab: { word: "setting aside", th: "ยกเว้น/กันออกไปต่างหาก", note: "'setting aside' ดาร์วินกับไอน์สไตน์ออกจากกฎ trial-and-error แสดงว่าทั้งสองเป็นข้อยกเว้นของกฎทั่วไป จึงตอบ A" }
    },
    30: {
        questionPhrase: { en: "laid the foundations for someone else's breakthrough", th: "ปูทางให้เกิดความก้าวหน้าครั้งใหญ่ของคนอื่น" },
        passagePhrase: { en: "Bohr jumped off from this interesting idea to conceive his now-famous model", th: "บอร์ต่อยอดจากแนวคิดนี้จนสร้างแบบจำลองอะตอมที่โด่งดัง" },
        pairs: [
          { q: "laid the foundations", p: "jumped off from this interesting idea", th: "ต่อยอด/ปูทางจากแนวคิดนี้", note: "ไอเดียของนิโคลสันถูกบอร์ 'jumped off from' = ปูทาง (laid the foundations) ให้บอร์ค้นพบครั้งใหญ่ จึงตอบ C" },
          { q: "someone else's breakthrough", p: "his now-famous model of the atom", th: "ความก้าวหน้าครั้งใหญ่ของคนอื่น: แบบจำลองอะตอมที่โด่งดัง" },
          { q: "John Nicholson", p: "Nicholson also proposed a novel theory", th: "นิโคลสันเสนอทฤษฎีใหม่" },
        ],
        keyVocab: { word: "jumped off from", th: "ต่อยอด/เริ่มต่อจาก", note: "ไอเดียของนิโคลสันถูกบอร์ 'jumped off from' = ปูทาง (laid the foundations) ให้บอร์ค้นพบครั้งใหญ่ จึงตอบ C" }
    },
    31: {
        questionPhrase: { en: "the simple reason why it was invented", th: "เหตุผลง่าย ๆ ว่าทำไมมันจึงถูกคิดค้น" },
        passagePhrase: { en: "a leg injury... left him unable to fully bend his left knee", th: "อาการบาดเจ็บที่ขาทำให้เขางอเข่าซ้ายได้ไม่เต็มที่" },
        pairs: [
          { q: "the simple reason why it was invented", p: "just happened to coincide", th: "บังเอิญพอดีกัน ไม่ได้วางแผน", note: "ท่านี้เกิดเพราะบาดเจ็บแล้ว 'just happened to coincide' กับการเลี้ยวที่ดีขึ้น เหตุผลที่เกิดจึงเรียบง่ายไม่ได้วางแผน ตอบ A" },
          { q: "the simple reason", p: "a leg injury", th: "เหตุผลง่าย ๆ: อาการบาดเจ็บที่ขา" },
          { q: "stirrup placement", p: "unable to fully bend his left knee", th: "ตำแหน่งโกลน: งอเข่าซ้ายได้ไม่เต็มที่" },
        ],
        keyVocab: { word: "happened to coincide", th: "บังเอิญพอดีกับ", note: "ท่านี้เกิดเพราะบาดเจ็บแล้ว 'just happened to coincide' กับการเลี้ยวที่ดีขึ้น เหตุผลที่เกิดจึงเรียบง่ายไม่ได้วางแผน ตอบ A" }
    },
    32: {
        questionPhrase: { en: "calling them geniuses helps explain how minds create", th: "การเรียกพวกเขาว่าอัจฉริยะช่วยอธิบายว่าจิตใจสร้างไอเดียอย่างไร" },
        passagePhrase: { en: "These notions merely label rather than explain", th: "แนวคิดเหล่านี้เพียงแค่ติดป้าย ไม่ได้อธิบาย" },
        pairs: [
          { q: "help us understand the process", p: "rather than explain", th: "ช่วยให้เข้าใจกระบวนการ vs. ไม่ได้อธิบาย", note: "ผู้เขียนบอกว่าคำว่าอัจฉริยะ 'label rather than explain' ขัดกับข้อความที่ว่ามันช่วยเข้าใจกระบวนการ จึงตอบ NO" },
          { q: "Acknowledging people such as Plato or da Vinci as geniuses", p: "These notions merely label", th: "การติดป้ายว่าเป็นอัจฉริยะ" },
          { q: "the process by which great minds create new ideas", p: "the evolution of human innovations", th: "กระบวนการที่จิตใจสร้างไอเดีย/นวัตกรรมใหม่" },
        ],
        keyVocab: { word: "label rather than explain", th: "ติดป้ายเฉย ๆ ไม่ได้อธิบาย", contrastA: "label . ติดป้าย", contrastB: "explain . อธิบาย", note: "ผู้เขียนบอกว่าคำว่าอัจฉริยะ 'label rather than explain' ขัดกับข้อความที่ว่ามันช่วยเข้าใจกระบวนการ จึงตอบ NO" }
    },
    33: {
        questionPhrase: { en: "psychologists were seeking a scientific reason for creativity then", th: "นักจิตวิทยากำลังหาเหตุผลทางวิทยาศาสตร์ของความคิดสร้างสรรค์ในตอนนั้น" },
        passagePhrase: { en: "The Law of Effect was advanced by Edward Thorndike in 1898", th: "กฎแห่งผลถูกเสนอโดยเอ็ดเวิร์ด ธอร์นไดก์ในปี 1898" },
        pairs: [
          { q: "The Law of Effect was discovered at a time", p: "The Law of Effect was advanced by psychologist Edward Thorndike in 1898", th: "กฎแห่งผลถูกเสนอในปี 1898", note: "เนื้อเรื่องบอกแค่ปีและตัวกฎ แต่ไม่เคยบอกว่านักจิตวิทยา 'กำลังหา' เหตุผลของความสร้างสรรค์ ข้อมูลนี้ไม่มี จึงตอบ NOT GIVEN" },
          { q: "psychologists", p: "psychologist Edward Thorndike", th: "นักจิตวิทยา" },
        ],
        keyVocab: { word: "no mention of motive", th: "ไม่มีการกล่าวถึงแรงจูงใจ", note: "เนื้อเรื่องบอกแค่ปีและตัวกฎ แต่ไม่เคยบอกว่านักจิตวิทยา 'กำลังหา' เหตุผลของความสร้างสรรค์ ข้อมูลนี้ไม่มี จึงตอบ NOT GIVEN" }
    },
    34: {
        questionPhrase: { en: "no planning is involved in organisms' behaviour", th: "ไม่มีการวางแผนในพฤติกรรมของสิ่งมีชีวิต" },
        passagePhrase: { en: "an entirely mechanical process of variation and selection, without any end objective", th: "กระบวนการเชิงกลล้วน ๆ ของการแปรผันและการคัดเลือก โดยไม่มีเป้าหมายปลายทาง" },
        pairs: [
          { q: "no planning is involved", p: "without any end objective in sight", th: "ไม่มีเป้าหมายปลายทาง = ไม่มีการวางแผน", note: "'without any end objective in sight' = ไม่มีการวางแผน (no planning) ตรงกับข้อความ จึงตอบ YES" },
          { q: "the behaviour of organisms", p: "an entirely mechanical process of variation and selection", th: "พฤติกรรมเชิงกลของการแปรผันและคัดเลือก" },
        ],
        keyVocab: { word: "without any end objective", th: "ไม่มีเป้าหมายปลายทาง", note: "'without any end objective in sight' = ไม่มีการวางแผน (no planning) ตรงกับข้อความ จึงตอบ YES" }
    },
    35: {
        questionPhrase: { en: "sets out clear explanations about sources of new ideas", th: "ให้คำอธิบายชัดเจนถึงที่มาของไอเดียใหม่" },
        passagePhrase: { en: "the provenance of the raw material... is not as clearly known", th: "ที่มาของวัตถุดิบที่กฎนี้ทำงานด้วยยังไม่เป็นที่รู้ชัด" },
        pairs: [
          { q: "clear explanations", p: "not as clearly known", th: "อธิบายชัดเจน vs. ยังไม่เป็นที่รู้ชัด", note: "ผู้เขียนบอกที่มาของไอเดีย 'not as clearly known' ขัดกับ 'clear explanations' ในโจทย์ จึงตอบ NO" },
          { q: "the sources of new ideas and behaviours", p: "the provenance of the raw material", th: "ที่มาของไอเดีย/วัตถุดิบใหม่" },
        ],
        keyVocab: { word: "not as clearly known", th: "ยังไม่เป็นที่รู้ชัด", contrastA: "clear explanations . อธิบายชัดเจน", contrastB: "not clearly known . ไม่เป็นที่รู้ชัด", note: "ผู้เขียนบอกที่มาของไอเดีย 'not as clearly known' ขัดกับ 'clear explanations' ในโจทย์ จึงตอบ NO" }
    },
    36: {
        questionPhrase: { en: "many scientists are now turning away from genius", th: "นักวิทยาศาสตร์จำนวนมากกำลังเลิกเชื่อแนวคิดอัจฉริยะ" },
        passagePhrase: { en: "The time seems right for abandoning the naive notions", th: "ดูเหมือนถึงเวลาที่ควรละทิ้งแนวคิดไร้เดียงสาเหล่านี้" },
        pairs: [
          { q: "turning away from", p: "abandoning", th: "ละทิ้ง/เลิกเชื่อ", note: "ผู้เขียนพูดแค่ว่า 'ควรถึงเวลา' ละทิ้ง ไม่ได้บอกว่านักวิทยาศาสตร์จำนวนมาก 'กำลัง' ละทิ้งอยู่จริง จึงตอบ NOT GIVEN" },
          { q: "the notion of intelligent design and genius", p: "the naive notions of intelligent design and genius", th: "แนวคิดเรื่องการออกแบบอันชาญฉลาดและอัจฉริยะ" },
          { q: "Many scientists are now", p: "The time seems right", th: "ตอนนี้/ถึงเวลาแล้ว" },
        ],
        keyVocab: { word: "The time seems right for abandoning", th: "ดูเหมือนถึงเวลาที่ควรละทิ้ง", note: "ผู้เขียนพูดแค่ว่า 'ควรถึงเวลา' ละทิ้ง ไม่ได้บอกว่านักวิทยาศาสตร์จำนวนมาก 'กำลัง' ละทิ้งอยู่จริง ข้อมูลนี้ไม่มี จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "a single great mind has sudden inspiration", th: "จิตใจอัจฉริยะเดี่ยวเกิดแรงบันดาลใจขึ้นมาทันที" },
        passagePhrase: { en: "as if ideas spontaneously pop into someone's head - fully formed", th: "ราวกับไอเดียผุดขึ้นในหัวเองทันที สมบูรณ์พร้อม" },
        pairs: [
          { q: "sudden", p: "spontaneously pop into someone's head", th: "ผุดขึ้นมาเองทันที", note: "'sudden 37' = ความเชื่อเรื่อง insight ที่ไอเดีย 'pop into head' ทันที ตรงกับ inspiration จึงตอบ F" },
          { q: "a single great mind", p: "fully formed and functional", th: "ไอเดียที่สมบูรณ์พร้อมในหัวคนเดียว" },
        ],
        keyVocab: { word: "inspiration", th: "แรงบันดาลใจ", note: "'sudden 37' ในสรุป = ความเชื่อเรื่อง insight ที่ไอเดีย 'pop into head' ทันที ตรงกับคำว่า inspiration จึงตอบ F" }
    },
    38: {
        questionPhrase: { en: "the process involves mistakes, like Nicholson's theory", th: "กระบวนการนี้เกี่ยวข้องกับความผิดพลาด เช่นทฤษฎีของนิโคลสัน" },
        passagePhrase: { en: "innovation is more a process of trial and error", th: "นวัตกรรมคือกระบวนการลองผิดลองถูกมากกว่า" },
        pairs: [
          { q: "mistakes", p: "trial and error", th: "ความผิดพลาด/การลองผิดลองถูก", note: "'trial and error' โยงกับ error = mistakes และนิโคลสันคิดผิดเรื่อง proto-elements จึงตอบ D" },
          { q: "a longer process", p: "the cumulative nature of scientific progress", th: "กระบวนการที่ยาวนาน/สะสมต่อเนื่อง" },
          { q: "Nicholson's theory about proto-elements", p: "Nicholson was wrong about the presence of proto-elements", th: "ทฤษฎี proto-elements ของนิโคลสันที่ผิดพลาด" },
        ],
        keyVocab: { word: "trial and error", th: "การลองผิดลองถูก", note: "'trial and error' โยงกับ error = mistakes และนิโคลสันก็คิดผิดเรื่อง proto-elements จึงตอบ D (mistakes)" }
    },
    39: {
        questionPhrase: { en: "an element of luck, like the Post-It coincidence", th: "องค์ประกอบของโชค เช่นความบังเอิญของโพสต์อิท" },
        passagePhrase: { en: "fresh advances can arise from... pure serendipity - a happy accident", th: "ความก้าวหน้าใหม่อาจเกิดจากความบังเอิญล้วน ๆ อุบัติเหตุที่น่ายินดี" },
        pairs: [
          { q: "luck", p: "pure serendipity - a happy accident", th: "โชค/ความบังเอิญที่นำมาซึ่งสิ่งดี", note: "'serendipity - a happy accident' กับ 'coincidence' ของโพสต์อิท = luck (โชค) จึงตอบ E" },
          { q: "the coincidence of ideas", p: "fresh advances can arise from error, misadventure", th: "ความบังเอิญของไอเดีย/ความก้าวหน้าที่เกิดโดยไม่ตั้งใจ" },
          { q: "the invention of the Post-It note", p: "the invention of the brilliantly simple yet phenomenally successful Post-It note", th: "การประดิษฐ์โพสต์อิท" },
        ],
        keyVocab: { word: "serendipity / happy accident", th: "ความบังเอิญที่นำมาซึ่งสิ่งดี", note: "'serendipity - a happy accident' กับ 'coincidence' ของโพสต์อิท = คำว่า luck (โชค) จึงตอบ E" }
    },
    40: {
        questionPhrase: { en: "there may be no clear goal involved", th: "อาจไม่มีเป้าหมายชัดเจนเข้ามาเกี่ยวข้อง" },
        passagePhrase: { en: "a mechanical process of variation and selection, without any end objective", th: "กระบวนการเชิงกลของการแปรผันและคัดเลือก โดยปราศจากเป้าหมายปลายทาง" },
        pairs: [
          { q: "no clear", p: "not as clearly known", th: "ไม่ชัดเจน", note: "'no clear 40' สะท้อน 'without any end objective' ของกฎทั้งสอง = ไม่มี goals จึงตอบ B" },
          { q: "a process of variation and selection", p: "variation and selection", th: "กระบวนการแปรผันและคัดเลือก" },
          { q: "the Law of Natural Selection and the Law of Effect", p: "the Law of Effect operates is not as clearly known as that of the genetic mutations on which the Law of Natural Selection operates", th: "กฎแห่งผลและกฎการคัดเลือกตามธรรมชาติ" },
        ],
        keyVocab: { word: "without any end objective", th: "ปราศจากเป้าหมายปลายทาง", note: "'no clear 40' ในสรุปสะท้อน 'without any end objective' = ไม่มี goals จึงตอบ B (goals)" }
    },
  },
  "Cambridge 17 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "covers a range of factors affecting New York", th: "ครอบคลุมปัจจัยหลายอย่างที่ส่งผลต่อการพัฒนานิวยอร์ก" },
        passagePhrase: { en: "combines geology, history, economics, and a lot of data", th: "ผสมผสานธรณีวิทยา ประวัติศาสตร์ เศรษฐศาสตร์ และข้อมูลจำนวนมาก" },
        pairs: [
          { q: "covers a range of factors", p: "combines geology, history, economics, and a lot of data", th: "รวมหลายปัจจัย/หลายศาสตร์เข้าด้วยกัน", note: "หนังสือ 'combines' หลายสาขา = 'a range of factors' จึงตอบ D ไม่ใช่ B" },
          { q: "development of New York", p: "history of New York City", th: "การพัฒนา/ประวัติของนิวยอร์ก" },
          { q: "factors that affected", p: "shaped the skyline", th: "สิ่งที่ส่งผล/หล่อหลอม" },
        ],
        keyVocab: { word: "combines (geology, history, economics...)", th: "ผสมผสาน/รวมหลายศาสตร์เข้าด้วยกัน", note: "การบอกว่าหนังสือ 'combines' หลายสาขา = 'a range of factors' จึงตอบ D ไม่ใช่ B (research papers พูดถึงเฉพาะ part สอง)" }
    },
    28: {
        questionPhrase: { en: "indicates a potential problem with Barr's analysis", th: "ชี้ให้เห็นปัญหาที่อาจมีในการวิเคราะห์ของบาร์" },
        passagePhrase: { en: "it is not obvious why slum clearance would be limiting", th: "ไม่ชัดเจนว่าทำไมการรื้อสลัมถึงเป็นข้อจำกัด" },
        pairs: [
          { q: "a potential problem", p: "it is not obvious why", th: "ปัญหา/ข้อสงสัยที่อาจมี", note: "ผู้เขียนตั้งข้อสงสัย 'not obvious why' = ชี้ปัญหาในการวิเคราะห์ จึงตอบ B" },
          { q: "Barr's analysis", p: "Barr makes the claim", th: "ข้ออ้าง/การวิเคราะห์ของบาร์" },
          { q: "tenements", p: "existing tenements", th: "อาคารชุดเก่า/สลัม" },
        ],
        keyVocab: { word: "not obvious why", th: "ไม่ชัดเจนว่าทำไม (แสดงความข้องใจ)", note: "ผู้เขียนตั้งข้อสงสัยกับเหตุผลของบาร์ = ชี้ปัญหาในการวิเคราะห์ จึงตอบ B" }
    },
    29: {
        questionPhrase: { en: "too specialised for most readers", th: "เฉพาะทางเกินไปสำหรับผู้อ่านทั่วไป" },
        passagePhrase: { en: "more technical than would be preferred by a general audience", th: "เชิงเทคนิคมากกว่าที่ผู้อ่านทั่วไปจะชอบ" },
        pairs: [
          { q: "too specialised", p: "more technical", th: "เชิงเทคนิค/เฉพาะทางเกินไป", note: "'more technical than a general audience' = 'too specialised for most readers' จึงตอบ C" },
          { q: "for most readers", p: "by a general audience", th: "สำหรับผู้อ่านทั่วไป" },
        ],
        keyVocab: { word: "more technical than... a general audience", th: "เชิงเทคนิคเกินกว่าผู้อ่านทั่วไป", note: "'technical for a general audience' = 'too specialised for most readers' จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "some parts have limited appeal to certain people", th: "บางส่วนน่าสนใจสำหรับคนบางกลุ่มเท่านั้น" },
        passagePhrase: { en: "may serve as a distraction to readers primarily interested in New York", th: "อาจรบกวนผู้อ่านที่สนใจเรื่องนิวยอร์กเป็นหลัก" },
        pairs: [
          { q: "limited appeal", p: "a distraction", th: "ดึงดูดได้จำกัด/ทำให้เขว", note: "ทฤษฎีเศรษฐศาสตร์ 'distraction' ต่อบางคนแต่ 'well-suited for undergraduates' = ดึงดูดเฉพาะบางกลุ่ม จึงตอบ D" },
          { q: "certain people", p: "readers primarily interested in New York", th: "ผู้อ่านบางกลุ่ม" },
          { q: "the chapters focusing on the 1920s building boom", p: "the building boom of the 1920s", th: "บทที่ว่าด้วยการก่อสร้างเฟื่องฟูยุค 1920" },
        ],
        keyVocab: { word: "a distraction to readers primarily interested in New York", th: "สิ่งที่ทำให้ผู้อ่านบางกลุ่มเขว/ไม่อิน", note: "ทฤษฎีเศรษฐศาสตร์เมือง 'รบกวน' ผู้อ่านบางกลุ่มแต่ 'well-suited for undergraduates' = ดึงดูดเฉพาะบางคน จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "the nature of the research into the topic", th: "ลักษณะของงานวิจัยในหัวข้อนั้น" },
        passagePhrase: { en: "The data work that went into these estimations is particularly impressive", th: "งานด้านข้อมูลที่ใช้ในการประมาณการนั้นน่าประทับใจเป็นพิเศษ" },
        pairs: [
          { q: "the nature of the research", p: "The data work that went into these estimations", th: "ลักษณะของงานวิจัย/งานข้อมูล", note: "'data work' = 'the nature of the research' สิ่งที่ประทับใจคือตัวงานวิจัย จึงตอบ C" },
          { q: "impresses Shester the most", p: "is particularly impressive", th: "น่าประทับใจที่สุด" },
          { q: "chapter on land values", p: "estimates Manhattan land values", th: "บทว่าด้วยมูลค่าที่ดิน" },
        ],
        keyVocab: { word: "data work... particularly impressive", th: "งานวิเคราะห์ข้อมูลที่น่าประทับใจ", note: "'data work' = 'the nature of the research' สิ่งที่ประทับใจคือตัวงานวิจัย/ข้อมูล จึงตอบ C ไม่ใช่ช่วงเวลาหรือคำแนะนำ" }
    },
    32: {
        questionPhrase: { en: "view of New York from the air lacks interest", th: "ภาพนิวยอร์กจากมุมสูงนั้นน่าเบื่อ ไม่น่าสนใจ" },
        passagePhrase: { en: "a fascinating account of how the New York landscape in 1609 might have looked", th: "เรื่องเล่าที่น่าทึ่งว่าภูมิทัศน์นิวยอร์กปี 1609 อาจเป็นอย่างไร" },
        pairs: [
          { q: "lacks interest", p: "fascinating", th: "น่าเบื่อ ตรงข้ามกับ น่าทึ่ง", note: "ข้อความบอก 'fascinating' ตรงข้ามกับ 'lacks interest' จึงตอบ NO" },
          { q: "how New York probably looked from the air", p: "how the New York landscape in 1609 might have looked from the sky", th: "ภาพนิวยอร์กเมื่อมองจากมุมสูง" },
          { q: "in the early 1600s", p: "in 1609", th: "ช่วงต้นคริสต์ศตวรรษที่ 17" },
        ],
        keyVocab: { word: "fascinating", th: "น่าทึ่ง/น่าหลงใหล", contrastA: "fascinating . น่าทึ่ง", contrastB: "lacks interest . น่าเบื่อ", note: "ข้อความบอก 'fascinating' ตรงข้ามกับ 'lacks interest' จึงตอบ NO" }
    },
    33: {
        questionPhrase: { en: "prepare the reader well for material yet to come", th: "ปูพื้นให้ผู้อ่านพร้อมสำหรับเนื้อหาที่จะตามมา" },
        passagePhrase: { en: "set the stage for the economic analysis that comes later", th: "ปูทางสำหรับการวิเคราะห์เศรษฐศาสตร์ที่มาในภายหลัง" },
        pairs: [
          { q: "prepare the reader well", p: "set the stage", th: "ปูพื้น/เตรียมความพร้อม", note: "'set the stage for... later' = 'prepare the reader for material yet to come' จึงตอบ YES" },
          { q: "material yet to come", p: "the economic analysis that comes later", th: "เนื้อหาที่จะตามมา" },
          { q: "Chapters two and three", p: "Both chapters", th: "บทสองและสาม" },
        ],
        keyVocab: { word: "set the stage for... comes later", th: "ปูพื้น/เตรียมความพร้อมสำหรับเนื้อหาที่มาทีหลัง", note: "'set the stage for... later' = 'prepare the reader for material yet to come' จึงตอบ YES" }
    },
    34: {
        questionPhrase: { en: "biggest problem was a lack of amenities", th: "ปัญหาใหญ่ที่สุดคือการขาดสิ่งอำนวยความสะดวก" },
        passagePhrase: { en: "analyzes their locations in terms of the amenities available in the area", th: "วิเคราะห์ทำเลของย่านเหล่านั้นจากสิ่งอำนวยความสะดวกที่มีในพื้นที่" },
        pairs: [
          { q: "a lack of amenities", p: "the amenities available in the area", th: "สิ่งอำนวยความสะดวก", note: "ข้อความพูดถึง 'amenities' แค่เป็นเกณฑ์วิเคราะห์ทำเล ไม่ได้บอกว่าเป็นปัญหาใหญ่ที่สุด จึงตอบ NOT GIVEN" },
          { q: "immigrant neighbourhoods", p: "immigrant enclaves", th: "ย่านผู้อพยพ" },
        ],
        keyVocab: { word: "amenities available", th: "สิ่งอำนวยความสะดวกที่มีอยู่", note: "ข้อความพูดถึง 'amenities' แค่เป็นเกณฑ์วิเคราะห์ทำเล ไม่ได้บอกว่ามันคือ 'ปัญหาใหญ่ที่สุด' จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "neighbourhoods concentrated around the harbour", th: "ย่านผู้อพยพกระจุกตัวอยู่รอบท่าเรือ" },
        passagePhrase: { en: "between the industries located on the waterfront and the wealthy neighborhoods", th: "อยู่ระหว่างอุตสาหกรรมริมน้ำกับย่านคนรวย" },
        pairs: [
          { q: "concentrate around the harbour", p: "between the industries located on the waterfront and the wealthy neighborhoods", th: "อยู่ตรงกลางระหว่างริมน้ำกับย่านคนรวย ไม่ได้กระจุกที่ท่าเรือ", note: "ย่านอยู่ 'ระหว่าง' บนที่ดินด้อยค่า ไม่ได้กระจุกรอบท่าเรือ จึงตอบ NO" },
          { q: "immigrant neighbourhoods", p: "immigrant enclaves", th: "ย่านผู้อพยพ" },
        ],
        keyVocab: { word: "between the industries on the waterfront and the wealthy neighborhoods", th: "อยู่ระหว่างเขตอุตสาหกรรมริมน้ำกับย่านคนรวย", contrastA: "around the harbour . รอบท่าเรือ", contrastB: "between waterfront and wealthy area . อยู่ตรงกลางระหว่างริมน้ำกับย่านคนรวย", note: "ย่านอยู่ 'ตรงกลาง' บนที่ดินด้อยค่า ไม่ได้กระจุกที่ท่าเรือ จึงตอบ NO" }
    },
    36: {
        questionPhrase: { en: "skyscrapers are absent from", th: "ตึกระฟ้าไม่ถูกสร้างในพื้นที่ใด" },
        passagePhrase: { en: "skyscrapers not being built between the two urban centers", th: "ตึกระฟ้าไม่ถูกสร้างระหว่างศูนย์กลางเมืองสองแห่ง" },
        pairs: [
          { q: "skyscrapers are absent from", p: "skyscrapers not being built", th: "ตึกระฟ้าไม่ถูกสร้าง", note: "ช่องว่างต้องการ 'พื้นที่เฉพาะ' = specific areas (H) ตรงกับ 'between Downtown and Midtown' จึงตอบ H" },
          { q: "specific areas", p: "between Downtown and Midtown New York", th: "พื้นที่เฉพาะระหว่างสองย่าน" },
          { q: "lack of bedrock close to the surface", p: "the absence of bedrock close to the surface", th: "การไม่มีชั้นหินแข็งใกล้ผิวดิน" },
        ],
        keyVocab: { word: "between the two urban centers (Downtown and Midtown)", th: "ระหว่างศูนย์กลางเมืองสองแห่ง = พื้นที่เฉพาะ", note: "ช่องว่างต้องการ 'พื้นที่เฉพาะ' = specific areas (H) ตรงกับ 'between Downtown and Midtown' จึงตอบ H" }
    },
    37: {
        questionPhrase: { en: "this cannot be regarded as", th: "สิ่งนี้ไม่อาจถือว่าเป็น" },
        passagePhrase: { en: "these costs were neither prohibitively high", th: "ต้นทุนเหล่านี้ไม่ได้สูงจนแบกไม่ไหว" },
        pairs: [
          { q: "excessive expense", p: "prohibitively high", th: "แพงสูงเกินไป", note: "'prohibitively high' = 'excessive expense' (D) ค่าฐานรากไม่ได้แพงเกินไป จึงตอบ D" },
          { q: "the cost of foundations increases when bedrock is deep", p: "deeper bedrock does increase foundation costs", th: "ฐานรากแพงขึ้นเมื่อหินแข็งอยู่ลึก" },
        ],
        keyVocab: { word: "prohibitively high", th: "แพงสูงจนทำไม่ได้", note: "'prohibitively high' = 'excessive expense' (D) ค่าฐานรากไม่ได้แพงเกินไป จึงตอบ D" }
    },
    38: {
        questionPhrase: { en: "how ___ are made possible by caissons", th: "สิ่งใดทำได้เพราะใช้ caisson" },
        passagePhrase: { en: "caissons, which enable workers to dig down for considerable distances", th: "caisson ซึ่งช่วยให้คนงานขุดลึกลงไปได้ในระยะมาก" },
        pairs: [
          { q: "deep excavations", p: "dig down for considerable distances", th: "การขุดลึก", note: "'dig down considerable distances' = 'deep excavations' (B) คือสิ่งที่ caisson ทำให้เป็นไปได้ จึงตอบ B" },
          { q: "made possible by the use of caissons", p: "caissons, which enable workers", th: "ทำได้เพราะใช้ caisson" },
        ],
        keyVocab: { word: "dig down for considerable distances", th: "ขุดลึกลงไปในระยะที่มาก", note: "'dig down considerable distances' = 'deep excavations' (B) คือสิ่งที่ caisson ทำให้เป็นไปได้ จึงตอบ B" }
    },
    39: {
        questionPhrase: { en: "he also discusses their ___", th: "เขายังพูดถึง ___ ของมันด้วย" },
        passagePhrase: { en: "discusses not only how caissons work, but also the dangers involved", th: "พูดถึงไม่เพียงวิธีทำงานของ caisson แต่ยังรวมถึงอันตรายที่เกี่ยวข้อง" },
        pairs: [
          { q: "associated risks", p: "the dangers involved", th: "อันตราย/ความเสี่ยงที่เกี่ยวข้อง", note: "'dangers involved' = 'associated risks' (F) จึงตอบ F" },
          { q: "he also discusses", p: "discusses not only how caissons work, but also", th: "เขายังพูดถึง...ด้วย" },
        ],
        keyVocab: { word: "the dangers involved", th: "อันตรายที่เกี่ยวข้อง", note: "'dangers involved' = 'associated risks' (F) จึงตอบ F" }
    },
    40: {
        questionPhrase: { en: "discusses their associated risks", th: "พูดถึงความเสี่ยงที่เกี่ยวข้องกับมัน" },
        passagePhrase: { en: "discusses... also the dangers involved", th: "พูดถึง...อันตรายที่เกี่ยวข้องด้วย" },
        pairs: [
          { q: "associated risks", p: "the dangers involved", th: "อันตราย/ความเสี่ยงที่เกี่ยวข้อง", note: "ช่อง 'their ___' เติมด้วย 'associated risks' (F) เพราะข้อความระบุ 'the dangers involved' จึงตอบ F" },
          { q: "discusses", p: "discusses not only how caissons work, but also", th: "พูดถึง" },
        ],
        keyVocab: { word: "dangers involved", th: "อันตราย/ความเสี่ยงที่เกี่ยวข้อง", note: "ช่อง 39 (their ___) เติมด้วย 'associated risks' (F) เพราะข้อความระบุ 'the dangers involved' จึงตอบ F" }
    },
  },
  "Cambridge 17 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "earlier examples of blindfold chess", th: "ตัวอย่างหมากรุกปิดตาในอดีต" },
        passagePhrase: { en: "displays of the feat go back centuries", th: "การแสดงความสามารถนี้มีมาหลายศตวรรษ" },
        pairs: [
          { q: "earlier examples", p: "go back centuries", th: "ตัวอย่างในอดีต / ย้อนไปนานแล้ว", note: "วลี 'go back centuries' พร้อมเหตุการณ์ศตวรรษที่ 13 และปี 1947 คือ 'earlier examples' ในอดีต จึงตอบย่อหน้า D" },
          { q: "blindfold chess", p: "blindfold chess", th: "หมากรุกปิดตา" },
          { q: "a reference to", p: "first recorded game", th: "การกล่าวอ้างถึง / การบันทึกครั้งแรก" },
        ],
        keyVocab: { word: "go back centuries", th: "ย้อนไปหลายร้อยปี / มีมานานแล้ว", note: "วลี 'go back centuries' และตัวอย่างปี 1947, ศตวรรษที่ 13 คือ 'earlier examples' ในอดีต จึงตอบย่อหน้า D" }
    },
    28: {
        questionPhrase: { en: "what blindfold chess involves", th: "การเล่นหมากรุกปิดตาเกี่ยวข้องกับอะไร" },
        passagePhrase: { en: "the nature of the game is to run through possible moves in the mind", th: "ธรรมชาติของเกมคือการไล่ดูการเดินที่เป็นไปได้ในใจ" },
        pairs: [
          { q: "what blindfold chess involves", p: "The nature of the game", th: "ลักษณะ/ธรรมชาติของเกมว่าเกี่ยวข้องกับอะไร", note: "'the nature of the game' คือการอธิบายว่าการเล่นปิดตา 'involves' อะไร จึงตอบย่อหน้า E" },
          { q: "an outline", p: "run through possible moves in the mind", th: "ภาพรวม/คำอธิบายคร่าว ๆ ของการเดินหมากในใจ" },
          { q: "blindfold", p: "playing blind", th: "ปิดตา / เล่นโดยไม่เห็นกระดาน" },
        ],
        keyVocab: { word: "the nature of the game", th: "ลักษณะ/ธรรมชาติของเกม", note: "'the nature of the game' = คำอธิบายว่าการเล่นปิดตา 'involves' อะไร จึงตอบย่อหน้า E" }
    },
    29: {
        questionPhrase: { en: "his skill is limited to chess", th: "ความสามารถพิเศษของเขาจำกัดอยู่แค่หมากรุก" },
        passagePhrase: { en: "nothing other than playing chess he seems to be supremely gifted at", th: "ไม่มีอะไรนอกจากหมากรุกที่เขาเก่งเป็นพิเศษ" },
        pairs: [
          { q: "limited to chess", p: "nothing other than playing chess", th: "จำกัดอยู่แค่หมากรุก", note: "'nothing other than playing chess that he seems to be supremely gifted at' = ความเก่ง 'limited to chess' จึงตอบย่อหน้า F" },
          { q: "skill", p: "supremely gifted", th: "ความสามารถพิเศษ / พรสวรรค์" },
          { q: "a claim", p: "said Rissman", th: "คำกล่าวอ้าง (โดยนักวิจัย)" },
        ],
        keyVocab: { word: "nothing other than playing chess", th: "ไม่มีอะไรนอกจากหมากรุก", note: "'nothing other than chess' = ความเก่ง 'limited to chess' พอดี (อยู่ในย่อหน้า F ตอน Rissman พูด) จึงตอบ F" }
    },
    30: {
        questionPhrase: { en: "why scientists are interested in his skill", th: "ทำไมนักวิทยาศาสตร์สนใจความสามารถของเขา" },
        passagePhrase: { en: "his prowess has drawn interest from beyond the chess-playing community", th: "ความสามารถของเขาดึงดูดความสนใจจากนอกวงการหมากรุก" },
        pairs: [
          { q: "of interest to scientists", p: "drawn interest", th: "เป็นที่สนใจของนักวิทยาศาสตร์", note: "'drawn interest from beyond the chess-playing community' = นักวิทยาศาสตร์สนใจ จึงตอบย่อหน้า B" },
          { q: "scientists", p: "researchers", th: "นักวิทยาศาสตร์ / นักวิจัย" },
          { q: "Gareyev's skill", p: "Gareyev's prowess", th: "ความสามารถของ Gareyev" },
        ],
        keyVocab: { word: "drawn interest", th: "ดึงดูดความสนใจ", note: "'drawn interest from beyond the chess community' = นักวิทยาศาสตร์สนใจ (interest of scientists) จึงตอบย่อหน้า B" }
    },
    31: {
        questionPhrase: { en: "an outline of Gareyev's priorities", th: "สิ่งที่ Gareyev ให้ความสำคัญที่สุด" },
        passagePhrase: { en: "the most important part for me is the one thing I can fully dedicate myself to", th: "สิ่งสำคัญที่สุดสำหรับเขาคือสิ่งเดียวที่เขาทุ่มเทได้เต็มที่" },
        pairs: [
          { q: "priorities", p: "The most important part", th: "สิ่งที่ให้ความสำคัญที่สุด", note: "'the most important part... the one thing that I can fully dedicate myself to' = 'priorities' อยู่ในย่อหน้า H จึงตอบ H" },
          { q: "Gareyev's", p: "for me", th: "ของ Gareyev (เขาพูดถึงตัวเอง)" },
          { q: "an outline", p: "fully dedicate myself to", th: "ภาพรวมของสิ่งที่เขาทุ่มเทให้" },
        ],
        keyVocab: { word: "the most important part", th: "ส่วนที่สำคัญที่สุด", note: "'most important... dedicate myself to' = 'priorities' (สิ่งที่ให้ความสำคัญ) อยู่ในย่อหน้า H จึงตอบ H" }
    },
    32: {
        questionPhrase: { en: "why the last part of a game may be difficult", th: "ทำไมช่วงท้ายเกมจึงยาก" },
        passagePhrase: { en: "the ends of games are taxing too, as exhaustion sets in", th: "ช่วงจบเกมก็หนักเช่นกัน เพราะความเหนื่อยล้าเริ่มเข้ามา" },
        pairs: [
          { q: "the last part of a game", p: "the ends of games", th: "ช่วงท้าย/ตอนจบของเกม", note: "'the ends of games are taxing too, as exhaustion sets in' = เหตุผลที่ช่วงท้ายเกมยาก อยู่ในย่อหน้า E จึงตอบ E" },
          { q: "difficult", p: "taxing", th: "ยาก / หนัก" },
          { q: "a reason why", p: "as exhaustion sets in", th: "เหตุผล (เพราะความเหนื่อยล้า)" },
        ],
        keyVocab: { word: "exhaustion sets in", th: "ความเหนื่อยล้าเริ่มเกิดขึ้น", note: "'ends of games are taxing... exhaustion' = 'last part difficult' (ช่วงท้ายยากเพราะล้า) อยู่ในย่อหน้า E จึงตอบ E" }
    },
    33: {
        questionPhrase: { en: "all the participants will be blindfolded", th: "ผู้เข้าร่วมทุกคนจะถูกปิดตา" },
        passagePhrase: { en: "his challengers will play as normal, Gareyev himself will be blindfolded", th: "คู่แข่งเล่นตามปกติ มีแต่ Gareyev เท่านั้นที่ถูกปิดตา" },
        pairs: [
          { q: "all the participants will be blindfolded", p: "his challengers will play the games as normal", th: "คู่แข่งเล่นตามปกติ ไม่ได้ถูกปิดตาทุกคน", note: "ข้อความบอกว่าคู่แข่งเล่นปกติ มีแต่ Gareyev ที่ปิดตา ขัดกับคำว่า 'all' จึงตอบ FALSE" },
          { q: "blindfolded", p: "Gareyev himself will be blindfolded", th: "ถูกปิดตา (เฉพาะ Gareyev เท่านั้น)" },
          { q: "the forthcoming games", p: "Next month", th: "เกมที่กำลังจะมาถึง / เดือนหน้า" },
        ],
        keyVocab: { word: "Gareyev himself will be blindfolded", th: "มีแต่ Gareyev เองที่ถูกปิดตา", contrastA: "all . ทุกคน", contrastB: "himself only . เพียงตัวเขาเอง", note: "ข้อความบอกว่าเฉพาะ Gareyev ถูกปิดตา ส่วนคู่แข่งเล่นปกติ ขัดกับคำว่า 'all' จึงตอบ FALSE" }
    },
    34: {
        questionPhrase: { en: "has won competitions in BASE jumping", th: "เคยชนะการแข่งขัน BASE jumping" },
        passagePhrase: { en: "he gets his kicks from the adventure sport of BASE jumping", th: "เขาได้ความตื่นเต้นจากกีฬาผาดโผน BASE jumping" },
        pairs: [
          { q: "BASE jumping", p: "BASE jumping", th: "กีฬากระโดดผาดโผน BASE jumping", note: "ข้อความบอกแค่ว่าเขาชอบเล่น BASE jumping ไม่มีคำว่าชนะการแข่งขัน จึงตอบ NOT GIVEN" },
          { q: "competitions", p: "adventure sport", th: "การแข่งขัน / กีฬาผาดโผน" },
        ],
        keyVocab: { word: "gets his kicks from", th: "ได้ความสนุก/ความตื่นเต้นจาก", note: "ข้อความบอกแค่ว่าเขาชอบเล่น BASE jumping ไม่มีคำว่าชนะการแข่งขัน (won competitions) จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "UCLA is the first university to research this", th: "UCLA เป็นมหาวิทยาลัยแรกที่วิจัยเรื่องนี้" },
        passagePhrase: { en: "researchers at UCLA called him in for tests", th: "นักวิจัยที่ UCLA เรียกเขามาทดสอบ" },
        pairs: [
          { q: "UCLA", p: "University of California in Los Angeles (UCLA)", th: "มหาวิทยาลัยแคลิฟอร์เนีย ลอสแอนเจลิส", note: "ข้อความบอกว่า UCLA เรียกเขามาทดสอบ แต่ไม่เคยบอกว่าเป็นแห่ง 'first' จึงตอบ NOT GIVEN" },
          { q: "carry out research", p: "called him in for tests", th: "ทำการวิจัย / เรียกมาทดสอบ" },
          { q: "blindfold chess players", p: "others like him", th: "ผู้เล่นหมากรุกปิดตา" },
        ],
        keyVocab: { word: "first", th: "เป็นแห่งแรก", note: "ข้อความบอกว่า UCLA ทำการทดสอบ แต่ไม่เคยบอกว่าเป็น 'first' (แห่งแรก) จึงตอบ NOT GIVEN" }
    },
    36: {
        questionPhrase: { en: "good players likely able to play blindfold", th: "ผู้เล่นเก่งน่าจะเล่นปิดตาได้" },
        passagePhrase: { en: "not a far reach for most accomplished players", th: "ไม่ใช่เรื่องยากเกินไปสำหรับผู้เล่นฝีมือดีส่วนใหญ่" },
        pairs: [
          { q: "Good chess players", p: "most accomplished players", th: "ผู้เล่นหมากรุกที่เก่ง", note: "'not a far reach for most accomplished players' = ผู้เล่นเก่งเล่นปิดตาได้ไม่ยาก ตรงกับ statement จึงตอบ TRUE" },
          { q: "likely to be able to", p: "not a far reach", th: "น่าจะทำได้ / ไม่ใช่เรื่องยากเกินเอื้อม" },
          { q: "play blindfold chess", p: "play a game of chess with your eyes closed", th: "เล่นหมากรุกโดยปิดตา" },
        ],
        keyVocab: { word: "not a far reach", th: "ไม่ใช่เรื่องไกลเกินเอื้อม / ทำได้ไม่ยาก", note: "'not a far reach for accomplished players' = ผู้เล่นเก่ง (good players) ทำได้ไม่ยาก ตรงกับ statement จึงตอบ TRUE" }
    },
    37: {
        questionPhrase: { en: "started by testing Gareyev's ___", th: "เริ่มจากทดสอบ ___ ของ Gareyev" },
        passagePhrase: { en: "Jesse Rissman, who runs a memory lab at UCLA", th: "Jesse Rissman ผู้ดูแลห้องแล็บความจำที่ UCLA" },
        pairs: [
          { q: "testing Gareyev's", p: "standard memory tests", th: "ทดสอบความจำของ Gareyev", note: "การทดสอบเป็น 'standard memory tests' จึงเติมคำตอบ memory" },
          { q: "The researchers started by", p: "first had Gareyev perform", th: "นักวิจัยเริ่มต้นด้วย" },
        ],
        keyVocab: { word: "memory", th: "ความจำ", note: "การทดสอบเป็น 'standard memory tests' (ทดสอบความจำ) จึงเติมคำตอบ memory" }
    },
    38: {
        questionPhrase: { en: "recall a string of ___ forwards and backwards", th: "ท่องจำชุด ___ ทั้งไปข้างหน้าและถอยหลัง" },
        passagePhrase: { en: "how many numbers a person can repeat, forwards and backwards", th: "คนหนึ่งท่องตัวเลขซ้ำได้กี่ตัว ทั้งไปและถอยหลัง" },
        pairs: [
          { q: "a string of", p: "how many numbers a person can repeat", th: "ชุด/ลำดับของตัวเลข", note: "'a string of ___ in order and reverse order' ตรงกับ 'repeat numbers forwards and backwards' จึงเติม numbers" },
          { q: "in order and also in reverse order", p: "both forwards and backwards", th: "ทั้งเรียงไปข้างหน้าและถอยหลัง" },
          { q: "recall", p: "repeat", th: "ท่องจำ / พูดซ้ำ" },
        ],
        keyVocab: { word: "numbers", th: "ตัวเลข", note: "'a string of ___ in order and reverse order' ตรงกับ 'repeat numbers forwards and backwards' จึงเติม numbers" }
    },
    39: {
        questionPhrase: { en: "an unusual amount of ___ within brain areas", th: "ปริมาณ ___ ที่ผิดปกติในสมอง" },
        passagePhrase: { en: "greater than average communication between parts of his brain", th: "การสื่อสารระหว่างส่วนต่าง ๆ ของสมองมากกว่าค่าเฉลี่ย" },
        pairs: [
          { q: "an unusual amount of", p: "much greater than average", th: "ปริมาณที่ผิดปกติ / มากกว่าค่าเฉลี่ย", note: "'unusual amount of ___' = 'greater than average communication' ในสมอง จึงเติม communication" },
          { q: "within the areas of Gareyev's brain", p: "between parts of Gareyev's brain", th: "ภายในส่วนต่าง ๆ ของสมอง Gareyev" },
          { q: "concerned with directing attention", p: "allocate attention", th: "เกี่ยวกับการกำกับสมาธิ/ความสนใจ" },
        ],
        keyVocab: { word: "communication", th: "การสื่อสาร (ระหว่างส่วนของสมอง)", note: "'unusual amount of ___' = 'greater than average communication' ในสมอง จึงเติม communication" }
    },
    40: {
        questionPhrase: { en: "brain parts that deal with ___ input", th: "ส่วนสมองที่จัดการข้อมูลแบบ ___" },
        passagePhrase: { en: "Gareyev's visual network is more highly connected", th: "เครือข่ายการมองเห็นของ Gareyev เชื่อมต่อกันมากกว่าปกติ" },
        pairs: [
          { q: "deal with", p: "process", th: "จัดการ / ประมวลผล", note: "'___ input' = ข้อมูลภาพ ตรงกับ 'visual network' ที่ประมวลผลภาพ จึงเติม visual" },
          { q: "the parts of his brain", p: "the areas of his brain", th: "ส่วนต่าง ๆ ของสมองเขา" },
          { q: "unusual strength", p: "more powerful than normal", th: "ความแข็งแกร่งที่ผิดปกติ" },
        ],
        keyVocab: { word: "visual", th: "เกี่ยวกับการมองเห็น", note: "'___ input' = ข้อมูลภาพ ตรงกับ 'visual network' ที่ประมวลผลภาพ จึงเติม visual" }
    },
  },
  "Cambridge 18 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "cooperation to try and minimise risk", th: "ความร่วมมือเพื่อลดความเสี่ยง" },
        passagePhrase: { en: "players in space are collaborating to avoid a shared threat", th: "ฝ่ายต่าง ๆ ในอวกาศกำลังร่วมมือกันเพื่อเลี่ยงภัยคุกคามร่วม" },
        pairs: [
          { q: "cooperation", p: "collaborating", th: "ความร่วมมือ", note: "cooperation = collaborating และ minimise risk = avoid a shared threat ประโยคนี้อยู่ใน section C จึงตอบ C" },
          { q: "minimise risk", p: "avoid a shared threat", th: "ลดความเสี่ยง/เลี่ยงภัยคุกคาม" },
          { q: "takes place", p: "collaborating in new ways", th: "ที่เกิดขึ้น/ที่กำลังดำเนินอยู่" },
        ],
        keyVocab: { word: "collaborating", th: "ร่วมมือกัน", note: "cooperation = collaborating และ minimise risk = avoid a shared threat จึงตอบ section C" }
    },
    28: {
        questionPhrase: { en: "an explanation of a person's aims", th: "การอธิบายเป้าหมายของบุคคล" },
        passagePhrase: { en: "I want to make space a place that is safe to operate", th: "ผมอยากทำให้อวกาศเป็นที่ที่ปฏิบัติงานได้อย่างปลอดภัย" },
        pairs: [
          { q: "a person's aims", p: "I want to make space a place that is safe to operate", th: "เป้าหมายของบุคคล", note: "aims คือคำพูด 'I want to...' ที่ Jah บอกความตั้งใจของตัวเอง อยู่ใน section F จึงตอบ F" },
          { q: "explanation", p: "describes himself", th: "การอธิบาย/บอกถึง" },
          { q: "aims", p: "free and useful for generations to come", th: "สิ่งที่มุ่งหวัง" },
        ],
        keyVocab: { word: "aims", th: "เป้าหมาย", note: "aims คือ 'I want to...' ที่ Jah บอกความตั้งใจของตัวเอง จึงตอบ section F" }
    },
    29: {
        questionPhrase: { en: "a major collision that occurred in space", th: "การชนกันครั้งใหญ่ที่เกิดขึ้นในอวกาศ" },
        passagePhrase: { en: "an Iridium satellite smashed into an inactive Russian satellite", th: "ดาวเทียม Iridium พุ่งชนดาวเทียมรัสเซียที่หยุดทำงาน" },
        pairs: [
          { q: "major collision", p: "smashed into", th: "การชนกันครั้งใหญ่", note: "collision = smashed into การชนของดาวเทียมสองดวงอยู่ใน section A จึงตอบ A" },
          { q: "occurred in space", p: "in orbit", th: "เกิดขึ้นในอวกาศ/ในวงโคจร" },
          { q: "a description of", p: "creating thousands of new pieces of space shrapnel", th: "การบรรยายเหตุการณ์" },
        ],
        keyVocab: { word: "collision", th: "การชนกัน", note: "collision = smashed into การชนของดาวเทียมสองดวงอยู่ใน section A" }
    },
    30: {
        questionPhrase: { en: "comparison with the efficiency of a transportation system", th: "การเปรียบเทียบกับประสิทธิภาพของระบบขนส่ง" },
        passagePhrase: { en: "Think about a busy day at an airport...planes line up in the sky", th: "ลองนึกถึงวันที่สนามบินยุ่ง เครื่องบินเรียงแถวบนฟ้า" },
        pairs: [
          { q: "a transportation system", p: "a busy day at an airport", th: "ระบบขนส่ง", note: "transportation system = airport/planes การเทียบกับสนามบินอยู่ใน section E จึงตอบ E" },
          { q: "tracking objects in space", p: "the location of the planes down to one metre in accuracy", th: "การติดตามตำแหน่งวัตถุ" },
          { q: "comparison", p: "it's similar to managing traffic on the roads or in the air", th: "การเปรียบเทียบ" },
        ],
        keyVocab: { word: "transportation system", th: "ระบบขนส่ง", note: "transportation system = airport/planes การเทียบกับสนามบินอยู่ใน section E" }
    },
    31: {
        questionPhrase: { en: "efforts to classify space junk", th: "ความพยายามจัดหมวดหมู่ขยะอวกาศ" },
        passagePhrase: { en: "developing taxonomies of space", th: "พัฒนาการจัดประเภทของอวกาศ" },
        pairs: [
          { q: "classify", p: "developing taxonomies", th: "จัดหมวดหมู่/จัดประเภท", note: "classify = developing taxonomies การจัดประเภทวัตถุอยู่ใน section B จึงตอบ B" },
          { q: "space junk", p: "an object", th: "ขยะอวกาศ/วัตถุในอวกาศ" },
          { q: "efforts", p: "working on measuring properties", th: "ความพยายาม/การลงมือทำ" },
        ],
        keyVocab: { word: "classify", th: "จัดหมวดหมู่", note: "classify = developing taxonomies การจัดประเภทวัตถุอยู่ใน section B" }
    },
    32: {
        questionPhrase: { en: "how the ___ of space can be achieved", th: "ทำอย่างไรให้บรรลุ ___ ของอวกาศ" },
        passagePhrase: { en: "developed guidelines on space sustainability", th: "จัดทำแนวทางว่าด้วยความยั่งยืนของอวกาศ" },
        pairs: [
          { q: "of space can be achieved", p: "guidelines on space sustainability", th: "ของอวกาศ", note: "ช่องว่างเติมด้วยคำเดียวจาก passage คือ sustainability ตรงกับ 'guidelines on space sustainability' จึงตอบ sustainability" },
          { q: "gives advice on", p: "have developed guidelines", th: "ให้คำแนะนำ/จัดทำแนวทาง" },
        ],
        keyVocab: { word: "sustainability", th: "ความยั่งยืน", note: "คำเดียวจาก passage ที่เติมช่องคือ sustainability ตรงกับ 'guidelines on space sustainability'" }
    },
    33: {
        questionPhrase: { en: "any unused ___ or pressurised material", th: "เชื้อเพลิงที่ยังไม่ได้ใช้ หรือวัสดุแรงดันสูง" },
        passagePhrase: { en: "venting pressurised materials or leftover fuel", th: "ปล่อยวัสดุแรงดันสูงหรือเชื้อเพลิงที่เหลือ" },
        pairs: [
          { q: "unused", p: "leftover", th: "ที่ยังไม่ได้ใช้/ที่เหลือ", note: "unused = leftover คำที่คู่กับ pressurised material คือ fuel จึงตอบ fuel" },
          { q: "pressurised material", p: "pressurised materials", th: "วัสดุแรงดันสูง" },
        ],
        keyVocab: { word: "fuel", th: "เชื้อเพลิง", note: "unused = leftover คำที่คู่กับ pressurised material คือ fuel จึงตอบ fuel" }
    },
    34: {
        questionPhrase: { en: "that could cause ___", th: "ที่อาจก่อให้เกิด ___" },
        passagePhrase: { en: "leftover fuel that might lead to explosions", th: "เชื้อเพลิงที่เหลืออาจนำไปสู่การระเบิด" },
        pairs: [
          { q: "could cause", p: "might lead to", th: "อาจก่อให้เกิด", note: "could cause = might lead to สิ่งที่ตามมาคือ explosions จึงตอบ explosions" },
          { q: "no longer active", p: "at the end of their useful life", th: "ไม่ทำงานแล้ว/หมดอายุการใช้งาน" },
        ],
        keyVocab: { word: "explosions", th: "การระเบิด", note: "could cause = might lead to สิ่งที่ตามมาคือ explosions จึงตอบ explosions" }
    },
    35: {
        questionPhrase: { en: "the operators that become ___", th: "ผู้ให้บริการที่กลายเป็น ___" },
        passagePhrase: { en: "What happens to those that fail or go bankrupt?", th: "จะเกิดอะไรกับรายที่ล้มเหลวหรือล้มละลาย" },
        pairs: [
          { q: "operators that become", p: "those that fail or go bankrupt", th: "ผู้ให้บริการที่กลายเป็น", note: "operators ที่ไม่ยอมจ่ายเงินเก็บกวาดดาวเทียมคือผู้ที่ go bankrupt จึงตอบ bankrupt" },
          { q: "unlikely to prioritise removing their satellites", p: "not going to spend money to remove their satellites", th: "ไม่น่าจะให้ความสำคัญกับการเก็บดาวเทียมออก" },
        ],
        keyVocab: { word: "bankrupt", th: "ล้มละลาย", note: "operators ที่ไม่ยอมจ่ายเงินเก็บกวาดดาวเทียมคือผู้ที่ go bankrupt จึงตอบ bankrupt" }
    },
    36: {
        questionPhrase: { en: "knowing exact location would prevent danger", th: "การรู้ตำแหน่งที่แน่นอนจะช่วยป้องกันอันตราย" },
        passagePhrase: { en: "If you knew precisely where everything was, you would almost never have a problem", th: "ถ้ารู้แน่ชัดว่าทุกอย่างอยู่ที่ไหน แทบไม่มีปัญหาเลย" },
        pairs: [
          { q: "exact location", p: "precisely where everything was", th: "ตำแหน่งที่แน่นอน", note: "exact location = precisely where everything was คำพูดนี้เป็นของ Marlon Sorge จึงตอบ C" },
          { q: "prevent any possible danger", p: "almost never have a problem", th: "ป้องกันอันตรายที่อาจเกิด" },
          { q: "Knowing", p: "If you knew", th: "การรู้/ถ้ารู้" },
        ],
        keyVocab: { word: "precisely", th: "อย่างแม่นยำ", note: "exact location = precisely where everything was คำพูดนี้เป็นของ Marlon Sorge จึงตอบ C" }
    },
    37: {
        questionPhrase: { en: "space available to everyone, preserved for the future", th: "อวกาศที่ทุกคนเข้าถึงได้และรักษาไว้เพื่ออนาคต" },
        passagePhrase: { en: "free and useful for generations to come", th: "เปิดกว้างและมีประโยชน์ต่อคนรุ่นต่อไป" },
        pairs: [
          { q: "available to everyone", p: "free and useful", th: "ทุกคนเข้าถึงได้", note: "preserved for the future = for generations to come คำพูดนี้เป็นของ Moriba Jah จึงตอบ D" },
          { q: "preserved for the future", p: "for generations to come", th: "รักษาไว้เพื่ออนาคต" },
          { q: "Space", p: "make space a place that is safe to operate", th: "อวกาศ" },
        ],
        keyVocab: { word: "generations to come", th: "คนรุ่นต่อ ๆ ไป", note: "preserved for the future = for generations to come คำพูดนี้เป็นของ Moriba Jah จึงตอบ D" }
    },
    38: {
        questionPhrase: { en: "a recommendation is widely ignored", th: "ข้อแนะนำถูกเพิกเฉยอย่างกว้างขวาง" },
        passagePhrase: { en: "only about half of all missions have abided by this 25-year goal", th: "มีเพียงราวครึ่งของภารกิจที่ทำตามเป้าหมาย 25 ปีนี้" },
        pairs: [
          { q: "A recommendation", p: "this 25-year goal", th: "ข้อแนะนำ/เป้าหมายที่แนะนำไว้", note: "widely ignored = only about half abided by (อีกครึ่งไม่ทำตาม) คำพูดนี้เป็นของ Holger Krag จึงตอบ B" },
          { q: "widely ignored", p: "only about half of all missions have abided by", th: "ถูกเพิกเฉยอย่างกว้างขวาง" },
        ],
        keyVocab: { word: "abided by", th: "ปฏิบัติตาม", contrastA: "ignored . เพิกเฉย", contrastB: "abided by . ปฏิบัติตาม", note: "widely ignored = only half abided by (อีกครึ่งไม่ทำตาม) Holger Krag เป็นผู้พูด จึงตอบ B" }
    },
    39: {
        questionPhrase: { en: "conflicting information about satellite locations", th: "ข้อมูลตำแหน่งดาวเทียมที่ขัดแย้งกัน" },
        passagePhrase: { en: "US and Russian sources contain two completely different orbits", th: "แหล่งข้อมูลสหรัฐและรัสเซียให้วงโคจรที่ต่างกันสิ้นเชิง" },
        pairs: [
          { q: "conflicting information", p: "two completely different orbits for the same object", th: "ข้อมูลที่ขัดแย้งกัน", note: "conflicting information = two completely different orbits ตัวอย่างนี้มาจาก Jah จึงตอบ D" },
          { q: "where some satellites are in space", p: "the orbits of all known space debris", th: "ตำแหน่งของดาวเทียมในอวกาศ" },
        ],
        keyVocab: { word: "conflicting", th: "ขัดแย้งกัน", note: "conflicting information = two completely different orbits ตัวอย่างนี้มาจาก Jah จึงตอบ D" }
    },
    40: {
        questionPhrase: { en: "risk we cannot undo the damage in space", th: "ความเสี่ยงที่จะแก้ความเสียหายในอวกาศไม่ได้" },
        passagePhrase: { en: "If we go on like this, we will reach a point of no return", th: "ถ้าเป็นแบบนี้ต่อไป เราจะถึงจุดที่ย้อนกลับไม่ได้" },
        pairs: [
          { q: "not be able to undo the damage", p: "a point of no return", th: "แก้ความเสียหายไม่ได้/ย้อนกลับไม่ได้", note: "cannot undo the damage = a point of no return คำพูดนี้เป็นของ Carolin Frueh จึงตอบ A" },
          { q: "a risk", p: "If we go on like this", th: "ความเสี่ยง/ถ้าเป็นแบบนี้ต่อไป" },
        ],
        keyVocab: { word: "point of no return", th: "จุดที่ย้อนกลับไม่ได้", note: "cannot undo the damage = a point of no return คำพูดนี้เป็นของ Carolin Frueh จึงตอบ A" }
    },
  },
  "Cambridge 18 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "first referred to him as a genius 500 years ago", th: "เริ่มเรียกเขาว่าอัจฉริยะเมื่อ 500 ปีก่อน" },
        passagePhrase: { en: "the word 'genius' is universally associated with his name", th: "คำว่าอัจฉริยะถูกเชื่อมโยงกับชื่อของเขาอย่างกว้างขวาง" },
        pairs: [
          { q: "referred to Leonardo da Vinci as a genius", p: "The word ‘genius’ is universally associated with the name of Leonardo da Vinci", th: "ถูกเรียก/เชื่อมโยงกับคำว่าอัจฉริยะ", note: "เนื้อเรื่องบอกแค่ว่าเขาถูกเชื่อมโยงกับคำว่าอัจฉริยะ แต่ไม่ได้บอกว่า 'เริ่มเรียกครั้งแรก' เมื่อ 500 ปีก่อน จึงตอบ NOT GIVEN" },
          { q: "500 years ago", p: "Five hundred years have passed since Leonardo died", th: "ห้าร้อยปี (แต่เนื้อเรื่องนับจากตอนเขาเสียชีวิต)" },
        ],
        keyVocab: { word: "first referred to ... 500 years ago", th: "เริ่มเรียกครั้งแรกเมื่อ 500 ปีก่อน", note: "เนื้อเรื่องบอกแค่ว่าเขาถูกเรียกว่าอัจฉริยะ และผ่านมา 500 ปีตั้งแต่เขาเสียชีวิต แต่ไม่เคยบอกว่า 'เริ่มเรียกครั้งแรก' เมื่อใด จึงตอบ NOT GIVEN" }
    },
    28: {
        questionPhrase: { en: "climate crisis predicted to cause more deaths than the plague", th: "วิกฤตสภาพอากาศคาดว่าจะทำให้ตายมากกว่าโรคระบาด" },
        passagePhrase: { en: "plague caused 200 million deaths; climate crisis predicted to cause death", th: "โรคระบาดทำให้ตาย 200 ล้านคน วิกฤตสภาพอากาศคาดว่าจะทำให้เกิดความตาย" },
        pairs: [
          { q: "the plague", p: "the plague", th: "โรคระบาด (กาฬโรค)" },
          { q: "current climate crisis", p: "climate crisis", th: "วิกฤตสภาพอากาศในปัจจุบัน" },
          { q: "predicted to cause", p: "is predicted to cause", th: "คาดว่าจะทำให้เกิด" },
          { q: "more deaths than the plague", p: "200 million deaths", th: "จำนวนผู้เสียชีวิต", note: "เนื้อเรื่องให้ตัวเลขโรคระบาด 200 ล้าน แต่ไม่เคยเปรียบเทียบว่าวิกฤตสภาพอากาศจะตายมากกว่า จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "more deaths than", th: "ตายมากกว่า", note: "เนื้อเรื่องให้ตัวเลขโรคระบาด 200 ล้าน แต่ไม่เคยให้ตัวเลขหรือเปรียบเทียบว่าวิกฤตสภาพอากาศจะตายมากกว่า จึงตอบ NOT GIVEN" }
    },
    29: {
        questionPhrase: { en: "challenges today can be compared to those of earlier times", th: "ปัญหาในปัจจุบันเทียบได้กับปัญหาในอดีต" },
        passagePhrase: { en: "Then, as now, radical solutions were called for to safeguard humanity", th: "ทั้งในอดีตและปัจจุบัน ต้องการทางออกที่รุนแรงเพื่อปกป้องมนุษยชาติ" },
        pairs: [
          { q: "challenges we face today", p: "now", th: "ปัญหาในปัจจุบัน" },
          { q: "those of earlier times", p: "Then", th: "ปัญหาในอดีต" },
          { q: "can be compared to", p: "Then, as now", th: "เทียบกันได้ / เหมือนกันทั้งอดีตและปัจจุบัน", note: "วลี 'Then, as now' สื่อว่าอดีตกับปัจจุบันคล้ายกัน ตรงกับ 'compared to earlier times' จึงตอบ TRUE" },
        ],
        keyVocab: { word: "Then, as now", th: "ทั้งในอดีตและปัจจุบัน", note: "วลี 'Then, as now' สื่อว่าสถานการณ์ในอดีตและปัจจุบันคล้ายกัน ตรงกับ 'compared to earlier times' จึงตอบ TRUE" }
    },
    30: {
        questionPhrase: { en: "'ideal city' was constructed in the 15th century", th: "เมืองในอุดมคติถูกสร้างขึ้นในศตวรรษที่ 15" },
        passagePhrase: { en: "the 'ideal city' project would remain unfulfilled", th: "โครงการเมืองในอุดมคติยังไม่เคยถูกทำให้สำเร็จ" },
        pairs: [
          { q: "‘ideal city’", p: "‘ideal city’ project", th: "เมืองในอุดมคติ" },
          { q: "constructed", p: "would remain unfulfilled", th: "ถูกสร้างขึ้น (แต่เนื้อเรื่องบอกว่าไม่สำเร็จ)", note: "'unfulfilled' (ไม่สำเร็จ) ขัดกับ 'constructed' (สร้างแล้ว) โดยตรง เมืองนี้ไม่เคยถูกสร้าง จึงตอบ FALSE" },
          { q: "in the 15th century", p: "Around 1486", th: "ในศตวรรษที่ 15" },
        ],
        keyVocab: { word: "remain unfulfilled", th: "ไม่เคยสำเร็จ / ไม่ได้สร้างจริง", contrastA: "constructed . สร้างขึ้น", contrastB: "unfulfilled . ไม่ได้ทำให้สำเร็จ", note: "'unfulfilled' (ไม่สำเร็จ) ขัดแย้งกับ 'constructed' (สร้างแล้ว) โดยตรง เมืองนี้ไม่เคยถูกสร้าง จึงตอบ FALSE" }
    },
    31: {
        questionPhrase: { en: "poor town planning is a major contributor to climate change", th: "การวางผังเมืองที่แย่เป็นตัวการสำคัญของการเปลี่ยนแปลงสภาพอากาศ" },
        passagePhrase: { en: "unsustainable urban models are a key cause of global climate change", th: "รูปแบบเมืองที่ไม่ยั่งยืนเป็นสาเหตุสำคัญของการเปลี่ยนแปลงสภาพอากาศ" },
        pairs: [
          { q: "Poor town planning", p: "unsustainable urban models", th: "การวางผังเมืองที่แย่ / รูปแบบเมืองที่ไม่ยั่งยืน", note: "'unsustainable urban models' พาราเฟรสเป็น 'poor town planning' และ 'key cause' = 'major contributor' จึงตอบ TRUE" },
          { q: "major contributor", p: "a key cause", th: "สาเหตุสำคัญ" },
          { q: "climate change", p: "global climate change", th: "การเปลี่ยนแปลงสภาพอากาศ" },
        ],
        keyVocab: { word: "unsustainable urban models = poor town planning", th: "รูปแบบเมืองที่ไม่ยั่งยืน = การวางผังเมืองที่แย่", note: "'unsustainable urban models' พาราเฟรสเป็น 'poor town planning' และ 'key cause' = 'major contributor' จึงตอบ TRUE" }
    },
    32: {
        questionPhrase: { en: "local people fought against the changes to Pienza and Ferrara", th: "ชาวบ้านต่อต้านการเปลี่ยนแปลงเมือง Pienza และ Ferrara" },
        passagePhrase: { en: "Renaissance men pushed forward urban projects: reconfiguration of Pienza, expansion of Ferrara", th: "คนยุคเรอเนสซองส์ผลักดันโครงการเมือง ปรับ Pienza และขยาย Ferrara" },
        pairs: [
          { q: "the changes to Pienza and Ferrara", p: "the reconfiguration of the town of Pienza and the expansion of the city of Ferrara", th: "การเปลี่ยนแปลงเมือง Pienza และ Ferrara" },
          { q: "local people fought against", p: "pushed forward large-scale urban projects", th: "การต่อต้านของชาวบ้าน (เนื้อเรื่องบอกแค่ว่ามีการผลักดันโครงการ)", note: "เนื้อเรื่องเล่าแค่ว่ามีการปรับและขยายสองเมืองนี้ แต่ไม่เคยพูดว่าชาวบ้านต่อต้าน จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "fought against / local people's reaction", th: "ต่อต้าน / ปฏิกิริยาของชาวบ้าน", note: "เนื้อเรื่องเล่าแค่ว่ามีการปรับและขยายสองเมืองนี้ แต่ไม่เคยพูดถึงว่าชาวบ้านต่อต้านหรือไม่ จึงตอบ NOT GIVEN" }
    },
    33: {
        questionPhrase: { en: "kept a neat, organised record of his designs", th: "เก็บบันทึกงานออกแบบอย่างเป็นระเบียบ" },
        passagePhrase: { en: "his disordered way of working with notes and sketches", th: "วิธีการทำงานกับโน้ตและภาพร่างที่ไม่เป็นระเบียบของเขา" },
        pairs: [
          { q: "neat, organised", p: "disordered", th: "เป็นระเบียบ (แต่เนื้อเรื่องบอกว่าไม่เป็นระเบียบ)", note: "'disordered' ตรงข้ามกับ 'neat, organised' โดยตรง เขาทำงานแบบไม่เป็นระเบียบ จึงตอบ FALSE" },
          { q: "record of his designs", p: "notes and sketches", th: "บันทึกงานออกแบบ / โน้ตและภาพร่าง" },
        ],
        keyVocab: { word: "disordered", th: "ไม่เป็นระเบียบ / ยุ่งเหยิง", contrastA: "neat, organised . เป็นระเบียบ", contrastB: "disordered . ไม่เป็นระเบียบ", note: "'disordered' ตรงข้ามกับ 'neat, organised' โดยตรง เขาทำงานแบบไม่เป็นระเบียบ จึงตอบ FALSE" }
    },
    34: {
        questionPhrase: { en: "provide better _____ for trade", th: "ให้การ _____ ที่ดีขึ้นสำหรับการค้า" },
        passagePhrase: { en: "designed the city for the easy transport of goods", th: "ออกแบบเมืองเพื่อการขนส่งสินค้าที่สะดวก" },
        pairs: [
          { q: "for trade", p: "of goods", th: "สำหรับการค้า / สินค้า" },
          { q: "better transport", p: "easy transport", th: "การขนส่งที่ดี/สะดวกขึ้น", note: "'trade' = 'goods' และคำที่คู่กับการเคลื่อนย้ายสินค้าคือ 'transport' จึงเป็นคำตอบ" },
        ],
        keyVocab: { word: "transport", th: "การขนส่ง", note: "'trade' ในโจทย์ = 'goods' ในเนื้อเรื่อง และคำที่คู่กับการเคลื่อนย้ายสินค้าคือ 'transport' จึงเป็นคำตอบ" }
    },
    35: {
        questionPhrase: { en: "tower blocks today, such as _____ on the exterior", th: "ตึกสูงปัจจุบัน เช่น _____ ที่ด้านนอกอาคาร" },
        passagePhrase: { en: "built on several levels, linked with vertical outdoor staircases", th: "สร้างหลายชั้น เชื่อมด้วยบันไดกลางแจ้งแนวตั้ง" },
        pairs: [
          { q: "tower blocks today", p: "today’s high-rise buildings", th: "ตึกสูงในปัจจุบัน" },
          { q: "on the exterior of a building", p: "vertical outdoor staircases", th: "ที่ด้านนอกอาคาร / กลางแจ้ง" },
          { q: "staircases", p: "staircases", th: "บันได", note: "'on the exterior' = 'outdoor' และสิ่งที่อยู่ภายนอกอาคารคือ 'staircases' จึงเป็นคำตอบ" },
        ],
        keyVocab: { word: "staircases", th: "บันได", note: "'on the exterior' = 'outdoor' และ 'tower blocks' = 'high-rise buildings' สิ่งที่อยู่ภายนอกอาคารคือ 'staircases' จึงเป็นคำตอบ" }
    },
    36: {
        questionPhrase: { en: "his expertise in _____ shown in plans for artificial canals", th: "ความเชี่ยวชาญด้าน _____ ปรากฏในแผนคลองเทียม" },
        passagePhrase: { en: "fusion of architecture and engineering ... created artificial canals", th: "การหลอมรวมสถาปัตยกรรมและวิศวกรรม ... สร้างคลองเทียม" },
        pairs: [
          { q: "expertise in engineering", p: "engineering", th: "ความเชี่ยวชาญด้านวิศวกรรม", note: "โจทย์บอก 'wasn’t only an architect' จึงเป็นอีกด้านคือ 'engineering' ซึ่งคู่กับงานคลองและไฮดรอลิก จึงเป็นคำตอบ" },
          { q: "artificial canals", p: "artificial canals", th: "คลองเทียม" },
          { q: "plans", p: "designed", th: "แผน / ออกแบบ" },
        ],
        keyVocab: { word: "engineering", th: "วิศวกรรม", contrastA: "architecture . สถาปัตยกรรม", contrastB: "engineering . วิศวกรรม", note: "โจทย์บอก 'wasn't only an architect' จึงเป็นอีกด้านคือ 'engineering' ซึ่งคู่กับงานคลองและไฮดรอลิก จึงเป็นคำตอบ" }
    },
    37: {
        questionPhrase: { en: "cities in Italy today follows this _____", th: "เมืองในอิตาลีปัจจุบันยึดตาม _____ นี้" },
        passagePhrase: { en: "a rule still followed in many contemporary cities across Italy", th: "กฎที่ยังถูกใช้ในหลายเมืองในอิตาลีปัจจุบัน" },
        pairs: [
          { q: "many cities in Italy today", p: "many contemporary cities across Italy", th: "หลายเมืองในอิตาลีปัจจุบัน" },
          { q: "follows this rule", p: "a rule still followed", th: "ยึดตามกฎนี้", note: "'follows this ___' จับคู่ตรงกับ 'a rule still followed' คำตอบคือ 'rule'" },
        ],
        keyVocab: { word: "rule", th: "กฎ / หลักเกณฑ์", note: "'follows this ___' จับคู่ตรงกับ 'a rule still followed' คำตอบคือ 'rule'" }
    },
    38: {
        questionPhrase: { en: "some cities from _____ times", th: "เมืองบางเมืองจากยุค _____" },
        passagePhrase: { en: "some of these features existed in Roman cities", th: "ลักษณะบางอย่างเหล่านี้มีอยู่ในเมืองโรมัน" },
        pairs: [
          { q: "some cities from Roman times", p: "Roman cities", th: "เมืองจากยุคโรมัน", note: "'cities from ___ times' ตรงกับ 'Roman cities' คำตอบคือ 'Roman'" },
          { q: "have aspects", p: "some of these features existed", th: "มีลักษณะบางอย่าง" },
        ],
        keyVocab: { word: "Roman", th: "โรมัน", note: "'cities from ___ times' ตรงกับ 'Roman cities' คำตอบคือ 'Roman'" }
    },
    39: {
        questionPhrase: { en: "_____ is a city redesigned in the 19th century", th: "_____ คือเมืองที่ถูกออกแบบใหม่ในศตวรรษที่ 19" },
        passagePhrase: { en: "Haussmann's renovation of Paris ... between 1853 and 1870", th: "การปรับปรุงปารีสของโอสมานน์ ... ระหว่างปี 1853 ถึง 1870" },
        pairs: [
          { q: "redesigned in the 19th century", p: "renovation of Paris under Emperor Napoleon III between 1853 and 1870", th: "ถูกออกแบบใหม่ในศตวรรษที่ 19" },
          { q: "Paris", p: "Paris", th: "ปารีส", note: "'redesigned in the 19th century' = 'renovation ... 1853 and 1870' เมืองที่ถูกปรับคือ 'Paris' จึงเป็นคำตอบ" },
        ],
        keyVocab: { word: "Paris", th: "ปารีส", note: "'redesigned in the 19th century' = 'renovation ... 1853 and 1870' เมืองที่ถูกปรับคือ 'Paris' จึงเป็นคำตอบ" }
    },
    40: {
        questionPhrase: { en: "building _____ no longer the best approach", th: "การสร้างเมืองแบบ _____ ไม่ใช่แนวทางที่ดีที่สุดอีกต่อไป" },
        passagePhrase: { en: "the compact city, built upwards instead of outwards", th: "เมืองกระชับที่สร้างขึ้นสูงแทนการขยายออกด้านข้าง" },
        pairs: [
          { q: "no longer seems to be the best approach", p: "the compact city, built upwards instead of outwards", th: "ไม่ใช่แนวทางที่ดีที่สุดอีกต่อไป", note: "เนื้อเรื่องเชียร์การสร้าง 'upwards instead of outwards' ดังนั้นแบบที่ไม่ดีอีกต่อไปคือ 'outwards' จึงเป็นคำตอบ" },
          { q: "building outwards", p: "outwards", th: "การสร้างแบบแผ่ขยายออกด้านข้าง" },
        ],
        keyVocab: { word: "outwards", th: "ออกด้านข้าง / แผ่ขยาย", contrastA: "upwards . ขึ้นสูง", contrastB: "outwards . ออกด้านข้าง", note: "เนื้อเรื่องชอบสร้าง 'upwards instead of outwards' ดังนั้นแบบที่ 'ไม่ดีอีกต่อไป' คือ 'outwards' จึงเป็นคำตอบ" }
    },
  },
  "Cambridge 18 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "how a teacher handles a range of learning needs", th: "ครูรับมือกับความต้องการในการเรียนที่หลากหลายอย่างไร" },
        passagePhrase: { en: "asks the No Fear group to identify key characters; most of the class about character development", th: "ให้กลุ่มอ่อนระบุตัวละครหลัก ส่วนคนเก่งวิเคราะห์พัฒนาการตัวละคร" },
        pairs: [
          { q: "a teacher handles", p: "The teacher can ask", th: "ครูจัดการ/มอบหมายงาน" },
          { q: "a range of learning needs", p: "identify the key characters", th: "งานระดับง่ายสำหรับกลุ่มอ่อน", note: "ครูคนเดียวมอบงานต่างระดับ (กลุ่มอ่อนระบุตัวละคร คนเก่งวิเคราะห์พัฒนาการ) = รับมือความต้องการที่หลากหลาย ตอบ B" },
          { q: "range of learning needs", p: "character development", th: "งานระดับยากสำหรับคนเก่ง" },
          { q: "learning needs", p: "literacy demands", th: "ความต้องการด้านทักษะการอ่าน" },
        ],
        keyVocab: { word: "range of learning needs", th: "ความต้องการในการเรียนที่ต่างระดับกัน", note: "ฉากนี้แสดงว่าครูคนเดียวมอบงานต่างระดับให้นักเรียนแต่ละกลุ่ม จึงเป็นการ 'รับมือกับความต้องการที่หลากหลาย' ตอบ B" }
    },
    28: {
        questionPhrase: { en: "It has a very broad appeal", th: "มันดึงดูดใจคนวงกว้างมาก" },
        passagePhrase: { en: "intuitively appealing to almost every stakeholder", th: "ดูน่าสนใจโดยสัญชาตญาณสำหรับผู้มีส่วนได้ส่วนเสียแทบทุกคน" },
        pairs: [
          { q: "broad appeal", p: "intuitively appealing", th: "ดึงดูดใจ/น่าสนใจ", note: "'almost every stakeholder' = วงกว้างมาก จึงเป็น 'broad appeal' ตอบ A" },
          { q: "very broad", p: "almost every stakeholder", th: "เกือบทุกฝ่าย วงกว้าง" },
        ],
        keyVocab: { word: "almost every stakeholder", th: "ผู้เกี่ยวข้องแทบทุกฝ่าย", note: "'almost every stakeholder' = 'broad appeal' (ดึงดูดคนวงกว้าง) จึงตอบ A ไม่ใช่ว่าเอื้อเด็กเก่ง" }
    },
    29: {
        questionPhrase: { en: "students not achieving their full potential", th: "นักเรียนไปไม่ถึงศักยภาพสูงสุดของตน" },
        passagePhrase: { en: "The brightest ones will never summit Mount Qomolangma", th: "เด็กที่เก่งที่สุดจะไม่มีวันได้พิชิตยอดเขาเอเวอเรสต์" },
        pairs: [
          { q: "students not achieving", p: "The brightest ones will never summit", th: "นักเรียนไปไม่ถึง", note: "'never summit Mount Qomolangma' = เด็กเก่งไปไม่ถึงยอด = ไม่ได้ใช้ศักยภาพเต็มที่ ตอบ C" },
          { q: "full potential", p: "summit Mount Qomolangma", th: "จุดสูงสุด/ศักยภาพสูงสุด" },
        ],
        keyVocab: { word: "never summit", th: "ไม่มีวันถึงยอด", note: "'never summit Mount Qomolangma' เปรียบว่าเด็กเก่งไปไม่ถึงจุดสูงสุด = ไม่ได้ใช้ศักยภาพเต็มที่ ตอบ C" }
    },
    30: {
        questionPhrase: { en: "assistance given to a student in their initial stages of learning", th: "ความช่วยเหลือที่ให้นักเรียนในช่วงเริ่มต้นของการเรียน" },
        passagePhrase: { en: "provide and then gradually remove this 'scaffolding' until they are autonomous", th: "ให้แล้วค่อย ๆ ถอด 'นั่งร้าน' นี้ออกจนนักเรียนเรียนเองได้" },
        pairs: [
          { q: "assistance given to a student", p: "scaffolding", th: "ความช่วยเหลือ/นั่งร้าน", note: "'scaffolding' คือสิ่งที่ให้ก่อนแล้วค่อยถอดออกเมื่อนักเรียนทำเองได้ = ความช่วยเหลือช่วงแรก ตอบ C" },
          { q: "in their initial stages", p: "gradually remove this 'scaffolding'", th: "ช่วงเริ่มต้นที่ค่อย ๆ ถอดออก" },
          { q: "learning effectively", p: "until they are autonomous", th: "จนเรียนได้ด้วยตนเอง" },
        ],
        keyVocab: { word: "scaffolding", th: "นั่งร้าน (การช่วยเหลือชั่วคราว)", note: "'scaffolding' คือการช่วยที่ให้ก่อนแล้วถอดออกเมื่อนักเรียนทำเองได้ = ความช่วยเหลือช่วงแรก ตอบ C" }
    },
    31: {
        questionPhrase: { en: "streaming leads to higher achievements", th: "การแบ่งสายตามระดับนำไปสู่ผลสัมฤทธิ์ที่สูงขึ้น" },
        passagePhrase: { en: "tracking has minimal effects on learning outcomes", th: "การแบ่งสายมีผลต่อผลการเรียนน้อยมาก" },
        pairs: [
          { q: "higher achievements", p: "minimal effects on learning outcomes", th: "ผลสัมฤทธิ์การเรียน", note: "ผลต่อการเรียน 'น้อยมาก' = ไม่มีหลักฐานว่าได้ผลสัมฤทธิ์สูงขึ้น ช่องว่างเติม H" },
          { q: "streaming leads to", p: "tracking has", th: "การแบ่งสายส่งผลให้" },
          { q: "very little indication", p: "minimal effects", th: "แทบไม่มีสัญญาณ/ผลน้อยมาก" },
        ],
        keyVocab: { word: "minimal effects on learning outcomes", th: "แทบไม่มีผลต่อผลการเรียน", note: "ถ้าผลต่อการเรียน 'น้อยมาก' แสดงว่าไม่มีหลักฐานว่าเกิดผลสัมฤทธิ์สูงขึ้น ช่องว่างจึงเติม H (higher achievements)" }
    },
    32: {
        questionPhrase: { en: "students placed in the bottom sets", th: "นักเรียนที่ถูกจัดอยู่ในสายล่างสุด" },
        passagePhrase: { en: "students assigned to the lowest sets", th: "นักเรียนที่ถูกจัดให้อยู่ในชุดต่ำที่สุด" },
        pairs: [
          { q: "students placed in", p: "students assigned to", th: "นักเรียนที่ถูกจัดอยู่ใน" },
          { q: "bottom sets", p: "the lowest sets", th: "สาย/ชุดต่ำที่สุด", note: "'lowest sets' = 'bottom sets' ตรงกันโดยตรง ช่องว่างเติม D" },
          { q: "most significant impact", p: "significantly – and negatively – affect", th: "ผลกระทบรุนแรงที่สุด" },
        ],
        keyVocab: { word: "lowest sets", th: "ชุด/สายต่ำที่สุด", note: "'lowest sets' = 'bottom sets' ตรงกันโดยตรง ช่องว่างเติม D" }
    },
    33: {
        questionPhrase: { en: "a large proportion have disadvantaged backgrounds", th: "ส่วนใหญ่มาจากภูมิหลังที่ด้อยโอกาส" },
        passagePhrase: { en: "higher representation of low socioeconomic class", th: "มีสัดส่วนของชนชั้นเศรษฐกิจสังคมต่ำสูงกว่า" },
        pairs: [
          { q: "disadvantaged backgrounds", p: "low socioeconomic class", th: "ภูมิหลังด้อยโอกาส/ฐานะต่ำ", note: "'low socioeconomic class' = 'disadvantaged backgrounds' ช่องว่างเติม F" },
          { q: "a large proportion", p: "much higher representation", th: "สัดส่วนที่สูง/จำนวนมาก" },
        ],
        keyVocab: { word: "low socioeconomic class", th: "ชนชั้นเศรษฐกิจสังคมต่ำ", note: "'low socioeconomic class' = 'disadvantaged backgrounds' (ภูมิหลังด้อยโอกาส) ช่องว่างเติม F" }
    },
    34: {
        questionPhrase: { en: "for the brightest pupils, only minimal advantage", th: "สำหรับเด็กเก่งสุด ได้ประโยชน์เพียงเล็กน้อย" },
        passagePhrase: { en: "the small benefit for those lucky clever students in the higher sets", th: "ประโยชน์เล็กน้อยสำหรับเด็กฉลาดโชคดีในสายสูง" },
        pairs: [
          { q: "brightest pupils", p: "lucky clever students in the higher sets", th: "เด็กเก่งที่สุดในสายสูง", note: "'clever students in the higher sets' = 'brightest pupils' และ small benefit = minimal advantage ช่องว่างเติม E" },
          { q: "minimal advantage", p: "the small benefit", th: "ประโยชน์เพียงเล็กน้อย" },
        ],
        keyVocab: { word: "clever students in the higher sets", th: "เด็กฉลาดในสายสูง", note: "'clever students in the higher sets' = 'brightest pupils' ส่วนคำว่า small benefit = minimal advantage ช่องว่างเติม E" }
    },
    35: {
        questionPhrase: { en: "teachers tend to have lower expectations", th: "ครูมักมีความคาดหวังต่ำกว่าเดิม" },
        passagePhrase: { en: "limits what the teacher feels the student is capable of", th: "จำกัดสิ่งที่ครูรู้สึกว่านักเรียนทำได้" },
        pairs: [
          { q: "lower expectations", p: "limits what the teacher feels the student is capable of", th: "คาดหวังต่ำลง/จำกัดมุมมอง", note: "ครู 'จำกัด' ว่านักเรียนทำได้แค่ไหน = คาดหวังต่ำลง ช่องว่างเติม B" },
          { q: "students in streamed groups", p: "Streaming students by diagnosed achievement", th: "นักเรียนในกลุ่มที่ถูกแบ่งสาย" },
        ],
        keyVocab: { word: "limits what the teacher feels the student is capable of", th: "จำกัดมุมมองครูว่านักเรียนทำได้แค่ไหน", note: "ถ้าครู 'จำกัด' ว่านักเรียนทำได้แค่ไหน ก็คือคาดหวังต่ำลง ช่องว่างเติม B (lower expectations)" }
    },
    36: {
        questionPhrase: { en: "Vygotsky model supports the mixed-ability class", th: "ทฤษฎีไวก็อตสกีสนับสนุนห้องเรียนคละความสามารถ" },
        passagePhrase: { en: "streaming students with similar ZPDs would be an efficient and effective solution", th: "การแบ่งนักเรียนที่มี ZPD ใกล้เคียงกันคือทางออกที่ได้ผล" },
        pairs: [
          { q: "The Vygotsky model", p: "If we accept this model", th: "ทฤษฎีของไวก็อตสกี" },
          { q: "supports the concept of", p: "efficient and effective solution", th: "สนับสนุน/เป็นทางออกที่ดี" },
          { q: "a mixed-ability class", p: "streaming students with similar ZPDs", th: "ห้องคละ vs การแบ่งสาย", note: "ผู้เขียนบอกโมเดลนี้กลับสนับสนุน 'การแบ่งสาย' ไม่ใช่ห้องคละ จึงขัดกับข้อความ ตอบ NO" },
        ],
        keyVocab: { word: "streaming ... efficient and effective", th: "การแบ่งสาย...มีประสิทธิภาพ", contrastA: "streaming . การแบ่งสายตามระดับ", contrastB: "mixed-ability . คละความสามารถ", note: "ผู้เขียนบอกว่าโมเดลของไวก็อตสกีกลับสนับสนุน 'การแบ่งสาย' ไม่ใช่ห้องคละ จึงขัดกับข้อความ ตอบ NO" }
    },
    37: {
        questionPhrase: { en: "teachers uncertain about students taking MKO roles", th: "ครูบางคนไม่แน่ใจที่จะให้นักเรียนทำหน้าที่ MKO" },
        passagePhrase: { en: "the value of knowledgeable student peers must not go unrecognised", th: "คุณค่าของเพื่อนนักเรียนที่มีความรู้ต้องไม่ถูกมองข้าม" },
        pairs: [
          { q: "students to take on MKO roles", p: "knowledgeable student peers", th: "นักเรียนทำหน้าที่ผู้รู้ (MKO)" },
          { q: "in the classroom", p: "in classrooms", th: "ในห้องเรียน" },
          { q: "Some teachers are uncertain", p: "must not go unrecognised", th: "ครูลังเล (ไม่มีกล่าวถึง)", note: "ข้อความพูดถึงคุณค่าของเพื่อน MKO แต่ไม่ได้บอกว่าครู 'ไม่แน่ใจ' จึงไม่มีข้อมูล ตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "must not go unrecognised", th: "ต้องไม่ถูกมองข้าม", note: "ข้อความพูดถึงคุณค่าของเพื่อน MKO แต่ไม่ได้บอกว่าครู 'ไม่แน่ใจ' หรือลังเล จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
    38: {
        questionPhrase: { en: "rewarding to teach knowledge recently acquired", th: "การสอนความรู้ที่เพิ่งได้มาเป็นเรื่องน่าพอใจ" },
        passagePhrase: { en: "something exciting about passing on skills ... you yourself have just mastered", th: "มีความน่าตื่นเต้นในการถ่ายทอดทักษะที่เพิ่งเชี่ยวชาญ" },
        pairs: [
          { q: "rewarding", p: "something exciting", th: "น่าพอใจ/น่าตื่นเต้น", note: "'exciting' = rewarding และ 'just mastered' = recently acquired จึงตรงกับผู้เขียน ตอบ YES" },
          { q: "teach knowledge", p: "passing on skills and knowledge", th: "ถ่ายทอด/สอนความรู้" },
          { q: "only recently acquired", p: "you yourself have just mastered", th: "เพิ่งได้/เพิ่งเชี่ยวชาญ" },
        ],
        keyVocab: { word: "exciting about passing on skills just mastered", th: "น่าตื่นเต้นที่ได้ถ่ายทอดสิ่งที่เพิ่งเชี่ยวชาญ", note: "'exciting' / 'pride and zeal' = rewarding และ 'just mastered' = recently acquired จึงตรงกับผู้เขียน ตอบ YES" }
    },
    39: {
        questionPhrase: { en: "priority is highest-achieving students attain their goals", th: "ควรให้ความสำคัญกับเด็กเก่งสุดให้บรรลุเป้าหมาย" },
        passagePhrase: { en: "the many to flourish – not suffer at the expense of a few bright stars", th: "ให้คนส่วนใหญ่เติบโต ไม่ใช่เสียสละเพื่อดาวเด่นไม่กี่คน" },
        pairs: [
          { q: "The priority should be", p: "we need the many to flourish", th: "สิ่งที่ควรให้ความสำคัญ" },
          { q: "highest-achieving students", p: "a few bright stars", th: "เด็กเก่งสุด/ดาวเด่นไม่กี่คน", note: "ผู้เขียนให้ความสำคัญกับคนส่วนใหญ่ ไม่ใช่เด็กเก่งไม่กี่คน จึงขัดกับข้อความ ตอบ NO" },
          { q: "attain their goals", p: "not suffer at the expense of", th: "บรรลุเป้าหมาย/ไม่เสียสละเพื่อ" },
        ],
        keyVocab: { word: "the many ... not a few bright stars", th: "คนส่วนใหญ่ ไม่ใช่ดาวเด่นไม่กี่คน", contrastA: "the many . คนส่วนใหญ่", contrastB: "a few bright stars . เด็กเก่งไม่กี่คน", note: "ผู้เขียนให้ความสำคัญกับคนส่วนใหญ่ ไม่ใช่เด็กเก่งไม่กี่คน จึงขัดกับข้อความ ตอบ NO" }
    },
    40: {
        questionPhrase: { en: "outdoor activities with teachers improve classroom outcomes", th: "กิจกรรมกลางแจ้งกับครูช่วยพัฒนาผลการเรียนในห้อง" },
        passagePhrase: { en: "I go on a hike with my class ... We make it – together", th: "ฉันไปเดินป่ากับนักเรียน...เราทำสำเร็จด้วยกัน" },
        pairs: [
          { q: "collaborative outdoor activities", p: "I go on a hike with my class", th: "กิจกรรมกลางแจ้งร่วมกัน/เดินป่า" },
          { q: "with teachers and classmates", p: "a mixed bunch of students", th: "กับครูและเพื่อนร่วมชั้น" },
          { q: "improve student outcomes in the classroom", p: "We make it – together", th: "พัฒนาผลการเรียนในห้อง (ไม่มีกล่าวถึง)", note: "ผู้เขียนเล่าเรื่องเดินป่า แต่ไม่ได้บอกว่าช่วย 'ผลการเรียนในห้องเรียน' จึงไม่มีข้อมูล ตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "hike ... We make it together", th: "เดินป่า...เราทำสำเร็จด้วยกัน", note: "ผู้เขียนเล่าเรื่องเดินป่ากับนักเรียน แต่ไม่ได้บอกว่ามันช่วย 'ผลการเรียนในห้องเรียน' จึงไม่มีข้อมูล ตอบ NOT GIVEN" }
    },
  },
  "Cambridge 18 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "widely disputed while he was alive", th: "ถูกโต้แย้งอย่างกว้างขวางตอนที่เขายังมีชีวิตอยู่" },
        passagePhrase: { en: "the focus of an international controversy in his lifetime", th: "เป็นศูนย์กลางของข้อโต้แย้งระดับนานาชาติในช่วงชีวิตของเขา" },
        pairs: [
          { q: "widely disputed", p: "an international controversy", th: "ถูกโต้แย้งอย่างกว้างขวาง", note: "international controversy = widely disputed และ in his lifetime = while he was alive จึงตอบ YES" },
          { q: "while he was alive", p: "in his lifetime", th: "ในช่วงที่เขายังมีชีวิตอยู่" },
        ],
        keyVocab: { word: "controversy", th: "ข้อโต้เถียง / ความขัดแย้งทางความคิด", note: "คำว่า controversy ในเนื้อเรื่องตรงกับ widely disputed ในคำถาม และ in his lifetime = while he was alive จึงตอบ YES" }
    },
    28: {
        questionPhrase: { en: "fixed-continent idea defended in several published works", th: "แนวคิดที่ว่าทวีปอยู่กับที่ถูกปกป้องในงานพิมพ์หลายชิ้น" },
        passagePhrase: { en: "supposing that they remained fixed in place", th: "สมมติว่าทวีปยังคงอยู่กับที่ไม่เคลื่อน" },
        pairs: [
          { q: "remained fixed in place", p: "remained fixed in place", th: "ยังคงอยู่กับที่ไม่เคลื่อน", note: "เนื้อเรื่องพูดถึงแค่แนวคิดว่าทวีปอยู่กับที่ แต่ไม่บอกว่ามีใคร 'ปกป้อง' แนวคิดนี้ในงานพิมพ์หลายชิ้น จึงตอบ NOT GIVEN" },
          { q: "The idea that the continents", p: "supposing that they", th: "แนวคิดที่ว่าทวีป" },
        ],
        keyVocab: { word: "remained fixed in place", th: "ยังคงอยู่กับที่", note: "เนื้อเรื่องพูดถึงแค่แนวคิดว่าทวีปอยู่กับที่ แต่ไม่เคยบอกว่ามีใคร 'ปกป้อง' แนวคิดนี้ในงานพิมพ์หลายชิ้น ข้อมูลส่วน defended ไม่มี จึงตอบ NOT GIVEN" }
    },
    29: {
        questionPhrase: { en: "relied on evidence from just one area of science", th: "อาศัยหลักฐานจากวิทยาศาสตร์เพียงสาขาเดียว" },
        passagePhrase: { en: "evidence from a large number of sciences including geology, geophysics", th: "หลักฐานจากวิทยาศาสตร์จำนวนมากหลายสาขา" },
        pairs: [
          { q: "just one area of science", p: "a large number of sciences", th: "วิทยาศาสตร์สาขาเดียว / หลายสาขา", note: "เนื้อเรื่องระบุชัดว่าใช้หลักฐานจากหลายสาขา ซึ่งขัดกับคำถามที่ว่าใช้เพียงสาขาเดียว จึงตอบ NO" },
          { q: "relied on evidence", p: "using evidence", th: "อาศัยหลักฐาน" },
          { q: "develop his theory", p: "how such continental movements were plausible", th: "พัฒนาทฤษฎีของเขา" },
        ],
        keyVocab: { word: "a large number of sciences", th: "วิทยาศาสตร์หลายสาขา", contrastA: "many . หลายสาขา", contrastB: "just one . เพียงสาขาเดียว", note: "เนื้อเรื่องระบุชัดว่าใช้หลักฐานจากหลายสาขา ซึ่งขัดกับคำถามที่บอกว่าใช้เพียงสาขาเดียว จึงตอบ NO" }
    },
    30: {
        questionPhrase: { en: "similarities are enormous", th: "ความเหมือนระหว่างทฤษฎีทั้งสองมีมากมายมหาศาล" },
        passagePhrase: { en: "Plate tectonics is in many respects quite different from Wegener's proposal", th: "ทฤษฎีแผ่นเปลือกโลกต่างจากแนวคิดของเวเกเนอร์อยู่มากในหลายแง่" },
        pairs: [
          { q: "similarities", p: "quite different", th: "ความเหมือน / ความต่าง", note: "เนื้อเรื่องเน้นว่าทฤษฎีทั้งสอง 'quite different' ตรงข้ามกับคำถามที่อ้างว่ามีความเหมือนมหาศาล จึงตอบ NO" },
          { q: "plate tectonics", p: "Plate tectonics", th: "ทฤษฎีแผ่นเปลือกโลก" },
          { q: "theory of continental drift", p: "Wegener's proposal", th: "ทฤษฎีทวีปเลื่อนของเวเกเนอร์" },
        ],
        keyVocab: { word: "quite different", th: "แตกต่างกันค่อนข้างมาก", contrastA: "different . แตกต่าง", contrastB: "similarities enormous . ความเหมือนมหาศาล", note: "เนื้อเรื่องเน้นว่าทฤษฎีทั้งสอง 'very different' ซึ่งตรงข้ามกับคำถามที่อ้างว่าความเหมือนมีมหาศาล จึงตอบ NO" }
    },
    31: {
        questionPhrase: { en: "interesting aspect of Greene's background research", th: "แง่มุมที่น่าสนใจจากการค้นคว้าของกรีน" },
        passagePhrase: { en: "When I started writing about Wegener's life and work", th: "ตอนที่ฉันเริ่มเขียนเกี่ยวกับชีวิตและงานของเวเกเนอร์" },
        pairs: [
          { q: "Greene's background research", p: "When I started writing about Wegener's life and work", th: "การค้นคว้าเขียนชีวประวัติของกรีน", note: "ผู้เขียน (I) เล่าสิ่งที่น่าสนใจที่พบขณะค้นคว้าเขียนชีวประวัติ จึงโยงกับตัวเลือก I biographer's perspective" },
          { q: "interesting aspect", p: "most intriguing things", th: "แง่มุมที่น่าสนใจ" },
        ],
        keyVocab: { word: "biographer's perspective", th: "มุมมองของผู้เขียนชีวประวัติ", note: "ผู้เขียน (I) เล่าสิ่งที่น่าสนใจที่เขาพบขณะค้นคว้าเขียนชีวประวัติ จึงโยงกับตัวเลือก I biographer's perspective" }
    },
    32: {
        questionPhrase: { en: "Wegener's interests (spanned several fields)", th: "ความสนใจของเวเกเนอร์ครอบคลุมหลายสาขา" },
        passagePhrase: { en: "trained as an astronomer and pursued a career in atmospheric physics", th: "เรียนมาเป็นนักดาราศาสตร์และทำงานด้านฟิสิกส์บรรยากาศ" },
        pairs: [
          { q: "Wegener's interests", p: "trained as an astronomer and pursued a career in atmospheric physics", th: "ความสนใจเชิงวิชาชีพของเวเกเนอร์", note: "เวเกเนอร์ทำงานข้ามหลายสาขา (ดาราศาสตร์ ฟิสิกส์บรรยากาศ) สะท้อนความสนใจเชิงวิชาชีพ จึงตอบ F professional interests" },
          { q: "interests", p: "pursued a career", th: "สิ่งที่มุ่งทำเป็นอาชีพ" },
        ],
        keyVocab: { word: "professional interests", th: "ความสนใจเชิงอาชีพ/วิชาชีพ", note: "เวเกเนอร์ทำงานข้ามหลายสาขา (ดาราศาสตร์ ฟิสิกส์บรรยากาศ ธรณีวิทยา) สะท้อนความสนใจเชิงวิชาชีพที่หลากหลาย จึงตอบ F professional interests" }
    },
    33: {
        questionPhrase: { en: "Wegener already had (a degree of fame)", th: "เวเกเนอร์มีชื่อเสียงอยู่ก่อนแล้วในระดับหนึ่ง" },
        passagePhrase: { en: "However, he was not an 'unknown'", th: "อย่างไรก็ตาม เขาไม่ใช่คนไร้ชื่อเสียง" },
        pairs: [
          { q: "already had", p: "was not an 'unknown'", th: "มีชื่อเสียงอยู่ก่อนแล้วในระดับหนึ่ง", note: "วลี not an 'unknown' = มีชื่อเสียงในระดับหนึ่ง ตรงกับตัวเลือก A modest fame" },
          { q: "At the time he proposed his theory", p: "When he proposed the theory of continental displacements in 1912", th: "ตอนที่เขาเสนอทฤษฎี" },
        ],
        keyVocab: { word: "not an 'unknown'", th: "ไม่ใช่คนที่ไม่มีใครรู้จัก", contrastA: "not unknown . มีคนรู้จักอยู่บ้าง", contrastB: "modest fame . ชื่อเสียงพอประมาณ", note: "วลี not an 'unknown' = มีชื่อเสียงในระดับหนึ่ง ตรงกับตัวเลือก A modest fame" }
    },
    34: {
        questionPhrase: { en: "staying airborne for a period (that broke a record)", th: "อยู่บนอากาศนานจนทำสถิติ" },
        passagePhrase: { en: "set a world record for time aloft in a hot-air balloon: 52 hours", th: "ทำสถิติโลกด้านเวลาลอยอยู่บนบอลลูนลมร้อน 52 ชั่วโมง" },
        pairs: [
          { q: "record-breaking achievement", p: "set a world record", th: "ความสำเร็จที่ทำลายสถิติ", note: "set a world record = record-breaking achievement จึงตอบ C" },
          { q: "staying airborne", p: "time aloft in a hot-air balloon", th: "ลอยอยู่บนอากาศ" },
          { q: "for a period", p: "52 hours", th: "เป็นระยะเวลาหนึ่ง" },
        ],
        keyVocab: { word: "set a world record", th: "ทำสถิติโลก", note: "time aloft 52 hours คือความสำเร็จที่ทำลายสถิติ ตรงกับตัวเลือก C record-breaking achievement" }
    },
    35: {
        questionPhrase: { en: "involvement that gained recognition from scientists", th: "การมีส่วนร่วมที่ทำให้ได้รับการยอมรับจากนักวิทยาศาสตร์" },
        passagePhrase: { en: "a highly publicized and extremely dangerous expedition to Greenland", th: "การสำรวจกรีนแลนด์ที่อันตรายอย่างยิ่งและเป็นข่าวโด่งดัง" },
        pairs: [
          { q: "involvement in", p: "had taken part in", th: "การมีส่วนร่วมใน", note: "dangerous expedition = hazardous exploration จึงตอบ H hazardous exploration" },
          { q: "hazardous exploration", p: "extremely dangerous expedition", th: "การสำรวจที่เสี่ยงภัย" },
          { q: "gained recognition from a small group of scientists", p: "a highly publicized", th: "เป็นที่รู้จัก/โด่งดัง" },
        ],
        keyVocab: { word: "extremely dangerous expedition", th: "การสำรวจที่อันตรายอย่างยิ่ง", contrastA: "dangerous . อันตราย", contrastB: "hazardous . เสี่ยงภัย", note: "dangerous expedition เป็นคำพ้องความหมายกับ hazardous exploration จึงตอบ H" }
    },
    36: {
        questionPhrase: { en: "textbook made him known to a (small group)", th: "ตำราทำให้เขาเป็นที่รู้จักในกลุ่มเล็กๆ" },
        passagePhrase: { en: "made a name for himself amongst a small circle of meteorologists", th: "ทำให้เป็นที่รู้จักในแวดวงเล็กๆ ของนักอุตุนิยมวิทยา" },
        pairs: [
          { q: "a select group", p: "a small circle", th: "กลุ่มเล็กเฉพาะทาง", note: "a small circle of meteorologists = select group กลุ่มเล็กเฉพาะทาง จึงตอบ E" },
          { q: "textbook", p: "a textbook", th: "ตำราเรียน" },
          { q: "become known to", p: "made a name for himself", th: "เป็นที่รู้จัก" },
        ],
        keyVocab: { word: "a small circle", th: "แวดวงเล็กๆ / กลุ่มเล็กๆ", contrastA: "small circle . กลุ่มเล็ก", contrastB: "select group . กลุ่มจำเพาะ", note: "a small circle of meteorologists = select group กลุ่มเล็กเฉพาะทาง จึงตอบ E" }
    },
    37: {
        questionPhrase: { en: "what Greene is doing in the fifth paragraph", th: "กรีนกำลังทำอะไรในย่อหน้าที่ห้า" },
        passagePhrase: { en: "I urge readers to try to experience Wegener's life as he lived it", th: "ฉันขอชวนผู้อ่านให้ลองสัมผัสชีวิตของเวเกเนอร์อย่างที่เขาใช้ชีวิตจริง" },
        pairs: [
          { q: "doing in the fifth paragraph", p: "I urge readers", th: "สิ่งที่ผู้เขียนกำลังทำ", note: "ผู้เขียนกำลังแนะนำวิธีอ่านหนังสือเล่มนี้ให้ผู้อ่าน (advising/recommending an approach) จึงตอบ B" },
          { q: "Greene", p: "experience Wegener's life as he lived it", th: "ชวนผู้อ่านให้ลองสัมผัสชีวิตจริงของเวเกเนอร์" },
        ],
        keyVocab: { word: "I urge readers", th: "ฉันเชิญชวน/กระตุ้นผู้อ่าน", note: "ผู้เขียนกำลังแนะนำวิธีอ่านหนังสือเล่มนี้ให้แก่ผู้อ่าน (advising/recommending an approach) จึงตอบตัวเลือก B" }
    },
    38: {
        questionPhrase: { en: "what is said about Wegener in the sixth paragraph", th: "มีการกล่าวถึงเวเกเนอร์อย่างไรในย่อหน้าที่หก" },
        passagePhrase: { en: "did not seek to find influence or advance his ideas through professional contacts and politics", th: "ไม่ได้พยายามหาอิทธิพลหรือผลักดันความคิดผ่านสายสัมพันธ์และการเมืองในวงวิชาการ" },
        pairs: [
          { q: "said about Wegener", p: "did not seek to find influence or advance his ideas through professional contacts and politics", th: "ไม่ได้ใช้เส้นสาย/การเมืองวิชาการผลักดันความคิด", note: "เวเกเนอร์ไม่สร้างเครือข่ายหรือเล่นการเมืองวิชาการเพื่อดันแนวคิด สะท้อนว่าไม่กระตือรือร้นด้านนี้ จึงตอบ A" },
          { q: "in the sixth paragraph", p: "not active (with a few exceptions) in scientific societies", th: "ไม่ค่อยมีบทบาทในสมาคมวิชาการ" },
        ],
        keyVocab: { word: "did not seek to advance his ideas through contacts", th: "ไม่ได้ใช้เส้นสายผลักดันความคิดของตน", note: "เวเกเนอร์ไม่สนใจสร้างเครือข่ายหรือเล่นการเมืองวิชาการเพื่อดันแนวคิด สะท้อนว่าเขาไม่กระตือรือร้นในด้านนี้ จึงตอบ A" }
    },
    39: {
        questionPhrase: { en: "what Greene says about other famous scientists", th: "กรีนพูดถึงนักวิทยาศาสตร์ดังคนอื่นๆ ว่าอย่างไร" },
        passagePhrase: { en: "The more such material a scientist leaves behind, the better chance a biographer has", th: "ยิ่งนักวิทยาศาสตร์ทิ้งบันทึกไว้มาก ผู้เขียนชีวประวัติยิ่งมีโอกาสเข้าใจได้ดีขึ้น" },
        pairs: [
          { q: "other famous scientists", p: "famous scientists, such as Newton, Darwin, and Einstein", th: "นักวิทยาศาสตร์ดังคนอื่นๆ", note: "กรีนชี้ว่าบันทึกจำนวนมากของนักวิทยาศาสตร์ดังช่วยให้ผู้เขียนชีวประวัติเข้าใจวิธีที่ความคิดก่อตัว สอดคล้องตัวเลือก D research methods" },
          { q: "say about", p: "forming an accurate picture of how a scientist's ideas took shape and evolved", th: "เข้าใจว่าแนวคิดก่อตัวและพัฒนาอย่างไร" },
        ],
        keyVocab: { word: "the more material ... the better chance a biographer has", th: "ยิ่งมีเอกสารมาก ยิ่งช่วยผู้เขียนชีวประวัติได้มาก", note: "กรีนชี้ว่าบันทึก/จดหมายจำนวนมากของนักวิทยาศาสตร์ดัง ช่วยให้เข้าใจวิธีที่ความคิดของพวกเขาก่อตัว สอดคล้องกับตัวเลือก D research methods (ผ่านการศึกษาบันทึกของพวกเขา)" }
    },
    40: {
        questionPhrase: { en: "Greene's main point in the final paragraph", th: "ใจความหลักของกรีนในย่อหน้าสุดท้าย" },
        passagePhrase: { en: "most of the time our lives 'happen to us'", th: "ส่วนใหญ่ชีวิตของเรา 'เกิดขึ้นกับเรา' มากกว่าที่เราจะกำหนดเอง" },
        pairs: [
          { q: "main point in the final paragraph", p: "our lives 'happen to us'", th: "ชีวิตมักไม่เป็นไปตามที่เราวางแผน", note: "ประเด็นหลักคือชีวิตมักไม่เป็นไปตามแผน เราเพียงเล่าย้อนหลังให้ดูเหมือนตั้งใจ จึงตอบ C" },
          { q: "Greene's main point", p: "we only retrospectively turn this happenstance into a coherent narrative of fulfilled intentions", th: "เราเล่าย้อนหลังให้เหตุบังเอิญดูเป็นเรื่องที่ตั้งใจ" },
        ],
        keyVocab: { word: "our lives 'happen to us'", th: "ชีวิตเกิดขึ้นกับเราโดยที่เราควบคุมไม่ได้เต็มที่", contrastA: "happen to us . เกิดขึ้นกับเรา (นอกแผน)", contrastB: "planned and intended . วางแผนไว้", note: "ประเด็นหลักคือชีวิตมักไม่เป็นไปตามที่วางแผน เราเพียงเล่าย้อนหลังให้ดูเป็นเรื่องที่ตั้งใจ จึงตอบ C" }
    },
  },
  "Cambridge 19 Test 1 Passage 3": {
    27: {
        questionPhrase: { en: "a number of reasons for the spread of misinformation", th: "มีหลายสาเหตุที่ทำให้ข้อมูลผิดแพร่กระจาย" },
        passagePhrase: { en: "both deliberately promoted and accidentally shared", th: "ทั้งจงใจปล่อยออกมาและบังเอิญแชร์ต่อ" },
        pairs: [
          { q: "a number of reasons", p: "to gain strategic advantage, to motivate others to action, or even to protect interpersonal bonds", th: "หลายเหตุผล/หลายสาเหตุ", note: "ผู้เขียนยกเหตุผลหลายอย่างของการโกหกและบอกว่าข้อมูลผิดเกิดได้ทั้งจงใจและบังเอิญ จึงมีหลายสาเหตุ จึงตอบ D" },
          { q: "spread of misinformation", p: "sharing inaccurate information", th: "การแพร่กระจายของข้อมูลผิด" },
          { q: "Misinformation", p: "Misinformation", th: "ข้อมูลที่ผิด/บิดเบือน" },
        ],
        keyVocab: { word: "deliberately ... accidentally", th: "อย่างจงใจ ... อย่างบังเอิญ", note: "ผู้เขียนบอกว่าข้อมูลผิดเกิดได้ทั้งแบบจงใจและแบบบังเอิญ และยังยกเหตุผลของการโกหก (เพื่อได้เปรียบ จูงใจคนอื่น ปกป้องความสัมพันธ์) แสดงว่ามีหลายสาเหตุ จึงตอบ D" }
    },
    28: {
        questionPhrase: { en: "technology may provide a solution to misinformation", th: "เทคโนโลยีอาจให้ทางแก้ปัญหาข้อมูลผิดได้" },
        passagePhrase: { en: "the means to correct misinformation might be found in those same patterns", th: "วิธีแก้ข้อมูลผิดอาจพบในรูปแบบการสื่อสารแบบเดียวกันนั้น" },
        pairs: [
          { q: "provide us with a solution", p: "the means to correct misinformation might,over time,be found", th: "ให้วิธีแก้ปัญหา", note: "ผู้เขียนบอกว่าวิธีแก้ข้อมูลผิดอาจพบได้ในระบบสื่อสารมวลชนเดียวกัน = เทคโนโลยีอาจให้ทางแก้ จึงตอบ A" },
          { q: "at some point", p: "over time", th: "ในบางช่วงเวลา/เมื่อเวลาผ่านไป" },
          { q: "technology", p: "those same patterns of mass communication", th: "เทคโนโลยี/การสื่อสารมวลชน" },
          { q: "misinformation", p: "misinformation", th: "ข้อมูลที่ผิด" },
        ],
        keyVocab: { word: "means to correct", th: "วิธี/เครื่องมือในการแก้ไข", note: "ผู้เขียนบอกว่า 'the means to correct misinformation' อาจพบในระบบสื่อสารมวลชนเดียวกันที่ทำให้ข้อมูลผิดแพร่ ซึ่งคือ solution จากเทคโนโลยี จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "outlining which issues are significant today", th: "ชี้ให้เห็นประเด็นสำคัญในปัจจุบัน" },
        passagePhrase: { en: "three observations ... warrant the attention of researchers, policy makers", th: "ข้อสังเกตสามข้อที่ควรได้รับความสนใจจากนักวิจัยและผู้กำหนดนโยบาย" },
        pairs: [
          { q: "outlining which issues", p: "three observations", th: "วางกรอบ/ชี้ประเด็นต่าง ๆ", note: "ย่อหน้าสี่ผู้เขียนวางกรอบข้อสังเกตสามข้อที่ควรได้รับความสนใจในยุคปัจจุบัน จึงตอบ C" },
          { q: "are significant", p: "warrant the attention", th: "มีความสำคัญ/ควรใส่ใจ" },
          { q: "today", p: "contemporary mass-media environment", th: "ในปัจจุบัน" },
        ],
        keyVocab: { word: "warrant the attention", th: "สมควรได้รับความสนใจ (= สำคัญ)", note: "ย่อหน้าสี่ผู้เขียนวางกรอบข้อสังเกตสามข้อที่ 'warrant the attention' = ประเด็นที่สำคัญในยุคปัจจุบัน จึงตอบ C" }
    },
    30: {
        questionPhrase: { en: "regulation fails to prevent misinformation in the media", th: "การกำกับดูแลไม่สามารถกันข้อมูลผิดออกจากสื่อได้" },
        passagePhrase: { en: "do not keep false advertising off the airwaves", th: "ไม่สามารถกันโฆษณาเท็จออกจากการออกอากาศได้" },
        pairs: [
          { q: "Regulation fails to prevent", p: "do not keep false advertising off the airwaves", th: "การกำกับดูแลกันไว้ไม่ได้/ล้มเหลวในการป้องกัน", note: "FDA เน้น 'post hoc detection' ไม่ใช่การกันก่อน และ 'do not keep false advertising off the airwaves' = การกำกับล้มเหลวในการป้องกัน จึงตอบ D" },
          { q: "misinformation from appearing in the media", p: "false advertising off the airwaves", th: "ข้อมูลเท็จที่ปรากฏในสื่อ" },
          { q: "regulation in the USA", p: "regulatory agencies here tend to focus on post hoc detection", th: "การกำกับดูแลในสหรัฐฯ" },
        ],
        keyVocab: { word: "do not keep ... off", th: "กันออกไปไม่ได้ (= ล้มเหลวในการป้องกัน)", contrastA: "preemptive censoring . การเซ็นเซอร์ก่อนเผยแพร่", contrastB: "post hoc detection . การตรวจจับหลังออกอากาศแล้ว", note: "หน่วยงานอย่าง FDA เน้น 'post hoc detection' ไม่ใช่การกันก่อน และ 'do not keep false advertising off the airwaves' = การกำกับล้มเหลวในการป้องกัน จึงตอบ D" }
    },
    31: {
        questionPhrase: { en: "people have frequent exposure to misinformation", th: "ผู้คนพบเจอข้อมูลผิดบ่อยครั้ง" },
        passagePhrase: { en: "it is fairly routine for individuals to come across information that is false", th: "เป็นเรื่องปกติที่คนจะเจอข้อมูลเท็จอยู่เรื่อย ๆ" },
        pairs: [
          { q: "frequent exposure", p: "fairly routine", th: "พบเจอบ่อยครั้ง", note: "'fairly routine to come across false information' = พบเจอบ่อย ตรงกับ G frequent exposure จึงตอบ G" },
          { q: "have ... to misinformation", p: "come across information that is false", th: "ได้พบเจอข้อมูลผิด" },
        ],
        keyVocab: { word: "fairly routine to come across", th: "เป็นเรื่องปกติที่จะพบเจอ", note: "'fairly routine to come across false information' = พบเจอบ่อย ตรงกับ G frequent exposure จึงตอบ G" }
    },
    32: {
        questionPhrase: { en: "Descartes and Spinoza had different ideas", th: "เดการ์ตและสปิโนซามีความคิดที่แตกต่างกัน" },
        passagePhrase: { en: "conflicting predictions ... how Descartes and Spinoza described human information engagement", th: "คำทำนายที่ขัดแย้งกันว่าเดการ์ตและสปิโนซาอธิบายการรับข้อมูลของมนุษย์อย่างไร" },
        pairs: [
          { q: "different ideas", p: "conflicting predictions", th: "ความคิดที่ต่างกัน/ขัดแย้งกัน", note: "'conflicting predictions' ของสองนักปรัชญา = พวกเขามีความคิดต่างกัน ตรงกับ J different ideas จึงตอบ J" },
          { q: "Descartes and Spinoza", p: "Rene Descartes and Baruch Spinoza", th: "เดการ์ตและสปิโนซา" },
          { q: "how people engage with information", p: "described human information engagement", th: "วิธีที่คนรับ/มีปฏิสัมพันธ์กับข้อมูล" },
        ],
        keyVocab: { word: "conflicting predictions", th: "คำทำนายที่ขัดแย้งกัน", note: "'conflicting predictions' ของสองนักปรัชญา = พวกเขามีความคิดต่างกัน ตรงกับ J different ideas จึงตอบ J" }
    },
    33: {
        questionPhrase: { en: "a distinct mental operation is involved", th: "มีกระบวนการทางความคิดที่แยกออกมาเข้ามาเกี่ยวข้อง" },
        passagePhrase: { en: "verify or reject it through a separate cognitive process", th: "ตรวจสอบหรือปฏิเสธมันผ่านกระบวนการคิดที่แยกต่างหาก" },
        pairs: [
          { q: "a distinct ... is involved", p: "through a separate cognitive process", th: "มีกระบวนการแยกต่างหากเข้ามาเกี่ยว", note: "'separate cognitive process' = กระบวนการทางสมองที่แยกออกมา ตรงกับ H mental operation จึงตอบ H" },
          { q: "these stages", p: "accept all encountered information ... and then subsequently verify or reject it", th: "ขั้นตอนเหล่านี้ (รับก่อนแล้วค่อยตรวจสอบ)" },
          { q: "Spinoza believes", p: "Spinoza argued", th: "สปิโนซาเชื่อ/แย้งว่า" },
        ],
        keyVocab: { word: "separate cognitive process", th: "กระบวนการรู้คิดที่แยกต่างหาก", note: "'separate cognitive process' = กระบวนการทางสมอง/ความคิดที่แยกออกมา ตรงกับ H mental operation จึงตอบ H" }
    },
    34: {
        questionPhrase: { en: "recent research has provided additional evidence", th: "งานวิจัยล่าสุดได้ให้หลักฐานเพิ่มเติม" },
        passagePhrase: { en: "empirical evidence ... has supported Spinoza's account", th: "หลักฐานเชิงประจักษ์ได้สนับสนุนแนวคิดของสปิโนซา" },
        pairs: [
          { q: "additional ... for Spinoza's theory", p: "empirical evidence ... has supported Spinoza's account", th: "หลักฐานเพิ่มเติมที่หนุนทฤษฎีของสปิโนซา", note: "'empirical evidence supported Spinoza' = หลักฐานเพิ่มเติมที่หนุนทฤษฎีของเขา ตรงกับ B additional evidence จึงตอบ B" },
          { q: "Recent research", p: "In recent decades, empirical evidence", th: "งานวิจัยล่าสุด" },
          { q: "has provided", p: "has supported", th: "ได้ให้/ได้สนับสนุน" },
        ],
        keyVocab: { word: "empirical evidence ... supported", th: "หลักฐานเชิงประจักษ์ ... สนับสนุน", note: "'empirical evidence supported Spinoza' = หลักฐาน/ข้อพิสูจน์เพิ่มเติมที่หนุนทฤษฎีของเขา ตรงกับ B additional evidence จึงตอบ B" }
    },
    35: {
        questionPhrase: { en: "true even if for an extremely short period", th: "เชื่อว่าจริงแม้เพียงช่วงเวลาสั้นมาก" },
        passagePhrase: { en: "encode all new information as if it were true, even if only momentarily", th: "เข้ารหัสข้อมูลใหม่ทั้งหมดเหมือนว่ามันจริง แม้เพียงชั่วขณะ" },
        pairs: [
          { q: "an extremely", p: "even if only momentarily", th: "เพียงชั่วขณะที่สั้นมาก", note: "'even if only momentarily' = เพียงช่วงเวลาสั้นมาก ตรงกับ E short period จึงตอบ E" },
          { q: "accept all encountered information as if it were true", p: "encode all new information as if it were true", th: "รับข้อมูลทั้งหมดเหมือนว่ามันจริง" },
        ],
        keyVocab: { word: "momentarily", th: "เพียงชั่วขณะ/แวบเดียว", note: "'even if only momentarily' = เพียงช่วงเวลาสั้นมาก ตรงกับ E short period จึงตอบ E" }
    },
    36: {
        questionPhrase: { en: "scepticism and encoding are in different locations in the brain", th: "ส่วนความสงสัยและส่วนเข้ารหัสอยู่คนละตำแหน่งในสมอง" },
        passagePhrase: { en: "reside in a different part of the brain than the resources used in perceiving and encoding", th: "อยู่คนละส่วนของสมองกับทรัพยากรที่ใช้รับรู้และเข้ารหัส" },
        pairs: [
          { q: "in ... in the brain", p: "a different part of the brain", th: "อยู่คนละตำแหน่งในสมอง", note: "'a different part of the brain' = คนละตำแหน่งในสมอง ตรงกับ C different locations จึงตอบ C" },
          { q: "resources for scepticism", p: "mental resources for skepticism", th: "ทรัพยากรสำหรับความสงสัย" },
          { q: "resources for perceiving and encoding", p: "the resources used in perceiving and encoding", th: "ทรัพยากรที่ใช้รับรู้และเข้ารหัส" },
        ],
        keyVocab: { word: "a different part of the brain", th: "ส่วนต่างกันของสมอง", note: "'a different part of the brain' = คนละตำแหน่งในสมอง ตรงกับ C different locations จึงตอบ C" }
    },
    37: {
        questionPhrase: { en: "campaigns fail if people cannot understand them", th: "แคมเปญจะล้มเหลวถ้าคนไม่เข้าใจมัน" },
        passagePhrase: { en: "audiences need to be able to comprehend them ... to be persuasive", th: "ผู้รับสารต้องเข้าใจมันได้จึงจะโน้มน้าวสำเร็จ" },
        pairs: [
          { q: "Campaigns designed to correct misinformation", p: "a campaign to correct misinformation", th: "แคมเปญแก้ไขข้อมูลผิด", note: "ผู้เขียนบอกว่าแคมเปญจะโน้มน้าวได้ต้องให้ผู้ฟังเข้าใจมัน = ถ้าไม่เข้าใจก็ล้มเหลว ตรงกับโจทย์ จึงตอบ YES" },
          { q: "unable to understand them", p: "audiences need to be able to comprehend them", th: "เข้าใจมันไม่ได้" },
          { q: "fail to achieve their purpose", p: "to be persuasive", th: "ไม่บรรลุเป้าหมาย/ไม่โน้มน้าวสำเร็จ" },
        ],
        keyVocab: { word: "need to comprehend ... to be persuasive", th: "ต้องเข้าใจ ... จึงจะโน้มน้าวได้", note: "ผู้เขียนบอกว่าแคมเปญจะ 'persuasive' ได้ก็ต่อเมื่อผู้ฟัง 'comprehend' มันได้ = ถ้าไม่เข้าใจก็ล้มเหลว ตรงกับข้อความ จึงตอบ YES" }
    },
    38: {
        questionPhrase: { en: "teaching school students about misinformation has been opposed", th: "การสอนนักเรียนเรื่องข้อมูลผิดถูกคัดค้าน" },
        passagePhrase: { en: "the utility of media literacy efforts as early as elementary school", th: "ประโยชน์ของการสอนรู้เท่าทันสื่อตั้งแต่ชั้นประถม" },
        pairs: [
          { q: "teach elementary school students", p: "media literacy efforts as early as elementary school", th: "สอนนักเรียนชั้นประถม", note: "ผู้เขียนแค่แนะว่าการสอนรู้เท่าทันสื่อตั้งแต่ประถมมีประโยชน์ แต่ไม่ได้พูดว่ามันถูกคัดค้านเลย จึงตอบ NOT GIVEN" },
          { q: "about misinformation", p: "the potential for misinformation", th: "เกี่ยวกับข้อมูลผิด" },
        ],
        keyVocab: { word: "opposed", th: "ถูกคัดค้าน/ต่อต้าน", note: "ผู้เขียนแค่แนะว่าการสอนรู้เท่าทันสื่อตั้งแต่ประถมมีประโยชน์ แต่ไม่ได้พูดถึงการที่มันถูก 'opposed' เลย ข้อมูลไม่ปรากฏ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "overcome misinformation in a relatively short period", th: "แก้ปัญหาข้อมูลผิดได้ในช่วงเวลาสั้น ๆ" },
        passagePhrase: { en: "coordinated efforts over time, rather than any singular one-time panacea", th: "ต้องอาศัยความร่วมมือต่อเนื่องยาวนาน ไม่ใช่ยาวิเศษครั้งเดียวจบ" },
        pairs: [
          { q: "in a relatively short period", p: "coordinated efforts over time", th: "ในช่วงเวลาสั้น ๆ (ขัดกับ 'ต้องใช้เวลานาน')", note: "ผู้เขียนบอกว่าต้องใช้ความพยายามต่อเนื่อง 'over time' ไม่ใช่ทางลัดครั้งเดียว ขัดกับ 'short period' ในโจทย์ จึงตอบ NO" },
          { q: "overcome the problem of misinformation", p: "To overcome the worst effects of the phenomenon", th: "เอาชนะปัญหาข้อมูลผิด" },
          { q: "It may be possible", p: "rather than any singular one-time panacea", th: "อาจเป็นไปได้ (แต่ผู้เขียนค้านว่าไม่มีทางลัด)" },
        ],
        keyVocab: { word: "over time ... not a one-time panacea", th: "ใช้เวลานาน ... ไม่ใช่ยาครั้งเดียวหาย", contrastA: "short period . ช่วงเวลาสั้น", contrastB: "long and arduous ... over time . ยาวนานและยากลำบาก", note: "ผู้เขียนบอกว่าต้องใช้ความพยายามต่อเนื่อง 'over time' ไม่ใช่ทางลัดครั้งเดียว ขัดกับ 'short period' ในโจทย์ จึงตอบ NO" }
    },
    40: {
        questionPhrase: { en: "the need to keep up with new information is exaggerated", th: "ความจำเป็นที่ต้องตามข้อมูลใหม่ถูกพูดเกินจริง" },
        passagePhrase: { en: "audiences need to be able to comprehend them ... educate and sensitize audiences", th: "ผู้รับสารต้องเข้าใจ ... ให้ความรู้และกระตุ้นการรับรู้แก่ผู้ฟัง" },
        pairs: [
          { q: "keep up with new information", p: "human information needs", th: "ตามทันข้อมูลใหม่", note: "ผู้เขียนไม่เคยกล่าวว่าความจำเป็นในการตามข้อมูลใหม่ถูกพูดเกินจริง ไม่มีข้อมูลในเนื้อเรื่อง จึงตอบ NOT GIVEN" },
          { q: "in today's world", p: "We live at a time when widespread misinformation is common", th: "ในโลกปัจจุบัน" },
        ],
        keyVocab: { word: "keep up with new information", th: "ตามทันข้อมูลใหม่", note: "ผู้เขียนไม่เคยกล่าวว่าความจำเป็นในการตามข้อมูลใหม่ถูก 'exaggerated' (พูดเกินจริง) เลย ไม่มีข้อมูลในเนื้อเรื่อง จึงตอบ NOT GIVEN" }
    },
  },
  "Cambridge 19 Test 2 Passage 3": {
    27: {
        questionPhrase: { en: "regarded as the only female holder", th: "ถูกมองว่าเป็นผู้หญิงคนเดียวที่ได้รับรางวัลนี้" },
        passagePhrase: { en: "the only woman to win the Fields Medal", th: "ผู้หญิงคนเดียวที่ชนะรางวัลฟิลด์ส" },
        pairs: [
          { q: "the only female holder", p: "the only woman", th: "ผู้หญิงคนเดียว / หนึ่งเดียว", note: "เธอเป็น 'the only woman' = หนึ่งเดียวไม่มีใครเหมือน จึงตอบ H 'unique'" },
          { q: "the prestigious Fields Medal", p: "the Fields Medal the mathematical equivalent of a Nobel prize", th: "รางวัลฟิลด์สอันทรงเกียรติ" },
        ],
        keyVocab: { word: "unique", th: "หนึ่งเดียว / ไม่มีใครเหมือน", note: "ข้อความบอกว่าเธอเป็น 'the only woman' = หนึ่งเดียว จึงตรงกับตัวเลือก H 'unique' (ไม่ใช่ J 'innovative')" }
    },
    28: {
        questionPhrase: { en: "maths held little appeal for her", th: "คณิตศาสตร์แทบไม่ดึงดูดเธอเลย" },
        passagePhrase: { en: "maths wasn't her interest - reading was", th: "คณิตไม่ใช่ความสนใจของเธอ การอ่านต่างหากที่ใช่" },
        pairs: [
          { q: "maths held little appeal", p: "maths wasn't her interest", th: "คณิตแทบไม่ดึงดูดเธอเลย", note: "'wasn't her interest' = ไม่มีแรงดึงดูด จึงเติม 'appeal' ตอบ A" },
          { q: "for her as a child", p: "for the first couple of years in her middle school", th: "ในช่วงวัยเด็ก" },
        ],
        keyVocab: { word: "appeal", th: "เสน่ห์ / สิ่งดึงดูดใจ", note: "'wasn't her interest' = ไม่มีแรงดึงดูด จึงเติม 'appeal' (ความน่าสนใจ) ลงในช่อง ตอบ A" }
    },
    29: {
        questionPhrase: { en: "until she was intrigued by a puzzle", th: "จนกระทั่งเธอถูกกระตุ้นความสนใจด้วยโจทย์ปริศนา" },
        passagePhrase: { en: "a famous maths problem ... fascinated her and she was hooked", th: "โจทย์คณิตชื่อดังที่ทำให้เธอหลงใหลและติดงอมแงม" },
        pairs: [
          { q: "she was intrigued", p: "fascinated her and she was hooked", th: "ถูกกระตุ้นให้สนใจอย่างมาก", note: "'fascinated / was hooked' = ถูกทำให้สนใจ ตรงกับ 'intrigued' ตอบ C" },
          { q: "a difficult puzzle", p: "a famous maths problem", th: "โจทย์ปริศนาที่ยาก" },
          { q: "one of her siblings showed her", p: "her elder brother told her", th: "พี่น้องของเธอเป็นคนแนะให้" },
        ],
        keyVocab: { word: "intrigued", th: "ถูกกระตุ้นให้อยากรู้อยากเห็น", note: "'fascinated her / was hooked' = ถูกทำให้สนใจอย่างมาก ตรงกับ 'intrigued' ตอบ C" }
    },
    30: {
        questionPhrase: { en: "determined when things did not go smoothly", th: "มุ่งมั่นแม้ตอนที่อะไรๆ ไม่ราบรื่น" },
        passagePhrase: { en: "resolute in the face of setbacks", th: "หนักแน่นเด็ดเดี่ยวเมื่อเจออุปสรรค" },
        pairs: [
          { q: "determined", p: "resolute", th: "มุ่งมั่น / เด็ดเดี่ยว", note: "'resolute' = ไม่ยอมแพ้ ตรงกับ 'determined' ตอบ B" },
          { q: "when things did not go smoothly", p: "in the face of setbacks", th: "เมื่อเจออุปสรรค" },
        ],
        keyVocab: { word: "determined", th: "มุ่งมั่น / เด็ดเดี่ยว", note: "'resolute in the face of setbacks' = ไม่ยอมแพ้เมื่อเจอปัญหา ตรงกับ 'determined' ตอบ B" }
    },
    31: {
        questionPhrase: { en: "got the greatest satisfaction from discoveries", th: "ได้รับความพึงพอใจสูงสุดจากการค้นพบ" },
        passagePhrase: { en: "the most rewarding part is the 'Aha' moment", th: "ช่วงที่คุ้มค่าที่สุดคือวินาที 'อ๋อ เข้าใจแล้ว'" },
        pairs: [
          { q: "the greatest satisfaction", p: "the most rewarding part", th: "ความอิ่มใจสูงสุด", note: "'most rewarding part / enjoyment' = ความพึงพอใจสูงสุด ตรงกับ 'satisfaction' ตอบ J" },
          { q: "making ground-breaking discoveries", p: "the excitement of discovery", th: "การค้นพบสิ่งใหม่" },
        ],
        keyVocab: { word: "satisfaction", th: "ความพึงพอใจ / ความอิ่มใจ", note: "'most rewarding part / enjoyment of understanding' = ความอิ่มใจสูงสุด ตรงกับ 'satisfaction' ตอบ J" }
    },
    32: {
        questionPhrase: { en: "some extremely innovative mathematical studies", th: "งานวิจัยคณิตที่ล้ำสมัยบุกเบิกอย่างยิ่ง" },
        passagePhrase: { en: "the heights of original research into mathematics", th: "งานวิจัยคณิตเชิงริเริ่มในระดับสูงสุด" },
        pairs: [
          { q: "extremely innovative", p: "original research", th: "ริเริ่มบุกเบิกสิ่งใหม่", note: "'original research' = งานริเริ่มใหม่ ตรงกับ 'innovative' ตอบ I" },
          { q: "mathematical studies", p: "research into mathematics", th: "งานวิจัยทางคณิตศาสตร์" },
        ],
        keyVocab: { word: "innovative", th: "ริเริ่มใหม่ / บุกเบิก", note: "'original research / ground-breaking discoveries' = บุกเบิกสิ่งใหม่ ตรงกับ 'innovative' ตอบ I" }
    },
    33: {
        questionPhrase: { en: "prizewinners only reached average standard when young", th: "ผู้ชนะรางวัลตอนเด็กเก่งแค่ระดับธรรมดา" },
        passagePhrase: { en: "Most Nobel prize winners were unexceptional in childhood", th: "ผู้ชนะรางวัลโนเบลส่วนใหญ่ตอนเด็กไม่ได้โดดเด่น" },
        pairs: [
          { q: "winning prestigious intellectual prizes", p: "Nobel prize winners", th: "ผู้ชนะรางวัลทางปัญญาอันทรงเกียรติ" },
          { q: "only reached an average standard", p: "unexceptional", th: "ระดับธรรมดา ไม่โดดเด่น", note: "'unexceptional in childhood' = ธรรมดาตอนเด็ก ตรงกับคำกล่าวอ้าง จึงตอบ YES" },
          { q: "when young", p: "in childhood", th: "ตอนเด็ก" },
        ],
        keyVocab: { word: "unexceptional", th: "ธรรมดา / ไม่โดดเด่น", note: "'unexceptional in childhood' = ระดับธรรมดาตอนเด็ก ตรงกับคำกล่าวอ้าง จึงตอบ YES" }
    },
    34: {
        questionPhrase: { en: "Einstein's failures due to lack of confidence", th: "ความล้มเหลวของไอน์สไตน์เกิดจากขาดความมั่นใจ" },
        passagePhrase: { en: "He struggled at work initially, but he kept plugging away", th: "ตอนแรกเขาทำงานลำบาก แต่เขาก็พยายามไม่หยุด" },
        pairs: [
          { q: "Einstein's failures as a young man", p: "He struggled at work initially", th: "ความยากลำบากของไอน์สไตน์ตอนหนุ่ม" },
          { q: "lack of confidence", p: "he kept plugging away", th: "การขาดความมั่นใจ", note: "บทความเล่าถึงความลำบากของเขา แต่ไม่ระบุว่าเกิดจากขาดความมั่นใจ จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "confidence", th: "ความมั่นใจ", note: "บทความพูดถึงความล้มเหลวของเขา แต่ไม่เคยระบุ 'สาเหตุ' ว่ามาจากขาดความมั่นใจ จึงตอบ NOT GIVEN" }
    },
    35: {
        questionPhrase: { en: "hard to agree whether children are born gifted", th: "ยากที่จะตกลงกันว่าเด็กเกิดมามีพรสวรรค์หรือไม่" },
        passagePhrase: { en: "the jury is out on giftedness being innate", th: "ยังหาข้อสรุปไม่ได้ว่าพรสวรรค์เป็นสิ่งติดตัวมาแต่กำเนิด" },
        pairs: [
          { q: "difficult to reach agreement", p: "the jury is out", th: "ยังตกลงกันไม่ได้", note: "'the jury is out' = ยังหาข้อสรุปไม่ได้ ตรงกับ 'difficult to reach agreement' จึงตอบ YES" },
          { q: "children are actually born gifted", p: "giftedness being innate", th: "พรสวรรค์ติดตัวมาแต่กำเนิด" },
        ],
        keyVocab: { word: "the jury is out", th: "ยังไม่มีข้อสรุป / ยังถกเถียงกันอยู่", note: "'the jury is out' = ยังตกลงกันไม่ได้ ตรงกับ 'difficult to reach agreement' จึงตอบ YES" }
    },
    36: {
        questionPhrase: { en: "Einstein upset by public's view of his work", th: "ไอน์สไตน์ไม่พอใจกับมุมมองของสาธารณชนต่อผลงานเขา" },
        passagePhrase: { en: "It's not that I'm so smart, it's just that I stay with problems longer", th: "ไม่ใช่ว่าผมฉลาดมาก แค่ผมอยู่กับปัญหานานกว่า" },
        pairs: [
          { q: "Einstein", p: "He once wrote", th: "ไอน์สไตน์" },
          { q: "upset by the public's view of his life's work", p: "It's not that I'm so smart, it's just that I stay with problems longer", th: "ไม่พอใจมุมมองของสาธารณชนต่อผลงาน", note: "บทความไม่กล่าวถึงอารมณ์ของเขาต่อมุมมองสาธารณชนเลย จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "upset", th: "ไม่พอใจ / เสียใจ", note: "บทความไม่กล่าวถึงอารมณ์ของเขาต่อ 'มุมมองของสาธารณชน' เลย จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "success down to the speed of solving questions", th: "ความสำเร็จเกิดจากความเร็วในการแก้ปัญหา" },
        passagePhrase: { en: "it's just that I stay with problems longer", th: "แค่ผมอยู่กับปัญหานานกว่าคนอื่น" },
        pairs: [
          { q: "the speed at which he dealt with", p: "I stay with problems longer", th: "ความเร็วในการแก้ปัญหา (ขัดกับ 'อยู่กับมันนานกว่า')", note: "คำถามว่า 'speed' (เร็ว) แต่ข้อความว่า 'stay longer' (ใช้เวลานานกว่า) ขัดแย้งกัน จึงตอบ NO" },
          { q: "his success", p: "what makes a great scientist", th: "ความสำเร็จของเขา" },
        ],
        keyVocab: { word: "longer", th: "นานกว่า", contrastA: "speed . ความเร็ว", contrastB: "stay longer . อยู่กับมันนานกว่า", note: "คำถามบอก 'speed' (เร็ว) แต่ข้อความบอก 'stay longer' (ใช้เวลานานกว่า) ขัดแย้งกันชัด จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "spirit of inquiry towards their studies", th: "จิตใจใฝ่สงสัยอยากรู้ต่อการเรียน" },
        passagePhrase: { en: "the attributes of high performers - curiosity, persistence", th: "คุณสมบัติของผู้ทำได้ดี เช่น ความอยากรู้และความเพียร" },
        pairs: [
          { q: "a spirit of inquiry", p: "curiosity", th: "จิตใจใฝ่สงสัยอยากรู้", note: "'curiosity' = ความอยากรู้ ตรงกับ 'spirit of inquiry' ในตัวเลือก C จึงตอบ C" },
          { q: "towards their studies", p: "to their learning", th: "ต่อการเรียนรู้" },
        ],
        keyVocab: { word: "curiosity", th: "ความอยากรู้อยากเห็น", note: "'curiosity' = จิตใจใฝ่สงสัย ตรงกับ 'spirit of inquiry' ในตัวเลือก C จึงตอบ C" }
    },
    39: {
        questionPhrase: { en: "innate gift is not the key to expertise", th: "พรสวรรค์ติดตัวไม่ใช่ปัจจัยหลักของความเชี่ยวชาญ" },
        passagePhrase: { en: "he doesn't think unique and innate talents are at the heart of performance", th: "เขาไม่คิดว่าพรสวรรค์ติดตัวคือหัวใจของความสามารถ" },
        pairs: [
          { q: "Being born with a special gift", p: "unique and innate talents", th: "พรสวรรค์ที่ติดตัวมาแต่กำเนิด" },
          { q: "not the key factor", p: "are at the heart of performance", th: "ไม่ใช่ปัจจัยหลัก", note: "Ericsson บอกพรสวรรค์ติดตัวไม่ใช่หัวใจ การฝึกฝนต่างหากสำคัญ จึงตอบ B" },
          { q: "becoming expert", p: "performance", th: "การกลายเป็นผู้เชี่ยวชาญ" },
        ],
        keyVocab: { word: "innate", th: "ติดตัวมาแต่กำเนิด", contrastA: "innate talent . พรสวรรค์ติดตัว", contrastB: "deliberate practice . การฝึกฝนอย่างตั้งใจ", note: "Ericsson บอกว่าพรสวรรค์ติดตัวไม่ใช่หัวใจ การฝึกฝนต่างหากที่สำคัญ ตรงกับตัวเลือก B" }
    },
    40: {
        questionPhrase: { en: "guidance of someone who values learning", th: "การชี้นำจากผู้ที่เห็นคุณค่าของการเรียนรู้" },
        passagePhrase: { en: "an adult ... who valued and supported education", th: "ผู้ใหญ่ที่เห็นคุณค่าและสนับสนุนการศึกษา" },
        pairs: [
          { q: "the guidance of someone", p: "an adult or adults in the child's life", th: "การชี้นำจากผู้ใหญ่สักคน" },
          { q: "who recognises the benefits of learning", p: "who valued and supported education", th: "ผู้ที่เห็นคุณค่าของการเรียนรู้", note: "'an adult who valued and supported education' = ผู้เห็นประโยชน์ของการเรียน ตรงกับตัวเลือก D" },
        ],
        keyVocab: { word: "valued and supported education", th: "เห็นคุณค่าและสนับสนุนการศึกษา", note: "'an adult who valued and supported education' = ผู้ที่เห็นประโยชน์ของการเรียน ตรงกับตัวเลือก D" }
    },
  },
  "Cambridge 19 Test 3 Passage 3": {
    27: {
        questionPhrase: { en: "Aspects of the conversation are challenging for both", th: "บางแง่มุมของบทสนทนาเป็นเรื่องยากสำหรับทั้งสองฝ่าย" },
        passagePhrase: { en: "I'm struggling to follow him on a scratchy line", th: "ผมฟังเขาได้ลำบากเพราะสายโทรศัพท์มีสัญญาณรบกวน" },
        pairs: [
          { q: "conversation", p: "communication", th: "การสื่อสาร / การสนทนา" },
          { q: "challenging", p: "struggling to follow", th: "ยากลำบาก / ฟังตามได้ยาก", note: "ผู้เขียนบอกว่าทั้งเสียงรบกวนและระยะทาง 10,000 กม. ทำให้สนทนายากสำหรับทั้งคู่ ตรงกับ D 'หลายแง่มุมท้าทาย'" },
          { q: "for both", p: "even if you're speaking the same language, as we are", th: "สำหรับทั้งสองฝ่าย" },
          { q: "Aspects", p: "scratchy line", th: "แง่มุม / ปัจจัยต่าง ๆ (เช่น สัญญาณรบกวน)" },
        ],
        keyVocab: { word: "challenging", th: "ที่ท้าทาย / เป็นเรื่องยาก", note: "ผู้เขียนพูดถึงเสียงรบกวนและระยะทาง 10,000 กม. ที่ทำให้การสนทนายากสำหรับทั้งคู่ ไม่ใช่เรื่องภาษาหรือหัวข้อ จึงตอบ D ที่ว่า 'หลายแง่มุมท้าทาย'" }
    },
    28: {
        questionPhrase: { en: "What assists the electronic translator during lectures", th: "อะไรช่วยให้เครื่องแปลอิเล็กทรอนิกส์ทำงานได้ดีขึ้นในการบรรยาย" },
        passagePhrase: { en: "lecturers say much the same thing each year", th: "ผู้บรรยายพูดเนื้อหาเหมือนเดิมแทบทุกปี" },
        pairs: [
          { q: "assists", p: "It helps", th: "ช่วย / เอื้อให้ดีขึ้น" },
          { q: "electronic translator", p: "electronic translator", th: "เครื่องแปลอิเล็กทรอนิกส์" },
          { q: "the repeated content of lectures", p: "say much the same thing each year", th: "เนื้อหาการบรรยายที่ซ้ำเดิม", note: "วลี 'say much the same thing each year' คือเนื้อหาที่ซ้ำเดิม ตรงกับ A 'the repeated content'" },
        ],
        keyVocab: { word: "say much the same thing each year", th: "พูดเนื้อหาซ้ำเดิมทุกปี", note: "วลี 'say much the same thing each year' คือการพูดถึงเนื้อหาที่ซ้ำเดิม ตรงกับตัวเลือก A 'the repeated content' จึงตอบ A" }
    },
    29: {
        questionPhrase: { en: "artificial speech translation was not a surprising development", th: "การแปลเสียงพูดอัตโนมัติไม่ใช่สิ่งที่น่าประหลาดใจ" },
        passagePhrase: { en: "a device technology enthusiasts dream of long before realizable", th: "อุปกรณ์ที่คนรักเทคโนโลยีฝันถึงมานานก่อนจะทำได้จริง" },
        pairs: [
          { q: "not a surprising development", p: "dream of long before they become practically realizable", th: "ไม่น่าแปลกใจ เพราะเคยฝันถึงมานานแล้ว", note: "ผู้เขียนเทียบกับทีวีจอแบนที่คนฝันถึงมานานก่อนทำได้จริง การมาถึงจริงจึงไม่น่าแปลกใจ ตอบ C" },
          { q: "artificial speech translation", p: "artificial translation and voice recognition", th: "การแปลเสียงพูดอัตโนมัติ" },
          { q: "suggests", p: "technology enthusiasts dream of", th: "สื่อเป็นนัย / ชี้ให้เห็น" },
        ],
        keyVocab: { word: "dream of long before they become practically realizable", th: "ฝันถึงมานานก่อนจะทำได้จริง", note: "ผู้เขียนบอกว่าคนจินตนาการถึงอุปกรณ์แบบนี้มานานแล้ว เหมือนทีวีจอแบน การมาถึงจริงจึงไม่น่าแปลกใจ ตรงกับ C 'not a surprising development'" }
    },
    30: {
        questionPhrase: { en: "The reluctance to share earpieces is understandable", th: "การไม่อยากแบ่งหูฟังกันเป็นเรื่องที่เข้าใจได้" },
        passagePhrase: { en: "there's a barrier with sharing one of the earphones with a stranger", th: "มีอุปสรรคในการแบ่งหูฟังให้คนแปลกหน้า" },
        pairs: [
          { q: "sharing earpieces", p: "sharing one of the earphones with a stranger", th: "การแบ่งหูฟังกัน" },
          { q: "reluctance", p: "barrier", th: "ความลังเล / ไม่อยากทำ", note: "คำว่า 'barrier' ในการแบ่งหูฟังกับคนแปลกหน้าแสดงว่าผู้เขียนเห็นว่าความลังเลนี้มีเหตุผล ตอบ B" },
          { q: "understandable", p: "with a stranger", th: "เข้าใจได้ / มีเหตุผล" },
        ],
        keyVocab: { word: "barrier", th: "อุปสรรค / กำแพงใจ", note: "คำว่า 'barrier with sharing with a stranger' แสดงว่าผู้เขียนยอมรับว่าความลังเลนี้มีเหตุผล ตรงกับ B 'reluctance is understandable'" }
    },
    31: {
        questionPhrase: { en: "Speech translation methods are developing fast in Japan", th: "วิธีแปลเสียงพูดกำลังพัฒนาอย่างรวดเร็วในญี่ปุ่น" },
        passagePhrase: { en: "voice translation has really taken off in countries such as Japan", th: "การแปลด้วยเสียงเติบโตอย่างมากในประเทศอย่างญี่ปุ่น" },
        pairs: [
          { q: "developing fast", p: "really taken off", th: "พัฒนา / เติบโตอย่างรวดเร็ว" },
          { q: "in Japan", p: "countries such as Japan", th: "ในญี่ปุ่น" },
          { q: "far from perfect", p: "needs to be simultaneous", th: "ยังไม่สมบูรณ์ / ต้องพัฒนาอีก", note: "แม้เติบโตในญี่ปุ่น แต่ระบบยังต้องแปลทันที ทำงานออฟไลน์ และรับมือเสียงรบกวน คือยังไม่สมบูรณ์ จึงเติม C" },
        ],
        keyVocab: { word: "but they are far from perfect", th: "แต่ก็ยังห่างไกลจากความสมบูรณ์แบบ", contrastA: "taken off . เติบโตรวดเร็ว", contrastB: "far from perfect . ยังไม่สมบูรณ์", note: "แม้แปลด้วยเสียงจะเติบโตในญี่ปุ่น แต่ยังต้องทำงานแบบเรียลไทม์ ออฟไลน์ และรับมือเสียงรบกวน คือยังไม่สมบูรณ์ จึงเติมด้วย C 'far from perfect'" }
    },
    32: {
        questionPhrase: { en: "TV interviews using translation voiceover are successful", th: "การสัมภาษณ์ทีวีที่ใช้เสียงแปลทับประสบความสำเร็จ" },
        passagePhrase: { en: "simultaneous, like the translator's voice speaking over the foreign politician", th: "แปลพร้อมกันทันที เหมือนเสียงล่ามพูดทับนักการเมืองต่างชาติ" },
        pairs: [
          { q: "TV interviews that use translation voiceover", p: "the translator's voice speaking over the foreign politician being interviewed on the TV", th: "การสัมภาษณ์ทีวีที่ใช้เสียงแปลทับ" },
          { q: "immediate", p: "simultaneous", th: "ทันที / พร้อมกัน", note: "ระบบที่ดีต้องแปล 'simultaneous' คือทันที ไม่ต้องหยุดรอเป็นช่วง ตรงกับ E 'because translation is immediate'" },
        ],
        keyVocab: { word: "simultaneous", th: "พร้อมกัน / ทันที", contrastA: "simultaneous . แปลทันที", contrastB: "pause after every few remarks . หยุดรอเป็นช่วง ๆ", note: "ระบบที่ดีต้องแปล 'simultaneous' คือทันที ไม่ใช่หยุดรอเป็นช่วง ตรงกับ E 'because translation is immediate'" }
    },
    33: {
        questionPhrase: { en: "Future translation systems should address people appropriately", th: "ระบบแปลในอนาคตควรพูดกับผู้คนอย่างเหมาะสม" },
        passagePhrase: { en: "socially aware by addressing people in the right way", th: "ตระหนักทางสังคมด้วยการพูดกับผู้คนอย่างถูกต้องเหมาะสม" },
        pairs: [
          { q: "address people appropriately", p: "addressing people in the right way", th: "พูดกับผู้คนอย่างเหมาะสม", note: "การ 'address people in the right way' คือการมีมารยาทที่ดี ตรงกับ F 'an awareness of good manners'" },
          { q: "Future translation systems should", p: "they will also need to be socially aware", th: "ระบบแปลในอนาคตควร" },
        ],
        keyVocab: { word: "addressing people in the right way", th: "พูดกับผู้คนอย่างถูกต้องเหมาะสม", note: "การ 'address people in the right way' หมายถึงการมีมารยาทที่ดี ตรงกับ F 'have an awareness of good manners'" }
    },
    34: {
        questionPhrase: { en: "Users may be able to maintain their local customs", th: "ผู้ใช้อาจรักษาประเพณีท้องถิ่นของตนไว้ได้" },
        passagePhrase: { en: "help to preserve local customs, slowing the spread of international English habits", th: "ช่วยรักษาประเพณีท้องถิ่น ชะลอการแพร่ของนิสัยแบบภาษาอังกฤษสากล" },
        pairs: [
          { q: "maintain their local customs", p: "preserve local customs", th: "รักษาประเพณีท้องถิ่น", note: "ระบบช่วยรักษาประเพณีท้องถิ่นแทนการตามแบบอังกฤษสากล เช่น การเรียกชื่อต้น จึงเติม B 'do not need to conform to standard practices'" },
          { q: "Users may be able to", p: "they might help to", th: "ผู้ใช้อาจสามารถ" },
          { q: "standard practices", p: "habits associated with international English", th: "แนวปฏิบัติมาตรฐานสากล" },
        ],
        keyVocab: { word: "preserve local customs", th: "รักษาประเพณีท้องถิ่น", contrastA: "local customs . ประเพณีท้องถิ่น", contrastB: "standard practices / international English . แนวปฏิบัติมาตรฐานสากล", note: "ระบบช่วยรักษาประเพณีท้องถิ่นแทนที่จะตามแบบสากล เช่น การเรียกชื่อต้น จึงเติมด้วย B 'do not need to conform to standard practices'" }
    },
    35: {
        questionPhrase: { en: "translation seen as very useful throughout academic and professional worlds", th: "ระบบแปลจะถูกมองว่ามีประโยชน์มากทั่ววงการวิชาการและวิชาชีพ" },
        passagePhrase: { en: "they seem to be regarded as eye-catching novelties rather than steps", th: "มันถูกมองว่าเป็นของแปลกใหม่สะดุดตา มากกว่าก้าวสำคัญ" },
        pairs: [
          { q: "very useful", p: "eye-catching novelties", th: "มีประโยชน์มาก (vs ของแปลกใหม่สะดุดตา)", note: "ผู้เขียนบอกว่าอุปกรณ์ถูกมองเป็น 'novelties' ของแปลกใหม่ ไม่ใช่ของมีประโยชน์จริงจัง จึงขัดกับข้อความ ตอบ NO" },
          { q: "Language translation systems", p: "artificial translation", th: "ระบบแปลภาษา" },
          { q: "professional worlds", p: "Professionals", th: "วงการวิชาชีพ" },
        ],
        keyVocab: { word: "novelties", th: "ของแปลกใหม่ / สิ่งแปลกตา", contrastA: "very useful . มีประโยชน์มาก", contrastB: "eye-catching novelties . ของแปลกใหม่สะดุดตา", note: "ผู้เขียนบอกว่าอุปกรณ์ถูกมองเป็นของแปลกใหม่ ไม่ใช่ของมีประโยชน์จริงจัง จึงขัดกับข้อความ ตอบ NO" }
    },
    36: {
        questionPhrase: { en: "value of automated translation to family life is yet to be shown", th: "คุณค่าของการแปลอัตโนมัติต่อชีวิตครอบครัวยังพิสูจน์ไม่ได้" },
        passagePhrase: { en: "Whether it will help family lives or relationships is open to question", th: "มันจะช่วยชีวิตครอบครัวหรือความสัมพันธ์ได้หรือไม่ยังเป็นคำถาม" },
        pairs: [
          { q: "family life", p: "family lives or relationships", th: "ชีวิตครอบครัว" },
          { q: "yet to be shown", p: "open to question", th: "ยังพิสูจน์ไม่ได้ / ยังไม่แน่ชัด", note: "'open to question' = ยังพิสูจน์ไม่ได้ ตรงกับ 'yet to be shown' ผู้เขียนเห็นด้วย จึงตอบ YES" },
          { q: "value", p: "help people conduct their family lives", th: "คุณค่า / ประโยชน์" },
        ],
        keyVocab: { word: "open to question", th: "ยังเป็นที่น่าสงสัย / ยังไม่แน่ชัด", note: "'open to question' = ยังพิสูจน์ไม่ได้ ตรงกับ 'yet to be shown' ผู้เขียนเห็นด้วย จึงตอบ YES" }
    },
    37: {
        questionPhrase: { en: "automated translation could make life harder for immigrant families", th: "การแปลอัตโนมัติอาจทำให้ครอบครัวผู้อพยพลำบากขึ้น" },
        passagePhrase: { en: "could overcome the language barriers between generations after migration", th: "อาจช่วยข้ามอุปสรรคทางภาษาระหว่างรุ่นหลังการอพยพ" },
        pairs: [
          { q: "immigrant families", p: "between generations after migration", th: "ครอบครัวผู้อพยพ" },
          { q: "make life more difficult", p: "overcome the language barriers", th: "ทำให้ลำบากขึ้น (vs ช่วยข้ามอุปสรรค)", note: "ผู้เขียนบอกว่ามันช่วย 'overcome' อุปสรรคทางภาษาในครอบครัวผู้อพยพ ตรงข้ามกับ 'ทำให้ลำบากขึ้น' จึงตอบ NO" },
        ],
        keyVocab: { word: "overcome the language barriers", th: "เอาชนะ / ข้ามอุปสรรคทางภาษา", contrastA: "make life more difficult . ทำให้ลำบากขึ้น", contrastB: "overcome barriers . ช่วยข้ามอุปสรรค", note: "ผู้เขียนบอกว่ามันช่วย 'overcome' อุปสรรคภาษาในครอบครัวผู้อพยพ ซึ่งตรงข้ามกับ 'ทำให้ลำบากขึ้น' จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "visual aspects of translation are being considered by scientists", th: "นักวิทยาศาสตร์กำลังพิจารณาแง่มุมด้านภาพของการแปล" },
        passagePhrase: { en: "lip movements won't match, like a dubbed movie", th: "การขยับริมฝีปากจะไม่ตรงกัน เหมือนหนังพากย์เสียง" },
        pairs: [
          { q: "Visual aspects", p: "lip movements won't match", th: "แง่มุมด้านภาพ / การมองเห็น", note: "ผู้เขียนกล่าวถึงปัญหาริมฝีปากไม่ตรง แต่ไม่ได้บอกว่านักวิทยาศาสตร์กำลังศึกษาแง่มุมด้านภาพนี้ จึงตอบ NOT GIVEN" },
          { q: "language translation", p: "voice-morphing technology simulates the speaker's voice", th: "การแปลภาษา" },
        ],
        keyVocab: { word: "lip movements won't match", th: "การขยับริมฝีปากจะไม่ตรงกัน", note: "ผู้เขียนพูดถึงปัญหาริมฝีปากไม่ตรง แต่ไม่ได้บอกว่านักวิทยาศาสตร์กำลังศึกษาแง่มุมด้านภาพนี้ จึงตอบ NOT GIVEN" }
    },
    39: {
        questionPhrase: { en: "English easier to translate into other languages than Latin", th: "ภาษาอังกฤษแปลเป็นภาษาอื่นได้ง่ายกว่าภาษาละติน" },
        passagePhrase: { en: "international scientists use English as a lingua franca, predecessors used Latin", th: "นักวิทยาศาสตร์นานาชาติใช้อังกฤษเป็นภาษากลาง รุ่นก่อนใช้ละติน" },
        pairs: [
          { q: "International scientists", p: "international scientists", th: "นักวิทยาศาสตร์นานาชาติ" },
          { q: "Latin", p: "Latin", th: "ภาษาละติน" },
          { q: "English", p: "English as a lingua franca", th: "ภาษาอังกฤษ (ภาษากลาง)", note: "ข้อความเพียงบอกว่าอังกฤษเป็นภาษากลางแทนละติน ไม่ได้เปรียบเทียบว่าแปลง่ายกว่ากัน จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "lingua franca", th: "ภาษากลางที่ใช้สื่อสารร่วมกัน", note: "ข้อความเพียงบอกว่าอังกฤษเป็นภาษากลางแทนละติน ไม่ได้เปรียบเทียบว่าแปลง่ายกว่ากัน จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "difference between people's social and practical needs", th: "ความแตกต่างระหว่างความต้องการทางสังคมและทางปฏิบัติของผู้คน" },
        passagePhrase: { en: "practical need will diminish, the social value will persist", th: "ความจำเป็นทางปฏิบัติจะลดลง แต่คุณค่าทางสังคมจะยังคงอยู่" },
        pairs: [
          { q: "practical needs", p: "practical need for a common language will diminish", th: "ความต้องการทางปฏิบัติ" },
          { q: "social", p: "social value of sharing one will persist", th: "ความต้องการ/คุณค่าทางสังคม" },
          { q: "there is a difference between", p: "Though", th: "มีความแตกต่างระหว่าง (ความขัดแย้งสองสิ่ง)", note: "ผู้เขียนแยกชัดระหว่างความจำเป็นทางปฏิบัติ (ลดลง) กับคุณค่าทางสังคม (คงอยู่) แสดงว่ามีความแตกต่างจริง จึงตอบ YES" },
        ],
        keyVocab: { word: "practical need will diminish, social value will persist", th: "ความจำเป็นทางปฏิบัติลดลง แต่คุณค่าทางสังคมยังคงอยู่", contrastA: "practical need . ความจำเป็นทางปฏิบัติ", contrastB: "social value . คุณค่าทางสังคม", note: "ผู้เขียนแยกชัดระหว่างความจำเป็นทางปฏิบัติ (ลดลง) กับคุณค่าทางสังคม (คงอยู่) แสดงว่ามีความแตกต่างจริง จึงตอบ YES" }
    },
  },
  "Cambridge 19 Test 4 Passage 3": {
    27: {
        questionPhrase: { en: "a commonly held belief about people's behaviour", th: "ความเชื่อที่คนทั่วไปมีเกี่ยวกับพฤติกรรมมนุษย์" },
        passagePhrase: { en: "There has long been a general assumption that human beings are essentially selfish", th: "มีสมมติฐานทั่วไปมานานว่ามนุษย์โดยเนื้อแท้แล้วเห็นแก่ตัว" },
        pairs: [
          { q: "a commonly held belief", p: "a general assumption", th: "ความเชื่อที่คนทั่วไปยึดถือกัน", note: "ผู้เขียนแค่บรรยาย 'a general assumption' (ความเชื่อทั่วไป) ที่คนส่วนใหญ่มี ไม่ได้สนับสนุนเอง จึงตอบ C" },
          { q: "about people's behaviour", p: "human beings are essentially selfish", th: "เกี่ยวกับพฤติกรรมของมนุษย์" },
        ],
        keyVocab: { word: "general assumption", th: "สมมติฐาน/ความเชื่อทั่วไป", note: "วลี 'a general assumption' ตรงกับ 'a commonly held belief' ผู้เขียนแค่บรรยายความเชื่อที่คนส่วนใหญ่มี จึงตอบ C" }
    },
    28: {
        questionPhrase: { en: "a view in line with the attitudes of its time", th: "มุมมองที่สอดคล้องกับทัศนคติของยุคนั้น" },
        passagePhrase: { en: "it fitted so well with the competitive and individualistic ethos that was so prevalent", th: "มันเข้ากันได้ดีกับค่านิยมแข่งขันและปัจเจกนิยมที่แพร่หลายในยุคนั้น" },
        pairs: [
          { q: "in line with the attitudes of its time", p: "fitted so well with", th: "สอดคล้องกับทัศนคติของยุคนั้น", note: "หนังสือดังเพราะ 'fitted so well with...the ethos that was so prevalent' = ตรงกับค่านิยมยุคนั้น จึงตอบ C" },
          { q: "the attitudes of its time", p: "competitive and individualistic ethos that was so prevalent", th: "ค่านิยม/ทัศนคติที่แพร่หลายในยุคนั้น" },
          { q: "Its success", p: "became popular", th: "ความสำเร็จ/การได้รับความนิยม" },
        ],
        keyVocab: { word: "fitted so well with", th: "เข้ากันได้ดีกับ/สอดคล้องกับ", note: "'fitted so well with the ethos that was so prevalent' = 'in line with the attitudes of its time' หนังสือดังเพราะตรงกับค่านิยมยุคนั้น จึงตอบ C" }
    },
    29: {
        questionPhrase: { en: "natural resources were probably relatively plentiful", th: "ทรัพยากรธรรมชาติน่าจะมีค่อนข้างเหลือเฟือ" },
        passagePhrase: { en: "the world was very sparsely populated", th: "โลกในยุคนั้นมีประชากรเบาบางมาก" },
        pairs: [
          { q: "natural resources were probably relatively plentiful", p: "very sparsely populated", th: "ประชากรเบาบาง จึงไม่ต้องแย่งทรัพยากร ทรัพยากรเหลือเฟือ", note: "เพราะโลก 'sparsely populated' กลุ่มคนจึงไม่ต้องแย่งทรัพยากร แปลว่าทรัพยากรค่อนข้างเหลือเฟือ จึงตอบ B" },
          { q: "the prehistoric era", p: "the prehistoric era", th: "ยุคก่อนประวัติศาสตร์" },
        ],
        keyVocab: { word: "sparsely populated", th: "มีประชากรเบาบาง", note: "ประชากรน้อยมาก (sparsely populated) แปลว่าไม่ต้องแย่งทรัพยากร ทรัพยากรจึงค่อนข้างเหลือเฟือ จึงตอบ B" }
    },
    30: {
        questionPhrase: { en: "people can live in an unselfish manner", th: "ผู้คนสามารถใช้ชีวิตแบบไม่เห็นแก่ตัวได้" },
        passagePhrase: { en: "hunter-gatherers are characterized by extreme political and sexual egalitarianism", th: "กลุ่มล่าสัตว์-เก็บของป่ามีลักษณะเด่นคือความเสมอภาคสูงมาก" },
        pairs: [
          { q: "people can live in an unselfish manner", p: "extreme political and sexual egalitarianism", th: "ผู้คนใช้ชีวิตแบบเสมอภาค/ไม่เห็นแก่ตัวได้", note: "Knauft ชี้ว่ากลุ่มล่าสัตว์มี egalitarianism และแบ่งปันทุกอย่าง สนับสนุนว่าคนอยู่แบบไม่เห็นแก่ตัวได้ จึงตอบ A" },
          { q: "unselfish manner", p: "have an ethical obligation to share everything", th: "มีน้ำใจแบ่งปัน ไม่เห็นแก่ตัว" },
        ],
        keyVocab: { word: "egalitarianism", th: "ความเสมอภาค/ความเท่าเทียม", contrastA: "selfish . henkaetua (เห็นแก่ตัว)", contrastB: "egalitarian/unselfish . semophak (เสมอภาค/ไม่เห็นแก่ตัว)", note: "Knauft ชี้ว่ากลุ่มล่าสัตว์มี egalitarianism และแบ่งปันทุกอย่าง สนับสนุนว่าคนใช้ชีวิตแบบไม่เห็นแก่ตัวได้ จึงตอบ A" }
    },
    31: {
        questionPhrase: { en: "a high level of ___ in all areas of life", th: "ระดับสูงของ ___ ในทุกด้านของชีวิต" },
        passagePhrase: { en: "characterized by extreme political and sexual egalitarianism", th: "มีลักษณะคือความเสมอภาคทางการเมืองและเพศอย่างสูงมาก" },
        pairs: [
          { q: "in all areas of life", p: "political and sexual", th: "ในทุกด้านของชีวิต (การเมืองและเพศ)" },
          { q: "a high level of", p: "extreme", th: "ในระดับสูงมาก", note: "'all areas of life' ถอดความจาก 'political and sexual' คำที่เติมคือ egalitarianism (ความเสมอภาค)" },
        ],
        keyVocab: { word: "egalitarianism", th: "ความเสมอภาค/ความเท่าเทียม", note: "'all areas of life' ถอดความจาก 'political and sexual' (ทุกด้าน) คำที่เติมคือ egalitarianism" }
    },
    32: {
        questionPhrase: { en: "prevent differences in ___ occurring", th: "ป้องกันไม่ให้เกิดความแตกต่างด้าน ___" },
        passagePhrase: { en: "ensuring that disparities of status don't arise", th: "ทำให้แน่ใจว่าความเหลื่อมล้ำด้านสถานะจะไม่เกิดขึ้น" },
        pairs: [
          { q: "prevent differences in", p: "ensuring that disparities of", th: "ป้องกันไม่ให้เกิดความเหลื่อมล้ำ", note: "'differences' = 'disparities' และ 'prevent...occurring' = 'don't arise' คำที่เติมคือ status (สถานะ)" },
          { q: "occurring", p: "don't arise", th: "เกิดขึ้น" },
        ],
        keyVocab: { word: "status", th: "สถานะ/ฐานะทางสังคม", note: "'differences' ถอดความจาก 'disparities' และ 'prevent...occurring' = 'don't arise' คำที่เติมคือ status" }
    },
    33: {
        questionPhrase: { en: "credit for one person's success at ___", th: "เครดิตจากความสำเร็จของคนหนึ่งในการ ___" },
        passagePhrase: { en: "people who lived by hunting wild animals", th: "ผู้คนที่ดำรงชีวิตด้วยการล่าสัตว์ป่า" },
        pairs: [
          { q: "success at", p: "hunting wild animals", th: "ความสำเร็จในการล่าสัตว์", note: "บริบท !Kung แลกลูกศรก่อน hunting และยกย่องเจ้าของลูกศร เครดิตความสำเร็จคือการ hunting" },
          { q: "the credit", p: "the acclaim", th: "เครดิต/คำยกย่อง" },
        ],
        keyVocab: { word: "hunting", th: "การล่าสัตว์", note: "บริบท !Kung แลกลูกศรก่อน 'going hunting' และยกย่องเจ้าของลูกศร เครดิตความสำเร็จคือการ hunting" }
    },
    34: {
        questionPhrase: { en: "individuals who behave in a ___ manner are excluded", th: "คนที่ประพฤติตัวแบบ ___ จะถูกขับออกจากกลุ่ม" },
        passagePhrase: { en: "if a person becomes too domineering, the other members ostracise them", th: "ถ้าใครเริ่มชอบครอบงำผู้อื่นเกินไป สมาชิกคนอื่นจะขับไล่เขา" },
        pairs: [
          { q: "punished by being excluded from the group", p: "ostracise them, exiling the offender from society", th: "ถูกลงโทษด้วยการขับออกจากกลุ่ม", note: "'excluded from the group' = 'ostracise/exiling' คนที่ถูกขับคือคนที่ domineering จึงเติมคำนี้" },
          { q: "behave in a", p: "becomes too domineering", th: "ประพฤติตัวแบบชอบครอบงำผู้อื่น" },
        ],
        keyVocab: { word: "domineering", th: "ชอบครอบงำ/ชอบใช้อำนาจเหนือผู้อื่น", note: "'punished by being excluded' = 'ostracise/exiling' คนที่ถูกขับคือคนที่ domineering จึงเติมคำนี้" }
    },
    35: {
        questionPhrase: { en: "women have considerable ___ in choices about work and marriage", th: "ผู้หญิงมี ___ มากในการเลือกเรื่องงานและการแต่งงาน" },
        passagePhrase: { en: "benefit from a high level of autonomy, being able to select their own marriage partners", th: "ได้รับประโยชน์จากความเป็นอิสระระดับสูง สามารถเลือกคู่ครองได้เอง" },
        pairs: [
          { q: "choices regarding work and marriage", p: "select their own marriage partners, decide what work they do", th: "การเลือกเรื่องงานและการแต่งงาน", note: "'considerable ___ in choices' ตรงกับ 'a high level of autonomy' ที่เลือกคู่ครองและงานได้เอง คำที่เติมคือ autonomy" },
          { q: "a considerable amount of", p: "a high level of", th: "ในระดับสูง/จำนวนมาก" },
        ],
        keyVocab: { word: "autonomy", th: "ความเป็นอิสระ/อิสระในการตัดสินใจเอง", note: "'choices regarding work and marriage' ตรงกับ 'select marriage partners, decide what work' คำที่เติมคือ autonomy" }
    },
    36: {
        questionPhrase: { en: "anthropologists are mistaken about when !Kung societies declined", th: "นักมานุษยวิทยาเข้าใจผิดเรื่องช่วงเวลาที่สังคม !Kung เริ่มลดลง" },
        passagePhrase: { en: "Many anthropologists believe that societies such as the !Kung were normal until a few thousand years ago", th: "นักมานุษยวิทยาหลายคนเชื่อว่าสังคมแบบ !Kung เป็นเรื่องปกติจนกระทั่งเมื่อไม่กี่พันปีก่อน" },
        pairs: [
          { q: "societies such as the !Kung", p: "societies such as the !Kung", th: "สังคมแบบ !Kung" },
          { q: "Some anthropologists", p: "Many anthropologists", th: "นักมานุษยวิทยาบางคน/หลายคน" },
          { q: "are mistaken about the point when", p: "believe that societies such as the !Kung were normal until a few thousand years ago", th: "เข้าใจผิดเรื่องช่วงเวลา", note: "ผู้เขียนแค่รายงานความเชื่อของนักมานุษยวิทยา ไม่เคยบอกว่าพวกเขา 'เข้าใจผิด' เรื่องช่วงเวลา จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "mistaken", th: "เข้าใจผิด", note: "ผู้เขียนรายงานความเชื่อของนักมานุษยวิทยาแต่ไม่เคยบอกว่าพวกเขา 'เข้าใจผิด' เรื่องช่วงเวลา จึงตอบ NOT GIVEN" }
    },
    37: {
        questionPhrase: { en: "warlike traits would give an advantage", th: "ลักษณะนิยมสงครามจะทำให้ได้เปรียบ" },
        passagePhrase: { en: "traits such as racism, warfare...would have been of little benefit in the prehistoric era", th: "ลักษณะอย่างการเหยียดเชื้อชาติและสงครามแทบไม่มีประโยชน์ในยุคก่อนประวัติศาสตร์" },
        pairs: [
          { q: "warlike traits", p: "warfare", th: "ลักษณะนิยมสงคราม" },
          { q: "would have had an advantage", p: "would have been of little benefit", th: "จะได้เปรียบ (แต่ข้อความบอกว่าแทบไม่มีประโยชน์)", note: "ผู้เขียนบอกนิสัยสงครามมี 'little benefit' และทำให้รอดยากกว่า ขัดกับ 'advantage' จึงตอบ NO" },
          { q: "in prehistory", p: "in the prehistoric era", th: "ในยุคก่อนประวัติศาสตร์" },
        ],
        keyVocab: { word: "little benefit", th: "แทบไม่มีประโยชน์", contrastA: "advantage . daipriap (ได้เปรียบ)", contrastB: "little benefit/less likely to survive . raipraojot (ไม่มีประโยชน์)", note: "ผู้เขียนบอกว่านิสัยสงครามมีประโยชน์น้อยและทำให้รอดยากกว่า ขัดกับคำว่า 'advantage' จึงตอบ NO" }
    },
    38: {
        questionPhrase: { en: "being peaceful and cooperative is natural for people", th: "การรักสงบและร่วมมือกันเป็นธรรมชาติของมนุษย์" },
        passagePhrase: { en: "cooperation...altruism and peacefulness as innate characteristics of human beings", th: "ความร่วมมือ ความเสียสละ และความรักสงบเป็นลักษณะที่ติดตัวมนุษย์มาแต่กำเนิด" },
        pairs: [
          { q: "peaceful and cooperative", p: "cooperation, egalitarianism, altruism and peacefulness", th: "รักสงบและร่วมมือกัน" },
          { q: "a natural way for people to behave", p: "innate characteristics of human beings", th: "เป็นพฤติกรรมตามธรรมชาติของมนุษย์", note: "'natural way to behave' = 'innate characteristics' ผู้เขียนเห็นด้วยว่าความรักสงบ-ร่วมมือเป็นธรรมชาติ จึงตอบ YES" },
        ],
        keyVocab: { word: "innate", th: "ติดตัวมาแต่กำเนิด/เป็นธรรมชาติ", note: "'natural way to behave' = 'innate characteristics' ผู้เขียนเห็นด้วยว่าความรักสงบและร่วมมือเป็นธรรมชาติ จึงตอบ YES" }
    },
    39: {
        questionPhrase: { en: "negative traits more apparent in some cultures than others", th: "ลักษณะด้านลบเด่นชัดในบางวัฒนธรรมมากกว่าวัฒนธรรมอื่น" },
        passagePhrase: { en: "these negative traits should be seen as a later development", th: "ลักษณะด้านลบเหล่านี้ควรมองว่าเป็นพัฒนาการที่เกิดขึ้นทีหลัง" },
        pairs: [
          { q: "Negative traits", p: "these negative traits", th: "ลักษณะด้านลบ" },
          { q: "more apparent in some modern cultures than in others", p: "a later development", th: "เด่นชัดในบางวัฒนธรรมมากกว่าวัฒนธรรมอื่น", note: "ผู้เขียนพูดถึงด้านลบในแง่ 'เกิดทีหลัง' แต่ไม่เคยเปรียบเทียบว่าบางวัฒนธรรมมีมากกว่ากัน จึงตอบ NOT GIVEN" },
        ],
        keyVocab: { word: "later development", th: "พัฒนาการที่เกิดขึ้นทีหลัง", note: "ผู้เขียนพูดถึงด้านลบในแง่ 'เกิดทีหลัง' แต่ไม่เคยเปรียบเทียบว่าบางวัฒนธรรมมีมากกว่าวัฒนธรรมอื่น จึงตอบ NOT GIVEN" }
    },
    40: {
        questionPhrase: { en: "animal research failed to link environment change and aggression", th: "งานวิจัยสัตว์ไม่พบความเชื่อมโยงระหว่างสภาพแวดล้อมกับความก้าวร้าว" },
        passagePhrase: { en: "when the natural habitats of primates...are disrupted, they tend to become more violent", th: "เมื่อถิ่นที่อยู่ของลิงถูกรบกวน พวกมันมักจะก้าวร้าวขึ้น" },
        pairs: [
          { q: "changes in the environment", p: "natural habitats of primates such as apes and gorillas are disrupted", th: "การเปลี่ยนแปลง/ถูกรบกวนของสภาพแวดล้อม" },
          { q: "the emergence of aggressive tendencies", p: "become more violent and hierarchical", th: "การเกิดแนวโน้มก้าวร้าว" },
          { q: "has failed to reveal a link", p: "Research has shown repeatedly", th: "ไม่พบความเชื่อมโยง (แต่ข้อความบอกว่าวิจัยแสดงซ้ำๆ ว่ามี)", note: "งานวิจัย 'shown repeatedly' ว่าสภาพแวดล้อมที่ถูกรบกวนทำให้ก้าวร้าวขึ้น ขัดกับ 'failed to reveal' จึงตอบ NO" },
        ],
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
