import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.join(__dirname, '../cambridge-reading-imports/cambridge-12-reading-import.json')

const makeBlock = ({ n, prompt, answer, accepted, test, passage, exact, thai, para }) =>
  `Question ${n}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: Cambridge 12 Test ${test} Passage ${passage}

Exact Portion: "${exact.replace(/"/g, '\\"')}"

Short Thai Explanation: ${thai}

Paraphrased Vocabulary: ${para}`

const buildKey = (test, passage, title, questions) =>
  `READING PASSAGE ${passage}: ${title}\n\n${questions.map((q) => makeBlock({ ...q, test, passage })).join('\n\n')}`

const buildPassage = (passageNum, title, body, questionsText) =>
  `READING PASSAGE ${passageNum}\n${title}\n\n${body}\n\n${questionsText}`

// ——— Test 1 ———
const t1p1Body = `Cork – the thick bark of the cork oak tree (Quercus suber) – is a remarkable material. It is tough, elastic, buoyant, and fire-resistant, and suitable for a wide range of purposes. It has also been used for millennia: the ancient Egyptians sealed their sarcophagi (stone coffins) with cork, while the ancient Greeks and Romans used it for anything from beehives to sandals.

And the cork oak itself is an extraordinary tree. Its bark grows up to 20 cm in thickness, insulating the tree like a coat wrapped around the trunk and branches and keeping the inside at a constant 20°c all year round. Developed most probably as a defence against forest fires, the bark of the cork oak has a particular cellular structure – with about 40 million cells per cubic centimetre – that technology has never succeeded in replicating. The cells are filled with air, which is why cork is so buoyant. It also has an elasticity that means you can squash it and watch it spring back to its original size and shape when you release the pressure.

Cork oaks grow in a number of Mediterranean countries, including Portugal, Spain, Italy, Greece and Morocco. They flourish in warm, sunny climates where there is a minimum of 400 millimetres of rain per year, and not more than 800 millimetres. Like grape vines, the trees thrive in poor soil, putting down deep roots in search of moisture and nutrients. Southern Portugal's Alentejo region meets all of these requirements, which explains why, by the early 20th century, this region had become the world's largest producer of cork, and why today it accounts for roughly half of all cork production around the world.

Most cork forests are family-owned. Many of these family businesses, and indeed many of the trees themselves, are around 200 years old. Cork production is, above all, an exercise in patience. From the planting of a cork sapling to the first harvest takes 25 years, and a gap of approximately a decade must separate harvests from an individual tree. And for top-quality cork, it's necessary to wait a further 15 or 20 years. You even have to wait for the right kind of summer's day to harvest cork. If the bark is stripped on a day when it's too cold – or when the air is damp – the tree will be damaged.

Cork harvesting is a very specialised profession. No mechanical means of stripping cork bark has been invented, so the job is done by teams of highly skilled workers. First, they make vertical cuts down the bark using small sharp axes, then lever it away in pieces as large as they can manage. The most skilful cork-strippers prise away a semi-circular husk that runs the length of the trunk from just above ground level to the first branches. It is then dried on the ground for about four months, before being taken to factories, where it is boiled to kill any insects that might remain in the cork. Over 60% of cork then goes on to be made into traditional bottle stoppers, with most of the remainder being used in the construction trade. Corkboard and cork tiles are ideal for thermal and acoustic insulation, while granules of cork are used in the manufacture of concrete.

Recent years have seen the end of the virtual monopoly of cork as the material for bottle stoppers, due to concerns about the effect it may have on the contents of the bottle. This is caused by a chemical compound called 2,4,6-trichloroanisole (TCA), which forms through the interaction of plant phenols, chlorine and mould. The tiniest concentrations – as little as three or four parts to a trillion – can spoil the taste of the product contained in the bottle. The result has been a gradual yet steady move first towards plastic stoppers and, more recently, to aluminium screw caps. These substitutes are cheaper to manufacture and, in the case of screw caps, more convenient for the user.

The classic cork stopper does have several advantages, however. Firstly, its traditional image is more in keeping with that of the type of high quality goods with which it has long been associated. Secondly – and very importantly – cork is a sustainable product that can be recycled without difficulty. Moreover, cork forests are a resource which support local biodiversity, and prevent desertification in the regions where they are planted. So, given the current concerns about environmental issues, the future of this ancient material once again looks promising.`

const t1p1Questions = `Questions 1-13

Questions 1-5
Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information given in the text, or choose NOT GIVEN if there is no information on this.

1 The cork oak has the thickest bark of any living tree.
2 Scientists have developed a synthetic cork with the same cellular structure as natural cork.
3 Individual cork oak trees must be left for 25 years between the first and second harvest.
4 Cork bark should be stripped in dry atmospheric conditions.
5 The only way to remove the bark from cork oak trees is by hand.

Questions 6-13
Complete the notes below. Write ONE WORD ONLY from the passage in each gap.

Comparison of aluminium screw caps and cork bottle stoppers

Advantages of aluminium screw caps
- do not affect the …………… of the bottle contents
- are …………… to produce
- are …………… to use

Advantages of cork bottle stoppers
- suit the …………… of quality products
- made from a …………… material
- …………… easily
- cork forests aid ……………
- cork forests stop …………… happening`

const t1p1Key = buildKey(1, 1, 'Cork', [
  {
    n: 1,
    prompt: 'The cork oak has the thickest bark of any living tree.',
    answer: 'NOT GIVEN',
    exact: 'its bark grows up to 20 cm in thickness',
    thai: 'ข้อความบอกว่าเปลือกหนาถึง 20 ซม. แต่ไม่ได้เปรียบเทียบกับต้นไม้ชนิดอื่นว่าหนาที่สุดหรือไม่ จึงตอบ NOT GIVEN',
    para: 'thickest bark = grows up to 20 cm in thickness = เปลือกหนาถึง 20 ซม. (ไม่ได้บอกว่าหนาที่สุด)'
  },
  {
    n: 2,
    prompt: 'Scientists have developed a synthetic cork with the same cellular structure as natural cork.',
    answer: 'FALSE',
    exact: 'technology has never succeeded in replicating',
    thai: 'technology หมายถึงนักวิทยาศาสตร์/เทคโนโลยีที่พยายามเลียนแบบ แต่ never succeeded แปลว่าทำไม่สำเร็จ ขัดกับข้อความที่ว่าพัฒนาสำเร็จแล้ว',
    para: 'synthetic cork = replicating = เลียนแบบโครงสร้างเซลล์'
  },
  {
    n: 3,
    prompt: 'Individual cork oak trees must be left for 25 years between the first and second harvest.',
    answer: 'FALSE',
    exact: 'From the planting of a cork sapling to the first harvest takes 25 years, and a gap of approximately a decade must separate harvests from an individual tree.',
    thai: '25 ปีคือระยะจากปลูกจนถึงเก็บเกี่ยวครั้งแรก ไม่ใช่ระหว่างเก็บครั้งแรกกับครั้งที่สอง ซึ่งห่างกันประมาณทศวรรษ (10 ปี)',
    para: 'between the first and second harvest = gap of approximately a decade = ห่างกันประมาณ 10 ปี'
  },
  {
    n: 4,
    prompt: 'Cork bark should be stripped in dry atmospheric conditions.',
    answer: 'TRUE',
    exact: 'If the bark is stripped on a day when it's too cold – or when the air is damp – the tree will be damaged.',
    thai: 'ถ้าอากาศชื้นหรือหนาวเกินไปจะทำร้ายต้นไม้ แปลว่าควรลอกเปลือกในสภาพอากาศแห้ง',
    para: 'dry atmospheric conditions = when the air is damp (negated) = สภาพอากาศแห้ง'
  },
  {
    n: 5,
    prompt: 'The only way to remove the bark from cork oak trees is by hand.',
    answer: 'TRUE',
    exact: 'No mechanical means of stripping cork bark has been invented, so the job is done by teams of highly skilled workers.',
    thai: 'ไม่มีเครื่องจักรสำหรับลอกเปลือก งานจึงทำโดยคนงานที่มีทักษะสูง แปลว่าทำด้วยมือเท่านั้น',
    para: 'only way = no mechanical means = by hand (skilled workers) = ไม่มีเครื่องจักร ต้องใช้มือ'
  },
  {
    n: 6,
    prompt: 'Advantages of aluminium screw caps: do not affect the … of the bottle contents',
    answer: 'taste',
    exact: 'can spoil the taste of the product contained in the bottle',
    thai: 'ฝาแก้วลดปัญหาที่ทำให้รสชาติเสีย ดังนั้นอลูมิเนียมไม่กระทบ taste',
    para: 'do not affect = spoil (negated for screw caps) = รสชาติ'
  },
  {
    n: 7,
    prompt: 'Advantages of aluminium screw caps: are … to produce',
    answer: 'cheaper',
    exact: 'These substitutes are cheaper to manufacture',
    thai: 'manufacture แปลว่าผลิต ตรงกับ produce และ cheaper คือถูกกว่า',
    para: 'to produce = to manufacture = cheaper = ผลิตถูกกว่า'
  },
  {
    n: 8,
    prompt: 'Advantages of aluminium screw caps: are … to use',
    answer: 'convenient',
    exact: 'in the case of screw caps, more convenient for the user',
    thai: 'ข้อความบอกว่าสะดวกกว่าสำหรับผู้ใช้ ตรงกับช่องว่าง to use',
    para: 'to use = for the user = convenient = สะดวก'
  },
  {
    n: 9,
    prompt: 'Advantages of cork bottle stoppers: suit the … of quality products',
    answer: 'image',
    exact: 'its traditional image is more in keeping with that of the type of high quality goods',
    thai: 'in keeping with แปลว่าเข้ากับ image ของสินค้าคุณภาพสูง',
    para: 'suit = in keeping with = image = ภาพลักษณ์แบบดั้งเดิม'
  },
  {
    n: 10,
    prompt: 'Advantages of cork bottle stoppers: made from a … material',
    answer: 'sustainable',
    exact: 'cork is a sustainable product that can be recycled without difficulty',
    thai: 'วัสดุที่ยั่งยืนและรีไซเคิลได้ง่าย คำตอบคือ sustainable',
    para: 'material = product = sustainable = ยั่งยืน'
  },
  {
    n: 11,
    prompt: 'Advantages of cork bottle stoppers: … easily',
    answer: 'recycled',
    exact: 'can be recycled without difficulty',
    thai: 'ข้อความบอกว่ารีไซเคิลได้ง่าย คำตอบคือ recycled',
    para: 'easily = without difficulty = recycled = รีไซเคิล'
  },
  {
    n: 12,
    prompt: 'cork forests aid …',
    answer: 'biodiversity',
    exact: 'cork forests are a resource which support local biodiversity',
    thai: 'support แปลว่าช่วยเหลือ ตรงกับ aid และคำตอบคือ biodiversity',
    para: 'aid = support = biodiversity = ความหลากหลายทางชีวภาพ'
  },
  {
    n: 13,
    prompt: 'cork forests stop … happening',
    answer: 'desertification',
    exact: 'prevent desertification in the regions where they are planted',
    thai: 'prevent แปลว่าหยุด/ป้องกัน คำตอบคือ desertification',
    para: 'stop = prevent = desertification = การกลายเป็นทะเลทราย'
  }
])

// Continue in part 2 - file too long, will append via shell or second write
