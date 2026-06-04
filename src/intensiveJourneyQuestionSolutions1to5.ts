import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

/** Local question numbers before journey remap (stage 1: P1 1–13, P2 1–13; stages 2–5: P1 1–14, P2 1–13). */
type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_1_5: Record<number, StageSolutions> = {
  1: {
    1: {
      1: s('grows up to 20 cm in thickness', 'thickest bark of any living tree', 'ไม่ได้เปรียบเทียบว่าหนาที่สุด'),
      2: s('never succeeded in replicating', 'synthetic cork with same cellular structure', 'เทคโนโลยียังเลียนแบบไม่สำเร็จ'),
      3: s('gap of approximately a decade', '25 years between first and second harvest', '25 ปีคือจากปลูกถึงเก็บครั้งแรก ไม่ใช่ระหว่างเก็บครั้งแรกกับครั้งที่สอง'),
      4: s('when the air is damp', 'dry atmospheric conditions', 'อากาศชื้นจะทำร้ายต้นไม้ จึงควรลอกในสภาพแห้ง'),
      5: s('No mechanical means', 'only way … by hand', 'ไม่มีเครื่องจักร ต้องใช้คนงาน'),
      6: s('spoil the taste', 'do not affect the taste', 'รสชาติ'),
      7: s('cheaper to manufacture', 'cheaper to produce', 'ถูกกว่า'),
      8: s('more convenient for the user', 'convenient to use', 'สะดวก'),
      9: s('traditional image', 'image of quality products', 'ภาพลักษณ์'),
      10: s('sustainable product', 'sustainable material', 'ยั่งยืน'),
      11: s('recycled without difficulty', 'easily recycled', 'รีไซเคิล'),
      12: s('support local biodiversity', 'aid biodiversity', 'ความหลากหลายทางชีวภาพ'),
      13: s('prevent desertification', 'stop desertification', 'การกลายเป็นทะเลทราย')
    },
    2: {
      1: s('antiques', 'collecting to make money', 'ของโบราณ'),
      2: s('sense of triumph', 'feeling of triumph', 'ชัยชนะ'),
      3: s('exchanging information', 'share information', 'ข้อมูล'),
      4: s('contact with like-minded people', 'offer contact', 'ติดต่อ/พบปะ'),
      5: s('whole lives in a hunt', 'life-long hunt', 'การล่าหา'),
      6: s('otherwise feels aimless', 'life is completely aimless', 'ไร้จุดหมาย'),
      7: s('educational value', 'may be educational', 'การศึกษา'),
      8: s('trainspotting', 'mostly a male hobby', 'trainspotting'),
      9: s('collect dolls', 'number buying dolls', 'ไม่ได้บอกจำนวนผู้ซื้อ'),
      10: s('wood in 16th century Europe', 'wax and porcelain in 16th century', 'ศตวรรษที่ 16 ใช้ไม้'),
      11: s('by country or by what they depict', 'by size less common', 'ไม่ได้เปรียบเทียบการจัดตามขนาด'),
      12: s('unexpected as dog collars', 'want others to think unusual', 'สะสมของแปลกเพื่อแสดงว่าตนน่าสนใจ'),
      13: s('strong sense of personal fulfilment', 'feeling other hobbies unlikely to inspire', 'ความสำเร็จทางใจมากกว่างานอดิเรกอื่น')
    }
  },
  2: {
    1: {
      1: s('distinguish food production from all other', 'characteristics only apply to food production', 'ลักษณะเฉพาะของการผลิตอาหาร'),
      2: s('smallholder farmers in developing countries', 'challenges only in certain parts of the world', 'ความท้าทายเฉพาะเกษตรกรในประเทศกำลังพัฒนา'),
      3: s('collective action does not come as a free good', 'difficulties in co-operation between farmers', 'ความยากในการสร้างความร่วมมือ'),
      4: s('subsidies are not poor', 'assistance does not go to those who need it', 'อุดหนุนไม่ไปหาคนจน'),
      5: s('collective action offers an important way', 'benefit from collaborating as a group', 'ได้ประโยชน์จากการร่วมมือกลุ่ม'),
      6: s('address poverty among farming families', 'improve standard of living', 'ช่วยยกระดับชีวิตเกษตรกร'),
      7: s('consumers invest in local farmers by subscription', 'financial input by buyers', 'ผู้ซื้อลงทุนกับเกษตรกร'),
      8: s('mitigate wild swings in food prices', 'reduce variation in prices', 'ลดความผันผวนราคา'),
      9: s('basic services like roads', 'infrastructure reduces risk', 'โครงสร้างพื้นฐานลดความเสี่ยง'),
      10: s('extreme weather events', 'changing weather patterns', 'สภาพอากาศเปลี่ยนแปลง'),
      11: s('intermediary purchasers who dictate prices', 'sell goods to intermediary buyers', 'ต้องขายให้คนกลาง'),
      12: s('all stakeholders must work together', 'organising co-operation between interested parties', 'ให้ทุกฝ่ายร่วมมือกัน'),
      13: s('consumers invest in local farmers by subscription', 'financial stake in farming', 'ให้ผู้บริโภคลงทุนกับเกษตรกร')
    },
    2: {
      1: s('goal was to locate Vitcos', 'The aim of the trip', 'เป้าหมายการเดินทาง'),
      2: s('track recently blasted down the valley', 'A new route', 'เส้นทางใหม่'),
      3: s('less than keen on climbing', "Bingham's lack of enthusiasm", 'ขาดความกระตือรือร้น'),
      4: s('vivid style', 'A dramatic description', 'บรรยายอย่างตื่นเต้น'),
      5: s('journal entries vs book', 'Different accounts of the same journey', 'บันทึกกับหนังสือเล่าไม่เหมือนกัน'),
      6: s('National Geographic article', 'Bingham publishes his theory', 'ตีพิมพ์ทฤษฎี'),
      7: s('gained wide acceptance', 'A common belief', 'ความเชื่อที่ยอมรับกว้าง'),
      8: s('goal to locate Vitcos', 'search for an Inca city', 'ไปหาเมืองอินคา'),
      9: s('advantage over travelers who had preceded them', 'most common route', 'ไม่ใช่เส้นทางที่คนส่วนใหญ่ใช้'),
      10: s("didn't realise the extent or the importance", 'understood significance as soon as he saw it', 'ยังไม่เข้าใจความสำคัญทันที'),
      11: s('attempts to prove this belief', 'returned to find evidence', 'ไม่ได้บอกว่ากลับไปที่ซาก'),
      12: s('rubber to be brought up by mules', 'transportation of rubber', 'ยาง'),
      13: s('local farmer, Melchor Arteaga', 'found out from a farmer', 'ชาวนา')
    }
  },
  3: {
    1: {
      1: s('the islands were colonised by one or more tortoises from mainland South America', 'Paragraph A — Tortoises populate the islands', 'เต่าเข้ามาอาศัยเกาะ'),
      2: s('From the 17th century onwards, pirates took a few on board for food', 'Paragraph B — disadvantage of tortoise populations', 'การล่าและทำลายประชากร'),
      3: s('In 1989, work began on a tortoise-breeding centre', 'Paragraph C — start of the conservation project', 'เริ่มโครงการอนุรักษ์'),
      4: s('Captive-bred tortoises can\'t be reintroduced into the wild until they\'re at least five years old', 'Paragraph D — importance of getting the timing right', 'ต้องรอให้ถึงอายุที่ปลอดภัย'),
      5: s('work out more ambitious reintroduction', 'Paragraph E — Planning a bigger idea', 'วางแผนย้ายครั้งใหญ่'),
      6: s('worked around the clock to prepare the young tortoises for transport', 'Paragraph F — carefully prepared operation', 'ดำเนินการอย่างพิถีพิถัน'),
      7: s('one tiny tortoise came across a fully grown giant', 'Paragraph G — Young meets old', 'เจอเต่าตัวใหญ่'),
      8: s('From the 17th century onwards, pirates took a few on board for food', 'ships used by pirates', 'โจรสลัด'),
      9: s('the tortoises were taken on board these ships to act as food supplies during long ocean passages', 'kept for food', 'อาหาร'),
      10: s('Sometimes, their bodies were processed into high-grade oil', 'used to produce oil', 'น้ำมัน'),
      11: s('when settlers came to the islands. They hunted the tortoises', 'hunted by settlers', 'ผู้บุกเบิก'),
      12: s('They also introduced alien species', 'not native species', 'สปีชีส์ต่างถิ่น'),
      13: s('that either prey on the eggs and young tortoises or damage or destroy their habitat', 'fed on eggs', 'ไข่')
    },
    2: {
      1: s('While people will always be prone to illness, the study of how geography affects our health could lead to the eradication of certain illnesses, and the prevention of others in the future', 'not all diseases totally eliminated', 'ไม่สามารถกำจัดทุกโรคได้'),
      2: s('the massive amounts of smog and pollution that cause asthma, lung problems, eyesight issues and more', 'physical conditions from human behaviour', 'สภาพทางกายจากมลพิษ'),
      3: s('work to create a clear way of categorizing illnesses, diseases and epidemics into local and global scales', 'classifying diseases geographically', 'จำแนกตามขอบเขตภูมิศาสตร์'),
      4: s('there is often a very large discrepancy between the options available to people in different social classes, income brackets, and levels of education', 'access to healthcare varies', 'ความไม่เท่าเทียมในการเข้าถึงบริการ'),
      5: s('Health geography is the combination of, on the one hand, knowledge regarding geography and methods used to analyse and interpret geographical information, and on the other, the study of health, diseases and healthcare practices', 'mixture of academic fields', 'ผสานสองสาขาวิชา'),
      6: s('Malaria is much less of a problem in high-altitude deserts, for instance', 'area where illness is rare', 'พื้นที่ที่โรคหายาก'),
      7: s('improvements in vaccinations and the availability of healthcare', 'better vaccinations and healthcare', 'วัคซีน'),
      8: s('super-viruses and other infections resistant to antibiotics are becoming more and more common', 'antibiotics losing usefulness', 'ยาปฏิชีวนะ'),
      9: s('tropical regions that foster a warm and damp environment in which the mosquitos that can give people this disease can grow', 'disease-causing mosquitoes', 'ยุง'),
      10: s('factories that run on coal power', 'factories burning coal', 'โรงงาน'),
      11: s('the cutting down of forests to allow for the expansion of big cities', 'impact on nearby forests', 'ป่า'),
      12: s('diseases like polio are re-emerging', 'disease growing after eradicated', 'โรคโปลิโอ'),
      13: s('it may be very difficult for people to get medical attention because there is a mountain between their village and the nearest hospital', 'physical barrier mountain', 'ภูเขา')
    }
  },
  4: {
    1: {
      1: s('a type of natural glass – obsidian', 'material called obsidian', 'ออบซิเดียน'),
      2: s('was first used as tips for spears', 'sharp points of spears', 'หอก'),
      3: s('glazes used for coating stone beads', 'stone beads covered in glass', 'ลูกปัด'),
      4: s('highly coloured due to the impurities of the raw material', 'coloured because of impurities', 'สิ่งเจือปน'),
      5: s('they guarded the skills and technology required to make glass very closely, and it was not until their empire collapsed in 476 AD', 'only the Romans knew', 'ชาวโรมัน'),
      6: s('by introducing lead to the raw materials used in the process', 'process using lead', 'ตะกั่ว'),
      7: s('to counter the effect of clouding that sometimes occurred in blown glass', 'avoid clouding', 'ขุ่นมัว'),
      8: s('heavy taxes had been placed on the amount of glass melted in a glasshouse', 'laws concerning taxes', 'ภาษี'),
      9: s('more than three times quicker than any previous production method', 'fastest machine at the time', 'เร็วกว่าวิธีเดิมมาก'),
      10: s('developed in the USA by Michael Owens – founder of the Owens Bottle Machine Company', 'hired by a large US company', 'เขาเป็นผู้ก่อตั้ง ไม่ใช่ลูกจ้าง'),
      11: s('It has become a modern, hi-tech industry operating in a fiercely competitive global market', 'most glass by large international manufacturers', 'ไม่ได้ระบุว่าผลิตโดยบริษัทใหญ่ส่วนใหญ่'),
      12: s('with growing consumer concern for green issues, glass bottles and jars are becoming ever more popular', 'increased demand for glass containers', 'ความต้องการเพิ่มขึ้น'),
      13: s('As less energy is needed to melt recycled glass than to melt down raw materials', 'more expensive to produce recycled glass', 'รีไซเคิลถูกกว่า')
    },
    2: {
      1: s('it would bring forward the tassel-eared cat\'s estimated extinction date by roughly 5,000 years', 'survived longer than thought', 'อยู่ในอังกฤษนานกว่าที่คิด'),
      2: s('creating niches for hundreds of species that might otherwise struggle to survive', 'increase biodiversity', 'เพิ่มความหลากหลายทางชีวภาพ'),
      3: s('It has tried to preserve the living world as if it were a jar of pickles', 'misguided approach', 'แนวทางผิดพลาด'),
      4: s('This policy would also greatly boost catches in the surrounding seas', 'practical benefits for fishing industry', 'ประโยชน์ต่ออุตสาหกรรมประมง'),
      5: s('it helps to create a more inspiring vision than the green movement\'s usual promise', 'positive message more appealing', 'ข้อความเชิงบวกน่าดึงดูด'),
      6: s('there is no known instance of one preying on people', 'humans in danger', 'มนุษย์'),
      7: s('It is a specialist predator of roe deer, a species that has exploded in Britain in recent decades', 'wild animals', 'สัตว์ป่า'),
      8: s('presents little risk to sheep and other livestock', 'farm animals', 'ปศุสัตว์'),
      9: s('bringing forests back to parts of our bare and barren uplands', 'return native trees', 'ต้นไม้/ป่า'),
      10: s('There is nothing extraordinary about these proposals, seen from the perspective of anywhere else in Europe', 'first European country', 'ไม่ใช่ประเทศแรกในยุโรป'),
      11: s('The European population has tripled since 1970 to roughly 10,000', 'exceeded expectations', 'ไม่ได้เปรียบเทียบกับความคาดหวัง'),
      12: s('the lynx has been able to spread as farming has left the hills', 'agricultural practices extended habitat', 'การเกษตรเปลี่ยนทำให้ที่อยู่อาศัยขยาย'),
      13: s('it is more lucrative to protect charismatic wildlife than to hunt it, as tourists will pay for the chance to see it', 'commercial advantages', 'ท่องเที่ยวทำเงินได้')
    }
  },
  5: {
    1: {
      1: s('participating businesses were able to update the details they gave on a regular basis', 'update information regularly', 'อัปเดตข้อมูล'),
      2: s('the effect of each business on the environment was considered', 'impact on the environment', 'สิ่งแวดล้อม'),
      3: s('an interview with former New Zealand All Blacks rugby captain Tana Umaga', 'former sports captain', 'กัปตันทีม'),
      4: s('locations chosen for blockbuster films which had made use of New Zealand\'s stunning scenery as a backdrop', 'locations used in films', 'ภาพยนตร์'),
      5: s('highlighting different routes according to the season and indicating distances and times', 'varied depending on the season', 'ฤดูกาล'),
      6: s('There were also links to accommodation in the area', 'local accommodation', 'ที่พัก'),
      7: s('anyone could submit a blog of their New Zealand travels for possible inclusion on the website', 'link to their blog', 'บล็อก'),
      8: s('The website was set up to allow both individuals and travel organisations to create itineraries and travel packages to suit their own needs and interests', 'ready-made itineraries and packages', 'ให้สร้างเอง ไม่ใช่สำเร็จรูป'),
      9: s('visitors can search for activities not solely by geographical location, but also by the particular nature of the activity', 'most visitors started by geographical location', 'ไม่ได้บอกว่าส่วนใหญ่เริ่มจากพื้นที่'),
      10: s('activities are the key driver of visitor satisfaction, contributing 74% to visitor satisfaction, while transport and accommodation account for the remaining 26%', '26% related to accommodation', '26% รวมการเดินทางและที่พัก'),
      11: s('visitors enjoy cultural activities most when they are interactive, such as visiting a marae (meeting ground) to learn about traditional Maori life', 'involved in the local culture', 'ชอบมีส่วนร่วมวัฒนธรรม'),
      12: s('New Zealand is a small country with a visitor economy composed mainly of small businesses', 'prefer small hotels over larger ones', 'ไม่ได้เปรียบเทียบโรงแรมเล็กกับใหญ่'),
      13: s('most visitors stay for longer (average 20 days) and want to see as much of the country as possible on what is often seen as a once-in-a-lifetime visit', 'unlikely they will return', 'มักเป็นทริปครั้งเดียวในชีวิต')
    },
    2: {
      1: s('defining boredom so that it can be studied in the lab has proved difficult', 'Paragraph A — Problems with a scientific approach', 'ปัญหาวิธีวิทยาศาสตร์'),
      2: s('identified five distinct types: indifferent, calibrating, searching, reactant and apathetic', 'Paragraph B — system of classification', 'จำแนกประเภทความเบื่อ'),
      3: s('Mann has found that being bored makes us more creative', 'Paragraph C — productive outcomes', 'ผลดีจากความเบื่อ'),
      4: s('boredom can still be toxic if allowed to fester', 'Paragraph D — potential danger', 'อันตรายที่อาจเกิด'),
      5: s('those who bore easily face poorer prospects in education, their career and even life in general', 'Paragraph E — Identifying those most affected', 'กลุ่มที่ได้รับผลกระทบ'),
      6: s('leave our phones alone, and use boredom to motivate us to engage with the world in a more meaningful way', 'Paragraph F — new explanation and cure', 'ทางออกใหม่'),
      7: s('boredom may protect them from "infectious" social situations', 'Peter Toohey — avoid an unpleasant experience', 'หลีกเลี่ยงสังคม'),
      8: s('the most damaging is \'reactant\' boredom with its explosive combination of high arousal and negative emotion', 'Thomas Goetz — one sort worse than all others', 'ชนิดที่แย่ที่สุด'),
      9: s('your efforts to improve the situation can end up making you feel worse', 'John Eastwood — coping can increase negative effects', 'พยายามรับมือยิ่งแย่'),
      10: s('our over-connected lifestyles might even be a new source of boredom', 'Francoise Wemelsfelder — way we live today', 'วิถีชีวิตปัจจุบัน'),
      11: s('This causes an inability to focus on anything', 'cannot focus', 'โฟกัส'),
      12: s('People who are motivated by pleasure seem to suffer particularly badly', 'pleasure important aim', 'ความสุข'),
      13: s('curiosity, are associated with a high boredom threshold', 'characteristic curiosity', 'ความอยากรู้')
    }
  }
}
