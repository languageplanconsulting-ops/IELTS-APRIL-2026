import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

/** Local question numbers 1–13 per passage (before journey remap to 1–13 / 14–26). */
type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_11_15: Record<number, StageSolutions> = {
  11: {
    1: {
      1: s('Pleistocene Park project', 'experimental land management project', 'โครงการจัดการที่ดินทดลอง'),
      2: s('87 times more potent', 'methane greater concern than carbon dioxide', 'มีฤทธิ์ร้อนแรงกว่า CO₂'),
      3: s('western Siberia', 'regions most at risk of thawing', 'ไซบีเรียตะวันตก'),
      4: s('stop adding to the warming', 'only effective way is to reduce emissions', 'หยุดเพิ่มการอุ่นขึ้น'),
      5: s('organic remains', 'organic remains of plants and animals', 'ซากพืชและสัตว์'),
      6: s('permafrost soils', 'accumulated in permafrost soils', 'ดินเยือกแข็ง'),
      7: s('billion tonnes', '1,500 billion tonnes of carbon', 'ตัน'),
      8: s('atmosphere', 'double the quantity in the atmosphere', 'ชั้นบรรยากาศ'),
      9: s('substantial and self-reinforcing', 'small methane release could cause substantial warming', 'ทำให้อุ่นขึ้นเรื่อยๆ'),
      10: s('increased measurably', 'methane from thawing lakes increased', 'เพิ่มขึ้นอย่างวัดได้'),
      11: s('unprecedented in the observational record', 'speed of change has no historical precedent', 'ไม่เคยมีมาก่อนในบันทึก'),
      12: s('rapid and deep cuts', 'requires deep rapid reductions in emissions', 'ลดการปล่อยอย่างรวดเร็ว'),
      13: s('amplified warming on the planet', 'significant source of amplified warming', 'การอุ่นที่ทวีความรุนแรง')
    },
    2: {
      1: s('impermeable surfaces', 'physical processes that make cities hotter', 'พื้นผิวไม่ระบายน้ำ'),
      2: s('disproportionate burden', 'health burden not shared equally', 'ภาระไม่เท่ากัน'),
      3: s('Rotterdam\'s water squares', 'dual-purpose water infrastructure in a European city', 'จัตุรัสน้ำรอตเตอร์ดัม'),
      4: s('1 and 4 degrees Celsius', 'cooling effect of strategically planted trees', 'ลดอุณหภูมิ 1–4°C'),
      5: s('impermeable surfaces', 'dark impermeable surfaces absorb heat', 'พื้นผิว'),
      6: s('absence of vegetation', 'absence of vegetation', 'พืชพรรณ'),
      7: s('draw moisture from the soil', 'drawing moisture from the soil', 'ความชื้น'),
      8: s('waste heat', 'waste heat from air conditioning', 'ความร้อน'),
      9: s('rising faster than mortality from any other weather-related cause', 'heat-related deaths increasing faster', 'อัตราการเสียชีวิตจากความร้อน'),
      10: s('between 5 and 12 degrees Celsius', 'hottest and coolest parts differ by more than ten degrees', '5–12 องศา'),
      11: s('between 1 and 4 degrees Celsius', 'trees lower local air temperatures up to four degrees', '1–4 องศา'),
      12: s('up to 20%', 'reflective rooftops could reduce energy use by a fifth', '20%'),
      13: s('justice problem', 'treating urban heat as social equity', 'ความเท่าเทียมทางสังคม')
    }
  },
  12: {
    1: {
      1: s('600 million and 1.8 billion tonnes', 'quantity of carbon kelp may export annually', 'ปริมาณคาร์บอนต่อปี'),
      2: s('selectively breeding strains', 'techniques to restore kelp in a specific country', 'เทคนิคฟื้นฟูในประเทศ'),
      3: s('should not assume that kelp forests are a reliable global carbon sink', 'warning against assuming reliable carbon sequestration', 'อย่าสมมติว่าเป็นที่เก็บคาร์บอนที่เชื่อถือได้'),
      4: s('justified on multiple grounds regardless of the carbon sequestration debate', 'restoring kelp worthwhile regardless of carbon uncertainty', 'คุ้มค่าแม้ไม่แน่ใจเรื่องคาร์บอน'),
      5: s('multi-layered canopy', 'multi-layered canopy shelters species', 'เรือนยอดชั้น'),
      6: s('marine mammals', 'marine mammals find shelter', 'สัตว์เลี้ยงลูกด้วยนม'),
      7: s('nursery grounds', 'nursery grounds for commercial fish', 'พื้นที่เลี้ยงลูก'),
      8: s('wave energy', 'absorbs wave energy before the shore', 'คลื่น'),
      9: s('over 95% of the state\'s giant kelp forest has been lost', 'more than nineteen-twentieths of kelp lost', 'สูญหายมากกว่า 95%'),
      10: s('decomposed relatively quickly', 'carbon may decompose in shallow water', 'ย่อยสลายในที่ตื้น'),
      11: s('do not need to wait for certainty on carbon', 'restoration justified by biodiversity alone', 'ความหลากหลายทางชีวภาพ'),
      12: s('export between 600 million and 1.8 billion tonnes', 'transport carbon to the deep ocean annually', 'ขนถ่ายคาร์บอนไปมหาสมุทร'),
      13: s('much better data on what happens to kelp carbon', 'better data needed on fate of kelp carbon', 'ต้องการข้อมูลที่ดีกว่า')
    },
    2: {
      1: s('cannot bind effectively in concrete', 'why desert sand cannot be used in construction', 'ทรายทะเลทรายใช้ในคอนกรีตไม่ได้'),
      2: s('sand mafias', 'criminal activity associated with illegal extraction', 'มาเฟียทราย'),
      3: s('delta erosion linked to upstream sand extraction', 'sand removal damages deltas and coastlines', 'การกัดเซาะในปากแม่น้ำ'),
      4: s('true cost of sand', 'sand needs an economic value reflecting extraction cost', 'ราคาที่สะท้อนต้นทุนจริง'),
      5: s('grains', 'grains rounded too smoothly', 'เม็ดทราย'),
      6: s('wind', 'rounded by wind', 'ลม'),
      7: s('Rivers', 'suitable sand must come from rivers', 'แม่น้ำ'),
      8: s('sandy beds', 'rivers naturally refill their sandy beds', 'ร่องทราย'),
      9: s('Until the true cost of sand', 'environmental cost must be included in price', 'ต้นทุนสิ่งแวดล้อมต้องอยู่ในราคา'),
      10: s('recycling demolition waste', 'systematic recycling could reduce demand for new sand', 'รีไซเคิลเศษการรื้อถอน'),
      11: s('documented delta erosion', 'sand removal linked to delta erosion', 'การกัดเซาะในปากแม่น้ำ'),
      12: s('regulation, recycling, substitution', 'requires regulation recycling and reduced consumption', 'กฎระเบียบ รีไซเคิล ลดการใช้'),
      13: s('quality consistency remains a challenge', 'quality consistency challenge for recycled aggregates', 'ความสม่ำเสมอของคุณภาพ')
    }
  },
  13: {
    1: {
      1: s('fatally attracted to artificial light sources', 'how light pollution affects insects', 'แมลงถูกดึงดูดด้วยแสง'),
      2: s('over 200 official dark sky parks', 'designated areas protecting natural darkness', 'อุทยานท้องฟ้ามืด'),
      3: s('associations between elevated light exposure at night', 'association between artificial light and health harms', 'ความสัมพันธ์กับโรค'),
      4: s('technology to light our cities effectively', 'technology exists barrier is political', 'เทคโนโลยีมีแล้ว อุปสรรคคือการเมือง'),
      5: s('Insects', 'many insects navigate by moonlight', 'แมลง'),
      6: s('moths', 'moths frequently killed by artificial light', 'ผีเสื้อกลางคืน'),
      7: s('insect populations', 'decline in insect populations', 'ประชากรแมลง'),
      8: s('seasonal migration', 'seasonal migration of birds disrupted', 'การอพยพของนก'),
      9: s('disrupts the human circadian rhythm', 'chronic night-time light disrupts sleep and hormones', 'รบกวนจังหวะชีวิต'),
      10: s('each generation accepts the diminished sky', 'each generation accepts darker sky as normal', 'ยอมรับท้องฟ้าที่มืดลง'),
      11: s('astrotourism', 'protected areas serve ecological and economic purposes', 'การท่องเที่ยวดูดาว'),
      12: s('barrier is not technical', 'reducing damage requires awareness and political will', 'ไม่ใช่ปัญหาเทคนิค'),
      13: s('creeping catastrophe', 'advances too gradually for most people to notice', 'ภัยที่คืบหน้าช้าๆ')
    },
    2: {
      1: s('faded from view', 'innovation whose moment had not yet arrived', 'ความนิยมชั่วคราวแล้วจางหาย'),
      2: s('boneshaker', 'arrival of pedal power at a cost', 'จักรยานเสียงดังไม่สบาย'),
      3: s('sacrificed safety for performance', 'speed achieved at the expense of accessibility', 'เน้นความเร็วมากกว่าความปลอดภัย'),
      4: s('made cycling truly accessible', 'safer design opens cycling to wider audience', 'ดีไซน์ปลอดภัยเปิดกว้างผู้ขี่'),
      5: s('tool of liberation', 'broader social change follows mass adoption', 'การเปลี่ยนแปลงทางสังคม'),
      6: s('rise of the motor car', 'replaced by a more powerful rival', 'ถูกแทนที่ด้วยรถยนต์'),
      7: s('brief fashionable popularity', 'enjoyed brief popularity before fading', 'ความนิยมชั่วคราว'),
      8: s('athleticism and a tolerance for injury', 'design required capability and willingness to accept injury', 'ต้องแข็งแรงและยอมรับอันตราย'),
      9: s('tool of liberation', 'contributed to social and political change', 'เครื่องมือปลดปล่อย / การเมือง'),
      10: s('Within a decade, the high-wheeler had been consigned to history', 'safety bicycle replaced penny-farthing within a decade', 'ภายในสิบปี'),
      11: s('Women and older riders were effectively excluded', 'women were not among enthusiastic penny-farthing riders', 'ผู้หญิงถูกตัดออก'),
      12: s('fallen to negligible levels', 'cycling not as popular for commuting as in the 1890s', 'สัดส่วนการใช้จักรยานต่ำมาก'),
      13: s('accessible to older riders and those with physical limitations', 'electric bicycles extended access for older riders', 'จักรยานไฟฟ้าช่วยผู้สูงอายุ')
    }
  },
  14: {
    1: {
      1: s('world-altering significance', 'extraordinary expectations before announcement', 'ความคาดหวังสูงมาก'),
      2: s('gyroscopes and tilt sensors', 'science behind seemingly effortless motion', 'ไจโรสโคปและเซ็นเซอร์'),
      3: s('Initial responses from cities, corporations and media were enthusiastic', 'cautious early trials by enthusiastic buyers', 'ตอบรับอย่างกระตือรือร้น'),
      4: s('did not survive contact with reality', 'reality fails to match pre-launch promise', 'ความจริงไม่ตรงคาด'),
      5: s('genuine, if narrow, niche', 'useful roles within specific sectors', 'บทบาทเฉพาะทาง'),
      6: s('died the following year in a tragic accident', 'ownership changes and tragic event', 'เปลี่ยนเจ้าของและอุบัติเหตุ'),
      7: s('mixture of fascination and bafflement', 'response combined interest with disappointment', 'สนใจแต่ผิดหวัง'),
      8: s('did not feel they had', 'addressed a need most people did not have', 'แก้ปัญหาที่คนส่วนใหญ่ไม่มี'),
      9: s('found applications in robotics, prosthetics', 'innovations applied in other products', 'นำไปใช้ในผลิตภัณฑ์อื่น'),
      10: s('bigger than the personal computer', 'linked to comparisons with major tech revolutions', 'เปรียบกับ PC'),
      11: s('discontinued in July 2020', 'not still in production after 2020', 'ยุติการผลิต 2020'),
      12: s('sold fewer than 10,000 units', 'most commuters did not choose Segway over walking', 'ขายได้น้อยมาก'),
      13: s('found applications in robotics', 'self-balancing technology used elsewhere', 'ใช้ในหุ่นยนต์และอื่นๆ')
    },
    2: {
      1: s('hormonal changes associated with physical maturation', 'biological phenomenon driven by puberty', 'การเปลี่ยนแปลงทางฮอร์โมน'),
      2: s('significant increase in school attendance rates', 'improvements in attendance and academic outcomes', 'การมาเรียนและผลการเรียน'),
      3: s('resistance is rarely about the science', 'opposition from practical constraints not science', 'อุปสรรคด้านปฏิบัติการ'),
      4: s('structurally embedded in how education systems are organised', 'chronic sleep loss produced by school timetables', 'โครงสร้างตารางเรียน'),
      5: s('34 minutes of additional sleep', 'students gained measurably more sleep', 'นอนเพิ่ม 34 นาที'),
      6: s('resistance is rarely about the science', 'difficulty lies with institutions not evidence', 'ติดที่สถาบัน'),
      7: s('public health issue hiding in plain sight', 'sleep deprivation a widely overlooked public health problem', 'ปัญหาสาธารณสุขที่มองข้าม'),
      8: s('should not start before 8.30am', 'schools should not begin before 8.30am', 'ไม่ควรเริ่มก่อน 8.30'),
      9: s('significant increase in school attendance rates', 'measurable significant attendance improvement', 'การมาเรียนเพิ่มขึ้นอย่างมีนัย'),
      10: s('observed in adolescents across different cultures', 'consistent across societies not modern lifestyle', 'สังเกตได้หลายวัฒนธรรม'),
      11: s('34 minutes of additional sleep', 'whether extra sleep from earlier bedtimes', 'ไม่ระบุว่านอนเร็วขึ้น'),
      12: s('not start before 8.30am', 'recommends not later than 7.30am', 'ไม่ใช่ 7.30'),
      13: s('persuading institutions designed around the needs of adults', 'barrier is reluctance to reorganise around students', 'สถาบันยึดความสะดวกผู้ใหญ่')
    }
  },
  15: {
    1: {
      1: s('commercial success has encouraged schools and universities', 'commercial success encouraged institutions', 'ความสำเร็จทางการค้าจูงให้สถาบันลองใช้'),
      2: s('suppress intrinsic motivation when the reward is removed', 'dependence on rewards reduces engagement', 'พึ่งรางวัลแล้วหยุดเมื่อรางวัลหาย'),
      3: s('harder than its commercial popularity might suggest', 'commercial popularity misleading about ease of benefits', 'ความนิยมทำให้ดูง่ายเกินจริง'),
      4: s('games are the only environments', 'games motivate voluntary hard work', 'เกมจูงใจให้ทำงานหนักโดยสมัครใจ'),
      5: s('deeply integrated with the learning content', 'game elements embedded in content not reward layer', 'ผสานกับเนื้อหาไม่ใช่แค่รางวัล'),
      6: s('engagement effect to diminish over time', 'engagement weakens as novelty diminishes', 'ความสนใจลดเมื่อความใหม่หมด'),
      7: s('extrinsic motivation', 'risks replacing genuine curiosity with rewards', 'แรงจูงใจภายนอกแทนความอยากรู้'),
      8: s('gateway to deeper engagement', 'can draw students toward deeper engagement', 'เปิดทางสู่การมีส่วนร่วมลึกขึ้น'),
      9: s('measurable improvements in student engagement', 'most studies found short-term engagement gains', 'พบว่าสนใจเพิ่มในระยะสั้น'),
      10: s('hundreds of millions of users', 'more users than any other ed-tech platform', 'ไม่ระบุว่ามากกว่าทุกแพลตฟอร์ม'),
      11: s('higher levels of motivation and engagement during gamified lessons', 'higher motivation during gamified lessons', 'แรงจูงใจสูงกว่าในบทเรียนเกมิฟาย'),
      12: s('extrinsic motivation rather than intrinsic motivation', 'does not argue gamification builds genuine interest', 'ไม่สร้างความสนใจแท้จริง'),
      13: s('motivational benefits of well-designed gamification are real', 'real benefits when designed with care', 'ประโยชน์จริงเมื่อออกแบบดี')
    },
    2: {
      1: s('exempts them from the legal obligation to provide benefits', 'classification avoids providing employment benefits', 'เลี่ยงภาระสวัสดิการ'),
      2: s('more pervasive than that exercised by a conventional manager', 'control more pervasive than human manager', 'ควบคุมเข้มกว่าหัวหน้ามนุษย์'),
      3: s('assessed in that context', 'claims should be evaluated given financial interests', 'ต้องประเมินในบริบทผลประโยชน์'),
      4: s('flexibility narrative is real for a meaningful minority', 'flexibility genuine for significant minority', 'ความยืดหยุ่นจริงสำหรับบางกลุ่ม'),
      5: s('constant, invisible and not subject to appeal', 'monitoring constant and cannot be challenged', 'ตรวจสอบตลอดและโต้แย้งไม่ได้'),
      6: s('earn below the national minimum wage', 'many earn less than minimum wage after expenses', 'รายได้ต่ำกว่าค่าจ้างขั้นต่ำ'),
      7: s('income inequality among gig workers is extreme', 'income differences extreme few earn well majority poorly', 'รายได้ไม่เท่ากันมาก'),
      8: s('every financial incentive to resist reclassification', 'platform claims need scrutiny due to financial interests', 'ผลประโยชน์ทางการเงน'),
      9: s('absence of fixed working hours represents a genuine advantage', 'students and parents benefit from no fixed hours', 'ไม่มีเวลาทำงานตายตัว'),
      10: s('exempts them from the legal obligation to provide benefits', 'classify as contractors to avoid benefits', 'จัดเป็นผู้รับจ้างอิสระ'),
      11: s('feel compelled to work long hours', 'majority prefer conventional employment', 'ไม่ระบุว่าอยากเป็นพนักงาน'),
      12: s('minimum wage protections and holiday pay', 'UK ruling entitled drivers to minimum wage and holiday', 'ค่าจ้างขั้นต่ำและวันหยุด'),
      13: s('genuine innovations that platform technology has brought', 'writer acknowledges genuine labour market innovations', 'มีนวัตกรรมจริงในตลาดแรงงาน')
    }
  }
}
