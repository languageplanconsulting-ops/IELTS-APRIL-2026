/**
 * Normal Reading Journey ด่าน 1–5 — Cambridge-style mixed format.
 * Stage 1: P1 5 TFNG + 8 fill (Q1–13) | P2 8 fill + 5 TFNG (Q15–27 after remap)
 * Stage 2: P1 3 match info + 6 match people + 4 mcq (Q1–13) | P2 7 headings + 4 TFNG + 2 fill (Q15–27 after remap)
 * Stage 3: P1 7 headings + 6 fill (Q1–13) | P2 6 match info + 7 fill (Q15–27 after remap)
 * Stage 4: P1 8 fill + 5 TFNG (Q1–13) | P2 5 MCQ + 4 summary A–F + 4 YNNG (Q15–27 after remap)
 * Stage 5: P1 7 fill + 6 TFNG (Q1–13) | P2 6 headings + 4 match ideas + 3 fill (Q15–27 after remap)
 */
import type { IntensivePassageLayout, IntensiveQuestionSpec } from './intensivePassageBuilder.ts'

const tfng = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE or NOT GIVEN.',
  items
})

const tfngP2 = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the information given in Reading Passage 2? Write TRUE, FALSE or NOT GIVEN.',
  items
})

const fillBlock = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
  summaryTitle,
  items
})

const q = (
  prompt: string,
  answer: string,
  evidence: string,
  meta?: Partial<IntensiveQuestionSpec>
): IntensiveQuestionSpec => ({ prompt, answer, evidence, ...meta })

const P1_ORDER = ['tfng', 'fill'] as const
const P1_FILL_TFNG_ORDER = ['fill', 'tfng'] as const
const P2_FILL_TFNG_ORDER = ['fill', 'tfng'] as const
const P2_MCQ_SUMMARY_YNNG = ['mcq', 'ynng'] as const

const ynngP2 = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the claims of the writer in Reading Passage 2? Write YES, NO or NOT GIVEN.',
  items
})

const fillNotes = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
  summaryTitle,
  items
})

const fillTable = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the table below. Choose ONE WORD ONLY from the passage for each answer.',
  summaryTitle,
  items
})

const matchingIdeas = (ideas: string[], items: IntensiveQuestionSpec[]) => ({
  instruction: 'Match each person with the correct idea, A–E.',
  people: ideas,
  items
})

const P2_HEADINGS_MATCH_FILL = ['headings', 'matchingPeople', 'fill'] as const

const fillSentences = (items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer.',
  items
})

// ─── Stage 1: Cambridge 12 Test 1 — Cork + Collecting as a Hobby ─────────────

const stage1Passage1: IntensivePassageLayout = {
  title: 'Cork',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Cork – the thick bark of the cork oak tree (Quercus suber) – is a remarkable material. It is tough, elastic, buoyant, and fire-resistant, and suitable for a wide range of purposes. It has also been used for millennia: the ancient Egyptians sealed their sarcophagi (stone coffins) with cork, while the ancient Greeks and Romans used it for anything from beehives to sandals.'],
    ['B', 'And the cork oak itself is an extraordinary tree. Its bark grows up to 20 cm in thickness, insulating the tree like a coat wrapped around the trunk and branches and keeping the inside at a constant 20°C all year round. Developed most probably as a defence against forest fires, the bark of the cork oak has a particular cellular structure – with about 40 million cells per cubic centimetre – that technology has never succeeded in replicating. The cells are filled with air, which is why cork is so buoyant. It also has an elasticity that means you can squash it and watch it spring back to its original size and shape when you release the pressure.'],
    ['C', 'Cork oaks grow in a number of Mediterranean countries, including Portugal, Spain, Italy, Greece and Morocco. They flourish in warm, sunny climates where there is a minimum of 400 millimetres of rain per year, and not more than 800 millimetres. Like grape vines, the trees thrive in poor soil, putting down deep roots in search of moisture and nutrients. Southern Portugal\'s Alentejo region meets all of these requirements, which explains why, by the early 20th century, this region had become the world\'s largest producer of cork, and why today it accounts for roughly half of all cork production around the world.'],
    ['D', 'Most cork forests are family-owned. Many of these family businesses, and indeed many of the trees themselves, are around 200 years old. Cork production is, above all, an exercise in patience. From the planting of a cork sapling to the first harvest takes 25 years, and a gap of approximately a decade must separate harvests from an individual tree. And for top-quality cork, it\'s necessary to wait a further 15 or 20 years. You even have to wait for the right kind of summer\'s day to harvest cork. If the bark is stripped on a day when it\'s too cold – or when the air is damp – the tree will be damaged.'],
    ['E', 'Cork harvesting is a very specialised profession. No mechanical means of stripping cork bark has been invented, so the job is done by teams of highly skilled workers. First, they make vertical cuts down the bark using small sharp axes, then lever it away in pieces as large as they can manage. The most skilful cork-strippers prise away a semi-circular husk that runs the length of the trunk from just above ground level to the first branches. It is then dried on the ground for about four months, before being taken to factories, where it is boiled to kill any insects that might remain in the cork. Over 60% of cork then goes on to be made into traditional bottle stoppers, with most of the remainder being used in the construction trade. Corkboard and cork tiles are ideal for thermal and acoustic insulation, while granules of cork are used in the manufacture of concrete.'],
    ['F', 'Recent years have seen the end of the virtual monopoly of cork as the material for bottle stoppers, due to concerns about the effect it may have on the contents of the bottle. This is caused by a chemical compound called 2,4,6-trichloroanisole (TCA), which forms through the interaction of plant phenols, chlorine and mould. The tiniest concentrations – as little as three or four parts to a trillion – can spoil the taste of the product contained in the bottle. The result has been a gradual yet steady move first towards plastic stoppers and, more recently, to aluminium screw caps. These substitutes are cheaper to manufacture and, in the case of screw caps, more convenient for the user.'],
    ['G', 'The classic cork stopper does have several advantages, however. Firstly, its traditional image is more in keeping with that of the type of high quality goods with which it has long been associated. Secondly – and very importantly – cork is a sustainable product that can be recycled without difficulty. Moreover, cork forests are a resource which support local biodiversity, and prevent desertification in the regions where they are planted. So, given the current concerns about environmental issues, the future of this ancient material once again looks promising.']
  ],
  tfng: tfng([
    q('The cork oak has the thickest bark of any living tree.', 'NOT GIVEN', 'Its bark grows up to 20 cm in thickness', { passageKeyword: 'grows up to 20 cm in thickness', questionKeyword: 'thickest bark of any living tree', thaiMeaning: 'ไม่ได้เปรียบเทียบว่าหนาที่สุด' }),
    q('Scientists have developed a synthetic cork with the same cellular structure as natural cork.', 'FALSE', 'technology has never succeeded in replicating', { passageKeyword: 'never succeeded in replicating', questionKeyword: 'synthetic cork with same cellular structure', thaiMeaning: 'เทคโนโลยียังเลียนแบบไม่สำเร็จ' }),
    q('Individual cork oak trees must be left for 25 years between the first and second harvest.', 'FALSE', 'From the planting of a cork sapling to the first harvest takes 25 years, and a gap of approximately a decade must separate harvests from an individual tree.', { passageKeyword: 'gap of approximately a decade', questionKeyword: '25 years between first and second harvest', thaiMeaning: '25 ปีคือจากปลูกถึงเก็บครั้งแรก ไม่ใช่ระหว่างเก็บครั้งแรกกับครั้งที่สอง' }),
    q('Cork bark should be stripped in dry atmospheric conditions.', 'TRUE', 'If the bark is stripped on a day when it\'s too cold – or when the air is damp – the tree will be damaged.', { passageKeyword: 'when the air is damp', questionKeyword: 'dry atmospheric conditions', thaiMeaning: 'อากาศชื้นจะทำร้ายต้นไม้ จึงควรลอกในสภาพแห้ง' }),
    q('The only way to remove the bark from cork oak trees is by hand.', 'TRUE', 'No mechanical means of stripping cork bark has been invented, so the job is done by teams of highly skilled workers.', { passageKeyword: 'No mechanical means', questionKeyword: 'only way … by hand', thaiMeaning: 'ไม่มีเครื่องจักร ต้องใช้คนงาน' })
  ]),
  fill: fillNotes('Comparison of aluminium screw caps and cork bottle stoppers', [
    q('Advantages of aluminium screw caps — do not affect the … of the bottle contents', 'taste', 'can spoil the taste of the product contained in the bottle', { passageKeyword: 'spoil the taste', questionKeyword: 'do not affect the taste', thaiMeaning: 'รสชาติ' }),
    q('Advantages of aluminium screw caps — are … to produce', 'cheaper', 'These substitutes are cheaper to manufacture', { passageKeyword: 'cheaper to manufacture', questionKeyword: 'cheaper to produce', thaiMeaning: 'ถูกกว่า' }),
    q('Advantages of aluminium screw caps — are … to use', 'convenient', 'in the case of screw caps, more convenient for the user', { passageKeyword: 'more convenient for the user', questionKeyword: 'convenient to use', thaiMeaning: 'สะดวก' }),
    q('Advantages of cork bottle stoppers — suit the … of quality products', 'image', 'its traditional image is more in keeping with that of the type of high quality goods', { passageKeyword: 'traditional image', questionKeyword: 'image of quality products', thaiMeaning: 'ภาพลักษณ์' }),
    q('Advantages of cork bottle stoppers — made from a … material', 'sustainable', 'cork is a sustainable product that can be recycled without difficulty', { passageKeyword: 'sustainable product', questionKeyword: 'sustainable material', thaiMeaning: 'ยั่งยืน' }),
    q('Advantages of cork bottle stoppers — easily …', 'recycled', 'can be recycled without difficulty', { passageKeyword: 'recycled without difficulty', questionKeyword: 'easily recycled', thaiMeaning: 'รีไซเคิล' }),
    q('Advantages of cork bottle stoppers — cork forests aid …', 'biodiversity', 'cork forests are a resource which support local biodiversity', { passageKeyword: 'support local biodiversity', questionKeyword: 'aid biodiversity', thaiMeaning: 'ความหลากหลายทางชีวภาพ' }),
    q('Advantages of cork bottle stoppers — cork forests stop … happening', 'desertification', 'prevent desertification in the regions where they are planted', { passageKeyword: 'prevent desertification', questionKeyword: 'stop desertification', thaiMeaning: 'การกลายเป็นทะเลทราย' })
  ])
}

const stage1Passage2: IntensivePassageLayout = {
  title: 'Collecting as a Hobby',
  sectionOrder: [...P2_FILL_TFNG_ORDER],
  paragraphs: [
    ['A', 'Collecting must be one of the most varied of human activities, and it\'s one that many of us psychologists find fascinating. Many forms of collecting have been dignified with a technical name: an arctophilist collects teddy bears, a philatelist collects postage stamps, and a deltiologist collects postcards. Amassing hundreds or even thousands of postcards, chocolate wrappers or whatever, takes time, energy and money that could surely be put to much more productive use. And yet there are millions of collectors around the world. Why do they do it?'],
    ['B', 'There are the people who collect because they want to make money – this could be called an instrumental reason for collecting; that is, collecting as a means to an end. They\'ll look for, say, antiques that they can buy cheaply and expect to be able to sell at a profit. But there may well be a psychological element, too – buying cheap and selling dear can give the collector a sense of triumph. And as selling online is so easy, more and more people are joining in.'],
    ['C', 'Many collectors collect to develop their social life, attending meetings of a group of collectors and exchanging information on items. This is a variant on joining a bridge club or a gym, and similarly brings them into contact with like-minded people.'],
    ['D', 'Another motive for collecting is the desire to find something special, or a particular example of the collected item, such as a rare early recording by a particular singer. Some may spend their whole lives in a hunt for this. Psychologically, this can give a purpose to a life that otherwise feels aimless. There is a danger, though, that if the individual is ever lucky enough to find what they\'re looking for, rather than celebrating their success, they may feel empty, now that the goal that drove them on has gone.'],
    ['E', 'If you think about collecting postage stamps, another potential reason for it – or, perhaps, a result of collecting – is its educational value. Stamp collecting opens a window to other countries, and to the plants, animals, or famous people shown on their stamps. Similarly, in the 19th century, many collectors amassed fossils, animals and plants from around the globe, and their collections provided a vast amount of information about the natural world. Without those collections, our understanding would be greatly inferior to what it is.'],
    ['F', 'In the past – and nowadays, too, though to a lesser extent – a popular form of collecting, particularly among boys and men, was trainspotting. This might involve trying to see every locomotive of a particular type, using published data that identifies each one, and ticking off each engine as it is seen. Trainspotters exchange information, these days often by mobile phone, so they can work out where to go to, to see a particular engine. As a by-product, many practitioners of the hobby become very knowledgeable about railway operations, or the technical specifications of different engine types.'],
    ['G', 'Similarly, people who collect dolls may go beyond simply enlarging their collection, and develop an interest in the way that dolls are made, or the materials that are used. These have changed over the centuries from the wood that was standard in 16th century Europe, through the wax and porcelain of later centuries, to the plastics of today\'s dolls. Or collectors might be inspired to study how dolls reflect notions of what children like, or ought to like.'],
    ['H', 'Not all collectors are interested in learning from their hobby, though, so what we might call a psychological reason for collecting is the need for a sense of control, perhaps as a way of dealing with insecurity. Stamp collectors, for instance, arrange their stamps in albums, usually very neatly, organising their collection according to certain commonplace principles – perhaps by country in alphabetical order, or grouping stamps by what they depict – people, birds, maps, and so on.'],
    ['I', 'One reason, conscious or not, for what someone chooses to collect is to show the collector\'s individualism. Someone who decides to collect something as unexpected as dog collars, for instance, may be conveying their belief that they must be interesting themselves. And believe it or not, there is at least one dog collar museum in existence, and it grew out of a personal collection.'],
    ['J', 'Of course, all hobbies give pleasure, but the common factor in collecting is usually passion: pleasure is putting it far too mildly. More than most other hobbies, collecting can be totally engrossing, and can give a strong sense of personal fulfilment. To non-collectors it may appear an eccentric, if harmless, way of spending time, but potentially, collecting has a lot going for it.']
  ],
  fill: fillSentences([
    q('The writer mentions … as an example of collecting in order to make money.', 'antiques', 'They\'ll look for, say, antiques that they can buy cheaply and expect to be able to sell at a profit.', { passageKeyword: 'antiques', questionKeyword: 'collecting to make money', thaiMeaning: 'ของโบราณ' }),
    q('Collectors may get a feeling of … from buying and selling items.', 'triumph', 'buying cheap and selling dear can give the collector a sense of triumph', { passageKeyword: 'sense of triumph', questionKeyword: 'feeling of triumph', thaiMeaning: 'ชัยชนะ' }),
    q('Collectors\' clubs provide opportunities to share …', 'information', 'attending meetings of a group of collectors and exchanging information on items', { passageKeyword: 'exchanging information', questionKeyword: 'share information', thaiMeaning: 'ข้อมูล' }),
    q('Collectors\' clubs offer … with people who have similar interests.', 'contact', 'similarly brings them into contact with like-minded people', { passageKeyword: 'contact with like-minded people', questionKeyword: 'offer contact', thaiMeaning: 'ติดต่อ/พบปะ', acceptedAnswers: ['meetings'] }),
    q('Collecting sometimes involves a life-long … for a special item.', 'hunt', 'Some may spend their whole lives in a hunt for this', { passageKeyword: 'whole lives in a hunt', questionKeyword: 'life-long hunt', thaiMeaning: 'การล่าหา', acceptedAnswers: ['desire'] }),
    q('Searching for something particular may prevent people from feeling their life is completely …', 'aimless', 'this can give a purpose to a life that otherwise feels aimless', { passageKeyword: 'otherwise feels aimless', questionKeyword: 'life is completely aimless', thaiMeaning: 'ไร้จุดหมาย', acceptedAnswers: ['empty'] }),
    q('Stamp collecting may be … because it provides facts about different countries.', 'educational', 'another potential reason for it – or, perhaps, a result of collecting – is its educational value', { passageKeyword: 'educational value', questionKeyword: 'may be educational', thaiMeaning: 'การศึกษา' }),
    q('… tends to be mostly a male hobby.', 'trainspotting', 'a popular form of collecting, particularly among boys and men, was trainspotting', { passageKeyword: 'trainspotting', questionKeyword: 'mostly a male hobby', thaiMeaning: 'trainspotting' })
  ]),
  tfng: tfngP2([
    q('The number of people buying dolls has grown over the centuries.', 'NOT GIVEN', 'Similarly, people who collect dolls may go beyond simply enlarging their collection', { passageKeyword: 'collect dolls', questionKeyword: 'number buying dolls', thaiMeaning: 'ไม่ได้บอกจำนวนผู้ซื้อ' }),
    q('Sixteenth century European dolls were normally made of wax and porcelain.', 'FALSE', 'from the wood that was standard in 16th century Europe, through the wax and porcelain of later centuries', { passageKeyword: 'wood in 16th century Europe', questionKeyword: 'wax and porcelain in 16th century', thaiMeaning: 'ศตวรรษที่ 16 ใช้ไม้' }),
    q('Arranging a stamp collection by the size of the stamps is less common than other methods.', 'NOT GIVEN', 'organising their collection according to certain commonplace principles – perhaps by country in alphabetical order, or grouping stamps by what they depict', { passageKeyword: 'by country or by what they depict', questionKeyword: 'by size less common', thaiMeaning: 'ไม่ได้เปรียบเทียบการจัดตามขนาด' }),
    q('Someone who collects unusual objects may want others to think he or she is also unusual.', 'TRUE', 'Someone who decides to collect something as unexpected as dog collars, for instance, may be conveying their belief that they must be interesting themselves', { passageKeyword: 'unexpected as dog collars', questionKeyword: 'want others to think unusual', thaiMeaning: 'สะสมของแปลกเพื่อแสดงว่าตนน่าสนใจ' }),
    q('Collecting gives a feeling that other hobbies are unlikely to inspire.', 'TRUE', 'More than most other hobbies, collecting can be totally engrossing, and can give a strong sense of personal fulfilment', { passageKeyword: 'strong sense of personal fulfilment', questionKeyword: 'feeling other hobbies unlikely to inspire', thaiMeaning: 'ความสำเร็จทางใจมากกว่างานอดิเรกอื่น' })
  ])
}

const P2_HEADINGS_TFNG_FILL = ['headings', 'tfng', 'fill'] as const

const matchingInfoAI = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Reading Passage 1 has nine paragraphs, A–I. Which paragraph contains the following information? Write the correct letter, A–I.',
  items
})

const agriculturePeople = [
  'A Kanayo F. Nwanze',
  'B Sophia Murphy',
  'C Shenggen Fan',
  'D Rokeya Kabir',
  'E Pat Mooney',
  'F Giel Ton',
  'G Sonali Bisht'
]

const matchingPeopleBlock = (people: string[], items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Look at the following statements and the list of people below. Match each statement with the correct person, A–G. You may use any letter more than once.',
  people,
  items
})

const chooseTwoProblems = [
  'A lack of demand for locally produced food',
  'B lack of irrigation programmes',
  'C being unable to get insurance',
  'D the effects of changing weather patterns',
  'E having to sell their goods to intermediary buyers'
]

const chooseTwoActions = [
  'A reducing the size of food stocks',
  'B attempting to ensure that prices rise at certain times of the year',
  'C organising co-operation between a wide range of interested parties',
  'D encouraging consumers to take a financial stake in farming',
  'E making customers aware of the reasons for changing food prices'
]

const P1_CAM12_T2_ORDER = ['matchingInfo', 'matchingPeople', 'mcq'] as const

// ─── Stage 2: Cambridge 12 Test 2 — Agriculture Risks + The Lost City ─────────

const stage2Passage1: IntensivePassageLayout = {
  title: 'The Risks Agriculture Faces in Developing Countries',
  sectionOrder: [...P1_CAM12_T2_ORDER],
  paragraphs: [
    ['A', 'Two things distinguish food production from all other productive activities: first, every single person needs food each day and has a right to it; and second, it is hugely dependent on nature. These two unique aspects, one political, the other natural, make food production highly vulnerable and different from any other business. At the same time, cultural values are highly entrenched in food and agricultural systems worldwide.'],
    ['B', 'Farmers everywhere face major risks, including extreme weather, long-term climate change, and price volatility in input and product markets. However, smallholder farmers in developing countries must in addition deal with adverse environments, both natural, in terms of soil quality, rainfall, etc., and human, in terms of infrastructure, financial systems, markets, knowledge and technology. Counter-intuitively, hunger is prevalent among many smallholder farmers in the developing world.'],
    ['C', 'Participants in the online debate argued that our biggest challenge is to address the underlying causes of the agricultural system\'s inability to ensure sufficient food for all, and they identified as drivers of this problem our dependency on fossil fuels and unsupportive government policies.'],
    ['D', 'On the question of mitigating the risks farmers face, most essayists called for greater state intervention. In his essay, Kanayo F. Nwanze, President of the International Fund for Agricultural Development, argued that governments can significantly reduce risks for farmers by providing basic services like roads to get produce more efficiently to markets, or water and food storage facilities to reduce losses. Sophia Murphy, senior advisor to the Institute for Agriculture and Trade Policy, suggested that the procurement and holding of stocks by governments can also help mitigate wild swings in food prices by alleviating uncertainties about market supply.'],
    ['E', 'Shenggen Fan, Director General of the International Food Policy Research Institute, held up social safety nets and public welfare programmes in Ethiopia, Brazil and Mexico as valuable ways to address poverty among farming families and reduce their vulnerability to agriculture shocks. However, some commentators responded that cash transfers to poor families do not necessarily translate into increased food security, as these programmes do not always strengthen food production or raise incomes. Regarding state subsidies for agriculture, Rokeya Kabir, Executive Director of Bangladesh Nari Progati Sangha, commented in her essay that these \'have not compensated for the stranglehold exercised by private traders. In fact, studies show that sixty percent of beneficiaries of subsidies are not poor, but rich landowners and non-farmer traders.\''],
    ['F', 'Nwanze, Murphy and Fan argued that private risk management tools, like private insurance, commodity futures markets, and rural finance can help small-scale producers mitigate risk and allow for investment in improvements. Kabir warned that financial support schemes often encourage the adoption of high-input agricultural practices, which in the medium term may raise production costs beyond the value of their harvests. Murphy noted that when futures markets become excessively financialised they can contribute to short-term price volatility, which increases farmers\' food insecurity. Many participants and commentators emphasised that greater transparency in markets is needed to mitigate the impact of volatility, and make evident whether adequate stocks and supplies are available. Others contended that agribusiness companies should be held responsible for paying for negative side effects.'],
    ['G', 'Many essayists mentioned climate change and its consequences for small-scale agriculture. Fan explained that \'in addition to reducing crop yields, climate change increases the magnitude and frequency of extreme weather events, which increase smallholder vulnerability.\' The growing unpredictability of weather patterns increases farmers\' difficulty in managing weather-related risks. According to this author, one solution would be to develop crop varieties that are more resilient to new climate trends and extreme weather patterns. Accordingly, Pat Mooney, co-founder and executive director of the ETC Group, suggested that \'if we are to survive climate change, we must adopt policies that let peasants diversify the plant and animal species and varieties/breeds that make up our menus.\''],
    ['H', 'Some participating authors and commentators argued in favour of community-based and autonomous risk management strategies through collective action groups, co-operatives or producers\' groups. Such groups enhance market opportunities for small-scale producers, reduce marketing costs and synchronise buying and selling with seasonal price conditions. According to Murphy, \'collective action offers an important way for farmers to strengthen their political and economic bargaining power, and to reduce their business risks.\' One commentator, Giel Ton, warned that collective action does not come as a free good. It takes time, effort and money to organise, build trust and to experiment. Others, like Marcel Vernooij and Marcel Beukeboom, suggested that in order to \'apply what we already know\', all stakeholders, including business, government, scientists and civil society, must work together, starting at the beginning of the value chain.'],
    ['I', 'Some participants explained that market price volatility is often worsened by the presence of intermediary purchasers who, taking advantage of farmers\' vulnerability, dictate prices. One commentator suggested farmers can gain greater control over prices and minimise price volatility by selling directly to consumers. Similarly, Sonali Bisht, founder and advisor to the Institute of Himalayan Environmental Research and Education (INHERE), India, wrote that community-supported agriculture, where consumers invest in local farmers by subscription and guarantee producers a fair price, is a risk-sharing model worth more attention. Direct food distribution systems not only encourage small-scale agriculture but also give consumers more control over the food they consume, she wrote.']
  ],
  matchingInfo: matchingInfoAI([
    q('A reference to characteristics that only apply to food production', 'A', 'Two things distinguish food production from all other productive activities', { passageKeyword: 'distinguish food production from all other', questionKeyword: 'characteristics only apply to food production', thaiMeaning: 'ลักษณะเฉพาะของการผลิตอาหาร' }),
    q('A reference to challenges faced only by farmers in certain parts of the world', 'B', 'smallholder farmers in developing countries must in addition deal with adverse environments', { passageKeyword: 'smallholder farmers in developing countries', questionKeyword: 'challenges only in certain parts of the world', thaiMeaning: 'ความท้าทายเฉพาะเกษตรกรในประเทศกำลังพัฒนา' }),
    q('A reference to difficulties in bringing about co-operation between farmers', 'H', 'collective action does not come as a free good. It takes time, effort and money to organise, build trust and to experiment', { passageKeyword: 'collective action does not come as a free good', questionKeyword: 'difficulties in co-operation between farmers', thaiMeaning: 'ความยากในการสร้างความร่วมมือ' })
  ]),
  matchingPeople: matchingPeopleBlock(agriculturePeople, [
    q('Financial assistance from the government does not always go to the farmers who most need it.', 'D', 'sixty percent of beneficiaries of subsidies are not poor, but rich landowners and non-farmer traders', { passageKeyword: 'subsidies are not poor', questionKeyword: 'assistance does not go to those who need it', thaiMeaning: 'อุดหนุนไม่ไปหาคนจน' }),
    q('Farmers can benefit from collaborating as a group.', 'B', 'collective action offers an important way for farmers to strengthen their political and economic bargaining power', { passageKeyword: 'collective action offers an important way', questionKeyword: 'benefit from collaborating as a group', thaiMeaning: 'ได้ประโยชน์จากการร่วมมือกลุ่ม' }),
    q('Financial assistance from the government can improve the standard of living of farmers.', 'C', 'social safety nets and public welfare programmes in Ethiopia, Brazil and Mexico as valuable ways to address poverty among farming families', { passageKeyword: 'address poverty among farming families', questionKeyword: 'improve standard of living', thaiMeaning: 'ช่วยยกระดับชีวิตเกษตรกร' }),
    q('Farmers may be helped if there is financial input by the same individuals who buy from them.', 'G', 'community-supported agriculture, where consumers invest in local farmers by subscription', { passageKeyword: 'consumers invest in local farmers by subscription', questionKeyword: 'financial input by buyers', thaiMeaning: 'ผู้ซื้อลงทุนกับเกษตรกร' }),
    q('Governments can help to reduce variation in prices.', 'B', 'the procurement and holding of stocks by governments can also help mitigate wild swings in food prices', { passageKeyword: 'mitigate wild swings in food prices', questionKeyword: 'reduce variation in prices', thaiMeaning: 'ลดความผันผวนราคา' }),
    q('Improvements to infrastructure can have a major impact on risk for farmers.', 'A', 'governments can significantly reduce risks for farmers by providing basic services like roads', { passageKeyword: 'basic services like roads', questionKeyword: 'infrastructure reduces risk', thaiMeaning: 'โครงสร้างพื้นฐานลดความเสี่ยง' })
  ]),
  mcq: {
    instruction: 'Choose TWO letters, A–E, for each question.',
    options: [
      'Questions 10–11',
      ...chooseTwoProblems,
      'Questions 12–13',
      ...chooseTwoActions
    ],
    items: [
      q('Which TWO problems are mentioned which affect farmers with small farms in developing countries? (first answer)', 'D', 'climate change increases the magnitude and frequency of extreme weather events, which increase smallholder vulnerability', { passageKeyword: 'extreme weather events', questionKeyword: 'changing weather patterns', thaiMeaning: 'สภาพอากาศเปลี่ยนแปลง' }),
      q('Which TWO problems are mentioned which affect farmers with small farms in developing countries? (second answer)', 'E', 'intermediary purchasers who, taking advantage of farmers\' vulnerability, dictate prices', { passageKeyword: 'intermediary purchasers who dictate prices', questionKeyword: 'sell goods to intermediary buyers', thaiMeaning: 'ต้องขายให้คนกลาง' }),
      q('Which TWO actions are recommended for improving conditions for farmers? (first answer)', 'C', 'all stakeholders, including business, government, scientists and civil society, must work together', { passageKeyword: 'all stakeholders must work together', questionKeyword: 'organising co-operation between interested parties', thaiMeaning: 'ให้ทุกฝ่ายร่วมมือกัน' }),
      q('Which TWO actions are recommended for improving conditions for farmers? (second answer)', 'D', 'community-supported agriculture, where consumers invest in local farmers by subscription', { passageKeyword: 'consumers invest in local farmers by subscription', questionKeyword: 'financial stake in farming', thaiMeaning: 'ให้ผู้บริโภคลงทุนกับเกษตรกร' })
    ]
  }
}

const lostCityHeadings = [
  'Different accounts of the same journey',
  'Bingham gains support',
  'A common belief',
  'The aim of the trip',
  'A dramatic description',
  'A new route',
  'Bingham publishes his theory',
  'Bingham\'s lack of enthusiasm'
]

const stage2Passage2: IntensivePassageLayout = {
  title: 'The Lost City',
  sectionOrder: [...P2_HEADINGS_TFNG_FILL],
  paragraphs: [
    ['A', 'When the US explorer and academic Hiram Bingham arrived in South America in 1911, he was ready for what was to be the greatest achievement of his life: the exploration of the remote hinterland to the west of Cusco, the old capital of the Inca empire in the Andes mountains of Peru. His goal was to locate the remains of a city called Vitcos, the last capital of the Inca civilisation. Cusco lies on a high plateau at an elevation of more than 3,000 metres, and Bingham\'s plan was to descend from this plateau along the valley of the Urubamba river, which takes a circuitous route down to the Amazon and passes through an area of dramatic canyons and mountain ranges.'],
    ['B', 'When Bingham and his team set off down the Urubamba in late July, they had an advantage over travelers who had preceded them: a track had recently been blasted down the valley canyon to enable rubber to be brought up by mules from the jungle. Almost all previous travelers had left the river at Ollantaytambo and taken a high pass across the mountains to rejoin the river lower down, thereby cutting a substantial corner, but also therefore never passing through the area around Machu Picchu.'],
    ['C', 'On 24 July they were a few days into their descent of the valley. The day began slowly, with Bingham trying to arrange sufficient mules for the next stage of the trek. His companions showed no interest in accompanying him up the nearby hill to see some ruins that a local farmer, Melchor Arteaga, had told them about the night before. The morning was dull and damp, and Bingham also seems to have been less than keen on the prospect of climbing the hill. In his book Lost City of the Incas, he relates that he made the ascent without having the least expectation that he would find anything at the top.'],
    ['D', 'Bingham writes about the approach in vivid style in his book. First, as he climbs up the hill, he describes the ever-present possibility of deadly snakes, \'capable of making considerable springs when in pursuit of their prey\'; not that he sees any. Then there\'s a sense of mounting discovery as he comes across great sweeps of terraces, then a mausoleum, followed by monumental staircases and, finally, the grand ceremonial buildings of Machu Picchu. \'It seemed like an unbelievable dream … the sight held me spellbound …\' he wrote.'],
    ['E', 'We should remember, however, that Lost City of the Incas is a work of hindsight, not written until 1948, many years after his journey. His journal entries of the time reveal a much more gradual appreciation of his achievement. He spent the afternoon at the ruins noting down the dimensions of some of the buildings, then descended and rejoined his companions, to whom he seems to have said little about his discovery. At this stage, Bingham didn\'t realise the extent or the importance of the site, nor did he realise what use he could make of the discovery.'],
    ['F', 'However, soon after returning it occurred to him that he could make a name for himself from this discovery. When he came to write the National Geographic magazine article that broke the story to the world in April 1913, he knew he had to produce a big idea. He wondered whether it could have been the birthplace of the very first Inca, Manco the Great, and whether it could also have been what chroniclers described as \'the last city of the Incas\'. This term refers to Vilcabamba, the settlement where the Incas had fled from Spanish invaders in the 1530s. Bingham made desperate attempts to prove this belief for nearly 40 years. Sadly, his vision of the site as both the beginning and end of the Inca civilisation, while a magnificent one, is inaccurate. We now know that Vilcabamba actually lies 65 kilometres away in the depths of the jungle.'],
    ['G', 'One question that has perplexed visitors, historians and archaeologists alike ever since Bingham, is why the site seems to have been abandoned before the Spanish Conquest. There are no references to it by any of the Spanish chroniclers – and if they had known of its existence so close to Cusco they would certainly have come in search of gold. An idea which has gained wide acceptance over the past few years is that Machu Picchu was a royal estate, a country estate built by an Inca emperor to escape the cold winters of Cusco, where the elite could enjoy monumental architecture and spectacular views. Furthermore, the particular architecture of Machu Picchu suggests that it was constructed at the time of the greatest of all the Incas, the emperor Pachacuti (c. 1438–71). By custom, Pachacuti\'s descendants built other similar estates for their own use, and so Machu Picchu would have been abandoned after his death, some 50 years before the Spanish Conquest.']
  ],
  headings: {
    instruction: 'Reading Passage 2 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list below. Write the correct number, i–viii.',
    options: lostCityHeadings,
    items: [
      q('Paragraph A', 'iv', 'His goal was to locate the remains of a city called Vitcos', { passageKeyword: 'goal was to locate Vitcos', questionKeyword: 'The aim of the trip', thaiMeaning: 'เป้าหมายการเดินทาง' }),
      q('Paragraph B', 'vi', 'a track had recently been blasted down the valley canyon', { passageKeyword: 'track recently blasted down the valley', questionKeyword: 'A new route', thaiMeaning: 'เส้นทางใหม่' }),
      q('Paragraph C', 'viii', 'Bingham also seems to have been less than keen on the prospect of climbing the hill', { passageKeyword: 'less than keen on climbing', questionKeyword: 'Bingham\'s lack of enthusiasm', thaiMeaning: 'ขาดความกระตือรือร้น' }),
      q('Paragraph D', 'v', 'Bingham writes about the approach in vivid style in his book', { passageKeyword: 'vivid style', questionKeyword: 'A dramatic description', thaiMeaning: 'บรรยายอย่างตื่นเต้น' }),
      q('Paragraph E', 'i', 'His journal entries of the time reveal a much more gradual appreciation of his achievement', { passageKeyword: 'journal entries vs book', questionKeyword: 'Different accounts of the same journey', thaiMeaning: 'บันทึกกับหนังสือเล่าไม่เหมือนกัน' }),
      q('Paragraph F', 'vii', 'When he came to write the National Geographic magazine article that broke the story to the world in April 1913, he knew he had to produce a big idea', { passageKeyword: 'National Geographic article', questionKeyword: 'Bingham publishes his theory', thaiMeaning: 'ตีพิมพ์ทฤษฎี' }),
      q('Paragraph G', 'iii', 'An idea which has gained wide acceptance over the past few years is that Machu Picchu was a royal estate', { passageKeyword: 'gained wide acceptance', questionKeyword: 'A common belief', thaiMeaning: 'ความเชื่อที่ยอมรับกว้าง' })
    ]
  },
  tfng: tfngP2([
    q('Bingham went to South America in search of an Inca city.', 'TRUE', 'His goal was to locate the remains of a city called Vitcos, the last capital of the Inca civilisation', { passageKeyword: 'goal to locate Vitcos', questionKeyword: 'search for an Inca city', thaiMeaning: 'ไปหาเมืองอินคา' }),
    q('Bingham chose a particular route down the Urubamba valley because it was the most common route used by travellers.', 'FALSE', 'Almost all previous travelers had left the river at Ollantaytambo and taken a high pass across the mountains', { passageKeyword: 'advantage over travelers who had preceded them', questionKeyword: 'most common route', thaiMeaning: 'ไม่ใช่เส้นทางที่คนส่วนใหญ่ใช้' }),
    q('Bingham understood the significance of Machu Picchu as soon as he saw it.', 'FALSE', 'At this stage, Bingham didn\'t realise the extent or the importance of the site', { passageKeyword: 'didn\'t realise the extent or the importance', questionKeyword: 'understood significance as soon as he saw it', thaiMeaning: 'ยังไม่เข้าใจความสำคัญทันที' }),
    q('Bingham returned to Machu Picchu in order to find evidence to support his theory.', 'NOT GIVEN', 'Bingham made desperate attempts to prove this belief for nearly 40 years', { passageKeyword: 'attempts to prove this belief', questionKeyword: 'returned to find evidence', thaiMeaning: 'ไม่ได้บอกว่ากลับไปที่ซาก' })
  ]),
  fill: fillSentences([
    q('The track that took Bingham down the Urubamba valley had been created for the transportation of …', 'rubber', 'a track had recently been blasted down the valley canyon to enable rubber to be brought up by mules from the jungle', { passageKeyword: 'rubber to be brought up by mules', questionKeyword: 'transportation of rubber', thaiMeaning: 'ยาง' }),
    q('Bingham found out about the ruins of Machu Picchu from a … in the Urubamba valley.', 'farmer', 'some ruins that a local farmer, Melchor Arteaga, had told them about the night before', { passageKeyword: 'local farmer, Melchor Arteaga', questionKeyword: 'found out from a farmer', thaiMeaning: 'ชาวนา' })
  ])
}

const matchingInfoAH = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Reading Passage 2 has eight paragraphs, A–H. Which paragraph contains the following information? Write the correct letter, A–H. You may use any letter more than once.',
  items
})

const P1_HEADINGS_FILL = ['headings', 'fill'] as const
const P2_MATCH_FILL = ['matchingInfo', 'fill'] as const

// ─── Stage 3: Cambridge 12 Test 3 — Flying Tortoises + Health Geography ───────

const tortoiseHeadings = [
  'The importance of getting the timing right',
  'Young meets old',
  'Developments to the disadvantage of tortoise populations',
  'Planning a bigger idea',
  'Tortoises populate the islands',
  'Carrying out a carefully prepared operation',
  'Looking for a home for the islands\' tortoises',
  'The start of the conservation project'
]

const stage3Passage1: IntensivePassageLayout = {
  title: 'Flying Tortoises',
  sectionOrder: [...P1_HEADINGS_FILL],
  paragraphs: [
    ['A', 'Forests of spiny cacti cover much of the uneven lava plains that separate the interior of the Galápagos island of Isabela from the Pacific Ocean. With its five distinct volcanoes, the island resembles a lunar landscape. Only the thick vegetation at the skirt of the often cloud-covered peak of Sierra Negra offers respite from the barren terrain below. This inhospitable environment is home to the giant Galápagos tortoise. Some time after the Galápagos\'s birth, around five million years ago, the islands were colonised by one or more tortoises from mainland South America. As these ancestral tortoises settled on the individual islands, the different populations adapted to their unique environments, giving rise to at least 14 different subspecies. Island life agreed with them. In the absence of significant predators, they grew to become the largest and longest-living tortoises on the planet, weighing more than 400 kilograms, occasionally exceeding 1.8 metres in length and living for more than a century.'],
    ['B', 'Before human arrival, the archipelago\'s tortoises numbered in the hundreds of thousands. From the 17th century onwards, pirates took a few on board for food, but the arrival of whaling ships in the 1790s saw this exploitation grow exponentially. Relatively immobile and capable of surviving for months without food or water, the tortoises were taken on board these ships to act as food supplies during long ocean passages. Sometimes, their bodies were processed into high-grade oil. In total, an estimated 200,000 animals were taken from the archipelago before the 20th century. This historical exploitation was then exacerbated when settlers came to the islands. They hunted the tortoises and destroyed their habitat to clear land for agriculture. They also introduced alien species – ranging from cattle, pigs, goats, rats and dogs to plants and ants – that either prey on the eggs and young tortoises or damage or destroy their habitat.'],
    ['C', 'Today, only 11 of the original subspecies survive and of these, several are highly endangered. In 1989, work began on a tortoise-breeding centre just outside the town of Puerto Villamil on Isabela, dedicated to protecting the island\'s tortoise populations. The centre\'s captive-breeding programme proved to be extremely successful, and it eventually had to deal with an overpopulation problem.'],
    ['D', 'The problem was also a pressing one. Captive-bred tortoises can\'t be reintroduced into the wild until they\'re at least five years old and weigh at least 4.5 kilograms, at which point their size and weight – and their hardened shells – are sufficient to protect them from predators. But if people wait too long after that point, the tortoises eventually become too large to transport.'],
    ['E', 'For years, repatriation efforts were carried out in small numbers, with the tortoises carried on the backs of men over weeks of long, treacherous hikes along narrow trails. But in November 2010, the environmentalist and Galápagos National Park liaison officer Godfrey Merlin, a visiting private motor yacht captain and a helicopter pilot gathered around a table in a small café in Puerto Ayora on the island of Santa Cruz to work out more ambitious reintroduction. The aim was to use a helicopter to move 300 of the breeding centre\'s tortoises to various locations close to Sierra Negra.'],
    ['F', 'This unprecedented effort was made possible by the owners of the 67-metre yacht White Cloud, who provided the Galápagos National Park with free use of their helicopter and its experienced pilot, as well as the logistical support of the yacht, its captain and crew. Originally an air ambulance, the yacht\'s helicopter has a rear double door and a large internal space that\'s well suited for cargo, so a custom crate was designed to hold up to 33 tortoises with a total weight of about 150 kilograms. This weight, together with that of the fuel, pilot and four crew, approached the helicopter\'s maximum payload, and there were times when it was clearly right on the edge of the helicopter\'s capabilities. During a period of three days, a group of volunteers from the breeding centre worked around the clock to prepare the young tortoises for transport. Meanwhile, park wardens, dropped off ahead of time in remote locations, cleared landing sites within the thick brush, cacti and lava rocks.'],
    ['G', 'Upon their release, the juvenile tortoises quickly spread out over their ancestral territory, investigating their new surroundings and feeding on the vegetation. Eventually, one tiny tortoise came across a fully grown giant who had been lumbering around the island for around a hundred years. The two stood side by side, a powerful symbol of the regeneration of an ancient species.']
  ],
  headings: {
    instruction: 'Reading Passage 1 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list below. Write the correct number, i–viii.',
    options: tortoiseHeadings,
    items: [
      q('Paragraph A', 'v', 'the islands were colonised by one or more tortoises from mainland South America', { passageKeyword: 'colonised by tortoises', questionKeyword: 'Tortoises populate the islands', thaiMeaning: 'เต่าเข้ามาอาศัยเกาะ' }),
      q('Paragraph B', 'iii', 'From the 17th century onwards, pirates took a few on board for food', { passageKeyword: 'exploitation grow exponentially', questionKeyword: 'disadvantage of tortoise populations', thaiMeaning: 'การล่าและทำลายประชากร' }),
      q('Paragraph C', 'viii', 'In 1989, work began on a tortoise-breeding centre', { passageKeyword: 'tortoise-breeding centre', questionKeyword: 'start of the conservation project', thaiMeaning: 'เริ่มโครงการอนุรักษ์' }),
      q('Paragraph D', 'i', 'Captive-bred tortoises can\'t be reintroduced into the wild until they\'re at least five years old', { passageKeyword: 'at least five years old', questionKeyword: 'importance of getting the timing right', thaiMeaning: 'ต้องรอให้ถึงอายุที่ปลอดภัย' }),
      q('Paragraph E', 'iv', 'work out more ambitious reintroduction', { passageKeyword: 'more ambitious reintroduction', questionKeyword: 'Planning a bigger idea', thaiMeaning: 'วางแผนย้ายครั้งใหญ่' }),
      q('Paragraph F', 'vi', 'During a period of three days, a group of volunteers from the breeding centre worked around the clock to prepare the young tortoises for transport', { passageKeyword: 'worked around the clock to prepare', questionKeyword: 'carefully prepared operation', thaiMeaning: 'ดำเนินการอย่างพิถีพิถัน' }),
      q('Paragraph G', 'ii', 'one tiny tortoise came across a fully grown giant', { passageKeyword: 'tiny tortoise came across a fully grown giant', questionKeyword: 'Young meets old', thaiMeaning: 'เจอเต่าตัวใหญ่' })
    ]
  },
  fill: fillNotes('The decline of the Galápagos tortoise', [
    q('17th century: small numbers taken onto ships used by …', 'pirates', 'From the 17th century onwards, pirates took a few on board for food', { passageKeyword: 'pirates took a few on board', questionKeyword: 'ships used by pirates', thaiMeaning: 'โจรสลัด' }),
    q('1790s: very large numbers taken onto whaling ships, kept for …', 'food', 'the tortoises were taken on board these ships to act as food supplies during long ocean passages', { passageKeyword: 'food supplies', questionKeyword: 'kept for food', thaiMeaning: 'อาหาร' }),
    q('1790s: also used to produce …', 'oil', 'Sometimes, their bodies were processed into high-grade oil', { passageKeyword: 'processed into high-grade oil', questionKeyword: 'used to produce oil', thaiMeaning: 'น้ำมัน' }),
    q('Hunted by … on the islands', 'settlers', 'when settlers came to the islands. They hunted the tortoises', { passageKeyword: 'settlers hunted the tortoises', questionKeyword: 'hunted by settlers', thaiMeaning: 'ผู้บุกเบิก' }),
    q('Habitat destruction: by various … not native to the islands', 'species', 'They also introduced alien species', { passageKeyword: 'introduced alien species', questionKeyword: 'not native species', thaiMeaning: 'สปีชีส์ต่างถิ่น' }),
    q('… not native to the islands also fed on baby tortoises and tortoises\' …', 'eggs', 'that either prey on the eggs and young tortoises or damage or destroy their habitat', { passageKeyword: 'prey on the eggs', questionKeyword: 'fed on eggs', thaiMeaning: 'ไข่' })
  ])
}

const stage3Passage2: IntensivePassageLayout = {
  title: 'The Intersection of Health Sciences and Geography',
  sectionOrder: [...P2_MATCH_FILL],
  paragraphs: [
    ['A', 'While many diseases that affect humans have been eradicated due to improvements in vaccinations and the availability of healthcare, there are still areas around the world where certain health issues are more prevalent. In a world that is far more globalised than ever before, people come into contact with one another through travel and living closer and closer to each other. As a result, super-viruses and other infections resistant to antibiotics are becoming more and more common.'],
    ['B', 'Geography can often play a very large role in the health concerns of certain populations. For instance, depending on where you live, you will not have the same health concerns as someone who lives in a different geographical region. Perhaps one of the most obvious examples of this idea is malaria-prone areas, which are usually tropical regions that foster a warm and damp environment in which the mosquitos that can give people this disease can grow. Malaria is much less of a problem in high-altitude deserts, for instance.'],
    ['C', 'In some countries, geographical factors influence the health and well-being of the population in very obvious ways. In many large cities, the wind is not strong enough to clear the air of the massive amounts of smog and pollution that cause asthma, lung problems, eyesight issues and more in the people who live there. Part of the problem is, of course, the massive number of cars being driven, in addition to factories that run on coal power. The rapid industrialisation of some countries in recent years has also led to the cutting down of forests to allow for the expansion of big cities, which makes it even harder to fight the pollution with the fresh air that is produced by plants.'],
    ['D', 'It is in situations like these that the field of health geography comes into its own. It is an increasingly important area of study in a world where diseases like polio are re-emerging, respiratory diseases continue to spread, and malaria-prone areas are still fighting to find a better cure. Health geography is the combination of, on the one hand, knowledge regarding geography and methods used to analyse and interpret geographical information, and on the other, the study of health, diseases and healthcare practices around the world. The aim of this hybrid science is to create solutions for common geography-based health problems. While people will always be prone to illness, the study of how geography affects our health could lead to the eradication of certain illnesses, and the prevention of others in the future. By understanding why and how we get sick, we can change the way we treat illness and disease specific to certain geographical locations.'],
    ['E', 'The geography of disease and ill health analyses the frequency with which certain diseases appear in different parts of the world, and overlays the data with the geography of the region, to see if there could be a correlation between the two. Health geographers also study factors that could make certain individuals or a population more likely to be taken ill with a specific health concern or disease, as compared with the population of another area. Health geographers in this field are usually trained as healthcare workers, and have an understanding of basic epidemiology as it relates to the spread of diseases among the population.'],
    ['F', 'Researchers study the interactions between humans and their environment that could lead to illness (such as asthma in places with high levels of pollution) and work to create a clear way of categorizing illnesses, diseases and epidemics into local and global scales. Health geographers can map the spread of illnesses and attempt to identify the reasons behind an increase or decrease in illnesses, as they work to find a way to halt the further spread or re-emergence of diseases in vulnerable populations.'],
    ['G', 'The second subcategory of health geography is the geography of healthcare provision. This group studies the availability (or lack thereof) of healthcare resources to individuals and populations around the world. In both developed and developing nations there is often a very large discrepancy between the options available to people in different social classes, income brackets, and levels of education. Individuals working in the area of the geography of healthcare provision attempt to assess the levels of healthcare in the area (for instance, it may be very difficult for people to get medical attention because there is a mountain between their village and the nearest hospital). These researchers are on the frontline of making recommendations regarding policy to international organisations, local government bodies and others.'],
    ['H', 'The field of health geography is often overlooked, but it constitutes a huge area of need in the fields of geography and healthcare. If we can understand how geography affects our health no matter where in the world we are located, we can better treat disease, prevent illness, and keep people safe and well.']
  ],
  matchingInfo: matchingInfoAH([
    q('An acceptance that not all diseases can be totally eliminated', 'D', 'While people will always be prone to illness, the study of how geography affects our health could lead to the eradication of certain illnesses, and the prevention of others in the future', { passageKeyword: 'eradication of certain illnesses', questionKeyword: 'not all diseases totally eliminated', thaiMeaning: 'ไม่สามารถกำจัดทุกโรคได้' }),
    q('Examples of physical conditions caused by human behaviour', 'C', 'the massive amounts of smog and pollution that cause asthma, lung problems, eyesight issues and more', { passageKeyword: 'asthma, lung problems', questionKeyword: 'physical conditions from human behaviour', thaiMeaning: 'สภาพทางกายจากมลพิษ' }),
    q('A reference to classifying diseases on the basis of how far they extend geographically', 'F', 'work to create a clear way of categorizing illnesses, diseases and epidemics into local and global scales', { passageKeyword: 'local and global scales', questionKeyword: 'classifying diseases geographically', thaiMeaning: 'จำแนกตามขอบเขตภูมิศาสตร์' }),
    q('Reasons why the level of access to healthcare can vary within a country', 'G', 'there is often a very large discrepancy between the options available to people in different social classes, income brackets, and levels of education', { passageKeyword: 'discrepancy between social classes', questionKeyword: 'access to healthcare varies', thaiMeaning: 'ความไม่เท่าเทียมในการเข้าถึงบริการ' }),
    q('A description of health geography as a mixture of different academic fields', 'D', 'Health geography is the combination of, on the one hand, knowledge regarding geography and methods used to analyse and interpret geographical information, and on the other, the study of health, diseases and healthcare practices', { passageKeyword: 'combination of geography and health', questionKeyword: 'mixture of academic fields', thaiMeaning: 'ผสานสองสาขาวิชา' }),
    q('A description of the type of area where a particular illness is rare', 'B', 'Malaria is much less of a problem in high-altitude deserts, for instance', { passageKeyword: 'much less of a problem in high-altitude deserts', questionKeyword: 'area where illness is rare', thaiMeaning: 'พื้นที่ที่โรคหายาก' })
  ]),
  fill: fillSentences([
    q('Certain diseases have disappeared, thanks to better … and healthcare.', 'vaccinations', 'improvements in vaccinations and the availability of healthcare', { passageKeyword: 'improvements in vaccinations', questionKeyword: 'better vaccinations and healthcare', thaiMeaning: 'วัคซีน' }),
    q('Because there is more contact between people, … are losing their usefulness.', 'antibiotics', 'super-viruses and other infections resistant to antibiotics are becoming more and more common', { passageKeyword: 'resistant to antibiotics', questionKeyword: 'antibiotics losing usefulness', thaiMeaning: 'ยาปฏิชีวนะ' }),
    q('Disease-causing … are most likely to be found in hot, damp regions.', 'mosquitoes', 'tropical regions that foster a warm and damp environment in which the mosquitos that can give people this disease can grow', { passageKeyword: 'mosquitos that can give people this disease', questionKeyword: 'disease-causing mosquitoes', thaiMeaning: 'ยุง' }),
    q('One cause of pollution is … that burn a particular fuel.', 'factories', 'factories that run on coal power', { passageKeyword: 'factories that run on coal power', questionKeyword: 'factories burning coal', thaiMeaning: 'โรงงาน' }),
    q('The growth of cities often has an impact on nearby …', 'forests', 'the cutting down of forests to allow for the expansion of big cities', { passageKeyword: 'cutting down of forests', questionKeyword: 'impact on nearby forests', thaiMeaning: 'ป่า' }),
    q('… is one disease that is growing after having been eradicated.', 'polio', 'diseases like polio are re-emerging', { passageKeyword: 'polio are re-emerging', questionKeyword: 'disease growing after eradicated', thaiMeaning: 'โรคโปลิโอ' }),
    q('A physical barrier such as a … can prevent people from reaching a hospital.', 'mountain', 'it may be very difficult for people to get medical attention because there is a mountain between their village and the nearest hospital', { passageKeyword: 'mountain between their village and the nearest hospital', questionKeyword: 'physical barrier mountain', thaiMeaning: 'ภูเขา' })
  ])
}

// ─── Stage 4: Cambridge 12 Test 4 — The History of Glass + Bring Back the Big Cats ─

const lynxSummaryOptions = [
  'A trees',
  'B endangered species',
  'C hillsides',
  'D wild animals',
  'E humans',
  'F farm animals'
]

const stage4Passage1: IntensivePassageLayout = {
  title: 'The History of Glass',
  sectionOrder: [...P1_FILL_TFNG_ORDER],
  paragraphs: [
    ['A', 'From our earliest origins, man has been making use of glass. Historians have discovered that a type of natural glass – obsidian – formed in places such as the mouth of a volcano as a result of the intense heat of an eruption melting sand – was first used as tips for spears. Archaeologists have even found evidence of man-made glass which dates back to 4000 BC; this took the form of glazes used for coating stone beads. It was not until 1500 BC, however, that the first hollow glass container was made by covering a sand core with a layer of molten glass.'],
    ['B', 'Glass blowing became the most common way to make glass containers from the first century BC. The glass made during this time was highly coloured due to the impurities of the raw material. In the first century AD, methods of creating colourless glass were developed, which was then tinted by the addition of colouring materials. The secret of glass making was taken across Europe by the Romans during this century. However, they guarded the skills and technology required to make glass very closely, and it was not until their empire collapsed in 476 AD that glass-making knowledge became widespread throughout Europe and the Middle East. From the 10th century onwards, the Venetians gained a reputation for technical skill and artistic ability in the making of glass bottles, and many of the city\'s craftsmen left Italy to set up glassworks throughout Europe.'],
    ['C', 'A major milestone in the history of glass occurred with the invention of lead crystal glass by the English glass manufacturer George Ravenscroft (1632-1683). He attempted to counter the effect of clouding that sometimes occurred in blown glass by introducing lead to the raw materials used in the process. The new glass he created was softer and easier to decorate, and had a higher refractive index, adding to its brilliance and beauty, and it proved invaluable to the optical industry. It is thanks to Ravenscroft\'s invention that optical lenses, astronomical telescopes, microscopes and the like became possible.'],
    ['D', 'In Britain, the modern glass industry only really started to develop after the repeal of the Excise Act in 1845. Before that time, heavy taxes had been placed on the amount of glass melted in a glasshouse, and were levied continuously from 1745 to 1845. Joseph Paxton\'s Crystal Palace at London\'s Great Exhibition of 1851 marked the beginning of glass as a material used in the building industry. This revolutionary new building encouraged the use of glass in public, domestic and horticultural architecture. Glass manufacturing techniques also improved with the advancement of science and the development of better technology.'],
    ['E', 'From 1887 onwards, glass making developed from traditional mouth-blowing to a semi-automatic process, after factory-owner HM Ashley introduced a machine capable of producing 200 bottles per hour in Castleford, Yorkshire, England – more than three times quicker than any previous production method. Then in 1907, the first fully automated machine was developed in the USA by Michael Owens – founder of the Owens Bottle Machine Company (later the major manufacturers Owens-Illinois) – and installed in its factory. Owens\' invention could produce an impressive 2,500 bottles per hour. Other developments followed rapidly, but it was not until the First World War, when Britain became cut off from essential glass suppliers, that glass became part of the scientific sector. Previous to this, glass had been as a craft rather than a precise science.'],
    ['F', 'Today, glass making is big business. It has become a modern, hi-tech industry operating in a fiercely competitive global market where quality, design and service levels are critical to maintaining market share. Modern glass plants are capable of making millions of glass containers a day in many different colours, with green, brown and clear remaining the most popular. Few of us can imagine modern life without glass. It features in almost every aspect of our lives – in our homes, our cars and whenever we sit down to eat or drink. Glass packaging is used for many products, many beverages are sold in glass, as are numerous foodstuffs, as well as medicines and cosmetics.'],
    ['G', 'Glass is an ideal material for recycling, and with growing consumer concern for green issues, glass bottles and jars are becoming ever more popular. Glass recycling is good news for the environment. It saves used glass containers being sent to landfill. As less energy is needed to melt recycled glass than to melt down raw materials, this also saves fuel and production costs. Recycling also reduces the need for raw materials to be quarried, thus saving precious resources.']
  ],
  fill: fillNotes('The History of Glass', [
    q('Early humans used a material called …', 'obsidian', 'a type of natural glass – obsidian – formed in places such as the mouth of a volcano', { passageKeyword: 'obsidian', questionKeyword: 'material called obsidian', thaiMeaning: 'ออบซิเดียน' }),
    q('to make the sharp points of their …', 'spears', 'was first used as tips for spears', { passageKeyword: 'tips for spears', questionKeyword: 'sharp points of spears', thaiMeaning: 'หอก' }),
    q('4000 BC: … made of stone were covered in a coating of man-made glass', 'beads', 'glazes used for coating stone beads', { passageKeyword: 'coating stone beads', questionKeyword: 'stone beads covered in glass', thaiMeaning: 'ลูกปัด' }),
    q('First century BC: glass was coloured because of the … in the material', 'impurities', 'highly coloured due to the impurities of the raw material', { passageKeyword: 'impurities of the raw material', questionKeyword: 'coloured because of impurities', thaiMeaning: 'สิ่งเจือปน' }),
    q('Until 476 AD: Only the … knew how to make glass', 'Romans', 'they guarded the skills and technology required to make glass very closely, and it was not until their empire collapsed in 476 AD', { passageKeyword: 'Romans guarded glass-making skills', questionKeyword: 'only the Romans knew', thaiMeaning: 'ชาวโรมัน' }),
    q('17th century: George Ravenscroft developed a process using …', 'lead', 'by introducing lead to the raw materials used in the process', { passageKeyword: 'introducing lead', questionKeyword: 'process using lead', thaiMeaning: 'ตะกั่ว' }),
    q('to avoid the occurrence of … in blown glass', 'clouding', 'to counter the effect of clouding that sometimes occurred in blown glass', { passageKeyword: 'effect of clouding', questionKeyword: 'avoid clouding', thaiMeaning: 'ขุ่นมัว' }),
    q('Mid-19th century: British glass production developed after changes to laws concerning …', 'taxes', 'heavy taxes had been placed on the amount of glass melted in a glasshouse', { passageKeyword: 'heavy taxes', questionKeyword: 'laws concerning taxes', thaiMeaning: 'ภาษี' })
  ]),
  tfng: tfng([
    q('In 1887, HM Ashley had the fastest bottle-producing machine that existed at the time.', 'TRUE', 'more than three times quicker than any previous production method', { passageKeyword: 'three times quicker than any previous', questionKeyword: 'fastest machine at the time', thaiMeaning: 'เร็วกว่าวิธีเดิมมาก' }),
    q('Michael Owens was hired by a large US company to design a fully-automated bottle manufacturing machine for them.', 'FALSE', 'developed in the USA by Michael Owens – founder of the Owens Bottle Machine Company', { passageKeyword: 'founder of the Owens Bottle Machine Company', questionKeyword: 'hired by a large US company', thaiMeaning: 'เขาเป็นผู้ก่อตั้ง ไม่ใช่ลูกจ้าง' }),
    q('Nowadays, most glass is produced by large international manufacturers.', 'NOT GIVEN', 'It has become a modern, hi-tech industry operating in a fiercely competitive global market', { passageKeyword: 'fiercely competitive global market', questionKeyword: 'most glass by large international manufacturers', thaiMeaning: 'ไม่ได้ระบุว่าผลิตโดยบริษัทใหญ่ส่วนใหญ่' }),
    q('Concern for the environment is leading to an increased demand for glass containers.', 'TRUE', 'with growing consumer concern for green issues, glass bottles and jars are becoming ever more popular', { passageKeyword: 'becoming ever more popular', questionKeyword: 'increased demand for glass containers', thaiMeaning: 'ความต้องการเพิ่มขึ้น' }),
    q('It is more expensive to produce recycled glass than to manufacture new glass.', 'FALSE', 'As less energy is needed to melt recycled glass than to melt down raw materials, this also saves fuel and production costs', { passageKeyword: 'less energy is needed to melt recycled glass', questionKeyword: 'more expensive to produce recycled glass', thaiMeaning: 'รีไซเคิลถูกกว่า' })
  ])
}

const stage4Passage2: IntensivePassageLayout = {
  title: 'Bring Back the Big Cats',
  sectionOrder: [...P2_MCQ_SUMMARY_YNNG],
  paragraphs: [
    ['A', 'It\'s time to start returning vanished native animals to Britain, says John Vesty. There is a poem, written around 598 AD, which describes hunting a mystery animal called a llewyn. But what was it? Nothing seemed to fit, until 2006, when an animal bone, dating from around the same period, was found in the Kinsey Cave in northern England. Until this discovery, the lynx – a large spotted cat with tasselled ears – was presumed to have died out in Britain at least 6,000 years ago, before the inhabitants of these islands took up farming. But the 2006 find, together with three others in Yorkshire and Scotland, is compelling evidence that the lynx and the mysterious llewyn were in fact one and the same animal. If this is so, it would bring forward the tassel-eared cat\'s estimated extinction date by roughly 5,000 years.'],
    ['B', 'However, this is not quite the last glimpse of the animal in British culture. A 9th-century stone cross from the Isle of Eigg shows, alongside the deer, boar and aurochs pursued by a mounted hunter, a speckled cat with tasselled ears. Were it not for the animal\'s backside having worn away with time, we could have been certain, as the lynx\'s stubby tail is unmistakable. But even without this key feature, it\'s hard to see what else the creature could have been. The lynx is now becoming the totemic animal of a movement that is transforming British environmentalism: rewilding.'],
    ['C', 'Rewilding means the mass restoration of damaged ecosystems. It involves letting trees return to places that have been denuded, allowing parts of the seabed to recover from trawling and dredging, permitting rivers to flow freely again. Above all, it means bringing back missing species. One of the most striking findings of modern ecology is that ecosystems without large predators behave in completely different ways from those that retain them. Some of them drive dynamic processes that resonate through the whole food chain, creating niches for hundreds of species that might otherwise struggle to survive. The killers turn out to be bringers of life.'],
    ['D', 'Such findings present a big challenge to British conservation, which has often selected arbitrary assemblages of plants and animals and sought, at great effort and expense, to prevent them from changing. It has tried to preserve the living world as if it were a jar of pickles, letting nothing in and nothing out, keeping nature in a state of arrested development. But ecosystems are not merely collections of species; they are also the dynamic and ever-shifting relationships between them. And this dynamism often depends on large predators.'],
    ['E', 'At sea the potential is even greater: by protecting large areas from commercial fishing, we could once more see what 18th-century literature describes: vast shoals of fish being chased by fin and sperm whales, within sight of the English shore. This policy would also greatly boost catches in the surrounding seas; the fishing industry\'s insistence on scouring every inch of seabed, leaving no breeding reserves, could not be more damaging to its own interests.'],
    ['F', 'Rewilding is a rare example of an environmental movement in which campaigners articulate what they are for rather than only what they are against. One of the reasons why the enthusiasm for rewilding is spreading so quickly in Britain is that it helps to create a more inspiring vision than the green movement\'s usual promise of \'Follow us and the world will be slightly less awful than it would otherwise have been.\''],
    ['G', 'The lynx presents no threat to human beings: there is no known instance of one preying on people. It is a specialist predator of roe deer, a species that has exploded in Britain in recent decades, holding back, by intensive browsing, attempts to re-establish forests. It will also winkle out sika deer: an exotic species that is almost impossible for human beings to control, as it hides in impenetrable plantations of young trees. The attempt to reintroduce this predator marries well with the aim of bringing forests back to parts of our bare and barren uplands. The lynx requires deep cover, and as such presents little risk to sheep and other livestock, which are supposed, as a condition of farm subsidies, to be kept out of the woods.'],
    ['H', 'On a recent trip to the Cairngorm Mountains, I heard several conservationists suggest that the lynx could be reintroduced there within 20 years. If trees return to the bare hills elsewhere in Britain, the big cats could soon follow. There is nothing extraordinary about these proposals, seen from the perspective of anywhere else in Europe. The lynx has now been reintroduced to the Jura Mountains, the Alps, the Vosges in eastern France and the Harz mountains in Germany, and has re-established itself in many more places. The European population has tripled since 1970 to roughly 10,000. As with wolves, bears, beavers, boar, bison, moose and many other species, the lynx has been able to spread as farming has left the hills and people discover that it is more lucrative to protect charismatic wildlife than to hunt it, as tourists will pay for the chance to see it. Large-scale rewilding is happening almost everywhere – except Britain.'],
    ['I', 'Here, attitudes are just beginning to change. Conservationists are starting to accept that the old preservation-jar model is failing, even on its own terms. Already, projects such as Trees for Life in the Highlands provide a hint of what might be coming. An organisation is being set up that will seek to catalyse the rewilding of land and sea across Britain, its aim being to reintroduce that rarest of species to British ecosystems: hope.']
  ],
  mcq: {
    instruction: 'Write the correct letter, A, B, C or D, for questions 14–18. For questions 19–22, write the correct letter, A–F.',
    options: [
      'Questions 19–22',
      'Complete the summary using the list of words and phrases A–F below.',
      'Reintroducing the lynx to Britain',
      ...lynxSummaryOptions
    ],
    items: [
      q('What did the 2006 discovery of the animal bone reveal about the lynx?\nA Its physical appearance was very distinctive.\nB Its extinction was linked to the spread of farming.\nC It vanished from Britain several thousand years ago.\nD It survived in Britain longer than was previously thought.', 'D', 'it would bring forward the tassel-eared cat\'s estimated extinction date by roughly 5,000 years', { passageKeyword: 'extinction date brought forward', questionKeyword: 'survived longer than thought', thaiMeaning: 'อยู่ในอังกฤษนานกว่าที่คิด' }),
      q('What point does the writer make about large predators in the third paragraph?\nA Their presence can increase biodiversity.\nB They may cause damage to local ecosystems.\nC Their behaviour can alter according to the environment.\nD They should be reintroduced only to areas where they were native.', 'A', 'creating niches for hundreds of species that might otherwise struggle to survive', { passageKeyword: 'creating niches for hundreds of species', questionKeyword: 'increase biodiversity', thaiMeaning: 'เพิ่มความหลากหลายทางชีวภาพ' }),
      q('What does the writer suggest about British conservation in the fourth paragraph?\nA It has failed to achieve its aims.\nB It is beginning to change direction.\nC It has taken a misguided approach.\nD It has focused on the most widespread species.', 'C', 'It has tried to preserve the living world as if it were a jar of pickles', { passageKeyword: 'jar of pickles', questionKeyword: 'misguided approach', thaiMeaning: 'แนวทางผิดพลาด' }),
      q('Protecting large areas of the sea from commercial fishing would result in\nA practical benefits for the fishing industry.\nB some short-term losses to the fishing industry.\nC widespread opposition from the fishing industry.\nD certain changes to techniques within the fishing industry.', 'A', 'This policy would also greatly boost catches in the surrounding seas', { passageKeyword: 'boost catches in the surrounding seas', questionKeyword: 'practical benefits for fishing industry', thaiMeaning: 'ประโยชน์ต่ออุตสาหกรรมประมง' }),
      q('According to the author, what distinguishes rewilding from other environmental campaigns?\nA Its objective is more achievable.\nB Its supporters are more articulate.\nC Its positive message is more appealing.\nD It is based on sounder scientific principles.', 'C', 'it helps to create a more inspiring vision than the green movement\'s usual promise', { passageKeyword: 'more inspiring vision', questionKeyword: 'positive message more appealing', thaiMeaning: 'ข้อความเชิงบวกน่าดึงดูด' }),
      q('While there is no evidence that the lynx has ever put … in danger', 'E', 'there is no known instance of one preying on people', { passageKeyword: 'no known instance of preying on people', questionKeyword: 'humans in danger', thaiMeaning: 'มนุษย์' }),
      q('it would reduce the numbers of certain … whose populations have increased enormously', 'D', 'It is a specialist predator of roe deer, a species that has exploded in Britain in recent decades', { passageKeyword: 'predator of roe deer', questionKeyword: 'wild animals', thaiMeaning: 'สัตว์ป่า' }),
      q('It would present only a minimal threat to …, provided these were kept away from lynx habitats', 'F', 'presents little risk to sheep and other livestock', { passageKeyword: 'little risk to sheep and other livestock', questionKeyword: 'farm animals', thaiMeaning: 'ปศุสัตว์' }),
      q('the reintroduction programme would also link efficiently with initiatives to return native … to certain areas', 'A', 'bringing forests back to parts of our bare and barren uplands', { passageKeyword: 'bringing forests back', questionKeyword: 'return native trees', thaiMeaning: 'ต้นไม้/ป่า' })
    ]
  },
  ynng: ynngP2([
    q('Britain could become the first European country to reintroduce the lynx.', 'NO', 'There is nothing extraordinary about these proposals, seen from the perspective of anywhere else in Europe', { passageKeyword: 'nothing extraordinary elsewhere in Europe', questionKeyword: 'first European country', thaiMeaning: 'ไม่ใช่ประเทศแรกในยุโรป' }),
    q('The large growth in the European lynx population since 1970 has exceeded conservationists\' expectations.', 'NOT GIVEN', 'The European population has tripled since 1970 to roughly 10,000', { passageKeyword: 'tripled since 1970', questionKeyword: 'exceeded expectations', thaiMeaning: 'ไม่ได้เปรียบเทียบกับความคาดหวัง' }),
    q('Changes in agricultural practices have extended the habitat of the lynx in Europe.', 'YES', 'the lynx has been able to spread as farming has left the hills', { passageKeyword: 'farming has left the hills', questionKeyword: 'agricultural practices extended habitat', thaiMeaning: 'การเกษตรเปลี่ยนทำให้ที่อยู่อาศัยขยาย' }),
    q('It has become apparent that species reintroduction has commercial advantages.', 'YES', 'it is more lucrative to protect charismatic wildlife than to hunt it, as tourists will pay for the chance to see it', { passageKeyword: 'more lucrative to protect wildlife', questionKeyword: 'commercial advantages', thaiMeaning: 'ท่องเที่ยวทำเงินได้' })
  ])
}

// ─── Stage 5: Cambridge 13 Test 1 — Tourism NZ Website + Boredom ────────────

const boredomHeadings = [
  'The productive outcomes that may result from boredom',
  'What teachers can do to prevent boredom',
  'A new explanation and a new cure for boredom',
  'Problems with a scientific approach to boredom',
  'A potential danger arising from boredom',
  'Creating a system of classification for feelings of boredom',
  'Age groups most affected by boredom',
  'Identifying those most affected by boredom'
]

const boredomIdeas = [
  'A The way we live today may encourage boredom',
  'B One sort of boredom is worse than all the others',
  'C Levels of boredom may fall in the future',
  'D Trying to cope with boredom can increase its negative effects',
  'E Boredom may encourage us to avoid an unpleasant experience'
]

const stage5Passage1: IntensivePassageLayout = {
  title: 'Case Study: Tourism New Zealand Website',
  sectionOrder: [...P1_FILL_TFNG_ORDER],
  paragraphs: [
    ['A', 'New Zealand is a small country of four million inhabitants, a long-haul flight from all the major tourist-generating markets of the world. Tourism currently makes up 9% of the country\'s gross domestic product, and is the country\'s largest export sector. Unlike other export sectors, which make products and then sell them overseas, tourism brings its customers to New Zealand. The product is the country itself – the people, the places and the experiences. In 1999, Tourism New Zealand launched a campaign to communicate a new brand position to the world. The campaign focused on New Zealand\'s scenic beauty, exhilarating outdoor activities and authentic Maori culture, and it made New Zealand one of the strongest national brands in the world.'],
    ['B', 'A key feature of the campaign was the website www.newzealand.com, which provided potential visitors to New Zealand with a single gateway to everything the destination had to offer. The heart of the website was a database of tourism services operators, both those based in New Zealand and those based abroad which offered tourism service to the country. Any tourism-related business could be listed by filling in a simple form. This meant that even the smallest bed and breakfast address or specialist activity provider could gain a web presence with access to an audience of long-haul visitors. In addition, because participating businesses were able to update the details they gave on a regular basis, the information provided remained accurate. And to maintain and improve standards, Tourism New Zealand organised a scheme whereby organisations appearing on the website underwent an independent evaluation against a set of agreed national standards of quality. As part of this, the effect of each business on the environment was considered.'],
    ['C', 'To communicate the New Zealand experience, the site also carried features relating to famous people and places. One of the most popular was an interview with former New Zealand All Blacks rugby captain Tana Umaga. Another feature that attracted a lot of attention was an interactive journey through a number of the locations chosen for blockbuster films which had made use of New Zealand\'s stunning scenery as a backdrop. As the site developed, additional features were added to help independent travelers devise their own customised itineraries. To make it easier to plan motoring holidays, the site catalogued the most popular driving routes in the country, highlighting different routes according to the season and indicating distances and times.'],
    ['D', 'Later, a Travel Planner feature was added, which allowed visitors to click and \'bookmark\' places or attractions they were interested in, and then view the results on a map. The Travel Planner offered suggested routes and public transport options between the chosen locations. There were also links to accommodation in the area. By registering with the website, users could save their Travel Plan and return to it later, or print it out to take on the visit. The website also had a \'Your Words\' section where anyone could submit a blog of their New Zealand travels for possible inclusion on the website.'],
    ['E', 'The Tourism New Zealand website won two Webby awards for online achievement and innovation. More importantly perhaps, the growth of tourism to New Zealand was impressive. Overall tourism expenditure increased by an average of 6.9% per year between 1999 and 2004. From Britain, visits to New Zealand grew at an average annual rate of 13% between 2002 and 2006, compared to a rate of 4% overall for British visits abroad.'],
    ['F', 'The website was set up to allow both individuals and travel organisations to create itineraries and travel packages to suit their own needs and interests. On the website, visitors can search for activities not solely by geographical location, but also by the particular nature of the activity. This is important as research shows that activities are the key driver of visitor satisfaction, contributing 74% to visitor satisfaction, while transport and accommodation account for the remaining 26%. The more activities that visitors undertake, the more satisfied they will be. It has also been found that visitors enjoy cultural activities most when they are interactive, such as visiting a marae (meeting ground) to learn about traditional Maori life. Many long-haul travelers enjoy such learning experiences, which provide them with stories to take home to their friends and family. In addition, it appears that visitors to New Zealand don\'t want to be \'one of the crowd\' and find activities that involve only a few people more special and meaningful.'],
    ['G', 'It could be argued that New Zealand is not a typical destination. New Zealand is a small country with a visitor economy composed mainly of small businesses. It is generally perceived as a safe English-speaking country with a reliable transport infrastructure. Because of the long-haul flight, most visitors stay for longer (average 20 days) and want to see as much of the country as possible on what is often seen as a once-in-a-lifetime visit. However, the underlying lessons apply anywhere – the effectiveness of a strong brand, a strategy based on unique experiences and a comprehensive and user-friendly website.']
  ],
  fill: fillTable('The Tourism New Zealand website', [
    q('Database: allowed businesses to … information regularly', 'update', 'participating businesses were able to update the details they gave on a regular basis', { passageKeyword: 'update the details they gave on a regular basis', questionKeyword: 'update information regularly', thaiMeaning: 'อัปเดตข้อมูล' }),
    q('Evaluation including impact on the …', 'environment', 'the effect of each business on the environment was considered', { passageKeyword: 'effect on the environment', questionKeyword: 'impact on the environment', thaiMeaning: 'สิ่งแวดล้อม' }),
    q('Special features: interview with a former sports …', 'captain', 'an interview with former New Zealand All Blacks rugby captain Tana Umaga', { passageKeyword: 'rugby captain Tana Umaga', questionKeyword: 'former sports captain', thaiMeaning: 'กัปตันทีม' }),
    q('Interactive tour of locations used in …', 'films', 'locations chosen for blockbuster films which had made use of New Zealand\'s stunning scenery as a backdrop', { passageKeyword: 'blockbuster films', questionKeyword: 'locations used in films', thaiMeaning: 'ภาพยนตร์' }),
    q('Driving routes varied depending on the …', 'season', 'highlighting different routes according to the season and indicating distances and times', { passageKeyword: 'according to the season', questionKeyword: 'varied depending on the season', thaiMeaning: 'ฤดูกาล' }),
    q('Travel Planner: public transport and local …', 'accommodation', 'There were also links to accommodation in the area', { passageKeyword: 'links to accommodation', questionKeyword: 'local accommodation', thaiMeaning: 'ที่พัก' }),
    q('\'Your Words\': travellers could send a link to their …', 'blog', 'anyone could submit a blog of their New Zealand travels for possible inclusion on the website', { passageKeyword: 'submit a blog', questionKeyword: 'link to their blog', thaiMeaning: 'บล็อก' })
  ]),
  tfng: tfng([
    q('The website www.newzealand.com aimed to provide ready-made itineraries and packages for travel companies and individual tourists.', 'FALSE', 'The website was set up to allow both individuals and travel organisations to create itineraries and travel packages to suit their own needs and interests', { passageKeyword: 'create itineraries to suit their own needs', questionKeyword: 'ready-made itineraries and packages', thaiMeaning: 'ให้สร้างเอง ไม่ใช่สำเร็จรูป' }),
    q('It was found that most visitors started searching on the website by geographical location.', 'NOT GIVEN', 'visitors can search for activities not solely by geographical location, but also by the particular nature of the activity', { passageKeyword: 'not solely by geographical location', questionKeyword: 'most visitors started by geographical location', thaiMeaning: 'ไม่ได้บอกว่าส่วนใหญ่เริ่มจากพื้นที่' }),
    q('According to research, 26% of visitor satisfaction is related to their accommodation.', 'FALSE', 'activities are the key driver of visitor satisfaction, contributing 74% to visitor satisfaction, while transport and accommodation account for the remaining 26%', { passageKeyword: 'transport and accommodation account for the remaining 26%', questionKeyword: '26% related to accommodation', thaiMeaning: '26% รวมการเดินทางและที่พัก ไม่ใช่แค่ที่พัก' }),
    q('Visitors to New Zealand like to become involved in the local culture.', 'TRUE', 'visitors enjoy cultural activities most when they are interactive, such as visiting a marae (meeting ground) to learn about traditional Maori life', { passageKeyword: 'interactive cultural activities', questionKeyword: 'involved in the local culture', thaiMeaning: 'ชอบมีส่วนร่วมวัฒนธรรม' }),
    q('Visitors like staying in small hotels in New Zealand rather than in larger ones.', 'NOT GIVEN', 'New Zealand is a small country with a visitor economy composed mainly of small businesses', { passageKeyword: 'economy composed mainly of small businesses', questionKeyword: 'prefer small hotels over larger ones', thaiMeaning: 'ไม่ได้เปรียบเทียบโรงแรมเล็กกับใหญ่' }),
    q('Many visitors feel it is unlikely that they will return to New Zealand after their visit.', 'TRUE', 'most visitors stay for longer (average 20 days) and want to see as much of the country as possible on what is often seen as a once-in-a-lifetime visit', { passageKeyword: 'once-in-a-lifetime visit', questionKeyword: 'unlikely they will return', thaiMeaning: 'มักเป็นทริปครั้งเดียวในชีวิต' })
  ])
}

const stage5Passage2: IntensivePassageLayout = {
  title: 'Why Being Bored Is Stimulating – and Useful, Too',
  sectionOrder: [...P2_HEADINGS_MATCH_FILL],
  paragraphs: [
    ['A', 'We all know how it feels – it\'s impossible to keep your mind on anything, time stretches out, and all the things you could do seem equally unlikely to make you feel better. But defining boredom so that it can be studied in the lab has proved difficult. For a start, it can include a lot of other mental states, such as frustration, apathy, depression and indifference. There isn\'t even agreement over whether boredom is always a low-energy, flat kind of emotion or whether feeling agitated and restless counts as boredom, too. In his book, Boredom: A Lively History, Peter Toohey at the University of Calgary, Canada, compares it to disgust – an emotion that motivates us to stay away from certain situations. \'If disgust protects humans from infection, boredom may protect them from "infectious" social situations,\' he suggests.'],
    ['B', 'By asking people about their experiences of boredom, Thomas Goetz and his team at the University of Konstanz in Germany have recently identified five distinct types: indifferent, calibrating, searching, reactant and apathetic. These can be plotted on two axes – one running left to right, which measures low to high arousal, and the other from top to bottom, which measures how positive or negative the feeling is. Intriguingly, Goetz has found that while people experience all kinds of boredom, they tend to specialise in one. Of the five types, the most damaging is \'reactant\' boredom with its explosive combination of high arousal and negative emotion. The most useful is what Goetz calls \'indifferent\' boredom: someone isn\'t engaged in anything satisfying but still feels relaxed and calm. However, it remains to be seen whether there are any character traits that predict the kind of boredom each of us might be prone to.'],
    ['C', 'Psychologist Sandi Mann at the University of Central Lancashire, UK, goes further. \'All emotions are there for a reason, including boredom,\' she says. Mann has found that being bored makes us more creative. \'We\'re all afraid of being bored but in actual fact it can lead to all kinds of amazing things,\' she says. In experiments published last year, Mann found that people who had been made to feel bored by copying numbers out of the phone book for 15 minutes came up with more creative ideas about how to use a polystyrene cup than a control group. Mann concluded that a passive, boring activity is best for creativity because it allows the mind to wander. In fact, she goes so far as to suggest that we should seek out more boredom in our lives.'],
    ['D', 'Psychologist John Eastwood at York University in Toronto, Canada, isn\'t convinced. \'If you are in a state of mind-wandering you are not bored,\' he says. \'In my view, by definition boredom is an undesirable state.\' That doesn\'t necessarily mean that it isn\'t adaptive, he adds. \'Pain is adaptive – if we didn\'t have physical pain, bad things would happen to us. Does that mean that we should actively cause pain? No. But even if boredom has evolved to help us survive, it can still be toxic if allowed to fester.\' For Eastwood, the central feature of boredom is a failure to put our \'attention system\' into gear. This causes an inability to focus on anything, which makes time seem to go painfully slowly. What\'s more, your efforts to improve the situation can end up making you feel worse. \'People try to connect with the world and if they are not successful there\'s that frustration and irritability,\' he says. Perhaps most worryingly, says Eastwood, repeatedly failing to engage attention can lead to a state where we don\'t know what to do any more, and no longer care.'],
    ['E', 'Eastwood\'s team is now trying to explore why the attention system fails. It\'s early days but they think that at least some of it comes down to personality. Boredom proneness has been linked with a variety of traits. People who are motivated by pleasure seem to suffer particularly badly. Other personality traits, such as curiosity, are associated with a high boredom threshold. More evidence that boredom has detrimental effects comes from studies of people who are more or less prone to boredom. It seems those who bore easily face poorer prospects in education, their career and even life in general. But of course, boredom itself cannot kill – it\'s the things we do to deal with it that may put us in danger. What can we do to alleviate it before it comes to that? Goetz\'s group has one suggestion. Working with teenagers, they found that those who \'approach\' a boring situation – in other words, see that it\'s boring and get stuck in anyway – report less boredom than those who try to avoid it by using snacks, TV or social media for distraction.'],
    ['F', 'Psychologist Francoise Wemelsfelder speculates that our over-connected lifestyles might even be a new source of boredom. \'In modern human society there is a lot of overstimulation but still a lot of problems finding meaning,\' she says. So instead of seeking yet more mental stimulation, perhaps we should leave our phones alone, and use boredom to motivate us to engage with the world in a more meaningful way.']
  ],
  headings: {
    instruction: 'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list below. Write the correct number, i–viii.',
    options: boredomHeadings,
    items: [
      q('Paragraph A', 'iv', 'defining boredom so that it can be studied in the lab has proved difficult', { passageKeyword: 'defining boredom has proved difficult', questionKeyword: 'Problems with a scientific approach', thaiMeaning: 'ปัญหาวิธีวิทยาศาสตร์' }),
      q('Paragraph B', 'vi', 'identified five distinct types: indifferent, calibrating, searching, reactant and apathetic', { passageKeyword: 'five distinct types', questionKeyword: 'system of classification', thaiMeaning: 'จำแนกประเภทความเบื่อ' }),
      q('Paragraph C', 'i', 'Mann has found that being bored makes us more creative', { passageKeyword: 'being bored makes us more creative', questionKeyword: 'productive outcomes', thaiMeaning: 'ผลดีจากความเบื่อ' }),
      q('Paragraph D', 'v', 'boredom can still be toxic if allowed to fester', { passageKeyword: 'toxic if allowed to fester', questionKeyword: 'potential danger', thaiMeaning: 'อันตรายที่อาจเกิด' }),
      q('Paragraph E', 'viii', 'those who bore easily face poorer prospects in education, their career and even life in general', { passageKeyword: 'bore easily face poorer prospects', questionKeyword: 'Identifying those most affected', thaiMeaning: 'กลุ่มที่ได้รับผลกระทบ' }),
      q('Paragraph F', 'iii', 'leave our phones alone, and use boredom to motivate us to engage with the world in a more meaningful way', { passageKeyword: 'engage with the world in a more meaningful way', questionKeyword: 'new explanation and cure', thaiMeaning: 'ทางออกใหม่' })
    ]
  },
  matchingPeople: matchingIdeas(boredomIdeas, [
    q('Peter Toohey', 'E', 'boredom may protect them from "infectious" social situations', { passageKeyword: 'protect from infectious social situations', questionKeyword: 'avoid an unpleasant experience', thaiMeaning: 'หลีกเลี่ยงสังคม' }),
    q('Thomas Goetz', 'B', 'the most damaging is \'reactant\' boredom with its explosive combination of high arousal and negative emotion', { passageKeyword: 'most damaging reactant boredom', questionKeyword: 'one sort worse than all others', thaiMeaning: 'ชนิดที่แย่ที่สุด' }),
    q('John Eastwood', 'D', 'your efforts to improve the situation can end up making you feel worse', { passageKeyword: 'efforts to improve the situation can end up making you feel worse', questionKeyword: 'coping can increase negative effects', thaiMeaning: 'พยายามรับมือยิ่งแย่' }),
    q('Francoise Wemelsfelder', 'A', 'our over-connected lifestyles might even be a new source of boredom', { passageKeyword: 'over-connected lifestyles', questionKeyword: 'way we live today may encourage boredom', thaiMeaning: 'วิถีชีวิตปัจจุบัน' })
  ]),
  fill: fillBlock('Responses to boredom', [
    q('For John Eastwood, people cannot …, due to a failure in the \'attention system\'', 'focus', 'This causes an inability to focus on anything', { passageKeyword: 'inability to focus on anything', questionKeyword: 'cannot focus', thaiMeaning: 'โฟกัส' }),
    q('Those for whom … is an important aim in life may have problems coping with boredom', 'pleasure', 'People who are motivated by pleasure seem to suffer particularly badly', { passageKeyword: 'motivated by pleasure', questionKeyword: 'pleasure important aim', thaiMeaning: 'ความสุข' }),
    q('Those who have the characteristic of … can generally cope with it', 'curiosity', 'curiosity, are associated with a high boredom threshold', { passageKeyword: 'high boredom threshold', questionKeyword: 'characteristic curiosity', thaiMeaning: 'ความอยากรู้' })
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_1_5: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  1: [stage1Passage1, stage1Passage2],
  2: [stage2Passage1, stage2Passage2],
  3: [stage3Passage1, stage3Passage2],
  4: [stage4Passage1, stage4Passage2],
  5: [stage5Passage1, stage5Passage2]
}
