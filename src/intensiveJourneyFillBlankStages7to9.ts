import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 7–9 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_7_9: NewFillBlankSet[] = [
  {
    examId: "journey-normal-stage-7",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "The microbiome and its effects on health",
    summaryLines: [
      { type: 'para', text: "The community of microorganisms living in the human body is collectively referred to as the {8}." },
      { type: 'bullet', text: "One important short-chain fatty acid produced when gut bacteria break down fibre is {9}, which energises colon cells and reduces inflammation." },
      { type: 'bullet', text: "The hypothesis that modern immune disorders stem from insufficient contact with ancient microorganisms is known as the Old Friends {10}." },
      { type: 'bullet', text: "Communication between the intestine and the brain occurs through the gut-brain {11}." },
      { type: 'bullet', text: "Studies on germ-free {12} show that absence of gut bacteria changes anxiety and stress responses." },
      { type: 'bullet', text: "Transfer of stool from a healthy donor is called faecal microbiota {13}." },
      { type: 'bullet', text: "Scientists caution that most microbiome findings remain {14} in nature, showing association rather than proven cause." }
    ],
    questions: [
      { number: 8, answer: "model", passageKeyword: "Collectively known as the microbiome", questionKeyword: "microbiome", thaiMeaning: "ไมโครไบโอม", exactPortion: "Collectively known as the microbiome" },
      { number: 9, answer: "theory", passageKeyword: "butyrate", questionKeyword: "butyrate", thaiMeaning: "บิวทิเรต", exactPortion: "short-chain fatty acids, including butyrate, which provides energy for the cells lining the colon and has anti-inflammatory properties" },
      { number: 10, answer: "heuristic", passageKeyword: "Old Friends Hypothesis", questionKeyword: "Old Friends Hypothesis", thaiMeaning: "สมมติฐาน Old Friends", exactPortion: "the Old Friends Hypothesis" },
      { number: 11, answer: "framing", passageKeyword: "gut-brain axis", questionKeyword: "gut-brain axis", thaiMeaning: "แกนลำไส้–สมอง", exactPortion: "The gut-brain axis — the bidirectional communication network linking the intestine and the central nervous system" },
      { number: 12, answer: "anchoring", passageKeyword: "germ-free mice", questionKeyword: "germ-free mice", thaiMeaning: "หนูไร้เชื้อ", exactPortion: "Studies in germ-free mice — animals raised without any microorganisms — show profound differences in stress responses and anxiety-related behaviour" },
      { number: 13, answer: "Tetlock", passageKeyword: "Faecal microbiota transplantation", questionKeyword: "faecal microbiota transplantation", thaiMeaning: "การปลูกถ่ายจุลินทรีย์ในอุจจาระ", exactPortion: "Faecal microbiota transplantation, in which stool from a healthy donor is introduced into the gut of a patient" },
      { number: 14, answer: "options", passageKeyword: "Much microbiome science is correlational", questionKeyword: "correlational", thaiMeaning: "เชิงความสัมพันธ์", exactPortion: "Much microbiome science is correlational: it shows that certain microbial profiles are associated with certain health states without establishing that the microbiome is causing those states" }
    ]
  },
  {
    examId: "journey-normal-stage-7",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["C", "G"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Marie Curie's scientific legacy",
    summaryLines: [
      { type: 'bullet', text: "Marie Curie coined the word {25} to describe atomic energy emission from within elements." },
      { type: 'bullet', text: "Discovering polonium and radium required processing large quantities of {26} ore." },
      { type: 'bullet', text: "She died from aplastic {27} caused by years of unprotected radiation exposure." }
    ],
    questions: [
      { number: 25, answer: "density", passageKeyword: "coined the term \"radioactivity\"", questionKeyword: "radioactivity", thaiMeaning: "รังสีกัมมันตภาพ", exactPortion: "Curie coined the term \"radioactivity\" to describe this atomic property" },
      { number: 26, answer: "life", passageKeyword: "samples of pitchblende", questionKeyword: "pitchblende", thaiMeaning: "พิตช์เบลนด์", exactPortion: "When she began testing samples of pitchblende — a uranium-bearing mineral ore" },
      { number: 27, answer: "cooperation", passageKeyword: "aplastic anaemia", questionKeyword: "aplastic anaemia", thaiMeaning: "โลหิตจาง", exactPortion: "Marie Curie died in 1934 from aplastic anaemia, a condition caused by prolonged exposure to ionising radiation" }
    ]
  },
  {
    examId: "journey-normal-stage-8",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Ocean chemistry and its consequences",
    summaryLines: [
      { type: 'bullet', text: "CO₂ entering the ocean produces carbonic {8}, reducing carbonate ions needed for shells and skeletons." },
      { type: 'bullet', text: "This process is known as ocean {9}." },
      { type: 'bullet', text: "Among the most vulnerable organisms are {10}, whose shells dissolve in acidic upwelling zones." },
      { type: 'bullet', text: "They are a vital food source for Pacific {11}, affecting commercial fish catches." },
      { type: 'bullet', text: "Oyster {12} on the US west coast have suffered production losses from acidified water." },
      { type: 'bullet', text: "One localised response involves altering coastal {13} chemistry." },
      { type: 'bullet', text: "The only true solution is reducing global {14}." }
    ],
    questions: [
      { number: 8, answer: "model", passageKeyword: "carbonic acid", questionKeyword: "carbonic acid", thaiMeaning: "กรดคาร์บอนิก", exactPortion: "When carbon dioxide dissolves in seawater, it reacts to form carbonic acid" },
      { number: 9, answer: "theory", passageKeyword: "ocean acidification", questionKeyword: "ocean acidification", thaiMeaning: "การเป็นกรดของมหาสมุทร", exactPortion: "a process called ocean acidification" },
      { number: 10, answer: "heuristic", passageKeyword: "Pteropods", questionKeyword: "pteropods", thaiMeaning: "เทอโรพอด", exactPortion: "Pteropods — small free-swimming molluscs known informally as sea butterflies" },
      { number: 11, answer: "framing", passageKeyword: "Pacific salmon", questionKeyword: "Pacific salmon", thaiMeaning: "แซลมอน", exactPortion: "pteropods make up a substantial portion of the diet of Pacific salmon" },
      { number: 12, answer: "anchoring", passageKeyword: "Hatcheries producing oyster seed", questionKeyword: "oyster hatcheries", thaiMeaning: "ฟาร์มพันธุ์หอย", exactPortion: "Hatcheries producing oyster seed on the west coast of the United States" },
      { number: 13, answer: "Tetlock", passageKeyword: "coastal waters", questionKeyword: "coastal water", thaiMeaning: "น้ำชายฝั่ง", exactPortion: "adding alkaline materials to coastal waters" },
      { number: 14, answer: "options", passageKeyword: "global emissions reduction", questionKeyword: "global emissions", thaiMeaning: "การปล่อยก๊าซ", exactPortion: "urgent global emissions reduction" }
    ]
  },
  {
    examId: "journey-normal-stage-8",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["B", "E"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Financing and construction of the railroad",
    summaryLines: [
      { type: 'bullet', text: "The railroad was financed partly through government {25} awarded based on terrain difficulty." },
      { type: 'bullet', text: "The most demanding section was the Summit {26}, completed using nitroglycerin blasting." },
      { type: 'bullet', text: "The Crédit Mobilier {27} revealed enormous private profits at public expense." }
    ],
    questions: [
      { number: 25, answer: "density", passageKeyword: "government bonds", questionKeyword: "government bonds", thaiMeaning: "พันธบัตรรัฐบาล", exactPortion: "providing land grants and government bonds to two companies" },
      { number: 26, answer: "life", passageKeyword: "Summit Tunnel", questionKeyword: "Summit Tunnel", thaiMeaning: "อุโมงค์ Summit", exactPortion: "Chinese workers pioneered the use of controlled nitroglycerin blasting in the Summit Tunnel" },
      { number: 27, answer: "cooperation", passageKeyword: "The scandal eventually became public", questionKeyword: "Crédit Mobilier scandal", thaiMeaning: "เรื่องอื้อฉาว", exactPortion: "The scandal eventually became public in 1872" }
    ]
  },
  {
    examId: "journey-normal-stage-9",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Biases in human judgement",
    summaryLines: [
      { type: 'bullet', text: "Decision-making falls short of the rational ideal described in classical economic {8}." },
      { type: 'bullet', text: "Kahneman and Tversky's prospect {9} shows people evaluate outcomes relative to a reference point." },
      { type: 'bullet', text: "Overestimating dramatic events because they are easily remembered is the availability {10}." },
      { type: 'bullet', text: "The {11} effect shows identical information can produce opposite decisions when framed differently." },
      { type: 'bullet', text: "When an early number unduly influences later estimates, this is called {12}." },
      { type: 'bullet', text: "Philip {13} found expert forecasters were often barely better than chance." },
      { type: 'bullet', text: "Changing default {14} can guide people toward better choices without removing freedom." }
    ],
    questions: [
      { number: 8, answer: "model", passageKeyword: "dismantled this model", questionKeyword: "classical economic model", thaiMeaning: "แบบจำลองเศรษฐศาสตร์คลาสสิก", exactPortion: "Decades of psychological research have comprehensively dismantled this model" },
      { number: 9, answer: "theory", passageKeyword: "prospect theory", questionKeyword: "prospect theory", thaiMeaning: "ทฤษฎี prospect", exactPortion: "Their prospect theory, published in 1979" },
      { number: 10, answer: "heuristic", passageKeyword: "availability heuristic", questionKeyword: "availability heuristic", thaiMeaning: "heuristic ความพร้อมใช้", exactPortion: "the availability heuristic — the tendency to judge the frequency or probability of an event based on how easily examples of it come to mind" },
      { number: 11, answer: "framing", passageKeyword: "The framing effect", questionKeyword: "framing effect", thaiMeaning: "เอฟเฟกต์การจัดกรอบ", exactPortion: "The framing effect describes the phenomenon whereby the same information presented in different ways produces different decisions" },
      { number: 12, answer: "anchoring", passageKeyword: "Anchoring describes", questionKeyword: "anchoring", thaiMeaning: "การยึดจุดอ้างอิง", exactPortion: "Anchoring describes the disproportionate influence of the first piece of numerical information encountered on subsequent estimates and judgements" },
      { number: 13, answer: "Tetlock", passageKeyword: "Philip Tetlock", questionKeyword: "Philip Tetlock", thaiMeaning: "ฟิลิป เท็ตล็อก", exactPortion: "Research by Philip Tetlock across thousands of expert forecasters" },
      { number: 14, answer: "options", passageKeyword: "default options", questionKeyword: "default options", thaiMeaning: "ตัวเลือกเริ่มต้น", exactPortion: "default options are designed to guide people toward choices that align with their long-term interests" }
    ]
  },
  {
    examId: "journey-normal-stage-9",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["E", "F"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Research and cooperation aboard the station",
    summaryLines: [
      { type: 'bullet', text: "Extended time in space causes significant {25} loss in bones." },
      { type: 'bullet', text: "The station tests {26} support systems needed for future long missions." },
      { type: 'bullet', text: "Operational {27} between NASA and Roscosmos was maintained despite political tensions." }
    ],
    questions: [
      { number: 25, answer: "density", passageKeyword: "bone density loss", questionKeyword: "bone density loss", thaiMeaning: "ความหนาแน่นของกระดูก", exactPortion: "bone density loss of up to 1% per month" },
      { number: 26, answer: "life", passageKeyword: "life support systems", questionKeyword: "life support systems", thaiMeaning: "ระบบสนับสนุนชีวิต", exactPortion: "The station has also served as a test bed for life support systems" },
      { number: 27, answer: "cooperation", passageKeyword: "maintain operational cooperation", questionKeyword: "operational cooperation", thaiMeaning: "ความร่วมมือในการปฏิบัติการ", exactPortion: "NASA and Roscosmos ultimately chose to maintain operational cooperation" }
    ]
  }
]
