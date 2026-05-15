import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractTest2, extractTest3, extractTest4 } from './c12-extract-passages.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, '../cambridge-reading-imports/cambridge-12-reading-import.json')

const findQuote = (body, hints) => {
  const keys = String(hints).split('|').map((k) => k.trim().toLowerCase()).filter(Boolean)
  const sentences = body
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[A-H]\s+/, '').trim())
    .filter((s) => s.length > 40)
  const hit =
    sentences.find((s) => keys.every((k) => s.toLowerCase().includes(k))) ||
    sentences.find((s) => keys.filter((k) => k.length > 4).every((k) => s.toLowerCase().includes(k))) ||
    sentences.find((s) => keys.some((k) => k.length > 4 && s.toLowerCase().includes(k)))
  return (hit || sentences[0] || body).trim().slice(0, 220)
}

const block = ({ n, prompt, answer, accepted, test, passage, exact, thai, para }) =>
  `Question ${n}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: Cambridge 12 Test ${test} Passage ${passage}

Exact Portion: "${String(exact).replace(/"/g, '\\"')}"

Short Thai Explanation: ${thai}

Paraphrased Vocabulary: ${para}`

const buildKey = (test, passage, title, qs) =>
  `READING PASSAGE ${passage}: ${title}\n\n${qs.map((q) => block({ ...q, test, passage })).join('\n\n')}`

const buildPassage = (num, title, body, qText) =>
  `READING PASSAGE ${num}\n${title}\n\n${body}\n\n${qText}`

const mk = (body, test, passage, items) =>
  items.map((row) => {
    const [n, prompt, answer, hints, thai, para, accepted, exactOverride] = row
    return {
      n,
      prompt,
      answer,
      accepted,
      exact: exactOverride || findQuote(body, hints),
      thai: thai || `จากข้อความในบทความที่เกี่ยวข้องกับ ${hints.split('|')[0]} จึงตอบ ${answer}`,
      para: para || `${hints.split('|')[0]} = ${answer} = คำตอบจากข้อความ`
    }
  })

const exam = ({ test, passage, title, category, body, qText, questions }) => ({
  id: `cambridge-12-test${test}-passage${passage}`,
  title: `Cambridge 12 Test ${test} Passage ${passage} - ${title}`,
  category,
  rawPassageText: buildPassage(passage, title, body, qText),
  rawAnswerKey: buildKey(test, passage, title, questions)
})

// —— Test 1 bodies ——
const t1p1Body = `Cork – the thick bark of the cork oak tree (Quercus suber) – is a remarkable material. It is tough, elastic, buoyant, and fire-resistant, and suitable for a wide range of purposes. It has also been used for millennia: the ancient Egyptians sealed their sarcophagi (stone coffins) with cork, while the ancient Greeks and Romans used it for anything from beehives to sandals.

And the cork oak itself is an extraordinary tree. Its bark grows up to 20 cm in thickness, insulating the tree like a coat wrapped around the trunk and branches and keeping the inside at a constant 20°c all year round. Developed most probably as a defence against forest fires, the bark of the cork oak has a particular cellular structure – with about 40 million cells per cubic centimetre – that technology has never succeeded in replicating. The cells are filled with air, which is why cork is so buoyant. It also has an elasticity that means you can squash it and watch it spring back to its original size and shape when you release the pressure.

Cork oaks grow in a number of Mediterranean countries, including Portugal, Spain, Italy, Greece and Morocco. They flourish in warm, sunny climates where there is a minimum of 400 millimetres of rain per year, and not more than 800 millimetres. Like grape vines, the trees thrive in poor soil, putting down deep roots in search of moisture and nutrients. Southern Portugal's Alentejo region meets all of these requirements, which explains why, by the early 20th century, this region had become the world's largest producer of cork, and why today it accounts for roughly half of all cork production around the world.

Most cork forests are family-owned. Many of these family businesses, and indeed many of the trees themselves, are around 200 years old. Cork production is, above all, an exercise in patience. From the planting of a cork sapling to the first harvest takes 25 years, and a gap of approximately a decade must separate harvests from an individual tree. And for top-quality cork, it's necessary to wait a further 15 or 20 years. You even have to wait for the right kind of summer's day to harvest cork. If the bark is stripped on a day when it's too cold – or when the air is damp – the tree will be damaged.

Cork harvesting is a very specialised profession. No mechanical means of stripping cork bark has been invented, so the job is done by teams of highly skilled workers. First, they make vertical cuts down the bark using small sharp axes, then lever it away in pieces as large as they can manage. The most skilful cork-strippers prise away a semi-circular husk that runs the length of the trunk from just above ground level to the first branches. It is then dried on the ground for about four months, before being taken to factories, where it is boiled to kill any insects that might remain in the cork. Over 60% of cork then goes on to be made into traditional bottle stoppers, with most of the remainder being used in the construction trade. Corkboard and cork tiles are ideal for thermal and acoustic insulation, while granules of cork are used in the manufacture of concrete.

Recent years have seen the end of the virtual monopoly of cork as the material for bottle stoppers, due to concerns about the effect it may have on the contents of the bottle. This is caused by a chemical compound called 2,4,6-trichloroanisole (TCA), which forms through the interaction of plant phenols, chlorine and mould. The tiniest concentrations – as little as three or four parts to a trillion – can spoil the taste of the product contained in the bottle. The result has been a gradual yet steady move first towards plastic stoppers and, more recently, to aluminium screw caps. These substitutes are cheaper to manufacture and, in the case of screw caps, more convenient for the user.

The classic cork stopper does have several advantages, however. Firstly, its traditional image is more in keeping with that of the type of high quality goods with which it has long been associated. Secondly – and very importantly – cork is a sustainable product that can be recycled without difficulty. Moreover, cork forests are a resource which support local biodiversity, and prevent desertification in the regions where they are planted. So, given the current concerns about environmental issues, the future of this ancient material once again looks promising.`

const t1p2Body = `Collecting must be one of the most varied of human activities, and it's one that many of us psychologists find fascinating. Many forms of collecting have been dignified with a technical name: an archtophilist collects teddy bears, a philatelist collects postage stamps, and a deltiologist collects postcards. Amassing hundreds or even thousands of postcards, chocolate wrappers or whatever, takes time, energy and money that could surely be put to much more productive use. And yet there are millions of collectors around the world. Why do they do it?

There are the people who collect because they want to make money – this could be called an instrumental reason for collecting; that is, collecting as a means to an end. They'll look for, say, antiques that they can buy cheaply and expect to be able to sell at a profit. But there may well be a psychological element, too – buying cheap and selling dear can give the collector a sense of triumph. And as selling online is so easy, more and more people are joining in.

Many collectors collect to develop their social life, attending meetings of a group of collectors and exchanging information on items. This is a variant on joining a bridge club or a gym, and similarly brings them into contact with like-minded people.

Another motive for collecting is the desire to find something special, or a particular example of the collected item, such as a rare early recording by a particular singer. Some may spend their whole lives in a hunt for this. Psychologically, this can give a purpose to a life that otherwise feels aimless. There is a danger, though, that if the individual is ever lucky enough to find what they're looking for, rather than celebrating their success, they may feel empty, now that the goal that drove them on has gone.

If you think about collecting postage stamps, another potential reason for it – or, perhaps, a result of collecting – is its educational value. Stamp collecting opens a window to other countries, and to the plants, animals, or famous people shown on their stamps. Similarly, in the 19th century, many collectors amassed fossils, animals and plants from around the globe, and their collections provided a vast amount of information about the natural world. Without those collections, our understanding would be greatly inferior to what it is.

In the past – and nowadays, too, though to a lesser extent – a popular form of collecting, particularly among boys and men, was trainspotting. This might involve trying to see every locomotive of a particular type, using published data that identifies each one, and ticking off each engine as it is seen. Trainspotters exchange information, these days often by mobile phone, so they can work out where to go to, to see a particular engine. As a byproduct, many practitioners of the hobby become very knowledgeable about railway operations, or the technical specifications of different engine types.

Similarly, people who collect dolls may go beyond simply enlarging their collection, and develop an interest in the way that dolls are made, or the materials that are used. These have changed over the centuries from the wood that was standard in 16th century Europe, through the wax and porcelain of later centuries, to the plastics of today's dolls. Or collectors might be inspired to study how dolls reflect notions of what children like, or ought to like.

Not all collectors are interested in learning from their hobby, though, so what we might call a psychological reason for collecting is the need for a sense of control, perhaps as a way of dealing with insecurity. Stamp collectors, for instance, arrange their stamps in albums, usually very neatly, organising their collection according to certain commonplace principles – perhaps by country in alphabetical order, or grouping stamps by what they depict – people, birds, maps, and so on.

One reason, conscious or not, for what someone chooses to collect is to show the collector's individualism. Someone who decides to collect something as unexpected as dog collars, for instance, may be conveying their belief that they must be interesting themselves. And believe it or not, there is at least one dog collar museum in existence, and it grew out of a personal collection.

Of course, all hobbies give pleasure, but the common factor in collecting is usually passion: pleasure is putting it far too mildly. More than most other hobbies, collecting can be totally engrossing, and can give a strong sense of personal fulfilment. To non-collectors it may appear an eccentric, if harmless, way of spending time, but potentially, collecting has a lot going for it.`

const t1p3Body = `A

'I would found an institution where any person can find instruction in any subject.' That was the founder's motto for Cornell University, and it seems an apt characterization of the different university, also in the USA, where I currently teach philosophy. A student can prepare for a career in resort management, engineering, interior design, accounting, music, law enforcement, you name it. But what would the founders of these two institutions have thought of a course called 'Arson for Profit'? I kid you not: we have it on the books. Any undergraduates who have met the academic requirements can sign up for the course in our program in 'fire science'.

B

Naturally, the course is intended for prospective arson investigators, who can learn all the tricks of the trade for detecting whether a fire was deliberately set, discovering who did it, and establishing a chain of evidence for effective prosecution in a court of law. But wouldn't this also be the perfect course for prospective arsonists to sign up for? My point is not to criticize academic programs in fire science: they are highly welcome as part of the increasing professionalization of this and many other occupations. However, it's not unknown for a firefighter to torch a building. This example suggests how dishonest and illegal behavior, with the help of higher education, can creep into every aspect of public and business life.

C

I realized this anew when I was invited to speak before a class in marketing, which is another of our degree programs. The regular instructor is a colleague who appreciates the kind of ethical perspective I can bring as a philosopher. There are endless ways I could have approached this assignment, but I took my cue from the title of the course: 'Principles of Marketing'. It made me think to ask the students, 'Is marketing principled?' After all, a subject matter can have principles in the sense of being codified, having rules, as with football or chess, without being principled in the sense of being ethical. Many of the students immediately assumed that the answer to my question about marketing principles was obvious: no. Just look at the ways in which everything under the sun has been marketed; obviously it need not be done in a principled (=ethical) fashion.

D

Is that obvious? I made the suggestion, which may sound downright crazy in light of the evidence, that perhaps marketing is by definition principled. My inspiration for this judgement is the philosopher Immanuel Kant, who argued that any body of knowledge consists of an end (or purpose) and a means.

E

Let us apply both the terms 'means' and 'end' to marketing. The students have signed up for a course in order to learn how to market effectively. But to what end? There seem to be two main attitudes toward that question. One is that the answer is obvious: the purpose of marketing is to sell things and to make money. The other attitude is that the purpose of marketing is irrelevant: Each person comes to the program and course with his or her own plans, and these need not even concern the acquisition of marketing expertise as such. My proposal, which I believe would also be Kant's, is that neither of these attitudes captures the significance of the end to the means for marketing. A field of knowledge or a professional endeavor is defined by both the means and the end; hence both deserve scrutiny. Students need to study both how to achieve X, and also what X is.

F

It is at this point that 'Arson for Profit' becomes supremely relevant. That course is presumably all about means: how to detect and prosecute criminal activity. It is therefore assumed that the end is good in an ethical sense. When I ask fire science students to articulate the end, or purpose, of their field, they eventually generalize to something like, 'The safety and welfare of society,' which seems right. As we have seen, someone could use the very same knowledge of means to achieve a much less noble end, such as personal profit via destructive, dangerous, reckless activity. But we would not call that firefighting. We have a separate word for it: arson. Similarly, if you employed the 'principles of marketing' in an unprincipled way, you would not be doing marketing. We have another term for it: fraud. Kant gives the example of a doctor and a poisoner, who use the identical knowledge to achieve their divergent ends. We would say that one is practicing medicine, the other, murder.`

const t2 = extractTest2()
const t3 = extractTest3()
const t4 = extractTest4()

const q1p1 = `Questions 1-13

Questions 1-5
Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.

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

const q1p2 = `Questions 14-26

Questions 14-20
Complete the sentences below. Write ONE WORD ONLY from the passage in each gap.

14 The writer mentions collecting as an example of collecting in order to make money.
15 Collectors may get a feeling of …………… from buying and selling items.
16 Collectors' clubs provide opportunities to share ……………
17 Collectors' clubs offer …………… with people who have similar interests.
18 Collecting sometimes involves a life-long …………… for a special item.
19 Searching for something particular may prevent people from feeling their life is completely ……………
20 Stamp collecting may be …………… because it provides facts about different countries.
21 …………… tends to be mostly a male hobby.

Questions 22-26
Do the following statements agree with the information given in the Reading Passage?
Write TRUE, FALSE or NOT GIVEN.

22 The number of people buying dolls has grown over the centuries.
23 Sixteenth century European dolls were normally made of wax and porcelain.
24 Arranging a stamp collection by the size of the stamps is less common than other methods.
25 Someone who collects unusual objects may want others to think he or she is also unusual.
26 Collecting gives a feeling that other hobbies are unlikely to inspire.`

const q1p3 = `Questions 27-40

Questions 27-32
Choose the correct heading for paragraphs A–F from the list of headings below.

List of Headings
i Courses that require a high level of commitment
ii A course title with two meanings
iii The equal importance of two key issues
iv Applying a theory in an unexpected context
v The financial benefits of studying
vi A surprising course title
vii Different names for different outcomes
viii The possibility of attracting the wrong kind of student

27 Paragraph A
28 Paragraph B
29 Paragraph C
30 Paragraph D
31 Paragraph E
32 Paragraph F

Questions 33-36
Complete the summary below. Write NO MORE THAN TWO WORDS from the passage in each gap.

The 'Arson for Profit' course
33 This is a university course intended for students who are undergraduates and who are studying ……………
34 The expectation is that they will become …………… specialising in arson.
35 The course will help them to detect cases of arson and find …………… of criminal intent, leading to successful …………… in the courts.

Questions 37-40
Do the following statements agree with the claims of the writer?
Write YES, NO or NOT GIVEN.

37 It is difficult to attract students onto courses that do not focus on a career.
38 The 'Arson for Profit' course would be useful for people intending to set fire to buildings.
39 Fire science courses are too academic to help people to be good at the job of firefighting.
40 The writer's fire science students provided a detailed definition of the purpose of their studies.`

const exams = [
  exam({
    test: 1,
    passage: 1,
    title: 'Cork',
    category: 'normal',
    body: t1p1Body,
    qText: q1p1,
    questions: mk(t1p1Body, 1, 1, [
      [1, 'The cork oak has the thickest bark of any living tree.', 'NOT GIVEN', 'bark grows up to 20 cm', 'ไม่มีการเปรียบเทียบว่าหนาที่สุด มีแค่บอกความหนา 20 ซม.', 'thickest bark = grows up to 20 cm in thickness = เปลือกหนา 20 ซม.'],
      [2, 'Scientists have developed a synthetic cork with the same cellular structure as natural cork.', 'FALSE', 'never succeeded in replicating', 'technology never succeeded in replicating แปลว่าทำสำเนาไม่สำเร็จ', 'synthetic = replicating = เลียนแบบโครงสร้าง'],
      [3, 'Individual cork oak trees must be left for 25 years between the first and second harvest.', 'FALSE', 'first harvest takes 25 years|decade must separate', '25 ปีคือจนถึงเก็บครั้งแรก ระหว่างเก็บครั้งแรกกับสองห่างประมาณทศวรรษ', 'between first and second = decade = ห่าง ~10 ปี'],
      [4, 'Cork bark should be stripped in dry atmospheric conditions.', 'TRUE', 'air is damp|tree will be damaged', 'ถ้าอากาศชื้นจะเสียหาย แปลว่าควรลอกตอนอากาศแห้ง', 'dry conditions = not damp = อากาศแห้ง'],
      [5, 'The only way to remove the bark from cork oak trees is by hand.', 'TRUE', 'No mechanical means|highly skilled workers', 'ไม่มีเครื่องจักร ต้องใช้คนงานทำ', 'only way = no mechanical means = ด้วยมือ'],
      [6, 'Advantages of aluminium screw caps: do not affect the … of the bottle contents', 'taste', 'spoil the taste', 'ฝาแก้วไม่ทำให้รสเสีย', 'affect = spoil (negated) = taste = รสชาติ'],
      [7, 'Advantages of aluminium screw caps: are … to produce', 'cheaper', 'cheaper to manufacture', 'ถูกกว่าในการผลิต', 'produce = manufacture = cheaper = ถูกกว่า'],
      [8, 'Advantages of aluminium screw caps: are … to use', 'convenient', 'more convenient for the user', 'สะดวกกว่าสำหรับผู้ใช้', 'to use = for the user = convenient = สะดวก'],
      [9, 'Advantages of cork bottle stoppers: suit the … of quality products', 'image', 'traditional image|high quality goods', 'ภาพลักษณ์ดั้งเดิมเข้ากับสินค้าคุณภาพ', 'suit = in keeping with = image = ภาพลักษณ์'],
      [10, 'Advantages of cork bottle stoppers: made from a … material', 'sustainable', 'sustainable product', 'วัสดุยั่งยืน', 'material = sustainable = ยั่งยืน'],
      [11, 'Advantages of cork bottle stoppers: … easily', 'recycled', 'recycled without difficulty', 'รีไซเคิลได้ง่าย', 'easily = without difficulty = recycled'],
      [12, 'cork forests aid …', 'biodiversity', 'support local biodiversity', 'ป่าไม้ช่วยความหลากหลายทางชีวภาพ', 'aid = support = biodiversity'],
      [13, 'cork forests stop … happening', 'desertification', 'prevent desertification', 'ป้องกันการกลายเป็นทะเลทราย', 'stop = prevent = desertification']
    ])
  }),
  exam({
    test: 1,
    passage: 2,
    title: 'Collecting as a Hobby',
    category: 'normal',
    body: t1p2Body,
    qText: q1p2,
    questions: mk(t1p2Body, 1, 2, [
      [14, 'The writer mentions collecting as an example of collecting in order to make money.', 'antiques', 'antiques that they can buy cheaply', 'ตัวอย่างของการสะสมเพื่อหาเงินคือ antiques', 'make money = sell at a profit = antiques = ของโบราณ'],
      [15, 'Collectors may get a feeling of … from buying and selling items.', 'triumph', 'sense of triumph', 'ได้ความรู้สึกชัยชนะ', 'feeling = sense of = triumph = ชัยชนะ'],
      [16, "Collectors' clubs provide opportunities to share …", 'information', 'exchanging information on items', 'แลกเปลี่ยนข้อมูล', 'share = exchanging = information = ข้อมูล'],
      [17, "Collectors' clubs offer … with people who have similar interests.", 'contact', 'brings them into contact with like-minded people', 'ได้พบปะคนที่มีความสนใจคล้ายกัน', 'similar interests = like-minded = contact = ติดต่อ/พบปะ', 'contact|meetings'],
      [18, 'Collecting sometimes involves a life-long … for a special item.', 'desire', 'desire to find something special|whole lives in a hunt', 'อาจใช้ desire หรือ hunt ตามข้อความ', 'life-long = whole lives = desire/hunt = ความปรารถนา/การล่า', 'desire|hunt'],
      [19, 'Searching for something particular may prevent people from feeling their life is completely …', 'aimless', 'life that otherwise feels aimless', 'การล่าหาทำให้ชีวิตไม่รู้สึกไร้จุดหมาย', 'prevent = otherwise feels = aimless = ไร้จุดหมาย', 'aimless|empty'],
      [20, 'Stamp collecting may be … because it provides facts about different countries.', 'educational', 'educational value', 'มีคุณค่าทางการศึกษา', 'facts about countries = educational value = การศึกษา'],
      [21, '… tends to be mostly a male hobby.', 'trainspotting', 'particularly among boys and men', 'trainspotting เป็นที่นิยมในหนุ่มและผู้ชาย', 'male hobby = boys and men = trainspotting'],
      [22, 'The number of people buying dolls has grown over the centuries.', 'NOT GIVEN', 'people who collect dolls', 'ไม่มีข้อมูลจำนวนผู้ซื้อตุ๊กตา', 'number buying dolls = not mentioned = ไม่ได้บอก'],
      [23, 'Sixteenth century European dolls were normally made of wax and porcelain.', 'FALSE', '16th century Europe|wood', 'ศตวรรษที่ 16 ใช้ไม้ ไม่ใช่ wax/porcelain', '16th century = wood = ไม้'],
      [24, 'Arranging a stamp collection by the size of the stamps is less common than other methods.', 'NOT GIVEN', 'arrange their stamps in albums', 'ไม่ได้เปรียบเทียบวิธีจัดเรียง', 'by size = not mentioned = ไม่ได้บอก'],
      [25, 'Someone who collects unusual objects may want others to think he or she is also unusual.', 'TRUE', 'collect something as unexpected|must be interesting themselves', 'สะสมของแปลกเพื่อแสดงว่าตนเองน่าสนใจ', 'unusual = unexpected = interesting = แปลก/น่าสนใจ'],
      [26, 'Collecting gives a feeling that other hobbies are unlikely to inspire.', 'TRUE', 'More than most other hobbies|personal fulfilment', 'ให้ความสำเร็จทางใจมากกว่างานอดิเรกอื่น', 'feeling = fulfilment = more than other hobbies = มากกว่างานอดิเรกอื่น']
    ])
  }),
  exam({
    test: 1,
    passage: 3,
    title: "What's the Purpose of Gaining Knowledge?",
    category: 'advanced',
    body: t1p3Body,
    qText: q1p3,
    questions: mk(t1p3Body, 1, 3, [
      [27, 'Choose the correct heading for Paragraph A', 'vi', 'Arson for Profit|on the books', 'ชื่อวิชาแปลกที่มีจริง = heading vi', 'surprising course title = Arson for Profit = ชื่อวิชาแปลก'],
      [28, 'Choose the correct heading for Paragraph B', 'viii', 'perfect course for prospective arsonists', 'อาจดึงดูดนักวิชาการผิดประเภท', 'wrong kind of student = prospective arsonists'],
      [29, 'Choose the correct heading for Paragraph C', 'ii', 'Principles of Marketing|principled', 'ชื่อวิชามีสองความหมายของ principles', 'two meanings = principled/ethical = สองความหมาย'],
      [30, 'Choose the correct heading for Paragraph D', 'iv', 'Immanuel Kant|body of knowledge', 'นำทฤษฎี Kant มาใช้กับการตลาด', 'unexpected context = Kant + marketing'],
      [31, 'Choose the correct heading for Paragraph E', 'iii', 'defined by both the means and the end', 'means และ end สำคัญเท่ากัน', 'equal importance = both means and end'],
      [32, 'Choose the correct heading for Paragraph F', 'vii', 'separate word for it: arson|fraud|murder', 'ชื่อต่างกันเมื่อจุดประสงค์ต่างกัน', 'different names = arson/fraud/murder'],
      [33, "The 'Arson for Profit' course: students studying …", 'fire science', "program in 'fire science'", 'เรียน fire science', 'studying = program in = fire science'],
      [34, 'They will become … specialising in arson.', 'investigators', 'prospective arson investigators', 'จะเป็นนักสืบคดีวางเพลิง', 'become = prospective = investigators'],
      [35, 'Find … of criminal intent', 'evidence', 'chain of evidence', 'หาหลักฐาน', 'find = chain of = evidence = หลักฐาน'],
      [36, 'Leading to successful … in the courts.', 'prosecution', 'effective prosecution in a court of law', 'ดำเนินคดีในศาล', 'successful = effective = prosecution = ดำเนินคดี'],
      [37, 'It is difficult to attract students onto courses that do not focus on a career.', 'NOT GIVEN', 'career in resort management', 'ไม่ได้พูดถึงความยากในการดึงดูดนักศึกษา', 'difficult to attract = not mentioned'],
      [38, "The 'Arson for Profit' course would be useful for people intending to set fire to buildings.", 'YES', 'destructive, dangerous, reckless activity', 'ความรู้เดียวกันใช้ทำลายได้', 'useful = same knowledge = destructive activity'],
      [39, 'Fire science courses are too academic to help people to be good at the job of firefighting.', 'NO', 'professionalization of this and many other occupations', 'หลักสูตรช่วยให้เป็นมืออาชีพ ไม่ได้ว่าไร้ประโยชน์', 'too academic = professionalization (negated)'],
      [40, "The writer's fire science students provided a detailed definition of the purpose of their studies.", 'NO', 'eventually generalize to something like', 'พวกเขา generalize เท่านั้น ไม่ได้ให้คำจำกัดความละเอียด', 'detailed = generalize (negated)']
    ])
  })
]

// Test 2
const q2p1 = `Questions 1-13

Questions 1-3
Which paragraph contains the following information? Write A-I.

1 a reference to characteristics that only apply to food production
2 a reference to challenges faced only by farmers in certain parts of the world
3 a reference to difficulties in bringing about co-operation between farmers

Questions 4-9
Match each statement with the correct person, A-G.

4 Financial assistance from the government does not always go to the farmers who most need it.
5 Farmers can benefit from collaborating as a group.
6 Financial assistance from the government can improve the standard of living of farmers.
7 Farmers may be helped if there is financial input by the same individuals who buy from them.
8 Governments can help to reduce variation in prices.
9 Improvements to infrastructure can have a major impact on risk for farmers.

Questions 10-11
Which TWO problems affect farmers with small farms in developing countries?

Questions 12-13
Which TWO actions are recommended for improving conditions for farmers?`

const q2p2 = `Questions 14-26

Questions 14-20
Choose the correct heading for each paragraph, i-viii.

Questions 21-24
TRUE / FALSE / NOT GIVEN

21 Bingham went to South America in search of an Inca city.
22 Bingham chose a particular route down the Urubamba valley because it was the most common route used by travellers.
23 Bingham understood the significance of Machu Picchu as soon as he saw it.
24 Bingham returned to Machu Picchu in order to find evidence to support his theory.

Questions 25-26
Complete the sentences. ONE WORD ONLY.

25 The track down the Urubamba valley had been created for the transportation of ……………
26 Bingham found out about the ruins of Machu Picchu from a …………… in the Urubamba valley.`

const q2p3 = `Questions 27-40

Questions 27-31
Complete the table. NO MORE THAN TWO WORDS.

27 Observing the … of Russian-English bilingual people when asked to select certain objects
28 mechanism known as …
29 A test called the …, focusing on naming colours
30 bilingual people are more able to handle …
31 bilingual people have superior …

Questions 32-36
YES / NO / NOT GIVEN

Questions 37-40
Which paragraph contains the following? A-G.`

exams.push(
  exam({
    test: 2,
    passage: 1,
    title: 'The Risks Agriculture Faces in Developing Countries',
    category: 'normal',
    body: t2.p1,
    qText: q2p1,
    questions: mk(t2.p1, 2, 1, [
      [1, 'Which paragraph: characteristics that only apply to food production', 'A', 'distinguish food production from all other', 'ย่อหน้า A บอกสองสิ่งที่เฉพาะของ food production', 'only apply = distinguish from all other = เฉพาะการผลิตอาหาร'],
      [2, 'Which paragraph: challenges faced only by farmers in certain parts of the world', 'B', 'smallholder farmers in developing countries', 'ย่อหน้า B เกี่ยวกับเกษตรกรในประเทศกำลังพัฒนา', 'only = developing countries = เฉพาะบางภูมิภาค'],
      [3, 'Which paragraph: difficulties in bringing about co-operation between farmers', 'H', 'collective action does not come as a free good', 'ย่อหน้า H ว่าการร่วมมือต้องใช้เวลาและความพยายาม', 'co-operation = collective action = ความร่วมมือ'],
      [4, 'Financial assistance does not always go to farmers who most need it.', 'D', 'sixty percent of beneficiaries of subsidies are not poor', 'อุดหนุนไปหมดคนรวย ไม่ใช่คนจน', 'financial assistance = subsidies = อุดหนุน'],
      [5, 'Farmers can benefit from collaborating as a group.', 'B', 'collective action offers an important way', 'Murphy ว่าการร่วมมือช่วยเพิ่มอำนาจต่อรอง', 'collaborating = collective action = ร่วมมือกลุ่ม'],
      [6, 'Financial assistance can improve standard of living of farmers.', 'C', 'address poverty among farming families', 'Fan ว่า safety nets ช่วยลดความยากจน', 'standard of living = address poverty = ระดับชีวิต'],
      [7, 'Financial input by the same individuals who buy from them.', 'G', 'consumers invest in local farmers by subscription', 'ผู้บริโภคลงทุนกับเกษตรกรโดยตรง', 'financial input = invest by subscription = ลงทุน'],
      [8, 'Governments can help to reduce variation in prices.', 'B', 'mitigate wild swings in food prices', 'Murphy ว่ารัฐเก็บสต็อกช่วยลดความผันผวนราคา', 'variation in prices = wild swings = ความผันผวน'],
      [9, 'Improvements to infrastructure can have a major impact on risk.', 'A', 'providing basic services like roads', 'Nwanze ว่าโครงสร้างพื้นฐานลดความเสี่ยง', 'infrastructure = basic services like roads = โครงสร้างพื้นฐาน'],
      [10, 'Which TWO problems affect small farmers (first answer)', 'D', 'climate change increases the magnitude and frequency of extreme weather', 'ปัญหาหนึ่งคือสภาพอากาศเปลี่ยนแปลง', 'changing weather = extreme weather = สภาพอากาศ'],
      [11, 'Which TWO problems affect small farmers (second answer)', 'E', 'intermediary purchasers who dictate prices', 'ผู้ซื้อกลางกดราคา', 'intermediary buyers = purchasers who dictate prices = คนกลาง'],
      [12, 'Which TWO recommended actions (first answer)', 'C', 'all stakeholders must work together', 'ทุกฝ่ายต้องร่วมมือกัน', 'co-operation = work together = ร่วมมือ'],
      [13, 'Which TWO recommended actions (second answer)', 'D', 'consumers invest in local farmers by subscription', 'แบบ community-supported agriculture', 'financial stake = invest by subscription = ลงทุนร่วม']
    ])
  }),
  exam({
    test: 2,
    passage: 2,
    title: 'The Lost City',
    category: 'normal',
    body: t2.p2,
    qText: q2p2,
    questions: mk(t2.p2, 2, 2, [
      [14, 'Heading for Paragraph A', 'iv', 'His goal was to locate the remains of a city called Vitcos', 'เป้าหมายการเดินทาง', 'aim = goal = iv'],
      [15, 'Heading for Paragraph B', 'vi', 'a track had recently been blasted down the valley', 'เส้นทางใหม่', 'new route = track recently blasted = vi'],
      [16, 'Heading for Paragraph C', 'viii', 'showed no interest|without having the least expectation', 'Bingham ไม่กระตือรือร้น', 'lack of enthusiasm = no interest = viii'],
      [17, 'Heading for Paragraph D', 'v', 'describes the ever-present possibility of deadly snakes', 'บรรยายอย่างตื่นเต้น', 'dramatic description = vivid style = v'],
      [18, 'Heading for Paragraph E', 'i', 'journal entries reveal a much more gradual appreciation', 'บันทึกกับหนังสือเล่าไม่เหมือนกัน', 'different accounts = journal vs book = i'],
      [19, 'Heading for Paragraph F', 'vii', 'he knew he had to produce a big idea', 'ตีพิมพ์ทฤษฎี', 'publishes theory = big idea for magazine = vii'],
      [20, 'Heading for Paragraph G', 'iii', 'An idea which has gained wide acceptance', 'ความเชื่อที่ยอมรับกว้าง', 'common belief = wide acceptance = iii'],
      [21, 'Bingham went to South America in search of an Inca city.', 'TRUE', 'His goal was to locate the remains of a city called Vitcos', 'เป้าหมายคือหาเมืองอินคา', 'search = goal to locate = ค้นหา'],
      [22, 'Bingham chose the route because it was the most common route.', 'FALSE', 'advantage over travellers who had preceded them', 'ใช้เส้นทางใหม่ ไม่ใช่เส้นทางที่คนส่วนใหญ่ใช้', 'most common = advantage over others (negated)'],
      [23, 'Bingham understood the significance as soon as he saw it.', 'FALSE', "didn't realise the extent or the importance", 'ยังไม่เข้าใจความสำคัญทันที', 'as soon as = did not realise = ไม่เข้าใจทันที'],
      [24, 'Bingham returned to find evidence for his theory.', 'NOT GIVEN', 'prove this belief for nearly 40 years', 'ไม่ได้บอกว่ากลับไปที่ซาก', 'returned = not mentioned'],
      [25, 'Track created for transportation of …', 'rubber', 'enable rubber to be brought up by mules', 'เพื่อขนยาง', 'transportation = brought up = rubber = ยาง'],
      [26, 'Bingham found out about the ruins from a …', 'farmer', 'a local farmer, Melchor Arteaga', 'ชาวนาในท้องถิ่นบอก', 'from a = local farmer = ชาวนา']
    ])
  }),
  exam({
    test: 2,
    passage: 3,
    title: 'The Benefits of Being Bilingual',
    category: 'advanced',
    body: t2.p3,
    qText: q2p3,
    questions: mk(t2.p3, 2, 3, [
      [27, 'Observing the … of Russian-English bilingual people', 'eye movements', 'evidence for this phenomenon comes from studying eye movements', 'ศึกษาการเคลื่อนไหวของตา', 'observing = studying = eye movements'],
      [28, 'mechanism known as …', 'language co-activation', "phenomenon, called 'language co-activation'", 'กลไกเรียก language co-activation', 'simultaneously = co-activation = เปิดใช้สองภาษา'],
      [29, 'A test called the …', 'Stroop Task', 'In the classic Stroop Task', 'แบบทดสอบ Stroop', 'test = Stroop Task'],
      [30, 'more able to handle …', 'conflict management', 'perform better on tasks that require conflict management', 'จัดการความขัดแย้งได้ดี', 'handle = conflict management'],
      [31, 'have superior …', 'cognitive control', 'reflecting better cognitive control', 'ควบคุมการรับรู้ดีกว่า', 'superior = better = cognitive control'],
      [32, 'Attitudes towards bilingualism have changed in recent years.', 'YES', 'In the past, such children were considered to be at a disadvantage', 'มุมมองเปลี่ยนจากเสียเปรียบเป็นข้อดี', 'changed = used to be disadvantage = เปลี่ยน'],
      [33, 'Bilingual people are better at guessing words before they are finished.', 'NOT GIVEN', 'brain begins to guess what that word might be', 'ไม่ได้เปรียบเทียบพหุภาษา vs ภาษาเดียว', 'better at guessing = not compared'],
      [34, 'Bilingual people consistently name images faster than monolingual people.', 'NO', 'can cause speakers to name pictures more slowly', 'พหุภาษาตั้งชื่อภาพช้ากว่า', 'faster = more slowly (negated)'],
      [35, "Bilingual people's brains process single sounds more efficiently in all situations.", 'NO', 'When researchers play the same sound to both groups in the presence of background noise', 'มีประสิทธิภาพมากกว่าเฉพาะเมื่อมีเสียงรบกวน', 'in all situations = only with background noise'],
      [36, 'Fewer bilingual people than monolingual people suffer from brain disease in old age.', 'NOT GIVEN', 'bilingual patients reported showing initial symptoms five years later', 'ไม่ได้บอกว่าป่วยน้อยกว่า แค่อาการมาช้ากว่า', 'fewer suffer = symptoms later (not fewer)'],
      [37, 'example of brains responding differently to non-verbal auditory input', 'D', 'listen to simple speech sounds|background noise', 'ย่อหน้า D เปรียบเทียบเมื่อมีเสียงรบกวน', 'non-verbal auditory = speech sounds = เสียง'],
      [38, 'bilingual upbringing has benefits before we learn to speak', 'G', 'seven-month-old babies growing up in monolingual or bilingual homes', 'ทารก 7 เดือน', 'before we learn to speak = seven-month-old = ก่อนพูด'],
      [39, 'process by which people identify words that they hear', 'B', "When we hear a word, we don't hear the entire word all at once", 'กระบวนการเดา/รับรู้คำ', 'identify words = guess what that word might be'],
      [40, 'reference to some negative consequences of being bilingual', 'C', 'can result in difficulties|name pictures more slowly', 'มีข้อเสียบางอย่าง', 'negative consequences = difficulties = ข้อเสีย']
    ])
  })
)

// Test 3 & 4 - append similarly
const q3p1 = `Questions 1-13

Questions 1-7
Choose the correct heading for each paragraph, i-viii.

Questions 8-13
Complete the notes. ONE WORD ONLY.`

const q3p2 = `Questions 14-26

Questions 14-19
Which paragraph contains the following? A-H.

Questions 20-26
Complete the sentences. ONE WORD ONLY.`

const q3p3 = `Questions 27-40

Questions 27-31
Complete the summary. NO MORE THAN TWO WORDS.

Questions 32-36
Choose A-D.

Questions 37-40
Complete each sentence with the correct ending A-F.`

exams.push(
  exam({
    test: 3,
    passage: 1,
    title: 'Flying Tortoises',
    category: 'normal',
    body: t3.p1,
    qText: q3p1,
    questions: mk(t3.p1, 3, 1, [
      [1, 'Heading Paragraph A', 'v', 'islands were colonised by one or more tortoises', 'เต่าเข้ามาอาศัยเกาะ', 'populate = colonised = v'],
      [2, 'Heading Paragraph B', 'iii', 'pirates took a few|whaling ships|settlers hunted', 'การล่าและทำลายประชากร', 'disadvantage = exploitation = iii'],
      [3, 'Heading Paragraph C', 'viii', 'tortoise-breeding centre|protecting the island', 'เริ่มโครงการอนุรักษ์', 'conservation project = breeding centre = viii'],
      [4, 'Heading Paragraph D', 'i', "can't be reintroduced until they're at least five years old", 'ต้องรอให้ถึงอายุที่ปลอดภัย', 'timing right = at least five years old = i'],
      [5, 'Heading Paragraph E', 'iv', 'work out more ambitious reintroduction', 'วางแผนย้าย 300 ตัว', 'bigger idea = more ambitious = iv'],
      [6, 'Heading Paragraph F', 'vi', 'helicopter to move|custom crate|volunteers worked around the clock', 'ดำเนินการอย่างพิถีพิถัน', 'carefully prepared operation = helicopter operation = vi'],
      [7, 'Heading Paragraph G', 'ii', 'one tiny tortoise came across a fully grown giant', 'เจอเต่าตัวใหญ่', 'young meets old = tiny tortoise and giant = ii'],
      [8, '17th century: taken onto ships used by …', 'pirates', 'From the 17th century onwards, pirates took a few on board', 'โจรสลัด', 'ships used by = pirates took = โจรสลัด'],
      [9, '1790s: kept for …', 'food', 'to act as food supplies during long ocean passages', 'เป็นสำรองอาหาร', 'kept for = food supplies = อาหาร'],
      [10, 'also used to produce …', 'oil', 'their bodies were processed into high-grade oil', 'ผลิตน้ำมัน', 'produce = processed into = oil = น้ำมัน'],
      [11, 'Hunted by … on the islands', 'settlers', 'when settlers came to the islands. They hunted the tortoises', 'ผู้บุกเบิก', 'hunted by = settlers hunted = ผู้บุกเบิก'],
      [12, 'by various … not native to the islands', 'species', 'introduced alien species', 'สายพันธุ์ต่างถิ่น', 'not native = alien species = species'],
      [13, "fed on baby tortoises and tortoises' …", 'eggs', 'prey on the eggs and young tortoises', 'กินไข่', 'fed on = prey on = eggs = ไข่']
    ])
  }),
  exam({
    test: 3,
    passage: 2,
    title: 'The Intersection of Health Sciences and Geography',
    category: 'normal',
    body: t3.p2,
    qText: q3p2,
    questions: mk(t3.p2, 3, 2, [
      [14, 'acceptance that not all diseases can be totally eliminated', 'D', 'lead to the eradication of certain illnesses, and the prevention of others', 'ไม่สามารถกำจัดทุกโรคได้', 'not all eliminated = eradication of certain illnesses = บางโรค'],
      [15, 'examples of physical conditions caused by human behaviour', 'C', 'asthma, lung problems, eyesight issues', 'มลพิษจากพฤติกรรมมนุษย์', 'physical conditions = asthma, lung problems = สภาพทางกาย'],
      [16, 'classifying diseases on how far they extend geographically', 'F', 'categorizing illnesses, diseases and epidemics into local and global scales', 'จำแนกตามขอบเขตภูมิศาสตร์', 'classifying = categorizing into local and global'],
      [17, 'reasons why access to healthcare can vary within a country', 'G', 'discrepancy between the options available to people in different social classes', 'ความไม่เท่าเทียมในประเทศ', 'vary = discrepancy = social classes'],
      [18, 'health geography as a mixture of different academic fields', 'D', 'combination of knowledge regarding geography and the study of health', 'ผสานสองสาขา', 'mixture = combination = สองสาขา'],
      [19, 'type of area where a particular illness is rare', 'B', 'Malaria is much less of a problem in high-altitude deserts', 'มาลาเรียหายากในทะเลทราย', 'rare = much less of a problem = หายาก'],
      [20, 'diseases disappeared thanks to better … and healthcare', 'vaccinations', 'due to improvements in vaccinations and the availability of healthcare', 'วัคซีน', 'better = improvements in = vaccinations'],
      [21, '… are losing their usefulness', 'antibiotics', 'super-viruses and other infections resistant to antibiotics', 'เชื้อดื้อยา', 'losing usefulness = resistant to = antibiotics'],
      [22, 'Disease-causing … in hot, damp regions', 'mosquitoes', 'the mosquitos that can give people this disease can grow', 'ยุง', 'hot damp = tropical = mosquitoes'],
      [23, 'One cause of pollution is … that burn a particular fuel', 'factories', 'factories that run on coal power', 'โรงงานใช้ถ่านหิน', 'burn fuel = run on coal = factories'],
      [24, 'growth of cities often has an impact on nearby …', 'forests', 'cutting down of forests to allow for the expansion of big cities', 'ป่าใกล้เมือง', 'impact on = cutting down = forests'],
      [25, '… is one disease growing after being eradicated', 'polio', 'diseases like polio are re-emerging', 'โรคโปลิโอ', 'growing after eradicated = re-emerging = polio'],
      [26, 'A physical barrier such as a … can prevent people reaching a hospital', 'mountain', 'there is a mountain between their village and the nearest hospital', 'ภูเขา', 'barrier = mountain = ภูเขา']
    ])
  }),
  exam({
    test: 3,
    passage: 3,
    title: 'Music and the Emotions',
    category: 'advanced',
    body: t3.p3,
    qText: q3p3,
    questions: mk(t3.p3, 3, 3, [
      [27, 'music stimulated neurons to release substance called …', 'dopamine', 'triggers the production of dopamine', 'โดปามีน', 'substance = dopamine = โดปามีน'],
      [28, 'parts of the brain associated with feeling …', 'pleasure', 'linked with the experience of pleasure', 'ความสุข', 'feeling = experience of = pleasure'],
      [29, 'neurons in the area called the …', 'caudate', 'dopamine neurons in the caudate', 'caudate', 'area called = caudate = caudate'],
      [30, 'period known as the …', 'anticipatory phase', "researchers call this the 'anticipatory phase'", 'ช่วงรอคอย', 'period known as = anticipatory phase'],
      [31, "expectation of 'reward' stimuli such as …", 'food', "anticipating food and other 'reward' stimuli", 'อาหาร', 'reward stimuli = food = อาหาร'],
      [32, 'What point does the writer emphasise in the first paragraph?', 'B', 'our body betrays all the symptoms of emotional arousal', 'ปฏิกิริยาทางกายรุนแรง', 'emphasise = symptoms of emotional arousal = B'],
      [33, 'view of the Montreal study in the second paragraph?', 'C', 'obtain an impressively exact and detailed portrait', 'ข้อมูลละเอียดแม่นยำ', 'view = impressively exact = C'],
      [34, 'What does the writer find interesting about the results?', 'A', 'most active around 15 seconds before the participants\' favourite moments', 'จังหวะก่อนถึงจุดไฮไลต์', 'interesting = timing = A'],
      [35, "Why refer to Meyer's work?", 'B', 'offer support for the findings of the Montreal study', 'สนับสนุนผล Montreal', 'refer = offer support = B'],
      [36, "According to Meyer, what causes the listener's emotional response?", 'D', 'emotions we find in music come from the unfolding events of the music itself', 'โครงสร้างภายในเพลง', 'causes = unfolding events = D'],
      [37, 'The Montreal researchers discovered that', 'F', 'most active around 15 seconds before', 'กิจกรรม neuron ก่อนจุดสำคัญ', 'discovered = most active before = F'],
      [38, 'Many studies have demonstrated that', 'B', 'dopamine neurons quickly adapt to predictable rewards', 'neuron ลดลงเมื่อคาดเดาได้', 'predictable = adapt = B'],
      [39, "Meyer's analysis of Beethoven's music shows that", 'E', 'carefully holds off repeating it', 'เลื่อนให้สิ่งที่ผู้ฟังคาดหวัง', 'delays = holds off repeating = E'],
      [40, 'Earlier theories of music suggested that', 'C', 'music focused on the way a sound can refer to the real world of images', 'เชื่อมโยงภาพและเหตุการณ์จริง', 'earlier theories = refer to real world = C']
    ])
  })
)

const q4p1 = `Questions 1-13

Questions 1-8
Complete the notes. ONE WORD ONLY.

Questions 9-13
TRUE / FALSE / NOT GIVEN`

const q4p2 = `Questions 14-26

Questions 14-18
Choose A-D.

Questions 19-22
Complete the summary using words A-F.

Questions 23-26
YES / NO / NOT GIVEN`

const q4p3 = `Questions 27-40

Questions 27-33
Choose the correct heading for each paragraph, i-viii.

Questions 34-37
YES / NO / NOT GIVEN

Questions 38-40
Complete the sentences. ONE WORD ONLY.`

exams.push(
  exam({
    test: 4,
    passage: 1,
    title: 'The History of Glass',
    category: 'normal',
    body: t4.p1,
    qText: q4p1,
    questions: mk(t4.p1, 4, 1, [
      [1, 'Early humans used a material called … to make sharp points', 'obsidian', 'a type of natural glass – obsidian', 'ออบซิเดียน', 'material = obsidian = ออบซิเดียน'],
      [2, '… of their spears', 'spears', 'used as tips for spears', 'หอก', 'sharp points = tips for spears = spears'],
      [3, '4000 BC: … made of stone were covered in glass', 'beads', 'coating stone beads', 'ลูกปัด', 'made of stone = stone beads = beads'],
      [4, 'First century BC: glass was coloured because of the … in the material', 'impurities', 'highly coloured due to the impurities', 'สิ่งเจือปน', 'coloured because = impurities = สิ่งเจือปน'],
      [5, 'Until 476 AD: Only the … knew how to make glass', 'Romans', 'they guarded the skills|empire collapsed in 476 AD', 'ชาวโรมัน', 'only = guarded skills until 476 = Romans'],
      [6, 'George Ravenscroft developed a process using …', 'lead', 'by introducing lead to the raw materials', 'ตะกั่ว', 'using = introducing = lead = ตะกั่ว'],
      [7, 'to avoid the occurrence of … in blown glass', 'clouding', 'counter the effect of clouding', 'ขุ่นมัว', 'avoid = counter = clouding = ขุ่น'],
      [8, 'after changes to laws concerning …', 'taxes', 'heavy taxes had been placed|repeal of the Excise Act', 'ภาษี', 'laws = Excise Act = taxes = ภาษี'],
      [9, 'HM Ashley had the fastest bottle-producing machine at the time.', 'TRUE', 'more than three times quicker than any previous production method', 'เร็วกว่าวิธีเดิมมาก', 'fastest = three times quicker = เร็วที่สุด'],
      [10, 'Michael Owens was hired by a large US company to design a machine.', 'FALSE', 'founder of the Owens Bottle Machine Company', 'เขาเป็นผู้ก่อตั้ง ไม่ได้ถูกจ้าง', 'hired = founder (negated)'],
      [11, 'Nowadays, most glass is produced by large international manufacturers.', 'NOT GIVEN', 'fiercely competitive global market', 'ไม่ได้ระบุว่าผลิตโดยบริษัทใหญ่ส่วนใหญ่', 'most glass = not stated'],
      [12, 'Concern for the environment is leading to increased demand for glass containers.', 'TRUE', 'glass bottles and jars are becoming ever more popular', 'ความต้องการเพิ่ม', 'increased demand = more popular = เพิ่มขึ้น'],
      [13, 'It is more expensive to produce recycled glass than new glass.', 'FALSE', 'less energy is needed to melt recycled glass', 'รีไซเคิลถูกกว่า', 'more expensive = less energy needed (negated)']
    ])
  }),
  exam({
    test: 4,
    passage: 2,
    title: 'Bring Back the Big Cats',
    category: 'normal',
    body: t4.p2,
    qText: q4p2,
    questions: mk(t4.p2, 4, 2, [
      [
        14,
        'What did the 2006 discovery reveal about the lynx?',
        'D',
        'estimated extinction date|5,000 years',
        'อยู่ในอังกฤษนานกว่าที่คิด',
        'survived longer = extinction date brought forward = D',
        undefined,
        'it would bring forward the tassel-eared cat\'s estimated extinction date by roughly 5,000 years'
      ],
      [15, 'What point about large predators in paragraph 3?', 'A', 'large predators behave in completely different ways|creating niches for hundreds of species', 'เพิ่มความหลากหลายทางชีวภาพ', 'increase biodiversity = creating niches = A'],
      [16, 'What does the writer suggest about British conservation?', 'C', 'sought to prevent them from changing|preservation-jar model', 'แนวทางผิดพลาด', 'misguided = preservation-jar = C'],
      [17, 'Protecting large areas of the sea would result in', 'A', 'greatly boost catches in the surrounding seas', 'ประโยชน์ต่อการประมง', 'practical benefits = boost catches = A'],
      [18, 'What distinguishes rewilding from other campaigns?', 'C', 'helps to create a more inspiring vision', 'ข้อความเชิงบวกน่าดึงดูด', 'positive message = inspiring vision = C'],
      [19, 'lynx has ever put … in danger', 'E', 'no known instance of one preying on people', 'มนุษย์', 'in danger = preying on people (none) = humans = E'],
      [20, 'reduce the numbers of certain …', 'D', 'specialist predator of roe deer|sika deer', 'สัตว์ป่า', 'wild animals = roe deer/sika deer = D'],
      [21, 'minimal threat to …', 'F', 'little risk to sheep and other livestock', 'ปศุสัตว์', 'livestock = farm animals = F'],
      [22, 'return native … to certain areas', 'A', 'bringing forests back', 'ป่าไม้/ต้นไม้', 'native = forests back = trees = A'],
      [23, 'Britain could become the first European country to reintroduce the lynx.', 'NO', 'There is nothing extraordinary about these proposals, seen from the perspective of anywhere else in Europe', 'ไม่ใช่ประเทศแรกในยุโรป', 'first = nothing extraordinary elsewhere = NO'],
      [24, 'European lynx population growth has exceeded expectations.', 'NOT GIVEN', 'European population has tripled since 1970', 'ไม่ได้เปรียบเทียบกับความคาดหวัง', 'exceeded expectations = not stated'],
      [25, 'Changes in agricultural practices have extended lynx habitat in Europe.', 'YES', 'as farming has left the hills', 'การเกษตรเปลี่ยนทำให้ที่อยู่อาศัยขยาย', 'extended habitat = farming left the hills = YES'],
      [26, 'Species reintroduction has commercial advantages.', 'YES', 'more lucrative to protect charismatic wildlife than to hunt it, as tourists will pay', 'ท่องเที่ยวทำเงินได้', 'commercial = lucrative/tourists pay = YES']
    ])
  }),
  exam({
    test: 4,
    passage: 3,
    title: 'UK Companies Need More Effective Boards of Directors',
    category: 'advanced',
    body: t4.p3,
    qText: q4p3,
    questions: mk(t4.p3, 4, 3, [
      [27, 'Heading Paragraph A', 'iv', 'blame has been spread far and wide', 'หลายหน่วยถูกกล่าวหา', 'external bodies = blame spread = iv'],
      [28, 'Heading Paragraph B', 'ii', 'increased the pressures on, and the responsibilities of, directors', 'ผลกระทบจากการถูกจับตา', 'close examination = scrutiny = ii'],
      [29, 'Heading Paragraph C', 'vi', 'the board as a whole is less involved in fully addressing', 'กรรมการอาจไม่ร่วมแก้ปัญหาสำคัญ', 'not all directors take part = less involved = vi'],
      [30, 'Heading Paragraph D', 'viii', 'the professional board, whose members would work up to three or four days a week', 'ข้อเสนอเปลี่ยนรูปแบบคณะกรรมการ', 'proposal = professional board = viii'],
      [31, 'Heading Paragraph E', 'vii', 'do not focus sufficiently on longer-term matters|concentrate too much on short-term financial metrics', 'มองไม่ไกลพอ', 'not far enough ahead = short-term focus = vii'],
      [32, 'Heading Paragraph F', 'i', 'Compensation for chief executives has become a combat zone', 'ข้อพิพาทเรื่องค่าตอบแทน', 'disputes over financial arrangements = compensation battles = i'],
      [33, 'Heading Paragraph G', 'iii', 'widen their perspective|realignment of corporate goals', 'อาจต้องเปลี่ยนแปลงพื้นฐาน', 'fundamental change = realignment of goals = iii'],
      [34, 'Close scrutiny of boards has increased since the economic downturn.', 'YES', 'Following the 2008 financial meltdown|intense public debate', 'หลังวิกฤต 2008 การตรวจสอบเข้มขึ้น', 'increased = intense public debate = YES'],
      [35, 'Banks have been mismanaged to a greater extent than other businesses.', 'NOT GIVEN', 'role of bank directors and management', 'ไม่ได้เปรียบเทียบกับธุรกิจอื่น', 'greater extent = not compared'],
      [36, 'Board meetings normally continue as long as necessary to debate in full.', 'NO', 'time for constructive debate must necessarily be restricted', 'เวลาถกเถียงถูกจำกัด', 'as long as necessary = restricted (negated) = NO'],
      [37, 'Using a committee structure would ensure board members are fully informed.', 'NO', 'can mean that the board as a whole is less involved', 'คณะกรรมการทำให้บอร์ดร่วมน้อยลง', 'ensure informed = less involved (negated) = NO'],
      [38, 'non-executive directors were at a disadvantage because of lack of …', 'information', 'part-time non-executive directors lacked, leaving the latter unable to comprehend', 'ขาดข้อมูล', 'lack of = lacked = information'],
      [39, 'too much emphasis on … considerations of short-term relevance', 'financial', 'concentrate too much on short-term financial metrics', 'มุ่งเงินระยะสั้น', 'considerations = financial metrics = financial'],
      [40, 'the board may have to accept the views of …', 'shareholders', 'shareholders use their muscle in the area of pay', 'ผู้ถือหุ้น', 'accept views = shareholders use muscle = shareholders', 'shareholders|investors']
    ])
  })
)

fs.writeFileSync(out, JSON.stringify(exams, null, 2), 'utf8')
console.log(`Wrote ${exams.length} exams (${exams.reduce((s, e) => s + (e.rawAnswerKey.match(/Question \d+:/g) || []).length, 0)} questions) to ${out}`)
