import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

/** Local question numbers before journey remap (P1: 1–14, P2: 1–13). */
type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_1_5: Record<number, StageSolutions> = {
  1: {
    1: {
      1: s('sudden disappearance of worker bees', 'never recorded any mass disappearance before 2006', 'ไม่ได้บอกว่าเคยมีเหตุการณ์แบบนี้มาก่อนหรือไม่'),
      2: s('No dead bodies were found near the hives', 'absence of dead bees made diagnosis difficult', 'ไม่มีซากผึ้ง จึงวินิจฉัยยาก'),
      3: s('multiple pesticides simultaneously', 'simultaneous exposure worsens the effect', 'สัมผัสหลายสารพร้อมกันทำให้ผลรุนแรงขึ้น'),
      4: s('first detected in Europe in the 1970s', 'originally discovered in Asia', 'ไม่ได้กล่าวว่ามีต้นกำเนิดในเอเชีย'),
      5: s('Resistance to these treatments is increasing', 'chemical treatments becoming less effective', 'ไรเริ่มดื้อต่อยารักษา'),
      6: s('single type of pollen', 'less varied diet in monoculture areas', 'ได้อาหารหลากหลายน้อยลง'),
      7: s('dependent on commercial beekeeping operations', 'alternative pollination methods', 'ไม่ได้กล่าวถึงวิธีผสมเกสรทางเลือก'),
      8: s('Colony Collapse Disorder', 'Colony Collapse Disorder', 'โรค/ความผิดปกติของอาณานิคม (CCD)'),
      9: s('neonicotinoids', 'neonicotinoids', 'นิโอนิโคตินอยด์ (สารกำจัดแมลง)'),
      10: s('Varroa mite', 'Varroa mite', 'ไรวาโรอา'),
      11: s('Deformed Wing Virus', 'Deformed Wing Virus', 'ไวรัส Deformed Wing'),
      12: s('monoculture fields', 'monoculture farming', 'การปลูกพืชชนิดเดียว'),
      13: s('flowers provide nectar', 'nectar production', 'น้ำหวาน'),
      14: s('pollinator-dependent crops', 'pollinator-dependent crops', 'พืชที่พึ่งผู้ช่วยผสมเกสร')
    },
    2: {
      1: s('extraordinary mental ability from childhood', 'Paragraph A', 'ความเก่งตั้งแต่เด็กและเรียนไม่จบ'),
      2: s('sudden vision of a rotating magnetic field', 'Paragraph B', 'แรงบันดาลใจที่เปลี่ยนประวัติศาสตร์ไฟฟ้า'),
      3: s('Edison reportedly promised… refused to pay', 'Paragraph C', 'ข้อพิพาทเรื่องค่าจ้างกับ Edison'),
      4: s('won the War of Currents', 'Paragraph D', 'ชัยชนะสาธารณะของกระแสสลับ (AC)'),
      5: s('extended well beyond electrical power', 'Paragraph E', 'ความทะเยอทะยานเกินกว่าเรื่องไฟฟ้า'),
      6: s('financial failure and professional isolation', 'Paragraph F', 'ล้มเหลว ยากจน และจากไปอย่างโดดเดี่ยว'),
      7: s('dramatic reversal in the decades following his death', 'Paragraph G', 'ได้รับการยอมรับหลังเสียชีวิต'),
      8: s('suspected was a form of cheating', 'teachers suspicious of dishonest behaviour', 'ครูสงสัยว่าโกง'),
      9: s('claiming the offer had been a joke', 'influenced by business partners', 'ไม่ได้กล่าวว่า Edison ฟังคำแนะนำหุ้นส่วน'),
      10: s('predated and superseded those of Guglielmo Marconi', 'Tesla radio patents registered before Marconi', 'สิทธิบัติวิทยุของ Tesla มีก่อน Marconi'),
      11: s('harness the power of Niagara Falls', 'dominant form of electrical power', 'พลังงานไฟฟ้า'),
      12: s('Niagara Falls', 'Niagara Falls', 'น้ำตกไนแองการา'),
      13: s('world wireless communication', 'global wireless communication', 'การสื่อสารไร้สาย')
    }
  },
  2: {
    1: {
      1: s('such as a shark tooth or fragment of volcanic rock', 'always form around volcanic rock', 'ไม่ได้ก่อตัวรอบหินภูเขาไฟเท่านั้น'),
      2: s('human rights conditions under which mining occurs', 'ethical concerns about cobalt extraction in the DRC', 'เงื่อนไขสิทธิมนุษยชนในที่ทำเหมือง'),
      3: s('identified over 5,000 species', 'researchers believed very few organisms before 2019', 'ไม่ได้กล่าวว่าก่อนสำรวจ 2019 คิดว่ามีสิ่งมีชีวิตน้อย'),
      4: s('biodiversity had not meaningfully recovered', 'no significant return of biodiversity after five decades', 'ความหลากหลายทางชีวภาพยังไม่ฟื้นอย่างมีนัยสำคัญ'),
      5: s('declined to approve commercial extraction', 'granted permission for commercial mining', 'ยังไม่อนุมัติให้ขุดเชิงพาณิชย์'),
      6: s('commissioned by one major mining operator', 'reviewed by an independent scientific body', 'ไม่ได้กล่าวว่ามีการตรวจสอบโดยหน่วยงานอิสระ'),
      7: s('moratorium on commercial extraction until a fairer benefit-sharing framework', 'delaying extraction until revenue-sharing is fairer', 'ขอหยุดชั่วคราวจนกว่าจะแบ่งปันผลประโยชน์อย่างเป็นธรรม'),
      8: s('potato-sized nodules', 'rounded nodules', 'ก้อนแร่กลม'),
      9: s('global energy transition', 'energy transition', 'การเปลี่ยนผ่านด้านพลังงาน'),
      10: s('5,000 species', 'species living around mineral deposits', 'สปีชีส์'),
      11: s('Recovery timescales', 'recovery after disturbance', 'การฟื้นตัว'),
      12: s('common heritage of mankind', 'heritage of all humanity', 'มรดกร่วมของมนุษยชาติ'),
      13: s('most advanced deep-sea technology', 'superior technology', 'เทคโนโลยี'),
      14: s('battery metals', 'battery metals', 'โลหะสำหรับแบตเตอรี่')
    },
    2: {
      1: s('denied legal rights', 'Paragraph A', 'ถูกตัดสิทธิทางกฎหมายเพราะเข้าใจผิด'),
      2: s('first systematic attempt to educate deaf children', 'Paragraph B', 'ความพยายามแรกในการสอนคนหูหนวก'),
      3: s('home signs… built upon their natural gestures', 'Paragraph C', 'ภาษามือที่ใช้กันจริงกลายเป็นฐานการสอน'),
      4: s('fusion of French Sign Language and… home signs', 'Paragraph D', 'ผสานภาษามือฝรั่งเศสกับภาษามือท้องถิ่น'),
      5: s('sign language was banned in most schools', 'Paragraph E', 'มติมิลานที่ห้ามใช้ภาษามือในโรงเรียน'),
      6: s('William Stokoe published research', 'Paragraph F', 'งานวิจัยที่พลิกความเข้าใจเรื่องภาษามือ'),
      7: s('grant official recognition to its national sign language', 'Paragraph G', 'การยอมรับภาษามืออย่างเป็นทางการในหลายประเทศ'),
      8: s('Rather than attempting to replace their existing system', 'replaced the sisters\' signing system completely', 'ไม่ได้แทนที่ระบบของพี่น้องด้วยระบบใหม่ทั้งหมด'),
      9: s('refused to share their techniques', 'refused assistance by British educators', 'ครูอังกฤษปฏิเสธให้ความช่วยเหลือ'),
      10: s('the Milan resolution', 'formally reversed by a later conference', 'ไม่ได้กล่าวว่ามีการยกเลิกมติในภายหลัง'),
      11: s('denied legal rights', 'fundamental rights', 'สิทธิ'),
      12: s('Milan resolution', 'Milan resolution of 1880', 'มติมิลาน'),
      13: s('complete, independent language', 'genuine language', 'ภาษา')
    }
  },
  3: {
    1: {
      1: s('largely rejected by researchers', 'caused by poor time management', 'ไม่ใช่เพราะจัดการเวลาไม่เก่ง'),
      2: s('associated with anxiety, self-doubt, boredom, or resentment', 'tasks that cause uncomfortable emotions', 'เลื่อนงานที่ทำให้รู้สึกไม่สบายใจ'),
      3: s('Florida State University', 'took place across multiple universities', 'ไม่ได้กล่าวว่าทำหลายมหาวิทยาลัย'),
      4: s('forgave themselves for procrastinating on the first exam', 'lenient with themselves after one exam', 'ให้อภัยตัวเองแล้วเลื่อนน้อยลงในสอบครั้งถัดไป'),
      5: s('Only the maladaptive form is reliably associated with procrastination', 'all types of perfectionism linked to avoidance', 'ไม่ใช่ทุกแบบของความพยายามให้สมบูรณ์แบบ'),
      6: s('in some contexts but not others', 'consistently reduced procrastination in all settings', 'ลดได้บางบริบท ไม่ใช่ทุกกรณี'),
      7: s('identify and challenge the underlying beliefs', 'focus on beliefs that support avoidance', 'แก้ความเชื่อที่ทำให้หลบเลี่ยง'),
      8: s('tasks that generate negative emotion', 'emotion management', 'อารมณ์'),
      9: s('temporary good feeling', 'good feeling from avoidance', 'ความรู้สึกดีชั่วคราว'),
      10: s('self-compassion', 'self-compassion', 'ความเมตตาต่อตนเอง'),
      11: s('Implementation intentions', 'implementation intentions', 'แผนปฏิบัติที่ผูกสถานการณ์กับการกระทำ'),
      12: s('maladaptive perfectionism', 'maladaptive perfectionism', 'ความพยายามให้สมบูรณ์แบบแบบไม่เหมาะสม'),
      13: s('fundamental inadequacy', 'personal inadequacy', 'ความรู้สึกว่าตัวเองไม่ดีพอ'),
      14: s('in some contexts but not others', 'context in which it occurs', 'บริบท')
    },
    2: {
      1: s('returned… to his laboratory at St Mary\'s Hospital', 'Paragraph A', 'การค้นพบบังเอิญในห้องแล็บ'),
      2: s('attracted little interest', 'Paragraph B', 'ผลงานแรกไม่ได้รับความสนใจ'),
      3: s('All four treated mice survived', 'Paragraph C', 'การทดลองที่ให้ผลชัดเจน'),
      4: s('demonstrated, conclusively, that the drug could fight infection in humans', 'Paragraph D', 'รักษาไม่ครบแต่พิสูจน์ว่าใช้ได้กับคน'),
      5: s('fermenting penicillin in corn steep liquor', 'Paragraph E', 'ขยายการผลิตด้วยนวัตกรรมจากการเกษตร'),
      6: s('dramatically reduced wound infection fatalities', 'Paragraph F', 'ลดการเสียชีวิตจากแผลติดเชื้อในสงคราม'),
      7: s('Fleming received the most public attention', 'Paragraph G', 'เครดิตไม่เท่ากันแม้ได้รางวัลร่วมกัน'),
      8: s('unable to isolate or stabilise the active compound', 'could not produce a form usable on people', 'ยังแยกสารบริสุทธิ์ไม่ได้ จึงทดสอบกับคนไม่ได้'),
      9: s('fled Nazi Germany in 1933', 'left Germany before Fleming\'s 1929 paper', 'ตอนตีพิมพ์ 1929 Chain ยังอยู่เยอรมนี'),
      10: s('not yet produced enough penicillin to complete a full course', 'enough to treat several patients simultaneously', 'ไม่ได้กล่าวว่ารักษาหลายคนพร้อมกันได้หรือไม่'),
      11: s('his laboratory at St Mary\'s Hospital', 'laboratory in London', 'ห้องปฏิบัติการ'),
      12: s('corn steep liquor', 'corn steep liquor', 'ของเหลวจากข้าวโพด'),
      13: s('Military medical historians', 'medical historians', 'นักประวัติศาสตร์การแพทย์ทหาร')
    }
  },
  4: {
    1: {
      1: s('roughly four to one in the 1980s', 'house prices about four times average income in the 1980s', 'ราคาบ้านต่อรายได้ประมาณ 4 เท่า'),
      2: s('operated by existing homeowners', 'zoning designed to benefit new residents', 'กฎจัดโซนเอื้อเจ้าของบ้านเดิม ไม่ใช่คนใหม่'),
      3: s('foreign ownership accounts for less than 3%', 'examined data from over twenty cities', 'ไม่ได้ระบุจำนวนเมืองที่ศึกษา'),
      4: s('building more homes will not reduce prices in desirable areas', 'more homes will not make housing affordable in popular areas', 'สร้างเพิ่มไม่ทำให้ราคาถูกลงในพื้นที่ยอดนิยม'),
      5: s('replacement construction never matched the rate of sales', 'required councils to reinvest sale proceeds', 'ไม่ได้กล่าวว่าต้องนำเงินขายไปสร้างทดแทน'),
      6: s('reducing construction costs by an estimated 15 to 20 percent', 'lower building costs by 15–20% in some European countries', 'ลดต้นทุนก่อสร้าง 15–20%'),
      7: s('Political obstacles are considerable', 'reducing prices would be politically straightforward', 'ลดราคาบ้านไม่ง่ายทางการเมือง'),
      8: s('reduced labour mobility', 'labour mobility', 'การเคลื่อนย้ายแรงงาน'),
      9: s('housing supply has failed to keep pace', 'insufficient supply', 'อุปทานที่อยู่อาศัย'),
      10: s('Restrictive zoning laws', 'zoning laws', 'กฎจัดโซนที่อยู่อาศัย'),
      11: s('financialisation of housing', 'financialisation', 'การทำให้ที่อยู่อาศัยเป็นสินทรัพย์การเงิน'),
      12: s('Right to Buy scheme', 'Right to Buy scheme', 'โครงการ Right to Buy'),
      13: s('modular factories', 'modular factories', 'โรงงานประกอบบ้านสำเร็จรูป'),
      14: s('regulation of speculative investment', 'investment regulation', 'การกำกับการลงทุนเชิงเก็งกำไร')
    },
    2: {
      1: s('sparking controversy about credit, data access, and the commercialisation', 'Paragraph A', 'ประกาศยิ่งใหญ่แต่มีข้อโต้แย้งเรื่องเครดิต'),
      2: s('viewed by many researchers as hubristic and technically impossible', 'Paragraph B', 'แนวคิดที่เคยถูกมองว่าเป็นไปไม่ได้'),
      3: s('prevent any single institution from claiming ownership', 'Paragraph C', 'หลักการเปิดข้อมูลให้ใช้ร่วมกัน'),
      4: s('dramatically accelerated the public project\'s timeline', 'Paragraph D', 'บริษัทเอกชนเร่งจังหวะโครงการของภาครัฐ'),
      5: s('neither draft was truly complete — both contained gaps and errors', 'Paragraph E', 'ประกาศเสร็จแต่ลำดับยังไม่สมบูรณ์'),
      6: s('partially fulfilled', 'Paragraph F', 'ประโยชน์ทางการแพทย์ได้บางส่วน'),
      7: s('whether employers, insurers, or governments should have access', 'Paragraph G', 'ใครควรเข้าถึงข้อมูลพันธุกรรม'),
      8: s('dispute over patent policy', 'disagreement over intellectual property approach', 'ข้อขัดแย้งเรื่องนโยบายสิทธิบัตร'),
      9: s('Celera Genomics', 'made sequence data available at no charge', 'ไม่ได้กล่าวว่า Celera เปิดข้อมูลฟรี'),
      10: s('mapped with precision, enabling improved diagnostic tests', 'more accurate identification of single-gene disorders', 'วินิจฉัยโรคยีนเดียวได้แม่นยำขึ้น'),
      11: s('complete sequence of the human genome', 'DNA sequence', 'ลำดับ DNA'),
      12: s('public database', 'public database', 'ฐานข้อมูลสาธารณะ'),
      13: s('thousands of genetic variants', 'genetic variants', 'ลักษณะย่อยทางพันธุกรรม')
    }
  },
  5: {
    1: {
      1: s('temporarily destabilised and then reconsolidated', 'memory briefly enters a changeable state when recalled', 'ความจำเปลี่ยนแปลงได้ชั่วคราวเมื่อถูกเรียกขึ้น'),
      2: s('medial temporal lobe', 'hippocampus in the same region as the cerebellum', 'ไม่ได้กล่าวถึงสมองน้อย (cerebellum)'),
      3: s('prevent the formation of new long-term memories entirely', 'unable to form new long-lasting memories', 'สร้างความจำระยะยาวใหม่ไม่ได้'),
      4: s('sounds associated with learned material', 'visual stimuli during sleep', 'ใช้เสียง ไม่ใช่ภาพ'),
      5: s('releasing stress hormones including noradrenaline', 'noradrenaline helps make memories stronger', 'ฮอร์โมนความเครียดช่วยให้จำได้แรงขึ้น'),
      6: s('In a landmark series of studies, Loftus showed', 'first to show eyewitness memory could be influenced', 'ไม่ได้ระบุว่าเป็นครั้งแรกในประวัติศาสตร์'),
      7: s('Approximately 25% of participants', 'about one quarter believed fabricated events happened', 'ประมาณ 1 ใน 4 เชื่อว่าเหตุการณ์นั้นเกิดจริง'),
      8: s('Reconsolidation', 'reconsolidation', 'การสร้างความจำใหม่หลังถูกเรียก'),
      9: s('process called consolidation', 'consolidation', 'การรวมความจำระยะยาว'),
      10: s('the hippocampus', 'hippocampus', 'ฮิปโปแคมปัส'),
      11: s('slow-wave sleep', 'slow-wave sleep', 'การนอนหลับลึก (slow-wave)'),
      12: s('emotional intensity does not guarantee accuracy', 'emotional intensity', 'ความเข้มข้นทางอารมณ์'),
      13: s('broken glass at the scene', 'broken glass', 'กระจก'),
      14: s('false memories can be deliberately implanted', 'false memories', 'ความจำเท็จ')
    },
    2: {
      1: s('politically neutral, belonging to no single nation', 'Paragraph A', 'ภาษากลางที่ไม่เอื้อชาติใดชาติหนึ่ง'),
      2: s('entire grammar could be summarised in sixteen rules', 'Paragraph B', 'ไวยากรณ์เรียบง่าย เรียนได้เร็ว'),
      3: s('passionate global community in the early twentieth century', 'Paragraph C', 'ชุมชนที่แพร่หลายทั่วโลก'),
      4: s('arrested, sent to labour camps, or executed', 'Paragraph D', 'ชุมชนถูกล่าอาวรณ์เพราะอุดมการณ์ของรัฐ'),
      5: s('proposal was rejected, largely at the insistence of France', 'Paragraph E', 'ถูกปฏิเสธบทบาทภาษาสากล'),
      6: s('overall number of fluent speakers has not grown proportionately', 'Paragraph F', 'อินเทอร์เน็ตช่วยแต่จำนวนผู้ใช้คล่องแคล่วไม่โตตาม'),
      7: s('inherent flaws in the project or simply the contingency of historical events', 'Paragraph G', 'ล้มเหลวเพราะข้อบกพร่องหรือโชคชะตาทางประวัติศาสตร์'),
      8: s('Doktoro Esperanto," meaning "one who hopes"', 'pseudonym to protect from medical criticism', 'ไม่ได้อธิบายเหตุผลที่ใช้นามแฝง'),
      9: s('internationalism with deep suspicion', 'persecution linked to opposition to nationalism', 'ถูกล่าอาวรณ์เพราะลัทธิสากลขัดกับชาตินิยม'),
      10: s('more than for some natural languages', 'more learners than any other Duolingo language', 'ไม่ได้บอกว่ามากกว่าทุกภาษาใน Duolingo'),
      11: s('belonging to no single nation', 'single nation', 'ชาติ'),
      12: s('systematic campaign of persecution', 'severe persecution', 'การล่าอาวรณ์'),
      13: s('first language', 'first language', 'ภาษา')
    }
  }
}
