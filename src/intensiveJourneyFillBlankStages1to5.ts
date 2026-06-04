import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 1–5 (Stage 5: P1 Q1–7, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5: NewFillBlankSet[] = [
  {
    examId: "journey-normal-stage-1",
    passageNumber: 1,
    startNumber: 6,
    endNumber: 13,
    sourceParagraphs: ["F", "G"],
    instructions: [
      "Questions 6–13",
      "Complete the notes below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 6–13 on your answer sheet."
    ],
    summaryTitle: "Comparison of aluminium screw caps and cork bottle stoppers",
    summaryLines: [
      { type: 'heading', text: "Advantages of aluminium screw caps" },
      { type: 'bullet', text: "do not affect the {6} of the bottle contents" },
      { type: 'bullet', text: "are {7} to produce" },
      { type: 'bullet', text: "are {8} to use" },
      { type: 'heading', text: "Advantages of cork bottle stoppers" },
      { type: 'bullet', text: "suit the {9} of quality products" },
      { type: 'bullet', text: "made from a {10} material" },
      { type: 'bullet', text: "easily {11}" },
      { type: 'bullet', text: "cork forests aid {12}" },
      { type: 'bullet', text: "cork forests stop {13} happening" }
    ],
    questions: [
      { number: 6, answer: "taste", passageKeyword: "spoil the taste of the product", questionKeyword: "do not affect the taste", thaiMeaning: "รสชาติ", exactPortion: "as little as three or four parts to a trillion – can spoil the taste of the product contained in the bottle" },
      { number: 7, answer: "cheaper", passageKeyword: "cheaper to manufacture", questionKeyword: "cheaper to produce", thaiMeaning: "ถูกกว่า", exactPortion: "These substitutes are cheaper to manufacture and, in the case of screw caps, more convenient for the user" },
      { number: 8, answer: "convenient", passageKeyword: "more convenient for the user", questionKeyword: "convenient to use", thaiMeaning: "สะดวก", exactPortion: "in the case of screw caps, more convenient for the user" },
      { number: 9, answer: "image", passageKeyword: "traditional image is more in keeping with … high quality goods", questionKeyword: "suit the image of quality products", thaiMeaning: "ภาพลักษณ์", exactPortion: "Firstly, its traditional image is more in keeping with that of the type of high quality goods with which it has long been associated" },
      { number: 10, answer: "sustainable", passageKeyword: "cork is a sustainable product", questionKeyword: "a sustainable material", thaiMeaning: "ยั่งยืน", exactPortion: "cork is a sustainable product that can be recycled without difficulty" },
      { number: 11, answer: "recycled", passageKeyword: "can be recycled without difficulty", questionKeyword: "easily recycled", thaiMeaning: "รีไซเคิล", exactPortion: "cork is a sustainable product that can be recycled without difficulty" },
      { number: 12, answer: "biodiversity", passageKeyword: "support local biodiversity", questionKeyword: "aid biodiversity", thaiMeaning: "ความหลากหลายทางชีวภาพ", exactPortion: "Moreover, cork forests are a resource which support local biodiversity, and prevent desertification in the regions where they are planted" },
      { number: 13, answer: "desertification", passageKeyword: "prevent desertification", questionKeyword: "stop desertification", thaiMeaning: "การกลายเป็นทะเลทราย", exactPortion: "prevent desertification in the regions where they are planted" }
    ]
  },
  {
    examId: "journey-normal-stage-1",
    passageNumber: 2,
    startNumber: 15,
    endNumber: 22,
    sourceParagraphs: ["B", "F"],
    instructions: [
      "Questions 15–22",
      "Complete the sentences below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 15–22 on your answer sheet."
    ],
    summaryTitle: "Collecting as a Hobby",
    summaryLines: [
      { type: 'bullet', text: "The writer mentions {15} as an example of collecting in order to make money." },
      { type: 'bullet', text: "Collectors may get a feeling of {16} from buying and selling items." },
      { type: 'bullet', text: "Collectors' clubs provide opportunities to share {17}." },
      { type: 'bullet', text: "Collectors' clubs offer {18} with people who have similar interests." },
      { type: 'bullet', text: "Collecting sometimes involves a life-long {19} for a special item." },
      { type: 'bullet', text: "Searching for something particular may prevent people from feeling their life is completely {20}." },
      { type: 'bullet', text: "Stamp collecting may be {21} because it provides facts about different countries." },
      { type: 'bullet', text: "{22} tends to be mostly a male hobby." }
    ],
    questions: [
      { number: 15, answer: "antiques", passageKeyword: "antiques", questionKeyword: "collecting to make money", thaiMeaning: "ของโบราณ", exactPortion: "They'll look for, say, antiques that they can buy cheaply and expect to be able to sell at a profit." },
      { number: 16, answer: "triumph", passageKeyword: "sense of triumph", questionKeyword: "feeling of triumph", thaiMeaning: "ชัยชนะ", exactPortion: "But there may well be a psychological element, too – buying cheap and selling dear can give the collector a sense of triumph." },
      { number: 17, answer: "information", passageKeyword: "exchanging information", questionKeyword: "share information", thaiMeaning: "ข้อมูล", exactPortion: "Many collectors collect to develop their social life, attending meetings of a group of collectors and exchanging information on items." },
      { number: 18, answer: "contact", acceptedAnswers: ["meetings"], passageKeyword: "contact with like-minded people", questionKeyword: "offer contact", thaiMeaning: "ติดต่อ/พบปะ", exactPortion: "This is a variant on joining a bridge club or a gym, and similarly brings them into contact with like-minded people." },
      { number: 19, answer: "hunt", acceptedAnswers: ["desire"], passageKeyword: "whole lives in a hunt", questionKeyword: "life-long hunt", thaiMeaning: "การล่าหา", exactPortion: "Some may spend their whole lives in a hunt for this." },
      { number: 20, answer: "aimless", acceptedAnswers: ["empty"], passageKeyword: "otherwise feels aimless", questionKeyword: "life is completely aimless", thaiMeaning: "ไร้จุดหมาย", exactPortion: "Psychologically, this can give a purpose to a life that otherwise feels aimless." },
      { number: 21, answer: "educational", passageKeyword: "educational value", questionKeyword: "may be educational", thaiMeaning: "การศึกษา", exactPortion: "If you think about collecting postage stamps, another potential reason for it – or, perhaps, a result of collecting – is its educational value." },
      { number: 22, answer: "trainspotting", passageKeyword: "trainspotting", questionKeyword: "mostly a male hobby", thaiMeaning: "trainspotting", exactPortion: "In the past – and nowadays, too, though to a lesser extent – a popular form of collecting, particularly among boys and men, was trainspotting." }
    ]
  },
  {
    examId: "journey-normal-stage-2",
    passageNumber: 2,
    startNumber: 26,
    endNumber: 27,
    sourceParagraphs: ["B", "C"],
    instructions: [
      "Questions 26–27",
      "Complete the sentences below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 26–27 on your answer sheet."
    ],
    summaryTitle: "Bingham's journey to Machu Picchu",
    summaryLines: [
      { type: 'bullet', text: "The track that took Bingham down the Urubamba valley had been created for the transportation of {26}." },
      { type: 'bullet', text: "Bingham found out about the ruins of Machu Picchu from a {27} in the Urubamba valley." }
    ],
    questions: [
      { number: 26, answer: "rubber", passageKeyword: "rubber to be brought up by mules", questionKeyword: "transportation of rubber", thaiMeaning: "ยาง", exactPortion: "a track had recently been blasted down the valley canyon to enable rubber to be brought up by mules from the jungle" },
      { number: 27, answer: "farmer", passageKeyword: "local farmer, Melchor Arteaga", questionKeyword: "found out from a farmer", thaiMeaning: "ชาวนา", exactPortion: "some ruins that a local farmer, Melchor Arteaga, had told them about the night before" }
    ]
  },
  {
    examId: "journey-normal-stage-3",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ["B", "B"],
    instructions: [
      "Questions 8–13",
      "Complete the notes below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–13 on your answer sheet."
    ],
    summaryTitle: "The decline of the Galápagos tortoise",
    summaryLines: [
      { type: 'bullet', text: "Originally from mainland South America" },
      { type: 'bullet', text: "Numbers on Galápagos islands increased, due to lack of predators" },
      { type: 'bullet', text: "17th century: small numbers taken onto ships used by {8}" },
      { type: 'bullet', text: "1790s: very large numbers taken onto whaling ships, kept for {9}, and also used to produce {10}" },
      { type: 'bullet', text: "Hunted by {11} on the islands" },
      { type: 'bullet', text: "Habitat destruction: for the establishment of agriculture and by various {12} not native to the islands, which also fed on baby tortoises and tortoises' {13}" }
    ],
    questions: [
      { number: 8, answer: "pirates", passageKeyword: "pirates took a few on board for food", questionKeyword: "ships used by pirates", thaiMeaning: "โจรสลัด", exactPortion: "From the 17th century onwards, pirates took a few on board for food" },
      { number: 9, answer: "food", passageKeyword: "food supplies during long ocean passages", questionKeyword: "kept for food", thaiMeaning: "อาหาร", exactPortion: "the tortoises were taken on board these ships to act as food supplies during long ocean passages" },
      { number: 10, answer: "oil", passageKeyword: "processed into high-grade oil", questionKeyword: "used to produce oil", thaiMeaning: "น้ำมัน", exactPortion: "Sometimes, their bodies were processed into high-grade oil" },
      { number: 11, answer: "settlers", passageKeyword: "settlers came to the islands", questionKeyword: "hunted by settlers", thaiMeaning: "ผู้บุกเบิก", exactPortion: "This historical exploitation was then exacerbated when settlers came to the islands" },
      { number: 12, answer: "species", passageKeyword: "introduced alien species", questionKeyword: "not native species", thaiMeaning: "สปีชีส์ต่างถิ่น", exactPortion: "They also introduced alien species – ranging from cattle, pigs, goats, rats and dogs to plants and ants" },
      { number: 13, answer: "eggs", passageKeyword: "prey on the eggs and young tortoises", questionKeyword: "fed on eggs", thaiMeaning: "ไข่", exactPortion: "that either prey on the eggs and young tortoises or damage or destroy their habitat" }
    ]
  },
  {
    examId: "journey-normal-stage-3",
    passageNumber: 2,
    startNumber: 21,
    endNumber: 27,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 21–27",
      "Complete the sentences below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 21–27 on your answer sheet."
    ],
    summaryTitle: "The Intersection of Health Sciences and Geography",
    summaryLines: [
      { type: 'bullet', text: "Certain diseases have disappeared, thanks to better {21} and healthcare." },
      { type: 'bullet', text: "Because there is more contact between people, {22} are losing their usefulness." },
      { type: 'bullet', text: "Disease-causing {23} are most likely to be found in hot, damp regions." },
      { type: 'bullet', text: "One cause of pollution is {24} that burn a particular fuel." },
      { type: 'bullet', text: "The growth of cities often has an impact on nearby {25}." },
      { type: 'bullet', text: "{26} is one disease that is growing after having been eradicated." },
      { type: 'bullet', text: "A physical barrier such as a {27} can prevent people from reaching a hospital." }
    ],
    questions: [
      { number: 21, answer: "vaccinations", passageKeyword: "improvements in vaccinations", questionKeyword: "better vaccinations and healthcare", thaiMeaning: "วัคซีน", exactPortion: "improvements in vaccinations and the availability of healthcare" },
      { number: 22, answer: "antibiotics", passageKeyword: "resistant to antibiotics", questionKeyword: "antibiotics losing usefulness", thaiMeaning: "ยาปฏิชีวนะ", exactPortion: "super-viruses and other infections resistant to antibiotics are becoming more and more common" },
      { number: 23, answer: "mosquitoes", acceptedAnswers: ["mosquitos"], passageKeyword: "mosquitos that can give people this disease", questionKeyword: "disease-causing mosquitoes", thaiMeaning: "ยุง", exactPortion: "tropical regions that foster a warm and damp environment in which the mosquitos that can give people this disease can grow" },
      { number: 24, answer: "factories", passageKeyword: "factories that run on coal power", questionKeyword: "factories burning coal", thaiMeaning: "โรงงาน", exactPortion: "factories that run on coal power" },
      { number: 25, answer: "forests", passageKeyword: "cutting down of forests", questionKeyword: "impact on nearby forests", thaiMeaning: "ป่า", exactPortion: "the cutting down of forests to allow for the expansion of big cities" },
      { number: 26, answer: "polio", passageKeyword: "polio are re-emerging", questionKeyword: "disease growing after eradicated", thaiMeaning: "โรคโปลิโอ", exactPortion: "diseases like polio are re-emerging" },
      { number: 27, answer: "mountain", passageKeyword: "mountain between their village and the nearest hospital", questionKeyword: "physical barrier mountain", thaiMeaning: "ภูเขา", exactPortion: "it may be very difficult for people to get medical attention because there is a mountain between their village and the nearest hospital" }
    ]
  },
  {
    examId: "journey-normal-stage-4",
    passageNumber: 1,
    startNumber: 1,
    endNumber: 8,
    sourceParagraphs: ["A", "D"],
    instructions: [
      "Questions 1–8",
      "Complete the notes below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 1–8 on your answer sheet."
    ],
    summaryTitle: "The History of Glass",
    summaryLines: [
      { type: 'bullet', text: "Early humans used a material called {1} to make the sharp points of their {2}" },
      { type: 'bullet', text: "4000 BC: {3} made of stone were covered in a coating of man-made glass." },
      { type: 'bullet', text: "First century BC: glass was coloured because of the {4} in the material." },
      { type: 'bullet', text: "Until 476 AD: Only the {5} knew how to make glass." },
      { type: 'bullet', text: "From 10th century: Venetians became famous for making bottles out of glass." },
      { type: 'bullet', text: "17th century: George Ravenscroft developed a process using {6} to avoid the occurrence of {7} in blown glass." },
      { type: 'bullet', text: "Mid-19th century: British glass production developed after changes to laws concerning {8}." }
    ],
    questions: [
      { number: 1, answer: "obsidian", passageKeyword: "obsidian", questionKeyword: "material called obsidian", thaiMeaning: "ออบซิเดียน", exactPortion: "Historians have discovered that a type of natural glass – obsidian – formed in places such as the mouth of a volcano" },
      { number: 2, answer: "spears", passageKeyword: "tips for spears", questionKeyword: "sharp points of spears", thaiMeaning: "หอก", exactPortion: "was first used as tips for spears" },
      { number: 3, answer: "beads", passageKeyword: "coating stone beads", questionKeyword: "stone beads covered in glass", thaiMeaning: "ลูกปัด", exactPortion: "this took the form of glazes used for coating stone beads" },
      { number: 4, answer: "impurities", passageKeyword: "impurities of the raw material", questionKeyword: "coloured because of impurities", thaiMeaning: "สิ่งเจือปน", exactPortion: "The glass made during this time was highly coloured due to the impurities of the raw material" },
      { number: 5, answer: "Romans", passageKeyword: "Romans guarded glass-making skills", questionKeyword: "only the Romans knew", thaiMeaning: "ชาวโรมัน", exactPortion: "they guarded the skills and technology required to make glass very closely, and it was not until their empire collapsed in 476 AD" },
      { number: 6, answer: "lead", passageKeyword: "introducing lead", questionKeyword: "process using lead", thaiMeaning: "ตะกั่ว", exactPortion: "by introducing lead to the raw materials used in the process" },
      { number: 7, answer: "clouding", passageKeyword: "effect of clouding", questionKeyword: "avoid clouding", thaiMeaning: "ขุ่นมัว", exactPortion: "He attempted to counter the effect of clouding that sometimes occurred in blown glass" },
      { number: 8, answer: "taxes", passageKeyword: "heavy taxes", questionKeyword: "laws concerning taxes", thaiMeaning: "ภาษี", exactPortion: "heavy taxes had been placed on the amount of glass melted in a glasshouse" }
    ]
  },
  {
    examId: "journey-normal-stage-5",
    passageNumber: 1,
    startNumber: 1,
    endNumber: 7,
    sourceParagraphs: ["B", "D"],
    instructions: [
      "Questions 1–7",
      "Complete the table below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 1–7 on your answer sheet."
    ],
    summaryTitle: "The Tourism New Zealand website",
    summaryLines: [
      { type: 'heading', text: "Database of tourism services" },
      { type: 'bullet', text: "allowed businesses to {1} information regularly" },
      { type: 'bullet', text: "evaluation including impact on the {2}" },
      { type: 'heading', text: "Special features on local topics" },
      { type: 'bullet', text: "interview with a former sports {3}" },
      { type: 'bullet', text: "interactive tour of locations used in {4}" },
      { type: 'heading', text: "Information on driving routes" },
      { type: 'bullet', text: "varied depending on the {5}" },
      { type: 'heading', text: "Travel Planner" },
      { type: 'bullet', text: "map, public transport and local {6}" },
      { type: 'heading', text: "'Your Words'" },
      { type: 'bullet', text: "travellers could send a link to their {7}" }
    ],
    questions: [
      { number: 1, answer: "update", passageKeyword: "update the details they gave on a regular basis", questionKeyword: "update information regularly", thaiMeaning: "อัปเดตข้อมูล", exactPortion: "participating businesses were able to update the details they gave on a regular basis, the information provided remained accurate" },
      { number: 2, answer: "environment", passageKeyword: "effect on the environment", questionKeyword: "impact on the environment", thaiMeaning: "สิ่งแวดล้อม", exactPortion: "As part of this, the effect of each business on the environment was considered" },
      { number: 3, answer: "captain", passageKeyword: "rugby captain Tana Umaga", questionKeyword: "former sports captain", thaiMeaning: "กัปตันทีม", exactPortion: "One of the most popular was an interview with former New Zealand All Blacks rugby captain Tana Umaga" },
      { number: 4, answer: "films", passageKeyword: "blockbuster films", questionKeyword: "locations used in films", thaiMeaning: "ภาพยนตร์", exactPortion: "an interactive journey through a number of the locations chosen for blockbuster films which had made use of New Zealand's stunning scenery as a backdrop" },
      { number: 5, answer: "season", passageKeyword: "according to the season", questionKeyword: "varied depending on the season", thaiMeaning: "ฤดูกาล", exactPortion: "highlighting different routes according to the season and indicating distances and times" },
      { number: 6, answer: "accommodation", passageKeyword: "links to accommodation", questionKeyword: "local accommodation", thaiMeaning: "ที่พัก", exactPortion: "There were also links to accommodation in the area" },
      { number: 7, answer: "blog", passageKeyword: "submit a blog", questionKeyword: "link to their blog", thaiMeaning: "บล็อก", exactPortion: "anyone could submit a blog of their New Zealand travels for possible inclusion on the website" }
    ]
  },
  {
    examId: "journey-normal-stage-5",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["D", "E"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Responses to boredom",
    summaryLines: [
      { type: 'para', text: "For John Eastwood, the central feature of boredom is that people cannot {25}, due to a failure in the 'attention system', and as a result they become frustrated and irritable." },
      { type: 'bullet', text: "Those for whom {26} is an important aim in life may have problems in coping with boredom." },
      { type: 'bullet', text: "Those who have the characteristic of {27} can generally cope with it." }
    ],
    questions: [
      { number: 25, answer: "focus", passageKeyword: "inability to focus on anything", questionKeyword: "cannot focus", thaiMeaning: "โฟกัส", exactPortion: "For Eastwood, the central feature of boredom is a failure to put our attention system into gear. This causes an inability to focus on anything" },
      { number: 26, answer: "pleasure", passageKeyword: "motivated by pleasure", questionKeyword: "pleasure important aim", thaiMeaning: "ความสุข", exactPortion: "People who are motivated by pleasure seem to suffer particularly badly" },
      { number: 27, answer: "curiosity", passageKeyword: "high boredom threshold", questionKeyword: "characteristic curiosity", thaiMeaning: "ความอยากรู้", exactPortion: "Other personality traits, such as curiosity, are associated with a high boredom threshold" }
    ]
  }
]
