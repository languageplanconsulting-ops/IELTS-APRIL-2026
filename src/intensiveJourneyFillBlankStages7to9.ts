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
      { type: 'para', text: "The vast collection of microorganisms inhabiting the human body goes by the collective name {8}." },
      { type: 'bullet', text: "When gut bacteria ferment dietary fibre, one useful product is {9} — a compound that energises cells lining the large intestine and reduces inflammation." },
      { type: 'bullet', text: "The hypothesis that modern immune disorders stem from insufficient contact with ancient microorganisms is known as the Old Friends {10}." },
      { type: 'bullet', text: "The bidirectional link between the digestive system and the brain is called the gut-brain {11}." },
      { type: 'bullet', text: "Laboratory {12} raised with no gut microbes at all show marked differences in stress and anxiety compared with normal animals." },
      { type: 'bullet', text: "A procedure that transfers gut contents from a healthy person into a patient's digestive tract is called {13}." },
      { type: 'bullet', text: "Scientists caution that most microbiome findings remain {14} in nature, showing association rather than proven cause." }
    ],
    questions: [
      { number: 8, answer: "microbiome", passageKeyword: "Collectively known as the microbiome", questionKeyword: "microbiome (collective name)", thaiMeaning: "ไมโครไบโอม", exactPortion: "Collectively known as the microbiome" },
      { number: 9, answer: "butyrate", passageKeyword: "butyrate", questionKeyword: "butyrate compound", thaiMeaning: "บิวทิเรต", exactPortion: "short-chain fatty acids, including butyrate, which provides energy for the cells lining the colon and has anti-inflammatory properties" },
      { number: 10, answer: "Hypothesis", passageKeyword: "Old Friends Hypothesis", questionKeyword: "Old Friends Hypothesis", thaiMeaning: "สมมติฐาน Old Friends", exactPortion: "the Old Friends Hypothesis" },
      { number: 11, answer: "axis", passageKeyword: "gut-brain axis", questionKeyword: "gut-brain axis", thaiMeaning: "แกนลำไส้–สมอง", exactPortion: "The gut-brain axis — the bidirectional communication network linking the intestine and the central nervous system" },
      { number: 12, answer: "mice", passageKeyword: "germ-free mice", questionKeyword: "laboratory mice without gut microbes", thaiMeaning: "หนูไร้เชื้อ", exactPortion: "Studies in germ-free mice — animals raised without any microorganisms — show profound differences in stress responses and anxiety-related behaviour" },
      { number: 13, answer: "transplantation", passageKeyword: "Faecal microbiota transplantation", questionKeyword: "gut-bacteria transfer (transplantation)", thaiMeaning: "การปลูกถ่ายจุลินทรีย์ในอุจจาระ", exactPortion: "Faecal microbiota transplantation, in which stool from a healthy donor is introduced into the gut of a patient" },
      { number: 14, answer: "correlational", passageKeyword: "Much microbiome science is correlational", questionKeyword: "correlational", thaiMeaning: "เชิงความสัมพันธ์", exactPortion: "Much microbiome science is correlational: it shows that certain microbial profiles are associated with certain health states without establishing that the microbiome is causing those states" }
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
      { type: 'bullet', text: "She was the first to name and characterise the phenomenon of {25} — the ability of certain atoms to emit energy spontaneously." },
      { type: 'bullet', text: "Discovering polonium and radium required processing tonnes of {26}, a uranium-rich mineral." },
      { type: 'bullet', text: "Decades of unshielded radiation exposure eventually caused her death from {27}, a severe condition in which bone marrow fails to produce blood cells." }
    ],
    questions: [
      { number: 25, answer: "radioactivity", passageKeyword: "coined the term \"radioactivity\"", questionKeyword: "radioactivity (named by Curie)", thaiMeaning: "รังสีกัมมันตภาพ", exactPortion: "Curie coined the term \"radioactivity\" to describe this atomic property" },
      { number: 26, answer: "pitchblende", passageKeyword: "samples of pitchblende", questionKeyword: "pitchblende uranium mineral", thaiMeaning: "พิตช์เบลนด์", exactPortion: "When she began testing samples of pitchblende — a uranium-bearing mineral ore" },
      { number: 27, answer: "anaemia", passageKeyword: "aplastic anaemia", questionKeyword: "blood disorder (aplastic anaemia)", thaiMeaning: "โลหิตจาง", exactPortion: "Marie Curie died in 1934 from aplastic anaemia, a condition caused by prolonged exposure to ionising radiation" }
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
      { type: 'bullet', text: "When CO₂ dissolves in seawater it creates an {8} that lowers the concentration of carbonate ions — reducing the material marine organisms need for shells and skeletons." },
      { type: 'bullet', text: "The resulting shift in seawater chemistry is known as {9}." },
      { type: 'bullet', text: "Among the most vulnerable organisms are {10}, whose shells dissolve in acidic upwelling zones." },
      { type: 'bullet', text: "They form a key part of the diet of {11}, one of the most commercially significant fish in the Pacific." },
      { type: 'bullet', text: "Breeding facilities that cultivate young shellfish on the US west coast — known as {12} — have suffered production losses from acidified water." },
      { type: 'bullet', text: "One localised approach involves modifying nearshore {13} chemistry by adding alkaline materials." },
      { type: 'bullet', text: "Scientists agree that the only lasting remedy is a significant cut in worldwide {14}." }
    ],
    questions: [
      { number: 8, answer: "acid", passageKeyword: "carbonic acid", questionKeyword: "seawater acid (carbonic acid)", thaiMeaning: "กรดคาร์บอนิก", exactPortion: "When carbon dioxide dissolves in seawater, it reacts to form carbonic acid" },
      { number: 9, answer: "acidification", passageKeyword: "ocean acidification", questionKeyword: "seawater acidification", thaiMeaning: "การเป็นกรดของมหาสมุทร", exactPortion: "a process called ocean acidification" },
      { number: 10, answer: "Pteropods", passageKeyword: "Pteropods", questionKeyword: "pteropods (sea butterflies)", thaiMeaning: "เทอโรพอด", exactPortion: "Pteropods — small free-swimming molluscs known informally as sea butterflies" },
      { number: 11, answer: "salmon", passageKeyword: "Pacific salmon", questionKeyword: "commercially significant Pacific fish (salmon)", thaiMeaning: "แซลมอน", exactPortion: "pteropods make up a substantial portion of the diet of Pacific salmon" },
      { number: 12, answer: "hatcheries", passageKeyword: "Hatcheries producing oyster seed", questionKeyword: "shellfish breeding hatcheries", thaiMeaning: "ฟาร์มพันธุ์หอย", exactPortion: "Hatcheries producing oyster seed on the west coast of the United States" },
      { number: 13, answer: "waters", passageKeyword: "coastal waters", questionKeyword: "nearshore marine waters", thaiMeaning: "น้ำชายฝั่ง", exactPortion: "adding alkaline materials to coastal waters" },
      { number: 14, answer: "emissions", passageKeyword: "global emissions reduction", questionKeyword: "worldwide emissions", thaiMeaning: "การปล่อยก๊าซ", exactPortion: "urgent global emissions reduction" }
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
      { type: 'bullet', text: "Part of the funding came from public financial instruments — {25} — whose face value increased for more challenging terrain." },
      { type: 'bullet', text: "The most demanding section was the Summit {26}, completed using nitroglycerin blasting." },
      { type: 'bullet', text: "The Crédit Mobilier {27} revealed enormous private profits at public expense." }
    ],
    questions: [
      { number: 25, answer: "bonds", passageKeyword: "government bonds", questionKeyword: "public financial bonds", thaiMeaning: "พันธบัตรรัฐบาล", exactPortion: "providing land grants and government bonds to two companies" },
      { number: 26, answer: "Tunnel", passageKeyword: "Summit Tunnel", questionKeyword: "Summit Tunnel", thaiMeaning: "อุโมงค์ Summit", exactPortion: "Chinese workers pioneered the use of controlled nitroglycerin blasting in the Summit Tunnel" },
      { number: 27, answer: "scandal", passageKeyword: "The scandal eventually became public", questionKeyword: "Crédit Mobilier scandal", thaiMeaning: "เรื่องอื้อฉาว", exactPortion: "The scandal eventually became public in 1872" }
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
      { type: 'bullet', text: "An American political scientist named {13} found that expert forecasters were often barely better than chance." },
      { type: 'bullet', text: "Adjusting the pre-selected {14} in any given system can steer people toward better decisions while preserving their freedom to choose." }
    ],
    questions: [
      { number: 8, answer: "model", passageKeyword: "dismantled this model", questionKeyword: "classical economic model", thaiMeaning: "แบบจำลองเศรษฐศาสตร์คลาสสิก", exactPortion: "Decades of psychological research have comprehensively dismantled this model" },
      { number: 9, answer: "theory", passageKeyword: "prospect theory", questionKeyword: "prospect theory", thaiMeaning: "ทฤษฎี prospect", exactPortion: "Their prospect theory, published in 1979" },
      { number: 10, answer: "heuristic", passageKeyword: "availability heuristic", questionKeyword: "availability heuristic", thaiMeaning: "heuristic ความพร้อมใช้", exactPortion: "the availability heuristic — the tendency to judge the frequency or probability of an event based on how easily examples of it come to mind" },
      { number: 11, answer: "framing", passageKeyword: "The framing effect", questionKeyword: "framing effect", thaiMeaning: "เอฟเฟกต์การจัดกรอบ", exactPortion: "The framing effect describes the phenomenon whereby the same information presented in different ways produces different decisions" },
      { number: 12, answer: "anchoring", passageKeyword: "Anchoring describes", questionKeyword: "anchoring", thaiMeaning: "การยึดจุดอ้างอิง", exactPortion: "Anchoring describes the disproportionate influence of the first piece of numerical information encountered on subsequent estimates and judgements" },
      { number: 13, answer: "Tetlock", passageKeyword: "Philip Tetlock", questionKeyword: "political scientist Tetlock", thaiMeaning: "ฟิลิป เท็ตล็อก", exactPortion: "Research by Philip Tetlock across thousands of expert forecasters" },
      { number: 14, answer: "options", passageKeyword: "default options", questionKeyword: "pre-selected options", thaiMeaning: "ตัวเลือกเริ่มต้น", exactPortion: "default options are designed to guide people toward choices that align with their long-term interests" }
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
      { type: 'bullet', text: "Prolonged spaceflight leads to a significant reduction in bone {25}." },
      { type: 'bullet', text: "The station validates the technology required to sustain human {26} during extended periods in space." },
      { type: 'bullet', text: "Despite political tensions, NASA and Roscosmos chose to maintain their working {27}." }
    ],
    questions: [
      { number: 25, answer: "density", passageKeyword: "bone density loss", questionKeyword: "bone density reduction", thaiMeaning: "ความหนาแน่นของกระดูก", exactPortion: "bone density loss of up to 1% per month" },
      { number: 26, answer: "life", passageKeyword: "life support systems", questionKeyword: "life-sustaining systems", thaiMeaning: "ระบบสนับสนุนชีวิต", exactPortion: "The station has also served as a test bed for life support systems" },
      { number: 27, answer: "cooperation", passageKeyword: "maintain operational cooperation", questionKeyword: "working cooperation", thaiMeaning: "ความร่วมมือในการปฏิบัติการ", exactPortion: "NASA and Roscosmos ultimately chose to maintain operational cooperation" }
    ]
  }
]
